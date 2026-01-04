// ==UserScript==
// @name         QTC Helper
// @namespace
// @version      0.3
// @description  Hide/show already completed answers
// @author       You
// @match        https://apps.chiktabba.dev/qtc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/476566/QTC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/476566/QTC%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial state.
    let shouldHide = true;
    const buttonHideText = "Cacher les images déjà trouvées";
    const buttonShowText = "Montrer les images déjà trouvées";

    const toggleCompleted = () => {
        document.querySelectorAll("div > input[type='hidden']").forEach(i => {
            const hasResult = !!i.value;
            if (hasResult) {
                // Update the display style of all inputs with a result.
                i.parentNode.style.display = shouldHide ? "none" : "initial";
            }
        });
        // Flip the state.
        shouldHide = !shouldHide;
        toggleButton.innerHTML = shouldHide ? buttonHideText: buttonShowText;
    }

    // Create toggle button.
    const toggleButton = document.createElement("button");
    toggleButton.classList.add("btn", "btn-outline", "btn-primary");
    toggleButton.style.marginBlockEnd = "10px";
    toggleButton.addEventListener("click", toggleCompleted);
    toggleButton.innerHTML = buttonHideText;

    // Add button before the form
    const quizzForm = document.querySelector("form");
    quizzForm.parentNode.insertBefore(toggleButton, quizzForm);

    document.querySelectorAll(".saturate-0").forEach(node => {
      node.classList.remove("saturate-0");
    });
})();