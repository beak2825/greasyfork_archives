// ==UserScript==
// @name         YouTube Add filename formatted title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds and modifies an filename formatted title on Youtube above the normal one
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469799/YouTube%20Add%20filename%20formatted%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/469799/YouTube%20Add%20filename%20formatted%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastH1Text = '';
    let checkCounter = 0;
    let changeCounter = 0;
    let intervalId;

    function modifyElement(element, textContents ) {
        var usernameLink = document.querySelectorAll('a[href^="/@"]');
        usernameLink = usernameLink[0]

        var aElements = document.querySelectorAll('a[href^="/@"]');
        var linkTexts = Array.from(aElements)
            .filter(a => !a.querySelector('img'))
            .map(a => a.textContent.trim());

        if (linkTexts.length > 0) {
            usernameLink = linkTexts[0]
        }

        if (usernameLink) {
            var username = usernameLink;
            element.textContent = textContents + ' - ' + username;
        }

        element.textContent = element.textContent.replace(/[^a-zA-Z0-9\-\.\‘\'\"\“\’\s]/g, '-');
        element.textContent = element.textContent.replace(/[\‘\'\"\“\’]/g, '');
        element.textContent = element.textContent.replace(/([\-]{2,99})+/g, '-');
        element.textContent = element.textContent.replace(/([\s]{2,99})+/g, ' ');
        element.textContent = element.textContent.replace(/(\- \-)+/g, ' - ');
        element.textContent = element.textContent.replace(/([\s]{2,99})+/g, ' ');
        element.textContent = element.textContent.replace(/[\[\]{}()<>〈〉《》「」『』【】]/g, '()');

        console.log('Modified element: ', element.textContent);
    }

    function checkElements() {
        var h1Elements = document.getElementsByTagName('h1');
        if (h1Elements.length > 0) {
            for (var i = 0; i < h1Elements.length; i++) {
                if (!h1Elements[i].previousElementSibling || h1Elements[i].previousElementSibling.tagName !== 'H2') {
                    var h2Element = document.createElement('h2');
                    h2Element.textContent = " ";
                    h1Elements[i].parentNode.insertBefore(h2Element, h1Elements[i]);
                }
                h2Element = h1Elements[i].previousElementSibling;
                modifyElement(h2Element, h1Elements[i].textContent);

                // Track text changes in H1
                if (h1Elements[i].textContent !== lastH1Text) {
                    lastH1Text = h1Elements[i].textContent;
                    checkCounter = 0;
                    changeCounter++;
                } else {
                    checkCounter++;
                }
            }

            // Adjust checking frequency
            clearInterval(intervalId);
            if (checkCounter >= 100) {
                intervalId = setInterval(checkElements, 60 * 1000); // check every minute
            } else if (changeCounter >= 3) {
                intervalId = setInterval(checkElements, 10 * 1000); // check every 10 seconds
                changeCounter = 0;
            } else {
                intervalId = setInterval(checkElements, 10 * 1000); // default: check every 10 seconds
            }
        }
    }

    intervalId = setInterval(checkElements, 2 * 1000);
})();
