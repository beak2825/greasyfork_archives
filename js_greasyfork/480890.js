// ==UserScript==
// @name         Sfera tasks helper
// @version      0.0.1
// @description  Скрипт, добавляющий возможность вставки ссылок в описания задач и шорткаты для сохранения/отмены изменений
// @match        *://sfera.inno.local/tasks/task/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/998190
// @downloadURL https://update.greasyfork.org/scripts/480890/Sfera%20tasks%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/480890/Sfera%20tasks%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OPTIONS = {
        CHANGE_LINK_KEY_CODE: 'KeyM', // Код кнопки на клавиатуре, по нажатию на которую будет открываться окно с добавлением/редактированием ссылки
        EDITOR_SELECTOR: 'div[contenteditable]', // Селектор редактора
        SAVE_BUTTON_SELECTOR: '[data-testid="text-editor-attribute-save-button"]', // Селектор кнопки сохранения изменений в редакторе
        CANCEL_BUTTON_SELECTOR: '[data-testid="text-editor-attribute-cancel-button"]', // Селектор кнопки отмены изменений в редакторе
        DONOR_BUTTON_SELECTOR: '[data-testid="editor-toolbar-bold"]', // Селектор кнопки-донора (нужна для создания кнопок в адмиральском стиле)
        INTERCEPT_BROWSER_SAVING_DIALOG: true, // Вкл/выкл сочетаний клавиш для сохранения изменений в редакторе (CTRL+S) и их отмены (Escape)
        PREVENT_EDIT_MODE_BY_LINK_CLICK: true, // Вкл/выкл вход в режим редактирования при клике на ссылки в описании задачи
    };

    let editorEl = null;

    const disableBrowserSaveDialog = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
            e.preventDefault();
        }
    };

    const createLink = (href, name) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = name || href;

        return a;
    };

    const editLink = (preselectedEl) => {
        const href = prompt('Измените адрес ссылки (пустое значение удалит ссылку)', preselectedEl.href);
        const name = prompt('Измените название ссылки (необязательно)', preselectedEl.textContent);

        if (href) {
            preselectedEl.href = href;
            preselectedEl.textContent = name;
        } else {
            preselectedEl.replaceWith(preselectedEl.textContent); // удаляем ссылку
        }
    };

    const insertLink = (preselectedText = '') => {
        const href = prompt('Введите адрес ссылки (внешние ссылки должны начинаться с http://)');

        if (!href) {
            return;
        }

        const name = prompt('Введите название ссылки (необязательно)', preselectedText);
        const link = createLink(href, name || href);

        if (preselectedText) {
            window.getSelection().anchorNode.replaceWith(link);
        } else {
            window.getSelection().anchorNode.after(link);
        }
    };

    const getDomElementAsync = (selector, timerLimit = 10000) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => reject(`Время ожидания DOM элемента истекло (${timerLimit / 1000}s)`), timerLimit);

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
    };

    const processLink = () => {
        const { parentElement, textContent } = window.getSelection().anchorNode;

        if (parentElement.href) {
            editLink(parentElement);
        } else {
            insertLink(textContent);
        }
    };

    const editorHandleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === OPTIONS.CHANGE_LINK_KEY_CODE) {
            processLink();
        }
    };

    const createLinkButton = (originalButton, onClick) => {
        const iconPath = 'M19.3 4.5c-2-2-5.3-2-7.3 0L9.7 6.8a.6.6 0 1 0 .9 1l2.3-2.4a3.8 3.8 0 1 1 5.5 5.5L16 13.2a.6.6 0 1 0 1 1l2.3-2.4c2-2 2-5.3 0-7.3Zm-4.8 4.8c.2.3.2.7 0 1l-4.3 4.2a.6.6 0 1 1-.9-1l4.3-4.2c.2-.2.6-.2.9 0Zm-2.6 10a5.2 5.2 0 0 1-7.3-7.4l2.2-2.2a.6.6 0 1 1 1 .9l-2.3 2.3a3.8 3.8 0 1 0 5.4 5.4l2.3-2.3a.6.6 0 1 1 1 1l-2.3 2.2Z';
        const button = originalButton.cloneNode(true);
        button.classList.add(OPTIONS.LINK_BUTTON_CLASSNAME);
        button.addEventListener('click', onClick);

        const svgPath = button.querySelector('path');
        svgPath.setAttribute('d', iconPath);

        return button;
    };

    const saveAndCancelInterceptor = (e) => {
        const saveButton = document.querySelector(OPTIONS.SAVE_BUTTON_SELECTOR);
        const cancelButton = document.querySelector(OPTIONS.CANCEL_BUTTON_SELECTOR);

        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
            saveButton.click();
        }

        if (e.code === 'Escape') {
            const confirmed = confirm('Подвердите выход из режима редактирования');
            confirmed && cancelButton.click();
        }
    }

    const insertLinkButton = async () => {
        const donorButton = await getDomElementAsync(OPTIONS.DONOR_BUTTON_SELECTOR);
        const toolbarEl = donorButton.closest('div');
        const linkButton = createLinkButton(donorButton, processLink);
        const divider = donorButton.parentElement.previousElementSibling.cloneNode(true);

        toolbarEl.append(divider);
        toolbarEl.append(linkButton);
    };

    const onEnableEditMode = async () => {
        insertLinkButton();
        editorEl.addEventListener('keyup', editorHandleKeyDown);

        if (OPTIONS.INTERCEPT_BROWSER_SAVING_DIALOG) {
            document.addEventListener('keydown', disableBrowserSaveDialog, false);
            editorEl.addEventListener('keyup', saveAndCancelInterceptor);
        }
    };

    const onDisableEditMode = async () => {
        editorEl.removeEventListener('keyup', editorHandleKeyDown);

        if (OPTIONS.INTERCEPT_BROWSER_SAVING_DIALOG) {
            document.removeEventListener("keydown", disableBrowserSaveDialog, false);
            editorEl.removeEventListener('keyup', saveAndCancelInterceptor);
        }
    };

    const editModeOberserver = ([mutation]) => {
        if (mutation.target.contentEditable === 'true') {
            onEnableEditMode();
        } else {
            onDisableEditMode();
        }
    };

    const preventEditModeByLinkClick = (e) => {
        if (e.target.tagName === 'A') {
            e.stopPropagation();
        }
    };

    const init = async () => {
        editorEl = await getDomElementAsync(OPTIONS.EDITOR_SELECTOR);

        const pageObserver = new MutationObserver(editModeOberserver);

        pageObserver.observe(editorEl, {
            subtree: false,
            childList: false,
            attributes: true,
            attributeFilter: ['contenteditable'],
        });

        if (OPTIONS.PREVENT_EDIT_MODE_BY_LINK_CLICK) {
            editorEl.addEventListener('click', preventEditModeByLinkClick);
        }
    };

    init();
})();