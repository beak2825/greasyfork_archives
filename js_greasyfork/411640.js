// ==UserScript==
// @name         Suche auf BS
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        https://bs.to/andere-serien
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411640/Suche%20auf%20BS.user.js
// @updateURL https://update.greasyfork.org/scripts/411640/Suche%20auf%20BS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the search term from the URL hash
    const hash = location.hash;
    if (hash !== undefined && hash.length > 0) {
        let searchTerm = JSON.parse(decodeURIComponent(hash.substr(1))).search;
        searchTerm = removeSeasons(searchTerm);
        // Initialize an array to hold the search results
        const searchResults = [];

        // Select and format the link elements from the page
        const searchList = collectLinkElements();

        // Perform a fuzzy search on each search term
        searchResults.push(...go(searchTerm, searchList));

        // Find the best search result
        const bestMatch = findBestMatch(searchResults);

        // If there are any results, open the highest scoring result in a new tab
        if (bestMatch) {
            window.open(bestMatch.obj.href, "_self", "", true);
        } else {
            // If there are no results, set the search input to the search term and search
            document.getElementById("serInput").value = searchTerm.join(" ");
            searchSeries();
        }
    }
})();

function findBestMatch(searchResults) {
    let bestMatch = {
        score: 0,
        probability: 0,
        searchTerm: '',
        target: {},
        obj: {}
    };
    if(searchResults.length == 1){
        bestMatch = {
            score: searchResults[0].score,
            probability: 1,
            searchTerm: searchResults[0].searchTerm,
            target: searchResults[0].target,
            obj: searchResults[0].obj
        };
        return bestMatch;
    }
    for (const result of searchResults) {
        const probability = result.score * (1 - (result.target.length / result.searchTerm.length));
        // Calculate the probability of this result being the correct match
        if(result.score == 1){
            if(bestMatch.score != 1){
                bestMatch = {
                    score: result.score,
                    probability: 1,
                    searchTerm: result.searchTerm,
                    target: result.target,
                    obj: result.obj
                };
                continue;
            }else{
                if(result.target.length > bestMatch.target.length){
                    bestMatch = {
                        score: result.score,
                        probability: 1,
                        searchTerm: result.searchTerm,
                        target: result.target,
                        obj: result.obj
                    };
                    continue;
                }
            }
        }
        if (probability >= bestMatch.probability) {
            bestMatch = {
                score: result.score,
                probability: probability,
                searchTerm: result.searchTerm,
                target: result.target,
                obj: result.obj
            };
        }
    }

    return bestMatch;
}

function removeSeasons(arr) {
  // First, we will use a regular expression to remove the " Xth Season" or " Season X" portion from the strings
  const processedArr = arr.map(str => str.replace(/\s(Season|Season)\s\d+|\s\d+(th|st|rd|nd)\sSeason/i, ''));

  // Next, we will use another regular expression to remove the "Part X" portion from the strings
  const intermediateArr = processedArr.map(str => str.replace(/\sPart\s\d+/i, ''));

  // Use a regular expression to remove Roman numerals from the strings
  const intermediateTwoArr = intermediateArr.map(str => str.replace(/\bM{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/g, ''));

  // Split the strings on the ':' character and create new entries for each part
  const splitArr = intermediateTwoArr.flatMap(str => {
    const splitStrings = str.split(':');
    return [...splitStrings, str];
  });

  // Remove any entries that are shorter than 4 letters
  const filteredArr = splitArr.filter(str => str.length >= 4);

  // Finally, we will use another regular expression to remove any numbers from the end of the strings, and we will use the Set object to remove any duplicates from the array
  return [...new Set(filteredArr.map(str => str.replace(/\s\d+$/, '').trim()))];
}






// Helper function to search multiple keys
function go(search, targets) {
    // Perform a fuzzy search on each search term
    const searchResults = search.flatMap(term => {
        return fuzzySearch(term, targets);
    });

    // Remove duplicates from the search results
    const filteredResults = [...new Set(searchResults)];

    return filteredResults;
}


// Helper function to collect and format the link elements
function collectLinkElements() {
    const linkElements = document.querySelectorAll("#seriesContainer ul li a");
    const searchList = [];
    linkElements.forEach(element => {
        // Get the title from the href
        const searchHref = element.href.split('/').pop().replace(/-/g, ' ');
        if (element.title.includes('|')) {
            // Split the title at the '|' character and create an entry for each part
            const titles = element.title.split('|');
            titles.forEach(title => {
                searchList.push({
                    'title': title.trim(),
                    'href': element.href,
                    'searchHref': searchHref
                });
            });
        } else if (element.title.includes(':')) {
            // Split the title at the ':' character and create new entries for each part
            const titles = element.title.split(':');
            titles.forEach(title => {
                searchList.push({
                    'title': title.trim(),
                    'href': element.href,
                    'searchHref': searchHref
                });
            });
            searchList.push({
                'title': element.title,
                'href': element.href,
                'searchHref': searchHref
            });
        } else if (element.title.includes('-')) {
            let titletwo = element.title.replace('-', '');
             titletwo = titletwo.replace('  ', ' ');
                searchList.push({
                    'title': titletwo.trim(),
                    'href': element.href,
                    'searchHref': searchHref
                });
            searchList.push({
                'title': element.title,
                'href': element.href,
                'searchHref': searchHref
            });
        } else {
            searchList.push({
                'title': element.title,
                'href': element.href,
                'searchHref': searchHref
            });
        }
    });
    return searchList;
}

function fuzzySearch(searchTerm, targets) {
    const searchResults = [];

    for (const target of targets) {
        let targetArray = { Name: '', length:0}
        // Calculate the Levenshtein distance between the search term and the title
        let distance = levenshteinDistance(searchTerm, target.title);
        targetArray.Name = target.title;
        targetArray.length =  targetArray.Name.length;
        // Calculate the score for this search result
        let score = 1 - distance / Math.max(searchTerm.length, target.title.length);

        // If the title does not contain the search term or includes "...", search the searchHref
        if ((score === 0 || target.title.includes("...")) && target.searchHref.includes(searchTerm)) {
            // Calculate the Levenshtein distance between the search term and the searchHref
            distance = levenshteinDistance(searchTerm, target.searchHref);
            targetArray.Name = target.searchHref;
            targetArray.length =  targetArray.Name.length;
            // Calculate the score for this search result
            score = 1 - distance / Math.max(searchTerm.length, target.searchHref.length);
        }

        // Check if this search term is longer than any previous search terms that matched this target object
        const previousMatch = searchResults.find(result => result.obj === target);
        if (previousMatch) {
            if (searchTerm.length > previousMatch.searchTerm.length) {
                // If the search term is longer, replace the previous match with this one
                previousMatch.score = score;
                previousMatch.searchTerm = searchTerm;
            }
        } else if (score > 0.5) {
            // If the score is high enough, add the search result to the array
            searchResults.push({
                score: score,
                searchTerm: searchTerm,
                target: targetArray,
                obj: target
            });
        }
    }

    return searchResults;
}





function levenshteinDistance(a, b) {
    // Create a matrix with rows representing the characters in a and columns representing the characters in b
    const matrix = [];
    for (let i = 0; i <= a.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    // Loop through the characters in a and b and calculate the distances
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a.charAt(i - 1) === b.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }

    // Return the distance
    return matrix[a.length][b.length];
}

