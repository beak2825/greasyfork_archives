// ==UserScript==
// @name         Facebook new notification background changer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Change facebook new notifications background to something more visible
// @author       khaaytil
// @match        https://*www.facebook.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377413/Facebook%20new%20notification%20background%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/377413/Facebook%20new%20notification%20background%20changer.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = ".jewelItemNew ._33e {background-color: #c1d9ff !important;} \n";
document.getElementsByTagName("head")[0].appendChild(style);