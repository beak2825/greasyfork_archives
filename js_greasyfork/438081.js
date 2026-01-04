// ==UserScript==
// @name         Always select Ger-Sub
// @icon         https://www.google.com/s2/favicons?domain=aniworld.to
// @namespace    https://makaze.de
// @version      1.5
// @description  Just a simple script to always select Ger-Sub cause its annoying
// @author       IMakaze
//
// @include      *://anicloud.*/anime/stream/*
// @include      *://aniworld.*/anime/stream/*
//
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438081/Always%20select%20Ger-Sub.user.js
// @updateURL https://update.greasyfork.org/scripts/438081/Always%20select%20Ger-Sub.meta.js
// ==/UserScript==
document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        var dataLangKey3 = $("img[data-lang-key=3]").not(".selectedLanguage"); // dataLangKey
        if (dataLangKey3.length > 0) {
            dataLangKey3[0].click();
        }
    }
}