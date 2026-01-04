// ==UserScript==
// @name         Lepsze zbieranie
// @namespace    http://tampermonkey.net/
// @version      2.00
// @description  Ulatwia zbieranie
// @author       PTS
// @match        https://*.plemiona.pl/game.php*screen=place*mode=scavenge*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415456/Lepsze%20zbieranie.user.js
// @updateURL https://update.greasyfork.org/scripts/415456/Lepsze%20zbieranie.meta.js
// ==/UserScript==



console.log('Hello there!');

var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
var i_count = 0

$(document.body).on('click','#beep',function() {
        $("#beep").text("Alarm aktywny")
        $("#beep").prop('disabled',true)
        var interval = setInterval(function() {
            let items = $(".free_send_button").length
            console.log(i_count++)
            if (items >= 3) {snd.play()}
        }, 1000);
    })

var units;
var units_fields;
var duration_factor;
var autofire = sessionStorage.getItem('autofire') || 0

$("#content_value").prepend(`<div id="jednostki"></div>`);

$("#jednostki").html(`<h2>Wybierz jednostki które mają zbierać:</h2>
<table class="table jednostki">
   <tr>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_spear.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_sword.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_archer.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_axe.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_light.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_marcher.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_heavy.png"</img></th>
      <th><img src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_knight.png"</img></th>
   </tr>
   <tr>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
   </tr>
</table>
<button id ='action' style='font-size: 32px; width:100%;'>Pojedyncze uruchomienie</button><br><br><button id ='beep' style='font-size: 32px; width:100%;'>Aktywuj alarm</button>`);

function update_cookie() {
    var cookie_data = getCookie('scav_'+game_data.world)
    if (cookie_data != null) {
        ktore_jednostki = JSON.parse(cookie_data)
    } else {
        ktore_jednostki = [true,true,true,true,true,true,true,true]
    }
}

update_cookie();

function value_max(bool) {
    if (bool == true) {return "9999"} else {return "0"}
}

$("table.jednostki input").each(function(index) {
        this.checked = ktore_jednostki[index]
    })

$(document.body).on('click','table.jednostki input',function() {
    jednostki = []
    $("table.jednostki input").each(function(index) {
        jednostki.push(this.checked)
    })
    setCookie('scav_'+game_data.world,JSON.stringify(jednostki),9999)
    update_cookie()
})


$(document.body).on('update keyup','#autofire',function() {sessionStorage.setItem('autofire',parseInt($(this).val()))})

$("#action").on('click',function(){
    do_action();
});

var spear_num = parseInt($("#content_value").find('a.units-entry-all[data-unit="spear"]').text().trim().replace('(','').replace(')',''))
var def_flag
if (spear_num > 200) {
   def_flag = true
} else {
   def_flag = false
}

duration_factor = $("script:contains('Ambitni amatorzy')").html();
duration_factor = duration_factor.substring(duration_factor.indexOf('duration_factor')+17);
duration_factor = duration_factor.substring(0,12);
console.log('duration_factor: '+duration_factor);

var villages
var timer

setTimeout(function () {
villages = $(document.body).find("#selected_popup_village").closest('tbody').find('tr').length
console.log(autofire)
console.log(villages)
if (autofire > 0 && villages > 0) {
       timer = setInterval(function(){ do_action(); }, 500);
    } else {
        sessionStorage.setItem('autofire',0)
    }
},700)
function do_action() {
    units = 0;
    units_fields = $("a.units-entry-all.squad-village-required");
    $.each(units_fields,function() {
        units += parseInt($(this).text().replace('(','').replace(')',''));
    });
    console.log(units);
    console.log($(".free_send_button").length);
    if ($(".free_send_button").length == 0 || units < 11) {
        $("#village_switch_right")[0].click();
    }
    if ($(".free_send_button").length > 0 && units > 150) {
        if ($(".carry-max").html() == '0') {
            //$("a:contains('Zbieractwo ALL')")[0].click();
            scavenge_me();
        }
        else {
            $(".free_send_button").last().click();
        }
    }
    if ($(".free_send_button").length > 0 && units > 10 && units <= 150) {
        if ($(".carry-max").html() == '0') {
            scavenge_me();
        }
        else {
            $(".free_send_button").last().click();
        }
    }
    if ($(".free_send_button").length = 0 || units < 11) {
        $("#village_switch_right")[0].click();
    }
}

$(document).on('keydown', function (e) {
        if(e.which == 118){
            timer = setInterval(function(){ do_action(); }, 500);
        }
    });
$(document).on('keydown', function (e) {
        if(e.which == 119){
            clearInterval(timer)
            sessionStorage.setItem('autofire',0)
        }
});

(function() {
    'use strict';


})();


function scavenge_me() {
    //'use strict';

    var time_s;
    var time_e;
    var time_abs;
    var max_time;
    var scv_factor;
    var archi;

    if (game_data.units.indexOf('archer') != -1) {
        archi = '1';
    } else {
        archi = '0';
    }

    console.log(archi);

    var settings = {
        max_ressources: '99999',
        archers: archi,
        skip_level_1: '0'
    };

    var settings_axe = {
        untouchable: value_max(!ktore_jednostki[3]),
        max_unit_number: value_max(ktore_jednostki[3]),
        conditional_safeguard: '0'
    };

    var settings_light
    var settings_archer
    var settings_spear
    var settings_sword
    var settings_heavy



        settings_light = {
            untouchable: value_max(!ktore_jednostki[4]),
            max_unit_number: value_max(ktore_jednostki[4]),
            conditional_safeguard: '0'
        };
        settings_archer = {
            untouchable: value_max(!ktore_jednostki[2]),
            max_unit_number: value_max(ktore_jednostki[2]),
            conditional_safeguard: '0'
        };
        settings_spear = {
            untouchable: value_max(!ktore_jednostki[0]),
            max_unit_number: value_max(ktore_jednostki[0]),
            conditional_safeguard: '0'
        };

        settings_sword = {
            untouchable: value_max(!ktore_jednostki[1]),
            max_unit_number: value_max(ktore_jednostki[1]),
            conditional_safeguard: '0'
        };
        settings_heavy = {
            untouchable: value_max(!ktore_jednostki[6]),
            max_unit_number: value_max(ktore_jednostki[6]),
            conditional_safeguard: '0'
        };

    var settings_marcher = {
        untouchable: value_max(!ktore_jednostki[5]),
        max_unit_number: value_max(ktore_jednostki[5]),
        conditional_safeguard: '0'
    };




    function fill(unit, number) {
        let field = $(`[name=${unit}]`);
        number = Number(number);
        field.trigger('focus');
        field.trigger('keydown');
        field.val(number);
        field.trigger('keyup');
        field.trigger('change');
        field.blur();
    }
    var units_settings = {
        0: settings_spear,
        1: settings_sword,
        2: settings_axe,
        3: settings_archer,
        4: settings_light,
        5: settings_marcher,
        6: settings_heavy
    };

    var units = {
        0: 'spear',
        1: 'sword',
        2: 'axe',
        3: 'archer',
        4: 'light',
        5: 'marcher',
        6: 'heavy'
    };


    var units_capacity = [25,15,10,10,80,50,50];
    var to_send = [0,0,0,0,0,0,0];

    var doc=document;
    url=doc.URL;
    if(url.indexOf('screen=place')==-1 || url.indexOf('mode=scavenge')==-1)
        alert('Skrypt do uÅ¼ycia w placu w zakÅ‚adce zbieractwo');
    else{
        var unfree_levels = doc.getElementsByClassName('btn btn-default free_send_button btn-disabled');
        var unlocked_levels = doc.getElementsByClassName('btn btn-default free_send_button');
        var free_levels = unlocked_levels.length - unfree_levels.length;

        if(free_levels == 0)
            alert('Brak dostÄ™pnych poziomÃ³w zbieractwa');
        else{
            if(unlocked_levels.length > 1 && free_levels == 1 && settings.skip_level_1 == 1)
                alert('Ustawiono pominiÄ™cie 1 poziomu zbieractwa');
            else{
                let unit;
                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    if(units_settings[i].max_unit_number > 0){
                        unit = units[i];
                        console.log(unit);
                        let field = $(`[name=${unit}]`)
                        let available = Number(field[0].parentNode.children[1].innerText.match(/\d+/)[0]);

                        if(available > units_settings[i].untouchable)
                            available -= units_settings[i].untouchable;
                        else
                            available = 0;

                        if(available >= units_settings[i].conditional_safeguard)
                            available -= units_settings[i].conditional_safeguard;

                        if(unlocked_levels.length == 1){
                            if(available > units_settings[i].max_unit_number)
                                available = units_settings[i].max_unit_number;
                            to_send[i] = available;
                        }
                        else{
                            let packs = 0;
                            if(settings.skip_level_1 == 0)
                                packs += 15;
                            if(unlocked_levels.length >= 2)
                                packs += 6;
                            if(unlocked_levels.length >= 3)
                                packs += 3;
                            if(unlocked_levels.length == 4)
                                packs += 2;

                            let left_packs = 0;
                            let packs_now;

                            if(free_levels >= 1 && settings.skip_level_1 == 0){
                                packs_now = 15;
                                left_packs += 15;
                            }
                            if(free_levels >= 2){
                                packs_now = 6;
                                left_packs += 6;
                            }
                            if(free_levels >= 3){
                                packs_now = 3;
                                left_packs += 3;
                            }
                            if(free_levels ==4){
                                packs_now = 2;
                                left_packs += 2;
                            }

                            if(available*packs/left_packs > units_settings[i].max_unit_number)
                                to_send[i] = units_settings[i].max_unit_number*packs_now/packs;
                            else
                                to_send[i] = available*packs_now/left_packs;
                        }
                    }
                }

                let capacity = 0;
                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    capacity += units_capacity[i] * to_send[i];
                }

                if(free_levels == 1){
                    settings.max_ressources *= 10;
                    scv_factor = 0.1;
                }
                else if(free_levels == 2){
                    settings.max_ressources *= 4;
                    scv_factor = 0.25;
                }
                else if(free_levels == 3){
                    settings.max_ressources *= 2;
                    scv_factor = 0.5;
                }
                else{
                    settings.max_ressources *= 1.3333;
                    scv_factor = 0.75;
                }
                console.log(capacity);


                time_abs = new Date();
                time_abs.setHours(0,0,0,0);


                time_s = new Date();
                console.log((time_s.getTime() - time_abs.getTime())/1000);

                time_e = new Date();
                var modificator
                if (def_flag == true) {
                    modificator = 2;
                } else {
                    modificator = 4;
                }
                time_e.setHours(time_e.getHours() + modificator);
                console.log((time_e.getTime() - time_abs.getTime())/1000);

                max_time = (time_e.getTime() - time_s.getTime())/1000

                max_time = Math.pow(Math.pow((max_time/parseFloat(duration_factor) - 1800),1/0.45)/100,1/2)/scv_factor;

                console.log(max_time);
                console.log(capacity);
                console.log(settings.max_ressources);
                var walka_o_blache
                if (game_data.world == 'pl151' && game_data.player.name == 'pts86') {
                    walka_o_blache = 1;
                } else {
                    walka_o_blache = 0;
                }


                if (walka_o_blache == 1) {
                    if (settings.max_ressources > max_time) {settings.max_ressources = max_time;}
                }

                //return false;
                if(capacity > settings.max_ressources){
                    let ratio = settings.max_ressources / capacity;
                    for(var i = 0; i<7; i++){
                        if(settings.archers == 0)
                            if(i==3 || i==5)
                                i++;
                        to_send[i] = to_send[i] * ratio;
                    }
                }

                for(var i = 0; i<7; i++){
                    if(settings.archers == 0)
                        if(i==3 || i==5)
                            i++;
                    unit = units[i];
                    fill(unit, Math.floor(to_send[i]));
                }
            }
        }
    }



};


function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}