// ==UserScript==
// @name         Chat File Drag-and-Drop
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Отключение стандартного поведения браузера для открытия файлов на всем сайте, кроме дропзоны и контейнера чата.
// @author       You
// @match        https://crm.adeo.pro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518804/Chat%20File%20Drag-and-Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/518804/Chat%20File%20Drag-and-Drop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const chatContainerSelector = '.comment-form, .comment-form.active';
    const dropzoneSelector = '.file-picker-card__dropzone-container';
    const attachedContainers = new WeakSet(); // Используем для отслеживания контейнеров, к которым уже добавлены обработчики.

    const highlightDropzone = (container, highlight) => {
        if (highlight) {
            container.style.border = '2px dashed #007bff';
            container.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        } else {
            container.style.border = '';
            container.style.backgroundColor = '';
        }
    };

    const waitForDropzone = async () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const dropzone = document.querySelector(dropzoneSelector);
                if (dropzone) {
                    clearInterval(interval);
                    resolve(dropzone);
                }
            }, 100);
        });
    };

    const findFileInput = (dropzone) => {
        const forAttribute = dropzone.getAttribute('for');
        if (!forAttribute) {
            return null;
        }
        return document.getElementById(forAttribute);
    };

    const setupDragAndDrop = () => {
        const chatContainers = document.querySelectorAll(chatContainerSelector);

        if (!chatContainers.length) {
            return;
        }

        chatContainers.forEach(chatContainer => {
            // Убедимся, что обработчики не добавлены повторно
            if (attachedContainers.has(chatContainer)) {
                return;
            }

            attachedContainers.add(chatContainer); // Помечаем контейнер как обработанный

            chatContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                highlightDropzone(chatContainer, true);
            });

            chatContainer.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                highlightDropzone(chatContainer, false);
            });

            chatContainer.addEventListener('drop', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                highlightDropzone(chatContainer, false);

                const files = e.dataTransfer.files;
                if (!files.length) return;

                const dropzone = await waitForDropzone();
                if (!dropzone) return;

                const fileInput = findFileInput(dropzone);
                if (!fileInput) {
                    return;
                }

                try {
                    const dataTransfer = new DataTransfer();
                    for (let file of files) {
                        dataTransfer.items.add(file);
                    }
                    fileInput.files = dataTransfer.files;

                    const changeEvent = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(changeEvent);
                } catch (error) {
                    console.error("Error while processing files:", error);
                }
            });
        });
    };

    // Отключаем стандартное поведение на всем сайте, кроме элементов .comment-form, .comment-form.active и .file-picker-card__dropzone-container
    const disableDefaultFileActions = (e) => {
        // Игнорируем события на нужных элементах
        const dropzone = e.target.closest(dropzoneSelector);
        const chatContainer = e.target.closest(chatContainerSelector);

        if (dropzone || chatContainer) {
            return; // Разрешаем стандартное поведение для дропзоны и контейнера чата
        }

        e.preventDefault();
        e.stopPropagation();
    };

    // Добавляем глобальные обработчики для перетаскивания
    window.addEventListener('dragover', disableDefaultFileActions, true);
    window.addEventListener('drop', disableDefaultFileActions, true);

    const observer = new MutationObserver(() => {
        setupDragAndDrop();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    window.addEventListener('load', () => {
        setupDragAndDrop();
    });
})();
