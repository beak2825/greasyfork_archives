// ==UserScript==
// @name         51交付自动填充
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  51交付自动填充脚本
// @author       Yongligua
// @match        http://51jiaofu.com/Account/Login?ReturnUrl=%2F
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390967/51%E4%BA%A4%E4%BB%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/390967/51%E4%BA%A4%E4%BB%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {

    document.getElementsByName('UsernameOrEmailAddress')[0].value="11111111111";//Enter your username here
    document.getElementsByName('Password')[0].value="11111111";//Enter your password here
})();