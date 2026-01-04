// ==UserScript==
// @name         Test1
// @description  Anti bot test
// @namespace    http://pendoria.net/
// @version      0.0.5
// @author       Anders Morgan Larsen (Xortrox)
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375463/Test1.user.js
// @updateURL https://update.greasyfork.org/scripts/375463/Test1.meta.js
// ==/UserScript==

$(document).ready(() => {
setTimeout(() => {
console.log('random 5 sec click');
$('.progress-status').click()
}, 4500 + Math.random()*500);

});