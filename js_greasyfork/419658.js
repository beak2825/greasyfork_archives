// ==UserScript==
// @name         IBM Verse - Auto-Select Next Email
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  load up next email when the current one is deleted
// @copyright    2020, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.2.1

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/verse-ibm-select-next-email.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/IBM_Verse_-_Auto-Select_Next_Email
// @supportURL   https://openuserjs.org/scripts/zachhardesty7/IBM_Verse_-_Auto-Select_Next_Email/issues


// @include      https://mail.notes.na.collabserv.com/verse*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419658/IBM%20Verse%20-%20Auto-Select%20Next%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/419658/IBM%20Verse%20-%20Auto-Select%20Next%20Email.meta.js
// ==/UserScript==
/* global onElementReady */

/**
 * the email that should be active after active email is deleted or archived
 *
 * @type {HTMLElement}
 */
let nextEmail = null

/**
 * safely move to next email
 *
 * will trigger the click function to find the next email
 *
 * @param {string} description - message to log
 * @returns {(event: Event) => void} - function to be called
 */
const clickNextEmail = (description) => (event) => {
  console.log(`clicked ${description}`)
  nextEmail && nextEmail.click()
}

/**
 * @param {HTMLElement} el - input
 * @returns {boolean} whether or not the input is the last email
 */
const isLastEmail = (el) =>
  !el.nextElementSibling || el.nextElementSibling.tagName === "SPAN"

window.addEventListener(
  "load",
  () => {
    // heading buttons
    onElementReady("button.action.pim-delete.icon", {}, (button) => {
      // trigger on click heading del
      button.addEventListener("click", clickNextEmail("header del"), {
        once: true,
      })
    })

    onElementReady("li.seq-msg-row", { findOnce: true }, (clickedEmail) => {
      // trigger on click inline archive
      clickedEmail
        .querySelector("button.triage-action.remove")
        .addEventListener("click", clickNextEmail("inline archive"), {
          once: true,
        })

      // trigger on click inline delete
      clickedEmail
        .querySelector("button.triage-action.delete")
        .addEventListener("click", clickNextEmail("inline del"), {
          once: true,
        })

      // find next email
      // also triggered on calling `clickNextEmail`
      clickedEmail.addEventListener("click", (e) => {
        const targetEl = /** @type {HTMLElement} */ (e.target)

        /** subtract out the invisible span element from the total sibling count */
        const emailCount = clickedEmail.parentElement.childElementCount - 1

        // don't update if user clicked on an inline button icon
        // `clickNextEmail` handles to prevent double click
        if (targetEl.tagName === "svg" || targetEl.tagName === "rect") return

        if (emailCount < 2) return

        if (isLastEmail(clickedEmail))
          nextEmail = clickedEmail.previousElementSibling
        // when second-to-last is also first email
        else if (emailCount === 2) nextEmail = clickedEmail.nextElementSibling
        // when second-to-last and many emails visible
        else if (isLastEmail(clickedEmail.nextElementSibling))
          nextEmail = clickedEmail.previousElementSibling
        else nextEmail = clickedEmail.nextElementSibling
      })
    })
  },
  false
)
