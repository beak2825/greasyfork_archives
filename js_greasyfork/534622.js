// ==UserScript==
// @name         Health Bar Percentage Display
// @namespace    https://narrow.one/
// @version      20241207
// @description  Display a text percentage of current HP bar state (next to the HP bar).
// @author       Xeltalliv
// @run-at       document-start
// @match        https://narrow.one/
// @icon         https://www.svgrepo.com/show/404891/broken-heart.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534622/Health%20Bar%20Percentage%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/534622/Health%20Bar%20Percentage%20Display.meta.js
// ==/UserScript==

const healthBarObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // Get the current width from the style
            const currentWidth = observedHealthBarPart.style.width;

            console.log('Width changed to:', currentWidth);
            heathTextDisplayElement.textContent = currentWidth;
        }
    }
});
let observedHealthBarPart = null;
let heathTextDisplayElement = document.createElement("div");

const isHealthBar = (elem) => elem.classList.contains("health-ui-container");
const gameWrapperObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes[0] && isHealthBar(mutation.addedNodes[0])) {
                addHealthBar(mutation.addedNodes[0]);
            }
            if (mutation.removedNodes[0] && isHealthBar(mutation.removedNodes[0])) {
                removeHealthBar(mutation.removedNodes[0])
            }
            //console.log('Added', mutation.addedNodes, "Removed", mutation.removedNodes);
        }
    }
});
gameWrapperObserver.observe(document.getElementById("gameWrapper"), {
    childList: true
});

function addHealthBar(element) {
    console.log("Added health bar", element);
    element.append(heathTextDisplayElement);

    observedHealthBarPart = document.getElementsByClassName("health-ui-bar clip")[0];
    healthBarObserver.observe(observedHealthBarPart, {
        attributes: true,
        attributeFilter: ['style']
    });
}
function removeHealthBar(element) {
    console.log("Removed health bar", element);
    heathTextDisplayElement.remove();
    healthBarObserver.disconnect();
}