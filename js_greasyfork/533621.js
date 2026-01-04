// ==UserScript==
// @name         Display Faction ID
// @namespace    heartflower.torn
// @version      1.1.1
// @description  Display faction ID in faction page title
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533621/Display%20Faction%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/533621/Display%20Faction%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findYourFactionId() {
        let forumThread = document.body.querySelector('.forum-thread');
        if (!forumThread) {
            setTimeout(findYourFactionId, 100);
            return;
        }

        let href = forumThread.getAttribute('href');
        let factionId = href.replace('/forums.php#!p=forums&f=999&b=1&a=','');

        displayFactionId(factionId);
    }

    function findOtherFactionId() {
        let factionId;

        if (window.location.href.includes('profile&ID=')) {
            factionId = window.location.href.replace('https://www.torn.com/factions.php?step=profile&ID=', '');
            factionId = factionId.split('&')[0];
        } else {
            let viewWars = document.body.querySelector('.view-wars');
            if (!viewWars) {
                setTimeout(findOtherFactionId, 100);
                return;
            }

            let href = viewWars.getAttribute('href');
            factionId = href.replace('/page.php?sid=factionWarfare#/ranked/','');
        }

        displayFactionId(factionId);
    }

    function displayFactionId(factionId) {
        let title = document.getElementById('skip-to-content');
        if (!title) {
            setTimeout(() => displayFactionId(factionId), 100);
            return;
        }

        let currentText = title.textContent;
        title.textContent = currentText += ` [${factionId.trim()}]`;
    }

    if (window.location.href.includes('your')) {
        findYourFactionId();
    } else {
        findOtherFactionId();
    }
})();