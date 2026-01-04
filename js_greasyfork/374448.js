// ==UserScript==
// @name          Zhihu Auto invitation and Report
// @name:zh-TW   逼乎自動邀請回答加舉報
// @namespace    HTTP://WWW.RUSSIAVK.COM/
// @version      0.2
// @description  Zhihu Auto invitation to answer and report
// @description:zh-TW 逼乎一鍵自動邀請回答+舉報
// @author       WWW.RUSSIAVK.CN
// @supportURL   huanxiangxr21@gmail.com
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=huanxiangxr21@gmail.com&item_name=Greasy+Fork+donation
// @match        https://www.zhihu.com/question/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/374448/Zhihu%20Auto%20invitation%20and%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/374448/Zhihu%20Auto%20invitation%20and%20Report.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const d=document,w=window,href=location.href,id=href.substring(href.indexOf('n/')+2,href.indexOf('/a'));
    w.onload=function(){
        let QuestionAskButton=d.querySelector('.FollowButton').cloneNode(),
            QuestionHeaderActions=d.querySelector('.QuestionHeaderActions'),
            JbList=d.createElement('ol')
        ;
        QuestionAskButton.innerText='自動邀請';
        QuestionAskButton.onmouseover=function(){
            Auto();
        };
        QuestionHeaderActions.appendChild(QuestionAskButton);
        QuestionHeaderActions.appendChild(JbList);
        const JbMap = new Map([['不構提問','ambiguity'],['主觀判斷','subjective'],['缺乏來源','rumour'],['辱駡','abuse'],['引爭議','provoke'],['求醫問藥','medicine'],['個人任務','personal'],['廣告','spam'],['政治敏感','politics'],['色情低俗','porn'],['自殺','suicide'],['違規','illegality'],['照片徵集','worthless']]);
                              let JbIndex,i=0;
        JbMap.forEach(function (key, value, map){
            JbIndex=d.createElement('ul');//QuestionAskButton.cloneNode();
            JbIndex.innerText=value;
            JbIndex.style.backgroundColor="#0084ff";
            JbIndex.style.padding='10px';
            JbIndex.style.margin='10px';
            JbIndex.style.float='left';
            JbIndex.onmouseover=function(){
                JB(key);
            };
            JbList.appendChild(JbIndex);
            i++
        })
    };
    let data;
    function JB(reason_type){
        data={"resource_id":id,"type":"question","reason_type":reason_type,"source":"web"}
        $.ajax({
            type:'post',
            url:'https://www.zhihu.com/api/v4/reports',
            data:JSON.stringify(data),
            async:false,
            success:function(Result,statusTXT){
            }
        });
    }
    function Auto(){
        d.querySelector('.QuestionHeaderActions button').click();
        let Delay=3500;
        w.setTimeout(function(){
            let Button=d.querySelectorAll('.QuestionInvitation-content .Button--blue')
            for(let i in Button){
                Button[i].click();
            }
        },Delay);
    }
})();