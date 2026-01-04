// ==UserScript==
// @name         Easier Dynamic Pickup Request
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1
// @description  try to take over the world!
// @match        http://64.113.255.18/softweb/(S(x4sozi45qaz4za55qatt25ec))/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369341/Easier%20Dynamic%20Pickup%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/369341/Easier%20Dynamic%20Pickup%20Request.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (location.href.indexOf('DispatchShow.aspx')>-1){
        setTimeout(function(){
            txtContact.value = "Zulma Cimino";
            txtExtension.value = "275";
            txtHoursClose.value = "15:30";
            txtComment.value="First come, first served. Closed for lunch 12-1";
        },500);
    }
})();