// ==UserScript==
// @name         Rumble Studio Scene Mover
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Reorder the page so that the Scene controls and the Participants' Shares are closer together.
// @author       x.com/theInternetDads
// @match        *studio.rumble.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rumble.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511778/Rumble%20Studio%20Scene%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/511778/Rumble%20Studio%20Scene%20Mover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('IDS Internet Dads Show script loaded');

    let parentElement = null;
    let mxAutoElement = null;
    let fullVideoElement = null;
    let participantsElement = null;
    let intervalId = null;
    let ulElement = null;
    let sharedDiv = null;
    let headerDiv = null;
    let footerDiv = null;
    let mxBanner = null;
    let userDiv = null;

    let userBackground = null;
    let userAuto = null;
    let userSolo = null;
    let userDuo = null;
    let userPresentation = null;

    // Create button container
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';

    // Create buttons
    const downButton = document.createElement('button');
    downButton.textContent = '↓';
    downButton.onclick = reorderElementsDown;

    const upButton = document.createElement('button');
    upButton.textContent = '↑';
    upButton.onclick = reorderElementsUp;

    const leftButton = document.createElement('button');
    leftButton.textContent = '←';
    leftButton.onclick = reorderElementsLeft;

    let userButtonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';

    const userDownButton = document.createElement('button');
    userDownButton.textContent = '↓';
    // userDownButton.onclick = reorderElementsDown;

    const userUpButton = document.createElement('button');
    userUpButton.textContent = '↑';
    // userUpButton.onclick = reorderElementsUp;

    // Append buttons to container
    buttonContainer.appendChild(upButton);
    buttonContainer.appendChild(leftButton);
    buttonContainer.appendChild(downButton);
    userButtonContainer.appendChild(userUpButton);
    userButtonContainer.appendChild(userDownButton);

    // Function to reorder elements
    function reorderElementsDown() {
        console.log('Reorder function called');
        if (parentElement && mxAutoElement && fullVideoElement && participantsElement) {
            console.log('Correct parent and children elements found:', parentElement, mxAutoElement, fullVideoElement, participantsElement);
            sharedDiv.insertBefore(mxAutoElement, sharedDiv.firstChild);
            sharedDiv.insertBefore(fullVideoElement, sharedDiv.firstChild);
            upButton.style.display = 'block'; // Show upButton
            downButton.style.display = 'none'; // Hide downButton
            leftButton.style.display = 'block'; // Show leftButton
            sharedDiv.style.flexDirection = 'column';
            ulElement.style.flexDirection = 'row';


            clearInterval(intervalId);
        } else {
            console.log('mx-auto element not found');
        }
    }

    // Function to reorder elements
    function reorderElementsUp() {
        console.log('Reorder function called');
        if (parentElement && mxAutoElement && fullVideoElement && participantsElement) {
            console.log('Correct parent and children elements found:', parentElement, mxAutoElement, fullVideoElement, participantsElement);
            sharedDiv.insertBefore(fullVideoElement, sharedDiv.firstChild);
            sharedDiv.insertBefore(mxAutoElement, sharedDiv.firstChild);
            upButton.style.display = 'none'; // Hide upButton
            downButton.style.display = 'block'; // Show downButton
            leftButton.style.display = 'block'; // Show leftButton
            sharedDiv.style.flexDirection = 'column';
            ulElement.style.flexDirection = 'row';


            clearInterval(intervalId);
        } else {
            console.log('mx-auto element not found');
        }
    }

    function reorderElementsLeft() {
        console.log('Reorder function called');
        if (parentElement && mxAutoElement && fullVideoElement && participantsElement) {
            console.log('Correct parent and children elements found:', parentElement, mxAutoElement, fullVideoElement, participantsElement);
            leftButton.style.display = 'none'; // Hide leftButton
            upButton.style.display = 'block'; // Show upButton
            downButton.style.display = 'block'; // Show downButton
            sharedDiv.insertBefore(fullVideoElement, sharedDiv.firstChild);
            sharedDiv.insertBefore(mxAutoElement, sharedDiv.firstChild);
            ulElement.style.flexDirection = 'column';
            sharedDiv.style.flexDirection = 'row';
            ulElement.style.justifyContent = 'center';
            ulElement.style.justifyContent = 'space-between';
            // Add margin to space out li elements evenly
            Array.from(ulElement.children).forEach(li => {
                li.style.margin = '10px'; // Adjust the margin as needed
            });

            clearInterval(intervalId);
        } else {
            console.log('mx-auto element not found');
        }
    }

    // Function to check for the correct parent and children elements
    function findSceneManager() {
        userDiv = document.querySelector('.flex.grow.items-center.justify-center.gap-x-4');
        if (userDiv) {
            footerDiv = userDiv.parentElement;
            // Additional logic for userDiv if needed
        } else {
            console.log('User div not found');
        }

        headerDiv = document.querySelector('.w-full.max-w-supported.mx-auto.py-3.px-6');
        if (headerDiv) {
            const header0 = headerDiv.querySelector('.flex.items-center.justify-between.space-x-6');
            if (header0 && header0.children.length >= 2) {
                header0.insertBefore(userDiv, header0.children[1]);
            } else {
                console.log('Header0 element or its children not found');
            }
        } else {
            console.log('Header div not found');
        }

        parentElement = document.querySelector('.flex.flex-col.mx-20.space-y-4');
        if (parentElement) {
            const children = Array.from(parentElement.children);
            const hasMxAuto = children.some(child => child.className === 'mx-auto');
            const hasRelativeWFullAspectVideo = children.some(child => child.className === 'relative w-full aspect-video');
            const hasFlexColGapY2 = children.some(child => child.className === 'flex flex-col gap-y-2');
            sharedDiv = document.createElement('div');
            sharedDiv.id = 'IDS.sharedDiv';
            sharedDiv.style.display = 'flex';
            sharedDiv.style.flexDirection = 'column';
            parentElement.insertBefore(sharedDiv, parentElement.firstChild);
            if (hasMxAuto && hasRelativeWFullAspectVideo && hasFlexColGapY2) {
                console.log('Correct parent element and children found:', parentElement);
                mxAutoElement = parentElement.querySelector('.mx-auto');
                if (mxAutoElement) {
                    // tag mxAutoElement divs
                    const mx1 = mxAutoElement.querySelector('div');
                    if (mx1) {
                        const mxUl = mx1.querySelector('ul');
                        if (mxUl && mxUl.children.length === 5) {
                            userBackground = mxUl.children[0].querySelectorAll('div')[1];
                            userAuto = mxUl.children[1].querySelectorAll('div')[1];
                            userSolo = mxUl.children[2].querySelectorAll('div')[1];
                            userDuo = mxUl.children[3].querySelectorAll('div')[1];
                            userPresentation = mxUl.children[4].querySelectorAll('div')[1];

                            // Add mouseover text to each li element
                            mxUl.children[0].title = 'Background';
                            mxUl.children[1].title = 'Auto';
                            mxUl.children[2].title = 'Solo';
                            mxUl.children[3].title = 'Duo';
                            mxUl.children[4].title = 'Presentation';

                            // Example: Hide userPresentation
                            userBackground.style.display = 'none';
                            userAuto.style.display = 'none';
                            userSolo.style.display = 'none';
                            userDuo.style.display = 'none';
                            userPresentation.style.display = 'none';
                        }
                    }
                }
                fullVideoElement = parentElement.querySelector('.relative.w-full.aspect-video');
                participantsElement = parentElement.querySelector('.flex.flex-col.gap-y-2');
                sharedDiv.appendChild(mxAutoElement);
                sharedDiv.appendChild(fullVideoElement);
                const FullSpaceY2Element = mxAutoElement.querySelector('.w-full.space-y-2');
                if (ulElement == null) {
                    ulElement = FullSpaceY2Element.querySelector('ul.flex.items-center.space-x-4.mx-auto');
                    const ulElementChildOne = ulElement.children[0];
                    const ulElementChildZero = document.createElement('li');
                    ulElement.insertBefore(ulElementChildZero, ulElementChildOne);
                    if (ulElement) {
                        const newLiElement = document.createElement('li');
                        newLiElement.className = 'flex flex-col gap-y-2 p-2 bg-navy rounded-lg cursor-pointer hover:brightness-125 text-light';
                        newLiElement.appendChild(buttonContainer);
                        ulElement.appendChild(newLiElement);
                        // reorderElementsDown();
                        // alert('Scene Manager location controls added');
                    } else {
                        ulElement = null;
                    }
                }

            }
        } else {
            parentElement = null;
            mxAutoElement = null;
            fullVideoElement = null;
            participantsElement = null;
        }

        if ( parentElement && headerDiv && userDiv && mxAutoElement && fullVideoElement && participantsElement && ulElement ) {
            clearInterval(intervalId);
            return;
        }
        console.log('Correct parent element or children not found');
    }

    // Initial log to confirm script is running
    console.log('Script loaded and text added to the page');

    // Use setInterval to repeatedly check for the correct elements
    intervalId = setInterval(() => {
        findSceneManager();
    }, 1000); // Adjust the interval time as needed

    console.log('Interval set up');
})();