// ==UserScript==
// @name         Qidian.com Translate Enabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable Google Translate on qidian.com
// @author       A nobody
// @match        https://www.qidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503862/Qidiancom%20Translate%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/503862/Qidiancom%20Translate%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Your code here
    let html_tag = document.getElementsByTagName("html")[0];
    html_tag.setAttribute("translate", "yes");
    html_tag.classList.remove("notranslate");
})();
