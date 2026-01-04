// ==UserScript==
// @name         CC 2019_2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/iteminfo.phtml?obj_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382746/CC%202019_2.user.js
// @updateURL https://update.greasyfork.org/scripts/382746/CC%202019_2.meta.js
// ==/UserScript==

setTimeout(function(){
    $(".button_addcc")[0].click()
    console.log("123")

}, Math.floor(Math.random()*100)+100);