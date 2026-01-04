// ==UserScript==
// @name        Virtonomica: unit extenshion from API
// @namespace   Virtonomica
// @description Отображаем скрытые данные подразделений, получаемые из API
// @include     https://virtonomica.ru/vera/main/unit/view/*
// @version     0.01.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377011/Virtonomica%3A%20unit%20extenshion%20from%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/377011/Virtonomica%3A%20unit%20extenshion%20from%20API.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  // откуда читаем данные по подразделению
  var url_unit = 'https://virtonomica.ru/api/vera/main/unit/summary?id=';
  
  function check_url( str ){
    var pos = location.href.indexOf( str );
    if (pos > 0) return true;
    return false;
  }
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
  function fnumber (number, ext = 0) {
  	if ( ext == 0 ) return numberFormat(number);
    
    var k = Math.pow(10, ext);
    
    return numberFormat( Math.round(k * number ) / k );
  }
  
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


  var wc_api = $("<li class='my_btn fl_r'><img src='https://cdn4.iconfinder.com/data/icons/web-development-5/500/api-code-window-32.png' title='Получить данные через API'>");
  var wc_out = $("<div class='fl_r' id=unit_ext_out></div>");

  if ( $("ul.tabu").length > 0 ) {
    $("ul.tabu").append( wc_api );
  	$("#childMenu").before( wc_out );
  } else {
    // Добавить кнопку в меню для чужих юнитов
  	var table = $("table.infoblock");
    if (table.length > 0 ) {
	  	table.before(wc_api);
  	  table.before(wc_out);
      st.append(".fl_r{float: right;}");
    }  else {
     	// наверное, это новый интерфейс 
      table = $("div.unit_box-container");
  	  table.before(wc_out);
      table.before(wc_api);
    }
  }
  
  
  function get_str_bad_price( val )
  {
    if ( isNaN(val) ) return "";
    
    var d =val;
    console.log( "get_str_bad_price:" +val);
    try{
    	d = parseFloat(val);
    }catch( err ){
    	try {
        console.log( "try 1:" );
      	d = parseInt( val);	
        return fnumber(d, 0);
      }catch( err ){
        console.log( "try 2:" );
      	return "";
      }
    }
    
    console.log( "try end, d="+ d);
    
    if ( d > 0.0001 ) {
      if ( Math.floor(d) == Math.ceil(d) ) {
      	return fnumber(d, 0);
      }
      return d;
    }

    var cnt = 0;
    var out = val[0] + val[1] + val[2] + val[2] ;
    for( var i=4; i< val.length; i++) {
      if ( val[i] != '0' ) break;
      cnt++;
    }
    if ( cnt > 5 ) {
    	out+= "(" + cnt + ")";
    }
    for (var i=cnt + 4; i< val.length; i++){
    	out+= val[i]  ;
    }
    return out;
  }
  
  
  
  wc_api.click(function(){
    
    $("#unit_ext_out").html('запрашиваем Virta API...');
    
  	$.get(url_unit + id, function( unit ){
      	
      var str = "";
      
      if ( unit.district_service_index != null) {
      	str+= 'Сервис района: ' + fnumber( unit.district_service_index, 3);
      }
      if ( unit.city_service_index != null) {
      	str+= '<br>Сервис города: ' + fnumber( unit.city_service_index, 3);
      }
      if ( unit.service_type != null) {
      	str+= '<br>Сервис: ' + fnumber( unit.service_type, 4);
      }
      if ( unit.district_unique_index != null) {
      	str+= '<br>Уникальность района: ' + fnumber( unit.district_unique_index, 3);
      }
      if ( unit.city_unique_index != null) {
      	str+= '<br>Уникальность города: ' + fnumber( unit.city_unique_index, 3);
      }
      if ( unit.sales != null) {
        if( unit.sales.energy_distributed != null ) {
					str+= '<br>Энергии продано: ' + fnumber ( unit.sales.energy_distributed, 0 ) + ' МВт*ч';
          str+= ' , ' + unit.sales.energy_by_consumers;
        } else {
	      	str+= '<br>продажи, шт.: ' + fnumber( unit.sales, 0);
        }
      }
      if ( unit.customers_count != null) {
      	str+= ' | посетители: ' + fnumber( unit.customers_count, 0);
      }
      if ( unit.employee_count != null) {
      	str+= '<br>Рабочие: ' + fnumber( unit.employee_count, 0);
      }
      if ( unit.employee_level != null) {
      	str+= ' | квалификация: ' + fnumber( unit.employee_level, 0);
      }
      
      if ( unit.equipment_quality != null) {
        if ( unit.equipment_quality > 0 ) {
      		str+= ' | Оборудование: ' + fnumber( unit.equipment_quality, 2);
        }
      }
      if ( unit.employee_productivity != null) {
      	str+= '<br>employee_productivity: ' + fnumber( unit.employee_productivity, 4);
      }
      if ( unit.employee_required != null) {
      	str+= '<br>employee_required: ' + fnumber( unit.employee_required, 0);
      }
      
      if ( unit.price != null ) {
      	str+= '<br>price: ' + get_str_bad_price( unit.price );
      }
      
      if ( unit.sales != null && unit.sales.price != null ) {
          str+= "<br>Продажи:";
          str+= '<br>price: ' + get_str_bad_price( unit.sales.price );
      }
      
      if ( unit.price_history != null ) {
      	str+= "<br>Цена в пересчет: " + fnumber(unit.price_history,2);
      }
      
      if ( unit.loading != null) {
       	str+= "<br>loading=" + unit.loading; 
      }
      
      if ( unit.unicity != null && unit.unicity != 1 ) {
        str+= "<br>Уникальность (для магазинов?)=" + unit.unicity; 
      }
           
      // loading
      // price_history
      // unicity
        
      $("#unit_ext_out").html(str);

     });
  });
  
  
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);