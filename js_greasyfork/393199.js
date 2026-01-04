// ==UserScript==
// @name         Select and copy text in UtaTen
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Disable copy protection in UtaTen
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://utaten.com/lyric/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393199/Select%20and%20copy%20text%20in%20UtaTen.user.js
// @updateURL https://update.greasyfork.org/scripts/393199/Select%20and%20copy%20text%20in%20UtaTen.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.body.oncontextmenu = ''
  document.body.onselectstart = ''
  document.getElementsByClassName('lyricBody')[0].style.userSelect = 'auto'
})()
