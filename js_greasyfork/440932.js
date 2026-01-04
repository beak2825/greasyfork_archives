// ==UserScript==
// @name Pendoria - EnableTP
// @namespace http://pendoria.net/
// @version 1.2.0
// @author Kidel
// @contributor Saya
// @contributor Puls3
// @contributor Xortrox
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @icon https://pendoria.net/images/favicon.ico
// @grant none
// @run-at document-start
// @description Adds the TP reward command when double-clicking usernames from rolls
// @downloadURL https://update.greasyfork.org/scripts/440932/Pendoria%20-%20EnableTP.user.js
// @updateURL https://update.greasyfork.org/scripts/440932/Pendoria%20-%20EnableTP.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", () => {

	const moduleName = 'Pendoria - EnableTP';
	const version = '1.2.0';
	console.log(`[${moduleName} v${version}] Initialized.`);

  //Ty Saya!
  $("#chat-messages > ul").on('DOMSubtreeModified', function(){
      const length = $("#chat-messages > ul > li").length;
      if (length >= 0) {
        $.setTP(length);
      }
  });

  $.setTP = function(messageNr){
    const rollMessage = $("#chat-messages > ul > li:nth-child(" +  messageNr + ") > a > span");
    const rpsMessage = $("#chat-messages > ul > li:nth-child(" +  messageNr + ") > span > a > span");
    const coinflipMessage = $("#chat-messages > ul > li:nth-child(" +  messageNr + ") > span > a > span"); /* Don't ask me why I did this twice, I'm about to fall asleep */
    const rollMessageHasClass = rollMessage.hasClass("activity-log-username");
    const rpsMessageHasClass = rpsMessage.hasClass("activity-log-username");
    const coinflipMessageHasClass = coinflipMessage.hasClass("activity-log-username");
    if (rollMessageHasClass != false) {
      rollMessage.dblclick(function(event) {
		    $('*[placeholder="Write something awesome..."]').val("/addtp " + event.target.innerHTML);
		    $('*[placeholder="Write something awesome..."]').focus();
		  });
      console.log(`[${moduleName} v${version}] TP Updated.`);
    }
    else if (rpsMessageHasClass != false) {
      rpsMessage.dblclick(function(event) {
		    $('*[placeholder="Write something awesome..."]').val("/addtp " + event.target.innerHTML);
		    $('*[placeholder="Write something awesome..."]').focus();
		  });
      console.log(`[${moduleName} v${version}] TP Updated.`);
    }
    else if (coinflipMessageHasClass != false) {
      coinflipMessage.dblclick(function(event) {
		    $('*[placeholder="Write something awesome..."]').val("/addtp " + event.target.innerHTML);
		    $('*[placeholder="Write something awesome..."]').focus();
		  });
      console.log(`[${moduleName} v${version}] TP Updated.`);
    }
  }

});