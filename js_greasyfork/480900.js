// ==UserScript==
// @name         Увеличение размера текста для новелл на boosty
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Увеличивает размер текста для html тэга <article> с id postContent.
// @author       resursator
// @license      MIT
// @match        https://boosty.to/*/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boosty.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480900/%D0%A3%D0%B2%D0%B5%D0%BB%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%B5%D0%BB%D0%BB%20%D0%BD%D0%B0%20boosty.user.js
// @updateURL https://update.greasyfork.org/scripts/480900/%D0%A3%D0%B2%D0%B5%D0%BB%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BD%D0%BE%D0%B2%D0%B5%D0%BB%D0%BB%20%D0%BD%D0%B0%20boosty.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var article = document.querySelector("#postContent");
    if (article) {

        var elements = article.getElementsByTagName("div");

        for (var i = 0; i < elements.length; i++) {

            // Increase font size and line height
            elements[i].style.lineHeight = "42px";
            elements[i].style.fontSize = '34px';

            // Add padding to prevent overlapping of text in child elements
            elements[i].style.padding = '6px';
        }

        elements = article.getElementsByTagName("h1");

        for (i = 0; i < elements.length; i++) {

            // Increase font size and line height
            elements[i].style.lineHeight = "48px";
            elements[i].style.fontSize = '40px';

            // Add padding to prevent overlapping of text in child elements
            elements[i].style.padding = '6px';
        }
    }
})();