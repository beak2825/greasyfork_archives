// ==UserScript==
// @name         Malwr.com Auto Captcha
// @namespace    http://junookyo.blogspot.com/
// @version      1.0.0
// @description  Save your time by auto filling captcha input
// @author       Juno_okyo
// @match        https://malwr.com/submission/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13380/Malwrcom%20Auto%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/13380/Malwrcom%20Auto%20Captcha.meta.js
// ==/UserScript==

var a=document.getElementById("id_math_captcha_field");
a.value=eval(a.parentElement.textContent.split("=")[0]);