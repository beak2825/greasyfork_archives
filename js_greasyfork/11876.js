// ==UserScript==
// @name        Quizlet Spacerace hack
// @namespace   www.example.com
// @description A little Quizlet hack
// @include     https://www.quizlet.com/*/spacerace
// @include     http://www.quizlet.com/*/spacerace
// @include     https://quizlet.com/*/spacerace
// @include     http://quizlet.com/*/spacerace
// @include     quizlet.com/*/spacerace
// @include     www.quizlet.com/*/spacerace
// @include     https://www.quizlet.com/*/spacerace#
// @include     http://www.quizlet.com/*/spacerace#
// @include     https://quizlet.com/*/spacerace#
// @include     http://quizlet.com/*/spacerace#
// @include     quizlet.com/*/spacerace#
// @include     www.quizlet.com/*/spacerace#
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11876/Quizlet%20Spacerace%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/11876/Quizlet%20Spacerace%20hack.meta.js
// ==/UserScript==

alert("Greasemonkey running");
var hackButton = document.createElement('a');
hackButton.id = 'hacker';
hackButton.href = '#';
var textNode = document.createTextNode("Hack");
hackButton.appendChild(textNode);
var buttonBars = document.getElementsByClassName('GameNav');
var buttonBar = buttonBars[0];
buttonBar.appendChild(hackButton);
var hackButtonById = document.getElementById('hacker');
hackButtonById.className = 'GameNav-link';
hackButtonById.onclick = function(){
var newRace = new Spacerace({
				terms: terms,
				previousRecord: 0,
				studyableId: 56802114,
				studyableType: 1,
				selectedOnly: null,
				baseUrl: "\/56802114\/spacerace",
				hardLangs: ["zh-CN","zh-TW","ja","ko"]			});

var pts = prompt("How many points would you like?");
newRace.addPoints(pts);
};