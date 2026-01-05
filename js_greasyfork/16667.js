// ==UserScript==
// @name        YouTube Annotation Markers
// @namespace   https://github.com/HatScripts/YouTubeAnnotationMarkers
// @version     1.2.5
// @description Marks where annotations are on the progress bar of the HTML5 YouTube player.
// @author      HatScripts
// @match       http://*.youtube.com/*
// @match       https://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/16667/YouTube%20Annotation%20Markers.user.js
// @updateURL https://update.greasyfork.org/scripts/16667/YouTube%20Annotation%20Markers.meta.js
// ==/UserScript==

(function () {
    function parseTime(s) {
        const multipliers = [1, 60, 3600, 86400];
        return s
            .split(":")
            .reverse()
            .map(p => parseFloat(p) || 0)
            .reduce((prev, curr, i) => prev + curr * multipliers[i]);
    }

    function getVideoAnnotationXml(videoId, success) {
        let request = new XMLHttpRequest();
        request.open("GET", "annotations_invideo?video_id=" + videoId, true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                let xmlString = request.responseText;
                let domParser = new DOMParser();
                success(domParser.parseFromString(xmlString, "text/xml"));
            }
        };
        request.send();
    }

    function annotationToMarker(annotation) {
        const rectRegions = Array.from(
            annotation.querySelectorAll("movingRegion *:not([t=never])"));
        if (rectRegions.length === 0) {
            return false;
        }
        const start = rectRegions[0].getAttribute("t");
        const end = rectRegions[rectRegions.length - 1].getAttribute("t");
        const startTime = parseTime(start);
        const duration = parseTime(end) - startTime;
        const appearance = annotation.querySelector("appearance[bgColor]");
        const c = appearance ? parseInt(appearance.getAttribute("bgColor"), 10) : 16777215;
        const rgb = [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, c & 0x0000ff];
        const marker = document.createElement("div");
        marker.classList.add("ytp-play-progress");
        marker.style.position = "absolute";
        marker.style.left = ((startTime / videoDuration) * 100) + "%";
        marker.style.bottom = "100%";
        marker.style.transform = "scaleX(" + (duration / videoDuration) + ")";
        marker.style.background = "rgb(" + rgb + ")";
        marker.style.opacity = 0.5;
        marker.style.zIndex = Math.round(startTime * 10);
        return marker;
    }

    function parseVideoAnnotationXml(xml) {
        Array.from(xml.querySelectorAll("annotation"))
            .map(annotation => annotationToMarker(annotation))
            .filter(annotation => annotation)
            .sort((a1, a2) => parseInt(a1.style.zIndex) - parseInt(a2.style.zIndex))
            .forEach(annotation => progressList.appendChild(annotation));
    }

    function getVideoId() {
        const url = new URL(location.href);
        return url.searchParams.get("v") || url.pathname.split("/").pop()
            || document.querySelector("#page-manage ytd-watch").getAttribute("video-id");
    }

    const videoId = getVideoId();
    const player = document.querySelector("#player:not(.skeleton)");
    const progressBar = player.querySelector(".ytp-progress-bar");
    const progressList = progressBar.querySelector(".ytp-progress-list");
    const videoDuration = parseTime(player.querySelector(".ytp-time-duration").innerText);
    getVideoAnnotationXml(videoId, parseVideoAnnotationXml);
})();
