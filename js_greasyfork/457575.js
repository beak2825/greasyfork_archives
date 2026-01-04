// ==UserScript==
// @name          WME AZ-Checker - UI Addons
// @namespace     https://greasyfork.org/ru/users/160654-waze-ukraine
// @version       2025.07.18.001
// @description   Додаток перекладає елементи меню, заголовки таблиць, кнопки та інші текстові елементи на деяких сторінках Checker. Додає додаткові кнопки "Відкрити всі" та "Приховати всі" на сторінках звіту про помилки. Приховує рядки, що містять "Russia".
// @author        Sapozhnik
// @match         https://checker2.waze.uz/*
// @match         https://checker.waze.uz/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/457575/WME%20AZ-Checker%20-%20UI%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/457575/WME%20AZ-Checker%20-%20UI%20Addons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Переклади мовами ---
    const translations = {
        'en': {
            'Home': 'Home',
            'Statistics': 'Statistics',
            'Last editors': 'Last editors',
            'Settings': 'Settings',
            'Visitors': 'Visitors',
            'Find segment': 'Find segment',
            'Help': 'Help',
            'What\'s New': 'What\'s New',
            'About': 'About',
            'Open All': 'Open All',
            'Hide All': 'Hide All',
            'History': 'History',
            'Country': 'Country',
            'Errors': 'Errors',
            'Loaded (UTC)': 'Loaded (UTC)',
            'Checked (UTC)': 'Checked (UTC)',
            'Countries': 'Countries',
            'Code': 'Code',
            'Issue types': 'Issue types',
            'ToDo': 'ToDo',
            'Total / Visited / Hidden': 'Total / Visited / Hidden',
            'Description': 'Description',
            'Hidden': 'Hidden'
        },
        'uk': {
            'Home': 'Головна',
            'Statistics': 'Статистика',
            'Last editors': 'Останні редактори',
            'Settings': 'Налаштування',
            'Visitors': 'Відвідувачі',
            'Find segment': 'Знайти сегмент',
            'Help': 'Допомога',
            'What\'s New': 'Що нового',
            'About': 'Про нас',
            'Open All': 'Відкрити всі',
            'Hide All': 'Приховати всі',
            'History': 'Історія',
            'Country': 'Країна',
            'Errors': 'Помилки',
            'Loaded (UTC)': 'Завантажено (UTC)',
            'Checked (UTC)': 'Перевірено (UTC)',
            'Countries': 'Країни',
            'Code': 'Код',
            'Issue types': 'Типи проблем',
            'ToDo': 'До виконання',
            'Total / Visited / Hidden': 'Всього / Відвідано / Приховано',
            'Description': 'Опис',
            'Hidden': 'Приховано'
        },
        'ru': {
            'Home': 'Главная',
            'Statistics': 'Статистика',
            'Last editors': 'Последние редакторы',
            'Settings': 'Настройки',
            'Visitors': 'Посетители',
            'Find segment': 'Найти сегмент',
            'Help': 'Помощь',
            'What\'s New': 'Что нового',
            'About': 'О нас',
            'Open All': 'Открыть все',
            'Hide All': 'Скрыть все',
            'History': 'История',
            'Country': 'Страна',
            'Errors': 'Ошибки',
            'Loaded (UTC)': 'Загружено (UTC)',
            'Checked (UTC)': 'Проверено (UTC)',
            'Countries': 'Страны',
            'Code': 'Код',
            'Issue types': 'Типы проблем',
            'ToDo': 'К выполнению',
            'Total / Visited / Hidden': 'Всего / Посещено / Скрыто',
            'Description': 'Описание',
            'Hidden': 'Скрыто'
        }
    };

    // Визначаємо бажану мову користувача
    const userLang = navigator.language.split('-')[0];
    const currentTranslations = translations[userLang] || translations['en'];

    // --- Функція для перекладу елементів, що містять іконки ---
    function translateElementWithIcon(element) {
        const iconElement = element.querySelector('i');
        if (iconElement) {
            // Отримуємо видимий текст елемента, виключаючи текст іконки (якщо такий є)
            // Використання innerText для отримання тільки видимого тексту
            let originalText = element.innerText.replace(iconElement.innerText, '').trim();

            if (currentTranslations[originalText]) {
                const iconHtml = iconElement.outerHTML;
                element.innerHTML = `${iconHtml}${currentTranslations[originalText]}`;
                return true;
            }
        }
        return false;
    }

    // --- Функція для перекладу простих текстових елементів ---
    function translateTextElement(element) {
        // Спеціальна обробка для "ToDo" та "Total / Visited / Hidden"
        // Ми працюємо з текстовими вузлами, щоб уникнути проблем з тегами <br> та <nobr>
        if (element.children.length > 0 && element.querySelector('br') && element.querySelector('nobr')) {
            let firstTextNode = null;
            let nobrElement = null;

            // Шукаємо перший текстовий вузол та елемент <nobr>
            for (let node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0 && !firstTextNode) {
                    firstTextNode = node;
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'NOBR') {
                    nobrElement = node;
                }
            }

            if (firstTextNode && nobrElement) {
                const originalToDoText = firstTextNode.textContent.trim();
                const originalSubText = nobrElement.textContent.trim();

                let translatedToDo = currentTranslations[originalToDoText] || originalToDoText;
                let translatedSub = currentTranslations[originalSubText] || originalSubText;

                firstTextNode.textContent = translatedToDo;
                nobrElement.textContent = translatedSub;
                return true;
            }
        }

        const originalText = element.textContent.trim();
        if (currentTranslations[originalText]) {
            element.textContent = currentTranslations[originalText];
            return true;
        }
        return false;
    }

    // --- Функція для приховування рядків з певним текстом ---
    function hideTableRowsContaining(textToHide) {
        const mainTable = document.querySelector('table.table');
        if (!mainTable) {
            console.warn("Основну таблицю не знайдено, рядки приховати не вдасться.");
            return;
        }

        const tableRows = mainTable.querySelectorAll('tbody tr');
        let hiddenCount = 0;

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(textToHide.toLowerCase())) {
                row.style.display = 'none';
                hiddenCount++;
            }
        });
        if (hiddenCount > 0) {
            console.log(`Приховано ${hiddenCount} рядків, що містять "${textToHide}".`);
        } else {
            console.log(`Рядків, що містять "${textToHide}", не знайдено.`);
        }
    }


    // --- Запуск функцій перекладу та приховування ---

    // Переклад меню
    const menuItems = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
    menuItems.forEach(item => {
        translateElementWithIcon(item);
    });

    // Переклад кнопок "History" та "Settings" (і інших action-btn)
    const actionButtons = document.querySelectorAll('a.action-btn');
    actionButtons.forEach(button => {
        translateElementWithIcon(button);
    });

    // Переклад заголовків таблиці (універсально для всіх th[scope="col"])
    const tableHeaders = document.querySelectorAll('th[scope="col"]');
    tableHeaders.forEach(header => {
        translateTextElement(header);
    });

    // Переклад заголовка "Countries"
    const countriesHeader = document.querySelector('h5.mb-0');
    if (countriesHeader) {
        translateElementWithIcon(countriesHeader);
    }

    // --- Приховування рядків таблиці з "Russia" (тільки на сторінці з таблицею країн) ---
    if (document.querySelector('table.table')) {
        hideTableRowsContaining('Russia');
    }


    // --- Зміна дизайну (застосовується на всіх сторінках) ---
    document.querySelector('body').setAttribute("style", "background-color: #f0f0f3");


    // --- Умовне додавання кнопок "Open All" та "Hide All" (тільки на сторінках errorlist) ---
    if (window.location.pathname.startsWith('/checker/errorlist/')) {

        const sp1 = document.createElement("span");
        sp1.innerHTML = `<span><a href>${currentTranslations['Open All']}</a><br></span>`;
        sp1.onclick = function () { MyFunc() };

        const thead = document.querySelector('thead');
        if (thead) {
            const firstTr = thead.querySelector('tr');
            if (firstTr) {
                const allThInFirstTr = firstTr.querySelectorAll('th');
                if (allThInFirstTr.length > 1) {
                    const secondTh = allThInFirstTr[1];
                    secondTh.insertBefore(sp1, secondTh.firstChild);
                    console.log(`Кнопку '${currentTranslations['Open All']}' вставлено у другий <th>.`);
                } else {
                    console.warn("Could not find a second <th> element in the first <tr> of <thead>.");
                }
            } else {
                console.warn("Could not find the first <tr> element inside <thead>.");
            }
        } else {
            console.warn("Could not find <thead> element on the page. 'Open All' button will not be added.");
        }

        const hide1 = document.createElement("th");
        hide1.innerHTML = `<a href> ${currentTranslations['Hide All']} </a>`;

        const hide2 = document.querySelectorAll('th');
        const hide2_length = hide2.length - 1;

        if (hide2.length > 0) {
            const parentDiv_hide = hide2[hide2_length];
            parentDiv_hide.innerHTML = hide1.innerHTML;
            parentDiv_hide.onclick = function () { MyFunc_hide() };
            console.log(`Кнопку '${currentTranslations['Hide All']}' оброблено.`);
        } else {
            console.warn("No <th> elements found for 'Hide All' button. It might not be added.");
        }

        function MyFunc() {
            Array.from(document.querySelectorAll('a[href$="/0/"][href*="/checker/go_waze"]')).map(i => { i.target = "_blank"; return i }).map(i => { i.click(); return i });
        }

        function MyFunc_hide() {
            Array.from(document.querySelectorAll('a[href*="/hide_element"]')).map(i => { i.target = "_blank"; return i }).map(i => { i.click(); return i });
        }
    }
})();
