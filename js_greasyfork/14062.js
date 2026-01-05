// ==UserScript==
// @name        GN_SortNanoArtefacts
// @namespace   Gradient
// @description Сортировка наноартефактов существ
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/arts_for_monsters\.php.*/
// @version     1.0.6
// @downloadURL https://update.greasyfork.org/scripts/14062/GN_SortNanoArtefacts.user.js
// @updateURL https://update.greasyfork.org/scripts/14062/GN_SortNanoArtefacts.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_SortNanoArtefacts'; // Enter your script name here

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

this.save_value = function(desc, value){
  var div = document.getElementById('GN_GM_Handler');
  div.setAttribute('desc',      desc);
  div.setAttribute('value',     value);
  div.setAttribute('operation', 'save');

  div.click();

  if(div.getAttribute('state') != 'complete')
    this.show_error('Ошибка при сохранении значения');
};

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

this.show_el = function(el, visible){
  el.style.display = visible ? '' : 'none';
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
// Fractions
//----------------------------------------------------------------------------//

this.fractions = JSON.parse(SU.load_value('GN_CommonValues_Fractions', '[]'));

//----------------------------------------------------------------------------//
// Creatures
//----------------------------------------------------------------------------//

this.creatures = JSON.parse(SU.load_value('GN_CommonValues_Creatures', '[]'));

//----------------------------------------------------------------------------//

this.get_creature = function(id){
  for(var i = 0; i < this.creatures.length; ++i)
    if(this.creatures[i].id == id)
      return this.creatures[i];

  return null;
};

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var show_error = SU.show_error;
var save_value = SU.save_value;
var load_value = SU.load_value;
var show_el    = SU.show_el;

var CV = GN_CommonValues;
var fractions = CV.fractions;

var options = [
  { label: 'Неизвестные:',     id: 'UnknownChb',   title: 'Показывать наноартефакты на неизвестных существ' },
  { label: 'Нейтральные:',     id: 'NeutralChb',   title: 'Показывать наноартефакты на нейтральных существ' },
  { label: 'Неапнутые:',       id: 'NoUpChb',      title: 'Показывать наноартефакты на неапнутых существ' },
  { label: 'Апнутые:',         id: 'UpChb',        title: 'Показывать наноартефакты на апнутых существ' },
  { label: 'На +1:',           id: 'OnePowerChb',  title: 'Показывать наноартефакты +1' },
  { label: 'На +2:',           id: 'TwoPowerChb',  title: 'Показывать наноартефакты +2' },
  { label: 'Скрывать пустые:', id: 'HideEmptyChb', title: 'Скрывать существа, у которых нет наников по фильтру' }
];

var settings  = load_settings();
var artefacts = [];
var fid       = 0;

//----------------------------------------------------------------------------//

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var header_sign = document.querySelector('table[width="98%"][border="0"][align="center"]');

  if(!header_sign)
    show_error('Не найден элемент привязки для таблицы настроек');

  draw_header(header_sign.parentNode);
  get_artefacts();
  fill_fractions();
  accept_filter();
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var table = document.createElement('table');
  table.style.width = '90%';
  table.setAttribute('align', 'center');
  parent.insertBefore(table, parent.firstChild.nextSibling);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var expander = document.createElement('td');
  expander.setAttribute('align', 'center');
  var is_expanded = load_value(script_name + 'SettingsExpand', 'false') == 'true';
  expander.setAttribute('expand', is_expanded ? 'true' : 'false');
  expander.textContent = is_expanded ? 'Скрыть настройки' : 'Показать настройки';
  expander.addEventListener('click', function(e){
    e.preventDefault();

    var expanded = expander.getAttribute('expand') == 'false';
    show_el(settings_table, expanded);

    save_value(script_name + 'SettingsExpand', expanded ? 'true' : 'false');

    expander.setAttribute('expand', expanded ? 'true' : 'false');
    expander.textContent = expanded ? 'Скрыть настройки' : 'Показать настройки';
  });

  tr.appendChild(expander);

  tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  var settings_table = document.createElement('table');
  settings_table.setAttribute('align', 'center');
  td.appendChild(settings_table);

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  table = document.createElement('table');
  td.appendChild(table);

  for(var i = 0; i < options.length; i += 4){
    tr = document.createElement('tr');
    table.appendChild(tr);

    for(var j = i; j < i + 4 && j < options.length; ++j){
      td = document.createElement('td');
      tr.appendChild(td);

      var text = document.createTextNode(options[j].label);
      td.appendChild(text);

      td = document.createElement('td');
      tr.appendChild(td);

      var chb = document.createElement('input');
      chb.type    = 'checkbox';
      chb.title   = options[j].title;
      chb.id      = script_name + options[j].id;
      chb.checked = settings[options[j].id];

      td.appendChild(chb);
    }
  }

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('Выбор класса:'));

  var select = document.createElement('select');
  select.id = script_name + 'FractionsSelect';
  select.style.width = '200px';

  var option = document.createElement('option');
  select.appendChild(option);
  td.appendChild(select);

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  td.setAttribute('align', 'right');
  tr.appendChild(td);

  var saver = document.createElement('input');
  saver.type = 'button';
  saver.value = 'Применить';
  saver.addEventListener('click', function(e){
    e.preventDefault();

    save_settings();
    accept_filter();
  });
  td.appendChild(saver);

  show_el(settings_table, is_expanded);
}

//----------------------------------------------------------------------------//

function get_artefacts(){
  var table = document.querySelector('table.wbwhite[width="90%"][cellpadding="4"][align="center"]');

  var trs = table.firstChild.childNodes;
  for(var i = 0; i < trs.length; ++i){
    var tr = trs[i];
    var a = tr.querySelector('a[href*="army_info.php"]');

    if(a){
      var artefact = {
        id:       '',
        creature: null,
        element:  tr
      };


      artefact.id       = /army_info\.php\?name=(.+)/.exec(a.href)[1];
      artefact.creature = CV.get_creature(artefact.id);
      artefacts.push(artefact);
    }
  }
}

//----------------------------------------------------------------------------//

function fill_fractions(){
  var tmp = artefacts.filter(function(current){
    return current.creature !== null;
  });

  if(tmp.length)
    fid = +tmp[0].creature.f;

  tmp = fractions.filter(function(current){
    return current.id == fid;
  });

  var select = document.getElementById(script_name + 'FractionsSelect');

  tmp.forEach(function(current){
    var option = document.createElement('option');
    option.setAttribute('f', current.id);
    option.setAttribute('c', current.c);
    option.text = current.name;

    select.appendChild(option);
  });
}

//----------------------------------------------------------------------------//

function accept_filter(){
  var select = document.getElementById(script_name + 'FractionsSelect');
  var option = select.options[select.selectedIndex];
  var all_values = !option.hasAttribute('f') && !option.hasAttribute('c');
  var f, c;

  if(!all_values){
    f = +option.getAttribute('f');
    c = +option.getAttribute('c');
  }

  artefacts.forEach(function(current){
    var cr = current.creature;

    var is_suitable =   (settings.UnknownChb ? true : !!cr)
                     && (cr ?  ((settings.NeutralChb ? true : cr.f)
                             && (settings.NoUpChb    ? true : cr.is_up)
                             && (settings.UpChb      ? true : !cr.is_up))
                            : true);

    var powers = current.element.lastChild.querySelectorAll('td[width="40"]');
    var visible_counter = powers.length;

    for(var i = 0; i < powers.length; ++i){
      var val     = +/(\d+)/.exec(powers[i].textContent)[1];
      var visible = val == 1 ? settings.OnePowerChb
                             : (val == 2 ? settings.TwoPowerChb
                                         : false);
      show_el(powers[i].parentNode, visible);

      if(!visible)
        --visible_counter;
    }

    is_suitable =   is_suitable
                 && (settings.HideEmptyChb ? visible_counter : true)
                 && (all_values ? true
                                : (cr ? (cr.f == f && cr.c.indexOf(c) != -1)
                                      : true));

    show_el(current.element, is_suitable);
  });
}

//----------------------------------------------------------------------------//

function load_settings(){
  var settings_ = load_value(script_name + 'Settings');

  if(settings_)
    return JSON.parse(settings_);

  settings_ = {};

  options.forEach(function(current){
    settings_[current.id] = true;
  });

  return settings_;
}

//----------------------------------------------------------------------------//

function save_settings(){
  options.forEach(function(current){
    var chb = document.getElementById(script_name + current.id);
    settings[current.id] = chb.checked;
  });

  save_value(script_name + 'Settings', JSON.stringify(settings));
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//