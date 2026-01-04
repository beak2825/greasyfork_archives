// ==UserScript==
// @name         Block online_current.js
// @namespace    https://instructure-uploads.s3.amazonaws.com/
// @version      1.0
// @description  Blocks the online_current.js script from loading
// @match        *://*.instructure.com/*
// @match        *://instructure-uploads.s3.amazonaws.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530948/Block%20online_currentjs.user.js
// @updateURL https://update.greasyfork.org/scripts/530948/Block%20online_currentjs.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function(mutations, observer) {
        var scripts = document.querySelectorAll("script[src*='online_current.js']");
        scripts.forEach(script => {
            script.remove(); // Remove the script if found
            console.log("Blocked: " + script.src);
        });
    });

    observer.observe(document, { childList: true, subtree: true });

    // Prevent the script from being added dynamically
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        if (tagName.toLowerCase() === 'script') {
            const scriptElement = originalCreateElement.apply(this, arguments);
            Object.defineProperty(scriptElement, 'src', {
                set: function(value) {
                    if (value.includes('online_current.js')) {
                        console.log("Blocked script injection: " + value);
                        return;
                    }
                    scriptElement.setAttribute('src', value);
                },
                get: function() {
                    return scriptElement.getAttribute('src');
                }
            });
            return scriptElement;
        }
        return originalCreateElement.apply(this, arguments);
    };
})();
