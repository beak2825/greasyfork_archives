// ==UserScript==
// @name         world monitor db
// @namespace    http://tampermonkey.net/
// @version      1.25.1
// @description  adds button to export all ranking data to DB
// @author       Yan Koe
// @match        https://w25.crownofthegods.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/434212/world%20monitor%20db.user.js
// @updateURL https://update.greasyfork.org/scripts/434212/world%20monitor%20db.meta.js
// ==/UserScript==

var world = "W25";
// var todburl = "http://127.0.0.1:5000/monitor/_getdata";
var todburl = "https://w23.yknet.com.br/monitor/_getdata";

(function () {
    var w_members = [];
    // pages to monitor
    var pages = ["Score", "Military", "Offense", "Defense", "Combat Rep", "Off Rep", "Def Rep", "Kills", "Plunders", "Raiding"];
    var getPlayers = true;
    var pagesDone=0;
    var pagesProcess = false;
    var monitors=[];

    // prepare interface
    $(document).ready(function() {
        // world monitor export to db button - top menu
        // var wmonitordbBtn='<button id="wmonitorexportdbbut" class="tabButton" style="width: 80px;">WMonDB</button>';
        // $('#items').after(wmonitordbBtn);
        // add ui button in city panel (below top buttons Counc ON, Refine, Raid, Demo)
        var wmonitordbBtn = "<button id='wmonitorexportdbbut' style='margin-left:4px;margin-top:10px;width:58px;font-size:10px !important;' class='regButton greenb'>WMonDB</button>";
		$("#autodemo2").after(wmonitordbBtn);
        
        $('#wmonitorexportdbbut').click(world_monitordb);
    });
    // activate ranking monitoring function
    function world_monitordb () {
        pagesProcess = true;
        pagesDone=0;
        monitors=[];
        alert("Please Go to: \nRankings - Empire - Score\nto export data\n\nData will be saved in alliance database");
    }
    // main
    (function(open) {
        var pageData={};
        var worldPlayers;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.readyState==4) {
                    this.readyState=null;
                    var url=this.responseURL;
                    if (url.indexOf('gR')!=-1) {
                        if (getPlayers) {
                            var dataplayers=JSON.parse(this.response);
                            // console.log(dataplayers);
                            worldPlayers=dataplayers[0];
                            if(worldPlayers) {
                                worldPlayers.forEach(element => {
                                    // push [player, alliance] to w_members
                                    w_members.push([element[1], element[4]]);
                                });
                                // console.log(w_members);
                            }
                            getPlayers=false;
                        }
                        if (pagesProcess) {
                            if(pagesDone < pages.length) {
                                var data=JSON.parse(this.response);
                                pageData = {};
                                // console.log(pagesDone);
                                // if (Array.isArray(data) && pagesDone == 0) {
                                if (data[0] && pagesDone == 0) {
                                    // score
                                    pageData = data[0]
                                }
                                if(data["16"] && pagesDone == 1) {
                                    // Empire - Military data
                                    pageData = data["16"]
                                }
                                if (data["17"] && pagesDone == 2) {
                                    // Offense
                                    pageData = data["17"]
                                }
                                if (data["18"] && pagesDone == 3) {
                                    // Defense
                                    pageData = data["18"]
                                }
                                if (data["8"] && pagesDone == 4) {
                                    // Combat rep
                                    pageData = data["8"]
                                }
                                if (data["3"] && pagesDone == 5) {
                                    // Offense rep
                                    pageData = data["3"]
                                }
                                if (data["4"] && pagesDone == 6) {
                                    // Def rep
                                    pageData = data["4"]
                                }
                                if (data["5"] && pagesDone == 7) {
                                    // Kills
                                    pageData = data["5"]
                                }
                                if (data["6"] && pagesDone == 8) {
                                    // Plunders
                                    pageData = data["6"]
                                }
                                if (data["7"] && pagesDone == 9) {
                                    // Raid
                                    pageData = data["7"]
                                }
                            }
                            if (typeof pageData != "undefined") {
                                var page = {};
                                page.name = pages[pagesDone];
                                // console.log("Extracting " + pages[pagesDone] + " TS Monitor");
                                page.data = extract_data(pageData, w_members, page.name);
                                if (page.data != []) {
                                    monitors.push(page);
                                    pagesDone+=1;
                                }
                                if(pagesDone >= pages.length) {
                                    exportDataToDB(w_members, monitors);
                                    pagesProcess = false;
                                    monitors=[];
                                    pagesDone=0;
                                } else {
                                    alert("Please select: " + pages[pagesDone]);
                                }
                            }
                        }
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open)
})();

// read ts data from ranking arrays (TS)
function extract_data(dataFromRanking, monitorlist, pagename){
    var extractedData = [];
    var position = 4; // position when data not an array
    // console.log(dataFromRanking[0])
    for (var i=0;i<monitorlist.length;i++) {
        // use monitolist[i][0] for player name
        var pos = dataFromRanking.map(function(e) { return e['1'];}).indexOf(monitorlist[i][0]);
        if (pos != -1) {
            if (Array.isArray(dataFromRanking[0])) {
                // console.log("array");
                position = 2;
            } else {
                position = 4;
            }
            if (pagename == "Score") {
                position = 3;
            }
            extractedData.push(dataFromRanking[pos][position]);
        } else {
            extractedData.push("");
        }
    }
    return extractedData;
}

function exportDataToDB(header, rows) {
    var output = {players: header, monitors: rows, world: world}
    console.log(output);
    $.post(todburl, {send: JSON.stringify(output)})
    .done(function(resp) {
        var r = resp.response;
        console.log(r);
        if (r == '404') {alert('Wrong world data')};
        if (r == '400') {alert('ERROR in data')}
        else {alert('OK - data received')}
    })
    .fail(function() {
        var r = resp.response;
        console.log(r);
        alert('Data or transfer failure')
    });
};

