// ==UserScript==
// @name         Выпадающие списки для HSPM
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Добавляет HTML5 datalist для полей instance/dit.additional.field.15 и instance/hpc.additional.field.1.
// @author       Reqwiem Никита
// @match        https://sm.mos.ru/sm/index.do*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/530461/%D0%92%D1%8B%D0%BF%D0%B0%D0%B4%D0%B0%D1%8E%D1%89%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20HSPM.user.js
// @updateURL https://update.greasyfork.org/scripts/530461/%D0%92%D1%8B%D0%BF%D0%B0%D0%B4%D0%B0%D1%8E%D1%89%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20HSPM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Жёстко заданные значения для поля instance/dit.additional.field.15
    const defaultOptionsField15 = [
        "Отчеты",
        "Работа касс",
        "Кассовый отчет",
        "публикация на mos.ru",
        "Актуализация/редактирование информации",
        "Настройка Билетов",
        "Управление доступом",
        "Консультация",
        "Мероприятия - настройка",
        "Мероприятия - ошибки",
        "Каналы продаж - настройка",
        "Каналы продаж - ошибки",
        "Схема зала - настройка",
        "Схема зала - ошибки",
        "Виджет",
        "Москвенок",
        "Пушкинская карта",
        "Комплексный билет",
        "КиС Консультация",
        "КиС ошибки",
        "ДО Консультация",
        "ДО ошибки",
        "Театры Заполнения",
        "Театры Ошибки",
        "Мобильное приложение Ошибки работы",
        "Мобильное приложение Консультация работы",
        "Аренда консультация",
        "Аренда Ошибки",
        "Режимы работы",
        "Работа с билетами",
        "Чеки прихода, возврата",
        "Сервисные работы внешних ИС",
        "Кассир.Ру",
        "Частное лицо"
    ];

    // Заводские значения для поля instance/hpc.additional.field.1 (с сохранением)
    const defaultOptionsField1 = ["Имя твоё, измени параметр нажатием на расширение"];
    let optionsField1 = GM_getValue('optionsField1', defaultOptionsField1.slice());

    // Функция для прикрепления datalist к input-полю
    function attachDatalistToField(field, options, doc) {
        if (!field) return;
        const safeId = field.getAttribute('name').replace(/[^a-z0-9]/gi, '_');
        const datalistId = `datalist_${safeId}`;

        // Добавляем текущее значение в начало списка, если его нет
        const currentValue = field.value;
        if (currentValue && !options.includes(currentValue)) {
            options.unshift(currentValue);
        }

        // Если datalist ещё не создан — создаём и наполняем опциями
        let datalist = doc.getElementById(datalistId);
        if (!datalist) {
            datalist = doc.createElement('datalist');
            datalist.id = datalistId;
            options.forEach(val => {
                const opt = doc.createElement('option');
                opt.value = val;
                datalist.appendChild(opt);
            });
            doc.body.appendChild(datalist);
        }
        // Привязываем к полю
        if (field.getAttribute('list') !== datalistId) {
            field.setAttribute('list', datalistId);
        }
    }

    // Обработка документа (основного или iframe)
    function processDoc(doc) {
        const fields = doc.querySelectorAll(
            'input[name="instance/dit.additional.field.15"], input[name="instance/hpc.additional.field.1"]'
        );
        fields.forEach(field => {
            const name = field.getAttribute('name');
            if (name === "instance/dit.additional.field.15") {
                // Всегда используем жестко заданный список
                attachDatalistToField(field, defaultOptionsField15.slice(), doc);
            } else {
                // Для поля 1 — с возможностью редактирования
                attachDatalistToField(field, optionsField1.slice(), doc);
            }
        });
    }

    // Пробегаем по документу и всем iframe
    function processFrames() {
        processDoc(document);
        document.querySelectorAll('iframe').forEach(frame => {
            try {
                const fd = frame.contentDocument || frame.contentWindow.document;
                processDoc(fd);
            } catch (e) {
                console.warn('Нет доступа к iframe:', e);
            }
        });
    }

    // Регулярный запуск и наблюдатели на динамические изменения
    setInterval(processFrames, 1000);
    new MutationObserver(processFrames).observe(document.body, { childList: true, subtree: true });
    setInterval(() => {
        document.querySelectorAll('iframe').forEach(frame => {
            frame.addEventListener('load', () => {
                try {
                    const fd = frame.contentDocument || frame.contentWindow.document;
                    processDoc(fd);
                    new MutationObserver(() => processDoc(fd))
                        .observe(fd.body, { childList: true, subtree: true });
                } catch (e) {
                    console.warn('Ошибка доступа к iframe после загрузки', e);
                }
            });
        });
    }, 2000);

    // Редактирование списка для поля 1
    function editOptionsField1() {
        const input = prompt(
            `Введите список значений для поля 1, разделяя элементы запятой:\n(например: 'Первый','Второй')`,
            optionsField1.map(v => `'${v}'`).join(',')
        );
        if (input !== null) {
            optionsField1 = input
                .split(/,(?=(?:[^']*'[^']*')*[^']*$)/)
                .map(item => item.trim().replace(/^'|'$/g, ''))
                .filter(item => item);
            GM_setValue('optionsField1', optionsField1);
            alert(`Список для поля 1 обновлён: ${optionsField1.join(', ')}`);
            processFrames();
        }
    }

    // Сброс до заводских для поля 1
    function resetOptionsField1() {
        if (confirm("Сбросить список для поля 1 до заводских значений?")) {
            optionsField1 = defaultOptionsField1.slice();
            GM_setValue('optionsField1', optionsField1);
            alert("Список поля 1 сброшен.");
            processFrames();
        }
    }

    // Меню: только для поля 1 и общий сброс
    GM_registerMenuCommand("Редактировать список для поля 1", editOptionsField1);
    GM_registerMenuCommand("Сбросить список поля 1 до заводского", resetOptionsField1);

})();
