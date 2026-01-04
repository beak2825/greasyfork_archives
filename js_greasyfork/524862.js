// ==UserScript==
// @name         SaveMyExams Infinite Page Views
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Deletes a local storage entry on page load
// @author       Sam
// @match        https://www.savemyexams.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524862/SaveMyExams%20Infinite%20Page%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/524862/SaveMyExams%20Infinite%20Page%20Views.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const localStorageBlacklist = ["SME.revision-note-views", "SME.last-viewed-course", "SME.latest-resource-views", "SME.revision-note-views"]

    const defaultItemSetter = Storage.prototype.setItem.bind(localStorage);

    Storage.prototype.setItem = (k, v) => {
        if (localStorageBlacklist.includes(k)) return;
        defaultItemSetter(k, v);
    }

    localStorageBlacklist.forEach(k => {
        defaultItemSetter(k, "[]");
    });

    localStorage.setItem("SME.join-page-view-trigger", "COYS");
})();
