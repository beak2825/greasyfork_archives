// ==UserScript==
// @name         my roblox
// @namespace    https://tonydsoy.github.io/
// @supportURL   https://tonydsoy.github.io/jsstuff
// @version      1.0
// @description  small changes to create and charts text
// @author       tonydsoy
// @match        *://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525188/my%20roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/525188/my%20roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("header-develop-md-link").innerHTML = "Developer";
    document.querySelector('a[href="/catalog"]').innerHTML = "Catalog"
    document.querySelector('a[href="/charts"]').innerHTML = "Discover"
    if (window.location.href === "https://www.roblox.com/home") {
    document.querySelector('.container-header').remove()}
    if (window.location.href === "https://www.roblox.com/users/1563844617/profile") {
    document.querySelector(".header-title").innerHTML = "<h1>me"}
})();