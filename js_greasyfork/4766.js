// ==UserScript==
// @name           Color Code Individual Google Tasks
// @namespace      Tevi
// @description	   Looks for specific key words and changes the background of the cell of a google task to a predefined color
// @include        https://www.google.com/calendar/*
// @include        https://calendar.google.com/*
// @version        1.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4766/Color%20Code%20Individual%20Google%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/4766/Color%20Code%20Individual%20Google%20Tasks.meta.js
// ==/UserScript==
var keyWords = ["workout", "exam","research","homework"];
var backgroundColors = ['#D6BD2D','#9E0000','#D67B5C','#1E8096'];

document.addEventListener('DOMNodeInserted', function() { 
	var checkBox = document.querySelectorAll('span.tc-icon');
	for (var J = checkBox.length-1;  J >= 0;  --J){
		var str = checkBox[J].parentNode.textContent.toString();
		for (var I = keyWords.length - 1; I>= 0; --I)
			if(str.toLowerCase().indexOf(keyWords[I].toLowerCase()) >= 0)
            			checkBox[J].parentNode.parentNode.style.background = backgroundColors[I];
	}
}, false);
