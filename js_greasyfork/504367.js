// ==UserScript==
// @name         Background Mini-Profile Viewer (Single-Click)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Убираем все лишние элементы с фона кликом и делаем его в оригинальной окраске
// @author       MSHR
// @license      MSHR
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*     
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504367/Background%20Mini-Profile%20Viewer%20%28Single-Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504367/Background%20Mini-Profile%20Viewer%20%28Single-Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isModified = false; 
    let removedElements = []; 
    let isProcessing = false; 

    // Список классов на которые клик не должен работать
    const excludedSelectors = [
        '.username',
        '.fl_l.avatarBox',
        '.userTitleBlurb'
    ];

    // Функция для сохранения текущих размеров элемента
    function preserveSize(element) {
        const computedStyle = window.getComputedStyle(element);
        element.style.width = computedStyle.width;
        element.style.height = computedStyle.height;
        element.style.transition = 'none'; 
    }

    // Функция для удаления классов и стилей
    function modifyElements(container) {
        if (!isModified || isProcessing) return;

        isProcessing = true;

        container.querySelectorAll('.top.memberCustomBackground').forEach(el => {
            preserveSize(el);
        });

        container.querySelectorAll('.ohidden').forEach(el => {
            removedElements.push({ element: el, parent: el.parentNode, nextSibling: el.nextSibling });
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; 
            el.style.opacity = '0';
            el.style.transform = 'translateX(-10px)'; 
            setTimeout(() => el.remove(), 300); 
        });

        container.querySelectorAll('.right').forEach(el => {
            removedElements.push({ element: el, parent: el.parentNode, nextSibling: el.nextSibling });
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; 
            el.style.opacity = '0';
            el.style.transform = 'translateX(10px)'; 
            setTimeout(() => el.remove(), 300); 
        });

        container.querySelectorAll('.top.memberCustomBackground').forEach(el => {
            const unwantedGradient = 'linear-gradient(rgba(54, 54, 54, 0.6), rgb(54, 54, 54)),';
            if (el.style.backgroundImage.includes(unwantedGradient)) {
                el.style.transition = 'background-image 0.6s ease'; 
                el.style.backgroundImage = el.style.backgroundImage.replace(unwantedGradient, '');
            }
        });

        // Разблокирование кликов после завершения всех анимаций
        setTimeout(() => {
            isProcessing = false;
        }, 600); 
    }

    // Функция для восстановления классов и стилей
    function restoreElements() {
        if (isModified || isProcessing) return;

        isProcessing = true;

        document.querySelectorAll('.top.memberCustomBackground').forEach(el => {
            el.style.width = '';  
            el.style.height = '';
            el.style.transition = '';  
        });

        document.querySelectorAll('.top.memberCustomBackground').forEach(el => {
            const unwantedGradient = 'linear-gradient(rgba(54, 54, 54, 0.6), rgb(54, 54, 54)),';
            if (!el.style.backgroundImage.includes(unwantedGradient)) {
                el.style.transition = 'background-image 0.6s ease';
                el.style.backgroundImage = unwantedGradient + el.style.backgroundImage;
            }
        });

        removedElements.forEach(({ element, parent, nextSibling }) => {
            parent.insertBefore(element, nextSibling);
            element.classList.remove('fade-out');
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)'; 
        });

        removedElements = [];

        // Разблокирование кликов после завершения всех анимаций
        setTimeout(() => {
            isProcessing = false;
        }, 600); 
    }

    // Функция для проверки, содержит ли элемент один из исключенных классов
    function isExcluded(element) {
        return excludedSelectors.some(selector => element.closest(selector));
    }

    // Функция для обработки нажатия
    function handleClick(event) {
        if (isProcessing) return;

        const target = event.target;
        const container = target.closest('.top.memberCustomBackground');

        if (isExcluded(target)) return; 

        if (container) {
            isModified = !isModified;
            if (isModified) {
                modifyElements(container.closest('.memberCardInner'));
            } else {
                restoreElements(); 
            }
        }
    }

    // Добавляем CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Устанавливаем обработчик событий для клика на существующие элементы
    function setupClickListeners() {
        document.querySelectorAll('.top.memberCustomBackground').forEach(el => {
            el.removeEventListener('click', handleClick); // Удаляем предыдущие обработчики
            el.addEventListener('click', handleClick);
        });
    }

    // Настраиваем MutationObserver для отслеживания изменений в DOM и установки обработчика событий
    const observer = new MutationObserver(() => {
        setupClickListeners(); 
    });

    // Запуск наблюдателя за всем телом документа
    observer.observe(document.body, {
        childList: true,    
        subtree: true     
    });

    // Устанавливаем обработчик событий при загрузке страницы
    setupClickListeners();
})();
