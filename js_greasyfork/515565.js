// ==UserScript==
// @name         LZT Article Summarizer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Утилита, которая сокращает текст темы, экономя ваше время на прочтение.
// @author       @planetus (lolz)
// @match        https://lolz.live/threads/*
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/515565/LZT%20Article%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/515565/LZT%20Article%20Summarizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        minTextLength: 200,
        maxSummaryLength: 500,
        maxKeyPoints: 5,
        buttonColor: '#228e5d',
        summaryBgColor: '#091e15',
        summaryTextColor: '#ecf0f1',
        animationSpeed: 300,
        wordsPerMinute: 200
    };

    let settings = Object.assign({}, defaultSettings, GM_getValue('lztSummarizerSettings', {}));

    function saveSettings() {
        GM_setValue('lztSummarizerSettings', settings);
        updateStyles();
    }

    function clearSettings() {
        GM_setValue('lztSummarizerSettings', {});
        settings = Object.assign({}, defaultSettings);
        updateStyles();
    }

    function createSettingsMenu() {
        const settingsHTML = `
            <div id="lzt-settings-overlay" class="lzt-settings-overlay">
                <div id="lzt-settings" class="lzt-settings">
                    <div class="lzt-flex">
                    <h2 class="lzt-settings-title">Настройки LZT Summarizer</h2>
                    <button id="closeSettings" class="lzt-settings-button lzt-settings-close"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-dashoffset="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.1" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="12;0"/></path></svg></button>
                    </div>
                    <div class="lzt-settings-group">
                        <label for="minTextLength">Минимальная длина текста для резюме:</label>
                        <input type="number" id="minTextLength" value="${settings.minTextLength}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="maxSummaryLength">Максимальная длина резюме:</label>
                        <input type="number" id="maxSummaryLength" value="${settings.maxSummaryLength}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="maxKeyPoints">Максимальное количество ключевых моментов:</label>
                        <input type="number" id="maxKeyPoints" value="${settings.maxKeyPoints}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="buttonColor">Цвет кнопки:</label>
                        <input type="color" id="buttonColor" value="${settings.buttonColor}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="summaryBgColor">Цвет фона резюме:</label>
                        <input type="color" id="summaryBgColor" value="${settings.summaryBgColor}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="summaryTextColor">Цвет текста резюме:</label>
                        <input type="color" id="summaryTextColor" value="${settings.summaryTextColor}">
                    </div>
                    <div class="lzt-settings-group">
                        <label for="animationSpeed">Скорость анимации (мс):</label>
                        <input type="number" id="animationSpeed" value="${settings.animationSpeed}">
                    </div>
                    <div class="lzt-settings-buttons">
                        <button id="saveSettings" class="lzt-settings-button lzt-settings-save">Сохранить</button>
                        <button id="clearSettings" class="lzt-settings-button lzt-settings-clear">Очистить всё</button>
                    </div>
                </div>
            </div>
        `;

        const settingsDiv = document.createElement('div');
        settingsDiv.innerHTML = settingsHTML;
        document.body.appendChild(settingsDiv);

        const overlay = document.getElementById('lzt-settings-overlay');
        const settingsPanel = document.getElementById('lzt-settings');

        setTimeout(() => {
            overlay.style.opacity = '1';
            settingsPanel.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);

        document.getElementById('saveSettings').addEventListener('click', function() {
            settings.minTextLength = parseInt(document.getElementById('minTextLength').value);
            settings.maxSummaryLength = parseInt(document.getElementById('maxSummaryLength').value);
            settings.maxKeyPoints = parseInt(document.getElementById('maxKeyPoints').value);
            settings.buttonColor = document.getElementById('buttonColor').value;
            settings.summaryBgColor = document.getElementById('summaryBgColor').value;
            settings.summaryTextColor = document.getElementById('summaryTextColor').value;
            settings.animationSpeed = parseInt(document.getElementById('animationSpeed').value);
            saveSettings();
            closeSettingsMenu();
        });

        document.getElementById('clearSettings').addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                clearSettings();
                closeSettingsMenu();
                alert('Настройки сброшены до значений по умолчанию.');
            }
        });

        document.getElementById('closeSettings').addEventListener('click', closeSettingsMenu);

        function closeSettingsMenu() {
            overlay.style.opacity = '0';
            settingsPanel.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                settingsDiv.remove();
            }, 300);
        }
    }

    function updateStyles() {
        GM_addStyle(`
            .lzt-summary-button {
                background: linear-gradient(45deg, ${settings.buttonColor}, ${lightenDarkenColor(settings.buttonColor, -20)});
                border: none;
                color: white;
                padding: 10px 15px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                user-select: none;
                margin: 10px 0;
                cursor: pointer;
                border-radius: 4px;
                transition: all ${settings.animationSpeed}ms ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                animation: fadeInButton ${settings.animationSpeed}ms ease-out;
            }
            .lzt-summary-button:hover {
                background: linear-gradient(45deg, ${lightenDarkenColor(settings.buttonColor, -20)}, ${lightenDarkenColor(settings.buttonColor, -40)});
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .lzt-summary-button:active {
                transform: translateY(0);
            }
            .lzt-summary {
                position: relative;
                z-index: 99;
                background-color: ${settings.summaryBgColor};
                border-left: 4px solid ${settings.buttonColor};
                color: ${settings.summaryTextColor};
                padding: 20px;
                margin: 15px 0;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.6;
                animation: fadeIn ${settings.animationSpeed}ms ease-out;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInButton {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
             .lzt-flex {
               display: flex;
               align-items: center;
               gap: 30px;
               flex-wrap: nowrap;
               margin-bottom: 15px;
               justify-content: space-between;
            }
            .lzt-summary-title {
                color: ${settings.buttonColor};
                font-weight: bold;
                margin-bottom: 15px;
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .lzt-summary-content {
                margin-top: 10px;
                white-space: pre-line;
            }
            .lzt-key-points {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            .lzt-key-points-title {
                color: ${settings.buttonColor};
                font-weight: bold;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .lzt-key-point {
                margin: 8px 0;
                padding-left: 20px;
                position: relative;
            }
            .lzt-key-point:before {
                content: "•";
                color: ${settings.buttonColor};
                position: absolute;
                left: 0;
                font-size: 18px;
            }
            .lzt-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background-color: ${settings.summaryBgColor};
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 999999;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                opacity: 0;
                transition: all ${settings.animationSpeed}ms ease;
            }
            .lzt-popup.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            .lzt-popup-close {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 28px;
                color: ${settings.summaryTextColor};
                cursor: pointer;
                transition: color ${settings.animationSpeed}ms ease;
            }
            .lzt-popup-close:hover {
                color: ${settings.buttonColor};
            }
            .lzt-original-content {
                transition: opacity ${settings.animationSpeed}ms ease, height ${settings.animationSpeed}ms ease;
                overflow: hidden;
            }
            .lzt-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                z-index: 99998;
                opacity: 0;
                transition: opacity ${settings.animationSpeed}ms ease;
            }
            .lzt-overlay.show {
                opacity: 1;
            }
            .lzt-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                backdrop-filter: blur(8px);
                transition: opacity ${settings.animationSpeed}ms ease;
            }
            .lzt-settings {
                background-color: #303030b0;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                width: 90%;
                max-width: 500px;
                transform: translate(-50%, -50%) scale(0.9);
                transition: transform ${settings.animationSpeed}ms ease;
                position: fixed;
                top: 50%;
                left: 50%;
            }
            .lzt-settings-title {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #228e5d;
                font-weight: bold;
                margin-bottom: 0;
                font-size: 18px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .lzt-settings-group {
                margin-bottom: 15px;
            }
            .lzt-settings-group label {
                display: block;
                color: #bdc3c7;
                margin-bottom: 5px;
            }
            .lzt-settings-group input {
                width: 100%;
                padding: 8px;
                border: none;
                border-radius: 4px;
                background-color: #303030;
                color: #ecf0f1;
                font-size: 14px;
            }
            .lzt-settings-group input[type="color"] {
                height: 40px;
                cursor: pointer;
            }
            .lzt-settings-buttons {
               display: flex;
               gap: 5px;
               justify-content: space-between;
               margin-top: 20px;
            }
            .lzt-settings-button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                font-size: 15px;
                cursor: pointer;
                transition: background-color ${settings.animationSpeed}ms ease;
            }
           .lzt-settings-save {
               display: block;
               width: -webkit-fill-available;
               background-color: #2ecc7161;
               color: white;
            }
            .lzt-settings-save:hover {
               background-color: #27ae60;
            }
            .lzt-settings-clear {
              display: block;
              width: -webkit-fill-available;
              background-color: #f39c1291;
              color: white;
             }
            .lzt-settings-clear:hover {
              background-color: #d35400;
            }
            .lzt-settings-close {
              display: flex;
              border-radius: 12px;
              padding: 8px 18px;
              width: max-content;
              background-color: #313131;
              color: white;
            }
            .lzt-settings-close:hover {
              background-color: #c0392b;
            }
            .lzt-reading-time {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            opacity: .8;
            color: ${settings.summaryTextColor};
            margin-top: 10px;
            }
        `);
    }

    function lightenDarkenColor(col, amt) {
        let usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        let num = parseInt(col,16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    function extractKeyPoints(text) {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const keyPoints = [];

        const indicators = [
            'важно', 'главное', 'необходимо', 'следует', 'нужно',
            'основной', 'ключевой', 'рекомендуется', 'обратите внимание',
            'в первую очередь', 'самое важное', 'ключевая идея', 'существенно',
            'критически', 'принципиально', 'фундаментально', 'приоритетно'
        ];

        sentences.forEach(sentence => {
            const lowercaseSentence = sentence.toLowerCase();
            if (indicators.some(indicator => lowercaseSentence.includes(indicator)) ||
                (sentence.length > 30 && sentence.length < 200 && /[0-9]/.test(sentence)) ||
                /^[•\-]/.test(sentence.trim())) {
                keyPoints.push(sentence.trim());
            }
        });

        const startIndicators = ['ключевые моменты', 'основные пункты', 'главные идеи'];
        let foundKeyPointSection = false;

        sentences.forEach(sentence => {
            const lowercaseSentence = sentence.toLowerCase().trim();
            if (startIndicators.some(indicator => lowercaseSentence.startsWith(indicator))) {
                foundKeyPointSection = true;
            }
            if (foundKeyPointSection && /^[•\-]/.test(sentence.trim())) {
                keyPoints.push(sentence.trim());
            }
        });

        return [...new Set(keyPoints)].slice(0, settings.maxKeyPoints);
    }

    function summarizeText(text) {
        text = text.replace(/\s+/g, ' ').trim();

        const sentences = text.split(/(?<=[.!?])\s+(?=[A-ZА-Я])/);

        if (sentences.length === 0) {
            return '';
        }

        const sentenceScores = sentences.map((sentence, index) => {
            const words = sentence.toLowerCase().split(' ');
            let score = 0;

            const importantWords = [
                'важно', 'главное', 'необходимо', 'ключевой', 'существенно',
                'критически', 'спонсор', 'проект', 'результат', 'итог',
                'вывод', 'следовательно', 'таким образом', 'поэтому',
                'значит', 'суть', 'основа', 'цель', 'задача'
            ];

            const importantWordsCount = words.filter(word =>
                importantWords.some(important => word.includes(important))
            ).length;
            score += importantWordsCount * 3;

            if (sentence.length > 50 && sentence.length < 200) {
                score += 2;
            }

            if (/[0-9]/.test(sentence)) score += 2;
            if (/[%$€₽]/.test(sentence)) score += 2;

            if (index < 3) score += 3;
            if (index > sentences.length - 4) score += 2;

            if (index > 0) {
                const prevSentence = sentences[index - 1].toLowerCase();
                const commonWords = words.filter(word =>
                    word.length > 3 && prevSentence.includes(word)
                );
                score += commonWords.length * 0.5;
            }

            return { sentence, score, index };
        });

        sentenceScores.sort((a, b) => b.score - a.score);

        const selectedSentences = sentenceScores
            .slice(0, Math.ceil(sentences.length * 0.3))
            .sort((a, b) => a.index - b.index);

        let summary = selectedSentences
            .map(item => item.sentence.trim())
            .join('\n\n');

        if (summary.length > settings.maxSummaryLength) {
            summary = summary.substring(0, settings.maxSummaryLength).trim();
            const lastDot = summary.lastIndexOf('.');
            if (lastDot > 0) {
                summary = summary.substring(0, lastDot + 1);
            }
        }

        return summary;
    }

    function createPopup(content) {
        const overlay = document.createElement('div');
        overlay.className = 'lzt-overlay';
        document.body.appendChild(overlay);

        const popup = document.createElement('div');
        popup.className = 'lzt-popup';
        popup.innerHTML = `
            <div class="lzt-popup-close">&times;</div>
            ${content}
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            overlay.classList.add('show');
            popup.classList.add('show');
        }, 50);

        const closePopup = () => {
            overlay.classList.remove('show');
            popup.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                popup.remove();
            }, settings.animationSpeed);
        };

        popup.querySelector('.lzt-popup-close').addEventListener('click', closePopup);
        overlay.addEventListener('click', closePopup);
    }

    function getTextContent(element) {
        let text = '';
        function extractText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim() + ' ';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('bbCodeBlock') ||
                    node.tagName === 'IMG' ||
                    node.tagName === 'SCRIPT' ||
                    node.tagName === 'STYLE' ||
                    node.classList.contains('messageTextEndMarker') ||
                    node.classList.contains('lzt-summary-button')) {
                    return;
                }
                node.childNodes.forEach(extractText);
            }
        }
        extractText(element);
        return text.replace(/\s+/g, ' ').trim();
    }

    function formatReadingTime(text) {
        const words = text.split(/\s+/).length;
        const minutes = words / settings.wordsPerMinute;

        if (minutes < 1) {
            const seconds = Math.ceil(minutes * 60);
            return `${seconds} сек.`;
        }

        return `${Math.ceil(minutes)} мин.`;
    }

    function addSummaryButton(postElement) {
        if (!postElement.classList.contains('firstPost')) return;

        if (postElement.querySelector('.lzt-summary-button')) return;

        const contentElement = postElement.querySelector('.messageContent');
        if (!contentElement) return;

        const fullText = getTextContent(contentElement);

        if (fullText.length < settings.minTextLength) {
            return;
        }

        const summaryButton = document.createElement('button');
        summaryButton.textContent = '📝 Показать резюме';
        summaryButton.className = 'lzt-summary-button';
        summaryButton.style.opacity = '0';

        let summaryElement = null;
        let isProcessing = false;

        summaryButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (isProcessing) return;
            isProcessing = true;

            if (summaryElement) {
                summaryElement.style.display = summaryElement.style.display === 'none' ? 'block' : 'none';
                summaryButton.textContent = summaryElement.style.display === 'none' ? '📝 Показать резюме' : '❌ Скрыть резюме';

                contentElement.style.height = summaryElement.style.display === 'none' ? 'auto' : '0';
                contentElement.style.opacity = summaryElement.style.display === 'none' ? '1' : '0';
                isProcessing = false;
            } else {
                const summary = summarizeText(fullText);
                const keyPoints = extractKeyPoints(fullText);
                const readingTime = formatReadingTime(fullText);
                const summaryReadingTime = formatReadingTime(summary);

                summaryElement = document.createElement('div');
                summaryElement.className = 'lzt-summary';

                let summaryHTML = `
                    <div class="lzt-summary-title"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24"><g fill="none"><path fill="url(#fluentColorPin240)" fill-rule="evenodd" d="m9.53 15.53l-5.25 5.25a.75.75 0 1 1-1.06-1.06l5.25-5.25z" clip-rule="evenodd"/><path fill="url(#fluentColorPin241)" d="m21.068 7.758l-4.826-4.826a2.75 2.75 0 0 0-4.404.715l-2.435 4.87a.75.75 0 0 1-.426.374l-4.166 1.44a1.25 1.25 0 0 0-.476 2.065l7.27 7.27a1.25 1.25 0 0 0 2.065-.477l1.44-4.166a.75.75 0 0 1 .373-.426l4.87-2.435a2.75 2.75 0 0 0 .715-4.404"/><path fill="url(#fluentColorPin242)" fill-opacity="1" d="m21.068 7.758l-4.826-4.826a2.75 2.75 0 0 0-4.404.715l-2.435 4.87a.75.75 0 0 1-.426.374l-4.166 1.44a1.25 1.25 0 0 0-.476 2.065l7.27 7.27a1.25 1.25 0 0 0 2.065-.477l1.44-4.166a.75.75 0 0 1 .373-.426l4.87-2.435a2.75 2.75 0 0 0 .715-4.404"/><defs><linearGradient id="fluentColorPin240" x1="4.633" x2="9.496" y1="19.367" y2="15.648" gradientUnits="userSpaceOnUse"><stop offset=".449" stop-color="#a1a1a1"/><stop offset="1" stop-color="#841010"/></linearGradient><linearGradient id="fluentColorPin241" x1="4.608" x2="16.965" y1="5.483" y2="18.322" gradientUnits="userSpaceOnUse"><stop stop-color="#e54343"/><stop offset="1" stop-color="#af1212"/></linearGradient><radialGradient id="fluentColorPin242" cx="0" cy="0" r="1" gradientTransform="rotate(47.579 -9.812 28.432)scale(7.95948 19.9685)" gradientUnits="userSpaceOnUse"><stop stop-color="#ce6969"/><stop offset="1" stop-color="#772828" stop-opacity="0"/></radialGradient></defs></g></svg> Краткое содержание</div>
                    <div class="lzt-summary-content">${summary || 'Не удалось создать краткое содержание.'}</div>
                    <div class="lzt-reading-time"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32"><g fill="none"><path fill="#7d4533" d="M16.81 30.04V23.4L14.5 22l-2.67 1.4v6.64z"/><path fill="#5092ff" d="M21.65 7H7.84L11 23.61h14.99a1.5 1.5 0 0 0 1.5-1.5v-9.27C27.48 9.61 24.87 7 21.65 7"/><path fill="#3f5fff" d="M7.84 7C4.61 7 2 9.61 2 12.84v9.27a1.5 1.5 0 0 0 1.5 1.5h8.67a1.5 1.5 0 0 0 1.5-1.5v-9.27C13.67 9.61 11.06 7 7.84 7"/><path fill="#1345b7" d="M9.27 20H4.98c-.54 0-.98.44-.98.98s.44.98.98.98h4.29c.54 0 .98-.44.98-.98a.97.97 0 0 0-.98-.98"/><path fill="#f92f60" d="M30 19.132v-5.264c0-.475-.369-.868-.816-.868h-2.369c-.446 0-.815.393-.815.868v5.263c0 .476.369.869.816.869h2.369c.446 0 .815-.393.815-.869"/><path fill="#d3d3d3" d="M20.516 14.63A2.42 2.42 0 0 1 16 13.42a2.42 2.42 0 0 1 4.516-1.21h8.904c.67 0 1.21.54 1.21 1.21s-.54 1.21-1.21 1.21z"/></g></svg> Примерное время чтения: ${readingTime} (оригинал) / ${summaryReadingTime} (резюме)</div>
                `;

                if (keyPoints.length > 0) {
                    summaryHTML += `
                        <div class="lzt-key-points">
                            <div class="lzt-key-points-title"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><g fill="none"><g filter="url(#f1543id9)"><path fill="url(#f1543id0)" d="m6.118 26.455l5.047-5.047l3.21 3.211a1.286 1.286 0 0 1-1.039 2.19l-1.08-.11a.87.87 0 0 0-.954.931l.084 1.072a1.214 1.214 0 0 1-2.069.952z"/></g><g filter="url(#f1543ida)"><path fill="url(#f1543id1)" d="m16.397 12.172l3.407 3.406L6.865 28.516a2.409 2.409 0 0 1-3.406-3.407z"/></g><g filter="url(#f1543idb)"><path fill="url(#f1543id2)" fill-rule="evenodd" d="M21.882 18a7.969 7.969 0 1 0 0-15.937a7.969 7.969 0 0 0 0 15.937m0-4a3.969 3.969 0 1 0 0-7.937a3.969 3.969 0 0 0 0 7.937" clip-rule="evenodd"/></g><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543id3)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543idd)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543id4)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543id5)" rx=".764" transform="rotate(45 14.36 13.162)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543ide)" rx=".764" transform="rotate(45 14.36 13.162)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543id6)" rx=".764" transform="rotate(45 14.36 13.162)"/><g filter="url(#f1543idc)"><circle cx="22.309" cy="9.604" r="6.309" stroke="url(#f1543id7)" stroke-width="1.25"/><circle cx="22.309" cy="9.604" r="6.309" stroke="url(#f1543id8)" stroke-width="1.25"/></g><defs><linearGradient id="f1543id0" x1="11.632" x2="9.632" y1="27.875" y2="25.709" gradientUnits="userSpaceOnUse"><stop stop-color="#f4b954"/><stop offset=".908" stop-color="#eca84f"/></linearGradient><linearGradient id="f1543id1" x1="8.038" x2="11.279" y1="21.031" y2="24.188" gradientUnits="userSpaceOnUse"><stop stop-color="#f7c250"/><stop offset="1" stop-color="#f8ab54"/></linearGradient><linearGradient id="f1543id2" x1="21.882" x2="21.882" y1="2.813" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#f8cf4d"/><stop offset="1" stop-color="#ed9953"/></linearGradient><linearGradient id="f1543id3" x1="14.087" x2="18.329" y1="15.107" y2="15.152" gradientUnits="userSpaceOnUse"><stop stop-color="#f6bf4e"/><stop offset="1" stop-color="#ea994d"/></linearGradient><linearGradient id="f1543id4" x1="16.683" x2="16.678" y1="15.98" y2="15.322" gradientUnits="userSpaceOnUse"><stop offset=".186" stop-color="#e29226"/><stop offset="1" stop-color="#ec9b4f" stop-opacity="0"/></linearGradient><linearGradient id="f1543id5" x1="15.167" x2="19.41" y1="14.027" y2="14.071" gradientUnits="userSpaceOnUse"><stop stop-color="#f6bf4e"/><stop offset="1" stop-color="#ea994d"/></linearGradient><linearGradient id="f1543id6" x1="17.764" x2="17.759" y1="14.9" y2="14.241" gradientUnits="userSpaceOnUse"><stop offset=".186" stop-color="#e29226"/><stop offset="1" stop-color="#e29226" stop-opacity="0"/></linearGradient><linearGradient id="f1543id7" x1="27.32" x2="21.468" y1="4.298" y2="9.259" gradientUnits="userSpaceOnUse"><stop stop-color="#ffdd67"/><stop offset="1" stop-color="#ffdd67" stop-opacity="0"/></linearGradient><linearGradient id="f1543id8" x1="17.632" x2="19.007" y1="14" y2="11.813" gradientUnits="userSpaceOnUse"><stop stop-color="#feb765"/><stop offset="1" stop-color="#feb765" stop-opacity="0"/></linearGradient><filter id="f1543id9" width="8.635" height="8.752" x="6.118" y="21.258" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.15"/><feGaussianBlur stdDeviation=".25"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.839216 0 0 0 0 0.592157 0 0 0 0 0.34902 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543ida" width="17.049" height="17.549" x="2.754" y="11.672" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.5"/><feGaussianBlur stdDeviation=".75"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.85098 0 0 0 0 0.541176 0 0 0 0 0.34902 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543idb" width="15.938" height="16.337" x="13.913" y="1.663" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.4"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.815686 0 0 0 0 0.505882 0 0 0 0 0.337255 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543idc" width="16.368" height="16.368" x="14.125" y="1.42" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_18_23735" stdDeviation=".625"/></filter><radialGradient id="f1543idd" cx="0" cy="0" r="1" gradientTransform="matrix(-.01573 .32677 -1.89283 -.09112 16.743 14.626)" gradientUnits="userSpaceOnUse"><stop stop-color="#fcbc66"/><stop offset="1" stop-color="#fcbc66" stop-opacity="0"/></radialGradient><radialGradient id="f1543ide" cx="0" cy="0" r="1" gradientTransform="matrix(-.01573 .32677 -1.89283 -.09112 17.823 13.545)" gradientUnits="userSpaceOnUse"><stop stop-color="#fbb865"/><stop offset="1" stop-color="#fbb865" stop-opacity="0"/></radialGradient></defs></g></svg> Ключевые моменты:</div>
                            ${keyPoints.map(point => `<div class="lzt-key-point">${point}</div>`).join('')}
                        </div>
                    `;
                } else {
                    summaryHTML += `
                        <div class="lzt-key-points">
                            <div class="lzt-key-points-title"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><g fill="none"><g filter="url(#f1543id9)"><path fill="url(#f1543id0)" d="m6.118 26.455l5.047-5.047l3.21 3.211a1.286 1.286 0 0 1-1.039 2.19l-1.08-.11a.87.87 0 0 0-.954.931l.084 1.072a1.214 1.214 0 0 1-2.069.952z"/></g><g filter="url(#f1543ida)"><path fill="url(#f1543id1)" d="m16.397 12.172l3.407 3.406L6.865 28.516a2.409 2.409 0 0 1-3.406-3.407z"/></g><g filter="url(#f1543idb)"><path fill="url(#f1543id2)" fill-rule="evenodd" d="M21.882 18a7.969 7.969 0 1 0 0-15.937a7.969 7.969 0 0 0 0 15.937m0-4a3.969 3.969 0 1 0 0-7.937a3.969 3.969 0 0 0 0 7.937" clip-rule="evenodd"/></g><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543id3)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543idd)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="13.28" y="14.242" fill="url(#f1543id4)" rx=".764" transform="rotate(45 13.28 14.242)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543id5)" rx=".764" transform="rotate(45 14.36 13.162)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543ide)" rx=".764" transform="rotate(45 14.36 13.162)"/><rect width="6.165" height="1.528" x="14.361" y="13.162" fill="url(#f1543id6)" rx=".764" transform="rotate(45 14.36 13.162)"/><g filter="url(#f1543idc)"><circle cx="22.309" cy="9.604" r="6.309" stroke="url(#f1543id7)" stroke-width="1.25"/><circle cx="22.309" cy="9.604" r="6.309" stroke="url(#f1543id8)" stroke-width="1.25"/></g><defs><linearGradient id="f1543id0" x1="11.632" x2="9.632" y1="27.875" y2="25.709" gradientUnits="userSpaceOnUse"><stop stop-color="#f4b954"/><stop offset=".908" stop-color="#eca84f"/></linearGradient><linearGradient id="f1543id1" x1="8.038" x2="11.279" y1="21.031" y2="24.188" gradientUnits="userSpaceOnUse"><stop stop-color="#f7c250"/><stop offset="1" stop-color="#f8ab54"/></linearGradient><linearGradient id="f1543id2" x1="21.882" x2="21.882" y1="2.813" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#f8cf4d"/><stop offset="1" stop-color="#ed9953"/></linearGradient><linearGradient id="f1543id3" x1="14.087" x2="18.329" y1="15.107" y2="15.152" gradientUnits="userSpaceOnUse"><stop stop-color="#f6bf4e"/><stop offset="1" stop-color="#ea994d"/></linearGradient><linearGradient id="f1543id4" x1="16.683" x2="16.678" y1="15.98" y2="15.322" gradientUnits="userSpaceOnUse"><stop offset=".186" stop-color="#e29226"/><stop offset="1" stop-color="#ec9b4f" stop-opacity="0"/></linearGradient><linearGradient id="f1543id5" x1="15.167" x2="19.41" y1="14.027" y2="14.071" gradientUnits="userSpaceOnUse"><stop stop-color="#f6bf4e"/><stop offset="1" stop-color="#ea994d"/></linearGradient><linearGradient id="f1543id6" x1="17.764" x2="17.759" y1="14.9" y2="14.241" gradientUnits="userSpaceOnUse"><stop offset=".186" stop-color="#e29226"/><stop offset="1" stop-color="#e29226" stop-opacity="0"/></linearGradient><linearGradient id="f1543id7" x1="27.32" x2="21.468" y1="4.298" y2="9.259" gradientUnits="userSpaceOnUse"><stop stop-color="#ffdd67"/><stop offset="1" stop-color="#ffdd67" stop-opacity="0"/></linearGradient><linearGradient id="f1543id8" x1="17.632" x2="19.007" y1="14" y2="11.813" gradientUnits="userSpaceOnUse"><stop stop-color="#feb765"/><stop offset="1" stop-color="#feb765" stop-opacity="0"/></linearGradient><filter id="f1543id9" width="8.635" height="8.752" x="6.118" y="21.258" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.15"/><feGaussianBlur stdDeviation=".25"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.839216 0 0 0 0 0.592157 0 0 0 0 0.34902 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543ida" width="17.049" height="17.549" x="2.754" y="11.672" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.5"/><feGaussianBlur stdDeviation=".75"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.85098 0 0 0 0 0.541176 0 0 0 0 0.34902 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543idb" width="15.938" height="16.337" x="13.913" y="1.663" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.4"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.815686 0 0 0 0 0.505882 0 0 0 0 0.337255 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18_23735"/></filter><filter id="f1543idc" width="16.368" height="16.368" x="14.125" y="1.42" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_18_23735" stdDeviation=".625"/></filter><radialGradient id="f1543idd" cx="0" cy="0" r="1" gradientTransform="matrix(-.01573 .32677 -1.89283 -.09112 16.743 14.626)" gradientUnits="userSpaceOnUse"><stop stop-color="#fcbc66"/><stop offset="1" stop-color="#fcbc66" stop-opacity="0"/></radialGradient><radialGradient id="f1543ide" cx="0" cy="0" r="1" gradientTransform="matrix(-.01573 .32677 -1.89283 -.09112 17.823 13.545)" gradientUnits="userSpaceOnUse"><stop stop-color="#fbb865"/><stop offset="1" stop-color="#fbb865" stop-opacity="0"/></radialGradient></defs></g></svg> Ключевые моменты:</div>
                            <div class="lzt-key-point">Не удалось выделить ключевые моменты.</div>
                        </div>
                    `;
                }

                summaryElement.innerHTML = summaryHTML;
                contentElement.parentNode.insertBefore(summaryElement, contentElement.nextSibling);
                summaryButton.textContent = '❌ Скрыть резюме';

                contentElement.style.height = '0';
                contentElement.style.opacity = '0';

                setTimeout(() => {
                    isProcessing = false;
                }, settings.animationSpeed);
            }
        });

        contentElement.parentNode.insertBefore(summaryButton, contentElement);

        setTimeout(() => {
            summaryButton.style.opacity = '1';
        }, 100);
    }

    function summarizeMainArticle() {
        const firstPost = document.querySelector('li.message.firstPost');
        if (!firstPost) {
            alert('Не удалось найти основную статью на странице.');
            return;
        }

        const contentElement = firstPost.querySelector('.messageContent');
        if (!contentElement) {
            alert('Не удалось найти содержимое статьи.');
            return;
        }

        const fullText = getTextContent(contentElement);
        const summary = summarizeText(fullText);
        const keyPoints = extractKeyPoints(fullText);
        const readingTime = formatReadingTime(fullText);
        const summaryReadingTime = formatReadingTime(summary);

        let popupContent = `
            <div class="lzt-summary-title">📝 Краткое содержание статьи</div>
            <div class="lzt-summary-content">${summary || 'Не удалось создать краткое содержание.'}</div>
            <div class="lzt-reading-time"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32"><g fill="none"><path fill="#7d4533" d="M16.81 30.04V23.4L14.5 22l-2.67 1.4v6.64z"/><path fill="#5092ff" d="M21.65 7H7.84L11 23.61h14.99a1.5 1.5 0 0 0 1.5-1.5v-9.27C27.48 9.61 24.87 7 21.65 7"/><path fill="#3f5fff" d="M7.84 7C4.61 7 2 9.61 2 12.84v9.27a1.5 1.5 0 0 0 1.5 1.5h8.67a1.5 1.5 0 0 0 1.5-1.5v-9.27C13.67 9.61 11.06 7 7.84 7"/><path fill="#1345b7" d="M9.27 20H4.98c-.54 0-.98.44-.98.98s.44.98.98.98h4.29c.54 0 .98-.44.98-.98a.97.97 0 0 0-.98-.98"/><path fill="#f92f60" d="M30 19.132v-5.264c0-.475-.369-.868-.816-.868h-2.369c-.446 0-.815.393-.815.868v5.263c0 .476.369.869.816.869h2.369c.446 0 .815-.393.815-.869"/><path fill="#d3d3d3" d="M20.516 14.63A2.42 2.42 0 0 1 16 13.42a2.42 2.42 0 0 1 4.516-1.21h8.904c.67 0 1.21.54 1.21 1.21s-.54 1.21-1.21 1.21z"/></g></svg> Примерное время чтения: ${readingTime} (оригинал) / ${summaryReadingTime} (резюме)</div>
        `;

        if (keyPoints.length > 0) {
            popupContent += `
                <div class="lzt-key-points">
                    <div class="lzt-key-points-title">🔑 Ключевые моменты:</div>
                    ${keyPoints.map(point => `<div class="lzt-key-point">${point}</div>`).join('')}
                </div>
            `;
        } else {
            popupContent += `
                <div class="lzt-key-points">
                    <div class="lzt-key-points-title">🔑 Ключевые моменты:</div>
                    <div class="lzt-key-point">Не удалось выделить ключевые моменты.</div>
                </div>
            `;
        }

        createPopup(popupContent);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    GM_registerMenuCommand("LZT Резюме статьи", debounce(summarizeMainArticle, 300));
    GM_registerMenuCommand("Настройки LZT Summarizer", debounce(createSettingsMenu, 300));

    updateStyles();

    window.addEventListener('load', function() {
        const firstPost = document.querySelector('li.message.firstPost');
        if (firstPost) {
            addSummaryButton(firstPost);
        }
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.matches('li.message.firstPost')) {
                        addSummaryButton(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();