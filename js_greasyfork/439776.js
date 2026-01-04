// ==UserScript==
// @name         JFK - Assists
// @namespace    kivou-jfk
// @version      1.3
// @grant        GM_addStyle
// @description  Sends assist calls to the JFK discord server
// @author       Kivou [2000607]
// @grant        GM.xmlHttpRequest
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/439776/JFK%20-%20Assists.user.js
// @updateURL https://update.greasyfork.org/scripts/439776/JFK%20-%20Assists.meta.js
// ==/UserScript==

// Copyright © 2022 Kivou [2000607] <kivou@yata.yt>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

// discord & websocket server
const DISCORD_SERVER_ID = "356137641814786052"
const WEBSOCKET_URL = "https://torn.yata.yt/apiflkmizbkdzmwp"
const LOCAL_PORT = "8762"

// factions
const FACTIONS = ["jfk main", "jfk 2.1"]

// ratelimit
const RATELIMIT = 15

// css light vs dark mode
let bgcolor_a = '#fff'
let bgcolor_b = '#ccc'
let ftcolor_a = '#555'
let ftcolor_b = '#000'
if($("#dark-mode-state")[0].checked) {
    console.log('[jfk assists script] dark mode')
    ftcolor_a = '#eee'
    ftcolor_b = '#999'
    bgcolor_a = '#555'
    bgcolor_b = '#333'
}

// css mode
const cssTxt = `
    div.jfk-assist {
      color: ${ftcolor_a};
      height: 25px;
      background: ${bgcolor_b};
      border: 1px solid ${ftcolor_b};
      border-radius: 4px;
      padding: 8px;
      font-size: 16px;
    }

    div.jfk-assist > select {
      background: ${bgcolor_b};
      border-color: #0000;
      color: ${ftcolor_a};
      cursor: pointer;
    }

    span.jfk-call {
      color: ${ftcolor_a};
      background: linear-gradient(180deg, ${bgcolor_a}, ${bgcolor_b});
      border: 1px solid ${ftcolor_b};
      padding: 4px;
      margin-left: 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    span.jfk-call:hover {
      color: ${ftcolor_b};
    }

    span.jfk-call:active {
      color: ${ftcolor_a};
      -moz-box-shadow: inset 0 0 2px ${ftcolor_a};
      -webkit-box-shadow: inset 0 0 2px ${ftcolor_a};
      box-shadow: 0 0 2px ${ftcolor_a};
    }

    span.jfk-result {
      padding: 4px;
      border-radius: 4px;
      float: right;
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
    `;
GM_addStyle (cssTxt);

// helper to display result message
const change_message = (txt, type)=>{
    $("#jfk-result").removeClass("valid error warning").addClass(type);
    $("#jfk-result").html(txt);
}

// main
(function() {
    'use strict';
    let html = `
        <div id="jfk-assist" class="jfk-assist m-bottom10">
            JFK\'s discord assist for
            <select id="jfk-number">
                <option value="1">1</option>
                <option value="2" selected="selected">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
            <select id="jfk-faction">
    `;
    for(let i in FACTIONS){
        html += `<option value="${FACTIONS[i]}">${FACTIONS[i]}</option>`
    }
    html += `
            </select>
            member<span id="jfk-member-plural">s</span>
            <span id="jfk-call" class="jfk-call">CALL</span>
            <span id="jfk-result" class="jfk-result"></span>
            <div class="clear"></div>
        </div>
    `;

    // display html
    $("#react-root").before(html)

    // listener for member plural
    document.querySelector('#jfk-number').addEventListener("change", function() {
        if (this.value == "1") {
            $("#jfk-member-plural").html("")
        }else{
            $("#jfk-member-plural").html("s")
        }
    });

    // last call timestamp (to avoid spamming)
    let last_call = 0

    // on click listener
    $("#jfk-call").on('click', e => {
        const dt = parseInt(Date.now() / 1000) - last_call;
        if(dt < RATELIMIT){
            // ratelimit
            console.log(`[jfk assists script] Delay between calls: ${dt}s`)
            change_message(`Ratelimit of 1 call per ${RATELIMIT}s. Try again in ${RATELIMIT - dt}s if needed.`, "warning");
        } else {
            console.log(`[jfk assists script] Delay between calls: ${dt}s`)
            change_message('<img src="https://yata.yt/media/misc/crimes2.gif" />')

            // data to be sent
            let data = Object()
            data.type = "assists"
            data.port = LOCAL_PORT
            data.server = DISCORD_SERVER_ID
            data.faction = $('#jfk-faction')[0].value
            data.number = $('#jfk-number')[0].value

            // get player ID/name
            const player_from_chat = JSON.parse($("#websocketConnectionData").html())
            data.player_id = player_from_chat.userID
            data.player_name = player_from_chat.playername

            // get target ID/name
            const urlParams = new URLSearchParams(window.location.search);
            data.target_id = urlParams.get("user2ID");
            data.target_name = $("#defender").children("div").children("div").children("span").text()

            if(data.target_id==null){
                change_message("Couldn't parse target ID", "error");

            } else {


                GM.xmlHttpRequest({
                    method: 'POST',
                    url: WEBSOCKET_URL,
                    data: JSON.stringify(data),
                    headers:    {
                        "Content-Type": "application/json",
                        "Diderot-Relay-Port": LOCAL_PORT
                    },
                    onload: function (response) {
                        console.log('[nub assists script] ws connection openned')
                        for(let k in data){
                            console.log(`[nub assists script] sends: ${k}: ${data[k]}`)
                        }
                        if (response.status == '200') {
                            change_message(`Call sent for <b>${data.number} ${data.faction}</b> against <b>${data.target_name} [${data.target_id}]</b>.`, "valid");
                        } else if (response.status == '400') {
                            change_message(`User error: ${JSON.parse(response.responseText).error.error}`, "error")
                        } else {
                            change_message(`Server error: ${JSON.parse(response.responseText).error.error}`, "error")
                        }
                    },
                    onerror: function (error) {
                        change_message("Unkown error.", "error");
                    }
                })
                last_call = parseInt(Date.now() / 1000)
            }
        }
    });
})();

