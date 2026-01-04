// ==UserScript==
// @name         피싱 링크 차단기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  @ 포함된 http/https 링크 중 피싱 목적 링크만 [Blocked URL]로 대체
// @icon         https://raw.githubusercontent.com/githubkorean/Link-Blocker/refs/heads/main/icon.png
// @author       mickey90427@naver.com
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533817/%ED%94%BC%EC%8B%B1%20%EB%A7%81%ED%81%AC%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533817/%ED%94%BC%EC%8B%B1%20%EB%A7%81%ED%81%AC%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const customUrl = 'https://www.google.com';  // 커스텀 리디렉션 링크

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('mailto:')) return;

        if ((href.startsWith('http://') || href.startsWith('https://')) && href.includes('@')) {
            try {
                const url = new URL(href, window.location.href);
                const userInfoExists = url.username || href.match(/https?:\/\/[^\/]+@/);

                if (userInfoExists) {
                    // 피싱 가능성이 있는 링크만 차단
                    const overlay = document.createElement('a');
                    overlay.href = customUrl;
                    overlay.target = '_blank';
                    overlay.textContent = '[Blocked URL]';
                    overlay.style.color = 'red';
                    overlay.style.fontWeight = 'bold';
                    overlay.style.textDecoration = 'underline';
                    overlay.style.cursor = 'pointer';

                    link.replaceWith(overlay);
                }
            } catch (e) {
                // URL 파싱 실패 시 무시
            }
        }
    });

})();
