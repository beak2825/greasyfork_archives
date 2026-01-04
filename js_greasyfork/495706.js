// ==UserScript==
// @name         YouTube Revert Layout
// @version      4.0
// @author       Garbhj
// @namespace    https://github.com/garbhj
// @description  This script aims to revert some of Youtube's recent UI changes, switching everything back around and formatting the video cards back into their original dimensions. It works pretty well on my computer (at least it's better than all the other ones I've tried).
// @match        *.youtube.com/watch?*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495706/YouTube%20Revert%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/495706/YouTube%20Revert%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Modify experiment flags to revert UI changes ***
    ytcfg.set('EXPERIMENT_FLAGS', {
        ...ytcfg.get('EXPERIMENT_FLAGS'),
        "kevlar_watch_comments_panel_button": false,
        "kevlar_watch_comments_ep_disable_theater": true,
        "kevlar_watch_grid": false,
        "kevlar_watch_grid_hide_chips": false,
        "kevlar_watch_grid_reduced_top_margin_rich_grid": false,
        "optimal_reading_width_comments_ep": false,
        "small_avatars_for_comments": false,
        "small_avatars_for_comments_ep": false,
        "swatcheroo_direct_use_rich_grid": false,
        "web_watch_compact_comments": false,
        "web_watch_compact_comments_header": false,
        "swatcheroo_rich_grid_delay": 0,
        "wn_grid_max_item_width": 0,
        "wn_grid_min_item_width": 0,
    });

    // Modify page elements (main function)
    let timeoutId = null; // With timeout function
    function modifyPageElements() {
        if (timeoutId) return; // if a timeout is already pending, exit

        if (window.location.href.includes("youtube.com/watch")) {
            const startTime = performance.now();

            modifySidebarVideos();

            const midTime = performance.now();

            adjustVideoPlayerElements();

            const endTime = performance.now();
            const executionTime1 = midTime - startTime;
            const executionTime2 = endTime - midTime;
            console.log(`modifySidebarVideos() took ${executionTime1.toFixed(2)}ms to execute`);
            console.log(`adjustVideoPlayerElements() took ${executionTime2.toFixed(2)}ms to execute`);

        }

        timeoutId = setTimeout(() => {
            timeoutId = null; // reset the timeout id
        }, 50); // 50 ms rate limit
    }

    // Function to properly format sidebar video elements
    function modifySidebarVideos() {

        // ItemsContainer used for performance improvement, no substantial improvement at the end of the day
        // Try switcing "document" with "itemsContainer" for all the querySelections below (except for the last one) to try it out.
        //const itemsContainer = document.querySelector('#items.style-scope.ytd-watch-next-secondary-results-renderer');

        // Format thumbnails to specified width
        const thumbnailDivs = document.querySelectorAll('ytd-rich-grid-media #thumbnail');
        thumbnailDivs.forEach(function(div) {
            div.style.cssText = `width: 168px; position: absolute;`;

            // Additional attempts to modify corner radius with higher specificity (did not work)
            // div.style.borderRadius = "2px !important";
            // div.style.cssText += "#thumbnail.style-scope.ytd-rich-grid-media { border-radius: 2px !important; }";

        });

        // Modify details div spacing: Optimal min spacing was 99px for me - adjust if neccesary
        // I just put min-height because one line titles messed up spacing for some reason
        // Combined with metadata-line for efficiency
        const detailsDivs = document.querySelectorAll('#details');
        detailsDivs.forEach(div => {
                div.style.cssText = "padding-left:176px; margin-top:-12px; min-height: 101px;";
        });

        // Reformat text size and spacing (view count and relative upload time)
        const metadataLineDivs = document.querySelectorAll("div#metadata-line");
        metadataLineDivs.forEach(div => div.style.cssText = "font-size: 1.2rem; line-height: 1.2rem;");

        // Remove margins from contentsDivs (containing both thumbnail and details) to improve spacing
        const contentsDivs = document.querySelectorAll('div#contents.ytd-rich-grid-row');
        contentsDivs.forEach(div => div.style.cssText = "margin: 0px;");

        // Sepecify rich-item-renderer div spacing (includes playlist and ad items as well) because it's quite big by default
        const richItemDivs = document.querySelectorAll("div#contents.ytd-rich-grid-row > ytd-rich-item-renderer");
        richItemDivs.forEach(div => {
            div.style.cssText = "margin-left: 0px; margin-right 0px; margin-bottom: 13px;";

            // Remove channel avatar profile pics
            const avatarLink = div.querySelector("a#avatar-link");
            if (avatarLink) avatarLink.remove();
        });

        // Modify video title styles (Selecting the yt-formatted-string element within the video-title-link)
        const videoTitleElements = document.querySelectorAll("a#video-title-link yt-formatted-string#video-title");
        videoTitleElements.forEach(element => {
            element.style.fontSize = "1.4rem";
            element.style.lineHeight = "2rem";
        });

        // Modify channel name styles (Targeting specific div in channel-name)
        const channelNameDivs = document.querySelectorAll("#items.style-scope.ytd-watch-next-secondary-results-renderer ytd-channel-name#channel-name div#container");
        channelNameDivs.forEach(div => {
            div.style.fontSize = "1.2rem";
            div.style.lineHeight = "1.9rem";
        });

        // Remove sponsored thumbnail cards (I included this because UBlock standard filters can't handle them yet)
        var sponsoredThumbnails = document.querySelectorAll('div[id="fulfilled-layout"][class*="ytd-ad-slot-renderer"]');
        sponsoredThumbnails.forEach(function(thumbnail) {
            thumbnail.parentNode.removeChild(thumbnail);
        });

        // Removes weird gap at the top of secondary recommendations
        const secondaryDivs = document.querySelectorAll("div#secondary");
        secondaryDivs.forEach(div => div.style.cssText = "padding-top: 0px;");

    }


    // Resize the elements of the video player (otherwise the video player and bottom bar get cut off)
    function adjustVideoPlayerElements() {
        // Get the container's dimensions
        const container = document.getElementById("player");
        if (!container) return; // Exit if container is not found

        // Check if container width is zero (while fullscreen or theatre mode)
        if (container.offsetWidth === 0) {
            console.log("Skipping resize due to zero-width container.");
            return;
        }

        const containerWidth = container.offsetWidth + "px"; // width
        const containerHeight = container.offsetHeight + "px"; // height

        // Adjust main video stream
        const videoStream = document.querySelector(".video-stream.html5-main-video");
        if (videoStream) {
            videoStream.style.width = containerWidth;
            videoStream.style.height = container.offsetHeight + "px"; // Set height like this becasue 100% must made the height 0
        }

        // Adjust interactive video content
        const ivVideoContent = document.querySelector(".ytp-iv-video-content");
        if (ivVideoContent) {
            ivVideoContent.style.width = containerWidth;
            ivVideoContent.style.height = '100%'; // Set height to 100% of its parent
        }

        // Adjust video controls bar (for some reason didn't sync)
        const bottomWidth = (container.offsetWidth - 24) + "px" // Calculate width considering margins
        const chromeBottom = document.querySelector(".ytp-chrome-bottom");
        if (chromeBottom) {
            chromeBottom.style.width = bottomWidth;
            chromeBottom.style.left = '12px'; // Align it with a slight gap on the left
        }
        // Adjust the chapter hover bar within the bottom controls
        const chapterHoverBar = document.querySelector(".ytp-chapter-hover-container");
        if (chapterHoverBar) {
            chapterHoverBar.style.width = bottomWidth;
        }
    }

    // Initialize MutationObserver: will run modifyPageElements upon change
    const observer = new MutationObserver(modifyPageElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();