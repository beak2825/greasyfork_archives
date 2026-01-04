// ==UserScript==
// @name           HWM - Resourses as images, clickable links Style Mod
// @namespace      Resourses as images, clickable links to resources and timers
// @author         code: Dinozon2
// @collaborator   code: ElMarado; style: sw.East
// @version        1.23
// @description    Заменяет текстовое описание ресурсов на изображения
// @icon           http://i.imgur.com/GScgZzY.jpg
// @include        https://www.heroeswm.*/pl_info.php*
// @include        *//178.248.235.15/pl_info.php*
// @include        *//*.lordswm.*/pl_info.php*
// @grant          GM_addStyle
// @copyright      2013-2018, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/374775/HWM%20-%20Resourses%20as%20images%2C%20clickable%20links%20Style%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/374775/HWM%20-%20Resourses%20as%20images%2C%20clickable%20links%20Style%20Mod.meta.js
// ==/UserScript==


//ver 1.4
//       в плане: при продаже лота отображать картинку и цену (монеты)
//ver 1.3
//       в плане: свободно рабочих мест
//ver 1.23
//   [+] добавлено части имперского меча
//ver 1.22
//   [+] добавлено отображение отрядов
//ver 1.21
//   [+] выровнено отображение ресурсов
//   [+] обновлены картинки ресурсов
//   [*] добавлены артефакты империи, изменен код
//ver 1.2
//   [+] добавлен таймер до начала битвы с сурвилургами
//   [+] в меню замены ссылки Битвы на Бои за территории
//   [*] переписан код, добавлена совместимость с таймерами охот/гв/гн
//ver 1.1
//   [+] в шапке проставлены ссылки на закупку ресурсов на рынке
//ver 1.0
//   [+] на странице персонажа ресурсы заменяются на изображения

/**
 * ============= Style =============
 */

GM_addStyle ( `

#box{
   width: 93%;
   height: 100%;
   margin: 5px 5px 0 10px;
}
#amount_slot{
   overflow: hidden;
   float: right;
   width: 48px;
   height: 48px;
   margin: 5px 5px 5px 0;
   padding: 0;
   border: 3px solid #fff;
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
       -ms-transform: scale(1.20,1.205);
        -o-transform: scale(1.20,1.20);
           transform: scale(1.20,1.20);
   opacity:1;
}
#amount_slot a{
   text-decoration: none;
}
.amount_wrap {
   position: absolute;
   min-width:14px;
   height: 13px;
   margin: -48px 0 0 -3px;
   padding:0 1px 1px;
   color:#fff;
   border:2px solid #fff;
   background:#222;
   -webkit-box-shadow: 1px 1px 1px #aaa;
      -moz-box-shadow: 1px 1px 1px #aaa;
           box-shadow: 1px 1px 1px #aaa;
   z-index: 15;
   font-size: 10px;
   text-align: center;
   text-decoration: none !important;
   text-shadow: 1px 1px 1px rgba(0,0,0, 0.8);
   cursor: pointer;
   opacity:.7;
   -webkit-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
      -moz-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
       -ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        -o-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
           transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
}

` );
/* Style End */


var HTMLOut='<div id="box">';

var ElementsArray = [];
ElementsArray['Кожа']=                 'https://i.imgur.com/Xn82L25.png';
ElementsArray['Сталь']=                'https://i.imgur.com/hwThTJE.png';
ElementsArray['Никель']=               'https://i.imgur.com/6lHniay.png';
ElementsArray['Волшебный порошок']=    'https://i.imgur.com/IuqF7rI.png';
ElementsArray['Мифриловая руда']=      'https://i.imgur.com/dv6rzKn.png';
ElementsArray['Обсидиан']=             'https://i.imgur.com/4yOWbK8.png';
ElementsArray['Мифрил']=               'https://i.imgur.com/1Y1Z7Mq.png';
ElementsArray['Орихалк']=              'https://i.imgur.com/qRGZzCs.png';
ElementsArray['осколок метеорита']=    'meteorit';
ElementsArray['абразив']=              'abrasive';
ElementsArray['змеиный яд']=           'snake_poison';
ElementsArray['клык тигра']=           'tiger_tusk';
ElementsArray['ледяной кристалл']=     'ice_crystal';
ElementsArray['лунный камень']=        'moon_stone';
ElementsArray['огненный кристалл']=    'fire_crystal';
ElementsArray['цветок ведьм']=         'witch_flower';
ElementsArray['цветок ветров']=        'wind_flower';
ElementsArray['цветок папоротника']=   'fern_flower';
ElementsArray['ядовитый гриб']=        'badgrib';
ElementsArray['Имперский арбалет']=    'part_imp_crossbow';
ElementsArray['Имперские сапоги']=     'part_imp_boots';
ElementsArray['Имперский щит']=        'part_imp_shield';
ElementsArray['Имперский шлем']=       'part_imp_helmet';
ElementsArray['Имперский амулет']=     'part_imp_amul';
ElementsArray['Имперский доспех']=     'part_imp_armor';
ElementsArray['Имперский меч']=        'part_imp_sword';
ElementsArray['Части редкого отряда']= 'https://dcdn.heroeswm.ru/i/army_html/q_sign.png';
ElementsArray['Части очень редкого отряда']= 'https://dcdn.heroeswm.ru/i/army_html/q_sign.png';

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

                    if (res[0].indexOf('\u0418\u043c\u043f\u0435\u0440') !=-1) { // обработка имперских артов
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
                     } else { // остальные ресурсы
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
                                                  '<img src="/i/'+ElementsArray[res[0]]+'.gif" alt="'+line+'" title="'+line+'"> '+
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
var a = document.body.getElementsByTagName("img");

for (var i = 0, length = a.length; i < length; i++) {
    //if (i in a) {
    if (a[i].title=="Древесина"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=1>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Руда"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=2>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Ртуть"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=3>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Сера"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=4>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Кристаллы"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=5>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Самоцветы"){
        a[i].outerHTML = '<a href=/auction.php?cat=res&sort=0&type=6>'+a[i].outerHTML+'</a>';
    } else if (a[i].title=="Золото"){
        a[i].outerHTML = a[i].outerHTML;
    }

    }

// замена ссылок на Битвы
var a = document.body.getElementsByTagName("a");
for (var i = 0, length = a.length; i < length; i++) {

    if (a[i].getAttribute('href')=='bselect.php') {
        a[i].setAttribute('href','mapwars.php');
    }

    // ver 1.3 - количество свободных мест на предприятиях
    //if (a[i].getAttribute('href').indexOf('object')+1){
    //	alert(a[i].getAttribute('href'));
    //};
}

var zayvok=0;
var freecell=0;
var allcell=0;
var timetogo = 0;
var cnt=0;
var alreadyin = 0;
var freecellavaibale = 0;
var bb = document.getElementsByTagName("title");


// таймер до начала боя с Сурвилургами только на странице боев

//if (window.location.pathname == '/map.php'){ }
if (window.location.pathname == '/mapwars.php'){

    // узнаем количество свободных мест
    var f = document.body.getElementsByTagName("font");
    for (var x = 0, length = f.length; x < length; x++) {

        // всего вступило участников
        if (f[x].getAttribute('style')=='font-size:9px;'){
            if(0==f[x].innerHTML.indexOf('[')){
                cnt=cnt+1;
            }
        }

        // всего защит
        if (f[x].innerHTML.indexOf('Сурвилурги')+1) {
            zayvok=zayvok+1;
        }

        if (f[x].innerHTML=='Вы уже в заявке, ожидайте начала битвы!') {
            alreadyin = 1;
        }

    }

    // свободных мест
    freecell = (Math.ceil(cnt/21)*21)-cnt;

    // всего мест
    allcell = Math.ceil(cnt/21)*21;

    var c = document.body.getElementsByTagName("td");
    for (var i = 0, length = c.length; i < length; i++) {

        if (c[i].innerHTML.length==37&&c[i].getAttribute('class')=='wb') {

            // если больше нет свободных мест и игрок не успле зайти смотрим следующую ближайшую заявку
            if (alreadyin==0&&freecell==0) {continue;}

            //красное время
            redtime = c[i].innerHTML[21] + c[i].innerHTML[22] + c[i].innerHTML[23] + c[i].innerHTML[24] + c[i].innerHTML[25];

            // еще не в заявке -> считаем свободные слоты
            var b = document.body.getElementsByTagName("b");
            for (var bi = 0, length = b.length; bi < length; bi++) {

                if(b[bi].innerHTML=='[Вступить]'){// есть свободные места

                    // замена заголовка/////////////////////////// freecell  allcell
                    // узнаем сколько осталось до начала
                    var h = new Date();
                    startmin = c[i].innerHTML[24] + c[i].innerHTML[25];
                    startmin = parseInt(startmin);
                    curmin = h.getMinutes();

                    timetogo = startmin - curmin;
                    if (timetogo<0){
                        timetogo = timetogo + 60;
                    }

                    bb[0].innerHTML = freecell + ' ('+ timetogo +' мин) свободно';
                    var freecellavaibale =1;
                    //Math.round(freecell/allcell*100)

                    break;
                }

            }

            //if (freecellavaibale) { // уже в заявке - > начало через x минут.


                if (alreadyin){

                    // узнаем сколько осталось до начала
                    var h = new Date();
                    startmin = c[i].innerHTML[24] + c[i].innerHTML[25];
                    startmin = parseInt(startmin);
                    curmin = h.getMinutes();

                    timetogo = startmin - curmin;
                    if (timetogo<0){
                        timetogo = timetogo + 60;
                    }
                    // замена заголовка///////////////////////////
                    bb[0].innerHTML = timetogo + ' мин до вступления на защиту';
                }
               // break;
            //}

            // "обычное" время
        } else if (c[i].innerHTML.length==5&&c[i].getAttribute('class')=='wb') {
            // обычное время - ищем первое и стоп

            // узнаем сколько осталось до начала
            if (c[i].innerHTML.indexOf(':')+1) {
                var txt=c[i].innerHTML;
                txt.toString();
                txt.split(':');
                var h = new Date();
                var curmin = h.getMinutes();
                var dtime1 = parseInt(txt[3]+txt[4])-15;
                if (dtime1>curmin) {
                    dif = dtime1 - curmin;
                } else {
                    dif = 60 + dtime1 - curmin;
                }

                // dif - осталось минут до боя
                // замена заголовка///////////////////////////
                bb[0].innerHTML = dif + ' мин до вступления на защиту';
            }

            break;
        }
   }
}