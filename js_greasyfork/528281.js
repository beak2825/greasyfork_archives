// ==UserScript==
// @name         在2DFan搜索 / Add 2DFan Search Button
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Adds a 'Jump to 2DFan' button next to the <h1> tag on moyu.moe
// @author       owninnn
// @match        https://www.moyu.moe/*
// @match        http://www.moyu.moe/*
// @match        https://www.ai2.moe/files/file/*
// @grant        none
// @license GUN-V3
// @downloadURL https://update.greasyfork.org/scripts/528281/%E5%9C%A82DFan%E6%90%9C%E7%B4%A2%20%20Add%202DFan%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/528281/%E5%9C%A82DFan%E6%90%9C%E7%B4%A2%20%20Add%202DFan%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Add style for the buttons
    const style = document.createElement('style');
    style.textContent = `
        .search-buttons-container {
            display: inline-block;
            margin-left: 5px;
        }
        .search-buttons-container button {
            background: none;
            border: none;
            text-decoration: underline;
            margin-left: 5px;
        }
        .search-buttons-container button:hover {
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);

    // Define your search engines here
    const EnigneDefines = {
        "2dfan": {
            url: "https://2dfan.com/subjects/search?keyword=",
            name: "2dfan"
        },
        "ggbase": {
            url: "https://ggbases.dlgal.com/search.so?p=0&title=",
            name: "ggbase"
        },
        "moyu": {
            url: "https://www.moyu.moe/search?q=",
            name: "moyu"
        },
        "ai2moe": {
            url: "https://www.ai2.moe/search/?q=",
            name: "ai2moe"
        }
        // Add more search engines here following the same format
    };

    function getEnigneDefines(keys) {
        // Use the `filter` and `map` methods to extract matching items
        return keys
            .filter(key => EnigneDefines.hasOwnProperty(key)) // Ensure the key exists in the dictionary
            .map(key => EnigneDefines[key]); // Map the key to its corresponding object
    }

    function extractAndList(input) {
        let cleanedString = input.replace(/\t|\n|\r/g, '');
        let cleanedString2 = cleanedString.replace(/\[.*?\]|\{.*?\}|\(.*?\)/g, '@=@=@');
        let result = cleanedString2.split(/@=@=@/).filter(Boolean);
        return result;
    }

    function findLongestCJKString(strings) {
        const cjkRegex = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;
        const keywordsToRemove = ["SFW", "NSFW"]

        // Remove specified keywords from the end of each string
        const processedStrings = strings.map(str => {
            let result = str.trim();
            // Check each keyword (case insensitive)
            for (const keyword of keywordsToRemove) {
                const lowerResult = result.toLowerCase();
                const lowerKeyword = keyword.toLowerCase();

                if (lowerResult.endsWith(lowerKeyword)) {
                    // Remove the keyword and any preceding whitespace
                    const index = lowerResult.lastIndexOf(lowerKeyword);
                    result = result.substring(0, index).trim();
                    break; // Only remove one keyword (the first match at end)
                }
            }
            return result;
       });

        if (processedStrings.length === 1) return processedStrings[0];
        const cjkStrings = processedStrings.filter(str => cjkRegex.test(str));

        return (cjkStrings.length > 0
                ? cjkStrings.reduce((longest, current) => current.length > longest.length ? current : longest, '')
                : processedStrings.reduce((longest, current) => current.length > longest.length ? current : longest, '')
               );
    }


    function addSearchButtons(keys, query_tag) {
        const h1Tags = document.querySelectorAll(query_tag);
        h1Tags.forEach(h1 => {
            // Check if buttons container already exists
            if (h1.nextSibling && h1.nextSibling.classList && h1.nextSibling.classList.contains('search-buttons-container')) {
                return;
            }

            // Create container for buttons
            const container = document.createElement('div');
            container.className = 'search-buttons-container';

            const searchEngines = getEnigneDefines(keys);

            // Create buttons for each search engine
            searchEngines.forEach(engine => {
                const button = document.createElement('button');
                button.textContent = ` Search in ${engine.name} `;
                button.className = `jump-to-${engine.name}`;

                const post_keyword = findLongestCJKString(extractAndList(h1.textContent.trim()));
                const url_keyword = encodeURIComponent(post_keyword);

                button.addEventListener('click', () => {
                    window.open(`${engine.url}${url_keyword}`, '_blank');
                });

                container.appendChild(button);
            });

            // Insert the container after the h1
            h1.parentNode.insertBefore(container, h1.nextSibling);
        });
    }




    if (window.location.host.includes('moyu.moe')) {
        const observeDOMChanges = () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    if (window.location.pathname.startsWith('/patch')) {
                        addSearchButtons(["2dfan", "ggbase","ai2moe"], 'h1');
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        observeDOMChanges();
        addSearchButtons(["2dfan", "ggbase", "ai2moe"], 'h1');
    } else /* if (window.location.host.includes('ai2.moe')) */ {
        addSearchButtons(["2dfan", "ggbase", "moyu"], 'h1');
    };
       // else if (window.location.host.includes('2dfan')) {
       //  addSearchButtons(["2dfan", "ggbase", "moyu"], 'h3');
       // }
})();