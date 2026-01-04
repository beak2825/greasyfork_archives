// ==UserScript==
// @name         Evernote direct link access
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       lvcn
// @match        https://www.evernote.com/OutboundRedirect.action*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @description  Evernote链接直接跳转

// @downloadURL https://update.greasyfork.org/scripts/382786/Evernote%20direct%20link%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/382786/Evernote%20direct%20link%20access.meta.js
// ==/UserScript==

(function() {
    var url = (location.href).substr(54);
    var result = decodeURIComponent(url);
    window.location.href = result;
})();