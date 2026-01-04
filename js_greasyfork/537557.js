// ==UserScript==
// @name        Homer+, emotes custom, gratuites, pour les live de Homer
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/live_chat*
// @match       https://studio.youtube.com/live_chat*
// @grant       none
// @version     1.3
// @author      -
// @license     MIT
// @description Ajoute des emotes pour les lives de Homer.
// @downloadURL https://update.greasyfork.org/scripts/537557/Homer%2B%2C%20emotes%20custom%2C%20gratuites%2C%20pour%20les%20live%20de%20Homer.user.js
// @updateURL https://update.greasyfork.org/scripts/537557/Homer%2B%2C%20emotes%20custom%2C%20gratuites%2C%20pour%20les%20live%20de%20Homer.meta.js
// ==/UserScript==

setInterval(function () {
  for (element of document.querySelectorAll("#message")) {
    element.innerHTML = element.innerHTML.replace(":chobar:","<img src='https://i.ibb.co/qFLVQnG3/chobar.webp' title='chobar'></img>");
    element.innerHTML = element.innerHTML.replace(":heumere:","<img src='https://i.ibb.co/GvjgK0KM/crazy.webp' title='heumere'></img>");
    //https://ibb.co/6cvXvPW9
    element.innerHTML = element.innerHTML.replace(":homermenace:","<img src='https://i.ibb.co/35fRfNC6/homerclake.jpg' title='homermenace'></img>");
  }
}, 500);