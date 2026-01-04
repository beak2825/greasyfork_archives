// ==UserScript==
// @name         comics-reader
// @namespace    http://www.ziffusion.com/
// @description  comics reader
// @author       Ziffusion
// @match        http://zitscomics.com/comics*
// @match        https://www.gocomics.com/calvinandhobbes*
// @grant        none
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/378194/comics-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/378194/comics-reader.meta.js
// ==/UserScript==

var comics = [
  "http://zitscomics.com/comics",
  "https://www.gocomics.com/calvinandhobbes",
];

var url = location.href.replace(/\/+$/, "");

for (comic in comics) {
  var base = comics[comic];
  var episode = url.replace(base, "");
  if (episode == url) {
    continue;
  }
  if (episode == "") {
    location.replace(base + localStorage.getItem("episode"));
  } else {
    localStorage.setItem("episode", episode);
  }
}