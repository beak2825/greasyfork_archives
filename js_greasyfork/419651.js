// ==UserScript==
// @name         Piazza - Archive with Delete Key
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  bind the delete key to quickly archive posts
// @copyright    2019, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.3.3

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/piazza-archive-with-delete-key.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Piazza_-_Archive_with_Delete_Key
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @include      https://piazza.com/class/*
// @downloadURL https://update.greasyfork.org/scripts/419651/Piazza%20-%20Archive%20with%20Delete%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/419651/Piazza%20-%20Archive%20with%20Delete%20Key.meta.js
// ==/UserScript==
/* global P */

// TODO: add undo shortcut

// let lastDeletedItemId
let lastMovement = "down" // or 'up'

/**
 * ret prev item in cur week if exists or back up and move to prev week to get last item
 *
 * @see {getNextItem}
 * @param {Element} el - target
 * @returns {?HTMLElement} result
 */
const getPrevItem = (el) => {
  if (el.previousElementSibling) return el.previousElementSibling

  let parent = el.parentElement.parentElement.previousElementSibling
  while (parent) {
    if (parent.lastElementChild && parent.lastElementChild.lastElementChild) {
      return parent.lastElementChild.lastElementChild
    }
    parent = parent.previousElementSibling
  }

  // must be at start of posts so force get next
  const item = getNextItem(el)
  if (!item) throw new Error("cannot find any other posts") // prevent inf loop
  return item
}

/**
 * ret next item in cur week if exists or back up and move to next week to get first item
 *
 * @param {Element} el - target
 * @returns {?HTMLElement} result
 */
const getNextItem = (el) => {
  // sibling from same week
  if (el.nextElementSibling) return el.nextElementSibling

  // back up element to week div and select next week
  let parent = el.parentElement.parentElement.nextElementSibling
  // return first proceeding week with a post in it
  while (parent) {
    if (parent.lastElementChild && parent.lastElementChild.firstElementChild) {
      return parent.lastElementChild.firstElementChild
    }
    parent = parent.nextElementSibling // update to next week
  }

  // must be at end of posts so force get prev
  const item = getPrevItem(el)
  if (!item) throw new Error("cannot find any other posts") // prevent inf loop
  return item
}

/**
 * navigate posts on key press
 *
 * @param {KeyboardEvent} e - keydown event
 */
const onKeydownHandler = (e) => {
  // move to prev feed item
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    const prevItem = getPrevItem(document.querySelector(".feed_item.selected"))
    prevItem && prevItem.click()
    lastMovement = "up"
  }

  // move to next feed item
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    const nextItem = getNextItem(document.querySelector(".feed_item.selected"))
    nextItem && nextItem.click()
    lastMovement = "down"
  }

  // del & move to next feed item
  if (e.key === "Delete") {
    const item = document.querySelector(".feed_item.selected")
    const newItem =
      lastMovement === "up" // change view
        ? getPrevItem(item)
        : getNextItem(item)
    newItem && newItem.click()
    // lastDeletedItemId = (item.id)
    P.feed.delFeedItem(item.id)
  }

  // FIXME: cannot read property 'remove' of null
  // if (e.key === 'z' && e.ctrlKey) {
  //   if (lastDeletedItemId) {
  //     P.feed.addFeedItem(lastDeletedItemId)
  //   }
  // }
}

// update direction of last movement direction for each click
document.addEventListener("click", (e) => {
  let clickedPost = /** @type {HTMLElement} */ (e.target)

  // traverse up html until the post item is found or `null`
  while (clickedPost && !clickedPost.className.includes("feed_item")) {
    clickedPost = clickedPost.parentElement
  }

  if (clickedPost) {
    const selected = document.querySelector(".feed_item.selected")

    // id of week the post is in
    const bucketClicked = clickedPost.parentElement.id
    const bucketSelected = selected.parentElement.id

    if (bucketClicked > bucketSelected) lastMovement = "down"
    else if (bucketClicked < bucketSelected) lastMovement = "up"
    else {
      // posts in the same week
      // get position within the week
      const positionClicked = [...clickedPost.parentElement.children].indexOf(
        clickedPost
      )
      const positionSelected = [...selected.parentElement.children].indexOf(
        selected
      )

      if (positionClicked < positionSelected) lastMovement = "up"
      else if (positionClicked > positionSelected) lastMovement = "down"
      else {
        /* don't update lastMovement if already selected item is clicked */
      }
    }
  }
})

document.addEventListener("keydown", onKeydownHandler)
