// ==UserScript==
// @name         Prettier cs241
// @namespace    http://prilik.ca/
// @version      0.3
// @description  Makes the cs241 website look less terrible
// @author       Daniel Prilik
// @match        https://www.student.cs.uwaterloo.ca/~cs241/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23113/Prettier%20cs241.user.js
// @updateURL https://update.greasyfork.org/scripts/23113/Prettier%20cs241.meta.js
// ==/UserScript==

(function() {
    var head = document.head || document.getElementsByTagName('head')[0];

    // Add viewport for non-terrible scaling
    var metaTag = document.createElement('meta');
    metaTag.name = "viewport";
    metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";

    // Improved CSS
    var css = [
        "@import 'https://fonts.googleapis.com/css?family=Open+Sans|Roboto';",
        "",
        "body {",
        "    max-width: 800px;",
        "    padding: 20px;",
        "    margin: auto;",
        "    background-color: white;",
        "    font-family: \"Open sans\", sans-serif;",
        "    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);",
        "}",
        "p, li {",
        "    font-family: Roboto, serif;",
        "}",
        "",
        "a {",
        "    text-decoration: none;",
        "    color: #1565C0;",
        "}",
        "a:visited {",
        "    color: #673AB7;",
        "}",
        "",
        "h1 a, h2 a, h3 a, h4 a, h5 a {",
        "    color: black;",
        "}",
        "",
        "html {",
        "    background-color: #2196F3;",
        "}",
        "",
        "pre {",
        "    background-color: #ececec;",
        "    padding: 10px;",
        "    border-radius: 2px;",
        "    border-left: 3px solid #2196f3;",
        "}",
    ].join("\n");

    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));

    // Add all tags
    head.appendChild(style);
    head.appendChild(metaTag);
})();
