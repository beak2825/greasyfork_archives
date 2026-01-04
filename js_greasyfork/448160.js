// ==UserScript==
// @name         NPC - AiO #2 Pink
// @namespace    https://greasyfork.org/en/users/798613
// @version      2.0.16
// @description  Timers, Helpful Links, Reminders and QOL stuff
// @author       Mandi (mandanarchi)
// @match        https://neopetsclassic.com/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448160/NPC%20-%20AiO%202%20Pink.user.js
// @updateURL https://update.greasyfork.org/scripts/448160/NPC%20-%20AiO%202%20Pink.meta.js
// ==/UserScript==

/* globals $ */

// what event is active? false if none
const EVENT_ACTIVE = 'FestivalofNeggs';
//const EVENT_ACTIVE = false;

// Event List
let events = {
    'FestivalofNeggs': { pouch: true, shop: {url:'/events/negg_festival/shop/', img: '/images/events/neggfest/negg_token_silver.gif'}}
};


// these are the keys storing the settings and data; don't change them!
const SETTINGS_STORAGE_ID = 'MandiAIOSettings==',
      DATA_STORAGE_ID = 'MandiAIOData==';

// get the current page since we use this a lot
const CURRENT_PAGE = window.location.pathname;

// decide if using 2004 theme or not
const THEME2004 = $('img[src*="/04/"]').length > 0 ? true : false;

const DEFAULT_MISC_LINKS = {'/winter/brokentoys/':'/images/avatars/brokentoy.gif',
                            '/faerieland/hiddentower/':'/images/items/450.gif',
                            '/winter/icecream/':'/images/items/icecream_coupon1.gif',
                            '/quests/' : '/images/items/toy_faerie_princess.gif',
                            '/pound/transfer/' : '/images/pets/Kiko/80by80/kiko_robot_happy.gif',
                            '/safetydeposit/' : '/images/items/4007.gif'};

// get/set the local storage
// Set a bunch of defaults so it works 'out of the box'
let settings_storage = localStorage.getItem(SETTINGS_STORAGE_ID) != null ? JSON.parse(localStorage.getItem(SETTINGS_STORAGE_ID)) : {d:4, t:3, s:5, tr:2, f:99, re:1, red:10, amb:10, rs:1, m:7, seq:'t', shopdisplay:'i', hide_shops:'', wwnp:'', wwitem:''};
let data_storage = localStorage.getItem(DATA_STORAGE_ID) != null ? JSON.parse(localStorage.getItem(DATA_STORAGE_ID)) : {d:{jobs:[]}, t:{sf:0, sfCount:0}, f:{}, tr:{ sa:{}, mi:{} }, misc:DEFAULT_MISC_LINKS};

// Get search parameters incase needed, i.e for Job#
let searchParams = new URLSearchParams(window.location.search);

// update storage times here :)
updateStorageTimes();

// This just so we don't bother doing things on pages without the timer!
if ($('#nst').length == 0) return;

// Grabs the NST time so we can set any timers or whatnot based on the page
let now = new Date(),
    nstHours = parseInt( $('#NST_clock_hours').text() ),
    nstMins = parseInt( $('#NST_clock_minutes').text() ),
    nstSecs = parseInt( $('#NST_clock_seconds').text() ),
    nstAmPm = $('#nst').text().substr( $('#nst').text().indexOf('M')-1, 2 ),
    nstTitle = $('#nst').attr('title').split(':');

// Do the QOL things
addQolStuff();

// update the restock/kad/job times based on the NST clock
updateRsKadJobTimes();

// run all the fun bits when the page has loaded
(function() {
    'use strict';

    // Set up a container to hold all the wonderful magicness.
    $('body').append(`<div id="mandiSidebar"><div id="openAioSettings">♡</div><div id="aioRight"></div><div id="aioLeft"></div></div>`);
    let containerLeft = $('#aioLeft'),
        containerRight = $('#aioRight');

    // add the settings modal
    doTheSettings();

    // add the various features if the user wants to show them
    if (settings_storage.s > 0) writeShops((settings_storage.s >= 10) ? containerRight : containerLeft);
    if (settings_storage.d > 0) writeDailies((settings_storage.d >= 10) ? containerRight : containerLeft);
    if (settings_storage.t > 0) writeTimelies((settings_storage.t >= 10) ? containerRight : containerLeft);
    if (settings_storage.f > 0) writeFishers((settings_storage.f >= 10) ? containerRight : containerLeft);
    if (settings_storage.tr > 0) writeTraining((settings_storage.tr >= 10) ? containerRight : containerLeft);
    if (settings_storage.re > 0) writeRandomEvents((settings_storage.re >= 10) ? containerRight : containerLeft);
    if (settings_storage.m > 0) writeMiscLinks((settings_storage.m >= 10) ? containerRight : containerLeft);
    // and run the check to start the timer checking!
    runTheCheck();
})();


/********************************************** WRITE THE DATA OUT *********************************************/


/*
 * Dump the shop list out on the page.
 * Excludes any shops the user has specified.
 * Pulls data from the "shopData" function
 */
function writeShops(container) {
    let shops = shopData();
    let exclude = settings_storage.hide_shops.indexOf(',') > 0 ? settings_storage.hide_shops.split(',') : [settings_storage.hide_shops];
    exclude = exclude.map(element => { return element.trim(); });

    container.append( `<div id="aioShops" align="center" style="order:${settings_storage.s}"></div>` );
    Object.entries(shops).forEach(entry => {
        const [key, value] = entry;
        // add the shop type header
        if ($(`#aioShop${value.type}`).length == 0) $('#aioShops').append( `<div id="aioShop${value.type}" align="center"><div><b>${value.type}</b></div></div>` );
        // only display it if the user hasn't specified to ignore it
        if (exclude.includes( key ) === false) {
            $(`#aioShop${value.type}`).append( getAShopTag(`/viewshop/?shop_id=${key}`, value.name, value.img, settings_storage.shopdisplay) );
        }
    });
    // add Tarla's Shop of Mystery if the user wants to see it
    if (settings_storage.tarla == 0) {
        $(`#aioShopMisc`).append( getAShopTag(`/winter/shopofmystery/`, `Tarla's Shop of Mystery`, `/images/misc/shopofmystery_item.gif`, settings_storage.shopdisplay) );
    }
    if (EVENT_ACTIVE != false) {
        $('#aioShops').append( `<div id="aioShopEvent" align="center"><div><b>Event</b></div></div>` );
        if (events[EVENT_ACTIVE].pouch == true) {
            $(`#aioShopEvent`).append( getAShopTag(`/inventory/event_pouch/`, `Event Pouch`, `/images/misc/pouch1.gif`, settings_storage.shopdisplay) );
        }
        if (events[EVENT_ACTIVE].shop != false) {
            $(`#aioShopEvent`).append( getAShopTag( events[EVENT_ACTIVE].shop.url, `Event Shop`, events[EVENT_ACTIVE].shop.img, settings_storage.shopdisplay) );
        }
    }
    // add the shop refresh div
    $('#aioShops').append( `<div align="center"><br><a href="/viewshop/?shop_id=${settings_storage.rs}"><div style="background:inherit">Shop Refresh </div><div style="background:inherit" id="aioShopRefresh" class="aioTimeMe" data-time="${data_storage.rs}">N/A</div></a></div>` );
    // this just removes shop headers if user has hidden all the shops within it
    $('[id^=aioShop]').each( function() { if ($(this).children().length == 1) $(this).remove() });
}

/*
 * Dump the dailies list out on the page.
 * Pulls data from the "dailiesData" function
 */
function writeDailies(container) {
    let dailies = dailiesData(),
        extraText = '',
        max = 0,
        epochNow = getEpochTime(new Date().getTime());

    container.append( `<div id="aioDailies" align="center" style="order:${settings_storage.d}"><div><b>Dailies</b></div></div>` );
    Object.entries(dailies).forEach(entry => {
        const [key, value] = entry;
        if ((value.month && (now.getMonth() + 1) == value.month) || !value.month) {
            if (settings_storage[key] == 1) {
                // user wants it hidden
            } else if (settings_storage.dDisplay == 't') {
                max = dailiesData(key,'max');
                if (max > 0) {
                    if (key == 'job') {
                        if (data_storage.d.jobs == epochNow) extraText = extraText = '<small>(' + max + '/' + max + ')</small>' ;
                        else extraText = extraText = '<small>(' + (data_storage.d.jobs.length > 0 ? data_storage.d.jobs.length - 1 : 0) + '/' + max + ')</small>' ;
                    }
                    if (key == 'wish') {
                        if (data_storage.d.wish == epochNow) extraText = extraText = '<small>(' + max + '/' + max + ')</small>' ;
                        else extraText = extraText = '<small>(' + parseInt(data_storage.d.wwCount) + '/' + max + ')</small>' ;
                    }
                }
                else extraText = '';
                $(`#aioDailies`).append(`<a href="${value.url}"><div class="aioTimelie" data-key="${key}"><div id="aioDaily${key}" class="aioTimer aioDayMe" data-time="${data_storage.d[key]}">N/A</div>${value.name} ${extraText}</div></a>` );
            } else {
                $(`#aioDailies`).append( `<a href="${value.url}"><img id="aioDaily${key}" class="aioDayMe" data-time="${data_storage.d[key]}" src="${value.img}"></a>` );
            }
        }
    });

    // don't need job refresh timer if done all jobs
    if (data_storage.d.job != epochNow) $('#aioDailies').append( `<br><div align="center"><div><br><b>Job Refresh</b> <div id="aioJobRefresh" class="aioTimeMe" data-time="${data_storage.jobs}">N/A<br></div></div></div>` );
}

/*
 * Dump the timelies list out on the page.
 * Pulls data from the "timeliesData" function
 */
function writeTimelies(container) {
    let timelies = timeliesData(),
        extraText = '',
        qip = '',
        max = 0,
        epochNow = getEpochTime(new Date().getTime());

    container.append( `<div id="aioTimelies" align="center" style="order:${settings_storage.t}"><div><b>Timelies</b></div></div>` );
    Object.entries(timelies).forEach(entry => {
        const [key, value] = entry;
        if (((value.month && (now.getMonth() + 1) == value.month) || !value.month) && (value.event == EVENT_ACTIVE || !value.event)) {
            if (settings_storage[key] == 1) {
                // user wants it hidden
            } else {
                max = timeliesData(key,'max');
                if (max > 0) {
                    if (key == 'sf') {
                        if (data_storage.t.sfCount == epochNow) extraText = extraText = '<small>(' + max + '/' + max + ')</small>' ;
                        else extraText = extraText = '<small>(' + data_storage.t.sfCount + '/' + max + ')</small>' ;
                    }
                }
                else extraText = '';
                qip = (data_storage.t[key + 'QIP'] == 1) ? 'aioQIP' : '';
                $(`#aioTimelies`).append(`<a href="${value.url}"><div class="aioTimelie ${qip}" data-key="${key}"><div id="aioTime${key}" class="aioTimer aioTimeMe" data-time="${data_storage.t[key]}">N/A</div>${value.name} ${extraText}</div></a>` );
            }
        }
    });
}

function writeFishers(container) {
    let currentTime = (new Date()).getTime();
    container.append( `<div id="aioFishers" align="center" style="order:${settings_storage.f}"><div><a href="/water/fishing/"><b>Fishing</b></a></div></div>` );
    Object.entries(data_storage.f).forEach(entry => {
        const [key, value] = entry;
        let order = (settings_storage.seq == 'l') ? 600-value[1] : value[0] - currentTime;
        order = (order <= 0) ? 1 : order; // this just to make sure it doesn't put a pet above the 'fishing' header
        $(`#aioFishers`).append(`<a href="/setActivePet/?pet_name=${key}" style="order: ${order};"><div class="aioFisher" data-key="${key}">${key} (${value[1]})<br><div id="aioFish${key}" class="aioTimeMe" data-time="${value[0]}">N/A</div></div></a>` );
    });
    $('#aioFishers').append(`<center id="fishingFix" style="order:99999999;"><hr><a href="${$('a[href^="/userlookup/?"]').attr('href')}&updatefish=1" title="Remove pets from the above list that aren't on your account anymore">Fix Non-Acc Pets</a></center>`);
}

function writeTraining(container) {
    let currentTime = (new Date()).getTime();
    if (settings_storage.mi !== 1) {
        container.append( `<div id="aioTrainingMI" align="center" style="order:${settings_storage.tr}"><hr><a href="/island/training/courses/"><div><b>MI Training</b></a></div></a>` );
        Object.entries(data_storage.tr.mi).forEach(entry => {
            const [key, value] = entry;
            writeTrainingPet('aioTrainingMI', '/island/training/status', key, value[0], value[1], value[2], currentTime);
        });
    }
    if (settings_storage.sa !== 1) {
        container.append( `<div id="aioTrainingSA" align="center" style="order:${settings_storage.tr}"><a href="/pirates/academy/courses/"><div><b>SA Training</b></a></div></a>` );
        Object.entries(data_storage.tr.sa).forEach(entry => {
            const [key, value] = entry;
            writeTrainingPet('aioTrainingSA', '/pirates/academy/status', key, value[0], value[1], value[2], currentTime);

        });
    }
}

function writeTrainingPet(id, url, pet, course, message, endTime, currentTime ) {
    if (message !== null && message.indexOf('Payment') > 0) {
        $(`#${id}`).append(`<a href="${url}" style="order: 1;"><div class="aioTraining" data-key="${pet}">${pet} (${course})<br><div id="aioTrain${pet}" class="" data-time="">${message}</div></div></a>` );
    } else {
        let order = endTime - currentTime;
        order = (order <= 0) ? 1 : order; // this just to make sure it doesn't put a pet above the 'training' header
        $(`#${id}`).append(`<a href="${url}" style="order: ${order};"><div class="aioTraining" data-key="${pet}">${pet} (${course})<br><div id="aioTrain${pet}" class="aioTimeMe" data-time="${endTime}">N/A</div></div></a>` );
    }
}

function writeRandomEvents(container) {
    container.append( `<div id="aioRandomEvents" align="center" style="order:${settings_storage.re}"><hr><a href="/donations/"><div>Random Event<div id="aioRandomEvent" class="aioTimeMe" data-time="${data_storage.re}">N/A</div></div></a></div>` );

    if (settings_storage.re_log != 1) {
        container.append( `<div id="aioRandomEventLog" align="center" style="order:${settings_storage.re};font-weight:bold; background-color:#fff;">☆</div>` );

        $('body').append(`
    <div class="reLog-modal">
        <div class="settings-title">Random Events Log</div>
            <div id="aioRELogData"></div>
            <button id="aioReLogClose" class="save-settings">Close</button>
        </div>
    </div>
`);
        $('#aioRELogData').html(data_storage.reLog.join('<hr>'));

        $(document).on('click', '#aioRandomEventLog', function(e) {
            if ($(this).hasClass('logOpen')) {
                $(this).removeClass('logOpen').text('☆');
            } else {
                $(this).addClass('logOpen').text('CLOSE RE LOG');
            }
            $('.reLog-modal').toggle();
        });

        $(document).on('click', '#aioReLogClose', function(e) {
            $('#aioRandomEventLog').removeClass('logOpen').text('☆');
            $('.reLog-modal').toggle();
        });
    }
}

function writeMiscLinks(container) {
    container.append( `<div id="aioMiscLinks" align="center" style="order:${settings_storage.m}"><div><b>Misc Links</b></div></div>` );
    if (settings_storage.misc !== undefined) data_storage.misc = DEFAULT_MISC_LINKS;
    Object.entries(settings_storage.misc).forEach(entry => {
        const [key, value] = entry;
        if (value.indexOf('.gif') > 1) {
            $(`#aioMiscLinks`).append(`<a href="${key}"><img class="aioDayMe" src="${value}"></a>` );
        } else {
            $(`#aioMiscLinks`).append(`<a href="${key}"><div class="aioTimelies"><b>${value}</b></div></a>` );
        }
    });
}

// main function that runs all the timer checks etc
function runTheCheck() {

    alertTimeSnowy();

    // check & update the dailies
    $('.aioDayMe').each( function() {
        getDailiesStatus( $(this).data('time'), $(this).attr('id') );
    });

    // check & update the timelies
    $('.aioTimeMe').each( function() {
        getTimeliesStatus( $(this).data('time'), $(this).attr('id') );
    });

    setTimeout(() => { runTheCheck(); }, 1000);
}

// sub function that checks Snowy time
function alertTimeSnowy() {
    let currentTime = new Date();
    if (((nstHours == '06' && nstAmPm == 'AM') ||
         (nstHours == '02' && nstAmPm == 'PM') ||
         (nstHours == '10' && nstAmPm == 'PM')) &&
        getEpochTime(currentTime.getTime(), true) != data_storage.d.sw ) {
        customAlertTime( 'snowy', null, true );
    } else if ( $('#snowyalert').length > 0) {
        $('#snowyalert').remove();
    }
}

/*
 * these put a little square icon above the clock for RS, Kads and Snowy
 */
function customAlertTime( forWhat, id, now ) {
    let margin = THEME2004 ? '0 2px' : '-8px 2px 8px'
    switch (forWhat) {
        case 'kad':
            if (now === true && $('#kadlert').length == 0) $('#nst').parent().prepend('<a id="kadlert" href="/games/kadoatery/"><img src="/images/items/kadoatie_pink.gif" style="height:30px; margin: ' + margin + '; border: 2px solid deeppink"></a>');
            break;

        case 'rs':
            if (now === true && $('#rsalert').length == 0) $('#nst').parent().prepend('<a id="rsalert" href="/viewshop/?shop_id=' + id + '"><img src="' + shopData( id, 'img' ) + '" alt="' + shopData( id, 'name' ) + '" style="height:30px; margin: ' + margin + '; border: 2px solid red"></a>');
            break;

        case 'snowy':
            if (now === true && $('#snowyalert').length == 0) $('#nst').parent().prepend('<a id="snowyalert" href="/winter/snowager/"><img src="/images/items/26608.gif" style="height:30px; margin: ' + margin + '; border: 2px solid lightblue"></a>');
            break;
    }
}

/********************************************* THE SETTINGS MAGIC **********************************************/

function doTheSettings() {
    if (settings_storage.misc == undefined) settings_storage.misc = DEFAULT_MISC_LINKS;
    let misc_links = '';
    Object.entries(settings_storage.misc).forEach(entry => {
        const [key, value] = entry;
        misc_links += key +', ' + value + "\n";
    });

    $('body').append(`
    <div class="settings-modal">
        <div class="settings-title">All-in-One Sidebar Settings</div>
        <div class="settings-form">
        <form id="aio_settings">
        <b>What order do you want these displayed in?</b><br>Set 0 to hide it. 10+ puts it in the righthand column.
        <table>
            <tr><td width="27%"><label for="re">Random Events</label></td>  <td align="left"><input type="number" name="re" id="re" value="${settings_storage.re}"></td>
                <td width="27%"><label for="train">Training</label></td>    <td align="left"><input type="number" name="tr" id="train" value="${settings_storage.tr}"></td></tr>
            <tr><td><label for="dailies">Dailies</label></td>   <td align="left"><input type="number" name="d" id="dailies" value="${settings_storage.d}"></td>
                <td><label for="timelies">Timelies</label></td> <td align="left"><input type="number" name="t" id="timelies" value="${settings_storage.t}"></td></tr>
            <tr><td><label for="shop">Shops</label></td>        <td align="left"><input type="number" name="s" id="shop" value="${settings_storage.s}"></td>
                <td><label for="fish">Fishing</label></td>      <td align="left"><input type="number" name="f" id="fish" value="${settings_storage.f}"></td></tr>
            <tr><td><label for="m">Misc Links</label></td>        <td align="left"><input type="number" name="m" id="misc" value="${settings_storage.m}"></td>
                <td></td></tr>
        </table>
        <hr>
        <b>What's your first RS shop ID?</b> i.e. 1 for Magic <input type="text" name="rs" id="rs" value="${settings_storage.rs}">
        <hr>
        <b>Display shop links as:</b> Text <input type="radio" name="shopdisplay" value="t" ${(settings_storage.shopdisplay=='t'?'checked':'')}> | Images <input type="radio" name="shopdisplay" value="i" ${(settings_storage.shopdisplay=='i'?'checked':'')}>
        <hr>
        <b>Display dailies links as:</b> Text <input type="radio" name="dDisplay" value="t" ${(settings_storage.dDisplay=='t'?'checked':'')}> | Images <input type="radio" name="dDisplay" value="i" ${(settings_storage.dDisplay=='i'?'checked':'')}>
        <hr>
        <b>How do you want fisher pets ordering?</b><br>Level Descending <input type="radio" name="seq" value="l" ${(settings_storage.seq=='l'?'checked':'')}> | Time Ascending <input type="radio" name="seq" value="t" ${(settings_storage.seq=='t'?'checked':'')}>
        <hr>
        <b>How much warning (in seconds) do you want for refreshes?</b><br>
        Red (i.e. 10) <input type="number" name="red" id="red" value="${settings_storage.red}">  Orange (i.e. 30) <input type="number" name="amb" id="amb" value="${settings_storage.amb}">
        <hr>
        <b>Pre-fill the Wishing Well?</b><br>
        Item <input type="text" name="wwitem" id="wwitem" value="${settings_storage.wwitem}">  Donation <input type="number" name="wwnp" id="wwnp" value="${settings_storage.wwnp}">
        <hr>
        <b>Want to hide some shops?</b><br>List their ID's separated by commas  i.e. 1, 9, 33.<br>
        <input type="text" name="hide_shops" id="hide_shops" value="${settings_storage.hide_shops}">
        <hr>
        <b>Check boxes of things you want to hide</b><br>
        <table>
            <tr><td><label for="kads">Kads</label></td><td><input type="checkbox" name="kads" id="kads" value="1" ${settings_storage.kads == 1 ? 'checked="checked"' : ''}></td>
                <td><label for="job">Jobs</label></td><td><input type="checkbox" name="job" id="job" value="1" ${settings_storage.job == 1 ? 'checked="checked"' : ''}></td></tr>
            <tr><td><label for="sa">SA Training</label></td><td><input type="checkbox" name="sa" id="sa" value="1" ${settings_storage.sa == 1 ? 'checked="checked"' : ''}></td>
                <td><label for="mi">MI Training</label></td><td><input type="checkbox" name="mi" id="mi" value="1" ${settings_storage.mi == 1 ? 'checked="checked"' : ''}></td></tr>
            <tr><td><label for="re_log">RE Log</label></td><td><input type="checkbox" name="re_log" id="re_log" value="1" ${settings_storage.re_log == 1 ? 'checked="checked"' : ''}></td>
                <td><label for="tarla">Shop of Mystery</label></td><td><input type="checkbox" name="tarla" id="tarla" value="1" ${settings_storage.tarla == 1 ? 'checked="checked"' : ''}></td></tr>
            <tr><td><label for="pplm">Petpet Lab</label></td><td><input type="checkbox" name="pplm" id="pplm" value="1" ${settings_storage.pplm == 1 ? 'checked="checked"' : ''}></td>
                <td><label for="slm">Secret Lab</label></td><td><input type="checkbox" name="slm" id="slm" value="1" ${settings_storage.slm == 1 ? 'checked="checked"' : ''}></td></tr>
            <tr><td><label for="garden">Gardening</label></td><td><input type="checkbox" name="garden" id="garden" value="1" ${settings_storage.garden == 1 ? 'checked="checked"' : ''}></td>
                </tr>
        </table>
        <hr>
        <b>Misc Links</b><br>One line per item. "url, text" or "url, image link"<br>
        <textarea name="misc" id="misc" style="width:402px; height: 100px;">${misc_links}</textarea>
        <hr>
        </form>
            <button class="save-settings">Save Settings</button>
        </div>
    </div>
`);

    $(document).on('click', '#openAioSettings', function(e) {
        if ($(this).hasClass('settingsOpen')) {
            $(this).removeClass('settingsOpen').text('♡');
        } else {
            $(this).addClass('settingsOpen').text('CLOSE SETTINGS');
        }
        $('.settings-modal').toggle();
    });

    $(document).on('click', '.save-settings', function() {
        let setting_data = {},
            elem = $(this),
            temp, preJson={};

        $('#aio_settings input[type="number"]').each( function( index ) { setting_data[ $(this).attr('name') ] = $(this).val(); });
        $('#aio_settings input[type="text"]').each( function( index ) { setting_data[ $(this).attr('name') ] = $(this).val(); });
        $('#aio_settings input[type="radio"]').each( function( index ) { if ($(this).is(':checked')) setting_data[ $(this).attr('name') ] = $(this).val(); });
        $('#aio_settings input[type="checkbox"]').each( function( index ) {
            setting_data[ $(this).attr('name') ] = $(this).is(':checked') ? 1 : 0;
        });
        let array = $('#aio_settings textarea#misc').val().trim().split("\n");
        array.forEach( function(data) {
            temp = data.split(',');
            preJson[temp[0]] = temp[1].trim();

        });
        setting_data.misc = preJson;

        settings_storage = setting_data;

        localStorage.setItem(SETTINGS_STORAGE_ID, JSON.stringify(settings_storage));

        elem.text('Settings Saved!').css('background-color', 'lightgreen').css('border-color', 'green');
        setTimeout(function() {
            $('.settings-modal').toggle();
            elem.text('Save Settings').css('background-color', '').css('border-color', '');
            $('#openAioSettings').removeClass('settingsOpen').text('OPEN SETTINGS');
        }, 1000);
    });
}


/************************************************** CSS STUFF **************************************************/

/*
 * Theses are styles for various things on the sidebar. I've tried to name them simply so it's easy to see
 * what's what so it can be customised as you like.
 * Just remember to save your changes somewhere (like a text file on your desktop or something) because these
 * changes won't stay when the sidebar gets updated.
 */
let sidebarWidth = 300; //= settings_storage.f == 0 ? 149 : 300;
if ($('#aioRight').children().length == 0 || $('#aioLeft').children().length == 0) sidebarWidth = 150;
let sidebarCustomCSS = `
     #mandiSidebar { position: absolute; top: 10px; left: 765px; width: ${sidebarWidth}px; text-transform: lowercase;}
    #aioLeft { float: left; }
    #aioRight { position: absolute; right: -2px;}
    #aioLeft > div, #aioRight > div { border: 0px solid pink; padding-bottom: 5px; margin-bottom: -1px;}
    #mandiSidebar center { padding-bottom: 5px; }
    #mandiSidebar, #mandiSidebar a b { font-size: .8em; }
    #mandiSidebar b { letter-spacing: 2px; font-weight: 500; }
    #mandiSidebar a div { font-weight: 500; font-size: .8em; width: auto; color: #000}
    #mandiSidebar a > div:hover { color: black; background-color: #F7D4DF; }
    #mandiSidebar img { width: 30px; margin: 4px 1px 0; }
    #mandiSidebar img:hover { filter:grayscale(100%); }
    .aioTimelie { clear: both; text-align: left; width: 100%; }
    a .aioTimelie { padding: 0 5px; }
    .aioTimelie div.aioTimer { float: right; color: black; }
    #aioLeft, #aioRight { background: white; width: 150px; display: flex; flex-direction: column; }
    #aioFishers { display: flex; flex-direction: column;}
   #aioFishers { display: flex; flex-direction: column; max-height: auto; overflow-x: auto; }
    .aioSoon { background-color: #FDDEF5; }
    .aioAlmost { background-color: #FAD6F1; }
    .aioReady { background-color: #F7D4DF; color: black; }
    p > font.sf { width: 600px; position: absolute; left: 130px; }
`;
$("<style>").prop("type", "text/css").html(sidebarCustomCSS).appendTo("head");

/*
 * Theses are styles specifically for Quests In Progress (QIP).
 */
let qipCustomCSS = `
    .aioQIP { background-color: #FFEDFB; }           /* Quest In Progress */
    .aioQIP.aioSoon { background-color: #FAD6F1; }   /* 20s to go (or the 'amber' time you set) */
    .aioQIP.aioAlmost { background-color: #F3D6EC; } /* 10s to go (or the 'red' time you set) */
    .aioQIP.aioReady { background-color: #F7D4DF; }  /* Too late, time's up */
`;
$("<style>").prop("type", "text/css").html(qipCustomCSS).appendTo("head");

/*
 * Theses are styles specifically for the settings pop-up box.
 */
let settingsCustomCSS = `
    #hide_shops { width: 412px; }
    #wwitem { width: 260px; }
    .settings-modal, .settings-modal label, .settings-modal input { font-family: monospace; }
    .settings-form input { width:40px; }
    .settings-form table { width: 90%; margin: auto;}
    .settings-form td:nth-of-type(1), .settings-form td:nth-of-type(3) { text-align: right; }
    .settings-title { padding: 10px; background: #fff; font-weight: normal; font-size: 1.2em; text-align: center; }
    .save-settings { padding: 2px; }
    .settings-modal { display: none; position: absolute; top: 10%; left: 25%; background: #fff; width: 460px; border: 0px solid rgba(0, 0, 0, 1); overflow: hidden; }
    .settings-form { display: flex; flex-direction: column; padding: 20px; }
    #openAioSettings { width: 100%; text-align: center; font-weight: normal; background-color: #fff; height: 20px; line-height: 20px; margin: 0 0 -1px; border: 0px solid grey; cursor: pointer; }
`;
$("<style>").prop("type", "text/css").html(settingsCustomCSS).appendTo("head");

/*
 * these are misc for various QOL improvements
 */
let customCss = `
    .donating td { background-color: rgba(255, 215, 0, .6) !important; }
    .discarding td { background-color: rgba(255, 0, 0, .65) !important; }
`;
$("<style>").prop("type", "text/css").html(customCss).appendTo("head");

/*
 * these are specifically for the RE Log pop-up
 */
let reLogCss = `
    .reLog-modal { display: none; position: absolute; top: 43px; left: 130px; max-height: 943px; background: #fff; width: 594px; border: 2px solid rgba(0, 0, 0, 1); overflow-x: hidden; }
    #aioRandomEventLog { text-align: center; font-weight: bold; background-color: lightblue; height: 20px; line-height: 20px; margin: 0 0 -1px; border: 1px solid grey; cursor: pointer; font-size: .8em; text-transform: lowercase;}
    #aioRELogData { padding: 2px 5px; text-transform: lowercase; font-family: monospace; }
    #aioRELogData hr { width: 85%; color: gray; background-color: gray; height: 1px; border: none; }
`;
$("<style>").prop("type", "text/css").html(reLogCss).appendTo("head");


/*********************************************** DATA FUNCTIONS ************************************************/

/*
 * pass the ID and FIELD if you just want to return one piece of data
 * i.e. shopData( 3, 'name' ) will return "Magical Bookshop"
 */
function shopData( id, fld ) {
    let shops = {
         // Book shops
        3: { name: 'Magical Bookshop', type: 'Book', img: 'https://images.neopets.com/items/book_plushcollector.gif' },
        28: { name: 'Booktastic Books', type: 'Book', img: 'https://images.neopets.com/items/bbo_krel_maths.gif' },

        // Food shops
        2: { name: 'Fresh Foods', type: 'Food', img: 'https://images.neopets.com/items/grapes.gif' },
        5: { name: 'Slushie Shop', type: 'Food', img: 'https://images.neopets.com/items/slush_mysteryberry.gif' },
        12: { name: 'Tyrannian Foods', type: 'Food', img: 'https://images.neopets.com/items/d_food19.gif' },
        14: { name: 'Faerie Foods', type: 'Food', img: 'https://neopetsclassic.com/images/items/faerie_food_grape.gif' },
        16: { name: 'S.H.I.F. Snow Shop', type: 'Food', img: 'https://images.neopets.com/items/foo_brucicle_jelly.gif' },
        18: { name: 'The Bakery', type: 'Food', img: 'https://images.neopets.com/items/snow_ice_donut.gif' },
        19: { name: 'Merifoods', type: 'Food', img: 'https://images.neopets.com/items/mfo_draikiceegg.gif' },
        21: { name: 'Spooky Foods', type: 'Food', img: 'https://images.neopets.com/items/sp_pinkicecream.gif' },
        26: { name: 'Kiko Lake Treats', type: 'Food', img: 'https://images.neopets.com/items/kik_cook_straw.gif' },
        33: { name: 'Chocolate Factory', type: 'Food', img: 'https://neopetsclassic.com/images/items/can_tonuhard_blue.gif' },
        35: { name: 'Jelly Foods', type: 'Food', img: 'https://neopetsclassic.com/images//items/jel_asparagus.gif' },
        36: { name: 'Huberts Hot Dogs', type: 'Food', img: 'https://images.neopets.com/items/hotdog_blue.gif' },

        // Petpets
        4: { name: 'Neopian Petpets', type: 'Petpet', img: 'https://images.neopets.com/items/kadoatie_pink.gif' },
        8: { name: 'The Rock Pool', type: 'Petpet', img: 'https://images.neopets.com/items/isl_petpet15.gif' },
        9: { name: 'Faerieland Petpets', type: 'Petpet', img: 'https://images.neopets.com/items/faerie_pet2.gif' },
        10: { name: 'Spooky Petpets', type: 'Petpet', img: 'https://images.neopets.com/items/dribblet_mutant.gif' },
        11: { name: 'Tyrannian Petpets', type: 'Petpet', img: '/images/items/pet_bluna.gif' },
        17: { name: 'Wintery Petpets', type: 'Petpet', img: 'https://images.neopets.com/items/ona_blue.gif' },
        20: { name: 'Ye Olde Petpets', type: 'Petpet', img: 'https://images.neopets.com/items/Dragoyle_faerie.gif' },
        22: { name: "Peopatra's Petpets", type: 'Petpet', img: 'https://images.neopets.com/items/geb_pink.gif' },

        // Misc shops
        1: { name: "Kauvara's Magic", type: 'Misc', img: 'https://images.neopets.com/items/pot_korbat_maraquan.gif' },
        15: { name: 'Plushie Palace', type: 'Misc', img: 'https://images.neopets.com/items/toy_kiko_plushie.gif' },
        24: { name: 'Grooming Parlour', type: 'Misc', img: 'https://images.neopets.com/items/groom_aisha_clip.gif' },
        25: { name: "Uni's Clothing", type: 'Misc', img: 'https://images.neopets.com/items/clo_ilovefyorashirt.gif' },
        29: { name: "Post Office", type: 'Misc', img: 'https://images.neopets.com/items/sta_nabile.gif' },
        32: { name: "Garden Centre", type: 'Misc', img: 'https://images.neopets.com/items/bd_garden_hoe.gif' },
        34: { name: 'Usukiland', type: 'Misc', img: 'https://images.neopets.com/items/doll_usul_7.gif' },
    };

    return (id != null && fld != null) ? shops[id][fld] : shops;
}

/*
 * any keys in here must match the keys in the settings if
 * you want the users to be able to hide them
 */
function dailiesData( id, fld ) {
    let dailies = {
         'bank': { url: '/bank', img: 'https://images.neopets.com/items/toy_bank_icklesaur.gif' },
        'jelly': { url: '/jelly/jelly', img: 'https://images.neopets.com/items/jel_thornberry_whole.gif' },
        'om': { url: '/prehistoric/plateau/omelette', img: 'https://images.neopets.com/items/food_jellyomelette.gif' },
        'wok': { url: '/medieval/brightvale/wheel', img: 'https://images.neopets.com/items/bvg_lg_faerieland.gif' },
        'fm': { url: '/desert/fruimachine', img: 'https://images.neopets.com/items/food_desert4.gif' },
        'tom': { url: '/island/tombola', img: 'https://images.neopets.com/items/tiki_pinksand.gif' },
        'wish': { url: '/wishing', img: 'https://images.neopets.com/items/plushiepaintbrush.gif', max: 7 },
        'slm': { url: '/lab2', img: 'https://images.neopets.com/items/bd_raygun2.gif' },
        'pplm': { url: '/petpetlab', img: 'https://images.neopets.com/items/turmac_ice.gif' },
        'job': { url: '/faerieland/employ/employment', img: jobImages(data_storage.d.jobs.length), max: 10, name: 'Jobs' },
        'adv': { url: '/winter/adventcalendar', img: '/images/items/21443.gif', month: '12', name: 'Advent' },
    };

    return (id != null && fld != null) ? dailies[id][fld] : dailies;
}

function jobImages( jobsDone ) {
    let images = ['/images/items/12079.gif',
                  '/images/items/8029.gif',
                  '/images/items/4504.gif',
                  '/images/items/9032.gif',
                  '/images/items/9030.gif',
                  '/images/items/9029.gif',
                  '/images/items/8285.gif',
                  '/images/items/1658.gif',
                  '/images/items/620.gif',
                  '/images/items/9028.gif',
                  '/images/items/9013.gif'];

    if (isNaN(jobsDone)) jobsDone = 0;
    if (jobsDone > 0) jobsDone = jobsDone - 1;
    return images[ jobsDone ];
}

/*
 * any keys in here must match the keys in the settings if
 * you want the users to be able to hide them
 */
function timeliesData( id, fld ) {
    let timelies = {
        'kads': {mins: 6, url: '/games/kadoatery/', name: 'Kadoatery' },
        'hs': {mins: 30, url: '/faerieland/springs/', name: 'Springs' },
        'woe': {mins: 120, url: '/faerieland/wheel/', name: 'WoE' },
        'wom': {mins: 120, url: '/halloween/wheel/', name: 'WoM' },
        'hw': {mins: 120, url: '/halloween/scratch', name: 'Haunted' },
        'sc': {mins: 240, url: '/winter/kiosk/', name: 'Winter' },
        'cz': {mins: 720, url: '/desert/shrine/', name: 'Coltzan' },
        'eso': {mins: 20, url: '/halloween/esophagor/', name: 'Esophagor' },
        'sf': {mins: 0, url: '/winter/snowfaerie/', name: 'Taelia', max: 10 },
        'garden': {mins: 0, url: '/medieval/index_farm/gardens/', name: 'Gardening'},
        'eventnegg': {mins: 2, url: '/faerieland/', name: 'Negg Pickup', event: 'FestivalofNeggs'},
        'neggbob': {mins: 360, url: '/events/negg_festival/negg_bobbing/', name: 'Negg Bob', event: 'FestivalofNeggs'},
    };

    return (id != null && fld != null) ? timelies[id][fld] : timelies;
}


/************************************************ QOL FUNCTIONS ************************************************/


function addQolStuff() {
    let currentUser = THEME2004 ? $('td.tl a[href^="/userlookup/?"]').text() : $('td.tt a[href^="/userlookup/?"]').text();

    if ('/medieval/index_farm/gardens/' == CURRENT_PAGE) {
        // add QOL links to the NeoGarden
        $('p:contains("Once your seed is planted")').append( '<center>' +
                                                            getATag('/safetydeposit/?page=1&query=seed&category=21', 'My Seeds in SDB', false) + ' | ' +
                                                            getATag('/safetydeposit/?page=1&query=Plant+Cure', 'Plant Cures in SDB', false) + ' | ' +
                                                            getATag('/viewshop/?shop_id=32', 'Neopian Garden Centre', false) +
                                                            '</center>');

    }

    else if ('/quickstock/' == CURRENT_PAGE) {
        // duplicate the headers at the bottom so less likely to click the wrong 'select all'!
        $('.qstable th').parent().clone().insertAfter('#qsfooter');

        // make row show red/orange when selecting to donate/discard
        $('input[type=radio][name^=item]').change( function() {
            if ( $(this).prop('checked') ) {
                if( $(this).val() == 2) $(this).parent().parent().addClass('donating');
                else if( $(this).val() == 3) $(this).parent().parent().addClass('discarding');
                else if( $(this).attr('id') == 'donateAll') $('input[name^=item]').parent().parent().addClass('donating');
                else if( $(this).attr('id') == 'discardAll') $('input[name^=item]').parent().parent().addClass('discarding');
                else $(this).parent().parent().removeClass('discarding donating');
            } else {
                $(this).parent().parent().removeClass('discarding donating');
            }
        });
    }


    // check if user has requested removal of inactive fishers (i.e. pets not on account)
    else if (searchParams.get('updatefish')) { removeNonAccountFishers(); }

    // if your shop is in the wiz list, change URL to go to stock page and highlight it blue
    else if ('/market/wizard/' == CURRENT_PAGE) {
        $(function() {
            $(".qstable a").filter(function() {
                return $(this).text().trim() == currentUser;
            }).attr('href', '/market/').parent().parent().children().css('background-color', 'lightblue');
        });
    }

    // show message at the top of the page if you've already fed a kad
    else if ('/games/kadoatery/' == CURRENT_PAGE) {
        let kad = $('p:contains("Thanks, ' + currentUser + '!")');
        if ( kad.length > 0) {
            let kadName = kad.parent().find('b:first-of-type').text();
            $('b:contains("The Kadoatery")').parent().parent().prepend(`<div id="alreadyFedKad" style="padding:5px;background-color:pink;"><center>You already fed "${kadName}"</center></div>`);
        }
    }

    // show how many wishes made, and auto-populate wish/np if entered in settings
    else if ('/wishing/' == CURRENT_PAGE) {
        if (data_storage.d.wish == getEpochTime(new Date().getTime())) {
            $('input[value="Make a Wish"]').parent().append(`<p style="font-weight: bold; color: darkred;">You're all wished up today!</p>`);
        } else if (parseInt(data_storage.d.wwCount) < 7) {
            let remaining = 7 - parseInt(data_storage.d.wwCount);
            $('input[value="Make a Wish"]').parent().append(`<p style="font-weight: bold; color: darkred;">You have ${remaining} wishes remaining today</p>`);
        }
        $('input[name=amount]').val( settings_storage.wwnp );
        $('input[name=wish]').val( settings_storage.wwitem );
    }

    // Quick link to codestones in SDB
    else if ('/island/training/status/' == CURRENT_PAGE) {
        $('b:contains("Codestone")').parent().prepend('<div>' + getATag('/safetydeposit/?page=1&query=&category=2', 'Codestones in SDB', false) + '</div>');
    }

    // Quick link to dubloons in SDB
    else if ('/pirates/academy/status/' == CURRENT_PAGE) {
        $('b:contains("Dubloon")').parent().prepend('<div>' + getATag('/safetydeposit/?page=1&query=Dubloon&category=0', 'Dubloons in SDB', false) + '</div>');
    }

    // Add 'Accept All' button to incoming items
    else if ('/allevents/items/' == CURRENT_PAGE) {
        $('div.loggedIn').append(`<input onclick=" $('input[type=radio][value=0]').click(); $('div.loggedIn input[type=submit]').click();" type="button" value="Accept All">`);
    }
}



/*********************************************** MINI FUNCTIONS ************************************************/

function getATag(url, text, image) {
    if (false !== image) {
        return ` <a href="${url}" title="${text}" target="_blank"><img src="${image}" width="25px"></a>`;
    } else {
        return ` <a href="${url}" target="_blank">${text}</a>`;
    }
}

function getAShopTag(url, text, image, display) {
    if ('t' == display) {
        return `<a href="${url}"><div class="aioShop">${text}</div></a>`;
    } else {
        return `<a href="${url}" title="${text}"><img src="${image}"></a>`;
    }
}

function getAddedTime(currentTime, minutesToAdd, secondsToAdd) {
    let newTime = new Date();
    newTime.setMinutes( currentTime.getMinutes() + minutesToAdd );
    if (secondsToAdd) newTime.setSeconds( currentTime.getSeconds() + secondsToAdd);
    return newTime.getTime();
}

function removeNonAccountFishers() {
    // make an array of the user's pets from the userlookup page
    let myPets = [];
    $('a[href^="/petlookup/"]').each( function() {
        myPets.push( $(this).text().trim() );
    });

    // loop through the fished pets comparing vs the array from above
    // if fisher exists on account, add to new object
    // if it doesn't, don't
    var fishingPetsArray = {};
    for (var pet in data_storage.f) {
        if (myPets.indexOf(pet) !== -1) {
            fishingPetsArray[pet] = data_storage.f[pet];
        }
    }
    let newStorage = {};
    // add the corrected pets
    data_storage.f = fishingPetsArray;
    localStorage.setItem(DATA_STORAGE_ID, JSON.stringify(data_storage));
}

function getEpochTime(time, snowy) {
    if (snowy) {
        return Math.floor((time / 3600000) - 7);
    } else {
        return Math.floor(((time / 3600000) - 7) / 24);
    }
}

function getTimeliesStatus(timeliesTime, timeliesTimerID) {
    let currentTime = new Date().getTime(),
        timeliesReady = true,
        timeliesReadyIn = 'Now!';

    if (isNaN(timeliesTime) || timeliesTime <= currentTime ) {
        if ($(`#${timeliesTimerID}`).parent().hasClass('aioQIP')) {
            $(`#${timeliesTimerID}`).text( 'TIME UP' ).parent().addClass('aioReady').removeClass('aioSoon aioAlmost');
        } else {
            $(`#${timeliesTimerID}`).text( timeliesReadyIn ).parent().addClass('aioReady').removeClass('aioSoon aioAlmost');
            if (timeliesTimerID == 'aioShopRefresh' ) {
                if (currentTime - timeliesTime < 20000) {
                    customAlertTime( 'kad', null, true );
                    customAlertTime( 'rs', settings_storage.rs, true );
                } else {
                    $('#kadlert').remove();
                    $('#rsalert').remove();
                }
            }
        }
    } else {
        let readyIn = new Date( timeliesTime - currentTime ),
            addClass = '';
        timeliesReady = false;
        timeliesReadyIn = readyIn.toJSON().substr(11, 8);
        if (timeliesReadyIn.substr(0, 5) == '00:00') {
            if (parseInt(timeliesReadyIn.substr(6,2)) < parseInt(settings_storage.red)) {
                addClass = 'aioAlmost';
            } else if (parseInt(timeliesReadyIn.substr(6,2)) < parseInt(settings_storage.amb)) {
                addClass = 'aioSoon';
            }
        }
        $(`#${timeliesTimerID}`).text( timeliesReadyIn ).parent().removeClass('aioReady').addClass(addClass);
    }
}

function getDailiesStatus(dailiesTime, dailiesID) {
    let currentTime = new Date(),
        epochNow = getEpochTime( currentTime.getTime() );
    if (settings_storage.dDisplay == 't') {
        if (epochNow == dailiesTime) {
            $(`#${dailiesID}`).text( '✓' );
        } else {
            $(`#${dailiesID}`).text( '' ).parent().addClass('aioReady');
        }
    } else {
        if (epochNow == dailiesTime ) {
            $(`#${dailiesID}`).css('filter', 'grayscale(100%)');
        } else {
            $(`#${dailiesID}`).css('filter', 'grayscale(0%)');
        }
    }
}


/********************************************** THE STORAGE MAGIC **********************************************/

function updateRsKadJobTimes() {
    // bunch of variables to make this function cleaner
    let currentTime = new Date(),
        rsTime = new Date(),
        jobTime = new Date(),
        rsMins = parseInt(nstTitle[2]),
        jobMins = (Math.trunc(currentTime.getMinutes() / 10) + 1) * 10,
        nowMins = currentTime.getMinutes(),
        epochTime = currentTime.getTime(),
        drift_offset = nstSecs - currentTime.getSeconds(),
        rsMinutes = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

    var closest = rsMinutes.reduce(function(prev, curr) {
        if (prev <= nowMins) return curr;
        return (Math.abs(curr - nowMins) < Math.abs(prev - nowMins) ? curr : prev);
    });
    rsTime.setMinutes( closest );

    // tweak seconds to account for server drift
    rsTime.setSeconds(parseInt(nstTitle[3]) - drift_offset);

    if(rsTime.getHours() < currentTime.getHours()) {
        rsTime.setHours( rsTime.getHours() + 1);
    }

    // if RS time isn't set or is in the past, update it
    // 20000 = 20 seconds to be highlighted & show 'NOW' before it resetes
    if (isNaN(data_storage.rs) || (parseInt(nstSecs) > 20 && parseInt(nowMins) == (closest-6)) || parseInt(nowMins) > (closest-6)) {
        data_storage.rs = rsTime.getTime();
    }

    // when feeding a kad, or viewing kadoatery when a kad already has been fed, update the time
    if (('/games/kadoatery/' == CURRENT_PAGE && ($('#alreadyFedKad').length > 0 || $('p:contains("You should give it")').length == 0)) ||
        ('/games/kadoatery/feed_kadoatie/' == CURRENT_PAGE && $('div:contains("Thanks for doing a good deed")').length > 0)) {
        data_storage.t.kads = rsTime.getTime();
    }

    // if Job time isn't set or is in the past, set it
    // 20000 = 20 seconds to be highlighted & show 'NOW' before it resets
    if (isNaN(data_storage.jobs) || (data_storage.jobs + 20000) <= epochTime) {
        if (jobMins > nowMins) jobTime.setMinutes(jobMins-1);
        jobTime.setSeconds(60 - drift_offset);
        data_storage.jobs = jobTime.getTime();
    }

    // save the time
    localStorage.setItem(DATA_STORAGE_ID, JSON.stringify(data_storage));
}

function updateStorageTimes() {
    let currentTime = new Date(),
        timeliesTime = new Date(),
        epochTime = currentTime.getTime(),
        epochSnow = getEpochTime( epochTime, true ),
        epochDay = getEpochTime( epochTime );

    let pets = [], t, h, m;

    // reset the jobs if yesterdays were unfinished
    if (data_storage.d.jobs.length > 0 && data_storage.d.jobs[0] != epochDay) {
        data_storage.d.jobs = [];
    }

    // reset Taelia's count if it's a new day
    if ((data_storage.t.sfCount > timeliesData('sf','max') && data_storage.t.sfCount != epochDay) ||
        getEpochTime(new Date(data_storage.t.sf)) != epochDay ){
        data_storage.t.sfCount = 0;
    }

    // remove pet from training
    if (CURRENT_PAGE.indexOf('/training/complete/') !== -1) {
        if (CURRENT_PAGE.indexOf('pirates') > 0) {
            delete data_storage.tr.sa[$('b').eq(1).text()];
        } else {
            delete data_storage.tr.mi[$('b').eq(1).text()];
        }
    }

    switch (CURRENT_PAGE) {
        case '/bank/': 									// Bank Interest
            if ($('p:contains("You have already collected your bank interest today")').length > 0) data_storage.d.bank = epochDay;
            break;

        case '/jelly/take_jelly/': 						// Jelly
            data_storage.d.jelly = epochDay;
            break;

        case '/prehistoric/plateau/omelette/approach/': // Omelette
            data_storage.d.om = epochDay;
            break;

        case '/medieval/brightvale/spinwheel/': 		// Wheel of Knowledge
            data_storage.d.wok = epochDay;
            break;

        case '/desert/fruitmachine2/': 					// Fruit Machine
            data_storage.d.fm = epochDay;
            break;

        case '/island/tombola/play/': 					// Tombola
            data_storage.d.tom = epochDay;
            break;

        case '/wishing/': 								// Wishing Well + wish counter
            var max = dailiesData('wish', 'max');
            if ($('b:contains("If the well grants your wish")').length > 0 && data_storage.d.wish != epochDay && data_storage.d.wwCount < max) data_storage.d.wwCount += 1;
            // once all wishes are done, mark as complete and remove today's counter to keep storage tidy
            if ((data_storage.d.wish != epochDay && data_storage.d.wwCount >= max) || $('p:contains("7 times per day")').length > 0) {
                data_storage.d.wish = epochDay;
                data_storage.d.wwCount = 0;
            }
            break;

        case '/lab/process/': 							// Secret Laboratory
            data_storage.d.slm = epochDay;
            break;

        case '/process_petpetlab/': 					// Petpet Laboratory
            data_storage.d.pplm = epochDay;
            break;

        case '/winter/snowager/approach/': 				// Snowager
            data_storage.d.sw = epochSnow;
            break;

        case '/winter/adventcalendar/': 				// Advent Calendar
            if (currentTime.getMonth() == 11) data_storage.d.adv = epochDay;
            break;

        case '/faerieland/employ/status/': 				// Faerieland Employment Agency (jobs) + job counter
            var completed = parseInt($('b:contains("Daily Completed Jobs : 10/10")').text().substr(23, 2));
            if (10 == completed) {
                data_storage.d.job = epochDay;
                data_storage.d.jobs = [];
            } else if (data_storage.d.jobs.length != completed) {
                for (let i = data_storage.d.jobs.length; i < completed; i++) {
                    data_storage.d.jobs.push(i);
                }
            }
            break;
        case '/faerieland/employ/view_job/': 			// Faerieland Employment Agency (jobs) + job counter
            if ($('b:contains("Completed Job Data...")').length > 0) {
                let thisJobId = searchParams.get('id');

                // add epochDay to job list array so we know it's todays
                if (data_storage.d.jobs.indexOf( epochDay ) == -1) data_storage.d.jobs.push( epochDay );
                if (data_storage.d.jobs.indexOf( thisJobId ) == -1) data_storage.d.jobs.push( thisJobId );

                if (data_storage.d.jobs.length > dailiesData('job','max')) {
                    data_storage.d.job = epochDay;
                    data_storage.d.jobs = [];
                }
            }
            break;

        case '/desert/shrine/':							// Coltzan's Shrine
            if ($('p:contains("walks slowly up to the strange shrine...")').length > 0) {
                data_storage.t.cz = getAddedTime(currentTime, timeliesData('cz','mins'));
            }
            break;

        case '/faerieland/springs/heal/':				// Healing Springs
            if ($('b:contains("The Water Faerie says a few magical words and...")').length > 0) {
                data_storage.t.hs = getAddedTime(currentTime, timeliesData('hs','mins'));
            }
            break;

        case '/faerieland/wheel/':						// Wheel of Excitement
            if ($('input[value="Spin the wheel!!!"]').length == 0
                && $('p:contains("You can only spin the Wheel of Excitement every 2 hours")').length == 0) {
                data_storage.t.woe = getAddedTime(currentTime, timeliesData('woe','mins'));
            }
            break;

        case '/halloween/wheel/spin/':					// Wheel of Misfortune
            if ($('p:contains("You can only spin the Wheel of Misfortune once every 2 hours!")').length == 0) {
                data_storage.t.wom = getAddedTime(currentTime, timeliesData('wom','mins'));
            }
            break;

        case '/halloween/purchase-scratchcard/':		// Scratchcards
        case '/winter/purchase-scratchcard/':
            if ($('b:contains("Thanksss for buying a ssscratchcard!")').length > 0 ||
                $('b:contains("Thanks for buying a scratchcard")').length > 0) {
                data_storage.t.hw = getAddedTime(currentTime, timeliesData('hw','mins'));
                data_storage.t.sc = getAddedTime(currentTime, timeliesData('sc','mins'));
            }
            break;

        case '/winter/snowfaerie/accept/':				// Snow Faerie
            t = $('p:contains("back within")').text();
            if (t.length > 0) {
                data_storage.t.sfQIP = 1;
                h = parseInt(t.substr(t.indexOf('within')+7, 2));
                m = parseInt(t.substr(t.indexOf(' and ')+5, 3));
                data_storage.t.sf = getAddedTime(currentTime, ((h * 60) + m));
            }
            break;
        case '/winter/snowfaerie/':						// Snow Faerie #2
            if ($('b:contains("Deadline")').length > 0) {
                data_storage.t.sfQIP = 1;
                t = $('b:contains(") left")').parent().text();
                h = parseInt(t.substr(0, t.indexOf('hr')));
                m = parseInt(t.substr(t.indexOf('min')-3, 2));
                data_storage.t.sf = getAddedTime(currentTime, ((h * 60) + m));
            } else if (data_storage.t.sf < currentTime.getTime()) {
                data_storage.t.sfQIP = 0;
            }
            break;
        case '/winter/snowfaerie/complete/':			// Snow Faerie counter
            if ($('b:contains("Taelia gives you")').length > 0) {
                data_storage.t.sfQIP = 0;
                data_storage.t.sfCount += 1;
                if (data_storage.t.sfCount >= timeliesData('sf','max')) {
                    var nstHours = $('#NST_clock_hours').text(),
                        nstAmPm = $('#nst').text().substr( $('#nst').text().indexOf('M')-1, 2 );
                    timeliesTime.setHours(currentTime.getHours() + (nstAmPm=='AM' ? 24 - parseInt(nstHours) : 12 - parseInt(nstHours)));
                    timeliesTime.setMinutes(0);
                    timeliesTime.setSeconds(0);

                    data_storage.t.sf = timeliesTime.getTime();
                    data_storage.t.sfCount = epochDay;
                } else {
                    data_storage.t.sf = getAddedTime(currentTime, 0);
                }
            }
            break;

        case '/water/fishing/':							// Fishing
            if ($('p:contains("You might be able to")').length > 0) {
                let activePet = THEME2004 ? $('td.tl a[href^="/quickref/"]').text() : $('td.tt a[href^="/quickref/"]').text(),
                    hoursToNextFish = $('p:contains("You might be able to cast again") b').text(),
                    fishingLevel = parseInt($('p:contains("fishing skill increases to")').text().split(' ')[6]);
                // if no increase, check for existing level or throw back 'TBD' if unknown
                if (isNaN(fishingLevel)) fishingLevel = activePet in data_storage.f ? data_storage.f[activePet][1] : 'TBD';
                data_storage.f[activePet] = [getAddedTime(currentTime, (hoursToNextFish * 60)), fishingLevel];
            } else if ($('input[value="Reel in your line"]').length > 0) {
                let text = $('input[value="Reel in your line"]').parent().parent().text().split(' '),
                    activePet = text[4].split(`'`),
                    fishingLevel = parseInt(text[8]);
                if (data_storage.f[activePet[0]]) data_storage.f[activePet[0]][1] = fishingLevel;
            }
            break;

        case '/medieval/index_farm/gardens/':			// Gardens
            h = 0;
            m = 0;
            $('b:contains("hours,")').each( function() {
                var tempArr = $(this).text().split(' '),
                    th = parseInt(tempArr[0]),
                    tm = parseInt(tempArr[2]);
                if ((0 == h && 0 == m) || (h > th) || (h == th && m > tm)) {
                    h = th;
                    m = tm;
                }
            });
            if (h > 0 || m > 0) data_storage.t.garden = getAddedTime(currentTime, ((h * 60) + m));
            break;

        case '/halloween/esophagor/':					// Esophagor
            if ($('b:contains("Deadline")').length == 1) {
                data_storage.t.esoQIP = 1;
                let t = $('b:contains("Deadline")').parent().parent().text().replace('Deadline : ', '').split(',');
                if (t.length == 2) {
                    data_storage.t.eso = getAddedTime(currentTime, parseInt(t[0].split(' ')[0]), parseInt(t[0].split(' ')[1]));
                } else {
                    data_storage.t.eso = getAddedTime(currentTime, parseInt(t[0].split(' ')[0] * 60) + parseInt(t[1].split(' ')[1]), parseInt(t[2].split(' ')[1]));
                }
            }
            break;
        case '/halloween/esophagor/complete/':			// Esophagor - 20 minutes wait between quests
            data_storage.t.esoQIP = 0;
            data_storage.t.eso = getAddedTime(currentTime, timeliesData('eso','mins'));
            break;

        case '/events/negg_festival/negg_bobbing/play/':	// Negg Bobbing
            if ($('input[type=button][value^="Dunk"] ').length == 0) {
                data_storage.t.neggbob = getAddedTime(currentTime, timeliesData('neggbob','mins'));
            }
            break;

        case '/events/negg_festival/grab_shell/':			// Negg Pickup
            data_storage.t.eventnegg = getAddedTime(currentTime, timeliesData('eventnegg','mins'));
            break;

        case '/island/training/status/':				// Training
        case '/pirates/academy/status/':
            $('b:contains(" (Level")').each( function(e) {
                let info = $(this).text().split(' '),
                    thisPet = info['0'],
                    currentCourse = info[info.length - 1],
                    trainingTime = new Date();
                let timeToCompletion = $(this).parent().parent().next().children().eq(1).text().trim();
                pets.push( thisPet );
                if ('course' == currentCourse) {
                    if (CURRENT_PAGE.indexOf('pirates') > 0) {
                        delete data_storage.tr.sa[thisPet];
                    } else {
                        delete data_storage.tr.mi[thisPet];
                    }
                } else {
                    if (timeToCompletion.indexOf("Codestone") > 0 || timeToCompletion.indexOf("Dubloon") > 0) {
                        timeToCompletion = 'Payment Required';
                    } else {
                        let timeParts = [...timeToCompletion.matchAll(/\d+/g)];
                        trainingTime.setHours( currentTime.getHours() + parseInt(timeParts[0]) );
                        trainingTime.setMinutes( currentTime.getMinutes() + parseInt(timeParts[1]) );
                        trainingTime.setSeconds( currentTime.getSeconds() + parseInt(timeParts[2]) );
                        timeToCompletion = trainingTime.toJSON();
                    }
                    if (CURRENT_PAGE.indexOf('pirates') > 0) {
                        data_storage.tr.sa[thisPet] = [currentCourse, timeToCompletion, trainingTime.getTime()];
                    } else {
                        data_storage.tr.mi[thisPet] = [currentCourse, timeToCompletion, trainingTime.getTime()];
                    }
                }
            });
    }

    if (!data_storage.reLog) {							// Random Events
        data_storage.reLog = ["Random Events log started. New REs will appear above this notice."];
    }

    if ($('b:contains("Something has happened!")').length > 0) {
        if ($('td:contains("as an avatar on the")').length == 0		// don't update RE time for avatars
            && $('td:contains("strange fragment")').length == 0		// or frags from kads / jobs
            && $('td:contains("You spot a Negg shell on the ground")').length == 0		// or frags from kads / jobs
           ) {
            data_storage.re = getAddedTime(currentTime, 8);
        }
        let reReadable = new Date().toDateString().substr(0, 10)+ ", " + $('#nst span ').text().replace(/\n +/g, '').substr(0, 10)+' NST';
        data_storage.reLog.unshift('<b>' + reReadable + '</b>: ' + $('td.txt').html().replace(/[\n]*/g, '').trim());
    }

    // trim RE log to max 250 items
    if (data_storage.reLog.length > 250) data_storage.reLog.splice(250, data_storage.reLog.length - 250);

    localStorage.setItem(DATA_STORAGE_ID, JSON.stringify(data_storage));

}

