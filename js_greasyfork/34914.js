// ==UserScript==
// @name         Github Pull Request Rebase Checker
// @version      0.1
// @description  Checks each pull requests and see if they need a rebase.
// @author       kjung
// @match        https://github.com/pulls
// @match        https://github.com/*/*/pulls
// @match        https://github.com/*/*/issues*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/users/6863
// @downloadURL https://update.greasyfork.org/scripts/34914/Github%20Pull%20Request%20Rebase%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/34914/Github%20Pull%20Request%20Rebase%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var needsRebaseColour = '255, 0, 0, 0.3'; // RGB

    var pullRequestsThatNeedsRebase = [];
    var pullRequests = $('ul.js-active-navigation-container li');

    $.when.apply(null, $.map(pullRequests, function (pr) {
        var pullReuqest = $(pr);
        var pullRequestUrl = pullReuqest.find('.js-navigation-open').attr('href');

       return $.get(pullRequestUrl, function (response) {
        var pullRequestNeedsRebase = $(response).find('.completeness-indicator-problem').length;
        if (pullRequestNeedsRebase) {
            pullRequestsThatNeedsRebase.push(pullReuqest);
        }
       });
    })).done(function () {
        pullRequestsThatNeedsRebase.forEach(function(pr) {
            pr.css('cssText', 'background-color: rgba('+needsRebaseColour+') !important;');
        });
    });
})();
