// ==UserScript==
// @name					Urban75 Tools
// @description	 	Switches the position of the new posts link
// @include		 		https://www.urban75.net/forums/*
// @version		 		0.1.5
// @grant		   		none
// @namespace 		https://greasyfork.org/users/159174
// @downloadURL https://update.greasyfork.org/scripts/35132/Urban75%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/35132/Urban75%20Tools.meta.js
// ==/UserScript==

function moveNewPostsLeft() {
  var newPosts = document.getElementsByClassName("navNewPosts")[0];
  newPosts.parentNode.prepend(newPosts);
  newPosts.classList = '';
}

moveNewPostsLeft();