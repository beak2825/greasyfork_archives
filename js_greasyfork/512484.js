// ==UserScript==
// @name         CF Hide Problem Info
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  For ICPC training, hide problem names and which teams solved which problems
// @author       SanguineChameleon
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512484/CF%20Hide%20Problem%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/512484/CF%20Hide%20Problem%20Info.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
a[title='Participants solved the problem'] {
    display: none !important;
}
a[title='Количество решивших задачу'] {
    display: none !important;
}
td[problemid] > span {
    visibility: hidden
}
img[class='standings-flag'] {
    display: none !important;
}
img[title='Ghost participant'] {
    display: none !important;
}
img[title='Участник-призрак'] {
    display: none !important;
}
td[class^='contestant'] {
    font-size: 0px !important;
}
td[class^='contestant'] > a {
    display: none !important;
}
td[class^='contestant'] > sup {
    display: none !important;
}
td[class^='contestant'] > span {
    display: none !important;
}
td[class^='time-consumed-cell'] {
    font-size: 0px !important;
}
td[class^='memory-consumed-cell'] {
    font-size: 0px !important;
}
span[class='cell-passed-system-test cell-accepted'] {
    display: none !important;
}
tr[class='standingsStatisticsRow'] {
    display: none !important;
}
table[class='problems'] > tbody > tr > td:not([class^='id']) > div {
    display: none !important;
}
`)
})();