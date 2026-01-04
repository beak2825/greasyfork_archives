// ==UserScript==
// @name         Discord Themelyn V2 - Basically Free Theme(s)
// @version      1.0
// @description  Basically Free Theme(s). Join my server for updates: https://discord.gg/kS7P7gRZcg
// @author       ∫(Ace)³dx
// @match        https://discord.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/491601/Discord%20Themelyn%20V2%20-%20Basically%20Free%20Theme%28s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491601/Discord%20Themelyn%20V2%20-%20Basically%20Free%20Theme%28s%29.meta.js
// ==/UserScript==

//To change the themes, you need to change the xpath of the element from the preview tab to the respective button of the theme.

function clickElementByXPath(xpath) {
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
        element.click();
    } else {
        console.error("Element with XPath '" + xpath + "' not found.");
    }
}

function waitForElementByXPath(xpath, callback) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                observer.disconnect();
                callback();
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

function runScript() {
    // Click on first element
    clickElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[1]/section/div[2]/div[2]/button[3]/div/div");

    // Wait for the second element
    waitForElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div[2]/div/div[1]/div/nav/div/div[20]", function() {
        // Click on the second element
        clickElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div[2]/div/div[1]/div/nav/div/div[20]");

        // Wait for the third element
        waitForElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div[2]/div/div[2]/div/div/div[1]/div/div[2]/div[2]/div[1]/div[1]/div/div/section/div[1]/div[2]/button[1]", function() {
            // Click on the third element
            clickElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div[2]/div/div[2]/div/div/div[1]/div/div[2]/div[2]/div[1]/div[1]/div/div/section/div[1]/div[2]/button[1]");

            // Wait for the fourth element
            waitForElementByXPath("/html/body/div[1]/div[2]/div[3]/div[2]/div[1]/section/div[2]/div[10]", function() {
                // Find the button and the element to hide using XPath
                const buttonXPath = "/html/body/div[1]/div[2]/div[3]/div[2]/div[1]/section/div[2]/div[10]/div";
                const elementXPath = "/html/body/div[*]/div[2]/div[3]";
                const button = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const element = document.evaluate(elementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (button && element) {
                    // Hide the button and the element
                    button.style.display = 'none';
                    element.style.display = 'none';

                    // Click the button every 10 milliseconds
                    const intervalId = setInterval(() => {
                        button.click();
                    }, 1);
                } else {
                    console.error('Button or element not found with the provided XPath.');
                }
            });
        });
    });
}

// Wait for the first element to exist before running the script
waitForElementByXPath("/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[1]/section/div[2]/div[2]/button[3]/div/div", runScript);
