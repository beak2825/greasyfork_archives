// ==UserScript==
// @name         TRPL Bookmarks
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Add bookmarks to the rust programming language website.
// @author       Cai
// @match        https://kaisery.github.io/trpl-zh-cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395955/TRPL%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/395955/TRPL%20Bookmarks.meta.js
// ==/UserScript==

GM_addStyle(`
#menu-bar-sticky-container {
  backdrop-filter: blur(3px)!important;
  background: rgba(255,255,255,0.6)!important;
  border-bottom-width: 0!important;
}
.content main {
  margin-right: 0!important;
}
.cczz-out {
  position: fixed;
  top: 60px;
  z-index: 100;
  padding: 10px;
  border-radius: 5px;
  background: #ccc5;
  backdrop-filter: blur(2px);
}
.cczz-node {
  display: block;
}
.cczz-H2 {
  font-size: 16px;
  font-weight: bold;
}
.cczz-H3 {
  font-size: 14px;
  color: black!important;
}
.cczz-H4 {
  font-size: 12px;
  color: grey!important;
  text-indent: 24px;
}
`)

const $content = document.getElementById("content")
const $headers = $content.getElementsByClassName("header")
const $bookmark = document.createElement("DIV")
$bookmark.classList.add("cczz-out")
Array.from($headers).forEach($el => {
    const $node = document.createElement("A")
    $node.innerText = $el.innerText
    $node.href = $el.href
    $node.classList.add("cczz-node", "cczz-" + $el.children[0].tagName)
    $bookmark.appendChild($node)
})
$content.appendChild($bookmark)