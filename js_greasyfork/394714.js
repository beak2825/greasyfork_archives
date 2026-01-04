// ==UserScript==
// @name         Bulgarian whores on Chaturbate
// @name:en      Bulgarian whores on Chaturbate
// @namespace    https://greasyfork.org/en/users/2402-n-tsvetkov
// @version      0.7
// @description  removes ads, shows bulgarian paticipants in selected categories
// @description:en  removes ads, shows bulgarian paticipants in selected categories
// @author       Nikolai Tsvetkov
// @match        https://chaturbate.com/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394714/Bulgarian%20whores%20on%20Chaturbate.user.js
// @updateURL https://update.greasyfork.org/scripts/394714/Bulgarian%20whores%20on%20Chaturbate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const limit = 90; // The limit of items per request
    const genders = ['f', 'c']; // Array of gender parameters
    const desiredLocation = /bulgaria|sofia|българия|софия|plovdiv|varna|пловдив|варна|бургас|burgas/gi;
    const genderIcons = {
        s: 'https://web.static.mmcdn.com/images/ico-trans.svg',
        f: 'https://web.static.mmcdn.com/images/ico-female.svg',
        c: 'https://web.static.mmcdn.com/images/ico-couple.svg',
        m: 'https://web.static.mmcdn.com/images/ico-male.svg'
    };

    // Function to fetch initial data to get the total_count for a gender
    function fetchInitialData(gender) {
        const baseUrl = `https://chaturbate.com/api/ts/roomlist/room-list/?enable_recommendations=true&genders=${gender}&limit=${limit}&offset=0`;
        return fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                return {
                    gender: gender,
                    totalCount: data.total_count,
                    totalPages: Math.ceil(data.total_count / limit),
                };
            });
    }

    // Function to fetch data for a specific page and gender
    function fetchPage(gender, page) {
        const offset = page * limit;
        const url = `https://chaturbate.com/api/ts/roomlist/room-list/?enable_recommendations=true&genders=${gender}&limit=${limit}&offset=${offset}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return data.rooms;
            });
    }

    // Function to filter rooms by desired location
    function filterRoomsByLocation(rooms) {
        return rooms.filter(room => {
            return desiredLocation.test(room.location) || desiredLocation.test(room.country);
        });
    }

    // Function to add styles
    function addStyles() {
        GM_addStyle(".content #bgPlayers{clear: both; float: right; width: 186px; margin: 0 0 0 6px; border: 1px solid #acacac; border-radius: 4px; padding: 5px; min-height: 570px;}");
        GM_addStyle("#bgPlayers> div {cursor: pointer}");
    }

    // Function to create the container and append the results
    function displayResults(filteredRooms) {
        const contentElement = document.querySelector('#main .content');
        if (!contentElement) {
            console.error('Content element not found');
            return;
        }

        const bgPlayers = document.createElement('div');
        bgPlayers.id = 'bgPlayers';
        contentElement.prepend(bgPlayers);

        filteredRooms.forEach(room => {
            const roomDiv = document.createElement('div');
            const iconImg = document.createElement('img');
            iconImg.src = genderIcons[room.gender];
            iconImg.style.marginRight = '5px';

            const roomLink = document.createElement('a');
            roomLink.href = `https://chaturbate.com/${room.username}/`;
            roomLink.target = '_blank';
            roomLink.textContent = room.username;

            roomDiv.appendChild(iconImg);
            roomDiv.appendChild(roomLink);
            bgPlayers.appendChild(roomDiv);
        });
    }

    // Add styles
    addStyles();

    // Fetch initial data for all genders
    const initialFetchPromises = genders.map(gender => fetchInitialData(gender));

    // Wait for all initial fetch requests to complete
    Promise.all(initialFetchPromises)
        .then(results => {
            const fetchPromises = [];

            // Loop through each result to create fetch promises for each page
            results.forEach(result => {
                console.log(`Total pages to fetch for gender ${result.gender}: ${result.totalPages}`);
                for (let i = 0; i < result.totalPages; i++) {
                    fetchPromises.push(fetchPage(result.gender, i));
                }
            });

            // Wait for all page fetch requests to complete
            return Promise.all(fetchPromises);
        })
        .then(allResults => {
            // Flatten the results array and filter rooms by location
            const allRooms = allResults.flat();
            const filteredRooms = filterRoomsByLocation(allRooms);

            console.log('Filtered rooms:', filteredRooms);

            // Display the filtered results
            displayResults(filteredRooms);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
})();