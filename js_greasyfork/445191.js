// ==UserScript==
// @name    AtCoder Problem Buttons
// @namespace    http://tampermonkey.net/
// @version    0.2
// @description    問題選択を簡単に行うことができるボタンを追加します
// @author    Chippppp
// @license    MIT
// @match    https://atcoder.jp/contests/*/submit*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/445191/AtCoder%20Problem%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/445191/AtCoder%20Problem%20Buttons.meta.js
// ==/UserScript==

(() => {
    "use strict";
    let problemButton = document.getElementById("select-task");
    let buttonGroup = problemButton.parentElement;
    let problemButtons = [];
    for (let i of problemButton.children) {
        let button = document.createElement("button");
        buttonGroup.appendChild(button);
        button.className = "btn btn-default";
        button.type = "button";
        button.innerText = i.innerText;
        button.value = i.value;
        problemButtons.push(button);
    }
    problemButtons[0].className = "btn btn-success";
    for (let i of problemButtons) {
        i.addEventListener("click", () => {
            for (let button of problemButtons) button.className = "btn btn-default";
            i.className = "btn btn-success";
            problemButton.value = i.value;
            problemButton.dispatchEvent(new Event("change"));
        });
        if (i.innerText == problemButton.innerText) i.click();
    }
    problemButton.onchange = () => {
        for (let button of problemButtons) {
            if (button.value == problemButton.value) button.className = "btn btn-success";
            else button.className = "btn btn-default";
        }
    };
})();