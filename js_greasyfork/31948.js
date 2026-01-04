// ==UserScript==
// @name         LinkedIn - Hide Invite Contacts by Email
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  If you dont want to spam people not on LinkedIn by sending email invite to them.
// @author       Shuunen
// @match        https://www.linkedin.com/mynetwork/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31948/LinkedIn%20-%20Hide%20Invite%20Contacts%20by%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/31948/LinkedIn%20-%20Hide%20Invite%20Contacts%20by%20Email.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clean(){
        var els = document.querySelectorAll('.mn-person-info__guest-handle');
        for (var i = 0; i < els.length ; i++) {
            els[i].parentElement.parentElement.parentElement.parentElement.remove();
        }
    }

    setInterval(clean, 1000);

})();