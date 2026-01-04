// ==UserScript==
// @name         2048论坛直接显示磁链链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在2048论坛理不用打开链接直接显示磁链链接
// @author       Paul Jonas
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531332/2048%E8%AE%BA%E5%9D%9B%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E7%A3%81%E9%93%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/531332/2048%E8%AE%BA%E5%9D%9B%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E7%A3%81%E9%93%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUrlPattern = /^https?:\/\/bt\.[^\/]+\.com\/list\.php\?name=/;

    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        const url = link.href;

        if (!targetUrlPattern.test(url)) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const html = response.responseText;

                const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g;
                const magnetLinks = html.match(magnetRegex);

                if (magnetLinks && magnetLinks.length > 0) {
                    const magnetContainer = document.createElement('div');
                    magnetContainer.style.marginTop = '5px';
                    magnetContainer.style.color = 'blue';

                    magnetLinks.forEach(magnetLink => {
                        const magnetElement = document.createElement('a');
                        magnetElement.href = magnetLink;
                        magnetElement.textContent = magnetLink;
                        magnetElement.style.display = 'block';
                        magnetContainer.appendChild(magnetElement);
                    });

                    link.parentNode.insertBefore(magnetContainer, link.nextSibling);
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
            }
        });
    });
})();