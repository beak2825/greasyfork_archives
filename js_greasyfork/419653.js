// ==UserScript==
// @name         Reddit - Add Save Button
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  adds a save button to all comments everywhere & to posts in the saved section of your profile (https://www.reddit.com/user/USERNAME/saved/)
// @copyright    2019-2025, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.0.2

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/reddit-improve-saved-comments.user.js
// @homepage     https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/reddit-improve-saved-comments.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Reddit_-_Improve_Saved_Comments
// @homepage     https://openuserjs.org/scripts/zachhardesty7/Reddit_-_Improve_Saved_Comments
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://www.reddit.com/user/*/saved/*
// @match        https://www.reddit.com/r/*/comments/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419653/Reddit%20-%20Add%20Save%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/419653/Reddit%20-%20Add%20Save%20Button.meta.js
// ==/UserScript==

/* global onElementReady */

const ID_SAVE = "zh-save"

/**
 * @param {HTMLElement} overflowButton - triple dot more button under comments
 * @returns {HTMLButtonElement} save button
 */
function createSaveButton(overflowButton) {
  function toggleSaveButton() {
    const isSavedCurrent = svg.getAttribute("icon-name") === "save-fill"

    svg.setAttribute("icon-name", isSavedCurrent ? "save-outline" : "save-fill")
    path.setAttribute(
      "d",
      isSavedCurrent
        ? "M4.114 20A1.117 1.117 0 0 1 3 18.884V2.628A1.629 1.629 0 0 1 4.628 1h10.744A1.63 1.63 0 0 1 17 2.628v16.245a1.12 1.12 0 0 1-1.718.946L10 16.479l-5.291 3.346a1.11 1.11 0 0 1-.595.175Zm.514-17.75a.378.378 0 0 0-.378.378v16.009L10 15l5.75 3.636V2.628a.378.378 0 0 0-.378-.378H4.628Z"
        : "M15.372 1H4.628A1.629 1.629 0 0 0 3 2.628v16.256a1.113 1.113 0 0 0 1.709.941L10 16.479l5.282 3.34A1.12 1.12 0 0 0 17 18.873V2.628A1.63 1.63 0 0 0 15.372 1Z",
    )
    innerSpan2.textContent = isSavedCurrent ? "Save" : "Remove from saved"
  }

  const isSavedInitial =
    overflowButton.shadowRoot.querySelector("svg[icon-name='save-fill']") !== null

  const button = document.createElement("button")
  button.setAttribute("rpl", "")
  button.setAttribute(
    "class",
    "button border-md font-semibold text-12 button-plain-weak inline-flex items-center px-sm",
  )
  button.setAttribute(
    "style",
    "height: var(--size-button-sm-h); font: var(--font-button-sm)",
  )
  button.setAttribute("slot", "overflow")
  button.id = "zh-save"
  button.addEventListener("click", () => {
    overflowButton.shadowRoot.querySelector(".save-comment-menu-button > div").click()
  })

  const span = document.createElement("span")
  span.setAttribute("class", "flex items-center")
  button.append(span)

  const innerSpan1 = document.createElement("span")
  innerSpan1.setAttribute("class", "flex text-16 mr-[var(--rem6)]")
  span.append(innerSpan1)

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("rpl", "")
  // svg.setAttribute("aria-hidden", "true")
  svg.setAttribute("fill", "currentColor")
  svg.setAttribute("height", "16")
  svg.setAttribute("icon-name", isSavedInitial ? "save-fill" : "save-outline")

  svg.setAttribute("viewBox", "0 0 20 20")
  svg.setAttribute("width", "16")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  innerSpan1.append(svg)

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute(
    "d",
    isSavedInitial
      ? "M15.372 1H4.628A1.629 1.629 0 0 0 3 2.628v16.256a1.113 1.113 0 0 0 1.709.941L10 16.479l5.282 3.34A1.12 1.12 0 0 0 17 18.873V2.628A1.63 1.63 0 0 0 15.372 1Z"
      : "M4.114 20A1.117 1.117 0 0 1 3 18.884V2.628A1.629 1.629 0 0 1 4.628 1h10.744A1.63 1.63 0 0 1 17 2.628v16.245a1.12 1.12 0 0 1-1.718.946L10 16.479l-5.291 3.346a1.11 1.11 0 0 1-.595.175Zm.514-17.75a.378.378 0 0 0-.378.378v16.009L10 15l5.75 3.636V2.628a.378.378 0 0 0-.378-.378H4.628Z",
  )
  svg.append(path)

  const innerSpan2 = document.createElement("span")
  innerSpan2.textContent = isSavedInitial ? "Remove from saved" : "Save"
  span.append(innerSpan2)

  // const screenReaderContent = document.createElement("faceplate-screen-reader-content")
  // screenReaderContent.textContent = " save "
  // button.append(screenReaderContent)

  overflowButton.shadowRoot
    .querySelector(".save-comment-menu-button > div")
    .addEventListener("click", () => {
      toggleSaveButton()
    })

  return button
}

/**
 * add features to comments
 *
 * @param {HTMLElement} overflowButton - triple dot more button under comments
 */
function improveComments(overflowButton) {
  const zh = overflowButton.parentElement.querySelectorAll(`#${ID_SAVE}`)
  // noop if button already present in correct place
  if (zh.length === 1 && zh[0].parentElement.getAttribute("slot") === "actionRow") {
    return
  }

  const saveButton = createSaveButton(overflowButton)

  overflowButton.before(saveButton)
}

window.addEventListener(
  "load",
  () => {
    onElementReady(
      // `[item-state]` needed to ensure saved comments have been fully loaded
      // direct child selector used for post comments to ensure each comment in tree is individually selected
      ":where(shreddit-profile-comment[item-state], shreddit-comment > shreddit-comment-action-row) shreddit-overflow-menu[slot='overflow'][source='comment']",
      { findOnce: false },
      improveComments,
    )
  },
  false,
)
