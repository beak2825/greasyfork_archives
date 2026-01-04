// ==UserScript==
// @name         Gelbooru
// @namespace    lander_scripts
// @version      1.01
// @description  Site improvements
// @author       You
// @match        https://*.gelbooru.com/*
// @icon         https://gelbooru.com/layout/gelbooru-logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476067/Gelbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/476067/Gelbooru.meta.js
// ==/UserScript==

console.info('💗 Gelbooru - Site improvements: Script Loaded');
(function() {
    'use strict';

    //makes image big
    var startIMG = document.querySelectorAll("#resize-link > a")[0];
    if (startIMG){
            startIMG.click()
            console.info('💗 Gelbooru - Site improvements: Image Resized')
    }
})();