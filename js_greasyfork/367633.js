// ==UserScript==
// @name        Virtonomica:Shagren_VirtaTable
// @namespace   Virtonomica
// @description КО + API
// @include     https://virtonomica.ru/vera/main/olla/*
// @version     2023.08.30
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367633/Virtonomica%3AShagren_VirtaTable.user.js
// @updateURL https://update.greasyfork.org/scripts/367633/Virtonomica%3AShagren_VirtaTable.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    // текущая дата
    var TodayDate = '2023-08-30';
    // куда шлем данные
    var KonkursURL = "https://test.pbliga.com/virta/konkurs.php?";
    // откуда читаем данные по подразделению
    var url_unit = 'https://virtonomica.ru/api/vera/main/unit/summary?id=';

    // --- версия 2022 ---
    let api_unit_info = "https://virtonomica.ru/api/vera/main/unit/summary";

    var tabs = $.trim( $("ul.tabu li.sel").text() );
    console.log( tabs );

    if( tabs != "Шагрень") {
        console.log('Shagren_VirtaTable not support');
        return;
    }

    var st = $("style");
    console.log( st.length );

    st.append(".my_btn{cursor:pointer;opacity:0.5}");
    st.append(".my_btn img{width:32px}");
    st.append(".my_btn:hover{opacity:1.0}");

    var wc_send = $("<li class='my_btn'><img src='https://cdn4.iconfinder.com/data/icons/flat-circle-content/800/circle-content-upload-cloud-32.png' title='Отправить результаты на сервер'>");
    var wc_update = $("<li class='my_btn'><img src='https://cdn4.iconfinder.com/data/icons/ios-web-user-interface-multi-circle-flat-vol-5/512/Cloud_data_cloud_computing_storage_upload-32.png' title='Обновить таблицу на сервере (не забыв прописать дату)'>");
    // https://cdn4.iconfinder.com/data/icons/web-development-5/500/api-code-window-48.png
    var wc_api_sh = $("<li class='my_btn'><img src='https://cdn4.iconfinder.com/data/icons/web-development-5/500/api-code-window-32.png' title='Отправить на сервер данные получаемые через API'>");
    let wc_test = $("<li class='my_btn'><img src='https://cdn3.iconfinder.com/data/icons/covid-test-3/32/21_Eye_protection-256.png'>");

    var wc_out = $("<div id=shagren_out></div>");
  
    function removeNonNumericAndDotCharacters(str) {
        return str.replace(/[^0-9.]/g, '');
    }

    $("ul.tabu").append(wc_test).append( wc_send ).append( wc_update ).append( wc_api_sh );
    $("#childMenu").before( wc_out );

    wc_test.click(function (){
        console.log('wc_test.click');
        var table = $("table.list tr");
        if ( table.length <= 1) {
            $("#shagren_out").text('Отсутствуют результаты').css('color','red');
            return;
        }
        for( var i=1; i<table.length; i++ ){
            var tr = table.eq(i);

            var a_unit = $("td a[href*='unit']", tr);
            var shop_id = /(\d+)/.exec( a_unit.attr('href') )[0];

            if ( shop_id == 0 ) continue;
            if ( shop_id == null ) continue;

            // debug.....
            if (i > 1 ) break;

            // запросим API
            var WebURL= api_unit_info +'?id=' + shop_id;
            $.post(WebURL, function(unit){
                $("#shagren_out").html( 'Server return:' + JSON.stringify( unit.district_name ) );
                console.info( unit );

                Obj = new Object();
                Obj['date'] = TodayDate;
                Obj['district_name'] =  unit.district_name;
                Obj['shop_id'] = unit.id;
                Obj['employee_required'] = unit.employee_required;
                Obj['advertising_cost'] = unit.advertising_cost;
                Obj['customers_count'] = unit.customers_count;
                Obj['service_type'] = unit.service_type;

                console.info( Obj );

            });

            console.log('shop_id=' + shop_id);
        }
    });

    wc_api_sh.click( function(){
        console.log('wc_api.click');

        var table = $("table.list tr");
        console.log( "table = " + table.length );

        if ( table.length <= 1) {
            $("#shagren_out").text('Отсутствуют результаты').css('color','red');
            return;
        }

        var Obj = new Object() ;
        //Obj['table'] = new Array();
        //Obj['date'] = TodayDate;

        //var Obj = new Array();

        for( var i=1; i<table.length; i++ ){

            //DEBUG
            //if (i > 5) break;

            var tr = table.eq(i);

            var a_unit = $("td a[href*='unit']", tr);
            var shop_id = /(\d+)/.exec( a_unit.attr('href') )[0];

            if ( shop_id == 0 ) return;
            if ( shop_id == null ) return;

            $.get(url_unit + shop_id, function( unit ){

                Obj[unit.id] = new Object();
                Obj[unit.id]['date'] = TodayDate;
                Obj[unit.id]['shop_id'] = unit.id;
                Obj[unit.id]['employee_required'] = unit.employee_required;
                Obj[unit.id]['advertising_cost'] = unit.advertising_cost;
                Obj[unit.id]['customers_count'] = unit.customers_count;
                Obj[unit.id]['service_type'] = unit.service_type;

                console.log( Obj[unit.id] );

                var WebURL= KonkursURL +'&action=send_shop_api';
                $.post(WebURL, {'data': JSON.stringify( Obj[unit.id] )}, function(data){
                    $("#shagren_out").html( 'Server return:' + data );
                });

            });

        }
        //console.log( Obj );


    });

    wc_send.click(function(){
        console.log('click');

        var table = $("table.list tr");
        console.log( "table = " + table.length );

        if ( table.length <= 1) {
            $("#shagren_out").text('Отсутствуют результаты').css('color','red');
            return;
        }

        var Obj = new Object() ;
        Obj['table'] = new Array();
        Obj['date'] = TodayDate;

        for( var i=1; i<table.length; i++ ){
            var tr = table.eq(i);

            var a_unit = $("td a[href*='unit']", tr);
            var shop_id = /(\d+)/.exec( a_unit.attr('href') )[0];

            var td = $("td a[href*='unit']", tr).parent().text();
            //var td = $.trim( td.replace(a_unit.text(), '').replace('$','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
            td = removeNonNumericAndDotCharacters(td);
            var res = parseFloat(td);

            Obj['table'][i-1] = {'shop':shop_id, 'res': res};

            //console.log( shop_id + "==" +res );
        }
        console.log( Obj );

        // отсылаем на сервер
        $("#shagren_out").html( 'Отправка данных на сервер...' );

        var WebURL= KonkursURL +'&action=send_table';
        //var WebURL= KonkursURL +'&action=update_table';
        $.post(WebURL, {'data': JSON.stringify( Obj )}, function(data){
            $("#shagren_out").html( 'Server return:' + data );
        });

    });


    wc_update.click(function(){

        console.log('click');
        var table = $("table.list tr");
        console.log( "table = " + table.length );

        if ( table.length <= 1) {
            $("#shagren_out").text('Отсутствуют результаты').css('color','red');
            return;
        }

        var Obj = new Object() ;
        Obj['table'] = new Array();
        Obj['date'] = TodayDate;

        for( var i=1; i<table.length; i++ ){
            var tr = table.eq(i);
            //console.info(tr);

            var a_unit = $("td a[href*='unit']", tr);
            var shop_id = /(\d+)/.exec( a_unit.attr('href') )[0];
            console.table(shop_id);
          

            var td = $("td a[href*='unit']", tr).parent().text();
            console.info(td);
            td = removeNonNumericAndDotCharacters(td);
         
            //var td = $.trim( td.replace(a_unit.text(), '').replace('$','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
            var res = parseFloat(td);

            Obj['table'][i-1] = {'shop':shop_id, 'res': res};

            //console.log( shop_id + "==" +res );
        }
        console.log( Obj );

        // отсылаем на сервер
        $("#shagren_out").html( 'Отправка данных на сервер...' );

        //var WebURL= KonkursURL +'&action=send_table';
        var WebURL= KonkursURL +'&action=update_table';
        $.post(WebURL, {'data': JSON.stringify( Obj )}, function(data){
            $("#shagren_out").html( 'Server return:' + data );
        });
    });

    console.log('Shagren_VirtaTable end working...');
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);