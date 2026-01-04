// ==UserScript==
// @name        TVer自動再生
// @namespace   TVer自動再生
// @match       https://tver.jp/*
// @grant       none
// @version     1.2
// @author      hamachi
// @description Tver自動再生
// @license     MIT license
// @icon        https://tver.jp/favicon.ico
// @compatible  firefox
// @compatible  chrome
// @downloadURL https://update.greasyfork.org/scripts/480743/TVer%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/480743/TVer%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F.meta.js
// ==/UserScript==

const regex = /https:\/\/tver\.jp\/episodes\/.+/;
let saveURL;
let autoPlay = true;

const buttonElement = "button[class*='big-play-button_host__']";

const observer = new MutationObserver(() => {
    if (regex.test(location.href)) {
        const playButton = document.querySelector(buttonElement);
        if (saveURL && saveURL != location.href) {
            autoPlay = true;
        }
        if (playButton && autoPlay) {
            saveURL = location.href;
            autoPlay = false;
            playButton.click();
        }
    } else {
        autoPlay = true;
    }
});
const config = { childList: true, subtree: true };
observer.observe(document.getElementById("__next"), config);
