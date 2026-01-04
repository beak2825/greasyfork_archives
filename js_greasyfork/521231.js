// ==UserScript==
// @name         琉璃神社链接显示
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.5
// @description  将琉璃神社隐藏的链接高亮显示并可直接打开
// @author       Moe
// @include      /https:\/\/www\.hacg\.[a-z]+\/wp\/[0-9]+\.html.*/
// @include      /https:\/\/www\.llss\.[a-z]+\/wp\/[0-9]+\.html.*/
// @icon         https://www.hacg.me/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521231/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521231/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const magnets = [];

    const magnetNumberElement = document.createElement('a');
    magnetNumberElement.style.color = '#1982d1';
    magnetNumberElement.style.fontWeight = 'bold';

    const regex = new RegExp('(?:magnet:\?xt=urn:btih:)?([a-fA-F0-9]{40})', 'g');
    const content = document.querySelector('.entry-content');
    content.innerHTML = content.innerHTML.replace(regex, (_match, s1) => {
        magnets.push(s1);

        magnetNumberElement.href = `magnet:?xt=urn:btih:${s1}`;
        magnetNumberElement.textContent = `magnet:?xt=urn:btih:${s1}`;

        return magnetNumberElement.outerHTML;
    });

    if(magnets.length > 0) {
        const magnetNumberElement = document.createElement('span');
        magnetNumberElement.style.fontWeight = 'bold';
        magnetNumberElement.style.fontSize = '1rem';
        magnetNumberElement.textContent = `发现${magnets.length}个磁力链接`;

        const smallFontElement = document.createElement('span');
        smallFontElement.style.color = '#1982d1';
        smallFontElement.style.fontSize = '12px';

        const copyElement = document.createElement('span');
        copyElement.style.cursor = 'pointer';
        copyElement.textContent = '复制到剪贴板';

        const openElement = document.createElement('span');
        openElement.style.cursor = 'pointer';
        openElement.textContent = '全部打开';

        smallFontElement.appendChild(copyElement);
        smallFontElement.appendChild(document.createTextNode(' '));
        smallFontElement.appendChild(openElement);

        const entryTitle = document.querySelector("h1.entry-title");
        entryTitle.parentNode.insertBefore(magnetNumberElement, entryTitle);
        entryTitle.parentNode.insertBefore(document.createTextNode(' '), entryTitle);
        entryTitle.parentNode.insertBefore(smallFontElement, entryTitle);

        copyElement.addEventListener('click', () => {
            let magnets_text = '';
            magnets.forEach(magnet => {
                magnets_text += `magnet:?xt=urn:btih:${magnet}\n`
            });
            navigator.clipboard.writeText(magnets_text);
            alert(`${magnets.length}个磁力链接已复制到剪贴板！\n\n${magnets_text}`);
        });

        magnets.forEach(magnet => {
            openElement.addEventListener('click', () => {
                window.open(`magnet:?xt=urn:btih:${magnet}`);
            });
        });
    }
})();
