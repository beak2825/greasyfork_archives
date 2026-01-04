// ==UserScript==
// @name         Go Back to Ambeint bag chage in External site
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  goes to the ambient edit page
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/pick_zone/list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371874/Go%20Back%20to%20Ambeint%20bag%20chage%20in%20External%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/371874/Go%20Back%20to%20Ambeint%20bag%20chage%20in%20External%20site.meta.js
// ==/UserScript==

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if((m == 29 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
window.open("https://aftlite-portal.amazon.com/pick_zone/edit_redirect?id=1", "_self");
}else if((m == 14 && ((h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) ))){
    window.open("https://aftlite-portal.amazon.com/pick_zone/edit_redirect?id=1", "_self");
}else if((m == 31 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
    window.open("https://aftlite-portal.amazon.com/pick_zone/edit_redirect?id=5", "_self");
}else if((m == 44 && (h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20) )){
window.open("https://aftlite-portal.amazon.com/pick_zone/edit_redirect?id=5", "_self");
}else if((m == 1 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
window.open("https://aftlite-portal.amazon.com/pick_zone/edit_redirect?id=5", "_self");
}else(setInterval(function(){location.reload(); }, 60000))