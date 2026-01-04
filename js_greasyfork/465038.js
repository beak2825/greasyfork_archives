// ==UserScript==
// @name         YouTube Anti-Shorts Script (modified)
// @namespace    https://greasyfork.org/en/users/933798
// @version      1.0.1
// @description  A YouTube script that replaces shorts links with regular videos. (based on both Anti-Shorts script and shorts redirect)
// @author       YukisCoffee and Fuim (Modified by xX_LegendCraftd_Xx)
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465038/YouTube%20Anti-Shorts%20Script%20%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465038/YouTube%20Anti-Shorts%20Script%20%28modified%29.meta.js
// ==/UserScript==
// Add shorts redirect code (works on all browsers that lacks JavaScript ES11 support)
var oldHref = document.location.href;
if (window.location.href.indexOf('youtube.com/shorts') > -1) {
    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('youtube.com/shorts') > -1) {
                    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
                }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};

// Fully replace shorts links with regular videos
/**
 * Shorts URL redirect.
 *
 * This is called on initial visit only. Successive navigations
 * are managed by modifying the YouTube Desktop application.
 */
(function(){

/** @type {string} */
var path = window.location.pathname;

if (0 == path.search("/shorts"))
{
    // Extract the video ID from the shorts link and redirect.

    /** @type {string} */
    var id = path.replace(/\/|shorts|\?.*/g, "");

    window.location.replace("https://www.youtube.com/watch?v=" + id);
}

})();

/**
 * YouTube Desktop Shorts remover.
 *
 * If the initial URL was not a shorts link, traditional redirection
 * will not work. This instead modifies video elements to replace them with
 * regular links.
 */
(function(){

/**
 * @param {string} selector (CSS-style) of the element
 * @return {Promise<Element>}
 */
async function querySelectorAsync(selector)
{
    while (null == document.querySelector(selector))
    {
        // Pause for a frame and let other code go on.
        await new Promise(r => requestAnimationFrame(r));
    }

    return document.querySelector(selector);
}

/**
 * Small toolset for interacting with the Polymer
 * YouTube Desktop application.
 *
 * @author Taniko Yamamoto <kirasicecreamm@gmail.com>
 * @version 1.0
 */
class YtdTools
{
    /** @type {string} Page data updated event */
    static EVT_DATA_UPDATE = "yt-page-data-updated";

    /** @type {Element} Main YT Polymer manager */
    static YtdApp;

    /** @type {bool} */
    static hasInitialLoaded = false;

    /** @return {Promise<bool>} */
    static async isPolymer()
    {
        /** @return {Promise<void>} */
        function waitForBody() // nice hack lazy ass
        {
            return new Promise(r => {
                document.addEventListener("DOMContentLoaded", function a(){
                    document.removeEventListener("DOMContentLoaded", a);
                    r();
                });
            });
        }

        await waitForBody();

        if ("undefined" != typeof document.querySelector("ytd-app"))
        {
            this.YtdApp = document.querySelector("ytd-app");
            return true;
        }
        return false;
    }

    /** @async @return {Promise<void|string>} */
    static waitForInitialLoad()
    {
        var updateEvent = this.EVT_DATA_UPDATE;
        return new Promise((resolve, reject) => {
            if (!this.isPolymer())
            {
                reject("Not Polymer :(");
            }

            function _listenerCb()
            {
                document.removeEventListener(updateEvent, _listenerCb);
                resolve();
            }

            document.addEventListener(updateEvent, _listenerCb);
        });
    }

    /** @return {string} */
    static getPageType()
    {
        return this.YtdApp.data.page;
    }
}

class ShortsTools
{
    /** @type {MutationObserver} */
    static mo = new MutationObserver(muts => {
        muts.forEach(mut => {
            Array.from(mut.addedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    this.onMutation(node);
                }
            });
        });
    });

    /** @return {void} */
    static watchForShorts()
    {
        /*
        this.mo.observe(YtdTools.YtdApp, {
            childList: true,
            subtree: true
        });
        */
        var me = this;
        YtdTools.YtdApp.arrive("ytd-video-renderer, ytd-grid-video-renderer", function() {
            me.onMutation(this);

            // This is literally the worst hack I ever wrote, but it works ig...
            (new MutationObserver(function(){
                if (me.isShortsRenderer(this))
                {
                    me.onMutation(this);
                }
            }.bind(this))).observe(this, {"subtree": true, "childList": true, "characterData": "true"});
        });
    }

    /** @return {void} */
    static stopWatchingForShorts()
    {
        this.mo.disconnect();
    }

    /**
     * @param {HTMLElement} node
     * @return {void}
     */
    static onMutation(node)
    {
        if (node.tagName.search("VIDEO-RENDERER") > -1 && this.isShortsRenderer(node))
        {
            this.transformShortsRenderer(node);
        }
    }

    /** @return {bool} */
    static isShortsRenderer(videoRenderer)
    {
        return "WEB_PAGE_TYPE_SHORTS" == videoRenderer?.data?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.webPageType;
    }

    /** @return {string} */
    static extractLengthFromA11y(videoData)
    {
        // A11y = {title} by {creator} {date} {*length*} {viewCount} - play Short
        // tho hopefully this works in more than just English
        var a11yTitle = videoData.title.accessibility.accessibilityData.label;

        var publishedTimeText = videoData.publishedTimeText.simpleText;
        var viewCountText = videoData.viewCountText.simpleText;

        var isolatedLengthStr = a11yTitle.split(publishedTimeText)[1].split(viewCountText)[0]
            .replace(/\s/g, "");

        var numbers = isolatedLengthStr.split(/\D/g);

        var string = "";

        // Remove all empties before iterating it
        for (var i = 0; i < numbers.length; i++)
        {
            if ("" === numbers[i])
            {
                numbers.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < numbers.length; i++)
        {
            // Lazy 0 handling idc im tired
            if (1 == numbers.length)
            {
                string += "0:";
                if (1 == numbers[i].length)
                {
                    string += "0" + numbers[i];
                }
                else
                {
                    string += numbers[i];
                }

                break;
            }

            if (0 != i) string += ":";
            if (0 != i && 1 == numbers[i].length) string += "0";
            string += numbers[i];
        }

        return string;
    }

    /**
     * @param {HTMLElement} videoRenderer
     * @return {void}
     */
    static transformShortsRenderer(videoRenderer)
    {

        /** @type {string} */
        var originalOuterHTML = videoRenderer.outerHTML;

        /** @type {string} */
        var lengthText = videoRenderer.data?.lengthText?.simpleText ?? this.extractLengthFromA11y(videoRenderer.data);

        /** @type {string} */
        var lengthA11y = videoRenderer.data?.lengthText?.accessibility?.accessibilityData?.label ?? "";

        /** @type {string} */
        var originalHref = videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.url;
        var href = "/watch?v=" + originalHref.replace(/\/|shorts|\?.*/g, "");

        var reelWatchEndpoint = videoRenderer.data.navigationEndpoint.reelWatchEndpoint;

        var i;
        videoRenderer.data.thumbnailOverlays.forEach((a, index) =>{
            if ("thumbnailOverlayTimeStatusRenderer" in a)
            {
                i = index;
            }
        });

        // Set the thumbnail overlay style
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.style = "DEFAULT";

        delete videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.icon;

        // Set the thumbnail overlay text
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.text.simpleText = lengthText;

        // Set the thumbnail overlay accessibility label
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.text.accessibility.accessibilityData.label = lengthA11y;

        // Set the navigation endpoint metadata (used for middle click)
        videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.webPageType = "WEB_PAGE_TYPE_WATCH";
        videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.url = href;

        videoRenderer.data.navigationEndpoint.watchEndpoint = {
            "videoId": reelWatchEndpoint.videoId,
            "playerParams": reelWatchEndpoint.playerParams,
            "params": reelWatchEndpoint.params
        };
        delete videoRenderer.data.navigationEndpoint.reelWatchEndpoint;

        //var _ = videoRenderer.data; videoRenderer.data = {}; videoRenderer.data = _;

        // Sometimes the old school data cycle trick fails,
        // however this always works.
        var _ = videoRenderer.cloneNode();
        _.data = videoRenderer.data;
        for (var i in videoRenderer.properties)
        {
            _[i] = videoRenderer[i];
        }
        videoRenderer.insertAdjacentElement("afterend", _);
        videoRenderer.remove();
    }
}

/**
 * Sometimes elements are reused on page updates, so fix that
 *
 * @return {void}
 */
function onDataUpdate()
{
    var videos = document.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer");

    for (var i = 0, l = videos.length; i < l; i++) if (ShortsTools.isShortsRenderer(videos[i]))
    {
        ShortsTools.transformShortsRenderer(videos[i]);
    }
}

/**
 * I hope she makes lotsa spaghetti :D
 * @async @return {Promise<void>}
 */
async function main()
{
    // If not Polymer, nothing happens
    if (await YtdTools.isPolymer())
    {
        ShortsTools.watchForShorts();

        document.addEventListener("yt-page-data-updated", onDataUpdate);
    }
}

main();

})();
