// ==UserScript==
// @name         twitter text comments only
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Twitter script to curate and display only text comments that are relevant and meaningful, filtering out unrelated memes and nonsensical content.
// @author       You
// @match https://twitter.com/*/status/*

// @downloadURL https://update.greasyfork.org/scripts/490477/twitter%20text%20comments%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/490477/twitter%20text%20comments%20only.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function injectCss() {
        // Create a <style> element
        var styleElement = document.createElement('style');
        styleElement.id = "text-comments-only";
        // Define your CSS rules
        var cssCode = `
            [data-testid="cellInnerDiv"]:nth-child(1) {
            display: unset !important;
            }
        `;
        // Add your CSS rules to the <style> element
        styleElement.textContent = cssCode;
        document.head.appendChild(styleElement);
    }


    // Select the node that will be observed for mutations
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Create an observer instance linked to the callback
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Callback function to execute when mutations are observed
    function callback(mutationList) {
        for (const mutation of mutationList) {
            const isNewNodeAdded = mutation.addedNodes && mutation.addedNodes?.length > 0;
            const isStyleInjected = document.getElementById("text-comments-only");

            if (isNewNodeAdded && /^https?:\/\/(www\.)?twitter\.com\/.*\/status\/\d{19}$/.test(location.href)) {
                const node = mutation.addedNodes[0];
                if (node.classList?.length > 0) {
                    const tweetPosts = document.querySelectorAll(`.${node.classList[0]} [data-testid="cellInnerDiv"]:not([textonly])`)
                    if (tweetPosts.length > 0) {
                        tweetPosts.forEach(el => {
                            const isValidVideo = el.querySelectorAll('[aria-label="Embedded video"]').length > 0;
                            const isValidImg = el.querySelectorAll('[alt="Image"]').length > 0;
                            const isValidGif = el.querySelectorAll('[aria-label="Play this GIF"]').length > 0;

                            if (isValidVideo) {
                                el.style.display = "none";
                                el.setAttribute("textonly", "true");
                                return;
                            }
                            if (isValidImg) {
                                el.style.display = "none";
                                el.setAttribute("textonly", "true");
                                return;
                            }
                            if (isValidGif) {
                                el.style.display = "none";
                                el.setAttribute("textonly", "true");
                                return;
                            }
                        })
                    }
                }

                if (!isStyleInjected) {
                    // Append the <style> element to the <head> of the document
                    injectCss();
                }
                
            }
            
        }
    };
})();