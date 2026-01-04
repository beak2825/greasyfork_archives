// ==UserScript==
// @name         Dark Theme for Official Minecraft Wiki
// @namespace    https://greasyfork.org/en/users/704811-wjatek
// @version      0.3.1
// @description  Dark theme for Official Minecraft Wiki - minecraft.fandom.com
// @author       wjatek
// @license      MIT
// @match        https://minecraft.fandom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416062/Dark%20Theme%20for%20Official%20Minecraft%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/416062/Dark%20Theme%20for%20Official%20Minecraft%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const styleEl = document.createElement('style')
    styleEl.innerText = `
        #content,
        #content .fp-section
        {
            background-color: #293033 !important;
        }

        #toc,
        #content .notaninfobox,
        #content .wikitable,
        #content .thumbinner
        {
            background-color: #313f4c !important;
        }

        #content .infobox-rows tr:nth-child(even) {
            background-color: #3f4c58 !important;
        }

        #content .wikitable > tr > th,
        #content .wikitable > * > tr > th,
        #content .loadbox-navbox,
        #catlinks,
        #content .navbox,
        #content .navbox th
        {
            background-color: #28333e !important;
        }

        #content .navbox table {
            background-color: #1f2831 !important;
        }

        #content .loadbox-navbox > p {
            background: none !important;
        }

        #content .msgbox {
            background: #696969 !important;
            border-width: 5px !important;
        }

        #content code {
            background: #131313 !important;
            border-color: #292929 !important;
        }

        #content .nbttree-inherited {
            background-color: #585858 !important;
            color: #cacaca !important;
        }

        #content p,
        #content h1,
        #content h2,
        #content h3,
        #content h4,
        #content h5,
        #content li,
        #content td,
        #content th,
        #content span,
        #content .thumbcaption,
        #content code,
        #content .hatnote,
        #content dd,
        #content dt
        {
            color: #cacaca !important;
        }

        #content td,
        #content .edition-box
        {
            box-shadow: inset 0px 0px 0px 500px rgba(0,0,0,0.5);
        }

        #content a {
            color: #4082bb !important;
        }

        #content .msgbox a,
        #content .edition-box a
        {
            color: #7eb7e8 !important;
        }
    `
    document.head.appendChild(styleEl)
})();