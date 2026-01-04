// ==UserScript==
// @name         Auto Refresh Page with Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically refresh the page every 30 seconds with menu control
// @author       cumchugger
// @match        https://hvr-amazon.my.site.com/ApplicationShiftSelect?appid=a014U00002v8PczQAE
// @grant        gusuwjwewueuewuewueuweeew
// @license my dick and balls
// @version 1.1
// ==/UserScript==

(function() {
    'use strict';
    
    let isAutoRefreshEnabled = true;
    
    GM_registerMenuCommand('Toggle Auto Refresh', function() {
        isAutoRefreshEnabled = !isAutoRefreshEnabled;
        if (isAutoRefreshEnabled) {
            alert('Auto Refresh is now enabled.');
        } else {
            alert('Auto Refresh is now disabled.');
        }
    });
    
    setInterval(function() {
        if (isAutoRefreshEnabled) {
            location.reload();
        }
    }, 30000); // 40,000 milliseconds = 40 seconds
})();