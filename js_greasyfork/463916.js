// ==UserScript==
// @name         User Flags
// @description  Adds a flag to (almost) all usernames on Geoguessr
// @version      1.0.4
// @license      MIT
// @author       zorby#1431
// @namespace    https://greasyfork.org/en/users/986787-zorby
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/463916/User%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/463916/User%20Flags.meta.js
// ==/UserScript==

//=====================================================================================\\
//    change these values however you like (make sure to hit ctrl+s afterwards) :^)    \\
//=====================================================================================\\



const BIG_FLAG_TYPE = "flagpedia"
//                     ^^^^^^^^^ set this to either 'flagpedia' or 'geoguessr'
//                             flagpedia flags are more detailed but harder to identify at low resolution (subjective)
const SMALL_FLAG_TYPE = "geoguessr"
//                       ^^^^^^^^^ set this to either 'flagpedia' or 'geoguessr'
//                               geoguessr flags are less accurate but easier to identify at low resolution (subjective)


const USE_IFOPE_IF_FLAG_IS_MISSING = true
//                                   ^^^^^ set this to 'true' if you want to use the IFOPE for users who don't have their coutry set
//                                       https://www.flagofplanetearth.com/


const FLAGS_IN_FRIENDS_TAB = true
//                           ^^^^^ set this to 'true' if you want to display flags in the friends tab
//                               not recommended if you have many friends :^)
const FLAGS_IN_LEADERBOARD = true
//                           ^^^^  set this to 'false' if you don't want to display flags in leaderboards
const FLAGS_IN_PROFLE_PAGE = true
//                           ^^^^  set this to 'false' if you don't want to display flags in profile pages
const FLAGS_IN_MATCHMAKING = true
//                           ^^^^  set this to 'false' if you don't want to display flags in matchmaking lobbies
const FLAGS_IN_INGAME_PAGE = true
//                           ^^^^  set this to 'false' if you don't want to display flags ingame



//=====================================================================================\\
//  don't edit anything after this point unless you know what you're doing please :^)  \\
//=====================================================================================\\



/// CONSTANTS ///
const FLAGPEDIA_FLAG_ENDPOINT = "https://flagcdn.com"
const GEOGUESSR_FLAG_ENDPOINT = "https://www.geoguessr.com/static/flags"
const GEOGUESSR_USER_ENDPOINT = "https://geoguessr.com/api/v3/users"

const SCRIPT_PREFIX = "uf__"
const PROFIlE_FLAG_ID = SCRIPT_PREFIX + "profileFlag"
const USER_FLAG_CLASS = SCRIPT_PREFIX + "userFlag"

const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
}

const ERROR_MESSAGE = (wrong) => `looks like you made a typo! :O\n\nmake sure to set the big flag type to either 'flagpedia' or 'geoguessr'\n(you typed '${wrong}')\n\nyours truly, user flags script :^)`


/// MAIN ///
let bigFlagEndpoint, smallFlagEndpoint

if (BIG_FLAG_TYPE == "flagpedia") {
    bigFlagEndpoint = FLAGPEDIA_FLAG_ENDPOINT
} else if (BIG_FLAG_TYPE == "geoguessr") {
    bigFlagEndpoint = GEOGUESSR_FLAG_ENDPOINT
} else {
    alert(ERROR_MESSAGE(BIG_FLAG_TYPE))
    throw new Error()
}

if (SMALL_FLAG_TYPE == "flagpedia") {
    smallFlagEndpoint = FLAGPEDIA_FLAG_ENDPOINT
} else if (SMALL_FLAG_TYPE == "geoguessr") {
    smallFlagEndpoint = GEOGUESSR_FLAG_ENDPOINT
} else {
    alert(ERROR_MESSAGE(SMALL_FLAG_TYPE))
    throw new Error()
}

function bigFlag() {
    return `<img
        id="${PROFIlE_FLAG_ID}"
        style="margin-left: 0.4rem; vertical-align: middle; border-radius: 0.125rem; display: none;"
        width=30
        onerror="this.style.display = 'none'"
    >`
}

function smallFlag() {
    return `<img
        class="${USER_FLAG_CLASS}"
        style="margin-left: 0.1rem; margin-right: 0.1rem; vertical-align: middle; border-radius: 0.08rem; display: none;"
        width=13
        onerror="this.style.display = 'none'"
    >`
}

function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`))
}

function getFlagSvg(flagType, countryCode) {
    if (countryCode == null && USE_IFOPE_IF_FLAG_IS_MISSING) {
        return "https://upload.wikimedia.org/wikipedia/commons/e/ef/International_Flag_of_Planet_Earth.svg"
    }

    const endpoint = flagType == "big" ? bigFlagEndpoint : smallFlagEndpoint
    const svgName = endpoint == GEOGUESSR_FLAG_ENDPOINT ? countryCode.toUpperCase() : countryCode

    return `${endpoint}/${svgName}.svg`
}

async function fillFlag(flagImage, flagType, userId) {
    const userData = await getUserData(userId)
    const countryCode = userData.countryCode

    flagImage.setAttribute("src", getFlagSvg(flagType, countryCode))
    flagImage.style.display = "block"
}

function retrieveIdFromLink(link) {
    if (link.endsWith("/me/profile")) {
        const data = document.querySelector("#__NEXT_DATA__").text
        const json = JSON.parse(data)
        return json.props.middlewareResults[1].account.user.userId
    }
    return link.split("/").at(-1)
}

function isOtherProfile() {
    return pathMatches("user/.+")
}

function isOwnProfile() {
    return pathMatches("me/profile")
}

function isProfile() {
    return isOwnProfile() || isOtherProfile()
}

function isBattleRoyale() {
    return pathMatches("battle-royale/.+")
}

function isDuels() {
    return pathMatches("duels/.+")
}

async function getUserData(id) {
    const response = await fetch(`${GEOGUESSR_USER_ENDPOINT}/${id}`)
    const json = await response.json()

    return json
}

function addFlagToUsername(link, position) {
    position = position == null ? "beforeend" : position
    const dry = !link.querySelector(`.${USER_FLAG_CLASS}`)
    if (dry) {
        const destination = link.querySelector(".user-nick_nickWrapper__8Tnk4")
        destination.insertAdjacentHTML(position, smallFlag())
        const flagImage = destination.querySelector(`.${USER_FLAG_CLASS}`)

        if (destination.childElementCount > 2) {
            destination.insertBefore(flagImage, flagImage.previousElementSibling)
        }

        fillFlag(flagImage, "small", retrieveIdFromLink(link.href))
    }
    return dry
}

function addFlagToIngameUsername(link) {
    if (!link.querySelector(`.${USER_FLAG_CLASS}`)) {
        const destination = link.querySelector("span")
        destination.style.display = "flex"
        destination.innerHTML += "&nbsp;"
        destination.insertAdjacentHTML("beforeend", smallFlag())
        const flagImage = destination.lastChild

        if (destination.childElementCount > 2) {
            destination.insertBefore(flagImage, flagImage.previousElementSibling)
        }

        fillFlag(flagImage, "small", retrieveIdFromLink(link.href))
    }
}

let inBattleRoyale = false
let inDuels = false
let lastOpenedMapHighscoreTab = 0

function onMutationsBr(mutations, observer) {
    if (FLAGS_IN_INGAME_PAGE) {
        // battle royale distance
        for (const link of document.querySelectorAll(".distance-player-list_name__fPSwC a")) {
            addFlagToIngameUsername(link)
        }

        // battle royale countries
        for (const link of document.querySelectorAll(".countries-player-list_playerName__g4tnM a")) {
            addFlagToIngameUsername(link)
        }
    }
}

function onMutationsDuels(mutations, observer) {
    if (FLAGS_IN_INGAME_PAGE) {
        const hud = document.querySelector(".hud_root__RY5pu")

        const firstPlayerLink = hud.firstChild?.querySelector(".health-bar_player__9j0Vu a")
        if (firstPlayerLink) {
            addFlagToUsername(firstPlayerLink)
        }

        const secondPlayerLink = hud.lastChild?.querySelector(".health-bar_player__9j0Vu a")
        if (secondPlayerLink) {
            if(addFlagToUsername(secondPlayerLink, "afterbegin")) {
                const name = secondPlayerLink.querySelector(".user-nick_nick__y4VIt")
                name.innerHTML = "&nbsp;" + name.innerHTML
            }
        }

        if (document.querySelector(".round-score_container__s6qNg")) {
            const leftLink = document.querySelector(".round-score_healthLeft__TT8Kk .health-bar_player__9j0Vu a")
            addFlagToUsername(leftLink)
            const rightLink = document.querySelector(".round-score_healthRight__qgBbv .health-bar_player__9j0Vu a")
            if(addFlagToUsername(rightLink, "afterbegin")) {
                const name = rightLink.querySelector(".user-nick_nick__y4VIt")
                name.innerHTML = "&nbsp;" + name.innerHTML
            }
        }
    }
}

function onMutationsStandard(mutations, observer) {
    if (isBattleRoyale() && document.querySelector(".game_hud__h3YxY ul") && !inBattleRoyale) {
        console.log("Switching to br mode!")
        inBattleRoyale = true

        const brObserver = new MutationObserver(onMutationsBr)
        brObserver.observe(document.querySelector(".game_hud__h3YxY ul"), OBSERVER_CONFIG)
    } else if (isDuels() && document.querySelector(".game_hud__fhdo5") && !inDuels) {
        console.log("Switching to duels mode!")
        inDuels = true

        const duelsObserver = new MutationObserver(onMutationsDuels)
        duelsObserver.observe(document.querySelector(".game_hud__fhdo5"), OBSERVER_CONFIG)
    } else if (inBattleRoyale && !document.querySelector(".game_hud__h3YxY ul")) {
        console.log("Switching to standard mode!")
        inBattleRoyale = false
    } else if (inDuels && !document.querySelector(".game_hud__fhdo5")) {
        console.log("Switching to standard mode!")
        inDuels = false
    }

    if (inBattleRoyale || inDuels) {
        return
    }

    if (FLAGS_IN_PROFLE_PAGE && isProfile()) {
        // user profile
        if (!document.querySelector(`#${PROFIlE_FLAG_ID}`)) {
            const destination = document.querySelector(".headline_heading__c6HiU.headline_sizeLarge__DqYNn .user-nick_root__DUfvc")
            destination.insertAdjacentHTML("beforeend", bigFlag())
            const flagImage = destination.lastChild

            fillFlag(flagImage, "big", retrieveIdFromLink(location.href))
        }
    }

    if (FLAGS_IN_FRIENDS_TAB) {
        // friends tab
        for (const link of document.querySelectorAll(".chat-friend_name__6GRE_ a")) {
            addFlagToUsername(link)
        }
    }

    if (FLAGS_IN_LEADERBOARD) {
        // generic leaderboard
        for (const link of document.querySelectorAll(".leaderboard_columnContent__yA6b_.leaderboard_alignStart__KChAa a")) {
            addFlagToUsername(link)
        }

        // map highscore leaderboard
        let tabSwitch = document.querySelector(".map-highscore_switchContainer__wCDRH div")
        if (tabSwitch) {
            const openedMapHighscoreTab = +tabSwitch.firstChild.firstChild.classList.contains("switch_hide__OuYfZ")

            if (openedMapHighscoreTab != lastOpenedMapHighscoreTab) {
                lastOpenedMapHighscoreTab = openedMapHighscoreTab
                for (const link of document.querySelectorAll(".map-highscore_userWrapper__aHpCF a")) {
                    const flag = link.querySelector(`.${USER_FLAG_CLASS}`)
                    if (flag) {
                        flag.remove()
                    }
                }
            }
        }

        for (const link of document.querySelectorAll(".map-highscore_userWrapper__aHpCF a")) {
            addFlagToUsername(link)
        }
    }

    if (FLAGS_IN_MATCHMAKING) {
        // battle royale matchmaking
        for (const link of document.querySelectorAll(".player-card_userLink__HhoDo")) {
            addFlagToUsername(link)
        }
    }
}

const observer = new MutationObserver(onMutationsStandard)

observer.observe(document.body, OBSERVER_CONFIG)