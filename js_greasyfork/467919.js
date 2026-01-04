// ==UserScript==
// @name         Contexto Hack
// @namespace    your-namespace-here
// @version      4.0
// @author       longkidkoolstar
// @description  This is a Contexto Hack that Gives you the word of the day for everyday.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contexto.me
// @match        https://contexto.me/*
// @license      CC BY-NC-ND 4.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/467919/Contexto%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/467919/Contexto%20Hack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 
 
// Function to change the world list mode
function changeWorldListMode() {
    const htmlElement = document.querySelector("html");
    const worldListElement = document.querySelector('.info-bar');
 
    if (htmlElement && worldListElement) {
        const isDarkMode = htmlElement.getAttribute('data-theme') === 'dark';
 
        // Adjust the background color for a slightly darker effect
        const darkModeBackgroundColor = 'rgb(15, 24, 32)';
        const lightModeBackgroundColor = 'white';
        worldListElement.style.backgroundColor = isDarkMode ? darkModeBackgroundColor : lightModeBackgroundColor;
        worldListElement.style.color = isDarkMode ? 'white' : 'black';
 
        // Adjust the saved words GUI mode for a slightly darker effect
        const savedWordsGUI = document.querySelector('#saved-words-list');
        if (savedWordsGUI) {
            savedWordsGUI.style.backgroundColor = isDarkMode ? darkModeBackgroundColor : lightModeBackgroundColor;
            savedWordsGUI.style.color = isDarkMode ? 'white' : 'black';
        }
    }
}
 
 
 
    // Function to check if a string contains the number 1 by itself
    function containsOne(str) {
        return /^\D*1\D*$/.test(str);
    }
 
    // Retrieve saved words and game numbers from JSONBin.io
    let savedWords = {};
    let gameNumbers = {};
 
// JSONStorage.net configurations
const userId = 'd206ce58-9543-48db-a5e4-997cfc745ef3';
const apiKey = 'e8dccf1d-81f7-4ecc-b99d-dc7401df192d';

// Function to fetch saved words from JSONStorage.net
function fetchSavedWords() {
    // Check if saved words exist in the Tampermonkey storage
    const savedWordsData = GM_getValue('savedWordsData');
    if (savedWordsData) {
        savedWords = savedWordsData.savedWords;
        gameNumbers = savedWordsData.gameNumbers;
        console.log('Loaded saved words from Tampermonkey storage');
        updateSavedWordsGUI();
    }

    // Fetch saved words from JSONStorage.net
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.jsonstorage.net/v1/json/${userId}/7d74d2ca-952e-4812-8a5c-76ec64d66a28?apiKey=${apiKey}`,
        headers: {
            'Content-Type': 'application/json',
        },
        onload: function (response) {
            if (response.status === 200) {
                const responseData = JSON.parse(response.responseText);
                if (responseData.savedWords) {
                    savedWords = responseData.savedWords;
                }
                if (responseData.gameNumbers) {
                    gameNumbers = responseData.gameNumbers;
                }
                console.log('Read saved words successfully');
                updateSavedWordsGUI();

                // Save fetched words to Tampermonkey storage
                const savedWordsData = {
                    savedWords: savedWords,
                    gameNumbers: gameNumbers,
                };
                GM_setValue('savedWordsData', savedWordsData);
                console.log('Saved fetched words to Tampermonkey storage');

                // Call the searchForWordsAndGameNumbers function if it doesn't have the word for the current game number
                if (!Object.values(gameNumbers).includes(currentGameNumber)) {
                    searchForWordsAndGameNumbers();
                }
            }
        },
    });
}

// Function to save words and game numbers to JSONStorage.net
function saveWordsToJSONStorage() {
    GM_xmlhttpRequest({
        method: 'PUT',
        url: `https://api.jsonstorage.net/v1/json/${userId}/7d74d2ca-952e-4812-8a5c-76ec64d66a28?apiKey=${apiKey}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            savedWords: savedWords,
            gameNumbers: gameNumbers,
        }),
        onload: function (response) {
            if (response.status === 200) {
                console.log('Words and game numbers saved successfully');
            }
        },
    });
}

// Function to search for words and game numbers to save on the page
let currentGameNumber = '';

function searchForWordsAndGameNumbers() {
    // Find the game number element on the page
    const gameNumberElement = document.querySelector('.info-bar span:nth-child(2)');
    currentGameNumber = gameNumberElement ? gameNumberElement.textContent.trim().replace('#', '') : '';

    if (currentGameNumber && !Object.values(gameNumbers).includes(currentGameNumber)) {
        // Find all the div elements with class "row" on the page
        const rows = document.querySelectorAll('.row');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Find all the span elements within the row
            const spans = row.querySelectorAll('span');
            let hasOne = false;
            let word = '';
            for (let j = 0; j < spans.length; j++) {
                const span = spans[j];
                if (containsOne(span.innerHTML)) {
                    hasOne = true;
                } else {
                    word = span.innerHTML;
                }
            }
            // Save the word and game number to the objects if the word has the number 1 by itself and it's not already saved
            // Save the updated objects to JSONStorage.net only if a new word is saved
            if (hasOne && word && !savedWords.hasOwnProperty(word)) {
                savedWords[word] = true;
                gameNumbers[word] = currentGameNumber; // Save the current game number instead of searching for it again
                // Log the game number for the saved word
                console.log(`Game number for ${word}: ${currentGameNumber}`);

                // Save the updated objects to JSONStorage.net
                saveWordsToJSONStorage();
            }
        }
    }

    // Update the GUI with the saved words and game numbers
    updateSavedWordsGUI();
}

// Function to reveal the word for the current game number
function revealWordForCurrentGameNumber() {
    currentGameNumber = ''; // Clear the current game number

    // Find the game number element on the page
    const gameNumberElement = document.querySelector('.info-bar span:nth-child(2)');
    currentGameNumber = gameNumberElement ? gameNumberElement.textContent.trim().replace('#', '') : '';

    // Find the saved word for the current game number
    const savedWordsForCurrentGameNumber = Object.keys(savedWords).filter((word) => {
        return gameNumbers[word] === currentGameNumber;
    });

    // Display the saved word in an alert box
    if (savedWordsForCurrentGameNumber.length > 0) {
        alert(`The word for game number ${currentGameNumber} is: ${savedWordsForCurrentGameNumber[0]}`);
    } else {
        alert(`No saved words for game number ${currentGameNumber}. Trying to find the word in the library...`);
        fetchWordFromAPI(currentGameNumber);
    }
}

// Function to fetch the word from the API
function fetchWordFromAPI(gameNumber) {
    const apiUrl = `https://api.contexto.me/machado/en/giveup/${gameNumber}`;

    // Make an HTTP request to the API endpoint
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const word = data.word;
            if (word) {
                alert(`The word for game number ${gameNumber} is: ${word}`);
                // Save the word and game number to the objects
                savedWords[word] = true;
                gameNumbers[word] = gameNumber;
                // Save the updated objects to JSONStorage.net
                saveWordsToJSONStorage();
                // Save the updated objects to GM_setValue storage
                const savedWordsData = {
                    savedWords: savedWords,
                    gameNumbers: gameNumbers,
                };
                GM_setValue('savedWordsData', savedWordsData);
            } else {
                alert(`No word found for game number ${gameNumber}`);
            }
        })
        .catch(error => {
            console.error('Error fetching word from API:', error);
        });
}
 
const buttoncss = `
    .theme-button {
        background-color: #29a19c; /* Contexto primary color - Change this to the actual primary color */
        color: #ffffff; /* White text to contrast with the primary color */
        border: none;
        padding: 5px 13px; /* Reduce padding to make the button smaller */
        font-size: 11px; /* Reduce font size to make the button smaller */
        border-radius: 3px; /* Adjust border radius for less rounded corners */
        cursor: pointer;
        margin: 5px;
        /* Add any additional styles or adjustments you want */
    }
    .theme-button:hover {
        background-color: #45c0b5; /* Lighter shade on hover - Change this to the actual hover color */
    }
`;
 
// Add the CSS styles to the page
const buttonstyle = document.createElement('style');
buttonstyle.innerHTML = buttoncss;
    document.head.appendChild(buttonstyle);
 
 
 
// Create a button to show the saved words GUI
const showSavedWordsButton = document.createElement('button');
showSavedWordsButton.textContent = 'Saved Words';
showSavedWordsButton.classList.add('theme-button'); // Add a custom class for styling
showSavedWordsButton.addEventListener('click', () => {
    savedWordsGUI.classList.add('open');
});
document.body.appendChild(showSavedWordsButton);
 
 
// Create a button to reveal the word for the current game number
const revealButton = document.createElement('button');
revealButton.textContent = 'Reveal Word';
revealButton.classList.add('theme-button'); // Add a custom class for styling
revealButton.addEventListener('click', revealWordForCurrentGameNumber);
document.body.appendChild(revealButton);
 
    // Create a div element to hold the saved words GUI
    const savedWordsGUI = document.createElement('div');
    savedWordsGUI.id = 'saved-words-list';
    document.body.appendChild(savedWordsGUI);
 
 
 
    // Create a button to minimize the saved words GUI
    const minimizeSavedWordsButton = document.createElement('button');
    minimizeSavedWordsButton.innerHTML = '<img src="https://th.bing.com/th/id/R.6a6eda3ee63c80ebc02dc830b395324e?rik=t2E%2fYYP3IGbSsQ&pid=ImgRaw&r=0" alt="Close">';
    minimizeSavedWordsButton.addEventListener('click', () => {
        savedWordsGUI.classList.remove('open');
    });
    savedWordsGUI.appendChild(minimizeSavedWordsButton);
 
 
    // Create a list element to display the saved words
    const savedWordsList = document.createElement('ul');
    savedWordsGUI.appendChild(savedWordsList);
 
    // Function to update the saved words GUI with the saved words and game numbers
    function updateSavedWordsGUI() {
        // Clear the current saved words list
        savedWordsList.innerHTML = '';
 
        // Get all saved words sorted by game number
        const savedWordsSorted = Object.keys(gameNumbers).sort((a, b) => {
            return gameNumbers[a] - gameNumbers[b];
        });
 
        // Add each saved word to the list
        for (let i = 0; i < savedWordsSorted.length; i++) {
            const word = savedWordsSorted[i];
            const gameNumber = gameNumbers[word];
            const listItem = document.createElement('li');
            listItem.textContent = `${word} (Game ${gameNumber})`;
            savedWordsList.appendChild(listItem);
        }
    }
 
    // Update the saved words GUI with the saved words and game numbers
    updateSavedWordsGUI();
 
    // Function to clear the saved words and game numbers from JSONBin.io
    function clearSavedWords() {
        savedWords = {};
        gameNumbers = {};
        //saveWordsToJSONBin();
        updateSavedWordsGUI();
        alert('Saved words cleared');
    }
 
    // Create a button to clear the saved words and game numbers
    const clearSavedWordsButton = document.createElement('button');
    clearSavedWordsButton.textContent = 'Clear Saved Words';
    clearSavedWordsButton.addEventListener('click', clearSavedWords);
    savedWordsGUI.appendChild(clearSavedWordsButton);
 
    // Function to export the saved words and game numbers as JSON
    function exportSavedWords() {
        const savedWordsData = {
            savedWords: savedWords,
            gameNumbers: gameNumbers
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedWordsData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', 'contexto_saved_words.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
 
    // Create a button to export the saved words and game numbers
    const exportSavedWordsButton = document.createElement('button');
    exportSavedWordsButton.textContent = 'Export Saved Words';
    exportSavedWordsButton.addEventListener('click', exportSavedWords);
    savedWordsGUI.appendChild(exportSavedWordsButton);
 
    // Function to import saved words and game numbers from JSON
    function importSavedWords() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const savedWordsData = JSON.parse(e.target.result);
                    savedWords = savedWordsData.savedWords;
                    gameNumbers = savedWordsData.gameNumbers;
                    saveWordsToJSONBin();
                    updateSavedWordsGUI();
                    alert('Saved words imported');
                } catch (err) {
                    alert('Error importing saved words');
                }
            };
            reader.readAsText(file);
        });
        fileInput.click();
    }
 
    // Create a button to import saved words and game numbers
    const importSavedWordsButton = document.createElement('button');
    importSavedWordsButton.textContent = 'Import Saved Words';
    importSavedWordsButton.addEventListener('click', importSavedWords);
    savedWordsGUI.appendChild(importSavedWordsButton);
 
    // Define CSS styles for the saved words GUI
    const css = `
        #saved-words-list {
            position: fixed;
            bottom: 0;
            right: 0;
            background-color: white;
            border: 2px solid black;
            border-radius: 5px 0 0 0;
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
            display: none;
        }
        #saved-words-list.open {
            display: block;
        }
    #saved-words-list button {
        margin: 5px;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
    }
    #saved-words-list img {
        width: 20px;
        height: 20px;
    }
`;
 
    // Add the CSS styles to the page
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
 
    // Fetch saved words and game numbers from JSONBin.io on page load
    fetchSavedWords();
 
    // Search for words and game numbers to save on page load and every 5 seconds
    searchForWordsAndGameNumbers();
    setInterval(searchForWordsAndGameNumbers, 17000);//17 seconds
 // Change the world list mode on page load and whenever the data-theme changes
    changeWorldListMode();
    const htmlElement = document.querySelector("html");
    const observer = new MutationObserver(changeWorldListMode);
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['data-theme'] });
})();