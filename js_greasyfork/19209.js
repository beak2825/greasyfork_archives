// ==UserScript==
// @name        Mouse Hunter Aide
// @author      NobodyRandom, Ooi Keng Siang, CnN, Elie
// @version    	2.1.70
// @description Currently the most advanced script for automizing MouseHunt and MH BETA UI. Supports ALL new areas and FIREFOX. Revamped of original by Ooi + Enhanced Version by CnN
// @icon        https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require		https://code.jquery.com/jquery-2.2.2.min.js
// @require     https://greasyfork.org/scripts/7601-parse-db-min/code/Parse%20DB%20min.js?version=32976
// @require     https://greasyfork.org/scripts/16046-ocrad/code/OCRAD.js?version=100053
// @require     https://greasyfork.org/scripts/16036-mh-auto-kr-solver/code/MH%20Auto%20KR%20Solver.js?version=102270
// @namespace   https://greasyfork.org/users/6398, http://ooiks.com/blog/mousehunt-autobot, https://devcnn.wordpress.com/
// @license 	GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @exclude		http://*.google.com/*
// @exclude		https://*.google.com/*
// @grant		unsafeWindow
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/19209/Mouse%20Hunter%20Aide.user.js
// @updateURL https://update.greasyfork.org/scripts/19209/Mouse%20Hunter%20Aide.meta.js
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // ERROR CHECKING ONLY: Script debug
var debug = false;
// // ERROR CHECKING ONLY: KR debug
var debugKR = false;

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 10 - 360
var hornTimeDelayMin = 10;
// // hornTimeDelayMax will be changed denpending on current hour
// // in function retrieveData() and function afterSoundingHorn()[only one of these 2 function will be executed]
// // Before pm 8:00 it's 120 secconds, the other time 360 secconds.
var hornTimeDelayMax = 360;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
var aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
var enableTrapCheck = false;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
var trapCheckTimeDiff = 15;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
var checkTimeDelayMin = 15;
var checkTimeDelayMax = 120;

// // Play sound when encounter king's reward (true/false)
var isKingWarningSound = false;

// // Which sound to play when encountering king's reward (need to be .mp3)
var kingWarningSound = 'https://raw.githubusercontent.com/nobodyrandom/libs/master/resource/horn.mp3';

// // Which email to send KR notiff to (leave blank to disable feature)
var kingRewardEmail = '';

// // Which number to send SMS to
var kingRewardPhone = '';

// // Verification code sent to this number
var kingRewardPhoneVerify = '';

// // Play sound when no more cheese (true/false)
var isNoCheeseSound = false;

// // Reload the the page according to kingPauseTimeMax when encountering King Reward. (true/false)
// // Note: No matter how many time you refresh, the King's Reward won't go away unless you resolve it manually.
var reloadKingReward = false;

// // Duration of pausing the script before reload the King's Reward page (in seconds)
// // Note: It only take effect if reloadKingReward = true;
var kingPauseTimeMax = 18000;

// // Auto solve KR
var isAutoSolve = true;

// // Extra delay time before solving KR. (in seconds)
// // Default: 10 - 30
var krDelayMin = 10;
var krDelayMax = 30;

// // Time to start and stop solving KR. (in hours, 24-hour format)
// // Example: Script would not auto solve KR between 00:00 - 6:00 when krStopHour = 0 & krStartHour = 6;
// // To disable this feature, set both to the same value.
var krStopHour = 7;
var krStartHour = 7;

// // Extra delay time to start solving KR after krStartHour. (in minutes)
var krStartHourDelayMin = 10;
var krStartHourDelayMax = 30;

// // Maximum retry of solving KR.
// // If KR solved more than this number, pls solve KR manually ASAP in order to prevent MH from caught in botting
var kingsRewardRetryMax = 3;

// // Time to wait after trap selector clicked (in second)
var secWait = 7;

// // The script will pause if player at different location that hunt location set before. (true/false)
// // Note: Make sure you set showTimerInPage to true in order to know what is happening.
var pauseAtInvalidLocation = false;

// // Popup on KR or not, the script will throw out an alert box if true.
var autoPopupKR = false;

// == Basic User Preference Setting (End) ==

// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
var showTimerInTitle = true;

// // Embed a timer in page to show next hunter horn timer, highly recommended to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
var showTimerInPage = true;

// // Display the last time the page did a refresh or reload. (true/false)
var showLastPageLoadTime = true;

// // Default time to reload the page when bot encounter error. (in seconds)
var errorReloadTime = 60;

// // Time interval for script timer to update the time. May affect timer accuracy if set too high value. (in seconds)
var timerRefreshInterval = 1;

// // Best weapon/base pre-determined by user. Edit ur best weapon/trap in ascending order. e.g. [best, better, good]
var bestPhysical = ['Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel', 'Chrome RhinoBot', 'Enraged RhinoBot'];
var bestTactical = ['Chrome Sphynx Wrath', 'Sphynx Wrath'];
var bestHydro = ['School of Sharks', 'Rune Shark Trap', 'Chrome Phantasmic Oasis Trap', 'Phantasmic Oasis Trap', 'Oasis Water Node Trap', 'Chrome Sphynx Wrath'];
var bestArcane = ['Event Horizon', 'Grand Arcanum Trap', 'Arcane Blast Trap', 'Arcane Capturing Rod Of Nev'];
var bestShadow = ['Clockwork Portal Trap', 'Reaper\'s Perch', 'Clockapult of Time', 'Clockapult of Winter Past', 'Maniacal Brain Extractor'];
var bestForgotten = ['Endless Labyrinth', 'Stale Cupcake Golem', 'Tarannosaurus Rex Trap', 'The Forgotten Art of Dance'];
var bestDraconic = ['Dragon Lance', 'Ice Maiden'];
var bestRiftLuck = ['Multi-Crystal Laser', 'Crystal Tower'];
var bestRiftPower = ['Focused Crystal Laser', 'Crystal Tower'];
var bestPowerBase = ['Tidal Base', 'Golden Tournament Base', 'Fissure Base', 'Spellbook Base'];
var bestLuckBase = ['Fissure Base', 'Rift Base', 'Tidal Base', 'Sheep Jade Base', 'Horse Jade Base', 'Snake Jade Base', 'Dragon Jade Base', 'Papyrus Base'];
var bestAttBase = ['Birthday Drag', 'Cheesecake Base'];
var bestPhysicalBase = ['Sheep Jade Base', 'Physical Brace Base'];
bestPhysicalBase = bestPhysicalBase.concat(bestPowerBase);
var bestLGBase = ['Hothouse Base'];
bestLGBase = bestLGBase.concat(bestLuckBase);
var bestFWWave4Weapon = ['Warden Slayer Trap', 'Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel', 'Enraged RhinoBot'];
var bestSalt = ['Super Salt', 'Grub Salt'];
var bestAnchor = ['Golden Anchor', 'Spiked Anchor', 'Empowered Anchor'];
var bestOxygen = ['Oxygen Burst', 'Empowered Anchor'];
var wasteCharm = ['Tarnished', 'Unstable', 'Wealth'];
var redSpongeCharm = ['Red Double', 'Red Sponge'];
var yellowSpongeCharm = ['Yellow Double', 'Yellow Sponge'];
var spongeCharm = ['Double Sponge', 'Sponge'];
var supplyDepotTrap = ['Supply Grabber', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var raiderRiverTrap = ['Bandit Deflector', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var daredevilCanyonTrap = ['Engine Doubler', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var coalCharm = ['Magmatic Crystal', 'Black Powder', 'Dusty Coal'];
var chargeCharm = ['Eggstra Charge', 'Eggscavator'];
var commanderCharm = ['Super Warpath Commander\'s', 'Warpath Commander\'s'];
var scOxyBait = ['Fishy Fromage', 'Gouda'];

// // Sand Crypts maximum salt for King Grub
var maxSaltCharged = 25;

// // Sunken City constant variables.
// // DON'T edit this variable if you don't know what are you editing
var ZONE_DEFAULT = 1;
var ZONE_LOOT = 2;
var ZONE_TREASURE = 4;
var ZONE_DANGER = 8;
var ZONE_OXYGEN = 16;

// // Addon code (default: empty string)
var addonCode = "";

// == Advance User Preference Setting (End) ==

// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
var scriptVersion = GM_info.script.version;
var fbPlatform = false;
var hiFivePlatform = false;
var mhPlatform = false;
var mhMobilePlatform = false;
var secureConnection = false;
var lastDateRecorded = new Date();
var hornTime = 900;
var hornTimeDelay = 0;
var checkTimeDelay = 0;
var isKingReward = false;
var lastKingRewardSumTime;
var kingPauseTime;
var baitQuantity = -1;
var huntLocation;
var currentLocation;
var today = new Date();
var checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
today = undefined;
var hornRetryMax = 10;
var hornRetry = 0;
var nextActiveTime = 900;
var timerInterval = 2;
var armingQueue = [];
var dequeueingCTA = false;
var dequeueIntRunning = false;
var mouseList = [];
var eventLocation = "None";
var discharge = false;
var arming = false;
var best = 0;
var kingsRewardRetry = 0;

// element in page
var titleElement;
var nextHornTimeElement;
var checkTimeElement;
var kingTimeElement;
var lastKingRewardSumTimeElement;
var travelElement;
var hornButton = 'hornbutton';
var campButton = 'campbutton';
var header = 'header';
var hornReady = 'hornready';
var isNewUI = false;

// NOB vars
var NOBhasPuzzle;
var NOBtickerTimout;
var NOBtickerInterval;
var NOBtraps = []; // Stores ALL traps, bases, cheese etc available to user
var NOBhuntsLeft = 0; // Temp for huntFor();
var NOBpage = false;
var mapRequestFailed = false;
var clockTicking = false;
var clockNeedOn = false;
var NOBadFree = false;
var LOCATION_TIMERS = [
    ['Seasonal Garden', {
        first: 1283616000,
        length: 288000,
        breakdown: [1, 1, 1, 1],
        name: ['Summer', 'Autumn', 'Winter', 'Spring'],
        color: ['Red', 'Orange', 'Blue', 'Green'],
        effective: ['tactical', 'shadow', 'hydro', 'physical']
    }],
    ['Balack\'s Cove', {
        first: 1294680060,
        length: 1200,
        breakdown: [48, 3, 2, 3],
        name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
        color: ['Green', 'Orange', 'Red', 'Orange']
    }],
    ['Forbidden Grove', {
        first: 1285704000,
        length: 14400,
        breakdown: [4, 1],
        name: ['Open', 'Closed'],
        color: ['Green', 'Red']
    }],
    ['Relic Hunter', {
        url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
    }],
    ['Toxic Spill', {
        url: 'http://horntracker.com/backend/new/toxic.php?functionCall=spill'
    }]
];
// NOB Message displayed interval
var nobMessageTTL = 30000;

// CNN KR SOLVER START
function FinalizePuzzleImageAnswer(answer) {
    if (debug) console.log("RUN FinalizePuzzleImageAnswer()");
    if (debug) console.log(answer);
    if (answer.length != 5) {
        //Get a new puzzle
        if (kingsRewardRetry > kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            alert('Max retry. Pls solve it manually.');
            return;
        } else {
            ++kingsRewardRetry;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            var tagName = document.getElementsByTagName("a");
            for (var i = 0; i < tagName.length; i++) {
                if (tagName[i].innerText == "Click here to get a new one!") {
                    //fireEvent(tagName[i], 'click');
                    return;
                }
            }
        }
    } else {
        //Submit answer
        var puzzleAns = document.getElementById("puzzle_answer");
        if (isNewUI) puzzleAns = document.getElementsByClassName("mousehuntPage-puzzle-form-code")[0];
        if (!puzzleAns) {
            console.debug("puzzleAns: " + puzzleAns);
            return;
        }
        puzzleAns.value = "";
        puzzleAns.value = answer;
        var puzzleSubmit = document.getElementById("puzzle_submit");
        if (isNewUI) puzzleSubmit = document.getElementsByClassName("mousehuntPage-puzzle-form-code-button")[0];
        if (!puzzleSubmit) {
            console.debug("puzzleSubmit: " + puzzleSubmit);
            return;
        }

        fireEvent(puzzleSubmit, 'click');
        kingsRewardRetry = 0;
        setStorage("KingsRewardRetry", kingsRewardRetry);
        var myFrame = document.getElementById('myFrame');
        if (myFrame)
            document.body.removeChild(myFrame);
        window.setTimeout(function () {
            CheckKRAnswerCorrectness();
        }, 5000);
    }
}

function receiveMessage(event) {
    console.debug("Event origin: " + event.origin);

    if (event.origin.indexOf("mhcdn") > -1 || event.origin.indexOf("mousehuntgame") > -1 || event.origin.indexOf("dropbox") > -1) {
        if (event.data.indexOf("~") > -1) {
            var result = event.data.substring(0, event.data.indexOf("~"));
            var processedImg = event.data.substring(event.data.indexOf("~") + 1, event.data.length);
            var now = new Date();
            var strKR = "KR-" + now.toLocaleString();
            strKR = strKR.replace(", ", "-");
            strKR = strKR.replace(" ", "-");
            strKR += "-" + result;
            setStorage(strKR, processedImg);
            FinalizePuzzleImageAnswer(result);
        }
    }
}

function CallKRSolver() {
    if (debug) console.log("RUN CallKRSolver()");
    var frame = document.createElement('iframe');
    frame.setAttribute("id", "myFrame");
    if (debugKR) frame.src = "https://photos-5.dropbox.com/t/2/AAB7HHtCknOfTpcuPoDmxCEfIMNFOL0J7b5ZL4IkEehmLw/12/36143186/jpeg/32x32/1/_/1/2/puzzleimage.jpeg/EJT1vBsYw7kvIAIoAg/ufyuSJabyENb5LSl7kn_zadHF20fPJ8cxi313enZ2Qs?size=640x480&size_mode=2";
    //frame.src = "https://photos-4.dropbox.com/t/2/AAArkp_yNcE-_gLkppu3xeeV2p-y0q0Ml0AhZ0RfCIlYpQ/12/127673959/png/32x32/1/_/1/2/download.png/EM-6pmIYjboGIAcoBw/VXDBwjXQ2NNK6ShussiKls1sCUQSTjvkn3wM5g4Jcro?size=640x480&size_mode=2";
    else {
        if (!isNewUI) {
            var img = document.getElementById('puzzleImage');
            frame.src = img.src;
        } else {
            var img = document.getElementsByClassName('mousehuntPage-puzzle-form-captcha-image')[0];
            frame.src = img.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        }
    }
    document.body.appendChild(frame);
}

function CheckKRAnswerCorrectness() {
    var pageMsg = document.getElementById('pagemessage');
    if (pageMsg && pageMsg.innerText.toLowerCase().indexOf("unable to claim reward") > -1) // KR answer not correct, re-run OCR
    {
        if (kingsRewardRetry > kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            alert('Max retry. Pls solve it manually.');
            return;
        }
        ++kingsRewardRetry;
        setStorage("KingsRewardRetry", kingsRewardRetry);
        CallKRSolver();
    }
    else
        window.setTimeout(function () {
            CheckKRAnswerCorrectness();
        }, 1000);
}

window.addEventListener("message", receiveMessage, false);
if (debugKR)
    CallKRSolver();
// CNN KR SOLVER END

// start executing script
if (debug) console.log('STARTING SCRIPT - ver: ' + scriptVersion);
if (window.top != window.self) {
    if (debug) console.log('In IFRAME - may cause firefox to error, location: ' + window.location.href);
    //return;
} else {
    if (debug) console.log('NOT IN IFRAME - will not work in fb MH');
}
exeScript();

function exeScript() {
    if (debug) console.log('RUN exeScript()');
    try {
        var titleElm = document.getElementById('titleElement');
        if (titleElm) {
            titleElm.parentNode.remove();
        }
    } catch (e) {
        if (debug) console.log('No past title elements found.');
    } finally {
        titleElm = null;
    }

    try {
        var time = document.getElementsByClassName('passive')[0].getElementsByClassName('journaldate')[0].innerHTML;
        time = time.substr(time.indexOf(':') + 1, 2);
        trapCheckTimeDiff = parseInt(time);
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
        time = null;
    } catch (e) {
        console.debug('Class element "passive" not found');
        trapCheckTimeDiff = getStorage('TrapCheckTimeOffset');
        if (trapCheckTimeDiff == null) {
            trapCheckTimeDiff = 0;
            setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
        }
    }

    try {
        // check the trap check setting first
        if (trapCheckTimeDiff == 60) {
            trapCheckTimeDiff = 0;
        } else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
            // invalid value, just disable the trap check
            enableTrapCheck = false;
        }

        if (showTimerInTitle) {
            // check if they are running in iFrame
            var contentElement, breakFrameDivElement;
            if (window.location.href.indexOf("apps.facebook.com/mousehunt/") != -1) {
                contentElement = document.getElementById('pagelet_canvas_content');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://www.mousehuntgame.com/canvas/'>run MouseHunt without iFrame (Facebook)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = undefined;
            } else if (window.location.href.indexOf("hi5.com/friend/games/MouseHunt") != -1) {
                contentElement = document.getElementById('apps-canvas-body');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = breakFrameDivElement = undefined;
            }
        }

        // check user running this script from where
        if (window.location.href.indexOf("mousehuntgame.com/canvas/") != -1) {
            // from facebook
            fbPlatform = true;
        } else if (window.location.href.indexOf("mousehuntgame.com") != -1) {
            // need to check if it is running in mobile version
            var version = getCookie("switch_to");
            if (version != null && version == "mobile") {
                // from mousehunt game mobile version
                mhMobilePlatform = true;
            } else {
                // from mousehunt game standard version
                mhPlatform = true;
            }
            version = undefined;
        } else if (window.location.href.indexOf("mousehunt.hi5.hitgrab.com") != -1) {
            // from hi5
            hiFivePlatform = true;
        }

        // check if user running in https secure connection, true/false
        secureConnection = (window.location.href.indexOf("https://") != -1);

        if (fbPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/canvas/" ||
                window.location.href == "http://www.mousehuntgame.com/canvas/#" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/#" ||
                window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/" ||
                window.location.href == "http://www.mousehuntgame.com/#" ||
                window.location.href == "http://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href == "https://www.mousehuntgame.com/" ||
                window.location.href == "https://www.mousehuntgame.com/#" ||
                window.location.href == "https://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href.indexOf("mousehuntgame.com/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhMobilePlatform) {
            // execute at all page of mobile version
            //if (true) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // embed a place where timer show
            embedTimer(false);
            //}
        } else if (hiFivePlatform) {
            if (window.location.href == "http://mousehunt.hi5.hitgrab.com/#" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?") != -1 ||
                window.location.href == "http://mousehunt.hi5.hitgrab.com/" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/turn.php") != -1 ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        }
    } catch (e) {
        if (debug) console.log('exeScript error - ' + e)
    }
}

function checkIntroContainer() {
    if (debug) console.log('RUN checkIntroContainer()');
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    } else {
        gotIntroContainerDiv = false;
    }

    try {
        return gotIntroContainerDiv;
    } finally {
        gotIntroContainerDiv = undefined;
    }
}

//// EMBEDING ENHANCED EDITION CODE
function eventLocationCheck() {
	checkDefaultBait();
    if (eventLocation != null || eventLocation != "")
        console.debug("Running " + eventLocation + " bot.");
    switch (eventLocation) {
        case 'Hunt For':
            huntFor();
            break;
        case 'Charge Egg 2016':
            checkCharge2016(12);
            break;
        case 'Charge Egg 2016(17)':
            checkCharge2016(17);
            break;
        case 'Charge Egg 2014':
            checkCharge(12);
            break;
        case 'Charge Egg 2014(17)':
            checkCharge(17);
            break;
        case 'Gnawnian Express(Empty)':
            gnawnianExpress(false);
            break;
        case 'Gnawnian Express(Full)':
            gnawnianExpress(true);
            break;
        case 'Burroughs Rift(Red)':
            BurroughRift(19, 20);
            break;
        case 'Burroughs Rift(Green)':
            BurroughRift(6, 18);
            break;
        case 'Burroughs Rift(Yellow)':
            BurroughRift(1, 5);
            break;
        case 'Halloween 2014':
            Halloween2014();
            break;
        case 'Halloween 2015':
            Halloween2015();
            break;
        case 'Winter 2015':
            Winter2015();
            break;
        case 'All LG Area':
            lgGeneral();
            break;
        case 'Sunken City':
            SunkenCity();
            break;
        case 'Zugzwang\'s Tower':
            ZTower();
            break;
        case 'Fiery Warpath':
            fieryWarpath();
            break;
        case 'Fiery Warpath Super':
            fieryWarpath(true);
            break;
        case 'Iceberg (Wax)':
            iceberg('wax');
            break;
        case 'Iceberg (Sticky)':
            iceberg('sticky');
            break;
        case 'Labyrinth':
            labyrinth();
            break;
        default:
            break;
    }
}

function checkDefaultBait() {
	// When current bait quantity less then this variable, change bait to defaultBait
	var currentBaitMinimum = 10;
	var defaultBait = ['Gouda','Brie','Swiss'];// Brie/Gouda/Swiss

	if (debug) console.log('checkDefaultBait');
	if (defaultBait && currentBaitMinimum && baitQuantity < currentBaitMinimum) {
		checkThenArm(null, 'bait', defaultBait[0]);
	}
}

function huntFor() {
    if (NOBhuntsLeft <= 0) {
        disarmTrap('bait');
    }
}

function iceberg(waxOrSticky) { // takes in string 'wax' or 'sticky'
    var location = getPageVariable('user.location');
    console.debug(location);
    if (location.indexOf('Iceberg') > -1) {
        var stage = document.getElementsByClassName('currentPhase')[0].textContent;
        var progress = parseInt(document.getElementsByClassName('user_progress')[0].textContent.replace(',', ''));
        console.debug('In ' + stage + ' at ' + progress + ' feets right now.');

        // Check if theres general
        if (progress == 300 || progress == 600 || progress == 1600 || progress == 1800) {
            console.debug('General encountered.');
            checkThenArm('best', 'base', bestPowerBase);
            checkThenArm(null, 'trinket', 'Super Power', wasteCharm);
            return;
        }

        var icebergCharm;
        if (waxOrSticky == 'sticky') {
            icebergCharm = ['Sticky', 'Wax'];
        } else {
            icebergCharm = ['Wax', 'Sticky'];
        }

        switch (stage) {
            case 'Treacherous Tunnels':
                // magnet base
                checkThenArm(null, 'base', 'Magnet Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Brutal Bulwark':
                // spiked base
                checkThenArm(null, 'base', 'Spiked Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Bombing Run':
                // Remote det base
                checkThenArm('best', 'base', ['Remote Detonator Base', 'Magnet Base']);
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'The Mad Depths':
                // Hearthstone base
                checkThenArm(null, 'base', 'Hearthstone Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Icewing\'s Lair':
            // Deep freeze base for the rest
            case 'Hidden Depths':
            case 'The Deep Lair':
                checkThenArm(null, 'base', 'Deep Freeze Base');
                var charmArmed = getPageVariable('user.trinket_name');
                if (charmArmed.indexOf('Wax') > -1 || charmArmed.indexOf('Sticky') > -1)
                    disarmTrap('trinket');
                break;
            default:
                break;
        }

        icebergCharm = null;
        stage = null;
    } else if (location.indexOf('Slushy Shoreline') > -1) {
        console.debug('Disarming cheese as wrong area now.');
        disarmTrap('bait');
    }
    location = null;
}

function ZTower() {
    var location = getPageVariable('user.location');
    console.debug(location);
    if (location.indexOf('Zugzwang\'s Tower') == -1 && location.indexOf('Seasonal Garden') == -1) {
        console.debug('Not in Zugzwang\'s Tower or Seasonal Garden.');
        return;
    }

    if (location.indexOf('Seasonal Garden') > -1) {
        checkThenArm(null, 'bait', 'Gouda');
        checkThenArm(null, 'trinket', 'Amplifier');
        checkThenArm('best', 'base', ['Seasonal', 'Fissure', 'Golden Tournament']);

        var season = nobCalculateOfflineTimers('seasonal');
        console.debug('It is ' + season + ' in Seasonal Gardens right now.');
        switch (season) {
            case 'Spring':
                checkThenArm('best', 'weapon', bestPhysical);
                checkThenArm('best', 'weapon', bestPhysicalBase);
                break;
            case 'Summer':
                checkThenArm('best', 'weapon', bestTactical);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Autumn':
                checkThenArm('best', 'weapon', bestShadow);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Winter':
                checkThenArm('best', 'weapon', bestHydro);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            default:
                break;
        }

        season = null;
        return;
    } else if (location.indexOf('Zugzwang\'s Tower') > -1) {
        var ztTriesLeft = 5;
        retrieveMouseList();
        var intervalZT = setInterval(
            function () {
                if (mouseList.length > 0) {
                    if (checkMouse("Chess Master")) {
                        //arm Uncharged Scholar Charm & Checkmate Cheese
                        checkThenArm(null, "trinket", "Uncharged Scholar");
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("King")) {
                        //arm Checkmate Cheese
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("Queen")) {
                        //arm another charm other than rook charm
                        checkThenArm(null, "trinket", "Super Power");
                        disarmTrap('trinket');
                    } else if (checkMouse("Rook")) {
                        //arm rook charm (if available)
                        checkThenArm(null, "trinket", "Rook Crumble");
                    } else if (checkMouse("Knight")) {
                        //arm Sphynx Wrath
                        checkThenArm(null, "weapon", "Sphynx Wrath");
                        checkThenArm('best', 'base', bestPowerBase);
                    }
                    clearInterval(intervalZT);
                    intervalZT = null;
                    mouseList = [];
                    return;
                } else {
                    if (debug) console.log("Count down to ZT bot give up: " + ztTriesLeft);
                    if (ztTriesLeft == 0) {
                        clearInterval(intervalZT);
                        intervalZT = null;
                        mouseList = [];
                        ztTriesLeft = null;
                    }
                    return;
                }
            }, 3000);
        return;
    }
}

function Halloween2014() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Haunted Terrortories") > -1) {
        var areaName = document.getElementsByClassName('halloween2014Hud-areaDetails-name')[0].innerHTML;
        var warning = document.getElementsByClassName('halloween2014Hud-areaDetails-warning active').length;
        var isWarning = (warning > 0);
        console.debug('Current Area Name: ' + areaName + " Warning: " + isWarning);
        if (isWarning) {
            var trickContainer = document.getElementsByClassName('halloween2014Hud-bait trick_cheese clear-block')[0];
            var treatContainer = document.getElementsByClassName('halloween2014Hud-bait treat_cheese clear-block')[0];
            if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
                console.debug('Currently armed: Trick cheese, Going to arm Treat cheese');
                fireEvent(treatContainer.children[2], 'click');
            } else {
                console.debug('Currently armed: Treat cheese, Going to arm Trick cheese');
                fireEvent(trickContainer.children[2], 'click');
            }
        }
    }
}

function Halloween2015() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Haunted Terrortories") > -1) {
        var areaName = document.getElementsByClassName('halloweenHud-areaDetails-name')[0].innerHTML;
        var warning = document.getElementsByClassName('halloweenHud-areaDetails-warning active').length;
        var isWarning = (warning > 0);
        console.debug('Current Area Name: ' + areaName + " Warning: " + isWarning);
        if (isWarning) {
            var trickContainer = document.getElementsByClassName('halloweenHud-bait trick_cheese clear-block')[0];
            var treatContainer = document.getElementsByClassName('halloweenHud-bait treat_cheese clear-block')[0];
            if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
                console.debug('Currently armed: Trick cheese, Going to arm Treat cheese');
                fireEvent(treatContainer.children[2], 'click');
            } else {
                console.debug('Currently armed: Treat cheese, Going to arm Trick cheese');
                fireEvent(trickContainer.children[2], 'click');
            }
        }
    }
}

function Winter2015() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Extreme Toboggan Challenge") > -1) {
        var inRun = (document.getElementById('hudLocationContent').firstChild.className.indexOf("on_course") > -1);
        if (inRun) {
            checkThenArm('best', 'bait', ["Arctic Asiago", "Gingerbread"]);
        } else {
            checkThenArm(null, 'bait', 'Gouda', 'disarm');
        }
    }
}

function BurroughRift(minMist, maxMist) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Burroughs Rift") > -1) {
        //Tier 0: 0 Mist Canisters
        //Tier 1/Yellow: 1-5 Mist Canisters
        //Tier 2/Green: 6-18 Mist Canisters
        //Tier 3/Red: 19-20 Mist Canisters

        var currentMistQuantity = parseInt(document.getElementsByClassName('mistQuantity')[0].textContent);
        var isMisting = getPageVariable('user.quests.QuestRiftBurroughs.is_misting');
        var mistButton = document.getElementsByClassName('mistButton')[0];
        console.debug('Current Mist Quantity: ' + currentMistQuantity);
        console.debug('Is Misting: ' + isMisting);
        console.debug('Min Mist: ' + minMist + " Max Mist: " + maxMist);
        if (currentMistQuantity >= maxMist && isMisting == 'true') {
            console.debug('Stop mist...');
            fireEvent(mistButton, 'click');
        } else if (currentMistQuantity <= minMist && isMisting == 'false') {
            console.debug('Start mist...');
            fireEvent(mistButton, 'click');
        }
        return;
    }
}

function lgGeneral() {
    var location = getPageVariable('user.location');
    console.debug('Current Location: ' + location);
    switch (location) {
        case 'Living Garden':
            livingGarden();
            break;
        case 'Lost City':
            lostCity();
            break;
        case 'Sand Dunes':
            sandDunes();
            break;
        case 'Twisted Garden':
            twistedGarden();
            break;
        case 'Cursed City':
            cursedCity();
            break;
        case 'Sand Crypts':
            sandCrypts();
            break;
        default:
            break;
    }
}

function fieryWarpath(superCharm) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Fiery Warpath") > -1) {
        var wave = document.getElementsByClassName("sandwarpathhud")[0].className;
        wave = parseInt(wave.charAt(wave.indexOf("wave_") + 5));
        var streak = parseInt(document.getElementsByClassName("streak_quantity")[0].textContent);
        //var streakMouse;
        var retreating = false;
        if (document.getElementsByClassName('desert_general')[0]) {
            retreating = ((document.getElementsByClassName('desert_general')[0].className.indexOf('inactive') > -1) && (document.getElementsByClassName('desert_supply')[0].className.indexOf('inactive')));
        }

        console.log("Current Wave: " + wave + ", with " + streak + " streak(s) in " + ", mice retreating? " + retreating);

        if (retreating) {
            checkThenArm('best', 'weapon', bestPhysical);
            checkThenArm('best', 'base', bestPhysicalBase);
            checkThenArm('best', 'trinket', wasteCharm);
            return;
        }

        var wave4PhysicalTrap = ['Warden Slayer', 'Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel'];

        var commanderCharm = ["Super Warpath Commander", "Warpath Commander"];
        var warriorCharm = ["Super Warpath Warrior", "Warpath Warrior"];
        var scoutCharm = ["Super Warpath Scout", "Warpath Scout"];
        var archerCharm = ["Super Warpath Archer", "Warpath Archer"];
        var cavalryCharm = ["Super Warpath Cavalry", "Warpath Cavalry"];
        var mageCharm = ["Super Warpath Mage", "Warpath Mage"];
        var wardenCharm = wasteCharm;
        var bossCharm = ["Monger", "Super Power"];

        if (!superCharm) {
            commanderCharm = ["Warpath Commander"];
            warriorCharm = ["Warpath Warrior"];
            scoutCharm = ["Warpath Scout"];
            archerCharm = ["Warpath Archer"];
            cavalryCharm = ["Warpath Cavalry"];
            mageCharm = ["Warpath Mage"];
        }

        var population = document.getElementsByClassName("population");
        var mouseGroup;
        for (var i = 0; i < population.length; i++) {
            // Check for high streak
            if (streak > 6) {
                checkThenArm('best', 'weapon', bestPhysical);
                checkThenArm('best', 'base', bestPhysicalBase);
                checkThenArm('best', 'trinket', commanderCharm, 'disarm');
                checkThenArm(null, 'bait', 'SUPER', 'Gouda');
                break;
            }

            //checkThenArm(null, 'bait', 'Gouda');
            // Finds first non 0 mouse group
            if (parseInt(population[i].textContent) > 0) {
                mouseGroup = population[i].id;
                if (mouseGroup.indexOf("warrior") > -1) {
                    checkThenArm('best', 'trinket', warriorCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("scout") > -1) {
                    checkThenArm('best', 'trinket', scoutCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("archer") > -1) {
                    checkThenArm('best', 'trinket', archerCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("cavalry") > -1) {
                    checkThenArm('best', 'trinket', cavalryCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestTactical);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf("mage") > -1) {
                    checkThenArm('best', 'trinket', mageCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestHydro);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf('artillery') > -1) {
                    checkThenArm('best', 'trinket', wasteCharm);
                    checkThenArm('best', 'weapon', bestArcane);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf("elite_gaurd") > -1) {
                    // wardens: desert_elite_gaurd
                    checkThenArm('best', 'weapon', wave4PhysicalTrap);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    checkThenArm('best', 'trinket', wardenCharm, wasteCharm);
                } else if (mouseGroup.indexOf("boss") > -1) {
                    // warmonger: desert_boss
                    checkThenArm('best', 'weapon', wave4PhysicalTrap);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    checkThenArm('best', 'trinket', bossCharm, 'disarm');
                } else {
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    disarmTrap('trinket');
                }
                break;
            }
        }

        streak = null;
        wave = null;
    }
    currentLocation = null;
}

function SunkenCity() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Sunken City") > -1) {
        var zone = document.getElementsByClassName('zoneName')[0].textContent;
        console.debug('Current Zone: ' + zone);
        switch (zone) {
            case 'Sand Dollar Sea Bar':
            case 'Pearl Patch':
            case 'Sunken Treasure':
            case 'Monster Trench':
            case 'Lair of the Ancients':
            case 'Magma Flow':
                checkThenArm('best', 'trinket', bestAnchor);
                checkThenArm(null, 'bait', 'SUPER');
                break;
            case 'Deep Oxygen Stream':
            case 'Oxygen Stream':
                checkThenArm('best', 'trinket', bestOxygen);
                checkThenArm(null, 'bait', 'SUPER');
                break;
            case 'Shallow Shoals':
            case 'Sea Floor':
            case 'Murky Depths':
                checkThenArm(null, 'trinket', 'Treasure Trawling');
                checkThenArm(null, 'bait', 'Gouda');
                break;
            case 'Sunken City':
                checkThenArm(null, 'trinket', 'Oxygen Burst');
                checkThenArm(null, 'bait', 'Fishy Fromage');
                break;
            default:
                checkThenArm('best', 'trinket', wasteCharm);
                checkThenArm(null, 'bait', 'Gouda');
                break;
        }
    }
}

function livingGarden() {
    var pourEstimate = document.getElementsByClassName('pourEstimate')[0];
    if (pourEstimate.textContent != "") {
        // Not pouring
        var estimateHunt = parseInt(pourEstimate.textContent);
        console.debug('Estimate Hunt: ' + estimateHunt);
        if (estimateHunt >= 35) {
            console.debug('Going to click Pour...');
            var pourButton = document.getElementsByClassName('pour')[0];
            fireEvent(pourButton, 'click');
            var confirmButton = document.getElementsByClassName('confirm button')[0];
            fireEvent(confirmButton, 'click');
            if (getPageVariable('user.trinket_name').indexOf('Sponge') > -1) {
                console.debug('Going to disarm sponge charm');
                disarmTrap('trinket');
            }
        } else if (estimateHunt == 34) {
            console.debug('Switching to spong charm.');
            checkThenArm('best', 'trinket', 'Sponge');
        } else {
            checkThenArm('best', 'trinket', spongeCharm);
        }
    } else {
        // Pouring
        if (getPageVariable('user.trinket_name').indexOf('Sponge') > -1) {
            disarmTrap('trinket');
        }
    }
    return;
}

function lostCity() {
    var isCursed = (document.getElementsByClassName('stateBlessed hidden').length > 0);
    console.debug('Cursed = ' + isCursed);

    //disarm searcher charm when cursed is lifted
    if (!isCursed) {
        if (getPageVariable('user.trinket_name').indexOf('Searcher') > -1) {
            disarmTrap('trinket');
        }
    } else {
        checkThenArm(null, 'trinket', 'Searcher');
    }
    checkThenArm('best', 'weapon', bestArcane);
    checkThenArm(null, 'bait', 'Dewthief');
    return;
}

function sandDunes() {
    var hasStampede = getPageVariable('user.quests.QuestSandDunes.minigame.has_stampede');
    console.debug('Has Stampede = ' + hasStampede);

    //disarm grubling chow charm when there is no stampede
    if (hasStampede == 'false') {
        if (getPageVariable('user.trinket_name').indexOf('Chow') > -1) {
            disarmTrap('trinket');
        }
    } else {
        checkThenArm(null, 'trinket', 'Grubling Chow');
    }
    checkThenArm('best', 'weapon', bestShadow);
    checkThenArm(null, 'bait', 'Dewthief');
    return;
}

function twistedGarden() {
    var red = parseInt(document.getElementsByClassName('itemImage red')[0].textContent);
    var yellow = parseInt(document.getElementsByClassName('itemImage yellow')[0].textContent);
    var charmArmed = getPageVariable('user.trinket_name');
    var isPouring = (document.getElementsByClassName('pour')[0].textContent.indexOf('Poured') > -1);
    console.debug('Red: ' + red + ' Yellow: ' + yellow + ' Pouring: ' + isPouring);
    if (!isPouring && red < 10) {
        if (red <= 8) {
            checkThenArm('best', 'trinket', redSpongeCharm);
        } else {
            checkThenArm(null, 'trinket', 'Red Sponge');
        }
    } else if (!isPouring && red == 10 && yellow < 10) {
        if (yellow <= 8) {
            checkThenArm('best', 'trinket', yellowSpongeCharm);
        } else {
            checkThenArm(null, 'trinket', 'Yellow Sponge');
        }
    } else {
        if (charmArmed.indexOf('Red') > -1 || charmArmed.indexOf('Yellow') > -1) {
            disarmTrap('trinket');
        }
        // Pouring now
        if (!isPouring) {
            console.debug("Going to pour now...");
            fireEvent(document.getElementsByClassName('pour')[0], 'click');
            setTimeout(function () {
                fireEvent(document.getElementsByClassName('confirm')[0], 'click');
            }, 1000);
        }
    }
    checkThenArm('best', 'weapon', bestHydro);
    return;
}

function cursedCity() {
    var cursed = getPageVariable('user.quests.QuestLostCity.minigame.is_cursed');
    var curses = [];
    var charmArmed = getPageVariable('user.trinket_name');
    if (cursed == 'false') {
        if (charmArmed.indexOf('Bravery') > -1 || charmArmed.indexOf('Shine') > -1 || charmArmed.indexOf('Clarity') > -1) {
            disarmTrap('trinket');
        }
        //checkThenArm(null, "trinket", "Super Luck");
    } else {
        for (var i = 0; i < 3; ++i) {
            curses[i] = getPageVariable('user.quests.QuestLostCity.minigame.curses[' + i + '].active');
            if (curses[i] == 'true') {
                switch (i) {
                    case 0:
                        console.debug("Fear Active");
                        checkThenArm(null, "trinket", "Bravery");
                        break;
                    case 1:
                        console.debug("Darkness Active");
                        checkThenArm(null, "trinket", "Shine");
                        break;
                    case 2:
                        console.debug("Mist Active");
                        checkThenArm(null, "trinket", "Clarity");
                        break;
                    default:
                        break;
                }
                return;
            }
        }
    }
    checkThenArm('best', 'weapon', bestArcane);
    checkThenArm(null, 'bait', 'Graveblossom');
    return;
}

function sandCrypts() {
    var salt = parseInt(document.getElementsByClassName('salt_charms')[0].textContent);
    console.debug('Salted: ' + salt);
    if (salt >= maxSaltCharged) {
        checkThenArm(null, 'trinket', 'Grub Scent');
    } else {
        checkThenArm('best', 'trinket', bestSalt, 'disarm');
    }
    checkThenArm('best', 'weapon', bestShadow);
    checkThenArm(null, 'bait', 'Graveblossom');
    return;
}

function gnawnianExpress(load) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Gnawnian Express") > -1) {
        var onTrain = getPageVariable('user.quests.QuestTrainStation.on_train');
        var charmArmed = getPageVariable('user.trinket_name');
        var trapArmed = getPageVariable('user.weapon_name');
        if (onTrain == 'false' || onTrain == 0) {
            if (charmArmed.indexOf('Supply Schedule') > -1 || charmArmed.indexOf('Roof Rack') > -1 || charmArmed.indexOf('Greasy Glob') > -1 || charmArmed.indexOf('Door Guard') > -1 || charmArmed.indexOf('Dusty Coal') > -1 || charmArmed.indexOf('Black Powder') > -1 || charmArmed.indexOf('Magmatic Crystal') > -1)
                disarmTrap('trinket');

            if (trapArmed.indexOf('Supply Grabber') > -1 || trapArmed.indexOf('Bandit Deflector') > -1 || trapArmed.indexOf('Engine Doubler') > -1)
                checkThenArm('best', 'weapon', ['S.L.A.C. II', 'The Law Draw', 'S.L.A.C.']);
        } else {
            var phase = document.getElementsByClassName('phaseName')[0].textContent;
            phase = phase.substr(7, phase.length);
            console.debug('Current Active Train Phase: ' + phase);
            switch (phase) {
                case 'Supply Depot':
                    checkThenArm('best', 'weapon', supplyDepotTrap);
                    var supplyHoarder = parseInt(document.getElementsByClassName('supplyHoarderTab')[0].textContent.substr(0, 1));
                    if (supplyHoarder == 0) {
                        console.debug("Looking for supply hoarder");
                        checkThenArm(null, 'trinket', 'Supply Schedule');
                    } else {
                        console.debug("Supply hoarder is present. Disarming charm now...");
                        disarmTrap('trinket');
                    }
                    loadTrain('depot', load);
                    break;
                case 'Raider River':
                    checkThenArm('best', 'weapon', raiderRiverTrap);
                    var attacking = document.getElementsByClassName('attacked');
                    for (var i = 0; i < attacking.length; i++) {
                        if (attacking[i].tagName == 'DIV')
                            attacking = attacking[i].className.substr(0, attacking[i].className.indexOf(' '));
                    }
                    console.debug("Raiders are attacking " + attacking);
                    switch (attacking) {
                        case 'roof':
                            checkThenArm(null, 'trinket', 'Roof Rack', 'disarm');
                            break;
                        case 'door':
                            checkThenArm(null, 'trinket', 'Door Guard', 'disarm');
                            break;
                        case 'rails':
                            checkThenArm(null, 'trinket', 'Greasy Glob', 'disarm');
                            break;
                        default:
                            console.debug('Bot is confused, raiders are not attacking?');
                            disarmTrap('trinket');
                            break;
                    }
                    loadTrain('raider', load);
                    break;
                case 'Daredevil Canyon':
                    checkThenArm('best', 'weapon', daredevilCanyonTrap);
                    checkThenArm('best', 'trinket', coalCharm);
                    loadTrain('canyon', load);
                    break;
                default:
                    break;
            }
        }
    }
}

function retrieveMouseList() {
    fireEvent(document.getElementById('effectiveness'), 'click');
    var sec = 5;
    var intervalRML = setInterval(
        function () {
            if (document.getElementsByClassName('thumb').length > 0) {
                mouseList = [];
                var y = document.getElementsByClassName('thumb');
                for (var i = 0; i < y.length; ++i) {
                    mouseList.push(y[i].getAttribute('title'));
                }
                fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
                clearInterval(intervalRML);
                intervalRML = null;
                return;
            } else {
                --sec;
                if (sec <= 0) {
                    fireEvent(document.getElementById('effectiveness'), 'click');
                    sec = 5;
                }
            }
        }, 1000);
    return;
}

function labyrinth() {

}

function checkMouse(mouseName) {
    for (var i = 0; i < mouseList.length; ++i) {
        if (mouseList[i].indexOf(mouseName) > -1) {
            return true;
        }
        return false;
    }
}

// For easter event
function checkCharge2016(stopDischargeAt) {
    try {
        var charge = parseInt(document.getElementsByClassName("springHuntHUD-charge-quantity")[0].textContent);

        if (charge == 20) {
            setStorage("discharge", true.toString());
            checkThenArm(null, "trinket", "Eggstra");
        } else if (charge < 20 && charge > stopDischargeAt) {
            if (getStorage("discharge") == "true") {
                checkThenArm(null, "trinket", "Eggstra");
            } else {
                checkThenArm(null, "trinket", "Eggscavator");
            }
        } else if (charge <= stopDischargeAt) {
            setStorage("discharge", false.toString());
            checkThenArm(null, "trinket", "Eggscavator");
        }
        return;
    } catch (e) {
        return console.debug(e.message);
    }
}

function checkCharge(stopDischargeAt) {
    try {
        var charge = parseInt(document.getElementsByClassName("chargeQuantity")[0].textContent);

        if (charge == 20) {
            setStorage("discharge", true.toString());
            checkThenArm(null, "trinket", "Eggstra");
        } else if (charge < 20 && charge > stopDischargeAt) {
            if (getStorage("discharge") == "true") {
                checkThenArm(null, "trinket", "Eggstra");
            } else {
                checkThenArm(null, "trinket", "Eggscavator");
            }
        } else if (charge <= stopDischargeAt) {
            setStorage("discharge", false.toString());
            checkThenArm(null, "trinket", "Eggscavator");
        }
        return;
    } catch (e) {
        return console.debug(e.message);
    }
}

// For G Express
function loadTrain(location, load) {
    try {
        if (load) {
            switch (location) {
                case 'raider':
                    var repellents = parseInt(document.getElementsByClassName('mouseRepellent')[0].getElementsByClassName('quantity')[0].textContent);
                    if (repellents >= 10)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                case 'canyon':
                    var timeLeft = document.getElementsByClassName('phaseTimer')[0].textContent.substr(10);
                    // Fire only when time left is less than 16 mins :P (needs checking if works)
                    if (parseInt(timeLeft.substr(0, timeLeft.indexOf(':'))) == 0 && parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1)) <= 16)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                default:
                    fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
            }
        }
        return;
    } catch (e) {
        console.debug(e.message);
        return;
    }
}

function buildTrapList(afterBuilding, failedBuilding) {
    if (debug) console.log("running buildTrapList()");
    var returning;
    //clickTrapSelector(category);
    try {
        var userHash = getPageVariable("user.unique_hash");

        nobAjaxPost('/managers/ajax/users/gettrapcomponents.php', {
            uh: userHash
        }, function (data) {
            NOBtraps = data.components;
            if (debug) console.log(NOBtraps);
            nobStore(NOBtraps, 'traps');
            returning = true;
            afterBuilding();
        }, function (error) {
            console.log("BuildTrapList ajax error: " + error);
            returning = false;
            failedBuilding();
        });
    } catch (e) {
        console.log("BuildTrapList try error: " + e);
    } finally {
        //clickTrapSelector(category);
        return returning;
    }
}

var retryCheckThenArm = true;
function checkThenArm(sort, category, item, fail) {  //category = weapon/base/charm/trinket/bait
    // TODO: catch failed check then arm (ie, trap not found) (minor issue)
    // returns 'armed' if already armed
    // fail = [] If trap not found pass in array, to do a secondary arm

    if (item == 'disarm') {
        return disarmTrap(category);
    }

    if (item.constructor === Array) {
        sort = 'best';
    } else if (typeof item == "string") {
        sort = null;
    }

    if (category == "charm") {
        category = "trinket";
    }

    if (debug) console.log('RUN checkThenArm(' + item + ')');

    var i, j;
    var trapArmed;
    var tempName;
    var userVariable = getPageVariable("user." + category + "_name");
    if (userVariable === null || userVariable == undefined) userVariable = "";
    if (debug) console.log('Currently armed in userVar: ' + userVariable);
    var trapArmedOverride = false; // Stops trying to find whether trap has been armed. Assumes trap is not armed.

    if (sort == 'best') {
        for (i = 0; i < item.length; i++) {
            if (userVariable.indexOf(item[i]) == 0) {
                trapArmed = true;
                break;
            }
        }

        if (NOBtraps.length == 0) {
            if (debug) console.log("NOBtraps not built yet, trying to build now.");
            buildTrapList(function () {
                return checkThenArm(sort, category, item, fail);
            }, function () {
                if (debug) console.log("Failed to build trap list, giving up arming: " + item);
                return;
            });
        } else {
            if (debug) console.log("Running double check if better one is in inv. Finding ");
            if (debug) console.log(item);

            // Chunk of code try finds if a better trap is in inventory, if so sets trapArmed to false
            for (j = 0; j < item.length; j++) {
                for (i = 0; i < NOBtraps.length; i++) {
                    if (NOBtraps[i].classification == category && NOBtraps[i].name.indexOf(item[j]) == 0 && userVariable.indexOf(NOBtraps[i].name) != -1) {
                        // Case 1: The loop rolled back to the curr armed and double checked that it is the same as userVar
                        if (debug) console.log("No better traps were found.");
                        trapArmed = true;

                        i = NOBtraps.length + 1;
                        j = item.length + 1;
                    } else if (NOBtraps[i].classification == category && NOBtraps[i].name.indexOf(item[j]) == 0) {
                        // Case 2: The loop rolled onto an earlier (better) in the item array
                        if (debug) console.log("Found a better trap: " + NOBtraps[i].name + " as compared to " + item[j]);
                        trapArmed = false;
                        trapArmedOverride = true;

                        // breaking out of loops
                        i = NOBtraps.length + 1;
                        j = item.length + 1;
                    } else {
                        if (debug) console.log('Comparing: ' + NOBtraps[i].name + ' with ' + item[j]);
                    }
                }
            }

            if (trapArmed != true && trapArmed != false) {
                // Case 3: Rolled through whole array and 0 found.
                if (retryCheckThenArm) {
                    console.log("Error occured when finding a better trap in NOBtrap, giving up arming. User does not own the current trap armed? Retrying to fetch trap list.");
                    buildTrapList(function () {
                        retryCheckThenArm = false;
                        return checkThenArm(sort, category, item, fail);
                    }, function () {
                        console.log('Retry failed. Giving up now.');
                    });
                } else {
                    console.log('Retried, but failed again :(');
                }
                return 'failed';
            }

            if (debug) console.log("Double check done. Results: trapArmed=" + trapArmed + ", trapArmedOverride=" + trapArmedOverride);
        }
    } else {
        trapArmed = (userVariable.indexOf(item) == 0);
    }

    if (debug) console.log(item + " armed?: " + trapArmed);

    // TODO: Needs redo for beta UI (major issue)
    if (!nobTestBetaUI()) {
        var retryPageVariable = document.getElementById('hud_trapLabel').textContent;
        if (!trapArmedOverride && retryPageVariable == "Charm:" && category == "trinket") {
            var theCharmArmed = document.getElementById('hud_trapPower').textContent;
            if (sort == 'best') {
                for (i = 0; i < item.length; i++) {

                    if (item[i].length > 13) {
                        tempName = item[i].substring(0, 13);
                        tempName += "...";
                    } else {
                        tempName = item[i];
                    }

                    if (theCharmArmed == tempName) {
                        trapArmed = true;
                        break;
                    }
                }
            } else {
                //console.log(theCharmArmed + " + " + item);

                if (item.length > 13) {
                    tempName = item.substring(0, 13);
                    tempName += "...";
                } else {
                    tempName = item;
                }

                if (theCharmArmed == tempName) {
                    trapArmed = true;
                }
            }
            //trapArmed = true;
        } else if (!trapArmedOverride && (category == 'weapon' || category == 'base' || category == 'bait')) {
            var currBase = document.getElementById('hud_base').textContent;
            var currTrap = document.getElementById('hud_weapon').textContent;
            var currBait = document.getElementById('hud_baitName').textContent;

            if (sort == 'best') {
                for (i = 0; i < item.length; i++) {
                    //console.log(theCharmArmed + " + " + item[i]);

                    if (item[i].length > 13) {
                        tempName = item[i].substring(0, 13);
                        tempName += "...";
                    } else {
                        tempName = item[i];
                    }

                    switch (category) {
                        case 'weapon':
                            if (currTrap == tempName)
                                trapArmed = true;
                            break;
                        case 'base':
                            if (currBase == tempName)
                                trapArmed = true;
                            break;
                        case 'bait':
                            if (currBait == tempName)
                                trapArmed = true;
                            break;
                        default:
                            //traparmed = false;
                            break;
                    }
                }
            } else {
                if (item.length > 13) {
                    tempName = item.substring(0, 13);
                    tempName += "...";
                } else {
                    tempName = item;
                }


                switch (category) {
                    case 'weapon':
                        if (currTrap == tempName)
                            trapArmed = true;
                        break;
                    case 'base':
                        if (currBase == tempName)
                            trapArmed = true;
                        break;
                    case 'bait':
                        if (currBait == tempName)
                            trapArmed = true;
                        break;
                    default:
                        //traparmed = false;
                        break;
                }
            }
        }
    }
    trapArmedOverride = false;

    if (!trapArmed) {
        if (debug) console.log('Queueing ' + item + ' into armingQueue. (' + sort + category + trapArmed + ')');
        armingQueue.push([sort, category, item, trapArmed, fail]);
        if (!dequeueIntRunning) {
            var dequeueInterval = setInterval(function () {
                if (debug) console.log('In the queue(' + armingQueue.length + '): ');
                if (debug) console.log(armingQueue);

                if (!dequeueingCTA && armingQueue.length > 0) {
                    dequeueingCTA = true;
                    var tempQueueItem = armingQueue.pop();
                    dequeueCheckThenArm(tempQueueItem[0], tempQueueItem[1], tempQueueItem[2], tempQueueItem[3], tempQueueItem[4]);
                    tempQueueItem = [];
                } else if (armingQueue.length == 0) {
                    clearInterval(dequeueInterval);
                    dequeueIntRunning = false;
                }
            }, 2000);
        }
    } else {
        return 'armed';
    }
}

function dequeueCheckThenArm(sort, category, item, trapArmed, fail) {
    // Try to queue trap arming
    if (debug) console.log("Dequeuer: " + item + ", is armed? " + trapArmed);
    // Remove this item if its still in armingQueue array
    for (var i = 0; i < armingQueue.length; i++) {
        if (item == armingQueue[i]) {
            armingQueue.splice(i, 1);
        }
    }

    var intervalCTA = setInterval(function () {
        if (debug) console.log(item + " in CTA queue.");
        if (!arming) {
            console.debug("Queueing arming - " + item);
            clickThenArmTrapInterval(sort, category, item, fail);
            clearInterval(intervalCTA);
            intervalCTA = null;
            return;
        }
    }, 2000);
    return;
}

function clickThenArmTrapInterval(sort, trap, name, fail) //sort = power/luck/attraction
{
    if (debug) console.log("Pre processing queue item. Opening " + trap + " selector.");
    // Process trap arming queue
    setTimeout(function () {
        clickTrapSelector(trap);
        setTimeout(function () {
            var sec = 10;
            var intervalCTAGiveUp = 3;

            var intervalCTATI = setInterval(
                function () {
                    console.debug("Processing queue item: " + name);
                    var tryArming = armTrap(sort, name, trap);
                    if (tryArming == 'found') {
                        if (isNewUI)
                            clickTrapSelector(trap);
                        clearInterval(intervalCTATI);
                        arming = false;
                        dequeueingCTA = false;
                        intervalCTATI = null;
                        return;
                    } else if (tryArming == 'not found') {
                        clickTrapSelector(trap);
                        if (fail == 'disarm') {
                            disarmTrap(trap);
                        } else if (fail == null || fail == undefined) {
                            //Add something when failover was not built?
                            console.debug('Trap not found, and there were no failover for this setup for now.');
                        } else if (fail.length > 0) {
                            checkThenArm(sort, trap, fail);
                        }

                        clearInterval(intervalCTATI);
                        arming = false;
                        dequeueingCTA = false;
                        intervalCTATI = null;
                        return;
                    } else {
                        // Error when try arming bugs out, retry clickTrapSelector
                        if (debug) console.log("Try arming has bugged out.");
                        --sec;

                        if (sec <= 0) {
                            if (debug) console.log("Try arming has given up.");
                            clickTrapSelector(trap);
                            sec = 10;
                            intervalCTAGiveUp--;
                        }

                        if (intervalCTAGiveUp == 0) {
                            clearInterval(intervalCTATI);
                            arming = false;
                            dequeueingCTA = false;
                            intervalCTATI = null;
                            return;
                        }
                    }
                }, 1000);
        }, 2500);
    }, 500);
}

// name = Brie/Gouda/Swiss (brie = wrong)
function armTrap(sort, name, trap) {
    if (name == 'disarm')
        disarmTrap(trap);

    if (sort == 'best') {
        var nameArray = name;
        name = name[0];
    }

    var nameElement;
    if (isNewUI) {
        var allTraps = document.getElementsByClassName('passedFilters')[0].children;

        if (allTraps.length > 0) {
            console.debug('Trying to arm ' + name);
            for (var i = 0; i < allTraps.length; i++) {
                nameElement = allTraps[i].getElementsByClassName('campPage-trap-itemBrowser-item-name')[0].textContent;
                if (nameElement.indexOf(name) == 0) {
                    fireEvent(allTraps[i].getElementsByClassName('campPage-trap-itemBrowser-item-armButton')[0], 'click');
                    console.debug(name + ' armed');
                    return 'found';
                }
            }
            console.debug(name + " not found");
            if (sort == 'best') {
                nameArray.shift();
                if (nameArray[0] == 'disarm') {
                    disarmTrap(trap);
                } else if (nameArray.length > 0) {
                    if (debug) console.debug(nameArray);
                    return armTrap(sort, nameArray, trap);
                } else {
                    console.debug('No traps found');
                    return 'not found';
                }
            } else {
                return 'not found';
            }
        }
    } else {
        var tagGroupElement = document.getElementsByClassName('tagGroup');
        var tagElement;

        if (tagGroupElement.length > 0) {
            console.debug('Trying to arm ' + name);
            for (var i = 0; i < tagGroupElement.length; ++i) {
                tagElement = tagGroupElement[i].getElementsByTagName('a');
                for (var j = 0; j < tagElement.length; ++j) {
                    nameElement = tagElement[j].getElementsByClassName('name')[0].textContent;
                    if (nameElement.indexOf(name) == 0) {
                        fireEvent(tagElement[j], 'click');
                        console.debug(name + ' armed');
                        return 'found';
                    }
                }
            }
            console.debug(name + " not found");
            if (sort == 'best') {
                nameArray.shift();
                if (nameArray[0] == 'disarm') {
                    disarmTrap(trap);
                } else if (nameArray.length > 0) {
                    if (debug) console.debug(nameArray);
                    return armTrap(sort, nameArray, trap);
                } else {
                    console.debug('No traps found');
                    return 'not found';
                }
            } else {
                return 'not found';
            }
        }
    }
    return 'error';
}

function clickTrapSelector(strSelect) //strSelect = weapon/base/charm/trinket/bait
{
    if (strSelect == "charm") strSelect = "trinket";
    if (isNewUI) {
        fireEvent(document.getElementsByClassName('campPage-trap-armedItem ' + strSelect)[0], 'click');
    } else {
        if (strSelect == "base") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[0], 'click');
        } else if (strSelect == "weapon") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[1], 'click');
        } else if (strSelect == "charm" || strSelect == "trinket") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[2], 'click');
        } else if (strSelect == "bait") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[3], 'click');
        } else {
            return (console.debug("Invalid trapSelector"));
        }
    }
    arming = true;
    return (console.debug("Trap selector: " + strSelect + " clicked"));
}

function disarmTrap(trapSelector) {
    if (debug) console.log('disarmTrap(' + trapSelector + ')');
    clickTrapSelector(trapSelector);
    var x;
    var intervalDT = setInterval(
        function () {
            x = document.getElementsByClassName(trapSelector + ' canDisarm');
            if (x.length > 0) {
                for (var i = 0; i < x.length; ++i) {
                    if (isNewUI) {
                        x[i] = x[i].getElementsByClassName('campPage-trap-itemBrowser-item-armButton')[0];
                        if (x[i].textContent == 'Disarm') {
                            fireEvent(x[i], 'click');
                            clearInterval(intervalDT);
                            intervalDT = null;
                            return (console.debug('Disarmed ' + trapSelector));
                        }
                    } else {
                        if (x[i].getAttribute('title').indexOf('Click to disarm') > -1) {
                            fireEvent(x[i], 'click');
                            clearInterval(intervalDT);
                            intervalDT = null;
                            return (console.debug('Disarmed ' + trapSelector));
                        }
                    }
                }

            }
        }, 1000);
    return;
}

//// END EMBED

function retrieveDataFirst() {
    if (debug) console.log('RUN retrieveDataFirst()');
    try {
		currentDelayMax();
        var gotHornTime = false;
        var gotPuzzle = false;
        var gotBaitQuantity = false;
        var retrieveSuccess = false;

        var scriptElementList = document.getElementsByTagName('script');
        if (scriptElementList) {
            var i;
            for (i = 0; i < scriptElementList.length; ++i) {
                var scriptString = scriptElementList[i].innerHTML;

                // get next horn time
                var hornTimeStartIndex = scriptString.indexOf("next_activeturn_seconds");
                if (hornTimeStartIndex >= 0) {
                    var nextActiveTime = 900;
                    hornTimeStartIndex += 25;
                    var hornTimeEndIndex = scriptString.indexOf(",", hornTimeStartIndex);
                    var hornTimerString = scriptString.substring(hornTimeStartIndex, hornTimeEndIndex);
                    nextActiveTime = parseInt(hornTimerString);

                    hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

                    if (!aggressiveMode) {
                        // calculation base on the js in Mousehunt
                        var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);

                        // need to found out the mousehunt provided timer interval to determine the additional delay
                        var timerIntervalStartIndex = scriptString.indexOf("hud.timer_interval");
                        if (timerIntervalStartIndex >= 0) {
                            timerIntervalStartIndex += 21;
                            var timerIntervalEndIndex = scriptString.indexOf(";", timerIntervalStartIndex);
                            var timerIntervalString = scriptString.substring(timerIntervalStartIndex, timerIntervalEndIndex);
                            var timerInterval = parseInt(timerIntervalString);

                            // calculation base on the js in Mousehunt
                            if (timerInterval == 1) {
                                additionalDelayTime = 2;
                            }

                            timerIntervalStartIndex = undefined;
                            timerIntervalEndIndex = undefined;
                            timerIntervalString = undefined;
                            timerInterval = undefined;
                        }

                        // safety mode, include extra delay like time in horn image appear
                        //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                        hornTime = nextActiveTime + hornTimeDelay;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();

                        additionalDelayTime = undefined;
                    } else {
                        // aggressive mode, no extra delay like time in horn image appear
                        hornTime = nextActiveTime;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();
                    }

                    gotHornTime = true;

                    hornTimeStartIndex = undefined;
                    hornTimeEndIndex = undefined;
                    hornTimerString = undefined;
                    nextActiveTime = undefined;
                }

                // get is king's reward or not
                var hasPuzzleStartIndex = scriptString.indexOf("has_puzzle");
                if (hasPuzzleStartIndex >= 0) {
                    hasPuzzleStartIndex += 12;
                    var hasPuzzleEndIndex = scriptString.indexOf(",", hasPuzzleStartIndex);
                    var hasPuzzleString = scriptString.substring(hasPuzzleStartIndex, hasPuzzleEndIndex);
                    isKingReward = (hasPuzzleString != 'false');

                    gotPuzzle = true;

                    hasPuzzleStartIndex = undefined;
                    hasPuzzleEndIndex = undefined;
                    hasPuzzleString = undefined;
                }

                // get cheese quantity
                var baitQuantityStartIndex = scriptString.indexOf("bait_quantity");
                if (baitQuantityStartIndex >= 0) {
                    baitQuantityStartIndex += 15;
                    var baitQuantityEndIndex = scriptString.indexOf(",", baitQuantityStartIndex);
                    var baitQuantityString = scriptString.substring(baitQuantityStartIndex, baitQuantityEndIndex);
                    baitQuantity = parseInt(baitQuantityString);

                    gotBaitQuantity = true;

                    baitQuantityStartIndex = undefined;
                    baitQuantityEndIndex = undefined;
                    baitQuantityString = undefined;
                }

                var locationStartIndex;
                var locationEndIndex;
                locationStartIndex = scriptString.indexOf("location\":\"");
                if (locationStartIndex >= 0) {
                    locationStartIndex += 11;
                    locationEndIndex = scriptString.indexOf("\"", locationStartIndex);
                    var locationString = scriptString.substring(locationStartIndex, locationEndIndex);
                    currentLocation = locationString;

                    locationStartIndex = undefined;
                    locationEndIndex = undefined;
                    locationString = undefined;
                }

                scriptString = undefined;
            }
            i = undefined;
        }
        scriptElementList = undefined;

        if (gotHornTime && gotPuzzle && gotBaitQuantity) {
            // get trap check time
            if (enableTrapCheck) {
                var today = new Date();
                checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
                checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
                checkTime += checkTimeDelay;
                today = undefined;
            }

            // get last location
            var huntLocationCookie = getStorage("huntLocation");
            if (huntLocationCookie == undefined || huntLocationCookie == null) {
                huntLocation = currentLocation;
                setStorage("huntLocation", currentLocation);
            } else {
                huntLocation = huntLocationCookie;
                setStorage("huntLocation", huntLocation);
            }
            huntLocationCookie = undefined;

            // get last king reward time
            var lastKingRewardDate = getStorage("lastKingRewardDate");
            if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
                lastKingRewardSumTime = -1;
            } else {
                var lastDate = new Date(lastKingRewardDate);
                lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                lastDate = undefined;
            }
            lastKingRewardDate = undefined;

            retrieveSuccess = true;
        } else {
            retrieveSuccess = false;
        }

        // clean up
        gotHornTime = undefined;
        gotPuzzle = undefined;
        gotBaitQuantity = undefined;
        return retrieveSuccess;
    } catch (e) {
        console.log('retrieveDataFirst ERROR - ' + e);
    } finally {
        retrieveSuccess = undefined;
    }
}

function currentDelayMax() {
	// hornTimeDelayMax changed with current time
	if (new Date().getHours() < 20) {
		hornTimeDelayMax = 120;
	} else {
		hornTimeDelayMax = 360;
	}
}

function retrieveData() {
    if (debug) console.log("Run retrieveData()");
    try {
		currentDelayMax();

        var browser = browserDetection();

        // get next horn time
        if (browser == "firefox") {
            nextActiveTime = unsafeWindow.user.next_activeturn_seconds;
            isKingReward = unsafeWindow.user.has_puzzle;
            baitQuantity = unsafeWindow.user.bait_quantity;
            currentLocation = unsafeWindow.user.location;
            NOBhasPuzzle = unsafeWindow.user.has_puzzle;
        } else if (browser == "opera") {
            nextActiveTime = user.next_activeturn_seconds;
            isKingReward = user.has_puzzle;
            baitQuantity = user.bait_quantity;
            currentLocation = user.location;
        } else if (browser == "chrome") {
            nextActiveTime = parseInt(getPageVariableForChrome("user.next_activeturn_seconds"));
            isKingReward = (getPageVariableForChrome("user.has_puzzle").toString() != "false");
            baitQuantity = parseInt(getPageVariableForChrome("user.bait_quantity"));
            currentLocation = getPageVariableForChrome("user.location");
            NOBhasPuzzle = user.has_puzzle;
        } else {
            window.setTimeout(function () {
                reloadWithMessage("Browser not supported. Reloading...", false);
            }, 60000);
        }

        browser = undefined;

        if (nextActiveTime == "" || isNaN(nextActiveTime)) {
            // fail to retrieve data, might be due to slow network

            // reload the page to see it fix the problem
            window.setTimeout(function () {
                reloadWithMessage("Fail to retrieve data. Reloading...", false);
            }, 5000);
        } else {
            // got the timer right!

            // calculate the delay
            hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

            if (!aggressiveMode) {
                // calculation base on the js in Mousehunt
                var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
                if (timerInterval != "" && !isNaN(timerInterval) && timerInterval == 1) {
                    additionalDelayTime = 2;
                }

                // safety mode, include extra delay like time in horn image appear
                //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                hornTime = nextActiveTime + hornTimeDelay;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();

                additionalDelayTime = undefined;
            } else {
                // aggressive mode, no extra delay like time in horn image appear
                hornTime = nextActiveTime;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();
            }
        }

        // get trap check time
        if (enableTrapCheck) {
            var today = new Date();
            checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
            checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
            checkTime += checkTimeDelay;
            today = undefined;
        }
    } catch (e) {
        console.log("retrieveData() ERROR - " + e);
    }
}

function checkJournalDate() {
	debug ? console.log('checkJournalDate') : void(0);
    var reload = false;

    var journalDateDiv = document.getElementsByClassName('journaldate');
    if (journalDateDiv) {
        var journalDateStr = journalDateDiv[0].innerHTML.toString();
        var midIndex = journalDateStr.indexOf(":", 0);
        var spaceIndex = journalDateStr.indexOf(" ", midIndex);

        if (midIndex >= 1) {
            var hrStr = journalDateStr.substring(0, midIndex);
            var minStr = journalDateStr.substring(midIndex + 1, midIndex + 3);
            var hourSysStr = journalDateStr.substring(spaceIndex + 1, spaceIndex + 3);

            var nowDate = new Date();
            var lastHuntDate = new Date();
            if (hourSysStr == "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            } else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
            hrStr = undefined;
            minStr = undefined;
            nowDate = undefined;
            lastHuntDate = undefined;
        } else {
            reload = true;
        }

        journalDateStr = undefined;
        midIndex = undefined;
        spaceIndex = undefined;
    }
    journalDateDiv = undefined;

    if (reload) {
        reloadWithMessage("Timer error. Try reload to fix.", true);
    }

    try {
        return (reload);
    } finally {
        reload = undefined;
    }
}

function action() {
    if (debug) console.log("Run action()");
    try {
        if (isKingReward) {
            kingRewardAction();
            notifyMe('KR NOW - ' + getPageVariable('user.username'), 'http://3.bp.blogspot.com/_O2yZIhpq9E8/TBoAMw0fMNI/AAAAAAAAAxo/1ytaIxQQz4o/s1600/Subliminal+Message.JPG', "Kings Reward NOW");
        } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
            // update timer
            displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");

            if (fbPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (hiFivePlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (mhPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            }

            displayKingRewardSumTime(null);

            // pause script
        } else if (baitQuantity == 0) {
            // update timer
            displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
            displayLocation(huntLocation);
            displayKingRewardSumTime(null);

            // Notify no more cheese
            noCheeseAction();

            // pause the script
        } else {
            // update location
            displayLocation(huntLocation);

            var isHornSounding = false;

            // check if the horn image is visible
            nobTestBetaUI();
            var headerElement = document.getElementById(header);
            if (headerElement) {
                if (isNewUI) {
                    headerElement = headerElement.firstChild;
                }
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // if the horn image is visible, why do we need to wait any more, sound the horn!
                    soundHorn();

                    // make sure the timer don't run twice!
                    isHornSounding = true;
                }
                headerStatus = undefined;
            }
            headerElement = undefined;

            if (isHornSounding == false) {
                // start timer
                window.setTimeout(function () {
                    countdownTimer()
                }, timerRefreshInterval * 1000);
            }

            isHornSounding = undefined;
        }
        if (!isKingReward) {
            window.setTimeout(function () {
                eventLocationCheck();
                runAddonCode();
            }, 1000);
        }
    } catch (e) {
        console.log("action() ERROR - " + e);
    }
}

function countdownTimer() {
    if (isKingReward) {
        // update timer
        displayTimer("King's Reward!", "King's Reward!", "King's Reward");
        displayKingRewardSumTime("Now");

        // record last king's reward time
        var nowDate = new Date();
        setStorage("lastKingRewardDate", nowDate.toString());
        nowDate = undefined;
        lastKingRewardSumTime = 0;

        // reload the page so that the sound can be play
        // simulate mouse click on the camp button
        fireEvent(document.getElementsByClassName(campButton)[0].firstChild, 'click');

        // reload the page if click on camp button fail
        window.setTimeout(function () {
            reloadWithMessage("Fail to click on camp button. Reloading...", false);
        }, 5000);
    } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
        if (fbPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (hiFivePlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (mhPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }
        displayKingRewardSumTime(null);

        // pause script
    } else if (baitQuantity == 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    } else {
        var dateNow = new Date();
        var intervalTime = timeElapsed(lastDateRecorded, dateNow);
        lastDateRecorded = undefined;
        lastDateRecorded = dateNow;
        dateNow = undefined;

        if (enableTrapCheck) {
            // update time
            hornTime -= intervalTime;
            checkTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        } else {
            // update time
            hornTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        }

        intervalTime = undefined;

        if (hornTime <= 0) {
            // blow the horn!
            soundHorn();
        } else if (enableTrapCheck && checkTime <= 0) {
            // trap check!
            trapCheck();
        } else {
            if (enableTrapCheck) {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                } else {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                }
            } else {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        "-");

                    // check if user manaually sounded the horn
                    var scriptNode = document.getElementById("scriptNode");
                    if (scriptNode) {
                        var isHornSounded = scriptNode.getAttribute("soundedHornAtt");
                        if (isHornSounded == "true") {
                            // sound horn function do the rest
                            soundHorn();

                            // stop loopping
                            return;
                        }
                        isHornSounded = undefined;
                    }
                    scriptNode = undefined;
                } else {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        "-");

                    // agressive mode should sound the horn whenever it is possible to do so.
                    var headerElement = document.getElementById(header);
                    if (headerElement) {
                        if (isNewUI)
                            headerElement = headerElement.firstChild;
                        // the horn image appear before the timer end
                        if (headerElement.getAttribute('class').indexOf(hornReady) != -1) {
                            // who care, blow the horn first!
                            soundHorn();

                            headerElement = undefined;

                            // skip all the code below
                            return;
                        }
                    }
                    headerElement = undefined;
                }
            }

            // set king reward sum time
            displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

            window.setTimeout(function () {
                (countdownTimer)()
            }, timerRefreshInterval * 1000);
        }
    }
}

function reloadPage(soundHorn) {
    // reload the page
    if (fbPlatform) {
        // for Facebook only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/canvas/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/canvas/";
            }
        }
    } else if (hiFivePlatform) {
        // for Hi5 only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/";
            }
        }
    } else if (mhPlatform) {
        // for mousehunt game only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/";
            }
        }
    }

    soundHorn = undefined;
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    setTimeout(function () {
        reloadPage(soundHorn)
    }, 1000);

    msg = undefined;
    soundHorn = undefined;
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
    try {
        if (showTimerInPage) {
            var headerElement;
            if (fbPlatform || hiFivePlatform || mhPlatform) {
                headerElement = document.getElementById('noscript');
            } else if (mhMobilePlatform) {
                headerElement = document.getElementById('mobileHorn');
            }

            if (headerElement) {
                var timerDivElement = document.createElement('div');

                //var hr1Element = document.createElement('hr');
                //timerDivElement.appendChild(hr1Element);
                //hr1Element = null;

                // show bot title and version
                var titleElement = document.createElement('div');
                titleElement.setAttribute('id', 'titleElement');
                if (targetPage && aggressiveMode) {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6514-mousehunt-autobot-enhanced-revamp\" target=\"_blank\">MouseHunt AutoBot ENHANCED + REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b> - <font color='red'>Aggressive Mode</font>";
                } else {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6514-mousehunt-autobot-enhanced-revamp\" target=\"_blank\">MouseHunt AutoBot ENHANCED + REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b>";
                }
                timerDivElement.appendChild(titleElement);
                titleElement = null;

                if (targetPage) {
                    var updateElement = document.createElement('div');
                    updateElement.setAttribute('id', 'updateElement');
                    timerDivElement.appendChild(updateElement);
                    updateElement = null;

                    var NOBmessage = document.createElement('div');
                    NOBmessage.setAttribute('id', 'NOBmessage');
                    timerDivElement.appendChild(NOBmessage);
                    NOBmessage = null;

                    nextHornTimeElement = document.createElement('div');
                    nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
                    nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> Loading...";
                    timerDivElement.appendChild(nextHornTimeElement);

                    checkTimeElement = document.createElement('div');
                    checkTimeElement.setAttribute('id', 'checkTimeElement');
                    checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> Loading...";
                    timerDivElement.appendChild(checkTimeElement);

                    if (pauseAtInvalidLocation) {
                        // location information only display when enable this feature
                        travelElement = document.createElement('div');
                        travelElement.setAttribute('id', 'travelElement');
                        travelElement.innerHTML = "<b>Target Hunt Location:</b> Loading...";
                        timerDivElement.appendChild(travelElement);
                    }

                    var lastKingRewardDate = getStorage("lastKingRewardDate");
                    var lastDateStr;
                    if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
                        lastDateStr = "-";
                    } else {
                        var lastDate = new Date(lastKingRewardDate);
                        lastDateStr = lastDate.toDateString() + " " + lastDate.toTimeString().substring(0, 8);
                        lastDate = null;
                    }

                    kingTimeElement = document.createElement('div');
                    kingTimeElement.setAttribute('id', 'kingTimeElement');
                    kingTimeElement.innerHTML = "<b>Last King's Reward:</b> " + lastDateStr + " ";
                    timerDivElement.appendChild(kingTimeElement);

                    lastKingRewardSumTimeElement = document.createElement('font');
                    lastKingRewardSumTimeElement.setAttribute('id', 'lastKingRewardSumTimeElement');
                    lastKingRewardSumTimeElement.innerHTML = "(Loading...)";
                    kingTimeElement.appendChild(lastKingRewardSumTimeElement);

                    lastKingRewardDate = null;
                    lastDateStr = null;

                    if (showLastPageLoadTime) {
                        var nowDate = new Date();

                        // last page load time
                        var loadTimeElement = document.createElement('div');
                        loadTimeElement.setAttribute('id', 'loadTimeElement');
                        loadTimeElement.innerHTML = "<b>Last Page Load: </b>" + nowDate.toDateString() + " " + nowDate.toTimeString().substring(0, 8);
                        //timerDivElement.appendChild(loadTimeElement);

                        loadTimeElement = null;
                        nowDate = null;
                    }

                    var timersElementToggle = document.createElement('a');
                    var text = document.createTextNode('Toggle timers');
                    timersElementToggle.href = '#';
                    timersElementToggle.setAttribute('id', 'timersElementToggle');
                    timersElementToggle.appendChild(text);
                    timersElementToggle.onclick = function (e) {
                        var timersElementStyle = document.getElementById('loadTimersElement');
                        if (timersElementStyle.style.display == 'block' || timersElementStyle.style.display == '') {
                            timersElementStyle.style.display = 'none';
                        } else {
                            timersElementStyle.style.display = 'block';
                        }
                        timersElementStyle = null;
                    };
                    var holder = document.createElement('div');
                    holder.setAttribute('style', 'float: left;');
                    var temp = document.createElement('span');
                    temp.innerHTML = '&#160;&#126;&#160;';
                    holder.appendChild(timersElementToggle);
                    holder.appendChild(temp);
                    timerDivElement.appendChild(holder);
                    holder = null;
                    text = null;
                    temp = null;

                    var loadTimersElement = document.createElement('div');
                    loadTimersElement.setAttribute('id', 'loadTimersElement');
                    loadTimersElement.setAttribute('style', 'display: none;');
                    timerDivElement.appendChild(loadTimersElement);

                    //timerDivElement.appendChild(/*document.createElement('br')*/document.createTextNode(' &#126; '));

                    var loadLinkToUpdateDiv = document.createElement('div');
                    loadLinkToUpdateDiv.setAttribute('id', 'gDocArea');
                    loadLinkToUpdateDiv.setAttribute('style', 'float: left;');
                    var tempSpan2 = document.createElement('span');
                    var loadLinkToUpdate = document.createElement('a');
                    text = document.createTextNode('Submit to GDoc');
                    loadLinkToUpdate.href = '#';
                    loadLinkToUpdate.setAttribute('id', 'gDocLink');
                    loadLinkToUpdate.appendChild(text);
                    loadLinkToUpdate.addEventListener('click', nobScript, false);
                    text = null;
                    tempSpan2.appendChild(loadLinkToUpdate);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    timerDivElement.appendChild(loadLinkToUpdateDiv);

                    text = ' &#126; <a href="javascript:window.open(\'https://docs.google.com/spreadsheet/ccc?key=0Ag_KH_nuVUjbdGtldjJkWUJ4V1ZpUDVwd1FVM0RTM1E#gid=5\');" target=_blank>Go to GDoc</a>';
                    var tempDiv = document.createElement('span');
                    tempDiv.innerHTML = text;
                    text = ' &#126; <a id="nobRaffle" href="#" title="Sends back the raffle ticket in inventory.">Return raffle tickets</a>';
                    tempSpan2 = document.createElement('span');
                    tempSpan2.innerHTML = text;
                    var tempSpan3 = document.createElement('span');
                    tempSpan3.innerHTML = ' &#126; <a id="nobPresent" href="#" title="Sends back the presents in inventory.">Return presents</a>';
                    var tempSpan = document.createElement('span');
                    tempSpan.innerHTML = ' &#126; <a href="javascript:window.open(\'http://goo.gl/forms/ayRsnizwL1\');" target=_blank>Submit a bug report/feedback</a>';
                    loadLinkToUpdateDiv.appendChild(tempDiv);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    loadLinkToUpdateDiv.appendChild(tempSpan3);
                    loadLinkToUpdateDiv.appendChild(tempSpan);

                    text = null;
                    tempDiv = null;
                    tempSpan = null;
                    tempSpan2 = null;
                    tempSpan3 = null;
                    loadLinkToUpdateDiv = null;
                    timersElementToggle = null;
                    loadTimersElement = null;
                    loadLinkToUpdate = null;
                } else {
                    if (isNewUI || nobTestBetaUI()) {
                        // try check if ajax was called
                        if (doubleCheckLocation()) {
                            exeScript();
                            nobInit();
                            return;
                        } else {
                            var ajaxPageSwitchEvent = function (e) {
                                setTimeout(function () {
                                    document.getElementById('titleElement').parentNode.remove();
                                    exeScript();
                                    nobInit();
                                }, 3000);
                                $('.camp a')[0].removeEventListener('click', ajaxPageSwitchEvent);
                                ajaxPageSwitchEvent = null;
                            };
                            $('.camp a')[0].addEventListener('click', ajaxPageSwitchEvent);
                        }
                    }

                    // player currently navigating other page instead of hunter camp
                    var helpTextElement = document.createElement('div');
                    helpTextElement.setAttribute('id', 'helpTextElement');
                    if (fbPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (hiFivePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhMobilePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='https://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='http://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        }
                    }
                    timerDivElement.appendChild(helpTextElement);

                    helpTextElement = null;
                }

                var showPreference = getStorage('showPreference');
                if (showPreference == undefined || showPreference == null) {
                    showPreference = false;
                    setStorage("showPreference", showPreference);
                }

                var showPreferenceLinkDiv = document.createElement('div');
                showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
                showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
                timerDivElement.appendChild(showPreferenceLinkDiv);

                var showPreferenceSpan = document.createElement('span');
                var showPreferenceLinkStr = '<a id="showPreferenceLink" name="showPreferenceLink" onclick="if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preference]</b>\') { document.getElementById(\'preferenceDiv\').style.display=\'none\';  document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preference]</b>\'; } else { document.getElementById(\'preferenceDiv\').style.display=\'block\'; document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preference]</b>\'; }">';
                if (showPreference == true)
                    showPreferenceLinkStr += '<b>[Hide Preference]</b>';
                else
                    showPreferenceLinkStr += '<b>[Show Preference]</b>';
                showPreferenceLinkStr += '</a>';
                showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
                showPreferenceSpan.innerHTML = showPreferenceLinkStr;
                showPreferenceLinkDiv.appendChild(showPreferenceSpan);
                showPreferenceLinkStr = null;
                showPreferenceSpan = null;
                showPreferenceLinkDiv = null;

                var hr2Element = document.createElement('hr');
                timerDivElement.appendChild(hr2Element);
                hr2Element = null;

                var preferenceHTMLStr = '<table border="0" width="100%">';
                if (aggressiveMode) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" disabled="disabled" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" disabled="disabled" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (enableTrapCheck) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" disabled="disabled" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" disabled="disabled" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" disabled="disabled" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (isKingWarningSound) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" /> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Solve King Reward automatically"><b>Auto Solve King Reward</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                if (isAutoSolve) {
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputTrue" name="AutoSolveKRInput" value="true" onchange="if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputFalse" name="AutoSolveKRInput" value="false" onchange="if (document.getElementById(\'AutoSolveKRInputFalse\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'disabled\';}"/> False';
                }
                else {
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputTrue" name="AutoSolveKRInput" value="true" onchange="if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputFalse" name="AutoSolveKRInput" value="false" onchange="if (document.getElementById(\'AutoSolveKRInputFalse\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> False';
                }
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';
                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Extra delay time to solve King Reward (in seconds)"><b>Auto Solve King Reward Delay</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                if (isAutoSolve) {
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMinInput" name="AutoSolveKRDelayMinInput" value="' + krDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMaxInput" name="AutoSolveKRDelayMaxInput" value="' + krDelayMax.toString() + '"/> seconds';
                }
                else {
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMinInput" name="AutoSolveKRDelayMinInput" disabled="disabled" value="' + krDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMaxInput" name="AutoSolveKRDelayMaxInput" disabled="disabled" value="' + krDelayMax.toString() + '"/> seconds';
                }
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Play which sound when encountering king\'s reward"><b>King Reward Sound</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px;">';
                preferenceHTMLStr += '<input type="text" id="KingRewardSoundInput" name="KingRewardSoundInput" value="' + kingWarningSound + '" />';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Which email to send king\'s reward to"><b>Email to send King Reward</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px;">';
                preferenceHTMLStr += '<input type="text" id="KingRewardEmail" name="KingRewardEmail" value="' + kingRewardEmail + '" />';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                /*preferenceHTMLStr += '<tr>';
                 preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                 preferenceHTMLStr += '<a title="Which phone number to send king\'s reward to"><b>SMS number to send King Reward</b></a>';
                 preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '<td style="height:24px;">';
                 preferenceHTMLStr += '<input type="text" id="KingRewardPhoneNumber" name="KingRewardPhoneNumber" value="' + kingRewardPhone + '" />';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '</tr>';

                 preferenceHTMLStr += '<tr>';
                 preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                 preferenceHTMLStr += '<a title="What was the verification key sent to this number?"><b>Verification key from SMS</b></a>';
                 preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '<td style="height:24px;">';
                 preferenceHTMLStr += '<input type="text" id="KingRewardPhoneNumberVerify" name="KingRewardPhoneNumberVerify" value="' + kingRewardPhoneVerify + '" />';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '</tr>';*/

                if (reloadKingReward) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encount King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encounter King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" disabled="disabled" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (pauseAtInvalidLocation) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (autoPopupKR) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Select the script algorithm based on certain event / location"><b>Event or Location</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                preferenceHTMLStr += '<select name="algo" onChange="window.localStorage.setItem(\'eventLocation\', value); document.getElementById(\'event\').value=window.localStorage.getItem(\'eventLocation\');">';
                preferenceHTMLStr += '<option value=""> </option>';
                preferenceHTMLStr += '<option value="None" selected>None</option>';
                preferenceHTMLStr += '<option value="Hunt For">Hunt for ' + NOBhuntsLeft + ' hunts</option>';
                preferenceHTMLStr += '<option value="" disabled>--==Normal Bots==--</option>';
                preferenceHTMLStr += '<option value="Zugzwang\'s Tower">Zugzwang\'s Tower</option>';
                preferenceHTMLStr += '<option value="Fiery Warpath">Fiery Warpath</option>';
                preferenceHTMLStr += '<option value="Fiery Warpath Super">Fiery Warpath (Super charms)</option>';
                preferenceHTMLStr += '<option value="Iceberg (Wax)">Iceberg (Wax)</option>';
                preferenceHTMLStr += '<option value="Iceberg (Sticky)">Iceberg (Sticky)</option>';
                preferenceHTMLStr += '<option value="All LG Area">All LG Area</option>';
                preferenceHTMLStr += '<option value="Gnawnian Express(Empty)">Gnawnian Express(Empty)</option>';
                preferenceHTMLStr += '<option value="Gnawnian Express(Full)">Gnawnian Express(Full)</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Yellow)">Burroughs Rift(Yellow)</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Green)">Burroughs Rift(Green)</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Red)">Burroughs Rift(Red)</option>';
                preferenceHTMLStr += '<option value="Sunken City">Sunken City</option>';
                //preferenceHTMLStr += '<option value="Labyrinth">Labyrinth</option>';
                preferenceHTMLStr += '<option value="" disabled>--==Event Bots==--</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2016">Charge Egg 2016</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2016(17)">Charge Egg 2016(17)</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2014">Charge Egg 2014</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2014(17)">Charge Egg 2014(17)</option>';
                preferenceHTMLStr += '<option value="Halloween 2014">Halloween 2014</option>';
                preferenceHTMLStr += '<option value="Halloween 2015">Halloween 2015</option>';
                preferenceHTMLStr += '<option value="Winter 2015">Winter 2015</option>';
                preferenceHTMLStr += '</select> Current Selection : ';
                preferenceHTMLStr += '<input type="text" id="event" name="event" value="' + eventLocation + '"/>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                if (eventLocation == "Hunt For") {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Type in how many hunts you want to hunt for"><b>How many hunts?</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="number" id="nobHuntsLeftInput" name="nobHuntsLeftInput" value="' + NOBhuntsLeft + '" />';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="FOR DEVS ONLY" onclick="if(confirm(\'Are you sure you want to inject code?\'))$(\'#addonCode\').toggle();"><b>Click here if you would like to inject code.</b></a>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td>';
                preferenceHTMLStr += '<textarea id="addonCode" name="addonCode" style="display:none;">';
                preferenceHTMLStr += addonCode;
                preferenceHTMLStr += '</textarea>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
                preferenceHTMLStr += '(Changes only take place after user save the preference) ';
                preferenceHTMLStr += '<input type="button" id="PreferenceSaveInput" value="Save" onclick="	\
if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { window.localStorage.setItem(\'AggressiveMode\', \'true\'); } else { window.localStorage.setItem(\'AggressiveMode\', \'false\'); }	\
window.localStorage.setItem(\'HornTimeDelayMin\', document.getElementById(\'HornTimeDelayMinInput\').value); window.localStorage.setItem(\'HornTimeDelayMax\', document.getElementById(\'HornTimeDelayMaxInput\').value);	\
if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { window.localStorage.setItem(\'TrapCheck\', \'true\'); } else { window.localStorage.setItem(\'TrapCheck\', \'false\'); }	\
window.localStorage.setItem(\'TrapCheckTimeOffset\', document.getElementById(\'TrapCheckTimeOffsetInput\').value);	\
window.localStorage.setItem(\'TrapCheckTimeDelayMin\', document.getElementById(\'TrapCheckTimeDelayMinInput\').value); window.localStorage.setItem(\'TrapCheckTimeDelayMax\', document.getElementById(\'TrapCheckTimeDelayMaxInput\').value);	\
if (document.getElementById(\'PlayKingRewardSoundInputTrue\').checked == true) { window.localStorage.setItem(\'PlayKingRewardSound\', \'true\'); } else { window.localStorage.setItem(\'PlayKingRewardSound\', \'false\'); }	\
if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { window.localStorage.setItem(\'AutoSolveKR\', \'true\'); } else { window.localStorage.setItem(\'AutoSolveKR\', \'false\'); }	\
				window.localStorage.setItem(\'AutoSolveKRDelayMin\', document.getElementById(\'AutoSolveKRDelayMinInput\').value); window.localStorage.setItem(\'AutoSolveKRDelayMax\', document.getElementById(\'AutoSolveKRDelayMaxInput\').value);	\
window.localStorage.setItem(\'KingRewardSoundInput\', document.getElementById(\'KingRewardSoundInput\').value);	\
window.localStorage.setItem(\'KingRewardEmail\', document.getElementById(\'KingRewardEmail\').value);	\
if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { window.localStorage.setItem(\'KingRewardResume\', \'true\'); } else { window.localStorage.setItem(\'KingRewardResume\', \'false\'); }	\
window.localStorage.setItem(\'KingRewardResumeTime\', document.getElementById(\'KingRewardResumeTimeInput\').value);	\
if (document.getElementById(\'PauseLocationInputTrue\').checked == true) { window.localStorage.setItem(\'PauseLocation\', \'true\'); } else { window.localStorage.setItem(\'PauseLocation\', \'false\'); }	\
if (document.getElementById(\'autopopkrTrue\').checked == true) { window.localStorage.setItem(\'autoPopupKR\', \'true\'); } else { window.localStorage.setItem(\'autoPopupKR\', \'false\'); }	\
if (document.getElementById(\'nobHuntsLeftInput\')) { window.localStorage.setItem(\'NOB-huntsLeft\', document.getElementById(\'nobHuntsLeftInput\').value); } \
window.localStorage.setItem(\'addonCode\', document.getElementById(\'addonCode\').value);\
';
                if (fbPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/canvas/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/canvas/\';"/>';
                } else if (hiFivePlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://mousehunt.hi5.hitgrab.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://mousehunt.hi5.hitgrab.com/\';"/>';
                } else if (mhPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/\';"/>';
                }
                preferenceHTMLStr += '&nbsp;&nbsp;&nbsp;</td>';
                preferenceHTMLStr += '</tr>';
                preferenceHTMLStr += '</table>';

                var NOBspecialMessageDiv = document.createElement('div');
                NOBspecialMessageDiv.setAttribute('id', 'nobSpecialMessage');
                NOBspecialMessageDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; z-index: 999; text-align: center; width: 760px;');

                //var nobWhatsNewDiv = document.createElement('div');
                //nobWhatsNewDiv.setAttribute('id', 'nobWhatsNew');
                //nobWhatsNewDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; left: 0; z-index: 999; text-align: left; width: 200px; height: 100px; padding: 10px 0 10px 10px;');

                var nobWhatsNewDiv = document.createElement('div');
                nobWhatsNewDiv.innerHTML = "<style>" +
                    "@-webkit-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@-moz-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@-o-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +
                    "</style>";

                var preferenceDiv = document.createElement('div');
                preferenceDiv.setAttribute('id', 'preferenceDiv');
                if (showPreference == true)
                    preferenceDiv.setAttribute('style', 'display: block');
                else
                    preferenceDiv.setAttribute('style', 'display: none');
                preferenceDiv.innerHTML = preferenceHTMLStr;
                timerDivElement.appendChild(preferenceDiv);
                timerDivElement.appendChild(NOBspecialMessageDiv);
                timerDivElement.appendChild(nobWhatsNewDiv);
                preferenceHTMLStr = null;
                showPreference = null;

                var hr3Element = document.createElement('hr');
                preferenceDiv.appendChild(hr3Element);
                hr3Element = null;
                preferenceDiv = null;
                NOBspecialMessageDiv = null;
                nobWhatsNewDiv = null;

                // embed all msg to the page
                headerElement.parentNode.insertBefore(timerDivElement, headerElement);
                timerDivElement = null;
            }
            headerElement = null;
        }

        targetPage = null;
    } catch (e) {
        if (debug) console.log('embedTimer error - ' + e)
    }
}

function loadPreferenceSettingFromStorage() {
    var aggressiveModeTemp = getStorage("AggressiveMode");
    if (aggressiveModeTemp == undefined || aggressiveModeTemp == null) {
        setStorage("AggressiveMode", aggressiveMode.toString());
    } else if (aggressiveModeTemp == true || aggressiveModeTemp.toLowerCase() == "true") {
        aggressiveMode = true;
    } else {
        aggressiveMode = false;
    }
    aggressiveModeTemp = undefined;

    var hornTimeDelayMinTemp = getStorage("HornTimeDelayMin");
    var hornTimeDelayMaxTemp = getStorage("HornTimeDelayMax");
    if (hornTimeDelayMinTemp == undefined || hornTimeDelayMinTemp == null || hornTimeDelayMaxTemp == undefined || hornTimeDelayMaxTemp == null) {
        setStorage("HornTimeDelayMin", hornTimeDelayMin);
        setStorage("HornTimeDelayMax", hornTimeDelayMax);
    } else {
        hornTimeDelayMin = parseInt(hornTimeDelayMinTemp);
        hornTimeDelayMax = parseInt(hornTimeDelayMaxTemp);
    }
    hornTimeDelayMinTemp = undefined;
    hornTimeDelayMaxTemp = undefined;

    var trapCheckTemp = getStorage("TrapCheck");
    if (trapCheckTemp == undefined || trapCheckTemp == null) {
        setStorage("TrapCheck", enableTrapCheck.toString());
    } else if (trapCheckTemp == true || trapCheckTemp.toLowerCase() == "true") {
        enableTrapCheck = true;
    } else {
        enableTrapCheck = false;
    }
    trapCheckTemp = undefined;

    var trapCheckTimeOffsetTemp = getStorage("TrapCheckTimeOffset");
    if (trapCheckTimeOffsetTemp == undefined || trapCheckTimeOffsetTemp == null) {
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
    } else {
        trapCheckTimeDiff = parseInt(trapCheckTimeOffsetTemp);
    }
    trapCheckTimeOffsetTemp = undefined;

    var trapCheckTimeDelayMinTemp = getStorage("TrapCheckTimeDelayMin");
    var trapCheckTimeDelayMaxTemp = getStorage("TrapCheckTimeDelayMax");
    if (trapCheckTimeDelayMinTemp == undefined || trapCheckTimeDelayMinTemp == null || trapCheckTimeDelayMaxTemp == undefined || trapCheckTimeDelayMaxTemp == null) {
        setStorage("TrapCheckTimeDelayMin", checkTimeDelayMin);
        setStorage("TrapCheckTimeDelayMax", checkTimeDelayMax);
    } else {
        checkTimeDelayMin = parseInt(trapCheckTimeDelayMinTemp);
        checkTimeDelayMax = parseInt(trapCheckTimeDelayMaxTemp);
    }
    trapCheckTimeDelayMinTemp = undefined;
    trapCheckTimeDelayMaxTemp = undefined;

    var playKingRewardSoundTemp = getStorage("PlayKingRewardSound");
    if (playKingRewardSoundTemp == undefined || playKingRewardSoundTemp == null) {
        setStorage("PlayKingRewardSound", isKingWarningSound.toString());
    } else if (playKingRewardSoundTemp == true || playKingRewardSoundTemp.toLowerCase() == "true") {
        isKingWarningSound = true;
    } else {
        isKingWarningSound = false;
    }
    playKingRewardSoundTemp = undefined;

    var kingRewardSoundTemp = getStorage('KingRewardSoundInput');
    if (kingRewardSoundTemp == undefined || kingRewardSoundTemp == null || kingRewardSoundTemp == "") {
        kingRewardSoundTemp = 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3';
        setStorage('KingRewardSoundInput', kingWarningSound);
    } else {
        kingWarningSound = kingRewardSoundTemp;
    }
    kingRewardSoundTemp = undefined;

    var kingRewardEmailTemp = getStorage('KingRewardEmail');
    if (kingRewardEmailTemp == undefined || kingRewardEmailTemp == null || kingRewardEmailTemp == "") {
        kingRewardEmailTemp = '';
        setStorage('KingRewardEmail', '');
    } else {
        kingRewardEmail = kingRewardEmailTemp;
    }
    kingRewardEmailTemp = undefined;

    var kingRewardResumeTemp = getStorage("KingRewardResume");
    if (kingRewardResumeTemp == undefined || kingRewardResumeTemp == null) {
        setStorage("KingRewardResume", reloadKingReward.toString());
    } else if (kingRewardResumeTemp == true || kingRewardResumeTemp.toLowerCase() == "true") {
        reloadKingReward = true;
    } else {
        reloadKingReward = false;
    }
    kingRewardResumeTemp = undefined;

    var kingRewardResumeTimeTemp = getStorage("KingRewardResumeTime");
    if (kingRewardResumeTimeTemp == undefined || kingRewardResumeTimeTemp == null) {
        setStorage("KingRewardResumeTime", kingPauseTimeMax);
    } else {
        kingPauseTimeMax = parseInt(kingRewardResumeTimeTemp);
    }
    kingRewardResumeTimeTemp = undefined;

    var pauseLocationTemp = getStorage("PauseLocation");
    if (pauseLocationTemp == undefined || pauseLocationTemp == null) {
        setStorage("PauseLocation", pauseAtInvalidLocation.toString());
    } else if (pauseLocationTemp == true || pauseLocationTemp.toLowerCase() == "true") {
        pauseAtInvalidLocation = true;
    } else {
        pauseAtInvalidLocation = false;
    }
    pauseLocationTemp = undefined;

    var autopopkrTemp = getStorage("autoPopupKR");
    if (autopopkrTemp == undefined || autopopkrTemp == null) {
        setStorage("autoPopupKR", autoPopupKR.toString());
    } else if (autopopkrTemp == true || autopopkrTemp.toLowerCase() == "true") {
        autoPopupKR = true;
    } else {
        autoPopupKR = false;
    }
    autopopkrTemp = undefined;

    var addonCodeTemp = getStorage("addonCode");
    if (addonCodeTemp == undefined || addonCodeTemp === null || addonCodeTemp == "" || addonCodeTemp == "null") {
        setStorage('addonCode', "");
    }
    addonCode = addonCodeTemp;

    addonCodeTemp = undefined;

    // nobTrapCounter to only refetch all traps when counter hits 0
    var nobTrapsTemp = nobGet('traps');
    var nobTrapsTempCounter = getStorage('nobTrapsCounter');
    if (nobTrapsTempCounter == undefined || nobTrapsTempCounter === null) {
        nobTrapsTempCounter = 1000;
    }
    if (nobTrapsTempCounter > 0 && nobTrapsTempCounter < 501) {
        if (!(nobTrapsTemp == undefined || nobTrapsTemp === null)) {
            NOBtraps = JSON.parse(nobTrapsTemp);
        }

        setStorage('nobTrapsCounter', nobTrapsTempCounter - 1);
    } else {
        NOBtraps = [];
        setStorage('nobTrapsCounter', 500);
    }
    nobTrapsTemp = undefined;
    nobTrapsTempCounter = undefined;

    var nobHuntsLeft = parseInt(nobGet('huntsLeft'));
    if (nobHuntsLeft > NOBhuntsLeft)
        NOBhuntsLeft = nobHuntsLeft;
    nobHuntsLeft = undefined;

    var dischargeTemp = getStorage("discharge");
    if (dischargeTemp == undefined || dischargeTemp == null) {
        setStorage("discharge", true.toString());
    } else if (dischargeTemp == true || dischargeTemp.toLowerCase() == "true") {
        discharge = true;
    } else {
        discharge = false;
    }
    dischargeTemp = undefined;

    var eventTemp = getStorage('eventLocation');
    if (eventTemp == undefined || eventTemp == null) {
        setStorage('eventLocation', 'None');
        eventTemp = getStorage('eventLocation');
    }
    eventLocation = eventTemp;
    eventTemp = undefined;

    isAutoSolve = getStorageToVariableBool("AutoSolveKR", isAutoSolve);
    krDelayMin = getStorageToVariableInt("AutoSolveKRDelayMin", krDelayMin);
    krDelayMax = getStorageToVariableInt("AutoSolveKRDelayMax", krDelayMax);
    kingsRewardRetry = getStorageToVariableInt("KingsRewardRetry", kingsRewardRetry);
}

function getStorageToVariableInt(storageName, defaultInt) {
    var temp = getStorage(storageName);
    var tempInt = defaultInt;
    if (temp == undefined || temp == null) {
        setStorage(storageName, defaultInt);
    } else {
        tempInt = parseInt(temp);
    }
    return tempInt;
}

function getStorageToVariableBool(storageName, defaultBool) {
    var temp = getStorage(storageName);
    if (temp == undefined || temp == null) {
        setStorage(storageName, defaultBool.toString());
        return defaultBool;
    } else if (temp == true || temp.toLowerCase() == "true") {
        return true;
    } else {
        return false;
    }
}

function displayTimer(title, nextHornTime, checkTime) {
    if (showTimerInTitle) {
        document.title = title;
    }

    if (showTimerInPage) {
        nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> " + nextHornTime;
        checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> " + checkTime;
    }

    title = null;
    nextHornTime = null;
    checkTime = null;
}

function displayLocation(locStr) {
    if (showTimerInPage && pauseAtInvalidLocation) {
        travelElement.innerHTML = "<b>Hunt Location:</b> " + locStr;
    }

    locStr = null;
}

function displayKingRewardSumTime(timeStr) {
    if (showTimerInPage) {
        if (timeStr) {
            lastKingRewardSumTimeElement.innerHTML = "(" + timeStr + ")";
        } else {
            lastKingRewardSumTimeElement.innerHTML = "";
        }
    }

    timeStr = null;
}

function doubleCheckLocation() { //return true if location is camp page (this is to combat ajax loads)
    if (!isNewUI) {
        return true;
    }

    var thePage = $('#mousehuntContainer')[0];
    if (thePage) {
        return (thePage.className == "PageCamp");
    } else {
        return false;
    }
}
// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
    if (!isNewUI || doubleCheckLocation()) {
        // update timer
        displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

        var hornElement;
        var scriptNode = document.getElementById("scriptNode");
        if (scriptNode) {
            scriptNode.setAttribute("soundedHornAtt", "false");
        }
        scriptNode = null;

        if (!aggressiveMode) {
            // safety mode, check the horn image is there or not before sound the horn
            var headerElement = document.getElementById(header);

            if (headerElement) {
                if (isNewUI)
                    headerElement = headerElement.firstChild;
                // need to make sure that the horn image is ready before we can click on it
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // found the horn image, let's sound the horn!

                    // update timer
                    displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");

                    // simulate mouse click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // NOB hunt until
                    NOBhuntsLeft--;
                    nobStore(NOBhuntsLeft, 'huntsLeft');

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
                    // some one just sound the horn...

                    // update timer
                    displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

                    // NOB hunt until
                    NOBhuntsLeft--;
                    nobStore(NOBhuntsLeft, 'huntsLeft');

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // load the new data
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornwaiting") != -1) {
                    // the horn is not appearing, let check the time again

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");

                    // sync the time again, maybe user already click the horn
                    retrieveData();

                    checkJournalDate();

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // loop again
                    window.setTimeout(function () {
                        countdownTimer()
                    }, timerRefreshInterval * 1000);
                } else {
                    // some one steal the horn!
					console.log('some one steal the horn!');

                    // During event/location, reload to refresh status
                    if (eventLocation != '' && eventLocation != 'None') {
                        // clean up
                        headerElement = null;

                        // reload to refresh status
                        reloadPage(false);
                    }

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");

                    // try to click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                }
            } else {
                // something wrong, can't even found the header...

                // clean up
                headerElement = null;

                // reload the page see if thing get fixed
                reloadWithMessage("Fail to find the horn header. Reloading...", false);
            }

        } else {
            // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

            // simulate mouse click on the horn
            fireEvent(document.getElementsByClassName(hornButton)[0].firstChild, 'click');

            // double check if the horn was already sounded
            window.setTimeout(function () {
                afterSoundingHorn()
            }, 3000);
        }
    } else {
        document.getElementById('titleElement').parentNode.remove();
        embedTimer(false);
    }
}

function afterSoundingHorn() {
    if (debug) console.log("Run afterSoundingHorn()");
    // sometimes horn keep displayed for a while even when stolen
    if (checkJournalDate()) return;
	currentDelayMax();

    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    var headerElement = document.getElementById(header);
    if (headerElement) {
        if (isNewUI)
            headerElement = headerElement.firstChild;
        // double check if the horn image is still visible after the script already sound it
        var headerStatus = headerElement.getAttribute('class');
        if (headerStatus.indexOf(hornReady) != -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            var hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
            fireEvent(hornElement, 'click');
            hornElement = null;

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caught in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 1000);
            }
        } else if (headerStatus.indexOf("hornsounding") != -1) {
            // the horn is already sound, but the network seen to slow on fetching the data

            // update timer
            displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caugh in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 3000);
            }
        } else {
            // everything look ok

            // update timer
            displayTimer("Horn sounded. Synchronizing Data...", "Horn sounded. Synchronizing data...", "Horn sounded. Synchronizing data...");

            // reload data
            retrieveData();

            // clean up
            headerElement = null;
            headerStatus = null;

            // script continue as normal
            window.setTimeout(function () {
                countdownTimer()
            }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
    eventLocationCheck();
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    var scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = 'function soundedHorn() {\
    var scriptNode = document.getElementById("scriptNode");\
    if (scriptNode) {\
    	scriptNode.setAttribute("soundedHornAtt", "true");\
    }\
    scriptNode = null;\
    }';

    // find the head node and insert the script into it
    var headerElement;
    if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('noscript');
    } else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);
    scriptNode = null;
    headerElement = null;

    nobTestBetaUI();

    // change the function call of horn
    var hornButtonLink = document.getElementsByClassName(hornButton)[0].firstChild;
    var oriStr = hornButtonLink.getAttribute('onclick').toString();
    var index = oriStr.indexOf('return false;');
    var modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);

    hornButtonLink = null;
    oriStr = null;
    index = null;
    modStr = null;
}

function nobTestBetaUI() { // Return true if beta UI
    header = 'header';
    var testNewUI = document.getElementById(header);
    if (testNewUI != null) {
        // old UI
        hornButton = 'hornbutton';
        campButton = 'campbutton';
        header = 'header';
        hornReady = 'hornready';
        isNewUI = false;
        return false;
    } else {
        // new UI
        hornButton = 'mousehuntHud-huntersHorn-container';
        campButton = 'camp';
        header = 'mousehuntHud';
        hornReady = 'hornReady';
        isNewUI = true;
        return true;
    }
    testNewUI = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################

// ################################################################################################
//   No Cheese Function - Start
// ################################################################################################
function noCheeseAction() {
    notifyMe("No more cheese!!!", 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/cheese.png', getPageVariable('user.username') + ' has no more cheese.');

    playNoCheeseSound();
}

function playNoCheeseSound() {
    if (isNoCheeseSound) {
        unsafeWindow.hornAudio = new Audio(kingWarningSound);
        unsafeWindow.hornAudio.loop = true;
        unsafeWindow.hornAudio.play();
        var targetArea = document.getElementsByTagName('body');
        var child = document.createElement('button');
        child.setAttribute('id', "stopAudio");
        child.setAttribute('style', 'position: fixed; bottom: 0;');
        child.setAttribute('onclick', 'hornAudio.pause();');
        child.innerHTML = "CLICK ME TO STOP THIS ANNOYING MUSIC";
        targetArea[0].appendChild(child);
        targetArea = null;
        child = null;
        snippet = null;
    }
}

// ################################################################################################
//   No Cheese Function - End
// ################################################################################################

// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

/*function kingRewardAction() {
 // update timer
 displayTimer("King's Reward!", "King's Reward", "King's Reward!");
 displayLocation("-");

 // play music if needed
 playKingRewardSound();

 window.setTimeout(function () {
 // Autopop KR if needed
 if (autoPopupKR) {
 alert("King's Reward NOW");
 }

 // email the captcha away if needed
 emailCaptcha();
 }, 2000);

 // focus on the answer input
 var inputElementList = document.getElementsByTagName('input');
 if (inputElementList) {
 var i;
 for (i = 0; i < inputElementList.length; ++i) {
 // check if it is a resume button
 if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
 inputElementList[i].focus();
 break;
 }
 }
 i = null;
 }
 inputElementList = null;

 // record last king's reward time
 var nowDate = new Date();
 setStorage("lastKingRewardDate", nowDate.toString());
 nowDate = null;

 if (kingPauseTimeMax <= 0) {
 kingPauseTimeMax = 1;
 }

 kingPauseTime = kingPauseTimeMax;
 kingRewardCountdownTimer();
 }*/

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward", "King's Reward!");
    displayLocation("-");

    // play music if needed
    playKingRewardSound();

    window.setTimeout(function () {
        // Autopop KR if needed
        if (autoPopupKR) {
            alert("King's Reward NOW");
        }

        // email the captcha away if needed
        emailCaptcha();
    }, 2000);

    // focus on the answer input
    var inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        var i;
        for (i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
        i = null;
    }
    inputElementList = null;

    // record last king's reward time
    var nowDate = new Date();
    setStorage("lastKingRewardDate", nowDate.toString());

    if (!isAutoSolve)
        return;

    var krDelaySec = krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));
    var krStopHourNormalized = krStopHour;
    var krStartHourNormalized = krStartHour;
    if (krStopHour > krStartHour) { // e.g. Stop to Start => 22 to 06
        var offset = 24 - krStopHour;
        krStartHourNormalized = krStartHour + offset;
        krStopHourNormalized = 0;
        nowDate.setHours(nowDate.getHours() + offset);
    }

    if (nowDate.getHours() >= krStopHourNormalized && nowDate.getHours() < krStartHourNormalized) {
        var krDelayMinute = krStartHourDelayMin + Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
        krDelaySec += krStartHour * 3600 - (nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
        krDelaySec += krDelayMinute * 60;
        var timeNow = new Date();
        setStorage("Time to start delay", timeNow.toString());
        setStorage("Delay time", timeformat(krDelaySec))
        kingRewardCountdownTimer(krDelaySec, true);
    } else {
        if (kingsRewardRetry > kingsRewardRetryMax)
            krDelaySec /= (kingsRewardRetry * 2);
        kingRewardCountdownTimer(krDelaySec, false);
    }
}

function emailCaptcha() {
    if (kingRewardEmail != null && kingRewardEmail != undefined && kingRewardEmail != "") {
        if (debug) console.log('Attempting to email captcha via Parse now.');
        var un = getPageVariable('user.username');
        if (un == undefined) un = "";

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");

        Parse.Cloud.run('sendKRemail', {
            theEmail: kingRewardEmail,
            user: un
        }, {
            success: function (data) {
                if (debug) console.log(data);
            }, error: function (error) {
                if (debug) console.log(error);
            }
        });
    }
}

function notifyMe(notice, icon, body) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        var notification = new Notification(notice, {'icon': icon, 'body': body});

        notification.onclick = function () {
            window.open("https://www.mousehuntgame.com/");
            notification.close();
        }

        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, 5000);
        }
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notice, {'icon': icon, 'body': body});

                notification.onclick = function () {
                    window.open("https://www.mousehuntgame.com/");
                    notification.close();
                }

                notification.onshow = function () {
                    setTimeout(function () {
                        notification.close();
                    }, 5000);
                }
            }
        });
    }
}

function playKingRewardSound() {
    if (isKingWarningSound) {
        unsafeWindow.hornAudio = new Audio(kingWarningSound);
        unsafeWindow.hornAudio.loop = true;
        unsafeWindow.hornAudio.play();
        var targetArea = document.getElementsByTagName('body');
        var child = document.createElement('button');
        child.setAttribute('id', "stopAudio");
        child.setAttribute('style', 'position: fixed; bottom: 0;');
        child.setAttribute('onclick', 'hornAudio.pause();');
        child.innerHTML = "CLICK ME TO STOP THIS ANNOYING MUSIC";
        targetArea[0].appendChild(child);
        targetArea = null;
        child = null;
        snippet = null;
    }
}

/*function kingRewardCountdownTimer() {
 var dateNow = new Date();
 var intervalTime = timeElapsed(lastDateRecorded, dateNow);
 lastDateRecorded = null;
 lastDateRecorded = dateNow;
 dateNow = null;

 if (reloadKingReward) {
 kingPauseTime -= intervalTime;
 }

 if (lastKingRewardSumTime != -1) {
 lastKingRewardSumTime += intervalTime;
 }

 intervalTime = null;

 if (kingPauseTime <= 0) {
 // update timer
 displayTimer("King's Reward - Reloading...", "Reloading...", "Reloading...");

 // simulate mouse click on the camp button
 var campElement = document.getElementsByClassName(campButton)[0].firstChild;
 fireEvent(campElement, 'click');
 campElement = null;

 // reload the page if click on the camp button fail
 window.setTimeout(function () {
 reloadWithMessage("Fail to click on camp button. Reloading...", false);
 }, 5000);
 } else {
 if (reloadKingReward) {
 // update timer
 displayTimer("King's Reward - Reload in " + timeformat(kingPauseTime),
 "Reloading in " + timeformat(kingPauseTime),
 "Reloading in " + timeformat(kingPauseTime));
 }

 // set king reward sum time
 displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

 if (!checkResumeButton()) {
 window.setTimeout(function () {
 (kingRewardCountdownTimer)()
 }, timerRefreshInterval * 1000);
 }
 }
 }*/

function kingRewardCountdownTimer(interval, isReloadToSolve) {
    var strTemp = (isReloadToSolve) ? "Reload to solve KR in " : "Solve KR in (extra few sec delay) ";
    strTemp = strTemp + timeformat(interval);
    displayTimer(strTemp, strTemp, strTemp);
    strTemp = null;
    interval -= timerRefreshInterval;
    if (interval < 0) {
        if (isReloadToSolve) {
            // simulate mouse click on the camp button
            var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
            fireEvent(campElement, 'click');
            campElement = null;

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        } else {
            var intervalCRB = setInterval(
                function () {
                    if (checkResumeButton()) {
                        clearInterval(intervalCRB);
                        intervalCRB = null;
                        return;
                    }
                }, 1000);
            CallKRSolver();
        }
    } else {
        if (!checkResumeButton()) {
            window.setTimeout(function () {
                kingRewardCountdownTimer(interval, isReloadToSolve);
            }, timerRefreshInterval * 1000);
        }
    }
}

function checkResumeButton() {
    var found = false;
    var resumeElement;

    if (isNewUI) {
        var krFormClass = document.getElementsByTagName('form')[0].className;
        if (krFormClass.indexOf("noPuzzle") > -1) {
            // found resume button

            // simulate mouse click on the resume button
            resumeElement = document.getElementsByClassName('mousehuntPage-puzzle-form-complete-button')[0];
            fireEvent(resumeElement, 'click');
            resumeElement = null;

            // reload url if click fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on resume button. Reloading...", false);
            }, 6000);

            // recheck if the resume button is click because some time even the url reload also fail
            window.setTimeout(function () {
                checkResumeButton();
            }, 10000);

            found = true;
        }
        krFormClass = null;
    } else {
        var linkElementList = document.getElementsByTagName('img');
        if (linkElementList) {
            var i;
            for (i = 0; i < linkElementList.length; ++i) {
                // check if it is a resume button
                if (linkElementList[i].getAttribute('src').indexOf("resume_hunting_blue.gif") != -1) {
                    // found resume button

                    // simulate mouse click on the horn
                    resumeElement = linkElementList[i].parentNode;
                    fireEvent(resumeElement, 'click');
                    resumeElement = null;

                    // reload url if click fail
                    window.setTimeout(function () {
                        reloadWithMessage("Fail to click on resume button. Reloading...", false);
                    }, 6000);

                    // recheck if the resume button is click because some time even the url reload also fail
                    window.setTimeout(function () {
                        checkResumeButton();
                    }, 10000);

                    found = true;
                    break;
                }
            }
            i = null;
        }
    }

    linkElementList = null;

    try {
        return (found);
    } finally {
        found = null;
    }
}

// ################################################################################################
//   King's Reward Function - End
// ################################################################################################

// ################################################################################################
//   Trap Check Function - Start
// ################################################################################################

function trapCheck() {
    // update timer
    displayTimer("Checking The Trap...", "Checking trap now...", "Checking trap now...");

    // simulate mouse click on the camp button
    /*var campElement = document.getElementsByClassName('campbutton')[0].firstChild;
     fireEvent(campElement, 'click');
     campElement = null;*/

    reloadWithMessage("Reloading page for trap check...", false);
    // reload the page if click on camp button fail
    /*window.setTimeout(function() {
     reloadWithMessage("Fail to click on camp button. Reloading...", false);
     }, 5000);*/
}

// ################################################################################################
//   Trap Check Function - End
// ################################################################################################

// ################################################################################################
//   General Function - Start
// ################################################################################################

function browserDetection() {
    var browserName = "unknown";

    var userAgentStr = navigator.userAgent.toString().toLowerCase();
    if (userAgentStr.indexOf("firefox") >= 0) {
        browserName = "firefox";
    } else if (userAgentStr.indexOf("opera") >= 0) {
        browserName = "opera";
    } else if (userAgentStr.indexOf("chrome") >= 0) {
        browserName = "chrome";
    }
    userAgentStr = null;

    try {
        return browserName;
    } finally {
        browserName = null;
    }
}

function setStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        window.localStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        window.localStorage.removeItem(name);
    }
    name = undefined;
}

function getStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        return (window.localStorage.getItem(name));
    }
    name = undefined;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }

            var cookieString = unescape(document.cookie.substring(c_start, c_end));

            // clean up
            c_name = null;
            c_start = null;
            c_end = null;

            try {
                return cookieString;
            } finally {
                cookieString = null;
            }
        }
        c_start = null;
    }
    c_name = null;
    return null;
}

function fireEvent(element, event) {
    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable

        try {
            return !element.dispatchEvent(evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function getPageVariable(name) {
    if (debug) console.log('RUN GPV(' + name + ')');
    try {
        var browser = browserDetection();

        if (browser == 'chrome') {
            if (name == "user.unique_hash") {
                return user.unique_hash;
            } else {
                return getPageVariableForChrome(name);
            }
        } else if (browser == 'firefox') {
            if (name == "user.next_activeturn_seconds") {
                return unsafeWindow.user.next_activeturn_seconds;
            } else if (name == "user.unique_hash") {
                return unsafeWindow.user.unique_hash;
            } else if (name == "user.has_puzzle") {
                return unsafeWindow.user.has_puzzle;
            } else if (name == "user.bait_quantity") {
                return unsafeWindow.user.bait_quantity;
            } else if (name == "user.location") {
                return unsafeWindow.user.location;
            } else if (name == "user.trinket_name") {
                return unsafeWindow.user.trinket_name;
            } else if (name == "user.weapon_name") {
                return unsafeWindow.user.weapon_name;
            } else if (name == "user.quests.QuestTrainStation.on_train") {
                return unsafeWindow.user.quests.QuestTrainStation.on_train;
            } else {
                if (debug) console.log('GPV firefox: ' + name + ' not found.');
            }
        } else {
            if (debug) console.log('GPV other: ' + name + 'not found.');
        }

        return 'ERROR';
    } catch (e) {
        if (debug) console.log('GPV ALL try block error: ' + e);
    } finally {
        name = undefined;
    }
}

function getPageVariableForChrome(variableName) {
    if (debug) console.log('RUN GPVchrome(' + variableName + ')');
    // google chrome only
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute('id', "scriptElement");
    scriptElement.setAttribute('type', "text/javascript");
    scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
    document.body.appendChild(scriptElement);

    var value = scriptElement.innerHTML;
    document.body.removeChild(scriptElement);
    scriptElement = null;
    variableName = null;

    try {
        return (value);
    } finally {
        value = null;
    }
}

function timeElapsed(dateA, dateB) {
    var elapsed = 0;

    var secondA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    var secondB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    elapsed = (secondB - secondA) / 1000;

    secondA = null;
    secondB = null;
    dateA = null;
    dateB = null;

    try {
        return (elapsed);
    } finally {
        elapsed = null;
    }
}

function timeformat(time) {
    var timeString;
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = (time % 3600 % 60) % 60;

    if (hr > 0) {
        timeString = hr.toString() + " hr " + min.toString() + " min " + sec.toString() + " sec";
    } else if (min > 0) {
        timeString = min.toString() + " min " + sec.toString() + " sec";
    } else {
        timeString = sec.toString() + " sec";
    }

    time = null;
    hr = null;
    min = null;
    sec = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

function timeFormatLong(time) {
    var timeString;

    if (time != -1) {
        var day = Math.floor(time / 86400);
        var hr = Math.floor((time % 86400) / 3600);
        var min = Math.floor((time % 3600) / 60);

        if (day > 0) {
            timeString = day.toString() + " day " + hr.toString() + " hr " + min.toString() + " min ago";
        } else if (hr > 0) {
            timeString = hr.toString() + " hr " + min.toString() + " min ago";
        } else if (min > 0) {
            timeString = min.toString() + " min ago";
        }

        day = null;
        hr = null;
        min = null;
    } else {
        timeString = null;
    }

    time = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   NOB Additional thing - Start
// ################################################################################################
// INIT AJAX CALLS AND INIT CALLS - Function calls after page LOAD

window.addEventListener("load", function () {
    if (window.frames['name'] != 'aswift_0') {
        if (debug) console.log('Running nobInit in ' + window.frames['name'] + ' frame.');
        nobInit();
    }
}, false);

function nobInit() {
    if (debug) console.log('RUN nobInit()');
    try {
        if (!NOBhasPuzzle) {
            if (debug) console.log("RUN nobInit()");
            if (window.location.href == 'http://www.mousehuntgame.com/' ||
                window.location.href == 'http://www.mousehuntgame.com/#' ||
                window.location.href == 'http://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href == 'https://www.mousehuntgame.com/' ||
                window.location.href == 'https://www.mousehuntgame.com/#' ||
                window.location.href == 'https://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href.indexOf('mousehuntgame.com/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/index.php') != -1 ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/#' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/#' ||
                window.location.href.indexOf('mousehuntgame.com/canvas/index.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/?') != -1) {
                NOBpage = true;
            }

            if (NOBpage) {
                nobHTMLFetch();
                createClockArea();
                clockTick();
                fetchGDocStuff();
                setTimeout(function () {
                    nobInjectFFfunctions();
                }, 1000);
                setTimeout(function () {
                    pingServer();
                }, 30000);
                // Hide message after 2H :)
                hideNOBMessage(nobMessageTTL);
            }
        }
    } catch (e) {
        console.log("nobInit() ERROR - " + e);
    }
}

function nobAjaxGet(url, callback, throwError) {
    if (!NOBhasPuzzle) {
        jQuery.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            statusCode: {
                200: function () {
                    console.log("Success get - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function nobAjaxPost(url, data, callback, throwError, dataType) {
    if (!NOBhasPuzzle) {
        if (dataType == null || dataType == undefined) dataType = 'json';

        jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: 'text/plain',
            dataType: dataType,
            xhrFields: {
                withCredentials: false
            },
            timeout: 10000,
            statusCode: {
                200: function () {
                    console.log("Success post - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function updateTimer(timeleft, inhours) {
    //if (debug) console.log('updateTimer(' + timeleft + ')');
    var ReturnValue = "";

    var FirstPart, SecondPart, Size;

    if (timeleft > 0) {
        if (inhours != null && inhours == true && timeleft > 3600) {
            FirstPart = Math.floor(timeleft / (60 * 60));
            SecondPart = Math.floor(timeleft / 60) % 60;
            Size = 'hrs';
        } else {
            FirstPart = Math.floor(timeleft / 60);
            SecondPart = timeleft % 60;
            Size = 'mins';
        }

        if (SecondPart < 10) {
            SecondPart = '0' + SecondPart;
        }

        ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
    } else {
        ReturnValue = 'Soon...';
    }

    return ReturnValue;
}

function nobGDoc(items, type) {
    var dataSend = JSON.parse(items);
    dataSend.type = type;
    var dataSendString = JSON.stringify(dataSend);
    var sheet = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec";

    nobAjaxPost(sheet, dataSendString, function (data) {
        if (debug) console.log(data);
    }, function (a, b, c) {
        console.log("nobGDoc error (" + b + "): " + c);
    });
}

function nobHTMLFetch() {
    var value = document.documentElement.innerHTML;
    if (value != null) {
        if (typeof value == "string") {

            var StartPos = value.indexOf('user = ');
            var EndPos = value.indexOf('};', StartPos);

            if (StartPos != -1) {
                var FullObjectText = value.substring(StartPos + 7, EndPos + 1);
                nobStore(JSON.parse(FullObjectText), "data");
            }
        } else if (typeof value == "object") {
            nobStore(value, "data");
        }
    }
    value = undefined;
}

function nobStore(data, type) {
    data = JSON.stringify(data);
    var name = "NOB-" + type;
    localStorage.setItem(name, data);
}

function nobGet(type) {
    return localStorage.getItem('NOB-' + type);
}

function nobMapRequest(handleData) {
    var url = "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php";
    var dataSend = {
        'action': 'info',
        'uh': getPageVariable('user.unique_hash'),
        'viewas': null
    };
    jQuery.ajax({
        url: url,
        data: dataSend,
        type: "POST",
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            // console.log(data);
            handleData(data);
        },
        error: function (error) {
            console.log("Map Request Failed");
            handleData(error);
        }
    });

    url = null;
    dataSend = null;
}

function nobLoading(location, name) {
    var element = document.getElementById(location);
    element.innerHTML = "<style type=\"text/css\">" +
            /* Universal styling */
        "    [class^=\"shaft-load\"] {" +
        "    margin: 5px auto;" +
        "    width: 60px;" +
        "    height: 15px;" +
        "}" +
        "[class^=\"shaft-load\"] > div {" +
        "    float: left;" +
        "    background: #B96CFF;" +
        "    height: 100%;" +
        "    width: 5px;" +
        "    margin-right: 1px;" +
        "    display: inline-block;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft1 {" +
        "    -webkit-animation-delay: 0.05s;" +
        "    -moz-animation-delay: 0.05s;" +
        "    -o-animation-delay: 0.05s;" +
        "    animation-delay: 0.05s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft2 {" +
        "    -webkit-animation-delay: 0.1s;" +
        "    -moz-animation-delay: 0.1s;" +
        "    -o-animation-delay: 0.1s;" +
        "    animation-delay: 0.1s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft3 {" +
        "    -webkit-animation-delay: 0.15s;" +
        "    -moz-animation-delay: 0.15s;" +
        "    -o-animation-delay: 0.15s;" +
        "    animation-delay: 0.15s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft4 {" +
        "    -webkit-animation-delay: 0.2s;" +
        "    -moz-animation-delay: 0.2s;" +
        "    -o-animation-delay: 0.2s;" +
        "    animation-delay: 0.2s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft5 {" +
        "    -webkit-animation-delay: 0.25s;" +
        "    -moz-animation-delay: 0.25s;" +
        "    -o-animation-delay: 0.25s;" +
        "    animation-delay: 0.25s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft6 {" +
        "    -webkit-animation-delay: 0.3s;" +
        "    -moz-animation-delay: 0.3s;" +
        "    -o-animation-delay: 0.3s;" +
        "    animation-delay: 0.3s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft7 {" +
        "    -webkit-animation-delay: 0.35s;" +
        "    -moz-animation-delay: 0.35s;" +
        "    -o-animation-delay: 0.35s;" +
        "    animation-delay: 0.35s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft8 {" +
        "    -webkit-animation-delay: 0.4s;" +
        "    -moz-animation-delay: 0.4s;" +
        "    -o-animation-delay: 0.4s;" +
        "    animation-delay: 0.4s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft9 {" +
        "    -webkit-animation-delay: 0.45s;" +
        "    -moz-animation-delay: 0.45s;" +
        "    -o-animation-delay: 0.45s;" +
        "    animation-delay: 0.45s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft10 {" +
        "    -webkit-animation-delay: 0.5s;" +
        "    -moz-animation-delay: 0.5s;" +
        "    -o-animation-delay: 0.5s;" +
        "    animation-delay: 0.5s;" +
        "}" +

            /* Shaft 1 */
        ".shaft-load > div {" +
        "    -webkit-animation: loading 1.5s infinite ease-in-out;" +
        "    -moz-animation: loading 1.5s infinite ease-in-out;" +
        "    -o-animation: loading 1.5s infinite ease-in-out;" +
        "    animation: loading 1.5s infinite ease-in-out;" +
        "    -webkit-transform: scaleY(0.05) translateX(-10px);" +
        "    -moz-transform: scaleY(0.05) translateX(-10px);" +
        "    -ms-transform: scaleY(0.05) translateX(-10px);" +
        "    -o-transform: scaleY(0.05) translateX(-10px);" +
        "    transform: scaleY(0.05) translateX(-10px);" +
        "}" +

        "@-webkit-keyframes loading {" +
        "    50% {" +
        "    -webkit-transform: scaleY(1.2) translateX(10px);" +
        "    -moz-transform: scaleY(1.2) translateX(10px);" +
        "    -ms-transform: scaleY(1.2) translateX(10px);" +
        "    -o-transform: scaleY(1.2) translateX(10px);" +
        "    transform: scaleY(1.2) translateX(10px);" +
        "    background: #56D7C6;" +
        "}" +
        "}" +
        "@-moz-keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "@-o-keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "@keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "</style>" +
        "<div class=\"shaft-load\">" +
        "<div class=\"shaft1\"></div>" +
        "<div class=\"shaft2\"></div>" +
        "<div class=\"shaft3\"></div>" +
        "<div class=\"shaft4\"></div>" +
        "<div class=\"shaft5\"></div>" +
        "<div class=\"shaft6\"></div>" +
        "<div class=\"shaft7\"></div>" +
        "<div class=\"shaft8\"></div>" +
        "<div class=\"shaft9\"></div>" +
        "<div class=\"shaft10\"></div>" +
        "</div>";

    element = null;
}

function nobStopLoading(location) {
    var element = document.getElementById(location);
    //element.innerHTML = null;
    element = null;
}

// VARS DONE ******************************* COMMENCE CODE
function nobScript(qqEvent) {
    if (NOBpage) {
        if (debug) console.log("RUN nobScript()");
        var mapThere;
        try {
            var NOBdata = nobGet('data');
            mapThere = document.getElementsByClassName('treasureMap')[0];
            if (mapThere.textContent.indexOf("remaining") == -1) {
                mapThere = false;
                if (debug) console.log("No map, using HTML data now");
            } else {
                mapThere = true;
            }

            if (NOBdata != null || NOBdata != undefined) {
                if (!mapRequestFailed && mapThere) {
                    nobMapRequest(function (output) {
                        if (output.status == 200 || output.status == undefined) {
                            nobStore(output, "data");
                            nobGDoc(JSON.stringify(output), "map");
                        } else {
                            console.log("Map request failed: " + output);
                            mapRequestFailed = true;
                            nobHTMLFetch();
                            output = nobGet('data');
                            nobGDoc(output, "user");
                        }
                    });
                } else {
                    console.log("Map fetch failed, using USER data from html (" + mapRequestFailed + ", " + mapThere + ")");
                    nobHTMLFetch();
                    var output = nobGet('data');
                    nobGDoc(output, "user");
                }
            } else {
                console.log("Data is not found, doing HTML fetch now.");
                nobHTMLFetch();
            }
        } catch (e) {
            if (debug) console.log('nobScript error: ' + e);
        } finally {
            mapThere = null;
        }
    }
}

function nobTravel(location) {
    if (NOBpage) {
        var url = "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php";
        var data = {
            "origin": self.getCurrentUserEnvironmentType(),
            "destination": location,
            'uh': getPageVariable('user.unique_hash')
        };
        nobAjaxPost(url, data, function (r) {
            console.log(r);
        }, function (a, b, c) {
            console.log(b, c);
        });
    }
}

// Update + message fetch
function fetchGDocStuff() {
    if (NOBpage) {
        var currVer = scriptVersion;
        var checkVer;

        document.getElementById('NOBmessage').innerHTML = "Loading";
        nobLoading('NOBmessage');

        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var userID = theData.sn_user_id;

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
        Parse.Cloud.run('nobMessage', {'user': userID}, {
            success: function (data) {
                nobStopLoading();
                data = JSON.parse(data);

                // Ad Free (returns bool)
                NOBadFree = data.adFree;
                nobStore(NOBadFree, 'adFree');

                // MESSAGE PLACING
                message = data.message;
                var NOBmessage = document.getElementById('NOBmessage');
                NOBmessage.innerHTML = message;

                // UPDATE CHECK
                checkVer = data.version;
                if (debug) console.log('Current MH AutoBot version: ' + currVer + ' / Server MH AutoBot version: ' + checkVer);
                if (checkVer > currVer) {
                    var updateElement = document.getElementById('updateElement');
                    updateElement.innerHTML = "<a href=\"https://greasyfork.org/scripts/6514-mousehunt-autobot-enhanced-revamp/code/MouseHunt%20AutoBot%20ENHANCED%20+%20REVAMP.user.js\" target='_blank'><font color='red'>YOUR SCRIPT IS OUT OF DATE, PLEASE CLICK HERE TO UPDATE IMMEDIATELY</font></a>";
                }

                // SPECIAL MESSAGE
                if (data.specialMessage != "" || data.specialMessage != undefined) {
                    var NOBspecialMessage = document.getElementById('nobSpecialMessage');
                    NOBspecialMessage.innerHTML = '<span style="background: chartreuse; font-size: 1.5em;">' + data.specialMessage + '</span>';
                }
            }, error: function (error) {
                setTimeout(function () {
                    fetchGDocStuff();
                }, 300000);
                console.log(JSON.parse(error) + ' error - Parse is now not working qq... Retrying in 5 minutes');
            }
        }).then(function (a) {

        }, function (error) {

        });
    }
}

function pingServer() {
    if (NOBpage) {
        if (debug) console.log("Running pingServer()");
        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var theUsername = theData.username;
        var thePassword = theData.sn_user_id;

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
        Parse.User.logIn(theUsername, thePassword).then(function (user) {
            //console.log("Success parse login");
            return Parse.Promise.as("Login success");
        }, function (user, error) {
            if (debug) console.log("Parse login failed, attempting to create new user now.");

            var createUser = new Parse.User();
            createUser.set("username", theUsername);
            createUser.set("password", thePassword);
            createUser.set("email", thePassword + "@mh.com");

            var usrACL = new Parse.ACL();
            usrACL.setPublicReadAccess(false);
            usrACL.setPublicWriteAccess(false);
            usrACL.setRoleReadAccess("Administrator", true);
            usrACL.setRoleWriteAccess("Administrator", true);
            createUser.setACL(usrACL);

            createUser.signUp(null, {
                success: function (newUser) {
                    if (debug) console.log(newUser);
                    pingServer();
                    return Parse.Promise.error("Creating new user, trying to login now.");
                },
                error: function (newUser, signupError) {
                    // Show the error message somewhere and let the user try again.
                    if (debug) console.log("Parse Error: " + signupError.code + " " + signupError.message);
                    return Parse.Promise.error("Error in signup, giving up serverPing now.");
                }
            });
            return Parse.Promise.error("Failed login, attempted signup, rerunning code");
        }).then(function (success) {
            var UserData = Parse.Object.extend("UserData");

            var findOld = new Parse.Query(UserData);
            findOld.containedIn("user_id", [theData.sn_user_id, JSON.stringify(theData.sn_user_id)]);
            return findOld.find();
        }).then(function (returnObj) {
            var results = returnObj;
            var promises = [];
            for (var i = 0; i < results.length; i++) {
                promises.push(results[i].destroy());
            }
            //console.log("Done parse delete");
            return Parse.Promise.when(promises);
        }).then(function (UserData) {
            UserData = Parse.Object.extend("UserData");
            var userData = new UserData();

            userData.set("user_id", theData.sn_user_id);
            userData.set("name", theData.username);
            userData.set("script_ver", scriptVersion);
            userData.set("browser", browserDetection());
            userData.set("betaUI", isNewUI);
            userData.set("data", JSON.stringify(theData));
            userData.set("addonCode", addonCode);
            var dataACL = new Parse.ACL(Parse.User.current());
            dataACL.setRoleReadAccess("Administrator", true);
            dataACL.setRoleWriteAccess("Administrator", true);
            userData.setACL(dataACL);

            return userData.save();
        }).then(function (results) {
            if (debug) console.log("Success Parse");
        }).then(function (message) {
            if (message != undefined || message != null)
                console.log("Parse message: " + message);
            if (Parse.User.current() != null) {
                Parse.User.logOut();
                //console.log("Parse logout");
            }
        }, function (error) {
            if (error != undefined || error != null) {
                if (debug) console.log("Parse error: " + error);
            }
        });
    }
}

function hideNOBMessage(time) {
    window.setTimeout(function () {
        var element = document.getElementById('NOBmessage');
        element.style.display = 'none';
    }, time);
}

function showNOBMessage() {
    document.getElementById('NOBmessage').style.display = 'block'
}

function nobInjectFFfunctions() {
    var browser = browserDetection();
    var raffleDiv = document.getElementById('nobRaffle');
    var presentDiv = document.getElementById('nobPresent');
    var addAdDiv = document.getElementById('addAdLink');
    var removeAdDiv = document.getElementById('removeAdLink');

    if (browser == 'firefox') {
        unsafeWindow.nobRaffle = exportFunction(nobRaffle, unsafeWindow);
        unsafeWindow.nobPresent = exportFunction(nobPresent, unsafeWindow);
        unsafeWindow.addGoogleAd = exportFunction(addGoogleAd, unsafeWindow);

        raffleDiv.addEventListener('click', function () {
            unsafeWindow.nobRaffle();
            return false;
        });
        presentDiv.addEventListener('click', function () {
            unsafeWindow.nobPresent();
            return false;
        });
        if (addAdDiv) {
            addAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'true');
            });
        }
        if (removeAdDiv) {
            removeAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'false');
            });
        }
    } else {
        // chrome and all other
        raffleDiv.addEventListener('click', function () {
            nobRaffle();
            return false;
        });
        presentDiv.addEventListener('click', function () {
            nobPresent();
            return false;
        });
        if (addAdDiv) {
            addAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'true');
            });
        }
        if (removeAdDiv) {
            removeAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'false');
            });
        }
    }
    raffleDiv = undefined;
    presentDiv = undefined;
    addAdDiv = undefined;
    removeAdDiv = undefined;
}

function nobRaffle() {
    var i;
    var intState = 0;
    var nobRafGiveUp = 10;
    var nobRafInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'daily_draw') {
                var tabs = $('a.tab');
                var theTab = "";
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'daily_draw') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no raffles
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No raffles found.");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'daily_draw') {
                var ballot = $(".notificationMessageList input.sendBallot");
                for (i = ballot.length - 1; i >= 0; i--) {
                    ballot[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'daily_draw') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log("Raffle interval error: " + e + ", retrying in 2 seconds. Giving up in " + (nobRafGiveUp * 2) + " seconds.");
            if (nobRafGiveUp < 1) {
                intState = -1;
            } else {
                nobRafGiveUp--;
            }
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

function nobPresent() {
    var intState = 0;
    var i;
    var nobPresGiveUp = 10;
    var nobPresInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'gifts') {
                var tabs = $('a.tab');
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'gifts') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no gifts
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No gifts found.");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'gifts') {
                var presents = $('input.accept');
                for (i = presents.length - 1; i >= 0; i--) {
                    presents[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'gifts') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log("Present interval error: " + e + ", retrying in 2 seconds. Giving up in " + (nobPresGiveUp * 2) + " seconds.");
            if (nobPresGiveUp < 1) {
                intState = -1;
            } else {
                nobPresGiveUp--;
            }
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

// CALCULATE TIMER *******************************
function currentTimeStamp() {
    return parseInt(new Date().getTime().toString().substring(0, 10), 10);
}

function createClockArea() {
    try {
        var parent = document.getElementById('loadTimersElement');
        var child = [];
        var text;

        for (i = 0; i < LOCATION_TIMERS.length; i++) {
            child[i] = document.createElement('div');
            child[i].setAttribute("id", "NOB" + LOCATION_TIMERS[i][0]);
            text = '<span id="text_' + LOCATION_TIMERS[i][0] + '">';
            child[i].innerHTML = text;
        }

        for (i = 0; i < LOCATION_TIMERS.length; i++)
            parent.insertBefore(child[i], parent.firstChild);

        parent.insertBefore(document.createElement('br'), parent.firstChild);
    } catch (e) {
        console.log("createClockArea() ERROR: " + e);
    }
}

function clockTick() {
    var temp = document.getElementById('NOBrelic');
    if (clockNeedOn && !clockTicking && temp) {
        // Clock needs to be on, but is not ticking
        updateTime();
    } else if (clockTicking && clockNeedOn && temp) {
        // Clock needs to be on and is already ticking
    } else {
        // Clock does not need to be on
        nobCalculateTime();
    }
    NOBtickerInterval = window.setTimeout(function () {
        clockTick();
    }, 15 * 60 * 1000);
}

function updateTime() {
    try {
        var timeLeft = JSON.parse(nobGet('relic'));
        if (timeLeft > 0) {
            timeLeft--;
            var element = document.getElementById('NOBrelic');
            element.innerHTML = updateTimer(timeLeft, true);
            nobStore(timeLeft, 'relic');
            nobCalculateOfflineTimers();
            clockTicking = true;

            NOBtickerTimout = window.setTimeout(function () {
                updateTime();
            }, 1000);
        } else {
            clockTicking = false;
            clockNeedOn = false;
        }
    } catch (e) {
        if (debug) console.log("UpdateTime error: " + e);
        clearTimeout(NOBtickerTimout);
        clearTimeout(NOBtickerInterval);
    }
}

function nobCalculateTime(runOnly) {
    if (debug) console.log("Running nobCalculateTime(" + runOnly + ")");
    var child;
    if (runOnly != 'relic' & runOnly != 'toxic' & runOnly != 'none')
        runOnly = 'all';

    Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
    if ((runOnly == 'relic' || runOnly == 'all') && (typeof LOCATION_TIMERS[3][1].url != 'undefined' || LOCATION_TIMERS[3][1].url != 'undefined')) {
        Parse.Cloud.run('nobRelic', {}, {
            success: function (data) {
                data = JSON.parse(data);

                if (data.result == "error") {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "<font color='red'>" + data.error + "</font>";
                } else {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "Relic hunter now in: <font color='green'>" + data.location + "</font> \~ Next move time: <span id='NOBrelic'>" + updateTimer(data.next_move, true);
                    if (data.next_move > 0) {
                        clockTicking = true;
                        nobStore(data.next_move, 'relic');
                        updateTime();
                        clockNeedOn = true;
                    } else {
                        clockTicking = false;
                        clockNeedOn = false;
                    }
                }
            }, error: function (error) {
                error = JSON.parse(error);

                var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
            }
        });
    }

    if ((runOnly == 'toxic' || runOnly == 'all') && (typeof LOCATION_TIMERS[4][1].url != 'undefined' || LOCATION_TIMERS[4][1].url != 'undefined')) {
        Parse.Cloud.run('nobToxic', {}, {
            success: function (data) {
                data = JSON.parse(data);

                if (data.result == "error") {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                    child.innerHTML = "<font color='red'>" + data.error + "</font>";
                } else {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                    if (data.level == 'Closed') {
                        data.level = {
                            color: 'red',
                            state: data.level
                        };
                    } else {
                        data.level = {
                            color: 'green',
                            state: data.level
                        };
                    }
                    if (data.percent < 0) {
                        data.percent = '';
                    } else {
                        data.percent = ' &#126; ' + (100 - data.percent) + '% left';
                    }
                    child.innerHTML = 'Toxic spill is now - <font color="' + data.level.color + '">' + data.level.state + '</font>' + data.percent;
                }
            }, error: function (error) {
                error = JSON.parse(error);

                child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
            }
        });
    }

    if (runOnly == 'all')
        nobCalculateOfflineTimers();
}

function nobCalculateOfflineTimers(runOnly) {
    //if (debug) console.log('nobCalculateOfflineTimers(' + runOnly + ')');
    if (runOnly != 'seasonal' & runOnly != 'balack' & runOnly != 'fg')
        runOnly = 'all';

    var CurrentTime = currentTimeStamp();
    var CurrentName = -1;
    var CurrentBreakdown = 0;
    var TotalBreakdown = 0;
    var iCount2;

    if (runOnly == 'seasonal') {
        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length; iCount2++)
            TotalBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

        var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[0][1].first) / LOCATION_TIMERS[0][1].length) % TotalBreakdown;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentName == -1; iCount2++) {
            CurrentBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

            if (CurrentValue < CurrentBreakdown) {
                CurrentName = iCount2;
            }
        }

        var SeasonLength = (LOCATION_TIMERS[0][1].length * LOCATION_TIMERS[0][1].breakdown[CurrentName]);
        var CurrentTimer = (CurrentTime - LOCATION_TIMERS[0][1].first);
        var SeasonRemaining = 0;

        while (CurrentTimer > 0) {
            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                SeasonRemaining = CurrentTimer;
                CurrentTimer -= (LOCATION_TIMERS[0][1].length * LOCATION_TIMERS[0][1].breakdown[iCount2]);
            }
        }

        SeasonRemaining = SeasonLength - SeasonRemaining;

        return LOCATION_TIMERS[0][1].name[CurrentName];
    } else if (runOnly == 'all') {
        for (i = 0; i < 3; i++) {
            // Reset var
            CurrentTime = currentTimeStamp();
            CurrentName = -1;
            CurrentBreakdown = 0;
            TotalBreakdown = 0;

            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length; iCount2++)
                TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

            var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[i][1].first) / LOCATION_TIMERS[i][1].length) % TotalBreakdown;

            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1; iCount2++) {
                CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

                if (CurrentValue < CurrentBreakdown) {
                    CurrentName = iCount2;
                }
            }

            var SeasonLength = (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[CurrentName]);
            var CurrentTimer = (CurrentTime - LOCATION_TIMERS[i][1].first);
            var SeasonRemaining = 0;

            while (CurrentTimer > 0) {
                for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                    SeasonRemaining = CurrentTimer;
                    CurrentTimer -= (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[iCount2]);
                }
            }

            SeasonRemaining = SeasonLength - SeasonRemaining;

            var seasonalDiv = document.getElementById('NOB' + LOCATION_TIMERS[i][0]);
            var content = "";
            content += LOCATION_TIMERS[i][0] + ': <font color="' + LOCATION_TIMERS[i][1].color[CurrentName] + '">' + LOCATION_TIMERS[i][1].name[CurrentName] + '</font>';
            if (LOCATION_TIMERS[i][1].effective != null) {
                content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
            }

            content += ' &#126; For ' + updateTimer(SeasonRemaining, true);
            seasonalDiv.innerHTML = content;
        }
        return;
    }
}

// Attempt to inject addonCode made by user
function runAddonCode() {
    if (!NOBhasPuzzle && addonCode != "") {
        console.log("%cRUNNING ADDON CODE, SCRIPT IS NOW NOT SAFE DEPENDING ON WHAT YOU DID.", "color: yellow; background: red; font-size: 50pt;");
        eval(addonCode);
    }
}
