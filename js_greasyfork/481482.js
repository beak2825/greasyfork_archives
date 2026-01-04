// ==UserScript==
// @name         Mammada ya Alia? a LinkedIn analysis 
// @namespace    http://github.com/armanjr
// @version      1.1
// @description  Extract and display top 5 first names, last names, and occupations from LinkedIn connections
// @match        https://www.linkedin.com/mynetwork/invite-connect/connections/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481482/Mammada%20ya%20Alia%20a%20LinkedIn%20analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/481482/Mammada%20ya%20Alia%20a%20LinkedIn%20analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let connections = [];

    // Create a status indicator element
    const statusIndicator = document.createElement('div');
    statusIndicator.style.position = 'fixed';
    statusIndicator.style.left = '50%';
    statusIndicator.style.top = '50%';
    statusIndicator.style.transform = 'translate(-50%, -50%)';
    statusIndicator.style.padding = '10px';
    statusIndicator.style.backgroundColor = 'white';
    statusIndicator.style.color = 'red';
    statusIndicator.style.border = '2px solid black';
    statusIndicator.style.zIndex = '1000';
    statusIndicator.innerText = 'Please wait...';
    document.body.appendChild(statusIndicator);

    function showStatusIndicator() {
        statusIndicator.style.display = 'block';
    }

    function hideStatusIndicator() {
        statusIndicator.style.display = 'none';
    }

    function handleLoadMoreButton() {
        const loadMoreButton = document.querySelector('.scaffold-finite-scroll__load-button');
        if (loadMoreButton) {
            loadMoreButton.click();
            setTimeout(scrollToEnd, 3000);
        } else {
            scrollToEnd();
        }
    }

    function scrollToEnd() {
        showStatusIndicator();
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(checkIfEndReached, 3000);
    }

    function checkIfEndReached() {
        let currentConnections = document.querySelectorAll('.mn-connection-card__details').length;
        if (connections.length !== currentConnections) {
            connections = document.querySelectorAll('.mn-connection-card__details');
            handleLoadMoreButton();
        } else {
            hideStatusIndicator();
            extractData();
        }
    }

    function getTop5(countMap) {
        return Object.entries(countMap)
                     .sort((a, b) => b[1] - a[1])
                     .slice(0, 5)
                     .map(entry => `${entry[0]} (${entry[1]})`)
                     .join(', ');
    }

    function extractData() {
        let firstNameCounts = {};
        let lastNameCounts = {};
        let occupationCounts = {};

        connections.forEach(connection => {
            let fullName = connection.querySelector('.mn-connection-card__name')?.innerText.trim();
            let occupation = connection.querySelector('.mn-connection-card__occupation')?.innerText.trim();

            if (fullName && occupation) {
                let names = fullName.split(' ');
                let firstName = names[0];
                let lastName = names[names.length - 1];

                firstNameCounts[firstName] = (firstNameCounts[firstName] || 0) + 1;
                lastNameCounts[lastName] = (lastNameCounts[lastName] || 0) + 1;
                occupationCounts[occupation] = (occupationCounts[occupation] || 0) + 1;
            }
        });

        let topFirstNames = getTop5(firstNameCounts);
        let topLastNames = getTop5(lastNameCounts);
        let topOccupations = getTop5(occupationCounts);

        alert('Top 5 First Names: ' + topFirstNames +
              '\nTop 5 Last Names: ' + topLastNames +
              '\nTop 5 Occupations: ' + topOccupations);
    }

    scrollToEnd();
})();