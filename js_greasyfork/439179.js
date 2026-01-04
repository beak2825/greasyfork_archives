// ==UserScript==
// @name         Wyze Web View Auto Play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoplays all videos on the page
// @author       james.pike@agilecollab.ca
// @license      MIT
// @match        https://view.wyze.com/*
// @icon         https://wyze.com/media/favicon/stores/1/favicon-32x32.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439179/Wyze%20Web%20View%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/439179/Wyze%20Web%20View%20Auto%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //set timeout isn't a perfect solution, slower connections 2s might not be sufficient.
    //possibly change this is the future.
    const autoPlay = setTimeout(()=>{

        //class might change, will prob need to dynamically get the play button in the future
        let playbuttons = document.querySelectorAll(".c-fYPKku") || [];
        Array.from(playbuttons).map((play_button, i) => { play_button.click(); });

    }, 2000);

})();