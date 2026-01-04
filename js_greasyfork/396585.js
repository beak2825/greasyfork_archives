// ==UserScript==
// @name         Insta Likes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/396585/Insta%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/396585/Insta%20Likes.meta.js
// ==/UserScript==

(function() {
    'use strict';
 window.onload = function() {
var delay = 0;
delay = Math.round(Math.random()*2000+1000);

var firstPostRow = document.querySelector("#react-root > section > main > div > div > article > div > div > div");
if (firstPostRow.childElementCount > 0 && !document.querySelector("#react-root > section > main > div > div > article > div > div > div > h1")) {
	console.log('profile is open');
		setTimeout(like, delay)
} else if (!document.querySelector("#react-root > section > main > div > div > article > div > div > div > h1")) {
	console.log('profile is closed');
	setTimeout(window.close(), delay);
} else {
	console.log('profile is empty');
	setTimeout(window.close(), delay);
}

function like () {
	delay += Math.round(Math.random()*2000+1000);
	//open post
	setTimeout(function() {firstPostRow.children[0].children[0].click()}, delay);
	//like
	delay += Math.round(Math.random()*2000+1000);
	setTimeout(function() {
		if (document.querySelector("body > div > div > div > article > div > section > span > button > svg").getAttribute('fill') == "#262626") {
			document.querySelector("body > div > div > div > article > div > section > span > button").click()
			console.log('+like');
			;
			localStorage.setItem("instaLikes", localStorage.getItem('instaLikes')*1+1);
			} else {console.log('-already liked');}
		}, delay);
	//close
	delay += Math.round(Math.random()*2000+1000);
	setTimeout(function() {document.querySelector("body > div > div > button").click()}, delay);

	//second open
	delay += Math.round(Math.random()*2000+2000);
	setTimeout(function() {firstPostRow.children[1].children[0].click()}, delay);
	//like
	delay += Math.round(Math.random()*2000+2000);
	setTimeout(function() {
		if (document.querySelector("body > div > div > div > article > div > section > span > button > svg").getAttribute('fill') == "#262626") {
			document.querySelector("body > div > div > div > article > div > section > span > button").click()
			console.log('++like');
			} else {console.log('--already liked');}
		}, delay);
	//close
	delay += Math.round(Math.random()*2000+2000);
	setTimeout(function() {
		document.querySelector("body > div > div > button").click();
		console.log('All done!');
		window.close();
	}, delay);
}
 }
})();