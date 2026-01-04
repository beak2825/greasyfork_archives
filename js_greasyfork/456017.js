// ==UserScript==
// @name         HNCleaner
// @namespace    LWPDWyfub
// @version      0.2
// @description  Remove annoying HN posts
// @author       LWPDWyfub
// @match https://news.ycombinator.com/*
// @exclude https://news.ycombinator.com/item*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456017/HNCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/456017/HNCleaner.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const annoyingTerms = [
		'ChatGPT',
		'Musk',
		'Elon',
		'spacex',
		'tesla'
	];
	const annoyingSites = ['twitter.com'];
	const annoyingTermsRegex = new RegExp('(' + annoyingTerms.join('|') + ')', 'i')
	const annoyingSitesRegex = new RegExp('(' + annoyingSites.join('|') + ')', 'i')
	const termTargets = Array.from(document.querySelectorAll('.athing')).filter(({ innerText }) => annoyingTermsRegex.test(innerText) || annoyingSitesRegex.test(innerText))
	const logoutButton = document.querySelector("#logout")
	const hidePost = function (postIds, next) {
		var postId = postIds[next].id
		console.log("Hiding post[" + next + "] with ID " + postId)
		var req = XMLHttpRequest({
			method: 'GET',
			url: "https://news.ycombinator.com/hide?id=" + postId,
			withCredentials: true,
			onerror: function (error) {
				console.log("Error hiding " + postId)
			},
			onload: function (response) {
				var resp = response.responseText;
				console.log("Hiding post " + postId + " returned code " + response.status)
				if (resp.includes("Logged") || resp.status != 200) {
					console.log(resp)
				}
				else {
					console.log("Hid post " + postId)
				}

			}
		});
		next = next + 1
		if (next < postIds.length) {
			window.setTimeout(hidePost, 5000, termTargets, next)
		}
		else {
			console.log("Finished hiding final post")
		}
	}

	console.log("Found " + termTargets.length + " annoying targets")
	for (let target of termTargets) {
		console.log("Hiding post " + target.id)
		target.style.display = "none"
	}
	// Clean up spacers and comments
	Array.from(document.querySelectorAll("tr[style*='none'] + tr")).forEach(function (e) { e.style.display = "none" })
	Array.from(document.querySelectorAll("tr[style*='none'] + .spacer")).forEach(function (e) { e.style.display = "none" })

	// Renumber unhidden posts
	var allRanks = Array.from(document.querySelectorAll("span.rank"))
	var shownSpans = Array.from(document.querySelectorAll("span.rank")).filter(
		e => window.getComputedStyle(e.parentElement.parentElement).display != "none")
	const firstNum = parseInt(allRanks[0].innerText.replace("\.", ""))
	for (let i = 0; i < shownSpans.length; i++) {
		shownSpans[i].innerText = (firstNum + i) + "."
	}


})();