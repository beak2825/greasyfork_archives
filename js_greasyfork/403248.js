// ==UserScript==
// @name         MatchResult_GoalScorers
// @namespace    https://greasyfork.org/users/562206
// @version      0.0.6
// @description  View match result in advance (under 50 minutes before the match start)
// @author       Jhonatan Bianchi
// @include	     http://trophymanager.com/matches/*
// @include	     https://trophymanager.com/matches/*
// @downloadURL https://update.greasyfork.org/scripts/403248/MatchResult_GoalScorers.user.js
// @updateURL https://update.greasyfork.org/scripts/403248/MatchResult_GoalScorers.meta.js
// ==/UserScript==


function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}
  
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

Object.filter = (obj, predicate) =>
    Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => (res[key] = obj[key], res), {});

function getEventImage(match, event) {
    let src = '';

    if (getEventIs(event, 'goal')) {
        src = 'https://trophymanager.com/pics/icons/ball.gif';
    }

    if (getEventIs(event, 'yellow')) {
        src = 'https://trophymanager.com/pics/icons/yellow_card.gif';
    }

    if (getEventIs(event, 'red')) {
        src = 'https://trophymanager.com/pics/icons/red_card.gif';
    }

    if (getEventIs(event, 'injury')) {
        src = 'https://trophymanager.com/pics/icons/injury.gif';
    }

    const playerId = getPlayerIdFromEvent(event);

    if (isPlayerFromHomeTeam(match, playerId)) {
        return '<img src="' + src + '" style="margin-left: 15px"/>';
    } else {
        return '<img src="' + src + '" style="margin-right: 15px"/>'
    }
}

function getEventIs(event, eventNameToCheck) {
    return event[0].parameters.filter(e => e[eventNameToCheck]).length;
}

function getGoalDetailsFromGoalEvent(goalEvent) {
    return goalEvent[0].parameters.filter(e => e.goal)[0].goal;
}

function getMatchCurrentScoreAfterGoalEvent(goalEvent) {
    const goal = getGoalDetailsFromGoalEvent(goalEvent);

    if (goal) {
        return {
            homeGoals: goal.score[0],
            awayGoals: goal.score[1],
        }
    }
}

function isPlayerFromHomeTeam(match, playerId) {
    return Object.keys(match.lineup.home).includes(playerId);
}

function getPlayerName(match, playerId) {
    return isPlayerFromHomeTeam(match, playerId) ? match.lineup.home[playerId].name : match.lineup.away[playerId].name;
}

function eventIsGoalCardInjury(event) {
    return event.parameters && event.parameters.filter(event => event.goal || event.yellow || event.red || event.injury).length;
}

function getWantedEvents(match) {
    return Object.filter(match.report, (event) => {
        return event.filter(e => {
            return eventIsGoalCardInjury(e);
        }).length;
    })
}

function getGoalsEvents(match) {
    return Object.filter(match.report, (event) => {
        return event.filter(e => {
            return e.parameters && e.parameters.filter(e => e.goal).length;
        }).length;
    })
}

function getMatchResult(match) {
    const goalsEvents = getGoalsEvents(match);

    if (Object.keys(goalsEvents).length === 0) {
        return {
            homeGoals: 0,
            awayGoals: 0
        };
    }

    const { [Object.keys(goalsEvents).pop()]: lastGoal } = goalsEvents;

    return getMatchCurrentScoreAfterGoalEvent(lastGoal);
}

function getHomeTeamName(match) {
    return match.club.home.club_name;
}

function getAwayTeamName(match) {
    return match.club.away.club_name;
}

function getPlayerIdFromEvent(event) {
    if (getEventIs(event, 'goal')) {
        return event[0].parameters.filter(e => e.goal)[0].goal.player;
    }

    if (getEventIs(event, 'yellow')) {
        return event[0].parameters.filter(e => e.yellow)[0].yellow;
    }

    if (getEventIs(event, 'red')) {
        return event[0].parameters.filter(e => e.red)[0].red;
    }

    if (getEventIs(event, 'injury')) {
        return event[0].parameters.filter(e => e.injury)[0].injury;
    }
}

function getFinalResultHtml(match) {
    const matchResult = getMatchResult(match);

    return '<div style="width:100%;margin-top:10px;padding:10px;padding-bottom:5px;background-color:#000000;font-size:16px;font-weight:bold;">' +
        '<div style="display:inline-block;width:46%;margin:0px;padding:0px;text-align:right;">' + getHomeTeamName(match) + '</div>' +
        '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center;color:#fff">' + matchResult.homeGoals + ' - ' + matchResult.awayGoals + '</div>'+
        '<div style="display:inline-block;width:46%;margin:0px;padding:0px;text-align:left;">' + getAwayTeamName(match) + '</div>' +
    '</div>';
}

function getGoalHtml(match, goalEvent, minute) {
    const goal = getGoalDetailsFromGoalEvent(goalEvent);
    const currentMatchResult = getMatchCurrentScoreAfterGoalEvent(goalEvent);

    if (isPlayerFromHomeTeam(match, goal.player)) {
        return '<div style="width:100%;padding:0px;padding-bottom:2px;background-color:#000000;font-size:13px;">' +
                    '<div style="display:inline-block;width:47%;margin:0px;padding:0px;text-align:right">[' + minute + '] ' + getPlayerName(match, goal.player) +  getEventImage(match, goalEvent) +'</div>' +
                    '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center">' + currentMatchResult.homeGoals + ' - ' + currentMatchResult.awayGoals + '</div>' +
                '</div>';
    } else {
        return '<div style="width:100%;padding:0px;padding-bottom:2px;background-color:#000000;font-size:13px;">' + 
                    '<div style="display:inline-block;width:47%;margin:0px;padding:0px;text-align:right">&nbsp;</div>' +
                    '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center"">' + currentMatchResult.homeGoals + ' - ' + currentMatchResult.awayGoals + '</div>' +
                    '<div style="display:inline-block;width:45%;margin:0px;padding:0px;text-align:left">' + getEventImage(match, goalEvent) + getPlayerName(match, goal.player) + ' [' + minute + ']</div>' +
                '</div>';
    }
}

function getNonGoalHtml(match, event, minute) {
    const playerId = getPlayerIdFromEvent(event);

    if (isPlayerFromHomeTeam(match, playerId)) {
        return '<div style="width:100%;padding:0px;padding-bottom:2px;background-color:#000000;font-size:13px;">' +
                    '<div style="display:inline-block;width:47%;margin:0px;padding:0px;text-align:right">[' + minute + '] ' + getPlayerName(match, playerId) +  getEventImage(match, event) + '</div>' +
                    '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center"></div>' +
                '</div>';
    } else {
        return '<div style="width:100%;padding:0px;padding-bottom:2px;background-color:#000000;font-size:13px;">' + 
                    '<div style="display:inline-block;width:47%;margin:0px;padding:0px;text-align:right">&nbsp;</div>' +
                    '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center""></div>' +
                    '<div style="display:inline-block;width:45%;margin:0px;padding:0px;text-align:left">' + getEventImage(match, event) + getPlayerName(match, playerId) + ' [' + minute + ']</div>' +
                '</div>';
    }
}

function getEventHtml(match, event, minute) {
    if (getEventIs(event, 'goal')) {
        return getGoalHtml(match, event, minute);
    }

    return getNonGoalHtml(match, event, minute);
}

function showMatchEvents(match) {
    const mainCentersDivs = document.getElementsByClassName('main_center');
    if (mainCentersDivs) {
        const matchEventsDiv = document.createElement('div');
        matchEventsDiv.className = 'main_center';
        matchEventsDiv.innerHTML = getFinalResultHtml(match);

        const matchEvents = getWantedEvents(match);
        for (const [minute, event] of Object.entries(matchEvents)) {
            matchEventsDiv.innerHTML = matchEventsDiv.innerHTML + getEventHtml(match, event, minute);
        }

        insertBefore(matchEventsDiv, mainCentersDivs[mainCentersDivs.length - 1])
    }

}

var matchID = location.href.match(/([^\/]*)\/*$/)[1];
var url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchID;
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.send();
xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        var match = JSON.parse(this.responseText);
        showMatchEvents(match);
    }
}