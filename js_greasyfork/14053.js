// ==UserScript==
// @name        GN_ElementsCost
// @namespace   Gradient
// @description Подсчет стоимости элементов и вторичных ресурсов
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/pl_info.php\?id=\d+/
// @version     1.1.12
// @downloadURL https://update.greasyfork.org/scripts/14053/GN_ElementsCost.user.js
// @updateURL https://update.greasyfork.org/scripts/14053/GN_ElementsCost.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_ElementsCost'; // Enter your script name here

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
// Elements
//----------------------------------------------------------------------------//

this.elements = JSON.parse(SU.load_value('GN_CommonValues_Elements', '[]'));

//----------------------------------------------------------------------------//
// Advanced resources
//----------------------------------------------------------------------------//

this.advanced_resources = JSON.parse(SU.load_value('GN_CommonValues_AdvancedResources', '[]'));

//----------------------------------------------------------------------------//

this.get_advanced_resource = function(name){
  for(var i = 0; i < this.advanced_resources.length; ++i)
    if(this.advanced_resources[i].name == name)
      return this.advanced_resources[i];

  return null;
};

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var CV = GN_CommonValues;

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var perks = document.querySelector('td.t_noselect[valign="top"]');
  var parent_td = perks.parentNode.firstChild;

  var matches   = [],
      resources = [],
      elements  = [];

  var re = /&nbsp;&nbsp;([^<]+):&nbsp;([0-9,]+)<br>/gmi;
  while(matches = re.exec(parent_td.innerHTML)){
    var advanced_resource = CV.get_advanced_resource(matches[1]);

    if(advanced_resource){
      resources.push( { name: matches[1], count: +matches[2].replace(/,/g, ''), price: advanced_resource.min_price } );
      continue;
    }

    var element = element_by_name(matches[1]);

    if(element)
    {
      elements.push( { name: matches[1], count: +matches[2].replace(/,/g, ''), price: element.average_price } );
      continue;
    }
  }

  if(!resources.length && !elements.length)
    return;

  while(parent_td.firstChild && parent_td.firstChild.tagName != 'SCRIPT')
    parent_td.removeChild(parent_td.firstChild);

  var script = parent_td.firstChild;

  var table = document.createElement('table');
  table.style.width = '100%';
  if(script)
    parent_td.insertBefore(table, script);
  else
    parent_td.appendChild(table);

  if(resources.length){
    draw_info_row(table, 'Вторичные ресурсы:');

    draw_header(table);

    var amount = 0;
    resources.forEach(function(current){
      amount += current.count*current.price;
      draw_row(table, current);
    });

    draw_info_row(table, 'Общая стоимость: ' + amount);
  }

  if(elements.length){
    draw_info_row(table, 'Элементы:');

    draw_header(table);

    var amount = 0;
    elements.forEach(function(current){
      amount += current.count*current.price;
      draw_row(table, current);
    });

    draw_info_row(table, 'Общая стоимость: ' + amount);
  }
}

//----------------------------------------------------------------------------//

function element_by_name(name){
  var elements = CV.elements;

  for(var i = 0; i < elements.length; ++i)
    if(elements[i].name.toUpperCase() == name.toUpperCase())
      return elements[i];

  return null;
}

//----------------------------------------------------------------------------//

function draw_info_row(parent, str){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = create_bold_td(tr, str);
  td.setAttribute('colspan', '3');
  td.setAttribute('align', 'center');
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var tr = document.createElement('tr');
  tr.setAttribute('bgColor', '#DCDCDC');
  parent.appendChild(tr);

  ['Наименование', 'Кол-во', 'Стоимость' ].forEach(function(current){
    var td = document.createElement('td');
    td.textContent = current;
    tr.appendChild(td);
  });
}

//----------------------------------------------------------------------------//

function draw_row(parent, object_){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.textContent = object_.name + ':';
  tr.appendChild(td);

  create_bold_td(tr, object_.count);
  create_bold_td(tr, object_.price ? object_.count*object_.price : '');
}

//----------------------------------------------------------------------------//

function create_bold_td(parent, str){
  var td = document.createElement('td');
  parent.appendChild(td);

  var b = document.createElement('b');
  b.textContent = str;
  td.appendChild(b);

  return td;
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//