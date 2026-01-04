// ==UserScript==
// @name         cpp抢票脚本
// @namespace    http://tampermonkey.net/
// @version      2024-2-1
// @description  代抢
// @author       3432276416
// @match        https://cp.allcpp.cn/*
// @icon         https://img01.yzcdn.cn/v2/image/yz_fc.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525422/cpp%E6%8A%A2%E7%A5%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/525422/cpp%E6%8A%A2%E7%A5%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(async function() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    let item = document.querySelectorAll('.ticket-box');
    for (let i = 0; i < item.length; i++) {
        if (item[i].innerText.includes('双日')) {
            item[i].click();
        }
    }


    let btn = document.querySelectorAll('button');
    for (let i = 0; i < btn.length; i++) {
        if (btn[i].innerText.includes('购票')) {

            btn[i].click();
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    let info = document.querySelectorAll('.sc-hjsNop.gQcqhw.purchaser-item')[0];
    if (info != null) {
        info.click();
    }
    let paybtn = document.querySelectorAll('button');
    for (let i = 0; i < paybtn.length; i++) {
        if (paybtn[i].innerText.includes('付款')) {
            paybtn[i].click();
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload(true);
})();