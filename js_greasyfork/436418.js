// ==UserScript==
// @name         Azure DevOps Pull Request Filter
// @namespace    https://github.com/calne-ca
// @version      0.2.1
// @description  Filter pull Requests in Azure DevOps by tags
// @author       Joscha Düringer
// @license      MIT
// @supportURL   https://github.com/calne-ca/tampermonkey-azure-devops-pull-request-tag-filter
// @match        https://dev.azure.com/*/pullrequests*
// @icon         https://www.google.com/s2/favicons?domain=dev.azure.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436418/Azure%20DevOps%20Pull%20Request%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436418/Azure%20DevOps%20Pull%20Request%20Filter.meta.js
// ==/UserScript==

function removePullRequest(pullRequest){
    console.log("Removing pull request: " + pullRequest);
    pullRequest.remove();
}

function adjustRowSpacers() {
    const rowSpacers = document.getElementsByClassName('bolt-list-cell-spacer');

    for(const rowSpacer of rowSpacers){
        rowSpacer.style.height = 0;
    }
}

function stringMatchesFilter(str, filter) {
    return filter.some(filterStr=> new RegExp("^" + filterStr + "$").test(str));
}

function pullRequestHasMatchingTag(pullRequest, filteredTags, showUntagged) {
    if(filteredTags.length === 0) {
        return true;
    }

    const labels = pullRequest.querySelectorAll('.bolt-pill-overflow .text-ellipsis');
    const pullRequestLabels = []

    if(labels.length === 0 && showUntagged) {
        return true;
    }

    for (const label of labels) {
        pullRequestLabels.push(label.textContent);
    }

    return pullRequestLabels.some(tag=> stringMatchesFilter(tag, filteredTags));
}

function pullRequestHasMatchingTitle(pullRequest, filteredTitles) {
    if(filteredTitles.length === 0){
        return true;
    }

    const title = pullRequest.querySelector('.body-l').textContent;

    return stringMatchesFilter(title, filteredTitles);
}

function pullRequestHasAssignee(pullRequest){
    const assignees = pullRequest.querySelectorAll('.bolt-table-cell-content .flex-center img');
    return assignees.length > 0;
}

function pullRequestShouldBeRemoved(pullRequest, filteredTags, showUntagged, filteredTitles, unassignedOnly) {
    return !pullRequestHasMatchingTag(pullRequest, filteredTags, showUntagged) ||
        !pullRequestHasMatchingTitle(pullRequest, filteredTitles) ||
        (unassignedOnly && pullRequestHasAssignee(pullRequest));
}

function filterPullRequests(pullRequests, filteredTags, showUntagged, filteredTitles, unassignedOnly){
    for (const pullRequest of pullRequests) {
        if (pullRequestShouldBeRemoved(pullRequest, filteredTags, showUntagged, filteredTitles, unassignedOnly)) {
            removePullRequest(pullRequest)
        }
    }

    adjustRowSpacers();
}

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const tagFilterParam = urlParams.get('tagFilter');
    const titleFilterParam = urlParams.get('titleFilter');
    const showUntaggedParam = urlParams.get('showUntagged');
    const unassignedOnlyParam = urlParams.get('unassignedOnly');
    const refreshInterval = 200;

    const filteredTags = tagFilterParam ? tagFilterParam.split(',') : [];
    const filteredTitles = titleFilterParam ? titleFilterParam.split(',') : [];
    const showUntagged = showUntaggedParam === 'true'
    const unassignedOnly = unassignedOnlyParam === 'true'

    if(filteredTags.length === 0 && filteredTitles.length === 0 && !unassignedOnly) {
        return;
    }

    console.log("Filtering pull requests with filteredTags='" + filteredTags + "', showUntagged='" + showUntagged + "', filteredTitles='" + filteredTitles + "', unassignedOnly='" + unassignedOnly + "'");

    setInterval(function() {
        const path = window.location.pathname.replace(/\/$/, "");

        if(!path.endsWith('pullrequests')) {
            return;
        }

        const pullRequests = document.getElementsByClassName('bolt-list-row');

        if (pullRequests) {
            filterPullRequests(pullRequests, filteredTags, showUntagged, filteredTitles, unassignedOnly);
        }
    }, refreshInterval);
})();