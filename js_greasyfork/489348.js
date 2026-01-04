// ==UserScript==
// @name         Filter reddit post with certain keywords in the title
// @namespace    Filter reddit post
// @version      1.0.1
// @description  Hide elements with specific text content
// @author       ein
// @match        https://new.reddit.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489348/Filter%20reddit%20post%20with%20certain%20keywords%20in%20the%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/489348/Filter%20reddit%20post%20with%20certain%20keywords%20in%20the%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getKeywords() {
        // edit your keywords here
        return /keyword1|keyword2|keyword3/i;
    }

    function hideElements() {
        var elements = document.querySelectorAll('._2FCtq-QzlfuN-SwVMUZMM3');
        var keywords = getKeywords();
        elements.forEach(function(el) {
            if (keywords.test(el.innerText)) {
                var ancestor = el.closest('._1Qs6zz6oqdrQbR7yE_ntfY, ._3xuFbFM3vrCqdGuKGhhhn0').parentElement.parentElement;
                if (ancestor) {
                    ancestor.style.display = 'none';
                }
            }
        });
    }

    hideElements();
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                hideElements();
            }
        });
    });
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();