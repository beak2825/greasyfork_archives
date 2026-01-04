// ==UserScript==
// @name         Quick liferestart
// @namespace    http://tampermonkey.net/
// @version      1.0a2
// @description  快速浏览Liferestart游戏的历程
// @author       Linnest
// @include      *://restart.typekuon.com/lifeRestart/view/*
// @include      *://liferestart.syaro.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431873/Quick%20liferestart.user.js
// @updateURL https://update.greasyfork.org/scripts/431873/Quick%20liferestart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    var b = document.createElement("button");
    var text = document.createTextNode("快速浏览");
    b.appendChild(text);
    b.className = "mainbtn";
    b.style = "left: 20%;";
    b.onclick = function(){
        if (document.getElementById("lifeTrajectory")){
            for(var num =1;num<500;num++){
                document.getElementById("lifeTrajectory").click()
            }
        }

    };
    if(window.self === window.top){
            if (document.querySelector("body")){
                document.body.appendChild(b);
            } else {
                document.documentElement.appendChild(b);
            }
        }
})();