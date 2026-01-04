// ==UserScript==
// @name         Baidu Netdisk UA Switcher
// @namespace    https://greasyfork.org
// @version      1.2.3
// @description  Force User-Agent to pan.baidu.com for specific domains
// @author       Andy
// @match        *://resource.qblb.net/*
// @match        *://pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530864/Baidu%20Netdisk%20UA%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/530864/Baidu%20Netdisk%20UA%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

       const chromeUserAgent = "pan.baidu.com";
    
    // Change the user-agent for the current page
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return chromeUserAgent; }
    });
    
    

})();