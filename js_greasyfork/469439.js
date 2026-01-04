// ==UserScript==
// @name       derpi_only_show_upvotes
// @namespace   Violentmonkey Scripts
// @match       https://derpibooru.org/*
// @grant       none
// @version     1.5
// @license     MIT
// @author      Saphkey
// @run-at      document-end
// @description 25/06/2023 Replaces images' score with only upvotes, instead of the usual combined upvotes+downvotes. The upvotes are taken from the HTML data-attributes already loaded on the page. Also hides downvotes via CSS rules. You might still see the downvotes for a split second.
// @downloadURL https://update.greasyfork.org/scripts/469439/derpi_only_show_upvotes.user.js
// @updateURL https://update.greasyfork.org/scripts/469439/derpi_only_show_upvotes.meta.js
// ==/UserScript==


(function() {

	function hideScores(){
		let scoreEls = document.getElementsByClassName('score');
		for (let i = 0; i < scoreEls.length; i++) {
			scoreEls[i].innerHTML = '?';
		}
	}

	function hideDownvotes() {
		let downvoteEls = document.getElementsByClassName('downvotes');
		for (let i = 0; i < downvoteEls.length; i++) {
			downvoteEls[i].innerHTML = '?';
		}
	}


	function displaySingleUpvote(upvotes, imageId) {
		let scoreEls = document.getElementsByClassName('score');

		for (let i = 0; i < scoreEls.length; i++) {
			let scoreEl = scoreEls.item(i);

			if (scoreEl.getAttribute(`data-image-id`) == imageId){
				scoreEl.innerHTML = upvotes;
			}
		}
	}

	function replaceScoresWithUpvotes(imageIds){
		let dataContainers = document.getElementsByClassName('image-container');
		for (let i = 0; i < dataContainers.length; i++) {
			let dataContainer = dataContainers[i];
			let imageId = dataContainer.getAttribute('data-image-id');
			let upvote = dataContainer.getAttribute('data-upvotes');
			displaySingleUpvote(upvote, imageId);
		}
	}



	function addStyleRulesThatHideScoresAndDownvotes(){
		// Check if stylesheets exist yet, if not try again in a bit
		if( !document.styleSheets[0] ) return setTimeout( addStyleRulesThatHideScoresAndDownvotes,1 );

		var ss = document.styleSheets[0];

		// Add style rules
		if(ss.addRule) {
			ss.addRule('.score', 'display: none', 0);
			ss.addRule('.downvotes', 'display: none !important', 0);
		}
		else
		{
			ss.insertRule('.score{display: none}', 0);
			ss.insertRule('.downvotes{display: none !important}', 0);
		}
	}
	function addStyleRulesThatShowScores(){
		// Check if stylesheets exist yet, if not try again in a bit
		if( !document.styleSheets[0] ) return setTimeout( addStyleRulesThatShowScores,1 );

		var ss = document.styleSheets[0];

		// Add style rules
		if(ss.addRule)
			ss.addRule( '.score','display: inline !important',0);
		else
			ss.insertRule('.score{display: inline !important}',0);
	}

	addStyleRulesThatHideScoresAndDownvotes();

  hideScores();
  hideDownvotes();

  replaceScoresWithUpvotes();

  addStyleRulesThatShowScores();
})();