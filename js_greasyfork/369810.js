// ==UserScript==
// @name         jwts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://jwts.hitsz.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369810/jwts.user.js
// @updateURL https://update.greasyfork.org/scripts/369810/jwts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("usercode").value="SZ170110322";
    document.getElementById("password").value="w895350975";
    document.getElementById("code").focus();
    //document.getElementById("yzmmsg").onclick = "changeValidateCode(this);document.getElementById('code').focus();";
    // Your code here...
})();