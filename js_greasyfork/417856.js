// ==UserScript==
// @name         奥鹏作业自动答题
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202107042327
// @description  奥鹏作业自动答题脚本
// @author       流浪的蛊惑
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @match        *://*.open.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417856/%E5%A5%A5%E9%B9%8F%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/417856/%E5%A5%A5%E9%B9%8F%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var answerinfo=null;//答案暂存
var cls=new Array(0,0);//当前处理数,总处理数
var token=null;//试卷密钥
var workAnswerId=null;//试卷ID
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
function geturlcs(para){//获取指定参数
    var reg = new RegExp("(^|&)"+para +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return unescape(r[2]);
    }
    return null;
}
function getpaper(data){//获取试卷
    var paperinfo=data.data.paperInfo.Items;
    //console.log(paperinfo);
    var ajs="{\"Items\":[";
    for(let i=0;i<paperinfo.length;i++){//获取答案
        if(i==0){
            ajs+="{\"I1\":\""+paperinfo[i].I1+"\",\"I15\":[],\"Sub\":[]}";
        }else{
            ajs+=",{\"I1\":\""+paperinfo[i].I1+"\",\"I15\":[],\"Sub\":[]}";
        }
        getanswer(paperinfo[i].I4,paperinfo[i].I1,i);
        cls[1]=i;
    }
    ajs+="],\"isDecimal\":false,\"isHalf\":false}";
    answerinfo=JSON.parse(ajs);
    //console.log(answerinfo);
}
function getanswer(itemBankId,questionId,qid){//获取答案按题序号
    $.ajax({
        method:"GET",
        url:"/StudentCenter/OnlineJob/GetQuestionDetail?itemBankId="+itemBankId+"&questionId="+questionId,
        success:function(data){
            let info=document.getElementsByClassName("Test-Info-Right")[0].getElementsByTagName("H2")[0];
            if(info!=null){
                info.innerText="已处理："+(++cls[0])+" 加载数："+(cls[1]+1);
            }
            let answer=data.data.Choices;//获取选项
            for(let i=0;i<answer.length;i++){
                if(answer[i].IsCorrect){
                    answerinfo.Items[qid].I15.push(i);
                }
            }
            if(answer.length==0){//主观题答题
                answerinfo.Items[qid].I15=data.data.I6;
            }
            if(cls[0]>cls[1]){
                sendpaper();
            }
        }
    });
}
function sendpaper(){//发送试卷
    $.ajax({
        method:"GET",
        url:"/StudentCenter/OnLineJob/GetHomeWorkValidCondition?studentHomeworkId="+geturlcs("studentHomeworkId"),
        success:function(data){
            var sdkx=JSON.parse(localStorage.getItem("homeworkSDKXapiData"));
            $.ajax({
                method:"POST",
                url:"https://homeworkapi.open.com.cn/getHomeworkAnswers?id="+workAnswerId,
                dataType:"json",
                data:answerinfo,
                headers:{
                    "Authorization":localStorage.getItem("token"),
                    "appType":localStorage.getItem("appType"),
                    "schoolId":sdkx.organizationId,
                    "token":token
                },
                success:function(data){
                    console.log(data);
                    tjpaper(data);
                }
            });
        }
    });
}
var jt=null,bid=null,sbid=null,lid=null,answt=null,exid=null,unid=null;
function tjpaper(data){//提交试卷
    $.ajax({
        method:"GET",
        url:"/studentcenter/onlinejob/VerifyIsAnaLoginSubmitHomework?homeworkAnswerId="+workAnswerId,
        success:function(data){
            var sdkx=JSON.parse(localStorage.getItem("homeworkSDKXapiData"));
            var tjsj="{\"Items\":[],";
            tjsj+="\"JudgeType\":\""+jt+"\",\"isErrorAnswer\":true,\"isDecimal\":true,\"isHalf\":true,";
            tjsj+="\"ExamineeId\":\""+exid+"\",\"AnswerTime\":\""+answt+"\",";
            tjsj+="\"UniversityId\":\""+unid+"\",\"BatchId\":\""+bid+"\",\"LevelId\":\""+lid+"\",";
            tjsj+="\"SpecialtyId\":\""+sbid+"\"}";
            var tjjs=JSON.parse(tjsj);
            tjjs.Items=answerinfo.Items;
            $.ajax({
                method:"POST",
                url:"https://homeworkapi.open.com.cn/getSubmitHomework?homeworkAnswerId="+workAnswerId+"&isDecimal=true&isHalf=true",
                dataType:"json",
                data:tjjs,
                headers:{
                    "Authorization":localStorage.getItem("token"),
                    "appType":localStorage.getItem("appType"),
                    "schoolId":sdkx.organizationId,
                    "token":token
                },
                success:function(data){
                    let info=document.getElementsByClassName("Test-Info-Right")[0].getElementsByTagName("H2")[0];
                    if(info!=null){
                        info.innerHTML="<button id=\"dwgb\" onclick=\"alert('答题已完成，请直接关闭！成绩："+data.data.score+"分');\">答题已完成，请直接关闭！成绩："+data.data.score+"分</button>";
                    }
                    document.getElementById("dwgb").click();
                    //console.log(data);
                }
            });
        }
    });
}
function startpaper(){
    var sdkx=JSON.parse(localStorage.getItem("homeworkSDKXapiData"));
    $.ajax({
        method:"GET",
        url:"https://homeworkapi.open.com.cn/getHomework?studentHomeworkId="+geturlcs("studentHomeworkId"),
        headers:{
            "Authorization":localStorage.getItem("token"),
            "appType":localStorage.getItem("appType"),
            "schoolId":sdkx.organizationId,
            "token":token
        },
        success:function(data){
            getpaper(data);
        }
    });
}
(function() {
    'use strict';
    var href=location.href;
    switch(window.location.pathname){
        case "/StudentCenter/OnLineJob/TestPaper"://学生作业
            addXMLRequestCallback( function( xhr ) {
                xhr.addEventListener("load", function(){
                    if (xhr.readyState==4 && xhr.status==200) {
                        if(token==null){
                            if (xhr.responseURL.includes("homeworkapi.open.com.cn/getHomework")){
                                token=xhr.headers.token;
                                let dat=JSON.parse(xhr.responseText);
                                workAnswerId=dat.data.workAnswerId;
                                startpaper();
                            }
                        }
                        if(jt==null){
                            if (xhr.responseURL.includes("/StudentCenter/MyWork/GetUniversityCode")){
                                let uinfo=JSON.parse(xhr.responseText);
                                jt=uinfo.data.JudgeType;
                                bid=uinfo.data.BatchId;
                                sbid=uinfo.data.SpecialtyId;
                                lid=uinfo.data.LevelId;
                                answt=uinfo.data.AnswerTime;
                                exid=uinfo.data.ExamineeId;
                                unid=uinfo.data.UniversityId;
                            }
                        }
                    }
                });
            });
            break;
    }
})();