// ==UserScript==
// @name         Zoom automatically raise hand
// @name:zh-TW   Zoom自動舉手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  By detecting how many others are raising their hand, if exceed the threshold you set, then the program will automatically raise your hands.
// @description:zh-TW 檢測有多少人舉手，如果超過閾值，程序將自動舉手
// @author       You
// @match        *://zoom.us/wc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408230/Zoom%20automatically%20raise%20hand.user.js
// @updateURL https://update.greasyfork.org/scripts/408230/Zoom%20automatically%20raise%20hand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bar = document.getElementsByClassName("footer__inner")[0];
    var tray = document.createElement("div");
    tray.innerHTML = '<span>Raise hand if </span> <input id="hands" style="width: 30px; background-color: black;border: solid 1px white;"></input> hands are raising <button id="handBtn" style="background-color: black; border: solid 1px white;">Set</button> <button id="stopBtn" style="background-color: black; border: solid 1px white;">Stop</button><br><span id="pluginText">The plugin will only work when opening the participant list.</span>';
    tray.setAttribute ('id', 'mask');
    tray.style.position = "absolute";
    tray.style.color = "white";
    tray.style.backgroundColor = "rgba(0,0,0,0)";
    tray.style.left = "250px";
    tray.style.top = "5px";
    tray.style.zIndex = "999999";
    bar.insertBefore(tray, bar.childNodes[1]);
    var interval2;
    var hands;
    var text23 = document.getElementById("pluginText");

    function startHang(){
        clearInterval("interval2");
        interval2 = setInterval(function(){
            var array = document.getElementsByClassName("participants-icon__participants-raisehand");
            if(typeof(document.getElementsByClassName("nonverbal-icon raisehand-icon")[0]) == "undefined"){
                text23.innerHTML = "Please open the participant list in order to run the code.";
                text23.style.color = "red";
            }else{
                text23.innerHTML = "Plugin is running.";
                text23.style.color = "white";
            }
            var handStatus = document.getElementsByClassName("nonverbal-icon raisehand-icon")[0].className;

            if((hands <= array.length && handStatus.indexOf("selected") == -1)||(hands > array.length && handStatus.indexOf("selected") != -1)){
                document.getElementsByClassName("button-without-style")[0].click();
            }
        }, 2000);
    }

    var handBtn = document.getElementById("handBtn");
    handBtn.onclick = function(){
        hands = Number(document.getElementById("hands").value);
        startHang();
        if(typeof(document.getElementsByClassName("nonverbal-icon raisehand-icon")[0]) == "undefined"){
                text23.innerHTML = "Please open the participant list in order to run the code.";
                text23.style.color = "red";
            }else{
                text23.innerHTML = "Plugin is running.";
                text23.style.color = "white";
            }
    }

    var stopBtn = document.getElementById("stopBtn");
    stopBtn.onclick = function(){
        clearInterval(interval2);
        text23.innerHTML = "Plugin is stoped.";
    }

    // Your code here...
})();