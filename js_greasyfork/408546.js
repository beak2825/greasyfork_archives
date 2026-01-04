// ==UserScript==
// @name         모바일네이버 검색창 맨 왼쪽 배너클릭
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  배너 자동클릭
// @author       메다
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @match        https://m.search.naver.com/search.naver?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408546/%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EC%B0%BD%20%EB%A7%A8%20%EC%99%BC%EC%AA%BD%20%EB%B0%B0%EB%84%88%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/408546/%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EC%B0%BD%20%EB%A7%A8%20%EC%99%BC%EC%AA%BD%20%EB%B0%B0%EB%84%88%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==
var setMinute=0;//<-새로고침될 시간입니다 배그데이때는 0(정각)으로 설정하십쇼

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
    var opt1=$('<p>').attr({
            'id' : 'timeinfotextbox'
        }).prependTo('#ct');
    var txt= $('.nomukun').on().innerHTML;
    var startTime = new Date().getTime();
    var flag=0;
    var macro = setInterval(function() {
       var st = srvTime();
       var now = new Date(st);
       opt1.html("★스크립트 작동중★</br>"+now+"</br>"+setMinute+"분에 접속 예정");
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
   var aaa = $('img[alt="상단 이미지"]').first();
   console.log(aaa);
   aaa.click();

}
timer();


