// ==UserScript==
// @name         Jira quick actions
// @namespace    sremy
// @version      1.12
// @description  Custom quick actions (commit log, work log), check of issues (status, assignee) and show week work log in JIRA 6.x
// @author       Sébastien REMY
// @match        https://*jira*/browse/*
// @match        http://localhost:8080/browse/*
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/notify-js-legacy@0.4.1/notify.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396540/Jira%20quick%20actions.user.js
// @updateURL https://update.greasyfork.org/scripts/396540/Jira%20quick%20actions.meta.js
// ==/UserScript==

// ** Constants to customize **
// Name of custom field for "Epic link"
const CUSTOM_FIELD_EPIC_LINK = 'customfield_10006';
//const CUSTOM_FIELD_EPIC_LINK = jQuery('div[data-fieldtype="gh-epic-link"]').attr('id')

// Customize these status for the function checkIssueStatus(,) !
const INITIAL_STATUS_LIST = ['TO DO', 'OPEN'];
const NEXT_STATUS_SELECTOR_LIST = ['#action_id_21', '#action_id_41'];


var $ = jQuery; // or https://cdn.jsdelivr.net/npm/jquery@3.4/dist/jquery.min.js

let worklogToClipboard;

let clipboard = new ClipboardJS('#clipboardBtn', {
    text: function(trigger) {
        return $('#key-val').text() + ' ' + $('#summary-val').text();
    }
});

clipboard.on('success', function(e) {
    $.notify("Copied to clipboard. " + e.text, "info");
});

clipboard.on('error', function(e) {
    $.notify("Failed to copy", "error");
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rafAsync() {
    return new Promise(resolve => {
        // Callback function called before the browser performs the next repaint
        requestAnimationFrame(resolve); // faster than set time out
    });
}

// Waits until the element pointed by selector exists on the page
function whenElementExists(selector) {
    if (document.querySelector(selector) === null) {
        return rafAsync().then(() => whenElementExists(selector));
    } else {
        return Promise.resolve(true);
    }
}

/*
async function addWorkLog(duration) {
    jQuery('#log-work').click();
    whenElementExists('#log-work-time-logged') // work log input text
        .then(() => {
        jQuery('#log-work-time-logged')[0].value = duration;
        jQuery('#log-work-submit').click();
    });

    // BUG: query has no time to be sent, overrided by following //
    assignToMe();

    checkIssueStatus();
}*/


function addWorkLogDateRest(worklogDate, duration, callback = {}) {
    // POST /rest/api/2/issue/{issueIdOrKey}/worklog

    worklogDate = worklogDate.replace(/Z/, '+0000');

    //console.log(worklogDate);
    let bodyContent = {
        "timeSpent": duration,
        "started": worklogDate  // "2020-02-29T00:46:47.624+0000"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(bodyContent),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const issueId = JIRA.Issue.getIssueId();
    fetch(`/rest/api/2/issue/${issueId}/worklog`, options)
        .then(callback)
        .then(refreshPage);
        //.then(res => res.json())
        //.then(res => console.log(res));

    if(getAssignee() === undefined) {
        assignToMe();
    }

    checkIssueStatus(INITIAL_STATUS_LIST, selectFirstExistingStatus(NEXT_STATUS_SELECTOR_LIST));
}

// Add worklog starting now
function addWorkLogNowRest(duration) {
    addWorkLogDateRest((new Date().toISOString()).replace(/Z/, '+0000'), duration);
}


// Return the selector status present in the page among the list
function selectFirstExistingStatus(statusSelectorList) {
    for(let status of statusSelectorList) {
        if($(status).length > 0) {
            return status;
        }
    }
    return null;
}

// Return true if the string 'searchedString' is contained (ignoring case) in the array 'stringslist'
function isInList(searchedString, stringslist) {
    if (!searchedString) return false;
    for (let item of stringslist) {
        if (item && item.toUpperCase() === searchedString.toUpperCase()) {
            return true;
        }
    }
    return false;
}

// If issue status is still the initial one, I move to the next one
function checkIssueStatus(initialStatusList, nextStatusSelector) {
    if(nextStatusSelector === null)
        return;
    let selectIssueStatus = jQuery('#status-val');
    if(selectIssueStatus.length) {
        let status = selectIssueStatus[0].innerText;
        if(isInList(status, initialStatusList)) {
            let selectNextStatus = $(nextStatusSelector);
            if(selectNextStatus.length === 1) {
                $.notify("Status was still " + status + " => changing to " + selectNextStatus[0].innerText, "warn");
                selectNextStatus.click();
            }
        }
    }
}

// If issue is not assigned to me, I assign to me
function assignToMe() {
    const SELECTOR_ASSIGN_TO_ME = '#assign-to-me';
    let selectAssignToMe = jQuery(SELECTOR_ASSIGN_TO_ME);
    if(selectAssignToMe.length) {
        $.notify("Issue assigned to you", "info");
        selectAssignToMe[0].click();
    }
}

// Get the User assigned to the current issue or return undefined if not assigned
function getAssignee() {
    let spanAssignee = jQuery("#assignee-val");
    if(spanAssignee.length) {
        return spanAssignee.children('span[rel]').attr('rel');
    }
    return undefined;
}

function reqListener () {
  console.log(this.responseText);
}

function jsonReqListener () {
  console.log(this.response);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// linkType = 'clones', 'blocks', etc
// issueKeyLinked = JIRA-007
function createLinkRest(linkType, issueKeyLinked) {

    let issueId = $('#key-val').attr('rel'); // example: 10003
    let atlToken = getCookie('atlassian.xsrf.token');
    let params = `inline=true&decorator=dialog&id=${issueId}&jiraAppId=&linkDesc=${linkType}&issueKeys=${issueKeyLinked}&comment=&atl_token=${atlToken}`;
    //console.log(params);

    let req = new XMLHttpRequest();
    //req.addEventListener("load", reqListener);
    req.open("POST", "/secure/LinkJiraIssue.jspa");
    req.addEventListener("load", refreshPage);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send(params);
    refreshPage();
}


// issueKeyLinked = JIRA-007
// Set the constant customField to reflect the Epic custom field (or what you want)
function setEpicRest(epicIssueKey) {
    setCustomFieldRest(CUSTOM_FIELD_EPIC_LINK, epicIssueKey);
}

function setCustomFieldRest(customField, epicIssueKey) {
    let issueId = $('#key-val').attr('rel'); // example: 10003
    let atlToken = getCookie('atlassian.xsrf.token');
    let params = `${customField}=key%3A${epicIssueKey}&issueId=${issueId}&atl_token=${atlToken}&singleFieldEdit=true&fieldsToForcePresent=${customField}`;
    //console.log(params);

    let req = new XMLHttpRequest();
    req.open("POST", "/secure/AjaxIssueAction.jspa");
    req.addEventListener("load", refreshPage);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send(params);
}


/*
issue_list =
[
  {
    "expand": "operations,editmeta,changelog,transitions,renderedFields",
    "id": "10200",
    "self": "http://localhost:8080/rest/api/2/issue/10200",
    "key": "SEB-7",
    "fields": {
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 5,
        "worklogs": [
          {
            "self": "http://localhost:8080/rest/api/2/issue/10200/worklog/10300",
            "author": {
              "self": "http://localhost:8080/rest/api/2/user?username=admin",
              "name": "admin",
              "key": "admin",
*/

function filterWorklog(issue_list, author) {
    let worklogByDay = {};
    let issuesWorklogged = {};

    const {start_date, end_date} = getWeekLimit();
    issue_list.forEach(issue => {
        let worklogList = issue.fields.worklog.worklogs
        worklogList.forEach(wl => {
            let wlday = new Date(wl.started)
            if(wl.author.key === author && wlday >= start_date && wlday <= end_date) {
                // keep this worklog & issue
                let dayOfWl = formatSlashDate(wlday);
                let wlDay = worklogByDay[dayOfWl]
                if(wlDay === undefined) {
                    worklogByDay[dayOfWl] = {};
                    worklogByDay[dayOfWl].list = [];
                    worklogByDay[dayOfWl].timeSpent = 0;
                    wlDay = worklogByDay[dayOfWl];
                }
                wl['issue'] = issue;
                wl['issuekey'] = issue.key;
                wl['issueid'] = issue.id;
                wlDay.list.push(wl);
                wlDay.timeSpent += wl.timeSpentSeconds;
                issuesWorklogged[issue.key] = issue.fields.summary;
            }

        });
    });
    //console.log(worklogByDay);

    // Export an issues list KEY: Summary for clipboard
    let summary = '';
    for(let jirakey in issuesWorklogged) {
        summary += jirakey + ': ' + issuesWorklogged[jirakey] + '\n';
    }
    // Choose one of the following: alert dialog or copy to clipboard
    //jQuery('#btn-copy-worklog').on('click', () => showWorkLogSummary(summary));

    if(worklogToClipboard !== undefined) {
        worklogToClipboard.destroy();
    }
    let options = {
        text: function(trigger) {
            $.notify("Copied:\n" + summary, "info");
            return summary;
        }
    };
    worklogToClipboard = new ClipboardJS('#btn-copy-worklog', options);

    return worklogByDay;
}

function showWorkLogSummary(summary) {
    alert(summary);
}

// Returns the date of Monday and Friday of the current week
function getWeekLimit(){
    let monday = new Date();
    monday.setHours(0);
    monday.setMinutes(0);
    monday.setSeconds(0);
    monday.setMilliseconds(0);
    let friday = new Date(monday);
    let monday_day = monday.getDate() - monday.getDay() + 1;
    monday.setDate(monday_day);

    let saturday_day = monday_day + 5;
    friday.setDate(saturday_day);
    friday.setMilliseconds(-1);
    return {start_date: monday, end_date: friday};
}

function jumpNDays(date, daysToAdd) {
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

function formatSlashDate(date)
{// ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
    let mois = date.getMonth() + 1;
    return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((mois > 9) ? mois : ('0' + mois)) + '/' + date.getFullYear()
}

// Formats date to YYYY-MM-DD
function formatDate(date) {
    let mois = date.getMonth() + 1;
    return date.getFullYear() + '-' + (mois < 10 ? '0' : '') + mois + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}

function getWeekWorkLog() {
    // GET {{protocol}}://{{host}}/{{basePath}}rest/api/2/search?jql=(worklogDate >= "2020-02-24" AND worklogDate <= "2020-02-28") AND assignee = currentUser() &fields=worklog,summary

    const {start_date, end_date} = getWeekLimit();
    let queryparams = `jql=(worklogDate >= '${formatDate(start_date)}' AND worklogDate <= '${formatDate(end_date)}') AND worklogAuthor = currentUser()&fields=worklog,summary`;
    let req = new XMLHttpRequest();
    req.addEventListener("load", workLogProcessor);
    req.open("GET", "/rest/api/2/search?" + queryparams, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    req.send();
}

async function fetchLargeWorklog(issue_list) {

    let cumulateWorklog = function(res, issue) {
        //console.log(res);
        issue.fields.worklog = res;
    };

    let queries = [];
    issue_list.forEach(issue => {
        let worklog = issue.fields.worklog;
        if(worklog.total > worklog.maxResults) {

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            queries.push( fetch(`/rest/api/2/issue/${issue.key}/worklog`, options)
                .then(res => res.json())
                .then(res => cumulateWorklog(res, issue)) );
        }
    });
    await Promise.all(queries);
}


async function workLogProcessor() {
    let issue_list = this.response['issues'];
    if(issue_list === undefined) {
        console.log('No response. Not logged in?');
        $('#worklog-day-1').append('<div style="font-weight: bold">No response</div>');
        return;
    }
    //console.log(issue_list);

    let worklogByDay = await fetchLargeWorklog(issue_list)
      .then(() => {return filterWorklog(issue_list, JIRA.Users.LoggedInUser.userName())});

    //let worklogByDay = filterWorklog(issue_list, JIRA.Users.LoggedInUser.userName());
    let weekLimit = getWeekLimit();
    let iday = weekLimit.start_date;
    $('#week-start').get(0).innerText = formatSlashDate(weekLimit.start_date);
    $('#week-end').get(0).innerText = formatSlashDate(weekLimit.end_date);

    for(let i = 1; i <= 5; i++) {
        let dayCol = $('#worklog-day-' + i);
        const english_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayOfWl = formatSlashDate(iday);

        let spanTimeSpentInDay = '';
        if(worklogByDay[dayOfWl] !== undefined && worklogByDay[dayOfWl].timeSpent !== undefined) {
            let durationInHours = (worklogByDay[dayOfWl].timeSpent / 3600);
            if(durationInHours === 8) {
                spanTimeSpentInDay = `<span class="roundtext greentext">${durationInHours}h</span>`;
            } else {
                spanTimeSpentInDay = `<span class="roundtext redtext">${durationInHours}h</span>`;
            }
        }
        dayCol.append(`<div style="font-weight: bold">${english_days[iday.getDay()]}</div> <div style="border-bottom: 1px solid #ccc; margin-bottom: 15px;">${dayOfWl}${spanTimeSpentInDay}</div>`);
        //console.log(worklogByDay[dayOfWl]);
        if(worklogByDay[dayOfWl] !== undefined) {
            for(let wl of worklogByDay[dayOfWl].list) {
                let link = window.location.toString().replace(/\/[^\/]*$/, '/' + wl.issuekey);
                dayCol.append(`<div style="margin: 5px;"><a href="${link}" title="${wl.issuekey} => ${wl.issue.fields.summary}" >${wl.issuekey}</a>:<span class="roundtext">${wl.timeSpent}</span></div>`);
            }
        }
        jumpNDays(iday, 1);
    }

    let wlDialog = jQuery('#show-worklog-dialog').get(0);
    wlDialog.style.marginTop = -wlDialog.offsetHeight/2 +"px";
}

function showWeekWorkLogDIalog() {


    let htmlDialog = `
    <div id="show-worklog-dialog"
        class="jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready"
        style="width: 810px; margin-left: -406px; margin-top: -150px;">
        <div class="jira-dialog-heading">
            <div class="aui-toolbar2 qf-form-operations">
                <div class="aui-toolbar2-inner">
                    <div class="aui-toolbar2-secondary">
                        <button id="btn-copy-worklog" class="aui-button">Copy summary</button>
                    </div>
                </div>
            </div>
            <h2 title="Work Log">Work log</h2>
        </div>
        <div class="jira-dialog-content">
            <div class="qf-container">
                <div class="qf-unconfigurable-form">
                    <form name="jiraform" action="#" class="aui">
                        <div class="form-body" style="max-height: 600px;">

                            <div class="qf-field">
                                <div style="margin: 10px;">
                                    <label>Week</label>
                                    <label> from </label>
                                    <label style="color: black;" id="week-start">-</label>
                                    <label> to </label>
                                    <label style="color: black;" id="week-end">-</label>

                                </div>
                            </div>

                            <div class="container">
                                <div class="row">

                                    <div id="worklog-day-1" class="col item">
                                    </div>
                                    <div id="worklog-day-2" class="col item">
                                    </div>
                                    <div id="worklog-day-3" class="col item">
                                    </div>
                                    <div id="worklog-day-4" class="col item">
                                    </div>
                                    <div id="worklog-day-5" class="col item">
                                    </div>

                                </div>
                            </div>

                            <div class="buttons-container form-footer">
                                <div class="buttons">
                                    <span class="icon throbber"></span>
                                    <a href="#" title="Press Esc to cancel" class="cancel"
                                        onclick='let element = document.getElementById("show-worklog-dialog"); element.parentNode.removeChild(element); event.preventDefault();'>Close</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;

    $('#jira').append(htmlDialog);

    getWeekWorkLog();

}

function refreshPage() {
    JIRA.trigger(JIRA.Events.REFRESH_ISSUE_PAGE, [JIRA.Issue.getIssueId()]);
}

function init() {
    'use strict';
    if(JIRA.Users.LoggedInUser.isAnonymous()) {
        return;
    }

    if(!$('#clipboardBtn').length) {
        $('.toolbar-split-left').append('<button id="clipboardBtn" class="aui-button aui-style">        <svg viewBox="0 0 896 1024" width="15" xmlns="http://www.w3.org/2000/svg">          <path d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" />        </svg>    </button>');
        $('.toolbar-split-left').append('<ul id="worklog-issue_container" class="toolbar-group pluggable-ops">\
<li class="toolbar-item">\
<a id="worklog2h-issue" title="Add 2h in work log" class="toolbar-trigger"><span class="trigger-label">2h</span></a>\
</li>\
<li class="toolbar-item">\
<a id="worklog4h-issue" title="Add 4h in work log" class="toolbar-trigger"><span class="trigger-label">4h</span></a>\
</li>\
<li class="toolbar-item">\
<a id="worklog1d-issue" title="Add 1d in work log" class="toolbar-trigger"><span class="trigger-label">1d</span></a>\
</li>\
</ul>\
');
        jQuery('#worklog2h-issue').on('click', () => addWorkLogNowRest('2h'));
        jQuery('#worklog4h-issue').on('click', () => addWorkLogNowRest('4h'));
        jQuery('#worklog1d-issue').on('click', () => addWorkLogNowRest('1d'));

        $('.toolbar-split-left').append('<ul id="epic-issue_container" class="toolbar-group pluggable-ops">\
<li class="toolbar-item">\
<a id="technic-epic-issue" title="Set Epic" class="toolbar-trigger"><span class="trigger-label">Set Epic</span></a>\
</li>\
</ul>\
');
        jQuery('#technic-epic-issue').on('click', () => setEpicRest('SEB-6'));


        $('.toolbar-split-left').append('<ul id="custom-link-issue_container" class="toolbar-group pluggable-ops">\
<li class="toolbar-item">\
<a id="custom-link-issue" title="Add Link" class="toolbar-trigger"><span class="trigger-label">Add Link</span></a>\
</li>\
</ul>\
')
        jQuery('#custom-link-issue').on('click', () => createLinkRest('blocks', 'SEB-3'));


        $('.toolbar-split-left').append('<ul id="custom-get-weekworklog_container" class="toolbar-group pluggable-ops">\
<li class="toolbar-item">\
<a id="custom-get-weekworklog" title="Get week work log" class="toolbar-trigger"><span class="trigger-label">Show week work log</span></a>\
</li>\
</ul>\
')
        //jQuery('#custom-get-weekworklog').on('click', () => getWeekWorkLog());
        jQuery('#custom-get-weekworklog').on('click', () => showWeekWorkLogDIalog());
    }


    // CSS
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
        `.container {\n
                width: 750px;\n
                padding-right: 15px;\n
                padding-left: 15px;\n
                margin-left: auto;
                margin-right: auto;
                margin-top: 10px;
                margin-bottom: 10px;

            }\n

            .row {
                display: flex;
                flex-wrap: wrap;
            }
            .col {
                flex-basis: 0;
                -webkit-box-flex: 1;
                flex-grow: 1;
                max-width: 100%;
            }
            .roundtext {
                background-color: #c5d4e7; /* lighter than lightsteelblue */
                font-weight: bold;
                border-radius: 4px;
                width: auto; /* Making auto-sizable width */
                height: auto; /* Making auto-sizable height */
                padding: 2px 2px 2px 2px; /* Making space around letters top right bottom left */
                margin: 5px;
                font-size: 13px;
            }
            .greentext {
                background-color: #c2f2c2;
            }
            .redtext {
                background-color: #f9aeae; /* or lightcoral */
            }
          `;
    document.getElementsByTagName('head')[0].appendChild(style);
}


function exportUsefulCommands() {

    let WL = {};
    window.Worklog = WL;

    // Add a custom worklog from browser console, example:
    // Worklog.add('2020-03-28', '4h')
    WL.add =
        function (rawdate = new Date().toISOString(), duration = '1d') {
        const issueId = JIRA.Issue.getIssueId();
        //console.log(issueId + ' ' + date);

        let date;
        if(typeof(rawdate) === 'string') {
            if(rawdate.length === 8 && rawdate.startsWith('20')) { // 20200328
                let year = rawdate.slice(0, 4);
                let month = rawdate.slice(4, 6);
                let day = rawdate.slice(6, 8);
                date = `${year}-${month}-${day}T12:00:00.000+0000`;
            } else { // if (rawdate.length === 10 && rawdate.includes('-'))
                date = new Date(Date.parse(rawdate)).toISOString();
            }

        } else {
            date = rawdate;
        }

        // date format: "2020-03-28T13:18:17.222+0000"
        addWorkLogDateRest(date, duration);
    }

    function isWE(date){
        let day = date.getDay();
        if(day === 0 || day === 6) {
            return true;
        }
        return false;
    }

    // To add 10 days of work logs begining at date in parameter, type in browser console the following instruction:
    // Worklog.addDays("20200222", 10)
    // WE days are not logged
    WL.addDays = function (rawdate = new Date().toISOString(), nbDays) {
        let date;
        let daysWalked = 0;
        if(typeof(rawdate) === 'string') {
            if(rawdate.length === 8 && rawdate.startsWith('20')) { // 20200328
                let year = rawdate.slice(0, 4);
                let month = rawdate.slice(4, 6);
                let day = rawdate.slice(6, 8);
                date = new Date();
                date.setYear(year);
                date.setMonth(month-1);
                date.setDate(day);
            } else { // if (rawdate.length === 10 && rawdate.includes('-'))
                date = new Date(Date.parse(rawdate));
            }

        } else {
            date = rawdate;
        }

        while(daysWalked < nbDays) {
            if(!isWE(date)) {
                daysWalked++;
                console.log(date);
                addWorkLogDateRest(date.toISOString(), '1d');
            }
            jumpNDays(date, 1);
        }
        //return date;
    }
}

exportUsefulCommands();


$(document).ajaxComplete(init);
