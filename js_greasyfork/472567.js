// ==UserScript==
// @name         Github Repo Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT 
// @description  Hide some sensitive repos from github home page if others(especially your CTO or boss) accidentally visit github.com on your computer.
// @author       Paper Folding
// @match        https://github.com
// @match        https://github.com/
// @match        https://github.com?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472567/Github%20Repo%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/472567/Github%20Repo%20Hider.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function doRemove() {
        if(document.visibilityState === 'hidden')
            return;
        const repos = document.querySelectorAll(
            "div.logged-in.env-production.page-responsive.full-width > div.application-main > div > div > aside > div > div > loading-context > div > div.Details.js-repos-container.mt-5 > div > ul > li"
        );
        for (const repo of repos) {
            if (repo.querySelector("a").href.search(/(URS)|(QX)/)>=0) {
                repo.remove();
            }
        }
    }
    doRemove();
    setInterval(doRemove, 10);
  })();
