// ==UserScript==
// @name         Escalation QV login
// @namespace    http://tampermonkey.net/
// @version      1.0.0.0
// @description  connects to QV each day
// @author       Tuval
// @match        https://login.external.hp.com/idp/*/resumeSAML20/idp/startSSO.ping?pfidpadapterid=ad..email
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/28554/Escalation%20QV%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/28554/Escalation%20QV%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#username').val("roi.shriki@hp.com");
    $('#password').val("Tamar2912");
    $('.submit-row').children("input").click();
})();