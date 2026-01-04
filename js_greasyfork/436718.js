// ==UserScript==
// @name         IQRPG Stats
// @namespace    https://www.iqrpg.com/
// @version      0.58
// @description  Includes a drop tracker for all your IQ drops, as well as tracking hits to kill/die breakpoints and showing how much you need to reach the next breakpoint! Plus various other battle stats.
// @author       Coastis
// @match        *://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436718/IQRPG%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/436718/IQRPG%20Stats.meta.js
// ==/UserScript==

///////////////////////////////////
/////////// config ////////////////
///////////////////////////////////

const track_battle_stats = true; // true or false - enable or disable battle stats
const track_stats_n_drops = true; // true or false - enable or disable drop tracker
const dropalyse_decimal_precision = 3; // the number of decimal places to show for drops per hour/day averages
const track_boss_battles = false; // true or false
const track_clan_battles = false; // true or false
const track_abyss_battles = false; // true or false
const track_min_health_perc = true; // true or false

//////////////////////////////////////////////////////////////////
/////////// Don't change anything below this line ////////////////
//////////////////////////////////////////////////////////////////

/* globals jQuery, $ */

// init
var player_stats = { dmg:0, hits:0, misses:0, hp_perc:100, max_hp:0 }; //TODO update from local storage
var enemy_stats = { dmg:0, hits:0, misses:0, dodges:0,max_hp:0 }; //TODO update from local storage
var player_cache = '';
var enemy_cache = '';
//var action_timer_cache = ''; // delete
var actions = 0;
var dropalyse_rendered = false;
var dropalyse_format = 'hour'; // hour/day/total
var track_extra_battle_stats = true;

// setup persistant vars
var dropalyse_cache = '';
var dropalyse_store = {};
//var dropalyse_start_datum = Date.now(); // delete
var dropalyse_filters = [];
dropalyse_load_ls();

// run every xxx ms updating stuffs
// NOTE we set a delay of 1000ms before starting to help slow rendering cpu's, otherwise there is the possibility of the very 1st drop not being counted
setTimeout(function() {
    // setup observer
    if(track_stats_n_drops === true) {
        if(dropalyse_rendered === false) { // insert p/h panel
            dropalyse_insert_log();
            dropalyse_rendered = true;
        }
        const actionsElement = document.querySelector(".action-timer__text");
        const actionObserver = new MutationObserver(actionTimerChanged);
        actionObserver.observe(actionsElement, { childList: true, subtree: true,characterData: true, characterDataOldValue: true});
    }
    // others
    setInterval(iqrpgbs_loop, 100);
    //setInterval(iqrpgbs_timer_loop, 1000);
}, 1000);

// observes action timer changes and updates actions count as needed
function actionTimerChanged(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if(mutation.type === 'characterData') {
            if(actionTimerClean(mutation.target.textContent) < actionTimerClean(mutation.oldValue)) {
                actions++;
                parse_drop_log(); // parse it
                dropalyse_render_content(); //  update p/h
            }
        }
    });
}
function actionTimerClean(entry) {
    return +(entry.replace("Autos Remaining: ",""));
}

// main loop
function iqrpgbs_loop() {

    /*
    NEW in v0.56
     - For Battle Stats i've added "Kill In:Die in" breakpoint tracking which helps you improve your winrate and investment strategy
     - Droptracker now has a popup confirmation box when clicking reset
     - Added new ckan dragon type
    */

    //TODO dungeon key total tokens

    //TODO add persistance for battle stats
    //TODO add "number of rushes" for gold/resources - would need to remove the popup associated with [Gold][Wood] etc
    //TODO seperate out battle stats so boss/dungeon etc stats track seperately
    //rarity tracking could detect if a new class is found and exit if carl changes css, thus preventing our nightmare
    //TODO battle stats - winrate% improvment calculations e,g, attacj winrate% delta

    // dropalyse
    if(track_stats_n_drops === true) {
        // first run?
        if(dropalyse_cache === '' && $( 'div#log-div > div' ).length > 0 ) {
            dropalyse_cache = dropalyse_clean_entry( $( 'div#log-div > div:first' ) );
        }
        /*         // insert p/h panel
        if(dropalyse_rendered === false) {
            dropalyse_insert_log();
            dropalyse_rendered = true;
        } */
        // NEW drop log parsing
        /*         if( $("div.fixed-top > div.section-2 > div.action-timer > div.action-timer__text").length > 0 ) {
            let action_data = $("div.fixed-top > div.section-2 > div.action-timer > div.action-timer__text").prop('innerHTML').trim();
            if(action_data !== action_timer_cache) {
                action_timer_cache = action_data;
                parse_drop_log(); // parse it
                dropalyse_render_content(); //  update p/h
            }
        } else {
            return false; // skip as autos hasnt rendered yet
        } */
    }

    // battle stats
    if(track_battle_stats === false) return true; // enable or disable battle stats
    var we_battling = false;
    var display_needs_update = false;

    // check we're on the battle page
    if(document.getElementsByClassName("battle-container").length > 0) {
        we_battling = true;
    } else return false;

    // and not in a boss battle - Boss Tokens
    if(track_boss_battles!==true && $("div.game-grid > div.main-game-section > div.main-section__body:contains('Boss Tokens')").length > 0) {
        return false;
    }

    // and not in a dungeon - Dungeoneering Exp
    if($("div.game-grid > div.main-game-section > div.main-section__body:contains('Dungeoneering Exp')").length > 0) {
        return false;
    }

    // and not in a standard clan battle - Clan Exp
    if(track_clan_battles!==true && $("div.game-grid > div.main-game-section > div.main-section__body:contains('Clan Exp')").length > 0) {
        return false;
    }

    // all is well, so let's get the mob name
    var n_obj = $("div.battle-container > div:nth-child(3) > div.participant-name > span");
    if(n_obj.length > 0) {
        var mob_name = n_obj.prop('innerHTML').trim();
    } else {
        return false; // couldn't find the mob name, lets skip just in case
    }

    // and not in a clan dragon battle
    // exact matches
    const clan_dragons = ['Baby Dragon','Young Dragon','Adolescent Dragon','Adult Dragon','Elder Dragon','Dragon','Mythical Dragon'];
    if(track_clan_battles!==true && clan_dragons.indexOf(mob_name) > -1 ) {
        //console.log('Skipping Clan Dragons');
        return false;
    }

    // and not in an abyss battle or clan battle - Abyssal
    if(track_abyss_battles!==true && ['Abyssal'].some(term => mob_name.includes(term))) {
        return false;
    }

    // all good
    if(we_battling === true) {

        // Add the battle stat panel to dom, if not already there
        if(!document.getElementById("iqrpgbs_bs_panel")) {
            var iqrpg_body = $( "div.game-grid > div.main-game-section > div.main-section__body" );
            iqrpg_body[0].children[0].children[0].insertAdjacentHTML('beforeend', render_battle_stats_panel() );
            document.getElementById('igrpg_bs_reset').addEventListener('click', iqrpg_bs_reset_stats, false);
        }

        // get the players stat line & compare it to previous stored stats
        var player_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div:nth-child(2)");
        if(player_sl.prop('innerHTML') !== player_cache) {
            player_cache = player_sl.prop('innerHTML');
            parse_player_stat_line(player_sl);
            display_needs_update = true;
        }

        // get the mobs stat line & compare it to previous stored stats
        var mobs_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div:nth-child(3)");
        if(mobs_sl.prop('innerHTML') !== enemy_cache) {
            enemy_cache = mobs_sl.prop('innerHTML');
            parse_enemy_stat_line(mobs_sl);
            display_needs_update = true;
        }

        // we already have display_needs_update, so let's use it as a trigger for our new health tracking
        if(display_needs_update === true ) {

            // get player health line
            let players_hp_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div.battle-container > div.battle-container__section > div:nth-child(2) > div.progress__text");
            player_stats.max_hp = players_hp_sl.prop('innerHTML').split(" / ")[1].replaceAll(",", "");
            // get enemy health line
            let enemy_hp_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div.battle-container > div.battle-container__section:nth-child(3) > div:nth-child(2) > div.progress__text ");
            enemy_stats.max_hp = enemy_hp_sl.prop('innerHTML').split(" / ")[1].replaceAll(",", "");

            if(track_min_health_perc === true) {
                let hp_totals = players_hp_sl.prop('innerHTML').split(" / ");
                let this_perc = (parseInt(hp_totals[0].replaceAll(",", "")) / parseInt(hp_totals[1].replaceAll(",", ""))) * 100;
                if(this_perc < player_stats.hp_perc) player_stats.hp_perc = this_perc;
            }
        }

        // update displayed values
        if(display_needs_update === true) {
            update_display();
        }

    }


}

// parses the drop log and builds array of quantified contents
function parse_drop_log() {

    if( $( 'div#log-div > div' ).length == 0 ) return false; // either log isn't rendered yet, or it's just been cleared

    const skiplist = ['[Gold]','Gold Rush:','Action Bonus:','Resource Rush:','Skill:','Mastery:','[Wood]','[Stone]','[Metal]'];
    let first_log_entry = dropalyse_clean_entry( $( 'div#log-div > div:first' ) ); // capture cached entry for possible later use
    let count = 0;

    $( 'div#log-div > div' ).each(function( index ) {

        // check if already analysed
        let str = dropalyse_clean_entry($(this));
        //console.log("str - " + str);
        //console.log("cache - " + dropalyse_cache );
        if(str === dropalyse_cache) return false; // break loop

        // skip unwanted
        if (skiplist.some(v => str.includes(v))) return true; // continue loop

        // parse into time, qty, item
        let entry = parse_drop_log_entry($( this ));
        count++;

        // add to data store
        if (typeof dropalyse_store[entry.item] !== 'undefined') {
            dropalyse_store[entry.item] += entry.qty;
        } else {
            dropalyse_store[entry.item] = entry.qty;
        }

    });

    // do we have new entries?
    if(count>0) {
        dropalyse_cache = first_log_entry;
    }

    // save data to localstorage
    dropalyse_save_ls();

}

function dropalyse_clean_entry(txt) {
    //console.log("Cleaning - " + $(txt).text() );
    var r = txt.clone();
    r.find('.popup').remove();
    //console.log("Clean - " + r.text() );
    let ret = r.text();
    // rarity
    //let rarity = $("div.item > p[class^='text-rarity-']", r).attr('class');
    //if(typeof rarity !== 'undefined') ret = ret + "#iqrpgstats#" + rarity;
    return ret;
}

function parse_drop_log_entry(entry) {

    let r = {};

    // timestamp - not needed??
    r.timestamp = $('span:first', entry).text();

    // item
    let data_str = $('span', entry).eq(1).text().replaceAll(",","");
    let matches = data_str.match(/^[+-]?\d+(\.\d+)?[%]?/g);
    if(matches && matches.length>0) {
        let n = matches[0];
        r.qty = Number(n.replace('+', '').replace('%', ''));
        r.item = data_str.replace(n,'').trim();
    } else {
        r.qty = 1; // it's something unusual
        r.item = data_str.trim();
    }

    // strip extra data
    r.item = r.item.split("]")[0].replace("[","").replace("]","");

    // append new rarity data
    let rarity = $("div.item > p[class^='text-rarity-']", entry).attr('class');
    if(typeof rarity !== 'undefined') r.item = r.item + "#iqrpgstats#" + rarity;
    //console.log(rarity + " - " + r.item);

    return r;
}

function dropalyse_load_ls() {
    if (localStorage.getItem('dropalyse_cache')) { dropalyse_cache = localStorage.getItem('dropalyse_cache'); }
    if (localStorage.getItem('dropalyse_actions')) { actions = localStorage.getItem('dropalyse_actions'); }
    if (localStorage.getItem('dropalyse_store')) { dropalyse_store = JSON.parse(localStorage.getItem('dropalyse_store')); }
    if (localStorage.getItem('dropalyse_filters')) { dropalyse_filters = JSON.parse(localStorage.getItem('dropalyse_filters')); }
    // if we have a start datum, convert to new actions method, and delete start datum from LS
    if (localStorage.getItem('dropalyse_start_datum')) {
        let dropalyse_start_datum = localStorage.getItem('dropalyse_start_datum');
        actions = Math.floor((( Date.now() - dropalyse_start_datum ) / 1000) /6 ); // approximate actions from old timing data
        localStorage.removeItem('dropalyse_start_datum'); // remove old data
        dropalyse_save_ls(); // save new data
    }
}

function dropalyse_save_ls() {
    localStorage.setItem('dropalyse_cache', dropalyse_cache);
    localStorage.setItem('dropalyse_store', JSON.stringify(dropalyse_store));
    localStorage.setItem('dropalyse_actions', actions);
    localStorage.setItem('dropalyse_filters', JSON.stringify(dropalyse_filters));
    localStorage.setItem('dropalyse_version', GM_info.script.version);
    // DELETE
    //localStorage.setItem('dropalyse_start_datum', dropalyse_start_datum);
    //localStorage.setItem('dropalyse_save_datum', Date.now());
}

function dropalyse_reset() {
    if (confirm("Are you sure you wish to reset drop tracker?") == true) {
        dropalyse_store = {};
        actions = 0;
        dropalyse_save_ls(); // update persistant storage
        dropalyse_render_content();
    }
}

function dropalyse_render_content() {
    let html = '';
    if(Object.entries(dropalyse_store).length == 0 ) {
        html = '<div>Waiting for drops...</div>';
    } else {

        // get a sorted copy of the store
        let copy_of_dropalyse_store = Object.assign(dropalyse_objectOrder(), dropalyse_store);

        for (let [key, qty] of Object.entries(copy_of_dropalyse_store)) {
            // skip null
            if(Number(qty) == 0 ) continue;
            // format qty
            let formatted_qty = qty;
            if(dropalyse_format==='hour') {
                //formatted_qty = ( ( qty / dropalyse_get_time_elapsed() ) * 60 * 60 ).toFixed(dropalyse_decimal_precision);
                formatted_qty = ( ( qty / actions ) * 10 * 60 ).toFixed(dropalyse_decimal_precision);
            } else if(dropalyse_format==='day') {
                //formatted_qty = ( ( qty / dropalyse_get_time_elapsed() ) * 60 * 60 * 24).toFixed(dropalyse_decimal_precision);
                formatted_qty = ( ( qty / actions ) * 10 * 60 * 24).toFixed(dropalyse_decimal_precision);
            } else {
                formatted_qty = Number(formatted_qty.toFixed(dropalyse_decimal_precision)).toString();
            }
            // format rarity
            let rarity_class = '';
            let parts = key.split("#iqrpgstats#");
            if(parts.length === 2) rarity_class = parts[1];
            // is it filtered?
            if(dropalyse_filters.includes(parts[0])) continue;
            // render
            html += '<div style="position: relative;" class="iqrpgbs_hover_highlight"><div style="display: flex; justify-content: space-between;">'
                + '<span class="'+ escapeHTML(rarity_class) + '">' + escapeHTML(parts[0]) + '</span>'
                + '<span style="color:#3c3">' + escapeHTML(formatted_qty) + '</span>'
                + '</div></div>';
        }
    }
    $('div#iqrpgbs_drop_log_content').html(html);
    document.querySelector('#iqrpgbs_dropalyse_actioncount').textContent = Number(actions).toLocaleString();
    document.querySelector('#iqrpgbs_dropalyse_actiondatum').textContent = dropalyse_render_nice_timer( actions * 6);
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function dropalyse_insert_log() {
    let html = `<div id="iqrpgbs_dropalyse_container" class="main-section" style="background-color: #0a0a0a;margin-bottom: .2rem;border: 1px solid #333;">
    <div id="iqrpgbs_drop_log_header" style="cursor:pointer;">
    <p><span id="iqrpgbs_drop_log_header_title">Drops per hour</span><span class="grey-text" style="margin-left: 0.5rem; font-size: 0.9rem;display:none;">(Collapsed)</span></p><!---->
    </div>
    <div id="iqrpgbs_drop_log_body" class="main-section__body" style="border-top: 1px solid #333;padding: .5rem;">
    <div>

    <div id="iqrpgbs_drop_log_content">Waiting for drops...</div>

    <div class="iqrpgbs_dropalyse_spacing"><span id="iqrpgbs_dropalyse_actiondatum">0s</span> <a title="Based on 6 seconds per action" style="cursor:help">&#x1f6c8;</a></div>
    <div class="iqrpgbs_dropalyse_spacing"><span id="iqrpgbs_dropalyse_actioncount">0</span> Actions</div>


    <div id="iqrpgbs_dropalyse_options">[<a id="iqrpgbs_dropalyse_opt_hour" href="#">Hour</a>
    - <a id="iqrpgbs_dropalyse_opt_day" href="#">Day</a>
    - <a id="iqrpgbs_dropalyse_opt_total" href="#">Total</a>]
    [<a id="iqrpgbs_dropalyse_backup_toggle" href="#">Options</a>]
    [<a id="iqrpgbs_dropalyse_reset" href="#">Reset</a>]</div>

    <div id="iqrpgbs_dropalyse_backup_panel" style="margin-top:12px;display:none;">

    <p class="heading">Drop Filters</p>
    <p>You can filter out drops that you're not interested in tracking by entering them, one per line, in the field below. e.g. to filter out goblin keys, you would enter Goblin Cave Key on a new line, then click the update button</p>
    <textarea rows="5" placeholder="Enter one filter per line..." style="width:100%;margin-top:6px;height: auto;" id="iqrpgbs_dropalyse_filter_textarea"></textarea>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_update_filters">Update Filters</button></p>
    <p>&nbsp;</p>

    <p class="heading">Backup &amp; Restore Drops</p>
    <p>You can download a copy of your drop data by clicking the button below...</p>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_export">Backup Data</button></p>
    <p>To restore your data, paste the contents of your backup file into the field below and click the button</p>
    <textarea placeholder="" style="width:100%;margin-top:6px;" id="iqrpgbs_dropalyse_import_textarea"></textarea>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_import">Restore Data</button></p>

    </div>

    </div></div></div>`;
    $(html).insertAfter($('div.game-grid > div:first > div.main-section').last());
    dropalyse_render_filters();

    // setup format options and events
    dropalyse_set_format(dropalyse_format); // set the initial format
    document.getElementById('iqrpgbs_dropalyse_opt_hour').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('hour'); });
    document.getElementById('iqrpgbs_dropalyse_opt_day').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('day'); });
    document.getElementById('iqrpgbs_dropalyse_opt_total').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('total'); });
    document.getElementById('iqrpgbs_dropalyse_reset').addEventListener("click", function(e) { e.preventDefault(); dropalyse_reset(); });
    document.getElementById('iqrpgbs_dropalyse_but_export').addEventListener("click", function(e) { e.preventDefault(); dropalyse_export_data(); });
    document.getElementById('iqrpgbs_dropalyse_but_import').addEventListener("click", function(e) { e.preventDefault(); dropalyse_import_data(); });
    $('a#iqrpgbs_dropalyse_backup_toggle').click(function(e){
        e.preventDefault();
        $("div#iqrpgbs_dropalyse_backup_panel").toggle();
        $('a#iqrpgbs_dropalyse_backup_toggle').toggleClass( "iqrpgbs_highlight" );
    });
    document.getElementById('iqrpgbs_drop_log_header').addEventListener("click", function(e) {
        e.preventDefault();
        $("div#iqrpgbs_drop_log_body").toggle();
        $("div#iqrpgbs_drop_log_header > p > span.grey-text").toggle();
    });
    document.getElementById('iqrpgbs_dropalyse_but_update_filters').addEventListener("click", function(e) { e.preventDefault(); dropalyse_update_filters(); });
}

function dropalyse_set_format(format) {
    $('a#iqrpgbs_dropalyse_opt_hour').removeClass("iqrpgbs_highlight");
    $('a#iqrpgbs_dropalyse_opt_day').removeClass("iqrpgbs_highlight");
    $('a#iqrpgbs_dropalyse_opt_total').removeClass("iqrpgbs_highlight");
    if(format==='hour') {
        dropalyse_format = 'hour';
        $('a#iqrpgbs_dropalyse_opt_hour').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('Drops Per Hour');
    } else if(format==='day') {
        dropalyse_format = 'day';
        $('a#iqrpgbs_dropalyse_opt_day').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('Drops Per Day');
    } else if(format==='total') {
        dropalyse_format = 'total';
        $('a#iqrpgbs_dropalyse_opt_total').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('Drops - Total');
    }
    dropalyse_render_content(); // update view
}

// DELETE ME
/* function dropalyse_get_time_elapsed() {
    return ( Date.now() - dropalyse_start_datum )/1000;
} */

function dropalyse_render_nice_timer(delta) {
    //var delta = dropalyse_get_time_elapsed();
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;
    let html = '';
    if(days>0) html += days + 'd ';
    if(hours>0||days>0) html += hours + 'h ';
    if(hours>0||days>0||minutes>0) html += minutes + 'm ';
    html += Math.floor(seconds) + 's';
    return html;
}

function dropalyse_render_filters() {
    //document.getElementById("iqrpgbs_dropalyse_filter_textarea").value = escapeHTML(dropalyse_filters.join("\r\n"));
    // don't need to escape it as long as we set it using .value = 'stuffs'
    document.getElementById("iqrpgbs_dropalyse_filter_textarea").value = dropalyse_filters.join("\r\n");
}

function dropalyse_update_filters() {
    let our_filters = document.getElementById("iqrpgbs_dropalyse_filter_textarea").value;
    dropalyse_filters = our_filters.trim().split(/\r?\n/).map(s => s.trim());
    dropalyse_save_ls(); // save to ls
    dropalyse_render_content(); // render drops again
    // hide panel - don't hide it?
    $("div#iqrpgbs_dropalyse_backup_panel").hide();
    $('a#iqrpgbs_dropalyse_backup_toggle').removeClass( "iqrpgbs_highlight" );
}

function dropalyse_import_data() {

    // get and test for empty data
    let our_data = document.getElementById("iqrpgbs_dropalyse_import_textarea").value;
    if(our_data=='') return false; // blank data
    // catch errors on parsing
    try {
        let backup = JSON.parse(our_data);
        // let's set the new vals
        dropalyse_cache = ''; // reset cache to '' so we can pull fresh data in, in our main loop
        dropalyse_store = backup.dropalyse_store;
        if(backup.dropalyse_filters) dropalyse_filters = backup.dropalyse_filters;
        if(backup.dropalyse_actions) { // if actions, use them
            actions = backup.dropalyse_actions;
        } else if(backup.dropalyse_start_datum) { // approximate actions from old timing data
            let start_datum = ( Date.now() - Number(backup.dropalyse_backup_datum)) + Number(backup.dropalyse_start_datum);
            actions = Math.floor((( Date.now() - start_datum ) / 1000) /6 );
        } else {
            actions = 0;
            console.log('Drop Tracker could not determine action count from backup, reseting it to 0 as a fallback!');
        }
        //dropalyse_start_datum = ( Date.now() - Number(backup.dropalyse_backup_datum)) + Number(backup.dropalyse_start_datum);
        // all done, let's re-render the tracker
        dropalyse_render_content();
        $("div#iqrpgbs_dropalyse_backup_panel").hide();
        $('a#iqrpgbs_dropalyse_backup_toggle').removeClass( "iqrpgbs_highlight" );
        document.getElementById("iqrpgbs_dropalyse_import_textarea").value = '';
    } catch(e) {
        alert("Backup data does not appear to be valid JSON!"); // error in the above string (in this case, yes)!
        return false;
    }

}

function dropalyse_export_data() {

    const backup = {
        dropalyse_cache: dropalyse_cache,
        dropalyse_store: dropalyse_store,
        dropalyse_actions: actions,
        dropalyse_filters: dropalyse_filters,
        dropalyse_version: GM_info.script.version,
        dropalyse_backup_datum: Date.now()
    };

    // Convert object to Blob
    const blobConfig = new Blob(
        [ JSON.stringify(backup) ],
        { type: 'text/json;charset=utf-8' }
    )

    // Convert Blob to URL
    const blobUrl = URL.createObjectURL(blobConfig);

    // Create an a element with blobl URL
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.target = "_blank";
    anchor.download = "IQRPG-Stats-" + Date.now() + ".json";

    // Auto click on a element, trigger the file download
    anchor.click();

    // Don't forget ;)
    URL.revokeObjectURL(blobUrl);
}

// Dropalyse item order
function dropalyse_objectOrder() {
    return {
        // attributes
        'Health': 0, 'Attack': 0, 'Defence':0, 'Accuracy':0, 'Dodge':0,
        // credits
        'Credits':0, 'Bound Credits':0, 'Dungeoneering Tokens#iqrpgstats#text-rarity-1':0,
        // components + gather shards
        'Weapon Component#iqrpgstats#text-rarity-2': 0, 'Armor Component#iqrpgstats#text-rarity-2': 0, 'Tool Component#iqrpgstats#text-rarity-2':0, 'Gathering Skill Shard#iqrpgstats#text-rarity-2':0,
        'Resource Cache#iqrpgstats#text-rarity-2': 0,
        'Gem Fragments#iqrpgstats#text-rarity-2': 0,
        'Trinket Fragments#iqrpgstats#text-rarity-3': 0,
        'Runic Leather#iqrpgstats#text-rarity-4':0,
        // keys
        'Goblin Cave Key#iqrpgstats#text-rarity-2': 0,
        'Mountain Pass Key#iqrpgstats#text-rarity-2': 0,
        'Desolate Tombs Key#iqrpgstats#text-rarity-2':0,
        'Dragonkin Lair Key#iqrpgstats#text-rarity-2':0,
        'Sunken Ruins Key#iqrpgstats#text-rarity-2':0,
        'Abandoned Tower Key#iqrpgstats#text-rarity-3':0,
        'Haunted Cells Key#iqrpgstats#text-rarity-3':0,
        'Hall Of Dragons Key#iqrpgstats#text-rarity-3':0,
        'The Vault Key#iqrpgstats#text-rarity-4':0,
        'The Treasury Key#iqrpgstats#text-rarity-4':0,
        // upgrade stones
        'Health Upgrade Stone#iqrpgstats#text-rarity-3': 0,
        'Damage Upgrade Stone#iqrpgstats#text-rarity-4': 0,
        // wood drops - in alchemy?
        // stone drops
        'Sandstone#iqrpgstats#text-rarity-2': 0,
        'Marble#iqrpgstats#text-rarity-3': 0,
        'Malachite#iqrpgstats#text-rarity-4':0,
        // metal drops
        'Sapphire#iqrpgstats#text-rarity-2':0,
        'Ruby#iqrpgstats#text-rarity-3':0,
        'Emerald#iqrpgstats#text-rarity-3':0,
        'Diamond#iqrpgstats#text-rarity-4':0,
        // alchemy ingrediants
        'Tree Sap#iqrpgstats#text-rarity-2': 0,
        'Spider Egg#iqrpgstats#text-rarity-2': 0,
        'Bone Meal#iqrpgstats#text-rarity-2': 0,
        'Vial Of Orc Blood#iqrpgstats#text-rarity-3': 0,
        'Undead Heart#iqrpgstats#text-rarity-3': 0,
        "Bird's Nest#iqrpgstats#text-rarity-3": 0,
        'Alchemic Essence#iqrpgstats#text-rarity-3': 0,
        'Golden Egg#iqrpgstats#text-rarity-4': 0,
        'Demonic Dust#iqrpgstats#text-rarity-4': 0,
        // potions
        'Training Gathering Potion#iqrpgstats#text-rarity-2':0,
        'Training Exp Potion#iqrpgstats#text-rarity-2':0,
        'Minor Gathering Potion#iqrpgstats#text-rarity-2':0,
        'Minor Exp Potion#iqrpgstats#text-rarity-2':0,
        'Haste Potion#iqrpgstats#text-rarity-3':0,
        'Minor Autos Potion#iqrpgstats#text-rarity-3':0,
        'Aptitude Potion#iqrpgstats#text-rarity-3':0,
        'Greater Exp Potion#iqrpgstats#text-rarity-3':0,
        'Heroic Potion#iqrpgstats#text-rarity-4':0,
        'Ultra Exp Potion#iqrpgstats#text-rarity-4':0,
        // runes
        'Training Rune 1#iqrpgstats#text-rarity-2':0,
        'Training Rune 2#iqrpgstats#text-rarity-2':0,
        'Training Rune 3#iqrpgstats#text-rarity-2':0,
        'Training Rune 4#iqrpgstats#text-rarity-2':0,
        'Rune Of The Warrior#iqrpgstats#text-rarity-3':0,
        'Rune Of The Gladiator#iqrpgstats#text-rarity-3':0,
        'Rune Of The Warlord#iqrpgstats#text-rarity-4':0,
        'Rune Of The Overlord#iqrpgstats#text-rarity-4':0,
        'Greater Rune Of The Warlord#iqrpgstats#text-rarity-5':0,
        // jewels
        'Sapphire Jewel#iqrpgstats#text-rarity-1':0,
        'Sapphire Jewel#iqrpgstats#text-rarity-2':0,
        'Sapphire Jewel#iqrpgstats#text-rarity-3':0,
        'Sapphire Jewel#iqrpgstats#text-rarity-4':0,
        'Sapphire Jewel#iqrpgstats#text-rarity-5':0,
        'Sapphire Jewel#iqrpgstats#text-rarity-6':0,
        'Ruby Jewel#iqrpgstats#text-rarity-1':0,
        'Ruby Jewel#iqrpgstats#text-rarity-2':0,
        'Ruby Jewel#iqrpgstats#text-rarity-3':0,
        'Ruby Jewel#iqrpgstats#text-rarity-4':0,
        'Ruby Jewel#iqrpgstats#text-rarity-5':0,
        'Ruby Jewel#iqrpgstats#text-rarity-6':0,
        'Emerald Jewel#iqrpgstats#text-rarity-1':0,
        'Emerald Jewel#iqrpgstats#text-rarity-2':0,
        'Emerald Jewel#iqrpgstats#text-rarity-3':0,
        'Emerald Jewel#iqrpgstats#text-rarity-4':0,
        'Emerald Jewel#iqrpgstats#text-rarity-5':0,
        'Diamond Jewel#iqrpgstats#text-rarity-1':0,
        'Diamond Jewel#iqrpgstats#text-rarity-2':0,
        'Diamond Jewel#iqrpgstats#text-rarity-3':0,
        'Diamond Jewel#iqrpgstats#text-rarity-4':0,
        'Diamond Jewel#iqrpgstats#text-rarity-5':0,
        // res cache??
    }
}

///////////////////////////////////
// Battle Stats
///////////////////////////////////

function parse_player_stat_line(player_sl) {
    var hits = player_sl.find("p:nth-child(1) > span:nth-child(2)");
    if(hits.length > 0) {
        var actual_hits = hits.prop('innerHTML').replaceAll(" time(s)", "");
        player_stats.hits += parseInt(actual_hits);
    }
    var dmg = player_sl.find("p:nth-child(1) > span:nth-child(3)");
    if(dmg.length > 0 && hits.length > 0) {
        var actual_dmg = dmg.prop('innerHTML').replaceAll(" damage", "").replaceAll(",", "");
        player_stats.dmg += parseInt(actual_dmg) * parseInt(actual_hits);
    }
    var misses = player_sl.find("p:nth-child(2) > span:nth-child(1)");
    if(misses.length > 0) {
        var actual_misses = misses.prop('innerHTML').replaceAll(" time(s)", "");
        player_stats.misses += parseInt(actual_misses);
    }
}

function parse_enemy_stat_line(stat_line) {
    var hits = stat_line.find("p:nth-child(1) > span:nth-child(2)");
    if(hits.length > 0) {
        var actual_hits = hits.prop('innerHTML').replaceAll(" time(s)", "");
        enemy_stats.hits += parseInt(actual_hits);
    }
    var dmg = stat_line.find("p:nth-child(1) > span:nth-child(3)");
    if(dmg.length > 0 && hits.length > 0) {
        var actual_dmg = dmg.prop('innerHTML').replaceAll(" damage", "").replaceAll(",", "");
        enemy_stats.dmg += parseInt(actual_dmg) * parseInt(actual_hits);
    }
    var misses = stat_line.find("p:nth-child(2) > span:nth-child(2)");
    if(misses.length > 0) {
        var actual_misses = misses.prop('innerHTML').replaceAll(" time(s)", "");
        enemy_stats.misses += parseInt(actual_misses);
    }
    var dodges = stat_line.find("p:nth-child(2) > span:nth-child(3)");
    if(dodges.length > 0) {
        var actual_dodges = dodges.prop('innerHTML').replaceAll(" attack(s)", "");
        enemy_stats.dodges += parseInt(actual_dodges);
    }
}

function iqrpg_bs_reset_stats(e) {
    e.preventDefault();
    player_stats.dmg = 0;
    player_stats.hits = 0;
    player_stats.misses = 0;
    player_stats.hp_perc = 100;
    enemy_stats.dmg = 0;
    enemy_stats.hits = 0;
    enemy_stats.misses = 0;
    enemy_stats.dodges = 0;
    update_display();
}

function update_display() {
    // players
    $("#iqrpgbs_pl_dmg").html(new Intl.NumberFormat().format(player_stats.dmg));
    $("#iqrpgbs_pl_hits").html(new Intl.NumberFormat().format(player_stats.hits));
    var avg = Math.round(player_stats.dmg / player_stats.hits) || 0;
    $("#iqrpgbs_pl_avg").html(new Intl.NumberFormat().format(avg));
    var acc = (player_stats.hits / (player_stats.hits + player_stats.misses))*100 || 0;
    $("#iqrpgbs_pl_acc").html(new Intl.NumberFormat().format(acc.toFixed(2)));
    let min_hp = player_stats.hp_perc || 0;
    $("#iqrpgbs_min_hp").html(new Intl.NumberFormat().format(min_hp));

    // enemy
    var enemy_avg = Math.round(enemy_stats.dmg / enemy_stats.hits) || 0;
    $("#iqrpgbs_enmy_avg").html(new Intl.NumberFormat().format(enemy_avg));
    var enemy_acc = ( (enemy_stats.hits + enemy_stats.dodges) / (enemy_stats.hits + enemy_stats.misses + enemy_stats.dodges))*100 || 0;
    $("#iqrpgbs_enmy_acc").html(new Intl.NumberFormat().format(enemy_acc.toFixed(2)));
    var enemy_dodges = (enemy_stats.dodges / (enemy_stats.hits /*+ enemy_stats.misses*/ + enemy_stats.dodges))*100 || 0;
    $("#iqrpgbs_enmy_dodges").html(new Intl.NumberFormat().format(enemy_dodges.toFixed(2)));

    // extras
    if(track_extra_battle_stats===true) {
        // hits to kill
        let hits_to_kill_enemy = (enemy_stats.max_hp / avg);
        let attk_next_breakpoint = enemy_stats.max_hp / (Math.ceil(hits_to_kill_enemy)-1)
        let p_dmg_delta = attk_next_breakpoint - avg + 1;
        $("#iqrpgbs_attk_delta").html("You kill in " + Number(Math.ceil(hits_to_kill_enemy)).toString() + " hits"
                                      + ", to improve winrate increase avg dmg by " + Intl.NumberFormat().format(Math.ceil(p_dmg_delta)) );

        // survive longer
        let hits_to_die = Math.ceil(player_stats.max_hp / enemy_avg);
        let p_def_delta = enemy_avg - Math.ceil(player_stats.max_hp / (hits_to_die+0.0000001) );
        $("#iqrpgbs_def_delta").html("You die in " + Number(hits_to_die).toString() + " hits"
                                     + ", to improve winrate reduce avg incoming dmg by " + Intl.NumberFormat().format(p_def_delta) );
    }
}

function render_battle_stats_panel() {
    var content = `
<div id="iqrpgbs_bs_panel" class="margin-top-large">
<div>Battle Stats <span>by Coastis</span></div>
<div>You dealt a total of <span id="iqrpgbs_pl_dmg">0</span> damage in <span id="iqrpgbs_pl_hits">0</span> hits,
with an average of <span id="iqrpgbs_pl_avg">0</span> per hit and <span id="iqrpgbs_pl_acc">0</span>% accuracy</div>
<div>Enemy dealt an average of <span id="iqrpgbs_enmy_avg">0</span> per hit
with an accuracy of <span id="iqrpgbs_enmy_acc">0</span>%, and you dodged <span id="iqrpgbs_enmy_dodges">0</span>% of attacks</div>
`;
    if(track_min_health_perc === true) content += '<div>Your health reached a low of <span id="iqrpgbs_min_hp">100</span>%</div>';

    if(track_extra_battle_stats === true) {
        content += '<div><span id="iqrpgbs_attk_delta"></span></div>'
            + '<div><span id="iqrpgbs_def_delta"></span></div>';
    }

    content += '<div>[<a href="#" id="igrpg_bs_reset">Reset Battle Stats</a>]</div>';
    content += '</div>';
    return content;
}

GM_addStyle ( `
    div#iqrpgbs_bs_panel div { text-align:center;padding:1px;}
    div#iqrpgbs_bs_panel div:nth-child(1) { font-weight:bold;}
    div#iqrpgbs_bs_panel div:nth-child(1) span { font-size:8px;font-weight:normal;}
    div#iqrpgbs_drop_log_header {display: flex; justify-content: center; align-items: center; padding: .5rem; background: linear-gradient(#000,#151515);}
div#iqrpgbs_dropalyse_timer { padding:2px; margin-top:4px; text-align:center; }
.iqrpgbs_dropalyse_spacing { padding:2px; margin-top:4px; text-align:center; }
div#iqrpgbs_dropalyse_options { padding:2px; text-align:center; }
.iqrpgbs_highlight { color:#3c3 !important; }
div.iqrpgbs_hover_highlight:hover { background-color:#222222; }
` );

