// ==UserScript==
// @name         Ghost Restock Monitor
// @description  Ghost restock machine go brr
// @version      1
// @match        ghostaio.com/
// @run-at       document-start
// @namespace https://greasyfork.org/users/530561
// @downloadURL https://update.greasyfork.org/scripts/401599/Ghost%20Restock%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/401599/Ghost%20Restock%20Monitor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        if (document.querySelector("#G_S_B").textContent.toLowerCase().includes('sold out')) {

            window.location.reload()
        }
        else {
            document.querySelector("#G_S_B").click()
        }
    }, 1500)

})();