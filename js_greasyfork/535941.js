// ==UserScript==
// @name         复制网址自动打开新标签页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  复制内容中包含网址时自动在新标签打开该网址
// @source        https://github.com/Phinsin666/Copying-a-URL-automatically-opens-a-new-tab
// @author       Phinsin666T
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535941/%E5%A4%8D%E5%88%B6%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/535941/%E5%A4%8D%E5%88%B6%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let lastClipboardText = '';

    document.addEventListener('keydown', async (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
            // 延迟一点读取剪贴板
            setTimeout(async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (!text || text === lastClipboardText) return;

                    lastClipboardText = text;

                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const matches = text.match(urlRegex);
                    if (matches && matches.length > 0) {
                        const url = matches[0];
                        window.open(url, '_blank');
                    }
                } catch (err) {
                    console.warn('无法读取剪贴板内容:', err);
                }
            }, 100);
        }
    });
})();