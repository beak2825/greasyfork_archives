// ==UserScript==
// @name Youtube Shorts Remover
// @name:pt Remover Youtube Shorts
// @description This scripts remove all the sections of "youtube shorts" from the listings on youtube. Keeping only the "normal" videos.
// @description:pt Script para remover todas os shorts da listagem de videos e busca do youtube
// @namespace jlcvp/ytsr
// @include https://youtube.com
// @version  1
// @license MIT
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484433/Youtube%20Shorts%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/484433/Youtube%20Shorts%20Remover.meta.js
// ==/UserScript==


setInterval(() => {
  // find all elements by tag name
  let allElements = document.getElementsByTagName("ytd-rich-section-renderer");

  if(allElements.length > 0) {
    console.log("[JLCVP] Number of shorts sections removed:" + allElements.length)
    // set display to none for all elements, then remove
    for (let i = allElements.length - 1; i >= 0; i--) {
      //allElements[i].style.display = "none";
      const element = allElements[i];
      element.style.display = "none";
      element.remove();
    }
  }
}, 500);
