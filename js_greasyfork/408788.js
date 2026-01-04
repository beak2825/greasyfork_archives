// ==UserScript==
// @name         Reader-Friendly React Native Docs
// @namespace    af-rndoc-cleanify
// @version      0.1
// @description  Save screen space on React Native Document for better reading experiences, as it should be.
// @author       Paranoid_AF
// @match        https://reactnative.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408788/Reader-Friendly%20React%20Native%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/408788/Reader-Friendly%20React%20Native%20Docs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Remove announcement.
    document.querySelector(".announcement").style.display = "none";
    document.querySelector(".headerWrapper.wrapper").style.paddingTop = "0";
    document.querySelector(".navPusher").style.paddingTop = "60px";
    document.querySelector(".docsNavContainer").style.top = "0";
    document.querySelector(".docsNavContainer").style.height = "100vh";
    // Add animations to nav bar
    document.querySelector(".fixedHeaderContainer").style.top = "0";
    document.querySelector(".fixedHeaderContainer").style.transition = "top .3s";
    // Hide nav bar when scroll down.
    var lastScroll = 0;
    window.addEventListener("DOMContentLoaded", function(e){
        lastScroll = window.scrollY;
    })
    document.addEventListener("scroll", function(e){
        if(lastScroll < window.scrollY){
           document.querySelector(".fixedHeaderContainer").style.top = "-60px";
        }else{
           document.querySelector(".fixedHeaderContainer").style.top = "0";
        }
        lastScroll = window.scrollY;
    });
})();