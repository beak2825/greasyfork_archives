// ==UserScript==
// @name         Blogspot Warning Bypass
// @namespace    http://blogger.com
// @version      1.25
// @description  bypass the content warning on blogspot/blogger sites
// @author       elisewindbloom
// @match        *://*/*
// @icon         https://www.blogger.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493212/Blogspot%20Warning%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/493212/Blogspot%20Warning%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the webpage is a Blogger/Blogspot site
    function isBloggerPage() {
        // Check for specific Blogspot attributes or meta tags
        const blogspotAttributes = ['data-blogspot-url', 'data-blogspot-url-original'];
        const hasBlogspotAttributes = blogspotAttributes.some(attr => document.querySelector(`[${attr}]`));

        // Check for specific Blogspot meta tags
        const hasBlogspotMetaTag = Array.from(document.querySelectorAll('meta[name="generator"]'))
        .some(tag => tag.getAttribute('content').toLowerCase().includes('blogger'));

        // Combine all detection methods
        return (
            hasBlogspotAttributes ||
            hasBlogspotMetaTag
        );
    }

    // Function to remove the injected iframe from the page
    function blockInjectedIframe() {
        var injectedIframe = document.getElementById('injected-iframe');
        if (injectedIframe) {
            injectedIframe.parentNode.removeChild(injectedIframe);
            console.log('Injected iframe with ID "injected-iframe" blocked');
        }
    }

    // Function to delete the body style
    function deleteBodyStyle() {
        var bodyStyleNode = document.evaluate('/html/body/style', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (bodyStyleNode) {
            bodyStyleNode.parentNode.removeChild(bodyStyleNode);
            console.log('Node with XPath /html/body/style deleted');
        }
    }

    // Check if the page is a Blogger page before executing the blocking and deletion functions
    if (isBloggerPage()) {
        blockInjectedIframe();
        deleteBodyStyle();
        console.log('Content Warning bypass complete');
    }
})();

