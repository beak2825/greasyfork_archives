// ==UserScript==
// @name         improve Twitter Video Player
// @name:ja      improve Twitter Video Player
// @namespace    https://yakisova.com
// @version      0.2.1
// @description  Change the difficult-to-use Twitter player to a native player.
// @description:ja 使いにくいTwitterの動画プレイヤーをネイティブプレイヤーに置き換えます。
// @author       yakisova41
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475521/improve%20Twitter%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/475521/improve%20Twitter%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bodyElem = document.querySelector("body");

    if(bodyElem !== null) {
        const observer = new MutationObserver(() => {
           const videoComponent = bodyElem.querySelector('div[data-testid="videoComponent"]:not(.improved-video)');
           if(videoComponent !== null) {
                videoComponent.classList.add("improved-video");
                setTimeout(() => {
                    replacePlayer(videoComponent);
                }, 100);
           }
        });

        observer.observe(bodyElem, {
            subtree: true,
            childList: true
        });
    }

    function replacePlayer(componentElement) {
        const originalVid = componentElement.querySelector("div:nth-child(1) > div > video");
        if(originalVid !== null) {

            originalVid.controls = true;
            originalVid.removeAttribute("disablepictureinpicture");

            const handleClick = (e) => {
                e.preventDefault();
                originalVid.play();
                setTimeout(() => {
                    originalVid.muted = false;
                });

                const handleMute = (e) => {
                    if(e.target.muted) {
                        e.target.muted = false;
                    }
                    e.srcElement.removeEventListener("volumechange", handleMute);
                };

                e.srcElement.addEventListener("volumechange", handleMute);

                originalVid.removeEventListener("click", handleClick)
            }
            originalVid.addEventListener("click", handleClick);

            componentElement.parentElement.appendChild(originalVid);
            componentElement.remove();
        }
    }
})();