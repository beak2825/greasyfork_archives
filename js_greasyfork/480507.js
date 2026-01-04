// ==UserScript==
// @name         云开作业自动答题
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202311221507
// @description  云开作业(只答客观题) https://yunao.open.com.cn 自动答题脚本；先用任意帐号登陆 https://learn.open.com.cn 平台才能自动答题。
// @author       流浪的蛊惑
// @connect      learn.open.com.cn
// @match        *://*.open.com.cn/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480507/%E4%BA%91%E5%BC%80%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/480507/%E4%BA%91%E5%BC%80%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
function addXMLRequestCallback(callback){//监听请求
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){//监听发送
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
        XMLHttpRequest.prototype.wrappedSetRequestHeader=XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {//监听自定义主机头
            this.wrappedSetRequestHeader(header, value);
            if(!this.headers) {
                this.headers = {};
            }
            if(!this.headers[header]) {
                this.headers[header] = [];
            }
            this.headers[header].push(value);
        }
    }
}
function gGetData(url,item){
    GM_xmlhttpRequest({
        method: "get",
        url: url,
        onload: function(res){
            let data=JSON.parse(res.responseText);
            let choiceslist = data.data.Choices;
            let questionlist = new Array();
            let choicesIndex = [];
            choiceslist.forEach((iteam, index, array) =>{
                if (iteam.IsCorrect){
                    for(let i=0;i<item.I6.length;i++){
                        if(item.I6[i]==iteam.I2){
                            choicesIndex.push(i);
                            questionlist.push(iteam.I2);
                        }
                    }
                }
            });
            //直接定位当前试题
            let dom = document.querySelector("div[id='children" + item.I1 + "']");
            //点击答案
            let gr=dom.getElementsByClassName("el-radio-group")[0];
            if(gr==undefined){
                gr=dom.getElementsByClassName("el-checkbox-group")[0];
            }
            let st=0;
            choicesIndex.forEach((iteam, index, array) =>{
                if(gr.getElementsByTagName("input")[iteam].checked==false){
                    setTimeout(()=>{gr.getElementsByTagName("input")[iteam].click();},st);
                    st += 200 + Math.floor(Math.random() * 500);
                }
            });
        }
    });
}
//根据问题找出具体的id
function initquestion(question){
    //遍历试题
    let list = question.Items;
    list.forEach((item, index, array)=>{
        //调用答案接口
        let basturl = "https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?itemBankId=${itemBankId}&questionId=${questionId}";
        let itemBankId = item.I4;
        let questionId = item.I1;
        let rquurl = basturl.replace("${itemBankId}", itemBankId).replace("${questionId}", questionId);
        gGetData(rquurl,item);
    });
}
(function(){
    'use strict';
    addXMLRequestCallback(function(xhr){
        xhr.addEventListener("load",function(){
            if (xhr.readyState == 4 && xhr.status == 200){
                console.log(xhr.responseURL);
                if (xhr.responseURL.includes("yunao.open.com.cn/api/student/student-space-service/testExam/goDoExamine")){
                    let gdat=JSON.parse(xhr.responseText);
                    initquestion(JSON.parse(gdat.content.answerResult.paperData));
                }
            }
        });
    });
})();