// ==UserScript==
// @name         Realistic Kickstarter Dates
// @description  Adds 9 months onto all Kickstarters reward dates.
// @version      1.2
// @author       Ryan Poole
// @match        https://www.kickstarter.com/projects/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// @namespace    https://greasyfork.org/users/48078
// @downloadURL https://update.greasyfork.org/scripts/20711/Realistic%20Kickstarter%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/20711/Realistic%20Kickstarter%20Dates.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.js-project-rewards .js-adjust-time')
    .forEach(date => date.textContent = new moment(date.textContent, "MMM, YYYY").add(9, "months").format("MMM YYYY") + " (" + date.textContent + ")");
})();