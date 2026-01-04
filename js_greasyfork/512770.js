// ==UserScript==
// @name         bilibili_videos_timer
// @namespace    https://github.com/Peilin-zzz-Eric/bilibili_videos_timer
// @version      0.5
// @license      MIT
// @description  View Bilibili video collection time information: total duration, watched duration, remaining duration, watched proportion and real-time progress;
// @author       ezchill
// @match        https://www.bilibili.com/video/*
// @icon         https://raw.githubusercontent.com/Peilin-zzz-Eric/bilibili_videos_timer/main/icon/timer.svg
// @grant        none
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/512770/bilibili_videos_timer.user.js
// @updateURL https://update.greasyfork.org/scripts/512770/bilibili_videos_timer.meta.js
// ==/UserScript==

(function() {

    // 1. Time processing related functions
    // Function to format time from hours, minutes, and seconds into "hh:mm:ss"
    function formatTime(hours, minutes, seconds) {
        var hoursString = hours.toString().padStart(2, "0");
        var minutesString = minutes.toString().padStart(2, "0");
        var secondsString = seconds.toString().padStart(2, "0");
        return hoursString + ":" + minutesString + ":" + secondsString;
    }

    // Function to add two times in "hh:mm:ss" format
    function addTime(time1, time2) {
        var timeParts1 = time1.split(":");
        var timeParts2 = time2.split(":");

        var hours = parseInt(timeParts1[0]) + parseInt(timeParts2[0]);
        var minutes = parseInt(timeParts1[1]) + parseInt(timeParts2[1]);
        var seconds = parseInt(timeParts1[2]) + parseInt(timeParts2[2]);

        // Handle overflow of seconds into minutes
        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
        }

        // Handle overflow of minutes into hours
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
        }

        return formatTime(hours, minutes, seconds);
    }

    // Function to subtract time2 from time1 in "hh:mm:ss" format
    function subtractTime(time1, time2) {
        var timeParts1 = time1.split(":");
        var timeParts2 = time2.split(":");

        var hours1 = parseInt(timeParts1[0]);
        var minutes1 = parseInt(timeParts1[1]);
        var seconds1 = parseInt(timeParts1[2]);

        var hours2 = parseInt(timeParts2[0]);
        var minutes2 = parseInt(timeParts2[1]);
        var seconds2 = parseInt(timeParts2[2]);

        // Convert times to total seconds for easier calculation
        var totalSeconds1 = (hours1 * 3600) + (minutes1 * 60) + seconds1;
        var totalSeconds2 = (hours2 * 3600) + (minutes2 * 60) + seconds2;
        var diffSeconds = totalSeconds1 - totalSeconds2;

        // Convert the result back into "hh:mm:ss"
        var hours = Math.floor(diffSeconds / 3600);
        var minutes = Math.floor((diffSeconds % 3600) / 60);
        var seconds = diffSeconds % 60;

        return formatTime(hours, minutes, seconds);
    }

    // Function to calculate the percentage of time watched compared to total time
    function calculatePercentage(part, total) {
        const partInSeconds = timeToSeconds(part);
        const totalInSeconds = timeToSeconds(total);
        if (totalInSeconds === 0) return "0%";
        const percentage = (partInSeconds / totalInSeconds) * 100;
        return percentage.toFixed(2) + "%";  // Keep percentage to two decimal places
    }

    // Convert time from "hh:mm:ss" format to total seconds
    function timeToSeconds(time) {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    // Convert total seconds back to "hh:mm:ss" format
    function formatSecondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 2. DOM related operations
    // Create and style the container for the icon
    const iconContainer = document.createElement("div");
    iconContainer.style.position = "fixed";
    iconContainer.style.bottom = "25vh";
    iconContainer.style.left = "2vh";
    iconContainer.style.cursor = "pointer";

    // Create and style the icon itself
    const icon = document.createElement("img");
    icon.src = "https://raw.githubusercontent.com/Peilin-zzz-Eric/bilibili_videos_timer/main/icon/timer.svg";
    icon.style.width = "3vh";
    icon.style.height = "3vh";

    // Create the span to display the video progress information
    var span = document.createElement("div");
    span.innerText = "";
    span.style.position = "fixed";
    span.style.bottom = "15vh";
    span.style.left = "2vh";
    span.style.color = "black";
    span.style.border = "none";
    span.style.borderRadius = "5px";
    span.style.cursor = "pointer";
    span.style.fontSize = "0.55vw";
    span.id = "my_time_info";

    //Get target element
    function getTargetElement(){
        let targetElement = document.querySelector(".video-pod__list");
        return targetElement;
    }
    let targetElement = getTargetElement();
    let isAppend = true; //Check if elements are added
    // Append the icon to its container and the container to the body
    if(targetElement){
        iconContainer.appendChild(icon);
        document.body.appendChild(iconContainer);
        document.body.appendChild(span);
        isAppend = false;
    }

    // 3. Update and monitor video playback progress logic
    let totalTime = "0:0:0";  // Total time of the video collection
    let watchedTime = "0:0:0";  // Time already watched

    // Utility function to get element by XPath
    //Return all matching nodes, stored in the order they appear in the document
    function getElementsByXPath(parent, xpath) {
        let elements = [];
        const result = document.evaluate(xpath, parent, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            elements.push(result.snapshotItem(i));  // Add all matched elements to the array
        }
        return elements;
    }

    //Return the first matching node
    function getElementByXPath(parent, xpath) {
        const result = document.evaluate(xpath, parent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    // Update the total and watched time information
    function update_time_info() {
        let elements = [];
        const xpathExpression = "//*[contains(@class, 'video-pod__list')]/div[contains(@class, 'video-pod__item')]";
        elements = getElementsByXPath(document, xpathExpression);

        // Calculate total time and watched time
        if (elements && elements.length > 0) {
            var date = "0:0:0";
            var Pasedate = "0:0:0";
            var onDate = "0:0:0";

            for (let i = 0; i < elements.length; i++) {
                const childElement = elements[i];
                let str = "0:0:0";
                str = getElementByXPath(childElement, ".//div[contains(@class, 'stat-item') and contains(@class, 'duration')]").innerText;
                let str_arr = str.split(":");
                if (str_arr.length == 2) str = "0:" + str;  // Convert "mm:ss" format to "hh:mm:ss"
                if (str_arr.length == 1) str = "0:0:" + str;  // Convert "ss" format to "hh:mm:ss"

                date = addTime(date, str);  // Add the duration to the total time

                // Check if this is the currently playing video
                if (childElement.classList.contains('active') || childElement.querySelector('.active')) {
                    Pasedate = date;
                    onDate = str;
                }
            }
            totalTime = date;
            watchedTime = subtractTime(Pasedate, onDate);
        }
    }

    let time_info = ""; //Timestamp for time information
    //Update real-time time
    function realtime_update_time_info(){
        const video = document.querySelector("video");
        if (video){
            const currentTime = video.currentTime;
            const duration = video.duration;
            let videoDuration = "未知时长";
            let realTimePercentage = "0%";
            if (!isNaN(currentTime) && !isNaN(duration)) {
                const currentFormatted = formatSecondsToTime(currentTime);
                if (!isNaN(duration)) {
                    videoDuration = formatSecondsToTime(duration);
                    realTimePercentage = ((currentTime / duration) * 100).toFixed(2) + "%";
                }

                // Update watched time and calculate remaining time
                const updatedWatchedTime = addTime(watchedTime, formatSecondsToTime(currentTime));
                const remainingTime = subtractTime(totalTime, updatedWatchedTime);
                const percentageWatched = calculatePercentage(updatedWatchedTime, totalTime);
                time_info = `总长：${totalTime}\n已看：${updatedWatchedTime}\n剩余：${remainingTime}\n已看占比：${percentageWatched}\n实时进度：${currentFormatted} / ${videoDuration}`;
            }
        }
    }

    let videoEventListener = null;  // Store event listener for video time updates
    let videoPasueListener = null;  // Store event listener for video time pause
    function monitorVideoTime(){
        const video = document.querySelector("video");
        if (video && !videoEventListener){
            //Listen for video time updates
            videoEventListener = () => {
                //Remove the listener when the video ends
                //To prevent realtime_update_time_info() from updating before update_time_info() finishes updating watchedTime, leading to a rollback issue
                if (video.ended) {
                    removeVideoTimeMonitor();
                    console.log("Video ended, listener removed.");
                } else {
                    realtime_update_time_info();
                    span.innerText = time_info;
                }
            };
            video.addEventListener("timeupdate", videoEventListener);
        }

    }
    //Listen for video pause
    function monitorVideoPause(){
        const video = document.querySelector("video");
        if (video && !videoPasueListener){
            videoPasueListener = () => {
                realtime_update_time_info();

            };
            video.addEventListener("pause", videoPasueListener);
        }
    }

    // 4. Event binding logic
    let isVisible = false;  // Track if the info display is visible

    // Event listener for the icon click
    iconContainer.addEventListener("click", function() {
        if (isVisible) {
            // If visible, clear the span and stop monitoring the video
            span.innerText = "";
            removeVideoTimeMonitor();
        } else {
            monitorVideoTime();
            span.innerText = time_info;
        }
        isVisible = !isVisible;  // Toggle visibility state
    });

    // Remove the time update event listener from the video
    function removeVideoTimeMonitor() {
        const video = document.querySelector("video");
        if (video && videoEventListener) {
            video.removeEventListener("timeupdate", videoEventListener);
            videoEventListener = null;  // Reset the listener
        }
    }
    function removeVideoPauseMonitor() {
        const video = document.querySelector("video");
        if (video && videoPasueListener) {
            video.removeEventListener("pause", videoPasueListener);
            videoPasueListener = null;  // Reset the listener
        }
    }

    // 5. MutationObserver listener
    // Use MutationObserver to watch for DOM changes (for video collections) and refresh data
    const observer = new MutationObserver((mutationsList) => {
        let targetElement = getTargetElement();

        if (!targetElement) {
            console.log("Target element not found. Stopping script.");
            span.innerText = "";
            iconContainer.style.display = "none";
            isVisible = false;
            removeVideoTimeMonitor();
            removeVideoPauseMonitor();
        } else {
            if(isAppend){
                iconContainer.appendChild(icon);
                document.body.appendChild(iconContainer);
                document.body.appendChild(span);
                isAppend = false;
            }
            console.log("Target element found. Restarting script.");
            iconContainer.style.display = "block";

            let targetElementChanged = false;

            // Iterate over the MutationObserver mutationsList
            // Listen for the addition, removal, or reordering of child nodes
            // When the entire targetElement is replaced, the attributes of the new targetElement cannot be observed
            // The issue of refreshing the time when switching between different video collections has been resolved
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const targetNode = mutation.target;
                    //targetElement.contains(targetNode) captures changes from collection to collection
                    //targetNode.classList.contains("active") captures changes from a single video to a collection
                    if (targetElement.contains(targetNode)||targetNode.contains(targetElement)) {
                        console.log("Child list changed, re-checking target element.");
                        targetElementChanged = true;
                        break;  //Exit the loop immediately after detecting the first change
                    }
                }
                // Listen for changes in the attributes of the child elements of the targetElement
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    const targetNode = mutation.target;
                    if (targetElement.contains(targetNode) && targetNode.classList.contains("active")) {
                        console.log("Class changed on element: ", targetNode);
                        targetElementChanged = true;
                        break;  //Exit the loop immediately after detecting the first change
                    }
                }
            }
            if (targetElementChanged) {
                update_time_info();
                monitorVideoPause();
                if(!isVisible){
                    //During video pause, perform a video seek and reset the previously stored pause time record
                    time_info = "";
                }else if(isVisible){
                    //The updatetime listener is removed when the video ends. When the video automatically plays the next video and the timestamp is displayed, reattach the listener
                    monitorVideoTime();
                }
            }
        }
    });

    // Configure MutationObserver to monitor child node changes and attribute changes
    var targetElementParent = document.querySelector(".right-container-inner");
    observer.observe(targetElementParent, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

})();
