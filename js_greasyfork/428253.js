// ==UserScript==
// @name        xHamster - redirect to xhamster.com
// @namespace   Violentmonkey Scripts
// @match       https://xhamster.desi/*
// @match       https://pj222.top/*
// @grant       none
// @version     1.1
// @author      -
// @description Redirect from all mirrors of xHamster to xhamster.com - 6/21/2021, 7:31:16 AM
// @downloadURL https://update.greasyfork.org/scripts/428253/xHamster%20-%20redirect%20to%20xhamstercom.user.js
// @updateURL https://update.greasyfork.org/scripts/428253/xHamster%20-%20redirect%20to%20xhamstercom.meta.js
// ==/UserScript==

origin = window.location.origin

matches = origin.match(/^http.:\/\/(xhamster.desi|pj222.top)/)

if(matches !== null) {
  pathname = window.location.pathname
  url = "https://xhamster.com" + pathname
  window.location.replace(url)
}
