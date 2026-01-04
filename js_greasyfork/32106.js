// ==UserScript==
// @description A simple version for Douban website. Now the work is focused on movie subject. 
// @name Douban_simple_version
// @run-at document-start
// @match https://movie.douban.com/subject/*
// @version 0.0.1.20170816183917
// @namespace https://greasyfork.org/users/147405
// @downloadURL https://update.greasyfork.org/scripts/32106/Douban_simple_version.user.js
// @updateURL https://update.greasyfork.org/scripts/32106/Douban_simple_version.meta.js
// ==/UserScript==

// A script to simplify movie page on douban.com

// Locate Score Section
var score = document.getElementById("interest_sectl")
var button_score = document.createElement("input")

// Hide Score Section
score.style.visibility = "hidden"

// Create Button for Score Section
button_score.type = "button"
button_score.value = "展开评分"
button_score.onclick = function() {
	showScore(score, button_score)
}
score.parentNode.insertBefore(button_score, score)

function showScore(score, button_score) {
	score.style.visibility = "visible"
	button_score.value = "收起评分"
	button_score.onclick = function() {
		hideScore(score, button_score)
	}
}

function hideScore(score, button_score) {
	score.style.visibility = "hidden"
	button_score.value = "展开评分"
	button_score.onclick = function() {
		showScore(score,button_score)
	}
}