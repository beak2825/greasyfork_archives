// ==UserScript==
// @name         TMVN League Lineup
// @namespace    https://trophymanager.com
// @version      6
// @description  Trophymanager: show average skill & value of first team (11 players) in last match. So you can estimate the power between teams in the league. R5 include routine sharing between positions in match.
// @match        https://trophymanager.com/league/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414870/TMVN%20League%20Lineup.user.js
// @updateURL https://update.greasyfork.org/scripts/414870/TMVN%20League%20Lineup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const APPLICATION_PARAM = {
        DEFAULT_SHOW_MODE: "10",
        LOCAL_STORAGE_KEY: "TMVN_LEAGUE_LINEUP_SHOW_MODE",
        SHOW_MODE_ARR: ["11", "10", "01"]
    }

    const APP_COLOR = {
        LEVEL_1: "Darkred",
        LEVEL_2: "Black",
        LEVEL_3: "Orange",
        LEVEL_4: "Yellow",
        LEVEL_5: "Blue",
        LEVEL_6: "Aqua",
        LEVEL_7: "White"
    };

    const BP_CLASS = {
        LEVEL_1: 150000000,
        LEVEL_2: 100000000,
        LEVEL_3: 80000000,
        LEVEL_4: 60000000,
        LEVEL_5: 40000000,
        LEVEL_6: 20000000,
        LEVEL_7: 0
    };

    const WA_CLASS = {
        LEVEL_1: 6000000,
        LEVEL_2: 5000000,
        LEVEL_3: 4000000,
        LEVEL_4: 3000000,
        LEVEL_5: 2000000,
        LEVEL_6: 1000000,
        LEVEL_7: 0
    };

    const XP_CLASS = {
        LEVEL_1: 90,
        LEVEL_2: 75,
        LEVEL_3: 60,
        LEVEL_4: 45,
        LEVEL_5: 30,
        LEVEL_6: 15,
        LEVEL_7: 0
    };

    const REC_CLASS = {
        LEVEL_1: 5.5,
        LEVEL_2: 5,
        LEVEL_3: 4,
        LEVEL_4: 3,
        LEVEL_5: 2,
        LEVEL_6: 1,
        LEVEL_7: 0
    };

    const R5_CLASS = {
        LEVEL_1: 110,
        LEVEL_2: 100,
        LEVEL_3: 90,
        LEVEL_4: 80,
        LEVEL_5: 70,
        LEVEL_6: 60,
        LEVEL_7: 0
    };

    const share_bonus = 0.25;
    const routine_cap = 40.0;

    try {
        $('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
    } catch (err) {}

    var matchIds = [];
    $('#last_round_table td').each(function () {
        let hrefVal = $(this).children('a').attr('href');
        if (hrefVal) {
            let matchID = hrefVal.substr(hrefVal.lastIndexOf('matches/') + 8, hrefVal.length - 10);
            matchIds.push(matchID);
        }
    });

    var positionMap = new Map();
    var routineMap = new Map();
    var clubDatas = new Map();
    matchIds.forEach(function (matchId) {
        let xhr = new XMLHttpRequest();
        let url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;

        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            try {
                if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(this.responseText);

                    let homeClubId = data.club.home.id;
                    let awayClubId = data.club.away.id;

                    let homeLineup = data.lineup.home;
                    let awayLineup = data.lineup.away;
                    let homePlayerIds = Object.getOwnPropertyNames(homeLineup);
                    let awayPlayerIds = Object.getOwnPropertyNames(awayLineup);

                    let homeD = [];
                    let homeM = [];
                    let homeF = [];
                    let awayD = [];
                    let awayM = [];
                    let awayF = [];

                    homePlayerIds.forEach((playerId, index) => {
                        let position = homeLineup[playerId].position;
                        if (position.indexOf("sub") > -1)
                            return;
                        positionMap.set(playerId, position);
                        routineMap.set(playerId, Number(homeLineup[playerId].routine));
                        if (position == "gk" || position == "dl" || position == "dr" || position == "dc" || position == "dcl" || position == "dcr") {
                            homeD.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(homeLineup[playerId].routine)
                            });
                        } else if (position == "dml" || position == "dmr" || position == "dmc" || position == "dmcl" || position == "dmcr" || position == "ml" || position == "mr" || position == "mc" || position == "mcl" || position == "mcr") {
                            homeM.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(homeLineup[playerId].routine)
                            });
                        } else {
                            homeF.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(homeLineup[playerId].routine)
                            });
                        }
                    });

                    awayPlayerIds.forEach((playerId, index) => {
                        let position = awayLineup[playerId].position;
                        if (position.indexOf("sub") > -1)
                            return;
                        positionMap.set(playerId, position);
                        routineMap.set(playerId, Number(awayLineup[playerId].routine));
                        if (position == "gk" || position == "dl" || position == "dr" || position == "dc" || position == "dcl" || position == "dcr") {
                            awayD.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(awayLineup[playerId].routine)
                            });
                        } else if (position == "dml" || position == "dmr" || position == "dmc" || position == "dmcl" || position == "dmcr" || position == "ml" || position == "mr" || position == "mc" || position == "mcl" || position == "mcr") {
                            awayM.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(awayLineup[playerId].routine)
                            });
                        } else {
                            awayF.push({
                                "ID": playerId,
                                "ROLE": position,
                                "ROU": Number(awayLineup[playerId].routine)
                            });
                        }
                    });

                    let line_size;
                    line_size = homeD.length;
                    if (line_size > 1) {
                        homeD.sort(compareByRoutineAsc);
                        var min = homeD[0].ROU;
                        if (min < routine_cap) {
                            var max = homeD[line_size - 1].ROU;
                            var min2 = homeD[1].ROU;
                            var bonus = max * share_bonus;
                            var new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(homeD[0].ID, new_routine);
                        }
                    }
                    line_size = homeM.length;
                    if (line_size > 1) {
                        homeM.sort(compareByRoutineAsc);
                        min = homeM[0].ROU;
                        if (min < routine_cap) {
                            max = homeM[line_size - 1].ROU;
                            min2 = homeM[1].ROU;
                            bonus = max * share_bonus;
                            new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(homeM[0].ID, new_routine);
                        }
                    }
                    line_size = homeF.length;
                    if (line_size > 1) {
                        homeF.sort(compareByRoutineAsc);
                        min = homeF[0].ROU;
                        if (min < routine_cap) {
                            max = homeF[line_size - 1].ROU;
                            min2 = homeF[1].ROU;
                            bonus = max * share_bonus;
                            new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(homeF[0].ID, new_routine);
                        }
                    }
                    line_size = awayD.length;
                    if (line_size > 1) {
                        awayD.sort(compareByRoutineAsc);
                        min = awayD[0].ROU;
                        if (min < routine_cap) {
                            max = awayD[line_size - 1].ROU;
                            min2 = awayD[1].ROU;
                            bonus = max * share_bonus;
                            new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(awayD[0].ID, new_routine);
                        }
                    }
                    line_size = awayM.length;
                    if (line_size > 1) {
                        awayM.sort(compareByRoutineAsc);
                        min = awayM[0].ROU;
                        if (min < routine_cap) {
                            max = awayM[line_size - 1].ROU;
                            min2 = awayM[1].ROU;
                            bonus = max * share_bonus;
                            new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(awayM[0].ID, new_routine);
                        }
                    }
                    line_size = awayF.length;
                    if (line_size > 1) {
                        awayF.sort(compareByRoutineAsc);
                        min = awayF[0].ROU;
                        if (min < routine_cap) {
                            max = awayF[line_size - 1].ROU;
                            min2 = awayF[1].ROU;
                            bonus = max * share_bonus;
                            new_routine = min + bonus;
                            new_routine = (new_routine < min2 ? new_routine : min2);
                            new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                            new_routine = parseFloat(new_routine.toFixed(1));
                            routineMap.set(awayF[0].ID, new_routine);
                        }
                    }

                    statistic(homePlayerIds, homeLineup).then((clubStatistic) => {
                        clubDatas.set(homeClubId, {
                            "XP": clubStatistic.XP,
                            "Age": clubStatistic.Age,
                            "ASI": clubStatistic.ASI,
                            "Wage": clubStatistic.Wage,
                            "BP": clubStatistic.BP,
                            "REC": clubStatistic.REC,
                            "R5": clubStatistic.R5
                        });
                    }).catch((error) => {});

                    statistic(awayPlayerIds, awayLineup).then((clubStatistic) => {
                        clubDatas.set(awayClubId, {
                            "XP": clubStatistic.XP,
                            "Age": clubStatistic.Age,
                            "ASI": clubStatistic.ASI,
                            "Wage": clubStatistic.Wage,
                            "BP": clubStatistic.BP,
                            "REC": clubStatistic.REC,
                            "R5": clubStatistic.R5
                        });
                    }).catch((error) => {});
                }
            } catch (e) {
                //exception with forfeit match
                clubDatas.set(Math.floor(Math.random() * 1000), {
                    "XP": 0,
                    "Age": 0,
                    "ASI": 0,
                    "Wage": 0,
                    "BP": 0,
                    "REC": 0,
                    "R5": 0
                });
                clubDatas.set(Math.floor(Math.random() * 1000), {
                    "XP": 0,
                    "Age": 0,
                    "ASI": 0,
                    "Wage": 0,
                    "BP": 0,
                    "REC": 0,
                    "R5": 0
                });
            }
        };
    });

    var clubMap = new Map();
    var myInterval = setInterval(append, 1000);

    function getPlayerData(playerId) {
        return new Promise((resolve, reject) => {
            $.post("/ajax/tooltip.ajax.php", {
                "player_id": playerId
            }).done((responseText) => {
                var data = JSON.parse(responseText);

                if (routineMap.has(playerId)) {
                    data.player.routine = routineMap.get(playerId).toString();
                }
                if (positionMap.has(playerId)) {
                    data.player.favposition = positionMap.get(playerId);
                }

                var rrValue = calculateRR(data.player);
                var rec;
                if (rrValue[0].length == 2) {
                    rec = Number(rrValue[0][0]) >= Number(rrValue[0][1]) ? Number(rrValue[0][0]) : Number(rrValue[0][1]);
                } else {
                    rec = Number(rrValue[0][0]);
                }
                var r5;
                if (rrValue[1].length == 2) {
                    r5 = Number(rrValue[1][0]) >= Number(rrValue[1][1]) ? Number(rrValue[1][0]) : Number(rrValue[1][1]);
                } else {
                    r5 = Number(rrValue[1][0]);
                }

                resolve({
                    XP: Number(data.player.routine.split(',').join('')),
                    Age: Number(data.player.age) * 12 + Number(data.player.months),
                    ASI: Number(data.player.skill_index.split(',').join('')),
                    Wage: Number(data.player.wage.replace("<span class='coin'>", "").replace("<\/span>", "").split(',').join('')),
                    BP: BP.compute(Number(data.player.skill_index.split(',').join('')), Number(data.player.age), Number(data.player.months), data.player.fp),
                    REC: rec,
                    R5: r5
                });
            }).fail((error) => {
                reject(error);
            });
        });
    }

    let BP = {
        compute: function (asi, age, month, position) {
            let pow = Math.pow;
            if (position === "GK") {
                return Math.round((asi * 500 * pow((300 / (age * 12 + month)), 2.5)) * 0.75);
            } else {
                return Math.round(asi * 500 * pow((300 / (age * 12 + month)), 2.5));
            }
        }
    };

    function statistic(playerIds, lineup) {
        return new Promise((resolve, reject) => {
            let clubStatistic = {
                XP: 0,
                Age: 0,
                ASI: 0,
                Wage: 0,
                BP: 0,
                REC: 0,
                R5: 0
            };
            let countLoop = 0;
            let countAjaxCall = 0;
            let countAjaxAnswer = 0;

            playerIds.forEach((playerId, index) => {
                if (lineup[playerId].position.indexOf("sub") < 0) {
                    countAjaxCall++;
                    countLoop++; //guarantee plus ajaxcall before
                    getPlayerData(playerId).then((player) => {
                        clubStatistic.XP += player.XP;
                        clubStatistic.Age += player.Age;
                        clubStatistic.ASI += player.ASI;
                        clubStatistic.Wage += player.Wage;
                        clubStatistic.BP += player.BP;
                        clubStatistic.REC += player.REC;
                        clubStatistic.R5 += player.R5;
                        countAjaxAnswer++;
                    }).catch((error) => {});
                } else {
                    countLoop++
                }
            });

            function check() {
                if (!(countLoop == playerIds.length && countAjaxCall == countAjaxAnswer)) {
                    setTimeout(check, 100);
                } else {
                    resolve(clubStatistic);
                };
            }

            check();
        });
    }

    function append() {
        if (clubDatas.size < 18) {
            return;
        }
        clearInterval(myInterval);
        $('#overall_table td').each(function () {
            let clubId = $(this).children('a').attr('club_link');
            if (clubId) {
                let clubName = $(this).children('a')[0].innerHTML;
                clubMap.set(clubId, clubName);
            }
        });

        let firstSquadSkill =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">START LINEUP</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<span style='display: inline-block;'><input id='tm_script_league_lineup_input_show_mode' type='text' class='embossed' style='min-width: 100px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Show Mode'></span>" +
            "<span id='tm_script_league_lineup_button_show_mode_set' class='button' style='margin-left: 3px;'><span class='button_border'>Set show mode</span></span>" +
            "<h3>SKILL</h3>" +
            "<div id=\"firstSquadSkill_content\" class=\"content_menu\"></div>" +
            "<h3>VALUE</h3>" +
            "<div id=\"firstSquadValue_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";
        $(".column3_a").append(firstSquadSkill);
        document.getElementById('tm_script_league_lineup_button_show_mode_set').addEventListener('click', (e) => {
            setShowMode();
        });
        let showMode = localStorage.getItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY);
        if (showMode == null || showMode == "") {
            showMode = APPLICATION_PARAM.DEFAULT_SHOW_MODE;
        }
        $('#tm_script_league_lineup_input_show_mode').val(showMode);
        let invidualMode = showMode.split("");
        if (invidualMode[0] == "1") {
            showSkill();
        }
        if (invidualMode[1] == "1") {
            showValue();
        }
    }

    function showSkill() {
        let firstSquadSkill_content = "<table>" +
            "<tr><th>Club</th><th align='right'>REC</th><th align='right'>XP</th><th align='right'>R5</th></tr>";

        let rowCount = 0;
        clubMap.forEach((value, key) => {
            rowCount++;
            let classOdd = "";
            if ((rowCount % 2) == 1) {
                classOdd = "class='odd'";
            }
            if (clubDatas.has(key)) {
                let clubData = clubDatas.get(key);
                let recColor,
                xpColor,
                r5Color;
                if (clubData.REC / 11 >= REC_CLASS.LEVEL_1) {
                    recColor = APP_COLOR.LEVEL_1;
                } else if (clubData.REC / 11 >= REC_CLASS.LEVEL_2) {
                    recColor = APP_COLOR.LEVEL_2;
                } else if (clubData.REC / 11 >= REC_CLASS.LEVEL_3) {
                    recColor = APP_COLOR.LEVEL_3;
                } else if (clubData.REC / 11 >= REC_CLASS.LEVEL_4) {
                    recColor = APP_COLOR.LEVEL_4;
                } else if (clubData.REC / 11 >= REC_CLASS.LEVEL_5) {
                    recColor = APP_COLOR.LEVEL_5;
                } else if (clubData.REC / 11 >= REC_CLASS.LEVEL_6) {
                    recColor = APP_COLOR.LEVEL_6;
                } else {
                    recColor = APP_COLOR.LEVEL_7;
                }

                if (clubData.XP / 11 >= XP_CLASS.LEVEL_1) {
                    xpColor = APP_COLOR.LEVEL_1;
                } else if (clubData.XP / 11 >= XP_CLASS.LEVEL_2) {
                    xpColor = APP_COLOR.LEVEL_2;
                } else if (clubData.XP / 11 >= XP_CLASS.LEVEL_3) {
                    xpColor = APP_COLOR.LEVEL_3;
                } else if (clubData.XP / 11 >= XP_CLASS.LEVEL_4) {
                    xpColor = APP_COLOR.LEVEL_4;
                } else if (clubData.XP / 11 >= XP_CLASS.LEVEL_5) {
                    xpColor = APP_COLOR.LEVEL_5;
                } else if (clubData.XP / 11 >= XP_CLASS.LEVEL_6) {
                    xpColor = APP_COLOR.LEVEL_6;
                } else {
                    xpColor = APP_COLOR.LEVEL_7;
                }

                if (clubData.R5 / 11 >= R5_CLASS.LEVEL_1) {
                    r5Color = APP_COLOR.LEVEL_1;
                } else if (clubData.R5 / 11 >= R5_CLASS.LEVEL_2) {
                    r5Color = APP_COLOR.LEVEL_2;
                } else if (clubData.R5 / 11 >= R5_CLASS.LEVEL_3) {
                    r5Color = APP_COLOR.LEVEL_3;
                } else if (clubData.R5 / 11 >= R5_CLASS.LEVEL_4) {
                    r5Color = APP_COLOR.LEVEL_4;
                } else if (clubData.R5 / 11 >= R5_CLASS.LEVEL_5) {
                    r5Color = APP_COLOR.LEVEL_5;
                } else if (clubData.R5 / 11 >= R5_CLASS.LEVEL_6) {
                    r5Color = APP_COLOR.LEVEL_6;
                } else {
                    r5Color = APP_COLOR.LEVEL_7;
                }

                firstSquadSkill_content += "<tr " + classOdd + "><td>" + value + "</td><td align='right' style='color: " + recColor + ";'>" +
                (clubData.REC / 11).toFixed(4) +
                "</td><td align='right' style='color: " + xpColor + ";'>" +
                (clubData.XP / 11).toFixed(1) +
                "</td><td align='right' style='color: " + r5Color + ";'>" +
                (clubData.R5 / 11).toFixed(2) +
                "</td></tr>";
            } else {
                firstSquadSkill_content += "<tr " + classOdd + "><td>" + value + "</td><td></td><td></td><td></td></tr>";
            }

        });
        firstSquadSkill_content += "</table>";
        $("#firstSquadSkill_content").append(firstSquadSkill_content);
    }

    function showValue() {
        let firstSquadValue_content = "<table>" +
            "<tr><th>Club</th><th align='right'>BP(K)</th><th align='right'>Age</th><th align='right'>WA(K)</th></tr>";

        let rowCount = 0;
        clubMap.forEach((value, key) => {
            rowCount++;
            let classOdd = "";
            if ((rowCount % 2) == 1) {
                classOdd = "class='odd'";
            }
            if (clubDatas.has(key)) {
                let clubData = clubDatas.get(key);
                var bpColor,
                waColor;
                if (clubData.BP / 11 >= BP_CLASS.LEVEL_1) {
                    bpColor = APP_COLOR.LEVEL_1;
                } else if (clubData.BP / 11 >= BP_CLASS.LEVEL_2) {
                    bpColor = APP_COLOR.LEVEL_2;
                } else if (clubData.BP / 11 >= BP_CLASS.LEVEL_3) {
                    bpColor = APP_COLOR.LEVEL_3;
                } else if (clubData.BP / 11 >= BP_CLASS.LEVEL_4) {
                    bpColor = APP_COLOR.LEVEL_4;
                } else if (clubData.BP / 11 >= BP_CLASS.LEVEL_5) {
                    bpColor = APP_COLOR.LEVEL_5;
                } else if (clubData.BP / 11 >= BP_CLASS.LEVEL_6) {
                    bpColor = APP_COLOR.LEVEL_6;
                } else {
                    bpColor = APP_COLOR.LEVEL_7;
                }

                if (clubData.Wage / 11 >= WA_CLASS.LEVEL_1) {
                    waColor = APP_COLOR.LEVEL_1;
                } else if (clubData.Wage / 11 >= WA_CLASS.LEVEL_2) {
                    waColor = APP_COLOR.LEVEL_2;
                } else if (clubData.Wage / 11 >= WA_CLASS.LEVEL_3) {
                    waColor = APP_COLOR.LEVEL_3;
                } else if (clubData.Wage / 11 >= WA_CLASS.LEVEL_4) {
                    waColor = APP_COLOR.LEVEL_4;
                } else if (clubData.Wage / 11 >= WA_CLASS.LEVEL_5) {
                    waColor = APP_COLOR.LEVEL_5;
                } else if (clubData.Wage / 11 >= WA_CLASS.LEVEL_6) {
                    waColor = APP_COLOR.LEVEL_6;
                } else {
                    waColor = APP_COLOR.LEVEL_7;
                }

                firstSquadValue_content += "<tr " + classOdd + "><td>" + value + "</td><td align='right' style='color: " + bpColor + ";'>" +
                (clubData.BP / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                "</td><td align='right'>" +
                (clubData.Age / 11 / 12).toFixed(1) +
                "</td><td align='right' style='color: " + waColor + ";'>" +
                (clubData.Wage / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                "</td></tr>";
            } else {
                firstSquadValue_content += "<tr " + classOdd + "><td>" + value + "</td><td></td><td></td><td></td></tr>";
            }

        });

        firstSquadValue_content += "</table>";

        $("#firstSquadValue_content").append(firstSquadValue_content);
    }

    function setShowMode() {
        let showMode = $('#tm_script_league_lineup_input_show_mode')[0].value;
        if (showMode == '') {
            localStorage.removeItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY);
        } else if (!APPLICATION_PARAM.SHOW_MODE_ARR.includes(showMode)) {
            alert('Allowable show mode values: ' + APPLICATION_PARAM.SHOW_MODE_ARR);
        } else {
            localStorage.setItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY, showMode);
            alert('Set successful, please refresh');
        }
    }

    // R5 weights
    //		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
    var weightR5 = [[0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0.00000000], // DC
        [0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0.00000000], // DL/R
        [0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0.00000000], // DMC
        [0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0.00000000], // DML/R
        [0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0.00000000], // MC
        [0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0.00000000], // ML/R
        [0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0.00000000], // OMC
        [0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0.00000000], // OML/R
        [0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0.00000000], // F
        [0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116]]; // GK

    // RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
    var weightRb = [[0.10493615, 0.05208547, 0.07934211, 0.14448971, 0.13159554, 0.06553072, 0.07778375, 0.06669303, 0.05158306, 0.02753168, 0.12055170, 0.01350989, 0.02549169, 0.03887550], // DC
        [0.07715535, 0.04943315, 0.11627229, 0.11638685, 0.12893778, 0.07747251, 0.06370799, 0.03830611, 0.10361093, 0.06253997, 0.09128094, 0.01314110, 0.02449199, 0.03726305], // DL/R
        [0.08219824, 0.08668831, 0.07434242, 0.09661001, 0.08894242, 0.08998026, 0.09281287, 0.08868309, 0.04753574, 0.06042619, 0.05396986, 0.05059984, 0.05660203, 0.03060871], // DMC
        [0.06744248, 0.06641401, 0.09977251, 0.08253749, 0.09709316, 0.09241026, 0.08513703, 0.06127851, 0.10275520, 0.07985941, 0.04618960, 0.03927270, 0.05285911, 0.02697852], // DML/R
        [0.07304213, 0.08174111, 0.07248656, 0.08482334, 0.07078726, 0.09568392, 0.09464529, 0.09580381, 0.04746231, 0.07093008, 0.04595281, 0.05955544, 0.07161249, 0.03547345], // MC
        [0.06527363, 0.06410270, 0.09701305, 0.07406706, 0.08563595, 0.09648566, 0.08651209, 0.06357183, 0.10819222, 0.07386495, 0.03245554, 0.05430668, 0.06572005, 0.03279859], // ML/R
        [0.07842736, 0.07744888, 0.07201150, 0.06734457, 0.05002348, 0.08350204, 0.08207655, 0.11181914, 0.03756112, 0.07486004, 0.06533972, 0.07457344, 0.09781475, 0.02719742], // OMC
        [0.06545375, 0.06145378, 0.10503536, 0.06421508, 0.07627526, 0.09232981, 0.07763931, 0.07001035, 0.11307331, 0.07298351, 0.04248486, 0.06462713, 0.07038293, 0.02403557], // OML/R
        [0.07738289, 0.05022488, 0.07790481, 0.01356516, 0.01038191, 0.06495444, 0.07721954, 0.07701905, 0.02680715, 0.07759692, 0.12701687, 0.15378395, 0.12808992, 0.03805251], // F
        [0.07466384, 0.07466384, 0.07466384, 0.14932769, 0.10452938, 0.14932769, 0.10452938, 0.10344411, 0.07512610, 0.04492581, 0.04479831]]; // GK

    var posNames = ["DC", "DCL", "DCR", "DL", "DR", "DMC", "DMCL", "DMCR", "DML", "DMR", "MC", "MCL", "MCR", "ML", "MR", "OMC", "OMCL", "OMCR", "OML", "OMR", "F", "FC", "FCL", "FCR", "GK"];
    var pos = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 8, 8, 9];

    function funFix1(i) {
        i = (Math.round(i * 10) / 10).toFixed(1);
        return i;
    }

    function funFix2(i) {
        i = (Math.round(i * 100) / 100).toFixed(2);
        return i;
    }

    function funFix3(i) {
        i = (Math.round(i * 1000) / 1000).toFixed(3);
        return i;
    }

    function calculate(weightRb, weightR5, skills, posGain, posKeep, fp, rou, remainder, allBonus) {
        var rec = 0; // RERECb
        var ratingR = 0; // RatingR5
        var ratingR5 = 0; // RatingR5 + routine
        var ratingR5Bonus = 0; // RatingR5 + routine + bonus
        var remainderWeight = 0; // REREC remainder weight sum
        var remainderWeight2 = 0; // RatingR5 remainder weight sum
        var not20 = 0; // 20以外のスキル数
        for (var i = 0; i < weightRb[fp].length; i++) { // weightR[fp].length = n.pesi[pos] cioè le skill: 14 o 11
            rec += skills[i] * weightRb[fp][i];
            ratingR += skills[i] * weightR5[fp][i];
            if (skills[i] != 20) {
                remainderWeight += weightRb[fp][i];
                remainderWeight2 += weightR5[fp][i];
                not20++;
            }
        }
        if (remainder / not20 > 0.9 || not20 == 0) {
            if (fp == 9)
                not20 = 11;
            else
                not20 = 14;
            remainderWeight = 1;
            remainderWeight2 = 5;
        }
        rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3);
        ratingR += remainder * remainderWeight2 / not20;
        ratingR5 = funFix2(ratingR * 1 + rou * 5);

        if (skills.length == 11) {
            ratingR5Bonus = funFix2(ratingR5 * 1 + allBonus * 1);
        } else {
            ratingR5Bonus = funFix2(ratingR5 * 1 + allBonus * 1 + posGain[fp] * 1 + posKeep[fp] * 1);
        }
        return [rec, ratingR5Bonus];
    }

    function calculateRR(current_player_info) {
        var skillArray = current_player_info.skills;
        var STR,
        STA,
        PAC,
        MAR,
        TAC,
        WOR,
        POS,
        PAS,
        CRO,
        TEC,
        HEA,
        FIN,
        LON,
        SET,
        HAN,
        ONE,
        REF,
        AER,
        JUM,
        COM,
        KIC,
        THR;
        var skillValue;
        for (var i = 0; i < skillArray.length; i++) {
            if (skillArray[i].key == 'null')
                continue;
            skillValue = skillArray[i].value;
            if (isNaN(skillValue)) {
                if (skillValue.indexOf('19') != -1) {
                    skillValue = 19;
                } else if (skillValue.indexOf('20') != -1) {
                    skillValue = 20;
                } else {
                    throw 'Error skillValue: ' + skillValue;
                }
            }

            switch (skillArray[i].key) {
            case 'strength':
                STR = skillValue;
                break;
            case 'stamina':
                STA = skillValue;
                break;
            case 'pace':
                PAC = skillValue;
                break;
            case 'marking':
                MAR = skillValue;
                break;
            case 'tackling':
                TAC = skillValue;
                break;
            case 'workrate':
                WOR = skillValue;
                break;
            case 'positioning':
                POS = skillValue;
                break;
            case 'passing':
                PAS = skillValue;
                break;
            case 'crossing':
                CRO = skillValue;
                break;
            case 'technique':
                TEC = skillValue;
                break;
            case 'heading':
                HEA = skillValue;
                break;
            case 'finishing':
                FIN = skillValue;
                break;
            case 'longshots':
                LON = skillValue;
                break;
            case 'set_pieces':
                SET = skillValue;
                break;
            case 'handling':
                HAN = skillValue;
                break;
            case 'one_on_ones':
                ONE = skillValue;
                break;
            case 'reflexes':
                REF = skillValue;
                break;
            case 'aerial_ability':
                AER = skillValue;
                break;
            case 'jumping':
                JUM = skillValue;
                break;
            case 'communication':
                COM = skillValue;
                break;
            case 'kicking':
                KIC = skillValue;
                break;
            case 'throwing':
                THR = skillValue;
                break;
            default:
                throw 'Error skillArray[i].key: ' + skillArray[i].key;
            }
        }

        var ROLE = current_player_info.favposition.toUpperCase();
        var ROU = Number(current_player_info.routine.split(',').join(''));
        var ASI = Number(current_player_info.skill_index.split(',').join(''));

        var ROLE1,
        ROLE2;
        var role = ROLE.split(',');
        if (role.length == 2) {
            ROLE1 = role[0];
            ROLE2 = role[1];
        } else {
            ROLE1 = role[0];
            ROLE2 = -1;
        }

        var fp,
        fp2 = -1;
        for (var i = 0; i < posNames.length; i++) {
            if (posNames[i] == ROLE1)
                fp = pos[i];
            if (ROLE2 != -1 && posNames[i] == ROLE2)
                fp2 = pos[i];
        }
        if (fp == 9) {
            var weight = 48717927500;
            var skills = [STR, STA, PAC, HAN, ONE, REF, AER, JUM, COM, KIC, THR];
        } else {
            weight = 263533760000;
            skills = [STR, STA, PAC, MAR, TAC, WOR, POS, PAS, CRO, TEC, HEA, FIN, LON, SET];
        }

        var goldstar = 0;
        var skillSum = 0;
        var skillsB = [];
        for (i = 0; i < skills.length; i++) {
            skillSum += parseInt(skills[i]);
        }
        var remainder = Math.round((Math.pow(2, Math.log(weight * ASI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10; // RatingR5 remainder
        for (var j = 0; j < 2; j++) {
            for (i = 0; i < 14; i++) {
                if (j == 0 && skills[i] == 20)
                    goldstar++;
                if (j == 1) {
                    if (skills[i] != 20)
                        skillsB[i] = skills[i] * 1 + remainder / (14 - goldstar);
                    else
                        skillsB[i] = skills[i];
                }
            }
        }

        var routine = (3 / 100) * (100 - (100) * Math.pow(Math.E, -ROU * 0.035));
        var strRou = skillsB[0] * 1 + routine;
        var staRou = skillsB[1] * 1;
        var pacRou = skillsB[2] * 1 + routine;
        var marRou = skillsB[3] * 1 + routine;
        var tacRou = skillsB[4] * 1 + routine;
        var worRou = skillsB[5] * 1 + routine;
        var posRou = skillsB[6] * 1 + routine;
        var pasRou = skillsB[7] * 1 + routine;
        var croRou = skillsB[8] * 1 + routine;
        var tecRou = skillsB[9] * 1 + routine;
        var heaRou = skillsB[10] * 1 + routine;
        var finRou = skillsB[11] * 1 + routine;
        var lonRou = skillsB[12] * 1 + routine;
        var setRou = skillsB[13] * 1 + routine;

        var headerBonus;
        if (heaRou > 12)
            headerBonus = funFix2((Math.pow(Math.E, (heaRou - 10) ** 3 / 1584.77) - 1) * 0.8 + Math.pow(Math.E, (strRou * strRou * 0.007) / 8.73021) * 0.15 + Math.pow(Math.E, (posRou * posRou * 0.007) / 8.73021) * 0.05);
        else
            headerBonus = 0;

        var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + lonRou + tecRou * 0.5, 2) * 0.002) / 327.92526);
        var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + croRou + tecRou * 0.5, 2) * 0.002) / 983.65770);
        var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + finRou + tecRou * 0.5, 2) * 0.002) / 1967.31409);

        var allBonus = 0;
        if (skills.length == 11)
            allBonus = 0;
        else
            allBonus = headerBonus * 1 + fkBonus * 1 + ckBonus * 1 + pkBonus * 1;

        var gainBase = funFix2((strRou ** 2 + staRou ** 2 * 0.5 + pacRou ** 2 * 0.5 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2);
        var keepBase = funFix2((strRou ** 2 * 0.5 + staRou ** 2 * 0.5 + pacRou ** 2 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2);
        //	0:DC			1:DL/R			2:DMC			3:DML/R			4:MC			5:ML/R			6:OMC			7:OML/R			8:F
        var posGain = [gainBase * 0.3, gainBase * 0.3, gainBase * 0.9, gainBase * 0.6, gainBase * 1.5, gainBase * 0.9, gainBase * 0.9, gainBase * 0.6, gainBase * 0.3];
        var posKeep = [keepBase * 0.3, keepBase * 0.3, keepBase * 0.9, keepBase * 0.6, keepBase * 1.5, keepBase * 0.9, keepBase * 0.9, keepBase * 0.6, keepBase * 0.3];

        var valueFp = calculate(weightRb, weightR5, skills, posGain, posKeep, fp, routine, remainder, allBonus);
        var rec = [valueFp[0]];
        var r5 = [valueFp[1]];

        if (fp2 != -1 && fp2 != fp) {
            var valueFp2 = calculate(weightRb, weightR5, skills, posGain, posKeep, fp2, routine, remainder, allBonus);
            rec.push(valueFp2[0]);
            r5.push(valueFp2[1]);
        }

        return [rec, r5];
    }

    function compareByRoutineAsc(a, b) {
        var rou_a = parseFloat(a.ROU);
        var rou_b = parseFloat(b.ROU);
        return (rou_a - rou_b);
    }
})();
