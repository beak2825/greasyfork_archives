// ==UserScript==
// @name        Nightcore crack
// @namespace   Violentmonkey Scripts
// @match       https://nightcore.app/
// @homepageURL https://dreaming.codes
// @grant       none
// @version     1.1
// @author      DreamingCodes
// @license MIT
// @description Crack for nightcore.app
// @downloadURL https://update.greasyfork.org/scripts/447562/Nightcore%20crack.user.js
// @updateURL https://update.greasyfork.org/scripts/447562/Nightcore%20crack.meta.js
// ==/UserScript==
let originalFetch = window.fetch;
window.fetch = async (...args) =>{
  if(args[0] == "https://patreon.nightcore.app/patron"){
    console.log("FUCK PATREON LICENSE")
    return {ok: true}
  }
  let result = await originalFetch(...args);
  return result;
}