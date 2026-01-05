// ==UserScript==
// @name         google plus rtl fix
// @namespace    https://plus.google.com/105980437314936889817
// @version      0.3.2
// @description  Fix rtl in posts and comments in google plus
// @author       Javad
// @include      https://plus.google.com/*
// @include      https://plus.google.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23650/google%20plus%20rtl%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/23650/google%20plus%20rtl%20fix.meta.js
// ==/UserScript==
GM_addStyle(".GcESAf, .jxKp7, .H68wj { width: 800px !important; max-width: 800px !important;} .svmwUe , .qhIQqf div , .wftCae{font-size:18px;}");
(function () {
	'use strict';
	var text = document.querySelectorAll('div.ahil4d');
	var resharetext = document.querySelectorAll('.J3fjEb div');
	for (var i = 0; i < text.length; i++) {
		text[i].dir = "auto";
		console.log("fortext");
		resharetext[i].dir = "auto";
		console.log("forreshare");
	}
	var comment1 = document.querySelectorAll('.g6UaYd div');
	for (var k = 0; k < comment1.length; k++) {
		comment1[k].style.textAlign = "initial";
		console.log('comment');
	}

	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {

			var comment = document.querySelectorAll('.g6UaYd div');
			if (comment !== null) {
				for (var j = 0; j < comment.length; j++) {
					comment[j].style.textAlign = "initial";

				}
			}
			mutation.addedNodes.forEach(function (node) {
				var reshare = node.querySelectorAll('div.ahil4d');
				var resharetop = node.querySelectorAll('.J3fjEb div');
				var comment = node.querySelectorAll('.g6UaYd div');
				var photo = node.querySelectorAll('.mUbCce.fKz7Od');
				if (reshare !== null) {
					for (var a = 0; a < reshare.length; a++) {
						reshare[a].dir = "auto";
						console.log('reshare');
					}
				}
				if (resharetop !== null) {
					for (var b = 0; b < resharetop.length; b++) {
						resharetop[b].dir = "auto";
						console.log('resharetop');

					}
				}
				if (comment !== null) {
					for (var j = 0; j < comment.length; j++) {
						comment[j].style.textAlign = "initial";
						console.log('comment');

					}
				}
				if (photo !== null) {
					for (var d = 0; d < photo.length; d++) {
						photo[d].tabIndex = "-1";
						console.log('photo');
					}
				} else {
					console.log("notfound");
				}
			});
		});
	});
	observer.observe(document, {
		childList : true,
		subtree : true,
		attributes : true,
		characterData : false,
	});
})();
