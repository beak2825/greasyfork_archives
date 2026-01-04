// ==UserScript==
// @name         MZ - Currency Converter
// @namespace    douglaskampl
// @version      1.0
// @description  Converts MZ currencies
// @author       Douglas
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522956/MZ%20-%20Currency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/522956/MZ%20-%20Currency%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle('.mz-cc-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,rgba(0,0,0,0.8) 0%,rgba(83,11,96,0.9) 100%);z-index:999999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;backdrop-filter:blur(5px);transition:all 0.4s cubic-bezier(0.4,0,0.2,1)}.mz-cc-overlay.active{visibility:visible;opacity:1}.mz-cc-modal{background:linear-gradient(135deg,#1a1a1a 0%,#2d1f3d 100%);width:95%;padding:1.5rem;margin:1rem;border-radius:16px;box-shadow:0 8px 32px rgba(83,11,96,0.3);position:relative;transform:translateY(20px);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);border:1px solid rgba(255,255,255,0.1)}.mz-cc-overlay.active .mz-cc-modal{transform:translateY(0)}.mz-cc-close{position:absolute;top:1rem;right:1rem;cursor:pointer;font-size:1.5rem;color:#fff;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.1);transition:all 0.3s ease}.mz-cc-close:hover{background:rgba(255,255,255,0.2);transform:rotate(90deg)}.mz-cc-title{margin:0 0 1rem 0;font-family:"Segoe UI",sans-serif;font-size:1.5rem;font-weight:600;color:#fff;text-align:center;letter-spacing:1px;text-transform:uppercase}.mz-cc-inputs{display:grid;grid-template-columns:repeat(6,1fr);gap:0.5rem}.mz-cc-inputs>div{background:rgba(255,255,255,0.05);padding:0.5rem;border-radius:8px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,0.1);transition:all 0.3s ease}.mz-cc-inputs>div:hover{background:rgba(255,255,255,0.1);transform:translateY(-2px)}.mz-cc-inputs label{color:#fff;font-family:"Segoe UI",sans-serif;font-size:0.9rem;min-width:40px}.mz-cc-inputs input{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:0.4rem;color:#fff;font-family:"IBM Plex Mono",monospace;width:120px;text-align:right;transition:all 0.3s ease;font-feature-settings:"tnum" 1}.mz-cc-inputs input:focus{outline:none;border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.15);box-shadow:0 0 0 3px rgba(255,255,255,0.1)}.mz-cc-inputs input::placeholder{color:rgba(255,255,255,0.3)}.mz-cc-inputs input.highlight{animation:highlight 0.5s ease-out}@keyframes highlight{0%{background-color:rgba(76,175,80,0.3)}100%{background-color:rgba(255,255,255,0.1)}}.currency-icon{color:#4CAF50;cursor:pointer;padding:4px;margin-left:4px;border-radius:50%;background:rgba(255,255,255,0.1);transition:all 0.3s ease}.currency-icon:hover{background:rgba(255,255,255,0.2);transform:scale(1.1)}@media (max-width:1400px){.mz-cc-inputs{grid-template-columns:repeat(4,1fr)}}@media (max-width:1024px){.mz-cc-inputs{grid-template-columns:repeat(3,1fr)}}@media (max-width:768px){.mz-cc-modal{width:98%;padding:1rem}.mz-cc-inputs{grid-template-columns:repeat(2,1fr)}}');

    const CURRENCIES = {
        "R$": 2.62589,    EUR: 9.1775,     USD: 7.4234,     "点": 1,
        SEK: 1,           NOK: 1.07245,    DKK: 1.23522,    GBP: 13.35247,
        CHF: 5.86737,     RUB: 0.26313,    CAD: 5.70899,    AUD: 5.66999,
        MZ: 1,            MM: 1,           PLN: 1.95278,    ILS: 1.6953,
        INR: 0.17,        THB: 0.17079,    ZAR: 1.23733,    SKK: 0.24946,
        BGN: 4.70738,     MXN: 0.68576,    ARS: 2.64445,    BOB: 0.939,
        UYU: 0.256963,    PYG: 0.001309,   ISK: 0.10433,    SIT: 0.03896,
        JPY: 0.06,
    };

    function formatNumber(num, currency) {
        const isWhole = Number.isInteger(num);
        const absNum = Math.abs(num);
        let decimals = 2;
        if (absNum < 0.01) decimals = 6;
        else if (absNum < 1) decimals = 4;
        else if (absNum >= 10000) decimals = isWhole ? 0 : 1;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: false
        }).format(num).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function createModal() {
        const doc = document;
        const overlay = doc.createElement("div");
        overlay.className = "mz-cc-overlay";

        const modal = doc.createElement("div");
        modal.className = "mz-cc-modal";

        const closeBtn = doc.createElement("div");
        closeBtn.className = "mz-cc-close";
        closeBtn.innerHTML = "×";
        closeBtn.onclick = () => overlay.classList.remove("active");

        const title = doc.createElement("h2");
        title.className = "mz-cc-title";
        title.textContent = "Mz Currency Converter";

        const inputsWrap = doc.createElement("div");
        inputsWrap.className = "mz-cc-inputs";

        const handleInput = debounce((ev) => {
            const input = ev.target;
            const val = parseFloat(input.value.replace(/[^\d.-]/g, ''));
            const currency = input.getAttribute("data-currency");
            Object.keys(CURRENCIES).forEach(cc => {
                if (cc !== currency) {
                    const otherInput = doc.querySelector(`input[data-currency='${cc}']`);
                    if (!isNaN(val) && val !== 0) {
                        const from = CURRENCIES[currency];
                        const conv = val * from / CURRENCIES[cc];
                        otherInput.value = formatNumber(conv, cc);
                        otherInput.classList.remove("highlight");
                        void otherInput.offsetWidth;
                        otherInput.classList.add("highlight");
                    } else {
                        otherInput.value = "";
                    }
                }
            });
        }, 100);

        function renderInputs() {
            inputsWrap.innerHTML = "";
            Object.keys(CURRENCIES).forEach(currency => {
                const container = doc.createElement("div");
                const label = doc.createElement("label");
                label.textContent = currency;
                const input = doc.createElement("input");
                input.type = "text";
                input.placeholder = "0.00";
                input.setAttribute("data-currency", currency);
                input.addEventListener("input", handleInput);
                input.addEventListener("focus", function() {
                    this.select();
                });
                container.appendChild(label);
                container.appendChild(input);
                inputsWrap.appendChild(container);
            });
        }

        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(inputsWrap);
        overlay.appendChild(modal);
        doc.body.appendChild(overlay);

        overlay.addEventListener("click", e => {
            if (e.target === overlay) overlay.classList.remove("active");
        });

        renderInputs();

        return overlay;
    }

    function initialize() {
        const overlay = createModal();
        const targetElem = document.querySelector("#pt-wrapper");

        if (targetElem) {
            const icon = document.createElement("i");
            icon.className = "fas fa-dollar-sign currency-icon";
            icon.title = "Currency Converter";
            icon.onclick = () => overlay.classList.add("active");
            targetElem.appendChild(icon);
        }
    }

    initialize();
})();
