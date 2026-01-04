// ==UserScript==
// @name         EMP Dark
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Stylesheet for EMP
// @author       Conkuist
// @match        https://www.empornium.sx/*
// @match        https://www.empornium.is/*
// @icon         https://www.empornium.sx/favicon.ico
// @resource     IMPORTED_CSS https://dl.dropbox.com/s/ob9g2nxzr0wbaxi/style.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/431353/EMP%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/431353/EMP%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
})();