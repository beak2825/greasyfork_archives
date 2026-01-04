// ==UserScript==
// @name         BACourseDuration
// @namespace    BrainstormAcademyAddons
// @version      2.0.3
// @description  Adds course duration info to course screen.
// @author       Renato Bispo
// @match        https://app.brainstorm.academy/curso/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495203/BACourseDuration.user.js
// @updateURL https://update.greasyfork.org/scripts/495203/BACourseDuration.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Constants
    const initialScriptExecutionDelay = 3000;
    const subsequentScriptExecutionDelay = 1000;

    // State
    let shouldRunScript = true;
    let scriptExecutionDelay = initialScriptExecutionDelay;

    // Element selectors
    const classPlaylistSelector = '.onboarding-target-playlist';
    const moduleButtonsSelector = '[data-radix-collection-item]';
    const collapsedModuleButtonsSelector = `${moduleButtonsSelector}[aria-expanded='false']`;

    // Selector functions
    const getClassPlaylist = () => document.querySelector(classPlaylistSelector);

    const getModuleButtons = () => {
        return Array.from(document.querySelectorAll(moduleButtonsSelector));
    }

    const getCollapsedModuleButtons = () => {
        return Array.from(document.querySelectorAll(collapsedModuleButtonsSelector));
    }

    const getClassDurationElements = () => {
        const spanElements = Array.from(document.querySelectorAll('span'));
        const regex = /\b(\d{1,3})min\b/;

        return spanElements.filter((element) => regex.test(element.innerHTML));
    }

    const getClassPlaylistHeadingContainer = () => {
        const classPlaylist = getClassPlaylist();
        const spanElements = classPlaylist.querySelectorAll('span');

        const classPlaylistHeading = Array
            .from(spanElements).find(({textContent}) => textContent == 'Aulas');

        return classPlaylistHeading.parentElement.parentElement;
    }

    // Helpers
    const getCourseDuration = (classDurationElements) => classDurationElements
        .map((element) => parseInt(element.innerHTML))
        .reduce((total, current) => total + current);

    const getFormattedCourseDuration = (courseDuration) => {
        const hours = courseDuration / 60;
        const wholeHours = Math.floor(hours);
        const minutes = (hours - wholeHours) * 60;
        const roundedMinutes = Math.round(minutes);
        const formattedMinutes = roundedMinutes < 10 ? `0${roundedMinutes}` : roundedMinutes;

        return `${wholeHours}h${formattedMinutes}min`
    }

    const expandModules = (moduleButtons) => {
        moduleButtons.forEach((button) => button.click());
    }

    const displayCourseDuration = (formattedCourseDuration) => {
        const classPlaylistHeadingContainer = getClassPlaylistHeadingContainer();
        const infoContainer = document.createElement('div');
        const durationHeading = document.createElement('span');
        const durationText = document.createElement('span');
        
        infoContainer.style = `
            background: #1F282D;
            padding: 12px;
            border-radius: 4px;
            color: white;
            font-family: Roboto, sans-serif;
            font-size: 12px;
            line-height: 14px;
        `;

        durationHeading.style = 'line-height: 20px';
        durationText.style = 'color: #A6B3BF;';

        durationHeading.textContent = 'Carga Horária: ';
        durationText.textContent = `${formattedCourseDuration}`;
        
        infoContainer.appendChild(durationHeading);
        infoContainer.appendChild(durationText);
        classPlaylistHeadingContainer.insertAdjacentElement('afterend', infoContainer);
    }

    const observerTarget = document;
    const observerConfig = { attributes: false, childList: true, subtree: true };

    const observerCallback = (_mutationList, observer) => {
        const classPlaylist = getClassPlaylist();

        if (classPlaylist) {
            observer.disconnect();

            setTimeout(() => {
                console.log('Found class playlist.');   
                const moduleButtons = getModuleButtons();
                if (shouldRunScript && moduleButtons.length) {
                    scriptExecutionDelay = subsequentScriptExecutionDelay;
                    console.log('Found module buttons.');
                    const collapsedModuleButtons = getCollapsedModuleButtons();
    
                    console.log('Expanding modules...');
                    expandModules(collapsedModuleButtons);
    
                    const remainingCollapsedModuleButtons = getCollapsedModuleButtons();
                    if(remainingCollapsedModuleButtons.length === 0) {
                        shouldRunScript = false;
                        console.log('Calculating course duration...');
                        const classDurationElements = getClassDurationElements();
                        const courseDuration = getCourseDuration(classDurationElements);
                        const formattedCourseDuration = getFormattedCourseDuration(courseDuration);
    
                        console.log('Displaying course duration...');
                        displayCourseDuration(formattedCourseDuration);
            
                        console.log('Script ran successfully!');
                        scriptExecutionDelay = initialScriptExecutionDelay;
                    } else {
                        console.log('Found collapsed module buttons.');
                    }
                } else if (shouldRunScript) {
                    console.log('Module buttons not found.');
                }

                observer.observe(observerTarget, observerConfig);
            }, scriptExecutionDelay);
        } else {
            console.log('Class playlist not found. Resetting state...');
            shouldRunScript = true;
        }
    }

    const observer = new MutationObserver(observerCallback);

    observer.observe(observerTarget, observerConfig);


})();