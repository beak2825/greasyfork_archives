// ==UserScript==
// @name         bonappetit bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  haha bye
// @author       Threeskimo
// @match        https://www.bonappetit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonappetit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488299/bonappetit%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/488299/bonappetit%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeElementAttributes(elements) {
        elements.forEach(function(element) {
            element.setAttribute('data-journey-hook', 'block');
            element.setAttribute('data-testid', 'block');
        });
    }

    var divs = document.querySelectorAll('div');
    changeElementAttributes(divs);

    var mains = document.querySelectorAll('main');
    changeElementAttributes(mains);

    function removeDiv() {
        var divToRemove = document.evaluate("/html/body/div[1]/div/div[7]/div[1]/div/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (divToRemove) {
            divToRemove.parentNode.removeChild(divToRemove);
        }
    }

    setInterval(removeDiv, 100);
})();