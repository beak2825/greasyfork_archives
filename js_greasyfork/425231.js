// ==UserScript==
// @name         Duolingo文字入力自動切り替え
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Duolingoで問題によって自動的に日本語入力と英語入力を自動で切り替えます。
// @author       akazuzaka
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425231/Duolingo%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B%E8%87%AA%E5%8B%95%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/425231/Duolingo%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B%E8%87%AA%E5%8B%95%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

const main = () => {
    const interval = setInterval(() => {
        const textarea = document.querySelector("textarea");
        const input = document.querySelector("input");
        if (textarea) {
            const textareaLanguage = textarea.getAttribute("placeholder");
            const isInputMode = textarea.getAttribute("inputmode")
            if (textareaLanguage === "英語で入力してください" && !isInputMode) {
                textarea.setAttribute("inputmode", "url");
            }
        } else if (input) {
            const inputLanguage = input.getAttribute("placeholder");
            const isInputMode = input.getAttribute("inputmode");
            if (inputLanguage === "英語で入力してください" && !isInputMode) {
                input.setAttribute("inputmode", "url");
            }
        }
    }, 500);
}

document.addEventListener("load",
    main()
)