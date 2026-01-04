// ==UserScript==
// @name         Скачать объединённый JSON схемы
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Добавляет кнопку для скачивания объединённого JSON файла схемы
// @author       description009
// @match        https://mcpehub.org/plan.php?id=*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521817/%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B4%D0%B8%D0%BD%D1%91%D0%BD%D0%BD%D1%8B%D0%B9%20JSON%20%D1%81%D1%85%D0%B5%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521817/%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B4%D0%B8%D0%BD%D1%91%D0%BD%D0%BD%D1%8B%D0%B9%20JSON%20%D1%81%D1%85%D0%B5%D0%BC%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаём кнопку
    const button = document.createElement('button');
    button.innerText = 'Скачать объединённый JSON';
    Object.assign(button.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '1000',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });

    console.log('Кнопка для скачивания создана и добавлена на страницу.');

    // Функция для загрузки и объединения JSON
    async function fetchAndCombineJSON(urls) {
        console.log('Начинается процесс загрузки и объединения JSON файлов:', urls);
        const combinedData = [];

        for (const url of urls) {
            try {
                console.log(`Запрос к URL: ${url}`);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.url}`);

                const data = await response.json();
                console.log(`Данные успешно получены с URL: ${url}`, data);
                combinedData.push(data);
            } catch (error) {
                console.warn(`Ошибка при обработке URL ${url}:`, error);
            }
        }

        console.log('Объединённые данные:', combinedData);
        return combinedData;
    }

    // Функция для скачивания файла
    function downloadJSON(data, filename) {
        console.log('Создание файла для скачивания:', filename);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Файл успешно скачан:', filename);
    }

    // Обработчик события для кнопки
    button.addEventListener('click', async () => {
        console.log('Кнопка нажата, начало обработки.');

        // Получение id постройки из атрибута data-build-id
        const planBody = document.querySelector('.plan-body');
        const buildingId = planBody ? planBody.getAttribute('data-build-id') : null;

        if (!buildingId) {
            alert('ID постройки не найден.');
            console.error('Ошибка: ID постройки отсутствует в атрибуте data-build-id.');
            return;
        }

        console.log('ID постройки найден:', buildingId);

        // Генерация ссылок для JSON файлов слоев
        const layerUrls = Array.from({ length: 7 }, (_, i) => `https://mcpehub.org/uploads/buildings/${buildingId}/${i + 1}.json`);

        try {
            const combinedData = await fetchAndCombineJSON(layerUrls);
            if (combinedData.length === 0) {
                alert('Не удалось загрузить данные.');
                console.error('Ошибка: массив объединённых данных пуст.');
                return;
            }
            downloadJSON(combinedData, `building_${buildingId}_combined.json`);
        } catch (error) {
            console.error('Ошибка при скачивании:', error);
        }
    });

    // Добавляем кнопку на страницу
    document.body.appendChild(button);
    console.log('Кнопка добавлена на страницу и готова к использованию.');
})();
