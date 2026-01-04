// ==UserScript==
// @name         Adult:Chtrbt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click nag screen "I'm 18"
// @author       NoobAlert
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447995/Adult%3AChtrbt.user.js
// @updateURL https://update.greasyfork.org/scripts/447995/Adult%3AChtrbt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('close_entrance_terms').click();
    // Your code here...
})();