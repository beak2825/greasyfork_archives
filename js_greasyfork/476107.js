// ==UserScript==
// @name        Auto load in kleinanzeigen
// @namespace   Violentmonkey Scripts
// @match       https://www.kleinanzeigen.de/*
// @grant       none
// @version     1.1
// @author      Janusk22
// @description 7.12.2022, 18:58:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476107/Auto%20load%20in%20kleinanzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/476107/Auto%20load%20in%20kleinanzeigen.meta.js
// ==/UserScript==


function auto_load() {
    var currentURL = window.location.href;
    var isLoading = false;
    var page1Results = document.querySelector("#srchrslt-adtable");
    //increment the page for the next results
    function incrementPageNumber(url) {
        // Define a regular expression to match "seite:X" where X is a number
        var regex = /seite:(\d+)/;

        // Check if the URL contains the pattern
        if (!regex.test(url)) {
            // If the pattern is not found, add "seite:1/" to the beginning of the URL
            url = url.replace(/\/([^/]+)\/?$/, '/seite:1/$1');
        } else {
            url = url.replace(regex, function(match, pageNumber) {
                // Parse the matched pageNumber as an integer, increment it by 1, and convert it back to a string
                var incrementedPage = (parseInt(pageNumber, 10) + 1).toString();
                // Replace the matched part in the URL with the incremented value
                return "seite:" + incrementedPage;
            });
        }
        return url;
    }

    function isAtBottomOfPage() {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        var pageHeight = document.documentElement.scrollHeight;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return scrollPosition + windowHeight >= pageHeight;
    }

    // Make an AJAX request to get the results for page 2
    function change(){
        if (isLoading) {
            return;
        }

        // Mark loading as in progress
        isLoading = true;
        var xhr = new XMLHttpRequest();
        currentURL = incrementPageNumber(currentURL)
        xhr.open("GET", currentURL);
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Parse the HTML response
                var parser = new DOMParser();
                var doc = parser.parseFromString(xhr.responseText, "text/html");

                // Get the results for page 2
                var page2ResultsFromResponse = doc.querySelector("#srchrslt-adtable");

                // Copy the results for page 2 to the new element we created earlier
                page1Results.innerHTML = page1Results.innerHTML + page2ResultsFromResponse.innerHTML;
                isLoading = false;
            }
        };
        xhr.send();}
    window.addEventListener('scroll',function (){
        if (isAtBottomOfPage()){change()}
    })
};

auto_load();