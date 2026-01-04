// ==UserScript==
// @name         CAI Profile Statistics
// @description  Displays more detailed statistics in your Character.AI profile.
// @version      1.1
// @namespace    https://ShareYourCharacters.com/
// @author       SycAdmin
// @match        https://character.ai/profile/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513754/CAI%20Profile%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/513754/CAI%20Profile%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForFirstDiv() {
        const firstDiv = document.querySelector('div[role="tabpanel"]');
        if (firstDiv) {
            observeChanges(firstDiv);
        } else {
            setTimeout(waitForFirstDiv, 1000); // Wait 1 second and check again
        }
    }

    function observeChanges(firstDiv) {
        const observer = new MutationObserver(function() {
            updateSums();
        });

        observer.observe(firstDiv, { childList: true, subtree: true });
        updateSums();
    }

    function countBots() {
        const elems = document.querySelectorAll('div[role="tabpanel"] a.group');
        return elems.length;
    }

    function countChats() {
        const elems = document.querySelectorAll('div[role="tabpanel"] p');
        let sum = 0;

        for (let i = 1; i < elems.length; i++) {
            const text = elems[i].innerText.trim();
            if (isChatNumber(text)) {
                const number = parseNumber(text);
                sum += number;
            }
        }

        console.log('Sum of chat numbers:', sum);
        return sum;
    }

    function countLikes() {
        const elems = document.querySelectorAll('div[role="tabpanel"] p');
        let sum = 0;

        for (let i = 1; i < elems.length; i++) {
            const text = elems[i].innerText.trim();
            console.log("WHAT?  " + text);
            if (isLikeNumber(text)) {
                const number = parseNumber(text);
                console.log(number);
                sum += number;
            }
        }

        console.log('Sum of like numbers:', sum);
        return sum;
    }

    function updateSums() {
        const totals = document.getElementById('allTotalCounts');
        const chatCount = countChats();
        const likeCount = countLikes();
        if (totals) {
            totals.textContent = "Totals: " + countBots() + " bots \u2022 " + chatCount.toLocaleString() + " chats \u2022 " + likeCount.toLocaleString() + " likes";
        }
    }

    function isChatNumber(text) {
        return /^\d.*chats?$/.test(text);
    }

    function isLikeNumber(text) {
        return /^\d.*likes?$/.test(text);
    }
    function isTotalChatsNumber(text) {
        return /^\d.*Chats?$/.test(text);
    }

    function parseNumber(text) {
        text = text.trim().split(" ", 1)[0];
        const numberString = text.replace(/,/g, '');
        let number = parseFloat(numberString);

        if (text.includes('k')) {
            number *= 1000;
        } else if (text.includes('m')) {
            number *= 1000000;
        }

        return number;
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        createTotalCounts();
    });

    function findFirstParagraphWithSubstring(substring) {
        // Get all the <p> tags on the page
        var paragraphs = document.getElementsByTagName('p');

        // Loop through each <p> tag
        for (var i = 0; i < paragraphs.length; i++) {
            var paragraph = paragraphs[i];

            // Check if the innerText of the <p> tag contains the substring
            if (isTotalChatsNumber(paragraph.innerText)) {
                // Found the first <p> tag containing the substring
                return paragraph;
            }
        }

        // No matching <p> tag found
        return null;
    }

    function createTotalCounts() {
        const firstChatCount = findFirstParagraphWithSubstring(" Chat");

        if (firstChatCount) {
            const totalCounts = firstChatCount.cloneNode(false);
            totalCounts.classList.add('text-muted-foreground');
            totalCounts.id = 'allTotalCounts';
            totalCounts.textContent = '()';
            //firstChatCount.parentNode.appendChild(totalCounts);
            firstChatCount.parentNode.parentNode.insertBefore(totalCounts, firstChatCount.parentNode.nextSibling);
            waitForFirstDiv();
        } else {
            setTimeout(createTotalCounts, 1000); // Wait 1 second and check again
        }
    }
})();