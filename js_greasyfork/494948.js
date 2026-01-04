// ==UserScript==
// @name         Enlarge Terraform Preview
// @namespace    http://tampermonkey.net/
// @version      2024-05-14
// @description  Enlarge Terraform Preview on Gitlab
// @author       Thomas Michelot
// @match        https://gitlab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494948/Enlarge%20Terraform%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/494948/Enlarge%20Terraform%20Preview.meta.js
// ==/UserScript==

var howMuch = 500;

var selectorToggleButton = "#widget-state > div:nth-child(3) > section > section > div > div.media-body.gl-display-flex.gl-flex-direction-row\\!.gl-align-self-center > div.gl-border-l-1.gl-border-l-solid.gl-border-gray-100.gl-ml-3.gl-pl-3.gl-h-6 > button"

function enlargeTerraformPreview() {
    document.querySelector("#widget-state > div:nth-child(3) > section > section > div.gl-relative.gl-bg-gray-10 > div > div > div").style.maxHeight = howMuch + "px";
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';

    waitForElm(selectorToggleButton).then((toggleButton) => {
        toggleButton.addEventListener("click", () => {
            setTimeout(enlargeTerraformPreview, 1);
        })
    });
})();