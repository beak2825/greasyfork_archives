// ==UserScript==
// @name         樱花动漫下一话
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ctl+<>控制上一话、下一话
// @author       kakasearch
// @match        http://www.yhdm.io/*
// @icon         https://www.google.com/s2/favicons?domain=yhdm.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423647/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E4%B8%8B%E4%B8%80%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/423647/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E4%B8%8B%E4%B8%80%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.document.addEventListener("keydown", function(event){
        var e = window.event
            if((window.event.ctrlKey)&&(window.event.keyCode==190)){//下一个视频
                document.querySelector("div.fav.r > a:nth-child(4)").click()

            }else if((window.event.ctrlKey)&&(window.event.keyCode==188)){//上一个视频
                document.querySelector("div.fav.r > a:nth-child(2)").click()
            }
    })

    // Your code here...
})();