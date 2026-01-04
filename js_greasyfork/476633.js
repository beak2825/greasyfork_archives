// ==UserScript==
// @name         Apple Music Playlist Sorting
// @namespace    https://music.apple.com/*
// @version      1.0.0
// @description  sort songs in the playlist by recently added
// @author       kavoye
// @match        *://music.apple.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @unwrap
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476633/Apple%20Music%20Playlist%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/476633/Apple%20Music%20Playlist%20Sorting.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function () {
    'use strict';

    function pageBlur(applied = true) {
        const scrollablePage = document.querySelector('#scrollable-page');

        if (scrollablePage && applied) {
            scrollablePage.style.filter = 'blur(100px)';
        } else {
            scrollablePage.style.filter = 'none';
        }
    }

    function scrollPageToTop() {
        const scrollablePalge = document.querySelector('#scrollable-page');

        setTimeout(() => {
            scrollablePalge.scrollTop = 0;
        }, 0);
    }

    function reverseAndSortChildElements() {
        const parentDiv = document.querySelector('#scrollable-page > main > div > div:nth-child(2) > div > div');

        if (!parentDiv) {
            console.error('Parent div not found.');
            return;
        }

        // Hide the parent div to prevent layout shifts
        parentDiv.style.display = 'none';

        // Get the child elements within the parent div
        const childElements = Array.from(parentDiv.children);
        childElements.reverse();

        // Reverse the child elements and move the first element to the end
        childElements.unshift(childElements[childElements.length - 1]);
        childElements.pop();

        // Clear the parent div
        parentDiv.innerHTML = '';

        // Re-append the sorted child elements to the parent div
        for (const child of childElements) {
            parentDiv.appendChild(child);
        }

        // Show the parent div again
        parentDiv.style.display = 'block';
    }

    function sortButtonFunctionality() {
        const styleButton = document.querySelector("#scrollable-page > main > div > div:nth-child(1) > div > div > div > div > div > button")
        const contextMenuButton = document.querySelector("#scrollable-page > main > div > div:nth-child(1) > div > div > div.secondary-actions.svelte-d0m3dm > div")

        if (!contextMenuButton) {
            console.error('Original button not found.');
            return;
        }

        // Create a new button with extended functionality
        const newButton = document.createElement('button');
        newButton.textContent = 'Sort';

        // Copy styles from the styleButton to the newButton
        const computedStyle = window.getComputedStyle(styleButton);
        for (const property of computedStyle) {
            newButton.style[property] = computedStyle[property];
        }

        // Add event listener to the newButton
        newButton.addEventListener('click', loadAllSongs);

        // Insert the new button after the context menu button
        contextMenuButton.parentNode.insertBefore(newButton, contextMenuButton.previousSibling);
    }

    function scrollToElement() {
        const element = document.querySelector("#scrollable-page > main > div > div:nth-child(4)");

        if (element) {
            // Scroll down quickly in a loop until the element becomes visible
            const scrollInterval = setInterval(() => {
                element.scrollIntoView({ behavior: 'auto' });
                if (!document.body.contains(element)) {
                    clearInterval(scrollInterval);
                    scrollPageToTop();
                    removeTextOverlay()
                    pageBlur(false);
                    waitForFooterElement();
                }

            }, 0);
        }

    }

    function addTextOverlay() {
        const textOverlay = document.createElement('div');
        textOverlay.id = 'text-overlay';
        textOverlay.style.position = 'fixed';
        textOverlay.style.top = '0';
        textOverlay.style.left = '0';
        textOverlay.style.width = '115%';
        textOverlay.style.height = '100%';
        textOverlay.style.display = 'flex';
        textOverlay.style.justifyContent = 'center';
        textOverlay.style.alignItems = 'center';
        textOverlay.style.zIndex = '2';
        document.body.appendChild(textOverlay);

        const textElement = document.createElement('p');
        textElement.textContent = 'Loading all songs in the playlist...';
        textElement.style.color = 'white';
        textElement.style.filter = '0.1'
        textElement.style.fontSize = '26px';
        textElement.style.fontWeight = 'bold';
        textOverlay.appendChild(textElement);

    }

    function removeTextOverlay() {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.remove();
        }
    }

    function waitForFooterElement() {
        const footerTextElemet = document.querySelector('#scrollable-page > main > div > div:nth-child(3) > div > div > div.footer-body.svelte-eed3da > p');

        var checkExist = setInterval(function () {
            if ($(footerTextElemet).length) {
                clearInterval(checkExist);
                reverseAndSortChildElements();
            }
        }, 0);
    }

    function loadAllSongs() {
        const loadingIcon = document.querySelector('#scrollable-page > main > div > div:nth-child(3) > div > div > div:nth-child(1) > p');

        if (!document.body.contains(loadingIcon)) {
            pageBlur();
            addTextOverlay();
            scrollToElement();
        } else {
            reverseAndSortChildElements();
        }
    }

    function actionFunction(jNode) {
        sortButtonFunctionality();
        console.log("Sort button loaded.")
    }

    waitForKeyElements("#scrollable-page > main > div > div:nth-child(2) > div > div > div.songs-list__header.svelte-1qne0gs.songs-list__header--is-visible", actionFunction);

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

})();