// ==UserScript==
// @name         Send Azure Intune directly to Endpoint
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  With Intune moving to endpoint, they now require you to click another link to be able to manage Intune devices. This will now take you directly to endpoint when clicking the link.
// @author       Joshua_WASD
// @match        https://*portal.azure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412702/Send%20Azure%20Intune%20directly%20to%20Endpoint.user.js
// @updateURL https://update.greasyfork.org/scripts/412702/Send%20Azure%20Intune%20directly%20to%20Endpoint.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        var reply_click = function()
        {
            document.location = "https://endpoint.microsoft.com/"
        }
        document.getElementById('_weave_e_52').onclick = reply_click;
    }, 3000);
})();