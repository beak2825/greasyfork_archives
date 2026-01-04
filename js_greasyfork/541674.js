// ==UserScript==
// @name            Otodom price display
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Show full rental price on every announcment
// @description:pl  Pokaż pełną cenę wynajmu dla każdego ogłoszenia
// @author          FridayDeploy
// @match           https://www.otodom.pl/*
// @icon            https://statics.otodom.pl/static/otodompl/naspersclassifieds-regional/verticalsre-atlas-web-otodompl/static/img/favicon.svg
// @grant           none
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/541674/Otodom%20price%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/541674/Otodom%20price%20display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isListingDisplayed() {
        return document.querySelector('ul[data-sentry-source-file="Listing.tsx"]') !== null
    }

    function getPricesForNodeChildren(nodeChildren) {
        const mainPrice = nodeChildren[0].innerText.replaceAll(/\s+/g, '').match(/\d+/)
        const rentalPrice = nodeChildren[1].innerText.replaceAll(/\s+/g, '').match(/\d+/)
        return [mainPrice === null ? null : mainPrice[0], rentalPrice === null ? null : rentalPrice[0]]
    }

    function areBothPriceShown(nodeChildren) {
        if(nodeChildren.length != 2 || !nodeChildren[1].innerText.includes('czynsz:')) {
            return false
        }

        const prices = getPricesForNodeChildren(nodeChildren)

        if(prices[0] == null || prices[1] == null || prices[1] == "0") {
            return false
        }

        return true
    }

    function modifyWrapperDisplay(nodeChildren, wrapper) {
        const prices = getPricesForNodeChildren(nodeChildren)

        const newNode = document.createElement('span')
        newNode.style['font-size'] = '19px'
        newNode.style['font-weight'] = 'bold'
        newNode.style['color'] = 'green'
        newNode.style['margin-right'] = '15px'
        newNode.innerText = parseInt(prices[0]) + parseInt(prices[1]) + " zł"

        nodeChildren[0].style['font-size'] = '12px'

        wrapper.prepend(newNode)
    }

    async function waitForListing() {
        const tries = 20
        for (let i=0; i<tries; i++) {
            if(isListingDisplayed()){
                main()
                return
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
    }

    function attachObservers() {
        let previousUrl = location.href
        new MutationObserver((mutations, observer) => {
            if (location.href !== previousUrl) {
                previousUrl = location.href
                waitForListing()
            }
        })
            .observe(document, { subtree: true, childList: true });
    }

    function main() {
        const allWrappers = document.querySelectorAll('div[data-sentry-source-file="Price.tsx"]')
        for (const wrapper of allWrappers) {
            const nodeChildren = wrapper.childNodes
            if(areBothPriceShown(nodeChildren)) {
                modifyWrapperDisplay(nodeChildren, wrapper)
            }
        }
    }

    main()
    attachObservers()
})();