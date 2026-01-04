// ==UserScript==
// @name         写个字吧字帖生成网站内容注入
// @namespace    https://github.com/YYTB
// @version      1.1
// @description  获取每日诗词接口提供的文字内容用于写个字吧网站生成字帖
// @author       YYTB
// @match        https://xgzb.top/han
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542769/%E5%86%99%E4%B8%AA%E5%AD%97%E5%90%A7%E5%AD%97%E5%B8%96%E7%94%9F%E6%88%90%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9%E6%B3%A8%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/542769/%E5%86%99%E4%B8%AA%E5%AD%97%E5%90%A7%E5%AD%97%E5%B8%96%E7%94%9F%E6%88%90%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9%E6%B3%A8%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const textarea = document.querySelector('#copybook_content');
        if (textarea) {
            obs.disconnect();
            setupTextarea(textarea);
            fetchAndInjectPoem(textarea);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Check if textarea exists immediately
    const textarea = document.querySelector('#copybook_content');
    if (textarea) {
        observer.disconnect();
        setupTextarea(textarea);
        fetchAndInjectPoem(textarea);
    }

    function setupTextarea(textarea) {
        // Create refresh button
        const button = document.createElement('button');
        button.textContent = '刷新';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontSize = '14px';
        button.style.marginTop = '5px';

        // Insert button after textarea
        textarea.parentNode.insertBefore(button, textarea.nextSibling);

        // Bind click event to fetch and inject poem
        button.addEventListener('click', () => fetchAndInjectPoem(textarea));
    }

    function fetchAndInjectPoem(textarea) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://v1.jinrishici.com/all.json",
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const text = `${data.content}\n${data.origin}\n${data.author}\n${data.category}`;
                    textarea.value = text;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                } catch (e) {
                    console.error('Error parsing API response:', e);
                }
            },
            onerror: function(error) {
                console.error('API request failed:', error);
            }
        });
    }
})();