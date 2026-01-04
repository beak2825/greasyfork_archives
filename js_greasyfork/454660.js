

    // ==UserScript==
    // @name         TescoVegan
    // @author       Ivy9217
    // @version      1.0.6
    // @description  Always apply the vegan filter on tesco.com
    // @match        https://www.tesco.com/groceries/*
    // @exclude      /https://www.tesco.com/groceries/en-GB/(products|trolley|slots|orders).*/
    // @connect      tesco.com
    // @run-at       document-end
    // @namespace    https://greasyfork.org/users/982144
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454660/TescoVegan.user.js
// @updateURL https://update.greasyfork.org/scripts/454660/TescoVegan.meta.js
    // ==/UserScript==

    // Content on the same page changes dynamically.
    // It's not enough to change the page URL after load, we must use this instead
    function observeDOM(callback) {
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                callback(mutation)
            });
        });

        mutationObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ["class"]
        });
    }

    function appendUrlParameters(mutation) {

        var oldUrl = window.location.search;

        // Check if the filter is already applied
        if (!/dietary=Vegan/.test(oldUrl)) {
                var newURL = window.location.protocol + "//" +
                    window.location.host +
                    window.location.pathname + "?dietary=Vegan&viewAll=dietary" +
                    window.location.search.replace('?', '&') +
                    window.location.hash;
                window.location.replace(newURL);
            }
    }


function run() {
  observeDOM(appendUrlParameters);
}

setTimeout(run, 1000);

