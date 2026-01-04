// ==UserScript==
// @name         Link Replacer - Multiple Elements
// @namespace    http://your.namespace.com
// @version      1.4
// @description  Replace a specific string in links on a webpage based on multiple text elements
// @author       Ysn
// @match        https://www.palabrasaleatorias.com/random-words.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481015/Link%20Replacer%20-%20Multiple%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/481015/Link%20Replacer%20-%20Multiple%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace these values with your specific string and replacement string
    var replacementString = 'https://www.google.com/search?q=';

    // Function to retrieve the text content of a specific element using XPath
    function getTextContent(elementXPath) {
        var element = document.evaluate(elementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element) {
            console.log(element.textContent);
            return element.textContent;
        } else {
            console.error('Unable to find the element with XPath:', elementXPath);
            return '';
        }
    }

    // Function to replace the specific string in links using XPath for multiple text elements
    function replaceLinksForMultipleElements(linkXPathPattern, textElementXPathPattern) {
        var links = document.evaluate(linkXPathPattern, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < links.snapshotLength; i++) {
            var link = links.snapshotItem(i);
            var href = link.getAttribute('href');

            if (href) {
                var textElementXPath = textElementXPathPattern.replace('[X]', '[' + (i + 1) + ']');
                var word = getTextContent(textElementXPath);
                var newHref = 'https://www.google.com/search?q=define ' + word;
                link.setAttribute('href', newHref);
            }
        }
    }

    // Run the replaceLinksForMultipleElements function with your specific XPaths when the page is loaded
    var linkXPathPattern = '//a[contains(@href, ".en/")]'; // Example XPath to select all anchor elements, customize as needed
    var textElementXPathPattern = '/html/body/center/center/table[1]/tbody/tr/td/div[X]'; // XPath pattern for your text elements

    replaceLinksForMultipleElements(linkXPathPattern, textElementXPathPattern);

    // Optionally, you can also run the replaceLinksForMultipleElements function when the page content changes (e.g., for dynamic websites)
    // var observer = new MutationObserver(function() {
    //     replaceLinksForMultipleElements('//a[contains(@href, ".en/")]', '/html/body/center/center/table[1]/tbody/tr/td/div[X]');
    // });
    // observer.observe(document.body, { subtree: true, childList: true });
})();
