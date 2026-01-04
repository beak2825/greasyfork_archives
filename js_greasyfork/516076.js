// ==UserScript==
// @name         屏蔽CSDN搜索结果 / Hide CSDN Search Results
// @namespace    https://github.com/uuhc
// @version      1.0
// @description  在百度、Bing、谷歌中屏蔽CSDN搜索结果 / Hide CSDN results on search engines (Baidu, Bing, Google)
// @author       uuhc
// @match        *://www.baidu.com/s*
// @match        *://www.google.com/search*
// @match        *://www.bing.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516076/%E5%B1%8F%E8%94%BDCSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20%20Hide%20CSDN%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/516076/%E5%B1%8F%E8%94%BDCSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20%20Hide%20CSDN%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide results based on domain
    function hideCSDNResults() {
        const csdnKeywords = /csdn\.net/i;

        // Baidu
        if (location.host.includes("baidu.com")) {
            document.querySelectorAll('.c-container').forEach((result) => {
                if (result.innerText.match(csdnKeywords)) {
                    result.style.display = 'none';
                }
            });
        }

        // Google
        else if (location.host.includes("google.com")) {
            document.querySelectorAll('.g').forEach((result) => {
                if (result.innerText.match(csdnKeywords)) {
                    result.style.display = 'none';
                }
            });
        }

        // Bing
        else if (location.host.includes("bing.com")) {
            document.querySelectorAll('.b_algo').forEach((result) => {
                if (result.innerText.match(csdnKeywords)) {
                    result.style.display = 'none';
                }
            });
        }
    }

    // Run the function initially and on dynamically loaded content
    hideCSDNResults();
    document.addEventListener('scroll', hideCSDNResults);
})();
