// ==UserScript==
// @name         Skip Steam Discovery Queue
// @namespace    http://tampermonkey.net/
// @version      2024-07-02
// @description  Auto-skipping discovery queue on Steam store
// @author       fxbjxn
// @license      MIT
// @match        https://store.steampowered.com/app/*
// @match        https://store.steampowered.com/agecheck/*
// @match        https://store.steampowered.com/explore/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499527/Skip%20Steam%20Discovery%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/499527/Skip%20Steam%20Discovery%20Queue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickCount = parseInt(localStorage.getItem('clickCount')) || 0;
    var isClicking = localStorage.getItem('isClicking') === 'true';


    var queueSubText = document.querySelector('.queue_sub_text');
    var maxClicks = 11;

    //find number of left queue items
    if (queueSubText) {
        let numberMatch = queueSubText.textContent.match(/\d+/);
        if (numberMatch) {
            maxClicks = parseInt(numberMatch[0]);
        }
    }

    if (clickCount >= maxClicks) {
        clickCount = 0;
        localStorage.setItem('clickCount', clickCount);
    }

    function getDiscoverQueueButton() {
        return document.querySelector('.btn_next_in_queue.btn_next_in_queue_trigger');
    }

    var parentDiv = document.querySelector('.queue_ctn.in_queue');
    var containerDiv = document.createElement("div");
    var buttonDiv = document.createElement("div");
    var discoverQueueButton = getDiscoverQueueButton();

    containerDiv.setAttribute("class", "button-container");
    buttonDiv.setAttribute('class', "button");

    var text = document.createTextNode("Auto-Skip all queue");
    containerDiv.appendChild(buttonDiv);

    if (parentDiv) {
        parentDiv.appendChild(containerDiv);
    }

    buttonDiv.appendChild(text);

    buttonDiv.addEventListener("click", function() {
        localStorage.setItem('isClicking', 'true');
        clickCount = 0;
        localStorage.setItem('clickCount', clickCount);
        clickQueueButton();
    });

    function clickQueueButton() {
        if (window.location.href === 'https://store.steampowered.com/explore/') {
            localStorage.setItem('isClicking', 'false');
            localStorage.setItem('clickCount', 0);
            return;
        }

        discoverQueueButton = getDiscoverQueueButton();
        if (!discoverQueueButton) {
            console.error('Discover queue utton not found checking again in 2 seconds');
            setTimeout(clickQueueButton, 2000);
            return;
        }

        if (clickCount < maxClicks) {
            discoverQueueButton.click();
            clickCount++;
            localStorage.setItem('clickCount', clickCount);
            setTimeout(clickQueueButton, 3000);
        } else {
            localStorage.setItem('isClicking', 'false');
        }
    }

    if (isClicking && clickCount < maxClicks) {
        clickQueueButton();
    }

    var ageGate = document.querySelector('.agegate_text_container');
    if (ageGate) {
        discoverQueueButton.click();
    }
    //styling
    containerDiv.style.display = 'flex';
    containerDiv.style.justifyContent = 'right';

    buttonDiv.style.backgroundColor = '#866f3c';
    buttonDiv.style.fontSize = '1rem';
    buttonDiv.style.padding = '1rem';
    buttonDiv.style.borderRadius = '1px 14px 1px 14px';
    buttonDiv.style.marginRight = '-3.6%';
    buttonDiv.style.marginTop = '-1.5%';
    buttonDiv.style.userSelect = 'none';
    buttonDiv.style.cursor = 'pointer';
})();