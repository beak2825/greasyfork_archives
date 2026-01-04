// ==UserScript==
// @name         Warn/Prevent Back button for Synology DSM
// @version      1.5
// @grant        none
// @match        *://192.168.1.106:5001/*
// @description  Warns user before going back when browsing on your Synology DSM NAS
// @namespace    https://greasyfork.org/users/1476593
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537716/WarnPrevent%20Back%20button%20for%20Synology%20DSM.user.js
// @updateURL https://update.greasyfork.org/scripts/537716/WarnPrevent%20Back%20button%20for%20Synology%20DSM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Push a dummy state to capture back button
    window.addEventListener('load', function() {
        history.pushState({page: 1}, '', '');
    });
    
    // Capture popstate (back/forward)
    window.addEventListener('popstate', function(e) {
        if (confirm('Are you sure you want to leave this page?')) {
            // User confirmed - allow navigation
            history.go(-1);
        } else {
            // User cancelled - stay here
            history.pushState({page: 1}, '', '');
        }
    });
    
    // Block other navigation methods
    window.onbeforeunload = function() {
        return 'Are you sure you want to leave?';
    };
    
})();