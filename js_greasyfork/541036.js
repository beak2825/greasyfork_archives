// ==UserScript==
// @name            Youtube - Prevent mix/radio playlist in videos
// @namespace       https://greasyfork.org/users/821661
// @version         1.5.3
// @description     prevent mix/radio playlists in videos on youtube
// @author          hdyzen
// @run-at          document-body
// @match           https://*.youtube.com/*
// @grant           none
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/541036/Youtube%20-%20Prevent%20mixradio%20playlist%20in%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/541036/Youtube%20-%20Prevent%20mixradio%20playlist%20in%20videos.meta.js
// ==/UserScript==

const endpointMap = {
    // Home page
    "ytd-rich-item-renderer"(item) {
        const endpoint = item?.data?.content?.lockupViewModel?.rendererContext?.commandContext?.onTap?.innertubeCommand;
        cleanEndpoint(endpoint);
    },
    // Home/Watch/Search page
    "yt-lockup-view-model"(item) {
        const endpointSelect = item?.componentProps?.data()?.itemPlayback?.inlinePlayerData?.onSelect?.innertubeCommand;
        const endpointVisible = item?.componentProps?.data()?.itemPlayback?.inlinePlayerData?.onVisible?.innertubeCommand;
        const endpoint = item?.componentProps?.data()?.rendererContext?.commandContext?.onTap?.innertubeCommand;

        cleanEndpoint(endpointSelect);
        cleanEndpoint(endpointVisible);
        cleanEndpoint(endpoint);
    },
    // Watch/Search page
    "ytd-video-renderer"(item) {
        const endpointInline = item?.data?.inlinePlaybackEndpoint;
        const endpoint = item?.data?.navigationEndpoint;

        cleanEndpoint(endpointInline);
        cleanEndpoint(endpoint);
    },
    // Compability
    "ytd-compact-video-renderer"(thumb) {
        return thumb?.data?.navigationEndpoint;
    },
};

const itemsSelector = Object.keys(endpointMap).join(",");

const observer = new MutationObserver(() => {
    const nodes = document.querySelectorAll(itemsSelector);

    for (const node of nodes) {
        const contentType = node?.data?.contentType || node?.componentProps?.data()?.contentType;
        if (contentType === "LOCKUP_CONTENT_TYPE_PLAYLIST") {
            continue;
        }

        const prune = endpointMap[node.tagName.toLowerCase()];
        if (!prune) {
            continue;
        }
        prune(node);

        const links = node.querySelectorAll("a[href*='v='][href*='pp=']");
        if (!links.length) {
            continue;
        }
        cleanLinks(links);
    }
});
observer.observe(document.body, { childList: true, subtree: true });

function cleanLinks(links) {
    for (const link of links) {
        link.search = link.search.split("&")[0];
    }
}

function cleanEndpoint(endpoint) {
    if (!endpoint) {
        return;
    }
    endpoint.clickTrackingParams = "";

    const metadata = endpoint.commandMetadata?.webCommandMetadata;
    if (metadata) {
        metadata.url = metadata.url.split("&")[0];
    }

    const watch = endpoint.watchEndpoint;
    if (watch) {
        watch.params = "";
        watch.playerParams = "";
        watch.playlistId = "";
    }
}
