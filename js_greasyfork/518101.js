// ==UserScript==
// @name         FFA Script Selector
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Script for select all scripts available
// @author       krcanacu
// @license      MIT
// @match        http://vcc-review-caption-alpha.corp.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/515949/1487240/FFA%20Foul%20Language%20Processor.js
// @downloadURL https://update.greasyfork.org/scripts/518101/FFA%20Script%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/518101/FFA%20Script%20Selector.meta.js
// ==/UserScript==

//Add all script sources as @require, just logic, not GUI

const container = document.createElement('div');
(function() {
    container.style.position = 'fixed';
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.padding = '10px';
    container.style.gap = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.zIndex = 9999;
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    //Title and dropdown div
    const selectionDiv = document.createElement('div');
    container.appendChild(selectionDiv);
    selectionDiv.style.display = "flex";
    selectionDiv.style.justifyContent = "space-around";
    selectionDiv.style.gap = "20px";
    // Container title
    const title = document.createElement('h5');
    title.textContent = 'Script Selection';
    selectionDiv.appendChild(title);

    // Dropdown to select the script
    const dropdown = document.createElement('select');
    dropdown.id = 'scriptSelector';

    //Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a script';
    dropdown.appendChild(defaultOption);

    //Dropdown option1
    const option1 = document.createElement('option');
    option1.value = 'FFAFoulLanguage';
    option1.textContent = 'FFAFoulLanguage';
    dropdown.appendChild(option1);

    //Dropdown option2
    const option2 = document.createElement('option');
    option2.value = 'TempScript';
    option2.textContent = 'TempScript';
    dropdown.appendChild(option2);

    //Add the dropdown to the container
    selectionDiv.appendChild(dropdown);

    // FFAFoulLanguage div
    const FFAFoulLanguageOutput = document.createElement('div');
    FFAFoulLanguageOutput.id = 'FFAFoulLanguageOutput';
    FFAFoulLanguageOutput.style.display = 'none'; //Hidden at first
    container.appendChild(FFAFoulLanguageOutput);

    // TempScript div
    const TempScriptOutput = document.createElement('div');
    TempScriptOutput.id = 'TempScriptOutput';
    TempScriptOutput.style.display = 'none'; //Hidden at first
    container.appendChild(TempScriptOutput);

    // Add container to the body
    document.body.appendChild(container);

    // Dropdown event change
    dropdown.addEventListener('change', function(event) {
        const selectedValue = event.target.value;

        // Both divs hidden
        FFAFoulLanguageOutput.style.display = 'none';
        TempScriptOutput.style.display = 'none';

        // Display the correct div
        if (selectedValue === 'FFAFoulLanguage') {
            FFAFoulLanguageOutput.style.display = 'block';
            runFFAFoulLanguageScript(); // Executes the function for the script
        } else if (selectedValue === 'TempScript') {
            TempScriptOutput.style.display = 'block';
            runTempScript(); // Executes the function for the script
        }
    });

    // FFAFoulLanguage launch function
    function runFFAFoulLanguageScript() {
        //It helps to keep 1 instance on GUI
        const secondChild = container.children[1]; // Access the third child (index 2)
        if (secondChild && secondChild.firstChild) {
            secondChild.removeChild(secondChild.firstChild); // Remove the first child of the third child
        }
        //Loads the popup on the external code
        let popup = LoadFL()
        // Load the script into the div
        FFAFoulLanguageOutput.appendChild(popup)
    }

    // Example function
    function runTempScript() {
         //It helps to keep 1 instance on GUI
        const thirdChild = container.children[2]; // Access the third child (index 2)
        if (thirdChild && thirdChild.firstChild) {
            thirdChild.removeChild(thirdChild.firstChild); // Remove the first child of the third child
        }
        //Loads the popup on the external code
        //let popup = LoadFL()
        const TempScriptMessage = document.createElement('p');
        TempScriptMessage.textContent = 'Ejecutando TempScript...';
        // Load the script into the div
        //FFAFoulLanguageOutput.appendChild(popup)
        TempScriptOutput.appendChild(TempScriptMessage);
    }

    // Dropdown event listener
    dropdown.dispatchEvent(new Event('change'));
})();