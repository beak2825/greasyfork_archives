// ==UserScript==
// @name         DLD login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add click eventListener to login button!
// @author       Danta
// @match        https://ui.ptlogin2.qq.com/cgi-bin/login?appid=614038002&style=9&s_url=https%3A%2F%2Fdld.qzapp.z.qq.com%2Fqpet%2Fcgi-bin%2Fphonepk%3Fcmd%3Dindex%26channel%3D0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396959/DLD%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/396959/DLD%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("go").addEventListener("click", function(){pt.submitEvent()});
})();