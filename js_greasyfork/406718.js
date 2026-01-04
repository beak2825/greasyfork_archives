// ==UserScript==
// @name         Jira Scrolling Conflict Resolver
// @namespace    http://alekseykarpenko.com
// @version      1.0.0
// @description  Resolve the conflict between scrolling and swipe back on Jira Addons
// @author       Aleksey Karpenko <contact@alekseykarpenko.com>
// @match        https://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406718/Jira%20Scrolling%20Conflict%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/406718/Jira%20Scrolling%20Conflict%20Resolver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.getElementsByTagName("body")[0].style.overscrollBehaviorX = "none";
})();