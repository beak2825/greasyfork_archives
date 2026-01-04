// ==UserScript==
// @name        Virtonomica:AutoSupply&Price
// @namespace   Virtonomica
// @description:en	Automation unit
// @description:ru	Автоматизация подразделений
// @include     https://virtonomic*.*/*/main/unit/view/*
// @exclude     https://virtonomic*.*/*/main/unit/view/finans_report
// @exclude     https://virtonomic*.*/*/main/unit/view/virtasement
// @exclude     https://virtonomic*.*/*/main/unit/view/consume
// @version     0.02.14
// @grant       none
// @description Automation unit
// @downloadURL https://update.greasyfork.org/scripts/376924/Virtonomica%3AAutoSupplyPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/376924/Virtonomica%3AAutoSupplyPrice.meta.js
// ==/UserScript==
var run = function()
{
  // Откуда читаем специализации
  var url_spec = 'https://test.pbliga.com/virta/unit.php';
  // откуда читаем данные по подразделению
  var url_unit = 'https://virtonomica.ru/api/vera/main/unit/summary?id=';
  
  var json_spec = {"medicine":{"\u0414\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0446\u0435\u043d\u0442\u0440":5,"\u041f\u043e\u043b\u0438\u043a\u043b\u0438\u043d\u0438\u043a\u0430":5,"\u0426\u0435\u043d\u0442\u0440 \u043d\u0430\u0440\u043e\u0434\u043d\u043e\u0439 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u044b":1,"\u0421\u0442\u043e\u043c\u0430\u0442\u043e\u043b\u043e\u0433\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043a\u043b\u0438\u043d\u0438\u043a\u0430":0.5,"\u0411\u043e\u043b\u044c\u043d\u0438\u0446\u0430":0.2,"\u041a\u0430\u0440\u0434\u0438\u043e\u043b\u043e\u0433\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043a\u043b\u0438\u043d\u0438\u043a\u0430":1,"\u041a\u043e\u0441\u043c\u0435\u0442\u043e\u043b\u043e\u0433\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0446\u0435\u043d\u0442\u0440":5,"\u0426\u0435\u043d\u0442\u0440 \u0438\u043c\u043c\u0443\u043d\u043e\u043b\u043e\u0433\u0438\u0438":1},"restaurant":{"\u0424\u0430\u0441\u0442\u0444\u0443\u0434":70,"\u041f\u0438\u0432\u043d\u043e\u0439 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":60,"\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d \u0438\u0442\u0430\u043b\u044c\u044f\u043d\u0441\u043a\u043e\u0439 \u043a\u0443\u0445\u043d\u0438":60,"\u0420\u044b\u0431\u043d\u044b\u0439 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":30,"\u0421\u0442\u0435\u0439\u043a \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":50,"\u041a\u0430\u0444\u0435-\u043c\u043e\u0440\u043e\u0436\u0435\u043d\u043e\u0435":80,"\u0421\u044b\u0440\u043d\u044b\u0439 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":40,"\u0412\u0435\u0433\u0435\u0442\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0439 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":50,"\u041a\u0430\u0444\u0435-\u043a\u043e\u043d\u0434\u0438\u0442\u0435\u0440\u0441\u043a\u0430\u044f":80,"\u041a\u043e\u0444\u0435\u0439\u043d\u044f":80,"\u0423\u0441\u0442\u0440\u0438\u0447\u043d\u044b\u0439 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":30,"\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d \u0433\u0440\u0435\u0447\u0435\u0441\u043a\u043e\u0439 \u043a\u0443\u0445\u043d\u0438":60,"\u0411\u043b\u0438\u043d\u043d\u0430\u044f":80,"\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d \u043c\u0435\u043a\u0441\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0439 \u043a\u0443\u0445\u043d\u0438":50,"\u0427\u0430\u0439\u043d\u0430\u044f":80,"\u042d\u041a\u041e-\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d":50,"Fish and chips":80},"educational":{"\u0421\u0442\u0443\u0434\u0438\u044f \u0434\u0435\u0442\u0441\u043a\u043e\u0433\u043e \u0442\u0432\u043e\u0440\u0447\u0435\u0441\u0442\u0432\u0430":2,"\u042f\u0441\u043b\u0438":1,"\u0414\u0435\u0442\u0441\u043a\u0438\u0439 \u0441\u0430\u0434":1,"\u0413\u0440\u0443\u043f\u043f\u044b \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438 \u043a \u0448\u043a\u043e\u043b\u0435":1},"repair":{"\u0410\u0432\u0442\u043e\u0440\u0435\u043c\u043e\u043d\u0442\u043d\u0430\u044f \u043c\u0430\u0441\u0442\u0435\u0440\u0441\u043a\u0430\u044f":50,"\u041a\u0443\u0437\u043e\u0432\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b":25,"\u0428\u0438\u043d\u043e\u043c\u043e\u043d\u0442\u0430\u0436":50,"\u0421\u0442\u0430\u043d\u0446\u0438\u044f \u043f\u0440\u043e\u0444\u0438\u043b\u0430\u043a\u0442\u0438\u043a\u0438":100,"\u0422\u044e\u043d\u0438\u043d\u0433-\u0441\u0430\u043b\u043e\u043d":5,"\u0421\u0442\u0430\u043d\u0446\u0438\u044f \u043a\u0430\u043f\u0438\u0442\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0435\u043c\u043e\u043d\u0442\u0430":5,"\u0421\u0442\u0430\u043d\u0446\u0438\u044f \u0441\u0435\u0437\u043e\u043d\u043d\u043e\u0433\u043e \u0440\u0435\u043c\u043e\u043d\u0442\u0430":25,"\u0421\u0442\u0430\u043d\u0446\u0438\u044f \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u044f \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0439 \u0442\u0435\u0445\u043d\u0438\u043a\u0438":25,"\u0421\u0430\u043b\u043e\u043d \u0430\u0432\u0442\u043e\u0441\u0438\u0433\u043d\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0439":100}}
	
  function get_server_date(){
	  //console.info('--Auto--- test---');
  	var server_date = $("div.date_time").text().replace('00:00:00','').replace('00:00:00','') ;
  	server_date = $.trim( server_date );
  	//console.log( server_date );
    return server_date;
  }
  function check_url( str ){
    var pos = location.href.indexOf( str );
    if (pos > 0) return true;
    return false;
  }
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
    //var type = $.trim( $('ul.tabu li').eq(1).text() );
      
    var head = $("div.officePlace");
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
  function print_ok( str ){
     $("#unit3_info").html( str ).css({'color': 'green'}).show();
	}
	function print_error( str ){
     $("#unit3_info").html( str ).css({'color': 'red'}).show();
	}
  function print_error_notes( str ){
    print_error( str ) ;
    addNotes("<font color=red>" + str + "</font>");
  }

  //===== основаня страница ====
  function main_page(){
    var server_date = get_server_date();
  	// Вычитываем данные по юнитам, если это данные за прошлое число грохаем объект
  	// если данных по подразделению еще нет, то создаем объект дял данных
  	obj = loc_storage().load('unit_v3');
  	if ( obj['date'] ==  null ) {
    	obj['date'] = server_date;
    	obj['units'] = new Object();
  	}
  
    if ( obj['date'] == server_date && obj['units'][id] != null ) {
      // нам не надо ничего больше вычитывать
      // при условии, что они есть по подразделению
      print_ok('Данные уже есть в локальном хранилище (' + server_date + ')' ); 
     	return; 
    }
    
  	if ( obj['date'] != server_date ) {
  		obj['units'] = new Object();
    	obj['date'] = server_date;
  	}
  	if ( obj['units'][id] == null ) {
   		obj['units'][id] = new Object();
  	}
  
  	// специализация
		//var type = $("table.infoblock:eq(1) td:eq(1)").text();
  
  	//console.info( type );
  	// параметры подразделения
  	$.get(url_unit + id, function(param){
  		console.info(param);
    	console.info( obj );
    
    	if ( param.service_name == null ) return;
    	if ( param.unit_class_kind == null ) return;
    	if ( param.equipment_count == null ) return;
    	if ( param.employee_count == null ) return;
    	if ( param.sales == null ) return;
    	if ( param.price == null ) return;
    	console.log('---working---');
    
    	// тип подраздления (МЦ, ресторан...)
    	obj['units'][id]['type'] = param.unit_class_kind;
    	// специализация
    	obj['units'][id]['spec'] = param.service_name;
   	 	var max_pos = param.employee_count;
    	if ( param.employee_count < max_pos ) max_pos = param.employee_count;
    	// предельная число рабочих
    	obj['units'][id]['labor'] = parseInt( max_pos );
    	// число посетителей (продажи)
    	obj['units'][id]['sales'] = parseInt( param.sales );
    	// цена в пересчет
    	obj['units'][id]['price_history'] = parseFloat( param.price_history );
      // ограничение по посещаеость (по финансированию)
      obj['units'][id]['customers'] = 0;
      if ( param.customers_count != null ) {
      	obj['units'][id]['customers'] = parseInt( param.customers );  
      }
    
    	console.info( obj );
    	loc_storage().save('unit_v3', obj);
    
    	// читаем данные по специализациям
    	//$.get(url_spec, function(spec){
      spec = json_spec;
    		console.info(spec);
      	if ( spec[ obj['units'][id]['type'] ] == null ) return;
        var k_pos = spec[ obj['units'][id]['type'] ][ obj['units'][id]['spec'] ];
      	console.log('k_pos = ' + k_pos);
        obj['units'][id]['k_pos'] = k_pos;
        loc_storage().save('unit_v3', obj);
        console.info('---- SPEC ----');
        console.info( obj );
        
        var pos_maximum = obj['units'][id]['k_pos'] * obj['units'][id]['labor'];
        if ( obj['units'][id]['customers'] > 0 ) {
        	if ( pos_maximum > obj['units'][id]['customers'] )  {
          	pos_maximum = obj['units'][id]['customers'];  
          }
        }
        var pr = 100 * obj['units'][id]['sales'] / pos_maximum;
        
        if ( pr > 95 ) {
        	addNotes( '<font color=green>Посещаемость: ' + Math.round( pr ) + '%</font>' );
        }else if ( obj['units'][id]['type'] == "" && pr > 75 ) {
          addNotes( 'Посещаемость: ' + Math.round( pr ) + '%' );
        } else if ( obj['units'][id]['type'] == "restaurant" && pr> 0 && pr < 25 ) {
          addNotes( 'Посещаемость: ' + Math.round( pr ) + '%' );
        }else if ( obj['units'][id]['type'] == "medicine" ){
            if ( pr > 70 ) {
                addNotes( 'Посещаемость: <font color=green>' + Math.round( pr ) + '%</font>' );
            } else if ( pr < 10 ) {
                addNotes( 'Посещаемость: <font color=maroon>' + Math.round( pr ) + '%</font>' );
            }
        }
        if ( pr < 1) {
            addNotes( '<font color=red>никто не ходит</font>' );
        }
        print_ok('Посещаемость: ' + Math.round( pr ) + '%' );
      
    	//});
    
  	});
  
  	//console.info( obj );

  }
  
  //==== Снабжение ====
  // Получить число свобонго товара, прописав 0 - если поставщика нет
  function getFreeExt( row, add2 ){
    getFree( row, add2 );
    out = free;
    if (free < 0) out = 0;
    return out;
  }
  // Получить данные о том сколько можнот заказать
	// @param row - строка с данными по товару
	// @partam add - сколько товара надо заказать
	// @return false - наличие ошибок
  function getFree( row, add ){
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
  function supply() {
    //alert("Supply");
    var wc_supply = $("<li id=supply_img class=my_btn> <img title='Автоматизация снабжения' alt='Автоматизация снабжения' src=https://cdn4.iconfinder.com/data/icons/48x48-free-time-icons/48/Medium_speed.png>");

    var container = $('ul.tabu');
    container = $("li:last", container).prev().parent();
    container.append( wc_supply );

    wc_supply.click(function(){
      var id = /(\d+)/.exec(location.href)[0];
      console.log("Kinder click (" + id +")");

      obj = loc_storage().load('unit_v3');
      if ( obj == null) {
        print_error_notes('Ошибка чтения unit_v3');
        return;
      }
      console.info(obj);
      //var server_date = get_server_date();
      obj = loc_storage().load('unit_v3');
      if ( obj == null ){
      	print_error('Сначала нужно отркыть основуню страницу: ' + id);
        return;
      }
      if ( obj['date'] != server_date ){
      	print_error_notes('Неверная дата в локальном хранилище: ' + obj['date'] + '/' +  server_date  + '/');
        return;
      }
      if ( obj['units'][id] == null ) {
        print_error_notes( 'Сначало нужно открыть основуню страницу подразделения' );
        return;
      }
      print_ok('working');
      
      var pos_max = obj['units'][id]['labor'] * obj['units'][id]['k_pos'];
      console.log("labor=" + obj['units'][id]['labor'] + ", k_pos=" + obj['units'][id]['k_pos'])

      var sale = obj['units'][id]['sales'];


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
        var sale_row = num2pops * sale;
        console.log("sale_row:" + sale_row + ", power:" + power + ", number:" + number);

        if ( sale_row == 0 ) {
            addNotes( "<font color=red>Совсем нет продаж...</font>" );
        }
        // сколько заказать
        var add = power;
        if ( number < power ) {
           // завозим товар на 1 раз
           add = power;
        }
        if( number > power *4 ) {
           // склад можн снижать, пересчетов так за 20
            add =  sale_row - ( number - power *4) /20;
        } else if ( number > power *2 ){
            // если уже есть двойно запас то неспеша его наращиваем
            add =  sale_row + ( power *4 - number) /20;
        } else if ( number >= power) {
            add =  sale_row + ( power *3 - number) /10;
        }
        // если запасы очень -очень большие, все равно заказать хотя бы чуть чуть
        if ( add < sale_row * 0.05 ) {
        	add = Math.round( sale_row * 0.05 );
        }
        //var add = (sale_row *10 - number + 3 * power) /10;
          console.log("add:" + add);
        if ( add < 0 ) {
            add = 0;
            addNotes( "<font color=red>Большой склад</font><img src=" + img.attr('src') + " width=16>" );
        }
        if ( (number - sale_row + add) < power ) {
            addNotes( "<font color=red>Странный заказ</font><img src=" + img.attr('src') + " width=16>" );
        }
          add = Math.round( add );
        console.log("add:" + add);
        // сколько останется после продажи
        //var left = number - power;

        //if (left < power) add = power - left;

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
      print_ok('end'); 
      // нажать кнопку изменить
      //$("input[name='applyChanges']").click();
           

    	});

    }
  
  //============ main code ============
  // текущая дата
  var server_date = get_server_date();
  // Идентификатор подразделения
  var id = /(\d+)/.exec(location.href)[0];
  
  // проверить страницу
  if ( check_url('finans_report') ) return;
  if ( check_url('virtasement') ) return;
  if ( check_url('consume') ) return;

  // Стили  
  var st = $("style");
  st.append(".my_btn{cursor:pointer;opacity:0.5;float:left;color: white;}");
  st.append(".my_btn:hover{opacity:1.0}");
	st.append(".my_btn img {width:24px;}");
  //st.append(".my_popup{background: rgb(223, 223, 223) none repeat scroll 0% 0%; z-index: 1002; position: absolute; border: 1px solid rgb(0, 0, 0);max-width: 800px;margin-left: 100px;padding: 8px;display: none;}");
  //st.append(".my_number{text-align: right;width: 80px;}");
	st.append(".my_info{font-weight:bold;border-bottom: solid 1px;border-right: solid 1px;border-left: solid 1px;padding-left: 12px;padding-right: 12px;padding-right: 12px;background: lightgray;display: none;}");


  $("table.infoblock:eq(0)").before("<span class=my_info id=unit3_info></span>");
  
  if ( check_url('supply') ) {
     supply();
     return;
  }
  
  main_page();
  /*
  

  alert('auto');
  console.info( obj );
  loc_storage().save('unit_v3', obj);
  */
  //alert( id );
  
  
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}