// ==UserScript==
// @name         L Vantaff
// @namespace    https://py9.dev/
// @version      2025-02-02
// @description  Gives vantaff a loser badge in Twitch chat
// @author       Py9
// @match        https://www.twitch.tv/natemglive
// @icon         https://py9.dev/LoserBadgeSq.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525613/L%20Vantaff.user.js
// @updateURL https://update.greasyfork.org/scripts/525613/L%20Vantaff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLoserBadge() {
        document.querySelectorAll('[data-a-user="vantaff"]').forEach(element => {
            if (!element.querySelector('.loser-badge')) {
                const badge = document.createElement('img');
                badge.src = 'https://py9.dev/LoserBadgeSq.png';
                badge.alt = 'Loser';
                badge.className = 'loser-badge';
                badge.style.height = '1.3em';
                badge.style.marginRight = '4px';
                badge.style.verticalAlign = 'middle';

                const usernameElement = element.querySelector('.chat-author__display-name');
                if (usernameElement) {
                    usernameElement.prepend(badge);
                }
            }
        });
    }

    setInterval(addLoserBadge, 100);
})();
