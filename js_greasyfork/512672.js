// ==UserScript==
// @name         CF Hide Standings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For ICPC training, hide contest status and standings
// @author       SanguineChameleon
// @match        https://codeforces.com/*/standings*
// @match        https://codeforces.com/*/status*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512672/CF%20Hide%20Standings.user.js
// @updateURL https://update.greasyfork.org/scripts/512672/CF%20Hide%20Standings.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
a[title='Participants solved the problem'] {
    display: none !important;
}
a[title='Количество решивших задачу'] {
    display: none !important;
}
table[class='standings'] {
    display: none !important;
}
table[class='status-frame-datatable'] {
    display: none !important;
}
`)
})();