// ==UserScript==
// @name         Bing Chat Dark Mode
// @namespace    https://greasyfork.org/en/scripts/462516
// @author       CGYYIT
// @license      MIT
// @version      0.2
// @description  Bing Chat dark mode! Auto align Bing Chat to center!
// @match        https://www.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/462516/Bing%20Chat%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/462516/Bing%20Chat%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    let timer = null;
    let cibSerp = document.getElementsByTagName("cib-serp");
    let cibSerpCount = 0;
    const maxCibSerpCount = 2; // bing chat on the chat tab, and right side of search result
    let maxRetryCount = 25;
    function delay(interval = 200) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            maxRetryCount--;
            console.log(cibSerp.length);
            if (cibSerp.length > 0 && cibSerpCount < maxCibSerpCount && cibSerpCount < cibSerp.length) {
                for (let i = cibSerpCount; i < cibSerp.length; i++) {
                    cibSerp[i].design.colorScheme=1;
                    cibSerp[i].alignment="center";
                }
                cibSerpCount = cibSerp.length;
            }
            if (cibSerpCount < maxCibSerpCount && maxRetryCount > 0) delay();
        }, interval);
    }
    delay();
})();