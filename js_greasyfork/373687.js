// ==UserScript==
// @name         GitHub Release Creator
// @namespace    http://tampermonkey.net/
// @description  You wanna dance?
// @version      0.1
// @author       tudor-coderz
// @match        https://github.com/joinrepublic/republic/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373687/GitHub%20Release%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/373687/GitHub%20Release%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var GITHUB_REPOSITORY_URL = 'https://github.com/joinrepublic/republic',
        ATLASSIAN_URL = 'https://republic-co.atlassian.net/browse/';

    function loadReleaseNumber() {
        $.ajax({
            type: 'get',
            url: GITHUB_REPOSITORY_URL + '/pulls?q=is%3Apr+is%3Aclosed+label%3ARelease',
            success: function(response) {
                var $dom = $(response),
                    $pullRequestTitle = $('#pull_request_title'),
                    $pullRequestBody = $('#pull_request_body');

                var latestReleaseNumber = parseInt($dom.find('.js-issue-row').first().find('.js-navigation-open').text().replace(/\D+/g, ''));
                var currentReleaseNumber = latestReleaseNumber + 1;

                $pullRequestTitle.val('Release ' + currentReleaseNumber);
                $pullRequestBody.val($pullRequestBody.val().replace('{{release-number}}', currentReleaseNumber));
            },
            error: function() {
                $pullRequestBody.val($pullRequestBody.val().replace('{{release-number}}', ''));
            }
        });
    }

    function getCurrentDate() {
        var date = new Date();
        return date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate();
    }

    function createPrRow(pr) {
        var prRowTemplate = "| **{{title}}** | [{{ticket-id}}]({{ticket-link}}) | {{branch-id}} | {{ticket-category}} |\n";
        return prRowTemplate.replace('{{title}}', pr.branchName)
                            .replace('{{ticket-id}}', pr.ticketID)
                            .replace('{{ticket-link}}', ATLASSIAN_URL + pr.ticketID)
                            .replace('{{branch-id}}', pr.branchID)
                            .replace('{{ticket-category}}', pr.ticketCategory);
    }

    function createMessage(branches) {
        var branchesAsRows = '',
            i,
            messageTemplate = "\
## Description:\n\
Release: **{{release-number}}**\n\
Date: {{date}}\n\
\n\
## Changes:\n\
| Title | Ticket | PR | Type |\n\
| --- | --- | --- | --- |\n\
{{branches}}";

        for (i = 0; i < branches.length; i++) {
            branchesAsRows += createPrRow(branches[i])
        }

        return messageTemplate.replace('{{date}}', getCurrentDate()).replace('{{branches}}', branchesAsRows);
    }

    function buildRelease() {
        var $commits = $('.js-details-container.commit'),
            branches = [];

        $commits.each(function(index) {
            var commitMessage = $.trim($(this).find('.commit-message').text().replace(/\s+/g,' '));
            if (commitMessage.search('Merge pull request') != -1) {
                var author = $(this).find('.commit-author.user-mention').text(),
                    branchID = $(this).find('.issue-link').text(),
                    branchName = $(this).find('.commit-desc pre').text().split("\n").pop();

                var i,
                    ticketID = '-',
                    ticketCategory = '-',
                    choppedCommitMessage = commitMessage.split('/');
                for (i = 0; i < choppedCommitMessage.length; i++) {
                    if (choppedCommitMessage[i].search('pt-') != -1) {
                        ticketID = choppedCommitMessage[i].toUpperCase();
                        ticketCategory = choppedCommitMessage[i - 1];
                        break;
                    }
                }

                branches.push({
                    author: author,
                    branchID: branchID,
                    branchName: branchName,
                    ticketID: ticketID,
                    ticketCategory: ticketCategory
                });
            }
        });

        $('.js-details-target').trigger('click').remove();
        $('#pull_request_title').val('Release');
        $('#pull_request_body').val(createMessage(branches));
        $('#new_pull_request').find('button[type="submit"]').prop('disabled', false);

        loadReleaseNumber();
    }

    function addReleaseButton() {
        if ($('.js-create_release_button').length) {
            return;
        }

        var $button = $('<a />', {
            class: 'btn btn-primary btn-outline float-right ml-2 js-create_release_button',
            text: "Create release",
            href: GITHUB_REPOSITORY_URL + '/compare/master...develop'
        });

        $('.subnav').prepend($button);
    }

    function init() {
        var location = window.location.href;
        var locationKey = location.split('/').pop();

        if (locationKey == 'pulls') {
            addReleaseButton();
        } else if (locationKey == 'master...develop') {
            buildRelease();
        }
    }

    $(document).ready(init);
    $(document).on('pjax:success', init);

})();