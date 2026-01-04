// ==UserScript==
// @name         WowHead Right Bar Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the right bar in wowhead pages
// @author       Seify
// @match        https://chrome.google.com/webstore/category/extensions
// @include      http://*.wowhead.com/*
// @include      https://*.wowhead.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371793/WowHead%20Right%20Bar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/371793/WowHead%20Right%20Bar%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("sidebar-wrapper").remove();
    document.getElementById("page-content").style["padding-right"] = 0;
})();