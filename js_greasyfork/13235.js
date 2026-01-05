// ==UserScript==
// @name           HWM_HuntingExpirience
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Показывает опыт для охоты, автопропуск, настройки для перекачей
// @homepage       https://greasyfork.org/uk/scripts/13235-hwm-huntingexpirience
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.52
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/home.php*
// @include        http://*heroeswm.ru/map.php*
// @include        http://*heroeswm.ru/transfer.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13235/HWM_HuntingExpirience.user.js
// @updateURL https://update.greasyfork.org/scripts/13235/HWM_HuntingExpirience.meta.js
// ==/UserScript==

var version = '1.52';
var str_url = 'https://greasyfork.org/uk/scripts/13235-hwm-huntingexpirience';
var str_script_name = 'Опыт и умка ГО';
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

//-----------------------------------

// -----------------------------------------------
var GlobalCultureName = location.href.match('lordswm') ? "en-US" : "ru-RU",
    GlobalStrings = {
        "ru-RU" : {
//            Sell : "Пр-ь:",
        },
        "en-US" : {
//            Sell : "Sell:",
        }
    },
    GlobalLocalizedString = GlobalStrings[GlobalCultureName];
// -----------------------------------------------

var
  LMinExp = 999999;
  
function ExperienceProcess(AValue, ALink, AIndex)
{
  if (LMinExp > AValue)
    LMinExp = AValue;
  var LID = 'hunt_exp_' + AIndex;
  var LEl = $('#' + LID);
  if (!LEl)
  {
    var Lumka = 1 * GetPerekachInfo().umka_koef;
    var LExp = Math.ceil(AValue);
    var LExpUmka = (AValue / Lumka).toFixed(0);
    var LInfo = 'Опыт: '+LExp+'&nbsp;&nbsp;&nbsp;Умка: '+Lumka+'&nbsp;&nbsp;&nbsp;Експоумка: '+LExpUmka;
    ALink.parentNode.innerHTML += '<br><span style="color:red" id="'+LID+'">'+LInfo+'</span>';
  }  
}

function ExperienceCalculate(AMobExp, ACount, ALevel)
{
  var LExp = parseInt(AMobExp * ACount / 5);
  var LExpCoef = GetPerekachInfo().exp_koef;
  if (ALevel >=3)
    LExp = Math.max(LExp, ALevel * 70) * LExpCoef;
  return LExp;
}

var
  LExpAllFound = true;

function Run(ALevel, ALink, AIndex)
{
  var
    LMonster = ALink.href.split('=')[1],
    LArr = ALink.parentNode.innerHTML.split('('),
    LMonsterCount = -1,
    LExperience;

  if (LArr.length < 2)
    return;
  
  LMonsterCount = parseInt(LArr[1]);
  var LExperience = GM_getValue(LMonster, '');
  if (LExperience == '')
  {
    LExpAllFound = false;
    Ajax('GET', ALink.href, null,
      function(AHTML)
      {
        var
          LIndex = 0,
          LPage = document.body.appendChild(document.createElement('div')),
          LParams = '';
        LPage.style.position = 'absolute';
        LPage.style.width = '0px';
        LPage.style.height = '0px';
        LPage.style.overflow = 'hidden';
        LPage.innerHTML = AHTML;
  
        LParams = LPage.querySelector('param[value*="M001"]').getAttribute('value').split('|')[1];
        LIndex = LParams.length - 1;
        while (isNaN(parseInt(LParams[LIndex])))
          LIndex--;
        LExperience = Number(LParams.substring(LIndex - 4, LIndex));
        GM_setValue(LMonster, LExperience);      
        LParams = ExperienceCalculate(LExperience, LMonsterCount, ALevel);
        ExperienceProcess(LParams, ALink, AIndex);
      }
    );
  }
  else
  {
    var
      LParams = ExperienceCalculate(LExperience, LMonsterCount, ALevel);
    ExperienceProcess(LParams, ALink, AIndex);
  }
}

function links_process(ALinks)
{
  for(var i = 0; i < ALinks.length; i++)
  {
    var LLink = ALinks[i];
    Run(parseInt(GM_getValue('level', '0')), LLink, i);
  }
}                      
           
function setCheck(ch) {
    if( GM_getValue( ch ) && GM_getValue( ch ) == 1 )
        GM_setValue( ch , 0 );
    else
        GM_setValue( ch , 1 );
}
    
function close_setting_form() {
    bg = $('#bgOverlay1') ;
    bgc = $('#bgCenter1') ;
    if( bg ) {
        bg.style.display = bgc.style.display = 'none' ;
    }
}

function save_skip_exp()
{
  var LSkiptExp = parseInt($('#id_skip_exp').value);
  GM_setValue('skip_exp', LSkiptExp);
}     
  
function GetPerekachInfo()
{  
  var sred_umk = [
    63.5,109,161,235,386,619,946,1422,1982,2724,3815,
    5518,8169,12055,17112,28205,37497,54278,68909
  ];
    
  var exp_attuale = parseInt(GM_getValue('umka_sum', '0'));
  var sum_umk = exp_attuale;
  var LLevel = parseInt(GM_getValue('level', '0'));
  if (LLevel > 2)  
    var srednya_umka = sred_umk[LLevel - 3];
  else
    var srednya_umka = sum_umk;
  var umk_min = srednya_umka/1.6;
  var umk_max = srednya_umka*1.6;
  exp_attuale = exp_attuale - umk_min;
  umk_max = umk_max - umk_min;
  var perc = exp_attuale * 100 / umk_max;
  var progress_bar_html = '';
  var exp_koef = 1;
  var umka_koef = 1 + (Boolean(GM_getValue('blago', false)) ? 0.1 : 0);
  if (perc<100 && perc>0) {
	progress_bar_html = "Вы в норме!";
  }          
  if (perc>100){
    var temp = Math.round(((sum_umk/srednya_umka/1.6)-1)*1000)/10;
    exp_koef += temp / 100;
    progress_bar_html = "Вы перекач! Дополнительно опыта: +" + temp + "%";
  }
  if (perc<0) {
    var temp = Math.round(((srednya_umka/sum_umk)-1)*1000)/10;
    umka_koef += temp / 100;
    progress_bar_html = "Вы недокач! Дополнительно умений: +" + temp + "%";
  }
  
  return {html: progress_bar_html, exp_koef: exp_koef, umka_koef: umka_koef}; 
}  
             
function open_setting_form()
{
  bg = $('#bgOverlay1') ;
  bgc = $('#bgCenter1') ;
  if( !bg ) {
      bg = document.createElement('div') ;
      bg.id = 'bgOverlay1' ;
      document.body.appendChild( bg );
      bg.style.position = 'absolute' ;
      bg.style.left = '0';
      bg.style.width = '100%';
      bg.style.height = '100%';
      bg.style.background = "#000000";
      bg.style.opacity = "0.5";
      bg.addEventListener( "click", close_setting_form , false );

      bgc = document.createElement('div') ;
      bgc.id = 'bgCenter1' ;
      document.body.appendChild( bgc );
      bgc.style.position = 'absolute' ;
      bgc.style.width = '600px';
      bgc.style.background = "#F6F3EA";
      bgc.style.left = ( ( document.body.offsetWidth - 400 ) / 2 ) + 'px' ;
      bgc.style.zIndex = "1105";
  }
  
  var LPerekackInfo = GetPerekachInfo();
  
  bgc.innerHTML = 
    '<div style="border:1px solid #abc;padding:5px;margin:2px;">' +
    '  <div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close1" title="Закрыть">x</div>' +
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
    '        <td><b>' + LPerekackInfo.html + '</b></td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <div>Коэффициент опыта: <b>' + LPerekackInfo.exp_koef + '</b></div>' +
    '          <div>Коэффициент умки: <b>' + LPerekackInfo.umka_koef + '</b></div>' +
    '        </td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td><b>Автоматический пропуск охоты:</b></td>' +
    '      </tr>' +
    '      <tr>' +
    '        <td>' +
    '          <div><input type="text" style="width:80;" id="id_skip_exp"> Опыт для автоматического пропуска </div>' +
    '          <div>Значение "0" - не пропускать охоты автоматически</div>' +
    '        </td>' +
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
    
  $("#bt_close1").addEventListener( "click", close_setting_form , false );    
  
  var Lskip_exp = $("#id_skip_exp");
  Lskip_exp.value = parseInt(GM_getValue('skip_exp', '0'));
  Lskip_exp.addEventListener( "change", save_skip_exp , false );
  Lskip_exp.addEventListener( "keyup", save_skip_exp , false );
  Lskip_exp.addEventListener( "paste", save_skip_exp , false );
                                                      
  bg.style.top = (-document.body.scrollTop)+'px';
  bgc.style.top = ( document.body.scrollTop + 100 ) + 'px';
  bg.style.display = bgc.style.display = 'block' ;    
}

function add_settings()
{
  var LDiv = $("#hwm_hant_options");
  if (LDiv)
    return;
  var LLinks = document.querySelectorAll('a[href^="ecostat.php"]');
  if (LLinks && (LLinks.length > 0))
  {
    var LLink = LLinks[0];
    LDiv = document.createElement('div');
    LDiv.innerHTML = '<div style="text-decoration:underline;cursor:pointer;font-weight:bold;font-size:10px;" id="hwm_hant_options">Настройки калькулятора опыта охоты';
    LLink.parentNode.appendChild(LDiv);
    $("#hwm_hant_options").addEventListener( "click", open_setting_form , false );
  }
}

function RemoveElement(El)
{
  El.parentNode.removeChild(El);
}

function skip_hant()
{     
  var LLinks = document.querySelectorAll('span[id*="hunt_exp_"]');
  if (LLinks)
  {
    for (var i = 0; i < LLinks.length; i++)
    {
      var LParent = LLinks[i].parentNode.parentNode.parentNode.parentNode;
      RemoveElement(LParent.nextSibling);
      RemoveElement(LParent);
    }
  }     
  Ajax('GET', '/map.php?action=skip', null, function(AHTML){});
}

function calc_hant()
{
  LExpAllFound = true;

  var LLinks = document.querySelectorAll('a[href^="army_info.php"]');
  var LLink; 
  if (LLinks)
    links_process(LLinks);  
  add_settings();  

  if(LExpAllFound)
  {
    var LSkipExp = parseInt(GM_getValue('skip_exp', '0'));
    if ((LMinExp != 999999) && (LSkipExp > 0) && (LMinExp > LSkipExp))
    {
      skip_hant();
    }
  }
  else
    setTimeout(calc_hant, 1000);
}

function save_level()
{
  var list = document.getElementsByTagName("b");
  for(var i = 0; i < list.length; i++)
  {
    var elem = list[i];
    
    if (elem.innerHTML.indexOf('\u0411\u043E\u0435\u0432\u043E\u0439\u0020\u0443\u0440\u043E\u0432\u0435\u043D\u044C') === 0)
    {
      var regex = /(\d+)/;
      var regex_res = regex.exec(elem.innerHTML);
      if (regex_res)
      {
        var LLevel = parseInt(regex_res[1]);
        if (LLevel)
          GM_setValue('level', LLevel);
      }
      return;
    }
  }  
}

function GetSumAbility(AElem)
{
  var LUmka = 0;
        
  sublist = AElem.getElementsByTagName("b");
  if (sublist.length > 0)
  {
    var subitem = sublist[0];
    var subindex = Array.prototype.indexOf.call(subitem.parentNode.childNodes, subitem);
    var regex = /\((\d+.\d+)\)/;  
    var regex_res = regex.exec(subitem.parentNode.childNodes[subindex + 1].textContent);
    if (regex_res)
    {            
      LUmka += parseFloat(regex_res[1]);
    }
  } 
  
  for(i = 0; i < AElem.childNodes.length; i++)
  {
    var cur_el = AElem.childNodes[i];           
    var html = Trim(cur_el.textContent);
    var regex = /\: \d+ \((\d+.\d+)\)/;
    var regex_res = regex.exec(html);
    if(regex_res)
    {
      cur_abil = parseFloat(regex_res[1]);
      if ((html.indexOf('\u0413\u0438\u043B\u044C\u0434\u0438\u044F') === -1))
      {
        var next_el = cur_el.parentNode.childNodes[i + 1];
        if (next_el.tagName == 'FONT')
        {
          LUmka += cur_abil;
        }           
      }
    }
  }       
  
  return LUmka;
}

function save_umka_sum()
{
  var list = document.getElementsByTagName("td");
  for(var i = 0; i < list.length; i++)
  {
    var elem = list[i];
    if(  (Trim(elem.innerHTML).indexOf('\u0420\u044B\u0446\u0430\u0440\u044C\u003A') === 0)
      || (Trim(elem.innerHTML).indexOf('<b>\u0420\u044B\u0446\u0430\u0440\u044C\u003A') === 0)  
    )
    {
      GM_setValue('umka_sum', GetSumAbility(elem).toFixed(3));
      return;
    }
  }
}

function save_blago()
{
  var LLinks = document.querySelectorAll('img[src*="star.gif"]');
  var LBlago = (LLinks && (LLinks.length == 1));  
  GM_setValue('blago', LBlago);
}

function check_calc_hant()
{
  if (GM_getValue('level', 'asd') === 'asd')
    setInterval(check_calc_hant, 1000);
  else
    calc_hant();
}

function ProcessMain()
{
  if (location.href.indexOf('/map.php') > -1)
  {                    
    if (GM_getValue('level', 'asd') === 'asd')
    {
      bg = document.createElement('div') ;
      bg.innerHTML = '<iframe width="1" height="1" frameborder="no" name="ItemInfoFrame" src="/home.php" ></iframe>';
      document.body.appendChild( bg );
      setInterval(check_calc_hant, 1000);
    }
    else                 
      calc_hant();
  }
  else
  if (location.href.indexOf('/home.php') > -1)
  {
    save_level();
    save_umka_sum();
    save_blago();
  }
}

ProcessMain();    
