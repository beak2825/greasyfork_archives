// ==UserScript==
// @name           DaveLoUReinf-yank/JK
// @description    Reinforcement Overview extract
// @namespace      davelou
// @author         davelou - (modified by yankoe & JK)
// @include        https://w*.crownofthegods.com/o*
// @version        0.0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/420580/DaveLoUReinf-yankJK.user.js
// @updateURL https://update.greasyfork.org/scripts/420580/DaveLoUReinf-yankJK.meta.js
// ==/UserScript==

(function () {
    window.dave = window.dave || function () {};
    dave.lou = dave.lou || function () {};
    var re = dave.lou.re = dave.lou.re || function () {};


    function davelouReinf() {
        if (!$ || !$('#incatk')[0] ) {
            window.setTimeout(davelouReinf, 5000);
            return;
        }

        try {
            // console.log('Loading davelou Reinforcements');
            re.setup.init();
        } catch (e) {
            console.error(e);
        }
    }

    re.setup = {
        init: function () {
            $('<a id="dlreinf" href="#SubMenu1" class="list-group-item strong" data-toggle="collapse">Reinforcements Summary</a>')
                .insertAfter('#incatk');
            $('#dlreinf').click(function(){
                re.data.load();
                $('.active').removeClass('active');
                $('#dlreinf').addClass('active');

            });
        },
    };

    re.data = {
        load: function() {
            var bB = $.post('incover.php');
            bB.done(function (data) {
                if (data) {
					data = JSON.parse(data);
                    // console.log('data: ', data);
					var arr = [];
                    var mult = {
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
                        // was 1
                        Druid: 2,
                        Galley: 100,
                        Warship: 400,
                        Guard: 1,
                        Scorpion: 10,
                        // added this and removed the 'battering ram' below
                        // because split() splits the quantity but also 'battering' and 'ram'
                        Battering: 10,
                    };
                    // mult["Battering Ram"]=10;
                    var htab = "<a id='dlexp' class='btn btn-default buttons-html5'>CSV</a>"+
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
                        "<th>Galley</th>"+
                        "<th>Other</th>"+
                        "</thead><tbody>";

                    for (var i in data.a) {
                        var inc = data.a[i];
                        var newAttacks = 0;
                        var siegingAttacks = 0;
                        var troops = {
                            Player : inc[0],
                            Coord : inc[2],
 //*                           NewAtks: 0,
 //*                           SeigAtks: 0,
                            Total_TS: 0,
                            Ranger : 0,
                            Triari : 0,
                            Scout: 0,
                            Arbalist: 0,
                            Priestess: 0,
                            Praetor: 0,
                            Ballista: 0,
                            Stinger: 0,
                            Galley: 0,
                            Other: 0,
                        };
                        var total = 0;
                        var support = inc[9];
                        var home = false;
                        for (var j in support) {
                            var army = support[j];

                            if (home && army[7] === 'home') {
                                continue;
                            } else if (army[7] === 'home') {
                                home = true;
                            }

                            if (army[5] == 3) {
                                for (var k in army[3]) {
                                    var troopStr = army[3][k];
                                    troopStr = troopStr.split(' ');
                                    var numStr = troopStr[0];
                                    var troop = troopStr[1];
                                    numStr = numStr.replace(',','') * 1;
                                    var ts = numStr * mult[troop];
                                    if (troops.hasOwnProperty(troop)) {
                                        troops[troop] += numStr;
                                    } else {
                                        troops.Other += ts;
                                    }
                                    total += ts;
                                }
                            }
                            if (army[5] == 0) {
                                newAttacks += 1;
                            }
                            if (army[5] == 1) {
                                siegingAttacks += 1;
                            }
                        }
                        troops['Total_TS'] = total;
   console.log('troops: ', troops);
                        arr.push(troops);
                        htab = htab + '<tr><td>'+
                            troops['Player'] + '</td><td>' +
                            troops['Coord'] + '</td><td>' +
                            siegingAttacks + '</td><td>' +
                            newAttacks + '</td><td>' +
                            troops['Total_TS'].toLocaleString() + '</td><td>' +
                            troops['Ranger'] + '</td><td>' +
                            troops['Triari'] + '</td><td>' +
                            troops['Scout'] + '</td><td>' +
                            troops['Arbalist'] + '</td><td>'+
                            troops['Priestess'] + '</td><td>'+
                            troops['Praetor'] + '</td><td>' +
                            troops['Ballista'] + '</td><td>' +
                            troops['Stinger'] + '</td><td>' +
                            troops['Galley'] + '</td><td>' +
                            troops['Other'] + '</td></tr>';

                    }
                    htab += "</tbody></table>";
                    $('#table').html(htab);
                    $('#subtits').text("Reinforcements Summary");
                    $('#refre').click(function() {
                        re.data.load();
                    });


                    $("#chrt_1").hide();
                    $("#chrt_2").hide();
                    $("#chrt_3").hide();

                    re.data.csv(arr);
                }
            });
        },
        csv: function (data) {
            var now = new Date();
            now.setHours(now.getHours()+1)
            var mm = String(now.getMonth()+1).padStart(2, "0")
            var dd = String(now.getDate()).padStart(2, "0")
            var datetime = " " + String(now.getHours()).padStart(2, "0") + ":"
            + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0")
            + " on "+ mm + "/"+ dd + "/" + now.getFullYear();
            var cd = 'Reinforcements Overview';
            cd += ' - Last Sync at Server Time';
            cd += datetime;
            cd += '\r\n\n';

            var header = '';
            for (var i in data[0]) {
                header += i + ',';
            }
            cd += header + '\r\n';

            for (var i1 = 0; i1 < data.length; i1++) {
                var row = '';
                for (var j in data[i1]) {
                    row += '"' + data[i1][j] + '",';
                }
                cd += row + '\r\n';
            }

            let csvContent = "data:text/csv;charset=utf-8,"+ escape(cd);
            var link = document.createElement("a");
            link.setAttribute("href", csvContent);
            link.setAttribute("download", "Reinforc.csv");
            document.body.appendChild(link); // Required for FF

            link.click();

        }
    };

    davelouReinf();


})();
