// ==UserScript==
// @name        Virtonomica:AutoSchool
// @namespace   Virtonomica
// @description:en	Automation kindergartens
// @description:ru	Автоматизация детсадов
// @include     https://virtonomic*.*/*/main/unit/view/*
// @exclude     https://virtonomic*.*/*/main/unit/view/finans_report
// @exclude     https://virtonomic*.*/*/main/unit/view/virtasement
// @exclude     https://virtonomic*.*/*/main/unit/view/consume
// @version     0.04.3
// @grant       none
// @description Automation kindergartens
// @downloadURL https://update.greasyfork.org/scripts/39207/Virtonomica%3AAutoSchool.user.js
// @updateURL https://update.greasyfork.org/scripts/39207/Virtonomica%3AAutoSchool.meta.js
// ==/UserScript==
var run = function()
{
    /*
    Формат хранения данных1
    id_unit {
        price, // текущая цена
        type, // специализация
        district, // район
        service, // уровень сервиса
        uniq, // уникальность
        visit, // число посетителей
        visit_max, // максимальнон число посов
        reklama, // расходы на рекламу
        equip, // износ оборудования
        quality, // качество оборудования
        personal, // число сотрудников
        subsidies, // субсидии

        date    // дата обновления информации
    }
     */
    var loc_storage = function(){
        return({
            'save': function (name,  val){
                try {
                    window.localStorage.setItem( name,  JSON.stringify( val ) );
                    out = "Данные успешно сохранены";
                } catch(e) {
                    out = "Ошибка добавления в локальное хранилище";
                    //console.log(out);
                }
                 return out;
            },
            'load': function(name){
                obj = JSON.parse( window.localStorage.getItem(name) );
                if ( obj == null ) obj = new Object();
                return obj;
            }
        });
    }

    /**
    * проверить дату на принадлежность к сегодняшнему пересчету
     *
     * @return true - дата сеголняшнего пересчета
     */
    function check_day( day_str )
    {
        var today = new Date();
        var check_day = new Date( day_str );


        var th =  today.getHours();

        console.log("today=" + today.toUTCString() + "  " + day_str + ",,, "+ check_day.toUTCString() );

        console.log(today.getUTCDate() + " ??? " + check_day.getUTCDate() );
        console.log("th = " + th);
        if (today.getUTCDate() == check_day.getUTCDate()  && today.getUTCMonth() == check_day.getUTCMonth() ) {
            if ( th < 3 && check_day.getHours() > 7 ) return false;
            return true;
        }

        if ( th < 3 ) {
            check_day.setDate( check_day.getDate() +1 );
            // хвост от прошлого дня
            if ( check_day.getHours() < 3 ) return false;
            if (today.getDate() == check_day.getDate()  && today.getMonth() == check_day.getMonth() ) return true;
        }

        console.log('no eqval');
        return false;
    }
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    function checkType()
    {
        //var head = $("#unitImage");
        //var img = $("img", head);
        //link = img.attr('src');

        //var title=$('.bg-image').attr('class');
        //var title = $('body').attr('class');

        // кривой способ определения типа юнита по названию вкладки
        var title = $.trim( $('ul.tabu li').eq(1).text() );
        //console.log( title );
        //console.log( $('.bg-image').eq(0).attr('class') );
        if ( title == 'Предприятие дошкольного образования' ) return true;


        // образование
        //n = title.indexOf('educational');
        //if (n > 0) return true;

        return false;
    }	
 
    if ( checkType() == false  ) return;
	
    // Стили  
    var st = $("style");
    st.append(".my_btn{cursor:pointer;opacity:0.5;float:left;color: white;}");
    st.append(".my_btn:hover{opacity:1.0}");
	st.append(".my_btn img {width:24px;}");
    st.append(".my_popup{background: rgb(223, 223, 223) none repeat scroll 0% 0%; z-index: 1002; position: absolute; border: 1px solid rgb(0, 0, 0);max-width: 800px;margin-left: 100px;padding: 8px;display: none;}");
    st.append(".my_number{text-align: right;width: 80px;}");
	st.append(".my_info{font-weight:bold;border-bottom: solid 1px;border-right: solid 1px;border-left: solid 1px;padding-left: 12px;padding-right: 12px;padding-right: 12px;background: lightgray;display: none;}");

	$("table.infoblock:eq(0)").before("<span class=my_info id=kinder_info></span>");

    // Получить число свобонго товара, прописав 0 - если поставщика нет
    function getFreeExt( row, add2 )
    {
        getFree( row, add2 );
        out = free;
        if (free < 0) out = 0;
        return out;
    }
// Получить данные о том сколько можнот заказать
// @param row - строка с данными по товару
// @partam add - сколько товара надо заказать
// @return false - наличие ошибок
    function getFree( row, add )
    {
        //console.log( "-----getFree(" +add+")" );
        error_str = "";
        free = 0; // по умолчанию считаем что свободного ничего нет

        //free = $("td[id^='free']", row );
        free_td = $("td:contains('Свободно')", row).next();
        //console.log( "FREE = " + free_td.text() );
        if ( free_td.text() == "Не огр."){
            free = -1; // очень много
        } else {
            free = parseInt( free_td.text().replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
        }
        if ( isNaN(free) ) {
            error_str = "<img src=" + img.attr('src') + " width=16> Отсутствует поставщик";
            addNotes( "<font color=red>" + error_str +"</font>" );
            //console.log( error_str );
            return false;
        }
        //console.log( "FREE = " + free);

        // независимый поставщик
        if ( free == -1 ) return true;

        // ограничение про заказу со склада
        max_limit = 0;
        max_info = $("span:contains('Max:')", row );
        if (max_info.length > 0) {
            // Выбираем минимум из свободного и огранияения по поставке
            max_limit =  parseInt( max_info.text().replace("Max:","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
            //console.log( "max_info = " + max_limit );
            if ( max_limit < free ) free = max_limit;
        }

        if ( (add > free) || ( (add > max_limit) && (max_limit > 0) ) ) {
            error_str = "<img src=" + img.attr('src') + " width=16> Недостаточно свободного товара у поставщика";
            //addNotes( "<font color=red>" + error_str +"</font>" );
            //console.log( error_str );
            return false;
        }

        return true;
    }
    /**
     * Добавить заметку к предприятию
    */
    function addNotes( msg ){
        // объект для хранения сообщений
        notes = JSON.parse( window.localStorage.getItem('notes') );
        if ( notes == null ) notes = new Object();

        // Идентификатор подразделения
        var id = /(\d+)/.exec(location.href)[0];
     
        // дизайно 16.10.2017
        var title = $("div.title h1").text();
        var type = $.trim( $('ul.tabu li').eq(1).text() );
      
        head = $("div.officePlace");
        var type = head.text();
        var nn = type.indexOf("компании");
        if (nn > 0){
            type = type.substring(0, nn);
            var ptrn = /\s*((\S+\s*)*)/;
            type = type.replace(ptrn, "$1");
            ptrn = /((\s*\S+)*)\s*/;
            type = type.replace(ptrn, "$1");
        } else {
            type = '';
        }

        if ( notes[id] == null ) notes[id] = new Object();

        var d = new Date();

        if ( notes[id]['text'] != null) {
            // сообщение для этого подраздления уже есть
            msg = notes[id]['text'] + "<br>" + msg;
        }

        notes[id]['text'] = msg;
        // Количество миллисекунд
        notes[id]['time'] = d.getTime();
        notes[id]['name'] = title;
        notes[id]['type'] = type;

        loc_storage().save('notes', notes);
    }
	
	
	function print_ok( str )
	{
         $("#kinder_info").html( str ).css({'color': 'green'}).show();
	}
	function print_error( str )
	{
         $("#kinder_info").html( str ).css({'color': 'red'}).show();
	}

    function parse_infoblock( str, def, num_block )
    {
        var value = def ;
        var sub_str = $("table.infoblock:eq(" + num_block + ") td:contains('" + str + "')").next();
        if (sub_str.text() != "") {
            value = parseFloat( sub_str.text().replace("$","").replace(/\s*/g,'') );
        }
        return value;
    }
    function get_infoblock( str, num_block )
    {
        var sub_str = $("table.infoblock:eq(" + num_block + ") td:contains('" + str + "')").next();
        return sub_str.text();
    }

    function supply()
    {
        //alert("Supply");
        var wc_kinder = $("<li id=kinder_img class=my_btn> <img title='Автоматизация снабжения' alt='Автоматизация снабжения' src=https://cdn4.iconfinder.com/data/icons/48x48-free-time-icons/48/Medium_speed.png>");

        var container = $('ul.tabu');
        container = $("li:last", container).prev().parent();
        container.append( wc_kinder );

        wc_kinder.click(function(){
            var id = /(\d+)/.exec(location.href)[0];
            console.log("Kinder click (" + id +")");

            obj = loc_storage().load('unit_v2');
            if ( obj[id] == null) {
                addNotes("<font color=red>Ошибка чтения unit_v2</font>");
                return;
            }
            if ( !check_day( obj[id]['date']) ) {
                addNotes("<font color=red>Устарвевшая дата:" + obj[id]['date'] + "</font>");
                return;
            }

            var pos_max = obj[id]['visit_max'];

            var table  = $("table.list");
            // список товаров на заказ
            var tr = $("tr[id^='product_row']", table);
            for(i=0; i<tr.length; i++) {
                var table2 = $("td:contains('Количество')", tr.eq(i));
                td = $("td:contains('Количество')", table2).next();
                // сколько есть на складе
                number = parseInt(td.text().replace(/\s/g, ''));

                table2 = $("td:contains('Расх. на клиента')", tr.eq(i));
                td = $("td:contains('Расх. на клиента')", table2).next();

                // на одного посетителя
                num2pops = parseInt(td.text().replace(" ", ""));

                img = $("img[src^='/img/products']", tr.eq(i));
                console.log( img );

                // мощность продаж
                var power = num2pops * pos_max;
                // сколько заказать
                var add = 0;
                // сколько останется после продажи
                var left = number - power;

                if (left < power) add = power - left;

                // поиск дополнительных поставщиков
                var tr_id = tr.eq(i).attr('id') ;
                var tr_sub_id = tr_id.replace("product_row", "product_sub_row");
                var str = "tr[id^='" + tr_sub_id + "']";
                console.log( str );
                var sr_tr = $(str, table);
                console.log( "length="+sr_tr.length );
                if (sr_tr.length == 0) {
                    // У нас только один поставщик
                    console.log('===1---');
                    // проверить свободные
                    free = $("td:contains('Свободно')", tr.eq(i) ).next().text();
                    free = parseInt( free.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );

                    if (isNaN(free) ) {
                        error_str = "<img src=" + img.attr('src') + " width=16> Отсутствует поставщик";
                        addNotes( "<font color=red>" + error_str +"</font>" );
                        //console.log( error_str );
                        continue;
                    } else if (add > free) {
                        console.log( 'error_str' );
                        error_str = "<img src=" + img.eq(0).attr('src') + " width=16> Недостаточно свободного товара у поставщика";
                        addNotes( "<font color=red>" + error_str +"</font>" );

                        continue;
                    }

                    $("input[name^='supplyContractData[party_quantity]']", tr.eq(i) ).val(add);
                    //input.val(add);
                    continue;
                }


                // несколько поставщиков
                var stat = new Array();
                stat[0] = new Object();
                var inp = new Array();

                //free = $("td:contains('Свободно')", tr.eq(i) ).next().text();
                //free = parseInt( free.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
                stat[0]['free'] = getFreeExt( tr.eq(i), add );
                stat[0]['add'] = 0;
                inp[0] = $("input[name^='supplyContractData[party_quantity]']", tr.eq(i) );
                console.log(inp[0].val() + " = " + inp[0].length);

                for(j=0; j<sr_tr.length; j++){
                    row = sr_tr.eq(j) ;
                    stat[j+1] = new Object();
                    //free = $("td:contains('Свободно')", row ).next().text();
                    //free = parseInt( free.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
                    stat[j+1]['free'] = getFreeExt( sr_tr.eq(j), add );
                    stat[j+1]['add'] = 0;
                    console.log(stat);

                    inp[j+1] = $("input[name^='supplyContractData[party_quantity]']", row) ;
                    console.log(j + ". " +inp[j+1].val() + " = " + inp[j+1].length);

                    var add_left = add ;
                    for(jj=0; jj<stat.length; jj++) {
                        if ( add_left <= stat[jj]['free'] ) {
                            stat[jj]['add'] = add_left;
                            add_left = 0;
                            break;
                        }
                        stat[jj]['add'] = stat[jj]['free'];
                        add_left -= stat[jj]['free'];
                    }
                    //console.log( JSON.stringify(stat) + " = " + add_left);
                    // выставыляем цифры в интерфейс
                    for(jj=0; jj<stat.length; jj++) {
                        inp[jj].val( stat[jj]['add'] );
                        //console.log( inp[j].attr("name") );
                    }
                    if ( add_left > 0) {
                        error_str = "<img src=" + img.attr('src') + " width=16> Нехватка товара у поставщиков (мультизаказ) ";
                        addNotes( "<font color=red>" + error_str +"</font>" );
                    }
                }
            }
            // нажать кнопку изменить
            $("input[name='applyChanges']").click();

        });

    }

    function check_url( str )
    {
        var pos = location.href.indexOf( str );
        if (pos > 0) return true;
        return false;
    }

    // @exclude     https://virtonomic*.*/*/main/unit/view/finans_report
    // @exclude     https://virtonomic*.*/*/main/unit/view/virtasement
    // @exclude     https://virtonomic*.*/*/main/unit/view/consume

    // проверить страницу
    if ( check_url('finans_report') ) return;
    if ( check_url('virtasement') ) return;
    if ( check_url('consume') ) return;

    if ( check_url('supply') ) {
        supply();
        return;
    }

	// специализация
	var type = $("table.infoblock:eq(1) td:eq(1)").text();
	//print_ok( type );
	
	// объект для хранения данных о расходниках
   	Med_info = JSON.parse( window.localStorage.getItem('Med_info') );
	if ( Med_info == null ) {
		Med_info = new Object();
		print_error( "Неподдерживаемая специализация: " );
	}
	//print_error('считали');
	console.log("---------------" + type + "---");
	console.log( Med_info[ type ] );
	
	// посещаемость
	var pos_str = $("table.infoblock:eq(1) td:eq(4)").text().replace(/\s/g, '');
	// сколько пришло
	var pos = parseInt( pos_str );
	var _p = pos_str.indexOf(":")+1;
	// максимальная посещаемость
	var pos_max = parseInt( pos_str.substr(_p) );
	
	// субсидии
    var grant = parse_infoblock('Субсидии в систему дошкольного образования', 100, 1)/100;

	if ( pos_max == pos ) {
		addNotes("<font color=green><b>Максимальные продажи</b></font>");
	} else if ( grant < 1 ) {
        if ( pos == pos_max * grant ) {
            addNotes("<font color=green><b>Максимальные продажи (гранты: "+ grant * 100 + "%)</b></font>");
        }
    }
  
    var price = parse_infoblock('Цена (на момент пересчёта)', 0, 1);
    var service = get_infoblock('Уровень сервиса', 1);
    var uniq = get_infoblock('Уровень уникальности сервиса', 1);
    var district = get_infoblock('Район города', 0);
    var equip = parse_infoblock('Износ оборудования', 0, 0);
    var quality = parse_infoblock('Качество оборудования', 0, 0);
    var personal = parse_infoblock('Количество оборудования', 0, 0);
    var reklama =  parse_infoblock('Расходы на рекламу', 0, 0);

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];

    var d = new Date();

    obj = loc_storage().load('unit_v2');

    //var obj = new Object();
    if ( obj[id] == null ) {
        obj[id] = new Object();
        // проверить актуальность данных
        obj[id]['type'] = type;
        obj[id]['price'] = price;
        obj[id]['visit'] = pos;
        obj[id]['visit_max'] = pos_max;
        obj[id]['subsidies'] = grant;
        obj[id]['service'] = service;
        obj[id]['uniq'] = uniq;
        obj[id]['district'] = district;
        obj[id]['equip'] = equip;
        obj[id]['quality'] = quality;
        obj[id]['reklama'] = reklama;
        obj[id]['personal'] = personal;
        //obj[id]['date'] = d.toLocaleDateString();
        obj[id]['date'] = d.toUTCString();
      
       if ( pos_max > pos ) {
       var pos_teoretic = pos_max;
       if ( grant < 1 ){
       		pos_teoretic *= grant;
       }
       var pos_procent = Math.round( 100 * pos / pos_teoretic );
       if ( pos_procent < 50 ) {
           addNotes("<font color=maroon>План продаж: "+ pos_procent + "%</font>");  
       }
    }


    }

    if ( !check_day( obj[id]['date']) ) {
        obj[id]['type'] = type;
        obj[id]['price'] = price;
        obj[id]['visit'] = pos;
        obj[id]['visit_max'] = pos_max;
        obj[id]['subsidies'] = grant;
        obj[id]['service'] = service;
        obj[id]['uniq'] = uniq;
        obj[id]['district'] = district;
        obj[id]['equip'] = equip;
        obj[id]['quality'] = quality;
        obj[id]['reklama'] = reklama;
        obj[id]['personal'] = personal;
        //obj[id]['date'] = d.toLocaleDateString();
        obj[id]['date'] = d.toUTCString();
        console.log("---obj updated---")  ;
      
       if ( pos_max > pos ) {
       var pos_teoretic = pos_max;
       if ( grant < 1 ){
       		pos_teoretic *= grant;
       }
       var pos_procent = Math.round( 100 * pos / pos_teoretic );
       if ( pos_procent < 50 ) {
           addNotes("<font color=maroon>План продаж: "+ pos_procent + "%</font>");  
       }
    }


    }

    console.log( obj[id] );

    loc_storage().save('unit_v2', obj);

    //var d2 = new Date( obj[id]['date'] );
    //console.log( d2.toUTCString() + " " + d2.getHours() );

    //console.log( check_day( "Sun, 23 Sep 2017 20:17:19 GMT" ) );

	
	var wc_kinder = $("<li id=kinder_img class=my_btn> <img title='Автоматизация цены' alt='Автоматизация цены' src=https://cdn1.iconfinder.com/data/icons/KDE_Crystal_Diamond_2.5_Classical_Mod/22x22/apps/file-manager.png>");
	
    var container = $('ul.tabu');
    container = $("li:last", container).prev().parent();
	container.append( wc_kinder );

}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}