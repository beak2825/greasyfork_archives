// ==UserScript==
// @name           Victory: Веселый политик
// @author         BioHazard
// @version        1.01
// @namespace      Virtonomica
// @description    Простой запуск политических проектов
// @include        /^http.:\/\/virtonomica\.ru\/olga\/main\/company\/view\/\d+\/party$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375542/Victory%3A%20%D0%92%D0%B5%D1%81%D0%B5%D0%BB%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/375542/Victory%3A%20%D0%92%D0%B5%D1%81%D0%B5%D0%BB%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    let playerName,
        currentField,
        checkboxValue,
        selectValue,
        presidentAllocation = {},
        governorAllocation = {},
        mayorAllocation = {};

//получение имени пользователя
    localStorage.getItem('playerName')?playerName=localStorage.getItem('playerName'):getPlayerName();

//блок с интерфейсом
    {
        $('#mainContent').prepend('<div id="contentHolder"></div>');
        $('#contentHolder').append('<div>\n' +
            '    <div id="mayorField" style="width: 33%; display: inline-block">\n' +
            '        <button id="mayorStart">Запустить (Мэр)</button>\n' +
            '        <br>\n' +
            '        <button id="mayorSettings">Настройки (Мэр)</button>\n' +
            '        <div id="mayorSettingsField" style="display: none; position: absolute; background: #FFFFE0; padding: 5px; border: solid 1px black">\n' +
            '            <label><input type="checkbox" value="1" checked>Фестиваль</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="2">Индекс образованности +5%</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="3" checked>ЗП +5%</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="4">ЗП -5%</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="5" checked>Размер города +5%</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="6">Обр. и ЗП без изменений</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="10">Миграционная служба</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="20">Договор с профсоюзом</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="12" checked>Утилизация</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="13" checked>Развязка</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="14" checked>Очистные сооружения</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="15" checked>Мониторинг электростанций</label>\n' +
            '            <br><hr>\n' +
            '            <label><input type="checkbox" name="retail">Розница</label>\n' +
            '            <br>\n' +
            '            <label>1: <select>\n' +
            '                <option value="1538">Автомобильные товары</option>\n' +
            '                <option value="359854" selected>Аптека</option>\n' +
            '                <option value="1532">Бакалея</option>\n' +
            '                <option value="423621">Детские товары</option>\n' +
            '                <option value="1533">Одежда и обувь</option>\n' +
            '                <option value="1531">Продукты питания</option>\n' +
            '                <option value="1534">Промышленные товары</option>\n' +
            '                <option value="1535">Товары для дома</option>\n' +
            '                <option value="1536">Электроника</option>\n' +
            '                <option value="1537">Ювелирные изделия</option>\n' +
            '            </select></label>\n' +
            '            <br>\n' +
            '            <label>2: <select>\n' +
            '                <option value="1538" selected>Автомобильные товары</option>\n' +
            '                <option value="359854">Аптека</option>\n' +
            '                <option value="1532">Бакалея</option>\n' +
            '                <option value="423621">Детские товары</option>\n' +
            '                <option value="1533">Одежда и обувь</option>\n' +
            '                <option value="1531">Продукты питания</option>\n' +
            '                <option value="1534">Промышленные товары</option>\n' +
            '                <option value="1535">Товары для дома</option>\n' +
            '                <option value="1536">Электроника</option>\n' +
            '                <option value="1537">Ювелирные изделия</option>\n' +
            '            </select></label>\n' +
            '            <br>\n' +
            '            <label>3: <select>\n' +
            '                <option value="1538">Автомобильные товары</option>\n' +
            '                <option value="359854">Аптека</option>\n' +
            '                <option value="1532">Бакалея</option>\n' +
            '                <option value="423621">Детские товары</option>\n' +
            '                <option value="1533">Одежда и обувь</option>\n' +
            '                <option value="1531" selected>Продукты питания</option>\n' +
            '                <option value="1534">Промышленные товары</option>\n' +
            '                <option value="1535">Товары для дома</option>\n' +
            '                <option value="1536">Электроника</option>\n' +
            '                <option value="1537">Ювелирные изделия</option>\n' +
            '            </select></label>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '\n' +
            '    <div id="governorField" style="width: 33%; display: inline-block">\n' +
            '        <button id="governorStart">Запустить (Губер)</button>\n' +
            '        <br>\n' +
            '        <button id="governorSettings">Настройки (Губер)</button>\n' +
            '        <div id="governorSettingsField" style="display: none; position: absolute; background: #FFFFE0; width: 200px; padding: 5px; border: solid 1px black">\n' +
            '            <label><input type="checkbox" value="1" checked>Эко-75</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="2" checked>Эко-90</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="4" checked>Региональная сельхозавиация</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="6" checked>Рыбнадзор</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="7" checked>Лесничество</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="8" checked>Ветеринарная служба</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="9">Борьба с роскошью</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="10">Регаты</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="11" checked>Реконструкция аэропорта</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="12" checked>Ремонт дорог</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="13" checked>Эко полиция</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="14" checked>Мониторинг электростанций</label>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '\n' +
            '    <div id="presidentField" style="width: 33%; display: inline-block">\n' +
            '        <button id="presidentStart">Запустить (През)</button>\n' +
            '        <br>\n' +
            '        <button id="presidentSettings">Настройки (През)</button>\n' +
            '        <div id="presidentSettingsField" style="display: none; position: absolute; background: #FFFFE0; width: 200px; padding: 5px; border: solid 1px black">\n' +
            '            <label><input type="checkbox" value="1" checked>Закон об образовании</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="2" checked>Жилищное строительство</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="3" checked>Поддержка розницы</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="4" checked>Поддержка спорта</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="5" checked>Поддержка ресторанов</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="6">Мораторий на тендеры</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="8" checked>Эко служба</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="9">Бренд ТМ +1</label>\n' +
            '            <br>\n' +
            '            <label><input type="checkbox" value="10" checked>Транспортная служба</label>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>');
    }
    
    $('#mayorSettings').on('click',function (event) {
        showHide(event);
    });
    $('#governorSettings').on('click',function (event) {
        showHide(event);
    });
    $('#presidentSettings').on('click',function (event) {
        showHide(event);
    });
    
    $('button').css({'width':'220px', 'background-image':'url("https://virtonomica.ru/img/button/220.gif")', 'height':'24px', 'padding-bottom':'2px', 'border':'0'});

    $('#presidentStart').on('click', startPresidentProjects);
    $('#governorStart').on('click', startGovernorProjects);
    $('#mayorStart').on('click', startMayorProjects);
    
    function startPresidentProjects() {
        $.each(JSON.parse(localStorage.getItem('president')), function(key){
            //проекты
            $('#presidentSettingsField input:checked').each(function(){
                checkboxValue = $(this).val();
                $.ajax({
                    url: 'https://virtonomica.ru/olga/main/politics/money_project/'+key+'/'+checkboxValue,
                    async: false
                });
            });
        });
    }
    function startGovernorProjects() {
        $.each(JSON.parse(localStorage.getItem('governor')), function(key){
            //проекты
            $('#governorSettingsField input:checked').each(function(){
                checkboxValue = $(this).val();
                $.ajax({
                    url: 'https://virtonomica.ru/olga/main/politics/money_project/'+key+'/'+checkboxValue,
                    async: false
                });
            });
        });
    }
    function startMayorProjects() {
        $.each(JSON.parse(localStorage.getItem('mayor')), function(key){
            //проекты
            $('#mayorSettingsField input:checked:not([name=retail])').each(function(){
                checkboxValue = $(this).val();
                $.ajax({
                    url: 'https://virtonomica.ru/olga/main/politics/money_project/'+key+'/'+checkboxValue,
                    async: false
                });
            });
            //розница
            if ($('[name=retail]').is(':checked')) {
                $('#mayorSettingsField select').each(function(){
                    selectValue = $(this).val();
                    $.ajax({
                        url: 'https://virtonomica.ru/olga/main/politics/retail_project/'+key+'/'+selectValue,
                        async: false
                    });
                });
            }
        });
    }

//блок - сканирует занятые посты, записывает в localStorage
    {
        $.getJSON('https://virtonomica.ru/api/olga/main/geo/country/browse', function(data){
            $.each(data, function(key, val){
                if (val['president']) {
                    if (val['president']['president_name'] === playerName) {
                        presidentAllocation[key] = val['name'];
                    }
                }
            });
            localStorage.setItem('president', JSON.stringify(presidentAllocation));
        });
        $.getJSON('https://virtonomica.ru/api/olga/main/geo/region/browse', function(data){
            $.each(data, function(key, val){
                if (val['governor']) {
                    if (val['governor']['governor_name'] === playerName) {
                        governorAllocation[key] = val['name'];
                    }
                }
            });
            localStorage.setItem('governor', JSON.stringify(governorAllocation));
        });
        $.getJSON('https://virtonomica.ru/api/olga/main/geo/city/browse', function(data){
            $.each(data, function(key, val){
                if (val['mayor']) {
                    if (val['mayor']['mayor_name'] === playerName) {
                        mayorAllocation[key] = val['city_name'];
                    }
                }
            });
            localStorage.setItem('mayor', JSON.stringify(mayorAllocation));
        });
    }
//показать или спрятать блок с информацией
    function showHide(event) {
        currentField = $('#'+event.target.id+'Field');
        if(currentField.css('display')==='none'){
            currentField.css('display', 'inline-block')
        }
        else currentField.css('display', 'none')
    }
//запрос API на получение имени пользователя
    function getPlayerName () {
        $.getJSON('https://virtonomica.ru/api/olga/main/my/company',function (data) {
            playerName = data['president_first_name'];
            localStorage.setItem('playerName',playerName);
        })
    }
})(window);