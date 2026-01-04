// ==UserScript==
// @name         CoinMarketCap Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click 1h % every 9 seconds and act based on sort status
// @match        *://*.coinmarketcap.com/watchlist
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513844/CoinMarketCap%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/513844/CoinMarketCap%20Clicker.meta.js
// ==/UserScript==
// CoinMarketCap Clicker
// 简单定义click 时间间隔的方法，不完善。哈哈。看似是点击的问题，其实 包含有 2个小问题。1个是点击后才能出发排序。一个是 排序初始状态。 所以，不管三七二十一，先点击 1h %, 再检查排序。
// 修订：每隔 9秒点击一下 1h % ， 然后检查1h % 的排序状态。 如 1h % 是升序，则不动作。如 1h % 是降序，则延迟 3秒 点击一下 1h %.  如此循环

(function () {
    'use strict';

    function handleClickAndSortStatus() {
        const elements = document.querySelectorAll('p.sc-71024e3e-0.llNEXf');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent === '1h %') {
                elements[i].click();

                const arrowElement = elements[i].parentNode.querySelector('.icon-Caret-down');
                if (arrowElement.classList.contains('icon-Caret-up')) {
                    // 升序，不动作
                } else if (arrowElement.classList.contains('icon-Caret-down')) {
                    setTimeout(() => {
                        elements[i].click();
                    }, 6000);
                }
                break;
            }
        }
    }

    setInterval(handleClickAndSortStatus, 60000);
})();


