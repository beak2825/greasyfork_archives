// ==UserScript==
// @name         SND tickets checker
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  bla bla
// @author       gortik
// @license     MIT
// @match        https://snd.sk/predstavenie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snd.sk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491338/SND%20tickets%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/491338/SND%20tickets%20checker.meta.js
// ==/UserScript==

      // 5 minutes
const RELOAD_TIME = 5 * 60e3,
	  // in this intervals show how much remains to reload page
	  INTERVAL_TIME = 5e3,
      // time remaining to reload page
	  LOCAL_STORAGE_VAR_NAME = 'tickets_checker';

let remaining_time,
	timeout_var;

(function() {
    'use strict';
	addHTML();
	// checks from localStorage if checker is running
	pageLoaded();
    // Your code here...
})();

function pageLoaded() {
	let is_running = localStorage.getItem( LOCAL_STORAGE_VAR_NAME );
	if ( is_running )
		getPerfomences();
}

function start() {
	localStorage.setItem( LOCAL_STORAGE_VAR_NAME, true );
	getPerfomences();
}

function stop() {
	localStorage.removeItem( LOCAL_STORAGE_VAR_NAME );
	clearTimeout( timeout_var );
	remaining_time = 0;
	setTextOnButton( 'STOPPED' );
}

// button clicked, if running stop else start
function buttonClick() {
	let is_running = localStorage.getItem( LOCAL_STORAGE_VAR_NAME );
	if ( is_running )
		stop();
	else
		start();
}

function addHTML() {
	let parentElem = document.querySelector( '.performances form' ),
		button_1 = '<form onsubmit="event.preventDefault();" class="colosseumButton"><button id="test_sound" class="buy" style="margin-left: 1em;">Test sound</button></form>',
		button_2 = '<form onsubmit="event.preventDefault();" class="colosseumButton"><button id="start_checking" class="buy" style="margin-left: 1em;">Check</button></form>',
		html = ''.concat(button_1, button_2);

	parentElem.insertAdjacentHTML( 'afterend', html )
	parentElem.remove();
	document.querySelector( '#test_sound' ).addEventListener( 'click', () => notify(1) );
	document.querySelector( '#start_checking' ).addEventListener( 'click', buttonClick );
}

function setTextOnButton( text ) {
	document.querySelector( '#start_checking' ).textContent = text;
}

function reloadPage() {
	remaining_time = remaining_time ? remaining_time - INTERVAL_TIME : RELOAD_TIME;
	if ( remaining_time < INTERVAL_TIME )
		location.reload();

	let	reload_time_min = ( remaining_time / ( 60*1e3 )).toFixed(1),
		text = 'Reload in ' + reload_time_min + ' min.';

	setTextOnButton( text );

	timeout_var = setTimeout( () => {
		reloadPage();
		//console.log(remaining_time)
	}, INTERVAL_TIME )
}

function playAudio(sound, count) {
	sound.playCount = 0;
	var listener = function() {
		this.currentTime = 0;
		this.playCount++;
		if (this.playCount < count)
			this.play();
		else
			this.removeEventListener('ended', listener);
	}

	sound.addEventListener('ended', listener, false);
	sound.play();
}

function sleep( ms ) {
        return new Promise( resolve => {
		console.log( 'Sleep: ' + ms/1000 + 's.' );
		setTimeout( resolve, ms )
	});
}

async function notify( repeat_sound_count ) {
	let	pause_time = 7e3;
	let	notif_sound = new Audio('data:audio/mpeg;base64,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');
	repeat_sound_count = repeat_sound_count || 10;

	for ( let i = 0; i < repeat_sound_count; i++ ) {
		playAudio( notif_sound, 1 );
		await sleep( pause_time );
	}
}

function isNotSoldOut( performance ) {
	let	soldout = performance.querySelector( '.state' ).textContent != 'Vypredané';
	return soldout;
}

function getPerfomences() {
	let	performences = [...document.querySelectorAll( '.performances .performance' )];

	for ( let p of performences ) {
		if ( isNotSoldOut( p ) ) {
			notify();
			stop();
			setTextOnButton( 'VSTUPENKY' );
			return;
		}
	}
	reloadPage();
}