// ==UserScript==
// @name         AtCodeer Stopgap C++
// @namespace    http://tampermonkey.net/
// @version      2025-01-26
// @description  AtCoderのコードテストからC++のファイルを落とす簡易ツール
// @author       Yukkku
// @match        https://atcoder.jp/contests/*/custom_test
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524908/AtCodeer%20Stopgap%20C%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/524908/AtCodeer%20Stopgap%20C%2B%2B.meta.js
// ==/UserScript==

(() => {
  'use strict';
  document.querySelector(".editor-buttons").append(
    Object.assign(document.createElement("button"), {
      classList: "btn btn-default btn-sm",
      innerHTML: ".cppとして保存",
      onclick() {
        const button = document.querySelector(".btn-toggle-editor");
        button.click();
        button.click();
        Object.assign(document.createElement("a"), {
          href: URL.createObjectURL(
            new Blob(
              [document.querySelector("#plain-textarea").value],
              { type: "text/plain" },
            ),
          ),
          download: "code.cpp",
        }).click();
      },
    }),
  );
})();