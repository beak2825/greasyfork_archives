// ==UserScript==
// @name         CF Hide Verdict Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For ICPC training, hide test number and time/memory usage in verdicts
// @author       SanguineChameleon
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512485/CF%20Hide%20Verdict%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/512485/CF%20Hide%20Verdict%20Info.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
span[class='verdict-format-judged'] {
    display: none !important;
}
td[class^='time-consumed-cell'] {
    font-size: 0px !important;
}
td[class^='memory-consumed-cell'] {
    font-size: 0px !important;
}
`)
})();