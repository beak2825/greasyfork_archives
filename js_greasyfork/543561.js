// ==UserScript==
// @name         LPSG Video Unlocker
// @namespace    LPSG_Video_UNlocker_HoLyMeo 
// @version      1.3
// @description  Unlock videos in LPSG posts with the correct URL transformation logic.
// @author       AI
// @match        https://www.lpsg.com/*
// @connect      cdn-videos.lpsg.com
// @connect      self
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543561/LPSG%20Video%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/543561/LPSG%20Video%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("LPSG Video Unlocker v1.3: Script is running with correct path logic.");

    const VIDEO_EXTENSIONS = [ "mp4", "mov", "m4a", "m4v", "webm", "mpeg", "mpg", "ogv" ];

    function setUrlFileExtension(urlString, newExtension) {
        try {
            const url = new URL(urlString);
            const pathWithoutExtension = url.pathname.substring(0, url.pathname.lastIndexOf('.'));
            url.pathname = `${pathWithoutExtension}.${newExtension}`;
            return url.href;
        } catch (e) {
            console.error("LPSG Video Unlocker: Invalid URL to set extension", urlString);
            return urlString;
        }
    }

    function createVideoContainer(videoUrl, imageSrc) {
        const videoSourceTag = document.createElement("source");
        videoSourceTag.src = videoUrl;
        videoSourceTag.type = 'video/mp4';
        const newVideoTag = document.createElement("video");
        newVideoTag.poster = imageSrc;
        newVideoTag.controls = true;
        newVideoTag.setAttribute("controlslist", "nodownload");
        newVideoTag.preload = "metadata";
        newVideoTag.style.width = '100%';
        newVideoTag.appendChild(videoSourceTag);
        newVideoTag.className = "lpsg-vu-unlocked";

        return newVideoTag;
    }

    function probeVideoUrl(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url: url,
                headers: { "Accept": "video/*" },
                onload: (response) => {
                    const isSuccess = response.status >= 200 && response.status < 300;
                    if (isSuccess) console.log(`%cLPSG Video Unlocker: Probe SUCCESS for ${url}`, 'color: green; font-weight: bold;');
                    resolve(isSuccess);
                },
                onerror: () => resolve(false),
                ontimeout: () => resolve(false)
            });
        });
    }

    async function findVideoUrl(previewImgSrc) {
        // SỬA LỖI: Áp dụng quy luật chuyển đổi chính xác đã được xác định.
        // Thay thế '/attachments/posters/' bằng '/video/'
        if (!previewImgSrc.includes("/attachments/posters/")) {
             console.warn(`LPSG Video Unlocker: Image URL does not match expected pattern: ${previewImgSrc}`);
             return null;
        }
        const videoBaseUrl = previewImgSrc.replace("/attachments/posters/", "/video/");

        for (const ext of VIDEO_EXTENSIONS) {
            const potentialVideoUrl = setUrlFileExtension(videoBaseUrl, ext);
            if (await probeVideoUrl(potentialVideoUrl)) {
                return potentialVideoUrl;
            }
        }
        console.error(`LPSG Video Unlocker: Could not find a valid video URL even with the correct rule for image: ${previewImgSrc}`);
        return null;
    }

    function processPage() {
        const isGuest = !!document.querySelector("div.p-navgroup.p-account.p-navgroup--guest");

        if (isGuest) {
        } else {
            const wrappers = document.querySelectorAll("div.bbMediaWrapper-inner:not(.lpsg-processed)");

            wrappers.forEach(async (wrapperDiv) => {
                wrapperDiv.classList.add('lpsg-processed');
                if (wrapperDiv.querySelector("video")) return; // Đã có video, bỏ qua

                const previewImg = wrapperDiv.querySelector("img");
                if (previewImg && previewImg.src) {
                    const videoUrl = await findVideoUrl(previewImg.src);
                    if (videoUrl) {
                        console.log("LPSG Video Unlocker: Found valid video URL. Creating player...");
                        wrapperDiv.appendChild(createVideoContainer(videoUrl, previewImg.src));
                        wrapperDiv.querySelector("div.video-easter-egg-poster")?.remove();
                        wrapperDiv.querySelector("div.video-easter-egg-blocker")?.remove();
                        wrapperDiv.querySelector("div.video-easter-egg-overlay")?.remove();
                    }
                }
            });
        }
    }

    processPage();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                processPage();
                return;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
