// ==UserScript==
// @name        salary&supply public
// @namespace   virtonomica
// @description    На странице управления персоналом
// @description    Облегчает установку зарплат 100% (среднегородская), 1:1 (по требуемой квалификации)
// @description    Облегчает установку обучения
// @description    Сортировка по квалификации: меньше треб., больше треб., равна требуемой.
// @description    Сортировка по зарплате: <100%, >=100%, >=150%
// @description    на основе скрипта Crocuta http://userscripts.org/scripts/show/174468
// @version        1.34
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22097/salarysupply%20public.user.js
// @updateURL https://update.greasyfork.org/scripts/22097/salarysupply%20public.meta.js
// ==/UserScript==


var run = function(type) {

  //globals
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  var arr_envd={"Алмазы":100,"Бокситы":100,"Глина":100,"Древесина":30,"Железная руда":100,"Золото":100,"Кремний":100,"Марганец":100,"Медный колчедан":100,"Нефть":100,"Полиметаллическая руда":100,"Природные минералы":100,"Титановая руда":100,"Уголь":100,"Хром":100,"LED":20,"Авиадвигатель":10,"Авиашасси":10,"Авионика":10,"Автозапчасти":20,"Алюминий":20,"Бумага":5,"Двигатель":15,"Зеркальный лист":20,"Интерьер самолета":10,"Кожа":5,"Комплектующие":20,"Корпус яхты":15,"Косметическое масло":20,"Краска":5,"Литий":10,"Литий-ионный аккумулятор":15,"Медь":20,"Микропроцессор":20,"Натуральные лекарственные компоненты":20,"Оснащение яхты":15,"Отходы хлопчатника":10,"Парфюмерная эссенция":20,"Пластмасса":10,"Резина":10,"Рыболовная сеть":10,"Сверхлёгкий алюминиевый сплав":20,"Светочувствительная матрица":20,"Секция фюзеляжа":10,"Синтетическая ткань":5,"Синтетические лекарственные компоненты":20,"Сталь":10,"Стекло":20,"Термопластик":10,"Термоэлемент":15,"Титан":20,"Ткань":20,"Углепластик":10,"Химикаты":20,"Хлопковая ткань":20,"Хлопковое волокно":10,"Цинк":10,"Шерсть":20,"Электронные компоненты":20,"Электропривод":15,"Элементы авиакрыла":10,"Элементы авиаоперения":10,"Этанол":20,"Апельсин":5,"Воск":10,"Вощина":10,"Зерно":10,"Какао":10,"Картофель":10,"Комбикорм":10,"Кормовые культуры":10,"Кофе":10,"Кукуруза":5,"Маточное молочко":20,"Молоко":15,"Мясо":20,"Мёд":10,"Оливки":10,"Подсолнечник":15,"Помидоры":5,"Рыбная мука":10,"Сахар":10,"Соя":10,"Табак":5,"Фрукты":5,"Хлопок":10,"Цветы и эфиромасличные культуры":5,"Чайный лист":5,"Яйца":15,"Бурбон":10,"Джем":10,"Зеленый чай":10,"Зефир":15,"Кисель":10,"Колбасные изделия":15,"Кондитерские изделия":15,"Консервированная кукуруза":15,"Консервированные оливки":15,"Консервы":15,"Конфеты":10,"Красная икра":20,"Кукурузная мука":10,"Кукурузные хлопья":5,"Ликер":10,"Макаронные изделия":5,"Масло":10,"Мисо-суп":5,"Молочные продукты":10,"Мороженое":15,"Мука":10,"Натуральный кофе":20,"Оливковое масло":20,"Печень трески":15,"Пиво":10,"Продукты быстрого приготовления":5,"Прохладительные напитки":10,"Пуэр":50,"Растворимый кофе":5,"Рыбные деликатесы":20,"Рыбные консервы":15,"Соевый соус":15,"Сок":10,"Соусы":5,"Специи":5,"Спиртные напитки":10,"Суфле":15,"Сыр":10,"Сыр фета":10,"Тофу":10,"Фри":10,"Фруктовый чай":10,"Хлеб":10,"Черная икра":50,"Черный чай":10,"Чипсы":5,"Шоколад":10,"Энергетические напитки":10,"GPS-навигаторы":20,"LED-телевизоры":50,"USB-флэш-накопитель":20,"Автомобиль":100,"Автомобильное сиденье":15,"Автомобильные багажники":20,"Автомобильные диски":20,"Автосигнализация":20,"Антифриз":20,"Аудиотехника":50,"Бейсболка":20,"Бижутерия":20,"Бриллианты":30,"Бронзовый декор":30,"Бытовая химия":20,"Велосипед":20,"Верхняя одежда":20,"Внедорожник":100,"Водный скутер":30,"Газонокосилка":20,"Гироскутер":15,"Гриль для дачи":20,"Деловая одежда":20,"Детская коляска":20,"Детская кроватка":5,"Детское питание":15,"Джинсы":20,"Душевые кабинки":5,"Жемчужные украшения":50,"Заварочный чайник":20,"Зеркало":20,"Зонт":20,"Игровые консоли":50,"Игрушки":20,"Канцтовары":20,"Керамическая посуда":20,"Книги":15,"Кованая садовая мебель":30,"Ковер":20,"Кожгалантерея":20,"Коммерческий автомобиль":100,"Компьютер":30,"Компьютерные аксессуары":20,"Кондиционер":50,"Консервированный корм для животных":15,"Конструктор":20,"Косметика":15,"Кофе-машина":50,"Кузовные запчасти":20,"Кухонная мебель":20,"Кухонные плиты":50,"Мебель":20,"Мобильный телефон":20,"Моторное масло":20,"Мотоцикл":30,"Нижнее белье":20,"Носки":10,"Ноутбук":30,"Обувь":20,"Одежда":20,"Одежда для малышей":20,"Одеяло":20,"Омыватель стекол":20,"Офисная мебель":20,"Офисное кресло":20,"Парфюмерия":20,"Планшет":30,"Подарки и Сувениры":20,"Подгузники":10,"Полотенце":20,"Пончо":20,"Посуда":20,"Посудомоечные машины":50,"Пресса":15,"Принтер":30,"Пылесос":50,"Радионяня":10,"Развивающие игрушки":20,"Садовый декор":20,"Садовый инвентарь":20,"Сантехника":20,"Сапоги":20,"Светильник":20,"Светодиодная лампа":15,"Седан":100,"Сигареты":20,"Сигары":10,"Сковородки":20,"Смартфон":20,"Снюс":20,"Сомбреро":20,"Спальная мебель":20,"Спорт-кар":100,"Спортинвентарь":20,"Стиральные машины":50,"Столовое и постельное бельё":20,"Сумки и портфели":20,"Сухой корм для животных":15,"Телевизоры":50,"Товары для творчества":20,"Тренажер":20,"Утюг":20,"Фен":20,"Фольктдрект":20,"Фототехника":20,"Холодильники":50,"Цифровая видеокамера":20,"Цифровой фотоаппарат":20,"Чайник":20,"Часы":30,"Чистящие средства":20,"Шины":20,"Электроинструмент":20,"Электромобиль":100,"Элемент питания":15,"Ювелирные украшения":50,"Витамины":20,"Гормональные препараты":10,"Косметические маски":20,"Лекарственные травы":20,"Медицинский антисептик":10,"Медицинский инструментарий":20,"Никотиновый пластырь":15,"Природные лекарства":20,"Рыбий жир":20,"Синтетические лекарства":10,"Спортивное питание":10,"Средства гигиены":20,"Электронный тонометр":20,"IT-оборудование":30,"Автозаправочное оборудование":30,"Авторемонтное оборудование":30,"Гелиостат":30,"Горно-шахтное оборудование":30,"Интерьер дошкольных учреждений":30,"Коммуникационное оборудование":30,"Мазутный энергоблок":30,"Медицинское оборудование":30,"Мусороприёмное оборудование":30,"Мусоросжигательный энергоблок":30,"Парикмахерское оборудование":30,"Паровая турбина":30,"Паровой котёл":30,"Пилорама":30,"Прибор":30,"Ресторанное оборудование":30,"Рыболовецкий траулер":30,"Серверная платформа":30,"Система очистки дымовых газов":30,"Солнечный энергоблок":30,"Станок":30,"Теплообменное оборудование":30,"Топливное оборудование":30,"Топливораздаточная колонка":30,"Трактор":30,"Угольная мельница":30,"Угольный энергоблок":30,"Узкофюзеляжный самолет":10,"Жемчуг":100,"Крабы":20,"Лосось":20,"Осетр":10,"Промысловая рыба":20,"Треска":20,"Устрицы":20,"Домашняя птица":20,"Коровы":20,"Овцы":20,"Пчёлы":20,"Свиньи":20,"Арт декор":30,"Интерьер яхты":100,"Шагрень":15,"Яхта":100,"Бензин Нормаль-80":100,"Бензин Премиум-95":100,"Бензин Регуляр-92":100,"Биодизель":100,"Дизельное топливо":100,"Мазут":100};
  var realm = readCookie('last_realm');

  var today = $('#server-time').next().text();
  var shop_price = JSON.parse( window.localStorage.getItem('shop_price') );
  if (shop_price == null) shop_price =new Object();

// utils

  function f2(val) {return parseFloat(Math.floor(val *100)/100);} // "округляем" до 2х знаков

  function paging(pages){
    // добавить пагинацию
    $('.pager_options > .selected').removeClass('selected').text('').append($('.pager_options a:eq(0)').parent().html());
    var links = $('.pager_options a');
    var cookieName = /^\/\w+\/main\/company\/view\/\d+\/unit_list$/.test(location.pathname) ? 'mainUPP' : 'UPP';
    var upp = readCookie(cookieName);
    if (upp == null) {upp = 50;}
    links.each(function (i) {
      var a = $(this);
      a.attr('href', a.attr('href').replace(pages[i][0], pages[i][1]));
      a.text(pages[i][1]);
    });
  } //end of paging

    function APIgetSummary(href,refresh){ //считать данныепо предприятию через API
        var reg = new RegExp('(\\S+\\/)('+realm+')\\/.+?(\\d+)');
        var re = reg.exec(href);
        var id = RegExp.$3;
        var apiSummaryUrl = RegExp.$1 + 'api/%realm%/main/unit/summary'.replace('%realm%',RegExp.$2);
        var apiToken = RegExp.$1 + 'api/%realm%/main/token'.replace('%realm%',RegExp.$2);
        var apiRefresh = RegExp.$1 + 'api/%realm%/main/unit/refresh'.replace('%realm%',RegExp.$2);

        if (refresh){
            var token;
            $.ajax({
                type:'GET',
                async:false,
                url:apiToken,
                success:function(data){token = data;}
            });

            $.ajax({ // сброс кэша
                type:'POST',
                async:false,
                url:apiRefresh,
                data:{id:id,token:token}
            })
        };
        var summary = {};
        $.ajax({
            url: apiSummaryUrl,
            dataType: 'json',
            async: false,
            data: {id:id},
            success: function(data){summary = data;}
        })
        return summary;
    }

  function wall(title,total){
    typeof(total) != 'undefined' ? total = '/'+total : total = 'анализ';
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

  function setPriceENVD(workCell,action){
    var UnitType = $('td:eq(2)',workCell).attr('class');
    var UnitHref = $('td:eq(2)>a',workCell).attr('href');
    switch(UnitType){
      case "u-c i-service_light":UnitType="services_light";break;
      case "u-c i-restaurant":UnitType="services";break;
      case "u-c i-medicine":UnitType="services";break;
      case "u-c i-shop":UnitType="shop";break;  //магазин
      case "u-c i-power":UnitType="i-power";break;  //электростанция
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
              var sbst=$('td.nowrap td:contains("Себестоимость")',this).next().prop('textContent').replace(/[^\d\.]/g,'');
              var newPrice = (sbst*(1+arr_envd[altt]/100)).toFixed(2);
              var price = parseFloat($('.money:eq(0)',this).val().replace(/[^\d\.]/g,'')).toFixed(2);
              if (price != newPrice && newPrice > 0) {$('.money:eq(0)',this).prop("value",newPrice);setPrice=true;}
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
    if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

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
              if (sell < buy || recalcPrice=='X') {var newPrice = 1.02*buy;$(this).val(f2(newPrice));setPrice=true;} // продавать надо дороже, чем купили
              else {
//                if (good == 'Автомобиль') {var newPrice = 1.02*buy;$(this).val(newPrice);setPrice=true;} // продаем по себестоимости

                // остальное исходя из доли рынка
                if (share > 50) {var newPrice = Math.max(sell*1.10,sell+1.00);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 50% поднимаем цену, шаг 10% или 100с
                else if (share > 20) {var newPrice = Math.max(sell*1.05,sell+0.10);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 10% поднимаем цену, шаг 5% или 10с
                else if (share > 10 ) {var newPrice = Math.max(sell*1.01,sell+0.01);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка больше 3% поднимаем цену, шаг 1% или 1с
                else if (share < 5 && last_lot != warehouse) {var newPrice = Math.max(Math.min(sell*0.95,sell-0.01),buy+0.01);$(this).val(f2(newPrice));setPrice=true;} // если доля рынка близка к нулю опускаем цену, шаг 1% или 1с. Не ниже чем сс
              }
            }
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
  }//end function setPriceENVD

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
            case "u-c i-fuel":UnitType="shop";break; //Заправка
            case "u-c i-educational":UnitType="services";break;
        }

        if (!((UnitType == 'production')||(UnitType == 'animalfarm')||(UnitType == 'shop')||(UnitType == 'services'))) return false;
        $.ajax({
            type:"GET",
            async: false,
            url:UnitHref+'/supply',
            success:function(data){
                var severity = 0; // ошибки
                var postData = ''; //формируем post-строку
                var field = '';
                var max_pos = 0;
                switch (UnitType){
                    case 'services': // посещаемость сервисных предприятий
                        var summary = APIgetSummary(UnitHref,true);
                        if (summary.equipment_count === 0 || summary.employee_count === 0) return;
                        var k_max = summary.equipment_count / summary.equipment_max * Math.min(summary.employee_required_by_equipment,summary.employee_count) / summary.employee_required_by_equipment;
                        k_max = isNaN(k_max)?1:k_max;
                        var pos = '';
                        $.ajax({
                            type:"GET",
                            async: false,
                            url:UnitHref,
                            success:function(data){pos = $("td.title:contains('Количество посетителей')",data).next().text().replace(/\s+/g,'').match(/\d+/g);}
                        });
                        max_pos = (pos[1]*k_max);
                        max_pos = isNaN(max_pos)?summary.employee_count:max_pos;
                        field = 'Расход';
                        break;
                    case 'shop': // в торговой точке
                        field = 'Продано';
                        break;
                    default:
                        field = 'Требуется';
                        break;
                }
                $("tr[id^='product_row']",data).each( function() { // Требуется
                    var sales = parseInt ( $('tr:contains("'+field+'"):last', this).text().replace(/\D+/g,'') );
                    var warehouse = parseInt ( $('tr:contains("Количество"):last', this).text().replace(/\D+/g,'') );
                    var purchase = parseInt ( $('tr:contains("Закупка"):last', this).text().replace(/\D+/g,'') );
                    var material = $("th [alt]",this).attr("alt");
                    var max_sales = 0;
                    switch (UnitType){
                        case 'services':
                            var sales_per_pos = parseInt ( $('tr:contains("Расх. на клиента"):last', this).text().replace(/\D+/g,'') );
                            max_sales = sales_per_pos * max_pos;
                            break;
                        case 'shop':
                            max_sales = parseInt( (sales<10?10:sales) * 1.25 );break; // максимальный расход в ход. если оборот маленький, то закупка 10ед
                       default:
                            max_sales = parseInt( sales );break; // максимальный расход в ход
                    }
                    if ((UnitType == 'animalfarm')&&(sales > warehouse)) severity=2; // если остатков не хватает для питания
                    var max_available = 0; // доступный остаток для заказа
                    var limit = 0;
                    var suppliers = 0;
                    var order = 0;
                    var good = $(this);
                    var good_id = /\d+-?\d+/.exec(good.attr('id'))[0];
                    var good_id_ = good_id;
                    do{
                        if ($('td:last',this).text()=='Выбрать поставщика') break; //поставщики отсутствуют
                        max_available = $('tr:contains("Свободно"):last', good).text().replace(/\D+/g,'');
                        max_available = parseInt ( (max_available=='')?999999999999:max_available ); //Неогр. = 99999...
                        limit = parseInt($('td[id^="quantityField"] input[name^="supplyContractData"]', good).next().next().text().replace(/\D+/g,''));
                        limit = isNaN(limit)?999999999999:limit; // если лимита поставки нет, то лимит = 99999...
                        max_available = Math.min(max_available,limit);
                        // определим сколько закупается сейчас
                        order = order + Math.min(max_available,parseInt ( $('td[id^="quantityField"] input[name^="supplyContractData"]', good).val() ));
                        ++suppliers;
                        good = $(good).next();
                        good_id_ = /\d+-?\d+/.exec(good.attr('id'));
                        good_id_ = (good_id_ === null)?-1:good_id_[0];
                    }while (good_id_ == good_id);
                    if (suppliers != 1) { //поставщиков нет или несколько
                        if ((max_sales + sales > warehouse + order)||(suppliers == 0)) severity = 2; //если не достаточно товара, поставим ссылку
                        return; // let's check next material
                    }
                    var OrderQuantity=0;
//                    console.log(material+': sales='+sales+', warehouse='+warehouse+', purchase='+purchase+', order='+order+', max_sales='+max_sales);
                    switch(action){
                        case 'x1': //поставка с учетом остатков на один день x1
                            if (UnitType=='shop' || UnitType=='services') {
                                if (warehouse <= purchase * 1.02) sales = Math.max(sales,purchase,order); //если все распродали, то требуется закупить не меньше, чем заказывали ранее
                            }
                            OrderQuantity = Math.max(max_sales + sales - warehouse,0); // Закупка с учетом остатков на складе
                            OrderQuantity = Math.min(OrderQuantity,max_sales); // Закупка не больше, чем может понадобиться
                            break;
                        case '1:1': //поставка по требованию 1:1
                            OrderQuantity = max_sales;
                            break;
                    }
                    if (OrderQuantity > max_available) severity=1; // если остатков не хватает для поставки
                    if (OrderQuantity != order){ // меняем данные, если они изменились
                        var lVal='';
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
                switch(severity){
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
                            if (severity > 0) $('td:eq(11)',workCell).attr('class','highLight');
                        }
                    });
                }
                else if(severity > 0) {$('td:eq(11)',workCell).attr('class','nowrap').empty().append(obj1);$('td:eq(11)',workCell).attr('class','highLight');}
            }
        });
  } // End of function SetSupply()

  function setAll(){
   var qualification=$('input[name="qualification"]:checked').val();
   var supply=$('input[name="supply"]:checked').val();
   var setPrice=$('input[name="setPrice"]:checked').val()=="X"?"X":"";
   var arr = new Array();
   arr.length=0;
   $('table.list>tbody>tr>th:eq(0)>input').attr('checked',false); //uncheck group flag
   $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
     $(this).attr('checked',false); //uncheck
     var objCell = $(this).parent().parent();
     arr[arr.length] = objCell;
   })
   if(supply!="")          doit(arr,supply,' (setSuply'+supply+')',function(objCell,action){setSuply(objCell,action);});
   if(setPrice!="")        doit(arr,'',' (setPrice)',function(objCell,action){setPriceENVD(objCell,action);});
   return false;
  } //end of setAll()

    // Добавить кнопку фиксс. цен для магазина
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
    });

    // Добавить фильтр поставок
    var sup = false;
    $('table.list>tbody>tr:eq(0) th:contains("Персонал")').attr('colspan',7);
    $('table.list>tbody>tr:eq(0)').append($('<th>Пост.</th>').click(function(){
      sup = ~sup;
      $('table.list>tbody>tr:gt(2):not([id*="steward"]):not(:last)>td [class="lock"]').parent().parent().parent().each(function(){sup?$(this).css('display','none'):$(this).css('display','table-row')});
    }));

    var m_block = $('<td width="235" id="id_unitsManage"><fieldset style="height: 110px;"><legend>"Управление"</legend>'
                +'<table><tbody>'
                   +'<tr>'
                      +'<td height="10" title="автоматический расчет поставок на предприятия, в магазинах, ресторанах и медцентрах">Sup</td>'
                      +'<td><input type="radio" value="" name="supply">X</td>'
                      +'<td><input type="radio" value="1:1" name="supply">1:1</td>'
                      +'<td><input type="radio" checked="true" value="x1" name="supply">x1</td>'
                    +'</tr>'
                   +'<tr>'
                      +'<td>'
                         +'<table><tbody>'
                            +'<tr>'
                               +'<td><input type="checkbox" value="X" name="setPrice" id="setPrice" title="автоматически перечистать цены в магазинах, ресторанах и сервисных предприятиях">Цены</td>'
                            +'</tr>'
                            +'<tr>'
                               +'<td><input type="checkbox" value="X" name="recalcPrice" id="recalcPrice" title="При авто установке цен, цены в магазинах будут пересчитаны для ВСЕХ позиций">rePrice</td>'
                            +'</tr>'
                            +'<tr>'
                               +'<td></td>'
                            +'</tr>'
                         +'</tbody></table>'
                      +'</td>'
                      +'<td colspan="2" align="center"><input type="button" id="btn_calc" value="Расчет"></td>'
                    +'</tr>'
                   +'</tbody></table>'
               +'</fieldset></td>');

    $('legend:contains("Управление персоналом выбранных подразделений")').parent().parent().after(m_block);
    $('#btn_calc').click(function(){setAll();});

    var pages = [[10,10],[25,25],[50,200],[100,400],[200,800],[400,1000]];
    paging(pages);
} // end of run()

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);