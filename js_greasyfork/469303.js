// ==UserScript==
// @name         Ratio Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate ratio as a percentage between two HTML elements and display the result.
// @author       Bolt Again
// @match        https://www.pixiv.net/dashboard/works*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469303/Ratio%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/469303/Ratio%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateRatio() {
        var elements = document.querySelectorAll('.sc-a16hc8-4.jBjeDE');

        for (var i = 0; i < elements.length; i++) {
            var parentElement = elements[i];
            var bookmarkElement = parentElement.querySelector('a[title="Bookmarks"]');
            var viewsElement = parentElement.querySelector('a[title="Views"]');

            var bookmarkValue = bookmarkElement.querySelector('span.sc-1tt9fda-1.dkkGqt').textContent;
            var viewsValue = viewsElement.querySelector('span.sc-1tt9fda-1.dkkGqt').textContent;

            var ratio = Math.round((parseNumber(bookmarkValue) / parseNumber(viewsValue)) * 100);

            var ratioElement = document.createElement('a');
            ratioElement.title = 'ratio';
            ratioElement.className = bookmarkElement.className;
            ratioElement.href = bookmarkElement.href;

            var innerDiv = document.createElement('div');
            innerDiv.className = bookmarkElement.querySelector('div.sc-bQCEYZ.irmCui').className;

            var innerDivContent = `
                <div width="16" class="${bookmarkElement.querySelector('div.sc-eEVmNe.ggcxgL').className}">
                    <div class="${bookmarkElement.querySelector('div.sc-fmdNqN.hyACbC').className}">
                        <pixiv-icon name="${bookmarkElement.querySelector('pixiv-icon').getAttribute('name')}" class="${bookmarkElement.querySelector('pixiv-icon').className}"></pixiv-icon>
                    </div>
                </div>
                <div class="${bookmarkElement.querySelector('div.sc-fXgAZx.fwvUqi').className}">
                    <span class="${bookmarkElement.querySelector('span.sc-1tt9fda-1.dkkGqt').className}">${ratio}%</span>
                </div>`;

            innerDiv.innerHTML = innerDivContent;
            ratioElement.appendChild(innerDiv);

            parentElement.appendChild(ratioElement);
        }
    }

    function parseNumber(value) {
        return parseFloat(value.replace(/,/g, ''));
    }

    // Apply custom styles
    GM_addStyle(`
        .sc-a16hc8-4.jBjeDE a[title="ratio"] span {
            color: green !important;
            font-weight: bold !important;
        }
    `);

    function waitForElementToLoad() {
        var targetElement = document.querySelector('nav.sc-xhhh7v-0.kYtoqc');

        if (targetElement) {
            setTimeout(function() {
                calculateRatio();
            }, 1000);
        } else {
            setTimeout(waitForElementToLoad, 100);
        }
    }

    waitForElementToLoad();
})();
