// ==UserScript==
// @name        Better fastpic.ru and fastpic.org
// @namespace   Violentmonkey Scripts
// @match       https://fastpic.ru/view/*
// @match       https://fastpic.org/view/*
// @grant       none
// @version     2
// @author      -
// @description Just open the image - 2022-02-05, 11:59:48 AM
// @downloadURL https://update.greasyfork.org/scripts/428259/Better%20fastpicru%20and%20fastpicorg.user.js
// @updateURL https://update.greasyfork.org/scripts/428259/Better%20fastpicru%20and%20fastpicorg.meta.js
// ==/UserScript==

var intervalID
function go() {
  img = document.querySelector("a#imglink > img.image")
  if(img !== null) {
    clearInterval(intervalID)
    window.location = img.src
  }
}
intervalID = setInterval(go, 100)