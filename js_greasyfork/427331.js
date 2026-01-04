// ==UserScript==
// @name         TMVN Players Train
// @namespace    https://trophymanager.com
// @version      10
// @description  Trophymanager: color skills by training type, synthesize scout information, calculate skill peak, r5, rerec... If you have B-Team, please bookmark & open url https://trophymanager.com/players/#/a/true/b/true/ to see all players in team.
// @match        https://trophymanager.com/players/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427331/TMVN%20Players%20Train.user.js
// @updateURL https://update.greasyfork.org/scripts/427331/TMVN%20Players%20Train.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    const BUTTON_ID = {
        SCOUT: 'tmvn_player_train_script_scout_button',
        PEAK: 'tmvn_player_train_script_peak_button',
        RELIABLE: 'tmvn_player_train_script_reliable_button',
        SKILL: 'tmvn_player_train_script_skill_button'
    };
    const SKILL_PANEL_ID = 'sq';
    const ADDITION_PANEL_ID_PREFIX = 'tmvn_script_player_addition_panel'; //for get all addition panel in page (not only this script)
    const ADDITION_PANEL_ID = {
        SCOUT: 'tmvn_script_player_addition_panel_scout',
        PEAK: 'tmvn_script_player_addition_panel_peak',
        RELIABLE: 'tmvn_script_player_addition_panel_reliable'
    }

    const TRAIN_DOT_COLOR = ['white', 'aqua', 'yellow', 'orange', 'black']; //increasing from light to dark
    const TRAIN_DRILL_COLOR = 'blue';
    const TRAIN_DRILL = {
        TECHNICAL: 'Tech',
        FITNESS: 'Fit',
        TACTICAL: 'Tac',
        FINISHING: 'Fin',
        DEFENDING: 'Def',
        WINGER: 'Wing',
        GOALKEEPING: 'Goal'
    };
    const TRAIN_DRILL_POINT = 100;
    const SKILL_COLUMN_INDEX = {
        STR: 4,
        STA: 5,
        PAC: 6,
        MAR: 7,
        TAC: 8,
        WOR: 9,
        POS: 10,
        PAS: 11,
        CRO: 12,
        TEC: 13,
        HEA: 14,
        FIN: 15,
        LON: 16,
        SET: 17
    }
    const SCOUT_RELIABLE_SKILL = {
        SENIORS: 19,
        YOUTHS: 19,
        DEVELOPMENT: 19,
        PHYSICAL: 19,
        TACTICAL: 19,
        TECHNICAL: 19,
        PSYCHOLOGY: 19
    };
    const PEAK_PHYSICAL_TEXT = {
        SPLENDID: ' - Splendid (4/4) physique',
        GOOD: ' - Good (3/4) physique',
        OK: ' - Ok (2/4) physique',
        WEAK: ' - Somewhat weak (1/4) physique'
    }
    const PEAK_PHYSICAL_LEVEL = {
        SPLENDID: 4,
        GOOD: 3,
        OK: 2,
        WEAK: 1
    }
    const PEAK_TACTICAL_TEXT = {
        SPLENDID: ' - Splendid (4/4) tactical ability',
        GOOD: ' - Good (3/4) tactical ability',
        OK: ' - Ok (2/4) tactical ability',
        POOR: ' - Poor (1/4) tactical ability'
    }
    const PEAK_TACTICAL_LEVEL = {
        SPLENDID: 4,
        GOOD: 3,
        OK: 2,
        POOR: 1
    }
    const PEAK_TECHNICAL_TEXT = {
        SPLENDID: ' - Splendid (4/4) technical ability',
        GOOD: ' - Good (3/4) technical ability',
        OK: ' - Ok (2/4) technical ability',
        POOR: ' - Poor (1/4) technical ability'
    }
    const PEAK_TECHNICAL_LEVEL = {
        SPLENDID: 4,
        GOOD: 3,
        OK: 2,
        POOR: 1
    }

    const OUTFIELD_PEAK_PHYSICAL_SKILL_SUM = [64, 70, 74, 80];
    const OUTFIELD_PEAK_TACTICAL_SKILL_SUM = [64, 70, 74, 80];
    const OUTFIELD_PEAK_TECHNICAL_SKILL_SUM = [96, 105, 111, 120];
    const GK_PEAK_PHYSICAL_SKILL_SUM = [64, 70, 74, 80];
    const GK_PEAK_TACTICAL_SKILL_SUM = [50, 55, 60];
    const GK_PEAK_TECHNICAL_SKILL_SUM = [68, 74, 80];

    const OUTFIELD_SPECIALITY = ['', 'Strength', 'Stamina', 'Pace', 'Marking', 'Tackling', 'Workrate', 'Positioning', 'Passing', 'Crossing', 'Technique', 'Heading', 'Finishing', 'Longshots', 'SetPieces'];
    const OUTFIELD_SPECIALITY_PHYSICAL_INDEX = [1, 2, 3, 11];
    const OUTFIELD_SPECIALITY_TACTICAL_INDEX = [4, 5, 6, 7];
    const OUTFIELD_SPECIALITY_TECHNICAL_INDEX = [8, 9, 10, 12, 13, 14];

    const GK_SPECIALITY = ['', 'Strength', 'Stamina', 'Pace', 'Handling', 'OneOnOnes', 'Reflexes', 'AerialAbility', 'Jumping', 'Communication', 'Kicking', 'Throwing'];
    const GK_SPECIALITY_PHYSICAL_INDEX = [1, 2, 3, 8];
    const GK_SPECIALITY_TACTICAL_INDEX = [5, 7, 9];
    const GK_SPECIALITY_TECHNICAL_INDEX = [4, 6, 10, 11];

    const SCOUT_TABLE_BODY_ID = 'tmvn_script_scout_table_body';
    const PEAK_TABLE_BODY_ID = 'tmvn_script_peak_table_body';

    const LOCAL_STORAGE_KEY_VALUE = 'TMVN_SCRIPT_PLAYER_TRAIN_RELIABLE_INFO';
    const GK_POSITION_TO_CHECK = 'Gk';

    const SCOUT_LEVEL_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];
    const PERCENT_PEAK_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];

    const SCOUT_TABLE_TITLE = {
        PHYSICAL: 'Physical scout: 4 level, higher is better',
        TACTICAL: 'Tactical scout: 4 level, higher is better',
        TECHNICAL: 'Technique scout: 4 level, higher is better',
        LEADERSHIP: 'Leadership scout: 20 point, higher is better',
        PROFESSIONALISM: 'Professionalism scout: 20 point, higher is better',
        AGGRESSION: 'Aggression scout: 20 point, smaller is better',
        LWS: 'Last week scout',
        LAS: 'Last age scout',
        TI: 'TI'
    }
    const PEAK_TABLE_TITLE = {
        PHYSICAL_SUM: 'Outfield: Strength, Stamina, Pace, Heading\nGK: Strength, Stamina, Pace, Jumping',
        TACTICAL_SUM: 'Outfield: Marking, Tackling, Positioning, Workrate\nGK: One On Ones, Aerial Ability, Communication',
        TECHNICAL_SUM: 'Outfield: Passing, Crossing, Technique, Finishing, Longshots, Set Pieces\nGK: Handling, Reflexes, Kicking, Throwing',

        CUSTOM_TRAIN_TYPE: 'Team 1: Strength, Workrate, Stamina\nTeam 2: Marking, Tackling\nTeam 3: Crossing, Pace\nTeam 4: Passing, Technique, Set Pieces\nTeam 5: Heading, Positioning\nTeam 6: Finishing, Longshots',
        NORMAL_TRAIN_TYPE_TECHNICAL: 'Technical Drills: Technique, Passing, Set Pieces',
        NORMAL_TRAIN_TYPE_FITNESS: 'Fitness Drills: Strength, Stamina, Pace, Workrate',
        NORMAL_TRAIN_TYPE_TACTICAL: 'Tactical Drills: Workrate, Positioning, Passing',
        NORMAL_TRAIN_TYPE_FINISHING: 'Finishing Drills: Finish, Long shot, Heading',
        NORMAL_TRAIN_TYPE_DEFENDING: 'Defending Drills: Marking, Tackling, Positioning, Heading',
        NORMAL_TRAIN_TYPE_WINGER: 'Winger Drills: Crossing, Pace, Technique',

        PHYSICAL_PEAK: 'Maximum physical skill sum can reach',
        TACTICAL_PEAK: 'Maximum tactical skill sum can reach',
        TECHNICAL_PEAK: 'Maximum technical skill sum can reach'
    }

    const BLOOM_STATUS_TEXT = {
        IN_LATE_BLOOM: 'In his late bloom',
        IN_MIDDLE_BLOOM: 'In the middle of his bloom',
        IN_START_BLOOM: 'Starting to bloom',
        NOT_YET_LATE_BLOOMER: 'Not bloomed - Late bloomer',
        NOT_YET_NORMAL_BLOOMER: 'Not bloomed: Normal bloomer',
        NOT_YET_EARLY_BLOOMER: 'Not bloomed: Early bloomer',
        BLOOMED: 'Bloomed'
    }
    const BLOOM_STATUS_COLOR = {
        IN_LATE_BLOOM: 'Darkred',
        IN_MIDDLE_BLOOM: 'Black',
        IN_START_BLOOM: 'Orange',
        NOT_YET_BLOOM: 'Yellow',
        NOT_YET_LATE_BLOOMER: 'Blue',
        NOT_YET_NORMAL_BLOOMER: 'Aqua',
        NOT_YET_EARLY_BLOOMER: 'White',
        BLOOMED: 'Darkgray'
    }

    const DEVELOPMENT_STATUS_TEXT = {
        MOSTLY_AHEAD: 'Mostly ahead',
        MIDDLE: 'Middle',
        MOSTLY_DONE: 'Mostly done',
        DONE: 'Done'
    }
    const DEVELOPMENT_STATUS_COLOR = {
        MOSTLY_AHEAD: 'Darkred',
        MIDDLE: 'Black',
        MOSTLY_DONE: 'Yellow',
        DONE: 'Darkgray'
    }

    const TI_CLASS = {
        LEVEL_1: 25,
        LEVEL_2: 20,
        LEVEL_3: 15,
        LEVEL_4: 10,
        LEVEL_5: 5,
        LEVEL_6: 0,
        LEVEL_7: -10
    };
    const APP_COLOR = {
        LEVEL_1: "Darkred",
        LEVEL_2: "Black",
        LEVEL_3: "Orange",
        LEVEL_4: "Yellow",
        LEVEL_5: "Blue",
        LEVEL_6: "Aqua",
        LEVEL_7: "White"
    };

    var finishScan = false;

    var playerIdArr = [];
    var playerMap = new Map();

    var trainMap = new Map();
    var reportMap = new Map();

    var scoutMap = new Map();
    var avaiableScoutCount = 0;
    var totalPlayer = Number($('#player_count')[0].innerText.split(' ')[0]);

    //first, replace all star img for easy color and calculate
    $('img[src$="/pics/star_silver.png"]').replaceWith('19');
    $('img[src$="/pics/star.png"]').replaceWith('20');

    updateReliableSkillScount(); //update before query scout data
    $.ajaxSetup({
        async: false
    });
    getPlayerOfClub(SESSION["main_id"]);
    if (SESSION["b_team"] != undefined && SESSION["b_team"] != '') {
        getPlayerOfClub(SESSION["b_team"]);
    }
    $.ajaxSetup({
        async: true
    });
    getPlayerData();
    var myInterval = setInterval(loopCheck, 1000);

    function getPlayerOfClub(clubId) {
        $.post("/ajax/players_get_select.ajax.php", {
            "type": "change",
            "club_id": clubId
        }, function (data) {

            let squad = JSON.parse(data).post;
            Object.keys(squad).forEach(function (key, index) {
                let playerData = squad[key];
                let player = {};
                player.Id = key;

                let skill = {};
                let skillSum = {};
                if (playerData.fp != 'GK') {
                    skill.Strength = playerData.strength;
                    skill.Passing = playerData.passing;
                    skill.Stamina = playerData.stamina;
                    skill.Crossing = playerData.crossing;
                    skill.Pace = playerData.pace;
                    skill.Technique = playerData.technique;
                    skill.Marking = playerData.marking;
                    skill.Heading = playerData.heading;
                    skill.Tackling = playerData.tackling;
                    skill.Finishing = playerData.finishing;
                    skill.Workrate = playerData.workrate;
                    skill.Longshots = playerData.longshots;
                    skill.Positioning = playerData.positioning;
                    skill.SetPieces = playerData.setpieces;

                    skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Heading;
                    skillSum.Tac = skill.Marking + skill.Tackling + skill.Positioning + skill.Workrate;
                    skillSum.Tec = skill.Passing + skill.Crossing + skill.Technique + skill.Finishing + skill.Longshots + skill.SetPieces;
                    skillSum.PhyMax = 80;
                    skillSum.TacMax = 80;
                    skillSum.TecMax = 120;
                } else {
                    skill.Strength = playerData.strength;
                    skill.Handling = playerData.handling;
                    skill.Stamina = playerData.stamina;
                    skill.OneOnOnes = playerData.oneonones;
                    skill.Pace = playerData.pace;
                    skill.Reflexes = playerData.reflexes;
                    skill.AerialAbility = playerData.arialability;
                    skill.Jumping = playerData.jumping;
                    skill.Communication = playerData.communication;
                    skill.Kicking = playerData.kicking;
                    skill.Throwing = playerData.throwing;

                    skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Jumping;
                    skillSum.Tac = skill.OneOnOnes + skill.AerialAbility + skill.Communication;
                    skillSum.Tec = skill.Handling + skill.Reflexes + skill.Kicking + skill.Throwing;
                    skillSum.PhyMax = 80;
                    skillSum.TacMax = 60;
                    skillSum.TecMax = 80;
                }
                skillSum.PhyRatio = skillSum.Phy / skillSum.PhyMax;
                skillSum.TacRatio = skillSum.Tac / skillSum.TacMax;
                skillSum.TecRatio = skillSum.Tec / skillSum.TecMax;

                player.SkillSum = skillSum;
                player.Skill = skill;
                player.Asi = playerData.asi;

                player.Routine = Number(playerData.rutine); //for calculate RR
                player.Fp = playerData.fp; //for calculate RR
                let rrValue = calculateRR(player);
                let rec = rrValue[0];
                if (rec.length == 2) {
                    player.Rec = Number(rec[0]) >= Number(rec[1]) ? Number(rec[0]) : Number(rec[1]);
                } else {
                    player.Rec = Number(rec[0]);
                }
                let r5 = rrValue[1];
                if (r5.length == 2) {
                    player.R5 = Number(r5[0]) >= Number(r5[1]) ? Number(r5[0]) : Number(r5[1]);
                } else {
                    player.R5 = Number(r5[0]);
                }

                playerMap.set(key, player);

                let trainText = "";
                if (playerData.training_custom != '') {
                    trainText = playerData.training_custom;
                } else {
                    switch (playerData.training) {
                    case "1":
                        trainText = TRAIN_DRILL.TECHNICAL;
                        break;
                    case "2":
                        trainText = TRAIN_DRILL.FITNESS;
                        break;
                    case "3":
                        trainText = TRAIN_DRILL.TACTICAL;
                        break;
                    case "4":
                        trainText = TRAIN_DRILL.FINISHING;
                        break;
                    case "5":
                        trainText = TRAIN_DRILL.DEFENDING;
                        break;
                    case "6":
                        trainText = TRAIN_DRILL.WINGER;
                        break;
                    case "7":
                        trainText = TRAIN_DRILL.GOALKEEPING;
                        break;
                    default:
                        trainText = '';
                    }
                }
                let point = calculatePoint(trainText);
                trainMap.set(key, {
                    TrainText: trainText,
                    Point: point
                });

            });
        });
    }

    function getPlayerData() {
        let trArr = $('table.hover.zebra tbody tr');
        for (let i = 0; i < trArr.length; i++) {
            try {
                let tr = trArr[i];
                if (tr.className.indexOf("header") >= 0) {
                    continue;
                } else if (tr.children[0].className.indexOf("splitter") >= 0) {
                    continue;
                }

                let onclickNumberPlayer = tr.children[0].children[0].attributes[1].textContent; //example: pop_player_number(131171905,37,"Davide Quilici",0)
                let playerId = onclickNumberPlayer.substr(18, onclickNumberPlayer.indexOf(',') - 18);
                let player = playerMap.get(playerId);

                player.Id = playerId;
                player.Number = tr.children[0].children[0].textContent;
                player.Name = tr.children[1].children[0].children[1].innerText;
                player.Age = tr.children[2].innerText;
                player.Position = tr.children[3].children[0].children[0].innerText;
                try {
                    if (!isNaN(tr.children[18].innerText)) {
                        player.Ti = Number(tr.children[18].innerText); //available if has proday
                    }
                } catch (e) {}

                playerIdArr.push(playerId);

                getScoutInfo(playerId, player.Age, player.Position);
            } catch (err) {}
        }
        finishScan = true;
    }

    function loopCheck() {
        //console.log('playerIdArr.length:' + playerIdArr.length);
        //console.log('reportMap.size:' + reportMap.size);
        if (finishScan && playerIdArr.length == reportMap.size && playerIdArr.length == totalPlayer) {
            clearInterval(myInterval);

            let skillBtn = document.createElement('span');
            skillBtn.id = BUTTON_ID.SKILL;
            skillBtn.className = 'button';
            skillBtn.style = 'margin-left: 3px;';
            skillBtn.innerHTML = '<span class="button_border">Skill</span>';

            if ($('#' + BUTTON_ID.SKILL).length == 0) { //other scritps can have same button
                $('div.std')[0].parentNode.insertBefore(skillBtn, $('div.std')[0]);
                document.getElementById(BUTTON_ID.SKILL).addEventListener('click', (e) => {
                    showSkillPanel();
                });
            }

            let scoutBtn = document.createElement('span');
            scoutBtn.id = BUTTON_ID.SCOUT;
            scoutBtn.className = 'button';
            scoutBtn.style = 'margin-left: 3px;';
            scoutBtn.innerHTML = '<span class="button_border">Scout [' + avaiableScoutCount + ']</span>';
            $('div.std')[0].parentNode.insertBefore(scoutBtn, $('div.std')[0]);

            let peakBtn = document.createElement('span');
            peakBtn.id = BUTTON_ID.PEAK;
            peakBtn.className = 'button';
            peakBtn.style = 'margin-left: 3px;';
            peakBtn.innerHTML = '<span class="button_border">Peak</span>';
            $('div.std')[0].parentNode.insertBefore(peakBtn, $('div.std')[0]);

            let reliableBtn = document.createElement('span');
            reliableBtn.id = BUTTON_ID.RELIABLE;
            reliableBtn.className = 'button';
            reliableBtn.style = 'margin-left: 3px;';
            reliableBtn.innerHTML = '<span class="button_border">Reliable</span>';
            $('div.std')[0].parentNode.insertBefore(reliableBtn, $('div.std')[0]);

            document.getElementById(BUTTON_ID.SCOUT).addEventListener('click', (e) => {
                showAdditionPanel(ADDITION_PANEL_ID.SCOUT);
            });
            document.getElementById(BUTTON_ID.PEAK).addEventListener('click', (e) => {
                showAdditionPanel(ADDITION_PANEL_ID.PEAK);
            });
            document.getElementById(BUTTON_ID.RELIABLE).addEventListener('click', (e) => {
                showAdditionPanel(ADDITION_PANEL_ID.RELIABLE);
            });

            addNewStyle('.position {width:85px !important;}');

            modifySkillPanel();
            presentScoutPanel();
            presentPeakPanel();
            presentReliablePanel();
        }
    }

    function showAdditionPanel(panelId) {
        hideSkillPanel(true);
        let panels = $('[id^=' + ADDITION_PANEL_ID_PREFIX + ']');
        for (let i = 0; i < panels.length; i++) {
            panels[i].style.display = 'none';
        }
        $('#' + panelId)[0].style.display = '';
    }

    function showSkillPanel() {
        let panels = $('[id^=' + ADDITION_PANEL_ID_PREFIX + ']');
        for (let i = 0; i < panels.length; i++) {
            panels[i].style.display = 'none';
        }
        hideSkillPanel(false);
    }

    function hideSkillPanel(hide = true) {
        if (hide) {
            $('#' + SKILL_PANEL_ID)[0].parentNode.style.display = 'none';
        } else {
            $('#' + SKILL_PANEL_ID)[0].parentNode.style.display = '';
        }
    }

    function getSkill(element) {
        let result = 0;
        try {
            if (element.childElementCount == 0) {
                result = Number(element.innerText);
            } else {
                let img = element.children[0].attributes[0].textContent;
                if (img.indexOf('star_silver.png') >= 0) {
                    result = 19;
                } else {
                    result = 20;
                }
            }
        } catch (err) {
            result = 0;
            console.log('Exception getSkill function: ' + err);
        }
        return result;
    }

    function getScoutInfo(playerId, age, position) {
        $.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
            "type": "scout",
            "player_id": playerId
        }, function (response) {
            let data = JSON.parse(response);
            getScout(data);
            let reportObj = {};
            if (data.reports != undefined && data.reports.length > 0) {
                //array order by date desc
                for (let i = data.reports.length - 1; i >= 0; i--) {
                    let report = data.reports[i];
                    if (report.scoutid == '0' && report.scout_name == 'YD') {
                        reportObj.YouthDevelopment = report.old_pot;
                        reportObj.BornAge = Number(report.report_age);
                        continue; //with YD only get potential
                    } else if (!scoutMap.has(report.scoutid)) {
                        continue; //scout was not found, so the data is not reliable
                    }

                    let scout = scoutMap.get(report.scoutid);

                    if (reportObj.LastScoutDate == undefined || reportObj.LastScoutDate < new Date(report.done)) {
                        reportObj.LastScoutDate = new Date(report.done);
                    }

                    reportObj.LastAgeScout = Number(report.report_age);
                    reportObj.LastWeekScout = Math.floor((new Date() - new Date(report.done)) / 3600000 / 24 / 7);

                    if ((Number(scout.youths) >= SCOUT_RELIABLE_SKILL.YOUTHS && Number(scout.development) >= SCOUT_RELIABLE_SKILL.DEVELOPMENT && Number(report.report_age) < 20) ||
                        (Number(scout.seniors) >= SCOUT_RELIABLE_SKILL.SENIORS && Number(scout.development) >= SCOUT_RELIABLE_SKILL.DEVELOPMENT && Number(report.report_age) >= 20)) {
                        //update the POT only if the new value is greater than the old value because we want to know how old is the player when he reached the biggest POT
                        if (reportObj.Potential == undefined || reportObj.Potential < report.old_pot) {
                            reportObj.Potential = report.old_pot;
                            reportObj.PotentialAge = Number(report.report_age);
                            reportObj.Rec = report.potential / 2;
                        }
                    }

                    if (Number(scout.development) >= SCOUT_RELIABLE_SKILL.DEVELOPMENT) {
                        let startBloomAge = calculateBloomAge(report);

                        if (report.bloom_status_txt == BLOOM_STATUS_TEXT.BLOOMED || (startBloomAge != null && (startBloomAge + 2 < Math.floor(age)))) {
                            reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
                        } else if (startBloomAge != null) {
                            let processBloomAge = startBloomAge + ' - ' + (startBloomAge + 2);
                            if (startBloomAge == Math.floor(age)) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_START_BLOOM + '">' + processBloomAge + '</span>';
                            } else if (startBloomAge + 1 == Math.floor(age)) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_MIDDLE_BLOOM + '">' + processBloomAge + '</span>';
                            } else if (startBloomAge + 2 == Math.floor(age)) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_LATE_BLOOM + '">' + processBloomAge + '</span>';
                            } else {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_BLOOM + '">' + processBloomAge + '</span>';
                            }
                        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER) {
                            reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">' + '20/22-22/24' + '</span>';
                        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER) {
                            reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_NORMAL_BLOOMER + '">' + '18/19-20/21' + '</span>';
                        } else {
                            reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_EARLY_BLOOMER + '">' + '16/17-18/19' + '</span>';
                        }

                        if (report.dev_status == DEVELOPMENT_STATUS_TEXT.DONE) {
                            reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.DONE + '">' + report.dev_status + '</span>';
                        } else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_DONE) {
                            reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_DONE + '">' + report.dev_status + '</span>';
                        } else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MIDDLE) {
                            reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MIDDLE + '">' + report.dev_status + '</span>';
                        } else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_AHEAD) {
                            reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_AHEAD + '">' + report.dev_status + '</span>';
                        } else {
                            reportObj.DevStatus = '<span>' + report.dev_status + '</span>';
                        }
                    }

                    if (Number(scout.physical) >= SCOUT_RELIABLE_SKILL.PHYSICAL) {
                        if (position != GK_POSITION_TO_CHECK) {
                            if (OUTFIELD_SPECIALITY_PHYSICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
                            }
                        } else {
                            if (GK_SPECIALITY_PHYSICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
                            }
                        }

                        switch (report.peak_phy_txt) {
                        case PEAK_PHYSICAL_TEXT.SPLENDID:
                            reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.SPLENDID;
                            break;
                        case PEAK_PHYSICAL_TEXT.GOOD:
                            reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.GOOD;
                            break;
                        case PEAK_PHYSICAL_TEXT.OK:
                            reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.OK;
                            break;
                        case PEAK_PHYSICAL_TEXT.WEAK:
                            reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.WEAK;
                            break;
                        }
                    }
                    if (Number(scout.tactical) >= SCOUT_RELIABLE_SKILL.TACTICAL) {
                        if (position != GK_POSITION_TO_CHECK) {
                            if (OUTFIELD_SPECIALITY_TACTICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
                            }
                        } else {
                            if (GK_SPECIALITY_TACTICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
                            }
                        }

                        switch (report.peak_tac_txt) {
                        case PEAK_TACTICAL_TEXT.SPLENDID:
                            reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.SPLENDID;
                            break;
                        case PEAK_TACTICAL_TEXT.GOOD:
                            reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.GOOD;
                            break;
                        case PEAK_TACTICAL_TEXT.OK:
                            reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.OK;
                            break;
                        case PEAK_TACTICAL_TEXT.POOR:
                            reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.POOR;
                            break;
                        }
                    }
                    if (Number(scout.technical) >= SCOUT_RELIABLE_SKILL.TECHNICAL) {
                        if (position != GK_POSITION_TO_CHECK) {
                            if (OUTFIELD_SPECIALITY_TECHNICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
                            }
                        } else {
                            if (GK_SPECIALITY_TECHNICAL_INDEX.includes(Number(report.specialist))) {
                                reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
                            }
                        }

                        switch (report.peak_tec_txt) {
                        case PEAK_TECHNICAL_TEXT.SPLENDID:
                            reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.SPLENDID;
                            break;
                        case PEAK_TECHNICAL_TEXT.GOOD:
                            reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.GOOD;
                            break;
                        case PEAK_TECHNICAL_TEXT.OK:
                            reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.OK;
                            break;
                        case PEAK_TECHNICAL_TEXT.POOR:
                            reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.POOR;
                            break;
                        }
                    }
                    if (Number(scout.psychology) >= SCOUT_RELIABLE_SKILL.PSYCHOLOGY) {
                        reportObj.Leadership = report.charisma;
                        reportObj.Profession = report.professionalism;
                        reportObj.Aggression = report.aggression;
                    }
                }
            }
            reportMap.set(playerId, reportObj);
        });
    }

    function calculateBloomAge(report) {
        let startBloomAge = null;
        if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_LATE_BLOOM) {
            startBloomAge = Number(report.report_age) - 2;
        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_MIDDLE_BLOOM) {
            startBloomAge = Number(report.report_age) - 1;
        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_START_BLOOM) {
            startBloomAge = Number(report.report_age);
        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER && Number(report.report_age) == 21) {
            startBloomAge = 22;
        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER && Number(report.report_age) == 18) {
            startBloomAge = 19;
        } else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_EARLY_BLOOMER && Number(report.report_age) == 16) {
            startBloomAge = 17;
        }
        return startBloomAge;
    }

    function getScout(data) {
        try {
            if (scoutMap.size > 0)
                return; //because all response return same scout data
            for (let propt in data.scouts) {
                let scout = data.scouts[propt];
                scoutMap.set(scout.id, scout);
                let lastActionDate = new Date(scout.last_action);
                lastActionDate.setHours(0);
                lastActionDate.setDate(lastActionDate.getDate() + 2);
                let today = convertTZ(new Date(), "Europe/Copenhagen"); //change to TM time
                if (today >= lastActionDate) {
                    avaiableScoutCount++;
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    function convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
                timeZone: tzString
            }));
    }

    /*
    custom train = abcdef
    dot = xyzt
    x = 10 y = 7 z = 6 t = 2
     */
    function calculatePoint(trainText) {
        let result = TRAIN_DRILL_POINT;
        if (trainText.length == 6) {
            let sum = 0;
            for (let i = 0; i < trainText.length; i++) {
                let value = Number(trainText.charAt(i));
                if (value == 4) {
                    sum += 25;
                } else if (value == 3) {
                    sum += 23;
                } else if (value == 2) {
                    sum += 17;
                } else if (value == 1) {
                    sum += 10;
                }
            }
            result = sum;
        }
        return result;
    }

    function presentScoutPanel() {
        let scoutDiv = document.createElement('div');
        scoutDiv.id = ADDITION_PANEL_ID.SCOUT;
        scoutDiv.className = 'std';
        scoutDiv.style.display = 'none';
        scoutDiv.innerHTML +=
        '<div>' +
        '<table class="hover zebra" cellspacing="0" cellpadding="0">' +
        '<tbody id="' + SCOUT_TABLE_BODY_ID + '">' +
        '<tr class="header">' +
        '<th title="Number">#</th>' +
        '<th title="">Name</th>' +
        '<th title="">Age</th>' +
        '<th title="Favorite position">Fp</th>' +
        '<th title="Youth Development estimate potential. Only reliable with high level YD.">Yd</th>' +
        '<th title="Recommendation">Rec</th>' +
        '<th title="Potential">Pot</th>' +
        '<th title="Darkred mean in late bloom\nBlack mean in middle bloom\nOrange mean in start bloom\nYellow mean prepare bloom\nBlue mean late bloomer\nAqua mean normal bloomer\nWhite mean early bloomer">Bloom</th>' +
        '<th title="">Development</th>' +
        '<th title="">Specialty</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.PHYSICAL + '">Phy</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.TACTICAL + '">Tac</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.TECHNICAL + '">Tec</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.LEADERSHIP + '">Lea</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.PROFESSIONALISM + '">Pro</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.AGGRESSION + '">Agg</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.LWS + '">LWS</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.LAS + '">LAS</th>' +
        '<th title="TI is only available if you have proday">TI</th>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
        $('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(scoutDiv);
        for (let i = 0; i < playerIdArr.length; i++) {
            appendScoutTableRow(playerIdArr[i], i);
        }
    }

    function appendScoutTableRow(playerId, rowCount) {
        let player = playerMap.get(playerId);
        let report = reportMap.get(playerId);

        let tbody = $('#' + SCOUT_TABLE_BODY_ID)[0];
        let tr = document.createElement('tr');
        if ((rowCount % 2) == 1) {
            tr.className = 'odd';
        }

        let tdNumber = document.createElement('td');
        tdNumber.className = 'border minishirt small';
        tdNumber.innerText = player.Number;

        let tdName = document.createElement('td');
        tdName.className = 'left name text_fade';
        tdName.innerHTML =
            '<div class="name"> <a href="/players/' + player.Id + '/" player_link="' + player.Id + '" class="normal">' + player.Name + '</a></div>';

        let tdAge = document.createElement('td');
        tdAge.innerText = player.Age;

        let tdFp = document.createElement('td');
        tdFp.className = 'border favposition short';
        tdFp.innerText = player.Position;

        let tdYouthDevelopment = document.createElement('td');
        tdYouthDevelopment.className = 'border';
        colorTd(tdYouthDevelopment, 'Potential', report.YouthDevelopment);
        tdYouthDevelopment.innerText = report.YouthDevelopment == undefined ? '' : (report.YouthDevelopment + '[' + report.BornAge + ']');

        let tdRec = document.createElement('td');
        colorTd(tdRec, 'Rec', report.Rec);
        tdRec.innerText = report.Rec == undefined ? '' : report.Rec.toFixed(1);

        let tdPotential = document.createElement('td');
        tdPotential.className = 'border';
        colorTd(tdPotential, 'Potential', report.Potential);
        tdPotential.innerText = report.Potential == undefined ? '' : (report.Potential + '[' + report.PotentialAge + ']');

        let tdBloomStatus = document.createElement('td');
        tdBloomStatus.innerHTML = report.BloomStatus == undefined ? '' : report.BloomStatus;

        let tdDevStatus = document.createElement('td');
        tdDevStatus.className = 'border';
        tdDevStatus.innerHTML = report.DevStatus == undefined ? '' : report.DevStatus;

        let tdSpecialty = document.createElement('td');
        tdSpecialty.className = 'border';
        tdSpecialty.innerText = report.Specialty == undefined ? '' : report.Specialty;

        let tdPeakPhysical = document.createElement('td');
        tdPeakPhysical.title = SCOUT_TABLE_TITLE.PHYSICAL;
        colorTd(tdPeakPhysical, 'PeakPhysical', report.PeakPhysical);
        tdPeakPhysical.innerText = report.PeakPhysical == undefined ? '' : report.PeakPhysical;

        let tdPeakTactical = document.createElement('td');
        tdPeakTactical.title = SCOUT_TABLE_TITLE.TACTICAL;
        colorTd(tdPeakTactical, 'PeakTactical', report.PeakTactical);
        tdPeakTactical.innerText = report.PeakTactical == undefined ? '' : report.PeakTactical;

        let tdPeakTechnical = document.createElement('td');
        tdPeakTechnical.title = SCOUT_TABLE_TITLE.TECHNICAL;
        tdPeakTechnical.className = 'border';
        colorTd(tdPeakTechnical, 'PeakTechnical', report.PeakTechnical);
        tdPeakTechnical.innerText = report.PeakTechnical == undefined ? '' : report.PeakTechnical;

        let tdLeadership = document.createElement('td');
        tdLeadership.title = SCOUT_TABLE_TITLE.LEADERSHIP;
        colorTd(tdLeadership, 'Leadership', report.Leadership);
        tdLeadership.innerText = report.Leadership == undefined ? '' : report.Leadership;

        let tdProfession = document.createElement('td');
        tdProfession.title = SCOUT_TABLE_TITLE.PROFESSIONALISM;
        colorTd(tdProfession, 'Profession', report.Profession);
        tdProfession.innerText = report.Profession == undefined ? '' : report.Profession;

        let tdAggression = document.createElement('td');
        tdAggression.title = SCOUT_TABLE_TITLE.AGGRESSION;
        tdAggression.className = 'border';
        colorTd(tdAggression, 'Aggression', report.Aggression);
        tdAggression.innerText = report.Aggression == undefined ? '' : report.Aggression;

        let tdLastWeekScout = document.createElement('td');
        tdLastWeekScout.title = SCOUT_TABLE_TITLE.LWS;
        if (report.LastWeekScout && report.LastWeekScout > 0 && (tdBloomStatus.innerText != BLOOM_STATUS_TEXT.BLOOMED || tdDevStatus.innerText != DEVELOPMENT_STATUS_TEXT.DONE)) {
            tdLastWeekScout.innerHTML = '<span style="color:Darkred">' + report.LastWeekScout + '</span>';
        } else {
            tdLastWeekScout.innerText = report.LastWeekScout == undefined ? '' : report.LastWeekScout;
        }

        let tdLastAgeScout = document.createElement('td');
        tdLastAgeScout.className = 'border';
        tdLastAgeScout.title = SCOUT_TABLE_TITLE.LAS;
        if (report.LastAgeScout && report.LastAgeScout < Math.floor(player.Age) && (tdBloomStatus.innerText != BLOOM_STATUS_TEXT.BLOOMED || tdDevStatus.innerText != DEVELOPMENT_STATUS_TEXT.DONE)) {
            tdLastAgeScout.innerHTML = '<span style="color:Darkred">' + report.LastAgeScout + '</span>';
        } else {
            tdLastAgeScout.innerText = report.LastAgeScout == undefined ? '' : report.LastAgeScout;
        }

        let tdTi = document.createElement('td');
        tdTi.title = SCOUT_TABLE_TITLE.TI;
        tdTi.className = 'border';
        colorTd(tdTi, 'Ti', player.Ti);
        tdTi.innerText = player.Ti == undefined ? '' : player.Ti;

        tr.appendChild(tdNumber);
        tr.appendChild(tdName);
        tr.appendChild(tdAge);
        tr.appendChild(tdFp);
        tr.appendChild(tdYouthDevelopment);
        tr.appendChild(tdRec);
        tr.appendChild(tdPotential);
        tr.appendChild(tdBloomStatus);
        tr.appendChild(tdDevStatus);
        tr.appendChild(tdSpecialty);
        tr.appendChild(tdPeakPhysical);
        tr.appendChild(tdPeakTactical);
        tr.appendChild(tdPeakTechnical);
        tr.appendChild(tdLeadership);
        tr.appendChild(tdProfession);
        tr.appendChild(tdAggression);
        tr.appendChild(tdLastWeekScout);
        tr.appendChild(tdLastAgeScout);
        tr.appendChild(tdTi);

        tbody.appendChild(tr);
    }

    function presentPeakPanel() {
        let peakDiv = document.createElement('div');
        peakDiv.id = ADDITION_PANEL_ID.PEAK;
        peakDiv.className = 'std';
        peakDiv.style.display = 'none';
        peakDiv.innerHTML +=
        '<div>' +
        '<table class="hover zebra" cellspacing="0" cellpadding="0">' +
        '<tbody id="' + PEAK_TABLE_BODY_ID + '">' +
        '<tr class="header">' +
        '<th title="Number">#</th>' +
        '<th title="">Name</th>' +
        '<th title="">Age</th>' +
        '<th title="Favorite position">Fp</th>' +
        '<th title="' + PEAK_TABLE_TITLE.PHYSICAL_SUM + '">PhySum</th>' +
        '<th title="' + PEAK_TABLE_TITLE.TACTICAL_SUM + '">TacSum</th>' +
        '<th title="' + PEAK_TABLE_TITLE.TECHNICAL_SUM + '">TecSum</th>' +
        '<th title="' + PEAK_TABLE_TITLE.PHYSICAL_PEAK + '">PhyP</th>' +
        '<th title="' + PEAK_TABLE_TITLE.TACTICAL_PEAK + '">TacP</th>' +
        '<th title="' + PEAK_TABLE_TITLE.TECHNICAL_PEAK + '">TecP</th>' +
        '<th title="Percent Reach Peak">PhyR</th>' +
        '<th title="Percent Reach Peak">TacR</th>' +
        '<th title="Percent Reach Peak">TecR</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.PHYSICAL + '">Phy</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.TACTICAL + '">Tac</th>' +
        '<th title="' + SCOUT_TABLE_TITLE.TECHNICAL + '">Tec</th>' +
        '<th title="">Asi</th>' +
        '<th title="">R5</th>' +
        '<th title="">Rec</th>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
        $('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(peakDiv);
        for (let i = 0; i < playerIdArr.length; i++) {
            appendPeakTableRow(playerIdArr[i], i);
        }
    }

    function appendPeakTableRow(playerId, rowCount) {
        let player = playerMap.get(playerId);
        let report = reportMap.get(playerId);

        let tbody = $('#' + PEAK_TABLE_BODY_ID)[0];
        let tr = document.createElement('tr');
        if ((rowCount % 2) == 1) {
            tr.className = 'odd';
        }

        let tdNumber = document.createElement('td');
        tdNumber.className = 'border minishirt small';
        tdNumber.innerText = player.Number;

        let tdName = document.createElement('td');
        tdName.className = 'left name text_fade';
        tdName.innerHTML =
            '<div class="name"> <a href="/players/' + player.Id + '/" player_link="' + player.Id + '" class="normal">' + player.Name + '</a></div>';

        let tdAge = document.createElement('td');
        tdAge.innerText = player.Age;

        let tdFp = document.createElement('td');
        tdFp.className = 'border favposition short';
        tdFp.innerText = player.Position;

        let tdPhySum = document.createElement('td');
        tdPhySum.title = PEAK_TABLE_TITLE.PHYSICAL_SUM;
        tdPhySum.innerText = player.SkillSum.Phy + ' (' + Math.round(player.SkillSum.PhyRatio * 100) + '%)';
        colorTd(tdPhySum, 'RatioSkillSum', Math.round(player.SkillSum.PhyRatio * 100));

        let tdTacSum = document.createElement('td');
        tdTacSum.title = PEAK_TABLE_TITLE.TACTICAL_SUM;
        tdTacSum.innerText = player.SkillSum.Tac + ' (' + Math.round(player.SkillSum.TacRatio * 100) + '%)';
        colorTd(tdTacSum, 'RatioSkillSum', Math.round(player.SkillSum.TacRatio * 100));

        let tdTecSum = document.createElement('td');
        tdTecSum.title = PEAK_TABLE_TITLE.TECHNICAL_SUM;
        tdTecSum.className = 'border';
        tdTecSum.innerText = player.SkillSum.Tec + ' (' + Math.round(player.SkillSum.TecRatio * 100) + '%)';
        colorTd(tdTecSum, 'RatioSkillSum', Math.round(player.SkillSum.TecRatio * 100));

        let tdPhyPeak = document.createElement('td');
        tdPhyPeak.title = PEAK_TABLE_TITLE.PHYSICAL_PEAK;
        if (report.PeakPhysical != undefined) {
            if (player.Position != GK_POSITION_TO_CHECK) {
                tdPhyPeak.innerText = OUTFIELD_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
            } else {
                tdPhyPeak.innerText = GK_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
            }
        } else {
            tdPhyPeak.innerText = '';
        }
        colorTd(tdPhyPeak, 'PeakPhysical', report.PeakPhysical);

        let tdTacPeak = document.createElement('td');
        tdTacPeak.title = PEAK_TABLE_TITLE.TACTICAL_PEAK;
        if (report.PeakTactical != undefined) {
            if (player.Position != GK_POSITION_TO_CHECK) {
                tdTacPeak.innerText = OUTFIELD_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
            } else {
                tdTacPeak.innerText = GK_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
            }
        } else {
            tdTacPeak.innerText = '';
        }
        colorTd(tdTacPeak, 'PeakTactical', report.PeakTactical);

        let tdTecPeak = document.createElement('td');
        tdTecPeak.title = PEAK_TABLE_TITLE.TECHNICAL_PEAK;
        tdTecPeak.className = 'border';
        if (report.PeakTechnical != undefined) {
            if (player.Position != GK_POSITION_TO_CHECK) {
                tdTecPeak.innerText = OUTFIELD_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
            } else {
                tdTecPeak.innerText = GK_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
            }
        } else {
            tdTecPeak.innerText = '';
        }
        colorTd(tdTecPeak, 'PeakTechnical', report.PeakTechnical);

        let tdPhyReach = document.createElement('td');
        if (tdPhyPeak.innerText != '') {
            tdPhyReach.innerText = Math.round(player.SkillSum.Phy / Number(tdPhyPeak.innerText) * 100) + '%';
        } else {
            tdPhyReach.innerText = '';
        }
        colorTd(tdPhyReach, 'SumReachPeak', Math.round(player.SkillSum.Phy / Number(tdPhyPeak.innerText) * 100));

        let tdTacReach = document.createElement('td');
        if (tdTacPeak.innerText != '') {
            tdTacReach.innerText = Math.round(player.SkillSum.Tac / Number(tdTacPeak.innerText) * 100) + '%';
        } else {
            tdTacReach.innerText = '';
        }
        colorTd(tdTacReach, 'SumReachPeak', Math.round(player.SkillSum.Tac / Number(tdTacPeak.innerText) * 100));

        let tdTecReach = document.createElement('td');
        tdTecReach.className = 'border';
        if (tdTecPeak.innerText != '') {
            tdTecReach.innerText = Math.round(player.SkillSum.Tec / Number(tdTecPeak.innerText) * 100) + '%';
        } else {
            tdTecReach.innerText = '';
        }
        colorTd(tdTecReach, 'SumReachPeak', Math.round(player.SkillSum.Tec / Number(tdTecPeak.innerText) * 100));

        let tdPeakPhysical = document.createElement('td');
        tdPeakPhysical.title = SCOUT_TABLE_TITLE.PHYSICAL;
        colorTd(tdPeakPhysical, 'PeakPhysical', report.PeakPhysical);
        tdPeakPhysical.innerText = report.PeakPhysical == undefined ? '' : report.PeakPhysical;

        let tdPeakTactical = document.createElement('td');
        tdPeakTactical.title = SCOUT_TABLE_TITLE.TACTICAL;
        colorTd(tdPeakTactical, 'PeakTactical', report.PeakTactical);
        tdPeakTactical.innerText = report.PeakTactical == undefined ? '' : report.PeakTactical;

        let tdPeakTechnical = document.createElement('td');
        tdPeakTechnical.title = SCOUT_TABLE_TITLE.TECHNICAL;
        tdPeakTechnical.className = 'border';
        colorTd(tdPeakTechnical, 'PeakTechnical', report.PeakTechnical);
        tdPeakTechnical.innerText = report.PeakTechnical == undefined ? '' : report.PeakTechnical;

        let tdAsi = document.createElement('td');
        tdAsi.className = 'right border';
        tdAsi.innerText = playerMap.get(playerId).Asi;
        colorTd(tdAsi, 'Asi', playerMap.get(playerId).Asi);

        let tdR5 = document.createElement('td');
        tdR5.className = 'right border';
        tdR5.innerText = playerMap.get(playerId).R5;
        colorTd(tdR5, 'R5', playerMap.get(playerId).R5);

        let tdRec = document.createElement('td');
        tdRec.className = 'right border';
        tdRec.innerText = playerMap.get(playerId).Rec;
        colorTd(tdRec, 'Rec', playerMap.get(playerId).Rec);

        tr.appendChild(tdNumber);
        tr.appendChild(tdName);
        tr.appendChild(tdAge);
        tr.appendChild(tdFp);

        tr.appendChild(tdPhySum);
        tr.appendChild(tdTacSum);
        tr.appendChild(tdTecSum);

        tr.appendChild(tdPhyPeak);
        tr.appendChild(tdTacPeak);
        tr.appendChild(tdTecPeak);

        tr.appendChild(tdPhyReach);
        tr.appendChild(tdTacReach);
        tr.appendChild(tdTecReach);

        tr.appendChild(tdPeakPhysical);
        tr.appendChild(tdPeakTactical);
        tr.appendChild(tdPeakTechnical);

        tr.appendChild(tdAsi);
        tr.appendChild(tdR5);
        tr.appendChild(tdRec);

        tbody.appendChild(tr);
    }

    function presentReliablePanel() {
        let configDiv = document.createElement('div');
        configDiv.id = ADDITION_PANEL_ID.RELIABLE;
        configDiv.className = 'std';
        configDiv.style.display = 'none';
        configDiv.innerHTML +=
        '<div>' +
        '<table class="hover zebra" cellspacing="0" cellpadding="0">' +
        '<tbody>' +
        '<tr class="header">' +
        '<td colspan="8" class="left">Set reliable skill of scout. Script will only trust scout results with skill greater than or equal to the set value.</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="left">Seniors:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_seniors" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left">Youths:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_youths" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left">Development:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_development" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left">Psychology:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_psychology" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="left">Physical:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_physical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left">Tactical:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_tactical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left">Technical:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_technical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
        '<td class="left" colspan="2">' +
        '<span id="tmvn_script_player_train_button_save_reliable" class="button" style="margin-left: 3px;"><span class="button_border">Save</span></span>' +
        '<span id="tmvn_script_player_train_button_reset_reliable" class="button" style="margin-left: 3px;"><span class="button_border">Reset</span></span>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
        $('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(configDiv);
        document.getElementById('tmvn_script_player_train_button_save_reliable').addEventListener('click', (e) => {
            saveReliableSkillScout();
        });
        document.getElementById('tmvn_script_player_train_button_reset_reliable').addEventListener('click', (e) => {
            resetReliableSkillScout();
        });

        updateReliableSkillScount();
        $('#tmvn_script_player_train_input_reliable_scout_seniors').val(SCOUT_RELIABLE_SKILL.SENIORS);
        $('#tmvn_script_player_train_input_reliable_scout_youths').val(SCOUT_RELIABLE_SKILL.YOUTHS);
        $('#tmvn_script_player_train_input_reliable_scout_development').val(SCOUT_RELIABLE_SKILL.DEVELOPMENT);
        $('#tmvn_script_player_train_input_reliable_scout_psychology').val(SCOUT_RELIABLE_SKILL.PSYCHOLOGY);
        $('#tmvn_script_player_train_input_reliable_scout_physical').val(SCOUT_RELIABLE_SKILL.PHYSICAL);
        $('#tmvn_script_player_train_input_reliable_scout_tactical').val(SCOUT_RELIABLE_SKILL.TACTICAL);
        $('#tmvn_script_player_train_input_reliable_scout_technical').val(SCOUT_RELIABLE_SKILL.TECHNICAL);
    }

    function updateReliableSkillScount() {
        let localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY_VALUE);
        if (localStorageData !== "" && localStorageData !== undefined && localStorageData !== null) {
            let reliableSkillScout = JSON.parse(localStorageData);

            SCOUT_RELIABLE_SKILL.SENIORS = reliableSkillScout.Seniors != undefined ? reliableSkillScout.Seniors : SCOUT_RELIABLE_SKILL.SENIORS;
            SCOUT_RELIABLE_SKILL.YOUTHS = reliableSkillScout.Youths != undefined ? reliableSkillScout.Youths : SCOUT_RELIABLE_SKILL.YOUTHS;
            SCOUT_RELIABLE_SKILL.DEVELOPMENT = reliableSkillScout.Development != undefined ? reliableSkillScout.Development : SCOUT_RELIABLE_SKILL.DEVELOPMENT;
            SCOUT_RELIABLE_SKILL.PSYCHOLOGY = reliableSkillScout.Psychology != undefined ? reliableSkillScout.Psychology : SCOUT_RELIABLE_SKILL.PSYCHOLOGY;
            SCOUT_RELIABLE_SKILL.PHYSICAL = reliableSkillScout.Physical != undefined ? reliableSkillScout.Physical : SCOUT_RELIABLE_SKILL.PHYSICAL;
            SCOUT_RELIABLE_SKILL.TACTICAL = reliableSkillScout.Tactical != undefined ? reliableSkillScout.Tactical : SCOUT_RELIABLE_SKILL.TACTICAL;
            SCOUT_RELIABLE_SKILL.TECHNICAL = reliableSkillScout.Technical != undefined ? reliableSkillScout.Technical : SCOUT_RELIABLE_SKILL.TECHNICAL;
        }
    }

    function resetReliableSkillScout() {
        localStorage.removeItem(LOCAL_STORAGE_KEY_VALUE);
        alert('Reset successful, please refresh');
    }

    function saveReliableSkillScout() {
        let seniors = $('#tmvn_script_player_train_input_reliable_scout_seniors')[0].value.trim();
        let youths = $('#tmvn_script_player_train_input_reliable_scout_youths')[0].value.trim();
        let development = $('#tmvn_script_player_train_input_reliable_scout_development')[0].value.trim();
        let psychology = $('#tmvn_script_player_train_input_reliable_scout_psychology')[0].value.trim();
        let physical = $('#tmvn_script_player_train_input_reliable_scout_physical')[0].value.trim();
        let tactical = $('#tmvn_script_player_train_input_reliable_scout_tactical')[0].value.trim();
        let technical = $('#tmvn_script_player_train_input_reliable_scout_technical')[0].value.trim();

        if (seniors == '' || youths == '' || development == '' || psychology == '' || physical == '' || tactical == '' || technical == '') {
            alert('Enter value for all textboxs');
            return;
        }

        if (isNaN(seniors) || isNaN(youths) || isNaN(development) || isNaN(psychology) || isNaN(physical) || isNaN(tactical) || isNaN(technical)) {
            alert('Values must be a integer');
            return;
        }

        if (!(isInt(seniors) && isInt(youths) && isInt(development) && isInt(psychology) && isInt(physical) && isInt(tactical) && isInt(technical))) {
            alert('Values must be a integer');
            return;
        }

        if (!(isValidSkill(seniors) && isValidSkill(youths) && isValidSkill(development) && isValidSkill(psychology) && isValidSkill(physical) && isValidSkill(tactical) && isValidSkill(technical))) {
            alert('Values are between 0 - 20');
            return;
        }

        let reliableSkillScout = {};
        reliableSkillScout.Seniors = seniors;
        reliableSkillScout.Youths = youths;
        reliableSkillScout.Development = development;
        reliableSkillScout.Psychology = psychology;
        reliableSkillScout.Physical = physical;
        reliableSkillScout.Tactical = tactical;
        reliableSkillScout.Technical = technical;

        localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, JSON.stringify(reliableSkillScout));
        alert('Save successful');
    }

    function isValidSkill(skill) {
        return skill <= 20 && skill >= 0;
    }

    function isInt(n) {
        return n % 1 === 0;
    }

    function colorTd(td, type, value) {
        if (value) {
            if (type == 'Rec') {
                if (value == 5) {
                    td.style.color = SCOUT_LEVEL_COLOR[5];
                } else if (value == 4.5) {
                    td.style.color = SCOUT_LEVEL_COLOR[4];
                } else {
                    td.style.color = SCOUT_LEVEL_COLOR[Math.round(value) - 1];
                }
            } else if (['Potential', 'Leadership', 'Profession'].includes(type)) {
                if (value >= 19) {
                    td.style.color = SCOUT_LEVEL_COLOR[5];
                } else if (value >= 17) {
                    td.style.color = SCOUT_LEVEL_COLOR[4];
                } else if (value >= 13) {
                    td.style.color = SCOUT_LEVEL_COLOR[3];
                } else if (value >= 9) {
                    td.style.color = SCOUT_LEVEL_COLOR[2];
                } else if (value >= 5) {
                    td.style.color = SCOUT_LEVEL_COLOR[1];
                } else {
                    td.style.color = SCOUT_LEVEL_COLOR[0];
                }
            } else if (['PeakPhysical', 'PeakTactical', 'PeakTechnical'].includes(type)) {
                if (value >= 4) {
                    td.style.color = SCOUT_LEVEL_COLOR[5];
                } else if (value >= 3) {
                    td.style.color = SCOUT_LEVEL_COLOR[3];
                } else if (value >= 2) {
                    td.style.color = SCOUT_LEVEL_COLOR[1];
                } else {
                    td.style.color = SCOUT_LEVEL_COLOR[0];
                }
            } else if (type == 'Aggression') {
                if (value <= 2) {
                    td.style.color = SCOUT_LEVEL_COLOR[5];
                } else if (value <= 4) {
                    td.style.color = SCOUT_LEVEL_COLOR[4];
                } else if (value <= 8) {
                    td.style.color = SCOUT_LEVEL_COLOR[3];
                } else if (value <= 12) {
                    td.style.color = SCOUT_LEVEL_COLOR[2];
                } else if (value <= 16) {
                    td.style.color = SCOUT_LEVEL_COLOR[1];
                } else {
                    td.style.color = SCOUT_LEVEL_COLOR[0];
                }
            } else if (['RatioSkillSum', 'SumReachPeak'].includes(type)) {
                if (value >= 90) {
                    td.style.color = PERCENT_PEAK_COLOR[5];
                } else if (value >= 80) {
                    td.style.color = PERCENT_PEAK_COLOR[4];
                } else if (value >= 70) {
                    td.style.color = PERCENT_PEAK_COLOR[3];
                } else if (value >= 60) {
                    td.style.color = PERCENT_PEAK_COLOR[2];
                } else if (value >= 50) {
                    td.style.color = PERCENT_PEAK_COLOR[1];
                } else {
                    td.style.color = PERCENT_PEAK_COLOR[0];
                }
            } else if (type == 'Ti') {
                if (value >= TI_CLASS.LEVEL_1) {
                    td.style.color = APP_COLOR.LEVEL_1;
                } else if (value >= TI_CLASS.LEVEL_2) {
                    td.style.color = APP_COLOR.LEVEL_2;
                } else if (value >= TI_CLASS.LEVEL_3) {
                    td.style.color = APP_COLOR.LEVEL_3;
                } else if (value >= TI_CLASS.LEVEL_4) {
                    td.style.color = APP_COLOR.LEVEL_4;
                } else if (value >= TI_CLASS.LEVEL_5) {
                    td.style.color = APP_COLOR.LEVEL_5;
                } else if (value >= TI_CLASS.LEVEL_6) {
                    td.style.color = APP_COLOR.LEVEL_6;
                } else {
                    td.style.color = APP_COLOR.LEVEL_7;
                }
            } else if (type == 'Asi') {
                if (value >= ASI_CLASS.LEVEL_1) {
                    td.style.color = APP_COLOR.LEVEL_1;
                } else if (value >= ASI_CLASS.LEVEL_2) {
                    td.style.color = APP_COLOR.LEVEL_2;
                } else if (value >= ASI_CLASS.LEVEL_3) {
                    td.style.color = APP_COLOR.LEVEL_3;
                } else if (value >= ASI_CLASS.LEVEL_4) {
                    td.style.color = APP_COLOR.LEVEL_4;
                } else if (value >= ASI_CLASS.LEVEL_5) {
                    td.style.color = APP_COLOR.LEVEL_5;
                } else if (value >= ASI_CLASS.LEVEL_6) {
                    td.style.color = APP_COLOR.LEVEL_6;
                } else {
                    td.style.color = APP_COLOR.LEVEL_7;
                }
            } else if (type == 'R5') {
                if (value >= R5_CLASS.LEVEL_1) {
                    td.style.color = APP_COLOR.LEVEL_1;
                } else if (value >= R5_CLASS.LEVEL_2) {
                    td.style.color = APP_COLOR.LEVEL_2;
                } else if (value >= R5_CLASS.LEVEL_3) {
                    td.style.color = APP_COLOR.LEVEL_3;
                } else if (value >= R5_CLASS.LEVEL_4) {
                    td.style.color = APP_COLOR.LEVEL_4;
                } else if (value >= R5_CLASS.LEVEL_5) {
                    td.style.color = APP_COLOR.LEVEL_5;
                } else if (value >= R5_CLASS.LEVEL_6) {
                    td.style.color = APP_COLOR.LEVEL_6;
                } else {
                    td.style.color = APP_COLOR.LEVEL_7;
                }
            } else if (type == 'Rec') {
                if (value >= REC_CLASS.LEVEL_1) {
                    td.style.color = APP_COLOR.LEVEL_1;
                } else if (value >= REC_CLASS.LEVEL_2) {
                    td.style.color = APP_COLOR.LEVEL_2;
                } else if (value >= REC_CLASS.LEVEL_3) {
                    td.style.color = APP_COLOR.LEVEL_3;
                } else if (value >= REC_CLASS.LEVEL_4) {
                    td.style.color = APP_COLOR.LEVEL_4;
                } else if (value >= REC_CLASS.LEVEL_5) {
                    td.style.color = APP_COLOR.LEVEL_5;
                } else if (value >= REC_CLASS.LEVEL_6) {
                    td.style.color = APP_COLOR.LEVEL_6;
                } else {
                    td.style.color = APP_COLOR.LEVEL_7;
                }
            }
        }
    }

    function modifySkillPanel() {
        let trArr = $('table.hover.zebra tbody tr');
        for (let i = 0; i < trArr.length; i++) {
            try {
                let tr = trArr[i];
                if (tr.className.indexOf("header") >= 0) {
                    let trainTh = document.createElement("TH");
                    trainTh.className = "border skill";
                    trainTh.style.cursor = 'pointer';
                    trainTh.innerHTML = '<div class="border skill">Train</div>';
                    tr.appendChild(trainTh);

                    let pointTh = document.createElement("TH");
                    pointTh.className = "border skill";
                    pointTh.style.cursor = 'pointer';
                    pointTh.innerHTML = '<div class="border skill">Point</div>';
                    tr.appendChild(pointTh);
                } else if (tr.children[0].className.indexOf("splitter") < 0) {
                    let onclickNumberPlayer = tr.children[0].children[0].attributes[1].textContent; //example: pop_player_number(131171905,37,"Davide Quilici",0)
                    let playerId = onclickNumberPlayer.substr(18, onclickNumberPlayer.indexOf(',') - 18);

                    let trainText = trainMap.get(playerId).TrainText;
                    let point = trainMap.get(playerId).Point;

                    let trainTd = document.createElement("TD");
                    trainTd.className = "border skill";
                    trainTd.innerHTML = trainText;
                    tr.appendChild(trainTd);

                    let pointTd = document.createElement("TD");
                    pointTd.className = "border skill";
                    pointTd.innerHTML = point;
                    tr.appendChild(pointTd);

                    if (playerMap.get(playerId).Position != GK_POSITION_TO_CHECK) {
                        colorSkill(tr, trainText);
                    }

                }
            } catch (err) {}
        }
    }

    function colorSkill(tr, trainText) {
        if (trainText.length == 6) { //custom train 222222
            tr.children[SKILL_COLUMN_INDEX.STR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];
            tr.children[SKILL_COLUMN_INDEX.STA].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];
            tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];

            tr.children[SKILL_COLUMN_INDEX.MAR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(1))];
            tr.children[SKILL_COLUMN_INDEX.TAC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(1))];

            tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(2))];
            tr.children[SKILL_COLUMN_INDEX.CRO].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(2))];

            tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];
            tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];
            tr.children[SKILL_COLUMN_INDEX.SET].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];

            tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(4))];
            tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(4))];

            tr.children[SKILL_COLUMN_INDEX.FIN].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(5))];
            tr.children[SKILL_COLUMN_INDEX.LON].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(5))];
        } else {
            switch (trainText) {
            case TRAIN_DRILL.TECHNICAL:
                tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.SET].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            case TRAIN_DRILL.FITNESS:
                tr.children[SKILL_COLUMN_INDEX.STR].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.STA].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            case TRAIN_DRILL.TACTICAL:
                tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            case TRAIN_DRILL.FINISHING:
                tr.children[SKILL_COLUMN_INDEX.FIN].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.LON].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            case TRAIN_DRILL.DEFENDING:
                tr.children[SKILL_COLUMN_INDEX.MAR].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.TAC].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            case TRAIN_DRILL.WINGER:
                tr.children[SKILL_COLUMN_INDEX.CRO].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DRILL_COLOR;
                tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DRILL_COLOR;
                break;
            }
        }
    }

    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('style_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'style_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
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

    function calculateRR(player) {
        var STR = player.Skill.Strength;
        var STA = player.Skill.Stamina;
        var PAC = player.Skill.Pace;
        var MAR = player.Skill.Marking;
        var TAC = player.Skill.Tackling;
        var WOR = player.Skill.Workrate;
        var POS = player.Skill.Positioning;
        var PAS = player.Skill.Passing;
        var CRO = player.Skill.Crossing;
        var TEC = player.Skill.Technique;
        var HEA = player.Skill.Heading;
        var FIN = player.Skill.Finishing;
        var LON = player.Skill.Longshots;
        var SET = player.Skill.SetPieces;
        var HAN = player.Skill.Handling;
        var ONE = player.Skill.OneOnOnes;
        var REF = player.Skill.Reflexes;
        var AER = player.Skill.AerialAbility;
        var JUM = player.Skill.Jumping;
        var COM = player.Skill.Communication;
        var KIC = player.Skill.Kicking;
        var THR = player.Skill.Throwing;

        var ROLE = player.Fp;
        var ROU = player.Routine;
        var ASI = player.Asi;

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
})();
