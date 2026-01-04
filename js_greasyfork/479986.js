// ==UserScript==
// @name         显示物品每天均摊成本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查看购买的物品平摊到每天的价格
// @author       Silvio27
// @match        https://buyertrade.taobao.com/trade/itemlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @license      GLPv3
// @downloadURL https://update.greasyfork.org/scripts/479986/%E6%98%BE%E7%A4%BA%E7%89%A9%E5%93%81%E6%AF%8F%E5%A4%A9%E5%9D%87%E6%91%8A%E6%88%90%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479986/%E6%98%BE%E7%A4%BA%E7%89%A9%E5%93%81%E6%AF%8F%E5%A4%A9%E5%9D%87%E6%91%8A%E6%88%90%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    add_per_day_price()

    setTimeout(() => {
        let btn = document.querySelectorAll(".button-mod__button___2HDif")
        btn.forEach((element) => {
            element.addEventListener("click", function () {
                // 执行一些操作
                setTimeout(() => {
                    add_per_day_price()
                }, 3000)
            });
        })

    }, 100)


    function get_buy_days(buy_date) {
        let today = new Date()
        let buy_date_Millis = Date.parse(buy_date)
        let diff = today - buy_date_Millis
        let diff_days = diff / 1000 / 60 / 60 / 24
        // let roundedNum = Math.round(diff_days * 100) / 100;
        return Math.round(diff_days)
    }


    function add_per_day_price() {
        let order_container = document.querySelectorAll(".js-order-container")
        order_container.forEach(function (element, index, array) {
            let buy_date = element.querySelector(".bought-wrapper-mod__create-time___yNWVS").innerText
            let days = get_buy_days(buy_date)
            element.querySelector(".bought-wrapper-mod__create-time___yNWVS").innerHTML += "<span style=\'color:gold\'>:" + days + "天</span>"
            let prices = order_container[index].querySelectorAll(".price-mod__price___3_8Zs")
            prices.forEach(function (p_element, p_index, p_array) {
                let price = p_element.lastChild.innerText.replace("￥", "")
                let item = document.createElement("p")
                item.style.color = "gold"
                item.innerText = "日均:" + Math.round(price / days * 10) / 10
                p_element.appendChild(item)
            })
        })
    }

})();