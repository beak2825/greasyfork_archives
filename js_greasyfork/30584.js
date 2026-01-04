// ==UserScript==
// @name        prod-use-stock-Helper
// @namespace   virtonomica
// @version     0.33
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_storages
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_consume
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_produce
// @include        http*://*virtonomic*.*/*/main/company/view/*/marketing_report/shops*
// @author  chippa
// @description wooah!
// @downloadURL https://update.greasyfork.org/scripts/30584/prod-use-stock-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30584/prod-use-stock-Helper.meta.js
// ==/UserScript==
var run = function () {
    //  alert('dfdfg');
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    function ToStorage(name, val)
    {
        try {
            window.localStorage.setItem(name, JSON.stringify(val));
        } catch (e) {
            out = 'Ошибка добавления в локальное хранилище';
            console.log(out);
        }
    }
    if ($('#media_managment').length) {
        exit;
    };
    var Products =[
        {id : '370077', catid : '1538', symbol : 'autoparts', name : "Автозапчасти"},
        {id : '1509', catid : '1538', symbol : 'car', name : "Автомобиль"},
        {id : '422717', catid : '1538', symbol : 'roof_rack', name : "Автомобильные багажники"},
        {id : '422716', catid : '1538', symbol : 'rims', name : "Автомобильные диски"},
        {id : '423161', catid : '1538', symbol : 'alarm', name : "Автосигнализация"},
        {id : '422549', catid : '1538', symbol : 'antifreeze', name : "Антифриз"},
        {id : '370080', catid : '1538', symbol : 'car_suv', name : "Внедорожник"},
        {id : '15338', catid : '1538', symbol : 'scooter', name : "Водный скутер"},
        {id : '424207', catid : '1538', symbol : 'cargovan2', name : "Коммерческий автомобиль"},
        {id : '422718', catid : '1538', symbol : 'car_doors', name : "Кузовные запчасти"},
        {id : '370078', catid : '1538', symbol : 'engineoil', name : "Моторное масло"},
        {id : '1518', catid : '1538', symbol : 'motorcycle', name : "Мотоцикл"},
        {id : '422550', catid : '1538', symbol : 'screenwash', name : "Омыватель стекол"},
        {id : '370079', catid : '1538', symbol : 'car_sedan', name : "Седан"},
        {id : '424346', catid : '1538', symbol : 'moped', name : "Скутер"},
        {id : '370081', catid : '1538', symbol : 'car_sport', name : "Спорт-кар"},
        {id : '1525', catid : '1538', symbol : 'tyre', name : "Шины"},
        {id : '423276', catid : '1538', symbol : 'ecar', name : "Электромобиль"},
        {id : '423950', catid : '359854', symbol : 'vitamins', name : "Витамины"},
        {id : '359859', catid : '359854', symbol : 'hormonal', name : "Гормональные препараты"},
        {id : '424508', catid : '359854', symbol : 'pearlcream', name : "Жемчужный крем"},
        {id : '423160', catid : '359854', symbol : 'cosm_masks', name : "Косметические маски"},
        {id : '359862', catid : '359854', symbol : 'herbs', name : "Лекарственные травы"},
        {id : '423153', catid : '359854', symbol : 'rjelly', name : "Маточное молочко"},
        {id : '424628', catid : '359854', symbol : 'medmask', name : "Медицинские маски"},
        {id : '422552', catid : '359854', symbol : 'antiseptic', name : "Медицинский антисептик"},
        {id : '359856', catid : '359854', symbol : 'thermometer', name : "Медицинский инструментарий"},
        {id : '422199', catid : '359854', symbol : 'antismok', name : "Никотиновый пластырь"},
        {id : '359861', catid : '359854', symbol : 'mixture', name : "Природные лекарства"},
        {id : '423483', catid : '359854', symbol : 'codliveroil', name : "Рыбий жир"},
        {id : '359860', catid : '359854', symbol : 'tablets', name : "Синтетические лекарства"},
        {id : '15336', catid : '359854', symbol : 'sportfood', name : "Спортивное питание"},
        {id : '359863', catid : '359854', symbol : 'hygiene', name : "Средства гигиены"},
        {id : '422433', catid : '359854', symbol : 'pulsimeter', name : "Электронный тонометр"},
        {id : '422547', catid : '1532', symbol : 'bourbon', name : "Бурбон"},
        {id : '422434', catid : '1532', symbol : 'jam', name : "Джем"},
        {id : '423115', catid : '1532', symbol : 'g_tea', name : "Зеленый чай"},
        {id : '423388', catid : '1532', symbol : 'kissel', name : "Кисель"},
        {id : '3865', catid : '1532', symbol : 'sweet', name : "Конфеты"},
        {id : '335179', catid : '1532', symbol : 'redcaviar', name : "Красная икра"},
        {id : '380000', catid : '1532', symbol : 'liqueur', name : "Ликер"},
        {id : '423151', catid : '1532', symbol : 'honey', name : "Мёд"},
        {id : '380005', catid : '1532', symbol : 'roastedcoffee', name : "Натуральный кофе"},
        {id : '1502', catid : '1532', symbol : 'beer', name : "Пиво"},
        {id : '1522', catid : '1532', symbol : 'press', name : "Пресса"},
        {id : '1503', catid : '1532', symbol : 'gaswater', name : "Прохладительные напитки"},
        {id : '423116', catid : '1532', symbol : 'puer_tea', name : "Пуэр"},
        {id : '380006', catid : '1532', symbol : 'instantcoffee', name : "Растворимый кофе"},
        {id : '335178', catid : '1532', symbol : 'fishdeli', name : "Рыбные деликатесы"},
        {id : '422197', catid : '1532', symbol : 'cigarette', name : "Сигареты"},
        {id : '422198', catid : '1532', symbol : 'cigar', name : "Сигары"},
        {id : '424205', catid : '1532', symbol : 'snus', name : "Снюс"},
        {id : '423861', catid : '1532', symbol : 'soysauce', name : "Соевый соус"},
        {id : '1504', catid : '1532', symbol : 'juice', name : "Сок"},
        {id : '401966', catid : '1532', symbol : 'soybean', name : "Соя"},
        {id : '1505', catid : '1532', symbol : 'alcohol', name : "Спиртные напитки"},
        {id : '423117', catid : '1532', symbol : 'f_tea', name : "Фруктовый чай"},
        {id : '359847', catid : '1532', symbol : 'flower', name : "Цветы и эфиромасличные культуры"},
        {id : '335180', catid : '1532', symbol : 'caviar', name : "Черная икра"},
        {id : '401968', catid : '1532', symbol : 'b_tea', name : "Черный чай"},
        {id : '15748', catid : '1532', symbol : 'chips', name : "Чипсы"},
        {id : '423040', catid : '1532', symbol : 'shagreen', name : "Шагрень"},
        {id : '1507', catid : '1532', symbol : 'chocolate', name : "Шоколад"},
        {id : '380007', catid : '1532', symbol : 'energydrinks', name : "Энергетические напитки"},
        {id : '423625', catid : '423621', symbol : 'babycarseat', name : "Автомобильное сиденье"},
        {id : '423622', catid : '423621', symbol : 'babycarr', name : "Детская коляска"},
        {id : '423623', catid : '423621', symbol : 'crib', name : "Детская кроватка"},
        {id : '423624', catid : '423621', symbol : 'babyfood', name : "Детское питание"},
        {id : '423890', catid : '423621', symbol : 'lego', name : "Конструктор"},
        {id : '423628', catid : '423621', symbol : 'crawlers', name : "Одежда для малышей"},
        {id : '423627', catid : '423621', symbol : 'diapers', name : "Подгузники"},
        {id : '423626', catid : '423621', symbol : 'babymonitor', name : "Радионяня"},
        {id : '423629', catid : '423621', symbol : 'educationaltoys', name : "Развивающие игрушки"},
        {id : '423722', catid : '423621', symbol : 'hobby', name : "Товары для творчества"},
        {id : '15334', catid : '1533', symbol : 'cap', name : "Бейсболка"},
        {id : '424629', catid : '1533', symbol : 'burgunder', name : "Бургундер"},
        {id : '301320', catid : '1533', symbol : 'coat', name : "Верхняя одежда"},
        {id : '422204', catid : '1533', symbol : 'suit', name : "Деловая одежда"},
        {id : '422203', catid : '1533', symbol : 'jeans', name : "Джинсы"},
        {id : '16010', catid : '1533', symbol : 'umbrella', name : "Зонт"},
        {id : '424509', catid : '1533', symbol : 'it_dress', name : "Итальянское платье"},
        {id : '301318', catid : '1533', symbol : 'leather_goods', name : "Кожгалантерея"},
        {id : '312798', catid : '1533', symbol : 'underwear', name : "Нижнее белье"},
        {id : '422437', catid : '1533', symbol : 'socks', name : "Носки"},
        {id : '1519', catid : '1533', symbol : 'shoes', name : "Обувь"},
        {id : '1520', catid : '1533', symbol : 'clothes', name : "Одежда"},
        {id : '422650', catid : '1533', symbol : 'poncho', name : "Пончо"},
        {id : '423164', catid : '1533', symbol : 'boots', name : "Сапоги"},
        {id : '422649', catid : '1533', symbol : 'sombrero', name : "Сомбреро"},
        {id : '301319', catid : '1533', symbol : 'bags', name : "Сумки и портфели"},
        {id : '424206', catid : '1533', symbol : 'folkdrakt', name : "Фольктдрект"},
        {id : '17609', catid : '1531', symbol : 'orange', name : "Апельсин"},
        {id : '424630', catid : '1531', symbol : 'waffles', name : "Вафли"},
        {id : '423951', catid : '1531', symbol : 'marshmallows', name : "Зефир"},
        {id : '15742', catid : '1531', symbol : 'potato', name : "Картофель"},
        {id : '1496', catid : '1531', symbol : 'sausages', name : "Колбасные изделия"},
        {id : '1497', catid : '1531', symbol : 'cookies', name : "Кондитерские изделия"},
        {id : '422553', catid : '1531', symbol : 'cannedcorn', name : "Консервированная кукуруза"},
        {id : '422055', catid : '1531', symbol : 'cannedolives', name : "Консервированные оливки"},
        {id : '3869', catid : '1531', symbol : 'can', name : "Консервы"},
        {id : '335181', catid : '1531', symbol : 'crabs', name : "Крабы"},
        {id : '422544', catid : '1531', symbol : 'corn2', name : "Кукуруза"},
        {id : '422545', catid : '1531', symbol : 'cornmeal', name : "Кукурузная мука"},
        {id : '422546', catid : '1531', symbol : 'cornflakes', name : "Кукурузные хлопья"},
        {id : '335176', catid : '1531', symbol : 'salmon', name : "Лосось"},
        {id : '1498', catid : '1531', symbol : 'noodles', name : "Макаронные изделия"},
        {id : '15747', catid : '1531', symbol : 'butter', name : "Масло"},
        {id : '423862', catid : '1531', symbol : 'vegansoy', name : "Мисо-суп"},
        {id : '1489', catid : '1531', symbol : 'milk', name : "Молоко"},
        {id : '1499', catid : '1531', symbol : 'dairyproducts', name : "Молочные продукты"},
        {id : '1500', catid : '1531', symbol : 'icecream', name : "Мороженое"},
        {id : '1501', catid : '1531', symbol : 'flour', name : "Мука"},
        {id : '1490', catid : '1531', symbol : 'meat', name : "Мясо"},
        {id : '422054', catid : '1531', symbol : 'oliveoil', name : "Оливковое масло"},
        {id : '335177', catid : '1531', symbol : 'sturgeon', name : "Осетр"},
        {id : '423482', catid : '1531', symbol : 'codliver', name : "Печень трески"},
        {id : '15744', catid : '1531', symbol : 'sunflower', name : "Подсолнечник"},
        {id : '15743', catid : '1531', symbol : 'tomato', name : "Помидоры"},
        {id : '15749', catid : '1531', symbol : 'instant', name : "Продукты быстрого приготовления"},
        {id : '335174', catid : '1531', symbol : 'fish', name : "Промысловая рыба"},
        {id : '335175', catid : '1531', symbol : 'fishcan', name : "Рыбные консервы"},
        {id : '1491', catid : '1531', symbol : 'sugar', name : "Сахар"},
        {id : '15750', catid : '1531', symbol : 'sauce', name : "Соусы"},
        {id : '16006', catid : '1531', symbol : 'spice', name : "Специи"},
        {id : '423925', catid : '1531', symbol : 'souffle', name : "Суфле"},
        {id : '373201', catid : '1531', symbol : 'cheese', name : "Сыр"},
        {id : '422205', catid : '1531', symbol : 'feta', name : "Сыр фета"},
        {id : '424438', catid : '1531', symbol : 'tpaste', name : "Томатная паста"},
        {id : '423860', catid : '1531', symbol : 'tofu', name : "Тофу"},
        {id : '423481', catid : '1531', symbol : 'codfish', name : "Треска"},
        {id : '380002', catid : '1531', symbol : 'oysters', name : "Устрицы"},
        {id : '423387', catid : '1531', symbol : 'fries', name : "Фри"},
        {id : '1492', catid : '1531', symbol : 'fruits', name : "Фрукты"},
        {id : '1506', catid : '1531', symbol : 'bread', name : "Хлеб"},
        {id : '1494', catid : '1531', symbol : 'eggs', name : "Яйца"},
        {id : '1513', catid : '1534', symbol : 'bicycle', name : "Велосипед"},
        {id : '302897', catid : '1534', symbol : 'grass_cutter', name : "Газонокосилка"},
        {id : '424138', catid : '1534', symbol : 'gyroscooter', name : "Гироскутер"},
        {id : '423744', catid : '1534', symbol : 'grill', name : "Гриль для дачи"},
        {id : '423119', catid : '1534', symbol : 'teapot_sou', name : "Заварочный чайник"},
        {id : '1514', catid : '1534', symbol : 'toys', name : "Игрушки"},
        {id : '423743', catid : '1534', symbol : 'forged', name : "Кованая садовая мебель"},
        {id : '424208', catid : '1534', symbol : 'office_furniture', name : "Офисная мебель"},
        {id : '424209', catid : '1534', symbol : 'office_chair', name : "Офисное кресло"},
        {id : '13708', catid : '1534', symbol : 'gift', name : "Подарки и Сувениры"},
        {id : '422380', catid : '1534', symbol : 'gardengnome', name : "Садовый декор"},
        {id : '422431', catid : '1534', symbol : 'gardentools', name : "Садовый инвентарь"},
        {id : '15335', catid : '1534', symbol : 'football', name : "Спортинвентарь"},
        {id : '1482', catid : '1534', symbol : 'fabric', name : "Ткань"},
        {id : '15337', catid : '1534', symbol : 'trainer', name : "Тренажер"},
        {id : '7093', catid : '1534', symbol : 'iron', name : "Утюг"},
        {id : '7092', catid : '1534', symbol : 'hairdrier', name : "Фен"},
        {id : '1523', catid : '1534', symbol : 'camera', name : "Фототехника"},
        {id : '370075', catid : '1534', symbol : 'pwtools', name : "Электроинструмент"},
        {id : '423742', catid : '1534', symbol : 'battery', name : "Элемент питания"},
        {id : '1511', catid : '1535', symbol : 'householdchemistry', name : "Бытовая химия"},
        {id : '3965', catid : '1535', symbol : 'showercubicle', name : "Душевые кабинки"},
        {id : '7094', catid : '1535', symbol : 'mirror', name : "Зеркало"},
        {id : '424450', catid : '1535', symbol : 'toothpaste', name : "Зубная паста"},
        {id : '3866', catid : '1535', symbol : 'stationery', name : "Канцтовары"},
        {id : '423277', catid : '1535', symbol : 'ceramic', name : "Керамическая посуда"},
        {id : '3966', catid : '1535', symbol : 'book', name : "Книги"},
        {id : '422898', catid : '1535', symbol : 'carpet', name : "Ковер"},
        {id : '370074', catid : '1535', symbol : 'condition', name : "Кондиционер"},
        {id : '422201', catid : '1535', symbol : 'animalfeed2', name : "Консервированный корм для животных"},
        {id : '303308', catid : '1535', symbol : 'cosmetics', name : "Косметика"},
        {id : '373199', catid : '1535', symbol : 'kitchen', name : "Кухонная мебель"},
        {id : '7095', catid : '1535', symbol : 'furniture2', name : "Мебель"},
        {id : '422899', catid : '1535', symbol : 'blanket', name : "Одеяло"},
        {id : '16007', catid : '1535', symbol : 'perfumery', name : "Парфюмерия"},
        {id : '422897', catid : '1535', symbol : 'towel', name : "Полотенце"},
        {id : '1521', catid : '1535', symbol : 'dishes', name : "Посуда"},
        {id : '303310', catid : '1535', symbol : 'hoover', name : "Пылесос"},
        {id : '3870', catid : '1535', symbol : 'sanitaryware', name : "Сантехника"},
        {id : '422436', catid : '1535', symbol : 'readinglamp', name : "Светильник"},
        {id : '422435', catid : '1535', symbol : 'ledlamp', name : "Светодиодная лампа"},
        {id : '423162', catid : '1535', symbol : 'pan', name : "Сковородки"},
        {id : '1516', catid : '1535', symbol : 'furniture', name : "Спальная мебель"},
        {id : '312799', catid : '1535', symbol : 'napery', name : "Столовое и постельное бельё"},
        {id : '422200', catid : '1535', symbol : 'animalfeed', name : "Сухой корм для животных"},
        {id : '422551', catid : '1535', symbol : 'detergents', name : "Чистящие средства"},
        {id : '422703', catid : '422702', symbol : 'petrol_normal', name : "Бензин Нормаль-80"},
        {id : '422705', catid : '422702', symbol : 'petrol_premium', name : "Бензин Премиум-95"},
        {id : '422704', catid : '422702', symbol : 'petrol_regular', name : "Бензин Регуляр-92"},
        {id : '423863', catid : '422702', symbol : 'diesel_bio', name : "Биодизель"},
        {id : '422707', catid : '422702', symbol : 'diesel', name : "Дизельное топливо"},
        {id : '3838', catid : '1536', symbol : 'gps', name : "GPS-навигаторы"},
        {id : '422432', catid : '1536', symbol : 'ledtv', name : "LED-телевизоры"},
        {id : '423378', catid : '1536', symbol : 'usb', name : "USB-флэш-накопитель"},
        {id : '1512', catid : '1536', symbol : 'consumerelectronics', name : "Аудиотехника"},
        {id : '423163', catid : '1536', symbol : 'console', name : "Игровые консоли"},
        {id : '1515', catid : '1536', symbol : 'computer', name : "Компьютер"},
        {id : '423274', catid : '1536', symbol : 'comp_accessories', name : "Компьютерные аксессуары"},
        {id : '380004', catid : '1536', symbol : 'coffeemachine', name : "Кофе-машина"},
        {id : '373200', catid : '1536', symbol : 'cookers', name : "Кухонные плиты"},
        {id : '1517', catid : '1536', symbol : 'cellularphone', name : "Мобильный телефон"},
        {id : '423272', catid : '1536', symbol : 'laptop', name : "Ноутбук"},
        {id : '423782', catid : '1536', symbol : 'ipad', name : "Планшет"},
        {id : '373202', catid : '1536', symbol : 'dishwashers', name : "Посудомоечные машины"},
        {id : '423273', catid : '1536', symbol : 'printer', name : "Принтер"},
        {id : '422212', catid : '1536', symbol : 'smartphone', name : "Смартфон"},
        {id : '3867', catid : '1536', symbol : 'washer', name : "Стиральные машины"},
        {id : '3868', catid : '1536', symbol : 'tv', name : "Телевизоры"},
        {id : '1510', catid : '1536', symbol : 'householdappliances', name : "Холодильники"},
        {id : '423366', catid : '1536', symbol : 'digital_video', name : "Цифровая видеокамера"},
        {id : '423367', catid : '1536', symbol : 'digital_camera', name : "Цифровой фотоаппарат"},
        {id : '423118', catid : '1536', symbol : 'teapot', name : "Чайник"},
        {id : '351577', catid : '1537', symbol : 'bigwatches', name : "Арт декор"},
        {id : '2540', catid : '1537', symbol : 'bijouterie', name : "Бижутерия"},
        {id : '424631', catid : '1537', symbol : 'diamondnecklace', name : "Бриллиантовое колье"},
        {id : '2546', catid : '1537', symbol : 'brilliant', name : "Бриллианты"},
        {id : '370076', catid : '1537', symbol : 'bronzedec', name : "Бронзовый декор"},
        {id : '380008', catid : '1537', symbol : 'pearljewelry', name : "Жемчужные украшения"},
        {id : '1524', catid : '1537', symbol : 'watches', name : "Часы"},
        {id : '1526', catid : '1537', symbol : 'jewellery', name : "Ювелирные украшения"},
    ];

    var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
    var $tbody = $('table.list:eq(0) > tbody:eq(0)');

    if ($('td.selected:contains(Розничная торговля)').length) {
        //   alert('Расход');
        var productsToSave = {
        };
        //         console.log(Products);
        console.log('Мы на Розничная торговля');
        $('td.selected:contains(Розничная торговля)').after($("<input class='mega_iterator' type='button' value='Зохавать стату продаж' id=\'refresh_unit_list\'>"));
        var $refresh_unit_list = $('#refresh_unit_list');
        $refresh_unit_list.click(function() {
            Products.forEach(function(element) {
  //              console.log(element.id);
                https://virtonomica.ru/vera/main/company/view/6604174/marketing_report/shops/1509
                var link = 'https://virtonomica.ru/' + currentRealm + '/main/company/view/6604174/marketing_report/shops/' + element.id;
 //               console.log(link);
                $.get(link, function (data) {
                    var $qty = $('table.grid:eq(1) > tbody:eq(0) > tr:eq(0) > td:eq(1)', data).text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '');
                    console.log(element.name +' - '+$qty);
                    productsToSave[element.name] = {
                        soldQty: $qty
                    };
                });
//                exit;
            });
            //$('.iterators').click();
           ToStorage('stock-' + currentRealm + '-sale', productsToSave);
        });
    };

    if ($('td.selected:contains(Производство)').length) {
        //    alert('Производство');
        productsToSave = {
        };
        $('a.c_row').each(function () {
            var $tr = $(this);
            var prodName = $tr.children('div:eq(0)').children('span:eq(2)').text().trim();
            //        console.log(prodName);
            var prodAmount = parseFloat($tr.children('div:eq(0)').children('span:eq(3)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var prodQty = parseFloat($tr.children('div:eq(0)').children('span:eq(4)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var prodQtyAvg = parseFloat($tr.children('div:eq(0)').children('span:eq(5)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var prodCost = parseFloat($tr.children('div:eq(0)').children('span:eq(6)').text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            //      console.log(prodName + ' - ' + prodAmount + ' - ' + prodQty + ' - ' + prodQtyAvg + ' - ' + prodCost);
            productsToSave[prodName] = {
                prodAmount: prodAmount,
                prodQty: prodQty,
                prodQtyAvg: prodQtyAvg,
                prodCost: prodCost
            };
            //      alert(prodName);
            //exit;
        });
        ToStorage('stock-' + currentRealm + '-prod', productsToSave);
    };
    if ($('td.selected:contains(Расход)').length) {
        //   alert('Расход');
        var productsToSave = {
        };
        $('a.c_row').each(function () {
            var $tr = $(this);
            var prodName = $tr.children('div:eq(0)').children('span:eq(2)').text().trim();
            var useAmount = parseFloat($tr.children('div:eq(0)').children('span:eq(3)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var useQty = parseFloat($tr.children('div:eq(0)').children('span:eq(4)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var useCost = parseFloat($tr.children('div:eq(0)').children('span:eq(5)').text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            productsToSave[prodName] = {
                useAmount: useAmount,
                useQty: useQty,
                useCost: useCost
            };
            //      alert(prodName);
            //exit;
        });
        ToStorage('stock-' + currentRealm + '-use', productsToSave);
    };
    //console.log(productsToSave);
    if ($('td.selected:contains(Запасы)').length) {
        //    alert('Запасы');
        var prod = JSON.parse(window.localStorage.getItem('stock-' + currentRealm + '-prod'));
        var use = JSON.parse(window.localStorage.getItem('stock-' + currentRealm + '-use'));
        var sale = JSON.parse(window.localStorage.getItem('stock-' + currentRealm + '-sale'));
 //       console.log(use);
 //       exit;
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Объем Производства">Пр кол-во</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Качество Производства">Пр кач</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Среднереалмовое Качество">Реалм кач</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Себестоимость Производства">Пр СС</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Объем Расхода">Расход</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Качество Расхода">Расход кач</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Себестоимость Расхода">Расход СС</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Объем Продаж в Рознице">Розница</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Себестоимость Расхода">Расход Всего</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Баланс Производственных Мощностей">БПМ</span>');
        $('span.c_qlt:eq(0)').parent().append('<span class="c_qlt" title="Запас в днях, если выключить производство">Запас</span>');
        $('a.c_row').each(function () {
            var $tr = $(this);
            var prodName = $tr.children('div:eq(0)').children('span:eq(2)').text().trim();
            var stockAmount = parseFloat($tr.children('div:eq(0)').children('span:eq(3)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            var stockQty = parseFloat($tr.children('div:eq(0)').children('span:eq(4)').text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
            if (!(prodName in prod)) prod[prodName] = {
            };
            if (!(prodName in use)) use[prodName] = {
            };
            if (!(prodName in sale)) sale[prodName] = {
            };
            if (prod[prodName].prodAmount === undefined) prod[prodName].prodAmount = 0;
            if (prod[prodName].prodQty === undefined) prod[prodName].prodQty = 0;
            if (prod[prodName].prodQtyAvg === undefined) prod[prodName].prodQtyAvg = 0;
            if (prod[prodName].prodCost === undefined) prod[prodName].prodCost = 0;
            if (use[prodName].useAmount === undefined) use[prodName].useAmount = 0;
            if (use[prodName].useQty === undefined) use[prodName].useQty = 0;
            if (use[prodName].useCost === undefined) use[prodName].useCost = 0;
            if (sale[prodName].soldQty === undefined) sale[prodName].soldQty = 0;
            $tr.append('<span class="c_qlt">' + prod[prodName].prodAmount + '</span>');
            if (prod[prodName].prodQty >= prod[prodName].prodQtyAvg)
            {
                $tr.append('<span class="c_qlt" style="color:green">' + prod[prodName].prodQty + '</span>');
            } else {
                $tr.append('<span class="c_qlt" style="color:red" title="Следует увеличить кач или выключить производство">' + prod[prodName].prodQty + '</span>');
            }
            $tr.append('<span class="c_qlt">' + prod[prodName].prodQtyAvg + '</span>');
            $tr.append('<span class="c_qlt">$' + prod[prodName].prodCost + '</span>');
            $tr.append('<span class="c_qlt">' + use[prodName].useAmount + '</span>');
            $tr.append('<span class="c_qlt">' + use[prodName].useQty + '</span>');
            $tr.append('<span class="c_qlt">$' + use[prodName].useCost + '</span>');

            $tr.append('<span class="c_qlt">' + sale[prodName].soldQty + '</span>');
            var total_out = parseInt(use[prodName].useAmount) + parseInt(sale[prodName].soldQty);
            $tr.append('<span class="c_qlt">' + total_out + '</span>');

            var overprod = prod[prodName].prodAmount - total_out;
            var bpm = parseInt(((overprod / total_out) +1 )*100);
            if(total_out === 0) {bpm = 0};
            var color = "red";
            var tip = "Красный уровень угрозы. Следует срочно увеличить производство!";
            if(bpm > 30) {color = "brown"; tip = "Следует планово увеличить производство."}
            if(bpm > 90) {color = "green"; tip = "Красава! Так держать!"}
            if(bpm > 110) {color = "orange"; tip = "Производится немного больше, чем надо."}
            if(bpm > 300) {color = "blue"; tip = "Производится гораздо больше необходимого объема."}
            $tr.append('<span class="c_qlt" style="color:'+color+'" title="'+tip+'">' + bpm + '%</span>');

            var stock = parseInt(stockAmount / total_out);
            var color = "red";
            var tip = "Красный уровень угрозы. Следует срочно увеличить запасы или уменьшить потребление!";
            if(stock > 10) {color = "brown"; tip = "Следует планово увеличить запасы или сократить потребление."}
            if(stock > 30) {color = "orange"; tip = "Запасы хорошие, но уже можно искать поставщиков."}
            if(stock > 60) {color = "green"; tip = "Отличные запасы. Можно как минимум месяц не заглядывать."}
            if(stock > 100) {color = "blue"; tip = "Запасы гораздо больше необходимого объема."}
            if(total_out === 0) {stock = "&infin;"; color = "green"; tip = "Не используется на производстве. Продать или схомячить."};

            $tr.append('<span class="c_qlt" style="color:'+color+'" title="'+tip+'">' + stock + 'd</span>');
            //      alert(prodName);
            //exit;
            $('.c_name').css("font-size", "8px");
            $('.c_qlt').css("font-size", "8px");
            $('.c_qty').css("font-size", "8px");
            $('.c_qlt').css("width", "50px");
            $('.c_qty').css("width", "50px");
            $('.c_name').css("width", "200px");

        });

    };
    //  console.log(JSON.parse(window.localStorage.getItem('virtasement-' + currentRealm + '-prod')));
    //  console.log(JSON.parse(window.localStorage.getItem('virtasement-' + currentRealm + '-use')));

}
if (window.top == window) {
    var script = document.createElement('script');
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
