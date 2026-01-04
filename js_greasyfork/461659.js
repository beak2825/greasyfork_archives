// ==UserScript==
// @name         TGA - Off the wall
// @namespace    kivou-tga
// @version      1.1.3
// @grant        GM_addStyle
// @description  Display off the wall members
// @author       Kivou [2000607]
// @grant        GM.xmlHttpRequest
// @match        https://www.torn.com/factions.php*
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/461659/TGA%20-%20Off%20the%20wall.user.js
// @updateURL https://update.greasyfork.org/scripts/461659/TGA%20-%20Off%20the%20wall.meta.js
// ==/UserScript==

// Copyright © 2023 Kivou [2000607] <contact@bpnrzhk.xyz>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

// ENTER YOUR (PUBLIC) API KEY HERE
// https://www.torn.com/preferences.php#tab=api
const API_KEY = "";

// css mode
const cssTxt = `
    div.kiv-member {
      text-align: left;
      display: inline-block;
      width: 25%;
   }
   a.kiv-disabled-link {
      color: currentColor;
      cursor: default;
      opacity: 0.5;
      text-decoration: none;
      pointer-events: none;
   }
   span.kiv-Offline {
      background: gray;
   }
   span.kiv-Online {
      background: green;
   }
   span.kiv-Idle {
      background: orange;
   }
   span.kiv-green {
      color: green;
   }
   span.kiv-blue {
      color: blue;
   }
   span.kiv-red {
      color: red;
   }
   span.kiv-status {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
   }
   span.kiv-toggle {
      margin: 5px;
      cursor: pointer;
   }
    `;
GM_addStyle(cssTxt);

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

const toggle_bool_storage = (key) => {
    sessionStorage.setItem(key, !Boolean(JSON.parse(sessionStorage.getItem(key))));
};

const get_bool_storage = (key) => {
    return Boolean(JSON.parse(sessionStorage.getItem(key)));
};

const filter_wall_jumps = (elm) => {
    return ["enemy ", "your "].includes(elm.className);
};

const filter_in_hosp = (elm) => {
    return Boolean(elm.querySelector(".kiv-blue, .kiv-red"));
};

const filter_offline = (elm) => {
    return Boolean(elm.querySelector(".kiv-Offline"));
};

const get_faction_id = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const faction_id = urlParams.get("ID");
    return faction_id;
};

const get_player_id = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const player_id = urlParams.get("XID");
    return player_id;
};

const disable_member = (member_id) => {
    const member = document.getElementById(`kiv-member-${member_id}`);
    if (member) {
        member.children[1].classList = ["kiv-disabled-link"];
        //member.style.display = "none"
    }
};

const enable_member = (member_id) => {
    const member = document.getElementById(`kiv-member-${member_id}`);
    if (member) {
        member.children[1].classList = ["t-blue h"];
        //member.style.display = "inline-block"
    }
};

const toggle_display = (elm) => {
    if (!Boolean(elm.style.display)) {
        elm.style.display = "none";
    } else {
        elm.style.display = "";
    }
};

const member_html = (member_id, member) => {
    let display = "";
    if (get_bool_storage("filter-hosp") && member.status.color == "red") {
        display = "none";
    }
    if (get_bool_storage("filter-offline") && member.last_action.status == "Offline") {
        display = "none";
    }
    return `<div class="kiv-member" id="kiv-member-${member_id}" style="display: ${display}"><span class="kiv-${member.last_action.status} kiv-status"></span><a href="/loader.php?sid=attack&user2ID=${member_id}" class="t-blue h" target="_blank">${member.name}</a> <span class="kiv-${member.status.color}">${member.status.state}</span> ${member.level}</div>`;
};

const members_html = (faction, elm) => {
    const n_members = Object.keys(faction.members).length;
    let html = `
       <div class="kiv-members">
          <div class="faction-names"><span class="enemy">${faction.name}</span><span class="vs"> off the wall members</span></div>
          <div style="margin-top: 5px;">
    `;
    for (const [key, value] of Object.entries(faction.members).sort((a, b) => { return b[1].last_action.timestamp - a[1].last_action.timestamp; })) {
        html += member_html(key, value);
    }
    for (let i = 0; i < (4 - n_members % 4) % 4; i += 1) {
        html += `<div class="kiv-member mtop-10"></div>`;
    }
    html += `
          </div>
       </div>
    `;
    const my_div = elm.querySelector(".kiv-members");
    if (my_div) {
        my_div.outerHTML = html;
    } else {
        elm.insertAdjacentHTML("beforeend", html);
    }
    const enemies_on_the_wall = document.querySelectorAll("div.members-cont > ul.members-list > li.enemy");
    enemies_on_the_wall.forEach(e => {
        const user_id = get_player_id(e.querySelectorAll("a[class^=user]")[1].href);
        disable_member(user_id);
    });
};

const display_members = (elm, callback) => {
    let faction = {};

    const faction_ids = [...document.querySelector(".raid-title").querySelectorAll("a.t-blue")].map(e => get_faction_id(e.href)).filter(e => e);
    console.log(`[kiv - off the wall] Faction ID = ${faction_ids[1]} vs ${faction_ids[1]}`);
    console.log(`[kiv - off the wall] display hosp = ${get_bool_storage("filter-hosp")} offline = ${get_bool_storage("filter-offline")}`);
    const url = `https://api.torn.com/faction/${faction_ids[1]}?selections=&key=${API_KEY}`;
    GM.xmlHttpRequest({
        method: 'POST',
        url: url,
        onload: function (response) {
            faction = JSON.parse(response.responseText);
            sessionStorage.setItem("faction", response.responseText);

            if (!faction.members) {
                alert(`API error: ${response.responseText}`);
                return;
            }
        }
    }).then(() => {
        members_html(faction, elm);
    }).then(() => {
        callback();
    });
};

const filters = (elm) => {
    console.log(`[kiv - off the wall] Display filters`);
    const html = `<div><span id="kiv-toggle-hosp" class="kiv-toggle">Toggle hosp</span> - <span id="kiv-toggle-offline" class="kiv-toggle">Toggle offliners</span></div>`;
    elm.insertAdjacentHTML("beforeend", html);
    const faction = JSON.parse(sessionStorage.getItem("faction"));

    // toggle hosp
    document.getElementById("kiv-toggle-hosp").addEventListener('click', () => {
        toggle_bool_storage("filter-hosp");
        members_html(faction, elm);
    });

    // toggle offline
    document.getElementById("kiv-toggle-offline").addEventListener('click', () => {
        toggle_bool_storage("filter-offline");
        members_html(faction, elm);
    });
};

const watch = () => {
    console.log("[kiv - off the wall] watch the wall");
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {

            // player jump off the wall
            [...mutation.removedNodes].filter(filter_wall_jumps).forEach(e => {
                const user = e.querySelectorAll("a[class^=user]");
                const faction_id = get_faction_id(user[0].href);
                const player_id = get_player_id(user[1].href);
                console.log(`[kiv - off the wall] Player ${player_id} faction ${faction_id} jumped off the wall`);
                enable_member(player_id);
            });

            // player jump on the wall
            [...mutation.addedNodes].filter(filter_wall_jumps).forEach(e => {
                const user = e.querySelectorAll("a[class^=user]");
                const faction_id = get_faction_id(user[0].href);
                const player_id = get_player_id(user[1].href);
                console.log(`[kiv - off the wall] Player ${player_id} faction ${faction_id} jumped on the wall`);
                disable_member(player_id);
            });
        }
    };

    waitForElement("div.kiv-members").then(() => {
        console.log("[kiv - off the wall] start observing wall");
        const observer = new MutationObserver(callback);
        observer.observe(document.querySelector("div.members-cont > ul.members-list"), { childList: true });
    });
};

const main = (callback) => {

    waitForElement(".faction-war").then((elm) => {

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                [...mutation.addedNodes].forEach(e => {
                    console.log(`[kiv - off the wall] Display members`);
                    display_members(e, () => {
                        filters(e);
                        watch();
                        observer.disconnect();
                    });
                    setInterval(() => display_members(e, () => { }), 10000);
                });
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(elm, { childList: true, subtree: false });

    });
}

(function () {
    main();
})();
