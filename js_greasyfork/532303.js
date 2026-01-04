// ==UserScript==
// @name         Lolzteam Auto-hide Menus
// @namespace    Lolzteam Auto-hide Menus
// @version      0.4
// @description  Автоматически скрывает всплывающие меню через 0.2 сек, если убрать курсор с триггера или меню
// @author       Avenick
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @match        *://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532303/Lolzteam%20Auto-hide%20Menus.user.js
// @updateURL https://update.greasyfork.org/scripts/532303/Lolzteam%20Auto-hide%20Menus.meta.js
// ==/UserScript==


// !!! ВНИМАНИЕ: я не сильно шарю за js, так что код писался с помощью chatgpt (или deepseek), вот такой вот я вайбкодер :)
// так что если найдете что улучшить, пофиксить - пишите мне в лс на форум https://lolz.live/trag3dy/


// тут если хотите можете поставить свою задержку закрытия меню (в миллисекундах)
const HIDE_DELAY = 200;

(function() {
    'use strict';

    // Таймер для скрытия меню
    let hideTimer = null;

    // Функция для скрытия всех открытых меню
    function hideAllMenus() {
        document.querySelectorAll('.Menu.MenuOpened').forEach(menu => {
            // Не закрываем меню, если курсор находится внутри него или его дочерних меню
            if (!menu.matches(':hover') && !menu.querySelector('.Menu.MenuOpened:hover')) {
                menu.classList.remove('MenuOpened');
            }
        });

        document.querySelectorAll('.PopupControl.PopupOpen').forEach(control => {
            // Не изменяем состояние контрола, если курсор находится внутри связанного меню
            const menuId = control.querySelector('a[rel="Menu"]')?.getAttribute('href')?.replace('#', '');
            const relatedMenu = menuId ? document.getElementById(menuId) : null;

            if (!relatedMenu?.classList.contains('MenuOpened') ||
                (!relatedMenu.matches(':hover') && !relatedMenu.querySelector('.Menu.MenuOpened:hover'))) {
                control.classList.remove('PopupOpen');
                control.classList.add('PopupClosed');
            }
        });
    }

    // Проверка нахождения элемента внутри открытого меню
    function isInsideAnyMenu(element) {
        return element?.closest('.Menu.MenuOpened') !== null;
    }

    // Проверка нахождения элемента над контролом
    function isOverControl(element) {
        return element?.closest('.PopupControl') !== null;
    }

    // Обработчик для элементов, открывающих меню
    function setupPopupControls() {
        document.querySelectorAll('.PopupControl').forEach(control => {
            // При наведении на элемент - отменяем таймер скрытия
            control.addEventListener('mouseenter', () => {
                if (hideTimer) {
                    clearTimeout(hideTimer);
                    hideTimer = null;
                }
            });

            // При уходе с элемента - запускаем таймер скрытия, только если курсор не перешёл в меню
            control.addEventListener('mouseleave', (e) => {
                if (!isInsideAnyMenu(e.relatedTarget) && !isOverControl(e.relatedTarget)) {
                    if (!hideTimer) {
                        hideTimer = setTimeout(hideAllMenus, HIDE_DELAY);
                    }
                }
            });
        });
    }

    // Обработчик для самих меню
    function setupMenus() {
        document.querySelectorAll('.Menu').forEach(menu => {
            // При наведении на меню - отменяем таймер скрытия
            menu.addEventListener('mouseenter', () => {
                if (hideTimer) {
                    clearTimeout(hideTimer);
                    hideTimer = null;
                }
            });

            // При уходе с меню - запускаем таймер скрытия, только если курсор не перешёл в другое меню или контрол
            menu.addEventListener('mouseleave', (e) => {
                if (!isInsideAnyMenu(e.relatedTarget) && !isOverControl(e.relatedTarget)) {
                    if (!hideTimer) {
                        hideTimer = setTimeout(hideAllMenus, HIDE_DELAY);
                    }
                }
            });
        });
    }

    // Инициализация
    window.addEventListener('load', () => {
        setupPopupControls();
        setupMenus();
    });

    // Обработка динамических элементов
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                setupPopupControls();
                setupMenus();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Консольное сообщение о загрузке
    console.log(`Lolzteam Auto-hide Menus loaded (delay: ${HIDE_DELAY}ms)`);
})();
