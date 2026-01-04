// ==UserScript==
// @name         Select and copy text in J-Lyric.net
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Disable copy protection in J-Lyric.net
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        http://j-lyric.net/artist/*/*.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396236/Select%20and%20copy%20text%20in%20J-Lyricnet.user.js
// @updateURL https://update.greasyfork.org/scripts/396236/Select%20and%20copy%20text%20in%20J-Lyricnet.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.body.oncontextmenu = ''
  document.body.onselectstart = ''
})()
