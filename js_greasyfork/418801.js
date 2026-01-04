// ==UserScript==
// @name         Темная тема для русского филиала SCP Foundation
// @namespace    https://gist.github.com/MagicWinnie/280911518443073ded7588cf5df92d29
// @version      1.0
// @description  Автоматически активирует встроенную в scpfoundation.net темную тему
// @author       MagicWinnie
// @match        http://scpfoundation.net/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418801/%D0%A2%D0%B5%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%84%D0%B8%D0%BB%D0%B8%D0%B0%D0%BB%D0%B0%20SCP%20Foundation.user.js
// @updateURL https://update.greasyfork.org/scripts/418801/%D0%A2%D0%B5%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%84%D0%B8%D0%BB%D0%B8%D0%B0%D0%BB%D0%B0%20SCP%20Foundation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var darkThemeURL = "theme_fullname/theme:black";
    var res = window.location.href;

    if (res == "http://scpfoundation.net/" || res == "http://www.scpfoundation.net/")
        res += "main/";
    else if (res == "http://scpfoundation.net" || res == "http://www.scpfoundation.net")
        res += "/main/";

    if (!res.includes(darkThemeURL))
    {
        if (res.substr(res.length - 1) == '/')
            location.replace(res + darkThemeURL);
        else
            location.replace(res + '/' + darkThemeURL);
    }
})();