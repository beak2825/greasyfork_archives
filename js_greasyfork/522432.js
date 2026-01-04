// ==UserScript==
// @name         UpsConfirmation
// @namespace    http://tampermonkey.net/
// @version      3.5.0
// @description  Auto confirm on market + hospital
// @author       Upsilon [3212478]
// @match        https://www.torn.com/hospitalview.php
// @match       https://www.torn.com/page.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522432/UpsConfirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/522432/UpsConfirmation.meta.js
// ==/UserScript==

(function () {
    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return getLocalStorage();
        }
        return JSON.parse(upsScripts);
    }

    if (window.location.href.includes("https://www.torn.com/page.php?sid=ItemMarket")) {
        function addGlobalStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
            .ups-buy-button {
                position: absolute;
                right: 1.2%;
                top: 50%;
                transform: translateY(-50%);
                height: 82% !important;
                width: 12%;
                z-index: 100;
            }
        `;
            document.head.appendChild(style);
        }

        function findParentWithClass(element, className) {
            while (element && !element.classList.contains(className)) {
                element = element.parentElement;
            }
            return element;
        }

        function observeRowWrappers() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.matches && node.matches('.rowWrapper___me3Ox')) {
                                addButtonToRow(node);
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('.rowWrapper___me3Ox').forEach(innerNode => {
                                    addButtonToRow(innerNode);
                                });
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {childList: true, subtree: true});
        }

        function addButtonToRow(row) {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('buyButton___Flkhg', 'torn-btn', 'ups-buy-button');
            button.innerHTML = `
        <div class="title___uDZTJ">BUY</div>
        <div class="icon___nqanu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13.5" viewBox="0 0 18 13.5">
                <g>
                    <path d="m7.5,12.38c0,.62-.5,1.12-1.12,1.12s-1.12-.5-1.12-1.12.5-1.12,1.12-1.12,1.12.5,1.12,1.12Zm2.62-1.12c-.62,0-1.12.5-1.12,1.12s.5,1.12,1.12,1.12,1.12-.5,1.12-1.12-.5-1.12-1.12-1.12Zm1-3.75l1.48-5.25H0l2.2,5.25h8.92ZM14.85,0l-2.57,9H2.83l.63,1.5h9.93l2.61-9h1.45l.55-1.5h-3.15Z" fill="currentColor"></path>
                </g>
            </svg>
        </div>
    `;
            row.style.position = 'relative';
            button.addEventListener("click", () => {
                onButtonClick(row, button);
            });
            row.appendChild(button);
        }

        function onButtonClick(row, buyButton) {
            const inputMoney = row.querySelector('.input-money');
            if (inputMoney) {
                const currentValue = inputMoney.value;
                if (!currentValue || currentValue === '0') {
                    const personalMoney = document.getElementById('user-money').getAttribute('data-money');
                    const itemPrice = row.querySelector('.price___Uwiv2').innerText.replace(/[^0-9]/g, '');

                    inputMoney.value = Math.floor(personalMoney / itemPrice);
                    inputMoney.dispatchEvent(new Event('input', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    }));
                } else {
                    const controls = row.querySelector('.buyControls___MxiIN');
                    if (controls) {
                        controls.querySelector('.buyButton___Flkhg').click();
                    }
                }
            } else {
                const confirmWrapper = document.querySelector('.confirmWrapper___T6EcT');
                const yesButton = Array.from(confirmWrapper.querySelectorAll('.confirmButton___WoFpj'))
                    .find(button => button.textContent.trim() === 'Yes');
                if (yesButton) {
                    yesButton.click();
                } else {
                    confirmWrapper.querySelector('.closeButton___kyy2h').click();
                }
            }
        }

            function waitForItemList() {
                const itemList = document.querySelector('.itemList___u4Hg1');
                if (itemList) {
                    observeRowWrappers();
                } else {
                    setTimeout(waitForItemList, 500);
                }
            }

            addGlobalStyles();
            waitForItemList();
            window.addEventListener('popstate', function (event) {
                addGlobalStyles();
                waitForItemList();
            });
        }

        if (window.location.href.includes("hospitalview")) {
            function addGlobalStyles() {
                const style = document.createElement('style');
                style.innerHTML = `
            .ups-fast-revive {
                position: absolute;
                right: 45px;
                top: 16px;
                cursor: pointer;
                transform: translateY(-50%);
                height: 35px;
                color: var(--default-color);
                border-left: 2px solid var(--default-panel-divider-outer-side-color);
                background: none;
                font-size: 12px;
                font-weight: bold;
                padding: 0 10px;
                transition: color 0.3s ease;
                z-index: 10;
            }
            .ups-fast-revive:hover {
                background: linear-gradient(to bottom, #4facfe, #00f2fe);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                color: transparent;
            }
            .fast-revives-threshold {
                cursor: pointer;
            }
            
            .fast-revives-threshold:hover {
                font-weight: bold;
            }

            @media screen and (max-width: 800px) {
                 .reason {
                    width: 200px !important;
                    padding: 260px 6px !important;
                 }
                 .level {
                    width: 50px !important;
                 }
                 .info-wrap {
                    width: auto !important;
                    border-right: 1px solid var(--default-panel-divider-outer-side-color);
                 }
                 .ups-fast-revive {
                    height: initial;
                    padding: initial;
                    width: 42px;
                    top: 60px;
                    right: 0;
                    height: 48px;
                    border-left: 1px solid var(--default-panel-divider-inner-side-color);
                    border-top: 1px solid var(--default-panel-divider-outer-side-color);
                 }
            }
        `;
                document.head.appendChild(style);
            }

            function getHospitalThreshold() {
                let upsScripts = getLocalStorage();
                if (upsScripts["fastRevive"] == null) {
                    upsScripts["fastRevive"] = 0;
                    localStorage.setItem("upscript", JSON.stringify(upsScripts));
                    return getHospitalThreshold();
                }
                return upsScripts["fastRevive"];
            }

            function setHospitalThreshold(threshold) {
                let upsScripts = getLocalStorage();
                upsScripts["fastRevive"] = threshold;
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

            function extractReviveChance(confirmWrapper) {
                const confirmReviveElement = confirmWrapper.querySelector('.confirm-revive');
                const textContent = confirmReviveElement.textContent;
                const match = textContent.match(/(\d+(\.\d+)?)% chance of success/);
                if (!match)
                    return 1000;
                return parseFloat(match[1]);
            }

            function addButtonsToList() {
                const userInfoList = document.querySelector('.user-info-list-wrap');
                if (!userInfoList) return;

                const listItems = userInfoList.querySelectorAll('li');
                listItems.forEach(li => {
                    if (li.querySelector('.ups-fast-revive')) return;

                    const button = document.createElement('button');
                    button.innerHTML = 'Fast';
                    button.classList.add("ups-fast-revive");

                    button.addEventListener('click', () => {
                        const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];
                        let confirmRevive = li.querySelector('div.confirm-revive');
                        if (getStyle(confirmRevive, 'display') === 'none') {
                            const reviveButton = li.querySelector('a.revive');
                            if (reviveButton) {
                                reviveButton.click();
                            }
                        } else {
                            const threshold = getHospitalThreshold();
                            const reviveChance = extractReviveChance(li);
                            const reviveButton = li.querySelector('.action-yes');
                            if (reviveButton && threshold < reviveChance) {
                                reviveButton.click();
                            }
                        }
                    });

                    li.style.position = 'relative';
                    li.appendChild(button);
                });
            }

            function userThresholdInput() {
                waitForElm('.msg-info-wrap').then((msgItemWrap) => {
                    if (msgItemWrap.querySelector('.fast-revives-threshold')) return;

                    const p = document.createElement('p');
                    p.textContent = 'Set FastRevive Threshold';
                    p.classList.add('fast-revives-threshold');

                    p.addEventListener('click', () => {
                        let result;
                        let errorMessage = '';

                        do {
                            const message = errorMessage + '\nWhat is the lowest revive chances FastRevive should accept? (0-100)';
                            result = window.prompt(message, '0');
                            if (result === null) return;
                            result = parseInt(result, 10);

                            if (isNaN(result)) {
                                errorMessage = 'Error: Please enter a valid number.';
                            } else if (result < 0 || result > 100) {
                                errorMessage = 'Error: The value must be between 0 and 100.';
                            } else {
                                errorMessage = '';
                            }
                        } while (errorMessage);

                        setHospitalThreshold(result);
                    });
                    msgItemWrap.appendChild(p);
                    observeToAddThresholdButton(msgItemWrap);
                });
            }

            function observeToAddThresholdButton(msgItemWrap) {
                const observer = new MutationObserver(() => {
                    if (!msgItemWrap.querySelector('.fast-revives-threshold')) {
                        userThresholdInput();
                    }
                });

                observer.observe(msgItemWrap, {childList: true, subtree: true});
            }

            function observeListChanges() {
                const userInfoList = document.querySelector('.user-info-list-wrap');
                if (!userInfoList) return;

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(() => {
                        addButtonsToList();
                    });
                });

                observer.observe(userInfoList, {childList: true, subtree: true});
            }

            addGlobalStyles();
            userThresholdInput();
            addButtonsToList();
            observeListChanges();
        }
    }
)();