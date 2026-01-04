// ==UserScript==
// @name           HWM Resourses as Images
// @namespace      https://greasyfork.org/ru/users/302695
// @description    Ресурсы и части в картинках (версия от 2021.12.16)
// @author         raTaHoa; Чеширский КотЪ; code: Dinozon2, ElMarado; style: sw.East
// @version        16.12.2021.
// @include        https://www.heroeswm.ru/pl_info.php*
// @include        https://www.lordswm.com/pl_info.php*
// @include        http://178.248.235.15/pl_info.php*
// @grant          GM_addStyle
// @icon           http://daily.heroeswm.ru/upload/podicon.PNG
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436672/HWM%20Resourses%20as%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/436672/HWM%20Resourses%20as%20Images.meta.js
// ==/UserScript==

// 16.12.2021    - Добавлен шлем магмы
// 07.12.2021    - Актуализированы все иконки частей комплектов имперок, тьмы и небес.
// 0.22.19       - Отображение картинки для частей артефакта "Небесный амулет"
// 0.22.18       - Отображение картинки для частей артефакта "Небесный лук"
// 0.22.17       - Заменены изображения элементов ГН.
// 0.22.16       - Отображение картинки для частей артефакта "Небесный лук"
// 0.22.15       - Отображение картинки для частей артефакта "Небесная мантия"
// 0.22.14       - Отображение картинки для частей артефакта "Небесный доспех"
// 0.22.13       - Отображение картинки для частей артефакта "Небесные сандалии"
// 0.22.12       - Отображение картинки для частей артефакта "Небесная диадема"
// 0.22.11       - Коррекция в связи с изменением написания "части" на "Части"
// 0.22.10       - Отображение картинки для частей артефакта "Небесный посох"
// 0.22.9        - Отображение картинки для частей артефакта "Лук тьмы"
// 0.22.8        - Коррекция в связи с изменением написания "Части" на "части"
// 0.22.7        - Отображение картинки для частей артефактов "Кинжал тьмы" и "Кольцо тьмы"
// 0.22.6        - Отображение картинки для частей артефакта "Плащ тьмы"
// 0.22.5        - Отображение картинки для частей артефакта "Щит тьмы"
// 0.22.4        - Отображение картинки для частей артефакта "Шлем тьмы" и изменён порядок отображения картинок
// 0.22.3        - Отображение картинки для частей артефакта "Амулет тьмы"
// 0.22.2        - Отображение картинки для частей артефакта "Топор тьмы" и переход на рынок для частей артефактов тьмы
// 0.22.1        - Отображение картинок для частей артефактов тьмы и таинственного свитка
// 0.21.2-0.21.4 - Отображение картинок и ссылок на рынок для частей имперских артефактов
// 0.21.1        - fix. Отображение картинок для частей имперских артов
// @copyright      2013-2018, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)

/** === Style === **/
GM_addStyle ( `

#box{
   width: 100%;
   height: 100%;
   margin: 0 5px 0 10px;
}
#amount_slot{
   overflow: hidden;
   float: left;
   width: 48px;
   height: 48px;
   margin: 4px 4px 4px 0;
   padding: 0;
   border: 4px solid #fff;
   box-shadow: 0px 0px 5px #aaa;
   z-index: 1;
}
#amount_slot img {
   display: block;
   width: 42px;
   height: 42px;
   margin: 3px 0 0 3px;
   padding: 0;
}
#amount_slot a img {
   -webkit-transition: all 0.2s linear;
      -moz-transition: all 0.2s linear;
       -ms-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
           transition: all 0.2s linear;
}
#amount_slot:hover a img {
   -webkit-transform: scale(1.20,1.20);
      -moz-transform: scale(1.20,1.20);
       -ms-transform: scale(1.20,1.20);
        -o-transform: scale(1.10,1.20);
           transform: scale(1.20,1.20);
   opacity:1;
}
#amount_slot a{
   text-decoration: none;
}
.amount_wrap {
   position: absolute;
   min-width: 14px;
   height: 13px;
   margin: -48px 0 0 -3px;
   padding: 0 1px 1px;
   color: #fff;
   border: 2px solid #fff;
   background: #222;
   -webkit-box-shadow: 1px 1px 1px #aaa;
      -moz-box-shadow: 1px 1px 1px #aaa;
           box-shadow: 1px 1px 1px #aaa;
   z-index: 15;
   font-size: 10px;
   text-align: center;
   text-decoration: none !important;
   text-shadow: 1px 1px 1px rgba(0,0,0, 0.8);
   cursor: pointer;
   opacity: .7;
   -webkit-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
      -moz-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
       -ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        -o-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
           transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
}

` );
/** = Style End = **/

var HTMLOut='<div id="box">';

var ElementsArray = [];
    // *** Артефакты магмы
ElementsArray['Магма шлем']=       'part_magma_helm';
    // *** Артефакты небес
ElementsArray['Небесный посох']=       'part_heaven_staff';
ElementsArray['Небесная диадема']=     'part_heaven_helm';
ElementsArray['Небесные сандалии']=    'part_heaven_bts';
ElementsArray['Небесный доспех']=      'part_heaven_armr';
ElementsArray['Небесная мантия']=      'part_heaven_clk';
ElementsArray['Небесный лук']=         'part_heaven_bow';
ElementsArray['Небесный щит']=         'part_heaven_shield';
ElementsArray['Небесный амулет']=      'part_heaven_amlt';
ElementsArray['Небесное кольцо']=      'part_heaven_rn';
ElementsArray['Небесный кинжал']=      'part_heaven_dagger';

    // *** Артефакты тьмы
ElementsArray['Амулет тьмы']=          'part_dark_amul';
ElementsArray['Доспех тьмы']=          'part_dark_armor';
ElementsArray['Меч тьмы']=             'part_dark_sword';
ElementsArray['Сапоги тьмы']=          'part_dark_boots';
ElementsArray['Топор тьмы']=           'part_dark_axe';
ElementsArray['Шлем тьмы']=            'part_dark_helmet';
ElementsArray['Щит тьмы']=             'part_dark_shield';
ElementsArray['Плащ тьмы']=            'part_dark_cloak';
ElementsArray['Кинжал тьмы']=          'part_dark_dagger';
ElementsArray['Кольцо тьмы']=          'part_dark_ring';
ElementsArray['Лук тьмы']=             'part_dark_bow';
    // *** Имперские артефакты
ElementsArray['Имперский амулет']=     'part_imp_amul';
ElementsArray['Имперский арбалет']=    'part_imp_crossbow';
ElementsArray['Имперский доспех']=     'part_imp_armor';
ElementsArray['Имперский кинжал']=     'part_imp_dagger';
ElementsArray['Имперское кольцо']=     'part_imp_ring';
ElementsArray['Имперский меч']=        'part_imp_sword';
ElementsArray['Имперский плащ']=       'part_imp_cloak';
ElementsArray['Имперские сапоги']=     'part_imp_boots';
ElementsArray['Имперский шлем']=       'part_imp_helmet';
ElementsArray['Имперский щит']=        'part_imp_shield';
    // *** Части Гильдии Лидеров
ElementsArray['Части редкого отряда']=       'https://dcdn.heroeswm.ru/i/rewards/gn/task3.png';
ElementsArray['Части очень редкого отряда']= 'https://dcdn.heroeswm.ru/i/rewards/gn/task4.png';
ElementsArray['Части таинственного свитка']= 'https://i.imgur.com/38VoKxQ.png';
    // *** Элементы Гильдии Наёмников
ElementsArray['абразив']=              'abrasive';
ElementsArray['змеиный яд']=           'snake_poison';
ElementsArray['клык тигра']=           'tiger_tusk';
ElementsArray['ледяной кристалл']=     'ice_crystal';
ElementsArray['лунный камень']=        'moon_stone';
ElementsArray['огненный кристалл']=    'fire_crystal';
ElementsArray['осколок метеорита']=    'meteorit';
ElementsArray['цветок ведьм']=         'witch_flower';
ElementsArray['цветок ветров']=        'wind_flower';
ElementsArray['цветок папоротника']=   'fern_flower';
ElementsArray['ядовитый гриб']=        'badgrib';
    // *** Элементы с предприятий
ElementsArray['Кожа']=                 'https://i.imgur.com/Xn82L25.png';
ElementsArray['Сталь']=                'https://i.imgur.com/hwThTJE.png';
ElementsArray['Никель']=               'https://i.imgur.com/6lHniay.png';
ElementsArray['Волшебный порошок']=    'https://i.imgur.com/IuqF7rI.png';
ElementsArray['Мифриловая руда']=      'https://i.imgur.com/dv6rzKn.png';
ElementsArray['Обсидиан']=             'https://i.imgur.com/4yOWbK8.png';
ElementsArray['Мифрил']=               'https://i.imgur.com/1Y1Z7Mq.png';
ElementsArray['Орихалк']=              'https://i.imgur.com/qRGZzCs.png';

var a = document.body.getElementsByClassName("wb");

for (var i = 0, length = a.length; i < length; i++) {
	if (i in a) {
	    // Находим блок с элементами
		if (a[i].innerHTML.indexOf('&nbsp;&nbsp;&nbsp;&nbsp;<b>') + 1){
			// создаем массив из строк:
			var text=a[i].innerHTML;
            console.log(a[i]);
		    var arr = text.split('<br>');
			// очищаем строку от мусора
			for (var k=0,len=arr.length;k<len;k++) {
		 if (k==Math.round((len-1)/2)) {HTMLOut = HTMLOut+'<div id="top">';}
				var line=arr[k];

				line=line.replace('&nbsp;&nbsp;&nbsp;&nbsp;', '');
				line=line.replace('<b>', '');
				line=line.replace('</b>', '');
				var res = line.split(':');

				//    res[0] - название элемента
				//    res[1] - количество

				if (res[1]>0) {

				        //   фикс ширины
                                        if      (res[1]>9999) var w_length = 39;
                                        else if (res[1]>999)  var w_length = 31;
                                        else if (res[1]>99)   var w_length = 24;
                                        else                  var w_length = 13;

//обработка имперских артефактов и артефактов тьмы и небес
                    if ((res[0].indexOf('\u0418\u043c\u043f\u0435\u0440') !=-1) ||
                        (res[0].indexOf('\u041C\u0430\u0433\u043C') !=-1) ||
                        (res[0].indexOf('\u0442\u044c\u043c\u044B') !=-1) ||
                        (res[0].indexOf('\u0435\u0431\u0435\u0441') !=-1)) { 

					if(ElementsArray[res[0]].length<25){

						HTMLOut = HTMLOut + '<div id="amount_slot">'+
                                               '<a href="/auction.php?cat=part&sort=0&art_type='+ElementsArray[res[0]]+'"> '+
                                                  '<img src="/i/artifacts/parts/'+ElementsArray[res[0]]+'.png" alt="'+line+'" title="'+line+'">'+
                                               '</a>'+
                                               '<div class="amount_wrap" style="width:'+w_length+'px">'+res[1]+'</div>'+
                                            '</div>';
					} else {
                       HTMLOut = HTMLOut + '<div id="amount_slot">'+
                                               '<a href="#"> '+
                                                  '<img src="'+ElementsArray[res[0]]+'" alt="'+line+'" title="'+line+'">'+
                                               '</a>'+
                                               '<div class="amount_wrap" style="width:'+w_length+'px">'+res[1]+'</div>'+
                                            '</div>';
                    }
                     } else {
					if(ElementsArray[res[0]].length>25){
						HTMLOut = HTMLOut + '<div id="amount_slot">'+
                                               '<a href="#"> '+
                                                  '<img src="'+ElementsArray[res[0]]+'" alt="'+line+'" title="'+line+'">'+
                                               '</a>'+
                                               '<div class="amount_wrap" style="width:'+w_length+'px">'+res[1]+'</div>'+
                                            '</div>';
					} else {
						HTMLOut = HTMLOut + '<div id="amount_slot">'+
                                               '<a href="/auction.php?cat=elements&sort=0&art_type='+ElementsArray[res[0]]+'"> '+
//                                                  '<img src="/i/'+ElementsArray[res[0]]+'.gif" alt="'+line+'" title="'+line+'"> '+
                                                  '<img src="/i/gn_res/'+ElementsArray[res[0]]+'.png?v=0" alt="'+line+'" title="'+line+'"> '+
                                               '</a>'+
                                               '<div class="amount_wrap" style="width:'+w_length+'px">'+res[1]+'</div>'+
                                            '</div>';
					}
                   }
				}
  			}

			HTMLOut = HTMLOut+'</div>';
			// Выводим на страницу
			a[i].innerHTML = HTMLOut;
		}
	}
}