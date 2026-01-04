// ==UserScript==
// @name         world monitor db scurvy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds button to export sister TS data to DB
// @author       Yan Koe
// @match        https://w21.crownofthegods.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/412020/world%20monitor%20db%20scurvy.user.js
// @updateURL https://update.greasyfork.org/scripts/412020/world%20monitor%20db%20scurvy.meta.js
// ==/UserScript==

var world = "W21";
var todburl = "https://w21.yknet.com.br/monitor/_getsisterdata";
// var todburl = "http://127.0.0.1:5000/monitor/_getsisterdata";
var sister = 'Scurvy Dawgz';

(function () {
    var w_members = [];
    // pages to monitor
    var pages = ["Military", "Offense", "Defense"];
    var getPlayers = true;
    var pagesDone=0;
    var pagesProcess = false;
    var monitors=[];

    // prepare interface
    $(document).ready(function() {
        // add button to top menu
        var sistermonitordbBtn='<button id="sistermonitorexportdbbut" class="tabButton" style="width: 80px;">SisterTS</button>';
            $('#items').after(sistermonitordbBtn);
            $('#sistermonitorexportdbbut').click(sister_monitordb);
    });
    // activate ranking monitoring function
    function sister_monitordb () {
        pagesProcess = true;
        pagesDone=0;
        monitors=[];
        alert("Please Go to: \nRankings - Empire - Military\nto export data\n\nData will be saved in alliance database");
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
                            worldPlayers=dataplayers[0];
                            if(worldPlayers) {
                                worldPlayers.forEach(element => {
                                    if (element[4] == sister) {
                                        // only if player in sister,
                                        // push [player, alliance] to w_members
                                        w_members.push([element[1], element[4]]);
                                    }
                                });
                            }
                            getPlayers=false;
                        }
                        if (pagesProcess) {
                            if(pagesDone < pages.length) {
                                var data=JSON.parse(this.response);
                                pageData = {};
                                if(data["16"] && pagesDone == 0) {
                                    // Empire - Military data
                                    pageData = data["16"];
                                }
                                if (data["17"] && pagesDone == 1) {
                                    // Offense TS
                                    pageData = data["17"];
                                }
                                if (data["18"] && pagesDone == 2) {
                                    // Defense TS
                                    pageData = data["18"];
                                }
                            }
                            if (typeof pageData !== 'undefined') {
                                var page = {};
                                page.name = pages[pagesDone];
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
    })(XMLHttpRequest.prototype.open);
})();

// read ts data from ranking arrays (TS)
function extract_data(dataFromRanking, monitorlist, pagename){
    var extractedData = [];
    var position = 4; // position when data not an array
    console.log(dataFromRanking[0]);
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
    var output = {players: header, monitors: rows, world: world, sister: sister};
    $.post(todburl, {send: JSON.stringify(output)})
    .done(function(resp) {
        var r = resp["response"];
        if (r == '404') {alert('Wrong world data');}
        else {alert('OK - data received');}
    })
    .fail(function(resp) {
        var r = resp["response"];
        alert('Data or transfer failure');
    });
}

