// ==UserScript==
// @name        Virtonomica:Konkurs 3 шагрени
// @namespace   virtonomica
// @description для конкурса
// @include     https://virtonomica.ru/vera/*/unit/view/*
// @version     2022.03.16
// @license MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367631/Virtonomica%3AKonkurs%203%20%D1%88%D0%B0%D0%B3%D1%80%D0%B5%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/367631/Virtonomica%3AKonkurs%203%20%D1%88%D0%B0%D0%B3%D1%80%D0%B5%D0%BD%D0%B8.meta.js
// ==/UserScript==
var run = async function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    const KonkursURL = "https://test.pbliga.com/virta/konkurs.php?";
    const api_unit_info = "https://virtonomica.ru/api/vera/main/unit/summary";
    const api_list_artefact = "https://virtonomica.ru/api/vera/main/unit/artefact/attached";
    const api_items = "https://virtonomica.ru/api/vera/main/unit/shopboard/browse?app=adapter_vrt&format=json"

    //console.log('menu 0');

    // размеры рынков
    // необходимо обновлять каждый день
    // 2016.12.14
    var markets = {1:1272461, 2:9977, 3:38327, 6:1034903, 10:2221009, /*11:104506*/ 13:250474, 14: 1145601, 15: 686460, 16:188810, 17:44218, 19:355217, 20:298881, 21:158263, 22:1090252, 23:1529014
        , 24:1601439, 25: 36552, 26: 2548667, 27:  1137333, 28:1032781, 29:11628227, 32:22757696, 33:1026873, 34:42109, 35:214706, 36:1169637, 37:1439883, 38:3456051, 39: 8061303,
        40: 228401, 41:  1117384, 42: 1419293, 45:  56727985, 76:2961629, 78:59000};

    // за какой день передаются данные
    var date = '2019-02-04';

    // какие товары ищем
    //var items = {1:'Сигареты Друг', 2:'Малиновый пиджак', 3:'Могучая Мышь', 6: 'Шагрень'};
    var items = {78: 'Шагрень'};
    const ITEM_ID = 78;
    //console.log( items );

    var unit_info;

    async function getUnitInfo( id )
    {
        console.log(">>>>-getUnitInfo--<<<<");
        await $.post(api_unit_info + '?id=' + id, function(data){
            $("#konkurs_out").html( 'Server return:' + data.company_id );
            console.info( data );
            unit_info =  data;
        });
        console.log(">>>>---<<<<");
    }
    /**
     *
     * @param text string
     */
    function getDistrict( text )
    {
        let list = ["Фешенебельный район", "Центр города", " Спальный район", "Окраина", "Пригород"]
        for (var i = 0; i< list.length; i++){
            var p = text.indexOf( list[i]);
            if ( p == -1 ) continue;
            return list[i];
        }
        return '???'
    }

    var artifacts = {
        1:'Автомобильная парковка',
        2:'Консалтинг мирового лидера ритейла',
        3:'Бакалейная лавка',
        4:'Бутик одежды',
        5:'Социальный пакет для работников предприятия',
        6:'Система складской маркировки',
        7:'Все для дома',
        8:'Автосалон',
        9:'Продуктовая лавка',
        10:'Партнёрский договор с рекламным агентством',
        11:'Электронный рай'
    };
    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];

    //var comp = $("td:contains('Подразделение компании')");
    // В заголовке подразделения ищем ссылку на компанию (первый линк в нужном DIV)
    // из ссылки вытаскиваем имя компании и её id
    //var comp = $("div.owner-data div.width90 a").eq(0).parent();
    let comp = $("div:contains('Компания:')").next();
    console.info(comp);
    var company_name = $.trim($("a", comp).text() );
    //var company_id = /(\d+)/.exec( $("a", comp).attr('href') )[0];

    await getUnitInfo(id);
    console.log('---111---222---');
    console.info( unit_info ) ;
    var bonus = await getArtifacts( id );
    let company_id = unit_info.company_id;
    console.log("-------------------------------------")
    console.info(comp, " --- ",company_name, company_id);
    //console.info(bonus);

    var site = unit_info.district_name;
    var trade_hall = unit_info.trading_square;
    var department = unit_info.section_count;
    var brand = unit_info.fame;
    var pos = unit_info.customers_count;
    var service = unit_info.service_type;

    var shop_bonus = new Array()
    /*
    [300143] 301019 -  Автомобильная парковка
             302661 -  Партнёрский договор с рекламным агентством
    [300144] 302572 -  Консалтинг мирового лидера ритейла
     */
    if ( bonus[300143].length != 0 ) {
        if ( bonus[300143]['artefact_id'] == 301019 ){
            // Автомобильная парковка
            shop_bonus.push("1");
            console.log('---P');
        }
        if ( bonus[300143]['artefact_id'] == 302661 ){
            //bonus.push('Партнёрский договор с рекламным агентством');
            shop_bonus.push("10");
            console.log('---PR');
        }
    }
    if ( bonus[300144].length != 0 ) {
        if ( bonus[300144]['artefact_id'] == 302572 ){
            //bonus.push('Консалтинг мирового лидера ритейла');
            shop_bonus.push("2");
            console.log('---TORG');
        }
    }

    async function getItems(id){
        items = await $.post( api_items, {id:id}).done( function( data ) {
            console.log('api_items');
            console.info(data);
            console.log('-----------api_items');
            return items;
        });
        console.log('api_items end');
        return items;
    }
    const items_data = await getItems(id);
    console.info( items_data );
    objItems =  new Object();
    objItems[ITEM_ID] = new Object();
    for (let i=0; i< items_data.length; i++) {
        console.log( items_data[i].product_name + ", count=" + items_data[i].sales_volume)
        objItems[ITEM_ID]['shtuk'] = items_data[i].sales_volume;
        objItems[ITEM_ID]['price'] = items_data[i].prev_price;
        objItems[ITEM_ID]['procent'] = items_data[i].share_of_the_market;
    }
    console.info(objItems);
    console.log('----------objItems---');
    /*

    objKonkurs['items'][it] =  new Object();
            objKonkurs['items'][it]['price'] = price;
            objKonkurs['items'][it]['procent'] = procent;
            objKonkurs['items'][it]['shtuk'] = Math.round( procent * markets[it] / 100 );
    var div_data = "div.unit_box-container div.unit_box-row div.unit_box table.unit_table";
    console.info( $(div_data).eq(0) );

    var site = getDistrict ( $("td:eq(1)", $("tr:contains('Расположение магазина')")).text() );
    var trade_hall = $("td:eq(1)", $("tr:contains('Торговая площадь')")).text().replace(' ', '').replace(' ', '').replace('м2','');
    var department = $("td:eq(1)", $("tr:contains('Количество отделов')") ).text();
    var brand = $("td:eq(1)", $("tr:contains('Известность')") ).text();
    var pos = $("td:eq(1)", $("tr:contains('Количество посетителей')") ).text();
    var service = $.trim( $("td:eq(1)", $("tr:contains('Уровень сервиса')") ).text() );
    */
    //console.log(trade_hall, department, brand, pos, service);
    //console.log('menu 02');

    //var wc_save = $("<div style='cursor:pointer;float: right;'><img title='Передать на сервер продажи' alt='Передать на сервер продажи' src='https://cdn4.iconfinder.com/data/icons/flat-circle-content/800/circle-content-upload-cloud-32.png' >&nbsp;");
    var wc_save = $("<div style='cursor:pointer;float: right;'><img title='Передать на сервер продажи' alt='Передать на сервер продажи' src='https://cdn4.iconfinder.com/data/icons/flat-circle-content/800/circle-content-upload-cloud-32.png'></div>");
    var wc_konkurs_out = $("<div id=konkurs_out style='float: right;margin:6px;'>");

    console.log('menu 03');

    async function getArtifacts( id ) {
        console.log('getArtifacts');
        bonus = await $.post( api_list_artefact, {id:id}).done( function( data ) {
            console.log('api_list_artefact');
            console.info(data);
            console.log('-----------api_list_artefact');
            return bonus;
        });
        console.log('getArtifacts end');
        return bonus;
    }

    wc_save.click( function(){
        console.log('wc_save.click');

        objKonkurs = new Object();
        objKonkurs['date'] = date;
        objKonkurs['shop_id'] = id;
        objKonkurs['site'] = site;
        objKonkurs['trade_hall'] = trade_hall;
        objKonkurs['department'] = department;
        objKonkurs['brand'] = brand;
        objKonkurs['pos'] = pos;
        objKonkurs['service'] = service;

        objKonkurs['company_id'] = company_id;
        objKonkurs['company_name'] = company_name;
        objKonkurs['bonus'] = new Array();
        objKonkurs['items'] = objItems;

        // поиск артифактов
        objKonkurs['bonus'] = shop_bonus;

        /*
        var art = $("div.artf_slots");
        for(ai in artifacts) {
            var fart = $("img[title='" + artifacts[ai] + "']");
            if ( fart.length == 0 ) continue;
            objKonkurs['bonus'].push( ai );
        }
         */

        //console.log( items );
        /*
                for( it in items){
                    console.log(it + "==" + items[it]);
                    var tr = $("img[alt='"+ items[it] +"']").parent().parent();
                    //console.log(tr.html());

                    var str = $("td:eq(5)", tr);
                    console.log(str.html() );


                    // рыночная доля
                    var procent = parseFloat( str.text().replace(' %', '') );
                    console.log(procent);
                    // Цена продажи
                    str = $("td:eq(4)", tr);
                    console.log(str.html() );

                    var price = parseFloat( str.text().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '') );
                    if ( isNaN( price) ) price = "---";

                    console.log(price + " = " + procent);

                    objKonkurs['items'][it] =  new Object();
                    objKonkurs['items'][it]['price'] = price;
                    objKonkurs['items'][it]['procent'] = procent;
                    objKonkurs['items'][it]['shtuk'] = Math.round( procent * markets[it] / 100 );

                }
                console.log(objKonkurs);


                // отсылаем на сервер
                */
        //$("#konkurs_out").html( 'Отправка данных на сервер...' );
        console.info(objKonkurs);

        var WebURL= KonkursURL +'&action=send_shop';
        $.post(WebURL, {'data': JSON.stringify( objKonkurs )}, function(data){
            $("#konkurs_out").html( 'Server return:' + data );
        });

    });

    console.log('menu 1');
    // Добавить кнопку в меню
    var table = $("div#unit-info div.name");
    console.info( table );
    table.append(wc_save);
    table.append(wc_konkurs_out);
    table.append('<div id=out_text style="float:left"></div>');

    console.log('menu 2');

}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);