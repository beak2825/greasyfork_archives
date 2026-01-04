// ==UserScript==
// @name         Rumble Download Button
// @namespace    http://tampermonkey.net/
// @version      2024-02-11
// @description  Add a download button for Rumble
// @author       Zeek Bower
// @match        https://rumble.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rumble.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487122/Rumble%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/487122/Rumble%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function() {
        console.log("load");

function downloadMP4WithProgress() {
    const mp4Url = document.getElementsByTagName("video")[0].currentSrc.split('?')[0];

    fetch(mp4Url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const totalSize = parseInt(response.headers.get('content-length')); // Get total size of the response
            let loadedBytes = 0;

            const reader = response.body.getReader();

            return new ReadableStream({
                start(controller) {
                    function pump() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }

                            controller.enqueue(value);
                            loadedBytes += value.byteLength;

                            const progress = loadedBytes / totalSize;
                            const percentage = Math.round(progress * 100);
                            console.log(`Downloaded ${percentage}%`);

                            let dlbutton = window.document.getElementsByClassName("subscribe-buttons")[0].lastChild

                            dlbutton.firstChild.innerText = `Downloaded ${percentage}%`;

                            // Trigger the progress event here if needed

                            pump();
                        }).catch(error => {
                            console.error('Stream read error:', error);
                            controller.error(error);
                        });
                    }

                    pump();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = document.getElementsByTagName("h1")[0].innerText + ".mp4";
            link.click();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function downloadMP4() {
    // URL of the MP4 file
    const mp4Url = document.getElementsByTagName("video")[0].currentSrc.split('?')[0];

    // Fetch the MP4 file
    fetch(mp4Url)
        .then(response => response.blob())
        .then(response => console.log(response))
        .then(blob => {
        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');

        // Set the link's href to the URL of the blob
        link.href = url;

        // Set the download attribute to specify the filename
        link.download = document.getElementsByTagName("h1")[0].innerText + ".mp4";
        // Simulate a click on the link to trigger the download
        link.click();

        // Cleanup by revoking the object URL
        URL.revokeObjectURL(url);
    });
}

// Create a button element
const button = document.createElement('button');

// Set the button's text content
button.textContent = 'DOWNLOAD4';
        button.innerHTML = "DOWNLOAD";
        button.class = "round-button bg-purple";
        button.setAttribute("class","round-button bg-purple");

        // Assign the downloadMP4 function to the button's onclick event handler
        button.onclick = downloadMP4WithProgress;

         const theVideo = document.getElementsByTagName("video")[0].currentSrc.split('?')[0];
        console.log(theVideo);
        const link = document.createElement('a');

         const ourDiv = window.document.createElement("div");
         ourDiv.class = "subscribe-buttons";
         ourDiv.appendChild(button);
         const currentDiv = window.document.getElementsByClassName("subscribe-buttons");
         currentDiv[0].appendChild(ourDiv)
                console.log("end");
    });


})();