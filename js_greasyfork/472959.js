// ==UserScript==
// @name                youtube-shorts-open-in-player
// @version				0.2.0
// @namespace	        https://github.com/todeit02/youtube_shorts_open_in_player
// @description	        Adds a "watch" button to YouTube shorts for opening them as a regular YouTube video.
// @grant				GM.xmlHttpRequest
// @grant				GM_xmlhttpRequest
// @grant               GM.getResourceUrl
// @grant               GM_getResourceUrl
// @include				/^https:\/\/(?:www\.)?youtube\.com\/.*$/
// @resource            button https://raw.githubusercontent.com/todeit02/youtube_shorts_open_in_player/master/button.html
// @resource            buttonStyles https://raw.githubusercontent.com/todeit02/youtube_shorts_open_in_player/master/button.css
// @run-at              document-end
// @connect				*
// @downloadURL https://update.greasyfork.org/scripts/472959/youtube-shorts-open-in-player.user.js
// @updateURL https://update.greasyfork.org/scripts/472959/youtube-shorts-open-in-player.meta.js
// ==/UserScript==


"use strict";


(async () =>
{
    let locationObserver = null;

    window.addEventListener("DOMContentLoaded", async () =>
    {
        // Using custom observer because popstate does not fire.
        locationObserver = LocationChangeObserver(async location =>
        {
            const actionsBar = findCurrentActionsBar(location);
            if(!actionsBar.querySelector(".userscript-watch-button"))
            {
                const watchButtonUrl = createWatchUrlFromShortsUrl(location);
                insertWatchButtonIntoActionsBar(actionsBar, watchButtonUrl);
            }
        });
    
        let shortsContainerWasDisplayedBefore = false;
    
        let shortsContainer = null;
        const documentObserver = new MutationObserver(() =>
        {
            if(!shortsContainer) shortsContainer = document.querySelector("ytd-shorts");
            if(!shortsContainer) return;
    
            const shortsContainerIsDisplayed = (window.getComputedStyle(shortsContainer).display !== "none");
            if(shortsContainerIsDisplayed !== shortsContainerWasDisplayedBefore)
            {
                if(shortsContainerIsDisplayed) handleShortsContainerBecameDisplayed();
                else handleShortsContainerBecameHidden();
                shortsContainerWasDisplayedBefore = shortsContainerIsDisplayed;
            }
        });
        documentObserver.observe(window.document.body, { childList: true, subtree: true });
    });

    const watchButtonContainerTemplatePromise = loadWatchButtonContainerTemplate();
    
    const watchButtonStylesheetUrl = await GM.getResourceUrl("buttonStyles");
    insertWatchButtonStylesheet(watchButtonStylesheetUrl);

    
    async function handleShortsContainerBecameDisplayed()
    {
        const shareButtonContainer = await waitForShareButtonContainer();

        const watchButtonContainerTemplate = await watchButtonContainerTemplatePromise;
        const watchButtonUrl = createWatchUrlFromShortsUrl(location);
        insertWatchButton(shareButtonContainer, watchButtonContainerTemplate, watchButtonUrl);
    
        locationObserver.observe();
    }

    function handleShortsContainerBecameHidden()
    {
        locationObserver.disconnect();
    }


    async function waitForShareButtonContainer()
    {
        return new Promise((resolve, reject) =>
        {
            const domObserver = new MutationObserver(async mutations =>
            {
                // Watching all these mutations is not optimal yet.
        
                const addedNodes = mutations.flatMap(mutation => [...mutation.addedNodes]);
                const shareButtonExists = addedNodes.some(node => (node.nodeType === Node.ELEMENT_NODE) && node.closest("#share-button"));
                if(!shareButtonExists) return;
        
                domObserver.disconnect();
                
                const shareButtonContainer = document.querySelector("#actions #share-button");
                if(shareButtonContainer) resolve(shareButtonContainer);
                else reject();
            });
        
            domObserver.observe(document.querySelector("ytd-page-manager"), {
                childList: true,
                subtree: true,
            });
        });
    }


    async function insertWatchButtonIntoActionsBar(actionsBar, url)
    {
        const shareButtonContainer = actionsBar.querySelector("#share-button");

        const watchButtonContainerTemplate = await watchButtonContainerTemplatePromise;
        insertWatchButton(shareButtonContainer, watchButtonContainerTemplate, url);
    }


    async function loadWatchButtonContainerTemplate()
    {
        const buttonUrl = await GM.getResourceUrl("button");

        const buttonHtml = await gmFetch(buttonUrl);
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(buttonHtml, "text/html");

        return parsedDocument.querySelector("template")
    }


    function insertWatchButtonStylesheet(url)
    {
        const watchButtonCssLink = document.createElement("link");
        watchButtonCssLink.id = "userscript-watch-button-style";
        watchButtonCssLink.rel = "stylesheet";
        watchButtonCssLink.href = url;
        document.head.append(watchButtonCssLink);
    }


    function insertWatchButton(siblingShareButtonContainer, watchButtonContainerTemplate, url)
    {
        const shareButtonRenderer = siblingShareButtonContainer.querySelector("ytd-button-renderer");
        const shareButton = siblingShareButtonContainer.querySelector("button");

        const watchButtonContainer = watchButtonContainerTemplate.content.cloneNode(true).firstElementChild;
        const watchButton = watchButtonContainer.querySelector("a");

        watchButton.href = url.href;
        
        watchButtonContainer.style.paddingTop = window.getComputedStyle(shareButtonRenderer).paddingTop;
        watchButton.style.width = shareButton.scrollWidth + "px";
        watchButton.style.height = shareButton.scrollHeight + "px";
        watchButton.style.borderRadius = window.getComputedStyle(shareButton).borderRadius;
        
        siblingShareButtonContainer.insertAdjacentElement("afterend", watchButtonContainer);  
    }


    function createWatchUrlFromShortsUrl(shortsUrl)
    {
        const videoId = shortsUrl.pathname.split('/').at(-1);
        return createWatchUrlFromVideoId(videoId);
    }


    function createWatchUrlFromVideoId(videoId)
    {        
        const watchPageUrl = new URL("/watch", window.location.origin);
        watchPageUrl.searchParams.set("v", videoId);
        return watchPageUrl;
    }


    async function gmFetch(url)
    {
        return new Promise((resolve, reject) =>
        {
            GM.xmlHttpRequest({
                method: "GET",
                url,
                onload: response => resolve(response.responseText),
                onerror: response => reject(response.responseText),
            });
        });
    }


    function LocationChangeObserver(listener)
    {
        let previousUrl = null;
        let intervalId = null;

        function observe()
        {
            previousUrl = window.location.href;
            intervalId = window.setInterval(handleInterval, 100);
        }

        function disconnect()
        {
            if(intervalId != null) window.clearInterval(intervalId);
        }

        function handleInterval()
        {
            const currentLocation = window.location;
            const currentUrl = currentLocation.href;
            if(previousUrl === currentUrl) return;

            previousUrl = currentUrl;
            listener(currentLocation);
        }

        return {
            observe,
            disconnect,
        };
    }


    function findCurrentActionsBar(location)
    {
        return [...document.querySelectorAll("#actions")].find(actionsElement =>
        {
            const playerContainer = actionsElement.closest("ytd-reel-video-renderer")?.querySelector(".player-container");
            if(!playerContainer) return false;

            const playerContainerImageSrc = window.getComputedStyle(playerContainer).backgroundImage;
            const playerContainerImageUrl = /url\("(.*)"\)/.exec(playerContainerImageSrc)?.[1];
            if(!playerContainerImageUrl) return false;

            const playerContainerImageVideoId = playerContainerImageUrl.split('/').at(-2);
            const urlVideoId = location.pathname.split('/').at(-1);
            return (playerContainerImageVideoId === urlVideoId);
        });
    }
})();