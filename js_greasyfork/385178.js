// ==UserScript==
// @name         Only Owned Items in Path of Exile Stashes
// @namespace    dargheScripts
// @version      0.1
// @description  Don't get distracted by items you dont own
// @author       darghe
// @match        https://www.pathofexile.com/account/view-stash/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385178/Only%20Owned%20Items%20in%20Path%20of%20Exile%20Stashes.user.js
// @updateURL https://update.greasyfork.org/scripts/385178/Only%20Owned%20Items%20in%20Path%20of%20Exile%20Stashes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const elements = [...document.querySelectorAll('.unowned')];
    elements.forEach(e => e.remove());
})();