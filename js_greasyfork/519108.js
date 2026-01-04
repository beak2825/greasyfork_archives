// ==UserScript==
// @name         PWA Titlebar
// @namespace    https://gitlab.com/elifian/pwa-dark-titlebar
// @version      1.0
// @description  Changes the color of your PWA Titlebar to any color you like!
// @author       Elifian
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519108/PWA%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/519108/PWA%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const themeColor = "#1c1b22";

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.content = themeColor;
    } else {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = themeColor;
        document.head.appendChild(meta);
    }
})();
