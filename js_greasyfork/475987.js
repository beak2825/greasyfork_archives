// ==UserScript==
// @name         CTMO Custom Recharge 中国电信澳门自定义充值
// @namespace    https://greasyfork.org/zh-CN/users/168542-archeb
// @version      0.1
// @description  允许你为预付费卡自定义充值金额
// @author       Archeb
// @license MIT
// @match        https://www.1888.com.mo/payRecharge/goToRecharge*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1888.com.mo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475987/CTMO%20Custom%20Recharge%20%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E6%BE%B3%E9%97%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%85%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/475987/CTMO%20Custom%20Recharge%20%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E6%BE%B3%E9%97%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%85%E5%80%BC.meta.js
// ==/UserScript==

(function() {

function addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

    addStyle(`form#dataForm {
    text-align: left;
    margin-left: 3%;
    margin-right: 3%;
    margin-top: 30px;
    font-size: 1.5em;
}`)

    document.querySelector('#payMoney').remove()
    document.querySelector('.confirm-price_bd>h3').remove()
    document.querySelector('#dataForm #payMoneyData').type="input"
	document.querySelector('#dataForm #payMoneyData').placeholder = "自定义金额";
    document.querySelector('#userType').value="22"

})();