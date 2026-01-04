// ==UserScript==
// @name         Focus always and replay if video is paused
// @name:zh-TW   始終保持焦點並在視頻暫停時自動播放
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  To learn more faster and efficiently
// @description:zh-tw   此腳本旨在提高在線學習效率，透過自動保持視頻播放視窗的焦點並在視頻暫停時自動重播。適用於 `https://iedu.foxconn.com/*` 網站，能夠確保學習過程中視頻連續播放，無需手動干預，特別適合忙碌且希望提高學習效率的用戶。
// @author       pjiaquan
// @match        https://iedu.foxconn.com/public/user/*
// @match        https://iedu.foxconn.com/public/play/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @connect      us-central1-exam-fc1f9.cloudfunctions.net
// @connect      127.0.0.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481604/Focus%20always%20and%20replay%20if%20video%20is%20paused.user.js
// @updateURL https://update.greasyfork.org/scripts/481604/Focus%20always%20and%20replay%20if%20video%20is%20paused.meta.js
// ==/UserScript==
(function() {
    'use strict';

    window.onblur = null;
    window.blurred = false;
    let projectName = "";
    let playingVideoTitle = "";
    let isClicked = false;

    document.hasFocus = () => true;
    window.onFocus = () => true;

    [
        "hidden",
        "mozHidden",
        "msHidden",
        "webkitHidden"
    ].forEach(prop_name => {
        Object.defineProperty(document, prop_name, {value: false});
    });

    Object.defineProperty(document, "visibilityState", {get: () => "visible"});
    Object.defineProperty(document, "webkitVisibilityState", {get: () => "visible"});

    document.onvisibilitychange = undefined;

    var event_handler = (event) => {
        if (["blur", "mouseleave", "mouseout"].includes(event.type) &&
            (event.target instanceof HTMLInputElement ||
             event.target instanceof HTMLAnchorElement ||
             event.target instanceof HTMLSpanElement)) {
            return; // exclude input, anchor, and span elements
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };

    [
        "visibilitychange",
        "webkitvisibilitychange",
        "blur",
        "hasFocus",
        "mouseleave",
        "mouseout",
        "mozvisibilitychange",
        "msvisibilitychange"
    ].forEach(event_name => {
        window.addEventListener(event_name, event_handler, true);
        document.addEventListener(event_name, event_handler, true);
    });

    let videoData = {
        filename: null,
        waresMap: new Map()
    };

    // script1 functionality
    function updateVideoProgress() {
        // if(sn) {
        //     console.log(sn);
        // }

        if (!isVideoPlaying()) {
            console.log('Video is not playing!');
            startPlayingVideo();
        } else {

            // console.log(wares);

            var videoElement = document.getElementById('realvideo_html5_api');
            if (videoElement && videoElement.tagName === 'VIDEO') {
                const activeElement = document.querySelector('dl .active');

                // Check if the active element exists and log its title attribute or inner text
                if (activeElement) {
                    // console.log('Active element found:', activeElement);
                    // console.log('Title:', activeElement.getAttribute('title'));
                    playingVideoTitle = activeElement.getAttribute('title');
                    // console.log('Content:', activeElement.innerText);

                    //console.log('title: ', playingVideoTitle);
                } else {
                    console.log('No active element found');
                }

                // videoElement.muted();
                // console.log('#301: video is playing', videoElement);
                if(videoElement.src.indexOf("hdvideo") >= 0){
                    //console.log("您正在播放的是高清版本的");

                    var currentSrc = videoElement.src;

                    if(currentSrc.indexOf() >= 0) {
                        console.log('you are hd mode');

                        var newSrc = currentSrc.replace('hdvideo', 'sdvideo');

                        videoElement.src = newSrc;

                        videoElement.muted = true;
                        // Load the new video source and mute it
                        videoElement.load();
                    }

                }

                if (wares && wares.length > 0) {
                    //console.log(window.wares);
                    var i = 0;
                    for(i = 0; i < wares.length; i++) {
                        if(wares[i].isComplete === "N") {

                            let v = wares[i];
                            let duration = v.duration;
                            let playtime = v.playtime;
                            let percentage = (playtime / duration) * 100;

                            console.log(`${wares[i].name} 沒完成, 剩下: ${percentage.toFixed(2)}% ${new Date().toLocaleString()} #1`);

                            // Usage example
                            const progress_data = {
                                userId: userId,
                                userName: userName,
                                // examName: window.wares[i].name,
                                progress: percentage.toFixed(2),
                                examName: projectName + ': ' + playingVideoTitle || 'Sample Exam Title' // Replace with actual data
                            };

                            sendDataToServer(progress_data);

                            // Find the element by its title attribute
                            // var myElement = document.querySelector('dd[title="六西格玛项目定义"]');
                            var myElement = document.querySelector(`dd[title="${wares[i].name}"]`);

                            if (myElement) {

                                console.log('found element 1');

                                if(playingVideoTitle !== wares[i].name) {
                                    console.log('found element 1 cliked');
                                    //myElement.click();
                                }
                                break; // Exit the loop after the first click
                            } else {
                                console.log('Element not found');
                            }
                        } else if(wares[i].isComplete === undefined) {
                            let v = wares[i];
                            let duration = v.duration;
                            let playtime = v.playtime;
                            let percentage = (playtime / duration) * 100;

                            console.log(`${wares[i].name} 沒完成, 剩下: ${percentage.toFixed(2)}% ${new Date().toLocaleString()} #2`);

                            // Usage example
                            const progress_data2 = {
                                userId: userId,
                                userName: userName,
                                // examName: window.wares[i].name,
                                progress: percentage.toFixed(2),
                                examName: projectName + ': ' + playingVideoTitle || 'Sample Exam Title' // Replace with actual data
                            };

                            sendDataToServer(progress_data2);

                            var myElement2 = document.querySelector(`dd[title="${wares[i].name}"]`);

                            if (myElement2) {
                                // Trigger the click event on the element
                                console.log('found element 2');
                                if(playingVideoTitle !== wares[i].name) {
                                    console.log('found element 2 cliked');
                                    //myElement2.click();
                                }
                                break; // Exit the loop after the first click
                            } else {
                                console.log('Element not found');
                            }

                            //                             if (videoElement.readyState >= 1) { // Check if metadata is loaded
                            //                                 var duration = videoElement.duration;
                            //                                 var targetTime = duration * 0.95; // Calculate 95% of the total duration

                            //                                 console.log('Setting currentTime to: ', targetTime);
                            //                                 videoElement.currentTime = targetTime; // Set the video progress to 95%
                            //                                 videoElement.play()
                            //                                     .then(() => console.log("Video playback started at 95%"))
                            //                                     .catch((error) => console.error("Error attempting to play video:", error));
                            //                             } else {
                            //                                 // Wait for metadata to be loaded before setting currentTime
                            //                                 videoElement.addEventListener('loadedmetadata', function() {
                            //                                     var duration = videoElement.duration;
                            //                                     var targetTime = duration * 0.95; // Calculate 95% of the total duration

                            //                                     console.log('Setting currentTime to: ', targetTime);
                            //                                     videoElement.currentTime = targetTime; // Set the video progress to 95%
                            //                                     videoElement.play()
                            //                                         .then(() => console.log("Video playback started at 95%"))
                            //                                         .catch((error) => console.error("Error attempting to play video:", error));
                            //                                 });
                            //                             }
                        } else {

                            //                             try {
                            //                                 let v = window.wares[i];
                            //                                 let duration = v.duration;
                            //                                 let playtime = v.playtime;
                            //                                 let percentage = (playtime / duration) * 100;

                            //                                 console.log(`${window.wares[i].name} 已經完成, 剩下: ${percentage.toFixed(2)}%`);

                            //                                 // URL of the Cloud Function endpoint
                            //                                 const url = 'https://us-central1-exam-fc1f9.cloudfunctions.net/saveProgress';

                            //                                 // Data to be sent
                            //                                 const data = {
                            //                                     // userId: userId,
                            //                                     examName: window.wares[i].name,
                            //                                     progress: percentage.toFixed(2),
                            //                                     drink: 'mojito'
                            //                                 };

                            //                                 // Using GM.xmlHttpRequest to send a POST request with the data
                            //                                 GM.xmlHttpRequest({
                            //                                     method: 'POST',
                            //                                     url: url,
                            //                                     headers: {
                            //                                         'Content-Type': 'application/json'
                            //                                     },
                            //                                     data: JSON.stringify(data),
                            //                                     onload: function(response) {
                            //                                         // Parse the JSON response
                            //                                         const result = JSON.parse(response.responseText);
                            //                                         console.log('Success:', result);
                            //                                     },
                            //                                     onerror: function(error) {
                            //                                         console.error('Error:', error);
                            //                                     }
                            //                                 });
                            //                             }catch (error) {
                            //                                 console.log(error);
                            //                             }

                        }
                    }
                }
            }

        }
    }

    function setupVideoCheck() {
        const activeElement = document.querySelector('.breadcrumb .active');
        projectName = activeElement.textContent;

        //console.log('Page loaded, running script');
        setInterval(updateVideoProgress, 5000);

        // Function to observe DOM changes and click the "确定" button
        function observeDOMChanges() {
            const targetNode = document.body;
            const config = { childList: true, subtree: true };

            const callback = function(mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const confirmButton = document.querySelector('.layui-layer-btn0');
                        if (confirmButton) {
                            confirmButton.click();
                            console.log('Clicked "确定" button');
                            observer.disconnect(); // Stop observing after the button is clicked
                            break;
                        }
                    }
                }
            };

            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }

        // Start observing for DOM changes
        observeDOMChanges();
    }



    function isVideoPlaying() {
        var videoElement = document.getElementById('realvideo_html5_api');
        if (videoElement && videoElement.tagName === 'VIDEO') {
            // console.log(videoElement);

            if(videoElement.src.indexOf("hdvideo") >= 0){
                //console.log("您正在播放的是高清版本的");

                var currentSrc = videoElement.src;

                var newSrc = currentSrc.replace('hdvideo', 'sdvideo');

                videoElement.muted = true;

                videoElement.src = newSrc;

                // Load the new video source and mute it
                //videoElement.load();
            }

            // Extract the src attribute
            var videoSrc = videoElement.getAttribute("src");

            // Extract the filename from the src URL
            var videoFilename = videoSrc.split('/').pop().split('.')[0];

            // Save the filename to the videoData object
            videoData.filename = videoFilename;

            // Map the videoFilename with wares if needed
            if (wares && wares.length > 0) {

                wares.forEach((ware, index) => {
                    videoData.waresMap.set(videoFilename, ware); // Example mapping
                });
            }

            // Output the filename or save it as needed
            if (videoData && videoData.waresMap) {
                const firstEntry = videoData.waresMap.entries().next().value;
                if (firstEntry) {
                    const [firstKey, firstValue] = firstEntry;

                    if(firstValue.isComplete === "Y") {
                        return true;

                    }
                } else {
                    console.log('Map is empty');


                }
            }

            return !videoElement.paused;
        } else {
            console.log('Video element not found or is not a video tag');
            return null;
        }
    }


    function startPlayingVideo() {
        var videoElement = document.getElementById('realvideo_html5_api');
        if (videoElement && videoElement.tagName === 'VIDEO') {
            videoElement.muted = true;
            videoElement.play()
                .then(() => console.log("Video playback started"))
                .catch((error) => console.error("Error attempting to play video:", error));

        } else {
            console.log('Video element not found or is not a video tag');
        }
    }

    // Define the function to send data using GM.xmlHttpRequest
    function sendDataToServer(data) {
        const url = 'https://us-central1-exam-fc1f9.cloudfunctions.net/saveProgress';
        const testUrl = 'http://127.0.0.1:5001/exam-fc1f9/us-central1/saveProgress';

        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data), // JSON stringify the payload
            onload: function(response) {
                try {
                    // Parse the JSON response
                    const result = JSON.parse(response.responseText);
                    //console.log('Success:', result);
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
            },
            onerror: function(error) {
                console.error('Request failed:', error);
            },
            ontimeout: function() {
                console.error('Request timed out');
            }
        });

        // GM.xmlHttpRequest({
        //     method: 'POST',
        //     url: testUrl,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     data: JSON.stringify(data), // JSON stringify the payload
        //     onload: function(response) {
        //         try {
        //             // Parse the JSON response
        //             const result = JSON.parse(response.responseText);
        //             //console.log('Success:', result);
        //         } catch (e) {
        //             console.error('Error parsing response:', e);
        //         }
        //     },
        //     onerror: function(error) {
        //         console.error('Request failed:', error);
        //     },
        //     ontimeout: function() {
        //         console.error('Request timed out');
        //     }
        // });
    }


    window.addEventListener('load', setupVideoCheck);

})();


