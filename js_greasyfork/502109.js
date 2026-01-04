// ==UserScript==
// @name         YouTube - Add Watch Later Button
// @namespace    https://greasyfork.org/en/users/826711-bartosz-petrynski
// @author       Bartosz Petrynski
// @description  Adds a new button next to like that quick adds / removes the active video from your "Watch later" playlist
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.0.1
// @match        https://www.youtube.com/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/502109/YouTube%20-%20Add%20Watch%20Later%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/502109/YouTube%20-%20Add%20Watch%20Later%20Button.meta.js
// ==/UserScript==

// Working as of 2024-07-29
// Based on https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Add_Watch_Later_Button
// Fix from https://greasyfork.org/en/scripts/419656-youtube-add-watch-later-button/discussions/229317
// prevent eslint from complaining when redefining private function queryForElements from gist
// eslint-disable-next-line no-unused-vars
/* global onElementReady, queryForElements:true */
/* eslint-disable no-underscore-dangle */

const BUTTONS_CONTAINER_ID = "top-level-buttons-computed"
const SVG_ICON_CLASS = "style-scope yt-icon"
const SVG_PATH_FILLED =
  "M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M14.97,16.95L10,13.87V7h2v5.76 l4.03,2.49L14.97,16.95z"
const SVG_PATH_HOLLOW =
  "M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"

/**
 * Query for new DOM nodes matching a specified selector.
 *
 * @override
 */
// @ts-ignore
queryForElements = (selector, _, callback) => {
  // Search for elements by selector
  const elementList = document.querySelectorAll(selector) || []
  for (const element of elementList) callback(element)
}

/**
 * Show notification toast
 * @param {string} message - Message to display in the notification
 */
function showNotification(message) {
  const notificationElement = document.querySelector('yt-notification-action-renderer')
  if (notificationElement) {
    const textElement = notificationElement.querySelector('#text')
    if (textElement) {
      textElement.textContent = message
    }
    const toastElement = notificationElement.querySelector('#toast')
    if (toastElement) {
      toastElement.removeAttribute('aria-hidden')
      toastElement.style.display = 'flex'
      setTimeout(() => {
        toastElement.setAttribute('aria-hidden', 'true')
        toastElement.style.display = 'none'
      }, 3000) // Hide after 3 seconds
    }
  }
}

/**
 * build the button el tediously but like the rest
 *
 * @param {HTMLElement} buttons - html node
 * @returns {Promise<void>}
 */
async function addButton(buttons) {
  const zh = document.querySelectorAll("#zh-wl")
  // noop if button already present in correct place
  if (zh.length === 1 && zh[0].parentElement.id === BUTTONS_CONTAINER_ID) return

  // YT hydration of DOM can shift elements
  if (zh.length >= 1) {
    console.debug("watch later button(s) found in wrong place, fixing")
    for (const wl of zh) {
      if (wl.id !== BUTTONS_CONTAINER_ID) wl.remove()
    }
  }

  // normal action
  console.debug("no watch later button found, adding new button")
  const playlistSaveButton = document.querySelectorAll(
    "dislike-button-view-model"
  )[0]

  // needed to force the node to load so we can determine if it's already in WL or not
  playlistSaveButton.click()

  /**
   * @typedef {HTMLElement & { buttonRenderer: boolean, isIconButton?: boolean, styleActionButton?: boolean }} ytdButtonRenderer
   */
  const container = /** @type {ytdButtonRenderer} */ (
    document.createElement("ytd-toggle-button-renderer")
  )

  const shareButtonContainer = buttons.children[1]

  container.className = shareButtonContainer.className // style-scope ytd-menu-renderer
  container.id = "zh-wl"
  buttons.append(container)

  const buttonContainer = document.createElement("button")
  // TODO: use more dynamic className
  buttonContainer.className =
    "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
  container.firstElementChild.append(buttonContainer)
  buttonContainer["aria-label"] = "Save to Watch Later"

  const iconContainer = document.createElement("div")
  // TODO: use more dynamic className
  iconContainer.className = "yt-spec-button-shape-next__icon"
  buttonContainer.append(iconContainer)

  const icon = document.createElement("yt-icon")
  buttonContainer.firstElementChild.append(icon)

  // copy icon from hovering video thumbnails
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
  svg.setAttribute("focusable", "false")
  svg.setAttribute("class", SVG_ICON_CLASS)
  svg.setAttribute(
    "style",
    "pointer-events: none; display: block; width: 100%; height: 100%;"
  )
  icon.append(svg)

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
  g.setAttribute("class", SVG_ICON_CLASS)
  svg.append(g)

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("class", SVG_ICON_CLASS)
  path.setAttribute("d", SVG_PATH_HOLLOW)
  g.append(path)

  const textContainer = document.createElement("div")
  buttonContainer.append(textContainer)
  // TODO: use more dynamic className
  textContainer.className =
    "cbox yt-spec-button-shape-next--button-text-content"

  const text = document.createElement("span")
  textContainer.append(text)
  // TODO: use more dynamic className
  text.className =
    "yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"
  text.textContent = "Later"

  container.addEventListener("click", async () => {
    const data = document
      .querySelector(`#above-the-fold #menu #${BUTTONS_CONTAINER_ID}`)
      .__dataHost.__data.items.find(
        (item) => item.menuServiceItemRenderer?.icon.iconType === "PLAYLIST_ADD"
      ).menuServiceItemRenderer

    const videoId = data.serviceEndpoint.addToPlaylistServiceEndpoint.videoId

    const SAPISIDHASH = await getSApiSidHash(
      document.cookie.split("SAPISID=")[1].split("; ")[0],
      window.origin
    )

    const isVideoInWatchLaterBeforeRequest = await isVideoInWatchLater()

    const action = isVideoInWatchLaterBeforeRequest
      ? "ACTION_REMOVE_VIDEO_BY_VIDEO_ID"
      : "ACTION_ADD_VIDEO"

    await fetch(`https://www.youtube.com/youtubei/v1/browse/edit_playlist`, {
      headers: {
        authorization: `SAPISIDHASH ${SAPISIDHASH}`,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION,
          },
        },
        actions: [
          {
            ...(isVideoInWatchLaterBeforeRequest
              ? { removedVideoId: videoId }
              : { addedVideoId: videoId }),
            action,
          },
        ],
        playlistId: "WL",
      }),
      method: "POST",
    })

    path.setAttribute(
      "d",
      isVideoInWatchLaterBeforeRequest ? SVG_PATH_HOLLOW : SVG_PATH_FILLED
    )

    // Show notification
    const notificationMessage = isVideoInWatchLaterBeforeRequest
      ? "Removed from Watch later"
      : "Saved to Watch later"
    showNotification(notificationMessage)
  })

  // TODO: fetch correct status on page load
  // path.setAttribute(
  //   "d",
  //   (await isVideoInWatchLater()) ? SVG_PATH_FILLED : SVG_PATH_HOLLOW
  // )
}

async function isVideoInWatchLater() {
  const data = document
    .querySelector(`#above-the-fold #menu #${BUTTONS_CONTAINER_ID}`)
    .__dataHost.__data.items.find(
      (item) => item.menuServiceItemRenderer?.icon.iconType === "PLAYLIST_ADD"
    ).menuServiceItemRenderer

  const videoId = data.serviceEndpoint.addToPlaylistServiceEndpoint.videoId

  const SAPISIDHASH = await getSApiSidHash(
    document.cookie.split("SAPISID=")[1].split("; ")[0],
    window.origin
  )

  const response = await fetch(
    `https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist`,
    {
      headers: { authorization: `SAPISIDHASH ${SAPISIDHASH}` },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION,
          },
        },
        excludeWatchLater: false,
        videoIds: [videoId],
      }),
      method: "POST",
    }
  )

  const json = await response.json()

  return (
    json.contents[0].addToPlaylistRenderer.playlists[0]
      .playlistAddToOptionRenderer.containsSelectedVideos === "ALL"
  )
}

/** @see https://gist.github.com/eyecatchup/2d700122e24154fdc985b7071ec7764a */
async function getSApiSidHash(SAPISID, origin) {
  function sha1(str) {
    return window.crypto.subtle
      .digest("SHA-1", new TextEncoder().encode(str))
      .then((buf) => {
        return Array.prototype.map
          .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
          .join("")
      })
  }

  const TIMESTAMP_MS = Date.now()
  const digest = await sha1(`${TIMESTAMP_MS} ${SAPISID} ${origin}`)

  return `${TIMESTAMP_MS}_${digest}`
}

// YouTube uses a bunch of duplicate 'id' tag values. why?
// this makes it much more likely to target right one, but at the cost of being brittle
onElementReady(
  `#above-the-fold #menu #${BUTTONS_CONTAINER_ID}`,
  { findOnce: false },
  addButton
)