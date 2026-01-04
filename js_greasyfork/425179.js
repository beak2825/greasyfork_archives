// ==UserScript==
// @name         Auto load images on Pixiv.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically load highest resolution picture on Pixiv.net and auto expand galleries
// @author       You
// @match        https://www.pixiv.net/en/artworks/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/425179/Auto%20load%20images%20on%20Pixivnet.user.js
// @updateURL https://update.greasyfork.org/scripts/425179/Auto%20load%20images%20on%20Pixivnet.meta.js
// ==/UserScript==


'use strict';
function vKeyDown () {
    document.body.dispatchEvent(
        new KeyboardEvent('keydown', {bubbles: true, key: 'v',})
    )
}

const observer = new MutationObserver(function(mutations) {
    if(!document.querySelector (".gtm-manga-viewer-preview-modal-open, .gtm-medium-work-expanded-view")) {return;}

    observer.disconnect();
    vKeyDown()
})

observer.observe(document.body, {childList: true, subtree: true})
