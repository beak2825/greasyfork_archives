//
// ==UserScript==
// @name           hwm_exp_ability
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Высчитывание экспоумки для взятия ап умки на своем уровне
// @homepage       https://greasyfork.org/uk/scripts/13724-hwm-exp-ability
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.16
// @encoding 	   utf-8
// @include        http://*.heroeswm.ru/home.php*
// @include        http://*heroeswm.ru/transfer.php*
// @include        http://*lordswm.com/home.php*
// @include        http://*lordswm.com/transfer.php*
// @include        http://178.248.235.15/home.php*
// @include        http://178.248.235.15/transfer.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13724/hwm_exp_ability.user.js
// @updateURL https://update.greasyfork.org/scripts/13724/hwm_exp_ability.meta.js
// ==/UserScript==

var version = '1.16';
var idn = 'exp_ability';
var str_url = 'https://greasyfork.org/uk/scripts/13724-hwm-exp-ability';
var str_script_name = 'Експоумка';
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
  }
  bg.style.display = bgc.style.display = 'block' ;  

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
    '        <td>' + ASettingsHTML + '</td>' +
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

//-----------------------------------

var expelem;

function GetExp()
{
  res = -1;

  var list = document.getElementsByTagName("b");
  for(var i = 0; i < list.length; i++)
  {
    var elem = list[i];
    
    if (elem.innerHTML.indexOf('\u0411\u043E\u0435\u0432\u043E\u0439\u0020\u0443\u0440\u043E\u0432\u0435\u043D\u044C') === 0)
    {
      var subindex = Array.prototype.indexOf.call(elem.parentNode.childNodes, elem);
      expelem = elem.parentNode.childNodes[subindex + 2];
      res = parseInt(expelem.innerHTML.replace(/,/g, ''));  
      break;
    }
  }
  
  return res; 
}

function GetCurrentFractAbility(AElem)
{
  var sublist = AElem.getElementsByTagName("b");
  if (sublist.length > 0)
  {
    var subitem = sublist[0];
    var subindex = Array.prototype.indexOf.call(subitem.parentNode.childNodes, subitem);
    var regex = /\((\d+.\d+)\)/;  
    var regex_res = regex.exec(subitem.parentNode.childNodes[subindex + 1].textContent);
    if (regex_res)
    {
      var LAbility = parseFloat(regex_res[1]);
      var LAbilityToUp = parseFloat(subitem.parentNode.childNodes[subindex + 2].innerHTML);
      var LArray = subitem.parentNode.childNodes[subindex].innerHTML.split(': ');
      var LFration = LArray[0];
      var LAbilityLevel = parseInt(LArray[1]);
      return {Ability: LAbility, AbilityToUp: LAbilityToUp, Fraction: LFration,
        AbilityLevel: LAbilityLevel, IsCurrent: true, IsMain: false};
    }
  }
}

function GetAllFractions()
{
  var LTD = GetTD();
  var LResult = new Array(GetCurrentFractAbility(LTD));
  var LMaxAbl = LResult[0];
  for(i = 0; i < LTD.childNodes.length; i++)
  {
    var cur_el = LTD.childNodes[i];           
    var html = Trim(cur_el.textContent);
    var regex = /\: \d+ \((\d+.\d+)\)/;
    var regex_res = regex.exec(html);
    if(regex_res)
    {
      cur_abil = parseFloat(regex_res[1]);
      if (html.indexOf('\u0413\u0438\u043B\u044C\u0434\u0438\u044F') === -1)
      {
        var next_el = cur_el.parentNode.childNodes[i + 1];
        if (next_el.tagName == 'FONT')
        {
          var LAbility = cur_abil;
          var LAbilityToUp = parseFloat(next_el.innerHTML);
          var LArray = Trim(next_el.previousSibling.textContent).split(': ');
          var LFration = LArray[0];
          var LAbilityLevel = parseInt(LArray[1].split(' (')[0]);
          var LNew = {Ability: LAbility, AbilityToUp: LAbilityToUp, Fraction: LFration,
            AbilityLevel: LAbilityLevel, IsCurrent: false, IsMain: false};
          LResult.push(LNew);
          if (LMaxAbl.Ability < LNew.Ability)
            LMaxAbl = LNew;
        }           
      }
    }
  }
  
  LMaxAbl.IsMain = true; 

  return LResult;       
}

function GetTD()
{
  var list = document.getElementsByTagName("td");
  for(var i = 0; i < list.length; i++)
  {
    var elem = list[i];
//    alert(elem.innerHTML);
    if(  (Trim(elem.innerHTML).indexOf('\u0420\u044B\u0446\u0430\u0440\u044C\u003A') === 0)
      || (Trim(elem.innerHTML).indexOf('<b>\u0420\u044B\u0446\u0430\u0440\u044C\u003A') === 0)  
    )
    {
      return elem;
    }
  } 
}

function GetAbilityToUpInfo()
{
  var racial_skill_lvl = [20,50,90,160,280,500,900,1600,2900,5300,9600,17300];
  var LFract = GetFraction(GM_getValue('selected_fract', ''), GetAllFractions());
  var LLevel = Math.max(parseInt(GM_getValue('selected_level', 0)), (LFract.AbilityLevel + 1));
  var LResult = {Fraction: LFract.Fraction, Level: LLevel, AbilityToUp: -1, IsMax: false};
  LResult.IsMax = (LFract.AbilityLevel == racial_skill_lvl.length);
  if (!LResult.IsMax)
    LResult.AbilityToUp = racial_skill_lvl[LLevel - 1] - LFract.Ability;
  return LResult;
}

function abil_fractions_changed()
{
  GM_setValue('selected_fract', $("#hwm_exp_abil_fractions").value);
  GM_deleteValue('selected_level');
  UpdateAbilLevels();
}

function GetFraction(AName, AAllFractions)
{
  for(i = 0; i < AAllFractions.length; i++)
  {
    var LFract = AAllFractions[i];
    if ((AName == '') && LFract.IsMain || (AName != '') && (LFract.Fraction == AName))
      return LFract;
  }
  return AAllFractions[0];
}

function UpdateAbilLevels()
{
  var LSelect = $("#hwm_exp_abil_levels");
  LSelect.innerHTML = '';

  var LFract = GetFraction($("#hwm_exp_abil_fractions").value, GetAllFractions());
  var LSelectedLevel = parseInt(GM_getValue('selected_level', 0));
  for(i = LFract.AbilityLevel + 1; i <= 12; i++)
  {                                    
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i == LSelectedLevel)
      option.selected = '1';
    LSelect.add(option);      
  }
}

function abil_levels_changed()
{
  GM_setValue('selected_level', $("#hwm_exp_abil_levels").value);
}

function open_setting_form()
{
  show_settings_base(
    '<div><b>Выберите фракцию и уровень умелки который хотите взять на этом уровне:</b></div>' +
    '<div><select style="width:220;" id="hwm_exp_abil_fractions"></select> Фракция</div>' +
    '<div><select style="width:220;" id="hwm_exp_abil_levels"></select> Уровень умелки</div>'
  );
  
  addEvent($('#bgOverlay' + idn), 'click', MainProcess);    
  addEvent($('#bt_close' + idn), 'click', MainProcess);

  var LFractSelect = $("#hwm_exp_abil_fractions");
  addEvent(LFractSelect, 'change', abil_fractions_changed);
  var LAllFractions = GetAllFractions();
  var LSelectedFract = GM_getValue('selected_fract', '');
  for(i = 0; i < LAllFractions.length; i++)
  {
    var LFract = LAllFractions[i];
    var option = document.createElement("option");
    option.value = LFract.Fraction;
    option.text = LFract.Fraction + (LFract.IsMain ? ' (Основа)' : '') +
      (!LFract.IsMain && LFract.IsCurrent ? ' (Играете сейчас)' : '');
    if ((LSelectedFract == '') && LFract.IsMain
      || (LSelectedFract != '') && (LFract.Fraction == LSelectedFract)
    )
    {
      option.selected = '1';
    }
    LFractSelect.add(option);      
  }

  var LLevelSelect = $("#hwm_exp_abil_levels");
  addEvent(LLevelSelect, 'change', abil_levels_changed);
  UpdateAbilLevels();
}

function MainProcess()
{
  var LExp = GetExp();
  if (expelem)
  {
    if (!$("#hwm_exp_abil_options"))
    {
      expelem.innerHTML = expelem.innerHTML + ' ' +
        '<a style="text-decoration:none;cursor:pointer;font-weight:bold;font-size:8px;" id="hwm_exp_abil_options">(' +
          '<font color="red">' +
            '<span id="hwm_exp_abil_el" />' + 
          '</font>)' +
        '</a>';
    }
    $("#hwm_exp_abil_options").addEventListener( "click", open_setting_form , false );
    var LEl = $("#hwm_exp_abil_el");
    
    var LAbilityToUpInfo = GetAbilityToUpInfo();
    if (LAbilityToUpInfo.IsMax)
    {
      LEl.innerHTML = 'max';
      LEl.title =
        'Вы апнули максимальную умелку фракции ' + LAbilityToUpInfo.Fraction + '\n'+
        'Смените фракцию и уровень умелки который хотите взять на этом уровне';
    }
    else
    {
      var expoability = FloatFormat(LExp / LAbilityToUpInfo.AbilityToUp);
      LEl.innerHTML = expoability;
      LEl.title =
        'Что б взять ' + LAbilityToUpInfo.Level + 'ю умелку фракции ' + LAbilityToUpInfo.Fraction + ' до апа уровня\n'+
        'Вам нужно набрать ' + LAbilityToUpInfo.AbilityToUp + ' умения с соотношением ' + expoability;
    }    
  }
}

addEvent(window, 'load', MainProcess);