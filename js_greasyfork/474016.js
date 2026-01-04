// ==UserScript==
// @name         Fix HKG Top-right button in "newweb" interface
// @namespace    https://greasyfork.org/users/1006-peach
// @version      0.3
// @description  Just move notification box to Bottom-left to fix the Top-right button problem
// @homepageURL  https://greasyfork.org/users/1006-peach
// @author       Peach
// @match        https://forum.hkgolden.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474016/Fix%20HKG%20Top-right%20button%20in%20%22newweb%22%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/474016/Fix%20HKG%20Top-right%20button%20in%20%22newweb%22%20interface.meta.js
// ==/UserScript==

(function()
{
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(document.createElement('style')).appendChild(document.createTextNode('.MuiSnackbarContent-message>div>div{display:inline-block!important;padding-right:6px;}.MuiSnackbar-root{top:unset!important;right:unset!important;bottom:0px!important;left:0px!important;}.MuiSnackbarContent-root{padding:0px 16px!important;line-height:1!important;}'));
})();