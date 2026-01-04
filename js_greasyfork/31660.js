//Please subscribe to Shakatar (https://www.youtube.com/channel/UC6lbgL5LYO0f4-4DH8JNU4Q)
//Change "Username" and "Password"
// ==UserScript==
// @name         Neobux Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Un script pour te connecter automatiquement sur Neobux
// @author       Shakatar
// @match        https://www.neobux.com/m/l/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31660/Neobux%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/31660/Neobux%20Autologin.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.getElementById("Kf1").setAttribute("value","Username");
    document.getElementById("Kf2").setAttribute("value","Password");
    document.getElementById("botao_login").click();
})();