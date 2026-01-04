// ==UserScript==
// @name         获取VMware官方ESXI版本发布所有的URL
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extract all URLs with a specific prefix and convert them to full URLs, add a button to display them
// @author       You
// @match        https://docs.vmware.com/en/VMware-vSphere/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517772/%E8%8E%B7%E5%8F%96VMware%E5%AE%98%E6%96%B9ESXI%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E6%89%80%E6%9C%89%E7%9A%84URL.user.js
// @updateURL https://update.greasyfork.org/scripts/517772/%E8%8E%B7%E5%8F%96VMware%E5%AE%98%E6%96%B9ESXI%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E6%89%80%E6%9C%89%E7%9A%84URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract URLs with a specific prefix and convert them to full URLs
    function extractAndConvertUrls(prefix, baseurl) {
        // Get all anchor tags
        var links = document.getElementsByTagName('a');
        var matchingUrls = [];

        // Iterate over all links
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href');
            // Check if the href starts with the specified prefix
            if (href && href.startsWith(prefix)) {
                // Append the base URL to the prefix to form a full URL
                var fullUrl = baseurl + href;
                matchingUrls.push(fullUrl);
            }
        }

        // Return the matching URLs
        return matchingUrls;
    }

    // Function to create and display the button
    function createButton() {
        // Create a new button
        var button = document.createElement('button');
        button.textContent = 'Show VMware URLs';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = '1000';

        // Add event listener to the button
        button.addEventListener('click', function() {
            var matchingUrls = extractAndConvertUrls(urlPrefix, baseUrl);
            // Open a new window with the URLs
            var urlWindow = window.open('', '_blank', 'width=600,height=400,scrollbars=yes');
            var urlDocument = urlWindow.document;
            urlDocument.write('<h1>VMware URLs</h1>');
            urlDocument.write('<ul>');
            matchingUrls.forEach(function(url) {
                urlDocument.write('<li><a href="' + url + '" target="_blank">' + url + '</a></li>');
            });
            urlDocument.write('</ul>');
            urlDocument.close();
        });

        // Append the button to the body
        document.body.appendChild(button);
    }

    // Specify the prefix to search for
    var urlPrefix = '/en/VMware-vSphere/8.0/rn/vsphere-esxi';
    // Specify the base URL
    var baseUrl = 'https://docs.vmware.com';

    // Call the function to create the button
    createButton();
})();