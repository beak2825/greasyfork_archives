// ==UserScript==
// @name         SuperPiP
// @namespace    https://github.com/tonioriol/userscripts
// @version      0.1.1
// @description  Enable native video controls with Picture-in-Picture functionality on any website
// @author       Toni Oriol
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%239C27B0%22%3E%3Cpath d=%22M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z%22/%3E%3C/svg%3E
// @grant        none
// @run-at       document-start
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/538178/SuperPiP.user.js
// @updateURL https://update.greasyfork.org/scripts/538178/SuperPiP.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[SuperPiP] Script started at", new Date().toISOString());
  console.log("[SuperPiP] Document readyState:", document.readyState);
  console.log("[SuperPiP] User agent:", navigator.userAgent);

  // Check if video is in viewport
  function isVideoInViewport(video) {
    const rect = video.getBoundingClientRect();
    const viewHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewHeight &&
      rect.right <= viewWidth &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  // Enhanced video setup for better UX
  function enableVideoControls(video) {
    // Always set controls, but only log if it's actually changing
    if (!video.hasAttribute("controls")) {
      console.log("[SuperPiP] Enabling controls for video:", video);
    }
    try {
      video.setAttribute("controls", "");

      // Set up enhanced functionality only once per video
      if (!video.hasAttribute("data-superpip-setup")) {
        video.setAttribute("data-superpip-setup", "true");

        // Auto-unmute when playing (counter Instagram's nasty muting)
        let videoShouldBeUnmuted = false;

        video.addEventListener("play", () => {
          videoShouldBeUnmuted = true;
          if (video.muted) {
            video.muted = false;
            console.log("[SuperPiP] Auto-unmuted video on play");
          }
        });

        video.addEventListener("pause", () => {
          videoShouldBeUnmuted = false;
        });

        // Override the muted property to prevent programmatic muting during playback
        const originalMutedDescriptor = Object.getOwnPropertyDescriptor(
          HTMLMediaElement.prototype,
          "muted"
        );
        if (originalMutedDescriptor) {
          Object.defineProperty(video, "muted", {
            get: function () {
              return originalMutedDescriptor.get.call(this);
            },
            set: function (value) {
              // If video is playing and something tries to mute it, prevent it
              if (value === true && videoShouldBeUnmuted && !this.paused) {
                console.log("[SuperPiP] Blocked attempt to mute playing video");
                return;
              }
              return originalMutedDescriptor.set.call(this, value);
            },
          });
        }

        // Smart autoplay: only autoplay if video is in viewport
        if (isVideoInViewport(video) && video.paused && video.readyState >= 2) {
          console.log("[SuperPiP] Autoplaying video in viewport");
          video.play().catch(() => {}); // Ignore autoplay policy errors
        }

        console.log("[SuperPiP] Enhanced video setup complete");
      }

      if (video.hasAttribute("controls")) {
        console.log("[SuperPiP] Controls enabled successfully for video");
      }
    } catch (error) {
      console.error("[SuperPiP] Error enabling controls:", error);
    }
    // set z-index to ensure it appears above other elements if position not relative
    // video.style.position = "absolute";
    // video.style.zIndex = "9999999999";
  }

  // Simple PoC: Detect elements positioned on top of video
  function detectVideoOverlays(video) {
    try {
      const videoRect = video.getBoundingClientRect();

      // Skip processing if video has no dimensions (not rendered yet) but don't log
      if (videoRect.width === 0 || videoRect.height === 0) {
        return [];
      }

      console.log("[SuperPiP] Detecting overlays for video:", video);
      const videoStyle = window.getComputedStyle(video);
      const videoZIndex = parseInt(videoStyle.zIndex) || 0;

      console.log("[SuperPiP] Video rect:", videoRect);
      console.log("[SuperPiP] Video zIndex:", videoZIndex);

      const overlays = [];
      const allElements = document.querySelectorAll("*");

      console.log(
        "[SuperPiP] Checking",
        allElements.length,
        "elements for overlays"
      );

      allElements.forEach((element) => {
        // Skip the video itself and its containers
        if (element === video || element.contains(video)) return;

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const zIndex = parseInt(style.zIndex) || 0;

        // element must be within video bounds AND positioned
        const isPositioned = ["absolute"].includes(style.position);
        const isOnTop = isPositioned && zIndex >= videoZIndex;
        const isWithinBounds =
          rect.left >= videoRect.left &&
          rect.right <= videoRect.right &&
          rect.top >= videoRect.top &&
          rect.bottom <= videoRect.bottom;
        const isVisible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0";

        if (isOnTop && isWithinBounds && isVisible) {
          overlays.push({
            element: element,
            tagName: element.tagName,
            classes: Array.from(element.classList),
            zIndex: zIndex,
          });

          console.log(
            "[SuperPiP] Hiding overlay element:",
            element.tagName,
            element.className
          );
          element.style.display = "none";
        }
      });

      console.log("[SuperPiP] Found", overlays.length, "overlays");
      return overlays;
    } catch (error) {
      console.error("[SuperPiP] Error detecting overlays:", error);
      return [];
    }
  }

  // Process all videos on the page
  function processVideos() {
    console.log("[SuperPiP] Processing videos...");
    const videos = document.querySelectorAll("video");
    console.log("[SuperPiP] Found", videos.length, "video elements");

    videos.forEach((video, index) => {
      console.log(
        "[SuperPiP] Processing video",
        index + 1,
        "of",
        videos.length
      );
      enableVideoControls(video);
      detectVideoOverlays(video);
    });
  }

  // Initialize and set up observers
  function init() {
    console.log("[SuperPiP] Initializing...");

    try {
      // Process any existing videos
      processVideos();

      // Set up mutation observer to watch for video elements and their changes
      console.log("[SuperPiP] Setting up mutation observer...");
      const observer = new MutationObserver((mutations) => {
        // Pre-filter: only process mutations that might involve videos
        let newVideoCount = 0;

        mutations.forEach((mutation) => {
          // Handle new nodes being added
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Element node
                if (node.tagName === "VIDEO") {
                  // Direct video element added
                  enableVideoControls(node);
                  detectVideoOverlays(node);
                  newVideoCount++;
                } else if (node.querySelector) {
                  // Check if added node contains video elements
                  const videos = node.querySelectorAll("video");
                  if (videos.length > 0) {
                    videos.forEach((video) => {
                      enableVideoControls(video);
                      detectVideoOverlays(video);
                    });
                    newVideoCount += videos.length;
                  }
                }
              }
            });
          }

          // Handle attribute changes on video elements
          if (
            mutation.type === "attributes" &&
            mutation.target.tagName === "VIDEO"
          ) {
            const video = mutation.target;

            // Re-enable controls if they were removed
            if (
              mutation.attributeName === "controls" &&
              !video.hasAttribute("controls")
            ) {
              console.log("[SuperPiP] Re-enabling removed controls");
              enableVideoControls(video);
            }

            // Re-process overlays for any video attribute change that might affect layout
            if (
              ["src", "style", "class", "width", "height"].includes(
                mutation.attributeName
              )
            ) {
              detectVideoOverlays(video);
            }
          }
        });

        // Only log when we actually processed videos
        if (newVideoCount > 0) {
          console.log("[SuperPiP] Processed", newVideoCount, "new videos");
        }
      });

      // Start observing - use document.documentElement if body doesn't exist yet
      const target = document.body || document.documentElement;
      console.log("[SuperPiP] Observing target:", target.tagName);

      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        // No attributeFilter - listen to all attributes but filter by video tagName in callback
      });

      console.log("[SuperPiP] Mutation observer set up successfully");

      // Handle video events for when videos start loading or playing
      console.log("[SuperPiP] Setting up video event listeners...");

      document.addEventListener(
        "loadstart",
        (e) => {
          if (e.target.tagName === "VIDEO") {
            console.log("[SuperPiP] Video loadstart event:", e.target);
            enableVideoControls(e.target);
            detectVideoOverlays(e.target);
          }
        },
        true
      );

      document.addEventListener(
        "loadedmetadata",
        (e) => {
          if (e.target.tagName === "VIDEO") {
            console.log("[SuperPiP] Video loadedmetadata event:", e.target);
            enableVideoControls(e.target);
            detectVideoOverlays(e.target);
          }
        },
        true
      );

      console.log("[SuperPiP] Event listeners set up successfully");
    } catch (error) {
      console.error("[SuperPiP] Error during initialization:", error);
    }
  }

  // iOS Safari specific handling (THIS IS WHAT ENABLES PIP ON YOUTUBE SPECIALLY)
  console.log("[SuperPiP] Setting up iOS Safari specific handling...");

  document.addEventListener(
    "touchstart",
    function initOnTouch() {
      console.log(
        "[SuperPiP] Touch event detected, setting up iOS PiP handling"
      );
      let v = document.querySelector("video");
      if (v) {
        console.log("[SuperPiP] Found video for iOS PiP setup:", v);
        v.addEventListener(
          "webkitpresentationmodechanged",
          (e) => {
            console.log("[SuperPiP] webkitpresentationmodechanged event:", e);
            e.stopPropagation();
          },
          true
        );
        // Remove the touchstart listener after we've initialized
        document.removeEventListener("touchstart", initOnTouch);
        console.log("[SuperPiP] iOS PiP handling set up successfully");
      } else {
        console.log("[SuperPiP] No video found for iOS PiP setup");
      }
    },
    true
  );

  // Start immediately since we're running at document-start
  console.log("[SuperPiP] Starting initialization...");
  init();
  console.log("[SuperPiP] Script initialization complete");
})();
