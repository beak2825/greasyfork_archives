// ==UserScript==
// @name         Torn Stock Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a toggle switch to the Torn stocks page, with persistent state
// @author       13lackfir3
// @match        https://www.torn.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533594/Torn%20Stock%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/533594/Torn%20Stock%20Toggle.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    const CONFIG = {
        storagePrefix: 'tornStockToggle',
        selectors: {
            header: '.title-black',
            dividendColumn: '#dividend',
            rowContainer: '.stockMarket___iB18v',
            stockRow: '.stock___ElSDB',
            dividendCell: '.stockDividend___U_p9H',
            profitCell: '.profit___rREhv'
        }
    };

    const storage = {
        get: (key, defaultValue = null) => {
            const v = localStorage.getItem(`${CONFIG.storagePrefix}.${key}`);
            return v === null ? defaultValue : JSON.parse(v);
        },
        set: (key, value) => {
            localStorage.setItem(`${CONFIG.storagePrefix}.${key}`, JSON.stringify(value));
        }
    };

    function waitFor(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                if ((elapsed += interval) >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for selector: ${selector}`));
                }
            }, interval);
        });
    }

    function addStyles() {
        const css = `
            .toggle-switch {
                appearance: none;
                width: 50px;
                height: 25px;
                border-radius: 50px;
                border: 2px solid #333;
                background-color: #4e4e4e;
                position: relative;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .toggle-switch:before {
                content: '';
                position: absolute;
                width: 19px;
                height: 19px;
                border-radius: 50%;
                background: #fff;
                top: 3px;
                left: 3px;
                transition: left 0.3s;
            }
            .toggle-switch:checked {
                background-color: #28a745;
            }
            .toggle-switch:checked:before {
                left: 28px;
            }
            .stock-row--disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function injectHeader() {
        const header = document.querySelector(CONFIG.selectors.header);
        const dividend = header.querySelector(CONFIG.selectors.dividendColumn);
        const titleItem = document.createElement('li');
        titleItem.textContent = 'Profit/Loss';
        titleItem.style.textAlign = 'center';
        titleItem.style.padding = '0 10px';
        header.insertBefore(titleItem, dividend.nextSibling);
    }

    function injectRows() {
        const rows = document
            .querySelector(CONFIG.selectors.rowContainer)
            .querySelectorAll(CONFIG.selectors.stockRow);

        rows.forEach((row, idx) => {
            row.dataset.index = idx;
            const dividendCell = row.querySelector(CONFIG.selectors.dividendCell);
            if (!dividendCell) return;

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.className = 'toggle-switch';
            toggle.checked = storage.get(`row.${idx}.disabled`, false);
            toggle.addEventListener('change', () => {
                setRowState(row, toggle.checked);
                storage.set(`row.${idx}.disabled`, toggle.checked);
            });

            const cell = document.createElement('li');
            cell.style.textAlign = 'center';
            cell.style.padding = '15px 10px';
            cell.appendChild(toggle);
            dividendCell.parentNode.insertBefore(cell, dividendCell.nextSibling);

            const profitEl = row.querySelector(CONFIG.selectors.profitCell);
            if (profitEl) {
                const copy = document.createElement('li');
                copy.textContent = profitEl.textContent;
                copy.style.textAlign = 'center';
                copy.style.padding = '15px 10px';
                cell.insertBefore(copy, toggle);
            }

            setRowState(row, toggle.checked);
        });
    }

    function setRowState(row, disabled) {
        row.classList.toggle('stock-row--disabled', disabled);
    }

    async function init() {
        try {
            addStyles();
            await waitFor(CONFIG.selectors.header);
            injectHeader();
            await waitFor(CONFIG.selectors.stockRow);
            injectRows();
        } catch (err) {
            console.error('Torn Stock Toggle failed:', err);
        }
    }

    init();
})();
