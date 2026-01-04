// ==UserScript==
// @name         Gats.io VIP Enabler
// @namespace    http://tampermonkey.net/
// @version      3.2.01
// @description  try to take over the world!
// @author       You
// @match        https://gats.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428943/Gatsio%20VIP%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/428943/Gatsio%20VIP%20Enabler.meta.js
// ==/UserScript==
//Updated so that ppl will stop bugging me about console errors
setInterval(() => {
    for(i in RD.pool[c3]) {
           RD.pool[c3].isPremiumMember = 1;
        }
},100);