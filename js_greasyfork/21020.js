// ==UserScript==
// @name         Facebook Notifications in sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Move the notifications to sidebar so you never have to click the shit out of the button again
// @author       Damien <damien@dam.io>
// @match        https://www.facebook.com/
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/21020/Facebook%20Notifications%20in%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/21020/Facebook%20Notifications%20in%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add notifs to sidebar
    var sidebar = document.getElementById('u_0_q');
    var notifDiv = document.getElementById('fbNotificationsFlyout');
    notifDiv.className = '_4-u2 _4-u8 _5v6e cardRightCol';
    notifDiv.style.padding = '4px 6px';
    sidebar.insertBefore(notifDiv, sidebar.firstChild);
    
    setInterval(() => {
        // fix width overflowing
        var scrollbody = sidebar.getElementsByClassName('uiScrollableAreaBody')[0];
        if (scrollbody) scrollbody.style['width'] = 'auto';
    }, 500);

    setTimeout(() => {
               // trigger the notification
               document.getElementById('fbNotificationsJewel').firstChild.click();
    }, 1000);
})();