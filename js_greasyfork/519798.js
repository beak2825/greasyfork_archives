// ==UserScript==
// @name         Filter CSDN Content from Bing and Baidu
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Filter out CSDN content from Bing and Baidu search results
// @author       You
// @match        https://www.bing.com/search?q=*
// @match        https://www.baidu.com/s?wd=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519798/Filter%20CSDN%20Content%20from%20Bing%20and%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/519798/Filter%20CSDN%20Content%20from%20Bing%20and%20Baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove CSDN results
    function removeCSDNResults() {
        const results = document.querySelectorAll('.b_algo, .b_sideBleed, .b_footnote, .result');
        results.forEach(result => {
            const link = result.querySelector('a');
            // Filter for Bing results
            if (link && link.href.includes('csdn.net')) {
                result.style.display = 'none';
            }
            // Filter for Baidu results
            const muAttr = result.getAttribute('mu');
            if (muAttr && muAttr.includes('csdn.net')) {
                result.style.display = 'none';
            }
        });
    }

    // Run the function after the page loads
    window.addEventListener('load', removeCSDNResults);
})();
