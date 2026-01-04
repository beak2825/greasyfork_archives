// ==UserScript==
// @name         remove e3new captcha
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  try to take over the world!
// @author       papago & Ming & frozenmouse
// @match        https://e3new.nctu.edu.tw/login/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386304/remove%20e3new%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/386304/remove%20e3new%20captcha.meta.js
// ==/UserScript==

document.getElementById("captcha-desktop").remove();
document.getElementsByClassName("LoginLang-vain")[0].remove();
document.getElementsByClassName("LoginText")[2].remove();
//document.getElementById("loginbtn").click();