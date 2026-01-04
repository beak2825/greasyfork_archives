// ==UserScript==
// @name         Resize Janela do site e-desk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resize images on e-desk
// @author       MaxwGPT
// @match        https://nebrasil.e-desk.com.br/Portal/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472136/Resize%20Janela%20do%20site%20e-desk.user.js
// @updateURL https://update.greasyfork.org/scripts/472136/Resize%20Janela%20do%20site%20e-desk.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set the width and height for the page container element
    const containerWidth = '100%';

    // Get the st-content and st-pusher elements
    const stContent = document.querySelector('.st-content');
    const stPusher = document.querySelector('.st-pusher');

    // Style the st-content and st-pusher elements
    stContent.style.width = containerWidth;
    stContent.style.height = containerHeight;
    stPusher.style.width = containerWidth;
    stPusher.style.height = containerHeight;
})();
