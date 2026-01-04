// ==UserScript==
// @name         网易buff保存饰品价格方便对比折扣
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  把页面点击过的数据保存起来，方便对比折扣。不发起请求，没有封号风险。
// @author       jzh
// @match        https://buff.163.com/market/csgo
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469473/%E7%BD%91%E6%98%93buff%E4%BF%9D%E5%AD%98%E9%A5%B0%E5%93%81%E4%BB%B7%E6%A0%BC%E6%96%B9%E4%BE%BF%E5%AF%B9%E6%AF%94%E6%8A%98%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/469473/%E7%BD%91%E6%98%93buff%E4%BF%9D%E5%AD%98%E9%A5%B0%E5%93%81%E4%BB%B7%E6%A0%BC%E6%96%B9%E4%BE%BF%E5%AF%B9%E6%AF%94%E6%8A%98%E6%89%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addXMLRequestCallback(callback) {
        if (XMLHttpRequest.callbacks) {
            XMLHttpRequest.callbacks.push(callback)
        } else {
            XMLHttpRequest.callbacks = [callback]
            const oldSend = XMLHttpRequest.prototype.send
            XMLHttpRequest.prototype.send = function () {
                for (let i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this)
                }
                oldSend.apply(this, arguments)
            }
        }
    }
    function paintDiscount(good, item) {
        const template = '<strong class="f_16px f_Strong price_scale l_Right"></strong>'
        const discount = ((item.sell_min_price / item.goods_info.steam_price_cny) * 1.15).toFixed(2)
        const buff = item.sell_min_price
        const num = item.sell_num
        let target = $(good).find('p>strong.f_Strong')[0]
        let color = 'red'
        if (buff > 10 && num > 1000 && discount < 0.8) {
            color = 'green'
        }
        // $(good).find('p>span').text(num)
        $(target).append($(template).css('color', color).text(discount))
    }
    const text1 = $('<span style="color:white"></span>').text('最低价')
    const text2 = $('<span style="color:white"></span>').text('最高价')
    const text3 = $('<span style="color:white"></span>').text('最低在售')
    const input1 = $('<input id="minBuff" type="number" value="10" min="0" step="10"></input>')
    const input2 = $('<input id="maxBuff" type="number" value="100" min="0" step="10"></input>')
    const input3 = $('<input id="minNum" type="number" value="1000" min="0" step="100"></input>')
    const button1 = $('<button id="confirmButton" type="submit"></button>').text('搜索')
    const button2 = $('<button id="allButton" type="button"></button>').text('全部')
    const button3 = $('<button id="commonButton" type="button"></button>').text('常用')
    const button4 = $('<button id="clearButton" type="button"></button>').text('清空表格')
    $('.market-header').prepend(
        text1,
        input1,
        text2,
        input2,
        text3,
        input3,
        button1,
        button2,
        button3,
        button4
    )
    // 搜索
    $('#confirmButton').click(function () {
        const discounts = GM_getValue('discounts')
        const minBuff = document.getElementById('minBuff').value
        const maxBuff = document.getElementById('maxBuff').value
        const minNum = document.getElementById('minNum').value
        console.table(
            discounts.filter((item) => item.buff >= minBuff && item.buff <= maxBuff && item.num >= minNum)
        )
    })
    // 全部
    $('#allButton').click(function () {
        const discounts = GM_getValue('discounts')
        document.getElementById('minBuff').value = 0
        document.getElementById('maxBuff').value = 1000
        document.getElementById('minNum').value = 0
        console.table(discounts.filter((item) => item.buff >= 0 && item.buff <= 1000 && item.num >= 0))
    })
    // 常用
    $('#commonButton').click(function () {
        const discounts = GM_getValue('discounts')
        document.getElementById('minBuff').value = 10
        document.getElementById('maxBuff').value = 100
        document.getElementById('minNum').value = 1000
        console.table(
            discounts.filter((item) => item.buff >= 10 && item.buff <= 100 && item.num >= 1000)
        )
    })
    // 清空表格
    $('#clearButton').click(function () {
        GM_setValue('discounts', [])
        GM_setValue('conditions', [])
        console.log('清空成功')
    })
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener('load', function () {
            if (
                xhr.readyState == 4 &&
                xhr.status == 200 &&
                xhr.responseURL.startsWith('https://buff.163.com/api/market/goods')
            ) {
                const items = JSON.parse(xhr.response).data.items
                const goods = $('#j_list_card>ul>li')
                for (let i = 0; i < goods.length; i++) {
                    paintDiscount(goods[i], items[i])
                }
                const conditions = GM_getValue('conditions') || []
                const url = xhr.responseURL.slice(0, -16)
                if (conditions.find((item) => item === url)) {
                    return
                }
                conditions.push(url)
                GM_setValue('conditions', conditions)
                const discount = items.map((item) => {
                    return {
                        name: item.name,
                        num: item.sell_num,
                        buff: item.sell_min_price,
                        steam: item.goods_info.steam_price_cny,
                        discount: ((item.sell_min_price / item.goods_info.steam_price_cny) * 1.15).toFixed(2),
                        buffUrl: `https://buff.163.com/goods/${item.id}`,
                        steamUrl: item.steam_market_url
                    }
                })
                const discounts = GM_getValue('discounts') || []
                GM_setValue('discounts', discounts.concat(discount))
            }
        })
    })
})();