// ==UserScript==
// @name         Video time tracker (Firestore)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Save and restore video playback time using Firestore
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528736/Video%20time%20tracker%20%28Firestore%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528736/Video%20time%20tracker%20%28Firestore%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const FIRESTORE_URL = "PASTE YOUR FIRESTORE LINK"; // Firestore API endpoint URL
    const SAVE_INTERVAL = 30 * 1000; // seconds *1000 - Time between saves in milliseconds
    const MIN_TRACK_TIME = 20 * 60; // minutes * 60 - Minimum video duration to track (seconds)
    const REMOVE_TIME_INTERVAL = 2; // Days before data removal
    const REMOVE_TIME = "08:30"; // Daily cleanup time (24h format)

    let video = null; // HTML video element reference
    let VIDEO_ID = ""; // Current video's unique identifier
    let lastSaveTime = 0; // Timestamp of last save operation

    function getVideoID() {
        const url = new URL(window.location.href);

        // Ưu tiên lấy ID từ tham số truy vấn dạng ?v= hoặc ?id=
        const queryID = url.searchParams.get("v") || url.searchParams.get("id");
        if (queryID) return queryID;

        // Nếu không có tham số, lấy phần cuối của URL nếu có dạng số hoặc chữ cái
        const pathSegments = url.pathname.split('/');
        const lastSegment = pathSegments.pop() || pathSegments.pop(); // Tránh dấu '/' ở cuối
        if (/^[a-zA-Z0-9]+$/.test(lastSegment)) return lastSegment;

        return null; // Không tìm thấy ID hợp lệ
    }


    function findVideo() { // Find video element and initialize tracking
        video = document.querySelector("video") || detectPlyrVideo();
        if (video) {
            if (video.duration < MIN_TRACK_TIME) return;
            initializeVideo();
        } else setTimeout(findVideo, 1000);
    }

    function detectPlyrVideo() { // Detect Plyr player video element
        if (typeof Plyr !== "undefined" && Plyr.instances.length > 0) {
            return Plyr.instances[0].elements.container.querySelector("video");
        }
        return null;
    }

    function loadSavedProgress() { // Load saved playback time from Firestore
        GM_xmlhttpRequest({
            method: "GET",
            url: `${FIRESTORE_URL}/${VIDEO_ID}`,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data?.fields?.time?.integerValue) {
                        video.currentTime = parseInt(data.fields.time.integerValue);
                    }
                } catch (error) {}
            }
        });
    }

    function savePlaybackProgress() { // Save current time to Firestore
        if (!video || video.paused || video.ended || video.duration < MIN_TRACK_TIME) return;

        const currentTime = Math.floor(video.currentTime);
        const currentDate = new Date().toISOString().split('T')[0];

        if (Date.now() - lastSaveTime >= SAVE_INTERVAL) {
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `${FIRESTORE_URL}/${VIDEO_ID}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    fields: {
                        time: { integerValue: currentTime },
                        date: { stringValue: currentDate }
                    }
                }),
                onload: () => lastSaveTime = Date.now()
            });
        }
    }

    function monitorUrlChanges() { // Watch for URL changes to detect new videos
        let previousUrl = location.href;
        setInterval(() => {
            if (location.href !== previousUrl) {
                previousUrl = location.href;
                VIDEO_ID = getVideoID();
                findVideo();
            }
        }, 1000);
    }

    function initializeVideo() { // Set up video event listeners
        loadSavedProgress();
        video.addEventListener("timeupdate", savePlaybackProgress);
        video.addEventListener("seeked", savePlaybackProgress);
    }

    function shouldDeleteData(videoDate) { // Check if data exceeds retention period
        const today = new Date();
        const savedDate = new Date(videoDate);
        const timeDifference = (today - savedDate) / (1000 * 60 * 60 * 24);
        return timeDifference > REMOVE_TIME_INTERVAL;
    }

    function removeOldData() { // Delete expired documents from Firestore
        GM_xmlhttpRequest({
            method: "GET",
            url: `${FIRESTORE_URL}`,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.documents) {
                        data.documents.forEach((doc) => {
                            const videoDate = doc.fields?.date?.stringValue;
                            if (videoDate && shouldDeleteData(videoDate)) {
                                GM_xmlhttpRequest({
                                    method: "DELETE",
                                    url: `${FIRESTORE_URL}/${doc.name.split("/").pop()}`,
                                });
                            }
                        });
                    }
                } catch (error) {}
            }
        });
    }

    function scheduleDailyCleanup() { // Schedule daily data cleanup
        setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
            if (currentTime === REMOVE_TIME) {
                removeOldData();
            }
        }, 60 * 1000);
    }

    function init() { // Main initialization function
        VIDEO_ID = getVideoID();
        findVideo();
        monitorUrlChanges();
        scheduleDailyCleanup();
    }

    init();
})();
