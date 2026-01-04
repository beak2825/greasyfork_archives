// ==UserScript==
// @name         Narou API Info (in box)
// @namespace    haaarug
// @version      2.8
// @description  なろうの小説トップページになろう小説APIで取得した作品情報を表示、キーワード強調、30分間同一タブ内キャッシュ保存、作者ページリンク
// @license      CC0
// @match        https://ncode.syosetu.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.syosetu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538411/Narou%20API%20Info%20%28in%20box%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538411/Narou%20API%20Info%20%28in%20box%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const NGwords = ["残酷", "NG2", "NG3", "NG4", "NG5"];
    const OKwords = ["異世界", "OK2", "OK3", "OK4", "OK5"];

    //同一タブ内キャッシュ保持時間
    const TTL_MINUTES = 30;

    // 話数ページではなく作品トップページかを確認
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length !== 1) return;

    const match = pathSegments[0].match(/^(n\d+[a-z]+)$/i);
    if (!match) return;

    const ncode = match[1].toLowerCase();
    const apiUrl = `https://api.syosetu.com/novelapi/api/?out=json&of=e-i-k-l-gl-ga-g&ncode=${encodeURIComponent(ncode)}`;
    const cacheKey = `novelInfo_${ncode}`;

    function getCachedData() {
        const raw = sessionStorage.getItem(cacheKey);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            const now = Date.now();
            if (now - parsed.timestamp < TTL_MINUTES * 60 * 1000) {
                return parsed.data;
            } else {
                sessionStorage.removeItem(cacheKey);
                return null;
            }
        } catch {
            sessionStorage.removeItem(cacheKey);
            return null;
        }
    }

    function saveToCache(data) {
        sessionStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    }

    // タイトルの取得
    const titleElement = document.querySelector('h1.p-novel__title');
    const title = titleElement ? titleElement.textContent.trim() : '不明';
    // 作者名の取得
    const authorElement = document.querySelector('div.p-novel__author a');
    const writer = authorElement ? authorElement.textContent.trim() : '不明';
    // 作者マイページの取得
    const authorLinkElement = document.querySelector('.p-novel__author a');
    const authorPageUrl = authorLinkElement ? authorLinkElement.href : 'URL不明';

    // 情報表示ボックス
    function createInfoBox(data, source = "API") {
        const allcount = data.allcount || '不明';
        const status = data.end === 0 ? '完結' : '連載中❌';
        const eternal = data.isstop === 0 ? '' : '⚠️エタ？⚠️';
        const keywords = data.keyword || '不明';
        const highlightedKeywords = keywords.split(" ").map(word => {
            if (NGwords.some(ng => word.includes(ng))) {
                return `<span style="color: red; font-weight: bold; font-size: 22px;">${word}</span>`;
            } else if (OKwords.some(ok => word.includes(ok))) {
                return `<span style="color: green;">${word}</span>`;
            } else {
                return `${word}`;
            }
        }).join(" ");

        const length = data.length ? data.length.toLocaleString() + '文字' : '不明';
        const general_lastup = data.general_lastup || '不明';
        const general_all_no = data.general_all_no ? data.general_all_no.toLocaleString() + '話' : '不明';

        const genreMap = {
            0: '未選択〔未選択〕', 101: '異世界〔恋愛〕', 102: '現実世界〔恋愛〕',
            201: 'ハイファンタジー〔ファンタジー〕', 202: 'ローファンタジー〔ファンタジー〕',
            301: '純文学〔文芸〕', 302: 'ヒューマンドラマ〔文芸〕', 303: '歴史〔文芸〕',
            304: '推理〔文芸〕', 305: 'ホラー〔文芸〕', 306: 'アクション〔文芸〕',
            307: 'コメディー〔文芸〕', 401: 'VRゲーム〔SF〕', 402: '宇宙〔SF〕',
            403: '空想科学〔SF〕', 404: 'パニック〔SF〕',
            9901: '童話〔その他〕', 9902: '詩〔その他〕', 9903: 'エッセイ〔その他〕',
            9904: 'リプレイ〔その他〕', 9999: 'その他〔その他〕', 9801: 'ノンジャンル〔ノンジャンル〕'
        };

        const genreText = genreMap[data.genre] || '不明ジャンル';

        // 更新ボタン
        const refreshButtonHTML = `
            <button id="refresh-button" style="
                font-size: 13px;
                margin-left: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #888;
                cursor: pointer;
            ">🔄 再取得</button>
        `;

        //評価をつけた作品一覧
        const hyoukaUrl = title ? `https://www.google.com/search?q=${encodeURIComponent(`site:mypage.syosetu.com/mypagenovelhyoka/list "${title}"`)}` : null;
        //ブックマーク一覧
        const bookmarkUrl = title ? `https://www.google.com/search?q=${encodeURIComponent(`site:mypage.syosetu.com/mypagefavnovelmain/list "${title}"`)}` : null;

        const infoBox = document.createElement('div');
        infoBox.id = "novel-info-box";
        infoBox.style.cssText = `
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            width: 333px;
            height: auto;
            position: fixed;
            top: 50px;
            left: 0px;
            z-index: 9999;
            font-size: 18px;
            line-height: 1.6;
            color: #333;
            padding: 15px;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            border-radius: 8px;
        `;

        if (data.allcount === 0) {
            infoBox.innerHTML = `
                <strong>📚</strong> ${title}<br>
                <strong>🖋️</strong> <a href="${authorPageUrl}" target="_blank" style="text-decoration: underline;">${writer}</a><br>
                <div style="height: 10px;"></div>
                <strong style="color: red;">取得失敗。</strong><br>
                <small>開示設定：検索除外中 の場合取得できません。</small><br>
                <div style="height: 10px;"></div>
                <small>🔖 <a href="${bookmarkUrl}" target="_blank" style="text-decoration: underline;">ブクマされている作品一覧ページ🔍</a></small><br>
                <small>🩷 <a href="${hyoukaUrl}" target="_blank" style="text-decoration: underline;">評価されている作品一覧ページ🔍</a></small><br>
            `;
        } else {
            infoBox.innerHTML = `
                <strong>📚</strong> ${title}<br>
                <strong>🖋️</strong> <a href="${authorPageUrl}" target="_blank" style="text-decoration: underline;">${writer}</a><br>
                <div style="height: 10px;"></div>
                <strong>📝</strong> ${genreText}<br>
                <strong>🔑</strong> ${highlightedKeywords}<br>
                <div style="height: 10px;"></div>
                <strong>🔤 文字数:</strong> ${length}<br>
                <strong>📖 全</strong> ${general_all_no}<br>
                <strong>📅 最新掲載日:</strong> ${general_lastup}<br>
                <strong>✍️ </strong> ${status} <strong style="color: red;"> ${eternal}</strong><br>
                <small style="color: gray;">[取得: ${source}]</small> ${refreshButtonHTML}<br>
                <div style="height: 10px;"></div>
                <small>🔖 <a href="${bookmarkUrl}" target="_blank" style="text-decoration: underline;">ブクマされている作品一覧ページ🔍</a></small><br>
                <small>🩷 <a href="${hyoukaUrl}" target="_blank" style="text-decoration: underline;">評価されている作品一覧ページ🔍</a></small><br>
           `;
        }

        // 再取得ボタンにイベント追加
        setTimeout(() => {
            const refreshBtn = document.getElementById("refresh-button");
            if (refreshBtn) {
                refreshBtn.onclick = () => fetchFromAPI(true);
            }
        }, 0);

        return infoBox;
    }

    // 開閉ボタン
    function insertControls(infoBox) {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'ℹ️';
        toggleButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            padding: 5px;
            font-size: 14px;
            border-radius: 5px;
            border: 1px solid #888;
            background: #f0f0f0;
            cursor: pointer;
        `;
        toggleButton.onclick = () => {
            infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none';
        };

        document.body.appendChild(toggleButton);
    }

    // APIリクエスト
    function fetchFromAPI(force = false) {
         // キャッシュが存在し、手動でなければ再取得不要
        if (!force && getCachedData()) {
            return;
        }

       GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: { 'Accept': 'application/json' },
            onload: function (response) {
                try {
                    const json = JSON.parse(response.responseText);

                    const data = Object.assign({}, json[0], json[1]);
                    saveToCache(data);

                    const oldBox = document.getElementById('novel-info-box');
                    if (oldBox) oldBox.remove();

                    const box = createInfoBox(data, force ? "API（手動）" : "API");
                    document.body.appendChild(box);
                } catch (e) {
                    console.error('JSON解析エラー:', e);
                }
            },
            onerror: function (err) {
                console.error('API通信エラー:', err);
            }
        });
    }

    // メイン処理
    const cached = getCachedData();
    const box = createInfoBox(cached || {}, cached ? "キャッシュ" : "API");
    document.body.appendChild(box);
    insertControls(box);
    if (!cached) {
        fetchFromAPI();
    }

})();
