// ==UserScript==
// @name        New script bilibili.com
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/BV14g4y1U7Ah/*
// @version     1.0
// @author      -
// @grant       GM_xmlhttpRequest
// @description zh-cn
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496912/New%20script%20bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/496912/New%20script%20bilibilicom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var allNames = []; // Array to hold all usernames
    var totalCount = 0; // Total count of pages to fetch
    var currentPage = 1; // Start from page 1

    // Function to send API request
    function sendBilibiliAPIRequest(page) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.bilibili.com/x/v2/reply/reply?oid=836478231&type=1&root=203566749728&ps=20&pn=${page}&web_location=333.788`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                var replies = data.data.replies;
                replies.forEach(element => {
                    let uname = element.member.uname;
                    allNames.push(uname);
                });

                // If current page is less than total count, fetch next page after 5 seconds
                if (currentPage < totalCount) {
                    currentPage++;
                    setTimeout(function() {
                        console.log('第' + currentPage + '页:' + allNames)
                        sendBilibiliAPIRequest(currentPage);
                    }, 5000); // Wait for 5 seconds before next request
                } else {
                    // All pages fetched, perform deduplication
                    let uniqueNames = [...new Set(allNames)];
                    console.log('All unique usernames from Bilibili API:', uniqueNames);
                }
            },
            onerror: function(error) {
                console.error('API Request failed', error);
            }
        });
    }

    // Prompt user for total page count and start fetching data
    function startFetchingComments() {
        var pageCount = prompt("Enter the total number of pages to fetch:", "1");
        totalCount = parseInt(pageCount, 10);
        if (isNaN(totalCount) || totalCount <= 0) {
            alert("Please enter a valid number of pages.");
            return;
        }
        sendBilibiliAPIRequest(currentPage);
    }

    // Start the process when the page loads
    window.addEventListener('load', startFetchingComments);
})();
