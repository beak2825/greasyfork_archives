// ==UserScript==
// @name         彩虹岛商城自动购买
// @description  自动购买
// @namespace    http://tampermonkey.net/
// @version      0.6.4
// @license      MIT
// @description  try to take over the world!
// @author       yong
// @match        https://qu.sdo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470142/%E5%BD%A9%E8%99%B9%E5%B2%9B%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/470142/%E5%BD%A9%E8%99%B9%E5%B2%9B%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const href = location.href;

    let storage = window.sessionStorage

    let url = storage.getItem('fixedURL');
    let num = storage.getItem('fixedNum');
    let time = storage.getItem('flashTime');

    const checkCanBuy = () => {
        return document.querySelector('.detail-btn-buy') !== null
    }

    const reload = () => {
        window.location.reload()
    }

    let timer = null
    let startTime = storage.getItem('startTime');
    let startTimeDate

    const now = () => {
        return new Date().getTime()
    }

    let curTime = now()
    //定时器测试
    function countDownStart() {
        // 获取时间差的毫秒数
        var offset = now() - curTime;
        curTime = now()
        // 如果时间差大于设置的时间间隔，则执行回调
        if (offset > time * 1) {
            offset = 0
        } else {
            // 如果时间差小于设置的时间间隔，则开始调整为下一次执行回调的时间
            offset = time - offset;
        }
        if (offset < 0) {
            offset = 0
        }

        console.log(`下次检测：  ${offset}  ms`, startTimeDate - curTime);
        if (startTimeDate - curTime <= time) {
            clearTimeout(timer);
            window.open(url)
        } else {
            timer = setTimeout(countDownStart, offset);
        }
    }

    const isShow = (item) => {
        return item.style.display != 'none'
    }

    if (href.includes('/finish-pay/')) {
        if (num > 0) {
            window.open(url)
        } else {
            storage.setItem('fixedURL', "")
        }
    }
    setTimeout(() => {
        if (href.includes('tools-shop')) {
            if (!url) {
                url = prompt('页面地址')
                storage.setItem('fixedURL', url)
                num = prompt('抢购数量 5的倍数,一次订单为5');
                storage.setItem('fixedNum', num);
                time = prompt('未开始时刷新页面间隔，1秒=1000', 300);
                storage.setItem('flashTime', time);
                time = isNaN(time) ? 300 : time

                let startTime = prompt('抢购时间 ，只改数字，别改格式', new Date(curTime - (curTime % 60000) + 1000 * 60 * 5).toLocaleString());
                storage.setItem('startTime', startTime);
                startTimeDate = new Date(startTime).getTime()
            }
            countDownStart()
        }
        if (!url) {
            return
        }
        if (href.includes('product-detail')) {
            if (checkCanBuy()) {
                document.querySelector('#product-detail input').value = 5
                var event = new Event('change');
                document.querySelector('#product-detail input').dispatchEvent(event);
                setTimeout(() => {
                    Vue.nextTick(() => {
                        storage.setItem('fixedNum', num - 5);
                        var event = new Event('click');
                        document.querySelector('.detail-btn-buy').dispatchEvent(event)
                    })
                }, 50)
            } else {
                setTimeout(() => {
                    reload()
                }, time || 300)

            }
        }

        if (href.includes('order-preview')) {
            let confirmDialog = document.querySelector('#order-pay-dailog .order')
            let confirmBtn = document.querySelector('#order-pay-dailog .el-button:nth-child(1)')
            $.ajaxSetup({
                complete: xhr => {
                    setTimeout(() => {
                        if (isShow(confirmDialog) && isShow(confirmBtn)) {
                            let _event = new Event('click');
                            confirmBtn.dispatchEvent(_event)
                        }
                    }, 100)
                }
            })

            let _event = new Event('click');
            document.querySelector('.order-preview-submit .el-button').dispatchEvent(_event)
        }

    }, 100)

})();