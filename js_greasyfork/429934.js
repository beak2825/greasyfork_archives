// ==UserScript==
// @name         奥鹏入学测试自动答题
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202109161202
// @description  奥鹏入学测试 https://exam.open.com.cn 自动答题脚本；先用任意帐号登陆 https://learn.open.com.cn 平台才能自动答题。
// @author       流浪的蛊惑
// @match        *://*.open.com.cn/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429934/%E5%A5%A5%E9%B9%8F%E5%85%A5%E5%AD%A6%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/429934/%E5%A5%A5%E9%B9%8F%E5%85%A5%E5%AD%A6%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
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
                    for(let i=0;i<item.i6.length;i++){
                        if(item.i6[i]==iteam.I2){
                            choicesIndex.push(i);
                            questionlist.push(iteam.I2);
                        }
                    }
                }
            });
            //直接定位当前试题
            let dom = document.querySelector("div[id='item_" + item.i1 + "']");
            //点击答案
            choicesIndex.forEach((iteam, index, array) =>{
                console.log(dom.getElementsByClassName("question-options")[0]);
                dom.getElementsByClassName("question-options")[0].getElementsByTagName("li")[iteam].click();
            });
        }
    });
}
//根据问题找出具体的id
function initquestion(question){
    //遍历试题
    for(let i=0;i<question.sectionList.length;i++){
        let list = question.sectionList[i].questionList;
        list.forEach((item, index, array)=>{
            //调用答案接口
            let basturl = "https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?itemBankId=${itemBankId}&questionId=${questionId}";
            let itemBankId = item.i4;
            let questionId = item.i1;
            let rquurl = basturl.replace("${itemBankId}", itemBankId).replace("${questionId}", questionId);
            gGetData(rquurl,item);
        });
    }
}
(function(){
    'use strict';
    addXMLRequestCallback(function(xhr){
        xhr.addEventListener("load",function(){
            if (xhr.readyState == 4 && xhr.status == 200){
                console.log(xhr.responseURL);
                if (xhr.responseURL.includes("open.com.cn/v2/exam/paper")){//https://exam.open.com.cn/v2/exam/paper
                    initquestion(JSON.parse(xhr.responseText));
                }
            }
        });
    });
})();