// ==UserScript==
// @name        Remove flow-breaking Mer articles - omni.se
// @namespace   Violentmonkey Scripts
// @match       https://omni.se/
// @grant       none
// @version     1.0
// @author      Kwickell
// @description 30/01/2023, 12:19:40
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459127/Remove%20flow-breaking%20Mer%20articles%20-%20omnise.user.js
// @updateURL https://update.greasyfork.org/scripts/459127/Remove%20flow-breaking%20Mer%20articles%20-%20omnise.meta.js
// ==/UserScript==


setInterval(()=>{
  document.getElementsByClassName('premium-badge').forEach((object,index)=>object.closest('article').remove());
}, 1000);