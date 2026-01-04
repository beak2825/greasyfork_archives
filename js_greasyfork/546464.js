// ==UserScript==
// @name         bugly-copy
// @namespace    http://tampermonkey.net/
// @version      2025-08-19
// @description  拷贝bugly中的"出错堆栈"
// @author       noname
// @license      MulanPSL-2.0
// @match        https://bugly.qq.com/v2/crash-reporting/crashes/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/546464/bugly-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/546464/bugly-copy.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const buttonStyle = ` background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            z-index: 999;
            position: absolute;
            right: 2rem;
            top: 26rem;
            border-radius: 4px;`;

    const setup = () => {
        const container = document.querySelector('div.marginbottom20');
        if (!container) {
            console.log('no div container');
            return;
        }


        const title = container.firstChild;
        if (!title) {
            console.log('no div title');
            return;
        }

        const switchDiv = title.querySelector('div.switch');
        if (!switchDiv) {
            console.log('no div swith');
            return;
        }


        const copy = () => {
            const titleLines = Array.from(title.querySelector('div:nth-child(2) > div').childNodes);
            const titleContent = titleLines.map(e => e.textContent).join('\n');

            const body = container.lastChild;
            const bodyLines = Array.from(body.firstChild.childNodes).map(e => e.querySelector('div > div:nth-child(2)').textContent);
            const bodyContent = bodyLines.join('\n');
            const text = `${titleContent}\n${bodyContent}`;

            GM_setClipboard(text, 'text', () => console.debug("Clipboard set!"));
        };

        const btn = document.createElement('button');
        btn.textContent = '复制';
        btn.className = 'copy-btn';
        btn.addEventListener('click', copy);
        btn.style = buttonStyle;
        document.body.appendChild(btn);
    };

    setTimeout(setup, 3000);
})();