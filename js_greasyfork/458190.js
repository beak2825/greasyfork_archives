// ==UserScript==
// @name            Hide Tab Name and Icon
// @version         1.0
// @description     Made by K.Dot based off https://greasyfork.org/users/869339 (DotDotDash)
// @include         *
// @author          K.Dot
// @match           http://*/*
// @run-at          document-start
// @grant           none
// @license MIT
// @namespace https://greasyfork.org/en/users/1011635
// @downloadURL https://update.greasyfork.org/scripts/458190/Hide%20Tab%20Name%20and%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/458190/Hide%20Tab%20Name%20and%20Icon.meta.js
// ==/UserScript==

function sleep(sec) {
  var ms = sec * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function change_name() {
  var titles = ["K.Dot", "KingKunta", "KungFuKenny"];
  var random = Math.floor(Math.random() * titles.length);
  document.title = titles[random];
}

function change_icon(url_image) {
  var link = document.querySelector("link[rel*='icon']");
  document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = url_image;
  document.getElementsByTagName("head")[0].appendChild(link);
  void 0;
}

async function main() {
  var icon =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Antonia_Sautter_Creations.png/120px-Antonia_Sautter_Creations.png"; // I could not find a blank image to save my life
  while (true) {
    change_name();
    change_icon(icon);
    await sleep(3);
  }
}
main();
