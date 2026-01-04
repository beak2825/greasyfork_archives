// ==UserScript==
// @name         PWA Dark Titlebar
// @namespace    https://github.com/jairjy
// @version      1.1
// @description  Changes the titlebars of your PWA to be dark!
// @author       Gredicer
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483797/PWA%20Dark%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/483797/PWA%20Dark%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    checkNightMode()

    function checkNightMode(){
        var meta = document.createElement("meta");
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            meta.name = "theme-color";
            meta.content = "#1a1a1a";
        }else {
            meta.name = "theme-color";
            meta.content = "#ffffff";
        }
        document.getElementsByTagName("head")[0].prepend(meta);
    }

    let lightMedia = window.matchMedia('(prefers-color-scheme: light)');

    let darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    let callback = (e) => {
        let prefersDarkMode = e.matches;
        if (prefersDarkMode) {
            checkNightMode();
        }
    };

    if (typeof darkMedia.addEventListener === 'function'||typeof lightMedia.addEventListener === 'function') {
        lightMedia.addEventListener('change', callback);
        darkMedia.addEventListener('change', callback);
    }

})();