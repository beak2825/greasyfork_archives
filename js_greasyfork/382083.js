// ==UserScript==
// @name        Freds-FB-unsponsored-v2
// @namespace   namespace herpaderp facebook sucks v2
// @description Removes Facebook Ads On English Only Facebook
// @version     2.01.18
// @icon        https://i.imgur.com/n8abIGN.png
// @match        https://m.facebook.com/*
// @match        http://m.facebook.com/*
// @match        https://www.facebook.com/*
// @match        http://www.facebook.com/*
// @run-at       document-idle
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/382083/Freds-FB-unsponsored-v2.user.js
// @updateURL https://update.greasyfork.org/scripts/382083/Freds-FB-unsponsored-v2.meta.js
// ==/UserScript==

//Replaces the "Find A Friend" thing with a filter counter	
var d1 = document.getElementById('findFriendsNav');
d1.insertAdjacentHTML('beforebegin', '<span id="derp" style="color:red;font-size:18px;">0</span><span style="color:red;"> posts filtered</span');
d1.style.visibility = "hidden";
d1.style.width = "0px";
var d2 = document.getElementById('derp');
 
//The initial code injection point after testing for the window being loaded
window.onload = (event) => {
  console.log('Facebook mobile unsponsored 1.01.18 loaded');
  codestart();
};

//The subroutine starts here
function codestart() {
    'use strict';

//the story frames location
var storySelector = [
'article',
'div[id^="hyperfeed_story_id"]'
];
//The selector location that we search for stuff that we don't want:
var sponsoredSelectors = [
			//The Sponsored ads locations
           'a.uiStreamSponsoredLink',
           'a[rel=dialog-post] > span > span',
           'div[id^=feedsubtitle]',
           '.userContentWrapper',
           'div[id^=hyperfeed_story_id]',
           'article > header',
           '[data-sigil="m-feed-voice-subtitle"]'
			 ];
//The words that contain the stuff we don't want to see:			 
var searchWords = [
		'Sponsored',
		'Suggested Post',
		'Popular Live Video', 
		'A Video You May Like',
		'Suggested Page',
		'Popular Across Facebook',
		'Page Stories You May Like',
		'Suggestions From Related Pages',
		'Suggested Shows',
		'Your Local Government',
		'Similar to Posts You\'ve Interacted With',
		'Friend Requests',
		'People You May Know'
			];	
//The element root locations of the text to search for
var textRoots = [
		'.userContentWrapper',
		'div[id^=feedsubtitle]',
		'article > header',
		'[data-sigil="m-feed-voice-subtitle"]'
			];
			
// storySelector iterator loops
var q;
for (q = 0; q < storySelector.length; q++){}

//Setting it to pure Javascript and not trip up on the API name:			
var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

//The actual process that starts finding stuff we don't want
function block(story) {
    if(!story) {
        return;
			   }

    var suspected = false;
    var i;
    for(i = 0; i < sponsoredSelectors.length; i++) {
        if(story.querySelectorAll(sponsoredSelectors[i]).length !== null) {
            suspected = true;
            break;
        }
    }

    if(suspected) {
		
		// This is where we start getting stuff removed after searching the defined locations in sponsoredSelectors
		
		var j;
		var k;
		for (j = 0; j < searchWords.length; j++){
		
	//Loops that we need to make it go through the selectors array
		
		for(k = 0; k < textRoots.length; k++) {
			
			//Sets the substring index variable for the searchWords
			var sIndex = 0;
			var slength = searchWords[j].length;
			
			//The substring index can be established programmatically to find the words in many ways
			//But we won't because currently there's no reason to add to the resource suck of Facebook

			
		
		//Loops that check to see if the location is a false positive and if it actually contains the stuff to remove		
		
		if (story.querySelector(textRoots[k]) != null){

			//I'm just putting this here code comment in case FB keeps getting froggy. Something in the ballpark of:
			//if (story.querySelector(textRoots[k]).innerText.indexOf(searchWords[j]) !== -1){story.closest(storySelector[1]).remove();}	
		
		
			if (story.querySelector(textRoots[k]).innerText.trim().substr(sIndex, slength) == searchWords[j]){
				console.log(story.querySelector(textRoots[k]).innerText.trim());

				// If it detects the actual words to remove, and then this removes it
				
				//var elr1 = story.closest('div[id^="hyperfeed_story_id"]');
			    var elr1 = story.closest(storySelector[1]);
				//var elr0 = story.closest('article');
				var elr0 = story.closest(storySelector[0]);


				if (elr1 != null){
					elr1.remove();
				//	elr1.style.height = "50px";
									//Increases the count number by 1 per removal
                d2.innerText = +d2.innerText + 1;
								}
				else if (elr0 != null){
					elr0.remove();
				//	elr0.style.height = "50px";
									//Increases the count number by 1 per removal
                d2.innerText = +d2.innerText + 1;
					} 
				}
			}
		}
    }
 }
}

//This keeps the removal search process running		
function process() {
    // Locate the stream every iteration to allow for FB SPA navigation which
    // replaces the stream element

    var stories = document.querySelectorAll(storySelector);
    if(stories.length == null) {
        return;
    }

    var i;
    for(i = 0; i < stories.length; i++) {block(stories[i]);}
}

var observer = new mutationObserver(process);
observer.observe(document.querySelector('body'), {'childList': true,'subtree': true});

};

