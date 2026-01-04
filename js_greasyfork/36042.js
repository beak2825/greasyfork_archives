// ==UserScript==
// @name         Do You Even Play, Bro?
// @namespace    https://www.steamgifts.com/user/kelnage
// @version      1.6.5
// @description  Display playing stats for SteamGifts users
// @author       kelnage
// @match        https://www.steamgifts.com/user/*/giveaways/won*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      self
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @connect      howlongtobeat.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.js
// @downloadURL https://update.greasyfork.org/scripts/36042/Do%20You%20Even%20Play%2C%20Bro.user.js
// @updateURL https://update.greasyfork.org/scripts/36042/Do%20You%20Even%20Play%2C%20Bro.meta.js
// ==/UserScript==

var CURRENT_VERSION = [1,6,5];

var username = $(".featured__heading__medium").text();
var userID64 = $('[data-tooltip="Visit Steam Profile"]').attr("href").match(/https?:\/\/steamcommunity.com\/profiles\/([0-9]*)/)[1];

var WINS_URL = "https://www.steamgifts.com/user/" + username + "/giveaways/won/search";
var PLAYTIME_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"; // takes a steamid and API key
var ACHIEVEMENTS_URL = "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/"; // takes a steamid, appid and API key
var HLTB_URL = "https://howlongtobeat.com/search_main.php"; // takes a (POST) queryString and (GET) page number
var STEAM_API_KEY = GM_getValue("DYEPB_API_KEY");
var API_KEY_REGEXP = /[0-9A-Z]{32}/;
var WAIT_MILLIS = 500;

var PLAYTIME_CACHE_KEY = "DYEPB_PLAYTIME_CACHE_" + encodeURIComponent(username),
    ACHIEVEMENT_CACHE_KEY = "DYEPB_ACHIEVEMENT_CACHE_" + encodeURIComponent(username),
    WINS_CACHE_KEY = "DYEPB_WINS_CACHE_" + encodeURIComponent(username),
    LAST_CACHE_KEY = "DYEPB_LAST_CACHED_" + encodeURIComponent(username),
    USER_CACHE_VERSION_KEY = "DYEPB_USER_CACHE_VERSION_" + encodeURIComponent(username),
    SUB_APPID_CACHE_KEY = "DYEPB_SUB_APPID_CACHE",
    SUB_APPID_CACHE_VERSION_KEY = "DYEPB_SUB_APPID_CACHE_VERSION",
    CHART_TEXT_PREFERENCE = "DYEPB_CHART_TEXT",
    EXPECTED_PLAYTIME_CACHE_KEY = "DYEPB_HLTB_CACHE",
    DISABLE_HLTB_KEY = "DYEPB_DISABLE_HLTB";

var $percentage = $('<div class="featured__table__row__right"></div>'),
    $average_total_playtime = $('<div class="featured__table__row__right"></div>'),
    $playtime_any_counts = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $playtime_5_10_counts = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $playtime_expectation_below = $('<span></span>'),
    $playtime_expectation_between = $('<span></span>'),
    $playtime_expectation_above = $('<span></span>'),
    $playtime_expectation = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $achievement_any_counts = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $achievement_counts_chart = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $achievement_25_100_counts = $('<div class="featured__table__row__right" style="text-align: right"></div>'),
    $last_updated = $('<span title="" style="color: rgba(255,255,255,0.4)"></span>'),
    $disable_hltb = $('<input type="checkbox" id="disable_hltb" name="disable_hltb" value="disable_hltb" style="width: auto; margin: 0px 0.5em">'),
    $hltb_left_row = $('<div class="featured__table__row"></div>'),
    $progress_text = $('<span style="margin-left: 0.3em"></span>'),
    $rm_key_link = $('<a style="margin-left: 0.5em;color: rgba(255,255,255,0.6)" href="#">Delete cached data</a>'),
    $toolbar = $('<div id="sg_dyepb_toolbar" style="color: rgba(255,255,255,0.4)" class="nav__left-container"></div>'),
    $fetch_button = $('<a class="nav__button" href="#">' + (GM_getValue(LAST_CACHE_KEY) ? 'Update Playing Info' : 'Fetch Playing Info' ) + '</a>'),
    $key_button = $('<a class="nav__button" href="#">Provide API Key</a>'),
    $button_container = $('<div class="nav__button-container"></div>'),
    $hltb_status_container = $('<div id="dyepb_hltb_status"></div>'),
    $progress_container = $('<div id="dyepb_progress" style="margin: 0.5em 0"><img src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif" height="10px" width="10px" /></div>'),
    $chart_text_switch = $('<a href="#" style="font-size: smaller">chart</a>');

var playtimeCache = {},
    achievementCache = {},
    winsCache = {},
    subAppIdsCache = {},
    expectedPlaytimeCache = {},
    activeRequests = 0,
    errorCount = 0,
    run_status = "STOPPED"; // can be STOPPED, PLAYTIME, WON_GAMES, ACHIEVEMENTS

if(JSON.parse(GM_getValue(USER_CACHE_VERSION_KEY, "[0,0,0]")) > [1,3,2]) { // Ignore caches from versions older than 1.3.3
    if(GM_getValue(PLAYTIME_CACHE_KEY)) {
        playtimeCache = JSON.parse(GM_getValue(PLAYTIME_CACHE_KEY));
    }
    if(GM_getValue(ACHIEVEMENT_CACHE_KEY)) {
        achievementCache = JSON.parse(GM_getValue(ACHIEVEMENT_CACHE_KEY));
    }
    if(GM_getValue(WINS_CACHE_KEY)) {
        var tempWinsCache = JSON.parse(GM_getValue(WINS_CACHE_KEY));
        if(Array.isArray(tempWinsCache)) { // convert old array into an object
            for(var i = 0; i < tempWinsCache.length; i++) {
                winsCache['a'+tempWinsCache[i].appid] = tempWinsCache[i].appid;
            }
        } else {
            winsCache = tempWinsCache;
        }
    }
    if(GM_getValue(EXPECTED_PLAYTIME_CACHE_KEY)) {
        expectedPlaytimeCache = JSON.parse(GM_getValue(EXPECTED_PLAYTIME_CACHE_KEY));
    }
}
if(GM_getValue(SUB_APPID_CACHE_KEY)) {
    if(JSON.parse(GM_getValue(SUB_APPID_CACHE_VERSION_KEY, "[0,0,0]")) > [1,3,2]) { // Ignore caches from versions older than 1.3.3
        subAppIdsCache = JSON.parse(GM_getValue(SUB_APPID_CACHE_KEY));
    }
}

var errorFn = function(response) {
    activeRequests -= 1;
    errorCount += 1;
    console.log("Error details: ", response);
};

var maxIndex = function(arr, val) {
    var i = arr.length - 1;
    while(i >= 0) {
        if(arr[i] == val) { return i; }
        i--;
    }
    return 0;
};

var summaryStats = function(arr) {
    var total = arr.reduce(function(x, y) { return x + y; }, 0),
        min = Math.min(...arr),
        max = Math.max(...arr);
    return {"min": min, "median": (min + max) / 2, "mean": total / arr.length, "max": max, "total": total} ;
};

var formatPercentage = function(x, per, precision) {
    if(isNaN(x / per)) {
        return "N/A";
    }
    return Number(x / per * 100).toPrecision(precision) + "%";
};

var formatMinutes = function(mins) {
    if(isNaN(mins)) {
        return "N/A";
    }
    if(mins < 60) {
        return mins.toPrecision(2) + " minutes";
    } else {
        var hours = mins / 60;
        if(hours < 99.5) {
            return hours.toPrecision(2) + " hours";
        } else if(hours < 999.5) {
            return hours.toPrecision(3) + " hours";
        } else if(hours < 9999.5) {
            return hours.toPrecision(4) + " hours";
        } else {
            return hours.toPrecision(5) + " hours";
        }
    }
};

var formatMinutesRange = function(min, max) {
    var min_time = formatMinutes(min),
        max_time = formatMinutes(max);
    if(min_time == max_time) {
        return min_time;
    } else {
        if(min_time.substr(-5) == max_time.substr(-5)) {
            min_time = min_time.replace(/ .*$/, "");
        }
        return min_time + "-" + max_time;
    }
};

var parseHLTBPlaytime = function(time) {
    if(time === "--") {
        return null;
    }
    time = time.replace(/½/, ".5");
    if(time.match(/[Mm]in/)) {
        return parseFloat(time);
    }
    if(time.match(/[Hh]our/)) {
        return parseFloat(time) * 60;
    }
    return null;
};

var enhanceRow = function($heading, minutesPlayed, achievementCounts, minExpectedPlaytime, maxExpectedPlaytime, appid, hltb_id, hltb_game) {
    var $playtimeSpan = $heading.find(".dyegb_playtime"), $achievementSpan = $heading.find(".dyegb_achievement"), $expectedPlaytimeSpan = $heading.find(".dyegb_exp_playtime");
    if(minutesPlayed) {
        if($playtimeSpan.length > 0) {
            $playtimeSpan.text(formatMinutes(minutesPlayed));
        } else {
            $playtimeSpan = $('<span class="dyegb_playtime giveaway__heading__thin">' + formatMinutes(minutesPlayed) + '</span>');
            $heading.append($playtimeSpan);
        }
    }
    if(hltb_id) {
        if($expectedPlaytimeSpan.length > 0) {
            if(minExpectedPlaytime) {
                $expectedPlaytimeSpan.find(".dyegb_exp_playtime_value").text(formatMinutesRange(minExpectedPlaytime, maxExpectedPlaytime));
            } else {
                $expectedPlaytimeSpan.remove();
            }
        } else if(minExpectedPlaytime) {
            if($playtimeSpan.length > 0) {
                $expectedPlaytimeSpan = $('<span class="dyegb_exp_playtime giveaway__heading__thin" title="HLTB stats for ' +
                                          hltb_game + '"><a target="_blank" href="https://howlongtobeat.com/game.php?id=' +
                                          hltb_id + '">(<span class="dyegb_exp_playtime_value">' +
                                          formatMinutesRange(minExpectedPlaytime, maxExpectedPlaytime) + '</span>)</a></span>');
                $playtimeSpan.append($expectedPlaytimeSpan);
            } else {
                $expectedPlaytimeSpan = $('<span class="dyegb_exp_playtime giveaway__heading__thin" title="HLTB stats for ' +
                                          hltb_game + '">HLTB: <a target="_blank" href="https://howlongtobeat.com/game.php?id=' +
                                          hltb_id + '"><span class="dyegb_exp_playtime_value">' +
                                          formatMinutesRange(minExpectedPlaytime, maxExpectedPlaytime) + '</span></a></span>');
                $heading.append($expectedPlaytimeSpan);
            }
        }
    }
    if(GM_getValue(DISABLE_HLTB_KEY, false)) {
        $expectedPlaytimeSpan.css("display", "none");
    } else {
        $expectedPlaytimeSpan.css("display", "inline");
    }
    if(achievementCounts && achievementCounts.total > 0) {
        if($achievementSpan.length === 0) {
            $achievementSpan = $('<a href="https://steamcommunity.com/profiles/'+userID64+'/stats/'+appid+'/?tab=achievements" target="_new" class="dyegb_achievement giveaway__heading__thin">' +
                                 formatPercentage(achievementCounts.achieved, achievementCounts.total, 3) + '</a>');
            $heading.append($achievementSpan);
        }
        if(achievementCounts.achieved === 0) {
            $achievementSpan.text("0%");
        } else {
            $achievementSpan.attr('style', "font-weight: bold");
            $achievementSpan.text(formatPercentage(achievementCounts.achieved, achievementCounts.total, 3));
            $achievementSpan.attr('title', achievementCounts.achieved + '/' + achievementCounts.total + ' achievements');
            if(achievementCounts.achieved == achievementCounts.total) {
                $achievementSpan.attr('style', "font-weight: bold; color: rgb(91, 192, 222)");
            } else {
                $achievementSpan.addClass("giveaway__column--positive");
            }
        }
    }
};

var enhanceWonGames = function() {
    var $rows = $(".giveaway__row-inner-wrap");
    $rows.each(function() {
        var $this = $(this), $heading = $this.find(".giveaway__heading"),
            $ga_icon = $this.find("a.giveaway__icon:has(i.fa-steam)");
        if($ga_icon && $ga_icon.attr("href")) {
            var id = $ga_icon.attr("href").match(/https?:\/\/store.steampowered.com\/([^\/]*)\/([0-9]*)/);
            if(id[1] == "sub" || id[1] == "subs") {
                var totalMinutes = 0, totalAchievements = {achieved: 0, total: 0}, bestAchievementAppid = null, topCompletion = null,
                    minExpectedPlaytime = 0, maxExpectedPlaytime = 0, highestExpectedPlaytime = null, bestPlaytimeId = null, bestPlaytimeGame = null;
                if(subAppIdsCache['s'+id[2]]) {
                    var appids = subAppIdsCache['s'+id[2]];
                    for(var i = 0; i < appids.length; i++) {
                        if(playtimeCache['a'+appids[i]]) {
                            totalMinutes += playtimeCache['a'+appids[i]];
                        }
                        if(achievementCache['a'+appids[i]]) {
                            totalAchievements.achieved += achievementCache['a'+appids[i]].achieved;
                            totalAchievements.total += achievementCache['a'+appids[i]].total;
                            if(topCompletion === null || achievementCache['a'+appids[i]].achieved / achievementCache['a'+appids[i]].total > topCompletion) {
                                topCompletion = achievementCache['a'+appids[i]].achieved / achievementCache['a'+appids[i]].total;
                                bestAchievementAppid = appids[i];
                            }
                        }
                        if(expectedPlaytimeCache['a'+appids[i]]) {
                            var substats = summaryStats(expectedPlaytimeCache['a'+appids[i]].times);
                            minExpectedPlaytime += substats.min;
                            maxExpectedPlaytime += substats.max;
                            if(highestExpectedPlaytime === null || maxExpectedPlaytime > highestExpectedPlaytime) {
                                highestExpectedPlaytime = maxExpectedPlaytime;
                                bestPlaytimeId = expectedPlaytimeCache['a'+appids[i]].hltb_id;
                                bestPlaytimeGame = expectedPlaytimeCache['a'+appids[i]].hltb_game;
                            }
                        }
                    }
                }
                enhanceRow($heading, totalMinutes, totalAchievements, minExpectedPlaytime, maxExpectedPlaytime, bestAchievementAppid, bestPlaytimeId, bestPlaytimeGame);
            }
            if(id[1] == "app" || id[1] == "apps") {
                if(expectedPlaytimeCache['a'+id[2]]) {
                    var stats = {};
                    if(expectedPlaytimeCache['a'+id[2]].times.length > 0) {
                        stats = summaryStats(expectedPlaytimeCache['a'+id[2]].times);
                    }
                    enhanceRow($heading, playtimeCache['a'+id[2]], achievementCache['a'+id[2]], stats.min, stats.max, id[2], expectedPlaytimeCache['a'+id[2]].hltb_id, expectedPlaytimeCache['a'+id[2]].hltb_game);
                } else {
                    enhanceRow($heading, playtimeCache['a'+id[2]], achievementCache['a'+id[2]], undefined, undefined, id[2], undefined, undefined);
                }
            }
        }
    });
};

var updateTableStats = function() {
    var achievement_percentage_sum = 0, achievement_game_count = 0, achieved_game_count = 0,
        achieved_game_count_25 = 0, achieved_game_count_100 = 0, achieved_game_cumulative = [],
        playtime_total = 0, playtime_game_count = 0, playtime_game_count_5h = 0, playtime_game_count_10h = 0,
        win_count = 0, achievement_playtime_total = 0, achievement_playtime_count = 0,
        expected_less_than_min = 0, expected_total_less_distance = 0, expected_between_min_max = 0, expected_greater_than_max = 0, expected_total_greater_distance = 0,
        expected_playtime_count = 0, expected_below = "", expected_between = "", expected_above = "";
    var i = 0;
    while(i < 101) {
        achieved_game_cumulative[i] = 0;
        i++;
    }
    $.each(winsCache, function(aid, details) {
        var achievement_counts = achievementCache[aid];
        if(achievement_counts && achievement_counts.total > 0) {
            achievement_game_count += 1;
            if(achievement_counts.achieved > 0) {
                var ratio = achievement_counts.achieved / achievement_counts.total;
                achievement_percentage_sum += ratio;
                achieved_game_count += 1;
                if(achievement_counts.achieved >= (achievement_counts.total / 4)) {
                    achieved_game_count_25 += 1;
                }
                if(achievement_counts.achieved === achievement_counts.total) {
                    achieved_game_count_100 += 1;
                }
            }
            var j = 0, percentage = Math.round(achievement_counts.achieved / achievement_counts.total * 100);
            while(j <= percentage) {
                achieved_game_cumulative[j] += 1;
                j++;
            }
        }
        if(playtimeCache[aid] !== undefined) {
            win_count += 1;
            playtime_total += playtimeCache[aid];
            if(playtimeCache[aid] > 0) {
                playtime_game_count += 1;
            }
            if(playtimeCache[aid] >= 300) {
                playtime_game_count_5h += 1;
            }
            if(playtimeCache[aid] >= 600) {
                playtime_game_count_10h += 1;
            }
            if(playtimeCache[aid] > 0 && expectedPlaytimeCache[aid] && expectedPlaytimeCache[aid].times.length > 0) {
                expected_playtime_count += 1;
                var stats = summaryStats(expectedPlaytimeCache[aid].times);
                if(playtimeCache[aid] < stats.min) {
                    expected_less_than_min += 1;
                    expected_total_less_distance += stats.min - playtimeCache[aid];
                    expected_below += details.name + "\n";
                } else if(playtimeCache[aid] > stats.max) {
                    expected_greater_than_max += 1;
                    expected_total_greater_distance += playtimeCache[aid] - stats.max;
                    expected_above += details.name + "\n";
                } else {
                    expected_between_min_max += 1;
                    expected_between += details.name + "\n";
                }
            }
        }
        if(achievement_counts && achievement_counts.total > 0 && playtimeCache[aid]) {
            achievement_playtime_total += playtimeCache[aid];
            achievement_playtime_count += achievement_counts.achieved;
        }
    });
    if(achieved_game_count > 0) {
        $percentage.text(formatPercentage(achievement_percentage_sum, achieved_game_count, 3));
    } else {
        $percentage.text("N/A");
    }
    if(expected_playtime_count > 0) {
        $playtime_expectation.empty();
        $playtime_expectation.append($playtime_expectation_below);
        $playtime_expectation.append($playtime_expectation_between);
        $playtime_expectation.append($playtime_expectation_above);
        $playtime_expectation_below.text(expected_less_than_min + ' below (' + formatMinutes(expected_total_less_distance / expected_less_than_min) + ' avg.), ');
        $playtime_expectation_below.attr("title", expected_below.replace(/\n$/, ""));
        $playtime_expectation_between.text(expected_between_min_max + ' between, ');
        $playtime_expectation_between.attr("title", expected_between.replace(/\n$/, ""));
        $playtime_expectation_above.text(expected_greater_than_max + ' above (' + formatMinutes(expected_total_greater_distance / expected_greater_than_max) + ' avg.)');
        $playtime_expectation_above.attr("title", expected_above.replace(/\n$/, ""));
    } else {
        $playtime_expectation.empty();
        $playtime_expectation.text("N/A");
    }
    if(playtime_game_count !== win_count) {
        $average_total_playtime.text(formatMinutes(playtime_total / win_count) + ' per win, ' +
                                     formatMinutes(playtime_total / playtime_game_count) + ' per played win, ' +
                                     formatMinutes(playtime_total) + ' total');
    } else {
        $average_total_playtime.text(formatMinutes(playtime_total / win_count) + ' in all wins, ' +
                                     formatMinutes(playtime_total) + ' total');
    }
    $playtime_any_counts.text(formatPercentage(playtime_game_count, win_count, 3) +
                              ' (' + playtime_game_count + '/' + win_count + ')');
    $playtime_5_10_counts.text('≥5 hours: ' + formatPercentage(playtime_game_count_5h, win_count, 3) +
                               ' (' + playtime_game_count_5h + '/' + win_count +
                               '), ≥10 hours: ' + formatPercentage(playtime_game_count_10h, win_count, 3) +
                               ' (' + playtime_game_count_10h + '/' + win_count + ')');
    $achievement_any_counts.text(formatPercentage(achieved_game_count, achievement_game_count, 3) +
                                 ' (' + achieved_game_count + '/' + achievement_game_count + ')');
    $achievement_counts_chart.sparkline(
        achieved_game_cumulative,
        {'type': 'line', 'lineColor': 'rgba(255, 255, 255, 0.6)', 'fillColor': 'rgba(255, 255, 255, 0.4)', 'chartRangeMin': 0, 'height': 18,
         'spotColor': 'rgb(153,204,102)', 'minSpotColor': 'rgb(153,204,102)', 'maxSpotColor': 'rgb(153,204,102)', 'tooltipOffsetX': -60, 'tooltipOffsetY': 25,
        'tooltipFormatter': function(sparkline, options, fields) {
            return maxIndex(achieved_game_cumulative, fields.y) +  '% complete: ' + formatPercentage(fields.y, achievement_game_count, 3) + ' (' + fields.y + '/' + achievement_game_count + ')';
        }});
    $achievement_counts_chart.css(
        'background',
        'linear-gradient(to right, transparent calc(25%), rgba(255,0,0,0.5) calc(25% + 2px), transparent calc(25% + 4px), transparent calc(50% - 2px), rgba(255,0,0,0.5) calc(50%), transparent calc(50% + 2px), transparent calc(75% - 3px), rgba(255,0,0,0.5) calc(75% - 1px), transparent calc(75% + 1px))');
    $achievement_25_100_counts.text(
        '≥25% complete: ' + formatPercentage(achieved_game_count_25, achievement_game_count, 3) +
        ' (' + achieved_game_count_25 + '/' + achievement_game_count +
        '), completed: ' + formatPercentage(achieved_game_count_100, achievement_game_count, 3) +
        ' (' + achieved_game_count_100 + '/' + achievement_game_count + ')');
    if(GM_getValue(DISABLE_HLTB_KEY, false)) {
        $hltb_left_row.css("display", "none");
    } else {
        $hltb_left_row.css("display", "flex");
    }
};

var updateDisplayedCacheDate = function(t) {
    if(t) {
        $last_updated.text('Last retrieved: ' + t.toLocaleDateString() + (errorCount > 0 ? ", with " + errorCount + " API query errors" : ""));
        $last_updated.attr('title', t.toLocaleString());
    }
};

var displayButtons = function() {
    if(!API_KEY_REGEXP.test(STEAM_API_KEY)) {
        $button_container.show();
        $hltb_status_container.hide();
        $progress_container.hide();
        $key_button.show();
        $fetch_button.hide();
        $last_updated.empty();
        $last_updated.attr("title", "");
        $last_updated.show();
        $last_updated.append('<a style="color: rgba(255,255,255,0.6)" target="_blank" href="https://steamcommunity.com/dev/apikey">Click here to obtain a Steam API key</a>');
        $rm_key_link.hide();
    } else if(run_status == "STOPPED") {
        $button_container.show();
        $hltb_status_container.show();
        $progress_container.hide();
        $fetch_button.show();
        $key_button.hide();
        $last_updated.empty(); // will be updated by updateDisplayedCacheDate
        $last_updated.show();
        if(GM_getValue(LAST_CACHE_KEY)) {
            $fetch_button.text("Update Playing Info");
            updateDisplayedCacheDate(new Date(GM_getValue(LAST_CACHE_KEY)));
        } else {
            $fetch_button.text("Fetch Playing Info");
        }
        $rm_key_link.show();
    } else {
        $button_container.hide();
        $hltb_status_container.hide();
        $progress_container.show();
        if(run_status == "PLAYTIMES") {
            $progress_text.text("Retrieving " + username + "'s logged playing times");
        } else if(run_status == "WON_GAMES") {
            $progress_text.text("Retrieving " + username + "'s won games");
        } else if(run_status == "ACHIEVEMENTS") {
            $progress_text.text("Retrieving " + username + "'s achievement " + (GM_getValue(DISABLE_HLTB_KEY, false) ? '' : 'and HLTB ') + "progress (" + activeRequests + " games left to check)");
        }
        $last_updated.hide();
        $rm_key_link.hide();
    }
};

var updatePage = function(update_time) {
    enhanceWonGames();
    updateTableStats();
    displayButtons();
    updateDisplayedCacheDate(update_time);
};

var extractSubGames = function(sub, page) {
    subAppIdsCache['s'+sub] = [];
    $(".tab_item", page).each(function(i, e) {
        var $this = $(e),
            appId = $this.attr("data-ds-appid"),
            name = $this.find(".tab_item_name").text(),
            $link = $this.find(".tab_item_overlay");
        if($link.attr("href") && (!winsCache['a'+appId] || !winsCache['a'+appId].appid)) {
            var type = $link.attr("href").match(/https?:\/\/store.steampowered.com\/([^\/]*)\/[0-9]*/);
            winsCache['a'+appId] = {'appid': appId, 'name': name};
        }
        subAppIdsCache['s'+sub].push(appId);
    });
};

var extractWon = function(page) {
    var extractCount = 0;
    $(".giveaway__row-inner-wrap", page)
        .filter(function(i) {
            return $(this).find("div.giveaway__column--positive").length == 1;
        })
        .each(function(i, e) {
            var $ga_name = $(e).find("a.giveaway__heading__name"),
                $ga_icon = $(e).find("a.giveaway__icon:has(i.fa-steam)");
            if($ga_icon.length === 1 && $ga_icon.attr("href")) {
                var url = $ga_icon.attr("href"),
                    id = url.match(/https?:\/\/store.steampowered.com\/([^\/]*)\/([0-9]*)/),
                    name = $ga_name.text();
                if(name.endsWith("...") && name.length > 3) {
                    name = name.substr(0, name.length - 3);
                }
                if((id[1] == "sub" || id[1] == "subs") && (!subAppIdsCache['s'+id[2]] || subAppIdsCache['s'+id[2]].length === 0|| !subAppIdsCache['s'+id[2]][0].appid)) { // only fetch appids for uncached-subs - do subs ever change? Probably...
                    activeRequests += 1;
                    GM_xmlhttpRequest({
                        "method": "GET",
                        "url": url,
                        "onload": function(response) {
                            if(response.finalUrl === url) { // if not, probably got redirected to Steam homepage
                                extractSubGames(id[2], response.responseText);
                            } else {
                                console.log("Could not get details for sub " + id[2]);
                            }
                            activeRequests -= 1;
                        },
                        "onabort": errorFn,
                        "onerror": errorFn,
                        "ontimeout": errorFn
                    });
                    extractCount += 1;
                } else if((id[1] == "app" || id[1] == "apps") && (!winsCache['a'+id[2]] || !winsCache['a'+id[2]].appid)) {
                    winsCache['a'+id[2]] = {'appid': id[2], 'name': name};
                    extractCount += 1;
                }
            }
        });
    return extractCount;
};

var fetchWon = function(page, callback) {
    activeRequests += 1;
    GM_xmlhttpRequest({
        "method": "GET",
        "url": WINS_URL + "?page=" + page,
        "onload": function(response) {
            var count = extractWon(response.responseText);
            // stop fetching pages if no new wins found on current page
            if($("div.pagination__navigation > a > span:contains('Next')", response.responseText).length === 1 && count > 0) {
                setTimeout(function() {
                    fetchWon(page + 1, callback);
                }, WAIT_MILLIS);
            } else {
                callback();
            }
            activeRequests -= 1;
        },
        "onabort": errorFn,
        "onerror": errorFn,
        "ontimeout": errorFn
    });
};

var fetchGamePlaytimes = function(steamID64, callback) {
    activeRequests += 1;
    GM_xmlhttpRequest({
        "method": "GET",
        "url": PLAYTIME_URL + "?steamid=" + steamID64 + "&key=" + STEAM_API_KEY,
        "onload": function(response) {
            var data;
            try {
                 data = JSON.parse(response.responseText);
            } catch(err) {
                errorFn({"status": response.status, "responseText": response.responseText});
            }
            if(data) {
                var games = data.response.games;
                if(games) {
                    for(var i = 0; i < games.length; i++) {
                        playtimeCache["a"+games[i].appid] = games[i].playtime_forever;
                    }
                }
                activeRequests -= 1;
                callback();
            }
        },
        "onabort": errorFn,
        "onerror": errorFn,
        "ontimeout": errorFn
    });
};

var fetchAchievementStatsFn = function(appid, steamID64) {
    return function() {
        GM_xmlhttpRequest({
            "method": "GET",
            "url": ACHIEVEMENTS_URL + "?appid=" + appid + "&steamid=" + steamID64 + "&key=" + STEAM_API_KEY,
            "onload": function(response) {
                var data;
                try {
                    data = JSON.parse(response.responseText);
                } catch(err) {
                    errorFn({"status": response.status, "responseText": response.responseText});
                }
                if(data) {
                    achievements = data.playerstats.achievements;
                    if(achievements) {
                        var achieved = achievements.filter(function(achievement) { return achievement.achieved == 1; }).length;
                        var total = achievements.length;
                        achievementCache["a"+appid] = {"achieved": achieved, "total": total};
                    } else {
                        achievementCache["a"+appid] = {"achieved": 0, "total": 0};
                    }
                    activeRequests -= 1;
                }
            },
            "onabort": errorFn,
            "onerror": errorFn,
            "ontimeout": errorFn
        });
    };
};

var fetchExpectedPlaytimes = function(appid, game_name) {
    return function() {
        if(game_name.match(/[^\w\s-_:]/)) {
            game_name = game_name.replace(/[^-\w\s_:]/g, "");
        }
        GM_xmlhttpRequest({
            "method": "POST",
            "url": HLTB_URL + '?page=1',
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': '*/*'
            },
            "data": 'queryString='+encodeURIComponent(game_name)+'&t=games&sorthead=popular&sortd=Normal&20Order&plat=PC&length_type=main&length_min=&length_max=&detail=0',
            "onload": function(response) {
                var data = {"cache_date": Date.now()};
                try {
                    var $result = $('<ul>' + response.responseText + '</ul>').find('li:first');
                    if($result.text().startsWith("No results for")) {
                        data.search_term = $result.find("strong:first").text();
                        data.times = [];
                        console.log("Could not find details for:", data.search_term);
                    } else {
                        var times = $result.find(".search_list_details_block .search_list_tidbit").filter(":odd").map(function() { return $(this).text(); }).get(),
                            $game_link = $result.find("h3.shadow_text a");
                        data.search_term = game_name;
                        data.hltb_game = $game_link.text();
                        data.hltb_id = $game_link.attr('href').replace(/^game\.php\?id=/g, '');
                        data.times = times.map(parseHLTBPlaytime).filter(function(x) { return x !== null; });
                    }
                    expectedPlaytimeCache['a'+appid] = data;
                    activeRequests -= 1;
                } catch(err) {
                    errorFn({"status": response.status, "responseText": response.responseText, "error": err.message});
                }
            },
            "onabort": errorFn,
            "onerror": errorFn,
            "ontimeout": errorFn
        });
    };
};

var cacheJSONValue = function(key, value) {
    GM_setValue(key, JSON.stringify(value));
    var updateTime = new Date();
    GM_setValue(LAST_CACHE_KEY, updateTime.getTime());
    updatePage(updateTime);
};

(function() {
    'use strict';

    var $featured_table = $(".featured__table"),
        $featured_table_col1 = $featured_table.children(":first-child"),
        $featured_table_col2 = $featured_table.children(":last-child");

    var $left_row_1 = $('<div class="featured__table__row"></div>'),
        $left_row_2 = $('<div class="featured__table__row"></div>'),
        $left_row_3 = $('<div class="featured__table__row"></div>'),
        $right_row_1 = $('<div class="featured__table__row"></div>'),
        $right_row_2 = $('<div class="featured__table__row"></div>'),
        $right_row_3 = $('<div class="featured__table__row"></div>');
    $toolbar.append($button_container);
    $button_container.append($key_button);
    $button_container.append($fetch_button);
    $toolbar.append($hltb_status_container);
    $hltb_status_container.append($disable_hltb);
    $hltb_status_container.append('<label style="margin-right: 0.5em" for="disable_hltb">Disable HLTB enrichment?</label>');
    $toolbar.append($progress_container);
    $progress_container.append($progress_text);
    $toolbar.append($last_updated);
    $toolbar.append($rm_key_link);
    $left_row_1.append('<div class="featured__table__row__left">Average and Total Playtime</div>');
    $left_row_1.append($average_total_playtime);
    $left_row_2.append('<div class="featured__table__row__left">Games with any Playtime</div>');
    $left_row_2.append($playtime_any_counts);
    $left_row_3.append('<div class="featured__table__row__left">Games with Playtime...</div>');
    $left_row_3.append($playtime_5_10_counts);
    $hltb_left_row.append('<div class="featured__table__row__left">Compared to HLTB Estimates</div>');
    $hltb_left_row.append($playtime_expectation);
    $right_row_1.append('<div class="featured__table__row__left">Avg. Achievement Percentage</div>');
    $right_row_1.append($percentage);
    $right_row_2.append('<div class="featured__table__row__left">Games with ≥1 Achievement</div>');
    $right_row_2.append($achievement_any_counts);
    var $achievement_games = $('<div class="featured__table__row__left">Achievement Rates </div>');
    $achievement_games.append($chart_text_switch);
    $right_row_3.append($achievement_games);
    $right_row_3.append($achievement_25_100_counts);
    $right_row_3.append($achievement_counts_chart);
    if(GM_getValue(CHART_TEXT_PREFERENCE, "text") == "text") {
        $achievement_counts_chart.hide();
        $chart_text_switch.text('chart');
    } else {
        $achievement_25_100_counts.hide();
        $chart_text_switch.text('text');
    }
    if(GM_getValue(DISABLE_HLTB_KEY, false)) {
        $disable_hltb.prop("checked", true);
    } else {
        $disable_hltb.prop("checked", false);
    }
    $featured_table_col1.append($left_row_1).append($left_row_2).append($left_row_3).append($hltb_left_row);
    $featured_table_col2.append($right_row_1).append($right_row_2).append($right_row_3);
    $featured_table.after($toolbar);

    updatePage(GM_getValue(LAST_CACHE_KEY) ? new Date(GM_getValue(LAST_CACHE_KEY)) : null);

    $disable_hltb.change(function(e) {
        GM_setValue(DISABLE_HLTB_KEY, this.checked);
        updatePage();
    });

    $chart_text_switch.click(function(e) {
        e.preventDefault();
        if(GM_getValue(CHART_TEXT_PREFERENCE, "text") == "text") {
            // switch to chart
            $achievement_counts_chart.show();
            $achievement_25_100_counts.hide();
            $.sparkline_display_visible();
            GM_setValue(CHART_TEXT_PREFERENCE, "chart");
            $chart_text_switch.text("text");
        } else {
            // switch to text
            $achievement_counts_chart.hide();
            $achievement_25_100_counts.show();
            GM_setValue(CHART_TEXT_PREFERENCE, "text");
            $chart_text_switch.text("chart");
        }
        updateTableStats();
    });

    $key_button.click(function(e) {
        e.preventDefault();
        STEAM_API_KEY = prompt('Please provide your Steam API key');
        while(STEAM_API_KEY !== "" && STEAM_API_KEY !== null && !API_KEY_REGEXP.test(STEAM_API_KEY)) {
            STEAM_API_KEY = prompt('Please provide your valid Steam API key');
        }
        if(API_KEY_REGEXP.test(STEAM_API_KEY)) {
            GM_setValue("DYEPB_API_KEY", STEAM_API_KEY);
            displayButtons();
        }
    });

    $rm_key_link.click(function(e) {
        e.preventDefault();
        GM_deleteValue("DYEPB_API_KEY");
        GM_deleteValue(PLAYTIME_CACHE_KEY);
        GM_deleteValue(ACHIEVEMENT_CACHE_KEY);
        GM_deleteValue(WINS_CACHE_KEY);
        GM_deleteValue(LAST_CACHE_KEY);
        GM_deleteValue(USER_CACHE_VERSION_KEY);
        GM_deleteValue(SUB_APPID_CACHE_KEY);
        GM_deleteValue(SUB_APPID_CACHE_VERSION_KEY);
        GM_deleteValue(EXPECTED_PLAYTIME_CACHE_KEY);
        STEAM_API_KEY = "";
        playtimeCache = {};
        achievementCache = {};
        winsCache = {};
        subAppIdsCache = {};
        expectedPlaytimeCache = {};
        displayButtons();
    });

    $fetch_button.click(function(e) {
        e.preventDefault();
        activeRequests = 0;
        errorCount = 0;
        run_status = "PLAYTIMES";
        displayButtons();
        fetchGamePlaytimes(userID64, function() {
            run_status = "WON_GAMES";
            cacheJSONValue(PLAYTIME_CACHE_KEY, playtimeCache);
            fetchWon(1, function() {
                var intervalId = setInterval(function() {
                    if(activeRequests === 0) {
                        clearInterval(intervalId);
                        run_status = "ACHIEVEMENTS";
                        cacheJSONValue(WINS_CACHE_KEY, winsCache);
                        cacheJSONValue(SUB_APPID_CACHE_KEY, subAppIdsCache);
                        GM_setValue(SUB_APPID_CACHE_VERSION_KEY, JSON.stringify(CURRENT_VERSION));
                        var i = 0;
                        $.each(winsCache, function(id, details) {
                            activeRequests += 1;
                            if(details.name) {
                                setTimeout(fetchAchievementStatsFn(details.appid, userID64), i * 50);
                                // only update individual games expected playtime cache if tha data is missing or >30 days old
                                if(!GM_getValue(DISABLE_HLTB_KEY, false) && (!expectedPlaytimeCache['a'+details.appid] || expectedPlaytimeCache['a'+details.appid].cache_date < Date.now() - 2592000000)) {
                                    activeRequests += 1;
                                    setTimeout(fetchExpectedPlaytimes(details.appid, details.name), i * 1000); // rate limit data requests
                                }
                            } else if(details.appid) {
                                setTimeout(fetchAchievementStatsFn(details.appid, userID64), i * 50);
                            } else { // if details is not an object with an attribute name or an appid, it's probably an appid itself
                                setTimeout(fetchAchievementStatsFn(details, userID64), i * 50);
                            }
                            // increment delay to try to prevent overloading of Steam API
                            i += 1;
                        });
                        intervalId = setInterval(function() {
                            if(activeRequests === 0) {
                                clearInterval(intervalId);
                                run_status = "STOPPED";
                                cacheJSONValue(ACHIEVEMENT_CACHE_KEY, achievementCache);
                                cacheJSONValue(EXPECTED_PLAYTIME_CACHE_KEY, expectedPlaytimeCache);
                                GM_setValue(USER_CACHE_VERSION_KEY, JSON.stringify(CURRENT_VERSION));
                                console.log("Errors during API queries:", errorCount);
                            } else {
                                displayButtons();
                                console.log("Active achievement requests:", activeRequests);
                            }
                        }, 500);
                    } else {
                        displayButtons();
                        console.log("Active game requests:", activeRequests);
                    }
                }, 250);
            });
        });
    });
})();
