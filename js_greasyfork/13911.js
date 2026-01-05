//
// ==UserScript==
// @name           hwm_work_find
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Поиск места работы с любой страницы игры
// @homepage       https://greasyfork.org/uk/scripts/13911-hwm-work-find
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        2.17
// @encoding      utf-8
// @include        http://www.heroeswm.ru/*
// @include        http://qrator.heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://www.lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/13911/hwm_work_find.user.js
// @updateURL https://update.greasyfork.org/scripts/13911/hwm_work_find.meta.js
// ==/UserScript==

(function() {

var version = '2.17';
var idn = 'work_find';
var str_url = 'https://greasyfork.org/ru/scripts/13911-hwm-work-find';
var str_script_name = 'Поиск места работы';
var str_url_aut = '/sms-create.php?mailto=Pahan&subject=Скрипт: '+str_script_name+' v'+version+'. Найдена ошибка:';
var str_url_sps = '/transfer.php?pahan_sps=' + encodeURIComponent('Подарок. Спасибо за скрипт: '+str_script_name+' v'+version+'.');

if (typeof GM_deleteValue != 'function') {
  this.GM_getValue=function (key,def) {return localStorage[key] || def;};
  this.GM_setValue=function (key,value) {return localStorage[key]=value;};
  this.GM_deleteValue=function (key) {return delete localStorage[key];};

  this.GM_addStyle=function (key) {
    var style = document.createElement('style');
    style.textContent = key;
    document.querySelector("head").appendChild(style);    
  };
}
if (typeof GM_listValues != 'function') {
  this.GM_listValues=function () {
    var values = [];
    for (var i=0; i<localStorage.length; i++) {
      values.push(localStorage.key(i));
    }
    return values;
  }
}
if (typeof GM_setClipboard != 'function') {
  this.GM_setClipboard=function (key) {}
}

GM_addStyle('.dialog {background-color: #F6F3EA; border-radius: 5px; box-sizing: border-box; box-shadow: 0 0 0px 12px rgba(200, 200, 200, 0.5); left: calc(50% - 300px); max-height: calc(100% - 100px); overflow: auto; padding: 15px; position: fixed; top: 50px; z-index: 1105;}');
GM_addStyle('.dialogOverlay {background-color: rgba(0, 0, 0, 0.7); height: 100%; left: 0; position: fixed; top: 0; width: 100%;}');
GM_addStyle('.btn_close {position:absolute;left:calc(100% - 45px);float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;}');
GM_addStyle('.btn_settings {text-decoration:underline;cursor:pointer;font-weight:bold;font-size:10px;width:500px;}');
GM_addStyle('.small_text {font-weight:bold;font-size:10px;}');
GM_addStyle('.blue {color:#0070FF;}');
GM_addStyle('.blueRef {text-decoration:underline;cursor:pointer;font-weight:bold;font-size:12px;width:500px;color:#0070FF;}');

function addEvent(elem, evType, fn) {
//    elem["on" + evType] = fn;
  if (elem.addEventListener) {
    elem.addEventListener(evType, fn, false);
  }
  else if (elem.attachEvent) {
    elem.attachEvent("on" + evType, fn);
  }
  else {
    elem["on" + evType] = fn;
  }
}

function $(id) { return document.querySelector(id); } 

function URLAttrValueGet(attr_name, aurl)
{
 attr_name = attr_name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]" + attr_name + "=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec( aurl );
 if( results == null )
  return "";
 else
  return results[1];
}

function Ajax(AMethod, AURL, AParams, ACallBackFunc)
{
  var LRequest = new XMLHttpRequest();
  LRequest.open(AMethod, AURL, true);
  LRequest.overrideMimeType('text/html; charset=windows-1251');
  LRequest.send(AParams);
  LRequest.onreadystatechange = function()
  {
    if (LRequest.readyState == 4)
    {
      ACallBackFunc(LRequest.responseText, AURL);
    }  
  };
} 

function Trim(AText)
{
  return AText.replace(/^\s+|\s+$|^(&nbsp;)+|(&nbsp;)+$/g, '');
}

function DeleteCRLF(AText)
{
  return AText.replace(/[\n\r]/g, ' ').replace(/\s{2,}/g, ' ');
}

function Assert(ACondition, AMessage)
{
  if (ACondition)
    return;
  alert('ERROR: ' + AMessage);
  throw new Error(AMessage);
}

function FloatFormat(AFloat)
{
  return Math.round(AFloat).toString();
}

function IntFormatWithThouthandSeparator(num){
  var
    n = num.toString(),
    p = n.indexOf('.');
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
    return p<0 || i<p ? ($0+',') : $0;
  });
}

// ------------------ dialog

function close_setting_form (){
    var bg = $('#bgOverlay' + idn) ;
    var bgc = $('#bgCenter' + idn) ;
    if( bg ) {
        bg.style.display = bgc.style.display = 'none' ;
    }    
}

function clear_all_params()
{
  if (confirm("Вы действительно хотите скинуть все сохраненные настройки?"))
  {
    var keys = GM_listValues();
    for (var i=0, key=null; key=keys[i]; i++) {
      GM_deleteValue(key);
    }
    close_find_work_info();
  }
}

function setCheck(ch)
{
    if( GM_getValueExt( ch ) && GM_getValueExt( ch ) == 1 )
        GM_setValueExt( ch , 0 );
    else
        GM_setValueExt( ch , 1 );
}

function setEdit(id, key)
{
  var LValue = parseInt($('#' + id).value);
  GM_setValueExt(key, LValue);
}

function show_dialog_base(ASettingsHTML)
{
  var bg = $('#bgOverlay' + idn) ;
  var bgc = $('#bgCenter' + idn) ;
  if( !bg ) {
    bg = document.createElement('div') ;
    bg.id = 'bgOverlay' + idn;
    document.body.appendChild( bg );
    bg.className = 'dialogOverlay';
    addEvent(bg, 'click', close_setting_form);

    bgc = document.createElement('div') ;
    bgc.id = 'bgCenter' + idn ;
    document.body.appendChild( bgc );
    bgc.className = 'dialog'; 

    bgc.innerHTML = 
      '<div style="border:1px solid #abc;padding:5px;margin:2px;">' +
      '  <div class="btn_close" id="bt_close'+idn+'" title="Закрыть">x</div>' +
      '  <center>' +
      '    <table>' +
      '      <tr>' +
      '        <td><b>'+str_script_name+' <b class="blue">'+version+'</b></b></td>' +
      '      </tr>' +
      '      <tr><td><hr/></td></tr>' +
      '      <tr>' +
      '        <td><div id="dialog_content'+idn+'">(Empty)</div></td>' +
      '      </tr>' +
      '      <tr><td><hr/></td></tr>' +
      '      <tr>' +
      '        <td class="small_text" >' +
      '          <a class="small_text" href="'+str_url+'">Обновить</a>&nbsp;&nbsp;' +
      '          <a class="small_text" href="'+str_url_aut+'">Нашли ошибку?</a>&nbsp;&nbsp;' +
      '          <a class="small_text" href="'+str_url_sps+'">Сказать спасибо</a>&nbsp;&nbsp;' +
      '          <a class="small_text" style="left:calc(50% - 100px);" href="javascript:void(0);" id="settings_reset'+idn+'">Скинуть все настройки</a> ' +
      '        </td>' +
      '      </tr>' +
      '      <tr>' +
      '        <td class="small_text" >' +
      '          Автор: <a class="small_text" href="/pl_info.php?id=30547">Pahan.</a>' +
      '        </td>' +
      '      </tr>' +
      '    </table>' +
      '  </center>' +
      '</div>';

    addEvent($('#bt_close' + idn), 'click', close_setting_form);  
    addEvent($('#settings_reset' + idn), 'click', clear_all_params);
  }
  bg.style.display = bgc.style.display = 'block' ; 
    
  $('#dialog_content'+idn).innerHTML = ASettingsHTML;
}

function show_settings_base(ASettingsHTML)
{
  show_dialog_base('<div><b>Настройки:</b></div>' + ASettingsHTML);
}

// ------------------ dialog

function SpsProcess()
{
  if (location.href.indexOf('/transfer.php') > -1)
  {
    var LSps = decodeURIComponent(URLAttrValueGet('pahan_sps', location.href));
    if (LSps != '')
    {
      document.forms.f.nick.value = 'Pahan';
      document.forms.f.gold.value = '500';
      document.forms.f.desc.value = LSps;
    }
  }
}
SpsProcess();

//----------------------------------- GM_ValueExt

var gUserID = '';
function SaveUserID()
{
  var LLinks = document.querySelectorAll('a[href*="pl_hunter_stat.php?id="]');
  if (LLinks && (LLinks.length > 0))
  {
    gUserID = URLAttrValueGet('id', LLinks[0].href);
    GM_setValue('gUserID', gUserID);
  }
  else
    gUserID = GM_getValue('gUserID', '');
}
SaveUserID();

function GM_getValueExt(key, def)
{
  return GM_getValue(key + gUserID, def);
};

function GM_setValueExt(key, value)
{
  return GM_setValue(key + gUserID, value);
};

function GM_deleteValueExt(key)
{
  return GM_deleteValue(key + gUserID);
};

//------------------

// cX_Y  координаты по карте
Pahan_locX =
{
  c50_50: 1, //Empire Capital
  c51_50: 2, //East River
  c50_49: 3, //Tiger's Lake
  c51_49: 4, //Rogue's Wood
  c50_51: 5, //Wolf's Dale
  c50_48: 6, //Peaceful Camp
  c49_51: 7, //Lizard's Lowland
  c49_50: 8, //Green Wood
  c49_48: 9, //Eagle's Nest //Inferno portal 2
  c50_52: 10, //Portal Ruins //Inferno portal 1
  c51_51: 11, //Dragon's Caves
  c49_49: 12, //Shining Spring
  c48_49: 13, //Sunny City
  c52_50: 14, //Magma Mines
  c52_49: 15, //Bear' Mountain
  c52_48: 16, //Fairy Trees
  c53_50: 17, //Harbour City
  c53_49: 18, //Mythril Coast //Inferno portal 3
  c51_52: 19, //Great Wall
  c51_53: 20, //Titans' Valley
  c52_53: 21, //Fishing Village
  c52_54: 22, //Kingdom Castle
  c48_48: 23, //Ungovernable Steppe
  c51_48: 24, //Crystal Garden
  c49_52: 25, //Empty //East Island (Old Location)
  c49_52: 26, //The Wilderness
  c48_50: 27 //Sublime Arbor
}
         
// Массив локаций
var Pahan_locArr = new Array(
//  0i  1x  2y  3r  4ne      5nr
    [] ,
    [ 1 ,   50 ,  50 ,  1 ,  'Empire Capital' ,     'Столица Империи' ,   300,210,180], 
    [ 2 ,   51 ,  50 ,  1 ,  'East River' ,         'Восточная Река' ,    170,160,210],
    [ 3 ,   50 ,  49 ,  1 ,  'Tiger\'s Lake' ,      'Тигриное Озеро' ,    170,210,210],
    [ 4 ,   51 ,  49 ,  1 ,  'Rogue\'s Wood' ,      'Лес Разбойников',    171,210,210],
    [ 5 ,   50 ,  51 ,  1 ,  'Wolf\'s Dale' ,       'Долина Волков' ,     170,205,210],
    [ 6 ,   50 ,  48 ,  1 ,  'Peaceful Camp' ,      'Мирный Лагерь' ,     172,205,215],
    [ 7 ,   49 ,  51 ,  1 ,  'Lizard\'s Lowland' ,  'Равнина Ящеров' ,    171,205,210],
    [ 8 ,   49 ,  50 ,  1 ,  'Green Wood' ,         'Зелёный Лес' ,       170,205,210], 
    [ 9 ,   49 ,  48 ,  1 ,  'Eagle\'s Nest' ,      'Орлиное Гнездо' ,    174,205,210], 
    [ 10 ,  50 ,  52 ,  1 ,  'Portal\'s ruins' ,    'Руины Портала' ,     172,205,210],
    [ 11 ,  51 ,  51 ,  1 ,  'Dragon\'s Caves' ,    'Пещеры Драконов' ,   190,0,  215],
    [ 12 ,  49 ,  49 ,  1 ,  'Shining Spring' ,     'Сияющий Родник' ,    171,206,210],
    [ 13 ,  48 ,  49 ,  1 ,  'Sunny City' ,         'Солнечный Город' ,   174,206,211],
    [ 14 ,  52 ,  50 ,  1 ,  'Magma Mines' ,        'Магма Шахты' ,       190,200,210],
    [ 15 ,  52 ,  49 ,  1 ,  'Bear\' Mountain' ,    'Медвежья Гора' ,     190,205,210],
    [ 16 ,  52 ,  48 ,  1 ,  'Fairy Trees' ,        'Магический Лес' ,    175,205,211],
    [ 17 ,  53 ,  50 ,  1 ,  'Harbour City ' ,      'Портовый Город' ,    175,0,  220],
    [ 18 ,  53 ,  49 ,  1 ,  'Mythril Coast' ,      'Мифриловый Берег' ,  176,210,210],
    [ 19 ,  51 ,  52 ,  1 ,  'Great Wall' ,         'Великая Стена' ,     174,205,220],
    [ 20 ,  51 ,  53 ,  1 ,  'Titans\' Valley' ,    'Равнина Титанов' ,   176,210,215],
    [ 21 ,  52 ,  53 ,  1 ,  'Fishing Village' ,    'Рыбачье Село' ,      177,200,220],
    [ 22 ,  52 ,  54 ,  1 ,  'Kingdom Castle' ,     'Замок Королевства' , 180,205,215],
    [ 23 ,  48 ,  48 ,  1 ,  'Ungovernable Steppe', 'Непокорная Степь' ,  190,0,  215],
    [ 24 ,  51 ,  48 ,  1 ,  'Crystal Garden' ,     'Кристальный Сад' ,   0,  205,220],
    [] ,
    [ 26 ,  49 ,  52 ,  1 ,  'The Wilderness' ,     'Дикие Земли' ,       0,  0,  210],
    [ 27 ,  48 ,  50 ,  1 ,  'Sublime Arbor' ,      'Великое Древо' ,     0,  0,  210]
)

// location error
// сначала путь берёт диагональ, а потом катет
Pahan_locP =
{
    l1_14: 11 ,
    l1_17: 11 ,
    l1_26: 5 ,
    l1_27: 8 ,

    l2_14: 15 ,
    l2_17: 15 ,
    l2_18: 15 ,
    l2_21: 11 ,
    l2_22: 11 ,
    l2_27: 1 ,

    l3_14: 4 ,
    l3_16: 4 ,
    l3_17: 4 ,
    l3_26: 1 ,
    l3_27: 12 ,

    l4_14: 15 ,
    l4_16: 15 ,
    l4_17: 15 ,
    l4_21: 2 ,
    l4_22: 2 ,
    l4_26: 2 ,
    l4_27: 3 ,

    l5_14: 11 ,
    l5_17: 11 ,
    l5_19: 10 ,
    l5_20: 10 ,
    l5_21: 10 ,
    l5_22: 10 ,
    l5_27: 8 ,

    l6_2: 4 ,
    l6_16: 4 ,
    l6_26: 3 ,
    l6_27: 12 ,

    l7_13: 8 ,
    l7_14: 5 ,
    l7_17: 5 ,
    l7_23: 8 ,
    l7_26: 5 ,

    l8_14: 5 ,
    l8_17: 5 ,
    l8_26: 5 ,

    l9_16: 3 ,
    l9_26: 3 ,

    l10_27: 5 ,

    l11_3: 2 ,
    l11_6: 2 ,
    l11_9: 2 ,
    l11_21: 19 ,
    l11_22: 19 ,
    l11_26: 10 ,
    l11_27: 5 ,

    l12_14: 3 ,
    l12_16: 3 ,
    l12_17: 3 ,
    l12_26: 1 ,

    l13_14: 12 ,
    l13_16: 12 ,
    l13_17: 12 ,

    l14_1: 11 ,
    l14_2: 15 ,
    l14_3: 15 ,
    l14_4: 15 ,
    l14_6: 15 ,
    l14_8: 11 ,
    l14_9: 15 ,
    l14_12: 15 ,
    l14_13: 15 ,
    l14_18: 15 ,
    l14_21: 11 ,
    l14_22: 11 ,
    l14_23: 15 ,
    l14_24: 15 ,
    l14_27: 11 ,

//    l15_6: 4 ,
//    l15_9: 4 ,
    l15_23: 24 ,
    l15_26: 2 ,
    l15_27: 4 ,

    l16_1: 15 ,
    l16_2: 15 ,
    l16_3: 15 ,
    l16_4: 15 ,
    l16_5: 15 ,
    l16_6: 15 ,
    l16_7: 15 ,
    l16_8: 15 ,
    l16_9: 15 ,
    l16_10: 15 ,
    l16_11: 15 ,
    l16_12: 15 ,
    l16_13: 15 ,
    l16_19: 15 ,
    l16_20: 15 ,
    l16_23: 15 ,
    l16_24: 15 ,
    l16_26: 15 ,
    l16_27: 15 ,

    l17_2: 15 ,
    l17_5: 14 ,
    l17_7: 14 ,
    l17_10: 14 ,
    l17_11: 14 ,
    l17_19: 14 ,
    l17_20: 14 ,
    l17_21: 14 ,
    l17_22: 14 ,
    l17_26: 14 ,
    l17_27: 14 ,

    l18_1: 15 ,
    l18_2: 15 ,
    l18_5: 15 ,
    l18_6: 15 ,
    l18_7: 15 ,
    l18_8: 15 ,
    l18_9: 15 ,
    l18_10: 17 ,
    l18_11: 17 ,
    l18_14: 17 ,
    l18_19: 17 ,
    l18_20: 17 ,
    l18_21: 17 ,
    l18_22: 17 ,
    l18_23: 15 ,
    l18_24: 15 ,
    l18_26: 17 ,
    l18_27: 15 ,

    l19_1: 11 ,
    l19_3: 11 ,
    l19_5: 10 ,
    l19_6: 11 ,
    l19_7: 10 ,
    l19_8: 10 ,
    l19_9: 11 ,
    l19_12: 10 ,
    l19_13: 10 ,
    l19_14: 11 ,
    l19_15: 11 ,
    l19_16: 11 ,
    l19_17: 11 ,
    l19_18: 11 ,
    l19_23: 10 ,
    l19_27: 10 ,

    l20_14: 19 ,
    l20_15: 19 ,
    l20_16: 19 ,
    l20_17: 19 ,
    l20_18: 19 ,
    l20_27: 10 ,

    l21_14: 19 ,
    l21_15: 19 ,
    l21_16: 19 ,
    l21_17: 19 ,
    l21_18: 19 ,
    l21_27: 19 ,

    l22_17: 21 ,
    l22_18: 21 ,
    l22_27: 20 ,

    l23_16: 15 ,
    l23_26: 1 ,
    l23_27: 13 ,

    l24_16: 15 ,
    l24_21: 2 ,
    l24_22: 2 ,
    l24_26: 2 ,
    l24_27: 3 ,

    l26_7: 5 ,
    l26_8: 5 ,
    l26_9: 5 ,
    l26_11: 10 ,
    l26_12: 5 ,
    l26_13: 5 ,
    l26_14: 10 ,
    l26_17: 10 ,
    l26_20: 10 ,
    l26_21: 10 ,
    l26_22: 10 ,
    l26_23: 5 ,
    l26_24: 5 , 
    l26_27: 5 , 

    l27_1: 8 ,
    l27_2: 8 ,
    l27_3: 12 ,
    l27_4: 12 ,
    l27_5: 7 ,
    l27_6: 12 ,
    l27_9: 12 ,
    l27_10: 7 ,
    l27_11: 7 ,
    l27_14: 11 ,
    l27_15: 4 ,
    l27_16: 15 ,
    l27_17: 15 ,
    l27_18: 12 ,
    l27_19: 10 ,
    l27_20: 10 ,
    l27_21: 20 ,
    l27_22: 20 ,
    l27_23: 13 ,
    l27_24: 12 ,
    l27_26: 8

}

var Pahan_trtime = new Array( 120 , 84 , 60 , 36 , 24 , 12 ) ;   // время перемещения по прямой
var Pahan_trtimed = new Array( 169 , 118 , 84 , 50 , 33 , 16 ) ;   // время перемещения по диагонали

function getMoveTimeL(cz , mz , t ) {
/*  cz  текущий сектор обсчёта
    mz  конечный сектор обсчёта
    t  сумма времени
*/

    // если прибыли в конечный пункт
    if( mz == cz ) {
//        var myT = new Date(t*1000)
//        myTs = myT.getSeconds()
//        return myT.getMinutes() + ':' + ( myTs < 10 ? '0' : '' ) + myTs ;
        return t;
    }

    var nz = 0;     // следующий сектор, к которому надо действительно двигаться

    var kC = Pahan_locArr[cz];   //координаты текущие
    if(kC == undefined) return 0;
    var kM = Pahan_locArr[mz];   //координаты назначения

    var id1 = eval( 'Pahan_locP.l' + cz + '_' + mz ) //id исключение

    // если есть исключения, следующий сектор будет равен ид исключения
    if( id1 && id1 > 0 ) {
        nz = id1 ;
    }

    // если исключения, то переназначаем координаты назначения
    if( nz != 0 )
      var kM = Pahan_locArr[nz] ;

    var tx = kM[1] > kC[1] ? 1 : ( kM[1] == kC[1] ? 0 : -1 ) ;
    var ty = kM[2] > kC[2] ? 1 : ( kM[2] == kC[2] ? 0 : -1 ) ;
    var nx = parseInt( kC[1] ) + tx ;
    var ny = parseInt( kC[2] ) + ty ;

//    t = ( ty == 0 || tx == 0 ) ? t + 120 : t + 169 ;
    t = ( ty == 0 || tx == 0 ) ? t + Pahan_trtime[0] : t + Pahan_trtimed[0] ;
    var id = eval( 'Pahan_locX.c' + nx + '_' + ny ) ;
//    t = t + ' ' + id + '(' + nz + ')' ;

    return getMoveTimeL( id , mz , t );
}

function GetCurrLocation(AHTML)
{
//!!  var re = /<[^>]*href='([^']*)'[^>]*>&raquo;&raquo;&raquo;<\/a>/gim;
  var re = /<param[^>]*\/map.swf[^>]*>\s*<param[^>]*value="([^"]*)"[^>]*>/gim;
  var res;
  if ((res = re.exec(AHTML)) != null)
  {
    return res[1].split('=')[1].split(':')[1];
  }
  else
    return 1;
}

function GetSortedLocations(LCurrLocation)
{
  var LLocs = new Array();
  for (var i = 0; i < Pahan_locArr.length; i++)
  {
    var LLoc = Pahan_locArr[i];          
    if (LLoc && (LLoc.length == 9))
    {
      LLoc[9] = getMoveTimeL(LCurrLocation, LLoc[0], 0);
      LLocs.push(LLoc);
    }
  }
  LLocs.sort(function(a, b) {
    return a[9] - b[9];
  });
  return LLocs;
}

// ---------------------------------

var WorkResultFound = false;
var SortedLocations = null;
var GoldSumm = 0;
var WorkCountSumm = 0;
var ObjectsSumm = new Array();

function show_settings()
{
  WorkResultFound = true;
  
  var LStr =
    '    <table>' +
    '      <tr>' +
    '        <td>' +
    '          <label style="cursor:pointer;"><input type="checkbox" id="id_return_after_work" title=""> Возвращатся на страницу после установки на работу</lable>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <label style="cursor:pointer;"><input type="checkbox" id="id_last_code_buffer_copy" title=""> Запоминать предыдущий код в буфер обмена</lable>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <div><input type="text" style="width:40;" id="id_min_zp"> Минимальная зарплата, не предлагать меньшую </div>' +
    '          <div>Значение "0" - подходит любая зарплата</div>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <label style="cursor:pointer;"><input type="checkbox" id="id_scan_other_locations" title=""> Искать на других локациях (только с транспортом)</lable>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <div><input type="text" style="width:40;" id="id_max_loc_count"> Количество соседних локаций для сканирования</div>' +
    '          <div>Значение "0" - сканировать все локации на карте</div>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <label style="cursor:pointer;"><input type="checkbox" id="id_show_settled_window" title=""> ' +
    '            Показывать после установки окно с надписью "Вы устроены на работу."</label">' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <div><input type="text" style="width:80;" id="id_min_obj_work_count"> Пропускать объект если свободных рабочих мест меньшe</div>' +
    '          <div><input type="text" style="width:80;" id="id_min_obj_gold_count"> Пропускать объект если золота меньше</div>' +
    '          <div><input type="text" style="width:80;" id="id_min_loc_work_count"> Пропускать локацию если свободных рабочих мест меньшe</div>' +
    '          <div><input type="text" style="width:80;" id="id_min_loc_gold_count"> Пропускать локацию если золота меньше</div>' +
    '        </td>' +
    '      </tr>' +
    '    </table>';

  show_settings_base(LStr);  
  var check_return = $('#id_return_after_work');
  check_return.checked = GM_getValueExt('return_after_work', 0) == 1 ? 'checked' : '' ;
  addEvent(check_return, 'click', function(){setCheck('return_after_work')});
  
  var Lmin_zp = $("#id_min_zp");
  Lmin_zp.value = parseInt(GM_getValueExt('min_zp', '0'));
  Lmin_zp.addEventListener( "change", function(){setEdit('id_min_zp', 'min_zp')}, false );
  Lmin_zp.addEventListener( "keyup", function(){setEdit('id_min_zp', 'min_zp')}, false );
  Lmin_zp.addEventListener( "paste", function(){setEdit('id_min_zp', 'min_zp')}, false );
  
  var check_other_locations = $('#id_scan_other_locations');
  check_other_locations.checked = GM_getValueExt('scan_other_locations', 0) == 1 ? 'checked' : '' ;
  addEvent(check_other_locations, 'click', function(){setCheck('scan_other_locations')});
  
  var Lmax_loc_count = $("#id_max_loc_count");
  Lmax_loc_count.value = parseInt(GM_getValueExt('max_loc_count', '0'));
  Lmax_loc_count.addEventListener( "change", function(){setEdit('id_max_loc_count', 'max_loc_count')} , false );
  Lmax_loc_count.addEventListener( "keyup", function(){setEdit('id_max_loc_count', 'max_loc_count')} , false );
  Lmax_loc_count.addEventListener( "paste", function(){setEdit('id_max_loc_count', 'max_loc_count')} , false );  

  var check_settled_window = $('#id_show_settled_window');
  check_settled_window.checked = GM_getValueExt('show_settled_window', 0) == 1 ? 'checked' : '' ;
  addEvent(check_settled_window, 'click', function(){setCheck('show_settled_window')});
  
  var Lmin_obj_work_count = $("#id_min_obj_work_count");
  Lmin_obj_work_count.value = parseInt(GM_getValueExt('min_obj_work_count', '0'));
  Lmin_obj_work_count.addEventListener( "change", function(){setEdit('id_min_obj_work_count', 'min_obj_work_count')} , false );
  Lmin_obj_work_count.addEventListener( "keyup", function(){setEdit('id_min_obj_work_count', 'min_obj_work_count')} , false );
  Lmin_obj_work_count.addEventListener( "paste", function(){setEdit('id_min_obj_work_count', 'min_obj_work_count')} , false );  

  var Lmin_obj_gold_count = $("#id_min_obj_gold_count");
  Lmin_obj_gold_count.value = parseInt(GM_getValueExt('min_obj_gold_count', '0'));
  Lmin_obj_gold_count.addEventListener( "change", function(){setEdit('id_min_obj_gold_count', 'min_obj_gold_count')} , false );
  Lmin_obj_gold_count.addEventListener( "keyup", function(){setEdit('id_min_obj_gold_count', 'min_obj_gold_count')} , false );
  Lmin_obj_gold_count.addEventListener( "paste", function(){setEdit('id_min_obj_gold_count', 'min_obj_gold_count')} , false );  

  var Lmin_loc_work_count = $("#id_min_loc_work_count");
  Lmin_loc_work_count.value = parseInt(GM_getValueExt('min_loc_work_count', '0'));
  Lmin_loc_work_count.addEventListener( "change", function(){setEdit('id_min_loc_work_count', 'min_loc_work_count')} , false );
  Lmin_loc_work_count.addEventListener( "keyup", function(){setEdit('id_min_loc_work_count', 'min_loc_work_count')} , false );
  Lmin_loc_work_count.addEventListener( "paste", function(){setEdit('id_min_loc_work_count', 'min_loc_work_count')} , false );  

  var Lmin_loc_gold_count = $("#id_min_loc_gold_count");
  Lmin_loc_gold_count.value = parseInt(GM_getValueExt('min_loc_gold_count', '0'));
  Lmin_loc_gold_count.addEventListener( "change", function(){setEdit('id_min_loc_gold_count', 'min_loc_gold_count')} , false );
  Lmin_loc_gold_count.addEventListener( "keyup", function(){setEdit('id_min_loc_gold_count', 'min_loc_gold_count')} , false );
  Lmin_loc_gold_count.addEventListener( "paste", function(){setEdit('id_min_loc_gold_count', 'min_loc_gold_count')} , false );
  
  var Llast_code_buffer_copy = $('#id_last_code_buffer_copy');
  Llast_code_buffer_copy.checked = GM_getValueExt('last_code_buffer_copy', 0) == 1 ? 'checked' : '' ;
  addEvent(Llast_code_buffer_copy, 'click', function(){setCheck('last_code_buffer_copy')});
}

function cancel_scan_work()
{
  WorkResultFound = true;
}

function ShowFindWorkHTML(AFindWorkHTML, AIsResult)
{
  if (WorkResultFound)
    return;
  WorkResultFound = AIsResult;
    
  show_dialog_base(
    '<div>' + AFindWorkHTML + '</div>' +
    '<div><hr/></div>' +
    '<div class="btn_settings" id="fw_settings"><b>Открыть настройки</b></div>' 
  );
  
  addEvent($('#bt_close' + idn), 'click', cancel_scan_work);
  addEvent($('#bgOverlay' + idn), 'click', cancel_scan_work);
    
  addEvent($("#fw_settings"), 'click', show_settings);
}

function GetObjectInfo(AObjHTML)
{
  AObjHTML = DeleteCRLF(AObjHTML);
    
  var re = /(<table[^>]*><tr[^>]*><td[^>]*>Тип: .*)Список рабочих/gim;
  var LInfo = (res = re.exec(AObjHTML)) ? res[1] : '';
  
  re = /Свободных мест: <b>\d+<\/b>/gim;
  LInfo += (res = re.exec(AObjHTML)) ? res[0] : '';

  return LInfo;
}

function CheckResExists(AHTML)
{
  // <td class="wb"><font color="red">0.01</font> / 50</td>      
  var re = /<td[^>]*><font[^>]*color=red[^>]*>([0-9]*\.?[0-9]*)<\/font>\s*\/\s*([0-9]*\.?[0-9]*)<\/td>/gim;
  var res;
  if ((res = re.exec(AHTML)) != null)
  {
    return false;
  }
  return true;
}

function ObjectProcess(ALocation, AObjLink, AObjHTML)
{
  AObjHTML = DeleteCRLF(AObjHTML);
  
  var re = /Вы уже устроены\./gim;
  var re2 = /Прошло меньше часа с последнего устройства на работу\. Ждите\./gim;
  var res;
  if (((res = re.exec(AObjHTML)) != null) || (res = re2.exec(AObjHTML)) != null)
  {
    ShowFindWorkHTML(res[0], true);
    return;
  }
  
  re = /Свободных мест\: <b>(\d+)<\/b>/gim;
  if ((res = re.exec(AObjHTML)) == null)
    return;
  
  var LWorkCount = parseInt(res[1]);
  var LWorkCountMin = Math.max(parseInt(GM_getValueExt('min_obj_work_count', 0)), 1);
  if (LWorkCount < LWorkCountMin)
    return;
  
  re = /<tr><td>Баланс: <\/td><td><b><table[^>]*><tr><td><img[^>]*gold\.gif[^>]*><\/td><td><b>([\d,]+)<\/b><\/td><\/tr><\/table><\/b><\/td><\/tr>/gim;
  if ((res = re.exec(AObjHTML)) == null)
    return;
  
  var LGold = parseInt(res[1].replace(/,/g, ''));
  var LGoldMin = Math.max(parseInt(GM_getValueExt('min_obj_gold_count', 0)), 20);
  if (LGold < LGoldMin)
    return;
  
  if (!CheckResExists(AObjHTML))
    return;
    
  if (ALocation == 0)
  {
//   e = /<form[^>]*name="working"[^>]*>.*<\/form>/gim;
    re = /<form[^>]*name=working[^>]*>.*<\/form>/gim;
    if ((res = re.exec(AObjHTML)) != null)
    {
      GM_setValueExt('LastURL', location.href);
      var LLastCode = GM_getValueExt('last_code', '');
      var LLastCodeInfo = '';
      if (LLastCode != '')
      {
        LLastCodeInfo = '<div><font color="red"><b>Последний введенный код: ' + LLastCode + '</b></font></div>';
        if (GM_getValueExt('last_code_buffer_copy', 0) == 1)
          GM_setClipboard(LLastCode);
      }
      ShowFindWorkHTML(GetObjectInfo(AObjHTML) + LLastCodeInfo + res[0], true);
      AddRealZPInfo();
    }
  }
  else
  {
    GoldSumm += LGold;
    WorkCountSumm += LWorkCount;
    ObjectsSumm.push(AObjLink);
  }
} 

function FindWorkObject(ALocation, APlaceIndex, AObjIndex, APlaceHTML)
{
  if (APlaceHTML.indexOf('i/index2012/enter0.jpg') > -1)
  {
    ShowFindWorkHTML('Вы не залогированы.<br>' +
      'Перезайдите в игру.', true
    );
    return;
  }

  var re = /<b>(\d+)<\/b>&nbsp;<\/td><td[^>]*>&nbsp;<a[^>]*href='([^']*)'[^>]*>&raquo;&raquo;&raquo;<\/a>/gim;
  var res;
  var LLink;  
  var LZP, LMinZP;
  var LFindCount = 0;
  while ((res = re.exec(APlaceHTML)) != null)
  {
    LZP = parseInt(res[1]);
    LLink = res[2];
    LMinZP = parseInt(GM_getValueExt('min_zp', '0'));
    if ((LMinZP == 0) || (LZP >= LMinZP))
    {   
      if (LFindCount == AObjIndex)
      {
        Ajax('GET', LLink, null,
          function(AObjHTML, AURL)
          {
            ObjectProcess(ALocation, AURL, AObjHTML);
            if (!WorkResultFound)
              FindWorkObject(ALocation, APlaceIndex, AObjIndex + 1, APlaceHTML);
          }
        );
      }
      LFindCount++;
    }
  }

//  $("#find_work").innerHTML = $("#find_work").innerHTML + '<br>' +     
//    'AObjIndex: ' + AObjIndex + ', LFindCount: ' + LFindCount;
          
  if (!WorkResultFound && (AObjIndex >= LFindCount)) 
    FindWorkProcess(ALocation, APlaceIndex + 1);
}

function GetObjectsSummStr()
{
  var LRes = '';
  ObjectsSumm.forEach(function(item, i, arr) {
    if (LRes != '')
      LRes += ', ';
    LRes += '<a href="' + item + '">' + URLAttrValueGet('id', item) + '</a>';
  });
  return LRes;
}
                          
function FindWorkProcess(ALocation, APlaceIndex)
{
  var PlaceCodes = ['sh', 'fc', 'mn'];
  var PlaceNames = ['Производства', 'Обработка', 'Добыча'];

  if (APlaceIndex < PlaceCodes.length)
  {
    if (APlaceIndex == 0)
    {
      GoldSumm = 0;
      WorkCountSumm = 0;
      ObjectsSumm = new Array();
    }
    if ((ALocation != 0) || (APlaceIndex != 0))
    {
      var LMinZP = parseInt(GM_getValueExt('min_zp', '0'));
      if (LMinZP > 0)
      {   /*
        alert(
          'PlaceIndex: ' + APlaceIndex +
          ', MinZP: ' + LMinZP +          
          ', SortedLocations[ALocation][8]: ' + SortedLocations[ALocation][8] +          
          ', SortedLocations[ALocation][7]: ' + SortedLocations[ALocation][7] +          
          ', SortedLocations[ALocation][6]: ' + SortedLocations[ALocation][6]          
        );  */
        if ((APlaceIndex == 0) && (LMinZP > SortedLocations[ALocation][8])
          || (APlaceIndex == 1) && (LMinZP > SortedLocations[ALocation][7])
          || (APlaceIndex == 2) && (LMinZP > SortedLocations[ALocation][6])
        )
        {
          FindWorkProcess(ALocation, APlaceIndex + 1);  
          return;
        }   
      }
    }  
    
    var LLocXY = '';
    if (ALocation != 0)
      LLocXY = 'cx=' + SortedLocations[ALocation][1] + '&cy=' + SortedLocations[ALocation][2] + '&';
    var LURL = '/map.php?' + LLocXY + 'st=' + PlaceCodes[APlaceIndex];
    Ajax('GET', LURL, null,
      function(AHTML)
      {
        if (!SortedLocations)
          SortedLocations = GetSortedLocations(GetCurrLocation(DeleteCRLF(AHTML)));
        ShowFindWorkHTML('Сканирование локации ' + SortedLocations[ALocation][5] +
          ' ' + PlaceNames[APlaceIndex] + '...<br>', false);
        FindWorkObject(ALocation, APlaceIndex, 0, AHTML);
      }
    );
  }
  else
  {
    var LWorkCountSummMin = Math.max(parseInt(GM_getValueExt('min_loc_work_count', 0)), 5);
    var LGoldSummMin = Math.max(parseInt(GM_getValueExt('min_loc_gold_count', 0)), 2000);
    if ((ALocation > 0) && (WorkCountSumm >= LWorkCountSummMin) && (GoldSumm >= LGoldSummMin))
    {
      var LURL = '/move_sector.php?id=' + SortedLocations[ALocation][0];
      ShowFindWorkHTML('На локации ' + SortedLocations[ALocation][5] + ' найдено:<br>' +
        'Объектов (' + ObjectsSumm.length + '): ' + GetObjectsSummStr() + '<br>' +
        'Рабочих мест: <b>' + WorkCountSumm + '</b><br>' +
        'Доступное для зарплаты золото: <b>' + IntFormatWithThouthandSeparator(GoldSumm) + '</b><br>' +
        'Перейти: <a class="blueRef" href="' + LURL + '">' + SortedLocations[ALocation][5] + '</a>', true
      );
    }
    else
    {
      var LMaxLocCount = -1;
      if (GM_getValueExt('scan_other_locations', 0) == 1)
        LMaxLocCount = parseInt(GM_getValueExt('max_loc_count', '0'));
      ALocation++;
      if ((LMaxLocCount == 0) && (SortedLocations.length > ALocation)
        || (ALocation <= LMaxLocCount)
      )
        FindWorkProcess(ALocation, 0);
      else
        ShowFindWorkHTML('Поиск работы завершен.<br>' +
          'Все места заняты или недостаточно золота на объектах.<br>' +
          'Смените локацию, или попробуйте позже.', true
        );
    }
  }
}

function StartScan()
{
  WorkResultFound = false;
  GM_deleteValueExt('LastURL');
  ShowFindWorkHTML('Сканирование локации...<br>', false);
  FindWorkProcess(0, 0);
}
          
function AddWorkFindHref()
{
  var LLinks = document.querySelectorAll('a[href*="map.php"]');
  var LLink;
  if (LLinks)
  {                
    for(var i = 0; i < LLinks.length; i++)
    {                   
      LLink = LLinks[i];
      if (LLink.innerHTML == '<b>Карта</b>')
      {
        var LColor = '#f5c137';
        if (GM_getValueExt('IsWorking', true) == false)
          LColor = 'red';
          
        LNewHref = document.createElement('a');
        LNewHref.href = 'javascript:void(0)';
        LNewHref.style = 'text-decoration: none;color: ' + LColor + ';' 
        LNewHref.innerHTML = '<b>ГР</b>';
        LNewHref.title = 'Найти место работы';
        LNewHref.id = 'find_work';
        LLink.parentNode.appendChild(LNewHref);
        
        addEvent($("#find_work"), "click", StartScan);
      }
    }
  }
}

function ProcessReturn()
{
  var LCode = URLAttrValueGet('code', location.href);
  if ((LCode == '') && (GM_getValueExt('IsProcessReturn', false) === false))
    return;

  GM_deleteValueExt('IsProcessReturn');
  var LLastURL = GM_getValueExt('LastURL', '');
  var LCmd = parseInt(GM_getValueExt('cmd', 0));
  if (LCmd == 0)
  {
    if (LLastURL == '')
      return;

//    <font color="red"><b>Введен неправильный код.</b></font>
    var re = /<font[^>]*><b>(Введен неправильный код\.)<\/b><\/font>/gim;
    var re2 = /<font[^>]*><b>(На объекте недостаточно золота\.)<\/b><\/font>/gim;
    var re3 = /<font[^>]*><b>(Нет рабочих мест\.)<\/b><\/font>/gim;
    var re4 = /<center>(Вы устроены на работу\.)<\/center>/gim;
    var res;
    
    if ((res = re.exec(document.body.innerHTML)) != null)
      LCmd = 1; 
    else
    if (((res = re2.exec(document.body.innerHTML)) != null)
      || ((res = re3.exec(document.body.innerHTML)) != null)
    )
      LCmd = 2;
    else
    if ((res = re4.exec(document.body.innerHTML)) != null)
      LCmd = 3;
    
    if (LCmd == 0)
    {
      GM_deleteValueExt('last_code');
      GM_deleteValueExt('last_work_info');
      GM_deleteValueExt('cmd');
    }
    else
    {
      GM_setValueExt('last_code', LCode);
      GM_setValueExt('last_work_info', res[1]);
      GM_setValueExt('cmd', LCmd);
    }
    
    if (LLastURL != '')
    {
      GM_deleteValueExt('LastURL');
      if (GM_getValueExt('return_after_work', 0) == 1)
      {
        GM_setValueExt('IsProcessReturn', true);
        location.href = LLastURL;
        return;
      }
    }
  }

  if (LCmd != 0)
  {
    var LWorkInfo = GM_getValueExt('last_work_info', '');

    GM_deleteValueExt('last_work_info');
    GM_deleteValueExt('cmd');
    
    if (LCmd == 1)
    {
      var LStr = '<font color="red">' + LWorkInfo + '</font><br>' +
        '<div class="blueRef" id="fw_restart_scan">Сканировать заново</div>';
      ShowFindWorkHTML(LStr, true);
      addEvent($("#fw_restart_scan"), 'click', StartScan);
    }
    else
    if (LCmd == 2)
    {
      var LStr = '<font color="red">' + LWorkInfo + '</font><br>' +
        '<div class="btn_settings" id="fw_restart_scan">Сканировать заново</div>';
      ShowFindWorkHTML(LStr, true);
      addEvent($("#fw_restart_scan"), 'click', StartScan);
    }
    else
    if (LCmd == 3)
    {
      GM_deleteValueExt('last_code');
      if (GM_getValueExt('show_settled_window', 0) == 1) 
        ShowFindWorkHTML('<font color="#0070FF">' + LWorkInfo + '</font>', true);
    }
    else
    {
      GM_deleteValueExt('last_code');
      GM_deleteValueExt('last_work_info');
      GM_deleteValueExt('cmd');
    }
  }
  else
  {
    GM_deleteValueExt('last_code');
    GM_deleteValueExt('last_work_info');
    GM_deleteValueExt('cmd');
  }      
}

function AddRealZPInfo()
{
  var LCoefsGR = new Array(1.0, 1.1, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0);
  
  var LTD = null;
  var LTDels = document.getElementsByTagName('td');
  for( var i = 0; i < LTDels.length; i++ )
    if (LTDels[i].innerHTML == 'Зарплата: ')
    {
      LTD = LTDels[i];
      
      var LBels = LTD.parentNode.getElementsByTagName('b');
      var LB = null;
      var re = /^([\d,]+)$/gim;
      var res;
      for( var j = 0; j < LBels.length; j++ )
        if ((res = re.exec(LBels[j].innerHTML)) != null)
        {
          LB = LBels[j];
          
          var LZP = parseInt(res[1].replace(/,/g, ''));
          var LLevel = parseInt(GM_getValueExt('LevelGR', 0));
          var LCoefGR = LCoefsGR[LLevel];
          var LCoefFine = 1;
          var re2 = /<b>&nbsp;\*&nbsp;(\d+\.\d+) штраф трудоголика\.<\/b>/gim;
          var res2;
          if ((res2 = re2.exec(LTD.parentNode.innerHTML)) != null)
            LCoefFine = parseFloat(res2[1]);
          var LRealZP = FloatFormat(LZP * LCoefGR * LCoefFine);

          var LTitle = 
            'Зарплата: ' + LZP + '\n' +
            'Реальная зарплата: ' + LRealZP + '\n' + 
            'Уровень ГР: ' + LLevel + '\n' +
            'Коэффициент ГР: ' + LCoefGR + '\n' +
            'Штраф трудоголика: ' + ((LCoefFine == 1) ? 'Отсутствует' : LCoefFine);
            
          LB.innerHTML = LB.innerHTML +
            ' (<font style="font-size:12px" color="red" title="' + LTitle + '">' + LRealZP + '</font>)';
        }
    }
}

function SaveLevelGR()
{
  //var re = /^([\d]+)$/gim;
  var re = /Гильдия Рабочих: ([\d]+) /gim;
  var res;
  if ((res = re.exec(document.body.innerHTML)) != null)
    GM_setValueExt('LevelGR', res[1]);
}

function InitIsWorking()
{
  var b = document.querySelector("body");
    
  if (location.pathname=='/home.php' && document.querySelector("img[src$='i/s_defence.gif']"))
  {               
    var work_unemployed = '\u0412\u044B \u043D\u0438\u0433\u0434\u0435 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442\u0435';
    // vychislenie vremeni servera (s podderzkoj scripta time_seconds)
    var time_home = /\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0438\u0442\u044c\u0441\u044f \u043d\u0430 \u0440\u0430\u0431\u043e\u0442\u0443 \u0447\u0435\u0440\u0435\u0437 (\d+)/;
    var time_home2 = / \u0441 (\d+):(\d+)<\/td>/;

    var LIsWorking = true;
  // podhvatyvanie vremeni okonchaniya raboty s home.php i ego proverka
    if ( time_home.exec( b.innerHTML ) )
      LIsWorking = true;
    else if ( time_home2.exec( b.innerHTML ) )
      LIsWorking = true;
    else
    if ( b.innerHTML.match( work_unemployed ) )
      LIsWorking = false;
      
    GM_setValueExt('IsWorking', LIsWorking);
  }
  
                
  if ( location.pathname=='/object_do.php' )
  {
    var work_obj_do = '\u0412\u044b \u0443\u0441\u0442\u0440\u043e\u0435\u043d\u044b \u043d\u0430 \u0440\u0430\u0431\u043e\u0442\u0443';
    if ( b.innerHTML.match( work_obj_do ) )
      GM_setValueExt('IsWorking', true);
  }  
}    

function ProcessMain()
{
  InitIsWorking();
  AddWorkFindHref();
  ProcessReturn();
  if (location.href.indexOf('/object-info.php') > -1)
    AddRealZPInfo();
  if (location.href.indexOf('/home.php') > -1)
    SaveLevelGR();
}

ProcessMain();

})();