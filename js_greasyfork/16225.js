// ==UserScript==
// @name        GN_ResourcesCost
// @namespace   Gradient
// @description Подсчет стоимости ресурсов в золоте
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/.+/
// @exclude     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @version     1.0.5
// @downloadURL https://update.greasyfork.org/scripts/16225/GN_ResourcesCost.user.js
// @updateURL https://update.greasyfork.org/scripts/16225/GN_ResourcesCost.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_ResourcesCost'; // Enter your script name here

//----------------------------------------------------------------------------//

(function(){ try{ // wrapper start

//----------------------------------------------------------------------------//
// UnifiedLibrary 1.7.0 start
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// SysUtils
//----------------------------------------------------------------------------//

var GN_SysUtils = new SysUtils(script_name);
var SU = GN_SysUtils;

//----------------------------------------------------------------------------//

function SysUtils(name){  // wrapper start

//----------------------------------------------------------------------------//

this.show_error = function(error_string, use_alert){
  if(use_alert)
    alert(error_string);

  throw new Error(error_string);
};

if(arguments.length != 1)
  this.show_error('Wrong SysUtils arguments');

if(!arguments[0])
  this.show_error('Empty SysUtils argument');

//----------------------------------------------------------------------------//

this.load_value = function(value, def){
  var div = document.getElementById('GN_GM_Handler');
  div.setAttribute('desc',      value);
  div.setAttribute('operation', 'load');

  div.click();

  if(div.getAttribute('state') != 'complete')
    this.show_error('Ошибка при загрузке значения');

  return (div.getAttribute('is_null') == 'true' ? def : div.getAttribute('value'));
};

//----------------------------------------------------------------------------//

var current_id = null;

//----------------------------------------------------------------------------//

function check_mandatory_scripts(alerter){
  var persistent_storage_sign = document.getElementById('GN_GM_Handler');
  var common_values_sign      = document.getElementById('GN_CommonValuesSign');
  var alert_sign              = document.getElementById('GN_AlertSign');

  if(!alert_sign){
    alert_sign = document.createElement('div');
    alert_sign.id = 'GN_AlertSign';
    alert_sign.setAttribute('alerted', 'false');
    document.body.appendChild(alert_sign);
  }

  var alerted = alert_sign.getAttribute('alerted') != 'false';

  if(!persistent_storage_sign){
    alert_sign.setAttribute('alerted', 'true');
    alerter('Скрипт ' + name + ' требует для своей работы скрипт управления данными (GN_PersistentStorage), который должен стоять первым в порядке выполнения скриптов.\n'
          + 'Подробнее здесь: "https://greasyfork.org/ru/scripts/14049-Как-устанавливать-скрипты-читать-здесь"', !alerted);
  }

  if(!common_values_sign){
    alert_sign.setAttribute('alerted', 'true');
    alerter('Скрипт ' + name + ' требует для своей работы скрипт, хранящий данные (GN_CommonValuesFiller), который должен стоять вторым в порядке выполнения скриптов.\n'
          + 'Подробнее здесь: "https://greasyfork.org/ru/scripts/14049-Как-устанавливать-скрипты-читать-здесь"', !alerted);
  }
}

this.check_login = function(){
  var re = /.*?pl_id=(\d+)[^\d]*?/gmi;
  var matches = re.exec(document.cookie.toString());

  if(matches){
    current_id = +matches[1];

    check_mandatory_scripts(this.show_error);
  }
};

//----------------------------------------------------------------------------//

this.check_login();

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// CommonValues
//----------------------------------------------------------------------------//

var GN_CommonValues = new CommonValues();

//----------------------------------------------------------------------------//

function CommonValues(){  // wrapper start

//----------------------------------------------------------------------------//
// Basic resources
//----------------------------------------------------------------------------//

this.basic_resources = JSON.parse(SU.load_value('GN_CommonValues_BasicResources', '[]'));

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var CV = GN_CommonValues;

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var market_link = '/auction.php?cat=res&sort=0&type=';

  var gold_tds = document.querySelectorAll('td > img[width="24"][height="24"][src*="gold.png"]');

  var trs = [];
  for(var i = 0; i < gold_tds.length; ++i){
    var count    = gold_tds[i].parentNode.parentNode.childElementCount;
    var td_count = gold_tds[i].parentNode.parentNode.querySelectorAll('tr > td').length;

    if(count > 2 && count % 2 === 0 && count == td_count)
      trs.push(gold_tds[i].parentNode.parentNode);
  }

  trs.forEach(function(current){
    var amount = 0;
    var tds = current.querySelectorAll('tr > td');

    for(var i = 0; i < tds.length; i += 2){
      var res_td   = tds[i];
      var count_td = tds[i + 1];

      var img = res_td.querySelector('img');
      var resource = resource_by_name(img.title);

      if(resource){
        amount += resource.min_price * +count_td.textContent.replace(/,/g, '');

        if(resource.market_type)
          res_td.innerHTML = '<a href="' + market_link + resource.market_type + '">' + res_td.innerHTML + '</a>'; // NB inner
      }
    }

    var td = tds[0];
    td.firstChild.setAttribute('title', 'Сумма ресурсов в золоте: ' + amount);
  });
}

//----------------------------------------------------------------------------//

function resource_by_name(name){
  var resources = CV.basic_resources;

  for(var i = 0; i < resources.length; ++i)
    if(resources[i].name == name)
      return resources[i];

  return null;
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//