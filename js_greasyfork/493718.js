// ==UserScript==
// @name        render-state.to Link Decoder and Support Button
// @namespace   Violentmonkey Scripts
// @match       https://render-state.to/p/*
// @match       https://render-state.to/item/*
// @match       https://render-state.to/thread/*
// @grant       none
// @version     1.3
// @author      Schaken
// @description Render-State.to Link Decoder and Support Button
// @icon        https://render-state.to/wp-content/uploads/2020/09/cropped-favicon-290x290.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493718/render-stateto%20Link%20Decoder%20and%20Support%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493718/render-stateto%20Link%20Decoder%20and%20Support%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to decode base64 string
    function decodeBase64(base64) {
        return decodeURIComponent(escape(window.atob(base64)));
    }

      function injectCSS() {
        const css = `
            .btnd-link {
                background: #557a95;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                color: #fff !important;
                font-size: 16px;
                font-weight: 700;
                text-decoration: none !important;
                cursor: pointer;
                transition: .3s;
                padding: 10px 30px;
            }
        `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Function to process links
    function processLinks() {
        document.querySelectorAll('a[href]').forEach(function(link) {
            const href = link.getAttribute('href');
            if (href.includes('https://render-state.to/download/?link=')) {

                const base64Part = href.split('=')[1];
                const decodedUrl = decodeBase64(base64Part);
                link.href = decodedUrl;
                link.textContent = link.textContent + " (Decoded)"; // Optionally update the link text
            }
        });
    }

    // Function to extract the domain name from a URL
    function getDomainName(url) {
        const a = document.createElement('a');
        a.href = url;
        return a.hostname.replace('www.', '');
    }

    // Function to create a support link
    function createSupportLink() {
        const supportLinkParagraph = document.querySelector('p span[style="color: #9c9c9c;"]');
        if (supportLinkParagraph) {
            const supportLink = supportLinkParagraph.textContent;
            const supportLinkElement = document.createElement('a');
            const domainName = getDomainName(supportLink);
            supportLinkElement.textContent = domainName;
            supportLinkElement.className = 'btnd-link'; // Add the specified class
            supportLinkElement.style.marginTop = '10px'; // Adjust as needed
            supportLinkElement.href = supportLink;
            supportLinkElement.target = '_blank'; // Open in a new window
            // Clear the text content of the span before appending the link
            supportLinkParagraph.textContent = '';
            // Append the link to the span
            supportLinkParagraph.appendChild(supportLinkElement);
        }
    }

    // Run the script after the page has loaded
    window.addEventListener('load', function() {
        injectCSS();
     //   processLinks(); // They encrypted it as well. so this doesnt work anymore
        createSupportLink();
    });
})();
