// ==UserScript==
// @name         Pikabu Cats
// @namespace    http://pikabu.ru/
// @version      0.1
// @description  Меняем рекламу танков на котиков
// @author       UmnikOne
// @match        http://pikabu.ru/
// @grant        none
// @include http://pikabu.ru/*
// @downloadURL https://update.greasyfork.org/scripts/19104/Pikabu%20Cats.user.js
// @updateURL https://update.greasyfork.org/scripts/19104/Pikabu%20Cats.meta.js
// ==/UserScript==

(function() {
    'use strict';
function randomInteger(min, max) {
  var rand = min + Math.random() * (max - min);
  rand = Math.round(rand);
  return rand;
}
    document.getElementById("branding_ad_header").style.background= "url('http://pikabu.ru/images/header_bg_white.png') repeat-x 100% 0, url('http://umnik.one/pikabu/cats/"+ randomInteger(1, 8) +".png') no-repeat center";
    document.getElementById("branding_ad_header").style.backgroundcolor = "#000";
    document.getElementById("branding_ad_header").style.width = "100%";
    document.getElementById("branding_ad_header").style.height = "264px";
    document.getElementById("branding_ad_header").style.marginbottom = "-64px";
    document.getElementById("branding_ad_header").style.display = "block !important";
    document.getElementById("branding_ad_header").style.visibility = "visible !important";
    
    document.getElementById("branding_ad_comment").style.background= "url('http://umnik.one/pikabu/cats/mini/"+ randomInteger(1, 8) +".png')";
    document.getElementById("branding_ad_comment").style.backgroundcolor = "#000";
    document.getElementById("branding_ad_comment").style.width = "300px";
    document.getElementById("branding_ad_comment").style.height = "100px";
    document.getElementById("branding_ad_comment").style.borderbottom = "1px dashed";
    document.getElementById("branding_ad_comment").style.borderbottomcolor = "#777";
    document.getElementById("branding_ad_comment").style.display = "block !important";
    document.getElementById("branding_ad_comment").style.visibility = "visible !important";

})();