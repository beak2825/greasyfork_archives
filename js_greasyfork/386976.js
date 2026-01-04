// ==UserScript==
// @name         Lichess game chat: Block messages from selected users
// @description  Block the messages from selected users in the Lichess game chat
// @namespace    http://tampermonkey.net/
// @version      1
// @license      FSF Unlimited License
// @match        https://lichess.org/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/386976/Lichess%20game%20chat%3A%20Block%20messages%20from%20selected%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/386976/Lichess%20game%20chat%3A%20Block%20messages%20from%20selected%20users.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    window.jQuery.noConflict();
    window.jQuery(document).ready(function($) {

        // Add nasty users here, separate them by whitespaces or linebreaks.
        // You may have to reload the page in order for changes to become effective.

        let nastyUsers = `NASTY_USER AnotherNastyUser etc`;


        // Cleanup and prepare the nastyUsers array
        nastyUsers = nastyUsers.trim().split(/\s+/);
        nastyUsers.forEach((user, index, users) => {
            users[index] = '/@/' + user;
        });

        // Every second remove chat messages of users in the nastyUsers list
        setInterval(() => {
            let messages = $(`ol.mchat__messages > li`).has(`a.user-link`);
            messages.each(function() {
                nastyUsers.forEach((user) => {
                    if ($(`a.user-link`, this).attr('href') === user) {
                        $(this).remove();
                        return false;
                    }
                });
            });

        }, 1000);

    });
})();
