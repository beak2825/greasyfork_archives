// ==UserScript==
// @name         Applize Weibo Header
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add transluscent effect to Weibo's title bar (WB_global_nav).
// @author       duoduoeeee
// @match        https://*.weibo.com
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382949/Applize%20Weibo%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/382949/Applize%20Weibo%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var titleBar = document.getElementsByClassName("WB_global_nav_alpha")[0];
    var searchBar = document.getElemensByClassName("gn_search_v2")[0];
    titleBar.setAttribute("style", "-webkit-backdrop-filter: saturate(180%) blur(15px);backdrop-filter: saturate(180%) blur(20px);background-color: rgba(255, 255, 255, 0.7);");
    searchBar.setAttribute("style", "-webkit-backdrop-filter: saturate(180%) blur(15px);backdrop-filter: saturate(180%) blur(20px);background-color: rgba(255, 255, 255, 0.7);");
    console.log("Appled!!");
})();