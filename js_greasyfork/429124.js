// ==UserScript==
// @name         京喜工厂
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京喜工厂收电力
// @author       wl
// @match        https://wqs.jd.com/pingou/dream_factory/*.html*
// @icon         https://www.google.com/s2/favicons?domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429124/%E4%BA%AC%E5%96%9C%E5%B7%A5%E5%8E%82.user.js
// @updateURL https://update.greasyfork.org/scripts/429124/%E4%BA%AC%E5%96%9C%E5%B7%A5%E5%8E%82.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let href = location.href
    // 活动页面
    if (href.indexOf('dream_factory/index.html') > 0) {
        console.error('活动页面，等待5s')
        await wait(3000)
        console.log('奥利给！！！京喜工厂自动收取双倍电力，开干~');
        lifecycle()
    }
    // 任务页面
    else if (href.indexOf('dream_factory/market.html') > 0) {
        console.error('任务页面，等待5s')
        await wait(3000)
        scroll10()
    }

    async function lifecycle() {
        // 有弹窗的话，关闭
        console.error('等10s，是否有弹窗')
        await wait(10000)
        const level = 3
        const maxDianli = (level - 1) * 30 + 300
        if (document.getElementsByClassName('simple_dialog_btn')[0]) {
            let close = document.getElementById('dialog').getElementsByClassName('close')[0]
            close && close.click()
        }
        let timeid = setInterval(async function() {
            let alternator = document.querySelector(".alternator-num-n")
            if (alternator) {
                let num = alternator.innerText;
                console.log("监测电力值 ->> " + num);
                num = parseInt(num);
                if (num >= maxDianli) {
                    console.error("电力值满了啦，", maxDianli)
                    // 先点击，然后出弹框
                    let alternatorBtn = document.querySelector("#alternator");
                    alternatorBtn && alternatorBtn.click();
                    // -------// 逛集市翻倍电力
                    clearInterval(timeid)
                    await wait(2000)
                    let dbtn = document.getElementsByClassName('simple_dialog_btn')[0]
                    if (dbtn) {
                        console.error('开始跳转')
                        dbtn.click()
                    } else {
                        console.error('没有跳转按钮，重新启动定时器')
                        lifecycle()
                    }
                }
            }
        }, 10000);
    }


    async function scroll10() {
        let market_scroll = document.getElementById('market_scroll')
        if (!market_scroll) {
            await wait(5000)
            scroll10()
        } else {
            console.error('开始滚动')
            market_scroll.scrollTo(0, 1000)
            await wait(15000) // 等待倒计时
            let floating = document.getElementsByClassName('floating')[0]
            let finish = floating.getElementsByClassName('floating_finish')[0], prize = floating.getElementsByClassName('floating_prize')[0]
            console.error('任务完成，开始返回')
            if (prize) { // 返回按钮
                prize.click()
            } else {
                finish.click()
                await wait(1000)
                floating.getElementsByClassName('floating_prize')[0].click()
            }
        }
    }

    async function wait(time = 1000) {
        return new Promise((res, rej) => {
            setTimeout(() => { res() }, time)
        })
    }
})();