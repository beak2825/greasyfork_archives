// ==UserScript==
// @name         飞牛nas文件管理支持鼠标侧键
// @namespace    http://tampermonkey.net/
// @version      2025-04-30 v0.1
// @description  飞牛nas文件管理器支持鼠标侧键
// @author       linnai
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.fnnas.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534513/%E9%A3%9E%E7%89%9Bnas%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E4%BE%A7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/534513/%E9%A3%9E%E7%89%9Bnas%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E4%BE%A7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.querySelector('[class*="trim-ui"]')){
        return
    } else {
       console.log("hook fnOS mouse side button")
    }

    const BACK_BUTTON = 3
    const FORWARD_BUTTON = 4
    const blockedButtons = new Set([BACK_BUTTON, FORWARD_BUTTON])
    window.addEventListener("mouseup", (event) => {
        const button = event.button
        if (blockedButtons.has(button)) {
            event.stopPropagation()
            event.preventDefault()
            const fileWindow = event.target.closest(".base-TabPanel-root")
            if (fileWindow) {
                const backBtn = fileWindow.querySelector(".semi-button-first")
                const nextBtn = fileWindow.querySelector(".semi-button-last")
                if (button === BACK_BUTTON && backBtn) {
                    backBtn.click()
                    return
                }
                if (button === FORWARD_BUTTON && nextBtn) {
                    nextBtn.click()
                    return
                }
            }
        }
    });
})();