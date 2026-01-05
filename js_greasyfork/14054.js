// ==UserScript==
// @name        GN_ElementPriceLoader
// @namespace   Gradient
// @description Обновление цен на элементы
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/.+/
// @exclude     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @version     1.0.12
// @downloadURL https://update.greasyfork.org/scripts/14054/GN_ElementPriceLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/14054/GN_ElementPriceLoader.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_ElementPriceLoader'; // Enter your script name here

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
// Elements
//----------------------------------------------------------------------------//

this.elements = JSON.parse(SU.load_value('GN_CommonValues_Elements', '[]'));

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

var CV = GN_CommonValues;
var elements = CV.elements;

var save_value   = SU.save_value;
var load_value   = SU.load_value;
var show_error   = SU.show_error;
var number_input = SU.number_input;
var reload_page  = SU.reload_page;

var GC = GN_GUIController;
GC.registerObject(
  {
    div: { id: GC.script_name() + '_' + script_name + 'Div' },

    input: {
      id:    GC.script_name() + '_' + script_name + 'Input',
      value: 'Обновление цен элементов',
      title: 'Обновление цен элементов'
    },

    child_divs: []
  }
);

var start_button = document.getElementById(GC.script_name() + '_' + script_name + 'Input');

start_button.addEventListener('click', function(e){
  draw_div(document.body);
});

var elements_array = [
  { id: 'abrasive' },
  { id: 'snake_poison' },
  { id: 'tiger_tusk' },
  { id: 'ice_crystal' },
  { id: 'moon_stone' },
  { id: 'fire_crystal' },
  { id: 'meteorit' },
  { id: 'witch_flower' },
  { id: 'wind_flower' },
  { id: 'fern_flower' },
  { id: 'badgrib' }
];

var market_objects = [];

//----------------------------------------------------------------------------//

function draw_div(parent){
  var div = document.createElement('div');
  div.id             = script_name + 'Div';
  div.style.position = 'fixed';
  div.style.display  = 'block';
  div.style.top      = start_button.parentNode.style.top;
  div.style.zIndex   = 100;

  var left = /(\d+)px/.exec(start_button.parentNode.style.left);
  div.style.left       = +left[1] + start_button.parentNode.clientWidth + 'px';
  div.style.width      = '300px';
  div.style.background = start_button.style.backgroundColor;

  parent.appendChild(div);

  draw_content(div);
}

//----------------------------------------------------------------------------//

function draw_content(parent){
  var table = document.createElement('table');
  table.style.width  = '100%';
  table.style.border = 'medium none';

  parent.appendChild(table);

  draw_header(table);

  elements.forEach(function(current){
    draw_row(table, current);
  });

  draw_buttons(table);
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var upd_date = JSON.parse(load_value(script_name + '_LastUpdate', '0'));
  if(upd_date)
    upd_date = new Date(Date.parse(upd_date));

  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.setAttribute('colspan', '4');
  td.id          = script_name + '_LastUpdate';
  td.textContent = 'Дата последнего обновления: ' + (upd_date ? upd_date.toLocaleString() : 'еще не считывалось');
  tr.appendChild(td);

  tr = document.createElement('tr');
  tr.setAttribute('bgColor', '#DCDCDC');
  parent.appendChild(tr);

  ['Наименование', 'Текущее значение', 'Новое значение', 'Разница' ].forEach(function(current){
    td = document.createElement('td');
    td.textContent = current;
    tr.appendChild(td);
  });
}

//----------------------------------------------------------------------------//

function draw_row(parent, object_){
  var tr = document.createElement('tr');
  tr.id = object_.id;
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.textContent = object_.name + ':';
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = object_.average_price;
  tr.appendChild(td);

  td = document.createElement('td');
  var input = document.createElement('input');
  input.type        = 'text';
  input.style.width = 40;
  input.value       = object_.average_price;
  input.onkeypress  = number_input;
  input.addEventListener('input', function(e){
    show_difference(input);
  });
  td.appendChild(input);
  tr.appendChild(td);

  td = document.createElement('td');
  var font = document.createElement('font');
  font.color = 'black';
  font.textContent = 0;
  td.appendChild(font);
  tr.appendChild(td);
}

//----------------------------------------------------------------------------//

function draw_buttons(parent){
  var tr = document.createElement('tr');
  parent.appendChild(tr);

  var td = document.createElement('td');
  td.setAttribute('align', 'right');
  td.setAttribute('colspan', '4');
  tr.appendChild(td);

  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Применить';
  button.addEventListener('click', function(e){
    save_prices();
  });
  td.appendChild(button);

  button = document.createElement('input');
  button.type = 'button';
  button.value = 'Обновить';
  button.addEventListener('click', function(e){
    load_prices();
  });
  td.appendChild(button);

  button = document.createElement('input');
  button.type = 'button';
  button.value = 'Отмена';
  button.addEventListener('click', function(e){
    remove_div();
  });
  td.appendChild(button);
}

//----------------------------------------------------------------------------//

function save_prices(){
  var errors = [];

  var div = document.getElementById(script_name + 'Div');
  var trs = div.querySelectorAll('table > tr[id]');

  for(var i = 0; i < trs.length; ++i){
    var input = trs[i].querySelector('input');
    if(isNaN(+input.value) || +input.value <= 0){
      errors.push('Цена элемента должна быть положительной');
      break;
    }
  }

  if(errors.length){
    alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
    return;
  }

  var el_prices = [];

  for(var i = 0; i < trs.length; ++i){
    var input = trs[i].querySelector('input');
    el_prices.push({ id: trs[i].id, price: input.value });
  }

  save_value('GN_CommonValues_ElementPrices', JSON.stringify(el_prices));

  reload_page();
}

//----------------------------------------------------------------------------//

function load_prices(){
  document.body.style.cursor = 'wait';

  var end = 0;
  for(var i = 0; i < elements_array.length; ++i)
    if(!elements_array[i].stop)
      send_async_get(elements_array[i]);
    else
      ++end;

  if(end < elements_array.length)
    setTimeout(load_prices, 500);
  else
  {
    var objects = filter_objects(market_objects);

    var div = document.getElementById(script_name + 'Div');
    objects.forEach(function(current){
      var tr = div.querySelector('table > tr[id="' + current.id + '"]');

      if(tr){
        var input = tr.querySelector('input');
        input.value = Math.floor(current.sum/current.count);
        show_difference(input);
      }
    });

    var upd_date = new Date();
    var td = document.getElementById(script_name + '_LastUpdate');
    td.textContent = 'Дата последнего обновления: ' + upd_date.toLocaleString();

    save_value(script_name + '_LastUpdate', JSON.stringify(upd_date));

    for(var i = 0; i < elements_array.length; ++i)
      elements_array[i].stop = false;

    market_objects = [];
    document.body.style.cursor = 'default';
  }
}

//----------------------------------------------------------------------------//

function send_async_get(obj)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/auction.php?cat=elements&sort=0&art_type=' + obj.id, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        obj.stop = true;
        var objects = parse_page(xhr.response);
        market_objects = market_objects.concat(objects);
      }
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function parse_page(response){
  var all_objects = [];

  response = response.replace(/(\n(\r)?)/g, ' ');

  var re = /.*?(<tr bgcolor='#(?:ffffff|eeeeee)' class=wb>.+?gold.png.+?show_js_button.+?<\/tr>).*?/gmi;
  var matches = [];

  while(matches = re.exec(response))
  {
    var el_re = /.+\<img.+?([^\/]+?)\.(gif|png)[^']*?'.+?gold.png.+?<td>([0-9,]+?)<\/td>.+?onclick=.+?/gmi;
    var el_matches = el_re.exec(matches[1]);

    if(!el_matches)
      show_error('Ошибка при парсинге ' + matches[1]);

    var object = {
      id:    el_matches[1],
      price: +(el_matches[3].replace(/,/g, '')),
      count: 1
    };

    var count_re = /.*<b>(\d+?) шт.<\/b>/i;
    var c_matches = count_re.exec(matches[1]);

    if(c_matches)
      object.count = +c_matches[1];

    all_objects.push(object);
  }

  return all_objects;
}

//----------------------------------------------------------------------------//

function filter_objects(objects){
  var el_objects = [];
  var step      = 1.05;
  var max_count = 45;

  objects.forEach(function(current){
    var el = get_object(current.id, el_objects);

    if(!el)
      el_objects.push({ id: current.id, max_price: current.price, sum: current.price*current.count, count: current.count });
    else{
      if(current.price >= el.max_price && current.price <= el.max_price*step)
        el.max_price = current.price;

      if(current.price <= el.max_price*step && el.count < max_count){
        el.count += current.count;
        el.sum += current.price*current.count;
      }
    }
  });

  return el_objects;
}

//----------------------------------------------------------------------------//

function show_difference(input){
  var diff = +input.parentNode.previousSibling.textContent - +input.value;

  var font = input.parentNode.nextSibling.firstChild;
  font.color = diff === 0 ? 'black' : diff > 0 ? 'green' : 'red';
  font.textContent = diff + '';
}

//----------------------------------------------------------------------------//

function get_object(id, array_){
  for(var i = 0; i < array_.length; ++i)
    if(array_[i].id == id)
      return array_[i];

  return null;
}

//----------------------------------------------------------------------------//

function remove_div(){
  var div = document.getElementById(script_name + 'Div');
  div.parentNode.removeChild(div);
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//