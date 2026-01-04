// ==UserScript==
// @name         MeetTheOnePlugin
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  用來查meet the one的約會次數和註冊日期
// @author       You
// @match        https://www.meettheone.com.tw/*
// @icon         https://www.google.com/s2/favicons?domain=meettheone.com.tw
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431180/MeetTheOnePlugin.user.js
// @updateURL https://update.greasyfork.org/scripts/431180/MeetTheOnePlugin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements(".meetScore", execute);


})();

function execute(){
var userId = window.location.pathname.split("/").pop();

var urloption = "";
    if(window.location.href.indexOf("friends")>-1)
    {
      urloption = "friends/";
    }else if(window.location.href.indexOf("matches")>-1){
      urloption = "matches/";
    }
    else{
      return;
    }

    callAjax('https://www.meettheone.com.tw/ajax/meet-score/show-by-other/'+userId,function(response){
        var data = JSON.parse(response);
        var dateCount = data.data.length;
        var first = document.createElement("H2");
        var text = document.createTextNode("約會次數:"+dateCount);
        first.appendChild(text);
        document.getElementsByClassName("meetScore")[0].appendChild(first);
    });

        callAjax('https://www.meettheone.com.tw/ajax/'+urloption+userId,function(response){
        var data = JSON.parse(response);
        var createAt = data.other.createdAt
        var first = document.createElement("H2");
        var text = document.createTextNode("註冊日期:"+createAt);
        first.appendChild(text);

        var second = document.createElement("H2");
        var text2 = document.createTextNode("更新日期:"+data.other.updatedAt);
        second.appendChild(text2);

        document.getElementsByClassName("meetScore")[0].appendChild(first);
        document.getElementsByClassName("meetScore")[0].appendChild(second);
    });
    if(urloption === "friends/"){
        callAjax('https://www.meettheone.com.tw/ajax/basic/info?contents[]=friends',function(response){
            var data = JSON.parse(response);
            console.log(data);
            var createAt = data.friends.find(x => x.user.id == userId).otherLoginAt
            var first = document.createElement("H2");
            var text = document.createTextNode("登入日期:"+createAt);
            first.appendChild(text);
            document.getElementsByClassName("meetScore")[0].appendChild(first);
        });
    }
}

function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}