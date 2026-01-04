// ==UserScript==
// @name         YouTube - Filter Subscriptions Page
// @namespace    https://zachhardesty.com
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  hide videos with given title keywords
// @copyright    2019-2024, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.1.0

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/youtube-filter-subscriptions-page.user.js
// @homepage     https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/youtube-filter-subscriptions-page.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Filter_Subscriptions_Page
// @homepage     https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Filter_Subscriptions_Page
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://www.youtube.com/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419657/YouTube%20-%20Filter%20Subscriptions%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/419657/YouTube%20-%20Filter%20Subscriptions%20Page.meta.js
// ==/UserScript==

/* global onElementReady */

const HIDDEN_CLASSNAME = "zh-hidden"

let keywords = GM_getValue("yt-filter-page", "")

const stylesheet = document.createElement("style")
const head = document.head || document.querySelectorAll("head")[0]
stylesheet.id = "hiding" // to edit later
stylesheet.type = "text/css"
stylesheet.append(
  document.createTextNode(`
  .zh-hidden {
    display: none !important;
  }
`),
)
head.append(stylesheet)

// runs on youtube.com/feed/subscriptions
onElementReady(
  "#dismissible.style-scope.ytd-grid-video-renderer",
  { findOnce: false },
  (el) => {
    const videoTitle = el
      .querySelector("#details #meta")
      .firstElementChild.textContent.toLowerCase()
    const parentContainer = el.parentElement

    for (const keyword of keywords.toLowerCase().split(",")) {
      if (keyword && videoTitle.includes(keyword)) {
        parentContainer.classList.add(HIDDEN_CLASSNAME)
        return
      }
    }

    parentContainer.classList.remove(HIDDEN_CLASSNAME)
  },
)

// runs on youtube.com
onElementReady(
  "#dismissible.style-scope.ytd-rich-grid-media",
  { findOnce: false },
  (el) => {
    const videoTitle = el
      .querySelector("#details #meta")
      .firstElementChild.textContent.toLowerCase()
    const parentContainer = el.parentElement.parentElement.parentElement

    for (const keyword of keywords.toLowerCase().split(",")) {
      if (keyword && videoTitle.includes(keyword)) {
        parentContainer.classList.add(HIDDEN_CLASSNAME)
        return
      }
    }

    parentContainer.classList.remove(HIDDEN_CLASSNAME)
  },
)

GM_registerMenuCommand("Set YT Filter Subscriptions Page Keywords", () => {
  // eslint-disable-next-line no-alert
  const val = prompt(
    "input a comma separated list of keywords (case insensitive)",
    keywords,
  )

  if (val !== null) {
    keywords = val
    GM_setValue("yt-filter-page", val)
  }
})
