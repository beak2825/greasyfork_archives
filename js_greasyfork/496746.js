// ==UserScript==
// @name Poe2MD
// @name:zh-CN Poe对话导出
// @namespace http://tampermonkey.net/
// @version 1.0.1
// @description Export Poe conversations to local Markdown files
// @description:zh-cn 将Poe对话导出到本地Markdown文件
// @author Trancesnow
// @match https://poe.com/chat/*
// @grant GM_registerMenuCommand
// @require https://unpkg.com/html-to-md/dist/index.js
// @license GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/496746/Poe2MD.user.js
// @updateURL https://update.greasyfork.org/scripts/496746/Poe2MD.meta.js
// ==/UserScript==

GM_registerMenuCommand("Poe2MD", () => {
  function saveStringAsFile(content) {
    const date = new Date();
    const filename = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}.md`;

    const blob = new Blob([content], { "type": "text/markdown" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    link.click();

    URL.revokeObjectURL(link.href);
  }

  function getMarkdownMessageArray() {
    return Array.from(document
      .querySelectorAll("[class*='Prose_prose']"))
      .map(message => html2md(message.innerHTML));
  }

  saveStringAsFile(getMarkdownMessageArray().join("\n\n---\n\n"));
});
