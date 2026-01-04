// ==UserScript==
// @name         Enable Spell Check on OpenAI Playground
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable spell check for the editor on OpenAI Playground website.
// @author       ChatGPT
// @match        https://platform.openai.com/playground*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462149/Enable%20Spell%20Check%20on%20OpenAI%20Playground.user.js
// @updateURL https://update.greasyfork.org/scripts/462149/Enable%20Spell%20Check%20on%20OpenAI%20Playground.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var elements = mutation.target.querySelectorAll('.pg-editor [spellcheck="false"]');
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute('spellcheck', 'true');
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();