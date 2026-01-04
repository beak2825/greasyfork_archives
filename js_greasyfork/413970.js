
// ==UserScript==
// @name         Dungeon Crawler Script
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  skrypt do eventu 'Obrońcy wewnątrz zamku' z nutka randomizacji
// @author       .
// @match        https://*.plemiona.pl/game.php?*screen=event_dungeon_crawler*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413970/Dungeon%20Crawler%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/413970/Dungeon%20Crawler%20Script.meta.js
// ==/UserScript==

///////////////// USER SETTINGS /////////////////
/////////////////////////////////////////////////

var klikaj_co_stala = 800 // czas powtorzenia klikniecia co wpisana ilosc milisenund, 1000 ms = 1 sekunda
var klikaj_co_zmienna = 1500 // tool wylosuje liczbe pomiedzy 0 a wpisana liczba, wpisujemy milisekundy, 1000 ms = 1 sekunda

/////////////////////////////////////////////////


var event_data = {}
var auto_clicker
var reward = 0
var refill_count = 0
var auto = 0
var total_reward
var targets_bonus = []
var targets_green = []
var targets_green_temp = []
var targets_exit = []
var targets_red = []
var targets_bandit = []
var targets_bandit_temp = [];
var alert

var audio = new Audio("data:audio/mpeg;base64,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");
audio.controls = true;


$("#content_value").prepend(`<div class="bordered-box"><h3>Dungeon Crawler Script, autor PTS</h3><button class='btn btn-lg' id='do_event' style='font-size:140px;'>Pojedyncze uruchomienie</button>
<br>
<button class='btn btn-lg' id='auto_do_event' style='font-size:140px;'>Auto klikanie start</button>&nbsp;&nbsp;<button class='btn btn-lg' id='stop_auto' style='font-size:140px;' disabled>Auto klikanie stop</button>&nbsp;&nbsp;<input placeholder="Ile razy napełnić energię?" type="number" step="1" min="0" id="refill_count">
<br><button class="btn btn-lg" id="stop_alert">Zatrzymaj alert captcha</button>
<br>
<br><table class="table vis">
<tr><th>Ile razy refill energii?</th><td id="refill_counter">0</td></tr>
</table>
<br><button class='btn btn-lg create_log_table' id='show_log' style='font-size:140px;'>Pokaż log</button>
</div>
<div id='feedback'></div>
<br>`)

/*
<tr><th>Ile zebranych dóbr?</th><td id="collected_goods_counter">${total_reward}</td></tr>
<tr><td colspan="2"><button class="btn reset_total_reward">Zresetuj licznik zebranych dóbr</button></td></tr></table>
*/

function do_event() {
    if (document.getElementsByClassName("recaptcha-checkbox-border").length > 0) {
        Click()
    }

    if ($(document.body).find(".captcha").length > 0) {
            auto=0
            alert = setInterval(()=>audio.play(),2200)
            return false;
        }


    if ($(".dungeon-crawler-clickable").length == 0) {



        refill_count = parseInt($("#refill_count").val()) ? parseInt($("#refill_count").val()) : 0;
        //console.log($("#dungeon_crawler_energy_display").text() == '0 / 5',refill_count > 0,auto == 1)
        if ($("#dungeon_crawler_energy_display").text() == '0 / 5' && refill_count == 0) {
                auto = 0;
                $("#feedback").val(`Koniec! Zebrano ${reward} skradzionych dóbr.`);
                return false;
            }
        if ($("#dungeon_crawler_energy_display").text() == '0 / 5' && refill_count > 0 && auto == 1) {
            auto = 0;
            refill_count = refill_count - 1;
            $("#refill_count").val(refill_count)
            $("#refill_counter").text(refill_count)
            //console.log("Ilosc refilli: " +refill_count)
            $("#buy-energy-link")[0].click()
            setTimeout(() => {$(".btn.btn-img")[2].click()},200)
            setTimeout(() => {$("button.btn.evt-confirm-btn.btn-confirm-yes").click()},500)
            setTimeout(() => {
                $("#refill_counter").text(refill_count)
                reward = 0;
                auto = 1;
                auto_do_event();
                return false;
            },5000
                      )
        }
            $(".btn.btn-need-energy.btn-confirm-yes").click()
            return false;
        }

        event_data.guard_min_damange = parseInt($($(".min-damage")[0]).text());
        event_data.bandit_min_damange = parseInt($($(".max-damage")[1]).text());
        event_data.health = parseInt($($(".health-info")[0]).text());
        event_data.level = parseInt($($(".level-info")[0]).text());
        targets_bonus = []
        targets_green = []
        targets_green_temp = []
        targets_exit = []
        targets_red = []
        targets_bandit = []
        targets_bandit_temp = [];
        var clickable = $(".dungeon-crawler-clickable")
        $.each(clickable,(index,tile) => {
            div_style = $(tile).closest("div").attr('style')
            if (div_style == `background-image: url('/graphic/events/dungeon_crawler/map/fog_available.png')`) {
                div_style = 'green';
                cords_x = parseInt(tile.attributes[2].value.split("-")[0]);
                cords_y = parseInt(tile.attributes[2].value.split("-")[1]);
                if (cords_x == 0 || cords_y == 4 || cords_y == 0 || cords_x == 4) {priority = 2}
                else if (cords_x == 2 && cords_y == 2) {priority = 0}
                else {priority = 1}
                targets_green_temp.push({coords:tile.attributes[2].value,priority:priority})
            }
            if (div_style.search(`/graphic/events/dungeon_crawler/map/exit`) > -1) {
                div_style = 'exit';targets_exit.push(tile.attributes[2].value)
            }
            if (div_style.search(`/graphic/events/dungeon_crawler/map/blue`) > -1) {div_style = 'bonus';targets_bonus.push(tile.attributes[2].value)}
            if (div_style.search(`/graphic/events/dungeon_crawler/map/red`) > -1) {
                div_style = 'bandit';
                num_of_blocked = 0;
                all_tiles = 0;
                cords_x = parseInt(tile.attributes[2].value.split("-")[0]);
                cords_x_a = cords_x - 1
                cords_x_b = cords_x + 1
                cords_y = parseInt(tile.attributes[2].value.split("-")[1]);
                cords_y_a = cords_y - 1
                cords_y_b = cords_y + 1
                let obj
                if ($(".tile-"+cords_x+"-"+cords_y_a).attr('style') == `background-image: url('/graphic/events/dungeon_crawler/map/fog_blocked.png')` && cords_y_a < 5) {obj = check_sorroundings(cords_x+"-"+cords_y_a);num_of_blocked += obj.white_tiles;all_tiles += obj.all_tiles}
                if ($(".tile-"+cords_x+"-"+cords_y_b).attr('style') == `background-image: url('/graphic/events/dungeon_crawler/map/fog_blocked.png')` && cords_y_b < 5) {obj = check_sorroundings(cords_x+"-"+cords_y_b);num_of_blocked += obj.white_tiles;all_tiles += obj.all_tiles}
                if ($(".tile-"+cords_x_a+"-"+cords_y).attr('style') == `background-image: url('/graphic/events/dungeon_crawler/map/fog_blocked.png')` && cords_x_a < 5) {obj = check_sorroundings(cords_x_a+"-"+cords_y);num_of_blocked += obj.white_tiles;all_tiles += obj.all_tiles}
                if ($(".tile-"+cords_x_b+"-"+cords_y).attr('style') == `background-image: url('/graphic/events/dungeon_crawler/map/fog_blocked.png')` && cords_x_b < 5) {obj = check_sorroundings(cords_x_b+"-"+cords_y);num_of_blocked += obj.white_tiles;all_tiles += obj.all_tiles}
                targets_bandit_temp.push({coords:tile.attributes[2].value,blocked:num_of_blocked,all:all_tiles});
            }

        })
        //console.log(targets_green_temp)

        targets_bandit = sortBandits()
        targets_green = sortByKeyDesc(targets_green_temp,'priority')
        //console.log(targets_bandit)
        cookie = getCookie('dgc')
        if (cookie == '') {total_reward = 0} else {total_reward = parseInt(cookie)}
        //return false;
        if (targets_bonus.length > 0) {
            //$(".tile-"+targets_bonus[0]).find('a')[0].click();
            clickTile($(".tile-"+targets_bonus[0]).find('a')[0]);
            return false;
        }
        if (targets_green.length > 0) {
            //$(".tile-"+targets_green[0].coords).find('a')[0].click();
            clickTile($(".tile-"+targets_green[0].coords).find('a')[0]);
            return false;
        }
        if (targets_exit.length > 0) {
            reward = parseInt($(".reward-info").text());
            total_reward += reward;
            setCookie('dgc',total_reward,9999)
            $("#collected_goods_counter").text(total_reward)
            //$(".tile-"+targets_exit[0]).find('a')[0].click();
            console.log($(".tile-"+targets_exit[0]).find('a')[0],$(".tile-"+targets_exit[0]).find('a')[0].getBoundingClientRect())
            clickTile($(".tile-"+targets_exit[0]).find('a')[0]);
            return false;
        }
        if (targets_bandit.length > 0) {
            bandit_health = parseInt($(".tile-"+targets_bandit[0].coords).find('span').text())
            //console.log(bandit_health)
            if (event_data.health > event_data.bandit_min_damange || bandit_health <= event_data.guard_min_damange) {
                //$(".tile-"+targets_bandit[0].coords).find('a')[0].click();
                clickTile($(".tile-"+targets_bandit[0].coords).find('a')[0]);
                return false;
            }
        }
        add_to_log(total_reward,event_data.level-1);
        total_reward = 0;
        setCookie('dgc',0,9999)
        $("button:contains('Porzuć podejście')").click();
        setTimeout(() => {$(".btn.evt-confirm-btn.btn-confirm-yes").click()},200)
    }

    $(document.body).on('click','#do_event',() => {do_event()})

    $(document.body).on('click','#auto_do_event',() => {
        auto = 1
        //if ($("#refill_count").val() == "") {refill_count = 0} else {refill_count = parseInt($("#refill_count").val())}
        //$("#refill_counter").text(refill_count)
        //reward = 0;
        //auto_clicker = setInterval(() => {do_event();console.log('auto click')},600)

        $("#auto_do_event").prop("disabled",true)
        $("#stop_auto").prop("disabled",false)
        auto_do_event()

    })

    function auto_do_event() {
        (function loop() {
            var rand = Math.round(Math.random() * (klikaj_co_zmienna)) + klikaj_co_stala;
            var date = new Date();
            hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();
            minutes = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
            seconds = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();
            var formattedTime = hour + ":" + minutes + ":" + seconds + "." + date.getMilliseconds()
            setTimeout(function() {
                do_event();
                console.log(formattedTime)
                if (auto === 1) loop();
            }, rand)
        })()
    }


    function sortByKeyDesc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    function sortBandits() {
        sorted = targets_bandit_temp.sort(function (bandit1, bandit2) {

            if (bandit1.blocked > bandit2.blocked) return -1;
            if (bandit1.blocked < bandit2.blocked) return 1;
            if (bandit1.all > bandit2.all) return -1;
            if (bandit1.all < bandit2.all) return 1;

        });
        return sorted
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    $(document.body).on('click','.reset_total_reward',() => {
        sessionStorage.removeItem("dgc_log")
        $('.create_log_table').trigger('click')
    })


    function ifNull(test) {
        if (!test) {return ''} else {return test}
    }

    function check_sorroundings(coords) {
        let tile = {}
        let num_of_bandits = 0;
        let num_of_white_tiles = 0;
        let cords_x = parseInt(coords.split("-")[0]);
        let cords_x_a = cords_x - 1
        let cords_x_b = cords_x + 1
        let cords_y = parseInt(coords.split("-")[1]);
        let cords_y_a = cords_y - 1
        let cords_y_b = cords_y + 1
        //console.log($(".tile-"+cords_x+"-"+cords_y_a))
        //console.log($(".tile-"+cords_x+"-"+cords_y_b))
        //console.log($(".tile-"+cords_x_a+"-"+cords_y))
        //console.log($(".tile-"+cords_x_b+"-"+cords_y))
        if (ifNull($(".tile-"+cords_x+"-"+cords_y_a).attr('style')).indexOf(`map/red`) > -1) {num_of_bandits += 1;}
        if (ifNull($(".tile-"+cords_x+"-"+cords_y_a).attr('style')).indexOf(`map/fog.png`) > -1) {num_of_white_tiles += 1;}
        if (ifNull($(".tile-"+cords_x+"-"+cords_y_b).attr('style')).indexOf(`map/red`) > -1) {num_of_bandits += 1;}
        if (ifNull($(".tile-"+cords_x+"-"+cords_y_b).attr('style')).indexOf(`map/fog.png`) > -1) {num_of_white_tiles += 1;}
        if (ifNull($(".tile-"+cords_x_a+"-"+cords_y).attr('style')).indexOf(`map/red`) > -1) {num_of_bandits += 1;}
        if (ifNull($(".tile-"+cords_x_a+"-"+cords_y).attr('style')).indexOf(`map/fog.png`) > -1) {num_of_white_tiles += 1;}
        if (ifNull($(".tile-"+cords_x_b+"-"+cords_y).attr('style')).indexOf(`map/red`) > -1) {num_of_bandits += 1;}
        if (ifNull($(".tile-"+cords_x_b+"-"+cords_y).attr('style')).indexOf(`map/fog.png`) > -1) {num_of_white_tiles += 1;}
        tile.other_bandit = (num_of_bandits>1)
        if (num_of_bandits>1) {
            tile.other_bandit = true
            tile.white_tiles = 0
            tile.all_tiles = num_of_white_tiles + 1
        } else {
            tile.other_bandit = false
            tile.white_tiles = num_of_white_tiles + 1
            tile.all_tiles = num_of_white_tiles + 1
        }

        return tile
    }

    function Sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async function Click() {
        var randVal = Math.floor(Math.random() * (max - min + 1)) + min;
        await Sleep(randVal);
        document.getElementsByClassName("recaptcha-checkbox-border")[0].click()
        //console.log('click after ' + randVal + ' milliseconds');
    }

    function get_log() {

        log = sessionStorage.getItem("dgc_log")
        if (log) {
            log = JSON.parse(sessionStorage.getItem("dgc_log"))
        } else {
            log = []
        }
        return log
    }

    function add_to_log(reward,level) {
        currentDate = new Date()
        log = get_log()
        log.splice(0,0,{date:currentDate,reward:reward,level:level})
        sessionStorage.setItem("dgc_log",JSON.stringify(log))
    }

    $(document.body).on('click','.create_log_table',() => {
        let log = get_log();
        let total_reward_f = 0;
        let table_html = '<table class="table vis"><tr><th>#</th><th>Data</th><th>Poziomy</th><th>Skradzione dobra</th></tr>';
        $.each(log,(index,line) => {
            table_html += `<tr><td>${log.length-index}</td><td>${(new Date(line.date)).toLocaleString()}</td><td>${line.level}</td><td>${line.reward}</td></tr>`;
            total_reward_f += line.reward;
        })
        table_html += `<tr><td colspan="3"><b>RAZEM</b></td><td><b>${total_reward_f}</b></td></tr></table><br><br><button class="btn reset_total_reward" style="max-width:100%;">Zresetuj licznik zebranych dóbr</button>`;
        Dialog.show("Log",table_html)
    });


    $(document).on('keydown', function (e) {
        if(e.which == 118){
            console.log(new Date(),'kliklem')
            do_event()
        }
    });

    $(document.body).on('click','#stop_auto',()=>{
        auto=0
        $("#auto_do_event").prop("disabled",false)
        $("#stop_auto").prop("disabled",true)
    })

    $(document.body).on('click',"stop_alert",()=>{
        clearInterval(alert)
    })


function getRandomInt(min = -40, max = 40) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCoordinates(element) {
  coords = element.getBoundingClientRect();
  console.log(coords)
  return coords;
}

function clickTile(tile) {
    coords = getCoordinates(tile)
    elementWidth = parseInt(coords.width)
    elementHeight = parseInt(coords.height)
    targetCoordsX = parseInt(coords.x) + (elementWidth/2) + getRandomInt(-20,20)
    targetCoordsY = parseInt(coords.y) + (elementHeight/2) + getRandomInt(-20,20)
    //console.log('wyliczone koordy',targetCoordsX,targetCoordsY)
    scrollPos = $(window).scrollTop();
    event =  new MouseEvent( "click", { clientX: targetCoordsX , clientY: targetCoordsY, bubbles: false, screenY: targetCoordsX, screenX: targetCoordsY } )
    tile.dispatchEvent(event)
    //$(".event-logo")[0].scrollIntoView();
    $(window).scrollTop(scrollPos);
    //console.log(event)
}