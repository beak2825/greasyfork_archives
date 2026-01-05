// ==UserScript==
// @name         Slackbot #unlock Filter
// @namespace    
// @version      0.52
// @description  filter unlocked and locked requests
// @author       bmtg
// @include	     https://usaregions.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17308/Slackbot%20unlock%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/17308/Slackbot%20unlock%20Filter.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';




function filterGo() {
	
	
	
	
	/*
	if ( $('#header').length > 0 ) {
		// Check if SBF icon is loaded
		if ( notLoaded ) {
			
		} 
		
		
		
	}
	*/
	
	
	// Filter messages
	var msgContainer = document.querySelector('#msgs_div');
	var msgContDays = msgContainer.children, msgContDivs, msgContChildren;
	//var messageID;
	var emojiUnlocked = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:57.5% 17.5%' ;
	var emojiLocked = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:57.5% 15%' ;
	var emojiRedX = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:10% 5%';
	var emojiRepeat = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:55% 75%';
	var emojiClosure = 'emoji.slack-edge.com/T0E3RNYVC/closure/81f91978f8c09488.png';
	var emojiGreenCheck = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:7.5% 12.5%';
	var emojiThumbsDown = 'emoji_2015_2/sheet_apple_64_indexed_256colors.png);background-position:37.5% 35%';
	console.log('SBF: Clearing entries');
	var removedMessageIDs = [], unhiddenMessageIDs = [];
	for (var kk=0; kk<msgContDays.length; kk++) {
		msgContDivs = msgContDays[kk].children;
		for (var kkk=0; kkk<msgContDivs.length; kkk++) {
			msgContChildren = msgContDivs[kkk].children;
			for (var iii=0; iii<msgContChildren.length; iii++) {
				if (msgContChildren[iii].className.indexOf('message')>-1) {
					//messageID = msgContChildren[iii].id;
					if ( msgContChildren[iii].innerHTML.indexOf(emojiLocked) > -1 ) {
						removedMessageIDs.push(msgContChildren[iii].id);
					} else if ( msgContChildren[iii].innerHTML.indexOf(emojiGreenCheck) === -1 && msgContChildren[iii].innerHTML.indexOf(emojiUnlocked) > -1 ) {
						removedMessageIDs.push(msgContChildren[iii].id);
					} else {
						unhiddenMessageIDs.push(msgContChildren[iii].id);
					}
				}
			}
		}
	}
	for (var mmm=removedMessageIDs.length-1; mmm>-1; mmm--) {
		$("#"+removedMessageIDs[mmm]).hide();
	}
	for ( mmm=unhiddenMessageIDs.length-1; mmm>-1; mmm--) {
		$("#"+unhiddenMessageIDs[mmm]).show();
	}
	setTimeout(filterGo, 3000);
}

setTimeout(filterGo, 3000);
