// ==UserScript==
// @license      it made me include this idk
// @name         Always Set AI Studio Filters to None
// @description  Sets all safety settings to none whenever the page loads or model changes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        *://aistudio.google.*/*
// @grant        none
// @author       HORSELOCKSPACEPIRATE/rayzorium
// @downloadURL https://update.greasyfork.org/scripts/500534/Always%20Set%20AI%20Studio%20Filters%20to%20None.user.js
// @updateURL https://update.greasyfork.org/scripts/500534/Always%20Set%20AI%20Studio%20Filters%20to%20None.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = 300; //millis to wait for sliders to appear, increase this is your shit's not working

    // Function to set sliders to lowest value (-4)
    function setSlidersToLowest(dialogContainer) {
            const sliders = dialogContainer.querySelectorAll('mat-slider input[type="range"]');
            sliders.forEach(slider => {
                slider.value = -4;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));
            });
            // Close the dialog box
            dialogContainer.querySelector('button[aria-label="Close Run Safety Settings"]').click();
    }

    // Function to attempt setting sliders on page load or model change
    function setSliderOnLoadOrChange() {
        // Try to find and click the "Edit safety settings" button
        const editButton = document.querySelector('.edit-safety-button') || document.querySelector('.settings-item.safety-settings');
        if (editButton) {
            editButton.click();
        } else {
            // If button not found, try again after a short delay
            setTimeout(setSliderOnLoadOrChange, 100);
        }
    }

    // Mutation observer to detect when the safety settings dialog appears
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const addedNode = mutation.addedNodes[0];
                if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.matches('mat-dialog-container')) {
                    setTimeout(() => setSlidersToLowest(addedNode), delay); // Adding a slight delay to ensure sliders are loaded
                }
            }
        });
    });

    // Start observing the body for additions of the dialog container
    observer.observe(document.body, { childList: true, subtree: true });

    // Adding click event listener to the "Edit safety settings" button
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.closest('.edit-safety-button') || e.target.closest('.settings-item.safety-settings'))) {
            // We wait for the dialog to be added to the DOM
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    // Function to handle model change
    function handleModelChange(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                // Model has changed, trigger slider adjustment
                setSliderOnLoadOrChange();
                break;
            }
        }
    }

    // Create an observer for the model selector
    const modelObserver = new MutationObserver(handleModelChange);

    // Function to start observing the model selector
    function observeModelSelector() {
        const modelSelector = document.querySelector('#model-selector .mat-mdc-select-value-text');
        if (modelSelector) {
            modelObserver.observe(modelSelector, { childList: true, characterData: true, subtree: true });
        } else {
            // If not found, try again after a short delay
            setTimeout(observeModelSelector, 1000);
        }
    }

    // Run the setSliderOnLoadOrChange function when the page is fully loaded
    if (document.readyState === 'complete') {
        setSliderOnLoadOrChange();
        observeModelSelector();
    } else {
        window.addEventListener('load', () => {
            setSliderOnLoadOrChange();
            observeModelSelector();
        });
    }
})();