// ==UserScript==
// @name        GN_SortClanStorage
// @namespace   Gradient
// @description Сортировка кланового склада
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/sklad_info\.php\?id=\d+&cat=[0-36]$/
// @version     1.2.16
// @downloadURL https://update.greasyfork.org/scripts/14061/GN_SortClanStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/14061/GN_SortClanStorage.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_SortClanStorage'; // Enter your script name here

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

this.show_el = function(el, visible){
  el.style.display = visible ? '' : 'none';
};

//----------------------------------------------------------------------------//

this.reload_page = function(){
  document.location.href = document.location.href;
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
// Artefacts
//----------------------------------------------------------------------------//

this.enum_as = { // sync?
  right_arm: 0,
  left_arm:  1,
  foots:     2,
  ring:      3,
  head:      4,
  neck:      5,
  rear:      6,
  body:      7,
  backpack:  8
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

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var show_error      = SU.show_error;
var load_value      = SU.load_value;
var save_value      = SU.save_value;
var remove_value    = SU.remove_value;
var compare         = SU.compare;
var show_el         = SU.show_el;
var reload_page     = SU.reload_page;
var number_input    = SU.number_input;
var current_user_id = SU.current_id();

var CV = GN_CommonValues;
var slot_type = CV.enum_as;
slot_type.unknown  = -1;
slot_type.complect = -2;

var options = [
  { label: 'Показ только выбранных:',    id: 'OnlyChoosedChb',   title: 'Показывать только указанные внутри скрипта артефакты' },
  { label: 'Сортировка по крафту/цене:', id: 'SortByPriceChb',   title: 'Сортировать артефакты по цене, если цены одинаковы - по крафту' },
  //{ label: 'Сортировать по КПД:',        id: 'SortByOptimumChb', title: 'Сортировка по КПД, где КПД - статы и крафт артефакта' }, //NB maybe later
  { label: 'Одевать при аренде:',        id: 'DressChb',         title: 'Артефакты будут сразу одеваться на персонажа' },
  { label: 'Перезагружать страницу:',    id: 'ReloadChb',        title: 'После каждой аренды страница будет перезагружаться' },
  { label: 'Показ цен:',                 id: 'ShowPriceChb',     title: 'Показ цен на кнопках' },
  { label: 'Переаренда:',                id: 'ReRentChb',        title: 'Показ кнопки переаренды артефакта' }
];

//----------------------------------------------------------------------------//

var settings = load_settings();

var unknown_arts   = [],
    right_arm_arts = [],
    left_arm_arts  = [],
    head_arts      = [],
    body_arts      = [],
    foots_arts     = [],
    neck_arts      = [],
    rear_arts      = [],
    ring_arts      = [],
    backpack_arts  = [],
    complect_arts  = [];

var choosed = [
  'cold_sword2014'
];

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  var content = get_content_element();
  if(!content)
    return;

  var childs = content.querySelectorAll('tr[bgcolor]');
  var elements = [];

  for(var i = 0; i < childs.length; ++i)
     elements.push(childs[i]);

  elements.forEach(function(current){
    insert_converted(convert_element(current));
  });

  while(content.firstChild)
    content.removeChild(content.firstChild);

  add_new_content(content);

  draw_header(content);
  draw_undress_button(content);

  if(settings.ReRentChb)
    add_rerent_links();
}

//----------------------------------------------------------------------------//

function get_content_element(){
  var matches = /.*\?id=(\d+).*/.exec(document.location);
  var header_sign = document.querySelector('table > tbody > tr > td > a[href="sklad_info.php?id=' + matches[1] + '&cat=0"]');

  if(!header_sign)
    return null;

  var prev_table = header_sign.parentNode.parentNode.parentNode.parentNode;

  if(!prev_table)
    show_error('Не найден заголовок таблицы');

  var parent_table = prev_table.nextSibling;

  if(!parent_table)
    show_error('Не найдена таблица с содержимым(1)');

  var content = parent_table.firstChild.querySelector('table > tbody');

  if(!content)
    show_error('Не найдена таблица с содержимым(2)');

  return content;
}

//----------------------------------------------------------------------------//

function convert_element(element){
  //length = 20 - complects or 21 (artefact);
  var art_count      = 21,
      complect_count = 20;

  var childs = element.childNodes;

  if(childs.length != art_count && childs.length != complect_count)
    return null;

  var is_c = childs.length == complect_count;

  var converted = {
    id:      '',
    uids:    [],
    name:    '',
    craft:   0,
    price:   0,
    b_count: 0,
    lvl:     0,
    slot:    slot_type.unknown,
    is_c:    is_c,
    node:    null,
    form: {
      depository: 0,
      sign:       '',
      category:   0,
      inv_id:     0,
      set_id:     0
    }
  };

  var re = /uid=(\d+?)&/gmi;
  var matches = [];

  while(matches = re.exec(childs[0].innerHTML)){
    var uid = matches[1];

    if(converted.uids.indexOf(uid) == -1)
      converted.uids.push(uid);
  }

  if(!is_c)
  {
    matches = /.+?art_info\.php\?id=([^&"]*)/.exec(childs[0].innerHTML);
    converted.id = matches[1];

    matches = /.+>'(.+)'.+/.exec(childs[1].innerHTML);
    converted.name = matches[1];

    matches = /.+\[(.+)]/.exec(converted.name);

    if(matches)
      converted.craft = craft_to_int(matches[1]);
  }

  matches = />(\d+)</.exec(childs[is_c ? 16 : 17].innerHTML);
  converted.price = +matches[1];

  matches = /.*(<option\svalue="(\d+)">).*/.exec(childs[is_c ? 17 : 18].innerHTML);
  converted.b_count = +matches[2];

  if(!is_c)
  {
    var abstract = CV.get_artefact(converted.id);

    if(abstract)
    {
      converted.lvl  = abstract.lvl;
      converted.slot = abstract.slot;
    }
  }
  else
    converted.slot = slot_type.complect;

  converted.form.depository = childs[is_c ? 4 : 5].value;
  converted.form.sign       = childs[is_c ? 6 : 7].value;
  converted.form.category   = childs[is_c ? 8 : 9].value;
  converted.form.inv_id     = childs[is_c ? 12 : 13].value;
  converted.form.set_id     = childs[is_c ? 14 : 15].value;

  if(!converted.uids.length)
    converted.uids.push(converted.form.inv_id);

  convert_node(element, converted);

  return converted;
}

//----------------------------------------------------------------------------//

function craft_to_int(mod){
  var count = 0;

  ['A', 'D', 'E', 'F', 'I', 'N', 'W'].forEach(function(current){
    var result = new RegExp(current + '(\\d+)').exec(mod);
    count += result ? +result[1] : 0;
  });

  return count;
}

//----------------------------------------------------------------------------//

function convert_node(element, converted){
  //appendChild - live operation
  var tr = document.createElement('tr');

  tr.appendChild(element.firstChild); //img
  if(!converted.is_c)
    tr.appendChild(element.firstChild); //name
  tr.appendChild(element.childNodes[15]); //price

  var b_count = converted.b_count;
  tr.appendChild(b_count >= 1 ? create_button(1, converted) : create_empty_td());
  tr.appendChild(b_count >= 2 ? create_button(2, converted) : create_empty_td());
  tr.appendChild(b_count >= 3 ? create_button(3, converted) : create_empty_td());

  var select = create_select(b_count, converted.form.inv_id, converted.slot);

  tr.appendChild(select ? select : create_empty_td());
  tr.appendChild(select ? create_button(4, converted) : create_empty_td());

  converted.node = tr;
}

//----------------------------------------------------------------------------//

function create_button(b_count, converted){
  var td = document.createElement('td');
  td.align = 'center';

  var button = document.createElement('button');
  button.textContent = 'На ' + b_count + (settings.ShowPriceChb ? '[' + Math.floor(+converted.price*1.01)*b_count + ']' : '');
  button.addEventListener('click', function(e){
    e.preventDefault();
    var form = converted.form;
    var url = 'sklad_info.php?id=' + form.depository +
              '&sign=' + form.sign +
              '&cat=' + form.category +
              '&action=rent&inv_id=' + form.inv_id +
              '&set_id=' + form.set_id +
              '&bcnt' + form.inv_id + '=' + b_count;

    settings.DressChb ? dress_artefact(url, converted) : send_async_get(url);
  });

  td.appendChild(button);

  return td;
}

//----------------------------------------------------------------------------//

function create_empty_td(){
  var td = document.createElement('td');
  td.align       = 'center';
  td.textContent = '';

  return td;
}

//----------------------------------------------------------------------------//

function create_select(b_count, inv_id, slot){
  if(b_count < 4)
    return null;

  var td = document.createElement('td');
  td.align = 'center';

  var select = document.createElement('select');
  select.setAttribute('inv_id', inv_id);
  select.setAttribute('slot', slot);

  for(var i = 4, e = b_count; i <= e; ++i)
  {
    var option = document.createElement('option');
    option.value       = i;
    option.textContent = i;

    select.appendChild(option);
  }

  select.addEventListener('change', function(e){
    e.preventDefault();

    var select = e.target;

    var array_ = find_array_by_type(+select.getAttribute('slot'));

    if(!array_){
      alert('Внутренняя ошибка, обратитесь к разработчику [select handler1]');
      return;
    }

    var converted = find_converted(array_, +select.getAttribute('inv_id'));

    if(!converted){
      alert('Внутренняя ошибка, обратитесь к разработчику [select handler2]');
      return;
    }

    var btn = select.parentNode.nextSibling.firstChild;
    var new_btn = create_button(select.options[select.selectedIndex].value, converted);

    btn.parentNode.replaceChild(new_btn, btn);
  });

  td.appendChild(select);

  return td;
}

//----------------------------------------------------------------------------//

function insert_converted(object_){
  if(!object_)
    return;

  if(object_.is_c)
    complect_arts.push(object_);
  else
    find_array_by_type(object_.slot).push(object_);
}

//----------------------------------------------------------------------------//

function find_array_by_type(slot){
  switch(slot)
  {
    case slot_type.unknown:
      return unknown_arts;

    case slot_type.complect:
      return complect_arts;

    case slot_type.right_arm:
      return right_arm_arts;

    case slot_type.ring:
      return ring_arts;

    case slot_type.head:
      return head_arts;

    case slot_type.body:
      return body_arts;

    case slot_type.foots:
      return foots_arts;

    case slot_type.neck:
      return neck_arts;

    case slot_type.rear:
      return rear_arts;

    case slot_type.left_arm:
      return left_arm_arts;

    case slot_type.backpack:
      return backpack_arts;
  }

  return null;
}

//----------------------------------------------------------------------------//

function sort_all(){
  sort_artefacts(right_arm_arts);
  sort_artefacts(ring_arts);
  sort_artefacts(head_arts);
  sort_artefacts(body_arts);
  sort_artefacts(foots_arts);
  sort_artefacts(neck_arts);
  sort_artefacts(rear_arts);
  sort_artefacts(left_arm_arts);
  sort_artefacts(backpack_arts);
  sort_artefacts(unknown_arts);

  sort_artefacts(complect_arts);
}

//----------------------------------------------------------------------------//

function sort_artefacts(array_){
  array_.sort(function(a, b){
    if(a.price == b.price){
      if(a.craft == b.craft){
        if(a.lvl == b.lvl)
          return compare(b.b_count, a.b_count);

        return compare(b.lvl, a.lvl);
      }

      return compare(b.craft, a.craft);
    }

    return compare(a.price, b.price);
  });
}

//----------------------------------------------------------------------------//

function add_new_content(content){
  if(settings.SortByPriceChb)
    sort_all();

  var counter = { val: 0 };

  add_array_content(content, unknown_arts,   slot_type.unknown,   'Неизвестные артефакты', counter);
  add_array_content(content, right_arm_arts, slot_type.right_arm, 'В правую руку',         counter);
  add_array_content(content, ring_arts,      slot_type.ring,      'Кольца',                counter);
  add_array_content(content, head_arts,      slot_type.head,      'Головные уборы',        counter);
  add_array_content(content, body_arts,      slot_type.body,      'Броня/одежда',          counter);
  add_array_content(content, foots_arts,     slot_type.foots,     'Обувь',                 counter);
  add_array_content(content, neck_arts,      slot_type.neck,      'Ожерелья/амулеты',      counter);
  add_array_content(content, rear_arts,      slot_type.rear,      'Оружие на спину/плащи', counter);
  add_array_content(content, left_arm_arts,  slot_type.left_arm,  'В левую руку',          counter);
  add_array_content(content, backpack_arts,  slot_type.backpack,  'В рюкзак',              counter);

  add_array_content(content, complect_arts,  slot_type.complect,  'Комплекты',             counter);
}

//----------------------------------------------------------------------------//

function add_array_content(content, array_, type, caption, counter){
  if(settings.OnlyChoosedChb){
    array_ = array_.filter(function(current){
      if(!current.id)
        return true;

      return choosed.indexOf(current.id) != -1;
    });
  }

  if(!array_.length)
    return;

  var e_color = '#eeeeee';
  var f_color = '#ffffff';

  //caption
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.class = 'wblight';
  td.align = 'center';

  var is_expanded = load_value(script_name + 'SlotExpand' + type, 'false') == 'true';

  var b = document.createElement('b');
  var a = document.createElement('a');
  a.textContent = caption + '[' + array_.length + ']';
  a.href                 = "#";
  a.style.textDecoration = 'none';
  a.setAttribute('expand', is_expanded ? 'true' : 'false');
  a.addEventListener('click', function(e){
    e.preventDefault();

    var expand = e.target.getAttribute('expand') == 'true';

    show_content_table(e.target, !expand);

    e.target.setAttribute('expand', expand ? 'false' : 'true');
    save_value(script_name + 'SlotExpand' + type, expand ? 'false' : 'true');
  });

  tr.appendChild(td);
  td.appendChild(b);
  b.appendChild(a);
  content.appendChild(tr);
  //end caption

  //content
  tr = document.createElement('tr');
  td = document.createElement('td');

  var table = document.createElement('table');
  table.width="100%";

  for(var i = 0; i < array_.length; ++i){
    array_[i].node.bgColor = (counter.val % 2 === 0) ? e_color : f_color;
    table.appendChild(array_[i].node);
    ++counter.val;
  }

  td.appendChild(table);
  tr.appendChild(td);
  content.appendChild(tr);
  //end content

  show_content_table(a, is_expanded);
}

//----------------------------------------------------------------------------//

function show_content_table(element, visible){
  var tr = element.parentNode.parentNode.parentNode;
  var next = tr.nextSibling;
  show_el(next, visible);
}

//----------------------------------------------------------------------------//

function find_converted(array_, inv_id){
  for(var i = 0, size = array_.length; i < size; ++i)
    if(inv_id == array_[i].form.inv_id)
      return array_[i];

  return null;
}

//----------------------------------------------------------------------------//

function send_async_get(url){
  document.body.style.cursor = 'wait';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      document.body.style.cursor = 'default';
      if(settings.ReloadChb)
        reload_page();
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function dress_artefact(url, object_){
  document.body.style.cursor = 'wait';

  var counter = { counter: object_.uids.length };

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200)
      send_dress_async_get('/inventory.php?dress=' + object_.uids[counter.counter - 1] + '&js=1&rand=' + Math.random()*1000000, object_, counter);
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function send_dress_async_get(url, object_, counter){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      --counter.counter;

      if(counter.counter)
        send_dress_async_get('/inventory.php?dress=' + object_.uids[counter.counter - 1] + '&js=1&rand=' + Math.random()*1000000, object_, counter);
      else{
        document.body.style.cursor = 'default';
        if(settings.ReloadChb)
          reload_page();
      }
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function draw_header(parent){
  var header = document.createElement('tr');
  parent.insertBefore(header, parent.firstChild);

  var td = document.createElement('td');
  td.setAttribute('colspan', '6');
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

  var text = document.createTextNode('UIN игрока: ');
  td.appendChild(text);

  var sign = document.createElement('input');
  sign.id          = script_name + 'SignInput';
  sign.type        = 'text';
  sign.style.width = 250;
  sign.value       = settings.CurrentSignInput;
  sign.title       = 'UIN игрока - уникальный номер вашего персонажа, состоит из 32 символов.\n' +
                     'Необходим для формирования ссылки на переаренду артефакта.\n' +
                     'Узнать его можно в магазине из ссылки "Купить" для любого артефакта.\n' +
                     'Например: ' + document.location.origin + '/shop.php?b=wood_sword&cat=weapon&sign=<...>, где оставшиеся символы - это нужный UIN';

  td.appendChild(sign);

  text = document.createTextNode('  Кол-во боев для переаренды: ');
  td.appendChild(text);

  var bcount = document.createElement('input');
  bcount.id          = script_name + 'ReRentBattleCountInput';
  bcount.type        = 'text';
  bcount.style.width = 30;
  bcount.value       = settings.ReRentBattleCount;
  bcount.onkeypress  = number_input;

  td.appendChild(bcount);

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
  });
  td.appendChild(saver);

  show_el(settings_table, is_expanded);
}

//----------------------------------------------------------------------------//

function draw_undress_button(content){
  var table = content.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling;

  if(table.firstChild.childNodes.length < 4)
    return;

  var your_rent = table.firstChild.childNodes[2];

  var a = document.createElement('a');
  a.href        = '';
  a.textContent = '(вернуть все)';

  your_rent.firstChild.appendChild(a);
  a.addEventListener('click', function(e){
    e.preventDefault();

    document.body.style.cursor = 'wait';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/inventory.php?all_off=100', true);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200)
        send_storage_async_get(document.location);
    };

    xhr.send(null);
  });
}

//----------------------------------------------------------------------------//

function send_storage_async_get(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var response = xhr.response;

      var re = /<a href="(inventory\.php\?art_return=.+?)">/gmi;
      var matches = [],
          links   = [];

      while(matches = re.exec(response))
        links.push(matches[1]);

      var counter = { counter: links.length };

      if(counter.counter)
        send_return_async_get(links[counter.counter - 1], links, counter);
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function send_return_async_get(url, array_, counter){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      --counter.counter;

      if(counter.counter)
        send_return_async_get(array_[counter.counter - 1], array_, counter);
      else{
        document.body.style.cursor = 'default';
        if(settings.ReloadChb)
          reload_page();
      }
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function add_rerent_links(){
  if(!settings.CurrentSignInput){
    alert('Невозможно сформировать ссылки для переаренды, укажите UIN игрока');
    return;
  }

  var return_links = document.querySelectorAll('a[href*="inventory.php?art_return"]');

  var bcount = settings.ReRentBattleCount;
  var cases  = [ 2, 0, 1, 1, 1, 2 ];
  var words  = [ 'бой', 'боя', 'боев'];
  var bstr   = words[ (bcount % 100 > 4 && bcount % 100 < 20) ? 2 : cases[ (bcount % 10 < 5) ? bcount % 10 : 5] ];

  for(var i = 0; i < return_links.length; ++i)
  {
    var return_link = return_links[i].href;
    var rerent_obj  = convert_into_rerent(return_link);

    var parent = return_links[i].parentNode;
    parent.appendChild(document.createElement('br'));

    var a = document.createElement('a');
    a.onclick = function(scope_return_link, scope_rerent_obj){
      return function() { rerent_artefact(scope_return_link, scope_rerent_obj); }
    }(return_link, rerent_obj);
    parent.appendChild(a);

    var font = document.createElement('font');
    font.style.fontSize = '9px';
    font.textContent = 'Переаренда на ' + bcount + ' ' + bstr;
    a.appendChild(font);
  }
}

//----------------------------------------------------------------------------//

function convert_into_rerent(return_link){
  var re = /.+inventory\.php\?art_return=(\d+)&art=.+?&to=.+?&from_sklad=(\d+)&sklad_cat=([^&+])?&sklad_set=(\d+)/;
  var matches = re.exec(return_link);

  return {
    link:
    'sklad_info.php?id=' + matches[2] +
    '&sign=' + settings.CurrentSignInput +
    '&cat=' + matches[3] +
    '&action=rent&inv_id=' + matches[1] +
    '&set_id=' + matches[4] +
    '&bcnt' + matches[1] + '=' + settings.ReRentBattleCount,
    uid: matches[1]
  };
}

//----------------------------------------------------------------------------//

function rerent_artefact(return_link, rerent_obj){
  document.body.style.cursor = 'wait';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', return_link, true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = { uids: [rerent_obj.uid] };

      settings.DressChb ? dress_artefact(rerent_obj.link, obj) : send_async_get(rerent_obj.link);
    }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function load_settings(){
  var settings_ = load_value(script_name + 'Settings');

  if(settings_ == 'undefined'){ // error at 1.2.4 - 1.2.8
    remove_value(script_name + 'Settings');
    settings_ = null;
  }

  if(settings_){
    settings_ = JSON.parse(settings_);

    if(!settings_.CurrentUser){
      settings_.CurrentUser       = current_user_id;
      settings_.CurrentSignInput  = '';
      settings_.UINPairs          = [ { id: current_user_id, uin: ''} ];
      settings_.ReRentBattleCount = 1;

      alert('В скрипте сортировки склада появился параметр "UIN игрока".\n' +
            'Если вы хотите использовать переаренду артефактов, необходимо указать его в настройках.\n' +
            'Подробнее во всплывающей подсказке поля ввода');

      save_value(script_name + 'Settings', JSON.stringify(settings_));
    }

    if(settings_.CurrentUser != current_user_id){
      var uin = get_uin(settings_, current_user_id);
      settings_.CurrentSignInput = uin;

      if(!uin)
        alert('В прошлый раз вы заходили другим персонажем, параметр "UIN игрока" для этого персонажа требуется ввести заново');
    }

    return settings_;
  }

  settings_ = {
    CurrentSignInput:  '',
    CurrentUser:       current_user_id,
    UINPairs:          [ { id: current_user_id, uin: ''} ],
    ReRentBattleCount: 1
  };

  options.forEach(function(current){
    settings_[current.id] = false;
  });

  return settings_;
}

//----------------------------------------------------------------------------//

function save_settings(){
  var errors = [];

  var sign = document.getElementById(script_name + 'SignInput').value;

  if(!sign.trim().length)
    errors.push('Не указан UIN игрока');

  var bcount = +document.getElementById(script_name + 'ReRentBattleCountInput').value;

  if(isNaN(bcount) || bcount < 1 || bcount > 20)
    errors.push('Количество боев для переаренды артефакта должно лежать между 1 и 20');

  if(errors.length){
    alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
    return;
  }

  settings.CurrentSignInput  = sign;
  settings.CurrentUser       = current_user_id;
  settings.ReRentBattleCount = bcount;

  var uin = get_uin(settings, settings.CurrentUser);
  if(!uin)
    settings.UINPairs.push( { id: settings.CurrentUser, uin: settings.CurrentSignInput } );

  options.forEach(function(current){
    var chb = document.getElementById(script_name + current.id);
    settings[current.id] = chb.checked;
  });

  save_value(script_name + 'Settings', JSON.stringify(settings));

  reload_page();
}

//----------------------------------------------------------------------------//

function get_uin(array_, id){
  var uin = '';

  array_.UINPairs.forEach(function(current){
    if(current.id == id)
      uin = current.uin;
  });

  return uin;
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//