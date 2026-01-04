// ==UserScript==
// @name         Fix Elon's Folly
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes the Views counter & Analytics icon from tweets.
// @author       ThriceGreatAlex
// @match        *://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457026/Fix%20Elon%27s%20Folly.user.js
// @updateURL https://update.greasyfork.org/scripts/457026/Fix%20Elon%27s%20Folly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            const views = Array.from(
                document.body.querySelectorAll('span')
            ).filter(
                x => {
                    var y = x.textContent.toLowerCase()
                    return y.startsWith('view') && !y.startsWith('view ')
                }
            );
            views.forEach(
                x => x.parentElement.parentElement.parentElement.remove()
            );
            const analytics = Array.from(
                document.body.querySelectorAll(
                    "path[d='M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z']"
                )
            )
            analytics.forEach(
                x => {
                    var y = x.parentElement.parentElement.parentElement.parentElement
                    if (y.textContent.toLowerCase() !== 'view tweet analytics') {
                        y.parentElement.parentElement.remove()
                    }
                }
            )
        }
    }

    const observer = new MutationObserver(callback);
    observer.observe(
        document.querySelector('body'),
        { attributes: true, childList: true, subtree: true }
    );

})();

