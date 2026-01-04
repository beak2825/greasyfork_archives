// ==UserScript==
// @name         Load TerritoryHelper CSS
// @match        https://territoryhelper.com/Print/Territory/*
// @match        https://territoryhelper.com/de/Print/Territory/*
// @version      1.0
// @description  Loads external CSS to use it with userstyles for Safari on iPad
// @author       wichael
// @resource     REMOTE_CSS https://greasyfork.org/scripts/463173-territoryhelper-print-layout/code/TerritoryHelper%20print%20layout.user.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1052524
// @downloadURL https://update.greasyfork.org/scripts/463175/Load%20TerritoryHelper%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/463175/Load%20TerritoryHelper%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load remote CSS
    // @see https://github.com/Tampermonkey/tampermonkey/issues/835
    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);

})();