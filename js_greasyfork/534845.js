// ==UserScript==
// @name         URL별 탭 제목 텍스트 제거기 (간결 + linkkf)
// @namespace    http://tampermonkey.net/
// @version      2.11
// @description  특정 URL에서 탭 제목에 포함된 특정 단어 제거 (MutationObserver 없음)
// @match        *://*/*
// @grant        none
// @author       Lusyeon | 루션
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534845/URL%EB%B3%84%20%ED%83%AD%20%EC%A0%9C%EB%AA%A9%20%ED%85%8D%EC%8A%A4%ED%8A%B8%20%EC%A0%9C%EA%B1%B0%EA%B8%B0%20%28%EA%B0%84%EA%B2%B0%20%2B%20linkkf%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534845/URL%EB%B3%84%20%ED%83%AD%20%EC%A0%9C%EB%AA%A9%20%ED%85%8D%EC%8A%A4%ED%8A%B8%20%EC%A0%9C%EA%B1%B0%EA%B8%B0%20%28%EA%B0%84%EA%B2%B0%20%2B%20linkkf%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const globalRemoveWords = ['무료', '다시보기', '다시 보기', '실시간', '-', '|'];

    const domainConfigs = [
        [/anilife\.app/, '애니라이프', 'anilife'],
        [/tvwiki\d*\.com/, '티비위키', 'tvwiki'],
        [/ohli24/, 'ani24', '애니24'],
        [/tvmon/, '티비몬', 'tvmon'],
        ['linkkf', '😜',' - Anime -','Linkkf', '애니 TV', '(자막 - 더빙)','자막','더빙']
    ];

    const getMatchedWords = () => {
        const url = location.href.toLowerCase();
        let words = [...globalRemoveWords];
        for (const config of domainConfigs) {
            const [pattern, ...siteWords] = config;
            if (
                (pattern instanceof RegExp && pattern.test(url)) ||
                (typeof pattern === 'string' && url.includes(pattern.toLowerCase()))
            ) {
                words.push(...siteWords);
                break;
            }
        }
        return words;
    };

    const updateTitle = () => {
        const titleEl = document.querySelector('title');
        if (!titleEl) return;

        const matchedWords = [...new Set(getMatchedWords())];
        const regex = new RegExp(matchedWords.map(escapeRegExp).join('|'), 'gi');

        const original = titleEl.textContent;
        const cleaned = original.replace(regex, '').trim();

        if (cleaned !== original) {
            titleEl.textContent = cleaned;
            console.log('[LinkKF Debug] 제목 수정됨:', cleaned);
        }
    };

    // 페이지 완전히 로딩 후 실행
    window.addEventListener('load', updateTitle);
})();