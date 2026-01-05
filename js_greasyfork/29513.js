// ==UserScript==
// @name         Bible.com enhance
// @namespace    EPS Developments
// @version      0.0.4
// @description  Add functionality to Bible.com
// @author       Edward Sluder
// @match        https://www.bible.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29513/Biblecom%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/29513/Biblecom%20enhance.meta.js
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

		if( audio ) {
            audioReady(audio);
			audioObserver(audio);
		}
        else {
            audioCheck();
        }

	}

	// Called when <audio> is ready.
	function audioReady(audio) {

		audio.playbackRate = 2.0;
		audio.play();

		// Called when audio finishes playing.  Look to advance
		// to the next chapter if reading a plan.
		audio.addEventListener("ended", function() {

			var nextArrow = $( '#react-app > div > div > div.plan-nav > div.reader-arrows > div.next-arrow > a > div' );

			if ( nextArrow ) {
				console.log('clicking next arrow');
				nextArrow.click();
			}


		});



		

	}
	
	function audioObserver() {
		
		// We will observe the <div.ref-heading> element for changes.  Its changes
		// occur as a new chapter is loaded into the DOM and corresponds to the
		// <audio> element getting new <source> data.
		console.log("setting up auidoObserver");	
		
		var observer = new MutationObserver(function(mutations) {
		
			checkAudioExists();
			
		});

		var target = document.querySelector( "div.ref-heading" );
		observer.observe( target, { childList: true, subtree: true });	
	
	}



/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>>>>>>>> MAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

	//checkAudioExists();
    var audioCheck = setTimeout( function(){
        checkAudioExists();

    }, 2000);





})();