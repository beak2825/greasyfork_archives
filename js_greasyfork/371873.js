// ==UserScript==
// @name         Change Ambient Pick Settings in External Site
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Changes Ambient Bag Settings
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/pick_zone/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371873/Change%20Ambient%20Pick%20Settings%20in%20External%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/371873/Change%20Ambient%20Pick%20Settings%20in%20External%20Site.meta.js
// ==/UserScript==


var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if((m == 30 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
document.getElementById('pick_zone[orders_per_pick_group]').value= 5
document.getElementById('pick_zone[totes_per_pick_group]').value= 5
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else if((m == 20 && ((h ==7 || h == 9 || h == 11 || h == 13) ))){
document.getElementById('pick_zone[orders_per_pick_group]').value= 2
document.getElementById('pick_zone[totes_per_pick_group]').value= 2
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else if((m == 15 && ((h == 17 || h == 19) ))){
document.getElementById('pick_zone[orders_per_pick_group]').value= 3
document.getElementById('pick_zone[totes_per_pick_group]').value= 3
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else if((m == 32 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
document.getElementById('pick_zone[orders_per_pick_group]').value= 50
    document.getElementById('pick_zone[totes_per_pick_group]').value= 50
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else if((m == 45 && (h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20))){
document.getElementById('pick_zone[orders_per_pick_group]').value= 30
document.getElementById('pick_zone[totes_per_pick_group]').value= 30
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else if((m == 2 && (h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19) )){
document.getElementById('pick_zone[orders_per_pick_group]').value= 15
document.getElementById('pick_zone[totes_per_pick_group]').value= 15
Array.from(document.querySelectorAll('input[type="submit"]')).forEach(button=>button.click())
}else(setInterval(function(){location.reload(); }, 15000))