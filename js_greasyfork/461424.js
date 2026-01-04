// ==UserScript==
// @name         Shoptet Adm+ [FrameStar] - Původní font
// @namespace    http://framestar.cz/
// @version      1.0
// @description  Nastaví původní font do administrace
// @author       FrameStar - Jiri Poucek
// @match        */admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461424/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20P%C5%AFvodn%C3%AD%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/461424/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20P%C5%AFvodn%C3%AD%20font.meta.js
// ==/UserScript==

$(document).ready(function () {
    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    $(document).ready(function(){
    var GF_links = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">
    `;

    var stylesheet = `
    <style>
    h1, h2, h3, h4, h5, h6,
    body,
    .shp-flag-name,
    .systemMessage__content h2, .systemMessage__content h3, .systemMessage__content h4, .systemMessage__content h5, .systemMessage__content h6,
    .shp-flag, .shp-flag-label,
    ul.token-input-list-facebook,
    div.token-input-dropdown-facebook,
    .chosen-container-single .chosen-search input[type="text"],
    .chosen-container-multi .chosen-choices li.search-field input[type="text"] {
        font-family: 'Open Sans', sans-serif !important;
    }

    h1, h2, h3, h4, h5, h6 {
        letter-spacing: normal;
    }
    </style>
    `;

    $(GF_links).appendTo("body");
    $(stylesheet).appendTo("body");
   });
})