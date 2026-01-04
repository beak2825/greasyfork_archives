// ==UserScript==
// @name         AtCoder Dropdown Tasks
// @namespace    https://atcoder.jp/
// @version      2025-03-10
// @description  AtCoder のコンテストページにおいて、問題タブをホバーするとドロップダウンリストを表示するようにします。
// @author       magurofly
// @match        https://atcoder.jp/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        unsafeWindow
// @license      CC0-1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/529085/AtCoder%20Dropdown%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/529085/AtCoder%20Dropdown%20Tasks.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    if (typeof unsafeWindow.contestScreenName !== "string") return;
    const contestScreenName = unsafeWindow.contestScreenName;

    const styleSheet = new CSSStyleSheet();
    styleSheet.insertRule(`
.atcoder-dropdown-tasks:hover .dropdown-menu {
  display: block;
}
    `);
    document.adoptedStyleSheets.push(styleSheet);

    const tasksDropdown = unsafeWindow.document.querySelector("#contest-nav-tabs > ul > li:nth-child(2)");
    tasksDropdown.classList.add("atcoder-dropdown-tasks");

    const tasksDropdownButton = tasksDropdown.querySelector("a");
    tasksDropdownButton.insertAdjacentHTML("beforeend", `<span class="caret"></span>`);

    const tasksDropdownContents = document.createElement("ul");
    tasksDropdownContents.className = "dropdown-menu";
    tasksDropdown.appendChild(tasksDropdownContents);

    const tasksHTML = await (await fetch(`/contests/${contestScreenName}/tasks`)).text();
    const tasksDoc = new DOMParser().parseFromString(tasksHTML, "text/html");
    for (const row of tasksDoc.querySelectorAll("#main-container > div.row > div:nth-child(2) > div.panel.panel-default.table-responsive > table > tbody > tr")) {
        const taskNum = row.cells[0].textContent;
        const taskName = row.cells[1].textContent;
        const taskURL = row.cells[0].children[0].href;
        const link = document.createElement("a");
        link.href = taskURL;
        link.textContent = `${taskNum} - ${taskName}`;
        link.style.fontFamily = "monospace";
        const li = document.createElement("li");
        li.appendChild(link);
        tasksDropdownContents.appendChild(li);
    }
})();