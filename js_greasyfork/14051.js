// ==UserScript==
// @name        GN_CardState
// @namespace   Gradient
// @description Статистика карточных игр персонажа
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/pl_info\.php\?id=\d+/
// @version     1.1.9
// @downloadURL https://update.greasyfork.org/scripts/14051/GN_CardState.user.js
// @updateURL https://update.greasyfork.org/scripts/14051/GN_CardState.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_CardState'; // Enter your script name here
var script_version = '1.1.9';

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
// Card types
//----------------------------------------------------------------------------//

this.enum_sct = { // sync?
  tavern:   0,
  tour_pvp: 1,
  tour_pve: 2
};

this.sorted_card_types = JSON.parse(SU.load_value('GN_CommonValues_SortedCardTypes', '[]'));
this.card_types = JSON.parse(SU.load_value('GN_CommonValues_CardTypes', '[]'));

//----------------------------------------------------------------------------//

this.get_card_type = function(id){
  for(var i = 0; i < this.card_types.length; ++i)
    if(this.card_types[i].id == id)
      return this.card_types[i];

  return null;
};

//----------------------------------------------------------------------------//

this.get_sorted_card_type = function(id){
  for(var i = 0; i < this.sorted_card_types.length; ++i)
    if(this.sorted_card_types[i].id == id)
      return this.sorted_card_types[i];

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
var sorted_card_types = CV.sorted_card_types;
var enum_sct          = CV.enum_sct;

//----------------------------------------------------------------------------//

var card_states = load_states();
var parser_info = load_parser_info();
var is_parser_running = false;

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

  var script_desc = 'Карточная статистика ' + script_version;

  var expander = document.createElement('td');
  expander.setAttribute('align', 'center');
  expander.setAttribute('colspan', '6');
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
  td.textContent = 'Дата последней считанной игры: ' + (parser_info.parse_date ? parser_info.parse_date.toLocaleString() : 'еще не считывалось');

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

  update_content(table, false);

  return table;
}

//----------------------------------------------------------------------------//

function update_content(parent, remove_childs){
  if(remove_childs)
    while(parent.lastChild)
      parent.removeChild(parent.lastChild);

  if(card_states.length){
    draw_header(parent);

    sorted_card_types.forEach(function(current){
      current.win = current.loss = current.total = 0;
    });

    card_states.forEach(function(current){
      var card_type        = CV.get_card_type(current.id);
      var sorted_card_type = CV.get_sorted_card_type(card_type.type);

      sorted_card_type.win   += current.win;
      sorted_card_type.loss  += current.loss;
      sorted_card_type.total += current.total;
    });

    sorted_card_types.sort(function(a, b){
      var a_pt = a.win*100/(a.win + a.loss);
      var b_pt = b.win*100/(b.win + b.loss);

      if(isNaN(a_pt) || isNaN(b_pt))
        return isNaN(a_pt) ? 1 : -1;

      if(a_pt == b_pt)
        return compare(b.win, a.win);

      return compare(b_pt, a_pt);
    });

    sorted_card_types.forEach(function(current){
      if(current.win + current.loss > 0)
        draw_sorted_row(parent, current);
    });

    draw_bottom_header(parent);
  }
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  ['Тип игры', 'Баланс', 'Победы', 'Поражения', 'Процент побед', 'Итого'].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);

    var b = document.createElement('b');
    td.appendChild(b);
    b.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_sorted_row(parent, content){
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
      card_states.sort(function(a, b){
        var a_pt = a.win*100/(a.win + a.loss);
        var b_pt = b.win*100/(b.win + b.loss);

        if(a_pt == b_pt)
          return compare(a.win, b.win);

        return compare(a_pt, b_pt);
      });

      var count = 0;
      card_states.forEach(function(current){
        var card_type = CV.get_card_type(current.id);

        if(card_type.type == content.id){
          draw_row(tr, content.id, current, count % 2 === 0 ? '#ffffff' : '#eeeeee');
          ++count;
        }
      });
    }
    else
      while(tr.nextSibling && tr.nextSibling.getAttribute('id') && tr.nextSibling.getAttribute('id').indexOf(script_name + '_' + content.id + '_') != -1)
        parent.removeChild(tr.nextSibling);

    a.setAttribute('expanded', expanded ? 'true' : 'false');
  });
  td.appendChild(a);

  var type = CV.get_sorted_card_type(content.id);

  var u = document.createElement('u');
  u.textContent = type.desc;
  a.appendChild(u);

  var sum = content.win + content.loss;
  var percent = content.win*100/sum;

  [content.total, content.win, content.loss, percent.toFixed(2) + '%', sum].forEach(function(current){
    td = document.createElement('td');
    tr.appendChild(td);
    td.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_row(prev_sibling, sibling_id, content, color){
  var tr = document.createElement('tr');
  tr.id = script_name + '_' + sibling_id + '_' + content.id;
  tr.setAttribute('bgcolor', color);
  prev_sibling.parentNode.insertBefore(tr, prev_sibling.nextSibling);

  var type = CV.get_card_type(content.id);
  var sum = content.win + content.loss;
  var percent = content.win*100/sum;

  [type.desc, content.total, content.win, content.loss, percent.toFixed(2) + '%', sum].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);
    td.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function draw_bottom_header(parent){
  var tr = document.createElement('tr');
  tr.id = script_name + 'BottomHeader';
  parent.appendChild(tr);

  var win_sum   = 0,
      loss_sum  = 0,
      total_sum = 0;

  card_states.forEach(function(current){
    win_sum   += current.win;
    loss_sum  += current.loss;
    total_sum += current.total;
  });

  var sum = win_sum + loss_sum;
  var percent = win_sum*100/sum;

  ['Все игры', total_sum, win_sum, loss_sum, percent.toFixed(2) + '%', sum].forEach(function(current){
    var td = document.createElement('td');
    tr.appendChild(td);

    var b = document.createElement('b');
    td.appendChild(b);
    b.textContent = current;
  });
}

//----------------------------------------------------------------------------//

function export_to_file(){
  if(!card_states.length)
    return;

  var linebreak = '%0D%0A';
  var res = ['Тип игры', 'Баланс', 'Победы', 'Поражения', 'Процент побед', 'Итого'].join(';') + linebreak;

  card_states.forEach(function(current){
    var card_type = CV.get_card_type(current.id);
    var sum = current.win + current.loss;
    var percent = current.win*100/sum;

    res += [card_type.desc, current.total, current.win, current.loss, percent.toFixed(2) + '%', sum].join(';') + linebreak;
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
    current_page: last_page - parser_info.parse_page_count + (parser_info.parse_page_count === 0 ? 0 : 2),
    last_page:    last_page
  };

  search_next(counter);
}

//----------------------------------------------------------------------------//

function search_next(counter){
  var refresh_button = document.getElementById(script_name + 'Refresh');
  var diff = counter.last_page - counter.current_page + 1;
  refresh_button.value = 'Обработано ' + diff +  '/' + (counter.last_page + 1) + ' страниц (' + Math.round(diff*100/(counter.last_page + 1)) + '%)';

  var url = '/pl_cardlog.php?id=' + get_id() + '&page=' + counter.current_page;
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
          parse_td.textContent = 'Дата последней считанной игры: ' + (parser_info.parse_date ? parser_info.parse_date.toLocaleString() : 'еще не считывалось');

          var refresh_button = document.getElementById(script_name + 'Refresh');
          refresh_button.value = 'Обновить данные';

          var content_table = document.getElementById(script_name + 'Content');
          update_content(content_table, true);

          save_value(script_name + '_States' + get_id(), JSON.stringify(card_states));
          save_value(script_name + '_ParserInfo' + get_id(), JSON.stringify(parser_info));

          ['Refresh', 'Export', 'Remove'].forEach(function(current){
            document.getElementById(script_name + current).removeAttribute('disabled');
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
  var re = /.*?<a href="cgame\.php\?gameid=(\d+)">(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2})(.+?)([+\-0-9]*)<\/td><\/tr>.*?/gmi;

  var raw_data = [],
      matches  = [];

  while(matches = re.exec(response_))
    raw_data.push({ id: +matches[1], game_date: string_to_date(matches[2]), game_str: matches[3], game_bet: matches[4] ? +matches[4] : 0});

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
    re = /.*?arc_tour_hist\.php.*?/gmi;
    var type_id = (re.test(current.game_str) ? enum_sct.tour_pvp : enum_sct.tavern);

    if(type_id == enum_sct.tour_pvp){
      re = /.*?(pl_info\.php\?id=).*?/gmi;
      var count = 0;

      while(re.test(current.game_str))
        ++count;

      type_id = count == 1 ? enum_sct.tour_pve : enum_sct.tour_pvp;
    }

    var state_id = null;
    switch(type_id){
      case enum_sct.tavern:
        state_id = "bet" + Math.abs(current.game_bet);
        break;

      case enum_sct.tour_pvp:
      case enum_sct.tour_pve:
      {
        var stage = 0;
        re = />1\/(\d+)</;
        matches = re.exec(current.game_str);

        if(matches)
          stage = +matches[1];

        if(/>Полуфинал</.test(current.game_str))
          stage = 2;

        if(/>Финал</.test(current.game_str))
          stage = 1;

        state_id = ((type_id == enum_sct.tour_pvp) ? "stage" : "bstage") + stage;
      }
      break;
    }

    var state = get_card_state(state_id);

    re = new RegExp('<a href="pl_info\\.php\\?id=' + get_id() + '" class=pi><b>');
    var win = re.test(current.game_str);
    win ? ++state.win : ++state.loss;

    state.total += (type_id == enum_sct.tavern && win ? current.game_bet*0.95 : current.game_bet);
  });

  parser_info.parse_date = raw_data[raw_data.length - 1].game_date;
  parser_info.last_id    = raw_data[raw_data.length - 1].id;
}
//----------------------------------------------------------------------------//

function load_states(){
  var states = load_value(script_name + '_States' + get_id());

  return states ? JSON.parse(states) : [];
}

//----------------------------------------------------------------------------//

function load_parser_info(){
  var info = load_value(script_name + '_ParserInfo' + get_id());

  if(!info)
    return { refresh_date: null, last_id: null, parse_date: null, parse_page_count : 0 };

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
  remove_value(script_name + '_States' + get_id());

  reload_page();
}

//----------------------------------------------------------------------------//

function get_last_page(){
  var url      = '/pl_cardlog.php?id=' + get_id() + '&page=999999';
  var response = send_get(url);
  var page = /a class="active" href="#">(\d+?)</gmi.exec(response);

  return page ? (+page[1] - 1) : 0;
}
//----------------------------------------------------------------------------//

function get_id(){
  return /.+id=(\d+)/.exec(document.location)[1];
}

//----------------------------------------------------------------------------//

function get_card_state(id){
  for(var i = 0; i < card_states.length; ++i)
    if(card_states[i].id == id)
      return card_states[i];

  var new_state = { id: id, total: 0, win: 0, loss: 0 };
  card_states.push(new_state);

  return new_state;
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//