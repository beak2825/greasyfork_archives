// ==UserScript==
// @name         农垦倍速脚本
// @namespace    http://tampermonkey.net/
// @version      1
// @description  农垦刷课脚本
// @author       王舜文
// @match        http://hljzyys.hljdatc.org.cn/*
// @license        MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473423/%E5%86%9C%E5%9E%A6%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/473423/%E5%86%9C%E5%9E%A6%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// (function() {
//     'use strict';
//
//     // Your code here...
window.onload=function(){
var div=document.createElement("div");
div.style.cssText="position: fixed;width: 74px;right: 50px;top: 40px;z-index:99999;rgb(177,238,228,0.3)";
div.innerHTML="<input id=\"setPlay\" value=\"4\" type=\"number\" step=\"0.5\" style=\"width: 70px;padding: 10px;border: 1px;\n" +
    "    background: rgba(255,255,255,1);\"/>"
document.body.appendChild(div);
var input=document.getElementById("setPlay");
setInterval(()=>{
        var video=document.querySelector('video');
        if(video){
            video.playbackRate=parseFloat(input.value);
        }
    }
    ,300
);
}
// })();