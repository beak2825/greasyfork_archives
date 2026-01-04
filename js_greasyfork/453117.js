// ==UserScript==
// @name         AtCoder Efficient Layout
// @namespace    https://atcoder.jp/
// @version      0.3
// @description  入力形式やサンプルを横並びにします。
// @author       magurofly
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/tasks_print
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        unsafeWindow
// @license      CC0-1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/453117/AtCoder%20Efficient%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/453117/AtCoder%20Efficient%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ioStyleSummary = "入出力形式";
    const sampleWidth = 60;
    const sampleWidthUnit = "vw";
    const sampleMargin = "0 1em";
    const sampleSummary = "入出力例";

    const doc = unsafeWindow.document;

    // 入出力形式より後にある hr を全部消す
    for (const hr of doc.querySelectorAll(".io-style ~ hr")) {
        hr.parentElement.removeChild(hr);
    }

    // 入出力形式より後にある .part を取得（入出力例のはず）
    const samples = doc.querySelectorAll(".io-style ~ .part");
    const lazyContainer = parentElement => {
        let row = parentElement.querySelector(".samples-row");
        if (!row) {
            const container = newDetails(sampleSummary);
            container.className = "samples-container";
            parentElement.appendChild(container);
            row = doc.createElement("div");
            row.className = "samples-row";
            container.appendChild(row);
        }
        return row;
    };
    if (samples.length % 2 == 0) {
        // 偶数個なら 2 個ずつまとめて横並びにする
        for (let i = 0; i < samples.length; i += 2) {
            const input = samples[i];
            const output = samples[i + 1];
            const container = lazyContainer(input.parentElement, "samples-container");
            const col = doc.createElement("div");
            col.appendChild(input.parentElement.removeChild(input));
            col.appendChild(output.parentElement.removeChild(output));
            container.appendChild(col);
        }
    } else {
        // 奇数個ならまとめずに横並びにする
        for (let i = 0; i < samples.length; i++) {
            const element = samples[i];
            const container = lazyContainer(element.parentElement, "samples-container");
            container.appendChild(element.parentElement.removeChild(element));
        }
    }

    for (const rows of doc.querySelectorAll(".samples-row")) {
        rows.style.width = `${sampleWidth * rows.children.length}${sampleWidthUnit}`;
    }

    // 入出力形式を details に入れる
    const ioStyle = doc.querySelector(".io-style");
    const ioStyleDetails = newDetails(ioStyleSummary);
    ioStyle.parentElement.insertBefore(ioStyleDetails, ioStyle);
    ioStyleDetails.appendChild(ioStyle.parentElement.removeChild(ioStyle));

    const globalCSS = `
/* 入出力形式を横に並べる */
.io-style {
  display: flex;
  justify-content: space-between;
}
.io-style > * {
  width: 100%;
}

/* サンプルを横に並べる */
.samples-container {
  width: 100%;
  overflow-x: auto;
}
.samples-row {
  display: flex;
}
.samples-row > * {
  width: ${sampleWidth}${sampleWidthUnit};
  margin: ${sampleMargin};
}
`;

    doc.head.appendChild(document.createElement("style")).textContent = globalCSS;

    function newDetails(summaryText, open = true) {
        const details = doc.createElement("details");
        details.open = open;
        const summary = doc.createElement("summary");
        summary.textContent = summaryText;
        details.appendChild(summary);
        return details;
    }
})();