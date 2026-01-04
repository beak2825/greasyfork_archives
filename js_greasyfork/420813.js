// ==UserScript==
// @name         Ekşi Renklendir
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ekşi kullanıcıları renklendir
// @author       You
// @match        *://eksisozluk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420813/Ek%C5%9Fi%20Renklendir.user.js
// @updateURL https://update.greasyfork.org/scripts/420813/Ek%C5%9Fi%20Renklendir.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('a.entry-author').each(function(i, obj) {
      var colorR = Math.floor((Math.random() * 256));
      var colorG = Math.floor((Math.random() * 256));
      var colorB = Math.floor((Math.random() * 256));
        $(obj).css("color", "rgb(" + colorR + "," + colorG + "," + colorB + ")");
    });
})();