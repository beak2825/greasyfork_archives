// ==UserScript==
// @name         Add Text to Search Field in ADO and jump to lines with specific keywords. Untick pipeline stages.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds text to the search field on Azure DevOps pages
// @author       chaoscreater
// @match        https://dev.azure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491621/Add%20Text%20to%20Search%20Field%20in%20ADO%20and%20jump%20to%20lines%20with%20specific%20keywords%20Untick%20pipeline%20stages.user.js
// @updateURL https://update.greasyfork.org/scripts/491621/Add%20Text%20to%20Search%20Field%20in%20ADO%20and%20jump%20to%20lines%20with%20specific%20keywords%20Untick%20pipeline%20stages.meta.js
// ==/UserScript==


/*
(function() {
    'use strict';

    // Function to click on the search button and add text to the search field
    function addTextToSearchField() {
        const searchButton = document.querySelector('button#__bolt-log-search');
        if (searchButton) {
            searchButton.click(); // Click on the search button
            // Wait for a short delay to ensure the search field is fully populated
            setTimeout(() => {
                const searchField = document.querySelector('.find-box input.bolt-textfield-input');

                if (searchField) {
                  // set the input value using the native setter - see https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                  // nativeInputValueSetter.call(searchField, 'Plan:');
                  nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');
                  // searchField.value = 'Plan::';

                  // Dispatch an input event to simulate user input
                  searchField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 1000); // Adjust delay time as needed
        }
    }

    // Add text to the search field when the page is fully loaded
    window.addEventListener('load', addTextToSearchField);
})();
*/





// v1
/*
(function() {
    'use strict';

    // Function to click on the search button and add text to the search field
    function addTextToSearchField() {
        const searchButton = document.querySelector('button#__bolt-log-search');
        if (searchButton) {
            searchButton.click(); // Click on the search button
            // Wait for a short delay to ensure the search field is fully populated
            setTimeout(() => {
                const searchField = document.querySelector('.find-box input.bolt-textfield-input');

                if (searchField) {
                    // set the input value using the native setter - see https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');

                    // Dispatch an input event to simulate user input
                    searchField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 1000); // Adjust delay time as needed
        }
    }

    // Add text to the search field when the page is fully loaded
    window.addEventListener('load', addTextToSearchField);



    // Function to expand the search button
    function expandSearchButton() {
        const searchButton = document.querySelector('button[data-is-focusable="true"][aria-label="Search phrases"]');
        if (searchButton) {

          setTimeout(() => {
            searchButton.click(); // Click on the search button to expand it
          }, 1200);
        }
    }

    // Call the function to expand the search button when the page is fully loaded
    window.addEventListener('load', expandSearchButton);





    // Function to handle button click event
    function Terraform_action_start_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));

            //searchField.value = 'Terraform will perform the following actions:'; // Add the desired text
            //searchField.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'})); // Simulate pressing Enter

        }
    }


    // Function to handle button click event
    function Terraform_plan_line_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'Plan:');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));

            //searchField.value = 'Terraform will perform the following actions:'; // Add the desired text
            //searchField.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'})); // Simulate pressing Enter

        }
    }


    // Function to handle button click event
    function Terraform_plan_no_changes_line_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'No changes.');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));

            //searchField.value = 'Terraform will perform the following actions:'; // Add the desired text
            //searchField.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'})); // Simulate pressing Enter

        }
    }


    // Create and append the button with CSS styling
    const button = document.createElement('button');
    button.textContent = 'Jump to Terraform action start';
    button.style.position = 'fixed';
    button.style.top = '80px'; // Adjusted top position
    button.style.left = '900px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'green'; // Background color set to green
    button.addEventListener('click', Terraform_action_start_handleButtonClick);
    document.body.appendChild(button);

    // Create and append the button with CSS styling
    const button2 = document.createElement('button');
    button2.textContent = 'Jump to Plan line';
    button2.style.position = 'fixed';
    button2.style.top = '80px'; // Adjusted top position
    button2.style.left = '1120px';
    button2.style.zIndex = '9999';
    button2.style.backgroundColor = 'orange'; // Background color set to green
    button2.addEventListener('click', Terraform_plan_line_handleButtonClick);
    document.body.appendChild(button2);

    // Create and append the button with CSS styling
    const button3 = document.createElement('button');
    button3.textContent = 'Jump to No Changes';
    button3.style.position = 'fixed';
    button3.style.top = '80px'; // Adjusted top position
    button3.style.left = '1250px';
    button3.style.zIndex = '9999';
    button3.style.backgroundColor = 'orange'; // Background color set to green
    button3.addEventListener('click', Terraform_plan_no_changes_line_handleButtonClick);
    document.body.appendChild(button3);

})();
*/





// v2


(function() {
    'use strict';


    // Function to expand the menu
    function expandMenu() {
        return new Promise((resolve, reject) => {
            // Find the expand button
            // console.log("Rickscript - First Table start...");

            var expandButton = document.querySelector('.bolt-tree-expand-button');

            // Check if the button is found and it is in the collapsed state
            if (expandButton && expandButton.classList.contains('ms-Icon--ChevronRightMed')) {
                // Click on the button to expand the menu
                expandButton.click();
                resolve(); // Resolve the promise once the button is clicked
            } else {
                reject(new Error("Button not found or already expanded")); // Reject if the button is not found or already expanded
            }
        });
    }





      // Function to expand the second table
    function expandSecondTable() {
      return new Promise((resolve, reject) => {
        // Find the second table
        var secondTable = document.querySelectorAll('.bolt-table-container')[1];

        // console.log("Rickscript - Second Table start...");

        //console.log("Rickscript - Second Table:", secondTable);

        // Find the tbody of the second table
        var tbody = secondTable.querySelector('tbody.relative[hidden]');

        //console.log("Rickscript - TBody:", tbody);

        // Check if the tbody is found
        if (tbody) {
            // Remove the 'hidden' attribute to expand the table
            tbody.removeAttribute('hidden');
        }


        //console.log("Rickscript - Deploy Section - 1");

        // Find all span elements inside the second table
        var spans = secondTable.querySelectorAll('span');

        // Iterate over the span elements to find the one containing "Deploy"
        spans.forEach(function(span) {
            if (span.textContent.trim() === "Deploy") {
                var deploySection = span;
                //console.log("Rickscript - Deploy Section - 2:", deploySection);

                // Check if the "Deploy" section is collapsed
                var isCollapsed = deploySection.closest('tr').getAttribute('aria-expanded') === 'false';

                //console.log("Rickscript - IsCollapsed:", isCollapsed);

                // If collapsed, simulate a click event to expand the "Deploy" section
                if (isCollapsed) {
                    deploySection.closest('tr').click();
                    //console.log("Rickscript - Clicked to expand 'Deploy' section.");
                } else {
                    //console.log("Rickscript - The 'Deploy' section is already expanded.");
                }
            }
        });

        if (!deploySection) {
            //console.log("Rickscript - Couldn't find the 'Deploy' section.");
        }
      });
    }





    if (window.location.href.startsWith('https://dev.azure.com/') && window.location.href.includes('view=logs'))
    {

      // Call the expandMenu function when the page is fully loaded
      // window.addEventListener('load', expandMenu);

        window.addEventListener('load', function() {
            expandMenu()
                .then(() => {
                    // Code to execute after expanding the menu
                    // console.log("Rickscript xxxxx --- First menu expanded successfully!");
                    // Put the rest of your code here
                })
                .catch(error => {
                    // Handle errors if the button is not found or already expanded
                    // console.error("Rickscript xxxxx --- Error expanding first menu:", error.message);
                });
        });


      // Call the expandSecondTable function when the page is fully loaded
      window.addEventListener('load', function() {
          expandSecondTable()
              .then(() => {
                  // Code to execute after expanding the menu
                  // console.log("Rickscript xxxxx --- Second expanded successfully!");
                  // Put the rest of your code here
              })
              .catch(error => {
                  // Handle errors if the button is not found or already expanded
                  // console.error("Rickscript xxxxx --- Error expanding second menu:", error.message);
              });
      });





      // Find the Plan button
      var blahButtons = document.querySelectorAll('.bolt-link');

      if (blahButtons.length > 0) {

          // console.log('Rickscript --- expandMenu');

          // Iterate over each button to find the one with the text 'Plan'
              blahButtons.forEach(function(button) {
                if (button.textContent.trim() === 'Apply') {
                    // console.log('Rickscript --- Apply button found!');
                      button.click();
                }
                else if (button.textContent.trim() === 'Plan') {
                    // console.log('Rickscript --- Plan button found!');
                      button.click();
                }
              });
      } else {
          // console.error('Plan/Apply button not found.');
      }

    }






    // Function to add text to the search field
    function addTextToSearchField() {
        const searchButton = document.querySelector('button#__bolt-log-search');
        if (searchButton) {
            searchButton.click(); // Click on the search button
            // Wait for a short delay to ensure the search field is fully populated
            setTimeout(() => {
                const searchField = document.querySelector('.find-box input.bolt-textfield-input');

                if (searchField) {
                    // set the input value using the native setter
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');

                    // Dispatch an input event to simulate user input
                    searchField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 1000); // Adjust delay time as needed
        }
    }

    // Function to append the buttons with CSS styling
    function appendButtons() {
        const button = createButton('Jump to Terraform action start', 'green', Terraform_action_start_handleButtonClick, 'jumpToTerraformActionStart', '900px');
        const button2 = createButton('Jump to Plan line', 'orange', Terraform_plan_line_handleButtonClick, 'jumpToPlanLine', '1113px');
        const button3 = createButton('Jump to No Changes', 'orange', Terraform_plan_no_changes_line_handleButtonClick, 'jumpToNoChanges', '1250px');
        document.body.appendChild(button);
        document.body.appendChild(button2);
        document.body.appendChild(button3);
    }

    // Function to create a button with specified properties
    function createButton(text, color, clickHandler, id, left) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = '80px'; // Adjusted top position
        button.style.left = left;
        button.style.zIndex = '9999';
        button.style.backgroundColor = color;
        button.setAttribute('data-button-id', id);
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Function to remove the appended buttons
    function removeButtons() {
        const buttons = document.querySelectorAll('button[data-button-id="jumpToTerraformActionStart"], button[data-button-id="jumpToPlanLine"], button[data-button-id="jumpToNoChanges"]');
        buttons.forEach(button => button.remove());
    }

    // Function to expand the search button
    function expandSearchButton() {
        const searchButton = document.querySelector('button[data-is-focusable="true"][aria-label="Search phrases"]');
        if (searchButton) {
            setTimeout(() => {
                searchButton.click(); // Click on the search button to expand it
            }, 1200);
        }
    }

    // Function to handle button click event
    function Terraform_action_start_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Function to handle button click event
    function Terraform_plan_line_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'Plan:');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Function to handle button click event
    function Terraform_plan_no_changes_line_handleButtonClick() {
        const searchField = document.querySelector('.find-box input.bolt-textfield-input');
        if (searchField) {
            searchField.focus(); // Focus on the search field
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchField, 'No changes.');

            // Dispatch an input event to simulate user input
            searchField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Call the initial setup when the script runs
    if (window.location.href.startsWith('https://dev.azure.com/') && window.location.href.includes('view=logs')) {
        // console.log("Rickscript - add buttons start!");
        expandMenu();
        expandSecondTable();

        appendButtons();
        addTextToSearchField();
    }





    // Debounce function
    function debounce(func, delay) {
        let timerId;
        return function(...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                func.apply(this, args);
                timerId = null;
            }, delay);
        };
    }



    function executeScriptLogic() {
        // console.log("Rickscript --- Executing script logic...");
        let checkboxes = document.querySelectorAll('.primary-text');

        checkboxes.forEach(function(checkbox) {
            // console.log("Rickscript --- Checking checkbox:", checkbox.textContent);
            if (checkbox.textContent.includes('apply')) {
                // console.log("Rickscript --- Found checkbox with 'apply' in text:", checkbox);
                let checkboxParent = checkbox.closest('.queue-panel-list-row');
                let checkboxElement = checkboxParent.querySelector('.bolt-checkbox');

                if (checkboxElement) {
                    // console.log("Rickscript --- Checkbox element found:", checkboxElement);
                    if (checkboxElement.getAttribute('aria-checked') === 'true') {
                        // console.log("Rickscript --- Checkbox is checked, unticking...");
                        checkboxElement.click();
                    } else {
                        // console.log("Rickscript --- Checkbox is already unchecked.");
                    }
                } else {
                    // console.log("Rickscript --- Checkbox element not found!");
                }
            }
        });
    }



    // Function to wait for the panel "Stages to run" to be opened
    function waitForPanelToOpen() {
        const panelObserver = new MutationObserver(function(mutationsList, observer) {
            mutationsList.forEach(function(mutation) {
                // Check if the panel with the name "Stages to run" is added to the DOM
                if (mutation.addedNodes.length > 0) {
                    const panels = document.querySelectorAll('.bolt-header-title.title-m');
                    panels.forEach(function(panel) {
                        if (panel.textContent === 'Stages to run')
                        {
                            // Panel is found, now execute the necessary script logic
                            // console.log("Rickscript --- blah panel found");

                            setTimeout(function() {
                                executeScriptLogic();
                            }, 500);


                            // const currentUrl = window.location.href;
                            // observer.previousUrl = currentUrl;
                            // Disconnect the observer as it's no longer needed
                            observer.disconnect();

                        }else{

                            setTimeout(function() {
                                executeScriptLogic();
                            }, 1000);

                        }
                    });
                }
            });
        });

        // Start observing the document for changes in the DOM
        panelObserver.observe(document.documentElement, { childList: true, subtree: true });

        // Set a timeout to ensure the observer is disconnected if the panel is not found
        // setTimeout(function() {
        //     panelObserver.disconnect();
        //     // console.log("Rickscript --- Fuckkkkk");
        // }, 8000); // Adjust timeout as needed (in milliseconds)
    }








    if (window.location.href.includes('_build?definitionId') || window.location.href.includes('view=results'))
    {
        // console.log("Rickscript - ffucksjfkjskfs")
        waitForPanelToOpen();
    }






    // Function to handle URL changes
    function handleUrlChange(mutationsList, observer) {
        for (let mutation of mutationsList) {

            if (mutation.type === 'childList' || mutation.type === 'attributes') {

                const currentUrl = window.location.href;

                // console.log("Rickscript --- currentUrl --- ", currentUrl);
                // console.log("Rickscript --- observer.previousUrl --- ", observer.previousUrl);

                if (currentUrl !== observer.previousUrl)
                {

                    // console.log("Rickscript --- currentUrl --- ", currentUrl);
                    // console.log("Rickscript --- observer.previousUrl --- ", observer.previousUrl);

                    // observer.previousUrl = currentUrl;

                    if (!observer.previousUrl.includes('view=logs') && currentUrl.includes('view=logs')) {

                        // Transition from a URL without 'view=logs' to a URL with 'view=logs'
                        observer.previousUrl = currentUrl;

                        // console.log("Rickscript --- ******************* inside view=logs ******************* --- currentUrl --- ", currentUrl);

                        // Execute necessary functions
                        expandMenu();
                        expandSecondTable();
                        appendButtons();
                        addTextToSearchField();

                        // Find the Plan button
                        var blahButtons = document.querySelectorAll('.bolt-link');

                        if (blahButtons.length > 0) {
                            // Iterate over each button to find the one with the text 'Plan' or 'Apply'
                            blahButtons.forEach(function(button) {
                                if (button.textContent.trim() === 'Apply' || button.textContent.trim() === 'Plan') {
                                    button.click();
                                }
                            });
                        }


                        // console.log("Rickscript - URL change - GOOOOOOOOOOOOOOOOOOOOOOOOOD!");

                    } else if (observer.previousUrl.includes('view=logs') && !currentUrl.includes('view=logs')) {
                        // Transition from a URL with 'view=logs' to a URL without 'view=logs'
                        observer.previousUrl = currentUrl;

                        // If the URL doesn't match, remove buttons
                        removeButtons();


                    } else if (!observer.previousUrl.includes('_build?definitionId') && currentUrl.includes('_build?definitionId')) {
                    //} else if (currentUrl.includes('_build?definitionId')) {

                        // console.log("Rickscript - _build?definitionId");

                        //console.log("Rickscript --- currentUrl --- ", currentUrl);
                        //console.log("Rickscript --- observer.previousUrl --- ", observer.previousUrl);

                        observer.previousUrl = currentUrl;
                        waitForPanelToOpen();
                        // console.log("Rickscript --- _build?definitionId END !!!");


                    } else if (!observer.previousUrl.includes('view=results') && currentUrl.includes('view=results')) {
                    // } else if (currentUrl.includes('view=results')) {

                        // console.log("Rickscript - view=results");

                        //console.log("Rickscript --- currentUrl --- ", currentUrl);
                        //console.log("Rickscript --- observer.previousUrl --- ", observer.previousUrl);

                        observer.previousUrl = currentUrl;
                        waitForPanelToOpen();
                        // console.log("Rickscript --- view=results END !!!");

                    }

                }
                break;
            }
        }
    }







    // Debounce the handleUrlChange function with a delay of 100ms
//     const debouncedHandleUrlChange = debounce(handleUrlChange, 100);

//     // Create a MutationObserver
//     const observer = new MutationObserver((mutationsList) => {
//         debouncedHandleUrlChange(mutationsList, observer);
//     });


    // Start observing the DOM for URL changes
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
    observer.previousUrl = window.location.href;

})();

