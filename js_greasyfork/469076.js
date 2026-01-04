
// ==UserScript==
// @name         Remove Reddit Over 18 Login Requirement Popup
// @description  Remove Reddit.com annoying Over 18 Login Requirement Popup
// @namespace    http://tampermonkey.net/
// @version      0.13
// @author       You
// @match        *://*.reddit.com/*
// @grant        GM_webRequest
// @webRequest   [{"selector":"*confirm-over-18*.js","action":"cancel"}]
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469076/Remove%20Reddit%20Over%2018%20Login%20Requirement%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/469076/Remove%20Reddit%20Over%2018%20Login%20Requirement%20Popup.meta.js
// ==/UserScript==

var currently_active_webrequest_rule = JSON.stringify(GM_info.script.webRequest); 

GM_webRequest([], function(info, message, details) {
    console.log(info, message, details);
});
