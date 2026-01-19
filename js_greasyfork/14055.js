// ==UserScript==
// @name        GN_Market
// @namespace   Gradient
// @description Улучшенный рынок
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/auction\.php.*/
// @exclude     /.+cat=(res|elements|dom|cert|part).*/
// @version     1.0.22
// @downloadURL https://update.greasyfork.org/scripts/14055/GN_Market.user.js
// @updateURL https://update.greasyfork.org/scripts/14055/GN_Market.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_Market'; // Enter your script name here

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

this.compare = function(a, b){
  return (a == b) ? 0 : (a > b ? 1 : -1);
};

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

function get_char(e){
  if(e.which && e.charCode){
    if(e.which < 32)
      return null;

    return String.fromCharCode(+e.which)
  }

  return null;
}

this.number_input = function(e){
  if(e.ctrlKey || e.altKey || e.metaKey)
    return false;

  var chr = get_char(e);

  return chr == null || (chr >= '0' && chr <= '9');
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
// Artefacts
//----------------------------------------------------------------------------//

// categories
this.enum_ac = {
  unknown:   0,
  shop:      1,
  shop_gift: 2,
  stock:     3,
  hunter:    4,
  thief:     5,
  ranger:    6,
  tactic:    7,
  recruit:   8,
  war:       9,
  relict:    10,
  event:     11
};

this.artefacts = JSON.parse(SU.load_value('GN_CommonValues_Artefacts', '[]'));

//----------------------------------------------------------------------------//

this.get_artefact = function(id){
  for(var i = 0; i < this.artefacts.length; ++i)
    if(this.artefacts[i].id == id)
      return this.artefacts[i];

  return null;
};

//----------------------------------------------------------------------------//
// Elements
//----------------------------------------------------------------------------//

this.elements = JSON.parse(SU.load_value('GN_CommonValues_Elements', '[]'));

//----------------------------------------------------------------------------//

this.get_element = function(id){
  for(var i = 0; i < this.elements.length; ++i)
    if(this.elements[i].id == id)
      return this.elements[i];

  return null;
};

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var show_error   = SU.show_error;
var load_value   = SU.load_value;
var save_value   = SU.save_value;
var compare      = SU.compare;
var show_el      = SU.show_el;
var number_input = SU.number_input;

var CV = GN_CommonValues;
var enum_ac = CV.enum_ac;

var cats = [
  { label: 'Магазин:',     id: 'ShopChb',     title: 'Отображать только артефакты из магазина' },
  { label: 'Охота:',       id: 'HunterChb',   title: 'Отображать только охотничьи артефакты' },
  { label: 'Ивент:',       id: 'EventChb',    title: 'Отображать только артефакты с ивентов' },
  { label: 'Прочие',       id: 'AnyOtherChb', title: 'Отображать все остальные артефакты' },
  { label: 'Неизвестные:', id: 'UnknownChb',  title: 'Отображать только неизвестные артефакты' }
];

var states = [
  { label: 'Атака:',      id: 'AttackInput'     },
  { label: 'Защита:',     id: 'DefenceInput'    },
  { label: 'Сила магии:', id: 'SpellpowerInput' },
  { label: 'Знания:',     id: 'KnowledgeInput'  },
  { label: 'Инициатива:', id: 'InitiativeInput' },
  { label: 'Боевой дух:', id: 'MoraleInput'     },
  { label: 'Удача:',      id: 'LuckInput'       }
];

var ex_states = [
  { label: 'Защита от магии, %:',    id: 'MagicProtectionInput' },
  { label: 'Защита от физурона, %:', id: 'CloseCombatInput' },
  { label: 'Защита от стрел, %:',    id: 'RangeCombatInput' },
  { label: 'Допурон в ближнем, %:',  id: 'IncreaseCloseDamageInput' },
  { label: 'Допурон стрелкам, %:',   id: 'IncreaseRangeDamageInput' },
  { label: 'Инициатива героя, %:',   id: 'HeroInitiativeInput' }
];

var enum_s = {
  no:  0,
  yes: 1,
  all: 2
};

var selectors = [
  { label: 'Прибыль:',          id: 'ProfitSelect',             options: [ { text: 'Только без', value: enum_s.no }, { text: 'Только с', value: enum_s.yes }, { text: 'Все', value: enum_s.all } ] },
  { label: 'Повыш. прочность:', id: 'ExtendedDurabilitySelect', options: [ { text: 'Только без', value: enum_s.no }, { text: 'Только с', value: enum_s.yes }, { text: 'Все', value: enum_s.all } ] },
  { label: 'Крафт:',            id: 'CraftSelect',              options: [ { text: 'Только без', value: enum_s.no }, { text: 'Только с', value: enum_s.yes }, { text: 'Все', value: enum_s.all } ] }
];

var options = [
  { label: 'Расчет оптислома:',                 id: 'OptimumChb',        title: 'Рассчитывать оптимальную прочность артефакта при починке у кузнецов' },
  { label: 'Учитывать статы/доп.модификаторы:', id: 'ConsiderStatesChb', title: 'Учитывать стоимости статов/доп. модификаторов' },
  { label: 'Сортировать по ОА/бой:',            id: 'APChb',             title: 'Сортировка по ОА/бой от меньшей к большей' },
  { label: 'Сортировать по цзб(*):',            id: 'OwnSortChb',        title: 'Сортировка по цзб от меньшей к большей независимо от админской (* если включен расчет статов, сортируется по прибыли)' }
];

//----------------------------------------------------------------------------//

var settings = load_settings();
var concrete_artefacts = [];
var categories = [];
var smith_prices = [
  { efficiency : 0.9, cost : 1.0 },
  { efficiency : 0.8, cost : 0.8 },
  //{ efficiency : 0.7, cost : 0.65 },
  //{ efficiency : 0.6, cost : 0.55 },
  //{ efficiency : 0.5, cost : 0.45 },
  //{ efficiency : 0.4, cost : 0.35 },
  //{ efficiency : 0.3, cost : 0.2 },
  //{ efficiency : 0.2, cost : 0.15 },
  //{ efficiency : 0.1, cost : 0 },
];

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var sel_form = document.querySelector("form[name='sel']");

  if(!sel_form)
    show_error(script_name + ', не найдена форма выбора артефактов');

  var header_next = sel_form.parentNode.parentNode.nextSibling;

  if(!header_next)
    show_error(script_name + ', не найдены заголовки таблицы продаваемых объектов');

  draw_header(header_next);

  var own_td = header_next.nextSibling;
  if(!own_td) // no arts at page filter
    return;

  if(!own_td.hasAttribute('bgcolor'))
    own_td.id = script_name + 'OwnTd';

  get_artefacts(header_next.parentNode);
  backup_categories();
  show_proper_artefacts();
}

//----------------------------------------------------------------------------//

function draw_header(header_next)
{
  var header = document.createElement('tr');
  header_next.parentNode.insertBefore(header, header_next);

  var td = document.createElement('td');
  td.setAttribute('colspan', '5');
  header.appendChild(td);

  var table = document.createElement('table');
  table.style.width = '100%';
  td.appendChild(table);

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

  td = document.createElement('td');
  tr.appendChild(td);

  var settings_table = document.createElement('table');
  td.appendChild(settings_table);

  draw_bold_caption(settings_table, 'Уровни артефактов:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  var text = document.createTextNode('Мин. уровень:');
  td.appendChild(text);

  var min_lvl_input = document.createElement('input');
  min_lvl_input.id          = script_name + 'MinLvlInput';
  min_lvl_input.type        = 'text';
  min_lvl_input.style.width = 30;
  min_lvl_input.value       = settings.MinLvlInput;
  min_lvl_input.onkeypress  = number_input;
  td.appendChild(min_lvl_input);

  text = document.createTextNode('Макс. уровень:');
  td.appendChild(text);

  var max_lvl_input = document.createElement('input');
  max_lvl_input.id          = script_name + 'MaxLvlInput';
  max_lvl_input.type        = 'text';
  max_lvl_input.style.width = 30;
  max_lvl_input.value       = settings.MaxLvlInput;
  max_lvl_input.onkeypress  = number_input;
  td.appendChild(max_lvl_input);

  draw_bold_caption(settings_table, 'Типы артефактов:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  table = document.createElement('table');
  td.appendChild(table);

  for(var i = 0; i < cats.length; i += 5){
    tr = document.createElement('tr');
    table.appendChild(tr);

    for(var j = i; j < i + 5 && j < cats.length; ++j){
      td = document.createElement('td');
      tr.appendChild(td);

      text = document.createTextNode(cats[j].label);
      td.appendChild(text);

      td = document.createElement('td');
      tr.appendChild(td);

      var chb = document.createElement('input');
      chb.type    = 'checkbox';
      chb.title   = cats[j].title;
      chb.id      = script_name + cats[j].id;
      chb.checked = settings[cats[j].id];

      td.appendChild(chb);
    }
  }

  draw_bold_caption(settings_table, 'Стоимость статов артефактов:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  states.forEach(function(current){
    text = document.createTextNode(current.label);
    td.appendChild(text);

    var input = document.createElement('input');
    input.id          = script_name + current.id;
    input.type        = 'text';
    input.style.width = 30;
    input.value       = settings[current.id];
    input.onkeypress  = number_input;
    td.appendChild(input);
  });

  draw_bold_caption(settings_table, 'Стоимость доп.модификаторов артефактов:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  table = document.createElement('table');
  td.appendChild(table);

  for(var i = 0; i < ex_states.length; i += 3){
    tr = document.createElement('tr');
    table.appendChild(tr);

    for(var j = i; j < i + 3 && j < ex_states.length; ++j){
      td = document.createElement('td');
      tr.appendChild(td);

      text = document.createTextNode(ex_states[j].label);
      td.appendChild(text);

      td = document.createElement('td');
      tr.appendChild(td);

      var input = document.createElement('input');
      input.id          = script_name + ex_states[j].id;
      input.type        = 'text';
      input.style.width = 30;
      input.value       = settings[ex_states[j].id];
      input.onkeypress  = number_input;
      td.appendChild(input);
    }
  }

  draw_bold_caption(settings_table, 'Варианты отображения:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  selectors.forEach(function(current){
    text = document.createTextNode(current.label);
    td.appendChild(text);

    var select = document.createElement('select');
    select.id = script_name + current.id;
    td.appendChild(select);

    var selected = settings[current.id];

    current.options.forEach(function(current){
      var option = document.createElement('option');
      option.setAttribute('value', current.value);

      if(selected == current.value)
        option.selected = true;

      text = document.createTextNode(current.text);
      option.appendChild(text);

      select.appendChild(option);
    });
  });

  text = document.createTextNode('Процент крафта(от и выше):');
  td.appendChild(text);

  var craft_input = document.createElement('input');
  craft_input.id          = script_name + 'CraftPercentInput';
  craft_input.type        = 'text';
  craft_input.style.width = 30;
  craft_input.value       = settings.CraftPercentInput;
  craft_input.onkeypress  = number_input;
  td.appendChild(craft_input);

  draw_bold_caption(settings_table, 'Дополнительные настройки:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  text = document.createTextNode('Добавочная стоимость:');
  td.appendChild(text);

  var additional_input = document.createElement('input');
  additional_input.id          = script_name + 'AdditionalPriceInput';
  additional_input.type        = 'text';
  additional_input.style.width = 60;
  additional_input.value       = settings.AdditionalPriceInput;
  additional_input.onkeypress  = number_input;
  td.appendChild(additional_input);

  draw_bold_caption(settings_table, 'Опции:');

  tr = document.createElement('tr');
  settings_table.appendChild(tr);

  td = document.createElement('td');
  tr.appendChild(td);

  table = document.createElement('table');
  td.appendChild(table);

  for(var i = 0; i < options.length; i += 3){
    tr = document.createElement('tr');
    table.appendChild(tr);

    for(var j = i; j < i + 3 && j < options.length; ++j){
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
  td.setAttribute('align', 'right');
  tr.appendChild(td);

  var saver = document.createElement('input');
  saver.type = 'button';
  saver.value = 'Применить';
  saver.addEventListener('click', function(e){
    e.preventDefault();

    save_settings();
    show_proper_artefacts();
  });
  td.appendChild(saver);

  show_el(settings_table, is_expanded);
}

//----------------------------------------------------------------------------//

function draw_bold_caption(parent, text){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  var b = document.createElement('b');
  b.textContent = text;
  td.appendChild(b);
}

//----------------------------------------------------------------------------//

function get_artefacts(parent){
  var rows = parent.querySelectorAll('tr.wb');

  for(var i = 0; i < rows.length; ++i){
    var childs = rows[i].childNodes;

    if(childs[1].textContent != 'Купить сразу!') // NB another day
      continue;

    var lotid_el = childs[0].firstChild;
    var lotid = +lotid_el.getAttribute('name');

    var id_el = lotid_el.nextSibling.querySelector('a');
    var re = /art_info\.php\?id=([^&]*)/;
    var matches = re.exec(id_el.getAttribute('href'));

    if(!matches) // it`s not artefact, maybe element or another shit
      continue;

    var artefact = CV.get_artefact(matches[1]);

    var cur_dur   = 1;
    var total_dur = 1;
    var dur_el = id_el.querySelectorAll('img')[1];
    if(dur_el){
      re      = /Прочность: (\d{1,3})\/(\d{1,3})/;
      matches = re.exec(dur_el.outerHTML);

      cur_dur   = +matches[1];
      total_dur = +matches[2];
    }

    re      = /(\d{0,3},?\d{0,3},?\d{1,3}).*/;
    matches = re.exec(childs[2].textContent);

    var price = +matches[1].replace(/,/g, '');

    var modificators = '';
    if(dur_el){
      re      = /\[(.*)]/;
      matches = re.exec(dur_el.outerHTML);

      modificators = matches ? matches[1] : '';
    }

    re = /(\d+) шт/;
    matches = re.exec(childs[0].innerHTML);

    var count = matches ? +matches[1] : 1;

    concrete_artefacts.push({ lotid: lotid, cur_dur: cur_dur, total_dur: total_dur, price: price, lot_price: price, count : count, modificators: modificators, dom: rows[i], art: artefact });
  }
}

//----------------------------------------------------------------------------//

function show_proper_artefacts(){
  var sum = 0;

  for(var i = 0; i < concrete_artefacts.length; ++i){
    var current = concrete_artefacts[i];
    sum += current.price*current.count;
    // by cat
    if(!current.art){
      if(!settings.UnknownChb){
        show_el(current.dom, false);
        continue;
      }

      show_el(current.dom, true);
    }

    if(current.art){
      switch(current.art.kind){
        case enum_ac.shop:
        case enum_ac.stock:
          show_el(current.dom, settings.ShopChb);
          break;

        case enum_ac.hunter:
          show_el(current.dom, settings.HunterChb);
          break;

        case enum_ac.event:
          show_el(current.dom, settings.EventChb);
          break;

        case enum_ac.shop_gift:
        case enum_ac.thief:
        case enum_ac.ranger:
        case enum_ac.tactic:
        case enum_ac.recruit:
        case enum_ac.war:
        case enum_ac.relict:
          show_el(current.dom, settings.AnyOtherChb);
          break;
      }
    }

    if(current.dom.style.display == 'none')
      continue;

    current.price = current.lot_price + settings.AdditionalPriceInput;

    // fill desc + unknown
    current.ppb = current.price/current.cur_dur;

    var desc = current.dom.querySelector('td[valign="top"]');
    //var lot_link = desc.firstChild;
    //lot_link.setAttribute('href', document.location + '#' + current.lotid);

    var ppb = document.getElementById(script_name + 'PPB' + current.lotid);

    if(!ppb){
      ppb = document.createElement('p');
      ppb.style.margin = '0px';
      ppb.id           = script_name + 'PPB' + current.lotid;
      desc.appendChild(ppb);
    }

    ppb.textContent = 'Цена за бой: ' + current.ppb.toFixed(2);

    var notes = document.getElementById(script_name + 'Notes' + current.lotid);

    if(!current.art){
      if(!notes){
        notes = document.createElement('p');
        notes.style.margin = '0px';
        notes.id = script_name + 'Notes' + current.lotid;

        var font = document.createElement('font');
        font.color = 'red';
        font.textContent = 'NB: неизвестен';

        notes.appendChild(font);
        desc.appendChild(notes);
      }

      continue;
    }

    // by lvl
    if(current.art.lvl < settings.MinLvlInput || current.art.lvl > settings.MaxLvlInput)
      show_el(current.dom, false);

    // ppb/profit
    var craft_info = get_craft_info(current);
    current.additional_price = craft_info.price;
    current.craft_percent    = craft_info.percent;

    var art_ppb = current.art.ppb;
    if(!art_ppb)
      art_ppb = NaN; //нет стандартной цены и не указана своя цена

    // by states
    var state_ppb = settings.AttackInput*current.art.states.attack +
                    settings.DefenceInput*current.art.states.defence +
                    settings.SpellpowerInput*current.art.states.spellpower +
                    settings.KnowledgeInput*current.art.states.knowledge +
                    settings.InitiativeInput*current.art.states.initiative +
                    settings.MoraleInput*current.art.states.morale +
                    settings.LuckInput*current.art.states.luck +
                    settings.MagicProtectionInput*current.art.ex_states.magic_protection +
                    settings.CloseCombatInput*current.art.ex_states.close_combat_protection +
                    settings.RangeCombatInput*current.art.ex_states.range_combat_protection +
                    settings.IncreaseRangeDamageInput*current.art.ex_states.increase_range_combat_damage +
                    settings.IncreaseCloseDamageInput*current.art.ex_states.increase_close_combat_damage +
                    settings.HeroInitiativeInput*current.art.ex_states.hero_initiative;

    current.profit = ((settings.ConsiderStatesChb ? state_ppb : art_ppb) - current.ppb)*current.cur_dur;

    // by optimum
    if(settings.OptimumChb){
      var optimum_info = get_optimum_info(current);
      current.lot_ppb = current.ppb;
      current.ppb     = optimum_info.ppb;
      current.profit  = optimum_info.profit;

      ppb.textContent = 'Цена за бой: ' + current.ppb.toFixed(2);
    }

    if(settings.APChb && current.art)
      ppb.textContent += '[OA = ' + (current.ppb/Math.floor(current.art.ap*(1 + 0.02*current.craft_percent))).toFixed(2) + ']';

    // by profit
    switch(settings.ProfitSelect){
      case enum_s.no:
        show_el(current.dom, current.profit < 0);
        break;

      case enum_s.yes:
        show_el(current.dom, current.profit >= 0);
        break;
    }

    if(current.dom.style.display == 'none')
      continue;

    // by high durability
    switch(settings.ExtendedDurabilitySelect){
      case enum_s.no:
        show_el(current.dom, current.total_dur <= current.art.usual_dur);
        break;

      case enum_s.yes:
        show_el(current.dom, current.total_dur > current.art.usual_dur);
        break;
    }

    if(current.dom.style.display == 'none')
      continue;

    // by craft
    switch(settings.CraftSelect){
      case enum_s.no:
        show_el(current.dom, !current.modificators.length);
        break;

      case enum_s.yes:
        show_el(current.dom, current.modificators.length && current.craft_percent >= settings.CraftPercentInput);
        break;
    }

    if(current.dom.style.display == 'none')
      continue;

    // fill desc
    var profit = document.getElementById(script_name + 'Profit' + current.lotid);

    if(!profit){
      profit = document.createElement('p');
      profit.style.margin = '0px';
      profit.id           = script_name + 'Profit' + current.lotid;
      profit.textContent  = 'Прибыль: ';

      var font = document.createElement('font');
      font.color = 'black';
      profit.appendChild(font);

      desc.appendChild(profit);
    }

    if(!isNaN(current.profit)){
      var fix_profit = current.profit.toFixed(2);
      profit.lastChild.textContent = fix_profit;
      profit.lastChild.color = !fix_profit ? 'black' : (fix_profit < 0 ? 'red' : 'blue');
    }
    else
      profit.parentNode.removeChild(profit);

    if(settings.OptimumChb){
      if(current.cur_dur != optimum_info.battle_count){
        var title = 'Чинить до 0/' + optimum_info.last_dur + ' у ' + optimum_info.smith.efficiency*100 + '/' + optimum_info.smith.cost*100 + ', боев: ' + optimum_info.battle_count + '[' + optimum_info.ppb.toFixed(2) + ']';
        current.dom.setAttribute('title', title);
      }
      else
      {
        profit = document.getElementById(script_name + 'Profit' + current.lotid);

        if(profit)
          profit.parentNode.removeChild(profit);
      }
    }
    else
      current.dom.setAttribute('title', '');
  }

  //sort
  if(settings.APChb){
    var dom_els = [];
    concrete_artefacts.forEach(function(current){
      if(current.dom.style.display != 'none' && current.art)
        dom_els.push({ ap: Math.floor(current.art.ap*(1 + 0.02*current.craft_percent)), ppb: current.ppb, dom: current.dom });
    });

    dom_els.sort(function(a, b){
      return compare(a.ppb/a.ap, b.ppb/b.ap);
    });

    dom_els.forEach(function(current){
      var parent = current.dom.parentNode;
      var last = parent.lastChild;

      if(last != current.dom){
        parent.appendChild(document.createElement('td'));
        parent.replaceChild(current.dom, parent.lastChild);
      }
    });
  }

  if(settings.OwnSortChb){
    var dom_els = [];
    concrete_artefacts.forEach(function(current){
      if(current.dom.style.display != 'none' && current.art)
        dom_els.push({ profit: current.profit, ppb: current.ppb, dom: current.dom });
    });

    dom_els.sort(function(a, b){
      if(settings.ConsiderStatesChb)
        return compare(b.profit, a.profit);

      return compare(a.ppb, b.ppb);
    });

    dom_els.forEach(function(current){
      var parent = current.dom.parentNode;
      var last = parent.lastChild;

      if(last != current.dom){
        parent.appendChild(document.createElement('td'));
        parent.replaceChild(current.dom, parent.lastChild);
      }
    });
  }

  // show sum
  var own_td = document.getElementById(script_name + 'OwnTd');
  if(own_td)
    own_td.firstChild.textContent = 'Общая сумма: ' + sum;

  filter_categories();
}

//----------------------------------------------------------------------------//

function backup_categories(){
  var marks = document.querySelectorAll('div[id*="mark_"] > a[href="#"]');

  for(var i = 0; i < marks.length; ++i){
    var mark = /mark_(.+)/.exec(marks[i].parentNode.id)[1];

    categories.push({ mark: mark, closed: 'a2_' + mark, opened: 'a_' + mark});
  }
}

//----------------------------------------------------------------------------//

function get_category(mark){
  for(var i = 0; i < categories.length; ++i)
    if(categories[i].mark == mark)
      return categories[i];

  return null;
}

//----------------------------------------------------------------------------//

function filter_categories(){
  var marks = document.querySelectorAll('div[id*="mark_"] > a[href="#"]');

  for(var i = 0; i < marks.length; ++i)
    show_native_category(marks[i]);

  marks = document.querySelectorAll('div[id*="mark_"] > a[href="#"]');

  for(var i = 0; i < marks.length; ++i)
    hide_artefacts_in_category(marks[i]);

  set_current_mark_functions();
}

//----------------------------------------------------------------------------//

function show_native_category(el){
  var mark = /mark_(.+)/.exec(el.parentNode.id)[1];
  var category = get_category(mark);

  var closed = el.getAttribute('onclick').indexOf('a_' + mark) != -1;
  var invoke = closed ? category.closed : category.opened;
  eval(invoke)();
}

//----------------------------------------------------------------------------//

function hide_artefacts_in_category(el){
  var mark = /mark_(.+)/.exec(el.parentNode.id)[1];
  var marks = document.querySelectorAll('div[id="mark_info_' + mark + '"] > a');

  for(var i = 0; i < marks.length; ++i){
    var mark = /art_type=(.+)/.exec(marks[i].href)[1];

    var artefact = CV.get_artefact(mark);

    if(!artefact)
      continue;

    if(artefact.lvl < settings.MinLvlInput || artefact.lvl > settings.MaxLvlInput){
      var parent = marks[i].parentNode;

      if(marks[i].nextSibling){
        parent.removeChild(marks[i].nextSibling);
        parent.removeChild(marks[i].nextSibling); // remove &nbsp; textNode
      }
      else
        parent.removeChild(marks[i].previousSibling); // remove &nbsp; textNode

      parent.removeChild(marks[i]);
    }
  }
}

//----------------------------------------------------------------------------//

function set_current_mark_functions(){
  var marks = document.querySelectorAll('div[id*="mark_"] > a[href="#"]');

  for(var i = 0; i < marks.length; ++i){
    var mark = /mark_(.+)/.exec(marks[i].parentNode.id)[1];
    var closed = marks[i].getAttribute('onclick').indexOf('a_' + mark) != -1;

    if(!closed){
      var inner = document.getElementById('mark_info_' + mark).innerHTML;

      window['a_' + mark] = function(id, content){
        return function() {
          document.getElementById('mark_info_' + id).innerHTML = content;
          var a = document.getElementById('mark_' + id).querySelector('a');
          a.setAttribute('onclick', 'a2_' + id + '(); return false');
        }
      }(mark, inner);
    } else {
      var category = get_category(mark);

      window['a_' + mark] = function(id, cat){
        return function() {
          cat.opened();
          var a = document.querySelector('div[id="mark_' + id + '"] > a[href="#"]');
          hide_artefacts_in_category(a);
        }
      }(mark, category);
    }
  }
}

//----------------------------------------------------------------------------//

function get_optimum_info(concrete){
  var smith_optimums = [];

  smith_prices.forEach(function(current){
    smith_optimums.push({ optimum: get_optimum_by_smith(concrete, current), smith: current });
  });

  smith_optimums.sort(function(a, b){
    return compare(a.optimum.ppb, b.optimum.ppb);
  });

  var ppb = smith_optimums[0];

  var profit = NaN;
  if(concrete.art.ppb && !settings.AdditionalPriceInput){
    var better_ppb = (concrete.art.ppb - concrete.ppb) > 0 ? concrete.ppb : concrete.art.ppb;
    profit = ppb.optimum.battle_count*(better_ppb - ppb.optimum.ppb);
  }

  return {
    ppb:          ppb.optimum.ppb,
    battle_count: ppb.optimum.battle_count,
    last_dur:     ppb.optimum.last_dur,
    smith:        ppb.smith,
    profit:       profit
  };
}

//----------------------------------------------------------------------------//

function get_optimum_by_smith(concrete, smith){
  var common_price      = concrete.price;
  var common_durability = concrete.cur_dur;
  var durability        = concrete.total_dur;
  var tmp_durability    = durability;

  var previous_ppb = common_price/common_durability;
  var current_ppb  = common_price/common_durability;

  while(current_ppb <= previous_ppb && tmp_durability > 0)
  {
    previous_ppb = current_ppb;

    common_durability += Math.floor(smith.efficiency*tmp_durability);
    common_price += Math.ceil(concrete.art.repair_cost*smith.cost);
    common_price += Math.round(concrete.art.repair_cost*smith.cost*0.01);

    current_ppb = common_price/common_durability;

    --tmp_durability;
  }

  ++tmp_durability;
  common_durability -= Math.floor(smith.efficiency*tmp_durability);

  return {
    ppb:          previous_ppb,
    battle_count: common_durability,
    last_dur:     tmp_durability
  };
}

//----------------------------------------------------------------------------//

function get_craft_info(concrete)
{
  if(!concrete.modificators.length)
    return { price: 0, percent: 0 };

  var element_count = [
    0, 1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45
  ];

  function get_aprice(name){
    return CV.get_element(name).average_price;
  }

  // 0 - weapon, 1 - armor, 2 - jewelry NB sync with art-types
  var element_needed = {
    A: [
      get_aprice('wind_flower') + get_aprice('witch_flower'),
      get_aprice('wind_flower'),
      get_aprice('wind_flower') + get_aprice('meteorit')
    ],
    D: [
      0,
      get_aprice('moon_stone') + get_aprice('abrasive'),
      0
    ],
    E: [
      get_aprice('meteorit') + get_aprice('badgrib'),
      get_aprice('meteorit'),
      get_aprice('meteorit') + get_aprice('tiger_tusk')
    ],
    F: [
      get_aprice('fire_crystal') + get_aprice('tiger_tusk'),
      get_aprice('fire_crystal'),
      get_aprice('fire_crystal') + get_aprice('abrasive')
    ],
    I: [
      get_aprice('moon_stone') + get_aprice('abrasive'),
      0,
      0
    ],
    N: [
      0,
      0,
      get_aprice('wind_flower') + get_aprice('tiger_tusk')
    ],
    W: [
      get_aprice('ice_crystal') + get_aprice('snake_poison'),
      get_aprice('ice_crystal'),
      get_aprice('ice_crystal') + get_aprice('witch_flower')
    ]
  };

  var price   = 0,
      count   = 0,
      percent = 0;

  var A, D, E, F, I, N, W;
  var result = /A(\d+)/.exec(concrete.modificators);

  if(result)
  {
    A = +result[1];
    percent += A;
    price += element_count[A]*element_needed.A[concrete.art.type];
    ++count;
  }

  result = /D(\d+)/.exec(concrete.modificators);
  if(result)
  {
    D = +result[1];
    percent += D;
    price += element_count[D]*element_needed.D[concrete.art.type];
    ++count;
  }

  result = /E(\d+)/.exec(concrete.modificators);
  if(result)
  {
    E = +result[1];
    percent += E;
    price += element_count[E]*element_needed.E[concrete.art.type];
    ++count;
  }

  result = /F(\d+)/.exec(concrete.modificators);
  if(result)
  {
    F = +result[1];
    percent += F;
    price += element_count[F]*element_needed.F[concrete.art.type];
    ++count;
  }

  result = /I(\d+)/.exec(concrete.modificators);
  if(result)
  {
    I = +result[1];
    percent += I;
    price += element_count[I]*element_needed.I[concrete.art.type];
    ++count;
  }

  result = /N(\d+)/.exec(concrete.modificators);
  if(result)
  {
    N = +result[1];
    percent += N;
    price += element_count[N]*element_needed.N[concrete.art.type];
    ++count;
  }

  result = /W(\d+)/.exec(concrete.modificators);
  if(result)
  {
    W = +result[1];
    percent += W;
    price += element_count[W]*element_needed.W[concrete.art.type];
    ++count;
  }

  if(count > 4)
    price += get_aprice('fern_flower')*10;

  return { price: price, percent: percent };
}

//----------------------------------------------------------------------------//

function load_settings(){
  var settings_ = load_value(script_name + 'Settings');

  if(settings_)
    return JSON.parse(settings_);

  settings_ = {
    MinLvlInput:          1,
    MaxLvlInput:          23,
    CraftPercentInput:    0,
    AdditionalPriceInput: 0
  };

  cats.forEach(function(current){
    settings_[current.id] = true;
  });

  states.forEach(function(current){
    settings_[current.id] = 10;
  });

  ex_states.forEach(function(current){
   settings_[current.id] = 1;
  });

  selectors.forEach(function(current){
    settings_[current.id] = enum_s.all;
  });

  options.forEach(function(current){
    settings_[current.id] = false;
  });

  return settings_;
}

//----------------------------------------------------------------------------//

function save_settings(){
  var errors = [];
  var min_lvl          = +document.getElementById(script_name + 'MinLvlInput').value;
  var max_lvl          = +document.getElementById(script_name + 'MaxLvlInput').value;
  var craft_percent    = +document.getElementById(script_name + 'CraftPercentInput').value;
  var additional_price = +document.getElementById(script_name + 'AdditionalPriceInput').value;

  if(isNaN(min_lvl) || min_lvl < 1 || min_lvl > 23)
    errors.push('Мин. уровень должен лежать между 1 и 23');

  if(isNaN(max_lvl) || max_lvl < 1 || max_lvl > 23)
    errors.push('Макс. уровень должен лежать между 1 и 23');

  if(min_lvl > max_lvl)
    errors.push('Макс. уровень не может быть меньше мин. уровня');

  if(isNaN(craft_percent) || craft_percent < 0 || craft_percent > 60)
    errors.push('Процент крафта должен лежать между 0 и 60');

  if(isNaN(additional_price) || additional_price < 0)
    errors.push('Добавочная стоимость должна выражаться положительным числом');

  states.forEach(function(current){
    var state = +document.getElementById(script_name + current.id).value;
    if(isNaN(state) || state < 0 || state > 100)
      errors.push('Стат [' + current.label + '] должен лежать между 0 и 100');
  });

  ex_states.forEach(function(current){
    var state = +document.getElementById(script_name + current.id).value;
    if(isNaN(state) || state < 0 || state > 100)
      errors.push('Доп. модификатор [' + current.label + '] должен лежать между 0 и 100');
  });

  if(document.getElementById(script_name + 'OptimumChb').checked && document.getElementById(script_name + 'ConsiderStatesChb').checked)
    errors.push('Оптислом и подбор по статам не могут быть использованы одновременно');

  if(document.getElementById(script_name + 'APChb').checked && document.getElementById(script_name + 'OwnSortChb').checked)
    errors.push('Сортировки по ОА и по цзб не могут быть использованы одновременно');

  if(errors.length){
    alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
    return;
  }

  settings.MinLvlInput          = min_lvl;
  settings.MaxLvlInput          = max_lvl;
  settings.CraftPercentInput    = craft_percent;
  settings.AdditionalPriceInput = additional_price;

  cats.forEach(function(current){
    var chb = document.getElementById(script_name + current.id);
    settings[current.id] = chb.checked;
  });

  states.forEach(function(current){
    var state = +document.getElementById(script_name + current.id).value;
    settings[current.id] = state;
  });

  ex_states.forEach(function(current){
    var state = +document.getElementById(script_name + current.id).value;
    settings[current.id] = state;
  });

  selectors.forEach(function(current){
    var select = document.getElementById(script_name + current.id);
    var option = +select.options[select.selectedIndex].value;

    settings[current.id] = option;
  });

  options.forEach(function(current){
    var chb = document.getElementById(script_name + current.id);
    settings[current.id] = chb.checked;
  });

  save_value(script_name + 'Settings', JSON.stringify(settings));

  show_proper_artefacts();
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//