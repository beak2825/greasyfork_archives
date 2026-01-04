// ==UserScript==
// @name         Reload outlook.office.com/mail
// @namespace    https://outlook.office.com/mail/
// @version      0.1
// @description  Reload outlook.office.com/mail To Keep Session Alive
// @author       angelo.ndira@gmail.com
// @match        https://outlook.office.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cognizant.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/478820/Reload%20outlookofficecommail.user.js
// @updateURL https://update.greasyfork.org/scripts/478820/Reload%20outlookofficecommail.meta.js
// ==/UserScript==
var pageReloadInterval = 120000;
function start() {
    'use strict';
    window.location.reload(false);
}
(function () {
    'use strict';
    console.log("document loaded(). Reload outlook.office.com/mail To Keep Session Alive. Reload will start in 120 seconds");
    setTimeout(start, pageReloadInterval);
})();