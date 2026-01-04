// ==UserScript==
// @name Аукцион досрочно
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Аук досрочно
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506624/%D0%90%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%20%D0%B4%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%BD%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/506624/%D0%90%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%20%D0%B4%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%BD%D0%BE.meta.js
// ==/UserScript==
 
 
setInterval(function(){
var role = $('.roleName').text();
if(role){
$('.underline').click();
}
}, 50)