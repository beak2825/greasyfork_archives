// ==UserScript==
// @name         [Broken] Video Controls on Youtube Shorts (and remove clutter)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Implements a very crude way of adding controls to youtube shorts
// @author       Theo#2401 @ Discord
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461318/%5BBroken%5D%20Video%20Controls%20on%20Youtube%20Shorts%20%28and%20remove%20clutter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461318/%5BBroken%5D%20Video%20Controls%20on%20Youtube%20Shorts%20%28and%20remove%20clutter%29.meta.js
// ==/UserScript==

const DEBUG_ENABLED = true;
const AttributesList = { "controls":"",
                         "data-no-fullscreen":"false",
                       };

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

(function() {
    if (!DEBUG_ENABLED) return;

    waitForElm('.html5-video-container>video').then((elm) => {
        for (var key in AttributesList)
        {
            if (!elm.hasAttribute(key)) elm.setAttribute(key, AttributesList[key]);
            else
            {
                let shouldStripAttribute = AttributesList[key] === "strip";
                if (shouldStripAttribute) { elm.removeAttribute(key); continue; }
                if (elm.getAttribute(key) !== AttributesList[key]) elm.setAttribute(key, AttributesList[key]);
            }
        }

        // only listen to attribute changes, just what we need
        const config = { attributes: true, childList: false, subtree: false };
        const callback = (mutationList, observer) => {
           for (var key in AttributesList)
           {
               if (!elm.hasAttribute(key)) elm.setAttribute(key, AttributesList[key]);
               else
               {
                   let shouldStripAttribute = AttributesList[key] === "strip";
                   if (shouldStripAttribute) { elm.removeAttribute(key); continue; }
                   if (elm.getAttribute(key) !== AttributesList[key]) elm.setAttribute(key, AttributesList[key]);
               }
           }

            document.querySelectorAll(".style-scope ytd-reel-player-overlay-renderer").forEach((elm) => {
                elm.style.display = "none";
            });

            document.querySelectorAll(".html5-video-player").forEach((elm) => {
                elm.classList.remove("html5-video-player");
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(elm, config);
    });
})();