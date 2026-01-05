// ==UserScript==
// @name           HWM GO Helper
// @namespace      https://greasyfork.org/ru/users/170936
// @description    Помощник ГО (версия от 2021.11.18)
// @author         ElMarado (Based on script Mantens) (Update by CheckT)
// @version        6.31
// @include        https://www.heroeswm.ru/group_wars.php*
// @include        https://www.heroeswm.ru/plstats_hunters.php*
// @include        https://www.heroeswm.ru/home.php*
// @include        https://www.heroeswm.ru/map.php*
// @include        https://www.lordswm.com/group_wars.php*
// @include        https://www.lordswm.com/plstats_hunters.php*
// @include        https://www.lordswm.com/home.php*
// @include        https://www.lordswm.com/map.php*
// @include        http://178.248.235.15/group_wars.php*
// @include        http://178.248.235.15/plstats_hunters.php*
// @include        http://178.248.235.15/home.php*
// @include        http://178.248.235.15/map.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @license        GPL-3.0+
// @downloadURL https://update.greasyfork.org/scripts/11692/HWM%20GO%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11692/HWM%20GO%20Helper.meta.js
// ==/UserScript==

// Update by CheckT
// небольшая доработка скрипта hwm_GO_exp от ElMarado (Based on script Mantens)
//    - хранение настроек независимо по игрокам
//    - кнопка "пометить всех птиц"
// Оригинал https://greasyfork.org/ru/scripts/11692-hwm-go-exp

(function () {
  var gm_prefix = 'go_'+getPlayerId()+'_';  //префикс всех хранимых данных

var max_exp          = 0;
var version          = "6.31 (2021.11.18)";
var url_cur          = location.href;
var url_home         = "home.php";
var url_map          = "map.php";
var url_war          = "group_wars.php";
var str_url          = "https://greasyfork.org/ru/scripts/398040";
var all_tables       = document.getElementsByTagName('div');
var short_button     = gm_get_bool("short_button");
var enable_Exp_Half  = gm_get_bool("enable_Exp_Half");
var enable_5_procent = gm_get_bool("enable_5_procent");
var only_Gud_ExpUm   = gm_get_bool("only_Gud_ExpUm");
var find_Hunt        = gm_get_bool("find_Hunt");
var beep_if_free     = gm_get_bool("beep_if_free");
var show_archive     = gm_get_bool("show_archive");
var grin_Pis         = gm_get_bool("grin_Pis");
var pic_enable       = gm_get_bool("pic_enable");
var show_HP          = gm_get_bool("show_HP", true);
var skip_no_half     = gm_get_bool("skip_no_half");
var pl_level         = gm_get("hunt_exp_pl_level", "none"); //ур.героя
var koef             = gm_get("koef_dop_exp", 1.0);         //коэф перекача
var limit_exp        = gm_get("limit_exp", 0);              //С какого порога опыта пропускать охоты
var skip_mode        = gm_get_bool("skip_mode", true);      //Пропускать по опыту или по списку: true - опыт, false - список
var skip_base        = gm_get("skip_base", "");             //h база пропусков на существ: 0 - пропускать, 1 - оставить
//********************
var str_pl_lvl          = ustring("Боевой уровень: ");
var str_kol             = ustring('шт.');
var str_sum_exp         = ustring("За них дадут <b> STR1dopSTR </b> опыта. Потом их будет ~STR6 шт.");
var str_kill_now        = ustring("Убей сейчас! На STR9 уровне за них дадут <b> STR10 </b> опыта.");
var str_hlp_exp         = ustring("За убийство с помощником (50/50) Вам дадут <b> STR2 </b> опыта. В следующий раз предложат ~STR7 шт.");
var str_min_kol         = ustring("Для Min (~5%) прироста надо убить не более STR3 шт (STR4 опыта). В следующий раз предложат ~STR8 шт.");
var str_exp_helper      = ustring("Опыт помощника: [70..133]*Уровень*Набранная умка*[1.1-Зелье].");
var str_exp             = ustring("&nbspопыта.");
var str_settings_1      = ustring("&nbsp&nbspНастройки ГО&nbsp&nbsp");
var str_settings_2      = ustring("&nbsp&nbspГО&nbsp&nbsp");
var str_start           = ustring("Скрипт: Помощник ГО. Версия: ");
var str_show_1          = ustring("Отображать <b>опыт с помощником</b>, если убьёте по 50%");
var str_show_2          = ustring("Отображать сколько убить существ <b>для минимального прироста</b> существ");
var str_show_3          = ustring("Отображать формулу опыта помощника (при выгодных охотах)");
var str_hilight         = ustring("Подсвечивать <b>охоты с выгодной экспоумкой</b> <font color=grey>(на странице групповых боёв)</font>");
var str_find_hunt       = ustring("<b>Поиск чужих охот</b> <font color=grey>(групповые бои)</font>. Обновление: <b>15с.</b> ");
var str_beep_if_free    = ustring("Если нашёл, <b>вывод звука</b>:");
var str_show_archive    = ustring("Отображать <b>ссылки на рекорды</b> из архива");
var str_Grin_Pis        = ustring("Включить режим<b><font color=green size=3>&nbspGreenPeace&nbsp</font></b>(скрывать предложения охот)");
var str_show_HP         = ustring("Отображать <b>суммарные HP существ</b>");
var str_short_button    = ustring("Сделать кнопку <b><font color=royalblue>&nbspНастройки ГО&nbsp</font></b> короткой (<b><font color=royalblue>&nbspГО&nbsp</font></b>)");
var str_koef_0          = ustring("Текущий коэффициент перекача:&nbsp");
var str_koef_1          = ustring("Введите новый коэффициент перекача от 1.0 до 9.9999: ");
var str_skip_select_1   = ustring("Пропускать существ: ");
var str_skip_select_2   = ustring("по опыту или ");
var str_skip_select_3   = ustring("по списку ");
var str_skip_hunt       = ustring("Пропускать охоты с опытом больше чем:");
var str_title_1         = ustring("Если значение 0, то опыт не учитывается");
var str_pic_enable      = ustring("Отображать картинки существ в списке")
var str_no_skip         = ustring("Вы уже в заявке!");
var str_skip_enable     = ustring("Пройти мимо");
var str_arh_record      = ustring("Рекорд из архива (до 01.03.2015)");
var str_need_skip       = ustring("ГO. Охоты можно пропустить.");
var str_auto_skip       = ustring("ГO. Охоту пропускаю.");
var str_hunt_found      = ustring("ГO. Охота найдена.");
var str_show_archive_r  = ustring("Архив рекордов до 01.03.2015");
var str_hide_archive_r  = ustring("Текущие рекорды");
var str_update          = ustring("Проверить обновление скрипта.");
var str_autor           = ustring("Сообщить о найденной ошибке.");
var str_url_aut         = ustring("/sms-create.php?mailto=&subject=Скрипт: Помощник ГО v. ")+version+ustring(". Найдена ошибка:");
var str_zagl1_list      = ustring("Выберите существ для охоты. Всего ");
var str_zagl2_list      = ustring(".");
var str_all_mark        = ustring("Пометить всех");
var str_all_unmark      = ustring("Снять у всех");
var str_all_flying      = ustring("Все летающие");
var str_all_noflying    = ustring("Кроме летающих");
var str_skip_no_half    = ustring(" и <b><font color=royalblue>(</font></b>оставлять [1/2] или ");
var str_diamond_search  = ustring(" бриллианта");
//*************** Конвертация ********************************
function hex_2_bin(hex) {
var hex2bin = {
  0: "0000",  1: "0001",  2: "0010",  3: "0011",
  4: "0100",  5: "0101",  6: "0110",  7: "0111",
  8: "1000",  9: "1001",  A: "1010",  B: "1011",
  C: "1100",  D: "1101",  E: "1110",  F: "1111"
};
  var str_bin = "";
  for (var i=0; i<hex.length;i++) str_bin +=hex2bin[hex[i]];
  return str_bin;
}
//*************** Конвертация ********************************
function bin_2_hex(bin) {
var bin2hex = {
  "0000": "0",  "0001": "1",  "0010": "2",  "0011": "3",
  "0100": "4",  "0101": "5",  "0110": "6",  "0111": "7",
  "1000": "8",  "1001": "9",  "1010": "A",  "1011": "B",
  "1100": "C",  "1101": "D",  "1110": "E",  "1111": "F"
};
  var n_hex_sym = Math.ceil(bin.length/4);
  var str_hex = "";
  var sym4;
  for (var i=0; i< n_hex_sym; i++) {
    sym4 = bin.substr(i*4,4);
    str_hex += bin2hex[sym4];
  }
  return str_hex;
}
//***********************************************************
function fill_hex_massive (n, s) {
  var arr = "";
  for (var i = 0; i < n; i++) arr += s;
  return arr;
}
//***********************************************************
function show_List() {
  if (url_cur.indexOf('map.php') == -1) return;
  if (skip_mode) {              //если пропуск по опыту, то кнопку вызова списка не отображать
    var elem = document.getElementById("get_list_go");
    if (elem != null) elem.parentNode.removeChild(elem);  //если кнопка уже есть, то её убрать
    return;
  }
//  var x2= document.querySelector("div >a[href*='ecostat.php']");
  var x2= document.querySelector("div[class*='global_container_block_header']");
  if (x2 == null) return;
  x2 = x2.parentNode;
  var str_settings = "\u21B4";
  var d = document.createElement('div');
  d.id="get_list_go";
  d.setAttribute('style', 'position: absolute; margin: 0px 0px 0px 900px; text-align: center;');   //Положение кнопки, для вызова настроек
   d.innerHTML = '<style> .hwm_go * {font-size: 12px; color: #592C08;} .cell_go {white-space: nowrap; height: 20px; font-weight: bold; cursor: pointer; -webkit-filter: brightness(1.2); filter: brightness(120%); position: relative; display: inline-block; background: url(i/btns/job_fl_btn_bg.png) #d4b87e; background-size: 100% 100%; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; transition-duration: .1s; -webkit-transition-duration: .1s; -moz-transition-duration: .1s; -o-transition-duration: .1s; -ms-transition-duration: .1s; box-shadow: inset 0 0 0 1px #fce6b0, inset 0 0 0 2px #a78750, 0 0 0 1px rgba(0,0,0,.13);} </style>' +
  '<table class="list_go" width=20px> <tr height=20>' +                                          // Размер кнопки и фон, для вызова настроек
//  '<td class="cell_list" style="cursor:pointer" id="set_list"><font style="font-size:20px;">'+str_settings+'</font></td>' +
  '<td class="cell_list" style="white-space: nowrap; height: 20px; font-weight: bold; cursor: pointer; position: relative; display: inline-block; background: url(i/btns/job_fl_btn_bg.png) #d4b87e; background-size: 100% 100%; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; transition-duration: .1s; -webkit-transition-duration: .1s; -moz-transition-duration: .1s; -o-transition-duration: .1s; -ms-transition-duration: .1s; box-shadow: inset 0 0 0 1px #fce6b0, inset 0 0 0 2px #a78750, 0 0 0 1px rgba(0,0,0,.13);" id="set_list">&nbsp<img width="18" src="//dcdn.heroeswm.ru/i/mobile_view/icons_add/pismo.png">&nbsp</td>' +  '</tr> </table>';
  x2.insertBefore(d,x2.firstChild);                                                              //Вставка куска
  addEvent( $("set_list"), "click", settings_list );                                             //Привязка к куску на клик вызов функции
//************
function list_close()
{
  var bg = $('bgOverlay');
  var bgc = $('bgCenter');
  bg.parentNode.removeChild(bg);
  bgc.parentNode.removeChild(bgc);
}
//************
function settings_list()
{
  var bg = $('bgOverlay');
  var bgc = $('bgCenter');
  var bg_height = ScrollHeight();
  if ( !bg )
  {
    bg = document.createElement('div');
    document.body.appendChild( bg );
    bgc = document.createElement('div');
    document.body.appendChild( bgc );
  }
  bg.id = 'bgOverlay';
  bg.style.position = 'absolute';
  bg.style.left = '0px';
  bg.style.width = '100%';
  bg.style.background = "#000000";
  bg.style.opacity = "0.5";
  bg.style.zIndex = "1100";
  bgc.id = 'bgCenter';
  bgc.style.position = 'absolute';
  bgc.style.left = ( ( ClientWidth() - 420 ) / 2 ) + 'px';
  bgc.style.width = '475px';
  bgc.style.height = '475px';
  bgc.style.overflow = 'auto';            //scrolling
  bgc.style.background = "#F6F3EA";
  bgc.style.zIndex = "1105";
  addEvent(bg, "click", list_close);                                      //клик вне окна
  //форма и внешний вид окно настроек
  var s_style = "<style>.cre_mon_image2 {position:absolute;top:0;left:0;}.cre_creature {font-weight:400;font-family: 'Arial',sans-serif; width: 60px; position: relative; letter-spacing: normal;font-size: 16px; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; display:inline-block;}</style>";
  var s_innerHTML = s_style+'<div style="border:0px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr2" title="Close">x</div>'+
  //заголовок окна настроек
  '<table cellspacing="0" ><tr><td colspan=2><b>'+str_zagl1_list+'<font style="color:#FF0000;"> '+n_monstrs+'</font> '+str_zagl2_list+'</b><hr/></td></tr>'+
  //пропуск охот по опыту
  '<tr><td colspan=2>'+
    '<input type="submit" id="set_all_mark_ok"   value="'+str_all_mark  +'">'+
    '<input type="submit" id="set_all_flying_ok" value="'+str_all_flying+'">'+
    '<input type="submit" id="set_all_noflying_ok" value="'+str_all_noflying+'">'+
    '<input type="submit" id="set_all_unmark_ok" value="'+str_all_unmark+'">'+
  '</td></tr>';
  var n_m = 0;
  var s_bgcolor;
  var s_pic_out="";
  for (var key in mob_rus_exp) { //перебор существ из базы и выводим чекбоксы с именем существа
    if (skip_bin_base[n_m]=="1") s_bgcolor="style=background-color:#B0FFB0;"; else s_bgcolor="";
    if (pic_enable) s_pic_out = '<tr><td><div class="cre_creature"><img width="60" height="50" border="0" src="http://hwm.cdnvideo.ru/i/portraits/'+mob_rus_exp[$ustring(key)][2]+'anip33.png"> <img class="cre_mon_image2" width="60" height="50" border="0" src="http://hwm.cdnvideo.ru/i/army_html/frame_lvl1_120x100_woa.png?v=1"></td>';//выводим картинку
    s_innerHTML += s_pic_out+
    '<td '+s_bgcolor+' id=cell_'+n_m+'><label><input type=checkbox '+(skip_bin_base[n_m]==1?"checked":"")+' id=set_monstr_'+n_m+'>'+  //выводим чекбокс
    '<font style="font-size:16px; vertical-align:center">'+ustring(key)+'</font></label></div></td></tr>';          //выводим имя существа
    n_m++;
  }
  s_innerHTML +='</table>';                 //концовка
  bgc.innerHTML = s_innerHTML;
  n_m = 0;
//********* назначение событий *******
  for (var key in mob_rus_exp) {  appendEvent(n_m++); }                                     //назначаем на события на каждый чек бокс
  document.getElementById('set_all_mark_ok').onclick = function(){all_mark_ok("F")};        //Пометить все
  document.getElementById('set_all_flying_ok').onclick = function(){all_flying_mark()};     //Пометить летающих
  document.getElementById('set_all_noflying_ok').onclick = function(){all_noflying_mark()}; //Кроме летающих
  document.getElementById('set_all_unmark_ok').onclick = function(){all_mark_ok("0")};      //Сбросить все
  addEvent($("bt_close_tr2"),   "click", list_close);                                       //крестик в углу

  bg.style.top = '0px';
  bg.style.height = bg_height + 'px';
  bgc.style.top = ( window.pageYOffset + 155 ) + 'px';
  bg.style.display = '';
  bgc.style.display = '';
}
//********* обработчики полей ввода *******
  function appendEvent(n) { document.getElementById('set_monstr_'+n).onclick = function(){change_enable_mostr(n)};}
  function change_enable_mostr(n) {         //Обработка чекбоксов с изменением массивов
    var s_bgcolor;
    skip_bin_base = skip_bin_base.substr(0,n)+ (1-skip_bin_base[n]) +skip_bin_base.substr(n+1);
    skip_base = bin_2_hex(skip_bin_base);
    if (skip_bin_base[n]=="1") s_bgcolor="#B0FFB0"; else s_bgcolor="";
    document.getElementById("cell_"+n).style.backgroundColor = s_bgcolor;
    gm_set("skip_base", skip_base);
  }
  function all_mark_ok(zn){                 //заполняем массив значением zn
    skip_base = fill_hex_massive(skip_base.length, zn);
    skip_bin_base = hex_2_bin(skip_base);
    var n = 0;
    var s_bgcolor;
    var bool = true;
    if (zn == "0") bool = false;
    for (var key in mob_rus_exp) {
      if (skip_bin_base[n]=="1") s_bgcolor="#B0FFB0"; else s_bgcolor="";
      document.getElementById("cell_"+n).style.backgroundColor = s_bgcolor;
      document.getElementById('set_monstr_'+n++).checked = bool;
    }
    gm_set("skip_base", skip_base);
  }

  function all_flying_mark(){               //заполняем летающих существ
    var n = 0;
    for (var key in mob_rus_exp) {
      if(mob_rus_exp[key][3] == 1){
        skip_bin_base = skip_bin_base.substr(0,n)+"1"+skip_bin_base.substr(n+1);
        document.getElementById("cell_"+n).style.backgroundColor = "#B0FFB0";
        document.getElementById('set_monstr_'+n).checked = true;
      }
      n++;
    }
    skip_base = bin_2_hex(skip_bin_base);
    gm_set("skip_base", skip_base);
  }

  function all_noflying_mark(){              //заполняем всех кроме летающих существ
    var n = 0;
    for (var key in mob_rus_exp) {
      if(mob_rus_exp[key][3] == 0){
        skip_bin_base = skip_bin_base.substr(0,n)+"1"+skip_bin_base.substr(n+1);
        document.getElementById("cell_"+n).style.backgroundColor = "#B0FFB0";
        document.getElementById('set_monstr_'+n).checked = true;
      }
      n++;
    }
    skip_base = bin_2_hex(skip_bin_base);
    gm_set("skip_base", skip_base);
  }

//************
function $(id) { return document.querySelector("#"+id); }
function addEvent(elem, evType, fn) {
  if (elem.addEventListener) elem.addEventListener(evType, fn, false);
  else  if (elem.attachEvent) elem.attachEvent("on" + evType, fn);
    else elem["on" + evType] = fn;
}
function ClientWidth() {return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;}
function ScrollHeight() {return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);}
}
//************  Начало фрагментов кода от (C) Demin с моими вставками и комментариями **********************************
function showSettings() {
  if (url_cur.indexOf('map.php') == -1) return;
//  var x1= document.querySelector("div >a[href*='ecostat.php']");
  var x1= document.querySelector("div[class*='global_container_block_header']");
  if (x1 == null) return;
  x1 = x1.parentNode;
  var str_settings, width_but, left_pos;
  if (short_button==0)  { str_settings = str_settings_1; width_but = 80; left_pos = 493;}
  else      { str_settings = str_settings_2; width_but = 20; left_pos = 468;}
  var d = document.createElement('div');
  d.setAttribute('style', 'position: absolute; margin: 0px 0px 0px 780px; text-align: center;');    //Положение кнопки, для вызова настроек
   d.innerHTML = '<style> .hwm_go * {font-size: 12px; color: #592C08;} .cell_go {white-space: nowrap; height: 20px; font-weight: bold; cursor: pointer; -webkit-filter: brightness(1.2); filter: brightness(120%); position: relative; display: inline-block; background: url(i/btns/job_fl_btn_bg.png) #d4b87e; background-size: 100% 100%; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; transition-duration: .1s; -webkit-transition-duration: .1s; -moz-transition-duration: .1s; -o-transition-duration: .1s; -ms-transition-duration: .1s; box-shadow: inset 0 0 0 1px #fce6b0, inset 0 0 0 2px #a78750, 0 0 0 1px rgba(0,0,0,.13);} </style>' +
  '<table class="hwm_go" width='+width_but+'px> <tr height=20>' +                                           // Размер кнопки и фон, для вызова настроек
  '<td class="cell_go" style="cursor:pointer" id="set_go"><font style="font-size:12px;">'+str_settings+'</font></td>' +
  '</tr> </table>';
  x1.insertBefore(d,x1.firstChild);                                                                         //Вставка куска
  addEvent( $("set_go"), "click", settings_go );                                                            //Привязка к куску на клик вызов функции
//************
function settings_go_close()
{
  var bg = $('bgOverlay');
  var bgc = $('bgCenter');
  bg.parentNode.removeChild(bg);
  bgc.parentNode.removeChild(bgc);
}
//************
function settings_go()
{
  var bg = $('bgOverlay');
  var bgc = $('bgCenter');
  var bg_height = ScrollHeight();
  if ( !bg )
  {
    bg = document.createElement('div');
    document.body.appendChild( bg );
    bgc = document.createElement('div');
    document.body.appendChild( bgc );
  }
  bg.id = 'bgOverlay';
  bg.style.position = 'absolute';
  bg.style.left = '0px';
  bg.style.width = '100%';
  bg.style.background = "#000000";
  bg.style.opacity = "0.5";
  bg.style.zIndex = "1100";
  bgc.id = 'bgCenter';
  bgc.style.position = 'absolute';
  bgc.style.left = ( ( ClientWidth() - 600 ) / 2 ) + 'px';
  bgc.style.width = '610px';
  bgc.style.background = "#F6F3EA";
  bgc.style.zIndex = "1105";
  addEvent(bg, "click", settings_go_close);
  //форма и внешний вид окно настроек
  //общая рамка
  bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;">'+
  //заголовок окна настроек / версия скрипта / количество существ
  '<table><tr><td colspan=3><b>'+str_start+'<font style="color:#0070FF;">'+version+'</font>. Всего существ: <font style="color:#FF0000;">'+n_monstrs+'</font>'+str_zagl2_list+'</b>'+
  //кнопка закрытия
  '<div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Close">x</div><hr/>'+
  //Суммарное HP.
  '<label><input type=checkbox '+html_if_checked(show_HP)+' id=set_show_HP title=""> '+str_show_HP+'</label><br>'+
  //Опыт с помощником 50/50
  '<label><input type=checkbox '+html_if_checked(enable_Exp_Half)+' id=set_enable_Exp_Half title=""> '+str_show_1+'</label><br>'+
  //кол-во для мин.прироста
  '<label><input type=checkbox '+html_if_checked(enable_5_procent)+' id=set_enable_5_procent title=""> '+str_show_2+'</label><hr/>'+
  //подсвечивать выгодные охоты
  '<label><input type=checkbox '+html_if_checked(only_Gud_ExpUm)+' id=set_only_Gud_ExpUm title=""> '+str_hilight+'</label><br>'+
  //Искать чужие охоты (в групповых боях). Обновление: 5с.
  '<label><input type=checkbox '+html_if_checked(find_Hunt)+' id=set_find_Hunt title=""> '+str_find_hunt+'</label>'+
  //Предупреждать, если есть незаполненная охота.
  '<label>'+str_beep_if_free+'<input type=checkbox '+html_if_checked(beep_if_free)+' id=set_beep_if_free title=""></label><hr/>'+
  //Рекорд из архива.
  '<label><input type=checkbox '+html_if_checked(show_archive)+' id=set_show_archive title=""> '+str_show_archive+'</label> <img src="https://dcdn.heroeswm.ru/i/icons/attr_knowledge.png" width="18"><br>'+
  //Грин Пис.
  '<label><input type=checkbox '+html_if_checked(grin_Pis)+' id=set_Grin_Pis title=""> '+str_Grin_Pis+'</label><hr/>'+
  '</td></tr>'+
  //коэфициент перекача
  '<tr><td colspan=3>'+
  str_koef_0+'<font style="color:#0070FF;"><b id=k_p>'  +Number(koef).toFixed(4) +'</b></font><br>' +
  str_koef_1+' <input id="set_koef" value="'    +Number(koef).toFixed(4) +'"size="4" maxlength="6"> <input type="submit" id="set_koef_ok" value="OK"><hr/>'+
  //Выбор пропусков str_skip_select_3
	str_skip_select_1+
	'<label><input type=checkbox '+(skip_mode==1?"checked":"")+' id=set_skip_mode1 title="">'+str_skip_select_2+'</label>'+
	'<label><input type=checkbox '+(skip_mode==0?"checked":"")+' id=set_skip_mode2 title="">'+str_skip_select_3+'</label>'+
	'<label>'+str_skip_no_half+'<img width="16" height="16" border="0" title="Бриллианты" src="http://hwm.cdnvideo.ru/i/diamond.gif">'+
	'<input type=checkbox '+(skip_no_half==1?"checked":"")+' id=set_skip_no_half title=""><b><font style="color:#4169E1;">)</font></b></label></td></tr>'+
  //пропуск охот по опыту
  '<tr><td width="52%">'+str_skip_hunt+'</td><td colspan=2 width="48%" align="left" title="'+str_title_1+'"> '+
  '<input id="set_limit_exp" value="'+limit_exp+'" size="5" maxlength="6"><input type="submit" id="set_limit_exp_ok" value="OK"></td></tr>'+
  '<tr><td colspan=3>'+
  //Выбор Отображать картинки в списке или нет
  '<label><input type=checkbox '+html_if_checked(pic_enable)+' id=set_pic_enable title=""> '+str_pic_enable+'</label><hr/>'+
  //Сделать кнопку настройки короткую/длинную
  '<label><input type=checkbox '+html_if_checked(short_button)+' id=set_short_button title=""> '+str_short_button+'</label><hr/></td></tr>'+
  //ссылка на сайт скрипта
 '<tr><td width="40%"><a href="'+str_url+'" target=_blanc>'+str_update+'</a></td><td colspan=2 width="60%" align="right"><a href="'+str_url_aut+'" target=_blanc>'+str_autor+'</a></td></tr></table>'; //концовка
  //назначение вызова функция при событиях кнопок и чекбоксов
  addEvent($("bt_close_tr"),          "click", settings_go_close);       //крестик в углу
  addEvent($("set_enable_Exp_Half"),  "click", change_enable_Exp_Half);  //чек-бокс
  addEvent($("set_enable_5_procent"), "click", change_enable_5_procent); //чек-бокс
  addEvent($("set_only_Gud_ExpUm"),   "click", change_only_Gud_ExpUm);   //чек-бокс
  addEvent($("set_find_Hunt"),        "click", change_find_Hunt);        //чек-бокс
  addEvent($("set_beep_if_free"),     "click", change_beep_if_free);     //чек-бокс
  addEvent($("set_show_archive"),     "click", change_show_archive);     //чек-бокс
  addEvent($("set_show_HP"),          "click", change_show_HP);          //чек-бокс
  addEvent($("set_Grin_Pis"),         "click", change_Grin_Pis);         //чек-бокс
  addEvent($("set_short_button"),     "click", change_short_button);     //чек-бокс
  addEvent($("set_koef_ok"),          "click", change_koef);             //поле ввода
  addEvent($("set_limit_exp_ok"),     "click", change_limit_exp);        //поле ввода
  addEvent($("set_skip_mode1"),       "click", change_skip_mode);        //радио
  addEvent($("set_skip_mode2"),       "click", change_skip_mode);        //радио
  addEvent($("set_skip_no_half"),     "click", change_skip_no_half);     //радио
  addEvent($("set_pic_enable"),       "click", change_pic_enable);       //чек-бокс
  bg.style.top = '0px';
  bg.style.height = bg_height + 'px';
  bgc.style.top = ( window.pageYOffset + 155 ) + 'px';
  bg.style.display = '';
  bgc.style.display = '';
}
//********* обработчики полей ввода *******
function change_skip_mode()
{
  skip_mode = !skip_mode;
  document.getElementById('set_skip_mode1').checked = skip_mode;
  document.getElementById('set_skip_mode2').checked = !skip_mode;
  show_List();
  gm_set_bool("skip_mode", skip_mode);
}
function change_koef()
{
  if ( Number( $("set_koef").value ) >= 1 )  koef = $("set_koef").value; else koef = Number(1.0);
  document.getElementById('k_p').innerHTML = Number(koef).toFixed(4);
  gm_set("koef_dop_exp", koef);
}
function change_limit_exp()
{
  if ( Number( $("set_limit_exp").value ) >= 0 )  limit_exp = Number($("set_limit_exp").value).toFixed(0); else limit_exp = 0;
  gm_set("limit_exp", limit_exp);
}
//*********** обработчики чек-боксов *****
function change_skip_no_half()     {gm_set_bool("skip_no_half", skip_no_half = !skip_no_half);}
function change_enable_Exp_Half()  {gm_set_bool("enable_Exp_Half", enable_Exp_Half = !enable_Exp_Half);}
function change_enable_5_procent() {gm_set_bool("enable_5_procent", enable_5_procent = !enable_5_procent);}
function change_only_Gud_ExpUm()   {gm_set_bool("only_Gud_ExpUm", only_Gud_ExpUm = !only_Gud_ExpUm);}
function change_find_Hunt()        {gm_set_bool("find_Hunt", find_Hunt = !find_Hunt);}
function change_beep_if_free()     {gm_set_bool("beep_if_free", beep_if_free = !beep_if_free);}
function change_show_archive()     {gm_set_bool("show_archive", show_archive = !show_archive);}
function change_show_HP()          {gm_set_bool("show_HP", show_HP = !show_HP);}
function change_Grin_Pis()         {gm_set_bool("grin_Pis", grin_Pis = !grin_Pis);}
function change_pic_enable()       {gm_set_bool("pic_enable",pic_enable = !pic_enable);}
function change_short_button()     {gm_set_bool("short_button",short_button = !short_button);
  if (short_button==0)  { str_settings = str_settings_1; width_but = 80; left_pos = 493;}
  else      { str_settings = str_settings_2; width_but = 20; left_pos = 468;}
  d.setAttribute('style', 'position: absolute; margin: 0px 0px 0px 780px; text-align: center;');        //Положение кнопки, для вызова настроек
   d.innerHTML = '<style> .hwm_go * {font-size: 12px; color: #592C08;} .cell_go {white-space: nowrap; height: 20px; font-weight: bold; cursor: pointer; -webkit-filter: brightness(1.2); filter: brightness(120%); position: relative; display: inline-block; background: url(i/btns/job_fl_btn_bg.png) #d4b87e; background-size: 100% 100%; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; transition-duration: .1s; -webkit-transition-duration: .1s; -moz-transition-duration: .1s; -o-transition-duration: .1s; -ms-transition-duration: .1s; box-shadow: inset 0 0 0 1px #fce6b0, inset 0 0 0 2px #a78750, 0 0 0 1px rgba(0,0,0,.13);} </style>' +
  '<table class="hwm_go" width='+width_but+'px> <tr height=20>' +                                               // Размер кнопки и фон, для вызова настроек
  '<td class="cell_go" style="cursor:pointer" id="set_go"><font style="font-size:12px;">'+str_settings+'</font></td>' +
  '</tr> </table>';
  addEvent( $("set_go"), "click", settings_go );                                                                //Привязка к куску на клик вызов функции
}
//********** непонятно что, взято 1:1 у Demin ******
function $(id) { return document.querySelector("#"+id); }
function addEvent(elem, evType, fn) {
  if (elem.addEventListener) elem.addEventListener(evType, fn, false);
  else  if (elem.attachEvent) elem.attachEvent("on" + evType, fn);
    else elem["on" + evType] = fn;
}
function ClientWidth()  {return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;}
function ScrollHeight() {return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);}
}
//************  Конец фрагментов кода от (C) Demin **********************************
var sectors = {
  "cx=50&cy=50":1,  //Empire Capital
  "cx=51&cy=50":2,  //East River
  "cx=50&cy=49":3,  //Tiger Lake
  "cx=51&cy=49":4,  //Rogues' Wood
  "cx=50&cy=51":5,  //Wolf Dale
  "cx=50&cy=48":6,  //Peaceful Camp
  "cx=49&cy=51":7,  //Lizard Lowland
  "cx=49&cy=50":8,  //Green Wood
  "cx=49&cy=48":9,  //Eagle Nest
  "cx=50&cy=52":10, //Portal Ruins
  "cx=51&cy=51":11, //Dragon Caves
  "cx=49&cy=49":12, //Shining Spring
  "cx=48&cy=49":13, //Sunny Sity
  "cx=52&cy=50":14, //Magma Mines
  "cx=52&cy=49":15, //Bear Mountain
  "cx=52&cy=48":16, //Fairy Trees
  "cx=53&cy=50":17, //Harbour City (Port City)
  "cx=53&cy=49":18, //Mithril Coast
  "cx=51&cy=52":19, //GreatWall
  "cx=51&cy=53":20, //Titans' Valley
  "cx=52&cy=53":21, //Fishing Village
  "cx=52&cy=54":22, //Kingdom Capital
  "cx=48&cy=48":23, //Ungovernable Steppe
  "cx=51&cy=48":24, //Crystal Garden
  "cx=53&cy=52":25, //East Island
  "cx=49&cy=52":26, //The Wilderness
  "cx=48&cy=50":27  //Sublime Arbor
}
//****************************************************
var mob_rus_exp = {   //Cтруктура: [опыт,HP,код,птица]
  "Абордажники":[30,16,"bpirate",0],
  "Адепты":[121,80,"zealot",0],
  "Адские жеребцы":[136,50,"nightmare",0],
  "Адские жнецы":[250,99,"zhryak",0],
  "Адские псы":[33,15,"demondog",0],
  "Айсберговые элементали":[50,90,"iceelb",1],
  "Алмазные големы":[110,60,"diamondgolem",0],
  "Ангелы":[330,180,"angel",1],
  "Арбалетчики":[19,10,"marksman",0],
  "Архангелы":[390,220,"archangel",1],
  "Архидемоны":[312,211,"archdemon",0],
  "Архидьяволы":[311,199,"archdevil",0],
  "Архиличи":[110,55,"archlich",0],
  "Архимаги":[70,30,"archmage",0],
  "Ассасины":[33,14,"assasin",0],
  "Ассиды":[53,30,"assida",1],
  "Астральные драконы":[310,150,"ghostdragon",1],
  "Баньши":[205,110,"banshee",0],
  "Бегемоты":[350,210,"behemoth",0],
  "Берсерки":[42,25,"berserker",0],
  "Бестии":[30,16,"maiden",0],
  "Бесы":[6,4,"imp",0],
  "Бехолдеры":[33,22,"beholder",0],
  "Боевые грифоны":[45,35,"battlegriffin",1],
  "Боевые единороги":[135,77,"silverunicorn",0],
  "Боевые кентавры":[21,10,"mcentaur",0],
  "Боевые маги":[72,29,"battlemage",0],
  "Боевые слоны":[120,100,"slon",0],
  "Вампиры":[68,30,"vampire",0],
  "Вармонгеры":[36,20,"warmong",0],
  "Ведьмы-призраки":[30,20,"cursed_",1],
  "Ведьмы моря":[70,35,"priestessup",0],
  "Великаны":[160,100,"giant",0],
  "Великаны-лучники":[130,100,"giantarch",0],
  "Великие левиафаны":[300,250,"upleviathan",0],
  "Вендиго":[20,25,"wendigo",0],
  "Верховные друиды":[101,38,"ddeld",0],
  "Вестники смерти":[205,100,"wraith",0],
  "Виверны":[170,90,"wyvern",1],
  "Визири джиннов":[110,50,"djinn_vizier",1],
  "Владычицы тени":[185,90,"matriarch",0],
  "Водные элементали":[57,43,"water",0],
  "Вожаки":[100,48,"chieftain",0],
  "Воздушные элементали":[59,30,"air",1],
  "Воины Анубиса":[420,200,"anubisup",0],
  "Воины-наёмники":[25,24,"mercfootman",0],
  "Воители":[12,12,"shieldguard",0],
  "Волшебные драконы":[800,500,"faeriedragon",1],
  "Воры-колдуны":[35,30,"thiefmage",0],
  "Воры-разведчики":[35,45,"thiefwarrior",0],
  "Воры-убийцы":[35,40,"thiefarcher",0],
  "Высшие ангелы":[390,220,"seraph2",1],
  "Высшие вампиры":[70,35,"vampirelord",0],
  "Высшие личи":[100,55,"masterlich",0],
  "Гарпии":[29,15,"harpy",1],
  "Гарпии-ведьмы":[45,15,"harpyhag",1],
  "Гарпунеры":[18,10,"harpooner",0],
  "Гигантские ящеры":[25,25,"lizard_",0],
  "Гидры":[108,80,"hydra",0],
  "Глаза тьмы":[33,26,"darkeye",0],
  "Глубоководные черти":[140,105,"upseamonster",0],
  "Гниющие зомби":[17,23,"rotzombie",0],
  "Гоблины":[5,3,"goblin",0],
  "Гоблины-лучники":[9,3,"goblinarcher",0],
  "Гоблины-маги":[9,3,"goblinmag",0],
  "Гоблины-трапперы":[15,7,"trapper",0],
  "Гоги":[13,13,"gog",0],
  "Големы смерти":[329,350,"dgolem",0],
  "Головорезы":[6,8,"brute",0],
  "Горные стражи":[24,12,"mountaingr",0],
  "Гремлины":[5,5,"gremlin",0],
  "Гремлины-вредители":[9,6,"saboteurgremlin",0],
  "Грифоны":[59,30,"griffon",1],
  "Громовержцы":[162,120,"thunderlord",0],
  "Демонессы":[67,30,"succubusm",0],
  "Детёныши ящера":[13,13,"smalllizard_",0],
  "Джинны":[103,40,"djinn",1],
  "Джинны-султаны":[110,45,"djinn_sultan",1],
  "Дикие энты":[210,175,"savageent",0],
  "Дозорные":[7,5,"robber",0],
  "Дочери земли":[72,35,"eadaughter",0],
  "Дочери неба":[75,35,"sdaughter",0],
  "Древние бегемоты":[390,250,"abehemoth",0],
  "Древние мумии":[135,80,"amummy",0],
  "Древние энты":[210,181,"ancienent",0],
  "Дриады":[20,6,"sprite",1],
  "Друиды":[74,34,"dd_",0],
  "Духи":[27,20,"poltergeist",1],
  "Дьяволы":[245,166,"devil",0],
  "Дьяволята":[10,6,"vermin",0],
  "Единороги":[124,57,"unicorn",0],
  "Железные големы":[33,18,"golem",0],
  "Жрецы рун":[59,60,"runepriest",0],
  "Жрицы луны":[60,50,"priestmoon",0],
  "Жрицы солнца":[70,55,"priestsun",0],
  "Защитники веры":[20,23,"vindicator",0],
  "Защитники гор":[7,7,"defender",0],
  "Зелёные драконы":[350,200,"greendragon",1],
  "Земные элементали":[63,75,"earth",0],
  "Злобные глаза":[33,22,"evileye",0],
  "Зомби":[11,17,"zombie",0],
  "Изумрудные драконы":[400,200,"emeralddragon",1],
  "Имперские грифоны":[62,35,"impergriffin",1],
  "Инквизиторы":[121,80,"inquisitor",0],
  "Искусительницы":[65,26,"seducer",0],
  "Ифриты":[200,90,"efreeti",1],
  "Ифриты султаны":[250,100,"efreetisultan",1],
  "Йети":[400,280,"yeti",0],
  "Каменные горгульи":[16,15,"gargoly",1],
  "Каменные монстры":[20,28,"kammon",0],
  "Камнегрызы":[67,55,"kamnegryz",0],
  "Камнееды":[56,45,"kamneed",0],
  "Кентавры":[13,6,"fcentaur",0],
  "Князья вампиров":[70,40,"vampireprince",0],
  "Колдуны-ренегаты":[6,6,"outlaw",0],
  "Колоссы":[350,175,"colossus",0],
  "Кони преисподней":[138,66,"hellstallion",0],
  "Корсарки":[32,12,"piratkaup",0],
  "Корсары":[16,13,"apirate",0],
  "Костоломы":[27,20,"brawler",0],
  "Костяные драконы":[280,150,"bonedragon",1],
  "Кочевники":[50,30,"nomad",0],
  "Кочевые кентавры":[20,9,"ncentaur",0],
  "Кошмары":[140,66,"stallion",0],
  "Красные драконы":[400,235,"reddragon",1],
  "Крестьяне":[5,4,"paesant",0],
  "Крестоносцы":[27,30,"crusader",0],
  "Кристальные драконы":[400,200,"crystaldragon",1],
  "Кровавые ящеры":[30,35,"redlizard_",0],
  "Кровоглазые циклопы":[500,235,"bloodeyecyc",0],
  "Кшатрии ракшасы":[162,135,"rakshasa_kshatra",0],
  "Лавовые драконы":[329,275,"lavadragon",0],
  "Лазутчики":[20,10,"scout",0],
  "Латники":[21,26,"swordman",0],
  "Левиафаны":[250,200,"leviathan",0],
  "Ледяные элементали":[50,45,"iceel",1],
  "Лепреконы":[11,7,"lepr",0],
  "Лесные снайперы":[42,12,"arcaneelf",0],
  "Лесные хоббиты":[9,6,"bobbit",0],
  "Личи":[87,50,"lich",0],
  "Ловчие":[34,15,"stalker",0],
  "Лучники":[15,7,"archer",0],
  "Маги":[63,18,"mage",0],
  "Магические элементали":[200,80,"magicel",0],
  "Магма драконы":[329,280,"magmadragon",0],
  "Магнитные големы":[57,28,"magneticgolem",0],
  "Магоги":[16,13,"magog",0],
  "Мантикоры":[130,80,"manticore",1],
  "Мастера копья":[17,12,"skirmesher",0],
  "Мастера лука":[42,14,"hunterelf",0],
  "Мегеры":[49,24,"bloodsister",0],
  "Медведи":[22,22,"bear",0],
  "Медузы королевы":[55,30,"medusaup",0],
  "Метатели копья":[11,10,"spearwielder",0],
  "Минотавры":[39,31,"minotaur",0],
  "Минотавры-стражи":[56,35,"minotaurguard_",0],
  "Минотавры-надсмотрщики":[56,40,"taskmaster",0],
  "Могильные големы":[400,400,"dgolemup",0],
  "Молотобойцы":[12,9,"gnomon",0],
  "Монахи":[101,54,"priest",0],
  "Морские дьяволы":[300,190,"piratemonster",0],
  "Морские черти":[120,90,"seamonster",0],
  "Мумии":[115,50,"mummy",0],
  "Мумии фараонов":[135,70,"pharaoh",0],
  "Мятежники":[10,7,"enforcer",0],
  "Наги":[160,110,"naga",0],
  "Наездники на верблюдах":[60,40,"dromad",0],
  "Наездники на волках":[20,10,"wolfrider",0],
  "Наездники на гиенах":[31,13,"hyenarider",0],
  "Наездники на кабанах":[31,14,"boarrider",0],
  "Наездники на медведях":[24,25,"bearrider",0],
  "Наездники на ящерах":[65,40,"lizardrider",0],
  "Налетчики на верблюдах":[70,45,"dromadup",0],
  "Налётчики на волках":[31,12,"hobwolfrider",0],
  "Никсы-воины":[180,90,"reptiloidup",0],
  "Нимфы":[20,6,"dryad_",1],
  "Обсидиановые горгульи":[26,20,"obsgargoly",1],
  "Огненные гончие":[36,15,"firehound",0],
  "Огненные демоны":[23,13,"fdemon",0],
  "Огненные драконы":[255,230,"firedragon",0],
  "Огненные птицы":[117,65,"firebird_",1],
  "Огненные элементали":[60,43,"fire",0],
  "Огры":[60,50,"ogre",0],
  "Огры-ветераны":[75,70,"ogrebrutal",0],
  "Огры-маги":[74,65,"ogremagi",0],
  "Огры-шаманы":[74,55,"ogreshaman",0],
  "Одноглазые пираты":[190,120,"fatpirateup",0],
  "Ополченцы":[7,6,"conscript",0],
  "Орки":[29,12,"orc",0],
  "Орки-вожди":[38,18,"orcchief",0],
  "Орки-тираны":[38,20,"orcrubak",0],
  "Орки-шаманы":[33,13,"orcshaman",0],
  "Паладины":[262,100,"paladin",0],
  "Палачи":[83,40,"executioner",0],
  "Пауки":[15,9,"spider",0],
  "Пехотинцы":[17,16,"footman",0],
  "Пещерные владыки":[195,120,"pitlord_",0],
  "Пещерные гидры":[115,125,"deephydra",0],
  "Пещерные демоны":[157,110,"pitfiend_",0],
  "Пещерные отродья":[165,140,"pitspawn",0],
  "Пиратки":[20,10,"piratka",0],
  "Пираты зомби":[200,150,"zpirate",0],
  "Пираты Ктулху":[350,200,"piratemonsterup",0],
  "Пироманьяки":[10,20,"piroman",0],
  "Привидения":[26,8,"ghost",1],
  "Прибрежные налётчики":[10,19,"spearthrower",0],
  "Призраки":[27,19,"spectre",1],
  "Призраки пираток":[17,8,"gpiratka",1],
  "Призрачные драконы":[310,160,"spectraldragon",1],
  "Принцессы ракшас":[155,120,"rakshas",0],
  "Проворные наездники":[94,50,"briskrider",0],
  "Проклятые бегемоты":[400,250,"dbehemoth",0],
  "Проклятые горгульи":[25,35,"hgarg",1],
  "Проклятые энты":[250,215,"cursedent",0],
  "Птицы грома":[115,65,"thunderbird",1],
  "Птицы тьмы":[120,60,"darkbird",1],
  "Пустынные налетчики":[50,40,"vulture",1],
  "Пустынные рейдеры":[22,12,"duneraider",0],
  "Пустынные убийцы":[24,12,"duneraiderup",0],
  "Раджи ракшас":[160,140,"rakshasa_raja",0],
  "Ретиарии":[12,25,"gladiator",0],
  "Рогатые демоны":[14,13,"hdemon",0],
  "Рогатые жнецы":[200,99,"rapukk",0],
  "Роки": [104,55,"roc",1],
  "Рыцари":[232,90,"knight",0],
  "Рыцари смерти":[190,100,"deadknight",0],
  "Рыцари тьмы":[160,90,"blackknight",0],
  "Светлые единороги":[135,80,"pristineunicorn",0],
  "Свирепые бегемоты":[410,280,"dbehemoth",0],
  "Свободные циклопы":[700,225,"untamedcyc",0],
  "Северные наездники":[36,30,"whitebearrider",0],
  "Серебряные пегасы":[50,30,"spegasus",1],
  "Силачи":[20,50,"kachok",0],
  "Сирены":[60,20,"siren",0],
  "Сирены-искусительницы":[70,24,"upsiren",0],
  "Скелеты":[6,4,"sceleton",0],
  "Скелеты-арбалетчики":[12,6,"skmarksman",0],
  "Скелеты-воины":[10,5,"sceletonwar",0],
  "Скелеты-корсары":[10,4,"skeletonpirateup",0],
  "Скелеты-моряки":[6,4,"cpirate",0],
  "Скелеты-лучники":[10,4,"sceletonarcher",0],
  "Скелеты-пираты": [7,4, "skeletonpirate",0],
  "Скорпионы":[6,4,"scorp",0],
  "Слуги Анубиса": [350,160,"anubis",0],
  "Снежные воины":[35,27,"chuvak",0],
  "Стальные големы":[54,24,"steelgolem",0],
  "Старейшины рун":[100,70,"runepatriarch",0],
  "Старшие гремлины":[9,6,"mastergremlin",0],
  "Старшие демоны":[20,13,"jdemon",0],
  "Старшие друиды":[101,34,"ddhigh",0],
  "Степные бойцы":[23,12,"mauler",0],
  "Степные воины":[21,12,"warrior",0],
  "Степные волки":[20,25,"swolf",0],
  "Степные гоблины":[5,3,"goblinus",0],
  "Степные циклопы":[390,220,"cyclopus",0],
  "Стихийные горгульи":[25,16,"elgargoly",1],
  "Стрелки":[16,8,"crossbowman",0],
  "Стрелки-наёмники":[15,8,"mercarcher",0],
  "Суккубы":[61,20,"succub",0],
  "Сумеречные ведьмы":[157,80,"witch",0],
  "Сумеречные драконы":[350,200,"shadowdragon",1],
  "Танцующие с ветром":[33,14,"winddancer",0],
  "Танцующие с клинками":[20,12,"dancer",0],
  "Танцующие со смертью":[33,12,"bladedancer",0],
  "Таны":[131,100,"thane",0],
  "Тёмные виверны":[195,105,"foulwyvern",1],
  "Тёмные всадники":[94,50,"grimrider",0],
  "Тёмные гидры":[115,125,"foulhydra",0],
  "Тёмные горгульи":[21,30,"burbuly",1],
  "Титаны":[400,190,"titan",0],
  "Титаны шторма":[400,190,"stormtitan",0],
  "Троглодиты":[5,5,"troglodyte",0],
  "Тролли":[150,150,"troll",0],
  "Тэнгу":[100,45,"tengu",1],
  "Убийцы":[70,34,"slayer",0],
  "Умертвия":[165,95,"wight",0],
  "Феи":[12,5,"pp",1],
  "Фениксы":[600,777,"phoenix",1],
  "Флибустьеры":[75,18,"shootpirateup",0],
  "Фурии":[49,16,"fury",0],
  "Хищные растения":[92,60,"plant",0],
  "Хобгоблины":[9,4,"hobgoblin",0],
  "Хозяева медведей":[36,30,"blackbearrider",0],
  "Хозяйки ночи":[185,100,"mistress",0],
  "Церберы":[41,15,"cerberus",0],
  "Циклопы":[172,85,"cyclop",0],
  "Циклопы-генералы":[187,100,"cyclopod_",0],
  "Циклопы-короли":[182,95,"cyclopking",0],
  "Циклопы-шаманы":[190,105,"cyclopshaman",0],
  "Чародеи-наёмники":[35,36,"mercwizard",0],
  "Чемпионы":[252,100,"champion",0],
  "Черные скорпионы":[9,5,"scorpup",0],
  "Черные тролли":[180,180,"blacktroll",0],
  "Черти":[10,6,"familiar",0],
  "Чёрные драконы":[400,240,"blackdragon",1],
  "Чумные зомби":[15,17,"plaguezombie",0],
  "Шакалы":[30,24,"shakal",0],
  "Шакалы-воины":[45,30,"shakalup",0],
  "Шаманки":[66,30,"shamaness",0],
  "Шпионки":[14,9,"banditkaup",0],
  "Штурмовые грифоны":[62,52,"battlegriffon",1],
  "Штурмовые слоны":[150,110,"slonup",0],
  "Эльфийские лучники":[38,10,"elf",0],
  "Энты":[187,175,"ent",0],
  "Ядовитые пауки":[30,14,"spiderpois",0]
//  "Злой Петушок 2017":[60,77,"rooster",1],
//  "Злой пёс 2018":[100,88 ,"evildog",0],
//  "Свин 2019":[16,19,"pig2019",0],
};
var n_monstrs = 0;
for (var key in mob_rus_exp) {n_monstrs++}    //считаем кол-во существ в базе
if (skip_base.length*4 < n_monstrs) {         //если существ стало больше, чем в хранящемся массиве с пропусками,
  skip_base = fill_hex_massive(Math.ceil(n_monstrs/4), "0");  //то расширяем массив вверх до кол-ва кратного 4 и сбрасываем hex массив
}
var skip_bin_base = hex_2_bin(skip_base);     //создаем bin массив
//****************************************************
/** Библиотека юникода
*
* Реализует функции работы с юникодом.
* @file lib_unicode.js
* @version 1.1.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/
function uchar(s) {
  switch (s[0]) {
    case "А": return "\u0410";
    case "Б": return "\u0411";
    case "В": return "\u0412";
    case "Г": return "\u0413";
    case "Д": return "\u0414";
    case "Е": return "\u0415";
    case "Ж": return "\u0416";
    case "З": return "\u0417";
    case "И": return "\u0418";
    case "Й": return "\u0419";
    case "К": return "\u041a";
    case "Л": return "\u041b";
    case "М": return "\u041c";
    case "Н": return "\u041d";
    case "О": return "\u041e";
    case "П": return "\u041f";
    case "Р": return "\u0420";
    case "С": return "\u0421";
    case "Т": return "\u0422";
    case "У": return "\u0423";
    case "Ф": return "\u0424";
    case "Х": return "\u0425";
    case "Ц": return "\u0426";
    case "Ч": return "\u0427";
    case "Ш": return "\u0428";
    case "Щ": return "\u0429";
    case "Ъ": return "\u042a";
    case "Ы": return "\u042b";
    case "Ь": return "\u042c";
    case "Э": return "\u042d";
    case "Ю": return "\u042e";
    case "Я": return "\u042f";
    case "а": return "\u0430";
    case "б": return "\u0431";
    case "в": return "\u0432";
    case "г": return "\u0433";
    case "д": return "\u0434";
    case "е": return "\u0435";
    case "ж": return "\u0436";
    case "з": return "\u0437";
    case "и": return "\u0438";
    case "й": return "\u0439";
    case "к": return "\u043a";
    case "л": return "\u043b";
    case "м": return "\u043c";
    case "н": return "\u043d";
    case "о": return "\u043e";
    case "п": return "\u043f";
    case "р": return "\u0440";
    case "с": return "\u0441";
    case "т": return "\u0442";
    case "у": return "\u0443";
    case "ф": return "\u0444";
    case "х": return "\u0445";
    case "ц": return "\u0446";
    case "ч": return "\u0447";
    case "ш": return "\u0448";
    case "щ": return "\u0449";
    case "ъ": return "\u044a";
    case "ы": return "\u044b";
    case "ь": return "\u044c";
    case "э": return "\u044d";
    case "ю": return "\u044e";
    case "я": return "\u044f";
    case "Ё": return "\u0401";
    case "ё": return "\u0451";
    default: return s[0];
  }
}

function ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++)
        result += uchar(s[i]);
    return result;
}
//****************************************************
function $uchar(s) {
  switch (s[0]) {
    case "\u0410": return "А";
    case "\u0411": return "Б";
    case "\u0412": return "В";
    case "\u0413": return "Г";
    case "\u0414": return "Д";
    case "\u0415": return "Е";
    case "\u0416": return "Ж";
    case "\u0417": return "З";
    case "\u0418": return "И";
    case "\u0419": return "Й";
    case "\u041a": return "К";
    case "\u041b": return "Л";
    case "\u041c": return "М";
    case "\u041d": return "Н";
    case "\u041e": return "О";
    case "\u041f": return "П";
    case "\u0420": return "Р";
    case "\u0421": return "С";
    case "\u0422": return "Т";
    case "\u0423": return "У";
    case "\u0424": return "Ф";
    case "\u0425": return "Х";
    case "\u0426": return "Ц";
    case "\u0427": return "Ч";
    case "\u0428": return "Ш";
    case "\u0429": return "Щ";
    case "\u042a": return "Ъ";
    case "\u042b": return "Ы";
    case "\u042c": return "Ь";
    case "\u042d": return "Э";
    case "\u042e": return "Ю";
    case "\u042f": return "Я";
    case "\u0430": return "а";
    case "\u0431": return "б";
    case "\u0432": return "в";
    case "\u0433": return "г";
    case "\u0434": return "д";
    case "\u0435": return "е";
    case "\u0436": return "ж";
    case "\u0437": return "з";
    case "\u0438": return "и";
    case "\u0439": return "й";
    case "\u043a": return "к";
    case "\u043b": return "л";
    case "\u043c": return "м";
    case "\u043d": return "н";
    case "\u043e": return "о";
    case "\u043f": return "п";
    case "\u0440": return "р";
    case "\u0441": return "с";
    case "\u0442": return "т";
    case "\u0443": return "у";
    case "\u0444": return "ф";
    case "\u0445": return "х";
    case "\u0446": return "ц";
    case "\u0447": return "ч";
    case "\u0448": return "ш";
    case "\u0449": return "щ";
    case "\u044a": return "ъ";
    case "\u044b": return "ы";
    case "\u044c": return "ь";
    case "\u044d": return "э";
    case "\u044e": return "ю";
    case "\u044f": return "я";
    case "\u0401": return "Ё";
    case "\u0451": return "ё";
    default: return s[0];
  }
}
function $ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++) result += $uchar(s[i]);
    return result;
}
// ********* считывание уровня героя **********
function getLevel() {
  if(url_cur.indexOf(url_home) == -1){ return; }

  for (var k = 0; k < all_tables.length; k++)
  {
    if (!all_tables[k]) continue;
    if (!all_tables[k].childNodes[0]) continue;
    if (!all_tables[k].childNodes[0].childNodes[0]) continue;
    if (!all_tables[k].childNodes[0].childNodes[0].childNodes[0]) continue;
    if (!all_tables[k].childNodes[0].childNodes[0].childNodes[0].innerHTML) continue;

    var str_tbl_info = all_tables[k].childNodes[0].childNodes[0].childNodes[0].innerHTML;

    if (str_tbl_info.indexOf(str_pl_lvl) > 0)
    {
      str_tbl_info = str_tbl_info.substring(str_tbl_info.indexOf(str_pl_lvl) + str_pl_lvl.length);
      pl_level = str_tbl_info.substring(0, str_tbl_info.search(/\D/));
      break;
    }
  }
  gm_set("hunt_exp_pl_level", pl_level);
}
// ***************************************************
function needSkip(skip,mob,expirience,half)  //нужно ли пропускать моба?
{
  if ( (!skip_no_half) || (half) ) {  //Если режим поиска половинок, а это не половинка, то пропускаем
    if (skip_mode) {
      if ((limit_exp == 0) || (expirience*1 <= limit_exp*1)) skip = false;
    }  else {
      var n = 0;
      for (var key in mob_rus_exp) {
        if ((ustring(key) == mob) && (skip_bin_base[n] == "1")) { skip = false; return skip; }
        n++;
      }
    }
  }
  return skip;
}
//****************************************************
function skip_hunt() {  //пропустить охоту
  var x= document.querySelector("div >a[href*='ecostat.php']");
  if (x == null)  return;
  document.title = str_auto_skip;
  setTimeout(function() { window.location.href = location.protocol+'//'+location.hostname+'/'+'map.php?action=skip'; }, 2000);
}
//****************************************************
function skip_en() {  //добавить ссылку на пропуск охот, если стоишь в заявке на бой или карточную игру
  var x = document.querySelectorAll("tr > td[colspan*='2']");
  if (x.length == 0) return;
  for (var k = 0; k < x.length; k++) {
    if (x[k].innerHTML == str_no_skip) {
      x[k].align = 'right';
      x[k].innerHTML ='<a href="map.php?action=skip">'+str_skip_enable+'</a>';
    }
  }
}
//****************************************************
function link2arh_record() { //добавить ссылку на рекорд из архива
  var link_record, s, el;
  var x = document.querySelectorAll("div > a[href*='mid=']");
  if (x.length == 0) return;
  for (var k = 0; k < x.length; k++) {
    link_record = x[k].href;
    s = link_record.split('&mid');
    link_record = s[0]+'&show_archive=1&mid'+s[1];
    x[k].insertAdjacentHTML("afterEnd" ,'<br><a href="'+link_record+'" target=_blanc><img border="0" title="'+str_arh_record
      +'" src="http://dcdn.heroeswm.ru/i/s_knowledge.gif"></a>');
  }
}
// ***************************************************
function showExperience() {
  skip_en();
  if (show_archive) {link2arh_record();}
  if(url_cur.indexOf(url_map) == -1){ return; }
  var my_td_danger,  total_exp, full_exp, next_count, exp_with_helper, next_half_count, min_count, exp_min_count, next_min_count, mob_HP;
  var str_hunt, str_total_exp, next_level;//, min_kills, exp_min_kills;
  var mob_name ="";
  var str_dop ="";
  var mob_exp = 0;
  var temp = 0;
  var hunt_available = false;
  var half_hunt = false;
  var diamand_hunt = false;
  var half_diamond_hunt = false;
  var skip_all_mob = true;
  for (var k = 0; k < all_tables.length; k++)
  {
//    if (all_tables[k].className == "wbwhite ohota_block global_inside_shadow map_table_margin")
//    if (all_tables[k].id == "neut_show")
    if (all_tables[k].id.indexOf("neut_show") != -1)
    {
     // if (all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[0].tagName != "DIV") continue;
     // if (all_tables[k].childNodes[1].childNodes[0].children.length < 2) {break;}
     // my_td_danger = all_tables[k].childNodes[1];
     //if (!my_td_danger){ return; } //no hunt...

      str_hunt = all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML;
      var mob_count_b = all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[3].innerHTML;
      if (str_hunt.indexOf("[1/2]") !=-1) {half_hunt = true} else {half_hunt = false}; //это половинка?
      if (str_hunt.indexOf(str_diamond_search) !=-1) {diamand_hunt = true} else {diamand_hunt = false}; //это brilliant?
      half_diamond_hunt = diamand_hunt || half_hunt;

      mob_count = mob_count_b.substring(0, mob_count_b.indexOf(str_kol)-1)
      mob_name = str_hunt.substring(str_hunt.indexOf(">")+1, str_hunt.indexOf("</"));
      var mob_data = mob_rus_exp[$ustring(mob_name)];
      if(!mob_data){
        //новый моб
        mob_data = [0,0,"new mob",0];
      }
      if (show_HP){
        mob_HP = mob_data[1] * mob_count;
        str_hunt = str_hunt.replace(str_kol,str_kol+' <font style="font-size:10px;color:#CD00CD">HP:<B>'+mob_HP+'</B></font>');
        all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt;
      }
      mob_exp = mob_data[0];
      hunt_available = true;

      total_exp = Math.round(mob_exp * mob_count / 5);                                        //Полный опыт в одиночку
      full_exp = total_exp;
      next_count    = (mob_count*1.3).toFixed(0);                                             //Прирост при победе в одиночку

      exp_with_helper = (total_exp / 2).toFixed(0);                                           //Опыт с помощником (50/50)
      next_half_count = (mob_count*Math.pow(1.3, 0.5)).toFixed(0);                            //Прирост при победе с помощником (50/50)

      min_count   = (mob_count / 5 - 0.5).toFixed(0);                                         //Для минимального 5% прироста
                        exp_min_count = (Math.floor(mob_exp * min_count / 5)).toFixed(0);     //Опыт при минимальном приросте
      next_min_count  = (mob_count*Math.pow(1.3, 0.2)).toFixed(0);                            //Прирост при убийстве <=20% будет ~5.4%
      total_exp = total_exp > pl_level*500 ? pl_level*500 : total_exp;                        //Если опыт больше верхней отсечки по уровню
      exp_with_helper = exp_with_helper > pl_level*500 ? pl_level*500 : exp_with_helper;
      exp_min_count = exp_min_count > pl_level*500 ? pl_level*500 : exp_min_count;
      if (pl_level > 2) {                                                                     //Если опыт меньше нижней отсечки по уровню (3+ уровни)
        total_exp = total_exp < pl_level*100 ? pl_level*100 : total_exp;
        exp_with_helper = exp_with_helper < pl_level*35 ? pl_level*35 : exp_with_helper;
        exp_min_count = exp_min_count < pl_level*14 ? pl_level*14 : exp_min_count;
      }
      total_exp = (total_exp * koef).toFixed(0);
      exp_with_helper = (exp_with_helper * koef).toFixed(0);
      exp_min_count = (exp_min_count * koef).toFixed(0);
//-------------- Вставим кусок кода ---------------
      skip_all_mob  = needSkip(skip_all_mob,mob_name,full_exp,half_diamond_hunt);
//alert(needSkip(true,mob_name,full_exp,half_hunt)+' skip_mode: '+skip_mode);
      if ((!needSkip(true,mob_name,full_exp,half_diamond_hunt)) ){//&& (!skip_mode)) {        //Если есть ли моб в нашем списке
        all_tables[k].childNodes[1].style.background = "#D1FFD1";
      }
//-------------------------------------------------
// total_exp - опыт с учетом коэф. перекача
      str_total_exp = total_exp;
      next_level = Number(pl_level)+1;
      if (total_exp > max_exp && max_exp > 0) { all_tables[k].childNodes[0].style.background = '#FFA07A' ; }
      if (total_exp != full_exp) str_dop = ustring(' (из ')+full_exp+ustring(')'); else str_dop ="";
      str_total_exp ='<br> <font style="font-size:10px;color:#0000CD">'+str_sum_exp.replace('STR1', str_total_exp).replace('dopSTR', str_dop).replace('STR6', next_count)+'</font>';
      if ((total_exp < next_level*100) && (pl_level > 1))  {str_total_exp +='<br> <font style="color:#0000CD">'+str_kill_now.replace('STR9', next_level).replace('STR10',next_level*100)+'</font>';}

      if (enable_Exp_Half) {str_total_exp = str_total_exp + '<br> <font style="font-size:10px;color:#CD00CD">'+str_hlp_exp.replace('STR2', exp_with_helper).replace('STR7', next_half_count)+'</font>'};

      if (enable_5_procent) {str_total_exp = str_total_exp + '<font style="font-size:11px;color:#007FFF"><i><center>'+str_min_kol.replace('STR3', min_count).replace('STR4', exp_min_count).replace('STR8', next_min_count)+'</center></i></font>'};

      all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt + str_total_exp;
    }
  }
  if (skip_all_mob && hunt_available) skip_hunt();
  if (!skip_all_mob && hunt_available && ((limit_exp != 0) || (!skip_mode )) ) document.title = str_hunt_found;
}
//****************************************************
function helpers() { //анализ страницы групповых боев

    if(url_cur.indexOf(url_war) == -1){ return; }
    var ems, ems2, elem, elem2, str_hunt, mob_count, mob_name, total_exp, backgrn, sect, s_sect;
    var dt = 9000;
    ems = document.querySelectorAll("a[href*='bselect.php']");
    if (ems.length == 0) return;
    ems2=ems[1].parentNode.parentNode;
    ems = ems2.querySelectorAll( "td > a[href*='map.php?cx']");

      for (var i = 0; i < ems.length; i++) {
        if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[4]) {
          elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[3].childNodes[0]; //odin v drugom sektore ili inoi level
        } else if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[6]) {
          elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[5].childNodes[0]; //odin v moem sektore
          elem2 = elem.parentNode.parentNode.childNodes[3].childNodes[0]; //
          if ((beep_if_free) && (elem2.tagName == 'B')) {
            new Audio("https://zvukogram.com/mp3/cats/1002/vyistrel-iz-vintovki-po-misheni.mp3").play();
            dt = 15000;
          }
        }  else {
           elem = ems[i].parentNode.parentNode.childNodes[6].lastChild.childNodes[0];    //dvoe v moem ili drugom sektore
        }
        str_hunt = elem.innerHTML;
        mob_count = str_hunt.substring(str_hunt.search(/\(/)+1, str_hunt.search(/\)/));
        mob_name = str_hunt.substring(0, str_hunt.search(/\(/));
        total_exp = Math.floor(mob_rus_exp[$ustring(mob_name)][0] * mob_count / 5);
        backgrn = '';
        if (elem.parentNode.parentNode.childElementCount != 5) {
          s_sect = ems[i].href;
          sect = s_sect.substring(s_sect.lastIndexOf("?")+1,s_sect.length);
          s_sect =s_sect.replace("map.php?"+sect,"move_sector.php?id="+sectors[sect]);
          ems[i].innerHTML += ustring('<br><font style="color:#FF3244;"><b>Перейти</b></font>');
          ems[i].href = s_sect;
        }
        if (only_Gud_ExpUm && (total_exp< pl_level*133) ){ backgrn = ' background:#cfd';}
        if (only_Gud_ExpUm && (total_exp< pl_level*100)  ){ backgrn = ' background:#0f0';}
        elem.innerHTML += ' <font style="font-size:12px; color:#013220;'+ backgrn+'"><b>'+''+total_exp+'</b></font>'+str_exp;
        if (show_HP){
          var mob_data = mob_rus_exp[$ustring(mob_name)];
          mob_HP = mob_data[1] * mob_count;
          elem.innerHTML +=' <font style="font-size:12px;color:#CD00CD">HP:&nbsp;<b>'+mob_HP+'</b></font>'
    }
  }
  if (find_Hunt) setTimeout(function(){ window.location.href = location.protocol+'//'+location.hostname+'/'+'group_wars.php?filter=hunt'; }, dt);
}
//****************************************************
function hideHunt() { //режим гринпис - скрытие отображения охот
var tb;
  if(url_cur.indexOf(url_map) == -1){ return; }
  for (var k = 0; k < all_tables.length; k++)
  {
      if (all_tables[k].id.indexOf("neut_show") != -1)
      {
      tb = all_tables[k];
      tb.parentNode.removeChild(tb.nextSibling);
      tb.parentNode.removeChild(tb);
      k--;
    }
  }
}
//****************************************************************************************
function add_archive() { //добавить ссылку на архив рекордов на странице рекордов
  var ems, s_full, spl, s, s_url;
  if (url_cur.indexOf('level') == -1) return;
  if (url_cur.indexOf('show_archive=1') == -1)
  {
    if (url_cur.indexOf('mid') == -1)
    {
      s_url = url_cur+'&show_archive=1';
    } else {
      spl = url_cur.split('&mid');
      s_url = spl[0]+'&show_archive=1&mid'+spl[1];
    }
    s = str_show_archive_r;
  } else {
    spl = url_cur.split('&show_archive=1');
    s_url = spl[0]+spl[1];
    s = str_hide_archive_r;
  }
  ems = document.querySelectorAll( "div > center > a[href*='plstats_hunters.php?level']");
  if (ems.length != 0) {
    s_full = '<br><center><a href="'+s_url+'"><b><font color="blue">'+s+'</font></b></a></center>';
    ems[0].parentNode.insertAdjacentHTML("afterEnd" ,s_full);
  }
}
//****************************************************
function hunt_hilight() { //заменяет ссылку в групповые бои на такую же с выделением свободных охот
  var link_old = "group_wars.php";
  var link_new = "group_wars.php?filter=hunt";
  var nodeList = document.getElementsByTagName("a");
  for (var i = 0; i < nodeList.length; i++)
  {
    if (nodeList[i].href.indexOf(link_old)!=-1)
    {
    nodeList[i].href = nodeList[i].href.replace(link_old,link_new);
    return;
    }
  }
}
//****************************************************
getLevel();
showSettings();
show_List();
if (!grin_Pis) showExperience()
else hideHunt();
helpers();
hunt_hilight();
if (url_cur.indexOf('plstats_hunters') != -1) add_archive();

  //------------------------------
  function GM_get_once(key, def){
    var val = GM_getValue(key, def);
    GM_deleteValue(key);
    return val;
  }

  function GM_load_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? def : val;
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? false : val==1;
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function gm_get(key, def){
    return GM_getValue(gm_prefix+key, def);
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
  }

  function gm_del(key, def){
    var val = GM_getValue(gm_prefix+key);
    GM_deleteValue(gm_prefix+key);
    return val ? val : def;
  }

  function gm_get_num(key, val){
    return GM_load_num(gm_prefix+key, val);
  }

  function gm_set_bool(key, val){
    return GM_save_num_from_bool(gm_prefix+key, val);
  }

  function gm_get_bool(key, def){
    return GM_load_bool_from_num(gm_prefix+key , def?1:0);
  }
  function getPlayerId(){
    var hunter_ref = getI("//a[contains(@href, 'pl_hunter_stat')]");
      //min 2 для home; min 1 для остальных - если включены выпадающие вкладки
      //min 1 для home; min 0 для остальных - если отключены выпадающие вкладки
    if ( !hunter_ref || hunter_ref.snapshotLength == 0 || (hunter_ref.snapshotLength == 1 && location.pathname == '/home.php') ) {
      //отключены вкладки или разлогин
      var ids=/pl_id=(\d+)/.exec(document.cookie);
      return ids ? ids[1] : 'unknown';
    } else {
      return hunter_ref.snapshotItem(0).href.split('?id=')[1];
    }
  }
  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

  function html_if_checked(val){
    return val ? ' checked' : '';
  }
})();