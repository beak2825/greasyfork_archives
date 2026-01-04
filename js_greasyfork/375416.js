// ==UserScript==
// @name         Kittens Game Helper
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Kittens Game Helper Test Version
// @author       Stanislav A. Namestnikov
// @include      http://bloodrizer.ru/games/kittens/
// @match        http://bloodrizer.ru/games/kittens/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @ require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/375416/Kittens%20Game%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375416/Kittens%20Game%20Helper.meta.js
// ==/UserScript==

/* TODO:
Чего хочется:
1) Автоотправка охотников (тут есть варианты, отправлять сразу как накопилась 1 пачка, отправлять всех, когда накопился максимум, отправлять по 1 пачке, когда накопился максимум)
2) Кнопку для установки на паузу автостройки или возможность регулировать остаток на складе
3) Автоконвертация ресов (а) при излишках, б) полностью, в) возможность тюнинга)
4) Переделать, чтобы работало через 1 таймер + насткойки

Как вариант, для автостроийки выбрать только тот список зданий, которые есть у игрока.
+ Отсортировать их по алфавиту
Проверять не появились ли новые по таймеру.

*/

(function () {
    'use strict';

    var $ = jQuery;

    ///// ВОТ ТУТ СКРИПТ СОБСТВЕННО

    setTimeout(function () {
        //alert('SkTest');
        kh_init();
        //_Log.println('Trimps BOT version ' + _GameHelpers.getBotVersion());
        //_BotUI.init();
        //_BotStrategy.stop(); // start passive watcher
    }, 1000);

})();

// TODO: btn_id не нужен. Если брать названия из игры, то останутся вообще только building_type
// TODO: Можно попробовать сформировать по buildingGroups из исходников
const kh_autobuild_settings = [
    // food
    {'building_type': 'field', 'name': 'Мятное поле'},
    {'building_type': 'pasture', 'name': 'Пастбище'},
    {'building_type': 'aqueduct', 'name': 'Акведук'},

    {'building_type': 'hut', 'name': 'Хижина'},
    {'building_type': 'logHouse', 'name': 'Домик'},
    {'building_type': 'mansion', 'name': 'mansion'},


    {'building_type': 'unicornPasture', 'btn_id': 'kh_auto_buy_unicorn_pasture', 'name': 'Пастбище единорогов'},
    {'building_type': 'library', 'name': 'Библиотека' },
    {'building_type': 'mine', 'name': 'Шахта'},
    {'building_type': 'workshop', 'name': 'Мастерская'},
    {'building_type': 'barn', 'name': 'Амбар'}
];

var log_window = null;

var kh_autobuild_iterators = {}
var kh_other_iterators = {}

// **************************************************************************************
// Дополнительные ф-ции

// sleep time expects milliseconds
var sleep = function(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// **************************************************************************************
// Блок работы с логом

var to_log = function(str) {
    log_window_open();
    jQuery(log_window.document.body).append('<br>' + str);
}

var log_window_open = function() {
    if (!log_window || !log_window.open) {
        //alert("log_window: " + log_window);
        log_window = window.open('', 'kh_log', '');
        sleep(1000); // Задержку ставим, чтобы окно успело открыться
        log_window.document.title = 'Kittens Helper log';
        log_window.document.write('<br/><b>Log</b>');
    }
}

// **************************************************************************************
// Блок с кнопками
const kh_div_beg = `
<div id='kh'>
<br/><input type="button" value="Собрать мяту 100 раз" id="kh_gather_catnip">
<br/><input type="button" value="Сброс лога" id="kh_clear_log">
<br/><input type="button" value="Статус" id="kh_status">
<br/>

`;
const kh_div_end = `</div>`;

/* Вариант через установку таймера каждый раз
var F = function() { /* тут код * / }, c = 0;
var Starter = function () {
    c++;
    if (c <= 10) setTimeout(Starter, 1000);
};
setTimeout(Starter, 1000);
*/

// **************************************************************************************
// Блок с кнопками

var kh_gather_catnip_iterator = null;
var kh_gather_catnip_started = false;
var kh_gather_catnip_counter = 0;
var kh_gather_catnip_delay = 100; // ms
var kh_gather_catnip_max = 100; // Количество кликов по кнопке собрать мяту

var kh_gather_catnip_click = function () {
    var btn = $('.bldGroupContainer').find('div.btnContent').find('span').filter(function(){
        return $(this).text().indexOf("Собрать мяты") === 0;
    });
    if (btn) {
        btn.click();
    } else {
        to_log('Gather cantip button_not_found');
        kh_gather_catnip_counter = kh_gather_catnip_max;
    }
    kh_gather_catnip_counter++;
    if (kh_gather_catnip_counter > kh_gather_catnip_max) {
        clearInterval(kh_gather_catnip_iterator);
        kh_gather_catnip_started = false;
        to_log('Gather cantip stop.')
    }
}

var kh_gather_catnip_100_start = function() {
    to_log('Gather cantip start.');
    kh_gather_catnip_counter = 0;
    if (kh_gather_catnip_started) {
    } else {
        kh_gather_catnip_iterator = setInterval(kh_gather_catnip_click, kh_gather_catnip_delay);
    }
}

// ****************************************************************************


var _canBuy = function(bldName) {
    var prices = game.bld.getPrices(bldName);
    for (var x in prices) {
        if (prices.hasOwnProperty(x)) {
            if (prices[x].val > game.resPool.get(prices[x].name).value) {
                return false;
            }
        }
    }
    return true;
};

var _makeABuy = function(itemName) {
    var btn = $('.bldGroupContainer').find('div.btnContent').find('span').filter(function() {
        var t = $(this).text();
        return t.indexOf(itemName + " (") === 0 || t === itemName;
    });

    if (btn && btn.length == 1) {
        to_log('Autobuy ' + itemName);
        btn.click();
    }
};

var _autoBuyItem = function(bldName) {
    var bld = game.bld.get(bldName);

    if (bld.unlocked && _canBuy(bldName)) {
        var itemName = bld.stages && bld.stages.length > 0 ? bld.stages[bld.stage].label : bld.label;
        _makeABuy(itemName);
    }
};

// ****************************************************************************
var kh_is_autobuild_active = function(building_type) {
    return !!kh_autobuild_iterators[building_type];
}
/* // Устарело
var kh_auto_buy_on_click = function(building_type, name) {
    var iterator;
    var btn_id;

    if (!(building_type in kh_autobuild_iterators)) {
        kh_autobuild_iterators[building_type] = null;
    }
    iterator = kh_autobuild_iterators[building_type];

    if (iterator) {
        // Autobuy stop
        to_log('Autobuy ' + building_type + ' stop.')
        clearInterval(iterator);
        iterator = null;
    } else {
        // Autobuy field start
        to_log('Autobuy ' + building_type + ' start.')
        iterator = setInterval(() => _autoBuyItem(building_type), 1000);
    }
    kh_autobuild_iterators[building_type] = iterator;

    btn_id = kh_btn_id(building_type);
    kh_auto_buy_change_button(btn_id, name, iterator)

    return iterator;
}

var kh_auto_buy_change_button = function(btn_id, name, status) {
    var btn = $('#'+btn_id);
    if (status) {
        btn.prop('value', 'Автопокупка ' + name + ' включена');
    } else {
        btn.prop('value', 'Автопокупка ' + name + ' выключена');
    }
}
*/


// ****************************************************************************
var kh_clear_log_click = function() {
    log_window_open();
    jQuery(log_window.document.body).html('<br><b>Log:</b>');
}


var kh_status = function() {
    var status = '<b>Статус:</b>';
    //var kh_autobuild_iterators
    //field, pasture, unicornPasture
    var arrayLength = kh_autobuild_settings.length;
    var on_off;

    on_off = !!kh_other_iterators['astronomy'];
    status += '<br/>Автоклик по астрономическим событиям ';
    status += on_off ? ' <span style="color:green">включен</span>' : ' <span style="color:red">выключен</span>';

    for (var i = 0; i < arrayLength; i++) {
        on_off = kh_is_autobuild_active(kh_autobuild_settings[i].building_type);
        status += '<br/>Автопостройка ' + kh_autobuild_settings[i].name;
        status += on_off ? ' <span style="color:green">включена</span>' : ' <span style="color:red">выключена</span>';
    }

    to_log(status);
}
// ****************************************************************************
// Цельнотянуто у Антона
var _getAstronomy = function() {
    if (game.calendar.observeRemainingTime > 0) {
        if (typeof game.calendar.observeHandler === 'function') {
            to_log('Астрономия!');
            game.calendar.observeHandler();
        }
    }
};

var kh_astronomy_on = function() {
    var iterator = kh_other_iterators['astronomy'];
    if (!iterator) {
        to_log('Автоклик по астрономическим событиям <span style="color:green">запущен</span>.');
        kh_other_iterators['astronomy'] = setInterval(() => _getAstronomy(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_astronomy_on').css('background-color', 'green');
    $('#kh_astronomy_off').css('background-color', '');
    return true;
}

var kh_astronomy_off = function() {
    if (kh_other_iterators['astronomy']) {
        to_log('Автоклик по астрономическим событиям <span style="color:red">остановлен</span>.');
        clearInterval(kh_other_iterators['astronomy']);
        kh_other_iterators['astronomy'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_astronomy_on').css('background-color', '');
    $('#kh_astronomy_off').css('background-color', 'red');
    return false;
}

var kh_astronomy_change = function() {
    if (kh_other_iterators['astronomy']) {
        kh_astronomy_off();
    } else {
        kh_astronomy_on();
    }
    return kh_other_iterators['astronomy'];
}

// ****************************************************************************
var kh_hunt_max_on = function() {
    var iterator = kh_other_iterators['hunt_max'];
    if (!iterator) {
        to_log('Автоотправка охотников <span style="color:green">включена</span>.');
        kh_other_iterators['hunt_max'] = setInterval(() => kh_send_all_hunters(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_hunt_max_on').css('background-color', 'green');
    $('#kh_hunt_max_off').css('background-color', '');
    return true;
}

var kh_hunt_max_off = function() {
    if (kh_other_iterators['hunt_max']) {
        to_log('Автоотправка охотников <span style="color:red">остановлена</span>.');
        clearInterval(kh_other_iterators['hunt_max']);
        kh_other_iterators['hunt_max'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_hunt_max_on').css('background-color', '');
    $('#kh_hunt_max_off').css('background-color', 'red');
    return false;
}

var kh_hunt_max_change = function() {
    if (kh_other_iterators['hunt_max']) {
        kh_hunt_max_off();
    } else {
        kh_hunt_max_on();
    }
    return kh_other_iterators['hunt_max'];
}
// ****************************************************************************
var kh_catnip_to_wood_on = function() {
    if (!kh_other_iterators['catnip_to_wood']) {
        to_log('catnip_to_wood <span style="color:green">включено</span>.');
        kh_other_iterators['catnip_to_wood'] = setInterval(() => catnipToWood(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_catnip_to_wood_on').css('background-color', 'green');
    $('#kh_catnip_to_wood_off').css('background-color', '');
    return true;
}

var kh_catnip_to_wood_off = function() {
    if (kh_other_iterators['catnip_to_wood']) {
        to_log('catnip_to_wood <span style="color:red">остановлена</span>.');
        clearInterval(kh_other_iterators['catnip_to_wood']);
        kh_other_iterators['catnip_to_wood'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_catnip_to_wood_on').css('background-color', '');
    $('#kh_catnip_to_wood_off').css('background-color', 'red');
    return false;
}

var kh_catnip_to_wood_change = function() {
    if (kh_other_iterators['catnip_to_wood']) {
        kh_catnip_to_wood_off();
    } else {
        kh_catnip_to_wood_on();
    }
    return kh_other_iterators['catnip_to_wood'];
}
// ****************************************************************************
var kh_wood_to_beam_on = function() {
    if (!kh_other_iterators['wood_to_beam']) {
        to_log('wood_to_beam <span style="color:green">включено</span>.');
        kh_other_iterators['wood_to_beam'] = setInterval(() => woodToBeams(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_wood_to_beam_on').css('background-color', 'green');
    $('#kh_wood_to_beam_off').css('background-color', '');
    return true;
}

var kh_wood_to_beam_off = function() {
    if (kh_other_iterators['wood_to_beam']) {
        to_log('wood_to_beam <span style="color:red">остановлена</span>.');
        clearInterval(kh_other_iterators['wood_to_beam']);
        kh_other_iterators['wood_to_beam'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_wood_to_beam_on').css('background-color', '');
    $('#kh_wood_to_beam_off').css('background-color', 'red');
    return false;
}

var kh_wood_to_beam_change = function() {
    if (kh_other_iterators['wood_to_beam']) {
        kh_wood_to_beam_off();
    } else {
        kh_wood_to_beam_on();
    }
    return kh_other_iterators['wood_to_beam'];
}

// ****************************************************************************
var kh_minerals_to_slabs_on = function() {
    if (!kh_other_iterators['minerals_to_slabs']) {
        to_log('minerals_to_slabs <span style="color:green">включено</span>.');
        kh_other_iterators['minerals_to_slabs'] = setInterval(() => mineralsToSlabs(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_minerals_to_slabs_on').css('background-color', 'green');
    $('#kh_minerals_to_slabs_off').css('background-color', '');
    return true;
}

var kh_minerals_to_slabs_off = function() {
    if (kh_other_iterators['minerals_to_slabs']) {
        to_log('minerals_to_slabs <span style="color:red">остановлена</span>.');
        clearInterval(kh_other_iterators['minerals_to_slabs']);
        kh_other_iterators['minerals_to_slabs'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_minerals_to_slabs_on').css('background-color', '');
    $('#kh_minerals_to_slabs_off').css('background-color', 'red');
    return false;
}

var kh_minerals_to_slabs_change = function() {
    if (kh_other_iterators['minerals_to_slabs']) {
        kh_minerals_to_slabs_off();
    } else {
        kh_minerals_to_slabs_on();
    }
    return kh_other_iterators['minerals_to_slabs'];
}// ****************************************************************************
var kh_iron_to_plates_on = function() {
    if (!kh_other_iterators['iron_to_plates']) {
        to_log('iron_to_plates <span style="color:green">включено</span>.');
        kh_other_iterators['iron_to_plates'] = setInterval(() => ironToPlates(), 1000);
    }
    // TODO. Вынести отдельно
    $('#kh_iron_to_plates_on').css('background-color', 'green');
    $('#kh_iron_to_plates_off').css('background-color', '');
    return true;
}

var kh_iron_to_plates_off = function() {
    if (kh_other_iterators['iron_to_plates']) {
        to_log('iron_to_plates <span style="color:red">остановлена</span>.');
        clearInterval(kh_other_iterators['iron_to_plates']);
        kh_other_iterators['minerals_iron_to_platesto_slabs'] = null;
    }
    // TODO. Вынести отдельно
    $('#kh_iron_to_plates_on').css('background-color', '');
    $('#kh_iron_to_plates_off').css('background-color', 'red');
    return false;
}

var kh_iron_to_plates_change = function() {
    if (kh_other_iterators['iron_to_plates']) {
        kh_iron_to_plates_off();
    } else {
        kh_iron_to_plates_on();
    }
    return kh_other_iterators['iron_to_plates'];
}

/*
*/
// ****************************************************************************


var building_text = function(building_type) {
    var bld = game.bld.get(building_type);
    return bld.stages && bld.stages.length > 0 ? bld.stages[bld.stage].label : bld.label;
}

var kh_btn_id = function(building_type, postfix = '') {
    return 'kh_autobuild_' + building_type + postfix;
}

var kh_autobuild_on_click = function(building_type) {
    var iterator;
    var btn_id;
    var name = building_text(building_type);

    iterator = kh_autobuild_iterators[building_type];
    if (iterator) {
        // Autobuy stop
        to_log('Автопостройка ' + name + ' <span style="color: red">выключена</span>.')
        clearInterval(iterator);
        iterator = null;
    } else {
        // Autobuy field start
        to_log('Автопостройка ' + name + ' <span style="color: green">включена</span>.')
        iterator = setInterval(() => _autoBuyItem(building_type), 1000);
    }
    kh_autobuild_iterators[building_type] = iterator;

    btn_id = kh_btn_id(building_type);
    //kh_auto_buy_change_button(btn_id, name, iterator); // TODO: убрать после перехода на новый дизайн.
    kh_autobuild_change_button(building_type, iterator);

    return iterator;
}

var kh_autobuild_change_button = function(building_type, status) {
    var btn_on = $('#' + kh_btn_id(building_type, '_on'));
    var btn_off = $('#' + kh_btn_id(building_type, '_off'));

    if (status) {
        btn_on.css('background-color', 'green');
        btn_off.css('background-color', '');
    } else {
        btn_on.css('background-color', '');
        btn_off.css('background-color', "red");
    }
}

// Дадим доступ к ф-циям из onClick
unsafeWindow.kh_autobuild_on_click = kh_autobuild_on_click;

/**
* Генерирует блок с настройками для автобилдинга с разбиением по группам
*/
var kh_prepare_autobuild_buttons = function() {
    var result = '<br/><b>Автостройка</b><br/>';
    var bg = game.bld.buildingGroups;
    var len = bg.length;
    var i, j, bg_len;
    var btype, name;
    result += '<table border="0">'
    for (i = 0; i < len; i++) {
        result += '<tr><td colspan="3"><i>';
        result += bg[i].title;
        result += '</i></td></tr>';
        bg_len = bg[i].buildings.length;
        for (j = 0; j < bg_len; j++) {
            btype = bg[i].buildings[j];
            name = building_text(btype);
            result += '<tr onClick="kh_autobuild_on_click(\'' + btype + '\')"><td>';
            result += (name ? name : btype);
            result += '<td id="' + kh_btn_id(btype, '_on') + '">вкл</td>';
            result += '<td id="' + kh_btn_id(btype, '_off') + '">выкл</td>';
            result += '</td></tr>';
        }
    }
    result += '</table>';
    return result;
}

/**
* Генерирует блок с настройками для автобилдинга с сортировкой по алфавиту
*/
var kh_prepare_autobuild_buttons_v2 = function() {
    var result = '<br/><b>Автостройка</b><br/>';
    var bg = game.bld.buildingGroups;
    var len = bg.length;
    var i, j, bg_len;
    var btype, name;
    var hash = {};
    var keys = [];
    result += '<table border="0">'
    for (i = 0; i < len; i++) {
        bg_len = bg[i].buildings.length;
        for (j = 0; j < bg_len; j++) {
            btype = bg[i].buildings[j];
            name = building_text(btype);
            hash[name] = btype;
            keys.push(name);
        }
    }

    keys.sort();
    len = keys.length;
    for (i = 0; i < len; i++) {
        name = keys[i];
        btype = hash[name];
        result += '<tr onClick="kh_autobuild_on_click(\'' + btype + '\')"><td>';
        result += (name ? name : btype);
        result += '<td id="' + kh_btn_id(btype, '_on') + '">вкл</td>';
        result += '<td id="' + kh_btn_id(btype, '_off') + '">выкл</td>';
        result += '</td></tr>';
    }

    result += '</table>';
    return result;
}

// TODO: НАдо их упаковать в класс и вызывать через него
// Дадим доступ к ф-циям из onClick
unsafeWindow.kh_astronomy_change = kh_astronomy_change;
unsafeWindow.kh_astronomy_on = kh_astronomy_on;
unsafeWindow.kh_astronomy_off = kh_astronomy_off;
unsafeWindow.kh_hunt_max_change = kh_hunt_max_change;
unsafeWindow.kh_hunt_max_on = kh_hunt_max_on;
unsafeWindow.kh_hunt_max_off = kh_hunt_max_off;
unsafeWindow.kh_catnip_to_wood_change = kh_catnip_to_wood_change;
unsafeWindow.kh_catnip_to_wood_on = kh_catnip_to_wood_on;
unsafeWindow.kh_catnip_to_wood_off = kh_catnip_to_wood_off;
unsafeWindow.kh_wood_to_beam_change = kh_wood_to_beam_change;
unsafeWindow.kh_wood_to_beam_on = kh_wood_to_beam_on;
unsafeWindow.kh_wood_to_beam_off = kh_wood_to_beam_off;
unsafeWindow.kh_minerals_to_slabs_change = kh_minerals_to_slabs_change;
unsafeWindow.kh_minerals_to_slabs_on = kh_minerals_to_slabs_on;
unsafeWindow.kh_minerals_to_slabs_off = kh_minerals_to_slabs_off;
unsafeWindow.kh_iron_to_plates_change = kh_iron_to_plates_change;
unsafeWindow.kh_iron_to_plates_on = kh_iron_to_plates_on;
unsafeWindow.kh_iron_to_plates_off = kh_iron_to_plates_off;



/**
* генерируем блок дополнительных кнопок
* пока только:
*   астрономия
*   котосила в свитки - при максимуме котосилы отправляет ВСЕХ хантеров и перекручивает результат в свитки
*   лес в балки - при максимуме леса перекручивает часть леса в балки
*   мята в лес - при максимуме мяты перекручивает часть в лес
*/
var kh_prepare_other_buttons = function() {
    var result = '';
    result += '<table border="0">';
    result += `<tr>
                 <td onClick="kh_astronomy_change()">Астрономия</td>
                 <td id='kh_astronomy_on' onClick="kh_astronomy_on()">вкл</td>
                 <td id='kh_astronomy_off' onClick="kh_astronomy_off()">выкл</td>
               </tr>
               <tr>
                 <td onClick="kh_hunt_max_change()">Котосила в свитки</td>
                 <td id='kh_hunt_max_on' onClick="kh_hunt_max_on()">вкл</td>
                 <td id='kh_hunt_max_off' onClick="kh_hunt_max_off()">выкл</td>
               </td>
               <tr>
                 <td onClick="kh_catnip_to_wood_change()">Мята в лес</td>
                 <td id='kh_catnip_to_wood_on' onClick="kh_catnip_to_wood_on()">вкл</td>
                 <td id='kh_catnip_to_wood_off' onClick="kh_catnip_to_wood_off()">выкл</td>
               </td>
               <tr>
                 <td onClick="kh_wood_to_beam_change()">Лес в балки</td>
                 <td id='kh_wood_to_beam_on' onClick="kh_wood_to_beam_on()">вкл</td>
                 <td id='kh_wood_to_beam_off' onClick="kh_wood_to_beam_off()">выкл</td>
               </td>
               <tr>
                 <td onClick="kh_minerals_to_slabs_change()">Минералы в плиты</td>
                 <td id='kh_minerals_to_slabs_on' onClick="kh_minerals_to_slabs_on()">вкл</td>
                 <td id='kh_minerals_to_slabs_off' onClick="kh_minerals_to_slabs_off()">выкл</td>
               </td>
               <tr>
                 <td onClick="kh_iron_to_plates_change()">Железо в пластины</td>
                 <td id='kh_iron_to_plates_on' onClick="kh_iron_to_plates_on()">вкл</td>
                 <td id='kh_iron_to_plates_off' onClick="kh_iron_to_plates_off()">выкл</td>
               </td>
    `;
    result += '<table>';
    return result;
}

var _isResourceUnlocked = function(res) {
    return game.resPool.get(res).unlocked;
};

var isResourceUnlocked = _isResourceUnlocked;

var craftAll = function(res) {
    if (_isResourceUnlocked(res)) {
        to_log("Crafting " + res);
        game.craftAll(res);
    }
};

var kh_send_1_hunters = function() {
    var manpower = game.resPool.get("manpower");
    if (manpower.value >= manpower.maxValue) {
        to_log('send_1_hunters');
        game.village.huntMultiple(1);
    }
}

var kh_send_all_hunters = function() {
    var manpower = game.resPool.get("manpower");
    if (manpower.value >= manpower.maxValue) {
        to_log('kh_send_all_hunters');
        game.village.huntAll();
        craftAll('parchment');
    }
}

var getMinCraft = function(res, percent=2) {
    // craft no more than 2% of possible craft
    var allCount = game.workshop.getCraftAllCount(res);
    var ratioCount = Math.floor(allCount*0.01*percent);
    return ratioCount < 1 ? 1 : ratioCount;
}

var woodToBeams = function() {
    var wood = game.resPool.get("wood");
    if (wood.value >= wood.maxValue && _isResourceUnlocked('beam')) {
        var minVal = getMinCraft('beam');
        to_log('Wood to Beam x ' + minVal);
        game.craft('beam', minVal);
    }
}

var catnipToWood = function() {
    var catnip = game.resPool.get("catnip");
    if (catnip.value >= catnip.maxValue && _isResourceUnlocked('wood')) {
        var minVal = getMinCraft('wood', 20); // Перекручиваем 20%
        to_log('catnip to wood x ' + minVal);
        game.craft('wood', minVal);
    }
}

var mineralsToSlabs = function() {
    var minerals = game.resPool.get("minerals");
    if (minerals.value >= minerals.maxValue && _isResourceUnlocked('slab')) {
        var minVal = getMinCraft('slab');
        to_log('Minerals to Slab x ' + minVal);
        game.craft('slab', minVal);
    }
}

var ironToPlates = function() {
            var iron = game.resPool.get("iron");
            //var minPlate = getMinCraft('plate');
            //if (iron.value >= (125 * minPlate) && isResourceUnlocked('plate')) {
            if (iron.value >= iron.maxValue && _isResourceUnlocked('plate')) {
                var minVal = getMinCraft('slab');
                to_log('Iron to Plate x ' + minVal);
                game.craft('plate', minVal);
            }
}

var kh_init = function() {
    // TODO: Автосбор метеоритов (есть у Антона)
    // TODO: Автогенерация кнопок для стройки и общая ф-ция для неё.
    // game.bld.buildingsData  -это строения
    //for (x in game.bld.buildingsData) if (game.bld.buildingsData[x].unlocked) console.log(game.bld.buildingsData[x].label);

    var div = kh_div_beg;

    // Добавим астрономию
    div += kh_prepare_other_buttons();
    // Добавим таблицу с автобилдом
    div += kh_prepare_autobuild_buttons_v2();
    div += kh_div_end;

    //$('#rightTabLog').prepend(div);
    //$('#rightTabLog').css('overflow', 'scroll').css('height', '80vh');
    $('#rightTabChat').html(div);
    $('#kh').css('overflow', 'scroll').css('height', '80vh');

    $('#kh_clear_log').click(kh_clear_log_click);
    $('#kh_status').click(kh_status);

    $('#kh_gather_catnip').click(kh_gather_catnip_100_start);
    //$('#kh_astronomy').click(kh_astronomy_click);

    /*
    // Реакция на кнопки автобилда
    for (i = 0; i < arrayLength; i++) {
        building_type = kh_autobuild_settings[i].building_type;
        btn_id = kh_btn_id(building_type);
        name = kh_autobuild_settings[i].name;
        $('#' + btn_id).on('click', {'building_type': building_type, 'name': name}, function(event) {
            kh_auto_buy_on_click(event.data.building_type, event.data.name);
        });
    }
    */
    // TODO: вынести отдельно
    // Запустим часть
    kh_astronomy_on();
    kh_hunt_max_on();
    kh_catnip_to_wood_on();
    kh_wood_to_beam_on();
    kh_minerals_to_slabs_on();
    kh_iron_to_plates_on();
    kh_autobuild_on_click('field');
    kh_autobuild_on_click('unicornPasture');
}