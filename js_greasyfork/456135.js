// ==UserScript==
// @name         Yandex Eda Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Show value of goods on the Yandex Eda site
// @author       IGERBIT
// @match        https://eda.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456135/Yandex%20Eda%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/456135/Yandex%20Eda%20Value%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.prefect = 0;

    function calc(){
        let lerp = (a,b,t) => a + (b-a) * t;
        let colorPerf = isFinite(window.prefect) && isFinite(1 / window.prefect)
        let list = [...document.getElementsByClassName('UiKitDesktopProductCard_descriptionWrapper')]
        for(const item of list){
            let priceEl = item.querySelector('.UiKitDesktopProductCard_price');
            let weightEl = item.querySelector('.UiKitDesktopProductCard_weight');
            let priceParts = priceEl.innerText.split('|')[0].split('₽');
            let price = parseInt(priceParts[0].replaceAll('  ',''));
            let weight = parseInt(weightEl.innerText);
            if(!isFinite(price) || !isFinite(weight)) continue;
            let type = weightEl.innerText.replaceAll(',','.').split(' ')[1];
            if(type == "кг") { type = "г"; weight *= 1000; }
            if(type == "kg") { type = "g"; weight *= 1000; }
            if(type == "л") { type = "мл"; weight *= 1000; }
            if(type == "l") { type = "ml"; weight *= 1000; }
            let profit = weight / price;

            priceEl.innerHTML = `${priceParts.join('₽')} | <span class=\"profit_\" style="font-size: 0.8em;" >${profit.toFixed(2)} ${type}/₽</span>`;
            let profitEl = priceEl.querySelector('.profit_');
            if(colorPerf){
                profitEl.style.color = `rgb(${lerp(255,0, profit * (1 / window.prefect))},${lerp(0,255, profit * (1 / window.prefect))},0)`
            }
            else {
                profitEl.style.color = `rgb(0,0,0)`
            }

        }
    }

    async function calcAsync() {
        if(window.calcInterval) {
            clearInterval(window.calcInterval);
            window.calcInterval = void 0;
        }
        window.calcInterval = setInterval(() => calc(), 1000);
    }

    let popup = document.createElement('div');
    document.body.appendChild(popup);
    popup.style.position = 'fixed';
    popup.style.backgroundColor = '#f5f4f2';
    popup.style.borderRadius = '10px';
    popup.style.width = '200px';
    popup.style.height = '50px';
    popup.style.boxShadow = '#000000ab 1px 3px 14px';
    popup.style.right = '5px';
    popup.style.bottom = '5px';
    popup.innerHTML = `Perfect: <input type="number" id="perfect_input">`
    let input = popup.querySelector('#perfect_input')
    input.value = "";
    input.oninput = () => {
        let newValue = +input.value;
        if(!isNaN(newValue) && isFinite(newValue)) window.prefect = newValue;
    }


    calcAsync();
})();