// ==UserScript==
// @name           Crypto Labs
// @version        1.00
// @description    Выделение тех лаборатоий, в которых надо нажать кнопки, что бы продолжить исследования
// @include        https://*virtonomic*.ru/crypto/main/company/view/*/unit_list
// @include        https://virtonomic*.*/crypto/main/company/view/*
// @exclude        https://virtonomic*.*/crypto/main/company/view/*/unit_list/equipment
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/372654/Crypto%20Labs.user.js
// @updateURL https://update.greasyfork.org/scripts/372654/Crypto%20Labs.meta.js
// ==/UserScript==
(function () {
    var n = 0;
    var unit_storage, id; //Для скрипта накрутки лаб

    function find_lab( mode ) {

        //Блок считывания технологий и ссылок на них
        var researchList = [];
        var researchListLink = [];
        var k = 0;

        $.ajax({
            url: 'https://virtonomica.ru/crypto/main/common/main_page/game_info/industry',
            type: "GET",
            async: false,
            success: function(html){
                var storage = $(html);
                storage.find('td[width="25%"]').each(function(){
                    var researchName = $('a', this).eq(1).text().replace(/[^A-Za-zА-Яа-яЁё]/g,'');
                    var link = $('a', this).eq(1)[0].href.replace(/\D/g,'');
                    //var researchLink = $('a', this).eq(1)['0'].href.replace(/\D/g,'');
                    researchList[k] = researchName;
                    researchListLink[k] = link;
                    k++;
                });
            }
        });
        //----


        n = 0;
        find = input.val();
        var show = 0;


        var i = 0;
        var l = 0;
        var arr = [];
        var stageThreeLab = -1;
        var check = 0; //Для перехода с 1 на 2

        $('td[class="info i-lab"]').each(function() {
            if ($(this).text().replace(/[^A-Za-zА-Яа-яЁё]/g,'') != arr[i-1]) { arr[i] = $(this).text().replace(/[^A-Za-zА-Яа-яЁё]/g,''); i += 1; }
            $('a', this).text($(this).text().replace(/[^A-Za-zА-Яа-яЁё]/g,''));
        });

        for (var k = 0; k < i; k++) {
            stageThreeLab = -1;
            l = 0;
            techLevel = 0;
            $('td[class="info i-lab"]:contains(' + arr[k] + ')').each(function(i) {
                if (show == 1) { return; }

                str = $(this).siblings('td.spec').text();
                if ( str.length > 0) {
                    pos_begin = str.indexOf('%');
                    if ( pos_begin != -1){
                        str1 = str.substr(0, pos_begin);//Текущий прогресс
                        pr = parseFloat(str1);//Текущий прогресс в виде числа
                        str2 = str.substr(pos_begin+1);//Название исследуемой технологии вместе с уровнем
                        pos2 = str2.indexOf('.');
                        st = parseInt( str2.substr(pos2+1) );//Стадия
                        lev = parseInt( str2.substr(0,pos2) );//Уровень
                    }
                }
                per = $(this).siblings('td.prod').text().replace(/[^%]/g,'');
                per == '%' ? per = 1 : per = 0;//Что-то с эффективностью

                if ( ( pr == 0)  && ( pos2 == -1) && (per == 1) ){
                    show = 1;

                    //Получаем последнюю техну для последующего запуска лаб
                    l = 0;
                    $.each(researchList, function(j) {
                        if (arr[k] == researchList[j]) { l = j; return false; }
                    });

                    $.ajax({
                        url: 'https://virtonomica.ru/api/crypto/main/unittype/technologies?app=virtonomica&format=json&ajax=1&id=' + researchListLink[l] + '&company_id=7854336&wrap=0',
                        type: "get",
                        async: false,
                        success:function(json){
                            $.each(json, function(j) {
                                if (json[j].status == '1') { techLevel = +(json[j].level) + 1; }
                            });
                        }
                    });
                }
                // завершена 1 стадия
                if  ( (st == 1) && (pr == 100) ){
                    show = 1;
                }
                // завершена 2 стадия
                if  ( (st == 3) && (pr == 0) ){
                    show = 1;
                    stageThreeLab = i;
                }
            });
            $('td[class="info i-lab"]:contains(' + arr[k] + ')').each(function(i) {
                var link = $('a', this)[0].href;
                if (show == 0) { $(this.parentNode).remove(); }
                //else { $(this.parentNode).show(); }

                str = $(this).siblings('td.spec').text();
                if ( str.length > 0) {
                    pos_begin = str.indexOf('%');
                    if ( pos_begin != -1){
                        str1 = str.substr(0, pos_begin);
                        pr = parseFloat(str1);
                        str2 = str.substr(pos_begin+1);
                        pos2 = str2.indexOf('.');
                        st = parseInt( str2.substr(pos2+1) );
                        lev = parseInt( str2.substr(0,pos2) );
                    }
                }
                per = $(this).siblings('td.prod').text().replace(/[^%]/g,'');
                per == '%' ? per = 1 : per = 0;

                //Первая стадия во вторую
                if ((show == 1) && (st == 1) && (pr == 100)) {
                    id = $('a', this)[0].href.replace(/\D/g,'');
                    unit_storage += 'https://virtonomica.ru/crypto/main/unit/help/' + id + '/invent\n';

                    var len = $('td[class="info i-lab"]:contains(' + arr[k] + ')').length;
                    if (len == 1) {
                        $.ajax({
                            url: link + '/investigation',
                            type: "get",
                            async: false,
                            success: function(html){
                                var storageLab = $(html);
                                var url = this.url;
                                var hypo = storageLab.find('input[name="selectedHypotesis"]').eq(2).val();
                                $.ajax({
                                    url: url,
                                    type: "post",
                                    async: false,
                                    data: 'selectedHypotesis=' + hypo + '&selectIt=Выбрать+гипотезу'
                                });
                            }
                        });
                    }
                    if (len != 1) { check = 1; }
                    /*$.ajax({
                        url: 'https://virtonomica.ru/olga/ajax/unit/artefact/attach/?unit_id=' + $('a', this)[0].href.replace(/\D/g,'') + '&artefact_id=302782&slot_id=300141',
                        type: "get",
                        async: false
                    });*/
                }

                //Третья в первую
                if ((show == 1) && ( pr == 0)  && ( pos2 == -1)) {
                    id = $('a', this)[0].href.replace(/\D/g,'');
                    unit_storage += 'https://virtonomica.ru/crypto/main/unit/help/' + id + '/invent\n';

                    $.ajax({
                        url: 'https://virtonomica.ru/olga/window/unit/view/' + $('a', this)[0].href.replace(/\D/g,'') + '/project_create',
                        type: "post",
                        async: false,
                        data: 'unit_type=' + researchListLink[l] + '&level=' + techLevel + '&create=Изобрести'
                    });
                    /*$.ajax({
                        url: 'https://virtonomica.ru/olga/ajax/unit/artefact/attach/?unit_id=' + $('a', this)[0].href.replace(/\D/g,'') + '&artefact_id=302766&slot_id=300141',
                        type: "get",
                        async: false
                    });*/
                }

                //Вторая в третью
                if ((show == 1) && (stageThreeLab != -1) && (i != stageThreeLab)) {
                    id = $('a', this)[0].href.replace(/\D/g,'');
                    unit_storage += 'https://virtonomica.ru/crypto/main/unit/help/' + id + '/invent\n';

                    $.ajax({
                        url: 'https://virtonomica.ru/olga/main/unit/view/' + $('a', this)[0].href.replace(/\D/g,'') + '/project_current_stop',
                        type: "get",
                        async: false
                    });
                    /*$.ajax({
                        url: 'https://virtonomica.ru/olga/ajax/unit/artefact/remove/?unit_id=' + $('a', this)[0].href.replace(/\D/g,'') + '&artefact_id=302792&slot_id=300141',
                        type: "get",
                        async: false
                    });*/
                }
                if ((show == 1) && (stageThreeLab != -1) && (i == stageThreeLab)) {
                    /*$.ajax({
                        url: 'https://virtonomica.ru/olga/ajax/unit/artefact/attach/?unit_id=' + $('a', this)[0].href.replace(/\D/g,'') + '&artefact_id=302792&slot_id=300141',
                        type: "get",
                        async: false
                    });*/
                }

            });
            show = 0;
        }
        if (check == 0) { alert('Готовчик'); console.log(unit_storage); }
        else { alert('Attention!'); }

    }
    //var container = $('#mainContent tr:first > td:first');
    var container = $("td.u-l").parent().parent();

    var panel = $("#extension_panel");
    if ( panel.length  == 0 ) {
        // добавить панель, если её еще нет
        var ext_panel = "<div style='padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; float:left; white-space:nowrap; color:#0184D0; display:none;'  id=extension_panel></div>";
        container.append( "<tr><td>" +ext_panel );
    }

//var input = $('<select>').append('<option value=0>&nbsp;</option>').append('<option value=5>техны ниже 9</option>').append('<option value=17>техны выше  16</option>').append('<option value=3>больше 80%</option>').append('<option value=2>больше 90%</option>').append('<option value=10>меньше 20%</option>').append('<option value=1>найти</option>').change( function() { find_lab(); }).append('<option value=4>найти (+заметки)</option>').change( function() { find_lab('' ); });
    var input = $('<button>').append('<a>Лабы</a>').click( function() { find_lab(); });

// Изучаемые технологии
    labs = $("td.spec");
    var list = new Object();
    var tag = 1;
    for (i=0; i<labs.length; i++){
        str = labs.eq(i).html();
        //console.log(str);
        n = str.lastIndexOf("</b>");
        if (n == -1) continue;
        name = str.substr(n+4, str.length);
        //console.log(name);
        name.replace("\n", "").replace("\r", "");

        if ( list[name] != null) {
            list[name]++;
            continue;
        }
        list[name] = 1;
        //tag++;
    }

// сортировка объекта как строки
    function sortObj(arr){
        // Setup Arrays
        var sortedKeys = new Array();
        var sortedObj = {};

        // Separate keys and sort them
        for (var i in arr){
            sortedKeys.push(i);
        }
        sortedKeys.sort();

        // Reconstruct sorted obj based on keys
        for (var i in sortedKeys){
            sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
        }
        return sortedObj;
    }
    list = sortObj(list);

    var Filter = $(" <select>").append('<option value=0>&nbsp;</option>').change( function(){
        search = $(this).val();

        $('td.spec').each(function() {
            var show = 0;

            str = $(this).html();
            n = str.lastIndexOf("</b>");
            if (n == -1) return;
            name = str.substr(n+4, str.length);
            name.replace("\n", "").replace("\r", "");

            if (name == search ) show =1;

            if ( show == 0){
                $(this.parentNode).hide();
                // спрятать заметки
                $("div.st").hide();
            } else {
                $(this.parentNode).show();
                $("div.st").show();
            }
        });
    });

    for(name in list){
        str = '<option value="'+ name +'">'+ name;
        if ( list[name] > 1) str+= ' (' + list[name] + ')';
        str+= '</option>';
        Filter.append(str);
    }

// Число подразделений на странице
    var units = $("td.info");
//console.log("units="+units.length);

// число лаборатоий на странице
    var labs = $("td.i-lab");
//console.log("labs="+labs.length);

// если на странице только лаборатории
    if ( labs.length == units.length) {
        $("#extension_panel").append('<div id=science>Исследования: ');
        $("#science").append(input).append(Filter);
        $("#extension_panel").show();
    };

})(window);