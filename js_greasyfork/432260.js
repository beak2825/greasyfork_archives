// ==UserScript==
// @name         TORN: Stat Estimate + Elimination team
// @namespace    savit.statestimate
// @version      2.7.4
// @author       Savit (heavily based on stuff by DeKleineKobini)
// @description  Estimate the stats of a player based on their rank.
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/page.php*
// @match        https://www.torn.com/halloffame.php*
// @match        https://www.torn.com/bounties.php*
// @match        https://www.torn.com/blacklist.php*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/competition.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432260/TORN%3A%20Stat%20Estimate%20%2B%20Elimination%20team.user.js
// @updateURL https://update.greasyfork.org/scripts/432260/TORN%3A%20Stat%20Estimate%20%2B%20Elimination%20team.meta.js
// ==/UserScript==

var settings = {
    apiDelay: 1000, // in milliseconds, default 1000ms
    pages: {
        profile: true,
        userlist: true,
        abroad: true,
        hallOfFame: true,
        bounties: true,
        blacklist: true,
        faction: {
            wall: false,
            profile: false,
        },
        competition: true
    },
    ignore: {
        enabled: false,
        level: 75, // only show stats below this level
        showEmpty: true
    },
    cache: { // in milliseconds, -1 is infinite
        normal: 12 * 60 * 60 * 1000, // default 12h
        last: 31 * 24 * 60 * 60 * 1000 // default 31d
    }
}

setDebug(true);

/* --------------------
CODE - EDIT ON OWN RISK
-------------------- */
initScript("statestimate", "Stat Estimate", "SE", true);

var ranks = {
    'Absolute beginner': 1,
    'Beginner': 2,
    'Inexperienced': 3,
    'Rookie': 4,
    'Novice': 5,
    'Below average': 6,
    'Average': 7,
    'Reasonable': 8,
    'Above average': 9,
    'Competent': 10,
    'Highly competent': 11,
    'Veteran': 12,
    'Distinguished': 13,
    'Highly distinguished': 14,
    'Professional': 15,
    'Star': 16,
    'Master': 17,
    'Outstanding': 18,
    'Celebrity': 19,
    'Supreme': 20,
    'Idolised': 21,
    'Champion': 22,
    'Heroic': 23,
    'Legendary': 24,
    'Elite': 25,
    'Invincible': 26
}

const EMPTY_CHAR = " ";
const triggerLevel = [ 2, 6, 11, 26, 31, 50, 71, 100 ];
const triggerCrime = [ 100, 5000, 10000, 20000, 30000, 50000 ];
const triggerNetworth = [ 5000000, 50000000, 500000000, 5000000000, 50000000000 ];

const estimatedStats = [
    "under 2k",
    "2k - 25k",
    "20k - 250k",
    "200k - 2.5m",
    "2m - 25m",
    "20m - 250m",
    "over 200m",
];
const PREFIX_CACHE = "id_";

var cache = {};

getCachedEstimated("statestimate3", true).then(c => {
    cache = c || {};

    start();
});

async function getCachedEstimated(key, subbed) {
    let _obj = await GM_getValue(key, subbed ? "{}" : "{\"end\":0}");
    let obj = JSON.parse(_obj);

    return obj;
}

function start() {
    var page = getCurrentPage();

    debug("Current page is '" + page + "' with step '" + new URL(window.location.href).searchParams.get("step") + "'");
    if (!shouldLoad(page)) return;

    log("Starting listeners.");
    startListeners(page);
}

function startListeners(page){
    var run = true;
    var ignore = 0;

    switch(page) {
        case "profiles": // profile
            observeMutations(document, ".basic-info", true, (mut, obs) => {
                const id = parseInt($("link[rel='canonical']").attr("href").match(/XID=([0-9]*)/i)[1]);

                const levelDigits = $(".profile-information-wrapper .box-value:eq(0) > li > .digit");
                let level = 0;
                level = (parseInt(levelDigits.eq(0).val()) || 0) * 100;
                level = (parseInt(levelDigits.eq(1).val()) || 0) * 10;
                level = (parseInt(levelDigits.eq(2).val()) || 0);

                updateUser(id, level, function(result) {
                    if (result === EMPTY_CHAR) return;

                    $(".content-title > h4").append("<div>" + result + "</div>");

                    observeMutations($(".user-profile").get(0), "#tt-target-info", true, (mut, obs) => {
                        $(".content-title > h4").append("<div>" + result + "</div>");
                    });
                }, 0);
            }, { childList: true, subtree: true });
            break;
        case "page": // userlist
            xhrIntercept((page, json, uri) => {
                if(page != "page" || !json) return;

                debug("Starting to list on the userlist page.");
                let first = json.list[0].userID;
                let firstPage = $(".user-info-list-wrap > li:eq(0) .user > img").attr("alt");
                if (firstPage) firstPage = firstPage.substring(firstPage.indexOf("[") + 1, firstPage.length - 1);

                if (firstPage != first) observeMutations(document, ".user-info-list-wrap > li:eq(0) .user > img[alt]", false, (mut, obs) => {
                    firstPage = $(".user-info-list-wrap > li:eq(0) .user > img").attr("alt");
                    firstPage = firstPage.substring(firstPage.indexOf("[") + 1, firstPage.length - 1);
                    if (firstPage != first) return;

                    obs.disconnect();
                    execute(json);
                }, { childList: true, subtree: true });
                else execute(json);

                function execute() {
                    if (!$(".se-header").length) $("<div class='se-header level t-hide left' style='border-left: 0px solid transparent; width: 75px;'>Stats</div>").insertAfter($(".level").eq(0));
                    $(".user-icons").eq(0).css("width", "initial");
                    json.list.forEach((player, index) => {
                        let delay = settings.apiDelay * (index - ignore);

                        if (shouldIgnore(player.level * 1)){
                            ignore++;

                            if (!settings.ignore.showEmpty) return;
                            else delay = 0;
                        }
                        if (getSubCache(cache, PREFIX_CACHE + player.userID)) {
                            ignore++;
                            delay = 0;
                        }

                        updateUser(player.userID, player.level * 1, (result) => {
                            if (result === EMPTY_CHAR) return;
                            var row = $(".user-info-list-wrap > li").eq(index);
                            var iconWrap = row.find(".icons-wrap");

                            $("<span class='level' style='border-left: 0px solid transparent; width: 75px;'>" + result + "</p>").insertAfter(row.find(".level"));
                            row.find(".user-icons").css("width", "initial");
                            iconWrap.css("width", "initial");
                            iconWrap.find("ul").css("width", "initial");
                        }, delay);
                    });
                }
            });

            break;
        case "halloffame": // hall of fame
            observeMutations(document, ".hall-of-fame-list-wrap", true, function(mut, obs){
                observeMutations($(".hall-of-fame-list-wrap")[0], ".players-list", false, function(mut, obs){
                    ignore = 0;

                    var indexLevel;
                    $(".table-titles > li").each(function(index) {
                        if ($(this).html().includes("Level")) {
                            indexLevel = index + 1;
                        }
                    });

                    $(".rank").eq(1).html("Stats");
                    $(".players-list > li").each(function(index) {
                        var row = $(this);
                        let id = row.find(".player > .name").attr("href");
                        if (!id) {
                            ignore++;
                            return;
                        }
                        id = id.substring(id.indexOf("=") + 1);
                        let level = stripHtml(row.find(".player-info > li").eq(indexLevel).html());
                        debug(level);
                        level = level.substring(level.indexOf(":") + 1) * 1;

                        let delay = settings.apiDelay * (index - ignore);

                        if (shouldIgnore(level)){
                            ignore++;

                            if (!settings.ignore.showEmpty) return;
                            else delay = 0;
                        }
                        if (getSubCache(cache, PREFIX_CACHE + id)) {
                            ignore++;
                            delay = 0;
                        }

                        updateUser(id, level, (result) => {
                            row.find(".rank").html(result);
                            let iconWrap = row.find(".icons-wrap");

                            row.find(".user-icons").css("width", "initial");
                            iconWrap.css("width", "initial");
                            iconWrap.find("ul").css("width", "initial");
                        }, delay);
                    });
                });
            }, { childList: true, subtree: true });
            break;
        case "index": // travelling TODO - test
            observeMutations(document, ".users-list", true, function(mut, obs){
                ignore = 0;

                $(".users-list > li").each(function(index) {
                    var row = $(this);
                    let id = row.find(".name").attr("href");
                    id = id.substring(id.indexOf("=") + 1);
                    let level = stripHtml(row.find(".level").html());
                    level = level.substring(level.indexOf(":") + 1) * 1;

                    let delay = settings.apiDelay * (index - ignore);

                    if (shouldIgnore(level)){
                        ignore++;

                        if (!settings.ignore.showEmpty) return;
                        else delay = 0;
                    }
                    if (getSubCache(cache, PREFIX_CACHE + id)) {
                        ignore++;
                        delay = 0;
                    }

                    updateUser(id, level, (result) => {
                        row.find(".rank").html(result);
                        let iconWrap = row.find(".icons-wrap");

                        $("<span class='level' style='width: 75px;'>" + result + "</p>").insertAfter(row.find(".status"));
                        row.find(".center-side-bottom").css("width", "initial");
                        iconWrap.css("width", "initial");
                        iconWrap.find("ul").css("width", "initial");
                    }, delay);
                });
            }, { childList: true, subtree: true });
            break;
        case "bounties": // bounties
            ajax((page, json, uri) => {
                if (page != "bounties" || !uri) return;

                observeMutations(document, ".bounties-list", true, (mut, obs) => {
                    let names = [];
                    ignore = 0;

                    $(".bounties-list-title .listed").html("STATS");
                    $(".bounties-list > li[data-id]").slice(0, 20).each((index, el) => {
                        let row = $(el);

                        let id = row.find(".target > a").attr("href");
                        id = id.substring(id.indexOf("XID=") + 4);
                        let level = row.find(".level").html().split("\n")[2];
                        let name = row.find(".target > a").html();

                        let delay = settings.apiDelay * (index - ignore);
                        if (names.includes(name)) {
                            ignore++;
                            return;
                        } else if (shouldIgnore(level)){
                            ignore++;

                            if (!settings.ignore.showEmpty) return;
                            else delay = 0;
                        }
                        if (getSubCache(cache, PREFIX_CACHE + id)) {
                            ignore++;
                            delay = 0;
                        }

                        names.push(name);
                        updateUser(id, level, (result) => {
                            $("li:has(a[href='profiles.php?XID=" + id + "'])").each(function(){
                                $(this).find(".listed").html(result);
                            });
                        }, delay);

                    });
                }, { childList: true, subtree: true, attributes: true });
            });
            break;
        case "blacklist": // enemies
            var checkBlacklist = () => {
                observeMutations($(".blacklist")[0], ".user-info-blacklist-wrap", true, function(mut, obs) {
                    ignore = 0;

                    $(".user-info-blacklist-wrap > li").each(function(index) {
                        var row = $(this);
                        let id = row.find(".name").attr("href");
                        id = id.substring(id.indexOf("XID=") + 4);
                        let level = stripHtml(row.find(".level").html());
                        level = level.substring(level.indexOf(":") + 1) * 1;

                        let delay = settings.apiDelay * (index - ignore);

                        if (shouldIgnore(level)){
                            ignore++;

                            if (!settings.ignore.showEmpty) return;
                            else delay = 0;
                        }
                        if (getSubCache(cache, PREFIX_CACHE + id)) {
                            ignore++;
                            delay = 0;
                        }

                        updateUser(id, level, (result) => {
                            var iconWrap = row.find(".description-editor");

                            var ele = $("<span class='level right' style='width: 75px;'>" + result + "</p>");
                            ele.insertAfter(row.find(".edit"));
                            ele.css("float", "right");
                            row.find(".description .text").css("width", "initial");
                        }, delay);
                    });
                });
            }

            checkBlacklist();
            ajax((page, json, uri) => {
                if(page != "userlist" || !uri) return;

                checkBlacklist();
            });
            break;
        case "factions": // territory walls
            if (settings.pages.faction.wall && hasSearchTag("step", "your")) {
                runOnEvent(() => {
                    let hashSplit = window.location.hash.split("/");
                    if (hashSplit[1] != "war" || isNaN(hashSplit[2])) return;

                    observeMutations(document, ".members-list", true, function(mut, obs) {
                        $(".user-icons").eq(0).html("Stats");

                        updateWall();
                        observeMutations($(".members-list")[0], ".members-list > .enemy", false, function(mut, obs) {
                            debug("Member list got updated.")
                            updateWall();
                        });
                    }, { childList: true, subtree: true });
                }, "hashchange", true);
            } else if (settings.pages.faction.profile && hasSearchTag("step", "profile")) {
                $(".member-list > li").each((index, element) => {
                    var row = $(element);

                    let id = row.find(".member .name").attr("href");
                    id = id.substring(id.indexOf("=") + 1);
                    let level = row.find(".lvl").html().split(" ")[2] * 1;

                    let delay = settings.apiDelay * (index - ignore);

                    if (shouldIgnore(level)){
                        ignore++;

                        if (!settings.ignore.showEmpty) return;
                        else delay = 0;
                    }
                    if (getSubCache(cache, PREFIX_CACHE + id)) {
                        ignore++;
                        delay = 0;
                    }

                    updateUser(id, level, (result) => row.find(".days").html(result), delay);
                });
            }
            break;
        case "competition": // competitions (elimination)
            var linked = false;
            runOnEvent(() => {
                if (linked) return;

                if (hasSpecialTag("p", "team")) { // Elimination 2019
                    log("Starting to check for elimination!");
                    xhrIntercept((page, json, uri) => {
                        if(page != "competition" || !uri || !hasSpecialTag("p", "team")) return;

                        observeMutations($("#competition-wrap")[0], ".competition-list", true, (mut, obs) => {
                            ignore = 0;
                            debug($(".competition-list").find(".name a").first().attr("data-placeholder"));
                            $(".competition-list > li > ul").each(function(index) {
                                var row = $(this);
                                let id = row.find(".user").attr("href");
                                if (!id) {
                                    ignore++;
                                    return;
                                }
                                id = id.substring(id.indexOf("=") + 1);
                                let level = stripHtml(row.find(".level").html()) * 1;
                                debug(id + " / " + level)

                                let delay = settings.apiDelay * (index - ignore);

                                if (shouldIgnore(level)){
                                    ignore++;

                                    if (!settings.ignore.showEmpty) return;
                                    else delay = 0;
                                }
                                if (getSubCache(cache, PREFIX_CACHE + id)) {
                                    ignore++;
                                    delay = 0;
                                }

                                updateUser(id, level, (result) => row.find(".icons").html(result), delay);
                            });

                        });
                    });
                    linked = true;
                }
            }, "hashchange", true);
            break;
    }
}

function loadWall() {
    var hashSplit = window.location.hash.split("/");
    if (hashSplit[1] != "war" || isNaN(hashSplit[2])) return;

    observeMutations(document, ".members-list", true, function(mut, obs) {
        $(".user-icons").eq(0).html("Stats");

        updateWall();
        observeMutations($(".members-list")[0], ".members-list > .enemy", false, function(mut, obs) {
            debug("Member list got updated.")
            updateWall();
        });
    }, { childList: true, subtree: true });
}

function updateWall() {
    let ignore = 0;
    $(".members-list > .enemy:not(:has(.estimate))").each(function(index) {
        var row = $(this);
        let id = row.find(".name").attr("href");
        id = id.substring(id.indexOf("XID=") + 4);
        let level = row.find(".level").html();
        debug(`Found ${id} at level ${level}`);

        row.find(".member").addClass("estimate");

        let delay = settings.apiDelay * (index - ignore);

        if (shouldIgnore(level)){
            ignore++;

            if (!settings.ignore.showEmpty) return;
            else delay = 0;
        }

        updateUser(id, level, function(result) {
            if (result === EMPTY_CHAR) return;

            var iconWrap = row.find(".user-icons");

            $("<span class='level left' style='border-left: 0px solid transparent; width: 70px;'>" + result + "</p>").insertAfter(row.find(".level"));
            iconWrap.css("width", "175px");
            iconWrap.find("ul").css("width", "initial");
        }, delay);
    });
}

function shouldLoad(page) {
    if (settings.pages.profile && page == "profiles") return true;
    if (settings.pages.userlist && page == "page" && hasSearchTag("sid", "UserList")) return true;
    if (settings.pages.abroad && page == "index" && hasSearchTag("page", "people")) return true;
    if (settings.pages.hallOfFame && page == "halloffame") return true;
    if (settings.pages.bounties && page == "bounties") return true;
    if (settings.pages.blacklist && page == "blacklist") return true;
    if (page == "factions") {
        if (settings.pages.faction.wall && hasSearchTag("step", "your")) return true;
        if (settings.pages.faction.profile && hasSearchTag("step", "profile")) return true;
    }
    if (settings.pages.competition && page == "competition") return true;

    return false;
}

function shouldIgnore(level) {
    return settings.ignore.enabled && (settings.ignore.level <= level);
}

function getCurrentPage() {
    var path = window.location.pathname;
    return path.substring(1, path.length - 4);
}

function hasSearchTag(tag, value) {
    var params = new URL(window.location.href).searchParams;

    return !value ? params.has(tag) : params.get(tag) == value;
}

function hasSpecialTag(tag, value) {
    var params = new URLSearchParams(getSpecialSearch());

    return !value ? params.has(tag) : params.get(tag) == value;
}

function updateUser(id, lvl, callback, delay) {
    if (shouldIgnore(lvl)){
        debug(`Ignoring ${id} with level ${lvl}.`)
        if (settings.ignore.showEmpty) callback(EMPTY_CHAR);
        return;
    }

    debug(`Estimating for ${id} with level ${lvl}.`)

    let cached = getCachedStats(id);
    if (cached) {
        log(`Cached stats for ${id}! ${cached}`);

        callback(cached);
        return;
    } else {
        debug(`NONE Cached stats for ${id}!`, cached);
    }

    setTimeout(function(){
        sendAPIRequest("user", id, "profile,personalstats,crimes").then(function(oData) {
            debug("response", oData);
            if (!oData){
                debug("oData is not found")
                return callback("ERROR API (UNKNOWN)");
            }
            if (!oData.rank) {
                debug("api returned error")
                return callback("ERROR API (" + oData.error.code + ")");
            }
            debug("Loaded information from the api!");

            var rankSpl = oData.rank.split(" ");
            var rankStr = rankSpl[0];
            if (rankSpl[1][0] === rankSpl[1][0].toLowerCase()) rankStr += " " + rankSpl[1];

            var level = oData.level;
            var rank = ranks[rankStr];
            var crimes = oData.criminalrecord ? oData.criminalrecord.total : 0;
            var networth = oData.personalstats ? oData.personalstats.networth : 0;
            var lastAction = oData.last_action;
            var trLevel = 0, trCrime = 0, trNetworth = 0;
            var team = oData.competition.team;
            debug(`savit team names is ${team}`)
            for (let l in triggerLevel) {
                if (triggerLevel[l] <= level) trLevel++;
            }
            for (let c in triggerCrime) {
                if (triggerCrime[c] <= crimes) trCrime++;
            }
            for (let nw in triggerNetworth) {
                if (triggerNetworth[nw] <= networth) trNetworth++;
            }

            var statLevel = rank - trLevel - trCrime - trNetworth - 1;

            var estimated = estimatedStats[statLevel];
            if (!estimated) estimated = "N/A";
            estimated = estimated + "   " + team;
            debug(`sav Estimated stats for ${id} with level ${lvl}.`)

            cache[PREFIX_CACHE + id] = {};
            cache[PREFIX_CACHE + id].value = estimated;
            cache[PREFIX_CACHE + id].end = Date.now() + (estimated == estimatedStats[estimatedStats.length - 1] ? settings.cache.last : settings.cache.normal);

            setCache("statestimate3", cache, -1, true);
            callback(estimated);
        });
    }, delay);
}

function getCachedStats(id) {
    let cached = cache[PREFIX_CACHE + id];
    if (cached) {
        debug(`Cached stats for ${id}?`);

        let end = cached.end;
        if (end == -1 || end >= Date.now())
            return cached.value;
        else
            cache[PREFIX_CACHE + id] = undefined;
    }
    return undefined;
}