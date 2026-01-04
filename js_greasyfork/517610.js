// ==UserScript==
// @name msec-bluesky
// @namespace https://twitter.com/senanense
// @version 0.5
// @description Bluesky Web App で投稿時刻を常にミリ秒まで表示
// @author @senanense
// @match https://bsky.app/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517610/msec-bluesky.user.js
// @updateURL https://update.greasyfork.org/scripts/517610/msec-bluesky.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 投稿詳細URLを確認
    const currentURL = window.location.href;

    // Fetch APIで投稿データを取得
    fetch("https://events.bsky.app/rgstr", {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            // タイムスタンプを取得
            const eventData = data.events[0];
            if (eventData && eventData.time) {
                const timestampMs = eventData.time; // ミリ秒単位のタイムスタンプ

                // タイムスタンプをフォーマット
                const date = new Date(timestampMs);
                const formattedTime = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 `
                    + `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`;

                // 投稿の上部に表示
                const targetElement = document.querySelector("h1"); // 投稿タイトル付近を仮定
                if (targetElement) {
                    const timeElement = document.createElement("div");
                    timeElement.style.color = "gray";
                    timeElement.style.fontSize = "14px";
                    timeElement.textContent = `投稿日時: ${formattedTime}`;
                    targetElement.parentNode.insertBefore(timeElement, targetElement.nextSibling);
                }
            }
        })
        .catch(error => console.error("データ取得エラー:", error));
})();