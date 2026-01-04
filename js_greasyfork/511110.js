// ==UserScript==
// @name         youtube crappy videos remover from the recommendations
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Remove YouTube videos with less than ~10,000 views from recommendations
// @author       NiceL (modified by Claude)
// @match        *://*.youtube.com/*
// @match        http://*.youtube.com/*
// @match        http://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511110/youtube%20crappy%20videos%20remover%20from%20the%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/511110/youtube%20crappy%20videos%20remover%20from%20the%20recommendations.meta.js
// ==/UserScript==

let g_VideosFiltering = true;
let g_ShortsFiltering = true;

function IsSubscriptions() {
  return location.pathname.startsWith("/feed/subscriptions");
}

function IsChannel() {
  return location.pathname.startsWith("/@");
}

function IsShorts() {
  return location.pathname.startsWith("/shorts");
}

function ParseViewCount(text) {
  const match = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/i);
  if (!match) return 0;

  let [, count, multiplier] = match;
  count = parseFloat(count.replace(/,/g, ''));

  switch (multiplier.toUpperCase()) {
    case 'K': return count * 1000;
    case 'M': return count * 1000000;
    case 'B': return count * 1000000000;
    default: return count;
  }
}

function IsBadVideo(videoViews) {
  if (!videoViews) {
    return false;
  }

  let text = videoViews.innerText;
  if (text.length === 0) {
    return false;
  }

  const viewCount = ParseViewCount(text);
  const isBadVideo = viewCount < 10000;

  if (isBadVideo) {
    console.log(`~BadVideo: '${text}' (${viewCount} views)`);
  }

  return isBadVideo;
}

function IsBadShortVideo(videoViews) {
  if (!videoViews) {
    return false;
  }

  let text = videoViews.innerText;
  if (text.length === 0) {
    return false;
  }

  const viewCount = ParseViewCount(text);
  const isBadVideo = viewCount < 10000;

  if (isBadVideo) {
    console.log(`~BadShortVideo: '${text}' (${viewCount} views)`);
  }

  return isBadVideo;
}

// The rest of the script remains the same...

function UpdateVideoFiltering() {
    let videosList;

    if (IsChannel() || IsSubscriptions()) {
        return;
    }

    if (IsShorts()) {
        if (g_ShortsFiltering) {
            // skip bad shorts
            videosList = document.getElementsByClassName("reel-video-in-sequence style-scope ytd-shorts");
            for (let i = 0; i < videosList.length; i++) {
                if (!videosList[i].isActive) {
                    continue;
                }

                let videoViews = videosList[i].getElementsByClassName("yt-spec-button-shape-with-label__label")[0];

                if (IsBadShortVideo(videoViews)) {
                    document.getElementsByClassName("navigation-button style-scope ytd-shorts")[1].getElementsByClassName("yt-spec-touch-feedback-shape__fill")[0].click(); // click to next video button (is it even stable lol?)
                }
            }
        }
    } else {
        if (g_VideosFiltering) {
            // delete videos from the right side
            videosList = document.getElementsByClassName("style-scope ytd-compact-video-renderer");
            for (let i = 0; i < videosList.length; i++) {
                let videoViews = videosList[i].getElementsByClassName("inline-metadata-item style-scope ytd-video-meta-block")[0];

                if (IsBadVideo(videoViews)) {
                    videosList[i].parentElement.remove();
                }
            }

            // delete videos from the main page
            videosList = document.getElementsByClassName("style-scope ytd-rich-item-renderer");
            for (let i = 0; i < videosList.length; i++) {
                if (videosList[i].id != "content") {
                    continue;
                }

                let videoViews = videosList[i].getElementsByClassName("inline-metadata-item style-scope ytd-video-meta-block")[0];

                if (IsBadVideo(videoViews)) {
                    videosList[i].parentElement.remove();
                }
            }
        }
    }
}

// Event listeners remain the same
document.addEventListener("yt-navigate-finish", (event) => {
    setTimeout(UpdateVideoFiltering, 350);
});

window.addEventListener("message", (event) => {
    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
    }
});

window.addEventListener("load", (event) => {
    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
    }
});

window.addEventListener("scrollend", (event) => {
    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 0);
    }
});

window.addEventListener("click", (event) => {
    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
    }
});