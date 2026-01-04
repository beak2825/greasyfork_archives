// ==UserScript==
// @name         Мигающие кружки + подсветка пустых "Дополнительные сведения"
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Анимация кружков + подсветка полей "Дополнительные сведения".
// @match        https://sm.mos.ru/sm/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533150/%D0%9C%D0%B8%D0%B3%D0%B0%D1%8E%D1%89%D0%B8%D0%B5%20%D0%BA%D1%80%D1%83%D0%B6%D0%BA%D0%B8%20%2B%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%83%D1%81%D1%82%D1%8B%D1%85%20%22%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%81%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%22.user.js
// @updateURL https://update.greasyfork.org/scripts/533150/%D0%9C%D0%B8%D0%B3%D0%B0%D1%8E%D1%89%D0%B8%D0%B5%20%D0%BA%D1%80%D1%83%D0%B6%D0%BA%D0%B8%20%2B%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%83%D1%81%D1%82%D1%8B%D1%85%20%22%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%81%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FIELD_NAME = "instance/dit.additional.field.15";
    const CHECK_INTERVAL = 1000;

    const redBorder = '2px solid red';
    const redBoxShadow = '0 0 8px 2px rgba(255,0,0,0.7)';
    const transition = 'box-shadow 0.3s ease, border 0.3s ease';

    function ensureCirclesContainer() {
        let container = document.querySelector('#circles-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'circles-container';
            container.style.position = 'absolute';
            container.style.top = '10px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            container.style.display = 'flex';
            container.style.gap = '12px';
            container.style.zIndex = '9999';
            container.style.alignItems = 'center';
            document.body.appendChild(container);

            const style = document.createElement('style');
            style.textContent = `
                .red-blink-circle {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: radial-gradient(circle at center, #ff4d4d, #cc0000);
                    box-shadow: 0 0 10px rgba(255,0,0,0.6);
                    opacity: 0;
                    transform: scale(0) translateY(-20px);
                    transition:
                        opacity 0.5s ease,
                        transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
                        margin 0.6s ease;
                    animation: blink 1.5s infinite ease-in-out;
                }
                .red-blink-circle.show {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                #circles-container {
                    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
            `;
            document.head.appendChild(style);
        }
        return container;
    }

    function syncCircles(emptyFieldsCount) {
        const container = ensureCirclesContainer();
        const existingCircles = container.querySelectorAll('.red-blink-circle');
        const existingCount = existingCircles.length;

        if (emptyFieldsCount > existingCount) {
            for (let i = existingCount; i < emptyFieldsCount; i++) {
                const circle = document.createElement('div');
                circle.className = 'red-blink-circle';
                container.appendChild(circle);
                setTimeout(() => {
                    circle.classList.add('show');
                }, 50); // небольшая задержка для волнообразного эффекта
            }
        } else if (emptyFieldsCount < existingCount) {
            for (let i = existingCount - 1; i >= emptyFieldsCount; i--) {
                const circle = existingCircles[i];
                circle.classList.remove('show');
                setTimeout(() => {
                    circle.remove();
                }, 600); // ждем окончания анимации
            }
        }
    }

    function highlightTabLink(tabLink, isEmpty) {
        if (isEmpty) {
            tabLink.style.transition = transition;
            tabLink.style.border = redBorder;
            tabLink.style.boxShadow = redBoxShadow;
        } else {
            tabLink.style.border = '';
            tabLink.style.boxShadow = '';
        }
    }

    function highlightFieldContainer(input, isEmpty) {
        const container = input.closest('.mandatoryFieldStyle.xEdit');
        if (container) {
            container.style.transition = transition;
            container.style.border = isEmpty ? redBorder : '';
            container.style.boxShadow = isEmpty ? redBoxShadow : '';
        }
    }

    function countEmptyFields(doc) {
        let count = 0;
        const inputs = doc.querySelectorAll(`input[name="${FIELD_NAME}"]`);
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                count++;
            }
        });
        return count;
    }

    function processTabsAndFields(doc) {
        const tabLinks = doc.querySelectorAll('a[aria-controls]');
        tabLinks.forEach(tabLink => {
            const tabContentId = tabLink.getAttribute('aria-controls');
            const tabContent = doc.getElementById(tabContentId);
            if (!tabContent) return;

            const field = tabContent.querySelector(`input[name="${FIELD_NAME}"]`);
            if (field) {
                const isEmpty = field.value.trim() === '';
                highlightTabLink(tabLink, isEmpty);
                highlightFieldContainer(field, isEmpty);
            }
        });
    }

    function scanAllDocuments(callback) {
        callback(document);
        for (let frame of document.querySelectorAll('iframe')) {
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                if (doc) callback(doc);
            } catch (_) {}
        }
    }

    function processAll() {
        let totalEmpty = 0;
        scanAllDocuments(doc => {
            processTabsAndFields(doc);
            totalEmpty += countEmptyFields(doc);
        });
        syncCircles(totalEmpty);
    }

    setInterval(processAll, CHECK_INTERVAL);
    processAll();
})();
