// ==UserScript==
// @name         Karnage Fast fire(Might Not Work)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fire bullets without Cool Down.
// @author       Lexi
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28323/Karnage%20Fast%20fire%28Might%20Not%20Work%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28323/Karnage%20Fast%20fire%28Might%20Not%20Work%29.meta.js
// ==/UserScript==

$("#cvs").mousedown(function(c){1==c.which&&shootBullet(player)});