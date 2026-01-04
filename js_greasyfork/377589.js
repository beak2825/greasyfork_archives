// ==UserScript==
// @name        Arcomage Companion
// @namespace   mochet
// @description ArcomageCompanion
// @include     /^http:\/\/.*(heroeswm\.ru|178\.248\.235\.15)+?\/cgame\.php.*$/
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/377589/Arcomage%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/377589/Arcomage%20Companion.meta.js
// ==/UserScript==

/*******************************************************************************
 *
 * 1.0.0 - 22.06.2018,01.06.2018
 *         - initial version: tracker only
 * 1.0.1 - 09.07.2018
 *         - basic translation added
 * 1.0.2 - 10.06.2018
 *         - color difference: me,enemy
 *         - if card was dropped: X is added
 *         - card info added (on mouse hover)
 * 1.0.3 - 12.07.2018
 *         - errors translated
 *
 ******************************************************************************/

//----------------------------------------------------------------------------//

(function()
{

/*******************************************************************************
 *
 * This file contains following classes and functions:
 *
 * Cards (CARDS)
 *  - [private] Card(_id, _name_en, _name_ru, _text_en, _text_ru, _color, _costs)
 *
 * Translation (TRANSLATION)
 * - [private] Text(_text_ru, _text_en)
 *
 * SysUtils (SU)
 *  - [public] sleep(ms)
 *  - [public] send_get(url)
 *  - [public] get_host()
 *  - [public] show_error(error_string)
 *
 * GameUtils (GU)
 *  - [public] check_login()
 *
 * CardsTracker (CT)
 *  - [public] add_card_after_action(turn, card_id)
 *  - [public] update_tracker_cards(cards, current_turn)
 *  - [public] init_tracker(cards)
 *
 * ArcomageUtils (AU)
 *  - [public] get_last_card_played_by_player()
 *  - [public] get_last_played_card()
 *  - [public] get_last_made_action()
 *  - [public] get_cooldown()
 *  - [public] is_game_active()
 *  - [public] is_my_turn_now()
 *  - [public] get_my_cards()
 *  - [public] get_current_turn()
 *  - [public] update_game_state(response_text)
 *  - [public] check_is_game_active()
 *  - [public] init_game()
 *  - [private] cards_to_list(cards)
 *  - [private] get_game_infos()
 *  - [private] calc_cooldown()
 *  - [private] get_card_action_position(input_string)
 *
 * ArcomageDrawUtils (ADU)
 *  - [public] init_draw()
 *  - [private] create_companion_nodes()
 *  - [private] resize_and_move_flash()
 *  - [private] tracker_add_card(card_id, turn_num, player, action)
 *  - [private] tracker_remove_card(card_id, turn_num)
 *  - [private] update_tracker_frame(card_id, turn_num, player, action)
 *
 ******************************************************************************/

"use strict";

//----------------------------------------------------------------------------//

/*
 * Settings
 */

// Language
var INTERFACE_LANG = "ru"; // ru, en

// How often do we want to send a request to the server (in milliseconds)
var UPDATE_REQUESTS_INTERVAL_TIMER = 1000; // 1000ms = 1 second

// How much cards do you want to show in the tracker frame?
var TRACKER_SHOW_CARDS = 9999; // set to MAX_TURN, if you want to show all

// Flash
var FLASH_WIDTH  = 975;
var FLASH_HEIGHT = 595;
var FLASH_CSS = "visibility: visible; width: "+FLASH_WIDTH+"px; left: auto; margin-left: 0px; height: "+FLASH_HEIGHT+"px; top: auto; margin-top: 0px; padding-bottom: 0px;";

// Cards
var CARD_ME_COLOR_BACKG_RED    = "#ff8080";  // background (me)
var CARD_ME_COLOR_BACKG_BLUE   = "#99ccff";
var CARD_ME_COLOR_BACKG_GREEN  = "#73ad21";
var CARD_ME_COLOR_BORDER_RED   = "#ff3333";   // border (me)
var CARD_ME_COLOR_BORDER_BLUE  = "#1a75ff";
var CARD_ME_COLOR_BORDER_GREEN = "#47d147";

var CARD_ENEMY_COLOR_BACKG_RED    = "#e60000";   // background (enemy)
var CARD_ENEMY_COLOR_BACKG_BLUE   = "#4da6ff";
var CARD_ENEMY_COLOR_BACKG_GREEN  = "#558118";
var CARD_ENEMY_COLOR_BORDER_RED   = "#ff3333";    // border (enemy)
var CARD_ENEMY_COLOR_BORDER_BLUE  = "#1a75ff";
var CARD_ENEMY_COLOR_BORDER_GREEN = "#47d147";

// Scrollbar
var SCROLLBAR_COLOR = "#75a3a3"; // #ccc

// Header
var HEADER_CSS = `

/******************************************************************************/

/*
 * HTML
 */

html {
    background-color: #ddd9cd;
}

/******************************************************************************/

/*
 * Cards
 */

[class*="card-"] {
    height: 10px;
    width: 270px;
    border-radius: 10px;
}

.card-red-me {
    border: 2px solid `+CARD_ME_COLOR_BACKG_RED+`;
    background-color: `+CARD_ME_COLOR_BORDER_RED+`;
}

.card-blue-me {
    border: 2px solid `+CARD_ME_COLOR_BORDER_BLUE+`;
    background-color: `+CARD_ME_COLOR_BACKG_BLUE+`;
}

.card-green-me {
    border: 2px solid `+CARD_ME_COLOR_BORDER_GREEN+`;
    background-color: `+CARD_ME_COLOR_BACKG_GREEN+`;
}

.card-red-enemy {
    border: 2px solid `+CARD_ENEMY_COLOR_BORDER_RED+`;
    background-color: `+CARD_ENEMY_COLOR_BACKG_RED+`;
}

.card-blue-enemy {
    border: 2px solid `+CARD_ENEMY_COLOR_BORDER_BLUE+`;
    background-color: `+CARD_ENEMY_COLOR_BACKG_BLUE+`;
}

.card-green-enemy {
    border: 2px solid `+CARD_ENEMY_COLOR_BORDER_GREEN+`;
    background-color: `+CARD_ENEMY_COLOR_BACKG_GREEN+`;
}

/******************************************************************************/

[class*="arcFrame"] {
    position: fixed;
    overflow:auto;
    border: 3px solid #999999;
    border-radius: 10px;
    background-color: #d9d9d9;
}

/******************************************************************************/

/* Top frame for Settings + Infos */
.arcFrame-topFrame {
    height: 50px;
    width: 1265px;
}

/* Flash */
.arcFrame-flash {
    margin-top: 55px;
    /*border: 3px solid #999999;*/
    /*border-radius: 10px;*/
}

/* Tracker */
.arcFrame-tracker {
    margin-top: 55px;
    margin-left: `+(FLASH_WIDTH+5)+`px;
    height: `+FLASH_HEIGHT+`px;
    width: 285px;
}

/******************************************************************************/

/*
 * Tracker
 */

.tracker-turn {
    background-color: #ffd480;
    text-align: center;
    border: 1px solid #cc8800;
    border-radius: 10px;
    font-size:15px;
    width:30px;
    display: inline-block;
    vertical-align: middle;
}
.tracker-text {
    padding: 0 0 0 5px;
}

/******************************************************************************/

/*
 * Turn number crossed => card dropped
 */

.cross {
    position: relative;
    display: inline-block;
}
.cross::before, .cross::after {
    content: '';
    width: 100%;
    position: absolute;
    right: 0;
    top: 50%;
}
.cross::before {
    border-bottom: 2px solid red;
    -webkit-transform: skewY(-22deg);
    transform: skewY(-22deg);
}
.cross::after {
    border-bottom: 2px solid red;
    -webkit-transform: skewY(22deg);
    transform: skewY(22deg);
}

/******************************************************************************/

/*
 * Scrollbar styles
 */

::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}
::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: `+SCROLLBAR_COLOR+`;  
}
::-webkit-scrollbar-thumb:hover {
    background: #999;  
}

/******************************************************************************/

/*
 * Tooltip: Card info
 */

.tooltip {
    position: relative;
    display: inline-block;
    cursor: help;
}
.tooltiptext {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    padding: 0 5px 0 5px;
    position: absolute;
    z-index: 1;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 13px;
    width: 200px;
}
.tooltip .tooltiptext::after {
    content: "";
    position: relative;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
    width: 200px;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    width: 200px;
}

/******************************************************************************/

`;

//----------------------------------------------------------------------------//

/*
 * Constants. Don't touch them!
 */

var CARDS_NUM = 102;
var MAX_TURN  = 2501; // fixed by Alexander (adm) after by bots built a wall of size 100.000 xD

//----------------------------------------------------------------------------//

var CARDS = new Cards();

function Cards()
{
    this.cards = [
        new Card(0, "Defective ore", "Бракованная руда", "-8 ore to all players", "Все игроки теряют по 8 руды", "red", 0),
        new Card(1, "Lucky coin", "Счастливая монетка", "+2 ore, +2 mana, play again", "+2 руды, +2 маны, играем снова", "red", 0),
        new Card(2, "Abundant soil", "Благодатная почва", "+1 to wall, play again", "+1 к стене, играем снова", "red", 1),
        new Card(3, "Miners", "Шахтеры", "+1 to mine", "+1 шахта", "red", 3),
        new Card(4, "Big vein", "Большая жила", "If mine < enemy mine, +2 to mine, else +1 to mine", "Если шахта меньше чем у врага, то шахта +2, иначе шахта +1", "red", 4),
        new Card(5, "Dwarf miners", "Гномы-шахтеры", "+4 to wall, +1 to mine", "+4 к стене, +1 шахта", "red", 7),
        new Card(6, "Overtime", "Сверхурочные", "+5 to wall, -6 mana", "+5 к стене, вы теряете 6 маны", "red", 2),
        new Card(7, "Steal technology", "Кража технологий", "If mine < enemy mine, mine becomes equal to enemy mine", "Если шахта меньше чем у врага, то шахта становится равной вражеской", "red", 5),
        new Card(8, "Ordinary wall", "Обычная стена", "+3 to wall", "+3 к стене", "red", 2),
        new Card(9, "Large wall", "Большая стена", "+4 to wall", "+4 к стене", "red", 3),
        new Card(10, "Innovation", "Новшества", "+1 to all mines, +4 mana", "+1 к шахте всех игроков, вы получаете 4 маны", "red", 2),
        new Card(11, "Foundation", "Фундамент", "If wall : 0, +6 to wall, else +3 to wall", "Если стена=0, то +6 к стене, иначе +3 к стене", "red", 3),
        new Card(12, "Tremor", "Толчки", "All walls take 5 damage, play again", "Все стены получают по 5 повреждений, играем снова", "red", 7),
        new Card(13, "Secret cavern", "Секретная пещера", "+1 to monastery, play again", "+1 монастырь, играем снова", "red", 8),
        new Card(14, "Earthquake", "Землетрясение", "-1 to all mines", "-1 шахта всех игроков", "red", 0),
        new Card(15, "Fortified wall", "Усиленная стена", "+6 to wall", "+6 к стене", "red", 5),
        new Card(16, "Collapse", "Обвал", "-1 to enemy mine", "-1 шахта врага", "red", 4),
        new Card(17, "New equipment", "Новое оборудование", "+2 to mine", "+2 к шахте", "red", 6),
        new Card(18, "Mine collapse", "Обвал рудника", "-1 to mine, +10 to wall, +5 mana", "-1 шахта, +10 к стене, вы получаете 5 маны", "red", 0),
        new Card(19, "Great wall", "Великая стена", "+8 to wall", "+8 к стене", "red", 8),
        new Card(20, "Galleries", "Галереи", "+5 to wall, +1 to barracks", "+5 к стене, +1 казарма", "red", 9),
        new Card(21, "Magic mount", "Магическая гора", "+7 to wall, +7 mana", "+7 к стене, +7 маны", "red", 9),
        new Card(22, "Singing coal", "Поющий уголь", "+6 to wall, +3 to tower", "+6 к стене, +3 к башне", "red", 11),
        new Card(23, "Bastion", "Бастион", "+12 to wall", "+12 к стене", "red", 13),
        new Card(24, "New successes", "Новые успехи", "+8 to wall, +5 to tower", "+8 к стене, +5 к башне", "red", 15),
        new Card(25, "Greater wall", "Величайшая стена", "+15 to wall", "+15 к стене", "red", 16),
        new Card(26, "Rockcaster", "Скаломет", "+6 to wall, 10 damage", "+6 к стене, 10 единиц урона врагу", "red", 18),
        new Card(27, "Dragon's heart", "Сердце дракона", "+20 to wall, +8 to tower", "+20 к стене, +8 к башне", "red", 24),
        new Card(28, "Slave labor", "Рабский труд", "+9 to wall, -5 stacks", "+9 к стене, вы теряете 5 отрядов", "red", 7),
        new Card(29, "Stone garden", "Сад камней", "+1 to wall, +1 to tower, +2 stacks", "+1 к стене, +1 к башне, +2 отряда", "red", 1),
        new Card(30, "Subsoil waters", "Грунтовые воды", "Player with lower wall gets -1 to barracks and 2 damage to tower", "Игрок с меньшей стеной теряет 1 казарму и получает 2 урона к башне", "red", 6),
        new Card(31, "Barracks", "Казармы", "+6 stacks, +6 to wall, if barracks < enemy barracks, +1 to barracks", "+6 отрядов  +6 к стене. Если казарма < вражеской, то +1 казарма", "red", 10),
        new Card(32, "Fortification", "Укрепления", "+7 to wall, 6 damage", "+7 к стене, 6 урона врагу", "red", 14),
        new Card(33, "Shift", "Сдвиг", "Players switch walls", "Ваша и вражеская стена меняются местами", "red", 17),
        new Card(34, "Quartz", "Кварц", "+1 to tower, play again", "+1 к башне, играем снова", "blue", 1),
        new Card(35, "Smoky quartz", "Дымчатый кварц", "1 damage to enemy tower, play again", "1 урона Башне врага, Играем снова", "blue", 2),
        new Card(36, "Amethyst", "Аметист", "+3 to tower", "+3 к башне", "blue", 2),
        new Card(37, "Spell weavers", "Ткачи заклинаний", "+1 to monastery", "+1 монастырь", "blue", 3),
        new Card(38, "Ore vein", "Рудная жила", "+8 to tower", "+8 к башне", "blue", 5),
        new Card(39, "Eclipse", "Затмение", "+2 to tower, 2 damage to enemy tower", "+2 к башне, 2 ед. урона башне врага", "blue", 4),
        new Card(40, "Die mould", "Матрица", "+1 to monastery, +3 to tower, +1 to enemy tower", "+1 монастырь, +3 к башне, +1 к башне врага", "blue", 6),
        new Card(41, "Crack", "Трещина", "3 damage to enemy tower", "3 урона башне врага", "blue", 2),
        new Card(42, "Ruby", "Рубин", "+5 to tower", "+5 к башне", "blue", 3),
        new Card(43, "Spear", "Копье", "5 damage to enemy tower", "5 урона башне врага", "blue", 4),
        new Card(44, "Power explosion", "Взрыв силы", "5 damage to your tower, +2 to monastery", "5 урона собственной башне, +2 монастырь", "blue", 3),
        new Card(45, "Harmony", "Гармония", "+1 to monastery, +3 to tower, +3 to wall", "+1 монастырь, +3 к башне, +3 к стене", "blue", 7),
        new Card(46, "Parity", "Паритет", "All monasteries tie up for highest", "Монастырь всех становится равным монастырю сильнейшего", "blue", 7),
        new Card(47, "Emerald", "Эмеральд", "+8 to tower", "+8 к башне", "blue", 6),
        new Card(48, "Wisdom pearl", "Жемчуг мудрости", "+5 to tower, +1 to monastery", "+5 к башне, +1 монастырь", "blue", 9),
        new Card(49, "Fission", "Дробление", "-1 to monastery, 9 damage to enemy tower", "-1 монастырь, 9 урона башне врага", "blue", 8),
        new Card(50, "Mild stone", "Мягкий камень", "+5 to tower, -6 ore to enemy", "+5 к башне, враг теряет 6 руды", "blue", 7),
        new Card(51, "Sapphire", "Сапфир", "+11 to tower", "+11 к башне", "blue", 10),
        new Card(52, "Dissension", "Раздоры", "7 damage to all towers, -1 to all monasteries", "7 урона всем башням, -1 монастырь всех игроков", "blue", 5),
        new Card(53, "Fire ruby", "Огненный рубин", "+6 to tower, 4 damage to enemy tower", "+6 к башне, 4 урона башне врага", "blue", 13),
        new Card(54, "Collaboration", "Помощь в работе", "+7 to tower, -10 ore", "+7 к башне, вы теряете 10 руды", "blue", 4),
        new Card(55, "Crystal shield", "Кристальный щит", "+8 to tower, +3 to wall", "+8 к башне, +3 к стене", "blue", 12),
        new Card(56, "Empathy", "Эмпатия", "+8 to tower, +1 to barracks", "+8 к башне, +1 казарма", "blue", 14),
        new Card(57, "Diamond", "Алмаз", "+15 to tower", "+15 к башне", "blue", 16),
        new Card(58, "Sanctuary", "Монастырь", "+10 to tower, +5 to wall, +5 stacks", "+10 к башне, +5 к стене, вы получаете 5 отрядов", "blue", 15),
        new Card(59, "Shining stone", "Сияющий камень", "+12 to tower, 6 damage", "+12 к башне, 6 урона врагу", "blue", 17),
        new Card(60, "Dragon's eye", "Глаз дракона", "+20 to tower", "+20 к башне", "blue", 21),
        new Card(61, "Solidification", "Отвердение", "+11 to tower, -6 to wall", "+11 к башне, -6 к стене", "blue", 8),
        new Card(62, "Jewellery", "Бижутерия", "If tower < enemy tower, +2 to tower, else +1 to tower", "Если башня < вражеской, то +2 к башне, иначе +1", "blue", 0),
        new Card(63, "Rainbow", "Радуга", "+1 to all towers, you get 3 mana", "+1 к башням всех, вы получаете 3 маны", "blue", 0),
        new Card(64, "Initiation", "Вступление", "+4 to tower, -3 stacks, 2 damage to enemy tower", "+4 к башне, вы теряете 3 отряда. 2 урона башне врага", "blue", 5),
        new Card(65, "Lightning", "Молния", "If tower > enemy wall, 8 damage to enemy tower, else 8 damage to all", "Если башня > стены врага, то 8 урона башне врага, иначе 8 урона всем", "blue", 11),
        new Card(66, "Meditation", "Медитация", "+13 to tower, +6 stacks, +6 ore", "+13 к башне, +6 отрядов, +6 руды", "blue", 18),
        new Card(67, "Cow rabies", "Коровье бешенство", "-6 stacks to all players", "Все игроки теряют по 6 отрядов", "green", 0),
        new Card(68, "Sprite", "Фея", "2 damage, play again", "2 единицы урона. Играем снова", "green", 1),
        new Card(69, "Goblins", "Гоблины", "4 damage, -3 mana", "4 единицы урона. Вы теряете 3 маны", "green", 1),
        new Card(70, "Minotaur", "Минотавр", "+1 to barracks", "+1 казарма", "green", 3),
        new Card(71, "Goblin army", "Армия гоблинов", "6 damage, 3 damage to you", "6 единиц урона. Вы получаете 3 единицы урона", "green", 3),
        new Card(72, "Goblin archers", "Гоблины-лучники", "3 damage to enemy tower, 1 damage to you", "3 урона башне врага. Вы получаете 1 ед. урона", "green", 4),
        new Card(73, "Ghost fairy", "Призрачная фея", "2 damage to enemy tower, play again", "2 урона башне врага, Играем снова.", "green", 6),
        new Card(74, "Orc", "Орк", "5 damage", "5 урона", "green", 3),
        new Card(75, "Gnomes", "Гномы", "4 damage, +3 to wall", "4 урона, +3 к стене", "green", 5),
        new Card(76, "Tiny snakes", "Маленькие змейки", "4 damage to enemy tower", "4 урона башне врага", "green", 6),
        new Card(77, "Troll instructor", "Тролль-наставник", "+2 to barracks", "+2 к казарме", "green", 7),
        new Card(78, "Tower Gremlin", "Гремлин в башне", "2 damage, +4 to wall, +2 to tower", "2 урона, +4 к стене, +2 к башне", "green", 8),
        new Card(79, "Full moon", "Полнолуние", "+1 barracks to all players, +3 stacks", "+1 казарма всем игрокам, Вы получаете 3 отряда", "green", 0),
        new Card(80, "Crusher", "Крушитель", "6 damage", "6 урона", "green", 5),
        new Card(81, "Ogre", "Огр", "7 damage", "7 урона", "green", 6),
        new Card(82, "Rabid sheep", "Бешеная овца", "6 damage, -3 stacks to enemy", "6 урона, враг теряет 3 отряда", "green", 6),
        new Card(83, "Familiar", "Черт", "6 damage, -5 ore, mana and stacks to all players", "6 урона, Все игроки теряют по 5 руды, маны, отрядов", "green", 5),
        new Card(84, "Beetle", "Жучара", "If enemy wall : 0, 10 damage, else 6 damage", "Если стена у врага =0, то 10 урона, иначе 6 урона", "green", 8),
        new Card(85, "Werewolf", "Оборотень", "9 damage", "9 урона", "green", 9),
        new Card(86, "Caustic cloud", "Едкое облако", "If enemy wall > 10, 10 damage, else 7 damage", "Если стена врага >10, то 10 урона, иначе 7 урона", "green", 11),
        new Card(87, "Unicorn", "Единорог", "If monastery > enemy monastery, 12 damage, else 8 damage", "Если монастырь больше чем у врага, то 12 урона, иначе 8 урона", "green", 9),
        new Card(88, "Elven archers", "Эльфы-лучники", "If wall > enemy wall, 6 damage to enemy tower, else 6 damage", "Если стена больше чем у врага, то 6 урона башне врага, иначе 6 урона", "green", 10),
        new Card(89, "Succubi", "Суккубы", "5 damage to enemy tower, -8 stacks to enemy", "5 урона башне врага, Враг теряет 8 отрядов", "green", 14),
        new Card(90, "Stone devourers", "Камнееды", "8 damage, -1 to enemy mine", "8 урона, -1 шахта врага", "green", 11),
        new Card(91, "Thief", "Вор", "-10 mana to enemy, -5 ore to enemy, you get half that much", "Враг теряет 10 маны, 5 руды. Вы получаете половину от этого", "green", 12),
        new Card(92, "Stone giant", "Каменный гигант", "10 damage, +4 to wall", "10 урона, +4 к стене", "green", 15),
        new Card(93, "Vampire", "Вампир", "10 damage, -5 stacks to enemy, -1 to enemy barracks", "10 урона, враг теряет 5 отрядов, -1 к его казарме", "green", 17),
        new Card(94, "Dragon", "Дракон", "20 damage, -10 mana to enemy, -1 to enemy barracks", "20 урона, враг теряет 10 маны, -1 к его казарме", "green", 25),
        new Card(95, "Spearman", "Копьеносец", "If wall > enemy wall, 3 damage, else 2 damage", "Если стена больше чем у врага, то 3 урона, иначе 2 урона", "green", 2),
        new Card(96, "Dwarf", "Карлик", "3 damage, +1 mana", "3 урона, +1 мана", "green", 2),
        new Card(97, "Berserker", "Берсерк", "8 damage, 3 damage to your tower", "8 урона, 3 урона Вашей башне", "green", 4),
        new Card(98, "Warrior", "Воитель", "13 damage, -3 mana", "13 урона, вы теряете 3 маны", "green", 13),
        new Card(99, "Pegasus rider", "Всадник на пегасе", "12 damage to enemy tower", "12 урона башне врага", "green", 18),
        new Card(100, "Prism", "Призма", "Draw a card, discard a card, play again", "Сдать 1 карту, сбросить карту, играем снова", "blue", 2),
        new Card(101, "Elven scouts", "Эльфы-скауты", "Draw a card, discard a card, play again", "Сдать 1 карту, сбросить карту, играем снова", "green", 2),
    ];
    
    /**************************************************************************/
    function Card(_id, _name_en, _name_ru, _text_en, _text_ru, _color, _costs)
    {
        this.id = _id;
        this.color   = _color;
        this.costs   = _costs;
        if(INTERFACE_LANG == "ru")
        {
            this.text = _text_ru;
            this.name = _name_ru;
        }
        else
        {
            this.text = _text_en;
            this.name = _name_en;
        }
    }
}

//----------------------------------------------------------------------------//

var TRANSLATION = new Translation();

function Translation()
{
    
    this.TranslatedTexts = {
        costs : Text("Стоимость", "Costs"),
        errors : {
            notAuthorised : Text(
                "Пользователь не авторизован",
                "User is not logged in"),
            unableToReceiveData : Text(
                "Не могу получить данные об игре",
                "Unable to receive game data"),
            wrongDataFormat : Text(
                "Неправильный формат данных об игре",
                "Game data has wrong format"),
            noGameData : Text(
                "Нет данных об игре",
                "No game data"),
            wrongParamsNumber : Text(
                "Не могу обновить данные - неправильное количество значений",
                "Unable to update data - wrong number of parameters"),
            resizeMoveFlash : Text(
                "Не могу изменить размер и переместить флеш элемент",
                "Unable to resize and move flash element"),
            removeCardTracker : Text(
                "Не могу удалить карту из трекера (интерфейс)",
                "Unable to remove card from cards tracker (interface)")
        }
    };
    
    function Text(_text_ru, _text_en)
    {
        if(INTERFACE_LANG == "ru")
        {
            return _text_ru;
        }
        else
        {
            return _text_en;
        }
    }
    
}

//----------------------------------------------------------------------------//

var SU = new SysUtils();

function SysUtils()
{
    
    /**************************************************************************/ 
    this.sleep = function(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**************************************************************************/
    this.send_get = function(url)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.overrideMimeType("text/plain; charset=windows-1251");
        xhr.send(null);
        if(xhr.status == 200)
        {
            return xhr.responseText;
        }
        return null;
    }
    
    /**************************************************************************/
    this.get_host = function()
    {
        return window.location.protocol + "//" + window.location.host + "/";
    }
    
    /**************************************************************************/
    this.show_error = function(error_string)
    {
        alert(error_string);
        throw new Error(error_string);
    }
    
}

//----------------------------------------------------------------------------//

var GU = new GameUtils();

function GameUtils()
{
    
    /**************************************************************************/
    this.check_login = function()
    {
        var re = /.*?pl_id=\d+?.*?/gmi;
        if(!re.test(document.cookie))
        {
            show_error(translations.errors.notAuthorised);
        }
    }
    
}

//----------------------------------------------------------------------------//

var CT = new CardsTracker();

function CardsTracker()
{
    
    var old_turn = 1;
    var cards_last_time_seen = {};
    var cards_last_time_seen_all = new Array(CARDS_NUM).fill(0); // [0, ..., 0]
    
    /**************************************************************************/
    this.add_card_after_action = function(turn, card_id)
    {
        cards_last_time_seen[turn] = card_id;
        old_turn = turn;
    }
    
    /**************************************************************************/
    this.update_tracker_cards = function(cards, current_turn)
    {
        for(let i = 0; i < cards.length; i++)
        {
            let card_id = cards[i];
            cards_last_time_seen_all[card_id] = current_turn;
        }
    }
    
    /**************************************************************************/
    this.init_tracker = function(cards)
    {
        // TODO
    }
    
}

//----------------------------------------------------------------------------//

var AU = new ArcomageUtils();

function ArcomageUtils()
{
    
    var game_infos = {
        game_id             : "",
        pl_id               : "",
        turn                : 0,
        time_left           : 0,
        time_passed         : 0,
        time_remain_turn    : 0,
        time_remain_total   : 0,
        host                : "",
        user_mode           : "", // viewer, player
        game_active         : false,
        max_tower           : 0,
        max_res             : 0,
        who_now             : -1,
        whose_last_turn     : 0, // 0=nobody, 1=player1, 2=player2 
        cooldown            : 45 // ceil[(102-(6+6))/2] = 45
    };
    
    var game_state = {
        "me" : {
            "ore"           : 0,
            "mana"          : 0,
            "stacks"        : 0,
            "mines"         : 0,
            "monasteries"   : 0,
            "barracks"      : 0,
            "tower"         : 0,
            "wall"          : 0,
            "cards"         : [],
            "cardsNum"      : 6,
            "arcNum"        : 0     // internal arcomage player ID: 1 or 2
        },
        "enemy" : {
            "ore"           : 0,
            "mana"          : 0,
            "stacks"        : 0,
            "mines"         : 0,
            "monasteries"   : 0,
            "barracks"      : 0,
            "tower"         : 0,
            "wall"          : 0,
            "cards"         : [],
            "cardsNum"      : 6,
            "arcNum"        : 0
        }
    };
    
    var map_player = {
        0 : "enemy",
        1 : "me"
    };
    
    var map_action = {
        "t" : "turn",
        "d" : "drop"
    };
    
    var map_user_mode = {
        0 : "viewer",
        1 : "player",
        2 : "player"
    };
    
    var last_card   = -1;
    var last_action = "none";
    var last_player = -1;
    
    var do_init = true;
    
    /**************************************************************************/
    this.is_game_active = function()
    {
        return game_infos.game_active;
    }
    
    /**************************************************************************/
    this.is_my_turn_now = function()
    {
        return game_infos.who_now === 1;
    }
    
    /**************************************************************************/
    this.get_my_cards = function()
    {
        return game_state["me"]["cards"];
    }
    
    /**************************************************************************/
    this.get_current_turn = function()
    {
        return game_infos.turn;
    }
    
    /**************************************************************************/
    this.get_cooldown = function()
    {
        return game_infos.cooldown;
    }
    
    /**************************************************************************/
    this.get_last_played_card = function()
    {
        return last_card;
    }
    
    /**************************************************************************/
    this.get_last_made_action = function()
    {
        return last_action;
    }
    
    /**************************************************************************/
    this.get_last_card_played_by_player = function()
    {
        if(game_state["me"]["arcNum"] === last_player)
        {
            return "me";
        }
        return "enemy";
    }
    
    /**************************************************************************/
    function get_card_action_position(input_string)
    {
        if(input_string !== "")
        {
            var splits   = input_string.split("-");
            var action   = map_action[splits[0].substring(0, 1)]; // d->drop, t->turn
            var card_id  = +(splits[0].substring(1, splits[0].length)); // d102 or t102
            var position = +splits[1];
            return [card_id, position, action];
        }
        return [-1, -1, "none"];
    }
    
    /***************************************************************************
     *
     * Compute cooldown value
     *
     **************************************************************************/
    function calc_cooldown()
    {
        var cards_both = game_state["me"]["cardsNum"] + game_state["enemy"]["cardsNum"];
        game_infos.cooldown = Math.ceil((CARDS_NUM - cards_both)/2);
    }
    
    /***************************************************************************
     *
     * Convert cards' string to array with integers
     *
     **************************************************************************/
    function cards_to_list(cards)
    {
        return cards.split("-").map(Number);
    }
    
    /***************************************************************************
     *
     * Collect infos from "cgame.php"
     *
     **************************************************************************/
    function get_game_infos()
    {
        
        var data = "";
        
        try
        {
            // [Case 1: fullscreen] try to find JS variable with flash parameters
            data = String(unsafeWindow.flashvars.params);
        }
        catch(err)
        {
            // [Case 2: AxB] try to get flash parameters from html
            try
            {
                data = document.getElementsByName("FlashVars")[0].getAttribute("value");
            }
            catch(err)
            {
                show_error(translations.errors.unableToReceiveData);
            }
        }
        if(data !== "")
        {
            var regex1 = /^width\|\d+\|gameid\|\d+\|soundon\|\d+\|chksum\|\d+\|lng\|\d+\|plid\|\d+\|$/g; // fullscreen
            var regex2 = /^params=gameid\|\d+\|soundon\|\d+\|chksum\|\d+\|lng\|\d+\|plid\|\d+\|$/g; // AxB
            
            if(regex1.test(data))
            {
                let infos = data.split("|");
                game_infos.game_id = infos[3];
                game_infos.pl_id   = infos[11];
            }
            else if(regex2.test(data))
            {
                let params = data.split("=")[1];
                let infos  = params.split("|");
                game_infos.game_id = infos[1];
                game_infos.pl_id   = infos[9];
            }
            else
            {
                show_error(translations.errors.wrongDataFormat);
            }
        }
        else
        {
            show_error(translations.errors.noGameData);
        }
    }
    
    /**************************************************************************/
    this.check_is_game_active = function()
    {
        if(game_infos.turn >= MAX_TURN)
        {
            game_infos.game_active = false;
        }
        else if(game_infos.time_left < 0)
        {
            game_infos.game_active = false;
        }
        else
        {
            game_infos.game_active = true;
        }
    }
    
    /***************************************************************************
     *
     * Parse response text which contains game state
     *
     **************************************************************************/
    this.update_game_state = function()
    {
        var url = game_infos.host + "cardsgame.php?" +
            "gameid=" + game_infos.game_id +
            "&pl_id=" + game_infos.pl_id;
        
        if(do_init)
        {
            url += "&action=getnicks";
        }
        
        var response_text = send_get(url);
        
        var splits = response_text.split("|");
        
        if(splits.length === 34)
        {
            // action=getnicks
            game_infos.max_tower = +splits[2];
            game_infos.max_res   = +splits[3];
            splits = splits.slice(5, 34);
        }
        if(splits.length === 29)
        {
            if(do_init)
            {
                if(+splits[2] !== 0)
                {
                    // player
                    game_infos.user_mode = "player";
                    game_state["me"]["arcNum"]    = +splits[2];
                    game_state["enemy"]["arcNum"] = (+splits[2] + 1) % 2;
                }
                else
                {
                    // viewer
                    game_infos.user_mode = "viewer";
                    game_state["me"]["arcNum"]    = 1; // choose arbitrarily
                    game_state["enemy"]["arcNum"] = 2; // choose arbitrarily
                }
            }
            
            game_infos.turn                    = +splits[0];
            game_infos.who_now                 = +splits[1];
            game_infos.time_left               = +splits[3];
            
            game_state["me"]["ore"]            = +splits[5];
            game_state["me"]["mana"]           = +splits[7];
            game_state["me"]["stacks"]         = +splits[9];
            game_state["me"]["mines"]          = +splits[11];
            game_state["me"]["monasteries"]    = +splits[13];
            game_state["me"]["barracks"]       = +splits[15];
            game_state["me"]["wall"]           = +splits[17];
            game_state["me"]["tower"]          = +splits[19];
            game_state["enemy"]["ore"]         = +splits[4];
            game_state["enemy"]["mana"]        = +splits[6];
            game_state["enemy"]["stacks"]      = +splits[8];
            game_state["enemy"]["mines"]       = +splits[10];
            game_state["enemy"]["monasteries"] = +splits[12];
            game_state["enemy"]["barracks"]    = +splits[14];
            game_state["enemy"]["wall"]        = +splits[16];
            game_state["enemy"]["tower"]       = +splits[18];
            game_state["me"]["cards"]          =  cards_to_list(splits[20]);
            // 21 -> 2 ??? 2
            // 22 -> 4 ??? 1
            
            var cap = get_card_action_position(splits[23]); // d10-2
            game_infos.whose_last_turn = +splits[24];
            
            last_card   = cap[0];
            last_action = cap[2];
            last_player = +splits[24];
            
            if(game_infos.whose_last_turn !== game_state["me"]["arcNum"] && cap[1] === 6 && game_state["enemy"]["cardsNum"] !== 7)
            {
                game_state["enemy"]["cardsNum"] = 7;
                calc_cooldown(); // update cooldown value
            }
            // 25 -> d10-   => last_used_stack_handler
            // 26 -> 0 ???
            // 27 -> 32641965 -> chatid
            /*
            6|7|
            5|6|
            5|5|
            72|38|
            52|48|
            76|46|
            0|35|
            29|39|
            14-61-31-71-23-6-75|
            2|4|
            d10-2|1|d10-|0|0|
            */
            
            // update number of my cards
            game_state["me"]["cardsNum"] = game_state["me"]["cards"].length;
            
            // check if game is still active
            this.check_is_game_active();
            
            do_init = false;
        }
        else
        {
            show_error(translations.errors.wrongParamsNumber);
        }
    }
    
    /**************************************************************************/
    this.init_game = function()
    {
        
        // get game ID + player ID
        get_game_infos();
        
        // get host
        game_infos.host = get_host();
        
        // get all informations about the game and update internal game state
        this.update_game_state();
    }
    
}

//----------------------------------------------------------------------------//

var ADU = new ArcomageDrawUtils();

function ArcomageDrawUtils()
{
    var tracker_queue = [];
    
    var map_player_symbol = {
        "me"    : "&#9632;",
        "enemy" : "&#9651;"
    };
    
    /***************************************************************************
     *
     * Create Main Nodes
     *
     **************************************************************************/
    
    /**************************************************************************/
    function create_companion_nodes()
    {
        document.getElementsByTagName("style")[0].outerHTML = ""; // remove old styles
        document.getElementsByTagName("html")[0].setAttribute("style", "overflow: auto; height: 100%;");
        document.getElementsByTagName("body")[0].setAttribute("style", "height: 100%; padding: 0px; margin: 0px;");
        
        var newHtmlStyle = document.createElement('style');
        newHtmlStyle.innerHTML = HEADER_CSS;
        document.head.appendChild(newHtmlStyle);
        
        var div = document.createElement('div');
        div.id = "arcomageCompanion";
        div.innerHTML = `
          <!-- Settings + Infos -->
          <div id="arcSettings" class="arcFrame-topFrame"></div>
          
          <!-- Flash -->
          <div id="flashArcomage" class="arcFrame-flash"></div>
          
          <!-- Tracker -->
          <div id="arcTracker" class="arcFrame-tracker"><table id="cardsTracker"></table></div>
        `;
        document.body.appendChild(div);
    }
    
    /***************************************************************************
     *
     * Resize and Move Flash
     *
     **************************************************************************/
    
    /**************************************************************************/
    function resize_and_move_flash()
    {
        try
        {
            // [Case 1: fullscreen]
            var _arcomage = document.getElementById("arcomage");
            _arcomage.setAttribute("width", FLASH_WIDTH);
            _arcomage.setAttribute("width", FLASH_WIDTH);
            _arcomage.setAttribute("style", FLASH_CSS);
            
            document.getElementById("flashArcomage").appendChild(_arcomage);
        }
        catch(err)
        {
            try
            {
                // [Case 2: AxB]
                var _object = document.getElementsByTagName("object")[0];
                
                _object.setAttribute("width", FLASH_WIDTH); // name=arcomag
                _object.setAttribute("height", FLASH_HEIGHT); // name=arcomag
                _object.removeAttribute("align");
                _object.setAttribute("style", FLASH_CSS);
                
                
                document.getElementById("flashArcomage").appendChild(_object);
                try
                {
                    // remove "a": >>Вернуться в игру<<
                    var _p = document.getElementsByTagName("p")[0];
                    _p.getElementsByTagName("a")[0].outerHTML = "";
                }
                catch(err)
                {}
                // remove "wrapper"
                document.getElementById("wrapper").outerHTML = "";
            }
            catch(err)
            {
                show_error(translations.errors.resizeMoveFlash);
            }
        }
    }
    
    /***************************************************************************
     *
     * Cards Tracker Frame
     *
     **************************************************************************/
    
    /**************************************************************************/
    function tracker_add_card(card_id, turn_num, player, action)
    {
        var table = document.getElementById("cardsTracker");
        var row = table.insertRow(0);
        row.id = "trackedCardID-" + card_id + "-" + turn_num;
        
        var cell = row.insertCell(0);
        cell.className = "card-"+cards[card_id].color+"-"+player;
        var turnClass = "tracker-turn";
        if(action === "drop")
        {
            turnClass = "tracker-turn cross";
        }
        cell.innerHTML = `
          <span class="`+turnClass+`">`+turn_num+`</span>
          <div class="tracker-text tooltip">
           `+map_player_symbol[player]+" "+cards[card_id].name+`
           <div class="tooltiptext">
            <p>`+translations.costs+": "+cards[card_id].costs+`</p>
            <p>`+cards[card_id].text+`</p>
           </div>
          </div>
        `;
    }
    
    /**************************************************************************/
    function tracker_remove_card(card_id, turn_num)
    {
        try
        {
            document.getElementById("trackedCardID-" + card_id + "-" + turn_num).outerHTML = "";
        }
        catch(err)
        {
            show_error(translations.errors.removeCardTracker);
        }
    }
    
    /**************************************************************************/
    this.update_tracker_frame = function(card_id, turn_num, player, action)
    {
        if(tracker_queue.length === TRACKER_SHOW_CARDS)
        {
            var data = tracker_queue.shift(); // remove first card
            tracker_remove_card(data[0], data[1]); // remove from frame
        }
        tracker_queue.push([card_id, turn_num, player, action]); // add new one to the queue
        tracker_add_card(card_id, turn_num, player, action); // show new card on top
    }
    
    /**************************************************************************/
    function show_usermode()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_card_info()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_errors()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_timers()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_current_turn()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_position_stats()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_game_dynamics()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_enemys_cards_prediction()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_cards_scoring()
    {
        // TODO
    }
    
    /**************************************************************************/
    function show_script_settings()
    {
        // TODO
    }
    
    /***************************************************************************
     *
     * Initial Draw
     *
     **************************************************************************/
    
    /**************************************************************************/
    this.init_draw = function()
    {
        // Create nodes
        create_companion_nodes();
        
        // Resize flash element
        resize_and_move_flash();
    }
    
}

//----------------------------------------------------------------------------//
/*
 * Main
 */

var sleep      = SU.sleep;      // function
var show_error = SU.show_error; // function
var send_get   = SU.send_get;   // function
var get_host   = SU.get_host;   // function
var cards      = CARDS.cards;   // variable
var translations = TRANSLATION.TranslatedTexts; // dictionary

async function ArcomageCompanion(){
    
    GU.check_login(); // is user logged in?
    AU.init_game();   // collect initial data
    ADU.init_draw();  // draw interface
    
    var myCards = AU.get_my_cards();
    CT.init_tracker(myCards); // start tracker
    
    var last_turn = -1;
    var is_game_active = true;
    
    // main loop
    while(is_game_active)
    {
        AU.update_game_state();
        
        var current_turn = AU.get_current_turn();
        is_game_active = AU.is_game_active();
        
        if(current_turn > last_turn)
        {
            var card_id = AU.get_last_played_card();
            if(card_id !== -1)
            {
                var _turn   = current_turn-1;
                var _action = AU.get_last_made_action();
                var _player = AU.get_last_card_played_by_player();
                ADU.update_tracker_frame(card_id, _turn, _player, _action);
            }
            last_turn = current_turn;
        }
        
        await sleep(UPDATE_REQUESTS_INTERVAL_TIMER);
    }
}

ArcomageCompanion();

//----------------------------------------------------------------------------//

})();

//----------------------------------------------------------------------------//