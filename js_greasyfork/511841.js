// ==UserScript==
// @name tapd-copy-rich-link
// @version 2024-10-08
// @namespace http://tampermonkey.net/
// @description TAPD 复制富文本链接
// @author Will Huang
// @license https://opensource.org/licenses/MIT
// @match https://www.tapd.cn/*/prong/stories/view*
// @downloadURL https://update.greasyfork.org/scripts/511841/tapd-copy-rich-link.user.js
// @updateURL https://update.greasyfork.org/scripts/511841/tapd-copy-rich-link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const li = document.querySelector('li div#title-copy-btn-new');
    if (!li) return;
    const data = li.getAttribute('data-clipboard-text');
    const p = data.indexOf('https://');
    let text = data.slice(0, p - 1);
    if (text[0] === '【' && text[text.length - 1] === '】') {
        text = text.slice(1, -1);
    }
    const link = data.slice(p);
    const newLi = document.createElement('li');
    newLi.innerHTML = `<div>复制富文本链接</div>`;
    newLi.addEventListener('click', () => {
        navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([`<a href="${link}">${text}</a>`], {type: 'text/html'})
            })
        ]);
    });
    li.parentNode.insertBefore(newLi, li);
})();
