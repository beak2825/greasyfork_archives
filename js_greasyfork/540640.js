// ==UserScript==
// @name         FF14充值 - 隐藏充值区服区域
// @namespace    https://greasyfork.org/zh-CN/users/1300889
// @version      1.2
// @description  自动选择区服，然后隐藏它
// @author       浮砂
// @license      MIT
// @match        http*://pay.sdo.com/item/GWPAY-100001900*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540640/FF14%E5%85%85%E5%80%BC%20-%20%E9%9A%90%E8%97%8F%E5%85%85%E5%80%BC%E5%8C%BA%E6%9C%8D%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/540640/FF14%E5%85%85%E5%80%BC%20-%20%E9%9A%90%E8%97%8F%E5%85%85%E5%80%BC%E5%8C%BA%E6%9C%8D%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动选择区服
    const server = '1' // 陆行鸟1|莫古力6|猫小胖7|豆豆柴8
    document.querySelectorAll('input[name="gamearea"]').forEach(input => {
        input.value = server
    })
    // 隐藏相应模块
    const style = document.createElement('style')
    style.textContent = `
        li.server, li.serverTips {
            display: none !important;
        }
        .other_amount {
            display: inline-block !important;
        }
    `
    document.head.appendChild(style)
})();