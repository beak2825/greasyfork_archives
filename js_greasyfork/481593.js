// ==UserScript==
// @name        Douban2ZJUlib
// @namespace   https://book.douban.com/subject/36099425/
// @author       AlainAllen
// @description Finds and logs ISBN numbers from the current webpage
// @match     http://book.douban.com/subject/*
// @match     https://book.douban.com/subject/*
// @version     0.4
// @grant       GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481593/Douban2ZJUlib.user.js
// @updateURL https://update.greasyfork.org/scripts/481593/Douban2ZJUlib.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find the last ISBN in the element with ID 'info'
    function findLastISBNInElement(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            var isbnPattern = /(\d{0,3}-?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX])/g; // Pattern to match ISBN
            var matches = element.innerText.match(isbnPattern);
            if (matches && matches.length > 0) {
                var lastIsbn = matches[matches.length - 1];
                console.log('ISBN on douban:', lastIsbn);
                return lastIsbn;
            } else {
                console.log('ISBN not found');
                return null;
            }
        } else {
            console.log('Element with ID ' + elementId + ' not found');
            return null;
        }
    }

    // Function to check the ISBN by forming a URL and loading it
    function checkISBN(isbn) {
        if (isbn) {
            var baseUrl = 'https://opac.zju.edu.cn/F/Q84DGEB5U3IFM7NN9FLYXVXPJHUL6LSU4E8AYD81KQRRJ5LNRF-32238?find_base=ZJU01&find_base=ZJU09&func=find-m&find_code=ISB&request=';
            var checkUrl = baseUrl + isbn.replace(/-/g, '') + '&local_base=ZJU01'; // Remove hyphens from ISBN

            GM_xmlhttpRequest({
                method: 'GET',
                url: checkUrl,
                onload: function(response) {
                    // Check the status of the response
                    if (response.status === 200) {
                        console.log("OPAC webpage loaded successfully.");

                        // Success checking part
                        var isbnRegex = /ISBN(?:-1[03])?:?\s*(\d{0,3}-?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX])/g;
                        var allIsbnMatches = response.responseText.match(isbnRegex);
                        if (allIsbnMatches && allIsbnMatches.length > 0) {
                            // Get the last ISBN from the matches
                            var lastIsbn = allIsbnMatches[allIsbnMatches.length - 1];
                            console.log("Last ISBN found: " + lastIsbn);
                            // Append the checked URL to the 'info' part of Douban
                            appendLinkToInfo(checkUrl);
                        } else {
                            console.log("No ISBN found on the OPAC page.");
                        }
                    } else {
                        console.log("Failed to load the OPAC webpage. Status code: " + response.status);
                    }
                },
                onerror: function(error) {
                    console.log("Error loading the OPAC webpage:", error);
                }
            });
        } else {
            console.log('No ISBN provided to check.');
        }
    }


    // Function to append the checked URL to the 'info' part of Douban
    function appendLinkToInfo(url) {
        var infoElement = document.getElementById('info');
        if (infoElement) {
            var link = document.createElement('a');
            var span = document.createElement('span');
            span.className = 'pl';
            span.textContent = '图书馆: ';
            infoElement.appendChild(span);
            link.href = url;
            link.textContent = '馆藏链接';
            infoElement.appendChild(link);
        } else {
            console.log('Info element not found on Douban page.');
        }
    }

    // Example usage
    var lastIsbn = findLastISBNInElement('info');
    checkISBN(lastIsbn);
})();