// ==UserScript==
// @name           Virtonomica:Shtuk
// @namespace      virtonomica
// @version        2.19
// @description    расчет числа проданых штук (под конкурс)
// @include        http://virtonomica.ru/vera/*/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/1549/Virtonomica%3AShtuk.user.js
// @updateURL https://update.greasyfork.org/scripts/1549/Virtonomica%3AShtuk.meta.js
// ==/UserScript==

var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;
console.log('start konkurs shop');
//=======================================
// НАСТРЙОКИ ПОД КОНКУРС
//=======================================
// Название товара (приводится в еего иконке), тег alt
//var prod_name = "Лестер-трава";
// Букварь
//var prod_name = "Букварь";
// Фломастер
//var prod_name2 = "Фломастер";
// Гномы
var prod_name = "Канадский лепрекон";

// номер под которым будут сохраняться данные скриптом в истории продаж
// необходимо править каждый день
var today = 1;

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

// Идентификатор подразделения
var id = /(\d+)/.exec(location.href)[0];
//  Определяем тип подразделения
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

// название компании и её id
var href = $("a", head).eq(0);
var company = href.text().replace("<",'').replace(">",'');
var company_id = /(\d+)/.exec( href.attr('href') )[0];

// результаты продажи и текущая цена
//=========================================
// первый товар
//=========================================
var el = $("img[alt='"+ prod_name +"']").parent().parent();
var str = $("td:eq(5)", el);
console.log(str.html() );
// Похоже это не конкурчный магазин
if (str.html() == null) return;

// рыночная доля
var procent = parseFloat( str.text().replace(' %', '') );

// Цена продажи
str = $("td:eq(4)", el);
console.log(str.html() );

var price = parseFloat( str.text().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '') );
if ( isNaN( price) ) price = "---";

console.log(price + " = " + procent);
//=========================================
// второй товар
//=========================================
//var el = $("img[alt='"+ prod_name2 +"']").parent().parent();
//var str = $("td:eq(5)", el);
//console.log(str.html() );

// Похоже это не конкурчный магазин
//if (str.html() == null) return;
// рыночная доля
//var procent2 = parseFloat( str.text().replace(' %', '') );
// Цена продажи
//str = $("td:eq(4)", el);
//console.log(str.html() );
//var price2 = parseFloat( str.text().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '') );
//if ( isNaN( price2) ) price2 = "---";

//alert( price );
//console.log(price2 + " = " + procent2);
//=========================================

// расположение магазина
var state = $("td.title:contains('Район города')").next();
// alert( state.html() );
// Известность
var izv = $("td.title:contains('Известность')").next();
//Уровень сервиса
var serv = $("td.title:contains('Уровень сервиса')").next();
//=======================================
// ФОРМАТ ХРАНЕНИЯ ДАННЫХ
//=======================================
//  id_магазина = [ ид_компании, имя_компании, текущая цена, {история} ]
// история = [дата  = [процент рынка, цена_продажи] ]
//=======================================

// Хранение данных
konkurs = JSON.parse( window.localStorage.getItem('konkurs') );
if ( konkurs == null ) konkurs = new Object();

// следующая строка нужна для очистки данных
//konkurs = new Object();

if ( konkurs[id] == null) konkurs[id] = new Object();

// текущая игровая дата
//var today = $("#calendar_m").text();
//alert( "["+today + "]");
// история продаж по магазину
if ( konkurs[id]['history'] == null ) konkurs[id]['history'] = new Object();
// примечаение от скрипта
konkurs[id]['text'] = "";
if ( konkurs[id]['history'][today] == null) {
 // если истории продаж за это день еще нет:
 konkurs[id]['history'][today] = new Object();
 konkurs[id]['history'][today]['market'] = procent;
 //konkurs[id]['history'][today]['market2'] = procent2;
 //TODO найти предпослений день в истории   
 konkurs[id]['history'][today]['price'] = price;
 //konkurs[id]['history'][today]['price2'] = price2;
} else {
// проверяем обновление цены продажи
if (  price != konkurs[id]['history'][today]['price'] ){
   konkurs[id]['text'] = "Сегодня изменилась цена Букваря";
}

//if (  price2 != konkurs[id]['history'][today]['price2'] ){
//   konkurs[id]['text'] += " Сегодня изменилась цена Фломастера";
//}

if ( price != konkurs[id]['price'] )  {
   konkurs[id]['text'] = "<font color=red>Только что изменилась цена Букваря</font>";
}

//if ( price2 != konkurs[id]['price2'] )  {
//   konkurs[id]['text'] += " <font color=red>Только что изменилась цена Фломастера</font>";
//}

}

if ( konkurs[id]['state'] == null){
	konkurs[id]['state'] = state.text();
}
konkurs[id]['izv'] = izv.text();
konkurs[id]['serv'] = serv.text();

if ( state.text() != konkurs[id]['state'] ){
	konkurs[id]['text'] += " <font color=green>Переехали " + state.text() + "</font>";
	konkurs[id]['state'] = state.text();
}

// сохраняем данные о компании
konkurs[id]['company_id'] = company_id;
konkurs[id]['company_name'] = company;

// текущая цена
konkurs[id]['price'] = price;
ToStorage('konkurs', konkurs);

var txt = "<table><tr><td><td><table width=100%><tr><td align=rigth id=konkurs_title><td align=center><h3>результаты работы конкурсного скрипта</h3></table><td>&nbsp;"
+"<tr><td>&nbsp;<td align=center id=konkurs_form>&nbsp;<td>&nbsp;"
+"<tr><td colspan=3></table>";
var div_form = "<div id=konkurs style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1002; position: absolute; border: 1px solid rgb(0, 0, 0); display: none;'>" + txt + "</div>";
var div_export = "<div id=konkurs_export style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1003; position: absolute; border: 1px solid rgb(0, 0, 0); display: none;'>"
+ "<h3>Данные экспорта</h3>"
+ "<table><tr><td>&nbsp;<td>"
+ "<textarea name=export_text id=export_text rows=10 cols=64></textarea>"
+ "<br><center><span id=export_load></span></center>"
+ "</table>";
+ "</div>";
// http://www.iconsearch.ru/uploads/icons/paper/128x128/file_document_paper_blue_g11834.png
//
var wc = $("<span style='cursor:pointer; color: white;'><img src=http://cdn1.iconfinder.com/data/icons/momenticons-basic/32x32/list-information.png width='32px' alt='Посмотреть итоги работы' src= title='Посмотреть итоги работы'> </span>").click( function() {
   $("#konkurs").toggle();
n= 1;
out = "<table border>";

// Цикл по магазинам
for (key in konkurs){
   if (konkurs[key] == null) continue;
   //if ( konkurs[key]["text"] == "" ) continue;
   if ( konkurs[key]["price"] == null ) continue;
   //if ( konkurs[key]["price"] == 0 ) continue;

   //======================
   // Данныве о продажах
   //======================
   // Букварь
   //var prod_name = "Букварь";
   // Фломастер
   //var prod_name2 = "Фломастер";
   var m_dat = [0, 60158];
   //выдано товару на руки
   var all_n = 15000;
   //======================
   // Все компании
   //======================
   //======================
   // Формируем вывод данных
   //======================
   out+= "<tr><td>"+ n;
   // ссылка на магазин
   //out+= "<td>http://virtonomica.ru/vera/main/unit/view/" + key;
   out+="<td><a href=http://virtonomica.ru/vera/main/unit/view/" + key + ">" + konkurs[key]['company_name'] + "</a>";
   //out+= "<td>" +konkurs[key]["text"];
// Текущая цена
   if ( konkurs[key]["price"] == 0)  out+= "<td>&nbsp;" ;
   else out+= "<td>" +konkurs[key]["price"];

   //if ( konkurs[key]['history'][today]['price2'] == 0)  out+= "<td>&nbsp;" ;
   //else out+= "<td>" + konkurs[key]['history'][today]['price2'] ;

   out += "<td>" +konkurs[key]["izv"];
   out += "<td>" +konkurs[key]["serv"];
   out += "<td>" +konkurs[key]["state"];

//    alert("today = " + today);
if (konkurs[key]['history'][today] == null){
   out+= "<td>&nbsp;<td>&nbsp;" ;
} else {
   if ( konkurs[key]['history'][today]['market'] == 0){
       out+= "<td>&nbsp;" ;
   } else {
       // Сколько было продано в текущий ход
       out += "<td>" + Math.round( konkurs[key]['history'][today]['market']*m_dat[today]/100 );
   }
   //if ( konkurs[key]['history'][today]['market2'] == 0){
   //    out+= "<td>&nbsp;" ;
   //} else {
       // Сколько было продано в текущий ход
   //    out += "<td>" + Math.round( konkurs[key]['history'][today]['market2']*m_dat[today]/100 );
   //}
}
// вычисляем отстаток
for(i=1; i<=today; i++) {
   mm = m_dat[i];
   if (konkurs[key]['history'][i] == null){
    continue;
   }
   if (konkurs[key]['history'][i]['market'] == null){
    continue;
   }
   if (konkurs[key]['history'][i]['market'] == 0){
    continue;
   }
   all_n -= Math.round( konkurs[key]['history'][i]['market']*mm/100 );
}
out+= "<td>" + all_n;
   n++;
}
out += "</table>";
   $("#konkurs_form").html( out );
});

// http://cdn1.iconfinder.com/data/icons/basicset/save_32.png
// http://www.iconsearch.ru/uploads/icons/ultimategnome/48x48/stock_export.png
   var wc_export = $("<span id=main_notes_export style='cursor:pointer; color: white;'><img src=http://cdn1.iconfinder.com/data/icons/basicset/save_32.png title='Окно экспорта/импорта' alt='Окно экспорта/импорта'></span>").click( function() {
   $("#export_text").val( JSON.stringify( konkurs ) );
   $("#konkurs_export").toggle();
   });
// http://cdn1.iconfinder.com/data/icons/freeapplication/png/24x24/Load.png
// http://www.iconsearch.ru/uploads/icons/freeapplication/24x24/load.png
var wc_load = $("<img src=http://cdn1.iconfinder.com/data/icons/freeapplication/png/24x24/Load.png title='Импортировать данные из окна' alt='Импортировать данные из окна'>").click( function() {
   //alert("Load");
   var text =  $("#export_text").val() ;
   try {
   	konkurs = JSON.parse( text );
	   ToStorage('konkurs', konkurs);
	   $("#konkurs_export").hide();
	   $("#main_konkurs").click().click();
   } catch(e) {
	   alert("Неверные данные для импорта");
   }
});
	
	// Оповестить об окончании работы
	var container = $('#topblock');

	container.append( $('<table><tr><td>').append(wc).append('<font color=yellow>end work</font>') );
	container.append( div_form );
	$("#konkurs_title").append(wc_export).append( div_export );
	$("#export_load").append(wc_load);
}

if(window.top == window) {
   var script = document.createElement("script");
   script.textContent = '(' + run.toString() + ')();';
   document.documentElement.appendChild(script);
}