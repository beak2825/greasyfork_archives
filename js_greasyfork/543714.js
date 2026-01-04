// ==UserScript==
// @name         カクヨム平均スコア表示（数値だけ色と太字・精密比較）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  平均スコアの数値のみ色分け（2.80・2.90含め正確に対応）
// @match        https://kakuyomu.jp/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543714/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E5%B9%B3%E5%9D%87%E3%82%B9%E3%82%B3%E3%82%A2%E8%A1%A8%E7%A4%BA%EF%BC%88%E6%95%B0%E5%80%A4%E3%81%A0%E3%81%91%E8%89%B2%E3%81%A8%E5%A4%AA%E5%AD%97%E3%83%BB%E7%B2%BE%E5%AF%86%E6%AF%94%E8%BC%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543714/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E5%B9%B3%E5%9D%87%E3%82%B9%E3%82%B3%E3%82%A2%E8%A1%A8%E7%A4%BA%EF%BC%88%E6%95%B0%E5%80%A4%E3%81%A0%E3%81%91%E8%89%B2%E3%81%A8%E5%A4%AA%E5%AD%97%E3%83%BB%E7%B2%BE%E5%AF%86%E6%AF%94%E8%BC%83%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const handledWorks = new Set();

    window.addEventListener('load', () => {
        setTimeout(() => {
            const links = Array.from(document.querySelectorAll('a[href^="/works/"]'));
            const uniqueLinks = [...new Set(links.map(a => a.href))];

            for (const url of uniqueLinks) {
                const workId = url.split('/works/')[1];
                if (!workId || handledWorks.has(workId)) continue;
                handledWorks.add(workId);
                fetchWorkAverage(url, workId);
            }
        }, 2000);
    });

    async function fetchWorkAverage(url, workId) {
        try {
            const res = await fetch(url);
            const html = await res.text();

            const jsonText = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)?.[1];
            if (!jsonText) throw new Error('JSONデータが見つかりません');

            const json = JSON.parse(jsonText);
            const state = json.props?.pageProps?.__APOLLO_STATE__;
            const workKey = Object.keys(state).find(k => k.startsWith('Work:') && k.includes(workId));

            if (!workKey || !state[workKey]) throw new Error('Workデータが見つかりません');

            const reviewCount = Number(state[workKey].reviewCount);
            const totalReviewPoint = Number(state[workKey].totalReviewPoint);
            if (reviewCount === 0) return;

            const avgRaw = totalReviewPoint / reviewCount;
            const avgRounded = Math.round(avgRaw * 100) / 100; // 数値として丸める
            const avgDisplay = avgRounded.toFixed(2); // 表示用文字列

            const anchor = document.querySelector(`a[href="/works/${workId}"]`);
            if (!anchor) return;

            const info = document.createElement('div');
            info.style.fontSize = '13px';
            info.style.marginTop = '4px';
            info.style.color = '#444';

            const spanScore = document.createElement('span');
            spanScore.textContent = avgDisplay;

            // 数値条件を精密に評価
            if (avgRounded >= 2.90) {
                spanScore.style.color = 'red';
                spanScore.style.fontWeight = 'bold';
            } else if (avgRounded >= 2.80) {
                spanScore.style.color = 'green';
                spanScore.style.fontWeight = 'bold';
            }

            info.appendChild(document.createTextNode('📊 平均スコア: '));
            info.appendChild(spanScore);
            info.appendChild(document.createTextNode(`（${reviewCount}件）`));

            const parent = anchor.closest('div[class^="WorkSummaryItem_root"]') || anchor.parentElement;
            if (parent) parent.appendChild(info);

        } catch (e) {
            console.warn(`❌ ${workId} の取得に失敗しました:`, e);
        }
    }
})();
