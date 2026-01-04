// ==UserScript==
// @name         Remove OGS (Online Go Server) Nav Logo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  if you would like to remove the OGS logo from your navigation bar while playing at the Online Go Server (OGS), then this script is for you.
// @author       You
// @match        https://online-go.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=online-go.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457990/Remove%20OGS%20%28Online%20Go%20Server%29%20Nav%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/457990/Remove%20OGS%20%28Online%20Go%20Server%29%20Nav%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const elementsArray = document.getElementsByClassName('ogs-nav-logo');


    [...elementsArray].forEach((element, index, array) => {
        console.log(element);
        element.remove();

    });
  
})();