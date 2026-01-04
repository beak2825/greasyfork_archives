// ==UserScript==
// @name         Livepocket add info
// @namespace    https://t.livepocket.jp/
// @version      0.1
// @description  Show event_ticket_groups
// @author       4Y4M3
// @match        https://t.livepocket.jp/e/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525404/Livepocket%20add%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/525404/Livepocket%20add%20info.meta.js
// ==/UserScript==

(function() {
    // 指定されたフォームのインプット要素を表示状態に変更
    const hiddenInput = document.getElementById("event_ticket_groups");

    if (hiddenInput) {
        const jsonData = JSON.parse(hiddenInput.value);

        // フォーマットされたJSON文字列を作成
        const formattedJson = JSON.stringify(jsonData, null, 2);

        // 表示するためのエリアを作成
        const pre = document.createElement("pre");
        pre.textContent = formattedJson;
        pre.style.padding = "5px";
        pre.style.border = "1px solid #d9e0e0";
        pre.style.overflow = "auto";
        pre.style.height = "200px";
        pre.style.marginBottom = "10px";

        // フォームの直後にフォーマット済みJSONを表示
        hiddenInput.insertAdjacentElement("afterend", pre);
    }
})();