// ==UserScript==
// @name        2-Услуги - Авто изменение цены для максимальных продаж
// @namespace   Virtonomica
// @version        0.44
// @description    Изменяем цену продажи автоматически, стараясь добиться максимального числа продаж.
// @include     http://virtonomic*.*/*/main/unit/view/*
// @include     http://virtonomic*.*/*/main/company/view/*/unit_list
// @downloadURL https://update.greasyfork.org/scripts/22871/2-%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8%20-%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/22871/2-%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8%20-%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6.meta.js
// ==/UserScript==
var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

// Минимальная цена для поликлинник
minimal_price = 10000;
maximal_price = 15000;

/**
* Возвращаем объект, соотвествющий типу подразделения
*
* set {
* 'minimal_price' - минимальная цена для данного типа юнитов
* 'maximal_price' - Хорошая цена для данного типа юнитов
* 'k' - коэффициент посещаемости для данного типа юнитов (считается как отношение к числу персонала)
* 'min_market' минимальная доля на рынка для добавления сообщений об этом
* 'reklama' максимальныый уровень рекламы для появления об этом предупреждения в сообщениях
* }
*/
function get_Setting( type )
{
    var set = new Object();

    set['minimal_price'] = 0;
    set['maximal_price'] = 0;
    set['min_market'] = 0.25;
    set['reklama'] = 10000000;

    if ( type == "Поликлиника" ) {
        set['minimal_price'] = 14000;
        set['maximal_price'] = 40000;
    } else if ( type == "Больница" ) {
        set['minimal_price'] = 150000;
        set['maximal_price'] = 300000;
    } else if ( type == "Диагностический центр" ) {
        set['minimal_price'] = 7000;
        set['maximal_price'] = 12000;
    } else if ( type == "Стоматологическая клиника" ) {
        set['minimal_price'] = 25000;
        set['maximal_price'] = 60000;
    } else if ( type == "Кардиологическая клиника" ) {
        set['minimal_price'] = 150000;
        set['maximal_price'] = 250000;
    }else if ( type == "Ресторан греческой кухни" ) {
        set['min_market'] = 0.07;
    }else if ( type == "Профессиональный спорт" ) {
        set['min_market'] = 0.03;
    }else if ( type == "Группы здоровья" ) {
        set['min_market'] = 0.03;
    }else if ( type == "Прачечная" ) {
        set['min_market'] = 0.01;
    }

    // коэффициент продаж
    var k = 0;
    if ( type == "Больница") {
        k = 0.2;
    } else if ( type == "Стоматологическая клиника") {
        k = 0.5;
    } else if ( type == "Поликлиника") {
        k = 5;
    } else if ( type == "Диагностический центр") {
        k = 5;
    } else if ( type == "Центр народной медицины") {
        k = 1;
    } else if ( type == "Кардиологическая клиника") {
        k = 1;
    } else if ( type == "Профессиональный спорт" ){
       k = 5;
    } else if ( type == "Танцы" ){
       k = 25;
    } else if ( type == "Скалолазание" ){
       k = 10;
    } else if ( type == "Группы здоровья" ){
       k = 50;
    } else if ( type == "Бодибилдинг" ){
       k = 10;
    } else if ( type == "Йога" ){
       k = 15;
    } else if ( type == "Фитнес" ){
       k = 15;
    } else if ( type == "Прачечная самообслуживания") {
        k = 300;
    } else if ( type == "Химчистка") {
        k = 100;
    } else if ( type == "Прачечная") {
        k = 200;
    } else if ( type == "Сырный ресторан") {
        k = 40;
    } else if ( type == "Пивной ресторан") {
        k = 60;
    } else if ( type == "Стейк ресторан") {
        k = 50;
    } else if ( type == "Рыбный ресторан") {
        k = 30;
    }else if ( type == "Устричный ресторан") {
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
    } else if ( type == "Блинная") {
        k = 80;	
    }else if ( type == "Ресторан греческой кухни") {
        k = 60;
    }else if ( type == "Ресторан мексиканской кухни") {
        k = 50;
    }else if ( type == "ЭКО-ресторан") {
        k = 50;
    }
    set['k'] = k;

    return set;
}

// Проверим ссылку что это список юнитов
var href = location.href;
n = href.lastIndexOf("/");
end = href.substr(n+1, href.length) ;
if ( end == "unit_list" ) {
    // объект для хранения сообщений
    medic = JSON.parse( window.localStorage.getItem('medic') );
    if ( medic == null ) medic = new Object();

    table = $("table.unit-top").next();
    el = $("td[class*='i-medicine'], td[class*='i-fitness'], td[class*='i-restaurant']", table);         
    // i-fitness

    for( i=0; i<el.length; i++){
          href = $("a", el.eq(i)).prop('href');
          //console.log('!!! ' +href);
          var id = /(\d+)/.exec(href)[0];
          //console.log( id );
          if ( medic[id] == null ) continue;
          if ( medic[id]['skip'] != 1 ) continue;
          //console.log( "SKIP = " + id );

          tr = el.eq(i).parent();
          td = $("td.spec", tr);
          console.log( td.html() );
          td.append( "<div style='float:right'><img alt='skip' title='Автоматическая обработка приостановлена' src=http://www.iconsearch.ru/uploads/icons/iconslandplayer/16x16/stop1normalred.png></div>");
    }
    return;
}

function checkType()
{
   var head = $("#unitImage");
   var img = $("img", head);
   link = img.attr('src');

   // медицина
   n = link.indexOf('medicine');
   if (n > 0) return true;

   // фитнесы и прачечные
   n = link.indexOf('service_light');
   if (n > 0) return true;

   // рестораны
   n = link.indexOf('restaurant');
   if (n > 0) return true;

   return false;
}

// проверить - медицинан ли это
if ( checkType() == false  ) return;

// пропустить неправильные ссылки
exclude = ['finans_report', 'virtasement', 'city_market', 'consume', 'supply'];
for (i=0 ; i< exclude.length; i++){
  n = href.lastIndexOf( exclude[i] );
  if (n > 0 ) return;
}

// Панелька для моих иконок
//var wc = $("<li><div id=medical_manager style='float:left;cursor:pointer; color: white;'> <img title='Анализ и изменение цен' alt='Анализ и изменение цен' src=http://www.iconsearch.ru/uploads/icons/crystalproject/24x24/file-manager.png> </div>").click( function() {
var wc = $("<li id=medical_manager style='cursor:pointer; color: white;'> <img title='Анализ и изменение цен' alt='Анализ и изменение цен' src=http://www.iconsearch.ru/uploads/icons/crystalproject/24x24/file-manager.png>").click( function() {
    // Это медцентр
    // определим его тип
    var type = $("div.cheader").text();

    // округление с имитацией человеческой цены
    function my_round( val ){
       // округляем до 0.1
       if ( val < 20) return Math.round( val*10 ) /10;
       // округляем до целого
       if ( val < 200 ) return Math.round( val );
       // округляем до 5
       if ( val < 1000 ) return Math.round( val/5 )*5;
       // округляем до 10
       if  (val < 2000 ) return Math.round( val/10 ) *10;
       // округляем до 20
       if  (val < 3000 ) return Math.round( val/20 ) *20;

       if  (val < 8000 ) return Math.round( val/50 ) *50;

       if  (val < 20000 ) return Math.round( val/100 ) *100;

       if  (val < 30000 ) return Math.round( val/200 ) *200;

       if  (val < 45000 ) return Math.round( val/500 ) *500;

       return Math.round( val/1000 ) *1000;
    }
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

function saveData( peaple, price ){
    //var date = $("#calendar_m").text();
	var date = $("#right_side > div:eq(1) > div:eq(1)").text()

    //alert( date + "\n" + peaple + "\n" + price);

    // объект для хранения сообщений
    medic = JSON.parse( window.localStorage.getItem('medic') );
    if ( medic == null ) medic = new Object();

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];

    if ( medic[id] == null ) medic[id] = new Object();

    if ( medic[id]['date'] == date ) return;

    medic[id]['date'] = date;
    medic[id]['peaple'] = peaple;
    medic[id]['price'] = price;

    ToStorage('medic', medic);

}
//---------------------------------------------------------------------
    // Износ оборудования
    _pr = $("td:contains('Износ оборудования')").next();
    td = $("td:contains('%')", _pr).text();
    n = td.indexOf("%");
    var iznos = parseFloat( td.substr(0, n).replace("  ", "").replace(" ", "").replace(" ", "") );
    if (iznos > 2) {
      addNotes( "<font color=red>Износ оборудования: " + iznos +"%</font>" );
    }
    // количество оборудования
    _pr = $("td:contains('Количество оборудования')").next();
    n = _pr.text().indexOf("ед.");
    stan = parseInt( _pr.text().substr(0, n).replace("  ", "").replace(" ", "").replace(" ", "") );

    // количество сотрудников
    str = $("td:contains('Количество сотрудников')").next().text();
    n = str.indexOf("(");
    var personal = parseInt( str.substr(0, n).replace(" ", "").replace(" ", "") );

    // количество посетителей
    var info = $("div.cheader").next();
    str = $("td:contains('Количество посетителей')", info).next().html();
    n = str.indexOf("&nbsp;");
    var peaple = parseInt( str.substr(0, n).replace("  ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );

    // цена момент пересчета
    str = $("td:contains('на момент пересчёта')", info).next().text();
	str = $.trim(str).replace(/\s+/g, '');
    n = str.indexOf("($");
	//console.log("str=["+str+ "]");
	//console.log("n="+n);
	//console.log("sub=["+str.substr(1, n) + "]");
    var price = parseInt( str.substr(1, n-1) );
	//console.log(price);
    //alert( price );

    // Получаем настройки для данного типа подразделений
    var uSet = get_Setting( type );
    console.log( uSet );
    // коэффициент продаж
    var k = uSet['k'];

    if (k==0) {
      $("#medical_info").html("Неизвестный тип специализации").css('color', 'red');
      return;
    }

	// запоминаем текущие продажи
    saveData( peaple, price );
	
    // максимально возможные продажи
    max = personal * k;
    // выполнение палана продаж
    proc = peaple / max;
    $("#medical_info").html( "План продаж: " + (Math.round(proc*1000)/10) + "%" ).css('color', 'green');
    console.log("PROC = " + proc);
    if ( ( proc > 0) && (proc < 100) &&(proc < uSet['min_market']) ){
        addNotes( "<font color=maroon>Уровень продаж: "+ Math.round(proc*100)+"%</font>" );
    }

    new_price = price;
    // вычисляем приближенно новую цену
    if ( max*0.995 > peaple ){
      // если нужно опустить цену
      dol = (1.0 - proc)/5;
      new_price = price * (1.0 - dol) ;
      console.log("down");
    } else if ( proc >= ( (stan-1)/stan) ){
      // если нужно поднять цену
      up = 1.02;
      if (price < 4501) up = 1.025;
      new_price = price * up;
      console.log("up");
    } else if ( max*0.995 <  peaple ){
      // если нужно поднять цену
      up = 1.01;
      if (price < 4501) up = 1.025;
      new_price = price * up;
      console.log("up 2");
    }
    //console.log("price = " + price);
    //console.log("new_price = " + new_price);
    //console.log("my_round(new_price) = " + my_round(new_price) );

    // реклама
    str = $("td:contains('Расходы на рекламу')").next().text();
    n = str.indexOf("$");
    var reklama = parseFloat( str.substr(0, n).replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );
    if (reklama > uSet['reklama']) {
        $("#medical_info").html( "Крупная реклама" ).css('color', 'grey');
        addNotes( "<font color=grey>Крупная реклама <b>"+ Math.round( reklama/uSet['reklama'] ) + "</b></font>" ) ;
    }

    // зарплата
    str = $("td:contains('Расходы на зарплату')").next().text();
    n = str.indexOf("$");
    var salary = parseFloat( str.substr(0, n).replace(" ", "").replace(" ", "") );

    // проверки для новой цены
    if (new_price > price) {
      if ( (new_price-price) > 10000 ) new_price = price +10000;
    }
    if (new_price < price) {
        balance =  new_price * peaple  - (salary + reklama)*1.2;
        // допустим прирост числа посов будет половина от разницы между текцщим и максимумом
        balance+= new_price *(max - peaple)/2;
        if ( balance < 0 ){
          $("#medical_info").html( "Проблемы с балансом" ).css('color', 'red');
          addNotes( "<font color=red>Проблемы с балансом </font>" );
          return;
        }
    }
    $("#medical_info").html( $("#medical_info").html() + " [" + Math.round(new_price)+ "]" );

    //--------------------------------------
    // Проверки по предыдущими продажам
    //--------------------------------------
    // объект для хранения сообщений
    medic = JSON.parse( window.localStorage.getItem('medic') );
    if ( medic == null ) medic = new Object();

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];

    if ( peaple == 0) {
      addNotes( "<font color=green>Продажи отсутствуют. Проверьте снабжение</font>" );
      return;
    }

    if ( medic[id] != null ) {

       var d = new Date();
       // уже сегодня обрабатывали
       if ( medic[id]['date'] == d.getTime() ) return;
       // пропускаем тех, кому сказали не обрабатывать
       if ( medic[id]['skip'] == 1) {
           //console.log("minimal_price 111");
            if (proc >= ( (stan-1)/stan) ) {
                addNotes( "<font color=green>Максимум продаж достигнут, а изменение цен отключено</font>" );
                //console.log("minimal_price 222");
            }
            // если наша цена больше максимума
            if ( uSet['minimal_price'] > 0 ){
                //console.log("minimal_price 333");
                if ( uSet['minimal_price'] < Math.round(price) ) {
                    //console.log("minimal_price 444");
                    addNotes( "<font color=brawn>Цена выше минимума: " + Math.round(price) + "</font> " + (Math.round(proc*1000)/10) + "%"  );
                    $("#medical_info").html( "Цена выше минимума: " + Math.round(price) ).css('color', 'red');
                }
            }
            return;
       }

       //$("#medical_info").html( medic[id]['date'] + "<br>" + medic[id]['peaple'] + "<br>" + medic[id]['price']);
       old_sum =  medic[id]['peaple'] * medic[id]['price']
       current_sum = peaple * price;
       if ( (  medic[id]['peaple'] == peaple) && (medic[id]['price'] > price) ) {
               addNotes( "<font color=maroon>Снижение цены не увеличило продажи. <br><font color=blue>Возможно, проблемы со снабжением</font><br>Автоматическое изменение цены остановлено</font>" );
               medic[id]['skip'] = 1;
               ToStorage('medic', medic);
               return;
       }
        // снижение на 1% не явлется поводом для выводов
       if ( (medic[id]['price'] > price) && (current_sum < old_sum *0.99)){
           // отсекаем случай когда достигли максимума продаж
           if ( max > peaple){
               addNotes( "<font color=maroon>Снижение цены вызвало снижение продаж <br>Автоматическое изменение цены остановлено</font>" );
               medic[id]['skip'] = 1;
               ToStorage('medic', medic);
               return;
           }
       }

    }
    if ( uSet['minimal_price'] > 0 && uSet['minimal_price'] > new_price) {
    addNotes( "<font color=brawn>Ограничитель цены: " + Math.round(new_price) + "</font>" );
        //console.log("minimal_price");
    }
    if (uSet['maximal_price'] > 0 && uSet['maximal_price'] < new_price){
        addNotes( "<font color=brawn>Хорошая цена: " + Math.round(new_price) + "</font>" );
        //console.log("maximal_price");
    }
    //--------------------------------------
    //  поле ввода для цены
    var input = $("input[name*='servicePrice']");
    new_price = my_round(new_price);
    input.val( new_price );
    color = "green";
    delta = new_price - price;
    if (delta < 0) color = "red";
    $("#medical_info").append( " " + new_price +" (<font color=" +color + ">"+ (new_price - price) + "</font>)" );


    // нажимаем кнопку
    $("input[name='setprice']").click();
    // запоминаем текущие продажи
    //saveData( peaple, price );

});

// Панелька для моих иконок
//var wc_settings = $("<li><div id=medical_settings style='float:left;cursor:pointer; color: white;'> TOOLS</div>").change( function() {
var wc_settings = $("<li id=medical_settings class=sel style='cursor:pointer; color: white;'> TOOLS").change( function() {
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
     
    // объект для хранения сообщений
    medic = JSON.parse( window.localStorage.getItem('medic') );
    if ( medic == null ) medic = new Object();
	
    // количество посетителей
    var info = $("div.cheader").next();
    str = $("td:contains('Количество посетителей')", info).next().html();
    n = str.indexOf("&nbsp;");
    var peaple = parseInt( str.substr(0, n).replace("  ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "") );

    // цена момент пересчета
    str = $("td:contains('на момент пересчёта')", info).next().text();
	str = $.trim(str).replace(/\s+/g, '');
	console.log(str);
    n = str.indexOf("($");
	var price = 0;
	if (n == -1) {
		str = str.replace('$','');
		price = parseInt(str);
	} else{
		price = parseInt( str.substr(1, n-1) );
	}

	var date = $("#calendar_m").text();

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];
    if ( medic[id] == null ) medic[id] = new Object();

    //alert( $("#chk_medic").prop('checked') );
    if($("#chk_medic").prop("checked")){
       // делаем что-то, когда чекбокс включен
       medic[id]['skip'] = 0; //alert("On");
       var d = new Date();
       // уже сегодня обрабатывали
		if ( medic[id]['date'] != d.getTime() ) {
			medic[id]['skip'] = 0;
			medic[id]['date'] = date;
			medic[id]['price'] = price;
			medic[id]['peaple'] = peaple;
		}

    }else{
       // делаем что-то другое, когда чекбокс выключен
       medic[id]['skip'] = 1; //alert("Off");
	   medic[id]['date'] = date;
	   medic[id]['price'] = price;
	   medic[id]['peaple'] = peaple;
    }
	console.log( medic[id] );
    ToStorage('medic', medic);
    //alert(  medic[id]['skip'] );
});

var container = $('#topblock').next();
container = $("li:last", container).prev().parent();
//container.append( $('<table style="border-style: solid solid none; border-width: 1px 1px 0; padding: 5px;"><tr><td>').append(wc).append("<td>").append(wc_settings) );
container.append(wc).append(wc_settings) ;
$("#childMenu").before("<br><span id=medical_info>");

    // объект для хранения сообщений
    medic = JSON.parse( window.localStorage.getItem('medic') );
    if ( medic == null ) medic = new Object();

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];

    $("#medical_settings").html("<input id=chk_medic type=checkbox checked=checked>Обрабатывать");
    if ( medic[id] != null ) {
       $("#medical_info").html( medic[id]['date'] + "<br>" + medic[id]['peaple'] + "<br>" + medic[id]['price'] + " [" + $("input[name*='servicePrice']").val() + "]<br>" + medic[id]['skip']);

       skip = 0;
       if ( medic[id]['skip'] != null){
           if ( medic[id]['skip'] == 1 ) skip = 1;
       }
       if (skip == 1) {
           $("#chk_medic").removeAttr('checked');
           //alert("Off");
       } else {
           $("#chk_medic").prop('checked', 'checked');
           //alert("On");
       }
       //alert(skip);
    }
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}



