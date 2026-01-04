// ==UserScript==
// @name         Fake Balance Injector ( Litecoin )
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  best stake script dude
// @author       You
// @match        https://stake.bet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.bet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546630/Fake%20Balance%20Injector%20%28%20Litecoin%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546630/Fake%20Balance%20Injector%20%28%20Litecoin%20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let replacerActive = false;
    let lastUpdateTime = 0;
    const updateInterval = 30;
    const LTC_PRICE = 103.41;  // Current LTC price in USD

    function formatLTCValue(amount) {
        return (amount / LTC_PRICE).toFixed(8) + ' LTC';
    }

    function updateLTCDisplay(amount) {
        const formattedValue = formatLTCValue(amount);
        document.querySelectorAll('[data-testid="conversion-amount"]').forEach(label => {
            if (!label) return;

            const stopInput = label.closest('.wrapper')?.querySelector('[data-test="stop-on-profit-input"], [data-test="stop-on-loss-input"]');
            if (stopInput) {
                const inputValue = parseFloat(stopInput.value);
                if (!isNaN(inputValue) && inputValue > 0) {
                    label.textContent = (inputValue / LTC_PRICE).toFixed(8) + ' LTC';
                }
                return;
            }

            const profitLabel = label.closest('.labels')?.querySelector('.label-content span[slot="label"]');
            if (profitLabel && profitLabel.textContent.includes('Total profit')) {
                const multiplierMatch = profitLabel.textContent.match(/$$([\d.]+)×$$/);
                if (multiplierMatch) {
                    const multiplier = parseFloat(multiplierMatch[1]);
                    label.textContent = (parseFloat(amount) * multiplier).toFixed(8) + ' LTC';
                    return;
                }
            }

            label.textContent = formattedValue;
        });
    }

    function handleAmountChange(input) {
        updateLTCDisplay(parseFloat(input.value) || 0);
    }

    function attachInputListeners() {
        document.querySelectorAll('[data-test="input-game-amount"], [data-testid="send-rain-amount"]').forEach(input => {
            if (!input.hasInputListener) {
                input.hasInputListener = true;
                input.addEventListener('input', () => requestAnimationFrame(() => handleAmountChange(input)));
            }
        });
    }

    function attachDoubleButtonListeners() {
        document.querySelectorAll('[data-testid="amount-double"]').forEach(button => {
            if (!button.hasDoubleListener) {
                button.hasDoubleListener = true;
                button.addEventListener('click', () => {
                    const input = button.closest('div').querySelector('[data-test="input-game-amount"]');
                    if (input) {
                        requestAnimationFrame(() => updateLTCDisplay(parseFloat(input.value) || 0));
                    }
                });
            }
        });
    }

    function replaceCurrency() {
        const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: node => /₫/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
        let node;
        while (node = textWalker.nextNode()) {
            node.nodeValue = node.nodeValue.replace(/₫/g, '$');
        }
    }

    function replaceSvg() {
        const ltcPath = 'M51.52 73.32v6.56h-5.8V73.4c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48V51.64c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84h.04Zm-5.8-30.96V31.04c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36ZM58.6 59.28c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4Z';
        requestAnimationFrame(() => {
            document.querySelectorAll('svg path[fill="#EB0A29"], svg path[fill="#FFC800"]').forEach(path => {
                if (path.getAttribute('fill') === '#EB0A29') {
                    path.setAttribute('fill', '#6CDE07');
                } else if (path.getAttribute('fill') === '#FFC800') {
                    path.setAttribute('fill', '#1B3802');
                    path.setAttribute('d', ltcPath);
                }
            });
        });
    }

    function setupBalanceHover() {
        const processBalanceUpdates = () => {
            requestAnimationFrame(() => {
                const currencySelector = document.querySelector('[data-test="coin-toggle-currency-ltc"]');
                if (currencySelector) {
                    const numericSpan = currencySelector.querySelector('.variant-highlighted.numeric');
                    const subtleSpan = currencySelector.querySelector('.variant-subtle.numeric span');
                    if (numericSpan && subtleSpan) {
                        const dollarValue = parseFloat(subtleSpan.textContent.replace(/[^0-9.]/g, ''));
                        if (!isNaN(dollarValue)) {
                            numericSpan.textContent = (dollarValue / LTC_PRICE).toFixed(8);
                        }
                    }
                }

                document.querySelectorAll('.currencies-item .variant-highlighted.numeric').forEach(element => {
                    const valueContainer = element.closest('.value-ctainer');
                    if (valueContainer) {
                        const dollarSpan = valueContainer.querySelector('.variant-subtle.numeric span');
                        if (dollarSpan) {
                            const dollarValue = parseFloat(dollarSpan.textContent.replace(/[^0-9.]/g, ''));
                            if (!isNaN(dollarValue)) {
                                element.textContent = (dollarValue / LTC_PRICE).toFixed(8);
                            }
                        }
                    }
                });

                const vaultBalance = document.querySelector('[data-test="coin-toggle"] .variant-highlighted.numeric');
                const vaultSubtle = document.querySelector('[data-test="coin-toggle"] .variant-subtle.numeric span');
                if (vaultBalance && vaultSubtle) {
                    const dollarValue = parseFloat(vaultSubtle.textContent.replace(/[^0-9.]/g, ''));
                    if (!isNaN(dollarValue)) {
                        vaultBalance.textContent = (dollarValue / LTC_PRICE).toFixed(8);
                    }
                }
            });
        };

        const observer = new MutationObserver(processBalanceUpdates);
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    function attachStopInputListeners() {
        document.querySelectorAll('[data-test="stop-on-profit-input"], [data-test="stop-on-loss-input"]').forEach(input => {
            if (!input.hasStopListener) {
                input.hasStopListener = true;
                input.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    const conversionElement = e.target.closest('.wrapper')?.querySelector('[data-testid="conversion-amount"]');
                    if (conversionElement) {
                        conversionElement.textContent = (!isNaN(value) && value > 0) ? (value / LTC_PRICE).toFixed(8) + ' LTC' : '0.00000000 LTC';
                    }
                });
            }
        });
    }

    function setupHoverConversion() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList?.contains('tooltip')) {
                        const tooltipContent = node.querySelector('.tooltip-content');
                        if (tooltipContent) {
                            const balanceElement = document.querySelector('[data-test="coin-toggle"] .variant-highlighted span');
                            if (balanceElement) {
                                const balanceValue = parseFloat(balanceElement.textContent.replace(/[^0-9.]/g, ''));
                                if (!isNaN(balanceValue)) {
                                    const convertedValue = formatLTCValue(balanceValue);
                                    const existingFiat = tooltipContent.querySelector('.fiat-wrapper span');
                                    if (existingFiat) {
                                        existingFiat.textContent = convertedValue.split(' ')[0];
                                    }
                                }
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupVaultConversion() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                document.querySelectorAll('.value-ctainer .variant-highlighted.numeric').forEach(element => {
                    const valueContainer = element.closest('.value-ctainer');
                    if (valueContainer) {
                        const dollarSpan = valueContainer.querySelector('.variant-subtle.numeric span');
                        if (dollarSpan) {
                            const dollarValue = parseFloat(dollarSpan.textContent.replace(/[^0-9.]/g, ''));
                            if (!isNaN(dollarValue)) {
                                element.textContent = (dollarValue / LTC_PRICE).toFixed(8);
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    function startReplacer() {
        replacerActive = true;
        requestAnimationFrame(() => {
            attachInputListeners();
            attachDoubleButtonListeners();
            replaceCurrency();
            replaceSvg();
            setupBalanceHover();
            setupHoverConversion();
            setupVaultConversion();
        });

        const observer = new MutationObserver(() => {
            if (!replacerActive) return;
            const now = performance.now();
            if (now - lastUpdateTime < 16) return;
            lastUpdateTime = now;

            requestAnimationFrame(() => {
                replaceCurrency();
                replaceSvg();
                attachInputListeners();
                attachDoubleButtonListeners();
                attachStopInputListeners();
                document.querySelectorAll('[data-test="input-game-amount"], [data-testid="send-rain-amount"]').forEach(input => {
                    const amount = parseFloat(input.value) || 0;
                    if (amount > 0) {
                        updateLTCDisplay(amount);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Start the replacer immediately
    startReplacer();
})();