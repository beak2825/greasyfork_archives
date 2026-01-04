// ==UserScript==
// @name         Игра "Кнопка бабло"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет кнопку в левый нижний угол сайта lolz.live, магазин с автокликером, улучшениями бабла и покупкой админки, а также сохраняет прогресс.
// @author       Ваше имя
// @match        *://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508980/%D0%98%D0%B3%D1%80%D0%B0%20%22%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B1%D0%B0%D0%B1%D0%BB%D0%BE%22.user.js
// @updateURL https://update.greasyfork.org/scripts/508980/%D0%98%D0%B3%D1%80%D0%B0%20%22%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B1%D0%B0%D0%B1%D0%BB%D0%BE%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переменные для автокликера и улучшений
    let autoClickerActive = false;
    let autoClickerInterval = 10000; // Интервал в миллисекундах (10 секунд)
    let autoClickerIntervalId = null;
    let balance = 0;
    let rewardMultiplier = 1; // Множитель вознаграждения

    // Функция для сохранения данных в localStorage
    function saveProgress() {
        localStorage.setItem('balance', balance);
        localStorage.setItem('autoClickerActive', autoClickerActive);
        localStorage.setItem('rewardMultiplier', rewardMultiplier);
    }

    // Функция для загрузки данных из localStorage
    function loadProgress() {
        balance = parseFloat(localStorage.getItem('balance')) || 0;
        autoClickerActive = localStorage.getItem('autoClickerActive') === 'true';
        rewardMultiplier = parseFloat(localStorage.getItem('rewardMultiplier')) || 1;
    }

    // Загружаем сохраненные данные при загрузке страницы
    loadProgress();

    // Создание кнопки "Бабло"
    const button = document.createElement('button');
    button.innerText = 'Бабло';
    button.style.position = 'fixed';
    button.style.bottom = '50px';
    button.style.left = '10px';
    button.style.backgroundColor = '#00ab78';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // Создание кнопки "Магазин"
    const shopButton = document.createElement('button');
    shopButton.innerText = 'Магазин';
    shopButton.style.position = 'fixed';
    shopButton.style.bottom = '10px';
    shopButton.style.left = '10px';
    shopButton.style.backgroundColor = '#ff5722';
    shopButton.style.color = '#fff';
    shopButton.style.border = 'none';
    shopButton.style.borderRadius = '5px';
    shopButton.style.padding = '10px 20px';
    shopButton.style.cursor = 'pointer';
    shopButton.style.zIndex = '1000';

    // Создание модального окна магазина
    const shopModal = document.createElement('div');
    shopModal.style.display = 'none';
    shopModal.style.position = 'fixed';
    shopModal.style.left = '50%';
    shopModal.style.top = '50%';
    shopModal.style.transform = 'translate(-50%, -50%)';
    shopModal.style.backgroundColor = '#303030';
    shopModal.style.color = '#fff';
    shopModal.style.border = '2px solid #00ab78';
    shopModal.style.borderRadius = '10px';
    shopModal.style.padding = '20px';
    shopModal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    shopModal.style.zIndex = '2000';

    // Контент магазина с разделами
    const shopContent = document.createElement('div');
    shopContent.innerHTML = `
        <h2>Магазин</h2>
        <h3>Автокликер</h3>
        <button id="buyAutoClicker" style="background-color: #00ab78; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Купить автокликер за 50,000</button>
        <button id="buyAutoClickerUpgrade1" style="background-color: #00ab78; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Улучшение автокликера (100,000)</button>

        <h3>Улучшения бабла</h3>
        <button id="buyRewardUpgrade1" style="background-color: #00ab78; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Улучшение бабло (20,000)</button>
        <button id="buyRewardUpgrade2" style="background-color: #00ab78; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Улучшение бабло (30,000)</button>

        <h3>Админка</h3>
        <button id="buyAdmin" style="background-color: #f13838; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Купить админку за 1,000,000</button>

        <button id="closeShop" style="background-color: #ff5722; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; margin: 5px; cursor: pointer;">Закрыть</button>
        <div id="errorMessage" style="color: red; display: none; margin-top: 10px;">Недостаточно денег!</div>
    `;
    shopModal.appendChild(shopContent);
    document.body.appendChild(shopModal);

    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes balanceIncrease {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
        }
        .balance-animation {
            display: inline-block;
            animation: balanceIncrease 0.5s ease forwards;
            color: #00ab78;
        }
    `;
    document.head.appendChild(style);

    // Функция для преобразования строки в числовое значение
    function parseBalance(text) {
        let number = parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'));
        if (text.includes('K')) {
            number *= 1000;
        } else if (text.includes('M')) {
            number *= 1000000;
        }
        return number;
    }

    // Функция для преобразования числового значения обратно в форматированный текст
    function formatBalance(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number.toFixed(2);
        }
    }

    // Функция для увеличения баланса
    function increaseBalance() {
        const balanceSpan = document.querySelector('span.balanceValue');
        if (balanceSpan) {
            balance += 100 * rewardMultiplier; // Увеличиваем с учетом множителя
            balanceSpan.innerHTML = `<span class="balance-animation">${formatBalance(balance)}</span>`;
            setTimeout(() => {
                balanceSpan.innerText = formatBalance(balance);
                saveProgress(); // Сохраняем прогресс после изменения
            }, 500);
        }
    }

    // Функция для активации автокликера
    function startAutoClicker() {
        if (autoClickerActive && autoClickerIntervalId === null) {
            autoClickerIntervalId = setInterval(() => {
                increaseBalance();
            }, autoClickerInterval);
        }
    }

    // Функция для отображения сообщения об ошибке
    function showErrorMessage() {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 2000);
        }
    }

    // Функция для изменения профиля и выдачи админки
    function grantAdminPrivileges() {
        const profileLink = document.querySelector('a[href*="/members/"]');
        if (profileLink) {
            const profilePageUrl = profileLink.href;
            window.location.href = profilePageUrl;
        } else {
            const usernameInput = document.querySelector('#ctrl_short_link');
            if (usernameInput) {
                const avatarContainer = document.querySelector('.avatarScaler');
                if (avatarContainer) {
                    const newBanner = document.createElement('em');
                    newBanner.className = 'userBanner admin wrapped';
                    newBanner.innerHTML = `<span class="before"></span><strong>Администратор</strong><span class="after"></span>`;
                    avatarContainer.appendChild(newBanner);

                    const usernameElement = document.querySelector('.memberView .username');
                    if (usernameElement) {
                        usernameElement.style.color = '#f13838'; // Изменение цвета ника на красный
                    }
                }
            }
        }
    }

    // Обработчик клика по кнопке админки
    document.getElementById('buyAdmin').addEventListener('click', () => {
        const balanceSpan = document.querySelector('span.balanceValue');
        if (balance >= 1000000) {
            balance -= 1000000;
            balanceSpan.innerText = formatBalance(balance);
            grantAdminPrivileges();
            saveProgress(); // Сохраняем прогресс после покупки
        } else {
            showErrorMessage();
        }
    });

    // Добавление кнопок на страницу
    document.body.appendChild(button);
    document.body.appendChild(shopButton);

    // Обработчик клика по кнопке "Бабло"
    button.addEventListener('click', increaseBalance);

    // Обработчик клика по кнопке "Магазин"
    shopButton.addEventListener('click', () => {
        shopModal.style.display = 'block';
    });

    // Обработчик клика по кнопке закрытия магазина
    document.getElementById('closeShop').addEventListener('click', () => {
        shopModal.style.display = 'none';
    });

    // Запуск автокликера, если он был активен
    if (autoClickerActive) {
        startAutoClicker();
    }
})();
