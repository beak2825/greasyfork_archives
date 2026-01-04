// ==UserScript==
// @name            Open 20 random profiles
// @namespace       http://tampermonkey.net/
// @description     Random profile opening for LinkedIn search
// @match           https://www.linkedin.com/recruiter/smartsearch/*
// @version         2.011111
// @author          Vasiliy Kuznetsov
// @grant           GM_openInTab
// @grant           GM_log
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/390443/Open%2020%20random%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/390443/Open%2020%20random%20profiles.meta.js
// ==/UserScript==]]]]]]]]

"use strict";
var profilePages = [];
const TOTAL_PROFILES = 2;
var currentPageIndex = 1;
var pagesToOpen = [];
const PAGINATION = 25;
var movementPage = false;
var profilesOpened = 0;
var countValue = TOTAL_PROFILES;
var randomProfiles = [];
var jiraId = '';

askForJiraId();

function doJiraRequest(method, url, dataJson, onLoad, onError) {
    GM_xmlhttpRequest({
        method:         method,
        url:            url,
        headers:        {
            "Content-Type": "application/json",
            "Accepts": "application/json",
            "User-Agent": ''
        },
        data:           dataJson,
        onload:         onLoad,
        onabort:        onError,
        onerror:        onError,
        ontimeout:      onError
    });
}

function postComment(jiraId, comment, onLoad, onError) {
    doJiraRequest('POST', "https://jira.devfactory.com/rest/api/2/issue/" + jiraId + "/comment", JSON.stringify({ "body": comment }), onLoad, onError);
}

function askForJiraId() {
    jiraId = prompt('Which JIRA id is this operation linked to?');
    if (!jiraId) {
        alert('You haven\'t specified any value JIRA id, operation will be cancelled.');
        return;
    }

    // Seems we get onError called even on 200/201, so let's just handle them unified with same callback
    var onRequestedCompleted = resp => {
        if (resp.status == 200 || resp.status == 201) {
            open_profiles();
            gmMain();
        } else if (resp.status == 401 || resp.status == 403) {
            alert('Could not access JIRA id: "' + jiraId + '". \nMake sure you are logged in to JIRA. \nError: ' + resp.status + ' ' + resp.statusText);
            window.open('https://jira.devfactory.com/login.jsp');
        } else {
            console.log(JSON.stringify(resp));
            alert('Could not access JIRA id: "' + jiraId + '". \nMake sure you are logged in to JIRA and the specified JIRA id is valid and you have access to it. \nError: ' + resp.status + ' ' + resp.statusText);
        }
    };
    // Test if jira is valid/we have access to it
    doJiraRequest(
        'GET',
        'https://jira.devfactory.com/rest/api/2/issue/' + jiraId + '?fields=id',
        onRequestedCompleted,
        onRequestedCompleted);

}

function open_profiles() {
    var index = 0;
    var pagesToOpen = 1;
    var alerted = false;
    var data_track = "";
    countValue = document.querySelector('.talent-pool-tab[data-tracking-control-name="total-talentPoolSection"] .talent-pool-tab-title .count').innerHTML;
    countValue = countValue.replace(/,/g, '');
    var paginationElement = document.querySelector('.page-link[data-tracking-control-name=nextPageTop]');
    GM_log(countValue);
    var pagesToNavigate = 1;
    var randomProfiles = [];
    if (!isNaN(countValue)) {
        if (countValue > 25) {
            countValue = 25;
        }
        selectRandomProfiles(TOTAL_PROFILES, PAGINATION, parseInt(countValue));
    }
}

function paginate_open() {
    var index = 0;
    var links = document.getElementsByTagName('a');
    var profiles = [];
    var profileCount = 0;
    var profileIndex = 0;
    while (index < links.length) {
        var profile_link = links[index].getAttribute("data-track");
        if (profile_link == "profile-link") {
            profiles.push(links[index]);
            profileCount++;
        }
        index++;
    }
    var profileIndices = getRandomNumber(0, profileCount, profilePages[currentPageIndex - 1]);
    while (profileIndex < profileIndices.length) {
        randomProfiles.push(profiles[profileIndices[profileIndex]].href);
        profileIndex++;
        profilesOpened++;
        if (profilesOpened >= TOTAL_PROFILES || profilesOpened >= countValue) {
            //randomize the pages
            shuffle(randomProfiles);

            var commentContents = '';
            var indexP = 0;
            //not sure why it wasn't done with a FOR loop...
            while (indexP < randomProfiles.length) {
                var link = randomProfiles[indexP];
                var win = window.open(link, '_blank');
                win.focus()

                setTimeout(function () {
    console.log(document.querySelector("#profile-summary > div.module-body.searchable").textContent);
  }, 3000)
                
                if (indexP % 10 == 0) {
                    commentContents += '\nSet ' + (indexP / 10 + 1) + ':\n';
                }
                commentContents += '[link ' + (indexP % 10 + 1) + '|' + link + ']\n';
                indexP++;
            }
            //alert("Successfully Opened " + profilesOpened + " profiles. \nPlease wait for the comment to be posted on the JIRA ticket");
            postComment(
                jiraId,
                commentContents,
                () => alert('Comment posted on JIRA id' + jiraId),
                resp => {
                    if (resp.status != 200 && resp.status != 201) {
                        alert('Comment posted on JIRA id: ' + jiraId);
                    } else {
                        console.log(JSON.stringify(resp));
                        alert('Error posting on JIRA id ' + jiraId + ': ' + resp.status);
                    }
                });
            break;
        }
    }
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function selectRandomProfiles(profileToOpen, pagination, resultsCount) {
    var pageCount = Math.ceil(resultsCount / pagination);
    var additionalProfiles = 0;
    var exactMultiple = resultsCount % pagination == 0;
    pagesToOpen = getRandomPages(resultsCount, profileToOpen, pagination);
    var profilesPerPage = 1;
    if (resultsCount < profileToOpen) {
        profilesPerPage = parseInt(resultsCount);
    } else if (profileToOpen >= pageCount) {
        profilesPerPage = Math.floor(profileToOpen / pageCount);
        additionalProfiles = profileToOpen - (pagesToOpen.length * profilesPerPage);
        if (!exactMultiple && profilesPerPage >= (resultsCount % pagination)) {
            additionalProfiles = additionalProfiles + (profilesPerPage - (resultsCount % pagination));
        }
    }
    //alert("Pages to open:" + pagesToOpen + " pagecount:" + pageCount + " profiles per page:" + profilesPerPage + " additional profiles:" + additionalProfiles);

    var ind = 0;
    var splitAddProf = 0;
    if (additionalProfiles != 0) {
        splitAddProf = Math.floor(additionalProfiles / (pagesToOpen.length - 1));
    }
    while (ind < pagesToOpen.length) {
        if (ind != pagesToOpen.length - 1) {
            if (additionalProfiles > 0) {
                profilePages.push(profilesPerPage + 1);
                additionalProfiles--;
            } else {
                profilePages.push(profilesPerPage);
            }
        } else {
            if (exactMultiple || profilesPerPage < (resultsCount % pagination)) {
                profilePages.push(profilesPerPage);
            } else {
                profilePages.push(resultsCount % pagination);
            }
        }
        //alert(" Page:" + ind + " no of profiles:" + profilePages [ind]);
        ind++;
    }
    profilePages[0] = profilePages[0] + additionalProfiles;
    //alert("Pages to open:" + pagesToOpen + " count in each page:" + profilePages);
    GM_log("Pages to open:" + pagesToOpen + " count in each page:" + profilePages);
}

function getRandomPages(resultsCount, profileToOpen, pagination) {
    var pageCount = Math.ceil(resultsCount / pagination);
    var pagesToOpenCnt = pageCount;
    var profilesPerPage = 1;
    if (profileToOpen < pageCount) {
        pagesToOpenCnt = profileToOpen;
    }

    var arr = [];
    if (pageCount > pagesToOpenCnt) {
        arr.push(1);
        arr.push(pageCount);
        while (arr.length < pagesToOpenCnt) {
            var r = Math.floor(Math.random() * (pageCount - 1)) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
    } else {
        arr = Array.from(Array(pageCount), (x, i) => i + 1);
    }
    arr.sort(function (a, b) { return a - b });
    return arr;
}

function getRandomNumber(min, max, count) {
    var arr = [];
    while (arr.length < count) {
        var r = Math.floor(Math.random() * max - 1) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}


var fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval(
    function () {
        if (this.lastPathStr !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
           ) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr = location.hash;
            gmMain();
        }
    }
    , 111
);

function gmMain() {
    GM_log('A "New" page has loaded.');
    if (!movementPage && profilesOpened < TOTAL_PROFILES) {
        paginate_open();
    }
    if (currentPageIndex < pagesToOpen.length) {
        //GM_log(currentPageIndex);
        movementPage = false;
        var paginationElement = document.querySelector('.page-link[data-page-number="' + pagesToOpen[currentPageIndex] + '"]');
        if (paginationElement == null) {
            movementPage = true;
            paginationElement = document.querySelector('.page-link[data-tracking-control-name="nextPageBottom"]');
        } else {
            currentPageIndex++;
        }
        paginationElement.click();
    }
}