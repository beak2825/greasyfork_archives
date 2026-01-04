// ==UserScript==
// @name         wunderwelt price tool
// @namespace    https://github.com/ssoda01
// @version      1.0
// @description  wunderwelt price tool, 输入日汇价格自动计算人民币价格
// @author       sodakoo
// @license      GPL-3.0-only
// @match        https://www.wunderwelt.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wunderwelt.jp

// @downloadURL https://update.greasyfork.org/scripts/480734/wunderwelt%20price%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/480734/wunderwelt%20price%20tool.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const stylePriceSpanPrice = `
    .transformed-price-jpy2cny{
        color: #e3a2a2!important;
        background: #e3a2a233!important;
        margin: 4px!important;
    }
    .btn-common {
        position: fixed;
        top: 10px;
        right: 200px;
        z-index: 9999;
        border-radius: 20px;
        background: #fff;
        box-shadow: 5px 5px #e3a2a233;
        width: 220px;
        padding: 0 8px;
        border: 2px solid;
        transition: .3s;
        cursor: pointer;
    }
    .btn-active{
        border-color:#777;
        color: #777;
    }
    .input-common {
        position: fixed;
        top: 10px;
        right: 24px;
        z-index: 9999;
        border-radius: 20px;
        background: #fff;
        box-shadow: 5px 5px #e3a2a233;
        width: 160px;
        padding: 0 8px;
        border: 2px solid;
        transition: .3s;
        cursor: pointer;
    }
    .input-active{
        border-color:#777;
        color: #777;
    }
`
    // Current Japanese Yen to Chinese Yuan Exchange Rate
    let rateJPY2CNY = 0;
    
    var style = document.createElement('style');
    style.innerHTML = stylePriceSpanPrice;
    document.head.appendChild(style);

    let button = document.createElement('button');
    button.classList.add('btn-common');
    button.classList.add('btn-active');
    button.textContent = "CNY PRICE (100:???)";
    document.body.appendChild(button);
    button.disabled = true

    button.addEventListener('click', function () {
        addCNYSpan();
    });

    var input = document.createElement('input');
    input.placeholder = "请输入日元汇率"
    input.classList.add('input-common');
    input.classList.add('input-active');
    input.type = 'number';

    input.addEventListener('change', function () {
        rateJPY2CNY = input.value;
        if (rateJPY2CNY != 0) {
            button.textContent = `CNY PRICE (100:${rateJPY2CNY})`
            button.disabled = false
        }
        else{
            button.textContent = `CNY PRICE (100:???)`
            button.disabled = true
        }
    });

    document.body.appendChild(input);

    function transformStr2Price(text) {
        const regex = /[0-9.,]+/g;
        let priceStr = text.match(regex)
        if (priceStr instanceof Array && priceStr.length > 0) {
            priceStr = priceStr[0].replace(',', '')
            if (isNaN(Number(priceStr))) return 0
            return Number(priceStr)
        }
        else {
            return 0
        }
    }
    function transformJPY2CNY(price) {
        price = price / 100 * rateJPY2CNY;
        const options = { style: 'currency', currency: 'CNY' };
        let formattedMoney = price.toLocaleString('cn-ZH', options);
        return formattedMoney
    }
    const addCNYSpan = (priceDomList) => {
        if (isNaN(rateJPY2CNY) || rateJPY2CNY == 0) {
            alert('还没有输入汇率哦')
            return
        }
        // get elements
        if (!priceDomList) priceDomList = document.getElementsByClassName("money");
        if (priceDomList.length === 0) return;
        [...priceDomList].forEach(
            priceDom => {
                let price = transformStr2Price(priceDom.innerText);
                if (price === 0) return;
                let cnyDom = document.createElement("div");
                cnyDom.className = "transformed-price-jpy2cny";
                cnyDom.innerText = `${transformJPY2CNY(price)} CNY`;
                priceDom.parentNode.appendChild(cnyDom);
                return;
            }
        )
    }
})();
