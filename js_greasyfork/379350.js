// ==UserScript==
// @name         习题答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://e4.edu-edu.com.cn/exam/student/exam/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379350/%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/379350/%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

'use strict';
var body=$(window.document.body);
var answerBar=$(document.createElement('div'));
var url=window.location.href;
// alert(url.split('/'));
var ns=url.split('/');
var basePath="http://e4.edu-edu.com.cn/exam/student/exam/answer/";
var userExamId=ns[7]+'_'+ns[10]+'_'+ns[11].split('?')[0];
$.get(basePath+userExamId, function(result){
    var answers=result.answers;
    var answerTxt="";
    $.each(answers,function(i,val){
        answerTxt=answerTxt+(i+1)+":";
        answerTxt=answerTxt+val.answer+"; ";
    });
    answerBar.text(answerTxt);
});
body.prepend(answerBar);
answerBar.css("font-size", "14px");
