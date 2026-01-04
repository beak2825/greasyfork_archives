// ==UserScript==
// @name         Plesk Beautify
// @namespace    https://apstraccion.nl
// @version      0.2
// @description  Plesk menu color is not ok. This is for the better
// @author       Deinfreund
// @match        https://YOURDOMAIN.COM/*
// @icon         https://www.google.com/s2/favicons?domain=plesk.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436357/Plesk%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/436357/Plesk%20Beautify.meta.js
// ==/UserScript==

GM_addStyle(".pul-layout__sidebar-inner{background-color:#006dff!important}.page-sidebar-menu .sub-menu .active>a,.page-sidebar-menu .sub-menu .active>a:hover{background:rgba(0,0,0,0)!important}.page-sidebar-menu a:focus,.page-sidebar-menu a:hover,.page-sidebar-menu a:visited{outline:0;color:#fff;background:rgba(0,0,0,0)!important}");
