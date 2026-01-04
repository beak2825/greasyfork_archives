// ==UserScript==
// @name         GGn holiday effect removal
// @namespace    https://greasyfork.org/
// @version      0.4
// @description  Removes the snow effect from GGn
// @author       lucianjp
// @icon         https://gazellegames.net/favicon.ico
// @supportURL   https://gazellegames.net/forums.php?action=viewthread&threadid=20638&postid=1478606#post1478606
// @match        https://gazellegames.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/394215/GGn%20holiday%20effect%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/394215/GGn%20holiday%20effect%20removal.meta.js
// ==/UserScript==

GM_addStyle(`
#wrapper#wrapper {
  /*background: unset;*/
  -webkit-animation: unset;
  animation: unset; }
`);
