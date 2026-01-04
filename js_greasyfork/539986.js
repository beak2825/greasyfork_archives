// ==UserScript==
// @name         AtCoder-Favorite-Person-Colors
// @namespace    https://ruku.tellpro.net
// @version      2025-06-19-ver3
// @description  AtCoderのお気に入り管理のユーザーに色がつきます＋レート順ソート（テーブル2つ対応）
// @author       ruku
// @match        https://atcoder.jp/settings/fav
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539986/AtCoder-Favorite-Person-Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/539986/AtCoder-Favorite-Person-Colors.meta.js
// ==/UserScript==

const diffToColor = (diff) => {
    if(diff === 0) return "black";
    if(diff <= 399) return "#808080";
    if(diff <= 799) return "#804000";
    if(diff <= 1199) return "#008000";
    if(diff <= 1599) return "#00C0C0";
    if(diff <= 1999) return "#0000FF";
    if(diff <= 2399) return "#C0C000";
    if(diff <= 2799) return "#FF8000";
    return "#FF0000";
};

(function() {
    'use strict';
    const users = document.querySelectorAll("td a[href^='/users/']");
    const userElements = Array.from(users);
    const processed = new Set();
    const userRatingMap = {};

    // --- テーブルごとにトグルボタン追加 ---
    const tables = Array.from(document.querySelectorAll("table"));
    tables.forEach((table, tableIdx) => {
        const tbody = table.querySelector("tbody");
        if (!tbody) return;
        const rows = Array.from(tbody.querySelectorAll("tr"));

        // 元の順序保存
        rows.forEach((tr, i) => tr.setAttribute("data-original-index", i));

        // ボタン作成
        const btn = document.createElement("button");
        btn.textContent = "Sort by Rating: OFF";
        btn.style.margin = "8px";
        btn.style.background = "#eee";
        let sorted = false;

        btn.onclick = function() {
            if (!sorted) {
                // レート順（降順）でソート
                rows.sort((a, b) => {
                    const userA = a.querySelector("a[href^='/users/']")?.textContent.trim();
                    const userB = b.querySelector("a[href^='/users/']")?.textContent.trim();
                    const rateA = userRatingMap[userA] ?? 0;
                    const rateB = userRatingMap[userB] ?? 0;
                    return rateB - rateA;
                });
                btn.textContent = "Sort by Rating: ON";
                btn.style.background = "#cceeff";
                sorted = true;
            } else {
                // 元の順序に戻す
                rows.sort((a, b) => {
                    return Number(a.getAttribute("data-original-index")) - Number(b.getAttribute("data-original-index"));
                });
                btn.textContent = "Sort by Rating: OFF";
                btn.style.background = "#eee";
                sorted = false;
            }
            // 並び替え
            rows.forEach(tr => tbody.appendChild(tr));
        };

        // テーブルの前にボタンを追加
        table.parentNode.insertBefore(btn, table);
    });

    // --- 色付け・レート取得は非同期で ---
    (async function() {
        for(const userElem of userElements){
            const user = userElem.textContent.trim();
            if(!user) continue;
            if(processed.has(user)) continue;
            processed.add(user);

            try {
                const response = await fetch(`https://kenkoooo.com/atcoder/proxy/users/${user}/history/json`);
                if (!response.ok) continue;
                const data = await response.json();
                if (data.length === 0) continue;
                const lastColor = data[data.length - 1].NewRating;
                const color = diffToColor(lastColor);
                userRatingMap[user] = lastColor;

                userElements
                    .filter(el => el.textContent.trim() === user)
                    .forEach(el => {
                        el.style.color = color;
                        // (Rate)を追加
                        if (!el.nextSibling || !el.nextSibling.classList || !el.nextSibling.classList.contains('atcoder-rate-label')) {
                            const rateSpan = document.createElement('span');
                            rateSpan.textContent = ` (${lastColor})`;
                            rateSpan.className = 'atcoder-rate-label';
                            rateSpan.style.color = color;
                            el.parentNode.insertBefore(rateSpan, el.nextSibling);
                        }
                    });
            } catch (e) {
                // ignore
            }
        }
    })();
})();