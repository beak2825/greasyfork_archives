// ==UserScript==
// @name         Visible Scrollbar - Invision
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes Invision's Inspect page scrollbars actually visible by changing to red using ::-webkit-scrollbar-thumb and !important. It inserts a style element before the first linked stylesheet.
// @author       Liam Mehl
// @license      GPL-3.0
// @resource     license https://raw.githubusercontent.com/L-M-ICA40511/userscripts/master/LICENSE
// @match        https://projects.invisionapp.com/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/371628/Visible%20Scrollbar%20-%20Invision.user.js
// @updateURL https://update.greasyfork.org/scripts/371628/Visible%20Scrollbar%20-%20Invision.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.innerHTML = "#inspect .canvas::-webkit-scrollbar-thumb{background:rgba(255, 4, 4, 0.8)!important}";
    document.querySelectorAll("link[rel='stylesheet']")[0].before(style);
})();