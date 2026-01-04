// ==UserScript==
// @name         图灵管家
// @version      1.0.2
// @author       Elliot
// @description  图灵内部使用工具
// @match        *://tl.joyobpo.com/*
// @icon         https://tl.joyobpo.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/zh-CN/scripts/452239
// @downloadURL https://update.greasyfork.org/scripts/452239/%E5%9B%BE%E7%81%B5%E7%AE%A1%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/452239/%E5%9B%BE%E7%81%B5%E7%AE%A1%E5%AE%B6.meta.js
// ==/UserScript==

function add_sum_button() {
    document.querySelector('.xui-ant__table-page--renderBeforeTable--base').insertAdjacentHTML('beforeend', `<button type="button" id ="query_sum" class="ant-btn ant-btn-primary"><span>汇 总</span></button>`);
    document.querySelector('#query_sum').onclick = function () { query_bills() }
}

function query_bills() {
    let count = 0, sum = 0.00;
    document.querySelectorAll('[index="18"]').forEach(function (item) {
        count = count + 1
        sum = sum + Number(item.textContent);
    })
    let table = document.querySelector('.xui-ant__table-page--renderBeforeTable--base'),
        total = table.querySelector('#total');
    if (total) {
        total.innerHTML = `当前页面共查询到${count}条数据，总计${sum}元`;
    } else {
        table.insertAdjacentHTML('beforeend', `<span id="total">当前页面共查询到${count}条数据，总计${sum}元</sapn>`);
        // console.log(count, sum)
    }
}


(function () {
    setTimeout(add_sum_button, 500);

})();