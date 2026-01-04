// ==UserScript==
// @name         P2P LZT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Улучшение вкладки P2P обменов
// @author       seuyh
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/seuyh/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509214/P2P%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/509214/P2P%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filterOptions = [
        "Все",
        "Вывод с маркета",
        "Пополнение маркета",
        "Другие"
    ];

    let exchangeRates = {
        RUB: 1,
        KZT: null,
        UAH: null,
        USD: null
    };
    let ratesLoaded = false;

    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
            const data = await response.json();
            exchangeRates.KZT = data.rates.KZT;
            exchangeRates.UAH = data.rates.UAH;
            exchangeRates.USD = data.rates.USD;
            ratesLoaded = true;
        } catch (error) {
            console.error('Ошибка при получении курсов валют:', error);
            ratesLoaded = false;
        }
    }

    function createControls() {
        const container = document.createElement("div");
        container.classList.add("controls-container");

        GM_addStyle(`
            .controls-container {
                display: flex;
                align-items: center;
                margin: 10px 0;
                gap: 10px;
                flex-wrap: wrap;
            }
            .controls-container label {
                margin: 0;
                white-space: nowrap;
            }
            .controls-container select,
            .controls-container input[type="checkbox"] {
                cursor: pointer;
            }
        `);

        const dropdownLabel = document.createElement("label");
        dropdownLabel.innerText = "Я хочу: ";

        const select = document.createElement("select");
        select.id = "filterDropdown";
        select.classList.add("ctrlDirection", "textCtrl", "ctrlOrder", "extraLarge");

        filterOptions.forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            option.text = optionText;
            select.appendChild(option);
        });

        container.appendChild(dropdownLabel);
        container.appendChild(select);

        const checkboxLabel = document.createElement("label");
        checkboxLabel.innerText = "Выгодные";
        checkboxLabel.classList.add("button", "checkboxLikeButton");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "profitCheckbox";

        checkboxLabel.prepend(checkbox);
        container.appendChild(checkboxLabel);

        const ratesLabel = document.createElement("div");
        ratesLabel.id = "exchangeRates";
        container.appendChild(ratesLabel);

        return container;
    }

    function updateExchangeRatesDisplay() {
        const ratesLabel = document.getElementById("exchangeRates");
        if (ratesLoaded) {
            ratesLabel.innerText = `Курсы к RUB: (KZT = ${exchangeRates.KZT.toFixed(4)}) (UAH = ${exchangeRates.UAH.toFixed(4)}) (USD = ${exchangeRates.USD.toFixed(4)})`;
        } else {
            ratesLabel.innerText = 'Курсы не получены, расчет выгодности обмена между курсами, не работает';
        }
    }

    function scrollToBottom(amount) {
        const currentScrollY = window.scrollY || window.pageYOffset;

        window.scrollTo({
            top: currentScrollY + amount,
            behavior: 'smooth'
        });
    }

    function filterOffers() {
        const selectedFilter = document.getElementById("filterDropdown")?.value || "Все";
        const isProfitChecked = document.getElementById("profitCheckbox")?.checked || false;
        const offers = document.querySelectorAll('.spanTitle, .spanTitle.unread');
        let visibleOffersCount = 0;

        offers.forEach((offer) => {
            const parentElement = offer.closest('.discussionListItem');
            const text = offer.innerText.trim();
            const regex = /Отдает:\s([\d\s.,-]+)(\w+)\s\|\s(.+?)\s->\sХочет\sполучить:\s([\d\s.,-]+)(\w+)\s\|\s(.+)/;
            const matches = text.match(regex);

            if (matches) {
                const fromAmount = parseFloat(matches[1].replace(',', ''));
                const fromCurrency = matches[2].toUpperCase();
                const toAmount = parseFloat(matches[4].replace(',', ''));
                const toCurrency = matches[5].toUpperCase();
                const fromDirection = matches[3];
                const toDirection = matches[6];
                let shouldShow = true;

                if (selectedFilter === "Вывод с маркета" && toDirection.toLowerCase() !== "маркет") {
                    shouldShow = false;
                } else if (selectedFilter === "Пополнение маркета" && fromDirection.toLowerCase() !== "маркет") {
                    shouldShow = false;
                } else if (selectedFilter === "Другие" && (toDirection.toLowerCase() === "маркет" || fromDirection.toLowerCase() === "маркет")) {
                    shouldShow = false;
                }

                if (isProfitChecked) {
                    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
                        const fromAmountInRUB = fromAmount / exchangeRates[fromCurrency];
                        const toAmountInRUB = toAmount / exchangeRates[toCurrency];
                        if (fromAmountInRUB <= toAmountInRUB) {
                            shouldShow = false;
                        }
                    } else {
                        shouldShow = false;
                    }
                }

                if (parentElement) {
                    parentElement.style.display = shouldShow ? "" : "none";
                    if (shouldShow) visibleOffersCount++;
                }
            }
        });

        if (visibleOffersCount < 7 && window.location.href.includes('/forums/1001/')) {
            scrollToBottom(2);
            visibleOffersCount = 7
        }
    }

    function addControls() {
        const threadListContainer = document.querySelector('.aboveThreadList.aboveThread-main');
        if (threadListContainer && !document.getElementById("filterDropdown")) {
            const controls = createControls();
            threadListContainer.appendChild(controls);

            document.getElementById("filterDropdown").addEventListener("change", filterOffers);
            document.getElementById("profitCheckbox").addEventListener("change", filterOffers);
        }

        updateExchangeRatesDisplay();
    }

    function parseAndReplaceOffers() {
        const offers = document.querySelectorAll('.spanTitle, .spanTitle.unread');

        offers.forEach((offer) => {
            const text = offer.innerText.trim();
            const regex = /\[([\d\s.,-]+)\s(\w+)\s>\s([\d\s.,-]+)\s(\w+)]\s+(.+?)\s>\s(.+)/;
            const matches = text.match(regex);

            if (matches) {
                const fromAmount = matches[1];
                const fromCurrency = matches[2];
                const toAmount = matches[3];
                const toCurrency = matches[4];
                const fromDirection = matches[5];
                const toDirection = matches[6];

                const newText = `Отдает: ${fromAmount}${fromCurrency} | ${fromDirection} -> Хочет получить: ${toAmount}${toCurrency} | ${toDirection}`;
                offer.innerText = newText;
            }
        });

        filterOffers();
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                parseAndReplaceOffers();
            }
        }
    });

    const targetNode = document.querySelector('.latestThreads._insertLoadedContent');
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    var targetUrl = '/forums/1001/';
    var previousUrl = window.location.href;
    var hasExecuted = false;

    function checkAndRun() {
        var currentUrl = window.location.href;

        if (currentUrl !== previousUrl) {
            previousUrl = currentUrl;
            hasExecuted = false;

            if (currentUrl.includes(targetUrl)) {
                fetchExchangeRates().then(() => {
                    parseAndReplaceOffers();
                    addControls();
                    hasExecuted = true;
                    console.log('Инициализация p2p helper')
                });
            }
        } else if (currentUrl.includes(targetUrl) && !hasExecuted) {
            fetchExchangeRates().then(() => {
                parseAndReplaceOffers();
                addControls();
                hasExecuted = true;
                console.log('Инициализация p2p helper')
            });
        }
    }

    checkAndRun();

    setInterval(checkAndRun, 1000);

})();
