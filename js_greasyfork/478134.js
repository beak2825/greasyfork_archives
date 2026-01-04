// ==UserScript==
// @name         驾考宝典网页快捷键
// @license MIT
// @namespace https://github.com/yagregor
// @version      0.4
// @description 为驾考宝典网页版增加快捷键选择回答功能 目前适用于 模拟考试和错题
// @author       yagregor
// @match     https://*.jiakaobaodian.com/mnks/*
// @downloadURL https://update.greasyfork.org/scripts/478134/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%E7%BD%91%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478134/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%E7%BD%91%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const keyToOrder = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3
    }

    const currentPageType = () => {
        const url = document.location.href
        if (url.indexOf("exercise") !== -1) {
            return "exercise"
        } else {
            return "exam"
        }
    }

    const examKeyDown = (order) => {
        if (order !== undefined) {
            const buttons = document.querySelectorAll(".select-lable")
            const selectedButton = buttons[order]
            if (selectedButton !== undefined) {
                selectedButton.click()
            }
        }
    }

    const execrciseKeyDown = (order) => {
        if (order !== undefined) {
            const buttons = document.querySelectorAll(".options-w > p")
            const selectedP = buttons[order]
            if (selectedP !== undefined) {
                selectedP.click()
            }
        }
    }


    const onKeyDown = (e) => {
        'use strict'
        const key = e.key

        const order = keyToOrder[key]
        const type = currentPageType()

        if (type === "exam") {
            examKeyDown(order)
        } else if (type === "exercise") {
            execrciseKeyDown(order)
        }
    }
    document.addEventListener("keydown", onKeyDown)
})();
