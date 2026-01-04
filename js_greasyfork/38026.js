// ==UserScript==
// @name         Penny-Arcade Forums Banned-Phrase Confirm
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.0
// @description  Ask for confirmation before posting banned phrases.
// @match        https://forums.penny-arcade.com/discussion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38026/Penny-Arcade%20Forums%20Banned-Phrase%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/38026/Penny-Arcade%20Forums%20Banned-Phrase%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('#Form_PostComment').click(checkForBannedPhrases);
    });

    function checkForBannedPhrases(event) {
        var forbidden = [];
        $('.MinionRule .icon-ban').each(function(i, rule) {
            var phrase = $(rule).closest('.MinionRule').text();
            var trimmed = phrase.trim();
            $(trimmed.split(' ')).each(function(ii, ruleWord) {
                if(ruleWord) {
                    forbidden.push(ruleWord);
                }
            });
        });

        var post = $('#Form_Body').val();
        var postWords = post.replace(/(\n)+/g, ' ').replace(/[,.]/g, '').split(' ');
        var hasBannedWord = false;
        var bannedWord = '';
        $(postWords).each(function(i, word) {
            if(forbidden.includes(word)) {
                hasBannedWord = true;
                bannedWord = word;
                return false;
            }
        });
        if(hasBannedWord) {
            var message = 'This post appears to contain one or more banned words, are you sure you want to post it?\n\nBanned word found: ' + bannedWord;
            var conf = confirm(message);
            return conf;
        }
        else {
            return true;
        }
    }
})();