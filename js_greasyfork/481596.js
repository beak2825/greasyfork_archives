// ==UserScript==
// @name         Sfera users tasks enhancer
// @version      0.3
// @description  Скрипт, добавляющий разные фичи на страницу с задачками принта
// @match        *://sfera.inno.local/tasks/area/*/view/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/998190
// @downloadURL https://update.greasyfork.org/scripts/481596/Sfera%20users%20tasks%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/481596/Sfera%20users%20tasks%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS = {
        groupTitleElementSelector: '#root header + div [data-rbd-draggable-id]', // Элемент, по которому можно понять, что данные на странице появились
        taskUrlMask: '/tasks/area/EXPERT/task/{taskName}', // Маска урла задач (taskName - название задачи)
        taskCardAttr: 'data-rbd-draggable-id', // Атрибут карточки задачи, нужен чтобы отличать ссылки в карточках от остальных похожих элементов
        tasksPrefix: 'EXPERT-', // Префикс в названии задач
    };

    async function init() {
        await getDomElementAsync(SETTINGS.groupTitleElementSelector);

        injectStyles();

        runAddTaskOpeners();
    }

    function getDomElementAsync(selector, timerLimit = 10000) {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => reject(`Время ожидания DOM элемента ${selector} истекло (${timerLimit / 1000}s)`), timerLimit);

                let timerId;

                const tick = () => {
                    const element = document.querySelector(selector);

                    if (element) {
                        clearTimeout(timerId);
                        resolve(element);
                    } else {
                        timerId = setTimeout(tick, 100);
                    }
                };

                tick();
            } catch (e) {
                reject(e);
            }
        });
    }

    function runAddTaskOpeners() {
        const getTaskNameEl = (element) => {
            if (element?.tagName.toLowerCase() === 'span'
                   && element.parentElement?.parentElement?.parentElement?.hasAttribute(SETTINGS.taskCardAttr)
                   && element.textContent.startsWith(SETTINGS.tasksPrefix)) {
                return element.textContent;
            }

            return '';
        };

        document.addEventListener('mousedown', ({ target }) => {
            const taskName = getTaskNameEl(target);
            console.debug(taskName);

            if (taskName) {
                event.stopPropagation();
                event.preventDefault();
                const path = SETTINGS.taskUrlMask.replace('{taskName}', taskName);

                window.open(`${location.origin}${path}`,'_blank').focus();
            }
        });
    }

    function injectStyles() {
        const styles = `
            [data-rbd-draggable-id] span + span {
                display: inline-block;
                margin: -5px;
                padding: 5px;
                cursor: pointer !important;
            }
            [data-rbd-draggable-id] span + span:hover {
                color: blue;
            }
        `;

        document.head.insertAdjacentHTML("beforeend", `<style type="text/css" id="sferaUsersTasksEnhancerStyles">${styles}</style>`)
    }

    init();
})();