// ==UserScript==
// @name         Nitro Type - DPH configuration
// @version      0.2.3
// @description  Stats & Minimap & New Auto Reload & Alt. WPM / Countdown
// @author       dphdmn / A lot of code by Toonidy is used
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://static.wikia.nocookie.net/nitro-type/images/8/85/175_large_1.png/revision/latest?cb=20181229003942
// @grant GM_setValue
// @grant GM_getValue
// @namespace    dphdmn
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js#sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @require      https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.10.27/interact.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/6.5.4/browser/pixi.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509919/Nitro%20Type%20-%20DPH%20configuration.user.js
// @updateURL https://update.greasyfork.org/scripts/509919/Nitro%20Type%20-%20DPH%20configuration.meta.js
// ==/UserScript==

/* global Dexie moment NTGLOBALS PIXI interact */

    const enableStats = GM_getValue('enableStats', true);
    //// GENERAL VISUAL OPTIONS ////
    const hideTrack = GM_getValue('hideTrack', true);
    const hideNotifications = GM_getValue('hideNotifications', true);
    const scrollPage = GM_getValue('scrollPage', false);
    const ENABLE_MINI_MAP = GM_getValue('ENABLE_MINI_MAP', true);
    const ENABLE_ALT_WPM_COUNTER = GM_getValue('ENABLE_ALT_WPM_COUNTER', true);

    ////// AUTO RELOAD OPTIONS /////
    const greedyStatsReload = GM_getValue('greedyStatsReload', true);
    const greedyStatsReloadInt = GM_getValue('greedyStatsReloadInt', 50);

    const reloadOnStats = GM_getValue('reloadOnStats', true);

    //// BETTER STATS OPTIONS /////
    const RACES_OUTSIDE_CURRENT_TEAM = GM_getValue('RACES_OUTSIDE_CURRENT_TEAM', 0);
    const RACES_BEFORE_THIS_SEASON = GM_getValue('RACES_BEFORE_THIS_SEASON', 0);

    const SEASON_RACES_EXTRA = GM_getValue('SEASON_RACES_EXTRA', 0);
    const TEAM_RACES_BUGGED = GM_getValue('TEAM_RACES_BUGGED', 0);

    const config = {
        ///// ALT WPM COUNTER CONFIG //////
        targetWPM: GM_getValue('targetWPM', 79.5),
        indicateWPMWithin: GM_getValue('indicateWPMWithin', 2),
        timerRefreshIntervalMS: GM_getValue('timerRefreshIntervalMS', 25),
        dif: GM_getValue('dif', 0.8),

        raceLatencyMS: 140,

        ///// CUSTOM MINIMAP CONFIG ////// (hardcoded)
        colors: {
            me: 0xFF69B4,
            opponentPlayer: 0x00FFFF,
            opponentBot: 0xbbbbbb,
            opponentWampus: 0xFFA500,
            nitro: 0xef9e18,
            raceLane: 0x555555,
            startLine: 0x929292,
            finishLine: 0x929292
        },
        trackLocally: true,
        moveDestination: {
            enabled: true,
            alpha: 0.3,
        }
    };

    // Create UI elements
    const createUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '50px';
        container.style.left = '10px';
        container.style.background = 'rgba(20, 20, 20, 0.9)'; // Darker background
        container.style.color = 'cyan';
        container.style.padding = '10px';
        container.style.borderRadius = '8px'; // Slightly larger border radius for a modern look
        container.style.zIndex = '9999';
        container.style.display = 'none';
        container.style.width = '300px';
        container.style.maxHeight = '400px';
        container.style.overflowY = 'scroll';

        // Apply custom scrollbar styles
        const style = document.createElement('style');
        style.textContent = `
  ::-webkit-scrollbar {
    width: 8px; /* Scrollbar width */
  }

  ::-webkit-scrollbar-track {
    background: rgba(50, 50, 50, 0.6); /* Scrollbar track */
    border-radius: 5px; /* Rounded corners for the track */
  }

  ::-webkit-scrollbar-thumb {
    background-color: #00cccc; /* Scrollbar color */
    border-radius: 5px; /* Rounded corners for the thumb */
    border: 2px solid rgba(20, 20, 20, 0.9); /* Border for thumb to match container background */
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #00e6e6; /* Lighter color on hover for a modern touch */
  }
`;
        document.head.appendChild(style);

        const title = document.createElement('h3');
        title.textContent = 'Configuration';
        title.style.margin = '0';
        title.style.color = '#ff007f';
        container.appendChild(title);
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save and Reload';
        saveButton.style.marginTop = '10px';
        saveButton.style.background = 'cyan';
        saveButton.style.color = 'black';
        saveButton.style.border = 'none';
        saveButton.style.padding = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => location.reload();
        container.appendChild(saveButton);

        const addHeader = (labelText) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginTop = '10px';
            label.style.color = '#ff007f';
            label.appendChild(document.createTextNode(' ' + labelText));
            container.appendChild(label);
        };
        const addCheckbox = (labelText, variableName, defaultValue) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginTop = '10px';
            label.style.color = 'cyan';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = GM_getValue(variableName, defaultValue);
            checkbox.onchange = () => GM_setValue(variableName, checkbox.checked);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + labelText));
            container.appendChild(label);
        };

        const addNumberInput = (labelText, variableName, defaultValue) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginTop = '10px';
            label.style.color = '#009c9a';
            label.style.fontSize = "14px";
            const input = document.createElement('input');
            input.type = 'number';
            input.value = GM_getValue(variableName, defaultValue);
            input.style.width = '100%';
            input.style.background = 'rgba(0, 0, 0, 0.6)';
            input.style.color = 'cyan';
            input.style.border = 'none';
            input.style.padding = '5px';
            input.style.marginTop = '5px';
            input.onchange = () => GM_setValue(variableName, parseFloat(input.value));

            label.appendChild(document.createTextNode(labelText));
            label.appendChild(input);
            container.appendChild(label);
        };

        // Add options to the UI
        addHeader("General options");
        addCheckbox('Hide Track', 'hideTrack', hideTrack);
        addCheckbox('Hide Notifications', 'hideNotifications', hideNotifications);
        addCheckbox('Enable Mini Map', 'ENABLE_MINI_MAP', ENABLE_MINI_MAP);
        addCheckbox('Auto Scroll Page', 'scrollPage', scrollPage);
        addHeader("Auto reload options");
        addCheckbox('Enable Auto Reload', 'reloadOnStats', reloadOnStats);
        addCheckbox('Enable FAST RELOAD', 'greedyStatsReload', greedyStatsReload);
        addNumberInput('FAST RELOAD - Check Interval', 'greedyStatsReloadInt', greedyStatsReloadInt);
        addHeader("Stats options");
        addCheckbox('Enable Stats', 'enableStats', enableStats);
        addNumberInput('Races Outside Current Team', 'RACES_OUTSIDE_CURRENT_TEAM', RACES_OUTSIDE_CURRENT_TEAM);
        addNumberInput('Races Before This Season', 'RACES_BEFORE_THIS_SEASON', RACES_BEFORE_THIS_SEASON);
        addNumberInput('Bugged season count (0 if no)', 'SEASON_RACES_EXTRA', SEASON_RACES_EXTRA);
        addNumberInput('Bugged team count (0 if no)', 'TEAM_RACES_BUGGED', TEAM_RACES_BUGGED);
        addHeader("Alt. WPM options");
        addCheckbox('Enable Alt. WPM / Countdown', 'ENABLE_ALT_WPM_COUNTER', ENABLE_ALT_WPM_COUNTER);
        addNumberInput('Target WPM (1 = No Sandbagging)', 'targetWPM', config.targetWPM);
        addNumberInput('Alt. WPM: Yellow when +X WPM', 'indicateWPMWithin', config.indicateWPMWithin);
        addNumberInput('Alt. WPM: Refresh int.', 'timerRefreshIntervalMS', config.timerRefreshIntervalMS);
        addNumberInput('Alt. WPM: +X WPM Delay', 'dif', config.dif);

        document.body.appendChild(container);

        const configureButton = document.createElement('button');
        configureButton.textContent = 'Configure';
        configureButton.style.position = 'fixed';
        configureButton.style.bottom = '10px';
        configureButton.style.left = '10px';
        configureButton.style.background = 'rgba(0, 0, 0, 0.8)';
        configureButton.style.color = 'cyan';
        configureButton.style.border = 'none';
        configureButton.style.padding = '5px';
        configureButton.style.cursor = 'pointer';
        configureButton.style.zIndex = '9999';
        configureButton.onclick = () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(configureButton);
    };

    createUI();


/** Finds the React Component from given dom. */
const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
    const domFiber = dom[key]
    if (domFiber == null) return null
    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return
        }
        return parentFiber
    }
    let compFiber = getCompFiber(domFiber)
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber)
    }
    return compFiber?.stateNode
}

var my_race_started = false;
const TEAM_RACES_DIF = RACES_OUTSIDE_CURRENT_TEAM - TEAM_RACES_BUGGED;
const CURRENT_SEASON_DIF = RACES_BEFORE_THIS_SEASON - SEASON_RACES_EXTRA;

if(hideTrack){
    const trackel = document.querySelector('.racev3-track')
    trackel.style.opacity = '0';
    trackel.style.marginTop = '-400px';
}
if (hideNotifications) {
    const style = document.createElement('style');
    style.textContent = `
        .growls {
            display: none !important; /* or visibility: hidden; */
        }
    `;
    document.head.appendChild(style);
}
/** Create a Console Logger with some prefixing. */
const createLogger = (namespace) => {
    const logPrefix = (prefix = "") => {
        const formatMessage = `%c[${namespace}]${prefix ? `%c[${prefix}]` : ""}`
        let args = [console, `${formatMessage}%c`, "background-color: #D62F3A; color: #fff; font-weight: bold"]
        if (prefix) {
            args = args.concat("background-color: #4f505e; color: #fff; font-weight: bold")
        }
        return args.concat("color: unset")
    }
    return {
        info: (prefix) => Function.prototype.bind.apply(console.info, logPrefix(prefix)),
        warn: (prefix) => Function.prototype.bind.apply(console.warn, logPrefix(prefix)),
        error: (prefix) => Function.prototype.bind.apply(console.error, logPrefix(prefix)),
        log: (prefix) => Function.prototype.bind.apply(console.log, logPrefix(prefix)),
        debug: (prefix) => Function.prototype.bind.apply(console.debug, logPrefix(prefix)),
    }
}

function logstats() {
    const raceContainer = document.getElementById("raceContainer"),
        canvasTrack = raceContainer?.querySelector("canvas"),
        raceObj = raceContainer ? findReact(raceContainer) : null;
    const currentUserID = raceObj.props.user.userID;
    const currentUserResult = raceObj.state.racers.find((r) => r.userID === currentUserID)
    if (!currentUserResult || !currentUserResult.progress || typeof currentUserResult.place === "undefined") {
        console.log("STATS LOGGER: Unable to find race results");
        return
    }

    const {
        typed,
        skipped,
        startStamp,
        completeStamp,
        errors
    } = currentUserResult.progress,
        wpm = Math.round((typed - skipped) / 5 / ((completeStamp - startStamp) / 6e4)),
        time = ((completeStamp - startStamp) / 1e3).toFixed(2),
        acc = ((1 - errors / (typed - skipped)) * 100).toFixed(2),
        points = Math.round((100 + wpm / 2) * (1 - errors / (typed - skipped))),
        place = currentUserResult.place

    console.log(`STATS LOGGER: ${place} | ${acc}% Acc | ${wpm} WPM | ${points} points | ${time} secs`)
}
const logging = createLogger("Nitro Type Racing Stats")

/* Config storage */
const db = new Dexie("NTRacingStats")
db.version(1).stores({
    backupStatData: "userID",
})
db.open().catch(function(e) {
    logging.error("Init")("Failed to open up the racing stat cache database", e)
})

////////////
//  Init  //
////////////

const raceContainer = document.getElementById("raceContainer"),
    raceObj = raceContainer ? findReact(raceContainer) : null,
    server = raceObj?.server,
    currentUser = raceObj?.props.user
if (!raceContainer || !raceObj) {
    logging.error("Init")("Could not find the race track")
    return
}
if (!currentUser?.loggedIn) {
    logging.error("Init")("Not available for Guest Racing")
    return
}

       raceContainer.addEventListener('click', (event) => {
        document.querySelector('.race-hiddenInput').click();
    });
//////////////////
//  Components  //
//////////////////

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`

   .racev3-track {
   margin-top: -30px;
   }

 .header-bar--return-to-garage{
 display: none !important;
 }

.dropdown {
display: none !important;
}

.header-nav {
display: none !important;
}
.logo-SVG {
height: 50% !important;
width: 50% important;
}
#raceContainer {
    margin-bottom: 0;
}
.nt-stats-root {
    text-shadow:
        0.05em 0 black,
        0 0.05em black,
        -0.05em 0 black,
        0 -0.05em black,
        -0.05em -0.05em black,
        -0.05em 0.05em black,
        0.05em -0.05em black,
        0.05em 0.05em black;
}
.nt-stats-body {
    display: flex;
    justify-content: space-between;
    padding: 8px;
        background: linear-gradient(rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.66)), fixed url(https://getwallpapers.com/wallpaper/full/1/3/a/171084.jpg);
}
.nt-stats-left-section {
    display: none;
}
.nt-stats-right-section  {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}
.nt-stats-toolbar {
    display: none;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    color: rgba(255, 255, 255, 0.8);
    background-color: #03111a;
    font-size: 12px;
}
.nt-stats-toolbar-status {
    display: flex;
}
.nt-stats-toolbar-status .nt-stats-toolbar-status-item {
    padding: 0 8px;
    background-color: #0a2c42;
}
.nt-stats-toolbar-status .nt-stats-toolbar-status-item-alt {
    padding: 0 8px;
    background-color: #22465c;
}
.nt-stats-daily-challenges {
    width: 350px;
}
.nt-stats-daily-challenges .daily-challenge-progress--badge {
    z-index: 0;
}
.nt-stats-season-progress {
    display: none;
    padding: 8px;
    margin: 0 auto;
    border-radius: 8px;
    background-color: #3b3b3b;
    box-shadow: 0 28px 28px 0 rgb(2 2 2 / 5%), 0 17px 17px 0 rgb(2 2 2 / 20%), 0 8px 8px 0 rgb(2 2 2 / 15%);
}
.nt-stats-season-progress .season-progress-widget {
    width: 350px;
}
.nt-stats-season-progress .season-progress-widget--level-progress-bar {
    transition: width 0.3s ease;
}
.nt-stats-info {
    text-align: center;
    color: #eee;
    font-size: 14px;
    opacity: 80%
}
.nt-stats-metric-row {
    margin-bottom: 4px;
}
.nt-stats-metric-value, .nt-stats-metric-suffix {
    font-weight: 300;
    color: cyan;
}
.nt-stats-metric-value {
color: rgb(0, 245, 245);
}
.nt-stats-right-section {
    flex-grow: 1;
    margin-left: 15px;
}`)
)
document.head.appendChild(style)

/** Populates daily challenge data merges in the given progress. */
const mergeDailyChallengeData = (progress) => {
    const {
        CHALLENGES,
        CHALLENGE_TYPES
    } = NTGLOBALS,
    now = Math.floor(Date.now() / 1000)
    return CHALLENGES.filter((c) => c.expiration > now)
        .slice(0, 3)
        .map((c, i) => {
            const userProgress = progress.find((p) => p.challengeID === c.challengeID),
                challengeType = CHALLENGE_TYPES[c.type],
                field = challengeType[1],
                title = challengeType[0].replace(/\$\{goal\}/, c.goal).replace(/\$\{field\}/, `${challengeType[1]}${c.goal !== 1 ? "s" : ""}`)
            return {
                ...c,
                title,
                field,
                goal: c.goal,
                progress: userProgress?.progress || 0,
            }
        })
}

/** Grab NT Racing Stats from various sources. */
const getStats = async () => {
    //await new Promise(resolve => setTimeout(resolve, 3000));
    let backupUserStats = null
    try {
        backupUserStats = await db.backupStatData.get(currentUser.userID)
    } catch (ex) {
        logging.warn("Update")("Unable to get backup stats", ex)
    }
    try {
        const persistStorageStats = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user),
            user = !backupUserStats || typeof backupUserStats.lastConsecRace !== "number" || persistStorageStats.lastConsecRace >= backupUserStats.lastConsecRace ?
            persistStorageStats :
            backupUserStats,
            dailyChallenges = mergeDailyChallengeData(user.challenges)
        return {
            user,
            dailyChallenges
        }
    } catch (ex) {
        logging.error("Update")("Unable to get stats", ex)
    }
    return Promise.reject(new Error("Unable to get stats"))
}

/** Grab Summary Stats. */
const getSummaryStats = () => {
    const authToken = localStorage.getItem("player_token")
    return fetch("/api/v2/stats/summary", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((r) => r.json())
        .then((r) => {
            return {
                seasonBoard: r?.results?.racingStats?.find((b) => b.board === "season"),
                dailyBoard: r?.results?.racingStats?.find((b) => b.board === "daily"),
            }
        })
        .catch((err) => Promise.reject(err))
}

/** Grab Stats from Team Data. */
const getTeamStats = () => {
    if (!currentUser?.tag) {
        return Promise.reject(new Error("User is not in a team"))
    }
    const authToken = localStorage.getItem("player_token")
    return fetch(`/api/v2/teams/${currentUser.tag}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((r) => r.json())
        .then((r) => {
            return {
                leaderboard: r?.results?.leaderboard,
                motd: r?.results?.motd,
                info: r?.results?.info,
                stats: r?.results?.stats,
                member: r?.results?.members?.find((u) => u.userID === currentUser.userID),
                season: r?.results?.season?.find((u) => u.userID === currentUser.userID),
            }
        })
        .catch((err) => Promise.reject(err))
}

/** Stat Manager widget (basically a footer with settings button). */
const ToolbarWidget = ((user) => {
    const root = document.createElement("div")
    root.classList.add("nt-stats-toolbar")
    root.innerHTML = `
        <div>
            NOTE: Team Stats and Season Stats are cached.
        </div>
        <div class="nt-stats-toolbar-status">
            <div class="nt-stats-toolbar-status-item">
                <span class=" nt-cash-status as-nitro-cash--prefix">N/A</span>
            </div>
            <div class="nt-stats-toolbar-status-item-alt">
                📦 Mystery Box: <span class="mystery-box-status">N/A</span>
            </div>
        </div>`

    /** Mystery Box **/
    const rewardCountdown = user.rewardCountdown,
        mysteryBoxStatus = root.querySelector(".mystery-box-status")

    let isDisabled = Date.now() < user.rewardCountdown * 1e3,
        timer = null

    const syncCountdown = () => {
        isDisabled = Date.now() < user.rewardCountdown * 1e3
        if (!isDisabled) {
            if (timer) {
                clearInterval(timer)
            }
            mysteryBoxStatus.textContent = "Claim Now!"
            return
        }
        mysteryBoxStatus.textContent = moment(user.rewardCountdown * 1e3).fromNow(false)
    }
    syncCountdown()
    if (isDisabled) {
        timer = setInterval(syncCountdown, 6e3)
    }

    /** NT Cash. */
    const amountNode = root.querySelector(".nt-cash-status")

    return {
        root,
        updateStats: (user) => {
            if (typeof user?.money === "number") {
                amountNode.textContent = `$${user.money.toLocaleString()}`
            }
        },
    }

})(raceObj.props.user)

/** Daily Challenge widget. */
const DailyChallengeWidget = (() => {
    const root = document.createElement("div")
    root.classList.add("nt-stats-daily-challenges", "profile-dailyChallenges", "card", "card--open", "card--d", "card--grit", "card--shadow-l")
    root.innerHTML = `
        <div class="daily-challenge-list--heading">
            <h4>Daily Challenges</h4>
            <div class="daily-challenge-list--arriving">
                <div class="daily-challenge-list--arriving-label">
                    <svg class="icon icon-recent-time"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.1494.svg#icon-recent-time"></use></svg>
                    New <span></span>
                </div>
            </div>
        </div>
        <div class="daily-challenge-list--challenges"></div>`

    const dailyChallengesContainer = root.querySelector(".daily-challenge-list--challenges"),
        dailyChallengesExpiry = root.querySelector(".daily-challenge-list--arriving-label span")

    const dailyChallengeItem = document.createElement("div")
    dailyChallengeItem.classList.add("raceResults--dailyChallenge")
    dailyChallengeItem.innerHTML = `
    	<div class="daily-challenge-progress">
			<div class="daily-challenge-progress--info">
				<div class="daily-challenge-progress--requirements">
					<div class="daily-challenge-progress--name">
						<div style="height: 19px;">
							<div align="left" style="white-space: nowrap; pavgSpeedosition: absolute; transform: translate(0%, 0px) scale(1, 1); left: 0px;">
							</div>
						</div>
					</div>
					<div class="daily-challenge-progress--status"></div>
				</div>
				<div class="daily-challenge-progress--progress">
					<div class="daily-challenge-progress--progress-bar-container">
						<div class="daily-challenge-progress--progress-bar" style="width: 40%"></div>
						<div class="daily-challenge-progress--progress-bar--earned" style="width: 40%"></div>
					</div>
				</div>
			</div>
			<div class="daily-challenge-progress--badge">
				<div class="daily-challenge-progress--success"></div>
				<div class="daily-challenge-progress--xp">
					<span class="daily-challenge-progress--value"></span><span class="daily-challenge-progress--divider">/</span><span class="daily-challenge-progress--target"></span>
				</div>
				<div class="daily-challenge-progress--label"></div>
			</div>
		</div>`

    const updateDailyChallengeNode = (node, challenge) => {
        let progressPercentage = challenge.goal > 0 ? (challenge.progress / challenge.goal) * 100 : 0
        if (challenge.progress === challenge.goal) {
            progressPercentage = 100
            node.querySelector(".daily-challenge-progress").classList.add("is-complete")
        } else {
            node.querySelector(".daily-challenge-progress").classList.remove("is-complete")
        }
        node.querySelector(".daily-challenge-progress--name div div").textContent = challenge.title
        node.querySelector(".daily-challenge-progress--label").textContent = `${challenge.field}s`
        node.querySelector(".daily-challenge-progress--value").textContent = challenge.progress
        node.querySelector(".daily-challenge-progress--target").textContent = challenge.goal
        node.querySelector(".daily-challenge-progress--status").textContent = `Earn ${Math.floor(challenge.reward / 100) / 10}k XP`
        node.querySelectorAll(".daily-challenge-progress--progress-bar, .daily-challenge-progress--progress-bar--earned").forEach((bar) => {
            bar.style.width = `${progressPercentage}%`
        })
    }

    let dailyChallengeNodes = null

    getStats().then(({
        dailyChallenges
    }) => {
        const dailyChallengeFragment = document.createDocumentFragment()

        dailyChallengeNodes = dailyChallenges.map((c) => {
            const node = dailyChallengeItem.cloneNode(true)
            updateDailyChallengeNode(node, c)

            dailyChallengeFragment.append(node)

            return node
        })
        dailyChallengesContainer.append(dailyChallengeFragment)
    })

    const updateStats = (data) => {
        if (!data || !dailyChallengeNodes || data.length === 0) {
            return
        }
        if (data[0] && data[0].expiration) {
            const t = 1000 * data[0].expiration
            if (!isNaN(t)) {
                dailyChallengesExpiry.textContent = moment(t).fromNow()
            }
        }
        data.forEach((c, i) => {
            if (dailyChallengeNodes[i]) {
                updateDailyChallengeNode(dailyChallengeNodes[i], c)
            }
        })
    }

    return {
        root,
        updateStats,
    }
})()

/** Display Season Progress and next Reward. */
const SeasonProgressWidget = ((raceObj) => {
    const currentSeason = NTGLOBALS.ACTIVE_SEASONS.find((s) => {
        const now = Date.now()
        return now >= s.startStamp * 1e3 && now <= s.endStamp * 1e3
    })

    const seasonRewards = raceObj.props?.seasonRewards,
        user = raceObj.props?.user

    const root = document.createElement("div")
    root.classList.add("nt-stats-season-progress", "theme--pDefault")
    root.innerHTML = `
        <div class="season-progress-widget">
            <div class="season-progress-widget--info">
                <div class="season-progress-widget--title">Season Progress${currentSeason ? "" : " (starting soon)"}</div>
                <div class="season-progress-widget--current-xp"></div>
                <div class="season-progress-widget--current-level">
                    <div class="season-progress-widget--current-level--prefix">Level</div>
                    <div class="season-progress-widget--current-level--number"></div>
                </div>
                <div class="season-progress-widget--level-progress">
                    <div class="season-progress-widget--level-progress-bar" style="width: 0%;"></div>
                </div>
            </div>
            <div class="season-progress-widget--next-reward">
                <div class="season-progress-widget--next-reward--display">
                    <div class="season-reward-mini-preview">
                        <div class="season-reward-mini-preview--locked">
                            <div class="tooltip--season tooltip--xs tooltip--c" data-ttcopy="Upgrade to Nitro Gold to Unlock!">
                                <svg class="icon icon-lock"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-lock"></use></svg>
                            </div>
                        </div>
                        <a class="season-reward-mini-preview" href="/season">
                            <div class="season-reward-mini-preview--frame">
                                <div class="rarity-frame rarity-frame--small">
                                    <div class="rarity-frame--extra"></div>
                                    <div class="rarity-frame--content">
                                        <div class="season-reward-mini-preview--preview"></div>
                                        <div class="season-reward-mini-preview--label"></div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>`

    const xpTextNode = root.querySelector(".season-progress-widget--current-xp"),
        xpProgressBarNode = root.querySelector(".season-progress-widget--level-progress-bar"),
        levelNode = root.querySelector(".season-progress-widget--current-level--number"),
        nextRewardRootNode = root.querySelector(".season-reward-mini-preview"),
        nextRewardTypeLabelNode = root.querySelector(".season-reward-mini-preview--label"),
        nextRewardTypeLockedNode = root.querySelector(".season-reward-mini-preview--locked"),
        nextRewardTypePreviewNode = root.querySelector(".season-reward-mini-preview--preview"),
        nextRewardTypePreviewImgNode = document.createElement("img"),
        nextRewardRarityFrameNode = root.querySelector(".rarity-frame.rarity-frame--small")

    nextRewardTypePreviewImgNode.classList.add("season-reward-mini-previewImg")

    if (!currentSeason) {
        nextRewardRootNode.remove()
    }

    /** Work out how much experience required to reach specific level. */
    const getExperienceRequired = (lvl) => {
        if (lvl < 1) {
            lvl = 1
        }
        const {
            startingLevels,
            experiencePerStartingLevel,
            experiencePerAchievementLevel,
            experiencePerExtraLevels
        } = NTGLOBALS.SEASON_LEVELS

        let totalExpRequired = 0,
            amountExpRequired = experiencePerStartingLevel
        for (let i = 1; i < lvl; i++) {
            if (i <= startingLevels) {
                totalExpRequired += experiencePerStartingLevel
            } else if (currentSeason && i > currentSeason.totalRewards) {
                totalExpRequired += experiencePerExtraLevels
                amountExpRequired = experiencePerExtraLevels
            } else {
                totalExpRequired += experiencePerAchievementLevel
                amountExpRequired = experiencePerAchievementLevel
            }
        }
        return [amountExpRequired, totalExpRequired]
    }

    /** Get next reward. */
    const getNextRewardID = (currentXP) => {
        currentXP = currentXP || user.experience
        if (!seasonRewards || seasonRewards.length === 0) {
            return null
        }
        if (user.experience === 0) {
            return seasonRewards[0] ? seasonRewards[0].achievementID : null
        }
        let claimed = false
        let nextReward = seasonRewards.find((r, i) => {
            if (!r.bonus && (claimed || r.experience === currentXP)) {
                claimed = true
                return false
            }
            return r.experience > currentXP || i + 1 === seasonRewards.length
        })
        if (!nextReward) {
            nextReward = seasonRewards[seasonRewards.length - 1]
        }
        return nextReward ? nextReward.achievementID : null
    }

    return {
        root,
        updateStats: (data) => {
            // XP Progress
            if (typeof data.experience === "number") {
                const [amountExpRequired, totalExpRequired] = getExperienceRequired(data.level + 1),
                    progress = Math.max(5, ((amountExpRequired - (totalExpRequired - data.experience)) / amountExpRequired) * 100.0) || 5
                xpTextNode.textContent = `${(amountExpRequired - (totalExpRequired - data.experience)).toLocaleString()} / ${amountExpRequired / 1e3}k XP`
                xpProgressBarNode.style.width = `${progress}%`
            }
            levelNode.textContent = currentSeason && data.level > currentSeason.totalRewards + 1 ? `∞${data.level - currentSeason.totalRewards - 1}` : data.level || 1

            // Next Reward
            if (typeof data.experience !== "number") {
                return
            }
            const nextRewardID = getNextRewardID(data.experience),
                achievement = nextRewardID ? NTGLOBALS.ACHIEVEMENTS.LIST.find((a) => a.achievementID === nextRewardID) : null
            if (!achievement) {
                return
            }
            const {
                type,
                value
            } = achievement.reward
            if (["loot", "car"].includes(type)) {
                const item = type === "loot" ? NTGLOBALS.LOOT.find((l) => l.lootID === value) : NTGLOBALS.CARS.find((l) => l.carID === value)
                if (!item) {
                    logging.warn("Update")(`Unable to find next reward ${type}`, achievement.reward)
                    return
                }

                nextRewardRootNode.className = `season-reward-mini-preview season-reward-mini-preview--${type === "loot" ? item?.type : "car"}`
                nextRewardTypeLabelNode.textContent = type === "loot" ? item.type || "???" : "car"
                nextRewardRarityFrameNode.className = `rarity-frame rarity-frame--small${item.options?.rarity ? ` rarity-frame--${item.options.rarity}` : ""}`

                if (item?.type === "title") {
                    nextRewardTypePreviewImgNode.remove()
                    nextRewardTypePreviewNode.textContent = `"${item.name}"`
                } else {
                    nextRewardTypePreviewImgNode.src = type === "loot" ? item.options?.src : `/cars/${item.options?.smallSrc}`
                    nextRewardTypePreviewNode.innerHTML = ""
                    nextRewardTypePreviewNode.append(nextRewardTypePreviewImgNode)
                }
            } else if (type === "money") {
                nextRewardTypeLabelNode.innerHTML = `<div class="as-nitro-cash--prefix">$${value.toLocaleString()}</div>`
                nextRewardTypePreviewImgNode.src = "/dist/site/images/pages/race/race-results-prize-cash.2.png"
                nextRewardRootNode.className = "season-reward-mini-preview season-reward-mini-preview--money"
                nextRewardRarityFrameNode.className = "rarity-frame rarity-frame--small rarity-frame--legendary"
                nextRewardTypePreviewNode.innerHTML = ""
                nextRewardTypePreviewNode.append(nextRewardTypePreviewImgNode)
            } else {
                logging.warn("Update")(`Unhandled next reward type ${type}`, achievement.reward)
                return
            }

            if (!achievement.free && user.membership === "basic") {
                nextRewardRootNode.firstElementChild.before(nextRewardTypeLockedNode)
            } else {
                nextRewardTypeLockedNode.remove()
            }
        },
    }
})(raceObj)

/** Displays list of player stats. */
const StatWidget = (() => {
    const root = document.createElement("div")
    root.classList.add("nt-stats-info")
    root.innerHTML = `
        <div class="nt-stats-metric-row">
             <span class="nt-stats-metric nt-stats-metric-session-races">
                <span class="nt-stats-metric-heading">Session:</span>
                <span class="nt-stats-metric-value">0</span>
            </span>
            <span class="nt-stats-metric-separator">|</span>
            <span class="nt-stats-metric nt-stats-metric-rta">
                <span class="nt-stats-metric-heading">Real time:</span>
                <span class="nt-stats-metric-value">0</span>
            </span>
        </div>
        <div class="nt-stats-metric-row">
            <span class="nt-stats-metric nt-stats-metric-total-races">
                <span class="nt-stats-metric-heading">Races:</span>
                <span class="nt-stats-metric-value">0</span>
            </span>
            <span class="nt-stats-metric-separator">(</span>
            <span class="nt-stats-metric nt-stats-metric-season-races">
                <span class="nt-stats-metric-heading">Season:</span>
                <span class="nt-stats-metric-value">N/A</span>
            <span class="nt-stats-metric-separator">|</span>
            </span>
            ${
                currentUser.tag
                    ? `<span class="nt-stats-metric nt-stats-metric-team-races">
                <span class="nt-stats-metric-heading">Team:</span>
                <span class="nt-stats-metric-value">N/A</span>
                <span class="nt-stats-metric-separator">)</span>
            </span>`
                    : ``
            }
        </div>
        <div class="nt-stats-metric-row">
            <span class="nt-stats-metric nt-stats-metric-playtime">
                <span class="nt-stats-metric-heading">Playtime:</span>
                <span class="nt-stats-metric-value">0</span>
            </span>

       </div>
       <div class="nt-stats-metric-row">
            <span class="nt-stats-metric nt-stats-metric-avg-speed">
            <span class="nt-stats-metric-heading">Avg:</span>
                <span class="nt-stats-metric-value">0</span>
                <span class="nt-stats-metric-suffix">WPM | </span>
            </span>
            <span class="nt-stats-metric nt-stats-metric-avg-accuracy">
                <span class="nt-stats-metric-value">0</span>
                <span class="nt-stats-metric-suffix nt-stats-metric-suffix-no-space">% | </span>
            </span>
            <span class="nt-stats-metric nt-stats-metric-avg-time">
                <span class="nt-stats-metric-value">0</span>
                <span class="nt-stats-metric-suffix nt-stats-metric-suffix-no-space">s</span>
            </span>
        </div>
        <div class="nt-stats-metric-row">
            <span class="nt-stats-metric nt-stats-metric-last-race">
                <span class="nt-stats-metric-heading">Last:</span>
                <span class="nt-stats-metric-value">N/A</span>
            </span>
        </div>
        </div>`

    if (greedyStatsReload) {
        var currentTime = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user).lastConsecRace;
//document.querySelector('.race-hiddenInput').click()
        function checkendgreedy(lasttime) {
            if(document.querySelector('.modal--raceError')){
                clearInterval(intervalId);
                location.reload();
                return;
            }
            // console.log("Running another interval");
            const newtime = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user).lastConsecRace;
            if (newtime > lasttime) {
                // console.log("new time is different!");
                clearInterval(intervalId);
                getStats().then(({
                    user,
                    dailyChallenges
                }) => {
                    StatWidget.updateStats(user)
                    if (reloadOnStats) {
                        if (my_race_started) {
                            location.reload()
                        } else {
                            document.querySelector('.race-hiddenInput').click()
                            currentTime = newtime;
                            intervalId = setInterval(checkendgreedy, greedyStatsReloadInt, currentTime);
                        }
                    }
                })
            }
        }
        var intervalId = setInterval(checkendgreedy, greedyStatsReloadInt, currentTime);
    }


    const totalRaces = root.querySelector(".nt-stats-metric-total-races .nt-stats-metric-value"),
        sessionRaces = root.querySelector(".nt-stats-metric-session-races .nt-stats-metric-value"),
        teamRaces = currentUser.tag ? root.querySelector(".nt-stats-metric-team-races .nt-stats-metric-value") : null,
        seasonRaces = root.querySelector(".nt-stats-metric-season-races .nt-stats-metric-value"),
        avgSpeed = root.querySelector(".nt-stats-metric-avg-speed .nt-stats-metric-value"),
        avgAccuracy = root.querySelector(".nt-stats-metric-avg-accuracy .nt-stats-metric-value"),
        lastRace = root.querySelector(".nt-stats-metric-last-race .nt-stats-metric-value"),
        playtime = root.querySelector(".nt-stats-metric-playtime .nt-stats-metric-value"),
        rta = root.querySelector(".nt-stats-metric-rta .nt-stats-metric-value"),
        avgtime = root.querySelector(".nt-stats-metric-avg-time .nt-stats-metric-value")


    // Function to save the current timestamp using GM_setValue
    function saveTimestamp() {
        const currentTimestamp = Date.now(); // Get current time in milliseconds since Unix epoch
        GM_setValue("savedTimestamp", currentTimestamp.toString()); // Convert to string and save the timestamp
    }

    // Function to load the timestamp and calculate the time difference
    function loadTimeDif() {
        const savedTimestampStr = GM_getValue("savedTimestamp", null); // Load the saved timestamp as a string

        if (savedTimestampStr === null) {
            console.log("No timestamp saved.");
            return null;
        }

        // Convert the retrieved string back to a number
        const savedTimestamp = parseInt(savedTimestampStr, 10);

        // Validate the loaded timestamp
        if (isNaN(savedTimestamp)) {
            console.log("Invalid timestamp.");
            return null;
        }

        const currentTimestamp = Date.now(); // Get the current timestamp
        const timeDiff = currentTimestamp - savedTimestamp; // Calculate the difference in milliseconds

        // Convert the time difference to minutes and seconds
        const minutes = Math.floor(timeDiff / 60000); // Convert to minutes
        const seconds = Math.floor((timeDiff % 60000) / 1000); // Convert remaining milliseconds to seconds

        // Format the time difference as "00:00 MM:SS"
        const formattedTimeDiff = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        return formattedTimeDiff;
    }

    function formatPlayTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = seconds % 60;

        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }

    function lastRaceStat(data) {
        let lastRaceT = data.lastRaces.split('|').pop();
        console.log(lastRaceT);
        let [chars, duration, errors] = lastRaceT.split(',').map(Number);

        let speed = (chars / duration) * 12;
        let accuracy = ((chars - errors) * 100) / chars;
        accuracy = accuracy.toFixed(2);

        return `${speed.toFixed(2)} WPM | ${accuracy} % | ${duration.toFixed(2)} s`;
    }

    function getAverageTime(data) {
        let races = data.lastRaces.split('|');
        let totalDuration = 0;

        races.forEach(race => {
            let [, duration] = race.split(',').map(Number);
            totalDuration += duration;
        });

        let averageDuration = totalDuration / races.length;
        return averageDuration.toFixed(2); // Return average duration rounded to 2 decimal places
    }
    function getAverageWPM(data) {
        let races = data.lastRaces.split('|');
        let totalSpeed = 0;

        races.forEach(race => {
            let [chars, duration, errors] = race.split(',').map(Number);
            let speed = (chars / duration) * 12;
            totalSpeed += speed;
        });

        let averageSpeed = totalSpeed / races.length;
        return averageSpeed.toFixed(2); // Return average duration rounded to 2 decimal places
    }
    function timeSinceLastLogin(data) {
        let lastLogin = data.lastLogin; // Timestamp of last login (in seconds)
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        currentTime = data.lastConsecRace;
        let elapsedTime = currentTime - lastLogin; // Time since last login in seconds
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;

        // Format the output as "MM:SS"
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function handleSessionRaces(data) {
        const sessionRaces = data.sessionRaces; // Get sessionRaces from data

        if (sessionRaces === 0) {
            const lastSavedTimestampStr = GM_getValue("savedTimestamp", null);

            if (lastSavedTimestampStr !== null) {
                const lastSavedTimestamp = parseInt(lastSavedTimestampStr, 10);

                // Check if the last saved timestamp was less than 30 minutes ago
                // otherwise, it is not possible, because game resets session after at least 30 minutes
                // necessary, because it might call save function multiple times for same session at the end of the race
                // it would not fix value if page was loaded at first race and it was not succesful
                // so value would overshoot in that case by whenever frist race attempt of the session started
                const fifteenMinutesInMs = 30 * 60 * 1000;
                const currentTimestamp = Date.now();

                if (currentTimestamp - lastSavedTimestamp < fifteenMinutesInMs) {
                    return; // Exit the function to avoid saving again
                }
            }

            // If no recent timestamp or no timestamp at all, save the current time
            saveTimestamp();
        } else {
            // If sessionRaces is not 0, load the time difference
            const timeDifference = loadTimeDif();

            if (timeDifference !== null) {
                rta.textContent = timeDifference;
            } else {
                rta.textContent = "N/A";
            }
        }
    }
    return {
        root,
        updateStats: (data) => {
            if (typeof data?.playTime === "number") {
                playtime.textContent = formatPlayTime(data.playTime);
            }
            if (typeof data?.lastRaces === "string") {
                lastRace.textContent = lastRaceStat(data);
                avgtime.textContent = getAverageTime(data);
                avgSpeed.textContent = getAverageWPM(data);
            }
            if (typeof data?.racesPlayed === "number") {
                //console.log(data);
                totalRaces.textContent = data.racesPlayed.toLocaleString();
                if (teamRaces) {
                    const trueTeamRaces = (data.racesPlayed - TEAM_RACES_DIF).toLocaleString();
                    teamRaces.textContent = `${trueTeamRaces}`;
                }
                const trueSeasonRaces = (data.racesPlayed - CURRENT_SEASON_DIF).toLocaleString();
                seasonRaces.textContent = `${trueSeasonRaces}`;
            }
            if (typeof data?.sessionRaces === "number") {
                sessionRaces.textContent = data.sessionRaces.toLocaleString();
                handleSessionRaces(data);
            }
            if (typeof data?.avgAcc === "string" || typeof data?.avgAcc === "number") {
                avgAccuracy.textContent = data.avgAcc
            }
            if (typeof data?.avgSpeed === "number") {
                //avgSpeed.textContent = data.avgSpeed
            } else if (typeof data?.avgScore === "number") {
                //avgSpeed.textContent = data.avgScore
            }
        },
    }
})()

////////////
//  Main  //
////////////

/* Add stats into race page with current values */
getStats().then(({
    user,
    dailyChallenges
}) => {
    StatWidget.updateStats(user)
    SeasonProgressWidget.updateStats(user)
    DailyChallengeWidget.updateStats(dailyChallenges)
    ToolbarWidget.updateStats(user)
    logging.info("Update")("Start of race")

    const root = document.createElement("div"),
        body = document.createElement("div")
    root.classList.add("nt-stats-root")
    body.classList.add("nt-stats-body")

    const leftSection = document.createElement("div")
    leftSection.classList.add("nt-stats-left-section")
    leftSection.append(DailyChallengeWidget.root)

    const rightSection = document.createElement("div")
    rightSection.classList.add("nt-stats-right-section")

    rightSection.append(StatWidget.root, SeasonProgressWidget.root)
    if(enableStats){
        body.append(leftSection, rightSection)
        root.append(body, ToolbarWidget.root)

        raceContainer.parentElement.append(root)
    }
})

getTeamStats().then(
    (data) => {
        const {
            member,
            season
        } = data
        StatWidget.updateStats({
            teamRaces: member.played,
            seasonPoints: season.points,
        })
    },
    (err) => {
        if (err.message !== "User is not in a team") {
            return Promise.reject(err)
        }
    }
)

getSummaryStats().then(({
    seasonBoard
}) => {
    if (!seasonBoard) {
        return
    }
    StatWidget.updateStats({
        seasonRaces: seasonBoard.played,
    })
})

/** Broadcast Channel to let other windows know that stats updated. */
const MESSGAE_LAST_RACE_UPDATED = "last_race_updated",
    MESSAGE_DAILY_CHALLANGE_UPDATED = "stats_daily_challenge_updated",
    MESSAGE_USER_STATS_UPDATED = "stats_user_updated"

const statChannel = new BroadcastChannel("NTRacingStats")
statChannel.onmessage = (e) => {
    const [type, payload] = e.data
    switch (type) {
        case MESSGAE_LAST_RACE_UPDATED:
            getStats().then(({
                user,
                dailyChallenges
            }) => {
                StatWidget.updateStats(user)
                SeasonProgressWidget.updateStats(user)
                DailyChallengeWidget.updateStats(dailyChallenges)
                ToolbarWidget.updateStats(user)
            })
            break
        case MESSAGE_DAILY_CHALLANGE_UPDATED:
            DailyChallengeWidget.updateStats(payload)
            break
        case MESSAGE_USER_STATS_UPDATED:
            StatWidget.updateStats(payload)
            SeasonProgressWidget.updateStats(payload)
            break
    }
}

/** Sync Daily Challenge data. */
server.on("setup", (e) => {
    const dailyChallenges = mergeDailyChallengeData(e.challenges)
    DailyChallengeWidget.updateStats(dailyChallenges)
    statChannel.postMessage([MESSAGE_DAILY_CHALLANGE_UPDATED, dailyChallenges])
})

/** Sync some of the User Stat data. */
server.on("joined", (e) => {
    if (e.userID !== currentUser.userID) {
        return
    }
    const payload = {
        level: e.profile?.level,
        racesPlayed: e.profile?.racesPlayed,
        sessionRaces: e.profile?.sessionRaces,
        avgSpeed: e.profile?.avgSpeed,
    }
    StatWidget.updateStats(payload)
    SeasonProgressWidget.updateStats(payload)
    statChannel.postMessage([MESSAGE_USER_STATS_UPDATED, payload])
})

/** Track Race Finish exact time. */
let hasCollectedResultStats = false

server.on("update", (e) => {
    const me = e?.racers?.find((r) => r.userID === currentUser.userID)
    if (me.progress.completeStamp > 0 && me.rewards?.current && !hasCollectedResultStats) {
        hasCollectedResultStats = true
        db.backupStatData.put({
            ...me.rewards.current,
            challenges: me.challenges,
            userID: currentUser.userID
        }).then(() => {
            statChannel.postMessage([MESSGAE_LAST_RACE_UPDATED])
        })
    }
})

/** Mutation observer to check if Racing Result has shown up. */
const resultObserver = new MutationObserver(([mutation], observer) => {
    for (const node of mutation.addedNodes) {
        if (node.classList?.contains("race-results")) {
            observer.disconnect()
            logging.info("Update")("Race Results received")

            //AUTO RELOAD
            //logstats();
            //setTimeout(() => location.reload(), autoReloadMS);
            //AUTO RELOAD

            getStats().then(({
                user,
                dailyChallenges
            }) => {
                StatWidget.updateStats(user)
                SeasonProgressWidget.updateStats(user)
                DailyChallengeWidget.updateStats(dailyChallenges)
                ToolbarWidget.updateStats(user)
                if (reloadOnStats) {
                    location.reload()
                }
            })
            break
        }
    }
})
resultObserver.observe(raceContainer, {
    childList: true,
    subtree: true
})


///MINI MAP




PIXI.utils.skipHello()

style.appendChild(
    document.createTextNode(`
.nt-racing-mini-map-root canvas {
    display: block;
}`))
document.head.appendChild(style)

const racingMiniMap = new PIXI.Application({
        width: 1024,
        height: 100,
        backgroundColor: config.colors.background,
        backgroundAlpha: 0.66
    }),
    container = document.createElement("div");

container.className = "nt-racing-mini-map-root"

///////////////////////
//  Prepare Objects  //
///////////////////////
if(scrollPage){window.scrollTo(0, document.body.scrollHeight);}

const RACER_WIDTH = 28,
    CROSSING_LINE_WIDTH = 32,
    PADDING = 2,
    racers = Array(5).fill(null),
    currentUserID = raceObj.props.user.userID

// Draw mini racetrack
const raceTrackBG = new PIXI.TilingSprite(PIXI.Texture.EMPTY, racingMiniMap.renderer.width, racingMiniMap.renderer.height),
    startLine = PIXI.Sprite.from(PIXI.Texture.WHITE),
    finishLine = PIXI.Sprite.from(PIXI.Texture.WHITE)

startLine.x = CROSSING_LINE_WIDTH
startLine.y = 0
startLine.width = 1
startLine.height = racingMiniMap.renderer.height
startLine.tint = config.colors.startLine

finishLine.x = racingMiniMap.renderer.width - CROSSING_LINE_WIDTH - 1
finishLine.y = 0
finishLine.width = 1
finishLine.height = racingMiniMap.renderer.height
finishLine.tint = config.colors.finishLine

raceTrackBG.addChild(startLine, finishLine)

for (let i = 1; i < 5; i++) {
    const lane = PIXI.Sprite.from(PIXI.Texture.WHITE)
    lane.x = 0
    lane.y = i * (racingMiniMap.renderer.height / 5)
    lane.width = racingMiniMap.renderer.width
    lane.height = 1
    lane.tint = config.colors.raceLane
    raceTrackBG.addChild(lane)
}

racingMiniMap.stage.addChild(raceTrackBG)

/* Mini Map movement animation update. */
function animateRacerTicker() {
    const r = this
    const lapse = Date.now() - r.lastUpdated
    if (r.sprite.x < r.toX) {
        const distance = r.toX - r.fromX
        r.sprite.x = r.fromX + Math.min(distance, distance * (lapse / r.moveMS))
        if (r.ghostSprite && r.sprite.x === r.ghostSprite.x) {
            r.ghostSprite.renderable = false
        }
    }
    if (r.skipped > 0) {
        const nitroTargetWidth = r.nitroToX - r.nitroFromX
        if (r.nitroSprite.width < nitroTargetWidth) {
            r.nitroSprite.width = Math.min(nitroTargetWidth, r.sprite.x - r.nitroFromX)
        } else if (r.nitroSprite.width === nitroTargetWidth && r.nitroSprite.alpha > 0 && !r.nitroDisableFade) {
            if (r.nitroSprite.alpha === 1) {
                r.nitroStartFadeStamp = Date.now() - 1
            }
            r.nitroSprite.alpha = Math.max(0, 1 - ((Date.now() - r.nitroStartFadeStamp) / 1e3))
        }
    }
    if (r.completeStamp !== null && r.sprite.x === r.toX && r.nitroSprite.alpha === 0) {
        racingMiniMap.ticker.remove(animateRacerTicker, this)
    }
}

/* Handle adding in players on the mini map. */
server.on("joined", (e) => {
    //console.log(my_race_started);
    my_race_started = true;
    if(scrollPage){window.scrollTo(0, document.body.scrollHeight);}
    const {
        lane,
        userID
    } = e

    let color = config.colors.opponentBot
    if (userID === currentUserID) {
        color = config.colors.me
    } else if (!e.robot) {
        color = config.colors.opponentPlayer
    } else if (e.profile.specialRobot === "wampus") {
        color = config.colors.opponentWampus
    }

    if (racers[lane]) {
        racers[lane].ghostSprite.tint = color
        racers[lane].sprite.tint = color
        racers[lane].sprite.x = 0 - RACER_WIDTH + PADDING
        racers[lane].lastUpdated = Date.now()
        racers[lane].fromX = racers[lane].sprite.x
        racers[lane].toX = PADDING
        racers[lane].sprite.renderable = true
        return
    }

    const r = PIXI.Sprite.from(PIXI.Texture.WHITE)
    r.x = 0 - RACER_WIDTH + PADDING
    r.y = PADDING + (lane > 0 ? 1 : 0) + (lane * (racingMiniMap.renderer.height / 5))
    r.tint = color
    r.width = RACER_WIDTH
    r.height = 16 - (lane > 0 ? 1 : 0)

    const n = PIXI.Sprite.from(PIXI.Texture.WHITE)
    n.y = r.y + ((16 - (lane > 0 ? 1 : 0)) / 2) - 1
    n.renderable = false
    n.tint = config.colors.nitro
    n.width = 1
    n.height = 2

    racers[lane] = {
        lane,
        sprite: r,
        userID: userID,
        ghostSprite: null,
        nitroSprite: n,
        lastUpdated: Date.now(),
        fromX: r.x,
        toX: PADDING,
        skipped: 0,
        nitroStartFadeStamp: null,
        nitroFromX: null,
        nitroToX: null,
        nitroDisableFade: false,
        moveMS: 250,
        completeStamp: null,
    }

    if (config.moveDestination.enabled) {
        const g = PIXI.Sprite.from(PIXI.Texture.WHITE)
        g.x = PADDING
        g.y = PADDING + (lane > 0 ? 1 : 0) + (lane * (racingMiniMap.renderer.height / 5))
        g.tint = color
        g.alpha = config.moveDestination.alpha
        g.width = RACER_WIDTH
        g.height = 16 - (lane > 0 ? 1 : 0)
        g.renderable = false

        racers[lane].ghostSprite = g
        racingMiniMap.stage.addChild(g)
    }

    racingMiniMap.stage.addChild(n)
    racingMiniMap.stage.addChild(r)

    racingMiniMap.ticker.add(animateRacerTicker, racers[lane])
})

/* Handle any players leaving the race track. */
server.on("left", (e) => {
    const lane = racers.findIndex((r) => r?.userID === e)
    if (racers[lane]) {
        racers[lane].sprite.renderable = false
        racers[lane].ghostSprite.renderable = false
        racers[lane].nitroSprite.renderable = false
    }
})

/* Handle race map progress position updates. */
server.on("update", (e) => {
    if(scrollPage){window.scrollTo(0, document.body.scrollHeight);}
    let moveFinishMS = 100

    const payloadUpdateRacers = e.racers.slice().sort((a, b) => {
        if (a.progress.completeStamp === b.progress.completeStamp) {
            return 0
        }
        if (a.progress.completeStamp === null) {
            return 1
        }
        return a.progress.completeStamp > 0 && b.progress.completeStamp > 0 && a.progress.completeStamp > b.progress.completeStamp ? 1 : -1
    })

    for (let i = 0; i < payloadUpdateRacers.length; i++) {
        const r = payloadUpdateRacers[i],
            {
                completeStamp,
                skipped
            } = r.progress,
            racerObj = racers[r.lane]
        if (!racerObj || racerObj.completeStamp > 0 || (r.userID === currentUserID && completeStamp <= 0 && config.trackLocally)) {
            continue
        }

        if (r.disqualified) {
            racingMiniMap.ticker.remove(animateRacerTicker, racerObj)
            racingMiniMap.stage.removeChild(racerObj.sprite, racerObj.nitroSprite)
            if (racerObj.ghostSprite) {
                racingMiniMap.stage.removeChild(racerObj.ghostSprite)
            }
            racerObj.sprite.destroy()
            racerObj.ghostSprite.destroy()
            racerObj.nitroSprite.destroy()

            racers[r.lane] = null
            continue
        }

        racerObj.lastUpdated = Date.now()
        racerObj.fromX = racerObj.sprite.x

        if (racerObj.completeStamp === null && completeStamp > 0) {
            racerObj.completeStamp = completeStamp
            racerObj.toX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            racerObj.moveMS = moveFinishMS

            if (racerObj.nitroDisableFade) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
                racerObj.nitroDisableFade = false
            }
        } else {
            racerObj.moveMS = 1e3
            racerObj.toX = r.progress.percentageFinished * (racingMiniMap.renderer.width - RACER_WIDTH - CROSSING_LINE_WIDTH - PADDING - 1)
            racerObj.sprite.x = racerObj.fromX
        }

        if (racerObj.ghostSprite) {
            racerObj.ghostSprite.x = racerObj.toX
            racerObj.ghostSprite.renderable = true
        }

        if (skipped !== racerObj.skipped) {
            if (racerObj.skipped === 0) {
                racerObj.nitroFromX = racerObj.fromX
                racerObj.nitroSprite.x = racerObj.fromX
                racerObj.nitroSprite.renderable = true
            }
            racerObj.skipped = skipped // because infinite nitros exist? :/
            racerObj.nitroToX = racerObj.toX
            racerObj.nitroSprite.alpha = 1
            if (racerObj.completeStamp !== null) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            }
        }

        if (completeStamp > 0 && i + 1 < payloadUpdateRacers.length) {
            const nextRacer = payloadUpdateRacers[i + 1],
                nextRacerObj = racers[nextRacer?.lane]
            if (nextRacerObj && nextRacerObj.completeStamp === null && nextRacer.progress.completeStamp > 0 && nextRacer.progress.completeStamp > completeStamp) {
                moveFinishMS += 100
            }
        }
    }
})

if (config.trackLocally) {
    let lessonLength = 0
    server.on("status", (e) => {
        if (e.status === "countdown") {
            lessonLength = e.lessonLength
        }
    })

    const originalSendPlayerUpdate = server.sendPlayerUpdate
    server.sendPlayerUpdate = (data) => {
        originalSendPlayerUpdate(data)
        const racerObj = racers.find((r) => r?.userID === currentUserID)
        if (!racerObj) {
            return
        }

        const percentageFinished = (data.t / (lessonLength || 1))
        racerObj.lastUpdated = Date.now()
        racerObj.fromX = racerObj.sprite.x
        racerObj.moveMS = 100
        racerObj.toX = percentageFinished * (racingMiniMap.renderer.width - RACER_WIDTH - CROSSING_LINE_WIDTH - PADDING - 1)
        racerObj.sprite.x = racerObj.fromX

        if (racerObj.ghostSprite) {
            racerObj.ghostSprite.x = racerObj.toX
            racerObj.ghostSprite.renderable = true
        }

        if (data.s) {
            if (racerObj.skipped === 0) {
                racerObj.nitroFromX = racerObj.fromX
                racerObj.nitroSprite.x = racerObj.fromX
                racerObj.nitroSprite.renderable = true
            }
            racerObj.skipped = data.s // because infinite nitros exist? but I'm not going to test that! :/
            racerObj.nitroToX = racerObj.toX
            racerObj.nitroSprite.alpha = 1
            racerObj.nitroDisableFade = percentageFinished === 1

            if (racerObj.completeStamp !== null) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            }
        }
    }
}

/////////////
//  Final  //
/////////////

if (ENABLE_MINI_MAP) {
    container.append(racingMiniMap.view)
    raceContainer.after(container)
}

//alt wpm thingy

/** Get Nitro Word Length. */
const nitroWordLength = (words, i) => {
    let wordLength = words[i].length + 1
    if (i > 0 && i + 1 < words.length) {
        wordLength++
    }
    return wordLength
}

/** Get Player Avg using lastRaces data. */
const getPlayerAvg = (prefix, raceObj, lastRaces) => {
    const raceLogs = (lastRaces || raceObj.props.user.lastRaces)
        .split("|")
        .map((r) => {
            const data = r.split(","),
                typed = parseInt(data[0], 10),
                time = parseFloat(data[1]),
                errs = parseInt(data[2])
            if (isNaN(typed) || isNaN(time) || isNaN(errs)) {
                return false
            }
            return {
                time,
                acc: 1 - errs / typed,
                wpm: typed / 5 / (time / 60),
            }
        })
        .filter((r) => r !== false)

    const avgSpeed = raceLogs.reduce((prev, current) => prev + current.wpm, 0.0) / Math.max(raceLogs.length, 1)

    logging.info(prefix)("Avg Speed", avgSpeed)
    console.table(raceLogs, ["time", "acc", "wpm"])

    return avgSpeed
}

///////////////
//  Backend  //
///////////////

if (config.targetWPM <= 0) {
    logging.error("Init")("Invalid target WPM value")
    return
}

let raceTimeLatency = null

/** Styles for the following components. */
const styleNew = document.createElement("style")
styleNew.appendChild(
    document.createTextNode(`
/* Some Overrides */
.race-results {
    z-index: 6;
}

/* Sandbagging Tool */
.nt-evil-sandbagging-root {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 5;
    color: #eee;
    touch-action: none;
}
.nt-evil-sandbagging-metric-value {
    font-weight: 600;
    font-family: "Roboto Mono", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
}
.nt-evil-sandbagging-metric-suffix {
    color: #aaa;
}
.nt-evil-sandbagging-live {
    padding: 5px;
    border-radius: 8px;
    color: #FF69B4;
    background-color: rgb(0, 0, 0, 0.5);
    text-align: center;
}
.nt-evil-sandbagging-live span.live-wpm-inactive {
    opacity: 1;
}
.nt-evil-sandbagging-live > span:not(.live-wpm-inactive) .nt-evil-sandbagging-metric-value {
    color: #ffe275;
}
.nt-evil-sandbagging-best-live-wpm {
    font-size: 10px;
}
.nt-evil-sandbagging-section {
    padding: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 10px;
    text-align: center;
}
.nt-evil-sandbagging-stats {
    background-color: rgba(20, 20, 20, 0.95);
}
.nt-evil-sandbagging-results {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: rgba(55, 55, 55, 0.95);
}`)
)
document.head.appendChild(styleNew);

/** Manages and displays the race timer. */
const RaceTimer = ((config) => {
    // Restore widget settings
    let widgetSettings = null
    try {
        const data = localStorage.getItem("nt_sandbagging_tool")
        if (typeof data === "string") {
            widgetSettings = JSON.parse(data)
        }
    } catch {
        widgetSettings = null
    }
    if (widgetSettings === null) {
        widgetSettings = { x: 384, y: 285 }
    }

    // Setup Widget
    const root = document.createElement("div")
    root.classList.add("nt-evil-sandbagging-root", "has-live-wpm")
    root.dataset.x = widgetSettings.x
    root.dataset.y = widgetSettings.y
    root.style.transform = `translate(${parseFloat(root.dataset.x) || 0}px, ${parseFloat(root.dataset.y) || 0}px)`
    root.innerHTML = `
        <div class="nt-evil-sandbagging-live">
            <span class="nt-evil-sandbagging-current-live-wpm live-wpm-inactive">
                <small class="nt-evil-sandbagging-metric-suffix">Prepare for your race!</small><span class="nt-evil-sandbagging-live-wpm nt-evil-sandbagging-metric-value"></span>
            </span>
            <span class="nt-evil-sandbagging-best-live-wpm live-wpm-inactive">
                (<span class="nt-evil-sandbagging-metric-value">0.00</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small>)
            </span>
        </div>
        <div class="nt-evil-sandbagging-section nt-evil-sandbagging-stats">
            Timer: <span class="nt-evil-sandbagging-live-time nt-evil-sandbagging-metric-value">0.00</span> / <span class="nt-evil-sandbagging-target-time nt-evil-sandbagging-metric-value">0.00</span> <small class="nt-evil-sandbagging-metric-suffix">sec</small> |
            Target: <span class="nt-evil-sandbagging-metric-value">${config.targetWPM}</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Avg: <span class="nt-evil-sandbagging-current-avg-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small>
        </div>
        <div class="nt-evil-sandbagging-section nt-evil-sandbagging-results">
            Time: <span class="nt-evil-sandbagging-result-time nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">secs</small> |
            Speed: <span class="nt-evil-sandbagging-result-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Avg: <span class="nt-evil-sandbagging-new-avg-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Latency: <span class="nt-evil-sandbagging-latency nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">ms</small>
        </div>`

    const liveContainerNode = root.querySelector(".nt-evil-sandbagging-live"),
          liveCurrentWPMContainerNode = liveContainerNode.querySelector(".nt-evil-sandbagging-current-live-wpm"),
        liveWPMValueNode = liveCurrentWPMContainerNode.querySelector(".nt-evil-sandbagging-live-wpm"),
        liveBestWPMContainerNode = liveContainerNode.querySelector(".nt-evil-sandbagging-best-live-wpm"),
        liveBestWPMValueNode = liveBestWPMContainerNode.querySelector(".nt-evil-sandbagging-metric-value"),
        statContainerNode = root.querySelector(".nt-evil-sandbagging-stats"),
        liveTimeNode = statContainerNode.querySelector(".nt-evil-sandbagging-live-time"),
        targetTimeNode = statContainerNode.querySelector(".nt-evil-sandbagging-target-time"),
        currentAvgWPMNode = statContainerNode.querySelector(".nt-evil-sandbagging-current-avg-wpm"),
        resultContainerNode = root.querySelector(".nt-evil-sandbagging-results"),
        resultTimeNode = resultContainerNode.querySelector(".nt-evil-sandbagging-result-time"),
        resultWPMNode = resultContainerNode.querySelector(".nt-evil-sandbagging-result-wpm"),
        resultNewAvgWPMNode = resultContainerNode.querySelector(".nt-evil-sandbagging-new-avg-wpm"),
        resultLatencyNode = resultContainerNode.querySelector(".nt-evil-sandbagging-latency")

    resultContainerNode.remove()

statContainerNode.style.display = 'none';
    liveBestWPMContainerNode.style.display = 'none';
resultContainerNode.style.display = 'none';

    let timer = null,
        targetWPM = config.targetWPM || 79.49,
        startTime = null,
        finishTime = null,
        skipLength = null,
        bestSkipLength = null,
        lessonLength = null,
        onTargetTimeUpdate = null,
        onTimeUpdate = null

    /** Updates the race timer metrics. */
    const refreshCurrentTime = () => {
        if (startTime === null) {
            logging.warn("Update")("Invalid last time, unable to update current timer")
            return
        }
        if (finishTime !== null) {
            return
        }

        let diff = Date.now() - startTime
        if (onTimeUpdate) {
            onTimeUpdate(diff)
        }
        liveTimeNode.textContent = (diff / 1e3).toFixed(2);

        diff /= 6e4;
        const suffixwpm = document.querySelector(".nt-evil-sandbagging-metric-suffix");
        const currentWPM = (lessonLength - skipLength) / 5 / diff,
              bestWPM = (lessonLength - bestSkipLength) / 5 / diff
        if (currentWPM < (config.targetWPM+20)){
            liveWPMValueNode.textContent = (currentWPM-config.dif).toFixed(1);
            suffixwpm.style.display = 'block';
        }
        else {

            suffixwpm.style.display = 'none';
            liveWPMValueNode.textContent = "Just type...!"
        }
        liveBestWPMValueNode.textContent = bestWPM.toFixed(2)

        if (currentWPM - targetWPM <= config.indicateWPMWithin) {
            liveCurrentWPMContainerNode.classList.remove("live-wpm-inactive")
        }
        if (bestWPM - targetWPM <= config.indicateWPMWithin) {
            liveBestWPMContainerNode.classList.remove("live-wpm-inactive")
        }
        timer = setTimeout(refreshCurrentTime, config.timerRefreshIntervalMS)
    }

    /** Toggle whether to show best wpm counter or not (the small text). */
    const toggleBestLiveWPM = (show) => {
        if (show) {
            liveContainerNode.append(liveBestWPMContainerNode)
        } else {
            liveBestWPMContainerNode.remove()
        }
    }

    /** Save widget settings. */
    const saveSettings = () => {
        localStorage.setItem("nt_sandbagging_tool", JSON.stringify(widgetSettings))
    }
    saveSettings()

    /** Setup draggable widget. */
    interact(root).draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                //restriction: "parent",
                endOnly: true,
            }),
        ],
        listeners: {
            move: (event) => {
                const target = event.target,
                    x = (parseFloat(target.dataset.x) || 0) + event.dx,
                    y = (parseFloat(target.dataset.y) || 0) + event.dy

                target.style.transform = "translate(" + x + "px, " + y + "px)"

                target.dataset.x = x
                target.dataset.y = y

                widgetSettings.x = x
                widgetSettings.y = y

                saveSettings()
            },
        },
    })

    return {
        root,
        setTargetWPM: (wpm) => {
            targetWPM = wpm
        },
        setLessonLength: (l) => {
            lessonLength = l
        },
        getLessonLength: () => lessonLength,
        setSkipLength: (l) => {
            skipLength = l
            toggleBestLiveWPM(false)
            if (skipLength !== bestSkipLength) {
                const newTime = ((lessonLength - skipLength) / 5 / targetWPM) * 60
                if (onTargetTimeUpdate) {
                    onTargetTimeUpdate(newTime * 1e3)
                }
                targetTimeNode.textContent = newTime.toFixed(2)
            }
        },
        setBestSkipLength: (l) => {
            bestSkipLength = l
            const newTime = ((lessonLength - bestSkipLength) / 5 / targetWPM) * 60
            if (onTargetTimeUpdate) {
                onTargetTimeUpdate(newTime * 1e3)
            }
            targetTimeNode.textContent = newTime.toFixed(2)
        },
        start: (t) => {
            if (timer) {
                clearTimeout(timer)
            }
            //startTime = t
            startTime = Date.now();
            refreshCurrentTime()
        },
        stop: () => {
            if (timer) {
                finishTime = Date.now()
                clearTimeout(timer)
            }
        },
        setCurrentAvgSpeed: (wpm) => {
            currentAvgWPMNode.textContent = wpm.toFixed(2)
        },
        reportFinishResults: (speed, avgSpeed, actualStartTime, actualFinishTime) => {
            const latency = actualFinishTime - finishTime,
                output = (latency / 1e3).toFixed(2)

            resultTimeNode.textContent = ((actualFinishTime - actualStartTime) / 1e3).toFixed(2)
            resultWPMNode.textContent = speed.toFixed(2)
            liveWPMValueNode.textContent = speed.toFixed(2)
            resultNewAvgWPMNode.textContent = avgSpeed.toFixed(2)
            resultLatencyNode.textContent = latency
            toggleBestLiveWPM(false)

            root.append(resultContainerNode)

            logging.info("Finish")(`Race Finish acknowledgement latency: ${output} secs (${latency}ms)`)
            return output
        },
        setOnTargetTimeUpdate: (c) => {
            onTargetTimeUpdate = c
        },
        setOnTimeUpdate: (c) => {
            onTimeUpdate = c
        },
    }
})(config)

window.NTRaceTimer = RaceTimer

/** Track Racing League for analysis. */
server.on("setup", (e) => {
    if (e.scores && e.scores.length === 2) {
        const [from, to] = e.scores
        logging.info("Init")("Racing League", JSON.stringify({ from, to, trackLeader: e.trackLeader }))
        RaceTimer.setCurrentAvgSpeed(getPlayerAvg("Init", raceObj))
    }
})
var countdownTimer = -1;
/** Track whether to start the timer and manage target goals. */
server.on("status", (e) => {
    if (e.status === "countdown") {
        const wpmtextnode = document.querySelector(".nt-evil-sandbagging-live-wpm");
        const wpmsuffix = document.querySelector(".nt-evil-sandbagging-metric-suffix");
        if (countdownTimer !== -1) {
            return
        }
        var lastCountdown = 400;
        wpmsuffix.textContent = "Race starts in... ";
        countdownTimer = setInterval(() => {
             wpmtextnode.textContent = (lastCountdown/100).toFixed(2);
            lastCountdown--;
           }, 10)

        RaceTimer.setLessonLength(e.lessonLength)

        const words = e.lesson.split(" ")

        let mostLetters = null,
            nitroWordCount = 0
        words.forEach((_, i) => {
            let wordLength = nitroWordLength(words, i)
            if (mostLetters === null || mostLetters < wordLength) {
                mostLetters = wordLength
            }
        })
        RaceTimer.setBestSkipLength(mostLetters)
    } else if (e.status === "racing") {
        const wpmsuffix = document.querySelector(".nt-evil-sandbagging-metric-suffix");
        wpmsuffix.textContent = "Possible WPM: ";
        clearInterval(countdownTimer);
        RaceTimer.start(e.startStamp - config.raceLatencyMS)

        const originalSendPlayerUpdate = server.sendPlayerUpdate
        server.sendPlayerUpdate = (data) => {
            originalSendPlayerUpdate(data)
            if (data.t >= RaceTimer.getLessonLength()) {
                RaceTimer.stop()
            }
            if (typeof data.s === "number") {
                RaceTimer.setSkipLength(data.s)
            }
        }
    }
})

/** Track Race Finish exact time. */
server.on("update", (e) => {
    const me = e?.racers?.find((r) => r.userID === currentUserID)
    if (raceTimeLatency === null && me.progress.completeStamp > 0 && me.rewards) {
        const { typed, skipped, startStamp, completeStamp } = me.progress

        raceTimeLatency = RaceTimer.reportFinishResults(
            (typed - skipped) / 5 / ((completeStamp - startStamp) / 6e4),
            getPlayerAvg("Finish", raceObj, me.rewards.current.lastRaces),
            startStamp,
            completeStamp
        )
    }
})

/////////////
//  Final  //
/////////////
if (ENABLE_ALT_WPM_COUNTER){
    raceContainer.append(RaceTimer.root);
}




