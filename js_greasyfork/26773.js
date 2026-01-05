// ==UserScript==
// @name         Taigachat Notifier
// @namespace    Terrium.net
// @version      1.2.2
// @description  Alerts you when your name is mentioned
// @author       Lamp
// @include      http://terrium.net/index.php?taigachat/
// @include      http://terrium.net/index.php?taigachat/popup
// @include      http://terrium.net/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26773/Taigachat%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/26773/Taigachat%20Notifier.meta.js
// ==/UserScript==

// ==Settings==
var yourName = "Potato"; // Your name or the text that will trigger the notification (not case-sensitive)
var changeFaviconEnabled = true; // Enable/disable changing the favicon when notifying
var soundEnabled = true; // Enable/disable playing sound when notifying
var PushNotificationEnabled = true; // Enable/disable sending push/desktop/browser notification when notifying
var modifyRefreshRateEnabled = false; // Enable/disable modifying the chat refresh rate for faster response and greater reliability
var customRefreshRate = 1; // The new refresh rate to use when modifying refresh rate is enabled; Time in seconds between chat refreshes
var soundFileURL = "http://a.pomf.cat/sqlnkb.mp3"; // URL to notification sound file
var alertFaviconURL = "http://a.pomf.cat/rlnuys.ICO"; // URL to notification favicon file
// ============

var msg;
var isNotified = false;
var sound = new Audio(soundFileURL);
if(PushNotificationEnabled) checkNotification();
if(modifyRefreshRateEnabled) {setTimeout(function () {taigachat.refreshtime = customRefreshRate;
													  taigachat.focusedRefreshTime = customRefreshRate;
													  taigachat.unfocusedRefreshTime = customRefreshRate;
													  taigachat.tabUnfocusedRefreshTime = customRefreshRate;
													 },1000);}
window.onblur = denotify;

setInterval(function() {
	msg = $(".taigachat_messagetext").last()[0].innerText;
	if (msg.toLowerCase().includes(yourName.toLowerCase())) notify();
}, 1000);

function notify() {
	if (!isNotified) {
		if (changeFaviconEnabled) changeFavicon(alertFaviconURL);
		if (soundEnabled) sound.play();
		if (PushNotificationEnabled) {var idk = new Notification('“'+msg+'”');}
	}
	isNotified = true;
}

function denotify() {
	if (isNotified) {
		if (changeFaviconEnabled) changeFavicon('/favicon.ico');
		isNotified = false;
	}
}

// http://stackoverflow.com/a/2995536
document.head = document.head || document.getElementsByTagName('head')[0];
function changeFavicon(src) {
	var link = document.createElement('link'),
		oldLink = document.getElementById('dynamic-favicon');
	link.id = 'dynamic-favicon';
	link.rel = 'shortcut icon';
	link.href = src;
	if (oldLink) {
		document.head.removeChild(oldLink);
	}
	document.head.appendChild(link);
}

// derived from https://jsfiddle.net/3sdr9Lqj/2/
function checkNotification() {
	if (!("Notification" in window)) {
		alert("This browser does not support push notifications.");
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function(permission) {
			if (!('permission' in Notification)) {
				Notification.permission = permission;
			}

		});
	}
}