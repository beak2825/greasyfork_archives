// ==UserScript==
// @name          Villains utilities
// @namespace     Kyle
// @version       1.0
// @description   Useful utilities for the Facebook game Fvillains
// @match         https://fb-villains.uken.com/*
// @match         https://villains.uken.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31572/Villains%20utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/31572/Villains%20utilities.meta.js
// ==/UserScript==

var version = 0.1;

var authenticity_token = document.querySelectorAll("input[name='authenticity_token']")[0].value;

var mission_bot = 0;
var mission_id = 0;
var mission_cost = 0;
var battle_bot = 0;
var min_stamina = 0;
var invasion_bot = 0;
var invasion_health = 0;
var invasion_time = 0;
var heal_bot = 0;
var min_health = 0;
var collect_bot = 0;

var fighting_boss = false;

function conlog(text) {
    if(console && console.log) {
        console.log(text);
    }

    var d = new Date();
    var newlog = '['+(d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes()+':'+(d.getSeconds()<10?'0':'')+d.getSeconds()+'] '+text;
    var el_conlog = $('#conlog');

    if(el_conlog.length == 1) {
        if(el_conlog.html() && el_conlog.html().length > 0) {
            var curlog = el_conlog.html().split('<br>');
            if(curlog.length > 0) {
                newlog = curlog[1] + '<br />' + newlog;
            } else {
                newlog = el_conlog.html() + '<br />' + newlog;
            }
        }

        $('#conlog').html(newlog);
    }
}

function condeb(text) {
    if(console && console.debug) {
        console.debug(text);
    }

    var d = new Date();
    var newlog = '['+(d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes()+':'+(d.getSeconds()<10?'0':'')+d.getSeconds()+'] '+text;
    var el_deblog = $('#deblog');

    if(el_deblog.length == 1) {
        if(el_deblog.html() && el_deblog.html().length > 0) {
            var curlog = el_deblog.html().split('<br>');
            if(curlog.length > 0) {
                newlog = curlog[1] + '<br />' + newlog;
            } else {
                newlog = el_deblog.html() + '<br />' + newlog;
            }
        }

        $('#deblog').html(newlog);
    }
}

function do_action(action) {
    $(document.body).append('<form id="secretForm" action="'+action+'" method="post">'+
                            '<input name="authenticity_token" value="'+authenticity_token+'">'+
                            '</form>');
    $("#secretForm").submit();
}

function do_mission(mission_id) {
    conlog('Doing mission '+mission_id+'..');
    do_action('/missions/attempt?mission='+mission_id);
}

function npc_attack() {
    if(fighting_boss == true && $('input[name=npc_id]').length > 0 && $('#npc_current_health').length > 0) {
        var npc_id = parseInt($('input[name=npc_id]').val());
        // condeb('npc_id '+npc_id);

        var boss_health = parseInt($('#npc_current_health').attr('style').match(/(\d+).*\%/)[1]);
        condeb('boss_health '+boss_health);

        $('#npc_current_health div').html(boss_health+'%');

        if(boss_health == 0) {
            fighting_boss = false;
            conlog('Boss died!');
            conlog($('#log_contents .log_entries')[0]);
            conlog($('#log_contents .log_entries')[1]);
            window.location.href = '/home';
            return;
        } else if(boss_health <= invasion_health) {
            // Check if the villains health is <= set health %, if so attack him!
            conlog('Attacking boss!');
            $('#npc_attack_btn form').submit();
        }

        // We need to keep polling
        setTimeout(function(){npc_attack();}, 100);
    } else {
        fighting_boss = false;
    }
}

function repeated_checks() {
    condeb('repeated_checks');

    if(fighting_boss == true) {
        if($('#npc_middle').length == 0) {
            fighting_boss = false;
        } else {
            setTimeout(function(){repeated_checks();}, 1000);
            return;
        }
    } else if($('#npc_middle').length == 1 && fighting_boss == false) {
        // We are on a boss fight page
        var boss_health = parseInt($('#npc_current_health').attr('style').match(/(\d+).*\%/)[1]);

        if(boss_health > 0) {
            fighting_boss = true;
            npc_attack();
        }
    }

    if(collect_bot) {
        var money_bar = $('#money_bar > div > a.loader');
        if(money_bar.length == 1 && money_bar.attr('href') == '/empire') {
            // There is money to collect!
            conlog('There is money to collect!');
            window.location.href = money_bar.attr('href');
            return;
        }
    }

    if(heal_bot && U_HEALTH < min_health) {
        conlog('health '+U_HEALTH+' < '+min_health);
        do_action('/regeneration_chamber/regenerate?type=full');
        return;
    }

    if(mission_bot && U_ENERGY >= mission_cost) {
        // Do mission
        do_mission(mission_id);
        return;
    }

    if(battle_bot && U_STAMINA > min_stamina) {
        if($('div#battle_list_container table#battle_list').length == 0) {
            conlog('Time for PvP!');
            window.location.href = '/battles';
            return;
        } else if($('div#battle_list_container table#battle_list').length == 1) {
            conlog('Looking for an opponent..');
            var found = false;

            $.each($('#battle_list tr'),function(index,value){
                if(found == false) {
                    var player = $('.profile',value).html();
                    var level = $('p',value).html().split(' ')[1];
                    var winloss = $('b',value).html().split(' ');
                    var wins = winloss[0].substr(0,winloss[0].length-1);
                    var loss = winloss[2].substr(0,winloss[2].length-1);

                    if(level <= (U_LEVEL+1)) {
                        if(loss < (wins-1)) {
                            // If opponent is lower level, has a smaller alliance, and has lost alot..
                            // Attack him!
                            conlog('Attacking '+player);
                            $('form',value).submit();
                            found = true;
                        }
                    }
                }
            });
        }
    }

    if(invasion_bot) {
        if($('table#npc_list').length > 0) {
            // Check if there's an active invasion
            conlog('Looking for an invasion..');
            var found = false;

            $.each($('#npc_list tr'),function(index,value){
                if(found == false) {
                    if($('.main_button',value).length > 0) {
                        conlog('Found an ongoing invasion!');
                        $('.npc_listing',value).submit();
                    }
                }
            });
        } else if($('div#npc_container').length == 0) {
            // If we're not on a boss fight already, go to invasion page
            var invasion_timer = GM_getValue('fow_invasion_timer',60);
            condeb('invasion_timer '+invasion_timer);
            var invasion_timer_max = GM_getValue('fow_invasion_timer_max',60);

            if(invasion_timer < invasion_timer_max) {
                // To only check every X seconds
                invasion_timer++;
                $('#invasion_timer').html(', checking in <strong>'+(invasion_timer_max-invasion_timer)+'</strong> seconds');
                GM_setValue('fow_invasion_timer',invasion_timer);
            } else {
                invasion_timer = 0;
                GM_setValue('fow_invasion_timer',invasion_timer);
                conlog('Check for invasion..');
                window.location.href = '/bounties';
                return;
            }
        }
    }

    setTimeout(function(){repeated_checks();}, 1000);
}

$(document).ready( function() {
    conlog('-[ FOW Utils v'+version+' initializing ]-');

    $('#body .fb-like').hide();

    // Load settings
    collect_bot = GM_getValue('fow_collect_bot',0);
    mission_bot = GM_getValue('fow_mission_bot',0);
    mission_id = GM_getValue('fow_mission_id','');
    mission_cost = GM_getValue('fow_mission_cost',0);
    battle_bot = GM_getValue('fow_pvp_bot',0);
    min_stamina = GM_getValue('fow_min_stamina',0);
    invasion_bot = GM_getValue('fow_invasion_bot',0);
    invasion_health = GM_getValue('fow_invasion_health',0);
    invasion_timer_max = GM_getValue('fow_invasion_timer_max',60);
    heal_bot = GM_getValue('fow_heal_bot',0);
    min_health = GM_getValue('fow_min_health',0);

    conlog('collect_bot '+collect_bot);
    conlog('mission_bot '+mission_bot);
    conlog('mission_id '+mission_id);
    conlog('mission_cost '+mission_cost);
    conlog('battle_bot '+battle_bot);
    conlog('min_stamina '+min_stamina);
    conlog('invasion_bot '+invasion_bot);
    conlog('invasion_health '+invasion_health);
    conlog('invasion_timer_max '+invasion_timer_max);
    conlog('heal_bot '+heal_bot);
    conlog('min_health '+min_health);

    // Initialize data
    authenticity_token = $('meta[name=csrf-token]').attr('content');

    if($('#npc_middle').length > 0) {
        fighting_boss = true;
        // We are on a boss fight page
        npc_attack();
    }

    if(collect_bot && $('form[action=/empire/collect_income]').length > 0) {
        // There's money to collect!
        conlog('Collecting money..');
        do_action('/empire/collect_income');
        return;
    }

    // Run main loop
    repeated_checks();

    // Inject controls
    var el = document.createElement( 'div' );
    el.id = 'fow_bot_settings';
    el.style.zIndex = 99;
    el.style.position = 'fixed';
    el.style.top = 0;
    el.style.left = 0;
    el.style.padding = '5px';
    el.style.width = '100%';
    el.style.height = '110px';
    el.style.backgroundColor = 'rgba(0,0,0,0.75)';
    el.style.color = 'white';
    el.innerHTML = '';

    el_left = document.createElement( 'div' );
    el_left.id = 'fow_bot_settings_left';
    el_left.style.verticalAlign = 'top';
    el_left.style.display = 'inline-block';
    el_left.style.width = '49%';
    el_left.innerHTML = '';
    el_left.innerHTML += '<input id="collect_bot" type="checkbox"'+(collect_bot?' checked':'')+' /> Automatically collect income<br />';
    el_left.innerHTML += '<input id="mission_bot" type="checkbox"'+(mission_bot?' checked':'')+' /> Mission bot &nbsp; ID <input id="mission_id" type="text" value="'+mission_id+'" placeholder="ID" size="4" /> &nbsp; Cost <input id="mission_cost" type="text" value="'+mission_cost+'" placeholder="Cost" size="3" /> energy<br />';
    el_left.innerHTML += '<input id="battle_bot" type="checkbox"'+(battle_bot?' checked':'')+' /> PvP bot &nbsp; When above <input id="min_stamina" type="text" value="'+min_stamina+'" placeholder="" size="4" /> stamina<br />';
    el_left.innerHTML += '<input id="invasion_bot" type="checkbox"'+(invasion_bot?' checked':'')+' /> Invasion bot &nbsp; Attack at <input id="invasion_health" type="text" value="'+invasion_health+'" placeholder="" size="3" />% health or below<br />';
    el_left.innerHTML += '<input id="heal_bot" type="checkbox"'+(heal_bot?' checked':'')+' /> Heal me if below <input id="min_health" type="text" value="'+min_health+'" placeholder="0" size="6" /> health<br />';
    el_left.innerHTML += 'Check for invasion every <input id="invasion_timer_max" type="text" value="'+invasion_timer_max+'" size="3" /> seconds<span id="invasion_timer"></span><br />';

    el_right = document.createElement( 'div' );
    el_right.id = 'fow_bot_settings_right';
    el_left.style.verticalAlign = 'top';
    el_right.style.display = 'inline-block';
    el_right.style.width = '49%';
    el_right.innerHTML = '';
    el_right.innerHTML += 'Status:<br /><span id="conlog"></span><br />';
    el_right.innerHTML += '<br />';
    el_right.innerHTML += 'Debug:<br /><span id="deblog"></span><br />';

    el.appendChild(el_left);
    el.appendChild(el_right);
    document.body.appendChild(el);

    $('#fow_bot_settings #collect_bot').bind('change',function(){
        collect_bot = !collect_bot;GM_setValue('fow_collect_bot',collect_bot);
        condeb('collect_bot '+collect_bot);
    });
    $('#fow_bot_settings #mission_bot').bind('change',function(){
        mission_bot = !mission_bot;GM_setValue('fow_mission_bot',mission_bot);
        condeb('mission_bot '+mission_bot);
    });
    $('#fow_bot_settings #mission_id').bind('change',function(){
        mission_id = $('#fow_bot_settings #mission_id').val();
        GM_setValue('fow_mission_id',mission_id);
        condeb('mission_id '+mission_id);
    });
    $('#fow_bot_settings #mission_cost').bind('change',function(){
        mission_cost = $('#fow_bot_settings #mission_cost').val();
        GM_setValue('fow_mission_cost',mission_cost);
        condeb('mission_cost '+mission_cost);
    });
    $('#fow_bot_settings #battle_bot').bind('change',function(){
        battle_bot = !battle_bot;GM_setValue('fow_pvp_bot',battle_bot);
        condeb('battle_bot '+battle_bot);
    });
    $('#fow_bot_settings #min_stamina').bind('change',function(){
        min_stamina = $('#fow_bot_settings #min_stamina').val();
        GM_setValue('fow_min_stamina',min_stamina);
        condeb('min_stamina '+min_stamina);
    });
    $('#fow_bot_settings #invasion_bot').bind('change',function(){
        invasion_bot = !invasion_bot;GM_setValue('fow_invasion_bot',invasion_bot);
        condeb('invasion_bot '+invasion_bot);
    });
    $('#fow_bot_settings #invasion_health').bind('change',function(){
        invasion_health = $('#fow_bot_settings #invasion_health').val();
        GM_setValue('fow_invasion_health',invasion_health);
        condeb('invasion_health '+invasion_health);
    });
    $('#fow_bot_settings #invasion_timer_max').bind('change',function(){
        invasion_timer_max = $('#fow_bot_settings #invasion_timer_max').val();
        GM_setValue('fow_invasion_timer_max',invasion_timer_max);
        condeb('invasion_timer_max '+invasion_timer_max);
    });
    $('#fow_bot_settings #heal_bot').bind('change',function(){
        heal_bot = !heal_bot;GM_setValue('fow_heal_bot',heal_bot);
        condeb('heal_bot '+heal_bot);
    });
    $('#fow_bot_settings #min_health').bind('change',function(){
        min_health = $('#fow_bot_settings #min_health').val();
        GM_setValue('fow_min_health',min_health);
        condeb('min_health '+min_health);
    });
});