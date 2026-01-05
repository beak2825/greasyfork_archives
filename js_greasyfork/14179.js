// ==UserScript==
// @name        GN_CardLogAnalyzer
// @namespace   Gradient
// @description Анализатор карточных игр
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/.+/
// @exclude     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @version     1.0.7
// @downloadURL https://update.greasyfork.org/scripts/14179/GN_CardLogAnalyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/14179/GN_CardLogAnalyzer.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_CardLogAnalyzer'; // Enter your script name here

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

this.string_to_date = function(str){
  var matches = /(\d{2})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})/.exec(str);

  return new Date(2000 + +matches[3], +matches[2] - 1, +matches[1], +matches[4], +matches[5]);
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

} // wrapper end

//----------------------------------------------------------------------------//
// GUIController
//----------------------------------------------------------------------------//

var GN_GUIController = new GUIController();

//----------------------------------------------------------------------------//

function GUIController(){  // wrapper start

//----------------------------------------------------------------------------//

clear_flash_z_index();

//----------------------------------------------------------------------------//

var script_name = 'GN_GUIController';
this.script_name = function(){
  return script_name;
};

//----------------------------------------------------------------------------//

this.registerObject = function(object){
  root_div = document.getElementById(root.div.id);

  if(!root_div)
    root_div = create_node(root, document.body);
  else{
    var custom = root_div.getAttribute('custom').split('|');
    root.div.top    = +custom[0];
    root.div.left   = +custom[1];
    root.div.width  = +custom[2];
    root.div.height = +custom[3];
  }

  object.div.left = root.div.left + left;
  object.div.top  = top;

  var childs = root_div.childNodes;

  for(var i = 0; i < childs.length; ++i)
    if(childs[i].nodeName.toLowerCase() == 'div'){
      var height = +childs[i].getAttribute('custom').split('|')[3];
      object.div.top += height;
    }

  create_node(object, root_div);
  align_childs(root_div);
  collapse_childs(root_div);
};

//----------------------------------------------------------------------------//

this.hide_all = function(){
  if(!root_div)
    return;

  var childs = root_div.childNodes;
  for(var i = 0; i < childs.length; ++i)
    if(childs[i].nodeName.toLowerCase() == 'div')
      childs[i].style.top = +childs[i].getAttribute('custom').split('|')[0];

  align_childs(root_div);
  collapse_childs(root_div);
};

var hide_all = this.hide_all;

//----------------------------------------------------------------------------//

const left = 10;
const top  = 10;

var root = {
  div: {
    id:     script_name + 'MainDiv',
    top:    top,
    left:   left,
    width:  0,
    height: 0
  },

  input: {
    id:    script_name + 'MainInput',
    value: 'Скрипты',
    title: 'Конфигурация и запуск скриптов, не относящихся к определенной странице'
  },

  child_divs: []
};

var root_div = document.getElementById(root.div.id);

//----------------------------------------------------------------------------//

function create_node(object, parent){
  var div_ = div(object.div);
  div_.setAttribute('expanded', 'false');
  parent.appendChild(div_);

  set_div_style(object.div);

  var input_ = input(object.input);
  div_.appendChild(input_);

  set_input_style(object.input);

  object.div.left  += div_.clientWidth;
  object.div.width  = div_.clientWidth;
  object.div.height = div_.clientHeight;

  var custom = [ object.div.top, object.div.left, object.div.width, object.div.height ];
  div_.setAttribute('custom', custom.join('|'));

  if(object.child_divs.length || object.div.id == root.div.id){
    input_.addEventListener('click', function(){
      expand_childs(div_);
    });

    create_child_nodes(object, div_);
  }

  return div_;
}

//----------------------------------------------------------------------------//

function create_child_nodes(object, parent){
  var childs = object.child_divs;

  for(var i = 0; i < childs.length; ++i){
    var child = childs[i];
    child.div.top  = top;
    child.div.left = left;

    if(i){
      var total_height = 0;

      for(var j = 0; j < i; ++j){
        var sibling     = childs[j];
        var sibling_div = document.getElementById(sibling.div.id);

        total_height += sibling_div.clientHeight;
      }

      child.div.top += total_height;
    }

    child.div.left += object.div.left;

    create_node(child, parent);
  }
}

//----------------------------------------------------------------------------//

function expand_childs(el){
  var now_expanded = (el.getAttribute('expanded') == 'true');

  if(now_expanded && el == root_div){
    hide_all();
    return;
  }

  var childs = el.childNodes;

  for(var i = 0; i < childs.length; ++i)
    if(childs[i].nodeName.toLowerCase() == 'div')
      childs[i].style.display = !now_expanded ? 'block' : 'none';

  if(now_expanded){
    collapse_childs(el);

    if(el.parentNode == root_div){
      childs = root_div.childNodes;

      for(i = 0; i < childs.length; ++i)
        if(childs[i].nodeName.toLowerCase() == 'div' && childs[i] != el)
          childs[i].style.display = 'block';

      el.style.top   = +el.getAttribute('custom').split('|')[0];
      el.style.width = +el.getAttribute('custom').split('|')[2];

      align_childs(root_div);
    }
  }

  if(!now_expanded && el.parentNode == root_div){
    childs = root_div.childNodes;

    for(i = 0; i < childs.length; ++i){
      if(childs[i].nodeName.toLowerCase() == 'div' && childs[i] != el)
        childs[i].style.display = 'none';
    }

    el.style.top   = top;
    el.style.width = +el.getAttribute('custom').split('|')[2];
  }

  el.setAttribute('expanded', now_expanded ? 'false' : 'true');
}

//----------------------------------------------------------------------------//

function align_childs(el){
  var max_width = 0;
  var childs = el.childNodes;

  for(var i = 0; i < childs.length; ++i)
    if(childs[i].nodeName.toLowerCase() == 'div'){
      var width = +childs[i].getAttribute('custom').split('|')[2];

      if(width >= max_width)
        max_width = width;
    }

  for(i = 0; i < childs.length; ++i)
    if(childs[i].nodeName.toLowerCase() == 'div')
      childs[i].style.width = max_width;
}

//----------------------------------------------------------------------------//

function collapse_childs(el){
  var divs = el.querySelectorAll('div');

  for(var i = 0; i < divs.length; ++i){
    divs[i].setAttribute('expanded', 'false');
    divs[i].style.display = 'none';
  }

  el.setAttribute('expanded', 'false');
}

//----------------------------------------------------------------------------//

function div(object){
  var div = document.createElement('div');
  div.id = object.id;

  return div;
}

//----------------------------------------------------------------------------//

function set_div_style(object){
  var div   = document.getElementById(object.id);
  var style = div.style;

  style.position = 'fixed';
  style.top      = object.top + 'px';
  style.left     = object.left + 'px';
  style.zIndex   = 100;
}

//----------------------------------------------------------------------------//

function input(object){
  var input = document.createElement('input');
  input.type  = 'button';
  input.id    = object.id;
  input.value = object.value;
  input.title = object.title;

  return input;
}

//----------------------------------------------------------------------------//

function set_input_style(object){
  var input = document.getElementById(object.id);
  var style = input.style;

  style.display    = 'block';
  style.width      = '95%';
  style.border     = '1px solid rgb(153, 153, 153)';
  style.padding    = '1px';
  style.margin     = '2px';
  style.background = 'none repeat scroll 0% 0% rgb(204, 204, 204)';
  style.fontSize   = '12px';
  style.cursor     = 'pointer';
  style.zIndex     = 100;
}

//----------------------------------------------------------------------------//

function clear_flash_z_index(){
  var objects = document.querySelectorAll('object');

  for(var i = 0; i < objects.length; ++i){
    var o = objects[i];

    if(!o.querySelector('param[name="wmode"]')){
      var param = document.createElement('param');
      param.setAttribute('name', 'wmode');
      param.setAttribute('value', 'opaque');

      o.insertBefore(param, o.firstChild);
    }
  }
}

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var compare        = SU.compare;
var load_value     = SU.load_value;
var save_value     = SU.save_value;
var remove_value   = SU.remove_value;
var send_get       = SU.send_get;
var number_input   = SU.number_input;
var string_to_date = SU.string_to_date;

var CV = GN_CommonValues;
var sorted_card_types = CV.sorted_card_types;
sorted_card_types.sort(function(a, b){
  return compare(a.desc, b.desc);
});

var card_types = CV.card_types;
card_types.sort(function(a, b){
  return compare(a.id, b.id);
});

var enum_sct = CV.enum_sct;

var is_parser_running = false;
var searched          = [];
var colspan           = '4';
var empty_option      = 'all_values';
var count_counter     = 0;
var settings          = load_settings();

var enum_exodus = {
  win:  0,
  loss: 1
};

var GC = GN_GUIController;
GC.registerObject(
  {
    div: { id: GC.script_name() + '_' + script_name + 'Div' },

    input: {
      id:    GC.script_name() + '_' + script_name + 'Input',
      value: 'Анализатор карточных игр',
      title: 'Анализатор карточных игр'
    },

    child_divs: []
  }
);

var start_button = document.getElementById(GC.script_name() + '_' + script_name + 'Input');

start_button.addEventListener('click', function(e){
  draw_div(document.body);
});

//----------------------------------------------------------------------------//

function draw_div(parent){
  var div = document.createElement('div');
  div.id              = script_name + 'Div';
  div.style.position  = 'fixed';
  div.style.display   = 'block';
  div.style.top       = '50px';
  div.style.zIndex    = 100;
  div.style.overflowX = 'hidden';

  var width = 700;
  div.style.width      = width + 'px';
  div.style.left       = (document.body.clientWidth - width)/2;
  div.style.background = start_button.style.backgroundColor;

  parent.appendChild(div);

  draw_content(div);
  set_settings();
}

//----------------------------------------------------------------------------//

function draw_content(parent){
  var table = document.createElement('table');
  table.style.width  = '100%';
  table.style.border = 'medium none';

  parent.appendChild(table);

  draw_header(table);
  draw_first_row(table);
  draw_second_row(table);
  draw_third_row(table);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.setAttribute('align', 'center');
  td.setAttribute('colspan', '6');
  tr.appendChild(td);

  var input = document.createElement('input');
  input.id    = script_name + 'StartInput';
  input.type  = 'button';
  input.value = 'Начать поиск';
  input.addEventListener('click', function(e){
    e.preventDefault();

    if(!save_settings())
      return;

    searched = [];
    enable_settings(false);
    draw_search_table(parent);
    recheck_rect();

    parse_data();
  });
  td.appendChild(input);
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.setAttribute('colspan', '6');
  tr.appendChild(td);

  var table = document.createElement('table');
  table.style.width = '100%';
  td.appendChild(table);

  tr = document.createElement('tr');
  table.appendChild(tr);

  td = document.createElement('td');
  td.setAttribute('align', 'center');
  td.textContent = 'Панель настроек';
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('align', 'center');
  td.style.width = '100px';

  var a = document.createElement('a');
  a.href = '';
  a.textContent = '(очистить все)';
  a.addEventListener('click', function(e){
    e.preventDefault();
    clear_settings();
  });
  td.appendChild(a);
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('align', 'center');
  td.style.width = '25px';
  td.textContent = 'x';
  td.style.backgroundColor = 'red';
  td.style.fontSize = '16';
  td.title = 'Закрыть окно';
  td.addEventListener('click', function(e){
    remove_div();
  });
  tr.appendChild(td);
}

//----------------------------------------------------------------------------//

function draw_first_row(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('ID персонажа:'));

  td = document.createElement('td');
  tr.appendChild(td);

  var input = document.createElement('input');
  input.id          = script_name + 'IDInput';
  input.type        = 'text';
  input.style.width = '150px';
  input.onkeypress  = number_input;
  input.title       = 'Идентификатор персонажа, по чьему протоколу будет вестись поиск';
  td.appendChild(input);

  td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('Что ищем:'));

  td = document.createElement('td');
  tr.appendChild(td);

  input = document.createElement('input');
  input.id          = script_name + 'SearchInput';
  input.type        = 'text';
  input.style.width = '150px';
  input.title       = 'Фраза для поиска. Может не указываться, если включен поиск и фильтр по всем играм';
  td.appendChild(input);

  td = document.createElement('td');
  tr.appendChild(td);

  var chb = document.createElement('input');
  chb.type  = 'checkbox';
  chb.title = 'Поиск будет осуществляться без учета регистра';
  chb.id    = script_name + 'CIChb';
  td.appendChild(chb);

  td.appendChild(document.createTextNode('без учета регистра'));
}

//----------------------------------------------------------------------------//

function draw_second_row(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('Тип игры:'));

  td = document.createElement('td');
  tr.appendChild(td);

  var select = document.createElement('select');
  select.id          = script_name + 'SCTSelect';
  select.style.width = '150px';
  select.title       = 'Поиск по общему типу игры';
  select.addEventListener('change', function(e){
    reload_card_types();
  });
  td.appendChild(select);

  var option = document.createElement('option');
  option.setAttribute('value', empty_option);
  select.appendChild(option);

  sorted_card_types.forEach(function(current){
    option = document.createElement('option');
    option.setAttribute('value', current.id);
    option.appendChild(document.createTextNode(current.desc));

    select.appendChild(option);
  });

  td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('Вид игры:'));

  td = document.createElement('td');
  tr.appendChild(td);

  select = document.createElement('select');
  select.id          = script_name + 'CTSelect';
  select.style.width = '150px';
  select.title       = 'Поиск по конкретному виду игры';
  td.appendChild(select);

  option = document.createElement('option');
  option.setAttribute('value', empty_option);
  select.appendChild(option);

  card_types.forEach(function(current){
    option = document.createElement('option');
    option.setAttribute('value', current.id);
    option.appendChild(document.createTextNode(current.desc));

    select.appendChild(option);
  });

  td = document.createElement('td');
  tr.appendChild(td);

  var chb = document.createElement('input');
  chb.type  = 'checkbox';
  chb.title = 'При включении будет использоваться фильтр по типу и/или виду игры';
  chb.id    = script_name + 'CTChb';
  td.appendChild(chb);

  td.appendChild(document.createTextNode('использовать фильтр'));
}

//----------------------------------------------------------------------------//

function draw_third_row(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('До Х дней:'));

  td = document.createElement('td');
  tr.appendChild(td);

  var input = document.createElement('input');
  input.id          = script_name + 'DaysInput';
  input.type        = 'text';
  input.style.width = '150px';
  input.onkeypress  = number_input;
  input.title       = 'Поиск по количеству дней от текущей даты';
  td.appendChild(input);

  td = document.createElement('td');
  tr.appendChild(td);

  td.appendChild(document.createTextNode('До Y игр:'));

  td = document.createElement('td');
  tr.appendChild(td);

  input = document.createElement('input');
  input.id          = script_name + 'CountInput';
  input.type        = 'text';
  input.style.width = '150px';
  input.onkeypress  = number_input;
  input.title       = 'Поиск по количеству игр';
  td.appendChild(input);

  td = document.createElement('td');
  tr.appendChild(td);

  var chb = document.createElement('input');
  chb.type  = 'checkbox';
  chb.title = 'При включении будет использоваться фильтр по количеству дней от текущей даты и/или числу игр. Если указан 0 или пусто, поиск осуществляться не будет';
  chb.id    = script_name + 'DCChb';
  td.appendChild(chb);

  td.appendChild(document.createTextNode('использовать фильтр'));
}

//----------------------------------------------------------------------------//

function remove_div(){
  var div = document.getElementById(script_name + 'Div');
  div.parentNode.removeChild(div);
}

//----------------------------------------------------------------------------//

function draw_search_table(parent){
  var table = document.getElementById(script_name + 'SearchTable');

  if(table){
    set_search_info();

    var trs = table.querySelectorAll('tr:not([id])');
    for(var i = 0; i < trs.length; ++i)
      table.removeChild(trs[i]);

    var el = document.getElementById(script_name + 'Stopper');
    el.removeAttribute('disabled');
  } else {
    table = document.createElement('table');
    table.style.width = '100%';
    table.id = script_name + 'SearchTable';
    parent.appendChild(table);

    draw_search_header(table);
    set_search_info();
  }
}

//----------------------------------------------------------------------------//

function set_search_info(){
  var el = document.getElementById(script_name + 'SearchInfo');
  while(el.firstChild)
    el.removeChild(el.firstChild);

  if(!is_parser_running){
    el.textContent = '';
    return;
  }

  var chapters = [];
  chapters.push('Идет поиск по протоколу игрока [ID = ' + settings.id + ']');
  chapters.push('Фраза для поиска: "' + settings.search + (settings.ci_c ? '" (без учета регистра)' : '" (с учетом регистра)'));

  if(settings.ct_c){
    var str = '';
    if(settings.type != empty_option){
      var select = document.getElementById(script_name + 'SCTSelect');
      str = 'Тип игры: ' + select.options[select.selectedIndex].text;
    }

    if(settings.ct != empty_option){
      var select = document.getElementById(script_name + 'CTSelect');
      str += (str.length ? ', вид игры: ' : 'Вид игры: ') + select.options[select.selectedIndex].text;
    }

    if(str.length)
      chapters.push(str);
  }

  if(settings.dc_c)
    chapters.push('До ' + settings.days + ' дней, до ' + settings.count + ' игр');

  chapters.forEach(function(current){
    el.appendChild(document.createTextNode(current));
    el.appendChild(document.createElement('br'));
  });
}

//----------------------------------------------------------------------------//

function set_progress_info(counter){
  var el = document.getElementById(script_name + 'ProgressInfo');
  while(el.firstChild)
    el.removeChild(el.firstChild);

  var wins = searched.filter(function(current){
    return current.exodus == enum_exodus.win;
  });

  var b_str = 'Найдено записей: ' + searched.length;
  if(searched.length){
    var balance = 0;
    searched.forEach(function(current){
      var ct = CV.get_card_type(current.ct);

      if(ct.type == CV.enum_sct.tavern)
        balance = (current.exodus == enum_exodus.win) ? (balance + +ct.sign) : (balance - +ct.sign);
    });

    b_str += ', побед: ' + wins.length + ', процент побед: ' + (100*wins.length/searched.length).toFixed(2) + '%, баланс золота: ' + balance + '(*только в таверне)';
  }

  if(!is_parser_running){
    el.textContent = 'Поиск завершен. ' + b_str;
    return;
  }

  var p_str = 'Обработано ' + counter.current + '/' + counter.last + ' страниц(' + (100*counter.current/counter.last).toFixed(2) + '%)';

  el.appendChild(document.createTextNode(p_str));
  el.appendChild(document.createElement('br'));
  el.appendChild(document.createTextNode(b_str));
}

//----------------------------------------------------------------------------//

function draw_search_header(parent){
  var tr = document.createElement('tr');
  tr.id = script_name + 'SearchInfoTR';
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.id = script_name + 'SearchInfo';
  td.setAttribute('colspan', colspan);
  td.setAttribute('align', 'center');
  tr.appendChild(td);

  tr = document.createElement('tr');
  tr.id = script_name + 'ProgressInfoTR';
  parent.appendChild(tr);

  td = document.createElement('td');
  td.id = script_name + 'ProgressInfo';
  td.setAttribute('colspan', colspan);
  td.setAttribute('align', 'center');
  tr.appendChild(td);

  tr = document.createElement('tr');
  tr.id = script_name + 'StopperTR';
  parent.appendChild(tr);

  td = document.createElement('td');
  td.setAttribute('colspan', colspan);
  td.setAttribute('align', 'center');
  tr.appendChild(td);

  var input = document.createElement('input');
  input.id = script_name + 'Stopper';
  input.type  = 'button';
  input.value = 'Окончить поиск';
  input.addEventListener('click', function(e){
    on_stop();
  });
  td.appendChild(input);

  tr = document.createElement('tr');
  tr.setAttribute('bgColor', '#DCDCDC');
  tr.id = script_name + 'SearchHeaderTR';
  parent.appendChild(tr);

  ['ID игры', 'Дата', 'Описание', 'Вид', 'Исход' ].forEach(function(current){
    td = document.createElement('td');
    td.textContent = current;
    tr.appendChild(td);
  });
}

//----------------------------------------------------------------------------//

function draw_search_row(parent, obj){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  var a = document.createElement('a');
  a.href        = '/cgame.php?gameid=' + obj.id;
  a.textContent = obj.id;
  td.appendChild(a);
  td.style.width = '90px';
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = obj.date.toLocaleString();
  td.style.width = '90px';
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = obj.desc;
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = obj.sign;
  td.style.width = '50px';
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('align', 'center');
  td.style.width           = '25px';
  td.textContent           = obj.exodus == enum_exodus.win ? 'В' : 'П';
  td.style.backgroundColor = obj.exodus == enum_exodus.win ? 'green' : 'red';
  tr.appendChild(td);

  recheck_rect();
}

//----------------------------------------------------------------------------//

function on_stop(){
  is_parser_running = false;
  enable_settings(true);
  set_search_info();
  set_progress_info(null);
  recheck_rect();
  count_counter = 0;

  document.body.style.cursor = 'default';

  var el = document.getElementById(script_name + 'Stopper');
  el.setAttribute('disabled', '');
}

//----------------------------------------------------------------------------//

function parse_data(){
  if(is_parser_running)
    return;

  document.body.style.cursor = 'wait';
  is_parser_running = true;

  var counter = {
    current: 0,
    last:    get_last_page()
  };

  search_next(counter);
}

//----------------------------------------------------------------------------//

function search_next(counter){
  if(!is_parser_running){
    on_stop();
    return;
  }

  set_progress_info(counter);

  var url = '/pl_cardlog.php?id=' + settings.id + '&page=' + counter.current;
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
        ++counter.current;
        search_value(xhr.response);

        if(counter.current <= counter.last)
          search_next(counter);
        else
          on_stop();
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
    return compare(b.id, a.id);
  });

  var table = document.getElementById(script_name + 'SearchTable');

  raw_data.forEach(function(current){
    re = /.*?arc_tour_hist\.php.*?/gmi;
    var type_id = (re.test(current.game_str) ? enum_sct.tour_pvp : enum_sct.tavern);

    if(type_id == enum_sct.tour_pvp){
      re = /.*?pl_info\.php\?id=.*?/gmi;
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

    re = new RegExp('<a href="pl_info\\.php\\?id=' + settings.id + '" class=pi><b>');
    var exodus = re.test(current.game_str) ? enum_exodus.win : enum_exodus.loss;

    var text_re = /.*?>([^<]+?)<.*?/gmi;
    var desc = '';
    var text_matches = [];

    while(text_matches = text_re.exec(current.game_str))
      desc += text_matches[1];

    var obj = { id: current.id, date: current.game_date, desc: clear_specific_symbols(desc), exodus: exodus, ct: state_id, raw_desc: current.game_str };

    var is_suit = is_suitable(obj);
    if(is_parser_running && is_suit){
      searched.push(obj);
      draw_search_row(table, obj);
    }

    if(settings.dc_c){
      if(settings.count && is_suit && settings.count <= ++count_counter)
        is_parser_running = false;

      var date = new Date();
      date.setDate(date.getDate() - settings.days);
      if(settings.days && obj.date <= date)
        is_parser_running = false;
    }
  });
}

//----------------------------------------------------------------------------//

function clear_specific_symbols(str){
  var res = str;

  [': '].forEach(function(current){
    if(!res.indexOf(current))
      res = res.substring(current.length);
  });

  ['&nbsp;'].forEach(function(current){
    while(res.indexOf(current) != -1)
      res = res.replace(current, '');
  });

  return res;
}

//----------------------------------------------------------------------------//

function is_suitable(obj){
  if(settings.search.length){
    var desc   = settings.ci_c ? obj.desc.toLowerCase() : obj.desc;
    var search = settings.ci_c ? settings.search.toLowerCase() : settings.search;

    if(desc.indexOf(search) == -1)
      return false;
  }

  var ct = CV.get_card_type(obj.ct);
  obj.sign = ct.desc;

  if(settings.ct_c){
    if(settings.sct != empty_option)
      if(ct.type != settings.sct)
        return false;

    if(settings.ct != empty_option && settings.ct != obj.ct)
      return false;
  }

  if(settings.dc_c){
    if(settings.count && settings.count <= count_counter)
      return false;

    var date = new Date();
    date.setDate(date.getDate() - settings.days);
    if(settings.days && obj.date <= date)
      return false;
  }

  return true;
}

//----------------------------------------------------------------------------//

function enable_settings(enable){
  ['IDInput', 'SearchInput', 'CIChb', 'SCTSelect', 'CTSelect', 'CTChb', 'DaysInput', 'CountInput',
   'DCChb', 'StartInput'].forEach(function(current){
    var el = document.getElementById(script_name + current);
    enable ? el.removeAttribute('disabled') : el.setAttribute('disabled', '');
  });
}

//----------------------------------------------------------------------------//

function reload_card_types(){
  var el = document.getElementById(script_name + 'SCTSelect');
  var val = el.options[el.selectedIndex].value;

  el = document.getElementById(script_name + 'CTSelect');
  while(el.options.length)
    el.removeChild(el.options[0]);

  var tmp_ct = card_types;

  if(val != empty_option)
    tmp_ct = tmp_ct.filter(function(current){
      return current.type == val;
    });

  var option = document.createElement('option');
  option.setAttribute('value', empty_option);
  el.appendChild(option);

  tmp_ct.forEach(function(current){
    option = document.createElement('option');
    option.setAttribute('value', current.id);

    var text = document.createTextNode(current.desc);
    option.appendChild(text);

    el.appendChild(option);
  });
}

//----------------------------------------------------------------------------//

function load_settings(){
  var settings_ = load_value(script_name + 'Settings');

  if(settings_)
    return JSON.parse(settings_);

  settings_ = {
    id:     '',
    search: '',
    sct:    empty_option,
    ct:     empty_option,
    days:   '',
    count:  '',
    ci_c:   false,
    ct_c:   false,
    dc_c:   false
  };

  return settings_;
}

//----------------------------------------------------------------------------//

function save_settings(){
  var errors = [];

  var id = +document.getElementById(script_name + 'IDInput').value;
  if(isNaN(id) || id < 1)
    errors.push('Идентификатор игрока выражается положительным числом');

  var search   = document.getElementById(script_name + 'SearchInput').value.trim();
  var ct_c     = document.getElementById(script_name + 'CTChb').checked;

  if(!ct_c && !search.length)
    errors.push('Не указаны условия поиска');

  var dc_c  = document.getElementById(script_name + 'DCChb').checked;
  var days  = +document.getElementById(script_name + 'DaysInput').value;
  var count = +document.getElementById(script_name + 'CountInput').value;

  if(dc_c){
    var days_correct  = !isNaN(days) && days >= 1;
    var count_correct = !isNaN(count) && count >= 1;

    if(!days_correct && !count_correct)
      errors.push('Не указано количество дней и/или игр поиска');
  }

  if(errors.length){
    alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
    return false;
  }

  var select = document.getElementById(script_name + 'SCTSelect');
  settings.sct = select.options[select.selectedIndex].value;

  select = document.getElementById(script_name + 'CTSelect');
  settings.ct = select.options[select.selectedIndex].value;

  settings.id     = id;
  settings.search = search;
  settings.days   = days;
  settings.count  = count;

  settings.ci_c = document.getElementById(script_name + 'CIChb').checked;
  settings.ct_c = ct_c;
  settings.dc_c = dc_c;

  save_value(script_name + 'Settings', JSON.stringify(settings));
  return true;
}

//----------------------------------------------------------------------------//

function set_settings(){
  var el = document.getElementById(script_name + 'IDInput');
  el.value = settings.id;

  el = document.getElementById(script_name + 'SearchInput');
  el.value = settings.search;

  el = document.getElementById(script_name + 'CIChb');
  el.checked = settings.ci_c;

  el = document.getElementById(script_name + 'SCTSelect');

  for(var i = 0; i < el.options.length; ++i)
    if(el.options[i].value == settings.sct){
      el.options[i].selected = true;
      break;
    }

  reload_card_types();

  el = document.getElementById(script_name + 'CTSelect');

  for(var i = 0; i < el.options.length; ++i)
    if(el.options[i].value == settings.ct){
      el.options[i].selected = true;
      break;
    }

  el = document.getElementById(script_name + 'CTChb');
  el.checked = settings.ct_c;

  el = document.getElementById(script_name + 'DaysInput');
  el.value = settings.days;

  el = document.getElementById(script_name + 'CountInput');
  el.value = settings.count;

  el = document.getElementById(script_name + 'DCChb');
  el.checked = settings.dc_c;
}

//----------------------------------------------------------------------------//

function clear_settings(){
  if(is_parser_running)
    return;

  remove_value(script_name + 'Settings');
  settings = load_settings();
  set_settings();
}

//----------------------------------------------------------------------------//

function get_last_page(){
  var url      = '/pl_cardlog.php?id=' + settings.id + '&page=999999';
  var response = send_get(url);
  var page = /a class="active" href="#">(\d+?)</gmi.exec(response);

  return page ? (+page[1] - 1) : 0;
}

//----------------------------------------------------------------------------//

function recheck_rect(){
  var div = document.getElementById(script_name + 'Div');
  var trs = div.querySelectorAll('tr');

  var height = 40;
  for(var i = 0; i < trs.length; ++i)
    height += trs[i].clientHeight;

  div.style.height    = height > 700 ? 700 : height;
  div.style.overflowY = height > 700 ? 'scroll' : 'hidden';
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//