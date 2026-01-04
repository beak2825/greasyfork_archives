// ==UserScript==
// @name         Poker Nilfgard 2
// @namespace    pokernilfgard.zero.torn
// @version      0.2
// @description  fixed
// @author       -zero [2669774]
// @match        https://www.torn.com/loader.php?sid=holdem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473454/Poker%20Nilfgard%202.user.js
// @updateURL https://update.greasyfork.org/scripts/473454/Poker%20Nilfgard%202.meta.js
// ==/UserScript==

GM_addStyle(`
.zindicator {
width: 10px;
height: 10px;
border-radius: 50%;

}

`);

let api = '';
let time = 330;
let updateFreq = 30000;


let rfcv = getRFC();

const wsURL = 'wss://ws-centrifugo.torn.com/connection/websocket';
var socket;

var currentState = {};
var checkList = {};
var checkbox;
var name;
var id;
var dat;
var checkboxes;
var tname;
var tid;
var tdata;
var money = {};

var count = 1;

var tables = {
    "Ballsy": 9,
    "Pound It": 10,
    "Cat's Chance": 25,
    "Gatling Gun": 6,
    "Periodic": 23,
    "Fourplay": 17,
    "Newbie Corner": 2,
    "Hobo Holdem": 3,
    "Broke Jokes": 26,
    "8-bit": 4,
    "Sprinkles": 5,
    "E-asy Street": 24,
    "Quickdraw": 7,
    "Tight Knit": 8,
    "Six of the Best": 27,
    "Boom or Bust": 20,
    "Old 'n Slow": 11,
    "Duel at Dawn": 18,
    "Old Folks Home": 21,
    "River Wizard": 28,
    "Comatose Cove": 22,
    "Tripod": 12,
    "Juan on Juan": 19,
    "Slow Cooker": 13,
    "High Rollers": 15,
    "Fire Pit": 14,
    "Oligarch": 16
};

function connect() {
    count = 1;
    socket = new WebSocket(wsURL);

    socket.onopen = function (e) {
        console.log("[open] Connection established Poker Stalker");
        sendData();
        $('#indicator-zero').css("background-color", "green");

    };

    socket, onerror = function (e) {
        console.log(e);
    }

    // container
    //  -indicator (idle, green, offline)
    //  - indicator (hospital/okay)
    //  - timer

    socket.onmessage = function (e) {
        //console.log("Message Received: " + e.data);
        let response = JSON.parse(e.data);

        try {
            if (response.result.data.data.message.gameStatus) {
                let status = response.result.data.data.message.gameStatus;
                //console.log("Status " + status);

                if (status == "ended") {
                    for (let player in response.result.data.data.message.players) {
                        let playerId = response.result.data.data.message.players[player].userID;
                        let state = response.result.data.data.message.players[player].status;
                      // console.log("State: "+state);

                        if (state.includes("Sitting out")) {
                            console.log("Sitting out!");
                            
                            let cseconds = $(`.timerzero-${playerId}`).attr("seconds");
                            if (cseconds == "-69"){
                                $(`.timerzero-${playerId}`).attr("seconds", time);
                            }
                        }
                        else {
                            $(`.timerzero-${playerId}`).attr("seconds", "-69");
                            $(`.timerzero-${playerId}`).html("");
                        }

                    }
                }

            }
        }
        catch (e) {
            console.log(e);
        }
    }

    socket.onclose = function (e) {
        console.log("CONNECTION CLOSED!");
        $('#indicator-zero').css("background-color", "red");
        setTimeout(connect, 1000);
    };

}


function sendData() {
    if ($("div[title^='Poker']").length == 0) {
        sendData();
        return;
    }
    let chatTitle = $("div[title^='Poker']").attr('title').split("new messages")[0].split("Poker")[1].trim();
    let roomId;
    if (tables[chatTitle]) {
        roomId = tables[chatTitle];
    }
    else {
        return;
    }
    let data = JSON.parse($('#websocketConnectionData').text());
    const token = data.token;
    const userId = data.userId;

    const msg = `{"params":{"token":"${token}"},"id":${count}}`;
    socket.send(msg);
    count++;

    let msg1 = `{"method":1,"params":{"channel":"holdem${roomId}"},"id":${count}}`;
    count++;
    let msg2 = `{"method":1,"params":{"channel":"holdem${roomId}#2669774"},"id":${count}}`;
    count++;
    let msg3 = `{"method":1,"params":{"channel":"holdemlobby"},"id":${count}}`;

    socket.send(msg1);
    socket.send(msg2);
    socket.send(msg3);

}

function getRFC() {
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}




function convert(t) {
    let m = parseInt(Math.floor(t / 60));
    let s = parseInt(t % 60);

    if (s < 10) {
        s = "0" + s;
    }

    if (m < 10) {
        m = "0" + m;
    }

    return `${m}:${s}`;
}

function getTime(t) {
    let hour = Math.floor(t / (60 * 60)) % 25;
    t %= 3600;
    let minutes = Math.floor(t / 60);
    t %= 60;

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (t < 10) {
        t = "0" + t;
    }

    return `${hour}:${minutes}:${t}`;
}
function insert() {
    $("div[class^='players__'] > div").each(function () {

        let pdata = $("div[class^='opponent']", $(this));
        if ($(pdata).length == 0){
            return;
        }
        let player = $(pdata).attr('id').split('-')[1];
        let playerName = $('p[class^="name__"]', $(this)).text();
        $('p[class^="name__"]', $(this)).html((`<a style="text-decoration: none;" href="https://www.torn.com/profiles.php?XID=${player}">${playerName}</a>`));

        if ($(`#zcontainer-${player}`).length > 0) {
            return;
        }
        let container = `<div id="zcontainer-${player}">
        <span class="timerzero-${player}" seconds="-69"></span></br>
        <div style="display:flex;">
        <div id="online-${player}" class="zindicator" title=""></div>  &nbsp;
        <div id="hosp-${player}" class="zindicator" title=""></div>
        </div>
        </div>`;

        // let now = new Date();
        // let secs = now.getUTCHours() * 60 * 60 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
        // secs += time;
        // let timeout = getTime(secs);

        $("div[class^='detailsBox__']", $(this)).append(container);
    });
}

function updateTime() {
    $('span[class^="timerzero-"]').each(function () {
        let seconds = $(this).attr('seconds');
       // console.log(seconds);
        if (seconds == '-69') {
            return;
        }

        seconds--;
        let t;
        if (seconds <= 0){
            seconds = 0;
           t = "NOW";
        }
        else{
            t = getTime(seconds);
        }
        
        $(this).attr("seconds", seconds);
        $(this).html(t);

    });
}

function updateData() {
    $('div[id^="zcontainer-"]').each(async function () {
        let id = $(this).attr('id').split('-')[1];
        let adata = await $.getJSON(`https://api.torn.com/user/${id}?selections=&key=${api}`);
        let state = adata.last_action.status;
        let laction = adata.last_action.relative;
        $(`#online-${id}`).attr("title", laction);
      //  console.log(state + " "+id + " "+laction) ;

        if (state == "Online") {
         //   console.log("state offline");
            $(`#online-${id}`).css("background-color", "green");
        }
        if (state == "Offline") {
         //   console.log("state online");
            $(`#online-${id}`).css("background-color", "black");
        }
        if (state == "Idle") {
         //   console.log("state idle");
            $(`#online-${id}`).css("background-color", "orange");

        }

        let hosp = adata.status.color;
        $(`#hosp-${id}`).css("background-color", hosp);

    });

    setTimeout(updateData, updateFreq);
}



function main() {
    if ($("div[class^='players__'] > div").length == 0){
        setTimeout(main, 300);
        return;
    }
    insert();
    setInterval(insert, 5000);
    setInterval(updateTime, 1000);
    updateData();

}
connect();
main();



