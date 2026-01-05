// ==UserScript==
// @name        GN_ShowLastHunt
// @namespace   Gradient
// @description Показ последней охоты на таких существ
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/map.php.*/
// @version     1.0.5
// @downloadURL https://update.greasyfork.org/scripts/16226/GN_ShowLastHunt.user.js
// @updateURL https://update.greasyfork.org/scripts/16226/GN_ShowLastHunt.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_ShowLastHunt'; // Enter your script name here

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

this.current_id = function(){
  return current_id;
};

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
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var current_user_id = SU.current_id();
var completed_hunts = JSON.parse(SU.load_value('GN_ShowLastHunt_Hunts' + current_user_id, '[]'));

// thanx to curves handle of admin
for(var i = 0; i < completed_hunts.length; ++i){
  var c_hunt = completed_hunts[i];

  if(/\D+\s\D+/.test(c_hunt.str))
    completed_hunts.push({str: c_hunt.str.replace(' ', '-'), count: c_hunt.count, battle: c_hunt.battle });
}

var hunts = document.querySelectorAll('div[id*="neut_show"] div[id*="neut_right_block"] a[href*="army_info.php?name="]');

for(var i = 0; i < hunts.length; ++i){
  var hunt = hunts[i].textContent;

  for(var j = 0; j < completed_hunts.length; ++j){
    var c_hunt = completed_hunts[j];

    if(c_hunt.str == hunt && !hunts[i].parentNode.querySelector('a[sign="true"]')){
      var a = document.createElement('a');
      a.setAttribute('sign', 'true');
      a.href = '/war.php?warid=' + c_hunt.battle;
      a.textContent = ' (пред. бой, кол-во: ' + c_hunt.count + ')';
      hunts[i].parentNode.appendChild(document.createElement('br'));
      hunts[i].parentNode.appendChild(a);
    }
  }
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//