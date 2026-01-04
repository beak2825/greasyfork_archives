// ==UserScript==
// @name         AJR log Anilist
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Crea un botón para guardar logs para AJR
// @author       alexay7
// @license      GNU GPLv3
// @match        *://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/475426/AJR%20log%20Anilist.user.js
// @updateURL https://update.greasyfork.org/scripts/475426/AJR%20log%20Anilist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findDifferenceInText(text) {
        // Use regular expressions to extract numbers from the text

        const episodes = text.match(/episode.*?of/g);
        const numbers = episodes[0].match(/\d+/g);

        // Check if there are at least two numbers in the text
        if (numbers && numbers.length >= 2) {
            // Calculate the difference between the two numbers and add one
            const num1 = parseInt(numbers[0]);
            const num2 = parseInt(numbers[1]);
            const difference = num2 - num1 + 1;

            return {diff:difference,start:num1,end:num2};
        } else {
            // If there are not enough numbers in the text, return an error message or handle it as needed
            return {diff:1,start:numbers[0]};
        }
    }

    function addButtonAndCopyText(element) {
        let isWatched=false;
        const [isLog] = element.parentElement.getElementsByClassName("list");
        if(isLog){
            isWatched=isLog.getElementsByClassName("details")[0].getElementsByClassName("status")[0].textContent.includes("Watched");
        }
        if (isWatched&&!element.querySelector('.copy-button')) {
            const button = document.createElement('span');
            button.innerText = 'Copiar log';
            button.className = 'copy-button';
            button.style.background = 'transparent';
            button.style.border="none";
            button.style.color="var(--color-text-lighter)";
            button.style.fontWeight=800;
            button.style.fontSize="1.1rem";
            button.style.cursor="pointer";
            button.style.fontFamily="Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif";
            button.style.marginLeft="10px";
            element.appendChild(button);

            button.addEventListener('click', () => {
                const parentEl = element.parentElement;
                const details = parentEl.getElementsByClassName("list")[0].getElementsByClassName("details")[0].getElementsByClassName("status")[0];
                const episodes = findDifferenceInText(details.textContent);
                const name = details.getElementsByClassName("title")[0].textContent;
                console.log(details.textContent)
                if (!episodes.end){
                    GM_setClipboard('.log anime '+episodes.diff+' '+name.trim()+' '+episodes.start, 'text');
                }else{
                    GM_setClipboard('.log anime '+episodes.diff+' '+name.trim()+' '+episodes.start+'-'+episodes.end, 'text');
                }
            });
        }
    }

    // Function to handle mutations
    function handleMutations(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the mutation added elements with class "time"
                const timeElements = document.querySelectorAll('.time');
                timeElements.forEach(addButtonAndCopyText);
            }
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(handleMutations);

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

})();