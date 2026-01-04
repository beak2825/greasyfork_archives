// ==UserScript==
// @name         Wanikani Forums: Latest page's new replies alert autoclick
// @namespace    Wanikani Forums: Latest page's new replies alert autoclick
// @version      0.1.2
// @description  Hides and automatically click the alert for new threads and replies on the "latest" page so that the threads just pop up.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38855/Wanikani%20Forums%3A%20Latest%20page%27s%20new%20replies%20alert%20autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/38855/Wanikani%20Forums%3A%20Latest%20page%27s%20new%20replies%20alert%20autoclick.meta.js
// ==/UserScript==

;(function ($, wfs) {
    $('head').append('<style id="AutoClickLatestAlert">.show-more.has-topics {display: none;}</style>')
    wfs.wait('.show-more.has-topics', (e) => {
        $('.show-more.has-topics .alert').click()
    })
})(window.jQuery, window.wfs)
