// ==UserScript==
// @name         UpsQuickStock
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Confirm Faster on hospital page
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525614/UpsQuickStock.user.js
// @updateURL https://update.greasyfork.org/scripts/525614/UpsQuickStock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return getLocalStorage();
        }
        upsScripts = JSON.parse(upsScripts);
        if (upsScripts["quickStock"] == null) {
            upsScripts["quickStock"] = {};
            upsScripts["quickStock"]["id"] = 1;
            localStorage.setItem("upscript", JSON.stringify(upsScripts));
            return getLocalStorage();
        }
        return upsScripts;
    }

    function setStockId(stockId) {
        let upsScripts = getLocalStorage();
        upsScripts["quickStock"]["id"] = stockId;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
    }

    function addGlobalStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .ups-quick-stock {
                display: flex !important;
                flex-direction: column !important;
                height: auto !important;
                padding: 8px 8px;
                gap:16px;
            }
            `;
        document.head.appendChild(style);
    }

    function buttonBuilder(text, onClickFunction) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('torn-btn');

        button.addEventListener('click', onClickFunction);

        return button;
    }

    function createForm(div) {
        const formContainer = document.createElement('div');
        formContainer.style.display = 'flex';
        formContainer.style.alignItems = 'center';
        formContainer.style.gap = '10px';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'quick-stock-input';
        input.placeholder = 'Enter amount';
        input.style.padding = '5px';
        input.style.color = '#9f9f9f';
        input.style.width = '100px';
        input.style.background = 'linear-gradient(0deg,#111,#000)';
        input.value = document.getElementById('user-money').getAttribute('data-money');

        const buttons = [
            buttonBuilder('Open Stock', () => {
                let stockId = getLocalStorage()["quickStock"]["id"];
                let stockChildren = document.getElementById(stockId).children;

                stockChildren[2].click();
            }),
            buttonBuilder('Buy', () => {
                if (document.querySelector('.buyBlock___bIlBS').querySelector('.input-money')) {
                    let stockId = getLocalStorage()["quickStock"]["id"];
                    let priceSpans = document.getElementById(stockId).querySelectorAll('.number___hhGqA');
                    let priceString = Array.from(priceSpans).map(span => span.textContent).join('');
                    let price = parseFloat(priceString);
                    let userValue = parseFloat(document.getElementById('quick-stock-input').value);
                    let quantity = Math.floor(userValue / price);
                    let buyBlock = document.querySelector('.buyBlock___bIlBS');
                    let inputMoney = buyBlock.getElementsByClassName('input-money');
                    let button = buyBlock.querySelector('.torn-btn');

                    if (inputMoney[1].value !== quantity.toString() || inputMoney[1].value === undefined) {
                        inputMoney[0].value = quantity;
                        inputMoney[0].setAttribute("data-money", quantity.toString());
                        inputMoney[0].dispatchEvent(new Event('input', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
                    } else {
                        button.click();
                    }
                } else {
                    let actionsChildren = document.querySelector('.buyBlock___bIlBS').querySelector('.actions___PIYmF').children;
                    if (actionsChildren.length > 1)
                        actionsChildren[1].click();
                    else
                        actionsChildren[0].click();
                }
            }),
            buttonBuilder('Sell', () => {
                if (document.querySelector('.sellBlock___A_yTW').querySelector('.input-money')) {
                    let stockId = getLocalStorage()["quickStock"]["id"];
                    let priceSpans = document.getElementById(stockId).querySelectorAll('.number___hhGqA');
                    let priceString = Array.from(priceSpans).map(span => span.textContent).join('');
                    let price = parseFloat(priceString);
                    let userValue = parseFloat(document.getElementById('quick-stock-input').value);
                    let quantity = Math.floor(userValue / price);
                    let sellBlock = document.querySelector('.sellBlock___A_yTW');
                    let inputMoney = sellBlock.getElementsByClassName('input-money');
                    let button = sellBlock.querySelector('.torn-btn');

                    console.log(inputMoney)
                    if (inputMoney[1].value !== quantity.toString() || inputMoney[1].value === undefined) {
                        inputMoney[0].value = quantity;
                        inputMoney[0].setAttribute("data-money", quantity.toString());
                        inputMoney[0].dispatchEvent(new Event('input', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
                    } else {
                        button.click();
                    }
                } else {
                    let actionsChildren = document.querySelector('.sellBlock___A_yTW').querySelector('.actions___PIYmF').children;
                    if (actionsChildren.length > 1)
                        actionsChildren[1].click();
                    else
                        actionsChildren[0].click();
                }
            }),
            buttonBuilder('Select Stock', () => {
                const stockId = prompt('Enter Stock ID (number):');
                if (stockId !== null && stockId.trim() !== '') {
                    setStockId(Number(stockId));
                }
            })
        ];

        formContainer.appendChild(input);
        buttons.forEach(button => formContainer.appendChild(button));

        div.appendChild(formContainer);
    }

    function createBox() {
        waitForElm(".delimiter___zFh2E").then((delimiter) => {
            let div = document.createElement('div');

            div.classList.add("title-black");
            div.classList.add("titles___qLpj0");
            div.classList.add("ups-quick-stock");
            div.innerHTML = "<p>Quick Stock</p>";

            createForm(div);

            delimiter.after(div);
        });
    }

    addGlobalStyles();
    createBox();
})();