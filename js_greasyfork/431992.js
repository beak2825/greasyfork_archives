// ==UserScript==
// @name         Voz Dark
// @namespace    f97
// @version      0.1.2
// @description  Voz dark mode
// @author       f97
// @match        https://*.voz.vn/*
// @icon         https://icons.iconarchive.com/icons/rokey/popo-emotions/128/burn-joss-stick-icon.png
// @resource     DARK_VOZ_CSS https://raw.githubusercontent.com/nguyentdat27/voz.vn-darkmode/main/dark-voz.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431992/Voz%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/431992/Voz%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = GM_getResourceText("DARK_VOZ_CSS");
    GM_addStyle(css);
})();
