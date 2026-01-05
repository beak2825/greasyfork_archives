// ==UserScript==
// @name        Dolphins Forever
// @namespace   + polarity -
// @description Replaces swear filter with dolphins
// @include     http://www.thestudentroom.co.uk/
// @include     http://*.thestudentroom.co.uk/
// @include     http://www.thestudentroom.co.uk/*
// @include     http://thestudentroom.co.uk/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18670/Dolphins%20Forever.user.js
// @updateURL https://update.greasyfork.org/scripts/18670/Dolphins%20Forever.meta.js
// ==/UserScript==

(function()
	{
		var allPosts = document.getElementsByClassName('postcontent restore');
		var uri = 'http://static.tsrfiles.co.uk/images/smilies/dolphin.gif';
		var d = "<img src='" + uri + "'>";
		var mapObj = {
			"\*\*\*": d+d+d,
			"\*\*\*\*": d+d+d+d,
			"\*\*\*\*\*": d+d+d+d+d,
			"\*\*\*\*\*\*": d+d+d+d+d+d,
			"\*\*\*\*\*\*\*": d+d+d+d+d+d+d,
			"\*\*\*\*\*\*\*\*": d+d+d+d+d+d+d+d,
			"\*\*\*\*\*\*\*\*\*": d+d+d+d+d+d+d+d+d,
			"\*\*\*\*\*\*\*\*\*\*": d+d+d+d+d+d+d+d+d+d,
			"\*\*\*\*\*\*\*\*\*\*\*": d+d+d+d+d+d+d+d+d+d+d,
			"\*\*\*\*\*\*\*\*\*\*\*\*": d+d+d+d+d+d+d+d+d+d+d+d
		};
		
		for (var i=0; i<allPosts.length; i++) {
			allPosts[i].innerHTML = allPosts[i].innerHTML.replace(/(\*{3,12})/g, function(matched) {
				return mapObj[matched];
			});
		}
	}
)();