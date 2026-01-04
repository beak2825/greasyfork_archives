// ==UserScript==
// @name marktplaats verberg commerciele aanbieders
// @namespace http://www.jaron.nl/misc/
// @description Verwijder advertenties van commerciële bedrijven van marktplaats
// @include https://www.marktplaats.nl/*
// @version 0.9
// @downloadURL https://update.greasyfork.org/scripts/39916/marktplaats%20verberg%20commerciele%20aanbieders.user.js
// @updateURL https://update.greasyfork.org/scripts/39916/marktplaats%20verberg%20commerciele%20aanbieders.meta.js
// ==/UserScript==   

;(() => {

	'use strict';

	/**
	* remove everything that has a Google id
	* @returns {undefined}
	*/
	const removeGoogleStuff = function() {
		const googleElms = document.querySelectorAll('[id*="google"], [id*="adsense"]');
		googleElms.forEach((elm) => {
			if (elm) elm.remove();
		});
	};

	/**
	* remove commercial advertisers
	* @returns {undefined}
	*/
	const removeCommercialResults = function() {
		const allResults = document.querySelectorAll('.search-result');// article row elm
		allResults.forEach((elm) => {
			// check if this elm contains elm with class 'seller-link" this usually contains text 'bezoek website' and is indication it's a commercial vendor
			const isCommercial = elm.querySelector('.seller-link');// will be null if not present
			if (isCommercial) {
				elm.remove();
			}
		})
	};
	
	

	/**
	* initialize all
	* @returns {undefined}
	*/
	const init = function() {
console.log('go');
		removeGoogleStuff();
		removeCommercialResults();
	};

	// kick of the script when all dom content has loaded
	if (document.readyState !== 'loading') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}
})();