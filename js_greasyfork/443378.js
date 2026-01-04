// ==UserScript==
// @name        Simple gogoplay
// @match       https://gogohd.net/videos/*
// @grant       none
// @version     1.1
// @author      nxo
// @license MIT
// @description 2022/3/15 9:02:03
// @namespace https://greasyfork.org/users/244063
// @downloadURL https://update.greasyfork.org/scripts/443378/Simple%20gogoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/443378/Simple%20gogoplay.meta.js
// ==/UserScript==

document.querySelector("#navigation-wrapper").remove()
document.querySelector(".video-options").remove()
document.querySelector(".comment").remove()
document.querySelector(".video-info-right > .listing").remove()
document.querySelector(".video-info-right > .widget-title").remove()
document.querySelector(".video-details").remove()
document.querySelector(".list_episdoe").remove()
document.querySelector("#footer").remove()
document.querySelector("#header-social").remove()

const episodes = document.querySelector(".listing")
const rightBar = document.querySelector(".video-info-right")
rightBar.appendChild(episodes)

const styles = `
.video-block {
  margin-bottom: 10px !important;
}
`
const styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)