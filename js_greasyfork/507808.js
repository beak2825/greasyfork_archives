// ==UserScript==
// @name         ［テスト用］重量と送料設定
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  重量欄と送料設定の初期設定を変え、送料を選択しない場合、本登録不可に変更。送料設定を優先順に並び替え。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/507808/%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD%E9%87%8D%E9%87%8F%E3%81%A8%E9%80%81%E6%96%99%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/507808/%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD%E9%87%8D%E9%87%8F%E3%81%A8%E9%80%81%E6%96%99%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DB_NAME = 'ShippingDB';
    const STORE_NAME = 'ShippingSettings';
    let db;

    function initialize() {
        const shippingSelect = document.getElementById("TbMainproduct送料設定");
        const weightInput = document.getElementById("TbMainproductWeight");
        const saveButton = document.getElementById("saveAndSkuStock");

        if (shippingSelect) {
            customizeDropDown(shippingSelect);
        }

        if (weightInput && saveButton) {
            initializeMainEditPage(shippingSelect, weightInput, saveButton);
        }
    }

    function initializeMainEditPage(shippingSelect, weightInput, saveButton) {
        const productId = window.location.pathname.split('/').pop();

        const emptyOption = document.createElement('option');
        emptyOption.value = "";
        emptyOption.text = "送料を選択";
        shippingSelect.insertBefore(emptyOption, shippingSelect.firstChild);
        shippingSelect.value = "";

        managePlaceholder(weightInput, '重量を入力');

        function updateButtonStyle() {
            if (shippingSelect.value === "") {
                saveButton.disabled = true;
                saveButton.style.cursor = 'not-allowed';
                saveButton.value = "送料を選択してください";
            } else {
                saveButton.disabled = false;
                saveButton.style.cursor = '';
                saveButton.value = "保存してSKU在庫の設定";
            }
        }

        function loadSavedShipping() {
            getShippingSetting(productId).then(savedShipping => {
                if (savedShipping) {
                    shippingSelect.value = savedShipping;
                }

                updateButtonStyle();

                if (shippingSelect.value === "") {
                    setTimeout(loadSavedShipping, 200);
                }
            });
        }

        loadSavedShipping();

        shippingSelect.addEventListener('change', function () {
            updateButtonStyle();
            saveShippingSetting(productId, shippingSelect.value);
        });
    }

    function managePlaceholder(inputElement, placeholder) {
        if (!inputElement) return;

        if (inputElement.value === '0') {
            inputElement.value = '';
            inputElement.placeholder = placeholder;
        }

        inputElement.addEventListener('blur', function () {
            let value = inputElement.value.trim();

            if (value.endsWith('kg')) {
                value = value.slice(0, -2).trim();
                let numberValue = parseFloat(value) * 1000;
                numberValue = Math.ceil(numberValue);
                inputElement.value = numberValue.toString();
            } else if (value.endsWith('g')) {
                value = value.slice(0, -1).trim();
                inputElement.value = value;
            } else {
                const evaluatedValue = evaluateExpression(value);
                if (!isNaN(evaluatedValue)) {
                    inputElement.value = evaluatedValue.toString();
                }
            }
        });
    }

    function evaluateExpression(expr) {
        let result = NaN;

        if (expr.trim() === '') {
            return result;
        }

        expr = expr.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
        expr = expr.replace(/＋/g, '+')
                   .replace(/－/g, '-')
                   .replace(/×/g, '*')
                   .replace(/÷/g, '/')
                   .replace(/．/g, '.');

        if (!/^[\d+\-*/().]+$/.test(expr)) {
            return result;
        }

        try {
            const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => {
                return Math.max(max, num.length - 1);
            }, 0);

            const scalingFactor = Math.pow(10, maxDecimalPlaces);
            const scaledExpr = `(${expr}) * ${scalingFactor}`;
            result = new Function('return ' + scaledExpr)() / scalingFactor;

            result = Math.round(result * 100) / 100;

        } catch (error) {
            console.error('無効な式です:', error);
        }
        return result;
    }

    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = function (event) {
                db = event.target.result;
                db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                resolve(db);
            };

            request.onerror = function (event) {
                reject('Database error: ' + event.target.errorCode);
            };
        });
    }

    function saveShippingSetting(productId, shippingValue) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({ productId: productId, shippingValue: shippingValue });

            request.onsuccess = function () {
                resolve();
            };

            request.onerror = function (event) {
                reject('Save error: ' + event.target.errorCode);
            };
        });
    }

    function getShippingSetting(productId) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(productId);

            request.onsuccess = function (event) {
                resolve(event.target.result ? event.target.result.shippingValue : null);
            };

            request.onerror = function (event) {
                reject('Fetch error: ' + event.target.errorCode);
            };
        });
    }

    function customizeDropDown(shippingSelect) {
        const order = [
            "24", "25", "26", "5", "27", "4", "29", "10",
            "11", "12", "13", "22", "14", "15", "16", "17",
            "18", "19", "20", "21", "23", "8", "28", "9"
        ];
        const unusedOptions = ["23", "8", "28", "9"];
        const tooltips = {
            "24": "12cm×23.5cm以内、厚さ1cm以内\n重さ50g以内",
            "25": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ2cm以内\n重さ1kg以内",
            "26": "34×25cm以内、厚さ3cm以内\n重さ50g以内",
            "5": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ3cm以内\n重さ1kg以内",
            "27": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ50g以内",
            "4": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ100g以内",
            "29": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ150g以内",
            "10": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ250g以内",
            "11": "3辺の合計が60cm以内\n重さ20kg以内",
            "12": "3辺の合計が80cm以内\n重さ20kg以内",
            "13": "3辺の合計が100cm以内\n重さ20kg以内",
            "22": "3辺の合計が120cm以内\n重さ20kg以内",
            "14": "3辺の合計が140cm以内\n重さ20kg以内",
            "15": "3辺の合計が160cm以内\n重さ20kg以内",
            "16": "3辺の合計が170cm以内\n重さ20kg以内",
            "17": "3辺の合計が180cm以内\n重さ20kg以内",
            "18": "3辺の合計が200cm以内\n重さ20kg以内",
            "19": "3辺の合計が220cm以内\n重さ20kg以内",
            "20": "3辺の合計が240cm以内\n重さ20kg以内",
            "21": "3辺の合計が260cm以内\n重さ20kg以内"
        };

        const options = Array.from(shippingSelect.options);
        const orderedOptions = order.map(value => options.find(option => option.value === value)).filter(Boolean);

        shippingSelect.innerHTML = '';
        for (let option of orderedOptions) {
            shippingSelect.add(option);
        }

        for (let option of shippingSelect.options) {
            if (tooltips[option.value]) {
                option.title = tooltips[option.value];
            }

            if (unusedOptions.includes(option.value)) {
                option.style.color = "#8B0000";
                option.title = `${tooltips[option.value] || ""} 現在使われていません`.trim();
            }
        }
    }

    window.addEventListener('load', function () {
        openDatabase().then(() => {
            initialize();
        }).catch(error => {
            console.error(error);
        });
    });
})();
