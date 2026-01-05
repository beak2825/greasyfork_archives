// ==UserScript==
// @name                 Справочник
// @author               Магнат
// @description          Всякая полезная информация
// @namespace            Test
// @grant                unsafeWindow
// @grant                GM_addStyle
// @grant                GM_registerMenuCommand
// @grant                GM_xmlhttpRequest
// @grant                GM_openInTab              
// @include              http://s*.ikariam.gameforge.*/index.php*
// @include              http://s*.ikariam.*/*
// @exclude              http://board.*.ikariam.gameforge.com*
// @exclude              http://*.ikariam.gameforge.*/board
//
// @require              http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require              http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @require              http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
//
// @version              1.5.0
// 
// @downloadURL https://update.greasyfork.org/scripts/10012/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/10012/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA.meta.js
// ==/UserScript==

var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
$('#footer').css("display","none");

$(document).on('click','#guru', function(){
    var disp = $('#gurutab').css("display");
    if(disp=="block"){
        $('#gurutab').css("display","none");
    } else {
        $('#gurutab').css("display","block");
    }
});

$('.menu_slots > .expandable:last').after('<li class="guru" id="guru" onclick=""><div class="help" style="margin-top:6px;"></div></li>');
$("#container").after('<style>\
a, a:hover {text-decoration: none;}\
ul {margin: 0;padding: 0;list-style: none;}\
.menu {height: auto; font-size: 12px; background:url("http://s20-ru.ikariam.gameforge.com/skin/layout/bg_sidebox.png") repeat-y;}\
.menu > li > a {width: 100%;height: 27px;line-height: 27px;display: block;position: relative;font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-weight: 600;color: #8B4513;}\
.menu ul li {text-align: left; margin: 0px 12px;}\
.menu ul li ul li {text-align: left; margin: 0px; background: #D2691E;}\
.menu ul li a {background: #F5DEB3;display: block;position: relative;padding: 5px 0px 4px 16px;font-size: 12px;font-weight: 400;color: #000;}\
.menu ul li ul li a {background: #D2691E;display: block;position: relative;padding: 5px 0px 4px 10px; border-left: 3px solid #E5CEA3; border-right: 3px solid #F5DEB3;\
font-size: 12px;font-weight: 400;color: #000;}\
.menu li ul li:last-child a {margin-bottom: 7px;border-bottom: 3px solid #D2691E;}\
.menu li:last-child ul li:last-child a {margin-bottom: 0px;}\
.menu li ul:last-child {padding-bottom: 4px;}\
.menu > li > ul > li > ul > li:last-child a{margin-bottom: 0px;padding-bottom: 6px; border-bottom: 3px solid #F5DEB3;}\
.menu > li > a:hover, .menu > li > a.active {color: #FFF;background-image: -webkit-gradient(linear, left top, left bottom, from(rgb(139, 69, 19)),to(rgb(160, 82, 45)));\
background-image: -webkit-linear-gradient(top, rgb(139, 69, 19), rgb(160, 82, 45));background-image: -moz-linear-gradient(top, rgb(139, 69, 19), rgb(160, 82, 45));\
background-image: -o-linear-gradient(top, rgb(139, 69, 19), rgb(160, 82, 45));background-image: -ms-linear-gradient(top, rgb(139, 69, 19), rgb(160, 82, 45));\
background-image: linear-gradient(top, rgb(139, 69, 19), rgb(160, 82, 45));filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr="#8B4513", EndColorStr="#A0522D");}\
.menu > li > ul > li > a:hover, .menu > li > ul > li > a.active {background-color: 139, 69, 19;}\
.menu > li > ul > li a:hover {background-color:#DEB887;}\
.active {visibility: visible !important;}\
.wikib tr td:hover, .wikiu tr td:hover {background-color:#F5DEB3;};\
td .main {font-size: 14px;}</style>\
<div id="gurutab" style="display:none;position:absolute;left:60px;top:200px;z-index:61;">\
<table width="100%" border="0">\
<tbody>\
<tr>\
<td valign="top" >\
<table>\
<tbody>\
<tr><td style="width:228px;height:5px;background-image:url(http://firepic.org/images/2015-05/18/6wu0h4glhm7v.jpg);"></td></tr>\
<tr>\
<td align="center">\
<ul class="menu">\
<li class="item1"><a href="#">ВКЛАДЫ В ШАХТУ</a>\
<ul>\
<li class="subitem1"><a href="#">Дерево</a></li>\
<li class="subitem2"><a href="#">Остальное</a></li>\
</ul>\
</li>\
<li class="item2"><a href="#">С ФОРУМА</a>\
<ul>\
<li><a href="#">Справочник</a>\
<ul>\
<li class="subitem3"><a href="#">Удаление ишек</a></li>\
<li class="subitem4"><a href="#">Расчёт топ листа</a></li>\
</ul>\
</li>\
<li class="subitem7"><a href="#">Ссылки</a></li>\
</ul>\
</li>\
<li class="item3"><a href="#">АЛЬЯНС</a>\
<ul>\
<li><a href="#">Энциклопедия</a></li>\
<li class="subitem9"><a href="#">Состав</a></li>\
<li class="subitem13"><a href="#">Ссылки</a></li>\
</ul>\
</li>\
<li class="item4"><a href="#">ЗДАНИЯ</a>\
<ul>\
<li><a href="#">ОСНОВНЫЕ</a>\
<ul>\
<li class="subitem31"><a href="#">РАТУША</a></li>\
<li class="subitem32"><a href="#">АКАДЕМИЯ</a></li>\
<li class="subitem33"><a href="#">СКЛАД</a></li>\
<li class="subitem34"><a href="#">ТАВЕРНА</a></li>\
<li class="subitem35"><a href="#">ДВОРЕЦ</a></li>\
<li class="subitem36"><a href="#">МУЗЕЙ</a></li>\
<li class="subitem37"><a href="#">ТОРГОВЫЙ ПОРТ</a></li>\
<li class="subitem38"><a href="#">ВЕРФЬ</a></li>\
<li class="subitem39"><a href="#">КАЗАРМА</a></li>\
<li class="subitem310"><a href="#">СТЕНА</a></li>\
<li class="subitem311"><a href="#">ПОСОЛЬСТВО</a></li>\
<li class="subitem312"><a href="#">РЫНОК</a></li>\
<li class="subitem313"><a href="#">МАСТЕРСКАЯ</a></li>\
<li class="subitem314"><a href="#">УКРЫТИЕ</a></li>\
<li class="subitem315"><a href="#">ХРАМ</a></li>\
<li class="subitem316"><a href="#">ХРАНИЛИЩЕ</a></li>\
<li class="subitem317"><a href="#">КРЕПОСТь ПИРАТОВ</a></li>\
<li class="subitem318"><a href="#">ЧЁРНЫЙ РЫНОК</a></li>\
<li class="subitem319"><a href="#">АРХИВ НАВИГАЦИОННЫХ КАРТ</a></li>\
<li class="subitem320"><a href="#">РЕЗИДЕНЦИЯ ГУБЕРНАТОРА</a></li>\
</ul>\
</li>\
<li><a href="#">ПРОИЗВОДЯЩИЕ</a>\
<ul>\
<li class="subitem321"><a href="#">Хижина лесничего</a></li>\
<li class="subitem322"><a href="#">Удаление</a></li>\
<li class="subitem323"><a href="#">Удаление</a></li>\
<li class="subitem324"><a href="#">Удаление</a></li>\
<li class="subitem325"><a href="#">Удаление</a></li>\
</ul>\
</li>\
<li><a href="#">УДЕШЕВЛЯЮЩИЕ</a>\
<ul>\
<li class="subitem326"><a href="#">Удаление</a></li>\
<li class="subitem327"><a href="#">Удаление</a></li>\
<li class="subitem328"><a href="#">Удаление</a></li>\
<li class="subitem329"><a href="#">Удаление</a></li>\
<li class="subitem330"><a href="#">Удаление</a></li>\
</ul>\
</li>\
</ul>\
</li>\
</ul>\
</td>\
</tr>\
<tr><td style="height:5px;background-image:url(http://firepic.org/images/2015-05/18/mcrs5wesd3ys.jpg);"></td></tr>\
</tbody>\
</table>\
</td>\
<td id="content" valign="top" style="padding-left:3px;">\
<div id="subitem1">\
<table>\
<tr>\
<td><p>Уровень Хижины лесничего: </p></td>\
<td>\
<select id="lvl"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option>\
<option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option>\
<option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option><option>32</option></select>\
</td>\
<td>Количество игроков: </td>\
<td>\
<select id="num"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>\
<option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option></select>\
</td>\
</tr>\
</table>\
</div>\
<div id="subitem2">\
<table>\
<tr>\
<td><p>Уровень Хижины лесничего: </p></td>\
<td>\
<select id="lvl"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option>\
<option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option>\
<option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option><option>32</option></select>\
</td>\
<td>Количество игроков: </td>\
<td>\
<select id="num"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>\
<option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option></select>\
</td>\
</tr>\
</table>\
</div>\
<div id="subitem3">\
<table><tr><td><b>Фаза 0:</b></td><td style="padding-left:30px"><p>Если в первые 24 часа после регистрации на аккаунте</p><p> ничего построено не было, то он удаляется.</p></td></tr>\
<tr><td colspan="2"><hr></td></tr><tr><td rowspan="3"><b>Фаза I:</b></td><td style="padding-left:30px">Первые 7 дней существования аккаунта.</td></tr><tr><td style="padding-left:30px">-Появление знака неактивности (i): 2 дня</td></tr><tr>\
<td style="padding-left:30px">-Удаление после появления (i): 2 дня</td></tr><tr><td colspan="2"><hr></td></tr><tr><td rowspan="3"><b>Фаза II:</b></td><td style="padding-left:30px">От недели до месяца.</td></tr><tr>\
<td style="padding-left:30px">-Появление знака неактивности (i): 7 дней</td></tr><tr><td style="padding-left:30px">-Удаление после появления (i): 4 дня</td></tr><tr><td colspan="2"><hr></td></tr><tr><td rowspan="3"><b>Фаза III:</b></td>\
<td style="padding-left:30px">От месяца до 3 месяцев.</td></tr><tr><td style="padding-left:30px">-Появление знака неактивности (i): 7 дней</td></tr><tr><td style="padding-left:30px">-Удаление после появления (i): 14 дней</td></tr><tr><td colspan="2"><hr>\
</td></tr><tr><td rowspan="3"><b>Фаза IV:</b></td><td style="padding-left:30px">От 3 месяцев и дольше.</td></tr><tr><td style="padding-left:30px">-Появление знака неактивности (i): 7 дней</td></tr><tr>\
<td style="padding-left:30px">-Удаление после появления (i): 30 дней</td></tr></table>\
</div>\
<div id="subitem4">\
<p><span style="font-size: 10pt"><span style="color: blue"><span style="font-size: 10pt"><strong>Общий счет</strong></span></span></span><br>\
высчитывается из суммы следующих составляющих:<br>\
<br>\
<span style="font-size: 10pt">* каждый житель - 1 очко</span><br>\
<span style="font-size: 10pt">* сумма очков других топов: 100% от топа Строителей + 100% от топа Ученых + 100% топа Генералов.</span><br>\
<strong><span style="font-family: Arial"><span style="font-size: 10pt">Общий счет = [Жители] + [Строители] + [Ученые] + [Генералы]</span></span></strong><br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Строители</span></span></strong><br>\
Основан на количестве ресурсов потраченных на все ваши здания. Эта формула не берет в рассчет скидки полученные в результате исследований - очки рассчитываются без скидок.<br>\
<br>\
* каждая единица стройматериалов - 0,01 очко<br>\
* каждая единица мрамора - 0,01 очко<br>\
* каждая единица кристаллов - 0,01 очко<br>\
* каждая единица вина - 0,01 очко<br>\
* каждая единица серы - 0,01 очко<br>\
<br>\
<span style="font-size: 10pt">Пример:</span><br>\
<strong>Академия 5</strong> уровня<em> (382 стройм., 225 кристаллов для 5го уровня + 263</em><em> стройм.</em><em> для 4го уровня + 115</em><em> стройм.</em><em> для 3го уровня + 68</em><em> стройм.</em><em> для 2го уровня + 64</em><em> стройм.</em><em> для первого <br>\
уровня = 892</em><em> стройм.</em><em>, 225</em><em> кристаллов</em><em>) + </em><strong>Торговый порт 1</strong><em> уровня (60</em><em> стройм.</em><em>) = </em><strong>(892 * 0.01) + (225 * 0.01) + (60 * 0.01) = 11.77 очков строителей</strong><br>\
<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Уровни зданий</span></span></strong><br>\
Сумма уровней всех зданий.<br>\
<br>\
* Каждый уровень здания - 1 очко.<br>\
<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Ученые</span></span></strong><br>\
Основано на количестве Баллов исследований израсходованных на <strong>завершенные</strong> исследования.<br>\
<br>\
* Каждый балл исследований - 0,02 очко.<br>\
<br>\
Например, Палубное вор\оружение (12) + Сохранение (12) = 24 * 0.02 = 0.48 пункта ученых.<br>\
<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Уровень исследований</span></span></strong><br>\
Основано на количестве <strong>завершенных</strong> исследований.<br>\
<br>\
* Каждое законченное исследование - 4 очка.<br>\
<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Генералы</span></span></strong><br>\
Основано на количестве ресурсов потраченных на каждый военный юнит или корабль.<br>\
<br>\
* Каждая единица стройматериалов - 0,02 очка<br>\
* Каждая единица мрамора - 0,02 очка<br>\
* Каждая единица вина - 0,02 очков<br>\
* Каждая единица кристаллов - 0,02 очка<br>\
* Каждая единица серы - 0,02 очка<br>\
<br>\
<span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,02) + (30 * 0,02) = <strong>1,20</strong> очка в Генералах</span><br>\
<br>\
<a href="http://board.ru.ikariam.gameforge.com/index.php?page=Thread&amp;postID=322552#post322552">Таблица очков генералов по юнитам/кораблям</a><br>\
<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Золото</span></span></strong><br>\
Основано на количестве золота.<br>\
<br>\
* Каждая единица доступного золота - 1 очко<br>\
* Каждая единица зарезервированного в торговом посте золота - 1 очко.<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Баллы атаки</span></span></strong><br>\
<br>\
Вы получите баллы за каждую единицу, убитую Вашими войсками. Этот топ определен полностью количеством ресурсов, потраченных на каждую воинскую часть.<br>\
Баллы округляются в большую сторону.<br>\
<br>\
* Каждая единица стройматериалов - 0,05 очка<br>\
* Каждая единица вина - 0,05 очков<br>\
* Каждая единица кристаллов - 0,05 очка<br>\
* Каждая единица серы - 0,05 очка<br>\
<br>\
<span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,05) + (30 * 0,05) = <strong>3</strong> балла атаки</span><br>\
<br>\
Баллы атаки падают каждый день на 5%<br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Баллы защиты</span></span></strong><br>\
<br>\
Вы получите баллы за каждую единицу, убитую вашими войсками во время защиты. Этот топ определен полностью количеством ресурсов, потраченных на каждую воинскую часть.<br>\
Баллы округляются в большую сторону.<br>\
<br>\
* Каждая единица стройматериалов - 0,05 очка<br>\
* Каждая единица вина - 0,05 очков<br>\
* Каждая единица кристаллов - 0,05 очка<br>\
* Каждая единица серы - 0,05 очка<br>\
<br>\
<span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,05) + (30 * 0,05) = <strong>3</strong> балла защиты</span><br>\
<br>\
<span style="font-size: 10pt">Баллы защиты падают каждый день на 3%</span><br>\
<br>\
<strong><span style="font-size: 10pt"><span style="color: blue">Баллы торговли</span></span></strong><br>\
<br>\
За каждую успешную сделку через торговый пост, вы получите баллы.<br>\
<br>\
<span style="font-size: 10pt">Кол-во баллов = кол-во проданных ресурсов * цену * 0,001</span><br>\
<br>\
<span style="font-size: 10pt">Баллы торговли падают каждый день на 5%</span><br>\
<br>\
<strong><span style="color: blue"><span style="font-size: 10pt">Ресурсы</span></span></strong><br>\
<br>\
<span style="font-size: 10pt">Баллы даются за:</span><br>\
<span style="font-size: 10pt">* Строительство войск</span><br>\
<span style="font-size: 10pt">* Строительство зданий<br>\
* Топ пожертвования<br>\
* Проведение экспериментов</span><br>\
<span style="font-size: 10pt">* Потребление вина в таверне</span><br>\
<br>\
<span style="font-size: 10pt">Снос зданий и роспуск войск уменьшает топ Затраты</span><br>\
<br>\
каждая единица ресурса = 0,01 топа<br>\
<br>\
<span style="font-size: 10pt"><strong><span style="color: blue">Пожертвования</span></strong></span><br>\
<br>\
<span style="font-size: 10pt">Все вложенные дерево в шахты и ресурсы в Храмы / 100</span>\</p>\
</div>\
<div id="subitem9"><table><tr><td><p id="ally" style="height:674px;overflow:auto;"></p></td><td id="coords"></td></tr></table></div>\
<div id="subitem10"></div>\
<div id="subitem12">\
<span style="font-size: 10pt"><span style="color: blue"><span style="font-size: 10pt"><strong>Общий счет</strong></span></span></span><br>высчитывается из суммы следующих составляющих:<br><br><span style="font-size: 10pt">* каждый житель - 1 очко</span><br><span style="font-size: 10pt">* сумма очков других топов: 100% от топа Строителей + 100% от топа Ученых + 100% топа Генералов.</span><br><strong><span style="font-family: Arial"><span style="font-size: 10pt">Общий счет = [Жители] + [Строители] + [Ученые] + [Генералы]</span></span></strong><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Строители</span></span></strong><br>Основан на количестве ресурсов потраченных на все ваши здания. Эта формула не берет в рассчет скидки полученные в результате исследований - очки рассчитываются без скидок.<br><br>* каждая единица стройматериалов - 0,01 очко<br>* каждая единица мрамора - 0,01 очко<br>* каждая единица кристаллов - 0,01 очко<br>* каждая единица вина - 0,01 очко<br>* каждая единица серы - 0,01 очко<br><br><span style="font-size: 10pt">Пример:</span><br><strong>Академия 5</strong> уровня<em> (382 стройм., 225 кристаллов для 5го уровня + 263</em><em> стройм.</em><em> для 4го уровня + 115</em><em> стройм.</em><em> для 3го уровня + 68</em><em> стройм.</em><em> для 2го уровня + 64</em><em> стройм.</em><em> для первого уровня = 892</em><em> стройм.</em><em>, 225</em><em> кристаллов</em><em>) + </em><strong>Торговый порт 1</strong><em> уровня (60</em><em> стройм.</em><em>) = </em><strong>(892 * 0.01) + (225 * 0.01) + (60 * 0.01) = 11.77 очков строителей</strong><br><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Уровни зданий</span></span></strong><br>Сумма уровней всех зданий. <br><br>* Каждый уровень здания - 1 очко.<br><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Ученые</span></span></strong><br>Основано на количестве Баллов исследований израсходованных на <strong>завершенные</strong> исследования.<br><br>* Каждый балл исследований - 0,02 очко.<br><br>Например, Палубное вор\оружение (12) + Сохранение (12) = 24 * 0.02 = 0.48 пункта ученых.<br><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Уровень исследований</span></span></strong><br>Основано на количестве <strong>завершенных</strong> исследований.<br><br>* Каждое законченное исследование - 4 очка.<br><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Генералы</span></span></strong><br>Основано на количестве ресурсов потраченных на каждый военный юнит или корабль.<br><br>* Каждая единица стройматериалов - 0,02 очка<br>* Каждая единица мрамора - 0,02 очка<br>* Каждая единица вина - 0,02 очков<br>* Каждая единица кристаллов - 0,02 очка<br>* Каждая единица серы - 0,02 очка<br><br><span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,02) + (30 * 0,02) = <strong>1,20</strong> очка в Генералах</span><br><br><a href="http://board.ru.ikariam.gameforge.com/index.php?page=Thread&amp;postID=322552#post322552">Таблица очков генералов по юнитам/кораблям</a><br><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Золото</span></span></strong><br>Основано на количестве золота.<br><br>* Каждая единица доступного золота - 1 очко<br>* Каждая единица зарезервированного в торговом посте золота - 1 очко.<br><br><strong><span style="font-size: 10pt"><span style="color: blue">Баллы атаки</span></span></strong><br><br>Вы получите баллы за каждую единицу, убитую Вашими войсками. Этот топ определен полностью количеством ресурсов, потраченных на каждую воинскую часть. <br>Баллы округляются в большую сторону.<br><br>* Каждая единица стройматериалов - 0,05 очка<br>* Каждая единица вина - 0,05 очков<br>* Каждая единица кристаллов - 0,05 очка<br>* Каждая единица серы - 0,05 очка<br><br><span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,05) + (30 * 0,05) = <strong>3</strong> балла атаки</span><br><br>Баллы атаки падают каждый день на 5%<br><br><strong><span style="font-size: 10pt"><span style="color: blue">Баллы защиты</span></span></strong><br><br>Вы получите баллы за каждую единицу, убитую вашими войсками во время защиты. Этот топ определен полностью количеством ресурсов, потраченных на каждую воинскую часть. <br>Баллы округляются в большую сторону.<br><br>* Каждая единица стройматериалов - 0,05 очка<br>* Каждая единица вина - 0,05 очков<br>* Каждая единица кристаллов - 0,05 очка<br>* Каждая единица серы - 0,05 очка<br><br><span style="font-size: 10pt">Пример: мечник стоит 30 стройматериалов и 30 серы и дает (30 * 0,05) + (30 * 0,05) = <strong>3</strong> балла защиты</span><br><br><span style="font-size: 10pt">Баллы защиты падают каждый день на 3%</span><br><br><strong><span style="font-size: 10pt"><span style="color: blue">Баллы торговли</span></span></strong><br><br>За каждую успешную сделку через торговый пост, вы получите баллы.<br><br><span style="font-size: 10pt">Кол-во баллов = кол-во проданных ресурсов * цену * 0,001</span><br><br><span style="font-size: 10pt">Баллы торговли падают каждый день на 5%</span><br><br><strong><span style="color: blue"><span style="font-size: 10pt">Ресурсы</span></span></strong><br><br><span style="font-size: 10pt">Баллы даются за:</span><br><span style="font-size: 10pt">* Строительство войск</span><br><span style="font-size: 10pt">* Строительство зданий<br>* Топ пожертвования<br>* Проведение экспериментов</span><br><span style="font-size: 10pt">* Потребление вина в таверне</span><br><br><span style="font-size: 10pt">Снос зданий и роспуск войск уменьшает топ Затраты</span><br><br>каждая единица ресурса = 0,01 топа<br><br><span style="font-size: 10pt"><strong><span style="color: blue">Пожертвования</span></strong></span><br><br><span style="font-size: 10pt">Все вложенные дерево в шахты и ресурсы в Храмы / 100</span>\
</div>\
<div id="subitem13">\
</div>\
<div id="subitem31">кркрк\
</div>\
<div id="subitem32">ывкукывн\
</div>\
<div id="subitem33">\
</div>\
<div id="subitem34">\
</div>\
<div id="subitem35">\
</div>\
<div id="subitem36">\
</div>\
<div id="subitem37">\
</div>\
</td>\
</tr>\
</tbody>\
</table>\
</div>'
                     );

$(document).ready(function(){
    tableCreate("subitem1");
    tableCreate("subitem2");
    temp();
    $('.wood').each(function(){
        $(this).find('tr').eq(0).find('td').eq(0).html("Уровень");
        $(this).find('tr').eq(0).find('td').eq(1).html("Стоимость");
        $(this).find('tr').eq(0).find('td').eq(2).html("Время апгрейда<br><b>суммарное</b>");
        $(this).find('tr').eq(0).find('td').eq(3).html("Производительность");
        $(this).find('tr').eq(0).find('td').eq(4).html("Рабочие");
        $(this).find('tr').eq(0).find('td').eq(5).html("Время добычи до апгрейда");
        $(this).find('tr').eq(1).find('td').eq(0).html("Стоимость<br><b>суммарная</b>");
        $(this).find('tr').eq(1).find('td').eq(1).html("На игрока<br><b>суммарная</b>");
        $(this).find('tr').eq(1).find('td').eq(2).html("Норма");
        $(this).find('tr').eq(1).find('td').eq(3).html("+Хижина лесничего");
        $(this).find('tr').eq(1).find('td').eq(4).html("+Помощь");
        $(this).find('tr').eq(1).find('td').eq(5).html("+Хижина лесничего+Помощь");
        $(this).find('tr').eq(1).find('td').eq(6).html("Норма");
        $(this).find('tr').eq(1).find('td').eq(7).html("С помощью");
        $(this).find('tr').eq(1).find('td').eq(8).html("На уровень<br><b>суммарное</b>");
    });
    for(var i = 2; i < N; i++){
        summa1 = Number(summa1) + Number(cost[i-2]);
        summa2 = Number(summa2) + Number(cost[i-2]);
        if(Math.floor((cost[i-1]/prod[i-2])/24)>0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((cost[i-1]/prod[i-2])/24) + " д. ");
        if(Math.floor(cost[i-1]/prod[i-2])%24>0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor(cost[i-1]/prod[i-2])%24 + " ч. ");
        if(Math.floor(cost[i-1]/prod[i-2]*60)%60>0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((cost[i-1]/prod[i-2])*60)%60 + " м. ");
        if(Math.floor((cost[i-1]/prod[i-2]*60*60)%60>0))$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((cost[i-1]/prod[i-2]*60*60)%60) + " с.");
        if(i!=2){
            $('.wood').find('tr').eq(i).find('td').eq(1).html(cost[i-2] + "<br><b>" + summa2 + "</b>");
            sss = "";
            $('.wood').find('tr').eq(i).find('td').eq(2).html(cost[i-2] + "<br><b>" + summa1 + "</b>");
            if(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60/24)>0)$('.wood').find('tr').eq(i).find('td').eq(3).append(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60/24) + " д. ");
            if(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60)%24>0)$('.wood').find('tr').eq(i).find('td').eq(3).append(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60)%24 + " ч. ");
            if(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60)%60>0)$('.wood').find('tr').eq(i).find('td').eq(3).append(Math.floor((7200*Math.pow(1.1,i-1)-7200)/60)%60 + " м. ");
            if(Math.floor((7200*Math.pow(1.1,i-1)-7200)%60>0))$('.wood').find('tr').eq(i).find('td').eq(3).append(Math.floor((7200*Math.pow(1.1,i-1)-7200)%60) + " с."); 
            timed = timed + Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60/24);
            timeh = timeh + Math.floor((7200*Math.pow(1.1,i-1)-7200)/60/60)%24;
            timem = timem + Math.floor((7200*Math.pow(1.1,i-1)-7200)/60)%60;
            times = times + Math.floor(7200*Math.pow(1.1,i-1)-7200)%60;
            if(times>59){timem = timem + Math.floor(times/60);times = times % 60;}
            if(timem>59){timeh = timeh + Math.floor(timem/60);timem = timem % 60;}
            if(timeh>23){timed = timed + Math.floor(timeh/24);timeh = timeh % 24;}
            if(timed!==0){$('.wood').find('tr').eq(i).find('td').eq(3).append("<br><b>" + timed + " д. " + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                         }else{if(timeh!==0){$('.wood').find('tr').eq(i).find('td').eq(3).append("<br><b>" + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                                            }else{$('.wood').find('tr').eq(i).find('td').eq(3).append("<br><b>" + timem + " м. " + times + "с.</b>");}
                              }
        }
    }
});

for(i=1;i<300;i++){
    $('#subitem'+i).css("padding","20px");
    $('#subitem'+i).css("color","#000");
    $('#subitem'+i).css("display","none");
    $('#subitem'+i).css("background-color","#FAF3D7");
    $('#subitem'+i).css("width","auto");
    $('#subitem'+i).css("border","1px solid #D2691E"); 
    $('#subitem'+i).css("overflow","auto");
    $('#subitem'+i).css("max-height","720px");
}

var xcor = [91,92,93,96,97,91,96,97,63,64,63,64,30,31,31,32,30,13,46,45,46,45,46,47,70,41,49,50,49,50,41,39,38,41,42,43,38,39,41,42,35,36,37,38,39,50,51,37,38,39,50,34,42,46,53,41,42,33,38,41,45,56,59,30,44,69,70,30,31,32,35,38,41,42,43,70,71,31,38,39,41,42,50,56,57,91,39,44,45,46,47,
           56,57,78,34,36,39,42,44,53,78,79,34,35,36,38,39,41,42,49,56,57,78,79,38,39,42,43,45,46,47,52,53,57,64,65,72,42,43,45,46,47,52,60,72,41,42,48,53,57,65,72,73,75,76,39,44,45,47,48,51,65,67,75,76,44,45,61,66,79,40,42,45,47,49,79,42,43,49,50,51,52,57,59,42,43,44,51,52,57,59,60,
           64,68,39,40,43,44,49,55,40,53, 2, 3,20,21,46, 2,20,21,52, 3,26,64,65,45,46,64,65,46,47,64,65,100,66,99,100,99,100,65,67,63,64,65,64,65,87,30,97,98,97,98,25,26, 25, 26],
    ycor = [ 1, 1, 1, 1, 1, 2, 2, 2, 9, 9,10,10,11,11,12,12,13,20,22,23,23,24,24,24,24,32,34,34,35,35,36,37,38,39,39,39,40,40,40,40,41,41,41,41,41,41,41,42,42,42,42,43,43,43,43,44,44,45,45,45,45,45,45,46,46,46,46,47,47,47,47,47,47,47,47,47,47,48,48,48,48,48,48,48,48,48,49,49,49,49,49,
           49,49,49,50,50,50,50,50,50,50,50,51,51,51,51,51,51,51,51,51,51,51,51,52,52,52,52,52,52,52,52,52,52,52,52,52,53,53,53,53,53,53,53,53,54,54,54,54,54,54,54,54,54,54,55,55,55,55,55,55,55,55,55,55,56,56,56,56,56,57,57,57,57,57,57,58,58,58,58,58,58,58,58,59,59,59,59,59,59,59,59,
           59,59,60,60,60,60,60,60,62,62,63,63,63,63,63,64,64,64,64,65,65,66,66,67,67,67,67,68,68,68,68, 68,69,69, 69,70, 70,71,72,74,74,74,75,75,77,80,84,84,85,85,99,99,100,100];

function temp(){
    var names = [["100M","","0","",""],
                 ["__pahan__","","2","",""],
                 ["_Blizzard_","","0","",""],
                 ["ADvocat","","2","",""],
                 ["BASARABEAN","kostiknet","0","",""],
                 ["Bavod","","3","",""],
                 ["bush888","bushnac","1","",""],
                 ["Certainty(Дмитрий)","","0","",""],
                 ["CYXAPb","","0","",""],
                 ["dctvjuexbq","","0","",""],
                 ["Demien","","0","",""],
                 ["DVCOM","","0","",""],
                 ["Edgar","","0","",""],
                 ["ENASANTO","","0","",""],
                 ["enchii","","2","",""],
                 ["fen1cs","","0","",""],
                 ["Filipp8510","","3","",""],
                 ["francuz5","","0","",""],
                 ["Gerasimus84","","0","",""],
                 ["Gremlin","","0","",""],
                 ["ifimidey","","0","",""],
                 ["Inkop","","0","",""],
                 ["Korvin_1981","","2","",""],
                 ["Kriger","","0","",""],
                 ["Kryla_","","0","",""],
                 ["LitiumS","","0","",""],
                 ["maxiz","","0","",""],
                 ["Migael","","2","",""],
                 ["Mihail","","0","",""],
                 ["mixer","","2","",""],
                 ["MrNiver","","0","",""],
                 ["Naitan","","0","",""],
                 ["nikolas","","2","",""],
                 ["nuts2281","","2","",""],
                 ["Oksiekschen","","0","",""],
                 ["perun","","0","",""],
                 ["peto","","0","",""],
                 ["platon","","0","",""],
                 ["punter","","3","",""],
                 ["Raskolnikov","","0","",""],
                 ["RavenSi","","0","",""],
                 ["sanan","","0","",""],
                 ["SERENKIY","","0","",""],
                 ["serg","","0","",""],
                 ["skabin","","2","",""],
                 ["slysenko","","0","",""],
                 ["Son of Rome","","0","",""],
                 ["Stoletov","","0","",""],
                 ["tigrorik","","3","",""],
                 ["TIS","","0","",""],
                 ["troll75","","0","",""],
                 ["veles","","0","",""],
                 ["vikh","","0","",""],
                 ["vikont","","0","",""],
                 ["viktor1978","","0","",""],
                 ["vint","","23","",""],
                 ["volodka313","","3","",""],
                 ["waldemar","","0","",""],
                 ["ziama","","2","",""],
                 ["Дуч","","23","",""],
                 ["Игрок 21","","0","",""],
                 ["Магнат(Максим)","megaladon27","1","",""],
                 ["Поликарпыч","","2","",""],
                 ["Сенатор","","0","",""],
                 ["Сурен13К","","0","",""],
                 ["Фантом","","0","",""],
                 ["Фрол","","2","",""],
                 ["Чуричу","","2","",""],
                 ["егорчик","","0","",""],
                 ["ковалик","","0","",""],
                 ["микроб","","0","",""],
                 ["серж100","","0","",""],
                 ["ящер","","0","",""],
                ];
    var t = document.createElement('table');
    t.setAttribute("style","text-align:center;");
    t.setAttribute("id","allylist");
    var tbody = document.createElement('tbody');
    for(i=0;i<78;i++){
        var tr = document.createElement('tr');
        if(i===0){
            tr.setAttribute("style","font-weight:bold;background-color:#FF8C00;");
        }else{
            if((i%2)===0){
                tr.style.background = "#fdf7dd";
            }else{
                tr.style.background = "#FFFAE8";
            }
        }
        for(var j=0;j<6;j++){
            var td = document.createElement('td');
            td.style.padding = "6px";
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    t.appendChild(tbody);
    document.getElementById('ally').appendChild(t);
    t.rows[0].cells[0].innerHTML = "#";
    t.rows[0].cells[1].innerHTML = "ИМЯ";
    t.rows[0].cells[2].innerHTML = "РАНГ";
    t.rows[0].cells[3].innerHTML = "ЗВАНИЕ";
    t.rows[0].cells[4].innerHTML = "СТИЛЬ ИГРЫ";
    t.rows[0].cells[5].innerHTML = "<img src='http://www.skypeassets.com/i/common/images/icons/favicon.ico' width='8%' height='8%' />";
    for(i=0;i<names.length;i++){
        t.rows[i+1].cells[0].innerHTML = i+1;
        t.rows[i+1].cells[1].innerHTML = names[i][0];
        t.rows[i+1].cells[4].innerHTML = swapper(names[i][2]);
        t.rows[i+1].cells[5].innerHTML = names[i][1];
    }
    var d = document.createElement('div');
    d.setAttribute("style","background-image:url(https://s1.ikalogs.ru/themes/default/img/themes/tools_world/coords.png);width:674px;height:674px;text-align:center;");
    d.setAttribute("id","allymap");
    document.getElementById('coords').appendChild(d);
    for(i=0;i<xcor.length;i++){
        var city = document.createElement('div');
        city.setAttribute("style","background-color:#541311;border:1px solid #76413a;width:5px;height:5px;display:block;position:absolute;margin-left:"+(30+(6*xcor[i]))+"px;margin-top:"+(30+(6*ycor[i]))+"px;");
        city.setAttribute("class","newisl");
        city.setAttribute("id",i+"newisl");
        city.onmouseover = coordsdet;
        document.getElementById('allymap').appendChild(city);
    }
}

function coordsdet(){
    
}

function swapper(val){
    if(val=="0")return "<img src='http://iconspot.ru/files/85187.png' width='24px' height='24px' />";
    if(val=="1")return "<blockquote style='border:1px solid #00FF00;background-color:rgba(0, 255, 0, 0.2);'><img src='http://s20-ru.ikariam.gameforge.com/skin/characters/40h/woodworker_r.png' width='18px' height='24px' /></blockquote>";
    if(val=="2")return "<blockquote style='border:1px solid #FF0000;background-color:rgba(255, 0, 0, 0.2);'><img src='http://s20-ru.ikariam.gameforge.com/skin/characters/military/x60_y60/y60_swordsman_faceright.png' width='17px' height='25px' /></blockquote>";
    if(val=="3")return "<blockquote style='border:1px solid #0000FF;background-color:rgba(0, 0, 255, 0.2);'><img src='http://s20-ru.ikariam.gameforge.com/skin/characters/fleet/120x100/ship_flamethrower_r_120x100.png' width='25px' height='21px' /></blockquote>";
    if((val=="32")||(val=="23"))return "<blockquote style='border:2px solid #8B4726;background-color:rgba(139, 71, 38, 0.2);'><img src='http://s20-ru.ikariam.gameforge.com/skin/characters/fleet/120x100/ship_flamethrower_r_120x100.png' width='25px' height='21px' />\
    <img src='http://s20-ru.ikariam.gameforge.com/skin/characters/military/x60_y60/y60_swordsman_faceright.png' width='17px' height='25px' /></blockquote>";
}

//$.ajax({
//  url: 'http://s20-ru.ikariam.gameforge.com/index.php?view=avatarProfile&avatarId=2212&isMission=1&destinationCityId=27828&backgroundView=island&currentIslandId=217&templateView=cityDetails&actionRequest=cc44e18b74a050e868ccd1f06a5bbcb0',
//  success: function(data){
//      alert(data.substr(data.indexOf("\u0411\u0430\u043b\u043b\u044b",121000)-100,200));
//  }
//});

var cost = ["","394","992","1732","2788","3783","5632","8139","10452","13298","18478","23213","29038","39494","49107","66010","81766","101146","134598","154304","205012","270839","311541","411229",
            "506475","665201","767723","1007959","1240496","1526516","1995717","2311042","3935195","4572136","5624478","7325850","9011590","11085051","13635591","17704143","20630781","26786470","32948197",
            "40527121","52472840","61315353","79388129","97648282","120108270","147734055","181713771","234684263"],
    prod = ["30","38","50","64","80","96","114","134","154","174","196","218","240","264","288","314","340","366","394","420","448","478","506","536","566","598","628","660","692","724","758","790",
            "824","860","894","928","964","1000","1036","1072","1110","1146","1184","1222","1260","1300","1338","1418","1458","1498","1538","1578","1618","1658","1698","1738","1778","1818","1858"];
var sel = document.getElementById("lvl").selectedIndex,
    sel2 = document.getElementById("num").selectedIndex,
    summa1 = 0,
    summa2 = 0,
    tim1 = 0,
    tim2 = 0,
    timed = 0,
    timeh = 0,
    timem = 0,
    times = 0,
    N = "54";

function tableCreate(a){
    var body = document.getElementById(a),
        t  = document.createElement('table');
    t.className = "wood";
    t.style.border = "1px solid black";
    t.cellSpacing = "0";
    t.cellPadding = "6";
    t.style.textAlign = "center";
    for(var i = 0; i < N; i++){
        var tr = t.insertRow();
        for(var j = 0; j < 12; j++){
            if(i == 1 && j === 0 || i == 1 && j == 3 || i === 0 && j == 2 || i === 0 && j == 5 || i === 0 && j == 6 || i === 0 && j == 7 || i === 0 && j == 9){
                continue;
            } else {
                var td = tr.insertCell();
                if(i<2){
                    if(i === 0 && j === 0){td.setAttribute("rowspan", "2");}
                    if(i === 0 && j == 1){td.setAttribute("colspan", "2");}
                    if(i === 0 && j == 3){td.setAttribute('rowSpan', '2');}
                    if(i === 0 && j == 4){td.setAttribute('colSpan', '4');}
                    if(i === 0 && j == 8){td.setAttribute('colSpan', '2');}
                } else {
                    if(j ===0){td.appendChild(document.createTextNode(i-1));}
                    if(j == 4){td.appendChild(document.createTextNode(prod[i-2]));}
                    if(j == 5){td.appendChild(document.createTextNode(prod[i-2]));}
                    if(j == 6){td.appendChild(document.createTextNode(Math.round(prod[i-2]*1.125)));}
                    if(j == 7){td.appendChild(document.createTextNode(Math.round(prod[i-2]*1.125)));}
                    if(j == 8){td.appendChild(document.createTextNode(prod[i-2]));}
                    if(j == 9){td.appendChild(document.createTextNode(prod[i-2]*1.5));}
                }
                td.style.border = "1px solid black";
            }
        }
    }
    body.appendChild(t);
}

$(document).on('change','#lvl', function(){
    timed = 0;
    timeh = 0;
    timem = 0;
    times = 0;
    sel = document.getElementById("lvl").selectedIndex;
    summa1 = Math.round(cost[1]/(sel2+1));
    for(var i = 2; i < N; i++){
        $('.wood').find('tr').eq(i).find('td').eq(5).text(Math.round((1+((sel)*0.02))*prod[i-2]));
        $('.wood').find('tr').eq(i).find('td').eq(7).text(Math.round((1+((sel)*0.02))*prod[i-2]*1.125));
        $('.wood').find('tr').eq(i).find('td').eq(10).text('');
        if((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])>24)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])/24) + " д. ");
        if(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))>1)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))%24) + " ч. ");
        if((((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))*60)%1!==0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])-Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])))*60) + " м. ");
        if((((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))*3600)%1!==0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60-Math.floor(((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60))*60) + " с.");
        timed = timed + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))/24);
        timeh = timeh + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))%24);
        timem = timem + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])-Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])))*60);
        times = times + Math.floor((((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60-Math.floor(((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60))*60);
        if(times>59){timem = timem + Math.floor(times/60);times = times % 60;}
        if(timem>59){timeh = timeh + Math.floor(timem/60);timem = timem % 60;}
        if(timeh>23){timed = timed + Math.floor(timeh/24);timeh = timeh % 24;}
        if(timed!==0){$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timed + " д. " + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                     }else{if(timeh!==0){$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                                        }else{$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timem + " м. " + times + "с.</b>");}
                          }

    }
});

$(document).on('change','#num', function(){
    timed = 0;
    timeh = 0;
    timem = 0;
    times = 0;
    sel2 = document.getElementById("num").selectedIndex;
    summa1 = Math.round(cost[0]/(sel2+1));
    for(var i = 2; i < N; i++){
        if(i!=2)$('.wood').find('tr').eq(i).find('td').eq(2).html(Math.round(cost[i-2]/(sel2+1)) + "<br><b>" + summa1 + "</b>");
        summa1 = summa1 + Math.round(cost[i-1]/(sel2+1));
        $('.wood').find('tr').eq(i).find('td').eq(10).text('');
        if((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])>24)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])/24) + " д. ");
        if(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))>1)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))%24) + " ч. ");
        if((((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))*60)%1!==0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])-Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])))*60) + " м. ");
        if((((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))*3600)%1!==0)$('.wood').find('tr').eq(i).find('td').eq(10).append(Math.floor((((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60-Math.floor(((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60))*60) + " с.");
        timed = timed + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))/24);
        timeh = timeh + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2]))%24);
        timem = timem + Math.floor(((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])-Math.floor((cost[i-1]/(sel2+1))/((1+sel*0.02)*prod[i-2])))*60);
        times = times + Math.floor((((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60-Math.floor(((cost[i-1]/(sel2+1))/(1+sel*0.02)*prod[i-2])*60))*60);
        if(times>59){timem = timem + Math.floor(times/60);times = times % 60;}
        if(timem>59){timeh = timeh + Math.floor(timem/60);timem = timem % 60;}
        if(timeh>23){timed = timed + Math.floor(timeh/24);timeh = timeh % 24;}
        if(timed!==0){$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timed + " д. " + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                     }else{if(timeh!==0){$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timeh + " ч. " + timem + " м. " + times + "с.</b>");
                                        }else{$('.wood').find('tr').eq(i).find('td').eq(10).append("<br><b>" + timem + " м. " + times + "с.</b>");}
                          }
    }
});

var menu = $('.menu > li > a'),
    menu_sub_box = $('.menu > li > ul'),
    menu_sub = $('.menu > li > ul > li > a'),
    menu_subsub_box = $('.menu > li > ul > li > ul');
menu_sub_box.hide();
menu_subsub_box.hide();
$(document).on('click','.menu > li > a', function(e){
    e.preventDefault();
    if(!$(this).hasClass('active')){
        menu.removeClass('active');
        menu_sub_box.filter(':visible').slideUp('normal');
        $(this).addClass('active').next().stop(true,true).slideDown('normal');
    } else {
        $(this).removeClass('active');
        $(this).next().stop(true,true).slideUp('normal');
    }
});
$(document).on('click','.menu > li > ul > li > a', function(e){
    e.preventDefault();
    if(!$(this).hasClass('active')){
        menu_sub.removeClass('active');
        menu_subsub_box.filter(':visible').slideUp('normal');
        $(this).addClass('active').next().stop(true,true).slideDown('normal');
    } else {
        $(this).removeClass('active');
        $(this).next().stop(true,true).slideUp('normal');
    }
});

$(document).on('click','.menu > li > ul > li', function(){
    for(i=0;i<300;i++)
        if($(this).attr("class")==("subitem"+i)){
            var s = $(this).attr("class");
            var ss = '#' + s;
            $('#content div').css('display','none');
            $('div'+ss).css('display','block');
            $('#allymap').css("display","block");
            $('.newisl').each(function(){
                this.style.display = "block";
            });
        }
});

$(document).on('click','.menu > li > ul > li > ul > li', function(){
    for(i=0;i<300;i++)
        if($(this).attr("class")==("subitem"+i)){
            var s = $(this).attr("class");
            var ss = '#' + s;
            $('#content div').css('display','none');
            $('div'+ss).css('display','block');
        }
});