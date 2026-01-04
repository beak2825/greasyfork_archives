// ==UserScript==
// @name         Stop NYTimes video animations
// @namespace    http://tampermonkey.net/
// @version      2024-11-21
// @description  Stop cinemagraph_video animations
// @author       acypher
// @match        https://www.nytimes.com/
// @icon         https://www.nytimes.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517206/Stop%20NYTimes%20video%20animations.user.js
// @updateURL https://update.greasyfork.org/scripts/517206/Stop%20NYTimes%20video%20animations.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Remove Cinemagraph Videos on Scroll
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes elements with 'cinemagraph_video' in their class whenever the page is scrolled
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
   const removeCinemagraphVideos = () => {
        const elements = document.querySelectorAll('[class*="cinemagraph_video"]');
        elements.forEach(element => element.remove());
    };
    removeCinemagraphVideos();
    window.addEventListener('scroll', removeCinemagraphVideos);
})();
