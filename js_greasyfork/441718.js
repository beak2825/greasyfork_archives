// ==UserScript==
// @name         YouTube Shorts Redirect
// @version      2.0
// @description  Redirects /shorts/{videoId} -> /watch?v={videoId}
// @author       aubymori
// @match        www.youtube.com/*
// @namespace    aubymori.github.io
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441718/YouTube%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/441718/YouTube%20Shorts%20Redirect.meta.js
// ==/UserScript==

(function(){

// Softload

function redirectShorts(e) {
    if (e.detail.pageData.page == 'shorts') {
        var videoId = e.detail.pageData.endpoint.reelWatchEndpoint.videoId;
        document.querySelector('ytd-navigation-manager').dispatchEvent(
            new CustomEvent('yt-navigate', {
                'bubbles': true,
                'detail': {
                    'endpoint': {
                        'commandMetadata': {
                            'webCommandMetadata': {
                                'pageType': 'WEB_PAGE_TYPE_WATCH',
                                'url': '/watch?v=' + videoId
                            },
                        },
                        'watchEndpoint': {
                            'videoId': videoId
                        }
                    }
                }
            })
        );
        // Player dies for some reason
        document.getElementById('movie_player').loadVideoById(videoId);
    }
}

document.addEventListener('yt-page-data-fetched', redirectShorts);

// On initial load

if (window.location.pathname.search('/shorts/') > -1) {
    window.location.replace('https://www.youtube.com/watch?v=' + /[^/]*$/.exec(location.href));
}

})();