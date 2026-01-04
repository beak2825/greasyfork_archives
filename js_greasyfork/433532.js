// ==UserScript==
// @name         1. 치킨딜 위메프
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!ㅇ
// @author       You
// @match        https://front.wemakeprice.com/special/category/*
// @match        https://mw.wemakeprice.com/special/group/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433532/1%20%EC%B9%98%ED%82%A8%EB%94%9C%20%EC%9C%84%EB%A9%94%ED%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/433532/1%20%EC%B9%98%ED%82%A8%EB%94%9C%20%EC%9C%84%EB%A9%94%ED%94%84.meta.js
// ==/UserScript==


var openTime = 0;   // X분에 스크립트 시작함(정각은 0)

var xmlHttp;

function srvTime(){
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }
}

function timer(){
    var startTime = new Date().getTime();
    var flag = 1;
   var macro = setInterval(function() {
       var st = srvTime();
       var now = new Date(st);
       var endTime = new Date().getTime();
       if(now.getMinutes()==openTime){
           if((endTime-startTime)>5000){
               window.location.reload();
               clearInterval(macro);
           }else{
               clearInterval(macro);
               openPage();
           }
       }
   }, 10);
}

function openPage(){
    var a_href = $( 'a[data-gtm-link-type="PROD"]' ).attr('href');
    if(a_href == null){
        window.location.reload();
    }else{
        window.open( a_href,  '_blank' );
    }

};
//openPage();
timer();