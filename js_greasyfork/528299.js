// ==UserScript==
// @name         線路と駅と穴を狂気的に強調（特定文限定）
// @namespace    http://atcoder-railway-madness.com
// @version      1.8
// @description  AtCoderの問題文で特定文の中の「線路」「駅に置き換える」「穴 A 関連」を全力で目立たせるジョークスクリプト
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528299/%E7%B7%9A%E8%B7%AF%E3%81%A8%E9%A7%85%E3%81%A8%E7%A9%B4%E3%82%92%E7%8B%82%E6%B0%97%E7%9A%84%E3%81%AB%E5%BC%B7%E8%AA%BF%EF%BC%88%E7%89%B9%E5%AE%9A%E6%96%87%E9%99%90%E5%AE%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528299/%E7%B7%9A%E8%B7%AF%E3%81%A8%E9%A7%85%E3%81%A8%E7%A9%B4%E3%82%92%E7%8B%82%E6%B0%97%E7%9A%84%E3%81%AB%E5%BC%B7%E8%AA%BF%EF%BC%88%E7%89%B9%E5%AE%9A%E6%96%87%E9%99%90%E5%AE%9A%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 強調用のスタイル定義
    const crazyStyle = 'font-size: 30px; color: red; background-color: yellow; font-weight: bold; animation: blink 0.5s infinite; text-decoration: underline wavy blue;';

    // ページのテキストを監視して特定の文を探す
    function emphasizeSpecificWords() {
        const elements = document.querySelectorAll('div, p, span, section, pre, li, h1, h2, h3');
        console.log(`チェック中の要素数: ${elements.length}`);
        
        elements.forEach((el, index) => {
            let html = el.innerHTML;
            console.log(`要素${index}の内容: ${html.substring(0, 100)}...`);

            // 「駅の配置: 更地または線路の区画を1つ選び、」の中の「線路」を1つだけ強調
            if (html.includes('駅の配置: 更地または線路の区画を1つ選び、')) {
                html = html.replace(
                    /(駅の配置: 更地または)線路(の区画を1つ選び、)/,
                    '$1<span style="' + crazyStyle + '">線路</span>$2'
                );
                console.log('「線路」を強調しました');
            }

            // 「駅に置き換える」を強調
            if (html.includes('駅に置き換える')) {
                html = html.replace(
                    /駅に置き換える/g,
                    '<span style="' + crazyStyle + '">駅に置き換える</span>'
                );
                console.log('「駅に置き換える」を強調しました');
            }

            // 「穴 A」関連を検出して <code> を削除して強調
            if (html.toLowerCase().includes('穴 <code>a</code>') || html.toLowerCase().includes('hole <code>a</code>')) {
                html = html.replace(
                    /あなたは初期状態で穴 <code>A<\/code> のマスにいる/gi,
                    '<span style="' + crazyStyle + '">あなたは初期状態で穴 A のマスにいる</span>'
                ).replace(
                    /You are initially at the square with hole <code>A<\/code>/gi,
                    '<span style="' + crazyStyle + '">You are initially at the square with hole A</span>'
                );
                console.log('「穴 A」関連を強調しました（<code>削除済み）');
            }

            el.innerHTML = html;
        });
    }

    // ページ読み込み時に実行
    emphasizeSpecificWords();

    // 動的ロード対応で複数回実行
    setTimeout(emphasizeSpecificWords, 1000);
    setTimeout(emphasizeSpecificWords, 3000);

    // デバッグ用ログ
    console.log("スクリプト実行中: 強調対象を探してます");

    // 点滅アニメーション用のCSSをページに追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();