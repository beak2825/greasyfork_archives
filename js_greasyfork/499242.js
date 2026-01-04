// ==UserScript==
// @name         404
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Checks links for 404 errors or specific phrases on linked pages.
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/499242/404.user.js
// @updateURL https://update.greasyfork.org/scripts/499242/404.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const errorPhrases = [
        "Product not found",
        "This item is currently unavailable",
        "404 Error",
        "Page not found",
        "Sorry, the page you are looking for does not exist.",
        "We couldn't find the page you're looking for.",
        "OH NO! LOOKS LIKE THAT PAGE DOESN’T EXIST ANYMORE, BUT YOU CAN TRY OUR SEARCH."
    ];

    const processedUrls = new Set();

    function checkThirdPage(url, originalLink) {
        console.log(`Checking third page: ${url}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const p = document.createElement("p");
                p.style.marginLeft = "10px";
                p.style.fontWeight = "bold";
                p.style.fontStyle = "italic";
                const foundError = response.status === 404 || errorPhrases.some(phrase => response.responseText.includes(phrase));

                if (foundError) {
                    console.log(`404 found at: ${url}`);
                    p.textContent = "404";
                    p.style.color = "purple";
                } else {
                    console.log(`No errors at: ${url}`);
                    p.textContent = "No Error";
                    p.style.color = "green";
                }

                originalLink.parentNode.insertBefore(p, originalLink.nextSibling);
            },
            onerror: function() {
                console.error(`Error fetching ${url}`);
                const p = document.createElement("p");
                p.style.color = "orange";
                p.style.marginLeft = "10px";
                p.style.fontWeight = "bold";
                p.style.fontStyle = "italic";
                p.textContent = "Error";
                originalLink.parentNode.insertBefore(p, originalLink.nextSibling);
            }
        });
    }

    function processSecondPage(url, originalLink) {
        console.log(`Processing second page: ${url}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const inputElement = doc.querySelector("#SourceUrl");

                if (inputElement && inputElement.value) {
                    console.log(`Found third page URL: ${inputElement.value}`);
                    checkThirdPage(inputElement.value, originalLink);
                } else {
                    console.error(`No input element found at: ${url}`);
                    const p = document.createElement("p");
                    p.style.color = "orange";
                    p.style.marginLeft = "10px";
                    p.style.fontWeight = "bold";
                    p.style.fontStyle = "italic";
                    p.textContent = "No SourceUrl";
                    originalLink.parentNode.insertBefore(p, originalLink.nextSibling);
                }
            },
            onerror: function() {
                console.error(`Error fetching ${url}`);
                const p = document.createElement("p");
                p.style.color = "orange";
                p.style.marginLeft = "10px";
                p.style.fontWeight = "bold";
                p.style.fontStyle = "italic";
                p.textContent = "Error";
                originalLink.parentNode.insertBefore(p, originalLink.nextSibling);
            }
        });
    }

    function init() {
        console.log("Script initialized");
        $('td a[href*="/Admin/CompareBag/EditBag/"]').each(function() {
            const originalLink = $(this)[0];
            const secondPageUrl = originalLink.href;
            console.log(`Found link: ${secondPageUrl}`);

            if (secondPageUrl && !processedUrls.has(secondPageUrl)) {
                processedUrls.add(secondPageUrl);
                processSecondPage(secondPageUrl, originalLink);
            }
        });
    }

    $(document).ready(init);
})();
