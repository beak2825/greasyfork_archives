// ==UserScript==
// @name         Steam KZT → RUB Converter
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Автоматическое обновление цен на рубли в стиме
// @author       StupidGPT
// @match        *://store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525787/Steam%20KZT%20%E2%86%92%20RUB%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/525787/Steam%20KZT%20%E2%86%92%20RUB%20Converter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const CBR_API_URL = "https://www.cbr.ru/scripts/XML_daily.asp";

    function fetchExchangeRate(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: CBR_API_URL,
            onload: function(response) {
                try {
                    let parser = new DOMParser();
                    let xml = parser.parseFromString(response.responseText, "text/xml");
                    let valutes = xml.getElementsByTagName("Valute");

                    for (let valute of valutes) {
                        let charCode = valute.getElementsByTagName("CharCode")[0].textContent;
                        if (charCode === "KZT") {
                            let nominal = parseFloat(valute.getElementsByTagName("Nominal")[0].textContent);
                            let value = parseFloat(valute.getElementsByTagName("Value")[0].textContent.replace(",", "."));
                            let rate = value / nominal;
                            callback(rate);
                            return;
                        }
                    }
                    console.error("❌ Курс KZT не найден!");
                } catch (error) {
                    console.error("❌ Ошибка обработки данных о курсе валют!", error);
                }
            },
            onerror: function(error) {
                console.error("❌ Ошибка загрузки курса валют!", error);
            }
        });
    }

    function convertPrices(rate) {
        // Функция для очистки и парсинга цены из строки
        function parsePrice(priceText) {
            return parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));
        }

        // Выбираем все элементы с ценой
        const priceElements = document.querySelectorAll(
            ".game_purchase_price.price, " +
            ".discount_block .discount_final_price, " +
            ".game_area_purchase_game .game_purchase_price.price, " +
            ".game_area_dlc_row .game_area_dlc_price, " +
            ".bundle_base_discount .discount_final_price"
        );

        priceElements.forEach(el => {
            const text = el.textContent.trim();
            const isKZTPrice = text.includes('₸');

            if (isKZTPrice) {
                try {
                    const priceKZT = parsePrice(text);
                    const priceRUB = (priceKZT * rate).toFixed(2);

                    // Если блок содержит класс "your_price", то дописываем сумму в скобках к уже существующему тексту цены
                    if (el.classList.contains('your_price')) {
                        // Предполагаем, что внутри блока есть два элемента:
                        // один с классом your_price_label и другой с самой ценой
                        const priceDiv = el.querySelector('div:not(.your_price_label)');
                        if (priceDiv && !priceDiv.textContent.includes('₽)')) {
                            // Добавляем сконвертированную цену в скобках к существующему содержимому
                            priceDiv.textContent = priceDiv.textContent.trim() + `(${priceRUB} ₽)`;
                        }
                    } else {
                        // Для остальных блоков добавляем новый span, если он ещё не добавлен
                        if (!el.querySelector('.converted-price')) {
                            const convertedSpan = document.createElement('span');
                            convertedSpan.className = 'converted-price';
                            convertedSpan.style.color = '#ffcc00';
                            convertedSpan.style.marginLeft = '5px';
                            convertedSpan.textContent = `(${priceRUB} ₽)`;
                            el.appendChild(convertedSpan);
                        }
                    }
                } catch (error) {
                    console.error("Ошибка конвертации цены:", error);
                }
            }
        });

        // Обрабатываем цены с data-price-final
        document.querySelectorAll("[data-price-final]").forEach(el => {
            try {
                const priceKZT = parseFloat(el.getAttribute("data-price-final")) / 100;
                const priceRUB = (priceKZT * rate).toFixed(2);

                const priceEl = el.querySelector(".game_purchase_price, .discount_final_price");
                if (priceEl && !priceEl.querySelector('.converted-price')) {
                    // Если элемент содержит класс your_price, обновляем содержимое внутреннего div
                    if (priceEl.classList.contains('your_price')) {
                        const priceDiv = priceEl.querySelector('div:not(.your_price_label)');
                        if (priceDiv && !priceDiv.textContent.includes('₽)')) {
                            priceDiv.textContent = priceDiv.textContent.trim() + `(${priceRUB} ₽)`;
                        }
                    } else {
                        const convertedSpan = document.createElement('span');
                        convertedSpan.className = 'converted-price';
                        convertedSpan.style.color = '#ffcc00';
                        convertedSpan.style.marginLeft = '5px';
                        convertedSpan.textContent = `(${priceRUB} ₽)`;
                        priceEl.appendChild(convertedSpan);
                    }
                }
            } catch (error) {
                console.error("Ошибка конвертации цены с data-price-final:", error);
            }
        });
    }

    function observePage(rate) {
        // Первичная конвертация
        convertPrices(rate);

        // Наблюдатель за изменениями в DOM
        const observer = new MutationObserver(() => {
            convertPrices(rate);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Получаем курс и запускаем наблюдение
    fetchExchangeRate(observePage);
})();
