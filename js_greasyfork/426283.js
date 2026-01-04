// ==UserScript==
// @name         YouTube Permanent ProgressBar
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Keeps YouTube progress bar visible all the time.
// @author       Can Kurt
// @match        *://www.youtube.com/*
// @license      MIT
// @repository   https://github.com/cccaaannn/YouTubePermanentProgressBar
// @downloadURL https://update.greasyfork.org/scripts/426283/YouTube%20Permanent%20ProgressBar.user.js
// @updateURL https://update.greasyfork.org/scripts/426283/YouTube%20Permanent%20ProgressBar.meta.js
// ==/UserScript==

var permanentProgressBar = {

    options: {
        UPDATE_INTERVAL: 500,                    // Update interval in milliseconds, decrease for smoother progress movement or increase for performance.
        PROGRESSBAR_OPACITY_WINDOW: 1,           // Progress bar opacity on window mode between 0 - 1.
        PROGRESSBAR_OPACITY_FULLSCREEN: 0.5,     // Progress bar opacity on fullscreen mode between 0 - 1.

        UPDATE_VIDEO_TIMER: true,
        UPDATE_PROGRESSBAR: true,
        UPDATE_BUFFERBAR: true,
        UPDATE_SCRUBBER: true
    },

    prettifyVideoTime: function (video) {
        let seconds = "" + Math.floor(video.currentTime % 60);
        let minutes = "" + Math.floor((video.currentTime % 3600) / 60);
        let hours = "" + Math.floor(video.currentTime / 3600);
        if (video.currentTime / 60 > 60) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
        else {
            return `${minutes}:${seconds.padStart(2, '0')}`;
        }
    },

    getDuration: function (video, type) {
        if (type === "PROGRESSBAR") {
            return video.currentTime;
        }
        else if (type === "BUFFERBAR") {
            return video.buffered.end(video.buffered.length - 1);
        }
    },

    updateCurrentTimeField: function (player) {
        const video = player.querySelector("video");
        const currentTime = player.querySelector(".ytp-time-current");
        if (!video || !currentTime) {
            return;
        }

        currentTime.innerText = permanentProgressBar.prettifyVideoTime(video);
    },

    updateScrubber: function (passedChapterCount, progressBarLastChapter, chaptersPixelWidthUntilCurrentChapter) {
        const scrubber = document.getElementsByClassName("ytp-scrubber-container");

        if (!scrubber || scrubber.length !== 1) {
            return;
        }

        const positionInfo = progressBarLastChapter.getBoundingClientRect();

        // Chapters has hidden margin and its different on fullscreen
        let chapterMarginFix = passedChapterCount * 2.05;
        if (document.fullscreenElement) {
            chapterMarginFix = passedChapterCount * 3.05;
        }

        const chaptersWithPadding = chaptersPixelWidthUntilCurrentChapter + chapterMarginFix;

        const distanceFromLeft = positionInfo.width + chaptersWithPadding;

        scrubber[0].style.transform = `translateX(${distanceFromLeft}px)`;
    },

    // Deprecated
    updateProgressBar: function (player) {
        // works only on chapterless (old) videos
        const video = player.querySelector("video");
        const progressBar = player.querySelector(".ytp-play-progress");
        const bufferBar = player.querySelector(".ytp-load-progress");
        if (!video || !progressBar || !bufferBar) {
            return;
        }

        progressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
        bufferBar.style.transform = `scaleX(${video.buffered.end(video.buffered.length - 1) / video.duration})`;
    },

    updateProgressBarWithChapters: function (player, type) {
        // YouTube api does not provides current time in chapters
        // this function finds current time in the chapter by finding the ratio between total video duration and total width of the chapters div

        const video = player.querySelector("video");
        if (video == null || isNaN(video.duration)) {
            return;
        }

        // there can be multiple chapters
        const progressBarWidthsCollection = player.getElementsByClassName("ytp-progress-bar-padding");

        // select progress or bufferBar
        let progressBarChaptersCollection;
        if (type === "PROGRESSBAR") {
            progressBarChaptersCollection = player.getElementsByClassName("ytp-play-progress");
        }
        if (type === "BUFFERBAR") {
            progressBarChaptersCollection = player.getElementsByClassName("ytp-load-progress");
        }

        // quit if elements does not exists
        if (!video || !progressBarWidthsCollection || !progressBarChaptersCollection) {
            return;
        }

        // find the ratio between total video duration and total width of the chapters div
        let totalProgressBarWidth = 0;
        for (let i = 0; i < progressBarWidthsCollection.length; i++) {
            totalProgressBarWidth += progressBarWidthsCollection[i].offsetWidth;
        }
        const durationWidthRatio = video.duration / totalProgressBarWidth;

        // loop inside chapters
        let chaptersPixelWidthUntilCurrentChapter = 0;
        let passedChapterCount = 0;
        for (let i = 0; i < progressBarWidthsCollection.length; i++) {

            // if current time is bigger than durationWidthRatio * (chapters pixel width including current one) scale the current chapter to 1 because we passed it
            if (permanentProgressBar.getDuration(video, type) > durationWidthRatio * (chaptersPixelWidthUntilCurrentChapter + progressBarWidthsCollection[i].offsetWidth)) {
                progressBarChaptersCollection[i].style.transform = "scaleX(1)";

                // increase the current chapters location by adding last watched chapter
                chaptersPixelWidthUntilCurrentChapter += progressBarWidthsCollection[i].offsetWidth;

                passedChapterCount++;
            }

            // If not, it means that we are on this chapter.
            // Find the appropriate size for the chapter and scale it
            else {
                // current time
                let currentTimeInChapterInSeconds = permanentProgressBar.getDuration(video, type) - (durationWidthRatio * chaptersPixelWidthUntilCurrentChapter);

                // total chapter time
                let currentChapterLengthInSeconds = durationWidthRatio * progressBarWidthsCollection[i].offsetWidth;

                let currentChapterTimeRatio = currentTimeInChapterInSeconds / currentChapterLengthInSeconds

                progressBarChaptersCollection[i].style.transform = `scaleX(${currentChapterTimeRatio})`;

                // Update scrubber position to align with progressbar
                if (type === "PROGRESSBAR" && permanentProgressBar.options.UPDATE_SCRUBBER) {
                    const progressBarLastChapter = progressBarChaptersCollection[i];

                    permanentProgressBar.updateScrubber(
                        passedChapterCount,
                        progressBarLastChapter,
                        chaptersPixelWidthUntilCurrentChapter
                    );
                }

                break;
            }

        }

    },

    update: function () {
        // Get video element
        const player = document.querySelector(".html5-video-player");
        if (player == null) {
            return;
        }

        // update css
        if (document.fullscreenElement) {
            document.querySelector(".ytp-chrome-bottom").style.opacity = permanentProgressBar.options.PROGRESSBAR_OPACITY_FULLSCREEN;
        }
        else {
            document.querySelector(".ytp-chrome-bottom").style.opacity = permanentProgressBar.options.PROGRESSBAR_OPACITY_WINDOW;
        }

        // update video timer
        if (permanentProgressBar.options.UPDATE_VIDEO_TIMER) {
            permanentProgressBar.updateCurrentTimeField(player);
        }

        // update PROGRESSBAR
        if (permanentProgressBar.options.UPDATE_PROGRESSBAR) {
            permanentProgressBar.updateProgressBarWithChapters(player, "PROGRESSBAR");
        }

        // update BUFFERBAR
        if (permanentProgressBar.options.UPDATE_BUFFERBAR) {
            permanentProgressBar.updateProgressBarWithChapters(player, "BUFFERBAR");
        }

    },

    start: function () {
        setInterval(permanentProgressBar.update, permanentProgressBar.options.UPDATE_INTERVAL);
    }

};


permanentProgressBar.start();
