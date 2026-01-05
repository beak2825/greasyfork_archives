// ==UserScript==
// @name        GN_BattleState
// @namespace   Gradient
// @description Боевая статистика персонажа
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/pl_info\.php\?id=\d+/
// @version     1.2.14
// @downloadURL https://update.greasyfork.org/scripts/14050/GN_BattleState.user.js
// @updateURL https://update.greasyfork.org/scripts/14050/GN_BattleState.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_BattleState'; // Enter your script name here
var script_version = '1.2.14';

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

this.send_get = function(url)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.send(null);

  if(xhr.status == 200)
    return xhr.responseText;

  return null;
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

this.remove_value = function(value){
  var div = document.getElementById('GN_GM_Handler');
  div.setAttribute('desc',      value);
  div.setAttribute('operation', 'remove');

  div.click();

  if(div.getAttribute('state') != 'complete')
    this.show_error('Ошибка при удалении значения');
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

this.save_file = function(text, info){
  var res = 'data:text/csv;charset=utf-8,' + encodeURI(text);

  if(info)
    alert(info);

  window.open(res);
};

//----------------------------------------------------------------------------//

this.string_to_date = function(str){
  var matches = /(\d{2})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})/.exec(str);

  return new Date(2000 + +matches[3], +matches[2] - 1, +matches[1], +matches[4], +matches[5]);
};

//----------------------------------------------------------------------------//

this.show_el = function(el, visible){
  el.style.display = visible ? '' : 'none';
};

//----------------------------------------------------------------------------//

this.reload_page = function(){
  document.location.href = document.location.href;
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
// Battle types
//----------------------------------------------------------------------------//

this.enum_sbt = { // sync?
  pvp:       0,
  hunter:    1,
  mercenary: 2,
  thief:     3,
  ranger:    4,
  war:       5,
  event:     6,
  instance:  7,
  other:     8,
  guardian:  9,
  campaign:  10,
  leader:    11,
  unknown:   12
};

this.sorted_battle_types = JSON.parse(SU.load_value('GN_CommonValues_SortedBattleTypes', '[]'));
this.battle_types = JSON.parse(SU.load_value('GN_CommonValues_BattleTypes', '[]'));

//----------------------------------------------------------------------------//

this.get_battle_type = function(id){
  for(var i = 0; i < this.battle_types.length; ++i)
    if(this.battle_types[i].id == id)
      return this.battle_types[i];

  var new_type = { id: id, sbt: this.enum_sbt.unknown, name: id }; // sync?
  this.battle_types.push(new_type);

  return new_type;
};

//----------------------------------------------------------------------------//

this.get_sorted_battle_type = function(id){
  for(var i = 0; i < this.sorted_battle_types.length; ++i)
    if(this.sorted_battle_types[i].id == id)
      return this.sorted_battle_types[i];

  return null;
};

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var show_error     = SU.show_error;
var load_value     = SU.load_value;
var save_value     = SU.save_value;
var remove_value   = SU.remove_value;
var send_get       = SU.send_get;
var compare        = SU.compare;
var save_file      = SU.save_file;
var show_el        = SU.show_el;
var string_to_date = SU.string_to_date;
var reload_page    = SU.reload_page;

var CV = GN_CommonValues;
var sorted_battle_types = CV.sorted_battle_types;

//----------------------------------------------------------------------------//

var lvl_battle_states = load_lvl_states();
var battle_states = [];
state_summary();

var parser_info = load_parser_info();
var is_parser_running = false;

var current_user_id = SU.current_id();
var merc_tasks      = JSON.parse(SU.load_value('GN_ShowLastTask_Tasks' + current_user_id, '[]'));
var add_merc_task   = current_user_id == get_id();
var hunts           = JSON.parse(SU.load_value('GN_ShowLastHunt_Hunts' + current_user_id, '[]'));
var add_hunt        = current_user_id == get_id();

//----------------------------------------------------------------------------//

var table_width = 0;
start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var prev_sibling = get_sibling();

  if(!prev_sibling)
    show_error('Не найден элемент привязки');

  table_width = prev_sibling.width;

  var header = draw_header_table(prev_sibling);
  draw_table(header);
  draw_expand_all(header);
}

//----------------------------------------------------------------------------//

function get_sibling(){
  var transfer = document.querySelector('table > tbody > tr > td > a[href*="pl_transfers.php?id="]');
  return transfer ? transfer.parentNode.parentNode.parentNode.parentNode : null;
}

//----------------------------------------------------------------------------//

function draw_expand_all(next_sibling){
  var table = document.createElement('table');
  table.className = 'wblight';
  table.width     = table_width;
  table.align     = 'center';
  next_sibling.parentNode.insertBefore(table, next_sibling);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var script_desc = 'Боевая статистика ' + script_version;

  var expander = document.createElement('td');
  expander.setAttribute('align', 'center');
  expander.setAttribute('colspan', '5');
  var is_expanded = load_value(script_name + 'Expand', 'false') == 'true';
  expander.setAttribute('expand', is_expanded ? 'true' : 'false');
  expander.textContent = script_desc + (is_expanded ? ' (скрыть)' : ' (показать)');
  expander.addEventListener('click', function(e){
    e.preventDefault();

    var expanded = expander.getAttribute('expand') == 'false';
    show_el(next_sibling, expanded);
    show_el(next_sibling.nextSibling, expanded);

    save_value(script_name + 'Expand', expanded ? 'true' : 'false');

    expander.setAttribute('expand', expanded ? 'true' : 'false');
    expander.textContent = expanded ? (script_desc + ' (скрыть)') : (script_desc + ' (показать)');
  });

  tr.appendChild(expander);

  show_el(next_sibling, is_expanded);
  show_el(next_sibling.nextSibling, is_expanded);
}

//----------------------------------------------------------------------------//

function draw_header_table(prev_sibling){
  var table = document.createElement('table');
  table.className = 'wblight';
  table.width     = table_width;
  table.align     = 'center';
  table.id        = script_name + 'ContentHeader';

  prev_sibling.parentNode.insertBefore(table, prev_sibling.nextSibling);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.id = script_name + 'RefreshDate';
  tr.appendChild(td);
  td.textContent = 'Дата последнего обновления: ' + (parser_info.refresh_date ? parser_info.refresh_date.toLocaleString() : 'еще не считывалось');

  td = document.createElement('td');
  td.align = 'right';
  tr.appendChild(td);

  var refresh_button = document.createElement('input');
  refresh_button.type  = 'button';
  refresh_button.value = 'Обновить данные';
  refresh_button.id    = script_name + 'Refresh';
  refresh_button.addEventListener('click', parse_data);
  td.appendChild(refresh_button);

  tr = document.createElement('tr');
  table.appendChild(tr);

  td = document.createElement('td');
  td.id = script_name + 'ParseDate';
  tr.appendChild(td);
  td.textContent = 'Дата последнего считанного боя: ' + (parser_info.parse_date ? parser_info.parse_date.toLocaleString() : 'еще не считывалось');

  td = document.createElement('td');
  td.align = 'right';
  tr.appendChild(td);

  var export_button = document.createElement('input');
  export_button.type  = 'button';
  export_button.value = 'Экспорт в файл';
  export_button.id    = script_name + 'Export';
  export_button.addEventListener('click', export_to_file);
  td.appendChild(export_button);

  var remove_button = document.createElement('input');
  remove_button.type  = 'button';
  remove_button.value = 'Очистить статистику';
  remove_button.id    = script_name + 'Remove';
  remove_button.addEventListener('click', remove_data);
  td.appendChild(remove_button);

  return table;
}

//----------------------------------------------------------------------------//

function draw_table(prev_sibling){
  var table = document.createElement('table');
  table.className = 'wblight';
  table.width     = table_width;
  table.align     = 'center';
  table.id        = script_name + 'Content';
  prev_sibling.parentNode.insertBefore(table, prev_sibling.nextSibling);

  update_content(table, false, 0, battle_states);
  draw_expander(table);

  return table;
}

//----------------------------------------------------------------------------//

function draw_expander(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var expander = document.createElement('td');
  expander.setAttribute('align', 'center');
  expander.setAttribute('colspan', '5');
  expander.setAttribute('expand', 'false');
  expander.textContent = 'Показать статистику по уровням';
  expander.addEventListener('click', function(e){
    e.preventDefault();

    var expanded = expander.getAttribute('expand') == 'false';

    draw_lvl_state(tr, !expanded);

    expander.setAttribute('expand', expanded ? 'true' : 'false');
    expander.textContent = expanded ? 'Скрыть статистику по уровням' : 'Показать статистику по уровням';
  });

  tr.appendChild(expander);
}

//----------------------------------------------------------------------------//

function draw_lvl_state(prev_sibling, remove_childs){
  var parent = prev_sibling.parentNode;
  if(remove_childs){
    while(prev_sibling.nextSibling)
      parent.removeChild(parent.lastChild);

    return;
  }

  lvl_battle_states.sort(function(a, b){
    return compare(b.lvl, a.lvl);
  });

  lvl_battle_states.forEach(function(current){
    var tr = document.createElement('tr');
    parent.appendChild(tr);

    var td = document.createElement('td');
    td.setAttribute('align', 'center');
    td.setAttribute('colspan', '5');
    td.textContent = 'За ' + current.lvl + ' уровень:';

    tr.appendChild(td);

    update_content(parent, false, current.lvl, current.states);
  });
}

//----------------------------------------------------------------------------//

function update_content(parent, remove_childs, lvl, array_){
  if(remove_childs)
    while(parent.lastChild)
      parent.removeChild(parent.lastChild);

  if(array_.length){
    draw_header(parent);

    sorted_battle_types.forEach(function(current){
      current.win = current.draw = current.loss = 0;
    });

    array_.forEach(function(current){
      var battle_type        = CV.get_battle_type(current.id);
      var sorted_battle_type = CV.get_sorted_battle_type(battle_type.sbt);

      sorted_battle_type.win  += current.win;
      sorted_battle_type.draw += current.draw;
      sorted_battle_type.loss += current.loss;
    });

    sorted_battle_types.sort(function(a, b){
      var a_pt = a.win*100/(a.win + a.draw + a.loss);
      var b_pt = b.win*100/(b.win + b.draw + b.loss);

      if(isNaN(a_pt) || isNaN(b_pt))
        return isNaN(a_pt) ? 1 : -1;

      if(a_pt == b_pt)
        return compare(b.win, a.win);

      return compare(b_pt, a_pt);
    });

    sorted_battle_types.forEach(function(current){
      if(current.win + current.draw + current.loss > 0)
        draw_sorted_row(parent, current, lvl, array_);
    });

    draw_bottom_header(parent, array_);
  }
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  ['Тип боя', 'Победы', 'Поражения', 'Процент побед', 'Итого'].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);

    var b = document.createElement('b');
    td.appendChild(b);
    b.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_sorted_row(parent, content, lvl, array_){
  var tr = document.createElement('tr');
  tr.setAttribute('bgcolor', content.color);
  parent.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  var a = document.createElement('a');
  a.setAttribute('expanded', 'false');
  a.addEventListener('click', function(){
    var expanded = a.getAttribute('expanded') == 'false';

    if(expanded){
      array_.sort(function(a, b){
        var a_pt = a.win*100/(a.win + a.draw + a.loss);
        var b_pt = b.win*100/(b.win + b.draw + b.loss);

        if(a_pt == b_pt)
          return compare(a.win, b.win);

        return compare(a_pt, b_pt);
      });

      var count = 0;
      array_.forEach(function(current){
        var battle_type = CV.get_battle_type(current.id);

        if(battle_type.sbt == content.id){
          draw_row(tr, content.id, lvl, current, count % 2 == 0 ? '#ffffff' : '#eeeeee');
          ++count;
        }
      });
    }
    else
      while(tr.nextSibling && tr.nextSibling.getAttribute('id') && tr.nextSibling.getAttribute('id').indexOf(script_name + '_' + lvl + '_' + content.id + '_') != -1)
        parent.removeChild(tr.nextSibling);

    a.setAttribute('expanded', expanded ? 'true' : 'false');
  });
  td.appendChild(a);

  var type = CV.get_sorted_battle_type(content.id);

  var u = document.createElement('u');
  u.textContent = type.name;
  a.appendChild(u);

  var sum = content.win + content.draw + content.loss;
  var percent = content.win*100/sum;

  [content.win, content.draw + content.loss, percent.toFixed(2) + '%', sum].forEach(function(current){
    td = document.createElement('td');
    tr.appendChild(td);
    td.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_row(prev_sibling, sibling_id, lvl, content, color){
  var tr = document.createElement('tr');
  tr.id = script_name + '_' + lvl + '_' + sibling_id + '_' + content.id;
  tr.setAttribute('bgcolor', color);
  prev_sibling.parentNode.insertBefore(tr, prev_sibling.nextSibling);

  var type = CV.get_battle_type(content.id);
  var sum = content.win + content.draw + content.loss;
  var percent = content.win*100/sum;

  [type.name, content.win, content.draw + content.loss, percent.toFixed(2) + '%', sum].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);
    td.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_bottom_header(parent, array_){
  var tr = document.createElement('tr');
  tr.id = script_name + 'BottomHeader';
  parent.appendChild(tr);

  var win_sum  = 0,
      draw_sum = 0,
      loss_sum = 0;
  array_.forEach(function(current){
    win_sum  += current.win;
    draw_sum += current.draw;
    loss_sum += current.loss;
  });

  var sum = win_sum + draw_sum + loss_sum;
  var percent = win_sum*100/sum;

  ['Все бои', win_sum, draw_sum + loss_sum, percent.toFixed(2) + '%', sum].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);

    var b = document.createElement('b');
    td.appendChild(b);
    b.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function export_to_file(){
  if(!battle_states.length)
    return;

  var linebreak = '%0D%0A';
  var res = ['Тип боя', 'Победы', 'Поражения', 'Процент побед', 'Итого'].join(';') + linebreak;

  battle_states.forEach(function(current){
    var battle_type = CV.get_battle_type(current.id);
    var sum = current.win + current.draw + current.loss;
    var percent = current.win*100/sum;

    res += [battle_type.name, current.win, current.draw + current.loss, percent.toFixed(2) + '%', sum].join(';') + linebreak;
  });

  save_file(res, 'Сейчас будет предложено сохранить файл с результатами. Переименуйте его в формат .csv, разделитель - ";"');
}

//----------------------------------------------------------------------------//

function parse_data(){
  if(is_parser_running)
    return;

  document.body.style.cursor = 'wait';

  ['Refresh', 'Export', 'Remove'].forEach(function(current){
    var el = document.getElementById(script_name + current);
    el.setAttribute('disabled', '');
  });

  is_parser_running = true;

  var last_page = get_last_page();

  var counter = {
    current_page: last_page - parser_info.parse_page_count + (parser_info.parse_page_count == 0 ? 0 : 2),
    last_page:    last_page
  };

  search_next(counter);
}

//----------------------------------------------------------------------------//

function search_next(counter){
  var refresh_button = document.getElementById(script_name + 'Refresh');
  var diff = counter.last_page - counter.current_page + 1;
  refresh_button.value = 'Обработано ' + diff +  '/' + (counter.last_page + 1) + ' страниц (' + Math.round(diff*100/(counter.last_page + 1)) + '%)';

  var url = '/pl_warlog.php?id=' + get_id() + '&page=' + counter.current_page;
  send_async_get(url, counter);
}

//----------------------------------------------------------------------------//

function send_async_get(url, counter)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        --counter.current_page;
        search_value(xhr.response);

        if(counter.current_page >= 0)
          search_next(counter);
        else
        {
          parser_info.refresh_date     = new Date();
          parser_info.parse_page_count = counter.last_page + 1;

          var refresh_td = document.getElementById(script_name + 'RefreshDate');
          refresh_td.textContent = 'Дата последнего обновления: ' + parser_info.refresh_date.toLocaleString();

          var parse_td = document.getElementById(script_name + 'ParseDate');
          parse_td.textContent = 'Дата последнего считанного боя: ' + (parser_info.parse_date ? parser_info.parse_date.toLocaleString() : 'еще не считывалось');

          var refresh_button = document.getElementById(script_name + 'Refresh');
          refresh_button.value = 'Обновить данные';

          var content_table = document.getElementById(script_name + 'Content');
          state_summary();
          update_content(content_table, true, 0, battle_states);
          draw_expander(content_table);

          save_value(script_name + '_LvlStates' + get_id(), JSON.stringify(lvl_battle_states));
          save_value(script_name + '_ParserInfo' + get_id(), JSON.stringify(parser_info));
          save_value('GN_ShowLastTask_Tasks' + current_user_id, JSON.stringify(merc_tasks));
          save_value('GN_ShowLastHunt_Hunts' + current_user_id, JSON.stringify(hunts));

          ['Refresh', 'Export', 'Remove'].forEach(function(current){
            var el = document.getElementById(script_name + current);
            el.removeAttribute('disabled');
          });

          document.body.style.cursor = 'default';
          is_parser_running = false;
        }
      }
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function search_value(response_){
  var re = /.*?<a href="warlog\.php\?warid=(\d+)(&show_for_all=[^"]+|&show=[^"]+)*">(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2})(.+?)<!--(\d+?)--><br>.*?/gmi;

  var raw_data = [],
      matches  = [];

  while(matches = re.exec(response_))
    raw_data.push({ id: +matches[1], battle_date: string_to_date(matches[3]), battle_str: matches[4], battle_type: +matches[5] });

  raw_data.sort(function(a, b){
    return compare(a.id, b.id);
  });

  raw_data = raw_data.filter(function(current){
    if(!parser_info.last_id)
      return true;

    return current.id > parser_info.last_id;
  });

  if(!raw_data.length)
    return;

  raw_data.forEach(function(current){
    //any specific cases
    var battle_type = current.battle_type;

    switch(battle_type){
      case 0:
        var hunt_re = /<i>.+?\(\d+\)(<\/b>)?<\/i>/gmi;
        battle_type = hunt_re.test(current.battle_str) ? 0 : -1; // from CommonValuesFiller - hunt or old battles
        break;

      case 40: // from CommonValuesFiller - tactic guild
        var ai_re = /<i>(<b>)?\*.+?\*(<\/b>)?<\//gmi;
        var count = 0;

        while(ai_re.test(current.battle_str))
          ++count;

        if(count)
          battle_type = count == 3 ? -3 : -4; // from CommonValuesFiller - 3 ai or 2 ai
        else {
          var splitted = split_pvp_helper(current.battle_str);
          var levels_before = splitted[0], levels_after = splitted[1];

          if(levels_before.length == 1 && levels_after.length == 1)
            battle_type = -5; // from CommonValuesFiller - duel
          else if(JSON.stringify(levels_before) == JSON.stringify(levels_after))
            battle_type = -6; // from CommonValuesFiller - pair vs pair
          else
            battle_type = -7; // from CommonValuesFiller - mixed
        }

        break;

      case 61: // from CommonValuesFiller - ranger guild
        var pvp_re = /.*?pl_info\.php\?id=.*?/gmi;
        var count = 0;

        while(pvp_re.test(current.battle_str))
          ++count;

        battle_type = count == 1 ? 61 : -2; // from CommonValuesFiller - ai or pvp
        break;

      case 89: // from CommonValuesFiller - KBO
        var splitted = split_pvp_helper(current.battle_str);
        var levels_before = splitted[0], levels_after = splitted[1];
        var hero_on_left_side = splitted[2];

        if(levels_before.length == levels_after.length)
          if(levels_before.length == 1)
            battle_type = hero_on_left_side ? -12 : -13; // from CommonValuesFiller - attack or defence vs solo player
          else
            battle_type = hero_on_left_side ? -8 : -9; // from CommonValuesFiller - attack or defence
        else {
          if(levels_before.length > levels_after.length)
            battle_type = hero_on_left_side ? -12 : -11; // from CommonValuesFiller - attack or defence vs solo player
          else
            battle_type = hero_on_left_side ? -10 : -13; // from CommonValuesFiller - solo attack or defence
        }

        break;

      case 104: // from CommonValuesFiller - tax battles
        var splitted = split_pvp_helper(current.battle_str);
        var levels_before = splitted[0], levels_after = splitted[1];
        var hero_on_left_side = splitted[2];

        if(levels_before.length == levels_after.length)
          battle_type = hero_on_left_side ? -14 : -15; // from CommonValuesFiller - attack or defence
        else
          battle_type = hero_on_left_side ? -16 : -17; // from CommonValuesFiller - attack or defence vs/as solo player

        break;
    }

    re = new RegExp('href="pl_info\\.php\\?id=' + get_id() + '"[^\\[]+?\\[(\\d+?)\\]', 'gmi');
    matches = re.exec(current.battle_str);

    var lvl   = get_lvl_state(+matches[1]);
    var state = get_battle_state(battle_type, lvl.states);

    var win_re = /<b>(.+?)<\/b>/gmi;
    var win_matches = win_re.exec(current.battle_str);

    if(!win_matches)
      ++state.draw;
    else{
      var win = win_matches[1].indexOf(get_id()) != -1;

      while(win_matches = win_re.exec(current.battle_str)){
        if(!win)
          win = win_matches[1].indexOf(get_id()) != -1;
      }

      win ? ++state.win : ++state.loss;
    }

    if(add_merc_task)
      f_add_merc_task(battle_type, current);

    if(add_hunt)
      f_add_hunt(battle_type, current);
  });

  parser_info.parse_date = raw_data[raw_data.length - 1].battle_date;
  parser_info.last_id    = raw_data[raw_data.length - 1].id;
}

//----------------------------------------------------------------------------//

function split_pvp_helper(text){
  var splitter = text.split('> vs <');
  if(splitter.length != 2)
    throw new Error('Incorrect splitter length');

  var levels_before = [], levels_after = [];
  var pvp_re = /.*?pl_info\.php\?id=.*?>.+?\[(\d+)]/gmi;

  var pvp_matches = [];
  while(pvp_matches = pvp_re.exec(splitter[0]))
    levels_before.push(pvp_matches[1]);

  while(pvp_matches = pvp_re.exec(splitter[1]))
    levels_after.push(pvp_matches[1]);

  if(!(levels_before.length && levels_after.length))
    throw new Error('Incorrect levels length');

  var hero_on_left = splitter[0].indexOf('font color=red') != -1;

  return [levels_before, levels_after, hero_on_left];
}

//----------------------------------------------------------------------------//

function state_summary(){
  battle_states = [];

  lvl_battle_states.forEach(function(current){
    current.states.forEach(function(current){
      var state = get_battle_state(current.id, battle_states);
      state.win  += current.win;
      state.draw += current.draw;
      state.loss += current.loss;
    });
  });
}

//----------------------------------------------------------------------------//

function load_lvl_states(){
  var lvl_states = load_value(script_name + '_LvlStates' + get_id());

  return lvl_states ? JSON.parse(lvl_states) : [];
}

//----------------------------------------------------------------------------//

function load_parser_info(){
  var info = load_value(script_name + '_ParserInfo' + get_id());

  if(!info)
    return { refresh_date: null, parse_date: null, last_id: null, parse_page_count : 0 };

  info = JSON.parse(info);
  info.refresh_date = new Date(Date.parse(info.refresh_date));
  info.parse_date   = new Date(Date.parse(info.parse_date));

  return info;
}

//----------------------------------------------------------------------------//

function remove_data(){
  if(!confirm('Все данные по этому игроку будут удалены. Вы уверены?'))
    return;

  remove_value(script_name + '_ParserInfo' + get_id());
  remove_value(script_name + '_LvlStates' + get_id());

  if(add_merc_task)
    remove_value('GN_ShowLastTask_Tasks' + current_user_id);

  if(add_hunt)
    remove_value('GN_ShowLastHunt_Hunts' + current_user_id);

  reload_page();
}

//----------------------------------------------------------------------------//

function get_last_page(){
  var url      = '/pl_warlog.php?id=' + get_id() + '&page=999999';
  var response = send_get(url);
  var page = /a class="active" href="#">(\d+?)</gmi.exec(response);

  return page ? (+page[1] - 1) : 0;
}
//----------------------------------------------------------------------------//

function get_id(){
  return /.+id=(\d+)/.exec(document.location)[1];
}

//----------------------------------------------------------------------------//

function get_lvl_state(lvl){
  for(var i = 0; i < lvl_battle_states.length; ++i)
    if(lvl_battle_states[i].lvl == lvl)
      return lvl_battle_states[i];

  var new_lvl = { lvl: lvl, states: [] };
  lvl_battle_states.push(new_lvl);

  return new_lvl;
}

//----------------------------------------------------------------------------//

function get_battle_state(id, array_){
  for(var i = 0; i < array_.length; ++i)
    if(array_[i].id == id)
      return array_[i];

  var new_state = { id: id, win: 0, draw: 0, loss: 0 };
  array_.push(new_state);

  return new_state;
}

//----------------------------------------------------------------------------//
// MG parser functions
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//

function get_merc_task(str){
  for(var i = 0; i < merc_tasks.length; ++i)
    if(merc_tasks[i].str == str)
      return merc_tasks[i];

  return null;
}

//----------------------------------------------------------------------------//

function f_add_merc_task(battle_type, raw_obj){
  var bt = CV.get_battle_type(battle_type);

  if(bt.sbt != CV.enum_sbt.mercenary)
    return;

  var win_re = /<b>(.+?)<\/b>/gmi;
  var win_matches = win_re.exec(raw_obj.battle_str);

  var win = false;

  if(win_matches){
    win = win_matches[1].indexOf(get_id()) != -1;

    while(win_matches = win_re.exec(raw_obj.battle_str)){
      if(!win)
        win = win_matches[1].indexOf(get_id()) != -1;
    }
  }

  var re      = win ? /<i>(.+?)\s{(\d+)}<\/i>/gmi : /<i><b>(.+?)\s{(\d+)}<\/b><\/i>/gmi;
  var matches = re.exec(raw_obj.battle_str);

  if(!matches){
    re      = win ? /<i>(.+?)\s{(\d+)}<\/i>/gmi : /<b><i>(.+?)\s{(\d+)}<\/i><\/b>/gmi;
    matches = re.exec(raw_obj.battle_str);
  }

  if(!matches && !win_matches){
    re      = /<i>(.+?)\s{(\d+)}<\/i>/gmi;
    matches = re.exec(raw_obj.battle_str);
  }

  var task = get_merc_task(matches[1]);

  if(task){
    task.lvl    = +matches[2];
    task.battle = raw_obj.id;
  }
  else
    merc_tasks.push({ str: matches[1], lvl: +matches[2], battle: raw_obj.id });
}

//----------------------------------------------------------------------------//
// MG parser functions end
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// HG parser functions
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//

function get_hunt(str){
  for(var i = 0; i < hunts.length; ++i)
    if(hunts[i].str == str)
      return hunts[i];

  return null;
}

//----------------------------------------------------------------------------//

function f_add_hunt(battle_type, raw_obj){
  if(battle_type != 0) // hunt in CommonValuesFiller
    return;

  var win_re = /<b>(.+?)<\/b>/gmi;
  var win_matches = win_re.exec(raw_obj.battle_str);

  var win = false;

  if(win_matches){
    win = win_matches[1].indexOf(get_id()) != -1;

    while(win_matches = win_re.exec(raw_obj.battle_str)){
      if(!win)
        win = win_matches[1].indexOf(get_id()) != -1;
    }
  }

  var re      = win ? /<i>(.+?)\s\((\d+)\)<\/i>/gmi : /<i><b>(.+?)\s\((\d+)\)<\/b><\/i>/gmi;
  var matches = re.exec(raw_obj.battle_str);

  if(!matches){
    re      = win ? /<i>(.+?)\s\((\d+)\)<\/i>/gmi : /<b><i>(.+?)\s\((\d+)\)<\/i><\/b>/gmi;
    matches = re.exec(raw_obj.battle_str);
  }

  if(!matches && !win_matches){
    re      = /<i>(.+?)\s\((\d+)\)<\/i>/gmi;
    matches = re.exec(raw_obj.battle_str);
  }

  var help_re      = /.*?pl_info\.php\?id=(\d+).*?/gmi;
  var help_matches = help_re.exec(raw_obj.battle_str);

  if(help_matches[1] != get_id()) // hunts as helper
    return;

  var hunt = get_hunt(matches[1]);

  if(hunt){
    hunt.count  = +matches[2];
    hunt.battle = raw_obj.id;
  }
  else
    hunts.push({ str: matches[1], count: +matches[2], battle: raw_obj.id });
}

//----------------------------------------------------------------------------//
// MG parser functions end
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//