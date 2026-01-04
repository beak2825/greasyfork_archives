// ==UserScript==
// @name         Discord Get Token
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        discordapp.com/channels/@me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390160/Discord%20Get%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/390160/Discord%20Get%20Token.meta.js
// ==/UserScript==

(function() {
    //let values = [];
    let old = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(header, value) {
        old.apply(this, arguments);
        if(header === "Authorization") {
            console.log(value);
        }
    }
})()