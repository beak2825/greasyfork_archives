// ==UserScript==
// @name         Moodle Rotate Icon
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Rotate things from Moodle
// @author       Wolkenklar
// @match        https://edufs.edu.htl-leonding.ac.at/moodle/course/view.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.at
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519935/Moodle%20Rotate%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/519935/Moodle%20Rotate%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    var keyFrames = `
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    `;
    style.innerHTML += keyFrames;


    let icons = document.getElementsByClassName("activity-grid");

    icons.forEach(icon => {
        icon.style.animation = "rotate 1s infinite linear"
    });
})();