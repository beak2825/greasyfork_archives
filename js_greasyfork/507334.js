// ==UserScript==
// @name		BES ZPlace
// @namespace	http://tampermonkey.net/
// @license		MIT
// @version		1.4
// @description	Overlay ZPlace pour la Burgund Esport
// @author		Kak0
// @match		https://place.zevent.fr/
// @icon		https://raw.githubusercontent.com/Kako38/public/main/zplace_bes_logo.png
// @downloadURL https://update.greasyfork.org/scripts/507334/BES%20ZPlace.user.js
// @updateURL https://update.greasyfork.org/scripts/507334/BES%20ZPlace.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function loadOverlay(canvas) {
        const parentDiv = canvas.parentElement;
 
        const image = document.createElement("img");
        image.src = "https://raw.githubusercontent.com/Kako38/public/main/zplace_bes_overlay.png"
        image.style = `
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    background: transparent;
    width: 100%;
    height: 100%;
    `;
 
        parentDiv.appendChild(image);
 
        document.addEventListener('keypress', function(event) {
            if (event.code == 'KeyH') {
                image.hidden = !image.hidden;
            }
        });
 
        console.log("loaded overlay");
    }
 
    const existingCanvases = document.getElementsByTagName('canvas');
    if(existingCanvases.length > 0)
    {
        loadOverlay(existingCanvases[0]);
    }
    else
    {
        const observer = new MutationObserver(function (mutations, mutationInstance) {
            let addedCanvas = null;
            mutationLoop: for (const mutation of mutations) {
                // Check if the canvas has been added during this mutation
                addedNodeLoop: for (const addedNode of mutation.addedNodes) {
                    if (!(addedNode instanceof Element)) {
                        continue;
                    }
 
                    const canvases = addedNode.getElementsByTagName('canvas');
                    if (canvases.length > 0) {
                        addedCanvas = canvases[0];
                        break addedNodeLoop;
                    }
                }
            }
 
            if (addedCanvas) {
                loadOverlay(addedCanvas);
            }
        });
 
        observer.observe(document, {
            childList: true,
            subtree:   true,
            characterDataOldValue : true
        });
    }
})();