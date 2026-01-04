// ==UserScript==
// @name        Bypassing regional restrictions on Lostfilm
// @description Bypassing reglock Lostfilm
// @description:ru Обход региональных ограничений на Lostfilm
// @include     https://www.lostfilm.*/series/*
// @grant       none
// @version     1.0
// @copyright   2020, partoftheworlD (https://greasyfork.org/ru/users/672593-partoftheworld)
// @license     MIT
// @namespace https://greasyfork.org/users/672593
// @downloadURL https://update.greasyfork.org/scripts/408059/Bypassing%20regional%20restrictions%20on%20Lostfilm.user.js
// @updateURL https://update.greasyfork.org/scripts/408059/Bypassing%20regional%20restrictions%20on%20Lostfilm.meta.js
// ==/UserScript==

function PlayEpisodeBypass(event) {
            window.open("/v_search.php?a=" + document.querySelector("#left-pane > div.white-background.clearfix > div:nth-child(1) > div.isawthat-btn").dataset.episode)
}
var button = document.querySelector("#left-pane > div.white-background.clearfix > div:nth-child(5) > div.image-block > div.overlay-pane > div.external-btn2")
if(button) {
  button.addEventListener('click', PlayEpisodeBypass, false)
}
