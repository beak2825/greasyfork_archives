// ==UserScript==
// @name         ServiceNow - Hide quoted text from emails
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide quoted text from emails in Work Notes/Comments
// @author       You
// @match        https://*.service-now.com/change_request.do*
// @match        https://*.service-now.com/incident.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406293/ServiceNow%20-%20Hide%20quoted%20text%20from%20emails.user.js
// @updateURL https://update.greasyfork.org/scripts/406293/ServiceNow%20-%20Hide%20quoted%20text%20from%20emails.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.querySelectorAll('span.sn-widget-textblock-body.sn-widget-textblock-body_formatted'))
        .filter(emailComment => emailComment.innerText.startsWith('reply from'))
        .forEach(commentWithCrap => {
            let fromFoundIdx = commentWithCrap.outerHTML.search(/<br>(From|Van): /); // English/Dutch "From"
            if (fromFoundIdx < 0) return;
            commentWithCrap.outerHTML = commentWithCrap.outerHTML.slice(0, fromFoundIdx)+
                '</span><button class="btn btn-default icon-ellipsis" onclick="this.nextSibling.toggle(); return false"></button>'+
                '<span class=\"sn-widget-textblock-body sn-widget-textblock-body_formatted\" style="display: none">'+
                commentWithCrap.outerHTML.slice(fromFoundIdx);
        });
})();
