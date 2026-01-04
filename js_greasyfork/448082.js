// ==UserScript==
// @name        Show Video Tags
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      BowDown097
// @description Shows YouTube video tags in the description.
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @homepageURL https://github.com/BowDown097/YT-Userscripts
// @downloadURL https://update.greasyfork.org/scripts/448082/Show%20Video%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/448082/Show%20Video%20Tags.meta.js
// ==/UserScript==

function createDescriptionSection(items, tags) {
    const sectionRenderer = document.createElement("ytd-video-description-course-section-renderer"); 
    sectionRenderer.className = "style-scope ytd-structured-description-content-renderer tags-section";
    items.appendChild(sectionRenderer);
    
    const title = sectionRenderer.querySelector("#title");
    const tagsString = tags.length ? tags.join(", ") : "None";
    title.innerHTML = `Tags: ${tagsString}`;
    title.style = "font-size: inherit; line-height: inherit; max-height: fit-content";
}

async function showTags() {
    if (window.location.pathname != "/watch")
        return;
    
    [...document.getElementsByClassName("tags-section")].forEach(e => e.remove());
    var tags = document.querySelector("ytd-app").data.playerResponse.videoDetails.keywords;
    if (!Array.isArray(tags))
        tags = new Array();
    
    const usingWatchMetadata = document.querySelector("ytd-watch-metadata")?.offsetParent !== null;
    const descContent = usingWatchMetadata
        ? document.querySelector("ytd-watch-metadata ytd-structured-description-content-renderer")
        : document.querySelector("ytd-video-secondary-info-renderer ytd-structured-description-content-renderer");
    descContent.removeAttribute("hidden");
    
    const usingPopoutExperiment = !usingWatchMetadata && descContent.hasAttribute("disable-upgrade");
    if (usingPopoutExperiment)
    {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]') === null) // check for manual disabling of experiment
        {
            descContent.removeAttribute("disable-upgrade");
            descContent.setAttribute("inline-structured-description", "");
            createDescriptionSection(descContent.querySelector("#items"), tags);
        }
        else
        {
            createDescriptionSection(document.querySelector("ytd-engagement-panel-section-list-renderer #items.ytd-structured-description-content-renderer"), tags);
        }
    }
    else
    {
        const descItems = descContent.querySelector("#items");
        if (descItems !== null) {
            descItems.removeAttribute("hidden");
            createDescriptionSection(descItems, tags);
        } else {
            const customItems = document.createElement("div");
            customItems.id = "items";
            customItems.className = "style-scope ytd-structured-description-content-renderer";
            if (usingWatchMetadata)
                descContent.appendChild(customItems);

            createDescriptionSection(customItems, tags);
        }
    }
} 

(function() {
    'use strict';
    window.addEventListener("yt-page-data-updated", showTags, false);
})();