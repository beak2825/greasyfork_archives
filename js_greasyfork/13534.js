// ==UserScript==
// @name           hwm_tavern_new_game
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Создание заявки в таверне в один клик
// @homepage       https://greasyfork.org/uk/scripts/13534-hwm-tavern-new-game
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.33
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/*
// @include        http://*lordswm.com/*
// @include        http://178.248.235.15/*
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
// @downloadURL https://update.greasyfork.org/scripts/13534/hwm_tavern_new_game.user.js
// @updateURL https://update.greasyfork.org/scripts/13534/hwm_tavern_new_game.meta.js
// ==/UserScript==

var version = '1.33';
var str_url = 'https://greasyfork.org/uk/scripts/13534-hwm-tavern-new-game';
var str_script_name = 'Таверна, новая игра';
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
	}
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
      ACallBackFunc(LRequest.responseText);
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

// -----------------------------------------------

function close_setting_form() {
    bg = $('#bgOverlay_tavern_ng') ;
    bgc = $('#bgCenter_tavern_ng') ;
    if( bg ) {
        bg.style.display = bgc.style.display = 'none' ;
    }
}

function open_setting_form()
{
  bg = $('#bgOverlay_tavern_ng') ;
  bgc = $('#bgCenter_tavern_ng') ;
  if( !bg ) {
      bg = document.createElement('div') ;
      bg.id = 'bgOverlay_tavern_ng' ;
      document.body.appendChild( bg );
      bg.style.position = 'absolute' ;
      bg.style.left = '0';
      bg.style.width = '100%';
      bg.style.height = '100%';
      bg.style.background = "#000000";
      bg.style.opacity = "0.5";
      bg.addEventListener( "click", close_setting_form , false );

      bgc = document.createElement('div') ;
      bgc.id = 'bgCenter_tavern_ng' ;
      document.body.appendChild( bgc );
      bgc.style.position = 'absolute' ;
      bgc.style.width = '600px';
      bgc.style.background = "#F6F3EA";
      bgc.style.left = ( ( document.body.offsetWidth - 400 ) / 2 ) + 'px' ;
      bgc.style.zIndex = "1105";
  }
  
  bgc.innerHTML = 
    '<div style="border:1px solid #abc;padding:5px;margin:2px;">' +
    '  <div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tavern_ng" title="Закрыть">x</div>' +
    '  <center>' +
    '    <table>' +
    '      <tr>' +
    '        <td><b>'+str_script_name+' <font style="color:#0070FF;">'+version+'</font></b><hr/></td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td><b>Настройки:</b></td>' +
    '      </tr>' +
    '      <tr>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>Пока пусто</td>' +
    '      </tr>' +
    '      <tr><td><hr/></td></tr>' +
    '      <tr>' +
    '        <td style="font-weight:bold;font-size:10px;" >' +
    '          <a style="font-weight:bold;font-size:10px;" href="'+str_url+'">Обновить</a> ' +
    '          <a style="font-weight:bold;font-size:10px;" href="'+str_url_aut+'">Нашли ошибку?</a> ' +
    '          <a style="font-weight:bold;font-size:10px;" href="'+str_url_sps+'">Сказать спасибо</a> ' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td style="font-weight:bold;font-size:10px;" >' +
    '          Автор: <a style="font-weight:bold;font-size:10px;" href="http://www.heroeswm.ru/pl_info.php?id=30547">Pahan.</a>' +
    '        </td>' +
    '      </tr>' +
    '    </table>' +
    '  </center>' +
    '</div>';
    
  $("#bt_close_tavern_ng").addEventListener( "click", close_setting_form , false );    
  
  bg.style.top = (-document.body.scrollTop)+'px';
  bgc.style.top = ( document.body.scrollTop + 100 ) + 'px';
  bg.style.display = bgc.style.display = 'block' ;    
}

function AddNewGameLink()
{
  var Golds = [0, 40, 200, 400, 600, 1000, 2000, 3000,
    4000, 5000, 6000, 7000, 10000, 11000, 12000];
    
  var timeout = GM_getValue('timeout', '30');
  var ktype = GM_getValue('ktype', '1');
  var gold = GM_getValue('gold', '0');
  
  var Lhref = '/create_card_game.php?timeout=' + timeout + '&ktype=' +
    ktype + '&gold=' + gold + '';
  var Ltitle =
    'Создать заявку\n' +
    'Время: ' + timeout + '\n' +
    'Тип: ' + (ktype == 1 ? 'Одна колода карт' : 'Бесконечная колода карт') + '\n' +
    'Ставка: ' + Golds[gold];

  var LLinks = document.querySelectorAll('a[href^="/tavern.php?form=1"]');
  if (LLinks && (LLinks.length > 0))
  {
    var LLink = LLinks[0];
    var LNewGameHref = document.createElement('a');
    LNewGameHref.href = Lhref;
    LNewGameHref.title = Ltitle;
    LNewGameHref.innerHTML = '<font color="red"><b>Создать заявку(+)</b></font>';
    LLink.parentNode.insertBefore(LNewGameHref, LLink);
    
    var LDiv = document.createElement('div');
    LDiv.innerHTML = '<div style="text-decoration:underline;cursor:pointer;font-weight:bold;font-size:10px;" id="hwm_hant_options">Настройки';
    LLink.parentNode.insertBefore(LDiv, LLink);
    $("#hwm_hant_options").addEventListener( "click", open_setting_form , false );

    var LBR = document.createElement('br');
    LLink.parentNode.insertBefore(LBR, LLink);
  }
  
  var LLinks = document.querySelectorAll('a[href="tavern.php"]');
  if (LLinks && (LLinks.length > 0))
  {
    var LLink = LLinks[0];
    var LNewHref = document.createElement('a');
    LNewHref.href = Lhref;
    LNewHref.title = Ltitle;
    LNewHref.style = "text-decoration: none;color: #f5c137;" 
    LNewHref.innerHTML = '<b>+</b>';
    
    LLink.parentNode.appendChild(LNewHref);
  }      
}

function SaveSettings()
{
  GM_setValue('timeout', document.forms.create.timeout.options[document.forms.create.timeout.selectedIndex].value);
  GM_setValue('ktype', document.forms.create.ktype.options[document.forms.create.ktype.selectedIndex].value);
  GM_setValue('gold', document.forms.create.gold.options[document.forms.create.gold.selectedIndex].value);
}

function InitOneInput(AInput, AName)
{
  var LValue = GM_getValue(AName, '');
  for(i = 0; i < AInput.options.length; i++)
  {                    
    var LOption = AInput.options[i];
    if (LOption.value == LValue)
      AInput.selectedIndex = LOption.index;
  }                    
  
  addEvent(AInput, 'change', SaveSettings);
}

function InitInputs()
{
  InitOneInput(document.forms.create.timeout, 'timeout');
  InitOneInput(document.forms.create.ktype, 'ktype');
  InitOneInput(document.forms.create.gold, 'gold');
}


if (URLAttrValueGet('form', location.href) == '1') 
  InitInputs();
AddNewGameLink();
    