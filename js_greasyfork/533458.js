// ==UserScript==
// @name         MWI Kong Maximizer
// @namespace    http://tampermonkey.net/
// @version      .01
// @description  Activates cinematic mode and fullscreens MWI.
// @author       Incinarator
// @match        https://www.kongregate.com/games/chezedude/milky-way-idle?haref=HP_FSP_milky-way-idle
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kongregate.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533458/MWI%20Kong%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/533458/MWI%20Kong%20Maximizer.meta.js
// ==/UserScript==

/*jshint multistr: true */
(function() {
    'use strict';
    GM_addStyle("\
#game, .cinematic_mode #gameiframe {\
  width: 100vw !important;\
  height: 100vh !important;\
  top: 0px !important;\
  left: 0px !important;\
  border: unset !important;\
}\
\
body {\
  overflow: hidden\
}\
\
a[href*='/game?characterId=139249'] {\
  display: none !important;\
}\
")
setTimeout(()=>{document.getElementById('cinematic_mode_link').click()},2000)
})();