// ==UserScript==
// @name         Printable Loop
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make Loop Pages printable
// @author       Lars Corneliussen
// @match        https://loop.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474333/Printable%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/474333/Printable%20Loop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalPrintStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = "@media only print {" + css + "}";
        head.appendChild(style);
    }

    addGlobalPrintStyle(".fui-Toolbar { display: none; }");
    addGlobalPrintStyle("#Sidebar { display: none; }");

    addGlobalPrintStyle("button { display: none!important; }");
    addGlobalPrintStyle("main>div:first-child { display: none; }");
    addGlobalPrintStyle(".___106fe2p { display: block; }");
    addGlobalPrintStyle("main { zoom: 0.8; position: inherit!important; }");
    addGlobalPrintStyle(".f10pi13n {position: inherit!important; }");
    addGlobalPrintStyle(".scriptor-pageFrame { max-width: 100%!important; margin: 0 0 0 0!important; }");
    addGlobalPrintStyle(".scriptor-canvas { overflow:visible!important; }");
    addGlobalPrintStyle("main { overflow:visible!important; }");
    addGlobalPrintStyle(".fui-FluentProvider>div:first-child>div:first-child { overflow-x:visible!important; }");
    addGlobalPrintStyle("div[role=button] { display: none; }");
    addGlobalPrintStyle("div[data-testid=AttributionButton] { display: block!important; }");
    addGlobalPrintStyle("div[data-testid=displayNameTextField] { display: block!important; }");
})();