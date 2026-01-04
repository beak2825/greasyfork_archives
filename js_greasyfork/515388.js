// ==UserScript==
// @name         Last Action on Top
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Shows user's last action time and health on top.
// @author       Hesper [2924630]
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/515388/Last%20Action%20on%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/515388/Last%20Action%20on%20Top.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const title = "[Last Action on Top]: ";
    const debug = false;

    // Function to move the content
    function moveContent() {
        if (debug) console.log(title + "Moving content");

        let lastAction = document.querySelector("#profileroot > div > div > div > div:nth-child(3) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(12) > div.user-info-value > span");
        if (!lastAction) {
            // with torntools
            lastAction = document.querySelector("#profileroot > div > div > div > div:nth-child(5) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(12) > div.user-info-value > span");
        }
        if (!lastAction) return; // Exit if the source element is not found
        const lastActionContent = lastAction.innerHTML;
        if (debug) console.log(title + "Last Action: " + lastActionContent);

        let life = document.querySelector("#profileroot > div > div > div > div:nth-child(3) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(5) > div.user-info-value > span");
        if (!life) {
            // with torntools
            life = document.querySelector("#profileroot > div > div > div > div:nth-child(5) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(5) > div.user-info-value > span");
        }
        if (!life) return; // Exit if the life element is not found
        const lifeContent = life.innerHTML;
        if (debug) console.log(title + "Life: " + lifeContent);


        
        let newDiv = document.querySelector("#last-action-life-div");
        if (!newDiv) {
            newDiv = document.createElement("div");
            newDiv.id = "last-action-life-div";
            newDiv.classList.add("moved-content");

            const targetElement = document.querySelector("#skip-to-content");
            if (!targetElement) return;

            targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);

            const style = document.createElement('style');
            style.innerHTML = `
                .moved-content {
                    float: left;
                    margin-left: 10px; 
                    font-size: 0.8em;
                }
            `;
            document.head.appendChild(style);
        }

        newDiv.innerHTML = 'Last Action: ' + lastActionContent + '<br>Life: ' + lifeContent;

        if (lastActionContent.includes('Now')) {
            newDiv.style.color = 'green';
        } else if (lastActionContent.includes('minutes')) {
            const minutes = parseInt(lastActionContent.split(' ')[0]);
            if (minutes > 2 && minutes <= 5) {
                newDiv.style.color = 'orange';
            } else if (minutes <= 2) {
                newDiv.style.color = 'green';
            } else {
                newDiv.style.color = ''; // Default color
            }
        } else {
            newDiv.style.color = ''; // Default color
        }

    }


    function startObservingLastAction() {
        if (debug) console.log(title + "Starting observer");
        let lastAction = document.querySelector("#profileroot > div > div > div > div:nth-child(3) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(12) > div.user-info-value > span");
        if (!lastAction) {
            // with torntools
            lastAction = document.querySelector("#profileroot > div > div > div > div:nth-child(5) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(12) > div.user-info-value > span");
        }

        let life = document.querySelector("#profileroot > div > div > div > div:nth-child(3) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(5) > div.user-info-value > span");
        if (!life) {
            // with torntools
            life = document.querySelector("#profileroot > div > div > div > div:nth-child(5) > div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(5) > div.user-info-value > span");
        }

        if (lastAction || life) {
            if (debug) console.log(title + "Observing last action");
            let observer = new MutationObserver(function(mutations) {
                try {
                    moveContent();
                    observer.disconnect()

                } catch (e) {
                    observer.disconnect()
                    if (debug) console.log(title + "Error in observer: " + e);
                }

            });
            observer.observe(lastAction, { characterData: true, childList: true, subtree: true });
            observer.observe(life, { characterData: true, childList: true, subtree: true });
            // Trigger moveContent on init
            moveContent();
        } else {
            window.setTimeout(() => startObservingLastAction(), 500);

        }
    }
    startObservingLastAction();

})();