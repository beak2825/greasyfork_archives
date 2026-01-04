// ==UserScript==
// @name        Hide Watched Videos on PMVHaven
// @match       https://pmvhaven.com/*
// @version     1.0
// @author      -
// @description 5/29/2025, 1:01:31 PM
// @namespace https://greasyfork.org/users/1476445
// @downloadURL https://update.greasyfork.org/scripts/537658/Hide%20Watched%20Videos%20on%20PMVHaven.user.js
// @updateURL https://update.greasyfork.org/scripts/537658/Hide%20Watched%20Videos%20on%20PMVHaven.meta.js
// ==/UserScript==

let RESULTS_CONTAINER;
let HIDE_WATCHED_ADDED = false
let ENABLED = true

function toggleWatchedThumbnails(enabled = ENABLED){
  const thumbnails = document.querySelectorAll("div.v-col-sm-6.v-col-md-4.v-col-lg-4.v-col-12, div.v-col-sm-12 v-col-md-6 v-col-lg-4 v-col-12");

  thumbnails.forEach(t => {
    const match = t.querySelector("span.v-chip") ? t : null;

    if(!match) return;
    if (enabled === true) match.style.display = "none";
    else if (enabled === false) match.style.display = "flex";
  })
}

// Check if __nuxt updates, then hide thumbnail elements that have already been watched.
const nuxtObserver = new MutationObserver(
  (mutList, obs) => {
    for(const mut of mutList){
      RESULTS_CONTAINER = document.querySelector("div.v-row:has(:first-child.v-col-sm-6.v-col-md-4.v-col-lg-4.v-col-12), div.v-row:has(:first-child.v-col-sm-12 v-col-md-6 v-col-lg-4 v-col-12)");
      if(!RESULTS_CONTAINER) continue;
      toggleWatchedThumbnails()

      // Add toggle to sidebar
      const infiniteScrollSidebarToggle = document.querySelector("#__nuxt > div.v-application.v-theme--dark.v-layout.v-layout--full-height.v-locale--is-ltr > div > div > div > div.v-col-md-3.v-col-lg-3.v-col-3.hidden-md-and-down.pa-0 > div > div:nth-child(1) > div.v-card.v-theme--dark.v-card--density-default.v-card--variant-flat.mb-2.mt-3 > div:nth-child(3)")
      const infiniteScrollFilterToggle = document.querySelector("body > div.v-overlay-container > div > div.v-overlay__content > div > div:nth-child(7) > div")

      if(!infiniteScrollSidebarToggle) continue;

      if(!HIDE_WATCHED_ADDED){
        const hideWatchedToggle = infiniteScrollSidebarToggle.cloneNode(true)
        const input = hideWatchedToggle.querySelector("input[aria-label='Infinite Scrolling']")
        const label = hideWatchedToggle.querySelector("label")
        label.innerText = "Hide Watched"
        label.setAttribute('for', "hideWatched")
        input.setAttribute('id', "hideWatched")
        input.value = ENABLED

        function toggle(toggled){
          const control = hideWatchedToggle.querySelector("div.v-selection-control")
          const thumb = hideWatchedToggle.querySelector("div.v-switch__thumb")
          const track = hideWatchedToggle.querySelector("div.v-switch__track")

          if(toggled){
            control.classList.toggle("v-selection-control--dirty", true)
            control.classList.toggle("v-selection-control--focused", false)
            thumb.classList.toggle("bg-orange", true)
            track.classList.toggle("bg-orange", true)
          } else {
            control.classList.toggle("v-selection-control--dirty", false)
            control.classList.toggle("v-selection-control--focused", true)
            thumb.classList.toggle("bg-orange", false)
            track.classList.toggle("bg-orange", false)
          }
        }

        hideWatchedToggle.querySelector(".v-selection-control").addEventListener("mouseup", e => {
          ENABLED = !ENABLED
          input.value = ENABLED
          toggleWatchedThumbnails(ENABLED)
          toggle(ENABLED)
        })

        infiniteScrollSidebarToggle.after(hideWatchedToggle)
        // infiniteScrollFilterToggle.after(hideWatchedToggle)
        HIDE_WATCHED_ADDED = true
      }
    }
  }
)

nuxtObserver.observe(document.querySelector("div#__nuxt"), { childList: true, subtree: true })

