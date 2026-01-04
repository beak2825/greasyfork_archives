// ==UserScript==
// @name         Polyt Ticket Helper
// @namespace    https://yinr.cc/
// @homepage     https://greasyfork.org/zh-CN/scripts/382318-polyt-ticket-helper
// @version      3.1.0
// @iconURL      https://hfgrandtheatre.polyt.cn/images/bitbug_favicon.ico
// @description  A helper script for polyt
// @author       Yinr
// @match        https://*.polyt.cn/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/382318/Polyt%20Ticket%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/382318/Polyt%20Ticket%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动提交选票
    let Opt_AutoSubmitTicket = GM_getValue('AutoSubmitTicket', true)
    // GM_setValue('AutoSubmitTicket', Opt_AutoSubmitTicket)
    // 自动提交订单
    let Opt_AutoSubmitOrder = GM_getValue('AutoSubmitOrder', false)
    // GM_setValue('SubmitOrder', Opt_SubmitOrder)
    // 需要购买张数
    let Opt_TotalNeed = GM_getValue('TotalNeed', 2)
    // GM_setValue('TotalNeed', Opt_TotalNeed)

    let polytShowRemains = function() {
        if (document.URL.includes('polyt.cn/show/')) {
            let moneyCount = document.getElementsByClassName('discount-money').length
            for (let id = 0; id < moneyCount; id++) {
                let reservedCount = document.getElementById("reservedCount" + id.toString()).value
                let price = document.getElementById("price" + id.toString()).value
                console.log('¥' + price + ": " + reservedCount)
                let el = document.getElementById("itemValue" + id.toString())
                if (!el.innerHTML.endsWith('）')) {
                    el.innerHTML += '（剩余：' + reservedCount + '）'
                }
            }
        }
    }

    let polytSubmitTicket = function(ticketCount = Opt_TotalNeed) {
        if (document.URL.includes('polyt.cn/show/')) {
            let checkVaild = function(id, count) {
                return document.getElementById("reservedCount" + id.toString()).value >= count
            }
            let selectTime = function(id) {
                document.getElementsByClassName('discount-timewidth')[0].children[id].click()
                polytShowRemains()
            }
            let submitTicket = function(id, count) {
                if (unsafeWindow.submitBuyTicket === undefined) location.reload();
                let strId = id.toString()
                unsafeWindow.changePrice(strId)
                for (let i = 1; i < count; i++) {
                    unsafeWindow.changePlus(strId)
                }
                if (Opt_AutoSubmitTicket === true) {
                    unsafeWindow.submitBuyTicket()
                }
            }

            let ticketLoop = function(from, to, count) {
                let moneyCount = document.getElementsByClassName('discount-money').length
                let loopMax = Math.min(moneyCount, to)
                for (let i = from; i < loopMax; i++) {
                    if (checkVaild(i, count) === true) {
                        submitTicket(i, count)
                        return true
                    }
                }
                return false
            }

            let ticketNumber = document.getElementById('ticketNumber').value
            if (ticketNumber < ticketCount) {
                console.warn('本场次您只能购买' + ticketNumber + '张，设定购票张数（' + ticketCount + '）将自动据此调整')
                ticketCount = ticketNumber
            }

            // loop time
            let done = false
            let timeCount = document.getElementsByClassName('discount-time').length
            let t = 0
            do {
                selectTime(t)
                done = ticketLoop(0, 5, ticketCount)
            } while (!done || t >= timeCount)

            return done
        }
    }

    let polytSubmitOrder = function() {
        if (document.URL.includes('polyt.cn/submitOrder')) {
            let movieIndexCount = document.getElementsByName('movieFlag').length
            for (let i = 0; i < movieIndexCount; i++) {
                // document.getElementById("VeryhuoCOM-delete").style.display = 'block'
                document.getElementById("chooseMovieIndex").value = i.toString()
                document.getElementsByName('manname')[i].click()
                document.getElementById('submitMovieButton').click()
            }
            if (Opt_AutoSubmitOrder === true) {
                document.getElementById('submit').click()
            }
        }
    }

    unsafeWindow.polytHelper = {
        showRemains: polytShowRemains,
        submitTicket: polytSubmitTicket,
        submitOrder: polytSubmitOrder
    }

    if (document.URL.includes('polyt.cn/show/')) {
        if (document.title === "系统繁忙" ||
            ['售票中', '未上架'].indexOf(document.getElementById('ticketStatus').innerHTML) === -1) {
                location.reload()
        }

        polytSubmitTicket()
    } else if (document.URL.includes('polyt.cn/submitOrder')) {
        polytSubmitOrder()
    }

})();
