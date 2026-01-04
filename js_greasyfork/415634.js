// ==UserScript==
// @name         TMVN Match Event
// @version      5
// @description  Trophymanager: show main events of the match. So you can easy research tactics of other clubs and your tactics rules happened as expected or not.
// @namespace    https://trophymanager.com
// @include      https://trophymanager.com/matches/*
// @downloadURL https://update.greasyfork.org/scripts/415634/TMVN%20Match%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/415634/TMVN%20Match%20Event.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENTALITY_MAP = new Map()
        .set("1", "Very Defensive")
        .set("2", "Defensive")
        .set("3", "Slightly Defensive")
        .set("4", "Normal")
        .set("5", "Slightly Attacking")
        .set("6", "Attacking")
        .set("7", "Very Attacking");

    const STYLE_MAP = new Map()
        .set("1", "Balanced")
        .set("2", "Direct")
        .set("3", "Wings")
        .set("4", "Shortpassing")
        .set("5", "Long Balls")
        .set("6", "Through Balls");

    const GOAL_STYLE_MAP = new Map()
        .set("p_s", "Penalty")
        .set("kco", "GK Counter")
        .set("klo", "GK Kick")
        .set("doe", "Conner")
        .set("cou", "Counter/Direct")
        .set("dir", "Freekick")
        .set("win", "Wing Attack")
        .set("sho", "Short Pass")
        .set("lon", "Long Ball")
        .set("thr", "Through Ball");

    const FOCUS_MAP = new Map()
        .set("1", "Balanced")
        .set("2", "Left")
        .set("3", "Center")
        .set("4", "Right");

    const EVENT_TYPE = {
        GOAL: 'goal',
        YELLOW_CARD: 'yellow',
        RED_CARD: 'red',
        MENTALITY: 'mentality',
        STYLE: 'style',
        POSITION: 'position',
        SUBTITION: 'subtition',
        INJURY: 'injury'
    }

    var mainEventHTML = "";

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

    var xhr = new XMLHttpRequest();
    var homeStartStyle,
    homeStartMentality,
    homeFocus,
    awayStartStyle,
    awayStartMentality,
    awayFocus;

    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

            var report = data.report;
            if (Object.keys(report).length <= 3) {
                return; //because don't have datas of match
            }

            homeStartStyle = data.match_data.attacking_style.home;
            if (homeStartStyle == "0") {
                homeStartStyle = "1"; //bug of TM
            }
            awayStartStyle = data.match_data.attacking_style.away;
            if (awayStartStyle == "0") {
                awayStartStyle = "1"; //bug of TM
            }
            homeStartMentality = data.match_data.mentality.home.toString();
            awayStartMentality = data.match_data.mentality.away.toString();
            homeFocus = data.match_data.focus_side.home;
            awayFocus = data.match_data.focus_side.away;

            var homeClubId = data.club.home.id;
            var awayClubId = data.club.away.id;

            var homeLineup = data.lineup.home;
            var awayLineup = data.lineup.away;
            var homePlayerIds = Object.getOwnPropertyNames(homeLineup);
            var awayPlayerIds = Object.getOwnPropertyNames(awayLineup);
            var homePlayer = new Map(),
            awayPlayer = new Map();
            homePlayerIds.forEach((playerId) => {
                homePlayer.set(playerId, homeLineup[playerId].name);
            });
            awayPlayerIds.forEach((playerId) => {
                awayPlayer.set(playerId, awayLineup[playerId].name);
            });

            var homeGoal = 0,
            awayGoal = 0;
            var eventReport = [];
            Object.keys(report).forEach(function (key, index) {
                var minuteArr = report[key];
                for (var i = 0; i < minuteArr.length; i++) {
                    var paramArr = minuteArr[i].parameters;
                    if (paramArr) {
                        for (var j = 0; j < paramArr.length; j++) {
                            var paramObj = paramArr[j];
                            if (paramObj.goal) {
                                if (homePlayer.has(paramObj.goal.player)) {
                                    homeGoal++;
                                    let goalStyle = "";
                                    let chanceType = minuteArr[i].type;
                                    if (chanceType) {
                                        chanceType = chanceType.substring(0, 3);
                                        if (GOAL_STYLE_MAP.has(chanceType)) {
                                            goalStyle = GOAL_STYLE_MAP.get(chanceType);
                                        }
                                    }

                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.GOAL,
                                        home: true,
                                        content: "[Goal] " +
                                        homePlayer.get(paramObj.goal.player) +
                                        (paramObj.goal.assist ? " (" + homePlayer.get(paramObj.goal.assist) + ") " : " ") +
                                        (goalStyle != "" ? " [" + goalStyle + "] " : " ") +
                                        paramObj.goal.score[0] + " - " + paramObj.goal.score[1]
                                    });
                                } else {
                                    awayGoal++;
                                    let goalStyle = "";
                                    let chanceType = minuteArr[i].type;
                                    if (chanceType) {
                                        chanceType = chanceType.substring(0, 3);
                                        if (GOAL_STYLE_MAP.has(chanceType)) {
                                            goalStyle = GOAL_STYLE_MAP.get(chanceType);
                                        }
                                    }

                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.GOAL,
                                        home: false,
                                        content: "[Goal] " +
                                        awayPlayer.get(paramObj.goal.player) +
                                        (paramObj.goal.assist ? " (" + awayPlayer.get(paramObj.goal.assist) + ") " : " ") +
                                        (goalStyle != "" ? " [" + goalStyle + "] " : " ") +
                                        paramObj.goal.score[0] + " - " + paramObj.goal.score[1]
                                    });
                                }
                            } else if (paramObj.yellow) {
                                if (homePlayer.has(paramObj.yellow)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.YELLOW_CARD,
                                        home: true,
                                        content: "[Yellow card] " +
                                        homePlayer.get(paramObj.yellow)
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.YELLOW_CARD,
                                        home: false,
                                        content: "[Yellow card] " +
                                        awayPlayer.get(paramObj.yellow)
                                    });
                                }
                            } else if (paramObj.red) {
                                if (homePlayer.has(paramObj.red)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.RED_CARD,
                                        home: true,
                                        content: "[Red card] " +
                                        homePlayer.get(paramObj.red)
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.RED_CARD,
                                        home: false,
                                        content: "[Red card] " +
                                        awayPlayer.get(paramObj.red)
                                    });
                                }
                            } else if (paramObj.yellow_red) {
                                if (homePlayer.has(paramObj.yellow_red)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.RED_CARD,
                                        home: true,
                                        content: "[Red card] (2 yellow cards) " +
                                        homePlayer.get(paramObj.yellow_red)
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.RED_CARD,
                                        home: false,
                                        content: "[Red card] (2 yellow cards) " +
                                        awayPlayer.get(paramObj.yellow_red)
                                    });
                                }
                            } else if (paramObj.mentality_change) {
                                if (paramObj.mentality_change.mentality) {
                                    if (paramObj.mentality_change.team == homeClubId) {
                                        eventReport.push({
                                            minute: key,
                                            type: EVENT_TYPE.MENTALITY,
                                            home: true,
                                            content: "[Tactics] Mentality change to " + MENTALITY_MAP.get(paramObj.mentality_change.mentality)
                                        });
                                    } else {
                                        eventReport.push({
                                            minute: key,
                                            type: EVENT_TYPE.MENTALITY,
                                            home: false,
                                            content: "[Tactics] Mentality change to " + MENTALITY_MAP.get(paramObj.mentality_change.mentality)
                                        });
                                    }
                                } else if (paramObj.mentality_change.style) {
                                    if (paramObj.mentality_change.team == homeClubId) {
                                        eventReport.push({
                                            minute: key,
                                            type: EVENT_TYPE.STYLE,
                                            home: true,
                                            content: "[Tactics] Attacking style change to " + STYLE_MAP.get(paramObj.mentality_change.style)
                                        });
                                    } else {
                                        eventReport.push({
                                            minute: key,
                                            type: EVENT_TYPE.STYLE,
                                            home: false,
                                            content: "[Tactics] Attacking style change to " + STYLE_MAP.get(paramObj.mentality_change.style)
                                        });
                                    }
                                }
                            } else if (paramObj.player_change) {
                                if (homePlayer.has(paramObj.player_change.player)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.POSITION,
                                        home: true,
                                        content: "[Position] " + homePlayer.get(paramObj.player_change.player) + " change to " + (paramObj.player_change.position !== undefined ? paramObj.player_change.position.toUpperCase() : "")
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.POSITION,
                                        home: false,
                                        content: "[Position] " + awayPlayer.get(paramObj.player_change.player) + " change to " + (paramObj.player_change.position !== undefined ? paramObj.player_change.position.toUpperCase() : "")
                                    });
                                }
                            } else if (paramObj.sub && paramObj.sub.player_in && paramObj.sub.player_out) {
                                if (homePlayer.has(paramObj.sub.player_in)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.SUBTITION,
                                        home: true,
                                        content: "[Subtition] " + homePlayer.get(paramObj.sub.player_in) + " replace " + homePlayer.get(paramObj.sub.player_out) + (paramObj.sub.player_position !== undefined ? " and play " + paramObj.sub.player_position.toUpperCase() : "")
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.SUBTITION,
                                        home: false,
                                        content: "[Subtition] " + awayPlayer.get(paramObj.sub.player_in) + " replace " + awayPlayer.get(paramObj.sub.player_out) + (paramObj.sub.player_position !== undefined ? " and play " + paramObj.sub.player_position.toUpperCase() : "")
                                    });
                                }
                            } else if (paramObj.injury) {
                                if (homePlayer.has(paramObj.injury)) {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.INJURY,
                                        home: true,
                                        content: "[Injury] " + homePlayer.get(paramObj.injury)
                                    });
                                } else {
                                    eventReport.push({
                                        minute: key,
                                        type: EVENT_TYPE.INJURY,
                                        home: false,
                                        content: "[Injury] " + awayPlayer.get(paramObj.injury)
                                    });
                                }
                            }
                        }
                    }
                }
            });

            if (eventReport.length > 0) {
                mainEventHTML += '<li style="color:burlywood"><table><tbody><tr><td align="left">' +
                '0. Mentality: ' + MENTALITY_MAP.get(homeStartMentality) +
                '. Attacking style: ' + STYLE_MAP.get(homeStartStyle) +
                '. Focus: ' + FOCUS_MAP.get(homeFocus) +
                '</td><td align="right">' +
                'Mentality: ' + MENTALITY_MAP.get(awayStartMentality) +
                '. Attacking style: ' + STYLE_MAP.get(awayStartStyle) +
                '. Focus: ' + FOCUS_MAP.get(awayFocus) +
                ' .0' +
                '</td></tr></tbody></table></li>';
                eventReport.forEach((event) => {
                    let color;
                    switch (event.type) {
                    case EVENT_TYPE.GOAL:
                        color = "style='color:Aqua;'";
                        break;
                    case EVENT_TYPE.YELLOW_CARD:
                        color = "style='color:Yellow;'";
                        break;
                    case EVENT_TYPE.RED_CARD:
                        color = "style='color:Darkred;'";
                        break;
                    case EVENT_TYPE.MENTALITY:
                        color = "style='color:Orange;'";
                        break;
                    case EVENT_TYPE.STYLE:
                        color = "style='color:Blue;'";
                        break;
                    case EVENT_TYPE.POSITION:
                        color = "style='color:GreenYellow;'";
                        break;
                    case EVENT_TYPE.INJURY:
                        color = "style='color:Brown;'";
                        break;
                    default:
                        color = "";
                    }
                    if (event.home) {
                        mainEventHTML +=
                        "<li align='left' " + color + ">" +
                        event.minute +
                        ". " +
                        event.content +
                        "</li>";
                    } else {
                        mainEventHTML +=
                        "<li align='right' " + color + ">" +
                        event.content +
                        " ." +
                        event.minute +
                        "</li>";
                    }
                });
            }
        }
    }

    var myInterval = setInterval(display, 1000);
    var pause = false;
    function display() {
        if (mainEventHTML !== "" && $('.box_body.mv_bottom').length > 0) {
            if ($('.post_report').length > 0) {
                let divArea = $('.box_body.mv_bottom div.post_report')[0];
                divArea.innerHTML =
                    '<div class="mega_headline tcenter report_section_header dark_bg">Main Event</div><div><ul class="clean underlined large_padding">' +
                    mainEventHTML +
                    '</ul></div>' +
                    divArea.innerHTML;
                clearInterval(myInterval);
            } else if (!pause) {
                let divArea = $('.box_body.mv_bottom')[0];
                divArea.innerHTML =
                    '<div class="mega_headline tcenter report_section_header dark_bg">Main Event</div><div><ul class="clean underlined large_padding">' +
                    mainEventHTML +
                    '</ul></div>' +
                    divArea.innerHTML;
                pause = true;
            }
        }
    }
})();
