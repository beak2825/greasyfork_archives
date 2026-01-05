// ==UserScript==
// @name        dubtrack.fm autowoot
// @namespace   https://greasyfork.org/en/users/13981-chk1
// @include     https://www.dubtrack.fm/join/*
// @description Automatically upvote songs when they play.
// @version     0.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/13120/dubtrackfm%20autowoot.user.js
// @updateURL https://update.greasyfork.org/scripts/13120/dubtrackfm%20autowoot.meta.js
// ==/UserScript==

var config = { 
  childList: true,
  attributes: true, 
  subtree: true,
  attributeOldValue: true,
  characterData: true
};

var currentSong, upvote;

var songObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type == "characterData" || mutation.type == "childList"){
      //console.log(mutation);
      upvote.click();
    }
  });
});

function waitAndRegister() {
	window.setTimeout(function(){ 
		currentSong = document.querySelector('li.infoContainer span.currentSong');
		if(typeof(currentSong) == 'undefined') { 
			waitAndRegister();
		} else {
      console.log('Songtitle element found');
			upvote = document.querySelector('a.dubup');
			songObserver.observe(currentSong, config);
		}
	}, 1000);
};
waitAndRegister();