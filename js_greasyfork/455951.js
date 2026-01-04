// ==UserScript==
// @name         Faction war hospital timeout
// @namespace    https://www.torn.com/
// @version      2.2
// @description  View a hospital countdown for each hospitalized enemy!
// @author       ZemaVulpin[2025832]
// @match        https://www.torn.com/*factions.php?*step=your*
// @match        https://www.torn.com/*preferences.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455951/Faction%20war%20hospital%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/455951/Faction%20war%20hospital%20timeout.meta.js
// ==/UserScript==

var enemies_hosp = {};
var skye_doCustomSort = true;

function setupSort(faction_names) {
    if(!faction_names) {
        faction_names = document.querySelector(".faction-names");
        return setTimeout(setupSort, 100, faction_names);
    }
    if(!!document.getElementById("skye_doCustomSort")) return;

    faction_names.style.position = "relative";
    let label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" id="skye_doCustomSort" ${skye_doCustomSort ? 'checked' : ''}> Do custom sort`;
    label.style.position = "absolute";
    label.style.left = "0";
    label.style.bottom = "0";
    label.style.padding = "0.5rem";
    label.style.fontSize = "1rem";
    faction_names.insertAdjacentElement('beforeend', label);
}

function getEnemyFactions() {
    const enemy_faction_ids = [];
    document.querySelectorAll(".f-war-list [data-warid] img").forEach(img => {
        let fac_id = img.src.match(/\d+/)[0];
        if(fac_id != 12255) {
            enemy_faction_ids.push(fac_id);
        }
    });
    return enemy_faction_ids;
}

function getReleaseDates() {
    let enemies = {};
    getEnemyFactions().forEach(fac_id => {
        const XHR = new XMLHttpRequest();
        XHR.addEventListener('load', e => {
            let data = JSON.parse(e.target.response);
            try {
                Object.entries(data.members).forEach(([mem_id, mem_data]) => {
                    if(mem_data.status.state === "Hospital" && mem_data.status.description.includes("In hospital")) {
                        enemies[mem_id] = mem_data.status.until;
                    }
                });
            } catch(err) {
                console.log("ERROR");
                console.log(err);
            }
            enemies_hosp = enemies;
        });
        XHR.open("GET", `https://api.torn.com/faction/${fac_id}?key=${localStorage.getItem("torn-hosp-timer-api-key")}`);
        XHR.send();
    });
}

function showHospCountdownError(text) {
    let error = document.getElementById("hosp-timer-notification");
    error.innerHTML = text;
    error.style.display = "block";
}

function score(li) {
    let status = li.querySelector(".status");
    let text = status.innerHTML
    if(text.includes("Okay")) return 1;
    if(text.includes("Hospital")) {
        let time = parseInt(status.getAttribute("data-hosp-timer-until"));
        if(isNaN(time)) return Number.MAX_SAFE_INTEGER - 1;
        return time;
    }
    return Number.MAX_SAFE_INTEGER;
}

function sortEnemies() {
    let chk = document.getElementById("skye_doCustomSort");
    if(!chk) return setupSort(null);
    skye_doCustomSort = chk.checked;
    if(!chk.checked) return;


    let ul = document.querySelector('li.enemy')?.closest("ul");
    if(!ul) return;

    let swapped = true;

    while(swapped) {
        swapped = false;
        for(let i = 1; i < ul.children.length; i++) {
            if(score(ul.children[i-1]) > score(ul.children[i])) {
                swapped = true;
                ul.insertBefore(ul.children[i], ul.children[i-1]);
            }
        }
        // swapped = false;
    }
}

function doCountdowns() {
    document.querySelectorAll("li.enemy").forEach(li => {
        if(!li.id) li.id = crypto.randomUUID();
        let id = li.querySelector("a").id.match(/\d+/)[0];
        let status = li.querySelector(".status");
        if(enemies_hosp[id]) {
            status.setAttribute("data-hosp-timer-until", enemies_hosp[id]);
            let tSec = Math.floor(parseInt(enemies_hosp[id]) - (Date.now()/1000));
            let time = {
                h: Math.floor(tSec/(60*60)),
                m: Math.floor((tSec/60)%60),
                s: Math.floor(tSec%60)
            };
            let strTime = `${time.h ? time.h + 'h' : ''}${time.m ? time.m + 'm' : ''}${('00'+time.s).slice(-2)}s`;

            status.setAttribute("data-hosp-timer-str", strTime);
            status.style.color = `RGB(255, ${Math.min(165-Math.floor(tSec/22), 165)}, 0)`;
        } else {
            status.removeAttribute("data-hosp-timer-until");
            status.removeAttribute("data-hosp-timer-str");
            status.style.color = null;
        }
    });
    sortEnemies();
}

function set_API_key(key_icon) {
    let key = key_icon.querySelector("input.key___tBmXJ").value;
    localStorage.setItem("torn-hosp-timer-api-key", key);
    document.getElementById("hosp-timer-notification").style.display = "none";
}

(function() {
    'use strict';
    window.addEventListener("load", () => {
        document.body.insertAdjacentHTML("afterbegin", `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <style>
            .hosp-timer-icon {
                background-image: url("data:image/svg+xml,%3Csvg id='erobE3aRBfJ1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 50 50' shape-rendering='geometricPrecision' text-rendering='geometricPrecision'%3E%3Cellipse rx='24.5' ry='24.5' transform='translate(25 25)' fill='none' stroke='%23d2dbed'/%3E%3Crect width='15' height='15' rx='0' ry='0' transform='translate(2.5 17.5)' fill='%23d2dbed' stroke-width='0'/%3E%3Crect width='15' height='15' rx='0' ry='0' transform='translate(32.5 17.5)' fill='%23d2dbed' stroke-width='0'/%3E%3Crect width='15' height='15' rx='0' ry='0' transform='translate(17.5 32.5)' fill='%23d2dbed' stroke-width='0'/%3E%3Crect width='13' height='13' rx='0' ry='0' transform='translate(18.5 18.5)' fill='none' stroke='%23d2dbed'/%3E%3Crect width='15' height='15' rx='0' ry='0' transform='translate(17.5 2.5)' fill='%23d2dbed' stroke-width='0'/%3E%3Ctext dx='0' dy='0' font-family='&quot;erobE3aRBfJ1:::Roboto&quot;' font-size='10' font-weight='400' transform='translate(22.033767 28.499121)' fill='%23d2dbed' stroke-width='0'%3E%3Ctspan y='0' font-weight='400' stroke-width='0'%3E%3C!%5BCDATA%5B%0AS%0A%5D%5D%3E%3C/tspan%3E%3C/text%3E%3Cstyle%3E%3C!%5BCDATA%5B%0A@font-face %7Bfont-family: 'erobE3aRBfJ1:::Roboto';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');%7D%0A%5D%5D%3E%3C/style%3E%3C/svg%3E%0A");
            }
        </style>
        `);
        if(!document.getElementById("hosp-timer-notification")) {
            let div = document.createElement("div");
            div.id = "hosp-timer-notification";
            div.innerText = "Examle error";
            document.getElementById("header-root")?.insertAdjacentElement("beforebegin", div);

            let style = `
            <style>
            *[data-hosp-timer-str].not-ok {
                line-height: 1.5em !important;
            }
            *[data-hosp-timer-str].not-ok::after {
                content: attr(data-hosp-timer-str);
                display: block;
            }
            #hosp-timer-notification {
                background-color: #FFFAAA;
                padding: 0.5em;
                display: none;
                color: black;
                text-shadow: none;
                font-weight: bold;
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            .d .header-wrapper-top .container {
                z-index: 1 !important;
            }
            </style>
            `;
            document.body.insertAdjacentHTML("afterbegin", style);
        }
        if(!localStorage.getItem("torn-hosp-timer-api-key")) {
            showHospCountdownError(`API key not set. Set it in the <a href="https://www.torn.com/preferences.php#tab=api" style="color: #369;">API key page</a>.`);
        } else {
            if(window.location.href.match(/https:\/\/www\.torn\.com\/factions.php?.*step=your/gi)) {
                getReleaseDates();
                doCountdowns();
                setInterval(getReleaseDates, 1000*30);
                setTimeout(getReleaseDates, 1000*5);
                setInterval(doCountdowns, 100*5);
                setupSort(null);
                // let faction_names = document.querySelector(".faction-names");
                // console.log(faction_names);
            }
        }


        if(window.location.href.match(/https:\/\/www\.torn\.com\/preferences.php/gi)) {
            let key_icon = document.createElement("span");
            key_icon.className = "material-symbols-outlined";
            key_icon.innerText = " key ";
            key_icon.style.color = "blue";

            let add_key_block = document.querySelector("#preferencesroot .addKeyBlock___wLbFu");
            add_key_block.style.display = "flex";
            add_key_block.insertAdjacentHTML("beforeend", `
            <div>
                <p>Click on the <span style="padding: 0 0.2em;"> ${key_icon.outerHTML} </span> to let the <span style="padding: 0 0.2em; color: red;">Hospital Timer</span> script use your API key.</p>
            </div>`);

            let api_li_selector = "#preferencesroot li.keyRow___J0QVd";
            document
            .querySelectorAll(`${api_li_selector} input.key___tBmXJ`)
            .forEach(inp => {
                inp.parentElement.style.position = "relative";
                let key = document.createElement("div");
                key.insertAdjacentHTML("afterbegin", key_icon.outerHTML);
                key.className = "set-api-key-key";
                key.style.position = "absolute";
                key.style.left = "365px";
                key.style.top = "15px";
                key.style.cursor = "pointer";
                key.addEventListener('click', e => {
                    set_API_key(e.target.closest(".keyRow___J0QVd"));
                });
                inp.insertAdjacentElement("beforebegin", key);
            });

            let style = `
            <style>
                #preferencesroot .addKeyBlock___wLbFu, #preferencesroot .addKeyBlock___wLbFu * {
                    display: flex;
                    align-items: center;
                }
            </style>
            `;
            document.body.insertAdjacentHTML("afterbegin", style);
        }
    });
})();