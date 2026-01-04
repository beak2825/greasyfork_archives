// ==UserScript==
// @name         开点JLC盲盒
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  开点JLC盲盒!
// @author       You
// @match        https://list.szlcsc.com/brand/*
// @match        https://list.szlcsc.com/brand_page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szlcsc.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515138/%E5%BC%80%E7%82%B9JLC%E7%9B%B2%E7%9B%92.user.js
// @updateURL https://update.greasyfork.org/scripts/515138/%E5%BC%80%E7%82%B9JLC%E7%9B%B2%E7%9B%92.meta.js
// ==/UserScript==

(async function() {
    const style = `
#ext-root {
    position: fixed;
    top: 111px;
    right: 20px;
    width: 370px;
    max-height: 80vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: larger;
}`
    GM_addStyle(style)
    const rootElem = document.createElement("div")
    rootElem.id = "ext-root"
    'use strict';
    const span = document.createElement("span");
    rootElem.appendChild(span)
    const button = document.createElement("button")
    button.innerText = "+16!"
    button.onclick = async () => {
        const items = [];
        const sleep = v => new Promise(r => setTimeout(r, v))
        document.querySelectorAll(".list-items").forEach(elem => {
            const prices = elem.querySelectorAll(".show-price-span");
            if (prices.length == 0)
                return;
            const item = {};
            item.elem = elem;
            item.orderUnit = parseFloat(prices[0].getAttribute("minordernum"));
            item.price = [];
            var stock = elem.querySelector(".stock-nums-gd").querySelector("span").innerText // 这里换仓 (gd/js
            item.stock = parseInt(stock)
            if (stock.indexOf("K") != -1) {
                item.stock *= 1000
            }
            if (item.stock == 0)
                return;
            for (const price of prices) {
                item.price.push([parseFloat(price.getAttribute("data-startpurchasednumber")), parseFloat(price.getAttribute("data-endpurchasednumber")), item.orderUnit * parseFloat(price.getAttribute("orderprice"))])
            }
            items.push(item)
        })
        function findBestCombination(data, targetAmount) {
            const itemPrices = [];
            const outputSols = 10
            let solution = new Array(outputSols).fill({item: [], price: Infinity})
            let maxSolution = Infinity
            function replaceSolution(item, price) {
                if (price < targetAmount)
                    return;
                if (price > maxSolution)
                    return;
                for (const i in solution) {
                    if (solution[i].price > price) {
                        solution.splice(i, 0, {item, price})
                        solution.splice(outputSols, 1)
                        break;
                    }
                }
                maxSolution = solution[outputSols - 1].price
                // solution.sort((a,b) => (a.price - b.price))
            }
            for (const item of data) {
                const { price, stock } = item;
                for (const [start, end, unitPrice] of price) {
                    for (let i = start; i <= (end == -1 ? Infinity : Math.min(end, stock)) ; i++) {
                        const price = unitPrice*i;
                        //const price = Math.round(unitPrice*i*100)/100;
                        const it = {
                            item: item,
                            count: i,
                            price: price
                        };
                        if (price > targetAmount) {
                            replaceSolution([it], price);
                            break;
                        };
                        itemPrices.push(it);
                    }
                }
            }
            itemPrices.sort((a,b) => (a.price - b.price))
            console.log(solution)
            for (let i = 0; i < itemPrices.length; i++) {
                const item1 = itemPrices[i];
                for (let j = i; j < itemPrices.length; j++) {
                    const item2 = itemPrices[j];
                    if (item2.item == item1.item)
                        continue;
                    replaceSolution([item1, item2], item1.price + item2.price)
                    for (let k = j; k < itemPrices.length; k++) {
                        const item3 = itemPrices[k];
                        if (item1.item == item3.item)
                            continue;
                        if (item2.item == item3.item)
                            continue;
                        replaceSolution([item1, item2, item3], item1.price + item2.price+item3.price)
                    }
                }
            }

            console.log(solution)
            return solution[0];
        }
        const targetAmount = 16;
        const result = findBestCombination(items, targetAmount);
        span.innerText += `金额${result.price}` + "\n"
        console.log("Best Amount:", result.price);
        console.log("Combination:", result.item);
        await sleep(2000)
        for (const item of result.item) {
            await sleep(1500)
            console.log(item.item.elem, item.count*item.item.orderUnit)
            item.item.elem.querySelector(`input.cartnumbers`).value = item.count*item.item.orderUnit
            item.item.elem.querySelector(`button.addCartBtn`).click()
        }
        document.title = result.price + " - " + document.title
    }
    rootElem.appendChild(button)
    document.body.appendChild(rootElem)
    // Your code here...
})();