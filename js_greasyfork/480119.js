// ==UserScript==
// @name         Ignore J and F from Work time recording
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ignore J and F from Work time recording in Moco
// @match        https://vlabs.mocoapp.com/profile/performance
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480119/Ignore%20J%20and%20F%20from%20Work%20time%20recording.user.js
// @updateURL https://update.greasyfork.org/scripts/480119/Ignore%20J%20and%20F%20from%20Work%20time%20recording.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(resetTimer);
    var timer = setTimeout(action, 1000, observer); // wait for the page to stay still for 3 seconds
    observer.observe(document, {childList: true, subtree: true});

    // reset timer every time something changes
    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, 1000, observer);
    }
    function placeAfter(parent, child, selector) {
        const firstMatch = parent.querySelector(selector);
        if (firstMatch) {
            firstMatch.insertAdjacentElement('afterend', child);
        }
    }


    function action(observer) {
        observer.disconnect();
        const J = Number(document.querySelectorAll('.text-sm.fa-blue')[0].textContent);
        const F = Number(document.querySelectorAll('.text-sm.fa-blue')[1].textContent);

        const sum = document.querySelectorAll('.-mt-2')[0].textContent;
        const adjusted = Number(sum) - J - F

        const elem = document.createElement("div")
        const numberSpan = document.createElement("span")
        const explSpan = document.createElement("span")
        if (adjusted > 0) {
            numberSpan.classList.add("number-positive-signed");
            numberSpan.classList.add("number-positive");
        } else {
            numberSpan.classList.add("number-default");
        }

        numberSpan.innerText = adjusted
        explSpan.innerText = ' (ignoring J and F)'
        explSpan.classList.add("number-default");
        elem.appendChild(numberSpan)
        elem.appendChild(explSpan)

        const parent = document.querySelector('.tst-user-performance')
        placeAfter(parent, elem, '.-mt-2')
    }
})();

