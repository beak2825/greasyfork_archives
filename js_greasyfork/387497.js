// ==UserScript==
// @name           Virtonomica:GosSnab
// @namespace      virtonomica
// @version        1.75
// @include        https://*virtonomic*.*/*/main/unit/view/*/supply*
// @include        https://igra.aup.ru/*/main/unit/view/*/supply
// @description Добавляет кнопки автоматического выставления количества заказываемого товара
// @downloadURL https://update.greasyfork.org/scripts/387497/Virtonomica%3AGosSnab.user.js
// @updateURL https://update.greasyfork.org/scripts/387497/Virtonomica%3AGosSnab.meta.js
// ==/UserScript==

var run = function() {

// Версия минимального снабжения (прописать цифру 1)
var minimal = 0;
// особые условия закупки при занятии данной доли рынка
var limit = 10;
// Заводы: запас комплектующих впересчетах
var factory_store = 2;

// минимальная закупка при старте продаж с нуля
var start_shtuk = 100;

var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

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

	// дизайно 16.10.2017
	var title = $("div.title h1").text();
	var type = $.trim( $('ul.tabu li').eq(1).text() );

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


function SetAmount( up) {

	var n_row = 0;
	var change = 0;
	var up_count = 0;
	var down_count = 0;
	var prc_count = 0;
	$("tr.product_row, tr[id^='r']").each( function() {
		var el_info = $("td:eq(3)", this);

		img = $("img[src*='/img/products']", this);

		//alert(" !!! " + img.attr("src") + "("+market[ img.attr("src") ] + ")" );

		// на складе
		var col =	parseInt ( $("tr td:contains('Количество')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
		//продано в магазине
		var sale =	parseInt ( $("tr td:contains('Продано')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
		// зауплено в этот ход
		var amount = parseInt ( $("td:eq(15)", this).text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
		// Свободно на складе
		var free = parseInt ( $("tr td:contains('Свободно')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );

		console.log("COL= " +col + " SALE = "+ sale + " AMOUNT = " + amount + " free = " +free);

		// поле для ввода количества заказываемого товара
		var input = $("input[name^='supplyContractData']:eq(1), input[id^='qc']", this);

		// если больше одного поставщика, то пропускаем
		var test = $("td[id^='name']",this).attr('id');
		pos = test.indexOf('_');
		pos2 = test.indexOf('_', pos+1);
		var id = test.substr(pos+1, pos2-pos -1);
		if ( gaMaterialProduct[ id ]['subRowCount'] > 1) {
			//нашли несколько строк
			return;
		}

		set = sale; // закупить то, что было продано
		console.log ("1.set = "+ set);
		// если нет двухкратного запаса
		if ( col/2 < sale)  {
			set = Math.round( sale*1.2);
		}
		if ( col < sale ) {
			set  = sale * up;
		}else if ( col > sale*14) {
			// если продажи не существенные
			set = 0;
		}  else if ( col > sale*8) {
			// если продажи не существенные
			set = Math.round( sale /4);
		}  else if ( col > sale*4) {
			// если запасы слишком большие
			set = Math.round( sale /2);
		} else if ( col > sale*3) {
			set = Math.round( sale *0.8);
		} else if ( col > sale*2) {
			set = Math.round( sale *0.95);
		} else if ( col > sale*1.5) {
			set = Math.round( sale *up / (col/ sale ) );
		} else if ( col > sale ) {
			set = Math.round( (up+1)*sale - col );
		}
		console.log ("2.set = "+ set);
		// попробовать пробную партию
		if ( (sale == 0) && (col == 0) && (amount==0) ){
			// пробная закупка
			set = 1;
			console.log ("new.set = "+ set);
                }

		if( !( (sale == 0) && (amount==0) ) ) {
		    // если на складе запас равен закупке, то значит, все что было продано, уменьшать нельзя
		    if ( amount == col) {
			set = amount;
			if ( sale > amount) set = sale * up ; // если продали больше чем купили, то делаем запас на будущее
			if ( sale <= amount) set = amount * up;
		    }
		    // первая закупка
		    if ((sale == 0) && (col == amount)){
			set = amount;
		    }

		    console.log ("3.set = "+ set);

		    // Версия минимального снабжения
		    if (minimal == 1){
			if ( sale == col) {
				if (sale <= amount) set = sale;
				if (sale > amount) set = Math.round(amount*1.25);
			}

			if (amount > sale) {
				if (col <= sale) {
				 	set = Math.round(sale*1.25);
					//alert("2 sale = " + sale);
				}
			}
			if (sale < col*0.8) {
				set1 = Math.round(sale*0.8);
				set2 = Math.round(set*0.8);
				if (set1 > set2) set = set2;
				else set = set1;
			}

			if (sale < col*0.5) {
				set1 = Math.round(sale*0.2);
				set2 = Math.round(set*0.2);
				if (set1 > set2) set = set2;
				else set = set1;
			}

			if ( amount == col) {
				set = Math.round(sale*1.25);
			}
		    }
		    console.log ("4.set = "+ set + " limit = "+ limit);

		if ( (sale == 0) && (amount < start_shtuk) ){
			// пробная закупка
			set = start_shtuk;
			console.log ("new.set.2 = "+ set);
                }


   		    if (limit > 0) {
			prc = market[ img.attr("src") ];
			if (prc > 50) addNotes('<img src=' + img.attr("src")+ ' width=16px>' + 'Доля рынка: ' + prc + "%");
			var sum = price[ img.attr("src") ];
			var s2;
			var s1 = my_price[ img.attr("src") ] ;
			if (prc < 100) {
				s2 = (100*sum - prc*s1)/(100 - prc);
			} else {
				s2 = s1;
			}
			if (s2 > s1 ){
				addNotes('<img src=' + img.attr("src")+ ' width=16px>' + ' проверить цену');
			}
			console.log ("6.set = "+ set);
			if (prc > limit) {
				prc_count++;
				all = Math.round(100*sale/prc);
				// Не закупать больше рынка
				if (set > all*1.1) {
					set = Math.round(all*1.1);
				}  else  if ( (col+set -sale) > all*1.1 ) {
                                        // прогноз тгго, что будет на складе через персчет
                                        new_sklad = col+set - sale;
					if (new_sklad > all*14) {// ух ты запасов хватит еще на 2 недели торговли
						set = 0;
					} else if (new_sklad > all*8) {
						set = Math.round( sale /4);
					} else if (new_sklad > all*4) {
						set = Math.round( sale /2);
					} else if (new_sklad > all*2) {
						set = Math.round( sale *0.75);
					} else if (new_sklad > all) {
						set = Math.round( sale *0.9);
					} else {
  						// не держать запасов больше рынка
						set = Math.round(all*1.1 - col +sale);
						if (set <0) set = 0;
					}
				}
				// уменьшить прирост закупок до 25% если превышен лимит рынка
				if ( amount != col) {
					if ( set/sale > 1.25) {
						set = Math.round(sale*1.25);
					}
				} else {
					set = Math.round(amount*1.25);
				}
			}
		    }
		    console.log ("5.set = "+ set);
		}
		if (set != input.attr("value") ) {
			change++;
			if ( set > input.attr("value") ){
				up_count ++;
			} else {
				down_count ++;
			}
		}
		if (set > free) {
			//console.log(img.attr("src"));
			if ( !(free==0 && set ==1) ) {
				addNotes("<img width=16px src="+ img.attr("src") + "> Нехватка товара у поставщика ("+ free +" вместо "+ set + ")" );
			}
		}

		input.attr("value", set) ;	// пишем новое значение
		n_row++;

	});
	$("#gossnab").append("Обработано строк: " + n_row + ", изменено: "+ change+ " (up:" + up_count + "; down:" + down_count+ ")");
	if ( (limit > 0) && (prc_count >0) ){
		$("#gossnab").append("<br>Больших долей рынка: " + prc_count+ "");
	}
}

function ClearAmount( ) {
	var n_row = 0;
	$("tr[id^='product_'], tr[id^='r']").each( function() {//Магазины
		var input = $("input[name^='supplyContractData']:eq(1), input[id^='qc']", this);
		input.attr("value", 0);
		n_row++;
	});
    //$("tr[id^='r']").each(function(){ //Заводы
    //    var input = $("input[id^='qc']", this);
    //    $(input).val(0);
	//	n_row++;
    //});
	$("#gossnab").append("Обнулили: " + n_row );
}

function SetFactory( mode ) {
	var n_row = 0;
	$("tr[id^='product_row'], tr[id^='r']").each( function() {
		// Требуется
		var require = parseInt ( $("tr td:contains('Требуется')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
        if(!require)
            require = 0;
		var warehouse = parseInt ( $("tr td:contains('Количество')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
        if(!warehouse)
            warehouse = 0;

		// поле для ввода количества заказываемого товара
		var input = $("input[name^='supplyContractData']:eq(1), input[id^='qc']", this);
        console.log(input);

		// если больше одного поставщика, то пропускаем
		var test = $("td[id^='name']",this).attr('id');
        if(test){
		pos = test.indexOf('_');
		pos2 = test.indexOf('_', pos+1);
		var id = test.substr(pos+1, pos2-pos -1);
		if ( gaMaterialProduct[ id ]['subRowCount'] > 1) {
			//нашли несколько строк
			return;
		}
        }
		k_zak = 0;
		switch ( mode )
		{
		  case 1:
			set = require; // закупить то, что требуется
		    break;
		  case 2:
			k_zak = 1;
		    	set = 2 * require - warehouse;
			if (set < 0) set =0;
			if (warehouse < require) set = require;
		    break;
		  case 3:
			k_zak = 2;
		    break;
		  case 4:
			k_zak = 2.5;
		    break;
		}
		if (k_zak > 0){
		    	set = (k_zak +1) * require - warehouse;
			if (set < 0) set =0;
			if (warehouse < require) set = k_zak * require;
		}

		set = Math.round( set );
		input.attr("value", set) ;	// пишем новое значение
		n_row++;
	});
	$("#gossnab").append("Обработано строк: " + n_row );
}

var out = '<td><span id=gossnab style="color:yellow"></span>';

var input_clear = $('<button id=b_clear>Clear</button>').click(function() {
		ClearAmount();
});

// данные Для магазинов
var tr; // здесь будет список товаров
var table; // таблица с товарами
// данные по одному товару
var col; // на складе
//var col =	parseInt ( $("tr td:contains('Количество')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
var sale; //продано в магазине
//var sale =	parseInt ( $("tr td:contains('Продано')", this).next().text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
var amount; // зауплено в этот ход
//var amount = parseInt ( $("td:eq(15)", this).text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') );
var item_name; // название товара
var item_img;  // картинка товара
var free;      // количство свободного товара
var input_item; //оля для ввода заказ

var error_str = ""; // строка с описанием ошибки
var prc_count = 0;


//======================================
//  Shop
//  а также базовые функции для выборки данных
//======================================
// Контрол для магазинов
var wc_shop = $("<li><div id=shop_supply style='float:left;cursor:pointer; color: white;'> <img width=32px title='Рассчитать снабжение' alt='Расчет снабжения' src=https://cdn4.iconfinder.com/data/icons/48x48-free-object-icons/48/Lorry.png> </div>");

// Получить список товаров
function getItemList()
{
    table  = $("table.list");

    // список товаров на заказ
    tr = $("tr[id^='product_row']", table);
    console.log("product_row = " + tr.length);
}

// Получить имя и картинку товара
// @param row - строка с данными по товару
function getItemName( row )
{
      // название товара и его картинка
      img = $("img[src^='/img/products']", row );
      item_name = img.attr('alt') ;
      item_img = img.attr('src') ;
      //console.log( item_name + ": " + item_img );
}
// Получить данные о продажах или о том, сколько товара требуется
// @param row - строка с данными по товару
function getItemCol( row )
{
      table2 = $("td:contains('Количество')", row );

      td = $("td:contains('Количество')", table2 ).next();
      // сколько есть на складе
      col = parseInt( td.text().replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );
      //console.log("col = " + col);
}
// Выделить данные о продажах товара
// @param row - строка с данными по товару
function getItempSale( row, pattern )
{
      table2 = $("td:contains('" + pattern + "')", row );

      td = $("td:contains('" + pattern + "')", table2 ).next();
      // сколько было продано
      sale = parseInt( td.text().replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );
      //console.log("sale = " + sale);
}
// Получить идентификаторы заказов
// @param row - строка с данными по товару
function getSubId( row )
{
     tr_id = row.attr('id') ;
     console.log( "tr_id = " + tr_id);

     tr_sub_id = tr_id.replace("product_row", "product_sub_row");
     console.log( "tr_sub_id = " + tr_sub_id);

     return "tr[id^='" + tr_sub_id + "']";
}
function getInput( row )
{
     input_item = $("input[name^='supplyContractData[party_quantity]'], input[id^='qc']", row );
}
// Получить данные о том сколько можнот заказать
// @param row - строка с данными по товару
// @partam add - сколько товара надо заказать
// @return false - наличие ошибок
function getFree( row, add )
{
     console.log( "-----getFree" );
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
          error_str = "<img src=" + item_img + " width=16> Отсутствует поставщик";
          //addNotes( "<font color=red>" + error_str +"</font>" );
          console.log( error_str );
          return false;
     }
     console.log( "FREE = " + free);

     // независимый поставщик
     if ( free == -1 ) return true;

     // ограничение про заказу со склада
     max = 0; 
     max_info = $("span:contains('Max:')", row );
     if (max_info.length > 0) {
         // Выбираем минимум из свободного и огранияения по поставке
         if ( max > free ) free = max;
         max =  parseInt( max_info.text().replace("Max:","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
         console.log( "max_info = " + max );
         if ( max > free ) free = max;
     }

     if ( (add > free) || ( (add > max) && (max > 0) ) ) {
           error_str = "<img src=" + item_img + " width=16> Недостаточно свободного товара у поставщика";
           //addNotes( "<font color=red>" + error_str +"</font>" );
           console.log( error_str );
           return false;
     }

     return true;
}
// Получить число свобонго товара, прописав 0 - если поставщика нет
function getFreeExt( row, add )
{
     getFree( row, add );
     out = free;
     if (free < 0) out = 0;
     return out;
}
// Вычислить сколько надо заказывать
function calculateAdd( up )
{
    set = sale; // закупить то, что было продано
    console.log ("1.set = "+ set);
    // если нет двухкратного запаса
    if ( col/2 < sale)  {
	set = Math.round( sale*1.2);
    }
    if ( col < sale ) {
	set  = sale * up;
    }else if ( col > sale*14) {
	// если продажи не существенные
	set = 0;
    }  else if ( col > sale*8) {
	// если продажи не существенные
	set = Math.round( sale /4);
    }  else if ( col > sale*4) {
	// если запасы слишком большие
	set = Math.round( sale /2);
    } else if ( col > sale*3) {
	set = Math.round( sale *0.8);
    } else if ( col > sale*2) {
	set = Math.round( sale *0.95);
    } else if ( col > sale*1.5) {
	set = Math.round( sale *up / (col/ sale ) );
    } else if ( col > sale ) {
	set = Math.round( (up+1)*sale - col );
    }
    console.log ("2.set = "+ set);

    // попробовать пробную партию
    if ( (sale == 0) && (col == 0) && (amount==0) ){
	// пробная закупка
	set = 1;
	console.log ("new.set = "+ set);
    }

    if( !( (sale == 0) && (amount==0) ) ) {
	// если на складе запас равен закупке, то значит, все что было продано, уменьшать нельзя
	if ( amount == col) {
	    set = amount;
	    if ( sale > amount) set = sale * up ; // если продали больше чем купили, то делаем запас на будущее
		if ( sale <= amount) set = amount * up;
            }
	    // первая закупка
	    if ((sale == 0) && (col == amount)){
		set = amount;
	    }
	    console.log ("3.set = "+ set);

	    // Версия минимального снабжения
	    if (minimal == 1){
		if ( sale == col) {
			if (sale <= amount) set = sale;
			if (sale > amount) set = Math.round(amount*1.25);
		}

		if (amount > sale) {
			if (col <= sale) {
			 	set = Math.round(sale*1.25);
				//alert("2 sale = " + sale);
			}
		}
		if (sale < col*0.8) {
			set1 = Math.round(sale*0.8);
			set2 = Math.round(set*0.8);
			if (set1 > set2) set = set2;
			else set = set1;
		}

		if (sale < col*0.5) {
			set1 = Math.round(sale*0.2);
			set2 = Math.round(set*0.2);
			if (set1 > set2) set = set2;
			else set = set1;
		}

		if ( amount == col) {
			set = Math.round(sale*1.25);
		}
           } // Версия минимального снабжения
	   console.log ("4.set = "+ set);


   	  if (limit > 0) {
		prc = market[ img.attr("src") ];
		if (prc > limit) {
			prc_count++;
			all = Math.round(100*sale/prc);
			// Не закупать больше рынка
			if (set > all*1.1) {
				set = Math.round(all*1.1);
			}  else  if ( (col+set -sale) > all*1.1 ) {
                                // прогноз тгго, что будет на складе через персчет
                                new_sklad = col+set - sale;
				if (new_sklad > all*14) {// ух ты запасов хватит еще на 2 недели торговли
					set = 0;
				} else if (new_sklad > all*8) {
					set = Math.round( sale /4);
				} else if (new_sklad > all*4) {
					set = Math.round( sale /2);
				} else if (new_sklad > all*2) {
					set = Math.round( sale *0.75);
				} else if (new_sklad > all) {
					set = Math.round( sale *0.9);
				} else {
  					// не держать запасов больше рынка
					set = Math.round(all*1.1 - col +sale);
					if (set <0) set = 0;
				}
			}
			 console.log ("6.set = "+ set + ", sale=" + sale);
			// уменьшить прирост закупок до 25% если превышен лимит рынка
			if ( amount != col) {
				if ( set/sale > 1.25) {
					set = Math.round(sale*1.25);
				}
			} else if ( sale < amount ){
				set = Math.round(amount*1.25);
			}
		}
	 }
	 console.log ("5.set = "+ set);
    }
   //input.attr("value", set) ;	// пишем новое значение
   //n_row++;

   return set;
}
// Обработка многократных заказов
// @param row - строка с данными по товару
function processMulti( row, sr_tr, add )
{
       console.log("processMulti(" + add + ")");
       // несколько поставщиков
       var stat = new Array(); // массив с данными поставщика
       stat[0] = new Object();
       //var inp = new Array(); // массив с полями для ввода данных

       stat[0]['add'] = 0; // сколько надо заказать
       stat[0]['free'] = getFreeExt( row, add );
       getInput( row );
       stat[0]['inp'] = input_item;
       amount = input_item.val();
       //inp[0] = input_item;
       //console.log(inp[0].val() + " = " + inp[0].length);

       // цикл по поставщикам
       for(j=0; j<sr_tr.length; j++){
          //console.log( "--- J=" +j + "----");
          stat[j+1] = new Object();
          stat[j+1]['add'] = 0; // сколько надо заказать
          stat[j+1]['free'] = getFreeExt( sr_tr.eq(j), add );
	  getInput( sr_tr.eq(j) );
          stat[j+1]['inp'] = input_item;
          //inp[0] = input_item;
       } // цикл по поставщикам
       //console.log( JSON.stringify(stat) );

       // простейший вариант - первый попавшийся поставщик выбирается по максимуму штук
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
       //console.log( JSON.stringify(stat) + " = " + add_left);

       // выставляем цифры в интерфейс
       for(j=0; j<stat.length; j++) {
           stat[j]['inp'].val( stat[j]['add'] );
           console.log( stat[j]['inp'].attr("name") );
       }
       if ( add_left > 0) {
            error_str = "<img src=" + item_img + " width=16> Нехватка товара у поставщиков (мультизаказ) ";
            //addNotes( "<font color=red>" + error_str +"</font>" );
       }

}

//================
wc_shop.click( function() {
    getItemList();
    for(i=0; i<tr.length; i++) {
       getItemName( tr.eq(i) );
       getItemCol( tr.eq(i) );
       getItempSale( tr.eq(i), "Продано" );
       console.log("-----------------");
       console.log( item_name + ": " + item_img );
       console.log("col = " + col + " sale = " + sale );

       // сколько надо заказать товара
       var add = sale;
       getInput( tr.eq(i) );
       amount = parseInt( input_item.parent().prev().prev().text().replace(" ", '').replace(" ", '').replace(" ", '').replace(" ", '').replace(" ", '').replace(" ", '') );
       console.log("amount = " + amount );
       add = calculateAdd( 2 );

       sr_tr = $( getSubId( tr.eq(i) ),  table );
       if (sr_tr.length == 0) { // У нас только один поставщик
           // проверить свободные
           if ( getFree( tr.eq(i), add ) == false) continue;

           console.log("add = " + add );
           input_item.val(add);
           continue;
       }

       console.log("много поставщиков");
       processMulti( tr.eq(i), sr_tr, add );

    }// цикл по товарам (компонентам)
});

function checkShop( )
{
	// кривой способ определения типа юнита по названию вкладки
	var title = $.trim( $('ul.tabu li').eq(1).text() );
	//console.log( title );
	if ( title == 'Магазин' ) return true;

	//if ( img =='<img src="/img/v2/units/shop') return true;
	//if ( img =='<img src="/img/v2/units/fuel') return true;

	return false;
}

//var img =  $("#unitImage").html();
//img = img.substr(0,img.length-8);
// Проверить, что это магазин
//if ( img =='<img src="/img/v2/units/shop') {
if ( checkShop( ) )	{
	// кнопки
	 var input_2 = $('<button id=b2>1:1 up2</button>').click(function() {
		SetAmount(2);
	});
	 var input_5 = $('<button id=b5>1:1 up4</button>').click(function() {
		SetAmount(4);
	});
	var container = $('div.metro_header');
	container.append( $('<table><tr>').append('<td>').append(input_2).append('<td>').append(input_5).append('<td>').append(input_clear).append( out)   );

	container = $('ul.tabu');
	container = $("li:last", container).prev().parent();
	container.append(wc_shop) ;
	//$("table.infoblock").before("<span id=factory_supply_info></span>");

	// найти "свободно"
    /*
	$("td[id^='free']").attr('title','Закупить весь остаток').live('dblclick', function(){
		var free = $(this).text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') ;
		var td = $("td[id^='quantityField']",  $(this).parent().parent().parent().parent().parent() ) ;
		var input = $("input[name^='supplyContractData']:eq(0)", td );
		input.attr("value", free) ;
	});
    */

	var market = new Array();
	var price = new Array();
	var my_price = new Array();
	if (limit > 0) {
		// Формируем ссылку на торговый зал
		var url = /^https:\/\/virtonomic[as]\.(\w+)\/\w+\//.exec(location.href)[0];
		//var id = /\/unit\/view\/(\d+)/.exec(location.href)[0];
		var id = /\/unit\/view\/(\d+)/.exec(location.href)[0];
		url = url + "main" + id + "/trading_hall";
		//alert(url);
	   	$.get(url, function(data) {
			//alert("read");
	        	var td = $("td:contains('%')", data);
			for (i=1; i< td.length; i++) {
				td_pr = td.eq(i);
				tr = td_pr.parent();
				img = $("img[src*='/img/products']", tr);
				// Наша доля на рынке
				market[ img.attr('src') ] = parseFloat( td_pr.text().replace('%', '') );
				//Цена продажи в магазинах города
				price[ img.attr('src') ] = parseFloat( td_pr.next().text().replace('$', '').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
				//console.log(price[ img.attr('src') ]);
				// моя цена продажи
			}
			var inp = $("input[name^='productData[price]']", data);
			console.log("inp = "+ inp.length);
			for(var i=0; i<inp.length; i++){
				img = $("img[src*='/img/products']", inp.eq(i).parent().parent() );
				//console.log( img.attr('src') + "===" + inp.eq(i).val() );
				my_price[ img.attr('src') ]= parseFloat( inp.eq(i).val() );
			}
	   	});
		//alert('post read');
	}

}
// Проверить не завод ли это
function checkType()
{
	// кривой способ определения типа юнита по названию вкладки
	var title = $.trim( $('ul.tabu li').eq(1).text() );
	//console.log( title );
	if ( title == 'Завод' ) return true;
	if ( title == 'Мельница' ) return true;
	if ( title == 'Ферма' ) return true;
	if ( title == 'Предприятие дошкольного образования' ) return true;
	if ( title == 'Ресторан' ) return true;
	if ( title == 'Авторемонтная мастерская' ) return true;
	if ( title == 'Оператор мобильной связи' ) return true;
	if ( title == 'Медицинский центр' ) return true;
	/*
   var head = $("#unitImage");
   var img = $("img", head);
   link = img.attr('src');

   n = link.indexOf('workshop');
   if (n > 0) return true;

   n = link.indexOf('mill');
   if (n > 0) return true;

   n = link.indexOf('animalfarm');
   if (n > 0) return true;
*/
   return false;
}
//======================================
//  Factory
//======================================
// Вычислить сколько надо заказывать
// @param k - Коэффициент заказа
function calculateFactoryAdd( k )
{
       return sale * k - col;
}
var wc_factory = $("<li><div id=factory_supply style='float:left;cursor:pointer; color: white;'> <img width=32px title='Рассчитать снабжение' alt='Расчет снабжения' src=https://cdn4.iconfinder.com/data/icons/48x48-free-object-icons/48/Lorry.png> </div>");
// Обработчик для завода-
wc_factory.click( function() {
    getItemList(); // аналогично магазину
    for(i=0; i<tr.length; i++) {
       getItemName( tr.eq(i) );
       getItemCol( tr.eq(i) );
       getItempSale( tr.eq(i), "Требуется" );
       console.log("-------w----------");
       console.log( item_name + ": " + item_img );
       console.log("col = " + col + " sale = " + sale );
	   getInput( tr.eq(i) );


		// сколько надо заказать товара
       var add = add = calculateFactoryAdd( factory_store );;
		console.log("add=" +add);

       sr_tr = $( getSubId( tr.eq(i) ),  table );
       if (sr_tr.length == 0) { // У нас только один поставщик
           // проверить свободные
           if ( getFree( tr.eq(i), add ) == false) continue;

           add = calculateFactoryAdd( factory_store );
           console.log("add = " + add  );

           input_item.val(add);
           continue;
       }
       console.log("--------много поставщиков");
       processMulti( tr.eq(i), sr_tr, add );

    }// цикл по товарам (компонентам)
	$("input[name='applyChanges']").click();
});


if ( checkType() == true ){
	// кнопки
	 var input_100 = $('<button id=b100>1:1</button>').click(function() {
		SetFactory(1);
	});
	 var input_200 = $('<button id=b200>х1</button>').click(function() {
		SetFactory(2);
	});
	 var input_х2 = $('<button id=bх2>х2</button>').click(function() {
		SetFactory(3);
	});
	 var input_х25 = $('<button id=bх25>х2.5</button>').click(function() {
		SetFactory(4);
	});

	var container = $('div.metro_header');
	container.append( $('<table><tr>').append('<td>').append(input_100) .append('<td>').append(input_200).append('<td>').append(input_х2).append('<td>').append(input_х25).append('<td>').append(input_clear).append( out)  );

	container = $("li:last", $("ul.tabu")).prev().parent();
	container.append(wc_factory) ;
	$("table.infoblock").before("<span id=factory_supply_info></span>");

}
// склады
var wc_warehouse = $("<li><div id=factory_supply style='float:left;cursor:pointer; color: white;'> <img width=32px title='Рассчитать снабжение' alt='Расчет снабжения' src=https://cdn4.iconfinder.com/data/icons/48x48-free-object-icons/48/Lorry.png> </div>").click( function() { 
    var table  = $("table.list");

    // список товаров на заказ
    var tr = $("tr.p_title, tr.odd, tr.even", table);
    console.log("TR = " + tr.length);
    var all = 0;
    var require = 0;
    var left = 0; // осталось
    for(i=0; i<tr.length; i++) {
       row = tr.eq(i);
       //console.log("row = " + row.html() );
       if (row.hasClass('p_title') ) {
            // Начало нового товра
            console.log("----------\nNEW"  );
            title = $("td.p_title_l", row);

            all = $("td:contains('На складе:')", title ).next().text();
            all = parseInt( all.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
            console.log("all = " + all  );

            require = $("td:contains('по контрактам')", title ).next().text();
            require = parseInt( require.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );
            console.log("require = " + require  );

            left = require;
            continue;
       }

       td = $("td.num:last", row);
       str = $("span" , td);
       n = str.html().indexOf("<br>");
       // такого быть не должно
       if (n ==0 ) continue;

       free = parseInt( str.html().substring(0, n).replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","") );

       console.log("free = " + free  );

       // поле для ввода
       input = $("input", row);

       add = free;
       if (left < free) add = left;
       input.val(add);
       left -= add;

    }


});

// warehouse
head = $("#unitImage");
img = $("img", head);
link = img.attr('src');

n = link.indexOf('warehouse');
if (n > 0) {
	container = $('#topblock').next();
	container = $("li:last", container).prev().parent();
	container.append(wc_warehouse) ;
}

};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);