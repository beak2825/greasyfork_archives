// ==UserScript==
// @name           PM Cursor Fix
// @namespace      pbr/pcf
// @include        http://goallineblitz.com/game/new_message.pl?to=*&reply=*
// @copyright      2011, pabst
// @license        (CC) Attribution Share Alike; http://creativecommons.org/licenses/by-sa/3.0/
// @version        11.05.03
// @description sdfsdf
// @downloadURL https://update.greasyfork.org/scripts/1426/PM%20Cursor%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/1426/PM%20Cursor%20Fix.meta.js
// ==/UserScript==

var area = document.getElementById("message");
area.focus(); 
area.setSelectionRange(0, 1); 

