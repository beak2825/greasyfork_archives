// ==UserScript==
// @name         Fade out watched videos on youtube channel page
// @namespace    http://purespider.de/
// @version      1.1.0
// @description  Fades out watched videos on a youtube channel's video page
// @author       PureSpider
// @match        https://www.youtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391655/Fade%20out%20watched%20videos%20on%20youtube%20channel%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/391655/Fade%20out%20watched%20videos%20on%20youtube%20channel%20page.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

var fade = node => {
    var faded = false;

    node.data.thumbnailOverlays.forEach(e => {
        if ('thumbnailOverlayResumePlaybackRenderer' in e) {
            if (e.thumbnailOverlayResumePlaybackRenderer.percentDurationWatched > 98) {
                node.style.opacity = 0.2;

                faded = true;
            }
        }
    });

    if (!faded) {
        node.removeAttribute("style");
    }
};

var fadeInit = jNnode => {
    var node = jNnode[0];

    // Initially fade newly added elements
    fade(node);

    // Youtube reuses elements, so watch for target changes and re-fade
    new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(
            mr => {
                fade(mr.target.parentElement.parentElement.parentElement);
            }
        );
    }).observe(jNnode.find('ytd-thumbnail a')[0], {
        attributes: true,
        attributeFilter: [ "href" ]
    });
};

waitForKeyElements("ytd-section-list-renderer ytd-grid-renderer #items ytd-grid-video-renderer", fadeInit);
