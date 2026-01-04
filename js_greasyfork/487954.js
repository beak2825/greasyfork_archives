// ==UserScript==
// @name         Quill Answer Revealer 
// @version      2
// @description  Extract and log answers from multiple_choice_options response
// @author       godlyredflame
// @match        https://www.quill.org/*
// @grant        none
// @run-at       document-idle
// @esversion    8
// @namespace https://greasyfork.org/users/1193591
// @downloadURL https://update.greasyfork.org/scripts/487954/Quill%20Answer%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/487954/Quill%20Answer%20Revealer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.loaded = false;

    // Function to log answers from multiple_choice_options response
    function logAnswers(responseData) {
        return new Promise(resolve => {
            console.clear();  // Clear console for better visibility

            // Log each answer
            for (const [index, item] of responseData.entries()) {
                const answerText = item.text;  // Assuming answers are under the "text" property
                console.log(`Answer ${index + 1}:`);
                console.log(answerText);
                console.log("------------");
            }

            resolve();
        });
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments).then(res => {
            if (res.url.includes("/multiple_choice_options")) {
                // If the URL includes "multiple_choice_options", log the answers
                return res.json().then(responseData => {
                    return logAnswers(responseData);
                });
            }

            if (!window.loaded) {
                console.clear();
                console.log("%c Answer Revealer ", "color: mediumvioletred; -webkit-text-stroke: .5px black; font-size:40px; font-weight:bolder; padding: .2rem;");
                console.log("%cCreated by godlyredflame", "color: white; -webkit-text-stroke: .5px black; font-size:15px; font-weight:bold;");
                window.loaded = true;
            }

            return res;
        });
    };

})();
