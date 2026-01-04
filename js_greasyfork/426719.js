// ==UserScript==
// @name         Echo360 Click to Play/Pause
// @namespace    https://kyleschwartz.ca
// @version      0.1
// @description  Click to play or pause on Echo360.ca
// @author       ksmarty
// @match        https://echo360.ca/*
// @downloadURL https://update.greasyfork.org/scripts/426719/Echo360%20Click%20to%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/426719/Echo360%20Click%20to%20PlayPause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("screens")?.[0].addEventListener("click",(()=>{
        document.getElementsByClassName("play-btn")?.[0].click();
    }));
})();