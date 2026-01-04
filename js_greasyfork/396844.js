// ==UserScript==
// @name        Clock sulla barra titolo figuccio
// @description clock ore minuti secondi millesimi sulla barra titolo
// @version     0.6
// @match          *://*/*
// @noframes
// @author      figuccio
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @icon        data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace https://greasyfork.org/users/237458
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/396844/Clock%20sulla%20barra%20titolo%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/396844/Clock%20sulla%20barra%20titolo%20figuccio.meta.js
// ==/UserScript==
var actualtitle=" "+document.title
function updateClock() {
var time = new Date().toLocaleTimeString();
var ms = new Date().getMilliseconds()

document.title =time+ ":" +ms+ " - "+ actualtitle;
}
setInterval(updateClock, 70);
(function titleMarquee() {
    'actual'.title = actualtitle = actualtitle.substring(1) +actualtitle .substring(0,1);
    setTimeout(titleMarquee, 200);
})();

