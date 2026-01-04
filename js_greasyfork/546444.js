// ==UserScript==
// @name        DeArrow hack for sidebar animated thumbs compatibility - youtube.com
// @namespace   Violentmonkey Scripts seekhare
// @match       *://www.youtube.com/*
// @run-at      document-start
// @version     1.0
// @license     MIT
// @author      seekhare
// @description Fix for DeArrow blocking youtube's animated thumbnails on the watch page sidebar video list.
// @downloadURL https://update.greasyfork.org/scripts/546444/DeArrow%20hack%20for%20sidebar%20animated%20thumbs%20compatibility%20-%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/546444/DeArrow%20hack%20for%20sidebar%20animated%20thumbs%20compatibility%20-%20youtubecom.meta.js
// ==/UserScript==
const timoutDelayFixMs = 100; // milliseconds
function setupMutationObserver() {
    console.log("Enabling: Fix DeArrow blocking youtube's animated thumbnails on the watch page sidebar video list.")
    const targetNode = document;
    const config = {attributes: true, childList: true, subtree: true};
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const element of mutation.addedNodes) {
                if (element.nodeName === 'ANIMATED-THUMBNAIL-OVERLAY-VIEW-MODEL') {
                    var imgtag = element.lastChild;
                    setTimeout(() => { imgtag.classList.add('cbCustomThumbnailCanvas'); }, timoutDelayFixMs); //seems to need a delay to avoid class being overwritten by something in a race condition hence this setTimout hack.
                } else if (element.parentNode != null && element.parentNode.tagName === 'ANIMATED-THUMBNAIL-OVERLAY-VIEW-MODEL') {
                    var imgtag = element;
                    setTimeout(() => { imgtag.classList.add('cbCustomThumbnailCanvas'); }, timoutDelayFixMs); //seems to need a delay to avoid class being overwritten by something in a race condition hence this setTimout hack.
                }
            }
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}
document.addEventListener("DOMContentLoaded", function(){
    setupMutationObserver();
});