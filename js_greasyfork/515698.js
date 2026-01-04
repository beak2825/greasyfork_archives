// ==UserScript==
// @name         deassify
// @namespace    http://tampermonkey.net/
// @version      2024-11-04-v2
// @description  make pwn.college not ass ugly
// @author       Sreehari Sreedev
// @match        https://pwn.college/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pwn.college
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/515698/deassify.user.js
// @updateURL https://update.greasyfork.org/scripts/515698/deassify.meta.js
// ==/UserScript==
// SPDX-License-Identifier: GPL-3.0-only

let createElem = (tagtype, options) => {
    var thing = document.createElement(tagtype);
    for (const [key, value] of Object.entries(options)) {
        thing.setAttribute(key, value);
    }
    return thing;
}

let stylesheet = `
body {
    background: #151515;
}
.navbar-brand, .nav-link, h1, h2, #syllabus h3, #syllabus h4, .navbar-pulldown {
    color: #80d8e0 !important;
}
.navbar-brand, .nav-link, body, p, h1, h2, h3, h4, td {
    font-family: "IBM Plex Mono", Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, monospace !important;
}
nav {
    border-bottom: 1px solid #80d8e0;
}
a {
  color: #ed478a;
  background-color:transparent
}
a:hover {
  color: hotpink;
}
`;

(function() {
    'use strict';

    let font1 = createElem("link", {"rel": "preconnect", "href": "https://fonts.googleapis.com", "crossorigin": ""});
    let font2 = createElem("link", {"rel": "preconnect", "href": "https://fonts.gstatic.com", "crossorigin": ""});
    let font3 = createElem("link", {"rel": "stylesheet", "href": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"});
    document.head.appendChild(font1);
    document.head.appendChild(font2);
    document.head.appendChild(font3);
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(stylesheet));
    document.head.appendChild(style);
    if (window.location.pathname == "/settings") {
        var sidelinks = document.querySelector(".nav,.flex-column,.nav-pills");
        var deassify_settings_link = createElem("a", {"id": "settings-deassify-tab", "class": "nav-link", "data-toggle": "pill", "href": "#deassify", "role": "tab"});
        deassify_settings_link.appendChild(document.createTextNode("Deassify"));
        sidelinks.appendChild(deassify_settings_link);

        var settings_body = document.querySelector("#v-pills-tabContent");
        var new_settings_page = createElem("div", {"id": "deassify", "class": "tab-fane fade", "role": "tabpanel"});
        new_settings_page.appendChild(document.createTextNode("hey lol"));
        settings_body.appendChild(new_settings_page);
    }
})();