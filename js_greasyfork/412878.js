// ==UserScript==
// @name        TMVN Squad Value
// @version     7
// @description	Trophymanager: display value of player with infomations like: bank price, wage, routine, rerec, r5, asi. And save data for TMVN League Squad script (https://greasyfork.org/en/scripts/414474)
// @namespace   https://trophymanager.com
// @include     https://trophymanager.com/club/*/squad/
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/412878/TMVN%20Squad%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/412878/TMVN%20Squad%20Value.meta.js
// ==/UserScript==

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

const ASI_CLASS = {
    LEVEL_1: 500000,
    LEVEL_2: 400000,
    LEVEL_3: 300000,
    LEVEL_4: 200000,
    LEVEL_5: 100000,
    LEVEL_6: 50000,
    LEVEL_7: 0
};

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

function identifyRole(role) {
    try {
        var role1,
        role2,
        side;
        if (role.indexOf("/") != -1) { // "M/DM C"
            role = role.split(/\//);
            role1 = role[0]; // "M"
            role2 = role[1]; // "DM C"
            side = role[1].match(/\D$/); // "C"
            role2 = role2.replace(/\s/g, ""); // "DMC"
            role1 = role[0] + side; // "MC"
        } else if (role.indexOf(",") != -1) { // "F, OM C" || "M C, F"
            role = role.split(/,/);
            role1 = role[0].replace(/\s/g, ""); // "F" || "MC"
            role2 = role[1].replace(/\s/g, ""); // " OMC" || "F"
        } else if (role.indexOf(" ") != -1) { // "DM LC" || "D R"
            if (role.substring(role.indexOf(" ") + 1).length > 1) { // "DM LC"
                role = role.split(/\s/); // "DM" || "LC"
                role1 = role[0]; // "DM"
                side = role[1]; // "LC"
                role2 = role1 + side.substring(1); // "DMC"
                role1 = role1 + side.substring(0, 1); // "DML"
            } else { // D R
                role1 = role.replace(" ", "");
                role2 = -1;
            }
        } else if (role == "GK") {
            role1 = "GK";
            role2 = -1;
        } else if (role == "F") {
            role1 = "F";
            role2 = -1;
        }
        return [role1, role2];
    } catch (err) {
        console.log('exception identifyRole: ' + err);
        return [];
    }
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
    var STR = current_player_info.strength;
    var STA = current_player_info.stamina;
    var PAC = current_player_info.pace;
    var MAR = current_player_info.marking;
    var TAC = current_player_info.tackling;
    var WOR = current_player_info.workrate;
    var POS = current_player_info.positioning;
    var PAS = current_player_info.passing;
    var CRO = current_player_info.crossing;
    var TEC = current_player_info.technique;
    var HEA = current_player_info.heading;
    var FIN = current_player_info.finishing;
    var LON = current_player_info.longshots;
    var SET = current_player_info.setpieces;
    var HAN = current_player_info.handling;
    var ONE = current_player_info.oneonones;
    var REF = current_player_info.reflexes;
    var AER = current_player_info.arialability;
    var JUM = current_player_info.jumping;
    var COM = current_player_info.communication;
    var KIC = current_player_info.kicking;
    var THR = current_player_info.throwing;

    var ROLE = current_player_info.fp;
    var ROU = current_player_info.rutine;
    var ASI = current_player_info.asi;

    var ROLE1,
    ROLE2;
    var role = identifyRole(ROLE);
    if (role.length > 0) {
        ROLE1 = role[0];
        ROLE2 = role[1];
    } else
        return;

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

    return [rec, r5]
}

function collect() {
    var ret = {};
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
            }
        }
    }
    return ret;
}

var new_player_array = [];
var team_b_id = "";
var team_main_id = $('.box_sub_header a')[1].getAttribute('club_link'); //for find exactly b-team

$.ajaxSetup({
    async: false
});

$.post("/ajax/players_get_select.ajax.php", {
    "type": "change",
    "club_id": SUBPAGE
}, function (data) {

    data = JSON.parse(data);
    new_player_array = data.post;

});

function objectLength(obj) {
    var result = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            result++;
        }
    }
    return result;
}
$(".column2_a").width("626px");
$(".column3_a").width("160px");
$("#player_table tr:eq(0)")[0].children[5].remove();
$("#player_table tr:eq(0)").append('<th align="right">BP</th><th align="right">WA</th><th align="right">XP</th><th align="right">REC</th><th align="right">R5</th><th align="right">ASI</th>');
var count = 0;
var countU21 = 0;
var totalBankPrice = 0;
var totalBankPriceU21 = 0;
var totalWage = 0;
var totalWageU21 = 0;
var totalASI = 0;
var totalASIU21 = 0;
var totalXP = 0;
var totalXPU21 = 0;

$("#player_table tr > .text_fade > div").not(".text_fade_overlay").find("a[player_link]").each(function () {
    var player_link = $(this).attr("player_link");
    if (new_player_array[player_link] == null && team_b_id === "") {
        $.post("https://trophymanager.com/ajax/players_get_info.ajax.php", {
            "player_id": player_link,
            "type": "history",
            "show_non_pro_graphs": false
        }, function (data) {
            data = JSON.parse(data);
            try {
                let i = 0;
                do {
                    team_b_id = data.table.nat[i].klub_id;
                    i++;
                } while (team_b_id == "" || team_b_id == team_main_id);
            } catch (err) {
                team_b_id = "";
            }
        });

        if (team_b_id !== "") {
            $.post("/ajax/players_get_select.ajax.php", {
                "type": "change",
                "club_id": team_b_id
            }, function (data) {
                data = JSON.parse(data);
                new_player_array = collect(new_player_array, data.post);
            });
        }
    }

    var current_player_info = new_player_array[player_link];
    if (current_player_info == null)
        return;

    var parent_select = $(this).parent().parent().parent();
    parent_select.find("td:eq(2)").append("." + Number(current_player_info.month));
    parent_select[0].children[5].remove();

    let pow = Math.pow;
    let bp = 0;
    if (current_player_info.fp === "GK") {
        bp = (current_player_info.asi * 500 * pow((300 / (Number(current_player_info.age) * 12 + Number(current_player_info.month))), 2.5)) * 0.75;
    } else {
        bp = (current_player_info.asi * 500 * pow((300 / (Number(current_player_info.age) * 12 + Number(current_player_info.month))), 2.5));
    }

    if (bp >= BP_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else if (bp >= BP_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else if (bp >= BP_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else if (bp >= BP_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else if (bp >= BP_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else if (bp >= BP_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + (bp / 1000000).toFixed(1) + '</td>');
    }

    if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else if (Number(current_player_info.wage) >= WA_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + Math.round(current_player_info.wage / 1000) + '</td>');
    }

    if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + current_player_info.rutine + '</td>');
    } else if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + current_player_info.rutine + '</td>');
    } else if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + current_player_info.rutine + '</td>');
    } else if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + current_player_info.rutine + '</td>');
    } else if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + current_player_info.rutine + '</td>');
    } else if (Number(current_player_info.rutine) >= XP_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + current_player_info.rutine + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + current_player_info.rutine + '</td>');
    }

    var rrValue = calculateRR(current_player_info);
    var rec = rrValue[0];
    var recStr = '';
    var recMax;
    if (rec.length == 2) {
        recStr = rec[0] + '<br>' + rec[1];
        recMax = Number(rec[0]) >= Number(rec[1]) ? Number(rec[0]) : Number(rec[1]);
    } else {
        recStr = rec[0];
        recMax = Number(rec[0]);
    }
    if (recMax >= REC_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + recStr + '</td>');
    } else if (recMax >= REC_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + recStr + '</td>');
    } else if (recMax >= REC_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + recStr + '</td>');
    } else if (recMax >= REC_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + recStr + '</td>');
    } else if (recMax >= REC_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + recStr + '</td>');
    } else if (recMax >= REC_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + recStr + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + recStr + '</td>');
    }

    var r5 = rrValue[1];
    var r5Str = '';
    var r5Max;
    if (r5.length == 2) {
        r5Str = r5[0] + '<br>' + r5[1];
        r5Max = Number(r5[0]) >= Number(r5[1]) ? Number(r5[0]) : Number(r5[1]);
    } else {
        r5Str = r5[0];
        r5Max = Number(r5[0]);
    }
    if (r5Max >= R5_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + r5Str + '</td>');
    } else if (r5Max >= R5_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + r5Str + '</td>');
    } else if (r5Max >= R5_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + r5Str + '</td>');
    } else if (r5Max >= R5_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + r5Str + '</td>');
    } else if (r5Max >= R5_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + r5Str + '</td>');
    } else if (r5Max >= R5_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + r5Str + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + r5Str + '</td>');
    }

    if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_1) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_1 + ';">' + current_player_info.asi + '</td>');
    } else if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_2) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_2 + ';">' + current_player_info.asi + '</td>');
    } else if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_3) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_3 + ';">' + current_player_info.asi + '</td>');
    } else if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_4) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_4 + ';">' + current_player_info.asi + '</td>');
    } else if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_5) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_5 + ';">' + current_player_info.asi + '</td>');
    } else if (Number(current_player_info.asi) >= ASI_CLASS.LEVEL_6) {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_6 + ';">' + current_player_info.asi + '</td>');
    } else {
        parent_select.append('<td align="right" style="color: ' + APP_COLOR.LEVEL_7 + ';">' + current_player_info.asi + '</td>');
    }

    if (Number(current_player_info.age) > 21) {
        count++;
    } else {
        countU21++;
    }
    if (Number(current_player_info.age) > 21) {
        totalBankPrice += bp;
    } else {
        totalBankPriceU21 += bp;
    }
    if (Number(current_player_info.age) > 21) {
        totalWage += Number(current_player_info.wage);
    } else {
        totalWageU21 += Number(current_player_info.wage);
    }
    if (Number(current_player_info.age) > 21) {
        totalASI += current_player_info.asi;
    } else {
        totalASIU21 += current_player_info.asi;
    }
    if (Number(current_player_info.age) > 21) {
        totalXP += Number(current_player_info.rutine);
    } else {
        totalXPU21 += Number(current_player_info.rutine);
    }
});

var clubId = $('.box_sub_header a')[1].getAttribute('club_link');
if (clubId) {
    localStorage.setItem(clubId + "_SQUAD_VALUE", JSON.stringify({
            "Time": new Date(),
            "BP": (totalBankPrice + totalBankPriceU21),
            "Wage": (totalWage + totalWageU21),
            "Count": (count + countU21)
        }));
    localStorage.setItem(clubId + "_U21_SQUAD_VALUE", JSON.stringify({
            "Time": new Date(),
            "BP": (totalBankPriceU21),
            "Wage": (totalWageU21),
            "Count": (countU21)
        }));
    localStorage.setItem(clubId + "_O21_SQUAD_VALUE", JSON.stringify({
            "Time": new Date(),
            "BP": (totalBankPrice),
            "Wage": (totalWage),
            "Count": (count)
        }));
}

$('div.column3_a')[0].childNodes[3].childNodes[3].childNodes[2].childNodes[1].innerHTML +=
'<br>' +
'Total Bank Price: <br><span style="color:Orange;">' + totalBankPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Total Wage: <br><span style="color:Orange;">' + totalWage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'<br>' +
'Average Bank Price: <br><span style="color:Orange;">' + (totalBankPrice / (count > 0 ? count : 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Average Wage: <br><span style="color:Orange;">' + Math.round(totalWage / (count > 0 ? count : 1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>';

$('div.column3_a')[0].childNodes[3].childNodes[3].childNodes[6].childNodes[1].innerHTML +=
'<br>' +
'Total Bank Price: <br><span style="color:Orange;">' + totalBankPriceU21.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Total Wage: <br><span style="color:Orange;">' + totalWageU21.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'<br>' +
'Average Bank Price: <br><span style="color:Orange;">' + (totalBankPriceU21 / (countU21 > 0 ? countU21 : 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Average Wage: <br><span style="color:Orange;">' + Math.round(totalWageU21 / (countU21 > 0 ? countU21 : 1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>';

$('div.column3_a .box_body')[0].innerHTML +=
'<h3>FULL SQUAD</h3>' +
'<div class="std"><p>' +
'Squad size: <br><span style="color:Orange;">' + (count + countU21) + '</span><br>' +
'Total Bank Price: <br><span style="color:Orange;">' + (totalBankPrice + totalBankPriceU21).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Total Wage: <br><span style="color:Orange;">' + (totalWage + totalWageU21).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'<br>' +
'Average Bank Price: <br><span style="color:Orange;">' + ((totalBankPrice + totalBankPriceU21) / ((count + countU21) > 0 ? (count + countU21) : 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'Average Wage: <br><span style="color:Orange;">' + Math.round((totalWage + totalWageU21) / ((count + countU21) > 0 ? (count + countU21) : 1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span><br>' +
'</p></div>';

$.ajaxSetup({
    async: true
});
