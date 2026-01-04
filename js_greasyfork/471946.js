// ==UserScript==
// @name     Remove background highlighting of Noob-club backer comments
// @description     Disables the highlighting of backer comments on the Noob-club forum
// @version  20240323.1
// @license MIT
// @match    https://www.noob-club.ru/index.php?topic=*
// @namespace noob-club
// @downloadURL https://update.greasyfork.org/scripts/471946/Remove%20background%20highlighting%20of%20Noob-club%20backer%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/471946/Remove%20background%20highlighting%20of%20Noob-club%20backer%20comments.meta.js
// ==/UserScript==

let elements = document.querySelectorAll('div.i_am_backer');
elements.forEach((element) => {
    element.removeAttribute("style");
});