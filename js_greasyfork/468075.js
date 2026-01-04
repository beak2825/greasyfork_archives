// ==UserScript==
// @name         (新商盟)一键全部订满
// @namespace    none
// @version      0.1
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468075/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E5%85%A8%E9%83%A8%E8%AE%A2%E6%BB%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/468075/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E5%85%A8%E9%83%A8%E8%AE%A2%E6%BB%A1.meta.js
// ==/UserScript==

//方法2:新商盟所有目录订单和新商盟所有购物车(分开操作一键订满)【适用app版和pc版】
//2.1检测到当前页面是▶目录订单◀【检测目录订单元素】页面则执行下面代码
if (document.querySelector('#cgt > div.orderinfo > div.order-time > span.page-name')) {
    function fillInputs(inputsSelector, limitsSelector) {
        var inputs = document.querySelectorAll(inputsSelector);
        var limits = document.querySelectorAll(limitsSelector);
        for (var i = 0; i < inputs.length; i++) {
            if (limits[i] && limits[i].id.startsWith('qty_lmt_') && parseInt(limits[i].textContent.trim()) >= 1) {
                inputs[i].value = limits[i].textContent.trim();
                inputs[i].dispatchEvent(new Event('blur'));
            }
        }
    }

    // 广西新商盟目录订单一键订满
    fillInputs('input[id^="ord_qty_"][name="ord_qty"]', 'span.cgt-col-qtl-lmt');

    // 广西新商盟购物车一键订满
    fillInputs('input[id^="ord_qty_input_"][name="ord_qty_input"][class="xsm-order-list-shuru-input yhfont"]', 'span[id^="qty_lmt_span_"][class="num-span"]');

    // 其他新商盟目录订单一键订满
    fillInputs('input[id^="req_qty_"][name="req_qty"][class="xsm-order-list-shuru-input"]', 'span[id^="qty_lmt_"][class="cgt-col-qtl-lmt"]');

    // 其他新商盟购物车一键订满
    fillInputs('input[id^="req_qty_"][name="req_qty"][class="xsm-order-list-shuru-input tc yhfont"]', 'span[id^="qty_lmt_span_"][class="num-span"]');
}


//2.2检测到当前页面是▶购物车◀【检测购物车元素】页面则执行下面代码只在购物车里操作
if (document.querySelector('#cbody > div > div.orderinfo > div.order-time > span')) {
    let inputElements = document.querySelectorAll('input.xsm-order-list-shuru-input');
    let inputValues = [];
    inputElements.forEach(inputElement => {
        let input_id = inputElement.id;
        let qty_lmt_id;
        if (inputElement.hasAttribute('data-cgt-code')) {
            qty_lmt_id = 'qty_lmt_' + inputElement.getAttribute('data-cgt-code');
        } else {
            qty_lmt_id = 'qty_lmt_span_' + input_id.split('_')[2];
        }
        let qty_lmt = document.querySelector('#' + qty_lmt_id);
        if (qty_lmt && qty_lmt_id.startsWith('qty_lmt_') && parseInt(qty_lmt.innerText) >= 1) {
            inputValues.push(qty_lmt.innerText);
        } else {
            inputValues.push(null);
        }
    });

    inputElements.forEach((inputElement, index) => {
        if (inputValues[index] !== null) {
            inputElement.value = inputValues[index];
            inputElement.dispatchEvent(new Event('blur'));
        }
    });
}