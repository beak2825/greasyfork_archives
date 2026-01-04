// ==UserScript==
// @name         Click-to-Copy Ultimate Pro
// @namespace    http://tampermonkey.net/
// @version      24.1
// @description  Быстрое копирование описяния продукта на 3D Маркетплейсах.
// @author       Bogus
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544509/Click-to-Copy%20Ultimate%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/544509/Click-to-Copy%20Ultimate%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    const configurations = [
        { container: '.description .std', blocks: 'p', needsPreprocessing: false },
        { container: '.prodInfo', blocks: 'span', needsPreprocessing: true },
        { container: '#description', blocks: 'span', needsPreprocessing: true },
        { container: '.data_for_whats_included', blocks: 'li', needsPreprocessing: false }
    ];

    const defaultClickAction = 'copyAll'; // 'copyOne' или 'copyAll'

    // Список точных фраз для исключения.
    const excludedPhrases = [
        "Please see each product's page for details.",
        "See each product page for details."
    ];
    // --- КОНЕЦ НАСТРОЕК ---

    let cumulativeClipboardText = '';

    GM_addStyle(`
        .tm-highlight-copy { background-color: #e6f7ff !important; outline: 1px solid #91d5ff !important; transition: all 0.2s ease-out; }
        .tm-flash-clear { background-color: #fff1f0 !important; outline: 2px solid #ffccc7 !important; transition: all 0.1s ease-in; }
        .tm-flash-copy-all { background-color: #e6f7ff !important; outline: 2px solid #91d5ff !important; transition: all 0.1s ease-in; }
        ${configurations.map(c => c.container).join(', ')} { cursor: copy; }
        .tm-preprocessed span { display: block !important; margin-bottom: 1em; }
    `);

    // --- УЛУЧШЕННАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ ---
    const filterText = (text) => {
        if (!text) return null;
        const trimmedText = text.trim();

        // 1. НОВОЕ ПРАВИЛО: Проверяем, начинается ли строка со звездочки.
        if (trimmedText.startsWith('*')) {
            console.log(`Фильтрация (по правилу '*'): Абзац "${trimmedText}" был исключен.`);
            return null;
        }

        // 2. СТАРОЕ ПРАВИЛО: Проверяем на полное совпадение с фразами из списка.
        const lowercasedText = trimmedText.toLowerCase();
        const lowercasedExclusions = excludedPhrases.map(p => p.toLowerCase());

        if (lowercasedExclusions.includes(lowercasedText)) {
            console.log(`Фильтрация (по списку): Абзац "${trimmedText}" был исключен.`);
            return null;
        }

        // Если все проверки пройдены, возвращаем оригинальный текст.
        return text;
    };

    const clearBuffer = (targetElement) => {
        cumulativeClipboardText = '';
        GM_setClipboard('');
        targetElement.classList.add('tm-flash-clear');
        setTimeout(() => targetElement.classList.remove('tm-flash-clear'), 500);
    };

    const copyAllParagraphs = (targetElement, blockSelector) => {
        const allTextElements = targetElement.querySelectorAll(blockSelector);
        if (allTextElements.length === 0) return;

        const texts = Array.from(allTextElements)
            .map(el => filterText(el.textContent))
            .filter(Boolean)
            .map(text => text.trim());

        if (texts.length === 0) {
            console.log("Все абзацы были отфильтрованы.");
            return;
        }

        cumulativeClipboardText = texts.join('\n\n');
        GM_setClipboard(cumulativeClipboardText);
        targetElement.classList.add('tm-flash-copy-all');
        setTimeout(() => targetElement.classList.remove('tm-flash-copy-all'), 500);
    };

    const copyOneParagraph = (clickedBlock) => {
        const paragraphText = filterText(clickedBlock.textContent);
        if (!paragraphText) return;

        const trimmedText = paragraphText.trim();
        cumulativeClipboardText = cumulativeClipboardText === '' ? trimmedText : cumulativeClipboardText + '\n\n' + trimmedText;
        GM_setClipboard(cumulativeClipboardText);
        clickedBlock.classList.add('tm-highlight-copy');
        setTimeout(() => clickedBlock.classList.remove('tm-highlight-copy'), 500);
    };

    const preprocessContainer = (containerElement) => {
        containerElement.classList.add('tm-preprocessed');
        let html = containerElement.innerHTML;
        const separator = '{{TM_PARAGRAPH_BREAK}}';
        html = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, separator);
        const htmlParagraphs = html.split(separator);
        containerElement.innerHTML = '';
        htmlParagraphs.forEach(p_html => {
            const p_with_newlines = p_html.replace(/<br\s*\/?>/gi, '\n');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = p_with_newlines;
            const cleanText = (tempDiv.textContent || tempDiv.innerText || '').trim();
            if (cleanText) {
                const span = document.createElement('span');
                span.textContent = cleanText;
                containerElement.appendChild(span);
            }
        });
    };

    const attachListeners = (containerElement, finalBlockSelector) => {
        containerElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const copyOneAction = () => {
                const clickedBlock = event.target.closest(finalBlockSelector);
                if (clickedBlock && containerElement.contains(clickedBlock)) {
                    copyOneParagraph(clickedBlock);
                }
            };
            const copyAllAction = () => copyAllParagraphs(containerElement, finalBlockSelector);
            if (event.ctrlKey) {
                (defaultClickAction === 'copyAll') ? copyOneAction() : copyAllAction();
            } else {
                (defaultClickAction === 'copyAll') ? copyAllAction() : copyOneAction();
            }
        });
        containerElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            event.stopPropagation();
            clearBuffer(containerElement);
        });
    };

    function initialize() {
        for (const config of configurations) {
            const containerElement = document.querySelector(config.container);
            if (containerElement) {
                let finalBlockSelector = config.blocks;
                if (config.needsPreprocessing) {
                    setTimeout(() => {
                        preprocessContainer(containerElement);
                        finalBlockSelector = 'span';
                        attachListeners(containerElement, finalBlockSelector);
                    }, 500);
                } else {
                    attachListeners(containerElement, finalBlockSelector);
                }
            }
        }
    }

    initialize();
})();
