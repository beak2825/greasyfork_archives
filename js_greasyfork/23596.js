// ==UserScript==
// @name           full_service
// @author         ctsigma
// @namespace      virtonomica
// @description    На странице управления персоналом
// @description    Облегчает установку зарплат 100% (среднегородская), 1:1 (по требуемой квалификации)
// @description    Облегчает установку обучения
// @description    Сортировка по квалификации: меньше треб., больше треб., равна требуемой.
// @description    Сортировка по зарплате: <100%, >=100%, >=150%
// @description    на основе скрипта Crocuta http://userscripts.org/scripts/show/174468
// @description    На странице управления оборудованием
// @description    Облегчает автоматический ремонт

// @include        *virtonomic*.*/*/main/company/view/*/unit_list
// @include        *virtonomic*.*/*/main/company/view/*/unit_list/equipment
// @include        *virtonomic*.*/*/main/company/view/*/unit_list/employee
// @version        1.11
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/23596/full_service.user.js
// @updateURL https://update.greasyfork.org/scripts/23596/full_service.meta.js
// ==/UserScript==

//$('input[name*="[price]"]').each(function(){$(this).attr('value',1)})
//$('select[name*="[constraint]"]').each(function(){$(this).attr('value',2)})
//$('input[name*="multipleDestroy[]"]').each(function(){$(this).attr('checked',true)})
//$('input[name*="supplyContractData[party_quantity]"]').each(function(){$(this).attr('value',0)})
//$('select[name*="[company][]"]').each(function(){$(this).append('<option value="4907351" selected="">vvladi и сыновья</option>')})
//$('select[name*="supplyContractData[price_mark_up]"]').each(function(){$(this).attr('value',0)})

//корм из ферм на склад на вкладке управления животными
/*
var prod = '1466';
$('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function () {
  $(this).attr('checked', false); //uncheck
  var href = 'https://virtonomica.ru/vera/window/unit/view/' + $(this).parent().parent().find('.u-c>a').attr('href').match(/\d+/g) + '/product_move_to_warehouse/' + prod + '/0';
  $.ajax({
    type: 'GET',
    async: false,
    url: href,
    success: function (data) {
      var page = $(data);
      var q = parseFloat($('div:contains("Качество")', page).text().match(/[.\d]+/g));
      if (q < 30) { //только если кач корма ниже
        var postData = $('#qty', page).parents('form').serialize() + '&doit=Ok';
        $.ajax({
          type: 'POST',
          async: false,
          url: href,
          data: postData
        })
      }
    }
  });
})
*/
/* //определить получателей из складов
$('.unit-list-2014>tbody td[class^=info]>a').each(function () {
var url = $(this).attr('href');
        $.ajax({
          type: 'GET',
          url: url+"/sale",
          success: function (data) {
var c_0=0;var c_1=0; var c_2=0;var c_3=0;var c_4=0; var c_5=0;
$('[selected="selected"]',data).each(function(){switch($(this).val()){
case "0":++c_0;break;
case "1":++c_1;break;
case "2":++c_2;break;
case "3":++c_3;break;
case "4":++c_4;break;
case "5":++c_5;break;
}})
console.log(url+",c_0="+c_0+",c_1="+c_1+",c_2="+c_2+",c_3="+c_3+",c_4="+c_4+",c_5="+c_5);          },
          async: false
        });
})
*/
/*
список ТМ с https://virtonomica.ru/vera/main/common/main_page/game_info/products
$('.list td>a').each(function () {
  var name = $(this).text();
  if (name.length > 0) {
    var prod = $(this).attr('href').replace(/[^\d]/g, '');
    var href = 'https://virtonomica.ru/vera/window/unit/supply/create/6485118/step1/' + prod;
    var TM = '';
    $.ajax({
      type: 'GET',
      async: false,
      url: href,
      success: function (data) {
        $('select[name="tmZ"]>option', data).each(function () {
          TM = TM + ';' + $(this).text().replace(/\s+/g, '');
        })
      }
    });
    if (TM.length > 0) {
      console.log(name + '(' + prod + '):' + TM);
    }
  }
})

*/
var run = function(type) {

  //globals
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var arr_envd={"Алмазы":100,"Бокситы":100,"Глина":100,"Древесина":30,"Железная руда":100,"Золото":100,"Кремний":100,"Марганец":100,"Медный колчедан":100,"Нефть":100,"Полиметаллическая руда":100,"Природные минералы":100,"Титановая руда":100,"Уголь":100,"Хром":100,"LED":20,"Авиадвигатель":10,"Авиашасси":10,"Авионика":10,"Автозапчасти":20,"Алюминий":20,"Бумага":5,"Двигатель":15,"Зеркальный лист":20,"Интерьер самолета":10,"Кожа":5,"Комплектующие":20,"Корпус яхты":15,"Косметическое масло":20,"Краска":5,"Литий":10,"Литий-ионный аккумулятор":15,"Медь":20,"Микропроцессор":20,"Натуральные лекарственные компоненты":20,"Оснащение яхты":15,"Отходы хлопчатника":10,"Парфюмерная эссенция":20,"Пластмасса":10,"Резина":10,"Рыболовная сеть":10,"Сверхлёгкий алюминиевый сплав":20,"Светочувствительная матрица":20,"Секция фюзеляжа":10,"Синтетическая ткань":5,"Синтетические лекарственные компоненты":20,"Сталь":10,"Стекло":20,"Термопластик":10,"Термоэлемент":15,"Титан":20,"Ткань":20,"Углепластик":10,"Химикаты":20,"Хлопковая ткань":20,"Хлопковое волокно":10,"Цинк":10,"Шерсть":20,"Электронные компоненты":20,"Электропривод":15,"Элементы авиакрыла":10,"Элементы авиаоперения":10,"Этанол":20,"Апельсин":5,"Воск":10,"Вощина":10,"Зерно":10,"Какао":10,"Картофель":10,"Комбикорм":10,"Кормовые культуры":10,"Кофе":10,"Кукуруза":5,"Маточное молочко":20,"Молоко":15,"Мясо":20,"Мёд":10,"Оливки":10,"Подсолнечник":15,"Помидоры":5,"Рыбная мука":10,"Сахар":10,"Соя":10,"Табак":5,"Фрукты":5,"Хлопок":10,"Цветы и эфиромасличные культуры":5,"Чайный лист":5,"Яйца":15,"Бурбон":10,"Джем":10,"Зеленый чай":10,"Зефир":15,"Кисель":10,"Колбасные изделия":15,"Кондитерские изделия":15,"Консервированная кукуруза":15,"Консервированные оливки":15,"Консервы":15,"Конфеты":10,"Красная икра":20,"Кукурузная мука":10,"Кукурузные хлопья":5,"Ликер":10,"Макаронные изделия":5,"Масло":10,"Мисо-суп":5,"Молочные продукты":10,"Мороженое":15,"Мука":10,"Натуральный кофе":20,"Оливковое масло":20,"Печень трески":15,"Пиво":10,"Продукты быстрого приготовления":5,"Прохладительные напитки":10,"Пуэр":50,"Растворимый кофе":5,"Рыбные деликатесы":20,"Рыбные консервы":15,"Соевый соус":15,"Сок":10,"Соусы":5,"Специи":5,"Спиртные напитки":10,"Суфле":15,"Сыр":10,"Сыр фета":10,"Тофу":10,"Фри":10,"Фруктовый чай":10,"Хлеб":10,"Черная икра":50,"Черный чай":10,"Чипсы":5,"Шоколад":10,"Энергетические напитки":10,"GPS-навигаторы":20,"LED-телевизоры":50,"USB-флэш-накопитель":20,"Автомобиль":100,"Автомобильное сиденье":15,"Автомобильные багажники":20,"Автомобильные диски":20,"Автосигнализация":20,"Антифриз":20,"Аудиотехника":50,"Бейсболка":20,"Бижутерия":20,"Бриллианты":30,"Бронзовый декор":30,"Бытовая химия":20,"Велосипед":20,"Верхняя одежда":20,"Внедорожник":100,"Водный скутер":30,"Газонокосилка":20,"Гироскутер":15,"Гриль для дачи":20,"Деловая одежда":20,"Детская коляска":20,"Детская кроватка":5,"Детское питание":15,"Джинсы":20,"Душевые кабинки":5,"Жемчужные украшения":50,"Заварочный чайник":20,"Зеркало":20,"Зонт":20,"Игровые консоли":50,"Игрушки":20,"Канцтовары":20,"Керамическая посуда":20,"Книги":15,"Кованая садовая мебель":30,"Ковер":20,"Кожгалантерея":20,"Компьютер":30,"Компьютерные аксессуары":20,"Кондиционер":50,"Консервированный корм для животных":15,"Конструктор":20,"Косметика":15,"Кофе-машина":50,"Кузовные запчасти":20,"Кухонная мебель":20,"Кухонные плиты":50,"Мебель":20,"Мобильный телефон":20,"Моторное масло":20,"Мотоцикл":30,"Нижнее белье":20,"Носки":10,"Ноутбук":30,"Обувь":20,"Одежда":20,"Одежда для малышей":20,"Одеяло":20,"Омыватель стекол":20,"Парфюмерия":20,"Планшет":30,"Подарки и Сувениры":20,"Подгузники":10,"Полотенце":20,"Пончо":20,"Посуда":20,"Посудомоечные машины":50,"Пресса":15,"Принтер":30,"Пылесос":50,"Радионяня":10,"Развивающие игрушки":20,"Садовый декор":20,"Садовый инвентарь":20,"Сантехника":20,"Сапоги":20,"Светильник":20,"Светодиодная лампа":15,"Седан":100,"Сигареты":20,"Сигары":10,"Сковородки":20,"Смартфон":20,"Сомбреро":20,"Спальная мебель":20,"Спорт-кар":100,"Спортинвентарь":20,"Стиральные машины":50,"Столовое и постельное бельё":20,"Сумки и портфели":20,"Сухой корм для животных":15,"Телевизоры":50,"Товары для творчества":20,"Тренажер":20,"Утюг":20,"Фен":20,"Фототехника":20,"Холодильники":50,"Цифровая видеокамера":20,"Цифровой фотоаппарат":20,"Чайник":20,"Часы":30,"Чистящие средства":20,"Шины":20,"Электроинструмент":20,"Электромобиль":100,"Элемент питания":15,"Ювелирные украшения":50,"Витамины":20,"Гормональные препараты":10,"Косметические маски":20,"Лекарственные травы":20,"Медицинский антисептик":10,"Медицинский инструментарий":20,"Никотиновый пластырь":15,"Природные лекарства":20,"Рыбий жир":20,"Синтетические лекарства":10,"Спортивное питание":10,"Средства гигиены":20,"Электронный тонометр":20,"IT-оборудование":30,"Автозаправочное оборудование":30,"Авторемонтное оборудование":30,"Гелиостат":30,"Горно-шахтное оборудование":30,"Интерьер дошкольных учреждений":30,"Коммуникационное оборудование":30,"Мазутный энергоблок":30,"Медицинское оборудование":30,"Мусороприёмное оборудование":30,"Мусоросжигательный энергоблок":30,"Парикмахерское оборудование":30,"Паровая турбина":30,"Паровой котёл":30,"Пилорама":30,"Прибор":30,"Ресторанное оборудование":30,"Рыболовецкий траулер":30,"Серверная платформа":30,"Система очистки дымовых газов":30,"Солнечный энергоблок":30,"Станок":30,"Теплообменное оборудование":30,"Топливное оборудование":30,"Топливораздаточная колонка":30,"Трактор":30,"Угольная мельница":30,"Угольный энергоблок":30,"Узкофюзеляжный самолет":10,"Жемчуг":100,"Крабы":20,"Лосось":20,"Осетр":10,"Промысловая рыба":20,"Треска":20,"Устрицы":20,"Домашняя птица":20,"Коровы":20,"Овцы":20,"Пчёлы":20,"Свиньи":20,"Арт декор":30,"Интерьер яхты":100,"Шагрень":15,"Яхта":100,"Бензин Нормаль-80":100,"Бензин Премиум-95":100,"Бензин Регуляр-92":100,"Биодизель":100,"Дизельное топливо":100,"Мазут":100};
  var TotalPrice = 0;
  var today = $('.date_time').text().trim();

  var shop_teh=0;

  var shop_price = JSON.parse( window.localStorage.getItem('shop_price') );
  if (shop_price === null) shop_price ={};

    var tech_price=true; //корректировать цены на технологии
    var warehouse_price=true;  //корректировать цены на складах
    var repair=true; //ремонт оборудования
    var salary=true; //корректировать зарплату, поставки, цены на предприятиях
//    var salary_no_shop = false; // исключить магазины из обработки
    var max_repair = 2000;
    var max_salary = 2200;

// utils

  function f2(val) {return parseFloat(Math.floor(val *100)/100);} // "округляем" до 2х знаков

//function getType()
//возвращает тип в виде строки  (по классу)
//data - объект ($)
//sub - не обязательный параметр, true - выводить детальное наименование
/////////////////////////////////////////////////////////////////////////////
  function getType(data, sub) {
    sub = sub || false;
    var type = '';
    $('script').each(function () {
      var cl = $(data).text().match(/\.addClass\(\'bg-page-unit-header-(.+)\'\);/);
      if (cl !== null) type = (cl[1]);
    });
    if (type === '') return 'unknown';
    switch (type)
      {
			case('shop'):            return 'shop';
			case('workshop'):         return 'workshop';
			case('mill'):             return 'mill';
			case('animalfarm'):       return 'animalfarm';
      			case('apiary'):           return sub?'apiary':'animalfarm';
			case('medicine'):         return 'medicine';
			case('restaurant'):       return 'restaurant';
			case('orchard'):          return 'orchard';
			case('farm'):             return 'farm';
			case('mine'):             return 'mine';
			case('oilpump'):          return sub?'oilpump':'mine';
			case('lab'):              return 'lab';
			case('villa'):            return 'villa';
			case('warehouse'):        return 'warehouse';
			case('fishingbase'):      return 'fishingbase';
                        case('office'):          return 'office';
			case('sawmill'):          return 'sawmill';
			case('cellular'):         return 'it';
			case('network'):          return 'network';
			case('kindergarten'):     return 'educational';
      			case('repair'):           return 'repair';
      			case('fuel'):             return 'fuel';
      			case('hairdressing'):     return sub?'hairdressing':'service';
      			case('laundry'):          return sub?'laundry'     :'service';
      			case('fitness'):          return sub?'fitness'     :'service';
			case('coal_power'):       return sub?'coal_power'       :'power';
			case('oil_power'):        return sub?'oil_power'        :'power';
			case('incinerator_power'):return sub?'incinerator_power':'power';
			case('sun_power'):        return sub?'sun_power'        :'power';
			default:                  return 'unknown';
    } //end switch
  } //end getType()

  function paging(pages){
    // добавить пагинацию
    var sel_page = $('.pager_options > .selected').text();
    $('.pager_options > .selected').removeClass('selected').text('').append($('.pager_options a:eq(0)').parent().html().replace(/\d+/g,sel_page));
    var links = $('.pager_options a');
    links.each(function (i) {
      var a = $(this);
      a.attr('href', a.attr('href').replace(pages[i][0], pages[i][1]));
      a.text(pages[i][1]);
    });
  } //end of paging

  function wall(title,total){
    total = typeof(total) != 'undefined' ? '/'+total : 'анализ';
    $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
    $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено '+title+': <span id="js-curr"></span>' + total + '</div>').width($(window).width()).prependTo('body');
  }// end of wall()

  function remove_wall(){
    $('#js-progress').remove();
    $('#js-wall').remove();
  }//end of remove_wall()

  function doit(arr, action, title, process) {
    try {
      wall(title,arr.length);
      promise = $.when();
      $.each(arr, function (index, obj) {
        promise = promise.then(function () {
          $('#js-curr').text(index);
          process(obj, action);
          return;
        });
      });
      remove_wall();
      return;
    } catch (ex) {
      alert(ex);
    }
  } //end of doit()

	function formatUTCDate(date) {
		var dd = date.getUTCDate();    if ( dd < 10 ) dd = '0' + dd;
		var mm = date.getUTCMonth()+1; if ( mm < 10 ) mm = '0' + mm;
  	var yy = date.getUTCFullYear();
	  return ""+yy+mm+dd;
	} //end of formatUTCDate()

  function removeOldData(arr,days){
	  if (arr === null) arr = {};
    for (var i in arr) {
      var day = new Date();
      day.setDate(day.getDate()-days);
      var d0 = formatUTCDate(day);
      if (parseInt(i)<parseInt(d0)) delete arr[i];
    }
   return arr;
  } //end of removeOldData()

  function getData(page,arr){
	  if (arr === null) arr = {};
    var day = new Date();
//    day.setDate(day.getDate()-1);
    d0 = formatUTCDate(day);
    if (arr[d0] === null) { //данных на сегодня нет
      console.log('Собираем данные о текущих ценах...');
      arr[d0] = {};
    $('.tech_title_cell',page).parent().each(function(){
      var tech_name = "" + $('.tech_title_cell b',this).text();
      if (arr[d0][tech_name] === null) arr[d0][tech_name] = {};
      $('.tech_cell',this).each(function(){
        var href = $('a:eq(0)',this).prop('href');
        if (href !== undefined) {  //технология есть в наличии
          tech_num = parseInt($('a:eq(0)',this).text());
          if (tech_num > 0){   // определили номер технологии
            if (arr[d0][tech_name][tech_num] === null) arr[d0][tech_name][tech_num] = {};
            $.ajax({
             type:"GET",
             url:href,
             async: false,
             success:function(data){
               arr[d0][tech_name][tech_num].market_price = parseFloat($('[style="background-color: #006699"]',data).parent().parent().find('td:last').text().replace(/[^\d\.]/g,''));
               }
            });
            $.ajax({
             type:"GET",
             url:href.replace("technology_offer_create","technology_sellers_info"),
             async: false,
             success:function(data){
               $('th',data).parent().parent().find('td').parent().each(function(){
                 var username = $('td:eq(0)',this).text().replace(/\s+/g,'');
                 arr[d0][tech_name][tech_num][username]=parseFloat($('td:eq(1)',this).text().replace(/[^\d\.]/g,''));
               });
             }
            });
          }
        }
      });
//      return false;
    });
    } //конец сбора данных
//    console.log(JSON.stringify(arr));
    return arr;
  }

  function ImplementTechAll(){
    alert(1);
    var arr = [];
    arr.length = 0;
    $('table.list>tbody>tr>th:eq(0)>input').attr('checked', false); //uncheck group flag
    $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function () {
      $(this).attr('checked', false); //uncheck
      var objCell = $(this).parent().parent();
      arr[arr.length] = objCell;
    });
//    doit(arr, 'repair', 'repair',function (objCell, action) {RepairEquipment(objCell, action);});
//goToImplement(this.form, 'technology')
//function goToImplement(oForm, mode)
//	{
//		oMode = oForm['implement_mode'];
//		oMode.value = mode;
//		oWin = popup('about:blank', 1000, 740);
//		oForm.target = oWin.name;
//		oForm.submit();
//	}

  }

  function SetWarehousePrice(href,action){
    if (href==='') {return;}
//    if (UnitType=='workshop'||UnitType=='mill'||UnitType=='animalfarm'||UnitType=='orchard'||UnitType=='farm'||UnitType=='mine'||UnitType=='warehouse'||UnitType=='fishingbase'||UnitType=='sawmill'){
      $.ajax({
        type:"GET",
        async:false,
        url:href+'/sale',
        success:function(data){
                  var page = $(data);
                  var setPrice = false;
                  var unitName = $('.title>h1',page).text().trim();
                  var force = (unitName.substr(0,1) == "=")?true:false; //если первый символ в названии "=", то установить цены все равно
                  $('.grid>tbody>tr:gt(0)',page).each( function () {
                      var sellOption = $('[selected="selected"]',this).val();  // 3=только своей компании
                      if (sellOption==3 || ( force && sellOption==2 )) { //ставим цену автоматом, только если продаем сами себе
                          var sbst=parseFloat($('td:contains("Себестоимость"):first-child',this).next().text().replace(/[^\d\.]/g,'')).toFixed(2);
                          sbst = isNaN(sbst)?0:sbst;
                          var newPrice = +sbst+0.02;
                          var price = parseFloat($('.money:eq(0)',this).val()).toFixed(2);
                          if (price != newPrice && sbst > 0) {$('.money:eq(0)',this).prop("value",newPrice);setPrice=true;}
                      }
                  });
                  if (setPrice) {
                    // Необходимо выполнить обновление полей, чтобы отправить полный перечень условий
                    list = $('SELECT',page);
                    for (s=0;s<list.length;s++){
                      if (list[s].id != false){
                        for (o=0;o<list[s].length;o++){
                          list[s].options[o].selected = true;
                        }
                      }
                    }
                    var postData = $('form[name="storageForm"]',page).serialize();
                    $.ajax({
                      type:"POST",
          	          async:false,
                      url:href+'/sale',
                      data:postData
                    });
                  }
              }
      });
//    }
  } //end of SetWarehousePrice()

  function setSalary(workCell, action){
    if ($('td:eq(4)>a',workCell).text().split(' ').join('') == "0" && action == "1:1") return; //не обрабатывать предприятия без сотрудников с ЗП "по требованию"

    var recalcSalary=$('input[name="recalcSalary"]:checked').val()=="X"?"X":""; //полный пересчет ЗП

    var UnitType = $('td:eq(2)',workCell).attr('class');
    var UnitCode = $('td:eq(0)>input',workCell).attr('value');
    var UnitName = $('td:eq(2)>a',workCell).text();
    var UnitHref = $('td:eq(2)>a',workCell).attr('href');
    var UnitSalaryHref = $('td:eq(4)>a',workCell).attr('href');
    var UnitQuality = parseFloat($('td:eq(8)>a',workCell).text());
//    var UnitQuality = parseFloat($('td:eq(8)>input',workCell).attr('value'));
    var UnitQualityTotal = parseFloat($('td:eq(9)',workCell).text());
    var UnitSalary = f2(parseFloat($('td:eq(6)',workCell).text().replace(/[^\d\.]/g, '')));
    var UnitSalaryTotal = f2(parseFloat($('td:eq(7)>input',workCell).attr('value').replace(/[^\d\.]/g, '')));
    /(.*)window(.*)engage(.*)/.exec(UnitSalaryHref);//url калькулятора
    var calcUrl = RegExp.$1 + "ajax/unit/employees/calc_new_lvl" + RegExp.$3;

    if (recalcSalary === ''){
        if (UnitQuality == UnitQualityTotal && action == "1:1") return; // Ничего не делать если ЗП уже установлена "по требованию"
        if (UnitSalary == UnitSalaryTotal && action == "100%") return; // Ничего не делать если ЗП уже установлена в 100%
    }

    var objSalary = $("td:eq(6)", workCell);

    $.ajax({
      type:"GET",
      async: false,
      url:UnitSalaryHref,
      success:function(data){
        var quantity = $("#quantity", data).val(); //количество сотрудников
        var S = $("#salary", data).val(); // текущая ЗП
        var Savg = /([\D]+)([\d\s]+\.*\d*)/.exec($("table.list td:contains(Средняя зарплата)", data).text())[2].replace(" ", "");
        /(\d+\.*\d+)\D*(\d+\.*\d+)/.exec($("span:contains(требуется)", data).text() );
        var Qavg = RegExp.$1; // средняя квала
        var Qreq = RegExp.$2; // требуемая квала
        var educated = 0;
        var Q = Qavg;
        $.ajax({
          type:'GET',
          async: false,
          url : calcUrl,
          data:{employees:quantity, salary:Savg},
          dataType:'json',
          success:function(data){
            Q = data.employees_level;
            if (Q > Qavg) {educated = 1;}
          }
        });
/*        var edu = $('td>a:contains("Обучение персонала")',data).attr('href');
        if (edu==null) {  // если учатся сотрудники
          $.ajax({
			    url		: 'http://virtonomica.ru/vera/ajax/unit/employees/calc_new_lvl_after_train/5287815',
			data	: {employees : 6000, weeks : 1},
			type	: 'get',
			dataType: 'json',
			cache	: true,
			success: function (j) {
				console.log(j['employees_level']);
      }})
        }
*/
        if(UnitType=="u-c i-shop"){ // для магазинов расчитаем максимальный уровень образованности
          if (shop_teh === 0){
            $.ajax({
              type:"GET",
              async: false,
              url:UnitHref,
              success:function(data){
                shop_teh = parseInt($('td.title:contains("Квалификация игрока")',data).next().text());
              }
            });
          }
          var player_q = shop_teh; // квалификация
          Qreq = Math.log(14*player_q*player_q/quantity)/Math.log(1.4);
        }
        if(action=='100%')Sreq = Savg;
        else{
          var k = 1;
          var k1 = k*k;
          if(k <= 1){
            b = Q/k1;
            Sreq=Math.round(Math.sqrt(Qreq/b)*Savg *100)/100;
            if( Sreq/Savg > 1){ // если зарплата превысила среднюю
              b = b / Qavg;
              b = 2 * Math.pow(0.5, b);
              Sreq = (Math.pow(2, Qreq/Qavg)*b - 1)*Savg;
            }
          }
          else {
            b = (k+1)/Math.pow(2, Q/Qavg);
            Sreq = (Math.pow(2, Qreq/Qavg)*b - 1)*Savg;
            if(Sreq/Savg < 1){ // если зарплата стала меньше средней;
              b = Qavg * Math.log(b/2)/Math.log(0.5);
              Sreq = Math.sqrt(Qreq/b)*Savg;
            }
          }
          var over_educated = 0;
          if (Sreq/Savg <= 0.80 && educated == 1) {Sreq = Math.ceil(0.80 * Savg);over_educated = 1;} // блокировка от потери обученности
          if (Sreq/Savg > 6 && UnitType == "u-c i-shop") Sreq = Math.floor(6 * Savg); // Блокировка от высоких ЗП в магазинах
        }
        Sreq = f2(Sreq);
        //получаем новое значение квалификации
        $.ajax({
          type:'GET',
          async: false,
          url : calcUrl,
          data:{employees:quantity, salary:Sreq},
          dataType:'json',
          success:function(data){
            emp_lvl = data.employees_level;
            if (emp_lvl < Qreq) Sreq = Sreq + 0.01;
            $('td:eq(8)>a',workCell).text(emp_lvl);//заменяем значение квалы на странице
            $('td:eq(8)>input',workCell).attr("value",emp_lvl);
          }
        });
        //отправляем форму на сервер
        $.ajax({
          type:"POST",
          async: false,
          url:UnitSalaryHref,
          data:{'unitEmployeesData[quantity]' : quantity, 'unitEmployeesData[salary]' : Sreq},
          success:function(){//заменяем абсолютную и относительную ЗП на странице
            objSalary.empty().append($("<span>").text(f2(Sreq) + "$"));
            objSalary.append($("<br>"));
            var bbb=parseFloat(Math.floor(Sreq/Savg*10000)/100);
            var color=bbb>89?"blue":'rgb(150,170,10)';
            color=bbb<81?'rgb(111,165,55)':color;
            color=bbb<80?'red':color;
            var font=bbb>81.0?"bold":'';
            if (over_educated == 1) { font="bold"; color = 'orange';}
            objSalary.append($("<span>").text(bbb + " %").css({'color':color,'fontWeight':font,'fontSize':'9px'}));
          }
        });
      }
    });
  } //end of function SetSalary()

  function setPriceENVD(workCell,action){
    if ($('td:eq(10)>a',workCell).length > 0) return; //не обрабатывать предприятия в отпуске
    var UnitType = $('td:eq(2)',workCell).attr('class');
    var UnitHref = $('td:eq(2)>a',workCell).attr('href');
    switch(UnitType){
      case "u-c i-service_light":UnitType="services_light";break;
      case "u-c i-restaurant":UnitType="services";break;
      case "u-c i-medicine":UnitType="services";break;
      case "u-c i-shop":UnitType="shop";break;  //магазин
      case "u-c i-power":UnitType="power";break;  //электростанция
      case "u-c i-orchard":UnitType="production";break;  //плантация
      case "u-c i-fishingbase":UnitType="production";break;  //рыбная база
      case "u-c i-farm":UnitType="production";break;  //землеферма
      case "u-c i-animalfarm":UnitType="production";break;  //животноводческая ферма
      case "u-c i-mill":UnitType="production";break;  //мельница
      case "u-c i-workshop":UnitType="production";break;  //завод
      case "u-c i-sawmill":UnitType="production";break;  //лесопилка
      case "u-c i-mine":UnitType="production";break;  //рудник
      case "u-c i-repair":UnitType="services";break;
      case "u-c i-fuel":UnitType="shop";break;  //Заправка
      case "u-c i-educational":UnitType="services";break; //детсад
    }
    if (UnitType == "power") {
      $.ajax({
        type:"GET",
        async: false,
        url:UnitHref+'/sale',
        success:function(data){
          var page = $(data);
          var EnergyMarketHref = $('.list a:contains("Энергопотребление")',data).prop('href');
          var sold = $('.list th:contains("Продано")',data).next().text().replace(/\s+/g,'').match(/[.\d]+/g);
          if (sold===null){return;} // не работает и ничего не продает
          var prod = parseFloat($('.list th:contains("Выработано электроэнергии")',data).next().text().replace(/\s+/g,'').match(/[.\d]+/g)).toFixed(2);
          var net_price = parseFloat($('.list th:contains("Себестоимость")',data).next().text().replace(/\s+/g,'').match(/[.\d]+/g)).toFixed(2);
          var price = parseFloat($('.list th:contains("Цена")',data).next().text().replace(/\s+/g,'').match(/[.\d]+/g)).toFixed(2);
          var total_price = parseFloat($('.list th:contains("Итоговая цена за ед.")',data).next().text().replace(/\s+/g,'').match(/[.\d]+/g)).toFixed(2);
          var type = $('legend:contains("Политика сбыта")',data).parent().find('.list img[src="/img/v.gif"]').parent().next().text().trim();
          var UnitSubtype = getType(page,true);
          var new_price = 0;
          if (UnitSubtype == "sun_power")
            {new_price = f2(net_price * 1.01);} // процент в прибыль
          else
           {
            new_price = price;
          $.ajax({
            type:"GET",
            async: false,
            url:EnergyMarketHref,
            success:function(data1){
              var market = $(data1);
              var vol_total = 0;
              var self = EnergyMarketHref.match(/[\d]+/g);
              var arr = [];
              $('legend:contains('+type+')',market).parent().find('.list tr').find('td:eq(0)').each(function(){
                var a=$(this).text().trim();
                if (a.length===0) {return true;} //позиции без ссылок не учитываем
                var lnk = /\d+/.exec($('a',this).attr('href'));
                if (lnk==self){return true;} //пропустить свои
                var vol = parseFloat(/\d+.\d+/.exec($(this).next().text().replace(/\s+/g,'')));
                if (vol===0) {return true;} //пропустить позиции с нулевыми продажами
                var prc = parseFloat(/\d+.\d+/.exec($(this).next().next().text().replace(/\s+/g,'')));
                a = arr.length;
                arr[a] = new Array(2);
                arr[a][0]=lnk;
                arr[a][1]=vol;
                arr[a][2]=prc;
              });
              arr.sort(function(a,b){
                var z = b[2]-a[2]; //сортировка по цене по убыванию
                if (z===0){z = b[1]-a[1];} //если цена одинаковая, сортировка по убыванию объемов
                return z;
              });
              var l = arr.length-1;
              if (l<0){return;}
              new_price = arr[l][2]-0.01; //цена по-умолчанию не выше, чем  самая низкая
              for (i=0;i<l+1;i++){
                if (prod==arr[i][1]){new_price = arr[i][2]-0.01;return false;} //если конкурируем с равным, то ставим цену чуть ниже
                if (prod>arr[i][1]){new_price = arr[i][2]+0.01;return false;} //если конкурируем с меньшим, то ставим цену чуть выше
              }
            }
          });}
          var obj1 = $('<a href="'+UnitHref+'">');
          var showInfo=$('input[name="showInfo"]:checked').val()=="X"?"X":"";
          var mark = false;
          if (new_price < net_price){
            obj1 = obj1.append($('<img>').attr({'src': '/img/unit_indicator/unit_sale_price.gif', 'height': 16, 'width': 16, 'title': 'Цена ниже себестоимости'}));
            mark = true;
          }
          if (price != total_price){
            obj1 = obj1.append($('<img>').attr({'src': 'https://www.iconsearch.ru/uploads/icons/snowish/32x32/emblem-important.png', 'height': 16, 'width': 16, 'title': 'Удалось продать только часть энергии'}));
            mark = true;
          }
          if (mark && showInfo == 'X'){$('td:eq(11)',workCell).attr('class','nowrap').empty().append(obj1);}
          if (new_price != price){
            console.log(UnitHref.match(/[\d]+/g)+":"+price+"->"+new_price);
            $('input[name="servicePrice"]',page).val(new_price.toFixed(2));
            var postData = $('form:eq(0)',page).serialize()+"&setprice=Сохранить изменения";
            $.ajax({
              type:"POST",
            	async: false,
              url:UnitHref+'/sale',
              data:postData
            });
          }
        }
      });
//      $.ajax({
//        type:"GET",
//        async: false,
//        url:UnitHref,
//        success:function(data){
//          var page = $(data);
//          var sold = $("td:contains('Продано'):eq(1)",data).next().text().replace(/\s+/g,'').match(/[.\d]+/g);
//          var prod = $("td:contains('Выработано электроэнергии'):eq(1)",data).next().text().replace(/\s+/g,'').match(/[.\d]+/g);
//          var price = $("td:contains('Цена (на момент пересчёта)'):eq(1)",data).next().text().replace(/\s+/g,'').match(/[.\d]+/g);
//          if (sold!=null){
//            if (sold[0]!=prod[0] || ( sold[1] < 0.75*price && sold.length>1 ) ) {
//              var obj1 = $('<a href="'+UnitHref+'">').append($('<img>').attr({'src': '/img/unit_indicator/unit_sale_price.gif', 'height': 16, 'width': 16}));
//                $('td:eq(11)',workCell).attr('class','nowrap').empty().append(obj1);
//            }
//          }
//        }
//      });
    }
    if (UnitType == "production") {
      $.ajax({
        type:"GET",
        async: false,
        url:UnitHref+'/sale',
        success:function(data){
          var page = $(data);
          var setPrice = false;
          $('.grid>tbody>tr:gt(0)',page).each( function () {
            var sellOption = $('[selected="selected"]',this).val();  // 3=только своей компании
            if (sellOption==3) { //ставим цену автоматом, только если продаем сами себе
              var altt=$('td[title*="маркетинг"]>a>img',this).attr('alt');
              var sbst=parseFloat($('td:contains("Себестоимость"):first-child',this).next().text().replace(/[^\d\.]/g,'')).toFixed(2);
              sbst = isNaN(sbst)?0:sbst;
              var newPrice = (sbst*(1+arr_envd[altt]/100)).toFixed(2);
              var price = parseFloat($('.money:eq(0)',this).val().replace(/[^\d\.]/g,'')).toFixed(2);
              if (price != newPrice && sbst > 0) {$('.money:eq(0)',this).prop("value",newPrice);setPrice=true;}
            }
          });
          if (setPrice) {
            var postData = $('form[name="storageForm"]',page).serialize();
            $.ajax({
              type:"POST",
            	async: false,
              url:UnitHref+'/sale',
              data:postData
            });
          }
        }
      });
    }

    var id_shop = /(\d+)/.exec(UnitHref)[0];
    if (shop_price[id_shop] === null) shop_price[id_shop] = {};

    if (UnitType == "shop" && shop_price[id_shop] != today) {
      console.log("setting prices in shop " + id_shop);
      var recalcPrice=$('#recalcPrice:checked').val()=="X"?"X":""; //полный пересчет цен
      $.ajax({
        type:"GET",
        async: false,
        url:UnitHref+'/trading_hall',
        success:function(data){
          var page = $(data);
          var setPrice = false;
          $('.grid tr input[type="text"]',page).each( function() {
            var sell = parseFloat($(this).val().replace(/[^\d\.]/g,''));
            var buy = parseFloat($(this).parent().prev().text().trim().replace(/[^\d\.]/g,''));
            var share = parseFloat($(this).parent().next().text().trim().replace(/[^\d\.]/g,'').replace('%',''));
            var vol_sold = parseFloat($(this).parent().prevAll('td:eq(5)').text().replace(/[^\d\.]/g,''));
            var last_lot = parseFloat(/(\d+)\[(\d+)]/.exec($(this).parent().prevAll('td:eq(4)').text().replace(/\s/g,''))[2]);
            var warehouse = parseFloat($(this).parent().prevAll('td:eq(3)').text().replace(/[^\d\.]/g,''));
            var good = $(this).parent().prevAll('td:eq(6)').attr('title').replace(' (кликните для просмотра подробного маркетингового отчёта)',''); //Автомобиль, Автозапчасти...
            if (!isNaN(buy)) {
                var newPrice = 0;
                if (good == 'Автомобиль') {newPrice = 1.02*buy;$(this).val(f2(newPrice));setPrice=true;} // продаем по себестоимости

                // остальное исходя из доли рынка
                else if (share > 50) {newPrice = Math.max(sell*1.10,sell+1.00);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 50% поднимаем цену, шаг 10% или 100с
                else if (share > 20) {newPrice = Math.max(sell*1.05,sell+0.10);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 10% поднимаем цену, шаг 5% или 10с
                else if (share > 10 ) {newPrice = Math.max(sell*1.01,sell+0.01);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 3% поднимаем цену, шаг 1% или 1с
                else if (share < 5 && last_lot != warehouse) {newPrice = Math.max(Math.min(sell*0.95,sell-0.01),buy+0.01);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка близка к нулю опускаем цену, шаг 1% или 1с. Не ниже чем сс

                if (sell < buy || recalcPrice=='X') {newPrice = 1.02*buy;$(this).val(f2(newPrice));setPrice=true;} // продавать надо дороже, чем купили
            }
//console.log(id_shop+","+good+", sell="+sell+",buy="+buy+",new_price="+$(this).val()+",setPrice="+setPrice+",share="+share+",vol_sold="+vol_sold+",last_lot="+last_lot+",warehouse="+warehouse);
          });

          if (setPrice) {
            $('form[name="tradingHallForm"] input[name="action"]',page).val("setprice");
            var postData = $('form[name="tradingHallForm"]',page).serialize();
            $.ajax({
              type:"POST",
              async: false,
              url:UnitHref+'/trading_hall',
              data:postData
            });
          }
        }
      });
      shop_price[id_shop] = today;
      window.localStorage.setItem( 'shop_price',  JSON.stringify( shop_price ) );  //запишем, что уже обработали магазин
    }

    if (UnitType == "services" || UnitType == "services_light") {
      $.ajax({
        type:"GET",
        async: false,
        url:UnitHref,
        success:function(data){
          var page = $(data);
          var ob = $("td:contains('Количество оборудования')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g);
          var per = $("td:contains('Количество сотрудников')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g);
          if (per[1] === 0 || ob[1] === 0) return;
          var k_max = (per[0]/per[1]) * (ob[0]/ob[1]);

          var pos=$("td.title:contains('Количество посетителей')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g);
          var sal=parseInt($("td.title:contains('Расходы на зарплату')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g));
          sal = isNaN(sal)?0:sal;
          var adv=parseInt($("td.title:contains('Расходы на рекламу')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g));
          adv = isNaN(adv)?0:adv;
          var rnt=parseInt($("td.title:contains('Расходы на аренду')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g));
          rnt = isNaN(rnt)?0:rnt;
          var price = parseInt($("td:contains('Цена (на момент пересчёта)')",page).next().text().replace(/\s+/g,'').match(/\d[.\s\d]*(?=)/g)[0]);
          var min_price=0;
          $.ajax({
            type:"GET",
            async: false,
            url:UnitHref+'/consume',
            success:function(data0){
              var page0 = $(data0);
              min_price=parseInt($('.list [colspan=8]',page0).next().text().replace(/[^\d\.]/g,'') * 1.05); // минимальная цена равна стоимости расходников +5%
            }
          });
          var exp = (sal+adv+rnt)/(pos[1] * 2/3); //расчитаем опер.расходы исходя из 2/3 от максимального посещения
          exp = isNaN(exp)?0:exp;
          min_price = min_price + exp;
          var setPrice = false;
          if (pos[0]/k_max > 0.8) { //значит посещаемость с учетом персонала >90%
            setPrice=true;
            price = parseInt(price * 1.02);  //увеличим цену на 2%
          }
          if (pos[0]/k_max < 0.3) { //значит посещаемость с учетом персонала <10%
            setPrice=true;
            price = parseInt(price * 0.98);  //уменьшим цену на 2%
          }
          if (price < min_price){
            setPrice=true;
            price = min_price;
          }
          if (setPrice && price>0){
            $('form[name="servicePriceForm"] input[name="servicePrice"]',page).val(price);
            var postData = $('form[name="servicePriceForm"]',page).serialize()+"&setprice=Установить цены";
            $.ajax({
              type:"POST",
              async: false,
              url:UnitHref,
              data:postData
            });
          }
        }
      });
    }
  }//end function setPriceENVD

  function setEducation(workCell, action){
    var UnitEduHref = $('td:eq(4)>a',workCell).attr('href').replace('engage','education');
    var objLevel=$('td:eq(2)',workCell);
    $.ajax({
      type:"GET",
      url:UnitEduHref,
      async:false,
      success:function(data){
        var quantity = $("#unitEmployeesData_employees", data).val();
        var time = $("#unitEmployeesData_timeCount", data).val();
        if(quantity !== undefined && time !== undefined){
          $.ajax({
            type:"POST",
            url : UnitEduHref,
            async:false,
            data : {
              'unitEmployeesData[employees]' : quantity,
              'unitEmployeesData[time_count]' : 4
            },
            success : function(){
	            if(!($("div", objLevel).is('.sizebar'))) objLevel.append($("<div title='Оставшиеся недели обучения: 4' class='sizebar'>■■■■</div>"));
	            else $("div.sizebar", objLevel).text('■■■■');
              $('img[src="/img/reward/16/diploma.gif"]',workCell).css({border:'1px solid red'}).attr({title:'Отменить обучение'});
//          srcElement.style.border = "1px solid red";
//          srcElement.title = "Отменить обучение";
            }
          });
        }
        else {
          if(($("div:last", objLevel).prop('title')).slice(-1) == 4){
            $.ajax({
              type:"GET",
              url:UnitEduHref + "/cancel",
              async:false,
              success:function(){
//                srcElement.style.border = "0px";
//                srcElement.title = "Обучить весь персонал 4 недели";
                $('img[src="/img/reward/16/diploma.gif"]',workCell).css({border:'0px'}).attr({title:'Обучить весь персонал 4 недели'});
                $('div:last',objLevel).empty();
              }
            });
          }
        }//end else
      }
    });//end get
  }//end function setEducation()

  function SetTechPrice(href,action){
    var Koef = 0.90;
    $.ajax({ // запрос "техны"
      type:"GET",
      url:href,
      async: false,
      success:function(data){
        var price = parseFloat($("td:contains('Рыночная стоимость технологии')",data).eq(1).next().next().text().replace(/[^\d\.]/g,'')) * Koef;
        $.ajax({
          type:"POST",
          async: false,
          url:href,
          data: {'price' : Math.round(price)}
        });
      }
    });
  } // End of function SetTechPrice()

  function setSuply(workCell,action){
    if ($('td:eq(10)>a',workCell).length > 0) return; //не обрабатывать предприятия в отпуске
    var UnitType = $('td:eq(2)',workCell).attr('class');
    var UnitCode = $('td:eq(0)>input',workCell).attr('value');
    var UnitName = $('td:eq(2)>a',workCell).text();
    var UnitHref = $('td:eq(2)>a',workCell).attr('href');
    var UnitWorkers = $('td:eq(4)>input',workCell).attr('value');
    var UnitWorkersTotal = $('td:eq(5)>input',workCell).attr('value');
    var UnitSalary = parseFloat($('td:eq(6)',workCell).text());
    var UnitSalaryTotal = $('td:eq(7)>input',workCell).attr('value');
    var UnitQuantity = $('td:eq(8)>input',workCell).attr('value');
    var UnitQuantityTotal = parseFloat($('td:eq(9)',workCell).text());

    switch(UnitType){
      case "u-c i-restaurant":UnitType="services";break;
      case "u-c i-medicine":UnitType="services";break;
      case "u-c i-shop":UnitType="shop";break;
      case "u-c i-power":UnitType="production";break;
      case "u-c i-animalfarm":UnitType="animalfarm";break;
      case "u-c i-mill":UnitType="production";break;
      case "u-c i-workshop":UnitType="production";break;
      case "u-c i-repair":UnitType="services";break;
      case "u-c i-fuel":UnitType="shop";break;  //Заправка
      case "u-c i-educational":UnitType="services";break;
    }
    switch(UnitType){
      case 'production':field='Требуется';break;
      case 'animalfarm':field='Требуется';break;
      case 'services'  :field='Расх. на клиента';break;
      default          :field='Продано';break;
    }

    var k_growth = 1.25; // коэф роста закупок
    if ((UnitType == 'production')||(UnitType == 'animalfarm')||(UnitType == 'shop')||(UnitType == 'services')) {
            if (UnitType=='services') { // посещаемость
              var max_populi = 1;
              var populi = 1;
              $.ajax({
                type:"GET",
                async: false,
                url:UnitHref,
                success:function(data){
                  /(\d+)\D+(\d+)/.exec($('td.title:contains("Количество посетителей")',data).next().text().replace(/\s+/g,''));
                  max_populi = parseInt(RegExp.$2); // максимальный расход в ход
                  populi = parseInt(RegExp.$1); // расход в ход
                  //populi = max_populi;
                }
              });
            }
      $.ajax({
        type:"GET",
        async: false,
        url:UnitHref+'/supply',
        success:function(data){
          var postData = ''; //формируем post-строку
          var message = 0;
          $("tr[id^='product_row']",data).each( function() {  // Требуется
            var require = parseInt ( $("tr td:contains('"+field+"')", this).next().text().replace(/\s+/g,'') );
            var max_require = require;
            var warehouse = parseInt ( $("tr td:contains('Количество')", this).next().text().replace(/\s+/g,'') );
            var bought = parseInt ( $("tr td:contains('Закупка'):eq(0)", this).next().text().replace(/\s+/g,'') );
            var material = $("th [alt]",this).attr("alt");
            if (UnitType=='services') { //уточнение расхода материалов
                  max_require = require * max_populi; // максимальный расход в ход
                  require = require * populi; // расход в ход
//                  k_growth = 1; //поддерживать 100% на складе
            }
            if ((UnitType == 'animalfarm')&&(require > warehouse)) message=2; // если остатков не хватает для питания

            var available = 0; //свободный остаток по всем заказам
            var max_available = 0; // свободный остаток заказа
            var limit = 0;
            var suppliers = 0;
            var OrderQuantity = 0;
            var good = $(this);
            var good_id = /\d+-?\d+/.exec(good.attr('id'))[0];
            var good_id_ = good_id;
            do{
              if ($("td:last",this).text()=='---') break; //поставщики отсутствуют
              max_available = $("tr td:contains('Свободно')", good).next().text().replace(/\s+/g,'');
              max_available = parseInt ( (max_available=='Неогр.')?999999999999999:max_available );
              limit = parseInt($("input[name^='supplyContractData']:eq(1)", good).next().next().text().replace(/\s+/g,'').replace('Max:',''));
              limit = isNaN(limit)?999999999999999:limit;
              max_available = Math.min(max_available,limit);
              // определим сколько закупается сейчас
              available = available + Math.min(max_available,parseInt ( $("input[name^='supplyContractData']:eq(1)", good).val() ));
              ++suppliers;
//              console.log("supplier="+suppliers+",max_available="+max_available+",limit="+limit+",available="+available);
              good = $(good).next();
              good_id_ = /\d+-?\d+/.exec(good.attr('id'));
              good_id_ = (good_id_ === null)?-1:good_id_[0];
            }while (good_id_ == good_id);

            if (suppliers != 1) { //поставщиков нет или несколько
              if (max_require*2 > warehouse+available) message = 1; //если не достаточно товара, поставим ссылку
              return; // let's check next material
            }
            OrderQuantity=0;
            switch(action){
              case 'x1':  //поставка с учетом остатков на один день x1
                if ((UnitType=='services')||(UnitType=='shop')) {
                  if (warehouse == bought) require = Math.max(warehouse,require); //если все распродали, то требуется закупить не меньше
                  if (require > 10) require = Math.round(require * k_growth); //для сервисных предприятий увеличиваем на 25% закупки в сравнении с продажами
                  else require = require + 5; //если оборот маленький, то увеличиваем закупку по 5 ед. товара
                }
                OrderQuantity = Math.max(2*require - warehouse,0);
                OrderQuantity = Math.min(OrderQuantity,require);
                break;
              case '1:1':  //поставка по требованию 1:1
                OrderQuantity = max_require;
                break;
            }
            if (OrderQuantity > max_available) message=1; // если остатков не хватает для поставки
            order = $("input[name^='supplyContractData[party_quantity]']").val();
            if (OrderQuantity != order){ // меняем данные, если они изменились
              $("select[name^='supplyContractData']", this).each( function() {
                lVal = $(this).attr('name').indexOf('party_quantity') > 0 ? OrderQuantity : $(this).val();
                postData = postData + $(this).attr('name') + '=' + lVal + "&";
              });
              $("input[name^='supplyContractData']", this).each( function() {
                lVal = $(this).attr('name').indexOf('party_quantity') > 0 ? OrderQuantity : $(this).val();
                postData = postData + $(this).attr('name') + '=' + lVal + "&";
              });
            }
          });
          switch(message){
            case 1:var obj1 = $('<a href="'+UnitHref+'/supply'+'">').append($('<img>').attr({'src': '/img/unit_indicator/unit_possible_shortage_material.gif', 'height': 16, 'width': 16}));break; // возможен недостаток товара
            case 2:obj1 = $('<a href="'+UnitHref+'/supply'+'">').append($('<img>').attr({'src': '/img/unit_indicator/unit_insufficient_supply_material.gif', 'height': 16, 'width': 16}));break; // не хватает для питания
            default:obj1 = $('<a href="https://virtonomica.ru/vera/main/user/privat/persondata/pay_service/list">').append('<div class="lock">');break;
          }
          if (postData.length>0){ //отправим на сервер, только если что-то надо менять
            $('td:eq(11)',workCell).empty().append($('<img>').attr({'src': 'http://s3.devels.info/load.gif', 'height': 16, 'width': 16}));
              $.ajax({
                type:"POST",
            	  async: false,
                url:UnitHref+'/supply',
                data:postData + 'applyChanges=Изменить',
                success:function(){
                  $('td:eq(11)',workCell).attr('class','nowrap').empty().append(obj1);
                  if (message > 0) $('td:eq(11)',workCell).attr('class','highLight');
                }
              });
          }
          else if(message > 0) {$('td:eq(11)',workCell).attr('class','nowrap').empty().append(obj1);$('td:eq(11)',workCell).attr('class','highLight');}

          if(message > 0 && UnitName.substr(0,1) != "!") {
            // изменить название, если нет поставки
            $.ajax({
              type:"GET",
              async: false,
              url:UnitHref,
              success:function(unitdata){
                var chngNameURL = $('#unit_subtab a:contains("Изменить название")',unitdata).attr('href');
                $.ajax({
                  type:"POST",
            	    async: false,
                  url:chngNameURL,
                  data:"unitData[name]=!" + UnitName + "&" +"unitData[international_name]=&save=Изменить название подразделения"
                });
              }
            });
          }
        }
      });
    }
  } // End of function SetSupply()

  function RepairEquipment(workCell, action) {
    //case 'tabBuy' :  mode = 'buy'; break;
    //case 'tabRepair' : mode = 'repair'; break;
    //case 'tabTerminate' : mode = 'terminate'; break;
    var unit = $('td:eq(0)>input', workCell).attr('id').replace(/^unit_/g, '');
    var unitType = $('td:eq(2)', workCell).attr('class');
    var unitTitle = $('td:eq(2)', workCell).attr('title');
    var Quantity = parseFloat($('td:eq(3)>input', workCell).val().replace(/\s+/g, '')); // кол-во сейчас
    var QuantityMax = parseFloat($('td:eq(4)>input', workCell).val().replace(/\s+/g, '')); // максимальное кол-во
    var QntHref = $('td:eq(3)>a', workCell).attr('href'); // ссылка на подбор
    var QualityAct = parseFloat($('td:eq(5)', workCell).text().replace(/\s+/g, '')); // текущее качество
    var QualityReq = parseFloat($('td:eq(6)', workCell).text().replace(/\s+/g, '')); // требуемое качество
    var Quality = f2(Math.max(QualityAct * 0.95, QualityReq * 0.99)); // не уменьшаем качество
    var Broken = parseFloat($('td:eq(7)', workCell).text()); // процент повреждения
    var BrokenEq = Math.floor(Quantity * Broken / 100); // сломано единиц оборуования
    var BrokenTotal = Math.ceil(Quantity * Broken / 100); // повреждено единиц оборудования

    var repair = 0; // 0 - не чинить, -1 - чинить все, -2 - чинить сломанные, >0 - критичный проценнт поломки
    var maxPrice = 0;
    var unknown_unit = false; // что-то новенькое
    var filterURL = '';
    switch (unitType) {
      case 'u-c i-power':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbpowerplant/equipmentSupplierListByUnit';         repair = 2;maxPrice = 10000000;break;
      case 'u-c i-restaurant':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';   repair = - 2;maxPrice = 1000000;break;
      case 'u-c i-service_light':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';repair = 1.2;maxPrice = 100000;break;
      case 'u-c i-medicine':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';     repair = - 2;maxPrice = 700000;break;
      case 'u-c i-fishingbase':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbfishingbase/equipmentSupplierListByUnit';  repair = 4;maxPrice = 60000000;break;
      case 'u-c i-mine':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbmine/equipmentSupplierListByUnit';                repair = - 1;maxPrice = 505000;break;
      case 'u-c i-sawmill':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbsawmill/equipmentSupplierListByUnit';          repair = - 1;maxPrice = 100000;break;
      case 'u-c i-orchard':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbfarm/equipmentSupplierListByUnit';             repair = 4;maxPrice = 100000;break;
      case 'u-c i-farm':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbfarm/equipmentSupplierListByUnit';                repair = 4;maxPrice = 100000;break;
      case 'u-c i-workshop':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbworkshop/equipmentSupplierListByUnit';        repair = - 1;maxPrice = 70000;break;
      case 'u-c i-mill':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbmill/equipmentSupplierListByUnit';                repair = - 1;maxPrice = 70000;break;
      case 'u-c i-lab':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dblab/equipmentSupplierListByUnit';                  repair = - 2;maxPrice = 600000;break;
      case 'u-c i-office':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dboffice/equipmentSupplierListByUnit';            repair = 3;maxPrice = 100000;break;
      case 'u-c i-villa':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbvilla/equipmentSupplierListByUnit';              repair = 0;maxPrice = 0;break;
      case 'u-c i-repair':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';       repair = -2;maxPrice = 700000;break;
      case 'u-c i-fuel':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbfuel/equipmentSupplierListByUnit';                repair = 1.2;maxPrice = 1000000;break;
      case 'u-c i-it':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';           repair = 1.2;maxPrice = 5000000;break;
      case 'u-c i-educational':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbserviceunit/equipmentSupplierListByUnit';  repair = - 2;maxPrice = 1000000;break;
      case 'u-c i-network':filterURL = 'https://virtonomica.ru/vera/window/common/util/setfiltering/dbnetworkunit/equipmentSupplierListByUnit';      repair = 4.9;maxPrice = 30000000;break;
      default:unknown_unit = true;break;
    }
    if (unknown_unit) {console.log('unknown unit found: ' + unitType);repair = 0;} // ошибка, ничего не трогаем
    if (Broken === 0) {repair = 0;}
    if (repair === 0) {return;}

    var amount = 0;
    switch (repair) {
      case - 1:amount = Math.ceil(Quantity * Broken / 100);break;
      case - 2:amount = Math.floor(Quantity * Broken / 100);break;
      case 0:amount = 0;break;
      default:amount = Math.ceil((Broken > repair) ? Broken - repair : Math.floor(Quantity * Broken / 100));break;
    }

    // настроим фильтры
    $.ajax({
      type: 'POST',
      async: false,
      url: filterURL,
      data: {
        'quality[from]': (Quality < 2) ? 1 : Quality, // качество от заданного
        'quality[to]': (Quality < 2) ? 1.1 : '',
        'quality[isset]': 1,
        'quantity[from]': 1,
        'quantity[isset]': 1,
        'total_price[from]': 0,
        'total_price[to]': maxPrice,
        'total_price_isset': 1
      },
      success: function () {
        $.ajax({ // запрос "оборудования"
          type: 'GET',
          url: QntHref,
          async: false,
          success: function (data) {
            if (filterURL != $('form[name="unitEquipmentFilterForm"]', data).attr('action')) {
              console.log('Ошибка фильтра качества для ' + unitTitle + ' (' + unit + '): ' + filterURL + '!=' + $('form[name="unitEquipmentFilterForm"]', data).attr('action'));
              amount = 0;
            } // ошибка, ничего не трогаем

            var eq_array = [];
            $('#mainTable tr[id^=\'r\']', data).each(function (i) {
              id = $(this).attr('id').replace(/^r/g, '');
              eq_available = parseInt($('span[id^=\'quantity\']', this).text().replace(/\s+/g, ''));
              eq_price = parseFloat($('span[id^=\'quantity\']', this).parent().next().next().next().next().text().replace(/[^\d\.]/g, ''));
              eq_quality = parseFloat($('span[id^=\'quantity\']', this).parent().next().next().next().next().next().text().replace(/\s+/g, ''));
              if (Quality >= eq_quality) {
              }
              eq_array[eq_array.length] = {
                'id': id,
                'eq_available': eq_available,
                'eq_price': eq_price,
                'eq_quality': eq_quality
              };
            });
            while (amount > 0 && eq_array.length > 0) { // чиним
              id = eq_array[0].id;
              eq_available = eq_array[0].eq_available;
              eq_price = eq_array[0].eq_price;
              var a = Math.min(amount, eq_available);
              $.ajax({
                url: 'https://virtonomica.ru/vera/ajax/unit/supply/equipment',
                async: false,
                data: {
                  'operation': action,
                  'offer': id,
                  'unit': unit,
                  'supplier': id,
                  'amount': a
                },
                type: 'post',
                dataType: 'json',
                success: function (j) {
                  if (j.result == - 5) {
                    console.log('Заключение контракта блокировано поставщиком');
                    a = 0;
                    eq_available = 0;
                  }
                  else {
                    TotalPrice = TotalPrice + a * eq_price;
                    eq_available = eq_available - a;
                  }
                },
              });
              amount = amount - a;
              if (eq_available === 0) {
                eq_array.splice(0, 1);
              } else {
                eq_array[0].eq_available = eq_available;
              }
            }
          }
        });
      }
    });
  }// End of function RepairEquipment()

  function serviceAll(){
//------------------ Корректировка цен продажи технологий
    if (tech_price){
      wall(' корр. цен технологий ');
      var techURL = /(\D+)\/main\/company\/view\/(\d+)/.exec(location.href)[1]+'/main/management_action/'+/(\D+)\/main\/company\/view\/(\d+)/.exec(location.href)[2]+'/investigations/technologies';
      $.ajax({ // запрос "управления исследованиями"
        type:"GET",
        url:techURL,
        async: false,
        success:function(data){
          var arr = [];
          arr.length=0;
          $('[name="close_sale"] .tech_s>a',data).each(function(){arr[arr.length] = $(this).attr('href');});
          remove_wall();
          doit(arr,'',' корр. цен технологий ',function(objCell,action){SetTechPrice(objCell,action);});
        }
      });
    }
//-------------------- Корректировка цен отпука "себе"
    if (warehouse_price){
      wall(' корр. цен склада ');
      var listURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0]+'main/company/view/'+/(\D+)\/main\/company\/view\/(\d+)/.exec(location.href)[2]+'/unit_list';
      var pagingURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setpaging/dbunit/unitListWithProduction/';
      var selectionURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setfiltering/dbunit/unitListWithProduction/class=2013/type=0';
      $.ajax({ // changing selection
        type:"POST",
        async: false,
        url:selectionURL,
        success:function(){
          $.ajax({ // changing paging
            type:"POST",
            async: false,
            url:pagingURL+'400',
            success:function(){
              $.ajax({ // changing paging
                type:"GET",
                async: false,
                url:listURL,
                success:function(data){
                  var arr = [];
                  $('.unit-list-2014>tbody>tr>td[class^="info i-"]>a',data).each(function(){arr[arr.length] = $(this).attr('href');});
                  remove_wall();
                  doit(arr,'',' корр. цен склада ',function(objCell,action){SetWarehousePrice(objCell,action);});
                }
              });
            }
          });
        }
      });
    }
//-------------------- Ремонт оборудования
    if (repair){
      wall(' ремонт ');
      var pagingURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setpaging/dbunit/unitListWithEquipment/';
      var selectionURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setfiltering/dbunit/unitListWithEquipment/country=/region=/city=/product=/understaffed=/wear_percent=/low_quality=/animal_food_not_enough=/animal_food_low_quality=/type=0';
      var sortURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setordering/dbunit/unitListWithEquipment/equipment_wear/desc';
      var listURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0]+'main/company/view/'+/(\D+)\/main\/company\/view\/(\d+)/.exec(location.href)[2]+'/unit_list/equipment';
      $.ajax({ // changing selection
        type:"GET",
        async: false,
        url:selectionURL,
        success:function(){
          $.ajax({ // changing sort
            type:"GET",
            async: false,
            url:sortURL,
            success:function(){
              $.ajax({ // changing paging
                type:"GET",
                async: false,
                url:pagingURL+max_repair,
                success:function(){
                  $.ajax({ // get data
                    type:"GET",
                    async: false,
                    url:listURL,
                    success:function(data){
                      var arr = [];
                      $('table.list>tbody>tr:gt(0):has(:checkbox)',data).each(function () {
                        var objCell = $(this);
                        arr[arr.length] = objCell;
                      });
                      remove_wall();
                      doit(arr,'repair',' ремонт ',function(objCell,action){RepairEquipment(objCell,action);});
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
//-------------------- Установка ЗП
    if (salary){
      wall(' квалификация ');
      var pagingURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setpaging/dbunit/unitListWithHoliday/';
      var selectionURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setfiltering/dbunit/unitListWithHoliday/class=0/type=0';
      var sortURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0] + 'main/common/util/setordering/dbunit/unitListWithHoliday/employee_count/desc';
      var listURL = /^https:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href)[0]+'main/company/view/'+/(\D+)\/main\/company\/view\/(\d+)/.exec(location.href)[2]+'/unit_list/employee';
      $.ajax({ // changing selection
        type:"GET",
        async: false,
        url:selectionURL,
        success:function(){
          $.ajax({ // changing sort
            type:"GET",
            async: false,
            url:sortURL,
            success:function(){
              $.ajax({
                type:"GET",
                async: false,
                url:pagingURL+max_salary,
                success:function(){
                  $.ajax({ // get data
                    type:"GET",
                    async: false,
                    url:listURL,
                    success:function(data){
                      var arr = [];
                      $('table.list>tbody>tr:gt(0):has(:checkbox)',data).each(function () {
                        var objCell = $(this);
                        var UnitType = $('td:eq(2)',objCell).attr('class');
//                        if (UnitType != "u-c i-shop" || salary_no_shop != true ){arr[arr.length] = objCell;}
                        arr[arr.length] = objCell;
                      });
                      remove_wall();
                      doit(arr,'1:1',' (setSalary 1:1)',function(objCell,action){setSalary(objCell,action);});
                      doit(arr,'x1',' (setSupply x1)',function(objCell,action){setSuply(objCell,action);});
                      doit(arr,'',' (setPrice)',function(objCell,action){setPriceENVD(objCell,action);});
//var zz=$('td:eq(11)',$('table.list>tbody>tr:gt(0):has(:checkbox):eq(0)',data));
//$('td:eq(11)',$('table.list>tbody>tr:gt(0):has(:checkbox):eq(0)',data))=zz.attr('class','nowrap').empty();
//console.log($('table.list>tbody>tr:gt(0):has(:checkbox):eq(0)',data).html());
//                      var w = window.open('','','');
//                      w.document.write(data);
//                      w.document.close();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  } //end of service()

  function repairAll() {
    TotalPrice = 0;
    var arr = [];
    arr.length = 0;
    $('table.list>tbody>tr>th:eq(0)>input').attr('checked', false); //uncheck group flag
    $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function () {
      $(this).attr('checked', false); //uncheck
      var objCell = $(this).parent().parent();
      arr[arr.length] = objCell;
    });
    doit(arr, 'repair', 'repair',function (objCell, action) {RepairEquipment(objCell, action);});
    alert(TotalPrice);
  } // end if repairAll()

  function setAll(){
   var qualification=$('input[name="qualification"]:checked').val();
   var supply=$('input[name="supply"]:checked').val();
   var setPrice=$('input[name="setPrice"]:checked').val()=="X"?"X":"";
   var arr = [];
   arr.length=0;
   $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
   $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
     $(this).attr('checked',false); //uncheck
     var objCell = $(this).parent().parent();
     arr[arr.length] = objCell;
   });
   if(qualification!=="")   doit(arr,qualification,' (setSalary '+qualification+')',function(objCell,action){setSalary(objCell,action);});
   if(supply!=="")          doit(arr,supply,' (setSuply'+supply+')',function(objCell,action){setSuply(objCell,action);});
   if(setPrice!=="")        doit(arr,'',' (setPrice)',function(objCell,action){setPriceENVD(objCell,action);});
   return false;
  } //end of setAll()

  function setSuplyAll(action){
    var arr = [];
    arr.length=0;
    $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
    $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
      $(this).attr('checked',false); //uncheck
      var objCell = $(this).parent().parent();
      arr[arr.length] = objCell;
    });
    doit(arr,action,' (setSuply)',function(objCell,action){setSuply(objCell,action);});
  }//end of setSupplyAll()

  function setSalaryAll(action){
    var arr = [];
    arr.length=0;
    $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
    $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
      $(this).attr('checked',false); //uncheck
      var objCell = $(this).parent().parent();
      arr[arr.length] = objCell;
    });
    doit(arr,action,' (setSalary)',function(objCell,action,handle){setSalary(objCell,action,handle);});
  }//setSalaryAll()

  function setEduAll(){
    var arr = [];
    arr.length=0;
    $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
    $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
      $(this).attr('checked',false); //uncheck
      var objCell = $(this).parent().parent();
      arr[arr.length] = objCell;
    });
    doit(arr,'',' (Education) ',function(objCell,action,handle){setEducation(objCell,'',handle);});
  }//end of setEduAll()

  function DelExcl(){
  // сброс метки "!"
  $('table.list>tbody>tr:gt(0):has(:checkbox)').each(function () {
    var t = $('td:eq(2)>a', this).text();
    if (t.substr(0, 1) == '!') {
      $.ajax({
        type: 'POST',
        async: false,
        url: 'https://virtonomica.ru/vera/window/unit/changename/' + /\d+/g.exec($('td:eq(2)>a', this).attr('href')),
        data: 'unitData[name]=' + t.substr(1) + '&' + 'unitData[international_name]=&save=Изменить название подразделения'
      });
    }
   });
  }//end of DelExcl()

  function zero_supply(url){
  $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
  var postData = '';
  $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
    $(this).attr('checked',false); //uncheck
    postData = postData + '&' + $(this).attr('name') + '=' + $(this).attr('value');
  });
  if (postData.length>1){
  $.ajax({
    type:"POST",
    async: false,
    url:url,
    data:postData.substr(1)
  });
  }}
  // screen processing

  function start_main(){ //unit_list processing
    var block = $('<td align="right"><img style="cursor:pointer" width="32" src="http://www.iconsearch.ru/uploads/icons/musthave/32x32/settings.png" name="service"></td>').find('img').click(function(){serviceAll();});
    $('.unit-top>tbody>tr:eq(0)>td:eq(0)').after(block);
    var pages = [[10,10],[25,25],[50,50],[100,200],[200,400],[400,800]];
    paging(pages);
  } // end of start_main

  function start_repair(){ //equpment
    var container = $('table.list>tbody>tr:eq(0) th:contains("Оборудование")');
    container.append($('<span title=\'ремонт\'>repair_new</span>').click(function () {repairAll();}));
    $('span', container).css({fontSize: '75%',margin: '1px',padding: '1px',border: '1px solid #2222ff',borderRadius: '3px',cursor: 'pointer'}).hover(function () {this.style.color = 'red';}, function () {this.style.color = 'black';});
    var pages = [[10,10],[25,25],[50,50],[100,100],[200,200],[400,800]];
    paging(pages);
  } //end of start_repair

  function start_employee(){ //employee
    var t=0; //блок для колонки квалификация
    var z=["(noSHOP)","<>noSHOP","<",">","=","all"];
    $('table.list>tbody>tr:eq(1) th:contains("квалификация")').click(function(){
      $(this).prop('textContent','квалификация '+z[t]);
      $('table.list>tbody>tr:gt(2):not([id*="steward"]):not(:last)').each(function(){
        var b=$('td>input[id*="employee_level"]',this).attr('value');
        var a=$('td>input[id*="employee_level"]',this).parent().prop('textContent').replace(/[^\d\.]/g,'');
        var cl=$('td:eq(2)',this).attr('class');
        switch(z[t]){
          case "<>noSHOP":$(this).css('display',(+a!=+b&&cl!="u-c i-shop")?'table-row':'none');break;
          case ">":$(this).css('display',+a>+b?'table-row':'none');break;
          case "<":$(this).css('display',+a<+b?'table-row':'none');break;
          case "=":$(this).css('display',+a==+b?'table-row':'none');break;
          case "(noSHOP)":$(this).css('display',(cl!="u-c i-shop")?'table-row':'none');break;
          case "all":$(this).css('display','table-row');break;
        }
      });
      t+=1;t=t%6;
    });
    var t2=0; //блок для колонки зарплата
    var z2=[">=87%","<81%",">150%","all"];
    $('table.list>tbody>tr:eq(1) th:contains("зарплата")').click(function(){
      $(this).prop('textContent','зарплата '+z2[t2]);
      $('table.list>tbody>tr:gt(2):not([id*="steward"]):not(:last)').each(function(){
        cl=$('td:eq(2)',this).attr('class');
        var d=Math.round($('td>input[id*="base_salary"]',this).attr('value') * 100 ) / 100; // установленная ЗП
        var c=parseFloat($('td:eq(6)',this).text().replace(/[^\d\.]/g, '')); // городская ЗП
        switch(z2[t2]){
          case "<81%":$(this).css('display',+c<+(d*0.85)?'table-row':'none');break;
          case ">=87%":$(this).css('display',(+c>=+(d*0.87)&&cl!="u-c i-shop")?'table-row':'none');break;
          case ">150%":$(this).css('display',+c>+(d*1.5)?'table-row':'none');break;
          case "all":$(this).css('display','table-row');break;
        }
      });
      t2+=1;t2=t2%4;
    });

    var container = $('table.list>tbody>tr:eq(0) th:contains("Персонал")');
    container.append($("<span title='Все предприятия согласно требуемой квалификации'>1:1</span>").click(function(){setSalaryAll("1:1");}));
    container.append($("<span title='Все предприятия  100$'>100%</span>").click(function(){setSalaryAll("100%");}));
    container.append($("<span title='Поставка 1:1'>S1:1</span>").click(function(){setSuplyAll("1:1");}));
    container.append($("<span title='Поставка x1'>Sx1</span>").click(function(){setSuplyAll("x1");}));
    container.append($("<span title='Квала 1:1, Поставка x1'>1:1Sx1</span>").click(function(){setAll();}));
    container.append($("<img>").attr({src: "/img/reward/16/diploma.gif", title:'Обучить весь персонал 4 недели'}).click(function(){setEduAll();}));

    $("span",container).css({fontSize:'75%',margin:'1px', padding:'1px', border:'1px solid #2222ff', borderRadius:'3px', cursor:'pointer'}).hover(function () {this.style.color = 'red';},function () {this.style.color = 'black';});
    $("img",container).css({margin:'1px', padding:'1px', border:'0px', borderRadius:'3px', cursor:'pointer'});

    container = $('table.list>tbody>tr:eq(0) th:contains("Подразделение")');
    container.append($("<span title='Удалить признак'>Del!</span>").click(function(){DelExcl();}));

    $("span",container).css({fontSize:'75%',margin:'1px', padding:'1px', border:'1px solid #2222ff', borderRadius:'3px', cursor:'pointer'}).hover(function () {this.style.color = 'red';},function () {this.style.color = 'black';});
    $("img",container).css({margin:'1px', padding:'1px', border:'0px', borderRadius:'3px', cursor:'pointer'});

    $("table.list tr:gt(0):has(:checkbox)").each(function(){
      var unit_id = /(\d+)/.exec($('td:eq(2)>a',this).attr('href'))[0];
      if (shop_price[unit_id] == today) {
	      var container = $("td:eq(2)", this);
        container.append($('<img id="' + unit_id + '" border="0" align="middle" style="margin-right: 1px" title="отменить фиксацию цен" src="/img/smallX.gif">').click(function(){
          delete shop_price[unit_id];
          window.localStorage.setItem( 'shop_price',  JSON.stringify( shop_price ) );
          $('#' + unit_id).remove();
        }));
      }
      var workCell = this;
   	  var objSalary2 = $("td:eq(6)>span:first", this);
	    var aaa=parseFloat(objSalary2.text());
	    var color=aaa>89?"blue":'rgb(150,170,10)';
	    color=aaa<81?'rgb(111,165,55)':color;
	    color=aaa<80?'red':color;
	    var font=aaa>81?"bold":'';
	    objSalary2.css({'color':color,'fontWeight':font,'fontSize':'9px'});
	  var container = $("td:eq(7)", this);
      container.append($("<br><span title='Среднегородская зарплата'>100%</span>").click(function(){setSalary(workCell,"100%");}));
	  container.append($("<span title='Согласно требуемой квалификации'>1:1</span>").click(function(){setSalary(workCell,"1:1");}));
      var length = $('div.sizebar',this).prop('title');
	    if(length){length=length.slice(-1);}else length=0;
      if( length === 0 || length == 4){
        container.append($("<img>").attr({src: "/img/reward/16/diploma.gif", title:'Обучить весь персонал 4 недели'}).css({position:'relative', top:'5px',margin:'0px', paddingLeft:'2px', paddingRight:'2px', cursor:'pointer', border:'0px', borderRadius:'3px'}).click(function(e){
          if (window.event) e = window.event;
          var srcEl = e.srcElement? e.srcElement : e.target;
          setEducation(workCell, srcEl);
        }));
      }
      if(length == 4) $("img", container).css({border:'1px solid red'}).attr({title:'Отменить обучение'});
      $("span",container).css({fontSize:'75%',margin:'1px', padding:'1px', border:'1px solid #2222ff', borderRadius:'3px', cursor:'pointer'}).hover(function () {this.style.color = 'red';},function () {this.style.color = 'black';});
    });

    // Добавить фильтр поставок
    var sup = false;
    $('table.list>tbody>tr:eq(0) th:contains("Персонал")').attr('colspan',7);
    $('table.list>tbody>tr:eq(0)').append($('<th>Пост.</th>').click(function(){
      sup = ~sup;
      $('table.list>tbody>tr:gt(2):not([id*="steward"]):not(:last)>td [class="lock"]').parents('tr').each(function(){$(this).css('display',sup?'none':'table-row');});
    }));

    // Добавить фильтр по наличию сотрудников
    var pers = false;
    $('table.list>tbody>tr:eq(1) th:contains("количество")').click(function(){
      pers = ~pers;
      $('table.list>tbody>tr:gt(2):not([id*="steward"]):not(:last)').each(function(){
        var cl=$('td:eq(2)',this).attr('class');
        if ($('td:eq(4)>input',this).val()==$('td:eq(5)>input',this).val()||cl=="u-c i-shop"||cl=="u-c i-office") $(this).css('display',pers?'none':'table-row');
      });
    });

    // Добавить покупку технологий
    $('table.list>tbody>tr:eq(0) th:contains("Техн.")').replaceWith('<th><span title="Покупка технологий">Техн.</span></th>');
    $('table.list>tbody>tr:eq(0) th:contains("Техн.") span')
       .css({fontSize:'75%',margin:'1px', padding:'1px', border:'1px solid #2222ff', borderRadius:'3px', cursor:'pointer'}).hover(function () {this.style.color = 'red';},function () {this.style.color = 'black';})
       .click(function(){ImplementTechAll();});

    var m_block = $('<td width="235"><fieldset style="height: 90px;"><legend>"Управление"</legend>'+
                '<table><tbody>'+
                    '<tr>'+ // Квала
                      '<td height="10" title="автоматический расчет ЗП">Qvl</td>'+
                      '<td><input type="radio" value="" name="qualification">X</td>'+
                      '<td><input type="radio" checked="true" value="1:1" name="qualification">1:1</td>'+
                      '<td><input type="radio" value="100%" name="qualification">100%</td>'+
                   '</tr>'+
                   '<tr>'+
                      '<td height="10" title="автоматический расчет поставок на предприятия, в магазинах, ресторанах и медцентрах">Sup</td>'+
                      '<td><input type="radio" value="" name="supply">X</td>'+
                      '<td><input type="radio" value="1:1" name="supply">1:1</td>'+
                      '<td><input type="radio" checked="true" value="x1" name="supply">x1</td>'+
                   '</tr>'+
                   '<tr>'+
//                    '<td><input type="checkbox" value="X" name="setPrice" id="setPrice" title="автоматически перечистать цены в магазинах, ресторанах и сервисных предприятиях">Цены</td>'+
                      '<td>'+
                         '<table><tbody>'+
                            '<tr>'+
                            '<td><input type="checkbox" value="X" name="setPrice" id="setPrice" title="автоматически перечистать цены в магазинах, ресторанах и сервисных предприятиях">Цены</td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="checkbox" value="X" name="showInfo" id="showInfo" title="Показывать информацию по ценам в электростанциях">Info</td>'+
                            '</tr>'+
                         '</tbody></table>'+
                      '</td>'+
                      '<td colspan="2" align="center"><input type="button" id="btn_calc" value="Расчет"></td>'+
                      '<td>'+
                         '<table><tbody>'+
                            '<tr>'+
                               '<td><input type="checkbox" value="X" name="recalcSalary" id="recalcSalary" title="При установке ЗП пересчитываются ВСЕ предприятия">reQvl</td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="checkbox" value="X" name="recalcPrice" id="recalcPrice" title="При авто установке цен, цены в магазинах будут пересчитаны для ВСЕХ позиций">rePrice</td>'+
                            '</tr>'+
                         '</tbody></table>'+
                      '</td>'+
                    '</tr>'+
                   '</tbody></table>'+
               '</fieldset></td>');

    $('legend:contains("Управление персоналом выбранных подразделений")').parent().parent().after(m_block);
    $('#btn_calc').click(function(){setAll();});

//кнопки управления закупкой
//var tstyle = $('form[name="unitsEmployee"] tbody:eq(0) fieldset');
//$(tstyle[0]).attr('style',$(tstyle[0]).attr('style')+'width: 500px;');
//$(tstyle[1]).attr('style',$(tstyle[1]).attr('style')+'width: 205px;');
//var pos = $(tstyle[2]).find('tr:eq(0)');
//pos.append($('<input class="button130" type="button" value="Обнулить закупки" name="zero_supply">').click(function(){zero_supply('http://virtonomica.ru/vera/main_light/management_units/employee/zero')}));
//pos.next().append($('<input class="button130" type="button" value="Отменить закупки" name="zero_supply">').click(function(){zero_supply('http://virtonomica.ru/vera/main_light/management_units/employee/cancel')}));


    var pages = [[10,10],[25,25],[50,200],[100,400],[200,800],[400,max_salary]];
    paging(pages);
  }// end of start_employee()

    switch (type) {
        case 'unit_list': start_main(); break;
        case 'repair': start_repair(); break;
        case 'employee': start_employee(); break;
    }
}; // end of run()

var handlers = [
    {regex: /main\/company\/view\/(\d+)\/unit_list$/, handler: 'unit_list'},
    {regex: /main\/company\/view\/(\d+)\/unit_list\/equipment$/, handler: 'repair'},
    {regex: /main\/company\/view\/(\d+)\/unit_list\/employee$/, handler: 'employee'},
];

for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].regex.test(location.href)) {

        // Хак, что бы получить полноценный доступ к DOM >:]
        var script = document.createElement("script");
        script.textContent = '(' + run.toString() + ')("' + handlers[i].handler + '");';
        document.getElementsByTagName("head")[0].appendChild(script);
        break;
    }
}
