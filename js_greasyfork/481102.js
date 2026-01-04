// ==UserScript==
// @name Youtube Continue Watching
// @description Click "Yes I'm still watching"
// @match https://www.youtube.com/watch*
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png
// @version 1
// @grant none
// @license MIT
 
// @namespace https://greasyfork.org/users/803889
// @downloadURL https://update.greasyfork.org/scripts/481102/Youtube%20Continue%20Watching.user.js
// @updateURL https://update.greasyfork.org/scripts/481102/Youtube%20Continue%20Watching.meta.js
// ==/UserScript==


function checker (){
	let continueWatching = document.getElementsByTagName("yt-confirm-dialog-renderer")
	
	if (continueWatching.length > 0){
  	document.getElementsByClassName("yt-spec-touch-feedback-shape")[0].click()
  }
	
	
}

setInterval(checker, 3000)