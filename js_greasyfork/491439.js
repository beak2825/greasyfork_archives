// ==UserScript==
// @name         YSE number words
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  easier number reading for funny stock day
// @author       Anonymous Mogul
// @match        https://boards.4chan.org/yse.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491439/YSE%20number%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/491439/YSE%20number%20words.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function number2Words(numberString) {
        if (!numberString) {
            return numberString;
        }
        let resultString = '';
        const numberNames = [
            "",
            "thousand",
            "million",
            "billion",
            "trillion",
            "quadrillion",
            "lol you're not seeing quintillion timmy"
        ];
        let numberNameIndex = 0
        while (numberString.length >= 4) {
            let cut = numberString.substr(-3, 3);
            while (cut[0] == "0") {
                cut = cut.replace("0", "");
            }
            numberString = numberString.slice(0, -3);
            if (cut) {
                resultString = ", " + cut + " " + numberNames[numberNameIndex] + resultString;
            }
            numberNameIndex += 1;
        }
        resultString = numberString + " " + numberNames[numberNameIndex] + resultString;
        return resultString;
    }

    function handleLi(oldInnerText) {
        const splitArr = oldInnerText.split('×');
        splitArr[1] = number2Words(splitArr[1]);
        return splitArr.join('×');
    }

    let summary = document.getElementById('js-summary');
    const stocksObserver = new MutationObserver((mutationList, observer) => {
        const ulMutation = mutationList[0];
        const ulElement = ulMutation.addedNodes[0];
        for (const liChild of ulElement.children) {
            liChild.innerText = handleLi(liChild.innerText)
        }
    });
    const config = { childList: true };

    let valuation = document.getElementById('js-f-value');
    const valuationObserver = new MutationObserver((mutationList, observer) => {
        if (valuation.innerText.match(/.*[a-z].*/g)) {
            return;
        }
        valuation.innerText = number2Words(valuation.innerText);
    });

    stocksObserver.observe(summary, config);
    valuationObserver.observe(valuation, config);
})();