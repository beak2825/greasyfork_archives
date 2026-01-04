// ==UserScript==
// @name         Hide Google Search Location and Sign-in Nag Prompts
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Improves Google Search UX
// @match        https://www.google.*/search
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491657/Hide%20Google%20Search%20Location%20and%20Sign-in%20Nag%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/491657/Hide%20Google%20Search%20Location%20and%20Sign-in%20Nag%20Prompts.meta.js
// ==/UserScript==

function modifyElementStyle(element) {
    if (navigator.userAgent.includes('Mobile')) {
        const body = document.querySelector('body');
        body.style.overflow = 'visible';
        body.style.position = 'relative';
    } else {
        document.querySelector('html').style.overflow = 'visible';
    }

    element.style.display = 'none';
}

function disconnectObserver(observer) {
    setTimeout(() => {
        observer.disconnect();
    }, 1000);
}

function observeDOMChanges() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const locationNag = document.querySelector('.fp-nh');
                const signInNag = document.querySelector('[jscontroller="HK6Tmb"]');
                const signInNagMobile = document.querySelector('.Drwwgb');

                if (locationNag) {
                    modifyElementStyle(locationNag);
                    disconnectObserver(observer);
                }

                if (signInNag || signInNagMobile) {
                    if (navigator.userAgent.includes('Mobile')) {
                        element = signInNagMobile;
                    } else {
                        element = signInNag;
                    }
                    modifyElementStyle(element);
                    disconnectObserver(observer);
                }

                setTimeout(() => {
                    observer.disconnect();
                }, 5000);
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

observeDOMChanges();
