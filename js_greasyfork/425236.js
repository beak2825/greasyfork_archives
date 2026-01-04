// ==UserScript==
// @name Free Auto Faucet
// @description Auto Faucet
// @author btcecia
// @version 1.0
// @namespace mailto:btcecia@outlook.be
// @match https://https://free-doge.com/free*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/425236/Free%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/425236/Free%20Auto%20Faucet.meta.js
// ==/UserScript==

const email = ""
const password = ""

const websites = [

    "https://free-doge.com/free",

]


setTimeout(function() {
    'use strict';

    // Automatic Login
    AutoLogin();

    // Roll when possible
    if (document.querySelector("div[class='roll-wrapper']").style.display !== "none") {
        document.querySelector("button[class='main-button-2 roll-button bg-2']").click()
        //AutoSwitch(); // Automatic page switching
    }
    //every 10 minutes the page will be refreshed to check if you can roll again
    setTimeout(function(){ location.reload(); }, 10*60*1000);

},2000);

// Autom Login
function AutoLogin() {
    var login_form = document.getElementsByClassName('login-wrapper wrapper bg-1');
    if (login_form.length == 1) {
        var inputs = login_form[0].getElementsByTagName("input");
        var button = login_form[0].getElementsByTagName("button")[0];
        inputs[1].value = email;
        inputs[2].value = password;
        button.click()
    }
}
