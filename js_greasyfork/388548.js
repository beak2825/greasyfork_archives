// ==UserScript==
// @name         GSC Wide Performance Report
// @namespace    https://greasyfork.org/en/users/326072-kuba-serafinowski
// @version      0.1
// @description  Make GSC performance report wider
// @author       Kuba Serafinowski
// @match        https://search.google.com/search-console*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388548/GSC%20Wide%20Performance%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/388548/GSC%20Wide%20Performance%20Report.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('[data-view-instance-id^="/search-console/performance/discover,/search-console/performance/search-analytics-V"] > c-wiz > div > div:nth-child(4) > div { max-width: fit-content; }');