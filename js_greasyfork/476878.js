// ==UserScript==
// @name         Маляр
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Форма для создания голосований Маляра в ленте
// @author       signumguilt
// @match        https://catwar.su/sniff?creation
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476878/%D0%9C%D0%B0%D0%BB%D1%8F%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/476878/%D0%9C%D0%B0%D0%BB%D1%8F%D1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const formPlace = document.getElementById('creation-tags');
    const form = document.createElement('div');
    form.className = 'form';
    const voteDiv = document.createElement('div');

    const creationForm = document.querySelector('form[id="creation_form"]');
    creationForm.parentNode.insertBefore(voteDiv, creationForm.nextSibling);

    const versions = document.createElement('div');
    var vers = 1;

    var createButton = createBtn('votecreate', 'Голосование');
    voteDiv.appendChild(createButton);
    createButton.addEventListener('click', clearForm);
    createButton.addEventListener('click', htmlCreate);

    const textplace = document.getElementById('creation-text');

    function htmlCreate() {
        voteDiv.appendChild(form);

        form.appendChild(document.createTextNode("Тип голосования: "));
        form.appendChild(createType());

        form.appendChild(document.createElement('br'));
        form.appendChild(document.createTextNode("Название: "));
        form.appendChild(createInput('name', 'text', 'Название объекта'));

        form.appendChild(document.createElement('br'));
        form.appendChild(document.createTextNode("Принадлежность: "));
        form.appendChild(createBelong());

        form.appendChild(document.createElement('br'));
        form.appendChild(document.createTextNode("Автор: "));
        form.appendChild(createInput('author', 'text', 'ID автора')); // добавить возможность указания нескольких авторов (много версий)
        var text = document.createElement('small');
        text.innerHTML = ' С link или только цифры';
        form.appendChild(text);

        form.appendChild(document.createElement('br'));
        form.appendChild(document.createTextNode("Длится до: ")); // добавить автодату
        var date = document.createElement('input');
        date.id = 'date';
        date.type = 'date';
        form.appendChild(date);

        var label = document.createElement('label');
        var checkbox = createCheck('autodate');
        checkbox.addEventListener('change', changeAutodate);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' Посчитать автоматически'));
        form.appendChild(label);

        function changeAutodate() {
            if (checkbox.checked) {
                date.disabled = true;
            } else {
                date.disabled = false;
            }
        }

        changeAutodate();

        form.appendChild(document.createElement('br'));
        form.appendChild(document.createTextNode("Текущая версия: "));
        form.appendChild(createInput('imgnow', 'text', 'ID файла на сайте'));

        form.appendChild(document.createElement('br'));
        var add = createBtn('_new', 'Добавить новую версию');
        add.addEventListener('click', addversion);
        form.appendChild(add);

        form.appendChild(document.createElement('br'));
        form.appendChild(versions);

        var gen = createBtn('generate', 'Сгенерировать голосование');
        form.appendChild(gen);
        gen.addEventListener('click', writeVote);
    };

    function addversion() {
        versions.appendChild(document.createTextNode("Новая версия " + vers + ": "));
        versions.appendChild(createInput(vers, 'text', 'Ссылка на изображение'));
        versions.appendChild(document.createElement('br'));

        vers++;
    }

    function writeVote() {
        // тип голосования type
        var selectedtype = document.getElementById('voteType').options[document.getElementById('voteType').selectedIndex];
        var type = selectedtype.getAttribute('value');

        // название объекта name
        var name = document.getElementById('name').value;
        // автор работы author
        let authorValue = document.getElementById('author').value.trim();
        let author = authorValue.replace(/\D/g, '');
        
        // принадлежность belongs
        var selectedclan = document.getElementById('belongTo').options[document.getElementById('belongTo').selectedIndex];
        var belongs = selectedclan.getAttribute('value');

        // преобразование даты
        var check = document.getElementById('autodate');
        var date = "";
        if (check.checked) {
            let today = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
            today = new Date(today);
            today.setDate(today.getDate() + 7);

            let day = String(today.getDate()).padStart(2, '0');
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let year = today.getFullYear() % 100;

            date = `${day}.${month}.${year}`;
        } else if (check.checked == false) {
            var rawDate = document.getElementById('date').value;

            rawDate = new Date(rawDate);

            let day = String(rawDate.getDate()).padStart(2, '0');
            let month = String(rawDate.getMonth() + 1).padStart(2, '0');
            let year = rawDate.getFullYear() % 100;

            date = `${day}.${month}.${year}`;
        } else {
            date = 'Ошибка!'
        }

        // генерация ссылки на объект и имени в названии поста
        var thisnow = document.getElementById('imgnow').value;
        var siteurl;
        if (type == 'Предмет') {
            siteurl = "cw3/things/" + thisnow + ".png";
        } else if (type == 'Медаль') {
            siteurl = "medal/" + thisnow + ".png";
        } else if (type == 'Костюм') {
            siteurl = "cw3/cats/0/costume/" + thisnow + ".png";
        } else if (type == 'Фон') {
            siteurl = 'cw3/spacoj/' + thisnow + ".jpg";
        } else {
            siteurl = 'Ошибка!';
        };

        // обработка новых версий
        var newVer = "";
        var pollValue = "";
        for (var i = 1; i < vers; i++) {
            var inputElement = document.getElementById(i);

            if (inputElement) {
                var inputValue = inputElement.value;

                // генерация новых версий в посте
                newVer += "[tr]\n"
                newVer += "[td]"
                newVer += "[center]"
                newVer += "[size=" + (type == 'Фон' ? 16 : 13) + "][b]Новая версия" + (vers == 2 ? "" : " " + i) + ":[/b][/size]" + (type == 'Фон' ? "[br]" : "") +"\n"
                newVer += "[img]" + inputValue + "[/img]"
                newVer += "[/center]"
                newVer += "[/td]\n"
                newVer += "[/tr]"

                // генерация версий в опросе
                pollValue += "Да" + (vers == 2 ? "" : " (Версия " + i + ")") + "\n"
            }
        }

        // догенерация опроса
        pollValue += "Нет\n"
        pollValue += "Посмотреть результаты"

        // тип голосования - type
        // название объекта - name
        // принадлежность - belongs
        // автор - author
        // дата завершения - date
        // текущая версия - siteurl
        // новые версии - newVer

        var vote = "";

        if (type == 'Фон') {
            vote = ""
            vote += "[color=black]\n"
            vote += "[center][table=black]\n"
            vote += "[tr]\n"
            vote += "[td][table=#807b73]\n"
            vote += "[tr]\n"
            vote += "[td][table=0]\n"
            vote += "[tr]\n"
            vote += "[td]⠀[/td]\n"
            vote += "[td][center][b][size=16]Локация «" + name + "»[/size][/b]\n\n"
            vote += "[table=0]\n"
            vote += "[tr][td][size=13][b]Принадлежность: [/b]" + belongs + "[/size][/td][/tr]\n"
            vote += "[tr][td][size=9][b]Автор: [/b][i][link" + author + "][/i][/size][/td][/tr]\n"
            vote += "[tr][td][size=9][b]Голосование длится до: [/b]" + date + "[/size][/td][/tr]\n"
            vote += "[/table]\n"
            vote += "[table=0]\n"
            vote += "[tr]\n"
            vote += "[td][center][size=16][b]Текущая версия:[/b][/size][br]\n"
            vote += "[img]" + siteurl + "[/img][/center][/td]\n"
            vote += "[/tr]\n"
            vote += newVer
            vote += "[/table][/center][/td]\n"
            vote += "[td]⠀[/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/center]\n"
            vote += "[/color]"
        } else if (type == 'Предмет' || 'Медаль' || 'Костюм') {
            vote = ""
            vote += "[color=black]\n"
            vote += "[center][table=black]\n"
            vote += "[tr]\n"
            vote += "[td][table=#807b73]\n"
            vote += "[tr]\n"
            vote += "[td][table=0]\n"
            vote += "[tr]\n"
            vote += "[td]⠀[/td]\n"
            vote += "[td][center][b][size=14]" + (type == 'Костюм' ? 'Бот' : type) + " «" + name + "»[/size][/b]\n\n"
            vote += "[table=0]\n"
            vote += "[tr]\n"
            vote += "[td][center][size=13][b]Текущая версия:[/b][/size]\n"
            vote += "[img]" + siteurl + "[/img][/center][/td]\n"
            vote += "[/tr]\n"
            vote += newVer
            vote += "[/table][/center]\n"
            vote += "[size=13][b]Принадлежность: [/b]" + belongs + "[/size]\n"
            vote += "[size=9][b]Автор: [/b][i][link" + author + "][/i][/size]\n"
            vote += "[size=9][b]Голосование длится до: [/b]" + date + "[/size][/td]\n"
            vote += "[td]⠀[/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/td]\n"
            vote += "[/tr]\n"
            vote += "[/table][/center]\n"
            vote += "[/color]"
        } else {
            vote = 'Ошибка!';
        }
        
        textplace.textContent = vote;

        // установка названия поста
        var title = document.getElementById('creation-title');
        title.value = 'Голосование за ' + type.toLowerCase();

        // помещение текста опроса в буфер обмена
        navigator.clipboard.writeText(pollValue)
        alert('Текст опроса скопирован в буфер обмена!')
    }

    function clearForm() {
        while (form.firstChild) {
            form.removeChild(form.firstChild);
        };

        while (versions.firstChild) {
            versions.removeChild(versions.firstChild);
            vers = 1;
        }
    };

    function createBelong() {
        var belongto = document.createElement('select');
        belongto.id = 'belongTo';

        var fractions = ['общедоступный', 'Озёрная вселенная', 'Одиночки (ОВ)', 'Домашние', 'Морская вселенная', 'Одиночки (МВ)', 'Вселенная творцов', 'Звёздное племя', 'Сумрачный лес']

        for (var i = 0; i < fractions.length; i++) {
            var option = document.createElement('option');
            option.textContent = fractions[i];
            option.value = fractions[i];
            belongto.appendChild(option);
        }
        return belongto;
    };

    function createType() {
        var select = document.createElement('select');
        select.id = 'voteType';

        var types = ['Предмет', 'Медаль', 'Костюм', 'Фон'];

        for (var i = 0; i < types.length; i++) {
            var option = document.createElement('option');
            option.textContent = types[i];
            option.value = types[i];
            select.appendChild(option);
        }
        return select;
    };

    function createInput(id, type, placeholder) {
        var input = document.createElement('input');
        input.id = id;
        input.name = id;
        input.type = type;
        input.placeholder = placeholder;
        return input;
    };

    function createCheck(id) {
        var input = document.createElement('input');
        input.id = id;
        input.value = id;
        input.type = 'checkbox';
        return input;
    }

    function createBtn(id, value) {
        var input = document.createElement('input');
        input.id = id;
        input.name = id;
        input.type = 'button';
        input.value = value;
        return input;
    };

    var customStyles = document.createElement('style');
        customStyles.textContent = `
            .form input[type=text] {
                width: 40%;
            }

            .form input {
                margin: 3px;
            }
    `;

    document.head.appendChild(customStyles);
})();