// ==UserScript==
// @name         X Followings Exporter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Export all X (Twitter) followings to a .txt file
// @author       okiseji
// @match        https://x.com/*/following
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525735/X%20Followings%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/525735/X%20Followings%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const button = document.createElement('button');
    button.textContent = 'EXPORT';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#1DA1F2';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        const followings = new Set();
        let hasMore = true;

        while (hasMore) {
            const elements = document.querySelectorAll('a[href^="/"]');
            elements.forEach(element => {
                const href = element.getAttribute('href');
                if (href) {
                    if (!href.match(/\/[^/]+\/[^/]+/) && !href.startsWith('/search?q=')) {
                        followings.add(`https://x.com${href}`); // 在每个 URL 前面加上 https://x.com
                    }
                }
            });

            window.scrollTo(0, document.body.scrollHeight);

            await new Promise(resolve => setTimeout(resolve, 3000));

            const newElements = document.querySelectorAll('a[href^="/"]');
            if (newElements.length === elements.length) {
                hasMore = false;
            }
        }

        const content = Array.from(followings).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'followings.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Exported ${followings.size} followings to followings.txt!`);
    });
})();