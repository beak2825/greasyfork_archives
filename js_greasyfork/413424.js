// ==UserScript==
// @name         搬单助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浙江理工大学易班优课YOOC测试、刷题
// @author       STZG
// @match        *://*.bypms.cn/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.5.1.js#sha256=QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/413424/%E6%90%AC%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/413424/%E6%90%AC%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

     function parseDom(arg) {
        console.log(arg);
        let objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes[0];
    };
    let cssStyle = document.createElement("style");
    cssStyle.setAttribute('data-owner','bilibili-downloader');
    cssStyle.innerHTML = `#bilibili-download{position:fixed;left:10px;bottom:200px;width:40px;height:40px;background:#99CCFF;border-radius:50%;border:1px white solid;cursor:pointer;color:white;text-align:center;line-height:40px;box-shadow:0 0 8px #e5e9ef;transition:all 0.5s ease}
#bilibili-download:hover{transform:scale(1.1)}`
    let innerHTML = `<div id="bilibili-download">下载</div>`;
    let container = parseDom(innerHTML);
    document.body.appendChild(cssStyle);
    document.body.appendChild(container);
    container.onclick = function(){
        //let downloadUrl = window.location.href.replace('bilibili','ibilibili')
        //window.open(downloadUrl);
        detailPage()
    }

    var detailPage=()=>{
        alert("ok");

         var questions=document.getElementsByClassName('itable')
         alert(questions);

        //获取考试信息


        var group=document.getElementById('group-data')
        var groupId=group.getAttribute("data-group-id")
        var examId=group.getAttribute("data-exam-id")
        var examQuestionNum=Number(group.getAttribute("data-questions"))
        //获取问题信息
        var questions=document.getElementsByClassName('question-board')
        var questionNum = questions.length
        //获取答案信息
        var ansElements = document.getElementsByClassName('the-ans')
        var ansNum = ansElements.length

    }


     console.log("1-");
    // 设置修改后，需要刷新或重新打开网课页面才会生效
    var setting = {

    },
    _self = unsafeWindow,
    top = _self,
    url;
    var $ = _self.jQuery || top.jQuery,
    parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    vjs = _self.videojs;
    var ajaxUsualErrorMessage=(e) =>{
        if(e.status==500){
            //页面函数
            xAlert('失败','网络请求失败')
        }else if(e.status==404){
            //页面函数
            xAlert('失败','找不到网页')
        }
    }

     console.log("2-");

    var htmlToQuestionObj=(id,questionHTML)=>{
        return {id:id,question:questionHTML
            .replace(/the-ans fls/g,"the-ans crt")
            .replace(/<li class="crt"/g,'<li class=""')
            .replace(/<li class="fls"/g,'<li class=""')}
    }
    var analysisDetailAnswerPage=(pagehtml)=>{
         console.log("3-");
        console.log(pagehtml);
        //创建DOM
        var pageDOM=document.createElement("html");
        pageDOM.innerHTML=pagehtml
        var page=$(pageDOM)
        console.log(page)
        //获取考试信息
        var groupData=page.find('#group-data')
        var groupId=groupData.attr("data-group-id")
        var examId=groupData.attr("data-exam-id")
        //获取问题信息
        var question=page.find('.question-board')
        console.log(question)
        //数据封装
        var question_arr=[]
        question.each((index,q)=>{
            question_arr.push(htmlToQuestionObj(q.id,q.outerHTML))
            let aq=$("#"+q.id).find('.the-ans')
            if(aq.length==1){
                aq.html($(q).find('.the-ans').html())
            }
        })
        return {group:groupId,
                exam:examId,
                questions:question_arr}
    }
   
	var start=()=>{
         console.log("5-");

         console.log(url);

         console.log(location.pathname);

        if(url!=location.pathname){
            url=location.pathname
            console.log(url)
            if(!url.match(/^\/mobile/)){
                if(url.match(/\/group\/[0-9]*\/exams.*/)){
                    examsPage()
                }
                else if(url.match(/\/group\/[0-9]*\/exam\/[0-9]*\/detail/)){
                    detailPage()
                }
            }
        }
	}
 
})();