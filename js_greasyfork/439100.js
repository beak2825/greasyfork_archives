// ==UserScript==
// @name         AtCoder for Large Display
// @namespace    http://atcoder.jp/
// @version      0.1
// @description  サンプルなどを二列に並べます。
// @author       magurofly
// @match        https://atcoder.jp/contests/*/tasks/*
// @icon         https://www.google.com/s2/favicons?domain=atcoder.jp
// @grant        unsafeWindow
// @license      CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/439100/AtCoder%20for%20Large%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/439100/AtCoder%20for%20Large%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hasHeadingMatching(e, pattern) {
        for (const heading of e.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
            if (heading.textContent.match(pattern)) return true;
        }
        return false;
    }

    function moveTo(container, elements) {
        for (const element of elements) {
            if (element.parentElement) element.parentElement.removeChild(element);
            container.appendChild(element);
        }
    }

    for (const container of document.querySelectorAll(".lang>span")) {
        container.classList.add("row");
        const testcases = [];
        let inputStyle, outputStyle;
        for (const col of container.querySelectorAll(".part,.io-style")) {
            if (col.querySelector(".btn-copy")) {
                testcases.push(col);
                col.classList.add("col-md-6");
            } else if (hasHeadingMatching(col, /入力|Input/i)) {
                inputStyle = col;
                col.classList.add("col");
            } else if (hasHeadingMatching(col, /出力|Output/i)) {
                outputStyle = col;
                col.classList.add("col");
            } else {
                col.classList.add("col");
            }
        }
        if (inputStyle && outputStyle) {
            inputStyle.classList.remove("col");
            inputStyle.classList.add("col-xs-6");
            outputStyle.classList.remove("col");
            outputStyle.classList.add("col-xs-6");
            const row = document.createElement("div");
            row.className = "row";
            inputStyle.parentElement.appendChild(row);
            moveTo(row, [inputStyle, outputStyle]);
        }
        for (let i = 0; i < testcases.length; i += 2) {
            const input = testcases[i];
            const output = testcases[i + 1];
            const row = document.createElement("div");
            row.className = "row";
            input.parentElement.appendChild(row);
            moveTo(row, [input, output]);
        }
    }
})();