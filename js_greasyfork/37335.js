// ==UserScript==
// @name         Immobilienscout24 warmiete show
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays warm rent on search page in addition to cold rent
// @author       Abimbola Idowu
// @match        https://www.immobilienscout24.de/Suche/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37335/Immobilienscout24%20warmiete%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/37335/Immobilienscout24%20warmiete%20show.meta.js
// ==/UserScript==

/* jshint asi:true */
(function() {
    'use strict';
    main()
})();

function main() {
    'use strict'
    Promise.resolve()
        .then(retrieveOffers)
        .then(function(angeboten) {
        return angeboten.each(function() {
            var currElement = $(this)
            var exposeId = currElement.data('id')
            return visitOfferPage(exposeId)
                .then(retriveWarmPrice)
                .then(function(warmPrice) {
                var warmPriceElem = '' +
                    '<dl class="grid-item result-list-entry__primary-criterion " role="presentation">' +
                    '<dd class="font-nowrap font-line-xs">' + warmPrice + ' </dd>' +
                    '<dt class="font-s onlyLarge">Warmiete</dt>' +
                    '</dl>' +
                    ''
                currElement.find('div.grid.grid-flex.gutter-horizontal-l.gutter-vertical-s > dl:nth-child(1)').after(warmPriceElem)
            })
        })
    })
}

(function setupWatchers() {
    var debouncedMainFn = debounce(main, 300)

    var observer = new MutationObserver(debouncedMainFn);

    // Notify if childNodes is removed or added.
    var observerConfig = {
        childList: true,
    };

    // Node, config
    // In this case we'll listen to all changes to body and child nodes
    var listingSelector = '#resultListItems'
    var targetNode = $(listingSelector).get(0)
    observer.observe(targetNode, observerConfig);
}())

function retrieveOffers() {
    var selector = '#resultListItems > li.result-list__listing ';
    return $(selector)
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function visitOfferPage(exposeId) {
    // TODO add cache
    var url = 'https://www.immobilienscout24.de/expose/' + exposeId;
    return fetch(url)
        .then(function(res) {
        return res.text()
    })
}

function retriveWarmPrice(rawHtml) {
    var offerPageHtml = $('<div>').html(rawHtml)
    var warmPriceSelector = '#is24-content > div.grid-item.padding-desk-right-xl.desk-two-thirds.lap-one-whole.desk-column-left.flex-item.palm--flex__order--1.lap--flex__order--1 > div.is24-ex-details.main-criteria-headline-size.two-column-layout > div.criteriagroup.flex.flex--wrap.criteria-group--spacing.padding-top-l > div:nth-child(3) > div > div.grid-item.lap-one-half.desk-one-half.padding-right-s > dl:nth-child(4) > dd'
    return offerPageHtml.find(warmPriceSelector).text().trim()
}