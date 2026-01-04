// ==UserScript==
// @name         猫国助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  整合了珂学家、附件统计和资源进度条
// @author       Cirn09
// @match        *://kittensgame.com/*
// @match        *://bloodrizer.ru/games/kittens/*
// @icon         https://kittensgame.com/web/res/favicon.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427580/%E7%8C%AB%E5%9B%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427580/%E7%8C%AB%E5%9B%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var setup = function() {
        if (typeof gamePage === "undefined") {
            setTimeout(function(){
                setup();
            }, 2000);
        } else {
            document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/gh/Bioniclegenius/NummonCalc@master/NummonCalc.js';
            document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/gh/cameroncondry/cbc-kitten-scientists@master/kitten-scientists.user.js';
            document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/gh/vl20100/KGProgressBars@master/dist/KGP.js';
        }
    };
    setup();
})();