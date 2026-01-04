// ==UserScript==
// @name         Google Meet Autoswitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoswitch google accounts on google meet
// @author       You
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410002/Google%20Meet%20Autoswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/410002/Google%20Meet%20Autoswitch.meta.js
// ==/UserScript==

(function() {
    if (!window.location.href.includes("authuser=1")){ //autheruser=1 describes the account, if you have multiple acc's change this to whatever # your school acc is
        var newUrl = window.location.href + "?authuser=1";
        window.location.replace(newUrl);
    }
})();