// ==UserScript==
// @name  YouTube Auto Dislike
// @namespace  gqqnbig
// @match  https://www.youtube.com/*
// @grant  none
// @version  1.5
// @author  gqqnbig
// @description  Because YouTube no longer displays the number of dislikes, the scripts automatically dislike all videos. Wait 15 seconds to see the effect.
// @license  GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/436462/YouTube%20Auto%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/436462/YouTube%20Auto%20Dislike.meta.js
// ==/UserScript==


(function () {
    "use strict";

    //from https://github.com/Anarios/return-youtube-dislike/blob/main/Extensions/UserScript/Return%20Youtube%20Dislike.user.js
    const LIKED_STATE = "LIKED_STATE";
    const DISLIKED_STATE = "DISLIKED_STATE";
    const NEUTRAL_STATE = "NEUTRAL_STATE";

    let isShorts = () => location.pathname.startsWith("/shorts");


    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const height = innerHeight || document.documentElement.clientHeight;
        const width = innerWidth || document.documentElement.clientWidth;
        return (
            // When short (channel) is ignored, the element (like/dislike AND short itself) is
            // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
            !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= height &&
            rect.right <= width
        );
    }

    function getButtons() {
        if (isShorts()) {
            let elements = document.querySelectorAll("#like-button > ytd-like-button-renderer");
            for (let element of elements) {
                if (isInViewport(element)) {
                    return element;
                }
            }
        }
        if (document.getElementById("menu-container")?.offsetParent === null) {
            return (
                document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
                document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div")
            );
        } else {
            return document
                .getElementById("menu-container")
                ?.querySelector("#top-level-buttons-computed");
        }
    }

    function getDislikeButton() {
        if (getButtons().children[0].tagName ===
            "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER") {
            if (getButtons().children[0].children[1] === undefined) {
                return document.querySelector("#segmented-dislike-button");
            } else {
                return getButtons().children[0].children[1];
            }
        } else {
            if (getButtons().querySelector("segmented-like-dislike-button-view-model")) {
                const dislikeViewModel = getButtons().querySelector("dislike-button-view-model");
                return dislikeViewModel;
            } else {
                return getButtons().children[1];
            }
        }
    }

    function getLikeButton() {
        return getButtons().children[0].tagName ===
        "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
            ? document.querySelector("#segmented-like-button") !== null ? document.querySelector("#segmented-like-button") : getButtons().children[0].children[0]
            : getButtons().querySelector("like-button-view-model") ?? getButtons().children[0];
    }

    function isVideoLiked() {
        return getLikeButton().querySelector('button').getAttribute('aria-pressed') === 'true';
    }

    function isVideoDisliked() {
        return getDislikeButton().querySelector('button').getAttribute('aria-pressed') === 'true';
    }

    function getState() {
        if (isVideoLiked()) {
            return LIKED_STATE;
        }
        if (isVideoDisliked()) {
            return DISLIKED_STATE;
        }
        return NEUTRAL_STATE;
    }


    function isWatchPage() {
        return window.location.pathname.startsWith('/watch');
    }

    const observer = new MutationObserver((mutations) => {
        if (mutations.length > 0 && mutations[0].addedNodes.length > 0 && mutations[0].addedNodes[0].wholeText !== 'YouTube' &&
            isWatchPage()) {
            console.log('start unlike');
            // observer.disconnect(); // Stop observing temporarily

            setTimeout(() => {
                if (getState() === NEUTRAL_STATE) {
                    getDislikeButton().querySelector('button').click();
                }
            }, 15000);

            // observer.observe(head, config);
        }
    });

    // only watch the direct children
    const config = {childList: true};

    let head;
    let getTitleHandle = setInterval(() => {
        head = document.head.querySelector('title');
        if (head) {
            observer.observe(head, config);
            clearInterval(getTitleHandle);
        }
    }, 200);
})();
