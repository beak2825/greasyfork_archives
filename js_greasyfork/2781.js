// ==UserScript==
// @name    	Virtonomica: Снабжение
// @namespace   Virtonomica
// @description автоматическое снабжение
// @version 	0.07
// @include 	http://virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/2781/Virtonomica%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/2781/Virtonomica%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

// проверить - медицинан ли это
var head = $("#unitImage");
var img = $("img", head);

if ( ( img.attr('src') != "/img/v2/units/medicine_5.gif")
	&& ( img.attr('src') != "/img/v2/units/medicine_4.gif")
	&& ( img.attr('src') != "/img/v2/units/medicine_3.gif")
	&& ( img.attr('src') != "/img/v2/units/medicine_2.gif")
	&& ( img.attr('src') != "/img/v2/units/medicine_1.gif")
	&& ( img.attr('src') != "/img/v2/units/restaurant_5.gif")
	&& ( img.attr('src') != "/img/v2/units/restaurant_4.gif")
	&& ( img.attr('src') != "/img/v2/units/restaurant_3.gif")
	&& ( img.attr('src') != "/img/v2/units/restaurant_2.gif")
	&& ( img.attr('src') != "/img/v2/units/restaurant_1.gif")
) return;


// Панелька для моих иконок
var wc = $("<li><div id=medical_supply style='float:left;cursor:pointer; color: white;'> <img title='Рассчитать снабжение' alt='Расчет снабжения' src=http://www.iconsearch.ru/uploads/icons/iconslandtransport/24x24/lorrygreen.png> </div>").click( function() {
 $("#medical_supply_info").html("нажали кнопку");
 //alert("start");
//---------------------------------------------------------------------
// работа с локальным хранилищем
//---------------------------------------------------------------------
/**
* записать данные в локальнео хранилище, с проверкой ошибок
*/
function ToStorage(name,  val)
{
	try {
 	window.localStorage.setItem( name,  JSON.stringify( val ) );
	} catch(e) {
 	out = "Ошибка добавления в локальное хранилище";
 	//console.log(out);
	}
}

function getFromStorage(obj, id_shop)
{
	if (obj[id_shop] == null) return '';
	return JSON.stringify(obj[id_shop]);
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
	 
	var head = $("#headerInfo");
	var title = $("h1", head).text();

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

	ToStorage('notes', notes);
}
//---------------------------------------------------------------------
// работа с локальным хранилищем
//---------------------------------------------------------------------

// Получить данные о том сколько можнот заказать
// @param row - строка с данными по товару
// @partam add - сколько товара надо заказать
// @return false - наличие ошибок
function getFree( row, add )
{
 	console.log( "-----getFree(" +add+")" );
 	error_str = "";
 	free = 0; // по умолчанию считаем что свободного ничего нет

 	//free = $("td[id^='free']", row );
 	free_td = $("td:contains('Свободно')", row).next();
 	console.log( "FREE = " + free_td.text() );
 	if ( free_td.text() == "Не огр."){
      	free = -1; // очень много
 	} else {
      	free = parseInt( free_td.text().replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
 	}
 	if ( isNaN(free) ) {
      	error_str = "<img src=" + img.attr('src') + " width=16> Отсутствует поставщик";
      	addNotes( "<font color=red>" + error_str +"</font>" );
      	console.log( error_str );
      	return false;
 	}
 	console.log( "FREE = " + free);

 	// независимый поставщик
 	if ( free == -1 ) return true;

 	// ограничение про заказу со склада
 	max_limit = 0;
 	max_info = $("span:contains('Max:')", row );
 	if (max_info.length > 0) {
     	// Выбираем минимум из свободного и огранияения по поставке
     	max_limit =  parseInt( max_info.text().replace("Max:","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
     	console.log( "max_info = " + max_limit );
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
// Получить число свобонго товара, прописав 0 - если поставщика нет
function getFreeExt( row, add2 )
{
 	getFree( row, add2 );
 	out = free;
 	if (free < 0) out = 0;
 	return out;
}


Murl=window.location.href.slice(0,-7);
$.get(Murl,function(data){
	$("#medical_supply_info").html("читаем первую страницу подразделения");
	//alert("read");

	// Это медцентр
	// определим его тип
	var type = $("div.cheader", data).text();
	 
	// количество сотрудников
	str = $("td:contains('Количество сотрудников')", data).next().text();
	n = str.indexOf("(");
	var personal = parseInt( str.substr(0, n).replace(" ", "").replace(" ", "") );

	if (isNaN(personal) ){
    	addNotes( "<font color=purple>Не смогли узнать число рабочих</font>" );
    	return;
	}
	if (personal == 0) {
    	addNotes( "<font color=red>Отсутствуют рабочие</font>" );
    	return;
	}
	$("#medical_supply_info").html("Число рабочих: " + personal);

	// коэффициент продаж
	var k = 0;
 	if ( type == "Больница") {
    	k = 0.2;
	} else if ( type == "Поликлиника") {
    	k = 5;
	} else if ( type == "Диагностический центр") {
    	k = 5;
	} else if ( type == "Сырный ресторан") {
    	k = 40;
	} else if ( type == "Пивной ресторан") {
    	k = 60;
	} else if ( type == "Стейк ресторан") {
    	k = 50;
	} else if ( type == "Рыбный ресторан") {
    	k = 30;
	} else if ( type == "Устричный ресторан") {
  	k = 30;
	}else if ( type == "Кафе-мороженое") {
  	k = 80;
	} else if ( type == "Кафе-кондитерская") {
  	k = 80;
	} else if ( type == "Кофейня") {
  	k = 80;
	} else if ( type == "Ресторан итальянской кухни") {
    	k = 60;
	} else if ( type == "Ресторан русской кухни") {
    	k = 50;
	} else if ( type == "Фастфуд") {
    	k = 70;
	}

	if (k==0) {
    	$("#medical_supply_info").html("Непоодерживаемая специализация: " + type);
    	return;
	}
	max = personal * k;

	var table  = $("table.list");

	// Строка для сообщения о проблемах в снабжении
	var error_str = "";

	// список товаров на заказ
	var tr = $("tr[id^='product_row']", table);
	for(i=0; i<tr.length; i++) {
  	table2 = $("td:contains('Количество')", tr.eq(i) );
  	td = $("td:contains('Количество')", table2 ).next();
  	// сколько есть на складе
  	number = parseInt( td.text().replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );

  	table2 = $("td:contains('Расх. на клиента')", tr.eq(i) );
  	td = $("td:contains('Расх. на клиента')", table2 ).next();
	 
  	// на одного посетителя
  	num2pops = parseInt( td.text().replace(" ", "") );
 console.log( "num2pops = " + num2pops);
  	if (isNaN(num2pops) ) {
     	// для ресторанов по другому
     	table2 = $("td:contains('Требуется')", tr.eq(i) );
     	td = $("td:contains('Требуется')", table2 ).next();
     	num2pops = parseInt( td.text().replace(" ", "") );
 console.log( "!!!num2pops = " + num2pops);
  	}

  	img = $("img[src^='/img/products']", tr.eq(i));
  	console.log("IMG= " + img.length) ;
  	// на следующий ход должно гарантированно остаться на максимально возможный расход
	 
  	// мощность продаж
  	power = num2pops * max;
  	// сколько заказать
  	add = 0;

  	// сколько останется после продажи
  	left = number - power;
  	if (left < 0) left = 0;

  	if (left < power) add = power - left;
  	console.log( "num2pops = " + num2pops);
  	console.log( "number = " + number);
  	console.log( "power = " + power);
  	console.log( "add = " + add);

  	// анализ схемы снабжения

  	// поиск дополнительных поставщиков
  	tr_id = tr.eq(i).attr('id') ;
  	tr_sub_id = tr_id.replace("product_row", "product_sub_row");
  	str = "tr[id^='" + tr_sub_id + "']";
  	sr_tr = $(str, table);
  	if (sr_tr.length == 0) {
      	// У нас только один поставщик
      	// проверить свободные	 
      	free = $("td:contains('Свободно')", tr.eq(i) ).next().text();
      	free = parseInt( free.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );

      	if (isNaN(free) ) {
           	error_str = "<img src=" + img.attr('src') + " width=16> Отсутствует поставщик";
           	addNotes( "<font color=red>" + error_str +"</font>" );
           	console.log( error_str );
           	continue;
      	} else if (add > free) {
           	error_str = "<img src=" + img.attr('src') + " width=16> Недостаточно свободного товара у поставщика";
           	addNotes( "<font color=red>" + error_str +"</font>" );
           	console.log( error_str );
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

      	inp[j+1] = $("input[name^='supplyContractData[party_quantity]']", row) ;
      	console.log(j + ". " +inp[j+1].val() + " = " + inp[j+1].length);

  	}
  	console.log( JSON.stringify(stat) );
  	//checkFree( add, tr.eq(i) ) ;
  	add_left = add ;
  	for(j=0; j<stat.length; j++) {
      	if ( add_left <= stat[j]['free'] ) {
           	stat[j]['add'] = add_left;
           	add_left = 0;
           	break;
      	}
      	stat[j]['add'] = stat[j]['free'];
      	add_left -= stat[j]['free'];
  	}
  	console.log( JSON.stringify(stat) + " = " + add_left);
  	// выставыляем цифры в интерфейс
  	for(j=0; j<stat.length; j++) {
      	inp[j].val( stat[j]['add'] );
      	console.log( inp[j].attr("name") );
  	}
  	if ( add_left > 0) {
       	error_str = "<img src=" + img.attr('src') + " width=16> Нехватка товара у поставщиков (мультизаказ) ";
       	addNotes( "<font color=red>" + error_str +"</font>" );
  	}

	}
	// нажать кнопку изменить
	$("input[name='applyChanges']").click();
	$("#medical_supply_info").html("поменяли цифры");
	//alert("work");

});
$("#medical_supply_info").html("завершили функцию");
// alert("end");
}); // end wc

var container = $('#topblock').next();
container = $("li:last", container).prev().parent();
container.append(wc) ;
$("table.infoblock").before("<span id=medical_supply_info></span>");


// end
}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}
