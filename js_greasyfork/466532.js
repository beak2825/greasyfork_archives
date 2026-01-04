// ==UserScript==
// @name         Action Buttons Fix (modified)
// @version      1.2.0
// @description  Fixes watch action buttons to be like how they used to be! (this also includes reverting the 'Subscribed' notification icon before Dec '22)
// @author       xX_LegendCraftd_Xx
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/933798
// @license      MIT
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/466532/Action%20Buttons%20Fix%20%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466532/Action%20Buttons%20Fix%20%28modified%29.meta.js
// ==/UserScript==

const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};

function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;

    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;

            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }

            if (abtnconfig.noFlexibleItems) {
                for (var i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }

                delete actions.flexibleItems
            }
        }
    }

    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}

document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});

(function() {
let css = `
/* Additional fixes */
#actions.ytd-watch-metadata {
min-width: auto !important
}

ytd-watch-metadata[action-buttons-update-owner-width] #actions.ytd-watch-metadata {
min-width: 50% !important;
justify-content: flex-end !important
}

ytd-watch-metadata[action-buttons-update-owner-width] #owner.ytd-watch-metadata {
min-width: 50% !important;
margin-right: 0 !important
}

yt-button-view-model.ytd-menu-renderer .yt-spec-button-shape-next--size-m, ytd-download-button-renderer .yt-spec-button-shape-next--size-m, #loop-button > .yt-spec-button-shape-next--size-m {
margin-left: 8px !important
}

#flexible-item-buttons .ytd-menu-renderer, #top-level-buttons-computed yt-button-view-model.ytd-menu-renderer, ytd-download-button-renderer, ytd-button-renderer#loop-button {
margin-left: 0 !important
}

/* Revert classic 'Subscribed' notifcation icon */
yt-button-shape.style-scope.ytd-subscribe-button-renderer {
display: flex !important
}

yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el, .smartimation__content {
display: flex !important
}

#notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible], #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] {
pointer-events: auto;
visibility: visible;
position: static
}

#notification-preference-button > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m {
background-color: transparent !important;
border-radius: 16px !important;
padding-left: 14px !important;
padding-right: 2px !important;
margin-left: 4px !important
}

ytd-app:not(.yt-flexible-actions-view-model-wiz__action):not(.ytFlexibleActionsViewModelAction) #notification-preference-button .yt-spec-button-shape-next--button-text-content, #notification-preference-button .yt-spec-button-shape-next__secondary-icon, .yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing > .yt-spec-button-shape-next__button-text-content {
display: none !important
}

#buttons.ytd-c4-tabbed-header-renderer {
flex-direction: row-reverse !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
