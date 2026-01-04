// ==UserScript==
// @name        Mobilism - Mobile Easy Searchbar
// @namespace   Violentmonkey Scripts
// @match       https://forum.mobilism.org/*
// @match       https://forum.mobilism.me/*
// @grant       none
// @version     1.0
// @author      webdevz.sk | BENZiN
// @run-at      document-end
// @description 3/22/2023, 6:14:31 PM
// @license	MIT
// @downloadURL https://update.greasyfork.org/scripts/462328/Mobilism%20-%20Mobile%20Easy%20Searchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/462328/Mobilism%20-%20Mobile%20Easy%20Searchbar.meta.js
// ==/UserScript==
const ogSearch = document.querySelector("#forum-search")
const newSearch = ogSearch.cloneNode(true)
newSearch.id = "new-forum-search"
document.querySelector(".leftArea").appendChild(newSearch)

const css = `
  #new-forum-search{
      display: none;
  }
  @media(max-width: 767px){
    #new-forum-search{
      display: block;
    }
  }
`
const styleNode = document.createElement("style")
styleNode.appendChild(document.createTextNode(css))
;(document.querySelector("head") || document.documentElement).appendChild(styleNode)
