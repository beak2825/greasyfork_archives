// ==UserScript==
// @name         PIP youtube enabled
// @namespace    none
// @version      0.1
// @description  Adds a button for watching YouTube videos in picture in picture mode while viewing comments.
// @author       Johnny Vo
// @license      GPLv3
// @match        https://youtube.com/watch*
// @match        https://m.youtube.com/watch*
// @icon         https://cdn-icons-png.flaticon.com/512/1412/1412577.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478853/PIP%20youtube%20enabled.user.js
// @updateURL https://update.greasyfork.org/scripts/478853/PIP%20youtube%20enabled.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ('pictureInPictureEnabled' in document) {
        const videoElement = document.getElementsByClassName("video-stream")[0];
        const pipButtonElement = document.createElement("button");
        pipButtonElement.innerHTML = "Pip Mode";
        pipButtonElement.style.position = "fixed";
        pipButtonElement.style.right = "2rem";
        pipButtonElement.style.bottom = "2rem";
        pipButtonElement.style.visibility = "hidden";
        pipButtonElement.style.width = "10rem";
        pipButtonElement.style.height = "3.5rem";
        pipButtonElement.style.borderRadius = "20px";
        pipButtonElement.style.border = "1px solid";
        pipButtonElement.style.backgroundColor = "#212121";
        pipButtonElement.style.color = "#f1f1f1";
        pipButtonElement.style.cursor = "pointer";
        document.body.appendChild(pipButtonElement);

        const isVideoVisible = (element) => {
            const rect = element.getBoundingClientRect();

            if (rect.top + rect.height > 0 && rect.top < window.innerHeight) {
                return true;
            }
            return false;
        };

        document.addEventListener("scroll", async () => {
            if (isVideoVisible(videoElement)) {
                pipButtonElement.style.visibility = "hidden";
                try {
                    if (videoElement === document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                if (videoElement !== document.pictureInPictureElement) {
                    pipButtonElement.style.visibility = "visible";
                    pipButtonElement.addEventListener("click", async () => {
                        pipButtonElement.disabled = true;

                        try {
                            await videoElement.requestPictureInPicture();
                            pipButtonElement.style.visibility = "hidden";
                        } catch (err) {
                            console.log(err)
                        } finally {
                            pipButtonElement.disabled = false;
                        }
                    });
                }
            }
        });
    } else {
        alert('No support of PIP in Browser');
    }
})();