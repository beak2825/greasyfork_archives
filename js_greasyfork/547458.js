// ==UserScript==
// @name         SoundGasm Title Replacer
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  set SoundGasm's window title to the current audio title
// @author       GlawGlack
// @match        https://soundgasm.net/u/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundgasm.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547458/SoundGasm%20Title%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/547458/SoundGasm%20Title%20Replacer.meta.js
// ==/UserScript==

setInterval(()=>{
    let g = document.querySelector(".jp-details .jp-title");
    if (g !== undefined)
      {
        if (document.title != g.innerHTML)
          {
           document.title = g.innerHTML + " | soundgasm.net";
          }
        }
    },
     1000
);