// ==UserScript==
// @name         Speed Up Ad
// @version      0.1
// @description  Speed Up Youtube Video Speed.
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/speed-up-ad.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/speed-up-ad.js
// @author       Lilp
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497702/Speed%20Up%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/497702/Speed%20Up%20Ad.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    let isSpeedUp = false;
    const btn = document.createElement("button");
    btn.textContent = "Speed Up";
    btn.style;
    btn.style.cssText = `position: fixed; left: 100px; top:46px; z-index: 99999;`;
    document.body.append(btn);
    btn.addEventListener("click", () => {
        const video = document.querySelector("video");
        if (isSpeedUp) {
            video.playbackRate = 1;
            btn.textContent = "Speed Up";
        } else {
            video.playbackRate = 16;
            btn.textContent = "Speed Normal";
        }
        isSpeedUp = !isSpeedUp;
    });
})();
