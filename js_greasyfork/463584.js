// ==UserScript==
// @name        SEX141 Enhancements
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       https://forum.141-161.com/
// @match       https://forum.141-161.com/*.php
// @match       https://forum.141-161.com/*.php?*
// @match       https://forum.141-161.com/viewthread.php?*
// @match       https://forum.141-161.com/search.php?*
// @version     1.7
// @author      gg1234
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @description Enhance the user experience at the SEX141 Forum
// @downloadURL https://update.greasyfork.org/scripts/463584/SEX141%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/463584/SEX141%20Enhancements.meta.js
// ==/UserScript==

// Parse information out of a sex141 forum query string.
function parseSearch(s) {
  let ss = s.replace(/^\?/, '')
  let parts = ss.split('&')
  let threadId, page
  parts.forEach((p) => {
    if (p.match(/^tid=/)) {
      let res = p.match(/^tid=(\d+)/)
      threadId = res[1]
    } else if (p.match(/^extra=page/)) {
      let res = p.match(/^extra=page%3D(\d+)/)
      page = res[1]
    } else if (p.match(/^page=/)) {
      let res = p.match(/^page=(\d+)/)
      page = res[1]
    }
  })
  return {threadId, page}
}

// Set the font size for all posts and remember the font size for next time.
function setFontSize(size) {
  let sizers = document.querySelectorAll('a[name] + div.right.t_number')
  let index = {
    S: 0,
    M: 1,
    L: 2
  }
  let s = index[size]
  if (s === undefined) {
    console.warn(`Invalid size: ${size}`)
    return
  } else {
    // Remember the font size for next time a thread is loaded.
    GM_setValue('fontSize', size)
  }
  sizers.forEach((sizer) => {
    let as = Array.from(sizer.querySelectorAll('a'))
    as[s].click()
  })
}

const INVALID = [
  '%27'
]
// Remove strings that cause crashes from the href.
function cleanHref(href) {
  return INVALID.reduce((m, a) => m.replace(new RegExp(a, 'g'), ''), href)
}

// main _______________________________________________________________

// Apply CSS
let css = `
td.line img[onload] {
  max-width: 100%;
}
`
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// Provide menu options for setting the font size on all posts.
GM_registerMenuCommand('Font S', (ev) => { setFontSize('S') })
GM_registerMenuCommand('Font M', (ev) => { setFontSize('M') })
GM_registerMenuCommand('Font L', (ev) => { setFontSize('L') })

// Remove Telegram Ad on all pages.
let telegramAd = document.querySelector('div[align=center] div[style][onmouseover]')
if (telegramAd) {
  telegramAd.remove()
} else {
  console.warn("Telegram Ad not found in DOM.")
}

// Do page-specific actions.
if (location.pathname === '/eforum/viewthread.php' || location.pathname === '/viewthread.php') {
  // Fix Direct Links to Posts
  let anchors = Array.from(document.querySelectorAll('a[name][title]'))
  let links   = Array.from(document.querySelectorAll('div.t_number a.bold'))
  if (anchors.length === links.length) {
    anchors.forEach((a, i) => {
      let {threadId, page} = parseSearch(location.search)
      let postId = a.name
      let directLink = `/eforum/viewthread.php?tid=${threadId}&page=${page}#${postId}`
      links[i].removeAttribute('onclick')
      links[i].setAttribute('href', directLink)
      //links[i].setAttribute('href', `#${anchors[i].name}`)
      //console.log(i, anchors[i].name)
    })
  } else {
    console.warn(`anchors and links have different lengths.  ${anchors.length} != ${links.length}`)
  }

  // Restore last font size.
  let fontSize = GM_getValue('fontSize')
  if (fontSize !== undefined) {
    setFontSize(fontSize)
  } else {
    // Default to Large Fonts
    setFontSize('L')
  }
} else if (location.pathname === '/eforum/search.php' || location.pathname === '/search.php') {
  // Fix broken links
  // https://forum.zh141.com/eforum/viewthread.php?tid=91385
  let links = Array.from(document.querySelectorAll('table tr.row td.subject a'))
  links.forEach((link) => {
    let newHref = cleanHref(link.href)
    link.href = newHref
  })
}
