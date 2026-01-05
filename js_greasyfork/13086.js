// ==UserScript==
// @name         Macapp.so Link
// @namespace   https://greasyfork.org/en/scripts/13086-macapp-so-link
// @version      0.11
// @description  Show baidu link for macapp.so
// @author       kk
// @match        http://www.macapp.so/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/13086/Macappso%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13086/Macappso%20Link.meta.js
// ==/UserScript==

'use strict';
$(setTimeout(function () {
        if (document.getElementById("code")) {
            var dl = document.getElementsByClassName("download")[0];
            var code = document.getElementById("code");
            code.style.color = "rgb(51,51,51)";
            code.style.lineHeight = "0";
            code.style.cursor = "text";
            var a = document.createElement('a');
            a.innerHTML = "Get App";
            var href = "/go" + window.location.pathname;
            a.setAttribute("href", href);
            a.setAttribute("target", "_blank");
            dl.insertBefore(a, code);
            code.removeAttribute("id")
        }
    }
    , 1000));




