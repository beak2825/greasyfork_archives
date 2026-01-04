// ==UserScript==
// @name        Skip Content Warning - tumblr.com
// @namespace   http://www.tumblr.com/gmscripts
// @match       https://www.tumblr.com/safe-mode
// @match       https://www.tumblr.com/blog/view/*
// @run-at      document-start
// @grant       none
// @version     3.0
// @license     MIT
// @author      Mark Grappo
// @description I made this because when browsing tumblr I didn't want to click a bunch of buttons
//              just to get to the content if the blog was marked as nsfw. So when you open in a new
//              tab it skips all the button clicking for you
// @downloadURL https://update.greasyfork.org/scripts/447860/Skip%20Content%20Warning%20-%20tumblrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/447860/Skip%20Content%20Warning%20-%20tumblrcom.meta.js
// ==/UserScript==

(() => {
    if (location && location.pathname && location.pathname.includes("/safe-mode")) {
        const linkToDashBoard = document.querySelector(".link");
        if (linkToDashBoard.innerText === "Go to my dashboard") {
            linkToDashBoard.target = "_self";
            linkToDashBoard.click();
        }
    }
    else if (location && location.pathname && location.pathname.includes("/blog/view/")) {
        const url = new URL(window.location.href);
        const source = url.searchParams.get("source");
        if (source === "content_warning_wall") {
            const checkForDashboardText = (currentElement) => {
                if (currentElement.innerText.toUpperCase().includes("DASHBOARD")) {
                    return true;
                }
                else if (currentElement.tagName === "A") {
                    if (currentElement.href && !currentElement.href.toUpperCase().includes("DASHBOARD")) {
                        return true;
                    }
                }
            };
            const listAllEventListeners = () => {
                // Inspired by https://www.sqlpac.com/en/documents/javascript-listing-active-event-listeners.html
                const base_container_context = document.querySelector("#base-container").querySelector("header").parentElement.nextSibling.querySelectorAll("*");
                const allElements = [...base_container_context];
                const elements = [];
                for (const currentElement of allElements) {
                    if (typeof currentElement["onclick"] === "function") {
                        if (!checkForDashboardText(currentElement)) {
                            elements.push(currentElement);
                        }
                    }
                }
                return elements;
            };
            const lastCheck = (element) => {
                if (element.innerText.toUpperCase() === "VIEW BLOG") {
                    element.click();
                }
            };
            window.addEventListener("load", () => {
                console.log("Skip Content Warning: Start The Search!");
                const possibleElements = listAllEventListeners();
                if (possibleElements && possibleElements.length) {
                    if (possibleElements.length === 1) {
                        lastCheck(possibleElements[0]);
                    }
                    else {
                        const filteredPossibleElements = possibleElements.filter((currentElement) => {
                            return currentElement.tagName === "BUTTON";
                        });
                        if (filteredPossibleElements && filteredPossibleElements.length) {
                            lastCheck(filteredPossibleElements[0]);
                        }
                    }
                }
            });
        }
    }
    else {
        console.log("FUG! @_@");
    }
})();
