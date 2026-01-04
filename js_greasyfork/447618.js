// ==UserScript==
// @name         TMVN Shortlist Scout
// @namespace    https://trophymanager.com
// @version      5
// @description  Trophymanager: show scout's information for shortlist
// @match        https://trophymanager.com/shortlist/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447618/TMVN%20Shortlist%20Scout.user.js
// @updateURL https://update.greasyfork.org/scripts/447618/TMVN%20Shortlist%20Scout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = {
        SCOUT: 'tmvn_shortlist_scout_script_scout_button',
        SKILL: 'tmvn_shortlist_scout_script_skill_button'
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
    var playerAgeMap = new Map(); //for sorting by age
    var playerMap = new Map();

    var reportMap = new Map();

    var scoutMap = new Map();

    var avaiableScoutCount = 0;

    filter_tr(8);

    //first, replace all star img for easy color and calculate
    //$('img[src$="/pics/star_silver.png"]').replaceWith('19');
    //$('img[src$="/pics/star.png"]').replaceWith('20');

    updateReliableSkillScount(); //update before query scout data

    getPlayerData();
    var myInterval = setInterval(loopCheck, 1000);

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

                let player = {};
                let playerId = tr.children[0].children[0].children[1].attributes[0].textContent.split('/')[2];

                player.Id = playerId;
                player.Name = tr.children[0].children[0].children[1].innerText;
                player.Age = tr.children[1].innerText;
                player.Position = tr.children[2].children[0].children[0].innerText;

                let skill = {};
                let skillSum = {};
                if (player.Position != GK_POSITION_TO_CHECK) {
                    skill.Strength = getSkill(tr.children[3].children[0]);
                    skill.Stamina = getSkill(tr.children[4].children[0]);
                    skill.Pace = getSkill(tr.children[5].children[0]);
                    skill.Marking = getSkill(tr.children[6].children[0]);
                    skill.Tackling = getSkill(tr.children[7].children[0]);
                    skill.Workrate = getSkill(tr.children[8].children[0]);
                    skill.Positioning = getSkill(tr.children[9].children[0]);
                    skill.Passing = getSkill(tr.children[10].children[0]);
                    skill.Crossing = getSkill(tr.children[11].children[0]);
                    skill.Technique = getSkill(tr.children[12].children[0]);
                    skill.Heading = getSkill(tr.children[13].children[0]);
                    skill.Finishing = getSkill(tr.children[14].children[0]);
                    skill.Longshots = getSkill(tr.children[15].children[0]);
                    skill.SetPieces = getSkill(tr.children[16].children[0]);

                    skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Heading;
                    skillSum.Tac = skill.Marking + skill.Tackling + skill.Positioning + skill.Workrate;
                    skillSum.Tec = skill.Passing + skill.Crossing + skill.Technique + skill.Finishing + skill.Longshots + skill.SetPieces;
                    skillSum.PhyMax = 80;
                    skillSum.TacMax = 80;
                    skillSum.TecMax = 120;
                } else {
                    skill.Strength = getSkill(tr.children[3].children[0]);
                    skill.Stamina = getSkill(tr.children[4].children[0]);
                    skill.Pace = getSkill(tr.children[5].children[0]);
                    skill.Handling = getSkill(tr.children[6].children[0]);
                    skill.OneOnOnes = getSkill(tr.children[7].children[0]);
                    skill.Reflexes = getSkill(tr.children[8].children[0]);
                    skill.AerialAbility = getSkill(tr.children[9].children[0]);
                    skill.Jumping = getSkill(tr.children[10].children[0]);
                    skill.Communication = getSkill(tr.children[11].children[0]);
                    skill.Kicking = getSkill(tr.children[12].children[0]);
                    skill.Throwing = getSkill(tr.children[13].children[0]);

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

                playerMap.set(playerId, player);

                //playerIdArr.push(playerId);
                playerAgeMap.set(playerId, player.Age);

                getScoutInfo(playerId);
            } catch (err) {}
        }
        finishScan = true;
    }

    function loopCheck() {
        if (finishScan && playerMap.size == reportMap.size) {
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

            document.getElementById(BUTTON_ID.SCOUT).addEventListener('click', (e) => {
                showAdditionPanel(ADDITION_PANEL_ID.SCOUT);
            });

            addNewStyle('.position {width:85px !important;}');

            presentScoutPanel();
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

    function getScoutInfo(playerId) {
        $.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
            "type": "scout",
            "player_id": playerId
        }, function (response) {
            let data = JSON.parse(response);
            getScout(data);
            let player = playerMap.get(playerId);
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

                        if (report.bloom_status_txt == BLOOM_STATUS_TEXT.BLOOMED || (startBloomAge != null && (startBloomAge + 2 < Math.floor(player.Age)))) {
                            reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
                        } else if (startBloomAge != null) {
                            let processBloomAge = startBloomAge + ' - ' + (startBloomAge + 2);
                            if (startBloomAge == Math.floor(player.Age)) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_START_BLOOM + '">' + processBloomAge + '</span>';
                            } else if (startBloomAge + 1 == Math.floor(player.Age)) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_MIDDLE_BLOOM + '">' + processBloomAge + '</span>';
                            } else if (startBloomAge + 2 == Math.floor(player.Age)) {
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
                        if (player.Position != GK_POSITION_TO_CHECK) {
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
                        if (player.Position != GK_POSITION_TO_CHECK) {
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
                        if (player.Position != GK_POSITION_TO_CHECK) {
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
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
        $('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(scoutDiv);

        let sortMap = new Map([...playerAgeMap.entries()].sort((a, b) => b[1] - a[1]));
        playerIdArr = Array.from(sortMap.keys());
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

        let tdName = document.createElement('td');
        tdName.className = 'left name text_fade';
        tdName.innerHTML =
            '<div class="name"> <a href="/players/' + player.Id + '/" player_link="' + player.Id + '" class="normal">' + player.Name + '</a></div>';

        let tdAge = document.createElement('td');
        tdAge.innerText = player.Age;

        let tdFp = document.createElement('td');
        tdFp.className = 'favposition short';
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
        tdLastAgeScout.title = SCOUT_TABLE_TITLE.LAS;
        tdLastAgeScout.className = 'border';
        if (report.LastAgeScout && report.LastAgeScout < Math.floor(player.Age) && (tdBloomStatus.innerText != BLOOM_STATUS_TEXT.BLOOMED || tdDevStatus.innerText != DEVELOPMENT_STATUS_TEXT.DONE)) {
            tdLastAgeScout.innerHTML = '<span style="color:Darkred">' + report.LastAgeScout + '</span>';
        } else {
            tdLastAgeScout.innerText = report.LastAgeScout == undefined ? '' : report.LastAgeScout;
        }

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

        tbody.appendChild(tr);
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
})();
