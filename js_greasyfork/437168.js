// ==UserScript==
// @name         Instagram Downloader - HISHTNIK
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.6
// @description  Download Instagram photos and videos from posts.
// @author       You
// @include      /^http.*:\/\/(?:www\.)?instagram\.com\/.*$/
// @icon         https://www.google.com/s2/favicons?domain=instagram.com
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/437168/Instagram%20Downloader%20-%20HISHTNIK.user.js
// @updateURL https://update.greasyfork.org/scripts/437168/Instagram%20Downloader%20-%20HISHTNIK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // VIDEO DOWNLOADS TEMPORARILY NOT WORKING. ALTERNATIVE:
         // Firefox addon => Video Download Helper (with companion app installed)
         // Video Download Helper > Settings > Behaviour > Download Processor > Companion App (make sure you save)
         // To download videos, copy the link and open it in a new tab. Then click on the Video Download Helper Icon

    // Gradual download progress with videos: Tampermonkey > Settings > Advanced > Download Mode > Browser API

    /* Originally developed in Firefox but works in Chromium-based browsers too.
    Every 300 milliseconds, the script attempts to add buttons to the elements inside of a post
    SAVED_VIDEO_DOWNL_LINKS_OBJ stores the download links of fetched videos (so they don't have to be fetched again): {thumbFilename:videoDownloadLink, ....} (could reach limit faster)
         Saved video links are search based on the thumbnail filename (that on page vs saved)
    Photos are downloaded from their src attribute of the <img> element on page (since that seems to be the highest quality one) */

    let BTNS_WRAPPER_HTML_CLASS_STR = "hishtnikBtnsWrapper", BTN_HTML_CLASS_STR = `hishtnikBtn`, DOWNL_VIDEO_BTN_HTML_CLASS_STR = `hishtnikDownlVidBtn`, DOWNL_PHOTO_BTN_HTML_CLASS_STR = `hishtnikDownlPhotoBtn`, DOWNL_THUMB_BTN_HTML_CLASS_STR = `hishtnikDownlThumbBtn`, OPEN_THUMB_BTN_HTML_CLASS_STR = `hishtnikOpenThumbBtn`;
    let POST_MEDIA_ELEMS_CSS_SELECTOR_STR = `video, div[role="button"] img[style="object-fit: cover;"]`, POST_OP_USERNAME_CSS_SELECTOR_STR = `.UE9AK .Jv7Aj.mArmR.MqpiF`;

    let STYLE_HTML_STR =
        `<style>
            /* Download / Open thumb buttons */
            .${BTNS_WRAPPER_HTML_CLASS_STR} {display: flex !important; width: 100%; flex-direction: row !important; justify-content: space-between; z-index:9999999; position:absolute !important; top:0;}
            .${BTN_HTML_CLASS_STR} {width: auto; cursor:pointer; padding:5px; font-weight:bold; color:#ff2d2d; background:black; border:1px solid;}
            /* add borders and background to albums labers (easier to see) */
            .CzVzU > div, ._aatp > div {padding: 5px !important;}
            .CzVzU > div, ._aatp > div, button[aria-label="Go Back"], button[aria-label="Next"] {background: #951111 !important; border: 2px solid #979085 !important;}
        </style`;

    let SAVED_VIDEO_DOWNL_LINKS_OBJ = {}, MAX_SAVED_VIDEO_LINKS_INT = 100;

    run();
    async function run()
    {
        document.querySelector("html").appendChild(str_to_html_elem(STYLE_HTML_STR));
        document.addEventListener("dblclick", (event)=>{event.stopPropagation(); event.preventDefault();}, true); // prevent double click like on post items
        document.addEventListener("click", click_handler);
        while(1==1) {if (window.location.href.match(/^.+\/p\/.+$/)) add_btns(); await delay(300);}
    }

    function add_btns()
    {
        let htmlMediaElemsInPost = document.querySelectorAll(POST_MEDIA_ELEMS_CSS_SELECTOR_STR);

        for (let htmlMediaElem of htmlMediaElemsInPost) {
            let htmlMediaElemWrapper = htmlMediaElem.parentElement; // the buttons wrapper elem will become a sibiling to the media elem
            if (htmlMediaElemWrapper.querySelector(`.${BTNS_WRAPPER_HTML_CLASS_STR}`)) continue; // already added
            let btnsHtmlStr = ``;
            if (htmlMediaElem.nodeName == "VIDEO") {
                btnsHtmlStr += `<button class="${BTN_HTML_CLASS_STR} ${DOWNL_VIDEO_BTN_HTML_CLASS_STR}">DOWNL VIDEO</button>`;
                btnsHtmlStr += `<button class="${BTN_HTML_CLASS_STR} ${DOWNL_THUMB_BTN_HTML_CLASS_STR}">DOWNL THUMB</button>`;
                btnsHtmlStr += `<button class="${BTN_HTML_CLASS_STR} ${OPEN_THUMB_BTN_HTML_CLASS_STR}">OPEN THUMB</button>`;
            }
            else if (htmlMediaElem.nodeName == "IMG") {
                btnsHtmlStr += `<button class="${BTN_HTML_CLASS_STR} ${DOWNL_PHOTO_BTN_HTML_CLASS_STR}">DOWNL PHOTO</button>`;
            }
            btnsHtmlStr = `<div class="${BTNS_WRAPPER_HTML_CLASS_STR}">` + btnsHtmlStr + `</div>`;
            htmlMediaElemWrapper.appendChild(str_to_html_elem(btnsHtmlStr));
        }
    }

    function click_handler(event)
    {
        if (!event.target.classList.contains(BTN_HTML_CLASS_STR)) return;
        let htmlBtnElemClicked = event.target;
        if (htmlBtnElemClicked.classList.contains(OPEN_THUMB_BTN_HTML_CLASS_STR)) open_thumb(htmlBtnElemClicked);
        else if (htmlBtnElemClicked.classList.contains(DOWNL_THUMB_BTN_HTML_CLASS_STR)) downl_img("thumb", htmlBtnElemClicked);
        else if (htmlBtnElemClicked.classList.contains(DOWNL_PHOTO_BTN_HTML_CLASS_STR)) downl_img("photo", htmlBtnElemClicked);
        else if (htmlBtnElemClicked.classList.contains(DOWNL_VIDEO_BTN_HTML_CLASS_STR)) downl_video(htmlBtnElemClicked);
    }

    function open_thumb(htmlBtnElem)
    {
        let htmlMediaElemWrapper = htmlBtnElem.parentElement.parentElement;
        try {window.open(htmlMediaElemWrapper.querySelector("video").getAttribute("poster"))}
        catch(err) {alert("Failed to open thumbnail.")}
    }

    function downl_img(typeOfImgStr, htmlBtnElem)
    {
        let downlLinkStr;
        try {
            let htmlMediaElemWrapper = htmlBtnElem.parentElement.parentElement;
            downlLinkStr = (typeOfImgStr == "photo") ? htmlMediaElemWrapper.querySelector("img").src : htmlMediaElemWrapper.querySelector("video").poster;
        }
        catch(err) {alert("Couldn't get download link. Download failed."); return;}
        let authorStr = get_post_author();
        if (!authorStr) alert("Downloaded filename will not have the author's username due to an error. Please inform developer.");
        GM_download(downlLinkStr, generate_cust_filename(authorStr, downlLinkStr));
    }

    async function downl_video(htmlBtnElem)
    {
        let authorStr = get_post_author(); // author name is defined here first, in case the post is closed while fetching
        let targetVidThumbFilenameStr;
        try {targetVidThumbFilenameStr = get_filename_from_url(htmlBtnElem.parentElement.parentElement.querySelector("video").poster)}
        catch(err) {alert("Error initializing the video download process. Download failed."); return;}
        let downlLinkStr = SAVED_VIDEO_DOWNL_LINKS_OBJ[targetVidThumbFilenameStr] || await get_newly_fetched_download_link();
        if (!downlLinkStr) {alert("Error getting video download link. Download failed."); return;}
        if (!authorStr) alert("Downloaded filename will not have the author's username due to an error. Please inform developer.");
        GM_download(downlLinkStr, generate_cust_filename(authorStr, downlLinkStr));

        async function get_newly_fetched_download_link() {
            try {
                let fetchResponseObj = await fetch(window.location.href + "?__a=1");

                let postInfoObj = (await fetchResponseObj.json())["items"][0]; // get the data from the response and advance to the meaningful part
                let mediaInfosArr = postInfoObj["carousel_media"] || [postInfoObj]; // album test - if not, put it in array so you can loop

                for (let mediaInfoObj of mediaInfosArr) {
                    try {
                        let videoSrcStr = mediaInfoObj["video_versions"][0]["url"]; // the first version seems to be the highest quality one
                        let thumbFilenameStr = get_filename_from_url(mediaInfoObj["image_versions2"]["candidates"][0]["url"]);
                        if (Object.keys(SAVED_VIDEO_DOWNL_LINKS_OBJ).length == MAX_SAVED_VIDEO_LINKS_INT) delete SAVED_VIDEO_DOWNL_LINKS_OBJ[Object.keys(SAVED_VIDEO_DOWNL_LINKS_OBJ)[0]];
                        SAVED_VIDEO_DOWNL_LINKS_OBJ[thumbFilenameStr] = videoSrcStr;
                    }
                    catch(err){}
                }

                return SAVED_VIDEO_DOWNL_LINKS_OBJ[targetVidThumbFilenameStr];
            }
            catch(err) {return false}
        }
    }

    function delay(durationMs) {return new Promise(resolve => setTimeout(resolve, durationMs));}
    function get_post_author()
    {
        if (document.title.includes("@")) { // within profile
            try {return document.title.split("@").pop().split(")")[0].split(" ")[0]}
            catch(err) {return ""}
        }
        else { // individual post opened
            try {return document.querySelector(POST_OP_USERNAME_CSS_SELECTOR_STR).innerText.trim()}
            catch(err) {return ""}
        }
    }
    function generate_cust_filename(authorStr, downlLinkStr)
    {
        if (authorStr) authorStr += "_";
        return authorStr + get_filename_from_url(downlLinkStr);
    }
    function get_filename_from_url(url)
    {
        let filename = url.split("?")[0].split("/").pop();
        return filename.replace(/\.jpg\.webp$|\.webp$/, ".jpg"); // change .webp to .jpg. Also helps with inconsistencies between fetched thumb and thumbs on page
    }
    function str_to_html_elem(str)
    {
        let htmlWrapperElem = document.createElement("div");
        htmlWrapperElem.innerHTML = str;
        if (htmlWrapperElem.childElementCount == 1) htmlWrapperElem = htmlWrapperElem.firstChild; // only keep the wrapper if there are multiple direct children
        return htmlWrapperElem;
    }
})();