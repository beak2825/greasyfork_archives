// ==UserScript==
// @name         Word Counter
// @version      1.4
// @namespace   WordCounterScript
// @description  Count repetitive words on a web page and display them with a custom threshold.
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489034/Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/489034/Word%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the toggle button
    var toggleButton = document.createElement('button');
    toggleButton.id = 'word-counter-toggle-button';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '50%';
    toggleButton.style.right = '20px';
    toggleButton.style.transform = 'translateY(-50%)';
    toggleButton.style.width = '50px';
    toggleButton.style.height = '50px';
    toggleButton.style.backgroundColor = 'blue';
    toggleButton.style.color = 'white';
    toggleButton.style.fontSize = '18px';
    toggleButton.style.border = 'none';
    toggleButton.innerText = 'WC';
    toggleButton.setAttribute('aria-label', 'Toggle Word Counter');
    document.body.appendChild(toggleButton);

    // Add event listener to toggle button
    toggleButton.addEventListener('click', function() {
        toggleWordCounter();
    });

    // Function to toggle word counter visibility
    function toggleWordCounter() {
        var wordCounter = document.getElementById('word-counter');
        if (wordCounter.style.display === 'none') {
            wordCounter.style.display = 'block';
            countWords();
        } else {
            wordCounter.style.display = 'none';
        }
    }

    // Function to count repetitive words
    function countWords() {
        let ignoredWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "so", "yet", "after", "as", "at", "by", "for", "from", "in", "of", "on", "over", "to", "with", "about", "above", "below", "beneath", "under", "before", "during", "since", "within", "without", "throughout", "among", "beside", "between", "behind", "besides", "against", "along", "around", "except", "according", "across", "near", "after", "against", "ahead", "ago", "upon", "through", "into", "onto", "until", "underneath", "up", "off", "out", "of", "down", "behind", "near", "around", "between", "above", "below", "within", "without", "upon", "before", "after", "by", "behind", "near", "against", "during", "from", "for", "with", "within", "without", "on", "over", "under", "around", "throughout", "through", "at", "about", "above", "before", "behind", "beneath", "between", "beside", "beyond", "by", "down", "from", "in", "into", "near", "on", "off", "over", "under", "up", "upon", "through", "to", "with", "within", "without", "with", "via", "per", "about", "above", "across", "after", "against", "ahead", "along", "amid", "amidst", "among", "amongst", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "despite", "down", "during", "except", "for", "from", "in", "inside", "into", "like", "near", "of", "off", "on", "onto", "out", "outside", "over", "past", "round", "since", "through", "throughout", "till", "to", "toward", "under", "underneath", "until", "unto", "up", "upon", "with", "within", "without", "yet", "a", "an", "the", "some", "any", "each", "every", "all", "both", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "last"];

        // Get all words on the page
        let words = document.body.textContent.split(/\s+/);

        // Count the occurrences of each word
        let wordCount = {};
        words.forEach(word => {
            let cleanedWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            if (cleanedWord && !ignoredWords.includes(cleanedWord)) {
                if (wordCount[cleanedWord]) {
                    wordCount[cleanedWord]++;
                } else {
                    wordCount[cleanedWord] = 1;
                }
            }
        });

        // Filter words with counts higher than X
        let threshold = parseInt(prompt("Enter the threshold count:"));
        let repetitiveWords = Object.entries(wordCount).filter(([word, count]) => count > threshold);

        // Display the repetitive words and their counts
        let resultDiv = document.getElementById('word-counter');
        resultDiv.innerHTML = `<h3>Repeated Words (Threshold: ${threshold})</h3>`;
        if (repetitiveWords.length === 0) {
            resultDiv.innerHTML += '<p>No repetitive words found.</p>';
        } else {
            repetitiveWords.forEach(([word, count]) => {
                resultDiv.innerHTML += `<p>${word}: ${count} occurrences</p>`;
            });
        }
    }

    // Create the result dialog box
    var wordCounterDiv = document.createElement('div');
    wordCounterDiv.id = 'word-counter';
    wordCounterDiv.style.display = 'none';
    wordCounterDiv.style.position = 'fixed';
    wordCounterDiv.style.top = '50%';
    wordCounterDiv.style.left = '50%';
    wordCounterDiv.style.transform = 'translate(-50%, -50%)';
    wordCounterDiv.style.padding = '20px';
    wordCounterDiv.style.backgroundColor = '#fff';
    wordCounterDiv.style.border = '2px solid #333';
    wordCounterDiv.style.borderRadius = '5px';
    wordCounterDiv.style.zIndex = '9999';
    document.body.appendChild(wordCounterDiv);

    // Create and style the close button for the result dialog
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.setAttribute('aria-label', 'Close Word Counter');
    wordCounterDiv.appendChild(closeButton);

    // Add event listener to close button
    closeButton.addEventListener('click', function() {
        wordCounterDiv.style.display = 'none';
    });
})();
