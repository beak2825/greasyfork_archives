// ==UserScript==
// @name         Extended Duels Summary in Activies Page
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Adds opponent name and final score to Activies Page for duels
// @author       tyow
// @namespace    https://greasyfork.org/users/1011193
// @match        *://*.geoguessr.com/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @downloadURL https://update.greasyfork.org/scripts/481813/Extended%20Duels%20Summary%20in%20Activies%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/481813/Extended%20Duels%20Summary%20in%20Activies%20Page.meta.js
// ==/UserScript==

const extractUserInfo = (duelData, userId) => {
    let userTeam = null;
    let userTeamHealth = 0;
    let opposingTeamHealth = 0;
    let userWon = false;

    for (const team of duelData.teams) {
        const isUserInTeam = team.players.some(player => player.playerId === userId);
        if (isUserInTeam) {
            userTeam = team.name;
            userTeamHealth = team.health;
            userWon = duelData.result.winningTeamId === team.id;
        } else {
            opposingTeamHealth = team.health;
        }
    }

    return { userTeam, userTeamHealth, opposingTeamHealth, userWon, rounds: duelData.currentRoundNumber };
};

const fetchPlayerName = async (playerId) => {
    const playerApiUrl = `https://www.geoguessr.com/api/v3/users/${playerId}`;
    try {
        const response = await fetch(playerApiUrl, { method: "GET", "credentials": "include" });
        const data = await response.json();
        return data.nick;
    } catch (error) {
        console.error('Failed to fetch player data:', error);
        return null;
    }
};

const extractPlayerIds = (duelData, userId) => {
    let ourTeam = null;
    let theirTeam = null;
    for (const team of duelData.teams) {
        if (team.players.some(player => player.playerId === userId)) {
            ourTeam = team;
        } else {
            theirTeam = team;
        }
    }
    let partnerId = null;
    for (const player of ourTeam.players) {
        if (player.playerId !== userId) {
            partnerId = player.playerId;
        }
    }
    let opposingPlayerIds = theirTeam.players.map(player => player.playerId);

    return { user: userId, partner: partnerId, opponents: opposingPlayerIds };
};


GM_addStyle(`
    .lostColor {
        color: #e94560;
    }
    .wonColor {
        color: #6cb928;
    }
`);


const createNickLink = (id, name) => {
    const link = document.createElement('a');
    link.href = `/user/${id}`;

    const rootDiv = document.createElement('div');
    rootDiv.className = cn("user-nick_root__");

    const nickWrapperDiv = document.createElement('div');
    nickWrapperDiv.className = cn("user-nick_nickWrapper__");

    const nickDiv = document.createElement('div');
    nickDiv.className = cn("user-nick_nick__");
    nickDiv.textContent = name;

    nickWrapperDiv.appendChild(nickDiv);
    rootDiv.appendChild(nickWrapperDiv);
    link.appendChild(rootDiv);

    return link;
}


const appendGameSummary = (div, partnerName, partnerId,
                                opponent1Name, opponent1Id,
                                opponent2Name, opponent2Id,
                           playerScore, opponentScore, rounds) =>
{
    div.innerHTML = div.innerHTML.substring(0, div.innerHTML.length - 1);
    const res = playerScore > opponentScore ? "won" : "lost";
    div.innerHTML = div.innerHTML.replace("played", `<span class='${res}Color'>${res}</span>`)

    const partnerLink = partnerName ? createNickLink(partnerId, partnerName) : null;
    const opponent1Link = createNickLink(opponent1Id, opponent1Name);
    const opponent2Link = opponent2Name ? createNickLink(opponent2Id, opponent2Name) : null;

    if (partnerLink) {
        div.appendChild(document.createTextNode(` with `));
        div.appendChild(partnerLink);
    }

    div.appendChild(document.createTextNode(` against `));
    div.appendChild(opponent1Link);

    if (opponent2Link) {
        div.appendChild(document.createTextNode(` and `));
        div.appendChild(opponent2Link);
    }

    const roundsAndScore = document.createTextNode(` after ${rounds} rounds. The final score was ${playerScore} - ${opponentScore}.`);
    div.appendChild(roundsAndScore);
};


const checkURL = () => location.pathname.endsWith("/me/activities")

const fetchUserId = async () => {
    // Check if the user ID is already stored in the browser's storage
    const storedUserId = GM_getValue('userId');

    if (storedUserId) {
        return storedUserId;
    } else {
        // Make the API call if the user ID is not stored
        const response = await fetch('https://www.geoguessr.com/api/v3/profiles', {
            method: "GET",
            credentials: "include" // or other appropriate options
        });
        const data = await response.json();
        const userId = data.user.id; // Assuming the response JSON has an 'id' field
        // Store the user ID in the browser's storage
        GM_setValue('userId', userId);

        return userId;
    }
};


const run = async () => {
    scanStyles().then(_ => {
        const allDivs = document.querySelectorAll("[class^='activities_description__']");

        const filteredDivs = Array.from(allDivs).filter(div => {
            if (div.classList.length == 2 && div.classList[1] == "extraSummary") return false;
            const a = div.querySelector('a[href^="/duels/"]');
            const team_a = div.querySelector('a[href^="/team-duels/"]');
            return a !== null || team_a !== null;
        });

        for (const div of filteredDivs) {
            let isTeamDuel = false;
            let duelLink = div.querySelector('a[href^="/duels/"]');
            if (duelLink === null) {
                duelLink = div.querySelector('a[href^="/team-duels/"]');
                isTeamDuel = true;
            }
            div.className += " extraSummary";

            if (duelLink) {
                const duelHref = duelLink.getAttribute('href');
                let duelId = isTeamDuel ? duelHref.split('/team-duels/')[1] : duelHref.split('/duels/')[1];
                if (duelId.endsWith('/summary')) {
                    duelId = duelId.slice(0, -'/summary'.length);
                }

                let api_url = `https://game-server.geoguessr.com/api/duels/${duelId}`;
                fetch(api_url, {method: "GET", "credentials": "include"})
                    .then(res => res.json())
                    .then(async json =>
                {
                    const userLink = div.querySelector('a[href^="/user/"]');
                    const userId = userLink ? userLink.getAttribute('href').split('/user/')[1] : await fetchUserId();

                    const { userTeam, userTeamHealth, opposingTeamHealth, userWon, rounds } = extractUserInfo(json, userId);
                    const playerIds = extractPlayerIds(json, userId);
                    const partnerId = playerIds.partner;
                    if (partnerId) {
                        const partnerName = await fetchPlayerName(partnerId);
                        const opponent1Name = await fetchPlayerName(playerIds.opponents[0]);
                        const opponent2Name = await fetchPlayerName(playerIds.opponents[1]);
                        appendGameSummary(div, partnerName, partnerId,
                               opponent1Name, playerIds.opponents[0],
                               opponent2Name, playerIds.opponents[1],
                               userTeamHealth, opposingTeamHealth, rounds);
                    } else {
                        const opponentName = await fetchPlayerName(playerIds.opponents[0]);
                        appendGameSummary(div, null, null,
                                          opponentName, playerIds.opponents[0],
                                          null, null,
                                          userTeamHealth, opposingTeamHealth, rounds);
                    }
                }).catch(err => { throw(err); });
            }
        }
    })
}

new MutationObserver((mutations) => {
    if (!checkURL()) return;
    run();
}).observe(document.body, { subtree: true, childList: true });
