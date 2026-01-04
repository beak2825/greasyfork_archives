// ==UserScript==
// @name        Google search open Wikipedia hotkey
// @description Pressing w in google search results will automaticall opne the first Wikipidea link
// @match       https://www.google.com/search*
// @version     1.0.2
// @license     MIT
// @author      gosha305
// @namespace   https://greasyfork.org/en/users/1436613
// @downloadURL https://update.greasyfork.org/scripts/530857/Google%20search%20open%20Wikipedia%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/530857/Google%20search%20open%20Wikipedia%20hotkey.meta.js
// ==/UserScript==

window.addEventListener('keydown', function(event){
  if (event.target.tagName == 'INPUT' ||
        event.target.tagName == 'SELECT' ||
        event.target.tagName == 'TEXTAREA' ||
        event.target.isContentEditable) {
        return;
        }
  if (event.key != "w" || event.ctrlKey || event.metaKey){
    return;
  }
  Array.from(document.querySelectorAll("#search a")).concat(Array.from(document.querySelectorAll("[data-attrid='VisualDigestDescription'] a"))).some((element) => {if (element.getAttribute("href").includes("wikipedia")) {window.location.href = element.getAttribute("href"); return true}});
})