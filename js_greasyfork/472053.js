// ==UserScript==
// @name         Video Popout and No scroll on Click timestamps
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button for watching YouTube videos in picture in picture mode while viewing comments and prevents the page from scrolling up if the user clicks a timestamp in the comments
// @author       TetteDev
// @license      GPLv3
// @match        *://*.youtube.com/watch*
// @icon         https://cdn-icons-png.flaticon.com/512/1412/1412577.png
// @grant        GM_info
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/472053/Video%20Popout%20and%20No%20scroll%20on%20Click%20timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/472053/Video%20Popout%20and%20No%20scroll%20on%20Click%20timestamps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var seconds=0;
    function timestampToSeconds(t){
        let parts = t.split(':').reverse();
        if (parts.length<2){ return false; }
        seconds = 0;
        for(let i=0; i<parts.length; i++){
            switch (i) {
                case 0: seconds += (+parts[i]); break;
                case 1: seconds += (+parts[i])*60; break;
                case 2: seconds += (+parts[i])*60*60; break;
                case 3: seconds += (+parts[i])*60*60*24; break;
            }
        }
        return Number.isInteger(seconds);
    }
    document.addEventListener("click", function(e){
        if(e.target.tagName=="A"){
            if(timestampToSeconds(e.target.innerText)){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                movie_player.seekTo(seconds);
                return;
            }
        } else if(e.target.closest("a#endpoint")){/*chapters*/
            if(timestampToSeconds(e.target.closest("a#endpoint").querySelector("#details #time").innerText)){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                movie_player.seekTo(seconds);
                return;
            }
        }
    }, {capture: true} );

    if ('pictureInPictureEnabled' in document) {
        const videoElement = document.getElementsByClassName("video-stream")[0];
		const pipButtonElement = GM_addElement(document.body, "button", {
			textContent: "Pip Mode",
		});

        pipButtonElement.style.position = "fixed";
        pipButtonElement.style.right = "2rem";
        pipButtonElement.style.bottom = "2rem";
        pipButtonElement.style.visibility = "hidden";
        pipButtonElement.style.width = "10rem";
        pipButtonElement.style.height = "3.5rem";
        pipButtonElement.style.borderRadius = "10px";
        pipButtonElement.style.backgroundColor = "#ff0000";
        pipButtonElement.style.border = `1px solid ${pipButtonElement.style.backgroundColor}`;
        pipButtonElement.style.fontFamily = "Roboto,Arial,sans-serif";
        pipButtonElement.style.color = "#f1f1f1";
        pipButtonElement.style.cursor = "pointer";

        const isVideoVisible = (element) => {
            const rect = element.getBoundingClientRect();

            if (rect.top + rect.height > 0 && rect.top < window.innerHeight) {
                return true;
            }
            return false;
        };
        function urlIsYoutubeVideo(currentUrl) {
            const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/;
            return currentUrl.match(regex);
        }

        // Shows the "Pip" button if the main video is scrolled out of view but the user closed the PiP instance
        videoElement.addEventListener("leavepictureinpicture", (event) => {
            if (!urlIsYoutubeVideo(window.location.href) && pipButtonElement.style.visibility !== "hidden") { pipButtonElement.style.visibility = "hidden"; }

            if (!isVideoVisible(videoElement)) {
                pipButtonElement.style.visibility = "visible";
                pipButtonElement.click = null;
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
        });

        function shouldNotIntercept(navigationEvent) {
            return (
                !navigationEvent.canIntercept ||
                // If this is just a hashChange,
                // just let the browser handle scrolling to the content.
                navigationEvent.hashChange ||
                // If this is a download,
                // let the browser perform the download.
                navigationEvent.downloadRequest ||
                // If this is a form submission,
                // let that go to the server.
                navigationEvent.formData
            );
        }
        navigation.addEventListener("navigate", async e => {
            // Needed only when .intercept in called on 'e' ??
            if (shouldNotIntercept(e)) return;

            if (!urlIsYoutubeVideo(e.destination.url) && pipButtonElement.style.visibility !== "hidden") { pipButtonElement.style.visibility = "hidden"; }
            if (urlIsYoutubeVideo(e.destination.url) && isVideoVisible(videoElement) && pipButtonElement.style.visibility !== "hidden") {
                pipButtonElement.style.visibility = "hidden";
            }

            if (videoElement === document.pictureInPictureElement && !urlIsYoutubeVideo(e.destination.url)) {
                await document.exitPictureInPicture();
            }
        });

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
    }
    else {
        alert(`No support of PIP in Browser, disable the userscript named '${GM_info.script.name}'`);
    }
})();