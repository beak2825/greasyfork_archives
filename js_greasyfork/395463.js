// ==UserScript==
// @name         Down with the space!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the space at the start of each line of a facebook description
// @author       You
// @match        https://www.facebook.com/events/488023698578094/488034638577000/?notif_t=admin_plan_mall_activity&notif_id=1579518623082858
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395463/Down%20with%20the%20space%21.user.js
// @updateURL https://update.greasyfork.org/scripts/395463/Down%20with%20the%20space%21.meta.js
// ==/UserScript==

(function() {
const element = document.querySelector('span[data-testid="event-permalink-details"]')

element.innerText = element.innerText.split('\n').map(s => s.trim()).join('\n')
})();