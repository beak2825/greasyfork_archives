// ==UserScript==
// @name         TMVN League ALI
// @namespace    https://trophymanager.com
// @version      4
// @description  Trophymanager: calculate ALI (Average League Indicator) and the number of championships by teams. ALI show the average rank/division of the team. The smaller the ALI, the better the team's league record.
// @match        https://trophymanager.com/league/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418280/TMVN%20League%20ALI.user.js
// @updateURL https://update.greasyfork.org/scripts/418280/TMVN%20League%20ALI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const APP_COLOR = {
        LEVEL_1: "Darkred",
        LEVEL_2: "Black",
        LEVEL_3: "Yellow",
        LEVEL_4: "Blue",
        LEVEL_5: "Aqua",
        LEVEL_6: "White"
    };

    const CONTROL_ID = {
        INPUT_SEASON_COUNT: 'tmvn_league_ali_input_season_count',
        BUTTON_SEASON_COUNT: 'tmvn_league_ali_button_season_count_set',
    }

    const APPLICATION_PARAM = {
        DEFAULT_SEASON_COUNT: 0,
        SEASON_COUNT_LOCAL_STORAGE_KEY: "TMVN_LEAGUE_ALI_SEASON_COUNT"
    }
    var seasonCount = localStorage.getItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
    if (seasonCount == null || seasonCount == "") {
        seasonCount = APPLICATION_PARAM.DEFAULT_SEASON_COUNT;
    }

    try {
        $('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
    } catch (err) {}

    var clubLeagueMap = new Map();
    var clubMap = new Map();
    $('#overall_table td').each(function () {
        let clubId = $(this).children('a').attr('club_link');
        if (clubId) {
            let clubName = $(this).children('a')[0].innerHTML;
            clubMap.set(clubId, clubName);
        }
    });

    clubMap.forEach((value, key) => {
        $.ajax('https://trophymanager.com/history/club/league/' + key, {
            type: "GET",
            dataType: 'html',
            crossDomain: true,
            success: function (response) {
                var trArr = $('.zebra.hover.sortable tr', response);
                var totalAli = 0;

                var count = 0;
                var championMap = new Map();
                for (var i = 1; i < trArr.length; i++) {
                    var rank = trArr[i].lastElementChild.innerText;
                    if (rank !== "") {
                        count++;
                        var division = trArr[i].children[1].innerText.substring(0, 1);
                        if (rank == 1) {
                            if (championMap.has(division)) {
                                var championCount = championMap.get(division);
                                championCount++;
                                championMap.set(division, championCount);
                            } else {
                                championMap.set(division, 1);
                            }
                        }

                        totalAli = totalAli + 18 * (parseInt(division) - 1) + parseInt(rank);
                        if (seasonCount > 0 && seasonCount == count) {
                            break;
                        }
                    }
                }

                var champion = "";
                if (championMap.size > 0) {
                    var championDivision = [...championMap.keys()].sort();
                    championDivision.forEach((div) => {
                        if (div == 1) {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_1 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        } else if (div == 2) {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_2 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        } else if (div == 3) {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_3 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        } else if (div == 4) {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_4 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        } else if (div == 5) {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_5 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        } else {
                            champion += ("<span style = 'color: " + APP_COLOR.LEVEL_6 + ";'>" + div + "." + championMap.get(div) + " </span>");
                        }
                    });
                }

                var ali = "";
                if (count > 0) {
                    var aliAverage = Math.round(totalAli / count);

                    var divisionAverage = Math.ceil(aliAverage / 18);
                    var rankAverage = aliAverage - (18 * (divisionAverage - 1));

                    if (divisionAverage == 1) {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_1 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    } else if (divisionAverage == 2) {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_2 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    } else if (divisionAverage == 3) {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_3 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    } else if (divisionAverage == 4) {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_4 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    } else if (divisionAverage == 5) {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_5 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    } else {
                        ali = ("<span style = 'color: " + APP_COLOR.LEVEL_6 + ";'>" + aliAverage + " (" + divisionAverage + "." + rankAverage + ") </span>");
                    }
                }

                clubLeagueMap.set(key, {
                    "ALI": ali,
                    "Champion": champion,
                    "SeasonCount": count
                });
            },
            error: function (e) {}
        });
    });

    var myInterval = setInterval(append, 1000);

    function append() {
        if (clubLeagueMap.size < 18) {
            return;
        }
        clearInterval(myInterval);

        /*APPEND ALI TABLE*/
        let ali =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">Average League Indicator</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_SEASON_COUNT + "' type='text' class='embossed' style='min-width: 100px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Season Count'></span>" +
            "<span id='" + CONTROL_ID.BUTTON_SEASON_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Season Count</span></span>" +
            "<div id=\"ali_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";
        $(".column3_a").append(ali);
        document.getElementById(CONTROL_ID.BUTTON_SEASON_COUNT).addEventListener('click', (e) => {
            setSeasonCount();
        });
        $('#' + CONTROL_ID.INPUT_SEASON_COUNT).val(seasonCount);

        let ali_content = "<table>" +
            "<tr><th>Club</th><th align='right'>ALI</th><th align='right'>#1</th></tr>";

        let rowCount = 0;
        clubMap.forEach((value, key) => {
            rowCount++;
            let classOdd = "";
            if ((rowCount % 2) == 1) {
                classOdd = "class='odd'";
            }
            if (clubLeagueMap.has(key)) {
                let clubLeague = clubLeagueMap.get(key);

                value = '<span style="color:Orange;">' + clubLeague.SeasonCount + '.</span>' + value;
                ali_content += "<tr " + classOdd + "><td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/history\/club\/league\/" + key + "\')\">" + value + "</span></td><td align='right'>" +
                clubLeague.ALI +
                "</td><td align='right'><span style='color:Orange;'>" +
                clubLeague.Champion +
                "</span></td></tr>";
            } else {
                ali_content += "<tr " + classOdd + "><td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/history\/club\/league\/" + key + "\')\">" + value + "</span></td><td></td><td></td><td></td></tr>";
            }
        });

        ali_content += "</table>";

        $("#ali_content").append(ali_content);
    }

    function setSeasonCount() {
        let seasonCount = $('#' + CONTROL_ID.INPUT_SEASON_COUNT)[0].value;
        let valid = true;
        if (seasonCount == '') {
            localStorage.removeItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
        } else if (isNaN(seasonCount) || seasonCount < 0) {
            alert('Season count must be positive integer. Season count = 0 means all seasons.');
            valid = false;
        } else {
            localStorage.setItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY, seasonCount);
        }
        if (valid) {
            alert('Set successful, please refresh');
        }
    }
})();
