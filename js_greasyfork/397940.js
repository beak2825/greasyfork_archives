// ==UserScript==
// @name         Hide Employees (as of 11.03.20)
// @namespace    Lone
// @version      1.0
// @description  Hides users that are part of a company.
// @author       Lone (not on Torn)
// @match        https://www.torn.com/userlist.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397940/Hide%20Employees%20%28as%20of%20110320%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397940/Hide%20Employees%20%28as%20of%20110320%29.meta.js
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
                         #icon27: Employed in company
                         #icon62: Idle
                         #icon71: Traveling
                         #icon73: Company director
                         #icon74: Faction Leader or Co-leader
                       Use commas(,) to hide multiple         */

                    if(addedNode.querySelector("[id*=icon27], [id*=icon73]")) addedNode.style.display = 'none';

                }
            }
        }
    }).observe(userListWrap, { childList: true });
})();