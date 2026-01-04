// ==UserScript==
// @name        Better imgbase.ru
// @namespace   Violentmonkey Scripts
// @match       https://imgbase.ru/*
// @grant       none
// @version     1.0.1
// @author      -
// @description Just open the image - 2/5/2022, 11:54:53 AM
// @downloadURL https://update.greasyfork.org/scripts/439587/Better%20imgbaseru.user.js
// @updateURL https://update.greasyfork.org/scripts/439587/Better%20imgbaseru.meta.js
// ==/UserScript==


href = window.location.href
segments = href.split('/')
if((segments.length == 6) && (segments[segments.length - 1] == "")) {
  window.location = href + "1/"
}

if((segments.length == 7) && (segments[segments.length - 2] == "1") && (segments[segments.length - 1] == "")) {
  var intervalID
  function go() {
    img = document.querySelector("div#img_full > img")
    if(img !== null) {
      clearInterval(intervalID)
      window.location = img.src
    }
  }
  intervalID = setInterval(go, 100)
}
