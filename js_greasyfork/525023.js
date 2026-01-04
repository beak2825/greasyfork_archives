// ==UserScript==
// @name         Twitter rebranding
// @namespace    http://tampermonkey.net/
// @version      2025-01-27
// @description  Twitter rebranding and more
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525023/Twitter%20rebranding.user.js
// @updateURL https://update.greasyfork.org/scripts/525023/Twitter%20rebranding.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const path = '<path d="M12.1208 9.66495L12.1512 4.73946L12.1664 2.27671L12.174 1.04533L12.174 0.823263L24.0623 0.823258L24.0623 -0.186045L12.1817 -0.186041L11.0183 0.823263L10.9627 9.37737L7.15516 8.42786L5.25139 7.9531L4.77545 7.8344L4.65646 7.80473L4.53747 7.77506L4.2995 7.71572L3.34761 7.47834L3.34761 -0.18604L-0.580289 -0.186039L-0.580287 10.8862L10.9369 13.7575L10.8726 23.0776L-0.58029 23.0776L-0.580292 24.0869L10.8726 24.0869L12.0359 23.0776L12.0908 14.0456L19.974 16.0649L19.974 24.0869L24.0623 24.0869L24.0623 12.6435M1.74826 10.3717L3.53547 8.8211L21.7616 13.2079L19.974 14.7588" fill="white"/>';
    addEventListener("load", (event) => {
        setTimeout(() => {

        console.log('costa', window.document.querySelector('h1'))
        const svg = window.document.querySelector('h1').querySelector('svg');
        svg.innerHTML = path;
        }, 1000)
    });


    // Your code here...
})();