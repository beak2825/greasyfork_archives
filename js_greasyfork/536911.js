// ==UserScript==
// @name         AtCoderFavSubmissionFilter
// @namespace    https://github.com/yayayaneko/AtCoderSubmissionFilters
// @version      0.1.0
// @description  AtCoderの「すべての提出」の現在のページでお気に入りユーザー以外を非表示にする
// @author       yayayaneko
// @license      MIT
// @match        https://atcoder.jp/contests/*/submissions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536911/AtCoderFavSubmissionFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/536911/AtCoderFavSubmissionFilter.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const fav = new Set(JSON.parse(localStorage.getItem("fav")) ?? []);

    function addCheckbox(applyFilterCallback) {
        const target = document.querySelector(".panel-submission .panel-heading form > div:last-child");
        if (!target) return;

        const containerDiv = document.createElement('div');
        const contentDiv = document.createElement("div");
        contentDiv.className = "checkbox";
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox-fav-sub-only";

        checkbox.checked = localStorage.getItem("fav-sub-only")==="true";
        checkbox.addEventListener("change", () => {
            localStorage.setItem("fav-sub-only", checkbox.checked);
            applyFilterCallback(checkbox.checked);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" お気に入りのみ表示"));
        contentDiv.appendChild(label);
        containerDiv.appendChild(contentDiv)
        target.after(containerDiv);
    }

    function applyFilter(filterflg) {
        const rows = document.querySelectorAll("table tbody tr");
        rows.forEach(row => {
            const username = row.querySelector("td:nth-child(3)").innerText.trim();
            row.style.display = (filterflg && !fav.has(username)) ? "none" : "";
        });
    }

    const observer = new MutationObserver(() => {
        const row = document.querySelector("tbody tr");
        if (row){
            observer.disconnect();
            addCheckbox(applyFilter);
            const lastState = localStorage.getItem("fav-sub-only")==="true";
            applyFilter(lastState);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();