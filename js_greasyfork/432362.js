// ==UserScript==
// @name         Elimination Team Attack Counter [WS]
// @namespace    torn.elim.attack.counter.heasleys.ws
// @version      1.3
// @description  Watch attacks coming in from teams via websockets connection
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/competition.php*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432362/Elimination%20Team%20Attack%20Counter%20%5BWS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/432362/Elimination%20Team%20Attack%20Counter%20%5BWS%5D.meta.js
// ==/UserScript==
var list = {
    set: function(attacker, defender, hits) {
        if (!this[attacker]) {
            this[attacker] = {};
        }
        if (this[attacker][defender]) {
            this[attacker][defender] += hits;
        } else {
            this[attacker][defender] = hits;
        }
        modifyHeader();
    }
};
const start_time = new Date();

var last_time_tick;
var connection_lost_time;
var socket;


(function() {
    //create observer to insert yellow header and start websocket connection
    var observer = new MutationObserver(function(mutations) {
        if (window.location.href == "https://www.torn.com/competition.php") {
            if (!document.contains(document.getElementById('wb_header')) && document.contains(document.querySelector('.top-teams-wrap'))) {
                observer.disconnect();
                insertHeader();
                createWebSocketConnection(); //Initialize connection
            }
        }

    });

    //start observer
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
})();


function createWebSocketConnection() {
    socket = new WebSocket("wss://ws-centrifugo.torn.com/connection/websocket");

    //Create on open listener
    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");

        var params = {
            "params": {"token": getWebSocketToken()},
            "id": 1
        };

        socket.send(JSON.stringify(params));
        console.log("[Sent to server]", params);
    };

    //Create on message listener
    socket.onmessage = function(event) {

        try {
            if (typeof event.data === 'string' || event.data instanceof String) {
                try {
                    const msgs = event.data.split(/\r?\n/);
                    //console.log("SPLITS", msgs);

                    msgs.forEach((m) => {
                        if (!m) return;
                        let data = JSON.parse(m);

                        if (data.id && data.id == 1 && data.result && data.result.version) {
                            let params = {
                                "method":1,
                                "params":{
                                    "channel":"elimination_score_channel"
                                },
                                "id":2
                            }

                            socket.send(JSON.stringify(params));
                            console.log("[Sent to server]", params);
                        }

                        if (data && data.result && data.result.channel && data.result.channel == "elimination_score_channel") {
                            last_time_tick = new Date();
                            parseElimData(data);
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }

                return;
            }


            //console.log(`[message] Data received from server: ${event.data}`);
            let data = JSON.parse(event.data);
            //console.log(data);

            //If recieved message is initial connection for elimination, send back correct params
            if (data.id && data.id == 1 && data.result && data.result.version) {
                let params = {
                    "method":1,
                    "params":{
                        "channel":"elimination_score_channel"
                    },
                    "id":2
                }

                socket.send(JSON.stringify(params));
                console.log("[Sent to server]", params);
            }

            if (data && data.result && data.result.channel && data.result.channel == "elimination_score_channel") {
                last_time_tick = new Date();
                parseElimData(data);
            }
        }
        catch (e) {
            console.log(`[message] Data received from server: ${event.data}`);
            console.log(e)
        }
    };

    //Create on close listener
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died.');


            console.log("Reconnecting...");
            connection_lost_time = new Date();

            let lost_time = Math.abs(connection_lost_time - last_time_tick);

            console.log("Time lost from last tick: "+secondsToText(lost_time/1000));

            createWebSocketConnection(); //Recursive connection
        }
    };

    //Create on error listener
    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };

}

function getWebSocketToken() {
    var websocketConnectionDataElement = document.getElementById('websocketConnectionData');
    var data = JSON.parse(websocketConnectionDataElement.innerText);

    return data.token;
}


function parseElimData(response) {
    if (response.result.data && response.result.data.data && response.result.data.data.message && response.result.data.data.message.action) {
        let action = response.result.data.data.message.action;

        //Attacks
        if (action == "eliminationAttack") {
            if (response.result.data.data.message.data) {
                var attackData = response.result.data.data.message.data;

                let length = attackData.length;

                if (length > 2) {
                    //Hits made changes to team position? Idk

                }

                if (length == 2) { //regular attack
                    let team1 = attackData[0];
                    let team2 = attackData[1];



                    if (team1.diff == 0 && team2.diff == 0) { //Hit made but one team had no score

                        if (team1.score == "0" && team2.score != "0") { //team1 defender, team2 attacker
                            list.set(team2.team,team1.team,1);
                            //console.log(team2.team + " attacked "+team1.team+" but gained no score because "+team1.team+" has "+team1.score+" score.");
                        }

                        if (team2.score == "0" && team1.score != "0") { //team1 attacker, team2 defender
                            list.set(team1.team,team2.team,1);
                            //console.log(team1.team + " attacked "+team2.team+" but gained no score because "+team2.team+" has "+team2.score+" score.");

                        }

                    }

                    if (team1.diff > 0 && team2.diff < 0) { //team1 attacked team2 and gained score
                        list.set(team1.team,team2.team,team1.diff);
                        //console.log(team1.team + " attacked "+team2.team+" and gained "+team1.diff+" score.");
                    }

                    if (team1.diff < 0 && team2.diff > 0) { //team2 attacked team1 and gained score
                        list.set(team2.team,team1.team,team2.diff);
                        //console.log(team2.team + " attacked "+team1.team+" and gained "+team2.diff+" score.");
                    }
                }

                if (length > 2) { //Attack caused change in team order, but should be regular hit. Time to look for attacker team and defender team
                    let defender;
                    let attacker;
                    for (const [key, data] of Object.entries(attackData)) {
                        if (data.diff < 0) {
                            defender = attackData[key];
                        }
                        if (data.diff > 0) {
                            attacker = attackData[key];
                        }
                    }
                    if (defender && attacker) {
                        list.set(attacker.team,defender.team,attacker.diff);
                    } else {
                        console.log("Didn't set attacker and defender");
                    }
                }


            }
        }// eliminationAttack

        //Life Change or Eliminated (maybe more)
        if (action == "eliminationCron") {
            console.log("EliminationCron:", response.result.data.data.message);

            if (response.result.data.data.message.data) {
                var scoreData = response.result.data.data.message.data;
                let length = scoreData.length;

                let defender;
                let attacker;

                for (const [key, data] of Object.entries(scoreData)) {
                    if (data.status == "before-eliminated") {
                        console.log("[Elimination] "+data.team+" has lost a life! Lives left: "+data.lives);
                    }
                    if (data.eliminated == true) {
                        console.log("[Elimination] "+data.team+" has been eliminated!");
                    }

                    //Sometimes attack data sneaks in with the cron, check for it
                    if (data.diff < 0) {
                        defender = scoreData[key];
                    }
                    if (data.diff > 0) {
                        attacker = scoreData[key];
                    }
                    if (defender && attacker) {
                        list.set(attacker.team,defender.team,attacker.diff);
                    }
                }
            }
        }

        //Something else
        if (action != "eliminationAttack" && action != "eliminationCron") {
            console.log("Some other elimination score_channel message:", response.result.data.data.message);
        }
    }

}


function modifyHeader() {
    //empty old table
    $('#wb_header div#elim-data').empty();

    //get milliseconds from start time til now
    var diff = Math.abs(new Date() - start_time);


    $('#elim_time_since').text(secondsToText(diff/1000)); //put timer in header to keep track of time passed

    //loop through saved list of hits and create tables for each team.
    for (const [team, teamsHit] of Object.entries(list)) {
        if (team == "set") {
            continue;
        }
        var totalHits = 0;

        let tablehtml = `<div>
    <table class="wb_table" id="`+team+`_table">
    <caption>`+team+`</caption>
    <tr>
    <th>Targeted Team</th>
    <th>Hits</th>
    </tr>
    `;

        var sortable = [];
        for (var teamDef in teamsHit) {
            sortable.push([teamDef, teamsHit[teamDef]]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });

        var objSorted = {}
        sortable.forEach(function(item){
            objSorted[item[0]]=item[1]
        });


        for (const [teamHit, hits] of Object.entries(objSorted)) {
            tablehtml += `<tr><td>` + teamHit + `</td><td class="num">`+hits+`</td></tr>`;
            totalHits += hits;
        };

        tablehtml += `<tr>
        <td align="center" colspan="2">Total Hits:`+totalHits+`</td>
    </tr>`;

        tablehtml += `</table></div>`;

        $('#wb_header div#elim-data').append(tablehtml);
    };
}


//Function for inserting yellow header
function insertHeader() {
    document.querySelector('.top-teams-wrap').insertAdjacentHTML('beforebegin', `
<hr class="delimiter-999 m-top10">
<div class="wb_container" id="wb_header">
<div class="wb_head">
<span class="wb_title">Elimination</span>
<span class="wb_icon right" id="wb_svg_right"><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_down" hidden><svg class="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row"><p class="wb_title">Hits by Team since <span id="elim_time"></span> <br><span id="elim_time_since"></span></p></div>
<div class="wb_row">
<div id="elim-data"><p>If you are seeing this, elim data hasn't loaded. You may need to refresh.</p></div>
</div>
</div>
</div>
`);

    $(".wb_head").click(function() {
        $(this).toggleClass("expanded");
        $(".wb_content").slideToggle("fast");

        if (!$("#wb_svg_right").is(':visible')) {
            $("#wb_svg_right").attr("hidden",false);
            $("#wb_svg_down").attr("hidden",true);
        } else {
            $("#wb_svg_right").attr("hidden",true);
            $("#wb_svg_down").attr("hidden",false);
        }
    });


    const now = new Date();

    $('#elim_time').text(now.toUTCString());
}

//Little hack for adding CSS, usual GM_addStyle breaks websocket connection
if (typeof GM_addStyle === 'undefined')
    GM_addStyle = function(css) {
        var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
        if (!head) {return}
        style.type = 'text/css';
        try {style.innerHTML = css}
        catch(x) {style.innerText = css}
        head.appendChild(style);
    };

GM_addStyle(`
div.wb_container {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}
div.wb_head {
    border-bottom: none;
    border-radius: 5px 5px 5px 5px;
    box-shadow: rgba(0, 0, 0, 0.25) 0 1px 3px;
    padding: 6px 10px;
    background-color: #cab900;
    background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0);
    background-size: 4px;
    cursor: pointer;
}
div.wb_head.expanded {
    border-bottom: none;
    border-radius: 5px 5px 0 0;
}
span.wb_title {
    color: #fff;
    font-size: 13px;
    letter-spacing: 1px;
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
    font-weight: 700;
    line-height: 16px;
}
span.wb_success {
color: #478807;
text-shadow: none;
font-weight: 800;
}
.wb_content {
    background-color: #f2f2f2;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 0 0 5px 5px;
    border-top: none;
}
.wb_row {
    display: flex;
    margin: 0.75em;
    justify-content: space-evenly;
}
.wb_col {
    margin-left: 20px;
    margin-right: 20px;
}
.wb_col > p {
    font-weight: 700;
    font-size: 16px;
    border-bottom: 1px solid #363636;
    margin-bottom: 3px;
    padding-bottom: 2px;
}
.wb_col input {
    vertical-align: middle;
}
.wb_button {
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
    cursor: pointer;
    font-weight: 400;
    text-transform: none;
    position: relative;
    text-align: center;
    line-height: 1.2;
    color: #fff;
    margin-left: 0.5em;
    -webkit-appearance: none;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: rgba(255, 255, 255, 0.5) 0 1px 1px 0 inset, rgba(0, 0, 0, 0.25) 0 1px 1px 1px;
    padding: 2px 10px;
    border-radius: 4px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    text-decoration: none;
}
.float-right {
    float: right;
}
span.wb_icon {
align-items: center;
justify-content: center;
width: 16px;
}
span.wb_icon.right {
float: right;
}
span.wb_icon.left {
float: left;
}
span.wb_icon svg {
display: block;
height: 16px;
cursor: pointer;
margin-left: auto;
margin-right: auto;
}
span.wb_icon svg.white {
fill: white;
}
span.wb_icon svg.black {
fill: black;
}
.wb_input {
    width: 118px;
    height: 23px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 0 4px 0 10px;
}
.d .f-war-list.war-new .row-animation.to-right {
    -webkit-animation: none !important;
    animation: none !important;
}
.d .f-war-list.war-new .row-animation.to-left {
    -webkit-animation: none !important;
    animation: none !important;
}
.d .f-war-list.war-new .row-animation {
    background-image: none !important;
    background-position: 0 0 !important;
    background-repeat: no-repeat !important;
}

.wb-war-span {
    padding-left: 11px;
    padding-right: 5px;
    color: #888;
}

.wb-war-info {
    color: black;
}

#elim-data {
display: flex;
flex-flow: row wrap;
justify-content: space-between;
}

table.wb_table caption {
text-align: center;
font-size: 16px;
font-weight: bold;
text-transform: uppercase;
}

#elim-data > div {
flex: 1 1 0px;
margin-bottom: 30px;
margin-right: 5px;
}

table.wb_table {
 width: 200px;
}

table.wb_table td {
  border: 1px solid black !important;
  padding: 2px !important;
}

table.wb_table th {
font-weight: bold;
border: 1px solid black;
border-bottom: 2px solid black;
text-align: center;
}

td.num {
text-align: right;
}

p.wb_title {
text-align: center;
font-size: 16px;
font-weight: bold;
}
`);

//Function for formatting seconds to readable texts
function secondsToText(seconds) {
    let time = "";
    let numdays = Math.floor((seconds % 31536000) / 86400);
    let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    let numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    if (numdays > 0) {time+=numdays + " days "; numseconds = 0;}
    if (numhours > 0) {time+=numhours + " hours "}
    if (numminutes > 0) {time+=numminutes + " minutes "}
    if (numseconds > 0) {time+=numseconds + " seconds"}

    return time;
}