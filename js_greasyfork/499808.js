// ==UserScript==
// @name         Auto Redirect Lightshot Screenshot to Image
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects to the image URL on Lightshot screenshot pages
// @author       Your Name
// @match        *://prnt.sc/*
// @icon         https://www.google.com/s2/favicons?domain=prnt.sc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499808/Auto%20Redirect%20Lightshot%20Screenshot%20to%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/499808/Auto%20Redirect%20Lightshot%20Screenshot%20to%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToImage() {
        var imageElement = document.querySelector('#screenshot-image');
        if (imageElement) {
            window.location.href = imageElement.src;
        } else {
            setTimeout(redirectToImage, 100); // Check again after 500ms
        }
    }

    window.onload = function() {
        setTimeout(redirectToImage, 100); // Start checking after 500ms
    };
})();
