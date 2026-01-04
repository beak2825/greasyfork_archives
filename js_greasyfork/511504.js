// ==UserScript==
// @name         Redbubble Auto Fav Free
// @namespace    https://greasyfork.org
// @version      1.0
// @description  The Redbubble Auto Fav automates favoriting on Redbubble
// @author       YAD
// @match        https://www.redbubble.com/shop/*
// @license      NO-REDISTRIBUTION
// @grant        none
// @icon         https://www.redbubble.com/boom/public/favicons/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/511504/Redbubble%20Auto%20Fav%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/511504/Redbubble%20Auto%20Fav%20Free.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let likeQueue = [];
    let currentLikeIndex = 0;
    let delayBetweenClicks = 2000;
    let maxLikes = 250;
    let likesCount = 0;
    let lastLikeTime = 0;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '999999';
    document.body.appendChild(buttonContainer);

    const button = document.createElement('button');
    button.innerText = 'Start';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#ff596f';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.textAlign = 'center';
    button.style.lineHeight = '50px';
    buttonContainer.appendChild(button);

    function startLiking() {
        const likeButtons = document.querySelectorAll('button[data-testid="add-to-list-button"], button[data-testid="favorite-button"]');
        likeQueue = Array.from(likeButtons).filter(button => !button.querySelector('img[data-testid="favourite-icon-remove"]'));

        if (likeQueue.length > 0) {
            currentLikeIndex = 0;
            processNextLike();
        } else {
            isRunning = false;
            button.innerText = 'Start';
        }
    }

    function processNextLike() {
        if (!isRunning || likesCount >= maxLikes) {
            isRunning = false;
            button.innerText = 'Start';
            return;
        }

        const now = Date.now();

        if (now - lastLikeTime >= delayBetweenClicks) {
            if (currentLikeIndex < likeQueue.length) {
                try {
                    const likeButton = likeQueue[currentLikeIndex];
                    likeButton.click();
                    lastLikeTime = now;
                    currentLikeIndex++;
                    likesCount++;
                    button.innerText = likesCount;
                    requestAnimationFrame(() => setTimeout(processNextLike, delayBetweenClicks));
                } catch (error) {
                    console.error("Error clicking like button", error);
                }
            } else {
                isRunning = false;
                button.innerText = 'Start';
            }
        } else {
            requestAnimationFrame(() => setTimeout(processNextLike, 50));
        }
    }

    button.addEventListener('click', function() {
        if (isRunning) {
            isRunning = false;
            button.innerText = 'Start';
        } else {
            isRunning = true;
            lastLikeTime = Date.now();
            button.innerText = likesCount;
            startLiking();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Page loaded and script initialized');
    });
})();
