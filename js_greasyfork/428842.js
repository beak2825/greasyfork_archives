// ==UserScript==
// @name         自动跳转到领B币券，自动领取
// @namespace    https://www.bilibili.com/
// @version      0.3
// @description  自动跳转到领B币券，自动领取（每月第一次打开首页触发）
// @author       woodj
// @license      MIT
// @include      https://www.bilibili.com/
// @include      https://account.bilibili.com/account/big/myPackage
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/428842/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%A2%86B%E5%B8%81%E5%88%B8%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/428842/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%A2%86B%E5%B8%81%E5%88%B8%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("=====================================start get coin")
    let month = (new Date().getMonth() + 1).toString()
    let coin_month = localStorage.getItem('coin_month');
    if (month === coin_month) {
        console.log("has got coined")
        return
    }

    function check() {
        let query = $(".coupon-btn.coupon-btn-disable")
        console.log(query)
        if (query.length == 7) {
            localStorage.setItem('coin_month', month)
            console.log('coin got')
        } else {
            $(".coupon-btn").click();
            console.log('click coin')
            setTimeout(() => {
                window.location.reload()
            }, 3000);
        }
    }

    let target_url = "https://account.bilibili.com/account/big/myPackage"
    console.log(target_url)
    console.log(window.location.href)
    if (window.location.href === target_url) {
        console.log('target page now')
        setTimeout(() => {
            check();
        }, 3000);
    } else {
        let coin_month = localStorage.getItem('coin_month');
        if (month === coin_month) {
            console.log('coin got')
            return;
        }
        localStorage.setItem('coin_month', month)
        console.log('jump to target url in 3 seconds')
        setTimeout(() => {
            window.location.href = target_url
        }, 3000);
    }
})();