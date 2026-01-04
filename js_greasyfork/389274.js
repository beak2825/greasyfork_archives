// ==UserScript==
// @name         모바일네이버 배너클릭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.search.naver.com/search.naver?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389274/%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B0%B0%EB%84%88%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/389274/%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B0%B0%EB%84%88%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

var setMinute=48;//<-새로고침될 시간입니다 배그데이때는 0(정각)으로 설정하십쇼

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
    var list_inner = document.getElementsByClassName('list_inner');
    var txt= list_inner[0].getElementsByClassName('txt');
    var div = document.getElementsByClassName('api_title_area');
    var startTime = new Date().getTime();
    var flag=0;
    var macro = setInterval(function() {
       var st = srvTime();
       var now = new Date(st);
       div[0].innerHTML="★스크립트 작동중★</br>"+now+"</br>"+setMinute+"분에 접속 예정";
       var endTime = new Date().getTime();
       if(now.getMinutes()==setMinute){
           if((endTime-startTime)>5000){
                window.location.reload();
               clearInterval(macro);
           }else{
                goEvent();
                clearInterval(macro);
           }
       }
   }, 10);
}

function goEvent(){
   var thumb_area = document.getElementsByClassName('thumb_area');
   var a = thumb_area[0].getElementsByTagName('a');
   a[0].click();

}

timer();

