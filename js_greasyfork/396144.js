// ==UserScript==
// @name         filter hkepc banned reply
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.hkepc.com/forum/viewthread.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396144/filter%20hkepc%20banned%20reply.user.js
// @updateURL https://update.greasyfork.org/scripts/396144/filter%20hkepc%20banned%20reply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


var found = false;
var banList = [
    { id: 'carl.20150508'},
    { id: 'yipyipfung'}
];


	do {
		found = false;
		var quoteList = document.getElementsByClassName("quote");

		for (var i = 0; i < quoteList.length; i++) {
			for (var j = 0; j < banList.length; j++ ) {
				var myRe = new RegExp('\\n'+banList[j].id+'.*發表於', 'ig');
				if (myRe.exec(quoteList[i].innerText)) {
					var parent = quoteList[i].parentNode;
					parent.removeChild(quoteList[i]);
					found = true;
					}
				}
			}

	}

	while (found);

	do {
		found = false;
		var postList = document.getElementById("postlist");

		for (var i = 0; i < postList.childNodes.length; i++) {
			var authorString = postList.childNodes[i].getElementsByClassName("postauthor")[0].innerText.replace(/\n.*/gi,"");
			for (var j = 0; j < banList.length; j++ ) {
				if (banList[j].id == authorString) {
				postList.removeChild(postList.childNodes[i]);
				found = true;
				}
			}

		}

	}
	while (found);





})();