// ==UserScript==
// @name         Инструменты
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Добавляет кнопки для быстрого переключения инструментов и питомцев в игре Астерия
// @author       Ваше имя
// @match        https://asteriagame.com/main_frame.php
// @icon         https://asteriagame.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546422/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546422/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для кнопок и контейнера
    const style = document.createElement('style');
    style.textContent = `
        #tools-container {
            position: fixed;
            top: 1px;
            left: 310px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .tool-btn {
            padding: 1px 1px;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            color: white;
            background-color: #ff4444;
            transition: background-color 0.3s;
        }
        .tool-btn:hover {
            opacity: 0.9;
        }
        .tool-btn.active {
            background-color: #44ff44;
        }
    `;
    document.head.appendChild(style);

    // Создаем контейнер для кнопок
    const container = document.createElement('div');
    container.id = 'tools-container';
    document.body.appendChild(container);

    // Функция для создания кнопки
    function createButton(text, fetchCode, isActive = false) {
        const btn = document.createElement('button');
        btn.className = `tool-btn ${isActive ? 'active' : ''}`;
        btn.textContent = text;
        btn.onclick = function() {
            // Выполняем fetch запрос
            eval(fetchCode);

            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.tool-btn').forEach(b => {
                b.classList.remove('active');
            });

            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
        };
        return btn;
    }

    // Код для fetch запросов
    const sickleFetch = `
        fetch("https://asteriagame.com/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=70495654&in[slot_num]=8&in[variant_effect]=0&ajax=1&out_ajax=1&update_swf=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\\"Not)A;Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"138\\", \\"Google Chrome\\";v=\\"138\\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\\"Windows\\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://asteriagame.com/user_iframe.php?&group=1",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => console.log('Серп: запрос выполнен')).catch(err => console.error('Серп: ошибка', err));
    `;

    const pickaxeFetch = `
        fetch("https://asteriagame.com/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=70494033&in[slot_num]=8&in[variant_effect]=0&ajax=1&out_ajax=1&update_swf=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\\"Not)A;Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"138\\", \\"Google Chrome\\";v=\\"138\\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\\"Windows\\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://asteriagame.com/user_iframe.php?&group=1",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => console.log('Кирка: запрос выполнен')).catch(err => console.error('Кирка: ошибка', err));
    `;

    const fishingRodFetch = `
        fetch("https://asteriagame.com/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=70495655&in[slot_num]=8&in[variant_effect]=0&ajax=1&out_ajax=1&update_swf=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\\"Not)A;Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"138\\", \\"Google Chrome\\";v=\\"138\\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\\"Windows\\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://asteriagame.com/user_iframe.php?&group=1",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => console.log('Удочка: запрос выполнен')).catch(err => console.error('Удочка: ошибка', err));
    `;

    const volynaFetch = `
        fetch("https://asteriagame.com/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=67538874&in[slot_num]=8&in[variant_effect]=0&ajax=1&out_ajax=1&update_swf=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\\"Not)A;Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"138\\", \\"Google Chrome\\";v=\\"138\\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\\"Windows\\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://asteriagame.com/user_iframe.php?&group=1",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => console.log('Волына: запрос выполнен')).catch(err => console.error('Волына: ошибка', err));
    `;

    const bearFetch = `
        fetch("https://asteriagame.com/action_form.php?" + Math.random() + "&no_confirm=1&artifact_id=67208246&in[param_success][opener_success_function]=frames[%27main_frame%27].frames[%27main%27].frames[%27user_iframe%27].updateCurrentIframe();&in[param_success][window_reload]=0&in[param_success][url_close]=user_iframe.php%3Fgroup%3D1%26external%3D1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\\"Not)A;Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"138\\", \\"Google Chrome\\";v=\\"138\\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\\"Windows\\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://asteriagame.com/user_iframe.php?&group=1",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => console.log('Медведь: запрос выполнен')).catch(err => console.error('Медведь: ошибка', err));
    `;

    // Создаем кнопки
    container.appendChild(createButton("Серп", sickleFetch));
    container.appendChild(createButton("Кирка", pickaxeFetch));
    container.appendChild(createButton("Удочка", fishingRodFetch));
    container.appendChild(createButton("Волына", volynaFetch));
    container.appendChild(createButton("Медведь", bearFetch));

    console.log('Скрипт быстрого доступа к инструментам и питомцам загружен!');
})();