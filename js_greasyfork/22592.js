// ==UserScript==
// @name         Load All Soundcloud Likes
// @namespace    petesilva
// @version      0.1
// @description  Handy button to auto AJAX load all your liked tracks. Basically just scrolls the page for you quickly until there's no more.
// @author       Pete Silva
// @require		 http://code.jquery.com/jquery-latest.js
// @match        https://soundcloud.com/you/likes
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22592/Load%20All%20Soundcloud%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/22592/Load%20All%20Soundcloud%20Likes.meta.js
// ==/UserScript==

// Declares
var myInterval = null;

// Functions
function newCss() {
	GM_addStyle('.ps-load-all { display:block; float: right; padding: 5px 14px; z-index: 9998; position: relative; border: none; }');
	GM_addStyle('.ps-load-all:focus { outline: none; }');
	GM_addStyle('.ps-load-cancel { position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index:9999; background-color:rgba(0,0,0,.8); }');
	GM_addStyle('.ps-load-cancel.ps-visible { display: block; }');
	GM_addStyle('.ps-load-cancel.ps-hidden { display: none; }');
	GM_addStyle('.ps-load-cancel input { display: block; margin: 0px auto; font-size: 18px; top: 50%; position: relative; padding: 10px; border: 5px solid #a0a0a0; border-radius: 10px; box-shadow: 0px 0px 20px #ffffff; }');
}

function displayCancel(toggle) {
	if(toggle) {
		$('.ps-load-cancel').removeClass('ps-hidden').addClass('ps-visible');
	} else {
		$('.ps-load-cancel').removeClass('ps-visible').addClass('ps-hidden');
	}
}

function doneLoading() {
	clearInterval(myInterval);
	displayCancel(false);
	window.scrollTo(0,0);
}

function startAJAXScrolling() {
	GM_addStyle('.sound__waveform { display: none !important; }');	// Prevents loading of waveforms which makes it A LOT easier on browser
	displayCancel(true);
	clearInterval(myInterval);
	myInterval = setInterval(function(){
		window.scrollTo(0,document.body.scrollHeight);
		if( $('.loading').length == 0 ) doneLoading();
	}, 500);
}

// Main Exec
$(document).ready(function(){
	newCss();

	$('body').append('<div class="ps-load-cancel ps-hidden"><input type="button" value="Cancel Loading"/></div>');		// Cancel load screen
	$('section.collection__likesSection').before('<a href="#" class="ps-load-all sc-text-light sc-type-medium">Load All</a>');
	
	$('.ps-load-all').click(function(){
		
		startAJAXScrolling();
	});

	$('.ps-load-cancel input').click(function(){

		doneLoading();
	});
});