// ==UserScript==
// @name         직장내일 어흥성어 완전 자동화 + 0분에 새로고침버전
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofill과 함께 사용하세요!
// @author       You
// @match        https://www.jikjangevent.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389528/%EC%A7%81%EC%9E%A5%EB%82%B4%EC%9D%BC%20%EC%96%B4%ED%9D%A5%EC%84%B1%EC%96%B4%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94%20%2B%200%EB%B6%84%EC%97%90%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%EB%B2%84%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/389528/%EC%A7%81%EC%9E%A5%EB%82%B4%EC%9D%BC%20%EC%96%B4%ED%9D%A5%EC%84%B1%EC%96%B4%20%EC%99%84%EC%A0%84%20%EC%9E%90%EB%8F%99%ED%99%94%20%2B%200%EB%B6%84%EC%97%90%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%EB%B2%84%EC%A0%84.meta.js
// ==/UserScript==

var xmlHttp;
function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}

function downloaer(){
    window.onload = function () {
        setTimeout(function() {
            var ans = $("input[name=orgAns]").val();
            $('input[type="radio"][value='+ans+']').eq(0).trigger('click');
            $('#btnApply').eq(0).trigger('click');
        }, 30);
        setTimeout(function() {
            $('#btnSave').eq(0).trigger('click');
        }, 70);
    }
}


function localtimer(){
    var st = srvTime();
    var starttime = new Date(st);
    var local = setInterval(function() {
        var now = new Date();
        if( (now.getMinutes()==59 && now.getSeconds()>50) || now.getMinutes()==0){
            var st = srvTime();
            var realnow = new Date(st);
            if(realnow.getMinutes()==0&&starttime.getMinutes()!=0){
                window.location.reload();
            }
            else if(realnow.getMinutes()==0){
                downloaer();
                clearInterval(local);
            }
        };
    }, 50);
}

localtimer();