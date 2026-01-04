// ==UserScript==
// @name         Reddit Media Downloader
// @namespace    http://tampermonkey.net/
// @version      0.84
// @description  Adds a download button to Reddit posts with images or videos.
// @author       Yukiteru
// @match        https://www.reddit.com/*
// @grant        GM_download
// @grant        GM_log
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530920/Reddit%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/530920/Reddit%20Media%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PROCESSED_MARKER_CLASS = "rmd-processed";
  const BUTTON_CLASSES =
    "button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm";
  const BUTTON_SPAN_CLASSES = "flex items-center";

  // --- Helper Functions ---

  function sanitizeFilename(name) {
    // Remove invalid filename characters and replace sequences of whitespace/underscores with a single underscore
    return name
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_")
      .substring(0, 150); // Limit length to avoid issues
  }

  function getOriginalImageUrl(previewUrl) {
    try {
      const url = new URL(previewUrl);

      const pathname = url.pathname;
      const lastHyphenIndex = pathname.lastIndexOf("-");
      const filename = pathname.slice(lastHyphenIndex + 1);

      return `https://i.redd.it/${filename}`;
    } catch (e) {
      GM_log(`Error during getOriginalImageUrl: ${e}`);
    }
  }

  function triggerDownload(url, filename) {
    GM_log(`Downloading: ${filename} from ${url}`);
    try {
      GM_download({
        url: url,
        name: filename,
        onerror: err => GM_log(`Download failed for ${filename}:`, err),
        // onload: () => GM_log(`Download started for ${filename}`), // Optional: Log success start
        // ontimeout: () => GM_log(`Download timed out for ${filename}`) // Optional: Log timeout
      });
    } catch (e) {
      GM_log(`GM_download error for ${filename}:`, e);
    }
  }

  // --- Core Logic ---

  function processPost(postElement) {
    if (!postElement || postElement.classList.contains(PROCESSED_MARKER_CLASS)) {
      GM_log("invalid element or already processed");
      return; // Already processed or invalid element
    }

    // Check for shadow root readiness - sometimes it takes a moment
    const buttonsContainer = postElement.shadowRoot?.querySelector(".shreddit-post-container");
    if (!buttonsContainer) {
      GM_log("Post shadowRoot not ready, will retry.");
      // Re-check shortly - avoids infinite loops if it never appears
      setTimeout(() => processPost(postElement), 250);
      return;
    }

    // Prevent adding multiple buttons if processing runs slightly delayed
    if (buttonsContainer.querySelector(".rmd-download-button")) {
      GM_log("Already processed, skipping");
      postElement.classList.add(PROCESSED_MARKER_CLASS); // Ensure marked
      return;
    }

    const postType = postElement.getAttribute("post-type");
    // GM_log(postType);

    let mediaUrls = [];

    // --- Media Detection ---
    switch (postType) {
      case "gallery":
        const galleryContainer = postElement.querySelector(
          'shreddit-async-loader[bundlename="gallery_carousel"]'
        );
        const galleryClone = galleryContainer.querySelector("gallery-carousel").cloneNode(true);
        const imageContainers = galleryClone.querySelectorAll("ul > li");
        imageContainers.forEach(container => {
          const image = container.querySelector("img");
          const imageSrc = image.src || image.getAttribute("data-lazy-src");
          console.log(imageSrc);
          const originalUrl = getOriginalImageUrl(imageSrc);
          if (originalUrl) mediaUrls.push({ url: originalUrl, type: "image" });
        });
        break;
      case "image":
        const imageContainer = postElement.querySelector("shreddit-media-lightbox-listener");
        const img = imageContainer.querySelector('img[src^="https://preview.redd.it"]');
        if (img) {
          const originalUrl = getOriginalImageUrl(img.src);
          if (originalUrl) mediaUrls.push({ url: originalUrl, type: "image" });
        }
        break;
      case "video":
        const videoContainer = postElement.querySelector(
          'shreddit-async-loader[bundlename="shreddit_player_2_loader"]'
        );
        const videoPlayer = videoContainer.querySelector("shreddit-player-2");
        // Need to wait for video player's shadow DOM and video tag if necessary
        const checkVideo = player => {
          if (!player.shadowRoot) {
            GM_log("Video player shadowRoot not ready, retrying...");
            setTimeout(() => checkVideo(player), 250);
            return;
          }
          const video = player.shadowRoot.querySelector("video");
          if (video && video.src) {
            // Prefer source tag if available and higher quality (heuristic)
            let bestSrc = video.src;
            const sources = player.shadowRoot.querySelectorAll("video > source[src]");
            if (sources.length > 0) {
              // Simple heuristic: assume last source might be better/direct mp4
              bestSrc = sources[sources.length - 1].src;
            }

            mediaUrls.push({ url: bestSrc, type: "video" });
            addDownloadButton(postElement, buttonsContainer, mediaUrls);
          } else if (video && !video.src) {
            GM_log("Video tag found but no src yet, retrying...");
            setTimeout(() => checkVideo(player), 500); // Wait longer for video src
          } else if (!video) {
            GM_log("Video tag not found in player shadowRoot yet, retrying...");
            setTimeout(() => checkVideo(player), 250);
          } else {
            // Video player exists but no media found after checks
            postElement.classList.add(PROCESSED_MARKER_CLASS);
          }
        };

        if (videoPlayer) {
          checkVideo(videoPlayer);
          // Button addition is handled inside checkVideo callback for videos
          return; // Stop further processing for this post until video is ready/checked
        }
    }

    // Add button immediately for images/galleries if URLs were found
    if (mediaUrls.length > 0 && (postType === "image" || postType === "gallery")) {
      addDownloadButton(postElement, buttonsContainer, mediaUrls);
    } else {
      // If no media found after checking all types, mark as processed
      postElement.classList.add(PROCESSED_MARKER_CLASS);
    }
  }

  function addDownloadButton(postElement, buttonsContainer, mediaUrls) {
    if (buttonsContainer.querySelector(".rmd-download-button")) return; // Double check

    // --- Get Title ---
    let title = "Reddit_Media"; // Default title

    // const article = postElement.closest("article");
    // const h1Title = document.querySelector("main h1"); // More specific for post pages

    const subredditName = postElement.getAttribute("subreddit-name");
    const postId = postElement.getAttribute("id").slice(3);
    const postTitle = postElement.getAttribute("post-title").slice(0, 20);

    title = `${subredditName}_${postId}_${postTitle.trim()}`;
    const cleanTitle = sanitizeFilename(title);

    // --- Create Button ---
    const downloadButton = document.createElement("button");
    downloadButton.className = `${BUTTON_CLASSES} rmd-download-button`; // Add our class
    downloadButton.setAttribute("name", "comments-action-button"); // Match existing buttons
    downloadButton.setAttribute("type", "button");

    const iconContainer = document.createElement("span");
    iconContainer.setAttribute("class", "flex text-16 mr-[var(--rem6)]");

    const buttonIcon = buttonsContainer
      .querySelector('svg[icon-name="downvote-outline"]')
      .cloneNode(true);
    iconContainer.appendChild(buttonIcon);
    downloadButton.appendChild(iconContainer);

    const buttonSpan = document.createElement("span");
    buttonSpan.className = BUTTON_SPAN_CLASSES;
    buttonSpan.textContent = "Download";

    downloadButton.appendChild(buttonSpan);

    // --- Add Click Listener ---
    downloadButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      mediaUrls.forEach((media, index) => {
        try {
          const url = media.url;
          // Skip blob URLs if we couldn't resolve them better earlier
          if (url.startsWith("blob:")) {
            GM_log(`Skipping download for unresolved blob URL: ${url} in post: ${cleanTitle}`);
            alert(
              `This video is in blob format which this script can't handle, try use a external method to download it.`
            );
            return;
          }

          const urlObj = new URL(url);
          let ext = urlObj.pathname.split(".").pop().toLowerCase();
          // Basic extension check/fix
          if (!ext || ext.length > 5) {
            // Basic check if extension extraction failed
            ext = media.type === "video" ? "mp4" : "jpg"; // Default extensions
          }
          // Refine extension for common image types if possible, keep original otherwise
          if (media.type === "image" && !["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
            // Check original URL from preview if it exists
            const originalExtMatch = url.match(/\.(jpe?g|png|gif|webp)(?:[?#]|$)/i);
            if (originalExtMatch) ext = originalExtMatch[1].toLowerCase();
            else ext = "jpg"; // Fallback image extension
          } else if (media.type === "video" && !["mp4", "mov", "webm"].includes(ext)) {
            ext = "mp4"; // Fallback video extension
          }

          let filename = `Reddit_${cleanTitle}`;
          if (mediaUrls.length > 1) {
            filename += `_${index + 1}`;
          }
          filename += `.${ext}`;

          triggerDownload(url, filename);
        } catch (e) {
          GM_log(`Error during download preparation for ${media.url}:`, e);
        }
      });
    });

    // --- Append Button ---
    // Insert after the comments button if possible, otherwise just append
    const shareButton = buttonsContainer.querySelector("[name='share-button']");
    shareButton.insertAdjacentElement("afterend", downloadButton);

    // Mark as processed AFTER button is successfully added
    postElement.classList.add(PROCESSED_MARKER_CLASS);
    GM_log("Added download button to post:", cleanTitle);
  }

  // --- Observer ---

  function handleMutations(mutations) {
    GM_log("Handle Mutations");
    let postsToProcess = new Set();

    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Case 1: A whole post element is added
            if (node.matches && node.matches("shreddit-post")) {
              postsToProcess.add(node);
            }
            // Case 2: Content *inside* a post is added (like async media)
            // Check if the added node is a media container itself
            else if (
              node.matches &&
              (node.matches('shreddit-async-loader[bundlename="post_detail_gallery"]') ||
                node.matches("gallery-carousel") ||
                node.matches("shreddit-media-lightbox-listener") ||
                node.matches("shreddit-player-2"))
            ) {
              const parentPost = node.closest("shreddit-post");
              if (parentPost) {
                postsToProcess.add(parentPost);
              }
            }
            // Case 3: Handle posts potentially nested within added nodes (e.g., inside articles in feeds)
            else if (node.querySelectorAll) {
              node.querySelectorAll("shreddit-post").forEach(post => postsToProcess.add(post));
            }
          }
        }
      }
    }
    // Process all unique posts found in this mutation batch
    postsToProcess.forEach(processPost);
  }

  function initObserver() {
    GM_log("Reddit Media Downloader initializing...");

    // Initial scan for posts already on the page
    document.querySelectorAll(`shreddit-post:not(.${PROCESSED_MARKER_CLASS})`).forEach(processPost);

    // Set up the observer
    const observer = new MutationObserver(handleMutations);
    const observerConfig = {
      childList: true,
      subtree: true,
    };

    // Observe the body, as posts can appear in feeds, main content, etc.
    observer.observe(document.body, observerConfig);

    GM_log("Reddit Media Downloader initialized and observing.");
  }

  initObserver();
})();
