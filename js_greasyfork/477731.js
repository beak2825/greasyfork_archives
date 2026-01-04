// ==UserScript==
// @name        Youtube Mobile-like Playlist Remove Video Button
// @license     MIT
// @namespace   rtonne
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @version     1.8
// @author      Rtonne
// @description Adds a button to remove videos from playlists just like on mobile
// @run-at      document-end
// @grant       GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/477731/Youtube%20Mobile-like%20Playlist%20Remove%20Video%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/477731/Youtube%20Mobile-like%20Playlist%20Remove%20Video%20Button.meta.js
// ==/UserScript==

GM.addStyle(`
ytd-playlist-video-renderer:hover .rtonne-youtube-playlist-delete-button {
  width: var(--yt-icon-width);
}
.rtonne-youtube-playlist-delete-button {
  width: 0;
  background-color: var(--yt-spec-additive-background);
  fill: var(--yt-spec-text-primary);
  border-width: 0;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}
.rtonne-youtube-playlist-delete-button:hover {
  background-color: var(--yt-spec-static-brand-red);
}
body.rtonne-youtube-playlist-delete-button-in-progress .rtonne-youtube-playlist-delete-button {
  pointer-events: none;
}
body.rtonne-youtube-playlist-delete-button-in-progress .rtonne-youtube-playlist-delete-button > div > svg {
  display: none !important;
}
/* From https://cssloaders.github.io */
body.rtonne-youtube-playlist-delete-button-in-progress .rtonne-youtube-playlist-delete-button > div {
  width: 24px;
  height: 24px;
  border: 3px solid var(--yt-spec-text-primary);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`);

let currentUrl = null;

const urlRegex = /^https:\/\/www.youtube.com\/playlist\?list=.*$/;

// Using observer to run script whenever the body changes
// because youtube doesn't reload when changing page
const observer = new MutationObserver(async () => {
  try {
    let newUrl = window.location.href;

    // Because youtube doesn't reload on changing url
    // we have to allow the whole website and check here if we are in a playlist
    if (!urlRegex.test(newUrl)) {
      return;
    }
    const elements = await waitForElements(
      document,
      "ytd-playlist-video-renderer",
    );

    // If the url is different we are in a different playlist
    // Or if the playlist length is different, we loaded more of the same playlist
    if (
      currentUrl === newUrl &&
      elements.length ===
        document.querySelectorAll(".rtonne-youtube-playlist-delete-button")
          .length
    ) {
      return;
    }

    currentUrl = newUrl;

    // If the list cannot be sorted, we assume we can't remove from it either
    if (
      !document.querySelector(
        "#header-container > #filter-menu > yt-sort-filter-sub-menu-renderer",
      )
    ) {
      return;
    }

    elements.forEach((element) => {
      // Youtube reuses elements, so we check if element already has a button
      if (element.querySelector(".rtonne-youtube-playlist-delete-button"))
        return;

      // ===========
      // Now we create the button and add it to each video
      // ===========

      const elementStyle = document.defaultView.getComputedStyle(element);
      const button = document.createElement("button");
      button.className = "rtonne-youtube-playlist-delete-button";
      button.style.height = elementStyle.height;
      button.style.borderRadius = `0 ${elementStyle.borderTopRightRadius} ${elementStyle.borderBottomRightRadius} 0`;
      button.append(getYoutubeTrashSvg());

      element.appendChild(button);

      button.onclick = async () => {
        document.body.classList.add(
          "rtonne-youtube-playlist-delete-button-in-progress",
        );

        // Click the 3 dot menu button on the video
        element.querySelector("button.yt-icon-button").click();

        const [popup] = await waitForElements(
          document,
          "tp-yt-iron-dropdown.ytd-popup-container:has(> div > ytd-menu-popup-renderer):not([style*='display: none;'])",
        );

        // Set the popup left to -10000px to hide it
        popup.style.left = "-10000px";

        const [popup_remove_button] = await waitForElements(
          popup,
          `ytd-menu-service-item-renderer:has(path[d="${getSvgPathD()}"])`,
        );
        await removeVideo(popup_remove_button, element);

        // In case of error and the popup doesn't hide
        document.body.click();
        document.body.classList.remove(
          "rtonne-youtube-playlist-delete-button-in-progress",
        );
      };
    });
  } catch (err) {
    console.error(err);
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// I couldn't check if we changed from an editable list to a non-editable list
// in the other observer, so I have this one to just do that and remove the buttons
const sortObserver = new MutationObserver(() => {
  if (!urlRegex.test(window.location.href)) {
    return;
  }
  if (
    !document.querySelector(
      "#header-container > #filter-menu > yt-sort-filter-sub-menu-renderer",
    )
  ) {
    document
      .querySelectorAll(".rtonne-youtube-playlist-delete-button")
      .forEach((element) => element.remove());
  }
});
sortObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

function getYoutubeTrashSvg() {
  const xmlns = "http://www.w3.org/2000/svg";
  const container = document.createElement("div");
  container.setAttribute("style", "height: 24px;");
  const svg = document.createElementNS(xmlns, "svg");
  svg.setAttribute("enable-background", "new 0 0 24 24");
  svg.setAttribute("height", "24");
  svg.setAttribute("width", "24");
  svg.setAttribute("viewbox", "0 0 24 24");
  svg.setAttribute("focusable", "false");
  svg.setAttribute(
    "style",
    "pointer-events: none;display: block;margin: auto;",
  );
  container.append(svg);
  const path = document.createElementNS(xmlns, "path");
  path.setAttribute("d", getSvgPathD());
  svg.append(path);
  return container;
}

// This function is separate to find the menu's remove button in the observer
function getSvgPathD() {
  return "M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z";
}

/**
 * Uses a MutationObserver to wait until the element we want exists.
 * This function is required because elements take a while to appear sometimes.
 * https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 * @param {HTMLElement} node The element being used for querySelector
 * @param {string} selector A string for node.querySelector describing the elements we want.
 * @returns {Promise<HTMLElement[]>} The list of elements found.
 */
function waitForElements(node, selector) {
  return new Promise((resolve) => {
    if (node.querySelector(selector)) {
      return resolve(node.querySelectorAll(selector));
    }

    const observer = new MutationObserver(() => {
      if (node.querySelector(selector)) {
        observer.disconnect();
        resolve(node.querySelectorAll(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributeFilter: ["style"], // This needs to be used because in this case the selector can depend on style
    });
  });
}
/**
 * Removes the video that the popup belongs to.
 * Will try multiple times because of errors like "Precondition check failed".
 * @param {HTMLElement} popup_remove_button The popup button that remove the video.
 * @param {HTMLElement} element The element that represents the video being removed.
 * @returns
 */
function removeVideo(popup_remove_button, element) {
  return new Promise((resolve) => {
    // Observer should trigger either when the element is removed
    // or an error notification appears
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        // disconnect and resolve don't immediately stop execution so return is also required
        return resolve();
      }
      popup_remove_button.click();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    popup_remove_button.click();
  });
}
