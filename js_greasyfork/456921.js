// ==UserScript==
// @name         bbs stuff
// @version      2.8
// @description  complementary to noir
// @author       Jerry
// @match        *://www.1point3acres.com/*
// @match        *://newmitbbs.com/*
// @namespace    https://greasyfork.org/en/users/28298
// @homepage     https://greasyfork.org/en/scripts/456921
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456921/bbs%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/456921/bbs%20stuff.meta.js
// ==/UserScript==

// original author: Michael Wang https://greasyfork.org/en/scripts/472251-dark-mode/code
// with help of claude ai
// https://theabbie.github.io

(function () {
    // Create style element for dark mode
    const bbsDarkStyle = document.createElement('style');
    bbsDarkStyle.textContent = `
        html {
            filter: invert(1) hue-rotate(180deg) contrast(0.8);
        }
        /** reverse filter for media elements */
        img, video, picture, canvas, iframe, embed {
            filter: invert(1) hue-rotate(180deg);
        }
    `;

    // Initialize based on system mode
    let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (darkMode) {
        document.head.appendChild(bbsDarkStyle);
    } else {
    document.head.removeChild(bbsDarkStyle);
    }
})();