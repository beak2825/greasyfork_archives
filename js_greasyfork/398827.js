// ==UserScript==
// @name         Smartschool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       jokkijr007
// @match        *://kate-sgr10.smartschool.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398827/Smartschool.user.js
// @updateURL https://update.greasyfork.org/scripts/398827/Smartschool.meta.js
// ==/UserScript==

var name = '?'


setInterval(function(){

if (document.getElementsByClassName('hlp-vert-box')[0].children[0].innerText == name){
    document.getElementsByClassName('js-btn-profile')[0].children[0].setAttribute('src', 'https://pluspng.com/img-png/random-png-image-mabel-s-sweater-creator-random-gnome-png-gravity-falls-wiki-fandom-powered-by-wikia-510.png')
    document.getElementsByClassName('topnav__menuitem topnav__menuitem--img')[0].children[0].setAttribute('src', 'https://pluspng.com/img-png/random-png-image-mabel-s-sweater-creator-random-gnome-png-gravity-falls-wiki-fandom-powered-by-wikia-510.png')
    document.getElementsByClassName('hlp-vert-box')[0].children[0].innerText = 'Kabouter'
    }




}, 100)

