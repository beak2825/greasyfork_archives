// ==UserScript==
// @name           Hide suggested follows inserted within Twitter tweets
// @name:ja        ツイート中に挟まれるおすすめフォローと話題検索ページの特定ジャンルを非表示
// @namespace      http://tampermonkey.net/
// @version        0.13.6(テスト。Explore初期表示即時非表示対応)
// @description    Hide Twitter elements based on specific conditions and hide certain topics in explore page. Also hide tweets with low like counts.
// @description:ja 特定条件に基づいてTwitterの要素を非表示にし、話題検索ページの特定ジャンルも非表示にする。さらに「いいね数」が閾値以下のツイートを非表示。
// @author         kmikrt
// @license        MIT
// @match          *://twitter.com/*
// @match          *://mobile.twitter.com/*
// @match          *://x.com/*
// @match          *://mobile.x.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/526524/Hide%20suggested%20follows%20inserted%20within%20Twitter%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/526524/Hide%20suggested%20follows%20inserted%20within%20Twitter%20tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** ─────────────────────────────────────────────────────────────────
     *  設定：ここだけ好きに変えてOK
     *  いいね数がこの値「以下」のツイートを非表示にします
     *  例）500, 2000, 10000 など
     *  ───────────────────────────────────────────────────────────────── */
    const LIKE_THRESHOLD = 500;

    /** 早期非表示用スタイル（exploreページのcellInnerDivを一旦全部隠す） */
    const earlyHideStyle = document.createElement('style');
    earlyHideStyle.textContent = [
        'body.explore-init-hide div.css-175oi2r[data-testid="cellInnerDiv"]{display:none !important;}'
    ].join('');
    document.documentElement.appendChild(earlyHideStyle);

    /** 数値文字列を整数に変換（日本語の万/億、英語のK/M/B、カンマ対応） */
    function parseCount(text) {
        if (!text) return null;
        const s = String(text).replace(/\s/g, '');

        // 日本語単位
        const oku = s.match(/([\d.,]+)億/);
        if (oku) return Math.round(parseFloat(oku[1].replace(/,/g, '')) * 100000000);
        const man = s.match(/([\d.,]+)万/);
        if (man) return Math.round(parseFloat(man[1].replace(/,/g, '')) * 10000);

        // 英語単位
        const b = s.match(/([\d.,]+)B/i);
        if (b) return Math.round(parseFloat(b[1].replace(/,/g, '')) * 1e9);
        const m = s.match(/([\d.,]+)M/i);
        if (m) return Math.round(parseFloat(m[1].replace(/,/g, '')) * 1e6);
        const k = s.match(/([\d.,]+)K/i);
        if (k) return Math.round(parseFloat(k[1].replace(/,/g, '')) * 1e3);

        // プレーンな数値（カンマ区切り対応）
        const plain = s.match(/(\d[\d,]*)/);
        if (plain) return parseInt(plain[1].replace(/,/g, ''), 10);

        return null;
    }

    /** セル内から「いいね」数を頑健に取得 */
    function getLikeCountFromCell(cell) {
        const likeBtn = cell.querySelector('button[data-testid="like"]');
        if (!likeBtn) return null;

        // 1) aria-label
        const aria = likeBtn.getAttribute('aria-label') || '';
        let n = parseCount(aria);
        if (Number.isFinite(n)) return n;

        // 2) 画面表示テキスト
        const visibleSpan = likeBtn.querySelector('[data-testid="app-text-transition-container"] span');
        if (visibleSpan) {
            n = parseCount(visibleSpan.textContent);
            if (Number.isFinite(n)) return n;
        }

        // 3) フォールバック
        n = parseCount(likeBtn.textContent || '');
        return Number.isFinite(n) ? n : null;
    }

    function hideElements() {
        if (
            location.href.includes('/messages') ||
            location.href.includes('/notifications') ||
            location.href.includes('list') ||
            location.href.includes('media') ||
            location.href.includes('/settings') ||
            location.href.includes('/photo') ||
            location.href.includes('/video') ||
            location.href.includes('/follow') ||
            location.href.includes('/status') ||
            location.href.includes('query&f=user') ||
            location.href.includes('/report/dm_conversation') ||
            location.href.includes('/topics')
        ) {
            return;
        }

        const isExplorePage = (
            location.pathname === "/explore" ||
            location.pathname === "/explore/" ||
            location.pathname === "/explore/tabs/for_you"
        );

        const elements = document.querySelectorAll('div.css-175oi2r[data-testid="cellInnerDiv"]');

        elements.forEach(element => {
            let hideElement = true;

            const spans = element.querySelectorAll('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-1tl8opc');
            spans.forEach(span => {
                if (span.textContent.includes("トレンド") || span.textContent.includes("ポストのエンゲージメントを表示")) {
                    hideElement = false;
                }
                if (span.textContent.includes("人気の動画") || span.textContent.includes("おすすめ動画")) {
                    hideElement = true;
                }
            });

            const buttons = element.querySelectorAll('button[aria-label*="件の返信"]');
            if (buttons.length > 0) {
                hideElement = false;
            }

            if (isExplorePage) {
                const likeCount = getLikeCountFromCell(element);
                if (Number.isFinite(likeCount) && likeCount <= LIKE_THRESHOLD) {
                    hideElement = true;
                }
            }

            if (hideElement) {
                element.style.display = 'none';
            }
        });

        // exploreページ初期読み込み時のスタイル解除
        if (isExplorePage) {
            document.body.classList.remove('explore-init-hide');
        }
    }

    function hideExploreTopics() {
        if (!location.pathname.startsWith('/explore')) return;

        const targetTopics = ["スポーツ", "エンターテインメント"];
        let hideMode = false;

        const elements = document.querySelectorAll('div.css-175oi2r[data-testid="cellInnerDiv"]');

        elements.forEach(el => {
            const headingSpan = el.querySelector('h2 span');

            if (headingSpan && headingSpan.textContent.includes("おすすめ投稿")) {
                hideMode = false;
                return;
            }

            if (headingSpan && targetTopics.some(topic => headingSpan.textContent.includes(topic))) {
                hideMode = true;
            }

            if (hideMode) {
                el.style.display = 'none';
            }
        });
    }

    // rapidHideLoop（exploreページのみ2秒間高速ループ）
    let rapidHideTimer = null;
    function startRapidHideIfExplore() {
        if (!location.pathname.startsWith('/explore')) return;
        document.body.classList.add('explore-init-hide');
        const start = performance.now();
        const loop = () => {
            hideElements();
            hideExploreTopics();
            if (performance.now() - start < 2000) {
                rapidHideTimer = requestAnimationFrame(loop);
            } else {
                document.body.classList.remove('explore-init-hide');
            }
        };
        if (rapidHideTimer) cancelAnimationFrame(rapidHideTimer);
        loop();
    }

    // 初回実行
    hideElements();
    hideExploreTopics();
    startRapidHideIfExplore();

    const observer = new MutationObserver(() => {
        hideElements();
        hideExploreTopics();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            hideElements();
            hideExploreTopics();
            startRapidHideIfExplore();
        }
    }).observe(document, { subtree: true, childList: true });
})();
