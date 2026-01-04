// ==UserScript==
// @name        SB Forum List Old Order
// @namespace   https://greasyfork.org/en/users/13408-mistakenot
// @match       https://forums.spacebattles.com/
// @grant       none
// @version     0.1.2024-02-29
// @author      mistakenot
// @description Changes subforum list on SB frontpage back to old order with Fiction Discussion above Creative Writing.
// @license     Mozilla Public License, v. 2.0
// @downloadURL https://update.greasyfork.org/scripts/488591/SB%20Forum%20List%20Old%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/488591/SB%20Forum%20List%20Old%20Order.meta.js
// ==/UserScript==

$('.block--category28').insertBefore('.block--category32');