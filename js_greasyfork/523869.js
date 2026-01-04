// ==UserScript==
// @name         Маляр 2.0
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Улучшенный скрипт для упрощения работы на Маляре
// @author       signumguilt // vk: https://vk.com/signumguilt, discord: @signumguilt
// @match        https://catwar.net/sniff?creation
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523869/%D0%9C%D0%B0%D0%BB%D1%8F%D1%80%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/523869/%D0%9C%D0%B0%D0%BB%D1%8F%D1%80%2020.meta.js
// ==/UserScript==

/* 
v0.1
Внедрение основных функций на вар: 
- Вывод формы для создания голосований двух видов: обычного и наборного;
- Реализация проверки соответствия работ техническим требованиям для допуска к голосованию;
- Реализация вывода готового сообщения о несоответствиях требованиям: 
- Реализация формирования BB-кода поста с голосованием на основе заполненной формы голосования;
- Реализация автоматической установки соответствующих голосованию тегов поста;
- Реализация автоматического создания соответствующих голосованию тегов поста (для одиночных голосований);
- Реализация автоматического заполнения заголовка и текста опроса поста;
- Реализация формирования текста опроса на основе количества версий в голосовании.
*/

(function () {
    // определение местоположения для новых элементов и их создание
    const form = document.createElement('div');
    form.className = 'form';
    const voteDiv = document.createElement('div');

    const creationForm = document.querySelector('form[id="creation_form"]');
    creationForm.parentNode.insertBefore(voteDiv, creationForm.nextSibling);
    voteDiv.parentNode.insertBefore(form, voteDiv.nextSibling);

    // выбор сайтовых элементов формы создания поста
    const siteCreationText = document.getElementById('creation-text');
    const siteCreationTitle = document.getElementById('creation-title');
    const siteCreationPoll = document.getElementById('creation-poll-add');
    const siteCreationTag = document.querySelector('#tag_add');

    function createBtn(id, value) {
        var input = document.createElement('input');
        input.id = id;
        input.name = id;
        input.type = 'button';
        input.value = value;
        return input;
    };

    var createButton = createBtn('votecreate', 'Создание голосований');
    voteDiv.appendChild(createButton);
    createButton.addEventListener('click', display_form);
    // переключение свойства display у формы создания голосований

    createVoteFormHTML();
    addListeners();

    function createVoteFormHTML() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция createVoteFormHTML');

        var forms = `<div id="vote_form">
        <table>
            <tr class="other">
                <td>
                    <label for="kit">
                        Набор?
                    </label>
                </td>
                <td>
                    <input type="checkbox" id="kit" />
                </td>
            </tr>
            <tr class="form_kit">
                <td>
                    <label for="title_kit">
                        Название набора:
                    </label>
                </td>
                <td>
                    <input type="text" id="title_kit" />
                </td>
            </tr>
            <tr class="form_default">
                <td>
                    <label for="type">
                        Тип объекта:
                    </label>
                </td>
                <td>
                    <select id="type" name="onChangeClearChecks">
                        <option value="item">
                            Предмет
                        </option>
                        <option value="bg">
                            Фон
                        </option>
                        <option value="medal">
                            Медаль
                        </option>
                        <option value="costume">
                            Костюм
                        </option>
                    </select>
                </td>
            </tr>
            <tr class="form_default">
                <td>
                    <label for="title">
                        Название объекта:
                    </label>
                </td>
                <td>
                    <input type="text" id="title" />
                </td>
            </tr>
            <tr class="form_default">
                <td>
                    <label for="objectID">
                        ID объекта:
                    </label>
                </td>
                <td>
                    <input type="number" id="objectID" />
                </td>
            </tr>
            <tr class="form_default">
                <td>

                </td>
                <td>
                <small>
                    Быстрые фоны:
                    <button id="fastBg" value="0"><img></img> Стандартный</button>
                    <button id="fastBg" value="24"><img></img> Воды</button>
                    <button id="fastBg" value="310"><img></img> Город</button>
                    <button id="fastBg" value="1017"> Горы</button>
                    <button id="fastBg" value="200"> ЗП</button>
                    <button id="fastBg" value="7516"> Душевая</button>
                    <button id="fastBg" value="700"> СЛ</button>
                </small>
                </td>
            </tr>
            <tr class="other">
                <td>
                    <label for="belongs">
                        Принадлежность:
                    </label>
                </td>
                <td>
                    <select id="belongs">
                        <option value="-1">
                            общедоступный
                        </option>
                        <option value="1">
                            Озёрная вселенная
                        </option>
                        <option value="2">
                            Вселенная творцов
                        </option>
                        <option value="3">
                            Морская вселенная
                        </option>
                        <option value="6">
                            Одиночки (ОВ)
                        </option>
                        <option value="7">
                            Одиночки (МВ)
                        </option>
                        <option value="28">
                            Домашние
                        </option>
                        <option value="-1">
                            Звёздное племя
                        </option>
                        <option value="-1">
                            Сумрачный лес
                        </option>
                    </select>
                </td>
            </tr>
            <tr class="other">
                <td>
                    <label for="author">
                        Автор:
                    </label>
                </td>
                <td>
                    <input type="text" id="author" placeholder="linkID" />
                </td>
            </tr>
            <tr class="other">
                <td>
                    <label for="end_date">
                        Дата завершения:
                    </label>
                </td>
                <td>
                    <input type="date" id="end_date" />
                    <input type="button" value="+1" id="datePlus" />
                </td>
            </tr>
        </table>
        <input class="form_kit" type="button" value="Добавить объект" id="objectsKit" />
        <table id="versions">
            <!-- добавление версий наборного голосования -->
            <tr class="form_kit">
                <td>
                    Тип
                </td>
                <td>
                    ID объекта
                </td>
                <td>
                    <input type="button" value="Добавить версию" id="versionsKit" />
                </td>
            </tr>
            <tr class="form_kit">
                <td>
                    <select name="type" id="kit_1" data-event="onChangeClearChecksKit">
                        <option value="item">
                            Предмет
                        </option>
                        <option value="medal">
                            Медаль
                        </option>
                        <option value="costume">
                            Костюм
                        </option>
                    </select>
                </td>
                <td>
                    <input type="number" name="current" id="kit_1" />
                </td>
                <!-- td с новыми версиями -->
            </tr>
            <!---->

            <!-- добавление версий обычного голосования -->
            <tr class="form_default">
                <td colspan="2">
                    <input type="button" value="Добавить новую версию" id="addVersion" />
                </td>
            </tr>
            <!---->
        </table>

        <input type="button" value="Сгенерировать голосование" id="createVote" />
        <span id="error_mess" style="display: none;"></span>`
        form.innerHTML = forms;
    }

    function addListeners() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция addListeners');

        var isKit = document.querySelector('#kit');
        isKit.addEventListener('change', change_form);

        var fastBtns = document.querySelectorAll('#fastBg');
        fastBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                fast_bg(this.value);
            });
        });

        var datePlus = document.querySelector('#datePlus');
        datePlus.addEventListener('click', date_plus);

        var addVersion = document.querySelector('#addVersion');
        addVersion.addEventListener('click', versions);

        var objectsKit = document.querySelector('#objectsKit');
        objectsKit.addEventListener('click', objects_kit);

        var versionsKit = document.querySelector('#versionsKit');
        versionsKit.addEventListener('click', versions_kit);

        var onChangeClearChecks = document.querySelector('select[name="onChangeClearChecks"]');
        onChangeClearChecks.addEventListener('change', clear_checks);

        var createVote = document.querySelector('#createVote');
        createVote.addEventListener('click', create_vote);
    }

    const vote_form = document.querySelector('#vote_form')
    const checkbox = document.querySelector('#kit')
    const date = document.querySelector('#end_date')
    const ver_table = document.querySelector('#versions');
    const belongs_input = document.getElementById("belongs");

    const today = new Date();
    today.setDate(today.getDate() + 7);
    const mskOffset = 3 * 60;
    const mskDate = new Date(today.getTime() + (today.getTimezoneOffset() + mskOffset) * 60000);
    const dateString = mskDate.toISOString().split('T')[0];
    date.value = dateString;

    // показ формы
    function display_form() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция display_form');

        form.style.display = 'inherit'
        vote_form.style.display = 'inherit'
    }

    // изменение формы в зависимости от выбранного режима голосования
    function change_form() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция change_form');

        let default_form = document.querySelectorAll('.form_default')
        let kit_form = document.querySelectorAll('.form_kit')
        if (checkbox.checked) {
            default_form.forEach(function (element) {
                element.style.display = 'none'
            });
            kit_form.forEach(function (element) {
                element.style.display = 'inherit'
            });
        } else {
            default_form.forEach(function (element) {
                element.style.display = 'inherit'
            });
            kit_form.forEach(function (element) {
                element.style.display = 'none'
            });
        };

        clear_checks();
    }

    // быстрая вставка id фона
    function fast_bg(value) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция fast_bg, используется значение: ${value}`);

        let input = document.querySelector('#objectID');
        input.value = value;
    }

    // +1 день к дате
    function date_plus() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция date_plus`);

        let dateValue = new Date(date.value);
        dateValue.setDate(dateValue.getDate() + 1);
        let newValue = dateValue.toISOString().split('T')[0];
        date.value = newValue;
    }

    // добавление форм для новых версий обычного голосования
    let ver = 1; // количество версий обычного голосования
    function versions() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция versions, количество версий на момент вызова: ${ver}`);

        const row = `
        <tr class="form_default">
            <td>
                <label for="default_${ver}">
                    Новая версия ${ver}:
                </label>
            </td>
            <td>
            <div class="block">
                <input type="text" name="new" class="version_input" id="default_${ver}" data-event="onChangeClearStyles" />
                <button title="Проверить соответствие требованиям" value="default_${ver}" class="clear_button" id="startChecking" />
                    <svg id="unchecked_default_${ver}" class="visible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                        <path d="M12 19H12.01M8.21704 7.69689C8.75753 6.12753 10.2471 5 12 5C14.2091 5 16 6.79086 16 9C16 10.6565 14.9931 12.0778 13.558 12.6852C12.8172 12.9988 12.4468 13.1556 12.3172 13.2767C12.1629 13.4209 12.1336 13.4651 12.061 13.6634C12 13.8299 12 14.0866 12 14.6L12 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg id='success_default_${ver}' class="invisible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg id="failed_default_${ver}" class="invisible" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 -0.5 25 25" fill="none">
                        <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000"/>
                    </svg>
                </button>
            </div>
            </td>
        </tr>
    `;
    ver_table.insertAdjacentHTML('beforeend', row);
    ver++;

    console.log(`МАЛЯР_ОТЛАДКА: вызвана функция versions, количество версий после вызова: ${ver}`);

    var startChecking = document.querySelectorAll('#startChecking');
    startChecking.forEach(function(checks) {
            checks.addEventListener('click', function() {
                checker(checks.value);
            });
        });

    var onChangeClearStyles = document.querySelectorAll('[data-event="onChangeClearStyles"]');
    onChangeClearStyles.forEach(function(clearStyles) {
        clearStyles.addEventListener('change', function() {
            clear_styles(clearStyles.id);
        });
    });
    }

    // добавление форм объектов набора
    let obj = 1; // количество объектов набора
    let obj_ver = 0; // количество версий для объектов набора
    function objects_kit() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция objects_kit, количество объектов набора на момент вызова: ${obj}`);

        obj++;

        let versionColumns = '';
        for (let i = 1; i <= obj_ver; i++) {
            versionColumns += `
                    <td>
                        <div class="block">
                            <input type="text" name="new${i}" id="kit_${obj}" class="version_input" data-event="onChangeClearStylesKit" />
                            <button title="Проверить соответствие требованиям" name="new${i}" value="kit_${obj}" class="clear_button" id="startCheckingWithName" />
                                <svg name="kit_${obj}" id="unchecked_new${i}" class="visible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 19H12.01M8.21704 7.69689C8.75753 6.12753 10.2471 5 12 5C14.2091 5 16 6.79086 16 9C16 10.6565 14.9931 12.0778 13.558 12.6852C12.8172 12.9988 12.4468 13.1556 12.3172 13.2767C12.1629 13.4209 12.1336 13.4651 12.061 13.6634C12 13.8299 12 14.0866 12 14.6L12 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg name="kit_${obj}" id='success_new${i}' class="invisible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg name="kit_${obj}" id="failed_new${i}" class="invisible" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 -0.5 25 25" fill="none">
                                    <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000"/>
                                </svg>
                            </button>
                        </div>
                    </td>
            `;
        }

        const row = `
            <tr class="form_kit" style="display: inherit">
                <td>
                    <select name="type" id="kit_${obj}" data-event="onChangeClearChecksKit">
                        <option value="item">
                            Предмет
                        </option>
                        <option value="medal">
                            Медаль
                        </option>
                        <option value="costume">
                            Костюм
                        </option>
                    </select>
                </td>
                <td>
                    <input type="number" name="current" id="kit_${obj}" />
                </td>
                ${versionColumns} <!-- столбцы с версиями -->
            </tr>
        `;

        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция objects_kit, количество объектов набора после выполнения: ${obj}`);

        ver_table.insertAdjacentHTML('beforeend', row);

        addChecksListeners();
    }

    // добавление форм для новых версий объектов набора
    function versions_kit() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция objects_kit, количество версий объектов набора на момент вызова: ${obj_ver}`);

        obj_ver++;

        const headerRow = document.querySelectorAll('#versions .form_kit')[0];
    
        const plusButtonHeader = headerRow.querySelector('td:last-child');
        plusButtonHeader.insertAdjacentHTML('beforebegin', `<td>Новая версия ${obj_ver}</td>`);
    
        //${id} - номер версии new${obj_ver}
        //${obj} - номер объекта kit_${idValue}
        document.querySelectorAll('.form_kit').forEach((row, index) => {
            if (index > 2) {
                const plusButtonCell = row.querySelector('td:last-child');
                const idValue = `kit_${index - 2}`;
                plusButtonCell.insertAdjacentHTML('afterend', `
                    <td>
                        <div class="block">
                            <input type="text" name="new${obj_ver}" id="${idValue}" class="version_input" data-event="onChangeClearStylesKit" />
                            <button title="Проверить соответствие требованиям" name="new${obj_ver}" value="${idValue}" class="clear_button" id="startCheckingWithName" />
                                <svg name="${idValue}" id="unchecked_new${obj_ver}" class="visible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 19H12.01M8.21704 7.69689C8.75753 6.12753 10.2471 5 12 5C14.2091 5 16 6.79086 16 9C16 10.6565 14.9931 12.0778 13.558 12.6852C12.8172 12.9988 12.4468 13.1556 12.3172 13.2767C12.1629 13.4209 12.1336 13.4651 12.061 13.6634C12 13.8299 12 14.0866 12 14.6L12 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg name="${idValue}" id='success_new${obj_ver}' class="invisible" xmlns="http://www.w3.org/2000/svg"; width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg name="${idValue}" id="failed_new${obj_ver}" class="invisible" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 -0.5 25 25" fill="none">
                                    <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                `);
            }
        });

        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция objects_kit, количество версий объектов набора после выполнения: ${obj_ver}`);

        addChecksListeners();
    }

    // назначение функций для создающихся элементов формы наборного голосования
    function addChecksListeners() {
        var startCheckingWithName = document.querySelectorAll('#startCheckingWithName');
        startCheckingWithName.forEach(function(checksKit) {
            checksKit.addEventListener('click', function() {
                checker(checksKit.name, checksKit.value);
            });
        });

        var onChangeClearStylesKit = document.querySelectorAll('[data-event="onChangeClearStylesKit"]');
        onChangeClearStylesKit.forEach(function(clearStylesKit) {
            clearStylesKit.addEventListener('change', function() {
                clear_styles(clearStylesKit.name, clearStylesKit.id);
            });
        });

        var onChangeClearChecksKit = document.querySelectorAll('[data-event="onChangeClearChecksKit"]');
        onChangeClearChecksKit.forEach(function(clearChecksKit) {
            clearChecksKit.addEventListener('change', function() {
                clear_checksKit(clearChecksKit.id);
            });
        });
    }

    // сбор данных из формы для создания голосования + вызов необходимой функции для генерации кода
    function create_vote() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция create_vote. Начинается сбор данных из формы...');

        // сбор основных данных
        let isKit = checkbox.checked;
        let author = document.getElementById('author').value;
        let date = document.getElementById('end_date').value;
        let belongs_value = belongs_input.value;
        let belongs = belongs_input.options[belongs_input.selectedIndex].text;

        var [year, month, day] = date.split('-');
        var endDate = `${day}.${month}.${year}`;

        // основные данные
        console.log('=== ОБЩИЕ ДАННЫЕ ===')
        console.log('Набор: ' + isKit + '.\nПринадлежность: ' + belongs + '.\nАвтор: ' + author + '.\nДата завершения: ' + endDate)

        if (isKit) {
            // сбор данных набора
            let title = document.getElementById('title_kit').value;
            let currentValues = {};
            let newValues = {};
            var vers_list = '';

            for (let o = 1; o <= obj; o++) {
                let element = document.querySelector(`#kit_${o}[name="current"]`);
                if (element) {
                    currentValues[`current${o}`] = element.value;
                }

                let type_element = document.querySelector(`#kit_${o}[name="type"]`)
                if (type_element) {
                    currentValues[`type${o}`] = type_element.value;
                }

                vers_list += `\nОБъект ${o}: ` + currentValues[`type${o}`] + `\nТекущая версия: ` + currentValues[`current${o}`] + `\n`

                for (let i = 1; i <= obj_ver; i++) {
                    let element = document.querySelector(`#kit_${o}[name="new${i}"]`);

                    if (element) {
                        newValues[`obj${o}_ver${i}`] = element.value;
                    } else {
                        console.log(`Error`)
                    }

                    vers_list += `Новая версия ${i} объекта ${o}: ${newValues[`obj${o}_ver${i}`]}\n`
                }
            }

            console.log('=== ДАННЫЕ НАБОРА ===')
            console.log('Название набора: ' + title + '. Объектов в наборе: ' + obj + '.\n' + vers_list)

            bb_kit(title, belongs, author, endDate, currentValues, newValues);

        } else {
            // сбор данных обычного голосования
            let type = document.getElementById("type").value;
            let title = document.getElementById("title").value;
            let current = document.getElementById("objectID").value;
            let newVersions = {};
            let vers_list = '';

            for (let i = 1; i < ver; i++) {
                let element = document.querySelector(`#default_${i}[name="new"]`);

                if (element) {
                    newVersions[`new${i}`] = element.value;
                }

                vers_list += `Новая версия ${i}: ` + newVersions[`new${i}`] + '\n'
            }

            console.log('=== ДАННЫЕ ОБЪЕКТА ===');
            console.log(`Название объекта: ${title}. Тип объекта: ${type}. \nТекущая версия: ${current}. \n${vers_list}`)

            if (type == 'bg') {
                bb_bg(title, current, belongs, author, endDate, newVersions);
            } else {
                bb_default(type, title, current, belongs, author, endDate, newVersions)
            }
        }

        console.log('МАЛЯР_ОТЛАДКА: выполнена функция create_vote');
    }

    // функция генерации кода обычного голосования (медали, костюмы, предметы)
    function bb_default(type, title, current, belongs, author, endDate, newVersions) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция bb_default. Используются значения: type ${type}, title ${title}, current ${current}, belongs ${belongs}, author ${author}, endDate ${endDate}, newVersions [${newVersions}] `);

        let BBcode = '';
        let BBversions = '';
    
        // преобразование данных в бб-код
        let currentURL = ''
        if (type == "medal") {
            currentURL = `/medal/${current}.png`
        } else if (type == 'costume') {
            currentURL = `/cw3/cats/0/costume/${current}.png`
        } else if (type == 'item') {
            currentURL = `/cw3/things/${current}.png`
        }
    
        // сформировать новые версии
        for (let i = 1; i < ver; i++) {
            BBversions +=
`[tr]
[td][center][size=13][b]Новая версия${ver > 2 ? ` ${i}` : ''}:[/b][/size]
[img]` + newVersions[`new${i}`] + `[/img][/center][/td]
[/tr]`
        }
    
        BBcode = `[color=black]
[center][table=black]
[tr]
[td][table=#807b73]
[tr]
[td][table=0]
[tr]
[td]⠀[/td]
[td][center][b][size=14]${type === 'item' ? 'Предмет' : type === 'medal' ? 'Медаль' : type === 'costume' ? 'Бот' : 'TypeError'} «${title}»[/size][/b]

[table=0]
[tr]
[td][center][size=13][b]Текущая версия:[/b][/size]
[img]${currentURL}[/img][/center][/td]
[/tr]
${BBversions}
[/table][/center]
[size=13][b]Принадлежность: [/b]${belongs}[/size]
[size=9][b]Автор: [/b][i][${author}][/i][/size]
[size=9][b]Голосование длится до: [/b]${endDate}[/size][/td]
[td]⠀[/td]
[/tr]
[/table][/td]
[/tr]
[/table][/td]
[/tr]
[/table][/center]
[/color]`
    
        fill_CWForms(type, BBcode);
        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция bb_default. Итоговый код голосования: ${BBcode}`);
    }

    // функция генерации кода обычного голосования (фоны)
    function bb_bg(title, current, belongs, author, endDate, newVersions) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция bb_bg. Используются значения: title ${title}, current ${current}, belongs ${belongs}, author ${author}, endDate ${endDate}, newVersions [${newVersions}]`);

        let BBcode = '';
        let BBversions = '';
    
        // сформировать новые версии
        for (let i = 1; i < ver; i++) {
            BBversions +=
`[tr]
[td][center][size=16][b]Новая версия${ver > 2 ? ` ${i}` : ''}:[/b][/size][br]
[img]${newVersions[`new${i}`]}[/img][/center][/td]
[/tr]`
        }
    
        BBcode = 
`[color=black]
[center][table=black]
[tr]
[td][table=#807b73]
[tr]
[td][table=0]
[tr]
[td]⠀[/td]
[td][center][b][size=16]Локация «${title}»[/size][/b]

[table=0]
[tr][td][size=13][b]Принадлежность: [/b]${belongs}[/size][/td][/tr]
[tr][td][size=9][b]Автор: [/b][i][${author}][/i][/size][/td][/tr]
[tr][td][size=9][b]Голосование длится до: [/b]${endDate}[/size][/td][/tr]
[/table]
[table=0]
[tr]
[td][center][size=16][b]Текущая версия:[/b][/size][br]
[img]cw3/spacoj/${current}.jpg[/img][/center][/td]
[/tr]
${BBversions}
[/table][/center][/td]
[td]⠀[/td]
[/tr]
[/table][/td]
[/tr]
[/table][/td]
[/tr]
[/table][/center]
[/color]`
    
        fill_CWForms('bg', BBcode);
        console.log(`Итоговый код голосования: ${BBcode}`)

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция bb_bg. Итоговый код голосования: ${BBcode}`);
    }

    // функция генерации кода голосования за наборы
    function bb_kit(title, belongs, author, endDate, currentValues, newValues) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция bb_kit. Используются значения: title ${title}, belongs ${belongs}, author ${author}, endDate ${endDate}, currentValues [${currentValues}], newValues [${newValues}]`);
    
        let currentURL = {};
        let BBcode = '';
        let BBversions = '';
        let post_title = '';
    
        for (let i = 1; i <= obj_ver; i++) {
            post_title += `[td]⠀[/td]
[td][center][size=13][b]Новая версия${obj_ver > 1 ? ` ${i}` : ''}:[/b][/size][/center][/td]`
        }
    
        for (let o = 1; o <= obj; o++) {
            if (currentValues[`type${o}`] == "medal") {
                currentURL[`obj${o}`] = `/medal/${currentValues[`current${o}`]}.png`
            } else if (currentValues[`type${o}`] == 'costume') {
                currentURL[`obj${o}`] = `/cw3/cats/0/costume/${currentValues[`current${o}`]}.png`
            } else if (currentValues[`type${o}`] == 'item') {
                currentURL[`obj${o}`] = `/cw3/things/${currentValues[`current${o}`]}.png`
            }
    
            BBversions += 
`[tr]
[td][center][img]${currentURL[`obj${o}`]}[/img][/center][/td]`

            for (let i = 1; i <= obj_ver; i++) {
                BBversions += 
`[td]⠀[/td]
[td][center][img]${newValues[`obj${o}_ver${i}`]}[/img][/center][/td]`
            }
    
            BBversions += `[/tr]`
        }
        
        BBcode = 
`[color=black]
[center][table=black]
[tr]
[td][table=#807b73]
[tr]
[td][table=0]
[tr]
[td]⠀[/td]
[td][center][b][size=14][url=/sniff958691]Набор[/url] «${title}»[/size][/b]

[table=0]
[tr]
[td][center][size=13][b]Текущая версия:[/b][/size][/center][/td]
${post_title}
[/tr]    
${BBversions}
[/table][/center]
[size=13][b]Принадлежность: [/b]${belongs}[/size]
[size=9][b]Автор: [/b][i][${author}][/i][/size]
[size=9][b]Голосование длится до: [/b]${endDate}[/size]
[/td]
[td]⠀[/td]
[/tr]
[/table][/td]
[/tr]
[/table][/td]
[/tr]
[/table][/center]
[/color]`
    
        fill_CWForms(type, BBcode);
        console.log(`Итоговый код голосования: ${BBcode}`)

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция bb_kit. Итоговый код голосования: ${BBcode}`);
    }

    // заполнение варовских форм создания поста
    function fill_CWForms(type, code) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция fill_CWForms. Используемые значения: type ${type}, code ${code}.`);

        // выгрузка BB-кода в форму кода поста
        siteCreationText.textContent = code;

        // установка названия поста
        siteCreationTitle.value = `Голосование за ${type === 'item' ? 'предмет' : type === 'medal' ? 'медаль' : type === 'costume' ? 'костюм' : type === 'bg' ? 'фон' : 'TypeError'}`;

        fill_PollForm();
        setTags();

        // временное решение для создания новых тегов только одиночным голосованиям
        if (!checkbox.checked) {
            createTags(type);
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция fill_CWForms.`);
    }

    function fill_PollForm() {
        console.log('МАЛЯР_ОТЛАДКА: вызвана функция fill_PollForm')

        // заполнение формы опроса
        var sitePollTitle = document.querySelector('input[class="creation-poll-title"]');
        var sitePollText = document.querySelector('textarea[class="creation-poll-text"]');

        if (sitePollText) {
            console.log('МАЛЯР_ОТЛАДКА: форма для текста опроса найдена.');

            console.log('МАЛЯР_ОТЛАДКА: заполняем заголовок опроса.');
            sitePollTitle.value = 'Заменять?';

            let numVersions;
            var poll_text = '';

            if (checkbox.checked) {
                numVersions = obj_ver;
            } else {
                numVersions = ver - 1;
            }

            console.log('МАЛЯР_ОТЛАДКА: заполнение текст опроса...');
            for (let i = 1; i <= numVersions; i++) {
                poll_text += `Да${numVersions > 1 ? ` (Версия ${i})
` : `
`}`
            }

            sitePollText.textContent = 
`${poll_text}Нет
Посмотреть результаты`;
        } else {
            console.log('МАЛЯР_ОТЛАДКА: форма для текста опроса не найдена, пробуем создать.');
            siteCreationPoll.click();
            console.log('МАЛЯР_ОТЛАДКА: тыкнули добавление опроса.');
            fill_PollForm();
        }

        console.log('МАЛЯР_ОТЛАДКА: выполнена функция fill_PollForm')
    }

    function setTags() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция setTags.`);

        var tag_vote = document.querySelector('div[tag-id="голосование"] input[type="checkbox"]');
        console.log(`МАЛЯР_ОТЛАДКА: ${tag_vote ? `тег "голосование" найден: ${tag_vote}` : 'не удалось найти тег "голосование"'}`);
        tag_vote.checked = true;

        var tag_sniff = document.querySelector('div[tag-id="Поднюхано"] input[type="checkbox"]');
        console.log(`МАЛЯР_ОТЛАДКА: ${tag_sniff ? `тег "Поднюхано" найден: ${tag_sniff}` : 'не удалось найти тег "Поднюхано"'}`);
        tag_sniff.checked = true;

        var tagsSave = document.querySelector('#creation-tags-from-example');
        console.log(`МАЛЯР_ОТЛАДКА: ${tagsSave ? `кнопка сохранения тегов найдена: ${tagsSave}` : 'не удалось найти кнопку сохранения тегов'}`);
        tagsSave.click();

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция setTags.`);
    }

    function createTags(type) { // временно активно только для одиночных голосований
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция createTags.`);

        siteCreationTag.click();

        // добавление пользовательских тегов голосований
        var newTagForm = document.querySelector('input[name="blog_tags"]');
        var newTagSave = document.querySelector('input[title="Сохранить тег"]');

        if (newTagForm) {
            console.log(`МАЛЯР_ОТЛАДКА: форма создания тега найдена, создание новых тегов`);
            newTagForm = document.querySelector('input[name="blog_tags"]');
            newTagForm.value = `голосование за ${type === 'item' ? 'предмет' : type === 'medal' ? 'медаль' : type === 'costume' ? 'костюм' : type === 'bg' ? 'фон' : 'TypeError'}`;

            newTagSave.click();
            console.log(`МАЛЯР_ОТЛАДКА: новые теги созданы`);
        } else {
            console.log(`МАЛЯР_ОТЛАДКА: не удалось найти форму создания тега`);
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция createTags.`);
    }

    // === ПРОВЕРКА ТРЕБОВАНИЙ ===
    let checkResults = {};
    let error_block = document.getElementById('error_mess');
    let error_message = '';

    // очистка результатов после изменения типа (тип объекта обычного голосования и изменение типа голосования)
    function clear_checks() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция clear_checks`);

        for (let i = 1; i < ver; i++) {
            clear_styles(`default_${i}`);
        }
        for (let o = 1; o <= obj; o++) {
            for (let i = 1; i <= obj_ver; i++) {
                clear_styles(`new${i}`, `kit_${o}`);
            }
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция clear_checks, по сути, проверки должны обнулиться`);
    }

    // очистка результатов после изменения типа (наборы)
    function clear_checksKit(obj) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция clear_checksKit`);

        for (let i = 1; i <= obj_ver; i++) {
            clear_styles(`new${i}`, `${obj}`)
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция clear_checksKit, по сути, проверки должны обнулиться`);
    }

    let type;
    let version_input;
    let image_url;
    
    let unchecked;
    let success;
    let failed;

    // очистка результатов после изменений в инпуте
    function clear_styles(id, obj) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция clear_styles, используются значения: id [${id}] (id измененного инпута), obj [${obj}] (номер объекта в наборе)`);

        if (id && obj) {
            version_input = document.querySelector(`#${obj}[name='${id}']`);
            image_url = version_input.value;
    
            // svg кнопки
            unchecked = document.querySelector(`#unchecked_${id}[name='${obj}']`);
            success = document.querySelector(`#success_${id}[name='${obj}']`);
            failed = document.querySelector(`#failed_${id}[name='${obj}']`);
        } else if (id) {
            version_input = document.getElementById(`${id}`); // для установки стиля
            image_url = version_input.value;
            
            // svg кнопки
            unchecked = document.querySelector(`#unchecked_${id}`);
            success = document.querySelector(`#success_${id}`);
            failed = document.querySelector(`#failed_${id}`);
        }
    
        version_input.classList.remove('valid');
        version_input.classList.remove('invalid');
    
        unchecked.style.display = 'inline-block';
        success.style.display = 'none';
        failed.style.display = 'none';
    
        delete checkResults[`${id}_${obj}`];
    
        if (Object.keys(checkResults).length === 0) {
            error_block.style.display = 'none';
        } else {
            checkResult();
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция clear_styles, были использованы значения: id [${id}] (id измененного инпута), obj [${obj}] (номер объекта в наборе)`);
    }

    // проверка соотв тех требованиям
    async function checker(id, obj) {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция checker, используются значения: id [${id}] (id запрошенного инпута), obj [${obj}] (номер объекта в наборе)`);

        let objectID = '';

        if (checkbox.checked) {
            type = document.querySelector(`#${obj}[name='type'`).value;;
            version_input = document.querySelector(`#${obj}[name='${id}']`);
            image_url = version_input.value;
            objectID = document.querySelector(`#${obj}[name='current']`).value;

            // svg кнопки
            console.log(`ОТЛАДКА СВГ: id: ${id}, obj: ${obj}. Запрос ищет: #unchecked_${id}[name='${obj}']; #success_${id}[name='${obj}]; #failed_${id}[name='${obj}]. 
Результат: ${unchecked}, ${success}, ${failed}`)

            unchecked = document.querySelector(`#unchecked_${id}[name='${obj}']`);
            success = document.querySelector(`#success_${id}[name='${obj}']`);
            failed = document.querySelector(`#failed_${id}[name='${obj}']`);
        } else {
            type = document.getElementById("type").value;
            version_input = document.getElementById(`${id}`); // для установки стиля
            image_url = version_input.value;

            // svg кнопки
            unchecked = document.querySelector(`#unchecked_${id}`);
            success = document.querySelector(`#success_${id}`);
            failed = document.querySelector(`#failed_${id}`);
        }

        // определение требований
        let width = 0;
        let height = 0;
        let format;
        let maxSizeKB = 0;

        if (type == 'item') {
            width = 70;
            height = 70;
            format = 'png';
            maxSizeKB = 50;
        } else if (type == 'medal') {
            format = 'png';
            maxSizeKB = 50;
        } else if (type == 'costume') {
            width = 100;
            height = 150;
            format = 'png';
            maxSizeKB = 100;
        } else if (type == 'bg') {
            width = 1000;
            height = 1000;
            format = 'jpg';
            maxSizeKB = 500;
        }

        console.log(
            `Проверяю изображение версии номер ${id}. ${checkbox.checked ? `
Объект ${obj} является частью набора. Его ID на сайте: ${objectID}` : ''}
Ссылка на изображение: ${image_url}.
Его тип: ${type}. 
Требования для этого типа: 
- Формат: ${format};
- Разрешение: ${(width > 0 && height > 0) ? `${width}x${height}px` : 'не заданы'};
- Размер: не больше ${maxSizeKB} КБ.`);

        let actualWidth, actualHeight, actualFormat, actualSizeKB;
        let result;
        let errors = [];
        error_message = '';
        let numVerText = `Новая версия${(ver > 2 || obj_ver) ? ` ${id.match(/\d+/)[0]}` : ''}${(checkbox.checked ? ` ${type == 'medal' ? 'медали' : type == 'item' ? 'предмета' : type == 'costume' ? 'костюма' : '[Ошибка получения объекта]'} ${objectID}` : '')}`;
        let numVerError = `Новая версия${(ver > 2 || obj_ver) ? ` ${id.match(/\d+/)[0]}` : ''}${(checkbox.checked ? ` объекта ${obj}` : '')}`;

        if (image_url) {
            try {
                const response = await fetch(image_url);
                if (!response.ok) throw new Error('Не удалось загрузить изображение.');

                // формат

                // img/${format}
                actualFormat = response.headers.get('Content-Type');
                if (actualFormat !== `image/${format}`) {
                    errors.push(`формат .${format} (у Вас .${actualFormat.split("/")[1]})`);
                }

                // размер
                const contentLength = response.headers.get('Content-Length');
                actualSizeKB = contentLength / 1024;
                if (actualSizeKB > maxSizeKB) {
                    errors.push(`вес < ${maxSizeKB} КБ (у Вас ${actualSizeKB.toFixed(2)} КБ)`);
                }

                // разрешение
                let img = new Image();
                img.src = image_url;

                img.onload = function () {
                    actualWidth = img.width;
                    actualHeight = img.height;

                    if ((width > 0 || height > 0) && (actualWidth !== width || actualHeight !== height)) {
                        errors.push(`разрешение ${width}x${height}px (у Вас ${actualWidth}x${actualHeight}px)`);
                    }

                    // итог
                    if (errors.length > 0) {
                        result = `${numVerText} не соответствует следующим требованиям к работе: `;
                        result += errors.join(", ");
                        checkResults[`${id}_${obj}`] = result;
                        unchecked.style.display = 'none';
                        success.style.display = 'none';
                        failed.style.display = 'inline-block';

                        version_input.classList.remove('valid');
                        version_input.classList.add('invalid');

                        checkResult();
                    } else {
                        result = "Всё ок";
                        unchecked.style.display = 'none';
                        success.style.display = 'inline-block';
                        failed.style.display = 'none';

                        version_input.classList.remove('invalid');
                        version_input.classList.add('valid');
                    }

                    console.log(`Проверка завершена. Параметры изображения:
    - Формат: ${actualFormat};
    - Вес: ${actualSizeKB.toFixed(2)} КБ;
    - Разрешение: ${actualWidth}x${actualHeight}px.

    Результат: 
    ${result}

    Все результаты:
${error_message}`);
                };

                img.onerror = function () {
                    throw new Error('Не удалось загрузить изображение');
                };

            } catch (error) {
                checkResults[`${id}_${obj}`] = `Ошибка проверки изображения (${numVerError}): ${error.message}. Обычно это происходит из-за того, что изображение защищено хостингом, либо введена некорректная ссылка`
                checkResult();

                version_input.classList.remove('valid');
                version_input.classList.add('invalid');
            }
        } else {
            checkResults[`${id}_${obj}`] = `Ошибка проверки изображения (${numVerError}): в текстовом поле не найдено значений для проверки`
            checkResult();

            version_input.classList.remove('valid');
            version_input.classList.add('invalid');
        }

        console.log(`МАЛЯР_ОТЛАДКА: выполнена функция checker, были использованы значения: id [${id}] (id запрошенного инпута), obj [${obj}] (номер объекта в наборе)`);
    }

    // вывод ошибок в результате проверок
    function checkResult() {
        console.log(`МАЛЯР_ОТЛАДКА: вызвана функция checkResult`);

        error_message = '';
        Object.entries(checkResults).forEach(([key, value]) => {
            error_message += `${value}.
    `;
        });
    
        error_block.innerText = error_message;
        error_block.style.display = 'inherit';
    }

    var customStyles = document.createElement('style');
    customStyles.textContent = `
        .form {
            background: #ffffff50;
            padding: 15px;
            margin: 15px 0;
            border: 1px solid black;
            border-radius: 10px;
            display: none;
        }

        .form input {
            margin: 2px 0;
        }

            #error_mess {
            display: block;
            resize: vertical;
            background-color: #FF3300AA;
            margin: 5px 0;
            padding: 10px;
            border: 2px solid #FF3300;
            border-radius: 5px;
            max-width: 500px;
        }

        .valid {
            border: 1px solid #33CC33;
            background-color: #33CC3350;
            border-radius: 1px;
        }

        .invalid {
            border: 1px solid #FF3300;
            background-color: #FF330050;
            border-radius: 1px;
        }

        #vote_form,
        .form_kit {
            display: none;
        }

        .form_default,
        .other {
            display: inherit;
        }

        .block {
            display: block;
            width: 100%;
            position: relative;
        }

        .version_input {
            display: inline-block;
            width: 100%;
            height: 20px;
            padding-right: 25px;
            box-sizing: border-box;
        }

        .clear_button {
            all: unset;
            cursor: pointer;
            display: inline-block;
            position: absolute;
            width: 20px;
            height: 20px;
            top: 0;
            right: 0;
        }

        .versions {
            overflow-x: auto;
            table-layout: fixed;
            width: 150%;
            white-space: nowrap;
        }

        .invisible {
            display: none;
        }

        .visible {
            display: inline-block;
        }
    `;
    document.head.appendChild(customStyles);

})();