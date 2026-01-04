// ==UserScript==
// @name        Instagram Auto Next Click
// @namespace   Instagram Auto Next Click
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description autoclicks the next button smartly to feel like slideshow.For Videos wait till it plays twice before clicking next.Preview all post in Instagram carousel before jumping to next post.
// @downloadURL https://update.greasyfork.org/scripts/528538/Instagram%20Auto%20Next%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/528538/Instagram%20Auto%20Next%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoNextEnabled = false;
    let debounceTimeout;
    let customTime = 30000; // Default 30 seconds

    function debounce(func, wait) {
        return function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(func, wait);
        };
    }

    function autoNextPhotos() {
        if (!autoNextEnabled) return;
        let newButton = document.querySelector('button._afxw._al46._al47 div._9zm2');
        let nextButton = document.querySelector('button._abl- svg[aria-label="Next"]');
        let video = document.querySelector('video');

        if (video) {
            console.log(`Video detected. Waiting for video to play twice`);
            video.play();
            let playCount = 0;

            video.addEventListener('ended', () => {
                playCount++;
                if (playCount < 2) {
                    video.play();
                } else {
                    if (newButton) {
                        console.log(`Next photo in ${customTime / 1000} seconds (using new button)`);
                        setTimeout(() => {
                            if (document.querySelector('button._afxw._al46._al47 div._9zm2')) {
                                newButton.closest('button').click();
                            } else if (nextButton) {
                                nextButton.closest('button').click();
                            } else {
                                console.log('Next button not found after delay');
                            }
                        }, customTime); // Custom delay
                    } else if (nextButton) {
                        console.log(`Next photo in ${customTime / 1000} seconds (using old button)`);
                        setTimeout(() => {
                            if (document.querySelector('button._abl- svg[aria-label="Next"]')) {
                                nextButton.closest('button').click();
                            } else {
                                console.log('Next button not found after delay');
                            }
                        }, customTime); // Custom delay
                    } else {
                        console.log('Next photo button not found');
                    }
                }
            });
        } else if (newButton) {
            console.log(`Next photo in ${customTime / 1000} seconds (using new button)`);
            setTimeout(() => {
                if (document.querySelector('button._afxw._al46._al47 div._9zm2')) {
                    newButton.closest('button').click();
                } else if (nextButton) {
                    nextButton.closest('button').click();
                } else {
                    console.log('Next button not found after delay');
                }
            }, customTime); // Custom delay
        } else if (nextButton) {
            console.log(`Next photo in ${customTime / 1000} seconds (using old button)`);
            setTimeout(() => {
                if (document.querySelector('button._abl- svg[aria-label="Next"]')) {
                    nextButton.closest('button').click();
                } else {
                    console.log('Next button not found after delay');
                }
            }, customTime); // Custom delay
        } else {
            console.log('Next photo button not found');
        }
    }

    function startSlideshow() {
        let newButton = document.querySelector('button._afxw._al46._al47 div._9zm2');
        let nextButton = document.querySelector('button._abl- svg[aria-label="Next"]');
        if (newButton) {
            newButton.closest('button').click();
        } else if (nextButton) {
            nextButton.closest('button').click();
        } else {
            console.log('Next button not found to start slideshow');
        }
    }

    function createToggleButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '42px'; // 
        buttonContainer.style.right = '5px'; // 
        buttonContainer.style.zIndex = '10000';

        const toggleButton = document.createElement('button');
        toggleButton.innerText = 'Slideshow';
        toggleButton.style.padding = '4px 10px'; // 
        toggleButton.style.backgroundColor = '#262626';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = '1px solid #ccc';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.gap = '5px';

        const timeInput = document.createElement('input');
        timeInput.type = 'number';
        timeInput.placeholder = 'Sec';
        timeInput.style.width = '30px'; // 
        timeInput.style.padding = '3px'; // 
        timeInput.style.border = '1px solid #ccc';
        timeInput.style.borderRadius = '5px';
        timeInput.style.outline = 'none';
        timeInput.style.color = '#fff'; // 
        timeInput.style.backgroundColor = '#262626'; // 

        toggleButton.appendChild(timeInput);

        toggleButton.addEventListener('click', (event) => {
            if (event.target !== timeInput) { // Ensure only the button click triggers the slideshow
                autoNextEnabled = !autoNextEnabled;
                toggleButton.style.backgroundColor = autoNextEnabled ? '#34c759' : '#ff3b30';
                customTime = parseInt(timeInput.value) * 1000 || 30000; // Update custom time or default to 30 seconds
                console.log('Auto Next Enabled:', autoNextEnabled);
                console.log('Custom Time:', customTime / 1000, 'seconds');
                if (autoNextEnabled) {
                    startSlideshow(); // Kickstart the slideshow
                }
            }
        });

        buttonContainer.appendChild(toggleButton);
        document.body.appendChild(buttonContainer);
        console.log('Toggle button with custom time input created');
    }

    const observer = new MutationObserver(debounce(() => {
        console.log('Mutation observed');
        if (autoNextEnabled) {
            autoNextPhotos();
        }
    }, 1000));

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('MutationObserver set up');

    window.addEventListener('load', () => {
        console.log('Page loaded');
        createToggleButton();
    });

})();
