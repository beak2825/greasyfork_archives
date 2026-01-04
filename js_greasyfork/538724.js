// ==UserScript==
// @name         MetaFilter AI/LLM Post Hider
// @namespace    http://www.metafilter.com/
// @version      1.5
// @description  Hides posts containing AI/A.I./LLM in title or body
// @match        https://www.metafilter.com/
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538724/MetaFilter%20AILLM%20Post%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/538724/MetaFilter%20AILLM%20Post%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const titles = document.querySelectorAll('h2.posttitle');
    titles.forEach(title => {
        const postBody = title.nextElementSibling;
        if (!postBody || !postBody.classList.contains('post')) return;
        const fullText = title.textContent + ' ' + postBody.textContent;
        if (/(^|\W)(A\.?I\.?|LLM)(\W|$)/i.test(fullText)) {
            title.style.display = 'none';
            postBody.style.display = 'none';
        }
    });
})();