// ==UserScript==
// @name        Genios Presse Layout
// @description The script improves the readability of the press articles on genios.de by tidying up the whitespace (blanks und linebreaks).
// @version     20240112
// @include     *.genios.de/document/*
// @include     *.genios.de/*
// @grant       none
// @license     MIT
// @namespace   GeniosLayout
// @downloadURL https://update.greasyfork.org/scripts/484232/Genios%20Presse%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/484232/Genios%20Presse%20Layout.meta.js
// ==/UserScript==

// (first_version: 20240102)

improveReadabilityInPressArticles();

var promise_CheckElements;

function improveReadabilityInPressArticles()
{
	var collection = document.querySelectorAll("#content pre.text");
	console.log("Found " + collection.length + " matching items.");

	if (collection.length <= 0)
	{
		// Uses a promise to wait for the content elements to appear.
		// Src: https://stackoverflow.com/questions/16149431/make-function-wait-until-element-exists/53269990#53269990
		promise_CheckElements = async selector => {
			while ( document.querySelector(selector) === null) {
				await new Promise( resolve => requestAnimationFrame(resolve) );
			}
			return document.querySelector(selector);
		};
		console.log("Waiting for elements to appear...");
		return;
	}

	for (var ia = 0; ia < collection.length; ia++) {
		if (collection[ia].innerHTML.length < 200) continue;

		console.log('#'+ia + " Tag " + collection[ia].tagName + ": Modifying whitespace.");
		//console.log("Content-Length: " + collection[ia].innerHTML.length + " - " + collection[ia].innerHTML );

		// remove linebreaks followed by blanks
		if (true) { collection[ia].innerHTML = collection[ia].innerHTML.replace(/(\r\n|\r|\n) {1,10}/g, ' '); }

		// remove blanks before a dot
		if (true) { collection[ia].innerHTML = collection[ia].innerHTML.replace(/\s+\./g, '.'); }

		// remove blanks before a comma
		if (true) { collection[ia].innerHTML = collection[ia].innerHTML.replace(/\s+,/g, ','); }

		// remove double blanks (caused by replacing?)
		if (true) { collection[ia].innerHTML = collection[ia].innerHTML.replace(/  /, ' '); }

		// replace each linebreak by two line breaks, for readability.
		//if (true) { collection[ia].innerHTML = collection[ia].innerHTML.replace(/(?:\r\n|\r|\n)/g, '\n\n'); }
		if (true) { 
			//var count = 0;
			//console.log(input.replace(/A/g, function(x){count+=1;return "1"}))
			//collection[ia].innerHTML = collection[ia].innerHTML.replace(/([^ \n\r]+)(\r\n|\r|\n)([^ \n\r]+)/g, function(x){count+=1;return "$3 $1";});
			collection[ia].innerHTML = collection[ia].innerHTML.replace(/([^ \n\r]+)(\r\n|\r|\n)([^ \n\r]+)/g, "$1\n\n$3");
			//console.log("Replace Count 4: " + count);
		}
	}
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}


if (promise_CheckElements){
	// Source: https://stackoverflow.com/questions/16149431/make-function-wait-until-element-exists/53269990#53269990
	promise_CheckElements('#content pre.text').then((selector) => {
		console.log("Promise resolved: Found elements from query " + selector);
		improveReadabilityInPressArticles();
	});
}
