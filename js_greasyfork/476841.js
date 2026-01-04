    // ==UserScript==
    // @name         Отчёты охраны северных границ
    // @namespace    http://tampermonkey.net/
    // @version      1.3.2
    // @description  Автоматическое составление отчётов северной охранной деятельности
    // @author       signumguilt
    // @match        https://catwar.su/blog217930
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
    // @license      MIT
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476841/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D1%8B%20%D1%81%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D1%85%20%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/476841/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D1%8B%20%D1%81%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D1%85%20%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%86.meta.js
    // ==/UserScript==
 
    (function() {
        'use strict';
   
        let today = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
            today = new Date(today);
        
        const branchDiv = document.getElementById('view_blocks');
        const place = createElement('div', { className: 'form' });
        const forms = createElement('div', { className: 'form' });
        const textarea = document.getElementById('comment')
        branchDiv.appendChild(place);
        branchDiv.appendChild(forms);
   
        place.innerHTML = "<hr><h2>Шаблоны взрослой деятельности</h2>";
   
        const saved_id = createElement('div', { id: 'saved_id', className: 'form' });
        saved_id.innerHTML = "Автоматически использовать ID: ";
        saved_id.appendChild(createInput('this_id', 'number', 'Введите ID'));
        saved_id.appendChild(createButton('Сохранить', save_id));
        saved_id.appendChild(document.createElement('br'));
        const show_id = document.createElement('i');
   
        const savedID = localStorage.getItem('use_id');
   
            if (savedID) {
                show_id.textContent = 'Сохранённый ID: ' + savedID + ' ';
                show_id.appendChild(createButton('Удалить', delete_id));
            } else {
                show_id.textContent = 'ID не установлен.';
            }
   
        saved_id.appendChild(show_id);
        place.appendChild(saved_id);
        place.appendChild(document.createElement('br'));
   
        var planPatrol = createButton('Отчёт планового патруля', createForm_planPatrol);
        var freePatrol = createButton('Отчёт свободного патруля', createForm_freePatrol);
        var watchStart = createButton('Выход на дозор', startWatchForm_selectType)
        var watch = createButton('Отчёт дозора', watchForm_selectType);
        place.appendChild(watchStart);
        place.appendChild(watch);
        place.appendChild(planPatrol);
        place.appendChild(freePatrol);
   
        const convert = createElement('i', { innerHTML: "Для перевода имён в ID: <a href='https://catwar.su/my_clan/convert'>конвертиловка</a><br><br>"});
   
    /* --------------------------------------------------
    |
    |    ГЕНЕРАЦИЯ ФОРМ ДЛЯ ЗАПОЛНЕНИЯ ШАБЛОНОВ
    |
    |    Генерация формы плановых патрулей      (createForm_planPatrol);
    |    Генерация формы свободных патрулей     (createForm_freePatrol);
    |    Выбор типа дозора                      (watchForm_selectType);
    |    Генерация формы дозоров                (createForm_watch);
    |    Генерация формы выхода на дозор        (createForm_watchStart);
    |
    */
   
    function createForm_planPatrol() {
        clearForm();
   
        forms.appendChild(createElement('h3', { textContent: 'Отчёт планового патруля' }));
        forms.appendChild(convert);
   
        const elements = [
          { label: 'Дата:', inputType: 'date', id: 'date' },
          { label: 'Сегодня', inputType: 'checkbox', id: 'today', br: 1 },
          { label: 'Время:', inputType: 'time', id: 'time', customFunction: patrol_schedule, br: 1 },
          { label: 'Собирающий:', inputType: 'text', id: 'lead', placeholder: 'ID собирающего', value: savedID, br: 1 },
          { label: 'Ведущий второй части:', inputType: 'text', id: 'second_lead', placeholder: 'ID ведущего второй части', br: 1 },
          { label: 'Участники:', inputType: 'text', id: 'members', placeholder: 'ID через пробел/запятую', br: 1 },
          { label: 'Нарушения:', inputType: 'text', id: 'illegalID', placeholder: 'ID нарушителя' },
          { id: 'illegalClan', customFunction: clanlist },
          { inputType: 'text', id: 'illegalScreen', placeholder: 'Ссылка на скриншот', br: 1 }
        ];
   
        generateForm(elements, forms);
   
        forms.appendChild(createButton('Сгенерировать отчёт', get_planPatrol));
    }
   
    function createForm_freePatrol() {
        clearForm();
   
        forms.appendChild(createElement('h3', { textContent: 'Отчёт свободного патруля' }));
        forms.appendChild(convert);
   
        const elements = [
            { label: 'Дата:', inputType: 'date', id: 'date' },
            { label: 'Сегодня', inputType: 'checkbox', id: 'today', br: 1 },
            { label: 'Собирающий:', inputType: 'text', id: 'lead', placeholder: 'ID собирающего', value: savedID, br: 1 },
            { label: 'Ведущий второй части:', inputType: 'text', id: 'second_lead', placeholder: 'ID ведущего второй части', br: 1 },
            { label: 'Взятый временной промежуток:', inputType: 'time', id: 'timeStart' },
            { label: ' — ', inputType: 'time', id: 'timeEnd', br: 1 },
            { label: 'Участники:', inputType: 'text', id: 'members', placeholder: 'ID через пробел/запятую', br: 1 },
            { label: 'Нарушения:', inputType: 'text', id: 'illegalID', placeholder: 'ID нарушителя' },
            { customFunction: clanlist },
            { inputType: 'text', id: 'illegalScreen', placeholder: 'Ссылка на скриншот', br: 1 }
          ];
   
        generateForm(elements, forms);
   
        forms.appendChild(createButton('Сгенерировать отчёт', get_freePatrol));
    }
   
    function watchForm_selectType() {
        clearForm();
   
        forms.appendChild(createElement('h3', { textContent: 'Отчёт дозора' }));
   
        forms.appendChild(document.createTextNode('Тип дозора: '));
        forms.appendChild(watch_type());
        forms.appendChild(createButton('OK', createForm_watch));
   
        const watchDiv = document.createElement('div');
        forms.appendChild(watchDiv);
   
        function createForm_watch() {
   
            while (watchDiv.firstChild) {
                watchDiv.removeChild(watchDiv.firstChild);
            };
   
            var selectedType = document.getElementById('watchType').value;
            var watchElements;
   
            if (selectedType == 'Активный') {
                watchElements = [
                    { label: 'Дежурный:', inputType: 'text', id: 'watcher', placeholder: 'ID собирающего', value: savedID, br: 1 },
                    { label: 'Дата:', inputType: 'date', id: 'date' },
                    { label: 'Сегодня', inputType: 'checkbox', id: 'today', br: 1 },
                    { label: 'Часы дежурства:', inputType: 'time', id: 'timeStart' },
                    { label: ' — ', inputType: 'time', id: 'timeEnd', br: 1 },
                    { label: 'Маршрут: ', inputType: 'number', id: 'watchRoute', placeholder: 'Номер маршрута', br: 1 },
                    { label: 'Нарушения:', inputType: 'text', id: 'illegalID', placeholder: 'ID нарушителя' },
                    { customFunction: clanlist },
                    { inputType: 'text', id: 'illegalScreen', placeholder: 'Ссылка на скриншот', br: 1 }
                ];
            } else {
                watchElements = [
                    { label: 'Дежурный:', inputType: 'text', id: 'watcher', placeholder: 'ID собирающего', value: savedID, br: 1 },
                    { label: 'Дата:', inputType: 'date', id: 'date' },
                    { label: 'Сегодня', inputType: 'checkbox', id: 'today', br: 1 },
                    { label: 'Часы дежурства:', inputType: 'time', id: 'timeStart' },
                    { label: ' — ', inputType: 'time', id: 'timeEnd', br: 1 },
                    { label: 'Охраняемая локация: ', id: 'locsel', customFunction: passive_locs, br: 1 },
                    { label: 'Нарушения:', inputType: 'text', id: 'illegalID', placeholder: 'ID нарушителя' },
                    { customFunction: clanlist },
                    { inputType: 'text', id: 'illegalScreen', placeholder: 'Ссылка на скриншот', br: 1 }
                ];
            }
   
            const elements = watchElements;
   
            generateForm(elements, watchDiv);
   
            watchDiv.appendChild(createButton('Сгенерировать отчёт', get_watch));
        }
    };
   
    function startWatchForm_selectType() {
        clearForm();
   
        forms.appendChild(createElement('h3', { textContent: 'Шаблон начала дозора' }));
   
        forms.appendChild(document.createTextNode('Тип дозора: '));
        forms.appendChild(watch_type());
        forms.appendChild(createButton('OK', createForm_watch));
   
        const watchDiv = document.createElement('div');
        forms.appendChild(watchDiv);
   
        function createForm_watch() {
   
            while (watchDiv.firstChild) {
                watchDiv.removeChild(watchDiv.firstChild);
            };
   
            var selectedType = document.getElementById('watchType').value;
            var watchElements;
   
            if (selectedType == 'Активный') {
                watchElements = [
                    { label: 'Дежурный:', inputType: 'text', id: 'watcher', placeholder: 'ID собирающего', value: savedID, br: 1 },
                    { label: 'Маршрут: ', inputType: 'number', id: 'watchRoute', placeholder: 'Номер маршрута', br: 1 }
                ];
            } else {
                watchElements = [
                    { label: 'Дежурный:', inputType: 'text', id: 'watcher', placeholder: 'ID собирающего', value: savedID, br: 1 },
                    { label: 'Охраняемая локация: ', id: 'locsel', customFunction: passive_locs, br: 1 }
                ];
            }
   
            const elements = watchElements;
   
            generateForm(elements, watchDiv);
   
            watchDiv.appendChild(createButton('Сгенерировать отчёт', get_watchStart));
        }
    }
   
    /* --------------------------------------------------
    |
    |    ГЕНЕРАЦИЯ ГОТОВЫХ КОММЕНТАРИЕВ
    |
    |    Генерация комментария планового патруля    (get_planPatrol);
    |    Генерация комментария свободного патруля   (get_freePatrol);
    |    Генерация комментария дозора               (get_watch);
    |    Генерация комментария выхода на дозор      (get_watchStart);
    |
    */
   
    function get_planPatrol() {
        // date
        var date;
        var checkbox = document.getElementById('today');
        if (checkbox.checked) {
            let day = String(today.getDate()).padStart(2, '0');
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let year = today.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        } else {
            var rawDate = document.getElementById('date').value;
   
            rawDate = new Date(rawDate);
   
            let day = String(rawDate.getDate()).padStart(2, '0');
            let month = String(rawDate.getMonth() + 1).padStart(2, '0');
            let year = rawDate.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        }
   
        var time = document.querySelector('select[name="time"]').value;
        var lead = document.getElementById('lead').value;
        var second_lead = document.getElementById('second_lead').value;
   
        var members = document.getElementById('members').value;
        var memberlist = members.split(/[\s,]+/);
   
        var illegalID = document.getElementById('illegalID').value;
        var illegalClan = document.querySelector('select[id="illegalClan"]').value;
        var illegalScreen = document.getElementById('illegalScreen').value;
        var illegalValue;
        if (illegalID && illegalClan && illegalScreen) {
            illegalValue = '[link' + illegalID + '] (' + illegalClan + ') — [url=' + illegalScreen + ']скриншот[/url]';
        } else {
            illegalValue = 'отсутствуют.';
        }
   
        var result = "[b]Плановый патруль[/b]\n";
        result += "[b]Дата[/b]: " + date + ";\n";
        result += "[b]Время[/b]: " + time + ";\n";
        result += "[b]Собирающий[/b]: [link" + lead + "];\n";
        result += "[b]Ведущий второй части[/b]: " + (second_lead != "" ? "[link" + second_lead + "]" : "—") + ";\n";
        result += "[b]Участники[/b]: ";
   
        for (var i = 0; i < memberlist.length; i++) {
            result += "[link" + memberlist[i] + "]";
          if (i < memberlist.length - 1) {
            result += ", ";
          }
        }
        result += ";\n";
   
        result += "[b]Нарушения[/b]: " + illegalValue;
   
        if (date == "NaN.NaN.NaN") {
            alert("Введите дату!");
        } else if (!lead) {
            alert("Введите ID собирающего!");
        } else if (!members) {
            alert("Впишите хотя бы одного участника!");
        } else {
            textarea.value = result;
        }
    }
   
    function get_freePatrol() {
        var date;
        var checkbox = document.getElementById('today');
        if (checkbox.checked) {
            let day = String(today.getDate()).padStart(2, '0');
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let year = today.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        } else {
            var rawDate = document.getElementById('date').value;
   
            rawDate = new Date(rawDate);
   
            let day = String(rawDate.getDate()).padStart(2, '0');
            let month = String(rawDate.getMonth() + 1).padStart(2, '0');
            let year = rawDate.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        }
   
        var lead = document.getElementById('lead').value;
        var second_lead = document.getElementById('second_lead').value;
   
        var timeStart = document.getElementById('timeStart').value;
        var timeEnd = document.getElementById('timeEnd').value;
   
        var members = document.getElementById('members').value;
        var memberlist = members.split(/[\s,]+/);
   
        var illegalID = document.getElementById('illegalID').value;
        var illegalClan = document.querySelector('select[id="illegalClan"]').value;
        var illegalScreen = document.getElementById('illegalScreen').value;
        var illegalValue;
        if (illegalID && illegalClan && illegalScreen) {
            illegalValue = '[link' + illegalID + '] (' + illegalClan + ') — [url=' + illegalScreen + ']скриншот[/url]';
        } else {
            illegalValue = 'отсутствуют.';
        }
   
        var result = "[b]Свободный патруль[/b]\n";
        result += "[b]Дата[/b]: " + date + ";\n";
        result += "[b]Собирающий[/b]: [link" + lead + "];\n";
        result += "[b]Ведущий второй части[/b]: " + (second_lead != "" ? "[link" + second_lead + "]" : "—") + ";\n";
        result += "[b]Взятый временной отрезок[/b]: " + timeStart + " — " + timeEnd +";\n";
        result += "[b]Участники[/b]: ";
   
        for (var i = 0; i < memberlist.length; i++) {
            result += "[link" + memberlist[i] + "]";
          if (i < memberlist.length - 1) {
            result += ", ";
          }
        }
        result += ";\n";
   
        result += "[b]Нарушения[/b]: " + illegalValue;
   
        if (date == "NaN.NaN.NaN") {
            alert("Введите дату!");
        } else if (!lead) {
            alert("Введите ID собирающего!");
        } else if (!timeStart || !timeEnd) {
            alert("Введите взятый временной промежуток!");
        } else if (!members) {
            alert("Впишите хотя бы одного участника!");
        } else {
            textarea.value = result;
        }
    }
   
    function get_watch() {
        var type = document.getElementById('watchType').value;
        var date;
        var checkbox = document.getElementById('today');
        if (checkbox.checked) {
            let day = String(today.getDate()).padStart(2, '0');
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let year = today.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        } else {
            var rawDate = document.getElementById('date').value;
   
            rawDate = new Date(rawDate);
   
            let day = String(rawDate.getDate()).padStart(2, '0');
            let month = String(rawDate.getMonth() + 1).padStart(2, '0');
            let year = rawDate.getFullYear() % 100;
   
            date = `${day}.${month}.${year}`;
        }
   
        var watcher = document.getElementById('watcher').value;
   
        var timeStart = document.getElementById('timeStart').value;
        var timeEnd = document.getElementById('timeEnd').value;
   
        var watchingType;
        var watchingPlace;
        if (type == 'Активный') {
            watchingPlace = document.getElementById('watchRoute').value;
            watchingType = 'Маршрут';
        } else {
            watchingPlace = document.querySelector('select[id=locsel]').value;
            watchingType = 'Охраняемая локация';
        }
   
        var illegalID = document.getElementById('illegalID').value;
        var illegalClan = document.querySelector('select[id="illegalClan"]').value;
        var illegalScreen = document.getElementById('illegalScreen').value;
        var illegalValue;
   
        if (illegalID && illegalClan && illegalScreen) {
            illegalValue = '[link' + illegalID + '] (' + illegalClan + ') — [url=' + illegalScreen + ']скриншот[/url]';
        } else {
            illegalValue = 'отсутствуют.';
        }
   
        var result = "[b]" + type + " дозор[/b]\n";
            result += "[b]Дежурный[/b]: [[n]link[/n]" + watcher + "]; \n";
            result += "[b]Дата[/b]: " + date + ";\n";
            result += "[b]Часы дежурства[/b]: " + timeStart + " — " + timeEnd + ";\n";
            result += "[b]" + watchingType + "[/b]: " + watchingPlace + ";\n";
            result += "[b]Нарушения[/b]: " + illegalValue;
   
        if (date == "NaN.NaN.NaN") {
            alert("Введите дату!");
        } else if (!watcher) {
            alert("Введите ID дежурного!");
        } else if (!timeStart || !timeEnd) {
            alert("Введите часы дежурства!");
        } else if (!watchingPlace || watchingPlace == 'Не выбрано') {
            alert("Не выбран маршрут или охраняемая локация!");
        } else {
            textarea.value = result;
        }
    }
   
    function get_watchStart() {
        var watcher = document.getElementById('watcher').value;
        var type = document.getElementById('watchType').value;
   
        var result;
   
        if (type == 'Активный') {
            var route = document.getElementById('watchRoute').value;
            result = '[[n]link[/n]' + watcher + '] вышел на [b][i]активное дежурство[/i][/b]. Маршрут: ' + route + '.';
        } else {
            var loc = document.querySelector('select[id=locsel]').value;
            result = '[[n]link[/n]' + watcher + '] вышел на [b][i]пассивное дежурство[/i][/b]. Локация: ' + loc + '.';
        }
   
        if (watcher == "") {
            alert("Введите ID дежурного!");
        } else if (route == "" || loc == "Не выбрано") {
            alert("Введите маршрут/локацию дозора!");
        } else {
            textarea.value = result;
        }
    }
   
    /* --------------------------------------------------
    |
    |    ТЕХНИЧЕСКИЕ ФУНКЦИИ (работа скрипта)
    |
    |    Генерация элементов формы       (generateForm);
    |    Переключение авто даты          (changeAutodate);
    |    Сохранение ID по умолчанию      (save_id);
    |    Удаление ID по умолчанию        (delete_id);
    |    Расширенное создание элемента   (createElement);
    |    Генерация текстовой метки       (createLabel);
    |    Генерация текстового ввода      (createInput);
    |    Генерация заголовков            (createHeader);
    |    Генерация кнопок                (createButton);
    |    Очистка формы                   (clearForm);
    |
    */
   
    function generateForm(elements, place) {
        elements.forEach(item => {
            if (item.inputType == 'checkbox') {
                var input = createInput(item.id, item.inputType, item.placeholder);
                input.addEventListener('change', changeAutodate);
                place.appendChild(input);
                place.appendChild(createLabel(item.id, item.label));
            } else {
                    if (item.customFunction && !item.label && !item.inputType) {
                        place.appendChild(item.customFunction());
                    } else if (item.customFunction) {
                        place.appendChild(createLabel(item.id, item.label));
                        place.appendChild(item.customFunction());
                    } else {
                        place.appendChild(createLabel(item.id, item.label));
                        var input = createInput(item.id, item.inputType, item.placeholder);
                        if (savedID && item.value) {
                            input.value = savedID;
                        }
                        place.appendChild(input);
                    }
            }
            if (item.br) {
                place.appendChild(document.createElement('br'));
            }
          });
    }
   
    function changeAutodate() {
        var date = document.getElementById('date');
        var checkbox = document.getElementById('today');
        if (checkbox.checked) {
            date.disabled = true;
        } else {
            date.disabled = false;
        }
    }
   
    function save_id() {
        var id = document.getElementById('this_id').value;
        localStorage.setItem('use_id', id);
        alert('Успех!');
        location.reload();
    }
   
    function delete_id() {
        delete localStorage.use_id;
        location.reload();
    }
   
    function createElement(type, attributes = {}) {
    const element = document.createElement(type);
    Object.keys(attributes).forEach(key => {
        element[key] = attributes[key];
    });
    return element;
    }
   
    function createLabel(id, labelText) {
    const label = createElement('label', { htmlFor: id });
    label.textContent = labelText;
    return label;
    }
   
    function createInput(id, type, placeholder = '') {
    const input = createElement('input', { id, type, placeholder });
    return input;
    }
   
    function createButton(value, onclick, id) {
        var button = document.createElement('input');
        button.type = 'button';
        button.value = value;
        button.id = id;
        button.addEventListener('click', onclick);
        return button;
    }
   
    function clearForm() {
        while (forms.firstChild) {
            forms.removeChild(forms.firstChild);
        };
    };
   
    /* --------------------------------------------------
    |
    |    ИЗМЕНЯЕМЫЕ ФУНКЦИИ (информация о деятельности)
    |
    |    Расписание плановых патрулей   (patrol_schedule);
    |    Типы дозоров                   (watch_type);
    |    Локации пассивного дозора      (passive_locs);
    |    Фракции ОВ                     (clanlist);
    |
    */
   
    // Расписание плановых патрулей
    function patrol_schedule() {
        var select = document.createElement('select');
        select.name = 'time';
   
        var times = ['12:00', '17:00', '20:00', '22:00'];
        for (var i = 0; i < times.length; i++) {
        var option = document.createElement('option');
        option.textContent = times[i];
        select.appendChild(option);
        }
   
        return select;
    }
   
    // Типы дозоров
    function watch_type() {
        var select = document.createElement('select');
        select.id = 'watchType';
   
        var watchTypes = [
            { id: 1, value: 'Активный' },
            { id: 2, value: 'Пассивный' }
        ];
   
        for (var i = 0; i < watchTypes.length; i++) {
            var option = document.createElement('option');
            option.textContent = watchTypes[i].value;
            option.value = watchTypes[i].value;
            option.id = watchTypes[i].id;
            select.appendChild(option);
        }
        return select;
    }
   
    // Локации пассивного дозора
    function passive_locs() {
        var locselect = document.createElement('select');
        locselect.id = 'locsel';
   
        var loclist = [
            { value: 'Не выбрано' },
            { value: 'Мёрзлые земли' },
            { value: 'Ледопад' },
            { value: 'Заиндевевшие кусты голубики' },
            { value: 'Крутой подъём' },
            { value: 'Ельник' }
        ];
        for (var i = 0; i < loclist.length; i++) {
            var option = document.createElement('option');
            option.value = loclist[i].value;
            option.textContent = loclist[i].value;
            locselect.appendChild(option);
        }
   
        return locselect;
    }
   
    // Фракции ОВ
    function clanlist() {
        var select = document.createElement('select');
        select.id = 'illegalClan';
   
        var clans = [
        'клан Падающей Воды',
        'Северный клан',
        'одиночки',
        'домашние',
        'Грозовое племя',
        'племя Теней',
        'Речное племя',
        'племя Ветра'
        ];
   
        for (var i = 0; i < clans.length; i++) {
        var option = document.createElement('option');
        option.textContent = clans[i];
        select.appendChild(option);
        }
        return select;
    }
   
    // Стили
    var customStyles = document.createElement('style');
    customStyles.textContent = `
    .form input, .form select, .form button, .form label {
        margin: 2px 4px 2px 0;
    }
   
    h2, h3 {
        margin: 7px 0;
    }
    `;
   
    document.head.appendChild(customStyles);
   
    var tho = document.createElement('small');
    tho.innerHTML = '<br>Есть проблемы со скриптом? Пишите <a href="https://catwar.su/cat888999">Древоточцу</a>.';
    branchDiv.appendChild(tho);
   
    })();