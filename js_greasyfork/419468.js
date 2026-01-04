// ==UserScript==
// @name         SoundCloud - Auto redirect to current playing
// @namespace    armagan.rest
// @version      1.1
// @description  Automaticly redirects to current playing song.
// @author       Kıraç Armağan Önal
// @match        https://soundcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419468/SoundCloud%20-%20Auto%20redirect%20to%20current%20playing.user.js
// @updateURL https://update.greasyfork.org/scripts/419468/SoundCloud%20-%20Auto%20redirect%20to%20current%20playing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getGetBadgesElement() {return document.querySelector(".playbackSoundBadge__actions")};
    function getAutoRedirectCheckbox() {return document.querySelector(".auto-redirect-button")};
    function isPlaying() {return Boolean(document.querySelector(".playControls__play.playing"))};
    function getNowplayingElement() {return document.querySelector(".playbackSoundBadge__titleLink")};
    function getNowplayingLink() {return (getNowplayingElement() || {}).href || ""};
    let isAutoRedirectActive = false;
    let lastNowPlayingLink = getNowplayingLink();

    setInterval(()=>{
        // Eğer sayfa ayarlar sayfası falansa umursamasın diye.
        if (!getGetBadgesElement()) return;

        if (!getAutoRedirectCheckbox()) {
            let checkBoxElement = document.createElement("input");
            checkBoxElement.type = "checkbox";
            checkBoxElement.checked = isAutoRedirectActive;
            checkBoxElement.title = "Auto redirect to current playing page";
            checkBoxElement.style.marginTop = "5px";
            checkBoxElement.style.marginLeft = "6px";
            checkBoxElement.classList.add("auto-redirect-button");
            checkBoxElement.addEventListener("change",()=>{
                isAutoRedirectActive = checkBoxElement.checked;
            });
            getGetBadgesElement().appendChild(checkBoxElement);
        }

        if (isPlaying() && isAutoRedirectActive && lastNowPlayingLink != getNowplayingLink()) {
            getNowplayingElement().click();
            lastNowPlayingLink = getNowplayingLink();
        }
    },1000)
})();