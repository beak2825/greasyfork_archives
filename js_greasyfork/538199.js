// ==UserScript==
// @name         NIX Volume Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматический расчет объема товара на сайте NIX
// @author       Millium
// @match        https://www.nix.ru/*
// @match        https://*.nix.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538199/NIX%20Volume%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/538199/NIX%20Volume%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для парсинга размеров и расчета объема
    function parseAndCalculateVolume(text) {
        // Регулярные выражения для различных форматов размеров
        const patterns = [
            // Формат: "13.84 x 10.67 x 1.61 см"
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*см/i,
            // Формат: "13.84 x 10.67 x 1.61 сантиметр"
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*сантиметр/i,
            // Формат: "0.1384 x 0.1067 x 0.0161 м"
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*м(?:\s|$)/i,
            // Формат: "0.1384 x 0.1067 x 0.0161 метр"
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*метр/i,
            // Формат без единиц измерения (предполагаем см)
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)(?:\s*$)/i
        ];

        for (let i = 0; i < patterns.length; i++) {
            const match = text.match(patterns[i]);
            if (match) {
                let length = parseFloat(match[1]);
                let width = parseFloat(match[2]);
                let height = parseFloat(match[3]);

                // Проверяем единицы измерения
                const unit = text.toLowerCase();

                // Если размеры в метрах, конвертируем в сантиметры
                if (unit.includes(' м') || unit.includes('метр')) {
                    length *= 100;
                    width *= 100;
                    height *= 100;
                }

                // Рассчитываем объем в кубических сантиметрах
                const volume = length * width * height;

                return {
                    volume: volume,
                    formatted: volume.toFixed(2)
                };
            }
        }

        return null;
    }

    // Функция для добавления объема к тексту
    function addVolumeToElement(element) {
        const text = element.textContent || element.innerText;
        const volumeData = parseAndCalculateVolume(text);

        if (volumeData && !text.includes('см³')) {
            element.innerHTML = element.innerHTML + ` <span style="color: #007acc; font-weight: bold;">(${volumeData.formatted} см³)</span>`;
        }
    }

    // Функция для поиска и обработки элементов с размерами
    function processElements() {
        // Ищем элементы, которые могут содержать размеры упаковки
        const selectors = [
            // Специфичные для NIX
            'td[id*="tdsa1671"]', // Размеры упаковки (измерено в НИКСе)
            'td[id*="tdsa1539"]', // Размеры (ширина x высота x глубина)
            // Общие селекторы
            'td:contains("размер")',
            'div:contains("размер")',
            'span:contains("размер")',
            '.specification td',
            '#PriceTable td'
        ];

        // Обрабатываем каждый селектор
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = element.textContent || element.innerText;
                    if (text && /\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?/.test(text)) {
                        addVolumeToElement(element);
                    }
                });
            } catch (e) {
                // Игнорируем ошибки для несуществующих селекторов
            }
        });

        // Дополнительный поиск по содержимому текста
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const text = node.textContent;
                    if (text && /\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?/.test(text)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        let textNode;
        while (textNode = walker.nextNode()) {
            const parent = textNode.parentElement;
            if (parent && !parent.innerHTML.includes('см³')) {
                addVolumeToElement(parent);
            }
        }
    }

    // Запускаем обработку после загрузки страницы
    function init() {
        // Обрабатываем элементы сразу
        processElements();

        // Обрабатываем элементы через некоторое время (для динамически загружаемого контента)
        setTimeout(processElements, 1000);
        setTimeout(processElements, 3000);

        // Наблюдаем за изменениями в DOM
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });

            if (shouldProcess) {
                setTimeout(processElements, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Запускаем после полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();