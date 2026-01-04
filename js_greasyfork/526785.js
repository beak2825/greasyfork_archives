// ==UserScript==
// @name         zi.tools Comparison字体适配
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加载Noto Sans CJK，并根据lang属性设置相应变种的字体
// @license      Apache-2.0
// @author       SkyEye_FAST
// @match        *://zi.tools/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526785/zitools%20Comparison%E5%AD%97%E4%BD%93%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/526785/zitools%20Comparison%E5%AD%97%E4%BD%93%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = [
        { rel: 'preconnect', href: 'https://fonts.font.im' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.font.im', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.font.im/css2?family=Noto+Sans+HK&family=Noto+Sans+JP&family=Noto+Sans+KR&family=Noto+Sans+SC&family=Noto+Sans+TC&display=swap' }
    ];

    links.forEach(attrs => {
        const link = document.createElement('link');
        for (const key in attrs) {
            link.setAttribute(key, attrs[key]);
        }
        document.head.appendChild(link);
    });

    const style = document.createElement('style');
    style.textContent = `
        [lang="zh-CN"], [lang="zh-Hans-CN"] { font-family: 'Noto Sans SC', sans-serif !important; }
        [lang="zh-HK"], [lang="zh-Hant-HK"] { font-family: 'Noto Sans HK', sans-serif !important; }
        [lang="zh-TW"], [lang="zh-Hant-TW"] { font-family: 'Noto Sans TC', sans-serif !important; }
        [lang="ja"], [lang="ja-JP"] { font-family: 'Noto Sans JP', sans-serif !important; }
        [lang="ko"], [lang="ko-KR"] { font-family: 'Noto Sans KR', sans-serif !important; }
    `;
    document.head.appendChild(style);
})();
