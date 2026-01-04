// ==UserScript==
// @name         Пересечения
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Создать кнопку для перехода на другой URL
// @author       You
// @match        https://admin.adeo.pro/admin/supplier/price/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525038/%D0%9F%D0%B5%D1%80%D0%B5%D1%81%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525038/%D0%9F%D0%B5%D1%80%D0%B5%D1%81%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function showSrokiModal() {
        const rows = document.querySelectorAll('tr.jqgrow');
        const rowData = [];

        rows.forEach(row => {
            const cella = row.querySelector('td[aria-describedby="supplier_price_unique_supplier_cella"]');
            const nFile = row.querySelector('td[aria-describedby="supplier_price_unique_n_file"]');

            if (cella && nFile) {
                const text = `${cella.textContent.trim()}/${nFile.textContent.trim()}`;
                rowData.push(text);
            }
        });

        console.log('Собранные ключи:', rowData);

        // Запрашиваем словарь "Склад: Сроки" с сервера
        let srokiDict = {};
        try {
            const url = 'https://192.168.3.19:6001/sroki';
            console.log('[fetch] Отправляем запрос к серверу:', url);

            const response = await fetch(url);
            console.log('[fetch] Статус ответа:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[fetch] Ошибка от сервера:', errorText);
                throw new Error(`Ошибка ${response.status}: ${errorText}`);
            }

            srokiDict = await response.json();
            console.log('[fetch] Успешно получены данные:', srokiDict);
        } catch (err) {
            console.error('[fetch] Не удалось получить сроки с сервера:', err);
            alert('❌ Не удалось загрузить сроки с сервера. Подробности в консоли (F12 → Console).');
        }


        // Модалка
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'relative',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '6px',
            maxWidth: '600px',
            width: '90%',
            boxSizing: 'border-box'
        });

        const title = document.createElement('h2');
        title.textContent = 'Сроки';
        modal.appendChild(title);

        const tableContainer = document.createElement('div');
        Object.assign(tableContainer.style, {
            maxHeight: '600px',
            overflowY: 'auto',
            marginBottom: '20px'
        });

        const table = document.createElement('table');
        Object.assign(table.style, {
            borderCollapse: 'collapse',
            width: '100%'
        });

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Cella/Склад';
        const th2 = document.createElement('th');
        th2.textContent = 'Срок';

        [th1, th2].forEach(th => {
            th.style.border = '1px solid #ccc';
            th.style.padding = '8px';
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        rowData.forEach(key => {
            const tr = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = key;
            td1.style.border = '1px solid #ccc';
            td1.style.padding = '8px';

            const td2 = document.createElement('td');
            td2.textContent = srokiDict[key] || '—'; // если нет соответствия — прочерк
            td2.style.border = '1px solid #ccc';
            td2.style.padding = '8px';

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        modal.appendChild(tableContainer);

        const closeIcon = document.createElement('span');
        closeIcon.textContent = '×';
        Object.assign(closeIcon.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold'
        });
        closeIcon.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        modal.appendChild(closeIcon);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    const buttonConfigs = [
        {
            text: 'Сроки',
            onClick: showSrokiModal,
            style: {
                display: 'inline-block',
                width: '200px',
                height: '50px',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '10px'
            }
        },
        {
            text: 'Новый прайс',
            onClick: () => {
                window.location.href = 'https://admin.adeo.pro/admin/supplier/price/comparemode/43068/1';
            },
            style: {
                display: 'inline-block',
                width: '200px',
                height: '50px',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '10px'
            }
        }
    ];

    const targetElement = document.querySelector('.form-horizontal');
    if (!targetElement) return;

    buttonConfigs.forEach(({ text, onClick, style }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = text;
        Object.assign(button.style, style);
        button.addEventListener('click', onClick);
        targetElement.insertBefore(button, targetElement.firstChild);
    });

})();


    // Чекбокс остаток
(function () {
    'use strict';

    // Функция для активации чекбокса с текстом "Остаток"
    function activateCheckboxWithText(text) {
        // Находим все лейблы с чекбоксами
        const labels = document.querySelectorAll('.checkbox label');

        for (const label of labels) {
            if (label.textContent.trim() === text) {
                // Находим чекбокс внутри данного лейбла
                const checkboxDiv = label.querySelector('.icheckbox_minimal');
                if (checkboxDiv && !checkboxDiv.classList.contains('checked')) {
                    checkboxDiv.click(); // Нажимаем, чтобы активировать чекбокс
                    console.log(`Чекбокс с текстом "${text}" активирован.`);
                    return true;
                } else {
                    console.log(`Чекбокс с текстом "${text}" уже активирован.`);
                    return false;
                }
            }
        }

        console.log(`Чекбокс с текстом "${text}" не найден.`);
        return false;
    }

    // Периодически проверяем наличие и активацию чекбокса каждые 500 мс
    const intervalId = setInterval(() => {
        const checkboxActivated = activateCheckboxWithText('Остаток');

        // Если чекбокс активирован или не найден, останавливаем интервал
        if (checkboxActivated) {
            clearInterval(intervalId);
        }
    }, 500); // Проверка каждые 500 мс
})();

    // Больше пересечений
(function() {
    'use strict';

    // Функция для обновления значений выпадающего списка
    function updateDropdownValues(dropdown) {
        // Проверяем, если список уже обновлен, чтобы избежать повторного изменения
        if (dropdown.dataset.updated) return;

        // Очищаем текущие значения и добавляем новые
        dropdown.innerHTML = "";
        const newOptions = [10, 50, 100, 500, 1000, 3000, 5000, 10000];
        newOptions.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            dropdown.appendChild(option);
        });

        dropdown.dataset.updated = "true"; // Помечаем, что список обновлен
        console.log("Выпадающий список обновлен");
    }

    // Функция для поиска и обновления всех подходящих выпадающих списков
    function findAndUpdateDropdowns() {
        const dropdowns = document.querySelectorAll('select.ui-pg-selbox');
        dropdowns.forEach(updateDropdownValues);
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(findAndUpdateDropdowns);

    // Настраиваем наблюдение за всем документом
    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализируем первую проверку, если список уже есть на странице
    findAndUpdateDropdowns();
})();

    // Копир заголовков
(function() {
    'use strict';

    // Функция для добавления кнопок в каждую строку
    function addCopyButtons() {
        // Ищем все строки с классом jqgrow
        const rows = document.querySelectorAll('tr.jqgrow');

        rows.forEach(row => {
            // Проверяем, есть ли уже кнопка в строке, чтобы не добавлять ее повторно
            if (row.querySelector(".copy-button")) return;

            // Получаем нужные данные из ячеек строки
            const cella = row.querySelector('td[aria-describedby="supplier_price_unique_supplier_cella"]');
            const nFile = row.querySelector('td[aria-describedby="supplier_price_unique_n_file"]');
            const fullname = row.querySelector('td[aria-describedby="supplier_price_unique_supplier_fullname"]');
            const cnt = row.querySelector('td[aria-describedby="supplier_price_unique_cnt"]');
            const prcDup = row.querySelector('td[aria-describedby="supplier_price_unique_prc_dup"]');

            if (cella && nFile && fullname && cnt && prcDup) {
                // Форматируем текст для копирования
                const textToCopy = `${cella.textContent}/${nFile.textContent} (${cnt.textContent}) ${prcDup.textContent}%`;

                // Создаем кнопку
                const copyButton = document.createElement("button");
                copyButton.className = "copy-button";
                copyButton.innerText = "Скопировать в буфер";
                copyButton.style.marginLeft = "10px";
                copyButton.style.cursor = "pointer";
                copyButton.style.float = "right"; // Выровнять кнопку по правому краю

                // Добавляем обработчик клика на кнопку
                copyButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        console.log(`Скопировано: ${textToCopy}`);
                    }).catch(err => {
                        console.error("Ошибка копирования: ", err);
                    });
                });

                // Настраиваем ячейку для размещения текста и кнопки справа
                fullname.style.display = "flex";
                fullname.style.justifyContent = "space-between";
                fullname.style.alignItems = "center";

                // Вставляем кнопку в ячейку с полным именем
                fullname.appendChild(copyButton);
            }
        });
    }

    // Используем MutationObserver для отслеживания появления новых строк
    const observer = new MutationObserver(addCopyButtons);

    // Наблюдаем за изменениями в документе
    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализируем первую проверку
    addCopyButtons();

})();

    // Копир пересечений
(function() {
    'use strict';

    // Функция для добавления кнопки в заголовок
    function addCopyHeaderButton(header) {
        if (!header.querySelector(".copy-header-button")) {
            // Создаем кнопку "Копировать пересечения"
            const copyHeaderButton = document.createElement("button");
            copyHeaderButton.className = "copy-header-button";
            copyHeaderButton.innerText = "Копировать пересечения";

            // Стили для кнопки
            copyHeaderButton.style.cursor = "pointer";
            copyHeaderButton.style.padding = "5px 10px";
            copyHeaderButton.style.backgroundColor = "white";
            copyHeaderButton.style.border = "1px solid #333";
            copyHeaderButton.style.borderRadius = "4px";
            copyHeaderButton.style.color = "#333";
            copyHeaderButton.style.fontWeight = "bold";
            copyHeaderButton.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";
            copyHeaderButton.style.transition = "background-color 0.3s, transform 0.1s";

            // Эффекты при наведении и нажатии
            copyHeaderButton.onmouseover = () => copyHeaderButton.style.backgroundColor = "#f0f0f0";
            copyHeaderButton.onmouseout = () => copyHeaderButton.style.backgroundColor = "white";
            copyHeaderButton.onmousedown = () => copyHeaderButton.style.transform = "scale(0.95)";
            copyHeaderButton.onmouseup = () => copyHeaderButton.style.transform = "scale(1)";

            // Обработчик для копирования данных таблицы в текущем блоке
            copyHeaderButton.addEventListener("click", () => {
                // Находим таблицу данных, связанную с заголовком
                const dataTable = header.closest('.subgrid-data').querySelector('table.ui-jqgrid-btable');
                if (!dataTable) return;

                let textToCopy = "";
                const rows = dataTable.querySelectorAll('tr.jqgrow');

                rows.forEach(row => {
                    const cells = [
                        row.querySelector('td[aria-describedby*="pn_clean"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cbg_group_code"]')?.innerText || "",
                        "",  // Дополнительный пустой табулятор
                        row.querySelector('td[aria-describedby*="p_pn_draft"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="p_pn_price_desc"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="p_cost_eval"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="p_remains"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cp_pn_draft"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cp_pn_price_desc"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cp_cost_eval"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cp_cost_eval_diff"]')?.innerText || "",
                        row.querySelector('td[aria-describedby*="cp_remains"]')?.innerText || ""
                    ];

                    textToCopy += cells.join("\t") + "\n";
                });

                navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                    console.log("Данные успешно скопированы в буфер обмена");
                }).catch(err => {
                    console.error("Ошибка копирования: ", err);
                });
            });

            // Заменяем текст заголовка на кнопку
            header.innerHTML = "";
            header.appendChild(copyHeaderButton);
            console.log("Кнопка 'Копировать пересечения' добавлена в заголовок");
        }
    }

    // Функция для поиска всех заголовков и добавления кнопки
    function findAndAddButtons() {
        const headers = document.querySelectorAll('th[role="columnheader"][colspan="3"]');
        headers.forEach(header => {
            if (header.innerText.includes("Топ 500 позиций")) {
                addCopyHeaderButton(header);
            }
        });
    }

    // Используем MutationObserver для отслеживания появления новых заголовков
    const observer = new MutationObserver(findAndAddButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализируем первую проверку
    findAndAddButtons();

})();

    // Увеличение рабочей области
(function() {
    'use strict';

    // Функция для увеличения высоты элемента рабочей области
    function increaseWorkAreaHeight(element) {
        if (element && element.style.height !== "750px") {
            element.style.height = "750px";
            console.log("Высота рабочей области увеличена до 750px");
        }
    }

    // Функция для поиска элемента рабочей области
    function findAndIncreaseWorkArea() {
        const workArea = document.querySelector('div.ui-jqgrid-bdiv');
        if (workArea) {
            increaseWorkAreaHeight(workArea);
        }
    }

    // Создаем наблюдатель для отслеживания появления рабочей области
    const observer = new MutationObserver(findAndIncreaseWorkArea);

    // Наблюдаем за всем документом на случай, если элемент добавляется динамически
    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализируем первую проверку на случай, если элемент уже присутствует
    findAndIncreaseWorkArea();
})();
