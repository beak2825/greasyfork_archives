// ==UserScript==
// @name         Paid4link skip original
// @namespace    http://tampermonkey.net/
// @version      2025-03-20
// @description  Paid4link skip ads
// @author       JailRoom

// @match        https://tutorialsaya.com/*
// @match        https://indobo.com/*
// @match        https://link.paid4link.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530371/Paid4link%20skip%20original.user.js
// @updateURL https://update.greasyfork.org/scripts/530371/Paid4link%20skip%20original.meta.js
// ==/UserScript==

(function() {
    'use strict';




    if (window.location.hostname === 'indobo.com') {
        document.cookie = "multiple_pages=2; path=/;"; // You can specify additional attributes like 'expires' or 'secure' if needed
    }

    function hideAllArticleTags() {

        // Select all <article> elements in the document
        const articles = document.querySelectorAll('article');
        // Loop through the <article> elements and hide them
        articles.forEach(article => {
            article.style.display = 'none'; // Hide the article
        });
    }

    function hideGcseElements() {

        // Select all elements in the document
        const elements = document.querySelectorAll('[id^="___gcse_"]');
        // Loop through the elements and hide them
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    function hide(selector) {
        try {
            document.querySelector(selector).style.display = 'none';
        } catch {
            return;
        }
    }

    function show(selector) {
        try {
            document.querySelector(selector).style.display = 'block';
        } catch {
            return;
        }
    }

    function redirectWpSafe() {
        const wpsafeLinkDiv = document.getElementById('wpsafe-link');
        if (wpsafeLinkDiv) {
            // Find the <a> tag within the <div>
            const linkElement = wpsafeLinkDiv.querySelector('a');

            if (linkElement) {
                // Extract the URL from the onclick attribute
                const onclickValue = linkElement.getAttribute('onclick');
                const urlMatch = onclickValue.match(/window\.open\('([^']+)'/);

                if (urlMatch && urlMatch[1]) {
                    const extractedUrl = urlMatch[1];
                    console.log('Extracted URL:', extractedUrl);
                    document.location.href = extractedUrl;
                    // You can do something with the extracted URL here
                } else {
                    console.log('No URL found in onclick attribute.');
                }
            } else {
                console.log('No <a> tag found within the <div>.');
            }
        } else {
            console.log('No <div> with id "wpsafe-link" found.');
        }
    }

    function extractIndoboURL() {
        // Select the script element containing the URL
        const scriptTags = document.querySelectorAll('script');

        scriptTags.forEach(script => {
            // Check if the script contains the URL
            const scriptContent = script.textContent || script.innerHTML;
            const urlMatch = scriptContent.match(/window\.location\.href\s*=\s*"(https:\/\/indobo\.com\?safelink_redirect=[^"]+)"/);
            if (urlMatch && urlMatch[1]) {
                const extractedUrl = urlMatch[1];
                document.location.href = extractedUrl;
                console.log('Extracted URL:', extractedUrl);
                // You can do something with the extracted URL here
            }
        });
    }

    function hideSpecificDivs() {

        hide('[id=adb]');
        show('[id=wpsafe-link]');
        hide('[id=wpsafe-wait1]');
        hide('[id=wpsafe-wait2]');
        hide('[id=content class=gmr-content]');
        hide('[id=site-container]');
        hide('[id=footer-container]');

        const headerDiv = document.querySelector('.td-header-wrap.td-header-style-3');
        if (headerDiv) {
            headerDiv.style.display = 'none'; // Hide the header div
        }

        // Hide the footer div
        const footerDiv = document.querySelector('.td-footer-container.td-container');
        if (footerDiv) {
            footerDiv.style.display = 'none'; // Hide the footer div
        }
    }

    function paid4linkGo() {
        // Select the <div> with the ID 'content-to-shows'
        const contentDiv = document.getElementById('content-to-shows');

        if (contentDiv) {
            // Find the <a> tag within the <div>
            const linkElement = contentDiv.querySelector('a');

            if (linkElement) {
                // Extract the href attribute (URL) from the <a> tag
                const url = linkElement.getAttribute('href');

                // Check if the URL does not start with "https://"
                if (!url.startsWith('https://')) {
                    console.log('URL does not start with "https://":', url);
                    linkElement.href = 'javascript:void()';
                    // You can return or handle this case as needed
                } else {
                    if (url.startsWith('https://youtubeiklan.com/') || url.startsWith('https://atid.me')) {
                        linkElement.href = 'javascript:void()';
                        return;
                    }
                    console.log('Extracted URL:', url);
                    // Prompt the user with a confirmation dialog
                    const userConfirmed = confirm(`Go to URL: ${url}?`);

                    if (userConfirmed) {
                        // If the user clicks "OK", navigate to the URL
                        window.location.href = url;
                    } else {
                        // If the user clicks "Cancel", do nothing
                        console.log('User chose not to go to the URL.');
                        // linkElement.href='javascript:void()';
                    }
                    // Proceed with the URL as it starts with "https://"
                }
            } else {
                console.log('No <a> tag found within the <div>.');
            }
        } else {
            console.log('No <div> with id "content-to-shows" found.');
        }
    }

    function paid4link() {
        if (window.location.hostname === 'link.paid4link.com') {
            hide('div>div.card.border-primary.mb-3');
            hide('div>div.blog-item');
            hide('div.banner');
            const countdownElement = document.getElementById('timer');
            if (countdownElement) {
                countdownElement.textContent = '0';
            }
            paid4linkGo();
        }
    }

    function run() {
        extractIndoboURL();
        hideAllArticleTags();
        hideSpecificDivs();
        hideGcseElements();
        redirectWpSafe();
        paid4link();

    }
    // Run the functions to hide elements

    run();
    // Optional: Observe for changes in the DOM and hide new elements
    const observer = new MutationObserver(() => {
        run();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Script executed successfully");

})();

console.log("Script executed zz");