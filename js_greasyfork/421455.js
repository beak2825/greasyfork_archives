// ==UserScript==
// @name         Keep Skatteverket-session alive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent Skatteverket from automatically logging out after 30 minutes of inactivity
// @author       Oscar Jonsson
// @match        https://sso.skatteverket.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421455/Keep%20Skatteverket-session%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/421455/Keep%20Skatteverket-session%20alive.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (window == window.parent) {//not inside iframe
        var iframe=document.createElement("iframe");
        document.body.prepend(iframe);
        setInterval(keepAwake,1500000);//run every 25 minutes
        iframe.style.display="none";
    }

    function keepAwake() {
        console.log("keepawake!");
        iframe.src="https://sso.skatteverket.se/ms/ms_web/page.do";
    }
})();