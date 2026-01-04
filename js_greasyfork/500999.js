// ==UserScript==
// @name           carrefour per unit price sorter
// @name:pl        carrefour sortowanie po cenie jednostki
// @namespace      cprn
// @license        GPLv3
// @match          https://*.carrefour.pl/*
// @grant          none
// @version        0.3
// @esversion      11
// @author         cprn
// @run-at         document-idle
// @date           2025-04-26 17:17:26
// @description    Sorts items by price per unit (e.g. `per kg` or `per litre`) in Carrefour online shops in Poland.
// @description:pl Sortuje produkty po cenie za jednostkę (np. za `kg` albo `l`) w sklepie internetowym polskiego Carrefoura.
// @downloadURL https://update.greasyfork.org/scripts/500999/carrefour%20per%20unit%20price%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/500999/carrefour%20per%20unit%20price%20sorter.meta.js
// ==/UserScript==

// vim copy to clipboard:
// map ,r :wa<cr>gg"+yGzz

(function() {
    'use strict';

    const DEBUG = 1;

    function discoverClasses() {
        let priceTag = null;
        ['zł/1 l', 'zł/1 kg'].every(s => {
            let xpath = `//p[contains(., '${s}')]`;
            priceTag = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return priceTag === null;
        });
        if (!priceTag) {
            console.error("Could not find priceTag");
            return null;
        }
        return {
            item: priceTag.parentNode.parentNode.parentNode.parentNode.classList[0],
            perUnitStrip: priceTag.parentNode.classList[0],
            mass: priceTag.parentNode.children[0].classList[0],
            perMass: priceTag.parentNode.previousSibling.children[0].children[0].classList[0],
        };
    }

    function perUnitPrice(e, classes) {
        let perUnit = e.getElementsByClassName(classes.perUnitStrip)[0]?.lastChild;
        let perMass = e.getElementsByClassName(classes.perMass)[0];
        let mass = e.getElementsByClassName(classes.mass)[0]?.lastChild;

        if (!perUnit || !mass) {
            console.debug('unknown price', e);
            return Infinity; // Treat unknowns as very expensive
        } else if (mass.innerText == '1 l' || mass.innerText == '1 kg') {
            var price = ''.concat(perMass.children[0].innerText, '.', perMass.children[1].innerText);
        } else {
            var price = perUnit.innerText.slice(0, -7).replace(',', '.');
        }

        return parseFloat(price);
    }

    function sortItems() {
        const classes = discoverClasses();
        if (!classes) {
            console.error("cprn: no classes found");
            return;
        }

        const items = Array.from(document.getElementsByClassName(classes.item));
        const parent = items[0]?.parentNode;
        if (!parent) {
            console.error("cprn: no parent found");
            return;
        }

        DEBUG && console.debug('cprn: first item', items[0])
        DEBUG && console.debug('cprn: items container', items[0].parentNode)
        DEBUG && console.debug('cprn: classes\n--------------------\n' +
            'item: ' + classes.item, document.getElementsByClassName(classes.item)[0], '\n' +
            'perUnitStrip: ' + classes.perUnitStrip, document.getElementsByClassName(classes.perUnitStrip)[0], '\n' +
            'mass: ' + classes.mass, document.getElementsByClassName(classes.mass)[0], '\n' +
            'perMass: ' + classes.perMass, document.getElementsByClassName(classes.perMass)[0], '\n' +
            'perUnit: ', perUnitPrice(items[0], classes )
        );

        console.log('cprn: solving world hunger...')
        items.sort((a, b) => perUnitPrice(a, classes) - perUnitPrice(b, classes));
        items.forEach(item => parent.appendChild(item));
        console.log('cprn: done')
    }

    function waitForPage() {
        const check = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(check);
                setTimeout(sortItems, 1000);
            }
        }, 300);
    }

    waitForPage();
})();