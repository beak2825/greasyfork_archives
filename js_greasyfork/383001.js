// ==UserScript==
// @name            Versions 4pda
// @namespace       http://4pda.to/forum/index.php
// @version         1.6.2
// @description:ru  Вывод версий приложений в Избранном 4pda, показ обновленных приложений
// @author          Azat-777 (Ник на 4pda: Azat-777, mail: aflitonovazat@gmail.com)
// @icon            http://s.4pda.to/kkRM7z1nbI3gbG5E7r0a561qtdKnE2GlKhz1ipnv.png
// @match           http*://4pda.to/forum/index.php?act=fav*
// @match           http*://4pda.to/forum/index.php?showtopic=*
// @grant           GM_xmlhttpRequest
// @license         MIT
// @history:ru      когда-то давно: первый релиз
// @history:ru      26.07.2017: допиливание мелочей
// @history:ru      31.07.2017: расширение функционала скрипта: подробная информация о каждом пользователе в топиках
// @history:ru      04.08.2017: добавлено мигание 'NEW' (скрыто)
// @history:ru      02.01.2018: небольшие правки кода
// @history:ru      10.05.2018: изменение списка обновленных приложений
// @history:ru      11.05.2018: мелкие правки и исправления
// @history:ru      20.05.2018: добавлено удаление пробелов в начале и конце названий версий, чтобы из-за пробелов версия не определялась как новая
// @history:ru      16.08.2018: теперь обновления не исчезают с обновлением страницы, для ручного скрытия обновлений добавлена кнопка
// @history:ru      17.08.2018: правка вчерашних ошибок, добавление мелочей (title и переход к последнему непрочитанному сообщению в теме
// @history:ru                  обновленного приложения); реализация скрытия обновлений по одному: убрад мигание NEW для обновлений, т.к. уже неактуально
// @history:ru      20.08.2018: починен показ кнопки скрытия отдельного обновления; в консоли выводится объем загруженого XHR-запросами траффика
// @history:ru      06.05.2019: кроме слова 'версия' другой текст, если он был, не удалялся, поправлено
// @history:ru      01.06.2019: слово 'версия' не заменялось на 'v.', если после него не было пробела. Недоработка в регулярках. Поправлено
// @history:ru      02.06.2019: добавлена функция отключения проверки обновлений для выбранных приложений (могут быть ошибки)
// @history:ru      14.02.2020: исправлена ошибка, при которой выводился текст на месте версии
// @history:ru      05.07.2022: исправлена ошибка в коде, из-за которой таблица с обновленными версиями приложений появлялась снова после скрытия
// @history:ru      09.06.2023: мелкие и незначительные правки для обеспечения полной работоспособности скрипта, наверное...
// @history:ru      25.05.2025: в таблицу обновлений (в том числе и в таблицу ЧС) добавлен столбец с датами последнего обновления приложения/игры;
// @history:ru                  убрал в таблице для версий приставку 'v.' за ненадобностью
// @history:ru                  ВНИМАНИЕ: некоторые приложения, относящие к VPN, не будут подгружаться в таблицу обновлений и показывать версии,
// @history:ru                  т.к. могут быть проблемы с доступом к этим темам без включенного VPN
// @description     Вывод версий приложений в Избранном 4pda, показ обновленных приложений
// @downloadURL https://update.greasyfork.org/scripts/383001/Versions%204pda.user.js
// @updateURL https://update.greasyfork.org/scripts/383001/Versions%204pda.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //============================================================
    // получение ссылки текущей страницы
    var URL = window.document.URL;
    //log(URL);
    //============================================================
    // удаляем рекламу и центрируем логотип 4pda
    var tbody = document.getElementsByTagName('tbody')[0],
        td = tbody.getElementsByTagName('td');
    td[1].remove();
    td[0].align = 'center';
    //============================================================
    var favURL = '4pda.to/forum/index.php?act=fav', i,
        head = document.getElementsByTagName('head')[0];
    //var topicURL = 'http://4pda.to/forum/index.php?showtopic=';

    // спойлер с объявлениями всегда скрыт
    if(document.querySelector('#gc_1, #go_1')) {
        document.querySelector('#go_1').style.display = 'none';
        document.querySelector('#gc_1').style.display = 'none';
    }
    var l = 0,        // счетчик
        totalKB = 0,
        totalMB = 0;

    function log(text) {
        return console.log(text);
    }

    // Избранное
    if (~URL.indexOf(favURL))
    {
        //localStorage
        //localStorage.clear();
        //============================================================
        // модифицирование встроенной функции модерации тем в своем избранном
        var savedIDs,
            form = document.querySelector('#fav-sel-form'),
            select = form.querySelector('select'),
            option = document.createElement('option'),
            values = '';
        option.value = 'not_show_updates';
        option.innerHTML = 'Не уведомлять об обновлениях (mod)';
        select.insertBefore(option, select.firstChild);

        // сохранение IDов выбранных тем в localStorage
        option.onclick = function() {
            checkSavedIDs();
            if(savedIDs == '-1') {
                values = form.querySelector('input').value;
            } else {
                values = savedIDs + ',' + form.querySelector('input').value;
            }
            values = values.split(',');
            values = unique(values);
            localStorage.setItem('savedIDs', values);
            checkBan();
        }

        // удаление из массива одинаковых IDов
        function unique(arr) {
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i];
                obj[str] = true; // запомнить строку в виде свойства объекта
            }
            return Object.keys(obj); // или собрать ключи перебором для IE8-
        }

        checkSavedIDs();
        function checkSavedIDs() {
            if(localStorage.getItem('savedIDs') === null) {
                localStorage.setItem('savedIDs', '-1');
            }
            savedIDs = localStorage.getItem('savedIDs');
            savedIDs = savedIDs.split(',');
        }

        // добавление в строке названий приложений их версий
        var ver;
        // находим таблицу
        var tbl = document.getElementsByClassName('ipbtable')[0];
        var tbody2 = tbl.getElementsByTagName('tbody')[0];
        var _tr = tbody2.getElementsByTagName('tr');
        // запихиваем в tr нужные нам строки таблицы
        var tr = [], id;
        for(i=0; i<_tr.length; i++)
        {
            if (_tr[i].hasAttribute('data-item-fid')) { // отсортировываем из таблицы только темы
                tr.push(_tr[i]);                        // запихиваем в массив tr
            }
        }
        var trLength = tr.length
        var name = [];                                // названия тем
        for (i=0; i<trLength; i++)
        {
            var tmp = tr[i].getElementsByTagName('td')[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0];
            id = tr[i].getAttribute('data-item-fid');
            getVersion(tmp.getAttribute('href'), i, id);
            //getVersion(tmp.href, i);
            name.push(tmp);
        }
        //=====================================================
        // добавление счетчика с количеством новых версий приложений
        var count = 0;
        var main_tbl = document.createElement('table');
        main_tbl.id = 'main_tbl';
        main_tbl.innerHTML = `<tbody><tr><td id="one" style="vertical-align: top;"></td> <td id="two" style="vertical-align: top;"></td></tr></tbody>`;

        var _span = document.createElement('span');
        _span.style.color = 'black';
        var _span2 = document.createElement('span');
        _span2.style.color = 'black';
        var navstrip = document.getElementById('navstrip');
        //=====================================================
        var app_name,
            saveToHideName = [],
            saveToHideVer = [];
        /*_new = ' <mytag class="new" style="color: red"><b>NEW</b></mytag>',*/

        function getVersion(link, i, id)
        {
            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();
            xhr.open('GET', link, true);
            xhr.send();
            xhr.onload = function()
            {
                if(this.readyState === 4)
                {
                    if (this.status === 200)
                    {
                        var response = xhr.responseText;
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response, 'text/html');
                        var tbl = doc.getElementsByClassName('ipbtable');
                        for (var j=0; j<tbl.length; j++)
                        {
                            if (tbl[j].hasAttribute('data-post'))
                            {
                                var tbody = tbl[j].getElementsByTagName('tbody')[0],
                                    tr2 = tbody.getElementsByTagName('tr')[1],
                                    td = tr2.getElementsByTagName('td')[1],
                                    div = td.getElementsByClassName('postcolor')[0],
                                    span = div.getElementsByTagName('span'),
                                    date_i = div.getElementsByTagName('i')[0],
                                    date = date_i.getElementsByTagName('b')[0].innerHTML;
                                //console.log(date.innerHTML);
                                for (var k=0; k<span.length; k++)
                                {
                                    // версии приложений
                                    if (span[k].getAttribute('style') == 'font-size:12pt;line-height:100%')
                                    {
                                        if (~span[k].innerHTML.toLowerCase().indexOf('верси'))
                                        {
                                            // замена
                                            var replace_ver = span[k].innerHTML,
                                                alt_ver, t;
                                            // если тема не была открыта
                                            if (~name[i].innerHTML.indexOf('<strong>'))
                                            {
                                                replace_ver = replace_ver.toLowerCase().replace(/[А-Яа-я\s]*верси[ия]:[\s]*/, 'v.').replace(/<[\/]*b[r]*>/g, '').trim();
                                                if(~replace_ver.indexOf('v.')) {
                                                    alt_ver = replace_ver;
                                                } else {
                                                    alt_ver = '---';
                                                }
                                                var alt_name;
                                                alt_name = name[i].innerHTML.replace(/<[\/]*strong>/g, '');
                                                // если приложение в списке игнорируемых, т.е. не проходит проверку на обновления
                                                t = true;
                                                for(var l=0; l<savedIDs.length; l++) {
                                                    if(id == savedIDs[l]) {
                                                        t = false;
                                                        getBannedApps(alt_name, alt_ver, id, date);
                                                        //continue;
                                                    }
                                                }
                                                // если приложение не в игноре + сравнение версий: текущей полученной и сохраненной в локальном хранилище
                                                if (t && alt_ver.localeCompare(localStorage.getItem(alt_name)) !== 0) {
                                                    showNotif(alt_name, alt_ver, date);
                                                    //console.log(name[i].innerHTML, alt_ver);
                                                }
                                            }
                                            // если тема была открыта и просмотрена
                                            else
                                            {
                                                replace_ver = replace_ver.toLowerCase().replace(/<b>[А-Яа-я\s]*верси[ия]:[\s]*/, 'v.').replace(/<[\/]*b>/g, '').trim();
                                                if(~replace_ver.indexOf('v.')) {
                                                    alt_ver = replace_ver;
                                                } else {
                                                    alt_ver = '---';
                                                }
                                                // если приложение в списке игнорируемых, т.е. не проходит проверку на обновления
                                                t = true;
                                                for(l=0; l<savedIDs.length; l++) {
                                                    if(id == savedIDs[l]) {
                                                        t = false;
                                                        getBannedApps(name[i].innerHTML, alt_ver, id, date);
                                                        //continue;
                                                    }
                                                }
                                                // если приложение не в игноре + сравнение версий: текущей полученной и сохраненной в локальном хранилище
                                                if (t && alt_ver.localeCompare(localStorage.getItem(name[i].innerHTML)) !== 0 ) {
                                                    showNotif(name[i].innerHTML, alt_ver, date);
                                                }
                                            }
                                            // вывод обновленных приложений вверху
                                            function showNotif(alt_name, alt_ver, date) {
                                                hideBtn.style.display = 'inline';    // показываем скрытую кнопку, если есть обновления
                                                //replace_ver += _new;               // прибавляем тэг 'NEW' для новой версии
                                                count++;
                                                var goto = '<a href="'+link+'&amp;view=getnewpost"><img src="//4pda.to/s/PXtiWhZDsz1g8WshSfmv6ItmpiBfFE4lDMF4ZupTkMv.gif" alt=">N" title="Перейти к первому непрочитанному" border="0"></a> '
                                                app_name = goto + '<a href="'+link+'" title="Перейти к первому сообщению">'+alt_name + '</a>';
                                                saveToHideName.push(alt_name);
                                                saveToHideVer.push(alt_ver);
                                                showUpdates(app_name, alt_ver, date);
                                            }
                                            // если replace_ver содержит готовый шаблон "v.xxx", добавляем его к названию приложения
                                            if(~replace_ver.indexOf('v.')) {
                                                replace_ver = '<font color="#8A2BE2"> ' + replace_ver + '</font>'; // добавление цвета для наглядности
                                                name[i].innerHTML += replace_ver;
                                            }
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            };
            xhr.onerror = function() {
                log('onerror');
                alert('Ошибка');
            };
            xhr.onloadend = function(event) {
                //log('onloadend');
                totalKB += (event.loaded/1024); // подсчет загруженного траффика
                totalMB += (event.loaded/1024/1024);
                if(++l === trLength) {
                    addEvent(); // вешаем обработчик событий строки (появление/скрытие кноки "Скрыть")
                    hideApp();  // скрытие строки с обновленным приложением
                    console.log('Скачано XHR-запросами:', totalKB.toFixed(2), 'КБ |', totalMB.toFixed(2), 'МБ'); // вывод объема скачанного
                }
            };
            xhr.onprogress = function(event) {
                //log('onprogress');
            };
        }
        // переопределяем стиль для кнопок
        var btnStyle = document.createElement('style');
        btnStyle.type = 'text/css';
        var _s = `
.myBtn {
display: inline-block;
font-family: arial,sans-serif;
font-size: 10px;
font-weight: bold;
color: rgb(68,68,68);
text-decoration: none;
user-select: none;
padding: .1em 1.2em;
outline: none;
border: 1px solid rgba(0,0,0,.1);
border-radius: 2px;
background: rgb(245,245,245) linear-gradient(#f4f4f4, #f1f1f1);
transition: all .218s ease 0s;
}
.myBtn:hover {
color: rgb(24,24,24);
border: 1px solid rgb(198,198,198);
background: #f7f7f7 linear-gradient(#f7f7f7, #f1f1f1);
box-shadow: 0 1px 2px rgba(0,0,0,.1);
}
.myBtn:active {
color: rgb(51,51,51);
border: 1px solid rgb(204,204,204);
background: rgb(238,238,238) linear-gradient(rgb(238,238,238), rgb(224,224,224));
box-shadow: 0 1px 2px rgba(0,0,0,.1) inset;
}`;
        var _st = document.createTextNode(_s);
        btnStyle.appendChild(_st);
        head.appendChild(btnStyle);

        //navstrip.appendChild(_span);
        navstrip.appendChild(main_tbl);
        var one = document.querySelector('#main_tbl #one'),
            two = document.querySelector('#main_tbl #two');
        one.appendChild(_span);
        two.appendChild(_span2);

        _span.innerHTML = 'Обновлений: <font id="_cnt" color="red">' + count + '</font> <input id="hideBtn" class="myBtn" type="button" value="Скрыть обновления" style="display: none;" /> <br/>' +
            `<table class="_tbl" style="border-collapse: collapse; border: 0px">
<thead> <tr> <th class="brown-right-line">#</th> <th class="brown-right-line">Название</th> <th class="brown-right-line">Версия</th> <th title="Дата последнего обновления" class="date">Дата обновления</th> </tr> </thead>
<tbody> </tbody>
</table>`;
        var _tbl = document.querySelector('._tbl'),
            _tbody = _tbl.querySelector('tbody'),
            _cnt = document.querySelector('#_cnt'),
            n = 0;
        _tbl.style.display = 'none';

        var tblStyle = document.createElement('style');
        tblStyle.type = 'text/css';
        var s = `
._tbl th {
color: brown; background-color: white; text-align: center; padding: 2px; letter-spacing: 0px;
}
._tbl td {
font-size: 10px; padding: 0 5px;
}
._tbl .brown-right-line {
border-right: 1px solid;
}
._tbl .date {
padding-left: 5px;
padding-right: 5px;
}
._tbl .black-right-line {
border-right: 1px solid;
}`;
        var st = document.createTextNode(s);
        tblStyle.appendChild(st);
        head.appendChild(tblStyle);

        // кнопка скрытия обновлений вручную
        var hideBtn = document.querySelector('#hideBtn');
        hideBtn.onclick = function() {
            hideBtn.style.display = 'none';
            // сразу сохраняем обновленные версии в память, чтобы при следующем обновлении не всплыли в таблице обновлений
            for(var i=0; i<saveToHideName.length; i++) {
                localStorage.setItem(saveToHideName[i], saveToHideVer[i]);
            }
            // скрываем таблицу с обновлениями и обнуляем счетчик
            _tbl.style.display = 'none';
            count = 0;
            _cnt.innerHTML = count;
            for(; _tbody.querySelectorAll('tr').length > 0;) {
                _tbl.deleteRow(1);
            }
        }

        _span2.innerHTML = '<div id="ban"> <input id="showBanList" class="myBtn" type="button" value="Показать ЧС" /> <input id="clearBanList" class="myBtn" type="button" value="Очистить ЧС" disabled /> </div>' +
            `<table class="_tbl" id="ban_tbl" style="border-collapse: collapse; border: 0px; display: none;">
<thead> <tr> <th class="brown-right-line">#</th> <th class="brown-right-line">Название</th> <th class="brown-right-line">Версия</th> <th class="brown-right-line">ID темы</th> <th title="Дата последнего обновления" class="date">Дата обновления</th> </tr> </thead>
<tbody id="tbody2"> </tbody>
</table>`;
        checkBan();
        function checkBan() {
            var tb = document.querySelector('#tbody2');
            if(savedIDs.length > 0 && savedIDs[0] !== '-1') {
                _span2.style.display = '';
            } else {
                _span2.style.display = 'none';
            }
        }

        var showBanList = document.querySelector('#showBanList'),
            clearBanList = document.querySelector('#clearBanList'),
            ban_tbl = document.querySelector('#ban_tbl');
        showBanList.onclick = function() {
            if(ban_tbl.style.display == 'none') {
                ban_tbl.style.display = 'block';
                showBanList.value = 'Скрыть ЧС';
                clearBanList.disabled = false;
                clearBanList.style.textDecoration = '';
            } else {
                ban_tbl.style.display = 'none';
                showBanList.value = 'Показать ЧС';
                clearBanList.disabled = true;
                clearBanList.style.textDecoration = 'line-through';
                //clearBanList.style.setProperty("text-decoration", "line-through");
            }
        }
        clearBanList.style.textDecoration = 'line-through';
        clearBanList.onclick = function() {
            localStorage.setItem('savedIDs', '-1');
            checkSavedIDs();
            //log(savedIDs);
        }

        // добавлению в таблицу скрытых приложений, их версии и id их темы
        var num = 0;
        function getBannedApps(app_name, ver, id, date) {
            num++;
            ver = ver.replace('v.', '');
            var _tbody2 = document.querySelector('#tbody2');
            var row =_tbody2.insertRow(-1),
                cell1 = row.insertCell(-1), // #
                cell2 = row.insertCell(-1), // Название
                cell3 = row.insertCell(-1), // Версия
                cell4 = row.insertCell(-1), // ID темы
                cell5 = row.insertCell(-1), // Дата обновления
                cell6 = row.insertCell(-1); // Скрыть
            row.className = 'myTr';
            cell1.className = 'black-right-line one';
            cell2.className = 'black-right-line';
            cell3.className = 'black-right-line';
            cell4.className = 'black-right-line';
            cell1.innerHTML = num;
            cell2.innerHTML = app_name;
            cell3.innerHTML = ver;
            cell4.innerHTML = id;
            cell5.innerHTML = date;
            cell6.innerHTML = '<input class="myBtn hidden" type="button" value="Удалить" style="display: none;">';
        }

        // показ количества обновлений и вывод их в таблице
        function showUpdates(app_name, ver, date)
        {
            _tbl.style.display = 'block';
            n++;
            ver = ver.replace('v.', '');
            var row = _tbody.insertRow(-1),
                cell1 = row.insertCell(-1), // #
                cell2 = row.insertCell(-1), // Название
                cell3 = row.insertCell(-1), // Версия
                cell4 = row.insertCell(-1), // Дата обновления
                cell5 = row.insertCell(-1); // Скрыть
            row.className = 'myTr';
            cell1.className = 'black-right-line one';
            cell2.className = 'black-right-line';
            cell3.className = 'black-right-line';
            cell1.innerHTML = n; _cnt.innerHTML = count;
            cell2.innerHTML = app_name;
            cell3.innerHTML = ver;
            cell4.innerHTML = date;
            cell5.innerHTML = '<input class="myBtn hidden" type="button" value="Скрыть" style="display: none;">';
        }

        function addEvent() {
            var myTr = document.querySelectorAll('.myTr');
            for(var i=0; i<myTr.length; i++) {
                myTr[i].addEventListener('mouseover', function showButton() {
                    this.querySelector('.hidden').style.display = 'block';
                });
                myTr[i].addEventListener('mouseout', function hideButton() {
                    this.querySelector('.hidden').style.display = 'none';
                });
            }
        }

        function hideApp() {
            var hBut = document.querySelectorAll('.myBtn.hidden');
            for(var i=0; i<hBut.length; i++) {
                hBut[i].onclick = function() {
                    var n = this.parentNode.parentNode.firstChild.innerHTML
                    if(this.value === 'Скрыть') {
                        var name = this.parentNode.parentNode.children[1].children[1].innerHTML,
                            ver = this.parentNode.parentNode.children[2].innerHTML;
                        localStorage.setItem(name, ver);
                        // сброс # таблицы и удаление строк(и)
                        _tbl.deleteRow(n);
                        let num = _tbl.querySelectorAll('td.one');
                        // если было скрыто последнее обновление, скрываем шапку таблицы и кнопку "Скрыть обновления"
                        if(num.length === 0) {
                            _tbl.style.display = 'none';
                            hideBtn.style.display = 'none';
                        }
                        for(var j=0; j<num.length; j++) {
                            num[j].innerHTML = j+1;
                        }
                        _cnt.innerHTML = j;
                    } else {
                        let id = this.parentNode.parentNode.children[3].innerHTML,
                            arr = localStorage.getItem('savedIDs');
                        arr = arr.split(',');
                        for(let k=0; k<arr.length; k++) {
                            if(id === arr[k]) {
                                arr.splice(k, 1);
                            }
                        }
                        if(arr.length !== 0) {
                            localStorage.setItem('savedIDs', arr);
                        } else {
                            localStorage.setItem('savedIDs', '-1');
                        }

                        // сброс # таблицы и удаление строк(и)
                        ban_tbl.deleteRow(n);
                        let num = ban_tbl.querySelectorAll('td.one');
                        // если было скрыто последнее обновление, скрываем шапку таблицы и кнопку "Скрыть обновления"
                        if(num.length === 0) {
                            ban_tbl.style.display = 'none';
                            var banBtns = document.querySelector('#ban');
                            banBtns.style.display = 'none';
                        }
                        for(j=0; j<num.length; j++) {
                            num[j].innerHTML = j+1;
                        }
                    }
                }
            }
        }
        //==========================================================================
        // мигание 'NEW' // уже неактуально
        /*function mig()
        {
            var isRed = true;
            var nw = document.querySelectorAll('.new');
            var dln = nw.length;
            if (dln !== 0)
            {
                var morganie = setInterval(function() {
                    if (isRed)
                    {
                        for (i=0; i<dln; i++)
                        {
                            nw[i].style.color = 'blue';
                        }
                        isRed = false;
                    }
                    else
                    {
                        for (i=0; i<dln; i++)
                        {
                            nw[i].style.color = 'red';
                        }
                        isRed = true;
                    }
                }, 300);
            }
        }*/
    }
    else
    {
        // Топики
        var post = document.querySelectorAll('.postdetails > center'),
            userLink = document.getElementsByClassName('normalname'),
            link = [], // собираем все ссылки на профили
            ulLength = userLink.length;

        for (i=0; i<ulLength; i++)
        {
            getUserData(userLink[i].querySelector('a').getAttribute('href'), i);
        }
        //==========================================================================
        var data0, data1, data2, data3; // пол, город, дата рождения, местное время
        // создание области для новых данных
        var div = document.createElement('div');
        div.style.border = '1px solid lightblue';
        div.style.padding = '5px';
        div.id = 'myDiv';

        // Стиль для новой области
        var style = document.createElement('style');
        style.type = 'text/css';
        var h = '#myDiv:hover {background: PaleTurquoise; color: blue; font-size: 10pt;}';
        var hover = document.createTextNode(h);
        style.appendChild(hover);
        //head = document.getElementsByTagName('head')[0];
        head.appendChild(style);

        function getUserData(link, i) {
            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();
            xhr.open('GET', link, true);
            xhr.send();
            xhr.onload = function()
            {
                if(this.readyState === 4)
                {
                    if (this.status === 200)
                    {
                        var response = xhr.responseText;
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response, 'text/html');
                        var main = doc.getElementsByClassName('info-list width1 black-link')[0];
                        main.style.marginLeft = 0;
                        main.style.paddingLeft = 0;
                        main.style.display = 'block';
                        main.style.listStyle = 'none';
                        var t = main.querySelectorAll('li'),
                            tt = '';
                        for (var l=0; l<t.length; l++)
                        {
                            tt += t[l].innerHTML.replace(/<[^>]+>/g,'').replace(/(Город:)/, '$1 ').replace(/(юзера:)/, '$1 ').replace(/(рождения:)/, '$1 ') + '<br/>';
                        }
                        insertData(tt, i);
                    }
                }
            };
            xhr.onerror = function() {
                log('error');
                alert('Ошибка');
            };
            xhr.onloadend = function(event) {
                //log('onloadend');
                totalKB += (event.loaded/1024); // подсчет загруженного траффика
                totalMB += (event.loaded/1024/1024);
                if(++l === ulLength) {
                    log('Скачано XHR-запросами:', totalKB.toFixed(2), 'КБ |', totalMB.toFixed(2), 'МБ'); // вывод объема скачанного
                }
            };
        }

        //==========================================================================
        function insertData(data0, i) {
            div.innerHTML = data0;
            post[i].appendChild(div.cloneNode(true));
        }
    }
})();