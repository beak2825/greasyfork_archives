// ==UserScript==
// @name         UpsItemSelector - Heart
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Select and unselect items from the start in Item market
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514367/UpsItemSelector%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/514367/UpsItemSelector%20-%20Heart.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let itemData = [];
    let State = {
        None: 0,
        Add: 1,
        Remove: 2
    }

    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (upsScripts === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return {};
        }
        return JSON.parse(upsScripts);
    }

    function setLocalStorage(open) {
        let upsScripts = getLocalStorage();
        upsScripts["ItemMarketBarrier"] = open;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
    }

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

    function saveInputs() {
        waitForElm(".selectAll___hgs59").then(() => {
            let itemRows = document.getElementsByClassName('itemRow___Mf7bO');
            for (let itemRow of itemRows) {
                let name = itemRow.querySelector('.name___XmQWk.t-overflow').innerText;
                let quantity = 0;
                let id = 0;
                try {
                    quantity = itemRow.querySelector('.input-money-symbol').nextSibling.nextSibling.value;
                } catch (e) {
                    let checkbox = itemRow.querySelector('.checkbox-css');
                    id = checkbox ? checkbox.id.split('-').pop() : 0;
                }
                let price = itemRow.querySelector('.price___nNUAv span').innerText;

                let modifiers = itemRow.querySelectorAll('.modifier___qyMWH');
                let bonuses = !Array.from(modifiers).every(modifier =>
                    modifier.classList.contains('bonus-attachment-blank-bonus-25')
                );

                itemData.push({
                    name: name,
                    mvPrice: price,
                    quantity: quantity,
                    id: id,
                    rw: bonuses
                });
            }
        });
    }

    function selectAllNonRW() {
        let existingDiv = document.getElementById('upsItemSelector');
        if (existingDiv) existingDiv.remove();
        let div = document.createElement('div');
        div.id = 'upsItemSelector';

        let input = document.createElement('input');
        input.id = 'itemMarket-selectAllNonRwCheckbox';
        input.className = 'checkbox-css';
        input.type = 'checkbox';
        input.checked = true;

        let label = document.createElement('label');
        label.className = 'marker-css';
        label.textContent = 'Select All Non RW';
        label.style = 'font-weight: 700;';

        div.appendChild(input);
        div.appendChild(label);
        waitForElm(".selectAll___hgs59").then((elm) => {
            elm.insertBefore(div, elm.firstChild);
        });
        div.addEventListener('click', function () {
            input.checked = !input.checked;
            input.checked ? label.textContent = 'Select All Non RW' : label.textContent = 'Unselect All Non RW';
            let itemRows = document.getElementsByClassName('itemRow___Mf7bO');
            for (let itemRow of itemRows) {
                let name = itemRow.querySelector('.name___XmQWk.t-overflow').innerText;
                let item = itemData.find(item => item.name === name);
                if (item.id !== 0) {
                    let checkbox = itemRow.querySelector('.checkbox-css');
                    let id = checkbox ? checkbox.id.split('-').pop() : 0;
                    item = itemData.find(item => item.id === id);
                }
                if (!item.rw) {
                    if (item.quantity === 0) {
                        let checkbox = itemRow.querySelector('.checkboxContainer___lflzn').children[0];
                        if (checkbox.checked !== input.checked) {
                            checkbox.click();
                        }
                    } else {
                        let inputMoney = itemRow.querySelector('.input-money-symbol');
                        input.checked ? inputMoney.nextSibling.value = item.quantity : inputMoney.nextSibling.value = 0;
                        inputMoney.nextSibling.dispatchEvent(new Event('input', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
                    }
                }
            }
        });
    }

    function swtichButtonPlace() {
        waitForElm(".selectAll___hgs59").then((elm) => {
            if (document.getElementById('upsSelectorMenu')) return;
            let div = document.createElement('div');
            div.id = "upsSelectorMenu";
            div.appendChild(elm);
            let previousSibling = document.getElementsByClassName('controls___N9naF')[0];
            previousSibling.after(div);
        });
    }

    function disableButton(button) {
        button.disabled = true;
    }

    function enableButton(button) {
        button.disabled = false;
    }

    function updateButtons() {
        let upsScripts = getLocalStorage();
        let open = upsScripts["ItemMarketBarrier"];
        let btnAdd = document.querySelector('#btnAdd');
        let btnRemove = document.querySelector('#btnRemove');

        if (open === 2) {
            disableButton(btnRemove);
            enableButton(btnAdd);
        } else if (open === 1) {
            disableButton(btnAdd);
            enableButton(btnRemove);
        } else {
            enableButton(btnAdd);
            enableButton(btnRemove);
        }
    }

    function createButton(text, onClick, id) {
        let button = document.createElement("button");
        button.innerText = text;
        button.id = id;
        button.addEventListener("click", onClick);
        return button;
    }

    function modifyPrice(up) {
        let itemRows = document.getElementsByClassName('itemRow___Mf7bO');
        for (let itemRow of itemRows) {
            let inputMoney = itemRow.querySelector(".priceInputWrapper___TBFHl .input-money");
            let price = parseInt(inputMoney.value.replace(/,/g, ''), 10);
            let modifiers = itemRow.querySelectorAll('.modifier___qyMWH');
            let bonuses = !Array.from(modifiers).every(modifier =>
                modifier.classList.contains('bonus-attachment-blank-bonus-25')
            );
            if (bonuses) continue;

            if (up)
                inputMoney.value = price * 10;
            else if (inputMoney.value.endsWith('0'))
                inputMoney.value = price / 10;
            inputMoney.dispatchEvent(new Event('input', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }
    }

    function openMarketOption() {
        let existingDiv = document.getElementById('upsItemMarketBarrier');
        if (existingDiv) existingDiv.remove();
        let div = document.createElement('div');
        div.id = 'upsItemMarketBarrier';

        let btnAdd = createButton("Add 0", function () {
            modifyPrice(true);
            setLocalStorage(State.Add);
            updateButtons();
        }, 'btnAdd');

        let btnRemove = createButton("Remove 0", function () {
            modifyPrice(false);
            setLocalStorage(State.Remove);
            updateButtons();
        }, 'btnRemove');

        let btnReset = createButton("Reset", function() {
            setLocalStorage(State.None);
            updateButtons();
        }, 'btnReset');

        div.appendChild(btnReset);
        div.appendChild(btnAdd);
        div.appendChild(btnRemove);
        waitForElm("#upsSelectorMenu").then((elm) => {
            elm.insertBefore(div, elm.firstChild);
            updateButtons();
        });
    }

    if (location.href.includes("viewListing")) {
        swtichButtonPlace();
        saveInputs();
        selectAllNonRW();
        openMarketOption();
    } else {
        window.addEventListener('popstate', function (event) {
            if (location.href.includes("viewListing")) {
                swtichButtonPlace();
                saveInputs();
                selectAllNonRW();
                openMarketOption();
            }
        });
    }

    function addStyle(styles) {
        let css = document.createElement('style');
        css.type = 'text/css';
        if (css.styleSheet) css.styleSheet.cssText = styles;
        else css.appendChild(document.createTextNode(styles));
        document.head.appendChild(css);
    }

    addStyle(`
    #upsItemMarketBarrier {
        width: 185px;
        justify-content: space-around; 
        align-items: end;
        display: flex;
        font-weight: bold;
    }

    #upsItemMarketBarrier button {
        padding: 5px;
        color: #598E23;
        border: 1px solid #598E23;
        cursor: pointer;
        font-size: 12px;
        
    }

    #upsItemMarketBarrier button:hover {
        color: #ccc;
        border-color: #ccc;
    }
    
    #upsItemMarketBarrier button:disabled {
        color: #BC4D2E;
        border-color: #BC4D2E;
        cursor: not-allowed;
    }
    
    .selectAll___hgs59 {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 20px;
        padding: 0 !important;
        border: 0 !important;
    }
    
    #upsItemSelector {
        display: flex;
        justify-content: space-around;
        font-weight: bold;
        align-items: center;
        gap: 16px; 
    }
    
    #upsSelectorMenu {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: end;
        gap: 16px; 
        border-top: var(--item-market-border-light);
        padding: 10px;
    }
    `);
})();