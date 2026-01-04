// ==UserScript==
// @name         GetGift
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        http://www.aibjx.biz/plugin.php?id=levgift:levgift
// @include        http://www.aibjx.biz/plugin.php?id=dsu_paulsign:sign
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394557/GetGift.user.js
// @updateURL https://update.greasyfork.org/scripts/394557/GetGift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//setTimeout(gtgft(),10000);

    setTimeout(function(){document.getElementById("plevtime").click()},150000);

})();