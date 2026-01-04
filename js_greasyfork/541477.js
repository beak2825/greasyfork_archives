// ==UserScript==
// @name         XDigma black/white list
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Search comets
// @author       valter0ff
// @match        https://xdigma.com/game.php?page=galaxy2*
// @match        https://xdigma.net/game.php?page=galaxy2*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541477/XDigma%20blackwhite%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/541477/XDigma%20blackwhite%20list.meta.js
// ==/UserScript==

(function()  {
  "use strict";
  
  let blacklist = [
    "1:118:6",
  ]
    
  let whitelist = [
    "1:9:4",
    "1:12:4",
  ]
    
  function showBlacklisted(coordinates) {
      coordinates.forEach((coord) => {
        $('a.tooltip').each(function () {
          const tooltipContent = $(this).attr('data-tooltip-content')
          if (tooltipContent && tooltipContent.includes(coord)) {
            $(this).find('img').attr({
              src: "data:image/png;base64,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",
              style: 'width:6%;height:6%;',
            })
          }
        })
      })
    }
    
  function showWhitelisted(coordinates) {
      coordinates.forEach((coord) => {
        $('a.tooltip').each(function () {
          const tooltipContent = $(this).attr('data-tooltip-content')
          if (tooltipContent && tooltipContent.includes(coord)) {
            $(this).find('img').attr({
              src: "data:image/png;base64,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",
              style: 'width:6%;height:6%;',
            })
          }
        })
      })
    }
    
  $(document).ready(function () {
      showBlacklisted(blacklist)
      showWhitelisted(whitelist)
  })
  
  console.log("Script black/white list loaded");
  
  window.blacklist = blacklist;
  window.whitelist = whitelist;
})();