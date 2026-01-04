// ==UserScript==
// @name        Disney+: Move subtitles up when controls are showing
// @namespace   Violentmonkey Scripts
// @match       https://www.disneyplus.com/video/*
// @grant       none
// @version     1.0
// @author      Lypheo
// @description Dynamically moves the subtitles so that they’re not covered by the progress bar  
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456948/Disney%2B%3A%20Move%20subtitles%20up%20when%20controls%20are%20showing.user.js
// @updateURL https://update.greasyfork.org/scripts/456948/Disney%2B%3A%20Move%20subtitles%20up%20when%20controls%20are%20showing.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


(async function() {
  let controls = await waitForElm(".overlay.overlay__controls");

  observer = new MutationObserver(function (event) {
    showing = !!document.querySelector(".overlay.overlay__controls.overlay__controls--visually-show");
    document.querySelector(".dss-hls-subtitle-overlay").style.top = showing ? "-80px" : "0px";
  });

  observer.observe(controls, {
    attributes: true,
    attributeFilter: ['class'],
    childList: false,
    characterData: false
  });

})();