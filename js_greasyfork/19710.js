// ==UserScript==
// @name         AdRemove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove annoying reminders to register
// @author       You
// @match        http*://*.sdamgia.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19710/AdRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/19710/AdRemove.meta.js
// ==/UserScript==

$('div').each(function(){
  if($(this).css("right")=="10px")$(this).css({"right":"-1000px"});
});