// ==UserScript==
// @name        Sophie Alert | Flight Rising
// @namespace   Flight Rising Scripts
// @include     https://www1.flightrising.com/trading/sophie/reduce*
// @include     https://www1.flightrising.com/trading/sophie/create*
// @grant       none
// @version     0.3
// @author      Mythbyte
// @description Sophie finish alert
// @icon        https://i.imgur.com/3X7dIDW.png
// @downloadURL https://update.greasyfork.org/scripts/538925/Sophie%20Alert%20%7C%20Flight%20Rising.user.js
// @updateURL https://update.greasyfork.org/scripts/538925/Sophie%20Alert%20%7C%20Flight%20Rising.meta.js
// ==/UserScript==
// wait until page load, then run main
$(document).ready(main);
// popup message
const notice = 'Done!';
// detecting complete button
function main(){
if ($('#crafter-status-claim').length > 0) {
window.alert(notice);
}
}