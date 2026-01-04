// ==UserScript==
// @name         Gladiatus AutoPlay
// @namespace    https://greasyfork.org/es/scripts/390772-gladiatus-autoplay
// @version      0.43.1
// @description  Gladiatus BOT
// @author       balconies
// @grant        none
// @include      *s*-*.gladiatus.gameforge.com*
// @downloadURL https://update.greasyfork.org/scripts/432815/Gladiatus%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/432815/Gladiatus%20AutoPlay.meta.js
// ==/UserScript==

'use strict';
var localizacion = window.location.href;
function noplay() {

    return ((localizacion.includes("guild") && !localizacion.includes("guildTemple")) || localizacion.includes("mod=player") || localizacion.includes("mod=highscore")
        || localizacion.includes("mod=recruiting") || localizacion.includes("mod=powerups") || localizacion.includes("mod=premium")
        || localizacion.includes("mod=missions") || localizacion.includes("mod=gods")
        || localizacion.includes("mod=mysterybox") || localizacion.includes("mod=overview") || localizacion.includes("mod=messages")
        || localizacion.includes("mod=packages") || localizacion.includes("mod=news") || localizacion.includes("mod=surveys")
        || localizacion.includes("mod=settings") || localizacion.includes("mod=memo") || localizacion.includes("mod=stuff")
        || localizacion.includes("mod=auction") || localizacion.includes("mod=inventory") || localizacion.includes("mod=forge")
        || localizacion.includes("mod=magus") || localizacion.includes("mod=market") || localizacion.includes("mod=training")
        || localizacion.includes("mod=hermit") || localizacion.includes("mod=costumes") || localizacion.includes("mod=craps"));
}
let boton = stringToBoolean(checkCookie("boton"));
let autoworkok = stringToBoolean(checkCookie("autowork"));
let autoprayok = stringToBoolean(checkCookie("autopray"));
let autoexpeditionok = stringToBoolean(checkCookie("autoexpedition"));
let autodungeonok = stringToBoolean(checkCookie("autodungeon"));
let autoarenaok = stringToBoolean(checkCookie("autoarena"));
let autoturmaok = stringToBoolean(checkCookie("autoturma"));
let autohidegoldok = stringToBoolean(checkCookie("autohidegold"));
let autoeventok;
let eventpoints;
let eventtime;
var delay = getRandomInt(3000, 5000);
var fightzones = document.querySelectorAll('.cooldown_bar_link');
var workurl = document.querySelector('div#submenu1 a.menuitem:not(.eyecatcher)').href;
execute();
function execute() {
    if (!noplay()) {
        if (existevent()) {
            autoeventok = stringToBoolean(checkCookie("autoevent"));
            eventpoints = parseInt(checkPointsCookie("eventpoints"), 10);
        }
    }
    setTimeout(main, 1000);
}

function myPause() {
    setTimeout(listoparajugar, delay);
}
//COOKIES FUNCTIONS

function setCookie(cname, cvalue, minutes) {
    var d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

function checkCookie(cname) {
    var cookie = getCookie(cname);
    if (cookie != "") {
        return cookie;
    } else {
        setCookie(cname, false, 10080);
        cookie = getCookie(cname);
        return cookie;
    }
}

function checkPointsCookie(cname) {
    var cookie = getCookie(cname);
    if (cookie != "" && cookie != "-1") {
        return cookie;
    } else {
        try {
            let puntos = geteventpoints();
            setCookie(cname, puntos, 60);
            cookie = getCookie(cname);
            return cookie;
        } catch (error) {
            setCookie(cname, 0, 60);
            return cookie;
        }
    }
}

function stringToBoolean(string) {
    if ((string === "false") || (string === "")) {
        return false;
    } else {
        return true;
    }
}

//AUTOPLAY

function listoparajugar() {
    if (!noplay()) {
        if (boton) {
            if (!working() && (autoexpeditionok || autodungeonok || autoprayok || autoworkok || autoarenaok || autoturmaok || autohidegoldok || (existevent() && autoeventok))) {
                jugar();
            } else if (working() && !questcooldown() && false) { //////////////////////////////////////////////////////////////////////////////////
                autoquest();
            } else if (working() && !autoworkok && !autoprayok) {
                if (localizacion == workurl) {
                    try {
                        let cancelar = document.querySelector('div#content article section table tbody tr td a');
                        setCookie("working", false, 97);
                        cancelar.click();
                        setTimeout(function () {
                            let aceptarcancel = document.querySelector('td#buttonleft input');
                            aceptarcancel.click();
                        }, 1000);
                    }
                    catch (error) {
                        console.error(error);
                        setTimeout(myPause, delay);
                    }
                }
                else {
                    window.location = workurl;
                }
            }
            else {
                setTimeout(myPause, delay);
            }
        } else if (working() && !autoworkok && !autoprayok) {
            if (localizacion == workurl) {
                try {
                    let cancelar = document.querySelector('div#content article section table tbody tr td a');
                    setCookie("working", false, 97);
                    cancelar.click();
                    setTimeout(function () {
                        let aceptarcancel = document.querySelector('td#buttonleft input');
                        aceptarcancel.click();
                    }, 1000);
                }
                catch (error) {
                    console.error(error);
                    setTimeout(myPause, delay);
                }
            }
            else {
                window.location = workurl;
            }
        } else setTimeout(myPause, delay);
    }
}

function jugar() {
    let cooldownexpedition = document.querySelector('#cooldown_bar_fill_expedition').getAttribute('style');
    let expeditionpoints = parseInt(document.querySelector('#expeditionpoints_value_point').innerHTML);
    let cooldowndungeon = document.querySelector('#cooldown_bar_fill_dungeon').getAttribute('style');
    let dungeonpoints = parseInt(document.querySelector('#dungeonpoints_value_point').innerHTML);
    let cooldownarena = document.querySelector('#cooldown_bar_fill_arena').getAttribute('style');
    let cooldownturma = document.querySelector('#cooldown_bar_fill_ct').getAttribute('style');
    let expeditionhp = parseInt(getCookie('expeditionhp'));
    if (existevent()) {
        let eventhp = parseInt(getCookie('eventnhp'));
    }
    let arenahp = parseInt(getCookie('arenahp'));
    if (boton) {
        if (autoexpeditionok && (cooldownexpedition == "width: 100%;") && (!hpLowerThan(expeditionhp))) {
            autoexpedition();
        } else if (autodungeonok && (cooldowndungeon == "width: 100%;")) {
            autodungeon();
        } else if (autoarenaok && (cooldownarena == "width: 100%;") && (!hpLowerThan(arenahp))) {
            autoarena();
        } else if (autoturmaok && (cooldownturma == "width: 100%;")) {
            autoturma();
        } else if (autohidegoldok) {
            autohidegold();
        }else if (existevent() && autoeventok && !eventcooldown() && eventpoints > 0 && !hpLowerThan(eventhp)) {
            if (parseInt(getCookie('autoeventtarget')) == 4) {
                if (eventpoints > 1) {
                    autoevent();
                }
            } else {
                autoevent();
            }
        } else if (autoprayok && (!autoexpeditionok || (expeditionpoints == 0) || (hpLowerThan(expeditionhp))) && (!autodungeonok || (dungeonpoints == 0))) {
            autopray();
        } else if (autoworkok && !autoprayok && (!autoexpeditionok || (expeditionpoints == 0) || (hpLowerThan(expeditionhp))) && (!autodungeonok || (dungeonpoints == 0))) {
            autowork();
        } else {
            setTimeout(myPause, delay);
        }
    } else setTimeout(myPause, delay);
}

//AUTO DUNGEON

function autodungeon() {
    var i, time, x, elemFights;
    let advanced = stringToBoolean(checkCookie("advanced"));
    let skipboss = stringToBoolean(checkCookie("skipboss"));
    if (!(localizacion.includes("dungeon"))) {
        window.location = fightzones[1].href;
    }
    elemFights = document.getElementsByTagName("area");
    x = getRandomInt(3000, 5000);
    if (elemFights.length > 0) {
        if (skipboss) {
            try {
                let jefelabel = document.querySelector('div.map_label').innerText.slice(-1);/////////////////////////////NO JEFE
                if ((jefelabel != "0") && (jefelabel != "1") && (jefelabel != "2") && (jefelabel != "3") && (jefelabel != "4") && (jefelabel != "5") && (jefelabel != "6") && (jefelabel != "7") && (jefelabel != "8") && (jefelabel != "9")) {
                    let cancelar = document.querySelector('#content div:nth-child(6) form input.button1');
                    cancelar.click();
                }
            } catch (error) {
                //no importa
            }
        }
        setTimeout(function () { elemFights[0].click(); }, x);
    }
    else {
        if (advanced) {
            elemFights = document.getElementsByName("dif2"); //dungeon avanzado
        } else {
            elemFights = document.getElementsByName("dif1");
        }
        if (elemFights.length > 0) {
            for (i = elemFights.length - 1; i >= 0; i--) {
                if (elemFights[i].type == "submit") {
                    setTimeout(function () { elemFights[0].click(); }, x);
                }
            }
        }
        else setTimeout(function () { window.location = fightzones[1].href; }, 2510 + x);
    }
}

//AUTOEXPEDITION

function autoexpedition() {
    let selectedexpeditionmap = parseInt(getCookie('autoexpeditionmap'));
    let selectedexpeditiontarget = parseInt(getCookie('autoexpeditiontarget'));
    if (!(localizacion.includes("location")) || (localizacion.includes("submod"))) {
        window.location = fightzones[0].href;
        setTimeout(myPause, 5000);
    } else {
        if (selectedexpeditionmap == 8) {
            selectedexpeditionmap = 9;
        }
        attack(null, '' + selectedexpeditionmap + '', selectedexpeditiontarget, 0, '');
    }
}

//AUTOARENA

function autoarena() {
    let limit = parseInt(getCookie('arenatarget'));
    if ((localizacion.includes("mod=arena")) && (!(localizacion.includes("serverArena")))) {
        window.location = document.querySelector('ul#mainnav li table tbody tr td:nth-child(2) a').href;
        setTimeout(myPause, 5000);
    } else if ((!(localizacion.includes("serverArena"))) || (!(localizacion.includes("Type=2")))) {
        window.location = fightzones[2].href;
        setTimeout(myPause, 5000);
    } else {
        let last = 0;
        for (let i = 1; i < 6; i++) {
            let lvl = parseInt(document.querySelectorAll('section#own2 table tbody tr')[i].querySelectorAll('td')[1].innerHTML);
            if ((lvl < limit) && ((last == 0) || (lvl > (parseInt(document.querySelectorAll('section#own2 table tbody tr')[last].querySelectorAll('td')[1].innerHTML))) && (!(document.querySelectorAll('section#own2 table tbody tr')[i].querySelectorAll('td a')[0].innerHTML.includes("ByElection"))))) {
                last = i;
            }
        }
        if (last == 0) {
            if (document.querySelectorAll('section#own2 table tbody tr')[1].querySelectorAll('td a')[0].innerHTML.includes("ByElection")) {
                last = 2;
            } else {
                last = 1;
            }
            for (let i = last; i < 6; i++) {
                let lvl = parseInt(document.querySelectorAll('section#own2 table tbody tr')[i].querySelectorAll('td')[1].innerHTML);
                if (lvl < (parseInt(document.querySelectorAll('section#own2 table tbody tr')[last].querySelectorAll('td')[1].innerHTML)) && (!(document.querySelectorAll('section#own2 table tbody tr')[i].querySelectorAll('td a')[0].innerHTML.includes("ByElection")))) {
                    last = i;
                }
            }
        }
        document.querySelectorAll('section#own2 table tbody tr')[last].querySelectorAll('td')[3].querySelector('div').click();
        setTimeout(startProvinciarumFightConfirmed, 5000);
    }
}

//AUTOTURMA

function autoturma() {
    let limit = parseInt(getCookie('turmatarget'));
    if (localizacion.includes("grouparena")) {
        window.location = document.querySelector('ul#mainnav li table tbody tr td:nth-child(4) a').href;
        setTimeout(myPause, 5000);
    } else if (!(localizacion.includes("serverArena")) || (!(localizacion.includes("Type=3")))) {
        window.location = fightzones[3].href;
        setTimeout(myPause, 5000);
    } else {
        let last = 0;
        for (let i = 1; i < 6; i++) {
            let lvl = parseInt(document.querySelectorAll('section#own3 table tbody tr')[i].querySelectorAll('td')[1].innerHTML);
            if ((lvl < limit) && ((last == 0) || (lvl > (parseInt(document.querySelectorAll('section#own3 table tbody tr')[last].querySelectorAll('td')[1].innerHTML))) && (!(document.querySelectorAll('section#own3 table tbody tr')[i].querySelectorAll('td a')[0].innerHTML.includes("ByElection"))))) {
                last = i;
            }
        }
        if (last == 0) {
            if (document.querySelectorAll('section#own3 table tbody tr')[1].querySelectorAll('td a')[0].innerHTML.includes("ByElection")) {
                last = 2;
            } else {
                last = 1;
            }
            for (let i = last; i < 6; i++) {
                let lvl = parseInt(document.querySelectorAll('section#own3 table tbody tr')[i].querySelectorAll('td')[1].innerHTML);
                if (lvl < (parseInt(document.querySelectorAll('section#own3 table tbody tr')[last].querySelectorAll('td')[1].innerHTML)) && (!(document.querySelectorAll('section#own3 table tbody tr')[i].querySelectorAll('td a')[0].innerHTML.includes("ByElection")))) {
                    last = i;
                }
            }
        }
        document.querySelectorAll('section#own3 table tbody tr')[last].querySelectorAll('td')[3].querySelector('div').click();
        setTimeout(startProvinciarumFightConfirmed, 5000);
    }
}


//AUTO HIDE GOLD

function autohidegold() {
    //let limit=parseInt(getCookie('turmatarget'));
    document.querySelectorAll('a[title="Gladiator Amulets"]').click();
    list_of_bid = [];
    list_of_bid.add
    all_bid_button = document.querySelectorAll('div.auction_bid_div');
    for (let i = 0; i < length(all_bid_button); i++) {
        if (length(document.querySelectorAll('div.auction_bid_div')[i].querySelectorAll('span.gca-auction-good-price')) > 0) {
            if (length(document.querySelectorAll('div.auction_bid_div')[i]
            .querySelectorAll('input.awesome-button.gca-auction-can-buy'))> 0) {
                document.querySelectorAll('div.auction_bid_div')[i]
                .querySelectorAll('input.awesome-button.gca-auction-can-buy')
                .click()
            }
        }
    }
    document.querySelectorAll('a[title="Mercenaries Amulets"]').click();
    list_of_bid = [];
    list_of_bid.add
    all_bid_button = document.querySelectorAll('div.auction_bid_div');
    for (let i = 0; i < length(all_bid_button); i++) {
        if (length(document.querySelectorAll('div.auction_bid_div')[i].querySelectorAll('span.gca-auction-good-price')) > 0) {
            if (length(document.querySelectorAll('div.auction_bid_div')[i]
            .querySelectorAll('input.awesome-button.gca-auction-can-buy'))> 0) {
                document.querySelectorAll('div.auction_bid_div')[i]
                .querySelectorAll('input.awesome-button.gca-auction-can-buy')
                .click()
            }
        }
    }
}


//EVENT EXPEDITION

function autoevent() {
    if (existevent()) {
        var selectedeventtarget = parseInt(getCookie('autoeventtarget'));
        let eventboton = document.querySelector('div#submenu2 a.eyecatcher');
        if (!(localizacion.includes(eventboton.href))) {
            window.location = eventboton.href;
            setTimeout(myPause, 5000);
        } else {
            try {
                let targets = document.querySelectorAll('div#expedition_list button.expedition_button:not(:disabled)');
                targets[selectedeventtarget - 1].click();
                if (selectedeventtarget == 4) {
                    eventpoints = eventpoints - 2;
                } else {
                    eventpoints--;
                }
                setCookie("eventpoints", eventpoints, 60);
            } catch (error) {
                let time = getEventTime();
                setCookie("eventtime", true, time);
                setTimeout(myPause, delay);
            }
        }
    } else {
        autoeventok = false;
        setCookie("autoevent", autoeventok, 10080);
    }
}
function geteventpoints() {
    let eventboton = document.querySelector('div#submenu2 a.eyecatcher');
    if (!(location.href == eventboton.href)) {
        window.location = eventboton.href;
        return -1;
        setTimeout(myPause, 5000);
    } else {
        let spotpuntos = document.querySelectorAll('div#content div.section-header p');
        spotpuntos = spotpuntos[1].innerHTML;
        let puntos = "";
        let i = 0;
        while (!(spotpuntos[i] == "0" || spotpuntos[i] == "1" || spotpuntos[i] == "2" || spotpuntos[i] == "3" || spotpuntos[i] == "4" || spotpuntos[i] == "5" || spotpuntos[i] == "6" || spotpuntos[i] == "7" || spotpuntos[i] == "8" || spotpuntos[i] == "9")) {
            i++;
        }
        puntos += spotpuntos[i];
        i++
        if (spotpuntos[i] == "0" || spotpuntos[i] == "1" || spotpuntos[i] == "2" || spotpuntos[i] == "3" || spotpuntos[i] == "4" || spotpuntos[i] == "5" || spotpuntos[i] == "6" || spotpuntos[i] == "7" || spotpuntos[i] == "8" || spotpuntos[i] == "9") {
            puntos += spotpuntos[i]
        }
        return puntos;
    }
}
function eventcooldown() {
    var eventtime = stringToBoolean(getCookie("eventtime"));
    return eventtime;
}
function existevent() {
    let captureeventbutton = document.evaluate(".//div[contains(@id,'submenu2')]/a[contains(@class,'eyecatcher')]", document.body, null, 9, null).singleNodeValue;
    if (captureeventbutton) {
        return true;
    } else {
        return false;
    }
}

//AUTOWORK

function autowork() {
    if (localizacion == workurl) {
        try {
            var autoworktype = parseInt(getCookie('autoworktype'));
            if (autoworktype == 0) {
                setWorkTime(0, 1, 24, 'Hora', 'Horas', 'Trabajar en el Senado', 1);
            } else if (autoworktype == 1) {
                setWorkTime(1, 1, 4, 'Hora', 'Horas', 'Trabajar en las Joyerias', 1);
            } else if (autoworktype == 3) {
                setWorkTime(3, 1, 6, 'Hora', 'Horas', 'Trabajar en la Granja', 1);
            } else if (autoworktype == 4) {
                setWorkTime(4, 1, 3, 'Hora', 'Horas', 'Trabajar en las Carnicerias', 1);
            } else if (autoworktype == 5) {
                setWorkTime(5, 4, 10, 'Hora', 'Horas', 'Pescado en el Río', 1);
            } else if (autoworktype == 6) {
                setWorkTime(6, 1, 4, 'Hora', 'Horas', 'Trabajar en la Panadería', 1);
            } else if (autoworktype == 7) {
                setWorkTime(7, 12, 12, 'Hora', 'Horas', 'Trabajar en la Herrería', 1);
            } else if (autoworktype == 8) {
                setWorkTime(8, 6, 6, 'Hora', 'Horas', 'Trabajar en la Herrería', 1)
            }
            var autoworktime = parseInt(getCookie('autoworktime'));
            let horas = document.querySelector('#workTime');
            let trabajar = document.querySelector('#doWork');
            horas.value = autoworktime;
            trabajar.click();
        }
        catch (error) {
            let time = getRemainingTime(document.querySelector('div#content article table tbody tr td span.ticker'));
            setCookie("working", true, time);
            setTimeout(myPause, delay);
        }
    }
    else {
        window.location = workurl;
    }
}

function working() {
    var trabajo = stringToBoolean(getCookie("working"));
    return trabajo;
}
//AUTOPRAY
function autopray() {
    let prayurl = document.querySelector('a.menuitem').href;
    let posicion = prayurl.indexOf("overview");
    if (posicion >= 0) {
        prayurl = prayurl.slice(0, posicion) + "guildTemple" + prayurl.slice(posicion + 8);
    }
    if (localizacion == prayurl) {
        try {
            let praygod = parseInt(getCookie('praygod'));
            let praygrace = parseInt(getCookie('praygrace'));
            selectGod(praygod);
            document.querySelector("#prayHours").value = praygrace;
            document.querySelector("input[name='startPray']").click();
        } catch (error) {
            let time = getRemainingTime(document.querySelector('#content > article > section > table > tbody > tr:nth-child(3) > td:nth-child(2) > span'));
            setCookie("working", true, time);
            setTimeout(myPause, delay);
        }
    } else {
        window.location = prayurl;
    }
}
//AUTOQUEST
function autoquest() {
    let questurl = document.querySelectorAll("a.menuitem")[1].href;
    let questrestart = document.querySelectorAll("a.quest_slot_button_restart");
    let questcomplete = document.querySelectorAll("a.quest_slot_button_finish");
    let acepto = false;
    if (localizacion == questurl) {
        if (questrestart.length > 0) {
            window.location = questrestart[0].href;
        } else if (questcomplete.length > 0) {
            window.location = questcomplete[0].href;
        } else if (document.querySelector("#quest_header_cooldown")) {
            let questtime = getRemainingTime(document.querySelector("#quest_header_cooldown > b > span"));
            setCookie("questcooldown", true, questtime);
        } else {
            let questdiv = document.querySelectorAll("div.contentboard_slot_inactive");
            for (let i = 0; i < questdiv.length; i++) {
                let questtype = questdiv[i].querySelector("div.quest_slot_icon").style.backgroundImage;
                if (questtype == 'url("9379/img/ui/quest/icon_dungeon_inactive.jpg")' || questtype == 'url("9379/img/ui/quest/icon_items_inactive.jpg")' || questtype == 'url("9379/img/ui/quest/icon_combat_inactive.jpg")') {
                    let questaccept = questdiv[i].querySelectorAll('a.quest_slot_button_accept');
                    if (questaccept.length > 0) {
                        acepto = true;
                        window.location = questaccept[0].href;
                    }
                }
            }
            if (!acepto) {
                document.querySelector('#quest_footer_reroll > input').click();
            }
        }
        setTimeout(myPause, delay);
    } else {
        window.location = questurl;
    }
}
function questcooldown() {
    let questcooldown = stringToBoolean(checkCookie("questcooldown"));
    return questcooldown;
}
function createworkselect(autoworktype) {
    let autoworktime = document.querySelector("#autoworktime");
    if (autoworktype == 0) {
        autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6">6 HOURS</option><option value="7">7 HOURS</option><option value="8">8 HOURS</option><option value="9">9 HOUR</option><option value="10">10 HOURS</option><option value="11">11 HOURS</option><option value="12">12 HOURS</option><option value="13">13 HOURS</option><option value="14">14 HOURS</option><option value="15">15 HOURS</option><option value="16">16 HOURS</option><option value="17">17 HOUR</option><option value="18">18 HOURS</option><option value="19">19 HOURS</option><option value="20">20 HOURS</option><option value="21">21 HOURS</option><option value="22">22 HOURS</option><option value="23">23 HOURS</option><option value="24" selected>24 HOURS</option>';
    } else if ((autoworktype == 1) || (autoworktype == 6)) {
        autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4" selected>4 HOURS</option>';
    } else if (autoworktype == 2) {
        autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6">6 HOURS</option><option value="7">7 HOURS</option><option value="8" selected>8 HOURS</option>';
    } else if (autoworktype == 3) {
        autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6" selected>6 HOURS</option>';
    } else if (autoworktype == 4) {
        autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3" selected>3 HOURS</option>';
    } else if (autoworktype == 5) {
        autoworktime.innerHTML = '<option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6">6 HOURS</option><option value="7">7 HOURS</option><option value="8">8 HOURS</option><option value="9">9 HOUR</option><option value="10"selected>10 HOURS</option>';
    } else if (autoworktype == 7) {
        autoworktime.innerHTML = '<option value="12" selected>12 HOURS</option>';
    } else if (autoworktype == 8) {
        autoworktime.innerHTML = '<option value="6" selected>6 HOURS</option>';
    }
}

//MENU

function main() {
    let menujuego = document.querySelector('#mainmenu');
    let menubotfooter = document.createElement('div');
    menubotfooter.id = "submenufooter";
    let menubot = document.createElement('div');
    menubot.classList.add('submenu');
    if (boton) {
        menubot.setAttribute("style", "display:none");
    } else {
        menubot.setAttribute("style", "display:block");
    }
    menubot.id = "bot";
    let autoworktype = document.createElement('select');
    autoworktype.id = "autoworktype";
    autoworktype.innerHTML = '<option value="0">Senator -3♦</div></option><option value="1">Jeweller -3♦</div></option><option value="2" selected>Stable boy</option><option value="3">Farmer</option><option value="4">Butcher</option><option value="5">Fisherman</option><option value="6">Baker</option><option value="7">Blacksmith</option><option value="8">Master blacksmith -3♦</option>';
    let autoworktime = document.createElement('select');
    autoworktime.id = "autoworktime";
    autoworktime.innerHTML = '<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6">6 HOURS</option><option value="7">7 HOURS</option><option value="8" selected>8 HOURS</option>';
    let autoworkboton = document.createElement('a');
    autoworkboton.classList.add('menuitem');
    autoworkboton.href = "#";
    if (autoworkok) {
        autoworkboton.innerHTML = "AUTOWORK ON";
        autoworktype.setAttribute("style", "display:none;margin-left:10px;");
        autoworktime.setAttribute("style", "display:none;margin-left:10px;");
    } else {
        autoworkboton.innerHTML = "AUTOWORK OFF";
        autoworktype.setAttribute("style", "display:block;margin-left:10px;");
        autoworktime.setAttribute("style", "display:block;margin-left:10px;");
    }
    //BOTON REZAR
    let prayboton = document.createElement('a');
    let selectpraygod = document.createElement('select');
    let selectpraygrace = document.createElement('select');
    prayboton.classList.add('menuitem');
    prayboton.href = "#";
    selectpraygod.id = "praygod";
    selectpraygod.innerHTML = '<option value="1" selected>Minerva</option><option value="2">Diana</option><option value="3">Vulcano</option><option value="4">Marte</option><option value="5">Apolo</option><option value="6">Mercurio</option>';
    selectpraygrace.id = "praygrace";
    selectpraygrace.innerHTML = '<option value="1" selected>1 grace</option><option value="2">2 grace</option><option value="3">3 grace</option><option value="4">4 grace</option><option value="5">5 grace</option><option value="6">6 grace</option><option value="7">7 grace</option><option value="8">8 grace</option><option value="9">9 grace</option><option value="10">10 grace</option><option value="11">11 grace</option><option value="12">12 grace</option><option value="13">13 grace</option><option value="14">14 grace</option><option value="15">15 grace</option><option value="16">16 grace</option><option value="17">17 grace</option><option value="18">18 grace</option>';
    if (autoprayok) {
        prayboton.innerHTML = "AUTO PRAY ON";
        selectpraygod.setAttribute("style", "display:none;margin-left:10px;");
        selectpraygrace.setAttribute("style", "display:none;margin-left:10px;");
    } else {
        prayboton.innerHTML = "AUTO PRAY OFF";
        selectpraygod.setAttribute("style", "display:block;margin-left:10px;");
        selectpraygrace.setAttribute("style", "display:block;margin-left:10px;");
    }
    //BOTON EXPEDICION
    let expeditionboton = document.createElement('a');
    let selectexpeditionmap = document.createElement('select');
    let selectexpeditiontarget = document.createElement('select');
    expeditionboton.classList.add('menuitem');
    expeditionboton.href = "#";
    let expeditionhp = document.createElement('input');
    expeditionhp.setAttribute("type", "range");
    expeditionhp.setAttribute("list", "expdatalist");
    expeditionhp.id = "expeditionhp";
    let expdatalist = document.createElement('datalist');
    expdatalist.id = "expdatalist";
    expdatalist.innerHTML = '<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let expdatalabel = document.createElement('span');
    expdatalabel.innerHTML = "NOT ATTACK HP < 50%";
    expdatalabel.id = "expdatalabel";
    if (autoexpeditionok) {
        expeditionboton.innerHTML = "AUTO EXPEDITION ON";
        selectexpeditionmap.setAttribute("style", "display:none;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style", "display:none;margin-left:10px;");
        expeditionhp.setAttribute("style", "display:none;margin-left:10px;");
        expdatalabel.setAttribute("style", "display:none;margin-left:10px;color:yellow;");
    } else {
        expeditionboton.innerHTML = "AUTO EXPEDITION OFF";
        selectexpeditionmap.setAttribute("style", "display:block;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style", "display:block;margin-left:10px;");
        expeditionhp.setAttribute("style", "display:block;margin-left:10px;");
        expdatalabel.setAttribute("style", "display:block;margin-left:10px;color:yellow;");
    }
    selectexpeditionmap.id = "expeditionmap";
    let zonas = document.querySelectorAll("div#submenu2 a.menuitem");
    let zona;
    for (let i = 1; i < zonas.length; i++) {
        if (!zonas[i].classList.contains("eyecatcher")) {
            zona = document.createElement('option');
            zona.innerHTML = zonas[i].innerHTML;
            zona.setAttribute("value", i - 1);
            selectexpeditionmap.appendChild(zona);
        }
    }
    selectexpeditiontarget.innerHTML = '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>';
    selectexpeditiontarget.id = "expeditiontarget";
    //BOTON DUNGEON
    let dungeonboton = document.createElement('a');
    let advanced = document.createElement('select');
    advanced.id = "advanced";
    advanced.innerHTML = '<option value="false">NORMAL</option><option value="true">ADVANCED</option>';
    let skipboss = document.createElement('select');
    skipboss.id = "skipboss";
    skipboss.innerHTML = '<option value="false">KILL BOSS</option><option value="true">SKIP BOSS</option>';
    dungeonboton.classList.add('menuitem');
    if (autodungeonok) {
        dungeonboton.innerHTML = "AUTO DUNGEON ON";
        advanced.setAttribute("style", "display:none;margin-left:10px;");
        skipboss.setAttribute("style", "display:none;margin-left:10px;");
    } else {
        dungeonboton.innerHTML = "AUTO DUNGEON OFF";
        advanced.setAttribute("style", "display:block;margin-left:10px;");
        skipboss.setAttribute("style", "display:block;margin-left:10px;");
    }
    dungeonboton.href = "#";
    //BOTON ARENA
    let arenaboton = document.createElement('a');
    let selectarenatarget = document.createElement('select');
    arenaboton.classList.add('menuitem');
    arenaboton.href = "#";
    let arenahp = document.createElement('input');
    arenahp.setAttribute("type", "range");
    arenahp.setAttribute("list", "arenadatalist");
    arenahp.id = "arenahp";
    let arenadatalist = document.createElement('datalist');
    arenadatalist.id = "arenadatalist";
    arenadatalist.innerHTML = '<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let arenadatalabel = document.createElement('span');
    arenadatalabel.innerHTML = "NOT ATTACK HP < 50%";
    arenadatalabel.id = "arenadatalabel";
    if (autoarenaok) {
        arenaboton.innerHTML = "AUTO ARENA ON";
        selectarenatarget.setAttribute("style", "display:none;margin-left:10px;");
        arenahp.setAttribute("style", "display:none;margin-left:10px;");
        arenadatalabel.setAttribute("style", "display:none;margin-left:10px;color:yellow;");
    } else {
        arenaboton.innerHTML = "AUTO ARENA OFF";
        selectarenatarget.setAttribute("style", "display:block;margin-left:10px;");
        arenahp.setAttribute("style", "display:block;margin-left:10px;");
        arenadatalabel.setAttribute("style", "display:block;margin-left:10px;color:yellow;");
    }
    let lvl = parseInt(document.querySelector('div#header_values_level').innerHTML);
    selectarenatarget.innerHTML = '<option value="999" selected>No Limit</option><option value="' + (lvl - 3) + '">Target level <' + (lvl - 3) + '</option><option value="' + (lvl - 2) + '">Target level <' + (lvl - 2) + '</option><option value="' + (lvl - 1) + '">Target level <' + (lvl - 1) + '</option><option value="' + lvl + '">Target level <' + lvl + '</option><option value="' + (lvl + 1) + '">Target level <' + (lvl + 1) + '</option><option value="' + (lvl + 2) + '">Target level <' + (lvl + 2) + '</option><option value="' + (lvl + 3) + '">Target level <' + (lvl + 3) + '</option><option value="' + (lvl + 4) + '">Target level <' + (lvl + 4) + '</option><option value="' + (lvl + 5) + '">Target level <' + (lvl + 5) + '</option>';
    selectarenatarget.id = "arenatarget";
    //ARENA CUSTOMTARGET ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let arenacustomtarget = document.createElement('a');
    arenacustomtarget.classList.add('menuitem');
    arenacustomtarget.href = "#";
    let arenatargetname = document.createElement('input');
    let arenatargetserver = document.createElement('input');
    let arenaaddtarget = document.createElement('button');
    let arenatable = document.createElement('table');
    //BOTON TURMA
    let turmaboton = document.createElement('a');
    let selectturmatarget = document.createElement('select');
    turmaboton.classList.add('menuitem');
    turmaboton.href = "#";
    if (autoturmaok) {
        turmaboton.innerHTML = "AUTO TURMA ON";
        selectturmatarget.setAttribute("style", "display:none;margin-left:10px;");
    } else {
        turmaboton.innerHTML = "AUTO TURMA OFF";
        selectturmatarget.setAttribute("style", "display:block;margin-left:10px;");
    }
    selectturmatarget.innerHTML = '<option value="999" selected>No Limit</option><option value="' + (lvl - 3) + '">Target level <' + (lvl - 3) + '</option><option value="' + (lvl - 2) + '">Target level <' + (lvl - 2) + '</option><option value="' + (lvl - 1) + '">Target level <' + (lvl - 1) + '</option><option value="' + lvl + '">Target level <' + lvl + '</option><option value="' + (lvl + 1) + '">Target level <' + (lvl + 1) + '</option><option value="' + (lvl + 2) + '">Target level <' + (lvl + 2) + '</option><option value="' + (lvl + 3) + '">Target level <' + (lvl + 3) + '</option><option value="' + (lvl + 4) + '">Target level <' + (lvl + 4) + '</option><option value="' + (lvl + 5) + '">Target level <' + (lvl + 5) + '</option>';
    selectturmatarget.id = "turmatarget";
    //BOTON HIDE GOLD autohidegold
    let autohidegoldboton = document.createElement('a');
    autohidegoldboton.classList.add('menuitem');
    autohidegoldboton.href = "#";
    if (autohidegoldok) {
        autohidegoldboton.innerHTML = "AUTO TURMA ON";
    } else {
        autohidegoldboton.innerHTML = "AUTO TURMA OFF";
    }
    //BOTON EVENTO
    let eventboton = document.createElement('a');
    let selecteventtarget = document.createElement('select');
    eventboton.classList.add('menuitem');
    eventboton.href = "#";
    let eventhp = document.createElement('input');
    eventhp.setAttribute("type", "range");
    eventhp.setAttribute("list", "eventdatalist");
    eventhp.id = "eventhp";
    let eventdatalist = document.createElement('datalist');
    eventdatalist.id = "eventdatalist";
    eventdatalist.innerHTML = '<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let eventdatalabel = document.createElement('span');
    eventdatalabel.innerHTML = "NOT ATTACK HP < 50%";
    eventdatalabel.id = "eventdatalabel";
    if (autoeventok) {
        eventboton.innerHTML = "AUTO EVENT ON";
        selecteventtarget.setAttribute("style", "display:none;margin-left:10px;");
        eventhp.setAttribute("style", "display:none;margin-left:10px;");
        eventdatalabel.setAttribute("style", "display:none;margin-left:10px;color:yellow;");
    } else {
        eventboton.innerHTML = "AUTO EVENT OFF";
        selecteventtarget.setAttribute("style", "display:block;margin-left:10px;");
        eventhp.setAttribute("style", "display:block;margin-left:10px;");
        eventdatalabel.setAttribute("style", "display:block;margin-left:10px;color:yellow;");
    }
    selecteventtarget.innerHTML = '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>';
    selecteventtarget.id = "eventtarget";
    let menubotboton = document.createElement('a');
    menubotboton.classList.add('menuitem');
    menubotboton.classList.add('active');
    menubotboton.classList.add('glow');
    menubotboton.classList.add('eyecatcher');
    if (boton) {
        menubotboton.innerHTML = "BOT ON";
    } else {
        menubotboton.innerHTML = "BOT OFF";
    }
    menubotboton.id = "botboton";
    menubotboton.href = "#";
    //APPENDCHILLD
    menubot.appendChild(autoworkboton);
    menubot.appendChild(autoworktype);
    menubot.appendChild(autoworktime);
    menubot.appendChild(prayboton);
    menubot.appendChild(selectpraygod);
    menubot.appendChild(selectpraygrace);
    menubot.appendChild(expeditionboton);
    menubot.appendChild(selectexpeditionmap);
    menubot.appendChild(selectexpeditiontarget);
    menubot.appendChild(expdatalabel);
    menubot.appendChild(expeditionhp);
    menubot.appendChild(expdatalist);
    menubot.appendChild(dungeonboton);
    menubot.appendChild(advanced);
    menubot.appendChild(skipboss);
    menubot.appendChild(arenaboton);
    menubot.appendChild(selectarenatarget);
    menubot.appendChild(arenadatalabel);
    menubot.appendChild(arenahp);
    menubot.appendChild(arenadatalist);
    menubot.appendChild(turmaboton);
    menubot.appendChild(selectturmatarget);
    menubot.appendChild(hidegoldboton);
    if (existevent()) {
        menubot.appendChild(eventboton);
        menubot.appendChild(selecteventtarget);
        menubot.appendChild(eventdatalabel);
        menubot.appendChild(eventhp);
        menubot.appendChild(eventdatalist);
    }
    menubot.appendChild(menubotfooter);
    menujuego.appendChild(menubotboton);
    menujuego.appendChild(menubot);
    menubotboton = document.querySelector('#botboton');
    autoworktype.addEventListener("change", function () {
        createworkselect(autoworktype.value);
    });
    //EVENTS
    autoworkboton.addEventListener("click", function () {
        let autoworktime = document.querySelector('#autoworktime');
        let autoworktype = document.querySelector('#autoworktype');
        if (autoworkok) {
            autoworkok = false;
            autoworkboton.innerHTML = "AUTOWORK OFF";
            setCookie("autoworktype", autoworktype.value, 0);
            autoworktype.style.display = "block";
            setCookie("autoworktime", autoworktime.value, 0);
            autoworktime.style.display = "block";
        } else {
            autoworkok = true;
            autoworkboton.innerHTML = "AUTOWORK ON";
            setCookie("autoworktype", autoworktype.value, 10080);
            autoworktype.style.display = "none";
            setCookie("autoworktime", autoworktime.value, 10080);
            autoworktime.style.display = "none";
        }
        setCookie("autowork", autoworkok, 10080);
    });
    prayboton.addEventListener("click", function () {
        let selectpraygod = document.querySelector('#praygod');
        let selectpraygrace = document.querySelector('#praygrace');
        if (autoprayok) {
            autoprayok = false;
            prayboton.innerHTML = "AUTO PRAY OFF";
            setCookie("praygod", selectpraygod.value, 0);
            selectpraygod.style.display = "block";
            setCookie("praygrace", selectpraygrace.value, 0);
            selectpraygrace.style.display = "block";
        } else {
            autoprayok = true;
            prayboton.innerHTML = "AUTO PRAY ON";
            setCookie("praygod", selectpraygod.value, 10080);
            selectpraygod.style.display = "none";
            setCookie("praygrace", selectpraygrace.value, 10080);
            selectpraygrace.style.display = "none";
        }
        setCookie("autopray", autoprayok, 10080);
    });
    expeditionhp.addEventListener("change", function () {
        var expdatalabel = document.querySelector('#expdatalabel');
        expdatalabel.innerHTML = "NOT ATTACK HP < " + expeditionhp.value + "%";
    });
    expeditionboton.addEventListener("click", function () {
        var selectedexpeditionmap = document.querySelector('#expeditionmap');
        var selectedexpeditiontarget = document.querySelector('#expeditiontarget');
        var expdatalabel = document.querySelector('#expdatalabel');
        var expeditionhp = document.querySelector('#expeditionhp');
        if (autoexpeditionok) {
            autoexpeditionok = false;
            setCookie("autoexpeditionmap", selectedexpeditionmap.value, 0);
            setCookie("autoexpeditiontarget", selectedexpeditiontarget.value, 0);
            setCookie("expeditionhp", expeditionhp.value, 0);
            expeditionboton.innerHTML = "AUTO EXPEDITION OFF";
            selectedexpeditionmap.style.display = "block";
            selectedexpeditiontarget.style.display = "block";
            expdatalabel.style.display = "block";
            expeditionhp.style.display = "block";
        } else {
            autoexpeditionok = true;
            setCookie("autoexpeditionmap", selectedexpeditionmap.value, 10080);
            setCookie("autoexpeditiontarget", selectedexpeditiontarget.value, 10080);
            setCookie("expeditionhp", expeditionhp.value, 10080);
            expeditionboton.innerHTML = "AUTO EXPEDITION ON";
            selectedexpeditionmap.style.display = "none";
            selectedexpeditiontarget.style.display = "none";
            expdatalabel.style.display = "none";
            expeditionhp.style.display = "none";
        }
        setCookie("autoexpedition", autoexpeditionok, 10080);
    });
    dungeonboton.addEventListener("click", function () {
        let advanced = document.querySelector('#advanced');
        let skipboss = document.querySelector('#skipboss');
        if (autodungeonok) {
            autodungeonok = false;
            dungeonboton.innerHTML = "AUTO DUNGEON OFF";
            setCookie("advanced", advanced.value, 0);
            advanced.style.display = "block";
            setCookie("skipboss", skipboss.value, 0);
            skipboss.style.display = "block";
        } else {
            autodungeonok = true;
            dungeonboton.innerHTML = "AUTO DUNGEON ON";
            setCookie("advanced", advanced.value, 10080);
            advanced.style.display = "none";
            setCookie("skipboss", skipboss.value, 10080);
            skipboss.style.display = "none";
        }
        setCookie("autodungeon", autodungeonok, 10080);
    });
    arenahp.addEventListener("change", function () {
        var arenadatalabel = document.querySelector('#arenadatalabel');
        arenadatalabel.innerHTML = "NOT ATTACK HP < " + arenahp.value + "%";
    });
    arenaboton.addEventListener("click", function () {
        let arenatarget = document.querySelector('#arenatarget');
        if (autoarenaok) {
            autoarenaok = false;
            arenaboton.innerHTML = "AUTO ARENA OFF";
            setCookie("arenatarget", arenatarget.value, 0);
            setCookie("arenahp", arenahp.value, 0);
            arenatarget.style.display = "block";
            arenadatalabel.style.display = "block";
            arenahp.style.display = "block";
        } else {
            autoarenaok = true;
            arenaboton.innerHTML = "AUTO ARENA ON";
            setCookie("arenatarget", arenatarget.value, 10080);
            setCookie("arenahp", arenahp.value, 10080);
            arenatarget.style.display = "none";
            arenadatalabel.style.display = "none";
            arenahp.style.display = "none";
        }
        setCookie("autoarena", autoarenaok, 10080);
    });
    turmaboton.addEventListener("click", function () {
        let turmatarget = document.querySelector('#turmatarget');
        if (autoturmaok) {
            autoturmaok = false;
            turmaboton.innerHTML = "AUTO TURMA OFF";
            setCookie("turmatarget", turmatarget.value, 0);
            turmatarget.style.display = "block";
        } else {
            autoturmaok = true;
            turmaboton.innerHTML = "AUTO TURMA ON";
            setCookie("turmatarget", turmatarget.value, 10080);
            turmatarget.style.display = "none";
        }
        setCookie("autoturma", autoturmaok, 10080);
    });
    autohidegoldboton.addEventListener("click", function () {
        if (autohidegoldboton) {
            autohidegoldboton = false;
            autohidegoldboton.innerHTML = "AUTO HIDE GOLD OFF";
        } else {
            autohidegoldboton = true;
            autohidegoldboton.innerHTML = "AUTO HIDE GOLD ON";
        }
        setCookie("autohidegold", autohidegoldok, 10080);
    });
    if (existevent()) {
        eventhp.addEventListener("change", function () {
            var eventdatalabel = document.querySelector('#eventdatalabel');
            eventdatalabel.innerHTML = "NOT ATTACK HP < " + eventhp.value + "%";
        });
        eventboton.addEventListener("click", function () {
            var selectedeventtarget = document.querySelector('#eventtarget');
            if (autoeventok) {
                autoeventok = false;
                setCookie("autoeventtarget", selectedeventtarget.value, 0);
                setCookie("eventhp", eventhp.value, 0);
                eventboton.innerHTML = "AUTO EVENT OFF";
                selectedeventtarget.style.display = "block";
                eventdatalabel.style.display = "block";
                eventhp.style.display = "block";
            } else {
                autoeventok = true;
                setCookie("autoeventtarget", selectedeventtarget.value, 10080);
                setCookie("eventhp", eventhp.value, 10080);
                eventboton.innerHTML = "AUTO EVENT ON";
                selectedeventtarget.style.display = "none";
                eventdatalabel.style.display = "none";
                eventhp.style.display = "none";
            }
            setCookie("autoevent", autoeventok, 10080);
        });
    }
    menubotboton.addEventListener("click", function () {
        let menubot = document.querySelector('#bot');
        if (boton) {
            menubot.style.display = "block";
            menubotboton.innerHTML = "BOT OFF";
            boton = false;
            setCookie("boton", boton, 10080);
        } else {
            menubot.style.display = "none";
            menubotboton.innerHTML = "BOT ON";
            boton = true;
            setCookie("boton", boton, 10080);
            listoparajugar();
        }
    });
    setTimeout(listoparajugar, 2000);
}

//************  get time for a element  **************

function getRemainingTime(elemTime) {
    var timeText, x, time;
    timeText = elemTime.innerText;
    time = timeText[0] * 60 + timeText[2] * 10 + timeText[3] * 1 + 1;
    return time;
}
function getEventTime() {
    try {
        var timeText, x, time;
        timeText = document.querySelector('div#content span.ticker').innerText.slice(-7);
        time = timeText[0] * 60 + timeText[2] * 10 + timeText[3] * 1 + 1;
        return time;
    } catch (error) {
        setTimeout(myPause, 2000);
    }
}
//************  calculate lower HP  **************
function hpLowerThan(hp) {
    let hpbar = document.querySelector('div#header_values_hp_percent').innerText;
    let hpnumber = "";
    let index = 0;
    while (hpbar.charAt(index) != "%") {
        hpnumber += hpbar.charAt(index);
        index++;
    }
    return (parseInt(hpnumber) <= hp);
}

//************  calculate random delays  **************
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}