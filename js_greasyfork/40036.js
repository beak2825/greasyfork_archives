// ==UserScript==
// @name        GN_ShowRepairTime
// @namespace   Gradient
// @description Показ времени и цены ремонта подвешенных артефактов
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/inventory\.php/
// @version     1.0.7
// @downloadURL https://update.greasyfork.org/scripts/40036/GN_ShowRepairTime.user.js
// @updateURL https://update.greasyfork.org/scripts/40036/GN_ShowRepairTime.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

(function(){ // wrapper start
  
//----------------------------------------------------------------------------//
// UnifiedLibrary 1.7.0 start
//----------------------------------------------------------------------------//

var script_name = 'GN_ShowRepairTime'; // Enter your script name here

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
  
  if(!matches)
    this.show_error('Пользователь не авторизован');
    
  current_id = +matches[1];
  
  check_mandatory_scripts(this.show_error);
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
// Artefacts
//----------------------------------------------------------------------------//

this.artefacts = JSON.parse(SU.load_value('GN_CommonValues_Artefacts', '[]'));

//----------------------------------------------------------------------------//
  
this.get_artefact = function(id){
  for(var i = 0; i < this.artefacts.length; ++i)
    if(this.artefacts[i].id == id)
      return this.artefacts[i];
  
  return null;
};
    
//----------------------------------------------------------------------------//
  
} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//
 
var CV = GN_CommonValues;
var show_error = SU.show_error;
  
var your_cost_percent = [1.01];
start_work();
  
//----------------------------------------------------------------------------//
  
function start_work(){
  var parent = document.querySelector('table.wblight[width="990"] > tbody > tr > td.wb[width="350"] > table > tbody > tr:last-of-type > td > table > tbody');
  
  if(!parent)
    show_error('Не найдена таблица с артефактами для передачи');

  var arts = parent.querySelectorAll('a[href*="art_info.php?id="] > img[width="50"]');
  
  var has_unknown = false;
  
  var sum = 0;
  for(var i = 0; i < arts.length; ++i){
    var has_craft = !arts[i].parentNode.parentNode.nextSibling;
    
    var desc = has_craft ? arts[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.innerHTML.replace('(\r|\n)', '')
                         : arts[i].parentNode.parentNode.parentNode.innerHTML.replace('(\r|\n)', '');

    if(!/Прочноcть: <b>0\/\d+<\/b>/gmi.test(desc))
      continue;
    
    if(!/Ремонт разрешен/.test(desc))
      continue;
    
    var re = /art_info\.php\?id=([^&]*)/;
    var matches = re.exec(arts[i].parentNode.getAttribute('href'));
    
    if(!matches)
      show_error('Ошибка парсинга');
    
    var artefact = CV.get_artefact(matches[1]);
    
    if(!artefact)
      has_unknown = true;
    else
    {
      sum += artefact.repair_cost;
      var chapters = [];
      your_cost_percent.forEach(function(current){
        chapters.push('Цена ремонта при ставке ' + (current*100).toFixed(0) + '% : ' + (artefact.repair_cost*current).toFixed(0));
      });
      arts[i].setAttribute('title', chapters.join('\n'));
    }
  }
  
  if(!sum)
    return;
  
  var tr = document.createElement('tr');
  var title = document.createElement('td');
  title.className = 'wb';
  title.setAttribute('colspan', '2');
  tr.appendChild(title);
  
  var date = new Date();
  
  var content = 'Цена ремонта: ' + (sum*1.01).toFixed(0) + ', Время работы: ' + (sum/4000).toFixed(2) + ' [На ' + date.toLocaleString() + ']';
  if(has_unknown)
    content += ', есть неизвестные артефакты';
  
  title.textContent = content;  
  
  var p_parent = parent.parentNode.parentNode.parentNode.parentNode;
  p_parent.insertBefore(tr, p_parent.lastChild.previousSibling);
}

//----------------------------------------------------------------------------//
  
}());  // wrapper end

//----------------------------------------------------------------------------//