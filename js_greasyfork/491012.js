// ==UserScript==
// @name         Nyan Cat's badge hunter assist script
// @namespace    http://tampermonkey.net/
// @version      1.653
// @author       Nyan Cat
// @match        https://*.roblox.com/*
// @description  Hide earned badges, keep track of badge updates in thousands of games, and more!
// @grant        GM.xmlHttpRequest
// @connect      bor-valuable-badge-database-production.up.railway.app
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/491012/Nyan%20Cat%27s%20badge%20hunter%20assist%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/491012/Nyan%20Cat%27s%20badge%20hunter%20assist%20script.meta.js
// ==/UserScript==

/*jshint esversion: 8 */
/*jshint loopfunc: true */
/*global $ */

/* Special Thanks
AntiBoomz for his BTRoblox, which was the base of this script before 1.0.
Some parts of the code still had taken inspiration from his source code at https://github.com/AntiBoomz/BTRoblox, thanks again!

@everyone who used the script and provided suggestions to make this script better. Thanks to you all!
*/

/* Changelogs
1.651: Fix badge won date not loading correctly
1.650: Add support for new Roblox badge UI
1.640: Add support for Non-Valuable Legacy badges (NVLs)
1.630: Always use 3-digit version to fix auto update
1.63: Add buttons that let you recheck badge ownership in case you deleted badges from your inventory
1.622: Fix new badge id handling
1.621: Avoid cross-origin request prompt by adding @connect tag
1.62: Add badge value display to https://www.roblox.com/badges/ pages
1.615: Make the "Export badge ids as code" button only export displayed badges
1.614: Add the amount of considered badges to badgeWatch's stats display
1.613: Fix the "Check new earned badges in this place" button
1.612: Don't show amount of badges considered on game pages
1.611: Generate V3 watchlist entry as part of the badge watch report
1.61: Show badges considered and allow sorting via Amount of badges considered aka. not filtered in badgeWatch
1.6: Store owned badges and watchlist in indexedDB and fix owned badges caching (yep, it was broken at some point)
1.531: Fix badge value checks failing when more than 100 badges are queued
1.53: Fix lags in badgeWatch, this time for real I promise
1.522: Support importing one or multiple V1 watchlists via Add to watchlist
1.521: Change bwGenReport format + make it work when performance mode is on
1.52: Change badgeWatch save format to v3 and remove Import watchlist button (use Add to watchlist instead)
1.51: Fix memory leak, further speed up badgeWatch, and slight rebrand
1.5: Optimize Roblox API requests and async handling in badgeWatch
1.47: Revamp watchlist saving; it no longer readds the places on refresh
1.46: Store badge ownership info of different accounts separately
1.452: "Fix" script breaking on Tampermonkey 4.19.0 due to window acting differently
1.451: Hide obtained date when BTRoblox v3.4.0 or newer already shows it
1.45: Display obtained date of badges
1.441: Improve the description of hideNonLegacy and hideNonValuable
1.44: Add option to show up to 500 badges
1.43: Add option to Export badge checklist
1.42: Fix checkBadgeValues on Chrome (Thanks to unmannerliness for the original fix)
1.411: Correct BoR Valuable Badge Database URLs for consistency
1.41: Add the option from 1.4 to /badgeWatch and some minor changes
1.4: Add option to ignore badges created for free (Non-valuable badges)
1.33: Update definition of legacy badges (From <=2124949326 to <=2124945818)
1.32: Update definition of legacy badges (From <=2124961200 to <=2124949326)
1.31: Add option to only show hard badges (and hide easy ones)
1.3: Add option to ignore badges created after badges went free
1.251: Fix badge HUD
1.25: Add option to export all badge ids of a game as a Lua array. This will be useful to badge walk developers who want to make a ingame badge counter
1.244: Add @everyone to the Special Thanks
1.243: Add updateURL and description to the UserScript metadata as per Tampermonkey's instruction
1.242: Ignore import lines if the id begins with digit 0
1.241: Update my nickname
1.24: Global cooldown to requests that could end with 429 errors
1.23: The import feature now looks for place ids more aggressively (extracts any number it sees)
1.22: Show the amount of disabled badges in /badgeWatch
1.212: Fix global variable errors/warnings
1.211: Add more progress indicators (Places to count / to check)
1.21: Add option to hide place with less badges to earn, show pending places, and various logic fixes
1.2: Add option to ignore small badge games, and save BW settings
1.192: Add performance mode into /badgeWatch
1.1911: Added special sauce for Ender's Badge Walk City
1.191: You can now check one place for new earned badges in /badgeWatch, please ping me for any UI improvement
1.19: Add export report feature into /badgeWatch
1.188: Fix filter not updating in /badgeWatch
1.187: You can now add as many places as you want at the same time in /badgeWatch
1.186: Fix the bug where the logout option doesn't work
1.185: Only render watchlist when needed
1.184: Private/Unavailable places will now be ignored
1.183: Fix export feature, and add a stats button
1.182: /badgeWatch is now capable of handling 810 places without lagging, and slightly buffed paid badge detection
1.181: The script now caches owned badges, way less 426(Too Many Requests) errors from Roblox!
1.18: Performance refactor, large games should no longer lag at all!
1.175: Many QoL improvements regarding /badgeWatch
1.174: Ignored not enabled badges in /badgeWatch
1.173: Check new earned badges in /badgeWatch, and speed API requests back up
1.172: Place init error handling, and slow down API requests
1.171: Add sort option "Last badge creation date (newer)"
1.17: Add sorting options in /badgeWatch, I might add more later.
1.16: Add import button in /badgeWatch, which means you can now export/import watchlists!
1.151: Fix button color under dark theme, and add an export button in /badgeWatch
1.15: Added saving feature to /badgeWatch
1.14: Fully functional /badgeWatch, accessible from the top right menu
1.13: Clean up code with JSHint, stub /badgeWatch, and variable restructure to prepare for full /badgeWatch
1.12: Show amount of badges left to check for ownership
1.11: Buff paid and group badge detection, and fix changelog typo
1.1: Add group badge filter, add special sauce for hiding paid badges in vex badge walk, and change UI slightly
1.015: Fixed the bug where the script doesn't work when the display language isn't set to English
1.014: Hotfix regarding *edge* cases where roblox game urls are not being matched and therefore excluded by the script
1.013: Fixed false negative in Ocean's 2nd Badge Walk
1.012: Fixed false negative in Awesome's Badge Walk
1.011: Added special sauce for ABC's Badge Land! game
1.01: Hopefully fixed filter by easiness
1.0: A great redo, BTRoblox requirement removed, much better owned badge detector, no more lagging, and refresh unearned badges button
0.611: Fixed the bug where easiness select is broken with Opera GX
0.61: Fixed the bug where the word "something" triggers the meet badge detector
0.6: Added filter by difficulty option. Ex: Setting it to Easy will only show badges with Easy or lower difficulty
0.53: Buffed meet badge detection
0.52: Hide paid badges now also hide premium badges
0.51: Fixed false positive in Nar's Badge Walk
0.5: Added hide likely meet badges option
0.44: Fixed false negative in Manner's Badge Walk
0.43: Fixed false positive in Manner's Badge Walk
0.42: Slowed down by another 2x
0.41: Slowed down the script for the granny roblox API
0.4: Add hide impossible badges option
0.303: Hotfix
0.302: Make vip check case insensitive
0.301: Just some minor edits
0.3: Added option to hide (maybe) VIP badges
0.211: Fixed precent display
0.21: Add precent of badges earned
0.2: Add amount of badges unearned & total badges display
0.1: Init
*/

// Start https://github.com/e666666/incremental-headstart-set/blob/master/js/libs/clipboard.js
// Edited from https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
window.copyStringToClipboard = function (str) {
    // Create new element
    var el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    el.style = {
        left: "-9999px",
        position: "absolute"
    };
    document.body.appendChild(el);
    // Copy text to clipboard
    window.copyToClipboard(el);
    // Remove temporary element
    document.body.removeChild(el);
};

// Copied from https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
window.copyToClipboard = function (el) {

    // resolve the element
    el = (typeof el === "string") ? document.querySelector(el) : el;

    // handle iOS as a special case
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {

        // save current contentEditable/readOnly status
        var editable = el.contentEditable;
        var readOnly = el.readOnly;

        // convert to editable with readonly to stop iOS keyboard opening
        el.contentEditable = true;
        el.readOnly = true;

        // create a selectable range
        var range = document.createRange();
        range.selectNodeContents(el);

        // select the range
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);

        // restore contentEditable/readOnly to original state
        el.contentEditable = editable;
        el.readOnly = readOnly;
    }
    else {
        el.select();
    }

    // execute copy command
    document.execCommand("copy");
};
// End

function setUserId() {
    const userDataElm = document.querySelector("meta[name='user-data']");
    if (userDataElm !== null) {
        userId = Number(userDataElm.dataset.userid);
    }
}

function getBadgeNodes() {
    return [].concat.apply([], document.getElementsByClassName("stack-list")[0].childNodes).filter((elm) => elm.nodeName === "LI" && elm.attributes.class.textContent !== "ng-scope");
}

function getDifficulty(text) {
    var ret = -1;

    diffScales.forEach(function check(name, index) {
        if (text.includes(name)) {
            ret = index;
        }
    });

    return ret;
}

var allNVLBadgeIds = new Set();
function isNVL(badgeId) {
    return allNVLBadgeIds.has(parseInt(badgeId));
}

function getBadgeValue(placeId, badgeId) {
    if (badgeValuesDict[placeId].hasOwnProperty(badgeId)) {
        return badgeValuesDict[placeId][badgeId];
    }
    return NaN;
}

function getBadgeWonAt(placeId, badgeId) {
    if (badgeWonAtDict[placeId].hasOwnProperty(badgeId)) {
        return badgeWonAtDict[placeId][badgeId];
    }
    return null;
}

function getBadgeId(badge) {
    return Number(badge.getElementsByTagName("a")[0].href.split("/").slice(-2)[0]);
}

function updateBadgeIdList() {
    if (badgeNodes.length === allBadgeIds[curPlaceId]) {
        return;
    }

    allBadgeIds[curPlaceId] = [];
    for (let i = 0, n = badgeNodes.length; i < n; i++) {
        allBadgeIds[curPlaceId].push(getBadgeId(badgeNodes[i]));
    }
}

function mergeArrayWithoutDupe(a, b) {
    return Array.from(new Set(a.concat(b)));
}

function checkBadgeOwnershipsOnSuccess(placeId, toCheck, response) {
    if (response.data.length > 0) ownedUnclean = true;
    response.data.forEach((x) => {
        let badgeId = Number(x.badgeId);
        ownedBadgeIds[placeId].add(badgeId);
        badgeWonAtDict[placeId][badgeId] = x.awardedDate.split("T")[0];
    });
    toCheck.forEach(ownershipCheckedBadgeIds[placeId].add, ownershipCheckedBadgeIds[placeId]);
    window.needUpdate = true;

    if (onBadgeWatch) {
        updateWatchInfo(placeId);
    }
}

function checkBadgeOwnershipsOnFail() {
    awardedDatesRequestCooldown = 15000;
}

var awardedDatesRequestCooldown = 0;
function checkBadgeOwnerships() {
    for (let i = 0, n = allPlaces.length; i < n; i++) {
        let placeId = allPlaces[i];
        if (allBadgeIds[placeId].length < window.bwOptions.placeMinBadgeAvail
            || allBadgeIds[placeId].length == ownershipCheckedBadgeIds[placeId].size) {
            if (placeCheckingOwnerships.delete(placeId)) {
                window.needUpdate = true;
            }
            continue;
        }

        placeCheckingOwnerships.add(placeId);
        if (awardedDatesRequestCooldown >= 200) {
            continue;
        }

        var toCheck = [];
        for (let i = 0, n = allBadgeIds[placeId].length; i < n; i++) {
            let id = allBadgeIds[placeId][i];
            if (!ownershipCheckedBadgeIds[placeId].has(id)) {
                toCheck.push(id);
            }
        }

        if (toCheck.length === 0) {
            if (placeCheckingOwnerships.delete(placeId)) {
                window.needUpdate = true;
            }
            continue;
        }

        toCheck = toCheck.slice(0, 100);
        const url = `https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${toCheck.join(",")}`;
        awardedDatesRequestCooldown += 100;

        $.get(url)
        .done(checkBadgeOwnershipsOnSuccess.bind(null, placeId, toCheck))
        .fail(checkBadgeOwnershipsOnFail);
    }
}

function requestDBUniverseCheck(universeId) {
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://bor-valuable-badge-database-production.up.railway.app/api/v3/user/requestcheck?universeId=${universeId}`,
        onload: function(response) {
            return response;
        },
        onerror: function(error) {
            return error;
        }
    });
}

function reportMissingBadgesToDB(badgeIds) {
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://bor-valuable-badge-database-production.up.railway.app/api/v3/user/reportmissing?badgeIds=${badgeIds.join(",")}`,
        onload: function(response) {
            return response;
        },
        onerror: function(error) {
            return error;
        }
    });
}

function checkBadgeValuesOnload(placeId, response) {
    window.badgeDbNeedsRefresh = false;
    var resp = JSON.parse(response.responseText).data;
    var missingBadges = [];
    for (var badgeId in resp) {
        var badge = resp[badgeId];
        if (!badge.found) {
            window.badgeDbNeedsRefresh = true;
            missingBadges.push(badge.badge_id);
            continue;
        }

        valueCheckedBadgeIds[placeId].add(badge.badge_id);
        badgeValuesDict[placeId][badge.badge_id] = badge.value;
        if (badge.is_nvl) {
            allNVLBadgeIds.add(badge.badge_id);
        }
    }

    if (window.badgeDbNeedsRefresh) {
        var universeId;
        if (onGamePage) {
            universeId = document.getElementsByTagName("game-badges-list")[0].attributes["universe-id"].textContent;
            requestDBUniverseCheck(universeId);
        } else if (onBadgeWatch) {
            requestDBUniverseCheck(window.watchlist.get(placeId).universeId);
        } else if (onBadgesPage) {
            reportMissingBadgesToDB(missingBadges);
        }
    }

    window.needUpdate = true;
}

function checkBadgeValues() {
    for (let i = 0, n = allPlaces.length; i < n; i++) {
        let placeId = allPlaces[i];
        if (allBadgeIds[placeId].length < window.bwOptions.placeMinBadgeAvail
            || allBadgeIds[placeId].length == valueCheckedBadgeIds[placeId].size) {
            if (placeCheckingValues.delete(placeId)) {
                window.needUpdate = true;
            }
            continue;
        }

        var toCheck = [];
        for (let i = 0, n = allBadgeIds[placeId].length; i < n; i++) {
            let id = allBadgeIds[placeId][i];
            if (!valueCheckedBadgeIds[placeId].has(id)) {
                toCheck.push(id);
            }
        }

        if (toCheck.length === 0) {
            if (placeCheckingValues.delete(placeId)) {
                window.needUpdate = true;
            }
            continue;
        }

        toCheck = toCheck.slice(0, 100);
        const url = `https://bor-valuable-badge-database-production.up.railway.app/api/v3/query/bybadgeids?badgeIds=${toCheck.join(",")}`;

        placeCheckingValues.add(placeId);

        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: checkBadgeValuesOnload.bind(null, placed),
            onerror: function(error) {
              return error;
           },
        });
    }
}

function getDonePrecent(placeId, toEarn) {
    return Math.min(100, Math.max(0, 100 - (toEarn / ownershipCheckedBadgeIds[placeId].size * 100)));
}

function badgeStatusReport(placeId, toEarn, isBW) {
    var total = allBadgeIds[placeId].length;
    var considered = badgesToConsider[placeId];
    var disabled = disabledBadgeCount[placeId]
    var toCheckOwnerShip = Math.max(0, allBadgeIds[placeId].length - ownershipCheckedBadgeIds[placeId].size);
    var toCheckValue = Math.max(0, allBadgeIds[placeId].length - valueCheckedBadgeIds[placeId].size);
    var donePrecent = getDonePrecent(placeId, toEarn).toFixed(2);

    let ret = `${total} total, `;
    if (isBW) {
        ret += `${considered} considered, `;
    }
    ret += `${disabled} disabled, ${toEarn} to earn, ${toCheckOwnerShip} to check ownership, ${toCheckValue} to check value, ${donePrecent}% Done`;

    return ret;
}

function initPlaceRecord(placeId) {
    if (allPlaces.includes(placeId)) {
        console.error("Who the hell called initPlaceRecord twice ??/?/???///");
        return;
    }

    allPlaces.push(placeId);
    allBadgeIds[placeId] = [];

    ownershipCheckedBadgeIds[placeId] = ownershipCheckedBadgeIds[placeId] || new Set();
    ownedBadgeIds[placeId] = ownedBadgeIds[placeId] || new Set();
    badgeWonAtDict[placeId] = badgeWonAtDict[placeId] || {};

    valueCheckedBadgeIds[placeId] = valueCheckedBadgeIds[placeId] || new Set();
    badgeValuesDict[placeId] = badgeValuesDict[placeId] || {};

    badgeOrigTitles[placeId] = [];
    badgeTitles[placeId] = [];
    badgeDescs[placeId] = [];
    badgeDiffs[placeId] = [];
    badgeDiffRates[placeId] = [];
    badgeIsMeet[placeId] = [];
    badgeIsGroup[placeId] = [];
    badgeIsPaid[placeId] = [];
    badgeIsFiltered[placeId] = [];
    lastBadgeDate[placeId] = 0;
    disabledBadgeCount[placeId] = 0;
    badgesToConsider[placeId] = 0;
    badgesToEarn[placeId] = 0;
}

const diffScales = ["Freebie", "Cake Walk", "Easy", "Moderate", "Challenging", "Hard", "Extreme", "Insane", "Impossible"];
window.needUpdate = true;
var ownedUnclean = false;
var badgeNodes = [];
var allPlaces = [];
var allBadgeIds = {};
var ownershipCheckedBadgeIds = {};
var valueCheckedBadgeIds = {};
var ownedBadgeIds = {};
var badgeOrigTitles = {};
var badgeTitles = {};
var badgeDescs = {};
var badgeDiffs = {};
var badgeIsFiltered = {};
var badgeDiffRates = {};
var badgeIsMeet = {};
var badgeIsGroup = {};
var badgeIsPaid = {};
var badgeValuesDict = {};
var badgeWonAtDict = {};
var lastBadgeDate = {};
var disabledBadgeCount = {};
var badgesToConsider = {};
var badgesToEarn = {};
var userId = 0;
var checkNowTimeoutId = -1;
var showEarnedBadges = false;
var showLessBadges = false;
var hideNonLegacy = false;
var hideNonValuable = false;
var hideImpossible = false;
var easiness = 8;
var invertDiff = false;
var onGamePage = false;
var onBadgeWatch = false;
var onBadgesPage = false;
var curPlaceId = 0;

var badgesToCheck = 0;

var hideVIP = false;
var hideMeet = false;
var hideGroup = false;
var iDB = null;


// Start onsite badge filter
function updateIsGroup(id) {
    const temp = badgeTitles[curPlaceId][id].concat(badgeDescs[curPlaceId][id]);
    var isGroup = false;
    isGroup = isGroup || temp.includes("join") || temp.includes("joined");
    isGroup = isGroup || temp.includes("robloxia");

    badgeIsGroup[curPlaceId][id] = isGroup;
}

function updateIsMeet(id) {
    const temp = badgeTitles[curPlaceId][id].concat(badgeDescs[curPlaceId][id]);
    badgeIsMeet[curPlaceId][id] = temp.includes("meet") || temp.includes("met");
}

function updateIsPaid(id) {
    var isPaid = false;
    var title = badgeTitles[curPlaceId][id];
    var desc = badgeDescs[curPlaceId][id];
    isPaid = isPaid || title.includes("vip") || title.includes("v.i.p");
    isPaid = isPaid || title.includes("premium");
    isPaid = isPaid || (desc.includes("gamepass") && !title.includes("'s"));
    isPaid = isPaid || title.includes("paid"); // https://www.roblox.com/games/4229526454/Oceans-2nd-Badge-Walk
    isPaid = isPaid || (desc.includes("vip") && curPlaceId === "2979856480"); // Special sauce for Badge Land! By Awesome Badge Collectors, https://www.roblox.com/games/2979856480/
    isPaid = isPaid || (title.includes("own") && curPlaceId === "2710389524"); // Special sauce for VEX BADGE WALK By The Vex Mercenaries, https://www.roblox.com/games/2710389524/
    isPaid = isPaid || desc.includes("buy");
    isPaid = isPaid || title.includes("gamepass");
    isPaid = isPaid || (title.includes("golden") && curPlaceId === "2661322489"); // Special sauce for Ender's Badge Walk City By EnderDeveIoper, https://www.roblox.com/games/2661322489/
    if (title.includes("hidden") || badgeIsMeet[curPlaceId][id]) {
        isPaid = false;
    }
    badgeIsPaid[curPlaceId][id] = isPaid;
}

window.refreshUnearned = function refreshUnearned(placeId) {
    ownershipCheckedBadgeIds[placeId] = new Set(ownedBadgeIds[placeId]);
    if (onBadgeWatch) {
        updateBadgeStats(placeId);
        updateWatchInfo(placeId);
    }

    window.needUpdate = true;
};

window.refreshAllUnearned = function refreshAllUnearned() {
    Object.keys(ownershipCheckedBadgeIds).forEach(window.refreshUnearned);
};

window.exportBadgeAsCode = function exportBadgeAsCode(placeId) {
    let badgeIds = allBadgeIds[placeId];

    let code = "local badgeIds = {"

    for (let i = 0; i < allBadgeIds[placeId].length; i += 1) {
        if (!badgeIsFiltered[placeId][i]) {
            code += `
    "${allBadgeIds[placeId][i]}",`;
        }
    }

    code += `
};`;

    window.copyStringToClipboard(code);
    alert('Exported to the clipboard');
}

window.exportBadgeChecklist = function exportBadgeChecklist(placeId) {
    let toEarn = 0;
    let checklist = "";
    for (let i = 0; i < allBadgeIds[curPlaceId].length; i += 1) {
        if (!badgeIsFiltered[placeId][i]) {
            toEarn += 1;
            checklist += `[ ] ${badgeOrigTitles[placeId][i]} (${badgeDiffRates[placeId][i] })\n`;
        }
    }

    let output = `${toEarn} badges to go\n${checklist}`;
    window.copyStringToClipboard(output);
    alert('Exported to the clipboard');
}

window.recheckOwnershipInGame = function recheckOwnershipInGame(placeId, auto=false) {
    if (auto || confirm("Are you sure about this? You will have to wait for the badge ownership check in this game again!")) {
        ownedBadgeIds[placeId] = new Set();
        ownershipCheckedBadgeIds[placeId] = new Set();
        badgeWonAtDict[placeId] = {};
        window.needUpdate = true;
        ownedUnclean = true;
        saveOwnedBadges();
    }
}

window.recheckOwnershipInAll = function recheckOwnershipInAll(placeId) {
    if (confirm("Are you sure about this? You will have to wait for the badge ownership check in ALL games again!")) {
        ownedBadgeIds = {};
        ownershipCheckedBadgeIds = {};
        badgeWonAtDict = {};
        window.recheckOwnershipInGame(placeId, true);
    }
}

function isBTRobloxShowingUnlockedDate() {
    if (typeof window.BTRoblox === "undefined") return false;
    if (typeof window.BTRoblox.settings === "undefined") return false;
    if (typeof window.BTRoblox.settings.gamedetails === "undefined") return false;

    // Added on v3.4.0 along with the unlocked date display
    if (typeof window.BTRoblox.settings.gamedetails.compactBadgeStats === "undefined") return false;

    // Strict check in case showBadgeOwned gets renamed in the future
    return window.BTRoblox.settings.gamedetails.showBadgeOwned === true;
}

function updateDisplay() {
    var moreBadgeBtn = document.getElementsByClassName("btn-full-width btn-control-sm ng-binding")[0];
    if (moreBadgeBtn === undefined) {
        // New UI
        moreBadgeBtn = document.getElementsByClassName("btn-control-md btn-full-width")[0]
    }

    if (moreBadgeBtn !== undefined) {
        moreBadgeBtn.click();
        window.needUpdate = true;
    }

    const oldLength = badgeNodes.length;
    badgeNodes = getBadgeNodes();
    if (oldLength !== badgeNodes.length) {
        updateBadgeIdList();
        window.needUpdate = true;
    }

    const showEarnedBtn = document.getElementById("showEarnedBadges");
    if (showEarnedBtn !== null) {
        if (showEarnedBadges !== showEarnedBtn.checked) {
            showEarnedBadges = !showEarnedBadges;
            window.needUpdate = true;
        }
    }

    const showLessBtn = document.getElementById("showLessBadges");
    if (showLessBtn !== null) {
        if (showLessBadges !== showLessBtn.checked) {
            showLessBadges = !showLessBadges;
            window.needUpdate = true;
        }
    }

    const ignoreNonLegacyBtn = document.getElementById("hideNonLegacy");
    if (ignoreNonLegacyBtn !== null) {
        if (hideNonLegacy !== ignoreNonLegacyBtn.checked) {
            hideNonLegacy = !hideNonLegacy;
            window.needUpdate = true;
        }
    }

    const ignoreNonValuableBtn = document.getElementById("hideNonValuable");
    if (ignoreNonValuableBtn !== null) {
        if (hideNonValuable !== ignoreNonValuableBtn.checked) {
            hideNonValuable = !hideNonValuable;
            window.needUpdate = true;
        }
    }

    const hideVIPBtn = document.getElementById("hideVIP");
    if (hideVIPBtn !== null) {
        if (hideVIP !== hideVIPBtn.checked) {
            hideVIP = !hideVIP;
            window.needUpdate = true;
        }
    }

    const easinessElm = document.getElementById("easiness");
    if (easinessElm !== null) {
        const newEasiness = easinessElm.options[easinessElm.selectedIndex].value;
        if (easiness !== newEasiness) {
            easiness = newEasiness;
            window.needUpdate = true;
        }
    }

    const invertDiffElm = document.getElementById("invertDiff");
    if (invertDiffElm !== null) {
        const newInvertDiff = invertDiffElm.checked;
        if (invertDiff !== newInvertDiff) {
            invertDiff = newInvertDiff;
            window.needUpdate = true;
        }
    }

    const hideMeetBtn = document.getElementById("hideMeet");
    if (hideMeetBtn !== null) {
        if (hideMeet !== hideMeetBtn.checked) {
            hideMeet = !hideMeet;
            window.needUpdate = true;
        }
    }

    const hideGroupBtn = document.getElementById("hideGroup");
    if (hideGroupBtn !== null) {
        if (hideGroup !== hideGroupBtn.checked) {
            hideGroup = !hideGroup;
            window.needUpdate = true;
        }
    }

    var notEarned = 0;
    var displayed = 0;
    allBadgeIds[curPlaceId].forEach(function decideBadge(badgeId, i) {
        if (badgeTitles[curPlaceId].length <= i || badgeTitles[curPlaceId][i].length === 0) {
            try {
                badgeOrigTitles[curPlaceId][i] = badgeNodes[i].getElementsByClassName("badge-name")[0].textContent;
                badgeTitles[curPlaceId][i] = badgeOrigTitles[curPlaceId][i].toLowerCase().split(" ");
                updateIsMeet(i);
                updateIsPaid(i);
                updateIsGroup(i);
            } catch(a) {
                badgeOrigTitles[curPlaceId][i] = "";
                badgeTitles[curPlaceId][i] = [];
            }
        }

        if (badgeDescs[curPlaceId].length <= i || badgeDescs[curPlaceId][i].length === 0) {
            try {
                let badgeDesc = badgeNodes[i].getElementsByClassName("para-overflow");
                if (badgeDesc.length > 0) {
                    // New UI
                    badgeDesc = badgeDesc[0].textContent;
                } else {
                    badgeDesc = badgeNodes[i].childNodes[3].childNodes[1].childNodes[3].childNodes[0].textContent;
                }

                badgeDescs[curPlaceId][i] = badgeDesc.toLowerCase().split(" ");
                updateIsMeet(i);
                updateIsPaid(i);
                updateIsGroup(i);
            } catch(a) {
                badgeDescs[curPlaceId][i] = [];
            }
        }

        if (badgeDiffs[curPlaceId].length <= i || badgeDiffs[curPlaceId][i] === -1) {
            badgeDiffs[curPlaceId][i] = getDifficulty(badgeNodes[i].getElementsByClassName("badge-stats-info")[0].textContent);
        }

        if (badgeDiffRates[curPlaceId].length <= i || badgeDescs[curPlaceId][i].length === 0) {
            badgeDiffRates[curPlaceId][i] = badgeNodes[i].getElementsByClassName("badge-stats-info")[0].textContent.split(" ")[0];
        }

        if (!window.needUpdate) {
            return;
        }

        var isTooHard;
        if (!invertDiff) {
            isTooHard = easiness < badgeDiffs[curPlaceId][i];
        } else {
            isTooHard = easiness > badgeDiffs[curPlaceId][i];
        }

        var isEarned = ownedBadgeIds[curPlaceId].has(badgeId) || userId === 0;

        var hide = isEarned && !showEarnedBadges;
        hide = hide || isTooHard;
        hide = hide || (badgeIsPaid[curPlaceId][i] && hideVIP);
        hide = hide || (badgeIsMeet[curPlaceId][i] && hideMeet);
        hide = hide || (badgeIsGroup[curPlaceId][i] && hideGroup);
        hide = hide || (badgeId > 2124945818 && hideNonLegacy); // https://www.roblox.com/badges/2124945818
        hide = hide || ((getBadgeValue(curPlaceId, badgeId) == 0 || isNVL(badgeId)) && hideNonValuable);

        if (!hide && ownershipCheckedBadgeIds[curPlaceId].has(badgeId)) {
            notEarned += 1;
        }

        badgeIsFiltered[curPlaceId][i] = hide;

        if (showLessBadges && displayed >= 500) {
            hide = true;
        }

        if (!hide) {
            displayed += 1;
        }
        var targetDisplay = hide ? "none" : "";
        if (badgeNodes[i].style.display !== targetDisplay) badgeNodes[i].style.display = targetDisplay;

        let wonAt = getBadgeWonAt(curPlaceId, badgeId);
        let badgeDataContainer = badgeNodes[i].getElementsByClassName("badge-data-container")[0];
        let badgeStatsContainer = badgeNodes[i].getElementsByClassName("badge-stats-container")[0];
        if (wonAt !== null && !isBTRobloxShowingUnlockedDate() && [3, 7].includes(badgeStatsContainer.childNodes.length)) {
            badgeDataContainer.style.width = "46.67%";
            badgeStatsContainer.style.width = "53.33%";

            if (badgeStatsContainer.childNodes.length == 3) {
                // New UI
                for (let k = 0; k < 3; k ++) {
                    badgeStatsContainer.childNodes[k].style.width = "25%";
                }
            } else {
                for (let k = 1; k < 7; k += 2) {
                    badgeStatsContainer.childNodes[k].style.width = "25%";
                }
            }

            badgeStatsContainer.innerHTML += `<li style="width: 25%;">
    <div class="text-label ng-binding" ng-bind="translate">Won At</div>
    <div class="font-header-2 badge-stats-info ng-binding">${wonAt}</div>
</li>`;
        }
    });

    if (window.needUpdate) {
        document.getElementById("sum").innerText = `    Stats: ${badgeStatusReport(curPlaceId, notEarned, false)}`;
    }
    window.needUpdate = false;
}

function findBadgeHeader() {
    let badgeHeaderChild = document.querySelector(`[ng-bind="'HeadingGameBadges' | translate"`);
    if (badgeHeaderChild !== null) {
        return badgeHeaderChild.parentNode;
    } else {
        let newBadgeContainers = document.getElementsByClassName("stack badge-container game-badges-list")
        if (newBadgeContainers.length > 0) {
            return newBadgeContainers[0].getElementsByClassName("container-header")[0];
        }
    }

    return null;
}

function injectOption() {
    var badgeHeader = findBadgeHeader()
    if (badgeHeader === null) {
        return false;
    }

    badgeHeader.innerHTML += `
    <span id="sum">    Stats: 0 total, 0 to earn, 0 to check ownership, 0 to check value, NaN% done</span>
    <br>
    <input type="checkbox" id="showEarnedBadges" name="showEarnedBadges">
    <label for="showEarnedBadges">    Show earned badges</label>
    <input type="checkbox" id="showLessBadges" name="showLessBadges">
    <label for="showLessBadges">    Show less badges (500 only)</label>
    <br>
    <span> Hide badges of this kind:
    <input type="checkbox" id="hideVIP" name="hideVIP">
    <label for="hideVIP">    Non-Free</label>
    <input type="checkbox" id="hideMeet" name="hideMeet">
    <label for="hideMeet">    Meet Player</label>
    <input type="checkbox" id="hideGroup" name="hideGroup">
    <label for="hideGroup">    Join Group</label>
    <br>
    <input type="checkbox" id="hideNonLegacy" name="hideNonLegacy">
    <label for="hideNonLegacy">    Hide non-legacy badges</label>
    <input type="checkbox" id="hideNonValuable" name="hideNonValuable">
    <label for="hideNonValuable">    Hide non-valuable badges (Still displays Legacy badges)</label>
    <br>
    <label for="easiness">Filter by easiness:</label>
    <select id="easiness" style="color: black;" name="easiness">
    <option selected="selected" value=8>Impossible</option>
    <option value=7>Insane</option>
    <option value=6>Extreme</option>
    <option value=5>Hard</option>
    <option value=4>Challenging</option>
    <option value=3>Moderate</option>
    <option value=2>Easy</option>
    <option value=1>Cake Walk</option>
    <option value=0>Freebie</option>
    </select>
    <input type="checkbox" id="invertDiff" name="invertDiff">
    <label for="invertDiff">    Only show hard badges (and hide easy ones)</label>
    <br>
    <button style="background-color: #808080" id="updateUnearned">Check new earned badges</button>
    <button style="background-color: #808080" id="exportBadgeAsCode">Export badge ids as code (displayed only)</button>
    <button style="background-color: #808080" id="exportBadgeChecklist">Export badge checklist</button>
    <br>
    <button style="background-color: #808080" id="recheckOwnershipInGame">Recheck ownership of badges in this game</button>
    <button style="background-color: #808080" id="recheckOwnershipInAll">Recheck ownership of all badges</button>`;
    document.getElementById("updateUnearned").addEventListener("click", window.refreshAllUnearned.bind(null, curPlaceId));
    document.getElementById("exportBadgeAsCode").addEventListener("click", window.exportBadgeAsCode.bind(null, curPlaceId));
    document.getElementById("exportBadgeChecklist").addEventListener("click", window.exportBadgeChecklist.bind(null, curPlaceId));
    document.getElementById("recheckOwnershipInGame").addEventListener("click", window.recheckOwnershipInGame.bind(null, curPlaceId, false));
    document.getElementById("recheckOwnershipInAll").addEventListener("click", window.recheckOwnershipInAll.bind(null, curPlaceId));
    return true;
}
// End


// Start /badgeWatch
window.watchlist = new Map();
window.bwOptions = {
    sortOption: 2,
    diffFilter: 0,
    perfMode: false,
    ignoreNonLegacy: false,
    ignoreNonValuable: false,
    placeMinBadgeToEarn: 0,
    placeMinBadgeAvail: 0
};

var placeCheckingOwnerships = new Set();
var placeCheckingValues = new Set();

function injectWatchMenu() {
    var optionMenu = document.getElementById("settings-popover-menu");
    if (optionMenu === null) {
        setTimeout(injectWatchMenu, 100);
        return false;
    }

    if (!optionMenu.innerHTML.includes("Badge Watch")) {
        var li = document.createElement("li");
        li.innerHTML = `<a class="rbx-menu-item" href="https://www.roblox.com/badgeWatch">Badge Watch</a>`;
        optionMenu.prepend(li);
    }

    setTimeout(injectWatchMenu, 100);
}

var multigetPlaceDetailsRequestCooldown = 0

async function getPlaceInfo(placeId) {
    if (multigetPlaceDetailsRequestCooldown >= 200) return undefined;

    multigetPlaceDetailsRequestCooldown += 67;
    var data = await fetchWrap(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`);
    if (data.length === 0) {
        return {};
    }

    var ret = data[0];
    if (ret === undefined) {
        multigetPlaceDetailsRequestCooldown = 3000;
    }
    return ret;
}

async function fetchWrap(url) {
    var response = await fetch(url, {
        credentials: "include"
    });

    return await response.json();
}

function addBadge(placeId, badge) {
    if (badge.enabled) {
        allBadgeIds[placeId].push(badge.id);
        badgeDiffRates[placeId].push(badge.statistics.winRatePercentage);
        if (badge.awardingUniverse.name != window.watchlist.get(placeId).name) {
            // console.log(`Update ${placeId} name from ${window.watchlist.get(placeId).name} to ${badge.awardingUniverse.name}`)
            window.watchlist.get(placeId).name = badge.awardingUniverse.name
        }
    } else {
        disabledBadgeCount[placeId] += 1;
    }

    window.needUpdate = true;
}

function updateWatchInfo(placeId) {
    var statusDOM = document.getElementById(placeId.toString());
    if (statusDOM !== null) statusDOM.innerText = badgeStatusReport(placeId, badgesToEarn[placeId], true);
}

var listBadgesRequestCooldown = 0;

async function refreshPlaceBadges(placeId) {
    var cursor = null;
    while (true) {
        var url = `https://badges.roblox.com/v1/universes/${window.watchlist.get(placeId).universeId}/badges?limit=100&sortOrder=Desc`;
        if (cursor !== null) url += `&cursor=${cursor}`;

        while (true) {
            if (listBadgesRequestCooldown >= 200) {
                await sleep(50);
                continue;
            }
            listBadgesRequestCooldown += 20;

            var response = await fetchWrap(url);
            if (response.data !== undefined) break;
            listBadgesRequestCooldown = 15000;
        }

        if (cursor == null && response.data.length !== 0) {
            lastBadgeDate[placeId] = Date.parse(response.data[0].created);
        }

        response.data.forEach((badge) => addBadge(placeId, badge));

        updateWatchInfo(placeId);
        window.needUpdate = true;

        cursor = response.nextPageCursor;
        if (cursor === null) break;
    }

    refreshesPending.delete(placeId);
    refreshesGoing.delete(placeId);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addWatchlist = async function addWatchlist(input, manual=false) {
    if (input.includes("\n")) {
        var lines = input.split("\n");
        if (lines.length == 1) {
            input = lines[0];
        } else {
            if (manual) document.getElementById("addGame").value = `Bulk importing ${lines.length} lines`;

            lines.forEach(function (line) {
                addWatchlist(line);
            });
            return;
        }
    }

    // Handle comment and do whitespace cleanup
    input = input.split("--")[0].trim();

    if (input[0] == "[") { // V1 watchlist format
        let entries = JSON.parse(input);
        for (let i = 0, n = entries.length; i < n; i++) {
            addWatchlist(entries[i], false);
        }
        return;
    }

    let placeId = null;
    let parts = input.split(" ");
    if (input.startsWith("https://www.roblox.com/games/")) { // Game URL
        placeId = input.split("/")[4];
    } else {
        placeId = parts[0];
    }

    if (placeId == "" || placeId[0] == "0" || parts.length > 2) {
        if (manual) document.getElementById("addGame").value = "Invalid link/id!";
        return;
    }

    if (window.watchlist.has(placeId)) {
        if (manual) document.getElementById("addGame").value = "Already in the watchlist!";
        placesPending.delete(input);
        placesAdding.delete(input);
        return;
    }

    if (manual) document.getElementById("addGame").value = "Adding to the watchlist";

    if (parts.length == 2) { // V3 watchlist format
        let universeId = parseInt(parts[1]);
        window.needUpdate = true;
        window.watchlist.set(placeId, {
            universeId: universeId,
            name: "Loading...",
        });

        initPlaceRecord(placeId);
        refreshesPending.add(placeId);
    } else {
        placesPending.add(placeId);
    }
};

var placesPending = new Set();
var placesAdding = new Set();
function placeAddingWorker() {
    placesPending.forEach((placeId) => {
        if (placesAdding.size >= 50 || placesAdding.has(placeId)) return;
        placesAdding.add(placeId);
        getPlaceInfo(placeId).then(async (response) => {
            placesAdding.delete(placeId);
            if (response !== undefined) {
                placesPending.delete(placeId);
                window.needUpdate = true;
                if (window.watchlist.has(placeId)) return;
                if (!response.isPlayable) return;

                window.watchlist.set(placeId, {
                    universeId: response.universeId,
                    name: response.name,
                });

                initPlaceRecord(placeId);
                refreshesPending.add(placeId);
            } else {
                await sleep(200);
                addWatchlist(placeId, false);
            }
        })
    })
}

var refreshesPending = new Set()
var refreshesGoing = new Set()
function placeRefreshingWorker() {
    refreshesPending.forEach((placeId) => {
        if (refreshesGoing.size >= 50 || refreshesGoing.has(placeId)) return;
        refreshesGoing.add(placeId);
        refreshPlaceBadges(placeId);
    })
}

// https://stackoverflow.com/a/56150320/13197635
window.jsonMapReplacer = function jsonMapReplacer(_key, value) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function jsonMapReviver(_key, value) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

window.bwStringifyWatchlist = function bwStringifyWatchlist(isExport) {
    let lines = []
    window.watchlist.forEach((value, key) => {
        let line = `${key} ${value["universeId"]}`;
        if (isExport) {
            line += `  -- ${value["name"]}`;
        }
        lines.push(line);
    })
    return lines.join("\n");
}

window.saveWatchlist = async function saveWatchlist() {
    await storeSetVal("bwWatchlistV3", window.bwStringifyWatchlist(false));
    alert("Watchlist saved");
};

function updateBadgeStats(placeId) {
    var totalConsidered = 0;
    var totalNotEarned = 0;
    for (let i = 0, n = allBadgeIds[placeId].length; i < n; i++) {
        let badgeId = allBadgeIds[placeId][i];
        var badgeConsidered = badgeDiffRates[placeId][i] >= window.bwOptions.diffFilter;
        badgeConsidered = badgeConsidered && (!window.bwOptions.ignoreNonLegacy || badgeId <= 2124945818); // https://www.roblox.com/badges/2124945818
        badgeConsidered = badgeConsidered && (!window.bwOptions.ignoreNonValuable || (getBadgeValue(placeId, badgeId) != 0 && !isNVL(badgeId)));
        if (badgeConsidered) {
            totalConsidered += 1;
            if (ownershipCheckedBadgeIds[placeId].has(badgeId) && !ownedBadgeIds[placeId].has(badgeId)) {
                totalNotEarned += 1;
            }
        }
    }

    badgesToConsider[placeId] = totalConsidered;
    badgesToEarn[placeId] = totalNotEarned;
}

function bwSortKey(placeId) {
    switch (window.bwOptions.sortOption) {
        case 0:
            return Number(placeId);
        case 1:
            return badgesToEarn[placeId];
        case 2:
            return allBadgeIds[placeId].length;
        case 3:
        case 4:
            return getDonePrecent(placeId, badgesToEarn[placeId]);
        case 5:
            return lastBadgeDate[placeId];
        case 6:
            return allBadgeIds[placeId].length - ownershipCheckedBadgeIds[placeId].size;
        case 7:
            return badgesToConsider[placeId];
    }
}

function placeSort(a, b) {
    switch (window.bwOptions.sortOption) {
        case 0:
        case 4:
            return bwSortKey(a) - bwSortKey(b);
        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
        case 7:
            return bwSortKey(b) - bwSortKey(a);
    }
}

window.bwGenReport = function bwGenReport() {
    var ret = `Watch list report, sorted using key "${sortOptionNames[window.bwOptions.sortOption]}"\n`;
    if ([1, 3, 4, 7].includes(window.bwOptions.sortOption)) {
        ret += `Difficulty filter is set to ${window.bwOptions.diffFilter}\n`;

        if (window.bwOptions.ignoreNonLegacy) {
            ret += "Non-legacy Badges (badges with id higher than 2124945818) are ignored\n";
        } else {
            ret += "Non-legacy Badges (badges with id higher than 2124945818) are considered\n";
        }

        if (window.bwOptions.ignoreNonValuable) {
            ret += "Non-valuable Badges (badges that didn't cost Robux to create) are ignored\n";
        } else {
            ret += "Non-valuable Badges (badges that didn't cost Robux to create) are considered\n";
        }
    }

    ret += "\nKey,Name,Link,V3Entry\n"
    var sortedDOM = allPlaces.sort(placeSort);
    sortedDOM.forEach(function (placeId) {
        let entry = window.watchlist.get(placeId);
        ret += `${bwSortKey(placeId)},${entry["name"].replace(",", "-")},https://www.roblox.com/games/${placeId},${placeId} ${entry["universeId"]}\n`;
    });

    return ret;
};

function placeFiltered(placeId) {
    var filtered = badgesToEarn[placeId] < window.bwOptions.placeMinBadgeToEarn;
    filtered = filtered || allBadgeIds[placeId].length < window.bwOptions.placeMinBadgeAvail;
    return filtered;
}

function renderWatchlist() {
    if (!window.needUpdate) return;

    var watchlistHTML = "";

    if (placesPending.size > 0) {
        watchlistHTML += `
        <h4>Adding ${placesPending.size} places to the watchlist`;

        if (multigetPlaceDetailsRequestCooldown >= 400) {
            watchlistHTML += ` (retrying in ${multigetPlaceDetailsRequestCooldown}ms)`
        }

        watchlistHTML += `</h4>
        `;
    }

    if (refreshesPending.size > 0) {
        watchlistHTML += `
        <h4>Counting badges in ${refreshesPending.size} places`

        if (listBadgesRequestCooldown >= 400) {
            watchlistHTML += ` (retrying in ${listBadgesRequestCooldown}ms)`
        }

        watchlistHTML += `</h4>
        `;
    }

    if (placeCheckingOwnerships.size > 0) {
        watchlistHTML += `
        <h4>Checking badge ownerships in ${placeCheckingOwnerships.size} places`

        if (awardedDatesRequestCooldown >= 400) {
            watchlistHTML += ` (retrying in ${awardedDatesRequestCooldown}ms)`
        }

        watchlistHTML += `</h4>
        `;
    }

    if (placeCheckingValues.size > 0) {
        watchlistHTML += `
        <h4>Checking badge values in ${placeCheckingValues.size} places</h4>
        `;
    }

    for (let i = 0, n = allPlaces.length; i < n; i++) {
        updateBadgeStats(allPlaces[i]);
    }

    var sortedDOM = allPlaces.sort(placeSort);
    var perfModeShow = 100;
    var placesToShow = 0;
    var stop = false;
    var filteredPlaces = new Set();
    for (let i = 0, n = sortedDOM.length; i < n; i++) {
        let placeId = sortedDOM[i];
        if (placeFiltered(placeId)) {
            filteredPlaces.add(placeId);
            continue;
        }

        placesToShow += 1;
        if (stop) continue;

        watchlistHTML += `
        <h4>
        <a id="${placeId}Link" href="https://www.roblox.com/games/${placeId}">${window.watchlist.get(placeId).name}</a>
        <button style="background-color: #808080" onclick="window.refreshUnearned(${placeId})">Check new earned badges in this place</button>
        </h4>
        <div id="${placeId}">Waiting for first response...</div>
        <br>
        `;

        stop = window.bwOptions.perfMode && placesToShow >= perfModeShow;
    }

    if (stop && (placesToShow > perfModeShow)) {
        watchlistHTML += `
        <h4>${placesToShow - perfModeShow} places hidden</h4>
        `;
    }

    if (filteredPlaces.size > 0) {
        watchlistHTML += `
        <h4>${filteredPlaces.size} places filtered</h4>
        `;
    }

    document.getElementById("places").innerHTML = watchlistHTML;

    for (let i = 0, n = allPlaces.length; i < n; i++) {
        if (!filteredPlaces.has(allPlaces[i])) {
            updateWatchInfo(allPlaces[i]);
        }
    }

    window.saveBWOptions();

    window.needUpdate = false;
}

function updateBWDisplay() {
    document.title = "NyanCatTW1's badge watch";
    renderWatchlist();
}

window.showBWStats = function showBWStats() {
    var stats = "There are:\n";
    stats += `${window.watchlist.size} places in the watchlist\n`;

    var allSum = 0;
    var consideredSum = 0;
    var ownedSum = 0;
    var unearnedSum = 0;
    Object.keys(allBadgeIds).forEach(function (placeId) {
        allSum += allBadgeIds[placeId].length;
        consideredSum += badgesToConsider[placeId];
        ownedSum += ownedBadgeIds[placeId].size;
        unearnedSum += badgesToEarn[placeId];
    });

    stats += `${allSum} badges in the watchlist, ${consideredSum} of which are considered\n`;
    stats += `${ownedSum} owned badges in the watchlist\n`;
    stats += `${unearnedSum} badges to earn in the watchlist\n`;
    stats += `${Math.min(100, Math.max(0, 100 - (unearnedSum / allSum * 100))).toFixed(2)}% earned in the watchlist\n`;

    alert(stats);
};

var sortOptionNames = [
    "Place id (ascending)",
    "Amount of badges to earn (descending)",
    "Total badges (descending)",
    "Done percent (descending)",
    "Done percent (ascending)",
    "Last badge creation date (newer)",
    "Amount of badges to check for ownership (descending)",
    "Amount of badges considered aka. not filtered (descending)",
];

async function initBadgeWatch() {
    document.getElementsByClassName("content")[0].innerHTML = `
    <h4>Yeah, NyanCatTW1 are out of their mind.</h4>
    <h4>Wear safety googles, this place is on the bleeding edge.</h4>
    <br>
    <label for="addGame">Add game(s) to watch (Supports game URLs, place ids, and V1/V3 watchlists. Separate entries by newline and use "--" for line comments): </label>
    <textarea type="text" id="addGame" name="addGame" onfocus="this.value=''"></textarea>
    <button style="background-color: #808080" onclick="window.addWatchlist(document.getElementById('addGame').value, true)">Add to watchlist</button>
    <br><br>
    <label for="sortOption">Sort places by:</label>
    <select id="sortOption" style="color: black;" name="sortOption" onchange="window.bwOptions.sortOption = Number(document.getElementById('sortOption').value); window.needUpdate = true">
    <option value=0>${sortOptionNames[0]}</option>
    <option value=1>${sortOptionNames[1]}</option>
    <option selected="selected" value=2>${sortOptionNames[2]}</option>
    <option value=3>${sortOptionNames[3]}</option>
    <option value=4>${sortOptionNames[4]}</option>
    <option value=5>${sortOptionNames[5]}</option>
    <option value=6>${sortOptionNames[6]}</option>
    <option value=7>${sortOptionNames[7]}</option>
    </select>
    <br>
    <label for="diffFilter">Ignore badges with win rate below (0~1, ~0 shows Impossible, ~1 shows only Freebie):</label>
    <input type="number" id="diffFilter" name="diffFilter" min="0" max="1" step="0.01" value="0" onchange="window.bwOptions.diffFilter = Number(this.value); window.needUpdate = true">
    <br>
    <label for="ignoreNonLegacy">Ignore badges created after badges were made free (Non-legacy)</label>
    <input type="checkbox" id="ignoreNonLegacy" name="ignoreNonLegacy" onchange="window.bwOptions.ignoreNonLegacy = this.checked; window.needUpdate = true">
    <br>
    <label for="ignoreNonValuable">Ignore badges that were created for free (Non-valuable)</label>
    <input type="checkbox" id="ignoreNonValuable" name="ignoreNonValuable" onchange="window.bwOptions.ignoreNonValuable = this.checked; window.needUpdate = true">
    <br>
    <label for="perfMode">Performance mode (Show up to 100 places only)</label>
    <input type="checkbox" id="perfMode" name="perfMode" onchange="window.bwOptions.perfMode = this.checked; window.needUpdate = true">
    <br>
    <label for="placeMinBadgeToEarn">Only show places with at least X badges to earn:</label>
    <input type="number" id="placeMinBadgeToEarn" name="placeMinBadgeToEarn" min="0" step="1" value="0" onchange="window.bwOptions.placeMinBadgeToEarn = Number(this.value); window.needUpdate = true">
    <br>
    <label for="placeMinBadgeAvail">Only check badge / show place if it has at least X badges available:</label>
    <input type="number" id="placeMinBadgeAvail" name="placeMinBadgeAvail" min="0" step="1" value="0" onchange="window.bwOptions.placeMinBadgeAvail = Number(this.value); window.needUpdate = true">
    <br>
    <button style="background-color: #808080" onclick="window.refreshAllUnearned()">Check new earned badges in every place</button>
    <button style="background-color: #808080"  onclick="window.showBWStats()">Show stats (in an alert window)</button>
    <br>
    <br>
    <button style="background-color: #808080" id="saveWatchlistBtn">Save watchlist</button>
    <button style="background-color: #808080" id="clearWatchlistBtn">Clear saved watchlist (effective after refresh)</button>
    <br>
    <button style="background-color: #808080" onclick="window.copyStringToClipboard(window.bwStringifyWatchlist(false)); alert('Exported to the clipboard')">Export watchlist to the clipboard</button>
    <button style="background-color: #808080" onclick="window.copyStringToClipboard(window.bwStringifyWatchlist(true)); alert('Exported to the clipboard')">Export watchlist w/ place names to the clipboard</button>
    <br>
    <button style="background-color: #808080" onclick="window.copyStringToClipboard(window.bwGenReport()); alert('Exported to the clipboard')">Export watchlist report to the clipboard</button>
    <div id="places"></div>
    `;

    document.getElementById("saveWatchlistBtn").onclick = window.saveWatchlist;
    document.getElementById("clearWatchlistBtn").onclick = window.clearWatchlist;

    loadBWOptions();
    if (localStorage.hasOwnProperty("bwWatchlistV2")) {
        window.watchlist = JSON.parse(localStorage.bwWatchlistV2, jsonMapReviver)
        window.watchlist.forEach((_val, placeId) => {
            initPlaceRecord(placeId);
            refreshesPending.add(placeId);
        })
    }

    if (localStorage.hasOwnProperty("bwWatchlistV3")) {
        window.addWatchlist(localStorage.bwWatchlistV3, false);
    }

    if (localStorage.hasOwnProperty("bwWatchlist")) {
        JSON.parse(localStorage.bwWatchlist).forEach((placeId) => window.addWatchlist(placeId, false));
    }

    if (await storeHasKey("bwWatchlistV3")) {
        window.addWatchlist(await storeGetVal("bwWatchlistV3"), false);
    }

    setInterval(updateBWDisplay, 100);
}
// End

window.clearWatchlist = async function clearWatchlist() {
    if (confirm("Are you sure about this? Your watchlist will be irreversibly reset!")) {
        localStorage.removeItem("bwWatchlist");
        localStorage.removeItem("bwWatchlistV2");
        localStorage.removeItem("bwWatchlistV3");
        await storeDeleteVal("bwWatchlistV3");
    }
}

async function saveOwnedBadges() {
    if (ownedUnclean) {
        let arrayOwnedBadgeIds = {};
        for (let placeId in ownedBadgeIds) {
            arrayOwnedBadgeIds[placeId] = [...ownedBadgeIds[placeId]];
        }

        await storeSetVal(`nyanOwnedBadgeIds_${userId}`, arrayOwnedBadgeIds);
        await storeSetVal(`nyanBadgeWonAtDict_${userId}`, badgeWonAtDict);
        ownedUnclean = false;
    }
}

async function loadOwnedBadges() {
    for (let key in localStorage) {
        if (key.startsWith("nyanOwnedBadge") || key.startsWith("nyanBadgeWonAtDict")) {
            localStorage.removeItem(key);
        }
    }

    let ownedBadgeIdsName = `nyanOwnedBadgeIds_${userId}`;
    if (await storeHasKey(ownedBadgeIdsName)) {
        var loaded = await storeGetVal(ownedBadgeIdsName);
        Object.keys(loaded).forEach(function (placeId) {
            ownedBadgeIds[placeId] = new Set(loaded[placeId]);
            ownershipCheckedBadgeIds[placeId] = new Set(loaded[placeId]);
        });
    }

    let badgesWonAtDictName = `nyanBadgeWonAtDict_${userId}`;
    if (await storeHasKey(badgesWonAtDictName)) {
        var loaded = await storeGetVal(badgesWonAtDictName);
        Object.keys(loaded).forEach(function (placeId) {
            badgeWonAtDict[placeId] = loaded[placeId];
        });
    }
}

window.saveBWOptions = function saveBWOptions() {
    localStorage.nyanBWOptions = JSON.stringify(window.bwOptions);
}

function loadBWOptions() {
    if (localStorage.hasOwnProperty("nyanBWOptions")) {
        var loaded = JSON.parse(localStorage.nyanBWOptions);
        for (var key of Object.keys(loaded)) {
            var elm = document.getElementById(key);
            if (typeof(elm) === 'undefined' || elm == null) continue;

            elm.value = loaded[key];
            elm.checked = loaded[key];
            window.bwOptions[key] = loaded[key];
        }
    }
}

function tickDownRequestCooldown() {
    if (listBadgesRequestCooldown + awardedDatesRequestCooldown + multigetPlaceDetailsRequestCooldown != 0) {
        window.needUpdate = true;
    }
    listBadgesRequestCooldown = Math.max(0, listBadgesRequestCooldown - 200);
    awardedDatesRequestCooldown = Math.max(0, awardedDatesRequestCooldown - 200);
    multigetPlaceDetailsRequestCooldown = Math.max(0, multigetPlaceDetailsRequestCooldown - 200);
}

function updateBadgesPageDisplay() {
    var curPlaceId = allPlaces[0];

    var badgeValue = getBadgeValue(curPlaceId, allBadgeIds[curPlaceId][0]);
    if (isNaN(badgeValue)) {
        badgeValue = 0;
    } else {
        badgeValue += 1;
    }

    if (isNVL(allBadgeIds[curPlaceId][0])) {
        badgeValue = 4;
    }

    var badgeValueDescs = ["Loading...", "Free", "Valuable (non-legacy)", "Legacy", "Non-Valuable Legacy"];
    var badgeValueElm = document.getElementById("nyan-badge-value");
    if (badgeValueElm === null) {
        document.getElementsByClassName("clearfix item-type-field-container")[0].outerHTML += `
<div class="clearfix item-field-container">
    <div class="font-header-1 text-subheader text-label text-overflow field-label">Value</div>
    <div class="field-content" id="nyan-badge-value">Loading...</div>
</div>`;
    } else if (badgeValueElm.innerText != badgeValueDescs[badgeValue]) {
        badgeValueElm.innerText = badgeValueDescs[badgeValue];
    }
}

// Init
async function init() {
    injectWatchMenu();
    setUserId();
    await loadOwnedBadges();

    setInterval(saveOwnedBadges, 5000);
    setInterval(tickDownRequestCooldown, 200);
    setInterval(placeAddingWorker, 100);
    setInterval(placeRefreshingWorker, 100);

    if (onGamePage) {
        curPlaceId = document.getElementById("game-detail-page").dataset.placeId;
        initPlaceRecord(curPlaceId);
        setInterval(updateDisplay, 100);
        injectOption();
    } else if (onBadgeWatch) {
        await initBadgeWatch();
    } else if (onBadgesPage) {
        // F: I know, I know, it's dirty like hell
        curPlaceId = [].concat.apply([], document.getElementsByTagName("a"))
                     .filter((elm) => elm.href.includes("PlaceId="))[0]
                     .href.split("PlaceId=")[1].split("&")[0];
        initPlaceRecord(curPlaceId);
        allBadgeIds[curPlaceId].push(location.href.split("/")[4])
        setInterval(updateBadgesPageDisplay, 100);
    }

    setInterval(checkBadgeOwnerships, 100);
    setInterval(checkBadgeValues, 100);
}

async function waitForInit() {
    while (true) {
        onGamePage = location.href.includes("/game");
        onBadgeWatch = location.href.includes("/badgeWatch");
        onBadgesPage = location.href.includes("/badges/");

        if (!onGamePage || findBadgeHeader() !== null) {
            await init();
            return;
        } else {
            await sleep(100);
        }
    }
}

// indexedDB handling
var iDBOpenRequest = null;
async function iDBOnsuccess() {
    iDB = iDBOpenRequest.result;
    iDB.onversionchange = function() {
        iDB.close();
        iDB = null;
        alert("Badge hunter assist script on this page is outdated, please reload the page.");
    };

    await waitForInit();
}

function storeHasKey(key) {
    return new Promise((resolve, reject) => {
        let transaction = iDB.transaction("store", "readonly");
        console.log(iDB, transaction);
        let store = transaction.objectStore("store");
        let countRequest = store.count(key);
        countRequest.onsuccess = () => {
            resolve(countRequest.result != 0);
        }
        countRequest.onerror = reject;
    });
}

function storeGetVal(key) {
    return new Promise((resolve, reject) => {
        let transaction = iDB.transaction("store", "readonly");
        let store = transaction.objectStore("store");
        let getRequest = store.get(key);
        getRequest.onsuccess = () => {
            resolve(getRequest.result["val"]);
        }
        getRequest.onerror = reject;
    });
}

function storeSetVal(key, val) {
    return new Promise(async (resolve, reject) => {
        await storeDeleteVal(key);

        let transaction = iDB.transaction("store", "readwrite");
        let store = transaction.objectStore("store");
        let addRequest = store.add({
            "key": key,
            "val": val,
        });
        addRequest.onsuccess = resolve;
        addRequest.onerror = reject;
    });
}

function storeDeleteVal(key) {
    return new Promise(async (resolve, reject) => {
        if (!await storeHasKey(key)) {
            resolve();
            return;
        }

        let transaction = iDB.transaction("store", "readwrite");
        let store = transaction.objectStore("store");
        let deleteRequest = store.delete(key);
        deleteRequest.onsuccess = resolve;
        deleteRequest.onerror = reject;
    });
}

if (indexedDB) {
    iDBOpenRequest = indexedDB.open("nyan", 1)
    iDBOpenRequest.onsuccess = iDBOnsuccess;
    iDBOpenRequest.onerror = waitForInit;
    iDBOpenRequest.onupgradeneeded = function() {
        iDB = iDBOpenRequest.result;
        if (!iDB.objectStoreNames.contains("store")) {
            iDB.createObjectStore("store", {keyPath: "key"});
        }
    }
} else {
    waitForInit().then();
}