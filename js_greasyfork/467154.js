// ==UserScript==
// @name         天猫订单同步
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  天猫用户信息同步
// @author       You
// @match        https://qn.taobao.com/home.htm/trade-platform/tp/detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467154/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/467154/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getOrderInfo() {
        const tab = document.querySelector('div[class^="detail_tabs-container-layout"]')

        // 例: '交易信息订单编号:3362644009086523253复制支付宝交易号:2023052522001135691427356317复制成交时间:2023-05-25 16:13:16付款时间:2023-05-25 16:14:27发货时间:2023-05-26 08:40:43买家信息昵称：旺旺在线蒲** 支付宝：1***  付款给买家该功能为支付宝即时到帐，用于退运费等小额退款，请谨慎操作物流信息收货地址：胡锦霞，18413489556-6174，浙江省 金华市 永康市 象珠镇  浙江索福绿建实业有限公司寺口吕 ，000000运送方式：快递物流公司名称：顺丰速运运单号：SF1637185484099查看物流信息'
        const content = tab.textContent

        // 获取订单编号
        const orderNo = content.match(/订单编号:(\d+)/)[1]
        // 收货地址
        const address = content.includes("新收货地址") ? content.match(/新收货地址：(.+)/)[1] : content.match(/收货地址：(.+)/)[1]

        const arr = address.split("，").filter(t=>t)
        // 收货人
        const receiver = arr[0]
        // 收货人电话
        const receiverPhone = arr[1]
        if (!receiverPhone || receiverPhone[0] === '*') {
            throw new Error('用户手机号不合法，请检查')
        }
        // 收货人地址
        const receiverAddress = arr[2]

        const addrArr = receiverAddress.split(" ")
        // 收货人街道
        const receiverStreet = addrArr[3] || ''
        // 收货人小区
        const receiverOther = addrArr[4] || ''

        return {
            orderNo,
            receiver,
            receiverPhone,
            receiverStreet,
            receiverOther,
        }
    }

    /**
     * 同步到造梦者服务后台
     */
    async function syncToDmService() {
        const orderInfo = getOrderInfo()

        const userinfo = {
            orderNo: orderInfo.orderNo,
            // 用户信息
            phone: orderInfo.receiverPhone,
            name: orderInfo.receiver,
            address: orderInfo.receiverStreet + orderInfo.receiverOther,
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://service.dream-maker.com/DMServiceAPI/extra/save_userinfo.html",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({ 'userinfo': userinfo }),
                    onload: function (response) {
                        console.log('同步成功', response, response.data);
                        resolve(response)
                    },
                    onerror: function (err) {
                        console.error('同步失败', response);
                        alert('同步失败')
                        reject(err)
                    }
                });
            }, 1000);
        })
    }

    // 等待窗口加载完成
    window.addEventListener('load', async function () {
        if (location.href.includes("qn.taobao.com/home.htm/trade-platform/tp/detail")) {
            // 详情页
            onDetailLoad()
            return
        }
    })

    function onDetailLoad() {
        console.log('onDetailLoad1')
        // todo 检验订单号是否一致

        document.querySelector('.next-switch').click()

        // 等待用户信息加载完成
        setTimeout(async () => {
            try {
                await syncToDmService()

                // 关闭当前标签页
                // setTimeout(() => {
                //     window.close()
                // }, 1000)
            } catch (error) {
                console.log('error', error)
            }
        }, 2000);
    }

    console.log('tm_sync.js loaded')
})();