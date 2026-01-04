// ==UserScript==
// @name         Solvo Captcha
// @version      0.2
// @description  enter Captcha on ctsp-bronka
// @author       sanchespb
// @match        http://89.255.117.58/ctsp/Forms/Login.aspx
// @match        http://service.terminalspb.ru/ctsp/Forms/Login.aspx
// @match        https://service.port-bronka.com/fnx/Forms/LoginForm.aspx
// @match        https://service.port-bronka.com/fnx/Forms/Login.aspx
// @match        http://89.255.117.58/ctsp/Forms/LoginForm.aspx
// @match        http://service.terminalspb.ru/ctsp/Forms/LoginForm.aspx
// @grant        none
// @namespace https://greasyfork.org/users/379195
// @downloadURL https://update.greasyfork.org/scripts/404671/Solvo%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/404671/Solvo%20Captcha.meta.js
// ==/UserScript==

window.onload = function() {
    if(document.getElementById("Login1_abImg")){
        document.querySelector("#Login1_ab_ab").value =(window.atob(document.getElementById("Login1_abImg").src.split('=')[1])).match(/([\da-z]{3,4}).?$/mi)[1];

    }else{
        document.querySelector("#ab_ab").value =(window.atob(document.querySelector("#imgCaptcha").src.split('=')[1])).match(/([\da-z]{3,4}).?$/mi)[1];
    }
}