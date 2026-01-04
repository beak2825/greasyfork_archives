// ==UserScript==
// @name         AWBW Head-to-Head
// @namespace    https://awbw.amarriner.com/
// @version      1.0
// @description  Get some details on match-ups against other players
// @author       twiggy_
// @match        https://awbw.amarriner.com/*completedgames*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460722/AWBW%20Head-to-Head.user.js
// @updateURL https://update.greasyfork.org/scripts/460722/AWBW%20Head-to-Head.meta.js
// ==/UserScript==

let matchupHistory = {}

loadMatchupHistory();

function addUsername()
{
    matchupHistory.username = document.getElementById('profile-menu').childNodes[1].title
}

function addObjectToLocalStorage()
{
    localStorage.setItem('matchupHistory', JSON.stringify(matchupHistory));
}

function updateObjectInLocalStorage()
{
    localStorage.removeItem(matchupHistory);
    localStorage.setItem('matchupHistory', JSON.stringify(matchupHistory));
}

function loadMatchupHistory()
{
    if (window.localStorage.getItem('matchupHistory') != null)
    {
        matchupHistory = JSON.parse(window.localStorage.getItem('matchupHistory'));
    }
    else
    {
        initializeMatchupHistory();
    }
}

function initializeMatchupHistory()
{
    addUsername();
    addObjectToLocalStorage();
}