// ==UserScript==
// @name         Theme Grey
// @namespace    http://tampermonkey.net/
// @version      1
// @description  <title>Theme Grey</title>
// @author       You
// @match        https://m.facebook.com/your_information*
// @match        file:///D:/Downloads/Poland/Staly%20Pobyt/facebook/mobile/%D0%92%D0%B0%D1%88%D0%B0%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496065/Theme%20Grey.user.js
// @updateURL https://update.greasyfork.org/scripts/496065/Theme%20Grey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkForElement = (selector, callback, interval = 100, elementFound = false) => {
        const intervalCheck = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                if( !elementFound){
                    elementFound = true;
                    callback(element);
                }
                clearInterval(intervalCheck);
            }
        }, interval);
    };

    checkForElement("span[class*=' _2iep _2iex']", actionsProcessing);

    function actionsProcessing(element){
        let el = document.querySelectorAll("div[class*='x78zum5 xdt5ytf'] span[class*=' _2iep _2iex']")[1]
        el.textContent = "5 мая 2014 г.";

    }
})();