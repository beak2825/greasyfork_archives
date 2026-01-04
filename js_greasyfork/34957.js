// ==UserScript==
// @name         JIRA Hours Diff
// @namespace    https://github.com/lovromazgon
// @version      0.2.3
// @description  Adds the information about required vs worked hours in Tempo.io
// @author       Lovro Mažgon
// @match        https://app.tempo.io/timesheets/jira/reports/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34957/JIRA%20Hours%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/34957/JIRA%20Hours%20Diff.meta.js
// ==/UserScript==

var loadedHoursWorked = false;
var loadedHoursRequired = false;
var hoursWorked = 0;
var hoursRequired = 0;
var hoursDiff = 0;

var hoursRequiredDiv = null;
var hoursDiffDiv = null;

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.responseURL == 'https://app.tempo.io/rest/tempo-timesheets/4/worklogs/search') {
                mainWorklogs(JSON.parse(this.response));
            } else if (this.readyState == 4 && this.responseURL == 'https://app.tempo.io/rest/tempo-timesheets/4/private/days/search') {
                mainDays(JSON.parse(this.response)[0].days);
            }

        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function mainWorklogs(worklogs) {
    var secondsWorked = 0;
    for (i = 0; i < worklogs.length; i++) {
        secondsWorked += worklogs[i].timeSpentSeconds;
    }

    hoursWorked = secondsToHours(secondsWorked);
    loadedHoursWorked = true;
    main();
}

function mainDays(days) {
    var secondsRequired = 0;
    for (i = 0; i < days.length; i++) {
        secondsRequired += days[i].requiredSeconds;
    }
    hoursRequired = secondsToHours(secondsRequired);
    loadedHoursRequired = true;
    main();
}

function main() {
    if (!loadedHoursRequired || !loadedHoursWorked) {
        return;
    }

    hoursDiff = Math.round((hoursWorked - hoursRequired) * 10) / 10;

    console.log('I worked ' + hoursWorked + ' hours');
    console.log('I should have worked ' + hoursRequired + ' hours');
    console.log('Difference is ' + hoursDiff + ' hours');

    var headerActions = getHeaderActions();

    displayHoursRequired(headerActions);
    displayHoursDiff(headerActions);
}

function getHeaderActions() {
    var el = document.getElementsByClassName('tempo-header-wrapper')[0];
    var childIndex = 1; // in the first round use 1 to get the second element

    while (true) {
        var child = null;
        if (el.children.length === 0) {
            // no children
            break;
        } else if (el.children.length == 1) {
            // if it is the only child use it
            child = el.children[0];
        } else {
            // in the first round use 1 to get the second element
            // all other rounds use 0 to get the first element
            child = el.children[childIndex];
            childIndex = 0;
        }

        if (child.tagName == 'DIV') {
            el = child;
        } else {
            break;
        }
    }

    return el;
}

function displayHoursRequired(headerActions) {
    if (!hoursRequiredDiv) {
        hoursRequiredDiv = headerActions.lastChild.cloneNode(true);
        headerActions.appendChild(hoursRequiredDiv);
    }
    hoursRequiredDiv.innerHTML = ' / ' + hoursRequired + 'h';
    hoursRequiredDiv.style.color = 'grey';
    hoursRequiredDiv.style.margin = '0 5px';
}

function displayHoursDiff(headerActions) {
    if (!hoursDiffDiv) {
        hoursDiffDiv = headerActions.lastChild.cloneNode(true);
        headerActions.appendChild(hoursDiffDiv);
    }

    var sign;
    var color;
    if (hoursDiff >= 0) {
        sign = '+';
        color = 'green';
    } else {
        sign = '';
        color = 'red';
    }

    hoursDiffDiv.innerHTML = ' (' + sign + hoursDiff + ')';
    hoursDiffDiv.style.color = color;
}

function secondsToHours(seconds) {
    return Math.round(seconds / 60 / 60 * 10) / 10;
}
