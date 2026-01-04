// ==UserScript==
// @name         Roblox Fixes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Small patches for Roblox website
// @author       lm3kn
// @match        https://www.roblox.com/*
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/500984/Roblox%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/500984/Roblox%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var icon = document.querySelector("link[rel~='icon']");
    icon.href = 'https://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico';

    var title = document.querySelector("head > title").innerHTML;
    title = title.replace('Roblox', 'ROBLOX');
    document.querySelector("head > title").innerHTML = title;
    title = title.replace('Charts', 'Games');
    document.querySelector("head > title").innerHTML = title;

    Array.from(document.getElementsByClassName("font-header-2 nav-menu-title text-header")).forEach(function(v){
          if(v.innerHTML.includes("Create")){
             v.innerHTML = "Develop";
           };
        if(v.innerHTML.includes("Robux")){
             v.innerHTML = "ROBUX";
           };
        if(v.innerHTML.includes("Charts")){
             v.innerHTML = "Games";
           };
        });
})();