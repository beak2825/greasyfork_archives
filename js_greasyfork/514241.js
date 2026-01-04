// ==UserScript==
// @name         60fps bugfix
// @namespace    http://tampermonkey.net/
// @version      2.113
// @description  Literally the best mod ever made. Makes 60fps not only playable, it feels exactly the same as 240fps while *reducing* lag and ping instead of increasing it. Fullscreen recommended. Keywords: starblast.io starblast dueling mod fps bypass unlock uncap if you want more than 60fps, please instead use this mod, it'll solve all your problems.
// @author       ✨Stardust™
// @match        *://starblast.io/*
// @exclude      *://starblast.io/modding.html*
// @exclude      *://starblast.io/shipeditor*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514241/60fps%20bugfix.user.js
// @updateURL https://update.greasyfork.org/scripts/514241/60fps%20bugfix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL for your modified index.html file
    const modifiedIndexUrl = 'https://raw.githubusercontent.com/StardustSDF/60fps-bugfix-starblast/main/index.html';
    // The above URL includes lowercase name mod, as well as the following altercation to the game code:
    // e.prototype.lII0O=function(t){var e,i,s;let now=Date.now();if(now-lastTime<1000/20){clearTimeout(this.stopTimer);this.stopTimer=setTimeout(()=>{i=(t.clientX-this.element.offsetLeft)*this.l01II,s=(t.clientY-this.element.offsetTop)*this.l01II,this.mousepressed?this.O01lI(i,s,"mouse"):this.mouseMove(i,s,"mouse"),this.control_listener&&this.control_listener.mouseMove(i,s,t);},50);return!1;}lastTime=now;t.preventDefault(),i=(t.clientX-this.element.offsetLeft)*this.l01II,s=(t.clientY-this.element.offsetTop)*this.l01II,e=this.mousepressed?this.O01lI(i,s,"mouse"):this.mouseMove(i,s,"mouse"),e||null!=this.control_listener&&this.control_listener.mouseMove(i,s,t),clearTimeout(this.stopTimer),this.stopTimer=setTimeout(()=>{i=(t.clientX-this.element.offsetLeft)*this.l01II,s=(t.clientY-this.element.offsetTop)*this.l01II,this.mousepressed?this.O01lI(i,s,"mouse"):this.mouseMove(i,s,"mouse"),this.control_listener&&this.control_listener.mouseMove(i,s,t);},50),!1},
    // and let lastTime = 0; at the beginning of the main js for the game
    function applyModifiedIndex() {
        fetch(modifiedIndexUrl)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('An error? In my userscript?!');
                }
            })
            .then(html => {
                document.open();
                document.write(html);
                document.close();
                applyCustomCursor();
            })
            .catch(error => {
                console.error('An error? In my userscript?!:', error);
            });
    }

    function applyCustomCursor() {
        const cursorTrailCount = 2;
        const trailElements = [];
        const trailDelay = 5;
        const edgeThreshold = 3;

        for (let i = 0; i < cursorTrailCount; i++) {
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.width = '24px';
            trail.style.height = '24px';
            trail.style.backgroundImage = 'url(https://raw.githubusercontent.com/StardustSDF/60fps-bugfix-starblast/main/crosshair4.png)';
            trail.style.backgroundSize = 'contain';
            trail.style.pointerEvents = 'none';
            trail.style.opacity = '1';
            trail.style.transform = 'translate(-50%, -50%)';
            trail.style.zIndex = '69420';
            document.body.appendChild(trail);
            trailElements.push(trail);
        }

        let mouseX = 0, mouseY = 0;
        let trailPositions = Array(cursorTrailCount).fill({ x: 0, y: 0 });

        function updateCursorTrail() {
            trailPositions = [{ x: mouseX, y: mouseY }, ...trailPositions.slice(0, cursorTrailCount - 1)];

            trailElements.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = `${trailPositions[index].x}px`;
                    trail.style.top = `${trailPositions[index].y}px`;

                    if (
                        trailPositions[index].x <= edgeThreshold ||
                        trailPositions[index].x >= window.innerWidth - edgeThreshold ||
                        trailPositions[index].y <= edgeThreshold ||
                        trailPositions[index].y >= window.innerHeight - edgeThreshold
                    ) {
                        trail.style.opacity = '0';
                    } else {
                        trail.style.opacity = '1';
                    }
                }, index * trailDelay);
            });

            requestAnimationFrame(updateCursorTrail);
        }

        updateCursorTrail();

        window.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        const style = document.createElement('style');
        style.innerHTML = `
            * {
                cursor: none !important;
            }
            .sbg-crosshair {
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', applyModifiedIndex);
})();