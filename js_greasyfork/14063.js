// ==UserScript==
// @name        GN_TnvGetter
// @namespace   Gradient
// @description Получение волн и сфер по логу боя в ТНВ
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/battle.php\?lastturn=-1&warid=\d+/
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/battle.php\?warid=\d+&lastturn=-1/
// @version     1.2.7
// @downloadURL https://update.greasyfork.org/scripts/14063/GN_TnvGetter.user.js
// @updateURL https://update.greasyfork.org/scripts/14063/GN_TnvGetter.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_TnvGetter'; // Enter your script name here

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
// Creatures
//----------------------------------------------------------------------------//

this.creatures = JSON.parse(SU.load_value('GN_CommonValues_Creatures', '[]'));

//----------------------------------------------------------------------------//

} // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

var CV = GN_CommonValues;

//----------------------------------------------------------------------------//

var M_objects = [];
var enum_sphere = {
  unknown:      0,
  call:         1,
  resurrection: 2,
  shots:        3,
  mana:         4,
  attack:       5,
  defence:      6,
  speed:        9,
  initiative:   10,
  health:       11
};

var spheres = [
  { id: enum_sphere.unknown,      name: 'Неизвестная сфера' },
  { id: enum_sphere.call,         name: 'Призыв' },
  { id: enum_sphere.resurrection, name: 'Воскрешение' },
  { id: enum_sphere.shots,        name: 'Выстрелы' },
  { id: enum_sphere.mana,         name: 'Мана' },
  { id: enum_sphere.attack,       name: 'Атака' },
  { id: enum_sphere.defence,      name: 'Защита' },
  { id: enum_sphere.speed,        name: 'Скорость' },
  { id: enum_sphere.initiative,   name: 'Инициатива' },
  { id: enum_sphere.health,       name: 'Здоровье' }
];

var enum_align = {
  unknown: 0,
  left:    1,
  up:      2,
  right:   3,
  down:    4
};

var aligns = [
  { id: enum_align.unknown, name: 'Сфера' },
  { id: enum_align.left,    name: 'Лево' },
  { id: enum_align.up,      name: 'Верх' },
  { id: enum_align.right,   name: 'Право' },
  { id: enum_align.down,    name: 'Низ' }
];

start_work();

//----------------------------------------------------------------------------//

function start_work(){
  parse_content();

  if(M_objects.length)
    print_content();
}

//----------------------------------------------------------------------------//

function parse_content(){
  var content = document.body.innerHTML;

  if(content.indexOf('bonusani') == -1) // regexp catastrophic backtracking
    return;

  var re = /.+?M(\d+?):.+bonusani/;
  var matches = re.exec(content);

  if(!matches)
    return;

  var M = matches[1];
  var is_next = false;

  do{
    var M_next = next_M(M);
    re = new RegExp('M' + M + '(.+)M' + M_next);
    is_next = (matches = re.exec(content));

    if(!is_next){
      re = new RegExp('M' + M + '([^<]+)');
      is_next = (matches = re.exec(content));
    }

    if(is_next)
      parse_row(matches[1]);

    M = M_next;
  }
  while(is_next);
}

//----------------------------------------------------------------------------//

function next_M(M){
  var M_next = +M + 1;
  if(M_next < 10)
    M_next = '00' + M_next;
  else if(M_next >= 10 && M_next < 100)
    M_next = '0' + M_next;

  return M_next;
}

//----------------------------------------------------------------------------//

function parse_row(row){
  if(/\^sum1/.test(row)) //gate
    return;

  var descriptors = row.split('|');

  var M_obj = {
    is_boss:  false,
    def:      0,
    hp:       0,
    type:     '',
    name:     '',
    bossname: '',
    count:    0,
    is_bonus: /bonusani/.test(row),
    bonus:    enum_sphere.unknown,
    bnc:      0,
    bni:      0,
    align:    enum_align.unknown
  };

  if(M_obj.is_bonus){
    var matches = /.+~\^BNc1(\d+)BNi1(\d+)BNg/.exec(row);

    if(matches){
      M_obj.bonus = enum_sphere.call;
      M_obj.bnc   = +matches[1];
      M_obj.bni   = +matches[2];
    }
    else
    {
      M_obj.bonus = /~\^BNb1(\d+)sum/.exec(row);
      M_obj.bonus = M_obj.bonus ? +M_obj.bonus[1] : enum_sphere.unknown;
    }
  }
  else{
    M_obj.is_boss = /\^bos/.test(row);

    if(M_obj.is_boss){
      M_obj.def = /:([0-9-]+)/.exec(descriptors[0]);

      if(M_obj.def)
        M_obj.def = +M_obj.def[1].substr(-6*6, 6);

      M_obj.hp = /:([0-9-]+)/.exec(descriptors[0]);

      if(M_obj.hp)
        M_obj.hp = +M_obj.hp[1].substr(-2*6, 6);

      M_obj.count = 1;
    }
    else{
      var matches = /:([0-9-]+)/.exec(descriptors[0]);

      if(matches){
        M_obj.count = +matches[1].substr(11*6, 6);
        M_obj.bnc = M_obj.count;
        M_obj.bni = +matches[1].substr(1*6, 6);
      }
    }

    M_obj.type = /:[0-9-]+([^0-9-]+)/.exec(descriptors[0]);

    if(M_obj.type){
      M_obj.type = M_obj.type[1];

      var creature = get_creature(M_obj.type);

      if(creature)
        M_obj.bossname = creature.name;
    }

    M_obj.name = /(.+?)#/.exec(descriptors[2]);

    if(M_obj.name)
      M_obj.name = M_obj.name[1];

    M_obj.align = /:([0-9-]+)/.exec(descriptors[0]);
    M_obj.align = parse_align(M_obj.align);
  }

  M_objects.push(M_obj);
}

//----------------------------------------------------------------------------//

function parse_align(matches){
  if(!matches)
    return enum_align.unknown;

  matches = matches[1].substr(-11*6, 12);

  if(matches == '-00005000006')
    return enum_align.left;

  if(matches == '000017000006')
    return enum_align.right;

  if(matches == '000006-00005')
    return enum_align.up;

  if(matches == '000006000017')
    return enum_align.down;

  return enum_align.unknown;
}

//----------------------------------------------------------------------------//

function print_content(){
  var rows = [];
  var row  = [];
  var end_wave = false;
  var calls = [];

  while(M_objects.length){
    if(end_wave){
      rows.push(row);
      end_wave = false;
      row = [];
    }

    var obj = M_objects.shift();
    end_wave = obj.is_bonus;

    if(obj.is_bonus){
      var sphere = get_sphere(obj.bonus);

      if(sphere.id == enum_sphere.call){
        var call = get_called(obj.bnc, obj.bni, M_objects);

        if(call)
          calls.push(call);
      }
    }

    row.push(obj);
  }

  if(row.length)
    rows.push(row);

  var row_aligns = [ enum_align.left, enum_align.up, enum_align.right, enum_align.down, enum_align.unknown /*sphere*/ ];
  var printed_rows = [];

  var header = [];
  row_aligns.forEach(function(current){
    var align = get_align(current);
    header.push(align.name);
  });

  printed_rows.push(header.join(' - '));

  var wave = 0;
  rows.forEach(function(curr_row){
    var ordered = [];
    row_aligns.forEach(function(c){
      ordered.push('пусто');
    });

    curr_row.forEach(function(obj){
      var idx = row_aligns.indexOf(obj.align);

      if(idx != -1){
        if(!obj.is_bonus)
          ordered[idx] = obj.is_boss ? (obj.name + ' (Тип: ' + obj.bossname + ', ХП: ' + obj.hp + ', защита: ' + obj.def + ')') : (obj.count + ' ' + obj.name);
        else{
          var sphere = get_sphere(obj.bonus);
          var call = null;
          if(sphere.id == enum_sphere.call){
            call = get_called(obj.bnc, obj.bni, calls);

            var creature = get_uid_creature(obj.bni);

            ordered[idx] = '(' + sphere.name + ': ' + (creature ? (obj.bnc + ' ' + creature.name) : '') + (call ? ', ' + get_align(call.align).name : '') + ')';
          }
          else
            ordered[idx] = '(' + sphere.name + ')';
        }
      }
    });

    printed_rows.push(++wave + ') ' + ordered.join(' - '));
  });

  alert(printed_rows.join('\n'));
}

//----------------------------------------------------------------------------//

function get_creature(flash){
  for(var i = 0; i < CV.creatures.length; ++i)
    if(CV.creatures[i].flash == flash)
      return CV.creatures[i];

  return null;
}

//----------------------------------------------------------------------------//

function get_uid_creature(uid){
  for(var i = 0; i < CV.creatures.length; ++i)
    if(CV.creatures[i].uid == uid)
      return CV.creatures[i];

  return null;
}

//----------------------------------------------------------------------------//

function get_align(id){
  for(var i = 0; i < aligns.length; ++i)
    if(aligns[i].id == id)
      return aligns[i];

  throw new Error('Logic error, align id = [' + id + ']');
}

//----------------------------------------------------------------------------//

function get_sphere(id){
  for(var i = 0; i < spheres.length; ++i)
    if(spheres[i].id == id)
      return spheres[i];

  throw new Error('Logic error, sphere id = [' + id + ']');
}

//----------------------------------------------------------------------------//

function get_called(bnc, bni, arr_){
  for(var i = 0; i < arr_.length; ++i){
    var x = arr_[i];

    if(x.bnc == bnc && x.bni == bni){
      arr_.splice(i, 1);
      return x;
    }
  }

  return null;
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//