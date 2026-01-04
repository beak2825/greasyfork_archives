// ==UserScript==
// @name         groking off
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  make x the everything app better by adding the 100% anti-woke based ai everywhere you go
// @author       cv
// @match        *://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522925/groking%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/522925/groking%20off.meta.js
// ==/UserScript==

(function() {
    'use strict';

const checkLoaded = setInterval(() => {
    if (document.querySelector('[data-testid="primaryColumn"]')) {
        clearInterval(checkLoaded); console.log("beep boop");

        // overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed'; overlay.style.display = 'flex'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.justifyContent = 'center'; overlay.style.alignItems = 'center'; overlay.style.zIndex = '99999'; overlay.style.pointerEvents = "none";

        const img = document.createElement('img'); img.src = 'https://pbs.twimg.com/media/Ggil5gGW8AABqAs?format=png&name=900x900';
        img.style.minWidth = '1920px'; img.style.minHeight = '1080px'; img.style.objectFit = 'contain'; img.style.margin = 'auto'; img.style.pointerEvents = "none";

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        const check = setInterval(() => {
                const icons = document.querySelectorAll('svg.r-1hdv0qi.r-1xvli5t.r-m6rgpd.r-lrvibr.r-bnwqim.r-dnmrzs.r-yyyyoo.r-4qtqp9');
                if (icons.length > 0) {
                    icons.forEach((icon) => {
                        const img2 = document.createElement('img');
                        img2.src = 'https://pbs.twimg.com/media/GgimQeqXMAA65DZ?format=png&name=360x360';
                        img2.style.width = '24px';
                        img2.style.height = '24px';
                        img2.style.objectFit = 'contain';
                        icon.replaceWith(img2);
                    });
                }

            // this will break EVERYTHING.
            history.replaceState(null, '', '/grok');
            document.querySelectorAll('.public-DraftEditorPlaceholder-inner').forEach(el => {el.overflow = "hidden"; el.innerHTML = 'What is Groking?! <img src="https://pbs.twimg.com/media/GgimQeqXMAA65DZ?format=png&name=360x360" width="24" height="24">'});

            }, 1000)}
    }, 1000)
})();