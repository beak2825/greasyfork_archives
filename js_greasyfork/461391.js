// ==UserScript==
// @name         TGA - Watchout
// @namespace    kivou-tga
// @version      1.1.6
// @grant        GM_addStyle
// @description  Watchout player joining attacks
// @author       Kivou [2000607]
// @grant        GM.xmlHttpRequest
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/461391/TGA%20-%20Watchout.user.js
// @updateURL https://update.greasyfork.org/scripts/461391/TGA%20-%20Watchout.meta.js
// ==/UserScript==

// Copyright © 2023 Kivou [2000607] <contact@bpnrzhk.xyz>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

// ENTER YOUR (PUBLIC) API KEY HERE
// https://www.torn.com/preferences.php#tab=api
const API_KEY = "";

// discord & websocket server
const DISCORD_SERVER = "1033832974979956799";
const API_URL = "https://bpnrzhk.xyz/apiflkmizbkdzmwp";
const WS_LOCAL_PORT = "8642";

// defender: player who is attacked (#defender)
// attacker: player who attacks (#attacker)
// player: player running the script (chat session)
// assister: player joining the attack (mutation observer)

function get_defender_id() {
    const urlParams = new URLSearchParams(window.location.search);
    const target_id = urlParams.get("user2ID");
    if(!target_id){
        console.log(`[kiv assists script - get defender id] Coulnd'n parse defender ID (${target_id})`);
    }
    return target_id;
}


function get_fighter_name(who) {
    // who: defender or attacker
    return document.getElementById(who).getElementsByTagName("div")[0].getElementsByTagName("div")[0].getElementsByTagName("span")[0].textContent;
}

function get_player_from_chat() {
    const player_from_chat = JSON.parse(document.getElementById("websocketConnectionData").innerHTML);
    return [player_from_chat.userID, player_from_chat.playername];
}

function filter_pure_text(elm) {
    return elm.hasChildNodes();
}

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

const watch = () => {

    const send_call = (assister_name) => {

        const player = get_player_from_chat();
        let data = {
            type: "watchout",
            server: DISCORD_SERVER,
            player_id: player[0],
            player_name: player[1],
            defender_id: get_defender_id(),
            defender_name: get_fighter_name("defender"),
            api_key: API_KEY
        };
        data.assister_name = assister_name;

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
                    console.log(`[kiv watchout - call] payload - ${k}: ${data[k]}`);
                }
                if (response.status == '200') {
                    console.log(`[kiv watchout - call] Successful call`);
                } else if (response.status == '300') {
                    alert(`TGA - watchout: ${JSON.parse(response.responseText).message}.`);
                } else if (response.status == '400') {
                    console.log(`[kiv watchout - call] User error ${JSON.parse(response.responseText).error.error}`);
                } else {
                    console.log(`[kiv watchout - call] Server error ${JSON.parse(response.responseText).error.error}`);
                }
            },
            onerror: function (error) {
                console.log(`[kiv watchout - call] Unknwon error ${error}`);
            }
        });
    };

    const callback_participants = (mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(addedNode => {
                    let assister_name = addedNode.querySelector("[class^=playername___]").textContent;
                    console.log(`[kiv watchout - participants] Send call for new assister: ${assister_name}`);
                    send_call(assister_name);
                });
            }
        }
    };

    const callback_logs = (mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type === "childList") {
                Array.from(mutation.addedNodes).filter(filter_pure_text).forEach(addedNode => {
                    let has_join_icon = addedNode.querySelector(".attacking-events-attack-join");
                    let is_join_icon = addedNode.classList.contains("attacking-events-attack-join");
                    let join_icon = null;
                    if(has_join_icon) {
                        console.log(`[kiv watchout - logs] New node containing .attacking-events-attack-join`);
                        join_icon = has_join_icon;
                    } else if (is_join_icon) {
                        // pretty sure this is not needed
                        console.log(`[kiv watchout - logs] New node being .attacking-events-attack-join`);
                        join_icon = is_join_icon;
                    } else {
                        console.log(`[kiv watchout - logs] New node ignored`);
                        return;
                    }
                    let assister_name = join_icon.parentElement.nextElementSibling.childNodes[0].textContent.split(" ")[0];
                    console.log(`[kiv watchout - logs] Send call for new assister: ${assister_name}`);
                    send_call(assister_name);
                });
            }
        }
    };

    waitForElement(`#stats-header`).then((elm) => {

        if(!API_KEY) {
            alert("TGA - Watchout: enter your API key (line 21) or disable this script");
        }

        // look at participants: watcher
        const targetNodeParticipants = document.querySelector("[class^=participants___]");
        const observerParticipants = new MutationObserver(callback_participants);
        //observerParticipants.observe(targetNodeParticipants, { childList: true, subtree: false });
        //console.log(`[kiv watchout] start observing participants (${observerParticipants})`)

        // look at logs: attacker
        // good strategy: observe addNodes in ul childList (ie li > span) for .attacking-events-attack-join
        // bad strategy: observer for first line (li) for charcterData mutation (because the node moves down)
        const targetNodeLogs = document.querySelector("ul[class^=list___]");
        const observerLogs = new MutationObserver(callback_logs);
        observerLogs.observe(targetNodeLogs, { childList: true, subtree: true });
        console.log(`[kiv watchout] start observing logs (${targetNodeLogs})`);

        const html = `<div style="margin: 5px; color: orange; font-weight: bold; cursor: pointer;">[TGA - Watchout] Watching your attack logs</div>`;
        waitForElement("#react-root").then((elm) => {
            elm.insertAdjacentHTML('beforebegin', html);
        });
    });
}

// main
(function() {
    watch();
})();
