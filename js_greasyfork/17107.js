// ==UserScript==
// @name         Travian Desktop Notifications
// @namespace    
// @version      0.1
// @description  Uriel@Shammyfox (CWL)
// @grant        none

// @include     http://*.travian.*
// @include      http://*/*.travian.*
// @exclude     http://*.travian*.*/hilfe.php*
// @exclude     http://*.travian*.*/log*.php*
// @exclude     http://*.travian*.*/index.php*
// @exclude     http://*.travian*.*/anleitung.php*
// @exclude     http://*.travian*.*/impressum.php*
// @exclude     http://*.travian*.*/anmelden.php*
// @exclude     http://*.travian*.*/gutscheine.php*
// @exclude     http://*.travian*.*/spielregeln.php*
// @exclude     http://*.travian*.*/links.php*
// @exclude     http://*.travian*.*/geschichte.php*
// @exclude     http://*.travian*.*/tutorial.php*
// @exclude     http://*.travian*.*/manual.php*
// @exclude     http://*.travian*.*/ajax.php*
// @exclude     http://*.travian*.*/ad/*
// @exclude     http://*.travian*.*/chat/*
// @exclude     http://forum.travian*.*
// @exclude     http://board.travian*.*
// @exclude     http://shop.travian*.*
// @exclude     http://*.travian*.*/activate.php*
// @exclude     http://*.travian*.*/support.php*
// @exclude     http://help.travian*.*
// @exclude     http://*.answers.travian*.*
// @exclude     *.css
// @exclude     *.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_notification
// @grant Notifications
// @downloadURL https://update.greasyfork.org/scripts/17107/Travian%20Desktop%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/17107/Travian%20Desktop%20Notifications.meta.js
// ==/UserScript==
/* jshint -W097 */

// Your code here...
setInterval(countdown, 1000);

var village = document.getElementById('villageNameField').innerText;
var timerdone= '00:00:01';
//Request Permissions for the Notifications
Notification.requestPermission();



function countdown() {
  
var timer = document.getElementById('timer1').innerText;
var hms = timer;   // your input string
var a = hms.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 


if (seconds === 0) {
var notificationTitle = ('Building Complete');
            var details = {
                body: village + 'Test',
                icon: 'http://blog.travian.com/wp-content/uploads/2015/07/t4_legends_logo_black.png'
            } 
new Notification(notificationTitle, details);
}
}
