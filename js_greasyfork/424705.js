// ==UserScript==
// @name         屏蔽斗鱼PK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽斗鱼PK和一些影响观看的div
// @author       liyy
// @match        *://*.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424705/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BCPK.user.js
// @updateURL https://update.greasyfork.org/scripts/424705/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BCPK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        document.getElementById("js-player-video-above").style.display="none";
        window.setInterval(function (){
            var styleElement = document.getElementById("RandomPKBar-container");
            if(styleElement){
                styleElement.style.display="none";
            }
        },1000);
    }

    // Your code here...
})();