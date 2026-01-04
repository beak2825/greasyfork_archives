// ==UserScript==
// @name         YACD FontSize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整 YACD Proxies 页面的字体大小
// @author       YACD
// @match        http*://yacd.haishan.me/*
// @match        http*://*/luci-static/yacd/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/407965/YACD%20FontSize.user.js
// @updateURL https://update.greasyfork.org/scripts/407965/YACD%20FontSize.meta.js
// ==/UserScript==

(function() {
   'use strict';

  waitForKeyElements (
    "h2[class='_1p7G03ShKD']",
     function($h){$h.attr("style","font-size:1.1em;");}
  );



})();