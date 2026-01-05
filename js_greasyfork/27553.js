// ==UserScript==
// @name         Bakchodi
// @namespace    Buffaloshark
// @version      0.2
// @description  Replaces keywords appearing in the Indian liberal media with proper Indianized terms.
// @author       BuffaloShark
// @include      http://www.huffingtonpost.in/*
// @include      http://huffingtonpost.in/*
// @include      https://huffingtonpost.in/*
// @include      https://www.huffingtonpost.in/*
// @include      http://scroll.in/*
// @include      http://www.scroll.in/*
// @include      https://scroll.in/*
// @include      https://www.scroll.in/*
// @include      https://www.thequint.com/*
// @include      http://www.thequint.com/*
// @include      http://thequint.com/*
// @include      https://thequint.com/*
// @include      http://www.ndtv.com/*
// @include      https://www.ndtv.com/*
// @license      MIT License
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/27553/Bakchodi.user.js
// @updateURL https://update.greasyfork.org/scripts/27553/Bakchodi.meta.js
// ==/UserScript==

var elements = document.getElementsByTagName("*");

var dictionary = [
    	[/ muslim/gi, " Dharmic "],
    [/ hindu/gi, " Katua "],
    [/ secular/gi, " Anti-hindu "],
    [/ secularism/gi, " Communalism "],
    [/ pakistan/gi, " Porkistan "],
    [/Modi/gi, " 56 Inch-ka-seena "],
    [/ india/gi, " Akhand-bharat"],
    [/ rss/gi, " AIMIM "],
    [/ rape /gi, " Love-jihad "],
    [/ raped /gi, " Islamized "],
    [/ israel /gi, " Our Greatest Ally "],
    [/ dalit/gi, " Toilet Cleaner "],
    [/ Tamil Nadu /gi, " Lungiland "],
    [/ Karnataka /gi, " Lungiland "],
    [/ Andhra Pradesh /gi, " Lungiland "],
    [/ Kerala /gi, " Commieland "],
    [/ kejriwal /gi, " Haraamkhor "]

];

function wordReplace(text)
{
	var replaced = text;
	for(dictI = 0; dictI < dictionary.length; dictI++)
		replaced = replaced.replace(dictionary[dictI][0], dictionary[dictI][1]);

	return replaced;
}

for(var i = 0; i < elements.length; i++)
{
	var el = elements[i];

	for(var j = 0; j < el.childNodes.length; j++)
	{
		var node = el.childNodes[j];
		if(node.nodeType === 3)
		{
			var text = node.nodeValue;
			var replaced = wordReplace(text);

			if(replaced !== text)
				el.replaceChild(document.createTextNode(replaced), node);
		}
	}
}