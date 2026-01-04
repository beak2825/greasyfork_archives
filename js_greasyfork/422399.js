// ==UserScript==
// @name         FBA原価計算機
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fulfillment by amazon price simulator in Profit margin calculator
// @author       Vizzr
// @match        https://sellercentral-japan.amazon.com/fba/revenuecalculator/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422399/FBA%E5%8E%9F%E4%BE%A1%E8%A8%88%E7%AE%97%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/422399/FBA%E5%8E%9F%E4%BE%A1%E8%A8%88%E7%AE%97%E6%A9%9F.meta.js
// ==/UserScript==

(function() {

    'use strict';
    function grossMargin(percent){
        const sellerProceeds = document.querySelector('#afn-seller-proceeds').value ;
        const sellingFee = document.querySelector('#afn-selling-fees').textContent;
        const sellingFeeTax = sellingFee * 0.1

        const salesPrice = document.querySelector('#afn-total-revenue').value
        return Math.floor( (sellerProceeds - sellingFeeTax) - salesPrice * percent);
    }

    function hasGrossMarginContainer(){
       return document.querySelector('#grossMargin-calclated');
    }

    function calclate(){
            setTimeout(()=>{
                let grossMargins = [0.15,0.16,0.17,0.18,0.19,0.2];

                const salesPrice = document.querySelector('#afn-total-revenue').value
                let container = document.createElement('div');
                container.id ="grossMargin-calclated"

                if(hasGrossMarginContainer()){
                    container = document.querySelector('#grossMargin-calclated');
                    container.innerHTML = "";
                }

                const ASIN = document.querySelector('#product-info-asin').textContent;
                const expectedPrice = document.querySelector('#afn-pricing').value;
                const productInfoTitle = document.querySelector('#product-info-title').textContent;

                grossMargins.forEach((val) => {
                    const price = grossMargin(val);
                    const expectedProfit = Math.floor(expectedPrice * val);
                    let el = document.createElement('div');
                    const parcent =val*100;
                    el.id = `grossMargin${parcent}`;
                    el.innerHTML = `<button id=grossMargin${parcent}copy>${parcent}%: </button><span>${price}/${salesPrice}@1 ${Math.floor(price*2)}@2 ${Math.floor(price*3)}@3  ${Math.floor(price*4)}@4 ${productInfoTitle} 粗利:${expectedProfit} ${ASIN} </span> ${Math.floor(price/2)}@/2 ${Math.floor(price/3)}@/3 `;
                    container.appendChild(el);

                });

                if(hasGrossMarginContainer()){
                } else {
                   document.querySelector('#secondHorizontalSection').after(container);
                }

                grossMargins.forEach((val) => {
                    const parcent =val*100;
                    document.querySelector(`#grossMargin${parcent}copy`).onclick = () => {
                        const text = document.querySelector(`#grossMargin${parcent}copy`).textContent;
                        navigator.clipboard.writeText(document.querySelector('#grossMargin20 span').textContent).then(e => {
                            document.querySelector(`#grossMargin${parcent}copy`).textContent = 'copied!';
                            setTimeout(()=>{
                                document.querySelector(`#grossMargin${parcent}copy`).textContent = text;
                            },500);
                        });
                    }
                });

            },1000);
    }

    window.addEventListener('load', ()=>{
        document.querySelector("#update-fees-link-announce").addEventListener('click',()=>{
        calclate()});
    });

    calclate();
})();