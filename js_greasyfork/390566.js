// ==UserScript==
// @name         PWA Dark Titlebar
// @namespace    https://github.com/jairjy
// @version      1.7
// @description  Changes the titlebars of your PWA to be dark!
// @author       JairJy
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390566/PWA%20Dark%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/390566/PWA%20Dark%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#000000";
    document.getElementsByTagName("head")[0].prepend(meta);
})();