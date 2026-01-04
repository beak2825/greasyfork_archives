// ==UserScript==
// @name         FV CLient loader bhs 
// @version      1.0
// @description  FV-client add - on
// @author       M4tr1x#5555
// @match        https://starblast.io/
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @downloadURL https://update.greasyfork.org/scripts/450168/FV%20CLient%20loader%20bhs.user.js
// @updateURL https://update.greasyfork.org/scripts/450168/FV%20CLient%20loader%20bhs.meta.js
// ==/UserScript==

let files = [
  "parseUI.js",
  "preventReload.js",
  "allLanguages.js",
  "lowercaseName.js",
  "5emotes.js",
  "shipTag.js",
  "explosions.js",
  "crystalColor.js",
  "anonMode.js",
  "fixCustom.js",
  "blankBadge.js",
  "HideChat.js"
];
for (let file of files) executeJS("/js/main/root/algorithm/utils/main/loaders/" + file, true)