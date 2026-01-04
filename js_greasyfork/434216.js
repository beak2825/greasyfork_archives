// ==UserScript==
// @name     Youtube Subs full width
// @namespace    https://tribbe.de
// @version      1.0.0
// @description  Makes the subs full width
// @author       Tribbe
// @include  https://www.youtube.com/feed/subscriptions
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/434216/Youtube%20Subs%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/434216/Youtube%20Subs%20full%20width.meta.js
// ==/UserScript==

GM_addStyle ( `
    html:not(.style-scope) {
        --ytd-grid-max-width: 95% !important;
        --ytd-grid-6-columns-width: 100% !important;
    }
` );