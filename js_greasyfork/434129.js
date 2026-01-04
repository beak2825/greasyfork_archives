// ==UserScript==
// @name         Unfold Jira quickfilters
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Unfolds Jira quickfilters in Kanban view
// @author       Alan Borowy
// @match        https://*.atlassian.net/jira/software/c/projects/*
// @icon         https://www.google.com/s2/favicons?domain=bitbucket.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434129/Unfold%20Jira%20quickfilters.user.js
// @updateURL https://update.greasyfork.org/scripts/434129/Unfold%20Jira%20quickfilters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function handleCanvas(quickFiltersButton) {
        quickFiltersButton.click()
    }

    // @damd, https://stackoverflow.com/a/35211286
    // set up the mutation observer
    var observer = new MutationObserver(function (mutations, me) {
        // `mutations` is an array of mutations that occurred
        // `me` is the MutationObserver instance
        var quickFiltersButton = document.querySelector('#ghx-quick-filters .jdgrw0-0.bsBhhk button');
        if (quickFiltersButton) {
            handleCanvas(quickFiltersButton);
            me.disconnect(); // stop observing
            return;
        }
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();