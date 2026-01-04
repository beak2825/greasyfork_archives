// ==UserScript==
// @name         HDC2024自动购票 (华为开发者大会)
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  华为开发者大会2024 松山湖 自动购票
// @author       浩劫者12345
// @match        https://developer.huawei.com/*
// @icon         https://developer.huawei.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494517/HDC2024%E8%87%AA%E5%8A%A8%E8%B4%AD%E7%A5%A8%20%28%E5%8D%8E%E4%B8%BA%E5%BC%80%E5%8F%91%E8%80%85%E5%A4%A7%E4%BC%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494517/HDC2024%E8%87%AA%E5%8A%A8%E8%B4%AD%E7%A5%A8%20%28%E5%8D%8E%E4%B8%BA%E5%BC%80%E5%8F%91%E8%80%85%E5%A4%A7%E4%BC%9A%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 修改此处以选择不同票种 (正则表达式)
    const ticketToBuy = /学生票/

    if (location.href.includes('/home/hdc/hdc2024.html')) {
        function findBuyBtn() {
            for (let el of document.querySelectorAll('.type-title')) {
                if (el.innerHTML.match(ticketToBuy)) {
                    console.log('找到票务文本', el)
                    let btn = el.parentNode.parentNode.querySelector('.tiny-button')
                    console.log('找到票务购买按钮', btn)
                    return btn
                }
            }
            console.log('找不到所需票务')
        }

        let getTicketInfoInterval = setInterval(() => {
            fetch('https://home-svc-drcn.developer.huawei.com/rest/developer/user/hdminisitesoservice/v1/active/query-offering-list', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ minisite_id: "HDC.2024" })
            }).then(response => response.json()).then(data => {
                for (let item of data.data.offering_list) {
                    console.log(
                        `%c${item.offering_name} %c${item.cbg_stocks_available ? '有票' : '无票'}`,
                        item.offering_name.match(ticketToBuy) ? 'background: #ff0; color: #000' : 'background: #fff; color: #000',
                        item.cbg_stocks_available ? 'background: #0f0; color: #000' : 'background: #f00; color: #fff'
                    )
                    if (item.offering_name.match(ticketToBuy) && item.cbg_stocks_available) {
                        let btn = findBuyBtn()
                        if (btn && btn.innerHTML.includes('售罄')) {
                            console.log('找到有票，正在刷新页面')
                            location.reload()
                        }
                    }
                }
                console.log('上次更新', new Date().toLocaleString())
            })
        }, 1000);

        let clickGoToBuyInterval = setInterval(() => {
            let btn = findBuyBtn()
            if (btn) {
                console.log('正在点击购买')
                btn.click()
                setTimeout(() => {
                    clearInterval(clickGoToBuyInterval)
                }, 2000);
            }
        }, 300)
    }

    if (location.href.includes('/hdc/hdc2024/tickets/')) {
        let clickBuyInterval = setInterval(() => {
            if (document.querySelector('.payment-box')) {
                console.log('下单成功，不再点击')
                clearInterval(clickBuyInterval)
                return
            }
            let btn = document.querySelector('.submit-wrapper').querySelector('button')
            console.log('找到下单按钮', btn)
            btn.click()
        }, 300)
    }
})();