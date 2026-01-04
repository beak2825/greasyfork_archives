// ==UserScript==
// @name         Redirect to Freedium
// @namespace    https://github.com/ArjixWasTaken/my-userscripts
// @version      1.1
// @description  Automatically redirects medium articles to freedium
// @author       ArjixWasTaken
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freedium.cfd
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494711/Redirect%20to%20Freedium.user.js
// @updateURL https://update.greasyfork.org/scripts/494711/Redirect%20to%20Freedium.meta.js
// ==/UserScript==


const isMediumArticle = () => !!document.querySelector(`meta[property="al:android:url"][content^="medium://p/"]`)?.content;
new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (!node?.matches?.(`head > *`)) continue;
            if (isMediumArticle()) {
                window.location.href = `https://freedium.cfd/` + encodeURIComponent(window.location.href);
                observer.disconnect();
                return;
            }
        }
    }
}).observe(document, { subtree: true, childList: true });
