// ==UserScript==
// @name         1. 위메프데이 검색찬스
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @match        https://front.wemakeprice.com/special*
// @match        https://mw.wemakeprice.com/special*
// @match        https://mw.wemakeprice.com/promotion*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408549/1%20%EC%9C%84%EB%A9%94%ED%94%84%EB%8D%B0%EC%9D%B4%20%EA%B2%80%EC%83%89%EC%B0%AC%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/408549/1%20%EC%9C%84%EB%A9%94%ED%94%84%EB%8D%B0%EC%9D%B4%20%EA%B2%80%EC%83%89%EC%B0%AC%EC%8A%A4.meta.js
// ==/UserScript==   openTime = 0;   // X분에 스크립트 시작함(정각은 0)

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
    var subValue1 = 'wemakeprice.com/deal';
    var subValue2 = 'wemakeprice.com/product';

    var allLinks = $('a').map( function() {
        return $(this).attr('href');
    }).get();
    for(var i=0;i<allLinks.length;i++){
        if (String( allLinks[i] ).indexOf(subValue1) != -1 || String( allLinks[i] ).indexOf(subValue2) != -1 ) {
            window.open( String( allLinks[i] ),  '_blank' );
            break;
        }
    }
};

timer();