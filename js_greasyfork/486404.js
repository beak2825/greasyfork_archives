// ==UserScript==
// @name         pip insta video call
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  PIP the video call while you are calling in Instagram video call
// @author       Bibek
// @match        https://www.instagram.com/call/*
// @icon         https://static.cdninstagram.com/rsrc.php/v3/yQ/r/SOrOnJCceiE.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486404/pip%20insta%20video%20call.user.js
// @updateURL https://update.greasyfork.org/scripts/486404/pip%20insta%20video%20call.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update video attributes
    function updateVideoAttributes() {
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            video.removeAttribute('disablepictureinpicture');
            video.setAttribute('disablepictureinpicturee', '');
        });
    }

    // Wait for 10 seconds before running the script
    setTimeout(function() {
        // Create a button
        const button = document.createElement('button');
        button.innerHTML = 'PIP';
        button.style.cssText = 'position: absolute; right: 40%; bottom: 1.5%; transform: translateY(-50%); background: gray; border-radius: 50%; padding: 8px; cursor: pointer; margin-right: 0;';
        document.body.appendChild(button);

        // Show alert and wait for user confirmation
        const confirmation = confirm("PIP mode will be enabled after 20 seconds. Do you want to proceed?");

        if (confirmation) {
            // Automatically click the button after 10 seconds
            setTimeout(function() {
                button.click();
                console.log("PIP enabled in insta video call");
            }, 20000);
        } else {
            alert("PIP activation canceled.");
        }

        // Add event listener to the button
        button.addEventListener('click', function() {
            updateVideoAttributes();
        });
    }, 10000);



})();
