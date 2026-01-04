// ==UserScript==
// @name         Dropout.tv "App Available Now" Score Counter
// @namespace    https://foolmoron.io/
// @version      0.1
// @description  Add a score counter next to the "App Available Now" X button tracking how many times you have clicked it
// @author       foolmoron
// @include      *dropout.tv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377665/Dropouttv%20%22App%20Available%20Now%22%20Score%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/377665/Dropouttv%20%22App%20Available%20Now%22%20Score%20Counter.meta.js
// ==/UserScript==

var counterHTML = `
<div style="
    position: absolute;
    top: 50%;
    right: 80px;
    background: hsl(0, 99%, 66%);
    color: white;
    font-family: monospace;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 5px;
    border-width: 4px;
    border-style: solid;
    border-color: hsl(0, 99%, 84%);
    border-radius: 6px;
    transform: translate3d(0, -50%, 0);
    transition: 0.15s border, 0.22s transform;
">9999</div>
`;


(function() {
    'use strict';
    var poll = setInterval(function() {
        var banner = document.querySelector('.alert-bar');
        if (banner) {
            clearInterval(poll);
            var score = parseInt(localStorage.getItem('app-available-score-counter')) || 0;

            var dummy = document.createElement('div');
            dummy.innerHTML = counterHTML;
            var counter = dummy.firstElementChild;
            counter.textContent = score;
            banner.appendChild(counter);

            var oldButton = banner.querySelector('.close-button');
            var newButton = oldButton.cloneNode(true);
            oldButton.style.display = 'none';
            newButton.addEventListener('click', e => {
                var newScore = score + 1;
                localStorage.setItem('app-available-score-counter', newScore);
                counter.textContent = newScore;
                newButton.style.display = 'none';
                oldButton.style.display = 'block';

                var oldColor = counter.style.borderColor;
                counter.style.borderColor = 'white';
                var oldTransform = counter.style.transform;
                counter.style.transform = oldTransform + ' scale(1.25)';
                setTimeout(() => {
                    counter.style.borderColor = oldColor;
                    counter.style.transform = oldTransform;
                }, 220);
                setTimeout(() => {
                    oldButton.click();
                }, 570);
            })
            banner.appendChild(newButton);
        }
    }, 500);
})();