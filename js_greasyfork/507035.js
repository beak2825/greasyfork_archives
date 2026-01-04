// ==UserScript==
// @name         zplace Mandatory
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      4.4
// @description  Overlay for z/place
// @author       NitsuG
// @match        https://place.zevent.fr/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerator.com
// @downloadURL https://update.greasyfork.org/scripts/507035/zplace%20Mandatory.user.js
// @updateURL https://update.greasyfork.org/scripts/507035/zplace%20Mandatory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadOverlay(canvas) {
        const parentDiv = canvas.parentElement;

        const image = document.createElement("img");
        image.width = 1000;
        image.height = 1000;
        image.src = "https://s1.gifyu.com/images/S1Q5j.png"
        image.style = `
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    background: transparent;
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
