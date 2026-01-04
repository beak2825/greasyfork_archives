// ==UserScript==
// @name         LZT Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set custom background..
// @author       OSNINX
// @match        https://lolzteam.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393432/LZT%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/393432/LZT%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

       var url = "https://cdn-st4.rtr-vesti.ru/vh/pictures/hd/172/987/5.jpg";

       if(document.getElementsByClassName('navLink accountPopup NoPopupGadget')[0].innerText.replace(/\s+/g,'') == document.getElementsByClassName('page_name username')[0].innerText.replace(/\s+/g,'')) {
           document.getElementsByClassName('profilePage')[0].style= "opacity: .9;";
           document.body.style = "background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('" + url +"');background-size: 100%;background-position: center;background-attachment: fixed;background-repeat: no-repeat;";
       }
})();