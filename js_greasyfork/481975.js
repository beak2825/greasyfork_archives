// ==UserScript==
// @name         Redirect Magnet Links to Webtor.io
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirect all magnet links to webtor.io.
// @author       canary_in_a_coleslaw-ChatGPT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481975/Redirect%20Magnet%20Links%20to%20Webtorio.user.js
// @updateURL https://update.greasyfork.org/scripts/481975/Redirect%20Magnet%20Links%20to%20Webtorio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(e) {
        var clickedEl = e.target.closest('a');
        if (!clickedEl || !clickedEl.href.startsWith('magnet:')) return;
        e.preventDefault();
        location.href = 'https://webtor.io/' + clickedEl.href.match(/[A-F0-9]{40}/gmi)[0].toLowerCase();
    }, true);
})();
