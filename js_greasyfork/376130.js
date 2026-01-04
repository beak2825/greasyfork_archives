// ==UserScript==
// @name           ReinfSum
// @description    Reinforcement Summary for Overview
// @namespace      http://tampermonkey.net/
// @author         yankoe
// @include        https://w*.crownofthegods.com/o*
// @grant          GM_setClipboard
// @version        0.0.8
// @downloadURL https://update.greasyfork.org/scripts/376130/ReinfSum.user.js
// @updateURL https://update.greasyfork.org/scripts/376130/ReinfSum.meta.js
// ==/UserScript==


(function () {
    var reinfsum = function () {};

    function ReinfSummary() {
        if (!$ || !$('#incatk')[0] ) {
            window.setTimeout(ReinfSummary, 5000);
            return;
        }

        try {
            reinfsumSetup();
        } catch (e) {
            console.error(e);
        }
    }

    function reinfsumSetup() {
            $('<a id="menureinf" href="#SubMenu1" class="list-group-item strong" data-toggle="collapse">Reinforcements Summary</a>').insertAfter('#incatk');
            $('#menureinf').click(function(){
                reinfsumData();
                $('.active').removeClass('active');
                $('#menureinf').addClass('active');

            });
    };

    function reinfsumData() {
        var resp = $.post('incover.php');
        //  Remove top pie charts from cities
        $("#chrt_1").hide();
        $("#chrt_2").hide();
        $("#chrt_3").hide();

        resp.done(function (data) {
            if (data) {
                data = JSON.parse(data);
                var reinf = [];
                var units = {
                    Ranger : 1,
                    Triari : 1,
                    Scout: 2,
                    Arbalist: 2,
                    Priestess: 1,
                    Praetor: 2,
                    Ballista: 10,
                    Stinger: 100,
                    Vanquisher: 1,
                    Senator: 1,
                    Horseman: 2,
                    Sorcerer: 1,
                    Druid: 2,
                    Galley: 100,
                    Warship: 400,
                    Guard: 1,
                    Scorpion: 10,
                    Ram: 10,
                };
                var htab = "<a id='csvlink' class='btn btn-default buttons-html5'>Copy to clipboard</a>"+
                    "<table id='tables' class='table table-striped'>"+
                    "<thead>"+
                    "<th>Player</th>"+
                    "<th>Location</th>"+
                    "<th># sieging</th>"+
                    "<th># new attacks</th>"+
                    "<th>Total TS</th>"+
                    "<th>Ranger</th>"+
                    "<th>Triari</th>"+
                    "<th>Scout</th>"+
                    "<th>Arbalist</th>"+
                    "<th>Priestess</th>"+
                    "<th>Praetor</th>"+
                    "<th>Ballista</th>"+
                    "<th>Stinger</th>"+
                    "<th>Other</th>"+
                    "</thead><tbody>";
                var header = '"Player", "Location", "Sieging", "New atk", "Total TS", "Ranger", "Triari", "Scout", "Arbalist", "Priestess", "Praetor", "Ballista", "Stinger", "Other"';

                // console.log(data);
                for (var i in data.a) {
                    var inc = data.a[i];
                    var troops = {
                        Player : inc[0],
                        Coord : inc[2],
                        sieging: 0,
                        newattacks: 0,
                        Total_TS: 0,
                        Ranger : 0,
                        Triari : 0,
                        Scout: 0,
                        Arbalist: 0,
                        Priestess: 0,
                        Praetor: 0,
                        Ballista: 0,
                        Stinger: 0,
                        Other: 0,
                    };
                    var total = 0;
                    var support = inc[9];
                    // control var to avoid duplicating home troops due to game bug that list
                    // 1 home troop line per incoming attack...
                    var homeNotDone = true;
                    for (var j in support) {
                        var army = support[j];
                        if (army[5] == 3) {
                            // support
                            if (homeNotDone || army[1]!="Troops home") {
                                for (var k in army[3]) {
                                    var troopStr = army[3][k];
                                    troopStr = troopStr.split(' ');
                                    var numStr = troopStr[0];
                                    var troop = troopStr[1];
                                    numStr = numStr.replace(',','') * 1;
                                    var ts = numStr * units[troop];
                                    if (troops.hasOwnProperty(troop)) {
                                        troops[troop] += numStr;
                                    } else {
                                        troops.Other += ts;
                                    }
                                    total += ts;
                                }
                                if (army[1]=="Troops home") {
                                    homeNotDone = false;
                                }
                            }
                        }
                        if (army[5] == 0) {
                            // new attack
                            troops.newattacks += 1;
                        }
                        if (army[5] == 1) {
                            // active siege
                            troops.sieging += 1;
                        }
                    }
                    troops['Total_TS'] = total;
                    reinf.push(troops);
                    htab = htab + '<tr><td>'+
                        troops['Player'] + '</td><td>' +
                        troops['Coord'] + '</td><td>' +
                        troops.sieging + '</td><td>' +
                        troops.newattacks + '</td><td>' +
                        troops['Total_TS'].toLocaleString() + '</td><td>' +
                        troops['Ranger'] + '</td><td>' +
                        troops['Triari'] + '</td><td>' +
                        troops['Scout'] + '</td><td>' +
                        troops['Arbalist'] + '</td><td>'+
                        troops['Priestess'] + '</td><td>'+
                        troops['Praetor'] + '</td><td>' +
                        troops['Ballista'] + '</td><td>' +
                        troops['Stinger'] + '</td><td>' +
                        troops['Other'] + '</td></tr>';

                }
                htab += "</tbody></table>";
                $('#table').html(htab);
                $('#subtits').text("Reinforcements Summary");
                $('#refre').click(function() {
                    reinfsumData();
                });
                $('#csvlink').click(function() {
                    console.log(reinf)
                    exportToClipboard(header, reinf);
                });
           }
        });
    };

    ReinfSummary();
})();

function exportToClipboard(header, adata) {
    var exportdata = ConvertToCSV(adata);
    var exporttable = header + '\n' + exportdata;
    var info = "text/csv;charset=utf-8;";
    GM_setClipboard(exporttable, info);
}

// JSON to CSV Converter
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    console.log(str)
    return str;
};

