/* jshint esversion: 6 */
// ==UserScript==
// @name         YouTube autoskip
// @description  Automatically skip certain YouTube videos
// @version      1.1
// @match        https://*.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/608407
// @downloadURL https://update.greasyfork.org/scripts/405688/YouTube%20autoskip.user.js
// @updateURL https://update.greasyfork.org/scripts/405688/YouTube%20autoskip.meta.js
// ==/UserScript==

/**
 * Upon each 'yt-navigate-finish' event encountered on youtube.com
 * (which could be any of:
 *  - new page opened in browser (via link / bookmark / etc)
 *  - navigation on an already opened page* (this is not the same as above since YT is single-page), eg.:
 *    - clicking on a video in search results
 *    - video changed by autoplay
 * ),
 * do the following:
 * - look if the current video ID is on the blacklist (`skipVideoIDs`):
 *   -> if not, don't do anything -- everything's ok
 *   -> if yes, look if there is a "Next Video" button:
 *      -> if not, don't do anything -- we're not on a video (this _could_ happen, snice
 *         when checking if video is on the blacklist, we only check the query param `v`, nothing else)
 *      -> if yes:
 *         - register a mutation observer on the Next Video button (`a` element), because the button
 *           doesn't contain the `href` URL immediately after the 'yt-navigate-finish' event:
 *           -> in this observer, upon mutation of the Next Video button, check if the `href` URL is present
 *              -> if not, it means the URL is not loaded yet; the observer returns and will be invoked again
 *              -> if yes:
 *                 - disconnect the observer so it won't get invoked again (empiric observation:
 *                   the button is mutated multiple times on a single video, always with the same URL)
 *                 - check whether the Next Video URL is not the same as the current URL:
 *                   -> if yes, the observer is probably being invoked for the second time, having
 *                      aleady redirected on the first invocation (this shouldn't happen since the observer
 *                      disconnects itself upon finding URL; but there _may_ be a race condition)
 *                   -> if not, it means we are on a blacklisted video and we have a valid next video, so let's
 *                      get the FUCK OUT OF THIS ANNOYING BULLSHIT VIDEO THAT STUPID RETARDED YT KEEPS RECOMMENDING
 *
 *  (*) Staying on the same browser page means that this GreaseMonkey script will be invoked only *once*,
 *      when the page is opened in the browser. All subsequent navigation within the same page
 *     (clicking on search results / suggested videos, autoplay, etc.) will *not* invoke this script again.
 */


const skipVideoIDs = ['l0U7SxXHkPY'];

function shouldSkip() {
  const currURL = new URL(document.location);
  const currVideoID = currURL.searchParams.get('v');
  return skipVideoIDs.includes(currVideoID);
}


function installNextButtonObserver() {

  if (!shouldSkip()) {
    return;
  }

  const nextButtonA = document.getElementsByClassName('ytp-next-button')[0];
  if (!nextButtonA) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    // nextButtonA === mutations[0].target

    const nextVideoHref = nextButtonA.href;
    if (!nextVideoHref) {
      return;
    }

    observer.disconnect();

    if (nextVideoHref !== document.location.href) {
      document.location.replace(nextVideoHref);
    }
  });

  observer.observe(nextButtonA, {
    attributeFilter: ['href'],
    attributeOldValue: false,
    subtree: false,
  });
}

//window.addEventListener('yt-page-data-updated', installNextButtonObserver);
window.addEventListener('yt-navigate-finish', installNextButtonObserver);
