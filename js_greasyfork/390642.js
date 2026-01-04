// ==UserScript==
// @name         discord compact
// @namespace    
// @version      0.1
// @description  kkk
// @author       FFFFF
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390642/discord%20compact.user.js
// @updateURL https://update.greasyfork.org/scripts/390642/discord%20compact.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let stylen = document.createElement("style");
  stylen.innerHTML = `
    .containerCompact-3V0ioj {
      padding: 2px 0;
    }
  `;
  document.body.append(stylen);

})();