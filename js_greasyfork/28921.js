// ==UserScript==
// @name         remove google "Roboto" font
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this script will remove google "Roboto" font, make web page more comfotable on eye
// @author       wuzhizhemu569@gmail.com
// @include      http://*
// @include      https://*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28921/remove%20google%20%22Roboto%22%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/28921/remove%20google%20%22Roboto%22%20font.meta.js
// ==/UserScript==

(function() {
    document.onreadystatechange = function () {
       if (document.readyState == "complete") {
           document.body.style.fontFamily = 'UILanguageFont,Arial,sans-serif';
       }
   };
})();