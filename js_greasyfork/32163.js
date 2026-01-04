// ==UserScript==
// @name Cubecraft Alerts
// @namespace Landviz' script
// @grant none
// @match https://*.cubecraft.net/*
// @description Plays a sound when you get a notification on Cubecraft.net forums
// @version 0.0.1.20170810094544
// @downloadURL https://update.greasyfork.org/scripts/32163/Cubecraft%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/32163/Cubecraft%20Alerts.meta.js
// ==/UserScript==

var refreshTimer = 30;
var notification = new Audio('http://landviz.nl/other_stuff/notification.mp3');
var newAlerts = Number(document.querySelector('#VisitorExtraMenu_AlertsCounter span.Total').innerHTML);
var newConv = Number(document.querySelector('#VisitorExtraMenu_ConversationsCounter span.Total').innerHTML);
var notified;

if(sessionStorage.getItem('alerts') !== null) {
    if( newAlerts > sessionStorage.getItem('alerts') || newConv > sessionStorage.getItem('conv')) {
        notification.play();
    }
}

sessionStorage.setItem('alerts', newAlerts);
sessionStorage.setItem('conv', newConv);

setInterval(function() {
    if(!document.hasFocus()) {
        location.reload();
    }
}, refreshTimer*1000);