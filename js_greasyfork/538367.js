// ==UserScript==
// @name        Reddit - Enhancer
// @version     1.7
// @description Various enhancements for Reddit (increase display width, added arrow controls to scroll images, remove search "links", all gif are videos)
// @author      xefiry
// @namespace   https://github.com/xefiry
// @homepageURL https://github.com/xefiry/UserScripts
// @supportURL  https://github.com/xefiry/UserScripts/issues
// @icon        https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @noframes
// @run-at      document-end
// @grant       none
// @match       https://www.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/538367/Reddit%20-%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538367/Reddit%20-%20Enhancer.meta.js
// ==/UserScript==

// Increase width limit on subredits homepages & posts
function increase_display_width() {
  let new_width = "80%"
  let elem = document.querySelector(".subgrid-container")

  if (elem != null && elem.style.width !== new_width) {
    elem.style.width = new_width
  }
}

function no_search_links() {
  let span

  // Do nothing if it is a search page
  if (document.location.pathname.search("/search/") !== -1) {
    return
  }
  
  document.querySelectorAll("search-telemetry-tracker[view-events]").forEach(node => {
    span = document.createElement("span")
    span.innerText = node.innerText
    node.replaceWith(span)
  })
}

// removes "gif" attribute from some videos to prevent problems
// (video playback restarts alone, click on media opens new tab)
function all_gifs_are_videos() {
  document.querySelectorAll("shreddit-player-2[gif]").forEach(vid => {
    // remove reddit video controls
    vid.shadowRoot.querySelector("shreddit-media-ui").remove()
    // add default video controls
    vid.shadowRoot.querySelector("video").setAttribute("controls", "controls")
    // enable loop
    vid.shadowRoot.querySelector("video").setAttribute("loop", "")
    // remove gif attribute
    vid.removeAttribute('gif')
  })
}

var buttons = null

function set_buttons(event) {
  buttons = event.currentTarget.shadowRoot.querySelectorAll("faceplate-carousel button.button-small")
}

function add_carousel_listner() {
  // get all carousels
  let carousels = document.querySelectorAll("gallery-carousel")

  // if there is only one, get it's buttons
  if (carousels.length === 1) {
    buttons = carousels[0].shadowRoot.querySelectorAll("faceplate-carousel button.button-small")
  }
  // else, add event listner to update buttons on hover
  else {
    document.querySelectorAll("gallery-carousel:not(.hasEventListner)").forEach(node => {
      node.onmouseover = set_buttons
      node.classList.add("hasEventListner")
    })
  }
}

document.addEventListener('keydown', function (event) {
  if (buttons === null) {
    return
  }

  switch (event.key) {
    case "ArrowLeft": buttons[0].click(); break;
    case "ArrowRight": buttons[1].click(); break;
  }
})

function main() {
  increase_display_width()
  no_search_links()
  all_gifs_are_videos()
  add_carousel_listner()
}

setTimeout(main, 500);
setInterval(main, 2000)
