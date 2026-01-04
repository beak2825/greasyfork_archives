// ==UserScript==
// @name         Prevent Fimfiction 4.0 Paragraph Selection
// @namespace    https://www.fimfiction.net/user/29560/Device+Null
// @version      1.0
// @description  Prevents the paragraph selection menu from appearing when clicking on text in stories.
// @author       Device Null
// @match        https://www.fimfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30524/Prevent%20Fimfiction%2040%20Paragraph%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/30524/Prevent%20Fimfiction%2040%20Paragraph%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var cl = mutation.target.classList;
            if (cl.contains('showing')) {
                cl.remove('showing');
            }
        });
    });

    observer.observe(document.querySelector('#paragraph-options'), { attributes: true });
})();