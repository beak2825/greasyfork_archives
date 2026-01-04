// ==UserScript==
// @name         Hide Google Sponsored Ads (uEierd)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide divs with class 'uEierd' on Google search results (typically ads)
// @author       Drewby123
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.*.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530127/Hide%20Google%20Sponsored%20Ads%20%28uEierd%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530127/Hide%20Google%20Sponsored%20Ads%20%28uEierd%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideAds() {
        document.querySelectorAll('div.uEierd').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Initial run
    hideAds();

    // Observe dynamic content
    const observer = new MutationObserver(hideAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
