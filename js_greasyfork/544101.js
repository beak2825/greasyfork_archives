// ==UserScript==
// @name         Hide Calls 4.3
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Кнопка запоминает свою позицию после перезагрузки
// @author       You
// @match        *://*.portal2.i-test.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544101/Hide%20Calls%2043.user.js
// @updateURL https://update.greasyfork.org/scripts/544101/Hide%20Calls%2043.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomStyles() {
        const styles = `
            #masterHideButton {
                transition: background-color 0.2s ease, filter 0.2s ease;
            }
            #masterHideButton:hover {
                filter: brightness(0.9);
            }
            #masterHideButton:active {
                transform: translate(1px, 1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.4);
                cursor: grabbing;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
    addCustomStyles();

    let wasDragged = false;

    function makeButtonDraggable(button) {
        let isDragging = false;

        button.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            wasDragged = false;

            const offsetX = e.clientX - button.getBoundingClientRect().left;
            const offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            button.style.transition = 'none';
            document.body.style.userSelect = 'none';

            function onMouseMove(e) {
                if (isDragging) {
                    wasDragged = true;

                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;
                    const rect = button.getBoundingClientRect();
                    newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));
                    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));

                    button.style.left = `${newLeft}px`;
                    button.style.top = `${newTop}px`;
                }
            }

            function onMouseUp() {
                isDragging = false;
                button.style.cursor = 'pointer';
                button.style.transition = 'background-color 0.2s ease, filter 0.2s ease';
                document.body.style.userSelect = '';

                // --- СОХРАНЕНИЕ ПОЗИЦИИ ---
                // Когда отпускаем кнопку, сохраняем её координаты
                if (wasDragged) {
                    localStorage.setItem('draggableButtonTop', button.style.top);
                    localStorage.setItem('draggableButtonLeft', button.style.left);
                }

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    window.addEventListener('load', () => {
        const masterHideButton = document.createElement('button');
        masterHideButton.id = 'masterHideButton';
        masterHideButton.textContent = 'Hide Calls';
        masterHideButton.title = 'Нажмите, чтобы скрыть все открытые звонки (можно перетаскивать)';

        // --- ЗАГРУЗКА ПОЗИЦИИ ---
        // Пытаемся загрузить сохраненные координаты из localStorage
        const savedTop = localStorage.getItem('draggableButtonTop');
        const savedLeft = localStorage.getItem('draggableButtonLeft');

        Object.assign(masterHideButton.style, {
            position: 'fixed',
            // Если есть сохраненные значения — используем их, если нет — ставим по умолчанию
            top: savedTop || '240px',
            left: savedLeft || `calc(100vw - 155px)`,
            zIndex: '9999',
            height: '50px',
            width: '135px',
            backgroundColor: '#0b8396',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        });
        document.body.appendChild(masterHideButton);

        makeButtonDraggable(masterHideButton);

        masterHideButton.addEventListener('click', () => {
            if (wasDragged) {
                return;
            }

            const allCallButtons = document.querySelectorAll('a[id^="TestShowHide"]');
            let clickedCount = 0;

            allCallButtons.forEach((button) => {
                if (button.textContent.trim() === 'Hide Calls') {
                    button.click();
                    clickedCount++;
                }
            });

            if (clickedCount > 0) {
                masterHideButton.textContent = `Hidden: ${clickedCount}`;
                masterHideButton.style.backgroundColor = '#28a745';
            } else {
                masterHideButton.textContent = 'Nothing to hide';
                masterHideButton.style.backgroundColor = '#ffc107';
            }

            setTimeout(() => {
                masterHideButton.textContent = 'Hide Calls';
                masterHideButton.style.backgroundColor = '#0b8396';
            }, 2500);
        });
    });
})();