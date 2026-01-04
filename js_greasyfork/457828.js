// ==UserScript==
// @name         Google Calendar Max Width
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add max width to Google Calendar web version
// @author       You
// @match        https://calendar.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457828/Google%20Calendar%20Max%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/457828/Google%20Calendar%20Max%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    setTimeout(() => {
        const el = getElementByXpath("/html/body/div[2]/div[1]/div[1]/div[2]/div[2]");
        console.log(el)
        el.style.maxWidth = '1200px';
    }, 500)

})();