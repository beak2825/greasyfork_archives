// ==UserScript==
// @name         VV881验证码移除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除VV881验证码
// @author       greasyblade
// @match        https://www.vv881.com/login.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374097/VV881%E9%AA%8C%E8%AF%81%E7%A0%81%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/374097/VV881%E9%AA%8C%E8%AF%81%E7%A0%81%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => {
        console.log("window.onload");
        if (document.getElementsByClassName("alignR").length > 2 && document.getElementsByClassName("alignR")[2] && document.getElementsByClassName("alignR")[2].parentElement) {
            console.log("remove");
            document.getElementsByClassName("alignR")[2].parentElement.remove()
        }
    };
    
})();