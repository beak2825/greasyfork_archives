// ==UserScript==
// @name         Quicker Backloggd log
// @namespace    NormalDream
// @version      0.1
// @description  Replaces the Backlog button with the Edit Log button when you are on your own profile.
// @author       Normal Dream
// @copyright    2023 Normal Dream
// @license      MIT
// @match        https://www.backloggd.com/*
// @icon         https://www.backloggd.com/favicon.ico
// @grant        none
// @run-at       document-start
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/477710/Quicker%20Backloggd%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/477710/Quicker%20Backloggd%20log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runScript() {
        var profileAddress = "";
        $("a:contains('Profile')").filter(function() { return $(this).text() === "Profile"; }).each(function() { profileAddress = this.href; })

        if (window.location.href.startsWith(profileAddress)) {
            $('.quick-access-bar').each(function() {
                //var game_id = this.getAttribute('game_id');

                var container = this.getElementsByClassName('backlog-btn-container')[0];
                container.classList.remove('backlog-btn-container');
                container.removeAttribute('id');

                var button = container.getElementsByTagName('button')[0];
                button.classList.replace('mx-auto', 'quick-journal');
                button.dataset.tippyContent = "Edit Log";

                var icon = button.getElementsByTagName('i')[0];
                icon.classList.replace('fa-books', 'fa-book-open');

                button.replaceWith(button.cloneNode(true));
            });

            onmount();
        }
    }

    // Backloggd uses turbolinks, so the script is only called when the first page
    // is loaded. We use events to call it whenever we change page.
    document.addEventListener('turbolinks:load', function() {
        runScript();
    });
    document.addEventListener('load', function() {
        runScript();
    });
})();