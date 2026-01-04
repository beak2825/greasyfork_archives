// ==UserScript==
// @name         Torn Jail Scores
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add bust chance & quick reloads to jail page
// @author       Rosti (modified from xedx [2100735])
// @match        https://www.torn.com/jailview*
// @exclude      https://www.torn.com/loader.php*sid=attack&user2ID*
// @run-at       document-start
// @require https://update.greasyfork.org/scripts/545961/1642418/Torn-JS-Helpers.js
// @require https://update.greasyfork.org/scripts/545962/1642423/tinysort.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @connect      api.torn.com
// @connect      www.tornstats.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/545963/Torn%20Jail%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/545963/Torn%20Jail%20Scores.meta.js
// ==/UserScript==

/*eslint no-unused-vars: 0*/
/*eslint no-undef: 0*/
/*eslint curly: 0*/
/*eslint no-multi-spaces: 0*/

// The formulas used in here are taken from this forum post:
// https://www.torn.com/forums.php#/p=threads&f=61&t=16192039&b=0&a=0

// ======================= edit ~1093 ==========================

(async function() {
    'use strict';

    const DEV_MODE = true;             // Without this, scores only, no % chance etc...
    const myUserId = getThisUserId();  // Used to enable debug stuff just for myself

    // Since this is a work in progress, may need to clean up old, unusd
    // or changed stuff in storage on verion change. Need to do first
    // before the version check, which writes out this version number.
    cleanOldVersionIfo();

    // Used to turn on and off stuff not really tested, or just trying out
    // as proof of concept.
    var enablePreRelease = GM_getValue("enablePreRelease", false);
    var bustMin = GM_getValue("bustMin", 90);             // Will highlight in green at or above this %, yellow for this - 10%, and orange for that - 10%.
    var quickBustBtn = GM_getValue("quickBustBtn", true); // Change 'reload' to a bust/reload or somesuch
    var quickBustYlw = GM_getValue("quickBustYlw", false);// Also on yellows
    var hideLimit = GM_getValue("hideLimit", 0);          // Filter, don't show if under this %
    var tzDisplay = GM_getValue("tzDisplay", "utc");      // Timezone to use for calcs.
    var xtraDbgLogging = GM_getValue("xtraDbgLogging", 0);
    var optTryLastPages = GM_getValue("optTryLastPages", false);
    var blinkOnSuccess = GM_getValue("blinkOnSuccess", false);

    var showResultHistory = GM_getValue("showResultHistory", false); // Save past X results and display as a list
    var maxSavedResults = GM_getValue("maxSavedResults", 10);       // Num results to save
    var showLimits = GM_getValue("showLimits", true);               // Show current bust % limit on title bar
    var lockAnimations = GM_getValue("lockAnimations", false);

    var useLocal = false; //(tzDisplay == "local");
    var useUTC = !useLocal;
    const g_tzOffset = new Date().getTimezoneOffset();

    var routedByChatBust = false;
    var routedXID = undefined;

    // "uiless", if true, doesn't add the minimal UI - the 'save log',
    // 'hide/show' button (which will hide the un-needed UI pieces
    // unil needed), and 'fast reload' buttons.
    // The 'record stats' is mostly a dev tool, it profiles (records
    // the times and displays in the debug console) to do certain things,
    // like load/reload a page.
    var dispPenalty = GM_getValue("dispPenalty", false);   // Only if pre-releaseenabled
    var livePenaltyUpdate = true;                          // Update penalty calc immediately on bust, if in pre-release.
    const uiless = false;
    const recordStats = true;
    var firstSort = true;

    var doingReload = false;
    var reloadStart;
    var forceReloadPageNum = 0;
    var forcedPageReload = false;
    var playerCount = 0;
    var hiddenPlayers = 0;
    var totalPlayers = 0;

    // ms between calls to the API to check/recalculate penalty.
    // Eventually refine and recalc on any new bust w/o an API call, but
    // will be tricky to factor in decay (I think....)
    var penaltyCalcOnIdleInt = 5000;

    // Stats from an API call, here to use across functions
    var personalstats;

    GM_setValue("enablePreRelease", enablePreRelease);
    GM_setValue("bustMin", bustMin);
    GM_setValue("quickBustBtn", quickBustBtn);
    GM_setValue("quickBustYlw", quickBustYlw);
    GM_setValue("dispPenalty", dispPenalty);

    GM_setValue("showResultHistory", showResultHistory);
    GM_setValue("maxSavedResults", maxSavedResults);
    GM_setValue("showLimits", showLimits);
    GM_setValue("lockAnimations", lockAnimations);

    // Console logging levels
    var extraExtraDebug = GM_getValue("extraExtraDebug", false);
    debugLoggingEnabled = GM_getValue("debugLoggingEnabled", false);
    loggingEnabled = GM_getValue("loggingEnabled", true);
    const debugPastBusts = GM_getValue("debugPastBusts", false);
    const debugPenalty = GM_getValue("debugPenalty", false);

    // DO NOT EDIT!
    const MAIN_DIV_ID = "xd1";
    const MAIN_DIV_SEL = "#" + MAIN_DIV_ID;

    // TBD calc based on # rows....table may be different...
    // Just look at row sizes? Do they vary?
    const optsDivHeightDef = 70;    // 35 per inner div
    const optsDivHeightPreRelease = 105;
    const animateSpeed = 1200;

    // Time constants
    const secsPerMin = 60, minPerHr = 60, hrPerDay = 24;
    const secsInDay = secsPerMin * minPerHr * hrPerDay;
    const msPerDay = secsInDay * 1000;
    const secs72hrs = secsPerMin * minPerHr * 72;

    // Little helpers for profiling. ex: let start = _start(); .... debug("elapsed: ", elapsed(start));
    const nowInSecs = ()=>{return Math.floor(Date.now() / 1000);}
    const nowInMs = ()=>{return new Date().getTime();}
    const _start = ()=>{return nowInMs();}
    const _end = ()=>{return nowInMs();}
    const elapsed = (startTime)=>{return _end()-startTime;}

    // Global vars
    var intervalId = null;
    var savedSortId = '';
    var lLvlOrder = 'asc', lTimeOrder = 'asc', lScoreOrder = 'asc';
    var targetNode = null;
    var observer = null;
    const reloadURL = "https://www.torn.com/jailview.php";

    // Used to determine if should use saved stats or go get
    const cacheExpHrs = 48;                            // 2 days time before recheck
    const cachedStatExpire = cacheExpHrs * 60 * 60;    // in secs
    var lastStatsCheck = GM_getValue("lastStatsCheck", 0);
    var sinceLastStats = lastStatsCheck ? nowInSecs() - lastStatsCheck : 0;
    var doStatsCheck = true; // sinceLastStats ? sinceLastStats > cachedStatExpire : true;

    debug("doStatsCheck: ", doStatsCheck, " sinceLastStats: ", sinceLastStats, " cachedStatExpire: ", cachedStatExpire );

    // Cached personal stats
    var perks = {"bustChanceIncrease": 0, "bustSkillIncrease": 0, "lawPerk": false, 'totalBusts': 0};
    var userLvl = 0;
    var inLawFirm = false;

    var pastBustsStats = [];

    var skill = 1; // TBD
    var totalPenalty = 1; // TBD
    const config = { attributes: false, childList: true, subtree: true };
    const round2 = function(e) {return Number(e).toFixed(2)}

    // Time script starts
    const ScriptStartTime = _start();

    // State of the observer - used for debugging
    var isObserverOn = false;

    function cleanOldVersionIfo() {
        let curr_ver = GM_getValue('curr_ver', GM_info.script.version);
        if (Number(curr_ver) < 2.5) {
        }
    }

    // ======================================================================
    // Logging helpers. I have forgotten what is logged exactly since I
    // wrote this 5 years ago, it outputs data to file to be used to
    // fill in all the missing formulas. What is missing is the actual
    // bust percentage reported by Torn with a certain job, and how  the
    // penalty changes based on perks ... if I recall correctly
    // ======================================================================

    var logEntries = {}; // TBD: add header?
    var logQueue = [];

    // Add header to log entries
    /*
    function addLogHeader() {
        // Do I need to bother?
        addLogEntry(...);
    }
    addLogheader();
    */

    function startLogProcessQ() {
        setInterval(function() {_addLogEntry(logQueue.pop())}, 250); // Process log queue
    }

    function addLogEntry(obj, type) {
        logQueue.push({'obj': obj, 'type': type});
    }

    function _addLogEntry(data) {
        if (!data) return;
        let obj = data.obj, type = data.type;
        const timenow = Date.now();
        const tornTimenow = Math.floor(timenow / 1000);
        const timestamp = getTimeWithMilliseconds(new Date(timenow));
        let entry = {'timestamp': timestamp, 'torntime': tornTimenow, 'type': type, 'data': obj};
        logEntries[timenow] = entry;
    }

    // ========================== Midnight timer ===========================

    function msUntilMidnightUTC() {
        const now = new Date();
        const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
        return Math.floor((midnight - now));
    }

    function startMidnightTimer(timerCallback, param1, param2) {
        const delay = msUntilMidnightUTC();
        setTimeout(timerCallback, delay, param1, param2);

        let delaySecs = parseInt(delay/1000);
        let hrs = parseInt(+delaySecs / 3600);
        let remains = delaySecs - (hrs * 3600);
        let min = parseInt(remains / 60);
        let secs = remains - (min * 60);
        let tmStr = hrs + " hrs and " + min + " min";

        log("Midnight timer started. Now is: ", (new Date().toString()), " delay is: ", delaySecs, " secs or ", tmStr);
    }

    // ======================================================================

    // Helper to format a Date() object as time with milliseconds, to 3 digits
    const getTimeWithMilliseconds = date => {
        return `${date.toLocaleTimeString('it-US')}.${date.getMilliseconds()}`;
    }

    // Helper to parse a time string (33h 14m format), converting to minutes
    // On mobile: "TIME\n33h 14m"
    function parseJailTimeStr(timeStr) {
        debug("timeStr: ", timeStr, " index: ", timeStr.indexOf("TIME"));

        if (timeStr.indexOf("TIME") > -1) {
            timeStr = timeStr.replace("TIME\n", '');
            timeStr = timeStr.replace("TIME :", '');
            timeStr.trim();
        }
        debug("Parsed timeStr: ", timeStr);

        var hour = 0;
        var minute = 0;
        var minuteStart = 0;
        var end = timeStr.indexOf("h");
        if (end != -1) {
            hour = timeStr.slice(0, end);
            minuteStart = end + 2;
        }

        end = timeStr.indexOf("m");
        if (end != -1) {
            minute = timeStr.slice(minuteStart, end);
        }

        var minutes = parseInt(hour) * 60 + parseInt(minute);
        return minutes;
    }

    // Determine the penaly score for one bust, given time since (in hours)
    const c = 0.1;
    function getPenalty(p0, t) {
        let penalty_t =  (t >= 72) ? 0 : (p0 / (1 + (c * t)));
        if (debugPenalty == true) debug('[getPenalty] p0: ', p0, ' t: ', t, ' Penalty: ', penalty_t);
        return penalty_t;
    }

    // Determine p0, based on ... (TBD)
    function getP0(level=0) {
        return 17;
    }

    // Determine skill, based on perks, BS, and level (??? - TBD)
    function getSkill() {
        return userLvl;
    }

    // Helper to calculate chance of success a = 266.6 [-] , b = 0.427 [- / minute]
    //const a = 266.6, b = 0.427;
    function getSuccessRate(difficulty, skill, penalty) {
        debug('[getSuccessRate]');
        const a = 266.6, b = 0.427;
        let successRate = Math.floor(a - (b * (difficulty/skill)) - penalty);

        if (successRate > 100) successRate = 100;
        if (successRate < 0) successRate = 0;

        debug('Difficulty: ', difficulty, ' Skill: ', skill, ' Penalty: ', penalty);
        debug('Success rate: ', successRate);

        return successRate;
    }

    // Helper to get max success rate, assuming max perks and over 1,000 bust (max bustXP)
    // SR = -.286(diff/lvl) + 271.43 - my calcs from his graph
    function getMaxSuccessRate(difficulty, buster_level, penalty) {
        debug('[getMaxSuccessRate]');
        const a = -0.286, b = 271.43;
        let successRate = Math.ceil((a * (difficulty/buster_level) + b) - penalty);

        if (successRate > 100) successRate = 100;
        if (successRate < 0) successRate = 0;

        debug('Difficulty: ', difficulty, ' buster_level: ', buster_level, ' Penalty: ', penalty);
        debug('Max Success rate: ', successRate);

        return successRate;
    }

    //////////////////////////////////////////////////////////////////////
    // This adds the 'score' to the level column in the Jail view
    //////////////////////////////////////////////////////////////////////

    var savedHash = location.hash;
    var startAddJailScores;
    var clickYesRetries = 0;
    var busted = false;

    function getStartNumFromHash(hash) {
        if (!hash) return 0;

        let num = 0;
        let temp = hash.match(/(\d+)/);
        if (temp) num = temp[0];
        return num;
    }

    function hashHandler() {
        let currHash = location.hash;
        let startNum = getStartNumFromHash(currHash);
        log("Hash change! New hash: ", currHash, " saved: ", savedHash);
        log("Starting page: ", startNum);
        savedHash = currHash;
        scoresCalculated = false;
        if (currHash.indexOf("reload") > -1) {
            log("Hash changed for page jump, reload!");
            reloadUserList();
        } else {
            log("Hash changed for page jump, recals scores...");
            addJailScores();
        }
    }

    // Requires observer OFF
    function addJailScores(retries=0) {
        debug('[addJailScores] retries: ', retries);
        if (!startAddJailScores) startAddJailScores = _start();
        // Get the <UL> and list of <li>'s
        var elemList = document.getElementsByClassName('user-info-list-wrap icons users-list');
        if (elemList.length == 0) {
            debug("[addJailScores] No user list! Retries: ", retries);
            return setTimeout(addJailScores, 500, retries++);
        }
        var items = elemList[0].getElementsByTagName("li");
        if (items.length <= 1) {
            debug("[addJailScores] No list elements! Retries: ", retries);
            return setTimeout(addJailScores, 500, retries++);
        }

        // Header
        let titleBar = document.querySelector("#mainContainer > div.content-wrapper > div.userlist-wrapper > div.users-list-title.title-black");
        let levelNode = titleBar.querySelector("span.level");
        debug('Title Bar: ', titleBar, ' Score: ', document.querySelector("#score"));
        if (!document.querySelector("#score")) {
            $(levelNode).after('<span id="score" class="level">Score</span>');

            titleBar.querySelector("span.time").setAttribute('id', 'time');
            titleBar.querySelector("span.level").setAttribute('id', 'level');

            $('#score').on('click', handleTitleClick);
            $('#level').on('click', handleTitleClick);
            $('#time').on('click', handleTitleClick);
        }

        for (let i = 0; i < items.length; ++i) {
            // Get the wrapper around the time and level (and reason)
            let wrapper = items[i].getElementsByClassName("info-wrap")[0];
            if (!wrapper || $(wrapper).length) {continue;}
            let nameNode = $(wrapper).parent().find("a.user.name > span");
            let name = $(nameNode).attr('title');
            let timeStr = wrapper.children[0].innerText;
            let theString = wrapper.children[1].innerText;
            let lvlStr = theString.replace(/^\D+/g, '');
            if (lvlStr.indexOf("(") != -1) {return;} // Don't do this more than once!

            let minutes = parseJailTimeStr(timeStr);
            //debug("minutes: ", minutes);

            wrapper.children[0].setAttribute('time', minutes); // For sorting
            let score = (minutes + 180) * parseInt(lvlStr);

            // Calc success rate
            let sr = getSuccessRate(score, getSkill(), totalPenalty);
            let maxSR = getMaxSuccessRate(score, userLvl, totalPenalty);

            debug('name: ', name, ' Time: ', timeStr, ' Level: ', lvlStr, 'Difficulty: ', score);
            debug('SuccessRate: ', sr, '%', ', MaxSuccessRate: ', maxSR, '%');

            // Write out the 'difficulty', append to the level.
            var scoreStr = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            let newLi = `<span class="score level" score="${scoreStr.replace(',', '')}" sr="${maxSR}">
                            <span style="display: block; width: 59px;">${scoreStr}</span>
                            <span>${maxSR} %</span>
                        </span>`;


            let scoreNode = $(wrapper).find(".score.level");
            debug("[addJailScores] scoreNode: ", $(scoreNode).length);
            if ($(scoreNode).length) {
                $(scoreNode).replaceWith($(newLi));
            } else {
                $(wrapper.children[1]).next().css('width', '200px');
                $(wrapper.children[1]).after(newLi);
            }

            let saveData = {'name': name, 'time': timeStr, 'min': minutes, 'level':lvlStr, 'diff': score, 'sr': sr, 'msr': maxSR};
            addLogEntry(saveData, 'SCORE');
         }

        savedSortId = GM_getValue('savedSortId', savedSortId);
        if (savedSortId) {
            lLvlOrder = GM_getValue('lLvlOrder', lLvlOrder);
            lTimeOrder = GM_getValue('lTimeOrder', lTimeOrder);
            lScoreOrder = GM_getValue('lScoreOrder', lScoreOrder);
            handleTitleClick({target: {'id': savedSortId}});
        }

        debug("[addJailScores] scores calculated");
        scoresCalculated = true;
    }

    const maxYesRetries = 25;    // very big to try and find worst-case
    const retryInterval = 50;

    function findAndClickYes(bustNode) {
        debug("[findAndClickYes] retries: ", clickYesRetries);
        if (clickYesRetries++ > maxYesRetries) {
            clickYesRetries = 0;
            return;
        }

        forceReloadBtn();

        let yesNode = $(bustNode).parent().find(".confirm-bust > div > .action-yes");
        let noNode = $(bustNode).parent().find(".confirm-bust > .ajax-action > .action-no");

        debug("node: ", $(bustNode));
        debug("Yes node: ", $(yesNode));
        debug("href: ", $(bustNode).attr("href"));

        if ($(yesNode).length == 0) {
            return setTimeout(function() {findAndClickYes(bustNode);}, retryInterval);
        }

        clickYesRetries = 0;
        if ($(yesNode).text() === "Yes" && $(yesNode).parent().text().indexOf("try and break") > 0) {
            debug("Clicking yes");
            $(yesNode)[0].click();
        }
    }

    function clearBustStats() {
        GM_setValue("totalLoads", 0);
        GM_setValue("loadTime", 0);
        GM_setValue("loadTimeAvg", 0);
    }

    // Handle clicking Time, Level or Score on the title bar
    // Sort, descending or ascending
    function handleTitleClick(ev) {
        debug('[handleTitleClick] ev: ', ev);
        debug('[handleTitleClick] target ID: ', ev.target.id);

        let ID = ev.target.id;
        GM_setValue('savedSortId', ID);
        GM_setValue('lLvlOrder', lLvlOrder);
        GM_setValue('lTimeOrder', lTimeOrder);
        GM_setValue('lScoreOrder', lScoreOrder);

        if (ID == 'level') {
            lLvlOrder = (lLvlOrder == 'asc') ? 'desc' : 'asc';
            debug('Sorting page by level, ', lLvlOrder);
            sortPage("span > span.level", null, lLvlOrder);
        }
        if (ID == 'time') {
            lTimeOrder = (lTimeOrder == 'asc') ? 'desc' : 'asc';
            debug('Sorting page by time, ', lTimeOrder);
            sortPage("span > span.time", "time", lTimeOrder);
        }
        if (ID == 'score') {
            lScoreOrder = (lScoreOrder == 'asc') ? 'desc' : 'asc';
            debug('Sorting page by score, ', lScoreOrder);
            sortPage("span > span.score.level", "score", lScoreOrder);
        }
    }

    // Sort jail list, by 'sel' (time, level, or score) and attr
    // May get rid of internal profiling.....
    function sortPage(sel, attr, ord) {
        debug('***** [sortPage] *****');
        let sortStart = _start();
        let jailList = document.querySelector("#mainContainer > div.content-wrapper > div.userlist-wrapper > ul");
        let matches = $(jailList).children("li");

        debug("matches: ", matches);
        debug("selector: ", sel);
        debug("attr: ", attr);
        tinysort(matches, {selector: sel, attr: attr, order: ord});

        // This should be last log entry on initial load-
        // page complete.

        // This is WRONG if doing reload!
        if (!doingReload) {
            debug("startAddJailScores took ", elapsed(startAddJailScores), " secs");
            debug("Sort complete, took ", elapsed(sortStart), " secs");
            debug("Script load time: ", elapsed(ScriptStartTime), " secs");

            // Save stats to get averages
            if (recordStats) {
                let totalLoads = GM_getValue("totalLoads", 0);
                totalLoads = +totalLoads + 1;
                GM_setValue("totalLoads", totalLoads);

                let loadTime = GM_getValue("loadTime", 0);
                loadTime = +loadTime + elapsed(ScriptStartTime);
                GM_setValue("loadTime", loadTime);

                let loadTimeAvg = loadTime / totalLoads;
                GM_setValue("loadTimeAvg", loadTimeAvg);

                debug("totalLoads: ", totalLoads, " Average time: ", loadTimeAvg, " avg to bust: ", GM_getValue("yesnoAvg", -1));
            }
        }

        if (firstSort == true) {
            firstSort = false;
            return;
        }

        if (routedXID && routedByChatBust) {
            scrollToXID(routedXID);
        }
    }

    //////////////////////////////////////////////////////////////////////
    // Get data used to calc success chance via the Torn API
    //////////////////////////////////////////////////////////////////////

    // Query the log for past busts
    var queryPastBustsStart;                    // Start time for profiling

    function queryPastBusts(queryStats=true) {
        debug('[queryPastBusts]');
        queryPastBustsStart = _start();

        let from = new Date().getTime() / 1000 - secs72hrs;
        let queryStr = `log&log=5360&from=${from}`;
        xedx_TornUserQuery(null, queryStr, queryPastBustsCB, queryStats, "Jail Scores");

        // "https://api.torn.com/user/?comment=Jail Scores&selections=timestamp,log&log=5360&key="
    }

    // Callback for above
    function queryPastBustsCB(responseText, ID, param) {
        let jsonResp = JSON.parse(responseText);
        if (jsonResp.error) {
            debug('Response error! ', jsonResp.error);
            return handleError(responseText);
        }

        // Process past busts
        let pastBustsStart = _start();
        processPastBusts(jsonResp);
        debug("processPastBusts took ", elapsed(pastBustsStart), " secs");

        // Now get personal stats, perks, level. Could do as one call.
        // Logically easier to do in two, easier to debug also.
        if (param) {
            personalStatsQuery();
        }

        if (!intervalId) startPastBustTimer();
    }

    // Query personal stats (unused?), perks, basic info (for level)
    var personalStatsQueryStart;
    function personalStatsQuery() {
        debug('[personalStatsQuery] doStatsCheck? ', doStatsCheck);
        if (!doStatsCheck) {
            personalStatsQueryCB(null, null, true);
            return;
        }

        personalStatsQueryStart = _start();
        GM_setValue("lastStatsCheck", personalStatsQueryStart);
        xedx_TornUserQuery(null, 'personalstats,perks,basic,profile', personalStatsQueryCB, false, "Jail Scores");
    }

    // Callback for above
    function personalStatsQueryCB(responseText, ID, useCached) {

        let jobType;
        if (!useCached) {
            debug('[personalStatsQueryCB] took ', elapsed(personalStatsQueryStart), " secs");
            let jsonResp;

            // make this global for other fns
            //let personalstats;

            jsonResp = JSON.parse(responseText);
            if (jsonResp.error) {
                debug('Response error!');
                return handleError(responseText);
            }

            personalstats = jsonResp.personalstats;
            perks.totalBusts = personalstats.peoplebusted;

            if ($("#ppl-busted").length)
                $("#ppl-busted").text(perks.totalBusts);

            jobType = jsonResp.job.company_type;
            userLvl = jsonResp.level;

            // From fac perks, see what (if any) 'bust success' increase there is
            let facPerks = jsonResp.faction_perks;
            debug('facPerks: ', facPerks);
            for (let i=0; i<facPerks.length; i++) {
                if (facPerks[i].toLowerCase().indexOf('bust success') > -1) {
                    perks.bustChanceIncrease = Number(facPerks[i].match(/(\d+)/)[0].trim());
                    break;
                }
            }

            // Same from eduPerks: 'Busting skill'
            let eduPerks = jsonResp.education_perks;
            debug('eduPerks: ', eduPerks);
            for (let i=0; i<eduPerks.length; i++) {
                if (eduPerks[i].toLowerCase().indexOf('busting skill') > -1) {
                    perks.bustSkillIncrease = Number(eduPerks[i].match(/(\d+)/)[0].trim());
                    break;
                }
            }

            GM_setValue("jobType", jobType);
            GM_setValue("userLvl", userLvl);
            GM_setValue("bustChanceIncrease", perks.bustChanceIncrease);
            GM_setValue("bustSkillIncrease", perks.bustSkillIncrease);

            // Not yet used...
            //let jobPerks = jsonResp.job_perks;
            //log('jobPerks: ', jobPerks);

        } else {  // get from cache!
            debug("[personalStatsQueryCB], using cached!!!");
            jobType = GM_getValue("jobType", jobType);
            userLvl = GM_getValue("userLvl", userLvl);
            perks.bustChanceIncrease = GM_getValue("bustChanceIncrease", perks.bustChanceIncrease);
            perks.bustSkillIncrease = GM_getValue("bustSkillIncrease", perks.bustSkillIncrease);
        }

        inLawFirm = (jobType == 2);
        debug('company_type: ', jobType, ' In Law Firm? ', inLawFirm); // '2' is in Law Firm.
        debug('user level: ', userLvl);
        debug('Perks: ', perks);

        let saveData = {"perks": perks, 'level': userLvl, 'ID': ID};
        addLogEntry(saveData, 'PERKS');

        // Add jail scores to the page, and install an observer to monitor for page changes.
        addJailScores();
    }

    //////////////////////////////////////////////////////////////////////
    // Parse past busts from the log
    //////////////////////////////////////////////////////////////////////

    // Keep 365 element array - {dayOfYear, count, hasBeenReset}
    // Before processing log, set all to 'hasBeenReset' to false.
    // Find a day in the array, if hasBeenReset == false, set count back to 1 and set flag to true.
    // hmm...but ignore oldest date in log? Otherwise, part of the day's busts might not be included?
    // Might put as a search or dropdown in stats? Or graph? Or table?
    function getDayOfYear(checkDate) {
        //var now = new Date();
        var start = new Date(checkDate.getFullYear(), 0, 0);
        var diff = (checkDate - start) + ((start.getTimezoneOffset() - checkDate.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
    }

    const oldestTimeMinutes = 72 * 60; // 72 hours, in minutes.
    function processPastBusts(obj) {
        pastBustsStats.length = 0;
        if (debugPastBusts == true) debug('[processPastBusts]');
        let timeNow = new Date().getTime() / 1000; //obj.timestamp; // In seconds since epoch
        let bustLog = obj.log;
        let keys = {};
        try {
            keys = Object.keys(bustLog);
        } catch (err) {
            log("ERROR: ", error);
            log("obj: ", obj);
            //debugger;
        }
        totalPenalty = 0;

        // get minutes since midnight
        let now = new Date();
        let h = now.getHours(), m = now.getMinutes();
        let hu = now.getUTCHours(), mu = now.getUTCMinutes();
        let minSoFar = h * 60 + m;
        let minUtcSoFar = hu * 60 + mu;
        let localBustsToday = 0;
        let utcBustsToday = 0;

        for (let i=0; i<keys.length; i++) {
            let key = keys[i];
            let entry = bustLog[key];
            let ageMinutes = Math.ceil((timeNow - entry.timestamp) / 60); // Minutes
            if (ageMinutes > oldestTimeMinutes) break; // Older than 72 hours, doesn't matter.

            //let utcTime = new Date(entry.timestamp);
            //let utcMinAgo = utcTime.getUTCHours() * 60 + utcTime.getMinutes();
            if (debugPastBusts == true) {
                debug('Entry: ', entry);
                debug('Time: ', ageMinutes + ' minutes ago.');
            }

            debug("*** daily busts: age this: ", ageMinutes, " so far: ", minSoFar, " busts: ",localBustsToday);
            debug("*** daily busts: age utc: ", ageMinutes, " so far: ", minUtcSoFar, " busts: ",utcBustsToday);
            if (ageMinutes < minSoFar) {
                localBustsToday++;
                GM_setValue("currBustsAlt", localBustsToday);
            }
            if (ageMinutes < minUtcSoFar) {
                utcBustsToday++;
                GM_setValue("currBustsUtcAlt", utcBustsToday);
            }

            let indPenalty = getPenalty(getP0(), ageMinutes/60);
            totalPenalty += indPenalty;

            pastBustsStats.push({'timestamp': entry.timestamp, 'ageHrs': round2(ageMinutes/60), 'penalty': round2(indPenalty)});
        } // end for loop

        if (debugPastBusts == true)debug("*** calc past busts complete! Have penalty: ", totalPenalty, new Date().toString());

        if (recordStats) {
            let low = GM_getValue("p0low", -1);
            if (Number(low) == 0)
                GM_setValue("p0low", round2(totalPenalty));
            else if (totalPenalty < low) {
                GM_setValue("p0low", round2(totalPenalty));
            }
            let hi = GM_getValue("p0hi", -1);
            if (totalPenalty > hi) GM_setValue("p0hi", round2(totalPenalty));
        }

        if (debugPastBusts == true) {
            debug('Total penalty: ', round2(totalPenalty), ' p0:', getP0());
            debug('pastBustsStats: ', pastBustsStats);
        }

        addLogEntry(pastBustsStats, 'OLDBUST');

        let pData = {'p0': getP0(), 'totalP': round2(totalPenalty)};
        addLogEntry(pData, 'PENALTY');
    }

    //////////////////////////////////////////////////////////////////////
    // Start a mutation observer to run on page changes
    //////////////////////////////////////////////////////////////////////

    const observerCallback = function(mutationsList, observer) {
            observerOff();
            if ($("#xedx-save-btn").length == 0) installUI();
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (let i=0; i<mutation.addedNodes.length; i++) {
                        let node = mutation.addedNodes[i];
                        if ($(node).hasClass('ajax-action')) {
                            let text = node.textContent;
                            let html = $(node).html();

                            if (showResultHistory == true) {
                                if (extraExtraDebug == true) {
                                    log('Bust action: ', text);
                                    debug('node html: ', html);
                                }
                                insertResultIntoResPane(html);
                            }

                            // Need to get info from parent node - level, name, time, etc...
                            let li = node.parentNode.parentNode;
                            let wrapper = li.getElementsByClassName("info-wrap")[0]; // 'li' is items[i]
                            let name = $(wrapper.parentNode.querySelector("a.user.name > span")).attr('title');
                            var timeStr = wrapper.children[0].innerText;
                            var lvlStr = wrapper.children[1].innerText;
                            let minutes = parseJailTimeStr(timeStr);

                            let scoreNode = $(wrapper).find(".score")[0];
                            let score = $(scoreNode).attr("score");

                            if (!score) debugger;

                            let busteeData = {'name': name, 'time': timeStr, 'min': minutes, 'level':lvlStr};
                            addLogEntry(busteeData, 'BUSTEE');

                            if (text.toLowerCase().indexOf('you busted') > -1) {

                                // Display how many busts done today...
                                // To save a date: localStorage['key'] = ''+myDate.getTime();
                                // To restore: var myDate = new Date(parseInt(localStorage['key'], 10));
                                /*
                                let dateOlderThanDay = false;
                                let temp = GM_getValue("lastBust", undefined);
                                let now = new Date();
                                let lastBust;
                                if (temp) {
                                    lastBust = new Date(parseInt(temp, 10));
                                    debug("last bust: ", lastBust.toLocaleString());
                                    if (!isToday(lastBust)) {
                                        dateOlderThanDay = true;
                                    }
                                }

                                GM_setValue("lastBust", ''+now.getTime());

                                temp = GM_getValue("lastBust", undefined);
                                lastBust = new Date(parseInt(temp, 10));
                                debug("Set lastBust to: ", lastBust.toLocaleString());
                                */

                                // Update perks.totalBusts also for stats? Calcs?
                                perks.totalBusts++;

                                // Update highest score
                                let hiScore = GM_getValue("hiScore", 0);
                                debug("Score: ", score, " hiScore: ", hiScore);
                                if (score > hiScore) {
                                    GM_setValue("hiScore", score);
                                }

                                fillJailStatsDiv();


                                let currBustsToday = 0;
                                //let bustsTodayLocal = GM_getValue("currBustsAlt", -1);
                                //let bustsTodayUtc = GM_getValue("currBustsUtcAlt", -1);
                                let bustsCounted = GM_getValue("currBustsUtc-logged", -1);
                                //let compBusts = useLocal ? bustsTodayLocal : bustsTodayUtc;
                                //if (dateOlderThanDay) {
                                if (isToday() == false) {
                                    currBustsToday = 1;
                                } else {
                                    currBustsToday = parseInt(GM_getValue("currBusts", 0)) + 1;
                                    if (currBustsToday != (+bustsCounted + 1)) {
                                        log("*** daily busts: error? ", currBustsToday, bustsCounted);

                                        currBustsToday = bustsCounted; //compBusts;
                                        //debugger;
                                    }
                                }



                                GM_setValue("currBusts", currBustsToday);

                                let countNow = parseInt($("#busts-today .numBusts").text());
                                $("#busts-today .numBusts").text(countNow + 1);
                                setTimeout(getDailyBustsCount, 500);
                                $("#daily-busts").text(GM_getValue("currBusts", 0));

                                /*
                                debug("*** Daily Busts: Setting current busts: ",
                                      dateOlderThanDay, currBustsToday, GM_getValue("currBusts", 0),
                                     " alt local: ", bustsTodayLocal, " alt utc: ", bustsTodayUtc,
                                     " count now: ", countNow, " logged: ", GM_getValue("currBustsUtc-logged", 0));
                                 */

                                // Try to adjust add'l penalty on the fly....
                                if (enablePreRelease && livePenaltyUpdate) {
                                    let indPenalty = getPenalty(getP0(), minutes/60);
                                    let tmp = totalPenalty;
                                    let sep = " | ";
                                    totalPenalty += indPenalty;
                                    debug("Live penalty update, wrapper: ", $(wrapper));
                                    debug("penalties: ", tmp, sep, totalPenalty, sep, indPenalty, sep, minutes);
                                } else {
                                    setTimeout(queryPastBusts, 1000, false);
                                }

                                addLogEntry(text, 'OUT');
                            } else {
                                if (extraExtraDebug == true) log("xxx Failed Bust! ", text);
                                addLogEntry(text, 'CHECK');
                            }
                        }
                    }
                }
            }
            targetNode = document.querySelector("#mainContainer > div.content-wrapper > div.userlist-wrapper > ul")
            observerOn();
        };

    function startPastBustTimer() {
        if (!intervalId) {
            intervalId = setInterval(queryPastBusts, penaltyCalcOnIdleInt, false);
        }
    }

    let observerRetries = 0;
    function installObserver(retries=0) {
        debug("installObserver, retries: ", retries);
        targetNode = document.querySelector("#mainContainer > div.content-wrapper > div.userlist-wrapper > ul");
        if (!$(targetNode).length) {
            if (retries++ < 30) return setTimeout(installObserver, 250, retries);
            return console.error("Too many retries installing observer!");
        }
        observer = new MutationObserver(observerCallback);
        debug('Starting mutation observer: ', targetNode);
        if (observerOn() == false) {
            if (observerRetries++ > 3)
                throw new Error("Error: Observer installation FAILED, aborting.");
            else
                setTimeout(installObserver, 250);
        }
    }

    // Current state is saved for debug purposes
    const observerOn = function () {
        debug('[observerOn]');
        if (observer && $(targetNode).length) {
            observer.observe(targetNode, config);
            isObserverOn = true;
            return true;
        }
        else {
            log("Error: Unable to start observer! ", $(targetNode));
            return false;
        }
    }

    const observerOff = function () {
        debug('[observerOff]');
        if (observer) observer.disconnect();
        isObserverOn = false;
    }

    // Move to helper lib!!!
    function isToday(date) {

        const now = new Date();

        const yearDate = date  ? date.getYear() : 0;
        const monthDate = date ? date.getMonth() : 0;
        const dayDate = date ? ((tzDisplay == 'local') ? date.getDate() : date.getUTCDate()) : 0;

        const yearNow = now.getYear();
        const monthNow = now.getMonth();

        const dayNow = (tzDisplay == 'local') ? now.getDate() : now.getUTCDate();

        let savedDay = GM_getValue("savedDay", -1);

        debug("*** isToday: ", (new Date().toString()));
        debug("*** isToday, saved: ", savedDay, " dayNow: ", dayNow);
        if (savedDay == -1) {
            savedDay = dayNow;
            GM_setValue("savedDay", dayNow);
        }

        let rc = false;
        if (date) {
            if (dayDate == dayNow) rc = true;
        } else if (savedDay == dayNow) {
            rc = true;
        } else {
            GM_setValue("savedDay", dayNow);
        }

        debug("*** isToday, saved: ", GM_getValue("savedDay", -1), " date: ", dayDate, " now: ", dayNow, " result: ", rc);

        //if (yearDate === yearNow && monthDate === monthNow && dayDate === dayNow) {
        //    rc = true;
        //}

        return rc;
    }

    function isTodayUTC(dateUTC) {
        const now = new Date();

        const yearDate = dateUTC.getUTCFullYear();
        const monthDate = dateUTC.getUTCMonth();
        const dayDate = dateUTC.getUTCDate();

        const yearNow = now.getUTCFullYear();
        const monthNow = now.getUTCMonth();
        const dayNow = now.getUTCDate();

        let rc = false;
        if (yearDate === yearNow && monthDate === monthNow && dayDate === dayNow) {
            rc = true;
        }

        return rc;
    }

    function handleSaveButton() {
        debug("handleSaveButton");
        const a = document.createElement("a");

        debug("Adding log entries: ", logEntries);

        a.href = URL.createObjectURL(new Blob([JSON.stringify(logEntries, null, 2)], {
            type: "text/plain"
          }));

        debug("href: ", a.href);

        a.setAttribute("download", "data.txt");
        document.body.appendChild(a);

        debug("a: ", a);

        a.click();
        document.body.removeChild(a);
    }

    const saveBtnDiv3 = `
            <div id="` + MAIN_DIV_ID + `" class="xjdwrap xshow xnb title-black border-round m-top10">
                <span class="xspleft">Jail Scores Mod</span>
                <span id="busts-today" class="xml10">
                    <span>(Today: </span>
                    <span class='numBusts'></span>
                    <span class='penalty1' style="display:none;">Penalty: </span>
                    <span class='penalty2' style="color: green; display: none;"> </span>
                    <span>)</span>
                </span>
                <span id="xedx-msg" class="xml5"></span>
                <span class="xjr btn xjfr">
                    <span><i id="xcaret" class="icon fas fa-caret-right xedx-caret"></i></span>
                    <span id="xswap" class="swap-span">
                    <input id="xedx-reload-btn" style="left: 0;" type="submit" class="xedx-torn-btn xmt3" value="Reload">
                    </span>
                </span>
            </div>
        `;

    const reloadBtnHtml = `<input id="xedx-reload-btn" type="submit" class="xedx-torn-btn xmt3" value="Reload">`;
    const quickBustBtnHtml = `<input id="xedx-reload-btn2" style="width: 38px !important;"
                               type="submit" class="xedx-torn-btn xmt3" value="R">
                               <input id="xedx-quick-bust-btn"
                               type="submit" class="qbust-green xedx-torn-btn xmt3" value="B">`;

    function addSwapBtnHandlers() {
        if ($("#xedx-reload-btn").length) {
            $("#xedx-reload-btn").off('click.qb').on('click.qb', reloadUserList);
        } else {
            $("#xedx-quick-bust-btn").off('click.qb').on('click.qb', doQuickBust);
            $("#xedx-reload-btn2").off('click.qb').on('click.qb', reloadUserList);
        }
    }

    function forceReloadBtn() {
        if ($("#xedx-reload-btn").length) {
            return;
        } else {
            $("#xedx-quick-bust-btn").remove();
            $("#xedx-reload-btn2").replaceWith(reloadBtnHtml);
        }
        addSwapBtnHandlers();
    }

    function forceBustButton() {
        debug("forceBustButton");
        if ($("#xedx-reload-btn").length) {
            $("#xedx-reload-btn").replaceWith(quickBustBtnHtml);
        } else if (!$("#xedx-reload-btn2").length) {
            debug("Error: btn2 not installed!")
        }
        addSwapBtnHandlers();
    }

    // 'force', if true, goes to reg. reload btn
    function swapReloadBtn(force) {
        debug("swapReloadBtn, force: ", force);
        debug("reload-btn: ", $("#xedx-reload-btn"));
        debug("reload-btn2: ", $("#xedx-reload-btn2"));
        debug("quick bust btn: ", $("#xedx-quick-bust-btn"));

        if (force) {
            if ($("#xedx-reload-btn").length) {
                return;
            } else {
                $("#xedx-quick-bust-btn").remove();
                $("#xedx-reload-btn2").replaceWith(reloadBtnHtml);
            }
        } else {
            if ($("#xedx-reload-btn").length) {
                $("#xedx-reload-btn").replaceWith(quickBustBtnHtml);
            } else {
                $("#xedx-quick-bust-btn").remove();
                $("#xedx-reload-btn2").replaceWith(reloadBtnHtml);
            }
        }

        addSwapBtnHandlers();
    }

    // ============================= Show/adjust limit from title bar =================

    // #mainContainer > div.content-wrapper.winter > div.msg-info-wrap > div.info-msg-cont.border-round.m-top10 > div > div > div
    GM_addStyle(`
        #xlimit-adj {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            float: right;

            /*border: 1px solid yellow;
            border-radius: 4px;*/
        }

        #xlimit-adj.unlocked.xenable:hover {
            opacity: 1 !important;
        }

        #xlimit-adj span {
            border-radius: 4px;
            display: flex;
            flex-wrap: wrap;
        }
        .adj-btn {
            font-size: 10px;
            padding: 0px 5px 0px 5px;
            height: 16px;

            cursor: pointer;
            color: var(--btn-color);
            background: var(--btn-background);
            border: var(--btn-border);
            display: inline-block;
            vertical-align: middle;
        }
        #limit-txt {
            /*border: 1px solid white;*/
            border: var(--btn-border);
            width: 40px;
            align-content: center;
            justify-content: center;
            padding: 5px 0px 5px 0px;
            margin-top: -5px;
        }

    `);
    const limitAdjust = `
        <span id='xlimit-adj'>
            <span class='adj-btn xmr10'> << </span>
            <span id='limit-txt'></span>
            <span class='adj-btn xml10'> >> </span>
        </span>
    `;

    var limitCommitTimeout;
    function handleLimitAdjust(e) {
        let target = $( e.currentTarget);
        let index = $(target).index();

        bustMin = (index == 0) ?
            ((+bustMin <= 0) ? 0 : (+bustMin - 1)) :
            ((+bustMin >= 100) ? 100 : (+bustMin + 1));

        $("#limit-txt").text((bustMin + "%"));

        if (limitCommitTimeout) clearTimeout(limitCommitTimeout);
        limitCommitTimeout = setTimeout(commitLimitChange, 2000);

        function commitLimitChange() {
            GM_setValue("bustMin", bustMin);
            limitCommitTimeout = null;
        }
    }

    function enableLimitAdjustUi(retries=0) {

        if (!$("#xlimit-adj").length) {
            let msgBar = $(".msg-info-wrap > .info-msg-cont > .info-msg > div > .msg");
            if (!$(msgBar).length) {
                if (retries++ < 20) return setTimeout(enableLimitAdjustUi, 250, retries);
                log("ERROR: enableLimitAdjustUi timed out!");
            }
            $(msgBar).append(limitAdjust);
            $("#limit-txt").text((bustMin + "%"));
            $("#xlimit-adj > .adj-btn").on('click', handleLimitAdjust);
        }

        if (lockAnimations == true)
            $("#xlimit-adj").removeClass("unlocked");
        else
            $("#xlimit-adj").addClass("unlocked");

        if (showLimits == true) {
            $("#xlimit-adj").css("opacity", (lockAnimations ? 1 : 0));
            $("#xlimit-adj").addClass("xenable");
        } else {
            $("#xlimit-adj").css("opacity", 0);
            $("#xlimit-adj").removeClass("xenable");
        }
    }


    // =========================== The past results pane thingy =======================

    function addResPaneStyles() {
        GM_addStyle(`
            #xresview-outer {
                position: relative;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                max-height: 22px;
                margin-left: 20px;
            }
            #xresview-outer.unlocked.xenable:hover #res-spans {
                opacity: 1 !important;
            }
            #xresview-outer.unlocked.xenable:hover #res-pane-btn {
                opacity: 1 !important;
            }

            .result-span {
                height: 22px;
                position: absolute;
                min-width: 550px;
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                align-content: center;
                padding-left: 15px;
                margin-left: 30px;
                /*border-radius: 6px 11px 11px 6px;*/
                border-radius: 11px 11px 11px 11px;

                border: 1px solid var(--default-color);
                transition: 0.2s;
            }

            .result-span:not(.res-pane-active) {
                color: lightgray;
            }

            #res-pane-first {
                justify-content: center;
            }
            #spans-wrap {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
        `);
        addFlexStyles();

        // btn margin left = res-span min width + margin-left - 1/2 width? //padding-left
        GM_addStyle(`
            .x-round-btn {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-content: center;
                cursor: pointer;
                /*background-image: radial-gradient(rgba(170, 170, 170, 0.6) 0%, rgba(6, 6, 6, 0.8) 100%);*/
                background: var(--btn-background)
                width: 20px;
                aspect-ratio: 1 / 1;
                border-radius: 50%;
            }

            #res-pane-btn-wrap {
                position: absolute;
                display:flex;
                padding-left: 10px;
            }
            #res-pane-btn {
                min-width: 20px;
                max-width: 22px;
                min-height: 20px;
                max-height: 22px;
                margin-left: 574px;
                float: right;
                border: 1px solid var(--default-color);
                cursor: pointer;
                z-index: 99;
                transition: 0.2s;
            }
            #pane-btn-wrap {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                width: 100%;
            }
        `);
    }

    //
    // For the spans, which are last x results, create all, but rotate through however may we
    // actually have. Fill dynamically as we get results.
    //
    var thisResultIdx = 0;

    function timeNowStr() {
        let now = new Date();
        const mediumTime = new Intl.DateTimeFormat("en-GB", {
            timeStyle: "medium",
            hourCycle: "h24",
        });
        return mediumTime.format(now);
    }

    // ============================ Insert new result =================================
    // No longer in jail, ignored
    // You get busted, text truncated.
    // Hyperlinks are saved and rebuilt when moved into view, via handleResPaneClick()
    //
    const newStyle = "style='color:var(--default-blue-color);margin-left:5px;'";
    const styleVal = 'color:var(--default-blue-color);margin-left:5px;';
    function insertResultIntoResPane(html, fromInit) {
        if (fromInit != true && html.indexOf("no longer") > -1) {return debug("No longer in jail, won't save");}
        if (html.indexOf("While trying") > -1) {
            let parts = html.split(',');
            if (parts[0]) html = parts[0];
            if (parts[1]) html = html + parts[1];
            html = html + "!<br>";
            if (extraExtraDebug == true) debug("xxxx new html: ", html);
        }

        if (fromInit != true) {
            html = timeNowStr() + ": " + html;
        }
        let resSpans = $(".result-span");
        let countSpans = $(resSpans).length;
        let e = {forcedIndex: 1};
        if (++thisResultIdx >  maxSavedResults) {  // Exceeded max allowed, forced index stays at 1
            if (extraExtraDebug == true) log("insertResultIntoResPane: exceeded max");
            thisResultIdx = 1;
            e.forcedIndex = 1;
            putDataIntoSpan($(resSpans[thisResultIdx]), html);
        } else if (thisResultIdx > (countSpans - 1) && countSpans < (maxSavedResults + 1)) { // need to add new row, idx is count
            if (extraExtraDebug == true) log("insertResultIntoResPane: adding new");
            $(resSpans).removeClass("res-pane-last");
            let newSpan = `<span class="result-span res-pane-last"></span>`;
            putDataIntoSpan($(newSpan), html);
            $("#res-pane-first").parent().append(newSpan);
            e.forcedIndex = countSpans;
            thisResultIdx = countSpans;
            if (extraExtraDebug == true) log("insertResultIntoResPane: added, index: ", countSpans);
            if (extraExtraDebug == true) log("insertResultIntoResPane: ", $($(".result-span")[countSpans]));
        } else { // idx is just next one.
            putDataIntoSpan($($(resSpans)[thisResultIdx]), html);
            e.forcedIndex = thisResultIdx;
        }

        if (fromInit == true) {
            $(resSpans[e.forcedIndex]).css("color", "rgba(0, 0, 0, 0.0)");
        } else {
            let key = "savedRes_" + thisResultIdx;
            GM_setValue(key, html);
            GM_setValue("lastResKey", key);
            handleResPaneClick(e);
        }

        function putDataIntoSpan(node, html) {
            $(node).html(html);
            let nodeA = $(node).find("a");
            $(nodeA).css({"margin": "0px 5px 0px 5px", "color": "var(--default-blue-color)" });
        }
    }

    var hideFirst = true;
    var thisPaneDiv;
    function handleResPaneClick(e) {
        let key = GM_getValue("lastResKey", "savedRes_0");
        let latestIdx = key ? key.split('_')[1] : 0;

        if (!thisPaneDiv) thisPaneDiv = $("#res-pane-first");
        let thisIdx = 0, nextIdx = 0;
        let resSpans = $(".result-span");

        // If forcing to a specific index, over-ride thisPaneDiv, it'll be requested idx - 1
        let nextPaneDiv;
        if (e.forcedIndex) { // fake event, to display particular index in list of spans
            let idx = e.forcedIndex;
            if (idx > $(resSpans).length) {
                debugger;
                console.error("Out of bounds error! ", idx, $(resSpans));
                return;
            }
            nextPaneDiv = $(resSpans)[idx];
        }

        // Save thisPaneDiv as we go, at end go back to start but skip the first one...
        // But maybe go backwards?
        let prevPane = $(".res-pane-active");   // maybe safety net...
        $(thisPaneDiv).removeClass("res-pane-active");
        if (!nextPaneDiv)
            nextPaneDiv = $(thisPaneDiv).hasClass("res-pane-last") ? $("#res-pane-first").next() : $(thisPaneDiv).next();
        if (!$(nextPaneDiv).length || !$(nextPaneDiv).hasClass("result-span")) {
            nextPaneDiv = $("#res-pane-first").next();
            if (extraExtraDebug == true) log("Setting next div to first: ", $("#res-pane-first"));
        }

        // Reload saved html if needed
        let h = $(nextPaneDiv).html()
        if (!h || !h.length) {
            let key = "savedRes_" + $(nextPaneDiv).index();
            let html = GM_getValue(key, "-- error --");
            if (html == '-- error --') debugger;
            $(nextPaneDiv).html(html);
            let nodeA = $(nextPaneDiv).find("a");
            $(nodeA).css({"margin": "0px 5px 0px 5px", "color": "var(--default-blue-color)" });
        }

        if (extraExtraDebug == true) log("xxx handleResPaneClick: next div: ", $(nextPaneDiv));


        $(thisPaneDiv).find("a").animate({opacity: 0},100);
        $(thisPaneDiv).animate({
            color: "rgba(0, 0, 0, 0.0)",
        }, 100, function () {
            if (extraExtraDebug == true) {
                log("xxx handleResPaneClick: animated out ", $(thisPaneDiv).index(), "|", $(thisPaneDiv));
                log("Div html: ", $(thisPaneDiv).html());
            }
        });

        $(nextPaneDiv).find("a").animate({opacity: 1},100);
        let useColor = ($(nextPaneDiv).index() == latestIdx) ?
            "var(--default-color)" : "#ccc !important";

        $(nextPaneDiv).animate({
            color: useColor,
        }, 100, function () {
            if (extraExtraDebug == true) {
                log("xxx handleResPaneClick: animated in ", $(nextPaneDiv).index(), "|", $(nextPaneDiv));
            }
            if ($(nextPaneDiv).index() != 0) $("#res-pane-first").css("color", "rgba(0, 0, 0, 0.0)");

            // Prepare for next 'rotation'
            thisPaneDiv = $(nextPaneDiv);
            $(thisPaneDiv).addClass("res-pane-active");
        });
    }

    // Toggle opacity to temporarily remove/disable
    function showResultPane(show=true) {
        if (lockAnimations == true)
            $("#xresview-outer").removeClass("unlocked");
        else
            $("#xresview-outer").addClass("unlocked");

        if (show == true)
            $("#xresview-outer").addClass("xenable");
        else
            $("#xresview-outer").removeClass("xenable");

        let newOpacity = (show == true && lockAnimations == true) ? 1 : 0;

        $("#res-spans").animate({opacity: newOpacity}, 200);
        $("#res-pane-btn").animate({opacity: newOpacity}, 200);
    }

    // Install the past result view, load saved results
    function installPastResultView(retries=0) {
        //if (showResultHistory == false) return;

        if ($("#xresview-outer").length > 0) {
            showResultPane(showResultHistory);
            return debug("Result pane already exists, faded in.");
        }

        if (!$("#xresview-outer").length) {
            let target = $("#skip-to-content");
            $(target).after(resultViewDiv);
            if (!$("#xresview-outer").length) {
                if (retries++ < 30) return setTimeout(installPastResultView, 250, retries);
                return log("installPastResultView: too many retries");
            }
        }

        //$("#xresview-outer").css("visibilty", (showResultHistory == true) ? "visible" : "hidden");
        showResultPane(showResultHistory);

        debug("resView: ", $("#xresview-outer"));

        $("#xresview-outer").next().css("margin-left", "auto");
        $("#xresview-outer").next().appendTo($("#pane-btn-wrap"));
        $("#res-pane-btn").on('click', handleResPaneClick);

        if (extraExtraDebug == true) log("Loading history...");
        let count = 0;
        for (let idx=1; idx <= maxSavedResults; idx++) {
            let key = "savedRes_" + idx;
            let html = GM_getValue(key, undefined);
            if (html) {
                if (extraExtraDebug == true) log("Loaded idx ", idx, " from saved history");
                count++;
                insertResultIntoResPane(html, true);
            } else {
                break;
            }
            if (!count) {
                if (extraExtraDebug == true) log("Nothing loaded.");
            }
        }
        //$(".result-span").css({"color": "rgba(0, 0, 0, 0.0)", "opacity": "0"});
        $(".result-span").css("color", "rgba(0, 0, 0, 0.0)");
        $(".result-span > ").css("opacity", "0");

        let key = GM_getValue("lastResKey", "savedRes_0");
        let thisResultIdx = key ? key.split('_')[1] : 0;
        let e = {forcedIndex: +thisResultIdx, fromInit: true};

        $($(".result-span > ")[thisResultIdx]).css("opacity", "1");

        if (extraExtraDebug == true) log("Setting init res to idx: ", thisResultIdx);
        if (extraExtraDebug == true) log("Text: ", GM_getValue(key, "unknown"));

        handleResPaneClick(e);

        let spans = $("span.result-span");
        $(spans).css("color", "rgba(0, 0, 0, 0.0)");
        spans.eq(0).css("color", "var(--default-color)");
    }


    // ================================ UI Installation ===============================

    const resultViewDiv = `
        <div id="xresview-outer">
                <div id="res-spans">
                    <span id="res-pane-first" class="result-span">-- Last Results --</span>
                    <span class="result-span res-pane-last"></span>
                </div>
                <div id="pane-btn-wrap">
                <span id="res-pane-btn" class="x-round-btn"> >> </span>
                </div>
        </div>
    `;

    const hideBtn2= `<span id="xhide-btn-span" class="xhbtn">
                         <input id="xhide-btn" type="submit" class="torn-btn" value="Hide">
                     </span>`;

    const caretNode = `<span style="float:right;"><i id="xcaret" class="icon fas fa-caret-down xedx-caret"></i></span>`;
    const optsBtn = `<button id="x-opts-btn" class="xhlpbtn xmt5"><span class="copts">*</span></button>`;

    var mainDivHeight;
    var mainUiBtnsInstalled = false;
    var hideBtnInstalled = false;
    var lastShowState = GM_getValue("lastShow", "show");
    if (lastShowState == "hide") setTimeout(doHide, 10);

    const topBarTargetSel = "#mainContainer > div.content-wrapper > div.msg-info-wrap";
    const targetSel = "#mainContainer > div.content-wrapper > div.msg-info-wrap > hr";
    var installTarget;
    function installUI(forceShow=false, retries=0) {
        debug('[installUI]: ', uiless, " lastShowState: ", lastShowState,
            " forceShow: ", forceShow, " retries: ", retries);
        if ($("#xedx-reload-btn").length || $("#xedx-save-btn").length || $(MAIN_DIV_SEL).length ) {
            return;
        }

        if (uiless) return;

        // WTF? I don't recall adding this back...
        if (!hideBtnInstalled) {
            addHideButton();
        }

        if (lastShowState == "hide" && !forceShow) {
            debug("was hidden and not forced, not installing");
            return;
        }

        if ($("#xedx-save-btn").length || $("#xedx-reload-btn").length) { // || waitingOnDivInst) {
            debug("Exit installUI, button exists.");
            return;
        }

        if (!installTarget || !$(installTarget).length)
            installTarget = $(topBarTargetSel);
        if ($(installTarget).length == 0) {
            if (retries++ < 50) return setTimeout(installUI, 200, forceShow, retries);
            debug("**** target for install not found, will try again on complete!!! *****");
            callOnContentComplete(installUI);
            return;
        }

        if (!$(MAIN_DIV_SEL).length) {
            $(installTarget).after(saveBtnDiv3);
        }

        mainDivHeight = $(MAIN_DIV_SEL).outerHeight();
        if (!mainDivHeight) {
            let tmp = $(MAIN_DIV_SEL).css("display");
            $(MAIN_DIV_SEL).css("display", "block");
            mainDivHeight = $(MAIN_DIV_SEL).outerHeight();
            $(MAIN_DIV_SEL).css("display", tmp);
        }

        if (lastShowState && forceShow) {
            $(MAIN_DIV_SEL).addClass("xhide");
        }

        // Add small results panel, in title bar. Single-row of last results....
        if (!$("#xresview-outer").length) {
            if (extraExtraDebug == true) debug("Installing result pane, last several results");
            addResPaneStyles();
            installPastResultView();  // xedx res pane
        }

        //if (showLimits == true) {
            enableLimitAdjustUi(true);
        //}

        // When we roll over, maybe keep a daily record?
        // Done via midnight timer!
        /*
        let temp = GM_getValue("lastBust", undefined);
        if (temp) {
            let lastBust = new Date(parseInt(temp, 10));
            debug("*** lastBust: ", lastBust.toLocaleString());
            //if (useLocal? !isToday(lastBust) : !isTodayUTC(lastBust)) {
            if (!isToday(lastBust)) {
                setTodaysBusts(0);
                debug("*** setTodaysBusts(0) - 1");
            } else {
                //setTodaysBusts(GM_getValue("currBusts", 0));
                //debug("*** setTodaysBusts(0) - 2");
                getDailyBustsCount();
            }
        } else {
            setTodaysBusts(0);
            debug("*** setTodaysBusts(0) - 3");
        }
        */

        // TEMP: set timer to update text for penalty/busts, won't need later
        //setInterval(updateBustsAndPenaltyText, 1000);

        // Add the options panel
        if (/*dispOptsScreen &&*/ $("#xedx-jail-opts").length == 0) {
            GM_addStyle( `
                input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }`);

            /* Firefox */
            GM_addStyle( `
                input[type=number] {
                    padding-left: 5px;
                    -moz-appearance: textfield;
                }`);

            addOptsDiv();

            if (!$("#xcaret").hasClass("xtemp")) {
                $("#xcaret").addClass("xtemp");
                $("#xcaret").on('click', handleOptsBtn);
            }
        }

        $("#xedx-save-btn").off('click.qb').on('click.qb', handleSaveButton);
        $("#xedx-reload-btn").off('click.qb').on('click.qb', reloadUserList);

        addSwapBtnHandlers();


        // Swap to stats div handler
        $("#xedx-stats-btn").off('click.qb').on('click.qb', swapStatsOptsView);

        debug("installUI complete");

        mainUiBtnsInstalled = true;
    }

    function addOptsDiv() {
        if ($("#xedx-jail-opts").length) $("#xedx-jail-opts").remove();

        attachOptsDiv(MAIN_DIV_SEL);
        setJailOptions();
        addJailOptsToolTips();

        $("#xedx-jail-opts input").on('change', handleJailOptChange);

        $("#xedx-jail-opts").css("height", 0);
        $("#xedx-jail-opts").css("min-width", $(MAIN_DIV_SEL).css("width"));
    }

    function setJailOptions() {
        $("#bust-limit").val(bustMin);
        $("#hide-limit").val(hideLimit);
        $("#quick-bust-btn").prop('checked', quickBustBtn);
        $("#quick-bust-ylw").prop('checked', quickBustYlw);
        $("#pre-release-btn").prop('checked', enablePreRelease);
        $("#penalty-btn").prop('checked', dispPenalty);
        $("#xedx-save-opt-btn").on("click", handleSaveOptsBtn);
        $("#xlast-page-opt").prop('checked', optTryLastPages);

        $("#save-results").prop("checked", showResultHistory);
        $("#show-limits").prop("checked", showLimits);
        $("#lock-animations").prop("checked", lockAnimations);

        hideShowJailOpts();

        let useLocal = (tzDisplay == "local");
        $("#xtz-tct").prop('checked', !useLocal);
        $("#xtz-local").prop('checked', useLocal);

        $("#xtz-tct").on('click', tzToggleHandler);
        $("#xtz-local").on('click', tzToggleHandler);
    }

    function hideShowJailOpts() {

        if (!enablePreRelease) {
            $("#xedx-jail-opts").find(".xprerelease").addClass("xhide");
        } else {
            $("#xedx-jail-opts").find(".xprerelease").removeClass("xhide");
        }

        if (DEV_MODE == false) {
            $("#xedx-jail-opts").find(".dev-mode").addClass("xhide");
            debug("Nodes: ", $("#xedx-jail-opts").find(".dev-mode"));
        } else if (DEV_MODE == true) {
            $("#xedx-jail-opts").find(".dev-mode").removeClass("xhide");
        }
    }

    // Move the text to the bottom later...
    const bustLimitText =
          "Show in green and offer a Quick Bust button<br>" +
          "for anyone at or above this chaance percentage.<br>" +
          "Note that people down to 15 below this number<br>" +
          "will show as yellow, and 10% less than that, orange.";
    const hideLimitText =
          "Anyone in jail with a smaller percent chance <br>" +
          "than this of being busted, won't be displayed.<br>" +
          "The count of people jailed will still indicate hidden people.";
    const quickBustBtnText =
          "If enabled, when anyone at or above your lower<br>" +
          "bust limit (highlighted in green), will cause<br>" +
          "the reload button to become two buttons, Reload<br>" +
          "and Bust, so you can click right away and do a Quick Bust.";
    const quickBustBtnYlwText =
          "If enabled, when anyone at or above your 2nd lower<br>" +
          "bust limit, which is 10% lower than the 'green' limit,<br>" +
          "which displays as yellow, will cause the reload button<br>" +
          "to become two buttons, like the Quick Bust Green option.";
    const advFeaturestext = "This will allow you to select some<br>" +
          "advanced options, which may be just for development use,<br>" +
          "or pre-release - meaning not really tested, or ones just<br>" +
          "being tried out for practicality.";
    const penaltyBtnText = "This option will display your 'penalty',<br>" +
          "a measure of how much the number of past busts you have done,<br>" +
          "are affecting your future success rates. This decays naturally<br>" +
          "over time, busts over 72 hours old don't count. This is called 'p0'<br>" +
          "as that is the name used internally as a variable name, this is used<br>" +
          "mostly for development purposes.";
    const timeZoneText = "This option allows you to select when the count<br>" +
          "for daily busts roll over, either midnight local time, or TCT (Torn time).<br>" +
          "It has no effect on anything but the display in the UI,";
    const page2optText = "The 'page 2' option is experimental and not fully tested.<br>" +
          "It provides a popup to quickly jump to the last page of the jail.<br>" +
          "This feature requires a click and is not automated.";
    const saveResultsText =
          "If enabled, the past " + maxSavedResults + " results will be saved and<br>" +
          "viewable in a list in case they scrolled past to fast to read.";

    const ttTable = [{sel: "#bust-limit", text: bustLimitText, devMode: false},
        {sel: "#hide-limit", text: hideLimitText, devMode: false},
        {sel: "#quick-bust-btn", text: quickBustBtnText, devMode: false},
        {sel: "#quick-bust-ylw", text: quickBustBtnYlwText, devMode: false},
        {sel: "#pre-release-btn", text: advFeaturestext, devMode: false},
        {sel: "#penalty-btn", text: penaltyBtnText, devMode: false},
        {sel: "#xtz-tct", text: timeZoneText, devMode: false},
        {sel: "#xtz-local", text: timeZoneText, devMode: false},
        {sel: "#xlast-page-opt", text: page2optText, devMode: true},
        {sel: "#save-results", text: saveResultsText, devMode: false} ];

    function addJailOptsToolTips() {

        for (let idx=0; idx<ttTable.length; idx++) {
            let entry = ttTable[idx];
            if (!DEV_MODE && entry.devMode == true) continue;
            displayHtmlToolTip(entry.sel, entry.text, "tooltip4");
        }
    }

    // ========== Options button and panel animation and click handlers ==========

    var optionsSaved = false;         // True if saved when opt screen closed
    var optionsChanged = false;

    function handleJailOptChange(e) {
        let target = $(e.currentTarget);
        optionsChanged = true;
    }

    function handleSaveOptsBtn() {
        optionsChanged = false;

        let savedPR = enablePreRelease;

        bustMin = $("#bust-limit").val();
        hideLimit = $("#hide-limit").val();
        quickBustBtn = $("#quick-bust-btn").is(":checked");
        quickBustYlw = $("#quick-bust-ylw").is(":checked");
        enablePreRelease = $("#pre-release-btn").is(":checked");
        dispPenalty = $("#penalty-btn").is(":checked");
        tzDisplay = $("#xtz-tct").is(":checked") ? "tct" : "local";
        optTryLastPages = DEV_MODE && $("#xlast-page-opt").is(":checked");

        showResultHistory = $("#save-results").is(":checked");
        showLimits = $("#show-limits").is(":checked");
        lockAnimations = $("#lock-animations").is(":checked");

        enableLimitAdjustUi();
        installPastResultView();

        useLocal = (tzDisplay == "local");
        useUTC = !useLocal;

        GM_setValue("bustMin", bustMin);
        GM_setValue("hideLimit", hideLimit);
        GM_setValue("quickBustBtn", quickBustBtn);
        GM_setValue("quickBustYlw", quickBustYlw);
        GM_setValue("enablePreRelease", enablePreRelease);
        GM_setValue("dispPenalty", dispPenalty);
        GM_setValue("tzDisplay", tzDisplay);
        GM_setValue("optTryLastPages", optTryLastPages);
        GM_setValue("blinkOnSuccess", blinkOnSuccess);

        GM_setValue("showResultHistory", showResultHistory);
        GM_setValue("maxSavedResults", maxSavedResults);
        GM_setValue("showLimits", showLimits);
        GM_setValue("lockAnimations", lockAnimations);

        hideShowJailOpts();
        optionsSaved = true;

        $("#xedx-msg").text(" **** Options Saved! ****");
        setTimeout(clearMsg, 3000);

        debug("handleSaveOptsBtn: ", bustMin, " quick btn? ", quickBustBtn,
              " quick ylw? ", quickBustYlw,
             " enablePreRelease? ", enablePreRelease, " dispPenalty? ", dispPenalty);
    }

    function clearMsg() { $("#xedx-msg").text("");}

    var inAnimation = false;

    function optsAnimate(size) {
        inAnimation = true;

        if (size == 0) {
            $(MAIN_DIV_SEL).removeClass("top-round").addClass("border-round");
            $("#xcaret").removeClass("fa-caret-down").addClass("fa-caret-right");
        } else {
            optionsSaved = false;
            $(MAIN_DIV_SEL).removeClass("border-round").addClass("top-round");
            $("#xcaret").removeClass("fa-caret-right").addClass("fa-caret-down");
        }

        let useDiv = $("#xedx-jail-opts");
        if (!$(useDiv).length) useDiv = $("#xedx-jail-stats");

        $( useDiv ).animate({
            height: size,
            opacity: ((size == 0) ? 0 : 1)
        }, animateSpeed, function() {
            hideShowJailOpts();
            inAnimation = false;
            if (size > 0) {
                $(useDiv).css("height", "fit-content");
                $(useDiv).css("display", "flex");
            } else {
                $(useDiv).css("display", "none");
            }
        });
    }

    function handleOptsBtn() {
        if (optionsChanged == true) {
            if (confirm("You have unsaved changes, save now?")) {
                handleSaveOptsBtn();
            }
        }
        optionsChanged = false;

        let useDiv = $("#xedx-jail-opts");
        if (!$(useDiv).length) useDiv = $("#xedx-jail-stats");
        let cssHeight = parseInt($(useDiv).css("height"), 10);
        if (inAnimation) return;

        let newH = (cssHeight > 0) ? 0 : (enablePreRelease ? optsDivHeightPreRelease : optsDivHeightDef);
        optsAnimate(newH);
    }

    function swapStatsOptsView() {
        let needStatDiv = true;
        let currDiv = $("#xedx-jail-opts");
        if (!$(currDiv).length) {
            currDiv = $("#xedx-jail-stats");
            needStatDiv = false;
        }

        if (!$(currDiv).length) {
            log("ERROR: didn't find either div!");
            return
        }

        let newDiv = needStatDiv ? getStatsDiv() : getOptionsDiv();

        $(currDiv).replaceWith(newDiv);
        $("#xedx-stats-btn").off('click.qb').on('click.qb', swapStatsOptsView);
        $("#xedx-stats-btn").attr('value', needStatDiv ? "Options" : "Stats");
        $("#xedx-stats-busts-btn").on('click', function () {
            let daysAgo = $("#bust-days").val();
            getDailyBusts(daysAgo);
        });

        let sel = needStatDiv ? "#xedx-jail-stats" : "#xedx-jail-opts";

        // Need correct height...
        let newHeight = needStatDiv ? optsDivHeightDef :
                        enablePreRelease ? optsDivHeightPreRelease : optsDivHeightDef;
        //$(sel).css("height", newHeight);
        $(sel).css("height", "fit-content");
        $(sel).css("min-width", $(MAIN_DIV_SEL).css("width"));

        //log("[swapStatsOptsView] height: ", $(sel).css("height"));

        if (needStatDiv) {
            fillJailStatsDiv();
        } else {
            setJailOptions();
        }

        if (!$("#xcaret").hasClass("xtemp")) {
            $("#xcaret").addClass("xtemp");
            $("#xcaret").on('click', handleOptsBtn);
        }

        debug("swapStatsOptsView, currDiv: ", $(currDiv));

    }
    // ========== End Options button and panel handlers ==========

    function updateBustsAndPenaltyText() {
        setTodaysBusts(GM_getValue("currBusts", 0));
    }

    function setTodaysBusts(numBusts, retries=0) {
        if (!$("#busts-today .numBusts").length) {
            if (retries++ < 50) return setTimeout(setTodaysBusts, 250, numBusts, retries);
            return log("setTodaysBusts: timed out.");
        }

        log("[setTodaysBusts]: ", numBusts, " span: ", $("#busts-today .numBusts"));

        $("#busts-today .numBusts").text(numBusts);
        if (enablePreRelease && dispPenalty) {
            $("#busts-today [class^='penalty']").css("display", "inline-block");
            $("#busts-today .penalty2").text(round2(totalPenalty));
            if (totalPenalty > 190)
                $("#busts-today .penalty2").css("color", "red");
            else if (totalPenalty > 160)
                $("#busts-today .penalty2").css("color", "orange");
            else if (totalPenalty > 130)
                $("#busts-today .penalty2").css("color", "yellow");
            else
                $("#busts-today .penalty2").css("color", "green");
        }

        let max = GM_getValue("maxDailyBusts", 0);
        if (numBusts > max) GM_setValue("maxDailyBusts", numBusts);

        //$("#busts-today").text(msg);
     }

    const hideWithButton = false;
    var hideHandlerAdded = false;

    function addHideButton() {
        debug("addHideButton");
        if (hideWithButton && $("#xhide-btn").length == 0) //{
            $("#skip-to-content").append(hideBtn2);

            if (!hideHandlerAdded) {
                if (!hideWithButton) {
                    $("#skip-to-content").on("click", handleHideBtn);
                    $("#skip-to-content").css("cursor", "pointer");
                    $("#skip-to-content").addClass("xedx-light");
                    $("#xhide-btn-span").addClass("xhide").removeClass("xshow");

                    // Add tool tip
                    displayHtmlToolTip("#skip-to-content",
                                   "Click to show/hide the<br>Jail Scores menu bar",
                                   "tooltip4");
                } else {
                    $("#xhide-btn").on("click", handleHideBtn);
                    $("#skip-to-content").removeClass("xedx-light");
                    $("#xhide-btn-span").addClass("xshow").removeClass("xhide");
                }
                hideHandlerAdded = true;
                doShow(true);
            }

            if (lastShowState == "hide")
                setTimeout(doHide, 10);
            else
                setTimeout(doShow, 10);
        //}

        // This check won't work when using title as button! Hence 'handlerAdded check.
        if ($("#xhide-btn").length)
            hideBtnInstalled = true;
    }

    const criminalList = ['miscreant', 'imp', 'hooligan', 'bad-asses', 'no-goodkin', 'malefactor',
                          'vagabond', 'transgressor', 'black-hat', 'evil-doer', 'criminal',
                          'malfeasant', 'sinner', 'wrong-doer', 'degenerate', 'reprobate',
                          'rascal', 'hoodlum', 'delinquent', 'scallywag', 'scoundrel', 'ruffian',
                          'outlaw', 'hooligan', 'heathen', 'liars and thief', 'ner-do-well',
                          'ingrate', 'lawbreaker', 'culprit', 'felon', 'felonius sort',
                          'nefarious type', 'fraudster', 'yardbird', 'infractor', 'offender',
                          'perp', 'scumbag', 'vandal', 'ruffian', 'crook', 'felon', 'delinquent',
                          'bruiser', 'mug', 'troublemaker', 'misguided youth', 'shyster',
                          'scofflaw', 'rapscallion'];

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getCriminalName(playerCount) {
        let idx = getRandomInt(0, criminalList.length - 1);
        let name = criminalList[idx];
        if (playerCount > 1) name = name + "s";
        return name;
    }

    // ========= Handlers for Fast Reloading ========================
    //
    const targetUlSel = "#mainContainer > div.content-wrapper > div.userlist-wrapper > ul";
    const playersInJailSel = "#mainContainer > div.content-wrapper > div.userlist-wrapper >" +
        " div.users-list-title > span.title > span.total";
    const activePageSel = "div.gallery-wrapper.pagination > a.page-show.active";
    const lastPageSel = "a.page-number.page-show.last";

    // Actual fast reload call
    var scoresCalculated = false;
    function reloadUserList(event) {
        log("Enter reloadUserList, forced: ", forceReloadPageNum, " doingReload: ", doingReload);

        playerCount = 0;
        hiddenPlayers = 0;
        totalPlayers = 0;

        forceReloadBtn();                        // This ensures that on any error, reload btn is back.
        if (doingReload) {
            doingReload = false;
            log("Exit reload: already in reload?");
            return;
        }

        let pageNum = forceReloadPageNum;        // Clear reload number, use bool value or pageNum to check
        forceReloadPageNum = 0;
        forcedPageReload = (pageNum > 0);

        reloadStart = _start();                  // For profiling, and make sure we don't trigger our observer!

        // MOVE THIS!!!!
        observerOff();

        doingReload = true;

        // 0 or 1 is first page, then 2, 3, etcc
        let hashNum = ((pageNum == 0 || pageNum == 1)) ? 0 : (+pageNum - 1) * 50;
        let hash = forcedPageReload ? ((+hashNum > 0) ? `#start=${hashNum}` : '') : (+hashNum > 0) ? savedHash : '';

        let h = location.hash;
        if (h) {
            hashNum = h.split('=')[1];
            hash = h;
            log("Forcing hash, going to: ", hash, (reloadURL + hash));
        }

        let useURL = reloadURL + hash;

        log("Setting start page num: ", hashNum, " prev: ", pageNum," saved: ", getStartNumFromHash(savedHash));
        let startNum = hashNum; // pageNum ? pageNum : getStartNumFromHash(savedHash);

        // Temp: scrap jumping...

        scoresCalculated = false;
        log("Quick reload URL: ", useURL, " start num: ", startNum);
        $.post(
            useURL,
            {
                action: "jail",
                start: startNum
            },
            function (response) {

                // Might not be able to do this here, may pend processing w/seTimeout...
                //observerOff();

                processResponse(response, pageNum);

                //observerOn();
            }

        );
        log("Exit reloadUserList, request submitted");

    }

    // ============= Functions used in fast reload respose processing =====================



    // After a reload, go through the returned HTML and build
    // the LI's for each player, inserting into the list.
    function insertPlayers(players) {
        $(targetUlSel).empty();
        for (let idx=0; idx < players.length; idx++) {
            let liObj = buildPlayerLi(players[idx]);
            let innerHTML = liObj.html; //buildInfoWrap(player);
            let hidden = liObj.isHidden;

            if (!hidden) {
                $(targetUlSel).append(innerHTML);
            } else {
                hiddenPlayers++;
            }
        }
    }

    function setActivePage(currPage, activePage) {
        $(currPage).removeClass('active');
        $(activePage).addClass('active');

        debug("setActivePage: curr: ", $(currPage));
        debug("setActivePage: active: ", $(activePage));
    }

    function doLastPageJump() {
        log("[doLastPageJump] totalPlayers: ", totalPlayers);

        if (DEV_MODE == false || optTryLastPages == false) {
            debug("Jumping not allowed!");
            return false;
        }

        let lastPgBtn = $(lastPageSel);
        let lastPageNum = $(lastPgBtn).attr('page');
        let clickBtn = $(`.pagination-wrap a[page='${lastPageNum}']`)[0];
        let currPgBtn = $(activePageSel);

        // EXPERIMENTAL
        let href = $(lastPgBtn).attr("href");
        if (href && href.indexOf('start') > -1) {
            href = href + "&reload=true";
            $(lastPgBtn).attr("href", href);
        }

        if ($(clickBtn).length == 0 || $(currPgBtn).length == 0) {
            debug("Cant find page buttons");
            return false;
        }

        let thisPageNum = $(currPgBtn).attr("page");
        log("Pages, this: ", thisPageNum, " last: ", lastPageNum,
            "\ncurrPgBtn: ", $(currPgBtn), "\nclickBtn: ", $(clickBtn));

        $(clickBtn).css("border", "1px solid green");
        $(clickBtn).css("color", "limegreen");

        if (lastPageNum == thisPageNum) return false;

        // Note: this doesn't do scores!!!!
        if (confirm("Jump to last page?")) {
            log("**** Jumping: set reloadPage to ", lastPageNum);
            reloadPage = lastPageNum;
            $(clickBtn)[0].click();
            debug("Clicked clickBtn: ", $(clickBtn));

            setActivePage(currPgBtn, lastPgBtn)
            return true;
        }

        return false;
    }


    function doReloadPageSort() {
        savedSortId = GM_getValue('savedSortId', savedSortId);
        if (savedSortId) {
            lLvlOrder = GM_getValue('lLvlOrder', lLvlOrder);
            lTimeOrder = GM_getValue('lTimeOrder', lTimeOrder);
            lScoreOrder = GM_getValue('lScoreOrder', lScoreOrder);
            handleTitleClick({target: {'id': savedSortId}});
        }
    }

    function updateMsgLineText() {
        let et = elapsed(reloadStart);
        debug("reloadUserList took ", elapsed(reloadStart), " secs");

        let msg = "Reload complete, ";
        if (+et == 0)
            msg += "under 1 sec.";
        else
            msg += (+et / 1000).toFixed(2) + " secs.";

        msg += " Got " + playerCount + " " + getCriminalName(playerCount);

        let spanTxt = " (" + hiddenPlayers + " hidden)";
        msg  += ".";

        if ($("#xhidden").length)
            $("#xhidden").text(spanTxt);
        else
            $(playersInJailSel).parent().append("<span id='xhidden'>" + spanTxt + "</span>");

        $("#xedx-msg").text(msg);
}

    function recordReloadStats() {
        let et = elapsed(reloadStart);
        let totalFastReloads = GM_getValue("totalFastReloads", 0);
        totalFastReloads = +totalFastReloads + 1;
        GM_setValue("totalFastReloads", totalFastReloads);

        let fastReloadTime = GM_getValue("fastReloadTime", 0);
        fastReloadTime = +fastReloadTime + et;
        GM_setValue("fastReloadTime", fastReloadTime);

        let fastReloadTimeAvg = fastReloadTime / totalFastReloads;
        GM_setValue("fastReloadTimeAvg", fastReloadTimeAvg);
    }

    function doQuickBust() {
        let targetUl = $(targetUlSel);
        let bustable = $(targetUl).find(".xbust");

        if (!$(bustable).length) return;

        // Respect yellow gating if configured
        if ($(bustable).first().hasClass("qbust-yellow") && !quickBustYlw) {
            return;
        }

        // Choose the lowest difficulty score among bustable entries
        let chosen = null;
        let lowScore = Number.POSITIVE_INFINITY;
        $(bustable).each(function(_, el) {
            const scoreAttr = $(el).find('.score.level').attr('score');
            if (!scoreAttr) return;
            const scoreNum = parseInt(String(scoreAttr).replace(/,/g, ''), 10);
            if (isNaN(scoreNum)) return;
            if (scoreNum < lowScore) {
                lowScore = scoreNum;
                chosen = el;
            }
        });

        if (!chosen) chosen = $(bustable)[0];

        // Proceed to bust the chosen target
        setTimeout(forceReloadBtn, 500);

        let bustNode = $(chosen).siblings(".bust")[0];
        debug("Quick Bust! bustNode: ", $(bustNode));

        $(bustNode)[0].click();
        clickYesRetries = 0;
        findAndClickYes(bustNode);
    }

    // ============================ Fast reload call on ajax response =====================

    var timerOn;
    function blinkButtons(turnOn=false, altColor) {
        let color = altColor ? altColor : 'xlg';
        if (turnOn == true) {
            $("#xedx-reload-btn").addClass(color);
            $("#xedx-reload-btn2").addClass(color);
            $("#xedx-quick-bust-btn").addClass(color);
            if (!timerOn) setTimeout(blinkButtons, 200, false, color);
            timerOn = true;
        } else {
            timerOn = undefined;
            $("#xedx-reload-btn").removeClass(color);
            $("#xedx-reload-btn2").removeClass(color);
            $("#xedx-quick-bust-btn").removeClass(color);
        }
    }

    // Process the response from a reload
    var reloadingPrevPage = false;
    var reloadPage = 1;
    function processResponse(response, pageNum) {
        let displayMsg = false;
        log("**** Handling reloadUserList response ****");
        let targetUl = $(targetUlSel);
        let jsonObj = JSON.parse(response);

        // Just to indicate the response, flash the text green...
        if (blinkOnSuccess == true) {
            if (jsonObj.success == true)
                blinkButtons(true);
            else {
                debugger;
                blinkButtons(true, "xred");
            }
        }

        if (jsonObj.success == true) {
            let players = jsonObj.data.players;
            playerCount = players ? players.length : 0;
            totalPlayers = jsonObj.total;

            let currPgBtn = $(activePageSel);
            let thisPageNum = $(currPgBtn).attr("page");
            if (thisPageNum > 1) totalPlayers += ((thisPageNum - 1) * 50);

            log("*** Response: ", jsonObj);

            // Set counter on bar, not updated automatically
            // Why plus 1??
            $(playersInJailSel).text(totalPlayers);

            // Handle the case of no one in jail
             if (!players) {
                let msg = "There is no one in jail at this time.";
                let et = elapsed(reloadStart);
                if (+et == 0)
                    msg += " (under 1 sec)";
                else
                    msg += " (" + et + " secs)";

                $("#xedx-msg").text(msg);
                $(playersInJailSel).text("0");      // TBD: change text also

                 debug("No one in jail. Obs on? ", isObserverOn);
                 if (isObserverOn) {
                     debugger;
                     observerOff();
                 }

                 log("[processResponse] exit, no players");
                 return;
            }

            if (!totalPlayers) {
                debug("json: ", jsonObj);
                debugger;
            }

            // Handle was on last page - but no longer exists
            let tmpDiv = $(jsonObj.data.pagination);
            debug("tmpDiv: ", $(tmpDiv), " children: ", $(tmpDiv).children().length);

            let last = $(tmpDiv).find(".page-number.last");
            let lastPgNum = $(last).attr("page");
            debug("last: ", $(last));
            log("last pg num: ", lastPgNum, " this page: ", thisPageNum,
                " reloadPage: ", reloadPage, "\nHash: ", location.hash);

            if (!$(tmpDiv).length) {
                log("Removing pagination");
                $("#mainContainer > div.content-wrapper.spring > .pagination-wrap").remove();
            }

            if ((!$(tmpDiv).length || parseInt(thisPageNum) > parseInt(lastPgNum)) && location.hash && location.hash.indexOf('start=') > -1) {
                log("Reload first page!!", thisPageNum);
                debugger;
                location.href = reloadURL;
                log("[processResponse] exit, jumping back?");
                return;
            }

            /*
            if ((reloadingPrevPage == false) && reloadPage != 1 &&
                (!$(tmpDiv).length || parseInt(thisPageNum) > parseInt(lastPgNum))) {

                reloadingPrevPage = true;
                reloadPage = 1;
                log("Reload first page!!");
                doingReload = false;
                totalPlayers = jsonObj.total;
                $("#mainContainer > div.content-wrapper > .pagination-wrap").remove();
                forceReloadPageNum = lastPgNum ? lastPgNum : 1;
                reloadUserList();
                return;
            }
            reloadingPrevPage = false;
            */

            // Handle not on last page - which is where the easiest to bust are.
            let jumped = false;

            // May not be loaded yet here (playerCount == 0)! need setTimeout???
            if (playerCount == 0) {
                log("Reload first page!!");
                doingReload = false;
                totalPlayers = jsonObj.total;
                $("#mainContainer > div.content-wrapper > .pagination-wrap").remove();
                forceReloadPageNum = lastPgNum ? lastPgNum : 1;
                log("[processResponse] return, no longer on last page");
                reloadUserList();
                log("[processResponse] return after reload");
                return;
            }

            insertPlayers(players);

            log("Reload complete, sorted and scored yet? ", scoresCalculated);
            // Now sort...if moved pages, this won't work???
            doReloadPageSort();
            updateMsgLineText();

            // If scores not recalculated yet, do so
            if (scoresCalculated == false)
                addJailScores();
        }
        else {
            if (DEV_MODE) {
                let msg = "Error in JSON response!";
                log("json: ", jsonObj);
                $("#xedx-msg").text(msg);
            }
        }

        if (recordStats) {
            recordReloadStats();
        }

        log("[processResponse] Successful Update!");
        doingReload = false;
        observerOn();
    }

    // ============================ End fast reload processing =============================

    // ========= HTML element building..... ========================

    // Filtering change - will now return 'undefined' if under filter
    // limit (?)
    function buildPlayerLi(player) {
        let infoWrapObj = buildInfoWrap(player);
        let infoWrap = infoWrapObj.html; //buildInfoWrap(player);
        let hidden = infoWrapObj.isHidden;

        debug("infoWrapObj: ", infoWrapObj);
        debug("infoWrap: ", $(infoWrap));
        debug("hidden: ", hidden);

        let buyDiv = buildBuyDiv(player);
        let bustDiv = buildBustDiv(player);

        // Based on the hideLimit option, the infoWrap
        // may be flagged as filtered....

        let innerHTML = "<li class='gray'>" +
            player.print_tag +
            player.online_offline +
            player.print_name +
            infoWrap +
            buyDiv +
            bustDiv +
            '<div class="confirm-bye"></div>' +
            '<div class="confirm-bust"></div>' +
            '<div class="bottom-white"></div>' +
            "</li>";

        return {
            html: innerHTML,
            isHidden: hidden
        };
    }

    const tenPct = function (x) { x - (x * .01); }

    function buildInfoWrap(player) {
        debug("[buildInfoWrap]");

        let minutes = parseJailTimeStr(player.time);

        let score = (minutes + 180) * parseInt(player.level);
        let scoreStr = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let sr = getSuccessRate(score, getSkill(), totalPenalty);
        let maxSR = getMaxSuccessRate(score, userLvl, totalPenalty);

        // Flag, via a dummy class, if 'bustable'...
        let classStr = "info-wrap";
        let scoreAddlClass = "";

        // Adjust by 10% of value
        let diff = 10; //100 - bustMin;
        let planB = bustMin - diff;
        let planC = planB - diff;

        let separator = " | ";
        let hasGreen = false;

        // Do the filtering:
        // If success rate (mxSR) under the hideLimit, flag as filtered/hidden.
        // If maxSR over bustLimit, flaggreen, as easy bust, optionally have easy bust button.
        // If maxSr within 10 of that, flag as yellow (medium), optional button again.
        // 10 beneath that,orange, even less likely.
        let hidden = false;
        if (hideLimit > 0 && maxSR < hideLimit) {
            hidden = true;
        } else if (maxSR >= bustMin) {
            classStr += " xbust xbgreen-inset-sm";
            scoreAddlClass = "xgr";
            hasGreen = true;

            if (quickBustBtn) { // && $("#xedx-reload-btn").length) {
                forceBustButton();
                $(".xbyellow").removeClass("xbust").removeClass("xbyellow");
                $("#xedx-quick-bust-btn").removeClass('qbust-yellow').addClass('qbust-green');
            }

        } else if (maxSR >= planB && maxSR < bustMin && !hasGreen && planB > 0) { // 10% of initial min
            scoreAddlClass = "xylw";
            if (quickBustYlw && quickBustBtn && $("#xedx-reload-btn").length && !hasGreen) {
                forceBustButton();
                classStr += " xbust xbyellow";
                $("#xedx-quick-bust-btn").removeClass('qbust-green').addClass('qbust-yellow');
            }
        } else if (maxSR >= planC && maxSR < planB && !hasGreen && planC > 0) { // 10% less than above
            scoreAddlClass = "xog";
        }

        let initialSpan = '<span class="' + classStr +'">';
        // First span, if hidden, will have a data-val to mark as such.
        //if (hidden) initialSpan = '<span filter="yes" class="' + classStr +'">';

        let infoWrap = initialSpan +
                '<span class="time" time="' + minutes + '">' +                // For sorting
                    '<span class="title bold">TIME<span>:</span></span>' +
                         player.time +
                     '</span>' +
                     '<span class="level"><span class="title bold">LEVEL<span>:</span></span>' +
                             player.level +
                     '</span>' +

                      // around line 250, to calc score
                      '<span class="score level ' + scoreAddlClass + '" score="' + scoreStr.replace(',', '') + '" sr="' + maxSR + '">' +
                             '<span class="title bold"> Score </span>' +
                              '<span style="display: block; width: 59px;">' + scoreStr + '</span>' + maxSR + '%' +
                      '</span>' +

                      '<span class="reason" style="width: 200px;">' +
                          player.jailreason +
                      '</span>' +
                  '</span>';

        return {
            html: infoWrap,
            isHidden: hidden
        };
    }

    function buildBuyDiv(player) {
        let buyDiv = '<a class="bye t-gray-3" href="jailview.php?XID=' + player.user_id +'&amp;action=rescue&amp;step=buy">' +
                     '<span class="bye-icon"></span>' +
                     '<span class="title bold">BUY</span>' +
                     '</a>';
        return buyDiv;
    }

    function buildBustDiv(player) {
        let bustDiv = '<a class="bust t-gray-3" href="jailview.php?XID=' + player.user_id +'&amp;action=rescue&amp;step=breakout1">' +
                      '<span class="bust-icon"></span>' +
                      '<span class="title bold">BUST</span>' +
                      '<span class="tt-quick-q">Q</span></a>';
        return bustDiv;
    }

    // ========== Banner button and panel handlers ==========

    var elInAnimation = false;
    function elementAnimate( element, size, callback) {
        debug("elementAnimate, inAnimation: ", elInAnimation, " size: ", size);
        debug("element: ", $(element));
        elInAnimation = true;

        $(element).animate({
            height: size,
        }, 1500, function() {
            if (callback) callback(element);
            elInAnimation = false;
        });
    }

    function elementHideShow(element) {
        let dataval = $(element).attr("data-val");
        $(element).attr("data-val", "");
        debug("elementHideShow, dataval: ", dataval);
        if (dataval == "none") return;

        // Check for animate-specific data-val first
        if (dataval == "hide") {
            $(element).removeClass("xshow").addClass("xhide");
            return;
        }
        if (dataval == "show") {
            $(element).removeClass("xhide").addClass("xshow");
            return;
        }

        if ($(element).hasClass("xshow")) {
            $(element).removeClass("xshow").addClass("xhide");
        } else {
            $(element).removeClass("xhide").addClass("xshow");
        }
    }

    // ================= Scroll to a user by XID, centering in view ========================

    function scrollTo (elem) {
       $('html,body').animate({
          scrollTop: $(elem).offset().top - $(window).height()/2
       }, 500);
    }

    function scrollToXID(xid) {
        debug("scrollToXID: ", xid);

        let userElem;
        let users = $("li > a.user.name");
        for (let idx = 0; idx < users.length; idx++) {
            let node = users[idx];
            if ($(node).attr("href").indexOf(xid) > -1) {
                userElem = $(node);
                break;
            }
        }

        if ($(userElem).length) {
            let parent = $(userElem).parent();
            $(parent).css('border', '2px solid limegreen');
            scrollTo(parent);
        } else {
            log("XID not found!");
        }
    }

    // =========== Handle hiding our UI elements, via the main "Hide" button ===============

    // Broken ATM, not sure why...

    var bannerHidden = false;
    function handleHideBtn() {
        debug("handleHideBtn, ", MAIN_DIV_ID, ": ", $(MAIN_DIV_SEL), " mainUiBtnsInstalled: ", mainUiBtnsInstalled);
        if (hideWithButton && !mainUiBtnsInstalled) {
            log("Main UI not installed, installing now");
            installUI(true);
            doShow();
            return false;
        }

        if ($(MAIN_DIV_SEL).hasClass("xshow")) {
            doHide();
        } else if ($(MAIN_DIV_SEL).hasClass("xhide")) {
            doShow();
        } else {
            doShow();
        }
        return false;
    }

    // Not yet sure how I get two handler clicks, made checks to verify
    // not added twice. Until I figure it out, use a hack to prevent/suppress
    var clickProtectOn = false;
    const clearClickProtect = function () {
        clickProtectOn=false;
    }

    function dblClickProtect() {
        // Temp: disabled for now
        return;

        clickProtectOn = true;
        setTimeout(clearClickProtect, 500);
        return false;
    }

    var dh = 0;
    function doHide() {
        if (clickProtectOn) return false;

        $("#jailFilter").addClass("xhide").removeClass("xshow");
        $("#mainContainer > div.content-wrapper > div.msg-info-wrap > hr").addClass("xhide").removeClass("xshow");
        $(MAIN_DIV_SEL).addClass("xhide").removeClass("xshow");
        if (hideWithButton) $("#xhide-btn").prop('value', 'Show');
        GM_setValue("lastShow", "hide");

        return dblClickProtect();
    }

    var ds = 0;
    function doShow(force) {
        debug("doShow ", clickProtectOn, " ", ds++);
        if (clickProtectOn) return false;

        if($("#jailFilter").length == 0) return setTimeout(doShow, 250);

        $("#jailFilter").addClass("xshow").removeClass("xhide");
        $("#mainContainer > div.content-wrapper > div.msg-info-wrap > hr").addClass("xshow").removeClass("xhide");
        $(MAIN_DIV_SEL).addClass("xshow").removeClass("xhide");
        $("#xhide-btn").prop('value', 'Hide');
        GM_setValue("lastShow", "show");

        return dblClickProtect();
    }
    // =========== End handle hiding our UI elements, via the main "Hide" button ===============

    // =========== Div for script options panel/dashboard,down here just  to keep ot of above code.

    // Handle getting busts for a day, for stats view
    function getDailyBusts(daysAgo=0) {
        debug("[getDailyBusts] days ago: ", daysAgo);
        const secsInDay = 60 * 60 * 24;
        var dayOffset = daysAgo > 0 ? (daysAgo * secsInDay * 1000) : 0;

        const startToday = new Date(new Date().setUTCHours(0,0,0,0));
        const endToday = new Date(new Date().setUTCHours(23,59,59,999));

        let from = (startToday.getTime() / 1000) - (+daysAgo * secsInDay);
        let to = (endToday.getTime() / 1000) - (+daysAgo * secsInDay);

        let modFrom = new Date((+from * 1000));
        let modTo = new Date((+to * 1000));

        let queryStr = `log&log=5360&from=${from}&to=${to}`;
        xedx_TornUserQuery(null, queryStr, dailyBustsCB, daysAgo, "Jail Scores");

        function tsToUtcStr(ts) { // ts from log is in seconds...
            let fullTimeStr = new Date(+ts * 1000).toUTCString();
            let parts = fullTimeStr.split(' ');
            let shortTimeStr = parts[0] + ' ' + parts[2] + ' ' + parts[1] + ' ' + parts[4];

            return { full: fullTimeStr, short: shortTimeStr };
        }

        function fillStatsDailyBusts(bustArr) {
            $("#daily-bust-tbl > tbody").empty();
            if (bustArr && bustArr.length > 0) {
                let newRow = `<tr><td>Date</td><td>User</td><td>Nerve Cost</td></tr>`;
                $("#daily-bust-tbl > tbody").append(newRow);
            }

            let count = bustArr.length;
            bustArr.forEach(entry => {
                let newRow = `<tr>
                                  <td>${entry.ts}</td>
                                  <td>${entry.user}</td>
                                  <td>${entry.nerve}</td>
                              </tr>`;
                $("#daily-bust-tbl > tbody").append(newRow);
            });

            let dateHdr = "Date (" + count + " found)";
            $("#daily-bust-tbl > tbody > tr:nth-child(1) > td:nth-child(1)").text(dateHdr);
        }

        function dailyBustsCB(responseText, ID, param) {
            let jsonResp = JSON.parse(responseText);
            if (jsonResp.error) {
                debug('Response error! ', jsonResp.error);
                return handleError(responseText);
            }
            // Format each result for the stats table...
            let bustArr = [];
            if (!jsonResp.log) return log("Error: no log in past busts result!");
            let entries = jsonResp.log;
            let keys = Object.keys(entries);
            if (!entries) return log("No daily bust entries.");
            for (let idx=0; idx<keys.length; idx++) {
                let entry = entries[keys[idx]];
                let res = tsToUtcStr(entry.timestamp);
                let timeDate = tsToUtcStr(entry.timestamp).short;
                let userId = entry.data.user;
                let nerve = entry.data.nerve_used;
                bustArr.push({ts: timeDate, user: userId, nerve: nerve});
            }
            fillStatsDailyBusts(bustArr);
        }
    }

    // Count daily busts from log only
    function getDailyBustsCount() {
        const startToday = new Date(new Date().setUTCHours(0,0,0,0));
        const endToday = new Date(new Date().setUTCHours(23,59,59,999));

        let from = startToday.getTime() / 1000;
        let to = endToday.getTime() / 1000;
        let modFrom = new Date((+from * 1000));
        let modTo = new Date((+to * 1000));

        let queryStr = `log&log=5360&from=${from}&to=${to}`;
        xedx_TornUserQuery(null, queryStr, dailyBustsCountCB, null, "Jail Scores");

        function dailyBustsCountCB(responseText, ID, param) {
            let jsonResp = JSON.parse(responseText);
            if (jsonResp.error) {
                debug('Response error! ', jsonResp.error);
                return handleError(responseText);
            }
            if (!jsonResp.log) return log("Error: no log in result!");
            let entries = jsonResp.log;
            let keys = Object.keys(entries);
            let count = keys ? keys.length : 0;

            let currentlySaved = parseInt(GM_getValue("currBustsUtc-logged", count));
            let countDisplayed = parseInt($("#busts-today .numBusts").text());

            GM_setValue("currBustsUtc-logged", count);

            if ((count != currentlySaved && count != (countDisplayed - 1)) ||
               (!countDisplayed || isNaN(countDisplayed))) {
                debug("[dailyBustsCountCB] adjusting: ", count, currentlySaved, countDisplayed);
                setTodaysBusts(count);
            } else {
                debug("[dailyBustsCountCB] NOT adjusting: ", count, currentlySaved, countDisplayed);
            }

            //$("#busts-today .numBusts").text(count);
        }
    }

    const useOptionsTable = true;    // replacing with table view.....
    function getOptionsDiv() {
        if (useOptionsTable == true) return getOptionsDivTable();

        let optsDiv = `
            <div id="xedx-jail-opts"  class="xoptwrap flexwrap title-black xnb bottom-round">
                <span style="width: 75%;">
                     <label for="limit">Lower limit, %:</label>
                     <input type="number" id="bust-limit" class="xlimit" name="limit" min="0" max="100">
                     <label for="hide" class="xml10">Filter, hide under %:</label>
                     <input type="number" id="hide-limit" class="xlimit" name="hide" min="0" max="100">
                     <input type="checkbox" id="quick-bust-btn" data-type="sample3" class="xedx-cb-opts xml10">
                         <span>Quick Bust Green</span>
                     <input type="checkbox" id="pre-release-btn" class="xedx-cb-opts xml10">
                         <span>Advanced</span>
                 </span>
                 <span class="xopt-span">
                     <input id="xedx-save-opt-btn" type="submit" class="xedx-torn-btn xmt3" value="Apply">
                     <input id="xedx-save-btn2" type="submit" class="xedx-torn-btn xml10 xmt3 xmr10" value="Save Log">
                 </span>

                 <span class="break"></span>

                 <span style="width: 75%;">
                 <input type="checkbox" id="penalty-btn" class="xedx-cb-opts xmr10 xmb30 xprerelease">
                     <span class="xprerelease">Show p0</span>
                 <input type="checkbox" id="quick-bust-ylw" class="xedx-cb-opts xmb20 xmr10 xml10 xmb30 xprerelease">
                     <span class="xprerelease">QB Yellow</span>
                 <!-- span class="xml10">Timezone:</span>
                 <input type="checkbox" id="xtz-local" class="xedx-cb-opts xmb20 xmr10 xml10 xmb30 xprerelease">
                     <span class="xprerelease">Local</span>
                 <input type="checkbox" id="xtz-tct" class="xedx-cb-opts xmb20 xmr10 xml10 xmb30 xprerelease">
                     <span class="xprerelease">TCT</span>
                 <input type="checkbox" id="xlast-page-opt" class="xedx-cb-opts xmb20 xmr10 xml10 xmb30 xhide xprerelease dev-mode">
                     <span class="xhide xprerelease dev-mode">Auto Last Page</span>
                 </span -->
                 <span class="xopt-span">
                     <input id="xedx-stats-btn" type="submit" class="xedx-torn-btn xmt5 xmr10" value="Stats">
                 </span>
             </div>
             `;

        return optsDiv;
    }

    function addOptsTableStyles() {
        GM_addStyle(`
            #xedx-jail-opts-tbl td span {
                display: flex;
                flex-flow: row wrap;
                color: var(--tutorial-title-color);
                font-size: 12px;
                font-family: arial;
            }

            #xedx-jail-opts-tbl tr td:last-child {
                /*width: 1%;
                white-space: nowrap;*/
            }
            #xedx-jail-opts-tbl tr {
                max-height: 35px;
                /*align-content: center;*/
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                width: 100%;
            }
            .xedx-radio-opts-table {
                margin-left: 10px;
                margin-right: 5px;
            }

            .xedx-cb-opts-table {
                display: inline-block;
                vertical-align: top;
                margin: 0px 10px 0px 10px;
            }

            .xopt-span-table {
                width: 25%;
                float: right;
                margin-left: auto;
            }

            .xopt-2btn-span {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-end;
                width: 100%;
            }

            #table-wrap > td {
                width: 75%;
                vertical-align: top;
            }
        `);
    }

    // As above, but using a table
    function getOptionsDivTable() {

        let optsDiv = `
            <div id="xedx-jail-opts" class="xoptwrap flexwrap title-black xnb bottom-round">

                <table id="table-wrap" style="width: 100%;margin-top: 5px;"><tbody><tr>
                    <td style="width: 75%; vertical-align: top;">` +

                        // Left side of table, checkboxes/input etc.

                        `<table id="xedx-jail-opts-tbl" style="width: 100%;"><tbody>` +
                            // Top row options
                            `<tr>
                                 <td><span>
                                     <span>Lower limit, %:</span>
                                     <input type="number" id="bust-limit" class="xlimit" name="limit" min="0" max="100">
                                 </span></td>

                                 <td><span>
                                     <!-- label for="hide" class="xml10">Filter, hide under %:</label -->
                                     <span>Filter, hide under %:</span>
                                     <input type="number" id="hide-limit" class="xlimit" name="hide" min="0" max="100">
                                 </span></td>

                                 <td><span>
                                     <input type="checkbox" id="quick-bust-btn" data-type="sample3" class="xedx-cb-opts-table">
                                     <span>Quick Bust Green</span>
                                 </span></td>

                                 <td><span>
                                     <input type="checkbox" id="pre-release-btn" class="xedx-cb-opts-table">
                                     <span>Advanced</span>
                                 </span></td>
                             </tr>` +

                             // Second row options
                             `<tr>
                                 <td><span>
                                     <input type="checkbox" id="save-results" class="xedx-cb-opts-table">
                                     <span class="">Show Last Results</span>
                                 </span></td>
                                 <td><span>
                                     <input type="checkbox" id="show-limits" class="xedx-cb-opts-table">
                                     <span class="">Show Bust Limit</span>
                                 </span></td>
                                 <td><span>
                                     <input type="checkbox" id="lock-animations" class="xedx-cb-opts-table">
                                     <span class="">Lock Animations</span>
                                 </span></td>
                                 ` +

                                 /*
                                 <td><span style="visibility: hidden;">
                                     <span class="xprerelease dev-mode">Rate busts on:</span>
                                     <span>
                                         <input type="radio" id="xradio-pct" name="limit-type" class="xedx-radio-opts-table">
                                         <span class="xprerelease dev-mode">% Chance</span>
                                     </span>
                                     <span>
                                         <input type="radio" id="xradio-score" name="limit-type" class="xedx-radio-opts-table">
                                         <span class="xprerelease dev-mode">Score</span>
                                     </span>
                                 </span></td>
                             </tr>` +
                             */

                             // Third row opts - pre-release/advanced...
                             `<tr>
                                 <td><span>
                                     <input type="checkbox" id="penalty-btn" class="xedx-cb-opts-table xprerelease">
                                     <span class="xprerelease">Show p0</span>
                                 </span></td>

                                 <td><span>
                                     <input type="checkbox" id="quick-bust-ylw" class="xedx-cb-opts-table xprerelease">
                                     <span class="xprerelease">QB Yellow</span>
                                 </span></td>

                                 <!-- td><span>
                                     <span class="xml10">Timezone:</span>
                                     <input type="radio" id="xtz-local" name="opt-tz" class="xedx-radio-opts-table xprerelease">
                                     <span class="xprerelease">Local</span>
                                     <input type="radio" id="xtz-tct" name="opt-tz" class="xedx-radio-opts-table xprerelease">
                                     <span class="xprerelease">TCT</span>
                                 </span></td -->

                                 <td><span>
                                     <input type="checkbox" id="xlast-page-opt" class="xedx-cb-opts-table xhide xprerelease dev-mode">
                                     <span class="xhide xprerelease dev-mode">Auto Last Page</span>
                                 </span></td>
                             </tr>

                         </tbody></table>
                     </td>` +

                     // Right side cell of outer table: buttons

                     `<td style="width: 25%; vertical-align: top;">
                         <div style="display: flex; flex-direction: column;">
                             <span class="xopt-2btn-span">
                                 <input id="xedx-save-opt-btn" type="submit" class="xedx-torn-btn xmt3" value="Apply">
                                 <input id="xedx-save-btn2" type="submit" class="xedx-torn-btn xml10 xmt3 xmr10" value="Save Log">
                             </span>

                             <span class="xopt-2btn-span">
                                 <input id="xedx-stats-btn" type="submit" class="xedx-torn-btn xmt5 xmr10" value="Stats">
                             </span>
                         </div>
                     </td>

                 </tr></tbody></table>
             </div>
             `;

        return optsDiv;
    }

    const grnSpan = "<span class='xgr'>";
    const endSpan = "</span>";

    function fillJailStatsDiv() {
        debug("[fillJailStats]");

        $("#daily-busts").text(/*"Today's busts: " +*/ GM_getValue("currBusts", 0));
        $("#max-busts").text(/*"Maximum: " +*/ GM_getValue("maxDailyBusts", 0));
        $("#min-p0").text(/*"Minimum penalty: " +*/ GM_getValue("p0low", 0));
        $("#max-p0").text(/*"Maximum penalty: " +*/ GM_getValue("p0hi", 0));
        $("#ppl-busted").text(/*"Total busts: " +*/ perks.totalBusts);
        $("#fail-busts").text(/*"Failed busts: " +*/ (personalstats ? personalstats.failedbusts : "N/A"));
        $("#hi-score").text(/*"Highest score: " +*/ GM_getValue("hiScore", 0));
        let res = getBustsNeededForAward();
        let bustsNeeded = res.need;
        let honor = res.name;

        if (bustsNeeded == 0)
            $("#busts-needed").text("Complete! Way to go!");
        else {
            let msgText = /*bustsNeeded +*/  " To next award  (" + honor + "): ";
            $("#busts-needed").text(bustsNeeded);
            $("#bneed-txt").text(msgText);

            //let innerHtmlSpan = grnSpan + bustsNeeded + endSpan  + " to next award (" + grnSpan + honor + endSpan + ")";
            //$("#busts-needed").append(innerHtmlSpan);
        }
    }

    const bustAwardsAt = [250, 500, 1000, 2000, 2500, 4000, 6000, 8000, 10000];
    const bustTitles = ["medal", "medal", "Bar Breaker", "medal", "Aiding And Abetting", "medal", "medal", "medal", "Don't Drop It"];
    function getBustsNeededForAward() {
        let have = perks.totalBusts;
        if (have > 10000) return {need: 0, name: ""};
        for (let idx=0; idx < bustAwardsAt.length; idx++) {
            if (have < bustAwardsAt[idx]) return {need: (bustAwardsAt[idx] - have), name: bustTitles[idx]};
        }
        log("Error: exceeded array limits!");
        return {need: -1, name: "error"};
    }

    // Should turn these into tables, easier to format
    function getStatsDiv() {
        GM_addStyle(".xcg-light-yel {color: #FFFF66;} .xc-og {color: #82c91e;} " +
                    ".text-bl {color: #a5d8ff;} .off-orange {color: #ffa94d;}" +
                    ".xstatname {margin-left: 5px; margin-right: 5px;}");

        let statsDiv = `<div id="xedx-jail-stats"  class="xoptwrap flexwrap title-black xnb bottom-round">
                             <span style="width: 100%; font-size: 12px !important;">
                                 <span>Today's busts:</span>
                                 <span class="text-bl" id="daily-busts">0</span>
                                 <span class="xstatname">Most daily: </span>
                                 <span class="text-bl" id="max-busts">0</span>
                                 <span class="xstatname">Minimum Penalty: </span>
                                 <span class="text-bl" id="min-p0">0.0</span>
                                 <span class="xstatname">Maximun Penalty daily: </span>
                                 <span class="xtext-bl" id="max-p0">0</span>
                                 <span class="xstatname">Highest score:  </span>
                                 <span class="text-bl" id="hi-score">0</span>
                             </span>

                             <span class="break"></span>

                             <span style="width: 75%; /*margin-bottom: 30px;*/ font-size: 12px !important;">
                                 <span>Total Busts:</span>
                                 <span class=" xc-og" id="ppl-busted">0</span>
                                 <span class="xstatname" id="bneed-txt"></span>
                                 <span class="xcg-light-yel" id="busts-needed"></span>
                                 <span class="xstatname">Failed Busts:</span>
                                 <span class="off-orange" id="fail-busts"></span>
                             </span>
                             <span class="xopt-span">
                                 <input id="xedx-stats-btn" type="submit" class="xedx-torn-btn xmt5 xmr10" value="Stats">
                             </span>

                             <span class="break"></span>

                             <span class="stat-tbl-hdr xflexr">
                                 <input id="xedx-stats-busts-btn" type="submit" class="xedx-torn-btn xmr10" value="Daily Busts">
                                 <label for="bust-days">Count of busts from this many days ago:</label>
                                 <input type="number" id="bust-days" name="bust-days" min="0" max="14" value="0">
                             </span>
                             <span class="break"></span>
                             <table id="daily-bust-tbl" class="xflexc" style="width: 100%"><tbody>
                             </tbody></table>
                        </div>`;

        return statsDiv;
    }

    function attachOptsDiv(sel) {
        let optsDiv = getOptionsDivTable();
        $(sel).after(optsDiv);
    }

    function tzToggleHandler(event) {
        let node = event.target;
        let id = $(node).attr("id");

        let sel = "#" + id;
        let checked = $(sel).is(":checked");

        if (id == "xtz-tct") $("#xtz-local").prop('checked', !checked);
        if (id == "xtz-local") $("#xtz-tct").prop('checked', !checked);
    }

    // Styles used throughout this. Note that a lot of my styles are defined
    // in other scripts as well,need to consolidate......
    // I've started to by adding as function calls by category.

    function addStyles() {

      // I started to add common styles to the helper lib, v2.43+
      addTornButtonExStyles();
      loadAllCommonStyles();
      addToolTipStyle();
      addBorderStyles();

      addOptsTableStyles();

      GM_addStyle(`
            .xyt {color: yellow !important; border: 1px solid yellow; filter: brightness(1.6);}
            .xbt {color: blue !important; border: 1px solid blue; filter: brightness(1.6);}
            .xlg {color: limegreen !important;}
            .xred {color: red !important;}

            #xedx-jail-stats {
                min-width: 774px;
                height: fit-content;
            }
            #daily-bust-tbl {
                height: fit-content;
                width: 100%;
                padding-top: 16px;
                padding-bottom: 16px;
            }
            #xedx-stats-busts-btn {
                width: fit-content !important;
                height: 26px !important;
            }
            #bust-days {
                margin-left: 20px;
                height: 26px;
                border-radius: 6px;
                width: 30px;
            }
            #daily-bust-tbl tbody {
                align-content: center;
                display: flex;
                flex-flow: column wrap;
            }
            #daily-bust-tbl tr {
                width: 90%;
                display: flex;
                /* border: 1px solid white;
                border-collapse: collapse; */
            }
            #daily-bust-tbl td, th {
                width: 33%;
                color: white;
                border: 1px solid white;
                border-collapse: collapse;
                justify-content: center;
                display: flex;
            }

            .stat-tbl-hdr {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
            }

            .xod {
                min-width: 784px;
            }
            .xopt-btn {
                width: 68px;
                height: 22px;
                margin-top: 3px;
            }
            .xlimit {
               height: 20px;
               width: 26px;
               border: 1px solid black;
               border-radius: 6px;
               margin-top: 5px;
            }
            .xedx-cb-opts {
                display: inline-block;
                vertical-align: top;
                margin-top: 10px;
            }
            .break {
              flex-basis: 100%;
              height: 0;
            }
            .flexwrap {
                flex-wrap: wrap;
            }
            .xjdwrap {
                display: flex;
                flex-direction: row;
                height: 34px !important;
            }
            .xoptwrap {
                display: flex;
                flex-direction: row;
                overflow: hidden;
                padding: 0px;
                min-width: 784px;
                height: fit-content;
                /* padding-bottom: 10px; */
            }
            .xopt-span {
                width: auto;
                min-width: 68px;
                float: right;
                margin-left: auto;
            }
            .xnb:before {
                content: none !important;
            }
            .xhbtn {
                margin-left: 10px;
                height: 22px;
            }
            .xjfr {
                margin-left: auto;
                float: right;
                left: 0;
            }
            .xjfr2 {
                margin-left: auto;
            }
            .flex-container {
                padding: 0 10px;
                margin: 0 auto;
                border: 2px solid red;
                width: 90%;
                height: 60%;
                display: flex !important;
                align-items: center;
                justify-content: space-between;
            }
            .xjr {
                margin-left: auto;
                margin-right: 10px;
            }
            .xbr {
                border: 1px solid red;
            }
            .xbg {
                border: 1px solid green;
            }
            .xspleft {left: 0}
            .xedx-box {
                float: right;
                display: flex;
            }
            .score { }
            .xedx-span {
                margin-bottom: 5px;
                margin-left: 20px;
            }
            .xgr {
                color: green;
            }
            .xylw {
                color: #e1c919;
            }
            .xog {
                color: #F08C00;
            }
            .xedx-caret {
                padding-top:5px;
                padding-bottom:5px;
                padding-left:20px;
                padding-right:10px;
             }
             .xedx-light:hover {
                filter: brightness(2.00);
             }
             .qreload {

             }
             .qbust-green {
                 width: 40px !important;
                 color: green !important;
             }
             .qbust-yellow {
                 width: 40px !important;
                 color: yellow !important;
             }
             .swap-span {
                height: 34px;
                width: 76px;
             }
        `);
    }

    // Handle New Day stuff...
    function midnightTimer(param1, param2) {
        log("***** Midnight Timer Pop ", (new Date().toString()));
        log("Resetting daily busts.");
        // Set bust count back to 0
        setTodaysBusts(0);
        getDailyBustsCount();
    }

    function contentLoadHandler() {
        installUI();;
        installHashChangeHandler(hashHandler);
        installObserver();

        //installUI();
    }

     // ==================================

    function pushStateChanged(e) {
        let thisCrime = getThisCrime();
        debug("pushStateChanged: ", e);
        debug("hash: ", window.location.hash);

        //setTimeout(functionToCall, 500);
    }

    const bindEventListener = function (type) {
        const historyEvent = history[type];
        return function () {
            const newEvent = historyEvent.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newEvent;
        };
    };


    // =====================================

    //////////////////////////////////////////////////////////////////////
    // Main entry point.
    //////////////////////////////////////////////////////////////////////

    logScriptStart();

    log("Trying to start midnight timer...");
    startMidnightTimer(midnightTimer);

    // If routed here by the Chat Bust script, don't run
    if (isJailPage()) {
        let params = new URL(document.location.toString()).searchParams;
        routedXID = params.get("XID");
        if (routedXID) {
            routedByChatBust = true;
            debug("Routed here by Torn Chat Bust!");
            //return log("Routed here by Torn Chat Bust...won't run!");
        }
    }

    startLogProcessQ();

    if (location.href.indexOf("jailview") > -1) {
        validateApiKey('FULL');    // 'Full' is required to read logs for past busts
        versionCheck();

        // Start by kicking off a few API calls.
        debug("Start: query past busts: ", new Date().toString());
        queryPastBusts();
        addStyles();

        getDailyBustsCount();

        // Easy way to clear stats during development
        if (GM_getValue("ClearBustStats", false) == true) {
            clearBustStats();
        }
        GM_setValue("ClearBustStats", false);

        callOnContentLoaded(contentLoadHandler);

        //callOnContentComplete(installUI);



        // Idea: start adding scores ASAP, add % as API results come in?
        // Suppress some doc load if possib;e?
        // Want fastest load time, least delay...

        // Only query and process past busts after min one minute, or
        // start this script on every page and just do past busts when not
        // on jail page? Save in storage, for 72 hours?

        // Install the UI
        /*if (DEV_MODE)*/

        //callOnContentComplete(installUI);

        // Start by kicking off a few API calls.
        //if (DEV_MODE) {
        //    queryPastBusts();
        //} else {
        //    personalStatsQuery();
        //}
    } // end if "jailview"

})();
