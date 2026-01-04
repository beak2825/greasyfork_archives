// ==UserScript==
// @name         Bandcamp :: Search Filters
// @namespace    https://greasyfork.org/en/scripts/391848-bandcamp-search-filters
// @version      1.0.2
// @description  Adds Artist, Album and Label buttons to filter the search results.
// @author       newstarshipsmell
// @include      /https://bandcamp\.com/search\?((page=\d&)?(.+&)?q=.+)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391848/Bandcamp%20%3A%3A%20Search%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/391848/Bandcamp%20%3A%3A%20Search%20Filters.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var searchBox = document.querySelector('input.searchbox.housefont');
	var searchTerms = searchBox.value;

	var artBtn = document.createElement('button');
	artBtn.type = 'button';
	artBtn.classList.add('searchbutton', 'round4', 'housefont');
	var artBtnSpn = document.createElement('span');
	artBtnSpn.classList.add('icon');
	artBtn.appendChild(artBtnSpn);
	artBtn.appendChild(document.createTextNode('Artist'));

	var hook = document.querySelector('button.searchbutton');
	hook.parentNode.insertBefore(artBtn, hook.nextSibling);

	var albBtn = document.createElement('button');
	albBtn.type = 'button';
	albBtn.classList.add('searchbutton', 'round4', 'housefont');
	var albBtnSpn = document.createElement('span');
	albBtnSpn.classList.add('icon');
	albBtn.appendChild(albBtnSpn);
	albBtn.appendChild(document.createTextNode('Album'));

	hook.parentNode.insertBefore(albBtn, artBtn.nextSibling);

	var lblBtn = document.createElement('button');
	lblBtn.type = 'button';
	lblBtn.classList.add('searchbutton', 'round4', 'housefont');
	var lblBtnSpn = document.createElement('span');
	lblBtnSpn.classList.add('icon');
	lblBtn.appendChild(lblBtnSpn);
	lblBtn.appendChild(document.createTextNode('Label'));

	hook.parentNode.insertBefore(lblBtn, albBtn.nextSibling);

	var results = document.querySelectorAll('ul.result-items li.searchresult');
	var resultsType = document.querySelectorAll('ul.result-items li.searchresult div.result-info div.itemtype');
	var resultsHeadingLink = document.querySelectorAll('ul.result-items li.searchresult div.result-info div.heading a');

	artBtn.addEventListener('click', function(e){
		artBtn.classList.toggle('round4');
		albBtn.classList.add('round4');
		lblBtn.classList.add('round4');

		if (artBtn.classList.contains('round4')) {
			for (var i = 0, len = results.length; i < len; i++) {
				results[i].style.display = '';
			}
		} else {
			for (i = 0, len = results.length; i < len; i++) {
				if (resultsType[i].textContent.trim() != 'ARTIST' ||
					resultsHeadingLink[i].textContent.trim().toLowerCase() != searchTerms.toLowerCase()) {
					results[i].style.display = 'none';
				} else {
					results[i].style.display = '';
				}
			}
		}
	});

	albBtn.addEventListener('click', function(e){
		artBtn.classList.add('round4');
		albBtn.classList.toggle('round4');
		lblBtn.classList.add('round4');

		if (albBtn.classList.contains('round4')) {
			for (var i = 0, len = results.length; i < len; i++) {
				results[i].style.display = '';
			}
		} else {
			for (i = 0, len = results.length; i < len; i++) {
				if ((resultsType[i].textContent.trim() != 'ALBUM' &&
					 resultsType[i].textContent.trim() != 'TRACK') ||
					!resultsHeadingLink[i].textContent.trim().toLowerCase().includes(searchTerms.toLowerCase())) {
					results[i].style.display = 'none';
				} else {
					results[i].style.display = '';
				}
			}
		}
	});

	lblBtn.addEventListener('click', function(e){
		artBtn.classList.add('round4');
		albBtn.classList.add('round4');
		lblBtn.classList.toggle('round4');

		if (lblBtn.classList.contains('round4')) {
			for (var i = 0, len = results.length; i < len; i++) {
				results[i].style.display = '';
			}
		} else {
			for (i = 0, len = results.length; i < len; i++) {
				if (resultsType[i].textContent.trim() != 'LABEL' ||
					!resultsHeadingLink[i].textContent.trim().toLowerCase().includes(searchTerms.toLowerCase())) {
					results[i].style.display = 'none';
				} else {
					results[i].style.display = '';
				}
			}
		}
	});
})();