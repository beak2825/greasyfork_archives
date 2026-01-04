// ==UserScript==
// @name         记得领券！京东PLUS会员
// @namespace    jd.com
// @version      20180923.1
// @description  在购物车结算页面添加一个按钮，提醒领取PLUS会员优惠券
// @author       dbw9580
// @match        https://cart.jd.com/cart*
// @match        https://cart.jd.com/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/369909/%E8%AE%B0%E5%BE%97%E9%A2%86%E5%88%B8%EF%BC%81%E4%BA%AC%E4%B8%9CPLUS%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/369909/%E8%AE%B0%E5%BE%97%E9%A2%86%E5%88%B8%EF%BC%81%E4%BA%AC%E4%B8%9CPLUS%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const button_fix_css = `
        .toolbar-wrap .btn-area .submit-btn {
            display: inline-block !important;
        }
    `;

    const button_inline_style = `
        display: inline-block;
        position: relative;
        width: 96px;
        height: 52px;
        line-height: 52px;
        color: #fff;
        text-align: center;
        font-size: 18px;
        font-family: 'Microsoft YaHei';
        background: #e54346;
        overflow: hidden;
    `;

    if (document.getElementsByClassName("submit-btn").length != 0) {
        GM_addStyle(button_fix_css);
        let father_of_submit_btn = document.getElementsByClassName("submit-btn")[0].parentElement;
        let template = document.createElement("template");
        template.innerHTML = `<a href="//plus.jd.com/coupon/index" target="_blank" style="${button_inline_style}">去领券</a>`;
        let go_get_coupon = template.content.firstChild;
        father_of_submit_btn.appendChild(go_get_coupon);
    }

})();
