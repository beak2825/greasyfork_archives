// ==UserScript==
// @name         YouTube - Add Playlist Remove Video Button
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  adds a remove button next to each video on each playlist page
// @copyright    2019-2021, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.0.2

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/youtube-add-watch-later-button.user.js
// @homepage     https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/youtube-add-watch-later-button.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Add_Playlist_Remove_Video_Button
// @homepage     https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Add_Playlist_Remove_Video_Button
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://www.youtube.com/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419655/YouTube%20-%20Add%20Playlist%20Remove%20Video%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/419655/YouTube%20-%20Add%20Playlist%20Remove%20Video%20Button.meta.js
// ==/UserScript==

// prevent eslint from complaining when redefining private function queryForElements from gist
// eslint-disable-next-line no-unused-vars
/* global onElementReady, queryForElements:true */

const STYLE_SCOPE = "style-scope"
const YT_ICON = "yt-icon"
const ZH_MARKER = "zh-delete-button"

/**
 * Query for new DOM nodes matching a specified selector.
 *
 * @override
 */
// @ts-ignore
queryForElements = (selector, _, callback) => {
  // search for elements by selector
  const elementList = document.querySelectorAll(selector) || []
  for (const element of elementList) {
    callback(element)
  }
}

/**
 * build the button el tediously but like the rest
 *
 * @param {HTMLElement} buttons - html node
 */
function addPlaylistVideoDeleteButton(buttons) {
  // noop if button already present
  if (buttons.querySelector(`.${ZH_MARKER}`)) {
    return
  }

  // normal action
  const container = document.createElement("div")

  container.id = "menu"
  container.className = `${STYLE_SCOPE} ytd-playlist-video-renderer ${ZH_MARKER}`
  buttons.append(container)

  const buttonContainer = document.createElement("yt-icon-button")
  buttonContainer.id = "button"
  buttonContainer.className = `dropdown-trigger ${STYLE_SCOPE} ytd-menu-renderer`
  container.append(buttonContainer)

  // wrapping button field automatically created
  const icon = document.createElement(YT_ICON)
  icon.className = `${STYLE_SCOPE} ytd-menu-renderer`
  buttonContainer.firstElementChild?.append(icon)

  // copy icon from triple dot menu
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
  svg.setAttribute("focusable", "false")
  svg.setAttribute("class", `${STYLE_SCOPE} ${YT_ICON}`)
  svg.setAttribute(
    "style",
    "pointer-events: none; display: block; width: 100%; height: 100%;",
  )
  icon.append(svg)

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
  g.setAttribute("class", `${STYLE_SCOPE} ${YT_ICON}`)
  svg.append(g)

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("class", `${STYLE_SCOPE} ${YT_ICON}`)
  path.setAttribute(
    "d",
    "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  )
  g.append(path)

  buttonContainer.addEventListener("click", () => {
    const overflowMenuButton = [...buttons.children].at(-2)?.firstElementChild
      ?.lastElementChild
    overflowMenuButton?.click()

    // allow the menu to be created before clicking (usually too quick to see)
    onElementReady(
      "#items > ytd-menu-service-item-renderer",
      { findOnce: false },
      (menuButton) => {
        // TODO: come up with i18n friendly solution
        if (menuButton.textContent?.includes("Remove from")) {
          menuButton.click()
        }
      },
    )
  })
}

// YouTube uses a bunch of duplicate 'id' tag values. why?
// this makes it much more likely to target right one, but at the cost of being brittle
onElementReady(
  "ytd-playlist-video-renderer.ytd-playlist-video-list-renderer",
  { findOnce: false },
  addPlaylistVideoDeleteButton,
)
