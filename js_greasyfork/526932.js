// ==UserScript==
// @name             Универсальные кликабельные номера телефонов на странице (Международные)
// @name:en          Universal Clickable Phone Numbers (International)
// @namespace        http://tampermonkey.net/
// @version          2.6
// @description      Скрипт для замены номеров телефона на кликабельные ссылки, работает с любыми международными номерами на любых страницах.
// @description:en   Script to replace phone numbers with clickable links, works with any international numbers on any pages.
// @author           Coffee_Feather
// @match            *://*/*
// @grant            none
// @noframes
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/526932/%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%BB%D0%B8%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D0%B0%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%28%D0%9C%D0%B5%D0%B6%D0%B4%D1%83%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526932/%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%BB%D0%B8%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D0%B0%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%28%D0%9C%D0%B5%D0%B6%D0%B4%D1%83%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        phonePatterns: [
            {
                type: 'RU_FULL',
                regex: /(?:\+7|8|7)[\s()-]*\d{3}[\s()-]*\d{3}[\s()-]*\d{2}[\s()-]*\d{2}/g,
                minDigits: 11,
                maxDigits: 11,
                normalize: (match) => {
                    let digits = match.replace(/\D/g, '');
                    digits = digits.startsWith('8') ? '+7' + digits.slice(1) : '+7' + digits.slice(1);
                    return digits;
                },
                disabled: false
            },
            {
                type: 'UA_FULL',
                regex: /(?:\+380|380|\+38|38)(?:[\s()-]*\d){9,10}/g,
                minDigits: 12,
                maxDigits: 12,
                normalize: (match) => {
                    let digits = match.replace(/\D/g, '');
                    // Обработка формата +38XX...
                    if (digits.startsWith('38') && digits.length === 10) {
                        return '+380' + digits.slice(2);
                    }
                    // Обработка формата +380XX...
                    if (digits.startsWith('380')) {
                        return '+' + digits;
                    }
                    // Все остальные случаи считаем невалидными
                    return null;
                },
                disabled: false
            },
            {
                type: 'INTERNATIONAL',
                regex: /\+\d{1,4}(?:[\s()-]*\d){6,14}/g, // Разрешены разделители между цифрами
                minDigits: 7, // Минимальная длина: код страны (1-4) + номер (6+)
                maxDigits: 15, // Максимальная длина: код (4) + номер (11)
                normalize: function(match) {
                    const digits = match.replace(/\D/g, '');
                    const codeLength = digits.match(/^\+\d+/)?.[0].length || 0;
                    // Проверка длины номера (без кода страны)
                    const numberLength = digits.length - codeLength;
                    if (numberLength < 6 || numberLength > 11) return null;
                    return digits;
                },
                disabled: true
            }
        ],
        excludedDomains: [''],
        allowedParents: ['DIV', 'SPAN', 'P', 'TD', 'LABEL'],
        forbiddenParents: ['A', 'SCRIPT', 'STYLE', 'TEXTAREA'],
        forbiddenClasses: ['sidebar', 'sidebar__menu-item', 'compose-button', 'settings'],
        debounceTime: 300
    };

    function isForbidden(node) {
        if (!node) return true;

        if (node.classList && config.forbiddenClasses.some(c => node.classList.contains(c))) {
            return true;
        }

        if (config.forbiddenParents.includes(node.tagName)) {
            return true;
        }

        let parent = node.parentNode;
        while (parent && parent !== document.body) {
            if (parent.classList && config.forbiddenClasses.some(c => parent.classList.contains(c))) {
                return true;
            }
            if (config.forbiddenParents.includes(parent.tagName)) {
                return true;
            }
            parent = parent.parentNode;
        }

        return false;
    }

    function safeReplace(textNode) {
        try {
            const text = textNode.nodeValue;
            const parent = textNode.parentNode;

            if (!parent || !config.allowedParents.includes(parent.tagName) || isForbidden(parent)) return;

            const matches = [];

            config.phonePatterns.forEach(pattern => {
                if (pattern.disabled) return; // Пропускаем отключенные модули
                let match;
                const regex = new RegExp(pattern.regex.source, 'g');
                while ((match = regex.exec(text)) !== null) {
                    const [fullMatch] = match;
                    const digitsOnly = fullMatch.replace(/\D/g, '');

                    // Проверка длины для конкретного паттерна
                    const length = digitsOnly.length;
                    if (length < pattern.minDigits || length > pattern.maxDigits) continue;

                    // Нормализация номера
                    const normalized = pattern.normalize(fullMatch);

                    matches.push({
                        original: fullMatch,
                        index: match.index,
                        normalized,
                        type: pattern.type
                    });
                }
            });

            if (matches.length === 0) return;

            // Сортировка и удаление пересечений
            matches.sort((a, b) => a.index - b.index);
            const filteredMatches = [];
            let lastEnd = -1;

            for (const match of matches) {
                if (match.index > lastEnd) {
                    filteredMatches.push(match);
                    lastEnd = match.index + match.original.length;
                }
            }

            // Создание DOM элементов
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            filteredMatches.forEach(({original, index, normalized, type}) => {
                if (index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
                }

                const link = document.createElement('a');
                link.href = `tel:${normalized}`;
                link.dataset.phoneType = type;
                link.style.cssText = 'color: inherit; text-decoration: inherit;';
                link.textContent = original;

                fragment.appendChild(link);
                lastIndex = index + original.length;
            });

            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            parent.replaceChild(fragment, textNode);
        } catch(e) {
            console.error('Phone replace error:', e);
        }
    }

    function processor() {
        // Проверка исключений для домена и всех поддоменов
        const isExcluded = config.excludedDomains.some(domain => {
            const host = location.hostname.toLowerCase();
            const checkDomain = domain.toLowerCase().replace(/^\./, '');

            // Проверка точного совпадения или поддомена
            return host === checkDomain ||
                host.endsWith(`.${checkDomain}`);
        });

        if (isExcluded) {
            console.log('Домен исключен:', location.hostname);
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (isForbidden(node.parentElement)) return NodeFilter.FILTER_REJECT;

                    // Фильтруем отключенные паттерны
                    const activePatterns = config.phonePatterns.filter(p => !p.disabled);
                    return activePatterns.some(pattern => {
                        const regex = new RegExp(pattern.regex.source);
                        return regex.test(node.nodeValue);
                    }) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.reverse().forEach(safeReplace);
    }

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Инициализация
    if (!config.excludedDomains.includes(location.hostname)) {
        processor();
        const debouncedProcessor = debounce(processor, config.debounceTime);
        new MutationObserver(debouncedProcessor).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
})();