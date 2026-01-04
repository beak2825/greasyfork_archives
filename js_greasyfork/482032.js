// ==UserScript==
// @name         Origin
// @version      0.1
// @description  Display the creation time of the github repository.
// @author       Sh-Fang
// @match        https://github.com/*
// @grant        none
// @source       https://github.com/Sh-Fang/Origin
// @license MIT
// @namespace https://greasyfork.org/users/1232796
// @downloadURL https://update.greasyfork.org/scripts/482032/Origin.user.js
// @updateURL https://update.greasyfork.org/scripts/482032/Origin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Parsing username and repository name
    var pathArray = window.location.pathname.split('/');
    var username = pathArray[1];
    var repository = pathArray[2];

    // Check that the username and repository name both exist and are not empty
    if (username && repository) {

        // Construct a unique identifier for storing data in localStorage
        var storageKey = 'githubInfo_' + username + '_' + repository;

        // Trying to get saved information from localStorage
        var storedInfo = localStorage.getItem(storageKey);

        // Use XPath to find the specified element
        var xpathResult = document.evaluate(
            '/html/body/div[1]/div[6]/div/main/div/div[1]/div[1]/div[1]/strong/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        // Get the found element
        var repoLink = xpathResult.singleNodeValue;

        // Check if the element is found
        if (repoLink) {

            // Get the text content of the element
            var repoName = repoLink.textContent;

            // If the information has been stored, the stored information is displayed directly
            if (storedInfo) {
                repoLink.textContent = repoName + ' (Created at: ' + storedInfo + ')';
            } else {
                // GitHub API request URLs
                var apiUrl = 'https://api.github.com/repos/' + username + '/' + repository;

                // GitHub API request
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {

                    // Get "created_at" item
                    var createdAt = data.created_at;

                    // Convert timestamps to human-readable date strings (containing only the year, month, and day)
                    var createdDate = new Date(createdAt).toLocaleDateString();

                    // Add a timestamp after repository name
                    repoLink.textContent = repoName + ' (Created at: ' + createdDate + ')';

                    // Save timestamp to localStorage
                    localStorage.setItem(storageKey, createdDate);
                })
                    .catch(error => console.error('Error fetching GitHub API:', error));
            }

        }


    }

})();