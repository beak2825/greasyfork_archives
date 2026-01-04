// ==UserScript==
// @name         export gantt chart on youtrack
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  YouTrack Gannt
// @author       You
// @match        https://YOUR_YOUTRACK_ADDRESS/gantt-charts/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/491341/export%20gantt%20chart%20on%20youtrack.user.js
// @updateURL https://update.greasyfork.org/scripts/491341/export%20gantt%20chart%20on%20youtrack.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
    console.log("deleted-left-side");
    document.querySelector('.membersListContainer_8b4').remove();
    console.log("deleted-top-area")
    document.querySelector('.app__header').remove();
    //console.log("deleted-information-area")
    //document.querySelector('.yt-page__block').remove();

    GM_addStyle ( `
    .chartContainer_1f9{
    min-height: 100vh;
    }
    .small_142 .contentText_b62 {
    max-width: 1000px;
    }
    .content_a90 {
    overflow: visible;
    }
    ` );
}, 3000);

})();