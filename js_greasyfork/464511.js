// ==UserScript==
// @name         Purpur Utilities
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  A collection of github QoL features that are useful for a Purpur developer
// @author       granny
// @match        https://github.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464511/Purpur%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/464511/Purpur%20Utilities.meta.js
// ==/UserScript==

let commitItem = null;

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    const targetNode = document.getRootNode();
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    let hasCommitListItem = false;
    let hasDiscussionTab = false;
    // Callback function to execute when mutations are observed
    const callback = async () => {
        await highlightCommitItem(hasCommitListItem, /\w+\/\w+\/commits\/\w+/);

        //await addDiscussionsCounter(hasDiscussionTab, /\w+\/\w+/);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

})();

async function highlightCommitItem(hasCommitListItem, pathNameRegex) {
    if (!location.pathname.match(pathNameRegex)) {
        hasCommitListItem = false;
        return;
    }

    if (hasCommitListItem) {
        return;
    }

    const commitListItems = document.querySelectorAll('li[data-testid="commit-row-item"]');
    if (!commitListItems) {
        return;
    }

    hasCommitListItem = true;

    const purpurGradleProperties = await fetch('https://raw.githubusercontent.com/PurpurMC/Purpur/master/gradle.properties').then(res => res.text());
    const commitResult = /paperCommit\s+?=\s+?(.+)/g.exec(purpurGradleProperties);

    if (commitResult == null) return;

    if (commitItem != null) {
        commitItem.style = "";
    }

    commitItem = getCommitListItem(commitListItems, commitResult[1]);

    if (commitItem != null) {
        commitItem.style = "background-color: rgba(128, 0, 128, 0.1);";
    }
}

function getCommitListItem(listItems, commitHash) {
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        if (listItem.querySelector(`a[href*="${commitHash}"]`) != null) {
            return listItem;
        }
    }

    return null;
}

async function addDiscussionsCounter(hasDiscussionTab, pathNameRegex) {
    if (!location.pathname.match(pathNameRegex)) {
        hasDiscussionTab = false;
        return;
    }

    if (hasDiscussionTab) {
        return;
    }

    const discussionsContainer = document.querySelector('li.js-commits-list-item');
    if (!discussionsContainer) {
        return;
    }

    hasDiscussionTab = true;

}