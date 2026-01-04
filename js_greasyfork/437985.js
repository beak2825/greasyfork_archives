// ==UserScript==
// @name         Klikacz
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  klika sobie
// @author       pts
// @match        https://idkids.onestock-retail.com/claim
// @icon         https://www.google.com/s2/favicons?domain=onestock-retail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437985/Klikacz.user.js
// @updateURL https://update.greasyfork.org/scripts/437985/Klikacz.meta.js
// ==/UserScript==

setInterval(() => {
    document.getElementsByClassName('icon-load')[0].click();
    if (document.getElementsByClassName('icon-check').length > 0) {
        setTimeout(() => document.getElementsByClassName('icon-check')[0].parentElement.parentElement.parentElement.parentElement.click(), 2000)
        console.log(new Date(),'złapane!')
    }
}, 10000)