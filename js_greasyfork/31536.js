// ==UserScript==
// @name         Bible.com enhance Dev
// @namespace    EPS Developments
// @version      0.0.2
// @description  Add functionality to Bible.com
// @author       Edward Sluder
// @match        https://www.bible.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31536/Biblecom%20enhance%20Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/31536/Biblecom%20enhance%20Dev.meta.js
// ==/UserScript==

/*///////////////////////////////////////////////////////
////////////////// Description //////////////////////////
	*auto-play audio
	*control playbackRate
	*ui changes

///////////////////////////////////////////////////////*/





(function() {

	'use strict';

	/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//////////////////// Functions ////////////////////////*/


	// Check if <audio> has loaded yet.
	function checkAudioExists() {

		var audio = document.querySelector( 'audio' );
		console.log( `<audio>: /n ${audio}` );

		if( audio ) {
			audioReady(audio);
			refHeadingObserver(audio);
		}
		else {		
			console.log( "No audio on this page" );	
			audioObserver();
			
		}

	}

	// Called when <audio> is ready.
	function audioReady(audio) {

		console.log( `audio ready called` );
		audio.playbackRate = 2.0;
		audio.play();

		// Called when audio finishes playing.  Look to advance
		// to the next chapter if reading a plan.
		audio.addEventListener("ended", function() {

			console.log(`audio ended`);
			var nextArrow = $( '#react-app > div > div > div.plan-nav > div.reader-arrows > div.next-arrow > a > div' );

			if ( nextArrow ) {
				console.log('clicking next arrow');
				nextArrow.click();
			}
			else {
				console.log('no nextArrow');
			}

		});



		

	}
	
	function refHeadingObserver() {
		
		// We will observe the <div.ref-heading> element for changes.  Its changes
		// occur as a new chapter is loaded into the DOM and corresponds to the
		// <audio> element getting new <source> data.
		console.log("setting up refHeadingObserver");	
		
		var observer = new MutationObserver(function(mutations) {
			
			console.log('refHeadingObserver mutation occurred');
			
			checkAudioExists();
			
		});

		var target = document.querySelector( "div.ref-heading" );
		observer.observe( target, { childList: true, subtree: true });	
	
	}
	
	function audioObserver() {
	
		// We will observe the <div#react-app> element for changes.  This element
		// is the main body of the page that is manipulated via xhr.
		console.log("setting up auidoObserver");	
		
		var audioObserver = new MutationObserver(function(mutations) {
			
			console.log('document mutation occurred');
			
			var audio = document.querySelector( 'audio' );
			
			if( audio ) {
				audioReady(audio);
				audioObserver.disconnect();
			}	
			else {
				console.log( "No audio" );
			}
			
		});

		var target = document.querySelector( "#react-app" );
		audioObserver.observe( target, { childList: true, subtree: true });		
	
	}




	/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


	checkAudioExists();



	console.log("All synchronous scripts have ran");

})();