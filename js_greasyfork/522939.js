// ==UserScript==
// @name         Конвертер цен Steam (KZT в RUB)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Конвертирует цены из KZT в RUB на страницах Steam используя курс ЦБ РФ
// @author       You
// @match        https://store.steampowered.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      www.cbr.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522939/%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B5%D1%80%20%D1%86%D0%B5%D0%BD%20Steam%20%28KZT%20%D0%B2%20RUB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522939/%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B5%D1%80%20%D1%86%D0%B5%D0%BD%20Steam%20%28KZT%20%D0%B2%20RUB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для получения курса тенге к рублю через API ЦБ РФ
    async function fetchExchangeRate() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.cbr.ru/scripts/XML_daily.asp',
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "text/xml");

                        // Ищем элемент с ID="R01335" (Казахстанский тенге)
                        const kztElement = xmlDoc.querySelector('Valute[ID="R01335"]');
                        if (!kztElement) {
                            throw new Error('Не найден элемент KZT в ответе ЦБ');
                        }

                        // Получаем значение и номинал
                        const nominal = parseFloat(kztElement.querySelector('Nominal').textContent);
                        const value = parseFloat(kztElement.querySelector('Value').textContent.replace(',', '.'));

                        // Рассчитываем курс для 1 тенге
                        const ratePerOne = value / nominal;
                        resolve(ratePerOne);
                    } catch (error) {
                        console.error('Ошибка обработки ответа API ЦБ:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('Ошибка запроса к API ЦБ:', error);
                    reject(error);
                }
            });
        });
    }

    // Функция для преобразования цены из тенге в рубли
    function convertPrice(priceValue, conversionRate) {
        const priceInRub = Math.round(priceValue * conversionRate);
        return priceInRub;
    }

    // Функция для извлечения числового значения из строки цены
    function extractPrice(priceString) {
        return parseFloat(priceString.replace(/[^\d]/g, ''));
    }

    // Основная логика скрипта
    async function main() {
        try {
            const conversionRate = await fetchExchangeRate();

            // Ищем все элементы с ценами
            const priceElements = document.querySelectorAll('.discount_final_price, .game_purchase_price');

            priceElements.forEach(priceElement => {
                // Пропускаем элементы, которые уже обработаны
                if (priceElement.querySelector('.converted-price')) return;

                let priceValue;

                // Пробуем получить цену из атрибута data-price-final
                const dataPriceFinal = priceElement.getAttribute('data-price-final') ||
                                     priceElement.closest('[data-price-final]')?.getAttribute('data-price-final');

                if (dataPriceFinal) {
                    priceValue = parseFloat(dataPriceFinal) / 100;
                } else {
                    // Если атрибута нет, извлекаем цену из текста
                    priceValue = extractPrice(priceElement.textContent) / 100;
                }

                if (isNaN(priceValue)) return;

                const priceInRub = convertPrice(priceValue, conversionRate);

                // Создаем элемент для отображения цены в рублях
                const rubPriceSpan = document.createElement('span');
                rubPriceSpan.className = 'converted-price';
                rubPriceSpan.textContent = ` (${priceInRub}₽)`;
                rubPriceSpan.style.color = 'gray';
                rubPriceSpan.style.marginLeft = '5px';

                priceElement.appendChild(rubPriceSpan);
            });

        } catch (error) {
            console.error('Не удалось получить курс валют:', error);
        }
    }

    // Запускаем скрипт после загрузки страницы
    window.addEventListener('load', main);

    // Добавляем наблюдатель за изменениями DOM для динамически загружаемого контента
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                main();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();