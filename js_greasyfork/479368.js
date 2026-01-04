// ==UserScript==
// @name         CB Transaction Modifier
// @name:en-US   CB
// @version      1.0.1
// @description        Modify CB Transactions
// @author       daddyh
// @match        https://*.chaturbate.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @namespace https://greasyfork.org/users/1214024
// @downloadURL https://update.greasyfork.org/scripts/479368/CB%20Transaction%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/479368/CB%20Transaction%20Modifier.meta.js
// ==/UserScript==

(() => {
setInterval(() => {
let table = document.querySelector('.tokenStatsTable');
document.querySelectorAll('td', table).forEach(el => {
    let text = el.textContent;
    if(/spy|purchase|outbound/ig.test(text)){
        el.parentElement.remove()
    }
});
}, 100);

})()