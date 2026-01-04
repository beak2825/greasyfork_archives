// ==UserScript==
// @name	Automatic Save to Wayback Machine
// @namespace      Zopolis4
// @description    Automatically saves the pages you visit into the Wayback Machine.
// @version	2.1.0
// @match	*
// @grant    GM_xmlhttpRequest
// @require https://gitcdn.link/repo/uwx/GM_fetch.ts/fe0cd27fa60efc2975fea55a03d8545ae61aaf34/dist/GM_fetch.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/426028/Automatic%20Save%20to%20Wayback%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/426028/Automatic%20Save%20to%20Wayback%20Machine.meta.js
// ==/UserScript==

function parseURLs() {
  var url = "https://web.archive.org/save/" + location.href;
  if (location.hostname == "web.archive.org") {
    url = "https://web.archive.org/save/" + encodeURI(decodeURI(location.href).replace(/(https?:\/\/)?(www\.)?web\.archive\.org\/(|save|web\/\*\/[0-9]+|web\/[0-9]+|\*\/[0-9]+|web\/\*\/|web|\*\/|[0-9]+)?(\/|id_\/)?/, ""));
  }
  savePages(url);
}
 
function savePages(url) {
  fetch(url, {
    method: "GET",
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
  });
  console.log(url);
}

document.addEventListener("DOMContentLoaded", parseURLs);