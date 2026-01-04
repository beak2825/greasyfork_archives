// ==UserScript==
// @name        Hiện scrollbar 90p
// @namespace   Violentmonkey Scripts
// @match       https://90p.*/
// @grant       none
// @version     1.0
// @author      -
// @description 19:39:55, 12/12/2020
// @downloadURL https://update.greasyfork.org/scripts/418555/Hi%E1%BB%87n%20scrollbar%2090p.user.js
// @updateURL https://update.greasyfork.org/scripts/418555/Hi%E1%BB%87n%20scrollbar%2090p.meta.js
// ==/UserScript==

const showScrollbar = () => {
  const ele = document.getElementsByClassName("page-live")
  ele[0].style.overflow = "auto"
}

showScrollbar()