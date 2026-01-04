// ==UserScript==
// @name         Citilink Package Volume Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет расчет объема упаковки в характеристиках товара на Citilink
// @author       Millium
// @match        https://www.citilink.ru/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538198/Citilink%20Package%20Volume%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/538198/Citilink%20Package%20Volume%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для поиска и обработки габаритов упаковки
    function addVolumeCalculation() {
        // Ищем все элементы с характеристиками
        const propertyItems = document.querySelectorAll('.app-catalog-10feyk0-Flex--StyledFlex-PropertiesItem');

        propertyItems.forEach(item => {
            // Ищем название характеристики
            const nameElement = item.querySelector('span[class*="PropertiesItemTitle"]');
            if (!nameElement) return;

            const propertyName = nameElement.textContent.trim();

            // Проверяем, что это габариты упаковки
            if (propertyName.includes('Габариты упаковки') && propertyName.includes('ДхШхВ')) {
                // Ищем значение
                const valueElement = item.querySelector('span[class*="PropertiesValue"] span');
                if (!valueElement) return;

                const dimensionsText = valueElement.textContent.trim();

                // Проверяем, что еще не добавили объем
                if (dimensionsText.includes('(объем:')) return;

                // Парсим габариты (например: "0.137x0.107x0.017 м")
                const match = dimensionsText.match(/(\d+\.?\d*)x(\d+\.?\d*)x(\d+\.?\d*)\s*м/);
                if (match) {
                    const length = parseFloat(match[1]);
                    const width = parseFloat(match[2]);
                    const height = parseFloat(match[3]);

                    // Переводим в сантиметры (1 м = 100 см)
                    const lengthCm = length * 100;
                    const widthCm = width * 100;
                    const heightCm = height * 100;

                    // Вычисляем объем в кубических сантиметрах
                    const volumeCm3 = lengthCm * widthCm * heightCm;

                    // Форматируем результат
                    let volumeText;
                    if (volumeCm3 < 1000) {
                        volumeText = `${volumeCm3.toFixed(0)} см³`;
                    } else if (volumeCm3 < 1000000) {
                        volumeText = `${(volumeCm3 / 1000).toFixed(1)} дм³`;
                    } else {
                        volumeText = `${(volumeCm3 / 1000000).toFixed(3)} м³`;
                    }

                    // Добавляем объем к тексту
                    valueElement.textContent = `${dimensionsText} (объем: ${volumeText})`;
                }
            }
        });
    }

    // Функция для запуска с задержкой и повторными попытками
    function initWithRetry(attempts = 0) {
        const maxAttempts = 10;
        const delay = 500; // 500ms между попытками

        if (attempts >= maxAttempts) {
            console.log('Citilink Volume Calculator: Превышено максимальное количество попыток');
            return;
        }

        // Проверяем, загружены ли характеристики
        const propertyItems = document.querySelectorAll('.app-catalog-10feyk0-Flex--StyledFlex-PropertiesItem');

        if (propertyItems.length > 0) {
            addVolumeCalculation();
        } else {
            // Если элементы еще не загружены, повторяем попытку
            setTimeout(() => initWithRetry(attempts + 1), delay);
        }
    }

    // Запускаем сразу после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initWithRetry(), 1000);
        });
    } else {
        setTimeout(() => initWithRetry(), 1000);
    }

    // Также отслеживаем изменения в DOM для SPA
    const observer = new MutationObserver(() => {
        addVolumeCalculation();
    });

    // Начинаем наблюдение за изменениями
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();