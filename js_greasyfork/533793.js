// ==UserScript==
// @name        Hero.Study навигация+
// @namespace   Violentmonkey Scripts
// @match       https://admin.aogu.hero.study/ru/learner*
// @match       https://admin.aogu.hero.study/ru/learner/view*
// @match       https://admin.aogu.hero.study/ru/diplom/*
// @match       https://admin.aogu.hero.study/ru/diplom/view*
// @match       https://admin.aogu.hero.study/ru/graduate/*
// @grant       none
// @version     1.1
// @author      Steam-G
// @description Добавляет кнопки с иконками, стилизация и всплывающие подсказки сверху
// @downloadURL https://update.greasyfork.org/scripts/533793/HeroStudy%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D1%8F%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/533793/HeroStudy%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D1%8F%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_STYLE = `
        margin-left: 10px;
        padding: 6px;
        color: black;
        background: #ffffff00;
        border-radius: 50%;
        text-decoration: none;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        position: relative;
    `;

    const TOOLTIP_STYLE = `
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 9999;
    `;

    function waitForElement(selector, callback) {
        const targetNode = document.body;
        const observerOptions = {
            childList: true,
            subtree: true
        };

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(targetNode, observerOptions);
    }

    const path = window.location.pathname;

    function createButtons(studentId, containerElement, buttons) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        containerElement.parentNode.insertBefore(wrapper, containerElement);
        wrapper.appendChild(containerElement);

        buttons.forEach(({ label, url, icon }) => {
            const button = document.createElement('a');
            button.href = url(studentId);
            button.innerText = icon;
            button.style.cssText = BUTTON_STYLE;

            const tooltip = document.createElement('span');
            tooltip.textContent = label;
            tooltip.style.cssText = TOOLTIP_STYLE;
            button.appendChild(tooltip);

            button.onmouseenter = () => {
                button.style.transform = 'scale(1.15)';
                tooltip.style.opacity = '1';
            };
            button.onmouseleave = () => {
                button.style.transform = 'scale(1)';
                tooltip.style.opacity = '0';
            };

            wrapper.appendChild(button);
        });
    }

    if (path.includes('/ru/learner/view')) {
        waitForElement('h1', (headerElement) => {
            const urlParams = new URLSearchParams(window.location.search);
            const studentId = urlParams.get('id');

            if (!studentId || isNaN(studentId)) {
                console.log('ID студента не найден в параметрах URL.');
                return;
            }

            const BUTTONS = [
              {
                  label: 'Транскрипт',
                  url: id => `https://admin.aogu.hero.study/ru/transcript/view?id=${id}`,
                  icon: '📄'
              },
              {
                  label: 'Диплом',
                  url: id => `https://admin.aogu.hero.study/ru/diplom/view?id=${id}`,
                  icon: '🎓'
              }
            ];

            createButtons(studentId, headerElement, BUTTONS);
        });

    } else if (path.includes('/ru/learner/')) {
        const BUTTONS = [
            {
                label: 'Транскрипт',
                url: id => `https://admin.aogu.hero.study/ru/transcript/view?id=${id}`,
                icon: '📄'
            },
            {
                label: 'Диплом',
                url: id => `https://admin.aogu.hero.study/ru/diplom/view?id=${id}`,
                icon: '🎓'
            }
        ];

        waitForElement('h1.ellipse-text.line-2', (studentNameElement) => {
            const urlParts = window.location.pathname.split('/');
            const studentId = urlParts.pop();

            if (!studentId || isNaN(studentId)) {
                console.log('ID студента не найден в URL.');
                return;
            }

            createButtons(studentId, studentNameElement, BUTTONS);
        });

    } else if (path.includes('/ru/diplom/view')) {
        waitForElement('h1', (headerElement) => {
            const urlParams = new URLSearchParams(window.location.search);
            const studentId = urlParams.get('id');

            if (!studentId || isNaN(studentId)) {
                console.log('ID студента не найден в параметрах URL.');
                return;
            }

            const studentLink = {
                label: 'Профиль студента',
                url: id => `https://admin.aogu.hero.study/ru/learner/${id}`,
                icon: '👤'
            };

            createButtons(studentId, headerElement, [studentLink]);
        });

      } else if (path.includes('/ru/diplom/')) {
        waitForElement('h1', (headerElement) => {
            const urlParts = window.location.pathname.split('/');
            const studentId = urlParts.pop();

            if (!studentId || isNaN(studentId)) {
                console.log('ID студента не найден в URL.');
                return;
            }
            const studentLink = {
                label: 'Профиль студента',
                url: id => `https://admin.aogu.hero.study/ru/learner/${id}`,
                icon: '👤'
            };

            createButtons(studentId, headerElement, [studentLink]);
        });

    } else if (path.includes('/ru/graduate/')) {
        const BUTTONS = [
            {
                label: 'Транскрипт',
                url: id => `https://admin.aogu.hero.study/ru/transcript/view?id=${id}`,
                icon: '📄'
            },
            {
                label: 'Диплом',
                url: id => `https://admin.aogu.hero.study/ru/diplom/view?id=${id}`,
                icon: '🎓'
            }
        ];

        waitForElement('h1.ellipse-text.line-2', (studentNameElement) => {
            const urlParts = window.location.pathname.split('/');
            const studentId = urlParts.pop();

            if (!studentId || isNaN(studentId)) {
                console.log('ID студента не найден в URL.');
                return;
            }

            createButtons(studentId, studentNameElement, BUTTONS);
        });
    }
})();
