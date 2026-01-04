// ==UserScript==
// @name         yuanzige video speed set
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.yuanzige.com/course/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401376/yuanzige%20video%20speed%20set.user.js
// @updateURL https://update.greasyfork.org/scripts/401376/yuanzige%20video%20speed%20set.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        var btn1=document.createElement("button");
        var node1=document.createTextNode("2倍-全高清");
        btn1.appendChild(node1);
        var elm=document.getElementsByClassName("video-name")[0];
        elm.appendChild(btn1);
        btn1.style.marginLeft="300px";
        btn1.style.backgroundColor="white";
        btn1.style.padding="15px";

        btn1.onclick=function(){
            var menu = document.getElementsByClassName("vjs-menu-item-text");
            for(var item of menu) {
                if(item.innerText == "2x" || item.innerText == "全高清") {
                    item.click();
                }
            }
        }
    }

})();