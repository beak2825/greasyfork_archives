// ==UserScript==
// @name         TORN: Customized Stat Estimate for Walls
// @namespace    dekleinekobini.statestimate
// @version      4.0
// @author       TylerDoudrick
// @description  Estimate the stats of a player based on their rank.
// @match        https://www.torn.com/factions.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/402686/TORN%3A%20Customized%20Stat%20Estimate%20for%20Walls.user.js
// @updateURL https://update.greasyfork.org/scripts/402686/TORN%3A%20Customized%20Stat%20Estimate%20for%20Walls.meta.js
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
            wall: true,
            profile: true
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

getCachedEstimated("statestimate", true).then(c => {
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
    setTimeout(function() {
    startListeners(page);
}, 3000);
}
    const config = { attributes: true, childList: true, subtree: true };

function startListeners(page){
    var run = true;
    var ignore = 0;
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
                xyz();

                const observer = new MutationObserver(callback);
                observer.observe($(".members-list")[0], config);

            
    }
}

const callback = function(mutationsList, observer) {
$(".members-list > .your").show();
    $(".members-list > .join").show();
    $(".members-list > .enemy").show();
            $(".members-list > .timer").show();

    observer.disconnect();
    xyz();
    observer.observe($(".members-list")[0], config);
};

function loadWall() {
    var hashSplit = window.location.hash.split("/");
    if (hashSplit[1] != "war" || isNaN(hashSplit[2])) return;

    observeMutations(document, ".members-list", false, function(mut, obs) {
        $(".user-icons").eq(0).html("Stats");

        updateWall();
        observeMutations($(".members-list")[0], ".members-list > .enemy", true, function(mut, obs) {

            debug("Member list got updated.")
            updateWall();
        });
    }, { childList: true, subtree: true });
}

function xyz(){
    var ignore = 0;
    $(".members-list > .join").hide();
    $(".members-list > .your").hide();
        $(".members-list > .timer").hide();

    $(".members-list > .enemy").each((index, element) => {
                    if($(element).className != "timer-wrap" && $(element).className != "join"){
                    var row = $(element);
                        console.log("ding");

                    let id = row.find(".member").find(".name").attr("href").split("=")[1];
                    let level = row.find(".level").text();

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

                    updateUser(id, level, (result) => row.find(".user-icons").html(result + "<a href=https://www.torn.com/loader2.php?sid=getInAttack&user2ID="+id+" target='_blank'>Attack</a>"), delay);
                    }
                });
}

function updateWall() {
    let ignore = 0;
     $(".members-list > .your:not(:has(.estimate))").each(function(index) {
        var row = $(this);
         row.hide();
     });
         $(".members-list > .join:not(:has(.estimate))").each(function(index) {
        var row = $(this);
         row.hide();
     });
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
if(result != "N/A" && result != "over 200m"){
iconWrap.parent().parent().css( "background-color", "#FFFACD" );
     $("<span class='level left' style='border-left: 0px solid transparent; width: 70px;'>" + result + "</p>").insertAfter(row.find(".level"));
            iconWrap.css("width", "175px");
            iconWrap.find("ul").css("width", "initial");
}else{
iconWrap.parent().parent().hide();

}
           
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

            var trLevel = 0, trCrime = 0, trNetworth = 0;
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

            debug(`Estimated stats for ${id} with level ${lvl}.`)

            cache[PREFIX_CACHE + id] = {};
            cache[PREFIX_CACHE + id].value = estimated;
            cache[PREFIX_CACHE + id].end = Date.now() + (estimated == estimatedStats[estimatedStats.length - 1] ? settings.cache.last : settings.cache.normal);

            setCache("statestimate", cache, -1, true);
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