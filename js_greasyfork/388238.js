// ==UserScript==
// @name         Download videos from vidlii
// @namespace    https://github.com/blazor67
// @version      1
// @description  Click the link over the title
// @author       blazor67
// @include      http://*.vidlii.com/*
// @include      https://*.vidlii.com/*
// @include      http://vidlii.com/*
// @include      https://vidlii.com/*
// @match        https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388238/Download%20videos%20from%20vidlii.user.js
// @updateURL https://update.greasyfork.org/scripts/388238/Download%20videos%20from%20vidlii.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        'use strict';

        // Your code here...
        let vid = document.querySelector("video");
        let player = document.querySelector(".vlPlayer");
        var bott = document.createElement("a");
        let titolo = document.querySelector(".w_title h1");

        bott.appendChild(document.createTextNode('Download'));
        bott.setAttribute('href', vid.getAttribute("src"));
        bott.setAttribute('download',titolo.textContent);

        titolo.parentNode.insertBefore(bott, titolo);

    }, false);
})();