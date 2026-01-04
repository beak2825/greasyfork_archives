// ==UserScript==
// @name         TGA - Assists
// @namespace    kivou-tga
// @version      1.8.2
// @grant        GM_addStyle
// @description  Sends an assist requests to the TGA discord server... among other things
// @author       Kivou [2000607]
// @grant        GM.xmlHttpRequest
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/453606/TGA%20-%20Assists.user.js
// @updateURL https://update.greasyfork.org/scripts/453606/TGA%20-%20Assists.meta.js
// ==/UserScript==

// Copyright © 2022 Kivou [2000607] <contact@bpnrzhk.xyz>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

// ENTER YOUR API KEY HERE (PUBLIC KEY IS ENOUGH BUT IT NEEDS TO BE THE SAME AS THE ONE ON YATA IF YOU WANT THE BATTLE STATS DISPLAYED)
// https://www.torn.com/preferences.php#tab=api
const API_KEY = "";

// discord & websocket server
const DISCORD_SERVER = "1033832974979956799";
const API_URL = "https://bpnrzhk.xyz/apiflkmizbkdzmwp";
const WS_LOCAL_PORT = "8642";
const DEBUG = false

// groups
const GROUPS = ["smoke", "tear-gas", "0-100m", "100m-1b", "1b-5b", "5b-10b", "10b+"];
const ROLES = ["Monarch HQ", "Monarch Engineering", "Monarch Research", "Vulpes Vulpes", "MMCP", "The Black Hand", "The Next Level", "The Wolverines"];

// ratelimit
const RATELIMIT = 2;

const change_message = (txt, type) => {
    console.log(`[kiv assists script - change message] New message: ${txt} (${type})`);
    const targetNode = document.getElementById("kiv-result");
    targetNode.classList.remove("valid", "error", "warning");
    targetNode.classList.add(type);
    targetNode.innerHTML = txt;
};

const get_target_id = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const target_id = urlParams.get("user2ID");
    if(!target_id){
        console.log(`[kiv assists script - get target id] Coulnd'n parse target ID (${target_id})`);
    }
    return target_id;
};

const waitForElement = (selector) => {

    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

const inject_initial_html = () => {
    waitForElement(`#dark-mode-state`).then((elm) => {

        // css light vs dark mode
        let bgcolor_a = '#fff';
        let bgcolor_b = '#ccc';
        let ftcolor_a = '#555';
        let ftcolor_b = '#000';
        if(elm.checked) {
            console.log('[kiv assists script] dark mode');
            ftcolor_a = '#eee';
            ftcolor_b = '#999';
            bgcolor_a = '#555';
            bgcolor_b = '#333';
        }

        // css mode
        const cssTxt = `
    div.kiv-assist {
      color: ${ftcolor_a};
      //height: 25px;
      background: ${bgcolor_b};
      border: 1px solid ${ftcolor_b};
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
    }

    div.kiv-assist > select {
      background: ${bgcolor_b};
      border-color: #0000;
      color: ${ftcolor_a};
      cursor: pointer;
    }
    span.kiv-call {
          color: ${ftcolor_a};
    }
    span.kiv-call {
      color: ${ftcolor_a};
      background: linear-gradient(180deg, ${bgcolor_a}, ${bgcolor_b});
      border: 1px solid ${ftcolor_b};
      padding: 4px;
      margin-left: 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    span.kiv-call:hover {
      color: ${ftcolor_b};
    }

    span.kiv-call:active {
      color: ${ftcolor_a};
      -moz-box-shadow: inset 0 0 2px ${ftcolor_a};
      -webkit-box-shadow: inset 0 0 2px ${ftcolor_a};
      box-shadow: 0 0 2px ${ftcolor_a};
    }

    span.kiv-result {
      padding: 4px;
      border-radius: 4px;
      /* float: right; */
    }
    span#kiv-wall,
    span#kiv-faction {
       margin: 0px 5px;
    }

    span.error {
      background: linear-gradient(180deg, #C33, #C11, #C33);
      border: 1px solid ${ftcolor_b};
    }
    span.valid {
      background: linear-gradient(180deg, #383, #181, #383);
      border: 1px solid ${ftcolor_b};
    }
    span.warning {
      background: linear-gradient(180deg, #F50, #F30, #F50);
      border: 1px solid ${ftcolor_b};
    }
    div.kiv-call {
      margin: 5px;
      padding: 5px;
      display: flex;
      align-items: center;
    }
    div.kiv-call > div {
      margin: 10px 0px;
    }
    div.kiv-message {
      margin-right: -6px;
    }
    div.kiv-stats {
      border: 1px solid ${ftcolor_b};
      border-radius: 5px;
      margin: 5px;
      padding: 5px;
      width: 33%;
      line-height: 1.1;
    }
    span.kiv-attachements {
      margin-left: 10px;
      font-size: 85%
    }
    p.kiv-title {
      margin-bottom: 5px;
      font-weight: heavy;
    }
    div.kiv-title {
      border: 1px solid ${ftcolor_b};
      margin-left: -8px;
      margin-top: -8px;
      border-radius: 4px 0px 4px 0px;
      padding: 8px;
      width: fit-content;
      display: inline;
    }
    span.kiv-emph {
       font-weight: bold;
       color: red;
    }
    div.kiv-load-assist {
        margin: 5px;
        color: orange;
        font-weight: bold;
        cursor: pointer;
    }
    `;
        GM_addStyle (cssTxt);
    });

    const html = `<div id="kiv-load-assist" class="kiv-load-assist">[TGA - Assists] Click to load assist panel</div>`;
    waitForElement("#react-root").then((elm) => {
        elm.insertAdjacentHTML('beforebegin', html);
    });
};

const display_spy = () => {
    function int_comma(a){
        return a.toLocaleString('en-GB');
    }

    waitForElement("#kiv-assist").then((elm) => {
        const target_id = get_target_id();
        console.log(`[kiv assists script - display spy] Getting spy for target: ${target_id}`);
        GM.xmlHttpRequest({
            method: 'POST',
            url: `https://yata.yt/api/v1/spy/${target_id}?key=${API_KEY}`,
            onload: function (response) {
                if (response.status == '200') {
                    const spy = JSON.parse(response.response).spies[target_id];
                    if(spy) {
                        elm.querySelector("#kiv-str").textContent = int_comma(spy.strength);
                        elm.querySelector("#kiv-def").textContent = int_comma(spy.defense);
                        elm.querySelector("#kiv-dex").textContent = int_comma(spy.dexterity);
                        elm.querySelector("#kiv-spd").textContent = int_comma(spy.speed);
                        elm.querySelector("#kiv-tot").textContent = int_comma(spy.total);
                        console.log(`[kiv assists script  - display spy] Spy found`);
                        change_message(`Spy: stats received`, "valid");
                    } else {
                        console.log(`[kiv assists script  - display spy] Spy not found`);
                        change_message(`Spy: Not found`, "warning");
                    }
                } else if (response.status == '400') {
                    console.log(`[kiv assists script  - display spy] 400 : ${JSON.parse(response.responseText).error.error}`);
                    change_message(`Spy: ${JSON.parse(response.responseText).error.error}`, "warning");
                } else {
                    change_message(`Spy: ${JSON.parse(response.responseText).error.error}`, "error");
                }
            },
            onerror: function (error) {
                change_message("Spy: ${error}", "error");
            }
        });
    });
};

const display_loadout = () => {

    function int_comma(a){
        return a.toLocaleString('en-GB');
    }

    console.log(`[kiv assists script - display loadout] Displaying loadout`);

    function html_armors(armors){
        const html_array = Object.keys(armors).map(k => `<b>${k}</b>: ${armors[k].name}`);
        return html_array.join("<br>");
    }

    function html_weapon(k, weapon){
        let main = `<span style="text-transform: capitalize;"><b>${k.split("_")[1]}</span></b>: ${weapon.name}`;
        if(weapon.ammo != "") {
            main += ` (${weapon.ammo}) `;
        }


        const bonus_array = weapon.attachements.map(
            x => `<span class="kiv-attachements">${x}</span>`
        ).concat(weapon.bonus.map(
            x => `<span class="kiv-attachements">${x}</span>`
        ));
        if(bonus_array.length) {
            return main + "<br/>" + bonus_array.join("<br/>");
        } else {
            return main;
        }

    }

    function html_weapons(weapons){
        const html_array = Object.keys(weapons).map(k => html_weapon(k, weapons[k]));
        return html_array.join("<br>");
    }

    waitForElement("#kiv-assist").then((elm) => {
        const target_id = get_target_id();
        GM.xmlHttpRequest({
            method: 'GET',
            url: `${API_URL}/loadout/get/${target_id}`,
            onload: function (response) {
                if (response.status == '200') {
                    const loadout = JSON.parse(response.response).loadout;
                    if(loadout) {
                        console.log(`[kiv assists script - display loadout] Loadout found`);
                        change_message(`Loadout: received`, "valid");
                        elm.querySelector("#kiv-weapons").innerHTML = html_weapons(loadout.weapons);
                        elm.querySelector("#kiv-armors").innerHTML = html_armors(loadout.armors);
                    } else {
                        change_message(`Loadout: not found`, "warning");
                    }
                } else if (response.status == '400') {
                    console.log(`[kiv assists script - display loadout] User error  ${JSON.parse(response.responseText).error.error}`);
                    change_message(`Loadout: ${JSON.parse(response.responseText).error.error}`, "warning");
                } else {
                    console.log(`[kiv assists script - display loadout] Server error  ${JSON.parse(response.responseText).error.error}`);
                    change_message(`Loadout: ${JSON.parse(response.responseText).error.error}`, "error");
                }
            },
            onerror: function (error) {
                console.log(`[kiv assists script - display loadout] Unknwon error  ${error}`);
                change_message(`Loadout: ${error}`, "error");
            }
        });
    });
};

const inject_assist_html = () => {
    console.log(`[kiv assists script - inject initial html] Inject initial html`);

    let html = `
        <div id="kiv-assist" class="kiv-assist m-bottom10">
        <div style="display: flex; justify-content: space-between;">
          <div class="kiv-title">
            TGA Assist script
          </div>
          <div class="kiv-message">
            <span id="kiv-result" class="kiv-result"></span>
          </div>
        </div>
        <div id="kiv-clear-1" class="clear"></div>
        <div style="margin: 5px; padding: 5px; line-height: 1.1;">
        <b>Definitions:</b> fronliner: refering to a player making an attack for a wall. Backliner: refering to a player assisting a frontliner.<br>
        <b>Assists call:</b> should be used by <span class="kiv-emph">fronliners</span>. Choose a number of backliners and a role to ping. You can make two calls with, for example, 4 @smokes 1 @5m-10m. No need to spam.<br>
        <b>Finishing hit:</b> should be used by <span class="kiv-emph">backliners</span>. When sitting on a target full of smokes use this call to tell the warring faction to make the finishing hit, thus avoiding Early Discharges. Be sure to select <span class="kiv-emph">the faction in war with the target</span>.
        </div>
        <div id="kiv-clear-1" class="clear"></div>
        <div style="display: flex;">
          <div class="kiv-call" style="width: 40%;">
            Call for
            <select id="kiv-number" style="margin: 0px 5px;">
                <option value="1">1</option>
                <option value="2" selected="selected">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
            <select id="kiv-group" style="margin: 0px 5px;">
    `;
    for(let i in GROUPS){
        html += `<option value="${GROUPS[i]}">${GROUPS[i]}</option>`;
    }
    html += `
            </select>
            <span id="kiv-member-plural">s</span>
            <span id="kiv-call-assists" class="kiv-call" data-type="assists" style="margin: 0px 5px;">CALL</span>
          </div>
          <div class="kiv-call" style="width: 20%;">
            Massive sitting
            <span id="kiv-call-sit" class="kiv-call" data-type="sitonthebitch">SIT</span>
          </div>
           <div class="kiv-call" style="width: 40%;">
            Finishing hit for
            <select id="kiv-role" style="margin: 0px 5px;">
    `;
    for(let i in ROLES){
        html += `<option value="${ROLES[i]}">${ROLES[i]}</option>`;
    }
    html += `
            </select>
            <span id="kiv-call-finish" class="kiv-call" data-type="finish">FINISH</span>
          </div>
        </div>
        <div id="kiv-clear-1" class="clear"></div>
        <div style="display: flex;">
          <div class="kiv-stats">
             <p class="kiv-title">Battle stats</p>
             <b>Str</b>: <span id="kiv-str" class="kiv-bstat"></span><br>
             <b>Def</b>: <span id="kiv-def" class="kiv-bstat"></span><br>
             <b>Dex</b>: <span id="kiv-dex" class="kiv-bstat"></span><br>
             <b>Spd</b>: <span id="kiv-spd" class="kiv-bstat"></span><br>
             <b>Tot</b>: <span id="kiv-tot" class="kiv-bstat"></span>
           </div>
           <div class="kiv-stats">
             <p class="kiv-title">Weapons</p>
             <div id="kiv-weapons"></div>
           </div>
           <div class="kiv-stats">
             <p class="kiv-title">Armors</p>
             <div id="kiv-armors"></div>
            </div>
          </div>
          <div id="kiv-clear-2" class="clear"></div>
        </div>
    `;

    // display html
    waitForElement(`#kiv-load-assist`).then((elm) => {
        elm.addEventListener("click", () => {
            console.log(`[kiv assists script] Load assist tools`);
            document.getElementById("react-root").insertAdjacentHTML('beforebegin', html);
            elm.style.display = "none";
        }, {once : true});
    });
};

const assist_call = () => {
    const handle_call = (e) => {
        const dt = parseInt(Date.now() / 1000) - last_call;
        if(dt < RATELIMIT){
            // ratelimit
            console.log(`[kiv assists script - assist call] Delay between calls: ${dt}s`);
            change_message(`Ratelimit of 1 call per ${RATELIMIT}s. Try again in ${RATELIMIT - dt}s if needed`, "warning");
            return;
        }

        console.log(`[kiv assists script] Delay between calls: ${dt}s`);
        change_message('<img src="https://yata.yt/media/misc/crimes2.gif" />');

        // data to be sent
        let data = {};
        data.type = e.target.dataset.type;
        if(DEBUG){
            data.type += "-debug"
        }
        console.log(`[kiv assists script - assist call] Call type: ${data.type}`);
        data.port = WS_LOCAL_PORT;
        data.server = DISCORD_SERVER;
        data.api_key = API_KEY;
        const group = document.getElementById('kiv-group');
        data.group = group.options[group.selectedIndex].value;
        const number = document.getElementById('kiv-number');
        data.number = number.options[number.selectedIndex].value;
        const role = document.getElementById('kiv-role');
        data.role = role.options[role.selectedIndex].value;

        // get player ID/name
        const player_from_chat = JSON.parse(document.getElementById("websocketConnectionData").innerHTML);
        data.player_id = player_from_chat.userID;
        data.player_name = player_from_chat.playername;

        // get target ID/name
        data.target_id = get_target_id();
        data.target_name = document.querySelector("#defender span[id^=playername]").innerText;
        if(data.target_name==""){
            console.log(`[kiv assists script - assist call] Coulnd't find target name`);
            data.target_name = document.querySelectorAll("div[class^=header___]")[1].getAttribute("aria-describedby").split(" ")[0].split("_")[1];
        }

        if(data.target_id==null){
            change_message("Couldn't parse target ID", "error");
            return;
        }

        // send call
        GM.xmlHttpRequest({
            method: 'POST',
            url: API_URL,
            data: JSON.stringify(data),
            headers:    {
                "Content-Type": "application/json",
                "Diderot-Relay-Port": WS_LOCAL_PORT
            },
            onload: function (response) {
                for(let k in data){
                    console.log(`[kiv assists script - assist call] sends: ${k}: ${data[k]}`);
                }
                if (response.status == '200') {
                    console.log(`[kiv assists script - assist call] Successful call`);
                    if (data.type == 'assists') {
                        change_message(`Call sent for <b>${data.number} ${data.group}</b> against <b>${data.target_name} [${data.target_id}]</b>`, "valid");
                    } else {
                        change_message(`Call sent for ${data.type}`, "valid");
                    }
                } else if (response.status == '400') {
                    console.log(`[kiv assists script - assist call] User error ${JSON.parse(response.responseText).error.error}`);
                    change_message(`User error: ${JSON.parse(response.responseText).error.error}`, "error");
                } else {
                    console.log(`[kiv assists script - assist call] Server error ${JSON.parse(response.responseText).error.error}`);
                    change_message(`Server error: ${JSON.parse(response.responseText).error.error}`, "error");
                }
            },
            onerror: function (error) {
                console.log(`[kiv assists script - assist call] Unknwon error ${error}`);
                change_message("Unkown error", "error");
            }
        });
    };

    // last call timestamp (to avoid spamming)
    let last_call = 0;

    // on click listener
    waitForElement(`#kiv-call-assists`).then((elm) => {
        elm.addEventListener("click", e => {
            console.log(`[kiv assists script - assist call] Making assist call`);
            handle_call(e);
            last_call = parseInt(Date.now() / 1000);
        });
    });
    waitForElement(`#kiv-call-finish`).then((elm) => {
        elm.addEventListener("click", e => {
            console.log(`[kiv assists script - assist call] Making assist call`);
            handle_call(e);
            last_call = parseInt(Date.now() / 1000);
        });
    });
    waitForElement(`#kiv-call-sit`).then((elm) => {
        elm.addEventListener("click", e => {
            console.log(`[kiv assists script - assist call] Making assist call`);
            handle_call(e);
            last_call = parseInt(Date.now() / 1000);
        });
    });
};

const update_loadout = () => {

    function extract_tooltip(s) {
        const span = document.createElement('span');
        if(s) {
            span.innerHTML = s.replace("<br/>", " ");
        }
        return span.textContent || span.innerText;
    }

    function extract_attachements(top, type) {
        const att = (type == "mods") ? top.childNodes[0] : top.childNodes[2];
        if(att) {
            return Array.from(att.childNodes).map(function(elm){
                return extract_tooltip(elm.firstChild.title);
            }).filter((str) => str != "");

        } else {
            return [];
        }
    }

    function extract_ammo(bottom) {
        if(!bottom.childNodes[1]) {
            return "";
        }
        if(bottom.childNodes[1].firstChild.classList.length < 2) {
            return "";
        }
        return bottom.childNodes[1].firstChild.classList[1].split("___")[0];
    }

    function parse_weapons(weaponList) {
        let weapons = {};
        weaponList.forEach(weapon => {
            const details = weapon.childNodes;

            // ignore kick/fist
            if(details.length != 3) {
                return;
            }

            // three parts of the weapon
            const top = details[0];
            const figure = details[1];
            const bottom = details[2];

            // data to record
            const name = figure.childNodes[0].alt;
            const attachements = extract_attachements(top, "mods");
            const bonus = extract_attachements(top, "bonus");
            const ammo = extract_ammo(bottom);

            weapons[weapon.id] = {
                name: name,
                attachements: attachements,
                bonus: bonus,
                ammo: ammo
            };
        });

        return weapons;
    }

    function parse_armors(armorList) {
        let armors = {};
        armorList.forEach(armor => {
            armors[armor.alt] = {
                name: armor.title
            };
        });
        return armors;
    }

    const send_call = (weapons, armors) => {

        const data = {
            target_id: get_target_id(),
            weapons: weapons,
            armors: armors,
            api_key: API_KEY
        };

        // send call
        GM.xmlHttpRequest({
            method: 'POST',
            url: API_URL + '/loadout/update',
            data: JSON.stringify(data),
            headers:    {
                "Content-Type": "application/json",
            },
            onload: function (response) {
                for(let k in data){
                    console.log(`[kiv assists script - update loadout] sends: ${k}: ${data[k]}`);
                }
                if (response.status == '200') {
                    console.log(`[kiv assists script - update loadout] Successful call`);
                    change_message(`Loadout updated`, "valid");
                } else if (response.status == '400') {
                    console.log(`[kiv assists script - update loadout] User error ${JSON.parse(response.responseText).error.error}`);
                    change_message(`User error: ${JSON.parse(response.responseText).error.error}`, "error");
                } else {
                    console.log(`[kiv assists script - update loadout] Server error ${JSON.parse(response.responseText).error.error}`);
                    change_message(`Server error: ${JSON.parse(response.responseText).error.error}`, "error");
                }
            },
            onerror: function (error) {
                console.log(`[kiv assists script - update loadout] Unknwon error ${error}`);
                change_message("Unkown error", "error");
            }
        });
    };

    const callback = (mutationList, observer) => {
        const mutation = mutationList[0];
        if (mutation.type === 'childList' && mutation.target.classList[0].startsWith("weaponList")) {
            const targetNode = document.getElementById("defender");
            const weaponList = targetNode.querySelector("[class^=weaponList]").childNodes;
            const armorList = targetNode.querySelector("[class^=model___]").childNodes[1].childNodes;
            const weapons = parse_weapons(weaponList);
            const armors = parse_armors(armorList);
            observer.disconnect();
            send_call(weapons, armors);
        }
    };

    waitForElement(`#defender .torn-btn`).then((elm) => {
        console.log(`[kiv assists script - update loadout] Attack button ready`);
        elm.addEventListener("click", function() {
            console.log(`[kiv assists script - update loadout] Attack button clicked`);
            const targetNode = document.getElementById("defender").children[1].children[0];
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, { childList: true, subtree: false });
        });
    });
};

const check_wall = () => {

    let wall_time = 0;

    const check_wall_status = (counter) => {

        const span = document.getElementById("kiv-wall");
        span.style.color = "orange";
        span.innerHTML = "Checking wall status...";
        const span_faction = document.getElementById("kiv-faction");
        const selections = [
            "profile,personalstats",
            "basic,personalstats",
            "bazaar,personalstats",
            "discord,personalstats",
            "display,personalstats",
            "icons,personalstats",
            "timestamp,personalstats",
            "personalstats"
        ];
        const url = `https://api.torn.com/user/${get_target_id()}?selections=${selections[counter % selections.length]}&key=${API_KEY}`;

        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: function (response) {
                if (response.status == '200') {
                    const new_wall_time = JSON.parse(response.responseText).personalstats.territorytime;
                    console.log(`[kiv assists script - wall status] Terr time ${counter} = ${wall_time} -> ${new_wall_time} (${new_wall_time - wall_time})`);
                    if(!counter) {
                        const faction_name = JSON.parse(response.responseText).faction.faction_name
                        const faction_id = JSON.parse(response.responseText).faction.faction_id
                        span_faction.innerHTML = `${faction_name} [${faction_id}]`;
                        if(ROLES.includes(faction_name)) {
                            //disable attack button
                            const button = document.querySelector("#defender button.torn-btn");
                            button.disabled = true;
                            button.innerHTML = "Allied";
                        }
                    }
                    if(new_wall_time > wall_time) {
                        if(wall_time) {
                            span.style.color = "red";
                            span.innerHTML = "ON WALL";
                        }
                        wall_time = new_wall_time;
                        return;
                    } else {
                        span.style.color = "green";
                        span.innerHTML = "OFF WALL";
                        return;
                    }
                }
            }
        });
    };

    waitForElement(`#defender`).then((elm) => {
        document.querySelector("h4[class^=title___]").insertAdjacentHTML('afterend', '<span id="kiv-wall"></span><span id="kiv-faction"></span>');
        let counter = 0;
        check_wall_status(counter);
        setInterval(function() {
            counter += 1;
            check_wall_status(counter);
        }, 6000);
    });
}

// main
(function() {
    'use strict';
    inject_initial_html();
    check_wall();
    inject_assist_html();
    assist_call();
    display_spy();
    display_loadout();
    update_loadout();
})();
