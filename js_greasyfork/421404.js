// ==UserScript==
// @name         [hwm]_calculate_defenses
// @namespace    Clan page
// @version      0.3
// @description  Counts total defenses done by members during specified time period.
// @author       Hapkoman
// @include      https://www.lordswm.com/clan_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421404/%5Bhwm%5D_calculate_defenses.user.js
// @updateURL https://update.greasyfork.org/scripts/421404/%5Bhwm%5D_calculate_defenses.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = new URL(window.location.href);
    var clan_id = url.searchParams.get("id");
    var tempDate = new Date();
    //var startDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0,0);
    //var endDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 23, 59, 59);
    var startDate = new Date(2021, 1, 3, 0,0,0);
    var endDate = new Date(2021, 1, 6, 23, 59, 59);
    var previousPage = -1;
    var page = 0;

    var defenseKeys = []; //used to store all the keys of the defenses to go through
    var players = {}; //stores player data

    var stop_run = false;
    var running = false;
    console.log("RUNNING");
    //main interface
    document.body.innerHTML = "<div max-he>"
    + "<br><div><span>Scanned pages:</span><span id='scan_defense_pages_scanned'>0</span></div>"
    +"<br><label for='scan_defense_start_date'>Start Date: </label>"
    +"<input id='scan_defense_start_date' name='scan_defense_start_date' type='date' value='" + Date.now() + "'>"
    +"<br><label for='scan_defense_end_date'>End Date: </label>"
    +"<input id='scan_defense_end_date' name='scan_defense_end_date' type='date' value='" + Date.now() + "'>"
    + "<br><button id='scan_defense_button'>CLICK TO SCAN</button>"
    + "<br><button id='scan_defense_button_stop'>CLICK TO STOP SCAN</button>"
    + "<div style='max-height: 250px; overflow: auto;'><table class='wb' cellpadding='3' align='center' style='background-color: wheat' id='scan_defense_log'>"
    + "<tr><th>Player</th><th>Total Defenses</th><th>Total Defenses won</th><th>Total Solo Count</th><th>Total Solo Won</th><th>Total %lost</th><th>PvE Count (solo incl.)</th><th>PvE Won (solo incl.)</th><th>Solo PvE count</th><th>Solo PvE won</th><th>PvE %lost</th><th>PvP Count (solo incl.)</th><th>PvP Won</th><th>Solo PvP (solo incl.)count</th><th>Solo PvP won</th><th>PvP %lost</th></tr>"
    + "</table></div>"
    +"</div>" + document.body.innerHTML;

    //listeners
    //start scanning and stop scanning listeners
    document.getElementById("scan_defense_button").onclick = function(){doScan();};
    document.getElementById("scan_defense_button_stop").onclick = function(){stopScan();};

    //defense date update listeners
    document.getElementById("scan_defense_start_date").onchange = function(e){
        if (!running){
            startDate = new Date(e.target.value);
        }
    };
    document.getElementById("scan_defense_end_date").onchange = function(e){
        if (!running){
            endDate = new Date(e.target.value);
        }
    };

    //functions to stop scans and start scans
    function stopScan(){
        console.log(players);
        stop_run = true;
        running = false;
        fillTable();
        document.getElementById("scan_defense_button").disabled = false;
        console.log("STOPPING SCAN");
    }
    function doScan(){
        //depo_log_element.innerHTML = "";
        stop_run = false;
        running = true;
        players = {};
        defenseKeys = [];
        page = 0;
        previousPage = -1;
        console.log("SCANNING");
        document.getElementById("scan_defense_button").disabled = true;
        getPage("https://www.lordswm.com/clan_log.php?id=" + clan_id + "&page=" + page, analyzeLog);
    }


    function getPage(link, func){
        var clan_log = link;
        var request = new XMLHttpRequest();
        request.open("GET", clan_log, true);
        request.send();
        request.onreadystatechange = function() {
            if (request.readyState === 4){
                if (request.status === 200){
                    var responseText = request.responseText;
                    var logDoc = document.createElement('html');
                    logDoc.innerHTML = responseText;
                    func(logDoc);
                }
            }
        }
    }

    function analyzeLog(logDoc){
        var players = {};
        //var tables = logDoc.getElementsByTagName("table");
        var logTable;
        var logLines = [];
        //Get element that contains all log lines, in this case there are 2 elements with that class name just gotta choose 2nd as first is the log title
        let linesOriginalEle = logDoc.getElementsByClassName("global_a_hover")[1];
        //Get individual lines from the original element as they are not divided by divs or anything but just <br>
        logLines = linesOriginalEle.innerHTML.split("<br>");

//         for (var i = 1; i < tables.length; i++){ //find all log lines
//             var table = tables[i];
//             if (table.innerHTML.indexOf('Log of clan  <a style="text-decoration:none;" href="clan_info.php?id=' + clan_id + '">#' + clan_id + '</a>') > -1){ //found table where log is contained
//                 logLines = table.children[0].children[0].children[0].innerHTML.split("<br>");
//                 break;
//             }
//         }

        //get navigation element and see if previous page is at end of clan log
        let navEle = logDoc.getElementsByClassName("hwm_pagination")[0];
        let currentPage = parseInt(Array.from(navEle.children).find((linkEle) => linkEle.classList.contains("active") ).innerHTML);

//         //get previous page to see if at end of clan log.
//         let pageLine = logLines[2];
//         let tempElem = document.createElement("html");
//         let currentPage;
//         tempElem.innerHTML = pageLine;
//         pageLine = tempElem.getElementsByTagName('center')[0];
//         for (let i = 0; i < pageLine.children.length; i++){
//             if (pageLine.children[i].tagName == "B"){
//                 currentPage = parseInt(pageLine.children[i].children[0].innerHTML) - 1;
//                 break;
//             }
//         }

        if (currentPage == previousPage){
            stopScan();
        } else {
            document.getElementById("scan_defense_pages_scanned").innerHTML = page;
            previousPage = currentPage;
            defenseKeys = [];
            for (let i = 0; i < logLines.length; i++){
                let logLine = logLines[i].replaceAll(/&nbsp;|\\n/gi, "").trim();
                //check time then if defence
                //var dateText = (logLine.split(": Subdistrict")[0]).replaceAll(/&nbsp;|\\n/gi, "").trim(); //get time from line
                let dateText = logLine.substring(0,16);
                let date = new Date(dateText.substring(0, 4), parseInt(dateText.substring(5, 7))-1, dateText.substring(8,10));
                if (date < startDate){
                    //stop processing cause passed time window.
                    defenseKeys.push("END");
                    break;
                }
                else if (date >= startDate && date <= endDate && logLine.indexOf(" attacked by Survilurgs: lost for") > -1){
                    //get the log of the defense
                    let indexOfLogKey = logLine.indexOf("clan_mwlog.php?key=") + "clan_mwlog.php?key=".length;
                    let defenseKey = logLine.substring(indexOfLogKey, indexOfLogKey+logLine.substring(indexOfLogKey).indexOf("&"));
                    defenseKeys.push(defenseKey);
                }
            }
            nextDefenseLog();
        }
    }

    function nextDefenseLog(){
        if (stop_run){
            //stop search
            stopScan();
        }
        else if (defenseKeys.length <= 0){ //all defenses on this page checked and date still ok
            page++;
            getPage("https://www.lordswm.com/clan_log.php?id=" + clan_id + "&page=" + page, analyzeLog);
        }
        else if (defenseKeys[0] != "END"){ //still defenses left to check
            var defenseKey = defenseKeys[0];
            defenseKeys.shift();
            setTimeout(function(){
                getPage("https://www.lordswm.com/clan_mwlog.php?key=" + defenseKey + "&clan_id=" + clan_id, analyzeDefense);
            }, 300);
        } else{ //no more defenses left and date might have passed
            stopScan();
        }
    }

    function analyzeDefense(defLog){
        var tables = defLog.getElementsByTagName("tbody");
        var defenseLines = [];
        for (var i = 0; i < tables.length; i++){ //find all log lines
            var table = tables[i];
            if (table.children[0].children[0].innerHTML == '<font style="font-size:9px;">1)&nbsp;</font>'){
                defenseLines = table.children;
                break;
            }
        }
        for (i = 0; i < defenseLines.length; i++){
            var defenseLine = defenseLines[i];
            //was the defense a pvp?
            var isPvp = defenseLine.children[1].children[0].tagName == 'A';
            //did defenders win? 1 or 0
            var isDefenderWin = defenseLine.children[1].children[0].tagName == 'FONT' ? 1 : 0;
            if (isPvp){
                isDefenderWin = defenseLine.children[1].children[2].tagName == 'B' ? 0 : 1;
            }
            //if loss, what %
            var percentLoss = 0;
            if (isDefenderWin == 0){
                percentLoss = parseInt(defenseLine.children[4].children[0].children[0].innerHTML.split("%")[0]);
            }
            //who defended
            var defenders = [];
            //if empty and not defended
            if (defenseLine.children[3].children[2].tagName == "FONT"){
            } else{
                var aTags = defenseLine.children[3].getElementsByTagName("a");
                var isSoloDefense = aTags.length <= 2;
                for (var j = 1; j < aTags.length; j++){
                    var player_id = aTags[j].href.split("pl_info.php?id=")[1];
                    if (!players[player_id]){ //player not yet added
                        players[player_id] = {
                            "player_name":aTags[j].children[0].innerHTML,
                            "defense_count": 0, "pve_count":0, "solo_pve_count": 0, "solo_pve_won":0, "pve_won":0,
                            "defenses_won": 0, "solo_defense_count":0, "solo_defenses_won": 0,
                            "pvp_count":0, "pvp_won":0, "solo_pvp_count":0, "solo_pvp_won":0,
                            "percent_lost": 0, "pve_percent_lost":0, "pvp_percent_lost":0
                        };
                    }
                    players[player_id].defense_count++;
                    players[player_id].defenses_won += isDefenderWin;
                    players[player_id].solo_defense_count += isSoloDefense;
                    players[player_id].solo_defenses_won += isSoloDefense == 1 ? isDefenderWin : 0;
                    players[player_id].percent_lost += percentLoss;
                    if (isPvp){
                        players[player_id].pvp_count++;
                        players[player_id].pvp_won += isDefenderWin;
                        players[player_id].solo_pvp_count+= isSoloDefense;
                        players[player_id].solo_pve_won+= isSoloDefense == 1 ? isDefenderWin : 0;
                        players[player_id].pvp_percent_lost += percentLoss;
                    } else {
                        players[player_id].pve_count++;
                        players[player_id].pve_won+= isDefenderWin;
                        players[player_id].solo_pve_count+= isSoloDefense;
                        players[player_id].solo_pve_won+= isSoloDefense == 1 ? isDefenderWin : 0;
                        players[player_id].pve_percent_lost += percentLoss;
                    }
                }
            }
        }
        //get next log
        //stopScan();
        nextDefenseLog();
    }

    function fillTable(){
        let table = document.getElementById("scan_defense_log");
        let tbody = table.children[0];
        //clear table
        tbody.innerHTML = table.rows[0].innerHTML;

        //add rows
        Object.keys(players).forEach(function(pid){
            tbody.innerHTML += "<tr style='text-align:center'>"
            + "<td style='text-align:center'>"+players[pid].player_name+"</td>"
            + "<td style='text-align:center'>"+players[pid].defense_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].defenses_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_defense_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_defenses_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].percent_lost+"</td>"
            + "<td style='text-align:center'>"+players[pid].pve_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].pve_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_pve_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_pvp_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].pve_percent_lost+"</td>"
            + "<td style='text-align:center'>"+players[pid].pvp_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].pvp_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_pvp_count+"</td>"
            + "<td style='text-align:center'>"+players[pid].solo_pvp_won+"</td>"
            + "<td style='text-align:center'>"+players[pid].pvp_percent_lost+"</td>"
            + "</tr>";
        });

    }
})();