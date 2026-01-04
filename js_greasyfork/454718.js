// ==UserScript==
// @name         IPSA ICan自检自动选择
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ICan自检自动选择
// @author       dksong
// @match        https://ipsapro.isoftstone.com/iCan/ITS/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=isoftstone.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454718/IPSA%20ICan%E8%87%AA%E6%A3%80%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/454718/IPSA%20ICan%E8%87%AA%E6%A3%80%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    const chose = (timer) => {
        const yesRadios = document.querySelectorAll(
            '.ant-radio-wrapper:first-child .ant-radio-input',
        )
        if (yesRadios.length) {
            yesRadios.forEach((radio) => {
                radio.click()
            })
            clearInterval(timer)
        }
    }

    const timer = setInterval(() => {
        const btns = Array.from(document.querySelectorAll('.ant-pagination li'))

        if (btns.length) {
            clearInterval(timer)

            btns.pop()
            btns.shift()

            btns.forEach((pageBtn) => {
                pageBtn.click()
                chose()
            })
        } else {
            return chose(timer)
        }
    }, 500)

    setTimeout(() => timer && clearInterval(timer), 1000 * 10)
})()
