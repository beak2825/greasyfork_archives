// ==UserScript==
// @name        MouseHunt AutoBot Enhanced Edition
// @author      Ooi Keng Siang, CnN, Luna
// @version    	1.44.1
// @namespace   http://ooiks.com/blog/mousehunt-autobot, https://devcnn.wordpress.com/
// @description An adaptation of the code by CnN and Ooi Keng Siang.
// @require		https://code.jquery.com/jquery-2.2.2.min.js
// @match		http://mousehuntgame.com/*
// @match		https://mousehuntgame.com/*
// @match		http://www.mousehuntgame.com/*
// @match		https://www.mousehuntgame.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @downloadURL https://update.greasyfork.org/scripts/369570/MouseHunt%20AutoBot%20Enhanced%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/369570/MouseHunt%20AutoBot%20Enhanced%20Edition.meta.js
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The letiable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 5 - 180
let hornTimeDelayMin = 5;
let hornTimeDelayMax = 10;

// // Enable trap check once an hour. (true/false)
let enableTrapCheck = false;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
let trapCheckTimeDiff = 45;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
let checkTimeDelayMin = 5;
let checkTimeDelayMax = 10;

// // Auto solve KR
let isAutoSolve = false;

// // Extra delay time before solving KR. (in seconds)
// // Default: 10 - 30
let krDelayMin = 10;
let krDelayMax = 30;

// // Time to start and stop solving KR. (in hours, 24-hour format)
// // Example: Script would not auto solve KR between 00:00 - 6:00 when krStopHour = 0 & krStartHour = 6;
// // To disable this feature, set both to the same value.
let krStopHour = 0;
let krStartHour = 6;

// // Extra delay time to start solving KR after krStartHour. (in minutes)
let krStartHourDelayMin = 10;
let krStartHourDelayMax = 30;

// // Time offset (in seconds) between client time and internet time
// // -ve - Client time ahead of internet time
// // +ve - Internet time ahead of client time
let g_nTimeOffset = 0;

// // Maximum retry of solving KR.
// // If KR solved more than this number, pls solve KR manually ASAP in order to prevent MH from caught in botting
let kingsRewardRetryMax = 3;

// // State to indicate whether to save KR image into localStorage or not
let saveKRImage = true;

// // Maximum number of KR image to be saved into localStorage
let maxSaveKRImage = 75;

// // The script will pause if player at different location that hunt location set before. (true/false)
// // Note: Make sure you set showTimerInPage to true in order to know what is happening.
let pauseAtInvalidLocation = false;

// // Maximum number of log to be saved into sessionStorage
let maxSaveLog = 750;

// == Basic User Preference Setting (End) ==

// == Advance User Preference Setting (Begin) ==
// // The letiable in this section contain some advance option that will change the script behavior.
// // Edit this letiable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
let showTimerInTitle = false;

// // Embed a timer in page to show next hunter horn timer, highly recommanded to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
let showTimerInPage = true;

// // Default time to reload the page when bot encounter error. (in seconds)
let errorReloadTime = 60;

// // Time interval for script timer to update the time. May affect timer accuracy if set too high value. (in seconds)
let timerRefreshInterval = 1;

// // Trap List
let objTrapList = {
    weapon: [],
    base: [],
    trinket: ['Party Charm', 'Snowball Charm'],
    bait: ['Ancient String Cheese', 'Ancient String Cheese Potions']
};

// == Advance User Preference Setting (End) ==


// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
let g_strVersion = "";
let g_strScriptHandler = "";
let mhPlatform = false;
let g_strHTTP = 'http';
let lastDateRecorded = new Date();
let hornTime = 900;
let hornTimeDelay = 0;
let checkTimeDelay = 0;
let isKingReward = false;
let lastKingRewardSumTime;
let g_nBaitQuantity = -1;
let huntLocation;
let currentLocation;
let checkTime;
let hornRetryMax = 10;
let hornRetry = 0;
let nextActiveTime = 900;
let kingsRewardRetry = 0;
let keyKR = [];
let separator = "~";

// element in page
let nextHornTimeElement;
let checkTimeElement;
let lastKingsRewardTimeElement;
let lastKingRewardSumTimeElement;
let travelElement;
let strHornButton = 'huntersHornView__horn';
let strCampButton = 'campbutton';
let isNewUI = false;
let debugKR = false;

function retrieveDataFirst() {
    try {
        const {
            bait_quantity,
            has_puzzle,
            next_activeturn_seconds,
            environment_name
        } = this.user;

        g_nBaitQuantity = parseInt(bait_quantity);
        isKingReward = has_puzzle;
        nextActiveTime = next_activeturn_seconds;
        hornTimeDelay = hornTimeDelayMin + parseInt(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));
        hornTime = nextActiveTime + hornTimeDelay;
        lastDateRecorded = new Date();
        currentLocation = environment_name;

        // get trap check time
        calculateNextTrapCheckInMinute();
        // get last location
        let huntLocationCookie = getItemFromLocalStorage("huntLocation");
        if (isNullOrUndefined(huntLocationCookie)) {
            huntLocation = currentLocation;
            setItemToLocalStorage("huntLocation", currentLocation);
        } else {
            huntLocation = huntLocationCookie;
            setItemToLocalStorage("huntLocation", huntLocation);
        }
        // get last king reward time
        let lastKingRewardDate = getItemFromLocalStorage("lastKingRewardDate");
        if (isNullOrUndefined(lastKingRewardDate)) {
            lastKingRewardSumTime = -1;
        } else {
            let lastDate = new Date(lastKingRewardDate);
            lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
        }
        return true;
    } catch (err) {
        return false
    }
}

function retrieveData() {
    try {
        // get next horn time
        currentLocation = this.user.environment_name;
        isKingReward = getKingRewardStatus();
        g_nBaitQuantity = parseInt(this.user.bait_quantity);
        nextActiveTime = this.user.next_activeturn_seconds;
        if (nextActiveTime === "" || isNaN(nextActiveTime)) {
            // fail to retrieve data, might be due to slow network

            // reload the page to see it fix the problem
            window.setTimeout(function () {
                reloadWithMessage("Fail to retrieve data. Reloading...", false);
            }, 5000);
        } else {
            // got the timer right!
            if (nextActiveTime === 0) {
                hornTimeDelay = 0;
            } else {
                // calculate the delay
                hornTimeDelay = hornTimeDelayMin + parseInt(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));
            }
            console.plog('Horn Time:', nextActiveTime, 'Delay:', hornTimeDelay);
            // safety mode, include extra delay like time in horn image appear
            hornTime = nextActiveTime + hornTimeDelay;
            lastDateRecorded = new Date();
        }
        // get trap check time
        calculateNextTrapCheckInMinute();
        getJournalDetail();
        runMapScript();
    } catch (e) {
        console.perror('retrieveData', e.message);
    }
}

function getKingRewardStatus() {
    let strValue = getPageVariable('user.has_puzzle');
    console.plog('user.has_puzzle:', strValue);
    let headerOrHud = document.getElementById('mousehuntHud');
    if (headerOrHud !== null) {
        let textContentLowerCase = headerOrHud.textContent.toLowerCase();
        if (textContentLowerCase.indexOf("king reward") > -1 ||
            textContentLowerCase.indexOf("king's reward") > -1 ||
            textContentLowerCase.indexOf("kings reward") > -1) {
            return true;
        } else {
            return (strValue === 'true');
        }
    } else {
        return false;
    }
}

function getJournalDetail() {
    let classJournal = document.getElementsByClassName('journaltext');
    let i, j, eleA, strTrap, temp, nIndexStart, nIndexEnd, nIndexCharm, nIndexCheese;
    let objResave = {
        trinket: false,
        bait: false
    };
    for (i = 0; i < classJournal.length; i++) {

        eleA = classJournal[i].getElementsByTagName('a');
        if (eleA.length > 0) { // has loot(s)
            for (j = 0; j < eleA.length; j++) {
                strTrap = '';
                temp = eleA[j].textContent;
                if (temp.indexOf('Charm') > -1) {
                    strTrap = 'trinket';
                    temp = temp.replace(/Charms/, 'Charm');
                } else if (temp.indexOf('Cheese') > -1) {
                    strTrap = 'bait';
                }
                temp = temp.replace(/\d+/, '');
                temp = temp.trimLeft();
                if (strTrap !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
                    console.plog('Add', temp, 'into', strTrap, 'list');
                    objTrapList[strTrap].unshift(temp);
                    objResave[strTrap] = true;
                }
            }
        } else {
            nIndexStart = -1;
            temp = classJournal[i].textContent.replace(/\./, '');
            temp = temp.replace(/Charms/, 'Charm');
            temp = temp.split(' ');
            if (classJournal[i].textContent.indexOf('crafted') > -1) {
                nIndexStart = temp.indexOf('crafted');
                if (nIndexStart > -1) {
                    nIndexStart += 2;
                }
            } else if (classJournal[i].textContent.indexOf('purchased') > -1) {
                nIndexStart = temp.indexOf('purchased');
                if (nIndexStart > -1) {
                    nIndexStart += 2;
                }
            }
            if (nIndexStart > -1) {
                strTrap = '';
                nIndexEnd = -1;
                nIndexCharm = temp.indexOf('Charm');
                nIndexCheese = temp.indexOf('Cheese');
                if (nIndexCharm > -1) {
                    strTrap = 'trinket';
                    nIndexEnd = nIndexCharm + 1;
                } else if (nIndexCheese > -1) {
                    strTrap = 'bait';
                    nIndexEnd = nIndexCheese + 1;
                }
                if (strTrap !== '' && nIndexEnd > -1) {
                    temp = temp.slice(nIndexStart, nIndexEnd);
                    temp = temp.join(' ');
                    if (temp !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
                        console.plog('Add', temp, 'into', strTrap, 'list');
                        objTrapList[strTrap].unshift(temp);
                        objResave[strTrap] = true;
                    }
                }
            }
        }
    }
    for (let prop in objResave) {
        if (objResave.hasOwnProperty(prop) && objResave[prop] === true)
            setItemToLocalStorage("TrapList" + capitalizeFirstLetter(prop), objTrapList[prop].join(","));
    }
    setItemToLocalStorage('LastRecordedJournal', classJournal[0].parentNode.textContent);
}

function checkJournalDate() {
    let reload = false;

    let journalDateDiv = document.getElementsByClassName('journaldate');
    if (journalDateDiv) {
        let journalDateStr = journalDateDiv[0].innerHTML.toString();
        let midIndex = journalDateStr.indexOf(":", 0);
        let spaceIndex = journalDateStr.indexOf(" ", midIndex);

        if (midIndex >= 1) {
            let hrStr = journalDateStr.substring(0, midIndex);
            let minStr = journalDateStr.substr(midIndex + 1, 2);
            let hourSysStr = journalDateStr.substr(spaceIndex + 1, 2);

            let nowDate = new Date();
            let lastHuntDate = new Date();
            if (hourSysStr === "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            } else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
        } else {
            reload = true;
        }
    }

    if (reload) {
        reloadWithMessage("Timer error. Try reload to fix.", true);
    }

    return (reload);
}

function checkIntroContainer() {
    let introContainerDiv = document.getElementById('introContainer');
    let gotIntroContainerDiv = !!introContainerDiv;
    return (gotIntroContainerDiv);
}

console.plog = function () {
    console.log.apply(console, arguments);
};

console.perror = function () {
    console.error.apply(console, arguments);
};

console.pdebug = function () {
    console.debug.apply(console, arguments);
};

function initializeChromeExtension() {
    try {
        if (!isNullOrUndefined(chrome.runtime) && !isNullOrUndefined(chrome.runtime.id)) {
            g_strScriptHandler = "Extensions";
            g_strVersion = chrome.runtime.getManifest().version;
        } else {
            g_strScriptHandler = GM_info.scriptHandler + " " + GM_info.version;
            g_strVersion = GM_info.script.version;
        }
    } catch (e) {
        console.perror('Before exeScript', e.message);
        g_strVersion = undefined;
        g_strScriptHandler = undefined;
    }
}

function embedTimer(targetPage) {
    function createTitleDiv() {
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', 'titleElement');
        titleElement.innerHTML = `<b>MouseHunt AutoBot (version ${g_strVersion} Enhanced Edition)</b>`;
        return titleElement;
    }

    function createLastKingRewardsDiv() {
        let lastKingRewardDate = getItemFromLocalStorage("lastKingRewardDate");
        let lastDateStr;
        if (isNullOrUndefined(lastKingRewardDate)) {
            lastDateStr = '-';
        } else {
            let lastDate = new Date(lastKingRewardDate);
            lastDateStr = `${lastDate.toDateString()} ${lastDate.toTimeString().substring(0, 8)}`;
            lastDate = null;
        }

        lastKingsRewardTimeElement = document.createElement('div');
        lastKingsRewardTimeElement.setAttribute('id', 'lastKingsRewardTimeElement');
        lastKingsRewardTimeElement.innerHTML = `<b>Last King's Reward:</b> ${lastDateStr} `;
        return lastKingsRewardTimeElement;
    }

    function createNextHornTimeDiv() {
        nextHornTimeElement = document.createElement('div');
        nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
        nextHornTimeElement.innerHTML = '<b>Next Hunter Horn Time:</b> Loading...';
        return nextHornTimeElement;
    }

    function createNextCheckTimeDiv() {
        checkTimeElement = document.createElement('div');
        checkTimeElement.setAttribute('id', 'checkTimeElement');
        checkTimeElement.innerHTML = '<b>Next Trap Check Time:</b> Loading...';
        return checkTimeElement;
    }

    function createTravelDiv() {
        travelElement = document.createElement('div');
        travelElement.setAttribute('id', 'travelElement');
        travelElement.innerHTML = '<b>Target Hunt Location:</b> Loading...';
        return travelElement;
    }

    function createLastKingRewardsSumTimeFont() {
        lastKingRewardSumTimeElement = document.createElement('font');
        lastKingRewardSumTimeElement.setAttribute('id', 'lastKingRewardSumTimeElement');
        lastKingRewardSumTimeElement.innerHTML = '(Loading...)';
        return lastKingRewardSumTimeElement;
    }

    function createLastPageLoadTimeDiv() {
        let nowDate = new Date();
        let loadTimeElement = document.createElement('div');
        loadTimeElement.setAttribute('id', 'loadTimeElement');
        loadTimeElement.innerHTML = `<b>Last Page Load: </b>${nowDate.toDateString()} ${nowDate.toTimeString().substring(0, 8)}`;
        return loadTimeElement;
    }

    function createHelpTextDiv() {
        let helpTextElement = document.createElement('div');
        helpTextElement.setAttribute('id', 'helpTextElement');
        if (mhPlatform) {
            helpTextElement.innerHTML = `<b>Note:</b> MouseHunt AutoBot will only run at <a href='${g_strHTTP}://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.`;
        }
        return helpTextElement;
    }

    if (showTimerInPage) {
        let headerElement;
        if (mhPlatform) {
            headerElement = document.getElementById('noscript');
        }

        if (headerElement) {
            let timerDivElement = document.createElement('div');

            let hr1Element = document.createElement('hr');
            timerDivElement.appendChild(hr1Element);
            hr1Element = null;

            // show bot title and version
            timerDivElement.appendChild(createTitleDiv());

            if (targetPage) {
                timerDivElement.appendChild(createNextHornTimeDiv());
                timerDivElement.appendChild(createNextCheckTimeDiv());

                if (pauseAtInvalidLocation) {
                    // location information only display when enable this feature
                    timerDivElement.appendChild(createTravelDiv());
                }

                timerDivElement.appendChild(createLastKingRewardsDiv());
                lastKingsRewardTimeElement.appendChild(createLastKingRewardsSumTimeFont());

                timerDivElement.appendChild(createLastPageLoadTimeDiv());
            } else {
                // player currently navigating other page instead of hunter camp
                timerDivElement.appendChild(createHelpTextDiv());
            }

            let hr2Element = document.createElement('hr');
            timerDivElement.appendChild(hr2Element);

            // embed all msg to the page
            headerElement.parentNode.insertBefore(timerDivElement, headerElement);
        }
    }
}

function setItemToLocalStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.setItem(name, value);
    }
}

function removeItemFromLocalStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.removeItem(name);
    }
}

function getItemFromLocalStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        return (window.localStorage.getItem(name));
    }
}

function trapCheck() {
    // update timer
    displayTimer("Checking The Trap...", "Checking trap now...", "Checking trap now...");

    // simulate mouse click on the camp button
    let campElement = document.getElementsByClassName(strCampButton)[0];
    fireEvent(campElement, 'click');
    campElement = null;

    // reload the page if click on camp button fail
    // window.setTimeout(function () { reloadWithMessage("Fail to click on camp button. Reloading...", false); }, 5000);
    let nDelay = 5000;
    window.setTimeout(function () {
        retrieveData();
    }, nDelay);
    window.setTimeout(function () {
        countdownTimer();
    }, nDelay + timerRefreshInterval * 1000);
}

function calculateNextTrapCheckInMinute() {
    if (enableTrapCheck) {
        let now = (g_nTimeOffset === 0) ? new Date() : new Date(Date.now() + g_nTimeOffset * 1000);
        let temp = (trapCheckTimeDiff * 60) - (now.getMinutes() * 60 + now.getSeconds());
        checkTimeDelay = checkTimeDelayMin + parseInt(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
        checkTime = (now.getMinutes() >= trapCheckTimeDiff) ? 3600 + temp : temp;
        checkTime += checkTimeDelay;
    }
}

function capitalizeFirstLetter(strIn) {
    return strIn.charAt(0).toUpperCase() + strIn.slice(1);
}

function assignMissingDefault(obj, objDefault) {
    let bResave = false;
    for (let prop in objDefault) {
        if (objDefault.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
            obj[prop] = objDefault[prop];
            bResave = true;
        }
    }

    return bResave;
}

function reloadPage(soundHorn) {
    // reload the page
    let strTurn = (soundHorn) ? "turn.php" : "";
    if (mhPlatform) {
        // for mousehunt game only
        window.location.href = g_strHTTP + "://www.mousehuntgame.com/" + strTurn;
    }
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    reloadPage(soundHorn);
}

function receiveMessage(event) {
    if (!debugKR && !isAutoSolve)
        return;

    console.plog("Event origin:", event.origin);
    if (event.origin.indexOf("mhcdn") > -1 || event.origin.indexOf("mousehuntgame") > -1 || event.origin.indexOf("dropbox") > -1) {
        if (typeof (event.data) === 'string') {
            if (event.data.indexOf("~") > -1) {
                let result = event.data.substring(0, event.data.indexOf("~"));
                if (saveKRImage) {
                    let processedImg = event.data.substring(event.data.indexOf("~") + 1, event.data.length);
                    let strKR = "KR" + separator;
                    strKR += Date.now() + separator;
                    strKR += result + separator;
                    strKR += "RETRY" + kingsRewardRetry;
                    try {
                        setItemToLocalStorage(strKR, processedImg);
                    } catch (e) {
                        console.perror('receiveMessage', e.message);
                    }
                }
                FinalizePuzzleImageAnswer(result);
            } else if (event.data.indexOf("#") > -1) {
                let value = event.data.substring(1, event.data.length);
                setItemToLocalStorage("krCallBack", value);
            } else if (event.data.indexOf('Log_') > -1)
                console.plog(event.data.split('_')[1]);
            else if (event.data.indexOf('MHAKRS_') > -1) {
                let temp = event.data.split('_');
                console.plog(temp[0], temp[1]);
                setItemToLocalStorage(temp[0], temp[1]);
            }
        }
    }
}

function isNullOrUndefined(obj) {
    return (obj === null || obj === undefined || obj === 'null' || obj === 'undefined');
}

window.addEventListener("message", receiveMessage, false);

if (debugKR) {
    CallKRSolver();
}

initializeEnvironment();
exeScript();

function initializeEnvironment() {
    initializeChromeExtension();
    browserDetection();
}

function exeScript() {
    console.plog("exeScript() Start");

    if (!isChromeBrowserFromLocalStorage) {
        console.plog("Current browser is not supported.");
        console.plog("exeScript() End");
        return;
    }

    setItemToLocalStorage('MHAB', g_strVersion);
    setItemToLocalStorage('ScriptHandler', g_strScriptHandler);

    // check user running this script from where
    if (window.location.href.indexOf("mousehuntgame.com") !== -1) {
        mhPlatform = true;
        setItemToLocalStorage('Platform', 'MH');
    }

    // check if user running in https secure connection
    let bSecureConnection = (window.location.href.indexOf("https://") > -1);
    g_strHTTP = (bSecureConnection) ? 'https' : 'http';
    setItemToLocalStorage('HTTPS', bSecureConnection);

    if (mhPlatform) {
        if (window.location.href === "http://www.mousehuntgame.com/" ||
            window.location.href === "http://www.mousehuntgame.com/#" ||
            window.location.href === "http://www.mousehuntgame.com/?switch_to=standard" ||
            window.location.href === "https://www.mousehuntgame.com/" ||
            window.location.href === "https://www.mousehuntgame.com/camp.php" ||
            window.location.href === "https://www.mousehuntgame.com/camp.php#" ||
            window.location.href === "https://www.mousehuntgame.com/#" ||
            window.location.href === "https://www.mousehuntgame.com/?switch_to=standard" ||
            window.location.href.indexOf("mousehuntgame.com/turn.php") !== -1 ||
            window.location.href.indexOf("mousehuntgame.com/?newpuzzle") !== -1 ||
            window.location.href.indexOf("mousehuntgame.com/index.php") !== -1) {
            // page to execute the script!

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
                document.title = "Fail to retrieve data from page. Reloading in " + timeFormat(errorReloadTime);
                window.setTimeout(function () {
                    reloadPage(false);
                }, errorReloadTime * 1000);
            }
        } else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    console.plog("exeScript() End");
}

function action() {
    if (isKingReward) {
        kingRewardAction();
    } else if (pauseAtInvalidLocation && (huntLocation !== currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
        if (mhPlatform) {
            displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
        }
        displayKingRewardSumTime(null);
        // pause script
    } else if (g_nBaitQuantity === 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    } else {
        // update location
        displayLocation(huntLocation);

        let isHornSounding = false;

        // check if the horn image is visible
        let headerElement = document.getElementsByClassName(strHornButton)[0];
        if (headerElement) {
            let headerStatus = headerElement.getAttribute('class');
            headerStatus = headerStatus.toLowerCase();
            if (headerStatus.indexOf("horn--ready") !== -1) {
                // if the horn image is visible, why do we need to wait any more, sound the horn!
                soundHorn();

                // make sure the timer don't run twice!
                isHornSounding = true;
            }
        }

        if (isHornSounding === false) {
            // start timer
            window.setTimeout(function () {
                countdownTimer();
            }, timerRefreshInterval * 1000);
        }

        try {
            getJournalDetail();
        } catch (e) {
            console.perror('action:', e.message);
        }
    }
}

function soundHorn() {
    let isAtCampPage = document.getElementsByClassName('trapImageView-trapAuraContainer').length > 0;
    if (!isAtCampPage) {
        displayTimer("Not At Camp Page", "Not At Camp Page", "Not At Camp Page");
        window.setTimeout(function () {
            soundHorn();
        }, timerRefreshInterval * 1000);
        return;
    }

    // update timer
    displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

    let scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }

    // safety mode, check the horn image is there or not before sound the horn
    let headerElement = document.getElementsByClassName(strHornButton)[0];
    if (headerElement) {
        // need to make sure that the horn image is ready before we can click on it
        let headerStatus = headerElement.getAttribute('class').toLowerCase();
        if (headerStatus.indexOf("horn--ready") !== -1) {
            // found the horn image, let's sound the horn!
            // update timer
            displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");
            // simulate mouse click on the horn
            let hornElement = document.getElementsByClassName(strHornButton)[0];
            fireEvent(hornElement, 'mousedown');
            fireEvent(hornElement, 'click');
            fireEvent(hornElement, 'mouseup');
            // double check if the horn was already sounded
            window.setTimeout(function () {
                afterSoundingHorn();
            }, 5000);
        } else if (headerStatus.indexOf("horn--sounding") !== -1 || headerStatus.indexOf("horn--sounded") !== -1) {
            // some one just sound the horn...
            // update timer
            displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");
            // load the new data
            window.setTimeout(function () {
                afterSoundingHorn();
            }, 5000);
        } else if (headerStatus.indexOf("horn--waiting") !== -1) {
            // the horn is not appearing, let check the time again
            // update timer
            displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");
            // sync the time again, maybe user already click the horn
            retrieveData();
            checkJournalDate();
            // loop again
            window.setTimeout(function () {
                countdownTimer();
            }, timerRefreshInterval * 1000);
        } else {
            // some one steal the horn!
            // update timer
            displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");
            // try to click on the horn
            let hornElement = document.getElementsByClassName(strHornButton)[0];
            fireEvent(hornElement, 'mousedown');
            fireEvent(hornElement, 'click');
            fireEvent(hornElement, 'mouseup');
            // double check if the horn was already sounded
            window.setTimeout(function () {
                afterSoundingHorn(true);
            }, 5000);
        }
    } else {
        // something wrong, can't even found the header...
        // reload the page see if thing get fixed
        reloadWithMessage("Fail to find the horn header. Reloading...", false);
    }
}

function afterSoundingHorn(bLog) {

    let scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }

    let headerElement = document.getElementsByClassName(strHornButton)[0];
    if (headerElement) {
        // double check if the horn image is still visible after the script already sound it
        let headerStatus = headerElement.getAttribute('class').toLowerCase();
        if (bLog === true) console.plog('headerStatus:', headerStatus);
        if (headerStatus.indexOf("horn--ready") !== -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            let hornElement = document.getElementsByClassName(strHornButton)[0];
            fireEvent(hornElement, 'mousedown');
            fireEvent(hornElement, 'click');
            fireEvent(hornElement, 'mouseup');

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
                    afterSoundingHorn();
                }, 1000);
            }
        } else if (headerStatus.indexOf("horn--sounding") !== -1) {
            // the horn is already sound, but the network seen to slow on fetching the data

            // update timer
            displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

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
                    afterSoundingHorn();
                }, 3000);
            }
        } else {
            // everything look ok

            // update timer
            displayTimer("Horn sounded. Synchronizing Data...", "Horn sounded. Synchronizing data...", "Horn sounded. Synchronizing data...");

            // reload data
            retrieveData();

            // script continue as normal
            window.setTimeout(function () {
                countdownTimer();
            }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    let scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = `
function soundedHorn(){
let scriptNode = document.getElementById("scriptNode");
if (scriptNode){
scriptNode.setAttribute("soundedHornAtt", "true");
}
scriptNode = null;
}`;

    // find the head node and insert the script into it
    let headerElement;
    if (mhPlatform) {
        headerElement = document.getElementById('noscript');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);

    // change the function call of horn
    let testNewUI = document.getElementById('envHeaderImg');
    if (!isNullOrUndefined(testNewUI)) {
        // old UI
        isNewUI = false;
        strHornButton = 'huntersHornView__horn';
        strCampButton = 'mousehuntHud-campButton';
    }
    setItemToLocalStorage('NewUI', isNewUI);

    let hornButtonLink = document.getElementsByClassName(strHornButton)[0];
    let oriStr = hornButtonLink.hasAttribute('onclick') ? hornButtonLink.getAttribute('onclick').toString() : '';
    let index = oriStr.indexOf('return false;');
    let modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);
}

function sunkenCity() {
    let zoneName = document.getElementsByClassName('zoneName')[0].innerText
    let listOfPreciousZones = [
        'Sunken Treasure',
        'Deep Oxygen Stream',
        'Oxygen Stream',
        'Magma Flow',
        'Lair of the Ancients',
        'Monster Trench'
    ]
    let [trinket, quantity] = document.querySelectorAll('[data-item-type="anchor_trinket"]')
    if (listOfPreciousZones.includes(zoneName)) {
        if (!trinket.className.includes('active') && parseInt(quantity.innerText) > 0) {
            fireEvent(trinket, 'click')
        }
    } else {
        if (trinket.className.includes('active')) {
            fireEvent(trinket, 'click')
        }
    }
}

function tableOfContents() {
    let timeout = 2000;
    let weaponToBeEquipped = 3421 // Chrome Thought Obliterator

    if (this.user.weapon_item_id != weaponToBeEquipped) {
        fireEvent(document.querySelector('button[data-item-classification="weapon"]'), 'click')

        timeout += 5000
        window.setTimeout(() =>
                fireEvent(document.querySelector(`a[data-item-id="${weaponToBeEquipped}"][data-item-classification="weapon"]`), 'click'),
            timeout
        )
        window.setTimeout(() =>
                fireEvent(document.querySelector('a[class="campPage-trap-blueprint-closeButton"]'), 'click'),
            timeout
        )
        timeout += 1000
    }


    if (!this.user.enviroment_atts.show_book) {
        window.setTimeout(() =>
                fireEvent(document.querySelector('a[class="tableOfContentsView-startWritingButton active canStart"]'), 'click'),
            timeout
        )
        timeout += 2000


        window.setTimeout(() =>
                fireEvent(document.querySelector('a[class="tableOfContentsView-selectInitialBait final_draft_derby_cheese"]'), 'click'),
            timeout
        )
        timeout += 2000

        window.setTimeout(() =>
                fireEvent(document.querySelector('a[class="folkloreForestRegionView-button table_of_contents confirm"]'), 'click'),
            timeout
        )
    } else if (this.user.enviroment_atts.current_book.name === 'Novella' && this.user.bait_name !== 'Second Draft Derby Cheese') {
        let baitElement = document.querySelector('a[class="folkloreForestRegionView-bait-image"][title="Second Draft Derby Cheese"]');
        window.setTimeout(() =>
                fireEvent(baitElement, 'click'),
            timeout
        )
        timeout += 2000


    } else if (this.user.enviroment_atts.current_book.name === 'Novel') {
        window.setTimeout(() => {
                console.log('Cancelling from current TOC')
                fireEvent(document.querySelector('a[class="tableOfContentsProgressView-cancelButton active"]'), 'click')
            },
            timeout
        )
        timeout += 5000

        window.setTimeout(() => {
                console.log('Selecting confirmation')
                fireEvent(document.querySelector('a[class="folkloreForestRegionView-button table_of_contents"]'), 'click')
            },
            timeout
        )
        timeout += 5000

        window.setTimeout(() => {
                console.log('Claiming TOC')
                fireEvent(document.querySelector('a[class="tableOfContentsProgressView-claimButton"]'), 'click')
                fireEvent(document.querySelector('a[class="tableOfContentsProgressView-claimButton reveal"]'), 'click')
            },
            timeout
        )
        timeout += 5000

        window.setTimeout(() => {
                console.log('Closing final dialog');
                fireEvent(document.querySelector('a[class="folkloreForestRegionView-dialog-continueButton jsDialogClose"]'), 'click')
                tableOfContents();
            },
            timeout
        )
    }

}

function runMapScript() {
    switch (currentLocation) {
        case 'Valour Rift':
            valourRift();
            break;
        case 'Sunken City':
            sunkenCity();
            break;
        case 'Table of Contents':
            tableOfContents();
            break;
    }
}

runMapScript();

function valourRift() {
    const fuelArmElement = 'valourRiftHUD-fuelContainer-armButton';
    const fuelQuantityElement = 'valourRiftHUD-fuelContainer-quantity';

    let fuelElement = document.getElementsByClassName(fuelArmElement)[0];
    let fuelLeft = parseInt(document.getElementsByClassName(fuelQuantityElement)[0].textContent);
    let fuelToggled = document.getElementsByClassName(fuelArmElement)[0].classList.contains('active');

    if (this.user.enviroment_atts.is_at_eclipse) {
        if (fuelLeft > 0 && !fuelToggled) {
            fireEvent(fuelElement, 'click');
        }
    } else {
        if (fuelToggled) {
            fireEvent(fuelElement, 'click')
        }
    }
}

function setSessionStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.setItem(name, value);
    }
}

function removeSessionStorage(name) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.removeItem(name);
    }
}

function fireEvent(element, event) {
    if (element === null || element === undefined)
        return;
    let evt;
    // dispatch for firefox + others
    evt = new MouseEvent(event, {
        "bubbles": true,
        "cancelable": true
    });

    try {
        return !element.dispatchEvent(evt);
    } finally {
        element = null;
        event = null;
        evt = null;
    }
}

function getPageVariable(variableName) {
    let value = "";
    try {
        if (isChromeBrowserFromLocalStorage()) {
            let scriptElement = document.createElement("script");
            scriptElement.setAttribute('id', "scriptElement");
            scriptElement.setAttribute('type', "text/javascript");
            scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
            document.body.appendChild(scriptElement);

            value = scriptElement.innerHTML;
            document.body.removeChild(scriptElement);
            scriptElement = null;
            variableName = null;
        }
    } catch (e) {
        console.perror('getPageVariable', e.message);
    }
    return value;
}

function timeElapsed(dateA, dateB) {
    let elapsed;

    let secondA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    let secondB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    elapsed = (secondB - secondA) / 1000;

    try {
        return (elapsed);
    } finally {
        elapsed = null;
    }
}

function timeFormat(time) {
    let timeString;
    let hr = Math.floor(time / 3600);
    let min = Math.floor((time % 3600) / 60);
    let sec = (time % 3600 % 60) % 60;

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
    let timeString;

    if (time !== -1) {
        let day = Math.floor(time / 86400);
        let hr = Math.floor((time % 86400) / 3600);
        let min = Math.floor((time % 3600) / 60);

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

function browserDetection() {
    let browserName = "unknown";
    let userAgentStr = navigator.userAgent.toString().toLowerCase();
    if (userAgentStr.indexOf("firefox") >= 0)
        browserName = "firefox";
    else if (userAgentStr.indexOf("opera") >= 0 || userAgentStr.indexOf("opr/") >= 0)
        browserName = "opera";
    else if (userAgentStr.indexOf("chrome") >= 0)
        browserName = "chrome";
    setItemToLocalStorage('Browser', browserName);
    setItemToLocalStorage('UserAgent', userAgentStr);
    return browserName;
}

function isChromeBrowserFromLocalStorage() {
    return getItemFromLocalStorage('Browser') === 'chrome';
}

function displayTimer(title, nextHornTime, checkTime) {
    if (showTimerInTitle) {
        document.title = title;
    }

    if (showTimerInPage) {
        nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> " + nextHornTime;
        checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> " + checkTime;
    }
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

function countdownTimer() {
    try {
        if (isKingReward) {
            // update timer
            displayTimer("King's Reward!", "King's Reward!", "King's Reward!");
            displayKingRewardSumTime("Now");
            lastKingRewardSumTime = 0;
            // reload the page so that the sound can be play
            // simulate mouse click on the camp button
            fireEvent(document.getElementsByClassName(strCampButton)[0], 'click');

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        } else if (pauseAtInvalidLocation && (huntLocation !== currentLocation)) {
            // update timer
            displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
            if (mhPlatform) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
            displayKingRewardSumTime(null);

            // pause script
        } else {
            let dateNow = new Date();
            let intervalTime = timeElapsed(lastDateRecorded, dateNow);
            lastDateRecorded = dateNow;

            if (enableTrapCheck) checkTime -= intervalTime;

            // update time
            hornTime -= intervalTime;
            if (lastKingRewardSumTime !== -1) {
                lastKingRewardSumTime += intervalTime;
            }

            if (hornTime <= 0) {
                // blow the horn!
                hornTime = 0;
                if (g_nBaitQuantity > 0)
                    soundHorn();
                else {
                    displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
                    displayLocation(huntLocation);
                    displayKingRewardSumTime(null);
                }
            } else if (enableTrapCheck && checkTime <= 0) {
                // trap check!
                if (g_nBaitQuantity > 0)
                    trapCheck();
                else {
                    displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
                    displayLocation(huntLocation);
                    displayKingRewardSumTime(null);
                }
            } else {
                if (enableTrapCheck) {
                    // update timer
                    displayTimer("Horn: " + timeFormat(hornTime) + " | Check: " + timeFormat(checkTime),
                        timeFormat(hornTime) + "  <i>(included extra " + timeFormat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        timeFormat(checkTime) + "  <i>(included extra " + timeFormat(checkTimeDelay) + " delay)</i>");
                } else {
                    // update timer
                    displayTimer("Horn: " + timeFormat(hornTime),
                        timeFormat(hornTime) + "  <i>(included extra " + timeFormat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        "-");
                    // check if user manaually sounded the horn
                    let scriptNode = document.getElementById("scriptNode");
                    if (scriptNode) {
                        let isHornSounded = scriptNode.getAttribute("soundedHornAtt");
                        if (isHornSounded === "true") {
                            // sound horn function do the rest
                            soundHorn();
                            // stop loopping
                            return;
                        }
                    }
                }
                // set king reward sum time
                displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));
                window.setTimeout(function () {
                    (countdownTimer)();
                }, timerRefreshInterval * 1000);
            }
        }
    } catch (e) {
        console.perror('countdownTimer', e.message);
    }
}

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward!", "King's Reward!");
    displayLocation("-");

    // focus on the answer input
    let inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        for (let i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') === "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
    }
    inputElementList = null;

    // retrieve last king's reward time
    let lastDate = getItemFromLocalStorage("lastKingRewardDate");
    lastDate = (isNullOrUndefined(lastDate)) ? new Date(0) : new Date(lastDate);

    // record last king's reward time
    let nowDate = new Date();
    setItemToLocalStorage("lastKingRewardDate", nowDate.toString());
    let nTimezoneOffset = -(nowDate.getTimezoneOffset()) * 60000;
    let nInterval = Math.abs(nowDate - lastDate) / 1000; // in second

    console.plog("Last KR:", new Date(lastDate + nTimezoneOffset).toISOString(), "Current KR:", new Date(nowDate + nTimezoneOffset).toISOString(), "Interval:", timeFormat(nInterval));
    if (!isAutoSolve) {
        let intervalCRB = setInterval(
            function () {
                if (checkResumeButton()) {
                    clearInterval(intervalCRB);
                    intervalCRB = null;
                }
            }, 1000);
        return;
    }

    let krDelaySec = krDelayMax;
    if (kingsRewardRetry > 0) {
        let nMin = krDelayMin / (kingsRewardRetry * 2);
        let nMax = krDelayMax / (kingsRewardRetry * 2);
        krDelaySec = nMin + Math.floor(Math.random() * (nMax - nMin));
    } else
        krDelaySec = krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));

    let krStopHourNormalized = krStopHour;
    let krStartHourNormalized = krStartHour;
    if (krStopHour > krStartHour) { // e.g. Stop to Start => 22 to 06
        let offset = 24 - krStopHour;
        krStartHourNormalized = krStartHour + offset;
        krStopHourNormalized = 0;
        nowDate.setHours(nowDate.getHours() + offset);
    }

    if (nowDate.getHours() >= krStopHourNormalized && nowDate.getHours() < krStartHourNormalized && nInterval > (5 * 60)) {
        let krDelayMinute = krStartHourDelayMin + Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
        krDelaySec += krStartHour * 3600 - (nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
        krDelaySec += krDelayMinute * 60;
        kingRewardCountdownTimer(krDelaySec, true);
    } else {
        kingRewardCountdownTimer(krDelaySec, false);
    }
}

function kingRewardCountdownTimer(interval, isReloadToSolve) {
    let strTemp = (isReloadToSolve) ? "Reload to solve KR in " : "Solve KR in (extra few sec delay) ";
    strTemp = strTemp + timeFormat(interval);
    displayTimer(strTemp, strTemp, strTemp);
    interval -= timerRefreshInterval;
    if (interval < 0) {
        if (isReloadToSolve) {
            strTemp = "Reloading...";
            displayTimer(strTemp, strTemp, strTemp);

            // simulate mouse click on the camp button
            let campElement = document.getElementsByClassName(strCampButton)[0];
            fireEvent(campElement, 'click');
            campElement = null;

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        } else {
            strTemp = "Solving...";
            displayTimer(strTemp, strTemp, strTemp);
            let intervalCRB = setInterval(
                function () {
                    if (checkResumeButton()) {
                        clearInterval(intervalCRB);
                        intervalCRB = null;
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
    let found = false;
    let resumeElement;
    let krFormClass = document.getElementsByTagName('form')[0].className;
    if (krFormClass.indexOf("noPuzzle") > -1) {
        // found resume button

        // simulate mouse click on the resume button
        resumeElement = document.getElementsByClassName('mousehuntPage-puzzle-form-complete-button')[0];
        let nowDate = new Date();
        let nTimezoneOffset = -(nowDate.getTimezoneOffset()) * 60000;
        console.plog('Click Resume button at:', new Date(nowDate + nTimezoneOffset).toISOString());
        fireEvent(resumeElement, 'click');
        resumeElement = null;

        let nRetry = 5;
        let intervalCRB1 = setInterval(function () {
            if (isNullOrUndefined(document.getElementById('journalContainer'))) {
                // not at camp page
                --nRetry;
                if (nRetry <= 0) {
                    // reload url if click fail
                    reloadWithMessage("Fail to click on resume button. Reloading...", false);
                    clearInterval(intervalCRB1);
                }
            } else {
                let lastKingRewardDate = getItemFromLocalStorage("lastKingRewardDate");
                if (isNullOrUndefined(lastKingRewardDate)) {
                    lastKingRewardSumTime = -1;
                } else {
                    let lastDate = new Date(lastKingRewardDate);
                    lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                }
                retrieveData(true);
                countdownTimer();
                clearInterval(intervalCRB1);
            }
        }, 1000);
        found = true;
    }
    krFormClass = null;

    try {
        return (found);
    } finally {
        found = null;
    }
}

function CallKRSolver() {
    let frame = document.createElement('iframe');
    frame.setAttribute("id", "myFrame");
    let img;
    if (debugKR) {
        //frame.src = "https://dl.dropboxusercontent.com/s/4u5msso39hfpo87/Capture.PNG";
        //frame.src = "https://dl.dropboxusercontent.com/s/og73bcdsn2qod63/download%20%2810%29Ori.png";
        frame.src = "https://dl.dropboxusercontent.com/s/ppg0l35h25phrx3/download%20(16).png";
    } else {
        img = document.getElementsByClassName('mousehuntPage-puzzle-form-captcha-image')[0];
        frame.src = img.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    }
    document.body.appendChild(frame);
}

function CheckKRAnswerCorrectness() {
    let strTemp = '';
    let pageMsg = document.getElementById('pagemessage');
    if (!isNullOrUndefined(pageMsg) && pageMsg.innerText.toLowerCase().indexOf("unable to claim reward") > -1) { // KR answer not correct, re-run OCR
        if (kingsRewardRetry >= kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setItemToLocalStorage("KingsRewardRetry", kingsRewardRetry);
            strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
            alert(strTemp);
            displayTimer(strTemp, strTemp, strTemp);
            console.perror(strTemp);
        } else {
            ++kingsRewardRetry;
            setItemToLocalStorage("KingsRewardRetry", kingsRewardRetry);
            CallKRSolver();
        }
        return;
    }

    window.setTimeout(function () {
        CheckKRAnswerCorrectness();
    }, 1000);
}

function FinalizePuzzleImageAnswer(answer) {
    let myFrame;
    if (answer.length !== 5) {
        //Get a new puzzle
        if (kingsRewardRetry >= kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setItemToLocalStorage("KingsRewardRetry", kingsRewardRetry);
            let strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
            alert(strTemp);
            displayTimer(strTemp, strTemp, strTemp);
            console.perror(strTemp);
        } else {
            ++kingsRewardRetry;
            setItemToLocalStorage("KingsRewardRetry", kingsRewardRetry);
            let tagName = document.getElementsByTagName("a");
            for (let i = 0; i < tagName.length; i++) {
                if (tagName[i].innerText === "Click here to get a new one!") {
                    fireEvent(tagName[i], 'click');
                    if (isNewUI) {
                        myFrame = document.getElementById('myFrame');
                        if (!isNullOrUndefined(myFrame))
                            document.body.removeChild(myFrame);
                        window.setTimeout(function () {
                            CallKRSolver();
                        }, 6000);
                    }
                    return;
                }
            }
        }
    } else {
        //Submit answer
        let puzzleAns = document.getElementsByClassName("mousehuntPage-puzzle-form-code")[0];
        if (!puzzleAns) {
            console.plog("puzzleAns:", puzzleAns);
            return;
        }
        puzzleAns.value = "";
        puzzleAns.value = answer.toLowerCase();

        let puzzleSubmit = document.getElementsByClassName("mousehuntPage-puzzle-form-code-button")[0];
        if (!puzzleSubmit) {
            console.plog("puzzleSubmit:", puzzleSubmit);
            return;
        }

        fireEvent(puzzleSubmit, 'click');
        kingsRewardRetry = 0;
        setItemToLocalStorage("KingsRewardRetry", kingsRewardRetry);
        myFrame = document.getElementById('myFrame');
        if (myFrame)
            document.body.removeChild(myFrame);
        window.setTimeout(function () {
            CheckKRAnswerCorrectness();
        }, 5000);
    }
}
