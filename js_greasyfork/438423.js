// ==UserScript==
// @name     Retail Support Info
// @description Сбор информации о текущих проектах поддержки розницы
// @description Передача этой информации на сервер
// @include     https://virtonomica.ru/vera/main/politics/mayor/*/retail
// @version  0.02
// @grant    none
// @license MIT
// @namespace https://greasyfork.org/users/2055
// @downloadURL https://update.greasyfork.org/scripts/438423/Retail%20Support%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/438423/Retail%20Support%20Info.meta.js
// ==/UserScript==
var run = function() {
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    // API
    let API_ADD_CITY_INFO = "https://test.pbliga.com/virta/polit.php?action=add";

    // иконки
    let ico_retail = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="" fill="none"></path><g><path d="M16.125,59.125h139.75v107.5h-139.75z" fill="#dbf2ff"></path><path d="M150.5,64.5v96.75h-129v-96.75h129M161.25,53.75h-150.5v118.25h150.5v-118.25z" fill="#7496c4"></path><path d="M21.5,139.75h129v21.5h-129z" fill="#b5ddf5"></path><path d="M11.47025,28.67025h149.07025v5.72975h-149.07025z" fill="#967a44"></path><path d="M102.125,102.125h32.25v64.5h-32.25z" fill="#8bb7f0"></path><path d="M129,107.5v53.75h-21.5v-53.75h21.5M139.75,96.75h-43v75.25h43v-75.25z" fill="#4e7ab5"></path><path d="M37.625,102.125h43v32.25h-43z" fill="#8bb7f0"></path><path d="M75.25,107.5v21.5h-32.25v-21.5h32.25M86,96.75h-53.75v43h53.75v-43z" fill="#4e7ab5"></path><g><path d="M150.5,80.625c-4.5795,0 -8.987,-2.03175 -12.07225,-5.57925c-1.032,-1.161 -2.494,-1.83825 -4.05275,-1.83825c-1.55875,0 -3.02075,0.6665 -4.05275,1.83825c-3.08525,3.5475 -7.49275,5.57925 -12.07225,5.57925c-4.5795,0 -8.987,-2.03175 -12.07225,-5.57925c-1.032,-1.161 -2.494,-1.83825 -4.05275,-1.83825c-1.55875,0 -3.02075,0.67725 -4.05275,1.83825c-3.08525,3.5475 -7.49275,5.57925 -12.07225,5.57925c-4.5795,0 -8.987,-2.03175 -12.07225,-5.57925c-1.032,-1.161 -2.494,-1.83825 -4.05275,-1.83825c-1.55875,0 -3.02075,0.67725 -4.05275,1.83825c-3.08525,3.5475 -7.49275,5.57925 -12.07225,5.57925c-4.5795,0 -8.987,-2.03175 -12.07225,-5.57925c-1.032,-1.161 -2.494,-1.83825 -4.05275,-1.83825c-1.55875,0 -3.02075,0.67725 -4.05275,1.83825c-3.08525,3.5475 -7.49275,5.57925 -12.07225,5.57925c-8.89025,0 -16.125,-7.23475 -16.125,-16.125v-9.4815l10.18025,-20.37125c0.3655,-0.74175 0.56975,-1.55875 0.56975,-2.39725v-16.125h139.75v16.125c0,0.8385 0.20425,1.6555 0.56975,2.408l10.18025,20.3605v9.4815c0,8.89025 -7.23475,16.125 -16.125,16.125z" fill="#f78f8f"></path><path d="M150.5,21.5v10.75c0,1.66625 0.387,3.311 1.1395,4.80525l9.6105,19.23175v8.213c0,5.92325 -4.82675,10.75 -10.75,10.75c-4.13875,0 -6.80475,-2.3435 -8.03025,-3.741c-2.0425,-2.33275 -4.988,-3.6765 -8.09475,-3.6765c-3.10675,0 -6.05225,1.34375 -8.09475,3.6765c-1.2255,1.3975 -3.8915,3.741 -8.03025,3.741c-4.13875,0 -6.80475,-2.3435 -8.03025,-3.741c-2.0425,-2.33275 -4.988,-3.6765 -8.09475,-3.6765c-3.10675,0 -6.05225,1.34375 -8.09475,3.6765c-1.2255,1.3975 -3.8915,3.741 -8.03025,3.741c-4.13875,0 -6.80475,-2.3435 -8.03025,-3.741c-2.0425,-2.33275 -4.988,-3.6765 -8.09475,-3.6765c-3.10675,0 -6.05225,1.34375 -8.09475,3.6765c-1.2255,1.3975 -3.8915,3.741 -8.03025,3.741c-4.13875,0 -6.80475,-2.3435 -8.03025,-3.741c-2.0425,-2.33275 -4.988,-3.6765 -8.09475,-3.6765c-3.10675,0 -6.05225,1.34375 -8.09475,3.6765c-1.2255,1.3975 -3.8915,3.741 -8.03025,3.741c-5.92325,0 -10.75,-4.82675 -10.75,-10.75v-8.213l9.6105,-19.23175c0.7525,-1.49425 1.1395,-3.139 1.1395,-4.80525v-10.75h129M161.25,10.75h-150.5v21.5l-10.75,21.5v10.75c0,11.87875 9.62125,21.5 21.5,21.5c6.46075,0 12.17975,-2.9025 16.125,-7.4175c3.94525,4.515 9.66425,7.4175 16.125,7.4175c6.46075,0 12.17975,-2.9025 16.125,-7.4175c3.94525,4.515 9.66425,7.4175 16.125,7.4175c6.46075,0 12.17975,-2.9025 16.125,-7.4175c3.94525,4.515 9.66425,7.4175 16.125,7.4175c6.46075,0 12.17975,-2.9025 16.125,-7.4175c3.94525,4.515 9.66425,7.4175 16.125,7.4175c11.87875,0 21.5,-9.62125 21.5,-21.5v-10.75l-10.75,-21.5v-21.5z" fill="#c74343"></path></g><path d="M149.13475,32.25h-126.42l-10.5995,21.5h147.7695z" fill="#f7a8a8"></path></g></g></svg>';

    let template_info_begin = '<b>Осталось пересчетов:';
    let tempate_info_end = '</b>.';

    let template_data_begin = 'Дата, после которой, ориентировочно, проект станет доступен:';
    let template_data_end = ' г.<br>';

    /**
     * найти подстроку между двумя шаблонами
     * @param {string} text в какой строке ищем
     * @param {string} begin начальный шаблон
     * @param {string} end финальный шаблогн
     * @returns {string}
     */
    function get_substring( text, begin, end )
    {
        var pos_begin = text.indexOf( begin );
        if ( pos_begin == -1 ) return '';

        var pos_end = text.indexOf( end );
        if ( pos_end == -1 ) return '';

        return text.substring( pos_begin + begin.length, pos_end )
    }

    // контрол с кнопкой
    let wc = $('<li class="my_btn" title="Отправить данные о поддержке розницы на сервер">' + ico_retail +'</li>');
    wc.click( function (){
        var send = new Object();
        // имя города
        let info = $("#mainContent div h1").text();
        // делим на части: Регион - название города - казан (эта часть не нужна)
        let city_info = info.split(' / ') ;
        send.city = city_info[1];
        send.region = city_info[0];
        // Идентификатор города
        let id = /(\d+)/.exec(location.href)[0];
        send.id = id;

        // данные по отделам
        let el = $("#mainContent table.list tr td h4");
        console.info(el);

        var obj = new Array();

        for(var i=0; i< el.length; i++){
            var dep = new Object();
            // отдела
            dep.name = el.eq(i).text();
            // процент магазинов игроков
            let td = $("td:eq(7)", el.eq(i).parent().parent() ).html();
            dep.proc = parseFloat( $("td:eq(3)", el.eq(i).parent().parent() ).text().replace(' %', '') );

            // число дней до запуска проекта
            var str = get_substring(td, template_info_begin, tempate_info_end );
            if ( str == '') continue;
            dep.days = parseInt( str );

            // дата запска проекта
            str = get_substring(td, template_data_begin, template_data_end );
            if ( str == '') {
                console.log('---- date not found');
                console.info(dep);
                continue;
            }
            dep.date = $.trim(str);
            // добавляем в список отделов
            obj.push( dep );
        }
        send.department = obj;
        console.info( send );

        console.log( JSON.stringify( send ) );
        // отаправка на сервер
        $("#polt_info").text('Отправка данных на сервер');
        $.post( API_ADD_CITY_INFO, { 'data': send },
            function(data) {
                $("#polt_info").html('Server return:' + data);
        });
    });


    // вставляем иконку в строку мэрии
    var container = $('ul.tabu');
    container = $("li:last", container).prev().parent();
    container.append(wc) ;

    // информацилнная панелд
    $("table.tabsub").after('<div id=polt_info>...</div>');
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}