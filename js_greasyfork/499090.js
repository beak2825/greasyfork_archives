// ==UserScript==
// @name         CPE 測資網頁新增「複製」按鈕
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.0
// @description  可複製「輸入」或「輸出」
// @author       zica
// @match        https://cpe.cse.nsysu.edu.tw/cpe/file/attendance/problemPdf/testData/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/499090/CPE%20%E6%B8%AC%E8%B3%87%E7%B6%B2%E9%A0%81%E6%96%B0%E5%A2%9E%E3%80%8C%E8%A4%87%E8%A3%BD%E3%80%8D%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499090/CPE%20%E6%B8%AC%E8%B3%87%E7%B6%B2%E9%A0%81%E6%96%B0%E5%A2%9E%E3%80%8C%E8%A4%87%E8%A3%BD%E3%80%8D%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const tables = document.getElementsByTagName("table");
    Array.from(tables).forEach((table, i) => {
        const copy_button = document.createElement("button");
        Object.assign(copy_button, {
            type: "button",
            textContent: "copy " + (i == 0 ? "input" : "output"),
            onclick: () => {
                navigator.clipboard
                    .writeText(table.getElementsByTagName("pre")[0].textContent)
                    .then(
                        () => {
                            prompt(copy_button, "copied!", "lightgreen");
                        },
                        () => {
                            prompt(
                                copy_button,
                                "copy permission not granted",
                                "pink"
                            );
                        }
                    );
            },
        });
        const button_wrapper = document.createElement("div");
        button_wrapper.append(copy_button);
        tables[0].before(button_wrapper);
    });
    function prompt(button, text, backgroundColor) {
        const content = document.createElement("span");
        Object.assign(content, {
            textContent: text,
        });
        Object.assign(content.style, {
            marginLeft: "1em",
            backgroundColor,
        });
        button.after(content);
        setTimeout(() => {
            content.remove();
        }, 2000);
    }
})();
