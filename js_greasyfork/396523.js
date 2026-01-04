// ==UserScript==
// @name         Facebook delete Fbclid Link
// @namespace    https://greasyfork.org/zh-TW/scripts/396523-facebook-delete-fbclid-link
// @version      0.2
// @icon         https://www.facebook.com/favicon.ico
// @description  Automatically detect and remove fuck Fbclid links when scrolling
// @author       avan
// @match        https://www.facebook.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/396523/Facebook%20delete%20Fbclid%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/396523/Facebook%20delete%20Fbclid%20Link.meta.js
// ==/UserScript==
const removeFbclid = (href) => {
    const fbclidURL = new URL(href)
    if (fbclidURL.host === "l.facebook.com" && fbclidURL.searchParams.get("u")) {
        href = decodeURI(fbclidURL.searchParams.get("u"))
    } else {
        fbclidURL.searchParams.delete("fbclid")
        href = fbclidURL.href
    }
    return href
}

const deleteFbclidLink = () => {
  const fbclidLinkList = document.querySelectorAll('a[href*="fbclid"]')
  if (!fbclidLinkList || fbclidLinkList.length === 0) {
    return
  }
  for (const fbclidLink of fbclidLinkList) {
    fbclidLink.addEventListener("click",
      function (event) {
        event.preventDefault()
        window.open(removeFbclid(this.href))
      },
      false)
    fbclidLink.href = removeFbclid(fbclidLink.href)
  }
}

const excute = () => {
    window.addEventListener("DOMSubtreeModified", deleteFbclidLink)
    window.addEventListener("scroll", deleteFbclidLink)
    window.addEventListener("click", deleteFbclidLink)
}

(function() {
    'use strict';

	excute()
})();