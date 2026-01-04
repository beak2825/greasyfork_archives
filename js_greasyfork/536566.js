// ==UserScript==
// @name         虚言癖の拡張機能マネージャー(仮)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  拡張機能マネージャー
// @author       You
// @match        https://pictsense.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536566/%E8%99%9A%E8%A8%80%E7%99%96%E3%81%AE%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%28%E4%BB%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536566/%E8%99%9A%E8%A8%80%E7%99%96%E3%81%AE%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%28%E4%BB%AE%29.meta.js
// ==/UserScript==
//なんか問題が起きても責任は取りません
//悪い再配布の可能性があるよ、不安な場合は信頼できる人から共有されたもの使ってね
//全部自己責任だよ
//パソコンのGoogleでしか動作確認してないよ。
//AI に結構頼ったよ。今度暇なときにちゃんと見直したり作り直したりするよ。

(function () {
    'use strict';

    // 管理ボタン（開閉トグル）
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "⚙️ 管理";
    Object.assign(toggleBtn.style, {
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: "10002",
        backgroundColor: "#444",
        color: "#fff",
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 0 8px #000",
    });
    document.body.appendChild(toggleBtn);

    // 拡張機能マネージャー本体
    const manager = document.createElement("div");
    Object.assign(manager.style, {
        position: "fixed",
        top: "60px",
        left: "20px",
        backgroundColor: "#111",
        color: "#fff",
        padding: "12px",
        borderRadius: "8px",
        zIndex: "10001",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 0 10px #000",
        display: "none", // 初期状態：非表示
    });

    manager.innerHTML = `
        <div style="font-weight:bold; margin-bottom:8px;">拡張機能ON/OFF</div>
        <label><input type="checkbox" id="toggleOverlay" checked> 下書きくん</label><br/>
        <label><input type="checkbox" id="toggleRandomCollar" checked> カラーピッカー</label>
    `;

    document.body.appendChild(manager);

    // ボタン押下でマネージャー開閉
    toggleBtn.addEventListener("click", () => {
        manager.style.display = manager.style.display === "none" ? "block" : "none";
    });

    // トグル切り替え処理
    const toggles = [
        { checkboxId: "toggleOverlay", targetId: "overlayUI" },
        { checkboxId: "toggleRandomCollar", targetId: "randomcollarUI" },
    ];

    toggles.forEach(({ checkboxId, targetId }) => {
        const checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener("change", (e) => {
            const target = document.getElementById(targetId);
            if (target) target.style.display = e.target.checked ? "block" : "none";
        });
    });
})();
