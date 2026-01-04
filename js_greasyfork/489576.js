// ==UserScript==
// @name         GitLab Merge Confirmation
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display confirmation dialog before merging in GitLab
// @author       Gracjan Młynarczyk
// @match        https://gitlab.divante.pl/tim/magento-2/magento2/-/merge_requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489576/GitLab%20Merge%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/489576/GitLab%20Merge%20Confirmation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function checkForMergeButton() {
        var mergeButton = $('button[data-qa-selector="merge_button"]');
        if (mergeButton.length > 0 && mergeButton.text().trim() === 'Merge') {
            var button = $('<button/>', {
                text: 'TIM Merge',
                click: function() {
                    var confirmation = confirm("Are you sure you want to merge this change?");
                    if (confirmation) {
                        mergeButton.click();
                    }
                }
            });

            button.addClass("btn accept-merge-request btn-confirm btn-md gl-button");
            mergeButton.parent().append(button);
            mergeButton.hide();
        } else {
            setTimeout(checkForMergeButton, 1000);
        }
    }
    checkForMergeButton();
})();