// ==UserScript==
// @name         Snowball Fight User Shop Link
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  Adds a link to the target's shop so you can quickly check if they're one of the event price gougers to aid your decision to throw snowballs or not.
// @author       Twiggies
// @match        https://www.grundos.cafe/winter/snowball_fight/teams/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482419/Snowball%20Fight%20User%20Shop%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/482419/Snowball%20Fight%20User%20Shop%20Link.meta.js
// ==/UserScript==

const targetList = document.querySelectorAll('a[onclick*="window.open(\"');

for (let i = 0; i < targetList.length; i++) {
    if (i == targetList.length-1) {
        targetList[i].parentElement.insertAdjacentHTML('beforeend',`<a href="https://www.grundos.cafe/market/browseshop/?owner=${targetList[i].innerText}" target="_blank"> User Shop</a>`);
    }
    else {
        targetList[i].nextElementSibling.insertAdjacentHTML('beforebegin',`<a href="https://www.grundos.cafe/market/browseshop/?owner=${targetList[i].innerText}" target="_blank"> User Shop</a>`);
    }
}
