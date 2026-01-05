// ==UserScript==
// @name        Outlook MailChecker
// @namespace   Outlook
// @description Checks for new mails arriving in owa and provides a desktop notification
// @include     https://outlook.office.com/owa*
// @author      Cladius Fernando
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12445/Outlook%20MailChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/12445/Outlook%20MailChecker.meta.js
// ==/UserScript==

//Obtaining the div which contains all the mail previews (Under "Inbox")
var mailsDiv = document.querySelectorAll("[autoid=_xlv_e]")[0];
var lastMailId = mailsDiv.children[1].id;
var lastUnreadMailId = null;

//Set this to false if you want to turn off logging.
var isLoggingRequired = false;

function checkMail(){
	log("Inside checkMail method.");
	var index = 1;
	var maxTries = 0;
	
	var startPoint = getNextMail(index);
	
	while(startPoint === null && maxTries < 20){
		startPoint = getNextMail(index++);
		maxTries++;
	}
	log("startPoint set to : " + startPoint.id);
	
	/*
	 * There is no need to show alert to the user when no mail items are detected.
	 */ 
	if(startPoint === null){
		log("Returning as startPoint is null i.e. no mail items found in inbox");
		return;
	}
	
	/*
	 * There is no need to show alert to the user when he has just loaded the page for the first time.
	 */ 
	if(startPoint.id === lastMailId){		
		log("Returning as startPoint id matches with last mail id.");
		return;
	}
	
	/*
	 * There is no need to show multiple alerts to the user for the same mail.
	 */ 
	if(startPoint.id === lastUnreadMailId){
		log("Returning as startPoint id matches with last unread mail id.");
		return;
	}
	
	var nextMail = startPoint;
	log("Setting nextMail to : " + nextMail.id);
	
	if(isUnreadMail(nextMail)){
		log("New mail: " + nextMail.id);
		var mailDetails = nextMail.children[0].getAttribute("aria-label");
		mailDetails = mailDetails.split(",");
		var options = {      
			body: mailDetails[1] + " : " + mailDetails[2],
			sticky: true
		};
		notify("New Mail", options);
		lastUnreadMailId = nextMail.id;
	}else{
		log("No unread mail found.");
	}
}

function isUnreadMail(mailItem){
	return mailItem.children[0].getAttribute("aria-label").startsWith("1 Unread");
}

function getNextMail(index){
	var nextMail = mailsDiv.children[index];
	log("NextMail id found as: " + nextMail.id);
	if(nextMail.id == ""){
		return null;
	}
	return nextMail;
}

function notify(title, options) {
    log("Triggering notification.");
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}
	// Let's check if the user is okay to get some notification
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification(title, options);
	}
	// Otherwise, we need to ask the user for permission
	// Note, Chrome does not implement the permission static property
	// So we have to check for NOT 'denied' instead of 'default'
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			// If the user is okay, let's create a notification
			if (permission === "granted") {
				var notification = new Notification(title, options);
			}
		});
	}
}

setInterval(checkMail, 5000);

function log(message){
	if(isLoggingRequired){
		console.log(message);
	}
}
