// ==UserScript==
// @name         Youtube Get Dislike
// @version      0.3
// @description  Get Dislike Amount.
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/youtube-get-dislike.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/youtube-get-dislike.js
// @author       Lilp
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497707/Youtube%20Get%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/497707/Youtube%20Get%20Dislike.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let url = "";

    setInterval(() => {
        if (url === window.window.location.href) {
            return;
        }
        url = window.window.location.href;

        const urlParams = new URLSearchParams(window.location.search).get("v");

        if (!urlParams) return;

        const inter = setInterval(() => {
            const disBtn = document.querySelector("dislike-button-view-model button");
            if (disBtn) {
                clearInterval(inter);
                fetch(`https://returnyoutubedislikeapi.com/Votes?videoId=${urlParams}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (disBtn && !disBtn.querySelector(".dislike")) {
                            disBtn.setAttribute("style", "width:auto !important");
                            disBtn.insertAdjacentHTML("beforeend", `<span class="dislike">${data.dislikes}</span>`);
                        }
                    });
            }
        }, 1000);
    }, 1000);

    // Your code here...
})();
