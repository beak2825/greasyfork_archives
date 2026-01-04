// ==UserScript==
// @name         YouTube Mute and Skip Ads
// @namespace    https://github.com/ion1/userscripts
// @version      31
// @author       ion
// @description  Mutes, blurs and skips ads on YouTube. Speeds up ad playback. Clicks "yes" on "are you there?" on YouTube Music.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepage     https://github.com/ion1/userscripts/tree/master/packages/youtube-mute-skip-ads
// @homepageURL  https://github.com/ion1/userscripts/tree/master/packages/youtube-mute-skip-ads
// @match        *://www.youtube.com/*
// @match        *://music.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/461341/YouTube%20Mute%20and%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/461341/YouTube%20Mute%20and%20Skip%20Ads.meta.js
// ==/UserScript==

// # YouTube Mute and Skip Ads: Change Log
//
// ## 31 2025-10-31
//
// - Include the change log in the script.
// - CSS: Add `.ytp-video-interstitial-buttoned-centered-layout__content` (a text ad in place of the video).
// - Import CSS with `?no-inline`. It seems to make the string use actual newlines again instead of `\n`.
//
// ## 0.0.30 2025-10-26
//
// - Skip shorts ads backwards if the user was moving backwards in the feed.
//
// ## 0.0.29 2025-10-26
//
// - Handle shorts ads ([PR #3](https://github.com/ion1/userscripts/pull/3), thanks [@sim6](https://github.com/sim6)!)
// - Replace Watcher with code that supports observing multiple matching elements.
//
//   Watcher only supported singular elements matching the selectors. However, sometimes there are more than one of them. Implement the observer code in a much simpler way at the expense of a more verbose API. It might be improved later.
//
// ## 0.0.28 2024-10-03
//
// - Add a missing `if (debugging)` around a `console.debug` call.
//   - TODO: Add logging functions which handle the prefix and the debug mode.
// - Add a build with debug logging.
// - Target modern browser versions when building, reducing polyfills in the output.
// - Use the `getPlaybackRate` method on the `#movie_player` element.
//
//   `video.playbackRate` may return 1 if an ad is played before the main video is loaded ([issue #2](https://github.com/ion1/userscripts/issues/2)).
//
// ## 0.0.27 2024-09-25
//
// - `.ytp-suggested-action-badge` popups are showing up on top of the video with a hidden dismiss button. Hide them using CSS rather than just blurring and trying to click on the button.
//
// ## 0.0.26 2024-09-02
//
// - Restore playback rate after ads.
//
// ## 0.0.25 2024-08-29
//
// - Resume playback at end of live video.
//
// ## 0.0.24 2024-08-27
//
// - Refrain from resuming playback if at the end.
//
// ## 0.0.23 2024-08-27
//
// - Watcher: Make onAdded callbacks return a possible onRemoved callback.
// - Watcher: In text/attr callbacks, distinguish empty value from disconnecting watcher.
// - Watcher: Also pass element to text/attr callbacks.
// - Wait for aria-hidden being removed from skip button.
// - CSS: Add `.ytp-ad-action-interstitial-slot`, `.ytp-ad-action-interstitial-background-container` (an image ad in place of the video).
// - Put all clicks behind a visibility check.
// - Add a popover on unclickable skip buttons.
// - Split `adUIAdded` into mute and speedup.
// - Use the `cancelPlayback` method on `#movie_player`.
//
// ## 0.0.22 2024-04-07
//
// - CSS: Hide `.ytp-suggested-action-badge`, `.ytp-visit-advertiser-link`.
//
// ## 0.0.21 2024-04-06
//
// - Fix CSS minification happening again.
// - Add new ad class: `.ytp-ad-player-overlay-layout__player-card-container`.
// - Add new ad player overlay class: `.ytp-ad-player-overlay-layout`.
// - Add new skip button class: `.ytp-skip-ad-button`.
//
// ## 0.0.20 2023-11-10
//
// - Handle new skip button class: `.ytp-ad-skip-button-modern`.
//
// ## 0.0.19 2023-11-07
//
// - Simplify the PostCSS output by using `:is(:hover, :focus-within)`.
// - CSS: Remove unnecessary prefers-reduced-motion handling.
//   Fading [shouldn't be a problem](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/#identifying-potentially-triggering-motion) with prefers-reduced-motion.
// - Close featured product overlay.
// - CSS: Hide `yts-merch-shelf-renderer`.
//
// ## 0.0.18 2023-04-08
//
// - New ad panel element: `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`.
//
// ## 0.0.17 2023-03-29
//
// - Detect skip button on non-video ads.
// - Disable ad counter-based reloading for now.
//
//   YouTube started behaving in a more annoying way on 2023-03-28 and repeatedly showing long ads after the reload.
//
// - Rather than reloading, speed up ad playback.
// - No need to unmute; the video element is replaced.
//
// ## 0.0.16 2023-03-27
//
// - Parser: Typo fix.
//
// ## 0.0.15 2023-03-27
//
// - Add a nicer object property parser.
// - Avoid end-of-video detection while live.
//
// ## 0.0.14 2023-03-24
//
// - Disable visibility checks.
//
//   YouTube Music will pause the music and wait until it gets focused to show the are-you-there dialog.
//
// ## 0.0.13 2023-03-22
//
// - Include `duration >= 1` in end-of-video check.
//
// ## 0.0.12 2023-03-20
//
// - `getMuteButton`: Also work on YouTube Music.
//
// ## 0.0.11 2023-03-20
//
// - Increase reload-canceled notification delay.
// - Reloader: Show a notification during end-of-video ads.
// - Adjust a log message and formatting.
//
// ## 0.0.10 2023-03-19
//
// - Do not reload if at the end of the video.
// - Watcher: Add attribute watchers.
// - Blur ad title and subtitle in YT Music.
// - Reloader: pause before reloading; handle canceled reloads.
// - Avoid reloading on YouTube Music; it messes up random playlists.
//
// ## 0.0.9 2023-03-16
//
// - Upload reload reason descriptions.
// - Blur `ytd-player-legacy-desktop-watch-ads-renderer`.
// - Replace ad-hoc observers with a Watcher class.
//   - Now uses IntersectionObserver to determine when the skip button becomes visible.
//   - Now takes both the remaining time indicator and the preskip countdown into account.
//
// ## 0.0.8 2023-03-11
//
// - Update the description.
//
// ## 0.0.7 2023-03-11
//
// - Prevent CSS minification.
//
// ## 0.0.6 2023-03-11
//
// - More robust ad badge parsing.
// - Display a post-reload notification as well.
// - Restore focused element (by ID, if any) after reloading.
//
// ## 0.0.5 2023-03-09
//
// - Overhaul logging.
// - Click "yes" on "are you there?" on YouTube Music.
//
// ## 0.0.4 2023-03-07
//
// - Parse ad badges in more languages.
//
// ## 0.0.3 2023-03-07
//
// - Update the description.
//
// ## 0.0.2 2023-03-06
//
// - Add a notification for when the video page is reloaded.
//
// ## 0.0.1 2023-03-05
//
// - Initial release.

(function () {
  'use strict';

  const d=new Set;const e = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  e(` /* Keep these in sync with the watchers. */
#movie_player
  :is(.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button) {
  anchor-name: --youtube-mute-skip-ads-unclickable-button;
}

body:has(
    #movie_player
      :is(
        .ytp-ad-skip-button,
        .ytp-ad-skip-button-modern,
        .ytp-skip-ad-button
      ):not([style*="display: none"], [aria-hidden="true"])
  )::after {
  /* The beginning of \`content\`: "youtube-mute-skip-ads" using the sans-serif bold characters. */
  content: "\u{1D606}\u{1D5FC}\u{1D602}\u{1D601}\u{1D602}\u{1D5EF}\u{1D5F2}-\u{1D5FA}\u{1D602}\u{1D601}\u{1D5F2}-\u{1D600}\u{1D5F8}\u{1D5F6}\u{1D5FD}-\u{1D5EE}\u{1D5F1}\u{1D600}\\A\\A"
    "Unfortunately, YouTube has started to block automated clicks based on isTrusted being false.\\A\\A"
    "Please click on the skip button manually.";
  white-space: pre-line;
  pointer-events: none;
  z-index: 9999;
  position: fixed;
  position-anchor: --youtube-mute-skip-ads-unclickable-button;
  padding: 1.5em;
  border-radius: 1.5em;
  margin-bottom: 1em;
  bottom: anchor(--youtube-mute-skip-ads-unclickable-button top);
  right: anchor(--youtube-mute-skip-ads-unclickable-button right);
  max-width: 25em;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 400;
  color: rgb(240 240 240);
  background-color: rgb(0 0 0 / 0.7);
  backdrop-filter: blur(10px);
  animation: fade-in 3s linear;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  67% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#movie_player.ad-showing video,
#shorts-player.ad-created video {
  filter: blur(100px) opacity(0.25) grayscale(0.5);
}

#movie_player.ad-showing .ytp-title,
#movie_player.ad-showing .ytp-title-channel,
.ytp-visit-advertiser-link,
.ytp-ad-visit-advertiser-button,
ytmusic-app:has(#movie_player.ad-showing)
  ytmusic-player-bar
  :is(.title, .subtitle) {
  filter: blur(4px) opacity(0.5) grayscale(0.5);
  transition: 0.05s filter linear;
}

:is(#movie_player.ad-showing .ytp-title,#movie_player.ad-showing .ytp-title-channel,.ytp-visit-advertiser-link,.ytp-ad-visit-advertiser-button,ytmusic-app:has(#movie_player.ad-showing) ytmusic-player-bar :is(.title,.subtitle)):is(:hover,:focus-within) {
    filter: none;
  }

/* These popups are showing up on top of the video with a hidden dismiss button
 * since 2024-09-25.
 */
.ytp-suggested-action-badge {
  visibility: hidden !important;
}

#movie_player.ad-showing .caption-window,
.ytp-ad-player-overlay-flyout-cta,
.ytp-ad-player-overlay-layout__player-card-container, /* Seen since 2024-04-06. */
.ytp-ad-action-interstitial-slot, /* Added on 2024-08-25. */
.ytp-video-interstitial-buttoned-centered-layout__content, /* Added on 2025-10-31. */
ytd-action-companion-ad-renderer,
ytd-display-ad-renderer,
ytd-ad-slot-renderer,
ytd-promoted-sparkles-web-renderer,
ytd-player-legacy-desktop-watch-ads-renderer,
ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
ytd-merch-shelf-renderer {
  filter: blur(10px) opacity(0.25) grayscale(0.5);
  transition: 0.05s filter linear;
}

:is(#movie_player.ad-showing .caption-window,.ytp-ad-player-overlay-flyout-cta,.ytp-ad-player-overlay-layout__player-card-container,.ytp-ad-action-interstitial-slot,.ytp-video-interstitial-buttoned-centered-layout__content,ytd-action-companion-ad-renderer,ytd-display-ad-renderer,ytd-ad-slot-renderer,ytd-promoted-sparkles-web-renderer,ytd-player-legacy-desktop-watch-ads-renderer,ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],ytd-merch-shelf-renderer):is(:hover,:focus-within) {
    filter: none;
  }

.ytp-ad-action-interstitial-background-container /* Added on 2024-08-25. */ {
  /* An image ad in place of the video. */
  filter: blur(10px) opacity(0.25) grayscale(0.5);
} `);

  const debugging = false;
  const logPrefix = "[youtube-mute-skip-ads]";
  function error(...args) {
    console.error(logPrefix, ...args);
  }
  function warn(...args) {
    console.warn(logPrefix, ...args);
  }
  function info(...args) {
    console.info(logPrefix, ...args);
  }
  function abortableSetTimeout(signal, callback, timeout) {
    if (signal?.aborted) return;
    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", clearThisTimeout);
      if (signal?.aborted) return;
      callback();
    }, timeout);
    function clearThisTimeout() {
      clearTimeout(timeoutId);
    }
    signal?.addEventListener("abort", clearThisTimeout, { once: true });
  }
  function abortableSetInterval(signal, callback, interval) {
    if (signal?.aborted) return;
    const intervalId = setInterval(() => {
      if (signal?.aborted) return;
      callback();
    }, interval);
    function clearThisInterval() {
      clearInterval(intervalId);
    }
    signal?.addEventListener("abort", clearThisInterval, { once: true });
  }
  function observeSelector({
    selector,
    matcher,
    root,
    name,
    signal,
    onAdded
  }) {
    root ??= document;
    matcher ??= selector;
    if (signal?.aborted) return;
    const abortControllerMap = new Map();
    function added(elem) {
      const abortController = new AbortController();
      abortControllerMap.set(elem, abortController);
      try {
        onAdded({ elem, signal: abortController.signal });
      } catch (err) {
        reportError(err);
      }
    }
    function removed(elem) {
      const abortController = abortControllerMap.get(elem);
      if (abortController) {
        abortControllerMap.delete(elem);
        abortController.abort();
      }
    }
    for (const elem of root.querySelectorAll(selector)) {
      if (elem.matches(matcher)) {
        added(elem);
      }
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          for (const elem of matchingElementsInTree({
            root: addedNode,
            selector,
            matcher
          })) {
            added(elem);
          }
        }
        for (const removedNode of mutation.removedNodes) {
          for (const elem of matchingElementsInTree({
            root: removedNode,
            selector,
            matcher
          })) {
            removed(elem);
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    signal?.addEventListener(
      "abort",
      () => {
        observer.disconnect();
        while (abortControllerMap.size > 0) {
          const elem = abortControllerMap.keys().next().value;
          removed(elem);
        }
      },
      { once: true }
    );
  }
  function* matchingElementsInTree({
    root,
    selector,
    matcher
  }) {
    if (!(root instanceof Element)) return;
    if (root.matches(matcher)) {
      yield root;
      return;
    }
    for (const descendant of root.querySelectorAll(selector)) {
      if (descendant.matches(matcher)) {
        yield descendant;
      }
    }
  }
  function observeVisible({
    elem,
    name,
    periodicCheckInterval,
    signal,
    onVisible
  }) {
    if (signal?.aborted) return;
    periodicCheckInterval ??= 1e4;
    let abortController = null;
    let checkVisiblePending = false;
    function checkVisible() {
      if (checkVisiblePending) return;
      checkVisiblePending = true;
      abortableSetTimeout(signal, () => {
        checkVisiblePending = false;
        checkVisibleImmediately();
      });
    }
    function checkVisibleImmediately() {
      const visible = isElementVisible(elem);
      if (visible && abortController === null) {
        abortController = new AbortController();
        try {
          onVisible({ elem, signal: abortController.signal });
        } catch (err) {
          reportError(err);
        }
      } else if (!visible && abortController !== null) {
        abortController.abort();
        abortController = null;
      }
    }
    checkVisibleImmediately();
    const observer = new MutationObserver(checkVisible);
    for (let ancestor = elem; ancestor !== null; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, {
        attributes: true,
        attributeFilter: ["style", "class"],
        subtree: false
      });
    }
    abortableSetInterval(signal, checkVisible, periodicCheckInterval);
    signal?.addEventListener(
      "abort",
      () => {
        observer.disconnect();
        abortController?.abort();
        abortController = null;
      },
      { once: true }
    );
  }
  function isElementVisible(elem) {
    for (let ancestor = elem; ancestor !== null; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || style.opacity === "0")
        return false;
    }
    return true;
  }
  function observeAttr({
    elem,
    name,
    attr,
    shouldGetAttr,
    signal,
    onChanged
  }) {
    shouldGetAttr ??= true;
    if (signal?.aborted) return;
    const observer = new MutationObserver((_mutations) => {
      onChanged({
        elem,
        attr,
        value: shouldGetAttr ? elem.getAttribute(attr) : null
      });
    });
    observer.observe(elem, {
      attributeFilter: [attr],
      attributes: true
    });
    signal?.addEventListener(
      "abort",
      () => {
        observer.disconnect();
      },
      { once: true }
    );
  }
  function observeHasClass({
    elem,
    name,
    className,
    signal,
    onAdded
  }) {
    if (signal?.aborted) return;
    let abortController = null;
    function change() {
      const elemHasClass = elem.classList.contains(className);
      if (abortController === null && elemHasClass) {
        abortController = new AbortController();
        try {
          onAdded({ elem, className, signal: abortController.signal });
        } catch (err) {
          reportError(err);
        }
      } else if (abortController !== null && !elemHasClass) {
        abortController.abort();
        abortController = null;
      }
    }
    observeAttr({
      elem,
      name,
      attr: "class",
      shouldGetAttr: false,
      signal,
      onChanged: change
    });
    signal?.addEventListener(
      "abort",
      () => {
        abortController?.abort();
        abortController = null;
      },
      { once: true }
    );
  }
  const videoSelector = "#movie_player video";
  const muteButtonSelector = ":is(.ytp-mute-button, ytdDesktopShortsVolumeControlsMuteIconButton, ytmusic-player-bar tp-yt-paper-icon-button.volume)";
  const shortsRendererSelector = "ytd-reel-video-renderer";
  const shortsVideoSelector = "#shorts-player video";
  const shortsUpButtonSelector = "#navigation-button-up button";
  const shortsDownButtonSelector = "#navigation-button-down button";
  function getVideoElement() {
    return getVideoElementBySelector(videoSelector);
  }
  function getShortsVideoElement() {
    return getVideoElementBySelector(shortsVideoSelector);
  }
  function getVideoElementBySelector(selector) {
    const videoElem = getHTMLElementBySelector(selector);
    if (!(videoElem instanceof HTMLVideoElement)) {
      error(
        "Expected",
        JSON.stringify(videoSelector),
        "to be a video element, got:",
        videoElem?.cloneNode(true)
      );
      return null;
    }
    return videoElem;
  }
  function getShortsUpButton() {
    return getHTMLElementBySelector(shortsUpButtonSelector);
  }
  function getShortsDownButton() {
    return getHTMLElementBySelector(shortsDownButtonSelector);
  }
  function getHTMLElementBySelector(selector) {
    for (const elem of document.querySelectorAll(selector)) {
      if (!(elem instanceof HTMLElement)) {
        error(
          "Expected",
          JSON.stringify(muteButtonSelector),
          "to be an HTML element, got:",
          elem.cloneNode(true)
        );
        continue;
      }
      return elem;
    }
    error("Failed to find", JSON.stringify(selector));
    return null;
  }
  function getShortsParentElement(elemWithinShort) {
    const shortsRenderer = elemWithinShort.closest(shortsRendererSelector);
    if (shortsRenderer == null) {
      return null;
    }
    return shortsRenderer.parentElement;
  }
  function callMoviePlayerMethod(name, onSuccess, args) {
    try {
      const movieElem = document.getElementById("movie_player");
      if (movieElem == null) {
        warn("movie_player element not found");
        return;
      }
      const method = Object.getOwnPropertyDescriptor(
        movieElem,
        name
      )?.value;
      if (method == null) {
        warn(`movie_player element has no ${JSON.stringify(name)} property`);
        return;
      }
      if (!(typeof method === "function")) {
        warn(
          `movie_player element property ${JSON.stringify(name)} is not a function`
        );
        return;
      }
      const result = method.apply(movieElem, args);
      if (onSuccess != null) {
        onSuccess(result);
      }
      return result;
    } catch (e) {
      warn(`movie_player method ${JSON.stringify(name)} failed:`, e);
      return;
    }
  }
  function disableVisibilityChecks() {
    for (const eventName of ["visibilitychange", "blur", "focus"]) {
      document.addEventListener(
        eventName,
        (ev) => {
          ev.stopImmediatePropagation();
        },
        { capture: true }
      );
    }
    document.hasFocus = () => true;
    Object.defineProperties(document, {
      visibilityState: { value: "visible" },
      hidden: { value: false }
    });
  }
  function main() {
    disableVisibilityChecks();
    const adPlayerOverlaySelectors = [
      ".ytp-ad-player-overlay",
      ".ytp-ad-player-overlay-layout"
];
    for (const adPlayerOverlaySelector of adPlayerOverlaySelectors) {
      observeSelector({
        selector: adPlayerOverlaySelector,
        name: adPlayerOverlaySelector,
        onAdded: adIsPlaying
      });
    }
    let previousShortsParent = null;
    let currentShortsParent = null;
    observeSelector({
      selector: "#shorts-player",
      name: "#shorts-player",
      onAdded({ elem: shortsRenderer, signal }) {
        const shortsParent = getShortsParentElement(shortsRenderer);
        if (shortsParent && shortsParent.isConnected) {
          if (shortsParent !== currentShortsParent?.deref()) {
            if (debugging) ;
            [previousShortsParent, currentShortsParent] = [
              currentShortsParent,
              new WeakRef(shortsParent)
            ];
          }
        } else {
          previousShortsParent = null;
          currentShortsParent = null;
        }
        let wentBackwards = false;
        if (previousShortsParent != null && currentShortsParent != null) {
          const previousShortsParentDeref = previousShortsParent.deref();
          const currentShortsParentDeref = currentShortsParent.deref();
          if (previousShortsParentDeref != null && currentShortsParentDeref != null) {
            const pos = previousShortsParentDeref.compareDocumentPosition(
              currentShortsParentDeref
            );
            if ((pos & Node.DOCUMENT_POSITION_DISCONNECTED) === 0 && (pos & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
              wentBackwards = true;
            }
            if (debugging) ;
          }
        }
        observeHasClass({
          elem: shortsRenderer,
          name: "#shorts-player",
          className: "ad-created",
          signal,
          onAdded() {
            shortsMuteAd();
          }
        });
        if (shortsRenderer.classList.contains("ad-created")) {
          shortsSkipAd({ signal, wentBackwards });
        }
      }
    });
    observeSelector({
      selector: "#movie_player",
      name: "#movie_player",
      onAdded({ elem: moviePlayer, signal }) {
        const adSkipButtonSelectors = [
          ".ytp-ad-skip-button",
          ".ytp-ad-skip-button-modern",
".ytp-skip-ad-button"
];
        for (const adSkipButtonSelector of adSkipButtonSelectors) {
          const name = `#movie_player ${adSkipButtonSelector}`;
          observeSelector({
            root: moviePlayer,
            selector: adSkipButtonSelector,
            name,
            signal,
            onAdded({ elem: button, signal: signal2 }) {
              observeVisible({
                elem: button,
                name,
                signal: signal2,
                onVisible({ signal: signal3 }) {
                  observeAttr({
                    elem: button,
                    name,
                    attr: "aria-hidden",
                    signal: signal3,
                    onChanged(ariaHidden) {
                      if (ariaHidden === null) {
                        click(button, `skip (${adSkipButtonSelector})`);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
    observeSelector({
      selector: ".ytp-ad-overlay-close-button",
      name: ".ytp-ad-overlay-close-button",
      onAdded({ elem: button, signal }) {
        observeVisible({
          elem: button,
          name: ".ytp-ad-overlay-close-button",
          signal,
          onVisible() {
            click(button, ".ytp-ad-overlay-close-button");
          }
        });
      }
    });
    observeSelector({
      selector: "ytmusic-you-there-renderer button",
      name: "are-you-there",
      onAdded({ elem: button, signal }) {
        observeVisible({
          elem: button,
          name: "are-you-there",
          signal,
          onVisible() {
            click(button, "are-you-there");
          }
        });
      }
    });
  }
  function adIsPlaying({ signal }) {
    info("An ad is playing, muting and speeding up");
    const video = getVideoElement();
    if (video == null) {
      return;
    }
    mute(video);
    speedup(video, signal);
    cancelPlayback(video, signal);
  }
  function shortsMuteAd() {
    info("A shorts ad is playing, muting");
    const video = getShortsVideoElement();
    if (video != null) {
      mute(video);
    }
  }
  function shortsSkipAd({
    signal,
    wentBackwards
  }) {
    info("A shorts ad is playing, skipping");
    const [direction, button] = wentBackwards ? ["up", getShortsUpButton()] : ["down", getShortsDownButton()];
    const video = getShortsVideoElement();
    if (video == null) return;
    if (button == null) {
      return;
    }
    oncePlaying({
      elem: video,
      signal,
      onWaiting() {
      },
      onPlaying() {
        click(button, `${direction} button`);
      }
    });
  }
  function mute(video) {
    video.muted = true;
  }
  function speedup(video, signal) {
    for (let rate = 16; rate >= 2; rate /= 2) {
      try {
        video.playbackRate = rate;
        break;
      } catch (e) {
      }
    }
    function onRemoved() {
      const originalRate = callMoviePlayerMethod("getPlaybackRate");
      if (originalRate == null || typeof originalRate !== "number" || isNaN(originalRate)) {
        warn(
          `Restoring playback rate failed:`,
          `unable to query the current playback rate, got: ${JSON.stringify(originalRate)}.`,
          `Falling back to 1.`
        );
        restorePlaybackRate(video, 1);
        return;
      }
      restorePlaybackRate(video, originalRate);
    }
    signal?.addEventListener("abort", onRemoved, { once: true });
  }
  function restorePlaybackRate(video, originalRate) {
    try {
      video.playbackRate = originalRate;
    } catch (e) {
    }
  }
  function cancelPlayback(video, signal) {
    function doCancelPlayback() {
      info("Attempting to cancel playback");
      callMoviePlayerMethod("cancelPlayback", () => {
        signal.addEventListener(
          "abort",
          () => {
            resumePlaybackIfNotAtEnd();
          },
          { once: true }
        );
      });
    }
    oncePlaying({
      elem: video,
      signal,
      onWaiting() {
      },
      onPlaying: doCancelPlayback
    });
  }
  function oncePlaying({
    elem,
    signal,
    onWaiting,
    onPlaying
  }) {
    if (elem.paused || elem.readyState < 3) {
      onWaiting?.();
      elem.addEventListener(
        "playing",
        () => {
          onPlaying();
        },
        { signal, once: true }
      );
    } else {
      onPlaying();
    }
  }
  function resumePlaybackIfNotAtEnd() {
    const currentTime = callMoviePlayerMethod("getCurrentTime");
    const duration = callMoviePlayerMethod("getDuration");
    const isAtLiveHead = callMoviePlayerMethod("isAtLiveHead");
    if (currentTime == null || duration == null || typeof currentTime !== "number" || typeof duration !== "number" || isNaN(currentTime) || isNaN(duration)) {
      warn(
        `movie_player methods getCurrentTime/getDuration failed, got time: ${JSON.stringify(currentTime)}, duration: ${JSON.stringify(duration)}`
      );
      return;
    }
    if (isAtLiveHead == null || typeof isAtLiveHead !== "boolean") {
      warn(
        `movie_player method isAtLiveHead failed, got: ${JSON.stringify(isAtLiveHead)}`
      );
      return;
    }
    const atEnd = duration - currentTime < 1;
    if (atEnd && !isAtLiveHead) {
      info(
        `Video is at the end (${currentTime}/${duration}), not attempting to resume playback`
      );
      return;
    }
    info("Attempting to resume playback");
    callMoviePlayerMethod("playVideo");
  }
  function click(elem, description) {
    if (!(elem instanceof HTMLElement)) return;
    if (elem.getAttribute("aria-hidden")) {
      info("Not clicking (aria-hidden):", description);
    } else {
      info("Clicking:", description);
      elem.click();
    }
  }
  main();

})();