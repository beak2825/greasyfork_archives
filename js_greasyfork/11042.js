// ==UserScript==
// @name         Default pull request reviewers
// @namespace    http://www.regretless.com/
// @version      0.1
// @description  Allows you to create a list of default reviewers by stash project.
// @author       Ying Zhang
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://stash.meredith.com/*pull-requests?create*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11042/Default%20pull%20request%20reviewers.user.js
// @updateURL https://update.greasyfork.org/scripts/11042/Default%20pull%20request%20reviewers.meta.js
// ==/UserScript==

// update this accordingly. You will need the reviewers AD usernames. You can get this by search for the user using the regular stash reviewer search function.
var reviewersByProject = {
    'mdp.drp.parents': ['gchilds', 'abothun', 'mmoser', 'cpurcell', 'jsteward', 'sphillips', 'lwalangi', 'tflanaga']
};

$(document).ready(function() {
    for(var project in reviewersByProject) {
        if(window.location.href.indexOf(project)) {
            setTimeout(function() {
                var reviewers = reviewersByProject[project];
                tamperInjectStashReviewers(reviewers);
            }, 300);
        }
    }
});

function tamperInjectStashReviewers(reviewers) {
    var delimiter = '|!|';
    var $description = $('.pull-request-reviewers .description');
    var $reviewers = $('#reviewers').removeClass('select2-offscreen').attr('placeholder', 'This is the hidden reviewer input that you couldn\'t see before.');
    var $reviewerSuggestions = $('<p/>').insertBefore($description);
    $('<br/>').insertBefore($reviewers);

    var reviewerSuggestionsHtml = '<b>Add reviewer(s):</b> ';
    for(var i in reviewers) {
        var reviewer = reviewers[i];
        reviewerSuggestionsHtml += '<a href="#" class="tamperAddStashReviewer" data-reviewer="' + reviewer + '">' + reviewer + '</a>' + ' \n';
    }
    $reviewerSuggestions.html(reviewerSuggestionsHtml);
    $('.tamperAddStashReviewer').on('click', function(e) {
        e.preventDefault();
        var reviewer = $(this).data('reviewer');
        var oldVal = $reviewers.val();
        if(jQuery.trim(oldVal) === '') {
            $reviewers.val(reviewer);
        } else if(oldVal.indexOf(reviewer) > -1) {
            var index = oldVal.indexOf(reviewer);
            if(index - delimiter.length >= 0) {
                $reviewers.val(oldVal.replace(delimiter + reviewer, ''));
            } else {
                $reviewers.val(oldVal.replace(reviewer, ''));
            }
        } else {
            $reviewers.val(oldVal + delimiter + reviewer);
        }
    });
}