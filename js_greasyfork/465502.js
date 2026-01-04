// ==UserScript==
// @name         Figma: Increase Layers Panel Width Tool
// @namespace    me.kalus.figmamorespace
// @version      1.2.1
// @description  This script has been reworked to include a button inside the toolbar to toggle the width of the left layers panel to 1500px.
// @author       Michael Kalus
// @match        https://www.figma.com/design/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465502/Figma%3A%20Increase%20Layers%20Panel%20Width%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/465502/Figma%3A%20Increase%20Layers%20Panel%20Width%20Tool.meta.js
// ==/UserScript==



(function() {


    function main() {

        // set left toolbar
        const toolbar = document.querySelector('[class*="toolbar_view--buttonGroup--"][class*="toolbar_view--leftButtonGroup--"]');

        if (toolbar) {
            // create new button, set inner HTML and append
            const newButton = document.createElement('div');
            newButton.innerHTML = '<span role="button" aria-label="Increase Left Panel Size" class="svg-container toolbar_view--iconButton--1MUm6 toolbar_styles--enabledButton--fEwmC" data-tooltip-type="lookup" data-tooltip="set-tool-increasewidth" tabindex="0" aria-pressed="false" data-fullscreen-intercept="true"><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#fff" fill-opacity="1" fill-rule="evenodd" stroke="none" d="M18.6.2H1.1c-.3,0-.5.2-.5.5v18.6c0,.3.2.5.5.5h17.5c.3,0,.5-.2.5-.5V.7c0-.3-.2-.5-.5-.5ZM1.6,1.2h11.1v17.6H1.6V1.2ZM18.1,18.7h-4.4V1.2h4.4v17.6Z"></path></svg></span>';
            toolbar.appendChild(newButton);

            // set new resizeButton
            const resizeButton = newButton.querySelector('.toolbar_view--iconButton--1MUm6');
            let isButtonClicked = false;

            // Add click event listener to the span button
            resizeButton.addEventListener('click', function() {
                // Toggle background color, run width adjustments and start mutations observer
                if (!isButtonClicked) {
                    resizeButton.style.backgroundColor = 'var(--color-bg-toolbar-selected, var(--bg-toolbar-active))';
                    setWidths();
                    observeMutations();
                } else {
                    // reset background color, reset width adjustment and destroy mutations observer
                    resizeButton.style.backgroundColor = '';
                    revertWidths();
                    disconnectObserver();
                }

                isButtonClicked = !isButtonClicked;
            });
        } else {
            console.error('Target div not found');
        }

        let observer;

        // width adjustments
        function setWidths() {
            document.getElementById('left-panel-container').style.maxWidth = '1500px';

            const elements = document.querySelectorAll('[class*=left_panel_container--panel--]');
            elements.forEach((el) => {
                el.style.width = '1500px';
            });

            const leftPanelContent = document.querySelectorAll('[class^="left_panel--content"]');
            leftPanelContent.forEach(content => {
                content.style.width = '1500px';
            });

            const objectRows = document.querySelectorAll('[class^="object_row--row--"]');
            objectRows.forEach(row => {
                row.style.width = '1500px';
            });

            const objectRowsInstanceChilds = document.querySelectorAll('[class^="object_row--instanceChild"]');
            objectRowsInstanceChilds.forEach(row => {
                row.style.width = '1500px';
            });


            const topLevelRows = document.querySelectorAll('[class^="object_row--topLevel--"]');
            topLevelRows.forEach(row => {
                row.style.width = '1500px';
            });

            const scrollContainers = document.querySelectorAll('[class^="objects_panel--scrollContainer"], [class^="pages_panel--scrollContainer"]');
            scrollContainers.forEach(container => {
                container.style.width = '1500px';
            });
        }

        function observeMutations() {
            // Observe changes in the DOM subtree of the left sidebar and run width adjustments
            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        setWidths();
                    }
                });
            });

            const config = { attributes: false, childList: true, subtree: true };

            const motionContainers = document.querySelectorAll('#react-page');
            motionContainers.forEach(container => {
                observer.observe(container, config);
            });
        }

        // function to revert width adjustment
        function revertWidths() {
            document.getElementById('left-panel-container').style.maxWidth = '500px';

            const elements = document.querySelectorAll('[class*=left_panel_container--panel--]');
            elements.forEach((el) => {
                el.style.width = '500px';
            });

            const leftPanelContent = document.querySelectorAll('[class^="left_panel--content"]');
            leftPanelContent.forEach(content => {
                content.style.width = '500px';
            });


            const objectRowsInstanceChilds = document.querySelectorAll('[class^="object_row--instanceChild"]');
            objectRowsInstanceChilds.forEach(row => {
                row.style.width = '500px';
            });

            const objectRows = document.querySelectorAll('[class^="object_row--row--"]');
            objectRows.forEach(row => {
                row.style.width = '500px';
            });

            const topLevelRows = document.querySelectorAll('[class^="object_row--topLevel--"]');
            topLevelRows.forEach(row => {
                row.style.width = '500px';
            });

            const scrollContainers = document.querySelectorAll('[class^="objects_panel--scrollContainer"], [class^="pages_panel--scrollContainer"]');
            scrollContainers.forEach(container => {
                container.style.width = '500px';
            });
        }

        function disconnectObserver() {
            if (observer) {
                observer.disconnect();
            }
        }

    };


    // mutation observer to wait if fimga is loaded
    function mutationCallback(mutationsList, observerMain) {
        for(var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.id === 'fullscreen-root') {
                        main();
                        console.log("main executed");
                    }
                });
            }
        }
    }

    const observerOptions = { childList: true, subtree: true };
    const observerMain = new MutationObserver(mutationCallback);

    observerMain.observe(document.documentElement, observerOptions);


})();

