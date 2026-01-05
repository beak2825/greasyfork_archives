// ==UserScript==
// @name         Vertix shoot legit
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Fire bullets without Cool Down.
// @author       stranger3003
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24910/Vertix%20shoot%20legit.user.js
// @updateURL https://update.greasyfork.org/scripts/24910/Vertix%20shoot%20legit.meta.js
// ==/UserScript==

$("#cvs").mouseup(function(c){1==c.which&&shootBullet(player)});