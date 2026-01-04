// ==UserScript==
// @name         AutoMS-Rewards
// @version      3.6
// @description  This lets you search random words or sentences on Bing. It adds a circular Orange icon on Microsoft rewards section. You can choose the number of searches & source of the words/sentences (Either predefined or random from English dictionary), and the code will open search tabs. After 15 seconds, all tabs will be closed automatically. This script is originally made by Potaper & I added some more features like searching random words from English dictionary & change number of searches.
// @author       Potaper & saitamasahil
// @match        https://www.bing.com/*
// @license      GPL-3.0 license
// @namespace https://greasyfork.org/users/1083612
// @downloadURL https://update.greasyfork.org/scripts/466924/AutoMS-Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/466924/AutoMS-Rewards.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create an element to represent the circle icon
    const icon = document.createElement('div');
    icon.style.position = 'fixed';
    icon.style.top = '90px';
    icon.style.left = '20px';
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.borderRadius = '50%'; // Make it a circle
    icon.style.backgroundColor = 'orange'; // Change the color
    icon.style.cursor = 'pointer';
    icon.title = 'Click here to initiate a Bing random words or sentences search';

    // Create an element to represent the container for the other options
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '130px';
    container.style.left = '20px';
    container.style.width = '250px';
    container.style.height = '130px';
    container.style.backgroundColor = 'lightcoral';
    container.style.display = 'none'; // Hide the container by default

    // Create an element to represent the search button
    const searchButton = document.createElement('button');
    searchButton.textContent = '🔎 Click here to search';
    searchButton.style.margin = '6px';
    searchButton.title = 'Click this button to start the search';

    // Create an element to represent the toggle buttons container
    const toggleButtonsContainer = document.createElement('div');
    toggleButtonsContainer.style.display = 'flex';
    toggleButtonsContainer.style.justifyContent = 'space-between';
    toggleButtonsContainer.style.margin = '6px';

    // Create an element to represent the toggle button for random words
    const toggleWordsButton = document.createElement('button');
    toggleWordsButton.textContent = '📚 Random Words';
    toggleWordsButton.title = 'Click this button to perform a search with random words from the English dictionary';
    toggleWordsButton.style.backgroundColor = 'white'; // Show white color by default
    toggleWordsButton.style.flex = '1';

    // Create an element to represent the toggle button for random sentences
    const toggleSentencesButton = document.createElement('button');
    toggleSentencesButton.textContent = '✒️ Random Sentences';
    toggleSentencesButton.title = 'Click this button to perform a search with random sentences from an API';
    toggleSentencesButton.style.backgroundColor = 'white'; // Show white color by default
    toggleSentencesButton.style.flex = '1';

    // Create variables to store the toggle states
    let useRandomWords = false;
    let useRandomSentences = false;

    // Create an element to represent the dropdown button
    const dropdown = document.createElement('select');
    dropdown.title = 'Select the number of searches you want to perform';

    // Add options to the dropdown button
    const options = [40, 35, 30, 25, 20, 15, 10, 5];
    for (let i = 0; i < options.length; i++) {
        const option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        dropdown.appendChild(option);
    }

    // Define the list of predefined words
    const predefinedWords = [
        'car', 'cat', 'bus', 'dog', 'book', 'tree', 'cake', 'fish', 'star', 'moon',
        'pen', 'hat', 'cup', 'box', 'ball', 'bird', 'rock', 'rose', 'soap', 'coin',
        'key', 'map', 'pie', 'tea', 'toy', 'cow', 'egg', 'ice', 'sun', 'sky',
        'bed', 'bag', 'jar', 'net', 'web', 'art', 'arm', 'eye', 'ear', 'leg',
    ];

    // Define a function to get random words from the English dictionary
    async function getRandomWords(count) {
        try {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
            const words = await response.json();
            return words;
        } catch (error) {
            console.error('Error fetching random words:', error);
            return [];
        }
    }

    // Define a function to get random sentences from an API
    async function getRandomSentences(count) {
        const sentences = [];
        for (let i = 0; i < count; i++) {
            try {
                const response = await fetch(`https://api.quotable.io/random?minLength=5&maxLength=50`);
                const sentence = await response.json();
                sentences.push(sentence.content);
            } catch (error) {
                console.error('Error fetching random sentences:', error);
            }
        }
        return sentences;
    }

    // Define a function to sleep for a given amount of milliseconds
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Search for random words or sentences when the search button is clicked
    searchButton.addEventListener('click', async function () {
        const pages = [];

        // Get the selected number of searches from the dropdown button
        const limit = parseInt(dropdown.value);

        let wordsOrSentences;
        if (useRandomWords) {
            // Use random words from the English dictionary
            wordsOrSentences = await getRandomWords(limit);
        } else if (useRandomSentences) {
            // Use random sentences from the API
            wordsOrSentences = await getRandomSentences(limit);
        } else {
            // Use predefined words
            wordsOrSentences = predefinedWords.slice(0, limit);
        }

        for (let i = 0; i < limit; i++) {
            const wordOrSentence = wordsOrSentences[i] || 'fallback'; // Use a fallback word in case of error
            const page = window.open(`https://bing.com/search?q=${encodeURIComponent(wordOrSentence)}`);
            pages.push(page);

            // Introduce a delay of 5-7 seconds between opening each tab
            await sleep(5000 + Math.random() * 2000);
        }

        // Close all search pages after 15 seconds
        setTimeout(function () {
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                page.close();
            }
        }, 15000);
    });

    // Toggle the color and the state of the toggle button for random words when clicked
    toggleWordsButton.addEventListener('click', function () {
        useRandomWords = !useRandomWords;
        useRandomSentences = false;
        toggleWordsButton.style.backgroundColor = useRandomWords ? 'pink' : 'white'; // Toggle colors
        toggleSentencesButton.style.backgroundColor = 'white'; // Reset sentences button color
    });

    // Toggle the color and the state of the toggle button for random sentences when clicked
    toggleSentencesButton.addEventListener('click', function () {
        useRandomSentences = !useRandomSentences;
        useRandomWords = false;
        toggleSentencesButton.style.backgroundColor = useRandomSentences ? 'pink' : 'white'; // Toggle colors
        toggleWordsButton.style.backgroundColor = 'white'; // Reset words button color
    });

    // Toggle the visibility of the container when the icon is clicked
    icon.addEventListener('click', function () {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });

    // Append the icon and the container to the document body
    document.body.appendChild(icon);
    document.body.appendChild(container);

    // Append the search button, the toggle buttons container, and the dropdown to the container
    container.appendChild(searchButton);
    toggleButtonsContainer.appendChild(toggleWordsButton);
    toggleButtonsContainer.appendChild(toggleSentencesButton);
    container.appendChild(toggleButtonsContainer);
    container.appendChild(dropdown);
})();
