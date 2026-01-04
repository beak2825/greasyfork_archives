// ==UserScript==
// @name         Update Claude.ai Chat Page Title
// @namespace    https://github.com/mefengl
// @version      0.0.1
// @description  Updates the page title on Claude.ai chat pages every 10 seconds
// @author       mefengl
// @match        https://claude.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478213/Update%20Claudeai%20Chat%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/478213/Update%20Claudeai%20Chat%20Page%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the page title
    const updateTitle = () => {
        // Query the text content of the specific element
        const elementText = document.querySelector("button>div>div.truncate").textContent;

        // Update the title of the document
        document.title = elementText;
    };

    setTimeout(updateTitle, 1000);

    // Run updateTitle function every 10 seconds (10000 milliseconds)
    setInterval(updateTitle, 10000);
})();
