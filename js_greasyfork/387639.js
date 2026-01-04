// ==UserScript==
// @name         大麦自动抢票选
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Payne
// @match        https://m.damai.cn/damai/confirmorder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387639/%E5%A4%A7%E9%BA%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/387639/%E5%A4%A7%E9%BA%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENABLE_AUTO_REFRESH = false; // true 的时候自动刷新
    const ENABLE_AUTO_SUBMIT = true; // true 的时候自动提交

    const query = /buyParam=(\d+)_(\d+)_(\d+)/.exec(location.search);
    if (!query) {
        console.log('缺少购物参数 buyParam');
        return;
    }

    // 购票数目
    const cnt = parseInt(query[2]);

    // 状态
    var status = 0;
    var n;
    var timerAutoRefresh;

    if (ENABLE_AUTO_REFRESH) {
        timerAutoRefresh = setInterval(function(){
            const empty = document.getElementsByClassName('empty-page');
            if (!empty.length) {
                return;
            }
            clearInterval(timerAutoRefresh);

            console.log('Empty!');
            location.reload();
        }, 200);
    }


    // 自动勾人
    const timerIdCards = setInterval(function(){
        const list = document.getElementsByClassName('buyer-list');
        if (!list.length) {
            return;
        }

        clearInterval(timerIdCards);
        if (ENABLE_AUTO_REFRESH) clearInterval(timerAutoRefresh);

        const items = list[0].getElementsByClassName('item');
        n = cnt > items.length ? items.length : cnt;
        for (var i = 0; i < n; i++) {
            items[i].click()
        }

        status = 1;
    }, 10);

    // 自动点提交
    if (ENABLE_AUTO_SUBMIT) {
        const timerSubmit = setInterval(function() {
            if (status !== 1) return;

            const items = document.getElementsByClassName('buyer-list')[0].getElementsByClassName('icon-yigouxuan1');
            if (items.length < n) return;

            clearInterval(timerSubmit);

            document.getElementsByClassName('dm-submit-order')[0].getElementsByClassName('dm-button')[0].click()
        }, 10);
    }

})();