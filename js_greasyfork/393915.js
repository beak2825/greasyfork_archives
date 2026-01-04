// ==UserScript==
// @name         AutoCaptcha
// @version      2.7
// @description  Auto generator for Heed.xyz
// @match        https://heedmoney.xyz/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require http://code.jquery.com/jquery-latest.js
// @run-at       document-body
// @namespace https://greasyfork.org/users/422116
// @downloadURL https://update.greasyfork.org/scripts/393915/AutoCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/393915/AutoCaptcha.meta.js
// ==/UserScript==


window.addEventListener("DOMContentLoaded", function() {

    var element = document.querySelector("#main > form");

    var a = document.querySelector("#cimg1 > img").src;
    var b = document.querySelector("#cimg2 > img").src;
    var c = document.querySelector("#cimg3 > img").src;

    var a1 = String(a).slice(36,37);
    var b1 = String(b).slice(36,37);
    var c1 = String(c).slice(36,37);

    var input = String(a1+b1+c1);
        document.querySelector("#main > form > div:nth-child(3) > input[type=text]").value = input;

    var but = document.querySelector("#main > form > div:nth-child(6) > input[type=button]");
        but.addEventListener ("click", function() {
           document.querySelector("#main > form > div:nth-child(3) > input[type=text]").value = input;
                window.location.reload();
    });

    but.click();
}, false);
