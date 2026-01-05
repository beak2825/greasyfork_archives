// ==UserScript==
// @name Sbazar tlapky
// @description Prida tlapky na prvni 4 stranky vsade na sbazaru
// @author tkafka
// @version 0.0.7
// @date 2016-03-19
// @namespace tlapky.sbazar.seznam.tomaskafka.com
// @include http://www.sbazar.cz/*
// @include https://www.sbazar.cz/*
// @match http://www.sbazar.cz/*
// @match https://www.sbazar.cz/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/18354/Sbazar%20tlapky.user.js
// @updateURL https://update.greasyfork.org/scripts/18354/Sbazar%20tlapky.meta.js
// ==/UserScript==


(function(document) {
	var pawedResults = 38 + Math.floor(Math.random() * 92);


	// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	var target = document.querySelector('#mrEggsResults');
	addPaws(target);

	// create an observer instance
	var observer = new MutationObserver(function(mutations) {
		addPaws(target);
	});


// pass in the target node, as well as the observer options
	observer.observe(target, { attributes: true, childList: true, characterData: true });

// later, you can stop observing
// observer.disconnect();

	function addPaws(target) {
		console.log('adding paws ...');
		if (!window.location.pathname.match(/\/detail\/?/)) { // pages 2 - ...
			var page = 0;
			var matches = window.location.pathname.match(/\/(\d+)$/);
			if (matches) {
				page = parseInt(matches[1], 10);
			}

			var eggs = target.querySelectorAll('.mrEgg');
			// console.log('target/eggs:', target, eggs);

			var resultsPerPage = eggs.length;
			var baseIndex = page * resultsPerPage;

			Array.prototype.forEach.call(eggs, function(egg,i) {
				var eggIndex = baseIndex + i;
				if (eggIndex < pawedResults) {
					// add paw
					egg.classList.add('topped');
					var paw = document.createElement('div');
					paw.classList.add('paw');
					egg.querySelector('.frame').appendChild(paw);
				} else {
					// remove paw
					egg.classList.remove('topped');

					var paw = egg.querySelector('.paw');
					if (paw) {
						paw.parentNode.removeChild(paw);
					}
					paw = null;
				}

			});


		}
	}
})(document);


