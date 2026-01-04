// ==UserScript==
// @name         Hide Furigana in Jisho Sentences
// @version      0.2
// @description  Enables a link to toggle between Furigana On/Off in the page of sentences at Jisho.org
// @author       jarmanso7
// @match        https://jisho.org/search/*#sentences*
// @match        https://jisho.org/search/*%20%23sentences*
// @namespace https://greasyfork.org/users/241544
// @downloadURL https://update.greasyfork.org/scripts/377310/Hide%20Furigana%20in%20Jisho%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/377310/Hide%20Furigana%20in%20Jisho%20Sentences.meta.js
// ==/UserScript==

function AddToggleFuriganaLink(){
	/* ------------------------ GENERATE CUSTOM LINK ---------------------*/
	var addToggleFuriganaLink = document.createElement ('a');
	addToggleFuriganaLink.setAttribute ('id', 'toggle-furigana-custom-link');
	addToggleFuriganaLink.setAttribute ('class', 'concept_light-status_link');
	addToggleFuriganaLink.innerText = 'Furigana off';
	
	var sentences = document.getElementsByClassName("sentences")[0]
	
	var hrDivider = document.createElement ( 'hr' );
	
	sentences.insertBefore(hrDivider, sentences.firstChild);
	sentences.insertBefore(addToggleFuriganaLink, sentences.firstChild);
	
	/* ------------------------ ACTIVATE CUSTOM LINK ---------------------*/
	document.getElementById ('toggle-furigana-custom-link').addEventListener(
		'click', ButtonClickAction, false
	);

	function ButtonClickAction (zEvent) {
		ToggleFuriganaEvent();
	}
}

function ToggleFuriganaEvent(){
	
	var furiganaLink = document.getElementById ('toggle-furigana-custom-link');
	
	if (furiganaLink.innerText == 'Furigana off'){
		LoopThroughFuriganaTagsChangeDisplayProperty('none');
		furiganaLink.innerText = 'Furigana on';
	}	
	else {
		LoopThroughFuriganaTagsChangeDisplayProperty('block');
		furiganaLink.innerText = 'Furigana off';
	}
}

function LoopThroughFuriganaTagsChangeDisplayProperty(displayValue){
	
	var furiganaTags = document.getElementsByClassName("furigana");
	
	for (var i = 0; i < furiganaTags.length; i++) { 
	  furiganaTags[i].style.display = displayValue;
	}
}

//Main function
(function() {
	AddToggleFuriganaLink();
})();
