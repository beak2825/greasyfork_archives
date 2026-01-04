// ==UserScript==
// @name         NYTimes Spelling Bee Checker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Compare NYTimes Spelling Bee words with a given list and find the missing words
// @author       ChatGPT
// @match        https://www.nytimes.com/puzzles/spelling-bee*
// @match        https://www.nytimes.com/puzzles/spelling-bee/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/512983/NYTimes%20Spelling%20Bee%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/512983/NYTimes%20Spelling%20Bee%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let storedExternalData = null;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const targetURL = `https://www.nytimes.com/${year}/${month}/${day}/crosswords/spelling-bee-forum.html`;

    // Function to get the words from the specified class in the target URL
    function getGivenWordsFromTargetURL() {
        return new Promise((resolve, reject) => {
            console.log("Fetching data from target URL...");
            $.get(targetURL, function(data) {
                console.log("Data fetched from target URL.");
                let wordElements = $(data).find('.sb-wordlist-items-pag li span');
                let words = Array.from(wordElements).map(element => $(element).text().trim());

                console.log("Words extracted:", words);

                // Get two-letter list from the target URL
                let twoLetterListElements = $(data).find('.content:contains("Two letter list:")').next().find('span');
                let twoLetterWords = [];
                twoLetterListElements.each(function() {
                    let wordGroup = $(this).text().trim().split(' ');
                    twoLetterWords.push(...wordGroup);
                });
                console.log("Two letter words extracted:", twoLetterWords);

                resolve({ words, twoLetterWords });
            }).fail(function() {
                reject("Failed to fetch the given words from the target URL.");
            });
        });
    }

    // Function to get the list of words from the text of class sb-wordlist-items-pag
    function getPageWords() {
        return new Promise((resolve) => {
            let checkExist = setInterval(function() {
                let wordElements = document.querySelectorAll('.sb-wordlist-items-pag li span');
                if (wordElements.length) {
                    clearInterval(checkExist);
                    let words = Array.from(wordElements).map(element => element.innerText.trim());
                    console.log("Words extracted from page content:", words);
                    resolve(words);
                }
            }, 100); // check every 100ms
        });
    }

    // Function to compare the lists and find missing words
    function compareWords(pageWords, givenWords) {
        let missingWords = givenWords.filter(word => !pageWords.includes(word));
        console.log("Missing words:", missingWords);
        return { missingWords };
    }

// Function to check which two-letter beginnings are missing from the list of words
function checkTwoLetterWords(pageWords, twoLetterWords) {
    console.log("page words");
    console.log(pageWords);
    console.log("two letter words");
    console.log(twoLetterWords);

    let twoLetterCounts = {};
    twoLetterWords.forEach(word => {
        let [beginning, count] = word.toLowerCase().split('-');
        twoLetterCounts[beginning] = parseInt(count, 10);
    });

    let missingTwoLetterWords = {};
    for (let beginning in twoLetterCounts) {
        let actualCount = pageWords.filter(word => word.toLowerCase().startsWith(beginning)).length;
        if (actualCount < twoLetterCounts[beginning]) {
            missingTwoLetterWords[beginning] = twoLetterCounts[beginning] - actualCount;
        }
    }

    console.log("Missing two-letter beginnings:", missingTwoLetterWords);
    return missingTwoLetterWords;
}


    // Function to create the expandable box
    function createExpandableBox(missingWords, missingTwoLetterWords) {
        let box = $('<div>', {
            id: 'missingWordsBox',
            css: {
                width: '200px',
                height: '40px',
                backgroundColor: 'white',
                border: '1px solid black',
                padding: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                zIndex: 1000,
                position: 'fixed',
                top: '10px',
                right: '10px'
            },
            text: 'Show Missing Words'
        });

        let content = $('<div>', {
            css: {
                display: 'none'
            }
        });

        box.append(content);

        updateExpandableBox(box, missingWords, missingTwoLetterWords);

        box.on('click', function() {
            content.toggle();
            if (content.is(':visible')) {
                box.css('height', 'auto');
                box.text('');
                box.append(content);
                console.log("Box expanded with content:", content.html());
            } else {
                box.css('height', '40px');
                box.text('Show Missing Words');
                console.log("Box collapsed.");
            }
        });

        $('body').append(box);
        console.log("Expandable box created and added to the body.");

        return box;
    }

    // Function to update the expandable box
    function updateExpandableBox(box, missingWords, missingTwoLetterWords) {
        let content = box.find('div').first();
        content.empty();

        let missingTwoLetterWordsText = $('<p>').text(`Missing Two Letter Words:`);
        let missingTwoLetterWordsList = $('<ul>');
        Object.entries(missingTwoLetterWords).forEach(([beginning, count]) => {
            missingTwoLetterWordsList.append($('<li>').text(`${beginning}: ${count}`));
        });

        content.append(missingTwoLetterWordsText, missingTwoLetterWordsList);
        console.log("Content updated in expandable box:", content.html());
    }

    // Main function
    function main(externalData) {
        getPageWords().then(pageWords => {
            let missingTwoLetterWords = checkTwoLetterWords(pageWords, externalData.twoLetterWords);

            if (!storedExternalData.box) {
                storedExternalData.box = createExpandableBox([], missingTwoLetterWords);
            } else {
                updateExpandableBox(storedExternalData.box, [], missingTwoLetterWords);
            }
        });
    }

    // Function to run on Enter key press
    function onEnterPress() {
        if (storedExternalData) {
            getPageWords().then(pageWords => {
                let missingTwoLetterWords = checkTwoLetterWords(pageWords, storedExternalData.twoLetterWords);
                updateExpandableBox(storedExternalData.box, [], missingTwoLetterWords);
            });
        }
    }

    // Initial setup
    getGivenWordsFromTargetURL().then(({ words, twoLetterWords }) => {
        storedExternalData = { words, twoLetterWords };
        main(storedExternalData);

        // Add event listener for Enter key
        $(document).on('keydown', function(e) {
            if (e.key === 'Enter') {
                onEnterPress();
            }
        });
    }).catch(error => {
        console.error(error);
    });

})();
