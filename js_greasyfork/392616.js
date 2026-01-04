// ==UserScript==
// @name         Jobs - Limited (for high stat recruitment)
// @namespace    selits
// @version      1.1
// @description  Hides users that are part of a company or in federal jail
// @author       selits
// @match        https://www.torn.com/userlist.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/392616/Jobs%20-%20Limited%20%28for%20high%20stat%20recruitment%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392616/Jobs%20-%20Limited%20%28for%20high%20stat%20recruitment%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userListWrap = document.querySelector('.user-info-list-wrap');

    new MutationObserver(mutationList => {
        for(const mutationRecord of mutationList) {
            for(const addedNode of mutationRecord.addedNodes) {
                if(addedNode.tagName === 'LI' && !addedNode.className) {

                    /* You can hide any icon you want
                         #icon1 : Online
                         #icon2 : Offline
                         #icon3 : Donator
                         #icon4 : Subscriber
                         #icon8 : Married
                         #icon9 : In a Faction
                         #icon21 : Army
                         #icon22 : Casino
                         #icon23 : Hospital
                         #icon24 : Grocer
                         #icon25 : Law
                         #icon26 : Education
                         #icon27 : Employeed in company
                         #icon27: Employed in company
                         #icon62: Idle
                         #icon70 : Federal Jail
                         #icon71: Traveling
                         #icon73: Company director
                         #icon74: Faction Leader or Co-leader
                       Use commas(,) to hide multiple         */

                    if(addedNode.querySelector("#icon27, #icon70, #icon73")) addedNode.style.display = 'none';

                }
            }
        }
    }).observe(userListWrap, { childList: true });
})();