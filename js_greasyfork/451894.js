// ==UserScript==
// @name         	Wikiwand Sidebar Hover
// @namespace      http://bisquick69.github.io/
// @version      	6.9
// @description  	ToC will expand when hovered over and collapsed when the mouse exits
// @author       	Bisquick (Bisquick69 on GitHub)
// @match        	https://www.wikiwand.com/*
// @icon         	https://staging.wikiwand.com/icons/icon-180x180.png
// @grant        	none
// @license 	MIT
// @downloadURL https://update.greasyfork.org/scripts/451894/Wikiwand%20Sidebar%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/451894/Wikiwand%20Sidebar%20Hover.meta.js
// ==/UserScript==

/* no idea what I'm doing really, feel free to make infinitely better and gooder and tremendous; the commented out part was an attempt to ensure ToC (table of contents) was in expanded state before shrinking but the first if statement filters out that possibility so it was ultimately pointless, but I left the class in there if anyone wants to use it for anything dope or something?! */
/* jshint esversion: 6 */

(function() {
    'use strict';
    const sideNav = document.querySelector("aside");
    const sideHeader = document.querySelector("header.desktop_header__IlHRl");
    const expandBtn = document.querySelector("div.desktop_toggler__zEeu3");
    sideNav.onmouseenter = e => {
        if (sideHeader.classList.contains("desktop_folded__6obNY")) {
            expandBtn.click();
        }
    };
    sideNav.onmouseleave = e => {
        // if (sideNav.classList.contains("desktop_shrunk__N5Ztm")) {
            expandBtn.click();
        // }
    };
})();