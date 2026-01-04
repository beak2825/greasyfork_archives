// ==UserScript==
// @name        remove right sidebar howtoforge.com
// @namespace   remove right sidebar howtoforge.com
// @match       https://forum.howtoforge.com/*
// @grant       none
// @version     1.0
// @author      lolo888
// @description 23/05/2024 13:42:32
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495869/remove%20right%20sidebar%20howtoforgecom.user.js
// @updateURL https://update.greasyfork.org/scripts/495869/remove%20right%20sidebar%20howtoforgecom.meta.js
// ==/UserScript==

const [head] = document.getElementsByTagName('head');
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.sidebar { display: none !important; }
.mainContainer { float: none; margin-right: -310px; width: unset; }`;
head.appendChild(style);