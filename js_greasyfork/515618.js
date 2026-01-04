// ==UserScript==
// @name         UpsItemMarketBarrier - SayedSharon
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Overprice items in item market.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515618/UpsItemMarketBarrier%20-%20SayedSharon.user.js
// @updateURL https://update.greasyfork.org/scripts/515618/UpsItemMarketBarrier%20-%20SayedSharon.meta.js
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

    function swtichButtonPlace() {
        waitForElm(".selectAll___hgs59").then((elm) => {
            let div = document.createElement('div');
            div.id = "upsSelectorMenu";
            div.appendChild(elm);
            let previousSibling = document.getElementsByClassName('controls___N9naF')[0];
            previousSibling.after(div);
        });
    }

    function createButton(text, onClick) {
        let button = document.createElement("p");
        button.innerText = text;
        button.addEventListener("click", onClick);
        return button;
    }

    function createWarning(warningElements) {
        console.log(warningElements)
        let body = document.getElementById('body');
        let warningDiv = document.createElement("div");
        let itemDiv = document.createElement("div");
        let h1 = document.createElement("h1");
        let h3 = document.createElement("h3");
        let confirmButton = document.createElement("button");
        let cancelButton = document.createElement("button");

        warningDiv.classList.add("warning-barrier");
        confirmButton.classList.add("torn-btn");
        confirmButton.classList.add("ups-warning-confirm");
        cancelButton.classList.add("torn-btn");
        cancelButton.classList.add("ups-warning-cancel");
        h1.textContent = "WARNING";
        cancelButton.textContent = "Cancel";
        confirmButton.textContent = "Confirm";
        h3.textContent = "These elements are under 80% MV :"

        warningDiv.appendChild(h1);
        warningDiv.appendChild(h3);
        for (let e of warningElements) {
            let imgSrc = e.row.querySelector('.torn-item').src;
            let text = e.row.querySelector(".name___XmQWk").innerText;

            itemDiv.insertAdjacentHTML('beforeend', `
        <div class="itemRowWrapper___cFs4O">
            <div class="itemRow___Mf7bO">
                <button type="button" class="viewInfoButton___jOjRg" aria-label="View item info for Casket"
                        aria-expanded="false" i-data="i_76_883_414_32">
                    <span class="imageWrapper___y3aj7">
                        <img class="torn-item medium" src="${imgSrc}" alt="${text}">
                    </span>
                    <span class="title___Xo6Pm">
                        <span class="name___XmQWk t-overflow">${text}</span>
                    </span>
                </button>
                <div class="info___PXfyx">
                    <div class="additionalInfo___kgdHQ">
                        <div class="price___nNUAv" style="width: 200px; justify-content: start; gap: 8px;"><span>Market difference:</span>
                            <span>${e.price - e.market_value}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
        }
        warningDiv.appendChild(itemDiv)
        warningDiv.appendChild(confirmButton);
        warningDiv.appendChild(cancelButton);

        cancelButton.addEventListener("click", () => {
            warningDiv.remove();
        });
        confirmButton.addEventListener("click", () => {
            warningDiv.remove();
            let confirm = document.getElementById('ups-confirm');
            confirm.click();
        });
        body.appendChild(warningDiv);
    }

    function createDuplicateButton() {
        waitForElm('.controls___N9naF').then((elm) => {
            if (elm.firstElementChild) {
                elm.firstElementChild.id = 'ups-confirm';
                elm.firstElementChild.style.display = 'none';
            }

            let button = document.createElement("button");
            let span = document.createElement("span");

            button.classList.add("torn-btn");
            span.textContent = "Save Changes";

            button.appendChild(span);

            button.addEventListener("click", () => {
                let itemRows = document.getElementsByClassName('itemRow___Mf7bO');
                let lowPrices = [];
                for (let itemRow of itemRows) {
                    let inputMoney = itemRow.querySelector(".priceInputWrapper___TBFHl").querySelector('.input-money');
                    let marketValue = itemRow.querySelector(".price___nNUAv").firstChild;
                    marketValue = marketValue.innerText.replace(/[^0-9]/g, '');
                    let price = parseInt(inputMoney.value.replace(/,/g, ''), 10);

                    if (price < marketValue *0.8) {
                        lowPrices.push({row: itemRow, price: price, market_value: marketValue});
                    }
                }
                if (lowPrices.length !== 0) {
                    createWarning(lowPrices);
                } else {
                    let confirm = document.getElementById('ups-confirm');
                    confirm.click();
                }
            })

            if (elm.children.length > 1) {
                elm.insertBefore(button, elm.children[1]);
            } else {
                elm.appendChild(button);
            }
        });
    }

    function modifyPrice(up) {
        let itemRows = document.getElementsByClassName('itemRow___Mf7bO');
        for (let itemRow of itemRows) {
            let inputMoney = itemRow.querySelector(".priceInputWrapper___TBFHl").querySelector('.input-money');
            let price = parseInt(inputMoney.value.replace(/,/g, ''), 10);

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
        let existingDiv = document.getElementById('upsItemSelector');
        if (existingDiv) existingDiv.remove();
        let div = document.createElement('div');

        let btn1 = createButton("Add 0", function () {
            modifyPrice(true);
        });
        let btn2 = createButton("Remove 0", function () {
            modifyPrice(false);
        });

        div.id = 'upsItemSelector';
        div.appendChild(btn1);
        div.appendChild(btn2);
        waitForElm(".selectAll___hgs59").then((elm) => {
            elm.insertBefore(div, elm.firstChild);
        });
    }

    if (location.href.includes("viewListing")) {
        swtichButtonPlace();
        createDuplicateButton();
        openMarketOption();
    } else {
        window.addEventListener('popstate', function (event) {
            if (location.href.includes("viewListing")) {
                swtichButtonPlace();
                createDuplicateButton();
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
    #upsItemSelector {
        width: 137px;
        justify-content: space-around;
        align-items: center;
        display: flex;
        font-weight: bold;
    }

    #upsItemSelector p {
        padding: 5px;
        color: #999;
        border: 1px solid #999;
        cursor: pointer;
    }

    #upsItemSelector p:hover {
        color: #ccc;
        border-color: #ccc;
    }

    .selectAll___hgs59 {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 20px;
    }

    .warning-barrier {
        position: fixed;
        height: 100vh;
        width: 100vw;
        background: #1A1A1A;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1000000;
        top: 0;
    }

    .warning-barrier>div {
        display: flex;
        flex-wrap: no-wrap;
        gap: 8px;
        width: 80%;
        flex-direction: column;
        overflow-y: scroll;
        height: 60%;
    }

    .warning-barrier>div>div.itemRowWrapper___cFs4O {
        min-height: 32px;
    }

    .warning-barrier h1 {
        font-size: 68px !important;
        margin-bottom: 16px !important;
        margin-top: 32px !important;
    }

    .warning-barrier h3 {
        font-size: 24px !important;
        margin-bottom: 24px !important;
    }

    .warning-barrier p {
        font-size: 18px !important;
        margin-bottom: 16px !important;
        width: initial;
    }

    .warning-barrier .ups-warning-confirm {
        position: absolute;
        bottom: 8%;
         left: 55%;
        transform: translate(-50%, -50%);
    }

    .warning-barrier .ups-warning-cancel {
        position: absolute;
        bottom: 8%;
         left: 45%;
        transform: translate(-50%, -50%);
    }
    `);
})();