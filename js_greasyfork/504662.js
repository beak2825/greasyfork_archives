// ==UserScript==
// @name         Sex.com Autoplay Videos
// @namespace    http://tampermonkey.net/
// @version      2024-08-26
// @description  Autoplays videos on sex.com/videos, similar to scrolller.com. Features: Autoscroll, Toggle Mute All, Play Audio on Visible Videos only, Set Scroll Speed.
// @match        https://www.sex.com/videos/*
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sex.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504662/Sexcom%20Autoplay%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/504662/Sexcom%20Autoplay%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //match:

    // Append the button to the buttonContainer container

    // Default settings
    const defaultSettings = {
        scroll: false,
        scrollSpeed: 0.1,
        muteAll: true,
        audioOnVisible:false
    };

    // Load settings or use defaults
    const settings = {
        muteAll: GM_getValue('muteAll', defaultSettings.muteAll),
        scroll: GM_getValue('scroll', defaultSettings.scroll),
        scrollSpeed: GM_getValue('scrollSpeed', defaultSettings.scrollSpeed),
        audioOnVisible: GM_getValue('audioOnVisible', defaultSettings.audioOnVisible)
    };

    // Function to update and save settings
    function updateSettings(key, value) {
        GM_setValue(key, value);
        settings[key] = value;
        //alert(`${key} is now set to ${value}`);
    }

    // Function to navigate to a new page and run code after it loads
    function navigateAndRun(url, callback) {
        // Navigate to the new URL
        window.location.href = url;

        // Wait until the new page has fully loaded
        window.onload = function() {
            // Code to run after the page has loaded
            callback();
        };
    }




    function toggleMute(){
        console.log(GM_getValue('muteAll'));


        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.muted = settings.muteAll;
            video.play();
        });
    }

    // Function to unmute only visible videos
    function unmuteVisibleVideos() {
        const videos = document.querySelectorAll('video');

        // Create an IntersectionObserver to detect visible videos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is visible, unmute it
                    entry.target.muted = false;
                } else {
                    // Video is not visible, mute it (optional)
                    entry.target.muted = true;
                }

                if(settings.audioOnVisible === false){
                    observer.disconnect();
                    entry.target.muted = true;
                }
            });
        }, { threshold: 0.5 }); // Adjust threshold as needed

        // Observe each video
        videos.forEach(video => {
            observer.observe(video);
        });


    }

    function unmuteVisibleVideosGPT(){
        let cooldown = 0;
        let muted = false;

        document.body.onscroll = function () {
            if (muted) {
                return;
            }

            if (Date.now() - cooldown < 250) {
                return;
            }
            cooldown = Date.now();

            let diffMin = Infinity;
            let nearest;
            let middle = window.innerHeight / 2;

            document.querySelectorAll("video").forEach(video => {
                // Mute all videos by default
                video.muted = true;

                // Calculate the difference between the video's center and the viewport's middle
                const rect = video.getBoundingClientRect();
                const elemMiddle = rect.y + (rect.height / 2);
                const diff = Math.abs(middle - elemMiddle);

                // Find the video closest to the middle of the viewport
                if (diff < diffMin) {
                    diffMin = diff;
                    nearest = video;
                }
            });

            // If the closest video is within the viewport, unmute it
            if (nearest && diffMin <= middle) {
                nearest.muted = false;
            }
        };

        // Optional: To automatically trigger this check periodically, not just on scroll
        let interval = window.setInterval(() => {
            document.body.onscroll();
        }, 500); // Check every 500ms

    }

    // Function to automatically scroll down the screen
    function autoScroll(scrollSpeed) {

        // Convert scrollSpeed to an appropriate pixel value per interval
        const speed = scrollSpeed * 10; // Adjust multiplier as needed for desired speed
        console.log(speed);

        // Start scrolling at the defined speed

        if(settings.scroll === true){
            const scrollInterval = setInterval(() => {
                // Scroll down by the calculated speed
                window.scrollBy(0, speed);

                // Optional: Stop scrolling when reaching the bottom of the page
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight || settings.scroll === false) {
                    clearInterval(scrollInterval);
                }

                if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
                    console.log("bottom of screen")
                    switchNextPage();
                }
            }, 10); // Interval in milliseconds (100ms is a common choice)

        }

    }

    function switchNextPageOld(){
        console.log("inside switch next page");
        const url = window.location.href;
        console.log(url);
        const match = url.match(/www\.\w+\.com\/videos\/\?page=(\d+)/);


        let nextPageNumber = 1;
        if(url === "https://www.sex.com/videos/"){
            nextPageNumber = 2;
        }else if(match){
            const pageNumber = parseInt(match[1]);
            console.log(pageNumber); // Outputs: 123
            nextPageNumber = pageNumber+1;
            console.log(nextPageNumber);
        }

        navigateAndRun(`http://www.sex.com/videos/?page=${nextPageNumber}`, function() {
            console.log('The new page has loaded!');
        });
    }

    function switchNextPage() {
        console.log("inside switch next page");
        const url = window.location.href;
        console.log(url);

        function getNextPageUrl(url) {
            // Match the current page number, if it exists
            const match = url.match(/(\?|&)page=(\d+)/);

            let nextPageNumber = 2; // Default to page 2 if no page number is found

            if (match) {
                const currentPageNumber = parseInt(match[2]);
                nextPageNumber = currentPageNumber + 1;

                // Replace the existing page number with the next page number
                return url.replace(/(\?|&)page=\d+/, `$1page=${nextPageNumber}`);
            } else {
                // If no page number exists, append ?page=2 or &page=2 based on the presence of other parameters
                return url.includes('?') ? `${url}&page=2` : `${url}?page=2`;
            }
        }

        const newUrl = getNextPageUrl(url);

        navigateAndRun(newUrl, function() {
            console.log('The new page has loaded!');
        });
    }





    function startupSettings(){
        if(settings.scroll === true){
            autoScroll(settings.scrollSpeed);
        }

        if(settings.muteAll === false){
            toggleMute();
        }

        if(settings.audioOnVisible === true){
            unmuteVisibleVideos();
        }

    }



    // Register menu commands
    GM_registerMenuCommand(`Toggle Mute All`, ()=>{updateSettings('muteAll', !settings.muteAll); toggleMute();});

    GM_registerMenuCommand(`Toggle Auto Scroll`, ()=>{
        updateSettings('scroll', !settings.scroll);
        autoScroll(settings.scrollSpeed);
    });

    GM_registerMenuCommand(`Set Scroll Speed`, () => {
        const newVolume = prompt('Set scroll speed (0.0 to 1.0):', settings.scrollSpeed);
        if (newVolume !== null && newVolume >= 0 && newVolume <= 1) {
            updateSettings('scrollSpeed', parseFloat(newVolume));
            settings.scroll = false;
            autoScroll(settings.scrollSpeed);
        } else {
            alert('Invalid speed value!');
        }
    });

    GM_registerMenuCommand(`Toggle Play Audio in Viewport`, ()=>{
        updateSettings('audioOnVisible',!settings.audioOnVisible);
        //settings.muteAll = true;
        //toggleMute();
        unmuteVisibleVideos();});

    console.log("hello world!");

    function replacePreviewsWithVideos() {

        console.log("inside replacePreviewsWithVideos");

        // Replace '.preview' with the actual selector that identifies preview elements
        const previewElements = document.querySelectorAll(".image_wrapper");
        //console.log(previewElements);

        previewElements.forEach((preview) => {
            // Extract the video page URL from the preview element
            const videoPageURL = preview.getAttribute("href"); // Replace this with the actual way to get the URL

            //console.log(videoPageURL);

            if (videoPageURL) {
                fetch(videoPageURL)
                    .then((response) => response.text())
                    .then((data) => {
                    //console.log(data);
                    const urlMatch = data.match(/src:\s*'(https:\/\/[^']+\.mp4)'/);
                    let url = "";
                    if (urlMatch) {
                        url = urlMatch[1]; // This contains just the URL
                        //console.log(url); // Output: "https://example.com/video.mp4"
                    }

                    const videoElement = document.createElement("video");
                    if (videoElement) {

                        videoElement.src = url;
                        videoElement.autoplay = true;
                        videoElement.controls = true;
                        videoElement.muted = true;
                        videoElement.loop = true;
                        videoElement.style.width = "100%";

                        preview.innerHTML = "";
                        preview.appendChild(videoElement);
                        preview.removeAttribute("href");
                    }
                    else {
                        console.log(
                            "Video source not found on video page:"
                        );
                    }
                })
                    .catch((error) => console.log("Error fetching video page:", error));
            }
        });

        startupSettings();
    }

    // Run the function after the page has loaded
    window.addEventListener("load", replacePreviewsWithVideos);

})();