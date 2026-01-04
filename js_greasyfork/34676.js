// ==UserScript==
// @name More Nav on Github
// @namespace https://github.com/delta4d
// @version 0.0.1
// @license MIT License
// @match https://github.com/*
// @run-at document-end
// @grant none
// @description add more items on navbar
// @downloadURL https://update.greasyfork.org/scripts/34676/More%20Nav%20on%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/34676/More%20Nav%20on%20Github.meta.js
// ==/UserScript==

// jshint esversion: 6

'use strict';

var addNavItem = (() => {
    const nav = document.querySelector(".HeaderMenu").getElementsByTagName('ul')[3];
    const cls = nav.firstElementChild.firstElementChild.className; // ul > li > a

    return (desc, addr) => {
        let a = document.createElement("a");
        a.setAttribute("class", cls);
        a.setAttribute("href", addr);
        a.innerText = desc;

        let item = document.createElement("li");
        item.appendChild(a);
        
        nav.appendChild(item);
    };
})();

addNavItem("Stars", "/stars");
addNavItem("Settings", "/settings");
addNavItem("Discover", "/discover");
