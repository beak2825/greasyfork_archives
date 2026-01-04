// ==UserScript==
// @name         Auto-expand gallery preview on Pixiv.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically expand galleries and show thumbnail view on Pixiv.net
// @author       You
// @match        https://www.pixiv.net/en/artworks/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/425180/Auto-expand%20gallery%20preview%20on%20Pixivnet.user.js
// @updateURL https://update.greasyfork.org/scripts/425180/Auto-expand%20gallery%20preview%20on%20Pixivnet.meta.js
// ==/UserScript==


'use strict';
const observer = new MutationObserver(function(mutations) {
    const galleryViewButton = document.querySelector (".gtm-manga-viewer-preview-modal-open")
    if(!galleryViewButton) { return; }

    observer.disconnect();
    galleryViewButton.click()
})

observer.observe(document.body, {childList: true, subtree: true})
