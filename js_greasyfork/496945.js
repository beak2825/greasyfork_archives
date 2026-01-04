// ==UserScript==
// @name         PXL MyTime fixes
// @namespace    http://tampermonkey.net/
// @version      2024-06-05-13-38
// @description  Fixes some issues with PXL MyTime
// @author       You
// @match        https://mytime.pxl.be/registration*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxl.be
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/496945/PXL%20MyTime%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/496945/PXL%20MyTime%20fixes.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let page = window.location.pathname;

    refreshSelects();

    if (page == "/registration/form") {
        let activity = document.querySelector("#activity");
        if (activity != null) {
            activity.addEventListener("change", () => {
                let activityId = activity.value;
                localStorage.setItem("lastActivity", activityId);
            });

            setTimeout(() => {
                activity.value = localStorage.getItem("lastActivity");
            }, 200);
        }
    }
})();

function refreshSelects() {
    let selects = document.querySelectorAll("select");

    for (var i = 0; i < selects.length; i++) {
        selects[i].multiple = true;
        selects[i].style.overflowY = "auto";
        selects[i].size = Math.max(selects[i].childElementCount, 2);
        selects[i].removeEventListener("change", delayedRefreshSelects);
        selects[i].addEventListener("change", delayedRefreshSelects);
    }
}

function delayedRefreshSelects() {
    setTimeout(() => {
        refreshSelects();
    }, 200);
}