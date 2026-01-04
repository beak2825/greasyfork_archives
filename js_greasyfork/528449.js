// ==UserScript==
// @name         ВКонатакте
// @namespace    https://github.com/Loroteber/vkonatakte
// @version      0.2
// @description  Скрипт, который превращает OpenVK и VepurOVK в выдуманную социальную сеть - ВКонатакте
// @author       Loroteber
// @match        *://ovk.to/*
// @match        *://vepurovk.xyz/*
// @match        *://gid.root.sx/*
// @match        *://social.fetbuk.ru/*
// @match        *://furrypurostarshyi.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528449/%D0%92%D0%9A%D0%BE%D0%BD%D0%B0%D1%82%D0%B0%D0%BA%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/528449/%D0%92%D0%9A%D0%BE%D0%BD%D0%B0%D1%82%D0%B0%D0%BA%D1%82%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const replacements = {
        "Моя Страница": "Отаку",
        "Мои Друзья": "Мои Накамы",
        "Мои Фотографии": "Мой Фанарт",
        "Мои Видеозаписи": "Моё Аниме",
        "Мои Аудиозаписи": "Мои OST'ы",
        "Мои Сообщения": "Мои НЯшки",
        "Мои Новости": "Моя Новоc-тян",
        "Мои Заметки": "Мои Фанфики",
        "Мои Группы": "Мои Аниме-клубы",
        "Мои Ответы": "Мой Кавай",
        "Мои Настройки": "Мои НЯстройки",
        "группы": "аниме-клубы",
        "выйти": "дзя нэ",
        "помощь": "отаковать",
        "люди": "анимешники",
        "Онлайн": "в сети ^_^",
        "Все сообщения": "Все НЯ",
        "Приватность": "Секреты^^",
        "Чёрный список": "Дыз Нот",
    };
    function replaceTextInElements() {
        const search_div = document.querySelector('div.header_divider_stick');
        const search = search_div.querySelector('input');
        search.placeholder = "доко ни?";
        const targetElements = document.querySelectorAll('div.sidebar, div.page_header, div.tabs, div.page_yellowheader, span.post-online');
        targetElements.forEach(function(element) {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                for (const [oldText, newText] of Object.entries(replacements)) {
                    if (node.nodeValue.includes(oldText)) {
                        node.nodeValue = node.nodeValue.replace(new RegExp(oldText, 'g'), newText);
                    }
                }
            }
        });
    }
    function removeHeaderNavigationItems() {
        const headerNavigation = document.querySelector('.header_navigation');

        if (headerNavigation) {
            const items = headerNavigation.querySelectorAll('div');

            items.forEach(item => {
                if (item.textContent.trim() === "главная" || item.textContent.trim() === "Поиск") {
                    item.remove();
                }
            });
        } else {
            console.warn('Элемент с классом header_navigation не найден.');
        }
    }
    function trueRules() {
        if (window.location.pathname === '/terms') {
            const customImage = document.querySelector('img.rules-image');
            if (!customImage) {
                const pageContent = document.querySelector('div.page_content');
                const div = document.createElement('div');
                const img = document.createElement('img');
                img.src = "https://raw.githubusercontent.com/Loroteber/vkonatakte/refs/heads/main/sources/wtfisthis.jpg";
                img.style.width = "100%";
                img.classList.add('rules-image');
                pageContent.prepend(img);
            }
    }
    }
    function replaceFavicon() {
        document.querySelector('link[rel="shortcut icon"]').href = "https://raw.githubusercontent.com/Loroteber/vkonatakte/refs/heads/main/sources/favicon.ico";
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                removeHeaderNavigationItems();
                replaceTextInElements();
                replaceFavicon();
                trueRules();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();