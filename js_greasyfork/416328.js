// ==UserScript==
// @name         studi.fr ajout de lien dans les menus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add link in menu
// @author       cadot.info
// @match        https://app.studi.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416328/studifr%20ajout%20de%20lien%20dans%20les%20menus.user.js
// @updateURL https://update.greasyfork.org/scripts/416328/studifr%20ajout%20de%20lien%20dans%20les%20menus.meta.js
// ==/UserScript==

(function() {

var check = setInterval(function() {
    var $ = window.jQuery;
   if ($('.nav-menu ul li').size()>2) {
$('.nav-menu ul').find('li').each(function(){
    console.log('ok')
    console.log($(this))
    $(this).append('<a href="'+$(this).attr('href')+'"> ->lien </a>')})

      clearInterval(check);
   }
}, 1000); // check every 100ms

})();

