// ==UserScript==
// @name         Identi.li
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Muestra los links de identi.li
// @author       You
// @homepageURL    http://www.identi.li/
// @include        http://*.identi.li/topic/*
// @include        http://*.identi.li/index.php?topic=*
// @icon           http://i.imgbox.com/R0R84xlm.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24315/Identili.user.js
// @updateURL https://update.greasyfork.org/scripts/24315/Identili.meta.js
// ==/UserScript==

   javascript:document.write(GibberishAES.dec($('.info_bbc').html(),_decrypt.hash));