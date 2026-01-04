// ==UserScript==
// @name         Remove stupid sidebars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Remove stupid sidebars on fandom wikis
// @author       Milan
// @match        https://*.fandom.com/wiki/*
// @icon         https://www.fandom.com/f2/assets/favicons/favicon-32x32.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476643/Remove%20stupid%20sidebars.user.js
// @updateURL https://update.greasyfork.org/scripts/476643/Remove%20stupid%20sidebars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`aside.page__right-rail, div.global-navigation, #WikiaBar { display: none } `);
})();