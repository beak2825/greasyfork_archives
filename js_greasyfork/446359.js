// ==UserScript==
// @name         Nitro Type - Racing Stats
// @version      0.1.6
// @description  Displays various user stats below the race track.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js#sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/446359/Nitro%20Type%20-%20Racing%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/446359/Nitro%20Type%20-%20Racing%20Stats.meta.js
// ==/UserScript==

/* global Dexie moment NTGLOBALS createLogger findReact */

const logging = createLogger("Nitro Type Racing Stats")

/* Config storage */
const db = new Dexie("NTRacingStats")
db.version(1).stores({
    backupStatData: "userID",
})
db.open().catch(function (e) {
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

//////////////////
//  Components  //
//////////////////

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`
#raceContainer {
    margin-bottom: 0;
}
.nt-stats-root {
    background-color: #222;
}
.nt-stats-body {
    display: flex;
    justify-content: space-between;
    padding: 8px;
}
.nt-stats-left-section, .nt-stats-right-section  {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}
.nt-stats-toolbar {
    display: flex;
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
    padding: 8px;
    margin: 0 auto;
    border-radius: 8px;
    background-color: #1b83d0;
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
}
.nt-stats-metric-row {
    margin-bottom: 4px;
}
.nt-stats-metric-value, .nt-stats-metric-suffix {
    font-weight: 600;
}
.nt-stats-metric-suffix {
    color: #aaa;
}
.nt-stats-right-section {
    flex-grow: 1;
    margin-left: 15px;
}`)
)
document.head.appendChild(style)

/** Populates daily challenge data merges in the given progress. */
const mergeDailyChallengeData = (progress) => {
    const { CHALLENGES, CHALLENGE_TYPES } = NTGLOBALS,
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
    let backupUserStats = null
    try {
        backupUserStats = await db.backupStatData.get(currentUser.userID)
    } catch (ex) {
        logging.warn("Update")("Unable to get backup stats", ex)
    }
    try {
        const persistStorageStats = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user),
            user =
                !backupUserStats || typeof backupUserStats.lastConsecRace !== "number" || persistStorageStats.lastConsecRace >= backupUserStats.lastConsecRace
                    ? persistStorageStats
                    : backupUserStats,
            dailyChallenges = mergeDailyChallengeData(user.challenges)
        return { user, dailyChallenges }
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

    getStats().then(({ dailyChallenges }) => {
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
        const { startingLevels, experiencePerStartingLevel, experiencePerAchievementLevel, experiencePerExtraLevels } = NTGLOBALS.SEASON_LEVELS

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
            const { type, value } = achievement.reward
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
            <span class="nt-stats-metric nt-stats-metric-total-races">
                <span class="nt-stats-metric-heading">Total Races:</span>
                <span class="nt-stats-metric-value">0</span>
            </span>
            <span class="nt-stats-metric-separator">|</span>
            <span class="nt-stats-metric nt-stats-metric-season-races">
                <span class="nt-stats-metric-heading">Season Races:</span>
                <span class="nt-stats-metric-value">N/A</span>
            <span class="nt-stats-metric-separator">|</span>
            </span>
            <span class="nt-stats-metric nt-stats-metric-session-races">
                <span class="nt-stats-metric-heading">Current Session:</span>
                <span class="nt-stats-metric-value">0</div>
            </span>
        </div>
        <div class="nt-stats-metric-row">
            ${
                currentUser.tag
                    ? `<span class="nt-stats-metric nt-stats-metric-team-races">
                <span class="nt-stats-metric-heading">Team Races:</span>
                <span class="nt-stats-metric-value">N/A</span>
            </span>
            <span class="nt-stats-metric-separator">|</span>
            <span class="nt-stats-metric nt-stats-metric-season-points">
                <span class="nt-stats-metric-heading">Season Points:</span>
                <span class="nt-stats-metric-value">N/A</span>
            </span>
            <span class="nt-stats-metric-separator">|</span>`
                    : ``
            }
            <span class="nt-stats-metric nt-stats-metric-avg-speed">
                <span class="nt-stats-metric-heading">Avg Speed:</span>
                <span class="nt-stats-metric-value">0</span>
                <span class="nt-stats-metric-suffix">WPM</span>
            </span>
            <span class="nt-stats-metric-separator">|</span>
            <span class="nt-stats-metric nt-stats-metric-avg-accuracy">
                <span class="nt-stats-metric-heading">Avg Acc:</span>
                <span class="nt-stats-metric-value">0</span><span class="nt-stats-metric-suffix nt-stats-metric-suffix-no-space">%</span>
            </span>
        </div>`

    const totalRaces = root.querySelector(".nt-stats-metric-total-races .nt-stats-metric-value"),
        sessionRaces = root.querySelector(".nt-stats-metric-session-races .nt-stats-metric-value"),
        teamRaces = currentUser.tag ? root.querySelector(".nt-stats-metric-team-races .nt-stats-metric-value") : null,
        seasonRaces = root.querySelector(".nt-stats-metric-season-races .nt-stats-metric-value"),
        seasonPoints = root.querySelector(".nt-stats-metric-season-points .nt-stats-metric-value"),
        avgSpeed = root.querySelector(".nt-stats-metric-avg-speed .nt-stats-metric-value"),
        avgAccuracy = root.querySelector(".nt-stats-metric-avg-accuracy .nt-stats-metric-value")

    return {
        root,
        updateStats: (data) => {
            if (typeof data?.racesPlayed === "number") {
                totalRaces.textContent = data.racesPlayed.toLocaleString()
            }
            if (typeof data?.sessionRaces === "number") {
                sessionRaces.textContent = data.sessionRaces.toLocaleString()
            }
            if (typeof data?.seasonRaces === "string") {
                const value = parseInt(data.seasonRaces, 10)
                seasonRaces.textContent = isNaN(value) ? data.seasonRaces : value.toLocaleString()
            }
            if (typeof data?.seasonPoints === "number") {
                seasonPoints.textContent = data.seasonPoints.toLocaleString()
            }
            if (typeof data?.teamRaces === "number" && teamRaces) {
                teamRaces.textContent = data.teamRaces.toLocaleString()
            }
            if (typeof data?.avgAcc === "string" || typeof data?.avgAcc === "number") {
                avgAccuracy.textContent = data.avgAcc
            }
            if (typeof data?.avgSpeed === "number") {
                avgSpeed.textContent = data.avgSpeed
            } else if (typeof data?.avgScore === "number") {
                avgSpeed.textContent = data.avgScore
            }
        },
    }
})()

////////////
//  Main  //
////////////

/* Add stats into race page with current values */
getStats().then(({ user, dailyChallenges }) => {
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

    body.append(leftSection, rightSection)
    root.append(body, ToolbarWidget.root)

    raceContainer.parentElement.append(root)
})

getTeamStats().then(
    (data) => {
        const { member, season } = data
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

getSummaryStats().then(({ seasonBoard }) => {
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
            getStats().then(({ user, dailyChallenges }) => {
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
        db.backupStatData.put({ ...me.rewards.current, challenges: me.challenges, userID: currentUser.userID }).then(() => {
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
            getStats().then(({ user, dailyChallenges }) => {
                StatWidget.updateStats(user)
                SeasonProgressWidget.updateStats(user)
                DailyChallengeWidget.updateStats(dailyChallenges)
                ToolbarWidget.updateStats(user)
            })
            getSummaryStats().then(({ seasonBoard }) => {
                if (!seasonBoard) {
                    return
                }
                StatWidget.updateStats({
                    seasonRaces: seasonBoard.played,
                })
            })
            getTeamStats().then((data) => {
                const { member, season } = data
                StatWidget.updateStats({
                    teamRaces: member.played,
                    seasonPoints: season.points,
                })
            })
            break
        }
    }
})
resultObserver.observe(raceContainer, { childList: true, subtree: true })
