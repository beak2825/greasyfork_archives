// ==UserScript==
// @name         Simplify Soho XI Documentation Navigation
// @namespace    https://soho.infor.com/*
// @version      0.1
// @description  Auto-expands components listing, reduced hierarchy to less tree levels
// @author       Gvarod
// @match        https://soho.infor.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24868/Simplify%20Soho%20XI%20Documentation%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/24868/Simplify%20Soho%20XI%20Documentation%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        console.log("Adding css");
        $($("html>head")).append(
            "<style type='text/css'>" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane>.accordion-header>button {" +
            "    display: none;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane>.accordion-header>button + a {" +
            "    font-size: 12px;" +
            "    width: 100%;" +
            "    padding: 0 0 0 17px;" +
            "    color: #CCC;" +
            "    cursor: default;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane>.accordion-header>button + a span {" +
            "    font-weight: bold;" +
            "    text-transform: uppercase;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons>.accordion-header {" +
            "    height: 18px;" +
            "    background-color: transparent;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons>.accordion-pane.has-icons>.accordion-header {" +
            "    height: 22px;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons>.accordion-pane.has-icons>.accordion-header>a {" +
            "    padding: 0;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons>.accordion-pane.has-icons>.accordion-header:before {" +
            "    padding-top: 0;" +
            "    padding-bottom: 0;" +
            "    padding-left: 36px;" +
            "}" +
            "html>body>nav#application-menu>.accordion.panel>.accordion-pane>.accordion-header {" +
            "    cursor: default;" +
            "}"+
            "</style>"
        );

        $("html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons").css("display","block").css("height","auto");
        $($("html>body>nav#application-menu>.accordion.panel>.accordion-pane.has-icons>.accordion-pane.has-icons")).css("display","block").css("height","auto");
    });
})();