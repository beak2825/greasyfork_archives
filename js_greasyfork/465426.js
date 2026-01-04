// ==UserScript==
// @name         Geoguessr rating displayer
// @description  Adds the competitive rating to usernames
// @version      1.2.9
// @license      MIT
// @author       joniber
// @namespace
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668

// @namespace https://greasyfork.org/users/1072330
// @downloadURL https://update.greasyfork.org/scripts/465427/Geoguessr%20rating%20displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/465427/Geoguessr%20rating%20displayer.meta.js
// ==/UserScript==

//=====================================================================================\\
//    change these values however you like (make sure to hit ctrl+s afterwards)        \\
//=====================================================================================\\



const RATING_IN_FRIENDS_TAB = true;
//                            ^^^^^ set this to 'false' if you don't want to display rating in the friends tab
const RATING_IN_LEADERBOARD = true;
//                            ^^^^  set this to 'false' if you don't want to display rating in leaderboards
const RATING_IN_MATCHMAKING = true;
//                            ^^^^  set this to 'false' if you don't want to display rating in matchmaking lobbies
const RATING_IN_INGAME_PAGE = true;
//                            ^^^^  set this to 'false' if you don't want to display rating ingame

const RATING_COLOR_CHANGE = true;
//                          ^^^^ set this to 'false' if you don't want to change the color based on the ranking

const RATING_IN_BREAKDOWN = true;
//                          ^^^^ set this to 'false' if you don't want to see rating in the breakdown menu

const RATING_IN_SUGGESTIONS = true;
//                           ^^^^ set this to 'false' if you don't want to see rating in the friend suggestion list

const RATING_IN_PROFILES = true;
//                           ^^^^ set this to >>false<< if you don't want to see rating in the profile list
const GAME_MODE_RATING = true;
//                       ^^^^^ set to false if you don't want to see the game mode ratings

const OVERALL_RATING = true;
//                     ^^^^^ set to false if you don't want to see overall rating

//=====================================================================================\\
//  don't edit anything after this point unless you know what you're doing             \\
//=====================================================================================\\

const GEOGUESSR_USER_ENDPOINT = 'https://geoguessr.com/api/v3/users';
const CHAT_ENDPOINT = 'https://game-server.geoguessr.com/api/lobby';

const SCRIPT_PREFIX = 'ur__';
const PROFIlE_RATING_ID = SCRIPT_PREFIX + 'profileRating';
const USER_RATING_CLASS = SCRIPT_PREFIX + 'userRating';




const stylesUsed = [

    "user-nick_nickWrapper__",
    "distance-player-list_name__",
    "countries-player-list_playerName__",
    "hud_root__",
    "health-bar_player__",
    "user-nick_nick__",
    "round-score_container__",
    "game_hud__",
    "chat-friend_name__",
    "leaderboard_row__",
    "leaderboard_rowColumnCount3__",
    "leaderboard_columnContent__",
    "leaderboard_alignStart",
    "map-highscore_switchContainer__",
    "switch_show__",
    "map-highscore_userWrapper__",
    "results_userLink__",
    "friend_name__",
    "avatar-lobby_wrapper__",
    "avatar-title_titleWrapper__"
];



const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false,
};

const ERROR_MESSAGE = (wrong) => '${wrong}';

function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`));
}

function ratingText() {
    return `<p
        class="${USER_RATING_CLASS}"
        style="margin-left: .25rem; margin-right:.25rem; margin-top:0px; display: none;"
        onerror="this.style.display = 'none'"
    ></p>`;
}

function ratingText1() {
    return `<p
        id="${PROFIlE_RATING_ID}"
        style="margin-left: .25rem; margin-right:.25rem; margin-top:0px; display: none;"
        onerror="this.style.display = 'none'"
    ></p>`;
}

let flag = true
let flag1 = false

async function fillRating(ratingNumber, userId) {
    const userData = await getUserData(userId);
    let divisionNumber = userData.divisionNumber;
    if (divisionNumber && userData.rating) {
        if (RATING_COLOR_CHANGE) {
            let color;
            switch (divisionNumber) {
                case 10: /* Bronze     */ color = '#ba682e'; break;
                case 9: /* Silver III */
                case 8: /* Silver II  */
                case 7: /* Silver I   */ color = '#8e8e8e'; break;
                case 6: /* Gold III   */
                case 5: /* Gold II    */
                case 4: /* Gold I     */ color = '#e8ac06'; break;
                case 3: /* Master II  */
                case 2: /* Master I   */ color = '#e04781'; break;
                case 1: /* Champion   */ color = '#a994e3'; break;
                default: color = 'hsla(0,0%,100%,.9)';
            }
            ratingNumber.style.color = color;

            if(OVERALL_RATING){
                ratingNumber.innerHTML = userData.rating;
            }
        }
        if(GAME_MODE_RATING){
            if (userData.gameModeRatings && Object.keys(userData.gameModeRatings).length > 0) {
                ratingNumber.innerHTML += " (" +
                    (userData.gameModeRatings.standardDuels || "&ndash;") + "/" +
                    (userData.gameModeRatings.noMoveDuels || "&ndash;") + "/" +
                    (userData.gameModeRatings.nmpzDuels || "&ndash;") + ")";
            }
        }
    } else {
        // v4 API did not return data, user is either not active in ranked at the moment or in silver who in v4 have no rating
        // fall back on v3 and use gray color to indicate inactive rating or silver to display the rating of silver player
        if(userData.rating == null && userData.divisionNumber){
            //make sure user has v4 data with a rating of null
            const playerApiUrl = `https://www.geoguessr.com/api/v3/users/${userId}`;
            try {
                const response = await fetch(playerApiUrl, { method: "GET", "credentials": "include" });
                const data = await response.json();
                ratingNumber.innerHTML = data.competitive.rating;
                if(RATING_COLOR_CHANGE) {
                    ratingNumber.style.color = '#8e8e8e';
                }
            }
            catch(error){
                console.error('Failed to fetch player data:', error);
                return null;
            }
        }
        else if (! (userData.competitive.elo == 0 && userData.competitive.rating == 0)) {
            // user has played ranked in the past
            ratingNumber.innerHTML = userData.competitive.rating;
            if (RATING_COLOR_CHANGE) {
                ratingNumber.style.color = 'hsla(0,0%,100%,.9)';
            }
        }

    }

    ratingNumber.style.display = 'inline';
}

function retrieveIdFromLink(link) {
    if (link.endsWith('/me/profile')) {
        const data = document.querySelector('#__NEXT_DATA__').text;
        const json = JSON.parse(data);
        return json.props.accountProps.account.user.userId;
    }
    return link.split('/').at(-1);
}

function isOtherProfile() {
    return pathMatches('user/.+');
}

function isOwnProfile() {
    return pathMatches('me/profile');
}

function isProfile() {
    return isOwnProfile() || isOtherProfile();
}

function isBattleRoyale() {
    return pathMatches('battle-royale/.+');
}

function isDuels() {
    return pathMatches('duels/.+');
}
function isReplay() {
    return pathMatches('duels/.+/replay');
}


async function getUserData(id) {
    const playerApiUrl = `https://www.geoguessr.com/api/v4/ranked-system/progress/${id}`;

    try {
        const response = await fetch(playerApiUrl, { method: "GET", "credentials": "include" });
        const data = await response.json();
        return data;
    } catch (error) {
        const playerApiUrl = `https://www.geoguessr.com/api/v3/users/${id}`;
        try {
            const response = await fetch(playerApiUrl, { method: "GET", "credentials": "include" });
            const data = await response.json();
            return data;
        }
        catch(error){
            console.error('Failed to fetch player data:', error);
            return null;
        }
    }
}

function addRatingToUsername(link) {
    if (!link.querySelector(`.${USER_RATING_CLASS}`)) {
        const destination = link.querySelector('[class*=user-nick_nickWrapper__]');
        destination.insertAdjacentHTML('beforeend', ratingText());
        const ratingNumber = destination.lastChild;
        if(destination.children[2]){
            destination.insertBefore(
                ratingNumber,
                destination.children[2]
            );

        }

        fillRating(ratingNumber, retrieveIdFromLink(link.href));
    }
}

function addRatingToIngameUsername(link) {
    if (!link.querySelector(`.${USER_RATING_CLASS}`)) {
        const destination = link.querySelector('span');
        destination.style.display = 'flex';
        destination.innerHTML += '&nbsp;';
        destination.insertAdjacentHTML('beforeend', ratingText());
        const ratingNumber = destination.lastChild;
        if (destination.childElementCount == 4) {
            destination.insertBefore(
                ratingNumber,
                ratingNumber.previousElementSibling.previousElementSibling
            );
        } else if (destination.childElementCount > 2) {
            destination.insertBefore(ratingNumber, ratingNumber.previousElementSibling);
        }

        fillRating(ratingNumber, retrieveIdFromLink(link.href));
    }
}

let inBattleRoyale = false;
let inDuels = false;
let inReplay = false;
let lastOpenedMapHighscoreTab = 0;
async function getUsersInGame(id) {
    const fetchurl = `${CHAT_ENDPOINT}/${id}`;

    try {
        const response = await fetch(fetchurl, { method: "GET", "credentials": "include" });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch player data:', error);
        return null;
    }

}


async function onMutationsBr(mutations, observer) {
    if (RATING_IN_INGAME_PAGE) {
        //battle royale distance
        for (const link of document.querySelectorAll('[class*=distance-player-list_name__] a')) {
            addRatingToIngameUsername(link);
        }

        // battle royale countries
        for (const link of document.querySelectorAll(
            '[class*=countries-player-list_playerName__] a'
        )) {
            addRatingToIngameUsername(link);
        }


    }
}

function onMutationsDuels(mutations, observer) {
    console.log("TEST")
    if (RATING_IN_INGAME_PAGE) {
        // duels
        const hud = document.querySelector('[class*=hud_root__]');

        const firstPlayerLink = hud.firstChild?.querySelector('[class*=health-bar_player__] a');
        if (firstPlayerLink) {
            addRatingToUsername(firstPlayerLink);
        }

        const secondPlayerLink = hud.lastChild?.querySelector('[class*=health-bar_player__] a');
        if (secondPlayerLink) {
            if (addRatingToUsername(secondPlayerLink, 'afterbegin')) {
                const name = secondPlayerLink.querySelector('[class*=user-nick_nick__]');
                name.innerHTML = '&nbsp;' + name.innerHTML;
            }
        }





    }
}

function onMutationsReplay(mutations, observer) {
    if (RATING_IN_INGAME_PAGE) {
        // duels
        const hud = document.querySelector('[class*=hud_healthBars__]');

        const firstPlayerLink = hud.firstChild?.querySelector('[class*=health-bar_player__] a');
        if (firstPlayerLink) {
            addRatingToUsername(firstPlayerLink);
        }

        const secondPlayerLink = hud.lastChild?.querySelector('[class*=health-bar_player__] a');
        if (secondPlayerLink) {
            if (addRatingToUsername(secondPlayerLink, 'afterbegin')) {
                const name = secondPlayerLink.querySelector('[class*=user-nick_nick__]');
                name.innerHTML = '&nbsp;' + name.innerHTML;
            }
        }





    }
}


async function onMutationsStandard(mutations, observer) {
    if (isBattleRoyale() && document.querySelector('[class*=game_hud__] ul') && !inBattleRoyale) {
        inBattleRoyale = true;
        const brObserver = new MutationObserver(onMutationsBr);
        brObserver.observe(document.querySelector('[class*=game_hud__] ul'), OBSERVER_CONFIG);
    } else if (isDuels() && document.querySelector('[class*=duels_hud__]') && !inDuels) {
        inDuels = true;
        const duelsObserver = new MutationObserver(onMutationsDuels);
        duelsObserver.observe(document.querySelector('[class*=duels_hud__]'), OBSERVER_CONFIG);
    } else if (inBattleRoyale && !document.querySelector('[class*=game_hud__] ul')) {
        inBattleRoyale = false;
    } else if (inDuels && !document.querySelector('[class*=duels_hud__]')) {
        inDuels = false;
    }
    else if (isReplay() && document.querySelector('[class*=replay_main__]') && !inReplay) {
        inReplay = true;
        const replayOberserver = new MutationObserver(onMutationsReplay);
        replayOberserver.observe(document.querySelector('[class*=replay_main__]'), OBSERVER_CONFIG);

    }
    else if (inReplay && !document.querySelector('[class*=replay_main__]')) {
        inReplay = false;
    }


    if (inBattleRoyale || inDuels) {
        return;
    }

    if (RATING_IN_FRIENDS_TAB) {
        // friends tab
        for (const link of document.querySelectorAll('[class*=chat-friend_name__] a')) {
            addRatingToUsername(link);
        }
    }

    if (isProfile() && RATING_IN_PROFILES) {
        // user profile
        if (!document.querySelector(`#${PROFIlE_RATING_ID}`)) {

            const destination = document.querySelector("[class*=headline_heading__] [class*=user-nick_nick__]")
            destination.insertAdjacentHTML("beforeend", ratingText1())

            const yk = destination.lastChild

            fillRating(yk, retrieveIdFromLink(location.href))


        }

    }

    if (RATING_IN_LEADERBOARD) {
        // map highscore leaderboard
        let tabSwitch = document.querySelector('[class*=map-highscore_switchContainer__] div');
        if (tabSwitch) {
            const openedMapHighscoreTab =
                  +tabSwitch.firstChild.firstChild.classList.contains('[class*=switch_hide__]');
            if (openedMapHighscoreTab != lastOpenedMapHighscoreTab) {
                lastOpenedMapHighscoreTab = openedMapHighscoreTab;
                for (const link of document.querySelectorAll(
                    '[class*=map-highscore_userWrapper__] a'
                )) {
                    const rating = link.querySelector(`.${USER_RATING_CLASS}`);
                    if (rating) {
                        rating.remove();
                    }
                }
            }
            let tabSwitch1 = document.querySelector('[class*=map-highscore_switchContainer__]');
            const openFriendHighscoreTab = tabSwitch1.lastChild.lastChild
            if(openFriendHighscoreTab){
                if(openFriendHighscoreTab.firstChild.classList.contains('[class*=switch_show__]') && flag){
                    flag = false
                    flag1 = true
                    for (const link of document.querySelectorAll(
                        '[class*=map-highscore_userWrapper__] a'
                    )) {
                        const rating = link.querySelector(`.${USER_RATING_CLASS}`);
                        if (rating) {
                            rating.remove();
                        }
                    }
                }
            }

            const openFriendHighscoreTab1 = tabSwitch1.lastChild.firstChild
            if(openFriendHighscoreTab1){
                if(openFriendHighscoreTab1.firstChild.classList.contains('[class*=switch_show__]') && flag1){
                    flag = true
                    flag1 = false
                    for (const link of document.querySelectorAll(
                        '[class*=map-highscore_userWrapper__] a'
                    )) {
                        const rating = link.querySelector(`.${USER_RATING_CLASS}`);
                        if (rating) {
                            rating.remove();
                        }
                    }
                }
            }

        }

        for (const link of document.querySelectorAll('[class*=map-highscore_userWrapper__] a')) {
            addRatingToUsername(link);
        }
    }

    if (RATING_IN_BREAKDOWN) {
        for (const link of document.querySelectorAll('[class*=results_userLink__] a')) {
            addRatingToUsername(link);
        }
    }

    if (RATING_IN_SUGGESTIONS) {
        for (const link of document.querySelectorAll('[class*=friend_name__] a')) {
            addRatingToUsername(link);
        }
    }

    if (RATING_IN_MATCHMAKING) {
        if(document.querySelector('[class*=avatar-lobby_wrapper__]')){
            let lobbyWrapper = document.querySelector('[class*=avatar-lobby_wrapper__]')

            for (let link of document
                 .querySelector('[class*=avatar-lobby_wrapper__]')
                 .querySelectorAll('[class*=avatar-title_titleWrapper__]')) {
                if (!link.querySelector(`.${USER_RATING_CLASS}`)) {
                    if (link.querySelector('[class*=user-nick_nick__]')) {
                        const lobby = await getUsersInGame(location.href.slice(-36));
                        for (const player of lobby.players) {
                            if (!link.querySelector(`.${USER_RATING_CLASS}`)) {

                                const nickElement = link.querySelector('class*=[user-nick_nick__]');
                                const isPlayerNick = nickElement.textContent.trim() == player.nick;

                                if (isPlayerNick) {
                                    let destination = nickElement
                                    destination.insertAdjacentHTML('beforeend', ratingText());
                                    const ratingNumber = destination.lastChild;
                                    ratingNumber.style.marginLeft = "0px";
                                    if(destination.children[2]){
                                        destination.insertBefore(
                                            ratingNumber,
                                            destination.children[2]
                                        );

                                    }

                                    fillRating(ratingNumber, player.playerId);
                                }

                            }
                        }
                    }
                }
            }


        }
    }
}


const observer = new MutationObserver(onMutationsStandard);

observer.observe(document.body, OBSERVER_CONFIG);