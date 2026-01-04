// ==UserScript==
// @name         DMM point expire sum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display the sum of your DMM points expiring in 1 month
// @author       Mo
// @match        https://payment.dmm.com/point/expire/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462863/DMM%20point%20expire%20sum.user.js
// @updateURL https://update.greasyfork.org/scripts/462863/DMM%20point%20expire%20sum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const totalPt = [...document.querySelectorAll("#main-history-deadline > div.area-sect > div.area-list > table.box-list.nearby tr")].slice(1).map(tr => Number(tr.querySelector("td:nth-child(3)").innerHTML.replace("pt",""))).reduce((acc,cur) => acc + cur);
    document.querySelector("#main-history-deadline > div.area-sect > div.area-list > div.capt02.warning").innerHTML += `: ${totalPt}`;
})();