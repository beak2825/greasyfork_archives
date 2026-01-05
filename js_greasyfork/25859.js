// ==UserScript==
// @name         Jumpshoot
// @namespace    KROKIk
// @version      1
// @description  Skacz spacją i strzelaj przy okazji
// @author       KROKIk
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25859/Jumpshoot.user.js
// @updateURL https://update.greasyfork.org/scripts/25859/Jumpshoot.meta.js
// ==/UserScript==

$("#cvs").keydown(function(c){32==c.which&&shootBullet(player)});