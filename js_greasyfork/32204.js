// ==UserScript==
// @name Amazon Requester Inc. - A9 Data Validation - Shoes - 0.01
// @description I'm so fancy.
// @version 1.1
// @author DCI
// @namespace www.redpandanetework.org
// @icon http://i.imgur.com/ZITD8b1.jpg
// @include https://s3.amazonaws.com/*AmazonRequesterInc.-A9DataValidationShoes*
// @require http://code.jquery.com/jquery-latest.min.js
// @groupId 3EJ1F91AOT34G27MQ8LYEURKXZGZIQ
// @auto_approve 20 days
// @timer 3 minutes
// @quals Blocked has not been granted ; Category Validation Qualification is 10; Location is US; Adult Content Qualification is 1
// @frameurl https://s3.amazonaws.com/mturk_bulk/hits/265193272/lx2UFoDbeD4wIP1QOTYboA.html?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3XUSYT70ITNP16NZCUXL6GNY3GAD0P&AmazonRequesterInc.-A9DataValidationShoes(WARNING:ThisHITmaycontainadultcontent.Workerdiscretionisadvised.)0.01
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32204/Amazon%20Requester%20Inc%20-%20A9%20Data%20Validation%20-%20Shoes%20-%20001.user.js
// @updateURL https://update.greasyfork.org/scripts/32204/Amazon%20Requester%20Inc%20-%20A9%20Data%20Validation%20-%20Shoes%20-%20001.meta.js
// ==/UserScript==

if (~document.body.innerHTML.indexOf("If there is something wrong with the Left Image")){
	document.addEventListener( "keydown", function(e){
		if ( e.keyCode == 65 ) { //A
			document.querySelectorAll("input[type='radio']")[5].click();
			document.getElementById('submitButton').click();
			GM_setClipboard("switch tab");
		}
		if ( e.keyCode == 83 ) { //S
			document.querySelectorAll("input[type='radio']")[6].click();
			document.getElementById('submitButton').click();
			GM_setClipboard("switch tab");
		}
		if ( e.keyCode == 68 ) { //D
			document.querySelectorAll("input[type='radio']")[7].click();
			document.getElementById('submitButton').click();
			GM_setClipboard("switch tab");
		}
		if ( e.keyCode == 70 ) { //F
			document.querySelectorAll("input[type='radio']")[8].click();
			document.getElementById('submitButton').click();
			GM_setClipboard("switch tab");
		}
		if ( e.keyCode == 71 ) { //G
			document.querySelectorAll("input[type='radio']")[9].click();
			document.getElementById('submitButton').click();
			GM_setClipboard("switch tab");
		}
	});	
}