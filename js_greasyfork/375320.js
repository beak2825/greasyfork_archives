// ==UserScript==
// @name         Amazon to libgen
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add link to libgen on all ebook products
// @author       Niks
// @include      https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375320/Amazon%20to%20libgen.user.js
// @updateURL https://update.greasyfork.org/scripts/375320/Amazon%20to%20libgen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var asin = document.getElementById("ASIN") || document.getElementsByName("ASIN.0")[0];
    if (asin) {

        var button = document.querySelector("div.a-button-stack");
        var name = document.querySelector("h1 > span#productTitle");
        name = encodeURI(name.innerText.replace(/ *\([^)]*\) */g, ""))

        var span1 = document.createElement("span");
        span1.setAttribute("class", "a-button a-button-normal a-button-base wl-info-aa_buying_options_button");

        var span2 = document.createElement("span");
        span2.setAttribute("class", "a-button-inner")

        span1.appendChild(span2);

        var a = document.createElement("a");
        a.setAttribute("href", "http://libgen.li/foreignfiction/index.php?s=" + name + "&f_lang=All&f_columns=0&f_ext=All&f_group=1");
        a.setAttribute("class", "a-button-text");
        a.setAttribute("target", "_blank");
        a.setAttribute("role", "button");
        a.appendChild(document.createTextNode("See on libgen"));

        span2.appendChild(a);

        button.appendChild(span1);
    }


})();