// ==UserScript==
// @name         QQ URL Unblocker
// @version      0.2
// @description  Understandable but f**k off (for QQ PC and QQNT)
// @author       Me
// @match        https://c.pc.qq.com/middle*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @namespace https://greasyfork.org/users/134691
// @downloadURL https://update.greasyfork.org/scripts/468024/QQ%20URL%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/468024/QQ%20URL%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = document.getElementById("url");
    if(!!url){
        window.location.replace(url.textContent);
    }
})();