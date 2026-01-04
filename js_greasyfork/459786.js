// ==UserScript==
// @name         GitHub Actual Times
// @namespace    CMG
// @version      0.2
// @description  Appends the actual DateTime to GitHub workflows
// @author       Ned Wilbur
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459786/GitHub%20Actual%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/459786/GitHub%20Actual%20Times.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (const time of document.querySelectorAll('relative-time')) {
        if (document.URL.includes('workflow')) time.shadowRoot.innerHTML += '<br>';
        else time.shadowRoot.innerHTML += ' - '
        time.shadowRoot.innerHTML += time.getAttribute('title')
    }
})();