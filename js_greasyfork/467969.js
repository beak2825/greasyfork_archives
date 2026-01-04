// ==UserScript==
// @name         [Broken] Kick - Copy direct link to clip
// @namespace    http://tampermonkey.net/
// @description  Allows you to on the clip page of kick, copy the direct link to the video file so it can be easily shared and watched without having to visit kick.com to watch it
// @author       Theo#2401@discord/UnbeatableMeat@kick.com
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        GM_setClipboard
// @license      MIT
// @version      0.61
// @downloadURL https://update.greasyfork.org/scripts/467969/%5BBroken%5D%20Kick%20-%20Copy%20direct%20link%20to%20clip.user.js
// @updateURL https://update.greasyfork.org/scripts/467969/%5BBroken%5D%20Kick%20-%20Copy%20direct%20link%20to%20clip.meta.js
// ==/UserScript==

let observer = {};

(function() {
    'use strict';

    observer = new MutationObserver( list => {
        const evt = new CustomEvent('dom-changed', {detail: list});
        document.body.dispatchEvent(evt)
    });
    observer.observe(document.body, {attributes: false, childList: true, subtree: false});

    document.body.addEventListener('dom-changed', evt => {
        waitForElm('video[id="clip-video-player_html5_api"]').then((elm) => {
            const button = document.createElement('button');
            button.id = "linkbutton";
            button.onclick = function () {
                const video = document.querySelector('video[id="clip-video-player_html5_api"]');
                if (video == null) {
                    observer.disconnect();
                    alert("Please accept the +18 mature warning");
                    return;
                }
                GM_setClipboard(video.src);
            };
            button.innerText = 'Copy Direct Link';

            let css = document.createElement('style');
            css.innerText = `.copyStyle { border:1px solid gray;border-radius:2px; margin-bottom:15px; }
                             .copyStyle:hover { background-color:red; }`;
            button.classList.add("copyStyle");
            document.head.appendChild(css);

            waitForMultipleElms('button[id^="headlessui-menu-button-"]', -1).then((elm) => {
                if (!document.body.querySelector("#linkbutton")) {
                    elm.parentElement.appendChild(button);
                }
            });
        });
    });
})();

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

function waitForMultipleElms(selector, desiredElementIndex = 0) {
    return new Promise(resolve => {
        let items = {};
        if ((items = document.querySelectorAll(selector))) {
            return resolve(items[desiredElementIndex == -1 ? items.length - 1 : desiredElementIndex]);
        }

        const observer = new MutationObserver(mutations => {
            if ((items = document.querySelectorAll(selector))) {
                resolve(items[desiredElementIndex == -1 ? items.length - 1 : desiredElementIndex]);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}