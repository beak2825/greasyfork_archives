// ==UserScript==
// @name         TMVN Players Form
// @namespace    https://trophymanager.com
// @version      2
// @description  Trophymanager: show recent form of player in the current club. Made by order of Ngã ba Ông Tạ Sài Gòn(2175105)
// @include      https://trophymanager.com/players/*
// @exclude      https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466813/TMVN%20Players%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/466813/TMVN%20Players%20Form.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const APPLICATION_PARAM = {
        DEFAULT_MATCH_COUNT: "5",
        MATCH_COUNT_LOCAL_STORAGE_KEY: "TMVN_PLAYER_FORM_MATCH_COUNT",
    }

    const CONTROL_ID = {
        INPUT_MATCH_COUNT: 'tmvn_player_form_script_input_match_count',
        BUTTON_MATCH_COUNT: 'tmvn_player_form_script_button_match_count_set',
    }

    const RATE_CLASS = {
        LEVEL_7: 10,
        LEVEL_6: 9,
        LEVEL_5: 7,
        LEVEL_4: 5,
        LEVEL_3: 3,
        LEVEL_2: 1,
        LEVEL_1: 0
    }

    const RATE_LEVEL_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Orange', 'Black', 'Darkred'];

    const FORM_TABLE_BODY_ID = 'tmvn_script_form_table_body'; ;

    var playerId;
    var clubId;
    var matchIds = [];
    var performances = [];
    var matchCount;
    var totalMatch = 0;

    var totalRate = 0;
    var totalMinute = 0;
    var totalGoal = 0;
    var totalAssist = 0;

    var rateForm = '';
    var minuteForm = '';
    var goalForm = '';
    var assistForm = '';

    var averageRate = '';
    var averageMinute = '';

    var displayInterval;

    $(document).ready(function () {
        if (player_id == undefined) {
            return;
        }
        playerId = player_id;
        clubId = $('a[club_link]:not(.normal)').attr("club_link");
        matchCount = localStorage.getItem(APPLICATION_PARAM.MATCH_COUNT_LOCAL_STORAGE_KEY);
        if (matchCount == null || matchCount == "") {
            matchCount = APPLICATION_PARAM.DEFAULT_MATCH_COUNT;
        }

        try {
            $('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
        } catch (err) {}

        $.ajaxSetup({
            async: false
        });

        getMatch(clubId);

        $.ajaxSetup({
            async: true
        });

        if (matchIds.length > 0) {
            for (let i = matchIds.length - 1; i >= 0; i--) {
                processMatch(matchIds[i]);
            }
            displayInterval = setInterval(display, 1000);
        }
    });

    function display() {
        if (matchIds.length > performances.length) {
            return;
        }
        clearInterval(displayInterval);
        performances.sort((a, b) => (a.kickoffDate > b.kickoffDate) ? 1 : ((b.kickoffDate > a.kickoffDate) ? -1 : ((a.kickoffTime > b.kickoffTime) ? 1 : ((b.kickoffTime > a.kickoffTime) ? -1 : 0))));

        for (let i = 0; i < performances.length; i++) {
            if (performances[i].rate != null) {
                totalMatch++;
                totalRate += performances[i].rate;
                totalMinute += performances[i].minute;
                totalGoal += performances[i].goal;
                totalAssist += performances[i].assist;
                if (i == 0) {
                    let rateColor = colorRate(performances[i].rate);
                    rateForm += '<span style="color: ' + rateColor + '">' + performances[i].rate + '</span>';
                    if (performances[i].mom == 1) {
                        rateForm += '<img src="/pics/star.png">';
                    }

                    minuteForm += performances[i].minute;
                    goalForm += performances[i].goal;
                    assistForm += performances[i].assist;
                } else {
                    let rateColor = colorRate(performances[i].rate);
                    rateForm += ' - ' + '<span style="color: ' + rateColor + '">' + performances[i].rate + '</span>';
                    if (performances[i].mom == 1) {
                        rateForm += '<img src="/pics/star.png">';
                    }

                    minuteForm += ' - ' + performances[i].minute;
                    goalForm += ' - ' + performances[i].goal;
                    assistForm += ' - ' + performances[i].assist;
                }
            } else {
                if (i == 0) {
                    rateForm += '*';
                    minuteForm += '*';
                    goalForm += '*';
                    assistForm += '*';
                } else {
                    rateForm += ' - ' + '*';
                    minuteForm += ' - ' + '*';
                    goalForm += ' - ' + '*';
                    assistForm += ' - ' + '*';
                }
            }
        }
        if (totalMatch > 0) {
            averageRate = Math.round(totalRate / totalMatch * 10) / 10;
            averageMinute = Math.round(totalMinute / totalMatch);
        }
        let formReport =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">FORM</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<div id=\"formReport_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";
        $(".column3_a").append(formReport);

        let formReport_content = "<table><tbody id='" + FORM_TABLE_BODY_ID + "'></tbody></table>";
        $("#formReport_content").append(formReport_content);
        let tbody = $('#' + FORM_TABLE_BODY_ID)[0];

        /*Rate*/
        let trRateForm = document.createElement('tr');
        trRateForm.className = 'odd';

        let tdRateFormLabel = document.createElement('td');
        tdRateFormLabel.innerText = 'Rate: ';

        let tdRateForm = document.createElement('td');
        tdRateForm.innerHTML = rateForm;

        trRateForm.appendChild(tdRateFormLabel);
        trRateForm.appendChild(tdRateForm);
        tbody.appendChild(trRateForm);

        /*Minute*/
        let trMinuteForm = document.createElement('tr');

        let tdMinuteFormLabel = document.createElement('td');
        tdMinuteFormLabel.innerText = 'Minute: ';

        let tdMinuteForm = document.createElement('td');
        tdMinuteForm.innerText = minuteForm;

        trMinuteForm.appendChild(tdMinuteFormLabel);
        trMinuteForm.appendChild(tdMinuteForm);
        tbody.appendChild(trMinuteForm);

        /*Goal*/
        let trGoalForm = document.createElement('tr');
        trGoalForm.className = 'odd';

        let tdGoalFormLabel = document.createElement('td');
        tdGoalFormLabel.innerText = 'Goal: ';

        let tdGoalForm = document.createElement('td');
        tdGoalForm.innerText = goalForm;

        trGoalForm.appendChild(tdGoalFormLabel);
        trGoalForm.appendChild(tdGoalForm);
        tbody.appendChild(trGoalForm);

        /*Assist*/
        let trAssistForm = document.createElement('tr');

        let tdAssistFormLabel = document.createElement('td');
        tdAssistFormLabel.innerText = 'Assist: ';

        let tdAssistForm = document.createElement('td');
        tdAssistForm.innerText = assistForm;

        trAssistForm.appendChild(tdAssistFormLabel);
        trAssistForm.appendChild(tdAssistForm);
        tbody.appendChild(trAssistForm);

        /*Average Rate*/
        let trAverageRateForm = document.createElement('tr');
        trAverageRateForm.className = 'odd';

        let tdAverageRateFormLabel = document.createElement('td');
        tdAverageRateFormLabel.innerText = 'Avg rate: ';

        let tdAverageRateForm = document.createElement('td');
        tdAverageRateForm.innerText = averageRate;
        colorTd(tdAverageRateForm, 'Rate', averageRate);

        trAverageRateForm.appendChild(tdAverageRateFormLabel);
        trAverageRateForm.appendChild(tdAverageRateForm);
        tbody.appendChild(trAverageRateForm);

        /*Average Minute*/
        let trAverageMinuteForm = document.createElement('tr');

        let tdAverageMinuteFormLabel = document.createElement('td');
        tdAverageMinuteFormLabel.innerText = 'Avg minute: ';

        let tdAverageMinuteForm = document.createElement('td');
        tdAverageMinuteForm.innerText = averageMinute;

        trAverageMinuteForm.appendChild(tdAverageMinuteFormLabel);
        trAverageMinuteForm.appendChild(tdAverageMinuteForm);
        tbody.appendChild(trAverageMinuteForm);

        /*Match count*/
        let trMatchCount = document.createElement('tr');

        let tdMatchCountInput = document.createElement('td');
        tdMatchCountInput.innerHTML = "<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_MATCH_COUNT + "' type='text' class='embossed' style='width: 100px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Match count'></span>";
        let tdMatchCountButton = document.createElement('td');
        tdMatchCountButton.innerHTML = "<span id='" + CONTROL_ID.BUTTON_MATCH_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Match count</span></span>";

        trMatchCount.appendChild(tdMatchCountButton);
        trMatchCount.appendChild(tdMatchCountInput);

        tbody.appendChild(trMatchCount);

        document.getElementById(CONTROL_ID.BUTTON_MATCH_COUNT).addEventListener('click', (e) => {
            setMatchCount();
        });
        $('#' + CONTROL_ID.INPUT_MATCH_COUNT).val(matchCount);
    }

    function getMatch(clubId) {
        try {
            $.post("/ajax/fixtures.ajax.php", {
                "type": 'club',
                "var1": clubId,
                "var2": '',
                "var3": ''
            }, function (data) {
                let matches = [];
                for (const key in data) {
                    matches.push(...data[key].matches); //matches order by date acs
                }
                for (let key = matches.length - 1; key >= 0; key--) {
                    if (matches[key].result != null) {
                        matchIds.push(matches[key].id);
                    }

                    if (matchIds.length == matchCount) {
                        break;
                    }
                }
            }, "json");
        } catch (err) {
            console.log('getMatch exception: ' + err);
        }
    }

    function processMatch(matchId) {
        try {
            $.get("/ajax/match.ajax.php", {
                id: matchId
            }, function (data) {
                var report = data.report;
                if (Object.keys(report).length <= 3) {
                    return; //because don't have datas of match
                }

                let kickoffDate = data.match_data.venue.kickoff_readable;
                let kickoffTime = data.match_data.match_time_of_day;
                let lineup;
                if (data.club.home.id == clubId) {
                    lineup = data.lineup.home;
                } else {
                    lineup = data.lineup.away;
                }

                for (const key in lineup) {
                    if (key == playerId) {
                        if (lineup[key].rating == 0) { //join match but not play
                            performances.push({
                                rate: null,
                                goal: null,
                                assist: null,
                                minute: null,
                                mom: null,
                                kickoffDate: kickoffDate,
                                kickoffTime: kickoffTime,
                            });
                        } else {
                            let goalAssistMinute = checkGoalAssistMinute(data.report);
                            performances.push({
                                rate: lineup[key].rating,
                                goal: goalAssistMinute.goal,
                                assist: goalAssistMinute.assist,
                                minute: goalAssistMinute.minute,
                                mom: lineup[key].mom,
                                kickoffDate: kickoffDate,
                                kickoffTime: kickoffTime,
                            });
                        }
                        return;
                    }
                }
                //not join match
                performances.push({
                    rate: null,
                    goal: null,
                    assist: null,
                    minute: null,
                    mom: null,
                    kickoffDate: kickoffDate,
                    kickoffTime: kickoffTime,
                });
            }, "json");
        } catch (err) {
            console.log('processMatch exception: ' + err);
        }
    }

    function checkGoalAssistMinute(report) {
        let goal = 0;
        let assist = 0;
        let inMinute = 0;
        let outMinute;
        let endMatchMinute;

        Object.keys(report).forEach(function (key, index) {
            endMatchMinute = key;
            var minuteArr = report[key];
            for (var i = 0; i < minuteArr.length; i++) {
                var paramArr = minuteArr[i].parameters;
                if (paramArr) {
                    for (var j = 0; j < paramArr.length; j++) {
                        var paramObj = paramArr[j];
                        if (paramObj.goal) {
                            if (paramObj.goal.player == playerId) {
                                goal++;
                            }
                            if (paramObj.goal.assist == playerId) {
                                assist++;
                            }
                        } else if (paramObj.sub && paramObj.sub.player_in && paramObj.sub.player_out) {
                            if (paramObj.sub.player_in == playerId) {
                                inMinute = key;
                            } else if (paramObj.sub.player_out == playerId) {
                                outMinute = key;
                            }
                        } else if (paramObj.red) {
                            if (paramObj.red == playerId) {
                                outMinute = key;
                            }
                        } else if (paramObj.yellow_red) {
                            if (paramObj.yellow_red == playerId) {
                                outMinute = key;
                            }
                        } else if (paramObj.injury) {
                            if (paramObj.injury == playerId) {
                                outMinute = key;
                            }
                        }
                    }
                }
            }
        });
        return {
            goal: goal,
            assist: assist,
            minute: outMinute != null ? outMinute - inMinute : endMatchMinute - inMinute,
        };
    }

    function setMatchCount() {
        let matchCount = $('#' + CONTROL_ID.INPUT_MATCH_COUNT)[0].value;
        if (matchCount == '') {
            localStorage.removeItem(APPLICATION_PARAM.MATCH_COUNT_LOCAL_STORAGE_KEY);
        } else if (isNaN(matchCount) || matchCount <= 0) {
            alert('Match count must be positive integer');
        } else {
            localStorage.setItem(APPLICATION_PARAM.MATCH_COUNT_LOCAL_STORAGE_KEY, matchCount);
            alert('Set successful, please refresh');
        }
    }

    function colorRate(value) {
        let color;
        if (value >= RATE_CLASS.LEVEL_7) {
            color = RATE_LEVEL_COLOR[6];
        } else if (value >= RATE_CLASS.LEVEL_6) {
            color = RATE_LEVEL_COLOR[5];
        } else if (value >= RATE_CLASS.LEVEL_5) {
            color = RATE_LEVEL_COLOR[4];
        } else if (value >= RATE_CLASS.LEVEL_4) {
            color = RATE_LEVEL_COLOR[3];
        } else if (value >= RATE_CLASS.LEVEL_3) {
            color = RATE_LEVEL_COLOR[2];
        } else if (value >= RATE_CLASS.LEVEL_2) {
            color = RATE_LEVEL_COLOR[1];
        } else if (value >= RATE_CLASS.LEVEL_1) {
            color = RATE_LEVEL_COLOR[0];
        }
        return color;
    }

    function colorTd(td, type, value) {
        if (value) {
            if (type == 'Rate') {
                if (value >= RATE_CLASS.LEVEL_7) {
                    td.style.color = RATE_LEVEL_COLOR[6];
                } else if (value >= RATE_CLASS.LEVEL_6) {
                    td.style.color = RATE_LEVEL_COLOR[5];
                } else if (value >= RATE_CLASS.LEVEL_5) {
                    td.style.color = RATE_LEVEL_COLOR[4];
                } else if (value >= RATE_CLASS.LEVEL_4) {
                    td.style.color = RATE_LEVEL_COLOR[3];
                } else if (value >= RATE_CLASS.LEVEL_3) {
                    td.style.color = RATE_LEVEL_COLOR[2];
                } else if (value >= RATE_CLASS.LEVEL_2) {
                    td.style.color = RATE_LEVEL_COLOR[1];
                } else if (value >= RATE_CLASS.LEVEL_1) {
                    td.style.color = RATE_LEVEL_COLOR[0];
                }
            }
        }
    }
})();
