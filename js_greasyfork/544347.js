// ==UserScript==
// @name         Pokemon Showdown一键复制rep链接
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在pokemon showdown replay添加一个按钮用于一键复制所有回放链接以便复制到replay scouter中
// @author       You
// @match        https://replay.pokemonshowdown.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/544347/Pokemon%20Showdown%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6rep%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/544347/Pokemon%20Showdown%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6rep%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .export-replay-button {
            background-color: #4CAF50;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 15px; 
            vertical-align: middle; 
        }
        .export-replay-button:hover {
            background-color: #45a049;
        }
    `);

    const checkInterval = setInterval(() => {
        const targetElement = document.querySelector('.main h1');
        if (targetElement && !document.querySelector('.export-replay-button')) {
            clearInterval(checkInterval);

            let exportButton = document.createElement('button');
            exportButton.innerHTML = '复制所有回放链接';
            exportButton.className = 'export-replay-button';

            targetElement.appendChild(exportButton);

            exportButton.addEventListener('click', () => {
                const linkElements = document.querySelectorAll('ul.linklist a.blocklink');
                if (linkElements.length > 0) {
                    const links = Array.from(linkElements).map(a => a.href);
                    const linksText = links.join('\n');

                    GM_setClipboard(linksText, 'text');

                    exportButton.innerHTML = `已复制 ${links.length} 条链接！`;
                    setTimeout(() => {
                        exportButton.innerHTML = '复制所有回放链接';
                    }, 2000); 
                } else {
                    exportButton.innerHTML = '未找到链接';
                     setTimeout(() => {
                        exportButton.innerHTML = '复制所有回放链接';
                    }, 2000);
                }
            });
        }
    }, 500);

})();