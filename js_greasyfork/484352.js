// ==UserScript==
// @name         Focus on textarea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Focus on textarea when a shortcut key is pressed
// @author       Zengxl
// @grant        none
// @match      *copilot.microsoft.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484352/Focus%20on%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/484352/Focus%20on%20textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Set your own shortcut key here. For example, 'p' key here.
        if (e.metaKey && e.code === 'KeyP') {
            e.preventDefault();
            var x=document.getElementsByClassName('cib-serp-main')[0]
            x=x.shadowRoot
            x=x.getElementById('cib-action-bar-main')
            x = x.shadowRoot
            x = x.querySelector('cib-text-input')
            x = x.shadowRoot.querySelector('textarea')
            x.focus()
            //console.log(x)
        }
    });
})();
