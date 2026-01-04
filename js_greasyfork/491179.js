// ==UserScript==
// @name           Twitter style restore
// @description    Replace X branding with Twitter
// @namespace      ikkevoid.github.io
// @author         Ikkevoid
// @version        0.8
// @match          https://twitter.com/*
// @license        MIT
// @run-at         document-start
// @grant          GM_addStyle
// @icon           https://abs.twimg.com/favicons/twitter.2.ico
// @downloadURL https://update.greasyfork.org/scripts/491179/Twitter%20style%20restore.user.js
// @updateURL https://update.greasyfork.org/scripts/491179/Twitter%20style%20restore.meta.js
// ==/UserScript==

GM_addStyle ( `
    [role="heading"] [aria-label="X"] svg, [href="/i/verified-choose"] {
      display: none;
    }

    [role="heading"] [aria-label="X"]:after {
      content: "[CHIRPBIRDICON]";
      font-family: "TwitterChirp";
      font-size: 2rem;
      position: absolute;
      top: 8px;
      left: 8px;
      color: #1DA1F2;
    }
` );


const waitForElm = selector => {
    return new Promise(resolve => {
        const checkForElement = () => {
            const element = document.querySelector(selector);

            if (element) {
                resolve(element);
            } else {
                requestAnimationFrame(checkForElement);
            }
        };

        checkForElement();
    });
}


const titleObserverCallback = mutations => {
    const title = mutations[0].target.innerText;

    if (document.title.includes('/ X')) {
        document.title = title.replace('/ X', '/ Twitter');
    } else if (document.title.includes(" X: ")) {
        document.title = title.replace(' X: ', ' Twitter: ');
    }
};

(async () => {
    const titleObserver = new MutationObserver(titleObserverCallback);

    const titleElement = await waitForElm('title');

    titleObserver.observe(titleElement, { subtree: true, characterData: true, childList: true });

    const favicon = await waitForElm('link[rel="shortcut icon"]');

    favicon.href = 'https://abs.twimg.com/favicons/twitter.2.ico';
})();
