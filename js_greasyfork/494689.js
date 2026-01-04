// ==UserScript==
// @name Twitch Sort by Newest/Oldest
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Sorts Twitch clips by newest or oldest on the 24-hour clips page
// @author MahdeenSky
// @match https://www.twitch.tv/*/clips?filter=clips&range=24hr
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494689/Twitch%20Sort%20by%20NewestOldest.user.js
// @updateURL https://update.greasyfork.org/scripts/494689/Twitch%20Sort%20by%20NewestOldest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sortByNewest = true;
    
    function sortClips() {
        console.log(`Sorting clips by ${sortByNewest ? 'newest' : 'oldest'}...`);
    
        const clipTowers = document.querySelectorAll('.ScTower-sc-1sjzzes-0');
        const clipTower = clipTowers[1];
    
        if (clipTower) {
            console.log("Found clip tower element:", clipTower);
        } else {
            console.error("Clip tower element not found!");
            return; // Exit if the main container is not found
        }
    
        const clipCards = Array.from(clipTower.querySelectorAll('.Layout-sc-1xcs6mc-0[data-a-target^="clips-card-"]'));
        console.log("Found", clipCards.length, "clip cards.");
    
        clipCards.sort((a, b) => {
            const elementA = a.querySelectorAll('.ScPositionCorner-sc-1shjvnv-1');
            const elementB = b.querySelectorAll('.ScPositionCorner-sc-1shjvnv-1');
            const timeA = elementA[elementA.length - 1].textContent.trim();
            const timeB = elementB[elementB.length - 1].textContent.trim();
    
            // edge case, if there is 'Yesterday' in the time, it should be considered as the oldest or newest
            if (timeA.includes('Yesterday')) {
                return sortByNewest ? -999 : 999;
            } else if (timeB.includes('Yesterday')) {
                return sortByNewest ? 999 : -999;
            }
    
            // handle hours ago and minutes ago cases
            let timeAValue = parseInt(timeA);
            let timeBValue = parseInt(timeB);
    
            if (timeA.includes('hour')) {
                timeAValue *= 60;
            }
            if (timeB.includes('hour')) {
                timeBValue *= 60;
            }
    
            return sortByNewest ? timeBValue - timeAValue : timeAValue - timeBValue;
        });
    
        clipTower.innerHTML = '';
        clipCards.forEach(card => clipTower.appendChild(card));
    
        console.log("Clips sorted successfully.");
    }
    
    // Create sort button
    const sortButton = document.createElement('button');
    sortButton.textContent = 'Sort by Newest';
    sortButton.style.backgroundColor = '#6441A5';
    sortButton.style.color = 'white';
    sortButton.style.padding = '10px 20px';
    sortButton.style.border = 'none';
    sortButton.style.cursor = 'pointer';
    sortButton.style.borderRadius = '5px';
    sortButton.style.marginTop = '10px';
    
    sortButton.addEventListener('click', () => {
        sortByNewest = !sortByNewest;
        sortButton.textContent = `Sort by ${sortByNewest ? 'Newest' : 'Oldest'}`;
        sortClips();
    });
    
    function addSortButton() {
        const sortContainer = document.querySelector('div[data-test-selector="sort"]');
        if (sortContainer) {
            console.log("Found sort container element:", sortContainer);
            sortContainer.appendChild(sortButton);
            console.log("Sort button added.");
        } else {
            console.log("Sort container element not found. Setting up observer...");
            const observer = new MutationObserver(mutations => {
                const sortContainer = document.querySelector('div[data-test-selector="sort"]');
                if (sortContainer) {
                    console.log("Sort container element found by observer:", sortContainer);
                    sortContainer.appendChild(sortButton);
                    console.log("Sort button added.");
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
    
    addSortButton();
    })();