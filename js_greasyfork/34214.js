// ==UserScript==
// @name         B&W webpage fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Fix for dull-looking black and white webpages.
// @author       Porama Ruengrairatanaroj
// @match        *://www.mkrestaurant.com/*
// @match        *://www.tescolotus.com/*
// @match        *://www.tops.co.th/*
// @match        *://www.lazada.co.th/*
// @match        *://www.bigc.co.th/*
// @match        *://*.cpfreshmartshop.com/*
// @match        *://scbsonline.settrade.com/*
// @match        *://www.headdaddy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34214/BW%20webpage%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/34214/BW%20webpage%20fix.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    'use strict';

    let grayscaleRegexMatch = /grayscale\([^)]*\)/g;

    let unsetGrayscaleFilter = function(elem) {
        if (elem === null) {
            return false;
        }

        try {
            let elemStyle = window.getComputedStyle(elem);
            var watchThis = false;

            if(elemStyle === null) {
                return false;
            }

            if(elemStyle.filter) {
                let match = elemStyle.filter.match(grayscaleRegexMatch);
                if(match && match.length > 0) {
                    elem.style.setProperty("filter", "unset", "important");
                    watchThis = true;
                }
            }

            if(elemStyle.webkitFilter) {
                let match = elemStyle.webkitFilter.match(grayscaleRegexMatch);
                if(match && match.length > 0) {
                    elem.style.setProperty("-webkit-filter", "unset", "important");
                    watchThis = true;
                }
            }

            return watchThis;
        } catch (e) {
            console.log("Failed to process: " + elem + "(" + e + ")");
            return false;
        }
    };

    let filterObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            console.log("Saw mutation in " + mutation.target + " of type " + mutation.type + " with attribute " + mutation.attributeName + " (ns: " + mutation.attributeNamespace + ") with oldValue " + mutation.oldValue);

            if(mutation.type === "attributes" && mutation.attributeName === "style") {
                unsetGrayscaleFilter(mutation.target);
            }
        });
    });

    let filterObserverConfig = { attributes: true, attributeOldValue: true, attributeFilter: [ 'style' ] };

    unsetGrayscaleFilter(document.body);

    // We can't limit this to <body>, since apparently some ridiculously stupid
    // websites (I'm looking at you, SCB, CP Freshmart) have <div> tags *outside*
    // of the body tag.
    let items = document.getElementsByTagName('*');
    for(var i = 0; i < items.length; ++i) {
        if(unsetGrayscaleFilter(items[i])) {
            filterObserver.observe(items[i], filterObserverConfig);
        }
    }
}, false);