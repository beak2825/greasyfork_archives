// ==UserScript==
// @name         Open Thread in Modal on Right Click
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Open thread in a modal on right-click and close modal on outside click
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506830/Open%20Thread%20in%20Modal%20on%20Right%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/506830/Open%20Thread%20in%20Modal%20on%20Right%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем HTML для модального окна
    const modalHTML = `
        <div id="customModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
            overflow: auto;
            color: #fff;
            padding: 20px;
            box-sizing: border-box;
        ">
            <div id="modalContent" style="
                background: #333;
                padding: 20px;
                margin: 50px auto;
                max-width: 800px;
                position: relative;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            ">
                <span id="modalClose" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #fff;
                ">&times;</span>
                <iframe id="modalIframe" style="
                    width: 100%;
                    height: 80vh;
                    border: none;
                "></iframe>
            </div>
        </div>
    `;

    // Добавляем модальное окно в тело документа
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    const modalIframe = document.getElementById('modalIframe');
    const modalClose = document.getElementById('modalClose');

    // Функция для открытия модального окна
    function openModal(threadUrl) {
        modalIframe.src = threadUrl;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Отключаем прокрутку основной страницы
    }

    // Функция для закрытия модального окна
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Восстанавливаем прокрутку основной страницы
        modalIframe.src = ''; // Очищаем iframe при закрытии
    }

    // Добавляем обработчик закрытия модального окна
    modalClose.addEventListener('click', closeModal);

    // Функция для обработки кликов правой кнопкой мыши
    function handleRightClick(event) {
        event.preventDefault(); // Отменяем стандартное контекстное меню

        // Находим URL темы, на которую кликнули
        const threadLink = event.currentTarget.querySelector('a.listBlock.main, a.main');
        if (threadLink) {
            const threadUrl = threadLink.href;
            openModal(threadUrl); // Открываем модальное окно с темой
        }
    }

    // Добавляем обработчик клика вне модального окна
    modal.addEventListener('click', function(event) {
        if (!modalContent.contains(event.target)) {
            closeModal();
        }
    });

    // Функция для добавления обработчиков ко всем подходящим элементам
    function addContextMenuHandlers() {
        const items = document.querySelectorAll('.discussionListItem, .discussionList .main, .listBlock.main');
        items.forEach(item => {
            item.addEventListener('contextmenu', handleRightClick);
        });
    }

    // Инициализация наблюдателя за изменениями DOM
    const observer = new MutationObserver(() => {
        addContextMenuHandlers();
    });

    // Настройка и запуск наблюдателя за всем документом
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Добавляем обработчики для уже существующих элементов при загрузке страницы
    window.addEventListener('load', addContextMenuHandlers);
})();
