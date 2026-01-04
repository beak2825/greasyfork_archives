// ==UserScript==
// @name         z/place (ZUnivers)
// @namespace    https://minuskube.fr
// @license      MIT
// @version      4.016
// @description  Overlay pour le place de ZUnivers
// @author       Commu Zunivers (MinusKube, Grewa & co)
// @match        https://zunivers.zerator.com/place
// @icon         https://zunivers.zerator.com/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474951/zplace%20%28ZUnivers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474951/zplace%20%28ZUnivers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadOverlay(canvas) {
        const parentDiv = canvas.parentElement;

        const image = document.createElement("img");
        image.width = 500;
        image.height = 500;
        image.src = "https://s11.gifyu.com/images/S4ck7.png"; //changer le lien de l'image change l'overlay
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

    var audio = new Audio('https://minuskube.fr/zplace_ready.mp3'); // changer le lien change l'alerte audio quand le pixel est dispo (actif/mute avec J)
	audio.muted = true; audio.volume=0.6; // changer le volume de l'alerte nombre entre 0 et 1 ex 0.6 60% du volume
    console.log("muted : " + audio.muted);
    var playAudio = 0;

    function upsertSquareColorPreview() {
        const divParent = document.querySelector('.area');
        const selectorImgEl = document.querySelector('.selector');

        if (!divParent || !selectorImgEl) {return}

        let squareColorPreviewEl = document.querySelector('.square-color-preview');
        if (!squareColorPreviewEl) {
            squareColorPreviewEl = document.createElement('div');
            squareColorPreviewEl.setAttribute('class', 'square-color-preview')
            divParent.insertBefore(squareColorPreviewEl, selectorImgEl);
        }
        const style = 'width:8px; height:8px; margin-left:21px; margin-top:21px; position:absolute; top:0; left:0;';
        const transform = 'transform: ' + selectorImgEl.style.getPropertyValue('transform') +';';
        const color = 'background-color: ' + document.querySelector('.color span').parentNode.style.getPropertyValue('background-color') + ';';
        squareColorPreviewEl.setAttribute('style', style + transform + color);
    }

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        let addedCanvas = null;
        mutationLoop: for (const mutation of mutations) {
            if(mutation.target.textContent == " Colorier en " && mutation.oldValue != null) {
                audio.play();
            }
            upsertSquareColorPreview();

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

// code de base : MinusKube
// prévisualisation des couleurs : Grewa
// réglage du volume : Julien
// tout assembler dans un nouveau script commenté + overlays : Arucane