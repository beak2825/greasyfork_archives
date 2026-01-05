// ==UserScript==
// @name        TiedeIgnoreScript
// @namespace   http://www.oreilly.com/catalog/greasemonkeyhacks/
// @description käyttäjien blokkaus ym tiede.fi foorumilta
// @include     http://*tiede.fi/keskustelu/*/ketju/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/2235/TiedeIgnoreScript.user.js
// @updateURL https://update.greasyfork.org/scripts/2235/TiedeIgnoreScript.meta.js
// ==/UserScript==

// Original download URL: https://greasyfork.org/scripts/2235-tiedeignorescript

if(window.top != window.self) return;
highlightwordlist = {};
highlightlist = {};
ignorelist = {};



////////////////////////////////////////////////////
//
//  ASETUKSET
//
////////////////////////////////////////////////////

// 0 = EI NÄYTÄ viestiä että viesti ignoroitiin.
// 1 = näyttää viestin että viesti ignoroitiin.
show_message_was_ignored = 0;

// lista käyttäjistä jotka ignoroidaan:
// {} sisälle voi laittaa omaa infoa käyttäjistä (joka näkyy vain tässä), formaatin täytyy olla: {'key':'value'}
// HUOM: älä käytä ' merkkejä omissa teksteissäsi jotka ovat ' merkkien sisällä. jos aivan pakko, laita eteen \ merkki: \'
// kopioi käyttäjän linkki ja ota loppussa oleva numero [' ja '] merkkien väliin:
// firefoxissa: oikea klikkaus nimimerkistä -> kopio linkin osoite.
ignorelist['133337'] = {'nimi':'käyttäjän nimi tähän vaikka jotta muistaa myöhemmin kuka se on'};

// lista käyttäjistä jotka korostetaan:
// {} sisälle voi laittaa omaa infoa käyttäjistä (joka näkyy vain tässä), formaatin täytyy olla: {'key':'value'}
// HUOM: älä käytä ' merkkejä omissa teksteissäsi jotka ovat ' merkkien sisällä. jos aivan pakko, laita eteen \ merkki: \'
// kopioi käyttäjän linkki ja ota loppussa oleva numero [' ja '] merkkien väliin:
// firefoxissa: oikea klikkaus nimimerkistä -> kopio linkin osoite.
highlightlist['133337'] = {'nimi':'käyttäjän nimi tähän vaikka jotta muistaa myöhemmin kuka se on'};

// lista merkkijonoista jotka korostetaan:
highlightwordlist['JokuSanaKorostettavaksi'] = {};



// näyttää tämän HTML:n ignoroidun viestin kohdalla. (mikäli show_message_was_ignored = 1)
ignored_element_html = '<div style="border:1px solid black; border-radius:8px; padding:5px; background-color:rgba(0,0,0,0.2); text-align:center">Ignoroitu viesti</div>';

// tämä tyyli näkyy korostetuissa merkkijonoissa:
addGlobalStyle('.highlight { border:1px solid rgba(0,0,0,0.3); border-radius:8px; padding:1px; background-color:rgba(255,255,0,0.3) }');

// tämä tyyli näkyy korostetuissa viesteissä:
addGlobalStyle('.highlight_message { border:10px solid black !important; border-radius:14px !important; }');


////////////////////////////////////////////////////
//
//  ASETUKSET LOPPUU
//
////////////////////////////////////////////////////



























function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if(!head) return;
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}


/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
	highlight: function (node, re, nodeName, className) {
		if (node.nodeType === 3) {
			var match = node.data.match(re);
			if (match) {
				var highlight = document.createElement(nodeName || 'span');
				highlight.className = className || 'highlight';
				var wordNode = node.splitText(match.index);
				wordNode.splitText(match[0].length);
				var wordClone = wordNode.cloneNode(true);
				highlight.appendChild(wordClone);
				wordNode.parentNode.replaceChild(highlight, wordNode);
				return 1; //skip added node in parent
			}
		} else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
				!/(script|style)/i.test(node.tagName) && // ignore script and style nodes
				!(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
			for (var i = 0; i < node.childNodes.length; i++) {
				i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
			}
		}
		return 0;
	}
});

jQuery.fn.unhighlight = function (options) {
	var settings = { className: 'highlight', element: 'span' };
	jQuery.extend(settings, options);

	return this.find(settings.element + "." + settings.className).each(function () {
		var parent = this.parentNode;
		parent.replaceChild(this.firstChild, this);
		parent.normalize();
	}).end();
};

jQuery.fn.highlight = function (words, options) {
	var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
	jQuery.extend(settings, options);

	if (words.constructor === String) {
		words = [words];
	}
	words = jQuery.grep(words, function(word, i){
	  return word != '';
	});
	words = jQuery.map(words, function(word, i) {
	  return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	});
	if (words.length == 0) { return this; };

	var flag = settings.caseSensitive ? "" : "i";
	var pattern = "(" + words.join("|") + ")";
	if (settings.wordsOnly) {
		pattern = "\\b" + pattern + "\\b";
	}
	var re = new RegExp(pattern, flag);

	return this.each(function () {
		jQuery.highlight(this, re, settings.element, settings.className);
	});
};
















/*********************************************************
**********************************************************
	Tiede.fi ignore script by jogger.
	Version 1.0 alpha.
**********************************************************
*********************************************************/

$(document).ready(function(){
	$.each(ignorelist, function(key, val){
		if(show_message_was_ignored){
			$('a[href$="'+key+'"]').parent().parent().parent().parent().parent().parent().html(ignored_element_html);
		}else{
			$('a[href$="'+key+'"]').parent().parent().parent().parent().parent().parent().remove();
		}
	});
	$.each(highlightlist, function(key, val){
		$('a[href$="'+key+'"]').parent().parent().parent().parent().parent().addClass('highlight_message');
	});
	$.each(highlightwordlist, function(key, val){
		$('div.postContent').highlight(key);
	});
});



