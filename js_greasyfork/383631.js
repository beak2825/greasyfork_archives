// ==UserScript==
// @name        Virtonomica: Техномания
// @namespace   Virtonomica
// @description  Запомнить текущие ставки и показать их изменение после пересчета
// @version        1.58
// @include     http://igra.aup.ru/*/window/management_action/*/investigations/technology_sellers_info/*/*
// @include     https://*virtonomic*.*/*/window/management_action/*/investigations/technology_sellers_info/*/*
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/383631/Virtonomica%3A%20%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/383631/Virtonomica%3A%20%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {

//var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
//$ = win.$;
/**
    * записать данные в локальнео хранилище, с проверкой ошибок
    */
function ToStorage(name,  val)
{
        try {
            window.localStorage.setItem( name,  JSON.stringify( val ) );
    } catch(e) {
         out = "Ошибка добавления в локальное хранилище";
    }
}

function getFromStorage(obj, id)

    {

        if (obj[id] == null) return '';

    return JSON.stringify(obj[id]);

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

console.log("Техномания");

// вставка кнопок скрипта

var container = $('div.headerSeparator');

str = "<button id=t_save>save</button>";

str+= "<button id=t_clear>clear</button>";

str+= "<button id=t_avrg>get avrg</button>";

str+= "<button id=sum_btn>sum</button>";

str+= " <div id=t_form style='float: right'></div>";

str+= "<br><div id=t_text></div>";

str+= "<div id=t_info></div>";

str+= "<div id=t_all></div>";

str+= "<div id=t_oldinfo></div>";

str+= "<div id=sum_info></div>";

container.before(str);

//Определяем текущую технологию

var tech_name = jQuery.trim( $("td.info").text() );

var tech_level = $( "span", $("td.location") ).text();

// вытащить из локального хронилища запомненные значения

var techn = JSON.parse( window.localStorage.getItem('techn') );

// или создать пустой объект

if ( techn == null ) techn = new Object();

if ( techn[ tech_name ]  == null ) techn[ tech_name ] = new Object();

if ( techn[ tech_name ][ tech_level ]  == null ) techn[ tech_name ][ tech_level ] = new Object();

// проверить, а есть ли сохраненные даныне по данной технологии

var find_save = false;

for(var key in techn[ tech_name ][ tech_level ] ) {

    // key - название свойства

    // object[key] - значение свойства

    if ( techn[ tech_name ][ tech_level ][key] == null ) continue;

    if ( techn[ tech_name ][ tech_level ][key] == 0 ) continue;

    find_save = true;

    break;

}

// Переменная для хранения средней цены за технологию

var prize = 0;

if ( techn[ tech_name ][ tech_level ][ "techn_prize" ] != null) {

    if ( techn[ tech_name ][ tech_level ][ "techn_prize" ] != 0) {

       $("#t_oldinfo").html( "<table><tr><td width=140px>Сохраненная цена:<td> " + numberFormat( techn[ tech_name ][ tech_level ][ "techn_prize" ] ) + " (90% = " + numberFormat( Math.round( 0.9*techn[ tech_name ][ tech_level ][ "techn_prize" ] ) )+ ")" +"</table>" );

    }

}

// Ищем таблицу содержащую предложения на продажу

var table =  $("table.list").eq(1);

$("#sum_btn").click( function(){

  //console.log("---");

  sum_all = 0;

  for(j=2; j<=tech_level; j++){

      console.log( j );

      if ( techn[ tech_name ][ j ] != null) {

                if ( techn[ tech_name ][ j ][ "techn_prize" ] != 0) {

              console.log( j + " = " + techn[ tech_name ][ j ][ "techn_prize" ]);

              //sum_all+= parseInt( techn[ tech_name ][ j ][ "techn_prize" ] );

              if (techn[ tech_name ][ j ][ "techn_prize" ] == null){

      

                  $("#t_text").html("Нет данных по технологии № " + j).css("color","red");

                  return;

              }

              sum_all += parseInt( techn[ tech_name ][ j ][ "techn_prize" ] );

                   console.log( sum_all );

                }

        }

      //sum_all+= techn[ tech_name ][ j ][ "techn_prize" ];

  }

  console.log( sum_all );

  $("#t_text").html("Сумма сохраенных цен: " + numberFormat(sum_all) ).css("color","green");

  //$("#sum_info").html(sum_all);

});

// список компаний (признак компании - ссылка на неё)

var company = $("a" , table);

console.log("Число компаний: " + company.length);

// массив для предлоежний на продажу от компаний

var company_date = new Array();

// массив с признаком отсечения предложения

var company_miss = new Array();

for (var i=0; i< company.length; i++){

    var name = company.eq(i);

    // ищем предложение этой компании

    val = company.eq(i).parent().next();

    var fl_val = /([\D]+)*([\d\s]+\.*\d*)/.exec(val.text())[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");

    fl_val = parseFloat(fl_val);

    // пишем в лог имя компании и её предложение

    console.log(name.text() + " = " + fl_val);

    company_date[ i ] = fl_val;

    company_miss[ i ] = true;

    val.prop("index", i);

    // отображение формы для изменения цены

    val.click( function () {

    indx = $( this ).prop("index");

 // position: absolute;

    str = "<div id=div_form style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1002; border: 1px solid rgb(0, 0, 0);'>";
    str+= "<table>";
    str+="<tr><td>Старая цена:<td>" + numberFormat( company_date[  indx ] ) + "<td>" + (Math.round(10000*company_date[  indx ]/techn[ tech_name ][ tech_level ][ "techn_prize" ])/100) + "%";
    str+="<tr><td>Новая цена:<td><input id=ti_new value=" + company_date[  indx ] + ">";
    str+="<tr><td colspan=2 align=center><button id=ti_btn>SET</button>";
    str+="<tr><td colspan=2><br>90% = " +numberFormat( Math.round(0.9*company_date[  indx ]) );
    str+="<br>85% = " +numberFormat( Math.round(0.85*company_date[  indx ]) );
    str+="<br>80% = " +numberFormat( Math.round(0.80*company_date[  indx ]) );
    str+="<br>70% = " +numberFormat( Math.round(0.70*company_date[  indx ]) );
    str+= "</table>";
    str+= "</div>";

    $("#t_form").html( str );

 $("#div_form").prop("index", indx);

 $("#ti_btn").click( function(){

     indx = $("#div_form").prop("index");

     new_value = $("#ti_new").val();

     company_date[ indx ] = new_value

     company_miss[ indx ]  = true;

     old = company.eq( indx ).parent().next();

     old.text( numberFormat( company_date[  indx ] ) );

     //$("#div_form").hide();

     // посчитать среднею с учетом текущих исключений

     function getAvrg(){

         var all = 0;

               var count = 0;

               for (var i =0; i< company_date.length; i++){

             //console.log( i + " " + company_miss[ i ]  + " ||| " + all);

                   if ( company_miss[ i ] == false ) continue;

                       all+= parseFloat(company_date[ i ]);

                       count ++;

               }

         // учтем расчетные ставки других участников тендера

         if (new_count > 0){

             count += new_count;

             all += new_count * new_date;

         }

               if ( count ==0 ) return 0;

               ret = all/count;

         //console.log( ret + " ==== " + count);

               return ret;

       }

     avrg = getAvrg();

     str = "<table><tr><td>Новая цена:<td>" + numberFormat( Math.round(avrg) );

     str+= "<tr><td>Оптимальная цена:<td>" + numberFormat( Math.round(avrg*0.899) );

     str+= "</table>";

     $("#t_form").html( str );

 });

});

    // если еще не сохраняли данных, то пусть они будут нулевые

    if ( techn[ tech_name ][ tech_level ][ name.text() ] == null) techn[ tech_name ][ tech_level ][ name.text() ] = 0;

    val.after("<td>&nbsp;");

    // если сохраненных данных нет, то и делать нечего

if ( find_save == false )    continue;

    if (techn[ tech_name ][ tech_level ][ name.text() ] ==0) {

         // пометить

         val.css("font-weight","bold");

         val.next().html( "new").css("font-size","xx-small").css("color", "green");;

    continue;

}

    // если данные совпадают, то делать тоже нечего

    if (techn[ tech_name ][ tech_level ][ name.text() ] ==fl_val) continue;

    // пометить

    val.css("font-weight","bold");

    //val.css("color", "red");

    val.next().html( numberFormat( techn[ tech_name ][ tech_level ][ name.text() ] ) ).css("font-size","xx-small");

}

$("#t_text").html("Обработали запомненные предложения");

// Новые ставки

new_count = 0;    // число учитываемых компаний, если 0, то не используем

new_date = 0;        // их среднея ставка

// форма для учета новых чужих ставок

cnt = $("table.list").eq(1);

str = "<button id=btn_add style='float: left'>add</button>";

str+= "<div id=add_text style='float: right'></div>";

str+= "<div id=div_form_add style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1002; border: 1px solid rgb(0, 0, 0); float: left'>";

//str+="----";

str+= "</div>";

cnt.after( str );

$("#div_form_add").hide();

$("#btn_add").click( function() {

 str  =  "<table>";

 str+= "<tr><td>Число участников:<td><input id=add_count value=" +new_count +" />";

 tt = 0;

 if ( techn[ tech_name ][ tech_level ][ "techn_prize" ] != null) tt = Math.round( techn[ tech_name ][ tech_level ][ "techn_prize" ] );

 str+= "<tr><td>базовая цена:<td><input id=add_base value='" + tt +"' />";

 str+= "<tr><td>процент:<td><input id=add_procent value=85 />";

 str+= "<tr><td colspan=2 align=center><button id=add_set>new</button>";

 str+= "</table>";

 $("#div_form_add").html( str ).show();

 // нажатие кнопки пересчета

 $("#add_set").click( function(){

     new_count = parseInt( $("#add_count").val() );

     new_date = Math.round( $("#add_base").val() * $("#add_procent").val() / 100 );

     //alert(new_date);

     $("#div_form_add").hide();

     str = "<h3>Другие участники тендера</h3>";

     str+= "<table>";

     str+= "<tr><td>Число участников:<td>" +new_count ;

     str+= "<tr><td>Средняя ставка:<td>" +numberFormat(new_date) ;

     str+= "</table>";

     $("#add_text").html( str );

 });

});

// добавляем на наши кнопки функций

$("button[id='t_save']").click( function() {

    for (var i=0; i< company.length; i++){

     var name = company.eq(i);

     // ищем предложение этой компании

     val = company.eq(i).parent().next();

     var fl_val = /([\D]+)*([\d\s]+\.*\d*)/.exec(val.text())[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");

     fl_val = parseFloat(fl_val);

     //if (i==1)    fl_val += 500;

     //пишем данные в объект для сохранения в локальном хранилище

     if ( techn[ tech_name ][ tech_level ][ name.text() ] == null) techn[ tech_name ][ tech_level ][ name.text() ] = 0;

     techn[ tech_name ][ tech_level ][ name.text() ] = fl_val;

    }

    // запоминаем в локальном хранилище

    ToStorage("techn", techn);

    console.log("save");

    $("#t_text").html("Запомнили").css("color","green");

});

$("button[id='t_clear']").click( function() {

    techn[ tech_name ][ tech_level ] = new Object();

    ToStorage("techn", techn);

    console.log("clear");

    $("#t_text").html("Очистили").css("color","green");

});

$("button[id='t_avrg']").click( function() {

// посчитать среднею с учетом текущих исключений

function getAvrg(){

    //console.log("getAvrg");

    var ret = 0;

    var count = 0;

    for (var i =0; i< company_date.length; i++){

       if ( company_miss[ i ] == false ) continue;

       ret+= Math.ceil(100*company_date[ i ]);

       count ++;

    }

    if ( count ==0 ) return 0;

    ret = Math.round(ret/count)/100;

    //console.log(ret);

    return ret;

}

// посчитать среднею БЕЗ учета исключений

function getAllAvrg(){

    //console.log("getAvrg");

    var ret = 0;

    var count = 0;

    for (var i =0; i< company_date.length; i++){

       ret+= company_date[ i ];

       count ++;

    }

    if ( count ==0 ) return 0;

    ret = ret/count;

    //console.log(ret);

    return ret;

}

function calck(){

    avrg = getAvrg();

    console.log("calck = " + avrg);

    if ( Math.round(avrg) == Math.round(prize) ) {

       console.log("========= Угадано ======");

       return;

    }

console.log( "prize = " + prize + " ..... " );

var watch = false;

       if( Math.round(avrg/10) > Math.round(prize/10) ){

    console.log("<<<<");

    // отсекаем самую верхнею цену

    for (var i =0; i< company_date.length; i++){

            if ( company_miss[ i ] == false ) continue;

        company_miss[ i ] = false;

        watch = true;

        break;

    }

} else {

    console.log(">>>>>");

    // отсекаем самую нижнею цену

    for (var i =company_date.length-1; i >= 0; i--){

            if ( company_miss[ i ] == false ) continue;

        company_miss[ i ] = false;

        watch = true;

        break;

    }

}

// блокировка от зацикливания

if ( watch == true) calck();

}

function print_in_row(i, str){

    var row = $("#r_" + i);

    if (row.length == 0 ) val.after("<td id=r_" + i + ">&nbsp;");

    $("#r_"+i).html( str );

}

function marking(){

    allavrg = getAllAvrg();

    for (var i=0; i< company.length; i++){

         val = company.eq(i).parent().next();

         if ( company_miss[ i ] == false ) val.css("color", "red");

         else val.css("color", "black");

         xx = Math.round(10000*company_date[ i ] / allavrg );

         print_in_row( i, xx/10000);

    }

           $("#t_all").html( "<table><tr><td width=140px>Среднее по всем:<td> " + numberFormat( Math.round(allavrg) ) + "<td>(1,5 = " + numberFormat( Math.round(1.5*allavrg) ) + ")</table>" );

}

// ссылка на страницу со средней ценой

var url = location.href;

url= url.replace("technology_sellers_info", "technology_offer_create");

console.log(url);

    $.get(url , function(data) {

    console.log("reading from http...");

    var el =     $("td:contains('Рыночная стоимость технологии')", data).eq(1);

    el = $(el).next().next();

    prize = 0;

    if (el.text() == "") {

       // Не нашли ничего

       $("#t_info").text( "Ошибка в процессе получения средней цены" ).css("color","red");

       return;

    }

    $("#t_info").html( "<table><tr><td width=140px>Средняя цена: <td>" + el.text() + "</table>" ).css("color","green");

    prize = /([\D]+)*([\d\s]+\.*\d*)/.exec( $(el).text()  )[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");

    techn[ tech_name ][ tech_level ][ "techn_prize" ] = prize;

    console.log( prize );

    calck();

    marking();

    });

    console.log("avrg");

});

console.log("Завершение работы");

}

if(window.top == window) {

    var script = document.createElement("script");

    script.textContent = '(' + run.toString() + ')();';

    document.documentElement.appendChild(script);

}