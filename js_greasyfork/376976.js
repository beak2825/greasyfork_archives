// ==UserScript==
// @name        Virtonomica:KO restorant get from API
// @namespace   Virtonomica
// @description Получение данных по конкурсным ресторанам из API
// @include     https://virtonomica.ru/vera/main/olla/*
// @version     0.01.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376976/Virtonomica%3AKO%20restorant%20get%20from%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/376976/Virtonomica%3AKO%20restorant%20get%20from%20API.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  // откуда читаем данные по подразделению
  var url_unit = 'https://virtonomica.ru/api/vera/main/unit/summary?id=';

  var tabs = $.trim( $("ul.tabu li.sel").text() );
  //console.log( tabs );
  
  if( tabs != "Кухни мира") {
	  console.log('Shagren_VirtaTable not support');
	  return;
  }

  // Стили
  var st = $("style");
  st.append(".my_btn{cursor:pointer;opacity:0.5}");
  st.append(".my_btn:hover{opacity:1.0}");

	function numberFormat (number) {
  	number += '';
    var parts = number.split('.');
    var int = parts[0];
    var dec = parts.length > 1 ? '.' + parts[1] : '';
    var regexp = /(\d+)(\d{3}(\s|$))/;
    while (regexp.test(int)) {
    	int = int.replace(regexp, '$1 $2');
    }
    return int + dec;
	}
  
  var wc_api = $("<li class='my_btn'><img src='https://cdn4.iconfinder.com/data/icons/web-development-5/500/api-code-window-32.png' title='Получить данные через API'>");
  var wc_out = $("<div id=rest_out></div>");

  $("ul.tabu").append( wc_api );
  $("#childMenu").before( wc_out );

  wc_api.click( function(){
  	console.log('wc_api.click');

    var table = $("table.list tr");
	  console.log( "table = " + table.length );
	  
	  if ( table.length <= 1) {
		  $("#rest_out").text('Отсутствуют результаты').css('color','red');
		  return;
	  }
    
	  for( var i=1; i<table.length; i++ ){
      
      //DEBUG
      //if (i > 5) break;
      
		  var tr = table.eq(i);
		  
		  var a_unit = $("td a[href*='unit']", tr);
		  var rest_id = /(\d+)/.exec( a_unit.attr('href') )[0];
		
      if ( rest_id == 0 ) return;
      if ( rest_id == null ) return;
      
      tr.after("<tr><td colspan=5><span id=ro_"+ rest_id+ "></span>");
      
      $.get(url_unit + rest_id, function( unit ){
      	
        var str = "";
        str += "Посетители: " + numberFormat(unit.sales);
        str += " Цена в пересчет: " + numberFormat( unit.price_history );
        if ( unit.price_history != unit.price ) {
        	str += " Новая цена: " + numberFormat( unit.price );
        }
        str+= " (сборы: " + numberFormat( unit.price_history * unit.sales ) + ")";
        str += "<br>Рабочих:" + numberFormat(unit.employee_count);
        str += " Квалификация: " + numberFormat( Math.round(100*unit.employee_level)/100);
        str += " Качество оборудрования: " + numberFormat( Math.round(100*unit.equipment_quality)/100);
        str += "<br>" + unit.district_name + " ";
        /*
        Obj[unit.id]['shop_id'] = unit.id;
        Obj[unit.id]['employee_required'] = unit.employee_required;
        Obj[unit.id]['advertising_cost'] = unit.advertising_cost;
        Obj[unit.id]['customers_count'] = unit.customers_count;
        Obj[unit.id]['service_type'] = unit.service_type;
      	*/
        //console.log( unit );
        $("#ro_" + unit.id).html(str);

      });

    }
    
  });

}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);