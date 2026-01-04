// ==UserScript==
// @name         Test Deezer Mobile Ad Hider
// @namespace    https://greasyfork.org/en/scripts/370301-deezer-mobile-ad-hider
// @version      1.2
// @description  Hides the ad for the mobile app that no one gives a shit about.
// @author       newstarshipsmell
// @include      /https?://(www\.)?deezer\.com/(\w{2}/|search/).+/
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/372505/Test%20Deezer%20Mobile%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/372505/Test%20Deezer%20Mobile%20Ad%20Hider.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 222;
	var btnAdded = false;
	//var btnCoverAdded = false;

	function removeSomeIrritatingBullshit() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			var searchterms = document.querySelector('div.search-header > div.container > h1');
		} catch(err) {}

		try {
			if (searchterms.innerHTML !== undefined){
				var searchString = searchterms.innerHTML.replace(/Search results for « (.+) »/, '$1').toLowerCase().replace(/([\[\\\^\$\.\|\?\*\+\(\)])/g, '\$1');
				var searchPattern = new RegExp('^' + searchString + '$');
				var searchPatternNoThe = new RegExp('^' + searchString.replace(/^the /, '') + '$');
				var searchPatternStripped = new RegExp('^' + searchString.replace(/[^ \w]/g, '') + '$');
				var searchPatternThe = new RegExp('^the ' + searchString + '$');
			}
		} catch(err) {}

		try {
			if (!btnAdded && searchterms.innerHTML !== undefined) {
				var extFltBtn = document.createElement('input');
				extFltBtn.setAttribute('type', 'button');
				extFltBtn.setAttribute('id', 'exact_filter');
				extFltBtn.setAttribute('value', 'Exact Filter');
				extFltBtn.setAttribute('title', 'Hides all results that are not exact matches to the search terms');

				searchterms.parentNode.appendChild(extFltBtn);
				btnAdded = true;

				document.getElementById('exact_filter').addEventListener("click", function(){
					var searchResults = document.querySelectorAll('li.thumbnail-col > div.thumbnail-caption > div.heading-4 > a');

					for (var i = 0, len = searchResults.length; i < len; i++) {
						if (!searchPattern.test(searchResults[i].title.toLowerCase()) &&
							!searchPatternNoThe.test(searchResults[i].title.toLowerCase()) &&
							!searchPatternStripped.test(searchResults[i].title.toLowerCase().replace(/[^ \w]/g, '')) &&
							!searchPatternThe.test(searchResults[i].title.toLowerCase())) {
							searchResults[i].parentNode.parentNode.parentNode.classList.add('hidden');
						}
					}
				});
			}
		} catch(err) {}

		try {
			var irritatingBullshit = document.querySelector('div.modal');
			irritatingBullshit.parentNode.removeChild(irritatingBullshit);
		}
		catch(err) {}

		try {document.querySelector('div.c0130 > button').click();}
		catch(err) {}

		try {document.querySelector('div.ads-bottom').classList.add('hidden');}
		catch(err) {}

		try {
			var searchBar = document.querySelector('div.search');
			var catCont = document.querySelector('div.catalog-content');
			catCont.appendChild(searchBar);
		} catch(err) {}

		try {document.querySelector('svg.svg-icon-search').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('div.page-sidebar').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('div.page-panels').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('ul.action-center').classList.add('hidden');}
		catch(err) {}

		try {var cover = document.querySelector('img.picture-img');}
		catch(err) {}

		/*try {
			if (!btnCoverAdded) {
				var toolbar = document.querySelector('div.toolbar-wrapper-full');
				var coverBtnD = document.createElement('div');
				coverBtnD.classList.add('toolbar-item');
				var coverBtn = document.createElement('button');
				coverBtn.classList.add('c011', 'c0110');
				var coverBtnS = document.createElement('span');
				coverBtnS.classList.add('c012');
				var coverBtnT = document.createTextNode('Max Cover');
				coverBtnS.appendChild(coverBtnT);
				coverBtn.appendChild(coverBtnS);
				coverBtnD.appendChild(coverBtn);
				toolbar.appendChild(coverBtnD);
				btnCoverAdded = true;
				coverBtn.addEventListener('click', function(e){
					var coverOrig = cover.src.replace(/264x264-000000-80-0-0.jpg/, '');
					var maxSize = 1000;
					var testSize = 1200;
					var testActual = 1200;
					var testImg = [];
					var index = -1;

					do {
						maxSize = testSize;
						testSize += 200
						coverBtnS.innerHTML = 'Test: ' + testSize + 'x' + testSize;
						testImg.length++;
						index++;


						testActual = testImg[index].width;
					} while (testActual > maxSize);

					var maxImg = coverOrig + maxSize + 'x' + maxSize + '-000000-93-0-0.jpg'
					coverBtnS.innerHTML = 'Test: ' + maxSize + 'x' + maxSize;
					GM_setClipboard(maxImg);
				});
			}
		}
		catch(err) {}*/

		try {
			var listenBtn = document.querySelectorAll('button.c0110')[1];
			listenBtn.addEventListener('click', function(e){
				e.preventDefault();
				var coverURL = cover.src.replace(/264x264-000000-80-0-0.jpg/, '1000x1000-000000-0-0-0.jpg');
				GM_setClipboard(coverURL);
				//GM_openInTab(coverURL);
				window.close();
			});
		} catch(err) {}

	}

	/*function getSize(url, size) {
		var img = new Image(), actualSize = 0;

		img.onload = function() {
			console.log("(inside) The image size is "+this.width+" x "+this.height);
		}

		img.src = url + size + 'x' + size + '-000000-93-0-0.jpg'; // this must be done AFTER setting onload
		actualSize = waitForLoad();
		function afterLoad(img) {
			if (img.width == 0) {
				window.setTimeout(afterLoad(img), 1000);
			}
			return (img.width == 0 ? afterLoad(img) : img.width);
		}

		while (testImg[index].width == 0) {
			window.setTimeout(function() {}, 1000);
		}
	}*/

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { removeSomeIrritatingBullshit(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", removeSomeIrritatingBullshit, false);


})();