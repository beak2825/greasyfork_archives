// ==UserScript==
// @name        GN_TradeHelper
// @namespace   Gradient
// @description Помощник для выставления лотов/скрытия ненужных
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/auction_new_lot\.php/
// @version     1.0.7
// @downloadURL https://update.greasyfork.org/scripts/23683/GN_TradeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/23683/GN_TradeHelper.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_TradeHelper'; // Enter your script name here

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

// market categories
this.enum_amc = { // sync?
  no_sell:  0,
  helm:     1,
  necklace: 2,
  cuirass:  3,
  cloack:   4,
  weapon:   5,
  shield:   6,
  boots:    7,
  ring:     8,
  other:    9,
  thief:    10,
  tactic:   11,
  verb:     12,
  medals:   13,
  relict:   14,
  backpack: 15
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
// Basic resources
//----------------------------------------------------------------------------//

this.basic_resources = JSON.parse(SU.load_value('GN_CommonValues_BasicResources', '[]'));

//----------------------------------------------------------------------------//

this.get_basic_resource = function(id){
  for(var i = 0; i < this.basic_resources.length; ++i)
    if(this.basic_resources[i].id == id)
      return this.basic_resources[i];

  return null;
};

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var show_error   = SU.show_error;
var compare      = SU.compare;
var load_value   = SU.load_value;
var save_value   = SU.save_value;
var number_input = SU.number_input;

var CV = GN_CommonValues;
var enum_amc = CV.enum_amc;
var enum_ot = {
  any:  0,
  res:  1,
  el :  2,
  art:  3,
  cert: 4,
  part: 5
};

var all_options = []; // { value, name, hide, type }
var showed_lots = 4;
var settings = load_settings();

//----------------------------------------------------------------------------//

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  if(document.querySelector('select[name="itemfake"]')) // confirm trade mode
     return;

  var header_sign = document.querySelector('select[name="item"]');

  if(!header_sign)
    show_error('Не найден элемент привязки для таблицы настроек');

  fill_all_options(header_sign);
  draw_elements(header_sign);
  extend_standard_elements(header_sign);
  set_settings();
  set_options();
}

//----------------------------------------------------------------------------//

function fill_all_options(select){
  for(var i = 0; i < select.options.length; ++i){
    var option = select.options[i];

    if(!option.value)
      continue;

    var el_re   = /^EL_\d+$/;
    var art_re  = /^.+@\d+$/;
    var cert_re = /^CERT_(\d+)$/;
    var part_re = /^ARTPART_(.+)$/;

    if(el_re.exec(option.value)){
      all_options.push({value: option.value, name: option.textContent, hide: false, type: enum_ot.el});
      continue;
    }

    if(art_re.exec(option.value)){
      all_options.push({value: option.value, name: option.textContent, hide: false, type: enum_ot.art});
      continue;
    }

    var matches = [];
    if(matches = cert_re.exec(option.value)){
      var append_zero = +matches[1] < 10;
      all_options.push({value: append_zero ? 'CERT_0' + matches[1] : option.value, name: option.textContent, hide: false, type: enum_ot.cert});
      continue;
    }

    var basic_resource = CV.get_basic_resource(option.value);

    if(basic_resource){
      all_options.push({value: option.value, name: option.textContent, hide: false, type: enum_ot.res});
      continue;
    }

    if(part_re.exec(option.value)){
      all_options.push({value: option.value, name: option.textContent, hide: false, type: enum_ot.part});
      continue;
    }

    all_options.push({value: option.value, name: option.textContent, hide: false, type: enum_ot.any});
  }
}

//----------------------------------------------------------------------------//

function set_options(){
  var sell_select = document.querySelector('select[name="item"]');
  var hide_select = document.getElementById(script_name + 'HidedSelect');

  var sell_options = all_options.filter(function(current){
    return !current.hide;
  });

  var hide_options = all_options.filter(function(current){
    return current.hide;
  });

  insert_options(sell_select, sell_options);
  insert_options(hide_select, hide_options);

  set_selected_item(sell_select);
  set_selected_item(hide_select);
}

//----------------------------------------------------------------------------//

function insert_options(select, options){
  while(select.firstChild)
    select.removeChild(select.firstChild);

  select.appendChild(new_option({ value: '', name: ''}));

  if(!options.length)
    return;

  if(options.length == 1){
    select.appendChild(new_option(options[0]));
    return;
  }

  for(var i = 0; i < options.length - 1; ++i){
    var curr_option = options[i];
    var next_option = options[i + 1];

    select.appendChild(new_option(curr_option));

    if(curr_option.type != next_option.type)
      select.appendChild(line_option());

    if(i + 1 == options.length - 1)
      select.appendChild(new_option(next_option));
  }
}

//----------------------------------------------------------------------------//

function new_option(obj){
  var option = document.createElement('option');
  option.setAttribute('value', obj.value);
  option.appendChild(document.createTextNode(obj.name));

  return option;
}

//----------------------------------------------------------------------------//

function line_option(){
  var line_option = document.createElement('option');
  line_option.setAttribute('value', '');
  line_option.appendChild(document.createTextNode('----------'));

  return line_option;
}

//----------------------------------------------------------------------------//

function get_option(value){
  for(var i = 0; i < all_options.length; ++i)
    if(all_options[i].value == value)
      return all_options[i];

  return null;
}

//----------------------------------------------------------------------------//

function set_selected_item(select){
  if(select.options.length)
    select.selectedIndex = 0;

  remove_table();

  var count = document.querySelector('input[name="count"]');
  count.value = 0;

  var price_el = document.querySelector('input[name="price"]');
  price_el.value = 0;
}

//----------------------------------------------------------------------------//

function draw_elements(prev_sibling){
  var parent = prev_sibling.parentNode;

  var select = document.createElement('select');
  select.id          = script_name + 'HidedSelect';
  select.style.width = prev_sibling.offsetWidth;
  select.title       = 'Скрытые с продажи лоты, выбираются через ПКМ в выставляемых на продажу';

  parent.insertBefore(document.createElement('br'), select.nextSibling);
  parent.insertBefore(select, prev_sibling.nextSibling);
  parent.insertBefore(document.createElement('br'), prev_sibling.nextSibling);
  parent.insertBefore(document.createTextNode('Скрыть с продажи:'), prev_sibling.nextSibling);
  parent.insertBefore(document.createElement('br'), prev_sibling.nextSibling);
  parent.insertBefore(document.createElement('br'), prev_sibling.nextSibling);

  var chb = document.createElement('input');
  chb.type  = 'checkbox';
  chb.title = 'Режим показа/скрытия артефактов';
  chb.id    = script_name + 'SHChb';

  var label = document.createElement('label');
  label.for = script_name + 'SHChb';
  label.appendChild(document.createTextNode('Включить режим показа/скрытия артефактов'));

  parent.insertBefore(document.createElement('br'), parent.firstChild);
  parent.insertBefore(document.createElement('br'), parent.firstChild);
  parent.insertBefore(label, parent.firstChild);
  parent.insertBefore(chb, parent.firstChild);
}

//----------------------------------------------------------------------------//

function extend_standard_elements(anchor){
  var parent = anchor.parentNode;
  var inputs = parent.querySelectorAll('input');

  for(var i = 0; i < inputs.length; ++i){
    inputs[i].onkeypress = number_input;
    inputs[i].addEventListener('change', function(e){
      save_settings();
    });
  }

  var select = document.querySelector('select[name="atype"]');
  select.addEventListener('change', function(e){
    save_settings();
  });

  select = document.querySelector('select[name="duration"]');
  select.addEventListener('change', function(e){
    save_settings();
  });

  anchor.addEventListener('change', function(e){
    e.preventDefault();

    var option = this.options[this.selectedIndex];
    var change_visibility_checked = document.getElementById(script_name + 'SHChb').checked;

    if(change_visibility_checked){
      change_option_visibility(option);
      return false;
    }
    else
      return buy_by_option(option);
  });

  select = document.getElementById(script_name + 'HidedSelect');
  select.addEventListener('change', function(e){
    e.preventDefault();

    var option = this.options[this.selectedIndex];
    var change_visibility_checked = document.getElementById(script_name + 'SHChb').checked;

    if(change_visibility_checked){
      change_option_visibility(option);
      return false;
    }
    else
      return buy_by_option(option);
  });
}

//----------------------------------------------------------------------------//

function change_option_visibility(option){
  if(!option.value)
    return;

  var obj = get_option(option.value);
  var now_hided = obj.hide;

  if(!confirm('Переместить "' + option.textContent + '" в ' + (now_hided ? 'показываемые' : 'скрываемые') + '?'))
    return;

  obj.hide = !obj.hide;

  set_options();

  if(now_hided)
    settings.hided = settings.hided.filter(value => value !== option.value);

  save_settings();
}

//----------------------------------------------------------------------------//

function buy_by_option(option){
  if(!option.value)
    return false;

  var obj = get_option(option.value);

  if(obj.type == enum_ot.any){
    alert('Неизвестный тип предмета, обратитесь к разработчику');
    return false;
  }

  if(obj.type == enum_ot.art && !CV.get_artefact(/([^@]+)@\d+/.exec(obj.value)[1])){
    alert('Неизвестный артефакт, обратитесь к разработчику');
    return false;
  }

  get_obj_prices(obj);
  return true;
}

//----------------------------------------------------------------------------//

function get_obj_prices(obj){
  document.body.style.cursor = 'wait';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', compose_url(obj), true);
  xhr.overrideMimeType('text/plain; charset=windows-1251');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4)
      if(xhr.status == 200){
        var objects = parse_page(xhr.response, obj.type);

        if(!objects.length)
          remove_table();
        else{
          draw_lot_table(objects, obj.type);
          set_form_values(objects, obj);
        }

        document.body.style.cursor = 'default';
      }
  };

  xhr.send(null);
}

//----------------------------------------------------------------------------//

function compose_url(obj){
  var base = '/auction.php?';

  switch(obj.type){
    case enum_ot.res:
      return base + compose_res_url(obj);

    case enum_ot.el:
      return base + compose_el_url(obj);

    case enum_ot.art:
      return base + compose_art_url(obj);

    case enum_ot.cert:
      return base + compose_cert_url(obj);

    case enum_ot.part:
      return base + compose_part_url(obj);
  }

  throw 'Logic error: compose_url switch';
}

//----------------------------------------------------------------------------//

function compose_res_url(obj){
  var basic_resource = CV.get_basic_resource(obj.value);
  return ['cat=res', 'sort=4', 'type=' + basic_resource.market_type, 'art_type=', 'sbn=1', 'sau=0', 'snew=0'].join('&');
}

//----------------------------------------------------------------------------//

function compose_el_url(obj){
  var elements_accordance = {
    'EL_42' : 'abrasive',
    'EL_43' : 'snake_poison',
    'EL_46' : 'tiger_tusk',
    'EL_44' : 'ice_crystal',
    'EL_45' : 'moon_stone',
    'EL_40' : 'fire_crystal',
    'EL_37' : 'meteorit',
    'EL_41' : 'witch_flower',
    'EL_39' : 'wind_flower',
    'EL_78' : 'fern_flower',
    'EL_38' : 'badgrib'
  };

  return ['cat=elements', 'sort=4', 'type=0', 'art_type=' + elements_accordance[obj.value], 'sbn=1', 'sau=0', 'snew=0'].join('&');
}

//----------------------------------------------------------------------------//

function compose_art_url(obj){
  var cat = function(id){
    switch(id){
      case enum_amc.helm:     return 'helm';
      case enum_amc.necklace: return 'necklace';
      case enum_amc.cuirass:  return 'cuirass';
      case enum_amc.cloack:   return 'cloack';
      case enum_amc.weapon:   return 'weapon';
      case enum_amc.shield:   return 'shield';
      case enum_amc.boots:    return 'boots';
      case enum_amc.ring:     return 'ring';
      case enum_amc.other:    return 'other';
      case enum_amc.thief:    return 'thief';
      case enum_amc.tactic:   return 'tactic';
      case enum_amc.verb:     return 'verb';
      case enum_amc.medals:   return 'medals';
      case enum_amc.relict:   return 'relict';
      case enum_amc.backpack: return 'backpack';
    }

    throw 'Logic error: compose_art_url switch';
  };

  var artefact = CV.get_artefact(/([^@]+)@\d+/.exec(obj.value)[1]);
  return ['cat=' + cat(artefact.market_cat), 'sort=4', 'type=0', 'art_type=' + artefact.id, 'sbn=1', 'sau=0', 'snew=0'].join('&');
}

//----------------------------------------------------------------------------//

function compose_cert_url(obj){
  var num = /CERT_(\d+)/.exec(obj.value)[1];
  return ['cat=cert', 'sort=4', 'type=0', 'art_type=sec_' + num, 'sbn=1', 'sau=0', 'snew=0'].join('&');
}

//----------------------------------------------------------------------------//

function compose_part_url(obj){
  var part = /ARTPART_(.+)/.exec(obj.value)[1];
  return ['cat=part', 'sort=4', 'type=0', 'art_type=part_' + part, 'sbn=1', 'sau=0', 'snew=0'].join('&');
}

//----------------------------------------------------------------------------//

function parse_page(response, type){
  var objects = get_raw_objects(response);

  switch(type){
    case enum_ot.res:
      return get_res_el_objects(objects);

    case enum_ot.el:
      return get_res_el_objects(objects);

    case enum_ot.art:
      return get_art_objects(objects);

    case enum_ot.cert:
      return get_cert_part_objects(objects);

    case enum_ot.part:
      return get_cert_part_objects(objects);
  }

  throw 'Logic error: parse_page switch';
}

//----------------------------------------------------------------------------//

function get_raw_objects(response){
  var objects = [];

  response = response.replace(/(\n(\r)?)/g, ' ');
  if(response.indexOf('Купить сразу!') == -1)
  {
    alert('Таких предметов на рынке не найдено');
    return objects;
  }

  var re = /.*?(<tr bgcolor='#(?:ffffff|eeeeee)' class=wb>.+?gold.png.+?show_js_button.+?<\/tr>).*?/gmi;
  var matches = [];

  while(matches = re.exec(response))
    objects.push(matches[1]);

  return objects;
}

//----------------------------------------------------------------------------//

function get_res_el_objects(objects){
  var cleared_objects = [];

  objects.forEach(function(current){
    var re = /.+?auction_lot_protocol\.php\?id=\d+.+?(\d+) шт\.<\/b>.+?Купить сразу!.+?<.+?gold\.png.+?<td>([0-9,]+?)<\/td>.+?<td>([^>]+?мин. )<\/td>.+?pl_info\.php\?id=(\d+).><b>(.+?)<\/b>.+?onclick="javascript: show_js_button.+?return false;".+?/gmi;
    var matches = re.exec(current);

    if(matches)
      cleared_objects.push({
        count:    +matches[1],
        price:    +(matches[2].replace(/,/g, '')),
        duration: matches[3],
        pl_id:    +matches[4],
        nick:     matches[5]
      });
  });

  return cleared_objects;
}

//----------------------------------------------------------------------------//

function get_art_objects(objects){
  var cleared_objects = [];

  objects.forEach(function(current){
    var re = /.+?auction_lot_protocol\.php\?id=\d+.+?<br>Прочность: (?:<font color=red><b>(\d+?)<\/b><\/font>|(\d+?))\/(?:<font color=red><b>(\d+?)<\/b><\/font>|(\d+?))<.+?Купить сразу!.+?<.+?gold\.png.+?<td>([0-9,]+?)<\/td>.+?<td>([^>]+?мин. )<\/td>.+?pl_info\.php\?id=(\d+).><b>(.+?)<\/b>.+?onclick="javascript: show_js_button.+?return false;".+?/gmi;
    var matches = re.exec(current);

    if(matches){
      var obj = {
        cur_dur:  matches[1] ? +matches[1] : +matches[2],
        max_dur:  matches[3] ? +matches[3] : +matches[4],
        price:    +(matches[5].replace(/,/g, '')),
        duration: matches[6],
        pl_id:    +matches[7],
        nick:     matches[8]
      };

      obj.ppb = +(obj.price/obj.cur_dur).toFixed(2);

      var count_re = /.*<b>(\d+?) шт.<\/b>/i;
      var c_matches = count_re.exec(current);
      obj.count = c_matches ? +c_matches[1] : 1;

      cleared_objects.push(obj);
    }
  });

  return cleared_objects;
}

//----------------------------------------------------------------------------//

function get_cert_part_objects(objects){
  var cleared_objects = [];
  objects.forEach(function(current){
    var re = /.+?auction_lot_protocol\.php\?id=\d+.+?Купить сразу!.+?<.+?gold\.png.+?<td>([0-9,]+?)<\/td>.+?<td>([^>]+?мин. )<\/td>.+?pl_info\.php\?id=(\d+).><b>(.+?)<\/b>.+?onclick="javascript: show_js_button.+?return false;".+?/gmi;
    var matches = re.exec(current);

    if(matches)
      cleared_objects.push({
        price:    +(matches[1].replace(/,/g, '')),
        duration: matches[2],
        pl_id:    +matches[3],
        nick:     matches[4]
      });
  });

  return cleared_objects;
}

//----------------------------------------------------------------------------//

function draw_lot_table(objects, type){
  switch(type){
    case enum_ot.res:
    case enum_ot.el:
      draw_res_el_lot_table(objects);
      break;

    case enum_ot.art:
      draw_art_lot_table(objects);
      break;

    case enum_ot.cert:
    case enum_ot.part:
      draw_cert_part_lot_table(objects);
      break;

    default:
      throw 'Logic error: draw_lot_table switch';
  }
}

//----------------------------------------------------------------------------//

function draw_res_el_lot_table(objects){
  objects.sort(function(a, b){
    return compare(a.price, b.price);
  });

  var table = recreate_table('4');

  draw_row(table, ['Цена', 'Кол-во', 'Время', 'Владелец']);

  for(var i = 0; i < objects.length && i < showed_lots; ++i)
    draw_row(table, [objects[i].price, objects[i].count, objects[i].duration, objects[i].nick]);

  var parent = table.parentNode;
  parent.insertBefore(document.createElement('br'), parent.firstChild);
  parent.insertBefore(table, parent.firstChild);
}

//----------------------------------------------------------------------------//

function draw_art_lot_table(objects){
  objects.sort(function(a, b){
    return compare(a.ppb, b.ppb);
  });

  var select = document.querySelector('select[name="item"]');
  var option = select.options[select.selectedIndex];

  var artefact = CV.get_artefact(/(.+)@.+/.exec(option.value)[1]);
  var has_ppb = !!artefact.ppb;

  var table = recreate_table('6');

  draw_row(table, ['Стоимость за бой', 'Цена', 'Прочность', 'Кол-во', 'Время', 'Владелец']);

  for(var i = 0; i < objects.length && i < showed_lots; ++i){
    var ppb = has_ppb ? objects[i].ppb + '[' + (objects[i].ppb - artefact.ppb).toFixed(2) + ']' : objects[i].ppb;
    draw_row(table, [ppb, objects[i].price, objects[i].cur_dur + '/' + objects[i].max_dur, objects[i].count, objects[i].duration, objects[i].nick]);
  }

  var parent = table.parentNode;
  parent.insertBefore(document.createElement('br'), parent.firstChild);
  parent.insertBefore(table, parent.firstChild);
}

//----------------------------------------------------------------------------//

function draw_cert_part_lot_table(objects){
  objects.sort(function(a, b){
    return compare(a.price, b.price);
  });

  var table = recreate_table('3');

  draw_row(table, ['Цена', 'Время', 'Владелец']);

  for(var i = 0; i < objects.length && i < showed_lots; ++i)
    draw_row(table, [objects[i].price, objects[i].duration, objects[i].nick]);

  var parent = table.parentNode;
  parent.insertBefore(document.createElement('br'), parent.firstChild);
  parent.insertBefore(table, parent.firstChild);
}

//----------------------------------------------------------------------------//

function recreate_table(colspan){
  remove_table();
  return create_table(colspan);
}

//----------------------------------------------------------------------------//

function remove_table(){
  var parent = document.querySelector('form.global_input');

  var table = document.getElementById(script_name + 'LotTable');
  if(table){
    parent.removeChild(table);
    parent.removeChild(parent.firstChild);
  }
}

//----------------------------------------------------------------------------//

function create_table(colspan){
  var parent = document.querySelector('form.global_input');

  var table = document.createElement('table');
  table.id = script_name + 'LotTable';
  parent.appendChild(table);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.setAttribute('colspan', colspan);
  td.appendChild(document.createElement('b'));
  td.firstChild.appendChild(document.createTextNode('Лоты конкурентов:'));
  tr.appendChild(td);

  return table;
}

//----------------------------------------------------------------------------//

function draw_row(table, args){
  var tr = document.createElement('tr');
  table.appendChild(tr);

  for(var i = 0; i < args.length; ++i){
    var td = document.createElement('td');
    td.setAttribute('align', 'center');
    td.textContent = args[i];
    tr.appendChild(td);
  }
}

//----------------------------------------------------------------------------//

function set_form_values(objects, obj){
  if(obj.type == enum_ot.any)
    throw 'Logic error: set_form_values';

  if(!objects.length)
    throw 'Logic error: set_form_values (length)';

  var count = document.querySelector('input[name="count"]');
  count.value = 1;

  if(settings.last_type == 1){ // sell now
    var max_count = 1;
    var matches = /.+\((\d+)\)/.exec(obj.name);
    if(matches)
      max_count = +matches[1];

    switch(obj.type){
      case enum_ot.res:
        count.value = max_count <= 50 ? max_count : 50;
        break;

      case enum_ot.el:
        count.value = max_count <= 10 ? max_count : 10;
        break;

      case enum_ot.art:
        count.value = max_count <= 3 ? max_count : 3;
        break;
    }
  }

  var price_el = document.querySelector('input[name="price"]');

  switch(obj.type){
    case enum_ot.res:
    case enum_ot.el:
    case enum_ot.cert:
    case enum_ot.part:
      price_el.value = objects[0].price - 2;
      break;

    case enum_ot.art:
      var select = document.querySelector('select[name="item"]');
      var option = select.options[select.selectedIndex];
      var cur_toughness = +/(\d+)\/\d+/.exec(option.textContent)[1];
      price_el.value = (cur_toughness*(objects[0].ppb - 0.01)).toFixed() - 2;
      break;
  }

  document.querySelector('input[id="first_submit_button"]').removeAttribute('disabled');
}

//----------------------------------------------------------------------------//

function load_settings(){
  var settings_ = load_value(script_name + 'Settings');

  if(settings_)
    return JSON.parse(settings_);

  settings_ = {
    last_type: 1,
    last_time: 1,
    hided:     []
  };

  return settings_;
}

//----------------------------------------------------------------------------//

function save_settings(){
  var select = document.querySelector('select[name="atype"]');
  settings.last_type = +select.options[select.selectedIndex].value;

  select = document.querySelector('select[name="duration"]');
  settings.last_time = +select.options[select.selectedIndex].value;

  var hided = all_options.filter(function(current){
    return current.hide;
  });

  hided.forEach(function(current){
    settings.hided.push(current.value);
  });

  settings.hided.filter((value, index, self) => self.indexOf(value) === index);

  save_value(script_name + 'Settings', JSON.stringify(settings));
}

//----------------------------------------------------------------------------//

function set_settings(){
  var el = document.querySelector('select[name="atype"]');
  for(var i = 0; i < el.options.length; ++i)
    if(el.options[i].value == settings.last_type){
      el.options[i].selected = true;
      break;
    }

  el = document.querySelector('select[name="duration"]');
  for(var i = 0; i < el.options.length; ++i)
    if(el.options[i].value == settings.last_time){
      el.options[i].selected = true;
      break;
    }

  all_options.forEach(function(current){
    for(var i = 0; i < settings.hided.length; ++i)
      if(current.value == settings.hided[i]){
        current.hide = true;
        break;
      }
  });
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//