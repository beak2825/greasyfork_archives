// ==UserScript==
// @name         Force Font to Pretendard Variable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force all fonts on a webpage to use Pretendard Variable
// @author       Heetaek Woo
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504477/Force%20Font%20to%20Pretendard%20Variable.user.js
// @updateURL https://update.greasyfork.org/scripts/504477/Force%20Font%20to%20Pretendard%20Variable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 링크가 없는 경우, Pretendard Variable 폰트 링크를 추가
    const fontLink = document.createElement('link');
    fontLink.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // 모든 텍스트 요소에 Pretendard Variable 적용
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            font-family: 'Pretendard Variable', sans-serif !important;
        }
    `;
    document.head.appendChild(style);
})();