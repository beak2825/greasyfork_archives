// ==UserScript==
// @name         BTN SAVE FIXED
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Xavi
// @match        https://gestionweb4.ikeasi.com/CustomPage/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407117/BTN%20SAVE%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/407117/BTN%20SAVE%20FIXED.meta.js
// ==/UserScript==


window.onload = function() {
     var save = document.querySelector("div.row div.col-xs-12 div.col-xs-4.margin-b-5.text-right");
     var lang = document.querySelectorAll("div.panel.box.box-primary div.box-body div.col-xs-12 div.nav-tabs-custom ul.nav.nav-tabs");
	save.style.cssText ='   position: fixed;    bottom: 5px;    right: 15px;    width: auto;    z-index: 100000;    padding: 10px !important;    border: 2px solid red;    background-color: rgb(255, 216, 222);    border-radius: 5px;   ';
	lang[1].style.cssText ='   position: fixed;    bottom: 5px;    left: 15px;    width: auto;    z-index: 100000;    padding: 10px !important;    border: 2px solid red;    background-color: rgb(255, 216, 222);    border-radius: 5px;   ';
};