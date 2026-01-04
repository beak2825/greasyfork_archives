// ==UserScript==
// @name         TMcup Overlay
// @namespace    https://minuskube.fr
// @license      MIT
// @version      1.2
// @description  Overlay for z/place, special TMcup
// @author       MinusKube
// @match        https://zunivers.zerator.com/place
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444922/TMcup%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/444922/TMcup%20Overlay.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function loadOverlay(canvas) {
        const parentDiv = canvas.parentElement;
 
        const image = document.createElement("img");
        image.width = 500;
        image.height = 500;
        image.src = "https://zupimages.net/up/22/19/pj2u.png";
        image.style = `
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    `;
 
        parentDiv.appendChild(image);
 
        document.addEventListener('keypress', function(event) {
            if (event.code == 'KeyH') {
                image.hidden = !image.hidden;
            }
          else if (event.code == 'KeyJ') {
              audio.muted = !audio.muted;
              console.log("muted : " + audio.muted);
          }
        });
    }
 
    var audio = new Audio('https://minuskube.fr/zplace_ready.mp3');
    audio.muted = true;
    console.log("muted : " + audio.muted);
    var playAudio = 0;
    const observer = new MutationObserver(function (mutations, mutationInstance) {
        let addedCanvas = null;
        mutationLoop: for (const mutation of mutations) {
            if(mutation.target.textContent == " Colorier en "  && mutation.oldValue != null) {
                audio.play();
            }
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
})();