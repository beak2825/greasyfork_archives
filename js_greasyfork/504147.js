// ==UserScript==
// @name        TMVN Match Compare FOR R6
// @version     1
// @description Trophymanager: compare power of two clubs on: Age, ASI, Bank Price, Wage, RERECb, Routine and RatingR6 (include sharing routine base on position in match)
// @namespace   https://trophymanager.com
// @match       https://trophymanager.com/matches/*
// @downloadURL https://update.greasyfork.org/scripts/504147/TMVN%20Match%20Compare%20FOR%20R6.user.js
// @updateURL https://update.greasyfork.org/scripts/504147/TMVN%20Match%20Compare%20FOR%20R6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const APP_COLOR = {
        LEVEL_1: "Darkred",
        LEVEL_2: "Black",
        LEVEL_3: "Orange",
        LEVEL_4: "Yellow",
        LEVEL_5: "Blue",
        LEVEL_6: "Aqua",
        LEVEL_7: "White"
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

    var matchUrl = location.href.split('/');
    var matchId,
    url;
    if (isNaN(matchUrl[4])) {
        matchId = matchUrl[5];
        url = 'https://trophymanager.com/ajax/match.ajax.php?id=nt' + matchId;
    } else {
        matchId = matchUrl[4];
        url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;
    }

    var r5Map = new Map();
    var playerNameMap = new Map();
    var positionMap = new Map();
    var routineMap = new Map();
    var clubDatas = new Map();
    var xhr = new XMLHttpRequest();
    var homeClubId,
    awayClubId;

    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            homeClubId = data.club.home.id;
            awayClubId = data.club.away.id;

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
                playerNameMap.set(playerId, homeLineup[playerId].no + '. ' + homeLineup[playerId].name);
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
                playerNameMap.set(playerId, awayLineup[playerId].no + '. ' + awayLineup[playerId].name);
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
    };

    var displayInterval = setInterval(display, 1000);
    var updateNameInterval = setInterval(updateName, 100);
    var showInfoInterval = setInterval(showInfo, 1000);

    var newdiv;
    var pause = false;

    function showInfo() {
        if (clubDatas.size < 2) {
            return;
        }
        clearInterval(showInfoInterval);

        newdiv = document.createElement("div");
        newdiv.innerHTML =
            "<br><div id=\"mystarbox\" class=\"home color\" style=\"background-color:rgb(0,0,0)\"><b style=\"color: white;\">" + "REC:" + (clubDatas.get(homeClubId).REC / 11).toFixed(4) + " R6:" + (clubDatas.get(homeClubId).R5 / 11).toFixed(2) + "</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + "REC:" + (clubDatas.get(awayClubId).REC / 11).toFixed(4) + " R6:" + (clubDatas.get(awayClubId).R5 / 11).toFixed(2) + "</b></div>" +

            "<br><div id=\"myxp\" class=\"home color\" style=\"background-color:rgb(0,0,0)\"><b style=\"color: white;\">" + "ROU:" + (clubDatas.get(homeClubId).XP / 11).toFixed(1) + " Age:" + (clubDatas.get(homeClubId).Age / 11 / 12).toFixed(1) + " ASI:" + (clubDatas.get(homeClubId).ASI / 11).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + "ROU:" + (clubDatas.get(awayClubId).XP / 11).toFixed(1) + " Age:" + (clubDatas.get(awayClubId).Age / 11 / 12).toFixed(1) + " ASI:" + (clubDatas.get(awayClubId).ASI / 11).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></div>" +

            "<br><div id=\"myxp\" class=\"home color\" style=\"background-color:rgb(0,0,0)\"><b style=\"color: white;\">" + "BP:" + (clubDatas.get(homeClubId).BP / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Wage:" + (clubDatas.get(homeClubId).Wage / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + "BP:" + (clubDatas.get(awayClubId).BP / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Wage:" + (clubDatas.get(awayClubId).Wage / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></div>";

        r5Map.forEach((value, key) => {
            $('div .quarter a[href$="/' + key + '"] .icons').text(value);
            if (value >= R5_CLASS.LEVEL_1) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_1);
            } else if (value >= R5_CLASS.LEVEL_2) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_2);
            } else if (value >= R5_CLASS.LEVEL_3) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_3);
            } else if (value >= R5_CLASS.LEVEL_4) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_4);
            } else if (value >= R5_CLASS.LEVEL_5) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_5);
            } else if (value >= R5_CLASS.LEVEL_6) {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_6);
            } else {
                $('div .quarter a[href$="/' + key + '"] .icons').css('color', APP_COLOR.LEVEL_7);
            }
        });
    }

    function display() {
        if (newdiv !== undefined && $('.nameplate').length > 0) {
            if ($('.post_report').length > 0) {
                document.getElementsByClassName("nameplate")[0].appendChild(newdiv);
                clearInterval(displayInterval);
            } else if (!pause) {
                document.getElementsByClassName("nameplate")[0].appendChild(newdiv);
                pause = true;
            }
        }
    }

    function updateName() {
        if (playerNameMap.size < 22) {
            return;
        }
        playerNameMap.forEach((value, key) => {
            $('div .quarter a[href$="/' + key + '"] .name').text(value);
        });
        if ($('.post_report').length > 0) {
            clearInterval(updateNameInterval);
        }
    }

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
                r5Map.set(playerId, r5);

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

    // R5 weights
    //		Str	Sta		Pac		Mar		Tac		Wor		Pos		Pas		Cro		Tec		Hea		Fin		Lon		Set
    var weightR5 = [
       [0.5375, 0.00, 0.5925, 0.9500, 0.9206, 0.5274, 0.5825, 0.1313, 0.0656, 0.0937, 0.5282, 0.0491, 0.0216, 0.00], // DC
       [0.5140, 0.00, 0.6825, 0.8280, 0.8063, 0.5026, 0.5825, 0.1313, 0.2337, 0.1752, 0.4762, 0.0491, 0.0216, 0.00], // DL/R
       [0.4520, 0.00, 0.5683, 0.6864, 0.6727, 0.5780, 0.5720, 0.5105, 0.1095, 0.3504, 0.2850, 0.1050, 0.1102, 0.00], // DMC
       [0.4523, 0.00, 0.6666, 0.5765, 0.5499, 0.5327, 0.5120, 0.3255, 0.2949, 0.3226, 0.4547, 0.2230, 0.0893, 0.00], // DML/R
       [0.3291, 0.00, 0.4548, 0.3515, 0.3236, 0.5648, 0.5907, 0.6467, 0.0952, 0.6042, 0.2850, 0.5001, 0.2543, 0.00], // MC
       [0.2958, 0.00, 0.6709, 0.2840, 0.3039, 0.5042, 0.5420, 0.4126, 0.4244, 0.6020, 0.2580, 0.4501, 0.2521, 0.00], // ML/R
       [0.3363, 0.00, 0.4932, 0.2035, 0.1910, 0.5619, 0.5719, 0.6670, 0.0675, 0.6016, 0.4225, 0.6053, 0.2783, 0.00], // OMC
       [0.3585, 0.00, 0.6621, 0.1105, 0.1025, 0.5359, 0.5192, 0.3313, 0.4250, 0.6258, 0.4212, 0.6000, 0.3080, 0.00], // OML/R
       [0.4225, 0.00, 0.4500, 0.0003, 0.0002, 0.3845, 0.5015, 0.4050, 0.0010, 0.5825, 0.7000, 0.9500, 0.6025, 0.00], // F
       [0.35, 0.00, 0.35, 1.0, 0.6, 1.0, 0.5, 0.6, 0.3, 0.0, 0.3]]; // GK
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
