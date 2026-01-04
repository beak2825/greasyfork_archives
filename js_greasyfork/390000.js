// ==UserScript==
// @name         Pixiv QuickSelect
// @version      0.2
// @description  Allow selecting multiple items by holding shift
// @author       8uurg
// @match        https://www.pixiv.net/*/users/*/bookmarks/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/368765
// @downloadURL https://update.greasyfork.org/scripts/390000/Pixiv%20QuickSelect.user.js
// @updateURL https://update.greasyfork.org/scripts/390000/Pixiv%20QuickSelect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insert css
    GM_addStyle(`
        label {
            user-select: none;
        }
        .betweenSelected {
            mask-image: none !important;
            box-shadow: 0px 0px 5px 2px lightblue;
        }
        section div:nth-child(3) {
            box-shadow: 15px 0px 0px 0px white, -15px 0px 0px 0px white;
        }
    `)

    // Due to this webpage being dynamic now, we may have to inject code later...
    function setupHandlers()
    {
    // Find the checkboxes and add logic.
    let bookmarksOrigin = document.querySelectorAll('input[type=checkbox]');
    if ( bookmarksOrigin.length == 0 ) {
        // If there are none, don't setup for now: wait a bit!
        return false;
    }
    let lastIndex = 0;
    let lastHovered = -1;
    let currentState = false;

    function getLabelGrandparent(checkbox)
    {
        return checkbox.parentElement.parentElement.parentElement;
    }

    function activateHoverEffect(from, to) {
        if(currentState) { return; }
        const tfrom = Math.min(from, to)
        const tto = Math.max(from, to)

        // console.log(`Activating from ${lastIndex} to ${lastHovered}`)
        for (let i=tfrom; i <= tto; i++) {
            getLabelGrandparent(bookmarksOrigin[i]).parentElement.classList.add('betweenSelected')
        }
        currentState = true;
    }
    function deactivateHoverEffect(from, to) {
        if(!currentState) { return; }
        const tfrom = Math.min(from, to)
        const tto = Math.max(from, to)

        // console.log(`Deactivating from ${lastIndex} to ${lastHovered}`)
        for (let i=tfrom; i <= tto; i++) {
            getLabelGrandparent(bookmarksOrigin[i]).parentElement.classList.remove('betweenSelected')
        }
        currentState = false;
    }
    function keyDownHandler(e) {
        if(lastHovered === -1) { return; }

        if(e.keyCode === 16) {
            activateHoverEffect(lastIndex, lastHovered)
        }
    }
    function keyUpHandler(e) {
        if(lastHovered === -1) { return; }

        if(e.keyCode === 16) {
            deactivateHoverEffect(lastIndex, lastHovered)
        }
    }
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    for(let i=0; i < bookmarksOrigin.length; i++) {

        const checkbox = bookmarksOrigin[i];
        const bookmark = getLabelGrandparent(checkbox);

        const listedIndex = i;

        // We access the variables accessed outside the loop are done on purpose.
        // The actual element where this warning would be correct (i) is fixed in place using
        // a const binding within this scope!
        /* eslint-disable no-loop-func */
        function clickHandler(e) {
            // Avoid duplicating a click. This works because
            // the checkbox itself is hidden and will never be clicked directly!
            if (e.target instanceof HTMLInputElement) {
                // e.stopPropagation();
                return;
            }
            if(currentState && lastHovered !== -1) {
                deactivateHoverEffect(lastIndex, lastHovered);
            }
            // The checkbox itself gets checked afterwards, after this clickHandler has been performed.
            // Hence inverting the state is required.
            const newState = !checkbox.checked;
            const i = listedIndex;
            console.log(`Clicked ${e.target}, set to ${newState} and is index ${i}, is shift being held?: ${e.shiftKey}`);
            if(e.shiftKey) {
                const tfrom = Math.min(i, lastIndex)
                const tto = Math.max(i, lastIndex)
                // handling = tto - tfrom + 1;
                // console.log(`Setting from ${tfrom} to ${tto} to ${newState}`)
                for(let j=tfrom; j<=tto; j++) {
                    // The original approach with simply setting the checkbox state doesn't work anymore...
                    //  bookmarksOrigin[j].checked = newState
                    // Instead click the label when required... That should work.
                    if ( bookmarksOrigin[j].checked != newState ) {
                        const otherCheckbox = bookmarksOrigin[j];
                        const otherLabel = otherCheckbox.parentElement.parentElement.parentElement;
                        // Use a timeout...
                        setTimeout(function() {
                            otherCheckbox.click();
                        }, 0);
                    }
                }
            }
            lastIndex = i;
            if(currentState) {
                activateHoverEffect(lastIndex, lastHovered)
            }
        }
        function mouseEnterHandler(e) {
            const i = listedIndex;
            lastHovered = i;
            if (e.shiftKey) {
                activateHoverEffect(lastIndex, lastHovered)
            }
        }
        function mouseLeaveHandler(e) {
            deactivateHoverEffect(lastIndex, lastHovered)
            lastHovered = -1;
        }
        /* eslint-enable no-loop-func */

        bookmark.addEventListener('click', clickHandler);

        // For fancy hover when holding shift effect.
        // Disable for now.
        bookmark.addEventListener('mouseenter', mouseEnterHandler);
        bookmark.addEventListener('mouseleave', mouseLeaveHandler);
    }

    // Everything has been successfully set up!
    return true;
    // End of setupHandlers.
    }


    let intervalID = -1;

    function initialize()
    {
        // Try running it first (maybe the webpage is already in edit mode)
        const plainAttempt = setupHandlers();
        if (plainAttempt) {
            console.log("Successfully initialized eagerly.")
            return true;
        }

        // Pixiv has been updated and the webpage is now dynamic: we need to wait until checkboxes are available.
        // In order to do so, we place a click listener on the edit button.
        // We here use the oddity that the edit button is not actually a button element to locate its image.
        // And then go up until we find the actual button itself.
        const editButtonSVGElement = document.querySelector("section div>svg");
        if ( editButtonSVGElement === null ) return false;
        const editButtonElement = editButtonSVGElement.parentElement.parentElement.parentElement;
        editButtonElement.addEventListener('click', function(e) {
            window.setTimeout(function() {
                const success = setupHandlers();
                if (success) console.log("Successfully completely initialized!")
            }, 500);
        });
        console.log("Successfully initialized on edit button.")
        return true;
    }

    function intervalInit()
    {
        const success = initialize();
        if ( success )
        {
            window.clearInterval(intervalID);
        }
    }

    intervalID = window.setInterval(intervalInit, 1000);
})();