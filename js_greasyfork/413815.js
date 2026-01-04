

// ==UserScript==
// @name        Fix encode
// @namespace   Fix encode by C4illin
// @match       https://www.strawpoll.me/*
// @grant       none
// @version     1.2
// @author      C4illin
// @description fixes the encode on strawpoll (no more &#229; for example)
// @license     MIT; https://opensource.org/licenses/MIT
// @copyright   2020, C4illin (https://github.com/C4illin)
// @downloadURL https://update.greasyfork.org/scripts/413815/Fix%20encode.user.js
// @updateURL https://update.greasyfork.org/scripts/413815/Fix%20encode.meta.js
// ==/UserScript==
     
function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html")
  return doc.documentElement.textContent
}

let title = document.querySelector("meta[property='og:title']").content
let mainText = document.querySelector("div#result-list > h1")

if (mainText && title.endsWith("...")){
  title = htmlDecode(mainText.textContent)
  console.log(title)
}

if(mainText) {
  mainText.textContent = title
}
     
if (title.length > 33) {
  title = title.slice(0, 32).trim()
}
     
document.getElementsByTagName("title")[0].textContent = (title + "… - Straw Poll")

