// ==UserScript==
// @name         Prime League OP.GG Scout
// @version      1.1
// @namespace    primeleague
// @license      MIT
// @description  Enhances the Prime League website by adding convenient OP.GG multilinks on team and match pages. Easily access detailed team information with a single click.
// @author       Dayaa
// @icon         https://cdn1-v3.gamesports.net/img/icons/prm_v2/512.png
// @match        *://*.primeleague.gg/*
// @downloadURL https://update.greasyfork.org/scripts/479559/Prime%20League%20OPGG%20Scout.user.js
// @updateURL https://update.greasyfork.org/scripts/479559/Prime%20League%20OPGG%20Scout.meta.js
// ==/UserScript==

const currentUrl = window.location.href;

if (currentUrl.includes('primeleague.gg/leagues/teams/')) {
    teamPageLogic();
} else if (currentUrl.includes('primeleague.gg/leagues/matches/')) {
    matchPageLogic();
}

function teamPageLogic() {
    const playersDiv = document.querySelector(".content-portrait-grid-l");
    const playersDivParent = playersDiv.parentNode;

    playersDivParent.insertBefore(createTeamPageUrlLink(), playersDiv);

    function createTeamPageUrlLink() {
        const opggLink = document.createElement('a');

        const summonerNames = getTeamPageSummonerNames();
        const url = createOpggUrl(summonerNames);

        opggLink.setAttribute('href', url);
        opggLink.innerHTML = 'OP.GG';

        return opggLink;
    }

    function getTeamPageSummonerNames() {
        const summonerNames = [];
        const infoDivs = document.getElementsByClassName('txt-info');

        for (const infoDiv of infoDivs) {
            const childDiv = infoDiv.firstElementChild;

            if (childDiv && childDiv.getAttribute('title')?.includes('LoL Summoner Name')) {
                summonerNames.push(childDiv.innerText);
            }
        }

        return summonerNames;
    }
}

function matchPageLogic() {
    waitForElm('.content-match-lineup .txt-info').then(createMatchPageLineupLinks);

    function createMatchPageLineupLinks() {
        const lineupDivs = document.getElementsByClassName('content-match-lineup');
        const teamTitleDivs = document.getElementsByClassName('content-match-head-team-titles');

        teamTitleDivs[0].appendChild(createMatchPageUrlLink(lineupDivs[0]));
        teamTitleDivs[1].appendChild(createMatchPageUrlLink(lineupDivs[1]));
    }

    function createMatchPageUrlLink(lineupDiv) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'txt-subtitle';

        const opggLink = document.createElement('a');
        const summonerNames = getMatchPageSummonerNames(lineupDiv);

        if (summonerNames.length === 0) {
            return linkContainer;
        }

        const url = createOpggUrl(summonerNames);

        opggLink.setAttribute('href', url);
        opggLink.innerHTML = 'OP.GG';

        linkContainer.appendChild(opggLink);

        return linkContainer;
    }

    function getMatchPageSummonerNames(lineupDiv) {
        const summonerNames = [];
        const txtDivs = lineupDiv.getElementsByClassName('txt-info');

        for (const txtDiv of txtDivs) {
            if (txtDiv.className === 'txt-info') {
                summonerNames.push(txtDiv.innerText);
            }
        }

        return summonerNames;
    }
}

function createOpggUrl(summonerNames) {
    const opggBaseUrl = 'https://www.op.gg/multisearch/euw?summoners=';
    const encodedSummonerNames = summonerNames.map(encodeURIComponent);
    return opggBaseUrl.concat(encodedSummonerNames.join(','));
}

function waitForElm(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            const observedElement = document.querySelector(selector);
            if (observedElement) {
                observer.disconnect();
                resolve(observedElement);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
