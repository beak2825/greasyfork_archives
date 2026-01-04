// ==UserScript==
// @name         Asurascans noMargin
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a noMargin button, useful when there are margin between pages
// @author       MissNook
// @match        https://www.asurascans.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444946/Asurascans%20noMargin.user.js
// @updateURL https://update.greasyfork.org/scripts/444946/Asurascans%20noMargin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var headerTab = document.getElementsByClassName("navlef")[0];
    if(headerTab)
        createButton(headerTab, toggleMargin);

    function createButton(context, func){
        var button = document.createElement("a");   
        button.appendChild(document.createTextNode("No Margin"));
        button.onclick = func;       
        button.style = "padding:5px 15px;border-radius: 20px;color: #fff;font-size: 13px;background: #0c70de;line-height: 25px;background: #913fe2;cursor:pointer;";
        context.appendChild(button);
    }

    function toggleMargin(context, func){
        var allPreloadingDivs = document.querySelectorAll('[data-ref="vm-preloader"]');
        var hideMargin = (this.textContent =="No Margin");
        this.textContent = hideMargin?"Margin":"No Margin";
        for(var i=0;i<allPreloadingDivs.length;i++){
            allPreloadingDivs[i].style.display=hideMargin?"none":"flex";
        }
        var ads = document.getElementsByTagName("pubguru");
        for(i =0;i<ads.length;i++){
            ads[i].style.display=hideMargin?"none":"block";
        }
    }
    
})();