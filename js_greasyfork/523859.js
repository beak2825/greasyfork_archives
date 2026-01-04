// ==UserScript==
// @name         Hírstart admin CSS módosító script
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  Egyszerű CSS módosítás egy adott domainen
// @author       Virág Attila
// @match        https://admin.hirstart.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523859/H%C3%ADrstart%20admin%20CSS%20m%C3%B3dos%C3%ADt%C3%B3%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/523859/H%C3%ADrstart%20admin%20CSS%20m%C3%B3dos%C3%ADt%C3%B3%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Itt adhatod meg a kívánt CSS módosításokat
    var css = `

    [name="before_head_end"], [name="script_after"] {
        height: 200px !important;
        width: 80% !important;
        font-size: 11px !important;
        font-family: monospace;
        color: #369;
        background: floralwhite !important;
    }

    [name="stopwords"], [name="keywords"] {
        height: 200px !important;
        font-size: 11px !important;
        font-family: monospace;
        color: #369;
        background: floralwhite !important;
    }

    [name="zonebox_content"] {
        font-size: 11px !important;
        font-family: monospace;
        color: #369;
        background: floralwhite !important;
    }

    [id="import-panel"] [id="import-tab4"] form {
        display: grid !important;
        grid-template-columns: 70% 20%;
        grid-auto-rows: min-content;
        gap: 5px 10px;
        align-items: start;
    }

    /* Az összes label és textarea alapértelmezett stílusai és a pozíciók felülírása */
    [id="import-panel"] [id="import-tab4"] label,
    [id="import-panel"] [id="import-tab4"] textarea {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        position: static !important;
        left: unset !important;
        top: unset !important;
    }

    [id="import-panel"] [id="import-tab4"] label {
        font-size: 12px;
        font-family: arial;
        font-weight: bold;
        color: #369;
        text-transform: uppercase;
        line-height: 1.5 !important;
    }

    [id="import-panel"] [id="import-tab4"] textarea {
        font-size: 11px !important;
        font-family: monospace;
        color: #369;
        resize: none !important;
        padding: 2px !important;
        background: floralwhite;
    }

    /* Title - keresés */
    [id="import-panel"] [id="import-tab4"] label:nth-child(1) {
        grid-column: 1;
        grid-row: 1;
    }

    [id="import-panel"] [id="import-tab4"] textarea:nth-child(2) {
        grid-column: 1;
        grid-row: 2;
        height: 200px !important;
    }

    /* Title - csere */
    [id="import-panel"] [id="import-tab4"] label:nth-child(3) {
        grid-column: 2;
        grid-row: 1;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(4) {
        grid-column: 2;
        grid-row: 2;
        height: 200px !important;
    }

    /* Lead - keresés */
    [id="import-panel"] [id="import-tab4"] label:nth-child(5) {
        grid-column: 1;
        grid-row: 3;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(6) {
        grid-column: 1;
        grid-row: 4;
        height: 200px !important;
    }

    /* Lead - csere */
    [id="import-panel"] [id="import-tab4"] label:nth-child(7) {
        grid-column: 2;
        grid-row: 3;
    }

    [id="import-panel"] [id="import-tab4"] textarea:nth-child(8) {
        grid-column: 2;
        grid-row: 4;
        height: 200px !important;
    }

    /* Pubdate - csere */
    [id="import-panel"] [id="import-tab4"] label:nth-child(9) {
        grid-column: 1;
        grid-row: 5;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(10) {
        grid-column: 1;
        grid-row: 6;
        height: 20px !important;
    }

    /* Pubdate - keresés */
    [id="import-panel"] [id="import-tab4"] label:nth-child(11) {
        grid-column: 2;
        grid-row: 5;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(12) {
        grid-column: 2;
        grid-row: 6;
        height: 20px !important;
    }

    /* Lastbuilddate - keresés */
    [id="import-panel"] [id="import-tab4"] label:nth-child(13) {
        grid-column: 1;
        grid-row: 7;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(14) {
        grid-column: 1;
        grid-row: 8;
        height: 20px !important;
    }

    /* Lastbuilddate - csere */
    [id="import-panel"] [id="import-tab4"] label:nth-child(15) {
        grid-column: 2;
        grid-row: 7;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(16) {
        grid-column: 2;
        grid-row: 8;
        height: 20px !important;
    }

    /* Link - keresés */
    [id="import-panel"] [id="import-tab4"] label:nth-child(17) {
        grid-column: 1;
        grid-row: 9;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(18) {
        grid-column: 1;
        grid-row: 10;
        height: 200px !important;
    }

    /* Link - csere */
    [id="import-panel"] [id="import-tab4"] label:nth-child(19) {
        grid-column: 2;
        grid-row: 9;
    }
    [id="import-panel"] [id="import-tab4"] textarea:nth-child(20) {
        grid-column: 2;
        grid-row: 10;
        height: 200px !important;
    }

    /* RSS partner 'Ez a doboz másolat' frame

    #ext-comp-2719 {
        height: 350px !important;
    }
    div#ext-gen1271 {
        height: 338px !important;
    }
    div#ext-gen1271 [class=" x-fieldset x-form-label-top"] {
        width: 31% !important;
        float: left !important;
    }

    /* Kategóriák */
    textarea#ext-comp-2826 {
        height: 400px !important;
    }

    `;

    // CSS alkalmazása az oldalra
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);


})();