// ==UserScript==
// @name         Auto Copy Selected Text (with deduplication & trim)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Automatically copy selected text to clipboard if it's new and meaningful
// @author       liuweiqing
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon         https://icons.iconarchive.com/icons/gartoon-team/gartoon-places/256/user-desktop-icon.png
// @downloadURL https://update.greasyfork.org/scripts/508566/Auto%20Copy%20Selected%20Text%20%28with%20deduplication%20%20trim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508566/Auto%20Copy%20Selected%20Text%20%28with%20deduplication%20%20trim%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let lastCopiedText = "";

  document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim(); // 去掉前后空白

    // 跳过空白内容或与上次相同内容
    if (!selectedText || selectedText === lastCopiedText) return;

    lastCopiedText = selectedText;

    const range = selection.getRangeAt(0);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          console.log("Copied:", selectedText);
        })
        .catch((err) => {
          console.error("Failed to copy", err);
        });
    } else {
      const tempElement = document.createElement("textarea");
      tempElement.value = selectedText;
      document.body.appendChild(tempElement);
      tempElement.select();
      try {
        document.execCommand("copy");
        console.log("Copied (fallback):", selectedText);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
      document.body.removeChild(tempElement);
    }
  });
})();
