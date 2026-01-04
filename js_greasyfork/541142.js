// ==UserScript==
// @name        TikTok Playback Rate
// @description Add an icon to change the playback speed rate of a video while browsing on TikTok
// @match       *://*.tiktok.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @license MIT
// @version 0.0.1.20250723082414
// @namespace https://greasyfork.org/users/1409663
// @downloadURL https://update.greasyfork.org/scripts/541142/TikTok%20Playback%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/541142/TikTok%20Playback%20Rate.meta.js
// ==/UserScript==

(() => {
    function init() {
        for (const item of document.querySelectorAll(".css-16g1ej4-SectionActionBarContainer, .css-1ngivhs-DivActionItemContainer, .css-1npmxy5-DivActionItemContainer")) renderItem(item);
    }
    /**
     * The list of the possible rate switches
     */
    let availableRates = [1.25, 1.5, 2, 0.5, 1];
    GM.getValue("TikTokPlaybackRate-Rate").then((val) => {if (val) availableRates = JSON.parse(val)}); // Update the rate switches list from user's settings
    /**
     * If the user is pressing the Option/Alt key. If the user presses the playback rate modifier button while pressing also Option/Alt, a prompt dialog should be shown so that they can change the playback rate list.
     */
    let isAltClicked = false;
    /**
     * Create the new Playback rate button
     * @param {HTMLElement} item The div that contains all the TikTok buttons
     */
    async function renderItem(item) {
        const isSingleVideo = !item.classList.contains("css-16g1ej4-SectionActionBarContainer");
        const isDarkThemeEnabled = document.documentElement.getAttribute("data-theme") === "dark";
        if (item.querySelector("[data-playbackratemodifier]")) return;
        const button = Object.assign(document.createElement("button"), {
            type: "button",
            "aria-label": "Change playback rate"
        });
        button.classList.add(isSingleVideo && isDarkThemeEnabled ? "scss-rninf8-ButtonActionItem" : isSingleVideo ? "css-nmbm7z-ButtonActionItem" : isDarkThemeEnabled ? "css-67yy18-ButtonActionItem" : "css-1ok4pbl-ButtonActionItem");
        const span = Object.assign(document.createElement("span"), { style: isDarkThemeEnabled ? "color: rgba(255, 255, 255, 0.9)" : "color: rgb(22, 24, 35);" });
        span.classList.add(isSingleVideo ? "css-1eor4vt-SpanIconWrapper" : isDarkThemeEnabled ? "css-1lguwm0-SpanIconWrapper" : "css-8qpsy4-SpanIconWrapper");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        for (const item of [["width", "24"], ["height", "24"], ["fill", "currentColor"]]) svg.setAttribute(item[0], item[1]);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        for (const item of [["d", "M6.54322 5.48256C7.84003 4.39564 9.46603 3.6886 11.25 3.53263V5.25C11.25 5.66421 11.5858 6 12 6C12.4142 6 12.75 5.66421 12.75 5.25V3.53263C16.929 3.89798 20.2412 7.28742 20.4855 11.5H18.75C18.3358 11.5 18 11.8358 18 12.25C18 12.6642 18.3358 13 18.75 13H20.4444C20.1837 15.3116 19.0211 17.2483 17.2765 18.6683C16.9553 18.9298 16.9068 19.4022 17.1683 19.7235C17.4298 20.0447 17.9022 20.0932 18.2235 19.8317C20.45 18.0194 21.8936 15.4382 21.9944 12.3473C21.9985 12.3154 22.0006 12.283 22.0006 12.25C22.0006 12.2301 21.9998 12.2103 21.9983 12.1907C21.9994 12.1274 22 12.0638 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.2522 3.52303 17.9538 5.76986 19.8262C6.08807 20.0913 6.56099 20.0483 6.82617 19.7301C7.09134 19.4119 7.04835 18.939 6.73014 18.6738C5.01891 17.2478 3.82673 15.3069 3.55764 13H5.24963C5.66385 13 5.99963 12.6642 5.99963 12.25C5.99963 11.8358 5.66385 11.5 5.24963 11.5H3.51446C3.62363 9.61804 4.34508 7.90037 5.48256 6.54322L6.71967 7.78033C7.01256 8.07322 7.48744 8.07322 7.78033 7.78033C8.07322 7.48744 8.07322 7.01256 7.78033 6.71967L6.54322 5.48256ZM16.7589 6.63409C16.5207 6.44971 16.1824 6.45611 15.9516 6.64937L15.7344 6.83167C15.596 6.9479 15.3979 7.1145 15.1588 7.31609C14.6808 7.71919 14.0386 8.26249 13.3826 8.82286C12.727 9.38283 12.0555 9.96154 11.5197 10.4349C11.2521 10.6713 11.0157 10.8838 10.831 11.0556C10.6593 11.2154 10.4986 11.3707 10.4112 11.4787C9.75823 12.2863 9.89798 13.4588 10.7234 14.0977C11.5488 14.7365 12.7472 14.5998 13.4002 13.7923C13.4876 13.6842 13.6051 13.4955 13.7245 13.2953C13.8529 13.0799 14.0099 12.8059 14.1835 12.4967C14.5311 11.8777 14.9523 11.1053 15.3585 10.3522C15.7649 9.59869 16.1576 8.86226 16.4486 8.31438C16.5941 8.04039 16.7142 7.81345 16.798 7.65496L16.9294 7.40617C17.0685 7.14203 16.9971 6.81847 16.7589 6.63409Z"], ["fill", isDarkThemeEnabled ? "#e8e8e8" : "#161822"]]) path.setAttribute(item[0], item[1]);
        const strong = Object.assign(document.createElement("strong"), { textContent: "1x" });
        strong.classList.add(isSingleVideo ? "css-1l70c6-StrongText" : isDarkThemeEnabled ? "css-1w013xe-StrongText" : "css-vc3yj-StrongText");
        svg.append(path);
        span.append(svg);
        button.append(span, strong);
        button.setAttribute("data-playbackratemodifier", "");
        let rateStep = 0;
        button.onclick = () => {
            if (isAltClicked) { // Ask the user to change the playback rate steps
                const newValues = prompt("Customize the playback rate steps. Divide them with a space:", availableRates.join(" "));
                if (newValues) {
                    let customAvailableRates = [];
                    for (const item of newValues.split(" ")) !isNaN(+item) && customAvailableRates.push(item); // Check that are valid ints
                    if (customAvailableRates.length !== 0) {
                        availableRates = customAvailableRates;
                        GM.setValue("TikTokPlaybackRate-Rate", JSON.stringify(availableRates));
                    }
                }
                isAltClicked = false;
                return;  
            }
            const video = (isSingleVideo ? document.querySelector("[data-e2e=detail-video]") : item.closest("article")).querySelector("video");
            const playbackRate = availableRates[rateStep];
            video.playbackRate = playbackRate;
            strong.textContent = `${playbackRate}x`;
            svg.style.transform = `scaleX(${availableRates[rateStep] < 1 ? "-" : ""}1)`; // In case the video is being slowed down, we'll mirror the icon
            rateStep++;
            if (rateStep === availableRates.length) rateStep = 0;
        }        
        /**
         * Sometimes, TikTok changes the article a button is tied. So, if an article cannot be found, we'll have to wait again.
         * If it's not found after 5 tries, the operation will be discarded.
         * 
         * We need to track the article object so that we can get a) the current video, and adjust its playback rate; b) to look for class changes (since, if the user opens or closes the comment section, the article class is changed and some of the content inside the comment view is recreated, and so we need to add again the button)
         */
        let timeout = 0;
        async function articleTied() {
            const article = item.closest("article");
            if (timeout > 5) return;
            if (!article) {
                await new Promise(res => setTimeout(res, 500));
                timeout++;
                return articleTied();
            }
            reset.observe(item.closest("article"), {attributes: true, attributeFilter: ["class"]});
            if (!isSingleVideo && article.closest("video")) article.closest("video").playbackRate = 1; 
        }
        articleTied();
        (item.querySelector("[data-e2e=share-icon]") ?? item.querySelector("[data-e2e=undefined-icon]") ?? document.querySelector("[data-e2e=comment-icon]") ?? document.querySelector("[data-e2e=like-icon]") ?? document.querySelector(".css-1ngivhs-DivActionItemContainer > button > ")).closest("button").insertAdjacentElement("afterend", button);
    }
    window.addEventListener("keydown", (e) => { // Look if alt key is pressed
        isAltClicked = e.altKey;
    });
    window.addEventListener("keyup", () => { // Delete any reference to the alt key pressed
        isAltClicked = false;
    })
    /**
     * A MutationObserver that resets all the button on the page
     */
    const reset = new MutationObserver(() => { 
        for (const item of document.querySelectorAll("[data-playbackratemodifier]")) item.remove();
        reset.disconnect();
        reset.observe(document.documentElement, { attributeFilter: ["data-theme"], attributes: true });
        init();
    });
    reset.observe(document.documentElement, { attributeFilter: ["data-theme"], attributes: true }) // Re-render the buttons if the user changes the theme from Settings
    init();
    function createScrollObserver(selector, updateScrolls, restoreDefaultPlaybackRate) {
        const div = document.querySelector(selector);
        if (!div) setTimeout(() => createScrollObserver(selector, updateScrolls), 500); else {
            new MutationObserver(async () => { // Check if new videos are loaded
                if (updateScrolls) {
                    createScrollObserver("#column-list-container", false, true); // The div where the next videos are loaded (feed). We'll also need to restore the default playback, since otherwise after a few scrolls the video would have a custom playback rate (I think TikTok recycles the video element for the next video)
                    createScrollObserver(".css-1senhbu-DivLeftContainer"); // Suggested videos (single video)
                } else {
                    await new Promise(res => setTimeout(res, 500));
                    if (restoreDefaultPlaybackRate) {
                        for (const video of document.querySelectorAll("video")) video.playbackRate = 1;
                    }
                    init();
                } 
            }).observe(div, { childList: true });
            init();
        }
    }
    createScrollObserver("#column-list-container", false, true); // The div where the next videos are loaded (feed). We'll also need to restore the default playback, since otherwise after a few scrolls the video would have a custom playback rate (I think TikTok recycles the video element for the next video)
    createScrollObserver(".css-1senhbu-DivLeftContainer"); // Suggested videos (single video)
    createScrollObserver(".css-1yczxwx-DivBodyContainer", true); 
})()
