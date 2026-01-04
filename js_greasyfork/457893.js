// ==UserScript==
// @name         Re-add Explore Tab + remove Shorts tab
// @version      1.2.1
// @description  This script re-adds the explore tab on YouTube, along with the removal of the 'Shorts' tab.
// @author       Magma_Craft
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/en/users/933798
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457893/Re-add%20Explore%20Tab%20%2B%20remove%20Shorts%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/457893/Re-add%20Explore%20Tab%20%2B%20remove%20Shorts%20tab.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

    function restoreTrending() {

        var trendingData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/explore",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEtrending"
                }
            },
            "icon": {
                "iconType": "EXPLORE"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Explore"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Explore"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;

        var miniguidetemplate = `<ytd-mini-guide-entry-renderer class="style-scope ytd-mini-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-mini-guide-entry-renderer:nth-child(2)`).data = trendingData;

    }


waitForElm("#items.ytd-guide-section-renderer").then((elm) => {
    restoreTrending();
});

waitForElm("#items.ytd-mini-guide-section-renderer").then((elm) => {
    restoreTrending();
});

// Remove 'Shorts' tab from sidebar (both guide and mini versions)
(function() {
ApplyCSS();
 
function ApplyCSS() {
var styles = document.createElement("style");
styles.innerHTML=`
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Shorts"] {
display: none !important;
}
a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer[title="Shorts"] {
display: none !important;
}

/* Remove 'Trending' tab */
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Trending"] {
display: none !important;
}`
document.head.appendChild(styles);
}
})();