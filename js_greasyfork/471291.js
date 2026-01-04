// ==UserScript==
// @name         Sic 'Em 365 - Notification Hover
// @version      1.1
// @description  Show Notifications on hover
// @author       trumpetbear
// @match        https://sicem365.com/*
// @match        http://sicem365.com/*
// @grant        none
// @namespace https://greasyfork.org/users/66085
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471291/Sic%20%27Em%20365%20-%20Notification%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/471291/Sic%20%27Em%20365%20-%20Notification%20Hover.meta.js
// ==/UserScript==


$(document).ready(function() {
    'use strict';
    $($(".dashboard-item")[1]).hover(function() {
        $($(".dashboard-panel")[1]).show();
    }, function(){
        $($(".dashboard-panel")[1]).hide();
    });
});