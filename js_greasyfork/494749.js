// ==UserScript==
// @name         Copy GitHub Repo Name
// @name:en      Copy GitHub Repo Name
// @name:zh-CN   复制 GitHub 仓库名
// @name:zh-TW   複製 GitHub 倉庫名
// @name:zh      複製 GitHub 倉庫名
// @namespace    http://tampermonkey.net/
// @version      2025-12-02
// @description  Create a button to copy the repo name (owner/repo) on GitHub
// @description:en  Create a button to copy the repo name (owner/repo) on GitHub
// @description:zh-CN  在 GitHub 页面上添加一个按钮，点击后可以复制仓库名（owner/repo）
// @description:zh-TW  在 GitHub 頁面上添加一個按鈕，點擊後可以複製倉庫名（owner/repo）
// @description:zh  在 GitHub 頁面上添加一個按鈕，點擊後可以複製倉庫名（owner/repo）
// @author       Elvis Mao
// @match        https://github.com/*
// @icon         https://emtech.cc/icons/apple-touch-icon.png
// @grant        none
// @license           Apache-2.0
// @homepageURL       https://github.com/Edit-Mr/SSS/tree/main
// @supportURL        https://github.com/Edit-Mr/SSS/issues
// @downloadURL https://update.greasyfork.org/scripts/494749/Copy%20GitHub%20Repo%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/494749/Copy%20GitHub%20Repo%20Name.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let button = document.createElement("button");
    button.style.cssText =
        "margin:0; padding: 0; font-size: 1em; border:0; outline:0;background:transparent;";
    button.textContent = "🔗";
    button.addEventListener("click", function () {
        try {
            button.textContent = "✅";
            navigator.clipboard.writeText(
                location.pathname.split("/").slice(1, 3).join("/")
            );
            setTimeout(() => {
                button.textContent = "🔗";
            }, 1000);
        } catch (e) {
            button.textContent = "❌";
            console.error("Failed to copy repo name");
        }
    });
    document.querySelector("#repo-title-component strong").style = "display: inline!important"
    document.querySelector("#repo-title-component strong").appendChild(button);
})();
