// ==UserScript==
// @name         To Dounai 华为商城 提交订单页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动疯狂提交订单
// @author       Juzi
// @match        https://www.vmall.com/order/nowConfirmcart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475728/To%20Dounai%20%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%20%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475728/To%20Dounai%20%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%20%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var tips = document.createElement('div')
    tips.innerHTML = '正在提交，请稍等...'
    tips.id = 'juzi_tips'
    tips.style.cssText = `
        width: 300px;
        height: 40px;
        position: fixed;
        top: 50%;
        right: 5%;
        border-radius: 8px;
        background: #2FC09C ;
        border: 1px solid #03416F;
        line-height:40px;
        font-size:28px;
        text-align:center;
        color:#fff;
        z-index:9999;
    `
    document.body.appendChild(tips);
    var TipsContainer = null
    let count = 1;
    this.timer = setInterval(() => {
        if (!TipsContainer) {
TipsContainer =document.querySelector('#juzi_tips')
        }
        if (window.location.href.indexOf("order/nowConfirmcart") > -1 &&
        new Date().getTime() >= 1695204300) {
            console.log("正在提交！！！！！！！！");
            window.ec.order.submit();
            TipsContainer && (TipsContainer.innerText = `疯狂提交 ${count} 次！`)
        } else {
            clearInterval(this.timer);
        }
        count ++
    }, 100);
})();