//
// ==UserScript==
// @name           hwm_inventory_new_lot
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Выставление лота из инвентаря, сохранение цены для предмета
// @homepage       https://greasyfork.org/uk/scripts/13223-hwm-inventory-new-lot
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.73
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/inventory.php*
// @include        http://*heroeswm.ru/auction_new_lot.php*                
// @include        http://*heroeswm.ru/transfer.php*
// @include        http://*lordswm.com/inventory.php*
// @include        http://*lordswm.com/auction_new_lot.php*                
// @include        http://*lordswm.ru/transfer.php*
// @include        http://178.248.235.15/inventory.php*
// @include        http://178.248.235.15/auction_new_lot.php*                
// @include        http://178.248.235.15/transfer.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13223/hwm_inventory_new_lot.user.js
// @updateURL https://update.greasyfork.org/scripts/13223/hwm_inventory_new_lot.meta.js
// ==/UserScript==

// settings
LNewLotDurationDef = '3';
// settings end

var version = '1.73';
var idn = 'inventory_new_lot';
var str_url = 'https://greasyfork.org/uk/scripts/13223-hwm-inventory-new-lot';
var str_script_name = 'Новый лот из инвентаря';
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

GM_addStyle('.dialog {background-color: #F6F3EA; border-radius: 5px; box-sizing: border-box; box-shadow: 0 0 0px 12px rgba(200, 200, 200, 0.5); left: calc(50% - 300px); max-height: calc(100% - 100px); overflow: auto; padding: 15px; position: fixed; top: 50px; z-index: 1105;}');
GM_addStyle('.dialogOverlay {background-color: rgba(0, 0, 0, 0.7); height: 100%; left: 0; position: fixed; top: 0; width: 100%;}');
GM_addStyle('.btn_close {position:absolute;left:calc(100% - 45px);float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;}');
GM_addStyle('.btn_settings {text-decoration:underline;cursor:pointer;font-weight:bold;font-size:10px;width:500px;}');
GM_addStyle('.small_text {font-weight:bold;font-size:10px;}');

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

function Assert(ACondition, AMessage)
{
  if (ACondition)
    return;
  localStorage['trade.status'] = 'Stoped';
  alert('ERROR: ' + AMessage);
  throw new Error(AMessage);
}

function FloatFormat(AFloat)
{
  return Math.round(AFloat).toString();
}

function IntFormatWithThouthandSeparator(num){
    var n = num.toString(), p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
        return p<0 || i<p ? ($0+',') : $0;
    });
}

// ------------------ dialog

function close_setting_form() {
    bg = $('#bgOverlay' + idn) ;
    bgc = $('#bgCenter' + idn) ;
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
    if( GM_getValue( ch ) && GM_getValue( ch ) == 1 )
        GM_setValue( ch , 0 );
    else
        GM_setValue( ch , 1 );
}

function setEdit(id, key)
{
  var LValue = parseInt($('#' + id).value);
  GM_setValue(key, LValue);
}

function show_dialog_base(ASettingsHTML)
{
  bg = $('#bgOverlay' + idn) ;
  bgc = $('#bgCenter' + idn) ;
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
      '        <td><b>'+str_script_name+' <font style="color:#0070FF;">'+version+'</font></b></td>' +
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
      '          Автор: <a class="small_text" href="http://www.heroeswm.ru/pl_info.php?id=30547">Pahan.</a>' +
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

// -----------------------------------------------
var GlobalCultureName = location.href.match('lordswm') ? "en-US" : "ru-RU",
    GlobalStrings = {
        "ru-RU" : {
            Sell : "Пр-ь:",
            _30m : "30м",
            _1h : "1ч",
            _3h : "3ч",
            _6h : "6ч",
            _12h : "12ч",
            _1d : "1д",
            _2d : "2д",
            _3d : "3д",
        },
        "en-US" : {
            Sell : "Sell:",
            _30m : "30m",
            _1h : "1h",
            _3h : "3h",
            _6h : "6h",
            _12h : "12h",
            _1d : "1d",
            _2d : "2d",
            _3d : "3d",
        }
    },
    GlobalLocalizedString = GlobalStrings[GlobalCultureName];
// -----------------------------------------------


  
function GetProchkaInfo(ALink)
{
  var LElem = ALink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  var regex = /\:\s+(\d+\/\d+)\<br\>/;
  var regex_res = regex.exec(LElem.innerHTML);
  if(regex_res)
    return regex_res[1];
  else
    return '';
}

function CheckCanSell(ALink)
{
  var LElem = ALink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode; 
  var LLinks = LElem.querySelectorAll('a[href*="art_transfer.php"]');
  return (LLinks && (LLinks.length == 1));
}
  
function AddNewLotHref(ALink, AURL, ADurationDisp, ADuration)
{    
  ALink.parentNode.appendChild(document.createTextNode(' '));  	  
  LNewLotHref = document.createElement('a');
  LNewLotHref.href = AURL + '&d=' + ADuration;
  LNewLotHref.innerHTML = ADurationDisp;
  ALink.parentNode.appendChild(LNewLotHref);
}
  
function SetTimer_ProcessMain()
{
  setTimeout(AddNewLotHrefs, 10);
}

function AddNewLotHrefs()
{              
  var LLinks = document.querySelectorAll('a[href^="art_info.php"]');
  var LLink; 
  if (LLinks)
  {                
    for(i = 0; i < LLinks.length; i++)
    {                   
      LLink = LLinks[i];
      
      if (CheckCanSell(LLink))
      {
        var LName = LLink.children[0].innerHTML + ' ' + GetProchkaInfo(LLink);
        var LURL = '/auction_new_lot.php?art=' + encodeURIComponent(LName);
        
        var LLinksTest = LLink.parentNode.querySelectorAll('a[href^="' + LURL + '"]');
        if (LLinksTest && (LLinksTest.length > 0))
          continue;

                
        LLink.parentNode.appendChild(document.createElement('br'));
//        LLink.parentNode.appendChild(document.createTextNode('»»'));
        LLink.parentNode.appendChild(document.createTextNode(GlobalLocalizedString.Sell));

//        LNewLotHref = document.createElement('a');
//        LNewLotHref.href = LURL;
//        LNewLotHref.innerHTML = GlobalLocalizedString.Sell;
//        LLink.parentNode.appendChild(LNewLotHref);
        
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._30m, '30m');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._1h, '1h');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._3h, '3h');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._6h, '6h');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._12h, '12h');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._1d, '1d');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._2d, '2d');
        AddNewLotHref(LLink, LURL, GlobalLocalizedString._3d, '3d');
      }                                   
    }
  }
}

//----------------------------------------

function PriceTrimNewLotForm()
{
  var LPriceEl = document.forms.f.price;
  LPriceEl.value = LPriceEl.value.trim().replace(/[^\d]/g, '');
}

function SavePrice()
{
  var LSelect = document.forms.f.item; 
  var LPrice = parseInt(document.forms.f.price.value);
  var LName = LSelect.options[LSelect.selectedIndex].text.split(' (')[0].split(' [i]')[0];
  if (LName != '')
  {
    LInfo = document.createTextNode('');
  
    LInfo = $('#save_price_info');
    if (!LInfo)
    {
      LInfo = document.createElement('b');
      LInfo.id = 'save_price_info';
      $('#id_save_price').parentNode.appendChild(LInfo);
    }
    if (LPrice && (LPrice != 0) && (LPrice != ''))
    {
      GM_setValue(LName, LPrice);
      LInfo.innerHTML = 'Сохранена цена ' + LPrice + ' для артефакта "' + LName + '"';
    }
    else
    {
      GM_deleteValue(LName);
      LInfo.innerHTML = 'Удалена цена для артефакта "' + LName + '"';
    }
  }  
}

function LoadPrice()
{
  var LSelect = document.forms.f.item; 
  var LPriceEl = document.forms.f.price;
  var LName = LSelect.options[LSelect.selectedIndex].text.split(' (')[0].split(' [i]')[0];
  LPriceEl.value = GM_getValue(LName, '0');
}

function DecrementPrice()
{
  var LPriceEl = document.forms.f.price;
  LPriceEl.value = parseInt(LPriceEl.value) - 1;
}

function IncrementPrice()
{
  var LPriceEl = document.forms.f.price;
  LPriceEl.value = parseInt(LPriceEl.value) + 1;
}

function open_setting_form()
{
  show_settings_base('<input type="checkbox" id="id_one_click" title=""> Выставлять лот в один клик');
    
  var check_one_click = $('#id_one_click');
  check_one_click.checked = GM_getValue('one_click', 0) == 1 ? 'checked' : '';
  addEvent(check_one_click, "click", function(){setCheck('one_click');});
  
}

function InitNewLotForm()
{
  if (document.forms.f.sign)
  {
    if (GM_getValue('one_click', 0) == 1)
      document.forms.f.submit();
  }
  else
  {
  
    var LSelect = document.forms.f.item; 
    addEvent(LSelect, 'change', LoadPrice);
    var LArt = decodeURIComponent(URLAttrValueGet('art', location.href));
    var LArtTrim = DeleteCRLF(LArt);
    var LArtFull = '';
    if (LArt != '')
    {
      for(i = 0; i < LSelect.options.length; i++)
      {                    
        var LOption = LSelect.options[i];
        if ((LOption.text.indexOf(LArt) == 0) || (LOption.text.indexOf(LArtTrim) == 0))
        {
          LArtFull = LOption.text;
          LSelect.selectedIndex = LOption.index;
        }
      }                    
    }
    
    var LCountEl = document.forms.f.count;
    var LCount = 1;
    if (LArtFull != '')
    {
      var regex = /\((\d+)\)/;
      var regex_res = regex.exec(LArtFull);
      if (regex_res)
        LCount = Math.min(parseInt(regex_res[1]), 3);
    }
    LCountEl.value = LCount;
    
    var LPriceEl = document.forms.f.price;    
    addEvent(LPriceEl, "change", PriceTrimNewLotForm);
    addEvent(LPriceEl, "keyup", PriceTrimNewLotForm);
    addEvent(LPriceEl, "paste", PriceTrimNewLotForm);
    LoadPrice();

    LNewDiv = document.createElement('b');
    LNewDiv.innerHTML = '<input type="button" style="width:80;" id="id_save_price" value="Сохранить">';
    LPriceEl.parentNode.insertBefore(LNewDiv, LPriceEl.nextSibling);  
    addEvent($('#id_save_price'), "click", SavePrice);

    LNewDiv = document.createElement('b');
    LNewDiv.innerHTML =
      '<input type="button" style="width:25;height:25;font-size=10px;padding:0;margin:0;" id="id_decrement_price" value="-">' +
      '<input type="button" style="width:25;height:25;font-size=10px;padding:0;margin:0;" id="id_increment_price" value="+">';
    LPriceEl.parentNode.insertBefore(LNewDiv, LPriceEl.nextSibling);  
    addEvent($('#id_decrement_price'), "click", DecrementPrice);
    addEvent($('#id_increment_price'), "click", IncrementPrice);
    
      
    var LDurationEl = document.forms.f.duration;
    var LDuration = LNewLotDurationDef;
    var LDurationParam = URLAttrValueGet('d', location.href);
    if (LDurationParam == '30m')
      LDuration = 1;
    else
    if (LDurationParam == '1h')
      LDuration = 2;
    else
    if (LDurationParam == '3h')
      LDuration = 3;
    else
    if (LDurationParam == '6h')
      LDuration = 4;
    else
    if (LDurationParam == '12h')
      LDuration = 5;
    else
    if (LDurationParam == '1d')
      LDuration = 6;
    else
    if (LDurationParam == '2d')
      LDuration = 7;
    else
    if (LDurationParam == '3d')
      LDuration = 8;
    
    for(i = 0; i < LDurationEl.options.length; i++)
    {                    
      var LOption = LDurationEl.options[i];
      if (LOption.value == LDuration)
      {
        LDurationEl.selectedIndex = LOption.index;
      }
    }
    
    var LSubmits = document.querySelectorAll('input[type="submit"]');
    if (LSubmits && LSubmits.length > 0)
    {
      var LSubmit = LSubmits[0];
      LDiv = document.createElement('div');
      LDiv.innerHTML = '<div class="btn_settings" id="hwm_options'+idn+'">Настройки</div>';
      LSubmit.parentNode.insertBefore(LDiv, LSubmit.nextSibling);
      addEvent($('#hwm_options'+idn), 'click', open_setting_form);
    } 
  
  }
}

//----------------------------------------------------

function ProcessMain()
{
  if (location.href.indexOf('/inventory.php') > -1)
  {                  
    AddNewLotHrefs();
      
    if(!$("#click_div"))
    {
      var add_click_div = document.createElement('div');
      add_click_div.id = "click_div";
      add_click_div.style.display = "none";
      document.querySelector("body").appendChild(add_click_div);
    }
    addEvent($("#click_div"), "click", SetTimer_ProcessMain);    
  }
  else
  if (location.href.indexOf('/auction_new_lot.php') > -1)
  {                  
    InitNewLotForm();       
  }
}

ProcessMain();