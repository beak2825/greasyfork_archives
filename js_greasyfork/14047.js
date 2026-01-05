// ==UserScript==
// @name        GN_CommonValuesFiller
// @namespace   Gradient
// @description Заполнение содержимого БД
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/.+/
// @exclude     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @version     1.3.59
// @downloadURL https://update.greasyfork.org/scripts/14047/GN_CommonValuesFiller.user.js
// @updateURL https://update.greasyfork.org/scripts/14047/GN_CommonValuesFiller.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_CommonValuesFiller'; // Enter your script name here

//----------------------------------------------------------------------------//

(function(){ try{ // wrapper start

//----------------------------------------------------------------------------//

var persistent_storage_sign = document.getElementById('GN_GM_Handler');
var alert_sign              = document.getElementById('GN_AlertSign');

if(!alert_sign){
  alert_sign = document.createElement('div');
  alert_sign.id = 'GN_AlertSign';
  alert_sign.setAttribute('alerted', 'false');
  document.body.appendChild(alert_sign);
}

var alerted = alert_sign.getAttribute('alerted') != 'false';

if(!persistent_storage_sign){
  if(!alerted){
    alert_sign.setAttribute('alerted', 'true');
    throw new Error('Скрипт GN_CommonValuesFiller требует для своей работы скрипт управления данными (GN_PersistentStorage), который должен стоять первым в порядке выполнения скриптов.\n'
        + 'Подробнее здесь: "https://greasyfork.org/ru/scripts/14049-Как-устанавливать-скрипты-читать-здесь"');
  }
}

var div = document.createElement('div');
div.id = 'GN_CommonValuesSign';
document.body.appendChild(div);

//----------------------------------------------------------------------------//
// UnifiedLibrary 1.7.0 start
//----------------------------------------------------------------------------//

function save_value(desc, value){
  var div = document.getElementById('GN_GM_Handler');
  div.setAttribute('desc',      desc);
  div.setAttribute('value',     value);
  div.setAttribute('operation', 'save');

  div.click();

  if(div.getAttribute('state') != 'complete')
    throw new Error('Ошибка при сохранении значения');
}

//----------------------------------------------------------------------------//

function load_value(value, def){
  var div = document.getElementById('GN_GM_Handler');
  div.setAttribute('desc',      value);
  div.setAttribute('operation', 'load');

  div.click();

  if(div.getAttribute('state') != 'complete')
    throw new Error('Ошибка при загрузке значения');

  return (div.getAttribute('is_null') == 'true' ? def : div.getAttribute('value'));
}

//----------------------------------------------------------------------------//
// Artefacts
//----------------------------------------------------------------------------//

var hero_lvl = 24; //NB place your hero lvl here!

// categories (dont need it?) - для рынка
var enum_ac = {
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
  event:     11,
  potion:    12
};

// sets
var enum_aset = {
  no_set:                 0,
  hunter:                 1,
  master_hunter:          2,
  great_hunter:           3,
  beastbane:              4,
  thief:                  5,
  plunderer:              6,
  ranger:                 7,
  tactician:              8,
  recruiter:              9,
  barbarian_warrior:      10,
  apprentice_necromancer: 11,
  mercenary:              12,
  elven_scout:            13,
  servant_of_darkness:    14,
  demonic_soldier:        15,
  mage_disciple:          16,
  dwarf_warrior:          17,
  dwarf_craftsman:        18,
  mage_instructor:        19,
  warrior_elf:            20,
  druid:                  21,
  militant:               22,
  paladin:                23,
  tribal:                 24,
  unruly_barbarian:       25,
  templar:                26,
  inquisitor:             27,
  amphibian:              28,
  survilurg:              29,
  temporal:               30,
  pirate:                 31,
  leader:                 32,
  scholar:                33,
  dungeon:                34,
  robber:                 35,
  imperial:               36,
  dark:                   37,
  ocean:                  38,
  heaven:                 39,
  adventurer:             40,
  worldwalker:            41,
  unity:                  42,
  magma:                  43,
  stalker:                44,
  armada:                 45,
  wanderer:               46,
  ronin:                  47,
  honor:                  48,
  legend:                 49
};

// market categories
var enum_amc = {
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

// slots
var enum_as = {
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

// craft type
var enum_at = {
  untyped: 0,
  weapon:  1,
  armor:   2,
  jewelry: 3
};

var a_prices = get_a_prices();

var artefacts = [
  // shop weapon
  new Artefact('staff', 'Боевой посох ', 5, 40, 6, 2527, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, spellpower: 1 }),
  new Artefact('sword18', 'Гладий предвестия', 18, 70, 12, 17755, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 1 }, { increase_close_combat_damage: 10 }),
  new Artefact('wood_sword', 'Деревянный меч', 1, 7, 1, 133, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1 }),
  new Artefact('long_bow', 'Длинный лук', 6, 50, 4, 6317, enum_ac.shop, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, { increase_range_combat_damage: 10 }),
  new Artefact('dagger_dex', 'Кинжал ловкости', 5, 40, 4, 3230, enum_ac.shop, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, initiative: 3 }),
  new Artefact('dagger', 'Кинжал мести', 3, 30, 1, 912, enum_ac.shop, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 1 }),
  new Artefact('dagger20', 'Клинок сумерек', 20, 60, 8, 9291, enum_ac.shop, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 5, defence: 1 }, { increase_close_combat_damage: 7 }),
  new Artefact('dagger16', 'Клинок феникса', 16, 60, 7, 9120, enum_ac.shop, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, defence: 1 }, { increase_close_combat_damage: 6 }),
  new Artefact('shortbow', 'Короткий лук', 4, 20, 1, 342, enum_ac.shop, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, { increase_range_combat_damage: 5 }),
  new Artefact('gnome_hammer', 'Легкий топорик', 2, 25, 2, 294, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2, defence: -1}),
  new Artefact('bow14', 'Лук полуночи', 14, 65, 6, 9946, enum_ac.shop, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, { increase_range_combat_damage: 18 }),
  new Artefact('bow17', 'Лук рассвета', 17, 65, 7, 10108, enum_ac.shop, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 1 }, { increase_range_combat_damage: 20 }),
  new Artefact('power_sword', 'Меч власти', 7, 80, 8, 9775, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, initiative: 3 }),
  new Artefact('requital_sword', 'Меч возмездия', 5, 40, 5, 2527, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, defence: 1 }),
  new Artefact('firsword15', 'Меч возрождения', 15, 70, 11, 17670, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8 }, { increase_close_combat_damage: 9 }),
  new Artefact('ssword16', 'Меч гармонии', 16, 46, 11, 6051, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1 }, { increase_close_combat_damage: 6 }),
  new Artefact('ssword8', 'Меч жесткости', 8, 40, 8, 3838, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 1, initiative: 2 }),
  new Artefact('ssword10', 'Меч отваги', 10, 45, 9, 4854, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6 }, { increase_close_combat_damage: 4 }),
  new Artefact('broad_sword', 'Меч равновесия', 6, 60, 6, 4721, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2, defence: 2, initiative: 2 }),
  new Artefact('def_sword', 'Меч расправы', 3, 40, 3, 1292, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2, defence: 1 }),
  new Artefact('dagger_myf', 'Мифриловый кинжал', 10, 60, 6, 8626, enum_ac.shop, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 2, initiative: 1 }),
  new Artefact('mif_sword', 'Мифриловый меч', 9, 70, 9, 16957, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, initiative: 2 }, { increase_close_combat_damage: 5 }),
  new Artefact('mif_staff', 'Мифриловый посох', 9, 70, 9, 16387, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, spellpower: 2, knowledge: 2 }),
  new Artefact('ssword13', 'Обсидиановый меч', 13, 50, 10, 5985, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7 }, { increase_close_combat_damage: 5 }),
  new Artefact('mstaff13', 'Обсидиановый посох', 13, 40, 10, 4797, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { defence: 1, spellpower: 1, knowledge: 3 }),
  new Artefact('mstaff8', 'Посох весны', 8, 30, 8, 2888, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { defence: 1, spellpower: 1, knowledge: 2 }),
  new Artefact('smstaff16', 'Посох забвения', 16, 37, 11, 4883, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { defence: 2, spellpower: 2, knowledge: 2 }),
  new Artefact('staff18', 'Посох затмения', 18, 70, 12, 17746, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, defence: 2, spellpower: 3, knowledge: 2 }, { hero_initiative: 3 }),
  new Artefact('sor_staff', 'Посох могущества', 7, 50, 8, 6118, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { spellpower: 2, knowledge: 2 }),
  new Artefact('ffstaff15', 'Посох повелителя огня', 15, 70, 11, 17679, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, spellpower: 2, knowledge: 3 }),
  new Artefact('mstaff10', 'Посох теней', 10, 35, 9, 3781, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, defence: 1, spellpower: 1, knowledge: 2 }),
  new Artefact('mm_sword', 'Рубиновый меч', 12, 70, 10, 17195, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, initiative: 1 }, { increase_close_combat_damage: 7 }),
  new Artefact('mm_staff', 'Рубиновый посох', 12, 70, 10, 16986, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { defence: 1, spellpower: 2, knowledge: 2 }),
  new Artefact('composite_bow', 'Составной лук', 11, 55, 5, 8246, enum_ac.shop, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, { increase_range_combat_damage: 15 }),
  new Artefact('steel_blade', 'Стальной клинок', 3, 30, 2, 465, enum_ac.shop, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2 }),

  // shop armor
  new Artefact('large_shield', 'Башенный щит', 10, 70, 6, 9576, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5 }, { range_combat_protection: 5 }),
  new Artefact('hauberk', 'Боевая кольчуга', 5, 40, 3, 2289, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3 }),
  new Artefact('boots2', 'Боевые сапоги', 5, 35, 2, 1026, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2 }),
  new Artefact('armor15', 'Доспех пламени', 15, 70, 8, 9310, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { magic_protection: 7, close_combat_protection: 7 }),
  new Artefact('marmor17', 'Доспехи сумерек', 17, 70, 9, 9310, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 1, knowledge: 1 }, { magic_protection: 10, hero_initiative: 6 }),
  new Artefact('sarmor16', 'Кираса благородства', 16, 44, 8, 4351, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, initiative: 1 }, { close_combat_protection: 6 }),
  new Artefact('armor17', 'Кираса рассвета', 17, 70, 9, 9490, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { magic_protection: 9, close_combat_protection: 9 }),
  new Artefact('leather_shiled', 'Кожаная броня', 1, 18, 1, 266, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 1 }),
  new Artefact('leatherhat', 'Кожаная шляпа', 1, 12, 1, 171, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { initiative: 1 }),
  new Artefact('leatherboots', 'Кожаные ботинки', 1, 14, 1, 199, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { initiative: 1 }),
  new Artefact('leatherplate', 'Кожаные доспехи', 3, 30, 2, 1358, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2 }),
  new Artefact('hunter_boots', 'Кожаные сапоги', 4, 30, 1, 912, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 1 }),
  new Artefact('leather_helm', 'Кожаный шлем', 3, 30, 1, 627, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1 }),
  new Artefact('wizard_cap', 'Колпак мага', 5, 35, 2, 1596, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { spellpower: 1 }),
  new Artefact('chain_coif', 'Кольчужный шлем', 5, 40, 2, 1539, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2 }),
  new Artefact('xymhelmet15', 'Корона пламенного чародея', 15, 70, 7, 6612, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, spellpower: 1, knowledge: 2 }, { magic_protection: 5 }),
  new Artefact('mhelmetzh13', 'Корона чернокнижника', 13, 70, 6, 6384, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, spellpower: 1, knowledge: 1 }, { magic_protection: 3 }),
  new Artefact('round_shiled', 'Круглый щит', 1, 7, 1, 104, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 1 }),
  new Artefact('mif_light', 'Лёгкая мифриловая кираса', 8, 70, 5, 6251, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4 }, { magic_protection: 5 }),
  new Artefact('mif_lboots', 'Лёгкие мифриловые сапоги', 8, 55, 6, 7153, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 2 }, { magic_protection: 5 }),
  new Artefact('mif_lhelmet', 'Лёгкий мифриловый шлем', 9, 70, 5, 5244, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, initiative: 1 }, { magic_protection: 5 }),
  new Artefact('sarmor9', 'Мифриловая кольчуга', 9, 40, 5, 2479, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, initiative: 1 }, { magic_protection: 3 }),
  new Artefact('miff_plate', 'Мифриловые доспехи', 12, 75, 7, 9842, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { magic_protection: 5, close_combat_protection: 5 }),
  new Artefact('sarmor13', 'Обсидиановая броня', 13, 50, 7, 4322, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4 }, { close_combat_protection: 5 }),
  new Artefact('boots13', 'Обсидиановые сапоги', 13, 70, 7, 8502, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { magic_protection: 7 }),
  new Artefact('zxhelmet13', 'Обсидиановый шлем', 13, 70, 6, 6384, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5 }, { magic_protection: 5 }),
  new Artefact('shield13', 'Обсидиановый щит', 13, 70, 7, 10174, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4 }, { range_combat_protection: 10 }),
  new Artefact('mage_armor', 'Одеяние мага', 8, 50, 5, 4465, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1 }),
  new Artefact('robewz15', 'Роба пламенного чародея', 15, 70, 8, 9310, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 1, knowledge: 1 }, { magic_protection: 3 }),
  new Artefact('wiz_robe', 'Роба чародея', 11, 70, 7, 9376, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, spellpower: 2 }),
  new Artefact('sboots12', 'Рубиновые сапоги', 12, 35, 6, 2992, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4 }, { magic_protection: 3 }),
  new Artefact('shelm12', 'Рубиновый шлем', 12, 40, 5, 2660, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3 }, { magic_protection: 5 }),
  new Artefact('sboots16', 'Сапоги благородства', 16, 30, 8, 3239, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, initiative: 1 }, { magic_protection: 5 }),
  new Artefact('boots15', 'Сапоги пламени', 15, 70, 8, 8559, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { magic_protection: 7, close_combat_protection: 3 }),
  new Artefact('boots17', 'Сапоги рассвета', 17, 70, 9, 8683, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { magic_protection: 9, close_combat_protection: 6 }),
  new Artefact('mboots17', 'Сапоги сумерек', 17, 70, 9, 8683, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, spellpower: 1 }, { magic_protection: 10, hero_initiative: 12 }),
  new Artefact('mboots14', 'Сапоги чернокнижника', 14, 70, 8, 8825, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, spellpower: 1 }, { magic_protection: 5, hero_initiative: 10 }),
  new Artefact('sboots9', 'Солдатские сапоги ', 9, 30, 5, 2137, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, initiative: 3 }),
  new Artefact('ciras', 'Стальная кираса', 7, 70, 4, 4455, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4 }),
  new Artefact('steel_helmet', 'Стальной шлем', 7, 70, 3, 3676, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3 }),
  new Artefact('s_shield', 'Стальной щит', 2, 15, 2, 266, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 2 }),
  new Artefact('full_plate', 'Стальные доспехи', 10, 75, 6, 9243, enum_ac.shop, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { close_combat_protection: 5 }),
  new Artefact('steel_boots', 'Стальные сапоги', 7, 70, 4, 5785, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4 }),
  new Artefact('shoe_of_initiative', 'Туфли стремления', 5, 40, 3, 2384, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { initiative: 3 }),
  new Artefact('wiz_boots', 'Туфли чародея', 12, 65, 6, 8008, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, spellpower: 1 }, { hero_initiative: 10 }),
  new Artefact('mif_hboots', 'Тяжёлые мифриловые сапоги', 11, 65, 6, 7752, enum_ac.shop, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { magic_protection: 5 }),
  new Artefact('mif_hhelmet', 'Тяжёлый мифриловый шлем', 11, 70, 5, 6298, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4 }, { magic_protection: 5 }),
  new Artefact('shelm16', 'Шлем благородства', 16, 40, 7, 2774, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, initiative: 1 }, { magic_protection: 5 }),
  new Artefact('mage_helm', 'Шлем мага', 7, 50, 4, 3277, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, spellpower: 1 }),
  new Artefact('shelm8', 'Шлем отваги', 8, 30, 3, 1197, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, initiative: 1 }),
  new Artefact('myhelmet15', 'Шлем пламени', 15, 70, 7, 6583, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5 }, { magic_protection: 7, close_combat_protection: 2 }),
  new Artefact('helmet17', 'Шлем рассвета', 17, 70, 8, 7239, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5 }, { magic_protection: 9, close_combat_protection: 5 }),
  new Artefact('mhelmet17', 'Шлем сумерек', 17, 70, 8, 7239, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, spellpower: 1, knowledge: 2 }, { magic_protection: 10, hero_initiative: 2 }),
  new Artefact('knowledge_hat', 'Шляпа знаний', 5, 25, 2, 978, enum_ac.shop, enum_at.armor, enum_as.head, enum_amc.helm, { knowledge: 1 }),
  new Artefact('dragon_shield', 'Щит драконов', 7, 70, 5, 8778, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4 }),
  new Artefact('shield16', 'Щит пламени', 16, 70, 8, 10298, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5 }, { range_combat_protection: 15 }),
  new Artefact('sshield17', 'Щит подавления', 17, 35, 8, 4018, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4 }, { range_combat_protection: 7 }),
  new Artefact('shield19', 'Щит рассвета', 19, 70, 9, 10469, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 6 }, { range_combat_protection: 17 }),
  new Artefact('sshield5', 'Щит славы', 5, 40, 4, 2888, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4 }),
  new Artefact('sshield11', 'Щит сокола', 11, 40, 6, 3876, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 1 }, { range_combat_protection: 5 }),
  new Artefact('defender_shield', 'Щит хранителя', 4, 40, 3, 1130, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 3 }),
  new Artefact('sshield14', 'Щит чешуи дракона', 14, 38, 7, 3923, enum_ac.shop, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5 }, { range_combat_protection: 6 }),

  // shop jewelry
  new Artefact('wzzamulet16', 'Амулет битвы', 16, 65, 10, 10972, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 1, initiative: 6 }),
  new Artefact('mmzamulet16', 'Амулет духа', 16, 65, 10, 10972, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { spellpower: 3, knowledge: 2 }),
  new Artefact('smamul17', 'Амулет единения', 17, 30, 10, 4389, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { defence: 3, spellpower: 1, knowledge: 2 }),
  new Artefact('bafamulet15', 'Амулет трёх стихий', 15, 65, 9, 10811, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }),
  new Artefact('amulet_of_luck', 'Амулет удачи', 3, 25, 2, 959, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 1 }),
  new Artefact('samul14', 'Амулет фортуны', 14, 30, 9, 4370, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, initiative: 1, luck: 1 }),
  new Artefact('wzzamulet13', 'Амулет ярости', 13, 60, 9, 9975, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, initiative: 3 }),
  new Artefact('warring13', 'Глаз дракона', 13, 60, 6, 10279, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, initiative: 3 }),
  new Artefact('ring19', 'Кольцо бесстрашия', 19, 65, 7, 11305, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 3, initiative: 1 }),
  new Artefact('wwwring16', 'Кольцо боли', 16, 65, 6, 11238, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 2, initiative: 1 }),
  new Artefact('dring5', 'Кольцо веры', 5, 40, 4, 3496, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 2, initiative: 1 }),
  new Artefact('warriorring', 'Кольцо воина', 10, 40, 5, 6697, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, initiative: 2 }),
  new Artefact('mmmring16', 'Кольцо звёзд', 16, 65, 6, 11238, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { spellpower: 2, knowledge: 1 }),
  new Artefact('i_ring', 'Кольцо ловкости', 2, 10, 1, 171, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { initiative: 1 }),
  new Artefact('smring10', 'Кольцо молнии', 10, 30, 5, 2859, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 2, knowledge: 1 }),
  new Artefact('dring18', 'Кольцо надежды', 18, 70, 9, 14820, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 6, initiative: 1 }),
  new Artefact('mring19', 'Кольцо непрестанности', 19, 65, 7, 11390, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 1, spellpower: 2, knowledge: 1 }),
  new Artefact('circ_ring', 'Кольцо отречения', 6, 50, 4, 6507, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: -1, initiative: 5 }),
  new Artefact('dring15', 'Кольцо пламенного взора', 15, 70, 8, 14534, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 5, initiative: 1 }),
  new Artefact('powerring', 'Кольцо пророка', 7, 40, 4, 5187, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { spellpower: 1 }),
  new Artefact('bring14', 'Кольцо противоречий', 14, 60, 6, 10374, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }),
  new Artefact('sring4', 'Кольцо силы', 4, 15, 2, 579, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1 }),
  new Artefact('doubt_ring', 'Кольцо сомнений', 4, 12, 2, 1064, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { morale: -2, luck: 1 }),
  new Artefact('dring21', 'Кольцо сопряжения', 21, 70, 10, 15104, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 7, initiative: 1 }),
  new Artefact('rashness_ring', 'Кольцо стремительности', 5, 30, 2, 1928, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { initiative: 2 }),
  new Artefact('darkring', 'Кольцо теней', 10, 50, 5, 8379, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { spellpower: 2 }),
  new Artefact('sring17', 'Кольцо хватки дракона', 17, 30, 6, 2907, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 3 }),
  new Artefact('warrior_pendant', 'Кулон воина', 10, 50, 8, 8046, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2, initiative: 3 }),
  new Artefact('mamulet19', 'Кулон непостижимости', 19, 65, 11, 11039, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { defence: 1, spellpower: 2, knowledge: 3 }, { hero_initiative: 6 }),
  new Artefact('power_pendant', 'Кулон отчаяния', 7, 60, 7, 7381, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, initiative: 5 }),
  new Artefact('amulet19', 'Кулон рвения', 19, 65, 11, 11039, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, initiative: 5 }),
  new Artefact('magic_amulet', 'Магический амулет', 10, 50, 7, 8379, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { spellpower: 2, knowledge: 1 }),
  new Artefact('cloack17', 'Мантия вечности', 17, 65, 9, 9975, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 2, knowledge: 1 }),
  new Artefact('cloackwz15', 'Мантия пламенного чародея', 15, 65, 8, 9614, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 2, knowledge: 1 }),
  new Artefact('scroll18', 'Манускрипт концентрации', 18, 70, 9, 10307, enum_ac.shop, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { defence: 2, spellpower: 2, knowledge: 2 }),
  new Artefact('scloack8', 'Маскировочный плащ', 8, 30, 4, 2052, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { range_combat_protection: 12 }),
  new Artefact('bravery_medal', 'Медаль отваги', 2, 25, 2, 560, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { morale: 1 }),
  new Artefact('mmzamulet13', 'Мистический амулет', 13, 60, 9, 9975, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { spellpower: 2, knowledge: 2 }),
  new Artefact('dring12', 'Мифриловая печать', 12, 65, 6, 13356, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 4, initiative: 1 }),
  new Artefact('soul_cape', 'Накидка духов', 5, 30, 2, 1197, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 1 }),
  new Artefact('wiz_cape', 'Накидка чародея', 12, 60, 7, 8711, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 2 }),
  new Artefact('samul17', 'Оскал дракона', 17, 30, 10, 4389, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 3, morale: 1 }),
  new Artefact('smamul14', 'Осколок тьмы', 14, 30, 9, 4370, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { defence: 2, knowledge: 3 }),
  new Artefact('verve_ring', 'Перстень вдохновения', 4, 18, 2, 1577, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { morale: 1 }),
  new Artefact('dring9', 'Перстень хранителя', 9, 50, 6, 10032, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 3, initiative: 1 }),
  new Artefact('smring17', 'Печать единения', 17, 30, 6, 2907, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 2, spellpower: 1, knowledge: 1 }),
  new Artefact('magring13', 'Печать заклинателя', 13, 60, 6, 10279, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { spellpower: 2, knowledge: 1 }),
  new Artefact('scloack16', 'Плащ драконьего покрова', 16, 30, 8, 3192, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1 }, { range_combat_protection: 14 }),
  new Artefact('powercape', 'Плащ магической силы', 8, 40, 4, 5339, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 2 }),
  new Artefact('scoutcloack', 'Плащ разведчика', 4, 20, 1, 304, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { range_combat_protection: 5 }),
  new Artefact('energy_scroll', 'Свиток энергии', 10, 70, 6, 9044, enum_ac.shop, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { spellpower: 1, knowledge: 2 }),
  new Artefact('samul8', 'Счастливая подкова', 8, 30, 7, 3391, enum_ac.shop, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 3, luck: 1 }),
  new Artefact('sring10', 'Терновое кольцо', 10, 30, 5, 2859, enum_ac.shop, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2 }),
  new Artefact('antiair_cape', 'Халат ветров', 6, 60, 3, 2926, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null),
  new Artefact('antimagic_cape', 'Халат магической защиты', 8, 50, 5, 4949, enum_ac.shop, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { magic_protection: 15 }),

  // shop gift
  new Artefact('d_spray', 'Аромат страсти', 5, 15, 5, 3325, enum_ac.shop_gift, enum_at.jewelry, enum_as.right_arm, enum_amc.no_sell, { initiative: 5 }),
  new Artefact('bfly', 'Бабочка богини', 9, 50, 5, 49875, enum_ac.shop_gift, enum_at.jewelry, enum_as.rear, enum_amc.no_sell, { attack: 1, defence: 2, initiative: 1 }),
  new Artefact('bril_pendant', 'Бриллиантовый кулон', 3, 50, 6, 23275, enum_ac.shop_gift, enum_at.jewelry, enum_as.neck, enum_amc.no_sell, { initiative: 2, luck: 1 }),
  new Artefact('warmor', 'Броня изящества', 7, 50, 6, 16625, enum_ac.shop_gift, enum_at.armor, enum_as.body, enum_amc.no_sell, { defence: 3, initiative: 3 }),
  new Artefact('flowers3', 'Букет Аромат весны', 3, 15, 4, 3325, enum_ac.shop_gift, enum_at.jewelry, enum_as.right_arm, enum_amc.no_sell, { attack: 2, initiative: 2 }),
  new Artefact('flowers1', 'Букет Восторг', 3, 10, 1, 332, enum_ac.shop_gift, enum_at.jewelry, enum_as.left_arm, enum_amc.no_sell, { defence: 1 }),
  new Artefact('flowers4', 'Букет Для любимой', 5, 25, 5, 4987, enum_ac.shop_gift, enum_at.jewelry, enum_as.left_arm, enum_amc.no_sell, { defence: 3, initiative: 1 }),
  new Artefact('flowers2', 'Букет Женское счастье', 3, 10, 1, 332, enum_ac.shop_gift, enum_at.jewelry, enum_as.right_arm, enum_amc.no_sell, { attack: 1 }),
  new Artefact('roses', 'Букет Очарование', 7, 40, 9, 8312, enum_ac.shop_gift, enum_at.jewelry, enum_as.right_arm, enum_amc.no_sell, { attack: 4, defence: 2, initiative: 3 }),
  new Artefact('flowers5', 'Букет Роскошный', 5, 25, 5, 4987, enum_ac.shop_gift, enum_at.jewelry, enum_as.right_arm, enum_amc.no_sell, { attack: 3, initiative: 3 }),
  new Artefact('half_heart_m', 'Вторая половинка (M)', 3, 25, 2, 4987, enum_ac.shop_gift, enum_at.jewelry, enum_as.neck, enum_amc.no_sell, { luck: 1 }),
  new Artefact('half_heart_w', 'Вторая половинка (Ж)', 3, 25, 2, 4987, enum_ac.shop_gift, enum_at.jewelry, enum_as.neck, enum_amc.no_sell, { luck: 1 }),
  new Artefact('venok', 'Девичий венок', 3, 10, 2, 332, enum_ac.shop_gift, enum_at.armor, enum_as.head, enum_amc.no_sell, { defence: 1, initiative: 1 }),
  new Artefact('defender_dagger', 'Кинжал защитника', 3, 15, 2, 1330, enum_ac.shop_gift, enum_at.armor, enum_as.left_arm, enum_amc.no_sell, { attack: 1, defence: 1 }),
  new Artefact('goldciras', 'Кираса защитника', 7, 50, 4, 13300, enum_ac.shop_gift, enum_at.armor, enum_as.body, enum_amc.no_sell, { defence: 4, initiative: 1 }),
  new Artefact('koltsou', 'Кольцо предводителя', 10, 40, 6, 23275, enum_ac.shop_gift, enum_at.jewelry, enum_as.ring, enum_amc.no_sell, { attack: 3, defence: 1, initiative: 2 }),
  new Artefact('bril_ring', 'Кольцо с бриллиантом', 4, 40, 5, 33250, enum_ac.shop_gift, enum_at.jewelry, enum_as.ring, enum_amc.no_sell, { initiative: 1, morale: 1 }),
  new Artefact('wboots', 'Сапожки искусительницы', 5, 50, 6, 16625, enum_ac.shop_gift, enum_at.armor, enum_as.foots, enum_amc.no_sell, { defence: 3, initiative: 3 }),
  new Artefact('flower_heart', 'Сердце из роз', 3, 20, 3, 1662, enum_ac.shop_gift, enum_at.jewelry, enum_as.left_arm, enum_amc.no_sell, { defence: 2, initiative: 1 }),
  new Artefact('protazan', 'Серебряный протазан', 5, 40, 2, 8312, enum_ac.shop_gift, enum_at.weapon, enum_as.right_arm, enum_amc.no_sell, { attack: 4, initiative: 2 }),
  new Artefact('whelmet', 'Шляпка соблазна', 9, 50, 6, 16625, enum_ac.shop_gift, enum_at.armor, enum_as.head, enum_amc.no_sell, { defence: 3, initiative: 2 }),
  new Artefact('shpaga', 'Шпага защитника', 9, 60, 10, 26600, enum_ac.shop_gift, enum_at.weapon, enum_as.right_arm, enum_amc.no_sell, { attack: 7, initiative: 2 }, { increase_close_combat_damage: 5 }),

  // stock arts
  new Artefact('coldamul', 'Амулет холода', 7, 75, 8 + Math.floor(hero_lvl/4), 11000, enum_ac.stock, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2 + Math.floor(hero_lvl/11), initiative: 3 + Math.floor(hero_lvl/6) }),
  new Artefact('wind_armor', 'Доспех ветра', 7, 85, 1 + Math.floor(hero_lvl/2), 9500, enum_ac.stock, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2 + Math.floor(hero_lvl/5), spellpower: 1 + Math.floor(hero_lvl/11), initiative: 1 }, { magic_protection: Math.floor(hero_lvl/2), hero_initiative: hero_lvl >= 17 ? 6 : 0 }),
  new Artefact('sun_armor', 'Доспех солнца', 3, 85, 1 + Math.floor(hero_lvl/2), 9500, enum_ac.stock, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3 + Math.floor(hero_lvl/6) }, { close_combat_protection: Math.floor(hero_lvl/2), magic_protection: Math.floor(hero_lvl/2) }),
  new Artefact('super_dagger', 'Кинжал солнца', 3, 75, 3 + Math.floor(hero_lvl/4), 10400, enum_ac.stock, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 1 + Math.floor(hero_lvl/5), initiative: 1 }, { increase_close_combat_damage: Math.floor(hero_lvl/3), increase_range_combat_damage: Math.floor(hero_lvl/3) }),
  new Artefact('clover_amul', 'Клевер фортуны', 3, 75, 3 + Math.floor(hero_lvl/2), 11000, enum_ac.stock, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: Math.floor(hero_lvl/7), initiative: 1 + Math.floor(hero_lvl/3), luck: 1 }),
  new Artefact('sun_ring', 'Кольцо солнца', 5, 75, 4 + Math.floor(hero_lvl/4), 6400, enum_ac.stock, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: Math.floor(hero_lvl/4), defence: 2, initiative: 2 }),
  new Artefact('coldring_n', 'Кольцо холода', 5, 75, 6 + Math.floor(hero_lvl/4), 6400, enum_ac.stock, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: Math.floor(hero_lvl/3), initiative: 1 }),
  new Artefact('lbow', 'Лук солнца', 5, 85, 1 + Math.floor(hero_lvl/3), 10100, enum_ac.stock, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: Math.floor(hero_lvl/9) }, { increase_range_combat_damage: 3 + hero_lvl }),
  new Artefact('sun_sword', 'Меч солнца', 7, 85, 4 + Math.floor(hero_lvl/2), 17600, enum_ac.stock, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: Math.floor(hero_lvl/2), initiative: 1 }, { increase_close_combat_damage: 5 + Math.floor(hero_lvl/3) }),
  new Artefact('cold_sword2014', 'Меч холода', 3, 85, 4 + Math.floor(hero_lvl/2), 17600, enum_ac.stock, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1 + Math.floor(hero_lvl/2) }, { increase_close_combat_damage: Math.floor(hero_lvl/2), increase_range_combat_damage: Math.floor(hero_lvl/2) }),
  new Artefact('finecl', 'Плащ солнца', 5, 80, 6, 10000, enum_ac.stock, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, initiative: 1 }, { magic_protection: 10, range_combat_protection: hero_lvl }),
  new Artefact('sun_staff', 'Посох солнца', 5, 85, 4 + Math.floor(hero_lvl/2), 17600, enum_ac.stock, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, defence: Math.floor(hero_lvl/9), spellpower: 1 + Math.floor(hero_lvl/7), knowledge: 1 + Math.floor(hero_lvl/7) }, { hero_initiative: Math.floor(hero_lvl/6) }),
  new Artefact('wind_boots', 'Сапоги ветра', 7, 85, 1 + Math.floor(hero_lvl/2), 8700, enum_ac.stock, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 1 + Math.floor(hero_lvl/6), spellpower: Math.floor(hero_lvl/11), initiative: 3 }, { magic_protection: Math.floor(hero_lvl/2), hero_initiative: hero_lvl >= 17 ? 12 : (hero_lvl >= 12 && hero_lvl <= 16 ? 10 : 0) }),
  new Artefact('sun_boots', 'Сапоги солнца', 7, 85, 1 + Math.floor(hero_lvl/2), 8700, enum_ac.stock, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4 + Math.floor(hero_lvl/11) }, { magic_protection: 3*Math.floor(hero_lvl/5), close_combat_protection: 3*Math.floor(hero_lvl/8) }),
  new Artefact('wind_helm', 'Шлем ветра', 7, 85, 1 + Math.floor(hero_lvl/2), 7400, enum_ac.stock, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2 + Math.floor(hero_lvl/8), spellpower: Math.floor(hero_lvl/8), knowledge: 1, initiative: 1 }, { magic_protection: 5*Math.floor(hero_lvl/8), hero_initiative: hero_lvl >= 17 ? 2 : 0 }),
  new Artefact('sun_helm', 'Шлем солнца', 5, 85, 1 + Math.floor(hero_lvl/2), 7400, enum_ac.stock, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3 + Math.floor(hero_lvl/7) }, { magic_protection: Math.floor(hero_lvl/2), close_combat_protection: 3*Math.floor(hero_lvl/8) }),
  new Artefact('wshield', 'Щит ветров', 5, 65, 6, 4000, enum_ac.stock, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 2, defence: 2 }),
  new Artefact('cold_shieldn', 'Щит холода', 3, 85, 5 + Math.floor(hero_lvl/4), 10400, enum_ac.stock, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4 + Math.floor(hero_lvl/8) }, { range_combat_protection: hero_lvl }),

  new Artefact('ring2013', 'Кольцо года Змеи', 3, 50, 3, 800, enum_ac.stock, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 2 }),
  new Artefact('shield_14y', 'Щит наследия', 7, 70, 5, 14000, enum_ac.stock, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 1 }),

  // stock -> scholar
  new Artefact('n_amul', 'Амулет ученика', 1, 40, 2, 2000, enum_ac.stock, enum_at.jewelry, enum_as.neck, enum_amc.no_sell, { luck: 4 }, null, enum_aset.scholar),
  new Artefact('n_boots', 'Ботинки ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.armor, enum_as.foots, enum_amc.no_sell, { defence: 1 }, null, enum_aset.scholar),
  new Artefact('n_armor', 'Доспех ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.armor, enum_as.body, enum_amc.no_sell, { defence: 1 }, null, enum_aset.scholar),
  new Artefact('n_ringa', 'Кольцо силы ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.jewelry, enum_as.ring, enum_amc.no_sell, { attack: 1 }, null, enum_aset.scholar),
  new Artefact('n_ringd', 'Кольцо упорства ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.jewelry, enum_as.ring, enum_amc.no_sell, { defence: 1 }, null, enum_aset.scholar),
  new Artefact('n_sword', 'Меч ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.weapon, enum_as.right_arm, enum_amc.no_sell, { attack: 2 }, null, enum_aset.scholar),
  new Artefact('n_clk', 'Плащ ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.jewelry, enum_as.rear, enum_amc.no_sell, null, { range_combat_protection: 3 }, enum_aset.scholar),
  new Artefact('n_helmet', 'Шлем ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.armor, enum_as.head, enum_amc.no_sell, { defence: 1 }, null, enum_aset.scholar),
  new Artefact('n_shield', 'Щит ученика', 1, 40, 1, 2000, enum_ac.stock, enum_at.armor, enum_as.left_arm, enum_amc.no_sell, { defence: 1, initiative: 1 }, null, enum_aset.scholar),

  // hunter arts
  new Artefact('neut_amulet', 'Амулет леса', 5, 20, 10, 10000, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, initiative: 4 }),
  new Artefact('forest_crossbow', 'Арбалет леса', 5, 1, 9, 10000, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 1 }),
  new Artefact('forest_armor', 'Доспех леса', 3, 1, 8, 10000, enum_ac.hunter, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, initiative: 3 }),
  new Artefact('forest_dagger', 'Кинжал леса', 5, 1, 8, 20000, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, initiative: 3 }),
  new Artefact('forest_blade', 'Клинок леса', 5, 1, 8, 20000, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, initiative: 2 }),
  new Artefact('neut_ring', 'Кольцо леса', 5, 1, 7, 10000, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 3, initiative: 2 }),
  new Artefact('forest_spear', 'Копьё леса', 5, 1, 9, 20000, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, defence: 1, initiative: 5 }),
  new Artefact('les_cl', 'Лесной плащ', 5, 20, 8, 10000, enum_ac.hunter, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { initiative: 2 }),
  new Artefact('forest_bow', 'Лук леса', 5, 20, 8, 10000, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1 }),
  new Artefact('forest_knives', 'Метательные ножи леса', 5, 1, 9, 20000, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, initiative: 4 }, { increase_range_combat_damage: 7 }),
  new Artefact('forest_edge', 'Остриё леса', 5, 1, 2, 10000, enum_ac.hunter, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1 }),
  new Artefact('forest_bolt', 'Перстень леса', 5, 1, 8, 10000, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, spellpower: 1, knowledge: 1, initiative: 3 }),
  new Artefact('forest_boots', 'Сапоги леса', 5, 1, 6, 10000, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 4 }),
  new Artefact('neut_leaf', 'Талисман леса', 5, 7, 11, 10000, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, initiative: 2, luck: 1 }),
  new Artefact('forest_helm', 'Шлем леса', 5, 1, 6, 10000, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, initiative: 1 }),
  new Artefact('shieldofforest', 'Щит леса', 5, 1, 8, 10000, enum_ac.hunter, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 3, initiative: 4 }),

  // hunter -> hunter
  new Artefact('hunter_pendant1', 'Кулон охотника', 2, 10, 1, 400, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1 }, null, enum_aset.hunter),
  new Artefact('hunter_bow1', 'Лук охотника', 3, 10, 2, 400, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, { increase_range_combat_damage: 5 }, enum_aset.hunter),
  new Artefact('hunter_gloves1', 'Перчатка охотника', 3, 10, 1, 400, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.other, { defence: 1 }, null, enum_aset.hunter),
  new Artefact('hunter_jacket1', 'Рубаха охотника', 3, 10, 1, 400, enum_ac.hunter, enum_at.armor, enum_as.body, enum_amc.cuirass, { initiative: 1 }, null, enum_aset.hunter),
  new Artefact('hunter_boots1', 'Сапоги охотника', 3, 10, 1, 400, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { initiative: 1 }, null, enum_aset.hunter),
  new Artefact('hunter_sword1', 'Тесак охотника', 1, 10, 1, 400, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1, initiative: -1 }, null, enum_aset.hunter),
  new Artefact('hunter_hat1', 'Шляпа охотника', 2, 10, 1, 400, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { initiative: 1 }, null, enum_aset.hunter),
  new Artefact('hunter_shield1', 'Щит охотника', 3, 10, 2, 400, enum_ac.hunter, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 2 }, null, enum_aset.hunter),

  // hunter -> master_hunter
  new Artefact('hunter_amulet1', 'Амулет мастера-охотника', 3, 10, 3, 800, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, luck: 1 }, null, enum_aset.master_hunter),
  new Artefact('hunter_armor1', 'Броня мастера-охотника', 4, 10, 3, 800, enum_ac.hunter, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 1, initiative: 2 }, null, enum_aset.master_hunter),
  new Artefact('hunterdagger', 'Кинжал мастера-охотника', 5, 10, 2, 800, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2 }, null, enum_aset.master_hunter),
  new Artefact('hunter_ring2', 'Кольцо ловкости мастера-охотника', 5, 10, 3, 800, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { initiative: 1 }, { hero_initiative: 7 }, enum_aset.master_hunter),
  new Artefact('hunter_ring1', 'Кольцо полёта мастера-охотника', 5, 10, 2, 800, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, null, null, enum_aset.master_hunter),
  new Artefact('hunter_roga1', 'Костяной шлем мастера-охотника', 4, 10, 2, 800, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { initiative: 2 }, null, enum_aset.master_hunter),
  new Artefact('huntersword2', 'Лёгкая сабля мастера-охотника', 5, 10, 4, 800, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, initiative: 1 }, null, enum_aset.master_hunter),
  new Artefact('hunter_boots3', 'Лёгкие сапоги мастера-охотника', 4, 10, 2, 800, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { initiative: 2 }, null, enum_aset.master_hunter),
  new Artefact('hunter_bow2', 'Лук мастера-охотника', 5, 10, 3, 800, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, null, enum_aset.master_hunter),
  new Artefact('hunter_mask1', 'Маскхалат мастера-охотника', 5, 10, 3, 800, enum_ac.hunter, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { range_combat_protection: 10 }, enum_aset.master_hunter),
  new Artefact('hunterdsword', 'Сабля мастера-охотника', 5, 10, 4, 800, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2 }, { increase_close_combat_damage: 10 }, enum_aset.master_hunter),
  new Artefact('hunter_boots2', 'Сапоги мастера-охотника', 5, 10, 2, 800, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2 }, null, enum_aset.master_hunter),
  new Artefact('hunter_arrows1', 'Стрелы мастера-охотника', 4, 10, 3, 800, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.other, null, null, enum_aset.master_hunter),
  new Artefact('hunter_helm', 'Шлем мастера-охотника', 5, 10, 2, 800, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 1 }, null, enum_aset.master_hunter),
  new Artefact('huntershield2', 'Щит мастера-охотника', 5, 10, 3, 800, enum_ac.hunter, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 2, initiative: 1 }, null, enum_aset.master_hunter),

  // hunter -> great_hunter
  new Artefact('gm_amul', 'Амулет великого охотника', 6, 10, 5, 1200, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, initiative: 2, luck: 1 }, null, enum_aset.great_hunter),
  new Artefact('gm_arm', 'Броня великого охотника', 7, 10, 5, 1200, enum_ac.hunter, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2, initiative: 3 }, null, enum_aset.great_hunter),
  new Artefact('gm_rring', 'Заколдованное кольцо в. охотника', 7, 10, 2, 1200, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { spellpower: 1, initiative: 1 }, null, enum_aset.great_hunter),
  new Artefact('gm_kastet', 'Кастет великого охотника', 6, 10, 8, 1200, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, initiative: 4 }, null, enum_aset.great_hunter),
  new Artefact('gm_sring', 'Кольцо ловкости в. охотника', 7, 10, 4, 1200, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, initiative: 3 }, null, enum_aset.great_hunter),
  new Artefact('gm_abow', 'Лук великого охотника', 7, 10, 6, 1200, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, null, null, enum_aset.great_hunter),
  new Artefact('gm_protect', 'Маскхалат великого охотника', 7, 10, 6, 1200, enum_ac.hunter, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { range_combat_protection: 20 }, enum_aset.great_hunter),
  new Artefact('gm_sword', 'Меч великого охотника', 7, 10, 8, 1200, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3 }, { increase_close_combat_damage: 15 }, enum_aset.great_hunter),
  new Artefact('gm_spdb', 'Сапоги великого охотника', 6, 10, 2, 1200, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 1, initiative: 3 }, null, enum_aset.great_hunter),
  new Artefact('gm_3arrows', 'Стрелы великого охотника', 6, 10, 5, 1200, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.other, null, null, enum_aset.great_hunter),
  new Artefact('gm_hat', 'Шлем великого охотника', 7, 10, 4, 1200, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, knowledge: 1 }, null, enum_aset.great_hunter),
  new Artefact('gm_defence', 'Щит великого охотника', 7, 10, 5, 1200, enum_ac.hunter, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 3, initiative: 2 }, null, enum_aset.great_hunter),

  // hunter -> beastbane
  new Artefact('sh_amulet2', 'Амулет зверобоя', 9, 15, 7, 2400, enum_ac.hunter, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, initiative: 3, luck: 1 }, null, enum_aset.beastbane),
  new Artefact('sh_armor', 'Броня зверобоя', 10, 15, 7, 2400, enum_ac.hunter, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, initiative: 4 }, null, enum_aset.beastbane),
  new Artefact('sh_ring1', 'Кольцо ловкости зверобоя', 10, 15, 6, 2400, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, initiative: 4 }, null, enum_aset.beastbane),
  new Artefact('sh_ring2', 'Кольцо силы зверобоя', 10, 15, 4, 2400, enum_ac.hunter, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, initiative: 1 }, null, enum_aset.beastbane),
  new Artefact('sh_spear', 'Копьё зверобоя', 9, 15, 10, 2400, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10 }, null, enum_aset.beastbane),
  new Artefact('sh_bow', 'Лук зверобоя', 11, 15, 8, 2400, enum_ac.hunter, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1 }, null, enum_aset.beastbane),
  new Artefact('sh_cloak', 'Маскхалат зверобоя', 10, 15, 8, 2400, enum_ac.hunter, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null, { range_combat_protection: 25 }, enum_aset.beastbane),
  new Artefact('sh_sword', 'Меч зверобоя', 10, 15, 10, 2400, enum_ac.hunter, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4 }, { increase_close_combat_damage: 20 }, enum_aset.beastbane),
  new Artefact('sh_boots', 'Сапоги зверобоя', 9, 15, 4, 2400, enum_ac.hunter, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, initiative: 4 }, null, enum_aset.beastbane),
  new Artefact('sh_4arrows', 'Стрелы зверобоя', 9, 15, 7, 2400, enum_ac.hunter, enum_at.weapon, enum_as.left_arm, enum_amc.other, { attack: 1 }, null, enum_aset.beastbane),
  new Artefact('sh_helmet', 'Шлем зверобоя', 10, 15, 6, 2400, enum_ac.hunter, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, knowledge: 1, initiative: 1 }, null, enum_aset.beastbane),
  new Artefact('sh_shield', 'Щит зверобоя', 10, 15, 7, 2400, enum_ac.hunter, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 3 }, null, enum_aset.beastbane),

  // thief arts
  // thief -> thief
  new Artefact('thief_neckl', 'Амулет вора', 7, 60, 8, 8000, enum_ac.thief, enum_at.jewelry, enum_as.neck, enum_amc.thief, { initiative: 4, morale: 1, luck: 1 }, null, enum_aset.thief),
  new Artefact('thief_arb', 'Арбалет вора', 7, 60, 9, 8000, enum_ac.thief, enum_at.weapon, enum_as.right_arm, enum_amc.thief, { attack: 4, initiative: 3 }, null, enum_aset.thief),
  new Artefact('thief_goodarmor', 'Доспехи вора', 7, 60, 6, 8000, enum_ac.thief, enum_at.armor, enum_as.body, enum_amc.thief, { defence: 4, initiative: 2 }, null, enum_aset.thief),
  new Artefact('thief_ml_dagger', 'Кинжал вора', 7, 60, 7, 8000, enum_ac.thief, enum_at.weapon, enum_as.left_arm, enum_amc.thief, { attack: 1, defence: 1, initiative: 2 }, { increase_close_combat_damage: 10 }, enum_aset.thief),
  new Artefact('ring_of_thief', 'Кольцо вора', 7, 60, 5, 8000, enum_ac.thief, enum_at.jewelry, enum_as.ring, enum_amc.thief, { initiative: 6 }, null, enum_aset.thief),
  new Artefact('thief_msk', 'Маска вора', 7, 60, 5, 8000, enum_ac.thief, enum_at.armor, enum_as.head, enum_amc.thief, { defence: 2, initiative: 3 }, null, enum_aset.thief),
  new Artefact('thief_cape', 'Плащ вора', 7, 60, 5, 8000, enum_ac.thief, enum_at.jewelry, enum_as.rear, enum_amc.thief, null, { range_combat_protection: 24 }, enum_aset.thief),
  new Artefact('thief_fastboots', 'Сапоги вора', 7, 60, 6, 8000, enum_ac.thief, enum_at.armor, enum_as.foots, enum_amc.thief, { defence: 3, initiative: 3 }, null, enum_aset.thief),

  // thief -> plunderer
  new Artefact('tm_amulet', 'Амулет налётчика', 13, 60, 11, 24000, enum_ac.thief, enum_at.jewelry, enum_as.neck, enum_amc.thief, { attack: 1, initiative: 5, morale: 1, luck: 1 }, null, enum_aset.plunderer),
  new Artefact('tm_arb', 'Арбалет налётчика', 13, 60, 12, 24000, enum_ac.thief, enum_at.weapon, enum_as.right_arm, enum_amc.thief, { attack: 5, initiative: 4 }, null, enum_aset.plunderer),
  new Artefact('tm_armor', 'Доспехи налётчика', 13, 60, 10, 24000, enum_ac.thief, enum_at.armor, enum_as.body, enum_amc.thief, { defence: 5, initiative: 4 }, { magic_protection: 9 }, enum_aset.plunderer),
  new Artefact('tm_knife', 'Кинжал налётчика', 13, 60, 11, 24000, enum_ac.thief, enum_at.weapon, enum_as.left_arm, enum_amc.thief, { attack: 2, initiative: 3 }, { increase_close_combat_damage: 13 }, enum_aset.plunderer),
  new Artefact('tm_mring', 'Колдовское кольцо налётчика', 13, 60, 8, 24000, enum_ac.thief, enum_at.jewelry, enum_as.ring, enum_amc.thief, { spellpower: 1, knowledge: 2 }, { hero_initiative: 3 }, enum_aset.plunderer),
  new Artefact('tm_wring', 'Кольцо налётчика', 13, 60, 8, 24000, enum_ac.thief, enum_at.jewelry, enum_as.ring, enum_amc.thief, { attack: 2, initiative: 6 }, null, enum_aset.plunderer),
  new Artefact('tm_msk', 'Маска налётчика', 13, 60, 8, 24000, enum_ac.thief, enum_at.armor, enum_as.head, enum_amc.thief, { defence: 3, initiative: 4 }, { magic_protection: 9 }, enum_aset.plunderer),
  new Artefact('tm_cape', 'Плащ налётчика', 13, 60, 7, 24000, enum_ac.thief, enum_at.jewelry, enum_as.rear, enum_amc.thief, { initiative: 1 }, { range_combat_protection: 30 }, enum_aset.plunderer),
  new Artefact('tm_boots', 'Сапоги налётчика', 13, 60, 8, 24000, enum_ac.thief, enum_at.armor, enum_as.foots, enum_amc.thief, { defence: 3, initiative: 4 }, { magic_protection: 9 }, enum_aset.plunderer),

  // ranger
  new Artefact('r_warriorsamulet', 'Амулет удачи рейнджера', 11, 70, 11, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.neck, enum_amc.relict, { initiative: 6, luck: 2 }, null, enum_aset.ranger),
  new Artefact('r_m_amulet', 'Амулет энергии рейнджера', 11, 70, 11, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.neck, enum_amc.relict, { spellpower: 2, knowledge: 3, initiative: 1 }, null, enum_aset.ranger),
  new Artefact('r_zarmor', 'Жилет рейнджера', 11, 70, 10, 36000, enum_ac.ranger, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 3, initiative: 3 }, { magic_protection: 12, close_combat_protection: 9 }, enum_aset.ranger),
  new Artefact('r_dagger', 'Кинжал рейнджера', 11, 70, 8, 36000, enum_ac.ranger, enum_at.weapon, enum_as.left_arm, enum_amc.relict, { attack: 2, defence: 3, initiative: 3 }, null, enum_aset.ranger),
  new Artefact('r_magicsring', 'Кольцо духа рейнджера', 11, 70, 7, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.ring, enum_amc.relict, { spellpower: 1, knowledge: 2, initiative: 1 }, null, enum_aset.ranger),
  new Artefact('r_warring', 'Кольцо ловкости рейнджера', 11, 70, 7, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.ring, enum_amc.relict, { attack: 1, initiative: 3, morale: 1 }, null, enum_aset.ranger),
  new Artefact('r_bow', 'Лук рейнджера', 11, 70, 7, 36000, enum_ac.ranger, enum_at.weapon, enum_as.rear, enum_amc.relict, null, { increase_range_combat_damage: 20 }, enum_aset.ranger),
  new Artefact('r_bigsword', 'Меч рейнджера', 11, 70, 13, 36000, enum_ac.ranger, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 7, initiative: 2 }, { increase_close_combat_damage: 11 }, enum_aset.ranger),
  new Artefact('r_clck', 'Плащ рейнджера', 11, 70, 11, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.rear, enum_amc.relict, { spellpower: 3, initiative: 1 }, { range_combat_protection: 10 }, enum_aset.ranger),
  new Artefact('r_magy_staff', 'Посох рейнджера', 11, 70, 13, 36000, enum_ac.ranger, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 1, spellpower: 3, knowledge: 2, initiative: 2 }, null, enum_aset.ranger),
  new Artefact('r_bootsmb', 'Сапоги рейнджера', 11, 70, 10, 36000, enum_ac.ranger, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 3, initiative: 3 }, { magic_protection: 12, close_combat_protection: 5 }, enum_aset.ranger),
  new Artefact('r_goodscroll', 'Свиток рейнджера', 11, 70, 9, 36000, enum_ac.ranger, enum_at.jewelry, enum_as.left_arm, enum_amc.relict, { spellpower: 2, knowledge: 2 }, null, enum_aset.ranger),
  new Artefact('r_helmb', 'Шлем рейнджера', 11, 70, 10, 36000, enum_ac.ranger, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 3, initiative: 3 }, { magic_protection: 12, close_combat_protection: 4 }, enum_aset.ranger),

  //tactic
  new Artefact('tact1w1_wamulet', 'Боевой кулон тактика', 13, 75, 10, 40000, enum_ac.tactic, enum_at.jewelry, enum_as.neck, enum_amc.tactic, { attack: 3, defence: 2, initiative: 5 }, null, enum_aset.tactician),
  new Artefact('tactcv1_armor', 'Доспех тактика', 13, 75, 9, 40000, enum_ac.tactic, enum_at.armor, enum_as.body, enum_amc.tactic, { defence: 6 }, { magic_protection: 7, close_combat_protection: 7 }, enum_aset.tactician),
  new Artefact('tactsm0_dagger', 'Кинжал тактика', 13, 75, 8, 40000, enum_ac.tactic, enum_at.weapon, enum_as.left_arm, enum_amc.tactic, { attack: 3, defence: 2 }, { increase_close_combat_damage: 7 }, enum_aset.tactician),
  new Artefact('tactspw_mring', 'Кольцо мудрости тактика', 13, 75, 7, 40000, enum_ac.tactic, enum_at.jewelry, enum_as.ring, enum_amc.tactic, { spellpower: 3 }, null, enum_aset.tactician),
  new Artefact('tactwww_wring', 'Кольцо силы тактика', 13, 75, 7, 40000, enum_ac.tactic, enum_at.jewelry, enum_as.ring, enum_amc.tactic, { attack: 4, initiative: 2 }, null, enum_aset.tactician),
  new Artefact('tact765_bow', 'Лук тактика', 13, 75, 7, 40000, enum_ac.tactic, enum_at.weapon, enum_as.rear, enum_amc.tactic, { attack: 1 }, { increase_range_combat_damage: 17 }, enum_aset.tactician),
  new Artefact('tactms1_mamulet', 'Магический амулет тактика', 13, 75, 10, 40000, enum_ac.tactic, enum_at.jewelry, enum_as.neck, enum_amc.tactic, { spellpower: 5 }, null, enum_aset.tactician),
  new Artefact('tactpow_cloack', 'Плащ тактика', 13, 75, 9, 40000, enum_ac.tactic, enum_at.jewelry, enum_as.rear, enum_amc.tactic, { spellpower: 3 }, null, enum_aset.tactician),
  new Artefact('tactmag_staff', 'Посох тактика', 13, 75, 10, 40000, enum_ac.tactic, enum_at.weapon, enum_as.right_arm, enum_amc.tactic, { defence: 1, spellpower: 5 }, null, enum_aset.tactician),
  new Artefact('tactzl4_boots', 'Сапоги тактика', 13, 75, 9, 40000, enum_ac.tactic, enum_at.armor, enum_as.foots, enum_amc.tactic, { defence: 5, initiative: 1 }, { magic_protection: 7, close_combat_protection: 3 }, enum_aset.tactician),
  new Artefact('tactaz_axe', 'Топор тактика', 13, 75, 11, 40000, enum_ac.tactic, enum_at.weapon, enum_as.right_arm, enum_amc.tactic, { attack: 7, defence: 1 }, { increase_close_combat_damage: 10 }, enum_aset.tactician),
  new Artefact('tacthapp_helmet', 'Шлем тактика', 13, 75, 8, 40000, enum_ac.tactic, enum_at.armor, enum_as.head, enum_amc.tactic, { defence: 5 }, { magic_protection: 5, close_combat_protection: 3 }, enum_aset.tactician),
  new Artefact('tactdff_shield', 'Щит тактика', 13, 75, 8, 40000, enum_ac.tactic, enum_at.armor, enum_as.left_arm, enum_amc.tactic, { attack: 1, defence: 4 }, { range_combat_protection: 15 }, enum_aset.tactician),

  // recruit
  new Artefact('v_1armor', 'Доспех вербовщика', 13, 90, 9, 48000, enum_ac.recruit, enum_at.armor, enum_as.body, enum_amc.verb, { defence: 4 }, { magic_protection: 12, close_combat_protection: 12 }, enum_aset.recruiter),
  new Artefact('verb11_sword', 'Меч вербовщика', 13, 90, 11, 48000, enum_ac.recruit, enum_at.weapon, enum_as.right_arm, enum_amc.verb, { attack: 8, defence: 2 }, { increase_close_combat_damage: 5 }, enum_aset.recruiter),
  new Artefact('verbboots', 'Сапоги вербовщика', 13, 90, 9, 48000, enum_ac.recruit, enum_at.armor, enum_as.foots, enum_amc.verb, { defence: 4 }, { magic_protection: 10, close_combat_protection: 5 }, enum_aset.recruiter),
  new Artefact('ve_helm', 'Шлем вербовщика', 13, 90, 8, 48000, enum_ac.recruit, enum_at.armor, enum_as.head, enum_amc.verb, { defence: 4 }, { magic_protection: 10, close_combat_protection: 5 }, enum_aset.recruiter),
  new Artefact('vrb_shild', 'Щит вербовщика', 13, 90, 8, 48000, enum_ac.recruit, enum_at.armor, enum_as.left_arm, enum_amc.verb, { defence: 4 }, { range_combat_protection: 20 }, enum_aset.recruiter),

  // war
  new Artefact('tl_medal1', 'Tiger`s Lake медаль 1-й степени', 3, 50, 9, 32000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 3, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('tl_medal2', 'Tiger`s Lake медаль 2-й степени', 3, 40, 4, 16000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('tl_medal3', 'Tiger`s Lake медаль 3-й степени', 3, 30, 3, 6000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { defence: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar1', 'Имперская медаль 1-й степени', 8, 1, 15, 60000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 4, defence: 4, initiative: 5, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar1', 'Имперская медаль 1ой степени', 8, 1, 15, 60000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 4, defence: 4, initiative: 5, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar1', 'Имперская медаль 1ой степени', 8, 70, 15, 60000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 4, defence: 4, initiative: 5, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar2', 'Имперская медаль 2-й степени', 7, 1, 12, 48000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 4, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar2', 'Имперская медаль 2ой степени', 7, 1, 12, 48000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 4, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar2', 'Имперская медаль 2ой степени', 7, 65, 12, 48000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 4, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar3', 'Имперская медаль 3ей степени', 6, 1, 10, 36000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar3', 'Имперская медаль 3ей степени', 6, 60, 10, 36000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar3', 'Имперская медаль 3-й степени', 6, 1, 10, 36000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar4', 'Имперская медаль 4-й степени', 5, 1, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar4', 'Имперская медаль 4ой степени', 5, 1, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar4', 'Имперская медаль 4ой степени', 5, 55, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar5', 'Имперская медаль 5-й степени', 5, 1, 7, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar5', 'Имперская медаль 5ой степени', 5, 1, 7, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar5', 'Имперская медаль 5ой степени', 5, 50, 7, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar6', 'Имперская медаль 6-й степени', 5, 1, 6, 16000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar6', 'Имперская медаль 6ой степени', 5, 1, 6, 16000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar6', 'Имперская медаль 6ой степени', 5, 45, 6, 16000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar7', 'Имперская медаль 7-й степени', 5, 1, 5, 12000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar7', 'Имперская медаль 7ой степени', 5, 1, 5, 12000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar7', 'Имперская медаль 7ой степени', 5, 40, 5, 12000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('bunt_medal1', 'Медаль доблести 1-й степени', 3, 60, 11, 40000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 5, luck: 1 }, null, enum_aset.war),
  new Artefact('bunt_medal2', 'Медаль доблести 2-й степени', 3, 50, 6, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('bunt_medal3', 'Медаль доблести 3-й степени', 1, 40, 4, 10000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar_stoj', 'Медаль за стойкость', 5, 25, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { defence: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar_stoj', 'Медаль за стойкость', 5, 30, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { defence: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar_stoj', 'Медаль за стойкость', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { defence: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('bwar_takt', 'Медаль за тактику', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { initiative: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('gnomewar_takt', 'Медаль за тактику', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { initiative: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('kwar_takt', 'Медаль за тактику', 5, 50, 8, 28000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { initiative: 6, luck: 1 }, null, enum_aset.war),
  new Artefact('necrwar1st', 'Медаль защитника 1-ая степень', 3, 70, 14, 56000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 2, spellpower: 1, initiative: 4, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('necrwar2st', 'Медаль защитника 2-ая степень', 3, 60, 10, 36000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 2, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('necrwar3st', 'Медаль защитника 3-я степень', 3, 50, 6, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 2 }, null, enum_aset.war),
  new Artefact('necrwar4st', 'Медаль защитника 4-ая степень', 3, 40, 4, 10000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2 }, null, enum_aset.war),
  new Artefact('necrwar5st', 'Медаль защитника 5-ая степень', 3, 30, 2, 4000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2 }, null, enum_aset.war),
  new Artefact('warthief_medal1', 'Медаль противостояния 1 степени', 5, 70, 7, 18000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('warthief_medal2', 'Медаль противостояния 2 степени', 4, 60, 6, 14000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('warthief_medal3', 'Медаль противостояния 3 степени', 3, 50, 5, 10000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('warthief_medal4', 'Медаль противостояния 4 степени', 3, 40, 4, 6000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, initiative: 1 }, null, enum_aset.war),
  new Artefact('warthief_medal5', 'Медаль противостояния 5 степени', 3, 30, 3, 2000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, initiative: 1 }, null, enum_aset.war),
  new Artefact('elfwar1', 'Орден доблести 1ой степени', 3, 80, 13, 60000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 2, initiative: 5, luck: 2 }, null, enum_aset.war),
  new Artefact('elfwar2', 'Орден доблести 2ой степени', 3, 70, 11, 40000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 2, initiative: 5, luck: 1 }, null, enum_aset.war),
  new Artefact('elfwar3', 'Орден доблести 3ей степени', 3, 60, 8, 32000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('elfwar4', 'Орден доблести 4ой степени', 3, 50, 7, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('elfwar5', 'Орден доблести 5ой степени', 3, 40, 6, 10000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('elfwar6', 'Орден доблести 6ой степени', 3, 30, 4, 4000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, defence: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('magewar1', 'Орден мира 1ой степени', 5, 80, 12, 52000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, knowledge: 2, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('magewar2', 'Орден мира 2ой степени', 3, 70, 9, 40000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, knowledge: 1, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('magewar3', 'Орден мира 3ей степени', 3, 60, 7, 32000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, knowledge: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('magewar4', 'Орден мира 4ой степени', 3, 50, 5, 20000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { knowledge: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('magewar5', 'Орден мира 5ой степени', 3, 35, 4, 12000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 1, initiative: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('demwar1', 'Орден свободы 1ой степени', 3, 80, 14, 60000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 3, defence: 3, initiative: 4, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('demwar2', 'Орден свободы 2ой степени', 3, 70, 11, 44000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 3, morale: 1, luck: 1 }, null, enum_aset.war),
  new Artefact('demwar3', 'Орден свободы 3ей степени', 3, 60, 9, 36000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 2, initiative: 3, luck: 1 }, null, enum_aset.war),
  new Artefact('demwar4', 'Орден свободы 4ой степени', 3, 50, 7, 24000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.war),
  new Artefact('demwar5', 'Орден свободы 5ой степени', 3, 40, 5, 16000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, defence: 1, initiative: 2 }, null, enum_aset.war),
  new Artefact('demwar6', 'Орден свободы 6ой степени', 3, 30, 4, 8000, enum_ac.war, enum_at.jewelry, enum_as.neck, enum_amc.medals, { attack: 2, initiative: 2 }, null, enum_aset.war),

  // relict
  // relict -> barbarian_warrior
  new Artefact('barb_armor', 'Броня варвара-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { attack: 2, defence: 4 }, null, enum_aset.barbarian_warrior),
  new Artefact('barb_club', 'Дубина варвара-воина', 3, 100, 7, 40000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 5, defence: 2 }, null, enum_aset.barbarian_warrior),
  new Artefact('barb_boots', 'Сапоги варвара-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { attack: 1, defence: 1, initiative: 4 }, null, enum_aset.barbarian_warrior),
  new Artefact('barb_helm', 'Шлем варвара-воина', 3, 100, 4, 40000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { attack: 2, defence: 2 }, null, enum_aset.barbarian_warrior),
  new Artefact('barb_shield', 'Щит варвара-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { attack: 2, defence: 4 }, null, enum_aset.barbarian_warrior),

  // relict -> apprentice_necromancer
  new Artefact('necr_amulet', 'Амулет некроманта-ученика', 3, 100, 8, 40000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { defence: 2, spellpower: 1, knowledge: 2 }, null, enum_aset.apprentice_necromancer),
  new Artefact('necr_helm', 'Капюшон некроманта-ученика', 3, 100, 7, 40000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 2, spellpower: 1, knowledge: 2 }, null, enum_aset.apprentice_necromancer),
  new Artefact('necr_staff', 'Посох некроманта-ученика', 3, 100, 10, 40000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 1, defence: 1, spellpower: 2, knowledge: 2 }, null, enum_aset.apprentice_necromancer),
  new Artefact('necr_robe', 'Халат некроманта-ученика', 3, 100, 7, 40000, enum_ac.relict, enum_at.armor, enum_as.rear, enum_amc.relict, { defence: 1, spellpower: 1, knowledge: 2 }, null, enum_aset.apprentice_necromancer),

  // relict -> mercenary
  new Artefact('merc_armor', 'Броня наёмника-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 5, initiative: 1 }, null, enum_aset.mercenary),
  new Artefact('merc_dagger', 'Кинжал наёмника-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.weapon, enum_as.left_arm, enum_amc.relict, { attack: 2, defence: 2, initiative: 2 }, null, enum_aset.mercenary),
  new Artefact('merc_sword', 'Меч наёмника-воина', 3, 100, 8, 40000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 3, defence: 2, initiative: 3 }, null, enum_aset.mercenary),
  new Artefact('merc_boots', 'Сапоги наёмника-воина', 3, 100, 6, 40000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 1, initiative: 5 }, null, enum_aset.mercenary),

  // relict -> elven_scout
  new Artefact('elfamulet', 'Амулет эльфа-скаута', 3, 100, 9, 50000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { initiative: 5, luck: 2 }, null, enum_aset.elven_scout),
  new Artefact('elfbow', 'Лук эльфа-скаута', 3, 100, 8, 50000, enum_ac.relict, enum_at.weapon, enum_as.rear, enum_amc.relict, null, { increase_range_combat_damage: 25 }, enum_aset.elven_scout),
  new Artefact('elfshirt', 'Рубаха эльфа-скаута', 3, 100, 7, 50000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 2, initiative: 5 }, null, enum_aset.elven_scout),
  new Artefact('elfboots', 'Сапоги эльфа-скаута', 3, 100, 7, 50000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 2, initiative: 5 }, null, enum_aset.elven_scout),

  // relict -> servant_of_darkness
  new Artefact('darkelfkaska', 'Венец слуги тьмы', 3, 100, 6, 50000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 2, spellpower: 1, knowledge: 1 }, null, enum_aset.servant_of_darkness),
  new Artefact('darkelfciras', 'Кираса слуги тьмы', 3, 100, 7, 50000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 3, spellpower: 2 }, null, enum_aset.servant_of_darkness),
  new Artefact('darkelfpendant', 'Кулон слуги тьмы', 3, 100, 9, 50000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { attack: 1, spellpower: 3, knowledge: 1 }, null, enum_aset.servant_of_darkness),
  new Artefact('darkelfcloack', 'Плащ слуги тьмы', 3, 100, 6, 50000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { defence: 2, spellpower: 2 }, null, enum_aset.servant_of_darkness),
  new Artefact('darkelfstaff', 'Посох слуги тьмы', 3, 100, 10, 50000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 2, spellpower: 3, knowledge: 1 }, null, enum_aset.servant_of_darkness),
  new Artefact('darkelfboots', 'Сапоги слуги тьмы', 3, 100, 7, 50000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 3, spellpower: 1, initiative: 2 }, null, enum_aset.servant_of_darkness),

  // relict -> demonic_soldier
  new Artefact('dem_amulet', 'Амулет демона-воина', 5, 100, 12, 50000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { attack: 3, defence: 2, spellpower: 1, knowledge: 1, initiative: 1 }, null, enum_aset.demonic_soldier),
  new Artefact('dem_armor', 'Броня демона-воина', 5, 100, 9, 50000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 5, spellpower: 2 }, { magic_protection: 3, close_combat_protection: 4 }, enum_aset.demonic_soldier),
  new Artefact('dem_bootshields', 'Стальные щитки демона-воина', 5, 100, 8, 50000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { attack: 2, defence: 5 }, { close_combat_protection: 4 }, enum_aset.demonic_soldier),
  new Artefact('dem_axe', 'Топор демона-воина', 5, 100, 12, 50000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 6, spellpower: 2 }, null, enum_aset.demonic_soldier),
  new Artefact('dem_helmet', 'Шлем демона-воина', 5, 100, 9, 50000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 4, knowledge: 2 }, { close_combat_protection: 3 }, enum_aset.demonic_soldier),
  new Artefact('dem_shield', 'Щит демона-воина', 5, 100, 8, 50000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { attack: 2, defence: 5 }, { close_combat_protection: 4 }, enum_aset.demonic_soldier),

  // relict -> mage_disciple
  new Artefact('mage_cape', 'Плащ мага-ученика', 6, 100, 6, 60000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { spellpower: 1, knowledge: 2 }, null, enum_aset.mage_disciple),
  new Artefact('mage_staff', 'Посох мага-ученика', 6, 100, 11, 60000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 1, spellpower: 2, knowledge: 3 }, null, enum_aset.mage_disciple),
  new Artefact('mage_robe', 'Роба мага-ученика', 6, 100, 7, 60000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 1, spellpower: 1, knowledge: 2 }, null, enum_aset.mage_disciple),
  new Artefact('mage_boots', 'Сапоги мага-ученика', 6, 100, 7, 60000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 2, knowledge: 1, initiative: 3 }, null, enum_aset.mage_disciple),
  new Artefact('mage_scroll', 'Свиток мага-ученика', 6, 100, 8, 60000, enum_ac.relict, enum_at.jewelry, enum_as.left_arm, enum_amc.relict, { spellpower: 2, knowledge: 2 }, null, enum_aset.mage_disciple),
  new Artefact('mage_hat', 'Шляпа мага-ученика', 6, 100, 6, 60000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { spellpower: 1, knowledge: 2 }, null, enum_aset.mage_disciple),

  // relict -> dwarf_warrior
  new Artefact('gnomearmor', 'Доспех гнома-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 6 }, null, enum_aset.dwarf_warrior),
  new Artefact('gnomehammer', 'Молот гнома-воина', 7, 100, 9, 44000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 6, defence: 3 }, null, enum_aset.dwarf_warrior),
  new Artefact('gnomeboots', 'Сапоги гнома-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 5 }, null, enum_aset.dwarf_warrior),
  new Artefact('gnomehelmet', 'Шлем гнома-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 5 }, null, enum_aset.dwarf_warrior),
  new Artefact('gnomeshield', 'Щит гнома-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { defence: 6 }, null, enum_aset.dwarf_warrior),

  // relict -> dwarf_craftsman
  new Artefact('gnomem_amulet', 'Амулет гнома-мастера', 11, 100, 11, 64000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { attack: 5, initiative: 3, luck: 1 }, null, enum_aset.dwarf_craftsman),
  new Artefact('gnomem_armor', 'Доспех гнома-мастера', 11, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 5, initiative: 1 }, { magic_protection: 10 }, enum_aset.dwarf_craftsman),
  new Artefact('gnomem_hammer', 'Молот гнома-мастера', 11, 100, 10, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 5, defence: 2, initiative: 1 }, { increase_close_combat_damage: 10 }, enum_aset.dwarf_craftsman),
  new Artefact('gnomem_boots', 'Сапоги гнома-мастера', 11, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 4, initiative: 1 }, { magic_protection: 10 }, enum_aset.dwarf_craftsman),
  new Artefact('gnomem_helmet', 'Шлем гнома-мастера', 11, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 4 }, { magic_protection: 10 }, enum_aset.dwarf_craftsman),
  new Artefact('gnomem_shield', 'Щит гнома-мастера', 11, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { defence: 7 }, null, enum_aset.dwarf_craftsman),

  // relict -> mage_instructor
  new Artefact('gmage_crown', 'Корона великого мага', 13, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 2, spellpower: 1, knowledge: 2 }, null, enum_aset.mage_instructor),
  new Artefact('gmage_cloack', 'Накидка великого мага', 13, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { spellpower: 2, knowledge: 1 }, { range_combat_protection: 10 }, enum_aset.mage_instructor),
  new Artefact('gmage_staff', 'Посох великого мага', 13, 100, 11, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 1, spellpower: 3, knowledge: 3 }, null, enum_aset.mage_instructor),
  new Artefact('gmage_armor', 'Роба великого мага', 13, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 3, spellpower: 2, knowledge: 2 }, null, enum_aset.mage_instructor),
  new Artefact('gmage_boots', 'Сапоги великого мага', 13, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 2, spellpower: 1, knowledge: 1 }, { hero_initiative: 15 }, enum_aset.mage_instructor),
  new Artefact('gmage_scroll', 'Свиток великого мага', 13, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.left_arm, enum_amc.relict, { spellpower: 3, knowledge: 2 }, null, enum_aset.mage_instructor),

  // relict -> warrior_elf
  new Artefact('welfarmor', 'Доспех эльфа-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 4, initiative: 3 }, null, enum_aset.warrior_elf),
  new Artefact('welfbow', 'Лук эльфа-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.weapon, enum_as.rear, enum_amc.relict, { initiative: 1 }, { increase_range_combat_damage: 12 }, enum_aset.warrior_elf),
  new Artefact('welfsword', 'Меч эльфа-воина', 7, 100, 9, 44000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 7, initiative: 3 }, null, enum_aset.warrior_elf),
  new Artefact('welfboots', 'Поножи эльфа-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 3, initiative: 3 }, null, enum_aset.warrior_elf),
  new Artefact('welfhelmet', 'Шлем эльфа-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 2, initiative: 3 }, null, enum_aset.warrior_elf),
  new Artefact('welfshield', 'Щит эльфа-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { defence: 3, initiative: 3 }, null, enum_aset.warrior_elf),

  // relict -> druid
  new Artefact('druid_amulet', 'Амулет друида', 13, 100, 11, 64000, enum_ac.relict, enum_at.jewelry, enum_as.neck, enum_amc.relict, { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 2, morale: 1, luck: 1 }, null, enum_aset.druid),
  new Artefact('druid_cloack', 'Плащ друида', 13, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { spellpower: 1, knowledge: 1, initiative: 3 }, { magic_protection: 5, range_combat_protection: 10 }, enum_aset.druid),
  new Artefact('druid_staff', 'Посох друида', 13, 100, 11, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 6, spellpower: 1, knowledge: 1, initiative: 3 }, null, enum_aset.druid),
  new Artefact('druid_armor', 'Роба друида', 13, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 4, knowledge: 1, initiative: 3 }, { magic_protection: 5 }, enum_aset.druid),
  new Artefact('druid_boots', 'Сапоги друида', 13, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 3, knowledge: 1, initiative: 3 }, { magic_protection: 5 }, enum_aset.druid),

  // relict -> militant
  new Artefact('knightarmor', 'Доспех рыцаря-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { attack: 1, defence: 5 }, null, enum_aset.militant),
  new Artefact('knightsword', 'Меч рыцаря-воина', 7, 100, 9, 44000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 7, defence: 2 }, null, enum_aset.militant),
  new Artefact('knightboots', 'Сапоги рыцаря-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { attack: 1, defence: 4 }, null, enum_aset.militant),
  new Artefact('knighthelmet', 'Шлем рыцаря-воина', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { attack: 1, defence: 4 }, null, enum_aset.militant),
  new Artefact('knightshield', 'Щит рыцаря-воина', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { attack: 1, defence: 5 }, null, enum_aset.militant),

  // relict -> paladin
  new Artefact('paladin_bow', 'Арбалет паладина', 13, 100, 8, 64000, enum_ac.relict, enum_at.weapon, enum_as.rear, enum_amc.relict, { attack: 3 }, { increase_range_combat_damage: 10 }, enum_aset.paladin),
  new Artefact('paladin_armor', 'Доспех паладина', 13, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 6, knowledge: 1 }, { magic_protection: 5 }, enum_aset.paladin),
  new Artefact('paladin_sword', 'Меч паладина', 13, 100, 11, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 3, defence: 3, spellpower: 1, knowledge: 1 }, { increase_close_combat_damage: 15 }, enum_aset.paladin),
  new Artefact('paladin_boots', 'Сапоги паладина', 13, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 5, knowledge: 1 }, { magic_protection: 5 }, enum_aset.paladin),
  new Artefact('paladin_helmet', 'Шлем паладина', 13, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 4, knowledge: 1 }, { magic_protection: 5 }, enum_aset.paladin),
  new Artefact('paladin_shield', 'Щит паладина', 13, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { defence: 6 }, { range_combat_protection: 10 }, enum_aset.paladin),

  // relict -> tribal
  new Artefact('sv_arb', 'Арбалет степного варвара', 14, 100, 8, 64000, enum_ac.relict, enum_at.weapon, enum_as.rear, enum_amc.relict, { attack: 5 }, { increase_range_combat_damage: 15 }, enum_aset.tribal),
  new Artefact('sv_body', 'Доспех степного варвара', 14, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { attack: 3, defence: 5 }, { magic_protection: 5 }, enum_aset.tribal),
  new Artefact('sv_weap', 'Дубина степного варвара', 14, 100, 11, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 8 }, { increase_close_combat_damage: 20 }, enum_aset.tribal),
  new Artefact('sv_boot', 'Сапоги степного варвара', 14, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { attack: 2, defence: 3 }, { magic_protection: 5 }, enum_aset.tribal),
  new Artefact('sv_helm', 'Шлем степного варвара', 14, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { attack: 3, defence: 3 }, { magic_protection: 5 }, enum_aset.tribal),
  new Artefact('sv_shield', 'Щит степного варвара', 14, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { attack: 4, defence: 2 }, { range_combat_protection: 6 }, enum_aset.tribal),

  // relict -> unruly_barbarian
  new Artefact('nv_body', 'Доспех непокорного варвара', 11, 100, 7, 56000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { attack: 1, defence: 5, initiative: 1 }, null, enum_aset.unruly_barbarian),
  new Artefact('nv_weap', 'Меч непокорного варвара', 11, 100, 10, 56000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 10 }, null, enum_aset.unruly_barbarian),
  new Artefact('nv_boot', 'Сапоги непокорного варвара', 11, 100, 6, 56000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { attack: 1, defence: 4, initiative: 1 }, null, enum_aset.unruly_barbarian),
  new Artefact('nv_helm', 'Шлем непокорного варвара', 11, 100, 6, 56000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { attack: 1, defence: 4, initiative: 1 }, null, enum_aset.unruly_barbarian),
  new Artefact('nv_shield', 'Щит непокорного варвара', 11, 100, 7, 56000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { attack: 2, defence: 4, initiative: 1 }, null, enum_aset.unruly_barbarian),

  // relict -> templar
  new Artefact('kn_body', 'Доспех рыцаря солнца', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 6 }, null, enum_aset.templar),
  new Artefact('kn_weap', 'Меч рыцаря солнца', 7, 100, 9, 44000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 5, defence: 4 }, null, enum_aset.templar),
  new Artefact('kn_helm', 'Шлем рыцаря солнца', 7, 100, 5, 44000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 5 }, null, enum_aset.templar),
  new Artefact('kn_shield', 'Щит рыцаря солнца', 7, 100, 6, 44000, enum_ac.relict, enum_at.armor, enum_as.left_arm, enum_amc.relict, { defence: 6 }, null, enum_aset.templar),

  // relict -> inquisitor
  new Artefact('inq_body', 'Доспех инквизитора', 14, 100, 9, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { defence: 6, knowledge: 2 }, { magic_protection: 7 }, enum_aset.inquisitor),
  new Artefact('inq_cl', 'Плащ инквизитора', 14, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { defence: 4, spellpower: 1 }, { magic_protection: 7, range_combat_protection: 15 }, enum_aset.inquisitor),
  new Artefact('inq_weap', 'Посох инквизитора', 14, 100, 12, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 5, defence: 5, spellpower: 1, knowledge: 1 }, null, enum_aset.inquisitor),
  new Artefact('inq_boot', 'Сапоги инквизитора', 14, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { defence: 5, knowledge: 2 }, { magic_protection: 7 }, enum_aset.inquisitor),
  new Artefact('inq_helm', 'Шлем инквизитора', 14, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 3, knowledge: 2 }, { magic_protection: 5 }, enum_aset.inquisitor),

  // relict -> amphibian
  new Artefact('amf_body', 'Доспех амфибии', 14, 100, 8, 64000, enum_ac.relict, enum_at.armor, enum_as.body, enum_amc.relict, { attack: 1, defence: 2, spellpower: 3, knowledge: 1 }, null, enum_aset.amphibian),
  new Artefact('amf_cl', 'Накидка амфибии', 14, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.rear, enum_amc.relict, { defence: 1, spellpower: 3, knowledge: 1 }, null, enum_aset.amphibian),
  new Artefact('amf_boot', 'Поножи амфибии', 14, 100, 7, 64000, enum_ac.relict, enum_at.armor, enum_as.foots, enum_amc.relict, { spellpower: 3, knowledge: 1 }, { hero_initiative: 10 }, enum_aset.amphibian),
  new Artefact('amf_weap', 'Посох амфибии', 14, 100, 11, 64000, enum_ac.relict, enum_at.weapon, enum_as.right_arm, enum_amc.relict, { attack: 1, defence: 1, spellpower: 2, knowledge: 3 }, null, enum_aset.amphibian),
  new Artefact('amf_scroll', 'Свиток амфибии', 14, 100, 8, 64000, enum_ac.relict, enum_at.jewelry, enum_as.left_arm, enum_amc.relict, { spellpower: 4 }, null, enum_aset.amphibian),
  new Artefact('amf_helm', 'Шлем амфибии', 14, 100, 6, 64000, enum_ac.relict, enum_at.armor, enum_as.head, enum_amc.relict, { defence: 1, spellpower: 3, knowledge: 1 }, null, enum_aset.amphibian),

  // event
  new Artefact('16amul', 'Амулет баланса', 4, 16, Math.floor(hero_lvl/2), 16161, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: Math.floor(hero_lvl/4), defence: Math.floor(hero_lvl/4), spellpower: Math.floor(hero_lvl/8), knowledge: Math.floor(hero_lvl/8), initiative: Math.floor(hero_lvl/4)}, null),
  new Artefact('8amul_inf', 'Амулет бесконечности', 3, 8, 8, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: Math.floor(hero_lvl/6), defence: 1, knowledge: 1 + Math.floor(hero_lvl/7), initiative: 1 + Math.floor(hero_lvl/6) }),
  new Artefact('quest_pendant1', 'Амулет буйвола', 1, 20, 1, 600, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1 }),
  new Artefact('9amu_let', 'Амулет девятилетия', 3, 9, 4, 18000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, luck: 1 }),
  new Artefact('trinitypendant', 'Амулет троицы', 7, 50, 7, 6400, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, spellpower: 1, initiative: 4 }),
  new Artefact('sunart2', 'Арбалет солнца', 8, 20, 9, 28000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, defence: 4, initiative: 2 }, { increase_range_combat_damage: 7 }),
  new Artefact('a_mallet', 'Аукционный молоточек', 3, 10000, 1, 40, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 1 }),
  new Artefact('buben2', 'Бубен шамана', 9, 1, 11, 12800, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, defence: 3, spellpower: 2, knowledge: 1, initiative: 4 }),
  new Artefact('icecr1', 'Большой ледяной кристалл', 17, 1, 8, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 1 }, { increase_close_combat_damage: 9, increase_range_combat_damage: 9 }),
  new Artefact('totem1', 'Большой племенной тотем', 13, 70, 6, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, initiative: 3 }),
  new Artefact('icesphere1', 'Великая ледяная сфера', 17, 1, 7, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 1 }, { increase_close_combat_damage: 8, increase_range_combat_damage: 8 }),
  new Artefact('chains1', 'Великая окова эпох', 16, 1, 8, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 5, defence: 3, spellpower: 1, knowledge: 1, initiative: 2 }, null),
  new Artefact('mechanic_glasses1', 'Великие очки механика', 15, 1, 12, 8000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, spellpower: 2, knowledge: 3, initiative: 3 }),
  new Artefact('buben1', 'Великий бубен шамана', 15, 1, 14, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 4, spellpower: 2, knowledge: 2, initiative: 4 }),
  new Artefact('icebow1', 'Великий лук снегоходца', 17, 1, 11, 15200, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, initiative: 3 }, { increase_close_combat_damage: 14, increase_range_combat_damage: 26 }),
  new Artefact('anomal_ring1', 'Великое кольцо аномалий', 16, 1, 15, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 5, defence: 1, spellpower: 1, knowledge: 1, initiative: 6 }, { hero_initiative: 5 }),
  new Artefact('mart8_ring1', 'Весеннее колечко', 1, 8, 5, 400, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.relict, { initiative: 5 }),
  new Artefact('mart8_flowers1', 'Весенний букет', 1, 8, 4, 8000, enum_ac.event, enum_at.jewelry, enum_as.right_arm, enum_amc.relict, { attack: 2, defence: 2 }),
  new Artefact('wolfjacket', 'Волчья шкура', 3, 15, 2, 800, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2 }),
  new Artefact('sharik', 'Волшебный шар', 3, 1, 4, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 1, initiative: 1 + Math.floor(hero_lvl/4) }),
  new Artefact('thief_paper', 'Воровское приглашение', 6, 1, 0, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other),
  new Artefact('dglef2', 'Глефа поборника тьмы', 12, 1, 16, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, spellpower: 1, knowledge: 1, initiative: 5 }, { increase_close_combat_damage: 7 }),
  new Artefact('dglef1', 'Глефа повелителя тьмы', 16, 1, 21, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 2, spellpower: 1, knowledge: 1, initiative: 7 }, { increase_close_combat_damage: 10 }),
  new Artefact('dglef3', 'Глефа служителя тьмы', 6, 1, 11, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, spellpower: 1, knowledge: 1, initiative: 3 }, { increase_close_combat_damage: 4 }),
  new Artefact('magneticarmor', 'Доспех магнитного голема', 14, 1, 14, 36000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 1, knowledge: 1 }, { magic_protection: 15, close_combat_protection: 10 }),
  new Artefact('dragonstone', 'Драконий камень', 13, 70, 4, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 2 }),
  new Artefact('dubina', 'Дубина огра', 14, 30, 11, 40000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10, initiative: -3 }, { increase_close_combat_damage: 8 }),
  new Artefact('ogre_bum', 'Дубина огра-ветерана', 14, 1, 14, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 12, initiative: -4 }, { increase_close_combat_damage: 10 }),
  new Artefact('gdubina', 'Дубинка гоблина', 6, 30, 7, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, initiative: 1 }),
  new Artefact('infdagger2', 'Жертвенный сердцекол', 12, 1, 8, 12666, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, initiative: 2 }),
  new Artefact('lizard_armor', 'Жилет из кожи ящера', 3, 15, 2, 800, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 1, initiative: 1 }),
  new Artefact('samorod2', 'Загадочный самородок', 12, 1, 6, 14000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 3 }, { magic_protection: 7 }),
  new Artefact('hopesh1', 'Закалённый хопеш', 12, 1, 14, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 1, initiative: 2 }, { increase_close_combat_damage: 11 }),
  new Artefact('mgear', 'Заколдованная шестерня', 7, 1, 6, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 3 }),
  new Artefact('5years_star', 'Звезда пятилетия', 3, 10, 5, 5000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, initiative: 5 }),
  new Artefact('mirror', 'Зеркало перемен', 5, 1, 0, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other),
  new Artefact('znamya1', 'Знамя Грифона', 3, 70, 1, 8000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.no_sell, { initiative: 1 }),
  new Artefact('krest2', 'Знамя крестоносца', 9, 1, 5, 9000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 2, initiative: 2 }),
  new Artefact('znamya2', 'Знамя Мантикоры', 3, 70, 1, 8000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.no_sell, { initiative: 1 }),
  new Artefact('kznamya1', 'Знамя Света', 3, 70, 1, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.no_sell, { attack: 1, defence: 1 }),
  new Artefact('kznamya2', 'Знамя Тьмы', 3, 70, 1, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.no_sell, { attack: 1, defence: 1 }),
  new Artefact('ankh1', 'Золотой анх', 13, 70, 7, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }),
  new Artefact('zub', 'Зуб дракона', 13, 30, 10, 40000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 5, defence: 3, initiative: 2 }),
  new Artefact('infdagger1', 'Инфернальный сердцекол', 16, 1, 11, 13666, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, initiative: 3 }),
  new Artefact('tunnel_kirka', 'Кирка шахтёра', 5, 25, 7, 4000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, initiative: 1 }),
  new Artefact('bludgeon', 'Кистень степных воинов', 10, 30, 9, 28000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, initiative: 4 }),
  new Artefact('brush', 'Кисть художника', 9, 70, 9, 19824, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.no_sell, { attack: 6, initiative: 2 }, { increase_close_combat_damage: 5 }),
  new Artefact('windsword', 'Клинок ветров', 7, 1, 10, 22000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2, defence: 2, initiative: 4 }, { increase_close_combat_damage: 5 }),
  new Artefact('pit_sword1', 'Клинок владыки бездны', 14, 1, 19, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 11, defence: 3, initiative: 3 }, { increase_close_combat_damage: 13 }),
  new Artefact('pit_sword2', 'Клинок демона бездны', 6, 1, 14, 13200, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 2, initiative: 2 }, { increase_close_combat_damage: 8 }),
  new Artefact('kniga', 'Книга знаний', 5, 40, 2, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { knowledge: 2 }),
  new Artefact('skill_book11', 'Книга умений', 3, 1, 1, 40000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack),
  new Artefact('anomal_ring2', 'Кольцо аномалий', 11, 1, 13, 18000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 1, spellpower: 1, knowledge: 1, initiative: 5 }, { hero_initiative: 4 }),
  new Artefact('17bring', 'Кольцо баланса', 4, 17, Math.floor(hero_lvl/2), 17170, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: Math.floor(hero_lvl/5), defence: Math.floor(hero_lvl/5), spellpower: Math.floor(hero_lvl/10), knowledge: Math.floor(hero_lvl/10), initiative: Math.floor(hero_lvl/5)}, null),
  new Artefact('commander_ring', 'Кольцо воеводы', 9, 70, 8, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.relict, { attack: 3, defence: 3, initiative: 1 }),
  new Artefact('testring', 'Кольцо памяти', 3, 30, 6, 40000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.relict, { attack: 1, defence: 1, spellpower: 1, knowledge: 1 }),
  new Artefact('thief_premiumring1', 'Кольцо почётного вора I ранга', 7, 70, 8, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.thief, { attack: 2, initiative: 7 }),
  new Artefact('thief_premiumring2', 'Кольцо почётного вора II ранга', 7, 65, 7, 18000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.thief, { attack: 2, initiative: 6 }),
  new Artefact('thief_premiumring3', 'Кольцо почётного вора III ранга', 6, 60, 6, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.thief, { attack: 1, initiative: 6 }),
  new Artefact('ttring', 'Кольцо равновесия', 3, 1, 4, 10800, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: Math.floor(hero_lvl/7), defence: 1 + Math.floor(hero_lvl/10), knowledge: Math.floor(hero_lvl/7), initiative: 1 }),
  new Artefact('blackring', 'Кольцо черного рыцаря', 5, 40, 4, 8000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { knowledge: 1 }),
  new Artefact('student_armor', 'Кольчуга новобранца', 3, 30, 2, 2000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 1, initiative: 1 }),
  new Artefact('pegaskop', 'Копье всадника пегаса', 12, 1, 14, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: -1, initiative: 5 }, { increase_close_combat_damage: 15 }),
  new Artefact('sunart1', 'Копьё гвардейца', 5, 20, 7, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2 }),
  new Artefact('kopie', 'Копьё гномов', 10, 30, 9, 28000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, initiative: 1 }, { increase_range_combat_damage: 8 }),
  new Artefact('pika', 'Копьё тёмного всадника', 10, 30, 9, 28000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, initiative: 1 }),
  new Artefact('trogloditkop', 'Копьё Троглодита', 7, 1, 10, 5600, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2, defence: 1, initiative: 6 }),
  new Artefact('dragon_crown', 'Корона из зубов дракона', 7, 50, 5, 6800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 1, knowledge: 1 }),
  new Artefact('necrohelm2', 'Корона лича', 8, 10, 8, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { spellpower: 4 }),
  new Artefact('dem_kosa', 'Коса рогатого жнеца', 8, 30, 9, 40000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7 }, { increase_close_combat_damage: 5 }),
  new Artefact('pouch', 'Кошелёк разбойника', 5, 70, 5, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 2 }),
  new Artefact('cubed', 'Куб прочности', 5, 45, 3, 4800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 1 }),
  new Artefact('bal_cube', 'Куб равноправия', 5, 45, 3, 4800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 1 }),
  new Artefact('cubes', 'Куб силы', 5, 50, 3, 6400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1 }),
  new Artefact('cubeg', 'Куб судьбы', 5, 60, 3, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 1, knowledge: 1, initiative: 1 }),
  new Artefact('pend_a2', 'Кулон звезды', 11, 1, 11, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, spellpower: 3, knowledge: 2, initiative: 3 }, { hero_initiative: 4 }),
  new Artefact('pend_a3', 'Кулон космоса', 6, 1, 8, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, spellpower: 2, knowledge: 1, initiative: 2 }, { hero_initiative: 3 }),
  new Artefact('pend_a1', 'Кулон сингулярности', 16, 1, 15, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, spellpower: 4, knowledge: 3, initiative: 4 }, { hero_initiative: 6 }),
  new Artefact('bshield3', 'Лёгкий щит предводителя', 5, 1, 7, 8000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 3, initiative: 1 }),
  new Artefact('icesphere2', 'Ледяная сфера', 13, 1, 6, 14400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 1 }, { increase_close_combat_damage: 6, increase_range_combat_damage: 6 }),
  new Artefact('icecr2', 'Ледяной кристалл', 13, 1, 7, 14400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 1 }, { increase_close_combat_damage: 7, increase_range_combat_damage: 7 }),
  new Artefact('goblin_bow', 'Лук гоблина', 6, 1, 8, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 3 }, { increase_range_combat_damage: 4 }),
  new Artefact('centaurbow', 'Лук кентавра', 5, 30, 5, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1 }, { increase_range_combat_damage: 11 }),
  new Artefact('sniperbow', 'Лук снайпера', 11, 1, 8, 36000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.relict, { initiative: 2 }, { increase_range_combat_damage: 20 }),
  new Artefact('icebow2', 'Лук снегоходца', 12, 1, 8, 13600, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 2 }, { increase_close_combat_damage: 11, increase_range_combat_damage: 21 }),
  new Artefact('totem3', 'Малый племенной тотем', 5, 70, 4, 8400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 2 }),
  new Artefact('10scroll', 'Манускрипт истории', 3, 1, 1, 40000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack),
  new Artefact('smaska1', 'Маска ловца снов', 16, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, knowledge: 1, initiative: 5 }),
  new Artefact('smaska3', 'Маска племенного шамана', 6, 1, 6, 12800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, knowledge: 1, initiative: 1 }),
  new Artefact('smaska2', 'Маска сноходца', 12, 1, 9, 14400, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, knowledge: 1, initiative: 4 }),
  new Artefact('icecr3', 'Мелкий ледяной кристалл', 6, 1, 6, 12800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 1 }, { increase_close_combat_damage: 5, increase_range_combat_damage: 5 }),
  new Artefact('sunart3', 'Меч воздаяния', 11, 20, 11, 32000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1 }, { increase_close_combat_damage: 8 }),
  new Artefact('sword5', 'Меч воителя', 5, 30, 5, 4000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 2 }),
  new Artefact('blacksword', 'Меч всадника тьмы', 5, 10, 10, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4 }),
  new Artefact('sunart4', 'Меч откровения', 14, 20, 12, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 2 }, { close_combat_protection: 7, increase_close_combat_damage: 7 }),
  new Artefact('dem_dmech', 'Меч пещерного демона', 5, 30, 6, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, initiative: 1 }),
  new Artefact('blacksword1', 'Меч тьмы лорда', 5, 1, 10, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, defence: 1, spellpower: 1, knowledge: 1 }),
  new Artefact('slayersword', 'Меч убийцы', 14, 30, 11, 40000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 3 }, { increase_close_combat_damage: 6 }),
  new Artefact('meshok', 'Мешок Деда Мороза', 5, 2012, 2, 2012, enum_ac.event, enum_at.untyped, enum_as.rear, enum_amc.no_sell, { defence: 2 }),
  new Artefact('meshok2', 'Мешок Снегурочки', 5, 2012, 2, 2012, enum_ac.event, enum_at.untyped, enum_as.rear, enum_amc.no_sell, { defence: 2, initiative: 1 }),
  new Artefact('icehammer3', 'Молот зимнего порядка', 6, 80, 11, 12800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, spellpower: 1, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 10, increase_range_combat_damage: 10 }),
  new Artefact('icehammer1', 'Молот ледяного правосудия', 17, 80, 18, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 1, spellpower: 1, knowledge: 1, initiative: 4 }, { increase_close_combat_damage: 20, increase_range_combat_damage: 20 }),
  new Artefact('icehammer2', 'Молот морозного закона', 12, 80, 15, 14400, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 1, spellpower: 1, knowledge: 1, initiative: 3 }, { increase_close_combat_damage: 15, increase_range_combat_damage: 15 }),
  new Artefact('molot_tan', 'Молот тана', 14, 30, 12, 40000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 2, initiative: -2 }, { increase_close_combat_damage: 9 }),
  new Artefact('13coin', 'Монетка памяти', 3, 1, 1, 40000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack),
  new Artefact('snowjinka', 'Новогодняя снежинка 2014', 5, 40, 4, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1, morale: 1 }),
  new Artefact('sosulka', 'Новогодняя сосулька 2014', 5, 40, 4, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1, luck: 1 }),
  new Artefact('obereg', 'Оберег', 5, 50, 4, 20000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, null, { magic_protection: 20 }),
  new Artefact('eye1', 'Око беспросветной мглы', 16, 1, 16, 14400, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 5, spellpower: 1, knowledge: 1, initiative: 6 }),
  new Artefact('eye3', 'Око призрачной мглы', 6, 1, 10, 9600, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 3, spellpower: 1, knowledge: 1, initiative: 4 }),
  new Artefact('eye2', 'Око сумеречной мглы', 12, 1, 13, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 4, spellpower: 1, knowledge: 1, initiative: 5 }),
  new Artefact('chains2', 'Окова эпох', 12, 1, 6, 9200, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 4, defence: 3, knowledge: 1, initiative: 2 }),
  new Artefact('castle_orden', 'Орден бесстрашия', 5, 60, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 3, spellpower: 1, knowledge: 1, initiative: 2 }),
  new Artefact('order_griffin', 'Орден Грифона', 6, 70, 8, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 6, defence: 2 }),
  new Artefact('order_manticore', 'Орден Мантикоры', 6, 70, 8, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 6, initiative: 2 }),
  new Artefact('eg_order1', 'Орден покорителя 1-й степени', 7, 1, 14, 22000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 4, luck: 1, initiative: 4 }),
  new Artefact('eg_order2', 'Орден покорителя 2-й степени', 6, 1, 11, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 3, luck: 1, initiative: 3 }),
  new Artefact('eg_order3', 'Орден покорителя 3-й степени', 5, 1, 9, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 3, luck: 1, initiative: 1 }),
  new Artefact('sv_order1', 'Орден преданности 1-й степени', 17, 1, 16, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, defence: 4, initiative: 5 }, { hero_initiative: 5 }),
  new Artefact('sv_order2', 'Орден преданности 2-й степени', 13, 1, 12, 12800, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, initiative: 4 }, { hero_initiative: 5 }),
  new Artefact('sv_order3', 'Орден преданности 3-й степени', 6, 1, 8, 9600, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, initiative: 3 }, { hero_initiative: 5 }),
  new Artefact('ord_light', 'Орден Света', 6, 75, 12, 18000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 5, defence: 4, spellpower: 1, knowledge: 1 }),
  new Artefact('ord_dark', 'Орден Тьмы', 6, 75, 12, 18000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 5, spellpower: 1, knowledge: 1, initiative: 4 }),
  new Artefact('mechanic_glasses2', 'Очки механика', 10, 1, 10, 7400, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, spellpower: 1, knowledge: 2, initiative: 3 }),
  new Artefact('pen', 'Перо поэта', 9, 70, 9, 19824, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, initiative: 2 }, { increase_close_combat_damage: 5 }),
  new Artefact('sandglass', 'Песочные часы', 5, 70, 3, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 2 }),
  new Artefact('inq_ring1', 'Печать инквизитора солнца', 14, 1, 15, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 5, defence: 3, spellpower: 1, knowledge: 1, initiative: 5 }),
  new Artefact('battlem_cape', 'Плащ боевого мага', 10, 1, 11, 28000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 1, spellpower: 1, knowledge: 1 }, { magic_protection: 10, range_combat_protection: 15 }),
  new Artefact('stalkercl', 'Плащ тёмного ловчего', 9, 1, 8, 8000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 3, initiative: 1 }, { range_combat_protection: 19 }),
  new Artefact('totem2', 'Племенной тотем', 9, 70, 5, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, initiative: 3 }),
  new Artefact('2year_amul_lords', 'Подвеска двухлетней удачи', 3, 10, 2, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 1 }),
  new Artefact('7ka', 'Подвеска семилетия', 3, 10, 7, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1, luck: 1 }),
  new Artefact('3year_amul', 'Подвеска трёхлетней удачи', 3, 10, 2, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 1 }),
  new Artefact('icesphere3', 'Простая ледяная сфера', 6, 1, 5, 12800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 1 }, { increase_close_combat_damage: 4, increase_range_combat_damage: 4 }),
  new Artefact('chains3', 'Простая окова эпох', 5, 1, 4, 8400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, defence: 2, initiative: 1 }),
  new Artefact('inq_ring2', 'Простая печать инквизитора солнца', 6, 1, 11, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }),
  new Artefact('krest3', 'Простое знамя крестоносца', 5, 1, 4, 8400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 2 }),
  new Artefact('anomal_ring3', 'Простое кольцо аномалий', 6, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, spellpower: 1, knowledge: 1, initiative: 4 }, { hero_initiative: 3 }),
  new Artefact('buben3', 'Простой бубен шамана', 5, 1, 9, 9600, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }),
  new Artefact('icebow3', 'Простой лук снегоходца', 5, 1, 5, 12000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 1 }, { increase_close_combat_damage: 7, increase_range_combat_damage: 13 }),
  new Artefact('mechanic_glasses3', 'Простые очки механика', 5, 1, 8, 6800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, spellpower: 1, knowledge: 1, initiative: 2 }),
  new Artefact('lotus2', 'Расцветающий лотос', 12, 1, 6, 9000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, spellpower: 1, knowledge: 1, initiative: 2 }),
  new Artefact('infdagger3', 'Ритуальный сердцекол', 6, 1, 5, 11666, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, initiative: 1 }),
  new Artefact('rog_demon', 'Рог демона', 13, 30, 10, 40000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, initiative: 2 }),
  new Artefact('runkam', 'Рунный камень', 5, 50, 4, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 4 }),
  new Artefact('lizard_boots', 'Сапоги из кожи ящера', 3, 15, 2, 800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 1, initiative: 1 }),
  new Artefact('torg_boots', 'Сапоги торговца', 3, 1, 5, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, initiative: Math.floor(hero_lvl/3) }),
  new Artefact('krest1', 'Священное знамя крестоносца', 14, 1, 6, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 2, initiative: 2 }),
  new Artefact('thief_unique_secretops', 'Секретная шпага воров', 6, 200, 3, 0, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.no_sell, { attack: 6 }),
  new Artefact('ankh2', 'Серебряный анх', 5, 70, 5, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }),
  new Artefact('lotus3', 'Спящий лотос', 6, 1, 4, 8400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, spellpower: 1, knowledge: 1, initiative: 1 }),
  new Artefact('compass', 'Старинный компас', 9, 40, 7, 8000, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.other, { defence: 1, knowledge: 1 }, { magic_protection: 30 }),
  new Artefact('statue', 'Статуэтка воина', 5, 70, 3, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.no_sell, { attack: 1, knowledge: 1 }),
  new Artefact('nefrit2', 'Статуэтка жрицы', 9, 1, 6, 9000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }),
  new Artefact('nefrit3', 'Статуэтка каппы', 5, 1, 5, 8400, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, spellpower: 1, knowledge: 1, initiative: 1 }),
  new Artefact('nefrit1', 'Статуэтка кенсея', 14, 1, 7, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 1, spellpower: 2, knowledge: 1, initiative: 2 }),
  new Artefact('cat_statue', 'Статуэтка кошки', 5, 70, 1, 8000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 1 }),
  new Artefact('bear_statue', 'Статуэтка медведя', 5, 70, 1, 8000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 1 }),
  new Artefact('ru_statue', 'Статуэтка Рунета 2009', 1, 20, 10, 2009, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.shield, { defence: 1, initiative: 1 }),
  new Artefact('dog_statue', 'Статуэтка чёрной собаки', 5, 70, 1, 8000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 1 }),
  new Artefact('samorod3', 'Странный самородок', 6, 1, 4, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, initiative: 2 }, { magic_protection: 4 }),
  new Artefact('msphere', 'Сфера тайн', 5, 60, 3, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, spellpower: 1 }),
  new Artefact('3year_art', 'Талисман трёхлетия', 3, 10, 3, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1, luck: 1 }),
  new Artefact('znak5', 'Талисман Варваров', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2 }),
  new Artefact('znak8', 'Талисман Гномов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 1, initiative: 1 }),
  new Artefact('znak7', 'Талисман Демонов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, initiative: 1 }),
  new Artefact('znak3', 'Талисман Магов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { knowledge: 2 }),
  new Artefact('znak2', 'Талисман Некромантов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, knowledge: 1 }),
  new Artefact('znak1', 'Талисман Рыцарей', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 2 }),
  new Artefact('znak6', 'Талисман Тёмных эльфов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, spellpower: 1 }),
  new Artefact('znak9', 'Талисман Степных варваров', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1 }),
  new Artefact('znak4', 'Талисман Эльфов', 5, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 2 }),
  new Artefact('firehammer', 'Тлеющий молот', 7, 1, 12, 32000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 1 }, { increase_close_combat_damage: 10 }),
  new Artefact('steptopor1', 'Топор вечной войны', 17, 1, 17, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 4 }, { increase_close_combat_damage: 15 }),
  new Artefact('steptopor2', 'Топор грядущей войны', 12, 1, 13, 18000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, initiative: 3 }, { increase_close_combat_damage: 11 }),
  new Artefact('topor_drov', 'Топор дровосека', 5, 40, 8, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 4 }),
  new Artefact('dem_dtopor', 'Топор дьявола', 13, 30, 11, 48000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, initiative: 1 }, { increase_close_combat_damage: 5 }),
  new Artefact('steptopor3', 'Топор забытой войны', 6, 1, 9, 15200, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 1, initiative: 2 }, { increase_close_combat_damage: 6 }),
  new Artefact('taskaxe', 'Топор надсмотрщика', 11, 1, 16, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10, morale: 1 }, { increase_close_combat_damage: 13 }),
  new Artefact('orc_axe', 'Топор орка-тирана', 10, 1, 12, 28000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, initiative: 2 }, { increase_range_combat_damage: 5, increase_close_combat_damage: 6 }),
  new Artefact('topor_skelet', 'Топорик скелета', 5, 30, 7, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 2 }),
  new Artefact('sea_trident', 'Трезубец сирен', 5, 15, 7, 4000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { spellpower: 2 }),
  new Artefact('18turban', 'Тюрбан мудрости', 4, 18, Math.floor(hero_lvl/2), 18018, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: Math.floor(hero_lvl/10), defence: Math.floor(hero_lvl/8), spellpower: Math.floor(hero_lvl/11), knowledge: Math.floor(hero_lvl/9), initiative: Math.floor(hero_lvl/7)}),
  new Artefact('bshield1', 'Тяжёлый щит предводителя', 13, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 2, defence: 4, initiative: 1 }),
  new Artefact('dudka', 'Флейта сатира', 4, 1, 5, 6000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { morale: 1 }),
  new Artefact('flyaga', 'Фляга здоровья', 3, 1, 1, 60000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, null),
  new Artefact('antifire_cape', 'Халат пламени', 3, 40, 3, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, null),
  new Artefact('hopesh2', 'Хопеш', 5, 1, 12, 7200, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 1 }, { increase_close_combat_damage: 7 }),
  new Artefact('lotus1', 'Цветущий лотос', 16, 1, 8, 9600, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, spellpower: 1, knowledge: 1, initiative: 3 }, null),
  new Artefact('12hron', 'Часы памяти', 3, 1, 1, 40000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, null),
  new Artefact('4year_klever', 'Четырёхлистный клевер', 3, 10, 3, 4000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { initiative: 1, luck: 1 }),
  new Artefact('samorod1', 'Чудесный самородок', 17, 1, 8, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, initiative: 4 }, { magic_protection: 11 }),
  new Artefact('6ring', 'Шестигранный перстень', 3, 10, 5, 15000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, initiative: 2 }),
  new Artefact('lizard_helm', 'Шлем из кожи ящера', 3, 15, 2, 800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, initiative: 1 }),
  new Artefact('ogre_helm', 'Шлем огра-ветерана', 14, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 10, initiative: -2 }),
  new Artefact('orc_hat', 'Шлем орка-тирана', 8, 1, 8, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, initiative: 3 }),
  new Artefact('necrohelm3', 'Шлем рыцаря тьмы', 13, 10, 9, 24000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 3, defence: 3 }),
  new Artefact('necrohelm1', 'Шлем скелета-воина', 5, 10, 4, 10000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 1 }),
  new Artefact('gargoshield', 'Щит из крыла горгульи', 6, 1, 8, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4 }, { magic_protection: 12 }),
  new Artefact('bshield2', 'Щит предводителя', 9, 1, 9, 12000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4, initiative: 1 }),
  new Artefact('e_shield2', 'Щит шакала', 6, 1, 8, 7200, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5, initiative: 1 }, { range_combat_protection: 11, magic_protection: 12 }),
  new Artefact('e_shield1', 'Щит шакала-воина', 12, 1, 10, 10000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 6, initiative: 2 }, { range_combat_protection: 15, magic_protection: 20 }),
  new Artefact('elfdagger', 'Эльфийский кинжал', 13, 1, 12, 36000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.relict, { attack: 2, initiative: 6 }, { increase_close_combat_damage: 5 }),

  // event -> dungeon
  new Artefact('dun_amul2', 'Амулет подземелий', 8, 1, 11, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 3, spellpower: 1, knowledge: 1, initiative: 6 }, null, enum_aset.dungeon),
  new Artefact('dun_bow2', 'Арбалет подземелий', 9, 1, 6, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 1, initiative: 1 }, { increase_range_combat_damage: 18 }, enum_aset.dungeon),
  new Artefact('drak_shield2', 'Аспис подземелий', 11, 1, 10, 14400, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }, { close_combat_protection: 7, range_combat_protection: 9 }, enum_aset.dungeon),
  new Artefact('dung_glefa1', 'Великая глефа подземелий', 16, 1, 20, 16800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 2, knowledge: 1, initiative: 6 }, { increase_close_combat_damage: 15 }, enum_aset.dungeon),
  new Artefact('drak_crown1', 'Великая корона подземелий', 15, 1, 14, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 3, defence: 3, spellpower: 1, knowledge: 1, initiative: 4 }, { close_combat_protection: 6 }, enum_aset.dungeon),
  new Artefact('drak_armor1', 'Великие латы подземелий', 14, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 3, spellpower: 2, initiative: 3 }, { close_combat_protection: 9, range_combat_protection: 12 }, enum_aset.dungeon),
  new Artefact('drak_greaves1', 'Великие поножи подземелий', 16, 1, 12, 16800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 1, defence: 3, spellpower: 2, initiative: 3 }, { close_combat_protection: 6, range_combat_protection: 10 }, enum_aset.dungeon),
  new Artefact('dun_boots1', 'Великие сапоги подземелий', 14, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, spellpower: 1, knowledge: 1, initiative: 2 }, { close_combat_protection: 7, range_combat_protection: 7 }, enum_aset.dungeon),
  new Artefact('dun_amul1', 'Великий амулет подземелий', 12, 1, 14, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 4, spellpower: 1, knowledge: 1, initiative: 7 }, null, enum_aset.dungeon),
  new Artefact('dun_bow1', 'Великий арбалет подземелий', 14, 1, 8, 20000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 2, initiative: 1 }, { increase_range_combat_damage: 22 }, enum_aset.dungeon),
  new Artefact('drak_shield1', 'Великий аспис подземелий', 16, 1, 13, 16800, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 3, defence: 3, spellpower: 1, knowledge: 1, initiative: 4 }, { close_combat_protection: 8, range_combat_protection: 11 }, enum_aset.dungeon),
  new Artefact('dun_bw1', 'Великий лук подземелий', 16, 1, 10, 16800, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, spellpower: 1, initiative: 2 }, { increase_range_combat_damage: 14 }, enum_aset.dungeon),
  new Artefact('dun_armor1', 'Великий доспех подземелий', 14, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1, knowledge: 1, initiative: 2 }, { close_combat_protection: 9, range_combat_protection: 10 }, enum_aset.dungeon),
  new Artefact('dun_dagger1', 'Великий кинжал подземелий', 14, 1, 12, 20000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 5, defence: 2, spellpower: 1, initiative: 1 }, { increase_close_combat_damage: 8 }, enum_aset.dungeon),
  new Artefact('dun_pendant1', 'Великий кулон подземелий', 16, 1, 16, 16800, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, spellpower: 2, initiative: 8 }, null, enum_aset.dungeon),
  new Artefact('dun_sword1', 'Великий меч подземелий', 14, 1, 16, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }, { increase_close_combat_damage: 12, close_combat_protection: 5 }, enum_aset.dungeon),
  new Artefact('dun_ring1', 'Великий перстень подземелий', 14, 1, 15, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 6, spellpower: 1, knowledge: 1, initiative: 5 }, null, enum_aset.dungeon),
  new Artefact('dun_cloak1', 'Великий плащ подземелий', 14, 1, 12, 18000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 3, knowledge: 2, initiative: 2 }, { range_combat_protection: 20 }, enum_aset.dungeon),
  new Artefact('dung_axe1', 'Великий топор подземелий', 14, 1, 18, 18000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10, defence: 1, initiative: 4 }, { increase_close_combat_damage: 17 }, enum_aset.dungeon),
  new Artefact('hm2', 'Великий шлем подземелий', 12, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5, knowledge: 1, initiative: 2 }, { close_combat_protection: 7 }, enum_aset.dungeon),
  new Artefact('dun_shield1', 'Великий щит подземелий', 14, 1, 11, 20000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, spellpower: 1, knowledge: 1, initiative: 4 }, { close_combat_protection: 6, range_combat_protection: 12 }, enum_aset.dungeon),
  new Artefact('dung_glefa2', 'Глефа подземелий', 10, 1, 15, 14400, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 2, knowledge: 1, initiative: 4 }, { increase_close_combat_damage: 11 }, enum_aset.dungeon),
  new Artefact('dun_armor2', 'Доспех подземелий', 9, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 7, range_combat_protection: 8}, enum_aset.dungeon),
  new Artefact('dun_dagger2', 'Кинжал подземелий', 9, 1, 10, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, defence: 2, spellpower: 1 }, { increase_close_combat_damage: 5 }, enum_aset.dungeon),
  new Artefact('dering', 'Кольцо подземелий', 13, 1, 15, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.relict, { attack: 3, defence: 3, knowledge: 1, initiative: 4, morale: 1 }, null, enum_aset.dungeon),
  new Artefact('drak_crown2', 'Корона подземелий', 11, 1, 11, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }, { close_combat_protection: 4 }, enum_aset.dungeon),
  new Artefact('dun_pendant2', 'Кулон подземелий', 10, 1, 13, 14400, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, spellpower: 2, initiative: 7 }, null, enum_aset.dungeon),
  new Artefact('drak_armor2', 'Латы подземелий', 9, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 3, spellpower: 1, initiative: 2 }, { close_combat_protection: 7, range_combat_protection: 10 }, enum_aset.dungeon),
  new Artefact('dun_boots3', 'Легкие сапоги подземелий', 5, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 4, range_combat_protection: 4 }, enum_aset.dungeon),
  new Artefact('dun_armor3', 'Легкий доспех подземелий', 5, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 6, range_combat_protection: 6 }, enum_aset.dungeon),
  new Artefact('dun_shield3', 'Легкий щит подземелий', 5, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, knowledge: 1, initiative: 3 }, { close_combat_protection: 3, range_combat_protection: 8 }, enum_aset.dungeon),
  new Artefact('dung_glefa3', 'Лёгкая глефа подземелий', 6, 1, 10, 11800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 7 }, enum_aset.dungeon),
  new Artefact('drak_greaves3', 'Лёгкие поножи подземелий', 6, 1, 6, 11800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 1, defence: 2, spellpower: 1, initiative: 1 }, { close_combat_protection: 2, range_combat_protection: 4 }, enum_aset.dungeon),
  new Artefact('drak_armor3', 'Лёгкие латы подземелий', 5, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 2, spellpower: 1, initiative: 1 }, { close_combat_protection: 5, range_combat_protection: 7 }, enum_aset.dungeon),
  new Artefact('dun_bow3', 'Лёгкий арбалет подземелий', 5, 1, 5, 12000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { spellpower: 1, initiative: 1 }, { increase_range_combat_damage: 14 }, enum_aset.dungeon),
  new Artefact('drak_shield3', 'Лёгкий аспис подземелий', 6, 1, 7, 11800, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 2, defence: 1, knowledge: 1, initiative: 2 }, { close_combat_protection: 6, range_combat_protection: 7 }, enum_aset.dungeon),
  new Artefact('dun_dagger3', 'Лёгкий кинжал подземелий', 5, 1, 7, 12000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 1, spellpower: 1 }, { increase_close_combat_damage: 3 }, enum_aset.dungeon),
  new Artefact('dun_sword3', 'Лёгкий меч подземелий', 5, 1, 10, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 6, close_combat_protection: 2 }, enum_aset.dungeon),
  new Artefact('dung_axe3', 'Лёгкий топор подземелий', 5, 1, 11, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 1 }, { increase_close_combat_damage: 8 }, enum_aset.dungeon),
  new Artefact('dun_bw2', 'Лук подземелий', 10, 1, 7, 14400, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 1, initiative: 1 }, { increase_range_combat_damage: 10 }, enum_aset.dungeon),
  new Artefact('dun_sword2', 'Меч подземелий', 9, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 8, close_combat_protection: 3 }, enum_aset.dungeon),
  new Artefact('dun_ring2', 'Перстень подземелий', 9, 1, 12, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 5, spellpower: 1, initiative: 4 }, null, enum_aset.dungeon),
  new Artefact('dun_cloak2', 'Плащ подземелий', 9, 1, 8, 15000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 2, knowledge: 1, initiative: 1 }, { range_combat_protection: 14 }, enum_aset.dungeon),
  new Artefact('crystal', 'Подземный кристалл', 5, 1, 4, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { initiative: 2 }, { increase_close_combat_damage: 5 }, enum_aset.dungeon),
  new Artefact('drak_greaves2', 'Поножи подземелий', 10, 1, 9, 14400, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 1, defence: 2, spellpower: 2, initiative: 2 }, { close_combat_protection: 4, range_combat_protection: 7 }, enum_aset.dungeon),
  new Artefact('drak_crown3', 'Простая корона подземелий', 6, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }, { close_combat_protection: 2 }, enum_aset.dungeon),
  new Artefact('dun_amul3', 'Простой амулет подземелий', 5, 1, 9, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 2, spellpower: 1, knowledge: 1, initiative: 5 }, null, enum_aset.dungeon),
  new Artefact('dun_pendant3', 'Простой кулон подземелий', 6, 1, 10, 11800, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, spellpower: 1, initiative: 5 }, null, enum_aset.dungeon),
  new Artefact('dun_bw3', 'Простой лук подземелий', 6, 1, 5, 11800, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 1, initiative: 1 }, { increase_range_combat_damage: 6 }, enum_aset.dungeon),
  new Artefact('dun_cloak3', 'Простой плащ подземелий', 5, 1, 5, 12000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, knowledge: 1, initiative: 1 }, { range_combat_protection: 9 }, enum_aset.dungeon),
  new Artefact('dun_ring3', 'Простой перстень подземелий', 5, 1, 9, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 4, spellpower: 1, initiative: 3 }, null, enum_aset.dungeon),
  new Artefact('dun_boots2', 'Сапоги подземелий', 9, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 5, range_combat_protection: 5 }, enum_aset.dungeon),
  new Artefact('dung_axe2', 'Топор подземелий', 9, 1, 14, 15000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 1, initiative: 2 }, { increase_close_combat_damage: 12 }, enum_aset.dungeon),
  new Artefact('hm1', 'Шлем подземелий', 6, 1, 9, 14400, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, knowledge: 1, initiative: 1 }, { close_combat_protection: 5 }, enum_aset.dungeon),
  new Artefact('dun_shield2', 'Щит подземелий', 9, 1, 9, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, knowledge: 1, initiative: 3 }, { close_combat_protection: 4, range_combat_protection: 10 }, enum_aset.dungeon),

  // event -> robber
  new Artefact('ramul1', 'Амулет разбойника', 13, 1, 13, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2, initiative: 8 }, null, enum_aset.robber),
  new Artefact('rarmor1', 'Броня разбойника', 13, 1, 14, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, initiative: 4 }, { magic_protection: 12, close_combat_protection: 10, range_combat_protection: 10 }, enum_aset.robber),
  new Artefact('rdagger1', 'Кинжал разбойника', 13, 1, 9, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 2, initiative: 4 }, { increase_close_combat_damage: 5 }, enum_aset.robber),
  new Artefact('rogring1', 'Кольцо разбойника', 13, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, initiative: 6 }, null, enum_aset.robber),
  new Artefact('rarmor2', 'Легкая броня разбойника', 6, 1, 11, 8000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, initiative: 4 }, { magic_protection: 10, close_combat_protection: 7, range_combat_protection: 7 }, enum_aset.robber),
  new Artefact('rboots2', 'Легкие сапоги разбойника', 6, 1, 8, 8000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, initiative: 6 }, { close_combat_protection: 4 }, enum_aset.robber),
  new Artefact('rhelm2', 'Легкий шлем разбойника', 6, 1, 10, 8000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, initiative: 2 }, { close_combat_protection: 5, range_combat_protection: 7, magic_protection: 10 }, enum_aset.robber),
  new Artefact('rsword2', 'Лёгкий меч разбойника', 8, 1, 10, 8000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2, initiative: 2 }, { increase_close_combat_damage: 11 }, enum_aset.robber),
  new Artefact('raxe2', 'Лёгкий топор разбойника', 5, 1, 7, 8000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, initiative: 2 }, { increase_close_combat_damage: 16 }, enum_aset.robber),
  new Artefact('rbow1', 'Лук разбойника', 13, 1, 8, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 2 }, { increase_range_combat_damage: 16 }, enum_aset.robber),
  new Artefact('rsword1', 'Меч разбойника', 13, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 2, initiative: 2 }, { increase_close_combat_damage: 15 }, enum_aset.robber),
  new Artefact('rcloak1', 'Плащ разбойника', 13, 1, 9, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 3, initiative: 4 }, { range_combat_protection: 20 }, enum_aset.robber),
  new Artefact('rogring2', 'Простое кольцо разбойника', 5, 1, 7, 8000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, initiative: 3 }, null, enum_aset.robber),
  new Artefact('ramul2', 'Простой амулет разбойника', 5, 1, 10, 8000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, initiative: 6 }, null, enum_aset.robber),
  new Artefact('rdagger2', 'Простой кинжал разбойника', 5, 1, 7, 8000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 1, initiative: 3 }, { increase_close_combat_damage: 4 }, enum_aset.robber),
  new Artefact('rbow2', 'Простой лук разбойника', 5, 1, 6, 8000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 1 }, { increase_range_combat_damage: 12 }, enum_aset.robber),
  new Artefact('rcloak2', 'Простой плащ разбойника', 5, 1, 7, 8000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 4 }, { range_combat_protection: 16 }, enum_aset.robber),
  new Artefact('rshield2', 'Простой щит разбойника', 5, 1, 11, 8000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 3, initiative: 3 }, { magic_protection: 12, close_combat_protection: 4, range_combat_protection: 12 }, enum_aset.robber),
  new Artefact('rboots1', 'Сапоги разбойника', 13, 1, 11, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 7 }, { close_combat_protection: 5 }, enum_aset.robber),
  new Artefact('sumka', 'Сумка разбойника', 5, 1, 4, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, initiative: 3 }, null, enum_aset.robber),
  new Artefact('raxe1', 'Топор разбойника', 13, 1, 9, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 3, initiative: 3 }, { increase_close_combat_damage: 20 }, enum_aset.robber),
  new Artefact('rhelm1', 'Шлем разбойника', 13, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, initiative: 3 }, { close_combat_protection: 8, range_combat_protection: 10, magic_protection: 12 }, enum_aset.robber),
  new Artefact('rshield1', 'Щит разбойника', 13, 1, 14, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 4 }, { magic_protection: 15, close_combat_protection: 5, range_combat_protection: 15 }, enum_aset.robber),

  // event -> survilurg
  new Artefact('surv_halberdzg', 'Алебарда сурвилурга', 5, 1, 8, 24000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, morale: 1 }, null, enum_aset.survilurg),
  new Artefact('surv_wamuletik', 'Амулет сурвилурга', 12, 1, 12, 28000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, defence: 4, initiative: 4 }, null, enum_aset.survilurg),
  new Artefact('surv_crossbowsurv', 'Арбалет сурвилурга', 12, 1, 8, 32000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 2 }, { increase_range_combat_damage: 20 }, enum_aset.survilurg),
  new Artefact('surv_armorsu', 'Доспех сурвилурга', 12, 1, 12, 28000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, initiative: 2 }, { magic_protection: 12, close_combat_protection: 12 }, enum_aset.survilurg),
  new Artefact('surv_wring2o', 'Золотое кольцо сурвилурга', 5, 1, 5, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, initiative: 1 }, null, enum_aset.survilurg),
  new Artefact('surv_daggermd', 'Кинжал сурвилурга', 12, 1, 11, 36000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 1, initiative: 1 }, { increase_close_combat_damage: 11 }, enum_aset.survilurg),
  new Artefact('surv_sword2sd', 'Клинок сурвилурга', 5, 1, 10, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 2, initiative: 1 }, { increase_close_combat_damage: 5 }, enum_aset.survilurg),
  new Artefact('surv_mring2fpg', 'Кольцо мудрости сурвилурга', 5, 1, 5, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 2, knowledge: 2 }, null, enum_aset.survilurg),
  new Artefact('surv_wring1my', 'Кольцо силы сурвилурга', 12, 1, 8, 28000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 4 }, null, enum_aset.survilurg),
  new Artefact('surv_mbootsbb', 'Магические сапоги сурвилурга', 12, 1, 11, 28000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, spellpower: 1, initiative: 1 }, { magic_protection: 12, hero_initiative: 10, close_combat_protection: 5 }, enum_aset.survilurg),
  new Artefact('surv_mamulka', 'Магический амулет сурвилурга', 12, 1, 15, 28000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2, spellpower: 2, knowledge: 3, initiative: 2 }, { hero_initiative: 5 }, enum_aset.survilurg),
  new Artefact('surv_marmoroz', 'Магический доспех сурвилурга', 12, 1, 12, 28000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 1, knowledge: 1, initiative: 1 }, { magic_protection: 13, hero_initiative: 5, close_combat_protection: 10 }, enum_aset.survilurg),
  new Artefact('surv_mhelmetcv', 'Магический шлем сурвилурга', 12, 1, 9, 28000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, spellpower: 1, knowledge: 2 }, { magic_protection: 12, close_combat_protection: 5 }, enum_aset.survilurg),
  new Artefact('surv_mring1fd', 'Магическое кольцо сурвилурга', 12, 1, 11, 28000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, spellpower: 2, knowledge: 1, initiative: 1 }, null, enum_aset.survilurg),
  new Artefact('surv_mcloacksv', 'Мантия сурвилурга', 12, 1, 9, 28000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 2, knowledge: 1, initiative: 1 }, { range_combat_protection: 10 }, enum_aset.survilurg),
  new Artefact('surv_sword_surv', 'Меч сурвилурга', 12, 1, 14, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 2, initiative: 1 }, { increase_close_combat_damage: 11 }, enum_aset.survilurg),
  new Artefact('surv_cloacksrv', 'Плащ сурвилурга', 12, 1, 9, 28000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 1 }, { range_combat_protection: 20 }, enum_aset.survilurg),
  new Artefact('surv_staffik', 'Посох сурвилурга', 12, 1, 15, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2, spellpower: 3, knowledge: 2 }, { increase_close_combat_damage: 7 }, enum_aset.survilurg),
  new Artefact('surv_bootsurv', 'Сапоги сурвилурга', 12, 1, 11, 28000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5, initiative: 1 }, { magic_protection: 11, close_combat_protection: 7 }, enum_aset.survilurg),
  new Artefact('surv_scrollcd', 'Свиток сурвилурга', 12, 1, 11, 28000, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { attack: 1, defence: 3, spellpower: 2, knowledge: 2 }, null, enum_aset.survilurg),
  new Artefact('surv_axes', 'Топор сурвилурга', 21, 1, 14, 36000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 12 }, { increase_close_combat_damage: 17 }, enum_aset.survilurg),
  new Artefact('surv_helmetpi', 'Шлем сурвилурга', 12, 1, 9, 28000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5, initiative: 1 }, { magic_protection: 11, close_combat_protection: 6 }, enum_aset.survilurg),
  new Artefact('surv_shieldvv', 'Щит сурвилурга', 12, 1, 10, 28000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 6, initiative: 1 }, { range_combat_protection: 18 }, enum_aset.survilurg),

  // event -> temporal
  new Artefact('tj_magam2', 'Амулет времён', 8, 1, 9, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, spellpower: 2, knowledge: 2, initiative: 3 }, { hero_initiative: 5 }, enum_aset.temporal),
  new Artefact('mtcloak1', 'Великая  мантия времён', 13, 1, 11, 24000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 3, spellpower: 2, knowledge: 2, initiative: 1 }, { range_combat_protection: 10 }, enum_aset.temporal),
  new Artefact('tmarmor1', 'Великая роба времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 2, knowledge: 1 }, null, enum_aset.temporal),
  new Artefact('sph1', 'Великая сфера времён', 13, 1, 6, 24000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 1, initiative: 3 }, null, enum_aset.temporal),
  new Artefact('tj_mtuf1', 'Великие туфли времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, knowledge: 3, initiative: 3 }, { hero_initiative: 15 }, enum_aset.temporal),
  new Artefact('vbow1', 'Великий лук времен', 13, 1, 8, 24000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, defence: 1, initiative: 1 }, { increase_range_combat_damage: 15 }, enum_aset.temporal),
  new Artefact('mhelmv1', 'Великий магический шлем времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5, spellpower: 1, knowledge: 2 }, null, enum_aset.temporal),
  new Artefact('vtmsword1', 'Великий меч времен', 13, 1, 13, 24000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, initiative: 2 }, { increase_close_combat_damage: 8 }, enum_aset.temporal),
  new Artefact('vtjcloak1', 'Великий плащ времен', 13, 1, 8, 24000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 3 }, { magic_protection: 10, range_combat_protection: 10 }, enum_aset.temporal),
  new Artefact('staff_v1', 'Великий посох времён', 13, 1, 15, 24000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 3, spellpower: 3, knowledge: 2, initiative: 1 }, { hero_initiative: 4 }, enum_aset.temporal),
  new Artefact('vscroll-1', 'Великий свиток времён', 13, 1, 11, 24000, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { defence: 4, spellpower: 2, knowledge: 1, initiative: 1 }, { magic_protection: 8, range_combat_protection: 8, close_combat_protection: 8 }, enum_aset.temporal),
  new Artefact('vtmaxe1', 'Великий топор времён', 13, 1, 16, 24000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 3, initiative: 3 }, { increase_close_combat_damage: 10 }, enum_aset.temporal),
  new Artefact('vmring1', 'Великое магическое кольцо времён', 13, 1, 13, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 1, spellpower: 2, knowledge: 3, initiative: 3 }, null, enum_aset.temporal),
  new Artefact('tjarmor2', 'Доспех времён', 8, 1, 10, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('vrdagger2', 'Кинжал времён', 8, 1, 5, 20000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, initiative: 2 }, { increase_close_combat_damage: 7 }, enum_aset.temporal),
  new Artefact('v-ring2', 'Кольцо времён', 8, 1, 6, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, initiative: 3 }, null, enum_aset.temporal),
  new Artefact('tjam2', 'Кулон времён', 8, 1, 9, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, initiative: 7 }, null, enum_aset.temporal),
  new Artefact('mtcloak3', 'Легкая мантия времён', 5, 1, 8, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 2, spellpower: 1, knowledge: 1, initiative: 1 }, { range_combat_protection: 4 }, enum_aset.temporal),
  new Artefact('vtjcloak3', 'Легкий плащ времен', 5, 1, 5, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 1 }, { magic_protection: 5, range_combat_protection: 5 }, enum_aset.temporal),
  new Artefact('staff_v3', 'Легкий посох времён', 5, 1, 10, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 1, spellpower: 2, knowledge: 2, initiative: 1 }, { hero_initiative: 2 }, enum_aset.temporal),
  new Artefact('tmarmor3', 'Лёгкая роба времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1 }, null, enum_aset.temporal),
  new Artefact('tj_vboots3', 'Лёгкие сапоги времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj_mtuf3', 'Лёгкие туфли времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, knowledge: 3, initiative: 3 }, { hero_initiative: 8 }, enum_aset.temporal),
  new Artefact('tjarmor3', 'Лёгкий доспех времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('vrdagger3', 'Лёгкий кинжал времён', 5, 1, 4, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 1, initiative: 2 }, { increase_close_combat_damage: 4 }, enum_aset.temporal),
  new Artefact('vbow3', 'Легкий лук времен', 5, 1, 5, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 1 }, { increase_range_combat_damage: 5 }, enum_aset.temporal),
  new Artefact('mhelmv3', 'Лёгкий магический шлем времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, spellpower: 1, knowledge: 1 }, null, enum_aset.temporal),
  new Artefact('vtmsword3', 'Лёгкий меч времён', 5, 1, 10, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, initiative: 1 }, { increase_close_combat_damage: 3 }, enum_aset.temporal),
  new Artefact('vtmaxe3', 'Лёгкий топор времён', 5, 1, 11, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 2 }, { increase_close_combat_damage: 4 }, enum_aset.temporal),
  new Artefact('tj_helmet3', 'Лёгкий шлем времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj-shield3', 'Лёгкий щит времён', 5, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('vbow2', 'Лук времен', 8, 1, 6, 20000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 1 }, { increase_range_combat_damage: 9 }, enum_aset.temporal),
  new Artefact('mhelmv2', 'Магический шлем времён', 8, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, spellpower: 1, knowledge: 1 }, null, enum_aset.temporal),
  new Artefact('vmring2', 'Магическое кольцо времён', 8, 1, 11, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 1, spellpower: 2, knowledge: 2, initiative: 3 }, null, enum_aset.temporal),
  new Artefact('v-ring3', 'Малое кольцо времён', 5, 1, 5, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, initiative: 3 }, null, enum_aset.temporal),
  new Artefact('tj_magam3', 'Малый амулет времён', 5, 1, 7, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { defence: 1, spellpower: 2, knowledge: 2, initiative: 2 }, { hero_initiative: 3 }, enum_aset.temporal),
  new Artefact('tjam3', 'Малый кулон времён', 5, 1, 7, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, initiative: 6 }, null, enum_aset.temporal),
  new Artefact('vbolt3', 'Малый перстень времён', 5, 1, 5, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 3 }, null, enum_aset.temporal),
  new Artefact('vscroll-3', 'Малый свиток времён', 5, 1, 7, 16000, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { defence: 2, spellpower: 2, knowledge: 1, initiative: 1 }, { magic_protection: 4, range_combat_protection: 4, close_combat_protection: 4 }, enum_aset.temporal),
  new Artefact('mtcloak2', 'Мантия времён', 8, 1, 9, 20000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 2, spellpower: 1, knowledge: 1, initiative: 1 }, { range_combat_protection: 5 }, enum_aset.temporal),
  new Artefact('vtmsword2', 'Меч времён', 8, 1, 11, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, initiative: 1 }, { increase_close_combat_damage: 5 }, enum_aset.temporal),
  new Artefact('v-ring1', 'Мифриловое кольцо времён', 13, 1, 8, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 2, initiative: 4 }, null, enum_aset.temporal),
  new Artefact('tj_magam1', 'Мифриловый амулет времён', 13, 1, 12, 24000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 2, spellpower: 3, knowledge: 3, initiative: 3 }, { hero_initiative: 6 }, enum_aset.temporal),
  new Artefact('vrdagger1', 'Мифриловый кинжал времён', 13, 1, 7, 24000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, initiative: 2 }, { increase_close_combat_damage: 10 }, enum_aset.temporal),
  new Artefact('tjam1', 'Мифриловый кулон времён', 13, 1, 12, 24000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, initiative: 8 }, null, enum_aset.temporal),
  new Artefact('vbolt1', 'Мифриловый перстень времён', 13, 1, 8, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 5 }, null, enum_aset.temporal),
  new Artefact('vbolt2', 'Перстень времён', 8, 1, 6, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 4 }, null, enum_aset.temporal),
  new Artefact('vtjcloak2', 'Плащ времен', 8, 1, 7, 20000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 2 }, { magic_protection: 8, range_combat_protection: 8 }, enum_aset.temporal),
  new Artefact('staff_v2', 'Посох времён', 8, 1, 12, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 2, spellpower: 3, knowledge: 2, initiative: 1 }, { hero_initiative: 3 }, enum_aset.temporal),
  new Artefact('sph3', 'Простая сфера времён', 5, 1, 4, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, initiative: 2 }, null, enum_aset.temporal),
  new Artefact('vmring3', 'Простое магическое кольцо времён', 5, 1, 9, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 1, spellpower: 1, knowledge: 2, initiative: 2 }, null, enum_aset.temporal),
  new Artefact('tmarmor2', 'Роба времён', 8, 1, 10, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, spellpower: 1, knowledge: 1 }, null, enum_aset.temporal),
  new Artefact('tj_vboots2', 'Сапоги времён', 8, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('vscroll-2', 'Свиток времён', 8, 1, 9, 20000, enum_ac.event, enum_at.jewelry, enum_as.left_arm, enum_amc.weapon, { defence: 3, spellpower: 2, knowledge: 1, initiative: 1 }, { magic_protection: 6, range_combat_protection: 6, close_combat_protection: 6 }, enum_aset.temporal),
  new Artefact('sph2', 'Сфера времён', 8, 1, 5, 20000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 1, initiative: 2 }, null, enum_aset.temporal),
  new Artefact('vtmaxe2', 'Топор времён', 8, 1, 13, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 2, initiative: 2 }, { increase_close_combat_damage: 7 }, enum_aset.temporal),
  new Artefact('tj_mtuf2', 'Туфли времён', 8, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, knowledge: 3, initiative: 3 }, { hero_initiative: 11 }, enum_aset.temporal),
  new Artefact('tj_vboots1', 'Тяжёлые сапоги времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 6, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tjarmor1', 'Тяжёлый доспех времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 6, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj_helmet1', 'Тяжёлый шлем времён', 13, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 6, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj-shield1', 'Тяжёлый щит времён', 13, 1, 10, 24000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 6, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj_helmet2', 'Шлем времён', 8, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, initiative: 1 }, null, enum_aset.temporal),
  new Artefact('tj-shield2', 'Щит времён', 8, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5, initiative: 1 }, null, enum_aset.temporal),

  // event -> pirate
  new Artefact('p_amulet2', 'Амулет пирата', 9, 1, 12, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2, spellpower: 1, knowledge: 1, initiative: 4 }, { hero_initiative: 4 }, enum_aset.pirate),
  new Artefact('p_amulet1', 'Амулет пирата-капитана', 15, 1, 15, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, defence: 3, spellpower: 1, knowledge: 1, initiative: 5 }, { hero_initiative: 5 }, enum_aset.pirate),
  new Artefact('piratehat3', 'Бандана пирата', 5, 1, 7, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, knowledge: 1, initiative: 2 }, { range_combat_protection: 3 }, enum_aset.pirate),
  new Artefact('pir_armor1', 'Камзол пирата-капитана', 15, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, spellpower: 1, knowledge: 1, initiative: 2 }, { range_combat_protection: 7 }, enum_aset.pirate),
  new Artefact('p_dag2', 'Кинжал пирата', 9, 1, 7, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 2, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 5 }, enum_aset.pirate),
  new Artefact('p_dag1', 'Кинжал пирата-капитана', 15, 1, 9, 20000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 3, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 8 }, enum_aset.pirate),
  new Artefact('p_sword3', 'Клинок пирата', 5, 1, 9, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 2, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 5 }, enum_aset.pirate),
  new Artefact('pn_ring2', 'Кольцо пирата', 9, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 4, spellpower: 2, knowledge: 2, initiative: 4 }, null, enum_aset.pirate),
  new Artefact('pn_ring1', 'Кольцо пирата-капитана', 15, 1, 13, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 5, spellpower: 3, knowledge: 2, initiative: 2 }, null, enum_aset.pirate),
  new Artefact('p_compas2', 'Компас пирата', 9, 1, 4, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 2, knowledge: 1, initiative: 1 }, null, enum_aset.pirate),
  new Artefact('p_compas1', 'Компас пирата-капитана', 15, 1, 5, 20000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 2, knowledge: 1, initiative: 2 }, null, enum_aset.pirate),
  new Artefact('pn_ring3', 'Малое кольцо пирата', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 2, spellpower: 2, knowledge: 1, initiative: 4 }, null, enum_aset.pirate),
  new Artefact('piring2', 'Перстень пирата', 9, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 }, null, enum_aset.pirate),
  new Artefact('piring1', 'Перстень пирата-капитана', 15, 1, 12, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 3, spellpower: 1, knowledge: 1, initiative: 3 }, null, enum_aset.pirate),
  new Artefact('pir_armor3', 'Пиратская жилетка', 5, 1, 7, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2, spellpower: 1, initiative: 2 }, { range_combat_protection: 3 }, enum_aset.pirate),
  new Artefact('pir_armor2', 'Пиратский сюртук', 9, 1, 9, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1, initiative: 2 }, { range_combat_protection: 5 }, enum_aset.pirate),
  new Artefact('p_pistol2', 'Пистолет пирата', 9, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, spellpower: 1, knowledge: 1, initiative: 4 }, { increase_range_combat_damage: 8 }, enum_aset.pirate),
  new Artefact('p_pistol1', 'Пистолет пирата-капитана', 15, 1, 15, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, spellpower: 1, knowledge: 1, initiative: 5 }, { increase_range_combat_damage: 12 }, enum_aset.pirate),
  new Artefact('p_cloak2', 'Плащ пирата', 9, 1, 8, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 1, knowledge: 2, initiative: 2 }, { range_combat_protection: 18 }, enum_aset.pirate),
  new Artefact('p_cloak1', 'Плащ пирата-капитана', 15, 1, 10, 20000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 1, knowledge: 2, initiative: 3 }, { range_combat_protection: 21 }, enum_aset.pirate),
  new Artefact('p_amulet3', 'Простой амулет пирата', 5, 1, 9, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 1, spellpower: 1, knowledge: 1, initiative: 3 }, { hero_initiative: 3 }, enum_aset.pirate),
  new Artefact('p_dag3', 'Простой кинжал пирата', 5, 1, 5, 12000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, defence: 2, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 3 }, enum_aset.pirate),
  new Artefact('p_compas3', 'Простой компас пирата', 5, 1, 3, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { defence: 1, knowledge: 1, initiative: 1 }, null, enum_aset.pirate),
  new Artefact('piring3', 'Простой перстень пирата', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }, null, enum_aset.pirate),
  new Artefact('p_pistol3', 'Простой пистолет пирата', 5, 1, 11, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, spellpower: 1, knowledge: 1, initiative: 4 }, { increase_range_combat_damage: 5 }, enum_aset.pirate),
  new Artefact('p_cloak3', 'Простой плащ пирата', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { spellpower: 1, knowledge: 2, initiative: 1 }, { range_combat_protection: 14 }, enum_aset.pirate),
  new Artefact('p_sword2', 'Сабля пирата', 9, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, defence: 3, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 8 }, enum_aset.pirate),
  new Artefact('p_boots2', 'Сапоги пирата', 9, 1, 8, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, knowledge: 1, initiative: 2 }, { close_combat_protection: 4, hero_initiative: 8 }, enum_aset.pirate),
  new Artefact('p_boots1', 'Сапоги пирата-капитана', 15, 1, 10, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, knowledge: 1, initiative: 2 }, { close_combat_protection: 8, hero_initiative: 12 }, enum_aset.pirate),
  new Artefact('p_boots3', 'Туфли пирата', 5, 1, 6, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, knowledge: 1, initiative: 2 }, { close_combat_protection: 4, hero_initiative: 5 }, enum_aset.pirate),
  new Artefact('piratehat2', 'Шляпа пирата', 9, 1, 9, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, knowledge: 2, initiative: 2 }, { range_combat_protection: 5 }, enum_aset.pirate),
  new Artefact('piratehat1', 'Шляпа пирата-капитана', 15, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, knowledge: 2, initiative: 2 }, { range_combat_protection: 7 }, enum_aset.pirate),
  new Artefact('p_sword1', 'Шпага пирата-капитана', 15, 1, 15, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 4, knowledge: 1, initiative: 3 }, { increase_close_combat_damage: 12 }, enum_aset.pirate),

  // event -> leader
  new Artefact('polk_sword1', 'Великий меч полководца', 13, 1, 16, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 3, initiative: 3 }, { increase_close_combat_damage: 12 }, enum_aset.leader),
  new Artefact('polk_armor2', 'Кираса полководца', 8, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, initiative: 3 }, { magic_protection: 8, close_combat_protection: 6 }, enum_aset.leader),
  new Artefact('gring', 'Кольцо генерала', 11, 1, 11, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 1, spellpower: 1, knowledge: 2, initiative: 3 }, null, enum_aset.leader),
  new Artefact('polk_armor3', 'Лёгкая кираса полководца', 5, 1, 6, 8000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, initiative: 2 }, { magic_protection: 5, close_combat_protection: 4 }, enum_aset.leader),
  new Artefact('polkboots3', 'Лёгкие сапоги полководца', 5, 1, 6, 8000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 3 }, { magic_protection: 5, close_combat_protection: 2 }, enum_aset.leader),
  new Artefact('polk_sword3', 'Легкий меч полководца', 5, 1, 11, 8000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 2, initiative: 2 }, { increase_close_combat_damage: 8 }, enum_aset.leader),
  new Artefact('polk__helm3', 'Лёгкий шлем полководца', 5, 1, 6, 8000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, initiative: 2 }, { magic_protection: 5, close_combat_protection: 2 }, enum_aset.leader),
  new Artefact('polk_sword2', 'Меч полководца', 8, 1, 14, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 3, initiative: 2 }, { increase_close_combat_damage: 10 }, enum_aset.leader),
  new Artefact('gringd', 'Перстень генерала', 11, 1, 12, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 4, spellpower: 2, knowledge: 1, initiative: 4 }, null, enum_aset.leader),
  new Artefact('polkboots2', 'Сапоги полководца', 8, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, initiative: 4 }, { magic_protection: 8, close_combat_protection: 3 }, enum_aset.leader),
  new Artefact('polk_armor1', 'Тяжёлая кираса полководца', 13, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, initiative: 4 }, { magic_protection: 10, close_combat_protection: 10 }, enum_aset.leader),
  new Artefact('polkboots1', 'Тяжёлые сапоги полководца', 13, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5, initiative: 5 }, { magic_protection: 10, close_combat_protection: 5 }, enum_aset.leader),
  new Artefact('polk__helm1', 'Тяжёлый шлем полководца', 13, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 5, initiative: 4 }, { magic_protection: 10, close_combat_protection: 5 }, enum_aset.leader),
  new Artefact('polk__helm2', 'Шлем полководца', 8, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, initiative: 3 }, { magic_protection: 8, close_combat_protection: 3 }, enum_aset.leader),

  // event -> ocean
  new Artefact('m_amul2', 'Амулет океана', 9, 1, 13, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 2, spellpower: 1, knowledge: 1, initiative: 5 }, { hero_initiative: 4 }, enum_aset.ocean),
  new Artefact('ocean_boots1', 'Великие сапоги океана', 15, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 2, defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 10 }, enum_aset.ocean),
  new Artefact('m_amul1', 'Великий амулет океана', 15, 1, 15, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, defence: 2, spellpower: 1, knowledge: 1, initiative: 6 }, { hero_initiative: 6 }, enum_aset.ocean),
  new Artefact('m_armor1', 'Великий доспех океана', 15, 1, 13, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 5, spellpower: 1, knowledge: 1 }, { range_combat_protection: 4, close_combat_protection: 10 }, enum_aset.ocean),
  new Artefact('ocean_dgr1', 'Великий кинжал океана', 15, 1, 10, 20000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, defence: 2, spellpower: 1, initiative: 2 }, { increase_close_combat_damage: 7 }, enum_aset.ocean),
  new Artefact('ocean_bw1', 'Великий лук океана', 15, 1, 12, 20000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 4, initiative: 1 }, { increase_range_combat_damage: 20 }, enum_aset.ocean),
  new Artefact('ocean_sword1', 'Великий меч океана', 15, 1, 16, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 17 }, enum_aset.ocean),
  new Artefact('ocean_per1', 'Великий перстень океана', 15, 1, 13, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 4, knowledge: 1, initiative: 4 }, null, enum_aset.ocean),
  new Artefact('ocean_cl1', 'Великий плащ океана', 15, 1, 12, 20000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 2, spellpower: 2, knowledge: 2, initiative: 2 }, { range_combat_protection: 18 }, enum_aset.ocean),
  new Artefact('ocean_hlm1', 'Великий шлем океана', 15, 1, 12, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 4, spellpower: 1, knowledge: 2, initiative: 1 }, { close_combat_protection: 7, range_combat_protection: 2 }, enum_aset.ocean),
  new Artefact('ocean_m_shield1', 'Великий щит океана', 15, 1, 14, 20000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 6, spellpower: 1, knowledge: 1 }, { close_combat_protection: 9, range_combat_protection: 9 }, enum_aset.ocean),
  new Artefact('ocean_ring1', 'Великое кольцо океана', 15, 1, 13, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 5, defence: 3, initiative: 5 }, null, enum_aset.ocean),
  new Artefact('ocean_eye1', 'Великое око океана', 15, 1, 7, 20000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 1 }, null, enum_aset.ocean),
  new Artefact('m_armor2', 'Доспех океана', 9, 1, 11, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 4, spellpower: 1, knowledge: 1 }, { range_combat_protection: 3, close_combat_protection: 8 }, enum_aset.ocean),
  new Artefact('ocean_dgr2', 'Кинжал океана', 9, 1, 8, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 3, defence: 2, spellpower: 1, initiative: 1 }, { increase_close_combat_damage: 4 }, enum_aset.ocean),
  new Artefact('ocean_ring2', 'Кольцо океана', 9, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 2, initiative: 4 }, null, enum_aset.ocean),
  new Artefact('m_armor3', 'Легкий доспех океана', 5, 1, 9, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 3, spellpower: 1, knowledge: 1 }, { range_combat_protection: 2, close_combat_protection: 7 }, enum_aset.ocean),
  new Artefact('ocean_boots3', 'Легкие сапоги океана', 5, 1, 8, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 1, defence: 3, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 5 }, enum_aset.ocean),
  new Artefact('ocean_dgr3', 'Лёгкий кинжал океана', 5, 1, 6, 12000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 2, defence: 1, spellpower: 1, initiative: 1 }, { increase_close_combat_damage: 3 }, enum_aset.ocean),
  new Artefact('ocean_sword3', 'Лёгкий меч океана', 5, 1, 10, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 8 }, enum_aset.ocean),
  new Artefact('ocean_hlm3', 'Лёгкий шлем океана', 5, 1, 7, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 2, spellpower: 1, knowledge: 1 }, { close_combat_protection: 3, range_combat_protection: 1 }, enum_aset.ocean),
  new Artefact('ocean_m_shield3', 'Лёгкий  щит океана', 5, 1, 10, 12000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, spellpower: 1, knowledge: 1 }, { close_combat_protection: 5, range_combat_protection: 5 }, enum_aset.ocean),
  new Artefact('ocean_bw2', 'Лук океана', 9, 1, 9, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 3, initiative: 1 }, { increase_range_combat_damage: 16 }, enum_aset.ocean),
  new Artefact('ocean_sword2', 'Меч океана', 9, 1, 13, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 2, spellpower: 1, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 12 }, enum_aset.ocean),
  new Artefact('ocean_eye2', 'Око океана', 9, 1, 5, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 2, knowledge: 1, initiative: 1 }, null, enum_aset.ocean),
  new Artefact('ocean_per2', 'Перстень океана', 9, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 3, knowledge: 1, initiative: 3 }, null, enum_aset.ocean),
  new Artefact('ocean_cl2', 'Плащ океана', 9, 1, 9, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 1, knowledge: 2, initiative: 2 }, { range_combat_protection: 13 }, enum_aset.ocean),
  new Artefact('ocean_ring3', 'Простое кольцо океана', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 1, initiative: 3 }, null, enum_aset.ocean),
  new Artefact('ocean_eye3', 'Простое око океана', 5, 1, 3, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 1, knowledge: 1 }, null, enum_aset.ocean),
  new Artefact('m_amul3', 'Простой амулет океана', 5, 1, 11, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 1, spellpower: 1, knowledge: 1, initiative: 4 }, { hero_initiative: 3 }, enum_aset.ocean),
  new Artefact('ocean_bw3', 'Простой лук океана', 5, 1, 7, 12000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2 }, { increase_range_combat_damage: 12 }, enum_aset.ocean),
  new Artefact('ocean_per3', 'Простой перстень океана', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, knowledge: 1, initiative: 2 }, null, enum_aset.ocean),
  new Artefact('ocean_cl3', 'Простой плащ океана', 5, 1, 7, 12000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }, { range_combat_protection: 9 }, enum_aset.ocean),
  new Artefact('ocean_boots2', 'Сапоги океана', 9, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 1, defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 8 }, enum_aset.ocean),
  new Artefact('ocean_hlm2', 'Шлем океана', 9, 1, 10, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 5, range_combat_protection: 2 }, enum_aset.ocean),
  new Artefact('ocean_m_shield2', 'Щит океана', 9, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 5, spellpower: 1, knowledge: 1 }, { close_combat_protection: 7, range_combat_protection: 7 }, enum_aset.ocean),

  // event -> adventurer
  new Artefact('adv_neck1', 'Амулет авантюриста', 14, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 3 }, null, enum_aset.adventurer),
  new Artefact('adv_armor1', 'Броня авантюриста', 14, 1, 15, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5, spellpower: 1, initiative: 4 }, { magic_protection: 10, close_combat_protection: 12, range_combat_protection: 9 }, enum_aset.adventurer),
  new Artefact('a_dagger1', 'Кинжал авантюриста', 14, 1, 11, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 5, defence: 1, initiative: 3 }, { increase_close_combat_damage: 7 }, enum_aset.adventurer),
  new Artefact('adv_fring1', 'Кольцо авантюриста', 14, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, initiative: 4, luck: 1 }, null, enum_aset.adventurer),
  new Artefact('adv_armor2', 'Лёгкая броня авантюриста', 6, 1, 11, 10000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, spellpower: 1, initiative: 3 }, { magic_protection: 7, close_combat_protection: 8, range_combat_protection: 7 }, enum_aset.adventurer),
  new Artefact('adv_boot2', 'Лёгкие сапоги авантюриста', 6, 1, 10, 10000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 5 }, { close_combat_protection: 4 }, enum_aset.adventurer),
  new Artefact('adv_hm2', 'Лёгкий шлем авантюриста', 6, 1, 10, 10000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 2, initiative: 3 }, { magic_protection: 9, close_combat_protection: 7, range_combat_protection: 7 }, enum_aset.adventurer),
  new Artefact('adv_shild2', 'Лёгкий щит авантюриста', 6, 1, 11, 10000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 4, initiative: 3 }, { close_combat_protection: 4, range_combat_protection: 12, magic_protection: 7 }, enum_aset.adventurer),
  new Artefact('adv_saber2', 'Лёгкий ятаган авантюриста', 6, 1, 11, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, initiative: 3 }, { increase_close_combat_damage: 11 }, enum_aset.adventurer),
  new Artefact('adv_longbow1', 'Лук авантюриста', 14, 1, 10, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 3, initiative: 2 }, { increase_range_combat_damage: 20 }, enum_aset.adventurer),
  new Artefact('adv_clk1', 'Плащ авантюриста', 14, 1, 12, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 4, initiative: 4 }, { range_combat_protection: 23 }, enum_aset.adventurer),
  new Artefact('adv_sumk2', 'Простая сумка авантюриста', 6, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, initiative: 2 }, null, enum_aset.adventurer),
  new Artefact('adv_fring2', 'Простое кольцо авантюриста', 6, 1, 6, 10000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, initiative: 4, luck: 1 }, null, enum_aset.adventurer),
  new Artefact('adv_neck2', 'Простой амулет авантюриста', 5, 1, 7, 10000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { luck: 2 }, null, enum_aset.adventurer),
  new Artefact('adv_longbow2', 'Простой лук авантюриста', 6, 1, 6, 10000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, initiative: 1 }, { increase_range_combat_damage: 12 }, enum_aset.adventurer),
  new Artefact('a_dagger2', 'Простой кинжал авантюриста', 6, 1, 8, 10000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, defence: 1, initiative: 2 }, { increase_close_combat_damage: 5 }, enum_aset.adventurer),
  new Artefact('adv_clk2', 'Простой плащ авантюриста', 5, 1, 9, 10000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 3, initiative: 3 }, { range_combat_protection: 17 }, enum_aset.adventurer),
  new Artefact('adv_boot1', 'Сапоги авантюриста', 14, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, initiative: 6 }, { close_combat_protection: 8 }, enum_aset.adventurer),
  new Artefact('adv_sumk1', 'Сумка авантюриста', 14, 1, 5, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, defence: 2, initiative: 2 }, null, enum_aset.adventurer),
  new Artefact('adv_hm1', 'Шлем авантюриста', 14, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, initiative: 4 }, { magic_protection: 10, close_combat_protection: 9, range_combat_protection: 9 }, enum_aset.adventurer),
  new Artefact('adv_shild1', 'Щит авантюриста', 14, 1, 15, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { defence: 5, initiative: 4 }, { close_combat_protection: 6, range_combat_protection: 17, magic_protection: 10 }, enum_aset.adventurer),
  new Artefact('adv_saber1', 'Ятаган авантюриста', 14, 1, 14, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 2, initiative: 3 }, { increase_close_combat_damage: 16 }, enum_aset.adventurer),

  // event -> worldwalker
  new Artefact('mir_am2', 'Амулет мироходца', 10, 1, 11, 20000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, knowledge: 1, luck: 1, initiative: 3 }, { hero_initiative: 3 }, enum_aset.worldwalker),
  new Artefact('mir_am1', 'Великий амулет мироходца', 15, 1, 13, 24000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 3, knowledge: 1, luck: 1, initiative: 4 }, { hero_initiative: 4 }, enum_aset.worldwalker),
  new Artefact('mir_bow1', 'Великий лук мироходца', 15, 1, 8, 24000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, initiative: 2 }, { increase_range_combat_damage: 16 }, enum_aset.worldwalker),
  new Artefact('mh_sword1', 'Великий меч мироходца', 15, 1, 17, 24000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 11, defence: 2, initiative: 2 }, { increase_close_combat_damage: 12 }, enum_aset.worldwalker),
  new Artefact('mir_cl1', 'Великий плащ мироходца', 15, 1, 10, 24000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 4 }, { magic_protection: 15, range_combat_protection: 15 }, enum_aset.worldwalker),
  new Artefact('mirh_ring1', 'Великое кольцо мироходца', 15, 1, 14, 24000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 5, defence: 5, initiative: 4 }, null, enum_aset.worldwalker),
  new Artefact('mirh_ring2', 'Кольцо мироходца', 10, 1, 11, 20000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, defence: 4, initiative: 3 }, null, enum_aset.worldwalker),
  new Artefact('mir_bow3', 'Лёгкий лук мироходца', 6, 1, 4, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 1 }, { increase_range_combat_damage: 6 }, enum_aset.worldwalker),
  new Artefact('mir_armor2', 'Доспех мироходца', 10, 1, 10, 20000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { close_combat_protection: 6 }, enum_aset.worldwalker),
  new Artefact('mir_armor3', 'Лёгкий доспех мироходца', 6, 1, 8, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4 }, { close_combat_protection: 3 }, enum_aset.worldwalker),
  new Artefact('mir_cl3', 'Лёгкий плащ мироходца', 6, 1, 6, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 2 }, { magic_protection: 8, range_combat_protection: 7 }, enum_aset.worldwalker),
  new Artefact('mir_boots3', 'Лёгкие сапоги мироходца', 6, 1, 6, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4 }, { close_combat_protection: 2 }, enum_aset.worldwalker),
  new Artefact('mh_sword3', 'Лёгкий  меч мироходца', 6, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 1, initiative: 1 }, { increase_close_combat_damage: 8 }, enum_aset.worldwalker),
  new Artefact('mir_helmt3', 'Лёгкий шлем мироходца', 6, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4 }, { close_combat_protection: 3 }, enum_aset.worldwalker),
  new Artefact('mir_shld3', 'Лёгкий щит мироходца', 6, 1, 7, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4, initiative: 1 }, { close_combat_protection: 5 }, enum_aset.worldwalker),
  new Artefact('mir_bow2', 'Лук мироходца', 10, 1, 6, 20000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, initiative: 2 }, { increase_range_combat_damage: 12 }, enum_aset.worldwalker),
  new Artefact('mh_sword2', 'Меч мироходца', 10, 1, 15, 20000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10, defence: 1, initiative: 2 }, { increase_close_combat_damage: 10 }, enum_aset.worldwalker),
  new Artefact('mir_cl2', 'Плащ мироходца', 10, 1, 8, 20000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, initiative: 3 }, { magic_protection: 10, range_combat_protection: 9 }, enum_aset.worldwalker),
  new Artefact('mirh_ring3', 'Простое кольцо мироходца', 6, 1, 8, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 3, initiative: 2 }, null, enum_aset.worldwalker),
  new Artefact('mir_am3', 'Простой амулет мироходца', 6, 1, 9, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 2, knowledge: 1, luck: 1, initiative: 2 }, { hero_initiative: 2 }, enum_aset.worldwalker),
  new Artefact('mir_boots2', 'Сапоги мироходца', 10, 1, 8, 20000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { close_combat_protection: 4 }, enum_aset.worldwalker),
  new Artefact('mir_armor1', 'Тяжёлый доспех мироходца', 15, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 6 }, { close_combat_protection: 10 }, enum_aset.worldwalker),
  new Artefact('mir_helmt1', 'Тяжёлый шлем мироходца', 15, 1, 11, 24000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 6 }, { close_combat_protection: 8 }, enum_aset.worldwalker),
  new Artefact('mir_shld1', 'Тяжёлый щит мироходца', 15, 1, 12, 24000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 7, initiative: 1 }, { close_combat_protection: 10 }, enum_aset.worldwalker),
  new Artefact('mir_boots1', 'Тяжёлые сапоги мироходца', 15, 1, 10, 24000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 6 }, { close_combat_protection: 7 }, enum_aset.worldwalker),
  new Artefact('mir_helmt2', 'Шлем мироходца', 10, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 5 }, { close_combat_protection: 5 }, enum_aset.worldwalker),
  new Artefact('mir_shld2', 'Щит мироходца', 10, 1, 9, 20000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 5, initiative: 1 }, { close_combat_protection: 7 }, enum_aset.worldwalker),

  // event -> unity
  new Artefact('ed_barrel1', 'Великая кега единства', 16, 1, 8, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 4, defence: 5, initiative: 1 }, null, enum_aset.unity),
  new Artefact('ed_mbook1', 'Великая книга единства', 15, 1, 12, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { defence: 2, spellpower: 2, knowledge: 3 }, null, enum_aset.unity),
  new Artefact('ed_pendant1', 'Великая подвеска единства', 15, 1, 16, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 3, spellpower: 1, knowledge: 1, initiative: 6 }, null, enum_aset.unity),
  new Artefact('ed_svboots1', 'Великие сапоги единства', 15, 80, 11, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 7 }, { magic_protection: 10, close_combat_protection: 10 }, enum_aset.unity),
  new Artefact('ed_armr1', 'Великий доспех единства', 15, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 7 }, { magic_protection: 10, close_combat_protection: 12 }, enum_aset.unity),
  new Artefact('ed_elfbow1', 'Великий лук единства', 15, 1, 7, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 3 }, { increase_range_combat_damage: 23 }, enum_aset.unity),
  new Artefact('ed_bsword1', 'Великий меч единства', 15, 1, 15, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 12, initiative: 1 }, { increase_close_combat_damage: 12 }, enum_aset.unity),
  new Artefact('ed_nemes1', 'Великий немес единства', 15, 80, 12, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 6, initiative: 1 }, { magic_protection: 10, range_combat_protection: 9 }, enum_aset.unity),
  new Artefact('eddem_ring1', 'Великий перстень единства', 15, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 4, initiative: 3, morale: 1 }, null, enum_aset.unity),
  new Artefact('ed_ring1', 'Великое кольцо единства', 15, 1, 10, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 2, luck: 1, initiative: 2 }, null, enum_aset.unity),
  new Artefact('ed_armr2', 'Доспех единства', 11, 1, 9, 14000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 6 }, { magic_protection: 7, close_combat_protection: 8 }, enum_aset.unity),
  new Artefact('ed_barrel2', 'Кега единства', 12, 1, 6, 14000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, defence: 4, initiative: 1 }, null, enum_aset.unity),
  new Artefact('ed_mbook2', 'Книга единства', 11, 1, 9, 14000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { defence: 2, spellpower: 1, knowledge: 2 }, null, enum_aset.unity),
  new Artefact('ed_ring2', 'Кольцо единства', 11, 1, 8, 14000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, luck: 1, initiative: 2 }, null, enum_aset.unity),
  new Artefact('ed_svboots3', 'Лёгкие сапоги единства', 6, 80, 6, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4 }, { magic_protection: 5, close_combat_protection: 5 }, enum_aset.unity),
  new Artefact('ed_armr3', 'Лёгкий доспех единства', 6, 1, 7, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 5 }, { magic_protection: 4, close_combat_protection: 4 }, enum_aset.unity),
  new Artefact('ed_bsword3', 'Лёгкий меч единства', 6, 1, 9, 12000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8 }, { increase_close_combat_damage: 6 }, enum_aset.unity),
  new Artefact('ed_nemes3', 'Лёгкий немес единства', 6, 80, 5, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, initiative: 1 }, { magic_protection: 3, range_combat_protection: 3 }, enum_aset.unity),
  new Artefact('ed_elfbow2', 'Лук единства', 11, 1, 5, 14000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 2 }, { increase_range_combat_damage: 18 }, enum_aset.unity),
  new Artefact('ed_bsword2', 'Меч единства', 11, 1, 12, 14000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 10 }, { increase_close_combat_damage: 9 }, enum_aset.unity),
  new Artefact('ed_nemes2', 'Немес единства', 12, 80, 8, 14000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 4, initiative: 1 }, { magic_protection: 6, range_combat_protection: 6 }, enum_aset.unity),
  new Artefact('eddem_ring2', 'Перстень единства', 11, 1, 8, 14000, enum_ac.event, enum_at.jewelry, enum_as.ring, { attack: 3, initiative: 2, morale: 1 }, null, enum_aset.unity),
  new Artefact('ed_pendant2', 'Подвеска единства', 11, 1, 11, 14000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }, null, enum_aset.unity),
  new Artefact('ed_barrel3', 'Простая кега единства', 6, 1, 4, 12000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 3, initiative: 1 }, null, enum_aset.unity),
  new Artefact('ed_mbook3', 'Простая книга единства', 6, 54, 6, 12000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { defence: 1, spellpower: 1, knowledge: 1 }, null, enum_aset.unity),
  new Artefact('ed_pendant3', 'Простая подвеска единства', 6, 1, 8, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 2 }, null, enum_aset.unity),
  new Artefact('ed_ring3', 'Простое кольцо единства', 6, 1, 6, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, luck: 1 }, null, enum_aset.unity),
  new Artefact('ed_elfbow3', 'Простой лук единства', 6, 1, 4, 12000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { initiative: 1 }, { increase_range_combat_damage: 14 }, enum_aset.unity),
  new Artefact('eddem_ring3', 'Простой перстень единства', 6, 1, 6, 12000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, initiative: 1, morale: 1 }, null, enum_aset.unity),
  new Artefact('ed_svboots2', 'Сапоги единства', 11, 80, 8, 14000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5 }, { magic_protection: 8, close_combat_protection: 8 }, enum_aset.unity),

  // event -> stalker
  new Artefact('stalker_crsb2', 'Арбалет ловчего', 9, 1, 8, 12800, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, initiative: 1 }, { increase_range_combat_damage: 11 }, enum_aset.stalker),
  new Artefact('stalker_aml2', 'Амулет ловчего', 9, 1, 8, 12800, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, initiative: 1, luck: 2 }, null, enum_aset.stalker),
  new Artefact('stalker_ark2', 'Аркан ловчего', 9, 1, 6, 12800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2 }, null, enum_aset.stalker),
  new Artefact('stalker_boot1', 'Великие сапоги ловчего', 15, 1, 14, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 5, initiative: 6 }, { close_combat_protection: 7 }, enum_aset.stalker),
  new Artefact('stalker_aml1', 'Великий амулет ловчего', 15, 1, 11, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, initiative: 2, luck: 2 }, null, enum_aset.stalker),
  new Artefact('stalker_ark1', 'Великий аркан ловчего', 15, 1, 8, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3 }, null, enum_aset.stalker),
  new Artefact('stalker_crsb1', 'Великий арбалет ловчего', 15, 1, 11, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 4, initiative: 1 }, { increase_range_combat_damage: 18 }, enum_aset.stalker),
  new Artefact('stalker_armour1', 'Великий доспех ловчего', 15, 1, 15, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, knowledge: 1, initiative: 5 }, { magic_protection: 10, close_combat_protection: 12, range_combat_protection: 10 }, enum_aset.stalker),
  new Artefact('stalker_hlm1', 'Великий капюшон ловчего', 15, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 2, defence: 2, initiative: 3 }, { magic_protection: 5, close_combat_protection: 10, range_combat_protection: 10 }, enum_aset.stalker),
  new Artefact('stalker_dagger1', 'Великий кинжал ловчего', 15, 1, 11, 16000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 6, initiative: 2 }, { increase_close_combat_damage: 9 }, enum_aset.stalker),
  new Artefact('stalker_backsword1', 'Великий палаш ловчего', 15, 1, 15, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 1, initiative: 3 }, { increase_close_combat_damage: 18 }, enum_aset.stalker),
  new Artefact('stalker_sring1', 'Великий перстень ловчего', 15, 1, 11, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 2, initiative: 6 }, null, enum_aset.stalker),
  new Artefact('stalker_cl1', 'Великий плащ ловчего', 15, 1, 13, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 3, initiative: 5 }, { magic_protection: 10, range_combat_protection: 20 }, enum_aset.stalker),
  new Artefact('stalker_shid1', 'Великий щит ловчего', 15, 1, 16, 16000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 4, initiative: 5 }, { magic_protection: 10, close_combat_protection: 9, range_combat_protection: 20 }, enum_aset.stalker),
  new Artefact('stalker_iring1', 'Великое кольцо ловчего', 15, 1, 11, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 2, initiative: 4, luck: 1 }, null, enum_aset.stalker),
  new Artefact('stalker_armour2', 'Доспех ловчего', 9, 1, 12, 12800, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, knowledge: 1, initiative: 4 }, { magic_protection: 7, close_combat_protection: 8, range_combat_protection: 7 }, enum_aset.stalker),
  new Artefact('stalker_hlm2', 'Капюшон ловчего', 9, 1, 10, 12800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 2, initiative: 2 }, { magic_protection: 4, close_combat_protection: 7, range_combat_protection: 7 }, enum_aset.stalker),
  new Artefact('stalker_dagger2', 'Кинжал ловчего', 9, 1, 8, 12800, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 5, initiative: 1 }, { increase_close_combat_damage: 6 }, enum_aset.stalker),
  new Artefact('stalker_iring2', 'Кольцо ловчего', 9, 1, 8, 12800, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 1, initiative: 2, luck: 1 }, null, enum_aset.stalker),
  new Artefact('stalker_boot3', 'Лёгкие сапоги ловчего', 5, 1, 7, 10000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, initiative: 2 }, { close_combat_protection: 3 }, enum_aset.stalker),
  new Artefact('stalker_crsb3', 'Лёгкий арбалет ловчего', 5, 1, 4, 10000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1 }, { increase_range_combat_damage: 7 }, enum_aset.stalker),
  new Artefact('stalker_armour3', 'Лёгкий доспех ловчего', 5, 1, 9, 10000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2, knowledge: 1, initiative: 3 }, { magic_protection: 4, close_combat_protection: 5, range_combat_protection: 4 }, enum_aset.stalker),
  new Artefact('stalker_backsword3', 'Лёгкий палаш ловчего', 6, 1, 10, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, initiative: 2 }, { increase_close_combat_damage: 12 }, enum_aset.stalker),
  new Artefact('stalker_shid3', 'Лёгкий щит ловчего', 5, 1, 9, 10000, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 2, initiative: 3 }, { magic_protection: 5, close_combat_protection: 3, range_combat_protection: 11 }, enum_aset.stalker),
  new Artefact('stalker_backsword2', 'Палаш ловчего', 9, 1, 12, 12800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 7, defence: 1, initiative: 3 }, { increase_close_combat_damage: 15 }, enum_aset.stalker),
  new Artefact('stalker_sring2', 'Перстень ловчего', 9, 1, 8, 12800, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 1, initiative: 5 }, null, enum_aset.stalker),
  new Artefact('stalker_cl2', 'Плащ ловчего', 9, 1, 10, 12800, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 2, initiative: 3 }, { magic_protection: 7, range_combat_protection: 15 }, enum_aset.stalker),
  new Artefact('stalker_iring3', 'Простое кольцо ловчего', 5, 1, 6, 10000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { defence: 1, initiative: 1, luck: 1 }, null, enum_aset.stalker),
  new Artefact('stalker_aml3', 'Простой амулет ловчего', 5, 1, 5, 10000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 1, initiative: 1, luck: 1 }, null, enum_aset.stalker),
  new Artefact('stalker_ark3', 'Простой аркан ловчего', 5, 1, 4, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1 }, null, enum_aset.stalker),
  new Artefact('stalker_hlm3', 'Простой капюшон ловчего', 5, 1, 8, 10000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 1, initiative: 2 }, { magic_protection: 3, close_combat_protection: 5, range_combat_protection: 5 }, enum_aset.stalker),
  new Artefact('stalker_dagger3', 'Простой кинжал ловчего', 5, 1, 6, 10000, enum_ac.event, enum_at.weapon, enum_as.left_arm, enum_amc.weapon, { attack: 4, initiative: 1 }, { increase_close_combat_damage: 3 }, enum_aset.stalker),
  new Artefact('stalker_sring3', 'Простой перстень ловчего', 5, 1, 6, 10000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, initiative: 4 }, null, enum_aset.stalker),
  new Artefact('stalker_cl3', 'Простой плащ ловчего', 5, 1, 7, 10000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { attack: 1, defence: 1, initiative: 2 }, { magic_protection: 5, range_combat_protection: 11 }, enum_aset.stalker),
  new Artefact('stalker_boot2', 'Сапоги ловчего', 9, 1, 11, 12800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, initiative: 4 }, { close_combat_protection: 5 }, enum_aset.stalker),
  new Artefact('stalker_shid2', 'Щит ловчего', 9, 1, 13, 12800, enum_ac.event, enum_at.armor, enum_as.left_arm, enum_amc.shield, { attack: 1, defence: 3, initiative: 4 }, { magic_protection: 8, close_combat_protection: 6, range_combat_protection: 16 }, enum_aset.stalker),

  // event -> armada
  new Artefact('armad_aml2', 'Амулет армады', 11, 1, 14, 12800, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, defence: 1, spellpower: 1, knowledge: 2, initiative: 5 }, { hero_initiative: 4 }, enum_aset.armada),
  new Artefact('arm_bts1', 'Великие сапоги армады', 16, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 4, spellpower: 1, initiative: 3 }, { close_combat_protection: 10, hero_initiative: 13 }, enum_aset.armada),
  new Artefact('armad_aml1', 'Великий амулет армады', 16, 1, 17, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 5, defence: 1, spellpower: 1, knowledge: 2, initiative: 7 }, { hero_initiative: 5 }, enum_aset.armada),
  new Artefact('arm_garp1', 'Великий гарпун армады', 16, 1, 14, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, spellpower: 2, knowledge: 2, initiative: 4 }, { increase_range_combat_damage: 15 }, enum_aset.armada),
  new Artefact('arm_armor1', 'Великий камзол армады', 16, 1, 15, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 5, spellpower: 1, knowledge: 2, initiative: 2 }, { close_combat_protection: 6, range_combat_protection: 6 }, enum_aset.armada),
  new Artefact('arm_cap1', 'Великий капюшон армады', 16, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 2, defence: 3, spellpower: 2, knowledge: 1, initiative: 2 }, { close_combat_protection: 6, range_combat_protection: 5 }, enum_aset.armada),
  new Artefact('arm_handgun1', 'Великий пистолет армады', 16, 1, 16, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, spellpower: 2, initiative: 5 }, { increase_range_combat_damage: 13 }, enum_aset.armada),
  new Artefact('arm_clk1', 'Великий плащ армады', 16, 1, 14, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 2, spellpower: 2, knowledge: 3, initiative: 3 }, { range_combat_protection: 21 }, enum_aset.armada),
  new Artefact('arm_tesak1', 'Великий тесак армады', 16, 1, 19, 16000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 9, defence: 1, knowledge: 1, initiative: 4 }, { increase_close_combat_damage: 16 }, enum_aset.armada),
  new Artefact('arm_sekstant1', 'Великий секстант армады', 16, 1, 7, 16000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 3, defence: 1, spellpower: 2, initiative: 1 }, null, enum_aset.armada),
  new Artefact('arm_r1', 'Великое кольцо армады', 16, 1, 15, 16000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 3, defence: 3, spellpower: 3, knowledge: 3, initiative: 3 }, null, enum_aset.armada),
  new Artefact('arm_garp2', 'Гарпун армады', 11, 1, 11, 12800, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 2, knowledge: 2, initiative: 3 }, { increase_range_combat_damage: 10 }, enum_aset.armada),
  new Artefact('arm_armor2', 'Камзол армады', 11, 1, 11, 12800, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 4, spellpower: 1, knowledge: 1, initiative: 1 }, { close_combat_protection: 4, range_combat_protection: 4 }, enum_aset.armada),
  new Artefact('arm_cap2', 'Капюшон армады', 11, 1, 9, 12800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, spellpower: 2, knowledge: 1, initiative: 1 }, { close_combat_protection: 4, range_combat_protection: 3 }, enum_aset.armada),
  new Artefact('arm_r2', 'Кольцо армады', 11, 1, 12, 12800, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 2, defence: 3, spellpower: 3, knowledge: 2, initiative: 2 }, null, enum_aset.armada),
  new Artefact('arm_bts3', 'Лёгкие сапоги армады', 6, 1, 7, 10000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, spellpower: 1, initiative: 1 }, { close_combat_protection: 4, hero_initiative: 6 }, enum_aset.armada),
  new Artefact('arm_cap3', 'Лёгкий капюшон армады', 6, 1, 7, 10000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, spellpower: 2, knowledge: 1, initiative: 1 }, { close_combat_protection: 2, range_combat_protection: 2 }, enum_aset.armada),
  new Artefact('arm_tesak3', 'Лёгкий тесак армады', 6, 1, 11, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 6, defence: 1, knowledge: 1, initiative: 1 }, { increase_close_combat_damage: 6 }, enum_aset.armada),
  new Artefact('arm_clk2', 'Плащ армады', 11, 1, 10, 12800, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 2, knowledge: 2, initiative: 2 }, { range_combat_protection: 15 }, enum_aset.armada),
  new Artefact('arm_handgun2', 'Пистолет армады', 11, 1, 12, 12800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 5, spellpower: 2, initiative: 4 }, { increase_range_combat_damage: 9 }, enum_aset.armada),
  new Artefact('arm_r3', 'Простое кольцо армады', 6, 1, 9, 10000, enum_ac.event, enum_at.jewelry, enum_as.ring, enum_amc.ring, { attack: 1, defence: 3, spellpower: 2, knowledge: 2, initiative: 1 }, null, enum_aset.armada),
  new Artefact('armad_aml3', 'Простой амулет армады', 6, 1, 10, 10000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, defence: 1, spellpower: 1, knowledge: 1, initiative: 3 }, { hero_initiative: 3 }, enum_aset.armada),
  new Artefact('arm_garp3', 'Простой гарпун армады', 6, 1, 8, 10000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 1, knowledge: 2, initiative: 2 }, { increase_range_combat_damage: 5 }, enum_aset.armada),
  new Artefact('arm_armor3', 'Простой камзол армады', 6, 1, 8, 10000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 3, knowledge: 1, initiative: 1 }, { close_combat_protection: 2, range_combat_protection: 2 }, enum_aset.armada),
  new Artefact('arm_handgun3', 'Простой пистолет армады', 6, 1, 10, 10000, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 4, spellpower: 2, initiative: 4 }, { increase_range_combat_damage: 6 }, enum_aset.armada),
  new Artefact('arm_clk3', 'Простой плащ армады', 6, 1, 6, 10000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 1, knowledge: 1, initiative: 1 }, { range_combat_protection: 11 }, enum_aset.armada),
  new Artefact('arm_sekstant3', 'Простой секстант армады', 6, 1, 3, 10000, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 1, spellpower: 1, initiative: 1 }, null, enum_aset.armada),
  new Artefact('arm_bts2', 'Сапоги армады', 11, 1, 9, 12800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, spellpower: 1, initiative: 2 }, { close_combat_protection: 7, hero_initiative: 10 }, enum_aset.armada),
  new Artefact('arm_sekstant2', 'Секстант армады', 11, 1, 5, 12800, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.backpack, { attack: 2, defence: 1, spellpower: 1, initiative: 1 }, null, enum_aset.armada),
  new Artefact('arm_tesak2', 'Тесак армады', 11, 1, 15, 12800, enum_ac.event, enum_at.weapon, enum_as.right_arm, enum_amc.weapon, { attack: 8, defence: 1, knowledge: 1, initiative: 2 }, { increase_close_combat_damage: 11 }, enum_aset.armada),

  // event -> wanderer
  new Artefact('wanderer_amul2', 'Амулет странника', 11, 1, 13, 14000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 3, spellpower: 1, knowledge: 1, initiative: 3, luck: 1 }, { hero_initiative: 4 }, enum_aset.wanderer),
  new Artefact('wanderer_cb2', 'Арбалет странника', 11, 1, 8, 14000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, spellpower: 1, knowledge: 1, initiative: 2 }, { increase_range_combat_damage: 12 }, enum_aset.wanderer),
  new Artefact('wanderer_hat1', 'Великая шляпа странника', 15, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 3, knowledge: 2, initiative: 5 }, { magic_protection: 12, close_combat_protection: 6, range_combat_protection: 12 }, enum_aset.wanderer),
  new Artefact('wanderer_boot1', 'Великие сапоги странника', 15, 1, 12, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 3, knowledge: 1, initiative: 5 }, { magic_protection: 10, close_combat_protection: 9, hero_initiative: 12 }, enum_aset.wanderer),
  new Artefact('wanderer_amul1', 'Великий амулет странника', 15, 1, 16, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 4, spellpower: 1, knowledge: 1, initiative: 5, luck: 1 }, { hero_initiative: 6 }, enum_aset.wanderer),
  new Artefact('wanderer_cb1', 'Великий арбалет странника', 15, 1, 11, 16000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 2, spellpower: 1, knowledge: 1, initiative: 3 }, { increase_range_combat_damage: 17 }, enum_aset.wanderer),
  new Artefact('wanderer_armor1', 'Великий доспех странника', 15, 80, 12, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 4, knowledge: 1, initiative: 4 }, { magic_protection: 12, close_combat_protection: 10 }, enum_aset.wanderer),
  new Artefact('wandr_cloack1', 'Великий плащ странника', 15, 1, 12, 16000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 2, spellpower: 1, knowledge: 1, initiative: 3 }, { magic_protection: 20, close_combat_protection: 11 }, enum_aset.wanderer),
  new Artefact('wanderer_armor2', 'Доспех странника', 11, 80, 9, 14000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 3, knowledge: 1, initiative: 3 }, { magic_protection: 10, close_combat_protection: 7 }, enum_aset.wanderer),
  new Artefact('wanderer_boot3', 'Лёгкие сапоги странника', 6, 1, 6, 12000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 1, knowledge: 1, initiative: 3 }, { magic_protection: 4, close_combat_protection: 3, hero_initiative: 4 }, enum_aset.wanderer),
  new Artefact('wanderer_cb3', 'Лёгкий арбалет странника', 6, 1, 5, 12000, enum_ac.event, enum_at.weapon, enum_as.rear, enum_amc.weapon, { attack: 1, knowledge: 1, initiative: 1 }, { increase_range_combat_damage: 8 }, enum_aset.wanderer),
  new Artefact('wanderer_armor3', 'Лёгкий доспех странника', 6, 80, 6, 12000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { defence: 2, knowledge: 1, initiative: 2 }, { magic_protection: 7, close_combat_protection: 4 }, enum_aset.wanderer),
  new Artefact('wandr_cloack2', 'Плащ странника', 11, 1, 8, 14000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, spellpower: 1, knowledge: 1, initiative: 2 }, { magic_protection: 15, close_combat_protection: 7 }, enum_aset.wanderer),
  new Artefact('wanderer_hat3', 'Простая шляпа странника', 6, 1, 6, 12000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 1, knowledge: 2, initiative: 3 }, { magic_protection: 6, close_combat_protection: 2, range_combat_protection: 6 }, enum_aset.wanderer),
  new Artefact('wanderer_amul3', 'Простой амулет странника', 6, 1, 10, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, spellpower: 1, knowledge: 1, initiative: 2, luck: 1 }, { hero_initiative: 2 }, enum_aset.wanderer),
  new Artefact('wandr_cloack3', 'Простой плащ странника', 6, 1, 5, 12000, enum_ac.event, enum_at.jewelry, enum_as.rear, enum_amc.cloack, { defence: 1, knowledge: 1, initiative: 1 }, { magic_protection: 10, close_combat_protection: 4 }, enum_aset.wanderer),
  new Artefact('wanderer_boot2', 'Сапоги странника', 11, 1, 9, 14000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { defence: 2, knowledge: 1, initiative: 4 }, { magic_protection: 7, close_combat_protection: 6, hero_initiative: 8 }, enum_aset.wanderer),
  new Artefact('wanderer_hat2', 'Шляпа странника', 11, 1, 9, 14000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { defence: 2, knowledge: 2, initiative: 4 }, { magic_protection: 9, close_combat_protection: 4, range_combat_protection: 9 }, enum_aset.wanderer),

  // event -> ronin
  new Artefact('ronin_mask3', 'Забытая маска ронина', 6, 1, 5, 10000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 1, initiative: 1 }, { magic_protection: 5, close_combat_protection: 5, range_combat_protection: 3 }, enum_aset.ronin),
  new Artefact('ronin_sh3', 'Забытые поножи ронина', 6, 1, 7, 10000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 2, defence: 1 }, { close_combat_protection: 3 }, enum_aset.ronin),
  new Artefact('ronin_mask1', 'Зловещая маска ронина', 16, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 3, defence: 1, initiative: 3 }, { magic_protection: 10, close_combat_protection: 10, range_combat_protection: 5 }, enum_aset.ronin),
  new Artefact('ronin_sh1', 'Зловещие поножи ронина', 16, 1, 13, 16000, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 4, defence: 1, initiative: 2 }, { close_combat_protection: 8 }, enum_aset.ronin),
  new Artefact('ronin_mask2', 'Мрачная маска ронина', 11, 1, 9, 12800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 2, defence: 1, initiative: 2 }, { magic_protection: 7, close_combat_protection: 7, range_combat_protection: 4 }, enum_aset.ronin),
  new Artefact('ronin_sh2', 'Мрачные поножи ронина', 11, 1, 10, 12800, enum_ac.event, enum_at.armor, enum_as.foots, enum_amc.boots, { attack: 3, defence: 1, initiative: 1 }, { close_combat_protection: 5 }, enum_aset.ronin),

  // event -> honor
  new Artefact('honorarmour_1', 'Великий доспех чести', 17, 80, 14, 16000, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 4, initiative: 4 }, { magic_protection: 12, close_combat_protection: 14 }, enum_aset.honor),
  new Artefact('honorhelm_1', 'Великий шлем чести', 17, 80, 13, 16000, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 5, initiative: 3 }, { magic_protection: 12, close_combat_protection: 9 }, enum_aset.honor),
  new Artefact('honorarmour_2', 'Доспех чести', 12, 80, 11, 14400, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 3, initiative: 3 }, { magic_protection: 10, close_combat_protection: 11 }, enum_aset.honor),
  new Artefact('honorarmour_3', 'Лёгкий доспех чести', 6, 80, 8, 12800, enum_ac.event, enum_at.armor, enum_as.body, enum_amc.cuirass, { attack: 1, defence: 2, initiative: 2 }, { magic_protection: 8, close_combat_protection: 8 }, enum_aset.honor),
  new Artefact('honorhelm_3', 'Лёгкий шлем чести', 6, 80, 7, 12800, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 3, initiative: 1 }, { magic_protection: 8, close_combat_protection: 3 }, enum_aset.honor),
  new Artefact('honorhelm_2', 'Шлем чести', 12, 80, 10, 14400, enum_ac.event, enum_at.armor, enum_as.head, enum_amc.helm, { attack: 1, defence: 4, initiative: 2 }, { magic_protection: 10, close_combat_protection: 6 }, enum_aset.honor),

  // event -> legend
  new Artefact('legend_nature1', 'Амулет природной грации', 17, 1, 16, 16000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 3, initiative: 5 }, null, enum_aset.legend),
  new Artefact('legend_nature3', 'Амулет природной лёгкости', 6, 1, 9, 12000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 1, defence: 2, initiative: 3 }, null, enum_aset.legend),
  new Artefact('legend_nature2', 'Амулет природной ловкости', 12, 1, 12, 14000, enum_ac.event, enum_at.jewelry, enum_as.neck, enum_amc.necklace, { attack: 2, defence: 2, initiative: 4 }, null, enum_aset.legend),

  // potions
  new Artefact('potion01', 'Зелье силы', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { attack: 1 }),
  new Artefact('potion02', 'Зелье защиты', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { defence: 1 }),
  new Artefact('potion03', 'Зелье ловкости', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { initiative: 1 }),
  new Artefact('potion04', 'Зелье заклинаний', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { spellpower: 1 }),
  new Artefact('potion05', 'Зелье знаний', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { knowledge: 1 }),
  new Artefact('potion06', 'Зелье стража', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { attack: 1, defence: 1 }),
  new Artefact('potion07', 'Зелье воина', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { attack: 1, initiative: 1 }),
  new Artefact('potion08', 'Зелье искусства', 1, 1, 1, 0, enum_ac.event, enum_at.untyped, enum_as.backpack, enum_amc.other, { defence: 1, initiative: 1 })
];

//----------------------------------------------------------------------------//

function Artefact(id_, name_, lvl_, usual_dur_, ap_, repair_cost_, kind_, type_, slot_, market_cat_, states_, ex_states_, set_){
  this.id          = id_;
  this.name        = name_;
  this.lvl         = lvl_;
  this.usual_dur   = usual_dur_;
  this.ap          = ap_;
  this.repair_cost = repair_cost_;
  this.kind        = kind_;
  this.type        = type_;
  this.slot        = slot_;
  this.market_cat  = market_cat_;
  this.set         = set_ || enum_aset.no_set;
  this.states      = {
    attack:     0,
    defence:    0,
    spellpower: 0,
    knowledge:  0,
    initiative: 0,
    morale:     0,
    luck:       0
  };
  this.ex_states   = {
    magic_protection:             0,
    close_combat_protection:      0,
    range_combat_protection:      0,
    increase_range_combat_damage: 0,
    increase_close_combat_damage: 0,
    hero_initiative:              0
  };

  this.price = 0;
  this.ppb   = 0;

  set_a_price(this);
  set_a_state(this, states_ || {});
  set_a_ex_state(this, ex_states_ || {});
}

save_value('GN_CommonValues_Artefacts', JSON.stringify(artefacts));

function get_a_prices() {
  return [
    // head
    { id: 'leatherhat', name: 'Кожаная шляпа', price: 180, ppb: 15.00 },
    { id: 'leather_helm', name: 'Кожаный шлем', price: 640, ppb: 21.33 },
    { id: 'wizard_cap', name: 'Колпак мага', price: 1680, ppb: 48.00 },
    { id: 'chain_coif', name: 'Кольчужный шлем', price: 1571, ppb: 39.27 },
    { id: 'xymhelmet15', name: 'Корона пламенного чародея', price: 6960, ppb: 99.43 },
    { id: 'mhelmetzh13', name: 'Корона чернокнижника', price: 6720, ppb: 96.00 },
    { id: 'mif_lhelmet', name: 'Лёгкий мифриловый шлем', price: 5520, ppb: 78.86 },
    { id: 'zxhelmet13', name: 'Обсидиановый шлем', price: 6518, ppb: 93.11 },
    { id: 'shelm12', name: 'Рубиновый шлем', price: 2716, ppb: 67.90 },
    { id: 'steel_helmet', name: 'Стальной шлем', price: 3754, ppb: 53.63 },
    { id: 'mif_hhelmet', name: 'Тяжёлый мифриловый шлем', price: 6431, ppb: 91.87 },
    { id: 'shelm16', name: 'Шлем благородства', price: 2832, ppb: 70.80 },
    { id: 'mage_helm', name: 'Шлем мага', price: 3450, ppb: 69.00 },
    { id: 'shelm8', name: 'Шлем отваги', price: 1222, ppb: 40.73 },
    { id: 'myhelmet15', name: 'Шлем пламени', price: 6722, ppb: 96.03 },
    { id: 'helmet17', name: 'Шлем рассвета', price: 7391, ppb: 105.59 },
    { id: 'mhelmet17', name: 'Шлем сумерек', price: 7620, ppb: 108.86 },
    { id: 'knowledge_hat', name: 'Шляпа знаний', price: 1030, ppb: 41.20 },

    // necklace
    { id: 'wzzamulet16', name: 'Амулет битвы', price: 11204, ppb: 172.37 },
    { id: 'mmzamulet16', name: 'Амулет духа', price: 11550, ppb: 177.69 },
    { id: 'smamul17', name: 'Амулет единения', price: 4620, ppb: 154.00 },
    { id: 'bafamulet15', name: 'Амулет трёх стихий', price: 11380, ppb: 175.08 },
    { id: 'amulet_of_luck', name: 'Амулет удачи', price: 980, ppb: 39.20 },
    { id: 'samul14', name: 'Амулет фортуны', price: 4462, ppb: 148.73 },
    { id: 'wzzamulet13', name: 'Амулет ярости', price: 10185, ppb: 169.75 },
    { id: 'warrior_pendant', name: 'Кулон воина', price: 8216, ppb: 164.32 },
    { id: 'mamulet19', name: 'Кулон непостижимости', price: 11620, ppb: 178.77 },
    { id: 'power_pendant', name: 'Кулон отчаяния', price: 7537, ppb: 125.62 },
    { id: 'amulet19', name: 'Кулон рвения', price: 11271, ppb: 173.40 },
    { id: 'magic_amulet', name: 'Магический амулет', price: 8820, ppb: 176.40 },
    { id: 'bravery_medal', name: 'Медаль отваги', price: 572, ppb: 22.88 },
    { id: 'mmzamulet13', name: 'Мистический амулет', price: 10500, ppb: 175.00 },
    { id: 'samul17', name: 'Оскал дракона', price: 4481, ppb: 149.37 },
    { id: 'smamul14', name: 'Осколок тьмы', price: 4600, ppb: 153.33 },
    { id: 'samul8', name: 'Счастливая подкова', price: 3463, ppb: 115.43 },

    // armor
    { id: 'hauberk', name: 'Боевая кольчуга', price: 2338, ppb: 58.45 },
    { id: 'armor15', name: 'Доспех пламени', price: 9506, ppb: 135.80 },
    { id: 'marmor17', name: 'Доспехи сумерек', price: 9800, ppb: 140.00 },
    { id: 'sarmor16', name: 'Кираса благородства', price: 4443, ppb: 100.98 },
    { id: 'armor17', name: 'Кираса рассвета', price: 9690, ppb: 138.43 },
    { id: 'leather_shiled', name: 'Кожаная броня', price: 272, ppb: 15.11 },
    { id: 'leatherplate', name: 'Кожаные доспехи', price: 1387, ppb: 46.23 },
    { id: 'mif_light', name: 'Лёгкая мифриловая кираса', price: 6580, ppb: 94.00 },
    { id: 'sarmor9', name: 'Мифриловая кольчуга', price: 2532, ppb: 63.30 },
    { id: 'miff_plate', name: 'Мифриловые доспехи', price: 10049, ppb: 133.99 },
    { id: 'sarmor13', name: 'Обсидиановая броня', price: 4414, ppb: 88.28 },
    { id: 'mage_armor', name: 'Одеяние мага', price: 4700, ppb: 94.00 },
    { id: 'robewz15', name: 'Роба пламенного чародея', price: 9800, ppb: 140.00 },
    { id: 'wiz_robe', name: 'Роба чародея', price: 9870, ppb: 141.00 },
    { id: 'ciras', name: 'Стальная кираса', price: 4549, ppb: 64.99 },
    { id: 'full_plate', name: 'Стальные доспехи', price: 9438, ppb: 125.84 },

    // cloack
    { id: 'cloack17', name: 'Мантия вечности', price: 10500, ppb: 161.54 },
    { id: 'cloackwz15', name: 'Мантия пламенного чародея', price: 10120, ppb: 155.69 },
    { id: 'scloack8', name: 'Маскировочный плащ', price: 2095, ppb: 69.83 },
    { id: 'soul_cape', name: 'Накидка духов', price: 1222, ppb: 40.73 },
    { id: 'wiz_cape', name: 'Накидка чародея', price: 9170, ppb: 152.83 },
    { id: 'scloack16', name: 'Плащ драконьего покрова', price: 3259, ppb: 108.63 },
    { id: 'powercape', name: 'Плащ магической силы', price: 5620, ppb: 140.50 },
    { id: 'scoutcloack', name: 'Плащ разведчика', price: 320, ppb: 16.00 },
    { id: 'antiair_cape', name: 'Халат ветров', price: 3080, ppb: 51.33 },
    { id: 'antimagic_cape', name: 'Халат магической защиты', price: 5210, ppb: 104.20 },

    // weapon
    { id: 'staff', name: 'Боевой посох ', price: 2660, ppb: 66.50 },
    { id: 'sword18', name: 'Гладий предвестия', price: 18129, ppb: 258.99 },
    { id: 'wood_sword', name: 'Деревянный меч', price: 140, ppb: 20.00 },
    { id: 'long_bow', name: 'Длинный лук', price: 6650, ppb: 133.00 },
    { id: 'dagger_dex', name: 'Кинжал ловкости', price: 4840, ppb: 121.00 },
    { id: 'dagger', name: 'Кинжал мести', price: 960, ppb: 32.00 },
    { id: 'dagger20', name: 'Клинок сумерек', price: 9780, ppb: 163.00 },
    { id: 'dagger16', name: 'Клинок феникса', price: 9312, ppb: 155.20 },
    { id: 'shortbow', name: 'Короткий лук', price: 360, ppb: 18.00 },
    { id: 'gnome_hammer', name: 'Легкий топорик', price: 310, ppb: 12.40 },
    { id: 'bow14', name: 'Лук полуночи', price: 10156, ppb: 156.25 },
    { id: 'bow17', name: 'Лук рассвета', price: 10321, ppb: 158.78 },
    { id: 'scroll18', name: 'Манускрипт концентрации', price: 10850, ppb: 155.00 },
    { id: 'power_sword', name: 'Меч власти', price: 9981, ppb: 124.76 },
    { id: 'requital_sword', name: 'Меч возмездия', price: 2580, ppb: 64.50 },
    { id: 'firsword15', name: 'Меч возрождения', price: 18042, ppb: 257.74 },
    { id: 'ssword16', name: 'Меч гармонии', price: 6179, ppb: 134.33 },
    { id: 'ssword8', name: 'Меч жесткости', price: 3919, ppb: 97.97 },
    { id: 'ssword10', name: 'Меч отваги', price: 4957, ppb: 110.16 },
    { id: 'broad_sword', name: 'Меч равновесия', price: 4821, ppb: 80.35 },
    { id: 'def_sword', name: 'Меч расправы', price: 1319, ppb: 32.98 },
    { id: 'dagger_myf', name: 'Мифриловый кинжал', price: 9080, ppb: 151.33 },
    { id: 'mif_sword', name: 'Мифриловый меч', price: 17315, ppb: 247.36 },
    { id: 'mif_staff', name: 'Мифриловый посох', price: 17250, ppb: 246.43 },
    { id: 'ssword13', name: 'Обсидиановый меч', price: 6111, ppb: 122.22 },
    { id: 'mstaff13', name: 'Обсидиановый посох', price: 5050, ppb: 126.25 },
    { id: 'mstaff8', name: 'Посох весны', price: 3040, ppb: 101.33 },
    { id: 'smstaff16', name: 'Посох забвения', price: 5140, ppb: 138.92 },
    { id: 'staff18', name: 'Посох затмения', price: 18680, ppb: 266.86 },
    { id: 'sor_staff', name: 'Посох могущества', price: 6440, ppb: 128.80 },
    { id: 'ffstaff15', name: 'Посох повелителя огня', price: 18610, ppb: 265.86 },
    { id: 'mstaff10', name: 'Посох теней', price: 3980, ppb: 113.71 },
    { id: 'mm_sword', name: 'Рубиновый меч', price: 17557, ppb: 250.81 },
    { id: 'mm_staff', name: 'Рубиновый посох', price: 17880, ppb: 255.43 },
    { id: 'energy_scroll', name: 'Свиток энергии', price: 9520, ppb: 136.00 },
    { id: 'composite_bow', name: 'Составной лук', price: 8680, ppb: 157.82 },
    { id: 'steel_blade', name: 'Стальной клинок', price: 475, ppb: 15.83 },

    // shield
    { id: 'large_shield', name: 'Башенный щит', price: 9778, ppb: 139.69 },
    { id: 'round_shiled', name: 'Круглый щит', price: 110, ppb: 15.71 },
    { id: 'shield13', name: 'Обсидиановый щит', price: 10389, ppb: 148.41 },
    { id: 's_shield', name: 'Стальной щит', price: 272, ppb: 18.13 },
    { id: 'dragon_shield', name: 'Щит драконов', price: 8963, ppb: 128.04 },
    { id: 'shield16', name: 'Щит пламени', price: 10515, ppb: 150.21 },
    { id: 'sshield17', name: 'Щит подавления', price: 4230, ppb: 120.86 },
    { id: 'shield19', name: 'Щит рассвета', price: 10689, ppb: 152.70 },
    { id: 'sshield5', name: 'Щит славы', price: 2949, ppb: 73.72 },
    { id: 'sshield11', name: 'Щит сокола', price: 3958, ppb: 98.95 },
    { id: 'defender_shield', name: 'Щит хранителя', price: 1154, ppb: 28.85 },
    { id: 'sshield14', name: 'Щит чешуи дракона', price: 4006, ppb: 105.42 },

    // boots
    { id: 'boots2', name: 'Боевые сапоги', price: 1048, ppb: 29.94 },
    { id: 'leatherboots', name: 'Кожаные ботинки', price: 204, ppb: 14.57 },
    { id: 'hunter_boots', name: 'Кожаные сапоги', price: 960, ppb: 32.00 },
    { id: 'mif_lboots', name: 'Лёгкие мифриловые сапоги', price: 7304, ppb: 132.80 },
    { id: 'boots13', name: 'Обсидиановые сапоги', price: 8682, ppb: 124.03 },
    { id: 'sboots12', name: 'Рубиновые сапоги', price: 3056, ppb: 87.31 },
    { id: 'sboots16', name: 'Сапоги благородства', price: 3308, ppb: 110.27 },
    { id: 'boots15', name: 'Сапоги пламени', price: 8740, ppb: 124.86 },
    { id: 'boots17', name: 'Сапоги рассвета', price: 8866, ppb: 126.66 },
    { id: 'mboots17', name: 'Сапоги сумерек', price: 9140, ppb: 130.57 },
    { id: 'mboots14', name: 'Сапоги чернокнижника', price: 9290, ppb: 132.71 },
    { id: 'sboots9', name: 'Солдатские сапоги ', price: 2183, ppb: 72.77 },
    { id: 'steel_boots', name: 'Стальные сапоги', price: 5907, ppb: 84.39 },
    { id: 'shoe_of_initiative', name: 'Туфли стремления', price: 2510, ppb: 62.75 },
    { id: 'wiz_boots', name: 'Туфли чародея', price: 8430, ppb: 129.69 },
    { id: 'mif_hboots', name: 'Тяжёлые мифриловые сапоги', price: 7915, ppb: 121.77 },

    // rings
    { id: 'warring13', name: 'Глаз дракона', price: 10495, ppb: 174.92 },
    { id: 'ring19', name: 'Кольцо бесстрашия', price: 11900, ppb: 183.08 },
    { id: 'wwwring16', name: 'Кольцо боли', price: 11475, ppb: 176.54 },
    { id: 'dring5', name: 'Кольцо веры', price: 3570, ppb: 89.25 },
    { id: 'warriorring', name: 'Кольцо воина', price: 6839, ppb: 170.97 },
    { id: 'mmmring16', name: 'Кольцо звёзд', price: 11830, ppb: 182.00 },
    { id: 'i_ring', name: 'Кольцо ловкости', price: 180, ppb: 18.00 },
    { id: 'smring10', name: 'Кольцо молнии', price: 3010, ppb: 100.33 },
    { id: 'dring18', name: 'Кольцо надежды', price: 15132, ppb: 216.17 },
    { id: 'mring19', name: 'Кольцо непрестанности', price: 11990, ppb: 184.46 },
    { id: 'circ_ring', name: 'Кольцо отречения', price: 6850, ppb: 137.00 },
    { id: 'dring15', name: 'Кольцо пламенного взора', price: 14841, ppb: 212.01 },
    { id: 'powerring', name: 'Кольцо пророка', price: 5460, ppb: 136.50 },
    { id: 'bring14', name: 'Кольцо противоречий', price: 10920, ppb: 182.00 },
    { id: 'sring4', name: 'Кольцо силы', price: 592, ppb: 39.47 },
    { id: 'doubt_ring', name: 'Кольцо сомнений', price: 1086, ppb: 90.50 },
    { id: 'dring21', name: 'Кольцо сопряжения', price: 15423, ppb: 220.33 },
    { id: 'rashness_ring', name: 'Кольцо стремительности', price: 2030, ppb: 67.67 },
    { id: 'darkring', name: 'Кольцо теней', price: 8820, ppb: 176.40 },
    { id: 'sring17', name: 'Кольцо хватки дракона', price: 2968, ppb: 98.93 },
    { id: 'dring12', name: 'Мифриловая печать', price: 13638, ppb: 209.82 },
    { id: 'verve_ring', name: 'Перстень вдохновения', price: 1610, ppb: 89.44 },
    { id: 'dring9', name: 'Перстень хранителя', price: 10243, ppb: 204.86 },
    { id: 'smring17', name: 'Печать единения', price: 3060, ppb: 102.00 },
    { id: 'magring13', name: 'Печать заклинателя', price: 10820, ppb: 180.33 },
    { id: 'sring10', name: 'Терновое кольцо', price: 2920, ppb: 97.33 }
  ];
}

function set_a_price(art){
  for(var i = 0; i < a_prices.length; ++i)
    if(a_prices[i].id == art.id){
      var a = a_prices[i];

      if(a.price)
        art.price = a.price;

      if(a.ppb)
        art.ppb = a.ppb;

      break;
    }
}

function set_a_state(art, obj){
  if(obj.attack)
    art.states.attack = obj.attack;
  if(obj.defence)
    art.states.defence = obj.defence;
  if(obj.spellpower)
    art.states.spellpower = obj.spellpower;
  if(obj.knowledge)
    art.states.knowledge = obj.knowledge;
  if(obj.initiative)
    art.states.initiative = obj.initiative;
  if(obj.morale)
    art.states.morale = obj.morale;
  if(obj.luck)
    art.states.luck = obj.luck;
}

function set_a_ex_state(art, obj){
  if(obj.magic_protection)
    art.ex_states.magic_protection = obj.magic_protection;
  if(obj.close_combat_protection)
    art.ex_states.close_combat_protection = obj.close_combat_protection;
  if(obj.hero_initiative)
    art.ex_states.hero_initiative = obj.hero_initiative;
  if(obj.range_combat_protection)
    art.ex_states.range_combat_protection = obj.range_combat_protection;
  if(obj.increase_range_combat_damage)
    art.ex_states.increase_range_combat_damage = obj.increase_range_combat_damage;
  if(obj.increase_close_combat_damage)
    art.ex_states.increase_close_combat_damage = obj.increase_close_combat_damage;
}

//----------------------------------------------------------------------------//
// Battle types
//----------------------------------------------------------------------------//

var enum_sbt = {
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

var sorted_battle_types = [
  new SortedBattleType(enum_sbt.pvp,       '#87CEFF', 'ПВП-бои'),
  new SortedBattleType(enum_sbt.hunter,    '#98FB98', 'Охоты'),
  new SortedBattleType(enum_sbt.mercenary, '#98FB98', 'Задания наемников'),
  new SortedBattleType(enum_sbt.thief,     '#98FB98', 'Задания воров'),
  new SortedBattleType(enum_sbt.ranger,    '#98FB98', 'Задания рейнджеров'),
  new SortedBattleType(enum_sbt.war,       '#c1cdc1', 'Войны'),
  new SortedBattleType(enum_sbt.event,     '#c1cdc1', 'Ивенты'),
  new SortedBattleType(enum_sbt.instance,  '#c1cdc1', 'Постоянные ивенты'),
  new SortedBattleType(enum_sbt.other,     '#ffffff', 'Прочие'),
  new SortedBattleType(enum_sbt.guardian,  '#98FB98', 'Задания стражей'),
  new SortedBattleType(enum_sbt.campaign,  '#c1cdc1', 'Кампании'),
  new SortedBattleType(enum_sbt.leader,    '#c1cdc1', 'Гильдия лидеров'),
  new SortedBattleType(enum_sbt.unknown,   '#ff0000', 'Неизвестные типы')
];

//----------------------------------------------------------------------------//

function SortedBattleType(id_, color_, name_){
  this.id    = id_;
  this.color = color_;
  this.name  = name_;
}

save_value('GN_CommonValues_SortedBattleTypes', JSON.stringify(sorted_battle_types));

//----------------------------------------------------------------------------//

var battle_types = [
  new BattleType(-17, enum_sbt.pvp,       'Бои за налоги (соло деф)'),
  new BattleType(-16, enum_sbt.pvp,       'Бои за налоги (атака против одного)'),
  new BattleType(-15, enum_sbt.pvp,       'Бои за налоги (деф)'),
  new BattleType(-14, enum_sbt.pvp,       'Бои за налоги (атака)'),
  new BattleType(-13, enum_sbt.pvp,       'КБО (деф против одного)'),
  new BattleType(-12, enum_sbt.pvp,       'КБО (атака против одного)'),
  new BattleType(-11, enum_sbt.pvp,       'КБО (соло деф)'),
  new BattleType(-10, enum_sbt.pvp,       'КБО (соло атака)'),
  new BattleType(-9,  enum_sbt.pvp,       'КБО (деф)'),
  new BattleType(-8,  enum_sbt.pvp,       'КБО (атака)'),
  new BattleType(-7,  enum_sbt.pvp,       'ГТ (смт)'),
  new BattleType(-6,  enum_sbt.pvp,       'ГТ (парное)'),
  new BattleType(-5,  enum_sbt.pvp,       'ГТ (дуэль)'),
  new BattleType(-4,  enum_sbt.instance,  'ГТ (2 бота)'),
  new BattleType(-3,  enum_sbt.instance,  'ГТ (3 бота)'),
  new BattleType(-2,  enum_sbt.ranger,    'Рейнджеры (бой с игроком)'),
  new BattleType(-1,  enum_sbt.other,     'Все старые бои'),
  new BattleType(0,   enum_sbt.hunter,    'ГО'),
  new BattleType(1,   enum_sbt.pvp,       'КСЗС-4'),
  // 2 missed
  new BattleType(3,   enum_sbt.pvp,       'Бои в темную'),
  new BattleType(4,   enum_sbt.thief,     'ГВ (бой с игроком), поле 12х12'),
  new BattleType(5,   enum_sbt.mercenary, 'Захватчики'),
  new BattleType(6,   enum_sbt.mercenary, 'Разбойники, поле 12х12'),
  new BattleType(7,   enum_sbt.mercenary, 'Монстры'),
  new BattleType(8,   enum_sbt.mercenary, 'Набеги'),
  // 9 missed
  new BattleType(10,  enum_sbt.mercenary, 'Отряды'),
  // 11 missed
  new BattleType(12,  enum_sbt.mercenary, 'Армии'),
  new BattleType(13,  enum_sbt.thief,     'ГВ, поле 12х12'),
  new BattleType(14,  enum_sbt.pvp,       'МТ'),
  new BattleType(15,  enum_sbt.instance,  'Драконы-охранники'),
  new BattleType(16,  enum_sbt.event,     'Наёмники-защитники'),
  new BattleType(17,  enum_sbt.pvp,       'ТТ-4'),
  new BattleType(18,  enum_sbt.pvp,       'Тронная битва'),
  new BattleType(19,  enum_sbt.hunter,    'Спаренная охота'),
  new BattleType(20,  enum_sbt.instance,  'Воины арены'),
  new BattleType(21,  enum_sbt.other,     'Автобои'),
  new BattleType(22,  enum_sbt.event,     'Элементали стихий'),
  new BattleType(23,  enum_sbt.war,       'Гномы-захватчики'),
  new BattleType(24,  enum_sbt.pvp,       'КСЗС-6'),
  new BattleType(25,  enum_sbt.pvp,       'ТТ-6'),
  new BattleType(26,  enum_sbt.thief,     'ГВ (бой с игроком), поле 18х18'),
  new BattleType(27,  enum_sbt.thief,     'ГВ, поле 18х18'),
  new BattleType(28,  enum_sbt.mercenary, 'Заговорщики'),
  new BattleType(29,  enum_sbt.mercenary, 'Разбойники, поле 18х18'),
  new BattleType(30,  enum_sbt.event,     'Обитатели тоннеля'),
  // 31 missed
  new BattleType(32,  enum_sbt.event,     'Морские чудовища'),
  new BattleType(33,  enum_sbt.event,     'Ночные кошмары (с героем)'),
  // 34 missed
  new BattleType(35,  enum_sbt.instance,  'Защитники стены'),
  new BattleType(36,  enum_sbt.war,       'Бои с королевством (гномы)'),
  new BattleType(37,  enum_sbt.pvp,       'СМТ'),
  new BattleType(38,  enum_sbt.war,       'Караван королевства'),
  new BattleType(39,  enum_sbt.other,     'Вступление в ГТ'),
  new BattleType(40,  enum_sbt.pvp,       'ГТ'), // splitted to many variants (see above)
  new BattleType(41,  enum_sbt.event,     'Нежить (защита)'),
  new BattleType(42,  enum_sbt.event,     'Нежить (атака)'),
  new BattleType(43,  enum_sbt.event,     'Защитники склепа'),
  new BattleType(44,  enum_sbt.event,     'Ночные кошмары (с монстром)'),
  new BattleType(45,  enum_sbt.event,     'Бойцы арены'),
  new BattleType(46,  enum_sbt.event,     'Демоны порталов (защита)'),
  new BattleType(47,  enum_sbt.event,     'Демоны порталов (атака)'),
  new BattleType(48,  enum_sbt.event,     'Демоны врат'),
  new BattleType(49,  enum_sbt.event,     'Демоны ада'),
  new BattleType(50,  enum_sbt.instance,  'Участник состязания'),
  new BattleType(51,  enum_sbt.event,     'Похитители валентинок'),
  new BattleType(52,  enum_sbt.other,     'БТ четырехлетия'),
  new BattleType(53,  enum_sbt.event,     'Бунтовщики-разрушители'),
  new BattleType(54,  enum_sbt.event,     'Бунтовщики-стражи'),
  new BattleType(55,  enum_sbt.event,     'Бунтовщики-стражи, бунтовщик-зачинщик'),
  new BattleType(56,  enum_sbt.event,     'Хранитель леса'),
  new BattleType(57,  enum_sbt.event,     'Степные гоблины'),
  new BattleType(58,  enum_sbt.event,     'Степные разбойники'),
  new BattleType(59,  enum_sbt.pvp,       'ТТТ'),
  new BattleType(60,  enum_sbt.pvp,       'ПТ'),
  new BattleType(61,  enum_sbt.ranger,    'Рейнджеры'),
  new BattleType(62,  enum_sbt.event,     'Стражи'),
  new BattleType(63,  enum_sbt.other,     'Рейнджер-наставник'),
  new BattleType(64,  enum_sbt.event,     'Отряд Солнца'),
  new BattleType(65,  enum_sbt.event,     'Рыцари Солнца'),
  new BattleType(66,  enum_sbt.thief,     'ГВ, бот в фулле'),
  new BattleType(67,  enum_sbt.event,     'Непокорные племена'),
  new BattleType(68,  enum_sbt.other,     'БТ'),
  new BattleType(69,  enum_sbt.event,     'Степные варвары'),
  // 70 missed
  new BattleType(71,  enum_sbt.event,     'Захватчик арены'),
  new BattleType(72,  enum_sbt.war,       'Война с прошлым'),
  // 73 missed
  new BattleType(74,  enum_sbt.event,     'Защитники прошлого'),
  // 75-76 missed
  new BattleType(77,  enum_sbt.event,     'Ёлкорубы'),
  // 78 missed
  new BattleType(79,  enum_sbt.event,     'Защитники склепа-2013'),
  new BattleType(80,  enum_sbt.instance,  'Сурвилурги (защита)'),
  new BattleType(81,  enum_sbt.instance,  'Сурвилурги (атака)'),
  // 82 missed
  new BattleType(83,  enum_sbt.event,     'Варвары-дикари'),
  new BattleType(84,  enum_sbt.event,     'Варвары-главари'),
  new BattleType(85,  enum_sbt.event,     'Похитители ёлочки'),
  // 86-87 missed
  new BattleType(88,  enum_sbt.instance,  'Сурвилурги (перехват)'),
  new BattleType(89,  enum_sbt.pvp,       'КБО ПВП'), // splitted to many variants (see above)
  new BattleType(90,  enum_sbt.pvp,       'ПТЭ'),
  new BattleType(91,  enum_sbt.other,     'Дуэли с ботом, 1-2 уровни'),
  new BattleType(92,  enum_sbt.event,     'Обитатели небес'),
  new BattleType(93,  enum_sbt.event,     'Хранители леса'),
  new BattleType(94,  enum_sbt.event,     'Защитники прошлого (новый ИИ)'),
  new BattleType(95,  enum_sbt.guardian,  'Задания стражей'),
  new BattleType(96,  enum_sbt.event,     'Пираты'),
  new BattleType(97,  enum_sbt.event,     'Воины Алека'),
  new BattleType(98,  enum_sbt.event,     'Гости из прошлого'),
  new BattleType(99,  enum_sbt.event,     'Охранники сокровищ'),
  // 100 missed
  new BattleType(101, enum_sbt.event,     'Сезон охоты'),
  new BattleType(102, enum_sbt.event,     'Сбежавшие заключенные'),
  new BattleType(103, enum_sbt.event,     'Караван сурвилургов'),
  new BattleType(104, enum_sbt.pvp,       'Бои за налоги'), // splitted to many variants (see above)
  new BattleType(105, enum_sbt.event,     'Лагерь сурвилургов, стража'),
  new BattleType(106, enum_sbt.event,     'Лагерь сурвилургов, босс'),
  new BattleType(107, enum_sbt.event,     'Вызов Рейзара'),
  new BattleType(108, enum_sbt.event,     'Вражеский замок'),
  new BattleType(109, enum_sbt.event,     'Сопровождение караванов'),
  new BattleType(110, enum_sbt.campaign,  'Боевые кампании'),
  new BattleType(111, enum_sbt.event,     'Армия холода'),
  new BattleType(112, enum_sbt.event,     'Обитатели пещер'),
  new BattleType(113, enum_sbt.pvp,       'Великое состязание'),
  new BattleType(114, enum_sbt.event,     'Подземные эльфы'),
  new BattleType(115, enum_sbt.event,     'Пираты в паре'),
  new BattleType(116, enum_sbt.pvp,       'Состязание Тьмы и Света'),
  new BattleType(117, enum_sbt.event,     'Охота на покемонов'),
  new BattleType(118, enum_sbt.pvp,       'Перекрестное состязание'),
  new BattleType(119, enum_sbt.event,     'Защита деревень'),
  new BattleType(120, enum_sbt.event,     'Подземные пещеры'),
  new BattleType(121, enum_sbt.event,     'Лагерь сурвилургов, генерал'),
  new BattleType(122, enum_sbt.event,     'Великий эксперимент'),
  new BattleType(123, enum_sbt.event,     'Торговый корабль'),
  new BattleType(124, enum_sbt.event,     'Контрабандисты'),
  // 125 missed
  new BattleType(126, enum_sbt.event,     'Ивенты дня'),
  new BattleType(127, enum_sbt.leader,    'Гильдия лидеров'),
  new BattleType(128, enum_sbt.leader,    'Культ солнца'),
  new BattleType(129, enum_sbt.event,     'Контрабандисты (новые)'),
  new BattleType(130, enum_sbt.leader,    'Охота на Гринча 2018'),
  new BattleType(131, enum_sbt.event,     'Армия Культа Солнца'),
  new BattleType(132, enum_sbt.leader,    'Гномы Клана Огня'),
  new BattleType(133, enum_sbt.event,     'Имперские защитники'),
  new BattleType(134, enum_sbt.pvp,       'Парный турнир++'),
  new BattleType(135, enum_sbt.leader,    'Опасные бандиты (раз в сутки)'),
  // 136 missed
  new BattleType(137, enum_sbt.leader,    'Турнир Лидеров'),
  new BattleType(138, enum_sbt.event,     'Клан Огня'),
  new BattleType(139, enum_sbt.leader,    'Опасные бандиты | Отряды Гринча'), // wtf - гринч-2020 с тем же ID
  new BattleType(140, enum_sbt.event,     'Сезон охоты (новый)'),
  new BattleType(141, enum_sbt.instance,  'Воины арены (новый)'),
  new BattleType(142, enum_sbt.event,     'Ивенты на фракции прошлого'),
  new BattleType(143, enum_sbt.event,     'Контрабандисты (с крафтом)'),
  new BattleType(144, enum_sbt.event,     'Ивенты единства'),
  new BattleType(145, enum_sbt.pvp,       'КСЗС ГТ'),
  new BattleType(146, enum_sbt.event,     'Распутье тайн'),
  new BattleType(147, enum_sbt.event,     'Бремя тьмы'),
  new BattleType(148, enum_sbt.event,     'Новый портал времени'),
  // 149 missed
  new BattleType(150, enum_sbt.event,     'Контрабандисты (новое поле)'),
  new BattleType(151, enum_sbt.event,     'Цель контракта'),
  new BattleType(152, enum_sbt.event,     'Миниивент (15 попыток)'),
  // 153, 154 missed
  new BattleType(155, enum_sbt.event,     'Ивенты легенд'),
];

//----------------------------------------------------------------------------//

function BattleType(id_, sbt_, name_){
  this.id   = id_;
  this.sbt  = sbt_;
  this.name = name_;
}

save_value('GN_CommonValues_BattleTypes', JSON.stringify(battle_types));

//----------------------------------------------------------------------------//
// Card types
//----------------------------------------------------------------------------//

var enum_sct = {
  tavern:   0,
  tour_pvp: 1,
  tour_pve: 2
};

var sorted_card_types = [
  new SortedCardType(enum_sct.tavern,   '#00bfff', 'Игры в таверне'),
  new SortedCardType(enum_sct.tour_pvp, '#c1cdc1', 'Игры в турнире против игрока'),
  new SortedCardType(enum_sct.tour_pve, '#228b22', 'Игры в турнире против бота')
];

//----------------------------------------------------------------------------//

function SortedCardType(id_, color_, desc_){
  this.id    = id_;
  this.color = color_;
  this.desc  = desc_;
}

save_value('GN_CommonValues_SortedCardTypes', JSON.stringify(sorted_card_types));

//----------------------------------------------------------------------------//

var card_types = [
  new CardType('bet0',      enum_sct.tavern, 'Без ставки', '0'),
  new CardType('bet40',     enum_sct.tavern, 'На 40', '40'),
  new CardType('bet100',    enum_sct.tavern, 'На 200', '100'),
  new CardType('bet200',    enum_sct.tavern, 'На 200', '200'),
  new CardType('bet300',    enum_sct.tavern, 'На 300', '300'),
  new CardType('bet400',    enum_sct.tavern, 'На 400', '400'),
  new CardType('bet600',    enum_sct.tavern, 'На 600', '600'),
  new CardType('bet1000',   enum_sct.tavern, 'На 1k', '1000'),
  new CardType('bet2000',   enum_sct.tavern, 'На 2k', '2000'),
  new CardType('bet3000',   enum_sct.tavern, 'На 3k', '3000'),
  new CardType('bet4000',   enum_sct.tavern, 'На 4k', '4000'),
  new CardType('bet5000',   enum_sct.tavern, 'На 5k', '5000'),
  new CardType('bet6000',   enum_sct.tavern, 'На 6k', '6000'),
  new CardType('bet7000',   enum_sct.tavern, 'На 7k', '7000'),
  new CardType('bet10000',  enum_sct.tavern, 'На 10k', '10000'),
  new CardType('bet11000',  enum_sct.tavern, 'На 11k', '11000'),
  new CardType('bet12000',  enum_sct.tavern, 'На 12k', '12000'),
  new CardType('bet20000',  enum_sct.tavern, 'На 20k', '20000'),
  new CardType('bet25000',  enum_sct.tavern, 'На 25k', '25000'),
  new CardType('bet30000',  enum_sct.tavern, 'На 30k', '30000'),
  new CardType('bet35000',  enum_sct.tavern, 'На 35k', '35000'),
  new CardType('bet40000',  enum_sct.tavern, 'На 40k', '40000'),
  new CardType('bet50000',  enum_sct.tavern, 'На 50k', '50000'),
  new CardType('stage128',  enum_sct.tour_pvp, '1/128 финала', '1/128'),
  new CardType('stage64',   enum_sct.tour_pvp, '1/64 финала', '1/64'),
  new CardType('stage32',   enum_sct.tour_pvp, '1/32 финала', '1/32'),
  new CardType('stage16',   enum_sct.tour_pvp, '1/16 финала', '1/16'),
  new CardType('stage8',    enum_sct.tour_pvp, '1/8 финала', '1/8'),
  new CardType('stage4',    enum_sct.tour_pvp, 'Четвертьфинал', '1/4'),
  new CardType('stage2',    enum_sct.tour_pvp, 'Полуфинал', 'Полуфинал'),
  new CardType('stage1',    enum_sct.tour_pvp, 'Финал', 'Финал'),
  new CardType('bstage128', enum_sct.tour_pve, '1/128 финала', '1/128'),
  new CardType('bstage64',  enum_sct.tour_pve, '1/64 финала', '1/64'),
  new CardType('bstage32',  enum_sct.tour_pve, '1/32 финала', '1/32'),
  new CardType('bstage16',  enum_sct.tour_pve, '1/16 финала', '1/16'),
  new CardType('bstage8',   enum_sct.tour_pve, '1/8 финала', '1/8'),
  new CardType('bstage4',   enum_sct.tour_pve, 'Четвертьфинал', '1/4'),
  new CardType('bstage2',   enum_sct.tour_pve, 'Полуфинал', 'Полуфинал'),
  new CardType('bstage1',   enum_sct.tour_pve, 'Финал', 'Финал')
];

//----------------------------------------------------------------------------//

function CardType(id_, type_, desc_, sign_){
  this.id   = id_;
  this.type = type_;
  this.desc = desc_;
  this.sign = sign_;
}

save_value('GN_CommonValues_CardTypes', JSON.stringify(card_types));

//----------------------------------------------------------------------------//
// Elements
//----------------------------------------------------------------------------//

var elements = [
  new Element('abrasive',     'абразив',            3376),
  new Element('snake_poison', 'змеиный яд',         298),
  new Element('tiger_tusk',   'клык тигра',         2208),
  new Element('ice_crystal',  'ледяной кристалл',   3340),
  new Element('moon_stone',   'лунный камень',      3029),
  new Element('fire_crystal', 'огненный кристалл',  2990),
  new Element('meteorit',     'осколок метеорита',  7052),
  new Element('witch_flower', 'цветок ведьм',       496),
  new Element('wind_flower',  'цветок ветров',      9079),
  new Element('fern_flower',  'цветок папоротника', 2073),
  new Element('badgrib',      'ядовитый гриб',      248)
];

//----------------------------------------------------------------------------//

function Element(id_, name_, average_price_){
  this.id            = id_;
  this.name          = name_;
  this.average_price = +average_price_;
}

//----------------------------------------------------------------------------//

function get_element(id){
  for(var i = 0; i < elements.length; ++i)
    if(elements[i].id == id)
      return elements[i];

  return null;
}

//----------------------------------------------------------------------------//

var element_prices = JSON.parse(load_value('GN_CommonValues_ElementPrices', '[]'));

element_prices.forEach(function(current){
  var el = get_element(current.id);
  if(el)
    el.average_price = +current.price;
});

save_value('GN_CommonValues_Elements', JSON.stringify(elements));

//----------------------------------------------------------------------------//
// Basic resources
//----------------------------------------------------------------------------//

var basic_resources = [
  new BasicResource('gold',    'Золото',    0, 1,   1),
  new BasicResource('wood',    'Древесина', 1, 180, 185),
  new BasicResource('ore',     'Руда',      2, 180, 184),
  new BasicResource('mercury', 'Ртуть',     3, 360, 365),
  new BasicResource('sulfur',  'Сера',      4, 360, 365),
  new BasicResource('sulphur', 'Сера',      4, 360, 365), //NB
  new BasicResource('crystal', 'Кристаллы', 5, 360, 365),
  new BasicResource('gem',     'Самоцветы', 6, 360, 365)
];

//----------------------------------------------------------------------------//

function BasicResource(id_, name_, market_type_, min_price_, max_price_){
  this.id            = id_;
  this.name          = name_;
  this.market_type   = +market_type_;
  this.min_price     = +min_price_;
  this.max_price     = +max_price_;
}

save_value('GN_CommonValues_BasicResources', JSON.stringify(basic_resources));

//----------------------------------------------------------------------------//
// Advanced resources
//----------------------------------------------------------------------------//

var advanced_resources = [
  new AdvancedResource('Кожа',              180,   181),
  new AdvancedResource('Мифриловая руда',   460,   460),
  new AdvancedResource('Обсидиан',          2000,  2000),
  new AdvancedResource('Волшебный порошок', 2074,  2074),
  new AdvancedResource('Мифрил',            3325,  3325),
  new AdvancedResource('Никель',            1698,  1698),
  new AdvancedResource('Орихалк',           11000, 11000),
  new AdvancedResource('Сталь',             759,   759)
];

//----------------------------------------------------------------------------//

function AdvancedResource(name_, min_price_, max_price_){
  this.name      = name_;
  this.min_price = +min_price_;
  this.max_price = +max_price_;
}

save_value('GN_CommonValues_AdvancedResources', JSON.stringify(advanced_resources));

//----------------------------------------------------------------------------//
// Fractions
//----------------------------------------------------------------------------//

var fractions = [
  new Fraction(0, 0, 'Нейтралы', 'neutral_dummy'),
  new Fraction(1, 0, 'Рыцарь', '~pers_ani'),
  new Fraction(1, 1, 'Рыцарь света', '~pers_aani'),
  new Fraction(2, 0, 'Некромант', '~pers_necrani'),
  new Fraction(2, 1, 'Некромант - повелитель смерти', '~pers_anecrani'),
  new Fraction(3, 0, 'Маг', '~pers_mageani'),
  new Fraction(3, 1, 'Маг-разрушитель', '~pers_amageani'),
  new Fraction(4, 0, 'Эльф', '~pers_elfani'),
  new Fraction(4, 1, 'Эльф-заклинатель', '~pers_aelfani'),
  new Fraction(5, 0, 'Варвар', '~pers_barbani'),
  new Fraction(5, 1, 'Варвар крови', '~pers_abarbani'),
  new Fraction(5, 2, 'Варвар-шаман', '~pers_bbarbani'),
  new Fraction(6, 0, 'Темный эльф', '~pers_darkelfani'),
  new Fraction(6, 1, 'Темный эльф-укротитель', '~pers_adarkelfani'),
  new Fraction(7, 0, 'Демон', '~pers_demonani'),
  new Fraction(7, 1, 'Демон тьмы', '~pers_ademonani'),
  new Fraction(8, 0, 'Гном', '~pers_gnomani'),
  new Fraction(8, 1, 'Гном Огня', '~pers_agnomani'),
  new Fraction(9, 0, 'Степной варвар', '~pers_svani'),
  new Fraction(9, 1, 'Степной варвар ярости', '~pers_asvani'),
  new Fraction(10, 0, 'Фараон', '~pers_egani')
];

//----------------------------------------------------------------------------//

function Fraction(id_, c_, name_, flash_){
  this.id    = +id_;
  this.c     = +c_;
  this.name  = name_;
  this.flash = flash_;
}

save_value('GN_CommonValues_Fractions', JSON.stringify(fractions));

//----------------------------------------------------------------------------//
// Creatures
//----------------------------------------------------------------------------//

var creatures = [
  new Creature('bpirate', 'bpirateani', 'Абордажники', 'Pirate Fighters', 611, 0, [0], false),
  new Creature('zealot', 'zealotani', 'Адепты', 'Exorcists', 494, 1, [1], true),
  new Creature('hellhound6', 'hellhound6ani', 'Адские гончие', 'Hellhounds', 444, 0, [0], false),
  new Creature('hellcharger', 'nightmareani', 'Адские жеребцы', 'Hell horses', 76, 7, [0, 1], false),
  new Creature('zhryak', 'zhryakani', 'Адские жнецы', 'Hell reapers', 284, 0, [0], false),
  new Creature('hellhound', 'demondogani', 'Адские псы', 'Wolfhounds', 74, 7, [0, 1], false),
  new Creature('succubus6', 'succubus6ani', 'Адские суккубы', 'Demonesses', 446, 0, [0], false),
  new Creature('troglodyteup', 'troglodyteupani', 'Адские троглодиты', 'Infernal Troglodytes', 751, 0, [0], false),
  new Creature('cerber', 'cerberani', 'Адские церберы', 'Hell cerberi', 445, 0, [0], false),
  new Creature('iceelb', 'iceelbani', 'Айсберговые элементали', 'Iceberg elementals', 702, 0, [0], false),
  new Creature('wanizame', 'wanizameani', 'Акульи бойцы', 'Ichthys fighters', 414, 0, [0], false),
  new Creature('sharkguard', 'sharkguardani', 'Акульи стражи', 'Ichthys guard', 413, 0, [0], false),
  new Creature('diamondgolem', 'diamondgolemani', 'Алмазные големы', 'Diamond golems', 660, 0, [0], false),
  new Creature('yetiup', 'yetiupani', 'Алмасты', 'Almases', 939, 0, [0], false),
  new Creature('angel', 'angelani', 'Ангелы', 'Angels', 132, 1, [0, 1], false),
  new Creature('marksman', 'marksmanani', 'Арбалетчики', 'Crossbowmen', 42, 1, [0], true),
  new Creature('cman', 'cmanani', 'Арбалетчики света', 'Marksmen', 355, 0, [0], false),
  new Creature('marks', 'marksani', 'Арбалетчики солнца', 'Templar marksmen', 356, 0, [0], false),
  new Creature('archangel', 'archangelani', 'Архангелы', 'Archangels', 249, 1, [0], true),
  new Creature('archdemon', 'archdemonani', 'Архидемоны', 'Antichrists', 293, 7, [1], true),
  new Creature('archdevil', 'archdevilani', 'Архидьяволы', 'Archdevils', 292, 7, [0], true),
  new Creature('archlich', 'archlichani', 'Архиличи', 'Archliches', 146, 2, [0], true),
  new Creature('archmage', 'archmageani', 'Архимаги', 'Lorekeepers', 104, 3, [0], true),
  new Creature('assassin', 'assasinani', 'Ассасины', 'Poisoners', 56, 6, [0], true),
  new Creature('assida', 'oceanani', 'Ассиды', 'Ayssids', 847, 0, [0], false),
  new Creature('ghostdragon', 'ghostdragonani', 'Астральные драконы', 'Mirage dragons', 514, 2, [1], true),
  new Creature('banshee', 'bansheeani', 'Баньши', 'Death proclaimers', 515, 2, [1], true),
  new Creature('necrotower', 'necrotowerani', 'Башня некромантии', 'Necromancy tower', 739, 0, [0], false),
  new Creature('behemoth', 'behemothani', 'Бегемоты', 'Behemoths', 131, 5, [0, 1, 2], false),
  new Creature('poukai', 'paokaiani', 'Безглазые виверны', 'Eyeless wyverns', 1194, 9, [1], true),
  new Creature('demented', 'dementedani', 'Безумцы', 'Demented', 443, 0, [0], false),
  new Creature('whitetiger', 'whitetigerani', 'Белые тигры', 'White tigers', 631, 0, [0], false),
  new Creature('berserker', 'berserkerani', 'Берсерки', 'Berserkers', 163, 8, [0], true),
  new Creature('maiden', 'maidenani', 'Бестии', 'Rogues', 49, 6, [0, 1], false),
  new Creature('imp', 'impani', 'Бесы', 'Imps', 78, 7, [0, 1], false),
  new Creature('beholder', 'beholderani', 'Бехолдеры', 'Beholders', 207, 0, [0], false),
  new Creature('wisp', 'wispani', 'Блуждающие огни', 'Will-O-Wisps', 721, 0, [0], false),
  new Creature('battlegriffin', 'battlegriffinani', 'Боевые грифоны', 'Frenzied griffins', 36, 0, [0], false),
  new Creature('silverunicorn', 'silverunicornani', 'Боевые единороги', 'Brilliant unicorns', 147, 4, [0], true),
  new Creature('mcentaur', 'mcentaurani', 'Боевые кентавры', 'Tempered centaurs', 309, 9, [1], true),
  new Creature('battlemage', 'battlemageani', 'Боевые маги', 'Battlemagi', 578, 3, [1], true),
  new Creature('slon', 'slonani', 'Боевые слоны', 'Fighting elephants', 931, 10, [0], false),
  new Creature('buffalo', 'buffaloani', 'Буйволы', 'Buffaloes', 324, 0, [0], false),
  new Creature('shootpirate', 'shootpirateani', 'Буканиры', 'Buccaneers', 646, 0, [0], false),
  new Creature('vampire', 'vampireani', 'Вампиры', 'Vampires', 15, 2, [0, 1], false),
  new Creature('vampirelord6', 'vampirelord6ani', 'Вампиры прошлого', 'Vampires of past', 831, 0, [0], false),
  new Creature('warmong', 'warmongani', 'Вармонгеры', 'Protectors', 330, 9, [1], true),
  new Creature('priestessup', 'priestessupani', 'Ведьмы моря', 'Sea witches', 649, 0, [0], false),
  new Creature('cursed', 'cursed_ani', 'Ведьмы-призраки', 'Cursed witches', 853, 0, [0], false),
  new Creature('giant', 'giantani', 'Великаны', 'Trashers', 792, 0, [0], false),
  new Creature('giantarch', 'giantarchani', 'Великаны-лучники', 'Giant archers', 817, 0, [0], false),
  new Creature('upleviathan', 'upleviathanani', 'Великие левиафаны', 'Great leviathans', 214, 0, [0], false),
  new Creature('wendigo', 'wendigoani', 'Вендиго', 'Wendigos', 798, 0, [0], false),
  new Creature('druideld', 'ddeldani', 'Верховные друиды', 'Anchorites', 120, 4, [0], true),
  new Creature('vestal', 'vestalani', 'Весталки', 'Vestals', 358, 0, [0], false),
  new Creature('wraith', 'wraithani', 'Вестники смерти', 'Death heralds', 235, 2, [0], true),
  new Creature('wyvern', 'wyvernani', 'Виверны', 'Tamed wyverns', 336, 9, [0, 1], false),
  new Creature('djinn_vizier', 'djinn_vizierani', 'Визири джиннов', 'Fortune genies', 579, 3, [1], true),
  new Creature('pitlord6', 'pitlord6ani', 'Владыки бездны', 'Hatred demons', 572, 0, [0], false),
  new Creature('matriarch', 'matriarchani', 'Владычицы тени', 'Dark sibyls', 239, 6, [0], true),
  new Creature('water', 'waterani', 'Водные элементали', 'Water elementals', 156, 0, [0], false),
  new Creature('chieftain', 'chieftainani', 'Вожаки', 'Chieftains', 436, 9, [1], true),
  new Creature('air', 'airani', 'Воздушные элементали', 'Air elementals', 153, 0, [0], false),
  new Creature('anubisup', 'anubisupani', 'Воины Анубиса', 'Anubises warriors', 918, 10, [0], true),
  new Creature('battlerager', 'battleragerani', 'Воины ярости', 'Beastslayers', 960, 8, [1], true),
  new Creature('mercfootman', 'mercfootmanani', 'Воины-наёмники', 'Mercenary warriors', 21, 0, [0], false),
  new Creature('panther6', 'panther6ani', 'Воины-пантеры', 'Fetishists', 404, 0, [0], false),
  new Creature('jaguar6', 'jaguar6ani', 'Воины-ягуары', 'Worshippers', 403, 0, [0], false),
  new Creature('shieldguard', 'shieldguardani', 'Воители', 'Veterans', 158, 8, [0], true),
  new Creature('armorgnom', 'armorgnomani', 'Воители гор', 'Dwarf warriors', 982, 0, [0], false),
  new Creature('faeriedragon', 'faeriedragonani', 'Волшебные драконы', 'Faerie dragons', 630, 0, [0], false),
  new Creature('thiefmage', 'thiefmageani', 'Воры-колдуны', 'Renegade magicians', 125, 0, [0], false),
  new Creature('thiefwarrior', 'thiefwarriorani', 'Воры-разведчики', 'Renegade scouts', 123, 0, [0], false),
  new Creature('thiefarcher', 'thiefarcherani', 'Воры-убийцы', 'Renegade thugs', 124, 0, [0], false),
  new Creature('sunrider', 'sunriderani', 'Всадники солнца', 'Sun chargers', 359, 0, [0], false),
  new Creature('seraph2', 'seraph2ani', 'Высшие ангелы', 'Thrones', 496, 1, [1], true),
  new Creature('vampirelord', 'vampirelordani', 'Высшие вампиры', 'Vampire counts', 118, 2, [0], true),
  new Creature('masterlich', 'masterlichani', 'Высшие личи', 'Demiliches', 341, 2, [0], true),
  new Creature('highwayman', 'highwaymanani', 'Вышибалы', 'Bruisers', 730, 0, [0], false),
  new Creature('harpy', 'harpyani', 'Гарпии', 'Harpies', 200, 0, [0], false),
  new Creature('harpyhag', 'harpyhagani', 'Гарпии-ведьмы', 'Raiding harpies', 201, 0, [0], false),
  new Creature('harpooner', 'harpoonerani', 'Гарпунеры', 'Harpooners', 378, 8, [1], true),
  new Creature('praetorian', 'praetorianani', 'Гвардейцы', 'Praetorians', 353, 0, [0], false),
  new Creature('bigspider', 'bigspiderani', 'Гигантские пауки', 'Giant Spiders', 724, 0, [0], false),
  new Creature('snegovik', 'snegovikani', 'Гигантские снеговики', 'Giant snowmen', 700, 0, [0], false),
  new Creature('lizard', 'lizard_ani', 'Гигантские ящеры', 'Giant lizards', 45, 0, [0], false),
  new Creature('hydra', 'hydraani', 'Гидры', 'Hydras', 50, 6, [0, 1], false),
  new Creature('darkeye', 'darkeyeani', 'Глаза тьмы', 'Shadow eyes', 856, 0, [0], false),
  new Creature('upseamonster', 'upseamonsterani', 'Глубоководные черти', 'Voracious anglerfish', 212, 0, [0], false),
  new Creature('rotzombie', 'rotzombieani', 'Гниющие зомби', 'Ghouls', 270, 2, [1], true),
  new Creature('goblin', 'goblinani', 'Гоблины', 'Goblins', 14, 5, [0, 1, 2], false),
  new Creature('goblinarcher', 'goblinarcherani', 'Гоблины-лучники', 'Goblin archers', 314, 5, [1], true),
  new Creature('goblinmag', 'goblinmagani', 'Гоблины-маги', 'Goblin warlocks', 545, 5, [2], true),
  new Creature('goblinhunter6', 'goblinhunter6ani', 'Гоблины-охотники', 'Goblin hunters', 391, 0, [0], false),
  new Creature('trapper', 'trapperani', 'Гоблины-трапперы', 'Goblin trappers', 386, 9, [0], true),
  new Creature('goblinshaman', 'witchdoctorani', 'Гоблины-шаманы', 'Goblin shamans', 1193, 9, [1], true),
  new Creature('gogachi', 'gogani', 'Гоги', 'Gogs', 285, 0, [0], false),
  new Creature('dgolem', 'dgolemani', 'Големы смерти', 'Death golems', 520, 0, [0], false),
  new Creature('brute', 'bruteani', 'Головорезы', 'Brutes', 254, 1, [1], true),
  new Creature('mountaingr', 'mountaingrani', 'Горные стражи', 'Mountain sentries', 339, 8, [1], true),
  new Creature('gremlin', 'gremlinani', 'Гремлины', 'Gremlins', 9, 3, [0, 1], false),
  new Creature('saboteurgremlin', 'saboteurgremlinani', 'Гремлины-вредители', 'Gremlin wreckers', 253, 3, [1], true),
  new Creature('griffon', 'griffonani', 'Грифоны', 'Griffins', 3, 1, [0, 1], false),
  new Creature('griffin', 'griffinani', 'Грифоны света', 'Tamed griffins', 361, 0, [0], false),
  new Creature('igriffin', 'igriffinani', 'Грифоны солнца', 'Templar griffins', 362, 0, [0], false),
  new Creature('mauler6', 'mauler6ani', 'Громилы', 'Maulers', 388, 0, [0], false),
  new Creature('thunderlord', 'thunderlordani', 'Громовержцы', 'Invokers', 167, 8, [0], true),
  new Creature('axegnom', 'axegnomani', 'Громоглавы', 'Thunderheads', 985, 0, [0], false),
  new Creature('nomadup', 'nomadupani', 'Гунны', 'Hunni', 938, 0, [0], false),
  new Creature('succubusmis', 'succubusmani', 'Демонессы', 'Mistresses', 122, 7, [0], true),
  new Creature('pitfiend6', 'pitfiend6ani', 'Демоны бездны', 'Wrath demons', 571, 0, [0], false),
  new Creature('smalllizard', 'smalllizard_ani', 'Детёныши ящера', 'Lizard cubs', 46, 0, [0], false),
  new Creature('djinn', 'djinnani', 'Джинны', 'Genies', 39, 3, [0, 1], false),
  new Creature('djinn_sultan', 'djinn_sultanani', 'Джинны-султаны', 'Senior genies', 105, 3, [0], true),
  new Creature('savageent', 'savageentani', 'Дикие энты', 'Savage Treant', 589, 4, [1], true),
  new Creature('robber', 'robberani', 'Дозорные', 'Outriders', 726, 0, [0], false),
  new Creature('eadaughter', 'eadaughterani', 'Дочери земли', 'Earth shamans', 333, 9, [1], true),
  new Creature('sdaughter', 'sdaughterani', 'Дочери неба', 'Sky shamans', 332, 9, [0], true),
  new Creature('ancientbehemoth', 'abehemothani', 'Древние бегемоты', 'Ancient Behemoths', 301, 5, [0], true),
  new Creature('ancientpig', 'ancientpigani', 'Древние кабаны', 'Ancient boars', 691, 0, [0], false),
  new Creature('amummy', 'amummyani', 'Древние мумии', 'Ancient mummies', 933, 0, [0], false),
  new Creature('ancienent', 'ancienentani', 'Древние энты', 'Ironroot treefolk', 238, 4, [0], true),
  new Creature('sprite', 'spriteani', 'Дриады', 'Sprites', 31, 4, [0], true),
  new Creature('druid', 'dd_ani', 'Друиды', 'Druids', 26, 4, [0, 1], false),
  new Creature('poltergeist', 'poltergeistani', 'Духи', 'Poltergeists', 512, 2, [1], true),
  new Creature('forestspirit', 'spiritani', 'Духи леса', 'Spirits of forest', 627, 0, [0], false),
  new Creature('mizukami', 'mizukamiani', 'Духи морей', 'Spring custodians', 420, 0, [0], false),
  new Creature('ocean', 'assidaani', 'Духи океана', 'Ocean spirits', 848, 0, [0], false),
  new Creature('springspirit', 'springspiritani', 'Духи ручьёв', 'Spring spirits', 419, 0, [0], false),
  new Creature('devil', 'devilani', 'Дьяволы', 'Devils', 82, 7, [0, 1], false),
  new Creature('vermin', 'verminani', 'Дьяволята', 'Vermins', 281, 7, [1], true),
  new Creature('unicorn', 'unicornani', 'Единороги', 'Unicorns', 38, 4, [0, 1], false),
  new Creature('iron_golem', 'golemani', 'Железные големы', 'Golems', 12, 3, [0, 1], false),
  new Creature('pearlp', 'pearlpani', 'Жемчужные жрицы', 'Pearl priestesses', 416, 0, [0], false),
  new Creature('horse', 'horseani', 'Жеребцы', 'Stallions', 325, 0, [0], false),
  new Creature('runekeeper', 'runekeeperani', 'Жрецы пламени', 'Ascetics', 961, 8, [1], true),
  new Creature('runepriest', 'runepriestani', 'Жрецы рун', 'Priests', 164, 8, [0], false),
  new Creature('priestmoon', 'zhricaupani', 'Жрицы луны', 'Moon Priestesses', 929, 10, [0], false),
  new Creature('priestess', 'priestessani', 'Жрицы моря', 'Sea priestesses', 852, 0, [0], false),
  new Creature('gnomka', 'gnomkaani', 'Жрицы огня', 'Priestesses of fire', 987, 0, [0], false),
  new Creature('priestsun', 'zhricaani', 'Жрицы солнца', 'Sun Priestesses', 930, 10, [0], true),
  new Creature('vindicator', 'vindicatorani', 'Защитники веры', 'Crusaders', 260, 1, [1], true),
  new Creature('defender', 'defenderani', 'Защитники гор', 'Sentries', 157, 8, [0], false),
  new Creature('greendragon', 'greendragonani', 'Зелёные драконы', 'Green dragons', 103, 4, [0, 1], false),
  new Creature('earth', 'earthani', 'Земные элементали', 'Earth elementals', 154, 0, [0], false),
  new Creature('evilsnake', 'evilsnakeani', 'Злая Змея 2013', 'Mad snake 2013', 562, 0, [0], false),
  new Creature('evilhorse', 'evilhorseani', 'Злая Лошадь 2014', 'Mad horse 2014', 642, 0, [0], false),
  new Creature('evileye', 'evileyeani', 'Злобные глаза', 'Evil eyes', 208, 0, [0], false),
  new Creature('gorynych', 'gorynychani', 'Злой Горыныч 2012', 'Evil Dragon 2012', 500, 0, [0], false),
  new Creature('kozel', 'kozelani', 'Злой Козел 2015', 'Evil Goat 2015', 706, 0, [0], false),
  new Creature('snake2013', 'snake', 'Змейка 2013', 'Serpent 2013', 501, 0, [0], false),
  new Creature('golddragon', 'golddragonani', 'Золотые драконы', 'Gold dragons', 609, 0, [0], false),
  new Creature('zombie', 'zombieani', 'Зомби', 'Zombies', 5, 2, [0, 1], false),
  new Creature('lacerator', 'laceratorani', 'Изверги', 'Torturers', 568, 0, [0], false),
  new Creature('emeralddragon', 'emeralddragonani', 'Изумрудные драконы', 'Jade dragons', 100, 4, [0], true),
  new Creature('impergriffin', 'impergriffinani', 'Имперские грифоны', 'Royal griffins', 117, 1, [0], true),
  new Creature('inquisitor', 'inquisitorani', 'Инквизиторы', 'Clerics', 145, 1, [0], true),
  new Creature('seducer', 'seducerani', 'Искусительницы', 'Temptresses', 485, 7, [1], true),
  new Creature('efreeti', 'efreetiani', 'Ифриты', 'Efreeti', 280, 0, [0], false),
  new Creature('efreetisultan', 'efreetisultanani', 'Ифриты султаны', 'Efreeti sultans', 282, 0, [0], false),
  new Creature('yeti', 'yetiani', 'Йети', 'Yeties', 704, 0, [0], false),
  new Creature('boar', 'boarani', 'Кабаны', 'Boars', 690, 0, [0], false),
  new Creature('stone_gargoyle', 'gargolyani', 'Каменные горгульи', 'Gargoyles', 8, 3, [0, 1], false),
  new Creature('kamnegryz', 'kamnegryzani', 'Камнегрызы', 'Stonegnawers', 203, 0, [0], false),
  new Creature('kamneed', 'kamneedani', 'Камнееды', 'Stoneeaters', 202, 0, [0], false),
  new Creature('kappa', 'kappaani', 'Каппы', 'Kappas', 417, 0, [0], false),
  new Creature('fcentaur', 'fcentaurani', 'Кентавры', 'Centaurs', 310, 9, [0, 1], false),
  new Creature('mcentaur6', 'mcentaur6ani', 'Кентавры-мародёры', 'Marauding centaurs', 402, 0, [0], false),
  new Creature('kirin', 'kirinani', 'Кирины', 'Aquatic serpents', 440, 0, [0], false),
  new Creature('vampireprince', 'vampireprinceani', 'Князья вампиров', 'Dreadlords', 513, 2, [1], true),
  new Creature('outlaw', 'outlawani', 'Колдуны-ренегаты', 'Turncoat Mages', 727, 0, [0], false),
  new Creature('colossus', 'colossusani', 'Колоссы', 'Giants', 106, 3, [0, 1], false),
  new Creature('hellkon', 'hellstallionani', 'Кони преисподней', 'Searing horses', 290, 7, [1], true),
  new Creature('coralp', 'coralpani', 'Коралловые жрицы', 'Coral priestesses', 415, 0, [0], false),
  new Creature('piratkaup', 'piratkaupani', 'Корсарки', 'Women corsairs', 650, 0, [0], false),
  new Creature('apirate', 'apirateani', 'Корсары', 'Corsairs', 612, 0, [0], false),
  new Creature('brawler', 'brawlerani', 'Костоломы', 'Brawlers', 114, 8, [0], false),
  new Creature('skeleton6', 'skeleton6ani', 'Костяные воины', 'Skeletal warriors', 635, 0, [0], false),
  new Creature('bonehydra', 'bonehydraani', 'Костяные гидры', 'Skeletal hydras', 271, 0, [0], false),
  new Creature('bonedragon', 'bonedragonani', 'Костяные драконы', 'Skeletal dragons', 133, 2, [0, 1], false),
  new Creature('skeletons6', 'skeletons6ani', 'Костяные копейщики', 'Skeletal Spearmen', 636, 0, [0], false),
  new Creature('bonelizard', 'bonelizardani', 'Костяные ящеры', 'Bone lizards', 717, 0, [0], false),
  new Creature('nomad', 'nomadani', 'Кочевники', 'Nomads', 897, 0, [0], false),
  new Creature('ncentaur', 'ncentaurani', 'Кочевые кентавры', 'Centaur outriders', 311, 9, [0], true),
  new Creature('nightmare', 'stallionani', 'Кошмары', 'Nightmares', 150, 7, [0], true),
  new Creature('reddragon', 'reddragonani', 'Красные драконы', 'Red dragons', 747, 6, [1], true),
  new Creature('crusader', 'crusaderani', 'Крестоносцы', 'Crusaders', 672, 0, [0], false),
  new Creature('suncrusader', 'suncrusaderani', 'Крестоносцы солнца', 'Champions', 360, 0, [0], false),
  new Creature('peasant', 'paesantani', 'Крестьяне', 'Farmers', 4, 1, [0, 1], false),
  new Creature('peasantw', 'paesantwani', 'Крестьянки', 'Peasant women', 777, 0, [0], false),
  new Creature('crystaldragon', 'crystaldragonani', 'Кристальные драконы', 'Crystal Dragons', 590, 4, [1], true),
  new Creature('redlizard', 'redlizard_ani', 'Кровавые ящеры', 'Vampiric lizards', 47, 0, [0], false),
  new Creature('bloodeyecyc', 'bloodeyecycani', 'Кровоглазые циклопы', 'Tribal beholders', 399, 9, [1], true),
  new Creature('vampire6', 'vampire6ani', 'Кровопийцы', 'Bloodsuckers', 830, 0, [0], false),
  new Creature('crusher6', 'crusher6ani', 'Крушилы', 'Crushers', 389, 0, [0], false),
  new Creature('rakshasa_kshatra', 'rakshasa_kshatraani', 'Кшатрии ракшасы', 'Sphynx immortals', 580, 3, [1], true),
  new Creature('kensei', 'kenseiani', 'Кэнсэи', 'Myrmidons', 424, 0, [0], false),
  new Creature('kenshi', 'kenshiani', 'Кэнши', 'Tritons', 423, 0, [0], false),
  new Creature('lavadragon', 'lavadragonani', 'Лавовые драконы', 'Core dragons', 962, 8, [1], true),
  new Creature('azuredragon', 'azuredragonani', 'Лазурные драконы', 'Azure dragons', 663, 0, [0], false),
  new Creature('scout', 'scoutani', 'Лазутчики', 'Bandits', 52, 6, [0, 1], false),
  new Creature('banditka', 'banditkaani', 'Лазутчицы', 'Infiltrators', 729, 0, [0], false),
  new Creature('squire', 'swordmanani', 'Латники', 'Guardians', 71, 1, [0], true),
  new Creature('leviathan', 'leviathanani', 'Левиафаны', 'Leviathans', 213, 0, [0], false),
  new Creature('yukionna', 'yukionnaani', 'Ледяные девы', 'Frost maidens', 422, 0, [0], false),
  new Creature('iceddragon', 'icedragonani', 'Ледяные драконы', 'Iced dragons', 796, 0, [0], false),
  new Creature('icequeenup', 'icequeenupani', 'Ледяные королевы', 'Ice-Maidens', 940, 0, [0], false),
  new Creature('iceel', 'iceelani', 'Ледяные элементали', 'Ice elementals', 701, 0, [0], false),
  new Creature('leprekon', 'leprekonani', 'Лепреконы', 'Leprechauns', 610, 0, [0], false),
  new Creature('arcaneelf', 'arcaneelfani', 'Лесные снайперы', 'Sharpshooters', 261, 4, [1], true),
  new Creature('lilim', 'lilimani', 'Лилимы', 'Infernal succubi', 447, 0, [0], false),
  new Creature('lich', 'lichani', 'Личи', 'Liches', 29, 2, [0, 1], false),
  new Creature('lich6', 'lich6ani', 'Личи прошлого', 'Liches of past', 826, 0, [0], false),
  new Creature('dreamreaver6', 'dreamreaver6ani', 'Ловцы снов', 'Dreamreavers', 406, 0, [0], false),
  new Creature('stalker', 'stalkerani', 'Ловчие', 'Stalkers', 696, 6, [1], true),
  new Creature('horsy', 'horsyani', 'Лошадь 2014', 'Horse 2014', 563, 0, [0], false),
  new Creature('blazingglory', 'blazinggloryani', 'Лучезарное сияние', 'Beaming spirits', 364, 0, [0], false),
  new Creature('archer', 'archerani', 'Лучники', 'Bowmen', 2, 1, [0, 1], false),
  new Creature('mage', 'mageani', 'Маги', 'Magi', 16, 3, [0, 1], false),
  new Creature('magicel', 'magicelani', 'Магические элементали', 'Magic elementals', 662, 0, [0], false),
  new Creature('magmadragon', 'magmadragonani', 'Магма драконы', 'Magma dragons', 169, 8, [0], true),
  new Creature('magneticgolem', 'magneticgolemani', 'Магнитные големы', 'Lodestone golems', 259, 3, [1], true),
  new Creature('megogachi', 'magogani', 'Магоги', 'Magogs', 287, 0, [0], false),
  new Creature('mamont', 'mamontyaraani', 'Мамонты', 'Mammoths', 992, 0, [0], false),
  new Creature('manticore', 'manticoreani', 'Мантикоры', 'Manticores', 754, 0, [0], false),
  new Creature('skirmesher', 'skirmesherani', 'Мастера копья', 'Master spearmen', 160, 8, [0], true),
  new Creature('masterhunter', 'hunterelfani', 'Мастера лука', 'Grandmaster bowmen', 72, 4, [0], true),
  new Creature('mbreeder', 'mbreederani', 'Матки-породительницы', 'Heinous breeders', 449, 0, [0], false),
  new Creature('negro', 'negroani', 'Матросы-чужеземцы', 'Sailors-strangers', 849, 0, [0], false),
  new Creature('bloodsister', 'bloodsisterani', 'Мегеры', 'Termagants', 315, 6, [1], true),
  new Creature('bear', 'bearani', 'Медведи', 'Bears', 172, 0, [0], false),
  new Creature('medusa', 'medusaani', 'Медузы', 'Medusas', 752, 0, [0], false),
  new Creature('medusaup', 'medusaupani', 'Медузы королевы', 'Medusas Queens', 753, 0, [0], false),
  new Creature('spearwielder', 'spearwielderani', 'Метатели копья', 'Spearmen', 159, 8, [0], false),
  new Creature('throwgnom', 'throwgnomani', 'Метатели молота', 'Warhummermen', 993, 0, [0], false),
  new Creature('minotaur', 'minotaurani', 'Минотавры', 'Tamed minotaurs', 55, 6, [0, 1], false),
  new Creature('taskmaster', 'taskmasterani', 'Минотавры-надсмотрщики', 'Minotaur gladiators', 317, 6, [1], true),
  new Creature('minotaurguard', 'minotaurguard_ani', 'Минотавры-стражи', 'Minotaur soldiers', 70, 6, [0], true),
  new Creature('cbal', 'cbalani', 'Мобильные баллисты', 'Mobile ballista', 791, 0, [0], false),
  new Creature('dgolemup', 'dgolemupani', 'Могильные големы', 'Sepulcher golems', 521, 0, [0], false),
  new Creature('kappashoya', 'kappashoyaani', 'Могучие каппы', 'Mighty kappas', 418, 0, [0], false),
  new Creature('gnomon', 'gnomonani', 'Молотобойцы', 'Warhammerers', 728, 0, [0], false),
  new Creature('priest', 'priestani', 'Монахи', 'Monks', 37, 1, [0, 1], false),
  new Creature('ppirate', 'ppirateani', 'Морские волки', 'Sea wolves', 615, 0, [0], false),
  new Creature('piratemonster', 'piratemonsterani', 'Морские дьяволы', 'Sailors\' devil', 644, 0, [0], false),
  new Creature('seamonster', 'seamonsterani', 'Морские черти', 'Anglerfish', 211, 0, [0], false),
  new Creature('mummy', 'mummyani', 'Мумии', 'Mummies', 268, 0, [0], false),
  new Creature('pharaoh', 'pharaohani', 'Мумии фараонов', 'Sphynx mummies', 269, 0, [0], false),
  new Creature('enforcer', 'enforcerani', 'Мятежники', 'Rebels', 35, 0, [0], false),
  new Creature('naga', 'nagaani', 'Наги', 'Nagas', 673, 0, [0], false),
  new Creature('dromad', 'dromadani', 'Наездники на верблюдах', 'Camel riders', 919, 10, [0], false),
  new Creature('wolfrider', 'wolfriderani', 'Наездники на волках', 'Wolf Riders', 18, 5, [0, 1, 2], false),
  new Creature('hyenarider', 'hyenariderani', 'Наездники на гиенах', 'Hyena riders', 859, 5, [2], true),
  new Creature('boarrider', 'boarriderani', 'Наездники на кабанах', 'Boar riders', 318, 5, [1], true),
  new Creature('bearrider', 'bearriderani', 'Наездники на медведях', 'Dwarven ursary', 161, 8, [0], false),
  new Creature('darkrider', 'lizardriderani', 'Наездники на ящерах', 'Lizard cavalry', 51, 6, [0, 1], false),
  new Creature('dromadup', 'dromadupani', 'Налетчики на верблюдах', 'Camel raiders', 920, 10, [0], true),
  new Creature('wolfraider', 'hobwolfriderani', 'Налётчики на волках', 'Wolf Raiders', 43, 5, [0], true),
  new Creature('celestial', 'celestialani', 'Небесные воители', 'Celestials', 370, 0, [0], false),
  new Creature('ravenousghoul', 'ravenousghoulani', 'Ненасытные упыри', 'Ravenous ghouls', 638, 0, [0], false),
  new Creature('harpy6', 'harpy6ani', 'Непокорные гарпии', 'Unruly harpies', 392, 0, [0], false),
  new Creature('goblin6', 'goblin6ani', 'Непокорные гоблины', 'Wild goblins', 390, 0, [0], false),
  new Creature('centaur6', 'centaur6ani', 'Непокорные кентавры', 'Nomad centaurs', 401, 0, [0], false),
  new Creature('cyclop6', 'cyclop6ani', 'Непокорные циклопы', 'Wild cyclops', 434, 0, [0], false),
  new Creature('reptiloid', 'reptiloidani', 'Никсы', 'Nixes', 850, 0, [0], false),
  new Creature('reptiloidup', 'reptiloidupani', 'Никсы-воины', 'Nix warriors', 851, 0, [0], false),
  new Creature('dryad', 'dryad_ani', 'Нимфы', 'Dryads', 255, 4, [1], true),
  new Creature('monkey', 'monkeyani', 'Обезьянка 2016', 'Monkey 2016', 707, 0, [0], false),
  new Creature('obsgargoyle', 'obsgargolyani', 'Обсидиановые горгульи', 'Enchanted gargoyles', 44, 3, [0], true),
  new Creature('sheep', 'sheepani', 'Овечка 2015', 'Sheep 2015', 643, 0, [0], false),
  new Creature('hotdog', 'firehoundani', 'Огненные гончие', 'Blazing hounds', 288, 7, [1], true),
  new Creature('hornedoverseer', 'fdemonani', 'Огненные демоны', 'Incendiaries', 79, 7, [0], true),
  new Creature('firedragon', 'firedragonani', 'Огненные драконы', 'Lava dragons', 168, 8, [0], false),
  new Creature('firebird', 'firebird_ani', 'Огненные птицы', 'Firebirds', 536, 5, [1], true),
  new Creature('fire', 'fireani', 'Огненные элементали', 'Fire elementals', 155, 0, [0], false),
  new Creature('ogre', 'ogreani', 'Огры', 'Ogres', 24, 5, [0, 1, 2], false),
  new Creature('ogrebrutal', 'ogrebrutalani', 'Огры-ветераны', 'Ogre trophy-hunters', 535, 5, [1], true),
  new Creature('ogremagi', 'ogremagiani', 'Огры-маги', 'Ogre magi', 119, 5, [0], true),
  new Creature('ogreshaman', 'ogreshamanani', 'Огры-шаманы', 'Ogre shamans', 855, 5, [2], true),
  new Creature('demoniac', 'demoniacani', 'Одержимые', 'Demoniacs', 770, 0, [0], false),
  new Creature('fatpirateup', 'fatpirateupani', 'Одноглазые пираты', 'One-eyed pirates', 652, 0, [0], false),
  new Creature('ppirateup', 'ppirateupani', 'Одноногие пираты', 'One-legged pirates', 616, 0, [0], false),
  new Creature('conscript', 'conscriptani', 'Ополченцы', 'Recruits', 34, 1, [0], true),
  new Creature('orc', 'orcani', 'Орки', 'Orcs', 23, 5, [0, 1, 2], false),
  new Creature('orcchief', 'orcchiefani', 'Орки-вожди', 'Orc chiefs', 73, 5, [0], true),
  new Creature('orcrubak', 'orcrubakani', 'Орки-тираны', 'Orc tyrants', 534, 5, [1], true),
  new Creature('orcshaman', 'orcshamanani', 'Орки-шаманы', 'Orc shamans', 546, 5, [2], true),
  new Creature('paladin', 'paladinani', 'Паладины', 'Paladins', 234, 1, [0], true),
  new Creature('executioner', 'executionerani', 'Палачи', 'Warlords', 335, 9, [0], true),
  new Creature('spider', 'spiderani', 'Пауки', 'Spiders', 198, 0, [0], false),
  new Creature('pegasus', 'pegasusani', 'Пегасы', 'Pegasus', 625, 0, [0], false),
  new Creature('footman', 'footmanani', 'Пехотинцы', 'Swordsmen', 10, 1, [0, 1], false),
  new Creature('pitlord', 'pitlord_ani', 'Пещерные владыки', 'Pit demons', 236, 7, [0], true),
  new Creature('deephydra', 'deephydraani', 'Пещерные гидры', 'Ladons', 149, 6, [0], true),
  new Creature('pitfiend', 'pitfiend_ani', 'Пещерные демоны', 'Cave demons', 83, 7, [0, 1], false),
  new Creature('pity', 'pitspawnani', 'Пещерные отродья', 'Abyss demons', 291, 7, [1], true),
  new Creature('piratka', 'piratkaani', 'Пиратки', 'Women pirates', 649, 0, [0], false),
  new Creature('zpirate', 'zpirateani', 'Пираты зомби', 'Zombie pirates', 679, 0, [0], false),
  new Creature('piratemonsterup', 'piratemonsterupani', 'Пираты Ктулху', 'Pirates of Cthulhu', 645, 0, [0], false),
  new Creature('piroman', 'piromanani', 'Пироманьяки', 'Pyromaniacs', 599, 0, [0], false),
  new Creature('hungerplant', 'hungerplantani', 'Пожиратели плоти', 'Flesh-eating trees', 628, 0, [0], false),
  new Creature('maniac', 'maniacani', 'Помешанные', 'Maniacs', 442, 0, [0], false),
  new Creature('breeder', 'breederani', 'Породительницы', 'Breeders', 448, 0, [0], false),
  new Creature('sister', 'sisterani', 'Послушницы', 'Novices', 357, 0, [0], false),
  new Creature('ghost', 'ghostani', 'Привидения', 'Ghosts', 11, 2, [0, 1], false),
  new Creature('ghost6', 'ghost6ani', 'Привидения прошлого', 'Ghosts of past', 639, 0, [0], false),
  new Creature('spectre', 'spectreani', 'Призраки', 'Apparitions', 68, 2, [0], true),
  new Creature('gpiratka', 'gpiratkaani', 'Призраки пираток', 'Ghosts of pirates', 678, 0, [0], false),
  new Creature('spectre6', 'spectre6ani', 'Призраки прошлого', 'Specters of past', 640, 0, [0], false),
  new Creature('spectraldragon', 'spectraldragonani', 'Призрачные драконы', 'Shadow dragons', 300, 2, [0], true),
  new Creature('rakshasa_rani', 'rakshasani', 'Принцессы ракшас', 'Sphynx guardians', 93, 3, [0, 1], false),
  new Creature('briskrider', 'briskriderani', 'Проворные наездники', 'Lizard chargers', 316, 6, [1], true),
  new Creature('cursedbehemoth', 'bbehemothani', 'Проклятые бегемоты', 'Cursed behemoths', 861, 5, [2], true),
  new Creature('predator', 'predatorani', 'Проклятые горгульи', 'Cursed Gargoyles', 723, 0, [0], false),
  new Creature('cursedent', 'cursedentani', 'Проклятые энты', 'Cursed treefolk', 664, 0, [0], false),
  new Creature('fatespinner', 'fatespinnerani', 'Прядильщицы судеб', 'Fate spinners', 641, 0, [0], false),
  new Creature('thunderbird', 'thunderbirdani', 'Птицы грома', 'Thunderbirds', 148, 5, [0], true),
  new Creature('darkbird', 'darkbirdani', 'Птицы тьмы', 'Dark rocs', 544, 5, [2], true),
  new Creature('vulture', 'vultureani', 'Пустынные налетчики', 'Desert Raiders', 731, 0, [0], false),
  new Creature('duneraider', 'duneraiderani', 'Пустынные рейдеры', 'Dune raiders', 921, 10, [0], false),
  new Creature('duneraiderup', 'duneraiderupani', 'Пустынные убийцы', 'Dune assassins', 922, 10, [0], true),
  new Creature('cannon', 'cannonani', 'Пушка', 'Cannon', 607, 0, [0], false),
  new Creature('rakshasa_raja', 'rakshasa_rajaani', 'Раджи ракшас', 'Sphynx warriors', 108, 3, [0], true),
  new Creature('ecyclop6', 'ecyclop6ani', 'Разъяренные циклопы', 'Raging cyclops', 435, 0, [0], false),
  new Creature('horneddemon', 'hdemonani', 'Рогатые демоны', 'Demons', 77, 7, [0, 1], false),
  new Creature('rapukk', 'rapukkani', 'Рогатые жнецы', 'Horned reapers', 283, 0, [0], false),
  new Creature('rocbird', 'rocani', 'Роки', 'Rocs', 30, 5, [0, 1, 2], false),
  new Creature('brigand', 'brigandani', 'Рубаки', 'Swashbucklers', 725, 0, [0], false),
  new Creature('cavalier', 'knightani', 'Рыцари', 'Cavalry', 90, 1, [0, 1], false),
  new Creature('deadknight', 'deadknightani', 'Рыцари смерти', 'Unholy knights', 273, 0, [0], false),
  new Creature('blackknight', 'blackknightani', 'Рыцари тьмы', 'Black knights', 272, 0, [0], false),
  new Creature('tormentor', 'tormentorani', 'Садисты', 'Tormentors', 567, 0, [0], false),
  new Creature('satyr', 'satyrani', 'Сатиры', 'Satyrs', 626, 0, [0], false),
  new Creature('pristineunicorn', 'pristineunicornani', 'Светлые единороги', 'Pristine Unicorns', 588, 4, [1], true),
  new Creature('dbehemoth', 'dbehemothani', 'Свирепые бегемоты', 'Infuriated behemoths', 538, 5, [1], true),
  new Creature('untamedcyc', 'untamedcycani', 'Свободные циклопы', 'Unfettered cyclops', 433, 9, [0], true),
  new Creature('sacredkirin', 'sacredkirinani', 'Священные кирины', 'Aquatic drakes', 441, 0, [0], false),
  new Creature('scarabup', 'scarabupani', 'Священные скарабеи', 'Sacred scarabs', 928, 0, [0], false),
  new Creature('whitebearrider', 'whitebearriderani', 'Северные наездники', 'Rearguard ursary', 959, 8, [1], true),
  new Creature('adeptus', 'adeptusani', 'Сектанты', 'Cultists', 771, 0, [0], false),
  new Creature('seraph', 'seraphani', 'Серафимы', 'Seraphs', 371, 0, [0], false),
  new Creature('spegasus', 'spegasusani', 'Серебряные пегасы', 'Silver pegasus', 629, 0, [0], false),
  new Creature('kachok', 'kachokani', 'Силачи', 'Strongmen', 601, 0, [0], false),
  new Creature('siren', 'sirenani', 'Сирены', 'Sirens', 209, 0, [0], false),
  new Creature('upsiren', 'upsirenani', 'Сирены-искусительницы', 'Seducing sirens', 210, 0, [0], false),
  new Creature('fury6', 'fury6ani', 'Сирины', 'Frenzied harpies', 393, 0, [0], false),
  new Creature('radiantglory', 'radiantgloryani', 'Сияние', 'Blessed spirits', 363, 0, [0], false),
  new Creature('scarab', 'scarabani', 'Скарабеи', 'Scarabs', 927, 0, [0], false),
  new Creature('skeleton', 'sceletonani', 'Скелеты', 'Skeletons', 1, 2, [0, 1], false),
  new Creature('skmarksman', 'skmarksmanani', 'Скелеты-арбалетчики', 'Skeletal crossbowmen', 340, 0, [0], false),
  new Creature('sceletonwar', 'sceletonwarani', 'Скелеты-воины', 'Skeletal legionnaires', 267, 2, [1], true),
  new Creature('skeletonpirateup', 'dpirateupani', 'Скелеты-корсары', 'Skeletal corsairs', 606, 0, [0], false),
  new Creature('skeletonarcher', 'sceletonarcherani', 'Скелеты-лучники', 'Skeletal bowmen', 28, 2, [0], true),
  new Creature('cpirate', 'cpirateani', 'Скелеты-моряки', 'Skeleton sailor', 677, 0, [0], false),
  new Creature('skeletonpirate', 'dpirateani', 'Скелеты-пираты', 'Skeletal pirates', 604, 0, [0], false),
  new Creature('manticoreup', 'manticoreupani', 'Скорпикоры', 'Scorpicores', 755, 0, [0], false),
  new Creature('scorp', 'scorpani', 'Скорпионы', 'Scorpions', 923, 10, [0], false),
  new Creature('elephant', 'elephantani', 'Слоны', 'Elephants', 323, 0, [0], false),
  new Creature('anubis', 'anubisani', 'Слуги Анубиса', 'Anubises avatar', 917, 10, [0], false),
  new Creature('flake', 'flakeani', 'Снежинки', 'Snowflakes', 797, 0, [0], false),
  new Creature('chuvak', 'chuvakani', 'Снежные воины', 'Snow warriors', 703, 0, [0], false),
  new Creature('snowwolf', 'snowwolfani', 'Снежные волки', 'Snow wolfs', 942, 0, [0], false),
  new Creature('snowmaiden', 'snowmaidenani', 'Снежные девы', 'Snow maidens', 421, 0, [0], false),
  new Creature('icequeen', 'icequeenani', 'Снежные королевы', 'Ice queens', 705, 0, [0], false),
  new Creature('snowmonster', 'snowmonsterani', 'Снежные монстры', 'Snow monsters', 947, 0, [0], false),
  new Creature('dreamwalker6', 'dreamwalker6ani', 'Сноходцы', 'Dreamwalkers', 405, 0, [0], false),
  new Creature('steelgolem', 'steelgolemani', 'Стальные големы', 'Modern golems', 69, 3, [0], true),
  new Creature('runepatriarch', 'runepatriarchani', 'Старейшины рун', 'Patriarchs', 165, 8, [0], true),
  new Creature('mastergremlin', 'mastergremlinani', 'Старшие гремлины', 'Gremlin engineers', 32, 3, [0], true),
  new Creature('jdemon', 'jdemonani', 'Старшие демоны', 'Fiends', 289, 7, [1], true),
  new Creature('ddhigh', 'ddhighani', 'Старшие друиды', 'High Druids', 587, 4, [1], true),
  new Creature('mauler', 'maulerani', 'Степные бойцы', 'Enforcers', 320, 9, [0], true),
  new Creature('warrior', 'warriorani', 'Степные воины', 'Invaders', 319, 9, [0, 1], false),
  new Creature('swolf', 'swolfani', 'Степные волки', 'Plains wolves', 27, 0, [0], false),
  new Creature('goblinus', 'goblinusani', 'Степные гоблины', 'Tribal goblins', 329, 9, [0, 1], false),
  new Creature('cyclopus', 'cyclopusani', 'Степные циклопы', 'Tribal cyclops', 397, 9, [0, 1], false),
  new Creature('elgargoly', 'elgargolyani', 'Стихийные горгульи', 'Grotesques', 256, 3, [1], true),
  new Creature('sentinel', 'sentinelani', 'Стражи', 'Sentinels', 352, 0, [0], false),
  new Creature('crossman', 'crossbowmanani', 'Стрелки', 'Wardens', 257, 1, [1], true),
  new Creature('mercarcher', 'mercarcherani', 'Стрелки-наёмники', 'Mercenary archers', 20, 0, [0], false),
  new Creature('succubus', 'succubani', 'Суккубы', 'Succubi', 81, 7, [0, 1], false),
  new Creature('shadow_witch', 'witchani', 'Сумеречные ведьмы', 'Dark witches', 94, 6, [0, 1], false),
  new Creature('shadowdragon', 'shadowdragonani', 'Сумеречные драконы', 'Twilight dragons', 102, 6, [0, 1], false),
  new Creature('wdancer', 'winddancerani', 'Танцующие с ветром', 'Forest brethren', 258, 4, [1], true),
  new Creature('dancer', 'dancerani', 'Танцующие с клинками', 'Forest keepers', 25, 4, [0, 1], false),
  new Creature('wardancer', 'bladedancerani', 'Танцующие со смертью', 'Elite forest keepers', 41, 4, [0], true),
  new Creature('thane', 'thaneani', 'Таны', 'Dreadbanes', 166, 8, [0], false),
  new Creature('foulwyvern', 'foulwyvernani', 'Тёмные виверны', 'Venomous wyverns', 337, 9, [0], true),
  new Creature('grimrider', 'grimriderani', 'Тёмные всадники', 'Lizard assailants', 121, 6, [0], true),
  new Creature('foulhydra', 'foulhydraani', 'Тёмные гидры', 'Foul hydras', 746, 6, [1], true),
  new Creature('burbuly', 'burbulyani', 'Тёмные горгульи', 'Dark Gargoyles', 722, 0, [0], false),
  new Creature('titan', 'titanani', 'Титаны', 'Titans', 107, 3, [0], true),
  new Creature('stormtitan', 'stormtitanani', 'Титаны шторма', 'Stormcallers', 581, 3, [1], true),
  new Creature('fatpirate', 'fatpirateani', 'Толстяки', 'Fatso', 651, 0, [0], false),
  new Creature('troglodyte', 'troglodyteani', 'Троглодиты', 'Troglodytes', 750, 0, [0], false),
  new Creature('troll', 'trollani', 'Тролли', 'Trolls', 204, 0, [0], false),
  new Creature('tengu', 'tenguani', 'Тэнгу', 'Tengu', 793, 0, [0], false),
  new Creature('slayer', 'slayerani', 'Убийцы', 'Commanders', 334, 9, [0, 1], false),
  new Creature('wight', 'wightani', 'Умертвия', 'Death envoys', 91, 2, [0, 1], false),
  new Creature('ghoul', 'ghoulani', 'Упыри', 'Nachzehrers', 637, 0, [0], false),
  new Creature('pixel', 'ppani', 'Феи', 'Faeries', 17, 4, [0, 1], false),
  new Creature('phoenix', 'phoenixani', 'Фениксы', 'Phoenixes', 464, 0, [0], false),
  new Creature('shootpirateup', 'shootpirateupani', 'Флибустьеры', 'Flibustiers', 647, 0, [0], false),
  new Creature('fury', 'furyani', 'Фурии', 'Shrews', 53, 6, [0], true),
  new Creature('plant', 'plantani', 'Хищные растения', 'Waspworts', 624, 0, [0], false),
  new Creature('hobgoblin', 'hobgoblinani', 'Хобгоблины', 'Hobgoblins', 33, 5, [0], true),
  new Creature('strashidlo', 'strashidloani', 'Ходячие пугала', 'Mechanical scarecrows', 674, 0, [0], false),
  new Creature('blackbearrider', 'blackbearriderani', 'Хозяева медведей', 'Frontier ursary', 162, 8, [0], true),
  new Creature('mistress', 'mistressani', 'Хозяйки ночи', 'Shadow mistresses', 745, 6, [1], true),
  new Creature('cerberus', 'cerberusani', 'Церберы', 'Cerberi', 75, 7, [0], true),
  new Creature('cyclop', 'cyclopani', 'Циклопы', 'Cyclops', 89, 5, [0, 1, 2], false),
  new Creature('cyclopod', 'cyclopod_ani', 'Циклопы-генералы', 'Cyclop generals', 537, 5, [1], true),
  new Creature('cyclopking', 'cyclopkingani', 'Циклопы-короли', 'Cyclop kings', 237, 5, [0], true),
  new Creature('shamancyclop', 'cyclopshamanani', 'Циклопы-шаманы', 'Cyclops shamans', 860, 5, [2], true),
  new Creature('mercwizard', 'mercwizardani', 'Чародеи-наёмники', 'Mercenary sorcerers', 126, 0, [0], false),
  new Creature('champion', 'championani', 'Чемпионы', 'Chargers', 495, 1, [1], true),
  new Creature('blackwidow', 'blackwidowani', 'Черные вдовы', 'Black widows', 661, 0, [0], false),
  new Creature('blackdragon', 'blackdragonani', 'Чёрные драконы', 'Black dragons', 101, 6, [0], true),
  new Creature('scorpup', 'scorpupani', 'Черные скорпионы', 'Black scorpions', 924, 10, [0], true),
  new Creature('blacktroll', 'blacktrollani', 'Черные тролли', 'Crazed trolls', 205, 0, [0], false),
  new Creature('familiar', 'familiarani', 'Черти', 'Spawns', 80, 7, [0], true),
  new Creature('plaguezombie', 'plaguezombieani', 'Чумные зомби', 'Infected zombies', 40, 2, [0], true),
  new Creature('shakal', 'shakalani', 'Шакалы', 'Jackals', 925, 10, [0], false),
  new Creature('shakalup', 'shakalupani', 'Шакалы-воины', 'Jackals-warriors', 926, 10, [0], true),
  new Creature('shamaness', 'shamanessani', 'Шаманки', 'Shamans', 331, 9, [0, 1], false),
  new Creature('wfassault', 'wfassaultani', 'Штурмовики', 'Infantrymen', 483, 0, [0], false),
  new Creature('battlegriffon', 'battlegriffonani', 'Штурмовые грифоны', 'Wild griffins', 493, 1, [1], true),
  new Creature('slonup', 'slonupani', 'Штурмовые слоны', 'Assault elephants', 932, 10, [0], true),
  new Creature('elf', 'elfani', 'Эльфийские лучники', 'Elven bowmen', 19, 4, [0, 1], false),
  new Creature('elfhealer', 'elfhealerani', 'Эльфийские целительницы', 'Elvish healer', 774, 0, [0], false),
  new Creature('treant', 'entani', 'Энты', 'Treefolk', 92, 4, [0, 1], false),
  new Creature('spiderpois', 'spiderpoisani', 'Ядовитые пауки', 'Venomous spiders', 199, 0, [0], false),
  new Creature('flamelord', 'flamelordani', 'Ярлы', 'Punishers', 958, 8, [1], true)
];

//----------------------------------------------------------------------------//

function Creature(id_, flash_, name_, en_name_, uid_, f_, c_, is_up_){
  this.id      = id_;
  this.flash   = flash_;
  this.name    = name_;
  this.en_name = en_name_;
  this.uid     = +uid_;
  this.f       = +f_;
  this.is_up   = is_up_;

  this.c = [];
  for(var i = 0; i < c_.length; ++i)
    this.c.push(c_[i]);
}

save_value('GN_CommonValues_Creatures', JSON.stringify(creatures));

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//