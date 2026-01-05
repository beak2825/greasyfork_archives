// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         jemontre
// @version      0.01
// @description  Disable ad-popup on "jememontre" sites
// @include      /(https?:)?\/\/(www\.)?je(memontre|montre(messeins|mabite|mesfesses|monminou|malingerie|mespieds|mafellation|masextape|montorse|moncouple))\.com\/.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18434/jemontre.user.js
// @updateURL https://update.greasyfork.org/scripts/18434/jemontre.meta.js
// ==/UserScript==
//
function refjemontre(){return'www.jememontre.com'};
Object.defineProperty&&Object.defineProperty(document,'referrer',{get:refjemontre});
Object.prototype.__defineGetter__&&document.__defineGetter__('referrer',refjemontre);
