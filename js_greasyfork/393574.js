// ==UserScript==
// @name         get-jd-coupon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get specific coupons
// @author       Coolman
// @match        https://birth.m.jd.com/babelDiy/Zeus/3DMauchBtuvSfu5XwMW1hgdZeLxr/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393574/get-jd-coupon.user.js
// @updateURL https://update.greasyfork.org/scripts/393574/get-jd-coupon.meta.js
// ==/UserScript==
(() => {
    'use strict';

    // 超级百亿补贴
    // https://birth.m.jd.com/babelDiy/Zeus/3DMauchBtuvSfu5XwMW1hgdZeLxr/index.html
    const keywords = ['Apple 苹果iPhone11',
    ]; // 想要的关键词
    const truePrice = 5000; // 券后九块九的我都要辣！！
    const moment = '2019-12-11 20:00'; // 抢购时间

    const ms = +new Date(moment); // 抢购时间毫秒值
    const pre = +new Date(ms - 1000 * 10); // 提前 10 秒钟准备
    const end = +new Date(ms + 1000 * 60 * 3); // 三分钟之后结束

    const reloadedKey = 'reloaded' + moment;

    const getAllLessThan = (price) => {
        const items = document.querySelectorAll('div.BillionSubsidy-content-item-coupon');
        for (let item of items) {
            const name = item.querySelector('div.BillionSubsidy-content-item-coupon-name');
            const truePrice = item.querySelector('div.BillionSubsidy-content-item-coupon-true-price-container > span');
            if (truePrice.innerText <= price) {
                console.log(`matched: [${ name.innerText }]`);
                const right = item.querySelector('div.BillionSubsidy-content-item-coupon-right-container');
                const down = item.querySelector('div.BillionSubsidy-content-item-coupon-right-down');
                if (right.innerText.includes('限量') && !right.innerText.includes('开抢')) {
                    if (down) {
                        console.info(`--- ${ name.innerText } ---`);
                        // down.click();
                        // down.remove();
                        console.info(`*** u get it ***`);
                    }
                }
            }
        }
    }

    const doTask = () => {
        const items = document.querySelectorAll('div.BillionSubsidy-content-item-coupon');
        for (let item of items) {
            const name = item.querySelector('div.BillionSubsidy-content-item-coupon-name');
            for (let key of keywords) {
                if (name.innerText.includes(key)) {
                    console.log(`key: [${ key }], matched: [${ name.innerText }]`);
                    const right = item.querySelector('div.BillionSubsidy-content-item-coupon-right-container');
                    const down = item.querySelector('div.BillionSubsidy-content-item-coupon-right-down');
                    if (right.innerText.includes('限量') && !right.innerText.includes('开抢')) {
                        console.log(`wanna [${ key }], matched ${ name.innerText }`);
                        if (down && !down.classList.contains('special')) {
                            console.info(`--- ${ name.innerText } ---`);
                            // down.click();
                            // down.remove();
                            console.info(`*** u get it ***`);
                        }
                    }
                }
            }
        }
    };

    // 滚动百亿补贴列表，使其全部加载出来
    document.onreadystatechange = () => {
        if ('complete' == document.readyState) {
            document.querySelector('div.container') && setTimeout(() => {
                document.querySelector('div.container').scrollIntoView(false);
            }, 600);
        }
    };

    // 获取服务器时间戳
    const getServerTime = async () => {
        return +new Date((await fetch(`?${ +new Date() }`, {
            method: 'head',
        }).then((res) => res.headers)).get("Date"));
    };

    const intervalId = setInterval(() => {
        console.log(`it is running...`);
        getServerTime().then(now => {
            console.log(`server time: ${ now }`);
            // 结束了
            if (now >= end) {
                console.info(`it's time to end.`);
                clearInterval(intervalId);
                return;
            }
            // 准备时间
            if (now >= pre) {
                console.log(`it's time to go...`);
                const reloadedValue = sessionStorage.getItem(reloadedKey);
                if (now >= ms) {
                    // 到点页面不会自动刷新，需要手动加载一下
                    if ('true' != reloadedValue) {
                        sessionStorage.setItem(reloadedKey, 'true');
                        location.reload();
                    }
                    doTask();
                    // getAllLessThan(truePrice);
                } else {
                    if ('false' != reloadedValue) {
                        sessionStorage.setItem(reloadedKey, 'false');
                    }
                }
            }
        });
    }, 800);
})();
