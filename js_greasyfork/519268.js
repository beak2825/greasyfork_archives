// ==UserScript==
// @name	          GBT dark mode (GBTDM)
// @description	      Makes GBT dark... (Quick and dirty, not perfect. And yes, it realy is THAT EASY...)
// @namespace         _pc
// @version           0.21
// @license           MIT
// @author            verydelight
// @icon              https://www.gayporntube.com/favicon.ico
// @match             *://www.gayboystube.com/*
// @match             *://www.gayporntube.com/*
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/519268/GBT%20dark%20mode%20%28GBTDM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519268/GBT%20dark%20mode%20%28GBTDM%29.meta.js
// ==/UserScript==
const darkModeStyles = `* {
background: #202124 !important;
border-color: #3c4043 !important;
color-scheme: dark !important;
color: #bdc1c6 !important;
transition: unset !important; }`;
const styleElement = document.createElement('style');
styleElement.textContent = darkModeStyles;
document.head.appendChild(styleElement);